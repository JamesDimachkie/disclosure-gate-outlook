"""Export a trained checkpoint in the shape model/out/ uses: int8 model.onnx, tokenizer.json,
labels.json, LICENSE and NOTICE in --out, plus reference.json (PyTorch scores on the fixed probe
set) in --run for verify.mjs. Thresholds are copied from --thresholds-from until calibrate.mjs
replaces them.

  python model/train/export.py --run work/run --out work/export
"""
import argparse
import json
import pathlib
import shutil

import common


def quantize(fp32, destination):
    """int8 weights with fp32 encoder activations; dynamic per-sentence uint8 on the final projection.

    ModernBERT's gated MLP output has large activation outliers, so quantizing those activations
    destroys fidelity: their weights are stored as per-output-channel int8 and dequantized on use.
    Only the normalized final decision projection quantizes its activations, one sentence at a time."""
    import numpy as np
    import onnx
    from onnx import helper, numpy_helper
    graph = onnx.load(str(fp32))
    initializers = {item.name: item for item in graph.graph.initializer}
    replacements, additions, removed = [], [], set()
    for node in graph.graph.node:
        if node.op_type == 'Gather' and node.input[0] in initializers:
            old = initializers[node.input[0]]
            weights = numpy_helper.to_array(old)
            if weights.ndim == 2 and weights.dtype == np.float32:
                # ORT's dynamic Gather quantization uses one global scale; per-token scales keep the QAT grid.
                scale = np.maximum(np.abs(weights).max(axis=1) / 127.0, 1e-12).astype(np.float32)
                packed = np.clip(np.round(weights / scale[:, None]), -127, 127).astype(np.int8)
                prefix = old.name + '_rowint8'
                additions += [numpy_helper.from_array(packed, prefix + '_q'), numpy_helper.from_array(scale, prefix + '_scale'),
                              numpy_helper.from_array(np.asarray([-1], dtype=np.int64), prefix + '_axis')]
                replacements += [
                    helper.make_node('Gather', [prefix + '_q', node.input[1]], [prefix + '_selected'], axis=0),
                    helper.make_node('Cast', [prefix + '_selected'], [prefix + '_float'], to=onnx.TensorProto.FLOAT),
                    helper.make_node('Gather', [prefix + '_scale', node.input[1]], [prefix + '_scales'], axis=0),
                    helper.make_node('Unsqueeze', [prefix + '_scales', prefix + '_axis'], [prefix + '_expanded']),
                    helper.make_node('Mul', [prefix + '_float', prefix + '_expanded'], list(node.output))]
                removed.add(old.name)
                continue
        if node.op_type == 'MatMul' and node.input[1] in initializers:
            old = initializers[node.input[1]]
            weights = numpy_helper.to_array(old)
            if weights.ndim != 2 or weights.dtype != np.float32:
                replacements.append(node)
                continue
            prefix = old.name + '_weightonly'
            scale = np.maximum(np.abs(weights).max(axis=0) / 127.0, 1e-12).astype(np.float32)
            if node.name == '/MatMul':
                # The wrapper's final projection. Activation scale is per row, so one email's sentences
                # never change another's scores.
                packed = (np.clip(np.round(weights / scale), -127, 127) + 128).astype(np.uint8)
                values = {'_q': packed, '_scale': scale, '_zero': np.asarray(128, dtype=np.uint8),
                          '_eps': np.asarray(1e-12, dtype=np.float32), '_range': np.asarray(127, dtype=np.float32),
                          '_offset': np.asarray(128, dtype=np.float32), '_min': np.asarray(1, dtype=np.float32),
                          '_max': np.asarray(255, dtype=np.float32)}
                additions += [numpy_helper.from_array(value, prefix + key) for key, value in values.items()]
                p = prefix
                replacements += [
                    helper.make_node('Abs', [node.input[0]], [p + '_abs']),
                    helper.make_node('ReduceMax', [p + '_abs'], [p + '_rowmax'], axes=[1], keepdims=1),
                    helper.make_node('Max', [p + '_rowmax', p + '_eps'], [p + '_maxabs']),
                    helper.make_node('Div', [p + '_maxabs', p + '_range'], [p + '_ascale']),
                    helper.make_node('Div', [node.input[0], p + '_ascale'], [p + '_scaled']),
                    helper.make_node('Round', [p + '_scaled'], [p + '_rounded']),
                    helper.make_node('Add', [p + '_rounded', p + '_offset'], [p + '_offsetted']),
                    helper.make_node('Clip', [p + '_offsetted', p + '_min', p + '_max'], [p + '_clipped']),
                    helper.make_node('Cast', [p + '_clipped'], [p + '_aquant'], to=onnx.TensorProto.UINT8),
                    helper.make_node('MatMulInteger', [p + '_aquant', p + '_q', p + '_zero', p + '_zero'], [p + '_integer']),
                    helper.make_node('Cast', [p + '_integer'], [p + '_float'], to=onnx.TensorProto.FLOAT),
                    helper.make_node('Mul', [p + '_float', p + '_ascale'], [p + '_rowfloat']),
                    helper.make_node('Mul', [p + '_rowfloat', p + '_scale'], list(node.output))]
                removed.add(old.name)
                continue
            packed = np.clip(np.round(weights / scale), -127, 127).astype(np.int8)
            additions += [numpy_helper.from_array(packed, prefix + '_q'), numpy_helper.from_array(scale, prefix + '_scale')]
            # DequantizeLinear->MatMul would be rewritten by ORT into an approximate kernel; Cast/Mul keeps the grid.
            replacements += [
                helper.make_node('Cast', [prefix + '_q'], [prefix + '_cast'], name=prefix + '_cast', to=onnx.TensorProto.FLOAT),
                helper.make_node('Mul', [prefix + '_cast', prefix + '_scale'], [prefix + '_float'], name=prefix + '_dequantize')]
            node.input[1] = prefix + '_float'
            removed.add(old.name)
        replacements.append(node)
    kept = [item for item in graph.graph.initializer if item.name not in removed]
    del graph.graph.initializer[:]
    graph.graph.initializer.extend(kept + additions)
    del graph.graph.node[:]
    graph.graph.node.extend(replacements)
    assert sum(node.op_type == 'MatMulInteger' for node in graph.graph.node) == 1, 'final projection not found'
    onnx.save(graph, str(destination))


