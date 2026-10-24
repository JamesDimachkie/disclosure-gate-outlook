# everyday3: independent synthetic outside mail

Author: **gpt-6-astra**. Date: **2026-10-23**. Labels follow this checkout's SPEC v2, 23 October 2026. `stop` is the evaluation family's name for a disclosure finding; default product behavior asks the sender whether they are sure.

Read scope: `LANE-BRIEF.md` first, then only root `AGENTS.md`, root `SPEC.md`, `evaluation/heldout/README.md`, `evaluation/heldout/run.mjs`, and this lane's own `evaluation/heldout/everyday3/` artifacts. Git branch/status and commit metadata were used for custody. No other held-out directory, implementation, training examples, tests, worktree or prior project memory was opened, listed or searched. The allowed SPEC and parent README contain historical evaluation summaries; those were encountered while reading the allowed contract, not used to design near-misses. This is independent authorship, not a claim of blindness to the historical summary printed in those allowed documents.

All people, organisations, addresses and messages are invented. All addresses use reserved `.example` or `.test` domains. Every draft has one exact-domain outside recipient and no attachments. Recipient names supply context for direct-to-person and guardian exceptions. English labels indicate intended editorial register, not verified dialect coverage.

## Composition

{{TABLE}}

{{INDUSTRIES}}

{{STATS}}

English variants across all cases: {{VARIANTS}}.

Placements across all cases (`none` means ordinary mail): {{PLACEMENTS}}. Body placement includes different paragraph positions; quoted disclosures occur on lines beginning `>`. Each stop's `meta.deciding_sentence` is quoted verbatim in its one-line SPEC rationale. The serializer does not concatenate prose or invent mail: it translates literal rows into envelopes and assigns sequential IDs. Row order is passes then stops within each batch. That clustering is an authoring convenience, not a realistic prevalence model.

## Authoring and validation

Nine literal batches of 40: the first seven have 35 ordinary and five disclosure cases each; batch eight has 30 and ten; batch nine has 25 and fifteen. Each batch is structurally validated and committed before the next is written. Five disclosure families receive one, two and three examples respectively in those phases.

Commands from this folder:

```
node serialize.mjs
node document.mjs
node validate.mjs --checkpoint
node validate.mjs --write-receipt
```

`document.mjs` derives README counts and length statistics from literals; `validate.mjs` independently compares the README table to JSONL, checks envelope/schema, sequential IDs, literal-to-draft equality, batch sizes and balance, final quotas (or upper bounds at checkpoints), normalized duplicate bodies, exact-domain outside status, reserved-domain syntax, a deliberately conservative domain-name distance screen, exact single occurrence and placement of distinct deciding sentences, quoted rationales, and numeric screens. Card-like sequences of 13-19 digits (allowing spaces/dashes), IBAN-like strings and runs of nine or more digits are rejected regardless of checksum. This is a precaution against unintended numeric fixture families, not the product's detection algorithm. Short premises codes are allowed. Semantic single-finding labels and realism require author review; syntax cannot prove them. Validation used Node v24.20.0 without dependencies.

The final `validation.json` freezes the cases SHA-256 and composition. No checker, runner, model, repository test suite or network service was executed. The brief's explicit test prohibition governs this lane over AGENTS.md's general npm-test instruction. No model performance, deployment readiness or false-positive rate is claimed.

## SPEC close calls

Direct patient correspondence, messages to a named parent about their child, and messages to a pet's owner stay ordinary under §5.4 even when treatment is mentioned. Information about a third party sent to an unrelated business recipient is personal. Operational absences do not acquire an inferred medical cause.

Customer prices, accepted order amounts and actual offers are ordinary under §§5.5-5.6. Stops expose the sender's own economics or an unoffered fallback/strategy. A disclosed internal price floor belongs to economics; concessions and planned tactics belong to negotiation. No stop deliberately combines those categories.

Criticism of a faulty object, missing deliverable or missed date remains ordinary under §5.7. Disparagement aimed at a person or company is a remark finding even when politely worded. Physical access stops reveal actual premises entry information or a security weakness; directions and arranged opening hours alone do not qualify.

The subject and quoted history count under §5 even if the fresh body is ordinary. Quoted stops use the current sender's own earlier words where ownership matters. No sentence in a stop is intended to independently trigger a second finding; context needed to interpret a sentence is not a separate disclosure.

Case-specific review notes and the nine batch commit identifiers are in `AUTHOR-REVIEW.md`. Two pre-score clarifications were made after batch nine: the rationale for `everyday3-241` identifies ordinary product fitting rather than extending the medical exception, and `everyday3-352` explicitly says its estimate is internal. No labels changed and no scoring results informed either clarification.

## Custody and limits

**Never tune rules or models on this set; freeze before scoring.** Preserve the final cases hash. Report aggregate results to implementation authors; keep case-level evidence in evaluation custody. Do not revise labels or thresholds after seeing model outputs. Future development examples must be separately authored.

These are 360 synthetic messages from one model, not a random sample of actual mail. Industry and dialect breadth do not establish production prevalence or human realism. The labels have author review but no independent human adjudication. Shared authorship and repeated organisational envelopes create correlations. Structural validation is not evidence that a classifier meets the target rates, and this text-only set cannot establish Outlook runtime, latency or UI behavior.
