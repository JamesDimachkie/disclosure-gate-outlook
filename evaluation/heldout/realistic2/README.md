# Realistic2: independently authored semantic email tier

Author: **gpt-6.1-sol**. Authored **2026-10-23**, from product spec v2 dated 23 October 2026, in the isolated `lane/realistic2` worktree based on `d6fde714d5e25d299fb91e77e58129c433dd2bf3`.

## Provenance and custody

Read only the worktree root `AGENTS.md`, `SPEC.md`, `evaluation/heldout/README.md` for custody context, and `evaluation/heldout/run.mjs` for its schema, composition-table parser and outcome mapping. No checker, detection rules, implementation, tests, tools, docs, earlier case files or the `realistic/` tier were opened, listed or searched. The permitted parent README includes historical aggregate and case-ID discussion; it was read for custody and schema context, not used as a source of email wording. Every email in this tier was individually written for this task from the spec. A temporary helper serialized literal authored messages; it did not generate message text through templates or substitutions. The helper is excluded from the frozen deliverables.

**Rule authors must never read this tier or its case-level results. Never tune on this tier. A revision needs new independent, spec-only authorship in a new version.** The local structural validator was run before freezing. The checker was not imported or run, and no case or label was selected using checker outcomes. After the local freeze commit, do not change these cases. Integrators may score the frozen bytes; share aggregates with rule authors, not case-level material.

## Composition

| category_expected | stop | prompt | pass | Total |
| --- | ---: | ---: | ---: | ---: |
| secrets | 10 | 0 | 17 | 27 |
| payment | 0 | 0 | 0 | 0 |
| government_id | 0 | 0 | 0 | 0 |
| personal | 14 | 0 | 20 | 34 |
| economics | 12 | 0 | 17 | 29 |
| negotiation | 12 | 0 | 14 | 26 |
| remark | 12 | 0 | 17 | 29 |
| lookalike | 0 | 0 | 0 | 0 |
| exposed_list | 0 | 0 | 0 | 0 |
| file | 0 | 0 | 0 | 0 |
| none | 0 | 0 | 15 | 15 |
| **Total** | **60** | **0** | **100** | **160** |

The 60 external stops comprise seven hidden-location/security-gap and three actual access-code disclosures; five health, four family, two legal-trouble and three HR disclosures; twelve internal-economics disclosures; twelve negotiation-position disclosures spanning price, payment, delivery, scope, warranty and volume; and twelve disparaging remarks. Each stop has one intended deciding sentence, quoted exactly in its one-line rationale, with the source location stated there.

There are 90 external passes: 15 secrets near-misses, 18 personal near-misses, 15 economics near-misses, 12 actual offers, 15 criticisms of work or firm disagreements, and 15 ordinary messages labelled `none`. The remaining ten passes are inside-only controls, two per sensitive category. Five use only the sender domain; five also route to an explicitly listed internal domain, including Cc and Bcc examples. Every address is a checkable person address. Visible recipient lists remain below eight in every case.

`stop` is the runner's non-prompt finding classification, not a claim that v2 always prevents sending: the product defaults to asking, with the configured settings determining the interaction. Returned categories are diagnostic under the permitted runner's mapping. No prompt-severity fixtures are included.

## Length, placement and realism

Body lengths (Unicode code points): min 563; P25 732.5; median 1019.5; P75 1057.25; max 1171; mean 912.50.

93 of 160 bodies exceed 900 characters. Statistics count body text only, including quoted history, tables, lists and signatures; subjects, rationales and decoded attachments are excluded. Percentiles use linear interpolation at `(n - 1) * p` (R7). Mean is rounded to two decimal places here; the receipt records four decimal places.

Stops by deciding-sentence placement: current body 22; quoted history 26; subject 6; readable attachment 6.

Attachment disclosures occupy four TXT and two CSV files. Each is canonical base64 of UTF-8 with the exact decoded byte size, `isInline:false`, `type:file` and a globally unique ID. The deciding sentence occurs exactly once across the subject, body and decoded attachments of its case. All stop bodies include substantive surrounding operational content. History includes reply and forward chains, sometimes nested; there are independently written signatures, handling notes, lists and pasted tables, dates, schedules and figures.

Authored industries include horticulture/agriculture, live performance, food production, museums/archives, property/construction, engineering/manufacturing, logistics, education, hospitality, software, pharmaceuticals, clinical administration, legal services, retail, textiles, publishing and laboratory services. UK, US and Australian English appear in terminology, spelling, currencies and workplace expressions. These are authored scenario choices, not a measured sample of regional workplace mail.

All people, companies, correspondence and circumstances are fictional. Every domain is `.example` or `.test`. No real mail, personal records or customer documents were used. Access codes are invented fixtures, not functioning credentials. Passwords, API keys, financial/government identifiers, lookalike recipient domains and threshold-sized exposed recipient lists are outside this tier.

## Structural receipt

Run only this local, checker-free validation step:

```sh
node evaluation/heldout/realistic2/validate.mjs --write-receipt
```

The validator reads only this tier's cases, README and its own source. It checks the runner-compatible draft schema, exact composition and ordered IDs, unique bodies, README rows, reserved domains, unrelated external names, inside-only routes, attachment encoding and byte sizes, and exact deciding-span occurrence at the stated location. It writes `validation.json`, including the SHA-256 of `cases.jsonl`. It never imports the checker. Numeric/key-shaped material is conservatively screened; semantic single-disclosure judgments remain spec-only author review, not something a structural validator can establish. A tier-local `.gitattributes` pins LF endings so Git checkouts preserve the frozen bytes and receipt hash.

## Label boundaries and limits

The boundary between §5.5's floor/walk-away price and §5.6's acceptable price is not fully disjoint. Explicit floor and walk-away statements here use `economics`; statements about conditional concessions or bargaining use `negotiation`. Both are stops, so this overlap affects category interpretation rather than the expected outcome. Generic wishes and service descriptions are passes because they disclose no identifiable person's private fact, applying §5's high-precision instruction with §5.4. No outcome label was left unresolved.

This is synthetic correspondence from one model, not an independently adjudicated real-mail sample. Structural validation does not measure detection performance, production precision, Outlook integration, runtime latency, attachment extraction beyond these TXT/CSV fixtures, or the on-device execution promise. The weakest remaining evidence is independent human adjudication of realism and semantic labels. Checker scoring belongs to the integrator after the cases are frozen.
