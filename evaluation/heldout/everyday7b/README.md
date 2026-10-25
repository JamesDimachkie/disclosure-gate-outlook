# everyday7b — independent held-out text cases

Author: OpenAI gpt-6-astra. Date: 2026-10-24. All people, organizations, messages and circumstances are invented.

Read: LANE-BRIEF.md, AGENTS.md, SPEC.md, evaluation/heldout/README.md and evaluation/heldout/run.mjs only, plus this lane's own deliverables. The permitted parent README includes historical aggregate results and illustrative examples; those were visible while reading the schema/table contract. No earlier case files, implementation, model, tests, other worktree or project memory were consulted. No checker, model, runner or repository tests were executed. The lane brief's explicit prohibition supersedes AGENTS.md's generic npm test requirement.

Custody: never tune on this set, its labels, or its case-level results. Freeze the committed cases and SHA-256 before scoring. No scoring has taken place. Future changes after scoring require a new version and independent authorship.

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

Ordinary everyday passes: 100; boundary passes: 100. Distinct ordinary settings: 100.

## Length and placement

Whitespace word counts include subject and body, including quoted text and footers: min 6, median 35, max 91, mean 38.2.

- body: 250 total; 50 stops.
- quoted: 5 total; 5 stops.
- list: 5 total; 5 stops.
- subject: 0 total; 0 stops.

Buried cases use dense lists or deep quoted history; this set does not claim a 400-word long-body stratum. A quoted deciding sentence excludes its quote marker but otherwise appears verbatim. Exactly-one-disclosure is a manual semantic judgment; the validator proves only unique verbatim occurrence and placement, not semantic uniqueness.

## Stop hardness

Dimensions overlap; these are authored challenge labels, not measured model difficulty.

- implicit: 29
- buried: 10
- numbers: 8
- casual: 26
- mixed: 27

| Case | Category | Placement | Hardness |
| --- | --- | --- | --- |
| everyday7b-001 | secrets | body | implicit, casual |
| everyday7b-002 | secrets | body | implicit, mixed |
| everyday7b-003 | secrets | list | buried |
| everyday7b-004 | secrets | quoted | buried |
| everyday7b-005 | secrets | body | casual, implicit |
| everyday7b-006 | secrets | body | mixed |
| everyday7b-007 | secrets | body | implicit, casual |
| everyday7b-008 | secrets | body | numbers, implicit |
| everyday7b-009 | secrets | body | mixed, casual |
| everyday7b-010 | secrets | body | implicit |
| everyday7b-011 | secrets | body | casual, mixed |
| everyday7b-012 | secrets | body | mixed |
| everyday7b-013 | personal | body | implicit, mixed |
| everyday7b-014 | personal | body | casual, mixed |
| everyday7b-015 | personal | list | buried |
| everyday7b-016 | personal | quoted | buried, implicit |
| everyday7b-017 | personal | body | numbers, implicit |
| everyday7b-018 | personal | body | casual, mixed |
| everyday7b-019 | personal | body | implicit |
| everyday7b-020 | personal | body | casual, mixed |
| everyday7b-021 | personal | body | mixed |
| everyday7b-022 | personal | body | implicit, mixed |
| everyday7b-023 | personal | body | casual |
| everyday7b-024 | personal | body | mixed, casual |
| everyday7b-025 | economics | body | numbers, implicit |
| everyday7b-026 | economics | body | implicit, mixed |
| everyday7b-027 | economics | list | buried |
| everyday7b-028 | economics | quoted | buried, numbers |
| everyday7b-029 | economics | body | casual, implicit |
| everyday7b-030 | economics | body | mixed |
| everyday7b-031 | economics | body | numbers, implicit |
| everyday7b-032 | economics | body | casual, mixed |
| everyday7b-033 | economics | body | mixed |
| everyday7b-034 | economics | body | casual |
| everyday7b-035 | economics | body | mixed |
| everyday7b-036 | economics | body | implicit, casual |
| everyday7b-037 | negotiation | body | implicit, mixed |
| everyday7b-038 | negotiation | body | numbers, implicit |
| everyday7b-039 | negotiation | list | buried, casual |
| everyday7b-040 | negotiation | quoted | buried, mixed |
| everyday7b-041 | negotiation | body | implicit, casual |
| everyday7b-042 | negotiation | body | numbers, implicit |
| everyday7b-043 | negotiation | body | casual, mixed |
| everyday7b-044 | negotiation | body | implicit |
| everyday7b-045 | negotiation | body | casual, mixed |
| everyday7b-046 | negotiation | body | numbers, implicit |
| everyday7b-047 | negotiation | body | implicit, casual |
| everyday7b-048 | negotiation | body | mixed |
| everyday7b-049 | remark | body | implicit, casual |
| everyday7b-050 | remark | body | implicit, mixed |
| everyday7b-051 | remark | list | buried |
| everyday7b-052 | remark | quoted | buried, implicit |
| everyday7b-053 | remark | body | casual, mixed |
| everyday7b-054 | remark | body | implicit |
| everyday7b-055 | remark | body | casual |
| everyday7b-056 | remark | body | mixed, casual |
| everyday7b-057 | remark | body | implicit, casual |
| everyday7b-058 | remark | body | mixed |
| everyday7b-059 | remark | body | implicit, casual |
| everyday7b-060 | remark | body | casual, mixed |

