# Capability check 5 (written 24 October 2026, before either `everyday6` author starts)

James, 24 Oct: `everyday5` was too easy to tell the models apart (rules alone 29/60; v2.2 and v2.3 both
60/60). Before the public release is promoted, measure the shipped v2.3 on a harder blind set.

**Set `everyday6`:** two halves by two authors of different families who wrote no training data:
claude-fable-5-1 (`everyday6a`) and gpt-6-luna (`everyday6b`). Each half has 200 ordinary outside
emails and 60 disclosures (12 each for physical access, personal details, internal economics,
negotiation position and remarks): 400 and 120 in all. The brief asks for difficulty from SPEC.md
alone: implicit and indirect wording, disclosures inside long threads and quoted history, numbers
without keywords, and half the ordinary mail close to a boundary the SPEC draws.

**Label audit before scoring:** each half is read by the other author's family against SPEC.md, case by
case, without seeing any model or rule output. Cases the auditor disputes and the author does not
concede are dropped from both counts. No model, rule or checker runs on the set before the audit is
committed.

**Runs, once each, at dg-email main e0afc74b or later:** v2.3 (shipped), v2.2 with D, rules alone.

**Reported, whatever it shows:** caught and questioned with 95% Wilson intervals, per category and per
author; rules-only catch rate as the set's difficulty (everyday4: 14/60, everyday5: 29/60).

**Release claim:** the public numbers stay if v2.3 catches at least 75% of the disclosures and questions
at most 5% of the ordinary mail. Otherwise the README and landing page lead with `everyday6`'s numbers
and say what it misses, and a v2.4 round is opened. No change to v2.3, its thresholds or the set after
any score is seen.
