# Sentence classifier export

The shipped int8 export and inference source are included here.
[PROVENANCE.json](PROVENANCE.json) records byte sizes, SHA-256 hashes and the source revision.
Measured accuracy is in [README: How well it works](../README.md#how-well-it-works).

`classifier.mjs` and `tokenize.mjs` are the inference implementation.
`out/` is v2.3 (source revision `f86918b2`); it covers physical access, personal details,
internal economics, negotiation and remarks.
The current metadata selects `context_text`: previous sentence plus
current sentence, within a combined 128-token window. The browser worker
skips a whole semantic pass when its untruncated tokenizer input exceeds that window. Rules still
check the full admitted text.

`out/` contains the real `model.onnx`, `tokenizer.json` and `labels.json`. Builds copy these public
files to `dist/model/`. The base model is Ettin-17M; its upstream MIT license is served alongside
the runtime. The repository's Apache-2.0 license applies to Disclosure Gate source.

To recalibrate, fine-tune or retrain the model on your own mail, see [docs/ADAPTING.md](../docs/ADAPTING.md).
The pipeline is in [train/](train/README.md) and the v2.3 training data in [data/](data/README.md).
