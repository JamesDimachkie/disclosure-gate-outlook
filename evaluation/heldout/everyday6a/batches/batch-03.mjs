// everyday6a batch 03: boundary passes 081-120.
export default [
  {
    id: 81, kind: 'boundary', category: 'none', expect: 'pass', industry: 'catering', variant: 'UK', setting: 'wedding catering quote',
    boundary: '§5.5 customer-facing prices and quotes stated as facts',
    from: ['Jemma Lord', 'jemma@lord-catering.example'], to: [['Sophie and Raj', 'sophie.raj.wedding@homeuser-mail.test']],
    subject: 'Your wedding menu and pricing',
    body: `Hi Sophie and Raj,

Lovely to meet you both on Saturday. Based on what we talked about, the three-course seated menu for 90 guests is 68 per head, the evening grazing table is 14 per head, and the drinks package (reception fizz, half a bottle of wine with dinner and a toast) is 29 per head. Service staff, linen and crockery are included. Children's meals are half price and we don't charge for the suppliers' meals.

Shall I hold the date while you decide?

Jemma`,
    why: 'SPEC §5.5 does not flag customer-facing prices and quotes stated as facts: every figure is the price offered to the couple.',
  },
  {
    id: 82, kind: 'boundary', category: 'none', expect: 'pass', industry: 'car dealership', variant: 'US', setting: 'vehicle price offer',
    boundary: '§5.6 an offer or proposal actually made to the recipient',
    from: ['Luis Herrera', 'luis.herrera@parkside-motors.example'], to: [['Janet Kim', 'janet.kim@homeuser-mail.test']],
    subject: 'The silver wagon',
    body: `Hi Janet,

Thanks for coming by yesterday. Here is our offer in writing: the silver wagon at 27,400 including the all-weather mats and the extended warranty, with 1,800 for your trade-in as it stands. Tax and title are extra. The offer is good through Saturday. If you want to take it for another drive before then, just call me.

Luis`,
    why: 'SPEC §5.6 does not flag an offer or proposal actually made to the recipient: the price and trade-in value are the offer itself, with no fallback or room to move stated.',
  },
  {
    id: 83, kind: 'boundary', category: 'none', expect: 'pass', industry: 'translation services', variant: 'UK', setting: 'quote for document translation',
    boundary: '§5.5 customer-facing prices and quotes stated as facts',
    from: ['Elena Petrova', 'elena@clearword-translation.example'], to: [['Michael Oduya', 'michael.oduya@oduya-exports.test']],
    subject: 'Quote: product manuals into German and French',
    body: `Dear Michael,

Thank you for sending the manuals. The word count is 18,400 across the four documents. Our rate for technical translation into German and French is 0.14 per word per language, so the total is 5,152 plus VAT, with a turnaround of ten working days. Proofreading by a second translator is included. If you need the DTP done as well, that is quoted separately at 35 per page.

Kind regards,
Elena Petrova
Clearword Translation`,
    why: 'SPEC §5.5 does not flag customer-facing prices and quotes stated as facts: the rate and total are those offered to the customer.',
  },
  {
    id: 84, kind: 'boundary', category: 'none', expect: 'pass', industry: 'roofing', variant: 'IE', setting: 'repair quote to a homeowner',
    boundary: '§5.5 customer-facing prices and quotes stated as facts',
    from: ['Seamus Daly', 'seamus@daly-roofing.example'], to: [['Mrs Keogh', 'b.keogh@homeuser-mail.test']],
    subject: 'Quote for the chimney and flashing',
    body: `Dear Mrs Keogh,

Following my visit this morning, the price to repoint the chimney, replace the lead flashing on both sides and refix the loose ridge tiles is 1,650 including VAT. That covers the scaffold tower, all materials and taking the rubbish away. We could do it the week after next, weather permitting. There is no deposit; we invoice when the work is done.

Kind regards,
Seamus Daly
Daly Roofing`,
    why: 'SPEC §5.5 does not flag customer-facing prices and quotes stated as facts: the quoted price is the only figure.',
  },
  {
    id: 85, kind: 'boundary', category: 'none', expect: 'pass', industry: 'SaaS', variant: 'US', setting: 'enterprise pricing proposal',
    boundary: '§5.6 an offer or proposal actually made to the recipient',
    from: ['Dana Whitlock', 'dana.whitlock@clearpath-analytics.example'], to: [['Robert Chen', 'robert.chen@chen-logistics.test']],
    subject: 'Proposal for the Clearpath rollout',
    body: `Hi Robert,

As promised, the proposal. For 250 seats on the Business tier the annual fee is 61,250, billed annually, with the onboarding package at 7,500 one time. If you commit to three years the annual fee is fixed for the term. Support is 24/5 with a four-hour response target, and the data residency option you asked about is included at no extra charge.

The formal document follows in a separate email for your procurement team. Happy to walk through it on Thursday.

Dana`,
    why: 'SPEC §5.6 does not flag an offer or proposal actually made to the recipient: the proposal is the terms put to the customer, with no negotiation position behind it.',
  },
  {
    id: 86, kind: 'boundary', category: 'none', expect: 'pass', industry: 'photography', variant: 'AU', setting: 'shoot package pricing',
    boundary: '§5.5 customer-facing prices and quotes stated as facts',
    from: ['Tess Morgan', 'tess@morgan-photo.example'], to: [['Hamish Clarke', 'hamish.clarke@clarke-realestate.test']],
    subject: 'Packages for the Bayside listings',
    body: `Hi Hamish,

Here is what we talked about for the Bayside listings. Standard package is 350 per property for 20 edited photos and a floor plan. Premium is 550 and adds twilight shots and a drone set. Video walkthroughs are 400 on top of either. Turnaround is 48 hours from the shoot. If you book five or more in a month the standard package drops to 300.

Cheers
Tess`,
    why: 'SPEC §5.5 does not flag customer-facing prices and quotes stated as facts: the package prices and volume price are those offered to the agent.',
  },

  // own details to the person
  {
    id: 87, kind: 'boundary', category: 'none', expect: 'pass', industry: 'physiotherapy', variant: 'UK', setting: 'treatment plan to the patient',
    boundary: '§5.4 a person\'s own details written to that person',
    from: ['Nick Harlow', 'nick@harlow-physio.example'], to: [['Aisha Rahman', 'aisha.rahman@homeuser-mail.test']],
    subject: 'Your exercise plan',
    body: `Hi Aisha,

Good session today. Your shoulder range has improved by about twenty degrees since the first visit, and the pain score is down from seven to three. Keep going with the band exercises twice a day and add the wall slides from the sheet. If the night pain comes back, stop the overhead work and let me know. See you in two weeks.

Nick`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to that person: the medical progress is the recipient\'s own.',
  },
  {
    id: 88, kind: 'boundary', category: 'none', expect: 'pass', industry: 'HR outsourcing', variant: 'UK', setting: 'salary confirmation to the employee concerned',
    boundary: '§5.4 a person\'s own details written to that person',
    from: ['Payroll', 'payroll@peoplefirst-hr.example'], to: [['Chris Dunne', 'chris.dunne@homeuser-mail.test']],
    subject: 'Your new salary from 1 December',
    body: `Dear Chris,

Further to your review, this confirms that your salary increases to 41,500 a year from 1 December, paid monthly on the 25th. Your pension contribution stays at 5 percent, matched by your employer. Your updated statement of terms will be in your portal by the end of the week.

Kind regards,
Payroll Team
PeopleFirst HR`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to that person: the pay figure is the recipient\'s own salary, sent to them.',
  },
  {
    id: 89, kind: 'boundary', category: 'none', expect: 'pass', industry: 'law firm', variant: 'UK', setting: 'update to a client on their own court matter',
    boundary: '§5.4 a person\'s own details written to that person',
    from: ['Hugo Marchant', 'hugo.marchant@marchant-law.example'], to: [['Tim Brady', 'tim.brady@homeuser-mail.test']],
    subject: 'Your hearing date',
    body: `Dear Tim,

The court has listed your hearing for 14 January at 10am at the county court. I will meet you outside the courtroom at 9.30. Please bring the two bank statements we discussed and the letter from your landlord. There is nothing else you need to do before then; I will send you a short note on what to expect next week.

Kind regards,
Hugo Marchant
Marchant Law`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to that person: the court case is the recipient\'s own.',
  },
  {
    id: 90, kind: 'boundary', category: 'none', expect: 'pass', industry: 'dentistry', variant: 'IN', setting: 'appointment follow-up to a patient',
    boundary: '§5.4 a person\'s own details written to that person',
    from: ['Dr Meera Pillai', 'meera.pillai@smilecare-dental.example'], to: [['Rohit Sharma', 'rohit.sharma@homeuser-mail.test']],
    subject: 'Follow-up after your root canal',
    body: `Dear Rohit,

Hope you are feeling better after yesterday's root canal treatment. Mild sensitivity for two to three days is normal. Please continue the prescribed tablets and avoid chewing on that side till the crown is fitted. Your next appointment is on Tuesday at 11 am for the crown fitting. Do call the clinic if there is any swelling.

Regards,
Dr Meera Pillai
Smilecare Dental`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to that person: the treatment described is the recipient\'s own.',
  },
  {
    id: 91, kind: 'boundary', category: 'none', expect: 'pass', industry: 'recruitment', variant: 'UK', setting: 'job offer to the candidate',
    boundary: '§5.4 a person\'s own details written to that person',
    from: ['Yasmin Ali', 'yasmin@ali-recruitment.example'], to: [['Jordan Blake', 'jordan.blake@homeuser-mail.test']],
    subject: 'Offer from Castleton',
    body: `Hi Jordan,

Great news: Castleton would like to offer you the operations analyst role. The salary is 36,000 with a 5 percent bonus scheme, 26 days holiday and hybrid working, three days in the office. Start date would be 6 January. Let me know by Friday if you would like to accept, or if you have any questions I can take back to them.

Yasmin`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to that person: the pay and bonus belong to the recipient.',
  },

  // parent or guardian
  {
    id: 92, kind: 'boundary', category: 'none', expect: 'pass', industry: 'nursery', variant: 'UK', setting: 'daily note to a parent',
    boundary: '§5.4 a person\'s own details written to the parent or guardian they concern',
    from: ['Little Acorns Nursery', 'office@littleacorns-nursery.example'], to: [['Priya Nair', 'priya.nair@homeuser-mail.test']],
    subject: 'Arjun today',
    body: `Hi Priya,

Arjun had a good day. He ate most of his lunch and slept for an hour after. His temperature was slightly up at 37.8 around 3pm, so we gave him the paracetamol you authorised and it came down to normal within the hour. He has been happy and playing since. Please keep an eye on him this evening.

Little Acorns`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to the parent or guardian they concern: Arjun\'s health goes to his parent.',
  },
  {
    id: 93, kind: 'boundary', category: 'none', expect: 'pass', industry: 'secondary school', variant: 'UK', setting: 'pastoral note to a guardian',
    boundary: '§5.4 a person\'s own details written to the parent or guardian they concern',
    from: ['Mr Dawson', 'r.dawson@kingsbridge-academy.example'], to: [['Ms Greer', 'l.greer@homeuser-mail.test']],
    subject: 'Kayla',
    body: `Dear Ms Greer,

Thank you for letting us know about the change in Kayla's living arrangements. We have updated her records so that you are the first contact, as her guardian, and her form tutor is aware. Kayla has settled back well this week and her attendance has been full. If there is anything that would help her at school, please let me know.

Kind regards,
Mr Dawson
Head of Year 9`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to the parent or guardian they concern: the family matter is written to Kayla\'s guardian.',
  },
  {
    id: 94, kind: 'boundary', category: 'none', expect: 'pass', industry: 'orthodontics', variant: 'US', setting: 'treatment update to a parent',
    boundary: '§5.4 a person\'s own details written to the parent or guardian they concern',
    from: ['Lakeview Orthodontics', 'office@lakeview-ortho.example'], to: [['Mrs Alvarez', 'alvarez.family@homeuser-mail.test']],
    subject: 'Mateo\'s braces',
    body: `Hi Mrs Alvarez,

Mateo did great today. We tightened the upper wire and added the elastics he will wear at night. Some soreness for a couple of days is normal. Please remind him to avoid hard candy and to keep up the flossing. His next adjustment is in six weeks; the front desk will text you a reminder.

Lakeview Orthodontics`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to the parent or guardian they concern: Mateo\'s treatment goes to his parent.',
  },

  // pet owners
  {
    id: 95, kind: 'boundary', category: 'none', expect: 'pass', industry: 'veterinary', variant: 'AU', setting: 'vaccination reminder to a pet owner',
    boundary: '§5.4 a pet\'s details written to the pet owner',
    from: ['Bayside Vet Clinic', 'reminders@bayside-vet.example'], to: [['Dave Mitchell', 'dave.mitchell@homeuser-mail.test']],
    subject: 'Rusty is due for his annual',
    body: `Hi Dave,

Rusty is due for his annual vaccination and heartworm injection this month. Given his arthritis we would also like to check his hips and weigh him while he is in. You can book online or give us a call. If he is still on the joint supplement, bring the packet so we can check the dose.

Bayside Vet Clinic`,
    why: 'SPEC §5.4 does not flag a pet\'s details written to the pet owner they concern: Rusty\'s health goes to his owner.',
  },
  {
    id: 96, kind: 'boundary', category: 'none', expect: 'pass', industry: 'equine vet', variant: 'UK', setting: 'horse treatment update to the owner',
    boundary: '§5.4 a pet\'s details written to the pet owner',
    from: ['Dr Tom Reilly', 'tom.reilly@fenland-equine.example'], to: [['Charlotte Mason', 'charlotte.mason@homeuser-mail.test']],
    subject: 'Bramble',
    body: `Hi Charlotte,

I saw Bramble this afternoon. The lameness is coming from the near fore and the nerve block confirmed it is in the foot. X-rays showed no fracture, so I suspect a bruise or an abscess forming. I have put a poultice on and left you a week's worth of anti-inflammatories. Box rest for five days and I will come back on Monday to check her.

Tom`,
    why: 'SPEC §5.4 does not flag an animal\'s health written to its owner: Bramble\'s treatment goes to Charlotte.',
  },
  {
    id: 97, kind: 'boundary', category: 'none', expect: 'pass', industry: 'dog grooming', variant: 'UK', setting: 'grooming note to a dog owner',
    boundary: '§5.4 a pet\'s details written to the pet owner',
    from: ['Paws and Claws', 'hello@pawsandclaws-grooming.example'], to: [['Emma Watts', 'emma.watts@homeuser-mail.test']],
    subject: 'Milo today',
    body: `Hi Emma,

Milo was a star today. While trimming him we noticed a small lump on his left side, just behind the ribs. It is probably nothing, but we would recommend having the vet look at it when you are next in. His ears were a bit waxy too, so we cleaned them. He is ready for collection any time after 3.

Paws and Claws`,
    why: 'SPEC §5.4 does not flag an animal\'s health written to its owner: the observation about Milo goes to Emma.',
  },

  // criticism of work
  {
    id: 98, kind: 'boundary', category: 'none', expect: 'pass', industry: 'construction', variant: 'UK', setting: 'defects notice to a subcontractor',
    boundary: '§5.7 criticism of work rather than a person',
    from: ['Site Manager', 'site@beacon-construction.example'], to: [['Ryan Holt', 'ryan@holt-brickwork.test']],
    subject: 'North elevation brickwork',
    body: `Ryan,

The brickwork on the north elevation is not acceptable. The perp joints are out of line between courses 14 and 22, the pointing is inconsistent, and there is mortar staining across at least six square metres. It needs taking down from course 14 and rebuilding, and the staining cleaned off before the scaffold comes down. Please confirm when you will start.

Site Manager
Beacon Construction`,
    why: 'SPEC §5.7 does not flag criticism of work: the complaint is about the brickwork, not the bricklayer.',
  },
  {
    id: 99, kind: 'boundary', category: 'none', expect: 'pass', industry: 'design agency', variant: 'US', setting: 'feedback on a logo concept',
    boundary: '§5.7 criticism of work rather than a person',
    from: ['Karen Liu', 'karen.liu@liu-bakehouse.example'], to: [['Studio', 'studio@orbit-design.test']],
    subject: 'Logo round 2',
    body: `Hi team,

Thanks for the second round. I will be direct: none of the three works for us. The first looks like a bank, the second is too close to a competitor's mark, and the third is unreadable at small sizes. The color direction from round one was right, so please keep that and go again. We need something that feels handmade and warm.

Karen`,
    why: 'SPEC §5.7 does not flag criticism of work: every point is about the designs, none about the designers.',
  },
  {
    id: 100, kind: 'boundary', category: 'none', expect: 'pass', industry: 'software', variant: 'UK', setting: 'code review feedback to a contractor',
    boundary: '§5.7 criticism of work rather than a person',
    from: ['Amira Hassan', 'amira@lattice-software.example'], to: [['Jake Palmer', 'jake@palmer-dev.test']],
    subject: 'Review of the import module',
    body: `Hi Jake,

I have reviewed the import module. It is not ready to merge. The error handling swallows exceptions silently, there are no tests for the malformed-file cases, and the date parsing assumes UK format throughout. The structure is sound and the naming is clear, so this is fixable in a day or two. Comments are on the pull request.

Amira`,
    why: 'SPEC §5.7 does not flag criticism of work: the review criticises the code and says nothing about the person.',
  },
  {
    id: 101, kind: 'boundary', category: 'none', expect: 'pass', industry: 'consulting', variant: 'UK', setting: 'pushback on a project schedule',
    boundary: '§5.7 criticism of schedules does not flag',
    from: ['Tomasz Nowak', 'tomasz@nowak-consulting.example'], to: [['Lucy Grange', 'lucy.grange@grange-foods.test']],
    subject: 'Re: Revised schedule',
    body: `Hi Lucy,

The revised schedule is unrealistic. It gives two weeks for data migration that took six on the pilot, it has testing overlapping with training, and it assumes the warehouse team is available during stocktake week. We should not sign up to it as it stands. I will send an alternative tomorrow that keeps the go-live in March but moves the testing.

Tomasz`,
    why: 'SPEC §5.7 does not flag criticism of work, drawings or schedules: the schedule is criticised, not the person who wrote it.',
  },
  {
    id: 102, kind: 'boundary', category: 'none', expect: 'pass', industry: 'architecture', variant: 'UK', setting: 'drawing review to a contractor',
    boundary: '§5.7 criticism of drawings does not flag',
    from: ['Studio Walden', 'studio@walden-architects.example'], to: [['Tech Office', 'technical@brightstone-build.test']],
    subject: 'Comments on shop drawings rev B',
    body: `Hi,

Comments on the rev B shop drawings: the balustrade fixings clash with the slab edge detail on sheet 4, the glass thickness on sheet 6 does not match the specification, and the setting-out dimensions on sheet 9 are missing altogether. Please revise and resubmit; we cannot approve these as drawn. Sheets 1 to 3 are approved.

Studio Walden`,
    why: 'SPEC §5.7 does not flag criticism of work, drawings or schedules: the comments are on the drawings only.',
  },

  // access logistics, public or given by design
  {
    id: 103, kind: 'boundary', category: 'none', expect: 'pass', industry: 'hotel', variant: 'UK', setting: 'arrival information to a guest',
    boundary: '§5.1 the words key, code or access in ordinary logistics',
    from: ['The Larches Hotel', 'reservations@larches-hotel.example'], to: [['Mr Novak', 'p.novak@homeuser-mail.test']],
    subject: 'Your stay next week',
    body: `Dear Mr Novak,

We look forward to welcoming you on Tuesday. Check-in is from 3pm at reception, where you will collect your room key. The car park is at the rear and the barrier lifts automatically on arrival; please leave your registration at reception. Wi-Fi details are printed on the card in your room. Breakfast is served from 7 to 10.

The Larches Hotel`,
    why: 'SPEC §5.1 does not flag the words key, code or access in ordinary logistics: the Wi-Fi is mentioned without its code and the key is collected in person.',
  },
  {
    id: 104, kind: 'boundary', category: 'none', expect: 'pass', industry: 'coworking', variant: 'UK', setting: 'onboarding a new member',
    boundary: '§5.1 the words key, code or access in ordinary logistics',
    from: ['Hive Workspace', 'hello@hive-workspace.example'], to: [['Sam Okoro', 'sam@okoro-consulting.test']],
    subject: 'Welcome to Hive',
    body: `Hi Sam,

Welcome. Your access card will be ready at the front desk from Monday; bring photo ID to collect it. The card opens the main door 24 hours a day and the bike store. Meeting rooms are booked through the app, and the printers appear automatically once you are on the members' network, which the front desk will set you up on. Any problems, ask for Leah.

Hive Workspace`,
    why: 'SPEC §5.1 does not flag the words key, code or access in ordinary logistics: the card and network are set up in person and no code is given.',
  },
  {
    id: 105, kind: 'boundary', category: 'none', expect: 'pass', industry: 'self storage', variant: 'US', setting: 'unit rental confirmation',
    boundary: '§5.1 the words key, code or access in ordinary logistics',
    from: ['StoreRight', 'office@storeright-selfstorage.example'], to: [['Angela Moss', 'angela.moss@homeuser-mail.test']],
    subject: 'Unit 214 is yours',
    body: `Hi Angela,

Your rental of unit 214 starts Friday. Gate hours are 6am to 10pm every day. Your personal gate code was set up with you at the office today and is not included in this email for your security; if you forget it, come by with ID and we will reset it. You will need to bring your own padlock. The unit is on the second floor, elevator at the east end.

StoreRight`,
    why: 'SPEC §5.1 does not flag talk of a code without the code itself: the gate code is referred to but deliberately not given.',
  },
  {
    id: 106, kind: 'boundary', category: 'none', expect: 'pass', industry: 'community hall', variant: 'IE', setting: 'booking confirmation for a hall',
    boundary: '§5.1 the words key, code or access in ordinary logistics',
    from: ['Parish Hall Bookings', 'bookings@stbrigids-hall.example'], to: [['Maeve Lynch', 'maeve.lynch@homeuser-mail.test']],
    subject: 'Hall booking Saturday 22nd',
    body: `Hi Maeve,

Your booking for the hall on Saturday the 22nd from 2 to 6 is confirmed. Collect the key from Bridie in the parish office on Friday between 10 and 12 and drop it back through the office letterbox after. The chairs are stacked in the side room and the kitchen is yours to use; please leave it as you find it. The hall is on the main street beside the church, with parking at the back.

Parish Hall Bookings`,
    why: 'SPEC §5.1 does not flag the words key, code or access in ordinary logistics: the key is collected in person and the location is public.',
  },
  {
    id: 107, kind: 'boundary', category: 'none', expect: 'pass', industry: 'conference venue', variant: 'UK', setting: 'delivery instructions to an exhibitor',
    boundary: '§5.1 access information that is public',
    from: ['Operations', 'operations@riverside-exhibition.example'], to: [['Exhibitor Services', 'stands@novatech-displays.test']],
    subject: 'Build-up access for Hall 2',
    body: `Hi,

Build-up for Hall 2 is Tuesday 8am to 8pm. Vehicles enter via Gate C on Riverside Way, which is signposted from the ring road, and are marshalled to the loading doors in arrival order. Drivers need a build-up pass, which is issued at the gate against the exhibitor list, and hi-vis is mandatory on the loading apron. The site map and traffic plan are on the exhibitor portal.

Operations
Riverside Exhibition Centre`,
    why: 'SPEC §5.1 does not flag access information in ordinary logistics: the gate, passes and signage are public arrangements with no code or security gap.',
  },

  // customer-facing costs and discounts
  {
    id: 108, kind: 'boundary', category: 'none', expect: 'pass', industry: 'energy broker', variant: 'UK', setting: 'tariff comparison for a customer',
    boundary: '§5.5 customer-facing prices stated as facts',
    from: ['Dev Patel', 'dev.patel@switchwise-energy.example'], to: [['Fatima Begum', 'fatima.begum@begum-restaurants.test']],
    subject: 'Your renewal options',
    body: `Hi Fatima,

Your current contract ends in January. The three offers I have for you are: a one-year fix at 24.1p per unit with a 48p daily standing charge; a two-year fix at 25.3p and 45p; and a flexible tariff at 22.8p and 52p that can change quarterly. On last year's usage the two-year fix costs about 1,100 a year more than the one-year but protects you from the April change. Let me know which you would like and I will lock it in.

Dev`,
    why: 'SPEC §5.5 does not flag customer-facing prices stated as facts: the tariffs are the ones offered to the customer.',
  },
  {
    id: 109, kind: 'boundary', category: 'none', expect: 'pass', industry: 'garage', variant: 'UK', setting: 'repair estimate to a car owner',
    boundary: '§5.5 customer-facing prices and payment terms stated as facts',
    from: ['Hillside Garage', 'service@hillside-garage.example'], to: [['Rob Pearce', 'rob.pearce@homeuser-mail.test']],
    subject: 'Estimate for the brakes',
    body: `Hi Rob,

We have had a look at the car. Front pads and discs are needed, and the rear pads are close. The estimate is 285 for the front and 95 for the rear pads, parts and labour, plus the MOT at 54.85. If you want us to do it all tomorrow the car will be ready by 4. We take card or bank transfer on collection.

Hillside Garage`,
    why: 'SPEC §5.5 does not flag customer-facing prices and payment terms stated as facts: the estimate is what the customer will pay.',
  },
  {
    id: 110, kind: 'boundary', category: 'none', expect: 'pass', industry: 'removals', variant: 'AU', setting: 'moving quote',
    boundary: '§5.5 customer-facing prices and quotes stated as facts',
    from: ['Kristy Lam', 'kristy@eastside-removals.example'], to: [['Ben and Alice Turner', 'turner.move@homeuser-mail.test']],
    subject: 'Your move on the 18th',
    body: `Hi Ben and Alice,

Thanks for the walkthrough. For the move on the 18th we will send a 10-tonne truck and three removalists. The quote is 1,890 including GST, which covers packing the kitchen, all boxes and paper, and the piano. Insurance for transit is included up to 50,000; higher cover is available at 1 percent of the declared value. A 20 percent deposit holds the date.

Cheers
Kristy`,
    why: 'SPEC §5.5 does not flag customer-facing prices and quotes stated as facts: the quote and insurance rate are offered to the customer.',
  },
  {
    id: 111, kind: 'boundary', category: 'none', expect: 'pass', industry: 'wholesale bakery', variant: 'UK', setting: 'price list update to a trade customer',
    boundary: '§5.5 customer-facing prices stated as facts',
    from: ['Crust and Crumb', 'orders@crustandcrumb-bakery.example'], to: [['Dalia Mansour', 'dalia@mansour-deli.test']],
    subject: 'Trade prices from 1 December',
    body: `Hi Dalia,

Our trade prices change on 1 December. Sourdough loaves go to 3.10, baguettes to 1.45 and the croissant tray of 24 to 26.40. Everything else stays the same. Minimum order is still 40 and delivery is free within the city. The updated price list is attached in the next email.

Crust and Crumb`,
    why: 'SPEC §5.5 does not flag customer-facing prices stated as facts: these are the prices the customer will pay.',
  },

  // named people doing ordinary logistics
  {
    id: 112, kind: 'boundary', category: 'none', expect: 'pass', industry: 'logistics', variant: 'UK', setting: 'driver change notice to a customer',
    boundary: '§5.4 names, job titles and roles do not flag',
    from: ['Dispatch', 'dispatch@northway-couriers.example'], to: [['Goods In', 'goodsin@hartwell-electronics.test']],
    subject: 'Your driver this week',
    body: `Hi,

Your regular driver Sunil is on holiday this week, so Marek will be covering the route Monday to Friday. Same van, same times, roughly 8.30 to 9. Marek has done your site before and knows the goods-in procedure. Sunil is back on the 4th.

Dispatch
Northway Couriers`,
    why: 'SPEC §5.4 does not flag an absence without a stated cause beyond ordinary leave, or names and roles: a holiday is a schedule fact, not a health, family, legal or HR matter.',
  },
  {
    id: 113, kind: 'boundary', category: 'none', expect: 'pass', industry: 'accountancy', variant: 'UK', setting: 'team introduction to a client',
    boundary: '§5.4 names, job titles and roles do not flag',
    from: ['Pauline Webster', 'pauline@webster-accounts.example'], to: [['Hamid Sadiq', 'hamid@sadiq-pharmacy.test']],
    subject: 'Your team at Webster',
    body: `Dear Hamid,

Now that you are on board, here is who will be looking after you. I remain your engagement partner. Josh Tilley is your day-to-day manager and will prepare the quarterly VAT returns. Priya Shah handles payroll and will be in touch about your December run. Our bookkeeping team lead is Carl Dent, who you may hear from with queries on receipts.

Kind regards,
Pauline`,
    why: 'SPEC §5.4 does not flag names, job titles and roles: the email lists who does what and nothing personal about them.',
  },
  {
    id: 114, kind: 'boundary', category: 'none', expect: 'pass', industry: 'theatre', variant: 'UK', setting: 'cast availability to a venue',
    boundary: '§5.4 an absence or schedule change without a stated cause',
    from: ['Gemma Ward', 'gemma@lantern-theatre-co.example'], to: [['Technical', 'technical@playhouse-venues.test']],
    subject: 'Tech rehearsal changes',
    body: `Hi,

Two changes for the tech on Wednesday. Our lead, Owen, is unavailable until the evening, so we will tech the second act first and his scenes after 6. Our stage manager Beth is away all week and Carla is covering, so please direct cueing questions to her. Everything else is as per the schedule you have.

Gemma`,
    why: 'SPEC §5.4 does not flag an absence or schedule change without a stated cause: neither absence has a reason attached.',
  },
  {
    id: 115, kind: 'boundary', category: 'none', expect: 'pass', industry: 'property management', variant: 'US', setting: 'maintenance visit scheduling with a tenant',
    boundary: '§5.4 names, job titles and roles do not flag',
    from: ['Oakridge Property Management', 'maintenance@oakridge-pm.example'], to: [['Derek Hale', 'derek.hale@homeuser-mail.test']],
    subject: 'Furnace inspection Thursday',
    body: `Hi Derek,

Our HVAC technician, Carlos, will be by on Thursday between 1 and 3 for the annual furnace inspection. He will need access to the utility closet for about 30 minutes. If that window does not work, reply and we will reschedule. Carlos will have company ID.

Oakridge Property Management`,
    why: 'SPEC §5.4 does not flag names, job titles and roles, and §5.1 does not flag access in ordinary logistics: a named technician visiting is routine.',
  },
  {
    id: 116, kind: 'boundary', category: 'none', expect: 'pass', industry: 'football club', variant: 'UK', setting: 'match day arrangements with an opposing club',
    boundary: '§5.4 names, job titles and roles do not flag',
    from: ['Dave Horton', 'secretary@ashby-rovers.example'], to: [['Fixtures', 'fixtures@milton-athletic.test']],
    subject: 'Saturday fixture',
    body: `Hi,

Confirming Saturday's fixture at our place, 2pm kick-off, meet at 1. Our manager Gary Freeman will meet your lot at the gate and our physio Sue will be pitchside for both teams as agreed. Referee is confirmed by the league. Changing rooms are open from 12.30. Teas after in the clubhouse.

Dave Horton
Secretary, Ashby Rovers`,
    why: 'SPEC §5.4 does not flag names, job titles and roles: the named people are doing ordinary match-day logistics.',
  },

  // other boundaries
  {
    id: 117, kind: 'boundary', category: 'none', expect: 'pass', industry: 'software', variant: 'UK', setting: 'support escalation note to a customer',
    boundary: '§5.10 "our internal team" does not flag',
    from: ['Support', 'support@quartz-crm.example'], to: [['Nina Ferreira', 'nina.ferreira@ferreira-travel.test']],
    subject: 'Re: Sync issue, ticket 5521',
    body: `Hi Nina,

Thanks for your patience. I have passed the sync issue to our internal team, who have reproduced it and are working on a fix. We expect to release it in Thursday's update. In the meantime the workaround is to refresh the contact list manually after each import. I will confirm once the fix is live.

Support
Quartz CRM`,
    why: 'SPEC §5.10 does not flag the phrase "our internal team": it describes who is doing the work, not that the email is for inside readers only.',
  },
  {
    id: 118, kind: 'boundary', category: 'none', expect: 'pass', industry: 'hotel', variant: 'UK', setting: 'payment confirmation to a guest',
    boundary: '§5.2 the last four digits of a card',
    from: ['Front Desk', 'frontdesk@harbourview-hotel.example'], to: [['Olivia Bright', 'olivia.bright@homeuser-mail.test']],
    subject: 'Your payment',
    body: `Dear Olivia,

This confirms that the balance of 412.50 for your stay has been charged to the card ending 4242, as agreed at check-out. Your receipt is attached in a separate email. We hope you enjoyed your stay and look forward to seeing you again.

Front Desk
Harbourview Hotel`,
    why: 'SPEC §5.2 does not flag the last four digits of a card: only "card ending 4242" appears.',
  },
  {
    id: 119, kind: 'boundary', category: 'none', expect: 'pass', industry: 'garden centre', variant: 'UK', setting: 'price list to a landscaper',
    boundary: '§5.4 price lists do not flag',
    from: ['Trade Desk', 'trade@greenfingers-nursery.example'], to: [['Olly Marsh', 'olly@marsh-landscapes.test']],
    subject: 'Autumn trade prices',
    body: `Hi Olly,

Autumn trade prices for the lines you asked about:

- Yew, 60-80cm, 3 litre: 8.50
- Box balls, 30cm: 14.00
- Hornbeam bare root, 90-120cm, bundle of 25: 42.00
- Lavender Hidcote, 2 litre: 4.20
- Bulbs, tulip mixed, bag of 50: 11.00

All plus VAT, collected. Delivery within 20 miles is 35 per drop.

Trade Desk
Greenfingers Nursery`,
    why: 'SPEC §5.4 does not flag price lists, and §5.5 does not flag customer-facing prices: these are trade prices offered to the customer.',
  },
  {
    id: 120, kind: 'boundary', category: 'none', expect: 'pass', industry: 'manufacturing', variant: 'UK', setting: 'rejection of a supplier delivery',
    boundary: '§5.7 blunt disagreement, firm requests and criticism of work',
    from: ['Quality', 'quality@axiom-components.example'], to: [['Sales', 'sales@pennine-castings.test']],
    subject: 'Rejection of batch 2231',
    body: `Hi,

Batch 2231 is rejected. Fourteen of the forty castings have porosity visible on the machined face and three are out of tolerance on the bore. This is the second batch this quarter with the same defect. We require replacements within ten working days and a corrective action report before the next delivery. Collection of the rejected parts can be arranged with our stores.

Quality Department
Axiom Components`,
    why: 'SPEC §5.7 does not flag blunt disagreement, firm requests or criticism of work: the castings are rejected without any remark about the company or its people.',
  },
];
