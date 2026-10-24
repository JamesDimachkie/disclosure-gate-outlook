// everyday2 batch 09. Hand-written literals; see ../serialize.mjs for the schema wrapper.
export default [
  {
    category: 'none', expect: 'pass',
    why: `Ice rink to a parent about lessons; nothing under SPEC §5.`,
    industry: 'ice rink', variant: 'UK',
    from: { name: 'Skate School', address: 'skateschool@silverbladeicerink.example' },
    to: [{ name: 'Mrs H Nolan', address: 'h.nolan@talkmail.test' }],
    subject: `Learn to Skate - next block starts 8 Nov`,
    body: `Dear Mrs Nolan,

The next 6-week Learn to Skate block starts Saturday 8 November. Evie has been moved up to Level 3, which is at 9.45am. The block is £54 including skate hire; book through the website under Skate School before the 5th to keep her place.

Gloves are compulsory on the ice and a helmet is strongly recommended for Level 3 and below.

Silver Blade Skate School`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Go-karting track confirming a corporate event; customer-facing price (SPEC §5.5 does not flag).`,
    industry: 'go-karting track', variant: 'UK',
    from: { name: 'Events', address: 'events@apexkartingcentre.example' },
    to: [{ name: 'Danielle Foster', address: 'danielle.foster@mercerpackaging.test' }],
    subject: `Team event - Fri 21 Nov, 6pm - 18 drivers`,
    body: `Hi Danielle,

Confirming your Grand Prix format for 18 drivers on Friday 21 November at 6pm. Briefing at 5.45, practice, qualifying and a 20-lap final, with trophies for the top three. Allow about two and a half hours.

£49 per driver, £882 total, invoiced to the company. Please bring the signed indemnity forms (link in your portal) or allow 15 minutes to do them on arrival. Closed shoes and no loose clothing.

The bar and the mezzanine are reserved for you afterwards.

Thanks,
Apex`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Archery club to a beginner about a course; nothing under SPEC §5.`,
    industry: 'archery club', variant: 'UK',
    from: { name: 'Coaching Team', address: 'coaching@longbowmenofryedale.example' },
    to: [{ name: 'Tom Hayes', address: 'tom.hayes@quickmail.test' }],
    subject: `Beginners' course - your place is confirmed`,
    body: `Hi Tom,

You're booked on the beginners' course: six Sunday mornings from 9 November, 10am to midday at the sports field off Mill Lane. All equipment is provided. Wear close-fitting clothing on your top half and flat shoes, and tie long hair back.

The course is £60, payable at the first session by card or cash. If you join the club afterwards, the course fee comes off your first year's membership.

See you on the 9th.

Coaching Team`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Outdoor shop to a customer about a repair; nothing under SPEC §5.`,
    industry: 'outdoor equipment shop', variant: 'UK',
    from: { name: 'Summit Outdoor', address: 'shop@summitoutdoorkeswick.example' },
    to: [{ name: 'Rachel Bright', address: 'rachel.bright@gmailbox.test' }],
    subject: `Your jacket - back from repair`,
    body: `Hi Rachel,

Your jacket is back from the manufacturer's repair centre, new zip fitted and re-proofed, no charge under the warranty. It's behind the counter whenever you want to collect it.

We've also got the winter boot fitting event on Saturday 15th if you're still looking.

Cheers,
Summit Outdoor`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Fishing tackle shop one-liner; nothing under SPEC §5.`,
    industry: 'fishing tackle shop', variant: 'UK',
    from: { name: 'Riverbank Tackle', address: 'shop@riverbanktackle.example' },
    to: [{ name: 'Barry', address: 'barry.noakes@talkmail.test' }],
    subject: `Rod's in`,
    body: `Barry, your rod's in from the repairer, new tip section, £38. Open 7 till 5 all week. Steve`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Hospice fundraising office to a supporter about an event; nothing under SPEC §5.`,
    industry: 'hospice fundraising', variant: 'UK',
    from: { name: 'Fundraising Team', address: 'fundraising@stclareshospice.example' },
    to: [{ name: 'Mr and Mrs Tyler', address: 'thetylers@btmail.test' }],
    subject: `Light up a Life - Sunday 7 December`,
    body: `Dear Mr and Mrs Tyler,

Thank you for your dedication this year. Our Light up a Life service is on Sunday 7 December at 4pm in the hospice garden, with carols from the community choir, readings and the switching on of the tree lights. Mince pies and mulled wine afterwards in the day centre.

All are welcome; there's no need to book. Parking is limited, so please use the leisure centre car park across the road if you can.

The names of everyone remembered will be in the book of dedications in the chapel throughout December.

With warm wishes,
The Fundraising Team`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Chamber of commerce to a member about a networking breakfast; nothing under SPEC §5.`,
    industry: 'chamber of commerce', variant: 'UK',
    from: { name: 'Events', address: 'events@eastdevonchamber.example' },
    to: [{ name: 'Laura Finch', address: 'laura@finchaccountancy.test' }],
    subject: `Breakfast networking - Thurs 13 Nov - booking confirmed`,
    body: `Dear Laura,

Your place at the breakfast networking on Thursday 13 November is confirmed. 7.30 for 7.45 at the Rougemont, finishing by 9.15. The speaker is from the council's economic development team on the new business grants.

Members' rate of £18 includes a full breakfast. Please bring business cards; there's a 60-second round as usual.

Kind regards,
Events Team`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Exam centre to a private candidate about an exam day; nothing under SPEC §5.`,
    industry: 'exam centre', variant: 'UK',
    from: { name: 'Exams Office', address: 'exams@westgatetuitioncentre.example' },
    to: [{ name: 'Ms K Adebayo', address: 'k.adebayo@skymail.test' }],
    subject: `GCSE Maths Paper 1 - Thurs 6 Nov - arrival and rules`,
    body: `Dear Ms Adebayo,

Confirming David's entry for GCSE Maths Paper 1 (non-calculator) on Thursday 6 November, 9am start. Please arrive by 8.30 for registration.

Bring: photo ID, black pens, pencil, ruler, and a clear pencil case. No calculator for this paper. Phones and smart watches must be switched off and handed in at the desk.

Paper 2 and Paper 3 are on the 10th and 12th at the same time; the calculator is allowed for those. Results are issued in January.

Regards,
Exams Office`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Campervan hire confirming a booking; nothing under SPEC §5.`,
    industry: 'campervan hire', variant: 'NZ',
    from: { name: 'Wanderer Campervans', address: 'bookings@wanderercampervans.example' },
    to: [{ name: 'Lukas and Mia', address: 'lukasandmia@worldmail.test' }],
    subject: `Pickup Christchurch 2 Dec - what to expect`,
    body: `Hi Lukas and Mia,

Your 2-berth campervan is booked for pickup in Christchurch on Tuesday 2 December at 10am, returning Queenstown on 16 December by 3pm. The one-way fee and the bedding pack are included in the total you've paid.

Pickup takes about 45 minutes: a walk-through of the van, the gas and the water, and the paperwork. Bring both your driver licences and the card you booked with.

Bookings for the ferry and freedom camping rules are in the welcome pack. Speed limit for the van is 90 on the open road.

Safe travels,
Wanderer`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Piano shop to a customer about delivery; nothing under SPEC §5.`,
    industry: 'piano shop', variant: 'UK',
    from: { name: 'Hartwell Pianos', address: 'sales@hartwellpianos.example' },
    to: [{ name: 'Dr M Lawson', address: 'mlawson@homemail.example' }],
    subject: `Your Yamaha - delivery Tuesday`,
    body: `Dear Dr Lawson,

Your upright is booked for delivery on Tuesday 4 November between 9 and 11am. Our two-man team will need a clear route from the van to the room; please measure the narrowest doorway if you haven't already (the piano is 151cm wide on its side).

A first tuning is included and we'll book it for about six weeks after delivery once the piano has settled.

Kind regards,
Hartwell Pianos`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Church bell ringers to a wedding couple; nothing under SPEC §5.`,
    industry: 'bell ringers', variant: 'UK',
    from: { name: 'Tower Captain', address: 'ringers@stpetersbells.example' },
    to: [{ name: 'Emma and Rob', address: 'emmaandrob@outlookmail.test' }],
    subject: `Bells for your wedding - 23 May`,
    body: `Dear Emma and Rob,

We'd be delighted to ring for your wedding on Saturday 23 May. The band will ring for 20 minutes before the service and again as you come out. Our fee is £150 for the band, which goes to the tower fund.

If there's a particular method you'd like to hear (most people say "whatever sounds nice"), let us know. We'll liaise with the vicar on timings.

With best wishes,
Graham`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Hydroponic grower to a restaurant about trial supply; nothing under SPEC §5.`,
    industry: 'hydroponic salad grower', variant: 'SG',
    from: { name: 'Leafy Loop Farms', address: 'sales@leafyloopfarms.example' },
    to: [{ name: 'Chef Marcus', address: 'kitchen@tableatdukedge.test' }],
    subject: `Trial box this Friday`,
    body: `Hi Chef,

As discussed, we'll send a complimentary trial box this Friday morning: butterhead, red oak, baby kale, Thai basil and micro coriander, all harvested the same morning. Our farm is in Lim Chu Kang so delivery is within 3 hours of cutting.

If it works for you, we can do standing orders twice a week with pricing on the attached list in your portal. Happy to arrange a farm visit also.

Thanks,
Wei Jie`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Pumpkin patch to a school about a visit; nothing under SPEC §5.`,
    industry: 'pumpkin farm', variant: 'US',
    from: { name: 'Hollow Creek Farm', address: 'visits@hollowcreekfarm.example' },
    to: [{ name: 'Mrs. Patel', address: 'spatel@maplegroveelementary.test' }],
    subject: `2nd grade field trip - Oct 28 - confirmed`,
    body: `Hi Mrs. Patel,

You're confirmed for Tuesday October 28, arriving 9:30, for 62 students and 10 adults. Hayride, the corn maze, a short talk at the pumpkin barn, and every student picks a small pumpkin to take home. $9 per student, chaperones free.

Lunch tables in the picnic pavilion are yours from 11:30. Restrooms are by the barn. Please have students in closed-toe shoes; it's a working farm and it's muddy after rain.

Rain plan: we'll call you by 7 AM if we need to reschedule.

See you then!
Hollow Creek Farm`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Alpaca farm to a customer about a walking experience; nothing under SPEC §5.`,
    industry: 'alpaca farm', variant: 'UK',
    from: { name: 'Fell View Alpacas', address: 'hello@fellviewalpacas.example' },
    to: [{ name: 'Sophie Grant', address: 'sophie.grant@gmailbox.test' }],
    subject: `Your alpaca walk - Sun 9 Nov, 11am`,
    body: `Hi Sophie,

You're booked for the alpaca walk for four on Sunday 9 November at 11am. Meet at the farm gate (brown sign off the B road). The walk is about an hour round the fields with a cuppa in the barn after.

Wellies or boots please, and children need to be 8 or over to lead an alpaca. £25 per person, pay on the day. Our girls are gentle but do spit if annoyed, so no sudden hugs!

See you Sunday,
Kate`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Falconry centre confirming a voucher booking; nothing under SPEC §5.`,
    industry: 'falconry centre', variant: 'UK',
    from: { name: 'Raptor Experience', address: 'bookings@raptorexperiencewales.example' },
    to: [{ name: 'Mr J Price', address: 'j.price@virginmail.test' }],
    subject: `Hawk walk - Sat 15 Nov, 1pm`,
    body: `Dear Mr Price,

Your gift voucher is redeemed for a hawk walk on Saturday 15 November at 1pm. Please arrive 10 minutes early at the centre; the walk lasts about 90 minutes through the woods with a Harris hawk flying to the glove.

Wear sturdy shoes and bring a waterproof. Spectators are welcome at £5 each. If the weather is too windy for the birds we will ring you the day before to rearrange.

Regards,
Raptor Experience`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Axe throwing venue confirming a group booking; nothing under SPEC §5.`,
    industry: 'axe throwing venue', variant: 'CA',
    from: { name: 'Timber Lane', address: 'book@timberlaneaxe.example' },
    to: [{ name: 'Priya Raman', address: 'priya.raman@mailhub.test' }],
    subject: `Booking - Sat Nov 15, 7 PM - 10 people`,
    body: `Hi Priya,

You're booked for 10 on Saturday November 15 at 7 PM, two lanes, 90 minutes with a coach. $42 per person plus tax; a $100 deposit holds the lanes and comes off the total.

Closed-toe shoes are mandatory and we ID everyone for the bar. Arrive 10 minutes early for the safety talk. Latecomers can join once the coach has briefed them.

See you there,
Timber Lane`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Crazy golf course to a party booker; nothing under SPEC §5.`,
    industry: 'crazy golf', variant: 'AU',
    from: { name: 'Putt Paradise', address: 'parties@puttparadise.example' },
    to: [{ name: 'Leanne', address: 'leanne.b@optusmail.test' }],
    subject: `Jack's party - Sun 16 Nov, 2pm`,
    body: `Hi Leanne,

Jack's party is locked in for Sunday 16 November at 2pm: 12 kids, 18 holes on the jungle course, then the party room for an hour with the hot chips and lolly bags. $22 per child, you bring the cake.

Parents are welcome to play too at the normal rate. We're undercover so no worries if it rains.

Cheers,
Putt Paradise`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Skate shop one-liner; nothing under SPEC §5.`,
    industry: 'skate shop', variant: 'US',
    from: { name: 'Grind Skate Shop', address: 'shop@grindskateshop.example' },
    to: [{ name: 'Leo', address: 'leo.sanchez@postbox.test' }],
    subject: `Deck's here`,
    body: `Leo, the deck you ordered came in. Want us to set it up with your old trucks? Open till 8. - Marco`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Lido to members about the winter season; nothing under SPEC §5.`,
    industry: 'lido', variant: 'UK',
    from: { name: 'Thames Lido', address: 'members@riversidelido.example' },
    to: [{ name: 'Members', address: 'lido-members@groups-mail.test', kind: 'group' }],
    subject: `Winter swimming from 1 November`,
    body: `Dear Members,

Winter hours start on Saturday 1 November: the pool is open 7am to 10am and 4pm to 7pm daily, heated to 18 degrees. The sauna is open at all swimming times. Lane etiquette as usual: slow, medium and fast, and please keep to the right.

The cafe moves to weekends only until March. Membership fees are unchanged for the winter.

Happy swimming,
Thames Lido`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Patisserie to a hotel about a standing order; nothing under SPEC §5.`,
    industry: 'patisserie', variant: 'IE',
    from: { name: 'Maison Dubois Patisserie', address: 'orders@maisonduboiscork.example' },
    to: [{ name: 'Food and Beverage', address: 'fandb@theriverhousehotel.test' }],
    subject: `Weekend pastries - December order`,
    body: `Dear Siobhan,

For December weekends we'll deliver as follows: 60 croissants, 40 pains au chocolat, 24 almond croissants and 2 trays of mini tarts each Saturday and Sunday by 6.30am. Christmas week, add the bûche de Noël (6 x 10-portion) on 24 and 25 December.

Prices as on the trade list, invoiced weekly. Let me know by 1 December if numbers change.

Merci,
Claire`,
  },
  // ---- stops ----
  {
    category: 'remark', expect: 'stop',
    why: `SPEC §5.7: "The surveyor they used is a clueless amateur." is a disparaging remark about a person.`,
    industry: 'estate agent', variant: 'UK', placement: 'body',
    deciding: `The surveyor they used is a clueless amateur.`,
    from: { name: 'Ben Hollis', address: 'ben@hollisgrey.example' },
    to: [{ name: 'Mr and Mrs Kerr', address: 'thekerrs@btmail.test' }],
    subject: `Re: buyer's survey on your house`,
    body: `Hi both,

The buyers' survey has come back flagging damp in the utility room. I've asked for the report. The surveyor they used is a clueless amateur. It's a condensation mark behind the tumble dryer and nothing more, but we'll need to answer it properly.

I'd suggest a damp specialist's letter, about £120, which usually puts it to bed.

Ben`,
  },
  {
    category: 'secrets', expect: 'stop',
    why: `SPEC §5.1: "The fire exit at the back doesn't latch so we just wedge it shut." reveals a security gap (a door that does not lock).`,
    industry: 'nightclub', variant: 'UK', placement: 'body',
    deciding: `The fire exit at the back doesn't latch so we just wedge it shut.`,
    from: { name: 'Jay Morton', address: 'jay@thevaultclub.example' },
    to: [{ name: 'Lee', address: 'lee@northsoundhire.test' }],
    subject: `Load-in Saturday`,
    body: `Lee,

Load in through the back alley from 4pm Saturday. The fire exit at the back doesn't latch so we just wedge it shut. Push it and you're in; put the wedge back after.

Rig needs to be up by 8, doors at 10.

Jay`,
  },
  {
    category: 'personal', expect: 'stop',
    why: `SPEC §5.4: "Owen's been charged with drink driving so he can't do the deliveries for now." discloses an identifiable person's legal trouble.`,
    industry: 'garden centre', variant: 'UK', placement: 'body',
    deciding: `Owen's been charged with drink driving so he can't do the deliveries for now.`,
    from: { name: 'Maggie Reid', address: 'maggie@reidsnurseries.example' },
    to: [{ name: 'Orders', address: 'orders@greenwaylandscapes.test' }],
    subject: `Re: Thursday delivery of the hedging`,
    body: `Hi Tom,

Thursday is fine but it'll be me in the van rather than Owen. Owen's been charged with drink driving so he can't do the deliveries for now. I'll be with you about 10 with the 200 beech whips and the stakes.

Maggie`,
  },
];
