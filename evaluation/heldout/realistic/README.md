# Realistic workplace-email held-out tier

Individually written from `SPEC.md` by **gpt-6-astra**, 22 October 2026, as an independent evaluation author. The author read only the permitted project `AGENTS.md`, `SPEC.md`, the existing held-out README and runner, and this tier's own newly authored artifacts. No detection rules, tests, Outlook implementation, or first-tier case contents were opened or searched. The existing README supplied schema/custody context and its published summary; the first tier's emails were not used as examples.

Every subject, body and case rationale was composed individually. A temporary assembly helper serialized those literal messages and explicitly specified recipient arrays into JSONL; it did not generate email prose, substitute test sentences into filler templates, or draw on real mail. Statistics, tables and attachment encodings were calculated mechanically. The temporary helper is not a deliverable. Execution of the checker occurs only after author validation and freezing; results never feed back into case labels or text.

**Custody:** rule authors must never read this tier, its case-level results or deciding-span checks, and must never tune on it. Keep the cases and diagnostic receipts within the evaluation lane. Share aggregate measurements with integration owners. A future revision needs new independent spec-derived authorship, a new version and a new freeze; do not repair scored cases to improve the measured result.

## Composition

| category_expected | stop | prompt | pass | Total |
| --- | ---: | ---: | ---: | ---: |
| secrets | 8 | 0 | 17 | 25 |
| payment | 5 | 0 | 12 | 17 |
| government_id | 5 | 0 | 10 | 15 |
| personal | 5 | 0 | 20 | 25 |
| economics | 5 | 0 | 11 | 16 |
| negotiation | 4 | 0 | 6 | 10 |
| remark | 3 | 0 | 10 | 13 |
| lookalike | 5 | 0 | 2 | 7 |
| exposed_list | 0 | 10 | 5 | 15 |
| file | 0 | 0 | 2 | 2 |
| none | 0 | 0 | 5 | 5 |
| **Total** | **40** | **10** | **100** | **150** |

The ten prompt cases all meet the exposed-list threshold; five separate passing controls cover seven visible outsiders across three domains, an eighth outsider only in Bcc, Bcc-only additional domains, nine visible outsiders at one customer domain, and eight visible outsiders across only two domains. Prompts combine otherwise harmless §5.1–§5.7 near misses with an exposed list. They include To/Cc aggregation, Cc-only outsiders, mixed inside/outside lists, admin-listed internal domains, domain case normalization and Bcc exclusion.

The first 100 cases comprise ten independently authored scenarios per industry: construction (001–010), healthcare administration (011–020), creative/marketing services (021–030), software/SaaS (031–040), accounting (041–050), logistics (051–060), adult education (061–070), manufacturing (071–080), hospitality/events (081–090), and commercial legal services (091–100). Stops and prompts revisit these industries in new messages. US, UK and Australian English are represented through spelling, address and telephone conventions, currencies and business wording; these are author-selected cues, not a measured linguistic sample.

There are **60 quoted-message emails**, including **13 with multiple quote levels**, and **10 inside-only cases** that must pass despite sensitive detail. Mail includes signatures, invented addresses and registration references, disclaimers, reply/forward headers, bullet and numbered lists, pasted tables, amounts, dates, order references, out-of-office notes and meeting arrangements.

The 40 stops have one authored deciding sentence/clause or recipient apiece: **25 quoted-body disclosures, 5 subject disclosures, 5 TXT/CSV attachment disclosures and 5 lookalike recipients**. All quoted history is in scope under §5. There are **8 readable attachments** in total: 5 carrying a deciding sentence, 2 clear attachment pass cases and 1 clear attachment in an exposed-list prompt. Payloads are canonical UTF-8 base64 with exact byte sizes. CSV cells containing commas are quoted.

## Body lengths

Lengths count Unicode characters in `draft.body.text`, including quotes and signatures, excluding subjects, rationale, recipients and attachments. All characters in this version are within the BMP, so these equal JavaScript string lengths. The median uses the mean of the middle pair for an even-sized set; means are rounded to two decimals.

| Group | Emails | Minimum | Median | Mean | Maximum | Over 2,000 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| All bodies | 150 | 922 | 1039 | 1339.93 | 2559 | 36 |
| Pass bodies | 100 | 964 | 1063 | 1432.58 | 2559 | 30 |
| Stop bodies | 40 | 922 | 1005 | 1121.18 | 2252 | 4 |
| Prompt bodies | 10 | 1012 | 1056.5 | 1288.50 | 2280 | 2 |

Thus the median exceeds 900 characters and 36 bodies exceed 2,000 characters. Long messages occur in every outcome class, though length is not balanced across classes.

## Fictional-data provenance

Every person, company, business event, address, registration reference and ordinary number is invented for this tier. Recipient domains, quoted email domains and the database host use `.example` or `.test`, including lookalike variants. There are no actual employer or customer records. Phone/address formats and geographic abbreviations provide regional context without identifying a real subject. Structurally valid invented identifiers could accidentally coincide with a real identifier; no real identity is asserted or sourced.

