// everyday6a batch 06: ordinary passes 201-240.
export default [
  {
    id: 201, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'gym', variant: 'UK', setting: 'class cancellation notice',
    from: ['Ironworks Gym', 'hello@ironworks-gym.example'], to: [['Members', 'members@homeuser-mail.test']],
    subject: 'Tonight\'s 6.30 spin class is cancelled',
    body: `Hi all,

Sorry for the short notice: tonight's 6.30 spin class is cancelled. The 7.30 circuits class is running as normal and has space if you would like to swap. Bookings for tonight have been refunded to your account automatically.

Ironworks Gym`,
    why: 'SPEC §5: ordinary outside email; a class cancellation with nothing from §5.1 to §5.10.',
  },
  {
    id: 202, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'library', variant: 'UK', setting: 'overdue book reminder',
    from: ['Hartfield Library', 'loans@hartfield-library.example'], to: [['Peter Collins', 'peter.collins@homeuser-mail.test']],
    subject: 'Two items due back',
    body: `Dear Peter,

Two items on your account were due back on the 12th. You can renew them online or by phone if nobody has reserved them, or return them to any branch. Thanks.

Hartfield Library`,
    why: 'SPEC §5: ordinary outside email; a loan reminder with nothing from §5.1 to §5.10.',
  },
  {
    id: 203, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'optician', variant: 'UK', setting: 'glasses ready for collection',
    from: ['Vista Opticians', 'care@vista-opticians.example'], to: [['Raj Mehta', 'raj.mehta@homeuser-mail.test']],
    subject: 'Your glasses are ready',
    body: `Dear Raj,

Your new glasses are ready to collect. We are open 9 to 5.30 Monday to Saturday; no appointment is needed, but if you would like us to adjust the fit, allow ten minutes. See you soon.

Vista Opticians`,
    why: 'SPEC §5: ordinary outside email; a collection notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 204, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'taxi firm', variant: 'UK', setting: 'airport transfer booking confirmation',
    from: ['Bookings', 'bookings@citycabs-airport.example'], to: [['Lena Fischer', 'lena.fischer@fischer-research.test']],
    subject: 'Airport pickup Monday 5.15am',
    body: `Dear Lena,

Your pickup is confirmed for Monday at 5.15am from your hotel to Terminal 2. The driver will text you when outside. The fare is 48, payable by card in the car. If your plans change, call us on the 24-hour line.

City Cabs`,
    why: 'SPEC §5: ordinary outside email; a booking confirmation with nothing from §5.1 to §5.10.',
  },
  {
    id: 205, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'film production', variant: 'UK', setting: 'location scouting request to a farm',
    from: ['Hana Suzuki', 'hana@littlebird-films.example'], to: [['Mr Hughes', 'hughes@hillfarm-cymru.test']],
    subject: 'Filming on your land in March?',
    body: `Dear Mr Hughes,

I am a location manager for a small drama being shot in North Wales next spring. We are looking for a hill farm with a stone barn and a view down the valley, and your farm came up through the local tourism office. Would you be open to a visit in the next few weeks to see whether it might suit? If it did, we would be talking about three or four days in March, a crew of about twenty, and a location fee plus any making-good. No obligation at all at this stage.

With thanks,
Hana Suzuki
Little Bird Films`,
    why: 'SPEC §5: ordinary outside email; an enquiry with nothing from §5.1 to §5.10.',
  },
  {
    id: 206, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'university', variant: 'UK', setting: 'thanks for a guest lecture',
    from: ['Dr Simon Ward', 'simon.ward@wharfdale-university.example'], to: [['Marcus Hale', 'marcus.hale@hale-engineering.test']],
    subject: 'Thank you for Thursday',
    body: `Dear Marcus,

Thank you for the guest lecture on Thursday. The students were still talking about the bridge case study in the seminar afterwards, which is the best sign. Would you be willing to come back next year? We would also be interested in placing one or two students with you for summer placements if that is ever of interest.

Best wishes,
Simon`,
    why: 'SPEC §5: ordinary outside email; thanks and an enquiry with nothing from §5.1 to §5.10.',
  },
  {
    id: 207, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'wine merchant', variant: 'UK', setting: 'Christmas case offer to customers',
    from: ['Vine and Barrel', 'shop@vineandbarrel.example'], to: [['Gordon Reid', 'gordon.reid@homeuser-mail.test']],
    subject: 'Christmas cases now available',
    body: `Dear Gordon,

Our Christmas mixed cases are now available: six bottles for 72 or twelve for 135, with free delivery in the county before 20 December. This year's selection leans towards the Rhône and the Loire, with a sparkling wine from Sussex for the day itself. Order online or call the shop.

Vine and Barrel`,
    why: 'SPEC §5: ordinary outside email; customer-facing prices offered to the recipient, nothing from §5.1 to §5.10.',
  },
  {
    id: 208, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'charity', variant: 'UK', setting: 'grant report submitted to a funder',
    from: ['Hopeline', 'grants@hopeline-charity.example'], to: [['Grants Team', 'grants@fairmount-foundation.test']],
    subject: 'End-of-year report for grant 2026-118',
    body: `Dear Grants Team,

Please find our end-of-year report for grant 2026-118 in the next email. The project reached 412 young people against a target of 350, and the three workshop venues are confirmed for next year. We have also included the case studies and the photo consent forms you asked for. Thank you again for your support.

Grants Team
Hopeline`,
    why: 'SPEC §5: ordinary outside email; a report cover note with nothing from §5.1 to §5.10.',
  },
  {
    id: 209, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'software', variant: 'US', setting: 'webinar invitation to customers',
    from: ['Clearpath Analytics', 'events@clearpath-analytics.example'], to: [['Robert Chen', 'robert.chen@chen-logistics.test']],
    subject: 'Webinar: what\'s new in the winter release',
    body: `Hi Robert,

Join us on December 10 at 11am Pacific for a 45-minute walkthrough of the winter release, including the new scheduling dashboard and the mobile app updates. There will be time for questions at the end. Register through the link on our events page; a recording will be sent to everyone who registers.

Clearpath Analytics`,
    why: 'SPEC §5: ordinary outside email; an event invitation with nothing from §5.1 to §5.10.',
  },
  {
    id: 210, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'lettings', variant: 'UK', setting: 'boiler service date to a tenant',
    from: ['Drumlin Lettings', 'office@drumlin-lettings.example'], to: [['Tenants, 14 Ashgrove', 'ashgrove14@homeuser-mail.test']],
    subject: 'Boiler service Thursday',
    body: `Hi,

The annual boiler service is booked for Thursday after 9am with our usual engineer. He will need about 45 minutes in the kitchen. If nobody will be home, let us know and we will rearrange.

Drumlin Lettings`,
    why: 'SPEC §5: ordinary outside email; a service appointment with nothing from §5.1 to §5.10.',
  },
  {
    id: 211, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'cricket club', variant: 'UK', setting: 'fixture list to an opposing club',
    from: ['Steve Bannerman', 'fixtures@hollowell-cricket.example'], to: [['Jamal Said', 'jamal.said@eastfield-juniors.test']],
    subject: 'Proposed fixtures for next season',
    body: `Hi Jamal,

Proposed dates for next season's friendlies: Sunday 10 May at ours, Sunday 21 June at yours, Sunday 2 August at ours, all 1pm starts, 35 overs. Let me know if any clash with your league fixtures and we will shuffle.

Steve`,
    why: 'SPEC §5: ordinary outside email; fixture planning with nothing from §5.1 to §5.10.',
  },
  {
    id: 212, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'publishing', variant: 'UK', setting: 'author confirming a manuscript delivery date',
    from: ['Daniel Kerr', 'daniel.kerr@kerr-writes.example'], to: [['Ruth Ellison', 'ruth@kestrel-press.test']],
    subject: 'Manuscript delivery',
    body: `Hi Ruth,

Confirming I will deliver the full manuscript on 15 January as per the contract. Chapters 1 to 9 are done; 10 to 12 are drafted and being revised. I will send the picture list and permissions log at the same time.

Daniel`,
    why: 'SPEC §5: ordinary outside email; a delivery confirmation with nothing from §5.1 to §5.10.',
  },
  {
    id: 213, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'bike shop', variant: 'UK', setting: 'repair ready for collection',
    from: ['Spoke and Wheel', 'workshop@spokeandwheel.example'], to: [['Amira Hassan', 'amira.hassan@homeuser-mail.test']],
    subject: 'Your bike is ready',
    body: `Hi Amira,

Your bike is ready to collect. We replaced the chain and cassette, trued the back wheel and adjusted the gears. The total is 86 as quoted. We are open until 6 today and 5 on Saturday.

Spoke and Wheel`,
    why: 'SPEC §5: ordinary outside email; a collection notice with a customer-facing price, nothing from §5.1 to §5.10.',
  },
  {
    id: 214, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'hairdresser', variant: 'UK', setting: 'appointment confirmation',
    from: ['Salon 42', 'hello@salon42-hair.example'], to: [['Lauren Scott', 'lauren.scott@homeuser-mail.test']],
    subject: 'See you Saturday at 11',
    body: `Hi Lauren,

Confirming your cut and colour with Jess on Saturday at 11. Allow about two hours. If you need to change it, 24 hours' notice please.

Salon 42`,
    why: 'SPEC §5: ordinary outside email; an appointment confirmation with nothing from §5.1 to §5.10.',
  },
  {
    id: 215, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'events', variant: 'UK', setting: 'AV requirements query to a venue',
    from: ['Laura Bennett', 'laura@summit-conferences.example'], to: [['Venue Team', 'events@grandhall-venues.test']],
    subject: 'AV for the main hall',
    body: `Hi,

A few AV questions for the 14th: does the main hall have a built-in projector or do we bring our own; how many wireless mics are available; and is there a hard-wired internet connection at the stage for the live stream? Our AV lead Jon can come for a walkthrough next week if that is easier.

Thanks,
Laura`,
    why: 'SPEC §5: ordinary outside email; technical questions with nothing from §5.1 to §5.10.',
  },
  {
    id: 216, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'local council', variant: 'UK', setting: 'recycling collection change notice',
    from: ['Waste Services', 'waste@fenbridge-council.example'], to: [['Residents', 'residents@homeuser-mail.test']],
    subject: 'Recycling collections over the holidays',
    body: `Dear Residents,

Over the holiday period collections will be one day later than usual from 25 December to 3 January. Normal collection days resume on 6 January. Real Christmas trees will be collected with garden waste in the second week of January. Please leave bins out by 7am.

Waste Services
Fenbridge Council`,
    why: 'SPEC §5: ordinary outside email; a public service notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 217, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'property development', variant: 'UK', setting: 'show home opening invitation',
    from: ['Ridgeway Housing', 'sales@ridgeway-housing.example'], to: [['Daniel Price', 'daniel.price@homeuser-mail.test']],
    subject: 'Show home open this weekend',
    body: `Dear Daniel,

Thank you for registering your interest in Elmbridge Gardens. The show home opens this Saturday and Sunday, 10 to 4, and the sales team will be on hand with plans and prices for the first phase. No appointment needed; parking is on site.

Ridgeway Housing`,
    why: 'SPEC §5: ordinary outside email; a marketing invitation with nothing from §5.1 to §5.10.',
  },
  {
    id: 218, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'travel agency', variant: 'UK', setting: 'itinerary change notice',
    from: ['Globe Travel', 'bookings@globe-travel.example'], to: [['Helen Carr', 'helen.carr@homeuser-mail.test']],
    subject: 'Flight time change for 14 March',
    body: `Dear Helen,

The airline has moved your outbound flight on 14 March from 10.45 to 12.10. Your hotel and transfer have been adjusted and nothing else changes. Updated e-tickets will follow. Apologies for any inconvenience.

Globe Travel`,
    why: 'SPEC §5: ordinary outside email; a schedule change with nothing from §5.1 to §5.10.',
  },
  {
    id: 219, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'freight forwarding', variant: 'UK', setting: 'customs paperwork request',
    from: ['Trident Freight', 'customs@trident-freight.example'], to: [['Caroline Webb', 'caroline.webb@webb-imports.test']],
    subject: 'Documents needed for shipment TF-5521',
    body: `Dear Caroline,

To clear shipment TF-5521 we need the commercial invoice, the packing list and the certificate of origin. If you can send them today we should clear tomorrow and deliver Thursday. Please also confirm the commodity codes you want us to use for the two new product lines.

Customs Team
Trident Freight`,
    why: 'SPEC §5: ordinary outside email; a document request with nothing from §5.1 to §5.10.',
  },
  {
    id: 220, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'school PTA', variant: 'UK', setting: 'quiz night announcement',
    from: ['Oakfield PTA', 'pta@oakfield-primary.example'], to: [['Parents', 'parents@homeuser-mail.test']],
    subject: 'Quiz night Friday 28 November',
    body: `Dear Parents,

The PTA quiz night is on Friday 28 November at 7.30 in the school hall. Tables of up to eight, 5 per person, bring your own drinks and nibbles. All proceeds go towards the new playground equipment. Book your table by replying with a team name and the number of people.

Oakfield PTA`,
    why: 'SPEC §5: ordinary outside email; an event announcement with nothing from §5.1 to §5.10.',
  },
  {
    id: 221, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'personal', variant: 'UK', setting: 'thank you after a dinner',
    from: ['Hannah Price', 'hannah@price-advisory.example'], to: [['Owen and Mari', 'owen.mari@homeuser-mail.test']],
    subject: 'Thank you for Saturday',
    body: `Hi both,

Thank you for a lovely evening on Saturday. The lamb was wonderful and it was so good to catch up properly. Our turn next; are you free the weekend after next?

Hannah`,
    why: 'SPEC §5: ordinary personal email; a thank-you with nothing from §5.1 to §5.10.',
  },
  {
    id: 222, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'farm supplies', variant: 'NZ', setting: 'farm supplies order',
    from: ['Gavin Muir', 'gavin@muir-farms.example'], to: [['Orders', 'orders@southland-rural-supplies.test']],
    subject: 'Order for next week',
    body: `Hi team,

Can you put together the following for pickup Tuesday: 20 bags of calf meal, 4 rolls of electric fence tape, a box of standards and 2 of the 20-litre drench. I will be in around 10 with the ute. Put it on the farm account.

Cheers
Gavin`,
    why: 'SPEC §5: ordinary outside email; a supplies order with nothing from §5.1 to §5.10.',
  },
  {
    id: 223, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'professional services', variant: 'SG', setting: 'office relocation notice to vendors',
    from: ['Office Admin', 'admin@merlion-advisory.example'], to: [['Vendor Relations', 'vendors@tanjong-stationery.test']],
    subject: 'Our office is moving on 1 December',
    body: `Dear Vendor,

Please note that from 1 December our office will move to Level 12, 88 Robinson Road. Kindly update your records and send all deliveries to the new address from that date. Our phone numbers and email addresses remain the same. Deliveries to the old address after 30 November cannot be accepted.

Thank you,
Office Admin
Merlion Advisory`,
    why: 'SPEC §5: ordinary outside email; an address change with nothing from §5.1 to §5.10.',
  },
  {
    id: 224, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'youth hockey', variant: 'CA', setting: 'hockey team carpool',
    from: ['Coach Mike', 'coach@maple-ridge-minor-hockey.example'], to: [['U13 Parents', 'u13parents@homeuser-mail.test']],
    subject: 'Carpool for Saturday\'s away game',
    body: `Hi parents,

Saturday's game is in Chilliwack, puck drop 9am, so we need to leave the arena lot by 6.45. If you can drive and have spare seats, reply with how many. We will post the carpool list Friday evening. Full gear plus the white jerseys. Coffee is on me at the rink.

Mike`,
    why: 'SPEC §5: ordinary outside email; team logistics with nothing from §5.1 to §5.10.',
  },
  {
    id: 225, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'printing', variant: 'IN', setting: 'wedding invitation printing timeline',
    from: ['Lakshmi Prints', 'orders@lakshmi-prints.example'], to: [['Anand Krishnan', 'anand.krishnan@homeuser-mail.test']],
    subject: 'Wedding card printing schedule',
    body: `Dear Anand,

Thank you for finalising the design. The schedule is as follows: digital proof by Wednesday, your approval by Friday, printing and foil work the following week, and 500 cards ready for collection on the 22nd. Envelopes will be addressed as per the list you share. Kindly confirm the paper sample you preferred, the ivory or the cream.

Regards,
Lakshmi Prints`,
    why: 'SPEC §5: ordinary outside email; a production schedule with nothing from §5.1 to §5.10.',
  },
  {
    id: 226, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'marketing agency', variant: 'UK', setting: 'newsletter draft for client review',
    from: ['Josh Fielding', 'josh@parallax-creative.example'], to: [['Megan Ward', 'megan.ward@brightside-bakery.test']],
    subject: 'December newsletter draft',
    body: `Hi Megan,

The December newsletter draft is in the shared folder. It leads with the Christmas opening hours, then the new mince pie range, then the charity collection. Subject line options are in the comments. If you can send any changes by Thursday we will schedule it for Monday morning.

Josh`,
    why: 'SPEC §5: ordinary outside email; a review request with nothing from §5.1 to §5.10.',
  },
  {
    id: 227, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'charity shop', variant: 'UK', setting: 'donation drop-off hours',
    from: ['High Street Hospice Shop', 'shop@hospice-highstreet.example'], to: [['Margaret Doyle', 'margaret.doyle@homeuser-mail.test']],
    subject: 'Re: Dropping off donations',
    body: `Dear Margaret,

Thank you for thinking of us. We take donations Monday to Saturday between 10 and 4 at the back door on Chapel Lane. We can accept clothes, books, homewares and small furniture, but not electrical items or mattresses. If you have larger pieces, we can arrange a collection.

High Street Hospice Shop`,
    why: 'SPEC §5: ordinary outside email; practical information with nothing from §5.1 to §5.10.',
  },
  {
    id: 228, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'theatre', variant: 'UK', setting: 'ticket collection instructions',
    from: ['Box Office', 'boxoffice@playhouse-venues.example'], to: [['Tom Hadley', 'tom.hadley@homeuser-mail.test']],
    subject: 'Collecting your tickets for Saturday',
    body: `Dear Tom,

Your tickets for Saturday's 7.30 performance are ready at the box office. Please bring the card you paid with or a copy of your confirmation email. The box office opens an hour before the show. Latecomers are admitted at a suitable break.

Box Office`,
    why: 'SPEC §5: ordinary outside email; collection instructions with nothing from §5.1 to §5.10.',
  },
  {
    id: 229, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'photography', variant: 'UK', setting: 'image delivery notice',
    from: ['Nat Browne', 'nat@browne-photography.example'], to: [['Amy and Chris', 'amy.chris.wedding@homeuser-mail.test']],
    subject: 'Your photos are ready',
    body: `Hi Amy and Chris,

Your photos are ready. There are 640 edited images in the online gallery, and the link and your download instructions are in the next email. The gallery stays live for a year and you can share it with family. The album design proof will follow in a couple of weeks once you have picked your favourites.

Nat`,
    why: 'SPEC §5: ordinary outside email; a delivery notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 230, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'law firm', variant: 'UK', setting: 'signing appointment',
    from: ['Hugo Marchant', 'hugo.marchant@marchant-law.example'], to: [['Alan and Jean Whitby', 'whitby.family@homeuser-mail.test']],
    subject: 'Signing on Tuesday',
    body: `Dear Alan and Jean,

The documents are ready for signing. Could you come in on Tuesday at 3pm? It takes about half an hour and you will need photo ID. If Tuesday does not suit, Thursday morning also works.

Kind regards,
Hugo`,
    why: 'SPEC §5: ordinary outside email; an appointment with nothing from §5.1 to §5.10.',
  },
  {
    id: 231, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'pest control', variant: 'UK', setting: 'visit arrangement with a restaurant',
    from: ['Shield Pest Control', 'bookings@shield-pest.example'], to: [['Fatima Begum', 'fatima.begum@begum-restaurants.test']],
    subject: 'Quarterly visit next week',
    body: `Dear Fatima,

Your quarterly visit is due next week. Our technician can come Tuesday or Wednesday morning before you open; please let us know which suits. The visit takes about an hour and the report will be emailed the same day for your records.

Shield Pest Control`,
    why: 'SPEC §5: ordinary outside email; a service arrangement with nothing from §5.1 to §5.10.',
  },
  {
    id: 232, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'window cleaning', variant: 'UK', setting: 'schedule change to customers',
    from: ['Crystal Clear Windows', 'info@crystalclear-windows.example'], to: [['Mrs Henderson', 'j.henderson@homeuser-mail.test']],
    subject: 'Change of day',
    body: `Dear Mrs Henderson,

From December we will be cleaning your windows on Thursdays instead of Tuesdays, every four weeks as before. The first Thursday visit will be the 4th. Nothing else changes.

Crystal Clear Windows`,
    why: 'SPEC §5: ordinary outside email; a schedule change with nothing from §5.1 to §5.10.',
  },
  {
    id: 233, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'further education', variant: 'UK', setting: 'work experience placement confirmation',
    from: ['Placements', 'placements@westvale-college.example'], to: [['Steph Walsh', 'steph@northgate-mechanical.test']],
    subject: 'Work experience placement 9 to 13 February',
    body: `Dear Steph,

Thank you for offering a placement. Confirming that one of our Level 3 engineering students will be with you from 9 to 13 February, 9am to 4pm each day. We will send the placement agreement and the student's details once the paperwork is signed. A tutor will visit once during the week.

Placements Team
Westvale College`,
    why: 'SPEC §5: ordinary outside email; a placement confirmation with nothing from §5.1 to §5.10.',
  },
  {
    id: 234, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'running club', variant: 'IE', setting: 'Sunday run route',
    from: ['Niamh Keane', 'runs@liffey-harriers.example'], to: [['Members', 'members@homeuser-mail.test']],
    subject: 'Sunday long run',
    body: `Hi all,

Sunday's long run is the canal loop, 16k, meeting at the boathouse at 8. There is a shorter 10k option turning at the second lock. Coffee after in the usual place. Bring a head torch if you are doing the early start.

Niamh`,
    why: 'SPEC §5: ordinary outside email; a club notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 235, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'ferry company', variant: 'UK', setting: 'sailing time change',
    from: ['Islander Ferries', 'bookings@islander-ferries.example'], to: [['Charlotte Mason', 'charlotte.mason@homeuser-mail.test']],
    subject: 'Your sailing on Friday',
    body: `Dear Charlotte,

Due to the tide times, your sailing on Friday has moved from 14.30 to 15.15. Please check in at least 30 minutes before departure. Your return sailing is unchanged.

Islander Ferries`,
    why: 'SPEC §5: ordinary outside email; a schedule change with nothing from §5.1 to §5.10.',
  },
  {
    id: 236, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'florist', variant: 'UK', setting: 'delivery address check',
    from: ['Mary Doyle', 'mary@doyle-florists.example'], to: [['Graham Styles', 'graham.styles@homeuser-mail.test']],
    subject: 'Checking the delivery address',
    body: `Hi Graham,

Thanks for your order for Friday. Before we send the bouquet, could you confirm the delivery address? You gave 23 Beech Avenue but the postcode you entered is for Beech Road. Just reply with the right one and we will have it there by midday.

Mary`,
    why: 'SPEC §5: ordinary outside email; an address check with nothing from §5.1 to §5.10.',
  },
  {
    id: 237, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'architecture', variant: 'UK', setting: 'site meeting minutes',
    from: ['Studio Walden', 'studio@walden-architects.example'], to: [['Tech Office', 'technical@brightstone-build.test'], ['Anna Kowal', 'anna.kowal@ridgeway-housing.test']],
    subject: 'Site meeting minutes, 21 November',
    body: `Dear all,

Minutes of the site meeting held on 21 November.

Present: Studio Walden (architect), Brightstone Build (contractor), Ridgeway Housing (client).

1. Progress. The contractor reported that the frame is complete to roof level and the roof covering is 60 percent complete. Window installation starts in week 9. Overall progress is on programme.

2. Design queries. Three queries remain open: the balustrade fixing detail, the threshold at the main entrance and the colour of the rainwater goods. The architect will issue responses by Friday.

3. Samples. The brick sample panel was approved. The cladding sample is awaited from the supplier; the contractor will chase.

4. Client items. The client confirmed the kitchen specification and asked for the landscaping drawings to be issued for comment by the end of the month.

5. Programme. No change to the completion date.

6. Health and safety. No incidents reported. The hoarding on the north side will be extended next week for the crane lift.

7. Next meeting. Thursday 5 December at 10am on site.

Please let us know of any corrections within five working days.

Studio Walden`,
    why: 'SPEC §5: ordinary outside email; meeting minutes with nothing from §5.1 to §5.10.',
  },
  {
    id: 238, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'software', variant: 'UK', setting: 'feature release notes to customers',
    from: ['Quartz CRM', 'updates@quartz-crm.example'], to: [['Nina Ferreira', 'nina.ferreira@ferreira-travel.test']],
    subject: 'What\'s new this month',
    body: `Hi Nina,

This month's update is live. You can now export reports to spreadsheet format directly from the dashboard, the calendar view has a week-at-a-glance option, and the mobile app supports dark mode. Full release notes are in the help centre. As always, let us know what you think.

Quartz CRM`,
    why: 'SPEC §5: ordinary outside email; product news with nothing from §5.1 to §5.10.',
  },
  {
    id: 239, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'manufacturing', variant: 'US', setting: 'sample shipped to a prospect',
    from: ['Ironclad Fabrication', 'sales@ironclad-fabrication.example'], to: [['Dale Hughes', 'dale.hughes@hughes-machining.test']],
    subject: 'Sample bracket shipped',
    body: `Hi Dale,

The sample bracket shipped today by ground and should reach you Thursday. It is made to rev C of your drawing in 6061 with the clear anodize. Let us know how it checks out and we will finalize the quote for production quantities.

Sales Team
Ironclad Fabrication`,
    why: 'SPEC §5: ordinary outside email; a shipping notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 240, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'journalism', variant: 'UK', setting: 'freelance pitch to a magazine editor',
    from: ['Daniel Kerr', 'daniel.kerr@kerr-writes.example'], to: [['Features Editor', 'features@fieldcraft-magazine.test']],
    subject: 'Pitch: the last hand-forged gate makers',
    body: `Dear Features Editor,

I would like to pitch a 2,000-word feature on the handful of blacksmiths still making gates entirely by hand in the north of England. I have spoken to three of them and have access to a forge in Cumbria for photographs. The angle is the revival of interest from younger apprentices rather than a lament. I could deliver by the end of January. Clips available on request.

Best wishes,
Daniel Kerr`,
    why: 'SPEC §5: ordinary outside email; a story pitch with nothing from §5.1 to §5.10.',
  },
];
