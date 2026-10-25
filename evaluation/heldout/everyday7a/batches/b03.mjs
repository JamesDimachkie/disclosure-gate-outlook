// Batch 3: authored literals only.
export default [
{ k: 'stop', sec: '5.1', ind: 'freight and haulage', v: 'uk', dims: ['implicit', 'hedged'], place: 'body',
  sentence: `Nothing covers the corner behind the skips on camera, so that's where I'd leave the kit if you get there early.`,
  why: `SPEC §5.1: "Nothing covers the corner behind the skips on camera, so that's where I'd leave the kit if you get there early." names an area no camera covers.`,
  from: `Ned Calloway <ned.calloway@bridgewaterfreight.example>`, to: [`Soo-jin Park <soojin.park@halyardcouriers.test>`],
  subj: `Thursday drop-off`,
  body: `Hi Soo-jin,

For Thursday's drop-off we're closed until 8 but the yard is fine to enter from 6:30. Park up by the blue dock doors and text me when you're there.

Nothing covers the corner behind the skips on camera, so that's where I'd leave the kit if you get there early.

Mind the forklift lane on the left, it's busy from 7.

Ned` },

{ k: 'ev', ind: 'podcast production', v: 'us', set: 'podcast episode edit going back', messy: ['terse', 'banter'],
  why: `SPEC §5 intro: a clipped production update with a joke is ordinary business email.`,
  from: `Jonah Faber <jonah@quietroomaudio.example>`, to: [`Mira Castellano <mira.castellano@lowerdeckpods.test>`],
  subj: `ep 14 edit`,
  body: `Ep 14 edit going back tonight. Cut 3 min of the tangent about cheese, left the cheese joke in. J` },

{ k: 'bd', ind: 'software', v: 'us', set: 'pull request feedback', bnd: 'criticism of work, not of a person',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Ravindra Pillai <ravindra@stackharborsoft.example>`, to: [`Emma Lindberg <emma.lindberg@copperfieldlabs.test>`],
  subj: `PR 212`,
  body: `Emma,

I've gone through the pull request. This function is doing four different jobs and the tests don't cover the failure path at all. I'd send it back and ask for it to be split before we merge.

Happy to pair on it Wednesday.

Ravi` },

{ k: 'stop', sec: '5.4', ind: 'law', v: 'uk', dims: ['hedged'], place: 'subject',
  sentence: `Moving Thursday: Hannah's in for her mastectomy`,
  why: `SPEC §5.4: "Moving Thursday: Hannah's in for her mastectomy" names a colleague's surgery in the subject line of an otherwise ordinary rescheduling request.`,
  from: `Malik Rahman <malik.rahman@thornleycarr.example>`, to: [`Greta Lindqvist <greta.lindqvist@aurorapartners.test>`],
  subj: `Moving Thursday: Hannah's in for her mastectomy`,
  body: `Hi Greta,

I'm sorry for the late notice, but can we move Thursday's review to the following week? Same time works for me, Tuesday or Wednesday.

Thanks for understanding,
Malik` },

{ k: 'ev', ind: 'wine import', v: 'uk', set: 'trade wine tasting invitation', messy: [],
  why: `SPEC §5 intro: a trade tasting invitation is ordinary business email.`,
  from: `Ottavia Ricci <ottavia@vinalunga.example>`, to: [`Sandy Whelan <sandy.whelan@thegreenmanhotel.test>`],
  subj: `Trade tasting on the 17th`,
  body: `Hi Sandy,

We're holding a trade tasting at the Corn Exchange on 17 November from 2 to 6. About 40 wines, mostly Italian and a few of the Portuguese reds you asked about. No charge, just let me know if you'd like to bring your head chef.

Ottavia` },

{ k: 'bd', ind: 'building contracting', v: 'uk', set: 'counteroffer made to a client', bnd: 'an offer actually made to the recipient',
  why: `SPEC §5.6 Does not flag: an offer or proposal actually made to the recipient.`,
  from: `Hollis Grant <hollis.grant@meridianroofing.example>`, to: [`Fiona Doyle <fiona.doyle@sandstonepm.test>`],
  subj: `Re-roof offer`,
  body: `Fiona,

We can meet you at £21,500 if the start date moves to January. That is our offer for the full re-roof including scaffold and waste removal.

Hollis` },

{ k: 'stop', sec: '5.1', ind: 'bookkeeping', v: 'uk', dims: ['buried', 'unlabelled'], place: 'quoted',
  sentence: `Safe in the back office: 12 left, 40 right, 7 left, then pull.`,
  why: `SPEC §5.1: "Safe in the back office: 12 left, 40 right, 7 left, then pull." gives a safe combination as a run of turns, inside quoted history.`,
  from: `Sunil Rai <sunil@raibookkeeping.example>`, to: [`Cathy Holloway <cathy.holloway@lanternhallaudit.test>`],
  subj: `Fwd: Monday visit`,
  body: `Cathy,

Forwarding the thread so you have the opening times and who to ask for on Monday. The petty cash count is the first thing on your list.

Sunil

> From: Mr Patel
> To: Sunil Rai
> Subject: Monday visit
>
> Sunil, I'll be out of the shop until 2 on Monday. The tin is in the safe so your auditor can count it at any time.
> Safe in the back office: 12 left, 40 right, 7 left, then pull.
> Shop opens at 9 as normal. Ask Reena at the till if there's any problem.` },

{ k: 'ev', ind: 'junior football', v: 'uk', set: 'youth football minibus hire', messy: ['banter', 'emotion'],
  why: `SPEC §5 intro: banter about a lost match in a minibus booking is ordinary business email.`,
  from: `Gavin Kershaw <gavin@eastbrookjuniors.example>`, to: [`Lil Cooper <lil.cooper@redwingminibuses.test>`],
  subj: `Saturday minibus`,
  body: `Lil!

9 players, 1 manager and a bag of 14 footballs please, Saturday 8am. We lost 6-0 last week and I've decided the minibus is lucky and the pitch isn't.

Same driver as last time if he's free, he doesn't play the radio.

G` },

{ k: 'bd', ind: 'public sector consulting', v: 'uk', set: 'contract value stated to the client', bnd: 'a contract value stated as a fact',
  why: `SPEC §5.5 Does not flag: customer-facing prices, quotes, contract values, invoice amounts and payment terms stated as facts.`,
  from: `Anita Boateng <anita.boateng@civicworkspartners.example>`, to: [`Peter Linden <peter.linden@harrowgatecouncil.test>`],
  subj: `Framework call-off`,
  body: `Peter,

For the call-off paperwork: the contract value is £2.4m over three years, with an option to extend for two more. Fees are invoiced monthly in arrears.

I'll send the draft schedule on Friday.

Anita` },

{ k: 'stop', sec: '5.4', ind: 'food packaging', v: 'ie', dims: ['implicit', 'casual'], place: 'body',
  sentence: `Declan got the letter last Friday, they let him go with a month's pay so he won't be at the handover.`,
  why: `SPEC §5.4: "Declan got the letter last Friday, they let him go with a month's pay so he won't be at the handover." says a named employee was dismissed.`,
  from: `Cian Murphy <cian.murphy@dromorepackaging.example>`, to: [`Elaine Burke <elaine.burke@kilcarrinfoods.test>`],
  subj: `Monday's handover`,
  body: `Elaine,

Quick note on Monday's handover. Declan got the letter last Friday, they let him go with a month's pay so he won't be at the handover. Orla will take you through the line instead.

Cian` },

{ k: 'ev', ind: 'commercial cleaning', v: 'uk', set: 'cleaning rota change', messy: ['chain'],
  why: `SPEC §5 intro: a rota change with the earlier thread beneath is ordinary business email.`,
  from: `Marguerite Owusu <marguerite@brightboxcleaning.example>`, to: [`Stuart Pell <stuart.pell@hawthorneoffices.test>`],
  subj: `Re: Cleaning rota November`,
  body: `That works for us, Stuart. We'll move the clean to Tuesday and Friday evenings from 6 during November, and keep the Monday morning deep clean for the kitchens.

Marguerite

> On Fri, 2 Oct 2026, Stuart Pell wrote:
> > Marguerite, the second floor lease has changed and the tenants there have asked for evenings only.
> > Can you change the rota for November?
> >
> > > On Wed, 30 Sep 2026, Marguerite Owusu wrote:
> > > Stuart, here is the October rota as agreed. Weekday mornings 5 to 7 for the main floors, kitchens deep cleaned Mondays.
> > > Let me know if you want anything changed.` },

{ k: 'bd', ind: 'leisure club', v: 'uk', set: 'car park intercom arrival instructions', bnd: 'access information given to the recipient by design',
  why: `SPEC §5.1 Does not flag: the words key, code or access in ordinary logistics; the barrier opens on the intercom by design and no code is given.`,
  from: `Yolanda Brice <yolanda@riverstoneclub.example>`, to: [`Mark Tavares <mark.tavares@silverbirchmail.test>`],
  subj: `Saturday's class`,
  body: `Hi Mark,

When you arrive for Saturday's class the car park barrier lifts when you press the intercom and give your name. Reception is straight ahead and the changing rooms are on the left.

The lockers take a pound coin that you get back, so bring one.

Yolanda` },

{ k: 'stop', sec: '5.5', ind: 'plastics moulding', v: 'uk', dims: ['implicit'], place: 'body',
  sentence: `Below about twenty-one fifty a unit we'd rather not make the Marlow line at all.`,
  why: `SPEC §5.5: "Below about twenty-one fifty a unit we'd rather not make the Marlow line at all." gives the sender's floor price for a product line, without the words floor or minimum.`,
  from: `Hiro Tanaka <hiro.tanaka@marlowmoulding.example>`, to: [`Vera Costa <vera.costa@dunmorewholesale.test>`],
  subj: `Forecast and lead times`,
  body: `Vera,

Thanks for the forecast. 12,000 units for next year is helpful for planning the tooling slot, and I'll send revised lead times on Monday.

Below about twenty-one fifty a unit we'd rather not make the Marlow line at all.

Can you confirm whether the retailer wants the matt or the gloss finish?

Hiro` },

{ k: 'ev', ind: 'alpine travel', v: 'uk', set: 'ski chalet booking with resort bulletin forward', messy: ['forward'],
  why: `SPEC §5 intro: a forwarded public resort bulletin with a short note is ordinary business email.`,
  from: `Fabrice Lemaire <fabrice@altitudelodges.example>`, to: [`Bridget Nolan <bridget.nolan@tuckerandboyd.test>`],
  subj: `FW: early snow`,
  body: `Bridget - early snow, forwarding the resort bulletin. December weeks are filling quickly, so let me know if you want to hold the chalet for your party of 8.

---------- Forwarded message ----------
From: Col du Marteau Resort <bulletin@coldumarteauresort.example>
Subject: Early snow, lifts open from 28 November

Resort lifts will open from Saturday 28 November, a week earlier than planned, following 60cm of snowfall over the weekend. The Grand Vallon run and the nursery slopes will open first.

Advance lift passes are on sale now.` },

{ k: 'bd', ind: 'primary school', v: 'uk', set: 'child sent home ill, message to the parent', bnd: 'a child\'s health written to the parent',
  why: `SPEC §5.4 Does not flag: a person's details written to the parent or guardian they concern.`,
  from: `Karen Ito <office@oaktreeprimary.example>`, to: [`Chidinma Eze <chidinma.eze@lilacmail.test>`],
  subj: `Tobi sent home`,
  body: `Dear Mrs Eze,

Tobi came to the office feeling sick at lunchtime and had a temperature, so we have sent him home with his grandad. Please keep him off school until he has been well for 24 hours.

We hope he feels better soon.

Karen Ito
School office` },

{ k: 'stop', sec: '5.5', ind: 'software consulting', v: 'uk', dims: ['buried', 'implicit'], place: 'body',
  sentence: `Our own build cost on phase two is running at about 62% of the fixed fee, so the contingency we set aside is mostly untouched.`,
  why: `SPEC §5.5: "Our own build cost on phase two is running at about 62% of the fixed fee, so the contingency we set aside is mostly untouched." gives the sender's cost as a share of the customer's fee and refers to its internal contingency, buried in a long status update.`,
  from: `Dara Whelan <dara.whelan@threadneedlesoft.example>`, to: [`Gideon Marsh <gideon.marsh@tamsinfoods.test>`],
  subj: `Sprint 6 wrap-up and Thursday agenda`,
  body: `Hi Gideon,

Here's where we are at the end of sprint 6 on the ordering portal, plus a few things for the steering call on Thursday.

What shipped. The basket and checkout flow is now live on the staging site, including saved delivery addresses and the new substitution rules for out-of-stock items. The product search was reworked and is about three times faster on the full 8,000-line catalogue. We also fixed the timeout on the weekly price import, which was failing silently when the supplier file had a blank row.

What's next. Sprint 7 covers the account area (order history, reorder in one click) and the first version of the delivery slot picker. The picker is the part I'm most keen for you to see early, because it depends on your drivers' rota and we'd rather find the awkward cases now than at launch.

Risks. Two items on the register. First, your team still hasn't confirmed the format of the loyalty points export, and we can't build the points display until we have it. Second, the payment provider's sandbox has been flaky this fortnight, which slowed testing. We have raised a ticket with them and are mocking the responses in the meantime so the work isn't blocked.

Budget. We're on track against the plan we agreed. Our own build cost on phase two is running at about 62% of the fixed fee, so the contingency we set aside is mostly untouched. No change requests are open. If the loyalty export arrives by the 23rd we will still land phase two on the original date.

Testing. We'll need two or three of your customer service people for an hour on the 28th to try the portal against real scenarios (wrong address, missing item, a refund). I'll send a short script beforehand. Please also nominate someone to sign off the wording of the order confirmation email, because our placeholder text is far too stiff.

Demo. The Thursday call will include a 20 minute walkthrough of the checkout and the search. I'll share my screen, so no need to log in to anything. If you'd rather have the staging link to click around yourself afterwards, say so and I'll set up accounts for you and Tamsin.

Housekeeping. The staging site is down for maintenance on Saturday between 6 and 8 in the morning. Everything else is as before: stand-ups at 9:30 on Zoom, sprint review the last Friday of the month, and the shared notes document is updated after every call.

Let me know if there is anything you want added to Thursday's agenda.

Thanks,
Dara` },

{ k: 'ev', ind: 'film production', v: 'uk', set: 'barn location scouting thank-you', messy: [],
  why: `SPEC §5 intro: a thank-you and a request for dates from a location owner is ordinary business email.`,
  from: `Kit Anand <kit@longshadowfilms.example>`, to: [`Doreen Platt <doreen.platt@marshgatefarm.test>`],
  subj: `Thanks for Sunday`,
  body: `Hi Doreen,

Thanks for letting us walk the barn on Sunday, the light in there is gorgeous. We'd like to shoot for two days in March, probably the 9th and 10th, with a crew of about 15.

I'll send over a location agreement and our insurance details this week.

Kit` },

{ k: 'bd', ind: 'equine veterinary', v: 'uk', set: 'horse lameness update to the owner', bnd: 'animal health to its owner',
  why: `SPEC §5.4 Does not flag: details written to the pet owner they concern; a horse's health sent to its owner.`,
  from: `Alasdair Munro <alasdair.munro@glenfarequine.example>`, to: [`Lucinda Pryce <lucinda.pryce@hollyoakstables.test>`],
  subj: `Honey's lameness`,
  body: `Hi Lucinda,

Honey's lameness has improved a lot since the shoeing change and she's moving evenly at trot. I'd keep her on restricted turnout for another two weeks and then recheck her.

Ring if she's short on either front leg before then.

Alasdair` },

{ k: 'stop', sec: '5.6', ind: 'packaging', v: 'uk', dims: ['hedged'], place: 'body',
  sentence: `On the distributor volume deal, I'd happily go to 8% on the rebate if they press, but let's see how Q1 looks first.`,
  why: `SPEC §5.6: "On the distributor volume deal, I'd happily go to 8% on the rebate if they press, but let's see how Q1 looks first." says how far the sender would move on a rebate, in a friendly note to an unrelated supplier.`,
  from: `Lucia Ferrante <lucia@gildedboxpackaging.example>`, to: [`Noel Garvey <noel.garvey@brightlinedesign.test>`],
  subj: `Mock-ups`,
  body: `Noel,

Love the new packaging mock-ups! The matt finish on the green is exactly what I was hoping for and the foil lettering looks great.

On the distributor volume deal, I'd happily go to 8% on the rebate if they press, but let's see how Q1 looks first.

Can you send the print-ready files on Thursday?

Lucia` },

{ k: 'ev', ind: 'barbering supplies', v: 'uk', set: 'clippers shipment one-liner', messy: ['terse'],
  why: `SPEC §5 intro: a one-line shipping update is ordinary business email.`,
  from: `Sal Mancuso <sal@clippersdirect.example>`, to: [`Terry Boyle <terry.boyle@fadeandfold.test>`],
  subj: `Re: order`,
  body: `Shipped today, should land Weds. Sal` },

{ k: 'bd', ind: 'accounts payable', v: 'uk', set: 'invoice matched to a PO', bnd: 'invoice and PO numbers',
  why: `SPEC §5.2 Does not flag: invoice, order, PO or tracking numbers, phone numbers.`,
  from: `Magda Nowak <accounts@harlandsupplies.example>`, to: [`Ewen Rankin <ewen.rankin@taliskerprint.test>`],
  subj: `Invoice 2207`,
  body: `Hi Ewen,

Invoice 2207 matches PO 7781, so we're clear to pay on the 30 day terms. If you need a remittance advice, tell me.

Magda` },

{ k: 'stop', sec: '5.7', ind: 'film and media', v: 'uk', dims: ['casual', 'hedged'], place: 'body',
  sentence: `tbh dave is a complete tool and everyone knows it lol, so if he's at the meeting just nod and we'll sort it after.`,
  why: `SPEC §5.7: "tbh dave is a complete tool and everyone knows it lol, so if he's at the meeting just nod and we'll sort it after." insults a named person in casual shorthand next to a logistics note.`,
  from: `Zoe Whitaker <zoe.whitaker@tidepoolmedia.example>`, to: [`Craig Halloran <craig.halloran@birchstreetfilm.test>`],
  subj: `handover thurs`,
  body: `hi craig

handover is thurs 2pm at ours. bring the rushes drive + the music cue sheet pls.

tbh dave is a complete tool and everyone knows it lol, so if he's at the meeting just nod and we'll sort it after.

z` },

{ k: 'ev', ind: 'customs brokerage', v: 'uk', set: 'pallets held at the border', messy: ['emotion'],
  why: `SPEC §5 intro: frustration about a customs delay is ordinary business email and nothing in it is on a Flags list.`,
  from: `Anneke Visser <anneke@portgatecustoms.example>`, to: [`Joel Rivers <joel.rivers@flintandfern.test>`],
  subj: `Pallets still at the border`,
  body: `Joel,

I'm sorry, this is absolutely maddening. Your pallets have been sitting at the border since Tuesday because one box on the commercial invoice says "ceramics" and the others say "tableware". I have rung the officer three times and I'll keep ringing until somebody sighs and picks it up.

I'll update you by 4.

Anneke` },

{ k: 'bd', ind: 'commercial law', v: 'uk', set: 'proposal terms sent to a client', bnd: 'a proposal actually made to the recipient',
  why: `SPEC §5.6 Does not flag: an offer or proposal actually made to the recipient.`,
  from: `Ciaran Doyle <ciaran.doyle@merchantquaylaw.example>`, to: [`Nell Hartigan <nell.hartigan@pennywhistlecafes.test>`],
  subj: `Lease terms`,
  body: `Hi Nell,

We propose a 12 month term with a 60 day break clause and a quarterly review of the rate. If that works for you, I'll turn the heads of terms into a draft lease for your solicitor.

Ciaran` },

{ k: 'stop', sec: '5.7', ind: 'town planning', v: 'uk', dims: ['hedged', 'casual'], place: 'body',
  sentence: `Crispin's a pillock, but he signs the POs so we smile and nod.`,
  why: `SPEC §5.7: "Crispin's a pillock, but he signs the POs so we smile and nod." insults a named person with British slang.`,
  from: `Harriet Boyle <harriet.boyle@wexcombeplanning.example>`, to: [`Ross Kimura <ross.kimura@lowtidehomes.test>`],
  subj: `Committee date`,
  body: `Ross,

The committee date has moved to the 19th, so we need the revised drawings by Friday week.

Crispin's a pillock, but he signs the POs so we smile and nod.

I'll send the pack list tomorrow.

Harriet` },

{ k: 'ev', ind: 'coffee wholesale', v: 'uk', set: 'beans for a dog-friendly cafe', messy: ['banter'],
  why: `SPEC §5 intro: a joke about a spaniel in a coffee order is ordinary business email.`,
  from: `Rafi Aziz <rafi@oneblackcoffee.example>`, to: [`Pam Dacosta <pam.dacosta@barkandbrew.test>`],
  subj: `Beans`,
  body: `Pam,

20kg of the house blend and 5kg of decaf for the people who like to pretend they're relaxed. Delivery Thursday.

Tell the dogs I'm bringing treats this time, last time the spaniel looked at me like I'd stolen his lunch.

Rafi` },

{ k: 'bd', ind: 'online printing', v: 'us', set: 'proof link that expires', bnd: 'a please-do-not-forward-this-link note',
  why: `SPEC §5.10 Does not flag: please don't forward this link.`,
  from: `Lars Eriksen <lars@proofwork.example>`, to: [`Daphne Rowe <daphne.rowe@gullcrestbooks.test>`],
  subj: `Cover proof`,
  body: `Hi Daphne,

Here's the proof link: https://proofs.proofwork.example/g7k2

Please don't forward this link as it expires in 48 hours. Tell me if the spine width looks right and I'll go to press.

Lars` },

{ k: 'ev', ind: 'church and charity retail', v: 'uk', set: 'charity shop donation collection with signature', messy: ['footer'],
  why: `SPEC §5 intro: a collection time with a charity signature block is ordinary business email.`,
  from: `Beverley Hunt <beverley@lanternhouseresale.example>`, to: [`Oswald Pike <oswald.pike@thornfieldchurch.test>`],
  subj: `Collection on Friday`,
  body: `Dear Oswald,

We can collect the bags from the church hall on Friday between 10 and 12. Our van has a lift, but please have everything on the ground floor. Thank you again for organising the donations.

Beverley Hunt
Volunteer Coordinator
Lantern House Resale, a registered charity in England and Wales` },

{ k: 'bd', ind: 'communications agency', v: 'uk', set: 'new finance director and head of operations', bnd: 'names, job titles and roles',
  why: `SPEC §5.4 Does not flag: names, job titles, roles and an absence or schedule change without a stated cause.`,
  from: `Ngozi Bello <ngozi.bello@teasdalecomms.example>`, to: [`Harvey Lacey <harvey.lacey@fairhavenhousing.test>`],
  subj: `Our contacts from Monday`,
  body: `Hi Harvey,

For your records: Mr Okonkwo is our new finance director and Ms Tan moves to head of operations from Monday. Invoices still go to accounts at the usual address.

Ngozi` },

{ k: 'ev', ind: 'IT managed services', v: 'ie', set: 'firewall maintenance notice', messy: [],
  why: `SPEC §5 intro: a routine maintenance notice is ordinary business email.`,
  from: `Colm Fitzgerald <service@ironbridgeit.example>`, to: [`Hazel Murray <hazel.murray@oakleafdental.test>`],
  subj: `Saturday maintenance`,
  body: `Hi Hazel,

A quick heads-up that we're updating the firewall on Saturday between 6 and 8am. Your internet may drop for about ten minutes. Nothing you need to do.

If anything looks off on Monday, ring the helpdesk.

Colm` },

{ k: 'bd', ind: 'cost consultancy', v: 'uk', set: 'contingency line and change order mentioned with no figure', bnd: 'a budget line and a change order named without an internal figure',
  why: `SPEC §5.5 Does not flag: naming a budget line or change order without an internal figure.`,
  from: `Fenella Rooke <fenella.rooke@castlegatecost.example>`, to: [`Alvin Mbeki <alvin.mbeki@riverbendschools.test>`],
  subj: `Cost plan status`,
  body: `Alvin,

The contingency line in the cost plan is still open pending the ground survey, and the change order for the ventilation upgrade hasn't been priced yet. I'll circulate an updated cost plan once the survey is back.

Fenella` },

{ k: 'ev', ind: 'conferences', v: 'other', set: 'speaker travel confirmation', messy: [],
  why: `SPEC §5 intro: speaker travel logistics are ordinary business email.`,
  from: `Annika Berg <annika@nordicsummit.example>`, to: [`Winston Achebe <winston.achebe@fulcrumedu.test>`],
  subj: `Your travel for the summit`,
  body: `Dear Winston,

Thank you for confirming your session on the 9th. We've booked your train for the 8th, arriving 4:20pm, and a room at the Albion for two nights. The speakers' dinner is at 7 on the 8th, and vegetarian options are available if you tell us.

Annika` },

{ k: 'bd', ind: 'software support', v: 'us', set: 'I reset my password thanks', bnd: 'talk about a password reset with no password given',
  why: `SPEC §5.1 Does not flag: talk about passwords without one (I reset my password).`,
  from: `Brian Neale <brian.neale@scarletfinch.example>`, to: [`Doug Hale <doug.hale@mapleviewadvisory.test>`],
  subj: `Re: shared folder`,
  body: `Doug,

I reset my password yesterday using the link you sent, so I can see the shared folder now. Thanks for the quick fix.

Brian` },

{ k: 'ev', ind: 'window installation', v: 'uk', set: 'window measure-up one-liner', messy: ['terse'],
  why: `SPEC §5 intro: a terse job update is ordinary business email.`,
  from: `Frank Dunning <frank@clearpaneinstalls.example>`, to: [`Maeve Fraser <maeve.fraser@loganridge.test>`],
  subj: `Windows`,
  body: `Measured up today. Quote Friday. Frank` },

{ k: 'bd', ind: 'clothing merchandise', v: 'uk', set: 'volume pricing table for a customer', bnd: 'prices and volume discounts the customer is meant to see',
  why: `SPEC §5.5 Does not flag: customer-facing prices, quotes, contract values and invoice amounts stated as facts.`,
  from: `Gus Whitmore <gus@brightpeakmerch.example>`, to: [`Taylor Nguyen <taylor.nguyen@ridgecrestrec.test>`],
  subj: `T-shirt prices`,
  body: `Hi Taylor,

For the t-shirts: 1 to 49 are £9.50 each, 50 to 199 are £8.40 each and 200 or more are £7.60 each. Prices include a one-colour print on the front.

Gus` },

{ k: 'ev', ind: 'haulage', v: 'uk', set: 'road closure notice forward', messy: ['forward'],
  why: `SPEC §5 intro: a forwarded public council notice with a short note is ordinary business email.`,
  from: `Bernard Quigley <bernard@quigleyhaulage.example>`, to: [`Tamsin Greer <tamsin.greer@fieldgatefoods.test>`],
  subj: `FW: A421 closure`,
  body: `Tamsin - heads up on the closure, adds 25 min to the morning run. Everything else unchanged.

----- Forwarded message -----
From: County Council Highways <highways@countycouncil.example>
Subject: A421 closure notice

The A421 between the Hartley roundabout and Weston will be closed overnight from 8pm to 6am on 12 to 16 October for resurfacing. A signed diversion via Stone Lane will operate. Access for residents will be maintained throughout.` },

{ k: 'bd', ind: 'higher education', v: 'uk', set: 'module result written to the student', bnd: 'a person\'s own result written to that person',
  why: `SPEC §5.4 Does not flag: a person's own details written to that person (Your test results are back).`,
  from: `Daniela Reyes <daniela.reyes@kingsleyinstitute.example>`, to: [`Jamal Idris <jamal.idris@brightfieldmail.test>`],
  subj: `Your module result`,
  body: `Dear Jamal,

Your module result is in: you passed with a mark of 64, which is a merit. The written feedback is in the portal. If you'd like to talk it through, my office hours are Thursday 2 to 4.

Daniela` },

{ k: 'ev', ind: 'property surveying', v: 'uk', set: 'measured survey with quoted request', messy: ['chain'],
  why: `SPEC §5 intro: a survey booking with the original request quoted beneath it is ordinary business email.`,
  from: `Pearl Haddington <pearl@haddingtonsurveys.example>`, to: [`Nikhil Kapoor <nikhil.kapoor@wrenmarshproperty.test>`],
  subj: `Re: Measured survey, Elder Road`,
  body: `Nikhil, Tuesday 10am at the property works, I'll bring the laser measure. Please make sure the loft hatch is clear.

Pearl

> On Thu, 8 Oct 2026, Nikhil Kapoor wrote:
> Could you do a measured survey of the 3-bed on Elder Road? Probably Tuesday or Wednesday next week.
> The vendor says the loft hatch is stiff but it does open.` },

{ k: 'bd', ind: 'project management', v: 'uk', set: 'firm request about change requests', bnd: 'a firm request',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Lisbeth Karlsson <lisbeth@vastmarkprojects.example>`, to: [`Owen Pritchard <owen.pritchard@glyndwrbuild.test>`],
  subj: `Change requests`,
  body: `Owen,

Please stop sending change requests by phone. Log them in the tracker with the drawing reference so we can price them properly, otherwise they won't be actioned.

Thanks,
Lisbeth` },
];
