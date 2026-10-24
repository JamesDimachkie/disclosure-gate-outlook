# Everyday tier: ordinary outside email

A held-out set that measures how often Disclosure Gate for Outlook asks needlessly about the email a
typical company sends outside in an ordinary week. Every case must pass: `expect: "pass"`,
`category_expected: "none"`, at least one outside recipient, and no disclosure that SPEC §5 says to
flag.

Status: frozen on 2026-10-23 at 200 cases. The cases SHA-256 is in `validation.json`.

## Provenance

- Author model: `claude-opus-5-5` (Claude Opus 5.5), 2026-10-23, in two sessions.
- Session 1 wrote 120 messages in `source/batch-01.mjs` to `batch-06.mjs` and lost its connection
  before committing. Its last built `cases.jsonl` held only the first 80 of them, and one of those
  (everyday-036) had since been reworded in the source to drop a remark about pupils' wheelchair use.
- Session 2 rebuilt from the source, reviewed all 120 messages against SPEC §5 and kept them. It
  changed one line: in everyday-069, a director's loan repayment became a fixed-asset note, to keep
  a person's finances out. It then wrote everyday-121 to everyday-200 (`batch-07.mjs` to
  `batch-10.mjs`), added `validate.mjs`, and committed checkpoints at 120, 160 and 200 cases.
- Session 2 read only `AGENTS.md`, `SPEC.md`, `evaluation/heldout/README.md` (custody context),
  `evaluation/heldout/run.mjs` (case schema, README table format, outcome classes) and this
  directory. It did not open, list or search `evaluation/heldout/cases.jsonl`,
  `evaluation/heldout/realistic*/`, `core/`, `outlook/`, `test/`, `tools/`, `model/` or `docs/`,
  never ran `run.mjs`, and never imported the checker. Session 1 worked under the same brief; its
  reading cannot be verified independently.
- Every message is written individually in `source/batch-*.mjs`. `source/build.mjs` only serializes
  those literal messages into the `run.mjs` draft shape, numbers them and base64-encodes the
  attachments. It generates no text.

## Composition

| category_expected | stop | prompt | pass | Total |
| --- | ---: | ---: | ---: | ---: |
| secrets | 0 | 0 | 0 | 0 |
| payment | 0 | 0 | 0 | 0 |
| government_id | 0 | 0 | 0 | 0 |
| personal | 0 | 0 | 0 | 0 |
| economics | 0 | 0 | 0 | 0 |
| negotiation | 0 | 0 | 0 | 0 |
| remark | 0 | 0 | 0 | 0 |
| lookalike | 0 | 0 | 0 | 0 |
| exposed_list | 0 | 0 | 0 | 0 |
| file | 0 | 0 | 0 | 0 |
| none | 0 | 0 | 200 | 200 |
| **Total** | **0** | **0** | **200** | **200** |

The mail covers quotes, invoices and offers actually made; scheduling, delivery and site logistics;
project updates and support replies; recruiting and HR-policy talk with candidates and agencies;
clinic, legal, accounting and agency client correspondence; politely handled complaints and blunt
disagreement; thank-yous, introductions and partner newsletters; out-of-office replies; meeting
notes; and signatures with confidentiality or regulatory disclaimers.

- 11 cases carry quoted reply history and 6 are out-of-office replies.
- 8 cases carry a small readable `.txt` or `.csv` attachment (meeting notes, price lists, an order,
  a programme, a feed test, a stallholder pack, a parts list).
- 8 newsletters and notices put their outside recipients in Bcc, as a careful sender would. No case
  shows a To/Cc list at §5.8's exposed-list threshold.

## Length

Body text, in characters: minimum 57, lower quartile 889, median 1,033, upper quartile 1,191,
maximum 2,897, mean 1,041. 14 bodies are under 300 characters (short replies and arrival notes), 165
are between 600 and 1,500, and 9 are over 2,000 (threads with quoted history).

## English and industries

UK 66, US 71, Australian 63.

66 industry labels. More than one case: legal (12), accounting (11), construction (10), healthcare
clinic (9), nonprofit (9), recruitment (9), SaaS (9), hospitality (8), manufacturing (8),
engineering (7), logistics (7), architecture (6), events (6), marketing agency (6), IT services (5),
property management (5), agriculture (4), real estate (4), trades (4), education and training (3),
insurance brokerage (3), printing (3), software development (3), freight forwarding (2), higher
education (2), property development (2), retail (2), telecoms (2), veterinary (2).

One case each: automotive, brewing, catering, coffee roasting, consulting, dental laboratory,
education, education services, environmental consulting, equipment hire, facilities, fashion
wholesale, film production, fitness, food production, gift retail, interior design, landscape
design, medical device distribution, packaging manufacturing, payroll bureau, pest control,
photography, public relations, publishing, removals, solar installation, sports club, staffing,
translation services, travel, video production, vocational training, web design, wholesale,
wholesale food, winery.

## Fictional data

All people, companies, addresses and events are invented. Every address uses a reserved `.example`
or `.test` domain. Phone numbers are invented; many use published fictional or drama ranges (UK
01632 960, 07700 900 and 0113 496 0; US 555; AU 0491 570 and 5550). Prices, quotes, fees and
invoice figures are made up and are amounts the sender states to the customer. Registration numbers
in signatures are the sender's own and are invented. Clinic mail contains no patient's health
details; the two veterinary cases concern animals. Any resemblance to a real person, business or
record is accidental.

## Validation

`node evaluation/heldout/everyday/validate.mjs` checks this tier only. It never imports the checker.
It checks:

- the `run.mjs` schema and this README's table, with none/pass on every case;
- sequential unique ids, and unique bodies and subjects;
- reserved domains and at least one outside recipient;
- no To/Cc list at the §5.8 threshold, and no outside domain that resembles an inside one;
- canonical base64 with exact byte sizes for readable UTF-8 `.txt`/`.csv` files, and at most 15
  attachment cases.

`--write-receipt` writes `validation.json` with the cases SHA-256, counts, length statistics and
industries.

## Custody

Never tune rules or models on this set, and never read its cases to fix a rule. Report results
only. A revision needs new authorship and a new version; do not edit these cases or labels in
response to a run.

## Known limits

One author model wrote every message, so wording, names and situations are correlated. Whether each
message is free of §5 disclosures is that author's reading of the spec, not an independent human
adjudication. A few cases sit near §5 wording because ordinary mail does: password-reset help,
"keys at the service desk", a client's own profit figure from their accountant, a client's
approved ad budget, the sender's own business number in a signature. The author labels them pass
under the spec's text, and a reader may disagree. Rates measured here describe this set, not
production mail.
