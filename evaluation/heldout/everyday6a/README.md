# everyday6a: hard held-out set for Disclosure Gate for Outlook

Written on 24 October 2026 by Anthropic **claude-fable-5-1** as the independent evaluation author, from this
worktree's `SPEC.md` (product spec v2, 23 October 2026), `AGENTS.md`, `evaluation/heldout/README.md` (schema and
table contract) and `evaluation/heldout/run.mjs` (the schema the runner reads). Nothing else in the repository was
opened, listed or searched: no earlier evaluation set, no rule code, no model, no tests, no docs. The runner, checker,
model and tests were not executed. No prior memory of this project was consulted.

**Custody:** never tune on this set. Rule and model authors must not read the cases or their per-case results. Freeze
the file before scoring and score it once; after scoring, do not change cases, labels or thresholds in response to the
implementation. A revised set needs fresh spec-derived authorship and a new version.

Frozen `cases.jsonl` SHA-256: `c1748ca0b20b3403a61100fc4c0a781ab3a77e41e91d5f2da163062289a5aa98`. The folder's
`.gitattributes` (`* -text`) was committed before any case bytes so the hash survives checkout on every platform.

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

The `secrets` row holds only SPEC §5.1 physical access and premises security (codes actually given, hidden keys,
security gaps): no passwords, keys, card, bank or ID numbers appear anywhere in the set. The 200 passes split into
100 ordinary everyday outside emails (`meta.kind: ordinary`, 100 distinct settings) and 100 boundary passes
(`meta.kind: boundary`) that sit on a line the SPEC draws and stay on the safe side of it. Every recipient is outside by
exact domain under §4; every address uses `.example` or `.test`; all people and companies are invented; there are no
attachments, lookalike domains, admin domain lists or recipient lists above four addresses.

## What the set measures

The previous set of this kind was too easy because the disclosures were stated plainly. Here every stop has exactly one
deciding sentence, quoted verbatim in its one-line `why`, and is made hard the way real mail is hard. Each stop carries
one or more of five hardness dimensions in `meta.hardness`; 26 of the 60 carry two.

| Dimension | Stops | Cases |
| --- | ---: | --- |
| implicit (clear to a reader, no obvious keyword) | 22 | 001 008 011 013 015 017 021 023 024 025 026 028 032 033 035 037 043 047 049 055 057 059 |
| buried (long email, dense list or quoted history) | 14 | 003 004 010 013 018 019 029 030 036 041 042 052 053 058 |
| numbers without labels | 18 | 002 007 010 012 017 024 026 029 030 031 033 034 036 038 039 041 045 047 |
| casual, misspelled, abbreviated, non-native or regional | 21 | 001 005 006 009 012 016 019 020 021 023 027 031 034 039 044 045 048 051 054 055 059 |
| hedged or mixed with a legitimate statement | 11 | 006 011 014 022 028 035 040 046 050 056 060 |

Buried stops: five long emails of 400 to 591 words with one deciding sentence (004, 018, 029, 041, 052); four dense
lists where the deciding line is one bullet (010, 013, 036, 058); five quoted histories where the deciding line sits
two levels deep behind `>` markers (003, 019, 030, 042, 053).

Placements (`meta.placement`): 54 in the new body text, 5 in quoted history, 1 in the subject line (012). Regional
usage across the set: UK 206, US 23, Australian 11, Irish 9, Indian 8, and one each New Zealand, Singapore and Canada
(`meta.variant`). Stops by category: secrets 001-012, personal 013-024, economics 025-036, negotiation 037-048,
remark 049-060.

## Industries and length

172 distinct industry labels (`meta.industry`). The stops alone span 49: construction and its trades (civil, electrical,
mechanical, glazing, roofing, shopfitting, interior fit-out, structural engineering, architecture, landscape
architecture), property (commercial, lettings, development, management), facilities and cleaning, logistics and
warehousing, wholesale and retail, hospitality and events, agriculture and agri-supply, software, IT services, web
development, AV, packaging, drinks, print, branding, marketing and advertising, recruitment, accounting, consulting,
professional services, manufacturing and industrial equipment, community arts and a sports club. The passes add
healthcare and veterinary practices, schools and nurseries, councils and parish bodies, charities, law firms, insurance,
travel, hotels, garages, salons, gyms, libraries, museums, clubs and societies, and personal mail.

Body length in words:

| Group | n | min | median | mean | max |
| --- | ---: | ---: | ---: | ---: | ---: |
| stop | 60 | 30 | 56 | 107 | 591 |
| boundary pass | 100 | 37 | 64 | 63 | 85 |
| ordinary pass | 100 | 29 | 53 | 54 | 183 |
| all | 260 | 29 | 59 | 70 | 591 |

## Boundary passes

Each boundary case's `why` and `meta.boundary` name the SPEC line that keeps it safe.

