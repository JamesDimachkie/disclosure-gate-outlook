# Sentence classifier export

Exact source and real int8 export copied from `../dg-email-model/model` on `lane/model`.
`PROVENANCE.json` records byte sizes, SHA-256 hashes and the source checkout HEAD. No evaluation
data was copied or inspected. Measured accuracy is in [README: How well it works](../README.md#how-well-it-works).

`classifier.mjs` and `tokenize.mjs` are supplied by the model lane. Their source is unchanged.
`out/` is v2.2 (lane/model 8b402d6b: `train22/runs/17m-pairs` weights, `train22/candidates/c` thresholds); it covers all five categories.
The current metadata selects `context_text`: previous sentence plus
current sentence, within a combined 128-token window. The browser worker
skips a whole semantic pass when its untruncated tokenizer input exceeds that window. Rules still
check the full admitted text.

`out/` contains the real `model.onnx`, `tokenizer.json` and `labels.json`. Builds copy these public
files to `dist/model/`. The base model is Ettin-17M; its upstream MIT licence is served alongside
the runtime. The repository's Apache-2.0 licence applies to Disclosure Gate source.
