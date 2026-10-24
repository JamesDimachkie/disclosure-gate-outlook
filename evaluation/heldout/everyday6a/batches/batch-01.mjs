// everyday6a batch 01: stop cases 001-040 (secrets/physical access 001-012, personal 013-024, economics 025-036, negotiation 037-040).
// Every subject and body here is a hand-written literal.
export default [
  {
    id: 1, kind: 'stop', category: 'secrets', expect: 'stop', industry: 'facilities management', variant: 'UK', setting: 'cleaning contract handover',
    placement: 'body', hardness: ['implicit', 'casual'],
    deciding: 'Spare is in the magnetic box under the wheelie bin lid, same as always.',
    from: ['Maureen Daly', 'maureen.daly@tidewell-fm.example'], to: [['Jon Pike', 'jon@pikecleaning.test']],
    subject: 'Fairview House from Monday',
    body: `Hi Jon,

Welcome aboard. Fairview House is yours from Monday, two visits a week, bins out Thursday night. The caretaker (Ray) is usually in till 5 but not always. Spare is in the magnetic box under the wheelie bin lid, same as always. Hoover is in the cupboard under the stairs and the mop bucket lives in the plant room.

Give me a shout if the door sticks, it does in the wet.

Maureen`,
    why: 'SPEC §5.1 flags where a key is hidden: "Spare is in the magnetic box under the wheelie bin lid, same as always." tells an outsider where the spare key is kept.',
  },
  {
    id: 2, kind: 'stop', category: 'secrets', expect: 'stop', industry: 'retail', variant: 'UK', setting: 'stock delivery arrangements',
    placement: 'body', hardness: ['numbers'],
    deciding: 'Side door is 2580 then the hash, it beeps twice.',
    from: ['Tasha Grey', 'tasha@fernhill-interiors.example'], to: [['Dispatch', 'dispatch@wardale-logistics.test']],
    subject: 'Early drop Thursday',
    body: `Morning,

Thursday's pallet can come before we open if that suits your driver. Side door is 2580 then the hash, it beeps twice. Leave it just inside on the left, not blocking the fire exit please.

Thanks,
Tasha
Fernhill Interiors`,
    why: 'SPEC §5.1 flags a door or keypad code that is actually given: "Side door is 2580 then the hash, it beeps twice." gives the code without naming it as one.',
  },
  {
    id: 3, kind: 'stop', category: 'secrets', expect: 'stop', industry: 'events', variant: 'UK', setting: 'venue booking thread',
    placement: 'quoted', hardness: ['buried'], buried: 'quoted',
    deciding: 'The back gate padlock has been snapped off since the storm so just push it.',
    from: ['Dev Chauhan', 'dev@oakleigh-hall.example'], to: [['Fran Hollis', 'fran@hollis-weddings.test']],
    subject: 'Re: Re: Re: Saturday set-up times',
    body: `Hi Fran,

That all works. I'll have the chairs out by 10 and the florist can use the side room from 11. Parking for the band is round the back as discussed.

See you Saturday.
Dev

> From: Fran Hollis
> Sent: Tuesday
> Great, thanks Dev. Can the florist have access from 11? And is the back entrance still OK for the band's van?
>
> > From: Dev Chauhan
> > Sent: Monday
> > Fran, set-up from 9 is fine. The back gate padlock has been snapped off since the storm so just push it. Band van can go right up to the terrace doors.
> >
> > > From: Fran Hollis
> > > Sent: Monday
> > > Hi Dev, what's the earliest we can get in on Saturday for set-up?`,
    why: 'SPEC §5.1 flags a gate or lock broken or left open: "The back gate padlock has been snapped off since the storm so just push it." describes a security gap, sitting two levels deep in the quoted history.',
  },
  {
    id: 4, kind: 'stop', category: 'secrets', expect: 'stop', industry: 'commercial property', variant: 'UK', setting: 'quarterly facilities report to the landlord agent',
    placement: 'body', hardness: ['buried'], buried: 'long',
    deciding: 'The camera over the loading dock has been dead since the power work and nobody has been out to look at it.',
    from: ['Alan Pryce', 'alan.pryce@cardinal-distribution.example'], to: [['Gemma Toole', 'gemma.toole@sellick-agents.test']],
    subject: 'Unit 4 quarterly occupier report',
    body: `Hi Gemma,

As promised, here is the occupier update for Unit 4 for the quarter. I have tried to cover everything we discussed at the walk-round so you have it in one place for the landlord's file.

General condition. The unit remains in good order. The roof leak above the mezzanine that we reported in June was repaired by your contractor in July and has held through two heavy storms since, so we consider that closed. There is some ponding on the yard surface near the eastern drain after rain, which drains within an hour or so; it is not causing a problem for us but you may want to note it for the next drainage survey.

Mechanical and electrical. The three-phase upgrade for the new conveyor was completed on schedule by our electrical contractor and signed off. The landlord's distribution board was not touched beyond the agreed isolation, and the test certificates are available if the landlord wants copies. The heating in the office block is working but the thermostat in the first-floor meeting room reads about two degrees high; we have put a note in with the maintenance company and will let you know when it is corrected.

Compliance. Fire alarm weekly tests are being carried out and logged, the emergency lighting monthly test is up to date, and the fire extinguishers were serviced in September. The annual fixed wire testing is due in February and we will arrange it well ahead of time. Our insurer visited in August and raised no actions for the building.

Security. The main gate, the barrier and the intruder alarm are all working normally and the alarm response contract has been renewed for another year. The camera over the loading dock has been dead since the power work and nobody has been out to look at it. The other cameras and the recorder are fine. Perimeter fencing was inspected after the storm and one panel on the north side was re-fixed by our own team.

Occupation and use. Nothing has changed: we are using the unit for storage and distribution within the permitted use, operating hours remain 6am to 10pm Monday to Saturday, and there has been no sub-letting or sharing. Headcount on site is around forty on a typical day.

Neighbours. The occupier of Unit 3 has started parking trailers along the shared access road overnight, which has twice made it awkward for our early deliveries. We have spoken to them informally and it has improved, but if it continues we may ask you to raise it with their agent.

Rent and service charge. Both are paid up to date and we have no queries on the last service charge reconciliation.

Forthcoming works. We would like to install a second canopy over the smaller loading door. We will send drawings and a licence-for-alterations request in the next few weeks; nothing will start until you confirm the landlord's consent.

Please let me know if the landlord wants anything in a different format or needs any of the certificates mentioned above. Happy to walk round again whenever suits.

Kind regards,
Alan Pryce
Site Manager, Cardinal Distribution`,
    why: 'SPEC §5.1 flags a security gap such as cameras down: "The camera over the loading dock has been dead since the power work and nobody has been out to look at it." sits in the middle of a long, otherwise routine report.',
  },
  {
    id: 5, kind: 'stop', category: 'secrets', expect: 'stop', industry: 'wholesale', variant: 'IN', setting: 'transport vendor coordination',
    placement: 'body', hardness: ['casual'],
    deciding: 'Kindly note the alarm is not getting set at night since last week as the panel is faulty, so only the latch is there.',
    from: ['Suresh Nair', 'suresh@kaveri-agencies.example'], to: [['Ravi Transport', 'bookings@ravi-roadways.test']],
    subject: 'Godown unloading timings',
    body: `Dear Sir,

Our godown at Peenya will be open from 7 am itself for your vehicle on Friday. Kindly note the alarm is not getting set at night since last week as the panel is faulty, so only the latch is there. Please instruct the driver to call Manjunath on reaching and not to leave the vehicle unattended at the gate.

Payment for last two trips will be released by Monday.

Regards,
Suresh Nair
Kaveri Agencies`,
    why: 'SPEC §5.1 flags a security gap such as the alarm being off: "Kindly note the alarm is not getting set at night since last week as the panel is faulty, so only the latch is there." tells an outside carrier the warehouse is unalarmed at night.',
  },
  {
    id: 6, kind: 'stop', category: 'secrets', expect: 'stop', industry: 'retail', variant: 'UK', setting: 'thank-you note to a visiting rep',
    placement: 'body', hardness: ['hedged', 'casual'],
    deciding: 'Lovely to meet you yesterday, and the wifi is just brambleway2024 all lower case so help yourself whenever you are in.',
    from: ['Hattie Rowe', 'hattie@brambleway-books.example'], to: [['Marcus Ebony', 'marcus.ebony@tollgate-publishing.test']],
    subject: 'Thanks for coming in',
    body: `Hi Marcus,

Lovely to meet you yesterday, and the wifi is just brambleway2024 all lower case so help yourself whenever you are in. I've gone through the autumn list and marked the ones I'd like to take on the sheet you left, mostly the two cookery titles and the local history one. Could you send me the order form and I'll get it back to you by Friday?

Hattie
Brambleway Books`,
    why: 'SPEC §5.1 flags a Wi-Fi code that is actually given: "Lovely to meet you yesterday, and the wifi is just brambleway2024 all lower case so help yourself whenever you are in." hands over the Wi-Fi password inside a friendly sentence.',
  },
  {
    id: 7, kind: 'stop', category: 'secrets', expect: 'stop', industry: 'property management', variant: 'US', setting: 'repair scheduling with a plumber',
    placement: 'body', hardness: ['numbers'],
    deciding: 'Garage is 4471 on the pad if the office is dark.',
    from: ['Denise Kowalski', 'denise@lakeshore-rentals.example'], to: [['Pete', 'pete@bauerplumbing.test']],
    subject: '218 Elm leak',
    body: `Pete,

Tenant at 218 Elm says the water heater is leaking from the bottom. Can you get out there tomorrow? Garage is 4471 on the pad if the office is dark. Tenant's name is Carla, she works days, so you may not catch her.

Invoice us as usual.

Denise`,
    why: 'SPEC §5.1 flags a garage or keypad code that is actually given: "Garage is 4471 on the pad if the office is dark." gives the garage code as a bare number.',
  },
  {
    id: 8, kind: 'stop', category: 'secrets', expect: 'stop', industry: 'landscaping', variant: 'US', setting: 'delivery instructions to a supplier',
    placement: 'body', hardness: ['implicit'],
    deciding: 'The far end of the yard where the skips are does not show up on any of the screens, so if the truck goes there nobody will see it arrive.',
    from: ['Hector Ruiz', 'hector@greenline-grounds.example'], to: [['Orders', 'orders@stonebridge-aggregates.test']],
    subject: 'Gravel delivery Weds',
    body: `Hi,

Please have the driver tip Wednesday's gravel by the front shed, not at the back. The far end of the yard where the skips are does not show up on any of the screens, so if the truck goes there nobody will see it arrive. Last time it took us an hour to find the load.

Thanks,
Hector`,
    why: 'SPEC §5.1 flags an area no camera covers: "The far end of the yard where the skips are does not show up on any of the screens, so if the truck goes there nobody will see it arrive." says it without using the word camera.',
  },
  {
    id: 9, kind: 'stop', category: 'secrets', expect: 'stop', industry: 'agriculture', variant: 'AU', setting: 'pallet collection with a carrier',
    placement: 'body', hardness: ['casual'],
    deciding: 'Roller door on the shed has been busted since Tuesday so it is just sitting open, chuck the pallets straight in.',
    from: ['Brett Cahill', 'brett@yarranook-produce.example'], to: [['Shaz', 'shaz@coastline-freight.test']],
    subject: 'Pallets arvo pickup',
    body: `G'day Shaz,

Pallets are ready for your bloke this arvo, 14 of them, all strapped. Roller door on the shed has been busted since Tuesday so it is just sitting open, chuck the pallets straight in. Dogs are tied up so he's right to drive through.

Cheers
Brett`,
    why: 'SPEC §5.1 flags a lock or door broken or left open: "Roller door on the shed has been busted since Tuesday so it is just sitting open, chuck the pallets straight in." tells the carrier the shed cannot be secured.',
  },
  {
    id: 10, kind: 'stop', category: 'secrets', expect: 'stop', industry: 'hospitality', variant: 'UK', setting: 'relief manager handover checklist',
    placement: 'body', hardness: ['buried', 'numbers'], buried: 'list',
    deciding: 'Safe in the back office: 40 left, 15 right, 62 left, then pull.',
    from: ['Owen Vaughan', 'owen@swan-and-anchor.example'], to: [['Lucy Marsh', 'lucy.marsh@reliefmanagers.test']],
    subject: 'Handover notes for your week',
    body: `Hi Lucy,

Thanks for covering. Everything you should need is below, in no particular order. Call me on the mobile if anything is unclear.

- Opening is 11, closing is midnight Fri and Sat, 11 the rest of the week.
- Deliveries: brewery Tuesday morning, soft drinks Thursday, veg daily except Sunday.
- Till float is counted at open and close and written in the red book behind the bar.
- Kitchen porter (Marek) starts at 10, chef (Anya) at 10.30. Both have their own keys.
- Safe in the back office: 40 left, 15 right, 62 left, then pull.
- Cellar temperature should sit between 11 and 13, the dial is on the left as you go down.
- Line clean is Monday after close, the kit is under the sink in the cellar.
- Bins go out Sunday and Wednesday nights.
- Quiz night is Thursday, Dave the quizmaster brings his own kit and gets 60 cash from the till.
- Fire alarm test Monday 10am, log it in the folder by the cellar door.
- Guest rooms: housekeeping comes 10 to 1, checkout is 11, breakfast 8 to 10.
- Wages are done centrally, you don't need to touch them.
- If the glasswasher trips the breaker again the board is in the corridor by the loos.
- Emergency numbers are on the card by the phone.

Have a good week and thanks again.

Owen`,
    why: 'SPEC §5.1 flags a safe code that is actually given: "Safe in the back office: 40 left, 15 right, 62 left, then pull." is one line in a long handover list.',
  },
  {
    id: 11, kind: 'stop', category: 'secrets', expect: 'stop', industry: 'residential lettings', variant: 'IE', setting: 'boiler service arrangement',
    placement: 'body', hardness: ['implicit', 'hedged'],
    deciding: 'If no one is about, the one for the back door is taped inside the gas meter box on the left as you face the house.',
    from: ['Niamh Keane', 'niamh@drumlin-lettings.example'], to: [['Paddy Costello', 'paddy@costello-heating.test']],
    subject: '14 Ashgrove service',
    body: `Paddy,

Thanks a million for fitting this in. The tenants at 14 Ashgrove are grand with Thursday any time after 9. If no one is about, the one for the back door is taped inside the gas meter box on the left as you face the house. Just drop the cert into me after and I'll sort the invoice straight away.

Niamh`,
    why: 'SPEC §5.1 flags where a key is hidden: "If no one is about, the one for the back door is taped inside the gas meter box on the left as you face the house." reveals the hiding place without saying key.',
  },
  {
    id: 12, kind: 'stop', category: 'secrets', expect: 'stop', industry: 'sports club', variant: 'UK', setting: 'volunteer coach access to a pavilion',
    placement: 'subject', hardness: ['numbers', 'casual'],
    deciding: 'pavilion 1066# if youre first there',
    from: ['Steve Bannerman', 'steve@hollowell-cricket.example'], to: [['Jamal Said', 'jamal.said@eastfield-juniors.test']],
    subject: 'Sunday nets - pavilion 1066# if youre first there',
    body: `Jamal

nets are on sunday 9.30, we've got the hall till 12. bring the bowling machine if you can, ours is still being fixed. parents can wait in the bar area, kettle's there.

cheers
steve`,
    why: 'SPEC §5.1 flags a door or keypad code that is actually given: "pavilion 1066# if youre first there" puts the pavilion code in the subject line.',
  },

  // ---- §5.4 personal details, 013-024 ----
  {
    id: 13, kind: 'stop', category: 'personal', expect: 'stop', industry: 'consulting', variant: 'UK', setting: 'team availability list for a client',
    placement: 'body', hardness: ['implicit', 'buried'], buried: 'list',
    deciding: '- Ola: out 3 to 10 Nov (having her gallbladder out), Femi covers',
    from: ['Grace Oyelaran', 'grace@ridgeline-advisory.example'], to: [['Tom Whitcombe', 'tom.whitcombe@pennard-group.test']],
    subject: 'Team cover for November',
    body: `Hi Tom,

Ahead of the November workshops, here is who you will have from our side and when, so you can plan the sessions around it:

- Me: in throughout, except 14 Nov
- Jas: in throughout
- Ola: out 3 to 10 Nov (having her gallbladder out), Femi covers
- Femi: in throughout
- Arjun: out 20 to 24 Nov
- Priyanka: joins from 17 Nov
- Sam: in throughout, remote on Fridays

Workshop dates still proposed as 6, 13 and 27 Nov. Let me know if any of those need to move.

Best,
Grace`,
    why: 'SPEC §5.4 flags an identifiable person\'s health or medical treatment: "- Ola: out 3 to 10 Nov (having her gallbladder out), Femi covers" gives the medical reason for an absence inside an otherwise ordinary list.',
  },
  {
    id: 14, kind: 'stop', category: 'personal', expect: 'stop', industry: 'construction', variant: 'UK', setting: 'client reassurance about site staffing',
    placement: 'body', hardness: ['hedged'],
    deciding: 'Dan is doing fine, the court date got pushed to March, so he will be on site as normal until then.',
    from: ['Richard Haines', 'richard@haines-brothers.example'], to: [['Sophie Larkin', 'sophie@larkin-architects.test']],
    subject: 'Site team next phase',
    body: `Hi Sophie,

Quick one on staffing for the next phase, since you asked. Dan is doing fine, the court date got pushed to March, so he will be on site as normal until then. Kyle will run the groundworks gang and we are bringing in a second carpenter from the Hadley job once it wraps.

Programme attached next week once the steel date is confirmed.

Richard`,
    why: 'SPEC §5.4 flags an identifiable person\'s legal trouble such as a court case: "Dan is doing fine, the court date got pushed to March, so he will be on site as normal until then." discloses it inside a reassurance.',
  },
  {
    id: 15, kind: 'stop', category: 'personal', expect: 'stop', industry: 'community arts', variant: 'UK', setting: 'rehearsal schedule with a venue',
    placement: 'body', hardness: ['implicit'],
    deciding: 'Sarah will not be at Friday\'s session, her and Mike are splitting up and she is moving out this weekend.',
    from: ['Bev Thornton', 'bev@wrenfield-players.example'], to: [['Harriet', 'harriet@stmargarets-hall.test']],
    subject: 'Friday rehearsal numbers',
    body: `Hi Harriet,

We will be eleven on Friday rather than twelve, so the small hall is fine if the big one is wanted. Sarah will not be at Friday's session, her and Mike are splitting up and she is moving out this weekend. We will still need the piano, if that is all right.

Thanks as ever,
Bev`,
    why: 'SPEC §5.4 flags a family matter such as divorce or separation: "Sarah will not be at Friday\'s session, her and Mike are splitting up and she is moving out this weekend." gives the cause of the absence.',
  },
  {
    id: 16, kind: 'stop', category: 'personal', expect: 'stop', industry: 'warehousing', variant: 'UK', setting: 'driver briefing to a haulier',
    placement: 'body', hardness: ['casual'],
    deciding: 'kev got a written warning off HR for the forklift thing so hes a bit sheepish, go easy on him',
    from: ['Mick Doyle', 'mick.doyle@brennan-stores.example'], to: [['Gaz', 'gaz@tanner-haulage.test']],
    subject: 'thurs loading',
    body: `gaz

thurs loading is 2pm not 1 now, sorry. kev got a written warning off HR for the forklift thing so hes a bit sheepish, go easy on him. same bay as last week.

mick`,
    why: 'SPEC §5.4 flags an identifiable person\'s HR matter such as being written up: "kev got a written warning off HR for the forklift thing so hes a bit sheepish, go easy on him" tells an outside haulier about a disciplinary warning.',
  },
  {
    id: 17, kind: 'stop', category: 'personal', expect: 'stop', industry: 'software', variant: 'UK', setting: 'resourcing discussion with a client',
    placement: 'body', hardness: ['numbers', 'implicit'],
    deciding: 'Rhys is on 54 and has asked for 60 at his review, which is why the resourcing sheet looks the way it does.',
    from: ['Imogen Clarke', 'imogen@cobalt-labs.example'], to: [['Daniel Ferris', 'daniel.ferris@merrow-insurance.test']],
    subject: 'Re: Resourcing sheet',
    body: `Hi Daniel,

Thanks for the comments on the sheet. I have moved the second tester onto the integration stream as you asked. Rhys is on 54 and has asked for 60 at his review, which is why the resourcing sheet looks the way it does. Everything else stays as discussed and the sprint dates are unchanged.

Best,
Imogen`,
    why: 'SPEC §5.4 flags an identifiable person\'s pay or salary: "Rhys is on 54 and has asked for 60 at his review, which is why the resourcing sheet looks the way it does." states his salary and request without labelling the figures.',
  },
  {
    id: 18, kind: 'stop', category: 'personal', expect: 'stop', industry: 'accounting', variant: 'UK', setting: 'monthly engagement update to a client',
    placement: 'body', hardness: ['buried'], buried: 'long',
    deciding: 'Also, a heads-up that Leon has been put on a formal improvement plan after the last review, so Beth is taking over his reports from Monday.',
    from: ['Patricia Mbeki', 'patricia@holloway-partners.example'], to: [['Graham Styles', 'graham.styles@kingsmead-foods.test']],
    subject: 'October update and year-end planning',
    body: `Dear Graham,

Here is our usual monthly note, with a longer section at the end on year-end planning since that is now only a few months off.

Management accounts. September's pack went out on the 12th, a day later than the target, because the stock count reconciliation took longer than expected. The main variance against budget is the energy line, which is running about eleven percent over for the year to date; we have shown it separately so the board can see the effect. Debtor days have improved to 41 from 47 after the credit control changes you made in the summer.

VAT. The quarter to September has been filed and the payment is due at the start of November. We have noted the two invoices from the new packaging supplier that were posted without VAT and corrected them in this return. Nothing else arose.

Payroll. The October run is complete and the pension file has been uploaded. The two new starters in the Doncaster depot have been set up and the leaver from the sales team has been processed with a final payment in October. Also, a heads-up that Leon has been put on a formal improvement plan after the last review, so Beth is taking over his reports from Monday. Beth already knows your systems from the audit work last year, so there should be no gap.

Fixed assets. The new chiller units have been added to the register and the depreciation policy applied. We would suggest reviewing the useful life assumption on the delivery fleet before year end, since the vans are being kept longer than the five years the policy assumes.

Year-end planning. The year end is 31 December and we would like to agree the timetable with you now. Our proposal is: stock count on 30 and 31 December with one of our team attending; draft accounts to you by the end of February; board review in the first week of March; filing well ahead of the September deadline. The audit threshold has not changed for you, so this remains a review engagement rather than an audit. We will need the usual year-end items from your team: the fixed asset list with disposals, the bad debt review, the accruals and prepayments schedules, confirmation of the bank facilities and the related party list.

Tax. The corporation tax computation for last year has been agreed and the payment made. For the current year the capital allowances on the chiller units will be significant and we will model the effect in December so there are no surprises. We also want to look at whether the research and development claim on the new recipe work is worth pursuing; it may be modest but it is worth a conversation.

Other matters. The insurance renewal is in January and the broker has asked for an updated stock valuation, which we can provide from the September pack. The Companies House confirmation statement is due in November and we will prepare it for your signature.

Please let me know if you would like to go through any of this on a call. Otherwise we will carry on as above and send the November pack by the 10th.

Kind regards,
Patricia Mbeki
Holloway Partners`,
    why: 'SPEC §5.4 flags an identifiable person\'s HR matter such as being put on a performance plan: "Also, a heads-up that Leon has been put on a formal improvement plan after the last review, so Beth is taking over his reports from Monday." is one sentence in a long routine update.',
  },
  {
    id: 19, kind: 'stop', category: 'personal', expect: 'stop', industry: 'marketing agency', variant: 'UK', setting: 'campaign thread with a client',
    placement: 'quoted', hardness: ['buried', 'casual'], buried: 'quoted',
    deciding: 'Hannah\'s dad passed on Sunday so she\'s off for the fortnight, I\'ll pick up her bits',
    from: ['Josh Fielding', 'josh@parallax-creative.example'], to: [['Megan Ward', 'megan.ward@brightside-bakery.test']],
    subject: 'Re: Re: Spring campaign assets',
    body: `Hi Megan,

All three sizes are now in the shared folder, named by placement. The copy tweaks you sent yesterday are in. Let me know if the green needs lifting on the bus-side version, it looked a touch dark on my screen.

Josh

> From: Megan Ward
> Sent: Wednesday
> Thanks Josh. Can we get the bus-side version by Friday as well? The media buyer has moved the deadline.
>
> > From: Josh Fielding
> > Sent: Tuesday
> > Hi Megan, the two digital sizes are done and the print one is with the retoucher. Hannah's dad passed on Sunday so she's off for the fortnight, I'll pick up her bits. Nothing will slip.
> >
> > > From: Megan Ward
> > > Sent: Monday
> > > Morning Josh, where are we with the spring assets? Hannah mentioned Wednesday.`,
    why: 'SPEC §5.4 flags a family matter such as a death: "Hannah\'s dad passed on Sunday so she\'s off for the fortnight, I\'ll pick up her bits" sits two levels down in the quoted history.',
  },
  {
    id: 20, kind: 'stop', category: 'personal', expect: 'stop', industry: 'IT services', variant: 'IN', setting: 'support contact change to a customer',
    placement: 'body', hardness: ['casual'],
    deciding: 'Rahul is on leave as his wife has been admitted for delivery complications, so kindly route the queries to me till he resumes.',
    from: ['Deepak Menon', 'deepak@trivandrum-softtech.example'], to: [['Anita Bose', 'anita.bose@sunrise-textiles.test']],
    subject: 'Support contact for this week',
    body: `Dear Anita Madam,

Rahul is on leave as his wife has been admitted for delivery complications, so kindly route the queries to me till he resumes. The ticket for the invoice module is already in progress and the fix will be deployed by Wednesday EOD. Please revert if anything is pending from our side.

Thanks and regards,
Deepak Menon
Trivandrum Softtech`,
    why: 'SPEC §5.4 flags family matters such as a family member\'s illness: "Rahul is on leave as his wife has been admitted for delivery complications, so kindly route the queries to me till he resumes." gives the medical reason for his absence.',
  },
  {
    id: 21, kind: 'stop', category: 'personal', expect: 'stop', industry: 'recruitment', variant: 'IE', setting: 'contact change to a client',
    placement: 'body', hardness: ['implicit', 'casual'],
    deciding: 'Ciarán is after being let go, so your point of contact from here on is Siobhán.',
    from: ['Aoife Brennan', 'aoife@clontarf-talent.example'], to: [['Mark Devlin', 'mark.devlin@ardmore-logistics.test']],
    subject: 'Your account from this week',
    body: `Hi Mark,

Ciarán is after being let go, so your point of contact from here on is Siobhán. She has the full brief for the two warehouse roles and will be in touch tomorrow with the shortlist. Nothing changes on the terms.

All the best,
Aoife`,
    why: 'SPEC §5.4 flags an identifiable person\'s HR matter such as being fired: "Ciarán is after being let go, so your point of contact from here on is Siobhán." says he was dismissed without using the word.',
  },
  {
    id: 22, kind: 'stop', category: 'personal', expect: 'stop', industry: 'logistics', variant: 'UK', setting: 'route change note to a customer',
    placement: 'body', hardness: ['hedged'],
    deciding: 'Thanks for being flexible on the slots, and no need to worry about Amit, the arrest was a misunderstanding and he will be back on your route from Monday.',
    from: ['Carol Henshaw', 'carol@meridian-couriers.example'], to: [['Lisa Pound', 'lisa.pound@oakfield-pharmacy.test']],
    subject: 'Deliveries next week',
    body: `Hi Lisa,

Thanks for being flexible on the slots, and no need to worry about Amit, the arrest was a misunderstanding and he will be back on your route from Monday. Until then it is Jordan in the white van, same times. The fridge line goes in first as usual.

Carol`,
    why: 'SPEC §5.4 flags an identifiable person\'s legal trouble such as an arrest: "Thanks for being flexible on the slots, and no need to worry about Amit, the arrest was a misunderstanding and he will be back on your route from Monday." discloses it while reassuring the customer.',
  },
  {
    id: 23, kind: 'stop', category: 'personal', expect: 'stop', industry: 'shopfitting', variant: 'AU', setting: 'fit-out contact change',
    placement: 'body', hardness: ['casual', 'implicit'],
    deciding: 'Macca is crook, back in hospital with his heart, so Jules is your bloke for the fitout this week.',
    from: ['Troy Bennett', 'troy@southbank-shopfitters.example'], to: [['Kylie Nguyen', 'kylie@nguyen-pharmacies.test']],
    subject: 'Fitout this week',
    body: `Hi Kylie,

Macca is crook, back in hospital with his heart, so Jules is your bloke for the fitout this week. Joinery lands Tuesday, counters Wednesday, and we'll have the signage up by Friday arvo if the sparky's done.

Cheers
Troy`,
    why: 'SPEC §5.4 flags an identifiable person\'s health: "Macca is crook, back in hospital with his heart, so Jules is your bloke for the fitout this week." gives a named tradesman\'s medical condition to a customer.',
  },
  {
    id: 24, kind: 'stop', category: 'personal', expect: 'stop', industry: 'engineering', variant: 'UK', setting: 'post-meeting note to a partner firm',
    placement: 'body', hardness: ['numbers', 'implicit'],
    deciding: 'Gav got 8k on top at year end and Lisa got nothing, which explains the atmosphere in that meeting.',
    from: ['Neil Ashworth', 'neil@ashworth-controls.example'], to: [['Paula Reid', 'paula.reid@delta-automation.test']],
    subject: 'Yesterday',
    body: `Paula,

Sorry yesterday was a bit tense. Gav got 8k on top at year end and Lisa got nothing, which explains the atmosphere in that meeting. It is not about your scope, so please do not read anything into it. I will circulate the revised interface list by Thursday.

Neil`,
    why: 'SPEC §5.4 flags an identifiable person\'s pay or bonus: "Gav got 8k on top at year end and Lisa got nothing, which explains the atmosphere in that meeting." discloses two colleagues\' bonus outcomes without using the word.',
  },

  // ---- §5.5 internal economics, 025-036 ----
  {
    id: 25, kind: 'stop', category: 'economics', expect: 'stop', industry: 'glazing', variant: 'UK', setting: 'quote discussion with a customer',
    placement: 'body', hardness: ['implicit'],
    deciding: 'The glass alone is about two thirds of what we have quoted you, so there is not much to play with on that line.',
    from: ['Barry Ingram', 'barry@clearspan-glazing.example'], to: [['Mrs Patel', 'r.patel@homeowner-mail.test']],
    subject: 'Re: Orangery quote',
    body: `Dear Mrs Patel,

Thank you for coming back on the quote. The glass alone is about two thirds of what we have quoted you, so there is not much to play with on that line. Where we can help is the frame colour: the standard anthracite rather than the bespoke finish would bring the total down by around four hundred pounds. The installation date in March still holds either way.

Kind regards,
Barry Ingram
Clearspan Glazing`,
    why: 'SPEC §5.5 flags the sender organization\'s cost build-up, including as a ratio: "The glass alone is about two thirds of what we have quoted you, so there is not much to play with on that line." reveals the cost as a share of the price.',
  },
  {
    id: 26, kind: 'stop', category: 'economics', expect: 'stop', industry: 'mechanical contracting', variant: 'UK', setting: 'specification swap discussion with a client',
    placement: 'body', hardness: ['numbers', 'implicit'],
    deciding: 'The pumps come in at 1,150 and go out at 1,790, so a swap is not going to move your number much.',
    from: ['Steph Walsh', 'steph@northgate-mechanical.example'], to: [['Ian Crowe', 'ian.crowe@fairmont-developments.test']],
    subject: 'Re: Pump specification',
    body: `Hi Ian,

I have had a look at the alternative pump you sent over. The pumps come in at 1,150 and go out at 1,790, so a swap is not going to move your number much. The real saving on that plant room is the pipework route, which we talked about on Tuesday, and I will price that properly for you by Friday.

Steph`,
    why: 'SPEC §5.5 flags the sender organization\'s own costs and margin: "The pumps come in at 1,150 and go out at 1,790, so a swap is not going to move your number much." gives the buy price and sell price as unlabelled figures.',
  },
  {
    id: 27, kind: 'stop', category: 'economics', expect: 'stop', industry: 'web development', variant: 'UK', setting: 'scope creep pushback to a client',
    placement: 'body', hardness: ['casual'],
    deciding: 'tbh theres like 12% on that job before contingency so we cant do the extra pages for free sorry',
    from: ['Callum Reid', 'callum@pixelforge-studio.example'], to: [['Sunita', 'sunita@greenleaf-cafe.test']],
    subject: 'Re: couple more pages?',
    body: `hey sunita

tbh theres like 12% on that job before contingency so we cant do the extra pages for free sorry. happy to quote them separately tho, prob a day's work each. the rest of the build is on track for the 20th.

callum`,
    why: 'SPEC §5.5 flags the sender organization\'s margin: "tbh theres like 12% on that job before contingency so we cant do the extra pages for free sorry" states the margin on the job in casual text.',
  },
  {
    id: 28, kind: 'stop', category: 'economics', expect: 'stop', industry: 'civil engineering', variant: 'UK', setting: 'variation discussion with a client',
    placement: 'body', hardness: ['hedged', 'implicit'],
    deciding: 'Happy to hold the price, and honestly there is a bit of fat in the groundworks line so the extra drainage run will not hurt us.',
    from: ['Gareth Lloyd', 'gareth@brecon-civils.example'], to: [['Helen Orme', 'helen.orme@wyevale-estates.test']],
    subject: 'Re: Drainage change',
    body: `Hi Helen,

Happy to hold the price, and honestly there is a bit of fat in the groundworks line so the extra drainage run will not hurt us. We will need the revised drawing from your engineer before we set out, ideally by Wednesday. The road closure is still booked for the 18th.

Gareth`,
    why: 'SPEC §5.5 flags the sender organization\'s contingency or margin on an item: "Happy to hold the price, and honestly there is a bit of fat in the groundworks line so the extra drainage run will not hurt us." admits padding in that line while agreeing to hold the price.',
  },
  {
    id: 29, kind: 'stop', category: 'economics', expect: 'stop', industry: 'interior fit-out', variant: 'UK', setting: 'fortnightly progress report to a client',
    placement: 'body', hardness: ['buried', 'numbers'], buried: 'long',
    deciding: 'For what it is worth, the joinery package is running at about 9% over what we carried for it, which we will absorb.',
    from: ['Victoria Lane', 'victoria@ashdown-interiors.example'], to: [['Robert Kemp', 'robert.kemp@halcyon-hotels.test']],
    subject: 'Fortnightly report, weeks 11 and 12',
    body: `Dear Robert,

Please find below the progress report for weeks 11 and 12 of the refurbishment. As usual I have grouped it by area and then by commercial and programme matters, and I am happy to walk through any of it on Thursday's call.

Ground floor reception. The stone flooring is complete and protected. The reception desk carcass has been installed and the veneered front panels are due from the workshop next week. Decorations are complete to the back wall and the lighting contractor has first-fixed the feature pendant positions. The revolving door supplier attended on Tuesday and confirmed the structural opening is within tolerance.

Bar and lounge. The bar counter is in and the back-bar shelving is being fitted this week. The banquette seating frames are built and are being upholstered off site; delivery is scheduled for week 14. The ceiling raft has been installed and the acoustic panels are on order. The flooring in this area has been held back deliberately until the wet trades are finished, as agreed.

Guest floors one to three. All 36 bedrooms on these floors are now at second fix. Bathroom pods on floor three were installed ahead of programme and the tiling is complete on floors one and two. Wardrobes are being fitted floor by floor and the headboard wall panels are being installed behind them. Snagging on floor one begins next week and we will send you the schedule so your housekeeping lead can attend.

Guest floor four. The structural strengthening to the two suites is complete and signed off by your engineer. Partitions are up and first fix is under way. This floor remains about one week behind the original programme, for the reasons set out in the last report, and we still expect to recover that time in the finishing stages.

Back of house. The kitchen extract ductwork has been installed and tested. The staff changing rooms are complete and handed over to your facilities team. The goods lift refurbishment is scheduled for weeks 15 and 16, and we will need the lift out of use for both weeks.

Commercial. The valuation for this period will be with your quantity surveyor on Friday. There are two variations to report: the additional data points in the meeting rooms and the change from brass to bronze ironmongery in the suites, both of which have been priced and submitted. For what it is worth, the joinery package is running at about 9% over what we carried for it, which we will absorb. No other cost matters to raise.

Programme. Overall we remain on track for practical completion in week 22. The critical path now runs through the fourth-floor suites and the bar flooring, and we are monitoring both weekly.

Health and safety. No incidents in the period. The site induction has been updated for the lift works and your facilities team has been briefed.

Actions for you. Approval of the bronze ironmongery sample (sent last week); confirmation of the artwork hanging positions in the lounge; and a decision on the optional minibar upgrade by the end of week 13 so we can place the order.

Kind regards,
Victoria Lane
Project Manager, Ashdown Interiors`,
    why: 'SPEC §5.5 flags what the sender organization carried for an item and its costs: "For what it is worth, the joinery package is running at about 9% over what we carried for it, which we will absorb." is one sentence in a long routine report.',
  },
  {
    id: 30, kind: 'stop', category: 'economics', expect: 'stop', industry: 'drinks brand', variant: 'UK', setting: 'listing discussion with a distributor',
    placement: 'quoted', hardness: ['buried', 'numbers'], buried: 'quoted',
    deciding: 'Landed cost on the 500ml is 14.20 a case, fyi.',
    from: ['Rosie Hartley', 'rosie@tideline-drinks.example'], to: [['Ben Okafor', 'ben.okafor@crescent-distribution.test']],
    subject: 'Re: Re: Listing forms',
    body: `Hi Ben,

Listing forms are attached in the next email as they were too large for this one. Barcodes and case dimensions are in the second tab. Shout if anything is missing.

Rosie

> From: Ben Okafor
> Sent: Thursday
> Thanks Rosie. Can you get the listing forms over by Monday? Buyer meeting is Tuesday.
>
> > From: Rosie Hartley
> > Sent: Thursday
> > Hi Ben, yes we can do the 500ml and the 330ml for the trial. Landed cost on the 500ml is 14.20 a case, fyi. Trade price list as sent last week stands.
> >
> > > From: Ben Okafor
> > > Sent: Wednesday
> > > Hi Rosie, the buyer wants both sizes for the trial. Can you confirm availability?`,
    why: 'SPEC §5.5 flags the sender organization\'s own costs: "Landed cost on the 500ml is 14.20 a case, fyi." sits deep in the quoted history of an ordinary listing thread.',
  },
  {
    id: 31, kind: 'stop', category: 'economics', expect: 'stop', industry: 'construction', variant: 'IN', setting: 'variation discussion with a client PMC',
    placement: 'body', hardness: ['casual', 'numbers'],
    deciding: 'Please note our costing for the civil portion is coming to 38 lakhs only against the 52 lakhs quoted, hence we have some cushion for the variation.',
    from: ['Vikram Shetty', 'vikram@shetty-infra.example'], to: [['Prakash Rao', 'prakash.rao@meridian-pmc.test']],
    subject: 'Variation for boundary wall',
    body: `Dear Prakash Sir,

With reference to your mail regarding the boundary wall extension, we can accommodate the same within the current order value. Please note our costing for the civil portion is coming to 38 lakhs only against the 52 lakhs quoted, hence we have some cushion for the variation. Kindly share the revised drawing and we will start the work from next week itself.

Regards,
Vikram Shetty
Shetty Infra`,
    why: 'SPEC §5.5 flags the sender organization\'s cost build-up and margin: "Please note our costing for the civil portion is coming to 38 lakhs only against the 52 lakhs quoted, hence we have some cushion for the variation." puts the internal cost beside the quoted price.',
  },
  {
    id: 32, kind: 'stop', category: 'economics', expect: 'stop', industry: 'AV installation', variant: 'UK', setting: 'scope reduction discussion with a client',
    placement: 'body', hardness: ['implicit'],
    deciding: 'We make about three times on the labour what we make on the materials, so if anything is cut it should be the kit.',
    from: ['Dom Fletcher', 'dom@soundstage-av.example'], to: [['Rachel Innes', 'rachel.innes@whitfield-college.test']],
    subject: 'Re: Trimming the lecture theatre budget',
    body: `Hi Rachel,

Understood on the budget pressure. We make about three times on the labour what we make on the materials, so if anything is cut it should be the kit. The easiest change is the second projector, which is a nice-to-have, and the lectern could be the standard model. I will send revised options tomorrow.

Dom`,
    why: 'SPEC §5.5 flags the sender organization\'s margin or profit, including as a ratio: "We make about three times on the labour what we make on the materials, so if anything is cut it should be the kit." reveals where the margin sits.',
  },
  {
    id: 33, kind: 'stop', category: 'economics', expect: 'stop', industry: 'hospitality', variant: 'UK', setting: 'refurbishment discussion with a designer',
    placement: 'body', hardness: ['numbers', 'implicit'],
    deciding: 'We set aside 240 for the whole refresh and we have burned 190 with the bedrooms still to go.',
    from: ['Alistair Munro', 'alistair@glenmoray-inn.example'], to: [['Fiona Brand', 'fiona@brand-interiors.test']],
    subject: 'Bedroom scheme',
    body: `Hi Fiona,

Thanks for the mood boards, the second one is the favourite here. We set aside 240 for the whole refresh and we have burned 190 with the bedrooms still to go. So the bedroom scheme needs to be the simpler of the two, and I would rather do eight rooms properly than twelve badly. Can you rework the second board on that basis?

Alistair`,
    why: 'SPEC §5.5 flags the sender organization\'s internal budget: "We set aside 240 for the whole refresh and we have burned 190 with the bedrooms still to go." gives the budget and spend as bare figures.',
  },
  {
    id: 34, kind: 'stop', category: 'economics', expect: 'stop', industry: 'plumbing merchant', variant: 'UK', setting: 'order negotiation with a trade customer',
    placement: 'body', hardness: ['casual', 'numbers'],
    deciding: 'mate the markup on them fittings is about 40 so i can knock a bit off if it saves the order',
    from: ['Lee Sutton', 'lee@sutton-plumbing-supplies.example'], to: [['Dazza', 'daz@dp-heating.test']],
    subject: 'Re: fittings price',
    body: `daz

mate the markup on them fittings is about 40 so i can knock a bit off if it saves the order. send me the full list and ill price it tonight. the boiler is in stock, can go out tomorrow.

lee`,
    why: 'SPEC §5.5 flags the sender organization\'s markup: "mate the markup on them fittings is about 40 so i can knock a bit off if it saves the order" states the markup percentage to a customer in casual text.',
  },
  {
    id: 35, kind: 'stop', category: 'economics', expect: 'stop', industry: 'landscape architecture', variant: 'UK', setting: 'go-ahead acknowledgement to a client',
    placement: 'body', hardness: ['hedged', 'implicit'],
    deciding: 'Great to have the go-ahead, and for what it is worth we have about 18 points on this one so the extra site visit is no problem.',
    from: ['Eleanor Voss', 'eleanor@voss-landscapes.example'], to: [['Peter Dunmore', 'peter.dunmore@dunmore-estate.test']],
    subject: 'Re: Go-ahead on the terrace scheme',
    body: `Dear Peter,

Great to have the go-ahead, and for what it is worth we have about 18 points on this one so the extra site visit is no problem. I will book the surveyor for the week after next and send the planting plan for comment before the end of the month.

With best wishes,
Eleanor`,
    why: 'SPEC §5.5 flags the sender organization\'s margin: "Great to have the go-ahead, and for what it is worth we have about 18 points on this one so the extra site visit is no problem." gives the margin in points inside a friendly sentence.',
  },
  {
    id: 36, kind: 'stop', category: 'economics', expect: 'stop', industry: 'construction', variant: 'UK', setting: 'joint meeting notes to a client',
    placement: 'body', hardness: ['buried', 'numbers'], buried: 'list',
    deciding: '- Phase 2 pricing: our build-up has labour at 61k and plant at 22k before OH&P; formal quote to follow',
    from: ['Simon Teague', 'simon@teague-construction.example'], to: [['Anna Kowal', 'anna.kowal@ridgeway-housing.test']],
    subject: 'Notes from Tuesday',
    body: `Hi Anna,

Notes from Tuesday's meeting below. Please correct anything I have got wrong.

- Attendees: Anna, Marcus (Ridgeway); Simon, Dee (Teague)
- Phase 1 handover: confirmed for 14 November, snagging walk on the 12th
- Outstanding snags: 23 open, 19 of which are decorations; all closed by the 11th
- Landscaping: planting deferred to spring at Ridgeway's request; bulbs to go in now
- Phase 2 pricing: our build-up has labour at 61k and plant at 22k before OH&P; formal quote to follow
- Phase 2 programme: 16 weeks from possession, possession no earlier than January
- Utilities: electricity connection for block B still awaiting a date from the network operator
- Residents' letter: Ridgeway to draft, Teague to supply the works dates
- Health and safety: no incidents; site induction updated for the new hoarding line
- Next meeting: Tuesday fortnight, same time, on site

Thanks,
Simon`,
    why: 'SPEC §5.5 flags the sender organization\'s cost build-up: "- Phase 2 pricing: our build-up has labour at 61k and plant at 22k before OH&P; formal quote to follow" gives the internal cost figures as one bullet in routine meeting notes.',
  },

  // ---- §5.6 negotiation position, 037-040 (041-048 in batch 02) ----
  {
    id: 37, kind: 'stop', category: 'negotiation', expect: 'stop', industry: 'commercial property', variant: 'UK', setting: 'instruction to an outside selling agent',
    placement: 'body', hardness: ['implicit'],
    deciding: 'If they come back anywhere over 380 I will not argue.',
    from: ['Jonathan Blake', 'jonathan@blake-holdings.example'], to: [['Marianne Cole', 'marianne.cole@cole-commercial.test']],
    subject: 'Re: Offer on the Mill Street unit',
    body: `Marianne,

Thanks for the update. Go back to them and say we are disappointed and expect them to improve. If they come back anywhere over 380 I will not argue. Keep the timing tight, we want exchange before Christmas.

Jonathan`,
    why: 'SPEC §5.6 flags what the sender would accept: "If they come back anywhere over 380 I will not argue." gives the acceptable price without naming it as a floor.',
  },
  {
    id: 38, kind: 'stop', category: 'negotiation', expect: 'stop', industry: 'software', variant: 'US', setting: 'renewal discussion with a reseller',
    placement: 'body', hardness: ['numbers'],
    deciding: 'We have gone in at 72 but 65 is where we actually need to land.',
    from: ['Kara Whitman', 'kara@meadowbrook-systems.example'], to: [['Tony Alvarez', 'tony.alvarez@summitpoint-partners.test']],
    subject: 'Re: Renewal pricing for Hartwell',
    body: `Tony,

Appreciate you running point on the Hartwell renewal. We have gone in at 72 but 65 is where we actually need to land. Keep the three-year term in play; that matters more to us than the number. Call me after you talk to their procurement lead.

Kara`,
    why: 'SPEC §5.6 flags the sender\'s bid or negotiation strategy: "We have gone in at 72 but 65 is where we actually need to land." gives the opening and the target as bare figures.',
  },
  {
    id: 39, kind: 'stop', category: 'negotiation', expect: 'stop', industry: 'events', variant: 'UK', setting: 'venue hire haggling with a client',
    placement: 'body', hardness: ['casual', 'numbers'],
    deciding: 'we can prob go another 5 if they push, boss said, so dont sweat it',
    from: ['Kieran Moss', 'kieran@lanterns-events.example'], to: [['Jade', 'jade@jade-oakes-weddings.test']],
    subject: 'Re: the Hendersons',
    body: `jade

yeah the hendersons are being a pain about the hire fee. we can prob go another 5 if they push, boss said, so dont sweat it. ill send the revised contract once they confirm the date, and the catering menu is in the shared folder now.

k`,
    why: 'SPEC §5.6 flags room to move on price: "we can prob go another 5 if they push, boss said, so dont sweat it" tells an outside planner how far the sender can still drop.',
  },
  {
    id: 40, kind: 'stop', category: 'negotiation', expect: 'stop', industry: 'professional services', variant: 'UK', setting: 'contract redline reply to the counterparty',
    placement: 'body', hardness: ['hedged'],
    deciding: 'Thanks for the quick turnaround on the draft, and honestly we would sign at the current rate if it came to it, we just want the exclusivity clause gone.',
    from: ['Oliver Grant', 'oliver@grant-mackay.example'], to: [['Louise Tan', 'louise.tan@harbourline-media.test']],
    subject: 'Re: Draft services agreement v3',
    body: `Hi Louise,

Thanks for the quick turnaround on the draft, and honestly we would sign at the current rate if it came to it, we just want the exclusivity clause gone. Our comments on clauses 7 and 12 are in the attached mark-up, which I will send separately. Could we aim to close this out by the end of next week?

Best,
Oliver`,
    why: 'SPEC §5.6 flags what the sender would accept: "Thanks for the quick turnaround on the draft, and honestly we would sign at the current rate if it came to it, we just want the exclusivity clause gone." tells the counterparty the rate is not really in dispute.',
  },
];
