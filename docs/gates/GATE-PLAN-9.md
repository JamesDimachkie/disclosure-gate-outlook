# Gate 9: a calmer setting judged on serious disclosures, on fresh real mail (written 25 October 2026, before the sample is drawn)

**Why.** Gate 8 failed its ask bar but showed where the asks come from: mostly the model's reading of
what the sender wrote, not reply history. On the development mailboxes, reading the sender's own text
more strictly trades minor disclosures for far fewer asks while keeping the serious ones. The product
stance (James, 24 Oct): minor disclosures may slip; serious ones must not. Gate 8's choice rule also
protected minor disclosures, which ruled those settings out. This gate states the rule James set.

**Disclosed:** this rule was written after seeing gate 8's development table, so the development numbers
below are not a test. The test is the fresh sample.

**Candidate (same v2.3 model and thresholds, `core/history.mjs` as in gate 8).** Quoted history every
outside recipient was already on is read with thresholds ×3; everything else ×o. Rule, on the
development mailboxes only: the largest o in {1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3} that catches every
serious development disclosure v2.3 catches (24 of 28). That is o = 2: 246 of 1,080 asked (22.8%)
against v2.3's 411 (38.1%); 56 of 77 disclosures against 66; serious 24 against 24.

**Fresh test data.** Half B emails never used before: not in gate 6's 2,000, not in the first diagnostic's
3,000; shuffled with seed 20261025, at most 50 per mailbox, 2,000 emails, drawn and recorded
(Message-IDs) before either system is run on them. Labels: every email v2.3 or the candidate asks about,
plus 300 neither asks about, shuffled so labelers can't tell which system asked, labeled by Claude
labelers with gate 6's brief unchanged.

**Ship only if all hold (otherwise v2.3 stays as it is):**
1. Fresh sample: the candidate asks about at most 75% as many emails as v2.3.
2. Fresh sample: the candidate catches at least 90% of the serious disclosures v2.3 catches.
3. `everyday7`: the candidate catches at least 96 of 120 and questions at most 53 of 400.
4. Every serious disclosure v2.3 catches and the candidate misses is listed with its category.

**Reported, whatever it shows:** all of the above with 95% intervals, needless asks, all disclosures
caught, and v2.3 alongside.

## Amendment (25 October 2026, before the fresh sample is scored or labeled)

Multiplying thresholds by 2 or 3 pushes negotiation's (0.64) above 1, which silently switches the
model's negotiation reading off everywhere; a setting should make the model stricter, never blind to a
category. Thresholds are therefore capped at 0.9 (never lowered): every category can still be flagged
when the model is very sure. The development set holds a single negotiation disclosure, so this is a
design rule, not a tuning result. Candidate: history ×3, everything else ×2, capped at 0.9. Development:
255 of 1,080 asked (23.6%), 57 of 77 disclosures, 24 of 28 serious (v2.3: 411, 66, 24).

## Outcome (25 October 2026): fail, v2.3 stays

Fresh sample: 2,000 half-B emails from 71 mailboxes, none used before; 936 labeled (every email either
system asked about, 636, plus 300 neither asked about), by three Claude labelers blind to which system
asked.

| Fresh sample, 2,000 emails | Asked | 95% interval | Needless | Disclosures | Serious |
| --- | --- | --- | --- | --- | --- |
| v2.3 | 636 (31.8%) | 29.8–33.9% | 518 (25.9%) | 118 | 40 |
| Candidate | 362 (18.1%) | 16.5–19.9% | 269 (13.5%) | 93 | 34 |
| Rules alone | 47 (2.4%) | 1.8–3.1% | 26 | 21 | 12 |

In the 300 emails neither asked about, labelers found 6 disclosures, 4 serious: about 18 more serious
disclosures estimated among the 1,364 emails no system asked about.

| Bar | Result |
| --- | --- |
| 1. Asks at most 75% of v2.3's (≤ 477) | Pass: 362 |
| 2. Serious at least 90% of v2.3's (≥ 36) | **Fail: 34** |
| 3. `everyday7`: catches ≥ 96 of 120, questions ≤ 53 of 400 | **Fail: 95 of 120**; questions 28 |

Serious disclosures v2.3 caught and the candidate missed: six (an access detail, three personal details,
an internal cost, a remark). On `everyday7` the candidate lost 13 of v2.3's catches: 5 negotiation, 3
secrets, 3 economics, 2 remarks. Reading the sender's own text twice as strictly costs real catches,
not only minor ones, so nothing ships. The experiment's code (`core/history.mjs`, the per-sentence
threshold factor) is kept on the development branch `experiment/history-scale`, not in the product.

v2.3 on this fresh sample replicates gate 6: it asked about 31.8% of emails (gate 6: 35%) and caught 40
serious disclosures against the rules' 12 (gate 6: 61 against 19).
