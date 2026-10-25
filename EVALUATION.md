# Evaluation

How the accuracy figures in the README were produced, including the attempts that failed. The short
version: every decision to ship a model setting was made on a test set written blind by a model that
wrote none of the training data, against a pass bar fixed in a commit before anyone deciding had seen that set or any score on it,
and run once.

## The two numbers that matter

For an add-in that interrupts Send, two rates decide whether it is worth installing:

- **Caught:** of emails that disclose something sensitive, how many it stops to ask about.
- **Asked needlessly:** of ordinary outside emails, how many it questions anyway.

Every set below has both kinds. An email counts as caught if the add-in raises any finding on it; a
question on an ordinary email counts against it whatever the reason.

## How the test sets were made

All test emails are synthetic: invented people, companies, addresses and numbers, `.example` and
`.test` domains, nothing real. Each set was written by one AI model working only from `SPEC.md` (the
product contract) and the case format, with written rules:

- Test authors never read the rules, the model, its training data, or any other test set.
- Rule and training-data authors never read a test set.
- A set is frozen (its SHA-256 recorded) before anything is scored on it.
- After a set has been used to make a decision, it is retired to development and never decides again.

| Set | Author | Ordinary | Disclosures | Role |
| --- | --- | ---: | ---: | --- |
| probe | gpt-6.1-sol | 264 | 164 | Rule coverage, near-misses (retired) |
| realistic | gpt-6-astra | 100 | 40 | Long threads, attachments (retired) |
| realistic2 | gpt-6.1-sol | 100 | 60 | Meaning-based disclosures (retired) |
| realistic3 | gpt-6.1-sol | 240 | 60 | Gate for v2.1 and v2.2 (retired) |
| everyday | claude-opus-5-5 | 200 | 0 | Everyday outside mail (retired) |
| everyday2 | claude-fable-5-1 | 300 | 60 | Gate 1 (retired) |
| everyday3 | gpt-6-astra | 300 | 60 | Gate 2 (retired) |
| everyday4 | claude-sonnet-5-5 | 300 | 60 | Gate 3 (retired) |
| everyday5 | gpt-6-luna | 300 | 60 | Gate 4 (retired) |
| everyday6a | claude-fable-5-1 | 198 | 60 | Check 5, hard (retired) |
| everyday6b | gpt-6-luna | 200 | 60 | Check 5, hard (retired) |

The training data for the sentence model came from separate authors: two rounds of
whole labeled emails by Claude Opus 5.5 and GPT-6.1 Sol (1,320 emails), plus 1,000 contrastive pairs
(a disclosing sentence and a near-identical one that is not).

## History

**Rules only.** On `realistic2`, written to vary its wording, the phrase rules caught 7 of 60
meaning-based disclosures. Rules are reliable for anything with a checkable shape (keys, card numbers,
IDs, lookalike domains) and weak at meaning. That gap is why there is a model.

**v2 and v2.1 (failed).** The first sentence models caught far more (v2.1: 48 of 60 on `realistic3`),
but on everyday mail by a different author v2.1 questioned 20 of 200, reacting to words like
"surgery", "booster" or "puncture" in harmless sentences. It shipped off by default. Diagnosis: 25 to 60
disclosing sentences per category taught shortcuts, and thresholds were fitted on only 72 ordinary
emails.

