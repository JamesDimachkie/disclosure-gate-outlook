// everyday2 batch 03. Hand-written literals; see ../serialize.mjs for the schema wrapper.
export default [
  {
    category: 'none', expect: 'pass',
    why: `Nursery newsletter-style note to a parent; nothing under SPEC §5.`,
    industry: 'childcare nursery', variant: 'UK',
    from: { name: 'Little Acorns Nursery', address: 'hello@littleacornsnursery.example' },
    to: [{ name: 'Mr and Mrs Ahmed', address: 'ahmedfamily@gmailbox.test' }],
    subject: `This week at Little Acorns + photo day`,
    body: `Dear Parents,

A few notes for the week:

- Photo day is Wednesday 5 November. Sibling photos from 8.30, nursery photos through the morning. Order forms come home the following week.
- We're collecting empty cereal boxes and kitchen roll tubes for junk modelling, please send any in.
- Wellies and a named coat every day please, we're outside in all weathers now.
- Half term we're open as normal; please let the office know by Friday if your child won't be in so we can plan staffing.

Thank you,
Jo and the team`,
  },
  {
    category: 'none', expect: 'pass',
    why: `University department replying to an external speaker about travel and a talk; nothing under SPEC §5.`,
    industry: 'university department', variant: 'UK',
    from: { name: 'Dr Ruth Lennox', address: 'r.lennox@northumbriauni.example' },
    to: [{ name: 'Dr Samuel Price', address: 'sam.price@coastalresearchinst.test' }],
    subject: `Re: Seminar on 19 November - practicalities`,
    body: `Dear Sam,

Wonderful, thank you for agreeing to speak. The seminar is at 4pm in the Ellison Building, room 2.14, and usually runs 45 minutes plus questions. We'll go for dinner afterwards with a few of the group if you can stay.

Travel: we can reimburse a standard rail fare and one night's accommodation; the finance office will send you a claim form after the event, it's a bit slow so apologies in advance. If you'd like us to book the hotel directly, just say.

Could you send a title and short abstract by the 7th so I can circulate it?

Best wishes,
Ruth`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Recruitment agency arranging an interview with a candidate; a role and a salary band advertised by the client, not the sender's own HR matter (SPEC §5.4).`,
    industry: 'recruitment agency', variant: 'UK',
    from: { name: 'Kieran Doyle', address: 'kieran@axisrecruitment.example' },
    to: [{ name: 'Amy Chen', address: 'amy.chen.work@outlookmail.test' }],
    subject: `Interview - Finance Analyst role - Tues 4 Nov`,
    body: `Hi Amy,

Good news, they'd like to meet you. Interview is Tuesday 4 November at 10am at their offices on Castle Street, ask for Deborah at reception. It'll be about an hour: a competency interview with the FD and the team lead, then a short Excel exercise.

The role is as per the ad, salary advertised at £38-42k depending on experience, hybrid 3 days in. Have a look at their last annual report, they like candidates who've done that.

Let me know you've got this and give me a ring after for a debrief.

Kieran`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Insurance broker sending renewal terms to a client; premium as a customer-facing price and policy details (SPEC §5.5 does not flag).`,
    industry: 'insurance broker', variant: 'UK',
    from: { name: 'Pam Whitworth', address: 'pam@whitworthinsurance.example' },
    to: [{ name: 'Gary Oldham', address: 'gary@oldhamplanthire.test' }],
    subject: `Renewal terms - fleet policy, 1 December`,
    body: `Hi Gary,

Your fleet renewal is due on 1 December. I've been to market and the best terms are from your current insurer:

- Premium £11,840 inc IPT (up from £11,120, mostly the two new flatbeds)
- Excess unchanged at £750 any one claim
- Drivers 25+ as before, two named young drivers at the extra loading we discussed

An alternative insurer came in £400 cheaper but with a £1,500 excess and no windscreen cover, so I don't think it's worth the move.

Let me know by the 20th if you're happy to renew. Monthly instalments are available again at 6% APR.

Thanks,
Pam`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Mortgage broker asking a client for documents; routine checklist, nothing under SPEC §5.`,
    industry: 'mortgage broker', variant: 'UK',
    from: { name: 'Sam Reynolds', address: 'sam@clearviewmortgages.example' },
    to: [{ name: 'Leanne and Josh', address: 'leanneandjosh@skymail.test' }],
    subject: `Documents for the application`,
    body: `Hi both,

Great news on the offer being accepted! To get the application in this week I need:

- Last 3 months' payslips for each of you
- Last 3 months' bank statements (the account your salaries go into)
- Photo ID (passport or driving licence, a clear photo is fine)
- Proof of deposit (statement showing the funds)
- The memorandum of sale from the estate agent when you get it

Upload them to the secure portal link I sent rather than emailing them please.

Once it's submitted the lender's valuation is usually booked within a week.

Sam`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Travel agent sending an itinerary; booking references are reference numbers (SPEC §5.1 does not flag), nothing else under §5.`,
    industry: 'travel agent', variant: 'AU',
    from: { name: 'Gail Patterson', address: 'gail@wanderlusttravelco.example' },
    to: [{ name: 'Brenda and Ken Marsh', address: 'marshes.travel@bigpond-mail.test' }],
    subject: `Japan itinerary - final`,
    body: `Hi Brenda and Ken,

Your final itinerary is below and the e-tickets are in the portal.

Sat 15 Mar: Depart Brisbane 9.50am, arrive Tokyo Haneda 6.05pm. Airport transfer booked (driver meets you at arrivals, look for the Wanderlust sign). Hotel Granbell Shinjuku, 4 nights, ref WT-7731.
Wed 19 Mar: Shinkansen to Kyoto, 9.30am (reserved seats, car 7). Ryokan Hirota, 3 nights, dinner and breakfast included.
Sat 22 Mar: Day trip Nara with guide, 9am pick-up.
Sun 23 Mar: Train to Osaka, Cross Hotel, 2 nights.
Tue 25 Mar: Depart Osaka Kansai 8.20pm, arrive Brisbane 6.15am Wed.

JR passes are being posted to you this week, activate them at the airport JR office on arrival.

Travel insurance certificates are attached to your portal too. Have a wonderful trip!

Gail`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Removals company confirming a move; nothing under SPEC §5.`,
    industry: 'removals', variant: 'UK',
    from: { name: 'Baxter Removals', address: 'moves@baxterremovals.example' },
    to: [{ name: 'Hannah Lowe', address: 'hannah.lowe@homemail.example' }],
    subject: `Your move - Friday 7 November`,
    body: `Hi Hannah,

All booked for Friday 7 November. Crew of three with the big van, arriving between 8 and 8.30am. We'll have the boxes and tape to you on Tuesday.

Couple of things:
- please defrost the freezer the day before
- keep anything you want to take yourself (documents, jewellery, chargers) in a separate bag so it doesn't end up in a box
- let us know if parking at the new place is restricted so we can sort a permit

Balance is due on the day by card or transfer.

Cheers,
Pete`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Cleaning company adjusting a schedule with a client; nothing under SPEC §5.`,
    industry: 'commercial cleaning', variant: 'US',
    from: { name: 'Shine Bright Cleaning', address: 'ops@shinebrightclean.example' },
    to: [{ name: 'Office Manager', address: 'office@hartmanlawgroup.test' }],
    subject: `Holiday week schedule`,
    body: `Hi Carla,

For Thanksgiving week we'll clean Monday and Wednesday evenings instead of Tuesday and Thursday, then back to normal the following week. Same crew, same times.

Also, the supply closet is low on paper towels; do you want us to keep ordering those through our account or will you handle it now that you have the warehouse club membership?

Thanks,
Devin`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Roofer's quote with a quoted enquiry; customer-facing price and terms (SPEC §5.5 does not flag).`,
    industry: 'roofing', variant: 'UK',
    from: { name: 'Lee Grainger', address: 'lee@graingerroofing.example' },
    to: [{ name: 'Mr Habib', address: 'f.habib@talkmail.test' }],
    subject: `Re: slipped tiles and gutter`,
    body: `Hi Mr Habib,

I had a look from the ladder this morning while you were out. Four slipped tiles on the rear slope and the gutter joint above the kitchen has gone.

Quote: refit the four tiles, replace two that are cracked, new gutter union and a clean out of both runs. £240 all in, no VAT. Can do it Saturday morning if dry.

Lee

> Hi, could you have a look at the roof at 31 Pennine Road, there are a couple of tiles slipped and the gutter is dripping over the back door. Thanks, F Habib`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Air conditioning servicer reminding a client of a maintenance visit; nothing under SPEC §5.`,
    industry: 'air conditioning servicing', variant: 'SG',
    from: { name: 'CoolTech Services', address: 'service@cooltechaircon.example' },
    to: [{ name: 'Mdm Tan', address: 'tan.sl@worldmail.test' }],
    subject: `Quarterly aircon servicing - 30 Oct`,
    body: `Dear Mdm Tan,

This is a reminder that your quarterly servicing is scheduled on Thursday 30 October, 2pm to 4pm, for the 3 units at your flat. Technician will call before coming.

Please ensure access to the units and clear the area below the fan coils. Chemical wash is not included in this visit; if you want to add it, it is $80 per unit, please inform us before Wednesday.

Thank you.

CoolTech Services`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Boatyard to a boat owner about winter lift-out; nothing under SPEC §5.`,
    industry: 'boatyard and marina', variant: 'UK',
    from: { name: 'Creekside Boatyard', address: 'yard@creeksideboatyard.example' },
    to: [{ name: 'Nigel Fairbrother', address: 'nigel.fairbrother@btmail.test' }],
    subject: `Lift-out for Kestrel - week of 10 Nov`,
    body: `Hi Nigel,

We've got Kestrel down for lift-out in the week beginning 10 November, most likely the Wednesday on the morning tide. She'll be pressure washed and chocked in the usual spot by the shed.

Winter storage is as per the tariff, and if you want the antifoul and anodes done before she goes back in let us know by February so we can get it in the diary.

Please make sure the fuel's topped up to reduce condensation and take any soft furnishings off before we lift.

Cheers,
Steve`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Pub landlord to a quiz host; nothing under SPEC §5.`,
    industry: 'pub', variant: 'UK',
    from: { name: 'The Fox and Hounds', address: 'landlord@foxandhoundsashby.example' },
    to: [{ name: 'Quizmaster Pete', address: 'petequiz@homemail.example' }],
    subject: `Quiz nights Nov/Dec`,
    body: `Pete,

Can you do the following Thursdays: 6th, 20th Nov and 4th, 18th Dec? The 18th will be the Christmas one so maybe a picture round with the staff baby photos again, that went down well.

Usual £80 plus your food and a couple of pints. Kick off 8.30.

Cheers
Mal`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Takeaway to a supplier about an order problem; criticism of goods and a firm request (SPEC §5.7 does not flag).`,
    industry: 'fish and chip shop', variant: 'UK',
    from: { name: 'Costas', address: 'costas@theharbourfryer.example' },
    to: [{ name: 'Orders', address: 'orders@northseafishwholesale.test' }],
    subject: `Last delivery - haddock`,
    body: `Hi,

The haddock in Friday's delivery wasn't right, three of the five boxes were soft and smelt off by Saturday lunchtime. We had to bin them. I need a credit for the three boxes on the next invoice please, and can you make sure the driver keeps the chiller running when he's doing the other drops.

Otherwise the order for this week is the same as usual, Thursday delivery.

Costas
The Harbour Fryer`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Food manufacturer to a retail buyer about a label change; nothing under SPEC §5.`,
    industry: 'food manufacturer', variant: 'UK',
    from: { name: 'Jenny Rawlings', address: 'jenny.rawlings@orchardvalleyfoods.example' },
    to: [{ name: 'Buying Team', address: 'buying@countrywidegrocers.test' }],
    subject: `Label update - Apple & Cinnamon granola (500g)`,
    body: `Hi Tom,

Heads up that we're updating the back-of-pack label on the Apple & Cinnamon granola from the January production run. Changes:

- Allergen box now states "may contain" for sesame (shared line from January)
- Nutrition per 45g serving as well as per 100g
- New recycling logo

Front of pack and barcode are unchanged. The artwork is attached to the shared folder for your sign-off; we need it back by 14 November to hit the print deadline.

Stock on shelf with the old label is fine to sell through.

Thanks,
Jenny`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Textile mill to a customer about dye lots and shipment; nothing under SPEC §5.`,
    industry: 'textile mill', variant: 'IN',
    from: { name: 'Suresh Iyer', address: 'suresh@kaveritextiles.example' },
    to: [{ name: 'Ms Laura Henke', address: 'laura@henkehometextiles.test' }],
    subject: `PO 2231 - dye lot confirmation and shipment`,
    body: `Dear Ms Henke,

Greetings from Kaveri Textiles.

With reference to your PO 2231, kindly note:

1. Lab dips for indigo (shade B) and rust have been approved as per your email of 10 October. Bulk dyeing will be done in a single lot to avoid shade variation.
2. Production will be completed by 8 November. Inspection by your nominated agency is requested on 10 or 11 November.
3. Shipment is planned ex Chennai on the 15 November sailing, ETA Hamburg approximately 4 weeks.

Please confirm the inspection date at your earliest so that we may prepone packing accordingly.

Thanking you,
Suresh Iyer
Kaveri Textiles Pvt Ltd`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Quarry sales to a groundworks customer about aggregate prices and delivery; customer-facing prices stated as facts (SPEC §5.5 does not flag).`,
    industry: 'quarry and aggregates', variant: 'UK',
    from: { name: 'Sales', address: 'sales@hillcrestquarries.example' },
    to: [{ name: 'Danny Fletcher', address: 'danny@fletchergroundworks.test' }],
    subject: `Prices from 1 Jan + Monday loads`,
    body: `Danny,

Two things.

Your three loads of Type 1 for Monday are booked, first on site 7.30am, the other two spaced an hour apart as you asked.

Also, prices are going up from 1 January: Type 1 to £24.50/t delivered within 15 miles, 20mm clean to £31/t, sand unchanged. Anything ordered and delivered before Christmas is at the current rate.

Cheers
Hillcrest sales office`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Waste contractor to a shop about bin collection changes; nothing under SPEC §5.`,
    industry: 'commercial waste collection', variant: 'AU',
    from: { name: 'Customer Care', address: 'care@binrightwaste.example' },
    to: [{ name: 'Nguyen Bakery', address: 'hello@nguyenbakery.test' }],
    subject: `Your collection day is changing`,
    body: `Hi,

From Monday 3 November your general waste collection will move from Tuesday to Monday. Recycling stays on Thursday. Please have the bins out by 6am.

If the new day doesn't work for you, reply and we'll see what else is available in your area. No other changes to your service or pricing.

Thanks,
BinRight Customer Care`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Utility contractor notifying a resident of works; nothing under SPEC §5.`,
    industry: 'water utility contractor', variant: 'UK',
    from: { name: 'Community Liaison', address: 'liaison@aquaworksutilities.example' },
    to: [{ name: 'Resident', address: 'occupier17@homemail.example' }],
    subject: `Water main replacement - Hawthorn Avenue - starts 10 November`,
    body: `Dear Resident,

We are working on behalf of your water company to replace the old water main on Hawthorn Avenue. Work starts on Monday 10 November and is expected to take about six weeks.

What to expect:
- Working hours 8am to 5pm, Monday to Friday
- Temporary traffic lights at the junction with Elm Road
- Some parking bays suspended in sections as we move along the road; we'll put cones out two days ahead
- Short interruptions to your water supply when we connect your property; we'll post a card through your door 48 hours before

Your water may look cloudy for a short time after a connection; running the kitchen tap for a few minutes clears it.

If you have any questions or special access needs, call our liaison line or reply to this email.

AquaWorks Community Liaison`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Scout leader to a parent about a camp; nothing under SPEC §5.`,
    industry: 'scout group', variant: 'UK',
    from: { name: 'Skip (Andy)', address: 'scouts@4thharboroughscouts.example' },
    to: [{ name: 'Mr and Mrs Kerr', address: 'thekerrs@btmail.test' }],
    subject: `Winter camp 21-23 Nov - kit list and forms`,
    body: `Hi,

Winter camp is 21-23 November at Beaudesert. We leave from the hut at 6.30pm Friday and are back about 3pm Sunday.

Forms: the health and consent form needs to be back by 14 November, and the £45 camp fee through OSM please.

Kit list (named, in one rucksack):
- sleeping bag (3 season minimum) and roll mat
- warm layers, hat, gloves, waterproofs
- two pairs of boots or wellies and trainers
- torch and spare batteries
- mess kit, water bottle
- NO phones, sweets are fine in moderation

We'll be doing pioneering, the night hike and the climbing wall. Any questions give me a shout at Scouts on Tuesday.

Andy`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Parish council clerk to a contractor about grass cutting; nothing under SPEC §5.`,
    industry: 'parish council', variant: 'UK',
    from: { name: 'Clerk', address: 'clerk@ashfordparishcouncil.example' },
    to: [{ name: 'Steve', address: 'steve@greenacregroundcare.test' }],
    subject: `Final cut and the churchyard hedge`,
    body: `Dear Steve,

The council agreed at Monday's meeting to go ahead with the final cut of the recreation ground and the village green in the first week of November, and to have the churchyard hedge trimmed back on the road side before the Remembrance service on the 9th.

Please invoice the council as usual. Could you also let me have a quote for the 2027 season by the end of January for the budget meeting?

Many thanks,
Linda
Clerk to Ashford Parish Council`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Housing association to a tenant about a repair appointment; nothing under SPEC §5.`,
    industry: 'housing association', variant: 'UK',
    from: { name: 'Repairs Team', address: 'repairs@northstarhousing.example' },
    to: [{ name: 'Mr K Mensah', address: 'kmensah@quickmail.test' }],
    subject: `Repair appointment - ref R/88214`,
    body: `Dear Mr Mensah,

Thank you for reporting the leaking kitchen tap. An operative will attend on Thursday 30 October between 8am and 1pm.

Please make sure someone over 16 is at home. If the appointment is not convenient, reply or call our repairs line and we will rearrange.

Northstar Housing Repairs Team`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Library one-liner reservation notice; nothing under SPEC §5.`,
    industry: 'public library', variant: 'US',
    from: { name: 'Fairview Public Library', address: 'notices@fairviewlibrary.example' },
    to: [{ name: 'Patron', address: 'ellen.rourke@mailhub.test' }],
    subject: `Hold ready: "The Overstory"`,
    body: `Your hold on The Overstory is ready for pickup at the Main branch until Nov 2.`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Museum to a school teacher arranging a visit; nothing under SPEC §5.`,
    industry: 'museum', variant: 'UK',
    from: { name: 'Learning Team', address: 'learning@wessexheritagemuseum.example' },
    to: [{ name: 'Miss E Blackwood', address: 'eblackwood@ferndownjuniors.test' }],
    subject: `Re: Year 5 visit - Thursday 20 November`,
    body: `Dear Miss Blackwood,

Thank you for your booking. Confirming Thursday 20 November for 58 Year 5 pupils and 6 adults:

10.00 Arrive, coats and bags to the cloakroom
10.15 Workshop A (Anglo-Saxon life, hands-on with replica objects), half the group; the other half self-guided in the galleries with the trail sheets
11.15 Swap
12.15 Lunch in the education room (bring packed lunches)
12.45 Whole group talk in the Great Hall
13.15 Depart

Cost is £4 per pupil, adults free, invoiced to the school after the visit. Coach drop-off is on Priory Lane; the driver can park at the leisure centre.

A pre-visit pack with a risk assessment is attached to the booking portal.

Best wishes,
Hannah
Learning Team`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Bookshop to a customer about a special order; nothing under SPEC §5.`,
    industry: 'bookshop', variant: 'IE',
    from: { name: 'The Quay Bookshop', address: 'hello@quaybookshop.example' },
    to: [{ name: 'Eoin Brady', address: 'eoin.brady@eircommail.test' }],
    subject: `Your order's in`,
    body: `Hi Eoin, the Flann O'Brien collected letters arrived this morning, we'll keep it behind the counter for you till Saturday week. €34.99. Thanks a million, Orla`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Printer to a customer about proofs and turnaround; customer-facing prices (SPEC §5.5 does not flag).`,
    industry: 'print shop', variant: 'UK',
    from: { name: 'Inkwell Print', address: 'studio@inkwellprint.example' },
    to: [{ name: 'Rosie Carr', address: 'rosie@carrceramics.test' }],
    subject: `Proofs for the Christmas flyers`,
    body: `Hi Rosie,

Proofs are in your portal. Two things to check:
1. The bleed on the back is tight on the left edge, I've nudged the logo in 3mm, see if you're ok with it.
2. The green prints a bit darker on the uncoated stock than it looks on screen. I've attached a photo of the swatch.

Once approved we're 3 working days for the 500 A5 flyers (£68) and 5 for the 100 A2 posters (£95). If you want them for the market on the 15th I need approval by Monday.

Cheers,
Ben`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Photographer delivering a gallery to a client; nothing under SPEC §5.`,
    industry: 'photographer', variant: 'US',
    from: { name: 'Elise Moreau Photography', address: 'elise@elisemoreauphoto.example' },
    to: [{ name: 'The Okafor Family', address: 'okafors@familymail.test' }],
    subject: `Your gallery is live!`,
    body: `Hi Ada and Chidi,

Your family session gallery is up! The link is in the portal and the PIN is the one on your welcome card. There are 84 edited images. Download the full-res files whenever you like, the gallery stays live for a year.

Prints: anything you order through the gallery before Nov 15 gets 15% off for the holidays. The walnut frames are my favorite for the porch shots.

Thank you for a lovely afternoon, your kids were hilarious.

Elise`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Florist confirming a funeral order; nothing under SPEC §5 (the deceased is not identified beyond a tribute spelling).`,
    industry: 'florist', variant: 'UK',
    from: { name: 'Petals of Ashby', address: 'orders@petalsofashby.example' },
    to: [{ name: 'Mrs J Clarke', address: 'j.clarke1958@virginmail.test' }],
    subject: `Your tribute order for Friday`,
    body: `Dear Mrs Clarke,

Thank you for your order. Confirming the "GRANDAD" letter tribute in white chrysanthemums with a blue ribbon edge, and the family spray in lilies and white roses, for delivery to the funeral directors by 9.30am on Friday.

The card message will read exactly as you wrote it on the form. If you'd like to change anything please let me know by Wednesday.

With sympathy,
Jan`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Caterer quoting a corporate lunch; customer-facing prices (SPEC §5.5 does not flag).`,
    industry: 'catering', variant: 'AU',
    from: { name: 'Fig & Fennel Catering', address: 'orders@figandfennelcatering.example' },
    to: [{ name: 'Rachael Simms', address: 'rachael.simms@harborviewlegal.test' }],
    subject: `Quote - lunch for 25, Fri 7 Nov`,
    body: `Hi Rachael,

Lovely to chat. Quote for lunch for 25 on Friday 7 November, delivered 12.15:

- Gourmet sandwich and wrap platters (mixed, including 4 vegetarian and 2 gluten-free): $14.50 pp
- Seasonal salad bowls x 3: $45 each
- Fruit platter x 2: $55 each
- Mini sweet treats: $4.50 pp

Total $720.00 inc GST, delivery included within the CBD. We'll bring disposable plates and napkins unless you'd prefer we didn't.

Let me know by Wednesday and we'll lock it in.

Cheers,
Amanda`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Dental laboratory to a dental practice about a case; a lab case reference, no patient health detail (SPEC §5.4).`,
    industry: 'dental laboratory', variant: 'UK',
    from: { name: 'Crown & Bridge Lab', address: 'lab@crownandbridgedental.example' },
    to: [{ name: 'Practice Manager', address: 'manager@elmstreetdental.test' }],
    subject: `Case 4471 - shade check needed`,
    body: `Hi,

Case 4471 (Dr Reid, upper left crown) is at the try-in stage but the shade on the prescription says A2 and the photos look more like A3. Could Dr Reid confirm before we glaze? If we hear back by Wednesday it'll still go out on Friday's van.

Thanks,
Mike
Crown & Bridge Dental Laboratory`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Hospital procurement to a supplier about a tender clarification; business matters stated as business (SPEC §5.5 does not flag naming budget lines without internal figures).`,
    industry: 'hospital procurement', variant: 'UK',
    from: { name: 'Procurement', address: 'procurement@merseyhealthtrust.example' },
    to: [{ name: 'Tenders', address: 'tenders@medisupplyuk.test' }],
    subject: `ITT 2026/114 - clarification response and deadline`,
    body: `Dear Supplier,

Thank you for your clarification questions on ITT 2026/114 (patient trolleys). Responses to all questions received are now published on the portal under Clarifications, including yours regarding delivery to multiple sites.

Please note the submission deadline remains 12 noon on Friday 14 November. Late submissions cannot be accepted.

Evaluation will be 60% quality and 40% price as set out in the ITT.

Regards,
Procurement Team`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Leisure centre to a swim-school parent about lesson moves; nothing under SPEC §5.`,
    industry: 'leisure centre', variant: 'UK',
    from: { name: 'Swim School', address: 'swimschool@riversideleisure.example' },
    to: [{ name: 'Ms T Bailey', address: 't.bailey@gmailbox.test' }],
    subject: `Stage 3 - moving up!`,
    body: `Hi,

Great news, Isla has passed Stage 3 and can move up to Stage 4 from next week. Stage 4 runs Saturdays at 10.30 (same teacher) or Wednesdays at 5pm. Reply with your preference and we'll move her over. Her certificate and badge are at reception.

Well done Isla!

Riverside Swim School`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Sign maker to a shop owner about a design and fitting; nothing under SPEC §5.`,
    industry: 'sign maker', variant: 'NZ',
    from: { name: 'Signwise', address: 'jobs@signwisenz.example' },
    to: [{ name: 'Mere Kahu', address: 'mere@kahucoffee.test' }],
    subject: `Fascia sign - proof v2`,
    body: `Hi Mere,

Proof v2 is attached in the link, we've made the lettering bolder like you asked and dropped the tagline to one line. Illuminated letters, 450mm high, on the black ACM panel.

If you're happy, we'll fabricate next week and fit the Monday after, early morning before you open. We'll need the power isolated for about an hour so get your sparky to show us the switch.

Price as quoted, $3,850 plus GST, half up front.

Cheers
Tama`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Yoga studio class change notice; a teacher's absence with no cause (SPEC §5.4 does not flag).`,
    industry: 'yoga studio', variant: 'CA',
    from: { name: 'Still Point Yoga', address: 'hello@stillpointyoga.example' },
    to: [{ name: 'Members', address: 'members@groups-mail.test', kind: 'group' }],
    subject: `Schedule changes this week`,
    body: `Hi everyone,

A few changes this week:

- Tuesday 6:30 PM Vinyasa: Jordan is away, Sasha is covering.
- Thursday 7 AM Flow is cancelled this week only.
- Sunday 10 AM Restorative is back on the schedule starting this weekend.

The studio will be closed Remembrance Day. Class packs have been extended by a week to make up for it.

Namaste,
Still Point`,
  },
  // ---- stops ----
  {
    category: 'remark', expect: 'stop',
    why: `SPEC §5.7: "The planning officer is a jobsworth idiot." is a disparaging remark about a person.`,
    industry: 'house builder', variant: 'UK', placement: 'body',
    deciding: `The planning officer is a jobsworth idiot.`,
    from: { name: 'Ian Mackie', address: 'ian@mackiehomes.example' },
    to: [{ name: 'Mr and Mrs Lowther', address: 'lowthers@homemail.example' }],
    subject: `Re: planning decision delay`,
    body: `Hi both,

Still no decision. They've asked for a third set of tree survey amendments, which we've sent. The planning officer is a jobsworth idiot. We'll keep pushing and I've asked our consultant to speak to the case manager directly.

I'd budget for another three weeks before we hear.

Ian`,
  },
  {
    category: 'secrets', expect: 'stop',
    why: `SPEC §5.1: "Alarm's been off since Tuesday because the panel keeps faulting." reveals a security gap (alarm off) at the premises.`,
    industry: 'retail shop', variant: 'UK', placement: 'body',
    deciding: `Alarm's been off since Tuesday because the panel keeps faulting.`,
    from: { name: 'Gemma Price', address: 'gemma@pricesofhigh.example' },
    to: [{ name: 'Rob Standish', address: 'rob@standishshopfitters.test' }],
    subject: `Re: new counter install next week`,
    body: `Hi Rob,

Monday 8am is fine, I'll be in from 7.30 to let you in. Alarm's been off since Tuesday because the panel keeps faulting. The alarm company can't come till the 12th, so you won't have to worry about setting it off when you're in and out with the panels.

Ta,
Gemma`,
  },
  {
    category: 'personal', expect: 'stop',
    why: `SPEC §5.4: "He got arrested Friday night so I'm covering his shifts." discloses an identifiable person's legal trouble, in the quoted history.`,
    industry: 'bar and restaurant', variant: 'US', placement: 'quoted',
    deciding: `He got arrested Friday night so I'm covering his shifts.`,
    from: { name: 'Tasha Greene', address: 'tasha@thecopperstill.example' },
    to: [{ name: 'Marcus Hill', address: 'marcus@hillbeveragedist.test' }],
    subject: `Re: delivery window this week`,
    body: `Hey Marcus,

Yeah Thursday morning works, I'll be in from 9. Just ring the back door.

Tasha

> Tasha, can we move your delivery to Thursday this week? Also, is Danny around to sign or should I look for you?
> Marcus

>> Marcus, you'll need to look for me. He got arrested Friday night so I'm covering his shifts. Thursday's fine.
>> Tasha`,
  },
  {
    category: 'economics', expect: 'stop',
    why: `SPEC §5.5: "Margin on the install side is thin, maybe 6 percent after labour." reveals the sender's own margin.`,
    industry: 'fencing contractor', variant: 'AU', placement: 'body',
    deciding: `Margin on the install side is thin, maybe 6 percent after labour.`,
    from: { name: 'Wayne Dodd', address: 'wayne@doddfencing.example' },
    to: [{ name: 'Kelly Marsh', address: 'kelly@steelmartsupplies.test' }],
    subject: `Re: pricing on Colorbond sheets`,
    body: `Hi Kelly,

Appreciate the quote but I need you to sharpen the pencil on the sheets. Margin on the install side is thin, maybe 6 percent after labour. If you can get the panel price down by a couple of bucks I can move the whole year's volume to you.

Let me know.

Wayne`,
  },
  {
    category: 'negotiation', expect: 'stop',
    why: `SPEC §5.6: "I expect them to counter around 300k, so hold firm at 320." tells the broker what the sender expects the other side to counter with and the sender's tactic.`,
    industry: 'business sale', variant: 'UK', placement: 'body',
    deciding: `I expect them to counter around 300k, so hold firm at 320.`,
    from: { name: 'Patricia Lund', address: 'patricia@lundsdeli.example' },
    to: [{ name: 'Graham Tait', address: 'graham@taitbusinessbrokers.test' }],
    subject: `Re: the Whitfields' interest`,
    body: `Graham,

Thanks for the update. Please go back to them with the 320 as discussed. I expect them to counter around 300k, so hold firm at 320. The fixtures and the van are included, stock at valuation on completion.

Patricia`,
  },
  {
    category: 'remark', expect: 'stop',
    why: `SPEC §5.7: "Gav's as useful as a chocolate teapot, just so you know." is a disparaging remark about a person, in the quoted history.`,
    industry: 'event production', variant: 'UK', placement: 'quoted',
    deciding: `Gav's as useful as a chocolate teapot, just so you know.`,
    from: { name: 'Holly Baines', address: 'holly@brightsparkevents.example' },
    to: [{ name: 'Ravi Menon', address: 'ravi@menonlightinghire.test' }],
    subject: `Re: Re: Saturday load-in`,
    body: `Hi Ravi,

Great, 2pm load-in confirmed. Ask for me at the stage door, I'll have the passes.

Holly

> Hi Holly, we can do 2pm. Who's the venue contact on the day, is it Gav again?
> Ravi

>> Hi Ravi, venue says we can have the dock from 2. Gav's as useful as a chocolate teapot, just so you know. Come to me for anything.
>> Holly`,
  },
  {
    category: 'secrets', expect: 'stop',
    why: `SPEC §5.1: "Door code changed to 6160 for the weekend" gives a premises door code that is actually given, in the subject.`,
    industry: 'dance studio', variant: 'US', placement: 'subject',
    deciding: `Door code changed to 6160 for the weekend`,
    from: { name: 'Renee Castillo', address: 'renee@stepupdancestudio.example' },
    to: [{ name: 'Jordan Pike', address: 'jpike.music@mailhub.test' }],
    subject: `Door code changed to 6160 for the weekend`,
    body: `Hi Jordan,

The old one won't work Saturday so use the new one for the recital rehearsal. Studio B is yours from 9 to noon; the sound system is already set up with the aux cable on the shelf.

Thanks for doing this.

Renee`,
  },
];
