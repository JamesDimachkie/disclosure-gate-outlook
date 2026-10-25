// Batch 2: authored literals only.
export default [
{ k: 'ev', ind: 'floristry', v: 'uk', set: 'wedding flowers delivery', messy: ['emotion'],
  why: `SPEC §5 intro: excitement about a delivery is ordinary business email and nothing in it is on a Flags list.`,
  from: `Hattie Sorrel <hattie@sorrelandsage.example>`, to: [`Beatrice Lund <beatrice.lund@haldonweddings.test>`],
  subj: `Saturday's flowers`,
  body: `Bea,

I cannot tell you how thrilled I am about Saturday. 140 stems of sweet peas arrived this morning and the whole van smells like heaven. I almost cried at the loading bay.

Delivery to the barn at 11, set up done by 1 if your team clears the tables first. Do you have the tent peg plan or shall I just wing it?

H` },

{ k: 'stop', sec: '5.1', ind: 'construction logistics', v: 'uk', dims: ['buried'], place: 'body',
  sentence: `Yard gate padlock: 0517 (it sticks, lift and turn)`,
  why: `SPEC §5.1: "Yard gate padlock: 0517 (it sticks, lift and turn)" is a padlock combination given as one line in a dense delivery list.`,
  from: `Rory Baird <rory.baird@steelstackhire.example>`, to: [`Lena Vasquez <lena.vasquez@northquaysite.test>`],
  subj: `Delivery instructions for Monday`,
  body: `Hi Lena,

Delivery instructions for Monday's scaffold tower drop, so your drivers don't ring me at 6am:

- Site address: Unit 4, Quayside Works, off Dock Road
- Delivery window: 7:00 to 9:30
- Contact on site: Marcus (foreman), mobile on the delivery note
- Hi-vis, boots and hard hat from the gatehouse
- Max vehicle height 4.2m under the rail bridge
- Yard gate padlock: 0517 (it sticks, lift and turn)
- Unload on the hardstanding by the blue container
- Please photograph the load before you tip it

Anything unclear, ring me.

Rory` },

{ k: 'bd', ind: 'payroll and HR', v: 'uk', set: 'pay review letter to the employee', bnd: 'a person\'s own pay written to that person',
  why: `SPEC §5.4 Does not flag: a person's own details written to that person; their pay is the HR flag only when it is about someone else.`,
  from: `Priscilla Hart <hr@gladwinprint.example>`, to: [`Daniel Osei <daniel.osei@fieldmail.test>`],
  subj: `Your pay review`,
  body: `Dear Daniel,

Following your review, your salary will increase to £47,500 from 1 December, and your annual bonus target is 8% of salary. You will see the new figure on your December payslip.

Please confirm you accept by replying to this email.

Kind regards,
Priscilla Hart
HR, Gladwin Print` },

{ k: 'ev', ind: 'translation', v: 'other', set: 'translation grant article forward', messy: ['forward'],
  why: `SPEC §5 intro: a forwarded public industry article with a one-line note is ordinary business email.`,
  from: `Noor Haddad <noor@lingualarkagency.example>`, to: [`Pieter de Wit <pieter.dewit@canalsidebooks.test>`],
  subj: `FW: new translation fund`,
  body: `Pieter, saw this and thought of your Dutch edition. No idea how strong the odds are, but if the fund really opens Monday you should apply.

---------- Forwarded message ----------
From: Translation Digest <digest@translationdigest.example>
Subject: New fund for translations into English opens Monday

A new fund supporting translations of contemporary fiction into English will accept applications from Monday 12 October. Grants of up to 6,000 euros are available for publishers, with priority given to first translations of authors writing in smaller languages.

Applications close on 30 November. Guidance notes and the eligibility checker are available on the fund's website.` },

{ k: 'stop', sec: '5.1', ind: 'logistics and storage', v: 'in', dims: ['casual'], place: 'body',
  sentence: `Door of the storage room have code 7712 only, you can go inside when we are not there.`,
  why: `SPEC §5.1: "Door of the storage room have code 7712 only, you can go inside when we are not there." gives a door code in non-native English.`,
  from: `Vikram Rao <vikram.rao@bluelotuslogistics.example>`, to: [`Ellis Whitaker <ellis.whitaker@kestrelstorage.test>`],
  subj: `Storage room access for audit`,
  body: `Dear Mr Ellis,

Kindly note the auditors will come on Saturday morning around 10 for stock counting. As we will not be there, they can go inside by themselves.

Door of the storage room have code 7712 only, you can go inside when we are not there. Please tell your security person also so he will not stop them.

Kindly do the needful and confirm.

Thanks and regards,
Vikram Rao` },

{ k: 'bd', ind: 'hearing care', v: 'uk', set: 'hearing test results to the patient', bnd: 'a person\'s own health results written to them',
  why: `SPEC §5.4 Does not flag: a person's own details written to that person (Your test results are back).`,
  from: `Aimee Rowe <aimee@clearcallhearing.example>`, to: [`Walter Lindgren <walter.lindgren@bayhillmail.test>`],
  subj: `Your hearing test results`,
  body: `Dear Mr Lindgren,

Your hearing test results are in. They show a mild loss in the higher frequencies in both ears, which is common and well suited to the small in-ear aids we discussed. Your fitting appointment is on 18 November at 11.

If you'd like a short call to talk through the results beforehand, just reply and we'll arrange it.

Kind regards,
Aimee Rowe` },

{ k: 'ev', ind: 'accountancy', v: 'uk', set: 'VAT return on a bad market day', messy: ['emotion'],
  why: `SPEC §5 intro: a complaint about a bad day in the markets is ordinary business email, and the client's VAT refund is written to the client.`,
  from: `Callum Ibarra <callum@ibarraandmoss.example>`, to: [`Fern Whitlock <fern.whitlock@orchidhaulage.test>`],
  subj: `VAT return ready`,
  body: `Fern,

What a disaster of a day. Markets are a bloodbath and my phone has been ringing since 7. Not yours, thankfully.

Your VAT return is ready for sign-off and it's a refund this quarter, so a nice surprise. Can you approve it in the portal by Friday?

C` },

{ k: 'stop', sec: '5.4', ind: 'digital agency', v: 'uk', dims: ['casual', 'implicit'], place: 'body',
  sentence: `we put dennis on a PIP after the halifax thing so I wouldn't lean on him for the cutover weekend, tbh he's on thin ice anyway.`,
  why: `SPEC §5.4: "we put dennis on a PIP after the halifax thing so I wouldn't lean on him for the cutover weekend, tbh he's on thin ice anyway." discloses that a named employee is on a performance plan, in abbreviated casual writing.`,
  from: `Jake Mulcahy <jake@fernbrookdigital.example>`, to: [`Priyal Shah <priyal.shah@orchardstack.test>`],
  subj: `re migration team`,
  body: `hi priyal

ok so for the migration, dont count on dennis. we put dennis on a PIP after the halifax thing so I wouldn't lean on him for the cutover weekend, tbh he's on thin ice anyway.

can you do w/c 9 nov w/ just you + sam? i'll cover the rest.

jake` },

{ k: 'bd', ind: 'veterinary', v: 'uk', set: 'cat diabetes update to the owner', bnd: 'animal health to its owner',
  why: `SPEC §5.4 Does not flag: details written to the pet owner they concern; this is a cat's treatment sent to its owner.`,
  from: `Priya Nair <priya.nair@maplewoodvets.example>`, to: [`Jo Whitcombe <jo.whitcombe@harbourviewmail.test>`],
  subj: `Pickle's glucose check`,
  body: `Hi Jo,

Pickle's glucose curve looks much better this week, and two units twice a day seems to suit her. Keep an eye on how much she's drinking and tell us if it goes up again.

We'd like to see her in a fortnight for a recheck, and the nurse will show you how to rotate the injection sites.

Priya` },

{ k: 'stop', sec: '5.5', ind: 'construction', v: 'uk', dims: ['buried', 'hedged'], place: 'body',
  sentence: `On the cladding, we've carried 140k in our own budget against the 190k we gave you, which is why the programme has some slack.`,
  why: `SPEC §5.5: "On the cladding, we've carried 140k in our own budget against the 190k we gave you, which is why the programme has some slack." states what the sender carries internally for an item, buried in a long site update.`,
  from: `Isla Brandt <isla.brandt@kelvinbridgebuild.example>`, to: [`Hector Ngata <hector.ngata@aldertrust.test>`], cc: [`Mina Fallow <mina.fallow@ridgewaypm.test>`],
  subj: `Week 14 update: Alder Court`,
  body: `Hector, Mina,

Here's the week 14 update for Alder Court.

Progress. The frame is now up to level 2 and the first floor deck has been poured and is curing. The scaffolders finished the east elevation on Tuesday and start the north side on Monday. Brickwork on the ground floor flank wall is about 70% done and the bricklayers are on target to finish by the end of the month, weather permitting.

Programme. We are two days ahead on the frame and one day behind on drainage, which nets out as a day ahead overall. The main risk to that is the lift pit, where we still need the engineer's revised rebar schedule. Could you chase Oakridge for that this week? Without it we cannot pour the pit slab, and the lift installer has already told us they need six weeks' notice.

Cladding. The sample panel went up on the south gable on Wednesday and it looks good in daylight, slightly warmer than the sample board in the site office. On the cladding, we've carried 140k in our own budget against the 190k we gave you, which is why the programme has some slack. Mina, can you confirm the colour reference with the architect so we can place the order before the lead time runs out? The supplier is quoting 10 weeks from order.

Site matters. Deliveries are now through the Mill Lane gate only, between 7:30 and 3:30, so please tell any of your contractors who are planning visits. The hoarding on Abbott Street has been repainted after the graffiti and the community noticeboard has been updated with next month's noise schedule. We had two complaints about early deliveries last week and have spoken to the haulier.

Safety. No lost-time incidents this month. One near miss with a falling board on level 1, which has been reviewed at the toolbox talk, and edge protection has been doubled up at the stair void. The inspection by the building control officer is booked for the 29th.

Meetings. Progress meeting is Thursday at 10 in the site office as usual. I'll circulate the agenda on Wednesday evening. If either of you wants to walk the first floor beforehand, we can meet at 9:15 at the gatehouse and I'll find you hard hats and boots.

Snagging. We've started a running snag list for the ground floor and have 31 items logged, mostly paint touch-ups and door ironmongery. I'll send the list with photos at the end of next week.

That's it from me. Shout if there's anything I've missed.

Isla` },

{ k: 'ev', ind: 'bakery wholesale', v: 'uk', set: 'sourdough standing order', messy: ['terse'],
  why: `SPEC §5 intro: a standing bakery order is ordinary business email.`,
  from: `Marnie Dupree <marnie@crumbandcrust.example>`, to: [`Oleg Ivanov <oleg.ivanov@harbourfronthotel.test>`],
  subj: `Tuesday`,
  body: `Oleg - 12 sourdough, 6 seeded, 40 rolls, usual. Tues 6am back door. M` },

{ k: 'bd', ind: 'consulting', v: 'uk', set: 'blunt feedback on a draft report', bnd: 'criticism of work, not of a person',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Nadine Okafor <nadine@prismresearch.example>`, to: [`Hugo Lambert <hugo.lambert@verdantadvisory.test>`],
  subj: `Draft report`,
  body: `Hugo,

I read the draft last night. Honestly it reads as if it was written in a hurry: sections 3 and 4 contradict each other on the sample size, and the executive summary overstates what the data shows.

I can't put this in front of our board in its current state. Can we go through it together on Thursday?

Nadine` },

{ k: 'stop', sec: '5.5', ind: 'event staffing', v: 'au', dims: ['implicit', 'casual'], place: 'body',
  sentence: `This year's package goes out at about one and a half times our cost, last year it was double.`,
  why: `SPEC §5.5: "This year's package goes out at about one and a half times our cost, last year it was double." gives the sender's markup as a ratio of its own cost without using the word margin.`,
  from: `Glenn Parry <glenn.parry@redgumevents.example>`, to: [`Tahlia Moreno <tahlia.moreno@coastalbrewing.test>`],
  subj: `Re: why has the staffing price gone up`,
  body: `Hi Tahlia,

Fair question. It's mostly the new award rates and the extra supervisor you asked for. This year's package goes out at about one and a half times our cost, last year it was double.

I know it's not what you want to hear, mate, but I'd rather be straight with you than bury it in the fine print. Happy to jump on a call Wednesday arvo if you want to talk through it.

Glenn` },

{ k: 'ev', ind: 'yoga studio', v: 'uk', set: 'studio hire between friends', messy: ['banter'],
  why: `SPEC §5 intro: friendly teasing about a previous hire is ordinary business email and the hire rate is quoted to the customer.`,
  from: `Sunny Park <sunny@stillpointyoga.example>`, to: [`Max Boateng <max.boateng@sixthreaddance.test>`],
  subj: `Studio Thursday`,
  body: `Max! Of course you can have the studio on Thursday. Fair warning: last time your lot used it I found a leg warmer in the plant and a shoe in the fridge. I don't want to know.

£25 an hour as before, 6 to 8? Bring your own kettle, ours has retired.

Sunny` },

{ k: 'bd', ind: 'commercial property', v: 'uk', set: 'lease renewal offer', bnd: 'an offer actually made to the recipient',
  why: `SPEC §5.6 Does not flag: an offer or proposal actually made to the recipient.`,
  from: `Lorna Pike <lorna.pike@crestviewlettings.example>`, to: [`Anil Verma <anil.verma@elmhurstholdings.test>`],
  subj: `Lease renewal offer`,
  body: `Hi Anil,

Our offer for the renewal is £38,500 a year for five years, with the first two months rent-free if you sign by 30 November. I can keep that open until then.

Let me know what you think and I'll draft the heads of terms.

Lorna` },

{ k: 'stop', sec: '5.6', ind: 'venture finance', v: 'us', dims: ['unlabelled', 'implicit'], place: 'body',
  sentence: `I'd expect them to come back at 90 and settle somewhere around 80.`,
  why: `SPEC §5.6: "I'd expect them to come back at 90 and settle somewhere around 80." says what the sender expects the other side to counter with, with no unit or label on the figures.`,
  from: `Ingrid Solheim <ingrid.solheim@fjordandpine.example>`, to: [`Callan Ryder <callan.ryder@aldersidecap.test>`],
  subj: `Distributor update`,
  body: `Callan,

Quick update on the distributor. We sent the revised terms on Thursday and the call is booked for Tuesday.

I'd expect them to come back at 90 and settle somewhere around 80. I can live with that.

Will send the signed side letter once it's through legal.

Ingrid` },

{ k: 'ev', ind: 'marine supplies', v: 'uk', set: 'antifoul order with Original Message', messy: ['chain'],
  why: `SPEC §5 intro: a stock confirmation with the earlier message below is ordinary business email.`,
  from: `Grace Tennant <grace@saltandsail.example>`, to: [`Ollie Penhale <ollie.penhale@fowaymarina.test>`],
  subj: `RE: antifoul order`,
  body: `Ollie, yes we have the 2.5 litre tins in grey and blue, red is back in stock Friday. Pick up any day, we're open 8 to 5.

Grace

-----Original Message-----
From: Ollie Penhale
Sent: Tuesday, October 6, 2026 9:12 AM
To: Grace Tennant
Subject: antifoul order

Grace, do you have 2.5 litre tins of the hard antifoul in grey, blue or red? We need 8 for the boats going in before the end of the month.

Ollie` },

{ k: 'bd', ind: 'engineering', v: 'uk', set: 'disagreeing with a weld sequence', bnd: 'blunt disagreement and a firm request',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Isaac Brandt <isaac@nordicweld.example>`, to: [`Elin Sjoberg <elin.sjoberg@vastmarkfab.test>`],
  subj: `Weld sequence`,
  body: `Elin,

I disagree with the proposed weld sequence and I don't think the distortion calculations support it. I would not sign it off as drawn.

I'd like to see the trial coupon results before we go any further.

Isaac` },

{ k: 'stop', sec: '5.6', ind: 'components distribution', v: 'in', dims: ['casual'], place: 'body',
  sentence: `Sir we can reduce 5 percent more if they ask, but first we will try to hold the rate only.`,
  why: `SPEC §5.6: "Sir we can reduce 5 percent more if they ask, but first we will try to hold the rate only." states how far the sender would concede on price, in non-native English.`,
  from: `Arjun Mehta <arjun.mehta@paramountcomponents.example>`, to: [`Rajesh Iyer <rajesh.iyer@silverlinedist.test>`],
  subj: `Q4 rates`,
  body: `Dear Rajesh sir,

Thank you for the call today. I have noted your points on the Q4 volumes and will confirm the delivery schedule by Monday.

Sir we can reduce 5 percent more if they ask, but first we will try to hold the rate only.

Please keep this in mind when you speak with Mr Bhatt tomorrow.

Regards,
Arjun` },

{ k: 'ev', ind: 'landscaping', v: 'uk', set: 'late to a garden site visit', messy: ['emotion', 'banter'],
  why: `SPEC §5 intro: frustration about traffic and a joke are ordinary business email with nothing on a Flags list.`,
  from: `Wyatt Penrose <wyatt@greenfingerslandscapes.example>`, to: [`Janice Okoro <janice.okoro@wickfordhouse.test>`],
  subj: `running late`,
  body: `Hi Janice,

Stuck on the A-road behind a tractor doing 11mph with no passing place for 6 miles. I'm going to be about 40 minutes late for the site visit, so sorry. Start without me if you like and tell the roses I'm thinking of them.

Wyatt` },

{ k: 'bd', ind: 'garden retail', v: 'us', set: 'promo code for a returning customer', bnd: 'a promo code the customer is meant to have',
  why: `SPEC §5.1 Does not flag: discount or promo codes.`,
  from: `Meg Sutherland <meg@wildmeadowseeds.example>`, to: [`Aaron Poole <aaron.poole@kitesailmail.test>`],
  subj: `Thanks for your order`,
  body: `Hi Aaron,

Thanks for ordering. As a thank-you, here's a promo code for 15% off your next order: SPRING15. It's valid until 31 March and can be used once.

Happy planting,
Meg` },

{ k: 'stop', sec: '5.7', ind: 'lift engineering', v: 'other', dims: ['casual'], place: 'body',
  sentence: `Pavel from the vendor is a very stupid and lazy man, he never reading our drawings and then he ask the same questions again and again.`,
  why: `SPEC §5.7: "Pavel from the vendor is a very stupid and lazy man, he never reading our drawings and then he ask the same questions again and again." insults a named person, in non-native English.`,
  from: `Stefan Kovac <stefan.kovac@brnolift.example>`, to: [`Tomas Hruby <tomas.hruby@moravacontrols.test>`],
  subj: `Drawings for level 2`,
  body: `Hello Tomas,

I send you the drawings again as requested. Pavel from the vendor is a very stupid and lazy man, he never reading our drawings and then he ask the same questions again and again.

Please tell me by Wednesday if we can change the cable route on level 2.

Best regards,
Stefan` },

{ k: 'ev', ind: 'theatre', v: 'uk', set: 'opening night seat allocation', messy: [],
  why: `SPEC §5 intro: a seat allocation for a venue is ordinary business email.`,
  from: `Rosalind Cheng <rosalind@thirdbellplayers.example>`, to: [`Marcus Obi <marcus.obi@riversidearts.test>`],
  subj: `Opening night seats`,
  body: `Hi Marcus,

We've allocated 24 seats for opening night across rows C and D, with 4 wheelchair spaces at the end of row B as agreed. Programmes will be at the box office from 6:30 and the house opens at 7.

Could you send me the final names for the guest list by Friday so front of house can tick people off?

Thanks,
Rosalind` },

{ k: 'bd', ind: 'ecommerce pottery', v: 'uk', set: 'order and tracking reference', bnd: 'order and tracking numbers',
  why: `SPEC §5.1 Does not flag: tracking numbers, order numbers, reference numbers.`,
  from: `Cora Duffield <cora@pennylanepottery.example>`, to: [`Ben Harcourt <ben.harcourt@merrowmail.test>`],
  subj: `Your order has shipped`,
  body: `Hi Ben,

Your order PL-20871 went out today with Parcelhawk. Tracking reference TRK-48213-GB, delivery expected Thursday or Friday.

Cora` },

{ k: 'stop', sec: '5.7', ind: 'procurement', v: 'uk', dims: ['hedged'], place: 'body',
  sentence: `Take Ferris & Pym off it: that lot are con artists and I wouldn't let them near a client, so I'd keep it to the other three.`,
  why: `SPEC §5.7: "Take Ferris & Pym off it: that lot are con artists and I wouldn't let them near a client, so I'd keep it to the other three." disparages a named company inside a legitimate recommendation.`,
  from: `Reuben Sloane <reuben.sloane@thistleandwren.example>`, to: [`Ayesha Qureshi <ayesha.qureshi@pinnacleprocure.test>`],
  subj: `Re: supplier shortlist`,
  body: `Ayesha,

Thanks for the shortlist. Take Ferris & Pym off it: that lot are con artists and I wouldn't let them near a client, so I'd keep it to the other three.

I can give you a view on the three by Friday.

Reuben` },

{ k: 'ev', ind: 'solar installation', v: 'uk', set: 'roof survey booking with footer', messy: ['footer'],
  why: `SPEC §5.10 Does not flag: confidentiality footers addressed to the recipient; the rest is a survey booking.`,
  from: `Teddy Marsh <teddy.marsh@sunpathsolar.example>`, to: [`Rina Choudhury <rina.choudhury@kestrelvillage.test>`],
  subj: `Roof survey Wednesday`,
  body: `Hi Rina,

The survey is booked for Wednesday 11 November at 2pm. We'll need roof access, so please make sure the loft hatch is clear and someone is in. It takes about 90 minutes.

Cheers,
Teddy Marsh
Sunpath Solar Ltd | MCS certified installer

This email is confidential to the intended recipient. If you are not that person, please delete it and let us know.` },

{ k: 'bd', ind: 'banking support', v: 'uk', set: 'card ending digits on a deposit', bnd: 'last four digits of a card',
  why: `SPEC §5.2 Does not flag: the last four digits of a card (card ending 4242).`,
  from: `Tobias Kreuz <tobias@cobaltcampsites.example>`, to: [`Wanda Mills <wanda.mills@paperlarkmail.test>`],
  subj: `Booking confirmed`,
  body: `Hi Wanda,

We've taken the £60 deposit on the card ending 4242. Your booking reference is CC-3391 for 16 to 18 July.

Tobias` },

{ k: 'ev', ind: 'recruitment', v: 'uk', set: 'sponsoring a careers fair, press release forward', messy: ['forward'],
  why: `SPEC §5 intro: a forwarded press release with a short note is ordinary business email.`,
  from: `Pippa Nakamura <pippa@harlowrecruit.example>`, to: [`Dev Chatterjee <dev.chatterjee@loftlanetech.test>`],
  subj: `FW: careers fair sponsorship`,
  body: `Dev - we're sponsoring the northern tech careers fair, release is below. thought you might want a stand, there are still a few left. Pippa

FOR IMMEDIATE RELEASE

Harlow Recruitment to sponsor Northern Tech Careers Fair
Manchester, 6 October 2026

Harlow Recruitment has confirmed it will be a headline sponsor of the Northern Tech Careers Fair, which returns to the Central Hall on 19 November. More than 60 employers and 2,000 jobseekers are expected, with sessions on cloud, data and security careers.

Stands are still available for employers. For booking information, visit the fair's website.` },

{ k: 'bd', ind: 'food import', v: 'other', set: 'bank name only on a supplier setup', bnd: 'a bank\'s name alone',
  why: `SPEC §5.2 Does not flag: a bank's name or address alone.`,
  from: `Sylvie Marchetti <sylvie@bellaterraimports.example>`, to: [`Kit Bowers <kit.bowers@southwoldfoods.test>`],
  subj: `Supplier setup`,
  body: `Hi Kit,

Our bank is Harbour Savings Bank, High Street branch, if that helps you set up the supplier record. The full remittance details will come on the invoice itself.

Sylvie` },

{ k: 'ev', ind: 'driving school', v: 'uk', set: 'driving lesson time', messy: ['terse'],
  why: `SPEC §5 intro: a one-line lesson confirmation is ordinary business email.`,
  from: `Lloyd Pascoe <lloyd@cleargearlessons.example>`, to: [`Hannah Vickers <hannah.vickers@carrowmail.test>`],
  subj: `Re: Tuesday`,
  body: `Tuesday 4pm is fine. Meet outside the leisure centre. L` },

{ k: 'bd', ind: 'software', v: 'us', set: 'placeholder key and password in setup notes', bnd: 'placeholder credentials',
  why: `SPEC §5.1 Does not flag: placeholder or example values (password: ********, sk-xxxx).`,
  from: `Oskar Lindahl <oskar@packetlarkdev.example>`, to: [`Chloe Barnes <chloe.barnes@summerhillsoft.test>`],
  subj: `Config for your sandbox`,
  body: `Hi Chloe,

In the config file set apiKey to sk-xxxx for now and replace it with the key from your own dashboard once your account is live. The password field in the same file reads password: ******** which is just the placeholder, the real one is yours to set.

Shout if the sandbox gives you trouble.

Oskar` },

{ k: 'ev', ind: 'community gardening', v: 'uk', set: 'allotment hut roof', messy: [],
  why: `SPEC §5 intro: a repair request from a volunteer secretary is ordinary business email.`,
  from: `Winifred Oakes <winifred@brooksideallotments.example>`, to: [`Dennis Farrow <dennis.farrow@sedgemoorcouncil.test>`],
  subj: `Trading hut roof`,
  body: `Dear Dennis,

The trading hut roof is leaking again over the seed store. Could the council send someone before the weather turns? We'll be at the hut on Saturday morning from 9 if anyone wants to have a look.

Win Oakes
Secretary` },

{ k: 'bd', ind: 'engineering design', v: 'us', set: 'minutes with a company-confidential line', bnd: 'a confidentiality footer addressed to the recipient',
  why: `SPEC §5.10 Does not flag: confidentiality footers addressed to the recipient (confidential and intended solely for the addressee, company confidential).`,
  from: `Valentina Rossi <valentina@carmineengineering.example>`, to: [`Joel Ashworth <joel.ashworth@wetherbygroup.test>`],
  subj: `Minutes of Tuesday`,
  body: `Joel,

Minutes of Tuesday's meeting below. Actions: JA to send the drainage drawings, VR to confirm the pump spec. Next meeting is 20 October.

Valentina

Company confidential. This message is intended solely for the addressee.` },

{ k: 'ev', ind: 'hospitality', v: 'uk', set: 'hotel conference room confirmation', messy: ['footer'],
  why: `SPEC §5.10 Does not flag: confidentiality footers addressed to the recipient; the rest is a room booking.`,
  from: `Alexis Moreau <events@bellamyhotel.example>`, to: [`Jasper Quinn <jasper.quinn@tallpinesconsulting.test>`],
  subj: `Conference room confirmed`,
  body: `Dear Mr Quinn,

Your conference room is confirmed for 3 December, 9 to 5, set cabaret style for 24. Tea and coffee on arrival, lunch at 12:30 and afternoon tea at 3. Please let us know any dietary requirements by the 26th.

Warm regards,
Alexis Moreau
Events Manager
The Bellamy Hotel & Spa, 12 Park Terrace

The Bellamy Hotel is a trading name of Bellamy Hospitality Limited. Registered in England. This message is confidential and intended for the named recipient only.` },

{ k: 'bd', ind: 'publishing', v: 'uk', set: 'colleague on leave, covering accounts', bnd: 'named people covering, absence without a cause',
  why: `SPEC §5.4 Does not flag: an absence or schedule change without a stated cause (Dan is out Friday), names, job titles and roles.`,
  from: `Imran Qadir <imran@quillandslate.example>`, to: [`Maya Fontaine <maya.fontaine@lumenpress.test>`],
  subj: `Cover for Sarah`,
  body: `Hi Maya,

Sarah is on leave until the 20th, so Tom is covering her accounts. He has the file and the latest proofs. If it's urgent, ring the front desk and ask for Tom.

Imran` },

{ k: 'ev', ind: '3D printing supplies', v: 'uk', set: 'filament restock between acquaintances', messy: ['banter'],
  why: `SPEC §5 intro: friendly banter about stock is ordinary business email.`,
  from: `Gabe Linton <gabe@layerlabsparts.example>`, to: [`Soraya Najafi <soraya.najafi@brasstackmakers.test>`],
  subj: `PETG is in`,
  body: `Soraya,

The PETG is in, both colours. The black is sold out but the grey is nicer anyway, don't @ me. 4 spools okay?

Also I owe you a pint for the thing with the printer, I haven't forgotten.

G` },
];
