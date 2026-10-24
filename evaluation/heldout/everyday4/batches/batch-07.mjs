// Batch 7: ordinary emails and stops (access, personal, economics x2, negotiation x2, remark x2). Literal text only.
export default [
  {
    ind: 'vehicle recovery', en: 'UK',
    from: ['Mick Hardcastle', 'mick@hardcastle-recovery.example'],
    to: [['Pat Greenhalgh', 'pat.greenhalgh@mailbox.example']],
    subject: 'Your van is at the yard',
    body: `Hi Pat,

We've got your van safe at the yard in Elland. The garage can look at it on Monday morning, and I've given them your number. Recovery charge is £145, which you can pay by card over the phone. The yard is open until 5 on weekdays, if you want to collect anything from the cab.

Mick`
  },
  {
    ind: 'caravan dealer', en: 'UK',
    from: ['Gordon Sykes', 'gordon@sykes-caravans.example'],
    to: [['Linda Frost', 'linda.frost@webmail.example']],
    subject: 'Re: Habitation check',
    body: `Hi Linda,

We can do the habitation check on Tuesday the 14th. It takes about two hours, and the cost is £89, plus any parts. If you drop the van off by 9, it can be collected by lunchtime. We'll check the damp, gas and the 12-volt system, and give you a report.

Gordon

> Could you tell me whether you can do a habitation check on our Swift before the end of the month?`
  },
  {
    stop: 'access', place: 'body',
    ind: 'rural pub', en: 'UK',
    from: ['Hazel Prewett', 'hazel@thehareandhounds-inn.example'],
    to: [['Callum Baird', 'callum.baird@baird-beerservices.example']],
    subject: 'Cellar clean on Tuesday',
    body: `Hi Callum,

Tuesday is fine for the line clean. We're closed all day, so come in whenever suits you and I'll leave the back door unlocked from 8.

The safe in the back office opens with left 14, right 7, left 32, and the spare float is in the green tin if you need change for the parking.

Hazel`,
    sentence: 'The safe in the back office opens with left 14, right 7, left 32, and the spare float is in the green tin if you need change for the parking.',
    why: 'SPEC §5.1 premises codes: "The safe in the back office opens with left 14, right 7, left 32, and the spare float is in the green tin if you need change for the parking." gives a working safe combination.'
  },
  {
    ind: 'campsite', en: 'UK',
    from: ['Brian Helliwell', 'brian@tarnfoot-campsite.example'],
    to: [['Steve and Gill Rawson', 'rawsons@inbox.test']],
    subject: 'Booking for 3 nights, Pitch 12',
    body: `Hi Steve and Gill,

You're all set for Pitch 12, arriving Friday 8th, leaving Monday 11th. It's £24 a night with electric hook-up. Arrival is from 2pm and the gate is shut to cars at 10pm. Please keep dogs on leads around the sheep. The shop sells bread, milk and eggs from 8 to 10 each morning.

Brian
Tarnfoot Campsite

> Hello, do you have a pitch for a motorhome for the weekend of the 8th? Dog and electric needed.`
  },
  {
    ind: 'holiday park', en: 'AU',
    from: ['Narelle Fitzgerald', 'narelle@lakesedge-holidaypark.example'],
    to: [['Greg and Tanya Pollard', 'pollards@ozmail.example']],
    subject: 'Cabin 7 for the long weekend',
    body: `Hi Greg and Tanya,

Cabin 7 is yours from Friday 2pm to Monday 10am. It's a two-bedroom cabin with linen, a kitchen and a verandah looking over the lake. Pets aren't allowed in the cabins, I'm afraid, but the dog park is next to the camp kitchen. Check in at the office before 5, or let me know if you'll be later.

Narelle`
  },
  {
    ind: 'dive shop', en: 'AU',
    from: ['Jason Kerr', 'jason@reefedge-diving.example'],
    to: [['Tamara Holt', 'tamara.holt@ozmail.example']],
    subject: 'Open water course dates',
    body: `Hi Tamara,

The next open water course starts on Monday 22nd. Theory is two evenings (Monday and Tuesday, 6 to 9), pool on Wednesday, then four open water dives on the weekend at Shelly Beach. The price is $620, including gear and certification. You'll need to complete a medical form before you start; a doctor's sign-off is only needed if you answer yes to any questions.

Jason`
  },
  {
    ind: 'fishing charter', en: 'US',
    from: ['Captain Ray Dolan', 'ray@bluemarlin-charters.example'],
    to: [['Steve Whitaker', 'steve.whitaker@maplemail.example']],
    subject: 'Saturday trip, weather check',
    body: `Steve,

The forecast for Saturday is 10 to 15 knots with a swell of two feet, so we should be fine to go. Meet at slip 14 at 5:30 AM. Bring sunscreen, a hat, a cooler for your catch and a jacket. I supply the rods, bait and ice. If it turns bad, I'll call you at 4 AM.

Ray`
  },
  {
    ind: 'whale watching tours', en: 'CA',
    from: ['Nicole Pelletier', 'nicole@tadoussac-whales.example'],
    to: [['Mark Henderson', 'mark.henderson@maplemail.example']],
    subject: 'Your boat tour on Sunday',
    body: `Hi Mark,

Your tour leaves on Sunday at 1:30 PM from the main dock. Please arrive at 1:00. It lasts about three hours and the water can be cold, so dress in layers. Wind jackets are available for rent. We've had belugas and minke whales close to the boat this week.

Nicole`
  },
  {
    ind: 'kayak hire', en: 'UK',
    from: ['Owen Lloyd', 'owen@menai-kayaks.example'],
    to: [['Beth and Rob Hayward', 'haywards@webmail.example']],
    subject: 'Tomorrow\'s paddle',
    body: `Hi both,

All good for the guided paddle tomorrow at 10. Meet at the slipway by the cafe. We'll give you buoyancy aids and a short safety talk first, so aim to be there at 9.45. Wear clothes that can get wet, bring a towel and a change, and sunscreen. The tide will be with us on the way out.

Owen`
  },
  {
    ind: 'farm park', en: 'UK',
    from: ['Sue Garbutt', 'bookings@meadowbank-farmpark.example'],
    to: [['Mr Andrew Pym', 'andrew.pym@thornton-infants.example']],
    subject: 'School visit, Thursday 2 June',
    body: `Dear Mr Pym,

Thank you for booking the visit for 54 Reception and Year 1 children. We'll meet you in the car park at 10. The programme includes feeding the lambs, a tractor ride and a farm trail, with lunch in the barn from 12. We have two adults free for every ten children. Please send details of any allergies a few days beforehand.

Kind regards,
Sue Garbutt`
  },
  {
    ind: 'heritage railway', en: 'UK',
    from: ['Dennis Waddington', 'dennis@worth-valley-steam.example'],
    to: [['Rosemary Gaunt', 'rosemary.gaunt@mailbox.example']],
    subject: 'Group booking for the Santa special',
    body: `Dear Rosemary,

I've reserved 30 seats on the Santa special on Saturday 12 December at 11.15. The price is £15 for adults and £12 for children, including a present from Santa and a mince pie. Please send the final names by 1 December. Platform staff will show your group to the carriage.

Dennis Waddington
Bookings, Worth Valley Steam Railway`
  },
  {
    ind: 'comedy club', en: 'UK',
    from: ['Dean Pickford', 'dean@laughlines-comedyclub.example'],
    to: [['Shaun Whitaker', 'shaun.whitaker@whitaker-corporate.example']],
    subject: 'Private booking for your team night',
    body: `Hi Shaun,

We can host your team of 40 on Friday 20th with a reserved block of tables at the front. Doors open at 7, and the show begins at 8, with a compere and three acts. Tickets are £18 each, with a pre-show food menu at £12 a head. Please let me have the final numbers a week before.

Dean`
  },
  {
    ind: 'board game cafe', en: 'US',
    from: ['Zoe Ramirez', 'zoe@meeplehouse-cafe.example'],
    to: [['Aaron Whitfield', 'aaron.whitfield@maplemail.example']],
    subject: 'Table for tournament night',
    body: `Hi Aaron, we've reserved two large tables for your group on Thursday at 6 PM. There's a $5 cover per player, which includes access to the library of 600 games. Snacks and drinks are separate. Zoe`
  },
  {
    stop: 'economics', place: 'subject',
    ind: 'furniture manufacturer', en: 'UK',
    from: ['Bryan Fenwick', 'bryan@fenwick-furniture.example'],
    to: [['Sheila Goodwin', 'sheila.goodwin@goodwin-hospitality.example']],
    subject: 'Cost per unit is £31 against a price of £49, so the margin is fine',
    body: `Sheila,

I've gone through the specification for the bar stools again and we can make them in the finish you chose with a lead time of five weeks. The first batch of 40 would ship in the week of the 17th. Please confirm the colour sample is approved and I'll book the production slot.

Bryan`,
    sentence: 'Cost per unit is £31 against a price of £49, so the margin is fine',
    why: 'SPEC §5.5 internal economics: "Cost per unit is £31 against a price of £49, so the margin is fine" gives the sender\'s own unit cost and margin to a customer, in the subject line.'
  },
  {
    ind: 'wool shop', en: 'UK',
    from: ['Maureen Haigh', 'maureen@haighs-wool.example'],
    to: [['Carol Dyson', 'carol.dyson@webmail.example']],
    subject: 'Your yarn order',
    body: `Hi Carol, your 12 balls of the heather aran have arrived. I've put them aside with your name on. They are all from the same dye lot, so you won't see any difference in the colour. Maureen`
  },
  {
    ind: 'packaging supplier', en: 'UK',
    from: ['Gillian Marsh', 'gillian@marsh-packaging.example'],
    to: [['Ahmed Siddiqui', 'ahmed.siddiqui@siddiqui-sweets.example']],
    subject: 'Re: Gift boxes, lead time',
    body: `Hi Ahmed,

The printed gift boxes will take 14 working days from approval of the proof. The minimum order is 1,000, and the unit price at that quantity is 62p. If you can wait until the new year, we have a slot with a shorter lead time. I'll send the artwork template as soon as you give me a go-ahead.

Gillian

> We need printed boxes for the Diwali range. Can you tell me the lead time and the minimum order?`
  },
  {
    ind: 'pallet manufacturer', en: 'UK',
    from: ['Keith Ormerod', 'keith@ormerod-pallets.example'],
    to: [['Joanne Fisher', 'joanne.fisher@fisher-drinks.example']],
    subject: 'Pallets for Thursday',
    body: `Hi Joanne,

I can deliver 400 standard pallets on Thursday morning, between 7 and 9. They're heat-treated and marked ISPM 15. The price is £6.20 each, delivered. If you want the non-standard size, they'll take another week.

Keith`
  },
  {
    stop: 'negotiation', place: 'quoted',
    ind: 'steel stockholder', en: 'US',
    from: ['Barry Lindgren', 'barry@lindgren-steel.example'],
    to: [['Joan Whitaker', 'joan.whitaker@whitaker-fabrication.example']],
    subject: 'Re: Coil pricing for Q4',
    body: `Joan,

Thanks for your patience on the coil pricing. I'll have the Q4 quote to you by Friday.

Barry

On Wed, Oct 7, Hank Mueller wrote:
> Our best and final will be 41 but we'll open at 46 and see if they blink.`,
    sentence: 'Our best and final will be 41 but we\'ll open at 46 and see if they blink.',
    why: 'SPEC §5.6 negotiation position: "Our best and final will be 41 but we\'ll open at 46 and see if they blink." (quoted history) states the sender\'s opening price and best and final price.'
  },
  {
    ind: 'plumbing merchant', en: 'AU',
    from: ['Wayne Hollis', 'wayne@hollis-plumbingsupplies.example'],
    to: [['Brett Anderson', 'brett.anderson@anderson-plumbing.example']],
    subject: 'Hot water units on the truck',
    body: `Hi Brett,

The two 250-litre hot water units are on the truck for Tuesday morning delivery. If you need them earlier, you're welcome to collect them from the yard after 2 today. The invoice follows on the usual 30-day account. Give me a call if the site isn't ready.

Wayne`
  },
  {
    stop: 'remark', place: 'body',
    ind: 'commercial roofing', en: 'UK',
    from: ['Gary Brough', 'gary@brough-roofing-contracts.example'],
    to: [['Maggie Tennant', 'maggie.tennant@tennant-property.example']],
    subject: 'Re: Snagging at the Harbour Street unit',
    body: `Hi Maggie,

I've sent a team to put the flashing right on Thursday. We'll also look at the gutter that was reported.

That firm are a bunch of amateurs and cowboys, we've never had a job from them done right and I'm amazed anyone still uses them.

Gary`,
    sentence: 'That firm are a bunch of amateurs and cowboys, we\'ve never had a job from them done right and I\'m amazed anyone still uses them.',
    why: 'SPEC §5.7 remarks: "That firm are a bunch of amateurs and cowboys, we\'ve never had a job from them done right and I\'m amazed anyone still uses them." disparages another company.'
  },
  {
    ind: 'paint manufacturer', en: 'US',
    from: ['Dolores Whitcomb', 'dolores@brightcoat-paints.example'],
    to: [['Ken Aldridge', 'ken.aldridge@aldridge-painting.example']],
    cc: [['Linda Aldridge', 'linda@aldridge-painting.example']],
    subject: 'Color match samples',
    body: `Hi Ken,

The color match samples shipped today. There are three options: the lab matched the swatch you sent, plus one slightly warmer and one slightly cooler. Brush them out on the actual wall and look at them in morning and evening light. If you want to go ahead, I can have 20 gallons ready in three days.

Dolores`
  },
  {
    ind: 'stonemason', en: 'UK',
    from: ['Alan Kershaw', 'alan@kershaw-masonry.example'],
    to: [['Jean Rothwell', 'jean.rothwell@mailbox.example']],
    subject: 'Re: Fireplace surround',
    body: `Dear Jean,

I can make the sandstone fireplace surround to the drawing you sent. It will take about five weeks, and I'd come to measure the opening first. The cost is £1,650 including delivery and fitting. If you'd prefer limestone, it's £1,900. Let me know if you'd like me to come on Saturday.

Alan Kershaw

> Please could you quote for a stone fireplace in the lounge? I've attached a drawing.`
  },
  {
    ind: 'iron foundry', en: 'UK',
    from: ['Malcolm Pickersgill', 'malcolm@pickersgill-foundry.example'],
    to: [['Terry Haslam', 'terry.haslam@haslam-engineering.example']],
    cc: [['Goods In', 'goodsin@haslam-engineering.example']],
    subject: 'Castings ready',
    body: `Terry,

The 24 castings are poured and fettled and ready for collection. They're in the yard on pallets, strapped. Three had minor blow-holes which we've scrapped and re-poured, so they're not in this batch. The remaining ones will follow next Tuesday.

Malcolm`
  },
  {
    ind: 'CNC machining', en: 'US',
    from: ['Dana Frey', 'dana@fireline-machining.example'],
    to: [['Pete Alvarado', 'pete.alvarado@alvarado-robotics.example']],
    cc: [['Quality', 'quality@alvarado-robotics.example']],
    subject: 'First article inspection results',
    body: `Pete,

The first article is done and we've measured all 18 features. Everything is inside tolerance except the bore at the back, which is 0.0004 over the limit. We can adjust the offset and run another piece tomorrow. We'll send the full inspection report with it.

Dana`
  },
  {
    ind: 'injection moulding', en: 'UK',
    from: ['Stuart Pennock', 'stuart@pennock-plastics.example'],
    to: [['Rachel Dunn', 'rachel.dunn@dunn-products.example']],
    cc: [['Sam Okoye', 'sam.okoye@dunn-products.example']],
    subject: 'Tool trial on Wednesday',
    body: `Hi Rachel,

The tool trial is on Wednesday at 9. We'll run about 50 shots and send you samples by courier that evening. If the parts are good, we can start the first production run next week. Material is the grey ABS as on the drawing.

Stuart`
  },
  {
    ind: '3D printing bureau', en: 'UK',
    from: ['Jamie Fenn', 'jamie@fenn-3dprint.example'],
    to: [['Emma Stocks', 'emma.stocks@stocks-design.example']],
    subject: 'Re: Prototype print',
    body: `Hi Emma,

Your prototype is printing now, and should be finished by tomorrow midday. It takes about 14 hours in nylon. We'll sand it and dye it black as requested. If it's okay, I'll post it tomorrow evening for delivery on Friday.

Jamie

> Can you print the housing in black nylon this week? The STL is in the link below.`
  },
  {
    stop: 'negotiation', place: 'body',
    ind: 'freight carrier', en: 'US',
    from: ['Hal Brewster', 'hal@brewster-freight.example'],
    to: [['Marla Quinn', 'marla.quinn@quinn-importers.example']],
    subject: 'Re: Lane rates for next year',
    body: `Marla,

Thanks for the volume forecast, which is helpful. I'll go through the lanes and send you updated rates early next week.

We have some room on the rate, probably another 5 percent, if you push hard on volume.

Hal`,
    sentence: 'We have some room on the rate, probably another 5 percent, if you push hard on volume.',
    why: 'SPEC §5.6 negotiation position: "We have some room on the rate, probably another 5 percent, if you push hard on volume." states how much room the sender has to move on price.'
  },
  {
    ind: 'soil testing laboratory', en: 'AU',
    from: ['Dr Ian Cheung', 'ian@terrasoil-lab.example'],
    to: [['Maree Collins', 'maree.collins@collins-vineyards.example']],
    subject: 'Soil analysis, block 3',
    body: `Hi Maree,

Your block 3 soil test results are done. pH is 6.1, organic carbon 1.8 percent, and phosphorus and potassium are both adequate. Magnesium is a little low, and I'd suggest dolomite at about 1 tonne per hectare before winter. Zinc is borderline. Ring me if you'd like to discuss the recommendations.

Ian`
  },
  {
    ind: 'sign language interpreting', en: 'UK',
    from: ['Hannah Brook', 'hannah@brook-bsl.example'],
    to: [['Dr Mark Ellison', 'mark.ellison@hartley-college.example']],
    subject: 'Interpreters for Thursday\'s lecture',
    body: `Dear Dr Ellison,

I can confirm two BSL interpreters for Thursday's lecture, 10 to 12. We'll alternate every 20 minutes. It would help a lot if we could have the slides a day before, with any technical terms. We'll arrive at 9.30 to meet the student and check where we should stand.

Best wishes,
Hannah Brook`
  },
  {
    ind: 'freelance copywriter', en: 'US',
    from: ['Lauren Hobbs', 'lauren@hobbswrites.example'],
    to: [['Pete Garza', 'pete.garza@garzaoutdoors.example']],
    subject: 'Draft product descriptions',
    body: `Hi Pete,

The first ten product descriptions are in the doc linked below. I went with a slightly more playful tone than the old copy, but happy to pull it back if you prefer. Tell me what you think by Thursday and I'll write the remaining forty.

Lauren

https://hobbswrites.example/review/garza`
  },
  {
    ind: 'freelance bookkeeper', en: 'AU',
    from: ['Jenny Marlow', 'jenny@marlow-bookkeeping.example'],
    to: [['Tony Voss', 'tony.voss@vosscarpentry.example']],
    subject: 'BAS due on the 28th',
    body: `Hi Tony,

Your BAS is due on the 28th. I've reconciled everything up to the 25th, but there are about 12 transactions I can't match to receipts. Could you send me those by Friday? After that I'll lodge it and tell you what's owed.

Jenny`
  },
  {
    stop: 'remark', place: 'body',
    ind: 'translation agency', en: 'UK',
    from: ['Sofia Marangoni', 'sofia@marangoni-translations.example'],
    to: [['Peter Haddon', 'peter.haddon@haddon-legal.example']],
    subject: 'Re: Payment run for the French contracts',
    body: `Hi Peter,

Thanks for confirming the translators' rates. I'll send you the revised invoice today.

Their finance team couldn't organise a raffle, let alone a payment run, so please chase them directly.

Sofia`,
    sentence: 'Their finance team couldn\'t organise a raffle, let alone a payment run, so please chase them directly.',
    why: 'SPEC §5.7 remarks: "Their finance team couldn\'t organise a raffle, let alone a payment run, so please chase them directly." is a disparaging remark about another company\'s team.'
  },
  {
    ind: 'voiceover artist', en: 'UK',
    from: ['Gareth Lloyd-Jones', 'gareth@lloydjones-voice.example'],
    to: [['Anna Brewer', 'anna.brewer@brewer-films.example']],
    subject: 'Studio session Friday',
    body: `Hi Anna, I can record on Friday at 2 from my home studio. The script is 480 words, so it should take about an hour with retakes. I'll send the files by 6pm. Gareth`
  },
  {
    ind: 'freelance illustrator', en: 'UK',
    from: ['Tess Waring', 'tess@waring-illustration.example'],
    to: [['Mark Hollis', 'mark.hollis@hollis-publishing.example']],
    subject: 'Sketches for chapter 3',
    body: `Hi Mark, rough sketches for chapter 3 are in the shared folder. Three options for the opening spread. Tell me which you like best and I'll move to finished artwork. Tess`
  }
];
