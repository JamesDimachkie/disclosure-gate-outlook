# Disclosure Gate held-out set: everyday5

Independent author: OpenAI gpt-6-luna. Date: 24 October 2026.

Read exactly: `LANE-BRIEF.md`, `AGENTS.md`, `SPEC.md`, `evaluation/heldout/README.md`, and `evaluation/heldout/run.mjs`. No implementation, prior held-out cases, model, tests, or other project files were read. No hosted model or network service was used to author or validate this set.

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

The target is 300 ordinary outside emails expected to pass and 60 stop cases, 12 in each of secrets (§5.1 physical access only), personal (§5.4), economics (§5.5), negotiation (§5.6), and remark (§5.7). There are no expected prompts.

## Coverage and custody

Industries/settings: accounting firm; accounting practice; agricultural fencing supplier; air quality consultancy; airport shuttle operator; amateur astronomy group; animal feed mill; animal rescue charity; animal shelter; appliance repair; appliance repair network; aquaculture; arborist service; archery club; architectural practice; artisan chocolate shop; artisan pasta maker; artisan soap maker; arts charity; arts education nonprofit; arts festival; auto glass service; automotive garage; bakery; beekeeping association; bicycle repair shop; bike tour operator; boat builder; boat marina services; bookkeeping freelancer; botanical garden; bowling alley; brewery; brewpub; building acoustics firm; building contractor; building control office; building materials supplier; building supplies merchant; bus charter operator; cabinet maker; café roastery; campground; camping equipment hire; canoe club

canoe outfitter; caravan park; cat boarding cattery; catering college; catering company; ceramics gallery; ceramics manufacturer; charter bus company; cheese maker; chimney sweep; choir association; church; cider maker; civic garden project; clock repairer; clothing alterations; cloud migration consultancy; coastal ferry operator; coastal rescue service; coffee roaster; cold storage warehouse; commercial cleaning; commercial greenhouse; commercial kitchen installer; commercial laundry; commercial printing; commercial property leasing; commercial property services; community centre; community choir; community energy cooperative; community garden; community hall; community health clinic administration; community legal centre administration; community observatory; community orchestra; community repair cafe; community sports association; community theatre; computer recycling service

conference centre; construction materials company; construction materials testing; construction supplier; courier service; court transcription service; craft market organiser; cricket club; crop consulting; custom furniture maker; dairy farm; dance company; dance studio; dental laboratory; dental practice; design studio; digital accessibility consultant; drainage contractor; elder care transport; electrical inspection service; electrical wholesaler; engineering consultancy; engineering consultant; engineering services; engineering supplier; environmental planning consultancy; equestrian centre; equine feed supplier; equipment rental; event florist; event production; farm equipment repair; farm machinery dealer; farm produce subscription; farm supply cooperative; farmers market; film screening society; fire door manufacturer; fire equipment supplier; fish market; fishing charter

florist wholesaler; flour mill; food bank; food charity; food packaging distributor; food packaging supplier; food testing laboratory; food truck festival; freelance graphic design; freelance web design; freight carrier; freight forwarder; freight forwarding; freight logistics; funeral home; furniture restoration; furniture retailer; garden centre; geotechnical survey; glass works; golf club; government print contractor; grain cooperative; graphic signage studio; hair salon; hardware shop; hearing aid clinic; heritage conservation studio; heritage railway; historic house trust; holiday rental agency; home energy assessor; honey producer; hospitality linen supplier; hotel; hotel group sales; hotel linen service; hotel maintenance; hotel supplier; ice cream maker; ice maker; ice rink; independent bookshop; independent cinema; independent gym; independent optician; independent pharmacy

independent publisher; independent restaurant; independent software developer; indoor climbing gym; industrial fastener supplier; industrial laundry equipment; insurance brokerage; irrigation supplier; kayak hire; land surveyor; landscape construction; landscaping firm; lawn care service; lift maintenance; lift parts distributor; light aircraft maintenance; livestock agent; local council planning desk; local council service; local courier cooperative; local cricket ground; local cycling association; local ferry service; local history museum; local history society; local hockey league; local newspaper delivery; local scout camp; local tourism board; local water board; managed IT support; manufacturing workshop; marina; marine electrician; medical device distributor; metal fabrication; mobile caterer; mountain guide service; moving company; municipal contractor; municipal parks service

museum café; museum education; music school; musical instrument repair; neighborhood association; netball association; olive oil producer; optical lens manufacturer; optometry practice; orchard grower; orchestra society; organic farm shop; outdoor climbing school; outdoor education centre; outdoor gear retailer; packaging manufacturer; packaging supplier; paint manufacturer; paper mill; parent association; pest control; pet grooming salon; physiotherapy studio; piano moving company; plumbing contractor; podcast production; pool maintenance; poultry hatchery; precision machining; primary school; print shop; printing and mailing house; private school; property agency; property management; public aquarium; public library; public swimming baths; public theatre; puppet theatre; radio station; rail maintenance contractor; railway museum; refrigeration service; regional arts council

regional arts organisation; regional arts venue; regional bus operator; regional dairy cooperative; regional newspaper; regional planning authority; regional rail operator; residential property manager; restaurant equipment rental; restaurant supplier; road construction; road marking contractor; roofing contractor; rowing association; running club; rural broadband installer; rural clinic; rural fencing contractor; rural real estate agency; rural veterinary practice; sailing school; scaffolding supplier; school administration; school bus contractor; school theatre; scouting group; seafood wholesaler; second-hand car dealer; seed library; self-storage facility; septic maintenance; sheep shearing service; shoe repair shop; small law firm; software consultancy; software vendor; solar installation; solar installer; sports club; sports club committee; sports pavilion; storage facility

surf lifesaving club; survey equipment rental; surveying firm; swimming club; tax preparation office; taxi cooperative; telecommunications contractor; telehealth platform support; tennis club; textile manufacturer; textile mill; tile importer; town festival committee; town planning consultancy; translation agency; translation co-operative; transport company; tree nursery; truck rental; upholstered furniture maker; upholstery cleaner; upholstery workshop; venue hire; veterinary clinic; veterinary laboratory; veterinary physiotherapist; video production freelancer; village post office; village school; vineyard; warehouse logistics; warehouse shelving installer; waste recycling plant; water testing laboratory; water utility contractor; web hosting provider; wedding cake studio; wedding celebrant; wedding photography; wedding venue; wildlife rehabilitation; window cleaning; window installer

window tinting service; wool processor; yoga studio; youth basketball league; youth football club; youth hostel; youth mentoring charity

Language variants: US 145, UK 111, Australian 104. Deciding-sentence placement: body 335, quoted history 15, subject 10. The body length is 8–58 whitespace-delimited words (median 26, mean 26.0); subject length is 2–12 words. This includes compact one-line notes, a list-heavy school visit update, and multi-sentence coordination messages.

Hardest close calls were the SPEC boundaries: a quoted personal detail still concerns a third party and remains a §5.4 disclosure; an internal cost or walk-away number is §5.5 even beside ordinary customer-facing quote logistics; tentative concessions and predicted counters reveal §5.6 position while a clean offer made to the recipient does not; insulting descriptions of a supplier or official are §5.7 while direct criticism of work would remain quiet. For §5.1, I restricted the deciding content to actual physical premises codes and avoided passwords, keys, and security-gap cases.

All identities, companies, addresses, and places are invented. The sender uses `gate.example`; the outside recipient uses `outside.example`, an exact-domain mismatch under §4. Every case has one outside recipient, no attachments, and no real credential, payment, or identity data.

Custody: never tune rules or models on this set; freeze before scoring.









