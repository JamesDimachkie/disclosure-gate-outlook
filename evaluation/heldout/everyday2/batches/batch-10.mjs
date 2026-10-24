// everyday2 batch 10 (final, short). Hand-written literals; see ../serialize.mjs for the schema wrapper.
export default [
  {
    category: 'none', expect: 'pass',
    why: `Kebab shop to a supplier about an order; nothing under SPEC §5.`,
    industry: 'kebab shop', variant: 'UK',
    from: { name: 'Antalya Grill', address: 'orders@antalyagrillderby.example' },
    to: [{ name: 'Sales', address: 'sales@midlandsmeatsupplies.test' }],
    subject: `Friday order`,
    body: `Hi Ahmet,

Friday order: 6 doner, 20kg chicken thighs, 10kg lamb mince, 5 boxes pitta, 2 sacks onions, 1 box tomatoes. Deliver before 12 please, same as usual.

Can you also send the price list for the new year?

Mehmet`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Sandwich shop to an office about a lunch order; nothing under SPEC §5.`,
    industry: 'sandwich shop', variant: 'UK',
    from: { name: 'The Daily Loaf', address: 'orders@thedailyloaf.example' },
    to: [{ name: 'Reception', address: 'reception@parkerandrowe.test' }],
    subject: `Re: platters for Thursday meeting`,
    body: `Hi Jo,

Thursday's sorted: 3 mixed sandwich platters (one vegetarian), a fruit platter and 2 dozen mini brownies, delivered to reception by 12.15. £96 on account.

Let me know by Wednesday lunchtime if numbers change.

Thanks,
Dan`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Juice bar to a gym about a partnership; nothing under SPEC §5.`,
    industry: 'juice bar', variant: 'AU',
    from: { name: 'Squeeze Juice Bar', address: 'hello@squeezejuicebar.example' },
    to: [{ name: 'Jacob', address: 'jacob@ironbarkfitness.test' }],
    subject: `Member discount idea`,
    body: `Hey Jacob,

Following up on our chat. We'd be happy to give Ironbark members 15% off smoothies and juices on showing their app. We'd put a poster up here and you could pop one on your noticeboard. No cost to either side, just more foot traffic both ways.

If you're keen I'll drop the posters in next week.

Cheers,
Mia`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Sushi restaurant confirming a reservation; nothing under SPEC §5.`,
    industry: 'sushi restaurant', variant: 'US',
    from: { name: 'Kaito Sushi', address: 'reservations@kaitosushi.example' },
    to: [{ name: 'Natalie Brooks', address: 'nbrooks@mailhub.test' }],
    subject: `Reservation confirmed - Sat Nov 8, 7:30 PM, party of 6`,
    body: `Hi Natalie,

Your table for 6 on Saturday, November 8 at 7:30 PM is confirmed. For parties of 6 or more we hold the table for 15 minutes and add an 18% service charge.

If anyone in your party has an allergy, let us know ahead of time and the chef will prepare accordingly.

See you Saturday!
Kaito Sushi`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Trade association to a member firm about a seminar; nothing under SPEC §5.`,
    industry: 'trade association', variant: 'UK',
    from: { name: 'Member Services', address: 'members@nationalglazingfederation.example' },
    to: [{ name: 'Martin Reeve', address: 'martin@reevewindows.test' }],
    subject: `Building regs update seminar - 20 Nov, online`,
    body: `Dear Martin,

A reminder that the online seminar on the updated Part L and Part F requirements is on Thursday 20 November, 10am to 12 noon. It's free for members; register through the members' area and the link will be emailed the day before.

Slides and a recording will be available afterwards. CPD certificates are issued for attendance.

Regards,
Member Services`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Business networking group to a visitor; nothing under SPEC §5.`,
    industry: 'business networking group', variant: 'UK',
    from: { name: 'Chapter Secretary', address: 'secretary@breakfastconnectharrogate.example' },
    to: [{ name: 'Clare Dobson', address: 'clare@dobsonarchitects.test' }],
    subject: `Visiting us on Tuesday`,
    body: `Hi Clare,

Looking forward to welcoming you on Tuesday. We meet at the Majestic from 6.45am, breakfast is served at 7 and we finish by 8.30. Visitors pay £15 for breakfast on the door. You'll get a minute to introduce yourself and your practice, so bring some cards.

Ask for me at the door.

Kind regards,
Alan`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Mobile mechanic confirming a visit; nothing under SPEC §5.`,
    industry: 'mobile mechanic', variant: 'IE',
    from: { name: 'Mobile Motors', address: 'ronan@mobilemotorswicklow.example' },
    to: [{ name: 'Siobhan Kelly', address: 'siobhan.kelly@eircommail.test' }],
    subject: `Brakes Thursday`,
    body: `Hi Siobhan, I'll be at yours Thursday about 9 to do the front pads and discs on the Yaris, about an hour and a half. €210 all in as quoted. Just need the car on the drive with the keys handy. Ronan`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Drone photography firm quoting an estate agent; customer-facing price (SPEC §5.5 does not flag).`,
    industry: 'drone photography', variant: 'UK',
    from: { name: 'Skyline Aerial Imaging', address: 'hello@skylineaerialimaging.example' },
    to: [{ name: 'Tash Moreno', address: 'tash@harbourlinerealty.test' }],
    subject: `Re: aerial shots for the farmhouse listing`,
    body: `Hi Tash,

Happy to do it. For the farmhouse: 10 edited aerial stills and a 60-second video, delivered within 48 hours of the shoot, £280. We're licensed and insured, and we'll check airspace for the site beforehand.

Weather permitting, Tuesday or Wednesday morning next week works. Golden hour would be best, so about 8am.

Cheers,
Will`,
  },
  {
    category: 'none', expect: 'pass',
    why: `3D printing service to a customer about a job; nothing under SPEC §5.`,
    industry: '3D printing service', variant: 'CA',
    from: { name: 'MakeIt 3D', address: 'jobs@makeit3dprinting.example' },
    to: [{ name: 'Simon Tran', address: 'simon.tran@worldmail.test' }],
    subject: `Your bracket prints - ready`,
    body: `Hi Simon,

Your 6 brackets are printed in the PETG, black, and they're ready for pickup. One had a small layer shift so we reprinted it, no charge. $48 total as quoted.

If you need the files tweaked for a snugger fit, send us the measurements and we can adjust the model.

MakeIt 3D`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Makerspace to a member about induction and access hours; the word access in ordinary logistics (SPEC §5.1 does not flag).`,
    industry: 'makerspace', variant: 'US',
    from: { name: 'Forge Makerspace', address: 'members@forgemakerspace.example' },
    to: [{ name: 'Dana Whitfield', address: 'dwhitfield@postbox.test' }],
    subject: `Welcome + laser cutter induction`,
    body: `Hi Dana,

Welcome to Forge! Your membership is active and your key fob will work from tomorrow, giving you access 7 AM to 11 PM daily.

To use the laser cutter you'll need to complete the induction. Next sessions are Tuesday 6 PM and Saturday 10 AM, about 90 minutes, sign up on the members' board. The wood shop induction is separate.

Monthly dues are $65, billed on the 1st. Open shop night is Thursday if you want to meet folks.

Cheers,
Forge`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Toy library to a family about returns; nothing under SPEC §5.`,
    industry: 'toy library', variant: 'NZ',
    from: { name: 'Bayside Toy Library', address: 'hello@baysidetoylibrary.example' },
    to: [{ name: 'The Patel whanau', address: 'patels.nz@xtramail.test' }],
    subject: `Toys due back Saturday`,
    body: `Kia ora,

Just a reminder your three toys (the marble run, the wooden train set and the doctor's kit) are due back this Saturday. We're open 9.30 to 11.30. Late fees are $2 per toy per week, but just let us know if you need longer and we can renew.

Ngā mihi,
Bayside Toy Library`,
  },
  {
    category: 'none', expect: 'pass',
    why: `Village hall committee to a hirer about a key handover; keys as ordinary logistics with no code given (SPEC §5.1 does not flag).`,
    industry: 'village hall', variant: 'UK',
    from: { name: 'Bookings Secretary', address: 'bookings@ashwellvillagehall.example' },
    to: [{ name: 'Mr P Lang', address: 'p.lang@homemail.example' }],
    subject: `Your booking Sat 29 Nov - keys`,
    body: `Dear Mr Lang,

For your booking on Saturday 29 November, please collect the hall keys from the Post Office on Friday afternoon (they close at 5) and drop them back through the Post Office letterbox after your event. Heating instructions are on the wall by the kitchen door.

Please leave the hall as you found it and put the bins out by the gate.

Many thanks,
Ashwell Village Hall`,
  },
  // ---- stops ----
  {
    category: 'economics', expect: 'stop',
    why: `SPEC §5.5: "We only allowed 3k for the signage in our numbers, the rest of that line is profit." reveals what the sender carried for an item and its profit.`,
    industry: 'shopfitting contractor', variant: 'UK', placement: 'body',
    deciding: `We only allowed 3k for the signage in our numbers, the rest of that line is profit.`,
    from: { name: 'Rob Standish', address: 'rob@standishshopfitters.example' },
    to: [{ name: 'Tama', address: 'jobs@signwisenz.test' }],
    subject: `Re: Westfield unit - signage quote`,
    body: `Tama,

Your quote's come in higher than I'd hoped. We only allowed 3k for the signage in our numbers, the rest of that line is profit. If you can get down to that we'll give you the next two units as well.

Let me know by Friday.

Rob`,
  },
  {
    category: 'negotiation', expect: 'stop',
    why: `SPEC §5.6: "Let them think the January start is fixed; we can slip to March if it gets the price down." reveals the sender's hidden room on terms and its tactic, in the quoted history.`,
    industry: 'facilities management', variant: 'UK', placement: 'quoted',
    deciding: `Let them think the January start is fixed; we can slip to March if it gets the price down.`,
    from: { name: 'Anne Whitlock', address: 'anne@whitlockfacilities.example' },
    to: [{ name: 'Procurement', address: 'procurement@bridgewaterestates.test' }],
    subject: `Fwd: cleaning contract - mobilisation date`,
    body: `Hi Dev,

Forwarding the internal note on timing so you have our position in writing. We can confirm the January mobilisation as discussed on the call.

Anne

> Anne, Bridgewater want the January start locked before they'll sign. Do we commit?
> Phil

>> Phil, yes commit to January in the paperwork. Let them think the January start is fixed; we can slip to March if it gets the price down. Push on the uplift first.
>> Anne`,
  },
  {
    category: 'remark', expect: 'stop',
    why: `SPEC §5.7: "Their so-called project manager couldn't organise a round of drinks." is a disparaging remark about a person.`,
    industry: 'IT services', variant: 'AU', placement: 'body',
    deciding: `Their so-called project manager couldn't organise a round of drinks.`,
    from: { name: 'Sanjay Mehta', address: 'sanjay@clearpathitservices.example' },
    to: [{ name: 'Fiona', address: 'fiona@harbourviewaccounting.test' }],
    subject: `Re: the software vendor's go-live date`,
    body: `Fiona,

The vendor has slipped again, now saying the 24th. Their so-called project manager couldn't organise a round of drinks. We'll keep your old system running in parallel for another fortnight so there's no risk to the quarter end.

I'll update you Friday.

Sanjay`,
  },
];
