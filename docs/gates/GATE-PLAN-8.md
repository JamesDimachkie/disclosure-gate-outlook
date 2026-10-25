# Gate 8: read quoted history the recipients already saw more strictly (written 24 October 2026, before any result)

**Why.** On real mail v2.3 asks about one email in three, most needlessly. In the first Enron diagnostic,
about 60% of the sentences behind those asks were in quoted reply history, and reading only the
sender's own text would have asked about 18.5% of emails instead of 32%. Gates 6 and 7 showed that
retraining moves along the same catch-against-ask curve; this changes what the model is asked to read.
James, 24 Oct: cut the asks to a reasonable middle, but reply history can hold important disclosures.

**The change.** Quoted history counts as seen only when every outside recipient of this email is on a
quoted message's From, To or Cc (by address, or by a full display name); that message and everything
quoted under it reached them already. A forward to someone new, or a new person added to a reply,
makes nothing seen. Unseen history and the sender's own text are read exactly as now. The rules read
the whole email in every case. Detection is `core/history.mjs`.

**Candidates (same v2.3 model and thresholds).** Seen history read with every category threshold
multiplied by h ∈ {1 (today), 1.5, 2, 3, not read}, crossed with the sender's own text and unseen
history at multiplier o ∈ {1, 1.1, 1.25}: 15 settings.

**Choice, on development data only** (Enron half A calibration mailboxes: 1,080 emails, Claude
email-level disclosure labels and the 77 rated for seriousness, 28 serious): among the settings that
catch at least v2.3's development serious count minus one and at least 95% of v2.3's development
disclosures, take the one that asks about the fewest emails. Ties go to the larger h, then the smaller o.
The choice and its development numbers are committed before anything below is run.

**Test data reused, disclosed.** Enron half B (gate 6's 2,000) and `everyday7` were used to decide
gate 6; nothing here was chosen on them. They are reused once to confirm. Emails the candidate asks
about that gate 6's labelers did not label count as asked and not as caught.

**Ship only if all hold (otherwise v2.3 stays as it is):**
1. Enron B: asks about at most 80% as many emails as v2.3 (at most 560 of 2,000) and catches at least
   55 of the 61 serious disclosures v2.3 catches.
2. `everyday7`: catches at least 105 of 120 and questions at most 53 of 400.
3. Every serious disclosure v2.3 caught on B that the candidate misses is listed with its category
   and whether it sat in seen history.

**Reported, whatever it shows:** all of the above with 95% intervals, the full development table, and
v2.3 alongside.

## Choice (24 October 2026, development data only, before Enron B or `everyday7` was run)

Development set: 1,080 half-A calibration emails, 362 of them with history every outside recipient had
seen; 77 labeled disclosures, 28 rated serious.

| Seen history h | Other text o | Asked | Needless | Disclosures | Serious |
| --- | --- | --- | --- | --- | --- |
| 1 (v2.3 today) | 1 | 411 (38.1%) | 345 | 66 | 24 |
| 2 | 1.1 | 365 (33.8%) | 301 | 64 | 24 |
| **3** | **1.1** | **333 (30.8%)** | **270** | **63** | **24** |
| not read | 1 | 323 (29.9%) | 265 | 58 | 23 |
| not read | 1.25 | 292 (27.0%) | 237 | 55 | 23 |

Chosen by the rule above: h = 3, o = 1.1 (eligible: serious ≥ 23, disclosures ≥ 62.7). Full table:
`.qa/g8/dev-choice-v23.json` (local). The gain is smaller than the first diagnostic suggested, because
only history every outside recipient had already seen is read more strictly.

## Amendment (24 October 2026, before Enron B or `everyday7` was scored)

An independent review (a different model family, given the code and asked to break it) found 15 ways
the first detector wrongly counted history as seen: substring address matches, a name matching beside
someone else's address, a name split across two people, prose swallowed as a wrapped To: line, any name
in a "wrote:" line, and distribution lists. All are fixed and kept as tests; a recipient that can't be
checked now makes nothing seen, and with ">" quoting only the ">" lines count. The model's scores
don't depend on the detector, so the development choice was recomputed from the same capture with the
fixed detector and the same rule (333 emails with seen history):

| Seen history h | Other text o | Asked | Needless | Disclosures | Serious |
| --- | --- | --- | --- | --- | --- |
| 1 (v2.3 today) | 1 | 411 (38.1%) | 345 | 66 | 24 |
| **3** | **1.1** | **341 (31.6%)** | **278** | **63** | **24** |
| not read | 1 | 337 (31.2%) | 279 | 58 | 23 |

The choice is unchanged: h = 3, o = 1.1. Known limit, documented rather than fixed: plain text can't
show which lines under a quoted header the sender typed, so a comment written inside quoted history,
or new text added below it, is read as history (more strictly by the model; the rules as always).

## Outcome (25 October 2026): fail, v2.3 stays

| Enron B, 2,000 emails | Asked | 95% interval | Needless | Disclosures | Serious |
| --- | --- | --- | --- | --- | --- |
| v2.3 (gate 6) | 700 | | 559 | | 61 |
| Candidate h = 3, o = 1.1 | 596 (29.8%) | 27.8–31.8% | 458 | 136 | 58 |

Bar 1 fails (asks: 596, bar ≤ 560); the serious bar holds (58 ≥ 55). Recapturing v2.3 reproduced gate
6 within 2 emails (702 asked, 61 serious). Two emails the candidate asked about had no gate 6 label and
count as not caught. Serious disclosures the candidate missed: three, two in history the recipient had
been on (a personal remark, a family financial matter) and one in the sender's own text (staff losses,
lost to the 1.1 factor). `everyday7` was not run once bar 1 had failed. By the rule above, nothing ships.

The detector and the threshold factor are kept on the development branch `experiment/history-scale`, not in the product.