Payment cards use conventional documented test-card patterns: `4242 4242 4242 4242`, `5555 5555 5555 4444` and `378282246310005`. The IBAN is the conventional validation example `GB82 WEST 1234 5698 7654 32`. These are fixtures, not payment instructions. The sort code/account pair, SSN, NI number, passport and tax identifier are invented; the Canadian SIN is synthetic with a checked Luhn digit. The GitHub-shaped token is an invented 36-character payload, and the database string points to a reserved fictional host. Passwords and access codes are invented literals. No credentials were obtained from an environment, repository secret or service.

## Validation and execution

From the repository root, with Node 24:

```sh
node evaluation/heldout/realistic/validate.mjs --write-receipt
node evaluation/heldout/run.mjs --cases evaluation/heldout/realistic/cases.jsonl --json realistic/pre-integration.json
```

`validate.mjs` reads only this tier. It checks every JSONL line, unique IDs/drafts/bodies, schema, reserved recipient domains, one-line SPEC rationales, exact 100/40/10 composition, README tables, body lengths, quote counts, internal routing, visible-list thresholds, attachment base64/UTF-8/size/CSV structure, card/SIN Luhn, IBAN mod97, SSN/NI/token shapes, and the presence exactly once of each independently specified deciding span in its intended location. Span checks prove occurrence and placement, not that a semantic classifier or human reviewer would agree that no other finding exists. The single-disclosure labels are the author's spec-based judgments.

The runner's new `--cases` path resolves from the current working directory and selects `README.md` beside that file. With no `--cases`, its original fixed input, at-least-400 validation and output mapping remain unchanged. Explicit datasets are nonempty and must agree with their own README table. `--json` still resolves beneath `evaluation/heldout/` and uses the original non-overwriting report write. Both option orders are accepted; duplicate, unknown and missing-value arguments are rejected.

The existing mapping is retained: `clear` → pass; `held` with a nonempty list of only prompt-severity findings → prompt; `held` with any non-prompt finding → stop; anything else or an exception → error. Exact outcome agreement is measured; returned category names are diagnostic. Classification disagreements alone do not fail the process, but errors do. No default-tier run is performed because that would read the excluded first-tier cases.

The frozen SHA and structural receipt are in `validation.json`. The one pre-integration checker run and the separately required repository test command are recorded below after execution. No case content or labels will change in response to either command.

## Pre-integration receipt

Executed exactly once on 22 October 2026 using Node v24.20.0:

`node evaluation/heldout/run.mjs --cases evaluation/heldout/realistic/cases.jsonl --json realistic/pre-integration.json`

Frozen cases SHA-256: `200f400ff9f380f4e38dc7c5061dc615239278025bc6ccc5b12cce25e2bba6fb`. `pre-integration.json` records every case ID, expected/actual outcome and returned category list without email content. `pre-integration.log` preserves console output; `pre-integration-exit.txt` records exit code **1**. The run validated all 150 cases and completed all 150 checker calls.

| Expected | Actual stop | Actual prompt | Actual pass | Error |
| --- | ---: | ---: | ---: | ---: |
| stop | 18 | 0 | 0 | 22 |
| prompt | 0 | 0 | 0 | 10 |
| pass | 3 | 0 | 10 | 87 |

Exact matches: **28/150 (18.67%)**. False stops: **3/100 (3%)**. Stop catches: **18/40 (45%)**. Prompt matches: **0/10**. Errors: **119**, all `UNEXPECTED_RESULT` under the inherited state/finding mapping. The 87 errors among expected passes mean the observed false-stop percentage is not a production-precision result. No rule implementation was inspected to explain the errors, and no cases or labels changed after scoring.

The project `AGENTS.md` also requires `npm test`. It ran once without opening test source and exited **1**, reporting **77 passed, 1 failed, 78 total**, with `test/server.test.mjs` the failed file. `repository-test.txt` retains the bounded summary. The test suite is not claimed to pass; diagnosing or editing that file is outside this evaluation lane's authorized scope. The runner change has been checked by its one explicit-path execution and static diff review; the default tier was not executed.

Author validation passed before scoring and was repeated after documentation to verify the unchanged freeze and final README tables. It establishes corpus integrity, not detection correctness or the absence of semantic label ambiguity.

## Limits

The weakest point is still authorship diversity: one model wrote all messages, with recurring organisations, contacts, review vocabulary and orderly formatting. This is substantially longer text with realistic administrative distractions, but it is not sampled workplace mail or independent human label adjudication. Length remains correlated with outcome, and sensitive stops are concentrated in quoted content, subjects and attachments. Aggregate rates cannot establish production precision, prevalence or a release threshold.

This tier is not exhaustive coverage of every §5 subtype. It does not test unreadable-file stops, OCR, PDF/Office extraction, attachment limits, HTML, uncheckable distribution lists or every secret format. In particular, no file-only stop was added because this brief requires every stop to have one deciding sentence or recipient. The readable attachment examples exercise text extraction through the existing draft contract only. No Outlook-host behavior, send interception, delivery, Warn/Enforce UI, latency, network isolation or accessibility outcome is proven by this corpus run.

The generic path extension deliberately leaves the runner's result contract untouched. A pre-integration error can reflect an incompatible checker contract rather than a missed detection; error outcomes must remain visible in the denominators. Never treat a low observed false-stop rate with many errors as evidence that ordinary mail safely passes.
