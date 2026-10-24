# Disclosure Gate for Outlook: held-out evaluation set `everyday4`

An independent set of 360 synthetic outside emails (300 ordinary, 60 disclosures) for deciding whether the on-device sentence model may be switched on by default. The decision it serves needs at most 1% of ordinary outside emails questioned and at least half of the varied disclosures caught.

- **Author:** Anthropic Claude, model id `claude-sonnet-5-5` (an AI agent working alone; no human wrote or adjudicated any case).
- **Date:** 24 October 2026, on branch `lane/everyday4`.
- Frozen cases SHA-256: `7fddcde51d3f480d53a94cf22dc9937ebded82da6d88d050bcd1a97706aabb3c`

## What the author read

Read: `LANE-BRIEF.md` (the task), `AGENTS.md`, `SPEC.md`, `evaluation/heldout/README.md` (case schema, outcomes and the composition-table contract), `evaluation/heldout/run.mjs` (the schema it reads), and files inside `evaluation/heldout/everyday4/`.

Not read, listed or searched: every other held-out folder and case file, `core/`, `model/`, `outlook/`, `test/`, `tools/`, `docs/`, any other worktree or branch, and any prior memory of this project. The runner, the checker, the model and the repository tests were **not run**. The only code executed was `build.mjs` and `validate.mjs` in this folder.

## Custody

**Never tune rules or models on this set.** Rule authors must not read the cases, tune against them or against per-case results. Freeze before scoring: once this set has been scored, do not change cases, labels or this README in response to the implementation. A revision needs new, spec-derived authorship and a new version name. Rates measured here describe this set only.

Authoring revisions made before the freeze, and before anything was scored: 22 of the shortest early one-line emails and 14 early shorter UK disclosures were replaced by longer, list-heavy or non-UK ones for length and English variety; 24 deciding sentences were rephrased so no phrasing pattern repeats; Cc recipients were added to 30 early emails. The pass and stop counts are unchanged by those edits.

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

Reading the table: the 300 ordinary emails carry `category_expected: none` and `expect: pass`. The `secrets` row is SPEC §5.1 physical access and premises codes only (door, gate, alarm, keypad, lockbox, safe and Wi-Fi codes, where a key is hidden, security gaps); this set has no passwords, keys, tokens or card, bank or ID numbers. `personal` is §5.4, `economics` §5.5, `negotiation` §5.6, `remark` §5.7. There are no prompt cases, attachments, Bcc recipients, lookalike domains or large recipient lists. Percentages: 83.3% pass, 16.7% stop. The sixty disclosures are 12 per family.

Cases carry extra fields the runner ignores: `industry`, `english`, `placement` (`none` for ordinary emails) and, on stops, `deciding_sentence`. Each stop's `why` starts with its SPEC section and quotes the deciding sentence verbatim. Every other sentence in a stop email is ordinary.

To score later, as the parent README describes, run the parent runner with `--cases evaluation/heldout/everyday4/cases.jsonl`; its own checks read this README's table. Do that only once, after the freeze.

## Where the deciding sentence sits (60 stops)

| placement | stops |
| --- | ---: |
| body | 43 |
| quoted | 11 |
| subject | 6 |

`body` is new, unquoted text. `quoted` is a line starting with `>` in earlier history (the SPEC reads quoted messages). `subject` means the whole subject line is the sentence and the body does not repeat it. Each sentence appears exactly once in its stated place.

By family: secrets 9 body, 1 quoted, 2 subject; personal 8 body, 3 quoted, 1 subject; economics 9 body, 2 quoted, 1 subject; negotiation 9 body, 2 quoted, 1 subject; remark 8 body, 3 quoted, 1 subject.

## English variants (all 360 cases)

| variant | cases |
| --- | ---: |
| UK | 161 |
| US | 86 |
| AU | 69 |
| NZ | 12 |
| CA | 12 |
| IE | 6 |
| IN | 6 |
| SG | 5 |
| ZA | 3 |

The label is the spelling, vocabulary, currency and address style the author intended for the sender, not a measurement. Ordinary emails: UK 135, US 68, AU 59, NZ 10, CA 8, IE 6, IN 6, SG 5, ZA 3. Disclosures: UK 26, US 18, AU 10, CA 4, NZ 2.

## Length statistics (words in the body, quoted history included)

| statistic | min | median | mean | max |
| --- | ---: | ---: | ---: | ---: |
| words (pass bodies) | 8 | 57 | 66 | 228 |
| words (stop bodies) | 32 | 52 | 69 | 173 |

