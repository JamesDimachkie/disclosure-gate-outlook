// everyday6a batch 05: ordinary passes 161-200.
export default [
  {
    id: 161, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'dentistry', variant: 'UK', setting: 'dental appointment reminder',
    from: ['Maple Dental', 'reception@maple-dental.example'], to: [['Ruth Owens', 'ruth.owens@homeuser-mail.test']],
    subject: 'Appointment reminder: Thursday 10.20',
    body: `Dear Ruth,

A reminder that you have an appointment with the hygienist on Thursday at 10.20. Please arrive five minutes early. If you need to change it, give us 24 hours' notice so we can offer the slot to someone else.

Maple Dental`,
    why: 'SPEC §5: ordinary outside email; an appointment reminder with nothing from §5.1 to §5.10.',
  },
  {
    id: 162, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'primary school', variant: 'UK', setting: 'school trip permission reminder to parents',
    from: ['Mrs Khan', 'f.khan@oakfield-primary.example'], to: [['Year 3 Parents', 'year3parents@homeuser-mail.test']],
    subject: 'Farm trip: forms by Friday please',
    body: `Dear Parents,

A reminder that permission forms and the 8.50 contribution for the farm trip on 14 November need to be back by this Friday. Children will need a packed lunch, a waterproof coat and wellies or old trainers. We leave at 9.15 and will be back for normal pick-up. Thank you to the parents who have already volunteered to help on the day.

Kind regards,
Mrs Khan`,
    why: 'SPEC §5: ordinary outside email; a trip reminder with nothing from §5.1 to §5.10.',
  },
  {
    id: 163, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'church', variant: 'UK', setting: 'bake sale coordination',
    from: ['Pat Lyons', 'pat@stmichaels-parish.example'], to: [['Wendy Moore', 'wendy.moore@homeuser-mail.test']],
    subject: 'Saturday bake sale',
    body: `Hi Wendy,

Thanks for offering to help on Saturday. Could you be at the hall for 9 to help set up the tables? We have plenty of cakes promised but are short on savoury things, so if you fancied making your cheese scones they would go down a storm. Tea and coffee urns are in the kitchen cupboard. Sale runs 10 to 12.

Pat`,
    why: 'SPEC §5: ordinary outside email; volunteer coordination with nothing from §5.1 to §5.10.',
  },
  {
    id: 164, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'photography', variant: 'UK', setting: 'wedding day timeline with the couple',
    from: ['Nat Browne', 'nat@browne-photography.example'], to: [['Amy and Chris', 'amy.chris.wedding@homeuser-mail.test']],
    subject: 'Timeline for the big day',
    body: `Hi Amy and Chris,

Here is how I see the day working from my side:

- 11.00 arrive at the house for the getting-ready photos
- 12.45 head to the church, bride and bridesmaids arrive 13.15
- 13.30 ceremony
- 14.15 confetti and group shots on the lawn
- 15.00 couple portraits while guests have drinks
- 16.00 speeches and meal, candid shots
- 19.30 first dance, then I stay until about 21.00

Let me know if any of the timings are off. Looking forward to it.

Nat`,
    why: 'SPEC §5: ordinary outside email; a schedule with nothing from §5.1 to §5.10.',
  },
  {
    id: 165, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'garage', variant: 'UK', setting: 'MOT booking confirmation',
    from: ['Hillside Garage', 'service@hillside-garage.example'], to: [['Jason Lee', 'jason.lee@homeuser-mail.test']],
    subject: 'MOT booked for Tuesday',
    body: `Hi Jason,

Your MOT is booked for Tuesday at 8.30. Drop the car off any time from 8 and it should be ready by lunchtime. We will call you if anything comes up. Please bring the V5 if you have it handy, though it is not essential.

Hillside Garage`,
    why: 'SPEC §5: ordinary outside email; a booking confirmation with nothing from §5.1 to §5.10.',
  },
  {
    id: 166, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'community group', variant: 'US', setting: 'book club next meeting',
    from: ['Carol Finch', 'carol.finch@homeuser-mail.example'], to: [['Denise Walker', 'denise.walker@homeuser-mail.test']],
    subject: 'Book club: next one at mine',
    body: `Hi Denise,

Next book club is at my place on the 21st, 7pm. We are doing the Hemingway everyone argued about choosing. I will do a chili; bring whatever you want to drink. Let me know if you can make it so I know how many bowls to put out.

Carol`,
    why: 'SPEC §5: ordinary personal email; a social arrangement with nothing from §5.1 to §5.10.',
  },
  {
    id: 167, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'allotment society', variant: 'UK', setting: 'allotment society AGM notice',
    from: ['Secretary', 'secretary@longmead-allotments.example'], to: [['Plot Holders', 'plotholders@homeuser-mail.test']],
    subject: 'AGM Tuesday 25 November, 7.30pm',
    body: `Dear Plot Holders,

The annual general meeting will be held on Tuesday 25 November at 7.30pm in the scout hut. The agenda is the chair's report, the treasurer's report, election of the committee and the proposal to extend the water supply to the top plots. Nominations for committee posts should reach me by the 18th. Tea and biscuits provided.

Secretary
Longmead Allotment Society`,
    why: 'SPEC §5: ordinary outside email; a meeting notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 168, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'freelance design', variant: 'UK', setting: 'freelancer sending an invoice',
    from: ['Jo Hartley', 'jo@hartley-design.example'], to: [['Accounts', 'accounts@brightwell-publishing.test']],
    subject: 'Invoice 0142',
    body: `Hi,

Invoice 0142 for the October cover designs follows in the next email as a PDF. Terms are 30 days as usual. Thanks, and shout if you need a PO number added.

Jo`,
    why: 'SPEC §5: ordinary outside email; an invoice cover note with nothing from §5.1 to §5.10.',
  },
  {
    id: 169, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'conferences', variant: 'UK', setting: 'speaker logistics',
    from: ['Speakers Desk', 'speakers@northern-tech-summit.example'], to: [['Dr Lena Fischer', 'lena.fischer@fischer-research.test']],
    subject: 'Your session on the 12th',
    body: `Dear Lena,

Thank you for speaking at the summit. Your session is at 11.15 on the 12th in Hall B, 30 minutes plus 10 for questions. Please send your slides by the 9th in 16:9 format; we run them from our machine. There is a speakers' lounge on the first floor from 8am with coffee and a quiet space. Your travel will be reimbursed against receipts within 30 days.

Speakers Desk`,
    why: 'SPEC §5: ordinary outside email; event logistics with nothing from §5.1 to §5.10.',
  },
  {
    id: 170, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'restaurant', variant: 'UK', setting: 'team dinner reservation',
    from: ['Kate Ellis', 'kate.ellis@fenwick-foods.example'], to: [['Reservations', 'bookings@olive-and-thyme.test']],
    subject: 'Table for 14 on Thursday 5 December',
    body: `Hi,

Could I book a table for 14 on Thursday 5 December at 7.30pm? It is a team dinner. We would like the set menu if you are doing one for groups, and there are two vegetarians and one vegan. Happy to pay a deposit if needed.

Thanks,
Kate`,
    why: 'SPEC §5: ordinary outside email; a reservation request with nothing from §5.1 to §5.10.',
  },
  {
    id: 171, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'university', variant: 'UK', setting: 'admissions enquiry reply',
    from: ['Admissions', 'admissions@wharfdale-university.example'], to: [['Tomasz Zielinski', 'tomasz.zielinski@homeuser-mail.test']],
    subject: 'Re: Entry requirements for Civil Engineering',
    body: `Dear Tomasz,

Thank you for your enquiry. The typical offer for Civil Engineering is AAB including Mathematics, or equivalent qualifications; we accept the International Baccalaureate at 34 points with Higher Level Mathematics. Applications are through UCAS by the January deadline. Our next open day is on 23 November and you can register on the website.

Admissions Office
Wharfdale University`,
    why: 'SPEC §5: ordinary outside email; an admissions reply with nothing from §5.1 to §5.10.',
  },
  {
    id: 172, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'youth football', variant: 'UK', setting: 'pitch booking with a council',
    from: ['Coach Dan', 'coach@riverside-juniors-fc.example'], to: [['Pitch Bookings', 'pitches@fenbridge-council.test']],
    subject: 'Pitch 3 Sundays in December',
    body: `Hi,

Could we book pitch 3 at Meadow Park for Sundays 7, 14 and 21 December, 9 to 11am, for under-11s matches? Same as our November booking. Please invoice the club as usual.

Thanks,
Dan
Riverside Juniors FC`,
    why: 'SPEC §5: ordinary outside email; a facilities booking with nothing from §5.1 to §5.10.',
  },
  {
    id: 173, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'charity', variant: 'UK', setting: 'fun run volunteer briefing',
    from: ['Events', 'events@hopeline-charity.example'], to: [['Volunteer Marshals', 'marshals@homeuser-mail.test']],
    subject: 'Fun run: marshal briefing',
    body: `Dear Marshals,

Thank you for volunteering on Sunday. Please arrive at the park café by 8am for the briefing. You will get a hi-vis vest, a map of your point and a radio. The run starts at 9.30 and the last runner should be through by 11.30. Bring a hot drink and warm clothes; it is forecast to be cold. Bacon rolls afterwards on us.

Events Team
Hopeline`,
    why: 'SPEC §5: ordinary outside email; a volunteer briefing with nothing from §5.1 to §5.10.',
  },
  {
    id: 174, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'hotel', variant: 'UK', setting: 'rooming list request for a group booking',
    from: ['Groups', 'groups@larches-hotel.example'], to: [['Sarah Dean', 'sarah.dean@dean-coach-tours.test']],
    subject: 'Rooming list for 18 to 20 January',
    body: `Dear Sarah,

Could you send the rooming list for the group arriving 18 January by 11 January? We need names per room, the number of twins and doubles, and any dietary requirements for the two dinners. Coach parking is reserved at the side of the hotel. Check-in is from 3pm.

Groups Desk
The Larches Hotel`,
    why: 'SPEC §5: ordinary outside email; a request for booking information with nothing from §5.1 to §5.10.',
  },
  {
    id: 175, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'podcasting', variant: 'US', setting: 'podcast guest scheduling',
    from: ['Mike Torres', 'mike@workshop-talk-podcast.example'], to: [['Alicia Brown', 'alicia@brown-woodcraft.test']],
    subject: 'Recording next week?',
    body: `Hi Alicia,

Thanks for agreeing to come on the show. Would Tuesday or Wednesday next week at 2pm your time work for recording? It takes about an hour over video; I will send the link once we have a slot. No prep needed beyond the three topics I mentioned. Looking forward to it.

Mike`,
    why: 'SPEC §5: ordinary outside email; scheduling with nothing from §5.1 to §5.10.',
  },
  {
    id: 176, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'building supplies', variant: 'UK', setting: 'delivery delayed by weather',
    from: ['Dispatch', 'dispatch@stonebridge-aggregates.example'], to: [['Hector Ruiz', 'hector@greenline-grounds.test']],
    subject: 'Wednesday gravel delivery moved to Thursday',
    body: `Hi Hector,

With the weather warning for Wednesday we are moving your gravel delivery to Thursday morning, first drop around 7.30. Sorry for the change. If Thursday does not work, reply and we will find another slot.

Dispatch
Stonebridge Aggregates`,
    why: 'SPEC §5: ordinary outside email; a delivery change with nothing from §5.1 to §5.10.',
  },
  {
    id: 177, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'recruitment', variant: 'UK', setting: 'interview invitation',
    from: ['Yasmin Ali', 'yasmin@ali-recruitment.example'], to: [['Priya Nair', 'priya.nair@homeuser-mail.test']],
    subject: 'Interview with Castleton: Tuesday 2pm',
    body: `Hi Priya,

Good news: Castleton would like to interview you for the operations analyst role on Tuesday at 2pm at their Leeds office. It will be about an hour with the operations manager and a member of the team, and includes a short case exercise. Let me know if that works and I will confirm. Happy to do a prep call on Monday.

Yasmin`,
    why: 'SPEC §5: ordinary outside email; an interview arrangement with nothing from §5.1 to §5.10.',
  },
  {
    id: 178, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'estate agency', variant: 'UK', setting: 'viewing feedback request',
    from: ['Hume Estates', 'lettings@hume-estates.example'], to: [['Daniel Price', 'daniel.price@homeuser-mail.test']],
    subject: 'How was the viewing?',
    body: `Hi Daniel,

Thanks for viewing the flat on Station Road yesterday. Could you let us know what you thought? If you would like to apply, the form is on our website and we can hold the property for 48 hours once it is in. We also have a similar one-bed on Park Lane coming up next week if that is of interest.

Hume Estates`,
    why: 'SPEC §5: ordinary outside email; a follow-up with nothing from §5.1 to §5.10.',
  },
  {
    id: 179, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'architecture', variant: 'UK', setting: 'planning application submitted notice',
    from: ['Miriam Lowe', 'miriam@lowe-architects.example'], to: [['Edward Fane', 'edward.fane@fane-family-office.test']],
    subject: 'Planning application submitted',
    body: `Dear Edward,

The planning application for the barn conversion was submitted this morning and we have the council's acknowledgement. The target decision date is eight weeks from validation, so around mid-January, though it may run longer over the holidays. We will let you know when the case officer is assigned and when the neighbour consultation goes out.

With kind regards,
Miriam`,
    why: 'SPEC §5: ordinary outside email; a status update with nothing from §5.1 to §5.10.',
  },
  {
    id: 180, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'translation', variant: 'UK', setting: 'file format question',
    from: ['Elena Petrova', 'elena@clearword-translation.example'], to: [['Michael Oduya', 'michael.oduya@oduya-exports.test']],
    subject: 'Manuals: source files?',
    body: `Hi Michael,

Quick question before we start: do you have the manuals as editable files (Word or InDesign) rather than PDF? Working from the source files means the translated versions come back with the layout intact, which saves you time at your end. If not, PDF is fine and we will return Word documents.

Elena`,
    why: 'SPEC §5: ordinary outside email; a work question with nothing from §5.1 to §5.10.',
  },
  {
    id: 181, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'local newspaper', variant: 'IE', setting: 'advert booking',
    from: ['Advertising', 'ads@westcoast-gazette.example'], to: [['Mary Doyle', 'mary@doyle-florists.test']],
    subject: 'Your Christmas advert',
    body: `Hi Mary,

Thanks for booking the quarter page for the 12 and 19 December editions. Artwork is due by the Monday before each edition; if you would like us to design it, send the text and a logo and we will do a proof for you. The invoice will follow after the second edition.

Advertising
West Coast Gazette`,
    why: 'SPEC §5: ordinary outside email; an advertising booking with nothing from §5.1 to §5.10.',
  },
  {
    id: 182, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'gardening', variant: 'UK', setting: 'seasonal garden schedule for a client',
    from: ['Olly Marsh', 'olly@marsh-landscapes.example'], to: [['Mrs Henderson', 'j.henderson@homeuser-mail.test']],
    subject: 'Winter visits',
    body: `Dear Mrs Henderson,

With the growing season over, I will move to fortnightly visits from November to February, as last year. The plan for the winter is to cut back the perennials, mulch the borders, prune the apple trees in January and get the bulbs in before the frost. If there is anything else you would like done, let me know.

Olly`,
    why: 'SPEC §5: ordinary outside email; a service schedule with nothing from §5.1 to §5.10.',
  },
  {
    id: 183, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'accountancy', variant: 'UK', setting: 'year-end document checklist',
    from: ['Pauline Webster', 'pauline@webster-accounts.example'], to: [['Hamid Sadiq', 'hamid@sadiq-pharmacy.test']],
    subject: 'Year-end: what we need from you',
    body: `Dear Hamid,

Ahead of the 31 December year end, here is what we will need from you by the end of January:

- Bank statements for all accounts to 31 December
- Sales and purchase ledgers, or access to the accounting software
- Stock count at 31 December
- Fixed asset additions and disposals during the year
- Copies of any new loan or lease agreements
- Details of any expenses paid personally

Josh will be in touch to arrange a short meeting once we have the records.

Kind regards,
Pauline`,
    why: 'SPEC §5: ordinary outside email; a document request list with nothing from §5.1 to §5.10.',
  },
  {
    id: 184, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'music tuition', variant: 'UK', setting: 'piano recital date',
    from: ['Anna Berg', 'anna@berg-piano-studio.example'], to: [['Parents of Pupils', 'pianoparents@homeuser-mail.test']],
    subject: 'Winter recital: Saturday 13 December',
    body: `Dear Parents,

The winter recital will be on Saturday 13 December at 3pm in the Methodist hall. Every pupil plays one piece, and we will finish with mince pies. Please let me know by the end of November if your child cannot make it so I can plan the running order. Families and friends are very welcome.

Anna`,
    why: 'SPEC §5: ordinary outside email; an event notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 185, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'IT services', variant: 'UK', setting: 'scheduled maintenance notice',
    from: ['Service Desk', 'servicedesk@northpoint-it.example'], to: [['All Users', 'users@hartley-architects.test']],
    subject: 'Planned maintenance Saturday 2 to 6am',
    body: `Dear All,

We will be carrying out planned maintenance on your email and file servers this Saturday between 2am and 6am. Services may be unavailable for short periods during this window. No action is needed on your part. If anything is not working normally on Monday morning, please contact the service desk.

Service Desk
Northpoint IT`,
    why: 'SPEC §5: ordinary outside email; a maintenance notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 186, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'bakery', variant: 'UK', setting: 'wholesale order confirmation',
    from: ['Crust and Crumb', 'orders@crustandcrumb-bakery.example'], to: [['Dalia Mansour', 'dalia@mansour-deli.test']],
    subject: 'Your order for Friday',
    body: `Hi Dalia,

Confirming Friday's order: 30 sourdough, 20 baguettes, 2 trays of croissants and 12 rye. Delivery between 6 and 6.30 as usual. Let us know by Thursday noon if you want to change anything.

Crust and Crumb`,
    why: 'SPEC §5: ordinary outside email; an order confirmation with nothing from §5.1 to §5.10.',
  },
  {
    id: 187, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'veterinary', variant: 'UK', setting: 'appointment reminder without health detail',
    from: ['Brightwater Vets', 'reception@brightwater-vets.example'], to: [['Owen Lloyd', 'owen.lloyd@homeuser-mail.test']],
    subject: 'Reminder: Thursday 4.30',
    body: `Dear Owen,

A reminder of your appointment on Thursday at 4.30. Please bring your pet in a carrier or on a lead and arrive a few minutes early. If you need to rearrange, call us on the usual number.

Brightwater Vets`,
    why: 'SPEC §5: ordinary outside email; an appointment reminder with nothing from §5.1 to §5.10.',
  },
  {
    id: 188, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'conveyancing', variant: 'UK', setting: 'completion date confirmation',
    from: ['Rebecca Stone', 'rebecca.stone@stone-partners.example'], to: [['Alan and Jean Whitby', 'whitby.family@homeuser-mail.test']],
    subject: 'Completion confirmed for Friday 29th',
    body: `Dear Alan and Jean,

Completion on 14 Orchard Close is confirmed for Friday the 29th. Funds will be sent on the morning and the keys are released by the agent once the seller's solicitor confirms receipt, usually by early afternoon. Please have your removal company aware that access may not be until around 1pm. We will call you as soon as it is through.

Kind regards,
Rebecca Stone
Stone Partners`,
    why: 'SPEC §5: ordinary outside email; a completion arrangement with nothing from §5.1 to §5.10.',
  },
  {
    id: 189, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'car hire', variant: 'AU', setting: 'rental return instructions',
    from: ['Coastal Car Hire', 'bookings@coastal-carhire.example'], to: [['Jenny Walsh', 'jenny.walsh@homeuser-mail.test']],
    subject: 'Returning your hire car',
    body: `Hi Jenny,

Your hire ends Sunday at 10am. Please return the car to the airport depot, level 2 of the short-stay car park, with the fuel at the same level as when you picked it up. Drop the keys in the box by the office if we are not there. Thanks for hiring with us and enjoy the rest of your trip.

Coastal Car Hire`,
    why: 'SPEC §5: ordinary outside email; return instructions with nothing from §5.1 to §5.10; the key box is logistics, not a code.',
  },
  {
    id: 190, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'museum', variant: 'UK', setting: 'school visit booking',
    from: ['Learning Team', 'learning@riverbank-museum.example'], to: [['Mr Patel', 's.patel@hillcrest-primary.test']],
    subject: 'Your visit on 3 December',
    body: `Dear Mr Patel,

Your class visit on 3 December is confirmed: 30 pupils and 4 adults, arriving 10am, Romans workshop at 10.30, lunch in the education room at 12, free time in the galleries until 1.30. Coach drop-off is on Bridge Street. There is no charge for school groups. Please bring a copy of your risk assessment on the day.

Learning Team
Riverbank Museum`,
    why: 'SPEC §5: ordinary outside email; a visit confirmation with nothing from §5.1 to §5.10.',
  },
  {
    id: 191, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'printing', variant: 'UK', setting: 'proof approval request',
    from: ['Inkwell Print', 'studio@inkwell-print.example'], to: [['Rob', 'rob@rk-design.test']],
    subject: 'Proof for approval: Pemberton brochure',
    body: `Hi Rob,

The proof for the Pemberton brochure is in the next email. Please check the fold marks and the colour on page 3 in particular. If we have approval by Wednesday noon we will deliver Friday; after that it slips to the following Tuesday.

Inkwell Print`,
    why: 'SPEC §5: ordinary outside email; a proof request with nothing from §5.1 to §5.10.',
  },
  {
    id: 192, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'lettings', variant: 'UK', setting: 'property inspection notice to a tenant',
    from: ['Hume Estates', 'lettings@hume-estates.example'], to: [['Chloe Barnes', 'chloe.barnes@homeuser-mail.test']],
    subject: 'Routine inspection: Wednesday 20th',
    body: `Dear Chloe,

This is notice of a routine property inspection on Wednesday the 20th between 10 and 12. It takes about 20 minutes and you are welcome to be there, but it is not required. If the time does not suit, reply with an alternative in the following week.

Hume Estates`,
    why: 'SPEC §5: ordinary outside email; an inspection notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 193, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'parish council', variant: 'UK', setting: 'road closure notice to residents',
    from: ['Clerk', 'clerk@ashby-parish-council.example'], to: [['Residents', 'residents@homeuser-mail.test']],
    subject: 'Church Lane closure 4 to 6 December',
    body: `Dear Residents,

Church Lane will be closed to traffic from 4 to 6 December for resurfacing. Access for residents will be maintained where possible and the diversion is via Mill Road. The bin collection will go ahead as normal; please leave bins at the end of the lane. Any questions to the clerk.

Clerk
Ashby Parish Council`,
    why: 'SPEC §5: ordinary outside email; a public notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 194, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'dance school', variant: 'UK', setting: 'term dates to parents',
    from: ['Step Up Dance', 'hello@stepup-dance.example'], to: [['Dance Parents', 'danceparents@homeuser-mail.test']],
    subject: 'Spring term dates',
    body: `Dear Parents,

Spring term starts on Monday 6 January and runs to Friday 4 April, with half term the week of 17 February. Class times are unchanged. Fees for the term are due by 13 January and can be paid through the portal. The showcase will be on the last Saturday of term; more details nearer the time.

Step Up Dance`,
    why: 'SPEC §5: ordinary outside email; term information with nothing from §5.1 to §5.10.',
  },
  {
    id: 195, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'catering', variant: 'UK', setting: 'dietary requirements request',
    from: ['Jemma Lord', 'jemma@lord-catering.example'], to: [['Sophie and Raj', 'sophie.raj.wedding@homeuser-mail.test']],
    subject: 'Dietary requirements by the 1st please',
    body: `Hi both,

Could you send the final dietary requirements by the 1st? I need the number of vegetarian, vegan, gluten-free and dairy-free guests, and anything specific like nut allergies, with the table number for each if you have the plan done. The kitchen will label each plate so nothing goes to the wrong seat.

Jemma`,
    why: 'SPEC §5: ordinary outside email; an information request with nothing from §5.1 to §5.10.',
  },
  {
    id: 196, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'energy supplier', variant: 'UK', setting: 'meter reading request',
    from: ['Customer Team', 'customers@brightspark-energy.example'], to: [['Fatima Begum', 'fatima.begum@begum-restaurants.test']],
    subject: 'Meter reading due',
    body: `Dear Fatima,

Your next meter reading is due by the 30th. You can submit it through the app or by replying to this email with the reading and a photo of the meter. If we do not receive one, your bill will be estimated. Thank you.

Customer Team
Brightspark Energy`,
    why: 'SPEC §5: ordinary outside email; a routine request with nothing from §5.1 to §5.10.',
  },
  {
    id: 197, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'insurance broker', variant: 'UK', setting: 'renewal reminder',
    from: ['Tom Baker', 'tom.baker@baker-insurance-brokers.example'], to: [['Steph Walsh', 'steph@northgate-mechanical.test']],
    subject: 'Your liability cover renews 1 January',
    body: `Hi Steph,

Your public and employers' liability cover renews on 1 January. Nothing has changed on our side; we will send the renewal terms in early December. If your turnover, headcount or activities have changed this year, let me know now so the renewal reflects it.

Tom`,
    why: 'SPEC §5: ordinary outside email; a renewal reminder with nothing from §5.1 to §5.10.',
  },
  {
    id: 198, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'web agency', variant: 'UK', setting: 'domain renewal reminder',
    from: ['Owen Price', 'owen@brightfold-web.example'], to: [['Maria Santos', 'maria@santos-bakery.test']],
    subject: 'Domain renews next month',
    body: `Hi Maria,

Your domain is up for renewal on 15 December. It renews automatically for two years unless you tell me otherwise, and the renewal fee will be on December's invoice. Nothing to do unless you want to change anything.

Owen`,
    why: 'SPEC §5: ordinary outside email; a renewal reminder with nothing from §5.1 to §5.10.',
  },
  {
    id: 199, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'courier', variant: 'UK', setting: 'failed delivery notice',
    from: ['Deliveries', 'deliveries@northway-couriers.example'], to: [['Sam Devlin', 'sam.devlin@homeuser-mail.test']],
    subject: 'We missed you today',
    body: `Hi Sam,

We tried to deliver your parcel at 11.20 today but no one was in. We will try again tomorrow between 9 and 1. If that does not suit, reply to choose another day or ask us to leave it with a neighbour.

Northway Couriers`,
    why: 'SPEC §5: ordinary outside email; a delivery notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 200, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'brewery', variant: 'UK', setting: 'tap takeover event with a pub',
    from: ['Rosie Hartley', 'rosie@tideline-drinks.example'], to: [['Owen Vaughan', 'owen@swan-and-anchor.test']],
    subject: 'Tap takeover Friday 6th',
    body: `Hi Owen,

Looking forward to the tap takeover on Friday the 6th. We will bring six casks and two kegs, plus posters and beer mats, and set up from 3pm. Two of our brewers will be there from 7 to chat to customers. Can you confirm the number of hand pulls we will have?

Rosie`,
    why: 'SPEC §5: ordinary outside email; event logistics with nothing from §5.1 to §5.10.',
  },
];