## Messy everyday mail

Distinct ordinary cases with at least one messy kind: 70. Counts overlap; boundary cases do not count towards this quota.

- banter: 17
- forward: 11
- chain: 11
- emotion: 15
- terse: 11
- footer: 11

Banter includes teasing, jokes, sarcasm and mild swearing directed at situations, never people or companies. Forward means a pasted newsletter/article/release under a one-line note. Chain means extended quoted ordinary correspondence. Emotion concerns weather, traffic, sport, markets or work. Terse means a one-liner or fragment. Footer includes a signature, addressee disclaimer or legal footer.

## Industries

accessibility services; accounting education; adult education; advertising sales; advertising space; agricultural education; amateur astronomy; animal events; aquarium services; architecture; archive fitout; archives; art logistics; arts administration; audio hire; audio postproduction; audio production; audiology; avian veterinary care; bakery retail; bookbinding; booklet printing; bookselling; botanic gardens; botanical displays; building maintenance; business administration; business deliveries; business media; business training; calibration services; catering; ceramics; charity events; cinema; civic engagement; civil engineering; cleaning services; clock restoration; coffee roasting; cold storage; commercial laundry; community crafts; community education; community facilities; community gardens; community literature; confectionery; conference services; construction supplies; copywriting; craft education; craft fairs; craft workshops; creative spaces; cycle accessories; cycle hire; cycle repair; decorating; delivery equipment; dental services; digital inclusion; display hire; distribution; e-commerce; education; education administration; education publishing; embroidery; employee transport; employment administration; engineering consultancy; engineering services; environmental volunteering; equipment hire; equipment leasing; event hire; event production; events; exhibition design; exhibition graphics; exhibition hire; exhibition services; exhibitions; exotic animal veterinary care; facilities communication; facilities management; family support; festival administration; film sets; floristry; food packaging; food production; food service; freight; freight supplies; fruit growing; furniture; furniture repair; galleries; games hospitality; garden maintenance; garden ornaments; geology education; glass craft; graphic design; guided tours; health education; heritage events; heritage tourism; higher education; horticulture; hospitality; hospitality supplies; hotel services; instrument repair; interface design; interior fitout; inventory services; joinery; landscape design; language training; leather goods; legal education; legal services; library services; lighting manufacture; lighting restoration; logistics planning; maker spaces; marine repair; market events; market management; market services; marquee hire; materials supply; materials testing; metal restoration; millinery; model engineering; museum publishing; museum services; music education; music retail; natural history exhibits; nature tourism; neurology administration; occupational therapy; office administration; office furnishings; office furniture; office maintenance; office support; outdoor events; packaging; paediatric dentistry; paediatric therapy; parcel services; park amenities; passenger transport; patient transport; performing arts; photography services; physiotherapy; picture framing; print buying; printing; professional training; property maintenance; property services; public art; public exhibitions; publishing; puppetry; quantity surveying; radio; rail heritage; recreational equipment; recruitment events; recycling; rehabilitation; rehearsal spaces; renewable energy education; research administration; retail display; retail technology; reusable packaging; rope manufacture; sailmaking; science attractions; science communication; science outreach; seed sharing; shipping; signmaking; small animal veterinary care; small press publishing; soap manufacture; soft furnishings; software community; software licensing; software support; speech therapy; sports events; sports facilities; sports retail; staffing; stand construction; stationery retail; surveying; tea retail; technical training; textile conservation; textiles; theatre; theatre operations; tile manufacture; tour operations; trade publishing; traditional crafts; training equipment; training services; translation; transport customer service; transport planning; uniforms; urban agriculture; urban design; venue hire; veterinary dermatology; veterinary rehabilitation; veterinary services; video production; visitor attractions; visitor information; visitor services; visitor technology; warehouse equipment; warehousing; waste reduction; water maintenance; wayfinding; web services; window furnishings; workspace hire; workwear; yarn retail.

