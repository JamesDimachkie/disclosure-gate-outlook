// everyday2 batch 02. Hand-written literals; see ../serialize.mjs for the schema wrapper.
export default [
  {
    category: 'none', expect: 'pass',
    why: `Secondary school message to a parent about options evening; nothing under SPEC §5.`,
    industry: 'secondary school', variant: 'UK',
    from: { name: 'Mr T Adebayo', address: 'tadebayo@kingsmeadacademy.example' },
    to: [{ name: 'Ms R Patel', address: 'rpatel.home@btmail.test' }],
    subject: `Year 9 options evening - Thursday 6 November`,
    body: `Dear Ms Patel,

Year 9 options evening is on Thursday 6 November, 5.30pm to 7.30pm in the main hall. Subject leaders will be available to talk through the GCSE choices, and there is a short presentation at 5.45 and again at 6.45.

Students are encouraged to attend with you. Options forms will go live on the portal the following Monday and close on 28 November.

If you are unable to attend, the presentation slides will be posted on the school website.

Yours sincerely,
Mr T Adebayo
Head of Year 9`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Cricket club secretary to a visiting club about a fixture; nothing under SPEC §5.`,
    industry: 'cricket club', variant: 'AU',
    from: { name: 'Warren Pike', address: 'secretary@mountcoolumcc.example' },
    to: [{ name: 'Fixtures', address: 'fixtures@noosaheadscricket.test' }],
    subject: `Round 6 - start time and ground`,
    body: `Hi Col,

Confirming Round 6 at our place Saturday week. 12.30 start, 40 overs. We're on the top oval, the bottom one's being re-turfed. Canteen will be running and there's a BBQ after if your blokes want to hang around.

Umpires are sorted from our end. Can you send through your 11 by the Thursday for the scorebook?

Cheers,
Warren`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Farmer to a contractor about silage dates; nothing under SPEC §5.`,
    industry: 'dairy farm', variant: 'IE',
    from: { name: 'Padraig Doyle', address: 'doylefarm.kilmore@eircommail.example' },
    to: [{ name: 'Tommy Lynch', address: 'tommy@lynchagricontracts.test' }],
    subject: `Second cut`,
    body: `Tommy,

Second cut looks ready on the far fields, about 30 acres. Could you fit us in next week if the weather holds? Wednesday or Thursday would be ideal. Pit's clear and the cover's ready.

Diesel's in the tank by the shed as usual.

Padraig`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Charity shop to a volunteer about shifts; nothing under SPEC §5.`,
    industry: 'charity shop', variant: 'UK',
    from: { name: 'Jean Holloway', address: 'highst@hopehospiceshops.example' },
    to: [{ name: 'Barbara Finch', address: 'barbara.finch@talkmail.test' }],
    subject: `Rota for November`,
    body: `Hello Barbara,

Thank you for offering extra hours. I've put you down for Tuesday and Friday mornings (9.30-1) through November, and the Saturday 15th all day for the Christmas window changeover if you're still happy to do that.

We've had a big donation of books from a house clearance, so the back room is chaos. Any help sorting would be lovely.

Tea and biscuits as always.

Jean`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Restaurant confirming a group booking with a deposit and menu; customer-facing prices and terms (SPEC §5.5 does not flag).`,
    industry: 'restaurant', variant: 'UK',
    from: { name: 'Osteria Mancini', address: 'bookings@osteriamancini.example' },
    to: [{ name: 'Karen Whitelaw', address: 'karen.whitelaw@globalmail.test' }],
    subject: `Booking for 14 - Sat 22 Nov, 7.30pm`,
    body: `Dear Karen,

Lovely to speak to you earlier. Confirming your table for 14 on Saturday 22 November at 7.30pm in the back room.

For groups of 10 or more we ask for the set menu (£38 a head for three courses, menu attached on our website under Groups) and a £10 per person deposit, which comes off the final bill. Pre-orders by Wednesday 19th please, with any allergies.

A 10% service charge is added to group bills.

Looking forward to seeing you all.

Best wishes,
Luca`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Brewery to a pub about a delivery and a new line; wholesale prices stated as facts to the customer (SPEC §5.5 does not flag).`,
    industry: 'brewery', variant: 'UK',
    from: { name: 'Hannah Croft', address: 'hannah@threebridgesbrewing.example' },
    to: [{ name: 'Mick', address: 'mick@theploughinn.test' }],
    subject: `Thursday drop + the new porter`,
    body: `Hi Mick,

Thursday's delivery: 4 x Bridge Bitter, 2 x Weir Pale, 1 x Session IPA, plus the 2 kegs of lager. Driver's in your area about 11.

We've just released the Winter Porter, 5.2%, dark but not heavy. Trade price £82 a firkin for the first order. Want one on Thursday to try?

Cheers,
Hannah`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Winery cellar door replying to a tour enquiry; nothing under SPEC §5.`,
    industry: 'winery', variant: 'AU',
    from: { name: 'Cellar Door', address: 'cellardoor@stonycreekestate.example' },
    to: [{ name: 'Fiona McBride', address: 'fiona.mcbride@gmailbox.test' }],
    subject: `Re: tasting for 8 on the 16th`,
    body: `Hi Fiona,

Yes we can do a seated tasting for 8 on Sunday 16 November at 2pm. It's $25 a head, redeemable against any purchase of 2 bottles or more, and runs about an hour. We'll pop you on the deck if the weather's good.

A cheese plate for the table is $45 if you'd like one, just let us know on the day.

See you then!
Jo

> Hi there, we're a group of 8 coming through the valley on the 16th, could we book a tasting for the afternoon? Thanks, Fiona`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Bike shop one-liner to a customer; nothing under SPEC §5.`,
    industry: 'bike shop', variant: 'US',
    from: { name: 'Spoke & Wheel', address: 'shop@spokeandwheelcycles.example' },
    to: [{ name: 'Andre', address: 'andre.b@mailhub.test' }],
    subject: `Bike's ready`,
    body: `Hey Andre, your Trek is all set, new chain and cassette, $112 total. Open till 6. - Sam`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Car dealership service follow-up; a quote stated as a customer-facing price (SPEC §5.5 does not flag), registration is a vehicle identifier not an ID number (§5.3).`,
    industry: 'car dealership', variant: 'UK',
    from: { name: 'Marsh Park Vauxhall', address: 'service@marshparkmotors.example' },
    to: [{ name: 'Mr P Kowalczyk', address: 'p.kowalczyk@outlookmail.test' }],
    subject: `Your Astra - advisory items from today's service`,
    body: `Dear Mr Kowalczyk,

Thank you for bringing your Astra in today. The service is complete and the health check found the following advisories:

- Rear tyres at 3mm, legal but worth replacing before winter: £168 fitted for the pair
- Slight play in the front anti-roll bar drop links: £94 fitted
- Cabin filter due: £32

None of these are urgent and we have not carried out any of this work. If you would like any of it done, reply or call and we can book you in; the tyres we can do while you wait.

Your car is ready for collection until 6pm.

Kind regards,
Service Team`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Minibus firm quoting a school run; customer price stated as a fact (SPEC §5.5 does not flag).`,
    industry: 'minibus and taxi', variant: 'UK',
    from: { name: 'Ray Tomlinson', address: 'ray@valleyminibuses.example' },
    to: [{ name: 'Sue Grainger', address: 'sue.grainger@oakwoodprimary.test' }],
    subject: `Quote - swimming run Jan to March`,
    body: `Hi Sue,

Quote for the swimming run as discussed: 16-seater, pick up 1.15 from school, drop at the leisure centre, collect 2.45, back by 3.05. Tuesdays, 10 weeks from 13 January. £68 per week, so £680 for the term, invoiced monthly.

All our drivers are DBS checked and the bus has seatbelts throughout. Happy to send the insurance certificate over for your file.

Ray`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Funeral director confirming arrangements with a family member; a bereavement handled as the recipient's own business, no third person's family matter disclosed (close call on SPEC §5.4 noted in README).`,
    industry: 'funeral director', variant: 'UK',
    from: { name: 'Elaine Porter', address: 'elaine@porterandsonsfunerals.example' },
    to: [{ name: 'Mrs S Garside', address: 'sheila.garside@virginmail.test' }],
    subject: `Arrangements for Thursday 6 November`,
    body: `Dear Mrs Garside,

Thank you for coming in yesterday. To confirm what we agreed:

- Service at St Mary's at 11.00am on Thursday 6 November, Rev. Hughes officiating
- Committal at the crematorium at 12.15pm
- Two cars from your address at 10.20am
- Order of service: 60 copies, the photograph you chose on the front, final proof to you by Monday
- Flowers: family flowers only, donations in lieu to the hospice

The wake at the Red Lion is booked under your name from 1pm.

Please call me any time if anything needs changing or if you simply want to talk something through.

With kind regards,
Elaine Porter`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Tattoo studio booking note with deposit terms; nothing under SPEC §5.`,
    industry: 'tattoo studio', variant: 'CA',
    from: { name: 'Black Spruce Tattoo', address: 'bookings@blacksprucetattoo.example' },
    to: [{ name: 'Kayla', address: 'kayla.m@mailhub.test' }],
    subject: `Your session Nov 8`,
    body: `Hey Kayla,

You're booked with Rin on Saturday Nov 8 at noon for the forearm piece, we've blocked out 4 hours. The $100 deposit we took comes off the total.

Few things:
- eat a proper meal before you come in
- wear a short sleeve or something you can roll up
- no alcohol the night before please, it makes you bleed more and the ink won't take as well
- bring any reference images you haven't already sent

Rin will have the stencil ready to tweak when you get here. Any questions just reply.

Cheers,
Black Spruce`,
  },
  {
    category: 'none', expect: 'pass',
    why: `SaaS support reply about an integration bug; technical troubleshooting, nothing under SPEC §5.`,
    industry: 'software startup', variant: 'US',
    from: { name: 'Priya at Ledgerly', address: 'support@ledgerlyapp.example' },
    to: [{ name: 'Chris Okonkwo', address: 'chris@okonkwoconsulting.test' }],
    subject: `Re: QuickBooks sync stuck on "pending"`,
    body: `Hi Chris,

Thanks for the screenshots, that helped. The sync is stuck because the connection token from QuickBooks expired and our retry didn't surface the error properly (that part's on us, a fix ships next week).

To get you going now:
1. Settings > Integrations > QuickBooks > Disconnect
2. Reconnect and approve the permissions again when QuickBooks asks
3. Click "Sync now" once; the pending items should clear in a minute or two

If anything's still stuck after that, reply here and I'll take a look at the logs on our side.

Sorry for the hassle.

Priya
Ledgerly Support`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Translation agency quoting a client; a per-word customer price stated as a fact (SPEC §5.5 does not flag).`,
    industry: 'translation services', variant: 'UK',
    from: { name: 'Marta Kowalska', address: 'marta@lingobridgetranslations.example' },
    to: [{ name: 'Dr Henry Wu', address: 'h.wu@wuandpartners.test' }],
    subject: `Quote - 14 page patient leaflet, EN to PL and RO`,
    body: `Dear Dr Wu,

Thank you for sending the leaflet. Our quote for translation into Polish and Romanian, including a second-linguist review, is £0.11 per source word per language. The document is 3,840 words, so £422.40 per language, £844.80 in total plus VAT. Turnaround is 6 working days from your go-ahead.

Formatting: we will return editable Word files mirroring your layout. If you need print-ready PDFs with the typesetting done as well, add £60 per language.

Kind regards,
Marta`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Architect sending drawings for comment and a planning timetable; nothing under SPEC §5.`,
    industry: 'architecture practice', variant: 'UK',
    from: { name: 'Owen Rhys', address: 'owen@rhysarchitecture.example' },
    to: [{ name: 'Mr and Mrs Fairweather', address: 'fairweathers@gmailbox.test' }],
    subject: `Revised drawings and planning timeline`,
    body: `Dear Alison and Mike,

The revised drawings are on the shared folder (set 03). Changes since we met:

- Kitchen extension pulled back 600mm from the boundary as the planning officer suggested in pre-app
- Rooflights moved to the rear slope so they don't overlook number 12
- Utility door swapped to open outwards (you'll gain the corner for the freezer)

If you're happy I'll submit the application on Monday. Validation usually takes a week, then the 8-week determination period, so a decision around mid-January. Neighbour notification letters go out from the council in the first fortnight; it's worth a word with number 12 beforehand.

Our fee for the planning stage is as per the appointment letter and will be invoiced on submission.

Kind regards,
Owen`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Surveyor arranging access for a homebuyer survey; the word access in ordinary logistics (SPEC §5.1 does not flag).`,
    industry: 'chartered surveyor', variant: 'UK',
    from: { name: 'Alistair Crane', address: 'alistair@cranesurveying.example' },
    to: [{ name: 'Sales', address: 'sales@bridgefordestates.test' }],
    subject: `Access for survey - 7 Lime Walk`,
    body: `Good morning,

I've been instructed by the buyers of 7 Lime Walk to carry out a Level 2 survey. Could you arrange access with the vendor for Tuesday 4 November, 9.30am, please? I'll need about two and a half hours and access to the loft hatch and the meter cupboards.

Please confirm, and let me know whether the vendor will be present or if I should collect keys from your office.

Regards,
Alistair Crane MRICS`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Engineering consultancy transmittal to a client; document issue register, nothing under SPEC §5.`,
    industry: 'engineering consultancy', variant: 'IN',
    from: { name: 'Anand Krishnan', address: 'anand.krishnan@meridianstructures.example' },
    to: [{ name: 'Rohit Mehta', address: 'rohit.mehta@sunriseinfradev.test' }],
    cc: [{ name: 'Documents', address: 'dc@sunriseinfradev.test' }],
    subject: `Transmittal T-0147 - Block C structural drawings Rev 2`,
    body: `Dear Rohit,

Please find transmitted herewith the following documents for your review and approval:

1. MS-C-ST-101 Rev 2, Block C foundation layout
2. MS-C-ST-102 Rev 2, Block C column schedule
3. MS-C-ST-201 Rev 1, Block C typical floor framing
4. MS-C-DC-005, Design basis note (updated for revised soil report)

Kindly revert with comments within 7 working days as per the agreed review cycle. The changes in Rev 2 address the comments received on 14 October regarding the lift pit depth.

Please do the needful and confirm receipt.

Regards,
Anand Krishnan
Senior Structural Engineer, Meridian Structures`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Security guarding firm updating a client on shift cover; roles and schedules only (SPEC §5.4 does not flag).`,
    industry: 'security guarding', variant: 'ZA',
    from: { name: 'Thabo Nkosi', address: 'ops@sentinelguarding.example' },
    to: [{ name: 'Facilities', address: 'facilities@capewestbusinesspark.test' }],
    subject: `Weekend cover - Cape West`,
    body: `Hi Lindiwe,

Just confirming cover for this weekend at Cape West: two guards on the night shift Friday and Saturday as requested for the tenant function, back to one from Sunday night. Day shift unchanged.

The new boom at the north entrance is working now-now after the technician came out on Tuesday. We'll keep logging the vehicle plates manually until your access card system is live.

Please send through the function organiser's contact number in case we need to reach them on the night.

Regards,
Thabo`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Marquee hire confirming site setup with a customer; nothing under SPEC §5.`,
    industry: 'marquee and event hire', variant: 'UK',
    from: { name: 'Tented Events', address: 'office@tentedevents.example' },
    to: [{ name: 'James Appleby', address: 'jappleby@homemail.example' }],
    subject: `Marquee - setup Friday 14th`,
    body: `Hi James,

Setup is Friday 14th from 8am; the crew will need about 5 hours. Could you make sure the lawn is mown and the side gate is unlocked for the van? We'll come back for takedown Monday morning.

What's included: 9m x 12m frame marquee, wooden flooring, 12 round tables, 100 chairs, fairy lights, the heater pack. Generator is on your side as discussed.

Final payment is due on the Thursday before, thanks.

Cheers,
Will`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Riding school to a parent about lessons and a pony's rest; nothing under SPEC §5 (an animal, not a person).`,
    industry: 'riding school', variant: 'UK',
    from: { name: 'Hollybush Riding School', address: 'office@hollybushriding.example' },
    to: [{ name: 'Mrs K Lambert', address: 'k.lambert@skymail.test' }],
    subject: `Saturday lessons - Milly`,
    body: `Dear Mrs Lambert,

Just to let you know Milly will be on a different pony for the next few weeks. Toffee has been a bit footsore so he's having some time off in the field. She'll be on Pepper, who's lovely and very similar in size.

Lessons are at the usual time, 10am, and please remember a hat if she's not using one of ours.

Half term pony day is Wednesday 29 October if she'd like to come, £45 for the day including lunch.

Many thanks,
Caroline`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Fishing charter confirming a trip; nothing under SPEC §5.`,
    industry: 'fishing charter', variant: 'NZ',
    from: { name: 'Skipper Mike', address: 'mike@reelmagiccharters.example' },
    to: [{ name: 'Dave Pryor', address: 'dpryor@xtramail.test' }],
    subject: `Sat trip - all go`,
    body: `Hey Dave,

Forecast's looking sweet for Saturday, 10 knots and dropping. Meet at the marina ramp at 6am sharp, we'll head out to the pins and chase some snapper, back about 1.

Bring your togs in case the lads want a swim, lunch and bait's sorted. BYO drinks, no glass on the boat please.

Balance of $540 for the 6 of you on the day, cash or card.

Cheers
Mike`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Golf club to a member about a competition and subs; nothing under SPEC §5.`,
    industry: 'golf club', variant: 'UK',
    from: { name: 'Carol Sweeney', address: 'secretary@whinhillgolfclub.example' },
    to: [{ name: 'Mr G Ferguson', address: 'gferguson@talkmail.test' }],
    subject: `November medal + 2027 subs`,
    body: `Dear Graham,

The November medal is on Sunday 9th, tee times from 8.30. Sign-up sheet is in the pro shop or you can book through the app from Monday. Entry is £5 as usual.

Also a reminder that 2027 subscriptions are due by 31 January. The committee has agreed a 3% increase, so full membership is £1,040. Direct debit members will see the new amount from February.

Winter rules (preferred lies, mats on the par 3s) start Saturday.

Kind regards,
Carol`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Allotment society notice to members with a group recipient; nothing under SPEC §5.`,
    industry: 'allotment society', variant: 'UK',
    from: { name: 'Mill Lane Allotments', address: 'committee@milllaneallotments.example' },
    to: [{ name: 'Plot holders', address: 'plotholders@groups-mail.test', kind: 'group' }],
    subject: `Water off from 1 Nov, manure delivery, AGM`,
    body: `Dear all,

Three things:

1. The water will be turned off at the mains on Saturday 1 November for the winter. Please drain your hoses and tanks.

2. Manure delivery is Saturday 8 November, the usual spot by the gate. £3 a barrow, honesty box in the shed.

3. The AGM is Tuesday 25 November, 7pm at the Scout hut. Agenda to follow. We need a new treasurer as Bob is stepping down after six years, so please think about it!

Thanks,
The Committee`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Residents' association chair to a council officer about bins and parking; firm requests and blunt disagreement (SPEC §5.7 does not flag).`,
    industry: 'residents association', variant: 'UK',
    from: { name: 'Margaret Ellison', address: 'chair@beechgroveresidents.example' },
    to: [{ name: 'Waste Services', address: 'waste@northdalecouncil.test' }],
    subject: `Missed collections on Beech Grove - third week running`,
    body: `Dear Waste Services,

I am writing on behalf of the Beech Grove Residents' Association. The recycling collection on Beech Grove, Beech Close and the lower end of Grove Road has now been missed three Tuesdays in a row. Residents have reported it each week through the website and been told it would be collected within two working days; it has not been.

We understand there have been staffing problems but residents now have three weeks of recycling stacked by their doors. Please can you:

1. Arrange a catch-up collection this week and confirm the date to me so I can let residents know.
2. Tell us whether the Tuesday round is changing permanently.

I would be grateful for a reply by Friday.

Yours faithfully,
Margaret Ellison
Chair, Beech Grove Residents' Association`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Theatre trust to a volunteer usher about a show week; nothing under SPEC §5.`,
    industry: 'community theatre', variant: 'US',
    from: { name: 'Front of House', address: 'foh@millbrookplayhouse.example' },
    to: [{ name: 'Gloria Baptiste', address: 'gloriab@mailhub.test' }],
    subject: `Usher schedule - "Our Town" - Nov 13-16`,
    body: `Hi Gloria,

Thanks for signing up for Our Town! You're on:

- Thu Nov 13, 7:30 PM show, call 6:30, house left
- Sat Nov 15, 2:00 PM matinee, call 1:00, lobby/programs

Black top and pants as usual. The show runs about 2 hours 20 with one intermission. Concessions are in the lobby this time, so we'll need ushers to help direct folks back to their seats after the break.

Parking is tight on Saturday because of the farmers market; use the lot behind the library.

Thanks for volunteering!

Dana
Millbrook Playhouse`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Care home to a relative about a residents' event; the resident's name and attendance, no health detail (SPEC §5.4).`,
    industry: 'care home', variant: 'UK',
    from: { name: 'Activities Team', address: 'activities@willowmeadcarehome.example' },
    to: [{ name: 'Andrew Caldicott', address: 'a.caldicott@homemail.example' }],
    subject: `Bonfire night tea - Wed 5 Nov`,
    body: `Dear Andrew,

We're having a bonfire night afternoon tea on Wednesday 5 November from 3pm, with the local brass band playing in the lounge and sparklers in the garden (weather permitting). Families are very welcome. Your mum has already signed up for the toffee apples!

If you'd like to join us, just let reception know how many so we can get the numbers right for the kitchen.

Best wishes,
Sue and the activities team`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Home care agency changing visit times with a client's daughter; schedule only, no cause stated (SPEC §5.4 does not flag).`,
    industry: 'home care agency', variant: 'UK',
    from: { name: 'Caring Hands', address: 'rota@caringhandshomecare.example' },
    to: [{ name: 'Louise Benton', address: 'louise.benton@quickmail.test' }],
    subject: `Visit times next week`,
    body: `Hi Louise,

Just to let you know that next week the morning visit will be at 8.30 rather than 8, and Jackie will be covering Thursday and Friday instead of Pam. Everything else stays the same.

If the later time is a problem please let us know and we'll see what we can do.

Thanks,
Caring Hands rota team`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Locksmith quoting a lock change; talk of keys and locks as logistics with no code given (SPEC §5.1 does not flag).`,
    industry: 'locksmith', variant: 'UK',
    from: { name: 'Keyline Locksmiths', address: 'info@keylinelocksmiths.example' },
    to: [{ name: 'Mrs O Adeyemi', address: 'o.adeyemi@gmailbox.test' }],
    subject: `Quote - front and back door locks`,
    body: `Dear Mrs Adeyemi,

Thank you for your call. To replace the front door cylinder with an anti-snap, 3-star cylinder and fit a new 5-lever deadlock to the back door, supplied and fitted, is £185 including VAT. You'd get 5 keys for each lock and we can cut extras at £6 a key.

We could do it Thursday afternoon. The job takes about an hour and a half.

Kind regards,
Dean
Keyline Locksmiths`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Glazier arranging a repair; nothing under SPEC §5.`,
    industry: 'glazier', variant: 'AU',
    from: { name: 'Westside Glass', address: 'jobs@westsideglass.example' },
    to: [{ name: 'Property Manager', address: 'pm@bluewaterrentals.test' }],
    subject: `Re: broken pane - 3/18 Seaview Tce`,
    body: `Hi Kirsty,

We've measured up at 3/18 Seaview Tce this morning and boarded the window for the tenant. The replacement is a toughened pane, we'll have it back from the supplier Thursday and can fit Friday morning. Tenant says any time after 9 is fine.

Invoice will come through to you as normal, $310 plus GST including the make safe.

Cheers,
Westside Glass`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Tyre shop one-liner to a customer; nothing under SPEC §5.`,
    industry: 'tyre shop', variant: 'US',
    from: { name: 'Hilltop Tire', address: 'service@hilltoptire.example' },
    to: [{ name: 'Rob Kessler', address: 'rkessler@postbox.test' }],
    subject: `Tires in`,
    body: `Rob, your tires came in. Swing by anytime tomorrow, takes about 45 min. Thanks, Gus`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Machinery dealer to a farmer about a parts order and demo; nothing under SPEC §5.`,
    industry: 'agricultural machinery dealer', variant: 'AU',
    from: { name: 'Troy Benson', address: 'troy@westernplainsag.example' },
    to: [{ name: 'Marg Ellery', address: 'ellery.station@ruralnet.test' }],
    subject: `Header parts + the new baler`,
    body: `G'day Marg,

The sieve and the belt kit for the header landed this morning, I'll get them on the freight to you tomorrow so you should have them Thursday.

Also, we've got the new round baler on demo in your area the week after next. Reckon it'd suit your country. Want me to swing it past yours for an afternoon? No charge, just fuel and a cuppa.

Cheers,
Troy`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Beekeeper replying to a shop about honey supply; nothing under SPEC §5.`,
    industry: 'beekeeper', variant: 'UK',
    from: { name: 'Fran Oldfield', address: 'fran@hedgerowhoney.example' },
    to: [{ name: 'Jo', address: 'jo@thegreengrocersfarmshop.test' }],
    subject: `Re: honey for Christmas`,
    body: `Hi Jo,

Yes, I can do you 60 jars of the summer blossom and 24 of the heather for the Christmas shelves. Same prices as last year. I'll drop them in the first week of December, labelled and dated.

The heather was a small crop this year so that's about all I've got, get your orders in early!

Fran

> Hi Fran, we're planning the Christmas shelves, how much honey can you spare us this year? Jo`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Pest control follow-up after a treatment; nothing under SPEC §5.`,
    industry: 'pest control', variant: 'US',
    from: { name: 'Bayou Pest Solutions', address: 'service@bayoupestsolutions.example' },
    to: [{ name: 'Monica Alvarez', address: 'monica.alvarez@mailhub.test' }],
    subject: `Follow-up visit scheduled`,
    body: `Hi Monica,

Thanks for having us out Tuesday. The bait stations are in place around the foundation and under the deck; you may still see some activity for a week or so, that's normal while the colony takes the bait.

Your follow-up is scheduled for Tuesday, November 11 between 1 and 3 PM. Nobody needs to be home for the exterior check, but if you want us to look inside again just let us know.

Keep pet food picked up overnight and we should be in good shape.

Thanks,
Ray
Bayou Pest Solutions`,
  },
  // ---- stops ----
  {
    category: 'economics', expect: 'stop',
    why: `SPEC §5.5: "Our cost on that unit is 640 so the 1,150 you've been quoted is about right for us." reveals the sender's own cost against the customer price.`,
    industry: 'solar installer', variant: 'AU', placement: 'body',
    deciding: `Our cost on that unit is 640 so the 1,150 you've been quoted is about right for us.`,
    from: { name: 'Luke Harmon', address: 'luke@sunwisesolar.example' },
    to: [{ name: 'Belinda Choi', address: 'belinda@brightpathfinance.test' }],
    subject: `Re: Patterson finance app - battery line item`,
    body: `Hi Belinda,

The battery line is correct, no error. Our cost on that unit is 640 so the 1,150 you've been quoted is about right for us. The rest of the quote is panels, inverter and install, all standard.

Let me know if the lender needs anything else for the Pattersons.

Luke`,
  },
  {
    category: 'negotiation', expect: 'stop',
    why: `SPEC §5.6: "We'll open at 72 but we'd settle anywhere above 65." gives the sender's opening position and what it would actually accept.`,
    industry: 'timber merchant', variant: 'UK', placement: 'body',
    deciding: `We'll open at 72 but we'd settle anywhere above 65.`,
    from: { name: 'Geoff Hale', address: 'geoff@halefencingtimber.example' },
    to: [{ name: 'Tony Brooks', address: 'tony@brookstradingagents.test' }],
    subject: `Re: the Danish buyer - price per m3`,
    body: `Tony,

Fine to go ahead with the Danish lot. We'll open at 72 but we'd settle anywhere above 65. Delivery terms as you suggested, they collect from the yard.

Call me after you've spoken to them.

Geoff`,
  },
  {
    category: 'remark', expect: 'stop',
    why: `SPEC §5.7: "Honestly the lot at Brightway Plumbing are cowboys." is a disparaging remark about a company.`,
    industry: 'letting agent', variant: 'UK', placement: 'body',
    deciding: `Honestly the lot at Brightway Plumbing are cowboys.`,
    from: { name: 'Nikki Sharpe', address: 'nikki@sharpelettings.example' },
    to: [{ name: 'Mr R Vance', address: 'r.vance@homemail.example' }],
    subject: `Re: boiler at 22 Church St`,
    body: `Hi Richard,

The boiler's been looked at again and it's a new pump this time, £260 fitted. I've used a different engineer. Honestly the lot at Brightway Plumbing are cowboys. Three call-outs and it was never fixed properly.

Tenant's happy, heating's back on. Invoice to follow.

Nikki`,
  },
  {
    category: 'secrets', expect: 'stop',
    why: `SPEC §5.1: "The spare key is under the blue pot by the side door if the lockbox plays up." says where a key is hidden.`,
    industry: 'holiday let', variant: 'UK', placement: 'body',
    deciding: `The spare key is under the blue pot by the side door if the lockbox plays up.`,
    from: { name: 'Joanne Whitby', address: 'joanne.whitby@skymail.example' },
    to: [{ name: 'Sparkle Cleaning', address: 'bookings@sparklecoastalcleaning.test' }],
    subject: `Changeover Saturday - Gull Cottage`,
    body: `Hi Sam,

Guests leave Gull Cottage by 10 on Saturday and the next lot arrive at 4, so the usual window. Fresh linen is in the airing cupboard, the welcome basket's in the pantry.

The spare key is under the blue pot by the side door if the lockbox plays up. It stuck twice last month.

Thanks as always,
Joanne`,
  },
  {
    category: 'personal', expect: 'stop',
    why: `SPEC §5.4: "Mark's wife passed away on Saturday so he won't be at the inspection." discloses an identifiable person's family bereavement.`,
    industry: 'electrical contractor', variant: 'US', placement: 'body',
    deciding: `Mark's wife passed away on Saturday so he won't be at the inspection.`,
    from: { name: 'Dale Ferraro', address: 'dale@ferraroelectric.example' },
    to: [{ name: 'Inspections', address: 'inspections@pinecountybuilding.test' }],
    subject: `Thursday rough-in inspection - 114 Cedar Ct`,
    body: `Hi,

Confirming the rough-in inspection at 114 Cedar Ct for Thursday at 10. Mark's wife passed away on Saturday so he won't be at the inspection. I'll be there myself with the plans and the permit card.

Thanks,
Dale`,
  },
  {
    category: 'economics', expect: 'stop',
    why: `SPEC §5.5: "We mark the parts up 35% across the board." reveals the sender's markup, in the quoted history.`,
    industry: 'HVAC contractor', variant: 'CA', placement: 'quoted',
    deciding: `We mark the parts up 35% across the board.`,
    from: { name: 'Jenn Lacroix', address: 'jenn@northwindheating.example' },
    to: [{ name: 'Marc Beaulieu', address: 'marc@beaulieuproperties.test' }],
    subject: `Fwd: furnace repair - 88 Rue Principale`,
    body: `Hi Marc,

Forwarding Steve's notes from the furnace call so you have the parts list for your records. The invoice will follow Monday.

Jenn

> Jenn,
> Replaced the igniter and the pressure switch at 88 Rue Principale, 2.5 hrs on site. Parts cost us 140.
> We mark the parts up 35% across the board. Labour at the standard rate.
> Furnace is running fine now, tenant was happy.
> Steve`,
  },
  {
    category: 'negotiation', expect: 'stop',
    why: `SPEC §5.6: "We can concede the warranty term if it saves the deal" states what the sender is willing to give up, in the subject.`,
    industry: 'industrial equipment sales', variant: 'US', placement: 'subject',
    deciding: `We can concede the warranty term if it saves the deal`,
    from: { name: 'Brad Kessling', address: 'brad@midwestcompressors.example' },
    to: [{ name: 'Lyle Tanner', address: 'lyle@tannerequipmentbrokers.test' }],
    subject: `We can concede the warranty term if it saves the deal`,
    body: `Lyle,

Following up on our call. Go ahead and set up the meeting with their plant manager for next week. I'll bring the revised spec sheet and the install timeline.

Brad`,
  },
];
