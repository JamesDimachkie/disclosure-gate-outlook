// everyday2 batch 07. Hand-written literals; see ../serialize.mjs for the schema wrapper.
export default [
  {
    category: 'none', expect: 'pass',
    why: `Osteopath appointment reminder; logistics only, no condition or treatment named (SPEC §5.4).`,
    industry: 'osteopath', variant: 'UK',
    from: { name: 'Lane End Osteopathy', address: 'reception@laneendosteopathy.example' },
    to: [{ name: 'Mr P Grady', address: 'pgrady@virginmail.test' }],
    subject: `Appointment reminder - Fri 31 Oct, 2.30pm`,
    body: `Dear Mr Grady,

A reminder of your appointment with Rachel on Friday 31 October at 2.30pm. Please arrive five minutes early and wear loose clothing.

If you need to cancel, we ask for 24 hours' notice.

Lane End Osteopathy`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Beauty salon price list update to clients; customer-facing prices (SPEC §5.5 does not flag).`,
    industry: 'beauty salon', variant: 'UK',
    from: { name: 'Glow Beauty', address: 'hello@glowbeautyrooms.example' },
    to: [{ name: 'Clients', address: 'glow-clients@groups-mail.test', kind: 'group' }],
    subject: `New prices from 1 December + Christmas opening`,
    body: `Hi everyone,

From 1 December a few of our prices are changing for the first time in two years:

- Gel manicure £32 (was £30)
- Brow shape and tint £22 (was £20)
- Full body massage, 60 mins £55 (was £50)
- All other treatments unchanged

Christmas opening: we're open late (till 8) on Thursdays in December and closed from 24 December to 2 January. Book early, December fills up fast!

Thank you for your continued support,
Glow Beauty`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Barber one-liner; nothing under SPEC §5.`,
    industry: 'barber', variant: 'AU',
    from: { name: 'Johnny', address: 'johnny@johnnysbarbershop.example' },
    to: [{ name: 'Mitch', address: 'mitch.k@optusmail.test' }],
    subject: `Sat`,
    body: `Mate, running 20 late Sat, come at 10.20 instead of 10 if that's ok. Johnny`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Spa gift voucher confirmation; nothing under SPEC §5.`,
    industry: 'spa', variant: 'UK',
    from: { name: 'The Willow Spa', address: 'vouchers@thewillowspa.example' },
    to: [{ name: 'Mr J Hartigan', address: 'j.hartigan@skymail.test' }],
    subject: `Your gift voucher order`,
    body: `Dear Mr Hartigan,

Thank you for your order. Your gift voucher for the Couples' Retreat (two 60-minute treatments, afternoon tea and use of the thermal suite) has been posted first class today in a presentation wallet.

The voucher is valid for 12 months and the recipient can book by phone or online quoting the voucher number printed on it. Weekend bookings carry a £20 supplement.

We hope they enjoy it.

The Willow Spa`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Personal trainer scheduling sessions; nothing under SPEC §5.`,
    industry: 'personal trainer', variant: 'US',
    from: { name: 'Coach Tanya', address: 'tanya@tanyafitcoaching.example' },
    to: [{ name: 'Brian Mosley', address: 'bmosley@mailhub.test' }],
    subject: `Next week's sessions`,
    body: `Hey Brian,

Great work this week, the deadlift form is way cleaner. Next week:

- Mon 6:30 AM, lower body
- Wed 6:30 AM, upper body and conditioning
- Fri 7 AM (gym opens late Friday), full body

Keep logging your steps and water. Your 8-pack renews after Friday, let me know if you want to keep the same days.

Tanya`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Referees' association to a club about appointments; nothing under SPEC §5.`,
    industry: 'referees association', variant: 'UK',
    from: { name: 'Appointments Secretary', address: 'appointments@midlandsrefsassoc.example' },
    to: [{ name: 'Fixtures Secretary', address: 'fixtures@kingsheathunited.test' }],
    subject: `Referee appointments - Sat 8 Nov`,
    body: `Dear Fixtures Secretary,

Referee appointments for Saturday 8 November:

- First team v Rubery Rangers, 3pm: M. Okafor
- Reserves v Hollywood Colts, 2pm: S. Byrne
- Under 18s v Moseley Rovers, 10.30am: no referee available, please appoint a club official

Match fees are £35 for the first team and £30 for the reserves, payable on the day.

Please confirm kick-off times and pitch locations by Thursday.

Regards,
Appointments Secretary`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Athletics club to parents about a race entry; nothing under SPEC §5.`,
    industry: 'athletics club', variant: 'UK',
    from: { name: 'Juniors Coordinator', address: 'juniors@valeharriers.example' },
    to: [{ name: 'Junior parents', address: 'vale-juniors-parents@groups-mail.test', kind: 'group' }],
    subject: `County cross country - Sun 16 Nov - entries close Weds`,
    body: `Hi all,

Entries for the county cross country championships on Sunday 16 November at Wollaton Park close this Wednesday. £6 per athlete, enter through the club portal under Events.

Age groups run from 10.30 (under 11s) to 1.15 (under 17s). Club tent will be up by 9.30 near the start, bring a change of shoes and warm layers, it is always muddy and always cold.

If you can help marshal for an hour please let me know, we need four volunteers.

Thanks,
Gill`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Netball club to a venue about court hire; nothing under SPEC §5.`,
    industry: 'netball club', variant: 'NZ',
    from: { name: 'Harbour Netball Club', address: 'secretary@harbournetball.example' },
    to: [{ name: 'Bookings', address: 'bookings@northshorerecreationcentre.test' }],
    subject: `Court hire - summer season`,
    body: `Kia ora,

Can we please book two indoor courts for Tuesday evenings 6-8pm from 4 November through to 17 February, excluding 23 and 30 December? That's 14 weeks. We'd also like the meeting room for our AGM on Tuesday 11 November, 8-9pm.

Please send through the booking confirmation and the invoice for the term. Same account details as last season.

Ngā mihi,
Rachel`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Chess club to a visiting club about a league match; nothing under SPEC §5.`,
    industry: 'chess club', variant: 'UK',
    from: { name: 'Peter Hallam', address: 'captain@beestonchessclub.example' },
    to: [{ name: 'Graham Fell', address: 'graham.fell@homemail.example' }],
    subject: `League match Tues 4 Nov - venue and boards`,
    body: `Graham,

Confirming Tuesday 4 November, 7.30pm start, at the Methodist hall on Chilwell Road as usual, side entrance. We'll have five boards set up, clocks digital, 75 minutes plus 10 second increment as per league rules.

Tea and coffee available for a quid. Parking in the hall car park, not the street, the wardens are keen round there.

Our team list will be posted on the league site by Sunday.

Peter`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Orchestra to a guest soloist about rehearsals; nothing under SPEC §5.`,
    industry: 'amateur orchestra', variant: 'UK',
    from: { name: 'Lucy Ferrier', address: 'secretary@wessexsinfonia.example' },
    to: [{ name: 'Daniel Kowal', address: 'daniel.kowal.cello@mailbox.test' }],
    subject: `Elgar concerto - rehearsal and concert details`,
    body: `Dear Daniel,

We are so pleased you'll be playing the Elgar with us. Details:

Rehearsals (both at St Luke's Hall, Dorchester):
- Saturday 15 November, 2-5pm, concerto only
- Friday 28 November, 7-9.30pm, full run

Concert: Saturday 29 November, 7.30pm, Dorchester Corn Exchange. Call 6pm for a brief top and tail.

Dress is black for the orchestra; whatever you're comfortable in. Your fee and travel will be paid by transfer within a week of the concert as agreed. Parking at the Corn Exchange is free after 6.

Our conductor, Mark, will be in touch about tempi.

With best wishes,
Lucy`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Brass band to a council about a Remembrance parade; nothing under SPEC §5.`,
    industry: 'brass band', variant: 'UK',
    from: { name: 'Bandmaster', address: 'bandmaster@hebdenvalleybrass.example' },
    to: [{ name: 'Events Officer', address: 'events@calderdistrictcouncil.test' }],
    subject: `Remembrance Sunday - parade arrangements`,
    body: `Dear Mr Whitaker,

Confirming the band will lead the parade on Remembrance Sunday. We will assemble at the Town Hall steps at 10.15am, step off at 10.30, and play at the war memorial for the two minutes' silence and the hymns, then lead the parade back.

We'll have 26 players. As in previous years we'd be grateful for the use of the Town Hall council chamber for warm-up from 9.45, and for the road closure order to cover Market Street as before.

Please let me know if anything has changed.

Yours sincerely,
Colin Ashworth`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Drama group to a theatre about a production booking; nothing under SPEC §5.`,
    industry: 'amateur dramatics', variant: 'UK',
    from: { name: 'Carrie Lowe', address: 'chair@stanleyplayers.example' },
    to: [{ name: 'Theatre Manager', address: 'manager@littlemill-theatre.test' }],
    subject: `Spring production - get-in and performance dates`,
    body: `Dear Phil,

The committee has agreed on "Blithe Spirit" for the spring. Could we hold the following?

- Get-in and tech: Sunday 22 March, all day
- Dress rehearsal: Monday 23 March, evening
- Performances: Tuesday 24 to Saturday 28 March, 7.30pm, plus a 2.30pm matinee on the Saturday
- Get-out: Saturday night after the show

Hire at the usual society rate please. We'd like to use the full lighting rig and we'll bring our own set. Box office through your system as last year.

Many thanks,
Carrie`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Youth club to a funder about a grant report; nothing under SPEC §5.`,
    industry: 'youth club', variant: 'UK',
    from: { name: 'Jamal Ricketts', address: 'jamal@eastsideyouthproject.example' },
    to: [{ name: 'Grants Team', address: 'grants@ashcombefoundation.test' }],
    subject: `End of grant report - Thursday sessions`,
    body: `Dear Grants Team,

Please find our end of grant report for the Thursday evening sessions in your portal. Headlines:

- 34 young people attended regularly over the 12 months (target was 25)
- 18 completed the cooking programme and 11 the first aid course
- Two of our older members have started volunteering as junior leaders
- The grant paid for the sessional youth worker, food for the cooking sessions and the first aid trainer

We've included photos (with consent) and quotes from the young people. Thank you for your support; we'd welcome the chance to apply for a further year.

Kind regards,
Jamal`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Community centre to a hirer about a booking; nothing under SPEC §5.`,
    industry: 'community centre', variant: 'UK',
    from: { name: 'Bookings', address: 'bookings@hazelgrovecommunitycentre.example' },
    to: [{ name: 'Mrs F Oyelaran', address: 'f.oyelaran@talkmail.test' }],
    subject: `Main hall - Sat 15 Nov, 2-6pm - confirmed`,
    body: `Dear Mrs Oyelaran,

Your booking of the main hall on Saturday 15 November from 2pm to 6pm for a children's party is confirmed. Hire is £22 per hour (£88) plus a £50 refundable damage deposit, payable by the 8th.

The hall seats 80, tables and chairs are included, and the kitchen is available for making drinks and serving food (no cooking). Please leave the hall as you found it; bins are at the back.

Our caretaker will open up at 1.45 and lock up at 6.

Kind regards,
Hazel Grove Community Centre`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Synagogue office to a caterer about a kiddush; nothing under SPEC §5.`,
    industry: 'synagogue', variant: 'UK',
    from: { name: 'Shul Office', address: 'office@brookfieldshul.example' },
    to: [{ name: 'Daniel', address: 'daniel@kosherkitchenlondon.test' }],
    subject: `Kiddush Shabbat 15 Nov - numbers`,
    body: `Dear Daniel,

For the kiddush on Shabbat 15 November we're expecting about 90 after the service. The usual: challah rolls, herring, egg mayo, smoked salmon platters, crudités and dips, cakes and biscuits, with grape juice and whisky from our stock.

Please deliver Friday before 2pm to the hall kitchen; Ruth will be there to receive it. Invoice to the office as always.

Shabbat shalom,
Miriam`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Temple committee to a sound hire firm about a festival; nothing under SPEC §5.`,
    industry: 'Hindu temple', variant: 'IN',
    from: { name: 'Temple Committee', address: 'committee@shrilakshmitemple.example' },
    to: [{ name: 'Mr Venkat', address: 'venkat@srisoundandlights.test' }],
    subject: `Sound and lighting for Diwali celebrations - 20 Oct`,
    body: `Dear Mr Venkat,

Kindly confirm the sound and lighting arrangements for our Diwali celebrations on Monday 20 October as discussed:

1. PA system for the main hall (approx 400 persons) with 4 wireless mics
2. Stage lighting for the cultural programme, 6pm to 10pm
3. Decorative string lights for the entrance and the courtyard, to be fitted on 18 October
4. Generator backup

Setup should be completed by 3pm on 20 October. Payment will be made by cheque on completion as per your quotation.

Please revert with confirmation at the earliest.

Regards,
Ramesh Pillai
Secretary, Temple Committee`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Zoo education team to a teacher; nothing under SPEC §5.`,
    industry: 'zoo', variant: 'AU',
    from: { name: 'Education Bookings', address: 'education@bluegumwildlifepark.example' },
    to: [{ name: 'Ms K Donnelly', address: 'kdonnelly@seacliffprimary.test' }],
    subject: `Year 3 excursion - Tues 11 Nov - confirmed`,
    body: `Hi Kate,

Confirming Tuesday 11 November for 54 Year 3 students and 8 adults. Arrival 9.45am at the education gate (bus bay B).

Program:
10.00 Keeper talk, native animals
10.45 Guided walk, half the group, other half self-guided with the activity booklet
11.45 Swap
12.45 Lunch at the picnic shelter (booked for you)
1.30 Reptile encounter
2.15 Depart

$12 per student, adults free at 1:7. Invoice to the school after the visit. Risk assessment and medical info forms are on our website; please bring the completed consent summary on the day.

Cheers,
Blue Gum education team`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Bowling alley confirming a party booking; nothing under SPEC §5.`,
    industry: 'bowling alley', variant: 'US',
    from: { name: 'Strike Zone Lanes', address: 'parties@strikezonelanes.example' },
    to: [{ name: 'Melissa Grant', address: 'mgrant@postbox.test' }],
    subject: `Party booking - Sat Nov 8, 1 PM - Tyler`,
    body: `Hi Melissa,

You're all set for Tyler's party!

- Saturday November 8, 1:00-3:00 PM
- 2 lanes, up to 12 kids, bumpers on
- Pizza package: 3 large pizzas, pitchers of soda, paper goods
- Shoe rental included
- Party host for the full two hours

Total $265, $50 deposit paid, balance due at check-in. You're welcome to bring your own cake. Please arrive 15 minutes early to get everyone's shoe sizes.

See you Saturday!
Strike Zone Lanes`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Escape room confirming a corporate booking; nothing under SPEC §5.`,
    industry: 'escape room', variant: 'UK',
    from: { name: 'Locked In Escape Rooms', address: 'bookings@lockedinleeds.example' },
    to: [{ name: 'Priya Nair', address: 'priya.nair@harcourtlogistics.test' }],
    subject: `Team booking - Thurs 20 Nov, 6pm - 3 rooms`,
    body: `Hi Priya,

Confirming your team of 16 across three rooms (The Vault, The Lab and The Heist) on Thursday 20 November at 6pm. Please arrive 15 minutes early for the briefing. Games run 60 minutes and we'll do a group photo at the end.

£28 per person, £448 total, invoiced to the company as requested, payable within 14 days.

We've reserved the bar area for you afterwards until 8.30.

Thanks,
Locked In`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Soft play centre one-liner; nothing under SPEC §5.`,
    industry: 'soft play centre', variant: 'UK',
    from: { name: 'Jungle Tots', address: 'hello@jungletotsplay.example' },
    to: [{ name: 'Amy', address: 'amy.sutton@gmailbox.test' }],
    subject: `Party Sunday`,
    body: `Hi Amy, just confirming Oscar's party Sunday 11-1, party room 2, 15 kids. Balance on the day. See you then! Jungle Tots`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Climbing wall to a school about a session; nothing under SPEC §5.`,
    industry: 'climbing wall', variant: 'UK',
    from: { name: 'Vertical Edge Climbing', address: 'groups@verticaledgeclimbing.example' },
    to: [{ name: 'Mr D Hughes', address: 'dhughes@ridgewayhighschool.test' }],
    subject: `Year 8 session - Weds 12 Nov`,
    body: `Hi Mr Hughes,

Confirming Wednesday 12 November, 1.30-3.30pm, for 24 Year 8 students with 2 staff. Two instructors, bouldering and roped climbing on the auto-belays. Harnesses and shoes provided; students need trainers or socks for the hire shoes, and no jewellery.

£9 per student, invoiced to the school. Please bring the signed consent forms (template in your portal).

Thanks,
Vertical Edge`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Bike hire confirming a booking; nothing under SPEC §5.`,
    industry: 'bike hire', variant: 'UK',
    from: { name: 'Trailhead Bike Hire', address: 'hire@trailheadbikehire.example' },
    to: [{ name: 'The Jacksons', address: 'jacksonfamily@btmail.test' }],
    subject: `Sat 1 Nov - 2 adult, 2 kids bikes + trailer`,
    body: `Hi,

Booked for Saturday 1 November, 10am to 4pm: 2 adult hybrids, 2 kids' bikes (20" and 24") and a child trailer. £78 for the day, helmets and locks included. Pay on collection.

The forest trail is open but the blue route has a muddy section after the bridge. Maps at the counter. Please be back by 4 so we can check the bikes in before close.

Trailhead`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Boat hire replying to an enquiry; nothing under SPEC §5.`,
    industry: 'narrowboat hire', variant: 'UK',
    from: { name: 'Canal Holidays', address: 'enquiries@shropshirecanalholidays.example' },
    to: [{ name: 'Robert Ennis', address: 'robert.ennis@homemail.example' }],
    subject: `Re: week in May - 4 berth`,
    body: `Dear Mr Ennis,

Thank you for your enquiry. We have "Heron" (4 berth, 45ft) available from Saturday 16 May for a week at £1,180, or from Saturday 23 May at £1,240. Both include fuel, gas, bedding, towels and a full handover; no experience needed, we spend about an hour with you before you set off.

From our base you can reach Llangollen and back comfortably in a week, with the aqueduct on day two.

A £300 deposit secures the week. Let me know if you'd like us to hold either date.

Kind regards,
Shropshire Canal Holidays`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Caravan park to a seasonal pitch holder about winter closure; nothing under SPEC §5.`,
    industry: 'caravan park', variant: 'UK',
    from: { name: 'Sandy Bay Holiday Park', address: 'office@sandybayholidaypark.example' },
    to: [{ name: 'Mr and Mrs Cooper', address: 'thecoopers@skymail.test' }],
    subject: `Winter closure and 2027 pitch fees`,
    body: `Dear Mr and Mrs Cooper,

The park closes for the winter on Sunday 2 November and reopens on Friday 13 March. During the closed season you may visit to check your caravan on the first Saturday of each month, 10am to 2pm, when the gate will be open.

Please drain down your water system, turn off the gas and remove any food before leaving. We'll be checking the site weekly and after storms.

2027 seasonal pitch fees are enclosed in your portal; they are due by 1 February and have increased by 4% in line with the park agreement.

Thank you for another lovely season.

Sandy Bay office`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Car valeting to a dealership about weekly work; customer-facing prices (SPEC §5.5 does not flag).`,
    industry: 'car valeting', variant: 'UK',
    from: { name: 'Gleam Valeting', address: 'tom@gleamvaleting.example' },
    to: [{ name: 'Sales Manager', address: 'sales@parkwaymotors.test' }],
    subject: `Forecourt valets - Nov schedule`,
    body: `Hi Steve,

For November we'll do the forecourt every Tuesday and Friday morning from 7, same as now. Full valets on part-exchanges are £65 each, mini valets on the stock cars £18. Let the lads know which ones need doing on the whiteboard as before.

Invoice weekly on Fridays.

Tom`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Windscreen repair confirming an appointment; nothing under SPEC §5.`,
    industry: 'windscreen repair', variant: 'AU',
    from: { name: 'ClearView Windscreens', address: 'bookings@clearviewwindscreens.example' },
    to: [{ name: 'Daniel Hoang', address: 'daniel.hoang@gmailbox.test' }],
    subject: `Mobile fitting - Thurs 30 Oct, 1-3pm`,
    body: `Hi Daniel,

Your windscreen replacement for the Hilux is booked for Thursday 30 October between 1 and 3pm at your work address. The technician needs the car parked in the open with room to work on both sides, and the windscreen needs to be dry, so under cover if it's raining.

Allow about an hour and a half, then don't drive it for another hour while the adhesive sets. $420 as quoted, or nothing to pay if your insurer has approved the claim; just have the claim number handy.

Thanks,
ClearView`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Motorbike dealer to a customer about a service and a recall; nothing under SPEC §5.`,
    industry: 'motorcycle dealer', variant: 'UK',
    from: { name: 'Ridgeway Motorcycles', address: 'service@ridgewaymotorcycles.example' },
    to: [{ name: 'Mr L Doherty', address: 'l.doherty@talkmail.test' }],
    subject: `Your Tracer - service booked + recall`,
    body: `Hi Liam,

Your Tracer is booked in for the 12,000 mile service on Saturday 8 November, drop off 8.30, ready by 1. £285 including the valve clearance check.

While it's in we'll also do the recall on the brake light switch, no charge, takes 20 minutes. If you need a loan bike for the morning let us know.

Ridgeway service`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Trailer hire confirmation; nothing under SPEC §5.`,
    industry: 'trailer hire', variant: 'US',
    from: { name: 'Haul-It Trailer Rental', address: 'rentals@haulittrailers.example' },
    to: [{ name: 'Carlos Ramirez', address: 'cramirez@mailhub.test' }],
    subject: `Reservation - 6x12 enclosed - Nov 1-2`,
    body: `Carlos,

Your 6x12 enclosed trailer is reserved for pickup Saturday November 1 at 8 AM, return by Sunday 6 PM. $95 for the two days. We'll need your driver's license and a credit card for the deposit at pickup.

Your truck needs a 2" ball and a 4-flat light connector; we have adapters if not.

Thanks,
Haul-It`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Chauffeur service confirming an airport run; nothing under SPEC §5.`,
    industry: 'chauffeur service', variant: 'UK',
    from: { name: 'Prestige Chauffeurs', address: 'bookings@prestigechauffeursltd.example' },
    to: [{ name: 'Ms A Fairbanks', address: 'afairbanks@outlookmail.test' }],
    subject: `Booking confirmed - Heathrow T5, Mon 3 Nov`,
    body: `Dear Ms Fairbanks,

Confirming your car for Monday 3 November. Pick-up from your home address at 05:15 for a 08:40 departure from Heathrow Terminal 5, Mercedes E-Class, driver Kamal. He will text you when he is outside.

Return: Friday 7 November, meeting your flight landing at 18:55. Kamal will be at arrivals with a name board and will track the flight, so no need to call if you are delayed.

Fare as quoted, charged to the company account.

Kind regards,
Prestige Chauffeurs`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Same-day courier quote; customer-facing price (SPEC §5.5 does not flag).`,
    industry: 'same-day courier', variant: 'UK',
    from: { name: 'Dash Couriers', address: 'ops@dashcouriersmanchester.example' },
    to: [{ name: 'Lisa', address: 'lisa@fairfieldprinting.test' }],
    subject: `Re: urgent - Manchester to Leeds today`,
    body: `Hi Lisa,

Yes we can do it. Small van, collection from you within the hour, direct to Leeds, delivered by 3.30 at the latest. £95 plus VAT. Reply "go" and I'll dispatch Dave.

Ops`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Customs broker asking a client for documents; nothing under SPEC §5.`,
    industry: 'customs broker', variant: 'CA',
    from: { name: 'Maple Customs Brokers', address: 'clearance@maplecustomsbrokers.example' },
    to: [{ name: 'Imports', address: 'imports@northernoutdoorgear.test' }],
    subject: `Shipment arriving Vancouver Nov 4 - docs needed`,
    body: `Hi Jen,

For the container arriving Vancouver on November 4 we still need:

- Commercial invoice (the one we have is a pro forma)
- Packing list
- Certificate of origin if you want to claim the preferential rate
- Confirmation of the HS codes for the two new jacket styles

Please send by Friday so we can pre-clear. Duties and GST will be invoiced to you on release as usual.

Thanks,
Dev`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Fulfilment warehouse to a small online shop about stock and peak season; nothing under SPEC §5.`,
    industry: 'fulfilment warehouse', variant: 'UK',
    from: { name: 'Client Services', address: 'clients@packandshipfulfilment.example' },
    to: [{ name: 'Hannah', address: 'hannah@hannahscandlesuk.test' }],
    subject: `Peak season - cut-offs and stock`,
    body: `Hi Hannah,

Getting ready for peak. A few things:

- Last order date for Christmas delivery with standard post will be 19 December; we'll ship same day on orders in by 1pm.
- You're down to 40 units of the Winter Spice large; at your current rate that's about 10 days. Send more stock by the 10th if you can.
- Gift boxes: we've got 200 of your boxes left. Let us know if you're expecting to need more.
- Extra packing staff are on from 1 December so Saturday dispatch is available in December at the usual rate.

Shout if you need anything.

Client Services`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Packaging supplier confirming an order; nothing under SPEC §5.`,
    industry: 'packaging supplier', variant: 'UK',
    from: { name: 'Boxwise Packaging', address: 'sales@boxwisepackaging.example' },
    to: [{ name: 'Purchasing', address: 'purchasing@fenwickceramics.test' }],
    subject: `Order BX-5520 - confirmation`,
    body: `Hi Carol,

Order BX-5520 confirmed:

- 2,000 x double wall boxes 300x300x300, plain: delivery 6 November
- 50 x rolls bubble wrap 750mm: delivery 6 November
- 5,000 x printed tape rolls with your logo: delivery 18 November (print lead time)

Delivery to your Unit 7 address, pallet delivery, tail lift required as noted. Payment terms 30 days from invoice.

Thanks,
Boxwise`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Picture framer to a customer; nothing under SPEC §5.`,
    industry: 'picture framer', variant: 'UK',
    from: { name: 'Frame & Mount', address: 'shop@frameandmountbath.example' },
    to: [{ name: 'Mrs H Lister', address: 'hlister@homemail.example' }],
    subject: `Your prints are ready`,
    body: `Dear Mrs Lister,

Your three prints are framed and ready to collect. We went with the oak moulding and the off-white mount as discussed, and museum glass on the larger one. Total £312 as quoted.

We're open Tuesday to Saturday, 10-5.

Best wishes,
Frame & Mount`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Music shop to a customer about an instrument repair; nothing under SPEC §5.`,
    industry: 'music shop', variant: 'IE',
    from: { name: 'Shannon Music', address: 'repairs@shannonmusiclimerick.example' },
    to: [{ name: 'Ciaran', address: 'ciaran.m@eircommail.test' }],
    subject: `Your fiddle`,
    body: `Hi Ciaran,

The fiddle's ready. Fixed the open seam, new bridge, new set of strings and gave it a clean. It sounds lovely now. €95 all in.

We're open till 6 and Saturday till 5.

Mick`,
  },
  // ---- stops ----
  {
    category: 'economics', expect: 'stop',
    why: `SPEC §5.5: "The profit on the whole tour is only about 1,400 once the coach is paid." reveals the sender's own profit.`,
    industry: 'tour operator', variant: 'UK', placement: 'body',
    deciding: `The profit on the whole tour is only about 1,400 once the coach is paid.`,
    from: { name: 'Janet Mills', address: 'janet@lakelandtours.example' },
    to: [{ name: 'Reservations', address: 'reservations@thebeckhotel.test' }],
    subject: `Re: group rate for 7-9 March`,
    body: `Dear Sarah,

Thank you for the group rate. I'd be grateful if you could hold it at last year's figure. The profit on the whole tour is only about 1,400 once the coach is paid. We have 38 confirmed and I'd rather not put the price up to our regulars.

Could you let me know by Friday?

Kind regards,
Janet`,
  },
  {
    category: 'negotiation', expect: 'stop',
    why: `SPEC §5.6: "If she asks again about the deposit we'll drop it to 10%, just not yet." reveals the sender's planned concession on terms.`,
    industry: 'wedding venue', variant: 'AU', placement: 'body',
    deciding: `If she asks again about the deposit we'll drop it to 10%, just not yet.`,
    from: { name: 'Marcus Dean', address: 'marcus@thevineyardbarn.example' },
    to: [{ name: 'Sophie Lam', address: 'sophie@lamweddingplanning.test' }],
    subject: `Re: the Turner booking`,
    body: `Hi Sophie,

Thanks for walking them through on Saturday. Stay firm on the 25% deposit for now. If she asks again about the deposit we'll drop it to 10%, just not yet. I'd like them to commit to the date first.

Menu tasting is available any Thursday in November.

Marcus`,
  },
  {
    category: 'remark', expect: 'stop',
    why: `SPEC §5.7: "The new ref is a joke, blind as a bat and arrogant with it." is a disparaging remark about a person.`,
    industry: 'hockey club', variant: 'UK', placement: 'body',
    deciding: `The new ref is a joke, blind as a bat and arrogant with it.`,
    from: { name: 'Club Secretary', address: 'secretary@mendiphockeyclub.example' },
    to: [{ name: 'Fixtures', address: 'fixtures@cheddarhockey.test' }],
    subject: `Re: Saturday's match and the umpire`,
    body: `Hi Tom,

Thanks for hosting, good game despite everything. The new ref is a joke, blind as a bat and arrogant with it. We'll both be putting in a report to the league I imagine.

Return fixture is 14 February at ours, 2pm push back.

Lucy`,
  },
  {
    category: 'secrets', expect: 'stop',
    why: `SPEC §5.1: "Safe combination is 18-42-06, turn left first." gives a safe code that is actually given.`,
    industry: 'newsagent', variant: 'UK', placement: 'body',
    deciding: `Safe combination is 18-42-06, turn left first.`,
    from: { name: 'Raj Mehta', address: 'raj@mehtanewsandwine.example' },
    to: [{ name: 'Nina Holt', address: 'nina@holtbookkeeping.test' }],
    subject: `Cash count Sunday`,
    body: `Hi Nina,

Thanks for agreeing to do the cash count Sunday while I'm away. The float bags and the takings envelopes are in the safe under the counter. Safe combination is 18-42-06, turn left first. Please put the count sheet in the blue folder.

Raj`,
  },
  {
    category: 'personal', expect: 'stop',
    why: `SPEC §5.4: "Nina's 12k bonus - how to invoice it" discloses an identifiable person's bonus, in the subject.`,
    industry: 'recruitment agency', variant: 'UK', placement: 'subject',
    deciding: `Nina's 12k bonus - how to invoice it`,
    from: { name: 'Paul Grant', address: 'paul@grantsearchpartners.example' },
    to: [{ name: 'Payroll Team', address: 'payroll@brightpaybureau.test' }],
    subject: `Nina's 12k bonus - how to invoice it`,
    body: `Hi,

Can this go through in the November run rather than December? Please let me know what you need from me and whether it affects the pension contribution for the month.

Thanks,
Paul`,
  },
  {
    category: 'economics', expect: 'stop',
    why: `SPEC §5.5: "Our actual cost on the printing came to 2,310, so the 4,000 quoted gives us room." reveals the sender's own cost against its quote, in the quoted history.`,
    industry: 'events agency', variant: 'US', placement: 'quoted',
    deciding: `Our actual cost on the printing came to 2,310, so the 4,000 quoted gives us room.`,
    from: { name: 'Erin Castillo', address: 'erin@brightlineevents.example' },
    to: [{ name: 'Mark Feld', address: 'mark@feldprintworks.test' }],
    subject: `Fwd: conference signage - final quantities`,
    body: `Hi Mark,

Final quantities below from my colleague. Please go ahead with production, delivery to the convention center Thursday by noon.

Erin

> Erin, final signage count: 12 banners, 40 directional signs, 200 name badges, 2 step-and-repeat backdrops.
> Our actual cost on the printing came to 2,310, so the 4,000 quoted gives us room. Add the extra backdrop if the client asks.
> Jamie`,
  },
];
