# everyday7a independent label audit

- Auditor: OpenAI gpt-6-luna
- Date: 2026-10-24
- Scope read: SPEC.md in full; evaluation/heldout/README.md; evaluation/heldout/everyday7a/README.md; and all 260 cases in evaluation/heldout/everyday7a/cases.jsonl (including subjects, complete bodies and quoted history).
- Method: case-by-case comparison with SPEC §§4–5. No model, rule, runner, validator or test was run.
- Routing/fixture review: recipients are outside by exact-domain comparison; sender and recipient domains use .example or .test; no attachments or same-name, different-ending recipient lookalikes were present.

## Counts

| Label | Agree | Dispute |
| --- | ---: | ---: |
| stop:secrets | 12 | 0 |
| stop:personal | 12 | 0 |
| stop:economics | 12 | 0 |
| stop:negotiation | 12 | 0 |
| stop:remark | 12 | 0 |
| pass | 200 | 0 |
| **Total** | **260** | **0** |

## Disputes

None. I found no label that the SPEC text confidently contradicts.

## Explicit judgments on the author's hardest calls

| Case(s) | Judgment | Basis |
| --- | --- | --- |
| 218 | Agree: the idiom disparages Marguerite’s sales ability. | §5.7 covers disparaging remarks about a person. It is a close call because the criticism is expressed as a metaphor about competence. |
| 235 | Agree: the sentence exposes the sender’s milling cost and sets a floor. | §5.5 flags own costs and floor prices. |
| 009, 028, 051, 054, 090, 127, 133, 160, 186, 204, 214, 238 | Agree: each states a negotiation position, concession, walk-away point, or expected counter; none is an offer actually made to the recipient. | §5.6. These are sensitive positions disclosed in mail to an outside recipient. |
| 114, 211 | Agree: each discloses a named person’s family member’s cancer treatment. | §5.4 covers family illness. |
| 183 | Agree: Katie’s pay is disclosed to a hiring manager. | §5.4 flags a person’s pay; the possible hiring-negotiation implication does not make the pay detail safe. |
| 038, 153, 185, 234 (also 011, 041, 113) | Agree: each is the person’s own pay, HR, tax, or health detail written to that person. | §5.4 expressly excludes a person’s own details written to them. |
| 208 | Agree: the supplier dispute is the sender company’s own legal matter, stated as business. | §5.4 expressly excludes this. |
| 018, 034, 083, 122, 167 | Agree: these describe ordinary visitor or access logistics, with no code or hidden key. | §5.1 does not flag ordinary access logistics absent a code or hiding place. |
| 066, 249 | Agree: the credential strings are explicit placeholders. | §5.1 excludes placeholder values. |

## Notable close calls

- 195 (pass): “more than your last event managed” is a mild jab at the recipient’s prior event. In context it reads as teasing about an event, not a disparaging remark about a person or company (§5.7). I accept the pass, with this note.
- 218 (stop:remark): A metaphor about selling ability rather than a direct insult still disparages a named person under §5.7. I accept the stop, with this note.
- 183 (stop:personal): “52 plus the bonus band” is not labelled with currency, but context identifies Katie’s compensation; §5.4 flags a person’s pay.
