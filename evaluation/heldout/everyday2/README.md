# Disclosure Gate for Outlook: held-out set `everyday2`

An independent, held-out evaluation set of 360 synthetic outside emails: 300 ordinary everyday emails that must pass and 60 emails that each carry exactly one disclosure the product should question. It exists to decide whether the on-device sentence model may be switched on by default (at most 1% of ordinary outside mail questioned, at least half of the varied disclosures caught).

**Author:** Claude, model id `claude-fable-5-1` (Anthropic), working as the independent evaluation author in the `lane/everyday2` worktree.
**Written:** 23 to 24 October 2026 (validation timestamps are UTC).

## What was read

Exactly these files, and nothing else in the repository or elsewhere:

- `LANE-BRIEF.md` (the lane brief)
- `AGENTS.md`
- `SPEC.md` (product spec v2, dated 23 October 2026)
- `evaluation/heldout/README.md` (the parent set's schema, outcome definitions and composition-table contract)
- `evaluation/heldout/run.mjs` (to read the schema the runner validates)

No other held-out folder or case file, no `core/`, `model/`, `outlook/`, `test/`, `tools/` or `docs/` content, and no other worktree was opened, listed or searched. The checker, the runner, the model and the test suite were **not** run. No prior memory of this project was consulted. All people, companies, places of business and addresses are invented; every address is under `.example` or `.test`.

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
| none | 0 | 0 | 300 | 300 |
| **Total** | **60** | **0** | **300** | **360** |

The `secrets` stops are physical access and premises only (SPEC §5.1, last two bullets: door, gate, alarm, lockbox, keypad, garage, safe and Wi-Fi codes actually given; hidden keys; security gaps). There are no passwords, API keys, card or bank numbers, government identifiers, lookalike domains, exposed recipient lists or attachments anywhere in the set, by design and by validator screen.

## Files

- `cases.jsonl`: the 360 cases in the runner's schema, ids `everyday2-001` to `everyday2-360`, one JSON object per line, LF line endings (pinned by `.gitattributes`). Frozen SHA-256: `821891b906f8e5dd7a77f0c0d34ce6a9fcd57a44db2a25e61b4942512456c76d`.
- `batches/batch-01.mjs` to `batch-10.mjs`: the literal authoring files. Every subject, body, address and rationale was typed by hand into these files. Batches 1 to 8 hold 40 cases each; the last 38 cases are split across batches 9 (23) and 10 (15) because the first attempt at a single final batch was interrupted and rewritten from scratch.
- `serialize.mjs`: turns the literals into draft objects. It assigns ids in file order, adds the empty `attachments` array and the `text` body format, and defaults a recipient's `kind` to `person`. It has no templates, generation or recombination of prose.
- `validate.mjs`: dependency-free validator (Node 24). `--checkpoint` reports quotas and README agreement as warnings for partial runs; `--write-receipt` writes `validation.json` when everything passes.
- `validation.json`: the receipt from the final full validation.

Each case carries `id`, `category_expected`, `expect`, a one-line `why` citing the SPEC section, `meta` (`industry`, `variant`, `batch`) and the `draft`. Stop cases also carry `placement` (`body`, `quoted` or `subject`) and `deciding_sentence`, the one sentence quoted verbatim in `why`.

## Running it

The runner enforces a 400-case minimum on its default path, so this set is run with the `--cases` flag, which lifts the minimum to one and reads this README from the same folder:

```sh
node evaluation/heldout/run.mjs --cases evaluation/heldout/everyday2/cases.jsonl
node evaluation/heldout/run.mjs --cases evaluation/heldout/everyday2/cases.jsonl --semantic <model-dir> --json everyday2/pre-score.json
```

This author did not run it. Record the SHA-256 above against the first scored run.

## What the pass cases look like

Three hundred ordinary outside emails of the kind people send every day, written as real mail rather than as near-misses: customers, suppliers, patients, parents, tenants, members, clubs, councils and trades. They include appointment confirmations, quotes with prices and payment terms, delivery notes, order lists, progress reports, newsletters, complaints and firm requests, one-line check-ins, forwarded and quoted threads, signatures with phone numbers, and group recipients (10 cases use a `group` recipient, which SPEC §4 treats as outside). Many contain things SPEC §5 says it does not flag, because real mail does: customer-facing prices and payment terms, invoice and booking references, talk of password resets and keys without any value, absences without a stated cause, blunt criticism of goods or work, and roles and job titles.

**Industries and settings:** 351 distinct labels across the 360 cases (the quota was 60). The full list is in `validation.json`; a sample: garage, vet clinic, dental practice, primary and secondary school, youth football club, livestock agent, church, mosque, synagogue, Hindu temple, cathedral, food bank, hair salon, wedding venue, hotel, hostel, cafe, metal fabrication, agricultural laboratory, haulage, letting agent, IT support, freelance designer, highways contractor for a council, plumber, electrician, landscaper, accountant, conveyancer, estate agent, dog groomer, physiotherapist, GP surgery, pharmacy, optician, driving school, music teacher, gym, cricket club, dairy and beef farms, charity shop, brewery, winery, bike shop, car dealership, funeral director, tattoo studio, software startup, translation agency, architect, surveyor, engineering consultancy, security guarding, marquee hire, riding school, fishing charter, golf club, allotment society, residents' association, community theatre, care home, home care, locksmith, glazier, tyre shop, machinery dealer, beekeeper, nursery, university department, recruiter, insurance and mortgage brokers, travel agent, removals, cleaning, roofing, boatyard, pub, fish and chip shop, food manufacturer, textile mill, quarry, waste collection, water utility contractor, scouts, parish council, housing association, library, museum, bookshop, printer, photographer, florist, caterer, dental laboratory, hospital procurement, leisure centre, sign maker, yoga studio, farrier, cattery, pool maintenance, window cleaner, chimney sweep, piano tuner, tutor, DJ, art gallery, pottery, coffee roaster, butcher, fishmonger, cheesemaker, farm shop, garden centre, tree surgeon, skip and crane hire, ecologist, interior designer, upholsterer, auction house, jeweller, dry cleaner, tailor, bridal shop, pet shop, campsite, B&B, surf and dive schools, coach company, airport parking, ski school, tour guide, ferry, bakery, hardware store, flooring, curtains, bathrooms, decorating, handyman, paving, alarm and CCTV installers, fire safety, lift maintenance, forklift training, bookkeeper, will writer, stonemason, animal rescue, wildlife trust, cinema, rugby, choir, martial arts, kayak hire, body shop, breakdown recovery, van and trailer hire, freight forwarder, customs broker, embroidery, egg producer, agronomist, seed and feed merchants, sawmill, firewood, heating oil, heat pumps, energy assessor, student lets, serviced apartments, coworking, shredding, scrap metal, phone and computer repair, web hosting, SEO, copywriter, podcast producer, voice artist, wedding planner, celebrant, mobile bar, bouncy castles, childminder, after-school club, language and flying and sailing schools, dog walker and trainer, tennis club, osteopath, beauty salon, barber, spa, personal trainer, referees' association, athletics, netball, chess, orchestra, brass band, am-dram, youth club, community centre, zoo, bowling, escape room, soft play, climbing wall, narrowboat hire, caravan park, valeting, windscreens, motorcycles, chauffeur, same-day courier, fulfilment, packaging, framer, music shop, record and games and comic shops, art supplies, trophies, screen and label printing, warehousing, convenience store, post office, wine merchant, ice cream, greengrocer, toy shop, aquarium shop, shoe repair, laundrette, kitchens, blinds, tiler, plasterer, gutters, garage doors, sports massage, nails, ballet, swimming teacher, paddleboards, garden designer, beekeepers' association, model railway club, Rotary, PTA, ice rink, karting, archery, outdoor shop, tackle shop, hospice fundraising, chamber of commerce, exam centre, campervan hire, piano shop, bell ringers, hydroponics, pumpkin farm, alpacas, falconry, axe throwing, crazy golf, skate shop, lido, patisserie, kebab shop, sandwich shop, juice bar, sushi, trade association, networking group, mobile mechanic, drone photography, 3D printing, makerspace, toy library, village hall.

**English variants** (authored intent, by `meta.variant`): UK 227, US 48, AU 36, IE 14, CA 11, NZ 11, SG 6, IN 4, ZA 3. These are spelling, idiom and setting choices by one author, not a representativeness claim.

**Length** (body words, all 360): min 8, median 68, mean 71, max 276. Buckets: one-liners (15 words or fewer) 5, short (16 to 60) 128, medium (61 to 150) 224, long (over 150) 3. Quoted replies (lines starting with `>`): 22 cases. Bodies ending in a sign-off: 140 cases by the validator's heuristic.

## What the stop cases look like

Sixty emails, twelve per category, each with exactly one deciding sentence under SPEC §5.1 (physical access only), §5.4, §5.5, §5.6 or §5.7, quoted verbatim in the one-line `why`. The rest of each email is ordinary. No phrasing pattern is reused: the validator rejects two deciding sentences that open with the same three words, and the sentences range from blunt (`Their accounts team are morons.`) to indirect (`There's room on the delivery date, we just won't say so yet.`), from figures (`Our markup ...`) to ratios and from first person to reported speech.

**Placement of the deciding sentence:** body 40, quoted history 13 (on a `>` line, with the sender's own reply innocuous), subject 7 (with an innocuous body). The validator checks that the sentence occurs exactly once across subject and body and in its stated placement.

**Recipients:** every recipient is outside by exact domain (SPEC §4); no recipient domain equals, is a subdomain of, is within two edits of, or is a confusable or containment match of the sender's domain name. All To and Cc lists have at most 3 visible addresses. No `internal_domains`.

**Numeric screen:** no contiguous run of 9 or more digits, no 13 to 19 digit group with spaces or dashes (card-like, Luhn or not), no IBAN-like string, no SSN or NI shape, no secret-token prefix (`AKIA`, `ghp_`, `sk_live_`, `sk-`, `xoxb-`, `AIza`, PEM headers, JWT shape, connection strings). Phone numbers in signatures are 10 or 11 digits in spaced groups.

## SPEC close calls and how they were resolved

1. **A person's own health, written to them.** SPEC §5.4 flags "an identifiable person's health or medical treatment" with no exception for the person themself, yet appointment reminders from clinics, pharmacies and physios are everyday mail. Resolution: patient-facing pass cases stay at logistics level (an appointment, an order ready, flu clinic dates) and name no condition, medicine or treatment. The pharmacy notice (`everyday2-029`) is labelled pass on that basis and is the case most likely to be argued either way. If the product treats "your appointment with the hygienist" as a disclosure, that is a false finding in this set's reading of the spec.
2. **The bereaved as recipient.** A funeral director confirming arrangements with a family member (`everyday2-051`) and a florist confirming a funeral tribute (`everyday2-107`) concern a death, which §5.4 lists under family matters. Resolution: pass. The recipient's own arrangement, stated as business, discloses nothing about a third person to an outsider. Noted because a sentence model may not make that distinction.
3. **Floor price: economics or negotiation?** §5.5 explicitly lists "its floor or walk-away price" under internal economics, though it reads like a negotiation position (§5.6). Resolution: labelled `economics` where the sentence states a floor (`everyday2-198`), and `negotiation` where it states what the sender would accept or concede in a live negotiation (`We'd take 1,800 for the cow if it came to it.`). Category labels are diagnostic only; the runner scores stop versus pass.
4. **Codes given to their rightful holder.** A storage facility giving a customer the gate code, an owner giving an agent the garage code, a hall secretary giving the Wi-Fi code to a hirer. §5.1 flags a code "actually given" with no exception for a legitimate recipient. Resolution: labelled stop as the spec is written. These are the realistic cases where the product will ask "are you sure?" of someone who is sure.
5. **Advertised salary band versus a person's pay.** A recruiter telling a candidate the role pays £38 to 42k (`everyday2-083`) is a role's pay, not an identifiable person's; pass. A manager telling a recruiter what a named leaver earns is §5.4; stop (`everyday2-235`). The same stop email also says "we'll go to 55 for the right person", which is a budget for a role, not a second deciding sentence.
6. **Firm complaints.** Missed bin collections, soft haddock, a short and late delivery, three plumber call-outs that never fixed the boiler: criticism of work and blunt requests, pass under §5.7. The line was drawn at an insult aimed at a person or company (`cowboys`, `clown`, `morons`), which is stop.
7. **Security logistics without a gap.** Alarm servicing, CCTV installs, locksmith quotes, a guarding firm's shift cover and a boom gate being fixed: all pass, because no code is given and no gap is stated. A gap stated plainly (alarm off, camera not recording, gate or exit that no longer latches, an area no camera covers) is stop.
8. **Subject-only and quoted-only disclosures.** §5 reads the subject and quoted earlier messages, so a stop whose only disclosure is in the subject or in a `>` line is still a stop, even when the sender's own words are harmless. Seven and thirteen cases respectively test this.
9. **Group recipients.** Ten pass cases send to a `group` address, which §4 counts as outside. They are ordinary notices and should pass like any other outside mail.
10. **Vehicle registrations, booking references and case numbers** are not identifiers under §5.3 or references under §5.1; they appear freely in pass cases.

## Custody

Never tune rules or models on this set, including against its per-case results. Freeze it before scoring: record the SHA-256 above and the commit, and do not change cases, labels or thresholds in response to the implementation. If a label is disputed after scoring, record the dispute here rather than editing the case. A future revision needs fresh authorship under the same read restrictions and a new set name.

## Known limits

Single author and single model, so wording and names are correlated and the humour, sign-offs and sentence rhythm have one voice. Stops are placed at the end of each batch file, so case order carries information; the runner does not use order, but a reader should not. English only. No human adjudication of labels and no measured prevalence: the 300/60 split is a design choice, not a claim about how often disclosures occur. Regional variants are authored intent, not population coverage. Industries are labels of the authored scenario. The set tests the text contract only: no attachments, pictures, meetings, lookalikes, exposed lists or Outlook behaviour.
