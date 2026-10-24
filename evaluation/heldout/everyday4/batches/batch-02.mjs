// Batch 2: 34 ordinary emails and 6 stops (access, personal, economics x2, negotiation, remark). Literal text only.
export default [
  {
    ind: 'community pharmacy', en: 'UK',
    from: ['Anil Joshi', 'anil@highfield-pharmacy.example'],
    to: [['Margaret Doyle', 'margaret.doyle@mailbox.example']],
    subject: 'Your repeat prescription is ready',
    body: `Dear Mrs Doyle,

Your repeat prescription is ready to collect from the pharmacy. We're open 9 to 5.30 on weekdays and 9 to 1 on Saturdays. If someone else is collecting for you, please ask them to bring a note with your name and address.

Best wishes,
Anil Joshi
Highfield Pharmacy`
  },
  {
    ind: 'optician', en: 'AU',
    from: ['Sarah Quigley', 'sarah@clearview-optical.example'],
    to: [['Greg Hanley', 'greg.hanley@ozmail.example']],
    subject: 'Your new glasses',
    body: `Hi Greg,

Your new glasses are in and ready for a fitting. Pop in any time this week, no appointment needed, and we'll adjust the frames so they sit properly. It only takes about ten minutes.

Sarah
Clearview Optical`
  },
  {
    ind: 'GP practice administration', en: 'UK',
    from: ['Denise Hartley', 'admin@millbrook-surgery.example'],
    to: [['Harold Pickering', 'harold.pickering@homepost.test']],
    subject: 'Re: Flu clinic dates',
    body: `Dear Mr Pickering,

The flu clinics at Millbrook Surgery start on Saturday 3 October and run on three Saturdays from 9am to 12 noon. You can book a slot online or by ringing reception after 10am. There is no need to book for the walk-in session on the 24th.

Please wear a short-sleeved top or something you can roll up easily.

Kind regards,
Denise Hartley
Practice Administrator

> Hello, could you tell me when the flu jabs are being offered this year? Last year I was away on the day.`
  },
  {
    ind: 'secondary school', en: 'UK',
    from: ['Rob Ellison', 'robellison@stbedes-school.example'],
    to: [['Nadia Choudhury', 'nadia.choudhury@webmail.example']],
    subject: 'Re: Year 9 parents\' evening',
    body: `Dear Ms Choudhury,

Thank you for getting in touch. Parents' evening for Year 9 is on Thursday 17th, between 4 and 7pm. Booking opens on Monday on the school website, and you will get an email with the link. Appointments are five minutes each, so if you want to see several teachers, book them back to back.

Regards,
Rob Ellison
Deputy Head

> Hi, when is the next parents' evening for Year 9? I'd like to book in with the maths and science teachers.`
  },
  {
    ind: 'cricket club', en: 'AU',
    from: ['Norm Gallagher', 'norm@westvale-cricket.example'],
    to: [['Jack Dunstan', 'jack.dunstan@ozmail.example']],
    subject: 'Saturday team sheet',
    body: `Jack,

Saturday vs. Eastgate, first ball 1pm at Boyd Oval. Team: Jack D (c), Mick, Sully, Davo, Brad, the Singh brothers, Ollie, Hamish, Dazza, Paddy, and Kev as 12th. Be there by 12.15 for a hit. Whites if you've got them, otherwise club colours.

Tea's on us. Bring a plate if you can.

Norm`
  },
  {
    ind: 'scout group', en: 'UK',
    from: ['Alan Birtles', 'alan@4thcrossley-scouts.example'],
    to: [['Karen Mistry', 'karen.mistry@inbox.test']],
    subject: 'Camp kit list',
    body: `Dear Karen,

Here's the kit list for the weekend camp at Beacon Hill:

Sleeping bag and roll mat
Waterproofs and a spare set of clothes
Strong boots and trainers
Torch with spare batteries
Plate, bowl, mug, cutlery (named)
Washbag and towel
Water bottle
Pocket money for the tuck shop (no more than £5)

Please no phones, games or sweets. Medicines should be handed to a leader at drop-off in a labelled bag with instructions. Drop-off is 6pm on Friday at the hut and pick-up is 2pm on Sunday.

Yours in Scouting,
Alan Birtles
Group Scout Leader`
  },
  {
    ind: 'dance school', en: 'US',
    from: ['Colleen Ruiz', 'info@twirlandleap-dance.example'],
    to: [['Beth Hammond', 'beth.hammond@maplemail.example']],
    subject: 'Recital rehearsal schedule',
    body: `Hi Beth,

Dress rehearsal for the spring recital is Saturday at the Grand Theater. Mini Movers (ages 4 to 6) are at 9:00, Junior Jazz at 10:15 and Teen Contemporary at 11:30. Costumes and hair done at home, please. Dancers can bring a snack and a book, as there's quite a lot of waiting around.

Tickets for family and friends are available through the school office, $12 each.

Thank you,
Colleen`
  },
  {
    ind: 'language school', en: 'UK',
    from: ['Fiona Gray', 'enrolments@bridgewater-english.example'],
    to: [['Mateo Alvarez', 'mateo.alvarez@webmail.example']],
    subject: 'Autumn term enrolment',
    body: `Hello Mateo,

Thank you for your interest in our Intermediate evening course. It runs on Monday and Wednesday evenings from 6.30 to 8.30, starting on 5 October. The course fee is £395 and includes the coursebook. There's a short placement test (15 minutes) before the first class, either online or in the school.

To reserve a place, reply with your preferred test time.

Best,
Fiona Gray
Bridgewater School of English`
  },
  {
    stop: 'economics', place: 'quoted',
    ind: 'interior design', en: 'US',
    from: ['Nadine Foster', 'nadine@fosterlane-interiors.example'],
    to: [['Greg Whitaker', 'greg@whitaker-dental.example']],
    subject: 'Re: Waiting room refresh, next steps',
    body: `Hi Greg,

Thanks for the call. I'll have the revised plan to you on Thursday, with the fabric samples.

Nadine

On Mon, Oct 14, Anita Lopez wrote:
> Just so we're all clear before Nadine replies: our internal budget for the fit-out is $190,000 including the contingency.
> The sofa order has to go in by Friday to hit the lead time.`,
    sentence: 'our internal budget for the fit-out is $190,000 including the contingency.',
    why: 'SPEC §5.5 internal economics: "our internal budget for the fit-out is $190,000 including the contingency." (quoted history) gives the sender\'s internal budget and contingency.'
  },
  {
    ind: 'museum', en: 'UK',
    from: ['Helena Brandt', 'learning@hollowbridge-museum.example'],
    to: [['Mr Andrew Cole', 'andrew.cole@thornleigh-juniors.example']],
    subject: 'Your class visit on 12 November',
    body: `Dear Mr Cole,

I'm pleased to confirm the visit of Year 4 on 12 November, 10am to 1.30pm. Two sessions are planned: the Romans in Hollowbridge workshop (45 minutes) and a free-flow gallery trail. One adult for every six pupils is free. A lunch space is reserved in the education room.

Please send final numbers and any access needs a week before. The risk assessment is available on request.

Kind regards,
Helena Brandt
Learning Officer`
  },
  {
    ind: 'theatre box office', en: 'UK',
    from: ['Box Office', 'boxoffice@lantern-theatre.example'],
    to: [['Maureen Fitch', 'maureen.fitch@mailbox.example']],
    subject: 'Your tickets for Saturday',
    body: `Hello Maureen,

Your two tickets for Saturday's 7.30 performance are held in your name at the box office. Doors open at 7. Collect from the desk with a photo ID or this email. Seats are in row F, which has step-free access via the side door.

Enjoy the show,
Lantern Theatre Box Office`
  },
  {
    ind: 'gym', en: 'US',
    from: ['Tyler Boone', 'tyler@ironcreek-fitness.example'],
    to: [['Dana Whitfield', 'dana.whitfield@inbox.test']],
    subject: 'Membership freeze confirmed',
    body: `Hi Dana,

I've frozen your membership from the 1st until the end of November, as you asked. No fees will be taken in that time, and your key tag will stop working until it restarts on December 1st. If you want to come back earlier, just let us know.

Tyler`
  },
  {
    ind: 'yoga studio', en: 'AU',
    from: ['Mel Kasprzak', 'mel@stillwater-yoga.example'],
    to: [['Priti Shah', 'priti.shah@ozmail.example']],
    subject: 'Timetable changes from Monday',
    body: `Hi Priti,

From Monday the 6am class moves to 6.15am, and Thursday's gentle flow becomes a restorative class with Jo. Everything else is as before. Mats and blocks are provided; bring a blanket if you tend to get cold at the end.

Namaste,
Mel`
  },
  {
    ind: 'boat yard', en: 'UK',
    from: ['Phil Trethewey', 'phil@polgwyn-boatyard.example'],
    to: [['Simon Barlow', 'simon.barlow@webmail.example']],
    subject: 'Re: Antifouling',
    body: `Simon,

We can lift her on Monday 9th at 10.30 on the top of the tide, pressure wash, and have the antifouling done by Thursday. Two coats of the hard white as before. We'd relaunch on Friday afternoon.

Phil

> Phil, can we get Wanderer in for antifouling before the end of the month? Same paint as last time please.`
  },
  {
    ind: 'marina', en: 'CA',
    from: ['Jim Tolliver', 'office@sandpiper-marina.example'],
    to: [['Karen Leclerc', 'karen.leclerc@maplemail.example']],
    subject: 'Berth fees for next season',
    body: `Hi Karen,

Berth fees for next season are $62 per foot per season for a slip up to 40 feet, with a 5% discount if paid before March 1. Hydro is metered. The haul-out and spring launch are billed separately. I can send the full fee schedule if you'd like it.

Jim`
  },
  {
    ind: 'winery cellar door', en: 'AU',
    from: ['Andrea Costello', 'cellardoor@lowerridge-wines.example'],
    to: [['Theo Papas', 'theo.papas@ozmail.example']],
    subject: 'Saturday tasting for six',
    body: `Hi Theo,

Booked: Saturday 2pm tasting for six in the barrel room. It's $25 each, refunded against any purchase. We'll put out a cheese and charcuterie platter if you give us a day's notice. There's parking behind the shed, and if anyone in the group is driving, we'll gladly use the spittoons.

Andrea`
  },
  {
    ind: 'apple orchard', en: 'UK',
    from: ['Bridget Hallam', 'bridget@applegarth-orchard.example'],
    to: [['Terry Mouldsley', 'terry.mouldsley@inbox.test']],
    subject: 'Pressing day on the 18th',
    body: `Hi Terry,

Pressing day is the 18th, and we'll start at 9. Bring your apples in clean crates or sacks, and a bottle of your own for the juice if you have one. We charge 40p a litre for pressing and 60p for pasteurised bottles. Please let us know roughly how many kilos you're bringing.

Bridget`
  },
  {
    ind: 'trout fishery', en: 'UK',
    from: ['Neville Sharpe', 'bailiff@langstone-fishery.example'],
    to: [['Ross McKenna', 'ross.mckenna@homepost.test']],
    subject: 'Season ticket',
    body: `Hi Ross, a season ticket is £320 for the lakes, with a bag limit of four fish a day. Pay in the lodge or by bank transfer, and I'll put your name on the list for the gate. Neville`
  },
  {
    ind: 'timber merchant', en: 'UK',
    from: ['Kath Birtwistle', 'sales@birtwistle-timber.example'],
    to: [['Mick Armitage', 'mick.armitage@armitage-joinery.example']],
    cc: [['Workshop', 'workshop@armitage-joinery.example']],
    subject: 'Re: Quote for oak beams',
    body: `Hi Mick,

For the four 150 x 250 oak beams at 3.6 m, kiln-dried, the price is £1,180 plus VAT delivered. Next delivery to your area is Thursday week. If you'd rather they were green oak, there's about 15% off, but it will move as it dries.

Kath

> Kath, can you quote for four oak beams, 150 x 250 and 3.6 m long? Kiln-dried if possible, delivered to the workshop.`
  },
  {
    ind: 'recycling centre', en: 'AU',
    from: ['Brett Sanders', 'bookings@greenloop-recycling.example'],
    to: [['Linda Cheong', 'linda.cheong@ozmail.example']],
    subject: 'Skip bin delivery Friday',
    body: `Hi Linda,

Your 4 cubic metre skip bin will be delivered on Friday morning to the address on the booking. Please leave space on the driveway or street for it, and don't put in asbestos, paint, gas bottles or batteries. Hire is for seven days; we collect on the following Friday.

Brett`
  },
  {
    ind: 'solar installer', en: 'US',
    from: ['Josh Whelan', 'josh@sunrow-solar.example'],
    to: [['Maria Delgado', 'maria.delgado@maplemail.example']],
    subject: 'Installation date and what to expect',
    body: `Hi Maria,

We're scheduled to install your system on Wednesday, October 28. A crew of four will arrive at 7:30 AM. Here's the plan:

Day 1: roof mounts, conduit and panel placement
Day 2: inverter, wiring and the electrical connection
Day 3: inspection and system commissioning

The power will be off for a few hours on day 2. We'll give you a call the evening before. The utility interconnection typically takes two to four weeks after inspection, and we handle the paperwork.

Josh`
  },
  {
    stop: 'personal', place: 'body',
    ind: 'HVAC', en: 'US',
    from: ['Gary Plunkett', 'gary@plunkett-hvac.example'],
    to: [['Susan Okafor', 'susan.okafor@maplemail.example']],
    subject: 'Furnace tune-up Tuesday',
    body: `Hi Susan,

Tuesday between 9 and 11 works for the furnace tune-up. Our tech will check the heat exchanger, filter and thermostat, and tell you what he finds before doing any other work.

Tomasz is on a performance plan after the third missed appointment. Ricky will be coming instead.

Gary`,
    sentence: 'Tomasz is on a performance plan after the third missed appointment.',
    why: 'SPEC §5.4 personal details: "Tomasz is on a performance plan after the third missed appointment." discloses a named employee\'s performance plan to a customer.'
  },
  {
    ind: 'locksmith', en: 'UK',
    from: ['Barry Quinn', 'barry@quickturn-locksmiths.example'],
    to: [['Joan Whitely', 'joan.whitely@mailbox.example']],
    subject: 'Re: Locked out, 43 Larch Road',
    body: `Hello Joan,

I can be with you at 4 this afternoon. The call-out is £65 and includes the first half hour, then it's £25 per half hour after that. Parts are extra. Please have some ID with an address handy for when I arrive.

Barry`
  },
  {
    ind: 'self-storage', en: 'US',
    from: ['Noah Prentiss', 'noah@lockandstow-storage.example'],
    to: [['Gina Salazar', 'gina.salazar@inbox.test']],
    subject: 'Moving into unit 214',
    body: `Hi Gina,

Welcome to Lock & Stow. You can move into unit 214 any time from tomorrow. Gate hours for tenants are 6 AM to 10 PM every day, and the office is open 9 to 5 on weekdays. We have hand trucks near the entrance, and there's a freight lift at the back of building C.

Your first month is paid. After that, the rent is $119, charged on the first of each month.

Noah`
  },
  {
    ind: 'dry cleaner', en: 'US',
    from: ['Linh Tran', 'linh@crisscross-cleaners.example'],
    to: [['Bob Fitzgerald', 'bob.fitzgerald@maplemail.example']],
    subject: 'Your suits are ready',
    body: `Hi Bob, your two suits and the coat are ready for pickup. We're closed Sunday. Linh`
  },
  {
    ind: 'charity shop', en: 'UK',
    from: ['Pauline Wragg', 'manager@stlukes-hospice-shop.example'],
    to: [['Derek Hale', 'derek.hale@webmail.example']],
    subject: 'Collecting your furniture donation',
    body: `Dear Derek,

Thank you so much for offering the furniture. Our van can collect on Wednesday between 10 and 2. Sofas and chairs need a fire-safety label; the wardrobe and bookcase are fine as they are. We can't take mattresses, I'm afraid. If you leave everything in the garage or hall, the lads can load without having to disturb you.

Many thanks,
Pauline Wragg
Shop Manager`
  },
  {
    ind: 'credit union', en: 'IE',
    from: ['Aoife Brennan', 'aoife@lakeland-creditunion.example'],
    to: [['Brendan Moriarty', 'brendan.moriarty@webmail.example']],
    subject: 'Branch closed Monday',
    body: `Hi Brendan,

Just to say that our branch will be closed on Monday for the bank holiday. Online services will work as usual, and we're back on Tuesday from 10. If you need a cheque lodged urgently, drop it in the box at the side door.

Aoife`
  },
  {
    ind: 'insurance broker', en: 'UK',
    from: ['Simon Grayling', 'simon@harlow-insurance.example'],
    to: [['Tim Ashby', 'tim.ashby@ashby-plumbing.example']],
    cc: [['Office', 'office@ashby-plumbing.example']],
    subject: 'Van insurance renewal',
    body: `Hi Tim,

Your commercial van policy renews on 14 November. I've compared four insurers, and the best option is £1,046, down from £1,190 last year, with the same cover and £250 excess. The next best is £1,085 with a lower excess. Let me know which you'd like, and I'll arrange it before the renewal date.

Simon`
  },
  {
    stop: 'remark', place: 'subject',
    ind: 'freight forwarding', en: 'UK',
    from: ['Wendy Ashcroft', 'wendy@ashcroft-forwarding.example'],
    to: [['Kamal Hussain', 'kamal@hussain-imports.example']],
    subject: 'Your dispatcher Carl is a muppet who can\'t read a delivery note',
    body: `Kamal,

The pallet for Leeds went to Lincoln again. I've asked the driver to bring it back tonight and I'll have it with your customer by midday tomorrow. Please send over the delivery note again so we can check it against the booking.

Wendy`,
    sentence: 'Your dispatcher Carl is a muppet who can\'t read a delivery note',
    why: 'SPEC §5.7 remarks: "Your dispatcher Carl is a muppet who can\'t read a delivery note" is a disparaging remark about a named person, placed in the subject.'
  },
  {
    ind: 'travel agency', en: 'AU',
    from: ['Ruth Lindqvist', 'ruth@wanderwise-travel.example'],
    to: [['Pete and Carol Mason', 'masons@ozmail.example']],
    subject: 'Your Fiji itinerary',
    body: `Hi Pete and Carol,

Here is the draft itinerary:

Sat 14 Nov: Sydney to Nadi, arrive 9:20am, transfer to the resort
Sun 15 to Thu 19: Resort stay, breakfast included
Fri 20: Day trip to the Mamanuca islands
Sat 21: Resort to the airport, flight departs 1:10pm

Total for the two of you is $4,860, including flights and transfers. Travel insurance isn't included and I'd recommend adding it. Tell me if you'd like to change anything and I'll hold these fares until Friday.

Ruth`
  },
  {
    ind: 'event planning', en: 'US',
    from: ['Cassandra Webb', 'cassandra@silverbell-events.example'],
    to: [['Patrick Lyons', 'patrick.lyons@lyons-law.example']],
    cc: [['Maureen Cho', 'maureen.cho@lyons-law.example']],
    subject: 'Re: Firm anniversary dinner, vendor timeline',
    body: `Hi Patrick,

Here's the full vendor timeline for the anniversary dinner on the 14th. Please tell me if anything looks wrong.

2:00 PM: Rentals arrive (tables, chairs, linens, glassware)
2:30 PM: Florist begins centerpieces and the entrance arch
3:30 PM: AV team starts setup, sound check at 5
4:00 PM: Caterer arrives, kitchen setup in the back corridor
5:30 PM: Bar staff and servers arrive, briefing at 5:45
6:00 PM: Musicians arrive and tune up
6:30 PM: Doors open, welcome drinks on the terrace
7:15 PM: Guests seated; remarks from the managing partner
7:30 PM: First course
8:30 PM: Main course
9:30 PM: Dessert and toasts
10:30 PM: Music to dance floor
11:30 PM: Last drinks
12:00 AM: Out. Rentals collected the next morning from 9.

A couple of notes. The terrace is outdoors, so we've got heaters and a tent in reserve in case the weather turns. The vegetarian count is 14 and there are three guests with nut allergies, which the caterer has flagged in the kitchen. The photographer will be there from 6 to 9, and I'll ask her to get a group shot after the speeches.

Final guest numbers are due by Friday. Parking for 40 cars is reserved at the garage opposite, and I'll send the pass details closer to the day.

Cassandra`
  },
  {
    ind: 'wedding DJ', en: 'UK',
    from: ['Luke Marden', 'luke@marden-sound.example'],
    to: [['Imogen Pratt', 'imogen.pratt@mailbox.example']],
    subject: 'Playlist ideas for the 21st',
    body: `Hi Imogen,

Thanks for the playlist form. I've got your first dance and the cake-cutting track, and I've added the do-not-play list. I'm free to catch up on the phone next week if you want to talk through the evening running order. I'll set up from 5pm, so I'll be ready for your guests arriving at 7.

Luke`
  },
  {
    ind: 'wedding photographer', en: 'UK',
    from: ['Poppy Newsome', 'poppy@newsome-photo.example'],
    to: [['Callum and Jess Hardy', 'hardys@homepost.test']],
    subject: 'Your gallery is live',
    body: `Hi both,

Your wedding gallery is now live at https://newsome-photo.example/gallery/hardy. You have 90 days to download full-size images, so please grab them early. Favourites you pick in the next two weeks will go into your album design. It's been a pleasure.

Poppy`
  }
];