## Boundary map

Each case rationale names the exact SPEC section and safe-side clause.

| Case | Boundary | Setting |
| --- | --- | --- |
| everyday7b-161 | customer-facing price | printed tote bag quote |
| everyday7b-162 | customer-facing quote | window cleaning customer estimate |
| everyday7b-163 | invoice amount as fact | customer chair repair invoice |
| everyday7b-164 | customer payment terms | language course booking terms |
| everyday7b-165 | contract value as fact | noticeboard supply confirmation |
| everyday7b-166 | quote breakdown meant for customer | lamp restoration quote |
| everyday7b-167 | customer-facing price ratio | cushion cover bundle price |
| everyday7b-168 | published customer rate | public workshop booking rate |
| everyday7b-169 | invoice correction | bike service customer bill |
| everyday7b-170 | quote validity term | exhibition plinth rental quote |
| everyday7b-171 | offer actually made to recipient | studio booking proposal |
| everyday7b-172 | actual revised offer | crate rental revised proposal |
| everyday7b-173 | actual offered payment terms | workshop equipment purchase proposal |
| everyday7b-174 | actual offered concession | choir rehearsal hire offer |
| everyday7b-175 | actual service proposal | website maintenance customer offer |
| everyday7b-176 | actual counteroffer to recipient | poster display rental counteroffer |
| everyday7b-177 | actual offer of revised scope | catalogue layout proposal |
| everyday7b-178 | actual time-limited offer | garden tour group booking |
| everyday7b-179 | actual proposed service term | printer service response proposal |
| everyday7b-180 | actual bundled proposal | conference microphone hire offer |
| everyday7b-181 | own medical details to person | physiotherapy follow-up message |
| everyday7b-182 | own treatment details to person | dental procedure aftercare |
| everyday7b-183 | own pay details to person | employee pay confirmation |
| everyday7b-184 | own bonus details to person | employee bonus award notice |
| everyday7b-185 | own HR warning to person | employee warning follow-up |
| everyday7b-186 | own family matter to person | divorce consultation appointment |
| everyday7b-187 | own legal matter to person | personal court appointment reminder |
| everyday7b-188 | own treatment schedule to person | dialysis transport scheduling |
| everyday7b-189 | child health to parent | child physiotherapy parent note |
| everyday7b-190 | child treatment to parent | child dental review parent note |
| everyday7b-191 | child medical results to parent | child hearing test parent message |
| everyday7b-192 | child therapy to parent | speech therapy parent scheduling |
| everyday7b-193 | child illness to parent | school parent illness notification |
| everyday7b-194 | child bereavement support to parent | parent child counselling appointment |
| everyday7b-195 | dependent health to guardian | guardian mobility review notice |
| everyday7b-196 | dependent treatment to guardian | guardian dental appointment reminder |
| everyday7b-197 | dependent medical review to guardian | guardian seizure clinic reminder |
| everyday7b-198 | dependent therapy to guardian | guardian occupational therapy update |
| everyday7b-199 | animal health to owner | rabbit dental review reminder |
| everyday7b-200 | animal treatment to owner | dog booster appointment |
| everyday7b-201 | criticism of drawing not person | staircase drawing correction |
| everyday7b-202 | criticism of schedule not person | delivery programme review |
| everyday7b-203 | blunt disagreement | museum caption approval |
| everyday7b-204 | firm work request | supplier proof deadline |
| everyday7b-205 | criticism of calculation | roof area worksheet review |
| everyday7b-206 | criticism of draft prose | brochure copy edit |
| everyday7b-207 | criticism of product layout | shop checkout screen review |
| everyday7b-208 | criticism of schedule with sarcasm | festival rehearsal timing |
| everyday7b-209 | firm request about work | audio mix revision |
| everyday7b-210 | criticism of installation finish | shelf edging snag report |
| everyday7b-211 | criticism of animation | instruction video revision |
| everyday7b-212 | blunt disagreement on design | public seating plan review |
| everyday7b-213 | criticism of test report | materials test report correction |
| everyday7b-214 | criticism of translation | assembly instruction translation |
| everyday7b-215 | firm request to correct process output | courier label print revision |
| everyday7b-216 | criticism of work with frustration | spreadsheet formatting review |
| everyday7b-217 | criticism of signage drawing | wayfinding arrow proof |
| everyday7b-218 | criticism of timetable | classroom changeover schedule |
| everyday7b-219 | blunt disagreement with proposal content | exhibit caption font decision |
| everyday7b-220 | criticism of draft plan | delivery route map review |
| everyday7b-221 | public entrance logistics | visitor centre entrance directions |
| everyday7b-222 | ordinary site access directions | trade exhibition loading route |
| everyday7b-223 | ordinary keys logistics without secret | community hall key return |
| everyday7b-224 | public accessibility route | public gallery step-free entrance |
| everyday7b-225 | recipient-designed access appointment | contractor reception arrangement |
| everyday7b-226 | public opening hours | public archive reading room hours |
| everyday7b-227 | recipient access instructions by design | market exhibitor badge collection |
| everyday7b-228 | public parking entrance directions | theatre audience car park |
| everyday7b-229 | ordinary access question | delivery entrance clarification |
| everyday7b-230 | public ticketed entry process | science dome visitor admission |
| everyday7b-231 | recipient's scheduled equipment access | shared workshop induction booking |
| everyday7b-232 | ordinary access equipment logistics | door key handover appointment |
| everyday7b-233 | public visitor map directions | botanic garden entrance map |
| everyday7b-234 | recipient-designed room booking access | meeting room customer arrival |
| everyday7b-235 | public staff-assisted entrance | rail museum group arrival |
| everyday7b-236 | customer-facing delivery charge | customer desk delivery charge |
| everyday7b-237 | customer-facing materials charge | customer framing materials line |
| everyday7b-238 | customer discount actually offered | customer apron order discount |
| everyday7b-239 | customer-visible reimbursable charge | customer workshop travel charge |
| everyday7b-240 | customer installation charge | customer blind fitting quote |
| everyday7b-241 | customer-visible printing charge | customer booklet binding charge |
| everyday7b-242 | customer discount already applied | customer hire loyalty discount |
| everyday7b-243 | customer labour charge | customer gate painting quote |
| everyday7b-244 | customer discount proposal | customer seasonal shop display offer |
| everyday7b-245 | customer-visible maintenance charge | customer fountain service bill |
| everyday7b-246 | named person ordinary logistics | sample collection by named colleague |
| everyday7b-247 | absence without stated cause | named colleague meeting cover |
| everyday7b-248 | name and role only | new project contact introduction |
| everyday7b-249 | schedule change without cause | named tutor session reschedule |
| everyday7b-250 | ordinary names and work allocation | exhibit setup role allocation |
| everyday7b-251 | animal health to owner | cat arthritis review |
| everyday7b-252 | animal treatment to owner | dog surgery check appointment |
| everyday7b-253 | animal medical results to owner | parrot test results discussion |
| everyday7b-254 | animal dental treatment to owner | guinea pig dental follow-up |
| everyday7b-255 | animal condition to owner | tortoise shell review |
| everyday7b-256 | animal treatment appointment to owner | ferret follow-up appointment |
| everyday7b-257 | animal health to owner | dog skin condition review |
| everyday7b-258 | animal vaccination to owner | cat vaccination reminder |
| everyday7b-259 | animal medical review to owner | rabbit mobility appointment |
| everyday7b-260 | animal treatment results to owner | gecko treatment follow-up |

