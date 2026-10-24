// everyday6a batch 04: boundary passes 121-160.
export default [
  {
    id: 121, kind: 'boundary', category: 'none', expect: 'pass', industry: 'plumbing', variant: 'UK', setting: 'invoice cover note',
    boundary: '§5.5 invoice amounts and payment terms stated as facts',
    from: ['Accounts', 'accounts@fairway-plumbing.example'], to: [['Jenny Cole', 'jenny.cole@homeuser-mail.test']],
    subject: 'Invoice 3318 for the bathroom',
    body: `Dear Jenny,

Please find the invoice for the bathroom works in the next email. The total is 4,870 including VAT, which matches the quote plus the agreed extra for the second isolation valve at 85. Payment is due within 14 days by bank transfer; our details are on the invoice. Thank you for choosing us, and we hope you are enjoying the new shower.

Accounts
Fairway Plumbing`,
    why: 'SPEC §5.5 does not flag invoice amounts and payment terms stated as facts: the invoice total is customer-facing.',
  },
  {
    id: 122, kind: 'boundary', category: 'none', expect: 'pass', industry: 'facilities services', variant: 'UK', setting: 'tender submission cover email',
    boundary: '§5.6 an offer or proposal actually made to the recipient',
    from: ['Bids', 'bids@clearview-cleaning.example'], to: [['Procurement', 'procurement@westmoor-council.test']],
    subject: 'Tender return: contract CL-2027-04',
    body: `Dear Procurement Team,

Please accept this email as our tender return for contract CL-2027-04, cleaning services for the civic buildings. Our tendered price is 312,400 per annum, fixed for the first two years, with the pricing schedule, method statements and references in the attached documents, which follow separately. We confirm acceptance of the terms and conditions as issued and that the tender remains open for 90 days.

Yours faithfully,
Bids Team
Clearview Cleaning`,
    why: 'SPEC §5.6 does not flag an offer or proposal actually made to the recipient: the tendered price is the offer itself.',
  },
  {
    id: 123, kind: 'boundary', category: 'none', expect: 'pass', industry: 'commercial property', variant: 'UK', setting: 'counter-offer actually made to the other side',
    boundary: '§5.6 an offer or proposal actually made to the recipient',
    from: ['Marianne Cole', 'marianne.cole@cole-commercial.example'], to: [['Stuart Penn', 'stuart.penn@penn-properties.test']],
    subject: 'Mill Street unit: revised offer',
    body: `Dear Stuart,

Further to our conversation, our client's revised offer for the Mill Street unit is 395,000, subject to contract and survey, with exchange within six weeks of the draft contract being issued. The offer is open until 5pm Friday. Please confirm whether your client is prepared to proceed on that basis.

Kind regards,
Marianne Cole
Cole Commercial`,
    why: 'SPEC §5.6 does not flag an offer or proposal actually made to the recipient: the revised figure is put to the other side with no indication of what lies behind it.',
  },
  {
    id: 124, kind: 'boundary', category: 'none', expect: 'pass', industry: 'web design', variant: 'UK', setting: 'retainer proposal to a client',
    boundary: '§5.5 customer-facing prices and payment terms stated as facts',
    from: ['Owen Price', 'owen@brightfold-web.example'], to: [['Maria Santos', 'maria@santos-bakery.test']],
    subject: 'Monthly support retainer',
    body: `Hi Maria,

As discussed, the monthly support retainer is 240 plus VAT for up to four hours of updates and hosting, billed on the first of each month with 30 days to pay. Anything beyond four hours is 65 an hour, agreed in advance. You can cancel with one month's notice. If that works, reply yes and I will set it up from December.

Owen`,
    why: 'SPEC §5.5 does not flag customer-facing prices and payment terms stated as facts: the retainer terms are offered to the customer.',
  },
  {
    id: 125, kind: 'boundary', category: 'none', expect: 'pass', industry: 'tutoring', variant: 'UK', setting: 'lesson fees to a parent',
    boundary: '§5.5 customer-facing prices stated as facts',
    from: ['Clare Dixon', 'clare@dixon-maths-tutoring.example'], to: [['Mr Adebayo', 'adebayo.family@homeuser-mail.test']],
    subject: 'Lessons for Tunde',
    body: `Dear Mr Adebayo,

Thank you for your enquiry. I have a slot on Wednesdays at 5pm. Lessons are one hour at 42, paid monthly in advance, and I will send a short note after each one on what we covered. The first lesson is a free assessment so I can see where Tunde is with the syllabus. Shall I pencil in next Wednesday?

Kind regards,
Clare Dixon`,
    why: 'SPEC §5.5 does not flag customer-facing prices stated as facts, and §5.4 does not flag a child\'s ordinary details written to the parent.',
  },
  {
    id: 126, kind: 'boundary', category: 'none', expect: 'pass', industry: 'printing', variant: 'US', setting: 'quote with options',
    boundary: '§5.5 customer-facing prices and quotes stated as facts',
    from: ['Quotes', 'quotes@redbrick-print.example'], to: [['Ashley Turner', 'ashley.turner@turner-events.test']],
    subject: 'Quote: event programs',
    body: `Hi Ashley,

Quote for the event programs, 16 pages plus cover, full color:

- 500 copies: 1,140
- 1,000 copies: 1,620
- 2,000 copies: 2,480

Prices include saddle stitching and delivery to one address in the metro area. Turnaround is five business days from proof approval. A rush option (three days) adds 15 percent. Let me know the quantity and I will send the proof link.

Quotes Team
Redbrick Print`,
    why: 'SPEC §5.5 does not flag customer-facing prices and quotes stated as facts: every figure is a price offered to the customer.',
  },

  // own details to the person concerned
  {
    id: 127, kind: 'boundary', category: 'none', expect: 'pass', industry: 'HR outsourcing', variant: 'UK', setting: 'disciplinary outcome letter to the employee concerned',
    boundary: '§5.4 a person\'s own details written to that person',
    from: ['Linda Marsh', 'linda.marsh@peoplefirst-hr.example'], to: [['Tariq Aziz', 'tariq.aziz@homeuser-mail.test']],
    subject: 'Outcome of Tuesday\'s meeting',
    body: `Dear Tariq,

Thank you for attending the meeting on Tuesday. As discussed, the outcome is a first written warning, which will remain on your file for six months. The letter setting this out, and your right to appeal within five working days, will follow by post and in your portal. If you would like to talk any of it through, you can call me directly.

Kind regards,
Linda Marsh
PeopleFirst HR`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to that person: the HR matter is the recipient\'s own.',
  },
  {
    id: 128, kind: 'boundary', category: 'none', expect: 'pass', industry: 'optician', variant: 'UK', setting: 'eye test results to the patient',
    boundary: '§5.4 a person\'s own details written to that person',
    from: ['Vista Opticians', 'care@vista-opticians.example'], to: [['Margaret Doyle', 'margaret.doyle@homeuser-mail.test']],
    subject: 'Your eye examination',
    body: `Dear Margaret,

Thank you for coming in today. Your prescription has changed slightly in the left eye, and we have noted early signs of a cataract in the right, which does not need treatment yet but we will monitor it. Your new glasses will be ready to collect in about ten days; we will text you. We recommend your next examination in twelve months.

Vista Opticians`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to that person: the eye health is the recipient\'s own.',
  },
  {
    id: 129, kind: 'boundary', category: 'none', expect: 'pass', industry: 'employer HR', variant: 'UK', setting: 'leave confirmation to the employee at a personal address',
    boundary: '§5.4 a person\'s own details written to that person',
    from: ['Sunita Rao', 'sunita.rao@kestrel-logistics.example'], to: [['Ben Hollis', 'ben.hollis@homeuser-mail.test']],
    subject: 'Your leave',
    body: `Dear Ben,

I am so sorry to hear about your father. Your compassionate leave is confirmed from today for as long as you need this week, and we can talk about anything further when you are ready. Please do not worry about the handover; Priya has your deliveries covered. Take care of yourself and your family.

Sunita`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to that person: the family bereavement is the recipient\'s own, written to them.',
  },
  {
    id: 130, kind: 'boundary', category: 'none', expect: 'pass', industry: 'insurance', variant: 'UK', setting: 'claim update to the policyholder',
    boundary: '§5.4 a person\'s own details written to that person',
    from: ['Claims', 'claims@harbour-insurance.example'], to: [['Steven Park', 'steven.park@homeuser-mail.test']],
    subject: 'Your claim',
    body: `Dear Steven,

Your claim for the water damage to the kitchen has been accepted. The approved amount is 6,240 less your excess of 250, and payment will reach your account within five working days. The contractor you nominated has been approved. If you have further costs related to the same incident, send the receipts and we will assess them under the same claim.

Claims Team
Harbour Insurance`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to that person, and §5.5 does not flag customer-facing amounts: the claim is the recipient\'s own.',
  },

  // parent or guardian
  {
    id: 131, kind: 'boundary', category: 'none', expect: 'pass', industry: 'youth sports club', variant: 'UK', setting: 'injury note to a parent',
    boundary: '§5.4 a person\'s own details written to the parent or guardian they concern',
    from: ['Coach Dan', 'coach@riverside-juniors-fc.example'], to: [['Mr and Mrs Oyelowo', 'oyelowo.family@homeuser-mail.test']],
    subject: 'Femi at training',
    body: `Hi both,

Just to let you know Femi took a knock to the ankle at training tonight. We iced it and he walked off fine, but it may be sore tomorrow. If it swells up or he cannot put weight on it, it is worth getting it looked at. Otherwise rest it and he should be fine for Saturday.

Dan`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to the parent or guardian they concern: Femi\'s injury goes to his parents.',
  },
  {
    id: 132, kind: 'boundary', category: 'none', expect: 'pass', industry: 'speech therapy', variant: 'AU', setting: 'progress report to a parent',
    boundary: '§5.4 a person\'s own details written to the parent or guardian they concern',
    from: ['Kate Morrison', 'kate@morrison-speech.example'], to: [['Lisa Tran', 'lisa.tran@homeuser-mail.test']],
    subject: 'Ethan\'s progress this term',
    body: `Hi Lisa,

Ethan has made good progress this term. His production of the s and sh sounds is now consistent in single words and improving in sentences. For the holidays, keep up the picture cards for ten minutes a day and the reading-aloud game. We will reassess in February and I expect to reduce to fortnightly sessions.

Kate`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to the parent or guardian they concern: Ethan\'s therapy progress goes to his parent.',
  },

  // pet owners
  {
    id: 133, kind: 'boundary', category: 'none', expect: 'pass', industry: 'veterinary', variant: 'US', setting: 'lab results to a pet owner',
    boundary: '§5.4 a pet\'s details written to the pet owner',
    from: ['Dr Sam Ortiz', 'sam.ortiz@maplewood-animal-hospital.example'], to: [['Greg Nolan', 'greg.nolan@homeuser-mail.test']],
    subject: 'Luna\'s bloodwork',
    body: `Hi Greg,

Luna's bloodwork is back. Her kidney values are mildly elevated, which is common at her age, and everything else is normal. I would like to start her on the renal diet we talked about and recheck in three months. No other changes for now. Call the front desk if you have questions about the food.

Dr Sam Ortiz`,
    why: 'SPEC §5.4 does not flag a pet\'s details written to the pet owner they concern: Luna\'s results go to her owner.',
  },
  {
    id: 134, kind: 'boundary', category: 'none', expect: 'pass', industry: 'cattery', variant: 'UK', setting: 'boarding update to a cat owner',
    boundary: '§5.4 a pet\'s details written to the pet owner',
    from: ['Willow Cattery', 'hello@willow-cattery.example'], to: [['Fiona Adams', 'fiona.adams@homeuser-mail.test']],
    subject: 'Pebbles update',
    body: `Hi Fiona,

Pebbles is settling in well. She was off her food the first evening, which is normal, but has eaten properly since and has had her thyroid tablet each morning as instructed. She likes the window shelf. See you Sunday at 11 for collection.

Willow Cattery`,
    why: 'SPEC §5.4 does not flag a pet\'s details written to the pet owner they concern: Pebbles\'s medication goes to her owner.',
  },

  // criticism of work
  {
    id: 135, kind: 'boundary', category: 'none', expect: 'pass', industry: 'accounting', variant: 'UK', setting: 'feedback on a client\'s bookkeeping',
    boundary: '§5.7 criticism of work rather than a person',
    from: ['Raj Mehta', 'raj@mehta-accounting.example'], to: [['Kim Lester', 'kim@lester-plumbing.test']],
    subject: 'Q3 records',
    body: `Hi Kim,

I have been through the Q3 records. They are in a poor state: around forty transactions have no receipt, the bank feed has not been reconciled since July, and several supplier invoices are posted twice. The VAT return cannot be prepared until this is sorted. Could you upload the missing receipts this week, and I will do the reconciliation on Friday?

Raj`,
    why: 'SPEC §5.7 does not flag criticism of work: the records are criticised, not the person who kept them.',
  },
  {
    id: 136, kind: 'boundary', category: 'none', expect: 'pass', industry: 'translation', variant: 'UK', setting: 'quality feedback to a freelance translator',
    boundary: '§5.7 criticism of work rather than a person',
    from: ['Elena Petrova', 'elena@clearword-translation.example'], to: [['Marco Ricci', 'marco@ricci-translations.test']],
    subject: 'Feedback on the Italian manual',
    body: `Hi Marco,

Feedback on the Italian manual: the terminology is inconsistent between chapters 2 and 5 (three different renderings of the same part name), two safety warnings have been softened in translation and must be literal, and the units in the tables were not converted. The style otherwise reads well. Please revise by Wednesday.

Elena`,
    why: 'SPEC §5.7 does not flag criticism of work: the feedback is on the translation only.',
  },
  {
    id: 137, kind: 'boundary', category: 'none', expect: 'pass', industry: 'video production', variant: 'US', setting: 'edit notes to a production company',
    boundary: '§5.7 criticism of work rather than a person',
    from: ['Jess Carver', 'jess.carver@carver-fitness.example'], to: [['Edit Team', 'edits@lumen-video.test']],
    subject: 'Cut 2 notes',
    body: `Hi team,

Notes on cut 2. The pacing in the first thirty seconds is too slow and the music does not match the energy of the footage. The lower-thirds have a typo in the second one and the brand color is off. The ending works. Please address these in cut 3 by Friday.

Jess`,
    why: 'SPEC §5.7 does not flag criticism of work: the notes criticise the edit, not the editors.',
  },
  {
    id: 138, kind: 'boundary', category: 'none', expect: 'pass', industry: 'construction', variant: 'IE', setting: 'snagging list to a builder',
    boundary: '§5.7 criticism of work rather than a person',
    from: ['Aoife Ryan', 'aoife.ryan@homeuser-mail.example'], to: [['Declan', 'declan@murphy-builders.test']],
    subject: 'Snag list for the extension',
    body: `Hi Declan,

Snag list for the extension, as promised:

- Kitchen window does not close properly
- Grout in the bathroom is uneven and already cracking in two places
- Skirting in the hall has a gap at the corner
- Downlight in the utility flickers
- Paint on the back door has runs

The rest looks great. When can you come back to sort these?

Aoife`,
    why: 'SPEC §5.7 does not flag criticism of work: the list describes defects in the work, nothing about the builder.',
  },

  // access logistics
  {
    id: 139, kind: 'boundary', category: 'none', expect: 'pass', industry: 'medical practice', variant: 'UK', setting: 'out-of-hours delivery instructions to a courier',
    boundary: '§5.1 the words key, code or access in ordinary logistics',
    from: ['Practice Manager', 'manager@elmgrove-surgery.example'], to: [['Dispatch', 'dispatch@medisure-couriers.test']],
    subject: 'Deliveries before 8am',
    body: `Hi,

For deliveries before 8am please use the buzzer at the side entrance; the duty nurse will let the driver in. We do not have a drop box and parcels must not be left outside. Opening hours and the side entrance location are on our website under Contact. Thanks for your help with the cold chain items.

Practice Manager
Elmgrove Surgery`,
    why: 'SPEC §5.1 does not flag the words key, code or access in ordinary logistics: entry is by buzzer and no code or security gap is described.',
  },
  {
    id: 140, kind: 'boundary', category: 'none', expect: 'pass', industry: 'residential block management', variant: 'UK', setting: 'contractor arrangements with the concierge',
    boundary: '§5.1 the words key, code or access in ordinary logistics',
    from: ['Block Manager', 'manager@riverside-court-management.example'], to: [['Lift Engineers', 'service@apex-lifts.test']],
    subject: 'Lift service visit Thursday',
    body: `Hi,

Your engineer is booked for Thursday from 9. The plant room keys are with the concierge, who will sign them out against your engineer's ID and needs them back before 5. Please park in the visitor bay by the loading door. The residents have been notified that lift 2 will be out of service for the morning.

Block Manager
Riverside Court`,
    why: 'SPEC §5.1 does not flag the words key, code or access in ordinary logistics: the keys are signed out in person.',
  },
  {
    id: 141, kind: 'boundary', category: 'none', expect: 'pass', industry: 'gym', variant: 'UK', setting: 'membership welcome',
    boundary: '§5.1 the words key, code or access in ordinary logistics',
    from: ['Ironworks Gym', 'hello@ironworks-gym.example'], to: [['Priya Menon', 'priya.menon@homeuser-mail.test']],
    subject: 'Welcome to Ironworks',
    body: `Hi Priya,

Welcome to Ironworks. Your fob is ready to collect at the desk and gives you access from 5am to 11pm every day. Lockers take a padlock, which you bring yourself. Your induction is booked for Saturday at 10 with Jordan. The timetable is on the app and classes can be booked seven days ahead.

Ironworks Gym`,
    why: 'SPEC §5.1 does not flag the words key, code or access in ordinary logistics: the fob is collected in person and no code is given.',
  },
  {
    id: 142, kind: 'boundary', category: 'none', expect: 'pass', industry: 'security services', variant: 'UK', setting: 'routine alarm test notice to a client',
    boundary: '§5.1 talk about security systems without a code or a gap',
    from: ['Service Desk', 'service@sentinel-alarms.example'], to: [['Facilities', 'facilities@parkview-offices.test']],
    subject: 'Annual alarm test Tuesday',
    body: `Dear Facilities Team,

Your annual intruder alarm service and test is booked for Tuesday between 10 and 12. The engineer will test each detector and the signalling to the monitoring centre; the system stays live throughout and the monitoring centre has been told to expect test signals. Please make sure someone is available to let the engineer in and sign the certificate.

Service Desk
Sentinel Alarms`,
    why: 'SPEC §5.1 flags a code given or a security gap; neither is here: the alarm stays live and no code appears.',
  },
  {
    id: 143, kind: 'boundary', category: 'none', expect: 'pass', industry: 'library', variant: 'UK', setting: 'room booking confirmation',
    boundary: '§5.1 access information that is public',
    from: ['Hartfield Library', 'bookings@hartfield-library.example'], to: [['Nadia Ahmed', 'nadia.ahmed@homeuser-mail.test']],
    subject: 'Meeting room booking',
    body: `Dear Nadia,

Your booking of the Green Room on Saturday from 10 to 12 is confirmed. Ask at the desk when you arrive and a member of staff will unlock the room. Free public Wi-Fi is available; the network name and how to connect are on the posters in every room. The library opens at 9.30 on Saturdays and the lift is by the main entrance.

Hartfield Library`,
    why: 'SPEC §5.1 does not flag access information that is public: the Wi-Fi is a public network with its details posted in the building, and the room is unlocked by staff.',
  },

  // customer-facing charges and discounts
  {
    id: 144, kind: 'boundary', category: 'none', expect: 'pass', industry: 'lettings', variant: 'UK', setting: 'late payment notice to a tenant',
    boundary: '§5.5 customer-facing charges and payment terms stated as facts',
    from: ['Accounts', 'accounts@harbourside-lettings.example'], to: [['Marcus Reed', 'marcus.reed@homeuser-mail.test']],
    subject: 'Rent for November',
    body: `Dear Marcus,

Our records show that November's rent of 1,150 has not yet been received; it was due on the 1st. Under your tenancy agreement a late payment charge of 25 applies after 14 days. Please make the payment by Friday to avoid the charge, or get in touch if there is a problem so we can agree a way forward.

Accounts
Harbourside Lettings`,
    why: 'SPEC §5.5 does not flag customer-facing charges and payment terms stated as facts: the rent and late charge are the tenant\'s own terms.',
  },
  {
    id: 145, kind: 'boundary', category: 'none', expect: 'pass', industry: 'furniture retail', variant: 'UK', setting: 'delivery charges explained to a customer',
    boundary: '§5.5 costs the customer is meant to see',
    from: ['Customer Care', 'care@oakhaven-furniture.example'], to: [['Lauren Scott', 'lauren.scott@homeuser-mail.test']],
    subject: 'Your delivery options',
    body: `Hi Lauren,

Thanks for your order. Delivery options for the sofa are: standard kerbside delivery at 45, room-of-choice delivery with unpacking at 79, or collection from our warehouse at no charge. Removal of your old sofa can be added for 30. Delivery is currently four to six weeks. Let us know which option you would like.

Customer Care
Oakhaven Furniture`,
    why: 'SPEC §5.5 does not flag customer-facing prices: the delivery charges are the ones the customer is meant to see.',
  },
  {
    id: 146, kind: 'boundary', category: 'none', expect: 'pass', industry: 'wholesale', variant: 'UK', setting: 'early payment discount offer',
    boundary: '§5.6 an offer actually made to the recipient',
    from: ['Credit Control', 'credit@thames-trade-supplies.example'], to: [['Accounts', 'accounts@bright-electrical.test']],
    subject: 'Early settlement discount',
    body: `Dear Accounts Team,

From January we are offering all trade accounts a 2 percent discount for invoices settled within 10 days of the invoice date. Standard terms remain 30 days. The discount is applied automatically on receipt and shown on your next statement. No action is needed to take it up.

Credit Control
Thames Trade Supplies`,
    why: 'SPEC §5.6 does not flag an offer actually made to the recipient, and §5.5 does not flag customer-facing payment terms: the discount is offered openly.',
  },
  {
    id: 147, kind: 'boundary', category: 'none', expect: 'pass', industry: 'event hire', variant: 'AU', setting: 'itemised invoice explanation',
    boundary: '§5.5 invoice amounts stated as facts',
    from: ['Hire Desk', 'hire@skyline-marquees.example'], to: [['Jo Baker', 'jo.baker@homeuser-mail.test']],
    subject: 'Your invoice explained',
    body: `Hi Jo,

You asked what the lines on the invoice are. Marquee hire 2,200; flooring 480; lighting 350; delivery, set-up and collection 600; damage waiver 110. Total 3,740 including GST, less your deposit of 1,000, leaving 2,740 due on the day before the event. Shout if anything is unclear.

Hire Desk
Skyline Marquees`,
    why: 'SPEC §5.5 does not flag invoice amounts stated as facts: each line is a price charged to the customer, not a cost to the sender.',
  },

  // named people doing logistics
  {
    id: 148, kind: 'boundary', category: 'none', expect: 'pass', industry: 'hospital trust', variant: 'UK', setting: 'contractor site induction arrangements',
    boundary: '§5.4 names, job titles and roles do not flag',
    from: ['Estates Office', 'estates@northvale-hospital.example'], to: [['Project Team', 'projects@kingsway-mechanical.test']],
    subject: 'Induction Monday',
    body: `Hi,

Induction for your team is Monday at 8 in the estates office, block D. Our estates supervisor Keith will run it and issue the permits; our infection control lead, Dr Osei, will cover the ward adjacency rules at 8.45. Bring your operatives' competency cards. Parking permits are at the main gate under your company name.

Estates Office
Northvale Hospital`,
    why: 'SPEC §5.4 does not flag names, job titles and roles: the named staff are running ordinary site logistics.',
  },
  {
    id: 149, kind: 'boundary', category: 'none', expect: 'pass', industry: 'software', variant: 'US', setting: 'account manager handover',
    boundary: '§5.4 names, job titles and roles do not flag',
    from: ['Erin Walsh', 'erin.walsh@northfield-saas.example'], to: [['Carlos Mendes', 'carlos.mendes@mendes-logistics.test']],
    subject: 'Your new account manager',
    body: `Hi Carlos,

I am moving to our enterprise team at the end of the month, so from December your account manager will be Jordan Pike. Jordan has been with us four years and already knows your setup from the migration project. We will do a joint call next week so nothing falls through the cracks. It has been a pleasure working with you.

Erin`,
    why: 'SPEC §5.4 does not flag names, job titles and roles: a role change with no personal detail.',
  },
  {
    id: 150, kind: 'boundary', category: 'none', expect: 'pass', industry: 'wedding venue', variant: 'UK', setting: 'day-of coordination with a couple\'s planner',
    boundary: '§5.4 names, job titles and roles do not flag',
    from: ['Events Team', 'events@thornfield-manor.example'], to: [['Jade Oakes', 'jade@jade-oakes-weddings.test']],
    subject: 'Saturday team',
    body: `Hi Jade,

On Saturday your contacts here are: Rosie, duty manager, from 8am; Kwame, head of catering, from 11; and Lee, bar manager, from 2. Rosie will meet the florist and the band. The groundsman, Bill, will be around until dark for the car park and the fire pits. All on the venue mobile, which you have.

Events Team
Thornfield Manor`,
    why: 'SPEC §5.4 does not flag names, job titles and roles: the list is who does what on the day.',
  },
  {
    id: 151, kind: 'boundary', category: 'none', expect: 'pass', industry: 'logistics', variant: 'IN', setting: 'shift change notice to a client',
    boundary: '§5.4 an absence or schedule change without a stated cause',
    from: ['Operations', 'ops@swiftline-logistics.example'], to: [['Warehouse', 'warehouse@novatex-garments.test']],
    subject: 'Supervisor change for night shift',
    body: `Dear Sir,

Please note that from Monday, Mr Girish will be the night shift supervisor at your warehouse in place of Mr Anand, who is moving to our Pune operations. Mr Girish is reachable on the same desk number. All loading schedules remain unchanged. Kindly update your gate pass list accordingly.

Regards,
Operations
Swiftline Logistics`,
    why: 'SPEC §5.4 does not flag names, roles or a schedule change without a sensitive cause: a transfer to another site is business logistics.',
  },

  // other boundaries
  {
    id: 152, kind: 'boundary', category: 'none', expect: 'pass', industry: 'software', variant: 'UK', setting: 'security advice to a customer',
    boundary: '§5.1 talk about passwords without one',
    from: ['Security Team', 'security@ledgerline-apps.example'], to: [['Finance', 'finance@orwell-engineering.test']],
    subject: 'Please reset your passwords',
    body: `Dear Finance Team,

As part of our annual security review we are asking all customers to reset their passwords by the end of the month. Please use the Forgot password link on the sign-in page; a reset link will be emailed to the address on your account. Choose a long passphrase you have not used elsewhere and turn on two-step verification in Settings if you have not already.

Security Team
Ledgerline Apps`,
    why: 'SPEC §5.1 does not flag talk about passwords without one, such as reset instructions: no password is given.',
  },
  {
    id: 153, kind: 'boundary', category: 'none', expect: 'pass', industry: 'IT managed services', variant: 'UK', setting: 'new starter account setup',
    boundary: '§5.1 talk about passwords without one',
    from: ['Service Desk', 'servicedesk@northpoint-it.example'], to: [['Jo Hartley', 'jo.hartley@hartley-architects.test']],
    subject: 'New starter accounts ready',
    body: `Hi Jo,

The two new starter accounts are set up. Each person will receive a temporary password by text to the mobile number you gave us, and will be prompted to change it on first sign-in. Laptops are configured and will be couriered to your office tomorrow. Let us know if either of them has trouble on day one.

Service Desk
Northpoint IT`,
    why: 'SPEC §5.1 does not flag talk about passwords without one: the password goes by another channel and is not in the email.',
  },
  {
    id: 154, kind: 'boundary', category: 'none', expect: 'pass', industry: 'travel agency', variant: 'UK', setting: 'booking reference to a customer',
    boundary: '§5.1 and §5.2 reference and booking numbers',
    from: ['Globe Travel', 'bookings@globe-travel.example'], to: [['Helen Carr', 'helen.carr@homeuser-mail.test']],
    subject: 'Your booking is confirmed',
    body: `Dear Helen,

Your booking is confirmed. Booking reference GT-77412; airline locator PX4K9Q. Flights depart on 14 March at 10.45, hotel check-in the same day. Your e-tickets will follow 48 hours before departure. If you need to add baggage or seats, reply with the reference.

Globe Travel`,
    why: 'SPEC §5.1 and §5.2 do not flag reference, booking or order numbers: these identifiers are not codes or payment details.',
  },
  {
    id: 155, kind: 'boundary', category: 'none', expect: 'pass', industry: 'pharmacy chain', variant: 'UK', setting: 'business update to a supplier',
    boundary: '§5.4 a company\'s own legal matters stated as business',
    from: ['Procurement', 'procurement@wellcare-pharmacies.example'], to: [['Account Manager', 'accounts@medline-wholesale.test']],
    subject: 'Store closures and your deliveries',
    body: `Dear Account Manager,

Two updates. First, our lease dispute over the Market Street store has concluded and the store will close at the end of January; please remove it from the delivery schedule from 1 February. Second, our new store in Hadley opens on 10 February and will take the Market Street allocation. We will send the new delivery window next week.

Procurement
Wellcare Pharmacies`,
    why: 'SPEC §5.4 does not flag a company\'s own legal matters stated as business: the lease dispute is the sender company\'s, with no individual involved.',
  },
  {
    id: 156, kind: 'boundary', category: 'none', expect: 'pass', industry: 'construction', variant: 'UK', setting: 'variation request to a client',
    boundary: '§5.5 naming a budget line or change order without an internal figure',
    from: ['Commercial', 'commercial@grafton-build.example'], to: [['Employer\'s Agent', 'ea@hollis-project-managers.test']],
    subject: 'Early warning: substructure',
    body: `Dear Employer's Agent,

This is an early warning under the contract. The ground conditions found in trial pit 3 differ from the site investigation and may affect the substructure budget line and the programme. We propose a meeting on Thursday to agree the approach and will price any change as a compensation event once the engineer has confirmed the revised foundation design.

Commercial Team
Grafton Build`,
    why: 'SPEC §5.5 does not flag naming a budget line or change order without an internal figure: the line is named and no cost, margin or contingency appears.',
  },
  {
    id: 157, kind: 'boundary', category: 'none', expect: 'pass', industry: 'manufacturing', variant: 'US', setting: 'specification sent with a footer',
    boundary: '§5.10 confidentiality footers such as "company confidential"',
    from: ['Engineering', 'engineering@vantage-controls.example'], to: [['Dale Hughes', 'dale.hughes@hughes-machining.test']],
    subject: 'Bracket drawing rev C',
    body: `Hi Dale,

Rev C of the bracket drawing follows in a separate email. The only change from rev B is the hole spacing on the mounting face, which is now 42 mm. Please quote for 500 and 1,000 pieces in 6061 and let us know lead time.

Engineering
Vantage Controls

Company confidential. This message is intended for the named recipient.`,
    why: 'SPEC §5.10 does not flag confidentiality footers addressed to the recipient such as "company confidential".',
  },
  {
    id: 158, kind: 'boundary', category: 'none', expect: 'pass', industry: 'online education', variant: 'UK', setting: 'course access link to a learner',
    boundary: '§5.10 "please don\'t forward this link" does not flag',
    from: ['Course Team', 'courses@brightpath-learning.example'], to: [['Sam Devlin', 'sam.devlin@homeuser-mail.test']],
    subject: 'Your course link',
    body: `Hi Sam,

Your personal link to the course materials is in the button below this message. It is tied to your account, so please don't forward this link to anyone else; if a colleague wants to join, they can enrol at the same price through the course page. The first live session is Tuesday at 7pm and the recording will be posted the next day.

Course Team
Brightpath Learning`,
    why: 'SPEC §5.10 does not flag "please don\'t forward this link": it protects a personal link, not the message\'s contents.',
  },
  {
    id: 159, kind: 'boundary', category: 'none', expect: 'pass', industry: 'retail buying', variant: 'UK', setting: 'rejection of a supplier\'s proposal',
    boundary: '§5.7 blunt disagreement and firm requests',
    from: ['Buying', 'buying@hollins-department-store.example'], to: [['Sales', 'sales@verity-homewares.test']],
    subject: 'Re: Spring range proposal',
    body: `Hi,

We disagree with the proposal. The range is too wide for the space we have, the price points sit above what our customers pay in that category, and the delivery schedule does not fit our spring reset. We would consider a cut-down range of twelve lines at the lower price points, delivered in one drop in February. Please come back with that or we will pass this season.

Buying
Hollins`,
    why: 'SPEC §5.7 does not flag blunt disagreement or firm requests: the proposal is rejected on its merits, with no remark about the company or people.',
  },
  {
    id: 160, kind: 'boundary', category: 'none', expect: 'pass', industry: 'residents\' association', variant: 'UK', setting: 'public meeting details to a councillor',
    boundary: '§5.1 access information that is public',
    from: ['Chair', 'chair@elm-park-residents.example'], to: [['Cllr Jane Bostock', 'jane.bostock@fenbridge-council.test']],
    subject: 'Residents\' meeting 12 November',
    body: `Dear Councillor Bostock,

Thank you for agreeing to attend our meeting on 12 November at 7pm in the community centre on Elm Park Road. The main entrance is on the car park side and is step-free. The agenda is parking, the proposed cycle lane and the state of the play area. We expect around forty residents. Refreshments from 6.30.

Chair
Elm Park Residents' Association`,
    why: 'SPEC §5.1 does not flag access information that is public: the venue entrance is public knowledge and no code or gap is given.',
  },
];
