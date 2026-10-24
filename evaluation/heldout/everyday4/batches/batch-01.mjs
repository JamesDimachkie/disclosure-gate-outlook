// Batch 1: 34 ordinary emails and 6 stops (access x2, personal, economics, negotiation, remark). Literal text only.
export default [
  {
    ind: 'garage', en: 'UK',
    from: ['Dean Whitlock', 'dean@harbourside-motors.example'],
    to: [['Priya Raman', 'priya.raman@mailbox.example']],
    subject: 'Your Fiesta is ready to collect',
    body: `Hi Priya,

Your Fiesta passed its MOT this morning. The only extra work was a new offside front tyre, so the total comes to £184.60 including the test fee, same as the estimate I gave you on Monday.

We're open until 5.30 today and 8 till 1 on Saturday. If you can't make either, give me a ring on 01632 960412 and we'll sort something out.

Cheers,
Dean
Harbourside Motors`
  },
  {
    ind: 'vet practice', en: 'AU',
    from: ['Lena Oduya', 'lena@bayview-vets.example'],
    to: [['Tom Hargreaves', 'tom.hargreaves@ozmail.example']],
    subject: 'Pickle\'s dental check',
    body: `Hi Tom,

Just a reminder that Pickle's dental check is booked for Thursday at 2:15pm. Please don't feed him after 8 the night before, but water is fine. You can drop him in any time from 8am and we'll ring when he's awake and ready to go home.

Thanks,
Lena
Bayview Veterinary Clinic`
  },
  {
    ind: 'dentist front desk', en: 'US',
    from: ['Maria Castellano', 'frontdesk@lakeshore-dental.example'],
    to: [['James Whitfield', 'jwhitfield@maplemail.example']],
    subject: 'Appointment reminder: Tuesday 10:30',
    body: `Hi James,

This is a reminder of your cleaning on Tuesday at 10:30 AM with Dr. Feldman. Please arrive about ten minutes early so we can update your paperwork. If you need to reschedule, just reply here or call us at (555) 010-2290 at least 24 hours ahead.

See you soon!
Maria
Lakeshore Family Dental`
  },
  {
    ind: 'primary school', en: 'UK',
    from: ['Alison Pryce', 'office@oakfield-primary.example'],
    to: [['Mr and Mrs Kowalski', 'kowalski.family@homepost.test']],
    subject: 'Year 3 trip to the farm on Friday 14th',
    body: `Dear Mr and Mrs Kowalski,

A few reminders for Friday's trip to Hollins Farm:

- Children should come in school uniform with a waterproof coat and wellies (a carrier bag for muddy boots is a good idea)
- Packed lunch in a disposable bag, please, no glass bottles
- The £4.50 contribution can be paid through ParentPay by Wednesday
- We leave at 9.15 and expect to be back by 3pm, so normal pick-up

If you haven't returned the consent slip yet, please send it in with your child tomorrow.

Kind regards,
Mrs Pryce
School Office, Oakfield Primary`
  },
  {
    ind: 'junior football club', en: 'UK',
    from: ['Gary Metcalfe', 'secretary@eastgate-juniors.example'],
    to: [['Sam Whitaker', 'sam.whitaker@webmail.example']],
    cc: [['Lee Cartwright', 'lee.cartwright@inbox.test']],
    subject: 'U11s fixture Saturday - kick-off moved',
    body: `Hi Sam, Lee,

Saturday's game against Marsden Rovers has been put back to 11.30 because their pitch is being re-marked. Same venue. Warm-up from 10.45 please, and can someone bring the first aid bag as ours is at the other ground.

Gary`
  },
  {
    ind: 'stock agent', en: 'AU',
    from: ['Col Brennan', 'col@brennan-stock.example'],
    to: [['Fiona McAllister', 'fiona@mcallister-pastoral.example']],
    subject: 'Thursday sale: your weaners',
    body: `G'day Fiona,

Yarding looks like about 1,400 head Thursday, so your 60 weaners should draw a good crowd if the weather holds. I'll have them drafted by weight at the yards from first light, and Wilco's truck is booked for 6am at your gate.

Ring me tonight if you want to change the catalogue entry before it goes out.

Col`
  },
  {
    stop: 'access', place: 'quoted',
    ind: 'holiday cottages', en: 'UK',
    from: ['Gwen Prosser', 'gwen@seaview-cottages.example'],
    to: [['Mark Ellison', 'mark.ellison@webmail.example']],
    subject: 'Re: Arrival on Saturday',
    body: `Hi Mark,

No problem at all, Saturday from 3pm is fine. See you then!

Gwen

On Wed, 11 Sep 2026 at 18:40, Gwen Prosser wrote:
> Hi Mark, if we're out when you arrive, the spare key is under the third flowerpot on the left of the porch.
> Parking is on the lane side, please leave the gravel free for the bin lorry.`,
    sentence: 'if we\'re out when you arrive, the spare key is under the third flowerpot on the left of the porch.',
    why: 'SPEC §5.1 where a key is hidden: "if we\'re out when you arrive, the spare key is under the third flowerpot on the left of the porch." (quoted history) says where the spare key is hidden.'
  },
  {
    ind: 'church', en: 'US',
    from: ['Ruth Alvarez', 'office@stmarks-community.example'],
    to: [['Don Whitmore', 'don.whitmore@maplemail.example']],
    subject: 'Fellowship hall for the 22nd',
    body: `Hi Don,

Ruth here. The fellowship hall is yours from 2 to 6 on the 22nd for the retirement party. Tables and folding chairs are set up already, so tell me if you want a different layout. The kitchen is available too, but please clean up and take any food home with you.

Let me know how many guests you're expecting and I'll tell the sexton.

Blessings,
Pastor Ruth`
  },
  {
    ind: 'hair salon', en: 'UK',
    from: ['Jess Palmer', 'jess@studio14-hair.example'],
    to: [['Amara Bello', 'amara.bello@mailbox.example']],
    subject: 'Booking confirmed',
    body: `Hi Amara,

You're booked in for a cut and colour on Saturday at 11 with me. Colour takes about two and a half hours so please allow until around 2. As you're new to us I'd like to do a patch test at least 48 hours before, so can you pop in on Thursday for ten minutes?

Jess x`
  },
  {
    ind: 'metal fabrication', en: 'US',
    from: ['Ray Kowalczyk', 'ray@ironbridge-fab.example'],
    to: [['Denise Park', 'dpark@tri-county-hvac.example']],
    cc: [['Mike Sandoval', 'msandoval@tri-county-hvac.example']],
    subject: 'Re: Quote 4417 - hanger brackets',
    body: `Denise,

Yes, we can hold the 3/16 plate pricing through the end of the month. Lead time is still about three weeks from PO. Let me know if you want powder coat on those or just primer.

Ray

On Mon, Jun 3, Denise Park wrote:
> Ray, can you confirm the price you quoted on the hanger brackets still holds, and what the lead time looks like? We'd want 200 to start.`
  },
  {
    ind: 'water testing laboratory', en: 'UK',
    from: ['Nisha Varma', 'results@tarnbeck-labs.example'],
    to: [['Colin Atherton', 'colin.atherton@farmpost.example']],
    subject: 'Borehole sample results',
    body: `Hi Colin,

Your private supply sample was tested on Tuesday. Results:

- Total coliforms: 0 per 100 ml
- E. coli: 0 per 100 ml
- Nitrate: 18 mg/l
- pH: 7.2
- Iron: 0.04 mg/l

Everything is within the limits for drinking water. We'd suggest retesting once a year, and sooner if the water changes colour or taste or after any work on the borehole. Ring me if you'd like any of this explained.

Nisha Varma
Analytical Services, Tarnbeck Laboratories`
  },
  {
    ind: 'haulage', en: 'UK',
    from: ['Steph Garner', 'transport@garner-haulage.example'],
    to: [['Keith Morley', 'keith.morley@morley-timber.example']],
    cc: [['Yard Office', 'yard@morley-timber.example']],
    subject: 'Collection Wednesday 7am, two loads',
    body: `Morning Keith,

We'll be with you at 7 on Wednesday for the two loads to Stockport. Driver is Paul in the red curtain-sider. He'll need the loading bay clear and someone to sign the delivery note. Back-load is booked, so we'd like to be away by 8.30 if we can.

Steph`
  },
  {
    ind: 'letting agent', en: 'UK',
    from: ['Priya Nair', 'lettings@castlegate-homes.example'],
    to: [['Joe Hennessy', 'joe.hennessy@inbox.test']],
    subject: 'Re: Boiler service Thursday',
    body: `Hi Joe,

The Gas Safe engineer will be at 14 Mill Lane between 9 and 12 on Thursday. Someone over 18 will need to be in. If you'd rather give him an alternative time, tell me by tomorrow and I'll rearrange.

Priya

> Hi Priya, when is the boiler being serviced? I work from home Thursdays but not Friday mornings.`
  },
  {
    ind: 'IT support', en: 'US',
    from: ['Marcus Teller', 'support@pinecone-it.example'],
    to: [['Helen Goss', 'helen@goss-accounting.example']],
    cc: [['Rob Goss', 'rob@goss-accounting.example']],
    subject: 'Re: printer keeps dropping off the network',
    body: `Helen,

I replaced the cable at the wall and gave the printer a fixed address, which should stop it wandering. Try printing a few things this afternoon. If it drops again, note the time and I'll check the router log.

Marcus

> The printer in the back office has been going offline every couple of hours since Monday. Restarting it works for a while. Can someone take a look?`
  },
  {
    ind: 'freelance web design', en: 'AU',
    from: ['Isla Montague', 'isla@montague-design.example'],
    to: [['Ben Taylor', 'ben@taylorsurf.example']],
    cc: [['Kai Taylor', 'kai@taylorsurf.example']],
    subject: 'Homepage mockups v2',
    body: `Hi Ben,

Version 2 of the homepage is up for review at https://montague-design.example/review/taylor-v2. I kept the wave header but moved the lesson booking button above the fold, as you suggested. Mobile view is the second tab.

Could you send comments by Friday so I can start building on Monday?

Cheers,
Isla`
  },
  {
    ind: 'council contractor', en: 'UK',
    from: ['Neil Ashworth', 'neil.ashworth@ashworth-civils.example'],
    to: [['Highways Liaison', 'highways.liaison@northmoor-council.example']],
    subject: 'Mill Lane resurfacing: closure dates',
    body: `Hello,

Following our meeting, here are the closure dates for the Mill Lane resurfacing:

Monday 7 to Wednesday 9: planing and patching, one-way working with temporary lights
Thursday 10: full closure 9.30 to 3.30 for surfacing
Friday 11: road markings, lane closure only

We'll deliver letters to residents on Thursday and keep access for emergency vehicles throughout. Please confirm the notice has been published so we can book the signage.

Neil Ashworth
Contracts Manager, Ashworth Civils`
  },
  {
    ind: 'brewery', en: 'IE',
    from: ['Fergal Nolan', 'fergal@killarney-ales.example'],
    to: [['Siobhan Keane', 'siobhan@thebridgeinn.example']],
    subject: 'Tuesday delivery',
    body: `Siobhan,

Grand so, 6 kegs of the red and 4 of the pale on Tuesday, between 10 and 12. The lads will bring the empties back with them, so have them out the back if you can.

Fergal`
  },
  {
    ind: 'dairy farm', en: 'NZ',
    from: ['Hemi Walker', 'hemi@walker-dairy.example'],
    to: [['Anna Kowhai', 'anna@kiwimail.example']],
    subject: 'Weekend pick-up at the gate',
    body: `Kia ora Anna,

Eggs and milk will be in the chilly bin at the farm gate from 8 on Saturday. Honesty box as usual, $6 for a dozen eggs and $4 for the two litre bottle. Bring your own bottles back clean and I'll swap them.

Hemi`
  },
  {
    ind: 'plumber', en: 'UK',
    from: ['Gareth Pugh', 'gareth@pugh-plumbing.example'],
    to: [['Elaine Sutcliffe', 'elaine.sutcliffe@mailbox.example']],
    cc: [['Frank Sutcliffe', 'frank.sutcliffe@mailbox.example']],
    subject: 'Quote for the bathroom',
    body: `Dear Mrs Sutcliffe,

Thank you for having me round on Tuesday. My quote for removing the bath and fitting the walk-in shower, new basin and heated towel rail is £2,850 plus VAT. That covers pipework, waste, labour and disposal. Tiling isn't included, but I can recommend someone.

The quote is valid for 30 days. If you'd like to go ahead I could start on the week of the 20th.

Kind regards,
Gareth Pugh`
  },
  {
    ind: 'physiotherapy', en: 'AU',
    from: ['Kerry Holt', 'kerry@northside-physio.example'],
    to: [['Dan Pruitt', 'dan.pruitt@ozmail.example']],
    subject: 'Your exercise plan',
    body: `Hi Dan,

Here's the plan we went through today for your shoulder:

1. Pendulum swings, 2 minutes, three times a day
2. Wall slides, 10 reps, twice a day
3. Band rotations, 3 sets of 12, once a day

Stop if anything sharply hurts and let me know. See you again next Tuesday at 4.

Kerry`
  },
  {
    ind: 'food bank', en: 'UK',
    from: ['Margaret Oyelaran', 'volunteers@stjohns-foodbank.example'],
    to: [['Rob Candy', 'rob.candy@webmail.example']],
    subject: 'Saturday rota',
    body: `Hi Rob,

Thank you for offering to help on Saturday. We'd love you on the sorting table from 9 till 12. Wear flat shoes, bring a mug if you want tea, and come to the side door of the church hall. Susan will show you where everything is.

Margaret`
  },
  {
    ind: 'cafe', en: 'US',
    from: ['Tina Brooks', 'tina@corner-grind.example'],
    to: [['Alex Rivera', 'alex.rivera@maplemail.example']],
    subject: 'Catering order for Friday',
    body: `Hi Alex,

Confirming your order for Friday's 9 AM team meeting:

2 dozen assorted mini muffins
1 large coffee box (about 12 cups)
1 fruit platter
Cups, napkins and stirrers

That's $146.50 with tax. We'll deliver between 8:30 and 8:45, and you can pay by card when the driver arrives, or I can send an invoice if you prefer.

Thanks!
Tina`
  },
  {
    ind: 'bicycle shop', en: 'US',
    from: ['Hal Dunmore', 'service@spokeandchain.example'],
    to: [['Nina Petrov', 'nina.petrov@inbox.test']],
    subject: 'Bike ready',
    body: `Hi Nina, your bike's done and ready whenever you are. We close at 6 tonight. Hal`
  },
  {
    ind: 'swimming club', en: 'AU',
    from: ['Carol Young', 'secretary@redcliffe-swim.example'],
    to: [['Matt Lee', 'matt.lee@ozmail.example']],
    subject: 'Carnival on Sunday: what to bring',
    body: `Hi Matt,

For Sunday's carnival at the Redcliffe pool:

- Warm-up from 7.30, first heat at 8.15
- Club cap and two pairs of goggles, in case of breakage
- A towel, a warm top and something to sit on
- Sunscreen and a hat, as the stands have no shade
- Snacks and water; the canteen takes cash only

Every swimmer's event card needs to be signed before they go behind the blocks. Bring yours to the marshalling area.

Carol`
  },
  {
    stop: 'access', place: 'subject',
    ind: 'warehouse', en: 'US',
    from: ['Dale Whitcomb', 'dale@northgate-supply.example'],
    to: [['Carl Pruitt', 'carl@pruitt-freight.example']],
    subject: 'Dock gate code 3615 for tomorrow\'s pickup',
    body: `Carl,

Your driver can pick up from bay 4 any time after 6 AM. Have him check in at the office window on the way out and we'll sign the bill of lading.

Dale`,
    sentence: 'Dock gate code 3615 for tomorrow\'s pickup',
    why: 'SPEC §5.1 premises codes: "Dock gate code 3615 for tomorrow\'s pickup" gives a working gate code in the subject line.'
  },
  {
    ind: 'homeowners association', en: 'US',
    from: ['Pat Delgado', 'pat@riverbend-hoa.example'],
    to: [['Gloria Nash', 'gloria.nash@maplemail.example']],
    subject: 'Pool closed for resurfacing next week',
    body: `Hi Gloria,

Quick heads-up that the community pool will be closed Monday through Friday next week while the surface is redone. The spa and the tennis courts stay open. Reopening is Saturday at 10, weather permitting. Please pass this along to any neighbors who aren't on the email list.

Pat`
  },
  {
    ind: 'tax practice', en: 'CA',
    from: ['Jaspreet Sandhu', 'jas@sandhu-cpa.example'],
    to: [['Mike Dufresne', 'mike@dufresne-roofing.example']],
    cc: [['Julie Dufresne', 'julie@dufresne-roofing.example']],
    subject: 'Year-end: what I need from you',
    body: `Hi Mike,

To finish your year-end, I need the following by the 15th:

1. Bank statements for all three accounts, January to December
2. Fuel and supplier receipts you haven't already uploaded
3. The payroll summary from your provider
4. A list of any equipment bought or sold in the year, with dates
5. HST filings if you've had a letter from the CRA

If something doesn't exist, just tell me. Better to know now than at the deadline.

Jaspreet`
  },
  {
    ind: 'florist', en: 'UK',
    from: ['Rosie Penhale', 'rosie@petalpost-florist.example'],
    to: [['Daniel Okoye', 'daniel.okoye@mailbox.example']],
    subject: 'Sunday delivery confirmed',
    body: `Hi Daniel,

Your bouquet of peonies and white roses is booked for delivery this Sunday between 11 and 1. I've added a card with your message. If there's nobody in, the driver will leave it with a neighbour and put a note through the door.

Rosie`
  },
  {
    ind: 'care home activities', en: 'UK',
    from: ['Judith Marsh', 'activities@elmcourt-care.example'],
    to: [['Paul Hendry', 'paul.hendry@homepost.test']],
    subject: 'Family afternoon tea, Saturday 3rd',
    body: `Dear Paul,

We're holding our summer afternoon tea in the garden room on Saturday 3rd from 2.30 to 4.30, and families are very welcome. There will be sandwiches, scones and a singer from the local choir. Please let us know by Wednesday how many will be coming so the kitchen can plan.

Parking is at the front, with a few spaces by the side door for anyone who finds the walk difficult.

Kind regards,
Judith Marsh
Activities Coordinator, Elm Court`
  },
  {
    ind: 'driving school', en: 'UK',
    from: ['Ahmed Rashid', 'ahmed@pass-first-driving.example'],
    to: [['Chloe Barnes', 'chloe.barnes@webmail.example']],
    subject: 'Lesson moved to 4pm Thursday',
    body: `Hi Chloe, can we move Thursday's lesson to 4pm? I've a test cancellation to cover at 2. Same pick-up spot. Let me know. Ahmed`
  },
  {
    ind: 'print shop', en: 'US',
    from: ['Wendy Cho', 'wendy@quickimpress-print.example'],
    to: [['Frank Delaney', 'frank@delaneyautomotive.example']],
    subject: 'Proof for your business cards',
    body: `Frank,

Here's the proof for the business cards. Please check the phone number and spelling of the address very carefully, since once we print we can't change anything. If it's good, reply "approved" and we'll run them tomorrow. Standard turnaround is two business days.

Wendy`
  },
  {
    ind: 'electrical contractor', en: 'AU',
    from: ['Shane Moriarty', 'shane@moriarty-electrical.example'],
    to: [['Bec Hollis', 'bec.hollis@ozmail.example']],
    cc: [['Matt Hollis', 'matt.hollis@ozmail.example']],
    subject: 'Switchboard upgrade - dates',
    body: `Hi Bec,

We can do the switchboard upgrade on either the 14th or the 21st. The power will be off for around five hours from 8am, so plan for the fridge and anything with a clock. Once it's finished I'll test everything and leave you the compliance certificate.

Which date suits?

Shane`
  },
  {
    ind: 'removals', en: 'UK',
    from: ['Tony Briggs', 'bookings@briggs-removals.example'],
    to: [['Sophie Lang', 'sophie.lang@mailbox.example']],
    cc: [['Ben Lang', 'ben.lang@mailbox.example']],
    subject: 'Moving day checklist',
    body: `Hi Sophie,

Everything is set for the 18th. The crew of three arrive at 8. To help the day go smoothly:

- Defrost the freezer the day before
- Disconnect the washing machine (we can do it if you'd rather, there's a small charge)
- Keep the front door area clear and reserve a parking space outside if you can
- Label boxes by room and keep valuables and documents with you
- Set aside the kettle and a few mugs, you'll want tea by lunchtime

Tony`
  },
  {
    ind: 'pest control', en: 'US',
    from: ['Orrin Hale', 'dispatch@hale-pest.example'],
    to: [['Teresa Mendoza', 'teresa.mendoza@maplemail.example']],
    subject: 'Technician arriving between 1 and 3',
    body: `Hi Teresa,

Your technician, Luis, will arrive between 1 and 3 PM today. Please make sure he can reach the garage and the crawlspace hatch. Pets and kids should stay out of the treated areas for about two hours afterward.

Orrin`
  },
  {
    stop: 'personal', place: 'quoted',
    ind: 'banner printing', en: 'AU',
    from: ['Gail Rourke', 'gail@rourke-prints.example'],
    to: [['Samir Haddad', 'samir@haddad-signage.example']],
    subject: 'Re: Delay on the banner job',
    body: `Hi Samir,

I'm sorry about the delay. The banners will be with you on Friday, I promise.

Gail

On Tue, 8 Oct 2026 at 09:12, Samir Haddad wrote:
> Gail, I heard Ned has been in trouble with the police and was charged with assault last week. Is that why nobody answered the phone on Monday?`,
    sentence: 'I heard Ned has been in trouble with the police and was charged with assault last week.',
    why: 'SPEC §5.4 personal details: "I heard Ned has been in trouble with the police and was charged with assault last week." (quoted history) refers to a named person\'s criminal charge.'
  },
  {
    ind: 'childcare centre', en: 'AU',
    from: ['Kim Tran', 'director@littleacorns-childcare.example'],
    to: [['Joanna Wells', 'joanna.wells@ozmail.example']],
    subject: 'Orientation day and first invoice',
    body: `Hi Joanna,

We're looking forward to meeting Archie. His orientation is on Monday from 9 to 11, and you're welcome to stay for the first hour. Please bring a spare change of clothes, a hat, a water bottle and his bedding for rest time, all labelled.

Your first invoice for the fortnight will be emailed on Friday. The fee is $118 a day, less the government subsidy, which we apply once your account details come through.

Kim`
  }
];