**v2.2, gate 1 (failed).** More and broader training data with contrastive pairs. On the blind
`everyday2`: 48 of 60 caught, 4 of 300 questioned, against a pre-registered bar of at most 3. Two of
those four were phrase rules, not the model ("Weekdays are a nightmare", read as an insult; "make sure
the side gate is unlocked for the van", read as a security gap); both rules were fixed.

**v2.2, gate 2 (passed, shipped on).** Same weights, thresholds re-fitted for zero questions on 872
outside ordinary emails from retired sets. Blind `everyday3`: 42 of 60 caught, 0 of 300 questioned;
`realistic3`: 38 of 60, 0 of 240. The model went on by default.

**v2.2, gate 3 (passed).** The author decided that catching anything potentially damaging
matters more than an extra "are you sure?" the sender can click through. Thresholds were re-chosen on
development mail for about 5% questioned, and the bar committed before the set was seen: at most 5%
questioned and at least 75% caught. Blind `everyday4`: **50 of 60 caught, 12 of 300 questioned (4%)**.
On the same set the previous thresholds caught 42 and rules alone 14.

**v2.3, gate 4 (passed, current).** A third data round aimed at what v2.2 missed or questioned on
`everyday4` (costs written as plain numbers, terse negotiation, physical access in words, care
settings, belittling remarks; and animals, named things, customer-facing money and pleasantries that
must stay quiet): 800 contrastive pairs, 600 hard negatives and 240 emails from two authors. The plan
was committed before the set's author started, and the candidate, its thresholds and its development
numbers before the set was scored. Blind `everyday5`: **60 of 60 caught, 2 of 300 questioned**. The
set did not separate the models: v2.2 with the same thresholds procedure also caught 60, with 1
question; rules alone caught 29. It passed the bar (at most 5% questioned, at least 75% caught, and
at least as many caught as v2.2), so v2.3 shipped, but the evidence that it catches more than v2.2
is the development sets (342 of 350 against 318), which shaped it and so flatter it.

**v2.3, capability check 5 (passed).** Because `everyday5` could not tell the models apart, a harder
set was written before the release was promoted: two halves by authors from different companies who
wrote no training data (Claude Fable 5.1 and GPT-6 Luna), each with 60 disclosures (12 per category)
and 200 ordinary outside emails, made hard from SPEC.md alone: disclosures implied rather than stated,
buried in long emails or quoted history, given as numbers without labels, or in casual and regional
English; half the ordinary mail sits just on the safe side of a line the spec draws. Before anything
was scored, each half's labels were audited case by case by a model from the other company. The audit
of the Luna half disputed none; the audit of the Fable half disputed two ordinary emails whose recipient
domain copied the sender's under another ending, a lookalike the brief had excluded, and both were
dropped. Scored once each:

| | Caught (95% CI) | Questioned (95% CI) |
| --- | --- | --- |
| v2.3 (shipped) | **101/120, 84%** (77–90%) | **9/398, 2.3%** (1.2–4.2%) |
| v2.2, same threshold procedure | 93/120, 78% (69–84%) | 12/398, 3.0% (1.7–5.2%) |
| Rules and recipient checks alone | 15/120, 12.5% (8–20%) | 0/398 (0–1.0%) |

Rules alone caught 12.5%, against 23% on `everyday4` and 48% on `everyday5`: this is the hardest set so
far. By category v2.3 caught physical access 20 of 24, personal details 22, internal economics 16,
negotiating position 22 and remarks 21; costs and margins given as bare figures or a ratio are its
weakest spot. By author it caught 49 of 60 (questioned 7 of 198) on the Fable half and 52 of 60 (2 of
200) on the Luna half. The pre-registered release bar (at least 75% caught, at most 5% questioned)
passed, so the shipped model stands; v2.3 caught 8 more than v2.2, but the intervals overlap. The first
scoring run printed its results but failed to save its reports (a wrong output path); the identical,
deterministic commands were re-run two minutes later to save them, and every result the first run
printed matches.

**Real mail, and gate 6 (v2.4 rejected; v2.3 stays).** Every set above is synthetic. The first test on
real mail, 3,000 outside emails Enron employees sent in 1999–2002 (public CMU corpus, see
[evaluation/real-mail](evaluation/real-mail/)), changed the picture: v2.3 asked about 32% of them, the
rules alone 2.4%. Reading samples showed why: the model reacted to how real mail sounds (banter,
forwarded jokes and chain letters, family news, any price) rather than to what it disclosed, and
about half of its flagged sentences were fragments of plain text wrapped at 70 columns. A v2.4 was
built against that: hand-checked labels on the sentences v2.3 flagged in half the Enron mailboxes,
retraining, and thresholds set on real ordinary mail; the rules gained profit-and-loss figures,
"Pin #" and "BK ID" wire details, and one overlong sentence no longer drops the model for a whole
email. Gate 6 then scored it once, on 2,000 emails from the other half's 72 mailboxes and on a new
two-author synthetic set, `everyday7`, whose ordinary mail was written messy on purpose. Labelers read
every email any system asked about plus 300 none asked about, blind to which system asked, and rated
each disclosure serious or not ([plan and amendments](docs/gates/GATE-PLAN-6.md)).

| Gate 6 | Real mail: asked | Needless | Serious caught | everyday7 caught | everyday7 questioned |
| --- | ---: | ---: | ---: | ---: | ---: |
| v2.3 (current) | 700/2,000 (35%) | 559 (28%) | **61** | 108/120 | 53/400 |
| v2.4 candidate | 168/2,000 (8.4%) | 99 (5.0%) | 37 | 104/120 | 32/400 |
| Rules alone | 53/2,000 (2.7%) | 26 (1.3%) | 19 | 11/120 | 0/400 |

The labelers found 62 serious disclosures among the emails any system asked about; the random sample
of the rest suggests about 34 more that no system asked about. v2.4 asked a quarter as often but
caught 24 fewer serious disclosures (personal details 7 of 17 against 15, remarks 8 against 17,
negotiation 6 against 11) and questioned 8% of `everyday7`'s ordinary mail against a 5% bar, so it
failed and v2.3 stays. On the development mailboxes, v2.3 and four v2.4 recipes trace the same
catch-against-ask curve: the 17M model, not its training data, seems to limit how well real-mail
nuance is told apart. The rule and reader changes ship with v2.3; the real-mail numbers above include
them. Because a missed serious disclosure costs far more than an extra question (one click), v2.3
keeps its recall-first thresholds.

| Gate | Candidate | Caught | Questioned | Bar | Result |
| --- | --- | ---: | ---: | --- | --- |
| realistic3 | v2.1 | 48/60 | 1/240 | | (everyday failed: 20/200) |
| everyday2 | v2.1 recalibrated | 51/60 | 7/300 | ≤ 3/300 | Fail |
| everyday2 | v2.2 | 48/60 | 4/300 | ≤ 3/300 | Fail |
| everyday3 | v2.2, zero-question thresholds | 42/60 | 0/300 | ≤ 1%, ≥ 50% | Pass |
| realistic3 | v2.2, zero-question thresholds | 38/60 | 0/240 | ≤ 1%, ≥ 50% | Pass |
| everyday4 | v2.2, recall-first thresholds | 50/60 | 12/300 | ≤ 5%, ≥ 75% | Pass |
| everyday5 | v2.3, recall-first thresholds | 60/60 | 2/300 | ≤ 5%, ≥ 75%, ≥ v2.2 | Pass |
| everyday5 | v2.2, recall-first thresholds (comparison) | 60/60 | 1/300 | | |
| everyday6 | v2.3, recall-first thresholds | 101/120 | 9/398 | ≤ 5%, ≥ 75% | **Pass (current)** |
| everyday7 + Enron B | v2.4, real-mail thresholds | 104/120; 37 serious | 32/400; 168/2,000 asked | ≤ 5%, ≥ 75%; ≥ 80% of v2.3's serious | Fail |
| everyday7 + Enron B | v2.3 (comparison) | 108/120; 61 serious | 53/400; 700/2,000 asked | | |
| everyday6 | v2.2, recall-first thresholds (comparison) | 93/120 | 12/398 | | |

Pre-registrations are in `docs/gates/`, preserved from the original model-development history. Each was committed before anyone
deciding had seen its set; for gates 2 and 3 the set's author had already started, for gate 4 and
check 5 not.
Results are committed under `evaluation/heldout/*/gate*.json`.

The gate plans and dataset READMEs are original custody records. Their branch names and
authoring-only paths are historical provenance, not setup requirements for the public snapshot.

## Real incidents, replayed

A separate research pass catalogued 51 documented incidents of emails or attachments that caused harm
(regulator notices, court records, major reporting), and rebuilt 49 of them as test emails with invented
names and the same kind of content, 12 with real XLSX or PDF attachments. On the current build the
add-in asks about 35 of the 49. Six of the 49 were sent inside the organization, which the add-in does
not check by design. Most of the rest are wrong-recipient mistakes with ordinary content, which no
content check can see, or file contents the research could not reconstruct. This replay guided the
records, greeting and internal-marking checks, so it is development evidence, not a blind result, and
it does not show that any historical incident would have been prevented.

## Attachments

Two checks answer different questions. First, do ordinary files read fully? Thirty-six everyday
documents (an invoice, a letter, a report with tables, a contract, a multilingual welcome pack and
others) saved by Chromium and Microsoft Word as PDF and `.docx` all read in full, with every amount,
name and accented or non-Latin phrase intact ([evaluation/everyday-docs](evaluation/everyday-docs/)).
Its first run found one gap, an "î" that Chromium writes as two characters, since fixed. Second, does a
hostile file break anything? 1,586 files from Mozilla's pdf.js and Apache POI test collections, which
exist to break parsers, each ran in a bounded process: none crashed or hung. The reader refuses to pass
a file on a partial read, so 621 of those 1,008 PDFs and 107 of the 578 Office files come back as
can't-check, which asks. Neither check measures how often a real attachment is a disclosure.

A reproducible [GovDocs1 and mutation check](docs/DEVELOPMENT.md#real-web-documents-and-mutation-fuzzing)
adds 2,176 files harvested from government websites: 346 of 957 PDFs,
15 of 21 DOCX, 9 of 20 XLSX, 0 of 20 PPTX, 74 of 78 CSV and 270 of 317 TXT read fully; the remainder
needed OCR or asked as can't-check. All 763 legacy DOC/XLS/PPT/RTF files asked, with no silent pass.
Two of the PDFs needed OCR and 609 were can't-check. No corpus input crashed or timed out.
Separately, before the two later PDF-reader fixes, 21,000 seeded mutations (20,942 unique payloads)
ran in bounded child processes with no remaining finding, crash or timeout after the earlier
robustness fixes. The mutation suite was not rerun for the two later fixes. These checks measure parser
robustness and format coverage, not disclosure-detection accuracy or OCR accuracy.

## What these numbers do not show

- Every test email was written by an AI. Real mail is messier, and each label is one author's reading
  of the spec, without human adjudication.
- 60 to 120 disclosures per set gives a wide margin: 101 of 120 is consistent with a true rate
  anywhere from about 77% to 90%, and 60 of 60 with anything from 94% up (95% Wilson intervals). Sets
  also differ in difficulty: the same v2.2 caught 50 of 60 on `everyday4`, 60 of 60 on `everyday5` and
  93 of 120 on `everyday6`.
- The model runs only in Outlook on the web, the new Outlook and Outlook for Mac. Classic Outlook for
  Windows uses the rules alone.
- Live behavior was tested in Outlook on the web, including the sideloaded v2 manifest's compose
  activation, separate-window invitations, Review pane and PromptUser unavailable-host choices.
  A model-only finding appeared after compose preload; picture pre-reading is inferred from timing.
  Other clients, a true cold first Send and Microsoft's centrally deployed v2 delivery remain unverified;
  see [runtime notes](outlook/RUNTIME-V2-NOTES.md#live-evidence-v2-manifest-outlook-on-the-web-24-october-2026).

## Reproducing

`node evaluation/heldout/run.mjs --cases evaluation/heldout/<set>/cases.jsonl --semantic model/out`
reruns any published set through the product path (rules, recipients, attachments and the shipped
model) and prints the confusion table.
