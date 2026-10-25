# Disclosure Gate for Outlook: held-out set everyday7a (round 7)

Written by Anthropic **Claude Sonnet 5.5** (`claude-sonnet-5-5`) as the independent test-lane author, on 24 October 2026, in the worktree `lane/everyday7a`. The brief was `LANE-BRIEF.md` (not committed). The last set of this kind was too easy because its disclosures were stated plainly; this one hides them the way real mail does. It measures the shipped product. Nothing may be tuned on it.

## What was read

Read in full: `LANE-BRIEF.md`, `AGENTS.md`, `SPEC.md` (product spec v2, dated 23 October 2026), `evaluation/heldout/README.md` and `evaluation/heldout/run.mjs`. No other file in the repository was opened, read or searched, and the runner, checker, model and tests were not run. Two disclosures: a directory listing of the repository root and of `evaluation/heldout/` ran before the allowed files were read, so I saw that earlier case files and an `everyday` folder exist; I opened none of them. The session also loaded a memory index automatically; I opened no memory note and used nothing from it.

All people, companies and addresses are invented. Every address (sender and recipients) uses `.example` or `.test`. A name that matches a real organisation or person is a coincidence. There are no attachments, no lookalike domains, no card-like, IBAN-like or SSN-like numbers, and no list longer than four recipients. Every recipient is outside by exact domain (SPEC §4); no case sets `internal_domains`, so the only inside domain is the sender's own.

## Composition

| category_expected | stop | prompt | pass | Total |
| --- | ---: | ---: | ---: | ---: |
| secrets | 12 | 0 | 0 | 12 |
| payment | 0 | 0 | 0 | 0 |
| government_id | 0 | 0 | 0 | 0 |
| personal | 12 | 0 | 0 | 12 |
| economics | 12 | 0 | 0 | 12 |
| negotiation | 12 | 0 | 0 | 12 |
| remark | 12 | 0 | 0 | 12 |
| lookalike | 0 | 0 | 0 | 0 |
| exposed_list | 0 | 0 | 0 | 0 |
| file | 0 | 0 | 0 | 0 |
| none | 0 | 0 | 200 | 200 |
| **Total** | **60** | **0** | **200** | **260** |

`secrets` holds the SPEC §5.1 physical-access and premises-security stops only (door, gate, alarm, lockbox and safe codes, hidden keys, cameras down, a broken lock); no passwords, keys, card, bank or ID numbers. `personal` is §5.4, `economics` §5.5, `negotiation` §5.6 and `remark` §5.7. The 200 passes are 100 ordinary everyday emails and 100 boundary emails. Category labels are the intended test family; the returned finding categories are diagnostic, as in the runner.

Scoring command for the product owner (not run by the author): `node evaluation/heldout/run.mjs --cases evaluation/heldout/everyday7a/cases.jsonl`. The runner ignores the extra `meta` object on each case.

## Files

- `cases.jsonl`: the 260 cases, schema as in `evaluation/heldout/README.md` plus a `meta` object (kind, industry, variant, placement, hardness dimensions, deciding sentence, setting, messy kinds, boundary label).
- `batches/b01.mjs` to `b09.mjs`: the authored literals (every subject, body and rationale is written out by hand).
- `build.mjs`: the serializer. It only turns the literals into draft objects, assigns ids and writes `cases.jsonl`. It writes no prose.
- `validate.mjs`: no dependencies. `node validate.mjs` runs the full checks; `--checkpoint` relaxes quotas and README agreement for partial sets; `--stats` prints length, placement, variant, sector and boundary summaries.
- `.gitattributes`: exactly `* -text`, committed before any case file, so the bytes never change on checkout.

## The 60 stops

Each stop has exactly one deciding sentence. It is a single line, quoted verbatim in the case's one-line SPEC rationale, and the validator checks that it occurs exactly once in the stated placement. 51 are in the body, 7 are in quoted history (lines starting with `>`), and 2 are in the subject line. A stop carries one or two hardness dimensions:

