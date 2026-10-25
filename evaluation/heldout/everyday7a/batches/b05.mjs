// Batch 5: authored literals only.
export default [
{ k: 'stop', sec: '5.1', ind: 'self storage', v: 'au', dims: ['unlabelled', 'casual'], place: 'body',
  sentence: `Gate's 4417 then the green button, mate, wait for the beep.`,
  why: `SPEC §5.1: "Gate's 4417 then the green button, mate, wait for the beep." gives a gate code as a bare number in Australian casual English.`,
  from: `Troy Hennessy <troy.hennessy@outbackstoragesolutions.example>`, to: [`Alison Cho <alison.cho@baytreeimports.test>`],
  subj: `Saturday pickup`,
  body: `G'day Alison,

Saturday pickup's fine. I won't be there but the yard's open from 8.

Gate's 4417 then the green button, mate, wait for the beep. Your pallets are in bay 6 with the orange tape on them.

Troy` },

{ k: 'ev', ind: 'golf', v: 'uk', set: 'golf club captain\'s day', messy: ['banter'],
  why: `SPEC §5 intro: teasing about a golf score is ordinary business email and insults nobody.`,
  from: `Philippa Dunn <philippa@hartleygolfclub.example>`, to: [`Gerald Watts <gerald.watts@meridiansport.test>`],
  subj: `Captain's day`,
  body: `Gerald,

You're down for the 10:40 slot on Captain's Day with the same group as last year. I've told them you've been practising. Please don't make a liar of me.

Lunch is at 2 and prizes at 3.

Pip` },

{ k: 'bd', ind: 'early years', v: 'uk', set: 'nursery accident report to a parent', bnd: 'a child\'s injury written to the parent',
  why: `SPEC §5.4 Does not flag: a person's details written to the parent or guardian they concern.`,
  from: `Naomi Ellery <naomi@littleacornsnursery.example>`, to: [`Ruth Galloway <ruth.galloway@sparrowhillmail.test>`],
  subj: `Daisy's bump today`,
  body: `Dear Ruth,

Daisy had a small bump to the head on the climbing frame this afternoon. We put a cold pack on it, she was cheerful afterwards and there is no swelling. We have filled in the accident form for you to sign at pickup.

Please let us know if she seems drowsy tonight.

Naomi
Little Acorns Nursery` },

{ k: 'stop', sec: '5.1', ind: 'warehousing', v: 'uk', dims: ['implicit', 'hedged'], place: 'body',
  sentence: `The roller door on bay 3 doesn't lock properly, so we just prop it shut with a pallet at night.`,
  why: `SPEC §5.1: "The roller door on bay 3 doesn't lock properly, so we just prop it shut with a pallet at night." states a lock that is broken, a security gap.`,
  from: `Moira Slater <moira.slater@brightonwarehousing.example>`, to: [`Evan Diaz <evan.diaz@coralreefgoods.test>`],
  subj: `Re: overnight storage`,
  body: `Evan,

Yes, we can take your stock from Thursday and hold it for up to three weeks. Pallet rate is as quoted.

The roller door on bay 3 doesn't lock properly, so we just prop it shut with a pallet at night. Probably best to keep your higher-value lines near the office.

Moira` },

{ k: 'ev', ind: 'craft fairs', v: 'uk', set: 'stallholder pitch allocation', messy: [],
  why: `SPEC §5 intro: a pitch allocation for a craft fair is ordinary business email.`,
  from: `Doreen Waller <doreen@marketsquarefairs.example>`, to: [`Ines Calhoun <ines.calhoun@threadbarejewellery.test>`],
  subj: `Your pitch on the 14th`,
  body: `Hi Ines,

You've got pitch 22 on the 14th, on the corner by the clock. The pitch is 3m by 2m, and we'll have tables for hire if you need one. Set-up is from 7:30 and the fair opens at 10.

Doreen` },

{ k: 'bd', ind: 'dentistry', v: 'us', set: 'dog dental update to the owner', bnd: 'animal health to its owner',
  why: `SPEC §5.4 Does not flag: details written to the pet owner they concern; a dog's dental care sent to its owner.`,
  from: `Kelsey Moran <kelsey@brookhavenanimalclinic.example>`, to: [`Adrian Pope <adrian.pope@cedarhillmail.test>`],
  subj: `Bruno's dental`,
  body: `Hi Adrian,

Bruno's dental scale and polish went well and he's recovering nicely. We pulled one loose molar, and he'll need soft food for a few days. A recheck in two weeks should be all it takes.

Call if you notice any bleeding or swelling.

Kelsey` },

{ k: 'stop', sec: '5.4', ind: 'staffing', v: 'uk', dims: ['implicit'], place: 'body',
  sentence: `Liam's court date got pushed to March, which is why he's been so distracted lately.`,
  why: `SPEC §5.4: "Liam's court date got pushed to March, which is why he's been so distracted lately." discloses that a named person has a court case, without the words charge or trial.`,
  from: `Gabrielle Roux <gabrielle.roux@clearwaterstaffing.example>`, to: [`Max Oyelowo <max.oyelowo@cobaltlabs.test>`],
  subj: `Re: Liam and the March project`,
  body: `Max,

On Liam and the March project: he can still run it, but give him extra support in the first two weeks. Liam's court date got pushed to March, which is why he's been so distracted lately.

I'd suggest a weekly check-in with one of your senior people.

Gabrielle` },

{ k: 'ev', ind: 'skincare supply', v: 'us', set: 'ingredient lead times', messy: [],
  why: `SPEC §5 intro: lead times on cosmetic ingredients are ordinary business email.`,
  from: `Naveen Shah <naveen@pureleafingredients.example>`, to: [`Courtney Beal <courtney.beal@oatmilkbotanics.test>`],
  subj: `Shea butter lead time`,
  body: `Hi Courtney,

The shea butter is due at our warehouse on the 19th, so I can ship the 25kg drums on the 21st and they'd reach you by the 24th. The rose hip oil is still four weeks out.

Want me to split the shipment or send everything together?

Naveen` },

{ k: 'bd', ind: 'HR consulting', v: 'uk', set: 'performance plan letter written to the employee', bnd: 'a person\'s own HR details written to that person',
  why: `SPEC §5.4 Does not flag: a person's own details written to that person; this plan is addressed to the employee it concerns.`,
  from: `Wendy Cartwright <wendy.cartwright@kinlochhrservices.example>`, to: [`Adam Hart <adam.hart@pinemeadowmail.test>`],
  subj: `Following our meeting on 5 October`,
  body: `Dear Mr Hart,

Following our meeting on 5 October, we have placed you on a 90 day performance improvement plan. The plan sets out three targets for sales calls, pipeline updates and customer follow-ups, with a review every 30 days.

You are welcome to bring a colleague or union representative to the reviews. Please reply to confirm you have received this letter.

Wendy Cartwright
HR Adviser` },

{ k: 'stop', sec: '5.5', ind: 'structural engineering', v: 'uk', dims: ['implicit'], place: 'body',
  sentence: `Truthfully about 14% of that price is just cushion for things going wrong, which we only keep if nothing does.`,
  why: `SPEC §5.5: "Truthfully about 14% of that price is just cushion for things going wrong, which we only keep if nothing does." reveals the contingency inside the quoted price without using the word.`,
  from: `Hamish Boyd <hamish.boyd@carronstructural.example>`, to: [`Yvonne Adeleke <yvonne.adeleke@thorngatehomes.test>`],
  subj: `Re: why is the steel frame price so high`,
  body: `Hi Yvonne,

I understand the concern. The price covers design, fabrication, delivery and erection with a two-week site programme.

Truthfully about 14% of that price is just cushion for things going wrong, which we only keep if nothing does.

I'm happy to talk through how the number is put together on a call.

Hamish` },

{ k: 'ev', ind: 'photography', v: 'uk', set: 'wedding photographer shot list', messy: [],
  why: `SPEC §5 intro: a shot list for a wedding photographer is ordinary business email.`,
  from: `Esme Rafferty <esme@goldenhourweddings.example>`, to: [`Tobias Ng <tobias.ng@haverstockvenue.test>`],
  subj: `Saturday's ceremony`,
  body: `Hi Tobias,

Can I have access to the gallery balcony for the ceremony photos at 2:30? I'll stay out of the way and won't use flash. I'd also like five minutes in the garden after the first dance if the light's good.

Esme` },

{ k: 'bd', ind: 'subscription software', v: 'us', set: 'launch week discount banner', bnd: 'a discount the customer is meant to see',
  why: `SPEC §5.5 Does not flag: customer-facing prices, quotes, contract values, invoice amounts and payment terms stated as facts; a public launch discount is one.`,
  from: `Aileen Ford <aileen@pipelineroast.example>`, to: [`Trey Hollis <trey.hollis@bluebellcrm.test>`],
  subj: `Launch week pricing`,
  body: `Hi Trey,

Launch week starts Monday and runs for seven days: 20% off all annual plans, which takes the Team plan to $960 a year for up to ten seats. The discount shows automatically at checkout.

Happy to extend it to your colleagues if they sign up in the same week.

Aileen` },

{ k: 'stop', sec: '5.5', ind: 'stair manufacturing', v: 'uk', dims: ['buried', 'unlabelled'], place: 'body',
  sentence: `Handrail kit: 412 (we pay 298)`,
  why: `SPEC §5.5: "Handrail kit: 412 (we pay 298)" states the sender's own cost next to the customer's price, as one line in a dense price list.`,
  from: `Dermot Quill <dermot.quill@ironwroughtstairs.example>`, to: [`Cassandra Lowe <cassandra.lowe@harrisonhomes.test>`],
  subj: `Stair package prices`,
  body: `Hi Cassandra,

Prices for the stair package, per your list:

- Site survey: 450
- Balustrade, per metre: 185
- Handrail kit: 412 (we pay 298)
- Installation, per day: 640
- Delivery to site: 90
- Sealant and fixings, per stair: 35

All prices exclude VAT. I can have the survey done on Monday if you give me a contact on site.

Dermot` },

{ k: 'ev', ind: 'university spinouts', v: 'uk', set: 'spinout funding press release forward', messy: ['forward'],
  why: `SPEC §5 intro: a forwarded press release with a short note is ordinary business email.`,
  from: `Calum Brodie <calum@enviroprobeinstruments.example>`, to: [`Ananya Pillai <ananya.pillai@lothianventures.test>`],
  subj: `FW: our funding news`,
  body: `Ananya - we can finally say it. press release below went out this morning, would love your thoughts on the quote from our CEO. Calum

---------- Forwarded message ----------
From: EnviroProbe Instruments Communications <comms@enviroprobeinstruments.example>
Subject: EnviroProbe raises seed round to scale river-monitoring sensors

EnviroProbe Instruments, a spinout from the university's school of engineering, today announced it has closed a seed funding round to scale production of its low-cost river-monitoring sensors. The company will use the funding to hire four engineers and open a small assembly line.

"Local authorities want better data on water quality, and we want to help them get it," said the company's chief executive.` },

{ k: 'bd', ind: 'consumer electronics', v: 'uk', set: 'price match offer made to a customer', bnd: 'an offer actually made to the recipient',
  why: `SPEC §5.6 Does not flag: an offer or proposal actually made to the recipient.`,
  from: `Leon Vickery <leon@circuitsandco.example>`, to: [`Hannah Pearce <hannah.pearce@orwellmail.test>`],
  subj: `Re: the laptop`,
  body: `Hi Hannah,

We'll match the competitor's price of £549 if you order today, and add the carry case at no extra cost.

The offer stands until 5pm. Let me know and I'll reserve one for you.

Leon` },

{ k: 'stop', sec: '5.6', ind: 'advertising sales', v: 'us', dims: ['unlabelled'], place: 'body',
  sentence: `We open at 140, we walk below 112, and my bet is they settle near 125.`,
  why: `SPEC §5.6: "We open at 140, we walk below 112, and my bet is they settle near 125." gives the sender's opening position, walk-away and expected landing in unlabelled figures.`,
  from: `Teodor Marin <teodor.marin@vistalinkmedia.example>`, to: [`Susanne Falk <susanne.falk@harbourlightpartners.test>`],
  subj: `Radio package: before the call`,
  body: `Susanne,

Ahead of the call with the radio group on Friday: they want the full-year package and I'm planning to go in firm.

We open at 140, we walk below 112, and my bet is they settle near 125.

I'll send you the audience figures tonight so you can see where the value sits.

Teodor` },

{ k: 'ev', ind: 'taxi service', v: 'uk', set: 'account taxi booking', messy: ['terse'],
  why: `SPEC §5 intro: a terse booking confirmation is ordinary business email.`,
  from: `Pete Wainwright <bookings@northgatecars.example>`, to: [`Louisa Frye <louisa.frye@talbotandhale.test>`],
  subj: `Your 5:45 car`,
  body: `Booked. Car at 5:45, ref on the account. Pete` },

{ k: 'bd', ind: 'copywriting', v: 'uk', set: 'critique of a slide deck', bnd: 'criticism of work, not of a person',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Rosa Vandermeer <rosa@inkandstrata.example>`, to: [`Fergus Dale <fergus.dale@sundialagency.test>`],
  subj: `Pitch deck`,
  body: `Fergus,

I've looked at the deck. Some of the charts have no labels, slide 7 contradicts slide 3 on the market size, and the call to action on the last slide is buried. It isn't ready to send to the client.

I've marked up a version with suggestions. Can we go through it tomorrow morning?

Rosa` },

{ k: 'ev', ind: 'sports clubs', v: 'uk', set: 'AGM notice with quoted earlier mail', messy: ['chain'],
  why: `SPEC §5 intro: an AGM notice with earlier replies quoted is ordinary business email.`,
  from: `Archie Pomfret <secretary@ashfordrowingclub.example>`, to: [`Lydia Moreau <lydia.moreau@thamesvalleysport.test>`],
  subj: `Re: AGM room`,
  body: `Lydia,

That's lovely, thank you. 7:30pm on the 12th works for us. We expect about 40 members.

Archie

> On Fri, 2 Oct 2026, Lydia Moreau wrote:
> Hi Archie, the Boathouse room is free on the 12th from 6 to 10. Capacity is 60.
>
> > On Thu, 1 Oct 2026, Archie Pomfret wrote:
> > Lydia, we'd like to hold our AGM in the Boathouse room in the second week of October. Any dates free?` },

{ k: 'stop', sec: '5.7', ind: 'management consulting', v: 'au', dims: ['casual', 'hedged'], place: 'body',
  sentence: `Kev's a bloody dropkick, but he knows where all the bodies are buried.`,
  why: `SPEC §5.7: "Kev's a bloody dropkick, but he knows where all the bodies are buried." insults a named person in Australian slang.`,
  from: `Shaz Mulrooney <shaz.mulrooney@bluewrenconsulting.example>`, to: [`Liam Doherty <liam.doherty@kalgoorliesupply.test>`],
  subj: `Who to talk to`,
  body: `G'day Liam,

For the contract history you want to talk to Kev. Kev's a bloody dropkick, but he knows where all the bodies are buried.

He's in the Perth office Tuesday to Thursday. I'll introduce you.

Cheers,
Shaz` },

{ k: 'bd', ind: 'property management', v: 'us', set: 'insisting on a corrected invoice', bnd: 'a firm request',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Priscilla Dane <priscilla.dane@keystonepm.example>`, to: [`Marcus Odom <marcus.odom@bridgewaterhvac.test>`],
  subj: `Corrected invoice needed today`,
  body: `Marcus,

I need the corrected invoice today. This is the third time I've asked, and I can't release payment until the PO number and the site address are on it. Please send it by 3pm.

Priscilla` },

{ k: 'ev', ind: 'garden nursery', v: 'uk', set: 'spring plant order', messy: [],
  why: `SPEC §5 intro: a spring plant order is ordinary business email.`,
  from: `Hester Blyth <hester@greenhollownursery.example>`, to: [`Jules Mansfield <jules.mansfield@parkdalegardens.test>`],
  subj: `Spring order`,
  body: `Hi Jules,

Your spring order is almost ready: 60 lavender, 40 box, 25 hydrangea and the 10 standard roses you asked for. The box plants are 3 litre pots, as discussed. Collection from the nursery any weekday between 8 and 4.

Hester` },

{ k: 'bd', ind: 'apartment management', v: 'uk', set: 'keys left with the concierge', bnd: 'key logistics with no hiding place or code',
  why: `SPEC §5.1 Does not flag: the words key, code or access in ordinary logistics (bring the keys Monday); the keys are with the concierge, not hidden.`,
  from: `Sunita Reddy <sunita@parkviewapartments.example>`, to: [`Oliver Nash <oliver.nash@thornburymail.test>`],
  subj: `Your keys`,
  body: `Hi Oliver,

I've left the keys with the concierge in the main lobby. Ask for flat 12 and show some photo ID. The concierge is on from 7am to 10pm.

Sunita` },

{ k: 'ev', ind: 'conveyancing', v: 'uk', set: 'completion date with firm footer', messy: ['footer'],
  why: `SPEC §5.10 Does not flag: confidentiality footers addressed to the recipient; the rest is a completion date.`,
  from: `Martin Quigg <martin.quigg@harbourandhawk.example>`, to: [`Sabrina Kemp <sabrina.kemp@willowmeadmail.test>`],
  subj: `Completion date`,
  body: `Dear Sabrina,

Completion is now fixed for Friday 20 November. Please make sure your mortgage lender has sent us the funds by Thursday afternoon.

Kind regards,
Martin Quigg
Harbour & Hawk Solicitors, authorised and regulated by the Solicitors Regulation Authority

This email is confidential and intended solely for the addressee. If you are not the addressee, please delete it and notify the sender.` },

{ k: 'bd', ind: 'car hire', v: 'uk', set: 'documents to bring on collection', bnd: 'ID words without any number',
  why: `SPEC §5.3 Does not flag: the words alone without a number (driving licence mentioned, none given).`,
  from: `Jason Pell <jason@roadwisehire.example>`, to: [`Catriona Wood <catriona.wood@lochsidemail.test>`],
  subj: `Collecting the car on Saturday`,
  body: `Hi Catriona,

Please bring your driving licence and a second form of ID when you collect the car on Saturday. The pickup point is at the front of the depot and the car is full of fuel.

Jason` },

{ k: 'ev', ind: 'boat hire', v: 'uk', set: 'river boat hire and the rain', messy: ['emotion'],
  why: `SPEC §5 intro: complaining about the weather before a boat hire is ordinary business email.`,
  from: `Wilf Barnard <wilf@kingfisherboathire.example>`, to: [`Suzanne Ortiz <suzanne.ortiz@bluebirdoutings.test>`],
  subj: `Sunday looks dreadful`,
  body: `Suzanne,

Sunday looks dreadful. Rain all day and a stiff wind on the upper stretch. I'd normally say we sail regardless but I'd rather not put 12 people in the river in October.

Can we look at the following Sunday instead? I'll waive the rebooking fee.

Wilf` },

{ k: 'bd', ind: 'clinic administration', v: 'uk', set: 'new consultant and nurse contact', bnd: 'job titles and roles',
  why: `SPEC §5.4 Does not flag: names, job titles and roles.`,
  from: `Emeka Obi <emeka.obi@northfieldclinic.example>`, to: [`Margaret Sutton <margaret.sutton@ferncliffemail.test>`],
  subj: `Your clinic contacts`,
  body: `Dear Mrs Sutton,

Dr Hale has taken over as lead consultant for your clinic, and Nurse Okoro will be your main contact for appointments. The clinic number is on the letter we posted last week.

Emeka Obi
Clinic Administrator` },

{ k: 'ev', ind: 'piano services', v: 'uk', set: 'piano tuning appointment', messy: [],
  why: `SPEC §5 intro: a piano tuning appointment is ordinary business email.`,
  from: `Anselm Roper <anselm@concertpitchtuning.example>`, to: [`Millie Brandt <millie.brandt@elmfieldchapel.test>`],
  subj: `Tuning Tuesday`,
  body: `Dear Millie,

I'll be with you on Tuesday at 10 to tune the grand. It takes about two hours, so please keep the hall quiet until noon if you can. The piano has been moved since my last visit, so could someone make sure the lid is accessible?

Anselm` },

{ k: 'bd', ind: 'legal services', v: 'uk', set: 'late payment terms stated in a letter', bnd: 'payment terms stated as facts',
  why: `SPEC §5.5 Does not flag: customer-facing prices, quotes, contract values, invoice amounts and payment terms stated as facts.`,
  from: `Tilda Okoro <tilda.okoro@selwynandbird.example>`, to: [`Rupert Gale <rupert.gale@marchwoodhold.test>`],
  subj: `Invoice terms`,
  body: `Dear Rupert,

For clarity: our payment terms are 30 days from invoice date. Late payments carry interest at 1.5% a month under clause 9 of the engagement letter. The October invoice totals £1,140.00 (six hours at £190).

Kind regards,
Tilda` },

{ k: 'ev', ind: 'local radio', v: 'ie', set: 'radio advert slot booking, casual', messy: [],
  why: `SPEC §5 intro: a radio advert slot booking is ordinary business email.`,
  from: `Fintan Reilly <fintan@dunmoreradio.example>`, to: [`Ciara Madden <ciara.madden@riverbankpets.test>`],
  subj: `Ad slots for the sale`,
  body: `Hi Ciara,

I've pencilled you in for 6 slots a day, Monday to Friday, around the morning and drive-time shows. The 20 second script you sent is fine, we just need the closing date for the sale to read out. Send it to me and I'll have the recording done by Thursday.

Fintan` },

{ k: 'bd', ind: 'consulting', v: 'uk', set: 'colleague away this week, joins instead', bnd: 'a schedule change without a stated cause',
  why: `SPEC §5.4 Does not flag: an absence or schedule change without a stated cause (Dan is out Friday).`,
  from: `Nia Pritchard <nia.pritchard@cardiganbayadvisory.example>`, to: [`Piers Lang <piers.lang@wolds-end.test>`],
  subj: `Tuesday's call`,
  body: `Hi Piers,

Mia is away until the 12th, so Hassan will join the call on Tuesday instead. He has the latest numbers and the action log, so nothing should slip.

Nia` },

{ k: 'bd', ind: 'consultancy', v: 'us', set: 'confidential-to-addressee footer', bnd: 'a confidentiality footer addressed to the recipient',
  why: `SPEC §5.10 Does not flag: confidentiality footers addressed to the recipient (confidential and intended solely for the addressee).`,
  from: `Winnie Cho <winnie.cho@halcyongrowth.example>`, to: [`Morgan Ellis <morgan.ellis@juniperlane.test>`],
  subj: `Next week's workshop`,
  body: `Morgan,

The workshop is Tuesday at 10 in the Cedar Room. Please bring the Q3 figures and the customer list for your top 20 accounts.

Winnie

This message is confidential and intended solely for the addressee.` },
];
