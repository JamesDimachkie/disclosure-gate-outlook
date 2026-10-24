// everyday2 batch 06. Hand-written literals; see ../serialize.mjs for the schema wrapper.
export default [
  {
    category: 'none', expect: 'pass',
    why: `Egg producer to a shop about supply and prices; customer-facing wholesale prices (SPEC §5.5 does not flag).`,
    industry: 'egg producer', variant: 'UK',
    from: { name: 'Meadowbrook Eggs', address: 'orders@meadowbrookeggs.example' },
    to: [{ name: 'Village Stores', address: 'shop@thorntonvillagestores.test' }],
    subject: `Eggs - price from December + Christmas week`,
    body: `Hi Barbara,

Two things. From 1 December the trays go up by 20p to £2.90 for a dozen large free range, feed's gone up again I'm afraid. Mediums stay at £2.40.

Christmas week: we'll deliver Monday 22nd and Wednesday 24th, nothing between then and the 29th. If you want extra for the 24th let me know by the 17th.

Thanks,
Jim`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Agronomist's field recommendation to a grower; technical advice, nothing under SPEC §5.`,
    industry: 'agronomist', variant: 'UK',
    from: { name: 'Will Prentice', address: 'will.prentice@fieldwiseagronomy.example' },
    to: [{ name: 'Richard Hobbs', address: 'hobbs.farming@btmail.test' }],
    subject: `Winter wheat - Long Meadow and Top Field`,
    body: `Richard,

Walked Long Meadow and Top Field this morning.

Long Meadow: good establishment, some blackgrass coming in the headland by the road. I'd go with the pre-em plus a follow-up in 2 to 3 weeks if we get a dry window. Slugs are about, pellet the heavier bit at the bottom.
Top Field: patchy emergence on the clay cap, I think it'll fill in. Hold off on anything there for now.

Both will want the autumn manganese when the leaves are up a bit more.

I'll send the recs through the system today.

Will`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Seed merchant confirming an order; nothing under SPEC §5.`,
    industry: 'seed merchant', variant: 'US',
    from: { name: 'Prairie Seed Co.', address: 'orders@prairieseedco.example' },
    to: [{ name: 'Walt Jensen', address: 'jensenfarms@ruralnet.test' }],
    subject: `Order confirmation - spring seed`,
    body: `Walt,

Your order is in:

- 120 units corn, hybrid 4512, treated
- 80 units soybean, 2.4 maturity
- 20 bags alfalfa, 50 lb

Delivery to the farm the week of March 9. Early pay discount applies if paid by January 15, invoice to follow with both numbers.

Thanks for your business,
Deb
Prairie Seed Co.`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Feed merchant delivery note to a smallholder; nothing under SPEC §5.`,
    industry: 'animal feed merchant', variant: 'UK',
    from: { name: 'Dales Country Supplies', address: 'sales@dalescountrysupplies.example' },
    to: [{ name: 'Mrs K Hornby', address: 'khornby@homemail.example' }],
    subject: `Delivery Thursday`,
    body: `Hi Mrs Hornby, your 10 bags of layers pellets, 4 of goat mix and the 2 bales of shavings will be on Thursday's round, mid-morning. Driver will leave them in the barn as usual if you're out. Total £168 on account. Thanks, Dales`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Sawmill to a joinery customer about timber availability; customer-facing price (SPEC §5.5 does not flag).`,
    industry: 'sawmill', variant: 'UK',
    from: { name: 'Beck Sawmill', address: 'office@becksawmill.example' },
    to: [{ name: 'Simon Blake', address: 'simon@blakejoinery.test' }],
    subject: `Re: oak boards, 50mm`,
    body: `Simon,

We've got about 3 cubic metres of air-dried English oak at 50mm, mixed widths 200-350, 2.4 to 3m lengths, felled 2022. £1,850 per cube plus VAT, or come and pick your boards and we'll price it by the board.

Kiln-dried is 6 weeks away if you need it drier for the internal work.

Pete`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Firewood supplier to a customer; nothing under SPEC §5.`,
    industry: 'firewood supplier', variant: 'IE',
    from: { name: 'Donal', address: 'donal@wicklowfirewood.example' },
    to: [{ name: 'Grainne Hughes', address: 'grainne.hughes@eircommail.test' }],
    subject: `Load for Saturday`,
    body: `Hi Grainne,

I can get the load of kiln-dried ash to you Saturday morning, about 11. It's the big bulk bag, €160, tipped where you had it last year by the shed. Cash or Revolut on the day is grand.

Donal`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Heating oil supplier price notice; nothing under SPEC §5.`,
    industry: 'heating oil supplier', variant: 'UK',
    from: { name: 'Border Fuels', address: 'orders@borderfuels.example' },
    to: [{ name: 'Mr A Nicholson', address: 'a.nicholson@talkmail.test' }],
    subject: `Kerosene - this week's price and your top-up`,
    body: `Dear Mr Nicholson,

This week's price for kerosene is 58.9p per litre plus VAT for orders of 500 litres or more, delivered within 5 working days. Prices usually rise through November so if your tank is below half it's worth ordering now.

Your last delivery was 900 litres in March. Reply with the quantity you'd like and we'll book it in.

Border Fuels`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Heat pump installer sending a survey summary and quote; customer-facing price and grant (SPEC §5.5 does not flag).`,
    industry: 'heat pump installer', variant: 'UK',
    from: { name: 'Nick Hartman', address: 'nick@evergreenheatpumps.example' },
    to: [{ name: 'Dr and Mrs Patel', address: 'patels.home@gmailbox.test' }],
    subject: `Heat pump survey - findings and quote`,
    body: `Dear Dr and Mrs Patel,

Thank you for your time on Tuesday. Here's a summary of the survey and our quote.

Findings
- Heat loss calculated at 7.8kW at design temperature, so an 8kW monobloc unit is right for the house
- 6 of your 11 radiators need upsizing to run at the lower flow temperature; the rest are fine
- Hot water: a 210 litre cylinder in the airing cupboard replaces the combi
- Outdoor unit location: side of the garage, 1.5m from the boundary, well within the noise limits

Quote
- Heat pump, cylinder, 6 new radiators, controls, installation and commissioning: £13,400
- Less the government grant, which we claim on your behalf: £7,500
- Your price: £5,900 including VAT at 0%

Installation takes 4 days. Our next available slot is the week of 8 December. The quote is valid for 60 days.

I've attached the full report in the portal. Happy to come back and go through it.

Kind regards,
Nick`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Energy assessor arranging an EPC visit; nothing under SPEC §5.`,
    industry: 'energy assessor', variant: 'UK',
    from: { name: 'Clare Winters', address: 'clare@wintersenergyassessments.example' },
    to: [{ name: 'Lettings', address: 'lettings@pinnacleproperty.test' }],
    subject: `EPC - 7 Mill Court - Monday 11am`,
    body: `Hi Sarah,

Confirming the EPC at 7 Mill Court for Monday at 11am. Takes about 45 minutes; I'll need access to the loft hatch and the boiler. Tenant's aware per your note.

Certificate lodged within 48 hours, invoice to you as usual.

Clare`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Student lettings agent to a group of tenants about inspections; nothing under SPEC §5.`,
    industry: 'student lettings', variant: 'UK',
    from: { name: 'Campus Lets', address: 'inspections@campusletsleeds.example' },
    to: [{ name: 'Tenants - 14 Brudenell Rd', address: 'brudenell14@groups-mail.test', kind: 'group' }],
    subject: `Property inspection - Weds 12 Nov, 10am-1pm`,
    body: `Hi all,

Your first inspection of the year is on Wednesday 12 November between 10am and 1pm. You don't need to be in, we'll use the office keys, but you're welcome to be.

We're checking for anything that needs repairing and general condition. Please make sure the smoke alarms are accessible and report anything broken through the portal beforehand so we can look at it on the day.

Bins: a reminder that the council will fine the house, not us, for bins left out on the wrong day.

Campus Lets`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Serviced apartments to a corporate booker; customer-facing rates (SPEC §5.5 does not flag).`,
    industry: 'serviced apartments', variant: 'UK',
    from: { name: 'Quayside Apartments', address: 'corporate@quaysideapartments.example' },
    to: [{ name: 'Travel Desk', address: 'travel@aldermanconsulting.test' }],
    subject: `Re: 2 apartments, 3 to 28 November`,
    body: `Dear Mark,

We can accommodate both consultants from 3 to 28 November in one-bedroom apartments on the second floor. Corporate rate for stays over 21 nights is £118 per night including weekly housekeeping, utilities and wifi. Parking is £8 per night if required.

Check-in from 3pm on the 3rd; please send the names and arrival times when you have them. Invoicing fortnightly to your accounts address as before.

Kind regards,
Quayside Apartments`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Coworking space to a member about a desk upgrade and events; nothing under SPEC §5.`,
    industry: 'coworking space', variant: 'CA',
    from: { name: 'The Loft Coworking', address: 'hello@theloftcowork.example' },
    to: [{ name: 'Sam Okafor', address: 'sam@okaforconsulting.test' }],
    subject: `Dedicated desk available + November events`,
    body: `Hey Sam,

A dedicated desk by the window just opened up (the one you had your eye on). It's $395/month, you can move over from the 1st if you want it. Let me know by Friday, there's a short list.

November at the Loft:
- Nov 6: Lunch and learn, bookkeeping basics for freelancers
- Nov 13: Members' happy hour, 5 PM
- Nov 20: Pitch practice night

The espresso machine is finally fixed. Washrooms on 2 are being renovated next week so use the ones on 3.

Cheers,
Priya`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Shredding company confirming a collection; nothing under SPEC §5.`,
    industry: 'document shredding', variant: 'UK',
    from: { name: 'SecureShred', address: 'bookings@secureshredservices.example' },
    to: [{ name: 'Office Manager', address: 'office@hartmanaccountants.test' }],
    subject: `Collection Thursday - 6 sacks`,
    body: `Hi,

Confirming collection of 6 sacks for on-site shredding on Thursday between 9 and 11. The truck will park in the loading bay as before. A certificate of destruction will be emailed to you the same day.

If you have more than 6 sacks on the day that's fine, we'll just adjust the invoice.

SecureShred bookings`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Scrap metal yard to a tradesman about prices; customer-facing prices (SPEC §5.5 does not flag).`,
    industry: 'scrap metal yard', variant: 'UK',
    from: { name: 'Riverside Metals', address: 'yard@riversidemetals.example' },
    to: [{ name: 'Kev', address: 'kevplumb@quickmail.test' }],
    subject: `Prices this week`,
    body: `Kev,

Prices this week: bright copper 7.20/kg, copper tube 6.60, brass 4.10, lead 1.45, mixed cable 2.10. Bring your trade waste licence and ID as usual, payment by transfer same day.

Yard's open till 4.30 Saturday.

Riverside`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Phone repair shop one-liner; nothing under SPEC §5.`,
    industry: 'phone repair shop', variant: 'UK',
    from: { name: 'FixMyFone', address: 'shop@fixmyfonehull.example' },
    to: [{ name: 'Jade', address: 'jade.winter@skymail.test' }],
    subject: `Your phone`,
    body: `Hi Jade, screen's done, £79 as quoted, ready whenever. Open till 6.`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Computer repair shop diagnosis to a customer; talk of resetting a login without any password given (SPEC §5.1 does not flag).`,
    industry: 'computer repair shop', variant: 'US',
    from: { name: 'Byte Me Computer Repair', address: 'help@bytemecomputerrepair.example' },
    to: [{ name: 'Gloria Fenton', address: 'gfenton@mailhub.test' }],
    subject: `Your laptop - diagnosis`,
    body: `Hi Gloria,

We've had a look at the laptop. The hard drive is failing, which explains the slowness and the freezing. Your files are still readable, so the plan would be:

1. Copy everything off to a new SSD ($120 for the drive, $60 labor)
2. Reinstall Windows and your programs
3. You'll need to sign back in to your email and your Microsoft account; have your login details handy when you pick it up and we'll walk you through it in the shop

Total $180, ready Thursday. If you'd rather not repair it we charge $40 for the diagnosis and copying your files to a USB stick.

Let us know how you'd like to proceed.

Byte Me Computer Repair`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Web host notifying a customer of a renewal; nothing under SPEC §5.`,
    industry: 'web hosting', variant: 'UK',
    from: { name: 'Hostwell', address: 'billing@hostwellhosting.example' },
    to: [{ name: 'Paula Webb', address: 'paula@webbfloristry.test' }],
    subject: `Your hosting renews on 14 November`,
    body: `Hi Paula,

Your Business hosting plan and the domain renew on 14 November. The total is £94.80 including VAT and will be taken from the card on file unless you tell us otherwise.

Nothing else changes. If you'd like to move to the annual-pay discount or add the backup add-on, reply before the 14th.

Hostwell billing`,
  },
  {
    category: 'none', expect: 'pass',
    why: `SEO agency monthly report to a client; performance figures about the client's own site, nothing under SPEC §5.`,
    industry: 'SEO agency', variant: 'AU',
    from: { name: 'Rank Higher Digital', address: 'reports@rankhigherdigital.example' },
    to: [{ name: 'Ben Cassidy', address: 'ben@cassidyplumbingsydney.test' }],
    subject: `October report - Cassidy Plumbing`,
    body: `Hi Ben,

October numbers are in the dashboard; headlines:

- Organic visits: 1,840, up 12% on September
- Phone clicks from Google Business: 212, up 9%
- "emergency plumber inner west" moved from position 9 to 4
- 3 new reviews, all 5 star, nice work

For November we're building out the hot water system pages and chasing two local directory listings. The blocked-drains page needs a few photos from you if you can grab some on a job.

Call's booked for Tuesday 10am.

Cheers,
Alex`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Copywriter sending drafts to a client; a stated fee is a customer-facing price (SPEC §5.5 does not flag).`,
    industry: 'freelance copywriter', variant: 'UK',
    from: { name: 'Eleanor Vance', address: 'eleanor@vancewrites.example' },
    to: [{ name: 'Tariq Hussain', address: 'tariq@hussainopticians.test' }],
    subject: `Website copy - first drafts`,
    body: `Hi Tariq,

First drafts of the home, about and eye test pages are in the shared doc. A few notes:

- I've kept the tone friendly but not jokey, as we discussed. Tell me if it's too warm.
- The about page needs one fact from you: how long has the practice been on the high street? I've put 30 years as a placeholder.
- The eye test page has a short FAQ. Add any questions people actually ask you.

Comments in the doc are easiest. One round of revisions is included; further rounds are at my day rate of £400.

Eleanor`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Podcast producer to a guest about recording logistics; nothing under SPEC §5.`,
    industry: 'podcast production', variant: 'US',
    from: { name: 'Nate Robles', address: 'nate@signalboostpodcasts.example' },
    to: [{ name: 'Dr. Lena Ostrowski', address: 'lostrowski@greenfieldcollege.test' }],
    subject: `Recording Thursday - quick checklist`,
    body: `Hi Dr. Ostrowski,

Looking forward to Thursday at 2 PM Eastern. The link to the recording room is in the calendar invite. Quick checklist:

- Headphones (any kind) so we avoid echo
- A quiet room, ideally with soft furnishings
- Hardwired internet if you have it; wifi is fine if not
- Keep the phone on silent and not on the desk

We'll chat for 5 minutes first, then record for about 45. Nothing is live, so if you misspeak just pause and start the sentence again, we'll cut it.

Thanks again for making the time.

Nate`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Voice artist sending a quote with a quoted brief; customer-facing rate (SPEC §5.5 does not flag).`,
    industry: 'voice artist', variant: 'UK',
    from: { name: 'Amara Osei', address: 'amara@amaraoseivoice.example' },
    to: [{ name: 'Rosie', address: 'rosie@fieldnotesfilms.test' }],
    subject: `Re: VO for the charity explainer`,
    body: `Hi Rosie,

Love the script, happy to do it. For a 90-second online explainer, warm and conversational, my rate is £350 including one round of pickups, delivered as clean WAVs within 48 hours of script sign-off. Usage covers online and social, all territories, in perpetuity.

I can record Thursday afternoon if you're ready.

Amara

> Hi Amara, we're making a 90-second explainer for a hospice charity, script attached in the link. Could you quote for the voiceover? We'd want it by the 14th. Rosie`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Wedding planner's checklist to a couple; nothing under SPEC §5.`,
    industry: 'wedding planner', variant: 'UK',
    from: { name: 'Olivia Marsh', address: 'olivia@oliviamarshweddings.example' },
    to: [{ name: 'Hannah and Will', address: 'hannahandwill@outlookmail.test' }],
    subject: `Three weeks to go - your list`,
    body: `Hi both!

Three weeks. Here's what's on your list, everything else is on mine.

You
- Final numbers to me by Friday (I have 94 so far)
- Table plan: drop the last few names into the sheet
- Rings to Will's brother
- Marriage schedule collected from the registrar (Hannah, you said Tuesday)
- Playlist to the band, they've asked for the first dance track and the walk-in music
- Final payments: venue (due 1st), florist (due 7th). Band and photographer are on the day in envelopes, I'll bring the envelopes if you give me the cash.

Me
- Confirm all suppliers' arrival times this week
- Timeline to the venue and the registrar
- Hair and make-up schedule for the morning
- Umbrellas (just in case)

We'll do the final walk-through at the barn on the 9th at 4pm.

Breathe. It's going to be lovely.

Olivia`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Celebrant sending a ceremony draft note; nothing under SPEC §5.`,
    industry: 'celebrant', variant: 'AU',
    from: { name: 'Jenny Lake, Celebrant', address: 'jenny@jennylakecelebrant.example' },
    to: [{ name: 'Marnie and Luke', address: 'marnieandluke@gmailbox.test' }],
    subject: `Ceremony draft v2`,
    body: `Hi Marnie and Luke,

Draft 2 is in the link. I've tightened the story section, moved the ring exchange after the vows as you asked, and added the reading your sister chose. It runs about 22 minutes.

Have a read separately and then together, mark anything that doesn't sound like you. We'll finalise at our catch-up on the 12th.

The notice of intended marriage is lodged and all good.

Jenny`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Mobile bar company confirming an event; customer-facing price (SPEC §5.5 does not flag).`,
    industry: 'mobile bar hire', variant: 'UK',
    from: { name: 'The Tipsy Trailer', address: 'bookings@thetipsytrailer.example' },
    to: [{ name: 'Gemma Price', address: 'gemma.price21@homemail.example' }],
    subject: `Your 40th - Sat 22 Nov - confirmed`,
    body: `Hi Gemma,

All confirmed for Saturday 22 November at the village hall. We'll arrive at 5 to set up, bar open 7 till midnight, two staff.

Package: the cash bar option with your £300 tab for the first drinks as agreed. We bring glassware, ice, and the usual range of beers, wines, spirits and softs. Prosecco toast for 60 is included.

We need a 13-amp socket and access to a tap. Balance of the hire fee (£150) is due the week before.

Can't wait!
Jo and Sam`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Bouncy castle hire confirmation; nothing under SPEC §5.`,
    industry: 'bouncy castle hire', variant: 'UK',
    from: { name: 'Bounce About', address: 'hire@bounceaboutinflatables.example' },
    to: [{ name: 'Dean Fletcher', address: 'deanfletch@skymail.test' }],
    subject: `Sat 1 Nov - castle + slide`,
    body: `Hi Dean,

Booked: the 15x15 castle with the slide for Saturday 1 November, delivered and set up by 10am, collected at 5pm. £120, pay the driver on the day.

We need a flat grass area about 20ft x 20ft, and a power socket within 30m. Gate needs to be at least 3ft wide for the trolley. If it's chucking it down we'll ring you first thing to decide.

Cheers,
Ash`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Childminder's weekly note to a parent; a child's day, no health, HR or legal matter (SPEC §5.4).`,
    industry: 'childminder', variant: 'UK',
    from: { name: 'Karen', address: 'karen@karensminding.example' },
    to: [{ name: 'Sophie Marsh', address: 'sophie.marsh@gmailbox.test' }],
    subject: `Freddie this week + half term`,
    body: `Hi Sophie,

Freddie's had a great week. We did the leaf collage on Tuesday (it's in his bag), toddler group Wednesday, and he's been very into the garage set. He's eating well, slept an hour and a half each afternoon.

Half term: I'm open as normal except Friday 31st. Let me know your days when you can.

Karen`,
  },
  {
    category: 'none', expect: 'pass',
    why: `After-school club to a parent about collection and fees; nothing under SPEC §5.`,
    industry: 'after-school club', variant: 'UK',
    from: { name: 'Kids Zone After School Club', address: 'admin@kidszoneclub.example' },
    to: [{ name: 'Mr and Mrs Fenwick', address: 'fenwicks@btmail.test' }],
    subject: `Collection times and November invoice`,
    body: `Dear Parents,

A reminder that the club closes at 6pm and we do need children collected by then; late collection is charged at £5 per 15 minutes after a grace period.

Your November invoice has been emailed from the booking system; it covers the 12 sessions booked for Maya. Payment by the 7th please, childcare vouchers and tax-free childcare both accepted.

Thank you,
Kids Zone`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Language school to a prospective student; customer-facing course fees (SPEC §5.5 does not flag).`,
    industry: 'language school', variant: 'IE',
    from: { name: 'Admissions', address: 'admissions@liffeylanguageschool.example' },
    to: [{ name: 'Mateus Silva', address: 'mateus.silva@worldmail.test' }],
    subject: `Re: General English course - January start`,
    body: `Dear Mateus,

Thank you for your enquiry. Our General English course runs Monday to Friday, 9.00 to 12.15, in groups of no more than 14. The January intake starts Monday 12 January.

Fees: €240 per week for 4 to 11 weeks, €215 per week for 12 weeks or more, plus a €60 registration fee and €40 for books. Accommodation with a host family can be arranged at €230 per week including breakfast and dinner.

A placement test on your first morning puts you in the right level. Let us know if you'd like us to send an enrolment form.

Kind regards,
Admissions, Liffey Language School`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Flying school lesson scheduling; nothing under SPEC §5.`,
    industry: 'flying school', variant: 'UK',
    from: { name: 'Ops', address: 'ops@fenlandflyingschool.example' },
    to: [{ name: 'Rob Haines', address: 'rob.haines@outlookmail.test' }],
    subject: `Lesson Sunday 10am - weather watch`,
    body: `Hi Rob,

You're booked Sunday 10am with Pete in G-BXXL for circuits. Forecast is marginal, cloud base may be too low first thing; we'll call you by 8.30 if it's a no-go and offer the afternoon slot.

Bring your logbook and the pre-flight checklist you've been working on.

Fenland Flying School ops`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Sailing school confirming a course; nothing under SPEC §5.`,
    industry: 'sailing school', variant: 'UK',
    from: { name: 'Solent Sailing School', address: 'courses@solentsailingschool.example' },
    to: [{ name: 'Alice Brennan', address: 'alice.brennan@talkmail.test' }],
    subject: `Competent Crew - 17 to 21 Nov - joining instructions`,
    body: `Dear Alice,

Welcome aboard! Your Competent Crew course runs from Monday 17 to Friday 21 November. Please join the yacht at the marina on Sunday 16th between 6 and 7pm; the skipper will meet you at the marina office.

Bring: warm layers, waterproofs, non-marking deck shoes or boots, a sleeping bag, a head torch and a small soft bag (no suitcases). Lifejackets and foul weather gear are provided if you don't have your own.

Food on board is included; let us know of any dietary requirements. Mobile signal is patchy in the Solent, warn your family!

Kind regards,
Solent Sailing School`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Dog walker's weekly update; nothing under SPEC §5.`,
    industry: 'dog walker', variant: 'UK',
    from: { name: 'Walkies with Beth', address: 'beth@walkieswithbeth.example' },
    to: [{ name: 'Nadia', address: 'nadia.r@gmailbox.test' }],
    subject: `Milo this week`,
    body: `Hi Nadia,

Milo was a star this week, no pulling at all on Tuesday and he's made friends with the new spaniel in the group. He did roll in something unspeakable on Thursday so I hosed him down before dropping him back.

Next week I can't do Wednesday, can we swap to Thursday? Invoice for October is in the app.

Beth`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Dog trainer's session notes to an owner; nothing under SPEC §5.`,
    industry: 'dog trainer', variant: 'US',
    from: { name: 'Good Dog Training', address: 'coach@gooddogtrainingco.example' },
    to: [{ name: 'Marcus Lee', address: 'mlee.home@postbox.test' }],
    subject: `Session 3 notes - Rocky`,
    body: `Hi Marcus,

Great session today. Notes:

- Loose leash: Rocky held a loose leash for the full block on the quiet street. Keep practicing there before trying Main Street.
- Door greeting: the sit-and-wait is coming along; have guests ignore him until he's sitting.
- Recall: 10 reps a day in the yard with the high-value treats, then one try at the park on the long line next week.

Homework is 10 minutes twice a day. Next session Tuesday 5 PM at the park.

Nice work,
Dana`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Tennis club to a member about court booking changes; nothing under SPEC §5.`,
    industry: 'tennis club', variant: 'ZA',
    from: { name: 'Constantia Tennis Club', address: 'admin@constantiatennisclub.example' },
    to: [{ name: 'Members', address: 'ctc-members@groups-mail.test', kind: 'group' }],
    subject: `Court booking system + floodlights`,
    body: `Dear Members,

From Monday 3 November all court bookings move to the new online system. You'll get an invite email this week; the old booking sheet in the clubhouse will be removed. Bookings open 7 days ahead, maximum two per member per day.

The floodlights on courts 3 and 4 are now working again. Please switch them off when you finish, the timer is by the gate.

Load shedding permitting, the Wednesday night social is back from the 5th. Bring a plate.

Regards,
The Committee`,
  },
  // ---- stops ----
  {
    category: 'secrets', expect: 'stop',
    why: `SPEC §5.1: "The camera over the loading dock hasn't recorded anything since the storm." reveals a security gap (cameras down).`,
    industry: 'warehouse and distribution', variant: 'US', placement: 'body',
    deciding: `The camera over the loading dock hasn't recorded anything since the storm.`,
    from: { name: 'Doug Hartley', address: 'doug@hartleydistribution.example' },
    to: [{ name: 'Dispatch', address: 'dispatch@tristatefreightlines.test' }],
    subject: `Re: pallet count on Tuesday's load`,
    body: `Hi,

We're still showing 2 pallets short on Tuesday's delivery. The camera over the loading dock hasn't recorded anything since the storm. So I can't check the unload footage; can you ask the driver what he remembers and send over his signed manifest?

Thanks,
Doug`,
  },
  {
    category: 'personal', expect: 'stop',
    why: `SPEC §5.4: "Tom's on 48k and honestly that's why he's leaving." discloses an identifiable person's pay.`,
    industry: 'engineering firm', variant: 'UK', placement: 'body',
    deciding: `Tom's on 48k and honestly that's why he's leaving.`,
    from: { name: 'Sue Lindgren', address: 'sue@lindgrenengineering.example' },
    to: [{ name: 'Kieran Doyle', address: 'kieran@axisrecruitment.test' }],
    subject: `Re: replacement design engineer`,
    body: `Kieran,

Yes, start the search. Tom's on 48k and honestly that's why he's leaving. We'll go to 55 for the right person, five years' experience minimum, SolidWorks essential.

Job description attached in the link. Start date January ideally.

Sue`,
  },
  {
    category: 'economics', expect: 'stop',
    why: `SPEC §5.5: "The labour costs us 31 an hour and we bill it at 55." reveals the sender's own cost and markup.`,
    industry: 'commercial cleaning', variant: 'AU', placement: 'body',
    deciding: `The labour costs us 31 an hour and we bill it at 55.`,
    from: { name: 'Teresa Moyle', address: 'teresa@sparklecommercialcleaning.example' },
    to: [{ name: 'Grant Ellis', address: 'grant@ellisbusinessadvisory.test' }],
    subject: `Re: pricing review before the tender`,
    body: `Hi Grant,

Here's where we are for your review. The labour costs us 31 an hour and we bill it at 55. Consumables are about 4% on top. Most of our competitors are billing 50-52 so we're at the top end.

Happy to jump on a call Thursday to talk through the tender numbers.

Teresa`,
  },
  {
    category: 'negotiation', expect: 'stop',
    why: `SPEC §5.6: "Our plan is to let them win on the retention and hold the line on payment terms." reveals the sender's negotiation strategy.`,
    industry: 'mechanical contractor', variant: 'UK', placement: 'body',
    deciding: `Our plan is to let them win on the retention and hold the line on payment terms.`,
    from: { name: 'Andy Marsden', address: 'andy@marsdenmechanical.example' },
    to: [{ name: 'Jill Stokes', address: 'jill@stokescontractconsulting.test' }],
    subject: `Re: subcontract negotiation - Riverside`,
    body: `Jill,

Thanks for the markup. Our plan is to let them win on the retention and hold the line on payment terms. 30 days from valuation is non-negotiable for us with the cashflow on this one.

Can you reflect that in the next draft before Thursday's meeting?

Andy`,
  },
  {
    category: 'remark', expect: 'stop',
    why: `SPEC §5.7: "Mr Ashby is a pompous windbag and the committee knows it." is a disparaging remark about a person, in the quoted history.`,
    industry: 'bowls club', variant: 'UK', placement: 'quoted',
    deciding: `Mr Ashby is a pompous windbag and the committee knows it.`,
    from: { name: 'Derek Woods', address: 'derek.woods@homemail.example' },
    to: [{ name: 'Groundsman', address: 'tony@greenkeepersupplies.test' }],
    subject: `Fwd: green renovation dates`,
    body: `Tony,

See the thread below, the committee's agreed the dates so you're fine to order the top dressing. Second week of November.

Derek

> Derek, the committee has approved the renovation for the second week of November. Please liaise with the greenkeeper. Mr Ashby is a pompous windbag and the committee knows it. Ignore his email about the cost.
> Pauline`,
  },
  {
    category: 'secrets', expect: 'stop',
    why: `SPEC §5.1: "Side gate to the paddock doesn't lock any more, you can just lift it." reveals a security gap (a gate that is broken).`,
    industry: 'livery yard', variant: 'UK', placement: 'body',
    deciding: `Side gate to the paddock doesn't lock any more, you can just lift it.`,
    from: { name: 'Fiona Blake', address: 'fiona@hillfarmlivery.example' },
    to: [{ name: 'Deliveries', address: 'deliveries@countryfeedsdirect.test' }],
    subject: `Hay delivery Thursday`,
    body: `Hi,

For Thursday's hay, please drop the 40 bales in the open barn by the paddock rather than the yard, the yard's being resurfaced. Side gate to the paddock doesn't lock any more, you can just lift it. Pull the gate to afterwards so the ponies don't wander.

Thanks,
Fiona`,
  },
  {
    category: 'personal', expect: 'stop',
    why: `SPEC §5.4: "Dr Hale's been written up twice for turning up late." discloses an identifiable person's HR matter, in the quoted history.`,
    industry: 'veterinary practice', variant: 'US', placement: 'quoted',
    deciding: `Dr Hale's been written up twice for turning up late.`,
    from: { name: 'Marcy Dunn', address: 'marcy@creeksideanimalhospital.example' },
    to: [{ name: 'Tom Reyes', address: 'tom@reyesvetstaffing.test' }],
    subject: `Re: Re: relief vet for December`,
    body: `Tom,

Let's go with Dr Patel for the December dates then. Please send the contract over and I'll get it signed this week.

Marcy

> Marcy, I have Dr Patel or Dr Hale available for your December dates. Any preference?
> Tom

>> Tom, Patel please. Dr Hale's been written up twice for turning up late. We can't risk that over the holidays.
>> Marcy`,
  },
];
