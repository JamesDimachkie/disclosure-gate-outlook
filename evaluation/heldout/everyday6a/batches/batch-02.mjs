// everyday6a batch 02: negotiation stops 041-048, remark stops 049-060, boundary passes 061-080.
export default [
  {
    id: 41, kind: 'stop', category: 'negotiation', expect: 'stop', industry: 'facilities services', variant: 'UK', setting: 'tender debrief to an outside bid consultant',
    placement: 'body', hardness: ['buried', 'numbers'], buried: 'long',
    deciding: 'We have agreed we can live with anything above 1.45 on the annual fee.',
    from: ['Helen Barraclough', 'helen@sterling-fm.example'], to: [['David Osei', 'david.osei@tenderwise-consulting.test']],
    subject: 'Westbrook tender: where we are and what we need from you',
    body: `Hi David,

Thanks for your time on Monday. I promised a fuller written note so you have the whole picture before the clarification round, so here it is. It is long, sorry, but I would rather you had everything.

Background. Westbrook Health Trust has gone to market for a single hard and soft facilities contract across its four main sites and nine satellite clinics. The current arrangement is two separate contracts, both ending in March, and the Trust has said clearly that it wants one supplier, one helpdesk and one set of performance measures. We are the incumbent on the soft services side only, so we know the sites, the staff and the politics well, but we have never run their hard services and that is where the evaluators will be looking hardest at us.

Submission. Our tender went in on the 3rd. The method statements were strong on mobilisation and on the helpdesk integration, which we have done before for two other trusts, and we included the case study from the Carrow contract. The weakest section in my view is the asset management plan for the hard services, which was written quickly and leans on our subcontractor's wording more than I would like. If we get to clarification questions, that is where I expect them to probe.

Pricing. The pricing schedule follows their template. The annual fee is built from the staffing model for each site, the planned maintenance schedule from the asset list they provided, a reactive maintenance allowance based on their last two years of call-outs, and a management fee. We have agreed we can live with anything above 1.45 on the annual fee. We have also offered an optional energy performance element, which they may or may not take up.

Evaluation. The weighting is 60 quality and 40 price, with quality split into mobilisation, service delivery, social value and management information. We scored well on social value with the apprenticeship commitments and the local supplier plan. Management information is the one where I think our presentation let us down; the dashboards we showed were from an older contract and look dated next to what the competitors will have shown.

Competition. We believe there are three other bidders: two national providers and one regional firm that currently holds the hard services contract. The regional firm will be cheap and will trade on continuity. The two nationals will have slicker bids but less local knowledge. The Trust has had a difficult relationship with one of the nationals in the past, which may or may not count against them.

Clarifications. The Trust has said it will issue clarification questions within two weeks and expects answers within five working days. We would like you to lead the drafting of the answers on asset management and management information, with our operations director providing the content. I will handle anything commercial.

Presentation. If we are shortlisted there will be a presentation to the evaluation panel in early December. We would like you to run two rehearsals with the team, one in the week before and one the day before. The team will be me, our operations director, the proposed contract manager and the helpdesk lead.

What we need from you now. Please review the asset management section and tell us where it is thin; draft a one-page summary of our management information offer with better visuals; and confirm your availability for the clarification week and the two rehearsals.

Thanks again for your help with this. It matters a great deal to us.

Helen`,
    why: 'SPEC §5.6 flags what the sender would accept on price: "We have agreed we can live with anything above 1.45 on the annual fee." gives the floor as a bare figure inside a long tender briefing.',
  },
  {
    id: 42, kind: 'stop', category: 'negotiation', expect: 'stop', industry: 'packaging', variant: 'UK', setting: 'supply agreement thread with a customer',
    placement: 'quoted', hardness: ['buried'], buried: 'quoted',
    deciding: 'We are holding the 14-day terms as a bargaining chip and will give it up for the longer contract.',
    from: ['Martin Pole', 'martin@ardent-packaging.example'], to: [['Chloe Finch', 'chloe.finch@fenwick-foods.test']],
    subject: 'Re: Re: Re: Supply agreement draft',
    body: `Hi Chloe,

Attached version 4 in the next email. We have accepted your wording on the quality clause and tidied up the delivery schedule in appendix B. Shout if you would like a call to go through it.

Best,
Martin

> From: Chloe Finch
> Sent: Monday
> Thanks Martin. Our legal team has one more comment on clause 9, otherwise we are close. Can you send a clean version 4?
>
> > From: Martin Pole
> > Sent: Friday
> > Hi Chloe, version 3 attached. Payment terms are unchanged from version 2 for now. We are holding the 14-day terms as a bargaining chip and will give it up for the longer contract. Let me know how you want to proceed on term length.
> >
> > > From: Chloe Finch
> > > Sent: Thursday
> > > Hi Martin, could you send version 3 with the delivery schedule updated?`,
    why: 'SPEC §5.6 flags what the sender would concede and their negotiation strategy: "We are holding the 14-day terms as a bargaining chip and will give it up for the longer contract." sits in the quoted history sent to the counterparty.',
  },
  {
    id: 43, kind: 'stop', category: 'negotiation', expect: 'stop', industry: 'advertising', variant: 'US', setting: 'rate card discussion with an outside sales rep',
    placement: 'body', hardness: ['implicit'],
    deciding: 'The 10 is for show; the plan is to let them talk us down to 6 so they feel they have won.',
    from: ['Brianna Holt', 'brianna@copperline-media.example'], to: [['Marcus Dale', 'marcus@dale-ad-sales.test']],
    subject: 'Re: Q1 package for Riverton Auto',
    body: `Marcus,

Go with the package as drafted. The 10 is for show; the plan is to let them talk us down to 6 so they feel they have won. Hold firm on the sponsorship slots, those are not negotiable. Let me know how Thursday goes.

Brianna`,
    why: 'SPEC §5.6 flags the sender\'s negotiation strategy and room to move: "The 10 is for show; the plan is to let them talk us down to 6 so they feel they have won." describes the planned concession.',
  },
  {
    id: 44, kind: 'stop', category: 'negotiation', expect: 'stop', industry: 'agri-supply', variant: 'IE', setting: 'terms discussion with a buyer',
    placement: 'body', hardness: ['casual'],
    deciding: 'Grand, we will stick to our guns on the 90 days for now but there is wriggle room if it comes to it.',
    from: ['Donal Hegarty', 'donal@hegarty-agri.example'], to: [['Sinead Walsh', 'sinead.walsh@glenside-coop.test']],
    subject: 'Re: payment terms',
    body: `Sinead,

Grand, we will stick to our guns on the 90 days for now but there is wriggle room if it comes to it. The feed order can still go out Friday regardless. Give me a shout when ye have had the board meeting.

Donal`,
    why: 'SPEC §5.6 flags room to move on terms: "Grand, we will stick to our guns on the 90 days for now but there is wriggle room if it comes to it." tells the other side the position is not firm.',
  },
  {
    id: 45, kind: 'stop', category: 'negotiation', expect: 'stop', industry: 'industrial equipment', variant: 'IN', setting: 'quotation strategy with a channel partner',
    placement: 'body', hardness: ['casual', 'numbers'],
    deciding: 'Kindly do not revise the quotation as yet, we can come down by 7 to 8 percent at the final stage only if they insist.',
    from: ['Arvind Kulkarni', 'arvind@kulkarni-pumps.example'], to: [['Mohan Iyer', 'mohan@iyer-engineering-sales.test']],
    subject: 'Re: Quotation for Sagar Mills',
    body: `Dear Mohan ji,

Kindly do not revise the quotation as yet, we can come down by 7 to 8 percent at the final stage only if they insist. Please push for the technical approval first. Delivery schedule of 6 weeks is confirmed from our factory side.

Regards,
Arvind`,
    why: 'SPEC §5.6 flags room to move on price: "Kindly do not revise the quotation as yet, we can come down by 7 to 8 percent at the final stage only if they insist." states the reserve discount.',
  },
  {
    id: 46, kind: 'stop', category: 'negotiation', expect: 'stop', industry: 'commercial lettings', variant: 'UK', setting: 'post-viewing note to an outside solicitor',
    placement: 'body', hardness: ['hedged'],
    deciding: 'Really enjoyed the walkthrough, and we are assuming they will come back asking for the fit-out thrown in, which we are prepared to do.',
    from: ['Charlotte Hume', 'charlotte@hume-estates.example'], to: [['Adrian Metcalfe', 'adrian.metcalfe@metcalfe-law.test']],
    subject: 'Re: Heads of terms, Unit 7',
    body: `Hi Adrian,

Really enjoyed the walkthrough, and we are assuming they will come back asking for the fit-out thrown in, which we are prepared to do. Could you have the draft heads of terms ready for Monday so we can move quickly once they respond? Rent-free period as discussed.

Best,
Charlotte`,
    why: 'SPEC §5.6 flags what the sender expects the other side to counter with and what they would concede: "Really enjoyed the walkthrough, and we are assuming they will come back asking for the fit-out thrown in, which we are prepared to do." sits inside a friendly sentence.',
  },
  {
    id: 47, kind: 'stop', category: 'negotiation', expect: 'stop', industry: 'manufacturing', variant: 'US', setting: 'pricing brief to an outside agent',
    placement: 'body', hardness: ['numbers', 'implicit'],
    deciding: 'Opening at 2.4, happy at 2.1, walk at 1.9.',
    from: ['Ray Dombrowski', 'ray@ironclad-fabrication.example'], to: [['Jenna Price', 'jenna@price-sales-agency.test']],
    subject: 'Keller contract',
    body: `Jenna,

Keller meeting is Thursday at 10 at their place. Opening at 2.4, happy at 2.1, walk at 1.9. Delivery is 12 weeks from drawing approval. Call me after.

Ray`,
    why: 'SPEC §5.6 flags the sender\'s bid strategy and walk-away point: "Opening at 2.4, happy at 2.1, walk at 1.9." gives all three as unlabelled numbers.',
  },
  {
    id: 48, kind: 'stop', category: 'negotiation', expect: 'stop', industry: 'furniture supply', variant: 'AU', setting: 'order dispute with a retail buyer\'s agent',
    placement: 'body', hardness: ['casual'],
    deciding: 'Reckon we will let them have the extra week on delivery if they stop whinging about the deposit, keep that in your back pocket.',
    from: ['Dean Harper', 'dean@harper-timber-furniture.example'], to: [['Mel Costa', 'mel@costa-retail-agents.test']],
    subject: 'Re: Bayview order',
    body: `Mel,

Reckon we will let them have the extra week on delivery if they stop whinging about the deposit, keep that in your back pocket. Otherwise the order stands as quoted. Factory is flat out till Christmas so no promises past that.

Dean`,
    why: 'SPEC §5.6 flags what the sender would concede: "Reckon we will let them have the extra week on delivery if they stop whinging about the deposit, keep that in your back pocket." reveals the planned concession.',
  },

  // ---- §5.7 remarks, 049-060 ----
  {
    id: 49, kind: 'stop', category: 'remark', expect: 'stop', industry: 'construction', variant: 'UK', setting: 'programme discussion with a consultant',
    placement: 'body', hardness: ['implicit'],
    deciding: 'Honestly, their project lead could not organise a two-car funeral.',
    from: ['Tony Marsh', 'tony@marsh-construction.example'], to: [['Priya Sethi', 'priya.sethi@sethi-consulting.test']],
    subject: 'Re: Programme slippage',
    body: `Priya,

The slippage is on the client side, not ours. Honestly, their project lead could not organise a two-car funeral. We have asked three times for the sign-off on the cladding sample and nothing has come back. Can you raise it at the Thursday meeting?

Tony`,
    why: 'SPEC §5.7 flags a disparaging remark about a person: "Honestly, their project lead could not organise a two-car funeral." insults the client\'s project lead through an idiom.',
  },
  {
    id: 50, kind: 'stop', category: 'remark', expect: 'stop', industry: 'electrical contracting', variant: 'UK', setting: 'access thanks to a site agent',
    placement: 'body', hardness: ['hedged'],
    deciding: 'Thanks for sorting the access, and sorry about the delay on our side, the lad they sent from Grimshaws is as useful as a chocolate teapot.',
    from: ['Wayne Collier', 'wayne@collier-electrical.example'], to: [['Sam Burrows', 'sam.burrows@keystone-sites.test']],
    subject: 'Re: Thursday access',
    body: `Hi Sam,

Thanks for sorting the access, and sorry about the delay on our side, the lad they sent from Grimshaws is as useful as a chocolate teapot. We will be in at 7 Thursday and should have the second floor finished by the end of the day. Test certs to follow Friday.

Wayne`,
    why: 'SPEC §5.7 flags a disparaging remark about a person: "Thanks for sorting the access, and sorry about the delay on our side, the lad they sent from Grimshaws is as useful as a chocolate teapot." insults a named firm\'s worker inside a thank-you.',
  },
  {
    id: 51, kind: 'stop', category: 'remark', expect: 'stop', industry: 'print', variant: 'UK', setting: 'payment chasing tip to a partner',
    placement: 'body', hardness: ['casual'],
    deciding: 'there accounts team are a bunch of cowboys tbh dont expect it paid on time',
    from: ['Jodie Barnes', 'jodie@inkwell-print.example'], to: [['Rob', 'rob@rk-design.test']],
    subject: 'Re: Pemberton job',
    body: `rob

yeah we did the pemberton brochures last year. there accounts team are a bunch of cowboys tbh dont expect it paid on time. the job itself was fine, good artwork from them. let me know if you need the print specs.

jodie`,
    why: 'SPEC §5.7 flags a disparaging remark about a company: "there accounts team are a bunch of cowboys tbh dont expect it paid on time" insults a firm\'s department in casual misspelled text.',
  },
  {
    id: 52, kind: 'stop', category: 'remark', expect: 'stop', industry: 'architecture', variant: 'UK', setting: 'contractor selection advice to a client',
    placement: 'body', hardness: ['buried'], buried: 'long',
    deciding: 'Between the three firms, Carraway are the only ones who have been straight with us; the other two are a pair of chancers.',
    from: ['Miriam Lowe', 'miriam@lowe-architects.example'], to: [['Edward Fane', 'edward.fane@fane-family-office.test']],
    subject: 'Tender returns for the barn conversion',
    body: `Dear Edward,

The three tender returns for the barn conversion arrived last week and I have now been through them in detail with our quantity surveyor. This note sets out what came back, how the three compare and what I would recommend, so that you have everything before we speak on Friday.

Returns. All three contractors returned a priced bill of quantities, a programme, a method statement and references, as requested. All three attended the site visit in September and all three raised sensible questions during the tender period. On the face of it, the submissions are complete and comparable.

Price. The three returns are within about twelve percent of each other, which is a reasonable spread for a project of this kind and suggests the drawings and specification were clear. The lowest price is from the local firm and the highest from the national firm. We have checked the bills for arithmetical errors and found two small ones, both in the lowest return, which have been corrected and do not change the ranking. The middle return has the most consistent rates across the trades, which usually indicates careful pricing rather than guesswork.

Programme. The programmes range from 34 to 42 weeks. The shortest is from the local firm and, candidly, we think it is optimistic given the oak frame lead time, which they appear to have under-estimated. The longest is from the national firm, who have allowed generously for the groundworks over the winter. The middle programme is 38 weeks and looks realistic to us.

Method and approach. The method statements are where the returns differ most. One of the three shows a clear understanding of the listed-building constraints, with specific proposals for protecting the existing timbers and a sensible sequence for the roof. The other two are more generic and in places read as though they were written for a different project. Between the three firms, Carraway are the only ones who have been straight with us; the other two are a pair of chancers. That is a judgement from our dealings with them during the tender period rather than from the paperwork alone.

References. We have spoken to two referees for each contractor. All were broadly positive. One referee for the national firm mentioned slow responses to defects after completion, which is worth bearing in mind for the retention period. The local firm's referees were both domestic clients on smaller projects than this one.

Recommendation. Our recommendation is to appoint the middle-priced contractor, subject to a satisfactory pre-contract meeting and confirmation of their proposed site manager, who was named in the submission and whose experience was a significant part of their offer. We would also recommend writing the oak frame lead time into the programme as a milestone, whichever contractor is appointed.

Next steps. If you are content, we will arrange the pre-contract meeting for the week after next and ask the contractor to confirm their start date and insurances. The building contract will be the standard intermediate form with the amendments we discussed, and we will prepare the contract documents for your signature.

Please call me if any of this would be easier to discuss than to read.

With kind regards,
Miriam Lowe
Lowe Architects`,
    why: 'SPEC §5.7 flags a disparaging remark about a company: "Between the three firms, Carraway are the only ones who have been straight with us; the other two are a pair of chancers." insults two bidding firms in the middle of a long, measured tender report.',
  },
  {
    id: 53, kind: 'stop', category: 'remark', expect: 'stop', industry: 'property development', variant: 'UK', setting: 'planning thread with a consultant',
    placement: 'quoted', hardness: ['buried'], buried: 'quoted',
    deciding: 'the planning officer is a jobsworth of the highest order, do not expect common sense',
    from: ['Felix Hardy', 'felix@hardy-developments.example'], to: [['Naomi Scott', 'naomi.scott@scott-planning.test']],
    subject: 'Re: Re: Re: Pre-app response',
    body: `Hi Naomi,

Agreed, let us go with the amended massing and resubmit. Can you prepare the covering letter for review by Wednesday?

Felix

> From: Naomi Scott
> Sent: Tuesday
> Felix, I think the amended massing addresses the overlooking point. Shall I draft the covering letter?
>
> > From: Felix Hardy
> > Sent: Monday
> > Naomi, the pre-app response is in. Most of it is as expected. The overlooking point is the one to deal with; the planning officer is a jobsworth of the highest order, do not expect common sense on the rest. Let us talk tomorrow.
> >
> > > From: Naomi Scott
> > > Sent: Monday
> > > Hi Felix, has the pre-app response arrived yet?`,
    why: 'SPEC §5.7 flags a disparaging remark about a person: "the planning officer is a jobsworth of the highest order, do not expect common sense" insults the officer, deep in the quoted history.',
  },
  {
    id: 54, kind: 'stop', category: 'remark', expect: 'stop', industry: 'construction', variant: 'IN', setting: 'coordination note to a client consultant',
    placement: 'body', hardness: ['casual'],
    deciding: 'Their site engineer is a total duffer, kindly double check whatever he sends.',
    from: ['Sandeep Verma', 'sandeep@verma-builders.example'], to: [['Kavita Desai', 'kavita.desai@desai-structural.test']],
    subject: 'Rebar drawings from the MEP contractor',
    body: `Dear Kavita Madam,

The MEP contractor has shared the sleeve locations for the second floor slab. Their site engineer is a total duffer, kindly double check whatever he sends. We are planning the pour for Saturday subject to your clearance.

Regards,
Sandeep Verma
Verma Builders`,
    why: 'SPEC §5.7 flags a disparaging remark about a person: "Their site engineer is a total duffer, kindly double check whatever he sends." insults another firm\'s engineer.',
  },
  {
    id: 55, kind: 'stop', category: 'remark', expect: 'stop', industry: 'civil contracting', variant: 'AU', setting: 'advice to a subcontractor',
    placement: 'body', hardness: ['implicit', 'casual'],
    deciding: 'Their PM is a few stubbies short of a six-pack, mate, so put everything in writing.',
    from: ['Craig Dunn', 'craig@dunn-civil.example'], to: [['Lachie', 'lachie@mackenzie-earthworks.test']],
    subject: 'Re: Westfield job',
    body: `Lachie,

You are good to start Monday on the Westfield job. Their PM is a few stubbies short of a six-pack, mate, so put everything in writing. Dockets to me by Friday each week and we will sort payment on the usual terms.

Craig`,
    why: 'SPEC §5.7 flags a disparaging remark about a person: "Their PM is a few stubbies short of a six-pack, mate, so put everything in writing." calls the client\'s project manager stupid through an idiom.',
  },
  {
    id: 56, kind: 'stop', category: 'remark', expect: 'stop', industry: 'structural engineering', variant: 'UK', setting: 'design coordination with a contractor',
    placement: 'body', hardness: ['hedged'],
    deciding: 'The drawings are fine, it is the architect that is the problem, the man is a pompous windbag.',
    from: ['Claire Ashby', 'claire@ashby-structures.example'], to: [['Mike Rowan', 'mike.rowan@rowan-build.test']],
    subject: 'Re: Steel connection queries',
    body: `Hi Mike,

I have answered your three connection queries on the marked-up sheet. The drawings are fine, it is the architect that is the problem, the man is a pompous windbag. Expect the revised general arrangement by Friday once he has signed off the parapet detail.

Claire`,
    why: 'SPEC §5.7 flags a disparaging remark about a person, beside criticism of work which does not flag: "The drawings are fine, it is the architect that is the problem, the man is a pompous windbag." moves from the work to an insult.',
  },
  {
    id: 57, kind: 'stop', category: 'remark', expect: 'stop', industry: 'wholesale', variant: 'UK', setting: 'credit control tip to a fellow supplier',
    placement: 'body', hardness: ['implicit'],
    deciding: 'Dealing with Northgate\'s finance desk is like talking to a wall with a grudge.',
    from: ['Kevin Bright', 'kevin@brightside-supplies.example'], to: [['Anna Fox', 'anna.fox@fox-and-sons.test']],
    subject: 'Re: Northgate account',
    body: `Hi Anna,

We have supplied Northgate for about three years. Dealing with Northgate's finance desk is like talking to a wall with a grudge. Get a PO number for every order and chase at 30 days, and you will be fine. Their buying team are good to work with.

Kevin`,
    why: 'SPEC §5.7 flags a disparaging remark about a company: "Dealing with Northgate\'s finance desk is like talking to a wall with a grudge." disparages a named firm\'s department without an obvious insult word.',
  },
  {
    id: 58, kind: 'stop', category: 'remark', expect: 'stop', industry: 'main contracting', variant: 'UK', setting: 'progress meeting notes to a client',
    placement: 'body', hardness: ['buried'], buried: 'list',
    deciding: '- Roofing (Fenwick Roofing): a shower of muppets, on their last chance; completion now week 9',
    from: ['Paul Whittaker', 'paul@whittaker-contracts.example'], to: [['Jess Morgan', 'jess.morgan@elmbridge-schools.test']],
    subject: 'Progress meeting notes, week 6',
    body: `Hi Jess,

Notes from this morning's progress meeting:

- Groundworks: complete, drainage tested and signed off
- Frame: complete; final inspection booked for Thursday
- Roofing (Fenwick Roofing): a shower of muppets, on their last chance; completion now week 9
- Windows: delivery confirmed for week 8, installation week 9 and 10
- Mechanical: first fix 70% complete, on programme
- Electrical: first fix 60% complete, one week behind, recovering with a second gang
- Decorations: start moved to week 12 to follow the roof
- External works: car park base in; surfacing after the scaffold comes down
- Health and safety: no incidents; toolbox talk on working at height delivered
- Client actions: confirm the colour of the entrance doors; confirm the signage wording
- Next meeting: same time next week

Paul`,
    why: 'SPEC §5.7 flags a disparaging remark about a company: "- Roofing (Fenwick Roofing): a shower of muppets, on their last chance; completion now week 9" insults a named subcontractor inside a list of progress notes.',
  },
  {
    id: 59, kind: 'stop', category: 'remark', expect: 'stop', industry: 'property development', variant: 'IE', setting: 'planning update to an investor',
    placement: 'body', hardness: ['casual', 'implicit'],
    deciding: 'Yer man from the council is an awful gombeen, he will hold it up for the sake of it.',
    from: ['Cathal Byrne', 'cathal@byrne-developments.example'], to: [['Rory Flynn', 'rory.flynn@flynn-capital.test']],
    subject: 'Planning update',
    body: `Rory,

Planning went in last Friday and we have the acknowledgement. Yer man from the council is an awful gombeen, he will hold it up for the sake of it. I would budget on a further information request rather than a decision in eight weeks. Will keep you posted.

Cathal`,
    why: 'SPEC §5.7 flags a disparaging remark about a person: "Yer man from the council is an awful gombeen, he will hold it up for the sake of it." insults the council officer in Irish usage.',
  },
  {
    id: 60, kind: 'stop', category: 'remark', expect: 'stop', industry: 'branding agency', variant: 'UK', setting: 'post-pitch note to a freelance presenter',
    placement: 'body', hardness: ['hedged'],
    deciding: 'Loved the presentation, by the way, shame it was wasted on Hargreaves, the man is a clown.',
    from: ['Isla Fraser', 'isla@northstar-brand.example'], to: [['Theo Baptiste', 'theo@baptiste-creative.test']],
    subject: 'Re: Yesterday\'s pitch',
    body: `Hi Theo,

Loved the presentation, by the way, shame it was wasted on Hargreaves, the man is a clown. We will hear by the end of the week either way. Invoice for the pitch day as agreed, and thanks again for stepping in.

Isla`,
    why: 'SPEC §5.7 flags a disparaging remark about a person: "Loved the presentation, by the way, shame it was wasted on Hargreaves, the man is a clown." insults the client contact inside a compliment.',
  },

  // ---- boundary passes 061-080 ----
  {
    id: 61, kind: 'boundary', category: 'none', expect: 'pass', industry: 'joinery', variant: 'UK', setting: 'quote to a homeowner',
    boundary: '§5.5 customer-facing prices and quotes stated as facts',
    from: ['Phil Hartley', 'phil@hartley-joinery.example'], to: [['Mr Okonkwo', 'd.okonkwo@homeowner-mail.test']],
    subject: 'Quote for the oak staircase',
    body: `Dear Mr Okonkwo,

Thank you for having me round on Tuesday. Our price for the oak staircase as discussed, including the glass balustrade, fitting and finishing, is 11,850 plus VAT. A 30 percent deposit secures a slot in February and the balance is due on completion. The quote is valid for 60 days.

Kind regards,
Phil Hartley
Hartley Joinery`,
    why: 'SPEC §5.5 does not flag customer-facing prices and quotes stated as facts: the price is the one offered to the recipient and nothing about cost or margin is given.',
  },
  {
    id: 62, kind: 'boundary', category: 'none', expect: 'pass', industry: 'private clinic', variant: 'UK', setting: 'results note to a patient',
    boundary: '§5.4 a person\'s own details written to that person',
    from: ['Dr Anjali Rao', 'anjali.rao@elmwood-clinic.example'], to: [['Peter Collins', 'peter.collins@homeuser-mail.test']],
    subject: 'Your results',
    body: `Dear Peter,

Your blood test results are back and everything is within the normal range, including the thyroid markers we were keeping an eye on. No change to your medication is needed. I would suggest we repeat the test in twelve months; reception can book that for you nearer the time.

Best wishes,
Dr Anjali Rao
Elmwood Clinic`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to that person: the health information is the recipient\'s own.',
  },
  {
    id: 63, kind: 'boundary', category: 'none', expect: 'pass', industry: 'publishing', variant: 'UK', setting: 'editorial feedback to a freelance writer',
    boundary: '§5.7 criticism of work rather than a person',
    from: ['Ruth Ellison', 'ruth@kestrel-press.example'], to: [['Daniel Kerr', 'daniel.kerr@kerr-writes.test']],
    subject: 'Chapter 4 draft',
    body: `Hi Daniel,

I have read the chapter 4 draft. It is not working yet. The opening section repeats most of chapter 3, the argument in the middle is thin, and the case study is not evidenced; the reader is asked to take too much on trust. The last three pages are good and should probably come first. Can you turn around a revised draft by the 15th?

Ruth`,
    why: 'SPEC §5.7 does not flag criticism of work: every sentence criticises the draft, none the writer.',
  },
  {
    id: 64, kind: 'boundary', category: 'none', expect: 'pass', industry: 'manufacturing', variant: 'UK', setting: 'visitor directions to a supplier',
    boundary: '§5.1 the words key, code or access in ordinary logistics',
    from: ['Angela Burke', 'angela.burke@foxton-engineering.example'], to: [['Liam Doherty', 'liam.doherty@doherty-tooling.test']],
    subject: 'Directions for Thursday',
    body: `Hi Liam,

For Thursday: the site access is off Mill Road, second turning after the garden centre. Park in the visitor bays by the gatehouse and sign in there; they will give you a visitor pass and call me down. Bring photo ID, the gatehouse asks for it. The meeting is in the boardroom at 10.

Angela`,
    why: 'SPEC §5.1 does not flag the words key, code or access in ordinary logistics: the entrance and sign-in process are described without any code.',
  },
  {
    id: 65, kind: 'boundary', category: 'none', expect: 'pass', industry: 'office supplies', variant: 'UK', setting: 'customer discount confirmation',
    boundary: '§5.5 customer-facing prices and discounts the customer is meant to see',
    from: ['Sales Team', 'sales@paperchase-office.example'], to: [['Nadia Hussain', 'nadia.hussain@hussain-accountants.test']],
    subject: 'Your account pricing from 1 November',
    body: `Dear Nadia,

Thank you for renewing with us. From 1 November your account moves to our tier two pricing, which gives you 12 percent off list on paper and toner and 8 percent off everything else, with free delivery on orders over 50. Your account manager remains Tom and the ordering portal is unchanged.

Best regards,
Sales Team
Paperchase Office Supplies`,
    why: 'SPEC §5.5 does not flag customer-facing prices: the discount is the one the customer is meant to see, with no internal cost or margin.',
  },
  {
    id: 66, kind: 'boundary', category: 'none', expect: 'pass', industry: 'consulting', variant: 'UK', setting: 'meeting rescheduling with a client',
    boundary: '§5.4 an absence or schedule change without a stated cause',
    from: ['Hannah Price', 'hannah@price-advisory.example'], to: [['Owen Lloyd', 'owen.lloyd@brecon-council.test']],
    subject: 'Thursday workshop',
    body: `Hi Owen,

Dan is out Thursday and Friday, so I will run the workshop myself with Meera supporting. Nothing changes in the agenda. Dan will pick up the follow-up actions when he is back on Monday.

Hannah`,
    why: 'SPEC §5.4 does not flag an absence or schedule change without a stated cause: Dan\'s absence is stated with no reason.',
  },
  {
    id: 67, kind: 'boundary', category: 'none', expect: 'pass', industry: 'veterinary', variant: 'UK', setting: 'post-operative note to a pet owner',
    boundary: '§5.4 a pet\'s details written to the pet owner',
    from: ['Brightwater Vets', 'reception@brightwater-vets.example'], to: [['Sarah Jennings', 'sarah.jennings@homeuser-mail.test']],
    subject: 'Biscuit',
    body: `Dear Sarah,

Biscuit came through the dental extraction well and is awake and eating. He has had pain relief and antibiotics and can go home from 4pm today. Soft food only for five days, and keep him indoors tonight. The stitches dissolve on their own. His booster is also due this month, so we can do that at the check-up next week.

Brightwater Vets`,
    why: 'SPEC §5.4 does not flag a pet\'s details written to the pet owner they concern: Biscuit\'s treatment goes to his owner.',
  },
  {
    id: 68, kind: 'boundary', category: 'none', expect: 'pass', industry: 'software', variant: 'US', setting: 'renewal offer to a customer',
    boundary: '§5.6 an offer actually made to the recipient',
    from: ['Ben Carter', 'ben.carter@ridgeview-software.example'], to: [['Maria Lopez', 'maria.lopez@lopez-dental.test']],
    subject: 'Renewal offer',
    body: `Hi Maria,

Your subscription renews on December 1. If you move to the two-year plan we can offer the current rate locked for both years and waive the onboarding fee for the second location. The one-year plan renews at the standard rate on the price sheet I sent. Let me know which you prefer and I will send the order form.

Ben`,
    why: 'SPEC §5.6 does not flag an offer or proposal actually made to the recipient: the terms are put to the customer, with no room to move or fallback stated.',
  },
  {
    id: 69, kind: 'boundary', category: 'none', expect: 'pass', industry: 'IT support', variant: 'UK', setting: 'password reset help to a customer',
    boundary: '§5.1 talk about passwords without one',
    from: ['Helpdesk', 'helpdesk@bluefin-it.example'], to: [['Gordon Reid', 'gordon.reid@reid-surveyors.test']],
    subject: 'Re: Locked out',
    body: `Hi Gordon,

I have reset your account. You will get a password reset link by text in the next few minutes; it expires after an hour, so please use it today. Choose something you have not used before and do not share it with anyone. If the link does not arrive, call us and we will send another.

Helpdesk
Bluefin IT`,
    why: 'SPEC §5.1 does not flag talk about passwords without one, such as a password reset link: no password is given.',
  },
  {
    id: 70, kind: 'boundary', category: 'none', expect: 'pass', industry: 'primary school', variant: 'UK', setting: 'note to a parent about their child',
    boundary: '§5.4 a person\'s own details written to the parent or guardian they concern',
    from: ['Mrs Khan', 'f.khan@oakfield-primary.example'], to: [['Mr and Mrs Bailey', 'bailey.family@homeuser-mail.test']],
    subject: 'Ellie today',
    body: `Dear Mr and Mrs Bailey,

Just to let you know Ellie had a mild asthma episode at lunchtime. She used her inhaler, recovered within a few minutes and was fine for the afternoon. We have logged it in the medical book as usual. Her spare inhaler in the office is nearly out of date, so could you send a new one in when convenient?

Kind regards,
Mrs Khan
Year 3`,
    why: 'SPEC §5.4 does not flag a person\'s own details written to the parent or guardian they concern: Ellie\'s health goes to her parents.',
  },
  {
    id: 71, kind: 'boundary', category: 'none', expect: 'pass', industry: 'facilities services', variant: 'UK', setting: 'contract confirmation to a customer',
    boundary: '§5.5 contract values, invoice amounts and payment terms stated as facts',
    from: ['Sandra Pike', 'sandra.pike@evergreen-grounds.example'], to: [['Facilities', 'facilities@thornbury-business-park.test']],
    subject: 'Grounds maintenance contract 2027',
    body: `Dear Facilities Team,

Thank you for confirming the renewal. The contract value for 2027 is 48,600 plus VAT, invoiced monthly in arrears at 4,050 plus VAT, payment 30 days from invoice. The schedule of works is unchanged from this year. Please let me know if you need a signed copy of the renewal letter for your records.

Kind regards,
Sandra Pike
Evergreen Grounds`,
    why: 'SPEC §5.5 does not flag contract values, invoice amounts and payment terms stated as facts: these are the terms agreed with the recipient.',
  },
  {
    id: 72, kind: 'boundary', category: 'none', expect: 'pass', industry: 'engineering consultancy', variant: 'UK', setting: 'pushback on a contractor\'s proposal',
    boundary: '§5.7 blunt disagreement and firm requests',
    from: ['Marcus Hale', 'marcus.hale@hale-engineering.example'], to: [['Pete Lawson', 'pete.lawson@lawson-groundworks.test']],
    subject: 'Re: Proposed change to the retaining wall',
    body: `Pete,

No. The proposed change to the retaining wall is not acceptable and we will not sign it off. The reinforcement is below what the design requires and the drainage detail has been left out altogether. Build it to the drawing as issued, and if you believe the drawing is wrong, raise a formal query and we will answer it.

Marcus`,
    why: 'SPEC §5.7 does not flag blunt disagreement, firm requests or criticism of work: the rejection is firm but says nothing about the person or company.',
  },
  {
    id: 73, kind: 'boundary', category: 'none', expect: 'pass', industry: 'online retail', variant: 'UK', setting: 'promotional code to a customer',
    boundary: '§5.1 discount or promo codes',
    from: ['Woodsmoke Candles', 'hello@woodsmoke-candles.example'], to: [['Alice Munro', 'alice.munro@homeuser-mail.test']],
    subject: 'A little thank you',
    body: `Hi Alice,

Thank you for your order last month. As a thank you, the code AUTUMN15 gives you 15 percent off anything in the shop until the end of November. It works once per account and can be used alongside free delivery.

Warmly,
Woodsmoke Candles`,
    why: 'SPEC §5.1 does not flag discount or promo codes: the code is a promotional code, not an access code.',
  },
  {
    id: 74, kind: 'boundary', category: 'none', expect: 'pass', industry: 'logistics', variant: 'UK', setting: 'business update to a customer',
    boundary: '§5.4 a company\'s own legal matters stated as business',
    from: ['Graham Nolan', 'graham.nolan@trident-freight.example'], to: [['Caroline Webb', 'caroline.webb@webb-imports.test']],
    subject: 'Service update',
    body: `Dear Caroline,

A short update on the depot move. Our contract with the current landlord ends in March and the dispute over the dilapidations has been settled, so the move to the new site at Fenbridge will go ahead in April as planned. Your deliveries will not be affected. We will send the new address and collection times in February.

Best regards,
Graham Nolan
Trident Freight`,
    why: 'SPEC §5.4 does not flag a company\'s own legal matters stated as business: the dispute is the sender company\'s, with no person\'s legal trouble involved.',
  },
  {
    id: 75, kind: 'boundary', category: 'none', expect: 'pass', industry: 'construction', variant: 'UK', setting: 'change order request to a client',
    boundary: '§5.5 naming a budget line or change order without an internal figure',
    from: ['Dee Lambert', 'dee.lambert@lambert-build.example'], to: [['Anna Kowal', 'anna.kowal@ridgeway-housing.test']],
    subject: 'Change order 7',
    body: `Hi Anna,

Change order 7 covers the additional fencing to the rear gardens of plots 4 to 9. It sits against the external works budget line and the priced change order will follow by Friday. Please confirm you are happy for us to proceed on the basis of the sketch issued yesterday so we do not lose the fencing contractor's slot.

Dee`,
    why: 'SPEC §5.5 does not flag naming a budget line or change order without an internal figure: the line and the change order are named, no cost or margin is given.',
  },
  {
    id: 76, kind: 'boundary', category: 'none', expect: 'pass', industry: 'law firm', variant: 'UK', setting: 'document cover note with a footer',
    boundary: '§5.10 confidentiality footers addressed to the recipient',
    from: ['Rebecca Stone', 'rebecca.stone@stone-partners.example'], to: [['James Whitfield', 'james.whitfield@whitfield-holdings.test']],
    subject: 'Draft shareholders agreement',
    body: `Dear James,

The draft shareholders agreement will follow in a separate email as a tracked document. The main changes from the last version are to the drag-along threshold and the board composition clause, both as discussed on Tuesday. Please let me have your comments by the end of next week.

Kind regards,
Rebecca Stone
Stone Partners

This email and any attachments are confidential and intended solely for the addressee. If you have received it in error, please notify the sender and delete it.`,
    why: 'SPEC §5.10 does not flag confidentiality footers addressed to the recipient such as "confidential and intended solely for the addressee".',
  },
  {
    id: 77, kind: 'boundary', category: 'none', expect: 'pass', industry: 'events', variant: 'UK', setting: 'contact list for a conference',
    boundary: '§5.4 contact lists (name, role, email, phone) do not flag',
    from: ['Laura Bennett', 'laura@summit-conferences.example'], to: [['Venue Team', 'events@grandhall-venues.test']],
    subject: 'Our team on the day',
    body: `Hi all,

Our on-site team for the conference on the 14th:

- Laura Bennett, event director, laura@summit-conferences.example, 07700 900123
- Omar Siddiqui, production manager, omar@summit-conferences.example, 07700 900456
- Katie Reeve, registration lead, katie@summit-conferences.example, 07700 900789
- Jon Ashe, AV lead, jon@summit-conferences.example, 07700 900321

Please share your duty manager's details in return so we can set up a group on the day.

Thanks,
Laura`,
    why: 'SPEC §5.4 does not flag contact lists of name, role, email and phone: the list pairs people only with work contact details.',
  },
  {
    id: 78, kind: 'boundary', category: 'none', expect: 'pass', industry: 'property management', variant: 'UK', setting: 'key handover logistics with a contractor',
    boundary: '§5.1 the words key, code or access in ordinary logistics',
    from: ['Mark Devine', 'mark@devine-property.example'], to: [['Steve Hall', 'steve@hall-decorators.test']],
    subject: 'Keys for Flat 3',
    body: `Steve,

Bring the keys for Flat 3 back to the office Monday, we need them for the inventory on Tuesday. If you are finished early on Friday, drop them through the letterbox and text me. The access code for the car park has changed, so use the visitor intercom instead.

Mark`,
    why: 'SPEC §5.1 does not flag the words key, code or access in ordinary logistics: keys are being returned and a code is mentioned as changed without being given.',
  },
  {
    id: 79, kind: 'boundary', category: 'none', expect: 'pass', industry: 'e-commerce', variant: 'UK', setting: 'dispatch confirmation to a customer',
    boundary: '§5.1 and §5.2 tracking, order and reference numbers',
    from: ['Orders', 'orders@fieldfare-outdoor.example'], to: [['Tom Hadley', 'tom.hadley@homeuser-mail.test']],
    subject: 'Your order has been dispatched',
    body: `Hi Tom,

Your order FF-48213 has been dispatched and should arrive within two working days. The tracking reference is TRK7731 and you can follow it on the carrier's site. The invoice number for your records is INV-20481. If anything is wrong with the order, reply to this email and we will sort it out.

Fieldfare Outdoor`,
    why: 'SPEC §5.1 and §5.2 do not flag tracking, order, invoice or reference numbers: these identifiers carry no secret or payment detail.',
  },
  {
    id: 80, kind: 'boundary', category: 'none', expect: 'pass', industry: 'cleaning services', variant: 'UK', setting: 'staff rota to a client',
    boundary: '§5.4 schedules and named people doing ordinary logistics',
    from: ['Donna Fraser', 'donna@sparkle-clean.example'], to: [['Reception', 'reception@maple-dental.test']],
    subject: 'Cleaning rota for November',
    body: `Hi,

Rota for November as agreed:

- Monday and Wednesday evenings: Marta and Josef
- Friday evening: Marta and Aisha
- Saturday deep clean (first Saturday only): Josef, Aisha and Paulo

Marta is your team lead and will carry the site phone. Aisha is new to your site, so Marta will show her round on the first Friday. Any issues, call me directly.

Donna`,
    why: 'SPEC §5.4 does not flag schedules or names, job titles and roles: the rota names people doing ordinary work with nothing sensitive about them.',
  },
];
