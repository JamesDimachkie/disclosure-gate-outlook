// Batch 7: authored literals only.
export default [
{ k: 'stop', sec: '5.1', ind: 'studio hire', v: 'uk', dims: ['unlabelled', 'casual'], place: 'body',
  sentence: `Side door, then 1993 on the pad, you've got 30 seconds.`,
  why: `SPEC §5.1: "Side door, then 1993 on the pad, you've got 30 seconds." gives an alarm code as an unlabelled number in casual shorthand.`,
  from: `Gethin Pugh <gethin.pugh@cwmbranstudios.example>`, to: [`Alys Morgan <alys.morgan@sweetpeacatering.test>`],
  subj: `Friday setup`,
  body: `Alys,

Nobody's in till 10 on Friday so you'll let yourselves in. Side door, then 1993 on the pad, you've got 30 seconds.

Kitchen's through the back, trolleys in the corridor. Lock up behind you.

Gethin` },

{ k: 'ev', ind: 'ceramics', v: 'uk', set: 'kiln firing slots', messy: [],
  why: `SPEC §5 intro: kiln firing slots for a ceramics studio are ordinary business email.`,
  from: `Verity Ashcroft <verity@claywhistlestudio.example>`, to: [`Ottoline Ramsay <ottoline.ramsay@fenwickschool.test>`],
  subj: `Kiln slots`,
  body: `Hi Ottoline,

I can fire your students' pieces in the Thursday bisque and the following Tuesday glaze. Bring the pieces in on Wednesday, wrapped and labelled. Each firing takes about 12 hours plus cooling, so pickup is the day after.

Verity` },

{ k: 'bd', ind: 'manufacturing', v: 'uk', set: 'supplier dispute stated as a business matter', bnd: 'a company\'s own legal matter stated as business',
  why: `SPEC §5.4 Does not flag: a company's own legal matters stated as business (our contract with them).`,
  from: `Ronan Tierney <ronan.tierney@hallmarkcomponents.example>`, to: [`Heidi Brandt <heidi.brandt@steinfeldlogistics.test>`],
  subj: `Supplier contract update`,
  body: `Heidi,

For your planning: we are in dispute with our resin supplier over the late deliveries, and our solicitors are drafting a letter before action under the contract. I'll copy you when it goes out. It doesn't change your order or your delivery dates.

Ronan` },

{ k: 'ev', ind: 'canal boat services', v: 'uk', set: 'narrowboat repair quote, typed fast', messy: [],
  why: `SPEC §5 intro: a quick note about a boat repair is ordinary business email.`,
  from: `Barry Kettleby <barry@kettlebymarine.example>`, to: [`Judith Nolan <judith.nolan@slowwaterhire.test>`],
  subj: `boat repairs`,
  body: `hi judith, had a look at the stern gland and the swim, will need a week out of the water. i can slot you in from the 2nd if you can get her to the dock by the weekend. let me know asap cos the 2nd is going fast. barry` },

{ k: 'bd', ind: 'catering', v: 'uk', set: 'group rate quoted to the client', bnd: 'a customer-facing price stated as a fact',
  why: `SPEC §5.5 Does not flag: customer-facing prices, quotes, contract values, invoice amounts and payment terms stated as facts.`,
  from: `Jocelyn Strand <jocelyn@wildthymecatering.example>`, to: [`Matteo Rossi <matteo.rossi@thorngateoffice.test>`],
  subj: `Team lunch quote`,
  body: `Hi Matteo,

The group rate for 12 people is £34 per head including a two-course lunch, soft drinks and coffee. Staff and setup are included. If you want wine we can add a bottle per table at £22.

Just let me know the date.

Jocelyn` },

{ k: 'stop', sec: '5.4', ind: 'consulting', v: 'uk', dims: ['hedged'], place: 'subject',
  sentence: `Kofi can't make Wednesday: his mum starts chemo today`,
  why: `SPEC §5.4: "Kofi can't make Wednesday: his mum starts chemo today" names a colleague's family illness in the subject line of a routine reschedule.`,
  from: `Annabel Cross <annabel.cross@bellwetheradvisory.example>`, to: [`Lorna Fitzgerald <lorna.fitzgerald@oakmeadowtrust.test>`],
  subj: `Kofi can't make Wednesday: his mum starts chemo today`,
  body: `Hi Lorna,

Could Sam take Kofi's slot on Wednesday's workshop? Same agenda, same materials, and Sam has run it before. Kofi will catch up on the notes afterwards.

Thanks,
Annabel` },

{ k: 'ev', ind: 'organic produce', v: 'uk', set: 'veg box change', messy: ['terse'],
  why: `SPEC §5 intro: a veg box change is ordinary business email.`,
  from: `Tess Arkwright <tess@oakbarnboxes.example>`, to: [`Giles Haddon <giles.haddon@riversidehouse.test>`],
  subj: `Re: this week's box`,
  body: `No beetroot this week, swapped for extra carrots. Same price. Tess` },

{ k: 'bd', ind: 'veterinary', v: 'uk', set: 'tortoise weight to the owner', bnd: 'animal health to its owner',
  why: `SPEC §5.4 Does not flag: details written to the pet owner they concern; a tortoise's health sent to its owner.`,
  from: `Rhiannon Bevan <rhiannon@wetherbyexoticvets.example>`, to: [`Samir Kapoor <samir.kapoor@copperbeechmail.test>`],
  subj: `Aldo's weight check`,
  body: `Hi Samir,

Aldo's weight before hibernation is right where we want it, and his shell and eyes look healthy. I'd keep him in the cool room as planned and weigh him once a month. If he drops more than a few grams, call us.

Rhiannon` },

{ k: 'stop', sec: '5.6', ind: 'enterprise software', v: 'us', dims: ['implicit'], place: 'body',
  sentence: `If they come back on the payment terms I'll go to net 60 without a fight.`,
  why: `SPEC §5.6: "If they come back on the payment terms I'll go to net 60 without a fight." says what the sender would concede on terms, without any price.`,
  from: `Whit Sanderson <whit@lanternsoft.example>`, to: [`Rebekah Torres <rebekah.torres@prairielinepartners.test>`],
  subj: `Re: the Meridian renewal`,
  body: `Rebekah,

Thanks for the context on Meridian's procurement. I'm sending our renewal draft tomorrow morning and will copy you.

If they come back on the payment terms I'll go to net 60 without a fight.

Talk Thursday?

Whit` },

{ k: 'ev', ind: 'property marketing', v: 'uk', set: 'agency press release forward', messy: ['forward'],
  why: `SPEC §5 intro: a forwarded public press release with a short note is ordinary business email.`,
  from: `Clementine Rudd <clementine@homewardpr.example>`, to: [`Basil Eze <basil.eze@kinghamlets.test>`],
  subj: `FW: Kingham Gardens launch`,
  body: `Basil - release below for Friday. Tell me if you want the quote from the architect softened. C

---------- Forwarded message ----------
From: Homeward PR <press@homewardpr.example>
Subject: Kingham Gardens opens to first buyers

Kingham Gardens, a development of 42 homes on the former brickworks site, opens to first buyers on Saturday 17 October. The scheme includes a shared orchard, EV charging for every home, and a community room.

Show homes are open from 10 to 4 each weekend. Homes are priced from £285,000.` },

{ k: 'bd', ind: 'delivery', v: 'uk', set: 'parcel tracking reference', bnd: 'a tracking number',
  why: `SPEC §5.1 Does not flag: tracking numbers, order numbers, reference numbers.`,
  from: `Debbie Lunn <debbie@swiftparcelcentre.example>`, to: [`Nigel Oyelaran <nigel.oyelaran@meadowrisemail.test>`],
  subj: `Parcel on its way`,
  body: `Hi Nigel,

Your parcel is on its way. Tracking number TRK-9921-UK, due Wednesday between 10 and 2. The driver will ring from the road if he can't find you.

Debbie` },

{ k: 'ev', ind: 'live sound', v: 'uk', set: 'gig sound hire banter', messy: ['banter'],
  why: `SPEC §5 intro: banter about a band's soundcheck is ordinary business email.`,
  from: `Moses Goldberg <moses@bigearshire.example>`, to: [`Annie Burrows <annie.burrows@nightowlpromotions.test>`],
  subj: `Saturday's rig`,
  body: `Annie,

The rig for Saturday: 2 tops, 4 monitors, a desk and enough cable to reach Wales. Load in at 3, soundcheck at 5 (unless the drummer's late, in which case soundcheck is "whenever").

Do I need to bring a stage plot or is it the usual?

Moses` },

{ k: 'stop', sec: '5.7', ind: 'sales', v: 'us', dims: ['hedged'], place: 'body',
  sentence: `She's lovely but honestly Marguerite couldn't sell water in a desert.`,
  why: `SPEC §5.7: "She's lovely but honestly Marguerite couldn't sell water in a desert." disparages a named person's ability, softened by a compliment.`,
  from: `Randall Pierce <randall.pierce@summitpeakpartners.example>`, to: [`Tabitha Okoro <tabitha.okoro@northbridgelearning.test>`],
  subj: `Re: account manager for your region`,
  body: `Tabitha,

Thanks for asking about Marguerite for the account manager role. She's lovely but honestly Marguerite couldn't sell water in a desert.

I'd look at Kwabena instead, he's closed three of our biggest deals.

Randall` },

{ k: 'bd', ind: 'software', v: 'us', set: 'thin tests and a failing build', bnd: 'criticism of work, not of a person',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Priyanka Reddy <priyanka@wavefrontlabs.example>`, to: [`Ethan Cole <ethan.cole@sundrysoftware.test>`],
  subj: `Release candidate`,
  body: `Ethan,

I'm not comfortable shipping the release candidate. The test coverage is too thin around the payment path, and the build has failed on main three times this week. It isn't ready.

Can we hold it until Thursday and see whether the new tests land?

Priyanka` },

{ k: 'ev', ind: 'bookkeeping', v: 'uk', set: 'payroll deadline reminder with long footer', messy: ['footer'],
  why: `SPEC §5.10 Does not flag: confidentiality footers addressed to the recipient; the rest is a payroll deadline reminder.`,
  from: `Morwenna Pascoe <morwenna@tidalbookkeeping.example>`, to: [`Hugo Brennan <hugo.brennan@seagrassgifts.test>`],
  subj: `Payroll cut-off`,
  body: `Hi Hugo,

A reminder that the payroll cut-off for this month is Thursday at noon. Please send me any changes to hours before then.

Best,
Morwenna Pascoe
Tidal Bookkeeping Ltd
Registered in England and Wales. Authorised for anti-money laundering supervision. Please consider the environment before printing this email.

This message is confidential and may be privileged. It is intended solely for the addressee. If you are not the addressee, please delete it and let us know.` },

{ k: 'bd', ind: 'building services', v: 'uk', set: 'price held for sixty days', bnd: 'an offer actually made to the recipient',
  why: `SPEC §5.6 Does not flag: an offer or proposal actually made to the recipient.`,
  from: `Roderick Hume <roderick@humeheatingservices.example>`, to: [`Isobel Fraser <isobel.fraser@glenorchymail.test>`],
  subj: `Boiler quote`,
  body: `Hi Isobel,

We'll hold the quoted price of £3,850 for 60 days if you sign this week, and we'll include the new thermostat at no extra charge. After that the price may change with our supplier's list.

Roderick` },

{ k: 'ev', ind: 'property consulting', v: 'uk', set: 'planning consultant thread with Original Message', messy: ['chain'],
  why: `SPEC §5 intro: a planning reply with earlier messages beneath is ordinary business email.`,
  from: `Linus Haverford <linus@haverfordplanning.example>`, to: [`Rosalind Brook <rosalind.brook@oldtanneryestates.test>`],
  subj: `RE: Pre-app meeting`,
  body: `Rosalind, the council has offered the 22nd at 10. I've accepted. Your architect should attend if possible.

Linus

-----Original Message-----
From: Rosalind Brook
Sent: Thursday, 1 October 2026 14:12
To: Linus Haverford
Subject: Pre-app meeting

Linus, shall we ask the council for the pre-application meeting? Mid to late October would suit us.

Rosalind` },

{ k: 'bd', ind: 'accounts', v: 'uk', set: 'balance due and date', bnd: 'invoice amounts and payment terms stated as facts',
  why: `SPEC §5.5 Does not flag: customer-facing prices, quotes, contract values, invoice amounts and payment terms stated as facts.`,
  from: `Esther Nwosu <accounts@lakelandjoinery.example>`, to: [`Piers Dunmore <piers.dunmore@harelandmail.test>`],
  subj: `Balance due`,
  body: `Dear Piers,

The balance due on the oak staircase is £1,860, payable by 30 November. Bank details are on the invoice. Thank you again for choosing us.

Esther` },

{ k: 'ev', ind: 'flight training', v: 'uk', set: 'flying lesson cancelled for cloud', messy: ['emotion'],
  why: `SPEC §5 intro: frustration about weather cancelling a lesson is ordinary business email.`,
  from: `Captain Hal Sorenson <hal@bluehorizonflying.example>`, to: [`Daisy Okafor <daisy.okafor@fenlandmail.test>`],
  subj: `Saturday's lesson`,
  body: `Daisy,

Cloud base is sitting at 400 feet and not going anywhere, so Saturday is a no-go. I know, I know. You were so close to your next solo. I'm as annoyed as you are, believe me.

I've got Sunday morning free if the forecast improves. Fingers crossed.

Hal` },

{ k: 'bd', ind: 'software', v: 'uk', set: 'meeting minutes disagreement', bnd: 'blunt disagreement over what was agreed',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Elspeth Moreau <elspeth@tallowhillsoft.example>`, to: [`Gabriel Ortiz <gabriel.ortiz@pennywhistleit.test>`],
  subj: `Minutes: 1 October`,
  body: `Gabriel,

That's not what we agreed. The minutes say the go-live is Thursday, not Friday, and I've checked the recording. Please correct the minutes, because the contract dates run from them.

Elspeth` },

{ k: 'ev', ind: 'vintage cars', v: 'uk', set: 'classic car parts order', messy: [],
  why: `SPEC §5 intro: a classic car parts order is ordinary business email.`,
  from: `Cedric Platt <cedric@oldironmotors.example>`, to: [`Mavis Greenhalgh <mavis.greenhalgh@silverstreakspares.test>`],
  subj: `Parts for the Riley`,
  body: `Dear Mavis,

Could you send two sets of front brake shoes and the rubber gaiters for the 1938 Riley? I need them before the show on the 31st, so tell me if the gaiters have to come from Germany. I'll pay by bank transfer as usual.

Cedric` },

{ k: 'bd', ind: 'serviced offices', v: 'uk', set: 'office entrance round the back', bnd: 'a public location, no code',
  why: `SPEC §5.1 Does not flag: the words key, code or access in ordinary logistics (the site access is off Main Street).`,
  from: `Nell Carrow <nell@millstreetoffices.example>`, to: [`Anwar Haque <anwar.haque@brightwatermail.test>`],
  subj: `Finding us`,
  body: `Hi Anwar,

We're at 14 Mill Street, second floor. The entrance is round the back by the car park; look for the green door with the brass plate. Reception is on the second floor and someone will buzz you up.

Nell` },

{ k: 'ev', ind: 'language teaching', v: 'other', set: 'language school timetable', messy: [],
  why: `SPEC §5 intro: a language school timetable is ordinary business email.`,
  from: `Pilar Gutierrez <pilar@casadelidioma.example>`, to: [`Henrik Larsen <henrik.larsen@fjordlinemail.test>`],
  subj: `Timetable for the corporate course`,
  body: `Dear Henrik,

The Spanish course for your staff will run on Tuesdays and Thursdays from 5:30 to 7, beginning on the 3rd of November, at your offices. There are 8 students at level A2. The course book is included in the price. Please confirm the room.

Best regards,
Pilar` },

{ k: 'bd', ind: 'gifts', v: 'us', set: 'gift voucher code mentioned, none given', bnd: 'a code mentioned with no value given',
  why: `SPEC §5.1 Does not flag: discount or promo codes and talk about codes with no code given.`,
  from: `Winona Bell <winona@kindlingandcogifts.example>`, to: [`Marcus Heller <marcus.heller@harborlightmail.test>`],
  subj: `Your gift voucher`,
  body: `Hi Marcus,

Your gift voucher is in the post. The redemption code is printed on the card inside the envelope, so you won't see it in this email. It's valid for 12 months.

Winona` },

{ k: 'ev', ind: 'airport transfers', v: 'uk', set: 'airport shuttle booking', messy: ['terse'],
  why: `SPEC §5 intro: a clipped airport transfer confirmation is ordinary business email.`,
  from: `Faisal Qureshi <bookings@skylineshuttles.example>`, to: [`Roxanne Maddox <roxanne.maddox@teasdaleconsulting.test>`],
  subj: `Re: airport run`,
  body: `Booked. Pickup 4:45 Friday from the office. Driver will text. Faisal` },

{ k: 'bd', ind: 'commercial', v: 'uk', set: 'company confidential line at the foot of a message', bnd: 'a company-confidential footer addressed to the recipient',
  why: `SPEC §5.10 Does not flag: confidentiality footers addressed to the recipient (company confidential).`,
  from: `Yvette Larkin <yvette@marlowandwest.example>`, to: [`Leonard Cho <leonard.cho@brightonpiermail.test>`],
  subj: `Notes from today`,
  body: `Leonard,

Notes from today's call: you will send the revised floor plans on Monday, we will review the lease terms by Wednesday, and we'll meet at your office on the 22nd.

Yvette

Company confidential.` },
];
