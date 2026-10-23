# Disclosure Gate for Outlook: held-out evaluation

Written from this worktree's `SPEC.md` (product spec v2, 22 October 2026) and `AGENTS.md` by OpenAI **gpt-6.1-sol**, as the independent evaluation author. No implementation, existing test, or Outlook source files were opened, searched, or read. The runner executes the named public entry point without inspecting its source. No hosted model or network service is used by the runner.

**Custody rule:** rule authors must never read this directory's cases or tune rules on this set, including against its per-case results. Report results; do not optimise against them. Use separately authored development examples for fixes. Once scored, do not change cases, labels, or thresholds in response to the implementation. Future evaluation revisions need fresh spec-derived authorship and a new version.

## Composition

| category_expected | stop | prompt | pass | Total |
| --- | ---: | ---: | ---: | ---: |
| secrets | 32 | 0 | 40 | 72 |
| payment | 24 | 0 | 32 | 56 |
| government_id | 20 | 0 | 26 | 46 |
| personal | 20 | 0 | 30 | 50 |
| economics | 18 | 0 | 30 | 48 |
| negotiation | 16 | 0 | 26 | 42 |
| remark | 14 | 0 | 26 | 40 |
| lookalike | 12 | 0 | 18 | 30 |
| exposed_list | 0 | 12 | 12 | 24 |
| file | 8 | 0 | 12 | 20 |
| none | 0 | 0 | 12 | 12 |
| **Total** | **164** | **12** | **264** | **440** |

Sixty percent must pass. Forty percent must be held: 37.27% stops and 2.73% prompts. An exposed-list prompt is a distinct expected result, never counted as a caught stop. Category labels describe the intended test family, including its negative controls; they are not required to equal a finding category returned by the checker.

Cases cover construction, law firms, marketing agencies, SaaS, accounting, healthcare administration, real estate, manufacturing, logistics, education services, and hospitality. Metadata records industry, intended US/UK/Australian English variant, and finding placement. These labels describe authored scenarios, not measured linguistic representativeness. Length ranges from one sentence to several short paragraphs.

Hard negatives cover every §5 does-not-stop list: password reset requests and logistics, redacted or placeholder credentials, promo codes, tracking/order/invoice/PO identifiers, last-four card digits, phone numbers, bank names and addresses, identifier words without values, invalid SSN ranges, unexplained absences, roles, business legal matters, customer prices and payment terms, budget-line names without internal figures, offers actually made, and blunt criticism of work. Card-shaped, Luhn-valid invoice/order identifiers deliberately test §5.2's explicit business-identifier exclusion; the broader known-prefix card bullet creates an interpretation boundary worth reporting, without relabelling after a run.

Inside-only cases include sensitive disclosures and two unreadable attachments. Admin-listed domains, case variants of inside domains, outside subdomains with sensitive content, uncheckable recipients/groups, To/Cc/Bcc routes, quoted disclosures, subject-only disclosures, and TXT/CSV-only disclosures are represented. Exposed lists test seven versus eight visible outsiders, two versus three domains, large lists from one/two domains, Cc-only lists, mixed inside recipients, and Bcc exclusion. Lookalikes include edits, transpositions, digit substitutions, `rn` for `m`, a Cyrillic letter, and changed top-level domains; unrelated fictional client domains supply negative controls.

All identities, companies, messages, and contexts are invented. Domains use `.example`, `.test`, or a conspicuously fictional brand for the changed-TLD lookalike cases. No real person's or organisation's records were used. Payment cards use public test-card patterns (including 4242 4242 4242 4242, 5555 5555 5555 4444, and 378282246310005) or synthetic numbers with generated Luhn check digits. IBANs use conventional published validation examples: GB82 WEST 1234 5698 7654 32; DE89 3704 0044 0532 0130 00; FR14 2004 1010 0505 0001 3M02 606; NL91 ABNA 0417 1643 00; ES91 2100 0418 4502 0005 1332. These are validation fixtures, never payment instructions. Routing numbers and SINs have generated checksums; SSNs and NI numbers have invented, structurally valid ranges/shapes. A possible accidental collision with a real identifier is not evidence of real data. Tokens have recognisable fake shapes; the PEM and JWT fixtures do not provide working cryptographic credentials.

## Run

```sh
node evaluation/heldout/run.mjs
node evaluation/heldout/run.mjs --json out.json
```

Run with Node 24. The runner imports `../../core/gate.mjs` dynamically, then sequentially calls `await checkDraft(draft, { config: { internalDomains } })`. Internal domains are the lowercased sender domain plus that case's optional `internal_domains`. It passes a fresh clone of each draft so checker mutation cannot change the stored cases.

A clear result maps to pass. A held result containing any finding whose severity is not `prompt` maps to stop. A held result with a nonempty list containing only severity `prompt` maps to prompt. A held result without findings, another state, an import failure, or an exception maps to error. Mixed prompt/stop findings therefore map to stop. Exact outcome agreement is scored; returned categories are diagnostic, not a second acceptance requirement.

