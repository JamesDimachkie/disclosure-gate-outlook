"""Fine-tune the sentence classifier, from the shipped weights or from the base Ettin-17M checkpoint.

The recipe is the one that produced v2.3: quantization-aware training on the int8 grid, square-root
class weights, label smoothing 0.05, AdamW with a faster head, 10% warmup and a linear decay.

  python model/train/train.py --data work/train.jsonl --val work/val.jsonl --out work/run
"""
import argparse
import collections
import json
import pathlib
import random
import time

import common


def email_key(rows, probs, margin=.001):
    """Validation score: emails caught when thresholds question none of the ordinary validation emails."""
    import numpy as np
    ordinary = np.array([r.get('kind') == 'ordinary' for r in rows])
    if not ordinary.any():
        return None
    thresholds = probs[ordinary, 1:].max(axis=0) + margin
    flagged = (probs[:, 1:] >= thresholds).any(axis=1)
    disclosure = collections.defaultdict(bool)
    for row, flag in zip(rows, flagged):
        if row.get('kind') == 'disclosure':
            disclosure[row['email']] |= bool(flag and row['label'] != 'none')
    return {'caught_emails': sum(disclosure.values()), 'disclosure_emails': len(disclosure),
            'thresholds': dict(zip(common.LABELS[1:], thresholds.round(4).tolist()))}


