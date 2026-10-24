// everyday2 batch 01. Hand-written literals; see ../serialize.mjs for the schema wrapper.
export default [
  {
    category: 'none', expect: 'pass',
    why: `Ordinary garage reminder with a customer-facing price; nothing in SPEC §5 applies.`,
    industry: 'garage', variant: 'UK',
    from: { name: 'Dave Pritchard', address: 'dave@pritchardmotors.example' },
    to: [{ name: 'Helen Moss', address: 'helen.moss72@homemail.example' }],
    subject: `MOT due 14 Nov - Corsa YK19`,
    body: `Hi Helen,

Just a reminder the Corsa's MOT runs out on 14 November. We've got slots Tuesday 11th and Thursday 13th, morning or afternoon, whichever suits.

While it's in we'd suggest doing the front pads, they were getting low at the service in May. Pads and labour would be about £95 all in, no need to decide now, we'll have a look on the day and ring you.

Give the office a bell on 0161 496 0123 or just reply here.

Cheers
Dave
Pritchard Motors, Unit 3 Wharf Lane`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Vet booster reminder to a pet owner with a reply quoted; routine logistics, nothing under SPEC §5.`,
    industry: 'vet clinic', variant: 'AU',
    from: { name: 'Belmont Road Vets', address: 'reception@belmontroadvets.example' },
    to: [{ name: 'Craig Donnelly', address: 'craigd@fastmail-au.example' }],
    subject: `Re: Biscuit's booster`,
    body: `Hi Craig,

No worries at all, we can do Saturday arvo. I've put Biscuit down for 2.40pm with Dr Tan. If you can bring the vaccination card that'd be great, otherwise we'll sort a new one.

Reception's open from 8, parking out the back.

Cheers,
Mel

> Hi, is there any chance of a weekend slot for Biscuit's booster? Weekdays are a nightmare at the moment.
> Craig`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Dental front-desk appointment confirmation; asks for an insurance card without any number, nothing under SPEC §5.`,
    industry: 'dental practice', variant: 'US',
    from: { name: 'Lakeside Family Dental', address: 'frontdesk@lakesidefamilydental.example' },
    to: [{ name: 'Marcus Reed', address: 'mreed.home@postbox.test' }],
    subject: `Appointment confirmed: Thu Oct 30, 9:15 AM`,
    body: `Hi Marcus,

This confirms your appointment on Thursday, October 30 at 9:15 AM with Dr. Alvarez.

A couple of quick reminders:
- Please arrive about 10 minutes early for check-in.
- Bring your insurance card if anything has changed since your last visit.
- If you need to reschedule, give us 24 hours' notice so we can offer the slot to someone else.

Our parking lot is off Birch Street; the entrance on Main is closed for sidewalk work this month.

See you Thursday!

Jenna
Lakeside Family Dental
(555) 010-4477`,
  },
  {
    category: 'none', expect: 'pass',
    why: `School trip reminder to a parent; payment via the school system is logistics only, nothing under SPEC §5.`,
    industry: 'primary school', variant: 'UK',
    from: { name: 'Mrs Okafor', address: 'office@stbrendansprimary.example' },
    to: [{ name: 'Mr and Mrs Lindqvist', address: 'lindqvist.family@btmail.test' }],
    subject: `Year 4 trip to the Roman museum - Friday deadline`,
    body: `Dear Parents and Carers,

A quick reminder that consent forms and the £8.50 contribution for the Year 4 trip to the Roman museum on 6 November need to be in by this Friday. Payment is through ParentPay as usual, and the consent form is on the class page.

Children will need a packed lunch (no glass bottles please), a waterproof and sensible shoes. We will be back in time for normal pick-up.

If you have any questions do pop into the office.

Kind regards,
Mrs Okafor
School Office`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Club notice to a parents' list about a waterlogged pitch; a group recipient and logistics only, nothing under SPEC §5.`,
    industry: 'youth football club', variant: 'UK',
    from: { name: 'Steve Hanley', address: 'u11s@eastfieldjuniors.example' },
    to: [{ name: 'Under 11s parents', address: 'u11-parents@groups-mail.test', kind: 'group' }],
    subject: `SATURDAY OFF - pitch waterlogged`,
    body: `All,

Sorry, the ref has called it. Pitches at Mill Lane are under water after last night so Saturday's game against Hartwell is off. We'll try and get it rearranged for a midweek slot in a couple of weeks.

Training still on Wednesday 6pm at the 3G, bring a coat for the parents' side of the fence!

Steve`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Stock agent's sale report to a farmer; list-heavy prices realised are customer-facing facts, nothing under SPEC §5.`,
    industry: 'livestock agent', variant: 'AU',
    from: { name: 'Rob Kelleher', address: 'rob@kelleherlivestock.example' },
    to: [{ name: 'Graham Whitford', address: 'whitford.pastoral@ruralnet.test' }],
    subject: `Dubbo results - your steers`,
    body: `G'day Graham,

Good result yesterday, market was a bit firmer than the week before. Your lot:

- 22 x Angus steers, av 412kg, made 398c/kg
- 9 x Angus x Hfd steers, av 388kg, made 384c/kg
- 3 x tail-enders, av 301kg, 352c/kg

Buyer on the main pen was the feedlot out of Gunnedah again. Settlement will be in your account within the 14 days.

Next sales are Thursday fortnight and then the weaner sale on the 20th. If you want to put the heifers in the weaner sale let me know by Monday week so I can get them on the catalogue.

Rob
Kelleher Livestock
0427 310 882`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Church volunteer rota with practical notes; nothing under SPEC §5.`,
    industry: 'church', variant: 'US',
    from: { name: 'Pastor Dale Whitcomb', address: 'dale@gracecommunitych.example' },
    to: [{ name: 'Rosa Jimenez', address: 'rosaj1965@mailhub.test' }],
    subject: `Sunday setup + coffee hour`,
    body: `Hi Rosa,

Thank you for taking coffee hour again this Sunday. The Hendersons are on setup so the chairs should be out by 8:30, and the big urn is in the closet by the kitchen (it takes about 40 minutes to come up to temperature, so maybe start it before the 9 o'clock service).

Donuts are being dropped off by Mike around 9:45. If he's running late just call him.

Also, we're short two greeters for the 11:00 service on the 9th if you know anyone who'd like to help.

Blessings,
Dale`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Charity thanking a supermarket manager and arranging collections; nothing under SPEC §5.`,
    industry: 'food bank charity', variant: 'UK',
    from: { name: 'Anita Shah', address: 'anita@northgatefoodbank.example' },
    to: [{ name: 'Paul Jennings', address: 'paul.jennings@freshmarket-stores.example' }],
    subject: `Thank you + November collection dates`,
    body: `Dear Paul,

Thank you so much to you and the team for Saturday's collection. We weighed it in at just over 410kg, which is our best single-day total at your store this year. The volunteers said your staff were brilliant with the trolleys.

Could we pencil in the following for November?
- Sat 8 Nov, 9am-4pm
- Sat 22 Nov, 9am-4pm
- Fri 28 Nov, 11am-3pm (half-term style afternoon slot if that works for you)

We'll bring the banners and the collection crates as before. If the dates clash with anything at your end just let me know and we'll shuffle.

With thanks,
Anita
Northgate Food Bank (registered charity)`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Salon moving an appointment because a stylist is off, with no cause given (SPEC §5.4 does not flag an absence without a stated cause).`,
    industry: 'hair salon', variant: 'IE',
    from: { name: 'Studio 9 Hair', address: 'bookings@studio9hair.example' },
    to: [{ name: 'Niamh Brennan', address: 'niamhb@eircommail.test' }],
    subject: `Your appointment Thursday`,
    body: `Hi Niamh,

Sorry about this, Aoife is out on Thursday so she won't be able to do your colour at 2. We can offer you Friday at 1.30 with Aoife or Thursday at the same time with Lorna, who's grand with your shade, it's all on your card.

Just let me know which you'd prefer and I'll move it.

Thanks a million,
Ciara`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Long wedding venue email about final numbers, menu choices and timings; customer-facing prices and payment terms stated as facts (SPEC §5.5 does not flag), nothing else under §5.`,
    industry: 'wedding venue', variant: 'UK',
    from: { name: 'Sophie Marchant', address: 'sophie@thetitheabarn.example' },
    to: [{ name: 'Jess and Tom', address: 'jessandtom2027@gmailbox.test' }],
    subject: `Final details for 15 November - please read!`,
    body: `Hi both,

Not long now! Here's where we are and what I still need from you by Friday 31 October so the kitchen and the team can lock everything in.

NUMBERS
- Day guests: you gave me 86 adults and 6 children. Please confirm or amend.
- Evening additions: 30. That's fine, we can go to 150 in the barn.

MENU
- Still waiting on choices for 11 guests (list attached in the planner, under Menu > Outstanding). Anyone we don't hear from gets the chicken.
- Dietaries so far: 2 vegan, 1 coeliac, 3 vegetarian, 1 nut allergy (Tom's uncle). Please double check this.
- Kids: 6 x children's menu.

TIMINGS (draft)
13:00 Ceremony in the orchard (wet weather: the Dairy)
13:30 Drinks and canapes on the terrace
15:00 Wedding breakfast called
17:15 Speeches
18:30 Room turnaround, guests to the bar and courtyard
19:30 Evening guests arrive, band 20:00
21:00 Evening food (bacon and halloumi baps)
23:45 Last orders, carriages at midnight

MONEY
- Final balance is due 14 days before, so by 1 November. The invoice will come from our accounts address and it's the figure on your signed schedule plus the extra evening guests at £14 a head.
- Any bar tab is settled on the night or by card the Monday after.

OTHER
- Your florist (Wildstem) has asked for access from 9am, that's fine.
- Please send me the band's contact and the name of whoever is doing the cake delivery.
- Confetti: dried petals only please, the ducks eat the paper stuff.

Shout if any of this is wrong. Really looking forward to it.

Sophie
Events Manager, The Tithe Barn`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Hotel booking confirmation with practical details; a booking reference is a reference number (SPEC §5.1 does not flag), nothing else under §5.`,
    industry: 'hotel', variant: 'SG',
    from: { name: 'The Clarke Quay Residences', address: 'reservations@clarkequayresidences.example' },
    to: [{ name: 'Mr Rajesh Pillai', address: 'r.pillai@worldmail.test' }],
    subject: `Booking confirmation CQR-48217 - 3 to 6 December`,
    body: `Dear Mr Pillai,

Thank you for choosing The Clarke Quay Residences. We are pleased to confirm your booking.

Booking reference: CQR-48217
Room: Deluxe River View, 1 King bed
Check-in: Wednesday 3 December, from 3pm
Check-out: Saturday 6 December, by 12pm
Guests: 2 adults
Rate: SGD 268 per night, inclusive of breakfast, excluding taxes and service charge
Cancellation: free cancellation until 48 hours before arrival

Our concierge can arrange airport transfer at SGD 55 per way, just reply to this email with your flight details and we will do the needful.

Kindly note the Clarke Quay MRT exit nearest to us is Exit E, about 4 minutes on foot.

Warm regards,
Felicia Lim
Reservations`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Weekly cafe order to a supplier; quantities and nothing under SPEC §5.`,
    industry: 'cafe', variant: 'NZ',
    from: { name: 'Kat', address: 'kat@littleharbourcafe.example' },
    to: [{ name: 'Orders', address: 'orders@southlandproduce.test' }],
    subject: `Order for Tues delivery`,
    body: `Kia ora team,

Same as usual with a few tweaks please:

- Mesclun 3 x 1kg
- Spinach 2 x 1kg
- Avocados 2 trays (ready to eat please, last lot were rock hard)
- Tomatoes 1 box
- Lemons 1 box
- Mushrooms 4kg
- Red onions 1 bag
- Fresh herbs: basil x 6, coriander x 6, parsley x 4
- Sourdough from Pita's: 12 loaves
- Oat milk 2 cases

Can the driver come round the back this week, the front's dug up for the water main.

Ngā mihi,
Kat`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Fabrication shop quote to a customer: a customer-facing price and lead time stated as facts (SPEC §5.5 does not flag), nothing else under §5.`,
    industry: 'metal fabrication', variant: 'US',
    from: { name: 'Tony Barasso', address: 'tony@barassofab.example' },
    to: [{ name: 'Kyle Whitman', address: 'kyle@whitmanbuilders.example' }],
    subject: `Quote - 24 brackets, 3/8 plate`,
    body: `Kyle,

Quote for the brackets per your sketch:

24 x brackets, 3/8" A36 plate, laser cut, formed, two 9/16" holes, hot dip galvanized: $1,860.00
Delivery to the Oakridge site: $120.00
Total: $1,980.00, net 30

Lead time is 10 working days from your go-ahead, galvanizing is what takes the time. If you need them faster we can do powder coat instead and have them to you in 5 days, same price.

Let me know.

Tony
Barasso Fabrication`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Soil lab results summary and advice to a farmer; technical data, nothing under SPEC §5.`,
    industry: 'agricultural laboratory', variant: 'AU',
    from: { name: 'Dr Lena Hartigan', address: 'lena.hartigan@riverinasoillab.example' },
    to: [{ name: 'Pete Castellano', address: 'castellano.farms@bigpond-mail.test' }],
    subject: `Soil results - Paddocks 3, 7 and the river flat`,
    body: `Hi Pete,

Results are in the portal but here's the short version.

Paddock 3: pH (CaCl2) 4.9, which is low for canola. Colwell P 22, fine. Recommend 2.5 t/ha lime before sowing.
Paddock 7: pH 5.6, P 18, K a bit low at 110. Would add some potash with the starter.
River flat: pH 6.2, organic carbon 2.1%, all good, nothing needed beyond your normal program.

Sulfur was marginal across all three; worth using a sulfate-containing fertiliser rather than straight MAP this year.

Happy to go through it on the phone, I'm in the lab Tuesday and Wednesday.

Regards,
Lena`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Haulier confirming a delivery slot; a consignment reference is a tracking-type number (SPEC §5.1 does not flag), nothing else under §5.`,
    industry: 'haulage', variant: 'UK',
    from: { name: 'Transport Desk', address: 'transport@carrickhaulage.example' },
    to: [{ name: 'Goods In', address: 'goodsin@mortonpackaging.test' }],
    subject: `Delivery Weds 29th - 4 pallets - ref CH/5531`,
    body: `Morning,

Booked in for Wednesday 29th, AM slot (8-12). Four pallets, 1.1t total, needs a tail lift so our 18-tonner will do it. Driver will ring 30 mins before.

Please make sure the bay is clear as last time he waited 50 minutes.

Thanks
Carrick Haulage transport desk`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Letting agent arranging a gas safety check with a tenant; routine access logistics (SPEC §5.1 does not flag the word access in ordinary logistics).`,
    industry: 'letting agent', variant: 'UK',
    from: { name: 'Hollis & Grey Lettings', address: 'maintenance@hollisgrey.example' },
    to: [{ name: 'Amira Haddad', address: 'amira.haddad@quickmail.test' }],
    subject: `Annual gas safety check - 12 Tanner Street`,
    body: `Dear Amira,

The annual gas safety inspection for 12 Tanner Street is due. Our engineer (Gasline Services) can attend on Tuesday 4 November between 1pm and 5pm.

Please reply to confirm someone over 18 will be at home, or suggest another weekday. The check takes about 45 minutes and the engineer needs access to the boiler and the hob.

If we don't hear back by Friday we'll offer the slot and try again next week.

Kind regards,
Tom
Maintenance Team, Hollis & Grey`,
  },
  {
    category: 'none', expect: 'pass',
    why: `IT support update about a maintenance window and a completed password reset; password talk without a password (SPEC §5.1 does not flag).`,
    industry: 'IT support provider', variant: 'US',
    from: { name: 'Helpdesk', address: 'helpdesk@bluepinetech.example' },
    to: [{ name: 'Dana Kowalski', address: 'dana@ridgeviewdental.test' }],
    subject: `[Ticket 20417] Reset done + Saturday maintenance`,
    body: `Hi Dana,

Your account's been reset and you should have the temporary sign-in link in a separate email from the portal; it expires in 2 hours. It'll make you choose a new one when you first log in.

Separate thing: we're patching your server this Saturday between 10 PM and midnight. Expect the practice software to be unavailable for roughly 30 minutes somewhere in that window. Nothing you need to do, but please make sure everyone has logged out before leaving Friday.

Thanks,
Omar
Blue Pine Technology Helpdesk`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Freelance designer sending a feedback round to a client; creative notes and a stated fee, nothing under SPEC §5.`,
    industry: 'freelance graphic designer', variant: 'CA',
    from: { name: 'Maya Tremblay', address: 'maya@mayatremblaydesign.example' },
    to: [{ name: 'Jordan Ellis', address: 'jordan@northshorekombucha.example' }],
    subject: `Logo round 2 - three directions`,
    body: `Hey Jordan,

Round 2 is in the shared folder (Logo > Round 2). Three directions:

A. The wave mark, tightened up, with the wordmark in the heavier weight. This is my favourite for the cans.
B. The monogram. Works great small, a bit cold at large sizes.
C. The hand-drawn one you liked from round 1, cleaned up. Honestly I think it fights with the label illustration but I wanted you to see it finished.

Have a look with the team and send me notes by Thursday if you can. We've got one more revision round in the quote, after that it's $85/hr as we discussed.

Also, colour: the teal shifted a bit when I checked the print proof, so I've pulled it slightly greener. Let me know if you hate it.

Maya`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Contractor's weekly progress report to a council officer; list-heavy, programme and quantities only, nothing under SPEC §5.`,
    industry: 'highways contractor', variant: 'UK',
    from: { name: 'Gareth Pryce', address: 'g.pryce@brynmorcivils.example' },
    to: [{ name: 'Louise Attwood', address: 'louise.attwood@eastvalecouncil.test' }],
    cc: [{ name: 'Highways Inbox', address: 'highways@eastvalecouncil.test' }],
    subject: `Weekly report wk 43 - A4119 footway scheme`,
    body: `Louise,

Weekly report for week 43.

Progress
- Section 2 (Station Rd to the chapel): kerbing complete, 160m of base laid, surface course Mon/Tues next week weather permitting.
- Section 3: utilities trial holes done. Water main is 200mm shallower than the records show at ch. 410, we've flagged it to the water company, no impact on programme yet.
- Tactile paving at the two crossings installed and inspected.

Programme
- Still on for completion 21 November. The two days lost to rain in wk 42 recovered by working the Saturday.

Traffic management
- Lane closure extended 50m to cover the chapel entrance; signage checked daily.
- One complaint via your customer services about the bus stop relocation, we've spoken to the resident.

Next week
- Surface course Section 2, start kerbing Section 3, lining order placed.

Site diary and photos are in the shared folder as usual.

Regards
Gareth
Site Agent, Brynmor Civils`,
  },
  {
    category: 'none', expect: 'pass',
    why: `One-line plumber update to a homeowner; nothing under SPEC §5.`,
    industry: 'plumber', variant: 'AU',
    from: { name: 'Shane', address: 'shane@shanesplumbing.example' },
    to: [{ name: 'Linda Abraham', address: 'lindaabraham@hotmail-au.test' }],
    subject: `Running late`,
    body: `Hi Linda, stuck on a burst in Kingswood, be with you about 20 mins later than said, sorry. Shane`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Electrician sending an invoice note with customer-facing amount and payment terms (SPEC §5.5 does not flag); bank name alone is not a bank account (§5.2).`,
    industry: 'electrician', variant: 'UK',
    from: { name: 'Mark Ferris', address: 'mark@ferriselectrical.example' },
    to: [{ name: 'Rachel Dunne', address: 'racheldunne@outlookmail.test' }],
    subject: `Invoice 1187 - consumer unit`,
    body: `Hi Rachel

Thanks for having me yesterday. Invoice 1187 is attached to the portal link below, £640 inc VAT as quoted, payment within 14 days please by bank transfer (details on the invoice, it's our usual Barclays account) or card over the phone.

The certificate for the new board will come through from the scheme in about a week, I'll forward it when it lands. Keep it with the house paperwork.

Cheers
Mark`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Landscaper's seasonal schedule to a homeowners' association board member; nothing under SPEC §5.`,
    industry: 'landscaping', variant: 'US',
    from: { name: 'Greenway Grounds', address: 'office@greenwaygrounds.example' },
    to: [{ name: 'Pat Delgado', address: 'pdelgado@oakhollowhoa.example' }],
    subject: `Fall cleanup schedule - Oak Hollow`,
    body: `Hi Pat,

Here's the fall schedule for Oak Hollow as discussed at the board meeting:

Week of Nov 3: leaf removal common areas, pond edge trimmed back
Week of Nov 10: leaf removal phase 2, beds cut back, mulch top-up at the entrance
Week of Nov 17: irrigation blowout and shutoff (we'll need the pump house unlocked, Tuesday morning)
Week of Dec 1: final leaf pass, holiday lights up at the sign if the board wants them again

Crews are on site 7:30 to 3:30, we'll keep the blowers away from the townhomes before 9 like last year.

Let me know about the lights so I can order the timers.

Thanks,
Rick
Greenway Grounds`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Accountant's year-end document checklist to a client; routine request, nothing under SPEC §5.`,
    industry: 'accountancy', variant: 'UK',
    from: { name: 'Priti Raval', address: 'priti@ravalandco.example' },
    to: [{ name: 'Simon Blake', address: 'simon@blakejoinery.test' }],
    subject: `Year end to 31 Oct - what we need`,
    body: `Hi Simon,

Year end is nearly here so here's the usual list. No rush on all of it, but the bank statements and sales invoices first please so we can get started.

1. Bank statements for all business accounts to 31 October (PDFs from online banking are fine)
2. Sales invoices raised in the year, or just make sure the software is up to date
3. Purchase invoices and receipts not yet in the software
4. Any new asset purchases over £500 (the van?)
5. Mileage log if you want to claim mileage
6. Stock count at 31 October, rough figure is fine for a business your size
7. Details of any loans or finance taken out this year

Also a reminder that your VAT return for the quarter is due 7 December.

Thanks,
Priti`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Conveyancer updating a client on searches and an exchange date; the client's own transaction stated as business (SPEC §5.4 does not flag).`,
    industry: 'law firm (conveyancing)', variant: 'UK',
    from: { name: 'Fiona Carrick', address: 'fcarrick@weldonsolicitors.example' },
    to: [{ name: 'Mr D Osei', address: 'daniel.osei@ymail-uk.test' }],
    subject: `14 Orchard Close - searches back`,
    body: `Dear Mr Osei,

The local authority and drainage searches have come back and there is nothing of concern. The environmental search flagged a low flood risk from surface water, which is common in that part of town and shouldn't affect your mortgage offer; I have attached the relevant page to the portal for you to read.

I have raised a few additional enquiries with the seller's solicitors about the extension's building regulations sign-off. Once those are answered we can look at exchanging. Realistically that is the week of 10 November, with completion two weeks later if that still suits you and the seller.

Please let me know if you have any questions.

Kind regards,
Fiona Carrick
Weldon Solicitors`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Estate agent's open home feedback and offer summary to the vendor; offers actually made and stated as facts (SPEC §5.6 and §5.5 do not flag).`,
    industry: 'real estate agent', variant: 'AU',
    from: { name: 'Tash Moreno', address: 'tash@harbourlinerealty.example' },
    to: [{ name: 'Brian and Sue Caldwell', address: 'caldwells@iinetmail.test' }],
    subject: `Open home feedback - 42 Jacaranda Ave`,
    body: `Hi Brian and Sue,

Good open on Saturday, 14 groups through, which is up on last week. Feedback:

- Most loved the kitchen and the deck.
- Three groups commented on the carpet in the back bedroom.
- Two asked about the age of the hot water system (I said about 8 years, let me know if that's wrong).

Offers so far:
- Buyer A: $1,185,000, 30-day settlement, subject to finance
- Buyer B: $1,160,000, 45-day settlement, unconditional

Both are still keen. Buyer A's broker says finance should be sorted by Wednesday. I'd suggest we hold off responding until then and I'll call you Thursday to talk it through.

Next open is Saturday 10.30-11.00.

Cheers,
Tash`,
  },
  {
    category: 'none', expect: 'pass',
    why: `One-line groomer reminder; nothing under SPEC §5.`,
    industry: 'dog groomer', variant: 'UK',
    from: { name: 'Paws & Claws', address: 'hello@pawsandclawsgrooming.example' },
    to: [{ name: 'Gemma', address: 'gemma.tate@skymail.test' }],
    subject: `Tomorrow 10am`,
    body: `Hi Gemma, just a reminder Bruno's in at 10 tomorrow for his full groom. See you then! Lou x`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Physio clinic appointment reminder to a patient; logistics only, no condition or treatment described (SPEC §5.4).`,
    industry: 'physiotherapy clinic', variant: 'NZ',
    from: { name: 'Bayview Physio', address: 'admin@bayviewphysio.example' },
    to: [{ name: 'Hemi Walker', address: 'hemi.walker@xtramail.test' }],
    subject: `Reminder: Wed 29 Oct 4.15pm`,
    body: `Kia ora Hemi,

Just a reminder you're booked in Wednesday 29 October at 4.15pm with Sarah. Wear something you can move in, and bring your ACC number if you have it handy.

If you need to change the time just reply or give us a call.

Cheers,
Bayview Physio`,
  },
  {
    category: 'none', expect: 'pass',
    why: `GP surgery flu clinic notice to a patient; general clinic dates, no personal health detail (SPEC §5.4).`,
    industry: 'GP surgery', variant: 'UK',
    from: { name: 'Riverside Medical Practice', address: 'noreply@riversidemedical.example' },
    to: [{ name: 'Mr Alan Broome', address: 'alan.broome@talkmail.test' }],
    subject: `Flu clinic dates - book now`,
    body: `Dear Mr Broome,

Our autumn flu clinics are running on the following dates:

Saturday 1 November, 8.30am-12.30pm
Saturday 15 November, 8.30am-12.30pm
Weekday appointments are also available.

You can book online through the practice website, via the app, or by phoning the surgery after 10am. Please wear a short-sleeved top.

If you have already had your flu vaccination elsewhere this year, please let us know so we can update your record.

Riverside Medical Practice`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Pharmacy telling a customer an order is ready; close call on SPEC §5.4 noted in README, labelled pass as an everyday notice naming no condition or medicine.`,
    industry: 'pharmacy', variant: 'US',
    from: { name: 'Corner Drug', address: 'pickup@cornerdrugrx.example' },
    to: [{ name: 'Teresa Nguyen', address: 'tnguyen88@mailhub.test' }],
    subject: `Ready for pickup`,
    body: `Hi Teresa, your order is ready for pickup at Corner Drug, 5th and Elm. We're open till 9 tonight and 8-6 Saturday. Reply STOP to end these messages.`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Optician telling a customer their glasses are ready; nothing under SPEC §5.`,
    industry: 'optician', variant: 'UK',
    from: { name: 'Hartley Opticians', address: 'reception@hartleyopticians.example' },
    to: [{ name: 'Mrs J Sanderson', address: 'jsanderson@virginmail.test' }],
    subject: `Your glasses are ready to collect`,
    body: `Dear Mrs Sanderson,

Your new glasses have arrived and are ready to collect. Pop in any time we're open (Mon-Sat 9-5.30, Thursday till 7) and we'll fit and adjust them for you; no appointment needed, it takes about 10 minutes.

Please bring your old pair with you if you'd like us to put the new lenses in the spare frame as discussed.

Kind regards,
Hartley Opticians`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Driving instructor rescheduling a lesson with a learner; nothing under SPEC §5.`,
    industry: 'driving school', variant: 'IE',
    from: { name: 'Declan Murray', address: 'declan@murraydrivingschool.example' },
    to: [{ name: 'Sinead O Connor', address: 'sineadoc2006@mailbox.test' }],
    subject: `Thursday lesson`,
    body: `Hi Sinead,

Can we move Thursday to 5 instead of 4? Test centre has moved my 3 o'clock. We'll do roundabouts and the hill start on Mill Road again, you were nearly there last week.

Text me if 5 doesn't work.

Declan`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Music teacher's recital note to a parent; nothing under SPEC §5.`,
    industry: 'music teacher', variant: 'US',
    from: { name: 'Ms. Caroline Fitch', address: 'caroline@fitchpianostudio.example' },
    to: [{ name: 'Ben and Lisa Harper', address: 'theharpers@familymail.test' }],
    subject: `Winter recital - Dec 14`,
    body: `Hi Ben and Lisa,

The winter recital is Sunday, December 14 at 3 PM at the Methodist church on Grant Avenue (same place as last year). Students should arrive by 2:30 for a quick run-through.

Ellie will be playing the Clementi sonatina (1st movement) and the Burgmüller piece she's been working on. She's doing great, the left hand in the Clementi finally clicked last week.

Dress is nice but comfortable. There will be cookies.

Please let me know by Dec 1 if she can't make it so I can adjust the program.

Caroline`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Gym membership renewal notice; a price and a debit date stated as facts (SPEC §5.5 does not flag), no account details (§5.2).`,
    industry: 'gym', variant: 'AU',
    from: { name: 'Ironbark Fitness', address: 'members@ironbarkfitness.example' },
    to: [{ name: 'Jacob Lee', address: 'jacob.lee91@gmailbox.test' }],
    subject: `Your membership renews 1 Nov`,
    body: `Hi Jacob,

Heads up that your 12-month membership renews on 1 November. The new rate is $17.90 a week, debited fortnightly on the Thursday as now. Nothing to do if you're happy to keep going.

If you want to switch to the off-peak plan or pause for a bit, reply before the 30th and we'll sort it out.

New timetable starts the same week: more 6am classes and the Saturday boxing is back.

Cheers,
The Ironbark team`,
  },
  // ---- stops ----
  {
    category: 'secrets', expect: 'stop',
    why: `SPEC §5.1: "The gate code is 4471#, same as last year." gives a premises gate code that is actually given.`,
    industry: 'self storage', variant: 'US', placement: 'body',
    deciding: `The gate code is 4471#, same as last year.`,
    from: { name: 'Carly at StorSafe', address: 'carly@storsafeunits.example' },
    to: [{ name: 'Devon Marsh', address: 'devon.marsh@mailhub.test' }],
    subject: `Your unit renewal`,
    body: `Hi Devon,

Thanks for renewing on unit B14. Your new term runs through October next year and the rate stays the same.

The gate code is 4471#, same as last year. Office hours are 9-5 weekdays, the yard itself is open 6am to 10pm.

Let us know if you need a bigger unit at any point, we've got a few 10x15s opening up in November.

Carly`,
  },
  {
    category: 'personal', expect: 'stop',
    why: `SPEC §5.4: "Priya's off because she's starting chemo next week." discloses an identifiable person's medical treatment.`,
    industry: 'web agency', variant: 'UK', placement: 'body',
    deciding: `Priya's off because she's starting chemo next week.`,
    from: { name: 'Josh Whitaker', address: 'josh@kiteandcompass.example' },
    to: [{ name: 'Sandra Boyle', address: 'sandra@boylefinancial.test' }],
    subject: `Re: site launch timing`,
    body: `Hi Sandra,

Sorry for the slow reply. We're going to need to push the launch by a fortnight. Priya's off because she's starting chemo next week. I'm picking up her projects and I want to do a proper handover rather than rush your site out.

New target is 21 November. The staging link still works if you want to keep reviewing content in the meantime.

Josh`,
  },
  {
    category: 'economics', expect: 'stop',
    why: `SPEC §5.5: "We're carrying about 9% contingency on the groundworks, so there's fat in there." reveals the sender's own contingency in its pricing.`,
    industry: 'building contractor', variant: 'UK', placement: 'body',
    deciding: `We're carrying about 9% contingency on the groundworks, so there's fat in there.`,
    from: { name: 'Neil Patterson', address: 'neil@pattersonbuild.example' },
    to: [{ name: 'Owen Rhys', address: 'owen@rhysarchitecture.test' }],
    subject: `Re: client asking about the extra drainage`,
    body: `Owen,

Tell them not to worry about the extra drainage run yet. We're carrying about 9% contingency on the groundworks, so there's fat in there. If the ground turns out as the survey says we won't need to raise a variation at all.

I'll have the revised programme to you Friday.

Neil`,
  },
  {
    category: 'negotiation', expect: 'stop',
    why: `SPEC §5.6: "Between us, we can go another 5% if they push." tells the agent how far the sender is willing to move on price.`,
    industry: 'residential property sale', variant: 'AU', placement: 'body',
    deciding: `Between us, we can go another 5% if they push.`,
    from: { name: 'Michelle Tran', address: 'michelle.tran@optusmail.example' },
    to: [{ name: 'Danny Kostas', address: 'danny@baysiderealestate.test' }],
    subject: `Re: offer on the unit`,
    body: `Hi Danny,

Thanks for sending through the offer. Go back to them at the asking price for now. Between us, we can go another 5% if they push. We just want it done before Christmas.

Michelle`,
  },
  {
    category: 'remark', expect: 'stop',
    why: `SPEC §5.7: "Their site manager is a complete clown." is a disparaging remark about a person.`,
    industry: 'scaffolding', variant: 'UK', placement: 'body',
    deciding: `Their site manager is a complete clown.`,
    from: { name: 'Darren Cole', address: 'darren@colescaffolding.example' },
    to: [{ name: 'Jim Hadley', address: 'jim@hadleyroofing.test' }],
    subject: `Re: Westgate job`,
    body: `Jim

We can get you up on Monday but only if the lift's turned up by then. Their site manager is a complete clown. He's cancelled the lift twice and then rung me asking why we're not on site.

I'll confirm Friday afternoon once I've heard.

Darren`,
  },
  {
    category: 'secrets', expect: 'stop',
    why: `SPEC §5.1: "Wi-Fi for the hall is HallGuest / tuesday2026 if you need it." gives a Wi-Fi code that is actually given, in the quoted history.`,
    industry: 'community hall hire', variant: 'UK', placement: 'quoted',
    deciding: `Wi-Fi for the hall is HallGuest / tuesday2026 if you need it.`,
    from: { name: 'Beth Carey', address: 'beth.carey@yogaflowstudio.example' },
    to: [{ name: 'Aled Rowlands', address: 'aled@rowlandssound.test' }],
    subject: `Fwd: Saturday workshop - hall details`,
    body: `Hi Aled,

Forwarding what the hall secretary sent me so you've got the details for setting up the speakers on Saturday. Doors open to us from 8.

Thanks again for doing this.
Beth

> Hi Beth,
> You're all booked for Saturday 8am to 1pm. Chairs are stacked in the side room, please put them back the same way.
> Wi-Fi for the hall is HallGuest / tuesday2026 if you need it.
> Bins go in the yard, not the kitchen.
> Thanks, Margaret`,
  },
  {
    category: 'personal', expect: 'stop',
    why: `SPEC §5.4: "Re: cover for Dean while he's in rehab" discloses an identifiable person's treatment in the subject line.`,
    industry: 'kitchen fitting', variant: 'UK', placement: 'subject',
    deciding: `Re: cover for Dean while he's in rehab`,
    from: { name: 'Carl Bishop', address: 'carl@bishopkitchens.example' },
    to: [{ name: 'Stuart Grange', address: 'stuart@grangeplumbingheating.test' }],
    subject: `Re: cover for Dean while he's in rehab`,
    body: `Stu,

Yes please, if you can take the two Thursdays in November that'd be a big help. Both are second-fix on the Ashworth job, you've seen the drawings.

Usual day rate, invoice me at the end of the month.

Carl`,
  },
];
