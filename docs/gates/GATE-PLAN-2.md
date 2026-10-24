# v2.2 gate plan 2 (written 24 October 2026, before `everyday3` exists)

The first gate (GATE-PLAN.md) failed both candidates. B (v2.2) stopped 4/300 ordinary on everyday2; two
were phrase rules, since fixed (dg-email 29fe8e5d). everyday2, realistic2 and realistic are now retired
to development.

**Single candidate C.** The v2.2 17M weights unchanged (runs/17m-pairs, model.onnx SHA-256 as B), with
thresholds re-fit on int8 scores for zero flags over 872 ordinary outside emails: the 392 reserved
calibration emails plus the outside-only ordinary emails of the retired tiers everyday2, realistic2 and
realistic. Thresholds in candidates/c/labels.json: access 0.6965, personal 0.9250, economics 0.9407,
negotiation 0.9606, remark 0.8800. Development catches (not independent of calibration for the ordinary
side): realistic2 33/60, realistic 39/40, everyday2 45/60; reserved calibration disclosures 76/96.

**Gate sets:** `everyday3` (300 ordinary, 60 disclosures, written blind by gpt-6-astra, 24 Oct) and
`realistic3` (240 ordinary, 60 disclosures; never used to tune; C is a new configuration).

**Pass**, on each set separately, product path (rules on main 29fe8e5d or later plus the model): no more
than 1% of ordinary emails stopped (at most 3 of 300, at most 2 of 240) and at least half the disclosure
emails stopped. Reported alongside: stops attributable to the model alone.

**Decision:** pass on both sets turns the model on by default (IT can still switch it off). Otherwise it
stays off and the results are published as measured. One run; no changes after seeing the results.