1. `implicit`: the fact is clear to a reader but no obvious keyword says it.
2. `buried`: one sentence in a long email (400+ words), a dense list (5+ items), or deep in quoted history.
3. `unlabelled`: figures whose meaning comes only from context.
4. `casual`: casual, misspelled, abbreviated or non-native English, or regional usage (Scots, Irish, Australian, Indian and others).
5. `hedged`: the disclosure sits inside a friendly, ordinary sentence or next to a legitimate statement.

| dimension | stops using it |
| --- | ---: |
| implicit | 23 |
| buried | 14 |
| unlabelled | 11 |
| casual | 20 |
| hedged | 24 |

Buried splits into 3 long emails of 400+ words (439 words at most), 4 dense lists and 7 pieces of quoted history. Placement and dimensions for every stop:

| id | category | placement | dimensions | variant |
| --- | --- | --- | --- | --- |
| everyday7a-003 | personal | body | implicit, hedged | uk |
| everyday7a-006 | remark | body | implicit, hedged | uk |
| everyday7a-009 | negotiation | body | implicit, unlabelled | us |
| everyday7a-012 | economics | body | implicit | uk |
| everyday7a-015 | remark | body | hedged | uk |
| everyday7a-019 | economics | body | unlabelled | us |
| everyday7a-023 | secrets | quoted | buried, casual | au |
| everyday7a-026 | personal | quoted | buried | uk |
| everyday7a-028 | negotiation | quoted | buried, hedged | ie |
| everyday7a-037 | secrets | body | buried | uk |
| everyday7a-040 | secrets | body | casual | in |
| everyday7a-043 | personal | body | casual, implicit | uk |
| everyday7a-045 | economics | body | buried, hedged | uk |
| everyday7a-048 | economics | body | implicit, casual | au |
| everyday7a-051 | negotiation | body | unlabelled, implicit | us |
| everyday7a-054 | negotiation | body | casual | in |
| everyday7a-057 | remark | body | casual | other |
| everyday7a-060 | remark | body | hedged | uk |
| everyday7a-072 | secrets | body | implicit, hedged | uk |
| everyday7a-075 | personal | subject | hedged | uk |
| everyday7a-078 | secrets | quoted | buried, unlabelled | uk |
| everyday7a-081 | personal | body | implicit, casual | ie |
| everyday7a-084 | economics | body | implicit | uk |
| everyday7a-087 | economics | body | buried, implicit | uk |
| everyday7a-090 | negotiation | body | hedged | uk |
| everyday7a-093 | remark | body | casual, hedged | uk |
| everyday7a-096 | remark | body | hedged, casual | uk |
| everyday7a-111 | secrets | body | unlabelled, casual | uk |
| everyday7a-114 | personal | body | casual | in |
| everyday7a-118 | secrets | body | hedged | uk |
| everyday7a-121 | economics | quoted | buried | uk |
| everyday7a-124 | remark | body | implicit, hedged | uk |
| everyday7a-127 | negotiation | body | implicit, casual | ie |
| everyday7a-130 | personal | body | buried, hedged | us |
| everyday7a-133 | negotiation | body | buried, implicit | us |
| everyday7a-136 | remark | quoted | buried, casual | uk |
| everyday7a-145 | secrets | body | unlabelled, casual | au |
| everyday7a-148 | secrets | body | implicit, hedged | uk |
| everyday7a-151 | personal | body | implicit | uk |
| everyday7a-154 | economics | body | implicit | uk |
| everyday7a-157 | economics | body | buried, unlabelled | uk |
| everyday7a-160 | negotiation | body | unlabelled | us |
| everyday7a-164 | remark | body | casual, hedged | au |
| everyday7a-177 | secrets | body | casual, implicit | ie |
| everyday7a-180 | economics | body | implicit, hedged | uk |
| everyday7a-183 | personal | body | unlabelled, implicit | uk |
| everyday7a-186 | negotiation | body | implicit | uk |
| everyday7a-189 | remark | body | casual | other |
| everyday7a-193 | economics | body | casual | in |
| everyday7a-196 | personal | body | hedged | uk |
| everyday7a-199 | secrets | body | buried, hedged | uk |
| everyday7a-204 | negotiation | body | hedged | uk |
| everyday7a-206 | secrets | body | unlabelled, casual | uk |
| everyday7a-211 | personal | subject | hedged | uk |
| everyday7a-214 | negotiation | body | implicit | us |
| everyday7a-218 | remark | body | hedged | us |
| everyday7a-232 | personal | body | hedged | uk |
| everyday7a-235 | economics | body | implicit, casual | uk |
| everyday7a-238 | negotiation | quoted | buried, unlabelled | ie |
| everyday7a-242 | remark | body | hedged | uk |