Console output includes the expected/actual confusion matrix, false-stop rate among expected passes, unwanted prompts and any-hold rate among expected passes, catch rate among expected stops, prompt accuracy, errors, and per-category results. Every stop miss, false stop, prompt mismatch, unwanted prompt, and error on a pass is identified with returned finding categories. Errors remain in their denominators and do not count as catches. A zero false-stop rate during an import failure is not a successful result: all results would be errors. No email bodies, finding sentences, or exception messages are printed or saved to reports.

Relative `--json` paths are resolved **under `evaluation/heldout/`**: the second command writes `evaluation/heldout/out.json`. The runner refuses lexical escapes, parent-directory symlinks that escape the held-out directory, overwriting the deliverables, and overwriting an existing report. It creates no directories and writes nothing unless `--json` is supplied. Setup/checker errors exit 1; classification disagreements alone exit 0 because this reports a baseline rather than defining a release threshold.

Before importing the checker, every run validates JSON lines, unique IDs, categories/expectations, one-line spec rationales, draft shape, derivable internal domains, canonical base64, byte sizes, attachment IDs, and agreement with this composition table and its total. Author validation additionally checks card/SIN Luhn values, IBAN checksums, routing checksums, SSN/NI shapes, and recipient-list thresholds.

## Pre-integration receipt

Executed once on 22 October 2026, before rules-lane integration, with Node v24.20.0:

`node evaluation/heldout/run.mjs --json pre-integration.json`

Frozen cases SHA-256: `ea09fc521b00d4692bc7543747ca4372dd1b23544837ba0b57ffcc1473fdbf67`. The committed `pre-integration.json` preserves counts and every case ID/outcome/finding-category list without message content. No cases, labels, or thresholds were changed after scoring.

| Expected | Actual stop | Actual prompt | Actual pass | Error |
| --- | ---: | ---: | ---: | ---: |
| stop | 66 | 0 | 0 | 98 |
| prompt | 0 | 0 | 0 | 12 |
| pass | 6 | 0 | 33 | 225 |

False stops: **6/264 (2.27%)**. Stop catches: **66/164 (40.24%)**. Prompt matches: **0/12 (0%)**. Exact matches: **99/440 (22.50%)**. Errors: **335**, all recorded as `UNEXPECTED_RESULT` under the requested state/finding mapping. The runner completed all 440 calls, produced the JSON report, and exited 1 because of these errors. These are pre-integration observations, not an integrated-product result; 225 expected passes returned errors, so the apparent false-stop percentage is not evidence of high precision. The implementation was not inspected to explain its returned state contract.

The six false-stop IDs and returned categories are `secrets-049` (`access`) and `government_id-038` through `government_id-042` (`personal`). The JSON report records all 98 stop misses and all 12 prompt mismatches, each of which mapped to error.

The separate AGENTS.md-required `npm test` command was executed without reading test source; it exited 1, reporting failure of `test/server.test.mjs`. This lane does not claim the repository test suite passes and makes no changes outside `evaluation/heldout/`.

Structural validation passed: 440 parseable unique IDs and unique drafts, all 28 attachment payloads canonical and exact-size, sender domains derivable for every case, README table agreement, all checked numeric checksums and ID shapes, and every exposed-list threshold. Coverage includes 33 inside-only cases, 10 subject placements, nine quoted-body placements, 10 TXT placements, eight CSV placements, eight unreadable outside files, and two unreadable inside-only files.

## Known limits

This is a synthetic set from a single author/model, with correlated wording, finite names and contexts, and one intended finding family per case. It has no human-authored real-mail prevalence estimate or independent human label adjudication. Rates describe this set only; neither production precision nor acceptable release thresholds follow from them. Rule authors learning the case-level misses would compromise future use of this version.

The weakest point is realistic contextual ambiguity: contrived examples and short English messages cannot establish high precision on messy, multi-topic workplace mail. Scenario metadata and light regional spelling/tone variation do not provide population coverage. A small fixed group of fictional inside domains and one lookalike base domain further limit generalisation.

This is a text/draft contract evaluation, not Outlook-host integration, delivery, latency, local-only processing, Smart Alerts UI, Warn/Enforce behavior, OCR confidence, or user-comprehension proof. It does not cover cloud attachment references (their draft representation was not specified), inline-image/OCR branches, a 10 MB limit boundary, or readable PDF/DOCX/XLSX/PPTX extraction. The ZIP fixture is a small valid archive and the EML is plain RFC-style mail; other unsupported-format attachments have deliberately minimal bytes and are not valid full-format interoperability fixtures. The spec stops them because their text cannot be checked. Attachment content strings are base64 and sizes are exact decoded byte lengths.