## Close calls and authoring decisions

- Physical access: short numbers describe unobserved hours, not codes or identifiers. An explicitly non-latching door or uncovered route is a security gap. Public entrance directions and recipient-designed access arrangements are safe controls; no stop discloses a hidden key or credential.
- Personal: named treatment or a named person being in divorce proceedings is a fact about an identifiable third party. An unexplained absence stays safe. Direct-to-person, parent and guardian messages explicitly establish the relationship; no other recipient sees them. Animals are discussed only with their owners in the boundary controls.
- Economics: ratios and unlabeled figures are anchored to our production or acquisition spend by the preceding context. They are not customer quotes. Customer-facing reimbursable charges explicitly identify what the recipient pays. A numeric floor could overlap negotiation, so negotiation stops use concession strategy and anticipated counters instead.
- Negotiation: a proposal actually made is safe, including a time-limited offer. A message describing a future fallback to another bargaining party remains strategy even when sent to an outside adviser. Strategy stops have one deciding sentence and avoid separate internal cost disclosures.
- Remarks: the target must be a person or company. Criticism of a schedule, drawing, calculation or draft remains safe even when blunt. Mild swearing about weather or a printer is not an insult about its owner. Figurative personal put-downs in stops were retained only where disparagement is clear.
- Footer language is addressed to the recipient and uses the SPEC 5.10 exception; no general restriction on outside sharing is introduced.

