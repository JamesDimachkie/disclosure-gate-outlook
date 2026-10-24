// everyday6a batch 07: ordinary passes 241-260.
export default [
  {
    id: 241, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'parking operator', variant: 'UK', setting: 'car park permit renewal',
    from: ['Permits', 'permits@citycentre-parking.example'], to: [['Nadia Hussain', 'nadia.hussain@hussain-accountants.test']],
    subject: 'Your parking permit expires 31 December',
    body: `Dear Nadia,

Your annual permit for the Market Street car park expires on 31 December. To renew for next year, log in to your account and select renew; the new permit will be posted within five working days. If your vehicle registration has changed, update it before renewing.

Permits Team
City Centre Parking`,
    why: 'SPEC §5: ordinary outside email; a renewal reminder with nothing from §5.1 to §5.10.',
  },
  {
    id: 242, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'choir', variant: 'UK', setting: 'rehearsal venue change',
    from: ['Bev Thornton', 'bev@wrenfield-players.example'], to: [['Members', 'members@homeuser-mail.test']],
    subject: 'Thursday rehearsal moved to the Methodist hall',
    body: `Hi all,

Thursday's rehearsal is in the Methodist hall on Chapel Street, not the usual room, as the school needs it for parents' evening. Same time, 7.30. Parking is on the street. Bring your copies of the Rutter.

Bev`,
    why: 'SPEC §5: ordinary outside email; a venue change with nothing from §5.1 to §5.10.',
  },
  {
    id: 243, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'private landlord', variant: 'UK', setting: 'new letting agent notice to a tenant',
    from: ['Mike Rowan', 'mike.rowan@homeuser-mail.example'], to: [['Chloe Barnes', 'chloe.barnes@homeuser-mail.test']],
    subject: 'Hume Estates will manage the flat from January',
    body: `Hi Chloe,

From 1 January the flat will be managed by Hume Estates rather than by me directly. They will be in touch to introduce themselves and to give you their contact details for repairs. Your tenancy, rent and the way you pay are unchanged. Thanks for being a great tenant this year.

Mike`,
    why: 'SPEC §5: ordinary outside email; a management change with nothing from §5.1 to §5.10.',
  },
  {
    id: 244, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'photography', variant: 'UK', setting: 'studio hire enquiry',
    from: ['Tess Morgan', 'tess@morgan-photo.example'], to: [['Studio Bookings', 'bookings@whitebox-studios.test']],
    subject: 'Studio hire 3 December',
    body: `Hi,

Is Studio 2 free on 3 December from 9 to 5? I would need the white infinity wall, two strobes and the make-up station. I would also like to know whether there is parking for a van. Thanks.

Tess`,
    why: 'SPEC §5: ordinary outside email; a hire enquiry with nothing from §5.1 to §5.10.',
  },
  {
    id: 245, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'wholesale', variant: 'UK', setting: 'prices held for next year',
    from: ['Thames Trade Supplies', 'sales@thames-trade-supplies.example'], to: [['Accounts', 'accounts@bright-electrical.test']],
    subject: 'Your prices for next year',
    body: `Dear Customer,

We are pleased to confirm that your account prices will be held at current levels for the whole of next year. The price list you have remains valid. Thank you for your business this year.

Thames Trade Supplies`,
    why: 'SPEC §5: ordinary outside email; a customer-facing pricing notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 246, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'scouts', variant: 'UK', setting: 'camp kit list to parents',
    from: ['Skip', 'leader@3rd-ashby-scouts.example'], to: [['Scout Parents', 'scoutparents@homeuser-mail.test']],
    subject: 'Kit list for the autumn camp',
    body: `Dear Parents,

Kit list for the autumn camp, 15 to 17 November:

- Sleeping bag and roll mat
- Waterproof jacket and trousers
- Walking boots and a spare pair of shoes
- Warm layers, hat and gloves
- Torch with spare batteries
- Plate, bowl, mug and cutlery in a bag
- Water bottle
- Wash kit and towel

No phones or sweets please. Drop-off is 6pm Friday at the hut, pick-up 2pm Sunday. Any questions, grab me at Thursday's meeting.

Skip`,
    why: 'SPEC §5: ordinary outside email; a kit list with nothing from §5.1 to §5.10.',
  },
  {
    id: 247, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'SaaS', variant: 'US', setting: 'payment receipt',
    from: ['Billing', 'billing@ridgeview-software.example'], to: [['Maria Lopez', 'maria.lopez@lopez-dental.test']],
    subject: 'Payment received, thank you',
    body: `Hi Maria,

We have received your payment of 1,188 for the annual subscription. Your receipt is in the next email and your plan is active through November 30 of next year. Thanks for being a customer.

Billing
Ridgeview Software`,
    why: 'SPEC §5: ordinary outside email; a receipt with a customer-facing amount, nothing from §5.1 to §5.10.',
  },
  {
    id: 248, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'dentistry', variant: 'UK', setting: 'new patient registration',
    from: ['Maple Dental', 'reception@maple-dental.example'], to: [['Jordan Blake', 'jordan.blake@homeuser-mail.test']],
    subject: 'Welcome to Maple Dental',
    body: `Dear Jordan,

Thank you for registering with us. Your first appointment is on Monday 1 December at 9.40 with Dr Hughes. Please arrive ten minutes early to complete the registration form, or fill it in online through the link we will send separately. Bring a list of any medication you take.

Maple Dental`,
    why: 'SPEC §5: ordinary outside email; a registration welcome with nothing from §5.1 to §5.10.',
  },
  {
    id: 249, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'holiday lettings', variant: 'UK', setting: 'holiday cottage booking enquiry',
    from: ['Lisa Pound', 'lisa.pound@homeuser-mail.example'], to: [['Cottage Bookings', 'bookings@seaview-cottages.test']],
    subject: 'Availability in February half term',
    body: `Hi,

Do you have the Harbour Cottage free for the week of 16 February? There would be two adults, two children and a well-behaved dog. If that week is taken, the week after would also work. Could you let me know the price and whether linen is included?

Thanks,
Lisa`,
    why: 'SPEC §5: ordinary personal email; a booking enquiry with nothing from §5.1 to §5.10.',
  },
  {
    id: 250, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'homeowners association', variant: 'US', setting: 'pool closing for the season',
    from: ['Willow Creek HOA', 'board@willowcreek-hoa.example'], to: [['Residents', 'residents@homeuser-mail.test']],
    subject: 'Pool closes for the season on October 15',
    body: `Dear Residents,

The community pool will close for the season on October 15. The furniture will be stored and the cover installed the following week. The clubhouse remains open on its usual schedule. Thank you to everyone who helped keep the pool area clean this summer. The pool reopens Memorial Day weekend.

Willow Creek HOA Board`,
    why: 'SPEC §5: ordinary outside email; a community notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 251, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'electrical trade', variant: 'AU', setting: 'quote visit time confirmation',
    from: ['Jarrod', 'jarrod@jp-sparky.example'], to: [['Kylie Nguyen', 'kylie@nguyen-pharmacies.test']],
    subject: 'Tomorrow arvo',
    body: `Hi Kylie,

I can swing by tomorrow arvo about 2 to have a look at the lighting for the new shop and measure up for the quote. Should take half an hour. Let me know if that doesn't suit.

Cheers
Jarrod`,
    why: 'SPEC §5: ordinary outside email; a visit arrangement with nothing from §5.1 to §5.10.',
  },
  {
    id: 252, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'tennis club', variant: 'UK', setting: 'court resurfacing closure',
    from: ['Club Secretary', 'secretary@oakwood-tennis.example'], to: [['Members', 'members@homeuser-mail.test']],
    subject: 'Courts 1 and 2 closed next week',
    body: `Dear Members,

Courts 1 and 2 will be closed from Monday to Friday next week for resurfacing. Courts 3 and 4 remain open and can be booked as usual. Coaching sessions move to courts 3 and 4 for the week. The clubhouse is unaffected.

Club Secretary
Oakwood Tennis Club`,
    why: 'SPEC §5: ordinary outside email; a facilities notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 253, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'veterinary', variant: 'UK', setting: 'new opening hours',
    from: ['Brightwater Vets', 'reception@brightwater-vets.example'], to: [['Clients', 'clients@homeuser-mail.test']],
    subject: 'New opening hours from December',
    body: `Dear Clients,

From 1 December we will be open from 8am to 7pm on weekdays and 9 to 1 on Saturdays. Emergency cover outside those hours is unchanged; call the usual number and you will be put through. Online booking is now available for routine appointments.

Brightwater Vets`,
    why: 'SPEC §5: ordinary outside email; an hours notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 254, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'charity', variant: 'UK', setting: 'volunteer thank-you',
    from: ['Events', 'events@hopeline-charity.example'], to: [['Volunteer Marshals', 'marshals@homeuser-mail.test']],
    subject: 'Thank you for Sunday',
    body: `Dear Marshals,

Thank you for giving up your Sunday morning. The fun run raised just over 9,000 and every runner got round safely, which is down to you. Photos are on the website. We will be in touch about next year's events in the spring.

Events Team
Hopeline`,
    why: 'SPEC §5: ordinary outside email; a thank-you with nothing from §5.1 to §5.10.',
  },
  {
    id: 255, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'translation', variant: 'UK', setting: 'holiday closure dates',
    from: ['Clearword Translation', 'office@clearword-translation.example'], to: [['Michael Oduya', 'michael.oduya@oduya-exports.test']],
    subject: 'Our Christmas closing dates',
    body: `Dear Michael,

We will be closed from 24 December to 2 January inclusive. Any work due in that period will be delivered before the 24th; please send anything urgent for the first week of January by 19 December so we can schedule it. Wishing you a good break.

Clearword Translation`,
    why: 'SPEC §5: ordinary outside email; a closure notice with nothing from §5.1 to §5.10.',
  },
  {
    id: 256, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'construction', variant: 'UK', setting: 'steel delivery and crane arrangements',
    from: ['Simon Teague', 'simon@teague-construction.example'], to: [['Deliveries', 'deliveries@castle-steel.test']],
    subject: 'Steel delivery Tuesday: crane on site from 7',
    body: `Hi,

Confirming the steel delivery for Tuesday. The crane will be on site from 7 and set up by 8, so please have the first load arrive between 8 and 8.30 and the second after 11. Access is from the Mill Lane entrance and the banksman will meet the drivers. Call me on the mobile if the loads are running late.

Simon`,
    why: 'SPEC §5: ordinary outside email; delivery logistics with nothing from §5.1 to §5.10.',
  },
  {
    id: 257, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'café', variant: 'UK', setting: 'catering order for a meeting',
    from: ['Kate Ellis', 'kate.ellis@fenwick-foods.example'], to: [['Sunita', 'sunita@greenleaf-cafe.test']],
    subject: 'Sandwich platters for Wednesday',
    body: `Hi Sunita,

Could we have three mixed sandwich platters, one vegan platter and two fruit platters delivered to our reception on Wednesday by 12.15 for a lunchtime meeting of about 20? Invoice to the usual address. Thanks as always.

Kate`,
    why: 'SPEC §5: ordinary outside email; a catering order with nothing from §5.1 to §5.10.',
  },
  {
    id: 258, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'museum', variant: 'UK', setting: 'membership renewal',
    from: ['Membership', 'membership@riverbank-museum.example'], to: [['Alice Munro', 'alice.munro@homeuser-mail.test']],
    subject: 'Your membership is due for renewal',
    body: `Dear Alice,

Your membership runs out at the end of November. Renewing for a year costs 45 for an individual or 70 for a joint membership, and gives you free entry to exhibitions, the members' preview evenings and 10 percent off in the shop and café. You can renew online or at the front desk.

Membership Team
Riverbank Museum`,
    why: 'SPEC §5: ordinary outside email; a renewal notice with customer-facing prices, nothing from §5.1 to §5.10.',
  },
  {
    id: 259, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'recruitment', variant: 'UK', setting: 'employment reference request',
    from: ['Yasmin Ali', 'yasmin@ali-recruitment.example'], to: [['HR', 'hr@merrow-insurance.test']],
    subject: 'Reference request',
    body: `Dear HR Team,

A former employee of yours has given you as a referee for a role we are placing. With their written consent, which we hold, could you confirm their dates of employment and job title? A short reply by email is fine. Thank you for your help.

Yasmin Ali
Ali Recruitment`,
    why: 'SPEC §5: ordinary outside email; a factual reference request naming nothing sensitive, nothing from §5.1 to §5.10.',
  },
  {
    id: 260, kind: 'ordinary', category: 'none', expect: 'pass', industry: 'architecture', variant: 'UK', setting: 'thank you after project completion',
    from: ['Studio Walden', 'studio@walden-architects.example'], to: [['Anna Kowal', 'anna.kowal@ridgeway-housing.test']],
    subject: 'Thank you',
    body: `Dear Anna,

With the handover done, we wanted to say thank you. It has been a pleasure working with you and your team over the last two years, and the finished building is something we are all proud of. The as-built drawings and the operation and maintenance manuals will be with you by the end of the month. We hope to work together again.

With best wishes,
Studio Walden`,
    why: 'SPEC §5: ordinary outside email; a thank-you with nothing from §5.1 to §5.10.',
  },
];
