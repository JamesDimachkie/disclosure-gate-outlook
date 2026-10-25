# Gate 6 candidate, frozen 24 October 2026 (before any scoring on Enron B or everyday7)

**Model.** v2.4 (`2.4.0`), run r2: fine-tuned from v2.3 with the public pipeline (`model/train/`) on
the published v2.3 sentences plus 3,460 real outside emails from the training mailboxes of Enron half A
(sentence labels by gpt-6.1-sol on every sentence v2.3 flagged or nearly flagged; 333 confident
disclosure sentences counted three times). Best epoch 2 of 3.
- `model.onnx` SHA-256 `4316b328d78edd470ccf02157242fce1ffc95f242458e4c84ae17db3843e8b95`
- `tokenizer.json` SHA-256 `9fd55248d51d33976b324fc11592e28071da7d41e0e9401dfb7082e30574b7b1`
- `labels.json` SHA-256 `50502e9213c17d5d771ceb88d8975b71246e72d787b59ca8471a6b070042cc67`

**Thresholds** (per category, the 98.5th percentile of the highest sentence score in each of the 1,003
emails Claude labeled ordinary in the half-A calibration mailboxes):
{"access": 0.0897, "personal": 0.7177, "economics": 0.0895, "negotiation": 0.1018, "remark": 0.6176}

**Rules** at dg-email `main` `f0626f85`, including today's real-mail rule additions (P/L figures,
"Pin #", "BK ID") and per-sentence admission.

**Development numbers** (half A calibration mailboxes, 1,080 real outside emails, Claude email-level
labels: 77 disclosures, 28 rated serious; rules included):

| | Asked | Needless | Serious caught | All disclosures caught |
| --- | ---: | ---: | ---: | ---: |
| v2.3 shipped | 37.6% | 31.6% | 24/28 | 65/77 |
| v2.3, thresholds scaled to ~10% asks | 10.6% | 6.9% | 17/28 | 40/77 |
| **v2.4 candidate** | **9.8%** | **6.5%** | **21/28** | **36/77** |

Retired synthetic sets (development, not blind): caught 378/420 (90.0%), questioned 52/1,838 (2.8%);
weakest on `everyday6a` (39/60; v2.3 49/60).

Rejected alternatives, all scored on the same development data: r1 (no real-mail positive weighting),
r3 (Claude-rechecked positives: no better), r4 (hard negatives only: 20/28 serious, everyday6b 51/60).
