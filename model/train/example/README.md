# Example adaptation data

A tiny, entirely synthetic example for [docs/ADAPTING.md](../../../docs/ADAPTING.md): Kestrel Ridge
Joinery, an invented cabinet-making firm, with invented staff and customers and no real mail. It is
big enough to run every step of the pipeline, not to train a model worth shipping.

Their mail has two habits the shipped model wasn't trained on: "markup" usually means comments drawn
on a drawing, not a price uplift, and they often tell customers where the keys to newly fitted
cabinets and lockers are. The firm has decided those handover notes are ordinary for them (SPEC.md
§5.1 would flag a hidden key), so they label them `none`.

| File | Lines | Use |
| --- | ---: | --- |
| `emails.jsonl` | 24 | Training emails: 12 disclosures (each with one flag), 12 ordinary |
| `sentences.jsonl` | 12 | Training contrast pairs: the firm's vocabulary with and without a disclosure |
| `ordinary.jsonl` | 30 | Ordinary outside mail for `calibrate.mjs`; never trained on |
| `heldout.jsonl` | 12 | Held-out evaluation for `cases.mjs` and `evaluation/heldout/run.mjs`: 6 disclosures, 6 ordinary; never trained or calibrated on |

Thirty ordinary emails are far too few for real thresholds (`calibrate.mjs` warns below 300): each
email moves the fitted rate by more than three points.

Run the [Node-only example](../../../docs/ADAPTING.md#try-the-node-only-example) from the repository
root after `npm ci`. The guide's other commands use `../adapt/` for your own data: to try training
with these fixtures, substitute `model/train/example/emails.jsonl` and
`model/train/example/sentences.jsonl` for those input paths, and
`model/train/example/ordinary.jsonl` for calibration. Keep outputs in `../adapt/`.
