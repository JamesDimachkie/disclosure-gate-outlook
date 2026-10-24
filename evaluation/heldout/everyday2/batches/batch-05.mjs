// everyday2 batch 05. Hand-written literals; see ../serialize.mjs for the schema wrapper.
export default [
  {
    category: 'none', expect: 'pass',
    why: `Airport parking confirmation; a booking reference and vehicle registration are not identifiers under SPEC §5.3, nothing else under §5.`,
    industry: 'airport parking', variant: 'UK',
    from: { name: 'Skypark Meet & Greet', address: 'bookings@skyparkmeetandgreet.example' },
    to: [{ name: 'Mr N Chaudhry', address: 'n.chaudhry@outlookmail.test' }],
    subject: `Booking SP-77120 - Manchester T2 - 3 Dec`,
    body: `Dear Mr Chaudhry,

Your meet and greet parking is confirmed.

Drop-off: Wednesday 3 December, 05:30, Terminal 2 departures, Level 1 meet and greet bay
Return: Wednesday 10 December, flight landing 14:20
Vehicle: silver Skoda Octavia, YH21 reg

On the day, call the number on your booking when you are 15 minutes away and a driver will meet you at the bay. On return, call again once you have your bags and your car will be brought to the same place.

Please remove valuables and make sure you have at least a quarter tank of fuel.

Safe travels,
Skypark`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Ski school lesson confirmation; nothing under SPEC §5.`,
    industry: 'ski school', variant: 'CA',
    from: { name: 'Summit Ski School', address: 'lessons@summitskischool.example' },
    to: [{ name: 'The Nakamura Family', address: 'nakamuras@familymail.test' }],
    subject: `Kids' lessons Dec 27-29 - meeting point and gear`,
    body: `Hi,

Thanks for booking! Here are the details for Emi and Kenji's lessons:

Dates: Dec 27, 28, 29, 9:30 AM to 12:00 PM each day
Meeting point: the Kids' Corral at the base of the Magic Carpet, look for the orange flags
Please arrive by 9:15 for check-in

What to bring: helmet (mandatory, rentals available at the base lodge), goggles, warm layers, mitts not gloves for the little ones, and a snack in a pocket. Lift tickets are included in the lesson price.

If the weather closes the mountain we'll email by 7:30 AM and move the lesson to the next available day.

See you on the hill!
Summit Ski School`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Tour guide confirming a private walking tour; nothing under SPEC §5.`,
    industry: 'tour guide', variant: 'IE',
    from: { name: 'Siobhan Walsh', address: 'siobhan@dublinonfoot.example' },
    to: [{ name: 'Linda and Bob Cartwright', address: 'cartwrights@mailhub.test' }],
    subject: `Your private tour - Thursday 10am`,
    body: `Dear Linda and Bob,

Looking forward to meeting you on Thursday at 10am outside the main gate of Trinity College on College Green. I'll be the one with the green umbrella whatever the weather!

The tour is about two and a half hours at an easy pace with plenty of stops. We'll finish near Temple Bar so you'll be well placed for lunch; I'll give you a few suggestions.

Wear comfortable shoes and bring a rain jacket, it's Dublin after all.

Slán go fóill,
Siobhan`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Ferry operator sending a sailing change notice; nothing under SPEC §5.`,
    industry: 'ferry operator', variant: 'UK',
    from: { name: 'Island Ferries', address: 'customers@westislesferries.example' },
    to: [{ name: 'Passenger', address: 'c.macleod@btmail.test' }],
    subject: `Sailing change - Sat 1 Nov 14:15`,
    body: `Dear Passenger,

Due to the forecast, the 14:15 sailing on Saturday 1 November is being brought forward to 12:30. Your booking has been moved to the 12:30 automatically; please check in at least 30 minutes before.

If the new time does not suit, you may change to any sailing in the following 7 days free of charge or request a full refund through the website.

Please check the service status page before travelling.

Island Ferries`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Hostel replying to a group booking enquiry; customer-facing prices (SPEC §5.5 does not flag).`,
    industry: 'hostel', variant: 'NZ',
    from: { name: 'Backyard Backpackers', address: 'stay@backyardbackpackersqt.example' },
    to: [{ name: 'Jonas Weber', address: 'jonas.w@worldmail.test' }],
    subject: `Re: 6 beds, 14-16 Feb`,
    body: `Hey Jonas,

Yep we can do that. We've got a 6-bed dorm free for 14-16 Feb, $38 a bed a night, or two 3-bed rooms at $45 a bed. Free brekkie (toast and cereal), free wifi, and the hot tub's open till 10pm.

If you want to lock it in just reply and we'll send a payment link for the first night as deposit.

Cheers,
Ash`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Bakery to a cafe about a standing order change; nothing under SPEC §5.`,
    industry: 'bakery', variant: 'UK',
    from: { name: 'Crumb Bakery', address: 'wholesale@crumbbakeryshef.example' },
    to: [{ name: 'Jess', address: 'jess@theteacupcafe.test' }],
    subject: `Standing order from Monday`,
    body: `Hi Jess,

Just confirming your new standing order from Monday: 8 sourdough, 6 seeded, 12 croissants, 6 cinnamon buns daily Tues-Sat, with 4 extra sourdough on Saturdays. Delivered by 7.30.

Prices unchanged till January, then we'll have a chat.

Cheers,
Nick`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Hardware store replying about a special order; nothing under SPEC §5.`,
    industry: 'hardware store', variant: 'US',
    from: { name: 'Granger Hardware', address: 'store@grangerhardware.example' },
    to: [{ name: 'Phil Dorsey', address: 'pdorsey@postbox.test' }],
    subject: `Re: 3/4" copper fittings`,
    body: `Phil,

We can get the 3/4" copper tees and 90s in on Thursday's truck. The 10-pack of tees is $28.50 and the 90s are $24. Want me to order both? I'll set them aside under your name.

Mike

> Mike, do you have 3/4" copper tees and 90s? I need about 10 of each for the basement job. Phil`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Flooring fitter quote with measurements; customer-facing price (SPEC §5.5 does not flag).`,
    industry: 'flooring fitter', variant: 'UK',
    from: { name: 'Ash Flooring', address: 'quotes@ashflooringltd.example' },
    to: [{ name: 'Mrs Gill', address: 'r.gill@quickmail.test' }],
    subject: `Quote - lounge and hallway`,
    body: `Dear Mrs Gill,

Thank you for having me round. Measurements: lounge 4.2m x 5.1m, hallway 1.1m x 4.8m, so about 27 square metres with cutting allowance.

Quote for the oak-effect laminate you chose (the 12mm Country Oak), underlay, beading, door bars and fitting: £1,340 inc VAT. Uplift and disposal of the old carpet is included. Fitting takes a day.

The quote is valid for 30 days. Earliest fitting date is Monday 10 November.

Kind regards,
Ash`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Curtain maker arranging a measure and sending fabric options; nothing under SPEC §5.`,
    industry: 'curtain maker', variant: 'UK',
    from: { name: 'Henrietta Moss Soft Furnishings', address: 'henrietta@mosssoftfurnishings.example' },
    to: [{ name: 'Mrs A Carrington', address: 'a.carrington@homemail.example' }],
    subject: `Measure on Tuesday + fabric swatches`,
    body: `Dear Mrs Carrington,

I'll come to measure the bay window and the two bedrooms on Tuesday at 2pm as agreed. It takes about half an hour.

I've put three swatches in the post for the bay: the Sanderson linen in natural, the heavier Zoffany wool in slate, and a budget option that would work beautifully lined. Hold them up in the morning and evening light before deciding, they change a lot.

Lead time at the moment is about four weeks from fabric ordering.

Kind regards,
Henrietta`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Bathroom fitter's progress note to a homeowner; nothing under SPEC §5.`,
    industry: 'bathroom fitter', variant: 'UK',
    from: { name: 'Craig Dunne', address: 'craig@dunnebathrooms.example' },
    to: [{ name: 'Oliver and Meg', address: 'oliverandmeg@gmailbox.test' }],
    subject: `Day 3 update`,
    body: `Hi both,

Good day today. Old suite is out, first fix plumbing done and the floor's levelled ready for the tiler tomorrow. One snag: the waste for the new shower is 40mm and the old one was 32mm, so I've had to re-route it under the floor; no extra cost, just took a couple of hours.

Tiler Thursday and Friday, I'm back Monday for second fix. Still on for finishing Wednesday week.

Please keep the window open a crack for the adhesive to cure.

Craig`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Decorator quoting a job with a quoted enquiry; customer-facing price (SPEC §5.5 does not flag).`,
    industry: 'painter and decorator', variant: 'UK',
    from: { name: 'Gary Blunt Decorating', address: 'gary@bluntdecorating.example' },
    to: [{ name: 'Mr P Nolan', address: 'p.nolan@talkmail.test' }],
    subject: `Re: hall, stairs and landing`,
    body: `Hi Mr Nolan,

Thanks for showing me round. For the hall, stairs and landing: fill and sand, two coats on walls and ceiling, woodwork undercoat and gloss, including the front door inside. Four days. £1,150 labour plus paint at cost (I'd estimate £180 for a good trade emulsion and gloss).

I could start Monday 17 November.

Gary

> Hi Gary, I was given your name by the Hendersons. Could you quote for painting our hall, stairs and landing at 22 Vicarage Road? Paul Nolan`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Handyman one-liner; nothing under SPEC §5.`,
    industry: 'handyman', variant: 'AU',
    from: { name: 'Matt', address: 'matt@mattfixesit.example' },
    to: [{ name: 'Sue', address: 'sue.harrington@bigpond-mail.test' }],
    subject: `Shelves`,
    body: `Hi Sue, shelves done, flyscreen fixed too while I was there. $180, bank details on the invoice. Cheers Matt`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Driveway contractor sending a quote; customer-facing price and terms (SPEC §5.5 does not flag).`,
    industry: 'driveway and paving', variant: 'UK',
    from: { name: 'Pennine Paving', address: 'info@penninepavingco.example' },
    to: [{ name: 'Mr and Mrs Barrett', address: 'barretts@skymail.test' }],
    subject: `Quote - block paved driveway, 48 sq m`,
    body: `Dear Mr and Mrs Barrett,

Thank you for your time on Tuesday. Please find our quote below.

Scope: remove existing tarmac drive (approx 48 sq m), excavate to 250mm, Type 1 sub-base compacted, 50mm sharp sand, 60mm block paving in the Brindle colour you chose, soldier course edge, new drainage channel to the existing gully, all spoil removed.

Price: £6,480 including VAT. Payment: 25% deposit on booking, balance on completion. Duration: 5 working days. Guarantee: 5 years on workmanship.

We could start the week of 1 December. Blocks are 3 weeks from ordering so a decision by 7 November would hold that date.

Kind regards,
Dean Rawlinson
Pennine Paving`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Alarm company confirming a routine service appointment; logistics only, no codes or security gaps (SPEC §5.1).`,
    industry: 'alarm installer', variant: 'UK',
    from: { name: 'Service Desk', address: 'service@guardianalarmsystems.example' },
    to: [{ name: 'Mrs L Patterson', address: 'lpatterson@virginmail.test' }],
    subject: `Annual service - Wed 5 Nov, AM`,
    body: `Dear Mrs Patterson,

Your annual alarm service is booked for Wednesday 5 November, between 8am and 1pm. The engineer will test each sensor and the bell box and replace the panel battery if needed. Please allow about an hour and make sure someone is at home.

If this is inconvenient, reply with a preferred day and we'll rebook.

Guardian Alarm Systems service desk`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Fire safety company sending an inspection report summary to a landlord; nothing under SPEC §5.`,
    industry: 'fire safety services', variant: 'UK',
    from: { name: 'Redline Fire Protection', address: 'reports@redlinefireprotection.example' },
    to: [{ name: 'Mr J Okoro', address: 'j.okoro@homemail.example' }],
    subject: `Fire alarm and extinguisher service - 14 Bridge St flats`,
    body: `Dear Mr Okoro,

The six-monthly service at 14 Bridge Street was completed today. Summary:

- Communal fire alarm: all 8 detectors tested, 2 sounders tested, panel battery replaced
- Emergency lighting: 3-hour duration test passed on all 6 fittings
- Extinguishers: 4 serviced, the CO2 unit on the second floor is due for a pressure test next year
- Fire doors: the ground floor flat 1 door closer is not closing the door fully; recommend adjustment or replacement

The certificates are in your portal. Please arrange the door closer repair; we can quote if you wish.

Regards,
Redline Fire Protection`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Lift maintenance contractor to a building manager; nothing under SPEC §5.`,
    industry: 'lift maintenance', variant: 'SG',
    from: { name: 'Apex Lift Services', address: 'service@apexliftservices.example' },
    to: [{ name: 'Building Management', address: 'management@rivervalleytowers.test' }],
    subject: `Lift B shutdown for rope replacement - 12 Nov`,
    body: `Dear Sir/Madam,

We will be replacing the hoist ropes on Lift B on Wednesday 12 November. The lift will be out of service from 9am to approximately 5pm. Lift A will remain in operation.

Kindly inform residents in advance and display the attached notice (in your portal) at each lobby. Our technicians will require access to the motor room and the pit.

Thank you for your cooperation.

Regards,
Apex Lift Services`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Forklift training provider confirming a course; nothing under SPEC §5.`,
    industry: 'forklift training', variant: 'UK',
    from: { name: 'Northern Lift Training', address: 'courses@northernlifttraining.example' },
    to: [{ name: 'Warehouse Manager', address: 'wm@carltonlogistics.test' }],
    subject: `Counterbalance novice course - 3 delegates - 10-12 Nov`,
    body: `Hi Darren,

Confirming the 3-day novice counterbalance course for your three new starters, Monday 10 to Wednesday 12 November, 8am to 4pm at your site. Our instructor will need the training area clear, the truck fuelled and a room for the theory.

Delegates need steel toe caps and a hi-vis. Certificates and photo ID cards are issued within 10 days of passing.

Invoice as quoted, £1,050 plus VAT for the three.

Thanks,
Northern Lift Training`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Bookkeeper to a client about VAT return deadlines; nothing under SPEC §5.`,
    industry: 'bookkeeper', variant: 'UK',
    from: { name: 'Nina Holt', address: 'nina@holtbookkeeping.example' },
    to: [{ name: 'Dave Simmons', address: 'dave@simmonsplastering.test' }],
    subject: `VAT quarter to 30 Sept`,
    body: `Hi Dave,

I've reconciled September. There are 4 receipts in the app with no category and one supplier invoice (the plasterboard, 18 Sept) that I can't match to a payment. Can you have a look when you get a minute?

Once those are sorted I'll file the return. The deadline's 7 November and it'll be a payment this quarter, I'll send you the figure when it's final.

Thanks,
Nina`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Will writer arranging a signing appointment; the client's own estate planning as business, no third party's family matter (SPEC §5.4).`,
    industry: 'will writing service', variant: 'UK',
    from: { name: 'Clearwater Wills', address: 'appointments@clearwaterwills.example' },
    to: [{ name: 'Mr and Mrs Hale', address: 'thehales@btmail.test' }],
    subject: `Signing appointment - Tuesday 11 November`,
    body: `Dear Mr and Mrs Hale,

Your wills are drafted and ready for signing. We have booked Tuesday 11 November at 10.30am at our office; the appointment takes about 40 minutes. Two members of our team will act as witnesses, so you don't need to bring anyone.

Please bring photo ID. If you would like to review the drafts beforehand, they are in your secure portal.

Kind regards,
Clearwater Wills`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Stonemason to a customer about a memorial; nothing under SPEC §5 (the inscription is the customer's own order).`,
    industry: 'stonemason', variant: 'UK',
    from: { name: 'Hartley Memorials', address: 'office@hartleymemorials.example' },
    to: [{ name: 'Mrs E Travers', address: 'e.travers@talkmail.test' }],
    subject: `Memorial - proof for approval`,
    body: `Dear Mrs Travers,

The proof of the inscription and the layout is in the attached link for your approval. Please check the spelling and dates carefully, as we cannot alter the stone once cut.

Once approved, the cemetery permit takes about three weeks and the stone will be fixed within six weeks after that. The balance is due on fixing.

Please don't hesitate to call if anything is unclear.

With kind regards,
Hartley Memorials`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Mosque committee to a caterer about an event; nothing under SPEC §5.`,
    industry: 'mosque', variant: 'UK',
    from: { name: 'Br. Imran Siddiqui', address: 'events@centralmasjidleeds.example' },
    to: [{ name: 'Shahid', address: 'shahid@zamzamcatering.test' }],
    subject: `Community dinner - Sat 15 Nov - 250 covers`,
    body: `Salaam Shahid,

Confirming the community dinner for Saturday 15 November, 250 covers, serving from 7pm after Maghrib. Menu as discussed: chicken biryani, lamb karahi, daal, naan, salad, and gulab jamun. Please include 30 vegetarian portions.

Can you deliver and set up by 6.15? Our volunteers will serve. Chafing dishes and warmers please.

Total agreed is as per your quote, we'll pay by transfer the week after.

JazakAllah khair,
Imran`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Animal rescue to an adopter about a home check; nothing under SPEC §5.`,
    industry: 'animal rescue', variant: 'UK',
    from: { name: 'Second Chance Dog Rescue', address: 'adoptions@secondchancedogs.example' },
    to: [{ name: 'Rachel and Mo', address: 'rachelandmo@gmailbox.test' }],
    subject: `Home check for Bella - Saturday`,
    body: `Hi Rachel and Mo,

Great news, your application for Bella has been approved to the home check stage! One of our volunteers, Jan, will come round on Saturday at 11am. It's very informal, she'll have a look at the garden fencing and have a chat about routines.

If all goes well you could collect Bella the following weekend. The adoption fee is £250, which covers her neutering, vaccinations and microchip.

Thank you for choosing to adopt.

Second Chance Dog Rescue`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Wildlife trust to a volunteer about a work party; nothing under SPEC §5.`,
    industry: 'wildlife trust', variant: 'UK',
    from: { name: 'Reserves Team', address: 'volunteers@fenlandwildlifetrust.example' },
    to: [{ name: 'Conservation volunteers', address: 'fen-volunteers@groups-mail.test', kind: 'group' }],
    subject: `Work party Sun 2 Nov - reed cutting at Mere Fen`,
    body: `Hello all,

Next work party is Sunday 2 November at Mere Fen, meeting at the car park off Dyke Road at 9.30, finishing about 2.

Task: cutting and raking the reed bed by the hide. Tools and gloves provided. Please bring wellies (it will be wet), waterproofs, a packed lunch and a hot drink. Tea and biscuits as always at 11.

If you're coming please reply so we know numbers. New volunteers very welcome, no experience needed.

Thanks,
Mark
Reserves Officer`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Cinema to a school about a screening booking; nothing under SPEC §5.`,
    industry: 'cinema', variant: 'UK',
    from: { name: 'The Regal Cinema', address: 'bookings@regalcinemahexham.example' },
    to: [{ name: 'Mrs Doyle', address: 'cdoyle@priorsgateschool.test' }],
    subject: `Schools screening - Thurs 4 Dec, 10am`,
    body: `Dear Mrs Doyle,

Confirming your schools screening on Thursday 4 December at 10am for 120 pupils and 12 adults. £4 per pupil, adults free, invoiced to the school.

Doors open at 9.30. Coaches can drop off on Beaumont Street; please have the children in groups with their adults as they come in. We'll have the house lights up slightly throughout as requested.

Let us know of any accessibility needs and we'll reserve the appropriate seats.

Kind regards,
The Regal`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Rugby club to a sponsor about a banner and match day; nothing under SPEC §5.`,
    industry: 'rugby club', variant: 'UK',
    from: { name: 'Club Secretary', address: 'secretary@wharfedalerfc.example' },
    to: [{ name: 'Kirsty Lane', address: 'kirsty@lanemotors.test' }],
    subject: `Pitchside banner + sponsors' lunch 15 Nov`,
    body: `Hi Kirsty,

Thank you again for coming on board for the season. Your pitchside banner went up at the weekend, on the clubhouse side near the halfway line, photo in the link.

Sponsors' lunch is Saturday 15 November before the Otley game, 12.30 in the clubhouse, two places for Lane Motors. Kick off 2.15. Let me know names for the door.

Cheers,
Pauline`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Choir to a venue about a concert booking; nothing under SPEC §5.`,
    industry: 'community choir', variant: 'UK',
    from: { name: 'Harmony Voices', address: 'secretary@harmonyvoiceschoir.example' },
    to: [{ name: 'Parish Office', address: 'office@stmichaelschurchtown.test' }],
    subject: `Christmas concert - Sat 13 Dec - practicalities`,
    body: `Dear Angela,

Thank you for confirming Saturday 13 December. A few practicalities:

- Access from 4pm for the rehearsal, concert at 7pm, finished and cleared by 9.30
- We'll need the staging blocks and about 60 chairs for the audience
- Heating on from 3pm if possible, please!
- We'll handle our own tickets and programmes; refreshments in the hall afterwards, our members will run it
- The donation to the church fund will be as last year

Our MD will drop in the week before to check the piano.

Best wishes,
Fiona`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Martial arts club to a parent about grading; nothing under SPEC §5.`,
    industry: 'martial arts club', variant: 'US',
    from: { name: 'Sensei Dan', address: 'dan@ironwilldojo.example' },
    to: [{ name: 'Mrs. Alvarez', address: 'calvarez@mailhub.test' }],
    subject: `Grading Saturday - Diego`,
    body: `Hi Mrs. Alvarez,

Diego is ready to test for his orange belt this Saturday at 10 AM. Testing takes about an hour. Please have him in a clean gi with his current belt, and bring $35 for the testing fee (includes the new belt and certificate).

Family is welcome to watch from the bleachers. He's worked hard on his kata, I think he'll do great.

Osu,
Dan`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Kayak hire confirming a booking; nothing under SPEC §5.`,
    industry: 'kayak hire', variant: 'NZ',
    from: { name: 'Paddle Out Kayaks', address: 'hire@paddleoutkayaks.example' },
    to: [{ name: 'Tom Ferris', address: 'tferris@xtramail.test' }],
    subject: `Sat hire - 2 doubles`,
    body: `Hey Tom,

Two double kayaks are booked for you Saturday 10am-2pm from the beach kiosk. Life jackets, paddles and dry bags included. Bring a hat and sunblock, and don't paddle past the point if the wind gets up, we'll give you a safety rundown on the day.

$140 for the 4 hours, pay at the kiosk.

See ya,
Jess`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Car body shop estimate to a customer; a customer-facing estimate (SPEC §5.5 does not flag).`,
    industry: 'car body shop', variant: 'US',
    from: { name: 'Precision Auto Body', address: 'estimates@precisionautobodytx.example' },
    to: [{ name: 'Angela Brooks', address: 'abrooks@postbox.test' }],
    subject: `Estimate - rear bumper, Camry`,
    body: `Hi Angela,

Estimate for the rear-end damage on the Camry:

- Rear bumper cover, replace and paint: $740
- Reverse sensor (left), replace and recalibrate: $215
- Trunk lid, repair and blend: $380
- Labor and materials included in the above

Total: $1,335. About 4 working days once parts arrive. If you're going through insurance, send me the claim number and I'll deal with the adjuster directly.

Thanks,
Ruben`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Breakdown recovery firm to a garage about a delivered vehicle; nothing under SPEC §5.`,
    industry: 'breakdown recovery', variant: 'UK',
    from: { name: 'Swift Recovery', address: 'ops@swiftrecovery24.example' },
    to: [{ name: 'Workshop', address: 'workshop@hollinsgarage.test' }],
    subject: `Dropped off - blue Focus, non-starter`,
    body: `Hi,

Dropped the blue Focus on your forecourt at 7.15 this morning, keys through the letterbox as agreed. Customer is Mr Walsh, he'll ring you about 9. Non-starter, no crank, battery tested fine so probably starter motor. Fuel's about a quarter.

Cheers
Baz`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Van hire confirmation; nothing under SPEC §5.`,
    industry: 'van hire', variant: 'UK',
    from: { name: 'Easy Van Hire', address: 'hire@easyvanhirebristol.example' },
    to: [{ name: 'Lucy Ahmed', address: 'lucy.ahmed@quickmail.test' }],
    subject: `Luton van - Sat 8 Nov, 8am-6pm`,
    body: `Hi Lucy,

Your Luton van with tail lift is booked for Saturday 8 November, collect 8am, return by 6pm. £95 for the day including 100 miles, 20p a mile after that. Fuel: bring it back with the same as it goes out (we'll note it).

Bring your driving licence and a utility bill or bank statement with your address. The deposit of £250 is held on your card and released on return.

Thanks,
Easy Van Hire`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Freight forwarder sending a shipment status; nothing under SPEC §5.`,
    industry: 'freight forwarder', variant: 'ZA',
    from: { name: 'Operations', address: 'ops@capefreightforwarding.example' },
    to: [{ name: 'Imports', address: 'imports@karoohomeware.test' }],
    subject: `Shipment CFF-2291 - arrived Cape Town, clearance in progress`,
    body: `Hi Nadia,

Your container on CFF-2291 arrived in Cape Town this morning. Customs entry has been lodged and we expect release within 2 working days barring an inspection. Duties and VAT as per the pro forma we sent, payable before release.

Delivery to your Montague Gardens warehouse is provisionally booked for Thursday, 10am. Please confirm you can offload a 40ft with a forklift.

Regards,
Pieter`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Embroidery firm to a club about a kit order; nothing under SPEC §5.`,
    industry: 'embroidery and workwear', variant: 'UK',
    from: { name: 'Stitch & Print', address: 'orders@stitchandprintuk.example' },
    to: [{ name: 'Kit Secretary', address: 'kit@ridgewayhockeyclub.test' }],
    subject: `Order 1180 - artwork approval needed`,
    body: `Hi,

Your order of 40 training tops and 12 hoodies is ready to go into production, but we need approval on the embroidered crest: the stitch file is attached in the link. The smaller text under the crest is at the limit of what embroiders cleanly, so we've suggested a slightly bolder version.

Approve by Wednesday and it'll ship on the 14th.

Thanks,
Stitch & Print`,
  },
  // ---- stops ----
  {
    category: 'negotiation', expect: 'stop',
    why: `SPEC §5.6: "There's room on the delivery date, we just won't say so yet." reveals the sender's hidden room to move on terms.`,
    industry: 'furniture manufacturer', variant: 'UK', placement: 'body',
    deciding: `There's room on the delivery date, we just won't say so yet.`,
    from: { name: 'Helen Ward', address: 'helen@wardandsonsfurniture.example' },
    to: [{ name: 'Nick Foster', address: 'nick@fosteragencies.test' }],
    subject: `Re: Harrington Hotels - contract terms`,
    body: `Nick,

Tell them 12 weeks is the earliest we can commit to. There's room on the delivery date, we just won't say so yet. If they come back asking for 10 we can look generous.

Payment terms stay at 50% on order.

Helen`,
  },
  {
    category: 'remark', expect: 'stop',
    why: `SPEC §5.7: "Those crooks at the leasing company have done it again." is a disparaging remark about a company.`,
    industry: 'print shop', variant: 'US', placement: 'body',
    deciding: `Those crooks at the leasing company have done it again.`,
    from: { name: 'Vince Catalano', address: 'vince@catalanoprinting.example' },
    to: [{ name: 'Sheila Marks', address: 'sheila@marksbookkeeping.test' }],
    subject: `Copier lease - another charge`,
    body: `Sheila,

Another "service fee" showed up on the copier statement this month. Those crooks at the leasing company have done it again. Can you code it to the lease account for now and I'll fight it with them next week.

Vince`,
  },
  {
    category: 'secrets', expect: 'stop',
    why: `SPEC §5.1: "Garage door code for unit 14 is 0914." gives a garage door code that is actually given, in the quoted history.`,
    industry: 'estate agent', variant: 'AU', placement: 'quoted',
    deciding: `Garage door code for unit 14 is 0914.`,
    from: { name: 'Kylie Brand', address: 'kylie@brandpropertygroup.example' },
    to: [{ name: 'Dean', address: 'dean@dpcarpetcleaning.test' }],
    subject: `Fwd: unit 14 - carpets before the open`,
    body: `Hi Dean,

See below from the owner. Any time Thursday is fine, the unit's vacant. Let me know when you're done and I'll do a final check Friday morning.

Kylie

> Hi Kylie, yes go ahead and get the carpets done before Saturday's open. Garage door code for unit 14 is 0914. Internal door from the garage is unlocked.
> Thanks, Rod`,
  },
  {
    category: 'personal', expect: 'stop',
    why: `SPEC §5.4: "Carla's going through a custody fight at the moment, so bear with her on replies." discloses an identifiable person's family matter.`,
    industry: 'PR agency', variant: 'UK', placement: 'body',
    deciding: `Carla's going through a custody fight at the moment, so bear with her on replies.`,
    from: { name: 'Dominic Hale', address: 'dom@halepublicrelations.example' },
    to: [{ name: 'Fran Lister', address: 'fran@listerjewellery.test' }],
    subject: `Re: press release timing`,
    body: `Hi Fran,

The release is nearly there, Carla's doing the final pass. Carla's going through a custody fight at the moment, so bear with her on replies. If you need anything urgently come to me.

Launch date of the 20th still looks good for the trade press.

Dom`,
  },
  {
    category: 'economics', expect: 'stop',
    why: `SPEC §5.5: "Honestly we'd not go below 18.5k on this, that's our floor." reveals the sender's floor price (§5.5 lists floor or walk-away price under internal economics).`,
    industry: 'motorhome dealer', variant: 'UK', placement: 'body',
    deciding: `Honestly we'd not go below 18.5k on this, that's our floor.`,
    from: { name: 'Steve Garner', address: 'steve@garnerleisurevehicles.example' },
    to: [{ name: 'Phil Dawes', address: 'phil@dawesvehiclefinance.test' }],
    subject: `Re: the Autotrail part-ex`,
    body: `Phil,

Appreciate you sounding out your buyer. Honestly we'd not go below 18.5k on this, that's our floor. It's been through the workshop, new habitation check, tyres all round.

Let me know what he says.

Steve`,
  },
  {
    category: 'negotiation', expect: 'stop',
    why: `SPEC §5.6: "We'd take 1,800 for the cow if it came to it." states what the sender would accept, in the quoted history.`,
    industry: 'beef farm', variant: 'IE', placement: 'quoted',
    deciding: `We'd take 1,800 for the cow if it came to it.`,
    from: { name: 'Martin Kavanagh', address: 'kavanaghfarm@eircommail.example' },
    to: [{ name: 'Seamus Reilly', address: 'seamus@reillymart.test' }],
    subject: `Re: Re: the Limousin cow and calf`,
    body: `Seamus,

Grand, put her in Saturday's sale with the calf at foot then. I'll drop them in Friday evening.

Martin

> Martin, I've a man asking about the Limousin cow. What's your bottom line before I talk to him?
> Seamus

>> Seamus, I'd want 2,000 for her with the calf. We'd take 1,800 for the cow if it came to it. Don't let on though.
>> Martin`,
  },
  {
    category: 'remark', expect: 'stop',
    why: `SPEC §5.7: "Re: the muppets at the depot" is a disparaging remark about a company's staff, in the subject.`,
    industry: 'parcel courier', variant: 'UK', placement: 'subject',
    deciding: `Re: the muppets at the depot`,
    from: { name: 'Lee Pearson', address: 'lee@pearsoncouriers.example' },
    to: [{ name: 'Gail Hunter', address: 'gail@hunterhomegoods.test' }],
    subject: `Re: the muppets at the depot`,
    body: `Gail,

Your three parcels have been found and will be with the customers tomorrow. I've put a claim in for the delay on the one that was damaged. Sorry for the hassle this week.

Lee`,
  },
];