Hardest retained distinctions, with case references:

- everyday7b-008 gives an unobserved premises interval from context; everyday7b-226 gives public opening hours without an exposure window.
- everyday7b-025, -028 and -031 disclose the sender's own spend through contextual figures; everyday7b-237 and -243 explicitly quote charges payable by the customer.
- everyday7b-017 discloses another person's take-home pay; everyday7b-183 sends pay directly to that person under the express exception.
- everyday7b-037 reserves a concession before a buyer meeting; everyday7b-174 actually offers a concession to the recipient.
- everyday7b-049 and -054 are figurative attacks on named people; everyday7b-207 and -216 direct blunt or profane criticism at work products.

The numbers-without-labels tag is restricted to everyday7b-008, -017, -025, -028, -031, -038, -042 and -046. Merely containing figures does not qualify. The final unscored authoring review moved two clearly worded disclosures (-021 and -033) into friendly mixed sentences rather than counting them as implicit.

## Reproduction and limits

Run node evaluation/heldout/everyday7b/serialize.mjs, then node evaluation/heldout/everyday7b/report.mjs, then node evaluation/heldout/everyday7b/validate.mjs. For partial batches add --checkpoint to the validator. The serializer only maps literal rows into schema fields; it does not generate, template, combine or vary email prose. report.mjs derives this documentation from metadata, not case content.

Single-author synthetic English mail, with selected colloquial/regional constructions, is not a representative sample of actual workplaces. The fixed fictional sender/recipient domains limit domain diversity deliberately. No attachments, recipient-list, lookalike, live Outlook, performance or model-quality claims are made. The numeric screen is conservative and rejects potentially identifier-shaped digit sequences; it is not a general PII detector. Semantic labels and realism have no independent human adjudication.
