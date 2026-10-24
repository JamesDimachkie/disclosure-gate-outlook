# v2.2 gate plan (written 24 October 2026, before any gate result)

Two candidates, each run once on each gate set through `evaluation/heldout/run.mjs --semantic`
(the product path: rules plus model, Send-time splitting and spill check):

- **A: v2.1 recalibrated.** The shipped v2.1 17M weights; thresholds re-fit with zero needless questions
  over 272 ordinary emails (the retired `everyday` tier plus v2.1's reserved calibration emails):
  access 0.9788, personal 0.8874, economics 0.9092, negotiation 0.7474, remark 0.9294.
- **B: v2.2.** The 17M recipe chosen by `train22` checkpoint selection on its own calibration split
  (392 ordinary and 96 disclosure emails; zero needless questions by construction), exported to int8 and
  re-fit on int8 scores. Chosen before any gate run.

Gate sets, never used for training, calibration or selection:

- `everyday2`: 300 ordinary and 60 disclosure emails, written blind by claude-fable-5-1 (24 Oct).
- `realistic3`: 240 ordinary and 60 disclosure emails, written by gpt-6.1-sol (23 Oct); used once before,
  to gate v2.1 (not tuned on since).

Pass, on **each** set separately: no more than 1% of ordinary emails stopped (at most 3 of 300; at most 2
of 240), and at least half the disclosure emails stopped.

Decision: if both pass, ship the one with more disclosures caught over both sets (a tie goes to B) as
the default-on model. If one passes, ship it. If neither passes, the model stays off by default and the
results are published as measured. No threshold, data or code change after seeing gate results; any
later change needs a new unseen set.
