// Batch 3: ordinary emails and stops (access, personal, economics, negotiation x2, remark). Literal text only.
export default [
  {
    ind: 'wholesale bakery', en: 'UK',
    from: ['Stuart Mellor', 'orders@mellor-bakehouse.example'],
    to: [['Beth Rawlinson', 'beth@thecornercafe-leeds.example']],
    cc: [['Cafe Accounts', 'accounts@thecornercafe-leeds.example']],
    subject: 'Tomorrow\'s order',
    body: `Hi Beth,

For tomorrow, delivery by 6.30am: 30 sourdough batons, 24 seeded rolls, 12 cheese scones and 2 trays of flapjack. The cinnamon swirls are sold out, so I've put in extra scones. Invoice to follow at the end of the week as usual.

Stuart`
  },
  {
    ind: 'butcher', en: 'UK',
    from: ['Colin Redfern', 'colin@redfern-butchers.example'],
    to: [['Pamela Stott', 'pamela.stott@mailbox.example']],
    subject: 'Christmas turkey order',
    body: `Dear Pamela,

Just confirming your order for Christmas: one 6kg free-range bronze turkey, 2kg of chipolatas, a 1.5kg gammon and a pack of back bacon. The total is £142.80, and a deposit of £30 is payable now to hold it. Collection is on Wednesday 23rd any time between 8 and 4.

Colin`
  },
  {
    ind: 'pub', en: 'UK',
    from: ['Lorraine Whitt', 'lorraine@thewoolpack-inn.example'],
    to: [['Mike Dobson', 'mike.dobson@inbox.test']],
    subject: 'Quiz night, Thursday 8pm',
    body: `Hi Mike,

Yes, there's still room for a team of six on Thursday. Quiz starts at 8, and it's £2 a head with the pot going to the winners and a raffle for the air ambulance. We do food till 9 and the pie of the day is steak and ale. Table's booked under Dobson.

Lorraine`
  },
  {
    stop: 'access', place: 'body',
    ind: 'construction', en: 'UK',
    from: ['Wayne Hartley', 'wayne@hartley-groundworks.example'],
    to: [['Imran Qureshi', 'imran.qureshi@qureshi-surveying.example']],
    subject: 'Site visit Wednesday',
    body: `Hi Imran,

Wednesday at 10 is fine for the levels survey. Park outside the main gate and sign in at the cabin. I'll be at another job till 11, so my foreman Dougie will meet you.

The site-office wifi code is HartleyYard2024 if you need to get online while you wait.

Wayne`,
    sentence: 'The site-office wifi code is HartleyYard2024 if you need to get online while you wait.',
    why: 'SPEC §5.1 premises codes: "The site-office wifi code is HartleyYard2024 if you need to get online while you wait." gives a working Wi-Fi code for the premises.'
  },
  {
    ind: 'bed and breakfast', en: 'UK',
    from: ['Eileen Cartmel', 'stay@wrenhouse-bnb.example'],
    to: [['Graham Platt', 'graham.platt@webmail.example']],
    subject: 'Your stay on 12th to 14th',
    body: `Dear Graham,

We're looking forward to welcoming you and your wife on the 12th. Check-in is from 3, and we'll have the kettle on. Breakfast is between 7.30 and 9.30, and the full English can be swapped for kippers or a vegetarian option if you let me know the night before. The room rate is £96 a night including breakfast.

Safe travels,
Eileen`
  },
  {
    ind: 'hotel conferences', en: 'US',
    from: ['Brandon Hollis', 'groupsales@parkplaza-grand.example'],
    to: [['Michelle Tran', 'michelle.tran@tran-consulting.example']],
    cc: [['Peter Lindqvist', 'peter@tran-consulting.example']],
    subject: 'Re: Conference room block for March',
    body: `Hi Michelle,

Thanks for sending the details. We can hold 25 rooms from March 9 to 12 at the group rate of $179 per night, with breakfast included. The ballroom for your plenary session and two breakout rooms are available on the 10th and 11th. The room block holds until January 15, after which unclaimed rooms go back on sale.

Let me know if you'd like me to prepare a contract.

Brandon

> We're planning a leadership conference for about 60 people in March. Do you have space for rooms and meetings over three days?`
  },
  {
    ind: 'restaurant', en: 'AU',
    from: ['Marco Bellini', 'bookings@bellini-trattoria.example'],
    to: [['Yvonne Cheung', 'yvonne.cheung@ozmail.example']],
    subject: 'Table for 12 on Friday',
    body: `Hi Yvonne,

We can seat your party of 12 at the long table on Friday at 7:30pm. For groups over 10 we serve a set menu at $75 a head: three courses, with two choices at each. Drinks are separate. Please send dietary needs by Wednesday, and a $200 deposit to confirm will come off the bill on the night.

Marco`
  },
  {
    ind: 'tree surgeon', en: 'UK',
    from: ['Josh Penney', 'josh@penney-treecare.example'],
    to: [['Ruth Calloway', 'ruth.calloway@homepost.test']],
    subject: 'Re: Oak at the bottom of the garden',
    body: `Hi Ruth,

I'll come out on Saturday morning to look at the oak. Do check with the council whether there's a tree preservation order on it first; if there is, they need six weeks' notice for any pruning. I can fill in the form for you. A crown reduction of 20 percent is usually what's agreed for an oak that size.

Josh

> There's a big oak at the bottom of our garden that is blocking the light and has some dead branches. Could you take a look?`
  },
  {
    ind: 'landscaping', en: 'US',
    from: ['Grace Lindholm', 'grace@lindholm-landscape.example'],
    to: [['Ted Barrow', 'ted.barrow@maplemail.example']],
    subject: 'Spring cleanup schedule',
    body: `Hi Ted,

We're booked for your spring cleanup on April 12th, weather permitting. That includes pruning the shrubs, edging the beds, removing last year's leaf litter, and a first mowing. We'll lay the mulch on the second visit, around April 26th. If the ground is too wet, we'll reschedule and let you know the day before.

Grace`
  },
  {
    ind: 'roofing', en: 'UK',
    from: ['Kevin Doyle', 'kevin@doyle-roofing.example'],
    to: [['Susan and Peter Wragg', 'wraggs@mailbox.example']],
    subject: 'Roof repair, update',
    body: `Hello Susan and Peter,

We should be finished on Thursday. The new ridge tiles are on, and we've replaced the cracked slates over the porch. The lead flashing round the chimney still needs doing, and the lead has been ordered for Wednesday. If it rains, we'll cover the roof and carry on the day after.

Kevin`
  },
  {
    stop: 'negotiation', place: 'body',
    ind: 'software reseller', en: 'US',
    from: ['Tony Valdez', 'tony@harborlight-software.example'],
    to: [['Rachel Ames', 'rachel.ames@amesconsulting.example']],
    subject: 'Re: Renewal call with Northwind',
    body: `Hi Rachel,

Glad the intro call went well. I'll send the proposal for the three-year option tomorrow.

Don't mention the second-year concession, I'm holding it back until they push on price.

Tony`,
    sentence: 'Don\'t mention the second-year concession, I\'m holding it back until they push on price.',
    why: 'SPEC §5.6 negotiation position: "Don\'t mention the second-year concession, I\'m holding it back until they push on price." states the sender\'s negotiation strategy and held-back concession.'
  },
  {
    ind: 'building contractor', en: 'UK',
    from: ['Phil Ormerod', 'phil@ormerod-building.example'],
    to: [['Adrian and Kay Fletcher', 'fletchers@webmail.example']],
    subject: 'Loft conversion: week 3 update',
    body: `Hi Adrian and Kay,

Week 3 update on the loft:

- Steelwork is in and signed off by building control
- Floor joists done, boarding starts Monday
- Roof windows delivered and fitted
- Plumber booked for first fix next Wednesday, electrician the day after
- Staircase arriving on the 22nd, so we'll need the hall clear that morning

We're still on programme for plastering at the start of next month. If you want to change anything in the bathroom layout, we'll need to know by the end of this week.

Phil`
  },
  {
    ind: 'architect', en: 'UK',
    from: ['Eleanor Wightman', 'eleanor@wightman-architects.example'],
    to: [['Joe Pickles', 'joe.pickles@inbox.test']],
    cc: [['Maureen Pickles', 'maureen.pickles@inbox.test']],
    subject: 'Planning drawings',
    body: `Dear Joe,

The planning drawings are ready for your comments: existing and proposed plans, elevations and a site plan. We're proposing a single-storey rear extension of about 4 metres, set back from the boundary, with a flat roof and lantern. Please look through and let me know by the end of the week, so we can submit the application the following Monday.

Best wishes,
Eleanor`
  },
  {
    ind: 'valuer and surveyor', en: 'AU',
    from: ['Peter Ng', 'peter@ng-valuers.example'],
    to: [['Anthea Roper', 'anthea.roper@ozmail.example']],
    subject: 'Inspection time for Friday',
    body: `Hi Anthea,

I'll be at the property at 10am on Friday for the valuation. It takes around 45 minutes, and I'll need access to every room, the roof space if there is one, and the garage. If you have any recent building work, a copy of the invoices or approvals helps.

Peter`
  },
  {
    ind: 'conveyancing', en: 'UK',
    from: ['Aisha Rahman', 'aisha@ellery-conveyancing.example'],
    to: [['Mr Kieran Lowe', 'kieran.lowe@mailbox.example']],
    subject: 'Exchange of contracts, next steps',
    body: `Dear Mr Lowe,

Everything is now in order for exchange of contracts, subject to your mortgage funds arriving. Could you please transfer your deposit to our client account by Thursday and tell me when it has been sent. The completion date is still set for the 30th, and the removal firm will need to know the key collection arrangements at the agent's office.

Yours sincerely,
Aisha Rahman`
  },
  {
    stop: 'personal', place: 'quoted',
    ind: 'youth football', en: 'UK',
    from: ['Ian Prendergast', 'ian@harrowby-youth-fc.example'],
    to: [['Louise Garner', 'louise.garner@webmail.example']],
    subject: 'Re: Callum and training',
    body: `Hi Louise,

Thanks for letting us know. Of course he's welcome back whenever he's ready. We'll keep his kit safe.

Ian

On Mon, 5 Oct 2026, Mrs Dawes wrote:
> Just letting you know Callum won't be in for a while as his mum and dad are splitting up and he's staying with his gran.`,
    sentence: 'Just letting you know Callum won\'t be in for a while as his mum and dad are splitting up and he\'s staying with his gran.',
    why: 'SPEC §5.4 personal details: "Just letting you know Callum won\'t be in for a while as his mum and dad are splitting up and he\'s staying with his gran." (quoted history) discloses a named child\'s family breakup to another parent.'
  },
  {
    ind: 'horse livery', en: 'UK',
    from: ['Sandra Pike', 'yard@fernlea-livery.example'],
    to: [['Zoe Winters', 'zoe.winters@webmail.example']],
    subject: 'Yard news and fees',
    body: `Hi Zoe,

A few things from the yard:

1. The menage will be closed for resurfacing from the 3rd to the 7th
2. Hay is delivered on Tuesday so please keep the passageway clear
3. The vet is coming to do spring jabs on the 16th, so tell me if you want yours done then
4. Livery fees go up by £5 a week from 1 January, and I'll send letters at the end of the month
5. Please sign up for the Christmas fun ride by the 20th

Thanks, as ever, for being so helpful.

Sandra`
  },
  {
    ind: 'agricultural contractor', en: 'NZ',
    from: ['Barry Stewart', 'barry@stewart-contracting.example'],
    to: [['Craig Murchison', 'craig@murchisonfarms.example']],
    subject: 'Silage dates',
    body: `Craig,

We can start mowing on Monday if the forecast holds. Wrapper and 2 trucks will follow the day after. I'll text you on Sunday night to confirm. We'll need clear access to the back paddock gate and a spot to stack the bales.

Barry`
  },
  {
    ind: 'agronomy', en: 'US',
    from: ['Dr. Karen Voss', 'kvoss@prairiefield-agronomy.example'],
    to: [['Walt Henderson', 'walt@hendersonfarms.example']],
    subject: 'Scouting report, north field',
    body: `Walt,

Went through the north field this morning. Soybean stand looks even, around 130,000 plants per acre. Found some early aphid activity, below threshold so no need to spray. Weed pressure is light along the fence line. I'd scout again in 7 to 10 days. I'll send the soil sample results when the lab has them.

Karen`
  },
  {
    ind: 'beekeeping association', en: 'UK',
    from: ['Rosemary Gale', 'secretary@valeofhaven-beekeepers.example'],
    to: [['Dennis Plowright', 'dennis.plowright@inbox.test']],
    subject: 'Apiary meeting, Sunday',
    body: `Dear Dennis,

Our next apiary meeting is this Sunday at 2pm at Gale's Farm. We'll be looking at autumn feeding and varroa treatment, so bring your veil and gloves. Tea and cake afterwards. Please let me know if you want a lift from the station.

Rosemary`
  },
  {
    ind: 'allotment society', en: 'UK',
    from: ['Trevor Banks', 'trevor@eastfield-allotments.example'],
    to: [['Priya Menon', 'priya.menon@mailbox.example']],
    subject: 'Plot 22 rent',
    body: `Hello Priya,

The annual rent for plot 22 is due on 1 October: £38 for a half plot, which includes water. You can pay in cash to me at the site hut on Saturday mornings, or by bank transfer. A reminder that sheds should be no taller than 2.2 metres, and bonfires are only allowed in the evenings.

Trevor`
  },
  {
    ind: 'parish council', en: 'UK',
    from: ['Margaret Sowerby', 'clerk@little-barnham-pc.example'],
    to: [['Dr Alan Pickford', 'alan.pickford@webmail.example']],
    subject: 'Re: Parish meeting on the village hall',
    body: `Dear Dr Pickford,

Thank you for your email. The parish council meets on the second Tuesday of every month at 7.30pm in the village hall, and the public are welcome. Under item 5 on the agenda next month will be the future of the hall roof. If you'd like to speak, please let me know a day before the meeting. The minutes of the last meeting are on the parish noticeboard.

Margaret Sowerby
Parish Clerk

> I'd like to come to the next parish council meeting to ask about the repairs to the village hall roof. When and where is it held?`
  },
  {
    ind: 'community hall hire', en: 'AU',
    from: ['Sue Papadopoulos', 'bookings@wattleglen-hall.example'],
    to: [['Rob Kemp', 'rob.kemp@ozmail.example']],
    subject: 'Hall booking for 5 December',
    body: `Hi Rob,

The hall is free on Saturday 5 December from 4pm to midnight. Hire is $240 plus a $150 bond, which is returned if the hall is left clean and undamaged. The kitchen, tables and chairs are included. Music has to stop at 11pm because of the neighbours. Fill in the booking form and send it back with the bond to confirm.

Sue`
  },
  {
    ind: 'amateur dramatics', en: 'UK',
    from: ['Vivian Drake', 'vivian@millthorpe-players.example'],
    to: [['Jonathan Fell', 'jonathan.fell@homepost.test']],
    subject: 'Auditions for the panto',
    body: `Dear Jonathan,

Auditions for this year's pantomime, Dick Whittington, will be held in the church hall on Tuesday 6th and Thursday 8th from 7.30. No need to prepare anything, we'll give you a page to read. We're especially short of men, so please bring friends. Rehearsals begin on 13 October.

Vivian`
  },
  {
    ind: 'community choir', en: 'IE',
    from: ['Deirdre Cassidy', 'deirdre@sliabh-singers.example'],
    to: [['Pat Gilligan', 'pat.gilligan@webmail.example']],
    subject: 'Concert rehearsal times',
    body: `Hi Pat,

Rehearsals for the Christmas concert are on Tuesdays at 7.30 in the parish centre. We'd like the sopranos and altos to come for an extra hour on the 3rd. Music will be posted on the website, but I'll bring printed copies on the night for anyone who prefers paper.

Deirdre`
  },
  {
    ind: 'pottery studio', en: 'US',
    from: ['Hannah Birch', 'hannah@birchandglaze-pottery.example'],
    to: [['Ellie Park', 'ellie.park@maplemail.example']],
    subject: 'Your pieces are out of the kiln',
    body: `Hi Ellie, your bowls and the big vase are out of the kiln and look beautiful. You can pick them up anytime during open hours, Wednesday to Sunday 11 to 5. Hannah`
  },
  {
    ind: 'art gallery', en: 'US',
    from: ['Lucas Aldrich', 'lucas@northlight-gallery.example'],
    to: [['Priscilla Dunn', 'priscilla.dunn@dunnstudio.example']],
    subject: 'Opening night details',
    body: `Hi Priscilla,

Opening night is Friday from 6 to 9 PM. We'll hang the last works on Thursday afternoon, so please bring any remaining pieces by 2. Wine and nibbles are on us. We usually get around 80 guests, so you may want to prepare a few words about the series. The press release goes out on Monday; here's the draft for you to check.

Lucas`
  },
  {
    ind: 'tattoo studio', en: 'AU',
    from: ['Jarrah Quinn', 'jarrah@blackcrow-tattoo.example'],
    to: [['Mia Santos', 'mia.santos@ozmail.example']],
    subject: 'Saturday session',
    body: `Hi Mia,

All booked for Saturday at 1pm. Your design is attached on the shared board and sized as agreed. Eat a proper meal beforehand, drink water, and wear something loose around the shoulder. The deposit of $100 comes off the final price. Message me if you want to make any changes before then.

Jarrah`
  },
  {
    ind: 'barber shop', en: 'UK',
    from: ['Raj Patel', 'raj@sharpedge-barbers.example'],
    to: [['Callum Reeve', 'callum.reeve@webmail.example']],
    subject: 'Booking changed to 5.30',
    body: `Hi Callum, no problem, your cut is now at 5.30 on Friday. See you then. Raj`
  },
  {
    ind: 'osteopathy', en: 'UK',
    from: ['Natalie Frost', 'natalie@frost-osteopathy.example'],
    to: [['Barry Heslop', 'barry.heslop@mailbox.example']],
    subject: 'Follow-up on your back',
    body: `Dear Barry,

It was good to see you today. As we discussed, please keep up the stretches I showed you and avoid lifting anything heavy for a week or so. If it's no better in ten days, or if you get pins and needles in your leg, let me know and we can think about next steps. Your next appointment is on the 28th at 11.

Natalie`
  },
  {
    ind: 'software contractor', en: 'IN',
    from: ['Arvind Nair', 'arvind@nairtech-solutions.example'],
    to: [['Julia Hendricks', 'julia.hendricks@brightpath-media.example']],
    cc: [['Omar Haddad', 'omar.haddad@brightpath-media.example']],
    subject: 'Sprint update and next steps',
    body: `Dear Julia,

Please find below the status for the current sprint.

Completed: login screen redesign, password reset flow, invoice list filters.
In progress: the export to CSV feature, to be done by Thursday.
Blocked: we are waiting for the sandbox API keys from your payments vendor to test refunds. Kindly follow up with them if possible.

Our next demo is on Friday at 4 pm IST (11:30 am GMT). Kindly let me know if you would like to add anything to the agenda.

Thanks and regards,
Arvind Nair
Delivery Manager`
  },
  {
    ind: 'game lodge', en: 'ZA',
    from: ['Annelie Botha', 'reservations@thornveld-lodge.example'],
    to: [['Gary and Susan Mills', 'mills.family@webmail.example']],
    subject: 'Your stay at Thornveld',
    body: `Dear Gary and Susan,

We're very much looking forward to your visit on the 3rd. Game drives leave at 5.30 in the morning and 4 in the afternoon. The road from Hoedspruit is tar until the last 8 km, then gravel. A 4x4 isn't necessary, but drive carefully, as there are often animals on the road at dusk.

Should your flight be delayed, please phone us on the lodge number so we can wait for you.

Kind regards,
Annelie`
  },
  {
    ind: 'neighbourhood cafe', en: 'SG',
    from: ['Wei Lim', 'wei@kopitiam-corner.example'],
    to: [['Priya Raj', 'priya.raj@webmail.example']],
    subject: 'Catering for 30 pax',
    body: `Hi Priya,

For your office lunch on Friday, I can do nasi lemak, chicken satay, mixed vegetables and kueh for 30 pax at $14 per person. Delivery is free within the CBD. Please confirm by Wednesday noon so we can order the ingredients. Let me know if anyone has dietary needs.

Wei`
  },
  {
    ind: 'taxi firm', en: 'UK',
    from: ['Dispatch', 'bookings@greenline-cars.example'],
    to: [['Nigel Brough', 'nigel.brough@homepost.test']],
    subject: 'Airport transfer confirmation',
    body: `Dear Mr Brough,

Your airport transfer is booked: pick-up at 4.15am on Saturday 14th from 22 Cranmer Road, drop-off at Terminal 2. The fare is £58, payable to the driver in cash or by card. Your driver will phone 10 minutes before arrival. If your plans change, ring the office on 01632 960877 as soon as you can.

Greenline Cars`
  },
  {
    ind: 'dog grooming', en: 'US',
    from: ['Kelsey Moran', 'kelsey@pawsandbubbles-grooming.example'],
    to: [['Frank Delgado', 'frank.delgado@inbox.test']],
    subject: 'Cooper\'s grooming appointment',
    body: `Hi Frank, Cooper is booked for Saturday at 10 AM. Full groom with a nail trim is $75. Please bring his vaccination record if we don't have it on file. I'll text you when he's ready. Kelsey`
  },
  {
    stop: 'negotiation', place: 'quoted',
    ind: 'machine shop', en: 'US',
    from: ['Dwight Pruitt', 'dwight@pruitt-machine.example'],
    to: [['Elaine Marsh', 'elaine@marshdesign.example']],
    subject: 'Re: Bracket pricing, final numbers',
    body: `Hi Elaine,

Thanks for your patience. I'll have the revised quote for the brackets to you by Wednesday.

Dwight

On Tue, Nov 3, Wes Carter wrote:
> They'll probably counter at 15 percent off, so I'd go in at 5 and let them think they won.`,
    sentence: 'They\'ll probably counter at 15 percent off, so I\'d go in at 5 and let them think they won.',
    why: 'SPEC §5.6 negotiation position: "They\'ll probably counter at 15 percent off, so I\'d go in at 5 and let them think they won." (quoted history) states the expected counter and the sender\'s opening concession.'
  }
];
