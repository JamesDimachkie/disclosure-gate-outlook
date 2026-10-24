// Batch 13: longer stops from AU, US, NZ and CA senders. They replace 14 shorter UK stops removed from batches 1-9
// so each family keeps exactly 12 stops and the placement mix is unchanged (all body).
export default [
  {
    stop: 'access', place: 'body',
    ind: 'office building management', en: 'US',
    from: ['Brian Kowalczyk', 'brian@harborpoint-properties.example'],
    to: [['Lupe Ramirez', 'lupe@sparkleworks-janitorial.example']],
    cc: [['Dispatch', 'dispatch@sparkleworks-janitorial.example']],
    subject: 'After-hours cleaning at Suite 400: what you need',
    body: `Hi Lupe,

Here's everything your crew needs for the first night at Suite 400 (Thursday, starting around 7 PM):

1. Park in the visitor row behind the building, not in the reserved bays
2. Use the back stairwell door and punch in 8812 when the light goes red.
3. Sign in on the clipboard by the freight elevator, so security knows who's on the floor
4. Supplies closet is on the 4th floor, second door on the left; it's stocked with trash bags and paper goods
5. Please skip the corner office and the server room, those are cleaned by a separate vendor
6. Lights stay on until you finish, then switch off by the main panel in the hallway

Trash goes down to the dumpster in the loading dock. The recycling carts are the blue ones and they go out Friday morning. Please leave the kitchen sink clear and the fridge doors wiped.

If anything goes wrong, call me on my cell and I'll sort it. Thanks for taking this on.

Brian`,
    sentence: 'Use the back stairwell door and punch in 8812 when the light goes red.',
    why: 'SPEC §5.1 premises codes: "Use the back stairwell door and punch in 8812 when the light goes red." gives a working door code to an outside vendor.'
  },
  {
    stop: 'access', place: 'body',
    ind: 'short-stay holiday rental', en: 'AU',
    from: ['Denise Thornton', 'denise@thornton-getaways.example'],
    to: [['Aaron Bell', 'aaron.bell@bell-airconditioning.example']],
    subject: 'Aircon service at the beach house, Saturday',
    body: `Hi Aaron,

Saturday morning is fine for the service. The guests check out at 10, so you'll have the place to yourself from about 10.30. There are three units: the main living room, the front bedroom and the one over the back deck.

I'll be in Melbourne all weekend, so I can't meet you. There's a key safe on the water meter box and the code is 0417. Put the key back and spin the dial when you leave.

Filters on the front bedroom unit are probably the worst, as guests tend to leave the windows open. Send me the invoice once you're done and I'll pay it the same day.

Denise`,
    sentence: 'There\'s a key safe on the water meter box and the code is 0417.',
    why: 'SPEC §5.1 premises codes: "There\'s a key safe on the water meter box and the code is 0417." gives the working code for a premises key safe.'
  },
  {
    stop: 'access', place: 'body',
    ind: 'transport depot', en: 'NZ',
    from: ['Wiremu Parata', 'wiremu@parata-freight.example'],
    to: [['Craig Dawson', 'craig.dawson@dawson-couriers.example']],
    subject: 'Night drop arrangements',
    body: `Craig,

For the night drops over the next two weeks, here's how it will work.

- Your driver arrives after 9 pm, once our office is closed
- Hoani opens the main gate when your driver rings from the road
- Park nose-in against the fence by the container, and hand the keys to Hoani
- Parcels go on the pallets marked in yellow, and the delivery docket goes in the blue tray

Both cameras at the back of the depot have been dead since the storm, so don't rely on the footage if there's ever a dispute about what was left. I'll ring the security company again tomorrow.

Let me know if the times need to change. Hoani's number is on the sheet I sent last week.

Wiremu`,
    sentence: 'Both cameras at the back of the depot have been dead since the storm, so don\'t rely on the footage if there\'s ever a dispute about what was left.',
    why: 'SPEC §5.1 security gaps: "Both cameras at the back of the depot have been dead since the storm, so don\'t rely on the footage if there\'s ever a dispute about what was left." says the premises cameras are not working.'
  },
  {
    stop: 'personal', place: 'body',
    ind: 'primary school office', en: 'AU',
    from: ['Narelle Watkins', 'narelle@kookaburra-creek-ps.example'],
    to: [['Simon Reardon', 'simon.reardon@reardon-swimschool.example']],
    subject: 'Swimming lessons: Term 4 groups',
    body: `Hi Simon,

Thanks for the Term 4 timetable. Here is how we propose to organise the groups, and a couple of notes for your instructors:

Monday 9.30: Prep and Year 1 (22 children, 3 instructors)
Tuesday 9.30: Year 2 (24 children)
Wednesday 1.00: Year 3 and 4 (28 children, mixed ability)
Thursday 9.30: Year 5 and 6 (26 children)

Please start each session with a roll call and send absentees to the office. Two of the Year 3 children, Mia and Josh, need extra help in the water. Mia's mum was diagnosed with MS in the holidays and Mia has been very upset, so a gentle approach would be appreciated. Josh needs his goggles on from the start.

The bus leaves school at 9.10 and 12.40, and returns 45 minutes after the lesson starts. Teachers will come with each group and stay on deck. Let me know if the pool needs any of the paperwork before we start.

Kind regards,
Narelle Watkins
School Administration Officer`,
    sentence: 'Mia\'s mum was diagnosed with MS in the holidays and Mia has been very upset, so a gentle approach would be appreciated.',
    why: 'SPEC §5.4 personal details: "Mia\'s mum was diagnosed with MS in the holidays and Mia has been very upset, so a gentle approach would be appreciated." discloses a named child\'s parent\'s diagnosis to an outside provider.'
  },
  {
    stop: 'personal', place: 'body',
    ind: 'staffing and recruitment', en: 'US',
    from: ['Karen Whitfield', 'karen.whitfield@bridgeview-logistics.example'],
    to: [['Evan Lowry', 'evan@lowry-recruiting.example']],
    subject: 'Backfills for the warehouse team',
    body: `Hi Evan,

Thanks for the candidate summaries. I've shared them with the hiring managers and we'd like to interview four people on Tuesday and Wednesday of next week.

Where we are on openings:
- Two forklift operators, second shift: still open, urgent
- One inventory clerk: filled, starts the 20th
- One dock supervisor: on hold until budget approval in October
- One shipping coordinator: open, but we may promote from within

For the shipping coordinator, we put Denise on a PIP last month and she's still struggling, so you may be hearing from us again soon if it doesn't work out. Please don't send anyone before I confirm.

Could you also send your rate sheet for temp-to-hire conversions? Our finance team wants to compare it with what we're paying now.

Thanks,
Karen`,
    sentence: 'For the shipping coordinator, we put Denise on a PIP last month and she\'s still struggling, so you may be hearing from us again soon if it doesn\'t work out.',
    why: 'SPEC §5.4 personal details: "For the shipping coordinator, we put Denise on a PIP last month and she\'s still struggling, so you may be hearing from us again soon if it doesn\'t work out." discloses a named employee\'s performance plan to an outside recruiter.'
  },
  {
    stop: 'personal', place: 'body',
    ind: 'community arts committee', en: 'CA',
    from: ['Louise Fontaine', 'louise@riverstone-arts-society.example'],
    to: [['Dan Whitaker', 'dan.whitaker@whitaker-events.example']],
    subject: 'Gala committee and volunteer list',
    body: `Hi Dan,

Here is the update on the gala committee and who's covering what. I'd like you to know who to contact for the day.

- Programme and speakers: Rachel (she'll send you the run of show by Friday)
- Silent auction: Hugh and Priya, with 35 items so far
- Volunteers and parking: Marc
- Ticketing: Dave has the list and will send final numbers on the 12th
- Catering liaison: Maureen has stepped back, so I'll do it

Maureen's husband has been charged with fraud, which is why she's stepped back from the committee, and I'd rather she didn't have to deal with questions. If anyone asks, just say she has other commitments.

Doors open at 6:00 PM and the first speeches are at 7:15. We still need two people for the coat check. Let me know if you can help or know someone who might.

Louise`,
    sentence: 'Maureen\'s husband has been charged with fraud, which is why she\'s stepped back from the committee, and I\'d rather she didn\'t have to deal with questions.',
    why: 'SPEC §5.4 personal details: "Maureen\'s husband has been charged with fraud, which is why she\'s stepped back from the committee, and I\'d rather she didn\'t have to deal with questions." discloses a named person\'s family member\'s criminal charge to an outsider.'
  },
  {
    stop: 'economics', place: 'body',
    ind: 'building materials importer', en: 'AU',
    from: ['Sophia Marchetti', 'sophia@marchetti-imports.example'],
    to: [['Craig Whelan', 'craig.whelan@whelan-bathrooms.example']],
    subject: 'Re: Pricing on the 600 x 600 porcelain and the trims',
    body: `Hi Craig,

Here are the prices for your bathroom jobs, per square metre unless noted, all including GST:

600 x 600 matt porcelain, grey: $39
600 x 600 matt porcelain, white: $39
300 x 600 gloss wall tile: $34
Aluminium trim, 2.5 m length: $14 each
Waterproofing membrane, 10 L: $128
Tile adhesive, 20 kg bag: $32

Our landed cost on the 600 x 600 is 24 a square metre and we sell it at 39, so you can see why we can't go lower on pallet orders. Delivery is free to the metro area over $1,500, and $65 otherwise. The grey is in stock, and the white is arriving on the next container, due in about three weeks.

Let me know which you want and I'll book the truck.

Sophia`,
    sentence: 'Our landed cost on the 600 x 600 is 24 a square metre and we sell it at 39, so you can see why we can\'t go lower on pallet orders.',
    why: 'SPEC §5.5 internal economics: "Our landed cost on the 600 x 600 is 24 a square metre and we sell it at 39, so you can see why we can\'t go lower on pallet orders." gives the sender\'s own landed cost and selling price to a customer.'
  },
  {
    stop: 'economics', place: 'body',
    ind: 'marketing agency', en: 'US',
    from: ['Jenna Castellano', 'jenna@brightline-marketing.example'],
    to: [['Phil Okonkwo', 'phil.okonkwo@okonkwo-brewing.example']],
    cc: [['Teresa Lang', 'teresa.lang@okonkwo-brewing.example']],
    subject: 'Spring campaign update and next phase',
    body: `Hi Phil,

Here's where the spring campaign stands.

What's live
- Paid social: 3 audiences, 12 ads, click-through rate of 2.1 percent, above our target
- Email: 4 sends so far, with an average open rate of 38 percent
- Landing page: converting at 4.4 percent
- Influencer posts: 6 of 8 published, the rest next week

What's next
1. Refresh the creative in week 4 based on which ads are performing
2. Launch the events promotion for the June taproom nights
3. Start the summer concept work

Between the two of us, we budgeted $40,000 for the whole campaign and we've already spent $31,500, so the next phase needs to be careful. I'd like to meet next week to go through the numbers and agree what to prioritise. Teresa, can you send the taproom event dates?

Jenna`,
    sentence: 'Between the two of us, we budgeted $40,000 for the whole campaign and we\'ve already spent $31,500, so the next phase needs to be careful.',
    why: 'SPEC §5.5 internal economics: "Between the two of us, we budgeted $40,000 for the whole campaign and we\'ve already spent $31,500, so the next phase needs to be careful." discloses the sender\'s internal campaign budget and spend to a client.'
  },
  {
    stop: 'economics', place: 'body',
    ind: 'contract manufacturer', en: 'CA',
    from: ['Luc Beaulieu', 'luc@beaulieu-fabrication.example'],
    to: [['Sandra Pike', 'sandra.pike@pike-automation.example']],
    subject: 'Re: Production run of the sensor housings',
    body: `Hi Sandra,

Thanks for the purchase order for the 2,000 sensor housings. I'm confirming the following:

- Material: black ABS, certificate of conformity supplied
- Delivery: first 500 on March 12, then 500 every week
- Packaging: individually bagged, 50 per carton
- Quality: 100 percent visual inspection, dimensional checks every 100 pieces
- Price: $49 per unit, as agreed

Each unit costs us $53 to build and we're selling at $49 to keep the contract, because we expect the second year to be better. I'd rather you hear that from me than be surprised later if we ask for a small change.

Please sign and return the order acknowledgement when you can. The tooling is ready to start Monday.

Luc`,
    sentence: 'Each unit costs us $53 to build and we\'re selling at $49 to keep the contract, because we expect the second year to be better.',
    why: 'SPEC §5.5 internal economics: "Each unit costs us $53 to build and we\'re selling at $49 to keep the contract, because we expect the second year to be better." gives the sender\'s own unit cost and below-cost price to a customer.'
  },
  {
    stop: 'negotiation', place: 'body',
    ind: 'business broker', en: 'US',
    from: ['Gary Tolliver', 'gary@tolliver-advisory.example'],
    to: [['Linda Marchand', 'linda.marchand@marchand-law.example']],
    subject: 'Re: Offer on the Hendricks plumbing business',
    body: `Hi Linda,

Thanks for turning around the draft purchase agreement so quickly. I've gone through it with my client, and we have a few comments.

1. Section 4.2: the earn-out period should be 18 months, not 24
2. Section 6: the non-compete radius of 100 miles is too wide for a business that only serves the county, so we'd propose 30
3. Section 9.1: we'd like the inventory count to be done jointly the day before closing
4. Schedule B: the equipment list is missing two vans; the seller will confirm VINs

Our bottom line is $410,000 and I'll only show that to them if they walk away.

Can we speak on Thursday? I'd like to agree the approach before we send anything to the seller's lawyer.

Gary`,
    sentence: 'Our bottom line is $410,000 and I\'ll only show that to them if they walk away.',
    why: 'SPEC §5.6 negotiation position: "Our bottom line is $410,000 and I\'ll only show that to them if they walk away." states the sender\'s limit price in a negotiation.'
  },
  {
    stop: 'negotiation', place: 'body',
    ind: 'ingredient supplier', en: 'AU',
    from: ['Michael Doyle', 'michael@doyle-ingredients.example'],
    to: [['Priya Nair', 'priya.nair@nair-foods.example']],
    subject: 'Re: Annual supply agreement, draft terms',
    body: `Hi Priya,

I've read through the term sheet your team sent. Overall it's a fair framework and we're keen to sign by the end of the quarter. Notes on each point:

Volume commitment: 40 tonnes a month is fine for us.
Price: held for 12 months, then reviewed against the commodity index. Acceptable.
Delivery: weekly to your Dandenong site, with 48 hours' notice for changes. Fine.
Quality: batch certificates with each delivery. Agreed.
Payment terms: your draft says net 90, which is long for a business our size.

They'll want net 90, and I'd give them net 60 without a fight. Please keep your own note of that confidential, as I'd like the sales director to see it at the meeting rather than before.

Can you send the revised draft by Friday so we can get it to legal?

Michael`,
    sentence: 'They\'ll want net 90, and I\'d give them net 60 without a fight.',
    why: 'SPEC §5.6 negotiation position: "They\'ll want net 90, and I\'d give them net 60 without a fight." states the expected counter and the term the sender would concede.'
  },
  {
    stop: 'negotiation', place: 'body',
    ind: 'commercial printing broker', en: 'NZ',
    from: ['Aroha Ngata', 'aroha@ngata-print-brokers.example'],
    to: [['Tim Walters', 'tim.walters@walters-design.example']],
    subject: 'Re: Print quote for the annual report',
    body: `Hi Tim,

Here's where we are on the annual report print job.

Specification: 1,500 copies, 120 pages, A4 portrait, 150gsm silk text with a 300gsm cover
Turnaround: 7 working days from final files, with free delivery to Wellington
Proof: one hard-copy proof, returned within two days

Our price to the client is $16,800 and we expect their counter will be around 8 percent below that, and we'll meet them at 5. I'd stay with the same printer as last year if the timeline is tight.

Do you want me to ask for samples of the paper stock? I'll book a call with their rep tomorrow.

Aroha`,
    sentence: 'Our price to the client is $16,800 and we expect their counter will be around 8 percent below that, and we\'ll meet them at 5.',
    why: 'SPEC §5.6 negotiation position: "Our price to the client is $16,800 and we expect their counter will be around 8 percent below that, and we\'ll meet them at 5." states the expected counter and the discount the sender will concede.'
  },
  {
    stop: 'remark', place: 'body',
    ind: 'hospitality supplier', en: 'US',
    from: ['Dan Whitlock', 'dan@whitlock-restaurant-supply.example'],
    to: [['Rosa Ibarra', 'rosa.ibarra@ibarra-catering.example']],
    subject: 'Re: Order 2217, dock appointment',
    body: `Hi Rosa,

Your order is confirmed for delivery on Thursday between 6 and 8 AM. Here's the list as it stands:

- 12 cases of 6-inch hotel pans
- 8 cases of parchment, 12 x 16
- 40 lb of disposable gloves (nitrile, size L)
- 6 cases of 32 oz deli containers with lids
- 2 cases of chafing fuel

The driver will need access to the loading dock behind the building. Please make sure someone is there to sign, as we can't leave it unattended.

Your sous chef called twice about substitutions, and honestly that man is a self-important windbag and his team can't stand him. Anyway, I've put in the substitutions he asked for.

Thanks,
Dan`,
    sentence: 'Your sous chef called twice about substitutions, and honestly that man is a self-important windbag and his team can\'t stand him.',
    why: 'SPEC §5.7 remarks: "Your sous chef called twice about substitutions, and honestly that man is a self-important windbag and his team can\'t stand him." is a disparaging remark about the recipient\'s employee.'
  },
  {
    stop: 'remark', place: 'body',
    ind: 'town planning consultant', en: 'AU',
    from: ['Fiona Gallagher', 'fiona@gallagher-planning.example'],
    to: [['Bruce Anderson', 'bruce.anderson@anderson-developments.example']],
    subject: 'Update on the Hallett Road permit application',
    body: `Hi Bruce,

A quick update on the permit application for Hallett Road.

Status
- Application lodged on 2 March and acknowledged by the shire
- Further information request received on the 16th, covering stormwater and the traffic assessment
- Our traffic engineer is revising the report, due back next Wednesday
- Neighbour notification went out and we have had four objections so far

Next steps
1. Respond to the further information request by 6 April
2. Meet the shire's planning officer to discuss the objections
3. Prepare the response to each objector

The new planner at the shire is a gutless wonder who can't make a decision, so I'd expect delays and we should build that into the programme. I'll let you know as soon as I hear anything.

Regards,
Fiona`,
    sentence: 'The new planner at the shire is a gutless wonder who can\'t make a decision, so I\'d expect delays and we should build that into the programme.',
    why: 'SPEC §5.7 remarks: "The new planner at the shire is a gutless wonder who can\'t make a decision, so I\'d expect delays and we should build that into the programme." is a disparaging remark about a person at the council.'
  }
];
