# Gate plan 3 (written 24 October 2026, before `everyday4` exists)

James, 24 Oct: catching anything potentially risky or damaging matters more than an extra "are you
sure?" the sender can click through. The shipped thresholds (candidate C) were fitted for zero questions
on 872 ordinary emails.

**Single candidate D.** v2.2 weights unchanged; thresholds in candidates/d/labels.json, chosen on all
development ordinary mail (calibration, everyday2, realistic, realistic2, everyday3, realistic3: 1,412
emails) so that about 5% of it would be questioned (4.9% fitted). On the development sets, product path:
258/280 disclosures caught, 31/1,040 ordinary questioned (3.0%), against C's roughly two in three.

**Gate set:** `everyday4` (300 ordinary, 60 disclosures, written blind by claude-sonnet-5-5).
Product path at main 2dbf51be or later (rules including the records, greeting and internal checks).

**Pass:** at most 5% of ordinary emails questioned (15 of 300) and at least 75% of disclosures stopped
(45 of 60). Pass ships D as the default thresholds. Fail keeps C, and the result is published as
measured. One run; no change after seeing it.
