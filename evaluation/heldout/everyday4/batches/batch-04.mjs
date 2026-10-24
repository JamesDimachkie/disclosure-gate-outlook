// Batch 4: ordinary emails and stops (access, personal x2, economics, negotiation, remark). Literal text only.
export default [
  {
    ind: 'mobile mechanic', en: 'AU',
    from: ['Tim Rooney', 'tim@rooney-mobilemechanic.example'],
    to: [['Karen Voss', 'karen.voss@ozmail.example']],
    subject: 'Re: Brakes squealing',
    body: `Hi Karen,

I can come to you on Wednesday afternoon, around 2. It sounds like the pads, but I'll check the discs while I'm there. If it's just pads and a clean, it's $190 for parts and labour. I'll message you from the road.

Tim

> The brakes on my Corolla have started squealing and the car is pulling a bit to the left. Can you come out to look?`
  },
  {
    ind: 'tyre fitter', en: 'UK',
    from: ['Dev Sharma', 'dev@fastfit-tyres.example'],
    to: [['Alan Hepworth', 'alan.hepworth@mailbox.example']],
    subject: 'Tyres for the Transit',
    body: `Hi Alan,

We have four of the 205/65 R16C in stock at £88 each fitted, including balancing and the valve. If you drop the van off at 8 tomorrow, it'll be ready for 11. No need to book, but ring if you're running late.

Dev`
  },
  {
    ind: 'auto body shop', en: 'US',
    from: ['Louis Fontaine', 'louis@fontaine-autobody.example'],
    to: [['Pamela Quinn', 'pamela.quinn@maplemail.example']],
    subject: 'Estimate for the rear bumper',
    body: `Hi Pamela,

Here's the estimate for the rear bumper: $1,240 for the repaint, replacement sensors and body filler, with three days in the shop. Your insurer's adjuster will need to approve it, so I'll send it on once you give me the claim number. We can lend you a car for the days it's here at no charge.

Louis`
  },
  {
    stop: 'access', place: 'body',
    ind: 'car dealership', en: 'US',
    from: ['Nate Wickersham', 'nate@wickersham-motors.example'],
    to: [['Greg Hollander', 'greg@hollander-transport.example']],
    subject: 'Re: Trade-in pickup this weekend',
    body: `Hi Greg,

Saturday is fine for you to drop the keys and collect the paperwork. Our showroom closes at 4, and I'll be out on a test drive for a lot of that day, so just leave the keys with the receptionist.

We still haven't fixed the latch on the back lot gate, so it swings open if nobody pushes it shut.

Nate`,
    sentence: 'We still haven\'t fixed the latch on the back lot gate, so it swings open if nobody pushes it shut.',
    why: 'SPEC §5.1 security gaps: "We still haven\'t fixed the latch on the back lot gate, so it swings open if nobody pushes it shut." says a lot gate does not latch.'
  },
  {
    ind: 'motorcycle dealer', en: 'UK',
    from: ['Rob Hindley', 'rob@hindley-bikes.example'],
    to: [['Steve Cartwright', 'steve.cartwright@webmail.example']],
    subject: 'Service booked for the Triumph',
    body: `Hi Steve, the Triumph is booked in for its 12,000 mile service on Tuesday 20th. Drop it off before 9. It's £289 for the full service with oil and filters, plus any parts. Rob`
  },
  {
    ind: 'coach hire', en: 'UK',
    from: ['Dawn Atherton', 'hire@atherton-coaches.example'],
    to: [['Mr Brian Colley', 'brian.colley@eastgate-wi.example']],
    subject: 'Coach for the WI outing',
    body: `Dear Mr Colley,

Thank you for your enquiry. A 49-seat coach for the outing to Harrogate on 14 June would be £690 for the day, including driver, fuel and parking, with a pick-up in the village at 8.30 and return by 6.30. A £100 deposit secures the booking. Our drivers have a break after four and a half hours, so build in a stop for lunch.

Yours sincerely,
Dawn Atherton`
  },
  {
    ind: 'ferry operator', en: 'NZ',
    from: ['Mere Tipene', 'bookings@gulfhopper-ferries.example'],
    to: [['Craig and Anna Foster', 'fosters@kiwimail.example']],
    subject: 'Sailing change on Saturday',
    body: `Kia ora Craig and Anna,

Due to the forecast, Saturday's 9.15 sailing will leave at 8.45 instead. Please arrive 30 minutes before departure. If you'd prefer the later 2pm sailing, you're welcome to move across at no charge. Let us know either way by Friday afternoon.

Ngā mihi,
Mere`
  },
  {
    stop: 'personal', place: 'subject',
    ind: 'restaurant', en: 'UK',
    from: ['Tasha Greaves', 'tasha@theolivetree-bistro.example'],
    to: [['Bryn Hopkins', 'bryn.hopkins@hopkins-catering.example']],
    subject: 'Danny Whelan\'s court appearance on the 14th so I need cover',
    body: `Hi Bryn,

Do you still have anyone free on the 14th for a Friday evening shift? Our usual chef has a day off that I can't move, and I'd like a replacement from 4 till close. Pay is £16 an hour. Thanks for any help.

Tasha`,
    sentence: 'Danny Whelan\'s court appearance on the 14th so I need cover',
    why: 'SPEC §5.4 personal details: "Danny Whelan\'s court appearance on the 14th so I need cover" names a person facing a court case, in the subject line.'
  },
  {
    ind: 'airport shuttle', en: 'AU',
    from: ['Dave Kostas', 'dave@skyline-shuttles.example'],
    to: [['Louise Fenner', 'louise.fenner@ozmail.example']],
    subject: 'Pick-up from the airport',
    body: `Hi Louise,

Your driver will meet you at arrivals holding a sign with your name. The booking says flight QF402 landing at 6:35am, so we'll be there by 6:20 and track the flight. Your fare of $62 is paid. If your flight is early or late, we adjust at no cost. My mobile is 0491 570 118 if you can't see us.

Dave`
  },
  {
    ind: 'pallet network depot', en: 'UK',
    from: ['Gareth Sully', 'depot@midlandspallets.example'],
    to: [['Maria Costa', 'maria.costa@costa-foods.example']],
    subject: 'Missed delivery to Telford',
    body: `Dear Maria,

Apologies for the missed delivery on Tuesday. The driver couldn't reach the unit because of the roadworks on Station Road, and brought the pallets back. We have rebooked for tomorrow morning with a smaller vehicle. Please make sure someone is on site between 8 and 11 to sign for them.

Kind regards,
Gareth Sully
Depot Manager`
  },
  {
    ind: 'cold storage', en: 'US',
    from: ['Patrice Underwood', 'patrice@arcticlane-coldstorage.example'],
    to: [['Derek Voss', 'derek.voss@vossseafoods.example']],
    cc: [['Receiving', 'receiving@vossseafoods.example']],
    subject: 'Dock appointment Thursday',
    body: `Derek,

Your inbound container is scheduled for dock 3 on Thursday at 7:00 AM. Please make sure the driver has the bill of lading and seal number ready. Product must be at or below 0 degrees F at the door or we have to hold it for inspection. Unloading takes about two hours.

Patrice`
  },
  {
    ind: 'fishmonger', en: 'UK',
    from: ['Alf Mortimer', 'alf@mortimers-fish.example'],
    to: [['Chef Antonia Ricci', 'antonia.ricci@marinaedge-restaurant.example']],
    subject: 'Tomorrow\'s landing',
    body: `Morning Antonia,

Tomorrow I'll have lemon sole, plaice, a bit of line-caught bass and some good hand-dived scallops. Crab and lobster as usual. Bass is £22 a kilo, scallops £28. Tell me what you want by 4 and I'll put it aside for the van at 7.

Alf`
  },
  {
    ind: 'farm shop', en: 'UK',
    from: ['Joan Hargreaves', 'joan@oakwood-farmshop.example'],
    to: [['Bill Seddon', 'bill.seddon@seddon-eggs.example']],
    subject: 'More eggs this week please',
    body: `Hi Bill,

Could we have 10 dozen more eggs this week instead of 6? We've got a Christmas hamper order and the weekend crowds have been bigger than usual. If you can drop Thursday as well as Monday, that would be even better. Same invoice terms as always.

Thanks,
Joan`
  },
  {
    ind: 'cheesemaker', en: 'UK',
    from: ['Nell Garside', 'nell@garside-dairy.example'],
    to: [['Fergus Brennan', 'fergus.brennan@hendersons-deli.example']],
    subject: 'Cheese order',
    body: `Hi Fergus,

Here's the order for next week: 12 x 1kg Garside Blue, 8 x 500g smoked cheddar, 6 x whole truckles of the Wensleydale with cranberries, and 20 packs of oatcakes. The blue is at its best now. Delivery is Thursday morning, and I'll invoice on the 30-day terms we agreed.

Nell`
  },
  {
    ind: 'cider maker', en: 'UK',
    from: ['Hugh Llewellyn', 'hugh@black-mountain-cider.example'],
    to: [['Rhian Pugh', 'rhian.pugh@webmail.example']],
    subject: 'Re: Cider for the wedding',
    body: `Hi Rhian,

We can supply 12 cases of the medium dry and 6 of the sparkling, in time for the wedding. It's £84 a case, and we'll deliver for £25 on the Friday before. Please confirm numbers by the end of the month, as pressing is already under way.

Hugh

> Hello, could you supply cider for our wedding on 24 October? We think we'll need about 150 bottles.`
  },
  {
    ind: 'craft distillery', en: 'US',
    from: ['Savannah Reed', 'tours@copperhill-distillery.example'],
    to: [['Wes Gardner', 'wes.gardner@inbox.test']],
    subject: 'Your private tour on Saturday',
    body: `Hi Wes,

We're all set for your private tour for ten on Saturday at 1 PM. Here's what to expect.

You'll meet your guide, Eli, at the visitor center. The tour takes about 90 minutes and covers the mash house, the stills and the barrel warehouse. It finishes with a tasting of four spirits in the barrel room. The tour is $45 per person and your deposit of $150 will be credited at the end.

A few things to know:
- Closed-toe shoes are required in the production area
- The warehouse is cool, so bring a light jacket
- We can't allow anyone under 21 in the tasting
- Please arrive 15 minutes early to sign in

Parking is free in the lot on Mill Street. If anyone in your party has mobility needs, tell me and we'll arrange a cart. And if you'd like to buy bottles after the tour, we can ship to most states; we'll handle the paperwork.

Looking forward to meeting you all.

Savannah Reed
Copper Hill Distillery`
  },
  {
    ind: 'coffee roaster', en: 'US',
    from: ['Marcus Bell', 'marcus@halfmoon-roasters.example'],
    to: [['Ivy Chen', 'ivy@sunnyside-cafe.example']],
    subject: 'Roast schedule and new single origin',
    body: `Hi Ivy,

We roast on Tuesday and Friday and ship the same day, so you'll have fresh beans two days after. This week we have a new Colombian single origin: chocolate and orange, great as filter. It's $16.50 a pound in 5-pound bags. I'll put a sample bag in with your next order.

Marcus`
  },
  {
    ind: 'chocolatier', en: 'UK',
    from: ['Bernadette Lyle', 'bernadette@lyle-chocolates.example'],
    to: [['Katherine Aldous', 'katherine.aldous@mailbox.example']],
    subject: 'Boxes for the office',
    body: `Dear Katherine,

The 40 boxes of assorted truffles are ready for the staff gifts. Each box has a hand-written card, as you asked. Because they contain no preservatives, they should be eaten within two weeks, and kept somewhere cool. Collection is any time from Thursday, or I can send them by courier for £18.

Bernadette`
  },
  {
    stop: 'economics', place: 'body',
    ind: 'furniture importer', en: 'US',
    from: ['Harold Voss', 'harold@bayside-furnishings.example'],
    to: [['Doreen Whitaker', 'doreen@whitakerlodge.example']],
    subject: 'Re: Dining chairs for the lodge',
    body: `Doreen,

Good to hear the lodge is filling up. The oak dining chairs are available in the quantity you need, and we can deliver them to the lodge by the 3rd.

We buy those chairs in at $22 each and sell them on at $55, which is why we can afford to include the delivery.

Harold`,
    sentence: 'We buy those chairs in at $22 each and sell them on at $55, which is why we can afford to include the delivery.',
    why: 'SPEC §5.5 internal economics: "We buy those chairs in at $22 each and sell them on at $55, which is why we can afford to include the delivery." gives the sender\'s own cost per item and markup to the customer.'
  },
  {
    ind: 'catering equipment supplier', en: 'UK',
    from: ['Mark Dunphy', 'mark@dunphy-catering-supplies.example'],
    to: [['Stefan Novak', 'stefan.novak@novak-bistro.example']],
    cc: [['Kitchen', 'kitchen@novak-bistro.example']],
    subject: 'Combi oven delivery',
    body: `Hi Stefan,

The combi oven will be delivered on Friday between 10 and 2. It's a two-man lift on a pallet truck, so please make sure the route to the kitchen is clear and any steps are marked. The engineer will connect it on Monday and give a quick demo. Install is included.

Mark`
  },
  {
    ind: 'hotel laundry', en: 'UK',
    from: ['Yvonne Fisk', 'yvonne@clearwave-laundry.example'],
    to: [['Reception', 'reception@lakeview-hotel.example']],
    subject: 'Linen collection changed to Tuesdays',
    body: `Hello,

From next week your linen collection moves from Monday to Tuesday, around 7.30am, because we've had to change the van route. Please have the bags ready and the sheets and towels sorted into the separate carts. The delivery of clean linen follows on Thursday as before.

Yvonne Fisk`
  },
  {
    ind: 'school uniform supplier', en: 'UK',
    from: ['Hilary Dent', 'hilary@dent-schoolwear.example'],
    to: [['Mrs Sandra Petrie', 'sandra.petrie@homepost.test']],
    subject: 'Order ready for collection',
    body: `Dear Mrs Petrie,

Your uniform order is ready: 2 blazers, 4 white shirts, 3 pairs of grey trousers, 2 jumpers and a PE kit. The total is £164.50. We're open Monday to Saturday from 9 to 5, with extended hours during the last two weeks of August. If anything doesn't fit, you can exchange it within 14 days.

Hilary Dent`
  },
  {
    ind: 'private tutor', en: 'UK',
    from: ['Peter Lowe', 'peter@lowe-tuition.example'],
    to: [['Mr and Mrs Haldane', 'haldane.family@webmail.example']],
    subject: 'Maths lesson time',
    body: `Dear Mr and Mrs Haldane,

Could we move Oliver's lesson from 5 to 5.30 on Wednesday? I've a meeting at school that overruns. If that doesn't work, any time on Thursday suits me. We covered quadratic equations this week and he should do the five practice questions I set before then.

Peter`
  },
  {
    ind: 'piano teacher', en: 'US',
    from: ['Helen Armitage', 'helen@armitage-piano.example'],
    to: [['Greg Kowalski', 'greg.kowalski@maplemail.example']],
    subject: 'Recital on June 6',
    body: `Hi Greg,

The spring recital is June 6th at 2 PM in the church hall. Each student plays two pieces, and Mia has chosen her Bach minuet and a piece by Clementi. Please make sure she arrives by 1:30 to warm up. There'll be refreshments afterwards.

Helen`
  },
  {
    ind: 'piano tuner', en: 'UK',
    from: ['Colin Pugh', 'colin@pugh-pianos.example'],
    to: [['Olive Kirkham', 'olive.kirkham@inbox.test']],
    subject: 'Tuning Tuesday',
    body: `Hello Olive, I'll tune the piano on Tuesday at 2. It's due, as it's been two years. Colin`
  },
  {
    stop: 'negotiation', place: 'body',
    ind: 'small business broker', en: 'AU',
    from: ['Steve Hartigan', 'steve@hartigan-business-sales.example'],
    to: [['Meg Calloway', 'meg.calloway@calloway-legal.example']],
    subject: 'The cafe sale, where we are',
    body: `Hi Meg,

Thanks for the draft heads of agreement; I've read it twice and have a few comments that I'll send separately.

Asking 72, but I'd take 60. Do keep that between us.

Steve`,
    sentence: 'Asking 72, but I\'d take 60.',
    why: 'SPEC §5.6 negotiation position: "Asking 72, but I\'d take 60." reveals the price the seller would accept and the opening ask.'
  },
  {
    ind: 'martial arts club', en: 'US',
    from: ['Sensei Dan Kimura', 'dan@northshore-dojo.example'],
    to: [['Cheryl Banks', 'cheryl.banks@maplemail.example']],
    subject: 'Belt test on Saturday',
    body: `Hi Cheryl,

The belt test for the junior class is Saturday at 10 AM. Students should arrive in a clean uniform and be ready by 9:45. Parents can watch from the benches. The testing fee is $35, payable at the desk. Results will be given out at the end of the session.

Sensei Dan`
  },
  {
    ind: 'climbing wall', en: 'UK',
    from: ['Hannah Kirby', 'hannah@boulderworks-leeds.example'],
    to: [['Jon Mackay', 'jon.mackay@webmail.example']],
    subject: 'Birthday party booking',
    body: `Hi Jon,

Your birthday party for 12 is booked on Sunday at 2pm: an hour of instructed climbing, then 45 minutes in the party room. Food is the parents' responsibility, though we provide plates and juice. Each child needs a signed consent form on arrival. The price is £14 each, with a £50 deposit.

Hannah`
  },
  {
    ind: 'golf club', en: 'US',
    from: ['Brent Lawson', 'brent@pinehurst-valley-gc.example'],
    to: [['Ron Edelman', 'ron.edelman@inbox.test']],
    subject: 'Tournament sign-up',
    body: `Ron, the member-guest is September 12. Entry is $240 per team, which covers cart, lunch and the dinner. Tee times at 8:30 and 1:00. Let me know which flight you want. Brent`
  },
  {
    ind: 'bowls club', en: 'UK',
    from: ['Ken Haworth', 'secretary@hightown-bowls.example'],
    to: [['Maureen Spence', 'maureen.spence@mailbox.example']],
    subject: 'Fixture list for next season',
    body: `Dear Maureen,

Here is the draft fixture list for next season. We have eight home games on Thursday evenings and six away on Tuesdays. The first match is on 4 May at home against Ridgeway. Please check the dates against your holidays and tell me which weeks you can't play. Subs this year will be £45, unchanged.

Ken Haworth
Secretary`
  },
  {
    stop: 'remark', place: 'body',
    ind: 'cycling club', en: 'UK',
    from: ['Andy Mercer', 'andy@calderdale-cc.example'],
    to: [['Phil Rothwell', 'phil.rothwell@rothwell-events.example']],
    subject: 'Race HQ and marshals',
    body: `Hi Phil,

Thanks for the route map. We'll need 18 marshals for the road race, and I'll send the list of names by the end of the week. Race HQ at the village hall works for us, as long as we can use the kitchen for the riders' tea.

Rowan Pike is a bully and a bit of a fraud. I'd keep him away from the start line.

Andy`,
    sentence: 'Rowan Pike is a bully and a bit of a fraud.',
    why: 'SPEC §5.7 remarks: "Rowan Pike is a bully and a bit of a fraud." is a disparaging remark about a named person.'
  },
  {
    ind: 'tennis club', en: 'AU',
    from: ['Trish O\'Neill', 'trish@marrickville-tennis.example'],
    to: [['Greg Lam', 'greg.lam@ozmail.example']],
    subject: 'Court bookings and social night',
    body: `Hi Greg,

Court 2 is free for you every Tuesday at 6pm for the rest of the term. Social night is the first Friday of the month with a barbecue at 6.30, and visitors are welcome for a $10 donation. Members can book courts through the club app up to a week ahead.

Trish`
  }
];
