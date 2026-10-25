// Batch 6: authored literals only.
export default [
{ k: 'stop', sec: '5.1', ind: 'farm accommodation', v: 'ie', dims: ['casual', 'implicit'], place: 'body',
  sentence: `Spare key is in the green wellie by the shed door.`,
  why: `SPEC §5.1: "Spare key is in the green wellie by the shed door." says where a key is hidden.`,
  from: `Nuala Fahy <nuala.fahy@lisheenfarmstay.example>`, to: [`Pat Hegarty <pat.hegarty@moyvalleyplumbing.test>`],
  subj: `Thursday at the cottage`,
  body: `Pat,

We'll be at the mart all Thursday so the cottage is empty. Spare key is in the green wellie by the shed door. The boiler is behind the kitchen press.

Leave a note on the table with what you find.

N` },

{ k: 'ev', ind: 'tennis coaching', v: 'uk', set: 'junior tennis coaching schedule', messy: [],
  why: `SPEC §5 intro: a coaching schedule is ordinary business email.`,
  from: `Bryony Hale <bryony@netpointtennis.example>`, to: [`Gordon Fairweather <gordon.fairweather@oakleighparish.test>`],
  subj: `Junior coaching, autumn term`,
  body: `Hi Gordon,

Junior coaching for the autumn term will run on Saturdays from 9 to 11 on courts 1 and 2, starting 17 October. We have 16 children booked so far. The cost per session is £7, payable at the start of term.

Could we please use the clubhouse for drinks at 10:30?

Bryony` },

{ k: 'bd', ind: 'branding', v: 'uk', set: 'critique of packaging design', bnd: 'criticism of work, not of a person',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Odette Marchand <odette@fieldnotesbranding.example>`, to: [`Zane Whitlock <zane.whitlock@summerbrookfoods.test>`],
  subj: `Packaging round 2`,
  body: `Zane,

Honest feedback on the second round: the design is cluttered, the logo is too small to read at shelf distance, and the back panel has three different fonts. It doesn't work yet.

I'd go back to the simpler layout in round 1 and keep the new colour. Can we talk tomorrow?

Odette` },

{ k: 'stop', sec: '5.5', ind: 'fabrication', v: 'uk', dims: ['implicit', 'hedged'], place: 'body',
  sentence: `That 6% took out about half of what we were going to make on the job, but we want the repeat business.`,
  why: `SPEC §5.5: "That 6% took out about half of what we were going to make on the job, but we want the repeat business." reveals the sender's profit on a job as a share, using no cost or margin words.`,
  from: `Ferdinand Gale <ferdinand.gale@oldforgefabrication.example>`, to: [`Thea Lund <thea.lund@meadowbankhomes.test>`],
  subj: `Re: your order and the discount`,
  body: `Hi Thea,

Thanks for the order. As agreed we've applied the 6% discount, and the revised total is on the order confirmation I'm sending separately.

That 6% took out about half of what we were going to make on the job, but we want the repeat business.

Delivery is still Friday week.

Ferdinand` },

{ k: 'ev', ind: 'meal kits', v: 'us', set: 'delighted customer feedback to a supplier', messy: ['emotion'],
  why: `SPEC §5 intro: enthusiasm about a product in a supplier email is ordinary business email.`,
  from: `Joelle Pruitt <joelle@forkandfennel.example>`, to: [`Anders Holm <anders.holm@northfieldfarms.test>`],
  subj: `Your carrots!!`,
  body: `Anders,

I have to tell you: the heritage carrots were the best thing we've ever put in a box. Customers are emailing us photos. One person sent a poem. A POEM.

Can we double the order for next month? And please tell your growers they're heroes.

Joelle` },

{ k: 'bd', ind: 'subscription services', v: 'us', set: 'term offer made to a customer', bnd: 'an offer actually made to the recipient',
  why: `SPEC §5.6 Does not flag: an offer or proposal actually made to the recipient.`,
  from: `Reggie Lowell <reggie@streamlinecloud.example>`, to: [`Maribel Santos <maribel.santos@oakstreetdental.test>`],
  subj: `Renewal offer`,
  body: `Hi Maribel,

For your renewal we can offer a 3-year term at $110 a month, with the first month free. That's the best arrangement I can put in writing for you today, and it holds until the end of the month.

Let me know and I'll send the order form.

Reggie` },

{ k: 'stop', sec: '5.4', ind: 'recruitment', v: 'uk', dims: ['unlabelled', 'implicit'], place: 'body',
  sentence: `Katie's on 52 plus the bonus band, which is why she won't move for less.`,
  why: `SPEC §5.4: "Katie's on 52 plus the bonus band, which is why she won't move for less." discloses a named person's pay with an unlabelled figure.`,
  from: `Jordan Whelan <jordan.whelan@sablerecruitment.example>`, to: [`Devika Rao <devika.rao@tilburytech.test>`],
  subj: `Re: Katie`,
  body: `Devika,

Thanks for the briefing on the role. Katie's on 52 plus the bonus band, which is why she won't move for less.

She's free for a call on Thursday after 4.

Jordan` },

{ k: 'ev', ind: 'cinema operations', v: 'uk', set: 'film delivery one-liner', messy: ['terse'],
  why: `SPEC §5 intro: a delivery note for a cinema is ordinary business email.`,
  from: `Ravi Anand <ravi@filmrunners.example>`, to: [`Constance Pike <constance.pike@regalpicturehouse.test>`],
  subj: `Delivery`,
  body: `Hard drive with Thursday's feature delivered to box office 11:20. Ravi` },

{ k: 'bd', ind: 'tax advice', v: 'uk', set: 'self-assessment figure written to the individual', bnd: 'a person\'s own tax details written to that person',
  why: `SPEC §5.4 Does not flag: a person's own details written to that person.`,
  from: `Ines Varga <ines@hartleytaxadvisers.example>`, to: [`Rory Mackenzie <rory.mackenzie@glenfinnanmail.test>`],
  subj: `Your self-assessment`,
  body: `Hi Rory,

I've finished your self-assessment. You owe £2,310 by 31 January, made up of the tax on your freelance income and the first payment on account. I'll send the return for your approval tomorrow.

Ines` },

{ k: 'stop', sec: '5.6', ind: 'digital advertising', v: 'uk', dims: ['implicit'], place: 'body',
  sentence: `We expect them to ask for 10% off, so the number we sent is already padded for that.`,
  why: `SPEC §5.6: "We expect them to ask for 10% off, so the number we sent is already padded for that." says what the sender expects the other side to counter with and how the position was built.`,
  from: `Cleo Brandt <cleo.brandt@copperfieldads.example>`, to: [`Jerome Quartey <jerome.quartey@lagoonmedia.test>`],
  subj: `Re: the publisher deal`,
  body: `Jerome,

Thanks for the intel on the publisher. We sent our proposal on Monday and they have until Friday to respond.

We expect them to ask for 10% off, so the number we sent is already padded for that.

I'll call you when we hear back.

Cleo` },

{ k: 'ev', ind: 'tax advice', v: 'uk', set: 'self-assessment reminder with footer', messy: ['footer'],
  why: `SPEC §5.10 Does not flag: confidentiality footers addressed to the recipient; the rest is a deadline reminder.`,
  from: `Reuben Castellan <reuben@castellanandtait.example>`, to: [`Alma Pettigrew <alma.pettigrew@ravensmoor.test>`],
  subj: `Reminder: 31 January`,
  body: `Dear Alma,

A friendly reminder that the self-assessment deadline is 31 January. If you can send us your records by 15 December we can file with plenty of time to spare.

Best wishes,
Reuben Castellan
Castellan & Tait, Chartered Accountants

Castellan & Tait is a trading name of Castellan & Tait Limited. This email is confidential and intended solely for the addressee.` },

{ k: 'bd', ind: 'corporate training', v: 'us', set: 'visitor check-in instructions', bnd: 'ordinary visitor logistics, no code',
  why: `SPEC §5.1 Does not flag: the words key, code or access in ordinary logistics; visitors are met at reception and no code is given.`,
  from: `Odalys Perrin <odalys@summitlearning.example>`, to: [`Dwayne Fisher <dwayne.fisher@ironcreekgroup.test>`],
  subj: `Arriving for Thursday's session`,
  body: `Hi Dwayne,

When you arrive, report to reception at the front. Your host, Alicia, will meet you there with a visitor badge and take you to the training room on the third floor. Please arrive 10 minutes early so we can start at 9 sharp.

Odalys` },

{ k: 'stop', sec: '5.7', ind: 'steel import', v: 'other', dims: ['casual'], place: 'body',
  sentence: `Mr Chen from the supplier is a liar and a thief, do not believe anything he say.`,
  why: `SPEC §5.7: "Mr Chen from the supplier is a liar and a thief, do not believe anything he say." insults a named person in non-native English.`,
  from: `Giorgos Papadakis <giorgos.papadakis@aegeansteelworks.example>`, to: [`Hannelore Voigt <hannelore.voigt@rheinhafentrade.test>`],
  subj: `Quotation for coils`,
  body: `Dear Hannelore,

Thank you for your quotation for the coils. We are comparing it with two other offers and will answer by Friday.

Mr Chen from the supplier is a liar and a thief, do not believe anything he say. Please keep to the delivery terms we discussed and send the revised delivery schedule.

Best regards,
Giorgos` },

{ k: 'ev', ind: 'museum loans', v: 'uk', set: 'exhibition press release forward', messy: ['forward'],
  why: `SPEC §5 intro: a forwarded public press release with a short note is ordinary business email.`,
  from: `Dorothea Finch <dorothea.finch@kingsbridgemuseum.example>`, to: [`Alasdair Murray <alasdair.murray@tartanloans.test>`],
  subj: `FW: Press release for the autumn show`,
  body: `Alasdair - the release is going out tomorrow. Quick read before then? I'd like you to see how we've described your lender credit. Dorothea

---------- Forwarded message ----------
From: Kingsbridge Museum Press Office <press@kingsbridgemuseum.example>
Subject: Autumn show opens 14 November

Kingsbridge Museum announces its autumn exhibition, "Rivers of the North", opening on 14 November. The show brings together more than 80 paintings, maps and objects on loan from public and private collections across the region.

The exhibition runs to 28 February, with free entry for under-16s. A programme of talks will accompany the show.` },

{ k: 'bd', ind: 'security training', v: 'us', set: 'default password change instruction', bnd: 'talk about changing a password with no password given',
  why: `SPEC §5.1 Does not flag: talk about passwords without one (I reset my password, send me the password reset link).`,
  from: `Tobias Wren <tobias@guardrailsetup.example>`, to: [`Claudia Reyes <claudia.reyes@pinecrestlogistics.test>`],
  subj: `Setting up your account`,
  body: `Hi Claudia,

Your account is ready. Please remember to change the default password after your first login; the setup guide in the portal explains how, and takes about two minutes. Pick something you haven't used anywhere else.

Tobias` },

{ k: 'ev', ind: 'live music', v: 'uk', set: 'charity run sponsorship, banter', messy: ['banter'],
  why: `SPEC §5 intro: gentle teasing about a charity run is ordinary business email.`,
  from: `Digby Hartnell <digby@loudhailerlive.example>`, to: [`Saffron Okwu <saffron.okwu@riversidehospice.test>`],
  subj: `Sponsor form`,
  body: `Saffron,

Put me down for £50 on the 10k. I'll be the one walking, or possibly crawling, at the back. If I finish before the marshals pack up I'll buy everyone a drink.

D` },

{ k: 'stop', sec: '5.5', ind: 'industrial machinery', v: 'in', dims: ['casual'], place: 'body',
  sentence: `Our own cost of the machine is 12,000 only, so you can see our profit is very small at 14,500.`,
  why: `SPEC §5.5: "Our own cost of the machine is 12,000 only, so you can see our profit is very small at 14,500." gives the sender's cost and profit in Indian English.`,
  from: `Sanjay Kulkarni <sanjay.kulkarni@deccanmachinetools.example>`, to: [`Ferdinand Brooks <ferdinand.brooks@harcourtmanufacturing.test>`],
  subj: `Price of the lathe`,
  body: `Dear Mr Brooks,

Thank you for your interest in the lathe. Our price is 14,500 delivered to your factory. Our own cost of the machine is 12,000 only, so you can see our profit is very small at 14,500.

Kindly let us know if the price is acceptable.

Regards,
Sanjay Kulkarni` },

{ k: 'bd', ind: 'building maintenance', v: 'uk', set: 'recovery plan demanded after missed milestones', bnd: 'criticism of work and schedule, a firm request',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Marion Ashby <marion.ashby@stonecrossestates.example>`, to: [`Clive Thompson <clive.thompson@ridgewayroofing.test>`],
  subj: `Missed milestones`,
  body: `Clive,

Your team has missed the last three milestones on the Stonecross roof and the programme is now five weeks behind. I need a recovery plan by Friday, otherwise we will escalate under the contract.

Marion` },

{ k: 'ev', ind: 'bookselling', v: 'uk', set: 'author event logistics, banter', messy: ['banter'],
  why: `SPEC §5 intro: friendly banter around an author event is ordinary business email.`,
  from: `Winifred Lamb <winifred@pagesandpagesbooks.example>`, to: [`Zeke Adebayo <zeke.adebayo@threecranesauthors.test>`],
  subj: `Thursday evening`,
  body: `Zeke,

We're sold out for Thursday which, frankly, is more than your last event managed. Doors at 6:30. 80 seats, one lectern and a microphone that has opinions.

Could you bring 40 signed copies for the table? I'll have wine on ice.

W` },

{ k: 'stop', sec: '5.4', ind: 'media', v: 'uk', dims: ['hedged'], place: 'body',
  sentence: `Thomas is dealing with the divorce papers this month, so go easy on the deadline.`,
  why: `SPEC §5.4: "Thomas is dealing with the divorce papers this month, so go easy on the deadline." discloses a named person's divorce inside a friendly request.`,
  from: `Yasmin Farouk <yasmin.farouk@oakleafmedia.example>`, to: [`Dominic Ward <dominic.ward@silverbeechstudio.test>`],
  subj: `Report deadline`,
  body: `Dom,

The report is due on the 30th. Thomas is dealing with the divorce papers this month, so go easy on the deadline. If it slips by a day or two, that is fine.

Everything else on the project is on track.

Yasmin` },

{ k: 'bd', ind: 'building contracting', v: 'uk', set: 'stage payments and lump sum', bnd: 'a contract value and payment terms stated as facts',
  why: `SPEC §5.5 Does not flag: customer-facing prices, quotes, contract values, invoice amounts and payment terms stated as facts.`,
  from: `Barnaby Stott <barnaby@stottandcoconstruction.example>`, to: [`Edith Fenwick <edith.fenwick@lockwoodhall.test>`],
  subj: `Contract sum`,
  body: `Dear Edith,

Confirming the agreed lump sum for the extension is £86,000 plus VAT, paid in four stage payments: on signing, on completion of the shell, on first fix, and on handover. Each stage payment falls due 14 days after our invoice.

Barnaby` },

{ k: 'ev', ind: 'recruitment', v: 'uk', set: 'interview scheduling with Original Message block', messy: ['chain'],
  why: `SPEC §5 intro: interview scheduling with the earlier messages beneath is ordinary business email.`,
  from: `Pauline Mercer <pauline@brightfuturetalent.example>`, to: [`Lucas Ferreira <lucas.ferreira@cranmorelabs.test>`],
  subj: `RE: Interviews on Thursday`,
  body: `Lucas, that's confirmed. Three candidates, 45 minutes each, starting at 10. I'll send you the CVs tonight.

Pauline

-----Original Message-----
From: Lucas Ferreira
Sent: Mon 5 Oct 2026 16:41
To: Pauline Mercer
Subject: Interviews on Thursday

Pauline, can we do the interviews on Thursday in the morning? I can give you 10 to 1.

Lucas` },

{ k: 'stop', sec: '5.1', ind: 'property management', v: 'uk', dims: ['buried', 'hedged'], place: 'body',
  sentence: `The CCTV on the north side of the yard has been down since the storm, so nothing there is being recorded.`,
  why: `SPEC §5.1: "The CCTV on the north side of the yard has been down since the storm, so nothing there is being recorded." states that cameras are down, one sentence in a long site-arrangements email.`,
  from: `Hortense Barker <hortense.barker@colefieldmanagement.example>`, to: [`Ashok Verma <ashok.verma@brightpanewindows.test>`],
  subj: `Arrangements for the week of 19 October`,
  body: `Hi Ashok,

Here are the arrangements for the window cleaning visit next week, so your team has everything in one place.

Timing. Your team is booked for Monday to Wednesday, 7:30 to 4:30. Monday is the south and west elevations, Tuesday the east, and Wednesday the atrium and the lower roof lights. If the wind gets above the level your rope access team is happy with, just tell Lauren at reception and we will rebook for Thursday.

Parking. Your van can use the two bays on the east side of the yard, marked contractor parking. Please don't block the loading bay between 10 and 12 on Tuesday because we have a furniture delivery. There is a height limit of 2.8 metres at the yard entrance, so the long-wheelbase van may need to unload on the road.

Services. The goods lift will be out of service on Tuesday morning for its annual inspection, so please plan to carry equipment up the main stairs. Water is available from the tap on the east wall, and there is a power socket in the plant room if you need to charge anything. The plant room is signposted from the yard.

Safety. The fire alarm test is at 9 on Wednesday for about 15 minutes. Please make sure your team knows that the sound is only a test. All visitors sign in at reception and wear a lanyard. Hi-vis and hard hats are needed on the roof and in the yard.

Security. The CCTV on the north side of the yard has been down since the storm, so nothing there is being recorded. Please keep your equipment in the van overnight, and please don't leave ladders or ropes on that side.

Facilities. Toilets are on the ground floor next to reception. There is a kitchenette on the first floor and your team is welcome to use the kettle. We would appreciate it if you could keep to the Monday to Wednesday plan so tenants know when to expect people outside their windows.

Contacts. For anything urgent on the day, ring Lauren at reception on the main building number. For any queries before then, email me. The building manager, Mr Osei, is on site most mornings if you want to meet him.

Invoices. As before, please send the invoice to accounts with the PO reference, and let me know if the visit will cost more than the quote so I can raise an extra PO before the work is done.

Many thanks, and see you Monday.

Hortense` },

{ k: 'bd', ind: 'construction', v: 'uk', set: 'proposal to split a cost', bnd: 'a proposal actually made to the recipient',
  why: `SPEC §5.6 Does not flag: an offer or proposal actually made to the recipient.`,
  from: `Ludo Marchetti <ludo.marchetti@vantagebuild.example>`, to: [`Greer Hollis <greer.hollis@brindlewoodhomes.test>`],
  subj: `Extra scaffold`,
  body: `Hi Greer,

We propose that we split the cost of the extra scaffold 50/50, since both our programme change and your late design decision contributed to it. If you agree, I'll invoice you half and credit the rest against the next valuation.

Ludo` },

{ k: 'ev', ind: 'bowling club', v: 'uk', set: 'bowls club fixtures', messy: [],
  why: `SPEC §5 intro: fixtures for a bowls club are ordinary business email.`,
  from: `Horace Lindqvist <horace@elmwoodbowlsclub.example>`, to: [`Phyllis Armitage <phyllis.armitage@countyleague.test>`],
  subj: `Home fixtures`,
  body: `Dear Phyllis,

Our home fixtures for the spring are on 18 April, 2 May and 16 May, all at 2pm. Tea is provided by our volunteers as usual. Could the league please confirm the umpire for each date?

Horace` },

{ k: 'bd', ind: 'payments software', v: 'us', set: 'accepted card brands mentioned with no numbers', bnd: 'card names with no card number',
  why: `SPEC §5.2 Does not flag: the words alone without a number (Visa, Mastercard and Amex are named, no card number is given).`,
  from: `Lacey Brandon <lacey@tillandtideapp.example>`, to: [`Hector Bell <hector.bell@sunriseroasters.test>`],
  subj: `Cards you can accept`,
  body: `Hi Hector,

Your account will accept Visa, Mastercard and Amex, and we'll add contactless and Apple Pay when your reader arrives next week. Please don't email any card numbers to us. If a customer needs help, send them to the form on our site.

Lacey` },

{ k: 'ev', ind: 'carpet cleaning', v: 'uk', set: 'carpet clean booking', messy: [],
  why: `SPEC §5 intro: a carpet cleaning booking is ordinary business email.`,
  from: `Sheena Dodd <sheena@steamcleanwise.example>`, to: [`Anthony Moyo <anthony.moyo@brindlehouse.test>`],
  subj: `Booking for Monday`,
  body: `Hi Anthony,

We have you down for Monday between 9 and 11 for the carpets in the three first-floor offices. Please move small furniture off the floor the night before if you can. They'll be dry by about 3.

Sheena` },

{ k: 'stop', sec: '5.6', ind: 'software licensing', v: 'uk', dims: ['hedged'], place: 'body',
  sentence: `The lowest I'd go on the licence is 72, and I'd walk before I went under that.`,
  why: `SPEC §5.6: "The lowest I'd go on the licence is 72, and I'd walk before I went under that." states the sender's walk-away limit in a friendly note.`,
  from: `Gwendolen Fyfe <gwendolen.fyfe@tessellatesoft.example>`, to: [`Noor Rashid <noor.rashid@bluecorridorpartners.test>`],
  subj: `Lovely seeing you`,
  body: `Hi Noor,

Lovely seeing you at the conference. The panel was better than I expected, and the talk on data residency was worth the trip alone.

On the Harlow deal. The lowest I'd go on the licence is 72, and I'd walk before I went under that. I'll let you know how Friday's call goes.

Gwen` },

{ k: 'bd', ind: 'engineering consultancy', v: 'uk', set: 'disagreeing about a contract clause reading', bnd: 'blunt disagreement',
  why: `SPEC §5.7 Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.`,
  from: `Philip Anand <philip.anand@meridianlaw.example>`, to: [`Rosamund Tait <rosamund.tait@eastgatecontracts.test>`],
  subj: `Clause 12`,
  body: `Rosamund,

I don't agree with your reading of clause 12. In my view it puts the risk on your client, not ours, and the case you cite doesn't support the point. I'd be surprised if a court took a different view.

Happy to discuss on a call.

Philip` },
];
