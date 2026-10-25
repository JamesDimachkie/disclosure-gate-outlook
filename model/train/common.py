"""Shared pieces of the adaptation pipeline: labels, input format, the exportable wrapper, the
quantization grid, the pinned base checkpoint and rebuilding PyTorch weights from a shipped export."""
import hashlib
import json
import os
import pathlib
import sys
import urllib.request

os.environ.setdefault('TOKENIZERS_PARALLELISM', 'false')
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
LABELS = ['none', 'access', 'personal', 'economics', 'negotiation', 'remark']
MAX_LENGTH = 128
TEMPLATE = 'Previous sentence: {context}\nCurrent sentence: {text}'
BASE_ID = 'jhu-clsp/ettin-encoder-17m'
BASE_REVISION = '987607455c61e7a5bbc85f7758e0512ea6d0ae4c'
# SHA-256 of each file at the pinned revision; tokenizer.json is the file shipped in model/out/.
BASE_FILES = {
    'config.json': '7c1465b38440246b9147b4ce3eeafb17077d16537755e30c37a9e7a56fe53cdf',
    'tokenizer.json': '9fd55248d51d33976b324fc11592e28071da7d41e0e9401dfb7082e30574b7b1',
    'tokenizer_config.json': '3cd2017ff46d0a527e5d39cae39272eccfa1f19bb9f89b05d166aab2e38354e2',
    'special_tokens_map.json': 'ea97ecdbcc73713039d8d64dbb05e3689495c96657fbd9a18f5bed381be81049',
    'pytorch_model.bin': '52843bdbf8baf86dda5bdb6e1d19901d95ee9075ee80347b57b85394a4eef0fd',
}
DEFAULT_BASE_DIR = HERE / '.cache' / 'ettin-encoder-17m'
# Experimental: DG_BASE_SIZE=32m trains from the larger Ettin-32M base (pinned revision). Its file
# hashes are recorded on first download (trust on first use) until a 32M model ships.
if os.environ.get('DG_BASE_SIZE') == '32m':
    BASE_ID = 'jhu-clsp/ettin-encoder-32m'
    BASE_REVISION = '1b8ba06455dd44f80fc9c1ca9e22806157a57379'
    BASE_FILES = {name: None for name in BASE_FILES}
    DEFAULT_BASE_DIR = HERE / '.cache' / 'ettin-encoder-32m'


def sha256(path):
    digest = hashlib.sha256()
    with open(path, 'rb') as handle:
        for block in iter(lambda: handle.read(1 << 20), b''):
            digest.update(block)
    return digest.hexdigest()


def read_jsonl(path):
    return [json.loads(line) for line in pathlib.Path(path).read_text(encoding='utf-8-sig').splitlines() if line.strip()]


def write_json(path, value):
    pathlib.Path(path).write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')


def input_text(row):
    return TEMPLATE.format(context=row.get('context') or '', text=row['text'])


def fetch_base(directory=DEFAULT_BASE_DIR):
    """Download the public base checkpoint once, at the pinned revision, and check every file."""
    directory = pathlib.Path(directory)
    directory.mkdir(parents=True, exist_ok=True)
    for name, expected in BASE_FILES.items():
        path = directory / name
        if not path.exists():
            print(f'Downloading {BASE_ID}@{BASE_REVISION[:8]} {name}', flush=True)
            partial = path.with_suffix(path.suffix + '.part')
            urllib.request.urlretrieve(f'https://huggingface.co/{BASE_ID}/resolve/{BASE_REVISION}/{name}', partial)
            partial.replace(path)
        if expected is None:
            print(f'{name} SHA-256 {sha256(path)} (not pinned)', flush=True)
        elif sha256(path) != expected:
            raise SystemExit(f'{path} does not match the pinned base checkpoint; delete it and run again')
    return directory


def pick_device(name='auto'):
    import torch
    if name == 'auto':
        name = 'cuda' if torch.cuda.is_available() else 'cpu'
    if name == 'cpu':
        torch.set_num_threads(max(1, min(4, os.cpu_count() or 1)))
    return torch.device(name)


def warn_low_memory(minimum_gib=1.5):
    """Print a warning when less than `minimum_gib` of RAM is free (Windows and Linux only)."""
    free = None
    try:
        if sys.platform == 'win32':
            import ctypes

            class Memory(ctypes.Structure):
                _fields_ = [('length', ctypes.c_ulong), ('load', ctypes.c_ulong)] + [(n, ctypes.c_ulonglong) for n in
                            ['total', 'available', 'page_total', 'page_available', 'virtual_total', 'virtual_available', 'extended']]
            state = Memory()
            state.length = ctypes.sizeof(state)
            ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(state))
            free = state.available
        elif pathlib.Path('/proc/meminfo').exists():
            line = next(x for x in pathlib.Path('/proc/meminfo').read_text().splitlines() if x.startswith('MemAvailable:'))
            free = int(line.split()[1]) * 1024
    except Exception:
        return
    if free is not None and free < minimum_gib * 1024 ** 3:
        print(f'Warning: only {free / 1024 ** 3:.1f} GiB of RAM is free; close other programs if this fails.', flush=True)


