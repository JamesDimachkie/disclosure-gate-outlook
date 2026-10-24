// everyday2 batch 08. Hand-written literals; see ../serialize.mjs for the schema wrapper.
export default [
  {
    category: 'none', expect: 'pass',
    why: `Record shop to a customer about a pre-order; nothing under SPEC §5.`,
    industry: 'record shop', variant: 'UK',
    from: { name: 'Spin Records', address: 'shop@spinrecordsbristol.example' },
    to: [{ name: 'Tom', address: 'tom.vickers@gmailbox.test' }],
    subject: `Your pre-order's landed`,
    body: `Hi Tom,

The limited pressing you pre-ordered came in this morning, the clear vinyl one. We'll hold it behind the counter for two weeks. £28.99 as paid, nothing more to pay.

Also, the signing on the 15th is confirmed, doors at 6, wristbands with any purchase of the album from today.

Cheers,
Spin`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Games shop to a customer about a tournament; nothing under SPEC §5.`,
    industry: 'tabletop games shop', variant: 'US',
    from: { name: 'The Dice Tower', address: 'events@dicetowergames.example' },
    to: [{ name: 'Alex Kim', address: 'alexkim.plays@mailhub.test' }],
    subject: `Saturday tournament - you're in`,
    body: `Hey Alex,

You're registered for Saturday's Commander tournament. Doors 11 AM, pods start at noon, 4 rounds, prizes are store credit and promos. Entry is $10 at the door. Bring your own deck, proxies not allowed in the top 8.

We'll have pizza around 2. See you there!

Jess
The Dice Tower`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Comic shop subscription note; nothing under SPEC §5.`,
    industry: 'comic shop', variant: 'CA',
    from: { name: 'Panel One Comics', address: 'subs@panelonecomics.example' },
    to: [{ name: 'Dev Sharma', address: 'devsharma@worldmail.test' }],
    subject: `Your pull list - this week`,
    body: `Hi Dev,

This week in your pull box: Saga #78, Ultimate Spider-Man #22, and the Absolute Batman hardcover you asked us to hold. The variant you wanted for Saga sold out at the distributor, sorry, we've put the regular cover in.

Boxes are held for 4 weeks. Open till 7 tonight.

Panel One`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Art supplies shop replying to a teacher about a bulk order; customer-facing discount (SPEC §5.5 does not flag).`,
    industry: 'art supplies shop', variant: 'UK',
    from: { name: 'Palette Art Supplies', address: 'orders@paletteartsupplies.example' },
    to: [{ name: 'Ms R Fielding', address: 'rfielding@abbeycollege.test' }],
    subject: `Re: A-level materials order`,
    body: `Dear Ms Fielding,

Thank you for the list. We can supply everything except the 300gsm hot-pressed watercolour paper in A2, which is out of stock until mid-November; we can substitute the cold-pressed at the same price or wait.

Education discount of 15% applies to the whole order, and delivery to the college is free over £200. The total with the discount comes to £684.20 inc VAT. If you can send a purchase order we'll invoice the college on 30-day terms.

Kind regards,
Palette`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Trophy engraver confirming an order for a club; nothing under SPEC §5.`,
    industry: 'trophy engraver', variant: 'UK',
    from: { name: 'Crestline Trophies', address: 'orders@crestlinetrophies.example' },
    to: [{ name: 'Awards Secretary', address: 'awards@thornburybowlingclub.test' }],
    subject: `Presentation night trophies - engraving list`,
    body: `Hi Margaret,

Thanks for the engraving list. To confirm: 14 trophies, engraving as per your spreadsheet, plus re-engraving the three perpetual shields with this year's winners. Ready for collection Thursday 13 November, in time for your presentation night on the 15th.

Please double check the spellings on the list, especially "Siobhan" and "Nikolaj", as we engrave exactly what's sent.

Total £212 as quoted.

Crestline Trophies`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Screen printer to a band about merch; customer-facing prices (SPEC §5.5 does not flag).`,
    industry: 'screen printer', variant: 'AU',
    from: { name: 'Inkhouse Screenprint', address: 'print@inkhousescreenprint.example' },
    to: [{ name: 'Jonno', address: 'jonno@thefallingleavesband.test' }],
    subject: `Re: tour tees`,
    body: `Hey Jonno,

Cheers for the artwork, looks sick. For 100 tees, 2-colour front, 1-colour back on the black Gildan heavyweight: $14.80 each, so $1,480 plus GST. Sizes as per your spread (S through 2XL). 7 working days from approval.

Screens are included; add a hoodie run later and the setup's already done.

Approve the mockup in the link and we'll kick off.

Nat`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Label printer sending a proof to a food producer; nothing under SPEC §5.`,
    industry: 'label printer', variant: 'UK',
    from: { name: 'StickyLabels', address: 'proofs@stickylabelsltd.example' },
    to: [{ name: 'Fran Oldfield', address: 'fran@hedgerowhoney.test' }],
    subject: `Proof - honey jar labels (2 designs)`,
    body: `Hi Fran,

Proofs for the two jar labels are in the link. We've matched the gold foil to your sample and the paper is the textured cream as requested. Please check the weight and the allergen text, and the best-before box position.

Once approved: 2,000 of each, 63mm round, on rolls, delivered in 5 working days. £146 plus VAT in total.

Thanks,
StickyLabels`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Storage warehouse to a client about stock and invoicing; nothing under SPEC §5.`,
    industry: 'third-party warehousing', variant: 'UK',
    from: { name: 'Account Manager', address: 'accounts@midlandstorageco.example' },
    to: [{ name: 'Operations', address: 'ops@aldertonfurniture.test' }],
    subject: `October storage statement + pallet count`,
    body: `Hi Ben,

October statement is in your portal: 186 pallets on average across the month at the contracted rate, plus 22 handling movements. Pallet count at close of month was 174.

Please note we'll be doing a full stock count on Saturday 8 November so no movements that day. Results will be shared Monday.

Thanks,
Midland Storage`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Convenience store to a supplier about a delivery problem; blunt criticism of a delivery, not a remark about a person (SPEC §5.7 does not flag).`,
    industry: 'convenience store', variant: 'UK',
    from: { name: 'Dev Patel', address: 'dev@patelsexpress.example' },
    to: [{ name: 'Customer Service', address: 'service@northwestwholesale.test' }],
    subject: `Delivery 24 Oct - short and late`,
    body: `Hi,

Friday's delivery was two hours late and missing the 4 cases of 2-litre milk and the bread order entirely. We were out of milk by 10am on a Saturday which is the worst day for it.

Please credit the missing items (they were on the invoice) and let me know what time I can actually expect the Tuesday drop.

Dev
Patel's Express`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Post office counter to a small business about a parcel service; nothing under SPEC §5.`,
    industry: 'post office', variant: 'UK',
    from: { name: 'Hartford Post Office', address: 'counter@hartfordpostoffice.example' },
    to: [{ name: 'Rosie', address: 'rosie@carrceramics.test' }],
    subject: `Drop and go - your account`,
    body: `Hi Rosie,

Your drop-and-go account is set up. Bring your parcels pre-labelled with the manifest sheet and we'll process them after the counter closes, so no queueing. Top up the account at the counter when it runs low.

Christmas last posting dates will be on the poster from next week; for your pottery I'd allow extra time for anything going abroad.

Thanks,
Jan`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Wine shop to a customer about a case order; nothing under SPEC §5.`,
    industry: 'wine merchant', variant: 'UK',
    from: { name: 'Corks of Chester', address: 'shop@corksofchester.example' },
    to: [{ name: 'Mr G Hartwell', address: 'g.hartwell@btmail.test' }],
    subject: `Your Christmas case`,
    body: `Dear Mr Hartwell,

Your mixed Christmas case is put together: the two Burgundies, the Rioja Reserva x 3, the Picpoul x 3, the Prosecco x 2 and the two bottles of the Tawny port. £246 with the case discount. We can deliver Thursday afternoon or you're welcome to collect.

The Barolo you asked about is due in next week; I'll hold one back for you to try.

Best wishes,
Hugh`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Ice cream parlour to a wedding couple about a cart booking; customer-facing price (SPEC §5.5 does not flag).`,
    industry: 'ice cream parlour', variant: 'UK',
    from: { name: 'Scoops', address: 'events@scoopsgelato.example' },
    to: [{ name: 'Amy and Jake', address: 'amyandjake@outlookmail.test' }],
    subject: `Ice cream cart - 6 June - confirmed`,
    body: `Hi Amy and Jake,

The cart is booked for your wedding on Saturday 6 June, serving 4pm to 6pm, 120 guests. You've chosen salted caramel, strawberry, pistachio and the vegan mango sorbet. We'll bring cones, tubs and the striped parasol.

£580 including staff and travel. Deposit received, thank you; balance due a week before.

Scoops`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Greengrocer one-liner to a restaurant; nothing under SPEC §5.`,
    industry: 'greengrocer', variant: 'UK',
    from: { name: 'Frank', address: 'frank@franksfruitandveg.example' },
    to: [{ name: 'Kitchen', address: 'kitchen@thebellinnhadley.test' }],
    subject: `No cavolo nero`,
    body: `No cavolo nero this week, got lovely chard instead, same price. Shout if you don't want it. F`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Toy shop to a customer about a reserved item; nothing under SPEC §5.`,
    industry: 'toy shop', variant: 'IE',
    from: { name: 'Toybox Galway', address: 'shop@toyboxgalway.example' },
    to: [{ name: 'Aisling', address: 'aisling.k@eircommail.test' }],
    subject: `The wooden kitchen's in`,
    body: `Hi Aisling,

The wooden play kitchen you asked us to hold has come in, the white one. It's €149 and we'll keep it for you till Saturday. It comes flat-packed, about 40 minutes to put together.

Thanks a million,
Toybox`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Aquarium shop advice to a customer; nothing under SPEC §5.`,
    industry: 'aquarium shop', variant: 'US',
    from: { name: 'Reef & River Aquatics', address: 'help@reefandriveraquatics.example' },
    to: [{ name: 'Danielle Foster', address: 'dfoster@postbox.test' }],
    subject: `Re: cloudy water in the new tank`,
    body: `Hi Danielle,

Totally normal for a tank that's two weeks old, it's a bacterial bloom while the tank cycles. Don't change the water yet and don't add more fish. Keep feeding light, once a day, and it should clear in a week or so.

Bring a water sample in anytime and we'll test it for free. Once ammonia and nitrite are both at zero you're good to add a few more fish.

Mike`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Shoe repair one-liner; nothing under SPEC §5.`,
    industry: 'shoe repair', variant: 'UK',
    from: { name: 'Sole Man', address: 'shop@solemanrepairs.example' },
    to: [{ name: 'Mr Reeves', address: 'jreeves@talkmail.test' }],
    subject: `Boots ready`,
    body: `Boots resoled and ready, £45. Open till 5.30.`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Laundrette service wash confirmation; nothing under SPEC §5.`,
    industry: 'laundrette', variant: 'UK',
    from: { name: 'Bubbles Laundrette', address: 'service@bubbleslaundrette.example' },
    to: [{ name: 'Harbour Guest House', address: 'info@harbourguesthouse.test' }],
    subject: `Weekly linen - collection day change`,
    body: `Hi Sue,

From next week we'll collect your linen on Mondays instead of Tuesdays and return it Wednesdays, as the van route has changed. Same prices, same bags. If Monday's a problem let us know and we'll work something out.

Bubbles`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Kitchen showroom sending a design and quote; customer-facing price and terms (SPEC §5.5 does not flag).`,
    industry: 'kitchen showroom', variant: 'UK',
    from: { name: 'Helen Carter', address: 'helen@carterkitchendesign.example' },
    to: [{ name: 'Mr and Mrs Bhatt', address: 'bhatts.home@gmailbox.test' }],
    subject: `Your kitchen design and quote`,
    body: `Dear Mr and Mrs Bhatt,

Thank you for coming into the showroom on Saturday. The design we worked on is in your portal (3D views and the plan), along with the quote.

Summary:
- Shaker doors in Sage, oak worktop on the island, quartz on the runs
- Appliances as specified: induction hob, two ovens, integrated dishwasher and fridge freezer
- Supply and installation including plumbing and electrics: £24,600 inc VAT
- Not included: flooring, tiling, decorating

Lead time is 8 weeks from order to installation, installation takes two weeks. A 25% deposit confirms the order, 50% on delivery and the balance on completion.

The quote is valid until 30 November. I'm happy to make changes; most people tweak the design two or three times.

Kind regards,
Helen`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Blinds installer arranging a measure and fit; nothing under SPEC §5.`,
    industry: 'blinds installer', variant: 'AU',
    from: { name: 'Shadeworks Blinds', address: 'bookings@shadeworksblinds.example' },
    to: [{ name: 'Rebecca Nguyen', address: 'rebecca.nguyen@bigpond-mail.test' }],
    subject: `Measure Thursday + install date`,
    body: `Hi Rebecca,

Confirming the measure on Thursday at 4pm for the living room and the three bedrooms. Takes about half an hour and we'll bring the fabric samples for the roller blinds.

From measure to install is normally 3 weeks. Install takes a morning.

Cheers,
Shadeworks`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Tiler quoting a bathroom; customer-facing price (SPEC §5.5 does not flag).`,
    industry: 'tiler', variant: 'UK',
    from: { name: 'Marco Tiling', address: 'marco@marcotilingservices.example' },
    to: [{ name: 'Craig Dunne', address: 'craig@dunnebathrooms.test' }],
    subject: `Re: Oliver and Meg's bathroom - tiling`,
    body: `Craig,

Had a look at the drawings. Floor 6 sq m in the 600x600 porcelain, walls 22 sq m in the metro tiles with the herringbone feature behind the bath. Two days, £980 labour, adhesive and grout included, tiles supplied by the customer. Can do Thursday and Friday as you asked.

Marco`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Plasterer confirming dates with a homeowner; nothing under SPEC §5.`,
    industry: 'plasterer', variant: 'UK',
    from: { name: 'Jon Bradley', address: 'jon@bradleyplastering.example' },
    to: [{ name: 'Mrs S Kaur', address: 's.kaur@quickmail.test' }],
    subject: `Front room skim - Mon and Tues`,
    body: `Hi Mrs Kaur,

I'll be with you Monday 8am to board the ceiling and skim the walls in the front room, finishing Tuesday. Please clear the room and take the pictures down, I'll cover the carpet. It'll need a week to dry before painting, pink first then white.

£620 as quoted, cash or transfer when it's done.

Jon`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Gutter cleaning follow-up; nothing under SPEC §5.`,
    industry: 'gutter cleaning', variant: 'NZ',
    from: { name: 'Gutter Guys', address: 'jobs@gutterguysakl.example' },
    to: [{ name: 'Paul Edwards', address: 'pedwards@xtramail.test' }],
    subject: `Done - and a couple of things`,
    body: `Hi Paul,

Gutters are all clear and flushed, before and after photos in the link. Couple of things we noticed: the downpipe at the back right is cracked near the bottom, and there are a few lifted tiles on the garage roof. Neither is urgent but worth sorting before winter. We don't do tiles but can replace the downpipe for $140 if you want.

$220 for today's job, invoice attached in the portal.

Cheers,
Gutter Guys`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Garage door installer quote; customer-facing price, no code mentioned (SPEC §5.1 and §5.5).`,
    industry: 'garage door installer', variant: 'US',
    from: { name: 'Overhead Door Pros', address: 'quotes@overheaddoorpros.example' },
    to: [{ name: 'Kevin Walsh', address: 'kwalsh@mailhub.test' }],
    subject: `Quote - 16x7 insulated door with opener`,
    body: `Kevin,

Quote for replacing your garage door:

- 16x7 insulated steel door, carriage house style, white: $2,150
- Belt drive opener with two remotes and keypad: $495
- Removal and haul-away of the old door and opener: included
- Installation: included

Total $2,645 plus tax. Installation takes about 4 hours. We're booking about 3 weeks out.

Thanks,
Overhead Door Pros`,
  },
  {
    category: 'none', expect: 'pass',
    why: `CCTV installer confirming an install date; logistics only, no codes or security gaps (SPEC §5.1).`,
    industry: 'CCTV installer', variant: 'UK',
    from: { name: 'Watchtower Security', address: 'installs@watchtowersecurity.example' },
    to: [{ name: 'Mr A Byrne', address: 'a.byrne@homemail.example' }],
    subject: `Install booked - Tues 11 Nov`,
    body: `Dear Mr Byrne,

Your 4-camera system install is booked for Tuesday 11 November from 9am; allow most of the day. The engineer will need access to your router and the loft, and will set the app up on your phone before leaving.

Please make sure the areas under the camera positions we agreed are clear.

Watchtower Security`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Sports massage therapist appointment confirmation; logistics only (SPEC §5.4).`,
    industry: 'sports massage therapist', variant: 'UK',
    from: { name: 'Jo Hendry', address: 'jo@hendrysportsmassage.example' },
    to: [{ name: 'Sam Pryce', address: 'sam.pryce@skymail.test' }],
    subject: `Weds 6pm`,
    body: `Hi Sam, confirming Wednesday at 6pm, 45 mins. Room 3 at the clinic, same as last time. Bring shorts. Jo`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Nail bar reminder; nothing under SPEC §5.`,
    industry: 'nail bar', variant: 'SG',
    from: { name: 'Polished Nail Studio', address: 'hello@polishednailstudio.example' },
    to: [{ name: 'Ms Jasmine Teo', address: 'jasmine.teo@worldmail.test' }],
    subject: `Reminder: Sat 1 Nov, 3pm`,
    body: `Hi Jasmine,

Reminder of your gel manicure and pedicure on Saturday 1 November at 3pm with Lina. Please come 5 minutes early. If you need to reschedule, let us know by Friday, otherwise a $20 late cancellation fee applies.

See you soon!
Polished`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Ballet school to parents about an exam day; nothing under SPEC §5.`,
    industry: 'ballet school', variant: 'UK',
    from: { name: 'Miss Alison', address: 'alison@pirouettedanceacademy.example' },
    to: [{ name: 'Grade 2 parents', address: 'grade2-parents@groups-mail.test', kind: 'group' }],
    subject: `Grade 2 exam - Sat 22 Nov - timings and uniform`,
    body: `Dear Parents,

Grade 2 exams are on Saturday 22 November at the studio. Times:

Group A (Ava, Lily, Maisie, Zara): arrive 9.15, exam 9.45
Group B (Freya, Isla, Poppy, Rosa): arrive 10.15, exam 10.45

Uniform: regulation leotard, pink tights, pink ballet shoes, hair in a neat bun with no fringe, no jewellery or nail varnish. Please bring a water bottle.

Parents wait in the reception area; the exam takes about 35 minutes. Results come through in 6 to 8 weeks.

They have all worked so hard. Good luck everyone!

Miss Alison`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Private swimming teacher to a parent; nothing under SPEC §5.`,
    industry: 'swimming teacher', variant: 'AU',
    from: { name: 'Swim with Sarah', address: 'sarah@swimwithsarah.example' },
    to: [{ name: 'Dan Morrow', address: 'dan.morrow@fastmail-au.example' }],
    subject: `Ruby's lessons - term 4`,
    body: `Hi Dan,

Ruby's going great, she did a full lap of freestyle with side breathing on Tuesday, big milestone. For term 4 I've kept her Tuesday 4.30 slot. Same pool, $28 a lesson, invoiced monthly.

No lesson on Melbourne Cup day.

Sarah`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Paddleboard hire confirming a group booking; nothing under SPEC §5.`,
    industry: 'paddleboard hire', variant: 'UK',
    from: { name: 'SUP Cornwall', address: 'bookings@supcornwall.example' },
    to: [{ name: 'Nadia Flynn', address: 'nadia.flynn@gmailbox.test' }],
    subject: `Hen do SUP session - Sat 7 June, 10am`,
    body: `Hi Nadia,

Your group of 10 is booked for a 2-hour guided paddle on Saturday 7 June at 10am from the harbour beach. Boards, paddles, wetsuits and buoyancy aids included. £35 per person, deposit received, balance on the day.

Bring swimwear to wear under the wetsuit, a towel and sun cream. If the sea's too lively we'll switch to the estuary, which is sheltered.

Jess`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Cathedral events office to a concert promoter; nothing under SPEC §5.`,
    industry: 'cathedral', variant: 'UK',
    from: { name: 'Events Office', address: 'events@stwilfridscathedral.example' },
    to: [{ name: 'Mark Ellison', address: 'mark@candlelightconcertsuk.test' }],
    subject: `Candlelight concert - 12 Dec - logistics`,
    body: `Dear Mark,

Confirming Friday 12 December for the candlelight concert. Access to the nave from 3pm for set-up; doors 6.30, concert 7.30, clear by 10.30. Capacity is 480 seated.

Please note: real candles only in the holders we provide (your LED candles are fine anywhere), no fixing to the fabric of the building, and the vergers will manage the heating and lighting. Our fee is as per the hire agreement, invoiced after the event.

Our head verger, Simon, will be your contact on the day.

Kind regards,
Events Office`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Garden designer sending a concept and a quote; customer-facing fee (SPEC §5.5 does not flag).`,
    industry: 'garden designer', variant: 'UK',
    from: { name: 'Thea Morgan', address: 'thea@theamorgangardens.example' },
    to: [{ name: 'Mr and Mrs Vickers', address: 'vickers@homemail.example' }],
    subject: `Concept plan and next steps`,
    body: `Dear Alan and Ruth,

The concept plan is in the shared folder. The main moves: a terrace off the kitchen in the same stone as the house, a gravel path curving down to a seating area under the apple tree, deep mixed borders on the sunny side, and the shed moved to the north corner behind a hornbeam screen.

Next steps if you're happy with the direction: a detailed planting plan and construction drawings, which is the second stage of my fee (£1,800) as in the proposal. I'd then get two landscapers to quote the build.

Let me know what you think; nothing is fixed at this stage.

Thea`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Beekeeping association to a member about a course; nothing under SPEC §5.`,
    industry: 'beekeeping association', variant: 'UK',
    from: { name: 'Education Secretary', address: 'education@wealdbeekeepers.example' },
    to: [{ name: 'Robert Lane', address: 'robert.lane@btmail.test' }],
    subject: `Beginners' course 2027 - your place`,
    body: `Dear Robert,

Your place on the 2027 beginners' course is confirmed. Theory evenings are on Tuesdays from 3 February to 10 March at the village hall, 7.30 to 9.30, followed by practical sessions at the association apiary on Saturday mornings from April once the weather allows.

The course fee of £95 includes membership for the year and the course book. Please pay by bank transfer to the association account using the details on the website, reference your surname.

A bee suit is provided for the practical sessions; you'll want your own eventually.

Best wishes,
Hilary`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Model railway club to a venue about an exhibition; nothing under SPEC §5.`,
    industry: 'model railway club', variant: 'UK',
    from: { name: 'Exhibition Manager', address: 'exhibition@ribblevalleymrc.example' },
    to: [{ name: 'Lettings', address: 'lettings@clitheroecommunityhall.test' }],
    subject: `Exhibition 21-22 March - hall booking`,
    body: `Dear Jane,

Please can we book the main hall and the small hall for our annual exhibition on Saturday 21 and Sunday 22 March, plus the Friday evening (20th) from 5pm for setting up? We'd clear by 7pm Sunday.

We'll have 18 layouts and 6 traders, about 60 tables needed, and we run a tea bar from the kitchen as before. Expected visitors around 600 over the weekend.

Same hire rate as last year if possible. Let me know and I'll send the deposit.

Thanks,
Keith`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Rotary club to a speaker; nothing under SPEC §5.`,
    industry: 'Rotary club', variant: 'UK',
    from: { name: 'Speaker Secretary', address: 'speakers@rotarymarlow.example' },
    to: [{ name: 'Dr Anita Rao', address: 'anita.rao@homemail.example' }],
    subject: `Talk on Tuesday 18 November - details`,
    body: `Dear Dr Rao,

Thank you for agreeing to speak to us about the river restoration project. We meet at the Compleat Angler on Tuesday 18 November; drinks from 6.45, dinner at 7.15, and your talk would start at about 8.15 for 25 minutes plus questions.

We can show slides from a laptop; please bring your presentation on a stick or email it to me beforehand. You are our guest for dinner, do let me know of any dietary requirements.

With kind regards,
David Attwell`,
  },
  {
    category: 'none', expect: 'pass',
    why: `PTA to a parent volunteer about the Christmas fair; nothing under SPEC §5.`,
    industry: 'school PTA', variant: 'UK',
    from: { name: 'Friends of Oakfield', address: 'pta@friendsofoakfield.example' },
    to: [{ name: 'Nikki Lawson', address: 'nikki.lawson@skymail.test' }],
    subject: `Christmas fair - stall rota`,
    body: `Hi Nikki,

Thanks so much for volunteering! You're on the tombola from 2 to 3pm on Saturday 6 December. Set-up is from 12.30 if you can come early; otherwise just come to the hall at 1.50 and find Jo.

Donations for the tombola are coming into the office till Thursday. Float and tickets will be on the table.

The fair raised £3,100 last year, we're hoping to beat it!

Friends of Oakfield`,
  },
  // ---- stops ----
  {
    category: 'negotiation', expect: 'stop',
    why: `SPEC §5.6: "We're bidding low on the first phase to lock in phases two and three." reveals the sender's bid strategy.`,
    industry: 'landscaping contractor', variant: 'US', placement: 'body',
    deciding: `We're bidding low on the first phase to lock in phases two and three.`,
    from: { name: 'Ramon Ortiz', address: 'ramon@ortizlandscapeconstruction.example' },
    to: [{ name: 'Beth Carver', address: 'beth@carverirrigationdesign.test' }],
    subject: `Re: Riverwalk park bid - your numbers`,
    body: `Beth,

Thanks for the irrigation numbers. Can you shave them a little for phase one? We're bidding low on the first phase to lock in phases two and three. We'll make it up on the later phases and you'd be our sub on all three.

Bid is due Thursday noon.

Ramon`,
  },
  {
    category: 'remark', expect: 'stop',
    why: `SPEC §5.7: "Their accounts team are morons." is a disparaging remark about a company's staff.`,
    industry: 'office supplies', variant: 'UK', placement: 'body',
    deciding: `Their accounts team are morons.`,
    from: { name: 'Gary Pike', address: 'gary@pikeofficesupplies.example' },
    to: [{ name: 'Lorraine', address: 'lorraine@fairviewdentalpractice.test' }],
    subject: `Re: Westbrook shared invoice`,
    body: `Lorraine,

Sorry about the mix-up with the Westbrook invoice ending up on your statement. Their accounts team are morons. It's been corrected and your statement is now right, copy in the portal.

Your toner is on the van for Tuesday.

Gary`,
  },
  {
    category: 'secrets', expect: 'stop',
    why: `SPEC §5.1: "There's no camera on the back stairwell so leave the pallets there." reveals a security gap (an area no camera covers).`,
    industry: 'retail store', variant: 'UK', placement: 'body',
    deciding: `There's no camera on the back stairwell so leave the pallets there.`,
    from: { name: 'Store Manager', address: 'manager@brightsidehomestore.example' },
    to: [{ name: 'Deliveries', address: 'deliveries@eastcoastpalletline.test' }],
    subject: `Thursday delivery - where to leave it`,
    body: `Hi,

For Thursday's drop, the goods lift is out of order. There's no camera on the back stairwell so leave the pallets there. We'll break them down ourselves before the area manager's visit on Friday.

Doors open 7am.

Kath`,
  },
  {
    category: 'personal', expect: 'stop',
    why: `SPEC §5.4: "She's been signed off with depression until the new year." discloses an identifiable person's health.`,
    industry: 'law firm', variant: 'UK', placement: 'body',
    deciding: `She's been signed off with depression until the new year.`,
    from: { name: 'Robert Shaw', address: 'rshaw@shawandcolegal.example' },
    to: [{ name: 'Mrs J Aldridge', address: 'j.aldridge@virginmail.test' }],
    subject: `Re: progress on the lease`,
    body: `Dear Mrs Aldridge,

Apologies for the delay. Your file was with Emma Lane. She's been signed off with depression until the new year. I have taken over the matter personally and will have the draft lease to you by Friday.

Kind regards,
Robert Shaw`,
  },
  {
    category: 'economics', expect: 'stop',
    why: `SPEC §5.5: "Cost build-up: 9,800 materials + 4,200 labour + 15% margin" gives the sender's own cost build-up and margin, in the subject.`,
    industry: 'joinery', variant: 'UK', placement: 'subject',
    deciding: `Cost build-up: 9,800 materials + 4,200 labour + 15% margin`,
    from: { name: 'Simon Blake', address: 'simon@blakejoinery.example' },
    to: [{ name: 'Priti Raval', address: 'priti@ravalandco.test' }],
    subject: `Cost build-up: 9,800 materials + 4,200 labour + 15% margin`,
    body: `Priti,

That's the Henderson staircase job for the quarter's figures. Invoice went out last Friday. Let me know if you need the supplier invoices as well.

Simon`,
  },
  {
    category: 'negotiation', expect: 'stop',
    why: `SPEC §5.6: "I'd accept 15% off the list price before walking away." states the sender's acceptable position, in the quoted history.`,
    industry: 'restaurant', variant: 'CA', placement: 'quoted',
    deciding: `I'd accept 15% off the list price before walking away.`,
    from: { name: 'Claire Dubois', address: 'claire@bistroduboismtl.example' },
    to: [{ name: 'Marc Tremblay', address: 'marc@tremblayrestaurantsupply.test' }],
    subject: `Fwd: oven replacement - decision`,
    body: `Hi Marc,

See below, we've decided to go ahead with the Rational. Please send the revised quote and the delivery window.

Claire

> Claire, the Rational rep is holding at list price. Do you want me to keep pushing or look at the other brand?
> Jean

>> Jean, keep pushing. I'd accept 15% off the list price before walking away. We don't need to decide until the 15th.
>> Claire`,
  },
];
