// Batch 8: ordinary emails and stops (access, personal, economics, negotiation, remark x2). Literal text only.
export default [
  {
    ind: 'rural supplies store', en: 'AU',
    from: ['Gavin Lowe', 'gavin@lowe-ruralsupplies.example'],
    to: [['Neil Brannock', 'neil.brannock@brannock-farming.example']],
    subject: 'Re: Fence posts and wire',
    body: `Hi Neil,

I've got 150 treated strainer posts and eight rolls of the 8-wire on hand. $4.80 a post and $212 a roll, delivered to the farm on Thursday if you order today. If you want the gates too, tell me the width.

Gavin

> Gavin, how much for 150 posts and some wire? We're fencing the back paddock before shearing.`
  },
  {
    ind: 'mining services', en: 'AU',
    from: ['Dean Kowalski', 'dean@redearth-mining-services.example'],
    to: [['Shelley Brook', 'shelley.brook@brook-logistics.example']],
    cc: [['Transport Office', 'transport@brook-logistics.example']],
    subject: 'Site induction for the new drivers',
    body: `Hi Shelley,

Your three new drivers need to complete the site induction before they come on site. It runs on Tuesday at 7am in the training room by the main gate, and takes about three hours. Everyone needs steel-cap boots, long sleeves, hi-vis, glasses and a hard hat. Please send the names and licence classes by Monday so we can set up the passes.

Dean`
  },
  {
    ind: 'honey producer', en: 'AU',
    from: ['Barb Cooney', 'barb@cooneys-honey.example'],
    to: [['Mark Lyall', 'mark.lyall@lyall-organics.example']],
    subject: 'Honey order, 30 jars',
    body: `Hi Mark,

I've packed 30 jars of the leatherwood and 20 of the yellow box for your next market. Price is $12 for 500g and $22 for 1kg, same as last time. I'll drop them with the courier tomorrow. The harvest was good this year, so I can send another carton if you need more.

Barb`
  },
  {
    ind: 'surf shop', en: 'AU',
    from: ['Jake Dunne', 'jake@dunnesurf.example'],
    to: [['Liam Ferris', 'liam.ferris@ozmail.example']],
    subject: 'Board is ready',
    body: `Liam, your board's back from the repair guy and good as new. Pick up whenever. Jake`
  },
  {
    ind: 'rural real estate', en: 'AU',
    from: ['Maggie Treloar', 'maggie@treloar-rural.example'],
    to: [['Tony and Bev Hartnett', 'hartnetts@ozmail.example']],
    subject: 'Inspection of the Dalby block',
    body: `Hi Tony and Bev,

I've organised an inspection of the 240-acre block on Saturday at 10. We'll meet at the front gate. It has a four-bedroom homestead, a machinery shed, two dams and a bore. There's a good set of cattle yards. The vendor is asking $1.38 million, and I can send the title details and the water licence beforehand if you'd like.

Maggie`
  },
  {
    ind: 'large animal veterinarian', en: 'AU',
    from: ['Dr Rhys Pearce', 'rhys@pearce-rural-vets.example'],
    to: [['Col Hennessy', 'col.hennessy@hennessy-grazing.example']],
    subject: 'Pregnancy testing next Tuesday',
    body: `Col,

I can be there at 8 on Tuesday for the pregnancy testing. Please have the cows yarded the night before, with the races and crush ready. About 140 head will take around three hours. I'll give you the empties list and the due-date groupings when we finish.

Rhys`
  },
  {
    ind: 'P&C association', en: 'AU',
    from: ['Kylie Hughes', 'kylie@mountvale-pandc.example'],
    to: [['Simone Walsh', 'simone.walsh@ozmail.example']],
    subject: 'Fete volunteers needed',
    body: `Hi Simone,

We're short of volunteers for the school fete on Saturday 14th. Shifts are 7:30 to 10:30, 10:30 to 1:30, and 1:30 to 4:30. The cake stall and the sausage sizzle both need people. If you can do one, reply with your preference. And if you can bake something, drop it in at the canteen on Friday afternoon.

Kylie`
  },
  {
    ind: 'op shop', en: 'AU',
    from: ['Dot Wilkinson', 'dot@stvincents-opshop.example'],
    to: [['Peter Hale', 'peter.hale@ozmail.example']],
    subject: 'Re: Donation of books',
    body: `Hi Peter, thanks for the offer. We'd love the books. Bring them in any weekday between 10 and 3. Dot

> I have around eight boxes of paperbacks and would like to donate them.`
  },
  {
    ind: 'band boosters', en: 'US',
    from: ['Linda Merriweather', 'linda@westfield-bandboosters.example'],
    to: [['Craig Dunham', 'craig.dunham@maplemail.example']],
    subject: 'Chaperones for Saturday\'s competition',
    body: `Hi Craig,

We still need two more chaperones for the bus on Saturday. The bus leaves the school at 6:30 AM and gets back around 10 PM. Chaperones ride with the students and help with loading the trailer. The district covers lunch. Please let me know if you can do it by Wednesday.

Linda`
  },
  {
    ind: 'youth soccer league', en: 'US',
    from: ['Mark Delgado', 'mark@riverside-youthsoccer.example'],
    to: [['Beth Walters', 'beth.walters@inbox.test']],
    subject: 'Field changes for this weekend',
    body: `Hi Beth,

Your U10 game on Saturday has moved from Field 2 to Field 5 at Cedar Park. Kickoff is the same, 9:15 AM. The lot near Field 5 is small, so please carpool if you can. Bring water, and shin guards are mandatory.

Mark`
  },
  {
    stop: 'personal', place: 'body',
    ind: 'civil engineering', en: 'UK',
    from: ['Frank Haslam', 'frank@haslam-civils.example'],
    to: [['Judith Mortimer', 'judith.mortimer@mortimer-planning.example']],
    subject: 'Re: Project meeting on Thursday',
    body: `Hi Judith,

Thursday at 2 is fine for the project meeting. I'll bring the programme and the latest drawings.

Pete can't make the meeting because his wife died on Sunday. Gareth will come in his place.

Frank`,
    sentence: 'Pete can\'t make the meeting because his wife died on Sunday.',
    why: 'SPEC §5.4 personal details: "Pete can\'t make the meeting because his wife died on Sunday." discloses a named colleague\'s family bereavement to an outsider.'
  },
  {
    ind: 'compounding pharmacy supplier', en: 'US',
    from: ['Gina Torres', 'gina@clearpath-pharmsupply.example'],
    to: [['Marcus Lowell', 'marcus.lowell@lowell-pharmacy.example']],
    subject: 'Order shipped',
    body: `Hi Marcus,

Your order shipped this afternoon by two-day ground. There are 12 cases in all, with the tracking link in the confirmation email from our system. The cold-chain items are in the insulated box with gel packs and should be in the fridge as soon as they arrive.

Gina`
  },
  {
    ind: 'landscape supply yard', en: 'US',
    from: ['Hank Dillard', 'hank@dillard-landscape-supply.example'],
    to: [['Joe Raines', 'joe.raines@raines-lawncare.example']],
    subject: 'Mulch and topsoil, ready Friday',
    body: `Joe, 20 yards of hardwood mulch and 10 yards of screened topsoil will be loaded by 7 AM Friday. Bring the dump truck, and we'll weigh you out on the way. Hank`
  },
  {
    ind: 'trucking company', en: 'US',
    from: ['Donna Raines', 'dispatch@raines-trucking.example'],
    to: [['Phil Okafor', 'phil.okafor@okafor-beverages.example']],
    subject: 'Re: Pickup time for load 4406',
    body: `Phil,

The driver will be at your dock at 6:30 AM Wednesday. He has a 53-foot dry van, empty and clean. Please make sure the load is ready, as he has to deliver by noon Thursday in Louisville. Call me if anything changes.

Donna

> We have a load for Louisville and need pickup Wednesday morning if possible.`
  },
  {
    ind: 'auto parts store', en: 'US',
    from: ['Troy Mackey', 'troy@mackey-autoparts.example'],
    to: [['Dale Whitman', 'dale.whitman@whitmanauto.example']],
    subject: 'Parts in for the Silverado',
    body: `Dale, the brake pads and rotors for the Silverado came in. I'll hold them until 5 today. If you can't make it, I'll bring them to your shop in the morning. Troy`
  },
  {
    ind: 'county extension office', en: 'US',
    from: ['Diane Whitcomb', 'diane@marshallcounty-extension.example'],
    to: [['Ron Hendricks', 'ron.hendricks@maplemail.example']],
    subject: 'Soil sampling workshop next week',
    body: `Hi Ron,

The soil sampling workshop is Tuesday at 6 PM at the extension office on Main Street. We'll show you how to take a proper sample, how to read the lab report, and what the numbers mean for your garden or field. No cost, but please sign up so we know how many handouts to print.

Diane`
  },
  {
    stop: 'economics', place: 'body',
    ind: 'equipment rental', en: 'US',
    from: ['Carl Newsome', 'carl@newsome-rentals.example'],
    to: [['Stacy Vance', 'stacy.vance@vance-events.example']],
    subject: 'Re: Buyout of the rental lighting rigs',
    body: `Hi Stacy,

Glad your team likes the rigs. We can put together a buyout quote for the twelve units and I'll have it to you by Monday, with the warranty terms.

We carried the rental fleet on the books at $610 a unit and we're pricing the buyout to clear $700.

Carl`,
    sentence: 'We carried the rental fleet on the books at $610 a unit and we\'re pricing the buyout to clear $700.',
    why: 'SPEC §5.5 internal economics: "We carried the rental fleet on the books at $610 a unit and we\'re pricing the buyout to clear $700." gives what the sender carried the item at and its target price to a customer.'
  },
  {
    ind: 'parks department', en: 'US',
    from: ['Gloria Esquivel', 'gloria@cityofmaplewood-parks.example'],
    to: [['Don Whitaker', 'don.whitaker@inbox.test']],
    subject: 'Permit for the pavilion on June 20',
    body: `Hi Don,

Your pavilion permit for June 20 is approved. You have the space from 10 AM to 4 PM, and there's a $75 cleaning deposit refunded after inspection. Amplified sound isn't allowed after 2 PM. You can bring a grill, but please use the designated area. A copy of the permit should be on site.

Gloria`
  },
  {
    ind: 'federal contractor', en: 'US',
    from: ['Eric Lund', 'eric.lund@pinnacle-federal-services.example'],
    to: [['Maria Delgado', 'maria.delgado@usda-field-office.example']],
    cc: [['Tom Reese', 'tom.reese@usda-field-office.example']],
    subject: 'Status for the week of March 9',
    body: `Maria,

Status for the week:

- Data migration is 70 percent complete and on track for March 27
- User acceptance testing starts March 16, and I've sent the schedule to your team leads
- The security review has two open items, both low risk
- The change request for the extra reports is awaiting your approval

Nothing is currently at risk. I'd like 20 minutes on Wednesday to go through the testing plan. Let me know if that works.

Eric`
  },
  {
    ind: 'kiwifruit packhouse', en: 'NZ',
    from: ['Aroha Smith', 'aroha@bayofplenty-packhouse.example'],
    to: [['Craig Peterson', 'craig.peterson@kiwimail.example']],
    subject: 'Harvest dates and bin deliveries',
    body: `Hi Craig,

Harvest is starting on Monday 11 April for the Gold, and the green will follow two weeks later. We'll drop 120 empty bins at the orchard on Friday. Please let your pickers know that the fruit has to be in the shed within four hours of picking. Payment is the usual end of the month.

Aroha`
  },
  {
    ind: 'sheep farmer', en: 'NZ',
    from: ['Hamish Rutherford', 'hamish@rutherford-station.example'],
    to: [['Tom Barker', 'tom.barker@kiwimail.example']],
    subject: 'Shearing Tuesday',
    body: `Tom, shearers will be here Tuesday at 7. 600 ewes. Can you bring the trailer? Hamish`
  },
  {
    stop: 'remark', place: 'body',
    ind: 'property developer', en: 'CA',
    from: ['Jean-Marc Roy', 'jm@roy-developments.example'],
    to: [['Ahmed Karim', 'ahmed.karim@karim-surveys.example']],
    subject: 'Re: Boundary survey, Lot 12',
    body: `Hi Ahmed,

Thanks for sending the boundary survey. The pins match the plan and the easement is where I expected it.

He's a pathetic little man who can't take no for an answer. I'd keep our numbers out of any call with him.

Jean-Marc`,
    sentence: 'He\'s a pathetic little man who can\'t take no for an answer.',
    why: 'SPEC §5.7 remarks: "He\'s a pathetic little man who can\'t take no for an answer." is an insulting remark about a person.'
  },
  {
    ind: 'maple syrup producer', en: 'CA',
    from: ['Luc Gagnon', 'luc@gagnon-erablieres.example'],
    to: [['Anne Whitcombe', 'anne.whitcombe@maplemail.example']],
    subject: 'Your syrup order is on its way',
    body: `Hi Anne,

Your order of twelve 540 ml tins and four of the 1-litre bottles went out today by Canada Post. It should reach you within five working days. The syrup is from the March run, a medium amber. Keep unopened tins in a cool, dry place and refrigerate after opening.

Luc`
  },
  {
    ind: 'bed and breakfast', en: 'IE',
    from: ['Maura Hegarty', 'maura@claddagh-house-bnb.example'],
    to: [['Robert and Julie Stevens', 'stevens.family@webmail.example']],
    subject: 'Your booking for the 7th and 8th',
    body: `Dear Robert and Julie,

Your room is ready for the 7th and 8th. Check-in is from 3 and breakfast is from 8 to 9.30. We're a ten-minute walk from the Spanish Arch, and I can book a table for you at one of the local restaurants if you let me know what you like. There's free parking at the back.

Maura`
  },
  {
    stop: 'negotiation', place: 'body',
    ind: 'cleaning contractor', en: 'UK',
    from: ['Tracey Holroyd', 'tracey@holroyd-cleaning.example'],
    to: [['Mike Brennan', 'mike.brennan@brennan-facilities.example']],
    subject: 'Re: Retender for the leisure centre',
    body: `Hi Mike,

Thanks for the site visit last week; it was helpful to see the plant rooms. The revised price will come to you on Friday.

I'd rather lose the contract than go below 30 so tell them we have other offers, even though we don't.

Tracey`,
    sentence: 'I\'d rather lose the contract than go below 30 so tell them we have other offers, even though we don\'t.',
    why: 'SPEC §5.6 negotiation position: "I\'d rather lose the contract than go below 30 so tell them we have other offers, even though we don\'t." states the sender\'s walk-away number and a bluffing strategy.'
  },
  {
    ind: 'wine estate', en: 'ZA',
    from: ['Johan van der Merwe', 'johan@kloofvalley-estate.example'],
    to: [['Susan Pretorius', 'susan.pretorius@webmail.example']],
    subject: 'Your cellar tour on Saturday',
    body: `Dear Susan,

We're looking forward to seeing your group of eight on Saturday at 11. The tour takes an hour and ends with a tasting of five wines. Lunch in the restaurant can be booked at a set price of R280 a head. Please let us know if anyone needs a designated driver, as we can arrange a shuttle.

Kind regards,
Johan`
  },
  {
    ind: 'tuition centre', en: 'SG',
    from: ['Mdm Lim Siew Hoon', 'admin@brightminds-tuition.example'],
    to: [['Mr and Mrs Tan', 'tan.family@webmail.example']],
    subject: 'Revision classes before the exams',
    body: `Dear Mr and Mrs Tan,

Revision classes for the Primary 6 pupils will run on Saturdays from 9 to 12, starting on 3 September. The fee is $260 for the series. Pupils should bring their workbooks and past-year papers. Please register by 28 August and let us know if you have any questions.

Thank you.

Mdm Lim`
  },
  {
    ind: 'garment factory', en: 'IN',
    from: ['Rajesh Iyer', 'rajesh@iyer-garments.example'],
    to: [['Helen Park', 'helen.park@parkwear-brands.example']],
    subject: 'Order status: season spring',
    body: `Dear Helen,

Cutting for your spring order was completed on Monday and stitching is on schedule. We expect to finish 8,000 pieces by the 20th. Pre-shipment inspection can be done on the 22nd and 23rd. Kindly confirm if your inspector will visit, or whether we should arrange a third-party inspection. The labels and hang tags are with us.

Regards,
Rajesh Iyer`
  },
  {
    stop: 'remark', place: 'quoted',
    ind: 'commercial letting', en: 'UK',
    from: ['Ian Sutcliffe', 'ian@sutcliffe-commercial.example'],
    to: [['Dawn Pickles', 'dawn.pickles@pickles-bakery.example']],
    subject: 'Re: Lease renewal for the shop',
    body: `Hi Dawn,

Thanks for sending the draft. I'm going through it this week and will come back with comments by Friday.

Ian

On Tue, 6 Oct 2026 at 08:20, Ian Sutcliffe wrote:
> Between ourselves, the landlord is a greedy old crook who'd sell his own mother for a pound.`,
    sentence: 'Between ourselves, the landlord is a greedy old crook who\'d sell his own mother for a pound.',
    why: 'SPEC §5.7 remarks: "Between ourselves, the landlord is a greedy old crook who\'d sell his own mother for a pound." (quoted history) is a disparaging remark about a person.'
  }
];
