# Pre-score author review

Author: gpt-6-astra. Date: 2026-10-23. This is the same author's review, not independent adjudication or model evaluation.

Every message was written as a literal, including its subject and rationale. I reviewed the intended labels during authoring, reread the consolidated list of all 60 deciding sentences after batch nine, and reread ordinary cases touching medical care, prices, offers and physical-access language. I compared those decisions to the already-read SPEC. The validation script checks the resulting structural claims; it does not establish semantic correctness.

## Close calls and resolutions

| Cases | Decision and basis |
| --- | --- |
| everyday3-042, everyday3-138, everyday3-204 | Prescription collection and exercise advice go to the patients themselves; the inhaler reminder explicitly goes to the child's parent. These pass under §5.4's recipient-context exception. |
| everyday3-241 | Glasses slipping and an adjustment request concern product fit. No diagnosis or treatment is disclosed. The rationale was narrowed before freezing; it does not claim a general exemption for self-reports to providers. |
| everyday3-030, everyday3-143, everyday3-208, everyday3-258 | Retail, installation, hall-hire and seed-order amounts are customer-facing prices. They pass under §5.5. |
| everyday3-070, everyday3-169, everyday3-223, everyday3-269 | Checkout, rebooking/refund, exchange and indoor-stall terms are actual offers to the recipient, so §5.6 does not flag them. |
| everyday3-159, everyday3-199, everyday3-279, everyday3-355 | Conditional willingness or terms kept in reserve disclose negotiating room, rather than terms currently offered. These remain negotiation stops. |
| everyday3-238, everyday3-354 | A floor and a walk-away amount belong to §5.5 internal economics even though they can influence negotiation. Each has one deciding sentence and one expected category. |
| everyday3-352 | The labour rate could have been read as a customer estimate. Added the word `internal` to the literal sentence and its exact copies in metadata/rationale before scoring, to make sender-owned costing explicit. |
| everyday3-062, everyday3-108, everyday3-216, everyday3-339 | Layout, drawing, repair and stake defects are criticism of work. They pass under §5.7. |
| everyday3-200, everyday3-320, everyday3-358 | Comparing a company's people to children, ridiculing a company's competence and attacking a person's professional worth are disparagement under §5.7, rather than bounded defect reports. |
| everyday3-019, everyday3-266, everyday3-342 versus everyday3-116, everyday3-276, everyday3-347 | Planned delivery directions and a visitor question do not expose a security weakness. A broken latch, unattended open vehicle gate and failed entrance lock do. |
| everyday3-076, everyday3-348 | Hidden physical-key locations fall under §5.1's premises-security bullet. These are not software keys or login credentials. No digital secrets are included. |

## Batch custody

Every checkpoint exited successfully before the corresponding commit. Batch one first caught an accidentally space-containing invented email address; it was corrected before its successful checkpoint and commit.

| Batch | Cases | Ordinary | Disclosures | Commit |
| --- | --- | ---: | ---: | --- |
| 01 | 001-040 | 35 | 5 | 52abee82 |
| 02 | 041-080 | 35 | 5 | 61ef95f7 |
| 03 | 081-120 | 35 | 5 | 61171d1f |
| 04 | 121-160 | 35 | 5 | 9f06007d |
| 05 | 161-200 | 35 | 5 | 8ef80eeb |
| 06 | 201-240 | 35 | 5 | 0863df34 |
| 07 | 241-280 | 35 | 5 | 09175d97 |
| 08 | 281-320 | 30 | 10 | f45e613a |
| 09 | 321-360 | 25 | 15 | a07f6e94 |

The later freeze commit includes the two clarifications above, literal-source validation, documentation and the final receipt. No checker, model, runner or repository test suite was run. No labels were changed in response to performance. All file writes are within `evaluation/heldout/everyday3/`.

## Remaining limits

Bodies range from 6 to 206 whitespace-delimited words. Most are short: median 30 words, with 11 at least 100 words and 23 under 15 words. These messages do not test very long mail chains. Reused fictional organisations and contacts create correlations; the 90 ordinary settings and nine English register labels are scenario coverage, not independent population strata. Register variation is light. Each draft has exactly one outside recipient, so this set does not evaluate recipient-list behavior. It has no attachments, login secrets, payment identifiers or government identifiers. The 60 stops are balanced for evaluation rather than natural prevalence.

The final SHA-256 in `validation.json` is the scoring custody boundary. Never tune rules or models on this set, and do not revise the frozen cases in response to scoring.