| SPEC line | Cases |
| --- | --- |
| §5.5 customer-facing prices, quotes, invoice amounts, contract values, charges, discounts and payment terms; a budget line or change order named without an internal figure | 061 065 071 075 081 083 084 086 108 109 110 111 119 121 124 125 126 144 145 147 156 |
| §5.6 an offer or proposal actually made to the recipient (including a tender return and a revised offer) | 068 082 085 122 123 146 |
| §5.4 a person's own details written to that person (results, salary, hearing date, treatment, job offer, warning, eye test, bereavement leave, claim) | 062 087 088 089 090 091 127 128 129 130 |
| §5.4 a person's own details written to the parent or guardian they concern | 070 092 093 094 131 132 |
| §5.4 an animal's health written to its owner | 067 095 096 097 133 134 |
| §5.4 names, roles, absences without a stated cause, schedules, rotas and contact lists | 066 077 080 112 113 114 115 116 148 149 150 151 |
| §5.4 a company's own legal matters stated as business | 074 155 |
| §5.7 criticism of work, drawings or schedules; blunt disagreement and firm requests | 063 072 098 099 100 101 102 120 135 136 137 138 159 |
| §5.1 key, code or access in ordinary logistics; public access information; talk about passwords without one; promo codes; a code referred to but withheld; a live alarm being serviced; order, tracking and booking references | 064 069 073 078 079 103 104 105 106 107 139 140 141 142 143 152 153 154 160 |
| §5.2 the last four digits of a card | 118 |
| §5.10 footers addressed to the recipient, "company confidential", "our internal team", "please don't forward this link" | 076 117 157 158 |

## Close calls

These are the hardest judgments in the set, recorded so a reviewer can disagree before scoring, not after.

- **028** "a bit of fat in the groundworks line": contingency or margin on an item without either word. Kept as §5.5
  because padding in a priced line is what the sentence says to any contractor; the hardest call among the stops.
- **011** the hidden key is never called a key ("the one for the back door is taped inside the gas meter box"). Kept
  because the hiding place is unmistakable to the reader.
- **035** margin given as "18 points", **032** margin given as a ratio between labour and materials, **025** cost
  given as a share of the quoted price: all §5.5 as ratios, which the spec names explicitly.
- **017** and **024** pay and bonus as bare figures ("on 54 and has asked for 60", "8k on top at year end"). The
  surrounding words (review, year end) fix the meaning.
- **040** and **042** are sent to the negotiation counterparty itself rather than to an adviser; the leaked position is
  the same disclosure under §5.6.
- **056** pairs an insult with criticism of the drawings. The deciding sentence is the whole sentence; the drawings
  clause alone would not flag.
- **057** "like talking to a wall with a grudge" has no insult word; kept as a disparaging remark about a company.
- **006** the Wi-Fi password is given with the word "wifi" present; its hardness is the friendly, hedged framing.
- **112** (pass) says the driver "is on holiday": a stated cause, but not a health, family, legal or HR matter, so §5.4
  does not reach it.
- **129** (pass) confirms compassionate leave to the bereaved employee at a personal address: the father's death is the
  recipient's own family matter, written to them.
- **142** (pass) describes an alarm service visit with the system staying live: talk about a security system, with
  neither a code nor a gap.
- **105** (pass) refers to a gate code and withholds it; **158** (pass) uses the spec's own exempt phrase.

Left out as judgment calls: a §5.5 sentence saying design hours "came in under what we budgeted" with no figure
(the spec's does-not-flag line on budget names without internal figures covers it), and a gate code given only as
"the year the shop opened".

## Files

- `cases.jsonl`: 260 cases in the runner's schema, one JSON object per line, LF line endings, keys `id`,
  `category_expected`, `expect`, `why`, `meta`, `draft`. The `meta` object is the author's annotation (kind, industry,
  variant, setting; for stops placement, hardness, buried kind and deciding sentence; for boundary passes the SPEC
  line) and is ignored by the runner.
- `batches/batch-01.mjs` to `batch-07.mjs`: the authored literals. Every subject and body is written by hand in these
  files; there are no templates, generators or combinations of prose.
- `serialize.mjs`: turns the literals into runner case objects and writes `cases.jsonl`. It pads the numeric id, maps
  recipients to the runner's shape and copies the annotation; it changes no text.
- `validate.mjs` (no dependencies; `--checkpoint` for partial runs): LF-only file, sequential ids, key order, schema as
  `run.mjs` reads it, quotas (12 stops per category, 100 boundary and 100 ordinary passes, at least 60 ordinary
  settings, at least 8 stops per hardness dimension), duplicate bodies and deciding sentences, outside-only recipients
  with no lookalike or subdomain relation to the sender, 1 to 4 recipients, the deciding sentence present verbatim
  exactly once in its stated placement and quoted in `why`, buried-kind rules (400 words for long, a list item for
  list, a `>` line for quoted), a numeric and credential screen (card-like, IBAN-like, SSN-like, NI-like, long digit
  runs, key prefixes), §5.10 phrases, greeting-to-recipient agreement, and README table and hash agreement in the
  runner's exact format.
- `.gitattributes`: `* -text`.

## Running

`run.mjs` requires 400 cases when it reads its own directory. This set is run with the `--cases` flag, which reads the
README from the same directory and lowers the minimum:

```sh
node evaluation/heldout/run.mjs --cases evaluation/heldout/everyday6a/cases.jsonl
node evaluation/heldout/everyday6a/validate.mjs
```

The runner was not executed by the author. No result for this set exists yet; the first run is the scoring run.

## Known limits

One author and one model wrote every case, so wording habits recur (short thanks, sign-off names, UK trade settings
dominate). Hardness is authored, not measured: the dimensions record how a case was made difficult, not how difficult
a reader found it. There is no human adjudication of labels; the close-calls list is the author's own doubt, and the
weakest stops are the ones that rely on a reader inferring a quantity's meaning (017, 024, 028, 035). The set has one
intended finding per stop and no multi-finding emails, no attachments, no meetings, no inside-only controls and no
prompt-severity cases; it measures §5.1 (physical), §5.4 to §5.7 and the pass boundaries only.