## The 100 ordinary everyday passes

Written the way people write work email, not tidied: lowercase openers, fragments, no signature, typos left in. 100 distinct settings (the `meta.setting` of each case). 70 of the 100 are messy in at least one of these ways; 30 are plain ordinary mail. The validator checks that each tag is structurally true (a chain has quoted lines or an Original Message block, a forward has a forwarded block, a terse email is 40 words or fewer, a footer email has a signature or legal footer).

| messy kind | emails |
| --- | ---: |
| banter | 15 |
| forward | 10 |
| chain | 10 |
| emotion | 15 |
| terse | 14 |
| footer | 11 |
| any messy | 70 |

- `banter`: casual teasing, jokes, sarcasm and mild swearing between people who know each other; nobody is insulted.
- `forward`: a forwarded newsletter, article or press release with a one-line note on top.
- `chain`: a reply with quoted history (`>` lines or an `-----Original Message-----` block). The chains are two or three levels deep and short, not long threads.
- `emotion`: enthusiasm or frustration about weather, traffic, sport, markets or a project.
- `terse`: one-liners and fragments.
- `footer`: signatures, disclaimers and legal footers (confidentiality lines addressed to the recipient, regulator and company-registration lines, "Sent from my phone").

## The 100 boundary passes

Each sits right on a line SPEC §5 draws and stays on the safe side of it; its `why` names that line. By the SPEC section each rationale cites: §5.4 28, §5.1 19, §5.5 15, §5.7 15, §5.6 9, §5.2 6, §5.10 5, §5.3 3. By boundary (each case's `meta.boundary`, grouped by its main theme):

| boundary | cases |
| --- | ---: |
| prices, quotes, contract values, invoice amounts, payment terms and discounts shown to the customer (§5.5) | 13 |
| an offer or proposal actually made to the recipient (§5.6) | 9 |
| criticism of work, blunt disagreement or a firm request (§5.7) | 15 |
| a person's own details (health, pay, HR, tax, result) written to that person (§5.4) | 8 |
| a child's health or injury written to the parent (§5.4) | 4 |
| animal health written to the pet owner (§5.4) | 7 |
| names, job titles, roles, absence or cover without a stated cause (§5.4) | 9 |
| a company's own legal matter stated as business (§5.4) | 1 |
| a budget line or change order named without an internal figure (§5.5) | 3 |
| public, by-design or logistics access with no code or hiding place given (§5.1) | 8 |
| talk about passwords, placeholder credentials, promo and voucher codes (§5.1) | 9 |
| order, invoice, PO, tracking and phone numbers; last four card digits; card brands; a bank name alone (§5.2) | 6 |
| identifier words with no number (§5.3) | 3 |
| inside-only wording that does not flag: "our internal team", "please don't forward this link", confidentiality and company-confidential footers (§5.10) | 5 |

## Industries, English variants and length

Industry sectors by keyword on each case's `meta.industry` (an approximate grouping; the metadata holds 232 finer labels): hospitality, events, media and leisure 68; property, construction and engineering 61; professional services (law, accounting, consulting, HR, recruitment) 49; health, veterinary and education 31; technology and software 28; logistics, freight and transport 11; other 12.

Intended English variant (`meta.variant`, the author's label for the spelling and idiom used, not a measured representation): UK 192, US 38, Irish 11, Australian 6, Indian 5, Canadian 1, other non-native 7. Among the 60 stops: UK 37, US 8, Irish 5, Australian 4, Indian 4, other non-native 2.

Length in words, subject and body together:

| group | n | min | median | mean | max |
| --- | ---: | ---: | ---: | ---: | ---: |
| stops | 60 | 35 | 56.5 | 76.3 | 439 |
| everyday passes | 100 | 7 | 52 | 54.9 | 134 |
| boundary passes | 100 | 23 | 45 | 46.2 | 78 |
| all | 260 | 7 | 50 | 56.5 | 439 |

Three stops are over 400 words (045, 087 and 199 in the table above); no pass is over 134 words.

## Close calls

These are the author's labelling decisions most likely to be argued with. None was changed after being written down here.

- **A jibe at competence (stop 218)**: "Marguerite couldn't sell water in a desert" is labelled a §5.7 disparaging remark about a person; a reader could call it criticism of ability rather than of work.
- **Stop 235**: "Don't ever sell below 4.20 a kilo, that's what the wholemeal costs us to mill" is an instruction to the recipient that carries the sender's own cost. It is labelled §5.5 (cost and floor). It was reworded once, before freezing, to remove the first version's ambiguity.
- **Negotiation stops written to third parties**: SPEC §5.6 does not flag an offer made to the recipient, so the stops state a position to someone who is not the counterparty (an adviser, a partner, an outside lawyer, a supplier). A product that treats "I'd go to 8%" as an offer to a third party would miss for a defensible reason.
- **Family illness (stops 114 and 211)**: a named person's wife in hospital for cancer treatment (114) and a colleague's mother starting chemotherapy (211) are labelled §5.4 family matters, although the patient is not the person named as absent in the sentence.
- **Katie's pay (stop 183)**: sent to a hiring manager. Labelled §5.4 (a person's pay); it could also be read as a §5.6 hint.
- **Own details to the person at a private address**: the pay review letter, the performance-plan letter, the self-assessment figure and the clinic results are boundary passes under §5.4 ("a person's own details written to that person"). A product that keys on the HR words will false-stop here; that is the point of the case.
- **A company's legal matter**: the supplier dispute letter is a pass because SPEC §5.4 lists "a company's own legal matters stated as business" as not flagged.
- **Access logistics**: the visitor buzzer, the reception badge and the concierge keys are passes because no code or hiding place is given.
- **Placeholder credentials** such as `sk-xxxx` and `ghp_xxxx` follow SPEC §5.1's placeholder exclusion literally.

## Known limits

Single author and model, with correlated wording and recurring name patterns. The set is UK-skewed (192 of 260 cases), the regional-English share is small beyond the 20 `casual` stops, and the industries are broad but each appears few times. Each stop has one deciding sentence by construction, so it cannot say how the product handles several disclosures in one email. The pass labels come from the author's reading of SPEC §5, with no independent human adjudication. It is a text-draft contract test: no attachments, no meeting invitations, no Outlook-host behaviour, and no check on the sender-facing copy. The author did not run the product, so the weakest point (the difficulty of the set against the real product) is untested.

## Custody

Never tune on this set. Rule and model authors must not read these cases or per-case results, and must not change cases, labels or thresholds in response to scoring. Freeze before scoring: score once from the committed file and report the numbers. A revision needs fresh spec-derived authorship and a new version name.

Frozen `cases.jsonl` SHA-256: `380c48f541ca05d1e88c4997803b1605c06e20d4c3c399b8f1fdb729f86f0d4e`.