Ordinary emails: 15 of 30 words or fewer, 240 of 31 to 80, 22 of 81 to 150, 23 of 151 to 250. Stops: 46 of 31 to 80, 12 of 81 to 150, 2 of 151 to 250. Thirty ordinary emails are list-heavy (three or more bullets or numbered lines, usually updates, schedules, checklists or itineraries). Thirty-one ordinary emails carry quoted earlier mail starting with `>`, and 30 have a `Re:` subject. Forty ordinary emails and three disclosures copy a second outside recipient on Cc; four ordinary emails go to two people on To. Recipients are a person's display name with an address that matches the person greeted, or a role mailbox (`Receiving`, `Office`, `Yard Office`) where the email goes to a team. No email has more than four visible recipients.

## Industries and settings

Industries (299 distinct): 3D printing bureau; CNC machining; GP practice administration; IT reseller; IT support; P&C association; accountancy practice; accounts assistant freelancer; agricultural contractor; agricultural laboratory; agronomy; airport shuttle; allotment society; amateur dramatics; amateur football association; animal rescue; apple orchard; architect; art gallery; artisan bakery; audiology clinic; auto body shop; auto parts store; ayurvedic spa; band boosters; barber shop; bed and breakfast; beekeeping association; bicycle shop; bin collection contractor; board game cafe; boarding school; boat yard; bowls club; brewery; bubble tea shop; building contractor; butcher; cafe; campsite; canal boat hire; caravan dealer; care home activities; carpet fitting; catering equipment supplier; cattery; charity shop; cheesemaker; childcare centre; chimney sweep; chocolatier; church; church office; cider maker; city hotel group sales; climbing wall; coach hire; coffee roaster; coffee van; cold storage; comedy club; community choir; community hall hire; community newspaper; community pharmacy; community radio; community theatre; community transport charity; compounding pharmacy supplier; conference centre; conservation charity; conveyancing; council contractor; country hotel; county extension office; craft brewery wholesale; craft distillery; credit union; cricket club; dairy farm; dance school; decorating; dentist front desk; dive shop; dog grooming; dog rescue; driving instructor; driving school; dry cleaner; electrical contractor; employment solicitors; estate agency; event planning; family history society; farm park; farm shop; farm shop and cafe; federal contractor; feed mill; ferry operator; festival organiser; fish and chip shop; fishing charter; fishmonger; florist; food bank; food co-op; food truck; freelance app developer; freelance bookkeeper; freelance brand designer; freelance copywriter; freelance illustrator; freelance web design; freight forwarder; friends of the library; game lodge; garage; garden centre; garden machinery repair; garment factory; glazing; golf club; government training contractor; graphic designer; greenhouse grower; guitar teacher; gym; hair salon; haulage; heritage railway; historical society; holiday park; home inspection; homeowners association; honey producer; horse livery; hospital charity; hospital volunteer service; hotel conferences; hotel laundry; independent cinema; injection moulding; insurance broker; iron foundry; junior football club; kayak hire; kindergarten; kitchen and bathroom contractor; kiwifruit packhouse; landscape supply yard; landscaping; language school; large animal veterinarian; lawn bowls club; letting agent; lifeboat fundraising; livestock auction; locksmith; managed IT provider; managing agent for leaseholders; maple syrup producer; marina; market gardener; marquee hire; martial arts club; masonry contractor; metal fabrication; mining services; mobile mechanic; motorcycle dealer; mountain rescue team; moving company; museum; museum loans officer; music shop; neighbourhood cafe; notary public; nursery school; op shop; optician; orthodontic practice front desk; osteopathy; packaging supplier; paint manufacturer; pallet manufacturer; pallet network depot; parish council; parks department; party entertainer; payroll bureau; pest control; pet boarding; physiotherapy; piano teacher; piano tuner; pizzeria; planning consultancy; plant hire; plant nursery; plumber; plumbing contractor; plumbing merchant; podcast producer; podiatry; pool service; pool shop; pottery studio; primary school; primary school newsletter; print shop; private dining restaurant; private tutor; pub; recycling centre; removals; residential builder; restaurant; riding school; roofing; rowing club; rural real estate; rural supplies store; saddlery; safari tour operator; sailing club; scaffolding; school athletic department; school catering; school trip organiser; school uniform supplier; scout group; secondary school; self-storage; sheep and beef station; sheep farmer; shipping agent; sign language interpreting; ski school; soft play centre; software contractor; soil testing laboratory; solar installer; sound engineer; special school; stock agent; stonemason; student accommodation; students union; surf life saving club; surf shop; sushi bar; swimming club; swimming pool maintenance; synagogue office; tattoo studio; tax practice; taxi firm; tea exporter; tennis club; textile exporter; theatre box office; timber merchant; trampoline park; travel agency; tree surgeon; trout fishery; trucking company; tuition centre; tyre fitter; valuer and surveyor; vehicle recovery; vet practice; veterinary clinic aftercare; veterinary nursing college; veterinary referral hospital; video production; village shop and post office; voiceover artist; volunteer centre; volunteer fire brigade; water testing laboratory; water utility contractor; web hosting; wedding DJ; wedding band; wedding photographer; wedding planner; whale watching tours; wheat grower; wholesale bakery; wildlife rehabilitation; will writing; window cleaning; wine estate; winery cellar door; wool shop; yoga studio; youth soccer league.

