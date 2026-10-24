// Batch 9: ordinary emails and stops (access, personal, economics, negotiation, remark). Literal text only.
export default [
  {
    ind: 'veterinary nursing college', en: 'AU',
    from: ['Joanne Kitching', 'joanne@riverina-vetnursing-college.example'],
    to: [['Dr Ian Mercer', 'ian.mercer@mercer-vets.example']],
    subject: 'Student placement dates',
    body: `Hi Ian,

Thank you for agreeing to host a student nurse. The placement is two weeks from Monday 8 March, nine to five, with a lunch break. She will need a mentor who can sign off her skills log. Her name is Kate and she's keen to see surgery and recovery. Please tell me if there are any dress requirements or immunisations she'll need.

Joanne`
  },
  {
    ind: 'wheat grower', en: 'AU',
    from: ['Phil Gerrard', 'phil@gerrard-farming.example'],
    to: [['Sue Hamilton', 'sue.hamilton@hamilton-grain.example']],
    subject: 'Harvest delivery to the silo',
    body: `Hi Sue, headers start on Wednesday if the moisture is right, so the first truck should be at the silo around midday Thursday. About 40 tonnes a load. I'll call you when we're rolling. Phil`
  },
  {
    stop: 'access', place: 'body',
    ind: 'cleaning franchise', en: 'AU',
    from: ['Donna Kerrigan', 'donna@fresh-start-cleaning.example'],
    to: [['Mick Holloway', 'mick.holloway@holloway-builders.example']],
    subject: 'Friday cleanup at the Wattle St job',
    body: `Hi Mick,

We'll do the post-construction clean at Wattle Street on Friday evening, probably from 5 until about 9. Please tell your plasterer to finish by 4 so we can get in.

The side door is never locked on Fridays. Our other crew comes in late, so just walk in if you need to drop anything off.

Donna`,
    sentence: 'The side door is never locked on Fridays.',
    why: 'SPEC §5.1 security gaps: "The side door is never locked on Fridays." says a premises door is left unlocked.'
  },
  {
    ind: 'lawn bowls club', en: 'AU',
    from: ['Ted Wallace', 'ted@balmain-bowls.example'],
    to: [['Joan Preston', 'joan.preston@ozmail.example']],
    subject: 'Pennant selection',
    body: `Hi Joan,

You're in the A grade rink for Saturday's pennant match against Drummoyne, starting at 1pm. Please be at the club by 12.30 in club shirt, white pants and flat-soled shoes. Afternoon tea is provided. Let me know by Thursday if you can't make it.

Ted`
  },
  {
    ind: 'pool shop', en: 'AU',
    from: ['Gary Dolan', 'gary@splashzone-pools.example'],
    to: [['Julie Barnett', 'julie.barnett@ozmail.example']],
    subject: 'Re: Pool chemicals',
    body: `Hi Julie,

For a 40,000 litre pool, you want 4kg of chlorine granules to start and a bottle of stabiliser. Test the water twice a week and send me a sample in a clean bottle if the colour looks off. We're open 8 to 4 weekdays and 8 to 12 Saturdays.

Gary

> What do I need to buy to get the pool going before summer? It hasn't been used for a year.`
  },
  {
    ind: 'country hotel', en: 'AU',
    from: ['Karen Hollis', 'manager@royalhotel-merriwa.example'],
    to: [['Barry and Lynn Cutler', 'cutlers@ozmail.example']],
    subject: 'Function room for the 60th',
    body: `Hi Barry and Lynn,

The function room is yours on Saturday 18th from 6pm. Hire is $150, with the buffet at $38 a head for 40 guests. The bar will be open for the night and we can organise a DJ if you'd like. A deposit of $300 secures the booking. Rooms upstairs are $110 for guests who want to stay.

Karen`
  },
  {
    ind: 'school athletic department', en: 'US',
    from: ['Coach Ed Powell', 'epowell@jeffersonhigh-athletics.example'],
    to: [['Maria and Tom Alvarez', 'alvarez.family@maplemail.example']],
    subject: 'Physicals and the fall sports meeting',
    body: `Hi Maria and Tom,

A reminder that every athlete needs a current physical on file before the first practice on August 10. The fall sports meeting for parents is Thursday at 7 PM in the cafeteria, where we'll cover schedules, fees and the booster club. The athletic fee is $85 per sport. Forms are on the district website.

Coach Powell`
  },
  {
    ind: 'moving company', en: 'US',
    from: ['Sal Moretti', 'sal@moretti-movers.example'],
    to: [['Dana Kessler', 'dana.kessler@inbox.test']],
    subject: 'Estimate for your move on the 24th',
    body: `Hi Dana,

For the two-bedroom move on the 24th, a crew of three and a 26-foot truck, my estimate is $1,350 for an eight-hour day. That includes padding, tape and a dolly. Stairs add a bit of time but no extra charge. If you pack your own boxes, the price stays the same.

Sal`
  },
  {
    ind: 'food co-op', en: 'US',
    from: ['Penny Walsh', 'penny@greenleaf-foodcoop.example'],
    to: [['Mark Villanueva', 'mark.villanueva@maplemail.example']],
    subject: 'Volunteer shift on Saturday',
    body: `Hi Mark,

Thanks for signing up for a volunteer shift. You're on stocking in the produce aisle on Saturday, 9 AM to noon. Wear closed-toe shoes. Members who work three hours get a 15 percent discount on that day's shop. Check in at the front desk and ask for me.

Penny`
  },
  {
    stop: 'personal', place: 'body',
    ind: 'engineering consultancy', en: 'UK',
    from: ['Sandra Whitworth', 'sandra@whitworth-engineering.example'],
    to: [['Phil Armitage', 'phil.armitage@armitage-structures.example']],
    subject: 'Re: Drawings for the Holme Road scheme',
    body: `Hi Phil,

The structural drawings for Holme Road are with the checker and should be back Monday. I'll send them across with the calculations as soon as I have them.

Joanna's been signed off with stress for six weeks. Leanne is covering the project until she's back.

Sandra`,
    sentence: 'Joanna\'s been signed off with stress for six weeks.',
    why: 'SPEC §5.4 personal details: "Joanna\'s been signed off with stress for six weeks." discloses a named colleague\'s medical leave and its cause to an outsider.'
  },
  {
    ind: 'community theatre', en: 'US',
    from: ['Elaine Bishop', 'elaine@oakhill-playhouse.example'],
    to: [['Greg Tanner', 'greg.tanner@maplemail.example']],
    subject: 'Tech week schedule',
    body: `Hi Greg,

Tech week begins Monday. Load-in is at 5 PM, with cue-to-cue on Tuesday and dress rehearsals Wednesday and Thursday. Opening night is Friday at 7:30. We need you at the sound desk from 6 each night. Dinner will be provided on Tuesday and Wednesday. Please check your cues against the script I've shared.

Elaine`
  },
  {
    ind: 'synagogue office', en: 'US',
    from: ['Ruth Feldman', 'office@beth-shalom-community.example'],
    to: [['David Katz', 'david.katz@inbox.test']],
    subject: 'Re: Room booking for the bar mitzvah',
    body: `Dear David,

The social hall is available on the 14th from noon to 6 PM. Our rental fee is $450, and the kosher caterer list is attached to our website. You'll need to give the office a list of vendors a week before. The rabbi would like to meet your family beforehand; please call to arrange a time.

Ruth Feldman
Synagogue Administrator

> We'd like to book the social hall for our son's bar mitzvah celebration on the 14th.`
  },
  {
    ind: 'masonry contractor', en: 'US',
    from: ['Tony Giordano', 'tony@giordano-masonry.example'],
    to: [['Linda Peterson', 'linda.peterson@maplemail.example']],
    subject: 'Chimney repair, work starting Monday',
    body: `Hi Linda, we'll start repointing the chimney Monday at 8. About three days if the weather holds. The crew will put planks on your roof so please keep the dog in the house. Tony`
  },
  {
    stop: 'economics', place: 'body',
    ind: 'packaging printer', en: 'UK',
    from: ['Hugh Standish', 'hugh@standish-print-and-pack.example'],
    to: [['Beth Greaves', 'beth.greaves@greaves-organics.example']],
    subject: 'Quote for the box redesign',
    body: `Hi Beth,

Thanks for sending the new artwork, which prints cleanly. The updated quote for 5,000 boxes is on the portal and the lead time is three weeks from proof approval.

Roughly 60 percent of our cost is materials, 25 percent labour and 15 percent transport. Happy to go through the detail if it helps.

Hugh`,
    sentence: 'Roughly 60 percent of our cost is materials, 25 percent labour and 15 percent transport.',
    why: 'SPEC §5.5 internal economics: "Roughly 60 percent of our cost is materials, 25 percent labour and 15 percent transport." gives the sender\'s own cost build-up to a customer.'
  },
  {
    ind: 'plumbing contractor', en: 'NZ',
    from: ['Aaron Tamati', 'aaron@tamati-plumbing.example'],
    to: [['Julia Peterson', 'julia.peterson@kiwimail.example']],
    subject: 'Hot water cylinder replacement',
    body: `Hi Julia,

I can swap the hot water cylinder next Wednesday between 8 and 12. The new 180-litre unit has a ten-year warranty. Cost is $2,150 including GST, which covers the cylinder, valves, and removal of the old one. You'll be without hot water for about four hours.

Aaron`
  },
  {
    ind: 'artisan bakery', en: 'CA',
    from: ['Chantal Dubois', 'chantal@dubois-boulangerie.example'],
    to: [['Mark Ellery', 'mark.ellery@ellery-catering.example']],
    subject: 'Pastry order for Friday',
    body: `Hi Mark, your order for Friday: 40 croissants, 30 pains au chocolat, 20 almond croissants and 6 baguettes. Ready at 6:30 AM. Chantal`
  },
  {
    ind: 'farm shop and cafe', en: 'IE',
    from: ['Niamh Kavanagh', 'niamh@kavanagh-farmshop.example'],
    to: [['Joe Dalton', 'joe.dalton@dalton-eggs.example']],
    subject: 'Order for the week',
    body: `Hi Joe,

Could I get the usual 15 dozen eggs, plus 10 kilos of the new potatoes and a box of the rhubarb if you have any? Delivery on Thursday morning would be great. Grand if it's a bit earlier. The invoice can go on the monthly account.

Niamh`
  },
  {
    ind: 'bubble tea shop', en: 'SG',
    from: ['Jolene Tan', 'jolene@sipsip-bubbletea.example'],
    to: [['Aisha Rahman', 'aisha.rahman@webmail.example']],
    subject: 'Re: Catering for office party',
    body: `Hi Aisha,

Yes, we can supply 40 cups for your party on Friday at 3pm. Brown sugar milk tea, jasmine green tea and passionfruit, $4.80 each. Delivery to your office is free. Let me know your choice of flavours by Wednesday evening.

Jolene

> Do you cater for corporate events? We'd like about 40 drinks.`
  },
  {
    ind: 'safari tour operator', en: 'ZA',
    from: ['Pieter Venter', 'pieter@lowveld-safaris.example'],
    to: [['Gareth and Anna Whitby', 'whitbys@webmail.example']],
    subject: 'Itinerary for your Kruger trip',
    body: `Dear Gareth and Anna,

Here is the itinerary: you land at Nelspruit at 11.20, where your driver will meet you. Two nights at the lodge at Hazyview, then four nights in the park, with game drives at dawn and dusk. The cost is R41,500 per person sharing, including meals and park fees. Please bring neutral clothing, a hat and a good pair of binoculars.

Pieter`
  },
  {
    stop: 'negotiation', place: 'body',
    ind: 'commercial property agent', en: 'UK',
    from: ['Jonathan Reeve', 'jonathan@reeve-commercial.example'],
    to: [['Margaret Cole', 'margaret.cole@cole-holdings.example']],
    subject: 'Re: The Dalton Street warehouse',
    body: `Hi Margaret,

I've read the draft offer letter and have made a few small edits, which I'll send back this afternoon.

We open at 1.2 million, and the board has said we can go to 1.45. Keep that to yourself.

Jonathan`,
    sentence: 'We open at 1.2 million, and the board has said we can go to 1.45.',
    why: 'SPEC §5.6 negotiation position: "We open at 1.2 million, and the board has said we can go to 1.45." states the sender\'s opening bid and authorised ceiling.'
  },
  {
    ind: 'bin collection contractor', en: 'UK',
    from: ['Wayne Pickles', 'wayne@pickles-waste.example'],
    to: [['Mrs Doreen Hird', 'doreen.hird@homepost.test']],
    subject: 'Missed collection, apologies',
    body: `Dear Mrs Hird,

I'm sorry we missed your bin on Tuesday. The lorry was diverted because of the burst water main on Park Road. We'll collect it tomorrow, so please leave it out. We've also left an extra bag liner for you at the gate.

Wayne Pickles`
  },
  {
    ind: 'school catering', en: 'UK',
    from: ['Gill Armitage', 'gill@kitchenwise-schoolmeals.example'],
    to: [['Mr and Mrs Ahmed', 'ahmed.family@webmail.example']],
    subject: 'Menu for next half term',
    body: `Dear Mr and Mrs Ahmed,

The menu for next half term is on the school website. There are halal and vegetarian options every day, and all meals are free of nuts. Orders must be in by 8.30 each morning. We are introducing a Friday fish and chip day, which we hope the children will enjoy.

Gill Armitage
Catering Manager`
  },
  {
    ind: 'swimming pool maintenance', en: 'UK',
    from: ['Stuart Hobson', 'stuart@hobson-pools.example'],
    to: [['Ann and Peter Carlisle', 'carlisles@mailbox.example']],
    subject: 'Pool opening for the season',
    body: `Hi Ann and Peter,

I'll come on Monday the 4th to open the pool: remove the cover, clean the filter, set the chemicals and run the pump. It takes about three hours. Once the water is balanced, you can use the pool the next day. My charge is £180, as quoted.

Stuart`
  },
  {
    ind: 'garden machinery repair', en: 'UK',
    from: ['Ray Cowling', 'ray@cowling-mowers.example'],
    to: [['Ted Barraclough', 'ted.barraclough@webmail.example']],
    subject: 'Mower ready',
    body: `Ted, mower's done, new blade and belt. £62. Collect any time before 5. Ray`
  },
  {
    ind: 'accounts assistant freelancer', en: 'UK',
    from: ['Rachel Olney', 'rachel@olney-accounts.example'],
    to: [['Steve Platt', 'steve.platt@platt-motors.example']],
    subject: 'Thanks',
    body: `Thanks Steve, received. I'll sort it Thursday. Rachel`
  },
  {
    ind: 'driving instructor', en: 'UK',
    from: ['Hassan Ali', 'hassan@alidriving.example'],
    to: [['Poppy Ellis', 'poppy.ellis@inbox.test']],
    subject: 'Lesson',
    body: `Hi Poppy, 3pm Friday is fine. See you then. Hassan`
  },
  {
    stop: 'remark', place: 'body',
    ind: 'building supplier', en: 'UK',
    from: ['Neil Lockwood', 'neil@lockwood-builders-merchants.example'],
    to: [['Craig Dewhurst', 'craig.dewhurst@dewhurst-construction.example']],
    subject: 'Re: Pallet of blocks, delivery problem',
    body: `Hi Craig,

I'm sorry the blocks arrived damaged. I've asked for a replacement pallet on Thursday and a credit note for the broken ones.

Bryn is a thieving little weasel. Make sure you count everything off the lorry yourself.

Neil`,
    sentence: 'Bryn is a thieving little weasel.',
    why: 'SPEC §5.7 remarks: "Bryn is a thieving little weasel." is an insulting remark about a named person.'
  }
];
