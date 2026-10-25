# Adaptation pipeline

Recalibrate, fine-tune or retrain the sentence model on your own mail, then export, verify and ship
it. The guide is [docs/ADAPTING.md](../../docs/ADAPTING.md).

| Step | Script | Runs on |
| --- | --- | --- |
| Labeled emails to training sentences | `prepare.mjs` | Node |
| Fine-tune or retrain | `train.py` | Python (CUDA if present, else CPU) |
| int8 ONNX export in the shape of `model/out/` | `export.py` | Python |
| Thresholds from your ordinary mail | `calibrate.mjs` | Node |
| Check the export with the add-in's classifier | `verify.mjs` | Node |
| Labeled emails to held-out cases | `cases.mjs` | Node |
| Install into `model/out/` and `model/PROVENANCE.json` | `install.mjs` | Node |

`common.py` and `mail.mjs` are shared helpers; `probes.jsonl` is the fixed probe set `export.py` and
`verify.mjs` compare on; `example/` is a small synthetic data set; `requirements.txt` pins the Python
packages. The base checkpoint downloads into `.cache/` (ignored by Git).

For a runnable example without Python, use the guide's
[Node-only example](../../docs/ADAPTING.md#try-the-node-only-example). `verify.mjs` needs the
`reference.json` produced by Python's `export.py`; threshold recalibration does not create it.
Run a Node script without arguments to see its usage; Python scripts support `--help`.
