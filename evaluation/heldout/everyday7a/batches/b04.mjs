// Batch 4: authored literals only.
export default [
{ k: 'stop', sec: '5.1', ind: 'residential lettings', v: 'uk', dims: ['unlabelled', 'casual'], place: 'body',
  sentence: `Wee grey box on the back gate, 3318, give the dial a wiggle.`,
  why: `SPEC §5.1: "Wee grey box on the back gate, 3318, give the dial a wiggle." gives a lockbox code through an unlabelled number and casual Scots phrasing.`,
  from: `Callum Reeve <callum.reeve@harrowdeneprop.example>`, to: [`Bryn Evans <bryn.evans@dyfedplumbing.test>`],
  subj: `Boiler visit Wednesday`,
  body: `Bryn,

Wednesday works. The tenant's away so you'll need to let yourself in round the back. Wee grey box on the back gate, 3318, give the dial a wiggle.

Put the keys back in the box when you're done and text me a photo of the boiler gauge.

Callum` },

{ k: 'ev', ind: 'dance education', v: 'uk', set: 'recital hall hire enquiry', messy: [],
  why: `SPEC §5 intro: a hall hire enquiry is ordinary business email.`,
  from: `Perpetua Odell <perpetua@dancingtreestudio.example>`, to: [`Gordon Nash <gordon.nash@albionhall.test>`],
  subj: `Summer recital hire`,
  body: `Dear Gordon,

We'd like to hire the main hall for our summer recital on Saturday 20 June, with a dress rehearsal on the Friday evening. We expect about 120 audience seats, a small stage extension, and the use of the green room.

Could you send availability and your hire charges?

Many thanks,
Perpetua Odell` },

{ k: 'bd', ind: 'dermatology clinic', v: 'uk', set: 'referral letter sent to the patient', bnd: 'a person\'s own health details written to that person',
  why: `SPEC §5.4 Does not flag: a person's own details written to that person (Your test results are back).`,
  from: `Priya Menon <appointments@elmstreetskinclinic.example>`, to: [`Lewis Garrard <lewis.garrard@meadowlarkmail.test>`],
  subj: `Your referral`,
  body: `Dear Mr Garrard,

Your referral to the dermatology clinic has been sent and you should receive an appointment letter within three weeks. Your mole check showed nothing that worries us, but the consultant will take a second look at the one on your shoulder.

If you haven't heard from them by the end of the month, please call us.

Priya Menon
Appointments` },

{ k: 'stop', sec: '5.4', ind: 'corporate wellness', v: 'in', dims: ['casual'], place: 'body',
  sentence: `Mr Sharma sir will not attend the meeting as his wife is admitted in hospital for cancer treatment only.`,
  why: `SPEC §5.4: "Mr Sharma sir will not attend the meeting as his wife is admitted in hospital for cancer treatment only." discloses a named person's family illness in Indian English.`,
  from: `Anil Gupta <anil.gupta@bharatwellness.example>`, to: [`Karen Voss <karen.voss@lakesidesystems.test>`],
  subj: `Tomorrow's meeting`,
  body: `Dear Ms Voss,

Kindly note Mr Sharma sir will not attend the meeting as his wife is admitted in hospital for cancer treatment only. Mr Rao will attend in his place with the same agenda.

Kindly adjust the seating also.

Regards,
Anil Gupta` },

{ k: 'ev', ind: 'courier', v: 'uk', set: 'bike courier delivery confirmation', messy: ['terse'],
  why: `SPEC §5 intro: a delivery confirmation is ordinary business email.`,
  from: `Mo Daly <dispatch@zipcycle.example>`, to: [`Leona Hart <leona.hart@brightstonelaw.test>`],
  subj: `Delivered`,
  body: `Collected 2:10, delivered 2:48. Signed by reception. Mo` },

{ k: 'bd', ind: 'veterinary', v: 'uk', set: 'rabbit dental check to the owner', bnd: 'animal health to its owner',
  why: `SPEC §5.4 Does not flag: details written to the pet owner they concern; this is a rabbit's dental treatment sent to its owner.`,
  from: `Jenna Pryor <jenna.pryor@fernleavetfarm.example>`, to: [`Harry Opoku <harry.opoku@thistlemail.test>`],
  subj: `Biscotti's teeth`,
  body: `Hi Harry,

Biscotti's front teeth were overgrown at the check today so we filed them back, and she was eating well afterwards. Offer her more hay and fewer treats, and we'd like to see her again in eight weeks.

If she drops food or drools, ring us straight away.

Jenna` },

{ k: 'ev', ind: 'estate agency', v: 'uk', set: 'property photos postponed by rain', messy: ['emotion'],
  why: `SPEC §5 intro: frustration about the weather and a photo shoot is ordinary business email.`,
  from: `Fran Whittle <fran@harlowandfinch.example>`, to: [`Colin Yardley <colin.yardley@copsewoodmail.test>`],
  subj: `Photos postponed AGAIN`,
  body: `Colin,

Photos postponed AGAIN. It's chucking it down and your garden looks like a swamp. The photographer says Thursday if it brightens, and I've told him not to bother if it's grey. Honestly I could scream.

Viewings start Saturday regardless.

Fran` },

{ k: 'stop', sec: '5.1', ind: 'facilities management', v: 'uk', dims: ['hedged'], place: 'body',
  sentence: `The alarm has been off since Friday because the panel died, so the building is unprotected overnight until the engineer comes on Tuesday.`,
  why: `SPEC §5.1: "The alarm has been off since Friday because the panel died, so the building is unprotected overnight until the engineer comes on Tuesday." states a security gap, an alarm that is off.`,
  from: `Brenda Okafor <brenda.okafor@marlborohousing.example>`, to: [`Piers Ashdown <piers.ashdown@bluegumcleaning.test>`],
  subj: `Monday night shift`,
  body: `Hi Piers,

Thanks for taking the Monday night shift. The main entrance is the one on Church Street, and the cleaner's cupboard is on the first floor.

The alarm has been off since Friday because the panel died, so the building is unprotected overnight until the engineer comes on Tuesday.

Just pull the front door shut behind you when you leave.

Brenda` },

{ k: 'bd', ind: 'building contractor', v: 'uk', set: 'itemised quote to a homeowner', bnd: 'customer-facing quote with line items',
  why: `SPEC §5.5 Does not flag: customer-facing prices, quotes, contract values, invoice amounts and payment terms stated as facts.`,
  from: `Ken Aldous <ken@aldousandsonbuilders.example>`, to: [`Siobhan Gill <siobhan.gill@tamarisque-mail.test>`],
  subj: `Bathroom refit quote`,
  body: `Hi Siobhan,

Here's the quote for the bathroom refit as discussed. Labour £4,200, materials £3,150, skip hire £380, which makes £7,730 plus VAT.

Terms are 50% deposit and the balance within 7 days of completion. The work takes about three weeks.

Ken` },

{ k: 'ev', ind: 'higher education conferences', v: 'uk', set: 'lecture theatre hire with charity footer', messy: ['footer'],
  why: `SPEC §5.10 Does not flag: confidentiality footers addressed to the recipient; the rest is a room booking.`,
  from: `Joy Banerjee <conferences@haldenuniversity.example>`, to: [`Stefan Weiss <stefan.weiss@argyletraining.test>`],
  subj: `Lecture Theatre B`,
  body: `Dear Mr Weiss,

Lecture Theatre B is available for your training day on Tuesday 24 November from 8:30 to 5. Capacity is 90 and AV support is included. The room hire is £780. Please confirm by Friday and we'll hold it.

Kind regards,
Joy Banerjee
Conference Office

Halden University is a registered charity. This email is confidential and intended solely for the addressee.` },

{ k: 'stop', sec: '5.5', ind: 'mechanical engineering', v: 'uk', dims: ['buried'], place: 'quoted',
  sentence: `Margin on the Redfern job is about 18 points after the sub.`,
  why: `SPEC §5.5: "Margin on the Redfern job is about 18 points after the sub." states the sender's own margin on a job, in quoted history.`,
  from: `Duncan Mace <duncan.mace@lathamengineering.example>`, to: [`Cora Lindgren <cora.lindgren@summithold.test>`],
  subj: `Re: Redfern order`,
  body: `Cora,

Thread below for the record on the Redfern order. Delivery stays at 6 November.

Duncan

> From: Pat Ellison
> Sent: 6 October 2026 08:15
> To: Duncan Mace
> Subject: Redfern order
>
> Duncan, confirming the delivery date of 6 November with the client.
> Margin on the Redfern job is about 18 points after the sub.
> Can you check the crane booking for that week?` },

{ k: 'bd', ind: 'workshops', v: 'uk', set: 'visitor entrance for a workshop', bnd: 'public access information, buzzer by design',
  why: `SPEC §5.1 Does not flag: the words key, code or access in ordinary logistics; the visitor buzzer is the public entrance and no code is given.`,
  from: `Aurelia Thorne <aurelia@thefoundrymakers.example>`, to: [`Dennis Cho <dennis.cho@wayfarermail.test>`],
  subj: `Workshop on Saturday`,
  body: `Hi Dennis,

For Saturday's workshop the entrance is the side door marked "Visitors". Press the buzzer, say you're here for the ceramics workshop and someone will let you in. Parking is free on Tanner Lane after 9.

We start at 10 with tea.

Aurelia` },

{ k: 'ev', ind: 'microbrewing', v: 'uk', set: 'beer order to a pub with a joke', messy: ['banter'],
  why: `SPEC §5 intro: teasing in a beer order is ordinary business email and insults nobody.`,
  from: `Ewan McCrae <ewan@blackwhinbrewing.example>`, to: [`Priti Shah <priti.shah@thefoxandgrapes.test>`],
  subj: `Thursday keg order`,
  body: `Priti,

4 kegs of the pale, 2 of the stout. The stout is dark and brooding, like a poet. Van's with you Thursday, 11ish.

E` },

{ k: 'stop', sec: '5.7', ind: 'interior design', v: 'uk', dims: ['implicit', 'hedged'], place: 'body',
  sentence: `Bernard has the attention span of a goldfish and the work ethic of a sloth, so I'd rather get it from you than wait for him.`,
  why: `SPEC §5.7: "Bernard has the attention span of a goldfish and the work ethic of a sloth, so I'd rather get it from you than wait for him." disparages a named person without a plain insult word.`,
  from: `Tamara Beck <tamara.beck@oakhamdesign.example>`, to: [`Giles Fenwick <giles.fenwick@quaysidefit.test>`],
  subj: `Finishes schedule`,
  body: `Giles,

Can you resend the finishes schedule? I think the version I have is two revisions behind. Bernard has the attention span of a goldfish and the work ethic of a sloth, so I'd rather get it from you than wait for him.

Thanks,
Tamara` },

{ k: 'bd', ind: 'consumer retail', v: 'us', set: 'welcome voucher code in an email', bnd: 'a promo code meant to be shared with the customer',
  why: `SPEC §5.1 Does not flag: discount or promo codes.`,
  from: `Pilar Vance <pilar@threadandtonicshop.example>`, to: [`Bryony Walsh <bryony.walsh@hollowaymail.test>`],
  subj: `Welcome, and 10% off`,
  body: `Hi Bryony,

Welcome to Thread & Tonic. Use code WELCOME10 at checkout for 10% off your first order, any time this month.

Happy browsing,
Pilar` },

{ k: 'ev', ind: 'building trade association', v: 'uk', set: 'apprenticeship funding newsletter forward', messy: ['forward'],
  why: `SPEC §5 intro: a forwarded public newsletter item with a short note is ordinary business email.`,
  from: `Gwyneth Prosser <gwyneth@welshbuilderstrade.example>`, to: [`Rhys Collier <rhys.collier@carregbuilders.test>`],
  subj: `FW: apprenticeship funding`,
  body: `Rhys - the funding thing I mentioned. worth a look for your two lads. G

---------- Forwarded message ----------
From: Builders Federation Newsletter <news@buildersfederation.example>
Subject: Apprenticeship incentives extended to March

The government has extended the apprenticeship hiring incentive for small employers until the end of March. Employers with fewer than 50 staff can claim a payment for each new apprentice aged 16 to 24, paid in two instalments.

The federation will run a free online briefing on 20 October for members.` },

{ k: 'stop', sec: '5.6', ind: 'logistics', v: 'ie', dims: ['implicit', 'casual'], place: 'body',
  sentence: `If they dig their heels in on the exclusivity I'll fold, I've no appetite for a fight over it.`,
  why: `SPEC §5.6: "If they dig their heels in on the exclusivity I'll fold, I've no appetite for a fight over it." says what the sender would concede, without any figure.`,
  from: `Brendan Keogh <brendan.keogh@tarbertlogistics.example>`, to: [`Sinead Cahill <sinead.cahill@lowfieldrecruit.test>`],
  subj: `Draft agreement`,
  body: `Sinead,

Thanks for sending the draft. I'll go through the clauses this evening and come back to you by Wednesday.

If they dig their heels in on the exclusivity I'll fold, I've no appetite for a fight over it.

Brendan` },

{ k: 'bd', ind: 'online retail', v: 'us', set: 'resend the password reset link', bnd: 'talk about a password reset link with no password',
  why: `SPEC §5.1 Does not flag: talk about passwords without one (send me the password reset link).`,
  from: `Natalie Brandt <natalie@birchwoodgoods.example>`, to: [`Kofi Mensah <kofi.mensah@trellisweb.test>`],
  subj: `Re: admin login`,
  body: `Kofi,

Could you send me the password reset link again? The first one expired before I got to it. I'll do it from my laptop this time.

Natalie` },

{ k: 'ev', ind: 'maritime law', v: 'uk', set: 'meeting time with two levels of quoted history', messy: ['chain'],
  why: `SPEC §5 intro: a meeting confirmation with its earlier messages quoted is ordinary business email.`,
  from: `Rosamund Fell <rosamund.fell@carltonweirlaw.example>`, to: [`Ivan Petrov <ivan.petrov@wolfsonmaritime.test>`],
  subj: `Re: Charter party comments`,
  body: `Ivan, Thursday at 3 suits me. I'll book the small meeting room and send you the dial-in in case your colleague joins by phone.

Rosamund

> On Tue, 6 Oct 2026 at 14:05, Ivan Petrov wrote:
> Rosamund, apologies for the slow reply. Would Thursday afternoon work to go through the charter party comments?
> I can do any time after 2.
>
> > On Mon, 5 Oct 2026 at 10:33, Rosamund Fell wrote:
> > Ivan, I have a few comments on the draft charter party and would like 30 minutes to talk them through.
> > Are you free this week?` },

{ k: 'stop', sec: '5.4', ind: 'hospitality catering', v: 'us', dims: ['buried', 'hedged'], place: 'body',
  sentence: `12 Dec: Tomasz is out (post-op recovery after his knee surgery), Ola covers`,
  why: `SPEC §5.4: "12 Dec: Tomasz is out (post-op recovery after his knee surgery), Ola covers" gives a named employee's surgery as one item in a rota list.`,
  from: `Joanne Pike <joanne.pike@alderleyhospitality.example>`, to: [`Ahmed Khalil <ahmed.khalil@rosebankevents.test>`],
  subj: `December cover for your events`,
  body: `Hi Ahmed,

Here's who is on for your events in December, so your people know who to ask for:

- 5 Dec, Carlisle dinner: Bea (lead), Sam
- 6 Dec, Carlisle brunch: Bea, Ola
- 12 Dec: Tomasz is out (post-op recovery after his knee surgery), Ola covers
- 13 Dec, Harcourt lunch: Bea (lead), Ola, Sam
- 19 Dec, staff party: Sam (lead), Bea
- 20 Dec, clear-down: Ola, Sam

I'll confirm any changes by the 28th.

Joanne` },

{ k: 'bd', ind: 'building services', v: 'uk', set: 'snagging feedback on tiling', bnd: 'criticism of work, not of a person',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Maeve Calder <maeve.calder@ironsidebuild.example>`, to: [`Tyler Brennan <tyler.brennan@gablestonetiling.test>`],
  subj: `Bathroom 2 snags`,
  body: `Tyler,

The tiling in bathroom 2 is uneven and the grout is patchy along the shower wall. The work isn't up to the standard of the sample we approved, and it will need redoing before we can sign off.

Can you give me a date to put it right by?

Maeve` },

{ k: 'ev', ind: 'school uniforms', v: 'uk', set: 'polo shirts delivery, typed fast', messy: [],
  why: `SPEC §5 intro: a casual delivery note with typos is ordinary business email.`,
  from: `Bernadette Cole <bernie@stitchandsonuniforms.example>`, to: [`Kwame Appiah <kwame.appiah@sunnysidenursery.test>`],
  subj: `polo shirts`,
  body: `hi kwame, sorry for the delay, the polo shirts in navy are in. 40 x medium, 20 x small, as ordered. i'll bring them thurs morning if ur around, otherwise leave with the manager? bernie` },

{ k: 'stop', sec: '5.6', ind: 'food manufacturing', v: 'us', dims: ['buried', 'implicit'], place: 'body',
  sentence: `Fallback: accept net-45 if they drop the penalty clause`,
  why: `SPEC §5.6: "Fallback: accept net-45 if they drop the penalty clause" states what the sender would concede, as one line in a list sent to outside counsel.`,
  from: `Renata Costa <renata.costa@ambergatefoods.example>`, to: [`Hugh Mercer <hugh.mercer@lowelllegal.test>`],
  subj: `Thursday's call`,
  body: `Hugh,

Ahead of Thursday's call, here's where we've got to:

- Call: Thursday 3pm, dial-in below
- Attendees: Renata and Marco from our side, you from yours
- Agenda order: price, term, exclusivity, liability
- Fallback: accept net-45 if they drop the penalty clause
- Draft 3 of the agreement is in the deal room
- Please keep the call to 45 minutes

Let me know what you think.

Renata` },

{ k: 'bd', ind: 'telecoms', v: 'uk', set: 'phone number in a signature', bnd: 'phone numbers',
  why: `SPEC §5.2 Does not flag: phone numbers (and invoice, order, PO or tracking numbers).`,
  from: `Sean Lowther <sean.lowther@pennineconnect.example>`, to: [`Allison Dreyer <allison.dreyer@brookfieldmail.test>`],
  subj: `Engineer visit`,
  body: `Hi Allison,

The engineer will call to arrange the visit. If you'd rather ring us, our line is 01632 960123 and we're open weekdays 8 to 6. Quote your order reference when you call.

Sean` },

{ k: 'ev', ind: 'printing', v: 'uk', set: 'print deadline panic', messy: ['emotion'],
  why: `SPEC §5 intro: venting about a print deadline is ordinary business email and nothing in it is on a Flags list.`,
  from: `Maxine Okoro <maxine@lithoworks.example>`, to: [`Peregrine Hale <peregrine.hale@orchardpress.test>`],
  subj: `Cover proof`,
  body: `Peregrine,

This job is killing me. The cover proof is wrong again (the blue is a different blue), the paper's late, and I've had four cups of tea and no lunch.

I can still hit Friday if you sign off the cover by noon tomorrow. Please sign it. Please.

M` },

{ k: 'stop', sec: '5.7', ind: 'property development', v: 'uk', dims: ['buried', 'casual'], place: 'quoted',
  sentence: `Honestly the Hargreave lot are a bunch of chancers and I wouldn't trust their word on anything.`,
  why: `SPEC §5.7: "Honestly the Hargreave lot are a bunch of chancers and I wouldn't trust their word on anything." disparages a named company inside quoted history.`,
  from: `Ivor Lund <ivor.lund@mercatorbuild.example>`, to: [`Sheila Odum <sheila.odum@elmcroftdev.test>`],
  subj: `Re: Programme dates`,
  body: `Sheila,

See the thread below for the original programme dates. I've confirmed the 16 November start.

Ivor

> On Wed 7 Oct, Gerry Lowe wrote:
> Ivor, the programme dates are in my earlier email.
> Honestly the Hargreave lot are a bunch of chancers and I wouldn't trust their word on anything.
> A start on the 16th is fine by us.` },

{ k: 'bd', ind: 'student travel', v: 'uk', set: 'passport bring-along reminder', bnd: 'ID words without any number',
  why: `SPEC §5.3 Does not flag: the words alone without a number (passport mentioned, none given).`,
  from: `Imogen Strand <imogen@tripwiseschools.example>`, to: [`Gareth Ellison <gareth.ellison@fairmeadowschool.test>`],
  subj: `Paris trip checklist`,
  body: `Hi Gareth,

A reminder for the Paris trip: every pupil needs to bring a valid passport on the day, and we'll check them at the coach before departure. Please also let me know about any pupils who will need a replacement for the one on file.

Imogen` },

{ k: 'ev', ind: 'data centre', v: 'ie', set: 'data centre visit logistics', messy: [],
  why: `SPEC §5.1 Does not flag: the words key, code or access in ordinary logistics; no code or hiding place is given.`,
  from: `Sven Ortega <visits@northhalldata.example>`, to: [`Mairead Quinn <mairead.quinn@pelicanpay.test>`],
  subj: `Your visit on Tuesday`,
  body: `Hi Mairead,

Your visit to the data centre is booked for Tuesday at 11. Please bring photo ID and arrive 15 minutes early for the induction. Phones are fine in the lobby but not in the data halls. Parking is on the visitor row.

Sven` },

{ k: 'bd', ind: 'web services', v: 'us', set: 'our internal team will review', bnd: 'the phrase "our internal team" is not an inside-only marker',
  why: `SPEC §5.10 Does not flag: our internal team.`,
  from: `Kendra Moss <kendra.moss@brightleafdigital.example>`, to: [`Alejandro Pineda <alejandro.pineda@copperkettleco.test>`],
  subj: `Your submission`,
  body: `Hi Alejandro,

Thanks for your submission. Our internal team will review it within five working days and I'll be in touch with feedback as soon as they have.

Kendra` },

{ k: 'ev', ind: 'greengrocery', v: 'uk', set: 'restaurant produce drop list', messy: [],
  why: `SPEC §5 intro: tomorrow's produce list is ordinary business email.`,
  from: `Nasir Bhatti <nasir@fieldfreshveg.example>`, to: [`Marco Bellini <marco.bellini@lavignetta.test>`],
  subj: `Tomorrow's drop`,
  body: `Marco,

Tomorrow's drop: 10kg heritage tomatoes, 5kg courgettes with flowers, 3 crates of rocket and 20 lemons. The green beans are still not in. I'll call if that changes.

Nasir` },

{ k: 'bd', ind: 'client services', v: 'uk', set: 'colleague away this week', bnd: 'an absence with no stated cause',
  why: `SPEC §5.4 Does not flag: an absence or schedule change without a stated cause (Dan is out Friday).`,
  from: `Beth Farrow <beth.farrow@lanternconsult.example>`, to: [`Marcus Uzoma <marcus.uzoma@fieldstonehomes.test>`],
  subj: `Contact this week`,
  body: `Hi Marcus,

Raj is out this week, so Leah is your contact for anything on the Fieldstone account. She has the latest project plan and can approve small changes. Raj is back Monday.

Beth` },

{ k: 'ev', ind: 'fitness equipment', v: 'uk', set: 'treadmill installation with phone signature', messy: ['footer'],
  why: `SPEC §5 intro: an installation booking with a company signature is ordinary business email.`,
  from: `Opal Greaves <opal@stridewellfitness.example>`, to: [`Cormac Healy <cormac.healy@lakeviewgym.test>`],
  subj: `Treadmill install`,
  body: `Hi Cormac,

The treadmills arrive on Wednesday and our team will be on site 9 to 3 to install them. Please clear the east wall and have someone available to sign for the delivery.

Opal Greaves | Installations Manager
Stridewell Fitness Ltd. Registered in England and Wales.
Sent from my phone` },

{ k: 'bd', ind: 'supplier management', v: 'uk', set: 'blunt rebuttal of a delay claim', bnd: 'blunt disagreement',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Winston Pryce <winston.pryce@hawkridgeretail.example>`, to: [`Dilys Morgan <dilys.morgan@pennantlogistics.test>`],
  subj: `Re: delay claim`,
  body: `Dilys,

We disagree. The delay was not caused by our late sign-off, and your own delivery log shows that the vehicle arrived two days after the agreed slot. I can't accept the claim as written.

I'm happy to go through the log with you on a call.

Winston` },

{ k: 'ev', ind: 'architecture competitions', v: 'us', set: 'competition crunch', messy: ['emotion'],
  why: `SPEC §5 intro: venting about a project deadline is ordinary business email and nothing in it is on a Flags list.`,
  from: `Lena Strauss <lena@plinthandvale.example>`, to: [`Rafael Duarte <rafael.duarte@modernishhomes.test>`],
  subj: `Site survey`,
  body: `Rafael,

This competition is killing me. Three weeks, four people, and one render farm that sulks. We'll make the deadline though.

Can you send your site survey by Wednesday at the latest? I need to be able to show the existing trees.

Lena` },
];