def softmax(logits):
    import numpy as np
    values = np.asarray(logits, dtype=np.float64)
    values = np.exp(values - values.max(axis=1, keepdims=True))
    return values / values.sum(axis=1, keepdims=True)


def main(args):
    import numpy as np
    import onnx
    import onnxruntime as ort
    import torch
    from transformers import AutoTokenizer
    common.warn_low_memory()
    run, out = pathlib.Path(args.run), pathlib.Path(args.out)
    report = json.loads((run / 'report.json').read_text(encoding='utf-8'))
    base = common.fetch_base(args.base_dir)
    out.mkdir(parents=True, exist_ok=True)
    tokenizer = AutoTokenizer.from_pretrained(str(base), local_files_only=True, trust_remote_code=False)
    model = common.load_model(run / 'checkpoint', base)
    wrapper = common.make_exportable(model).eval()
    probes = common.read_jsonl(args.probes)
    dummy = tokenizer([common.input_text(r) for r in probes[:2]], return_tensors='pt', padding=True,
                      truncation=True, max_length=common.MAX_LENGTH)
    fp32 = run / 'model.fp32.onnx'
    torch.onnx.export(wrapper, (dummy['input_ids'], dummy['attention_mask']), str(fp32),
        input_names=['input_ids', 'attention_mask'], output_names=['logits'],
        dynamic_axes={'input_ids': {0: 'batch', 1: 'sequence'}, 'attention_mask': {0: 'batch', 1: 'sequence'}, 'logits': {0: 'batch'}},
        opset_version=17, dynamo=False, do_constant_folding=True)
    onnx.checker.check_model(str(fp32))
    quantize(fp32, out / 'model.onnx')
    onnx.checker.check_model(str(out / 'model.onnx'))
    options = ort.SessionOptions()
    options.intra_op_num_threads = options.inter_op_num_threads = 1
    sessions = {name: ort.InferenceSession(str(path), options, providers=['CPUExecutionProvider'])
                for name, path in [('fp32', fp32), ('int8', out / 'model.onnx')]}
    logits, ids = {name: [] for name in ['torch', 'fp32', 'int8']}, []
    for start in range(0, len(probes), 16):
        text = [common.input_text(r) for r in probes[start:start + 16]]
        ids += tokenizer(text, truncation=True, max_length=common.MAX_LENGTH, padding=False)['input_ids']
        encoded = tokenizer(text, padding=True, truncation=True, max_length=common.MAX_LENGTH, return_tensors='np')
        feeds = {k: encoded[k] for k in ['input_ids', 'attention_mask']}
        for name, session in sessions.items():
            logits[name].extend(session.run(None, feeds)[0])
        with torch.inference_mode():
            logits['torch'].extend(wrapper(**{k: torch.from_numpy(v) for k, v in feeds.items()}).numpy())
    probs = {k: softmax(v) for k, v in logits.items()}
    fidelity = {'torch_fp32_onnx_max_abs_probability': float(np.abs(probs['torch'] - probs['fp32']).max()),
                'torch_int8_max_abs_probability': float(np.abs(probs['torch'] - probs['int8']).max()),
                'argmax_agreement': float(np.mean(probs['torch'].argmax(1) == probs['int8'].argmax(1)))}
    print(json.dumps({'fidelity': fidelity}), flush=True)
    if fidelity['torch_fp32_onnx_max_abs_probability'] >= 1e-4 or fidelity['torch_int8_max_abs_probability'] >= .05:
        raise SystemExit('The ONNX export does not reproduce the PyTorch model; do not ship it')
    previous = json.loads(pathlib.Path(args.thresholds_from).read_text(encoding='utf-8'))
    metadata = {'version': args.version, 'base_model': common.BASE_ID, 'base_revision': common.BASE_REVISION,
        'labels': common.LABELS, 'thresholds': previous['thresholds'],
        'calibration': {'temperature': 1, 'none_logit_bias': 0}, 'input': 'context_text', 'max_length': common.MAX_LENGTH,
        'input_template': common.TEMPLATE,
        'quantization': 'int8 weights and embeddings; fp32 encoder activations; per-sentence dynamic uint8 final projection',
        'training': {'init': report['init'], 'init_onnx_sha256': report['init_onnx_sha256'], 'seed': report['seed'],
                     'epochs': report['epochs'], 'selected_epoch': report['selected_epoch'],
                     'sentence_input_sha256': report['data']['sha256'],
                     'validation_sha256': (report['val'] or {}).get('sha256')},
        'calibration_data': {'method': f'not calibrated: thresholds copied from {pathlib.Path(args.thresholds_from).name}; '
                             'run model/train/calibrate.mjs on your own ordinary mail before shipping'}}
    common.write_json(out / 'labels.json', metadata)
    shutil.copyfile(base / 'tokenizer.json', out / 'tokenizer.json')
    shutil.copyfile(common.ROOT / 'model/out/LICENSE', out / 'LICENSE')
    (out / 'NOTICE').write_text(
        f'Ettin encoder 17m\nBase: https://huggingface.co/{common.BASE_ID}\nRevision: {common.BASE_REVISION}\n'
        'License: MIT; see LICENSE.\nUpstream license source: '
        'https://raw.githubusercontent.com/jhu-clsp/ettin-encoder-vs-decoder/main/LICENSE\n\n'
        'Modified for Disclosure Gate: six-class sequence classifier, fine-tuned by the deploying organization;\n'
        'quantization-aware int8 weights/embeddings, fp32 encoder activations, per-sentence dynamic uint8 final projection.\n'
        'No upstream endorsement is implied.\n', encoding='utf-8', newline='\n')
    reference = {'probes_sha256': common.sha256(args.probes), 'model_sha256': common.sha256(out / 'model.onnx'),
                 'items': [{'text': r['text'], 'context': r.get('context') or '', 'token_ids': ids[i],
                            'torch': probs['torch'][i].round(6).tolist(), 'int8': probs['int8'][i].round(6).tolist()}
                           for i, r in enumerate(probes)]}
    (run / 'reference.json').write_text(json.dumps(reference) + '\n', encoding='utf-8', newline='\n')
    common.write_json(run / 'export.json', {'out': str(out), 'fidelity': fidelity, 'onnx': onnx.__version__,
        'onnxruntime': ort.__version__, 'torch': torch.__version__,
        'artifacts': {p.name: {'bytes': p.stat().st_size, 'sha256': common.sha256(p)} for p in sorted(out.iterdir()) if p.is_file()}})
    print(json.dumps({'exported': str(out), 'reference': str(run / 'reference.json')}), flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--run', required=True, help='run directory written by train.py')
    parser.add_argument('--out', required=True, help='export directory (same files as model/out/)')
    parser.add_argument('--probes', default=str(common.HERE / 'probes.jsonl'), help='fixed probe sentences')
    parser.add_argument('--thresholds-from', default=str(common.ROOT / 'model/out/labels.json'),
                        help='labels.json whose thresholds are carried until calibrate.mjs runs')
    parser.add_argument('--version', default='2.3.0-adapted', help='version recorded in labels.json')
    parser.add_argument('--base-dir', default=str(common.DEFAULT_BASE_DIR))
    main(parser.parse_args())
