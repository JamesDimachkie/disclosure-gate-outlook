// everyday2 batch 04. Hand-written literals; see ../serialize.mjs for the schema wrapper.
export default [
  {
    category: 'none', expect: 'pass',
    why: `Farrier confirming a visit with a horse owner; nothing under SPEC §5.`,
    industry: 'farrier', variant: 'UK',
    from: { name: 'Jack Whitmore', address: 'jack@whitmorefarriery.example' },
    to: [{ name: 'Lucy Bentham', address: 'lucy.bentham@skymail.test' }],
    subject: `Thursday - Ozzy and Blue`,
    body: `Hi Lucy,

I'll be with you Thursday about 10.30 for Ozzy and Blue. Ozzy's fronts should be fine to go another cycle in shoes, Blue I'd like to try barefoot behind over the winter if you're up for it, his feet have come on a lot.

If they could be in and dry that'd be great.

Jack`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Cattery booking confirmation; nothing under SPEC §5.`,
    industry: 'cattery', variant: 'UK',
    from: { name: 'Willow Lodge Cattery', address: 'bookings@willowlodgecattery.example' },
    to: [{ name: 'Mr D Yates', address: 'd.yates@homemail.example' }],
    subject: `Booking confirmed - Mabel - 12 to 19 December`,
    body: `Dear Mr Yates,

Mabel is booked in from Friday 12 December (drop-off between 9 and 11am) to Friday 19 December (collection between 4 and 6pm). The rate is £16 per night, payable on collection.

Please bring her vaccination record, enough of her usual food, and anything that smells of home, a blanket or a t-shirt works well.

Kind regards,
Wendy`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Pool contractor's service report to a homeowner; nothing under SPEC §5.`,
    industry: 'swimming pool maintenance', variant: 'US',
    from: { name: 'Clearwater Pools', address: 'service@clearwaterpoolsaz.example' },
    to: [{ name: 'Jim and Sandy Ortega', address: 'ortegas@mailhub.test' }],
    subject: `Service report - Oct 23`,
    body: `Hi Jim and Sandy,

Weekly service done today.

- Chemistry: chlorine 2.5, pH 7.4, alkalinity 90, all in range. Added 2 lbs of stabilizer.
- Skimmed, brushed, vacuumed. Emptied both skimmer baskets and the pump basket.
- Filter pressure is creeping up, we'll backwash next visit.
- Noticed the pool light is out. Replacement LED is $185 installed if you want it done.

Next visit Thursday the 30th.

Carlos`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Window cleaner one-liner; nothing under SPEC §5.`,
    industry: 'window cleaner', variant: 'UK',
    from: { name: 'Pete the window cleaner', address: 'pete@clearviewwindowsleeds.example' },
    to: [{ name: 'Mrs Hooper', address: 'hoopers@btmail.test' }],
    subject: `Windows`,
    body: `Hi, I'll be round Weds morning for the windows, £15 as usual, leave the side gate open if you're out. Ta, Pete`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Chimney sweep certificate note; nothing under SPEC §5.`,
    industry: 'chimney sweep', variant: 'IE',
    from: { name: 'Fergal Byrne', address: 'fergal@byrnechimneys.example' },
    to: [{ name: 'Claire Nolan', address: 'claire.nolan@eircommail.test' }],
    subject: `Your sweep certificate`,
    body: `Hi Claire,

Grand to meet you this morning. Your certificate for the sweep is attached in the portal link, keep it for the insurance. The flue was in good order, a small bit of soot build-up but nothing to worry about. I'd get it done again this time next year.

The stove door seal is on its way out, you can get a replacement rope kit in any hardware shop for about €12, easy enough to fit yourself.

Thanks a million,
Fergal`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Piano tuner scheduling a visit; nothing under SPEC §5.`,
    industry: 'piano tuner', variant: 'US',
    from: { name: 'Harold Benning', address: 'harold@benningpianoservice.example' },
    to: [{ name: 'Rev. Paula Shin', address: 'pshin@firstpresbyterianoakdale.test' }],
    subject: `Sanctuary piano - pre-Christmas tuning`,
    body: `Dear Rev. Shin,

I have the church's Steinway on my calendar for a tuning before the Christmas services. Would Tuesday, December 9 at 10 AM work? I'll need about two hours with the sanctuary quiet.

The una corda pedal was squeaking last time; I'll bring the parts to fix that as well, no extra charge.

Best regards,
Harold`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Private tutor's progress note to a parent; a child's school progress as the recipient's own child, no health, HR or legal matter (SPEC §5.4).`,
    industry: 'private tutor', variant: 'UK',
    from: { name: 'Sarah Jennings', address: 'sarah@jenningsmathstutoring.example' },
    to: [{ name: 'Mrs Osei', address: 'g.osei@talkmail.test' }],
    subject: `Kwame - this half term`,
    body: `Dear Mrs Osei,

A quick update before half term. Kwame has worked hard this term and the algebra is really coming together; the simultaneous equations he found impossible in September he now does without fuss. Our focus for the next few weeks will be graphs and then a first look at the trigonometry in the mock paper.

I've set him two past paper questions a week over the holiday. Little and often is the aim, not a marathon.

Same time on Tuesdays after half term unless you need to change.

Best wishes,
Sarah`,
  },
  {
    category: 'none', expect: 'pass',
    why: `DJ confirming a booking; nothing under SPEC §5.`,
    industry: 'wedding DJ', variant: 'UK',
    from: { name: 'DJ Marcus', address: 'marcus@marcusplaysweddings.example' },
    to: [{ name: 'Chloe and Dan', address: 'chloeanddan2027@gmailbox.test' }],
    subject: `Re: playlist + timings for the 29th`,
    body: `Hi both,

Got the playlist, thanks, some great picks. I'll weave the must-plays in and keep the do-not-plays well away (no Mr Brightside, understood!).

Timings: I'll set up from 5 while you're having the meal, first dance at 8, then I'll play till midnight. The venue's told me I need to be out by 1.

Final balance is due the week before as per the booking form.

Can't wait!
Marcus

> Hi Marcus, playlist attached. First dance is still the Etta James one. Could you be set up before the speeches finish at about 7.30? Chloe`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Art gallery to an artist about an exhibition; commission terms as the agreed deal (SPEC §5.5 and §5.6 do not flag an offer actually made).`,
    industry: 'art gallery', variant: 'UK',
    from: { name: 'Isabel Hartley', address: 'isabel@hartleyfineart.example' },
    to: [{ name: 'Tomasz Nowak', address: 'tomasz.nowak.studio@mailbox.test' }],
    subject: `January show - hanging and the price list`,
    body: `Dear Tomasz,

We're delighted to have you in January. A few practicalities:

- Delivery of the 14 works to the gallery by 5 January please; we can collect from the studio if that's easier (we'd cover the van).
- Hanging on 7 and 8 January, you're welcome to be here.
- Private view Thursday 15 January, 6-8pm. We'll print 200 invitations, send me your list.
- Price list: please send retail prices by 10 December. Our commission is 45% on sales as per the agreement, framing costs you've incurred can be added to the retail price.
- We'll produce a short catalogue; could you write 200 words on the series by the end of November?

Looking forward to it enormously.

Isabel`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Pottery studio to a class member about kiln firing; nothing under SPEC §5.`,
    industry: 'pottery studio', variant: 'AU',
    from: { name: 'Mudlark Studio', address: 'hello@mudlarkpottery.example' },
    to: [{ name: 'Georgia', address: 'georgia.ff@optusmail.test' }],
    subject: `Your pieces are out of the kiln`,
    body: `Hi Georgia,

Your bowls and the vase came out of the glaze firing this morning and they look great, the blue really popped. They're on the shelf with your name on it, collect any time during open studio hours (Tues-Sat 10-4).

Next term starts 3 Feb, enrolments open next week, you'll get first dibs as a current student.

Cheers,
Em`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Coffee roaster to a cafe about a wholesale order; wholesale price stated to the customer (SPEC §5.5 does not flag).`,
    industry: 'coffee roaster', variant: 'NZ',
    from: { name: 'Tane', address: 'tane@blackcurrentcoffee.example' },
    to: [{ name: 'Sam', address: 'sam@thecornerbrew.test' }],
    subject: `This week's roast + new Ethiopian`,
    body: `Hey Sam,

Your 10kg of the house blend is roasted and will be on the courier tomorrow. Roast date's on the bags.

We've just landed a new washed Ethiopian, super floral, think bergamot and peach. $42/kg wholesale. Want me to chuck a kg in with the order for you to try on filter?

Chur,
Tane`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Butcher confirming a Christmas order; nothing under SPEC §5.`,
    industry: 'butcher', variant: 'UK',
    from: { name: 'Hallam & Sons Butchers', address: 'shop@hallambutchers.example' },
    to: [{ name: 'Mrs P Dixon', address: 'pauline.dixon@virginmail.test' }],
    subject: `Christmas order - collection Tues 23 Dec`,
    body: `Dear Mrs Dixon,

Thank you for your Christmas order. To confirm:

- 1 x free range bronze turkey, 5-6kg
- 1 kg chipolatas
- 1 kg smoked streaky bacon
- 1 x 2kg gammon joint, unsmoked
- 500g pork sausagemeat

Collection is Tuesday 23 December, any time from 7am to 5pm. We'll weigh and price on the day. A £20 deposit has been taken, thank you.

Merry Christmas from all at Hallam's.`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Fishmonger note to a restaurant chef; nothing under SPEC §5.`,
    industry: 'fishmonger', variant: 'UK',
    from: { name: 'Dougie', address: 'dougie@kirkwallfishco.example' },
    to: [{ name: 'Chef', address: 'kitchen@thebothyrestaurant.test' }],
    subject: `Tomorrow`,
    body: `Boat's in late tomorrow so no monkfish till Thursday. Got lovely hake and the first of the brown crab if you want to swap the special. Let me know by 6. D`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Cheesemaker to a deli about supply over Christmas; nothing under SPEC §5.`,
    industry: 'cheesemaker', variant: 'UK',
    from: { name: 'Alice Fenwick', address: 'alice@fenwickfarmdairy.example' },
    to: [{ name: 'Marco', address: 'marco@marcosdeli.test' }],
    subject: `Christmas cheese - what we'll have`,
    body: `Hi Marco,

Here's what we'll have ready for the Christmas run:

- Fenwick Blue, 30 wheels (the September make, perfect by mid-December)
- Smoked Fenwick, 12 x 1kg
- Soft ash-coated, 60 x 180g (short shelf life, order weekly)
- No Alpine-style this year, the summer milk went into the blue

Order by 20 November for the first drop on 5 December. Prices are on the sheet I sent in October, unchanged.

Alice`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Farm shop to a customer about a veg box change; nothing under SPEC §5.`,
    industry: 'farm shop', variant: 'UK',
    from: { name: 'Hollowtree Farm Shop', address: 'boxes@hollowtreefarm.example' },
    to: [{ name: 'Ms Rebecca Sloane', address: 'rsloane@gmailbox.test' }],
    subject: `Your box this week`,
    body: `Hi Rebecca,

This week's medium box: leeks, carrots, a savoy cabbage, beetroot, red onions, potatoes, a bunch of kale, Cox apples and a squash. The kale's from the new field so expect it to be on the robust side!

Your pause for 12-19 November is noted; the next box after that will be the 26th.

Thanks,
Hollowtree`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Garden centre to a customer about an order and a delivery; nothing under SPEC §5.`,
    industry: 'garden centre', variant: 'UK',
    from: { name: 'Oakdene Garden Centre', address: 'orders@oakdenegardencentre.example' },
    to: [{ name: 'Mr T Ambrose', address: 't.ambrose@homemail.example' }],
    subject: `Your bare-root hedging has arrived`,
    body: `Dear Mr Ambrose,

Your 60 bare-root hornbeam whips have arrived and are heeled in at the nursery ready for you. You can collect any day this week, or we can deliver on Saturday morning for £15.

Plant them as soon as you can after collection; if that isn't possible for a few days, keep the roots moist and out of the wind.

Kind regards,
Oakdene Garden Centre`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Tree surgeon quote with a quoted enquiry; customer-facing price (SPEC §5.5 does not flag).`,
    industry: 'tree surgeon', variant: 'UK',
    from: { name: 'Ollie Marsh', address: 'ollie@marshtreecare.example' },
    to: [{ name: 'Debbie Allen', address: 'debbie.allen@btmail.test' }],
    subject: `Re: oak at the bottom of the garden`,
    body: `Hi Debbie,

Had a look this afternoon. The oak itself is healthy, it's just grown into the light since your neighbour's conifers came down. I'd suggest a 25% crown reduction and taking out the dead wood, which will let more light in without spoiling the shape.

£480 including chipping and clearing everything away. It's not in a conservation area and there's no TPO, I've checked, so no permission needed. Could do it the week of the 17th.

Ollie

> Hi Ollie, could you have a look at the big oak at the bottom of our garden at 8 Meadow Rise? It's blocking most of the afternoon light now. Thanks, Debbie`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Skip hire confirmation; a permit as ordinary logistics (SPEC §5.1 does not flag).`,
    industry: 'skip hire', variant: 'UK',
    from: { name: 'Rapid Skips', address: 'bookings@rapidskips.example' },
    to: [{ name: 'Tony Walsh', address: 'twalsh77@quickmail.test' }],
    subject: `8-yard skip - delivery Fri 31 Oct`,
    body: `Hi Tony,

Your 8-yard skip is booked for delivery Friday 31 October, AM. As it's going on the road we've applied for the council permit, which covers 14 days. £285 including the permit, paid, thanks.

No plasterboard, tyres, fridges or mattresses in the skip please, they're charged extra. Fill level with the top, not above.

Give us a ring when it's ready to go.

Rapid Skips`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Crane hire sending a lift plan request to a contractor; nothing under SPEC §5.`,
    industry: 'crane hire', variant: 'AU',
    from: { name: 'Brett Sullivan', address: 'brett@sullivancranes.example' },
    to: [{ name: 'Nathan Reid', address: 'nathan@reidconstructions.test' }],
    subject: `Lift Wed 5 Nov - info needed`,
    body: `Nathan,

For the roof truss lift on Wednesday I need the following by Monday so I can finish the lift plan:

- truss weights and max span (from the fabricator's drawings)
- confirmation the crane pad is compacted road base, and dimensions
- overhead power lines: are they on the street side still?
- site contact and induction time

We're planning the 60t Franna, on site 6.30 for a 7 start. Dogman is ours. Traffic control is yours as discussed.

Brett`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Ecologist to a developer client about survey timing; nothing under SPEC §5.`,
    industry: 'ecology consultancy', variant: 'UK',
    from: { name: 'Dr Mairi Fraser', address: 'mairi@glenecologyltd.example' },
    to: [{ name: 'Paul Devlin', address: 'paul@devlinhomes.test' }],
    subject: `Bat surveys - Cairn Road - timing`,
    body: `Hi Paul,

The preliminary roost assessment found moderate potential on the farmhouse (gaps under the slates on the south gable) and low on the steading. That means two emergence surveys on the farmhouse and one on the steading, which can only be done May to August.

I know that's not what you want to hear for the planning timetable. Options: submit the application with the PRA and a condition, which some authorities accept, or wait and submit with the full survey in September. I'd speak to the planning officer first.

Our fee for the three surveys would be as per the schedule in the proposal.

Mairi`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Interior designer sending a client a sourcing update; customer-facing prices (SPEC §5.5 does not flag).`,
    industry: 'interior designer', variant: 'US',
    from: { name: 'Naomi Feld', address: 'naomi@feldinteriors.example' },
    to: [{ name: 'The Castellanos', address: 'castellanos.home@familymail.test' }],
    subject: `Living room - sourcing update`,
    body: `Hi Ana and Luis,

Quick update on the living room:

- Sofa: the Beaumont in the oatmeal bouclé is in stock, 8 week lead time, $4,200 delivered.
- Rug: the vintage Oushak I sent is on hold for us until Friday. It's $2,850. If you're not sure, there's a very similar new one at $1,400 but the colors are flatter.
- Lighting: the brass floor lamp sample arrived, come see it in the studio, it's lovely in person.
- Paint: I'm leaning Farrow & Ball Setting Plaster for the back wall after seeing the afternoon light. Samples on the wall Tuesday.

Let me know on the rug by Thursday. Invoice for the deposits will follow once we confirm.

Naomi`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Upholsterer replying to a customer about fabric and timing; nothing under SPEC §5.`,
    industry: 'upholsterer', variant: 'UK',
    from: { name: 'Ron Ashworth', address: 'ron@ashworthupholstery.example' },
    to: [{ name: 'Mrs V Lamb', address: 'v.lamb@talkmail.test' }],
    subject: `Re: the two armchairs`,
    body: `Dear Mrs Lamb,

Thank you for choosing the fabric. The Linwood velvet in teal is 6 metres for the pair, which I've ordered; it should be here in about 10 days. I'd then need the chairs for three weeks.

The springs on the second chair have gone, so as discussed I'll re-spring it at the same time, which adds £120 to the quote. Everything else stays as quoted.

I'll ring you when the fabric lands to arrange collection.

Yours sincerely,
Ron Ashworth`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Auction house to a consignor about lots and results; hammer prices and commission are the agreed terms stated as facts (SPEC §5.5 does not flag).`,
    industry: 'auction house', variant: 'UK',
    from: { name: 'Charlotte Vane', address: 'cvane@tetburyauctions.example' },
    to: [{ name: 'Mr H Ingram', address: 'hingram@homemail.example' }],
    subject: `Sale results - 21 October`,
    body: `Dear Mr Ingram,

Please find the results for your lots in Tuesday's sale:

Lot 44, pair of Georgian silver candlesticks: sold £1,150
Lot 112, Victorian mahogany bureau: sold £320
Lot 113, set of six balloon-back chairs: unsold (reserve £400)
Lot 201, longcase clock: sold £2,400

Settlement, less our commission of 15% plus VAT and the lotting fees, will be paid by bank transfer 21 days after the sale as per your consignment agreement.

For the chairs, we'd suggest re-offering in the December sale with a reduced reserve of £250, or you are welcome to collect them. Please let me know by Friday.

Kind regards,
Charlotte Vane`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Jeweller to a customer about a repair; nothing under SPEC §5.`,
    industry: 'jeweller', variant: 'UK',
    from: { name: 'Goldsmiths of Rye', address: 'workshop@goldsmithsofrye.example' },
    to: [{ name: 'Ms F Reilly', address: 'freilly@skymail.test' }],
    subject: `Your ring - ready for collection`,
    body: `Dear Ms Reilly,

Your grandmother's ring is ready. We have re-tipped the four claws, replaced the worn shank and polished it, and the stone is now secure. The repair came to £165 as quoted.

It looks beautiful. Collect whenever suits, we're open Tuesday to Saturday 10 till 5.

With best wishes,
Hugo`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Dry cleaner one-liner; nothing under SPEC §5.`,
    industry: 'dry cleaner', variant: 'US',
    from: { name: 'Elm Street Cleaners', address: 'orders@elmstreetcleaners.example' },
    to: [{ name: 'Dan Petrov', address: 'dpetrov@postbox.test' }],
    subject: `Order 3312 ready`,
    body: `Your order 3312 (2 suits, 5 shirts) is ready for pickup. Open till 7.`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Tailor arranging a fitting; nothing under SPEC §5.`,
    industry: 'tailor', variant: 'IN',
    from: { name: 'Mohan Tailors', address: 'mohan@mohantailorsmumbai.example' },
    to: [{ name: 'Mr Arjun Desai', address: 'arjun.desai@worldmail.test' }],
    subject: `Second fitting for wedding suit`,
    body: `Dear Mr Desai,

Your suit is ready for second fitting. Kindly come to the shop on Saturday between 11am and 6pm, or Monday after 2pm. Fitting will take 20 minutes only.

Please wear the shoes you will wear at the wedding so trouser length can be finalised.

After this fitting, final delivery will be within one week.

Regards,
Mohan`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Bridal shop to a bride about alterations and collection; nothing under SPEC §5.`,
    industry: 'bridal shop', variant: 'AU',
    from: { name: 'Ivory Lane Bridal', address: 'hello@ivorylanebridal.example' },
    to: [{ name: 'Kirra', address: 'kirra.j@gmailbox.test' }],
    subject: `Alterations fitting + collection`,
    body: `Hi Kirra,

Your dress is back from the seamstress! Second fitting is booked for Saturday 8 November at 11am, allow an hour. Bring your shoes and the shapewear you'll wear on the day.

If everything's perfect you can take it home that day, or we're happy to keep it steamed and bagged here until the week of the wedding.

Final payment for the alterations ($380) is due at collection.

So excited for you!
Bec`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Pet shop to a customer about a special order; nothing under SPEC §5.`,
    industry: 'pet shop', variant: 'UK',
    from: { name: 'Furry Friends Pet Supplies', address: 'shop@furryfriendspets.example' },
    to: [{ name: 'Ian Cross', address: 'iancross@talkmail.test' }],
    subject: `Your food order`,
    body: `Hi Ian,

The 12kg bag of the grain-free salmon you ordered has come in. It's £54.99 (the big bag works out cheaper than two of the 6kg). We'll hold it for you until the end of the week.

Also the frozen raw is back in stock if you need any.

Cheers,
Kelly`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Campsite booking confirmation; nothing under SPEC §5.`,
    industry: 'campsite', variant: 'UK',
    from: { name: 'Riverbank Campsite', address: 'bookings@riverbankcamping.example' },
    to: [{ name: 'The Moffats', address: 'moffat.family@btmail.test' }],
    subject: `Booking confirmed - pitch 14 - 22 to 25 May`,
    body: `Hello,

Thank you for booking with us. You have grass pitch 14 (electric hook-up) for 3 nights, Friday 22 to Monday 25 May, 2 adults and 2 children, one car.

Arrival from 1pm, departure by 11am. Reception is open 8am to 8pm; if you arrive later, your pitch number will be on the board by the gate and you can check in the next morning.

Fire pits are allowed off the ground, firewood is sold at reception. Dogs on leads. The river is lovely but fast after rain, please keep an eye on little ones.

Balance of £84 is due on arrival.

See you in May!
Riverbank Campsite`,
  },
  {
    category: 'none', expect: 'pass',
    why: `B&B host replying to a guest; nothing under SPEC §5.`,
    industry: 'bed and breakfast', variant: 'IE',
    from: { name: 'Mary at Seaview House', address: 'mary@seaviewhousedingle.example' },
    to: [{ name: 'Hans Becker', address: 'hans.becker@worldmail.test' }],
    subject: `Re: arrival Friday`,
    body: `Dear Hans,

You're very welcome, the room is ready for you from 3 on Friday. If you're later than 8 just give me a ring and I'll leave the porch light on. Breakfast is 8 to 9.30, and we do a lovely full Irish or porridge with the local honey.

Parking is in the yard at the side. The bus from Tralee stops at the top of the road, a 5-minute walk down.

Looking forward to meeting you,
Mary`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Surf school confirming a lesson; nothing under SPEC §5.`,
    industry: 'surf school', variant: 'AU',
    from: { name: 'Salty Dogs Surf School', address: 'bookings@saltydogssurf.example' },
    to: [{ name: 'Priya', address: 'priya.n@fastmail-au.example' }],
    subject: `Your lesson Sunday 9am`,
    body: `Hey Priya,

You're booked in for the beginner group lesson Sunday 9am at the main beach. Meet at the blue trailer by the surf club, 15 mins early for wetsuits. Boards and suits are included, just bring a towel, sunscreen and a rashie if you have one.

If the surf's too big or the beach is closed we'll text you by 7.30 and move you to another day, no charge.

See you in the water!
Jess`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Dive centre sending course details; nothing under SPEC §5.`,
    industry: 'dive centre', variant: 'SG',
    from: { name: 'Blue Depths Diving', address: 'courses@bluedepthsdiving.example' },
    to: [{ name: 'Wei Lin', address: 'weilin.ong@worldmail.test' }],
    subject: `Open Water course - schedule and what to bring`,
    body: `Hi Wei Lin,

Thanks for signing up for the Open Water course. Schedule:

- Sat 8 Nov, 9am-5pm: theory and pool session at our centre
- Sun 9 Nov, 9am-1pm: pool session 2
- Sat 15 and Sun 16 Nov: 4 open water dives at Pulau Hantu, ferry departs 7.30am from West Coast Pier

Please complete the online theory modules before 8 Nov (link in your welcome email) and bring the medical form signed. Bring swimwear, towel, a change of clothes and lunch for the pool days. All equipment is provided; if you have your own mask and fins, can bring.

Any questions, just reply or WhatsApp the shop.

See you Saturday!
Kevin`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Coach company confirming a day trip for a club; customer-facing price (SPEC §5.5 does not flag).`,
    industry: 'coach company', variant: 'UK',
    from: { name: 'Hartwell Coaches', address: 'bookings@hartwellcoaches.example' },
    to: [{ name: 'Mrs B Thorne', address: 'secretary@elmtreewi.test' }],
    subject: `WI trip to Bath - Thurs 13 Nov`,
    body: `Dear Mrs Thorne,

Confirming your 49-seat coach for Thursday 13 November. Pick-up at the village hall 8.30am, drop at Bath coach park, departing Bath 4.30pm, back at the hall approximately 6.30pm.

The price is £620 for the day, as quoted. An invoice will follow after the trip, payable within 14 days. The driver will have a passenger list clipboard for you on the day.

Please let us know of any passengers needing the low step or extra time boarding.

Kind regards,
Hartwell Coaches`,
  },
  // ---- stops ----
  {
    category: 'personal', expect: 'stop',
    why: `SPEC §5.4: "We've put Jonah on a performance plan so expect a few more weeks before he's back on your account." discloses an identifiable person's HR matter.`,
    industry: 'marketing agency', variant: 'US', placement: 'body',
    deciding: `We've put Jonah on a performance plan so expect a few more weeks before he's back on your account.`,
    from: { name: 'Kelsey Burke', address: 'kelsey@signalhillmarketing.example' },
    to: [{ name: 'Ray Delgado', address: 'ray@delgadodentalgroup.test' }],
    subject: `Re: who's running our ads now?`,
    body: `Hi Ray,

Totally fair question. I'm handling your campaigns personally for now. We've put Jonah on a performance plan so expect a few more weeks before he's back on your account. Nothing about your results triggered it, to be clear.

Let's keep the Thursday check-in, I'll bring the October numbers.

Kelsey`,
  },
  {
    category: 'economics', expect: 'stop',
    why: `SPEC §5.5: "Internal budget for the whole campaign is 42k, so don't quote them more than 60." reveals the sender's internal budget figure.`,
    industry: 'advertising agency', variant: 'UK', placement: 'body',
    deciding: `Internal budget for the whole campaign is 42k, so don't quote them more than 60.`,
    from: { name: 'Toby Anand', address: 'toby@loudhailercreative.example' },
    to: [{ name: 'Hugo Barnes', address: 'hugo@barnesfilmco.test' }],
    subject: `Re: Fenwick launch - video scope`,
    body: `Hugo,

Thanks for the treatment, they loved it. When you send your production estimate for the client's board, keep it lean. Internal budget for the whole campaign is 42k, so don't quote them more than 60. Two shoot days, one edit round.

Toby`,
  },
  {
    category: 'negotiation', expect: 'stop',
    why: `SPEC §5.6: "Don't tell the landlord but we'd accept a 2-year break clause if they insist." states what the sender would concede, in the quoted history.`,
    industry: 'retail tenant', variant: 'UK', placement: 'quoted',
    deciding: `Don't tell the landlord but we'd accept a 2-year break clause if they insist.`,
    from: { name: 'Sarah Ng', address: 'sarah@ngopticians.example' },
    to: [{ name: 'Faisal Khan', address: 'fkhan@khanpropertylaw.test' }],
    subject: `Fwd: lease heads of terms - 14 Market St`,
    body: `Hi Faisal,

Forwarding the thread with our agent so you've got the full background before you mark up the heads of terms. Can you turn it round by Friday?

Sarah

> Hi Sarah, landlord's agent is pushing back on the 3-year break. Where do you want me to land?
> Jim

>> Jim, push for the 3-year. Don't tell the landlord but we'd accept a 2-year break clause if they insist. Rent-free period is more important to us.
>> Sarah`,
  },
  {
    category: 'remark', expect: 'stop',
    why: `SPEC §5.7: "Don't deal with Karen there, she's a nightmare and thick as two planks." is a disparaging remark about a person.`,
    industry: 'wholesale bakery', variant: 'UK', placement: 'body',
    deciding: `Don't deal with Karen there, she's a nightmare and thick as two planks.`,
    from: { name: 'Paul Hennessey', address: 'paul@hennesseybakehouse.example' },
    to: [{ name: 'Lisa Grant', address: 'lisa@grantcateringsupplies.test' }],
    subject: `Re: flour supplier switch`,
    body: `Lisa,

If you're going to Millbrook for the flour, ask for Steve in trade sales. Don't deal with Karen there, she's a nightmare and thick as two planks. Steve sorted our pallet pricing in one call.

Paul`,
  },
  {
    category: 'secrets', expect: 'stop',
    why: `SPEC §5.1: "Lockbox on the railing opens with 2580." gives a lockbox code that is actually given.`,
    industry: 'property management', variant: 'US', placement: 'body',
    deciding: `Lockbox on the railing opens with 2580.`,
    from: { name: 'Greg Fowler', address: 'greg@fowlerpropertymgmt.example' },
    to: [{ name: 'Dispatch', address: 'dispatch@aceappliancerepair.test' }],
    subject: `Dishwasher - 220 Linden Ave #3`,
    body: `Hi,

Tenant at 220 Linden Ave #3 says the dishwasher won't drain. She's at work during the day so go ahead without her. Lockbox on the railing opens with 2580. Please leave the key back in it when you're done and text me what you found.

Thanks,
Greg`,
  },
  {
    category: 'personal', expect: 'stop',
    why: `SPEC §5.4: "Re: Sam's divorce and the Thursday handover" discloses an identifiable person's family matter in the subject.`,
    industry: 'accountancy', variant: 'AU', placement: 'subject',
    deciding: `Re: Sam's divorce and the Thursday handover`,
    from: { name: 'Jenny Kaur', address: 'jenny@kaurpartnersaccounting.example' },
    to: [{ name: 'Mark Olsen', address: 'mark@olsenengineering.test' }],
    subject: `Re: Sam's divorce and the Thursday handover`,
    body: `Hi Mark,

Thursday 2pm works for the handover. I'll bring the BAS workings and the fixed asset register so we can go through what's outstanding before the quarter closes.

Jenny`,
  },
  {
    category: 'economics', expect: 'stop',
    why: `SPEC §5.5: "We priced the glazing at double what it costs us." reveals the sender's cost-to-price ratio, in the quoted history.`,
    industry: 'window installer', variant: 'UK', placement: 'quoted',
    deciding: `We priced the glazing at double what it costs us.`,
    from: { name: 'Martin Reeve', address: 'martin@reevewindows.example' },
    to: [{ name: 'Clare Dobson', address: 'clare@dobsonarchitects.test' }],
    subject: `Fwd: Hillside House - glazing package`,
    body: `Clare,

See below from Phil with the breakdown you asked for. Shout if the client wants the slimmer frames instead.

Martin

> Martin, breakdown for Hillside is attached. Frames, glazing, fitting and the cill details are all separate lines.
> We priced the glazing at double what it costs us. Fitting is at the usual day rate.
> Phil`,
  },
];
