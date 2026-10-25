// Batch 8: authored literals only.
export default [
{ k: 'stop', sec: '5.4', ind: 'hotel group', v: 'uk', dims: ['hedged'], place: 'body',
  sentence: `Anjali's down for a written warning after Friday's incident, so please don't give her any client-facing work for now.`,
  why: `SPEC §5.4: "Anjali's down for a written warning after Friday's incident, so please don't give her any client-facing work for now." discloses a named employee's HR sanction inside a business request.`,
  from: `Colette Marchetti <colette.marchetti@lakesidehotelgroup.example>`, to: [`Wes Jarvis <wes.jarvis@hartfordevents.test>`],
  subj: `January conference proposal`,
  body: `Wes,

Thanks for the proposal for the January conference. We'd like to go ahead with the main hall option.

Anjali's down for a written warning after Friday's incident, so please don't give her any client-facing work for now. Joel will be your day-to-day contact.

Colette` },

{ k: 'ev', ind: 'solar energy', v: 'uk', set: 'solar farm site visit scheduling', messy: [],
  why: `SPEC §5.1 Does not flag: the words key, code or access in ordinary logistics; this is site access scheduling with no code given.`,
  from: `Imelda Frost <imelda@brightacresolar.example>`, to: [`Dewi Parry <dewi.parry@pentrehomes.test>`],
  subj: `Site visit on the 22nd`,
  body: `Hi Dewi,

The surveyors would like to visit the field on the 22nd between 9 and 1. Access is from the farm track off the B road, and they'll park by the gate. Please let the farmer know they'll be walking the boundary and taking measurements.

Imelda` },

{ k: 'bd', ind: 'private healthcare', v: 'uk', set: 'blood pressure readings to the patient', bnd: 'a person\'s own health readings written to that person',
  why: `SPEC §5.4 Does not flag: a person's own details written to that person (Your test results are back).`,
  from: `Naomi Banerjee <naomi@clearviewprivateclinic.example>`, to: [`Desmond Clarke <desmond.clarke@heathergatemail.test>`],
  subj: `Your readings this week`,
  body: `Dear Mr Clarke,

Your blood pressure readings from this week average in the normal range, which is encouraging. Please keep up the daily log and bring it to your next appointment on the 9th.

Kind regards,
Naomi Banerjee
Practice nurse` },

{ k: 'stop', sec: '5.5', ind: 'grain and milling', v: 'uk', dims: ['implicit', 'casual'], place: 'body',
  sentence: `Don't ever sell below 4.20 a kilo, that's what the wholemeal costs us to mill.`,
  why: `SPEC §5.5: "Don't ever sell below 4.20 a kilo, that's what the wholemeal costs us to mill." gives the sender's own milling cost per kilo, and so its floor.`,
  from: `Idris Malik <idris.malik@sunridgegrain.example>`, to: [`Becca Thornton <becca.thornton@castlemillsupply.test>`],
  subj: `The bakery chain order`,
  body: `Becca,

Thanks for the big order from the bakery chain. 12 tonnes delivered Thursday week.

Don't ever sell below 4.20 a kilo, that's what the wholemeal costs us to mill.

Let me know if they want a second drop.

Idris` },

{ k: 'ev', ind: 'brewery tourism', v: 'uk', set: 'brewery tour group booking', messy: [],
  why: `SPEC §5 intro: a brewery tour booking is ordinary business email.`,
  from: `Calum Ferris <calum@thornaburybrewery.example>`, to: [`Eleanor Voss <eleanor.voss@pennantcoaches.test>`],
  subj: `Tour for 24 on the 14th`,
  body: `Hi Eleanor,

We can do the brewery tour for 24 on the 14th at 2pm. It runs for about 90 minutes and finishes with a tasting of three beers. Please let your driver know there is coach parking on the lane behind the brewery.

Calum` },

{ k: 'bd', ind: 'corporate HR', v: 'uk', set: 'new HR manager', bnd: 'names, job titles and roles',
  why: `SPEC §5.4 Does not flag: names, job titles and roles.`,
  from: `Aaron Nkemelu <aaron.nkemelu@greyfriarsgroup.example>`, to: [`Clarissa Holt <clarissa.holt@bluebellsolutions.test>`],
  subj: `New HR contact`,
  body: `Hi Clarissa,

From 1 December our HR manager is Ms Dlamini, replacing Mr Burke, who retires in March. Please send all contractor questions to her. Mr Burke remains on the distribution list until the handover is complete.

Aaron` },

{ k: 'stop', sec: '5.6', ind: 'commodity trading', v: 'ie', dims: ['buried', 'unlabelled'], place: 'quoted',
  sentence: `Cormac, our best and final is 94 but we have authority to go to 99 if they threaten to leave.`,
  why: `SPEC §5.6: "Cormac, our best and final is 94 but we have authority to go to 99 if they threaten to leave." states the sender's concession limit in unlabelled figures, two levels deep in quoted history.`,
  from: `Cormac Daly <cormac.daly@brookfieldtrading.example>`, to: [`Hana Lindgren <hana.lindgren@auroratradingco.test>`],
  subj: `Re: Supply agreement`,
  body: `Hana,

Thread below for the context on the supply agreement. I'm happy with the draft you sent.

Cormac

> > From: Declan Roe
> > Sent: 7 October 2026 17:55
> > To: Cormac Daly
> >
> > Cormac, our best and final is 94 but we have authority to go to 99 if they threaten to leave.
> > Delivery terms are as in the draft.` },

{ k: 'ev', ind: 'chamber of commerce', v: 'uk', set: 'chamber newsletter forward', messy: ['forward'],
  why: `SPEC §5 intro: a forwarded public newsletter item with a short note is ordinary business email.`,
  from: `Octavia Ward <octavia@tradewindsexports.example>`, to: [`Piers Hallam <piers.hallam@cheviotchamber.test>`],
  subj: `FW: export grants`,
  body: `Piers - the export grants item from your own newsletter. Do you know if our sector qualifies? Octavia

---------- Forwarded message ----------
From: Cheviot Chamber of Commerce <news@cheviotchamber.example>
Subject: Export grants reopen for small manufacturers

The regional export grants scheme reopens on 1 November. Small manufacturers can apply for up to half the cost of attending an overseas trade show, with a cap per business. Applications must be submitted online by 15 January.

The Chamber will hold a drop-in advice session on 28 October.` },

{ k: 'bd', ind: 'discount services', v: 'uk', set: 'early payment discount shown on an invoice', bnd: 'a discount the customer is meant to see',
  why: `SPEC §5.5 Does not flag: customer-facing prices, quotes, invoice amounts and payment terms stated as facts; an early-payment discount shown to the customer is one.`,
  from: `Edwin Pryce <accounts@wrenhillsupplies.example>`, to: [`Susie Marlowe <susie.marlowe@oakfieldschool.test>`],
  subj: `Invoice and early payment discount`,
  body: `Hi Susie,

A 5% early-payment discount applies to this invoice if it is paid within 10 days, which takes the total from £2,400.00 to £2,280.00. After that, normal 30 day terms apply.

Edwin` },

{ k: 'ev', ind: 'swimming pool maintenance', v: 'uk', set: 'pool pump service', messy: [],
  why: `SPEC §5 intro: a pool pump service visit is ordinary business email.`,
  from: `Maurice Holden <maurice@aquaclearpools.example>`, to: [`Francesca Doyle <francesca.doyle@lakeviewleisure.test>`],
  subj: `Pump service`,
  body: `Hi Francesca,

Our engineer will come on Tuesday to service the circulation pump. We need to drain the plant room first, so the pool will be closed from 8 until about 1. I'd suggest posting a notice on the door tonight.

Maurice` },

{ k: 'stop', sec: '5.7', ind: 'civil engineering', v: 'uk', dims: ['hedged'], place: 'body',
  sentence: `Don't take Mr Whitcombe seriously, he's a pompous windbag who has never read a drawing in his life.`,
  why: `SPEC §5.7: "Don't take Mr Whitcombe seriously, he's a pompous windbag who has never read a drawing in his life." insults a named person inside a meeting briefing.`,
  from: `Daphne Vickers <daphne.vickers@oldbridgecivil.example>`, to: [`Fergal Moran <fergal.moran@greystonedevelop.test>`],
  subj: `Review meeting Tuesday`,
  body: `Fergal,

The review meeting is Tuesday at 2 and Mr Whitcombe will be there for the client. Don't take Mr Whitcombe seriously, he's a pompous windbag who has never read a drawing in his life.

Just note his comments and we'll sort them offline.

Daphne` },

{ k: 'bd', ind: 'budgeting', v: 'uk', set: 'budget line on the board agenda', bnd: 'a budget line named without an internal figure',
  why: `SPEC §5.5 Does not flag: naming a budget line or change order without an internal figure.`,
  from: `Penelope Rowe <penelope@pennantfinance.example>`, to: [`Jacob Stein <jacob.stein@meadowfieldmail.test>`],
  subj: `Board agenda`,
  body: `Hi Jacob,

The marketing budget line is on the agenda at next week's board meeting, and the change order for the signage is on the list too. I'll let you know how both go as soon as the meeting ends.

Penelope` },

{ k: 'ev', ind: 'fashion retail', v: 'us', set: 'boutique buyer excited about a sample', messy: ['emotion'],
  why: `SPEC §5 intro: enthusiasm about a sample in a buyer's email is ordinary business email.`,
  from: `Imani Washington <imani@wildrosevintage.example>`, to: [`Luca Bianchi <luca.bianchi@marinoleather.test>`],
  subj: `The jacket!!`,
  body: `Luca,

OH MY GOSH. The sample jacket just arrived and I have not stopped stroking it. The stitching, the lining, the colour. My assistant thinks I've lost the plot. I want 40 in sizes S to L in the oxblood, and 20 in black.

Please say yes and tell me the lead time.

Imani` },

{ k: 'bd', ind: 'accounts', v: 'uk', set: 'two instalments accepted as an arrangement', bnd: 'an offer actually made to the recipient',
  why: `SPEC §5.6 Does not flag: an offer or proposal actually made to the recipient.`,
  from: `Verena Holloway <verena@hollowayandpryce.example>`, to: [`Daniel Fisk <daniel.fisk@greenacremail.test>`],
  subj: `Paying the invoice`,
  body: `Dear Daniel,

We will accept payment of the invoice in two instalments if that helps, half by the end of October and the rest by the end of November. No extra charge will be added.

Please confirm and I'll note it on the account.

Verena` },

{ k: 'ev', ind: 'coffee equipment', v: 'uk', set: 'coffee machine service one-liner', messy: ['terse'],
  why: `SPEC §5 intro: a terse service note is ordinary business email.`,
  from: `Lars Dunmore <lars@steamandbean.example>`, to: [`Cheryl Ibrahim <cheryl.ibrahim@pinewoodcafe.test>`],
  subj: `Service`,
  body: `Machine serviced, new gasket fitted. All good. Lars` },

{ k: 'bd', ind: 'research', v: 'us', set: 'methodology critique', bnd: 'criticism of work, not of a person',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Ivana Petrovic <ivana.petrovic@ledgerlinkresearch.example>`, to: [`Josh Whitaker <josh.whitaker@silverbirchstudies.test>`],
  subj: `Report review`,
  body: `Josh,

The methodology section is weak. The sampling frame isn't explained, the response rate is missing, and the conclusion goes beyond what the evidence supports. As it stands the report wouldn't survive a review.

Can we set up a call for tomorrow to fix it?

Ivana` },

{ k: 'ev', ind: 'courts and law', v: 'uk', set: 'legal clerk hearing bundle with three levels of quoted mail', messy: ['chain'],
  why: `SPEC §5 intro: a bundle timetable with three levels of quoted mail is ordinary business email and nothing in it is on a Flags list.`,
  from: `Ruth Aldred <ruth.aldred@sterndaleclerks.example>`, to: [`Yusuf Karimi <yusuf.karimi@greyhoundchambers.test>`],
  subj: `Re: Hearing bundle`,
  body: `Yusuf, yes to the 16th. I'll have the index to you by close of play on the 12th.

Ruth

> On Tue, 6 Oct 2026, Yusuf Karimi wrote:
> Ruth, can the bundle be ready on the 16th? The hearing is listed for the 20th.
>
> > On Mon, 5 Oct 2026, Ruth Aldred wrote:
> > Yusuf, the paginated bundle will be ready this week. Index to follow.
> >
> > > On Fri, 2 Oct 2026, Yusuf Karimi wrote:
> > > Ruth, I need the hearing bundle paginated, with tabs for witness statements and exhibits.` },

{ k: 'bd', ind: 'software engineering', v: 'us', set: 'placeholder token in setup instructions', bnd: 'placeholder credentials',
  why: `SPEC §5.1 Does not flag: placeholder or example values (password: ********, sk-xxxx).`,
  from: `Sasha Whitlock <sasha@gearboxlabs.example>`, to: [`Nigel Okoro <nigel.okoro@paperkitedev.test>`],
  subj: `CI setup`,
  body: `Hi Nigel,

In the workflow file replace ghp_xxxx with your own personal access token, created in your settings. Don't commit it. The same goes for the test password in the example config: it's only password: ******** as a reminder to set your own.

Sasha` },

{ k: 'ev', ind: 'film festivals', v: 'ie', set: 'festival volunteers, banter', messy: ['banter'],
  why: `SPEC §5 intro: banter with a volunteer coordinator is ordinary business email.`,
  from: `Tadhg Moynihan <tadhg@harbourlightfilmfest.example>`, to: [`Sorcha Whelan <sorcha.whelan@corkvolunteers.test>`],
  subj: `Volunteers for opening night`,
  body: `Sorcha,

I need 12 volunteers for opening night: 6 on the door, 4 ushers and 2 with a stern face for the popcorn queue. Shifts are 5 to 11, with a free ticket for the late screening if they last the night.

Can you send me names by Friday? I'll owe you a pint.

Tadhg` },

{ k: 'bd', ind: 'recruitment', v: 'uk', set: 'National Insurance number requested without one given', bnd: 'an ID name mentioned with no number',
  why: `SPEC §5.3 Does not flag: the words alone without a number (National Insurance number requested, none given).`,
  from: `Chantelle Burrows <chantelle@steadfaststaffing.example>`, to: [`Marcus Bailey <marcus.bailey@lowtidemail.test>`],
  subj: `Starter paperwork`,
  body: `Hi Marcus,

Welcome aboard. For payroll we'll need your National Insurance number and your bank details on the starter form, which you can complete in the portal rather than by email. Please don't send them in a reply.

Chantelle` },

{ k: 'ev', ind: 'distilling', v: 'uk', set: 'craft distillery tasting', messy: [],
  why: `SPEC §5 intro: a craft distillery tasting is ordinary business email.`,
  from: `Isolde Carmichael <isolde@blackrookdistillery.example>`, to: [`Hamza Rahim <hamza.rahim@redkitewines.test>`],
  subj: `Tasting at the distillery`,
  body: `Hi Hamza,

Thursday at 3 is good. You'll taste the new gin, the rhubarb liqueur and a cask sample of the whisky we're laying down. Bring the buyer if she wants to come. We can do a short walk round the stills first.

Isolde` },

{ k: 'bd', ind: 'finance', v: 'uk', set: 'bank name and branch address only', bnd: 'a bank\'s name and address alone',
  why: `SPEC §5.2 Does not flag: a bank's name or address alone.`,
  from: `Gillian Pratt <gillian@pettigrewfinance.example>`, to: [`Anand Sethi <anand.sethi@oakmoorgroup.test>`],
  subj: `Our bank`,
  body: `Hi Anand,

For your supplier forms, our bank is Lakeland Credit Union, Market Square, Penrith branch. The sort code and account details will follow on the invoice itself.

Gillian` },

{ k: 'ev', ind: 'garden centre', v: 'uk', set: 'cafe supply at a garden centre', messy: [],
  why: `SPEC §5 intro: a garden centre cafe supply order is ordinary business email.`,
  from: `Joan Spillane <joan@thewalledgardencafe.example>`, to: [`Mohamed Siddiq <mohamed.siddiq@chalkhillbakery.test>`],
  subj: `Cakes for the weekend`,
  body: `Hi Mohamed,

Could we have 6 lemon drizzles, 4 coffee and walnut, and 3 carrot cakes by Friday morning, please? Two of the lemon ones sliced if you have the time. The half term rush starts Saturday.

Joan` },

{ k: 'bd', ind: 'professional services', v: 'uk', set: 'speaker swap for a meeting', bnd: 'an absence with no stated cause',
  why: `SPEC §5.4 Does not flag: an absence or schedule change without a stated cause (Dan is out Friday).`,
  from: `Odile Fournier <odile.fournier@westfieldpartners.example>`, to: [`Tobias Reed <tobias.reed@marshlandmail.test>`],
  subj: `Thursday's meeting`,
  body: `Hi Tobias,

Sunil won't be at Thursday's meeting, so Elena will present the findings instead. She has the slides and the full data set.

Odile` },

{ k: 'ev', ind: 'marine insurance', v: 'uk', set: 'insurance renewal with regulatory footer', messy: ['footer'],
  why: `SPEC §5.10 Does not flag: confidentiality footers addressed to the recipient; the rest is a renewal reminder.`,
  from: `Prudence Asher <prudence@seawardbrokers.example>`, to: [`Kenneth Moyo <kenneth.moyo@gullcovemarina.test>`],
  subj: `Marina policy renewal`,
  body: `Dear Kenneth,

Your marina policy renews on 1 December. I'll send the renewal terms next week, and I'd like a short call to check whether the pontoon extension needs adding.

Kind regards,
Prudence Asher
Seaward Brokers Limited is authorised and regulated by the Financial Conduct Authority. Registered in England. This email is confidential and intended solely for the addressee.` },

{ k: 'bd', ind: 'child health', v: 'uk', set: 'eye test for a child, message to the father', bnd: 'a child\'s health details written to the parent',
  why: `SPEC §5.4 Does not flag: a person's details written to the parent or guardian they concern.`,
  from: `Joy Ellwood <joy@brightsightopticians.example>`, to: [`Tunde Adeyemi <tunde.adeyemi@sandpiper-mail.test>`],
  subj: `Tola's eye test`,
  body: `Dear Mr Adeyemi,

Tola's eye test is booked for Tuesday at 4pm. Please bring her current glasses and let us know if she has had any headaches or trouble reading at school. The test takes about 30 minutes.

Joy Ellwood
Bright Sight Opticians` },
];
