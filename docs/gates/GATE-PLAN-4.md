# Gate plan 4 (written 24 October 2026, before the `everyday5` author is started)

Question: does v2.3 (trained with the data4 round aimed at the misses and false asks seen on the
retired everyday4 set) catch more than the shipped v2.2 with thresholds D, without asking about more
ordinary mail than the bar allows?

**Single candidate.** The train23 checkpoint chosen by the train22 selection procedure (the reserved
calibration split only), with per-label thresholds fitted on all development ordinary mail
(calibration, everyday, everyday2, everyday3, everyday4, realistic, realistic2, realistic3) so that
about 5% of it would be questioned, as D was. Its thresholds and the development numbers are committed
before `everyday5` is scored. If train23 cannot produce a candidate (a data lane fails, or no recipe
beats v2.2 on the calibration split), there is no gate run and D stays.

**Gate set:** `everyday5` (300 ordinary, 60 disclosures, 12 each for physical access, personal details,
internal economics, negotiation position and remarks), written blind from SPEC.md by gpt-6-luna, a
model that wrote no training data and no earlier set. Product path at dg-email main 68ce98a2 or later.

**Runs:** the candidate and the shipped D, each scored once on `everyday5` at the same commit.

**Pass, all three:** at most 5% of ordinary emails questioned (15 of 300); at least 75% of disclosures
caught (45 of 60); and at least as many of the 60 caught as D catches on the same set. Pass ships the
candidate as the default model and thresholds. Fail keeps v2.2 with D. Either way both results are
published as measured, with per-category counts; the 49-incident replay is reported alongside and does
not decide. No change to the candidate, thresholds, set or bar after seeing either result.
