# Realistic outside mail, held-out tier 3

Author: **gpt-6.1-sol**. Date: **2026-10-23**. Independently written from this checkout's AGENTS.md, SPEC.md, evaluation/heldout/README.md and evaluation/heldout/run.mjs only. The parent README and runner were read for the schema, outcome definitions and composition-table contract. No other held-out folder or case file, implementation, rule, model, test, tool, documentation folder or other worktree was opened, listed or searched. No checker, model or checker-importing test was run. No prior memory was consulted. This task's narrower read and execution restrictions take precedence over the repository's general npm-test instruction.

Every email was written individually as literal text. The authoring batches record those literals; author.mjs only serializes them into draft objects. It does not select, combine, expand or generate email prose. document.mjs computes documentation statistics. The shared fictional routing addresses are neutral fixtures, not inferred identities of scenario companies. All recipients are outside by exact domain under SPEC §4.

| category_expected | stop | prompt | pass | Total |
| --- | ---: | ---: | ---: | ---: |
| secrets | 10 | 0 | 0 | 10 |
| payment | 0 | 0 | 0 | 0 |
| government_id | 0 | 0 | 0 | 0 |
| personal | 15 | 0 | 0 | 15 |
| economics | 15 | 0 | 0 | 15 |
| negotiation | 10 | 0 | 0 | 10 |
| remark | 10 | 0 | 0 | 10 |
| lookalike | 0 | 0 | 0 | 0 |
| exposed_list | 0 | 0 | 0 | 0 |
| file | 0 | 0 | 0 | 0 |
| none | 0 | 0 | 240 | 240 |
| **Total** | **60** | **0** | **240** | **300** |

Pass cases represent ordinary outside correspondence, not targeted near-misses. Every pass is labelled none. Each stop has one author-identified deciding sentence, quoted verbatim in its one-line SPEC rationale. Metadata records its position and distinct deciding verb and noun. Placement is defined structurally: subject means the whole subject; quoted_history means a body line beginning with >; body means unquoted body text. All remaining prose is intended as ordinary mail.

Length counts are Unicode characters, without metadata, routing, rationale or JSON escaping. Subject-plus-body excludes a separator. Quartiles use the lower order statistic at floor((n-1)*p); the even-sample median averages the middle pair.

| Text | Minimum | P25 | Median | P75 | Maximum | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| body_characters | 90 | 414 | 903 | 957 | 1586 | 688.46 |
| subject_plus_body_characters | 108 | 441 | 931 | 990 | 1627 | 719.37 |
<!-- length-statistics {"body_characters":{"min":90,"p25":414,"median":903,"p75":957,"max":1586,"mean":688.46},"subject_plus_body_characters":{"min":108,"p25":441,"median":931,"p75":990,"max":1627,"mean":719.37}} -->

Stop placements: body 40; quoted history 15; subject 5. Pass cases have no deciding placement.
<!-- stop-placements {"body":40,"quoted_history":15,"subject":5} -->

Intended English variants: UK 103; US 97; Australian 100. These are scenario and spelling labels, not evidence of population representativeness.
<!-- english {"UK":103,"US":97,"AU":100} -->

Industries (52): Accounting; Agriculture; Architecture; Automotive repair; Bicycle retail; Bookkeeping; Charity administration; Cleaning services; Clinic administration; Commercial law; Construction; Courier services; Dental administration; Digital agency; Education services; Energy services; Engineering consultancy; Equipment rental; Events; Exhibition design; Fitness services; Food wholesale; Freight; Furniture supply; Garden services; Healthcare administration; Hospitality; Hotel operations; Insurance administration; Language services; Legal services; Manufacturing; Museum services; Music education; Office supplies; Packaging; Print services; Property management; Public relations; Publishing; Real estate; Recruitment; Renewable energy; Research administration; Retail; Software support; Training services; Transport services; Travel services; Veterinary administration; Waste services; Water services.
<!-- industries ["Accounting","Agriculture","Architecture","Automotive repair","Bicycle retail","Bookkeeping","Charity administration","Cleaning services","Clinic administration","Commercial law","Construction","Courier services","Dental administration","Digital agency","Education services","Energy services","Engineering consultancy","Equipment rental","Events","Exhibition design","Fitness services","Food wholesale","Freight","Furniture supply","Garden services","Healthcare administration","Hospitality","Hotel operations","Insurance administration","Language services","Legal services","Manufacturing","Museum services","Music education","Office supplies","Packaging","Print services","Property management","Public relations","Publishing","Real estate","Recruitment","Renewable energy","Research administration","Retail","Software support","Training services","Transport services","Travel services","Veterinary administration","Waste services","Water services"] -->

All people, companies and scenarios are invented. All routable addresses use .example or .test. No real correspondence, personal records, passwords, API keys, payment-card numbers, bank details or government identifiers were used. The access stops concern physical premises only. There are no attachments, lookalike routes or large visible recipient lists.

Custody: **Never tune rules or models on this set**, its deciding sentences, per-case results or paraphrases. Freeze before scoring. Evaluate without case changes in response to outcomes; use separately authored development data for fixes. These synthetic single-author labels have no independent human adjudication and do not establish production prevalence, acceptable release thresholds, Outlook integration, latency or runtime coverage.

Standalone verification: node evaluation/heldout/realistic3/validate.mjs --write-receipt. It reads only cases.jsonl and this README in this tier, and writes validation.json when requested. During authoring, --checkpoint allows incomplete quotas while retaining schema and documentation checks. Final validation enforces the full composition and requested placement and length quotas. Numeric/credential screens and the deciding-key checks are structural safeguards, not a semantic classifier.

Validator verification on 2026-10-23: validate-selftest.mjs accepted the unmodified tier before and after rejecting twenty deliberately invalid mutations for the expected reasons. It used temporary copies wholly inside this tier and removed those copies afterwards. The mutations cover schema, IDs, duplicate bodies, domains, routing, visible recipients, attachments, rationale, table/statistic agreement, deciding-sentence occurrence and placement, numeric fixtures and regional metadata. No source case was changed by the self-test.

SPEC ambiguity: none requiring a changed label. Clinic letters contain appointment logistics only, not conditions or treatment. Legal letters concern company contracts only. Customer prices and actual offers are distinguished from own costs and undisclosed negotiating flexibility under §§5.5–5.6. The set measures §5 outcomes; SPEC §3 currently defaults the model to Off, so any decision to change that default remains a separate product decision.