def main(args):
    import numpy as np
    import torch
    from transformers import AutoTokenizer
    common.warn_low_memory()
    device = common.pick_device(args.device)
    train = common.read_jsonl(args.data)
    val = common.read_jsonl(args.val) if args.val else []
    for row in train + val:
        if row.get('label') not in common.LABELS or not isinstance(row.get('text'), str):
            raise SystemExit(f'Every row needs text and one of the labels {common.LABELS}: {json.dumps(row)[:120]}')
    overlap = {r['text'].strip() for r in train} & {r['text'].strip() for r in val}
    if overlap:
        raise SystemExit(f'{len(overlap)} validation sentences also appear in the training data')
    out = pathlib.Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    base = common.fetch_base(args.base_dir)
    random.seed(args.seed)
    np.random.seed(args.seed)
    torch.manual_seed(args.seed)
    torch.cuda.manual_seed_all(args.seed)
    tokenizer = AutoTokenizer.from_pretrained(str(base), local_files_only=True, trust_remote_code=False)
    model = common.load_model(None, base)
    if args.init == 'shipped':
        common.load_onnx_weights(model, args.onnx)
    common.enable_qat(model)
    wrapper = common.make_exportable(model).to(device)
    encode = lambda rows: tokenizer([common.input_text(r) for r in rows], truncation=True,
                                    max_length=common.MAX_LENGTH, padding=False)['input_ids']
    encoded = {'train': encode(train), 'val': encode(val) if val else []}

    def batch(split, indices):
        ids = [encoded[split][int(i)] for i in indices]
        length = max(map(len, ids))
        return {'input_ids': torch.tensor([x + [tokenizer.pad_token_id] * (length - len(x)) for x in ids], device=device),
                'attention_mask': torch.tensor([[1] * len(x) + [0] * (length - len(x)) for x in ids], device=device)}

    counts = collections.Counter(r['label'] for r in train)
    weights = torch.tensor([(len(train) / (6 * counts[x])) ** .5 if counts[x] else 1. for x in common.LABELS], device=device)
    criterion = torch.nn.CrossEntropyLoss(weight=weights, label_smoothing=.05)
    backbone = [p for n, p in wrapper.named_parameters() if n.startswith('encoder.model.')]
    head = [p for n, p in wrapper.named_parameters() if not n.startswith('encoder.model.')]
    optimizer = torch.optim.AdamW([{'params': backbone, 'lr': args.lr}, {'params': head, 'lr': args.head_lr}], weight_decay=.01)
    steps = max(1, args.epochs * ((len(train) + args.batch - 1) // args.batch))
    scheduler = torch.optim.lr_scheduler.LambdaLR(optimizer,
        lambda step: min(1., (step + 1) / max(1, int(steps * .1))) * max(.1, 1 - step / steps))
    targets_val = torch.tensor([common.LABELS.index(r['label']) for r in val], device=device) if val else None
    history, best, start = [], None, time.time()
    if args.epochs == 0:
        # No training: save the starting weights, e.g. to check the rebuild from the shipped export.
        best = ((0,), 0)
        model.save_pretrained(out / 'checkpoint', safe_serialization=True, state_dict=common.qat_state(model))
    for epoch in range(1, args.epochs + 1):
        wrapper.train()
        order = np.random.permutation(len(train))
        total = 0.
        for offset in range(0, len(order), args.batch):
            indices = order[offset:offset + args.batch]
            targets = torch.tensor([common.LABELS.index(train[i]['label']) for i in indices], device=device)
            optimizer.zero_grad(set_to_none=True)
            loss = criterion(wrapper(**batch('train', indices)), targets)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(wrapper.parameters(), 1.)
            optimizer.step()
            scheduler.step()
            total += loss.item() * len(indices)
        entry = {'epoch': epoch, 'train_loss': total / len(train), 'elapsed_seconds': round(time.time() - start, 1)}
        if val:
            wrapper.eval()
            with torch.inference_mode():
                logits = torch.cat([wrapper(**batch('val', range(i, min(i + args.batch, len(val)))))
                                    for i in range(0, len(val), args.batch)])
                entry['val_loss'] = torch.nn.functional.cross_entropy(logits, targets_val).item()
                probs = torch.softmax(logits.double(), dim=1).cpu().numpy()
            entry['val'] = email_key(val, probs)
        history.append(entry)
        print(json.dumps(entry), flush=True)
        # Keep the epoch that catches the most validation disclosures at zero validation questions,
        # then the lowest validation loss; without validation data, keep the last epoch.
        key = ((entry['val'] or {}).get('caught_emails', 0), -entry['val_loss']) if val else (epoch,)
        if best is None or key > best[0]:
            best = (key, epoch)
            model.save_pretrained(out / 'checkpoint', safe_serialization=True, state_dict=common.qat_state(model))
    report = {'init': args.init, 'init_onnx': str(args.onnx) if args.init == 'shipped' else None,
              'init_onnx_sha256': common.sha256(args.onnx) if args.init == 'shipped' else None,
              'base_model': common.BASE_ID, 'base_revision': common.BASE_REVISION,
              'data': {'path': str(args.data), 'sha256': common.sha256(args.data), 'sentences': len(train),
                       'labels': dict(counts)},
              'val': {'path': str(args.val), 'sha256': common.sha256(args.val), 'sentences': len(val)} if val else None,
              'seed': args.seed, 'epochs': args.epochs, 'batch': args.batch, 'lr': args.lr, 'head_lr': args.head_lr,
              'qat': True, 'label_smoothing': .05, 'class_weights': weights.tolist(), 'max_length': common.MAX_LENGTH,
              'device': str(device), 'torch': torch.__version__, 'selected_epoch': best[1], 'history': history,
              'seconds': round(time.time() - start, 1)}
    common.write_json(out / 'report.json', report)
    print(json.dumps({'finished': str(out), 'selected_epoch': best[1], 'seconds': report['seconds']}), flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--data', required=True, help='training sentences from prepare.mjs')
    parser.add_argument('--val', help='validation sentences from prepare.mjs (selects the epoch)')
    parser.add_argument('--out', required=True, help='run directory; the checkpoint goes in <out>/checkpoint')
    parser.add_argument('--init', choices=['shipped', 'base'], default='shipped',
                        help='start from the shipped weights (default) or from the base Ettin-17M checkpoint')
    parser.add_argument('--onnx', default=str(common.ROOT / 'model/out/model.onnx'), help='export to start from with --init shipped')
    parser.add_argument('--base-dir', default=str(common.DEFAULT_BASE_DIR), help='where the base checkpoint is downloaded')
    parser.add_argument('--epochs', type=int, default=2, help='0 saves the starting weights untrained')
    parser.add_argument('--batch', type=int, default=32)
    parser.add_argument('--lr', type=float, default=5e-5, help='encoder learning rate')
    parser.add_argument('--head-lr', type=float, default=3e-4, help='head and classifier learning rate')
    parser.add_argument('--seed', type=int, default=42)
    parser.add_argument('--device', default='auto', help='auto (CUDA when available), cuda or cpu')
    main(parser.parse_args())
