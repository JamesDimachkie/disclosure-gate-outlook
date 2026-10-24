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

The training data for the sentence model came from different authors and lanes again: two rounds of
whole labelled emails by Claude Opus 5.5 and GPT-6.1 Sol (1,320 emails), plus 1,000 contrastive pairs
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

| Gate | Candidate | Caught | Questioned | Bar | Result |
| --- | --- | ---: | ---: | --- | --- |
| realistic3 | v2.1 | 48/60 | 1/240 | | (everyday failed: 20/200) |
| everyday2 | v2.1 recalibrated | 51/60 | 7/300 | ≤ 3/300 | Fail |
| everyday2 | v2.2 | 48/60 | 4/300 | ≤ 3/300 | Fail |
| everyday3 | v2.2, zero-question thresholds | 42/60 | 0/300 | ≤ 1%, ≥ 50% | Pass |
| realistic3 | v2.2, zero-question thresholds | 38/60 | 0/240 | ≤ 1%, ≥ 50% | Pass |
| everyday4 | v2.2, recall-first thresholds | 50/60 | 12/300 | ≤ 5%, ≥ 75% | Pass |
| everyday5 | v2.3, recall-first thresholds | 60/60 | 2/300 | ≤ 5%, ≥ 75%, ≥ v2.2 | **Pass (current)** |
| everyday5 | v2.2, recall-first thresholds (comparison) | 60/60 | 1/300 | | |

Pre-registrations are in `docs/gates/`, copied from the model lane. Each was committed before anyone
deciding had seen its set; for gates 2 and 3 the set's author had already started, for gate 4 not.
Results are committed under `evaluation/heldout/*/gate*.json`.

## Real incidents, replayed

A separate research pass catalogued 51 documented incidents of emails or attachments that caused harm
(regulator notices, court records, major reporting), and rebuilt 49 of them as test emails with invented
names and the same kind of content, 12 with real XLSX or PDF attachments. On the current build the
add-in asks about 35 of the 49. Six of the 49 were sent inside the organisation, which the add-in does
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
a file on a partial read, so 636 of those 1,008 PDFs and 106 of the 578 Office files come back as
can't-check, which asks. Neither check measures how often a real attachment is a disclosure.

## What these numbers do not show

- Every test email was written by an AI. Real mail is messier, and each label is one author's reading
  of the spec, without human adjudication.
- 60 disclosures per gate gives a wide margin: 50 of 60 is consistent with a true rate anywhere from
  roughly 72% to 91%, and 60 of 60 with anything from 94% up (95% Wilson intervals). Sets also differ
  in difficulty: the same v2.2 caught 50 of 60 on `everyday4` and 60 of 60 on `everyday5`.
- The model runs only in Outlook on the web, the new Outlook and Outlook for Mac. Classic Outlook for
  Windows uses the rules alone.
- Live behaviour in Outlook was tested by hand in Outlook on the web; see
  `outlook/RUNTIME-V2-NOTES.md`.

## Reproducing

`node evaluation/heldout/run.mjs --cases evaluation/heldout/<set>/cases.jsonl --semantic model/out`
reruns any published set through the product path (rules, recipients, attachments and the shipped
model) and prints the confusion table.