def load_model(path, base_dir):
    """A six-class Ettin classifier from a checkpoint directory, or freshly headed from the base."""
    from transformers import AutoModelForSequenceClassification, logging
    # From the base, the classifier head is new by design; the load report would call it missing.
    logging.set_verbosity_error()
    return AutoModelForSequenceClassification.from_pretrained(
        str(path or base_dir), local_files_only=True, trust_remote_code=False, num_labels=6,
        attn_implementation='eager', classifier_dropout=.1,
        id2label=dict(enumerate(LABELS)), label2id={x: i for i, x in enumerate(LABELS)})


def make_exportable(model):
    """The graph the add-in runs: explicit attention masks, mean pooling, an explicit final MatMul."""
    import torch

    class Classifier(torch.nn.Module):
        def __init__(self):
            super().__init__()
            self.encoder = model

        def forward(self, input_ids, attention_mask):
            length = input_ids.shape[1]
            positions = torch.arange(length, device=input_ids.device)
            key_mask = attention_mask[:, None, None, :].bool()
            local = (positions[:, None] - positions[None, :]).abs() <= self.encoder.config.sliding_window
            full_mask = (~key_mask).to(torch.float32) * -10000.0
            local_mask = (~(key_mask & local[None, None])).to(torch.float32) * -10000.0
            hidden = self.encoder.model(input_ids=input_ids, attention_mask={
                'full_attention': full_mask, 'sliding_attention': local_mask}).last_hidden_state
            pooled = (hidden * attention_mask.unsqueeze(-1)).sum(1) / attention_mask.sum(1, keepdim=True)
            pooled = self.encoder.drop(self.encoder.head(pooled))
            # Explicit MatMul lets export quantize only the final decision's activations dynamically.
            return torch.matmul(pooled, self.encoder.classifier.weight.T) + self.encoder.classifier.bias
    return Classifier()


def quantization_grid(weight):
    """Per-output-channel symmetric int8 fake quantization: the grid export stores exactly."""
    import torch
    scale = (weight.detach().abs().amax(dim=1) / 127.0).clamp(min=1e-12)
    return torch.fake_quantize_per_channel_affine(weight, scale, torch.zeros_like(scale, dtype=torch.int32),
                                                 axis=0, quant_min=-127, quant_max=127)


def enable_qat(model):
    """Train every Linear and Embedding on the int8 grid, so the int8 export is the trained model."""
    import torch
    from torch.nn.utils import parametrize

    class Grid(torch.nn.Module):
        def forward(self, weight):
            return quantization_grid(weight)
    for module in model.modules():
        if isinstance(module, (torch.nn.Linear, torch.nn.Embedding)):
            parametrize.register_parametrization(module, 'weight', Grid())


def qat_state(model):
    """A plain state dict with every parametrized weight already on its int8 grid."""
    suffix = '.parametrizations.weight.original'
    return {(name.replace(suffix, '.weight')): (quantization_grid(value) if name.endswith(suffix) else value)
            for name, value in model.state_dict().items()}


def load_onnx_weights(model, onnx_path):
    """Rebuild a model's weights from an export made by export.py (the shipped model/out/ included).

    Training was quantization-aware, so the int8 values times their scales are the trained weights.
    Norm weights and the classifier bias are stored by name; the int8 MatMul weights are matched to
    the model's Linear layers in the order the graph uses them (the forward order)."""
    import numpy as np
    import onnx
    import torch
    from onnx import numpy_helper
    graph = onnx.load(str(onnx_path)).graph
    tensors = {item.name: numpy_helper.to_array(item) for item in graph.initializer}
    state, used = {}, set()
    for name, value in tensors.items():
        if name.startswith('encoder.') and not name.endswith(('_q', '_scale', '_axis')):
            state[name[len('encoder.'):]] = torch.from_numpy(value.copy())
            used.add(name)
    embedding = 'encoder.model.embeddings.tok_embeddings.weight_rowint8'
    q, scale = tensors[embedding + '_q'], tensors[embedding + '_scale']
    state['model.embeddings.tok_embeddings.weight'] = torch.from_numpy(q.astype(np.float32) * scale[:, None])
    used |= {embedding + '_q', embedding + '_scale', embedding + '_axis'}
    order = []
    for node in graph.node:
        for name in node.input:
            if name.endswith('_weightonly_q') and name not in order:
                order.append(name)
    linears = []
    for i in range(model.config.num_hidden_layers):
        linears += [f'model.layers.{i}.attn.Wqkv.weight', f'model.layers.{i}.attn.Wo.weight',
                    f'model.layers.{i}.mlp.Wi.weight', f'model.layers.{i}.mlp.Wo.weight']
    linears += ['head.dense.weight', 'classifier.weight']
    if len(order) != len(linears):
        raise ValueError(f'{onnx_path}: expected {len(linears)} quantized weights, found {len(order)}')
    for name, key in zip(linears, order):
        prefix = key[:-len('_q')]
        q, scale = tensors[key], tensors[prefix + '_scale']
        # The final projection is stored as uint8 with zero point 128.
        values = (q.astype(np.float32) - (128 if q.dtype == np.uint8 else 0)) * scale
        state[name] = torch.from_numpy(np.ascontiguousarray(values.T))
        used |= {key, prefix + '_scale'}
    expected = {name for name, _ in model.named_parameters()}
    if set(state) != expected:
        raise ValueError(f'{onnx_path}: weights do not match the model ({sorted(set(state) ^ expected)[:5]})')
    for name, value in state.items():
        if tuple(value.shape) != tuple(model.get_parameter(name).shape):
            raise ValueError(f'{onnx_path}: {name} has shape {tuple(value.shape)}')
    model.load_state_dict(state, strict=False)
    return model
