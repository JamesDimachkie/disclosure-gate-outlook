# everyday6b: cross-family label audit

- Auditor: Anthropic `claude-opus-5-5` (Claude Opus 5.5). The set's author is OpenAI `gpt-6-luna`.
- Date: 24 October 2026.
- Scope: all 260 cases in `cases.jsonl`, audited before any scoring. No runner, validator, test, model or rule code was run.

## What was read

`SPEC.md` (product spec v2, in full, with §4 and §5 read closely), `evaluation/heldout/README.md`, `evaluation/heldout/everyday6b/README.md` and `evaluation/heldout/everyday6b/cases.jsonl`. Nothing else in the repository was opened, including the batch, serializer and validator scripts in this folder. A print-only script showed each case (id, label, `why`, `boundary`, deciding sentence, from/to/cc/bcc, attachment count, subject, full body including quoted history). A structural pass checked only addresses, recipient counts, attachments, greetings and whether the deciding sentence appears verbatim. It applied no detection patterns.

## Structural findings

All 260 cases are clean on the recipient contract. Each has one To recipient on a `.test` domain and a sender on a `.example` domain. No case has Cc, Bcc, attachments or `internal_domains`. No recipient domain shares the sender's domain name, so every recipient is outside under §4 and no §5.8 lookalike arises. Every opening greeting names the actual recipient (no §5.8 greeting prompt). Every deciding sentence appears verbatim in the subject or body. Composition matches the set README: 12 stops each in secrets (§5.1 premises), personal, economics, negotiation and remark, and 200 passes, 100 of which carry a `boundary` field.

## Counts

| Label | Cases | Agree | Dispute |
| --- | ---: | ---: | ---: |
| stop:secrets (§5.1) | 12 | 12 | 0 |
| stop:personal (§5.4) | 12 | 12 | 0 |
| stop:economics (§5.5) | 12 | 12 | 0 |
| stop:negotiation (§5.6) | 12 | 12 | 0 |
| stop:remark (§5.7) | 12 | 12 | 0 |
| pass | 200 | 200 | 0 |
| **Total** | **260** | **260** | **0** |

## Disputes

None. No case met the bar of a confident, SPEC-text-supported alternative label.

| id | Current | Proposed | Sentence | SPEC | Reason |
| --- | --- | --- | --- | --- | --- |
| (none) | | | | | |

## Close calls accepted as `agree`

These are the labels most likely to draw a challenge. Each is recorded with a `note` in `audit.jsonl`.

| id | Label | Why it is close | Why it stands |
| --- | --- | --- | --- |
| 011 | stop:secrets | "the freezer-room alarm has been muted" may be a temperature or entrapment alarm, not an intrusion alarm. | §5.1 lists "alarm off" as a security gap without qualification. |
| 030 | stop:economics | No figure. §5.5 excludes "naming a budget line ... without an internal figure". | The sentence discloses a held-back allowance (contingency) and that the job is only viable because of it. That is margin information, not a bare budget-line name. |
| 032 | stop:economics | The roles are muddled: a clinic tells the cleaner that "the monthly cleaning contract is three times the cleaner's quoted hours and call-out charge together". | Both readings fall under §5.5: a 3x markup on the cleaner's cost, or the clinic's own cost given as a ratio. Of the stops, this one is the most poorly written. |
| 025 | stop:economics | The figures have no labels. | "For our own worksheet, the unit comes in at 31 and goes out at 48" reads as cost against sale price. |
| 026, 034 | stop:economics | Both also touch §5.6 (room to absorb a discount). | Each sentence states thin margin or a floor, so §5.5 is a correct category. |
| 001 | stop:secrets | The deciding sentence is in quoted text attributed to the recipient. | §5 reads quoted earlier messages with no exemption for text the recipient wrote. |
| 253 (also 145) | pass | A repair quote for the recipient's own garden gate "includes the replacement latch". A literal §5.1 reading ("a gate or lock broken") could catch it. | It is a customer-facing quote (§5.5) to the gate's owner and discloses no security gap at the sender's premises. §5 says "Where a rule is unsure, it does not flag." |

Other notes in `audit.jsonl` cover categorisation only. Cases 046 and 060 are conditional concessions about a third party, not offers made to the recipient. Case 051 disparages the sender's own team, and 055 may insult the recipient's own company. Neither fact changes the §5.7 label.

## Limits

This is one auditor's reading of the SPEC text. I did not score or execute anything, so the audit says nothing about difficulty or detectability. A zero-dispute result means no label conflicted with the SPEC text clearly enough to overturn. It does not mean every label is unarguable: cases 011, 030 and 032 are the ones a second adjudicator should look at first.
