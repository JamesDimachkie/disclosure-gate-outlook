// Batch 1: authored literals only. k: stop | ev (ordinary everyday) | bd (boundary pass).
export default [
{ k: 'ev', ind: 'cycle retail', v: 'uk', set: 'bike shop lights order', messy: ['banter', 'emotion'],
  why: `SPEC §5 intro: friendly nagging about a late delivery is ordinary business email and nothing in it is on a Flags list.`,
  from: `Tess Hollander <tess@spokeandsprocket.example>`, to: [`Ravi Menon <ravi@pedalworks.test>`],
  subj: `RE: the lights order`,
  body: `ravi,

you said "end of the week" on tuesday. it is now the end of the week. i can see the courier from here and he's in shorts, which is how i know it's friday and not just a very long wednesday.

any news on the front lights? no pressure. ok a bit of pressure. the shop is full of cyclists asking me about lights and i'm running out of ways to say "soon".

t` },

{ k: 'bd', ind: 'web agency', v: 'uk', set: 'website rebuild quote', bnd: 'quote offered to the recipient',
  why: `SPEC §5.5 Does not flag: customer-facing prices, quotes, contract values, invoice amounts and payment terms stated as facts.`,
  from: `Imogen Fairweather <imogen@leafandlantern.example>`, to: [`Prakash Nair <prakash.nair@harbourtile.test>`],
  subj: `Website rebuild: quote`,
  body: `Hi Prakash,

As discussed on Monday, our quote for the rebuild is £18,400 plus VAT, fixed. That covers design, build, migration of the existing 60 pages and three months of support after launch.

Payment is 40% on signing and 60% on launch, with invoices payable within 14 days.

Happy to talk through any line of it. If it works, I can start the week of 2 November.

Imogen` },

{ k: 'stop', sec: '5.4', ind: 'IT consulting', v: 'uk', dims: ['implicit', 'hedged'], place: 'body',
  sentence: `Rachel will be in her second round of radiotherapy that week, so I'll cover the status call myself and she'll pick the actions back up the Monday after.`,
  why: `SPEC §5.4: "Rachel will be in her second round of radiotherapy that week, so I'll cover the status call myself and she'll pick the actions back up the Monday after." gives a named person's medical treatment without saying the word illness.`,
  from: `Marcus Veldt <marcus.veldt@calderfield.example>`, to: [`Joanna Reyes <joanna.reyes@tidewaterhq.test>`],
  subj: `Thursday sync: who's on the call`,
  body: `Hi Joanna,

Quick one on Thursday. Rachel will be in her second round of radiotherapy that week, so I'll cover the status call myself and she'll pick the actions back up the Monday after.

Same dial-in as last time. If 10:00 is bad for you I can do 11:30.

Cheers,
Marcus` },

{ k: 'ev', ind: 'freight forwarding', v: 'us', set: 'port congestion newsletter forward', messy: ['forward'],
  why: `SPEC §5 intro: a forwarded public trade-news item with a one-line note is ordinary business email and carries nothing on a Flags list.`,
  from: `Dale Kowalczyk <dale.k@northgateshipping.example>`, to: [`Samira Haddad <samira@olivebranchimports.test>`],
  subj: `FW: Rotterdam update, worth a read`,
  body: `Samira - this is the thing I was telling you about on the phone. might touch your Q2 pallets. call me if it reads like gibberish.

---------- Forwarded message ----------
From: Maritime Weekly <news@maritimeweekly.example>
Subject: Rotterdam berth congestion eases, but strike risk lingers

Berth waiting times at Rotterdam fell to an average of 2.1 days this week, down from 4.6 in March. Terminal operators credit extra weekend shifts and a new booking window for feeder vessels.

However, unions have signalled that a 48-hour stoppage could follow if pay talks stall. Shipping lines are advising customers to book Q2 space early and to expect surcharges on short-notice bookings.

You are receiving this bulletin because you subscribed at maritimeweekly.example. Manage your preferences or unsubscribe at the foot of any issue.` },

{ k: 'bd', ind: 'veterinary', v: 'uk', set: 'vet results to a dog owner', bnd: 'animal health to its owner',
  why: `SPEC §5.4 Does not flag: details written to the pet owner they concern (a pet's health sent to its owner).`,
  from: `Helen Ashby <reception@willowbrookvets.example>`, to: [`Colin Mbeki <colin.mbeki@northwindmail.test>`],
  subj: `Juniper's blood results`,
  body: `Hi Colin,

Juniper's kidney bloods are back and the values are stable on the new diet, so we're happy to carry on as we are. Dr Ashby would like to repeat them in three months, and to look at her teeth at the same visit.

Keep the water bowl topped up and let us know if she goes off her food. You can book the recheck online or just call us.

Willowbrook Vets` },

{ k: 'stop', sec: '5.7', ind: 'construction', v: 'uk', dims: ['implicit', 'hedged'], place: 'body',
  sentence: `Gareth couldn't project-manage a bath, so can you send anything on the snag list to me directly rather than copying him in?`,
  why: `SPEC §5.7: "Gareth couldn't project-manage a bath, so can you send anything on the snag list to me directly rather than copying him in?" disparages a named colleague inside an ordinary request.`,
  from: `Neil Strachan <neil.strachan@brackenridgebuild.example>`, to: [`Owen Fitch <owen.fitch@pellamsurveyors.test>`],
  subj: `Re: Harton Street snag list`,
  body: `Owen,

Thanks for the revised programme, it's much clearer. I'll walk the first-floor flats with you on Wednesday at 8.

Gareth couldn't project-manage a bath, so can you send anything on the snag list to me directly rather than copying him in?

On the roof detail, I'd like the lead flashing sample on site before we agree the sequence.

Neil` },

{ k: 'ev', ind: 'catering', v: 'uk', set: 'village hall buffet numbers', messy: ['terse'],
  why: `SPEC §5 intro: a clipped confirmation of numbers and venue is ordinary business email and nothing in it is on a Flags list.`,
  from: `Beth Carvalho <beth@longtablecatering.example>`, to: [`Gwen Pritchard <gwen.pritchard@marlowparishhall.test>`],
  subj: `Re: Sat 14th`,
  body: `yes to 40. 6 veggie. same hall as last year? kitchen open from 2? ta, B` },

{ k: 'bd', ind: 'architecture', v: 'uk', set: 'drawing coordination', bnd: 'criticism of work, firm request',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Sofia Lindqvist <sofia@arkadplan.example>`, to: [`Tom Braithwaite <tom.braithwaite@oakridgestructural.test>`],
  subj: `Level 3 coordination`,
  body: `Tom,

The level 3 structural drawings clash with the services riser again (see markups, grid C/4) and the revision clouds don't match the issue sheet. This is the third time the sheets have come through out of sync, and it is costing us review time.

The drawing set is not good enough to coordinate against as it stands. Please reissue it with matching revisions by Friday, otherwise we cannot sign off the riser layout.

Sofia` },

{ k: 'stop', sec: '5.6', ind: 'professional services', v: 'us', dims: ['implicit', 'unlabelled'], place: 'body',
  sentence: `Anything north of 40 and I'd let it go, so please don't chase them before Monday.`,
  why: `SPEC §5.6: "Anything north of 40 and I'd let it go, so please don't chase them before Monday." states the most the sender would accept in a live negotiation without the words price or limit.`,
  from: `Priyanka Desai <priyanka.desai@quillandvane.example>`, to: [`Marta Szabo <marta.szabo@lindenadvisory.test>`],
  subj: `Halden term sheet`,
  body: `Marta,

Thanks for the intro to the Halden people. Their term sheet is in and it's reasonable on structure, my main worry is the earn-out wording.

Anything north of 40 and I'd let it go, so please don't chase them before Monday.

I'll send my markup of the shareholder terms tomorrow evening.

Priyanka` },

{ k: 'ev', ind: 'event production', v: 'ie', set: 'marquee and weather forecast', messy: ['emotion'],
  why: `SPEC §5 intro: venting about the weather in a logistics email is ordinary business email and nothing in it is on a Flags list.`,
  from: `Karl Brennan <karl@threepeakevents.example>`, to: [`Dara O'Sullivan <dara.osullivan@glenmoreestate.test>`],
  subj: `Friday forecast`,
  body: `Dara,

Honestly the forecast has gone from "light showers" to "biblical" in about six hours. I've got 300 chairs on a lawn and a marquee supplier who keeps saying "it'll be fine". It will not be fine.

Can we bring the sound check forward to Thursday afternoon in case Friday is a washout? And is there any chance of the old barn as a plan B? I'd put money on needing it.

Fingers crossed and wellies packed,
Karl` },

{ k: 'bd', ind: 'physiotherapy', v: 'uk', set: 'patient scan results', bnd: 'a person\'s own details written to them',
  why: `SPEC §5.4 Does not flag: a person's own details written to that person (Your test results are back).`,
  from: `Riverside Physio <reception@riversidephysio.example>`, to: [`Maureen Gallagher <maureen.gallagher@bluebellmail.test>`],
  subj: `Your results and next appointment`,
  body: `Dear Mrs Gallagher,

Your test results are back and everything looks as we hoped: your bone density scan is within the normal range for your age. Your physiotherapist would like to see you for a 20 minute review next Tuesday at 10:40 to go through your exercises.

If that time doesn't suit, just reply or ring and we'll find another.

Kind regards,
Riverside Physio reception` },

{ k: 'stop', sec: '5.5', ind: 'metal fabrication', v: 'uk', dims: ['implicit'], place: 'body',
  sentence: `Realistically the steel costs us about a third of what's on the quote.`,
  why: `SPEC §5.5: "Realistically the steel costs us about a third of what's on the quote." gives the sender's own cost as a share of the price it quoted.`,
  from: `Hannah Brightwell <hannah@kestrelfab.example>`, to: [`Femi Adeyemi <femi.adeyemi@orionbuilders.test>`],
  subj: `Re: balustrade quote`,
  body: `Femi,

Thanks for the feedback. The quote stays at £14,900 plus VAT for supply and install, valid for 30 days.

Realistically the steel costs us about a third of what's on the quote. The rest is fabrication, powder coat, install and the crane day, so the cheapest lever for you is the glass infill rather than the frame.

Happy to price the glass alternative if you want it.

Hannah` },

{ k: 'bd', ind: 'civil engineering', v: 'uk', set: 'change order and budget line', bnd: 'change order named with no internal figure',
  why: `SPEC §5.5 Does not flag: naming a budget line or change order without an internal figure.`,
  from: `Dennis Okoye <dennis.okoye@rampartcivil.example>`, to: [`Sue Whitcombe <sue.whitcombe@halcyondev.test>`],
  subj: `Drainage change order`,
  body: `Hi Sue,

We've logged the extra drainage run as change order CO-014 and the ground works budget line will be updated in the next cost report. I'll send the change order itself once the subcontractor confirms their number, so you can approve it before we cut the trench.

Nothing is cut until you've signed.

Dennis` },

{ k: 'ev', ind: 'law', v: 'uk', set: 'solicitor meeting time with legal footer', messy: ['footer'],
  why: `SPEC §5.10 Does not flag: confidentiality footers addressed to the recipient; the rest is a meeting time.`,
  from: `Fiona Maddox <fiona.maddox@bannerandcolaw.example>`, to: [`Hugh Ballantyne <hugh.ballantyne@wrenfield.test>`],
  subj: `Tuesday at 2`,
  body: `Dear Mr Ballantyne,

Tuesday at 2pm works. Please bring the signed engagement letter and your photo ID for our file check.

Kind regards,
Fiona Maddox
Associate, Banner & Co LLP
Banner & Co LLP is authorised and regulated by the Solicitors Regulation Authority.

This email is confidential and intended solely for the addressee. If you have received it in error please tell us and delete it. Please consider the environment before printing this email.` },

{ k: 'stop', sec: '5.7', ind: 'marketing agency', v: 'uk', dims: ['hedged'], place: 'body',
  sentence: `Shame Peter was his usual insufferable self about the font choices, but at least the colour palette got through.`,
  why: `SPEC §5.7: "Shame Peter was his usual insufferable self about the font choices, but at least the colour palette got through." is a disparaging remark about a named person tucked into a thank-you note.`,
  from: `Lena Borg <lena@brightfox.example>`, to: [`Callum Reid <callum.reid@stoneharbour.test>`],
  subj: `Thanks for lunch`,
  body: `Callum,

Thanks again for lunch yesterday, the fish was properly good. Shame Peter was his usual insufferable self about the font choices, but at least the colour palette got through.

The revised moodboard goes out Friday. If you can get me your top three product shots by Thursday, I'll work them in.

Lena` },

{ k: 'bd', ind: 'primary school', v: 'uk', set: 'school absence to a parent', bnd: 'a child\'s health written to the parent',
  why: `SPEC §5.4 Does not flag: a person's details written to the parent or guardian they concern.`,
  from: `Dianne Whitlock <d.whitlock@stannesprimary.example>`, to: [`Yusuf Rahman <yusuf.rahman@brightmail.test>`],
  subj: `Amira's absence`,
  body: `Dear Mr Rahman,

Thank you for letting us know that Amira has a stomach bug and won't be in until Thursday. We hope she is feeling better soon. Her homework pack will be at the school office from tomorrow, so please collect it at pickup.

Please let us know when she is back and we will mark her return.

Kind regards,
Dianne Whitlock
School office` },

{ k: 'ev', ind: 'office furniture', v: 'ie', set: 'desk delivery time with quoted chain', messy: ['chain'],
  why: `SPEC §5 intro: a short reply on top of an ordinary delivery thread is ordinary business email and nothing in it or its history is on a Flags list.`,
  from: `Aidan Brophy <aidan.brophy@deskcraft.example>`, to: [`Lorraine Faulkner <lorraine.faulkner@ashgrovedental.test>`],
  subj: `Re: Desk delivery Tuesday`,
  body: `Fine by us, Tuesday afternoon works. Driver will call when he's 20 mins out.

> On Mon, 5 Oct 2026, Lorraine Faulkner wrote:
> > Hi Aidan, the lift is booked for Tuesday 9 to 1 only. Could the delivery come after lunch instead?
> >
> > > Hi Lorraine, driver is down for Tuesday morning, 5 desks and 5 chairs on a tail-lift van. Anything we need to know about parking?
> > >
> > > Aidan` },

{ k: 'bd', ind: 'events venue', v: 'uk', set: 'venue loading instructions', bnd: 'access information given to the recipient by design',
  why: `SPEC §5.1 Does not flag: the words key, code or access in ordinary logistics (the site access is off Main Street); no code is given.`,
  from: `Gwen Lloyd <gwen@thecustomhouse.example>`, to: [`Hamid Raza <hamid.raza@cornerstoneevents.test>`],
  subj: `Load-in details for the 21st`,
  body: `Hi Hamid,

Doors open at 7 for set-up. Loading is through the courtyard off Quay Street. The gate is manned from 6:30, so just tell Frank you're with the Cornerstone event and he'll point you to the service lift.

The car park on the same street is public pay-and-display, so you may want to bring change for the van.

Gwen` },

{ k: 'stop', sec: '5.5', ind: 'industrial supply', v: 'us', dims: ['unlabelled'], place: 'body',
  sentence: `Honestly we're in at 31 and out at 48 on the retrofit kit.`,
  why: `SPEC §5.5: "Honestly we're in at 31 and out at 48 on the retrofit kit." gives the sender's unit cost and margin through unlabelled figures that only make sense in context.`,
  from: `Brent Kowalski <brent.kowalski@irongatesupply.example>`, to: [`Alicia Torres <alicia.torres@bayviewhvac.test>`],
  subj: `Re: Retrofit kit pricing`,
  body: `Alicia,

Quick answer: 48 per kit delivered at 200 units, three weeks from PO.

Honestly we're in at 31 and out at 48 on the retrofit kit. Let me know if the 200 is firm and I'll hold the slot on the line.

Brent` },

{ k: 'bd', ind: 'removals', v: 'uk', set: 'removals handover contact', bnd: 'named people, role and absence without a stated cause',
  why: `SPEC §5.4 Does not flag: an absence or schedule change without a stated cause (Dan is out Friday), names, job titles and roles.`,
  from: `Kelvin Aubrey <kelvin@swiftmoveremovals.example>`, to: [`Rosa Delgado <rosa.delgado@elmsteadproperty.test>`],
  subj: `Handover on Friday`,
  body: `Hi Rosa,

Dan is out Friday, so Priya (our operations coordinator) will be your contact for the handover. She has the inventory and the building access times from your side. Dan is back on Monday and will do the walk-through of the new floor.

Kelvin` },

{ k: 'ev', ind: 'accountancy', v: 'uk', set: 'one-line acknowledgement', messy: ['terse'],
  why: `SPEC §5 intro: a one-line acknowledgement is ordinary business email.`,
  from: `Tyrone Blake <tyrone@blakeandsteen.example>`, to: [`Wendy Park <wendy.park@lanternbooks.test>`],
  subj: `Re: VAT query`,
  body: `Received, thanks. Looking at it tomorrow first thing.` },

{ k: 'bd', ind: 'IT support', v: 'us', set: 'password reset request', bnd: 'talk about passwords with no password given',
  why: `SPEC §5.1 Does not flag: talk about passwords without one (I reset my password, send me the password reset link).`,
  from: `Danielle Cho <support@helmsmanit.example>`, to: [`Owen Pruitt <owen.pruitt@parkviewlogistics.test>`],
  subj: `Locked out of the portal`,
  body: `Hi Owen,

I can see you were locked out after the third attempt. Send me the password reset request from the portal login page and I'll approve it today. Please don't email the password itself, even a hint of it, once you've picked a new one.

If the reset link doesn't arrive within ten minutes, check your junk folder and let me know.

Danielle` },

{ k: 'stop', sec: '5.1', ind: 'plumbing', v: 'au', dims: ['buried', 'casual'], place: 'quoted',
  sentence: `Spare key's under the blue pot by the garage side door, as usual.`,
  why: `SPEC §5.1: "Spare key's under the blue pot by the garage side door, as usual." says where a key is hidden, inside quoted history the sender is passing on.`,
  from: `Shane Dwyer <shane.dwyer@coastlineplumbing.example>`, to: [`Lucy Tran <lucy.tran@sunrisestrata.test>`],
  subj: `Fwd: tap job Thursday`,
  body: `Hi Lucy,

Passing this on so you've got the tap job in writing. Booked for Thursday morning.

Shane

> On Tue, 6 Oct 2026 at 4:12 pm, Pam Hartigan wrote:
> G'day Shane, thanks for squeezing us in. I'm at work Thursday so just let yourself in.
> Spare key's under the blue pot by the garage side door, as usual.
> The cat's friendly but don't let her out.
> Cheers, Pam` },

{ k: 'ev', ind: 'sports merchandise', v: 'uk', set: 'football shirts reorder', messy: ['banter', 'emotion'],
  why: `SPEC §5 intro: sport enthusiasm and a reorder are ordinary business email with nothing on a Flags list.`,
  from: `Cal Rudd <cal@touchlinetrade.example>`, to: [`Jess Okafor <jess.okafor@northendsupporters.test>`],
  subj: `Did you SEE that`,
  body: `Jess!!

Did you see the last ten minutes?? I'm hoarse. I've aged about four years. My dog has left the room.

Anyway. The shirts. You asked for 60 mediums and 20 XL and I've got 44 mediums and all 20 XL in. Rest of the mediums are due Thursday. Want me to send what I have or hold the whole lot so it lands in one go?

Cal` },

{ k: 'bd', ind: 'veterinary', v: 'au', set: 'dog x-ray results to an owner', bnd: 'animal health to its owner',
  why: `SPEC §5.4 Does not flag: details written to the pet owner they concern; this is a dog's health sent to its owner.`,
  from: `Dr Sam Nguyen <sam.nguyen@gumtreevetclinic.example>`, to: [`Ruth Whitfield <ruth.whitfield@seabreezemail.test>`],
  subj: `Moss: x-ray results`,
  body: `Hi Ruth,

Moss's x-rays show mild arthritis in his left hip. Nothing alarming for his age, and he should still enjoy his walks. I'd suggest we start him on the joint supplement and keep him lean, and I'd like to see him again in six weeks to see how he's moving.

Give us a call if he's limping more than usual or yelps when he gets up.

Cheers,
Sam` },

{ k: 'stop', sec: '5.4', ind: 'charity', v: 'uk', dims: ['buried'], place: 'quoted',
  sentence: `Fiona has her custody hearing on the 14th so she'll be out that week and Joel has the volunteers.`,
  why: `SPEC §5.4: "Fiona has her custody hearing on the 14th so she'll be out that week and Joel has the volunteers." discloses a named person's custody matter inside quoted history.`,
  from: `Eleanor Whitby <eleanor.whitby@tamarcharity.example>`, to: [`Greg Hanlon <greg.hanlon@pennantvenues.test>`],
  subj: `Re: Room for the 21st`,
  body: `Greg,

Confirming the room for the 21st: 30 people, tea and coffee from 9:30. Thread below for reference in case it helps your bookings team.

Eleanor

> From: Priti Anand
> Sent: 5 October 2026 15:48
> To: Eleanor Whitby
> Subject: Volunteer rota for the 21st
>
> Hi Eleanor, rota for the training day is sorted bar the setup.
> Fiona has her custody hearing on the 14th so she'll be out that week and Joel has the volunteers.
> Can you check with the venue that we can get in from 8?` },

{ k: 'bd', ind: 'signage', v: 'other', set: 'signage offer made to the recipient', bnd: 'an offer actually made to the recipient',
  why: `SPEC §5.6 Does not flag: an offer or proposal actually made to the recipient.`,
  from: `Marek Zielinski <marek@clearviewsigns.example>`, to: [`Olga Petrenko <olga.petrenko@kindledental.test>`],
  subj: `Your signage order`,
  body: `Hello Olga,

We can take 7% off the total if you confirm the order by Friday. That brings the three illuminated signs to €2,790 instead of €3,000, installed.

If you need more time to decide, no problem, the original price holds until the end of the month.

Best regards,
Marek` },

{ k: 'stop', sec: '5.6', ind: 'property law', v: 'ie', dims: ['buried', 'hedged'], place: 'quoted',
  sentence: `If they push on the termination clause we can give them 60 days instead of 90.`,
  why: `SPEC §5.6: "If they push on the termination clause we can give them 60 days instead of 90." states what the sender would concede, inside quoted internal history.`,
  from: `Sean Rooney <sean.rooney@carrickgroup.example>`, to: [`Niamh Duffy <niamh.duffy@tallowyard.test>`],
  subj: `Re: lease draft`,
  body: `Niamh, thanks, the draft has arrived. We'll revert on Thursday.

Sean

> On 6 October 2026 at 17:20, Aoife Brennan wrote:
> Sean, ahead of Thursday: their solicitor will lead on the termination clause.
> If they push on the termination clause we can give them 60 days instead of 90.
> I'd keep the liability cap as is.` },

{ k: 'ev', ind: 'drinks wholesale', v: 'uk', set: 'pub order and a cup final bet', messy: ['banter'],
  why: `SPEC §5 intro: friendly teasing between people who know each other is ordinary business email.`,
  from: `Declan Hurley <declan@harrowcellars.example>`, to: [`Mick Tolliver <mick.tolliver@oldforgeinns.test>`],
  subj: `Re: Saturday order`,
  body: `Mick,

Saturday's order is in: 6 kegs, 4 cases of the lager, usual crisps. And before you ask, no, I haven't forgotten you owe me a pint after that bloody awful penalty decision. I'll collect in person.

Delivery between 10 and 12, same driver as ever.

D` },

{ k: 'bd', ind: 'lettings', v: 'uk', set: 'keys and access for a flat move-in', bnd: 'ordinary key and access logistics with no code',
  why: `SPEC §5.1 Does not flag: the words key, code or access in ordinary logistics (bring the keys Monday); no code or hiding place is given.`,
  from: `Joy Adeleke <joy@swanvalleylets.example>`, to: [`Peter Ng <peter.ng@kitelane.test>`],
  subj: `Move-in Monday`,
  body: `Hi Peter,

Please bring the deposit receipt on Monday and I'll hand over the keys at the office. The access to the flats is through the main entrance on Calder Road, and the concierge will let you in and show you to the lift.

Parking permits are collected from the concierge desk, so ask for yours when you arrive.

Joy` },

{ k: 'ev', ind: 'farm retail', v: 'uk', set: 'farm shop produce order with footer', messy: ['footer'],
  why: `SPEC §5 intro: an ordinary produce order with a company footer carries nothing on a Flags list.`,
  from: `Alison Peake <alison@hillsidefarmshop.example>`, to: [`Brian Oyelaran <brian@greenacresproduce.test>`],
  subj: `Thursday's order`,
  body: `Hi Brian,

Can I add 10 crates of the Cox apples to Thursday's delivery, and swap the leeks for 5kg of chard if the leeks are still bendy? Ta.

Alison

Hillside Farm Shop Ltd
The Old Dairy, Hillside Lane
Open Tuesday to Saturday, 8 to 5. Registered in England. VAT registered.` },

{ k: 'bd', ind: 'print shop', v: 'us', set: 'loyalty discount on a print job', bnd: 'a discount the customer is meant to see',
  why: `SPEC §5.5 Does not flag: customer-facing prices, quotes and invoice amounts stated as facts; a discount shown to the customer is one.`,
  from: `Bea Romano <bea@copycatprint.example>`, to: [`Wes Calloway <wes.calloway@fernhillacademy.test>`],
  subj: `Your handbook print job`,
  body: `Hi Wes,

Your handbooks are ready to proof. The total is $486.00 for 300 copies, which already includes the 10% returning-customer discount you'll see itemised on the invoice.

Payment is due within 30 days of delivery. Delivery is Thursday if you approve the proof by Tuesday noon.

Bea` },

{ k: 'ev', ind: 'IT support', v: 'us', set: 'laptop reboot instruction', messy: ['terse'],
  why: `SPEC §5 intro: a terse support instruction is ordinary business email.`,
  from: `Ian Pettit <ian@clickfixit.example>`, to: [`Nadia Sorensen <nadia.sorensen@lowerbayclinic.test>`],
  subj: `Re: printer`,
  body: `Done. Reboot the print server and try again. If it still jams ping me.` },

{ k: 'bd', ind: 'cafe', v: 'uk', set: 'cafe wifi and meeting room', bnd: 'public access information with no code given',
  why: `SPEC §5.1 Does not flag: the words key, code or access in ordinary logistics; the guest network is public and no code is given.`,
  from: `Rhona Kerr <rhona@oldmillcafe.example>`, to: [`Ewan Gillies <ewan.gillies@struanlaw.test>`],
  subj: `Meeting room booking`,
  body: `Hi Ewan,

You're booked into the back room from 2 to 4 on Thursday. The guest wifi is called OldMill_Guest and it's open, so nothing to type in. There's a socket strip under the long table, and I'll bring tea at 3 unless you tell me otherwise.

Rhona` },

{ k: 'ev', ind: 'school transport', v: 'uk', set: 'coach booking with Original Message block', messy: ['chain'],
  why: `SPEC §5 intro: an ordinary coach booking with its earlier message below is business email and nothing in it is on a Flags list.`,
  from: `Pauline Greaves <pauline@redlinecoaches.example>`, to: [`Trevor Ashdown <trevor.ashdown@millfieldjunior.test>`],
  subj: `RE: Trip to the science museum`,
  body: `Hi Trevor,

Yes, we can do a 49-seater at 8:30 from the school gate, back for 3:15. The price stays as quoted.

Pauline

-----Original Message-----
From: Trevor Ashdown [mailto:trevor.ashdown@millfieldjunior.test]
Sent: 05 October 2026 11:02
To: Pauline Greaves
Subject: Trip to the science museum

Hi Pauline,

Year 5 trip on Wednesday 18 November. 44 children and 5 adults. Could you do a coach for 8:30 and back for about 3:15? Let me know the price and whether you need the booking form returned.

Thanks,
Trevor` },
];
