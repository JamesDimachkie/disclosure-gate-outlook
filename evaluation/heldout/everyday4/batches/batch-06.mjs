// Batch 6: ordinary emails and stops (access, personal x2, economics x2, negotiation, remark). Literal text only.
export default [
  {
    ind: 'employment solicitors', en: 'UK',
    from: ['Claire Dunmore', 'claire.dunmore@dunmore-wilks.example'],
    to: [['Mr Stephen Marsh', 'stephen.marsh@mailbox.example']],
    subject: 'Re: Your meeting on Tuesday',
    body: `Dear Mr Marsh,

Thank you for your email. I can see you on Tuesday at 2.30pm at our Station Road office. Please bring your contract, your last three payslips and any letters you have received from your employer. The first meeting is 45 minutes and is free of charge, after which I'll explain our fees.

Kind regards,
Claire Dunmore
Solicitor

> Dear Ms Dunmore, I'd like to take some advice about my contract. Do you have an appointment free next week?`
  },
  {
    ind: 'will writing', en: 'UK',
    from: ['Graham Tolley', 'graham@tolley-wills.example'],
    to: [['Margaret and Roy Lacey', 'laceys@homepost.test']],
    subject: 'Your draft wills',
    body: `Dear Margaret and Roy,

Please find the details of your draft wills below. I'll post the typed copies tomorrow for you to read through. When you are happy, we can arrange to sign them in front of two independent witnesses. I'd suggest booking a morning at the office, or I can visit you at home for an extra £50. Please give me a ring if there is anything you'd like to change.

Graham Tolley`
  },
  {
    stop: 'access', place: 'subject',
    ind: 'independent shop', en: 'UK',
    from: ['Nadia Karim', 'nadia@karim-interiors.example'],
    to: [['Joe Pettit', 'joe.pettit@pettit-electrical.example']],
    subject: 'Alarm code is 3306 if you get there before me',
    body: `Hi Joe,

I'll try to be at the shop by 8 on Thursday, but traffic on the bypass is awful at the moment. Start with the sockets at the back of the stockroom, and I'll be there to talk through the lighting when I arrive.

Nadia`,
    sentence: 'Alarm code is 3306 if you get there before me',
    why: 'SPEC §5.1 premises codes: "Alarm code is 3306 if you get there before me" gives a working alarm code in the subject line.'
  },
  {
    ind: 'notary public', en: 'US',
    from: ['Ruth Schaeffer', 'ruth@schaeffer-notary.example'],
    to: [['Dennis Harmon', 'dennis.harmon@maplemail.example']],
    subject: 'Appointment to notarize documents',
    body: `Hi Dennis,

I can meet you on Wednesday at 4 PM. Please bring a government-issued photo ID, and don't sign the documents until we meet, since I need to witness your signature. The fee is $15 per signature. If you'd rather I came to you, mobile service is $40 plus mileage.

Ruth

> Hello, I need a few documents notarized this week. Are you available and what do you charge?`
  },
  {
    ind: 'veterinary referral hospital', en: 'US',
    from: ['Dr. Priya Anand', 'priya.anand@lakeside-specialty-vets.example'],
    to: [['Dr. Tom Brennan', 'tbrennan@elmstreet-animalclinic.example']],
    subject: 'Referral update: Bruno (Lab, 8 years)',
    body: `Tom,

Quick update on Bruno. The MRI showed a disc protrusion at L3-L4, and we're recommending surgery on Thursday. He's stable and eating well. I'll send the full report and the cost estimate to the owners today, and I'll call you after the procedure.

Thanks for the referral.

Priya`
  },
  {
    ind: 'audiology clinic', en: 'AU',
    from: ['Liz Haddad', 'liz@soundwise-audiology.example'],
    to: [['Ron Kessler', 'ron.kessler@ozmail.example']],
    subject: 'Your hearing aid fitting',
    body: `Hi Ron,

Your hearing aids are in. We can fit them on Thursday at 10:30 and spend about an hour programming and showing you how to look after them. Please bring someone along if you like, since a second pair of ears helps. Your follow-up in a fortnight is already in the diary.

Liz`
  },
  {
    ind: 'podiatry', en: 'UK',
    from: ['Hannah Birtles', 'hannah@birtles-podiatry.example'],
    to: [['Frank Dewhurst', 'frank.dewhurst@webmail.example']],
    subject: 'Your appointment',
    body: `Hello Frank, you're booked on Wednesday at 10.20. Wear loose socks and bring the shoes you walk in most. Hannah`
  },
  {
    ind: 'kindergarten', en: 'AU',
    from: ['Louise Garrett', 'louise@sunnyvale-kindergarten.example'],
    to: [['Priya and Dev Malhotra', 'malhotras@ozmail.example']],
    subject: 'Re: Start date for Anaya',
    body: `Hi Priya and Dev,

Anaya's first day is Monday 3rd. We suggest short days for the first week, with pick-up at 12, then moving to full sessions after. Please send in a labelled water bottle, hat, spare clothes and a rest-time blanket. Her teacher will be Ms Choi, and we'll hold a short welcome in the garden at 9.

Louise

> Hi, we're keen to know when Anaya can start, and whether there's a settling-in process.`
  },
  {
    ind: 'nursery school', en: 'US',
    from: ['Joyce Whitlock', 'office@littlebirches-preschool.example'],
    to: [['Mike and Dana Chen', 'chens@maplemail.example']],
    subject: 'Picture day and the spring concert',
    body: `Hi Mike and Dana,

Two things coming up. Picture day is Thursday the 12th, so wear something bright with no stripes if you can. The spring concert is on the 20th at 10 AM in the multipurpose room. Each class will sing two songs, and there will be juice and cookies afterward. Please send the permission form for photos back by Friday.

Joyce`
  },
  {
    ind: 'special school', en: 'UK',
    from: ['Angela Rimmer', 'office@brookfield-special-school.example'],
    to: [['Mrs Sally Hartigan', 'sally.hartigan@mailbox.example']],
    subject: 'Sensory garden open morning',
    body: `Dear Mrs Hartigan,

We'd love to see you at our sensory garden open morning on Friday 11 June, from 10 to 12. Pupils will show you around, and the school council will serve tea and biscuits. The garden is fully accessible, and parking is available at the front. If you'd like to bring a family member, they're welcome too.

Angela Rimmer
School Office, Brookfield School`
  },
  {
    ind: 'boarding school', en: 'UK',
    from: ['Matthew Reeve', 'matthew.reeve@wychbury-college.example'],
    to: [['Mr and Mrs Okoro', 'okoro.family@webmail.example']],
    subject: 'Exeat weekend arrangements',
    body: `Dear Mr and Mrs Okoro,

Exeat weekend begins after lessons on Friday 18th and boys should be back by 7pm on Sunday 20th. Please let the house office know if anyone else is collecting. Coaches to the station leave at 4.30 on Friday. Please remember that clothes should be marked and the laundry done at home as usual.

With best wishes,
Matthew Reeve
Housemaster`
  },
  {
    stop: 'economics', place: 'body',
    ind: 'cafe franchise', en: 'US',
    from: ['Trish Calloway', 'trish@calloway-cafes.example'],
    to: [['Greg Ainsley', 'greg.ainsley@ainsley-cpa.example']],
    subject: 'Quarterly numbers for the new location',
    body: `Hi Greg,

Thanks for turning the quarter around so quickly. I've gone through the draft and the revenue looks right to me.

Our overheads are $11,800 a month before we make a cent of profit. Can you check whether the lease is being coded to the right account?

Trish`,
    sentence: 'Our overheads are $11,800 a month before we make a cent of profit.',
    why: 'SPEC §5.5 internal economics: "Our overheads are $11,800 a month before we make a cent of profit." gives the sender\'s own monthly cost base.'
  },
  {
    ind: 'student accommodation', en: 'UK',
    from: ['Leanne Hurst', 'leanne@campusliving-halls.example'],
    to: [['Sunil Gupta', 'sunil.gupta@webmail.example']],
    subject: 'Moving in on Saturday',
    body: `Hi Sunil,

Moving-in day is Saturday. Please come to the reception in Parker Hall between 10 and 4, and bring photo ID and your tenancy agreement. You'll get your room key and a welcome pack. Parking bays are free for 30 minutes to unload. A student helper will show you where to find the lifts.

Leanne`
  },
  {
    ind: 'students union', en: 'UK',
    from: ['Josh Pemberton', 'josh@leedsuni-su.example'],
    to: [['Rhiannon Price', 'rhiannon.price@inbox.test']],
    subject: 'Society fair stall',
    body: `Hi Rhiannon,

Your society has a stall at the fair in the main hall on Wednesday from 10 to 4. You'll have a table and two chairs. Setup begins at 9. Please bring banners and sign-up sheets, and no helium balloons because of the fire rules. Each society gets one free power point on request.

Josh`
  },
  {
    ind: 'hospital charity', en: 'UK',
    from: ['Sally Pennington', 'sally@stmarys-hospital-appeal.example'],
    to: [['Ted Lancaster', 'ted.lancaster@webmail.example']],
    subject: 'Thank you for your donation',
    body: `Dear Ted,

On behalf of everyone at the appeal, thank you for your donation of £250. It will go towards the new children's playroom on Ward 7. We'll send you an update on its progress in the spring. If you'd like to see the room for yourself, we run tours on the last Tuesday of the month.

With grateful thanks,
Sally Pennington`
  },
  {
    ind: 'lifeboat fundraising', en: 'UK',
    from: ['Jim Treloar', 'jim@porthmellow-lifeboat.example'],
    to: [['Anna Pascoe', 'anna.pascoe@mailbox.example']],
    subject: 'Collection tins and the summer fete',
    body: `Hi Anna, thanks for taking the collection tins. Please bring them back after the fete on 21 July, and we'll count them in the boathouse. We'll need helpers for the tombola and the raffle from 11. Jim`
  },
  {
    ind: 'surf life saving club', en: 'AU',
    from: ['Matt Calloway', 'matt@bondiwest-slsc.example'],
    to: [['Zoe Hartnett', 'zoe.hartnett@ozmail.example']],
    subject: 'Patrol roster',
    body: `Hi Zoe,

You're on patrol with Jarrod's crew on Sunday the 15th, 8am to 1pm. Please sign on at the clubhouse by 7.45, wear your reds, and bring your own water and sunscreen. The surf is forecast to be big, so we may have a few extra people on the flags.

Matt`
  },
  {
    ind: 'volunteer fire brigade', en: 'AU',
    from: ['Rod Bessell', 'captain@kangarilla-cfs.example'],
    to: [['Linda Gough', 'linda.gough@ozmail.example']],
    subject: 'Fire danger season briefing',
    body: `Hi Linda,

The community briefing is on Sunday at 2pm at the fire station. We'll talk about bushfire survival plans, clearing around the house and the new warning system. Tea and Anzac biscuits afterwards. Please pass the word to your neighbours.

Rod`
  },
  {
    ind: 'mountain rescue team', en: 'UK',
    from: ['Cath Aspinall', 'cath@northpennine-mrt.example'],
    to: [['Greg Illingworth', 'greg.illingworth@webmail.example']],
    subject: 'Fundraising quiz night',
    body: `Hi Greg, we've got your team down for the quiz at the Fox and Hounds on 14 February, starting at 7.30. £5 a head. Raffle prizes would be gratefully received if you know anyone who might donate. Cath`
  },
  {
    ind: 'friends of the library', en: 'US',
    from: ['Margie Dunlop', 'margie@friendsofgreenvillelibrary.example'],
    to: [['Ed Stansfield', 'ed.stansfield@maplemail.example']],
    subject: 'Book sale volunteers',
    body: `Hi Ed,

We'd love your help at the book sale on the 9th and 10th. Shifts are 9 to 12, 12 to 3 and 3 to 6 in the library basement. You can sort, shelve or work the cash table. We've plenty of boxes to lift, so wear comfortable shoes. Let me know which shift suits you.

Margie`
  },
  {
    ind: 'historical society', en: 'US',
    from: ['Ellen Prewitt', 'ellen@oldmillhistoricalsociety.example'],
    to: [['Nathan Cole', 'nathan.cole@inbox.test']],
    subject: 'Re: Photographs of the old mill',
    body: `Dear Nathan,

Thank you for offering the photographs. We'd be delighted to scan them and return the originals. If you can bring them to the museum on Saturday between 10 and 2, we'll give you a receipt. Please write names and dates on a sticky note on the back if you know them.

Ellen Prewitt

> I have some photos of the old mill from the 1950s that my grandfather took. Would the society like to see them?`
  },
  {
    ind: 'family history society', en: 'UK',
    from: ['Brenda Clough', 'brenda@calderside-familyhistory.example'],
    to: [['Michael Rudd', 'michael.rudd@homepost.test']],
    subject: 'Talk on tracing ancestors',
    body: `Dear Michael,

Our next talk is on Tuesday 13th at 7.30pm at the Methodist hall. It's called "Tracing Your Ancestors Before 1837" and is given by Dr Pauline Wray. Members are free, and visitors £3. Parish registers are available for anyone who wants to look through them afterwards.

Brenda Clough`
  },
  {
    ind: 'independent cinema', en: 'UK',
    from: ['Frank Butterworth', 'frank@regal-picturehouse.example'],
    to: [['Linda Pickles', 'linda.pickles@mailbox.example']],
    subject: 'Screening for the film club',
    body: `Dear Linda,

You can have Screen 2 for the film club on the first Tuesday of each month at 7. Hire is £75 a night, which includes the projectionist and the licence, but not the film itself, which you'd need to choose from our list. We can supply tea and biscuits for £1 a head.

Frank`
  },
  {
    ind: 'trampoline park', en: 'AU',
    from: ['Danny Ng', 'danny@boingzone-jump.example'],
    to: [['Michelle Ford', 'michelle.ford@ozmail.example']],
    subject: 'Birthday booking confirmed',
    body: `Hi Michelle,

All set for Cooper's birthday on Saturday at 11. You've got 14 jumpers for 90 minutes, then 30 minutes in the party room with pizza and juice. Everyone needs the waiver signed, and grip socks, which we sell at the desk for $4 if anyone forgets. The party host is Jess.

Danny`
  },
  {
    stop: 'remark', place: 'body',
    ind: 'building inspection consultancy', en: 'AU',
    from: ['Lyn Crowther', 'lyn@crowther-building-consultants.example'],
    to: [['Mark Sheedy', 'mark.sheedy@sheedy-constructions.example']],
    cc: [['Site Office', 'office@sheedy-constructions.example']],
    subject: 'Re: Final inspection booking',
    body: `Hi Mark,

I've put in the request for the final inspection for Thursday afternoon. The certifier's office says they can do 2pm. Please make sure the pool fence and the smoke alarm certificates are on site.

That inspector is a jumped-up little tyrant. Check every item twice.

Lyn`,
    sentence: 'That inspector is a jumped-up little tyrant.',
    why: 'SPEC §5.7 remarks: "That inspector is a jumped-up little tyrant." is a disparaging remark about a person.'
  },
  {
    ind: 'ayurvedic spa', en: 'IN',
    from: ['Meera Pillai', 'bookings@keralaroots-spa.example'],
    to: [['Mrs Rekha Menon', 'rekha.menon@webmail.example']],
    subject: 'Confirmation of your retreat booking',
    body: `Dear Mrs Menon,

Thank you for booking our seven-day wellness retreat from 4 to 11 March. Your room is on the garden side. Meals are vegetarian and prepared fresh each day. Please bring light cotton clothes, a shawl for the evenings and sun protection. The airport pick-up from Kochi is arranged, and the driver will carry a card with your name.

Warm regards,
Meera Pillai`
  },
  {
    ind: 'tea exporter', en: 'IN',
    from: ['Sanjay Barua', 'sanjay@baruatea-exports.example'],
    to: [['Helen Marwood', 'helen.marwood@marwood-tea.example']],
    cc: [['Imports', 'imports@marwood-tea.example']],
    subject: 'Re: Second flush shipment',
    body: `Dear Helen,

The second flush lot is packed and will be shipped from Kolkata on the 14th. We are sending 400 kg in 20 foil-lined chests. The documents, including the phytosanitary certificate and the bill of lading, will be sent to you by courier on the 15th. Kindly confirm the receiving address for the consignment.

With regards,
Sanjay Barua

> Dear Sanjay, could you tell me when the second flush will ship, and what the packaging will be?`
  },
  {
    ind: 'textile exporter', en: 'IN',
    from: ['Anita Deshmukh', 'anita@deshmukh-textiles.example'],
    to: [['Brian Ashcroft', 'brian.ashcroft@ashcroft-interiors.example']],
    cc: [['Studio', 'studio@ashcroft-interiors.example']],
    subject: 'Fabric samples dispatched',
    body: `Dear Brian,

The fabric swatches you requested were couriered today. There are 14 qualities in cotton and linen blend, and colour cards for each. The minimum order is 300 metres per colour and lead time is six weeks from approval. Kindly look at the swatches and tell me which ones you want to take further.

Best regards,
Anita Deshmukh`
  },
  {
    ind: 'shipping agent', en: 'SG',
    from: ['Daniel Koh', 'daniel@seabridge-shipping.example'],
    to: [['Priya Nair', 'priya.nair@lionfoods.example']],
    subject: 'Vessel ETA update',
    body: `Hi Priya,

The vessel is delayed by one day because of port congestion, with a new ETA of Thursday evening. Unloading is expected on Friday morning. Your forwarder should arrange the truck for Friday 8am. We will advise if there's any further change.

Daniel`
  },
  {
    stop: 'economics', place: 'quoted',
    ind: 'renovation contractor', en: 'CA',
    from: ['Kevin Tremblay', 'kevin@tremblay-renos.example'],
    to: [['Susan Gagnon', 'susan.gagnon@maplemail.example']],
    subject: 'Re: Basement renovation quote',
    body: `Hi Susan,

Thanks for your patience. The revised quote is attached to the portal and the start date is the 3rd.

Kevin

On Fri, Nov 6, Mario Bellavance wrote:
> Remember we've padded the quote with a 12 percent contingency that the client doesn't know about.`,
    sentence: 'Remember we\'ve padded the quote with a 12 percent contingency that the client doesn\'t know about.',
    why: 'SPEC §5.5 internal economics: "Remember we\'ve padded the quote with a 12 percent contingency that the client doesn\'t know about." (quoted history) discloses a hidden contingency in the sender\'s own quote.'
  },
  {
    ind: 'ski school', en: 'CA',
    from: ['Marc Lavoie', 'marc@whistlerpeak-skischool.example'],
    to: [['Hannah Brewer', 'hannah.brewer@maplemail.example']],
    subject: 'Kids ski lessons, week of Feb 9',
    body: `Hi Hannah,

The kids' group lessons run Monday to Friday from 9:30 to 12:00, starting at the Kids' Zone by the gondola. Please arrive by 9:00 for boot and helmet fitting. Pack a snack, goggles and a spare pair of mittens. Level 2 starts on the beginner slope and moves to the green runs once they're confident. A coach will walk them to lunch.

Marc`
  },
  {
    ind: 'sailing club', en: 'AU',
    from: ['Ian Treloar', 'ian@sandringham-sailing.example'],
    to: [['Pippa Walsh', 'pippa.walsh@ozmail.example']],
    subject: 'Twilight race on Wednesday',
    body: `Hi Pippa, twilight race is Wednesday at 5.30 and the forecast is 12 to 15 knots. We're one short on crew, so it'd be great if you could come. Sausage sizzle after. Ian`
  },
  {
    ind: 'rowing club', en: 'UK',
    from: ['Sandy Harrower', 'sandy@trentside-rowing.example'],
    to: [['Joel Peake', 'joel.peake@webmail.example']],
    subject: 'Learn to row, starts 6 April',
    body: `Hi Joel,

The six-week Learn to Row course starts on 6 April, Saturdays 9 to 11. You'll learn on ergs first and then in the boats from week three. Please wear tight-fitting kit, bring water and a change of clothes. You must be able to swim 50 metres. The course is £90, which includes a month's membership afterwards.

Sandy`
  },
  {
    ind: 'canal boat hire', en: 'UK',
    from: ['Ruth Gadsby', 'bookings@nine-locks-narrowboats.example'],
    to: [['Phil and Jo Stanton', 'stantons@mailbox.example']],
    subject: 'Handover instructions',
    body: `Dear Phil and Jo,

Handover for Heron is at 2pm on Friday at Nine Locks marina. You'll get a 45-minute briefing on steering, locks and the toilet, and a map with the best moorings. Please bring your own bedding and towels. Diesel is included, and the boat needs to be back by 9am the following Friday.

Have a wonderful trip,
Ruth`
  },
  {
    stop: 'personal', place: 'body',
    ind: 'recruitment consultancy', en: 'UK',
    from: ['Natalie Brooke', 'natalie@brooke-recruitment.example'],
    to: [['Peter Hallam', 'peter.hallam@hallam-hr.example']],
    subject: 'Benchmarking your pay review',
    body: `Hi Peter,

Thanks for sending the pay-review questions. I've got a survey of local salaries that should help, and I can talk you through it on Monday.

Gillian earns £36,500 and gets a 3 percent rise in April. That puts her near the middle of the band for her role.

Natalie`,
    sentence: 'Gillian earns £36,500 and gets a 3 percent rise in April.',
    why: 'SPEC §5.4 personal details: "Gillian earns £36,500 and gets a 3 percent rise in April." states a named employee\'s salary and pay rise to an outsider.'
  }
];