The labels are the author's own, not a taxonomy, so near-synonyms count separately; read the count as breadth of settings (garages, vets, dentists' front desks, schools, sports clubs, farms and stock agents, churches and charities, salons, venues, hospitality, manufacturing, labs, logistics, property, IT support, freelancers, government contractors and many more), not as 299 independent populations. The sixty disclosures record their own settings in `industry`.

## Close calls and how they were resolved

Resolved by the SPEC text, not by what a classifier might do. Where the SPEC is silent the call is stated here so it can be challenged.

1. **Wi-Fi code as a premises code** (a site-office Wi-Fi code). SPEC §5.1 lists a Wi-Fi code that is actually given with door, gate and alarm codes, and the brief limits the family to premises codes, so it is a stop. A guest-network password for a coffee shop might be judged differently; none is included.
2. **Security gaps stated as plain fact** (camera dead since a storm, a side door never locked on Fridays, a gate latch that does not catch). SPEC §5.1 flags these. They are the least explicit stops; the sender volunteers them as logistics, not as a confession.
3. **Floor price: economics or negotiation.** SPEC §5.5 puts a "floor or walk-away price" under economics and §5.6 puts "what they'd accept" under negotiation. A bottom-line figure fits both; the walk-away example ("our walk-away price on a kitchen that size...") is filed as economics and the broker's "our bottom line is $410,000..." as negotiation. The scored outcome (stop) does not depend on the family.
4. **Quoted history written by someone else.** Eleven deciding sentences sit in `>` lines attributed to a colleague or a past correspondent. The SPEC reads quoted earlier messages and does not exempt them, so they count as being in the email being sent.
5. **Remarks versus blunt criticism.** SPEC §5.7 excludes criticism of work. "That firm are a bunch of amateurs and cowboys" and "their finance team couldn't organise a raffle" were kept as stops because they disparage people and companies, not a deliverable; this is the closest call in the family. No ordinary email contains criticism harsher than a delivery being late or damaged.
6. **A person's own details written to that person or their guardian.** Ordinary emails tell patients and pet owners about their own treatment, a parent about their child's start date or tuition, and a vet about a referred dog. SPEC §5.4 excludes these. They are not hard negatives by design: that is simply what clinics and schools send.
7. **A third party's illness or bereavement given to an outsider.** A teacher telling a swimming coach that a pupil's parent has MS, and a manager telling a contractor that a colleague's wife has died, are stops under §5.4 family matters, even though the sender may mean kindly.
8. **Customer-facing money.** Quotes, deposits, per-head prices, fees, payment terms, a rate card, a "total comes to" line and stated discounts appear in many ordinary emails and are passes under §5.5. The ordinary emails never state the sender's own cost, margin, markup, contingency, internal budget or floor.
9. **Absences and roles.** Ordinary emails mention staff being away or a different engineer attending, never giving a reason about health, family, pay or conduct.
10. **Greeting rule (§5.8).** Every ordinary email that opens with a name greets someone on the recipient line; role-mailbox and group greetings (`Hello,`, `Hi both,`) are used where the mail goes to a team or couple.

The hardest stops to label with confidence, in order: "Their finance team couldn't organise a raffle..." (sarcasm), the Wi-Fi code, "I'd settle for payment in 60 days if they stick on the price..." (a concession that is a term, not a figure), "Staff costs eat 62 percent of our turnover" (an aggregate ratio, not a quote), and the camera and unlocked-door gaps.

## Known limits

One AI author with correlated wording across 360 emails; the labels are not adjudicated by a human. Ordinary emails were written to look like everyday mail, not harvested from real mail, so their prevalence and messiness are unmeasured. Disclosures are single, mostly plain-spoken sentences in otherwise ordinary emails, and the stops are about 17% of the set, so a catch rate has a wide interval (60 cases). English is the only language; there are no attachments, images, meeting invitations, Bcc or large recipient lists. No scoring has been run.

## Files

- `cases.jsonl`: the 360 cases (`everyday4-001` to `everyday4-360`).
- `batches/batch-01.mjs` to `batch-13.mjs`: literal authoring files (every subject, body, sentence and rationale is typed out).
- `build.mjs`: serializer; it assigns ids and wraps recipients and adds no prose.
- `validate.mjs`: no dependencies; `--checkpoint` accepts a partial set, `--write-receipt` writes `validation.json`.
- `validation.json`: receipt from the last full validation.

Rebuild and check: `node evaluation/heldout/everyday4/build.mjs` then `node evaluation/heldout/everyday4/validate.mjs --write-receipt`.
