export default [
{
industry: 'legal', english: 'UK',
why: 'SPEC §5.4: solicitor sends a business client a completion checklist for a share purchase; a company legal matter stated as business',
from: ['James Thornton', 'j.thornton@harrowgatesolicitors.example'],
to: [['Laura Bennett', 'laura.bennett@bennettfoodservice.example']],
cc: [['Amir Khan', 'a.khan@harrowgatesolicitors.example']],
subject: 'Acquisition of Dale Valley Catering Ltd: completion checklist',
body: `Dear Laura,

We're on track for completion of the purchase of Dale Valley Catering Ltd on Friday 27 November. Here's where things stand on the completion checklist.

Agreed and ready
- Share purchase agreement: final form agreed with the sellers' solicitors yesterday.
- Disclosure letter: received and reviewed. Nothing in it changes our earlier advice.
- Tax deed: agreed.
- Stock transfer forms: in agreed form, to be signed by both sellers at completion.

Still to do
- Board minutes: your board needs to approve the purchase. I've attached draft minutes for a meeting before completion.
- Bank consent: Dale Valley's bank must release its charge over the company's assets. The sellers' solicitors expect the release letter by Wednesday.
- Customer contracts: two of the larger contracts need the customer's consent because of the change of control. One consent is in; Amir is chasing the other.
- Completion funds: the completion statement will follow on Monday. As always, please call me to confirm the amount and our client account details before you transfer anything.

Signing
We'll circulate signature pages on Tuesday. You can sign electronically, and we'll hold your signatures until everything else is in place.

If you'd like to talk anything through, I'm in the office all week.

Kind regards,

James Thornton
Partner, Corporate
Harrowgate Solicitors LLP

Harrowgate Solicitors LLP is authorised and regulated by the Solicitors Regulation Authority. This email is confidential and may be legally privileged. We will never change our bank details by email.`,
},
{
industry: 'healthcare clinic', english: 'US',
why: 'SPEC §5: clinic onboards a billing company with process questions, sharing no patient details or other §5 disclosure',
from: ['Teresa Gomez', 'tgomez@sunvalleyfamilyclinic.example'],
to: [['Kevin Shaw', 'kshaw@claimbridgebilling.example']],
subject: 'Next steps for moving our billing to ClaimBridge',
body: `Hi Kevin,

Thanks for the kickoff call on Monday. Dr. Patel and I are glad to get started. Here's what I've pulled together so far, and a few questions.

Ready to send
- Our fee schedule for 2026
- The list of insurance plans we accept, with our provider numbers for each plan in the credentialing file you asked for (I'll upload it to the shared folder, not by email)
- Our current aging report summary by payer, so you can see what's still outstanding

Questions
1. Cut-over date: we'd like you to take over all claims for visits from January 1. Our current billing service will finish working the claims for visits before that. Does that work on your side?
2. Statements: will you send patient statements under our clinic's name, or ClaimBridge's? Patients are used to seeing our name, so we'd prefer that.
3. Reporting: can we get a monthly summary of collections and denials by payer? A short call once a month to go through it would also help.
4. Access: which of our staff will need logins to your portal? I'm thinking me and our front desk lead.

I'm in the clinic Monday to Thursday. Let me know a good time for our next call.

Thanks,
Teresa

Teresa Gomez
Practice Administrator
Sun Valley Family Clinic
(555) 018-2210`,
},
{
industry: 'accounting', english: 'AU',
why: 'SPEC §5.5: accountant quotes annual compliance fees to a new company client; customer-facing fees, no internal cost',
from: ['Matthew Doyle', 'matthew@coastalbaypartners.example'],
to: [['Jasmine Lee', 'jasmine@leeandsonsjoinery.example']],
subject: 'Our fees for Lee & Sons Joinery Pty Ltd',
body: `Hi Jasmine,

Thanks for meeting with me on Thursday. It was great to hear how the business has grown since you set up the company. As promised, here's what we'd do each year and what it would cost.

Annual compliance
- Financial statements for the company
- Company tax return
- ASIC annual review and solvency resolution
- Individual tax returns for you and Daniel as directors
Fee: $4,950 inc GST per year

Quarterly
- Review of your bookkeeping in Xero
- Preparing and lodging the BAS
Fee: $550 inc GST per quarter

Payroll support
- Setting up Single Touch Payroll and checking award rates for your three apprentices
- Year-end STP finalisation
Fee: $880 inc GST per year

You can pay annually, or we can spread it over 12 monthly direct debits at no extra cost.

Advice outside these areas, such as buying the new workshop you mentioned, is charged at $220 per hour, and we'll always give you an estimate first.

If you're happy to go ahead, I'll send our engagement letter and the authority forms so we can take over from your current accountant.

Cheers,
Matthew

Matthew Doyle CA
Director, Coastal Bay Partners
Liability limited by a scheme approved under Professional Standards Legislation`,
},
{
industry: 'construction', english: 'UK',
why: 'SPEC §5: weekly progress report to a client with an attached programme; no §5.1–§5.8 disclosure',
from: ['Liam Doherty', 'liam.doherty@whitestonecontractors.example'],
to: [['Jane Fairclough', 'jane.fairclough@harringtonacademytrust.example']],
cc: [['Mark Ellis', 'mark.ellis@whitestonecontractors.example']],
subject: 'St Anne\'s science block: progress report, week 14',
body: `Dear Jane,

Here's our progress report for week 14 on the St Anne's science block.

Progress this week
- Roof: the membrane is complete and the building is now watertight.
- Windows: 18 of the 24 windows are installed. The last six arrive on Tuesday.
- First fix: mechanical and electrical first fix is complete on the ground floor and has started on the first floor.
- External works: the drainage connection to the main sewer was completed on Thursday.

Programme
We're one week behind on the windows because of the supplier's delay, but we've brought the internal partitions forward to make up the time. The completion date of 12 February is unchanged. The updated programme is attached.

Health and safety
No accidents or near misses this week. The site was inspected by our safety adviser on Wednesday with no actions raised.

School liaison
The noisy work on the north side will finish by Friday 13 November, before the mock exams start. Deliveries will continue to avoid drop-off and pick-up times.

Next week
- Install the remaining windows
- First fix on the first floor
- Start plasterboarding on the ground floor

Please let me know if you have any questions before the site meeting on Thursday.

Kind regards,

Liam Doherty
Project Manager, Whitestone Contractors Ltd`,
attachments: [{ name: 'st-annes-programme-wk14.csv', text: `Activity,Start,Finish,Status
Roof membrane,2026-10-12,2026-11-06,Complete
Windows,2026-10-26,2026-11-13,In progress (18 of 24)
M&E first fix ground floor,2026-10-19,2026-11-06,Complete
M&E first fix first floor,2026-11-02,2026-11-20,In progress
Internal partitions,2026-11-09,2026-11-27,Brought forward
Plasterboard ground floor,2026-11-16,2026-12-04,Not started
Plasterboard first floor,2026-11-30,2026-12-18,Not started
Second fix,2027-01-04,2027-01-22,Not started
Decoration and flooring,2027-01-18,2027-02-05,Not started
Commissioning and handover,2027-02-01,2027-02-12,Not started
` }],
},
{
industry: 'manufacturing', english: 'US',
why: 'SPEC §5.5: supplier answers an RFQ with unit prices and lead times stated to the buyer; no internal cost or margin',
from: ['Jenny Walsh', 'jwalsh@midwestprecisionmolding.example'],
to: [['Raj Iyer', 'raj.iyer@lumenhomeappliances.example']],
subject: 'RFQ 2026-311 response: knob and bezel set',
body: `Hi Raj,

Thanks for including us in RFQ 2026-311. Our quote for the knob and bezel set is below, and the formal quote is attached.

Part LHA-4410, control knob, ABS, matte black
- 10,000 pcs: $0.42 each
- 25,000 pcs: $0.37 each
- 50,000 pcs: $0.34 each

Part LHA-4412, bezel, PC/ABS, brushed silver finish
- 10,000 pcs: $0.88 each
- 25,000 pcs: $0.79 each
- 50,000 pcs: $0.74 each

Tooling
- Two-cavity tool for the knob: $14,500
- Single-cavity tool for the bezel: $18,200
Tooling is a one-time charge. You own the tools, and we maintain them at no charge for the life of the program.

Lead times
- Tooling and first articles: 8 weeks from the purchase order and approved 3D files
- Production: 3 weeks from release, after first article approval

Quality
We'd supply a PPAP Level 3 package with first articles, including a dimensional report against your drawing.

One question on the bezel: the drawing calls out a brushed finish on the outer face. Is that textured in the tool, or a secondary process? We've quoted it as textured in the tool, which keeps the part cost down.

Prices are valid for 60 days, FOB our plant in Grand Rapids.

Best regards,
Jenny

Jenny Walsh
Sales Engineer
Midwest Precision Molding
(555) 017-6689`,
},
{
industry: 'events', english: 'AU',
why: 'SPEC §5.1: market organiser sends stallholders bump-in logistics; site access directions with no code, key location or security gap',
from: ['Rachel Hollis', 'stalls@riverbendmakersmarket.example'],
to: [['Mei Chen', 'mei@paperandpetalstudio.example']],
subject: 'Your stall at the Riverbend Makers Christmas Market',
body: `Hi Mei,

Thanks for booking a stall at the Riverbend Makers Christmas Market on Saturday 12 December. Your stall information pack is attached. Here are the key points.

Your stall
Stall number: 47
Size: 3 m x 3 m, under the main marquee
Power: one 10-amp outlet (as requested)

Bump-in
Stallholders can arrive from 6am. Please come in via the Wharf Street entrance and unload at the marquee, then move your car to the stallholder parking on Gibson Lane before 7.30am. The market opens to the public at 8am.

On the day
- Bring your own table, chairs and weights for your gazebo legs if you're outside the marquee.
- Have your public liability insurance certificate with you. You've already uploaded it, but we do spot checks.
- Our volunteers will come round at 7.45am with coffee.

Bump-out
The market closes at 2pm. Please don't pack down before 2pm, and don't bring vehicles onto the site until 2.30pm, when the crowds have left.

Your stall fee of $95 has been received, thank you.

If you have any questions before the day, just reply to this email.

Cheers,
Rachel

Rachel Hollis
Stallholder Coordinator
Riverbend Makers Market`,
attachments: [{ name: 'riverbend-stallholder-pack-dec.txt', text: `Riverbend Makers Christmas Market
Stallholder information pack
Saturday 12 December 2026, 8am to 2pm

Timings
6.00am  Bump-in opens (Wharf Street entrance)
7.30am  All vehicles off site
8.00am  Market opens
2.00pm  Market closes
2.30pm  Vehicles allowed back on site for bump-out
4.00pm  Site clear

What to bring
- Table, chairs and signage
- Gazebo weights (at least 10 kg per leg) if outside
- Public liability insurance certificate
- Float and card reader
- Rubbish bags (please take your rubbish home)

Rules
- No generators
- No selling of items not listed on your application
- Keep walkways clear of stock and cables

Contact on the day: Rachel at the information tent next to the stage
` }],
},
{
industry: 'hospitality', english: 'UK',
why: 'SPEC §5: short pub booking confirmation for an office Christmas party; no §5.1–§5.8 disclosure',
from: ['Kate Mullins', 'bookings@theploughandharrow.example'],
to: [['Sian Edwards', 'sian.edwards@caerleonsurveys.example']],
subject: 'Re: Christmas do, Friday 11 December',
body: `Hi Sian,

That's all booked: the back room for 22 from 7pm on Friday 11 December, with the festive buffet at £24 a head. We'll have the £150 deposit off the final bill.

Final numbers by the Monday before, please.

Cheers,
Kate
The Plough & Harrow`,
},
{
industry: 'property management', english: 'US',
why: 'SPEC §5: homeowners association approves a homeowner\'s fence application with conditions; no §5.1–§5.8 disclosure',
from: ['Architectural Review Committee', 'arc@foxhollowhoa.example'],
to: [['Daniel and Priya Nolan', 'nolanfamily@inboxly.test']],
subject: 'ARC approval: fence application for 118 Foxglove Lane',
body: `Dear Mr. and Mrs. Nolan,

Thank you for submitting your application to install a fence at 118 Foxglove Lane. The Architectural Review Committee reviewed it at the November 3 meeting and has approved it, with the conditions below.

Approved
- 5-foot black aluminum fence along the rear and side property lines, as shown on your site plan
- One 4-foot gate on the left side of the house

Conditions
1. The fence must be set back at least 2 feet from the front corner of the house on each side, as required by section 7.3 of the design guidelines.
2. The color must be black, as shown on your application. Bronze or white are not approved for this neighborhood.
3. Please call 811 before digging so underground utilities can be marked.
4. The work must be completed within six months of this approval. After that, you'd need to reapply.

Once the fence is installed, please email a photo to this address so we can close the application.

If you have any questions about the conditions, you're welcome to attend the committee's next meeting on December 1 at 7:00 p.m. in the clubhouse.

Thank you,
Architectural Review Committee
Fox Hollow Homeowners Association
Managed by Keystone Community Management`,
},
{
industry: 'freight forwarding', english: 'AU',
why: 'SPEC §5: forwarder updates an importer on a vessel delay and revised arrival; no §5.1–§5.8 disclosure',
from: ['Adam Rowe', 'adam.rowe@southernportlogistics.example'],
to: [['Bianca Ferrari', 'bianca@ferrarihomewares.example']],
subject: 'Delay: your container on the MV Coral Pioneer',
body: `Hi Bianca,

I wanted to let you know about a delay to your container of outdoor furniture from Ningbo.

The MV Coral Pioneer has been held at Singapore for three days because of port congestion. The shipping line has now given a revised arrival into Port Botany of Friday 20 November, instead of Tuesday 17 November.

What this means for you
- Customs clearance: we've already lodged the entry, so it should clear on arrival as long as there are no inspections.
- Delivery to your warehouse: we've moved your booking to Tuesday 24 November, at 9am. Let me know if that doesn't suit.
- Storage and detention: we don't expect any extra port storage or container detention charges with the new dates, but I'll let you know straight away if that changes.

I know you were hoping to have the furniture in stores before the start of December. If it helps, we can deliver half the container on the Monday and the rest later in the week, so you can get stock moving to your busiest stores first.

I'll send another update once the vessel leaves Singapore.

Cheers,
Adam

Adam Rowe
Import Coordinator
Southern Port Logistics
(02) 5550 7713`,
},
{
industry: 'recruitment', english: 'AU',
why: 'SPEC §5.4: agency arranges second interviews with a client, naming candidates without any HR or personal matter',
from: ['Zoe Hartley', 'zoe@ridgelinepeople.example'],
to: [['Andrew Cole', 'andrew.cole@bayviewaccounting.example']],
subject: 'Second interviews: Senior Accountant role',
body: `Hi Andrew,

Thanks for the quick feedback on the first round. I've spoken with both of your preferred candidates and they're keen to come back in.

Here's what I've arranged, subject to your confirmation:

Thursday 19 November
- 10.00am: Rebecca, with you and Sharon
- 2.00pm: Harrison, with you and Sharon

You mentioned wanting to include a short practical task. Both candidates are comfortable with that. If you send me the task by Tuesday, I'll let them know roughly what to expect, without sharing the details.

They both asked about the hybrid working arrangement. I told them what you told me: two days a week from home after the first three months, with Tuesdays in the office for everyone. If that's changed, please let me know so I can update them.

Rebecca has given me a start date of early January if she's successful. Harrison is available from mid-December.

Could you confirm the times by tomorrow afternoon?

Cheers,
Zoe

Zoe Hartley
Principal Consultant, Accounting and Finance
Ridgeline People
0491 570 926`,
},
{
industry: 'SaaS', english: 'US',
why: 'SPEC §5.1: support reply explaining how to set up webhooks and where to create a signing secret, without any key or secret given',
from: ['Priya Raman', 'support@shipnest.example'],
to: [['Derek Olsen', 'derek@olsenoutdoorgear.example']],
subject: 'Re: Getting order updates into our warehouse system [Ticket 77120]',
body: `Hi Derek,

Thanks for the details about your warehouse system. Webhooks are the best way to do this, so your system hears about new and updated orders as soon as they happen, rather than checking every few minutes.

Here's how to set it up:

1. In ShipNest, go to Settings > Developers > Webhooks and click Add endpoint.
2. Enter the URL your warehouse system gives you for incoming events. It has to start with https.
3. Choose the events you want. For what you described, I'd pick order.created, order.updated and order.cancelled.
4. Save the endpoint. ShipNest will create a signing secret for it. Copy it from that screen into your warehouse system's settings, so it can check that each message really came from us. Don't send it to us or paste it into a ticket; we never need it.
5. Click Send test event and check that your system received it.

A couple of tips:
- If your system doesn't respond within 10 seconds, we'll retry the event up to five times over the next hour.
- You can see each delivery attempt and its response under the endpoint's Logs tab, which helps a lot when testing.

Our developer docs have sample payloads for each event. Let me know if you run into any trouble and I'll take a look at the logs with you.

Best,
Priya
ShipNest Support`,
},
{
industry: 'healthcare clinic', english: 'AU',
why: 'SPEC §5.8: clinic tells patients it is moving premises, with recipients in Bcc and no individual\'s health details',
from: ['Reception', 'reception@harbourphysio.example'],
to: [['Harbour Physiotherapy', 'reception@harbourphysio.example']],
bcc: [['Patient', 'j.osullivan@postbox.test'], ['Patient', 'mtran@inboxly.test'], ['Patient', 'w.hughes@postbox.test'], ['Patient', 'ellie.b@inboxly.test'], ['Patient', 'r.kapoor@postbox.test']],
subject: 'We\'re moving: Harbour Physiotherapy from 30 November',
body: `Hello,

We're excited to let you know that Harbour Physiotherapy is moving to a bigger, brighter clinic just down the road.

New address from Monday 30 November
Suite 2, 88 Harbour Street (above the pharmacy, next to the bakery)

What's new
- Five treatment rooms instead of three, so more appointments are available, including early mornings
- A larger exercise studio for our Pilates and strength classes
- A lift from the street, so the clinic is fully accessible
- Parking at the rear, off Lane Street, with two hours free for clients

What stays the same
- Our phone number and email address
- Your physio, and any appointments you've already booked (they'll simply be at the new address)
- Our online booking page

Our current rooms will close at 1pm on Friday 27 November while we move. We'll be open as normal at the new clinic from 7am on Monday 30 November.

We'd love to show you around. If you have any questions, just reply to this email or call us on (02) 5550 6612.

Warm regards,
The team at Harbour Physiotherapy

You're receiving this because you're a client of Harbour Physiotherapy. Reply "unsubscribe" if you'd prefer not to receive clinic news.`,
},
{
industry: 'accounting', english: 'UK',
why: 'SPEC §5: accountant reminds a company client of filing deadlines; no §5.1–§5.8 disclosure',
from: ['Rachel Owusu', 'rachel@kingsbridgeaccountants.example'],
to: [['David Hale', 'david@halehorticulture.example']],
subject: 'Year end 31 December: dates for your diary',
body: `Hi David,

With your company's year end coming up on 31 December, here are the dates to keep in mind.

Before 31 December
- If you're planning to buy the new polytunnel or any other equipment, buying before the year end brings the tax relief into this year.
- Please make sure any director's expenses you'd like reimbursed are claimed and paid through the business by then.

January
- We'll send you our year-end checklist in the first week of January.
- Stock count: please count your plants and sundries stock on 31 December or as close to it as you can. A simple list with quantities is fine.

Deadlines after year end
- Annual accounts filed at Companies House: 30 September 2027
- Corporation tax payment: 1 October 2027
- Company tax return: 31 December 2027

We aim to have everything finished well before then. If we can have your records by the end of February, we'll have draft accounts ready for you in April.

Have a good Christmas, and I hope the season's been busy for you.

Best wishes,
Rachel

Rachel Owusu FCCA
Kingsbridge Accountants
Kingsbridge Accountants Ltd is registered in England and Wales. This email is intended only for the addressee.`,
},
{
industry: 'nonprofit', english: 'US',
why: 'SPEC §5: nonprofit submits a grant application to a foundation with the amount requested; no §5.1–§5.8 disclosure',
from: ['Carmen Ortiz', 'carmen@greenwaycommunitygardens.example'],
to: [['Grants Team', 'grants@hollingsworthfoundation.example']],
subject: 'Application: Neighborhood Food Gardens, spring 2027 grant cycle',
body: `Dear Grants Team,

Please find attached Greenway Community Gardens' application for the spring 2027 grant cycle, for our Neighborhood Food Gardens program.

Summary of the request
We're requesting $35,000 over 12 months to build four new raised-bed gardens at public housing sites on the east side and to run a season of free gardening workshops for residents.

The application includes:
- Completed application form
- Program budget and narrative
- Our most recent audited financial statements
- Board of directors list
- IRS determination letter
- Letters of support from the city housing authority and the East Side Neighborhood Council

Last year's results
Our existing gardens produced about 6,200 pounds of vegetables, which went to residents and two local food pantries. More than 300 residents attended at least one workshop.

If you need anything else, or would like to visit one of our current gardens, please let me know. The Maple Street garden is open on Saturday mornings, and we'd love to show you around.

Thank you for considering our application.

Sincerely,
Carmen Ortiz
Executive Director
Greenway Community Gardens
(555) 019-5541`,
},
{
industry: 'trades', english: 'AU',
why: 'SPEC §5: two-line arrival update from a plumber to a customer; no §5.1–§5.8 disclosure',
from: ['Mick Donnelly', 'mick@donnellyplumbing.example'],
to: [['Rachel Webb', 'rachel.webb@postbox.test']],
subject: 'Re: Blocked drain at Cedar Court',
body: `On my way now, about 20 minutes out. I'll bring the camera in case we need a look down the line.

Mick`,
},
{
industry: 'engineering', english: 'UK',
why: 'SPEC §5.7: structural engineer and architect disagree about a beam size in a quoted thread; criticism of a design, no insult or other §5 disclosure',
from: ['Graham Pike', 'graham.pike@pikestructures.example'],
to: [['Laura Finch', 'laura@finchandwoodarchitects.example']],
cc: [['Tom Walsh', 'tom@walshbuilders.example']],
subject: 'RE: RE: 22 Clifton Road: rear opening beam',
body: `Laura,

I understand why you want the shallower beam, but I can't sign off a 203 deep section over that opening.

The issue isn't strength, it's deflection. With the 5.4 m span, the load from the new bedroom above and the masonry of the gable wall, a 203 section would deflect more than the glazing supplier allows. Their limit for the sliding doors is span over 500, and the 203 section only gets to around span over 320. That's the kind of movement that cracks plaster upstairs and stops sliding doors running properly.

I've looked again at the options:

1. 254 deep UB, as in my original design. It works comfortably, but it sits 50 mm lower than you'd like, so the head of the doors drops.
2. Two smaller beams side by side, at 203 deep. They meet the deflection limit, but they're heavier and need wider padstones, which Tom says would make the install more difficult.
3. A steel goalpost frame with the beam set up into the floor zone. This keeps your head height but needs the first-floor joists to be hung off the beam, so it's more work for Tom.

I'd recommend option 3 if the head height matters most to your client, and option 1 if cost and programme matter more. I'm happy to talk it through on site with you both.

Graham

Graham Pike CEng MIStructE
Director, Pike Structures Ltd

-----Original Message-----
From: Laura Finch
Sent: 4 November 2026 16:05
To: Graham Pike
Cc: Tom Walsh
Subject: RE: 22 Clifton Road: rear opening beam

Hi Graham,

Thanks for the calcs. The 254 beam is a problem for us. The client really wants the door head to line up with the top of the kitchen units, and the deeper beam would bring it down by 50 mm.

Is there any way to use a 203 section instead? Tom says he's used them on similar openings before.

Thanks,
Laura

Laura Finch
Finch & Wood Architects

-----Original Message-----
From: Graham Pike
Sent: 2 November 2026 10:30
To: Laura Finch
Cc: Tom Walsh
Subject: 22 Clifton Road: rear opening beam

Hi Laura,

Please find attached my calculations for the beam over the new rear opening at 22 Clifton Road. I've specified a 254 x 146 x 37 UB, bearing on concrete padstones at each end, with the details on drawing S-02.

Let me know if you have any questions.

Graham`,
},
{
industry: 'legal', english: 'US',
why: 'SPEC §5.4: employment lawyer advises a business client on a general remote-work policy, with no identifiable employee\'s HR matter',
from: ['Natalie Ross', 'nross@whitmanrossemploymentlaw.example'],
to: [['Brian Cho', 'brian.cho@cascadesurveying.example']],
subject: 'Remote work policy: draft for your handbook',
body: `Hi Brian,

As we discussed, I've drafted a remote work policy for Cascade Surveying's employee handbook. The draft is attached. Here are the main points and a few decisions for you to make.

What the policy covers
- Who can work remotely: roles you designate as eligible, with manager approval. Field crews are excluded because their work is on site.
- Schedule: up to two remote days a week, agreed with each manager in advance.
- Equipment: the company provides a laptop and monitor. Employees provide a safe workspace and a reliable internet connection.
- Expenses: we've included a monthly stipend for internet and phone costs, which helps meet the state's expense reimbursement rule.
- Timekeeping: non-exempt employees must record all time worked, including at home, and take meal and rest breaks as usual.
- Confidential information: client files stay on company systems and aren't printed at home.

Decisions for you
1. The stipend amount. Many firms your size use $50 to $75 a month. Please let me know what you'd like.
2. Whether employees can work from outside the state. I'd recommend not, at least for now, as it creates tax and registration issues.
3. Whether the company can end remote arrangements with notice, and if so, how much notice. I've suggested two weeks.

Once you've decided these points, I'll finalize the policy. I'd also suggest a short note to staff explaining it when it goes into the handbook.

Best regards,
Natalie

Natalie Ross
Partner, Whitman Ross Employment Law LLP

This email may contain confidential and privileged information. If you received it by mistake, please let us know and delete it.`,
},
{
industry: 'agriculture', english: 'AU',
why: 'SPEC §5: livestock agent reports sale results and prices achieved to the vendor; no §5.1–§5.8 disclosure',
from: ['Bruce McKenzie', 'bruce@highcountrylivestock.example'],
to: [['Ian and Kerry Walsh', 'walshgrazing@ruralmail.test']],
subject: 'Your cattle at the Wodonga store sale',
body: `G'day Ian and Kerry,

Good news from today's store sale at Wodonga. Your steers sold well, and the market was strong for well-bred cattle.

Results
- 42 Angus steers, 10 to 12 months, average 348 kg: sold at $1,640 per head, about 471 c/kg
- 18 Angus steers, the tail of the line, average 292 kg: sold at $1,315 per head, about 450 c/kg

Gross: $92,550
The account sale, with commission, yard dues and the transit levy taken out, will come through by email tomorrow. Payment goes into your nominated account within seven days, as usual.

The buyers
The top pen went to a feedlot buyer from the Riverina, and the tail went to a local restocker who's been buying your cattle for a few years now.

Comments
The buyers liked how quiet and even the cattle were, and several asked whether you'd have more in the autumn. If you're thinking of selling the heifers in March, let's talk in January about timing, as the March sales are usually the busiest.

Thanks for your business again this year.

Cheers,
Bruce

Bruce McKenzie
Livestock Agent, High Country Livestock & Property
0491 570 418`,
},
{
industry: 'events', english: 'UK',
why: 'SPEC §5: charity thanks a venue after a fundraising gala; no §5.1–§5.8 disclosure',
from: ['Eleanor Hughes', 'eleanor.hughes@wyvernchildrenscharity.example'],
to: [['Paul Simmonds', 'paul.simmonds@thecornexchangeevents.example']],
subject: 'Thank you for a wonderful gala evening',
body: `Dear Paul,

I'm writing to thank you and the whole team at the Corn Exchange for Saturday's winter gala.

The evening couldn't have gone better. The room looked beautiful, the food was excellent, and so many guests told me how smoothly everything ran, from the drinks reception to the last dance. Your team handled the late change to the auction timing without any fuss, and the sound for the speeches was the best we've ever had.

Thanks to our guests' generosity, the gala raised £64,300, our highest total yet. It will fund our family support workers for another year.

I'd also like to mention Hannah and Josef by name. Hannah kept the evening running to time, and Josef stayed late to help our volunteers pack up the auction lots. Please pass on our thanks.

We'd love to hold next year's gala with you again. Could you send me the available Saturdays in late November 2027 when you have them?

With warmest thanks,

Eleanor Hughes
Events and Fundraising Manager
Wyvern Children's Charity
Registered charity in England and Wales`,
},
{
industry: 'video production', english: 'AU',
why: 'SPEC §5.7: production company firmly explains a music licensing limit to a client while delivering the final edit; no insult or other §5 disclosure',
from: ['Jordan Tate', 'jordan@lightwellfilms.example'],
to: [['Sophie Grant', 'sophie.grant@coastalcreditunion.example']],
subject: 'Final cut delivered: "Our Community" brand film',
body: `Hi Sophie,

The final cut of the "Our Community" brand film is ready. You'll find all the files in the delivery folder:
- 90-second master in 4K and 1080p
- 30-second and 15-second cutdowns
- Square and vertical versions for social
- Captions files for each version

Thanks to you and the team for the quick feedback on the last round. All of your notes are in, including the new end card and the updated branch photo.

On the music
I need to be clear about one thing before the film goes out. The track we've used is licensed for online and social use for two years, as in our quote. It isn't licensed for TV or cinema. Your marketing team mentioned last week that they'd like to run the 30-second version on regional TV in the new year.

If you'd like to do that, we have two options:
1. Upgrade the licence for TV use. The upgrade for 12 months of regional TV is $1,850.
2. Swap the track in the TV version for one already cleared for broadcast. We'd need half a day to recut it, at no extra charge.

Please don't use the current version on TV until we've sorted this out, as it could create a problem with the music library.

It was a real pleasure making this film with you. Let me know which music option you'd like, and I'll get it underway.

Cheers,
Jordan

Jordan Tate
Producer, Lightwell Films`,
},
];
