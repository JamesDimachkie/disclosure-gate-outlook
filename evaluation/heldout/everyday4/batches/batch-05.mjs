// Batch 5: ordinary emails and stops (access, personal x2, economics, negotiation, remark x2). Literal text only.
export default [
  {
    ind: 'estate agency', en: 'UK',
    from: ['Gemma Rowley', 'gemma@rowley-and-finch.example'],
    to: [['Neil Barraclough', 'neil.barraclough@webmail.example']],
    subject: 'Viewing on Saturday at 11',
    body: `Hi Neil,

I've booked you in to view 9 Orchard Close on Saturday at 11. It's a three-bed semi with a good-sized garden, asking £315,000. The vendors are moving to Spain and would like to complete before Christmas. I'll meet you outside. If you are bringing someone, let me know so I can mention it to the vendors.

Gemma`
  },
  {
    ind: 'home inspection', en: 'US',
    from: ['Cliff Dalton', 'cliff@keystone-inspections.example'],
    to: [['Rebecca Lund', 'rebecca.lund@maplemail.example']],
    subject: 'Inspection report for 41 Birch Lane',
    body: `Hi Rebecca,

The inspection report for Birch Lane is complete. Overall the house is in good shape for its age. The main items are the water heater (nine years old and showing rust at the base), a small amount of moisture in the crawlspace, and the missing handrail on the back steps. The roof has about five years left. None of these are deal-breakers, but you may want to ask the sellers for a credit. Call me if you'd like to go through it.

Cliff`
  },
  {
    stop: 'access', place: 'body',
    ind: 'vineyard estate', en: 'AU',
    from: ['Glenn Pascoe', 'glenn@pascoe-estate.example'],
    to: [['Ross Tindall', 'ross.tindall@tindall-pumps.example']],
    subject: 'Pump service at the lower dam',
    body: `Hi Ross,

Thanks for confirming Tuesday for the pump service. I'll be at the cellar door all morning, so I can't meet you at the dam.

I've left the key to the pump shed on top of the door frame, left hand side as you face it.

Cheers,
Glenn`,
    sentence: 'I\'ve left the key to the pump shed on top of the door frame, left hand side as you face it.',
    why: 'SPEC §5.1 where a key is hidden: "I\'ve left the key to the pump shed on top of the door frame, left hand side as you face it." says where a premises key is hidden.'
  },
  {
    ind: 'plant hire', en: 'UK',
    from: ['Trevor Eccles', 'trevor@eccles-planthire.example'],
    to: [['Dean Fowler', 'dean.fowler@fowler-landscapes.example']],
    cc: [['Office', 'office@fowler-landscapes.example']],
    subject: 'Mini digger off-hire',
    body: `Dean,

I'll collect the 3-tonne digger on Friday after 2. Please have it clean, the bucket attached and the fuel topped up, or there's a refuelling charge. Hire to date is eight days, so £480 plus VAT. Sign the off-hire sheet with the driver.

Trevor`
  },
  {
    ind: 'scaffolding', en: 'UK',
    from: ['Lee Brannigan', 'lee@brannigan-scaffolding.example'],
    to: [['Carole Whitmore', 'carole.whitmore@mailbox.example']],
    subject: 'Scaffold coming down Thursday',
    body: `Hello Carole,

Your roofers have finished, so we'll be dismantling the scaffold on Thursday morning, probably from 8. We need clear access along the side path, so please move the bins and any plant pots. It should take most of the day, and nothing needs signing.

Lee`
  },
  {
    ind: 'glazing', en: 'AU',
    from: ['Hamish Doyle', 'hamish@doyle-glass.example'],
    to: [['Janet Ferrier', 'janet.ferrier@ozmail.example']],
    subject: 'New glass for the sliding door',
    body: `Hi Janet,

The glass for the sliding door is cut and ready. I'll fit it on Wednesday between 9 and 11. It's toughened safety glass, 6mm, same as the original. The total is $640 including GST, with the call-out. You can pay by card on the day.

Hamish`
  },
  {
    stop: 'personal', place: 'body',
    ind: 'retail hardware', en: 'US',
    from: ['Walt Brenner', 'walt@brenner-hardware.example'],
    to: [['Phil Okonkwo', 'phil@okonkwo-supply.example']],
    subject: 'Re: Delivery shortfall on order 8812',
    body: `Phil,

Sorry about the shortfall. The remaining 24 boxes of fasteners should arrive Monday.

We let Marcus go on Friday after the stock count didn't add up. The receiving dock is in a bit of a mess this week. Bear with us.

Walt`,
    sentence: 'We let Marcus go on Friday after the stock count didn\'t add up.',
    why: 'SPEC §5.4 personal details: "We let Marcus go on Friday after the stock count didn\'t add up." discloses a named employee\'s dismissal and its reason to a supplier.'
  },
  {
    ind: 'decorating', en: 'UK',
    from: ['Stan Pickering', 'stan@pickering-decorators.example'],
    to: [['Linda Ashworth', 'linda.ashworth@webmail.example']],
    subject: 'Painting the hallway',
    body: `Hi Linda, I'm starting the hall on Monday at 8. I'll need the furniture moved away from the walls, and I've got dust sheets. Two coats of the eggshell you chose on the woodwork, matt emulsion on the walls. Should be finished by Wednesday evening. Stan`
  },
  {
    ind: 'carpet fitting', en: 'UK',
    from: ['Mo Hussain', 'mo@hussain-flooring.example'],
    to: [['Pauline Greaves', 'pauline.greaves@homepost.test']],
    subject: 'Fitting date for the stairs and landing',
    body: `Dear Pauline,

We can fit the carpet on the stairs and landing on Tuesday the 8th. We'll need the stairs cleared and the old carpet is best removed beforehand if you can, or we'll do it for £35. The new carpet comes with a 10-year guarantee and a 2-year fitting warranty. The balance is payable on completion, by card or cheque.

Mo`
  },
  {
    ind: 'pool service', en: 'US',
    from: ['Eric Nussbaum', 'eric@bluewater-poolservice.example'],
    to: [['Linda Parrish', 'linda.parrish@inbox.test']],
    subject: 'Weekly service and the green water',
    body: `Hi Linda,

That green water was algae after the storm. I added shock and extra algaecide and cleaned the filter, and it should clear in about two days. Please keep the pump running 24 hours until I'm back on Thursday. If it still looks cloudy, we'll do a second treatment at no extra charge.

Eric

> The pool went green over the weekend. Is this something you can fix before our party on the 24th?`
  },
  {
    ind: 'chimney sweep', en: 'UK',
    from: ['Roy Garrett', 'roy@garrett-sweeps.example'],
    to: [['Dot Mercer', 'dot.mercer@mailbox.example']],
    subject: 'Sweeping Monday morning',
    body: `Hello Dot, I'll be with you on Monday morning between 9 and 10 to sweep the lounge and kitchen chimneys. £60 for both, with the certificate. A cup of tea wouldn't go amiss! Roy`
  },
  {
    ind: 'window cleaning', en: 'UK',
    from: ['Barry Nuttall', 'barry@clearpane-windows.example'],
    to: [['Mrs Janice Holroyd', 'janice.holroyd@webmail.example']],
    subject: 'Window cleaning, new price',
    body: `Dear Mrs Holroyd,

From next month the four-weekly clean will be £18, up from £16, because of rising fuel costs. It's the first increase in three years. If you would prefer to move to every eight weeks, the price is £20 and I can do that instead. Please let me know which you prefer.

Barry Nuttall`
  },
  {
    ind: 'garden centre', en: 'UK',
    from: ['Wendy Cartwright', 'wendy@bramblewood-gardencentre.example'],
    to: [['Ian Lowther', 'ian.lowther@inbox.test']],
    subject: 'Your order has arrived',
    body: `Hello Ian,

Your order of two cherry trees and the bare-root hedging (25 hornbeam) has arrived. We'll keep them watered in the nursery area until you collect. The hedging should go in the ground within a week or two, so please come as soon as you can. We're open until 5.

Wendy`
  },
  {
    stop: 'economics', place: 'body',
    ind: 'ironmongery', en: 'UK',
    from: ['Gary Whelan', 'gary@whelan-ironmongery.example'],
    to: [['Chris Aldridge', 'chris.aldridge@aldridge-joinery.example']],
    subject: 'Cabinet hinge pricing for the trade',
    body: `Chris,

Thanks for the cabinet hinge enquiry. We can supply the soft-close hinges in boxes of 100 from stock, and delivery to the workshop is free over £150.

We carry the hinges at £4.10 each and mark them up 40 percent for trade accounts, so the price to you is £5.74, which I'd rate as fair.

Gary`,
    sentence: 'We carry the hinges at £4.10 each and mark them up 40 percent for trade accounts, so the price to you is £5.74, which I\'d rate as fair.',
    why: 'SPEC §5.5 internal economics: "We carry the hinges at £4.10 each and mark them up 40 percent for trade accounts, so the price to you is £5.74, which I\'d rate as fair." gives the sender\'s own cost for an item and its markup.'
  },
  {
    ind: 'plant nursery', en: 'AU',
    from: ['Bev Hargreaves', 'bev@tallgum-nursery.example'],
    to: [['Craig Maynard', 'craig.maynard@maynard-landcare.example']],
    subject: 'Tubestock for the planting day',
    body: `Hi Craig,

We have 600 tubestock available for the planting day: 250 river red gum, 200 wattle and 150 kangaroo grass, all grown from local seed. They'll be hardened off and ready for pick-up on Friday after 1. The price is $2.20 each, and we can provide the guards and stakes for an extra 90 cents a plant. We'll bring a trailer if you can't collect.

Bev`
  },
  {
    ind: 'pet boarding', en: 'US',
    from: ['Jolene Mears', 'jolene@happytails-boarding.example'],
    to: [['Sam Pfeiffer', 'sam.pfeiffer@maplemail.example']],
    subject: 'Boarding for Rex, Dec 20 to 27',
    body: `Hi Sam,

We've got a kennel for Rex from December 20 to 27. The rate is $48 per night, plus $6 a day if you want an extra play session. Please bring his own food, bedding and any medication in a labelled bag. He'll need up-to-date vaccinations including kennel cough. Drop-off is between 8 and 10 AM.

Jolene`
  },
  {
    ind: 'saddlery', en: 'UK',
    from: ['Julia Marchant', 'julia@marchant-saddlery.example'],
    to: [['Emily Dawson', 'emily.dawson@homepost.test']],
    subject: 'Saddle fitting appointment',
    body: `Hello Emily,

I can come and fit the saddle at your yard on Friday at 11. Please have the horse clean and dry, with a rug on if the weather is bad, and have a flat area where I can watch him walk and trot. The fitting costs £75, and if any adjustment is needed it's £20 on top.

Julia`
  },
  {
    ind: 'riding school', en: 'AU',
    from: ['Sharon Webb', 'sharon@wirrabara-riding.example'],
    to: [['Kristy Doyle', 'kristy.doyle@ozmail.example']],
    subject: 'Pony Club rally details',
    body: `Hi Kristy,

The Pony Club rally is on Sunday at 9am at the school grounds. Riders need to bring a helmet that meets the current standard, boots with a heel, and a hay net for the float if you're staying for lunch. We'll have three groups, and Ella is in the intermediate group with Jo. Gold coin donation for the BBQ.

Sharon`
  },
  {
    ind: 'cattery', en: 'UK',
    from: ['Lorna Dix', 'lorna@whiskersretreat-cattery.example'],
    to: [['Nick Barlow', 'nick.barlow@mailbox.example']],
    subject: 'Booking for Mitzi',
    body: `Hi Nick, we have Mitzi down from 3 to 17 August. A deposit of £40 holds the booking. Make sure her cat flu vaccination is up to date and bring the certificate. Lorna`
  },
  {
    ind: 'wedding planner', en: 'US',
    from: ['Gabrielle Foy', 'gabrielle@foy-and-co-weddings.example'],
    to: [['Tina Marshall', 'tina.marshall@maplemail.example']],
    subject: 'Walk-through at the venue',
    body: `Hi Tina,

I've set up a walk-through at the venue next Tuesday at 11. We'll go through the ceremony site, the reception hall and the bridal suite, and mark where the florist and DJ will set up. Please bring your seating chart draft and the vendor contact sheet. The venue manager will join us for the final 15 minutes.

Gabrielle`
  },
  {
    ind: 'marquee hire', en: 'UK',
    from: ['Josh Tilley', 'josh@tilley-marquees.example'],
    to: [['Helen Cardwell', 'helen.cardwell@webmail.example']],
    subject: 'Marquee for 24 August',
    body: `Dear Helen,

We'll put up a 6 x 12 metre marquee on the lawn the day before your party, at about 2pm. The price includes flooring, side walls, lighting and ten round tables with chairs. We'll take it down on the Monday morning. Please check the ground for any sprinkler heads or pipes before we arrive.

Josh`
  },
  {
    ind: 'party entertainer', en: 'UK',
    from: ['Dave Pennington', 'dave@dazzlethedave-entertainment.example'],
    to: [['Natalie Fenn', 'natalie.fenn@inbox.test']],
    subject: 'Magic show on Saturday',
    body: `Hi Natalie, I'll be there at 1.45 to set up for the 2.30 show. It lasts 45 minutes, then balloon modelling. I need a power socket and a small table. Dave`
  },
  {
    stop: 'negotiation', place: 'body',
    ind: 'IT consultancy', en: 'UK',
    from: ['Raheel Aslam', 'raheel@aslam-it.example'],
    to: [['Beth Kingsley', 'beth.kingsley@kingsley-partners.example']],
    subject: 'Re: Proposal for Halden Group',
    body: `Hi Beth,

I'll send the final proposal for Halden tomorrow, with the three-phase timeline we discussed.

I think they'll counter at £9,500, and I'd concede the training days but not the licence fee.

Raheel`,
    sentence: 'I think they\'ll counter at £9,500, and I\'d concede the training days but not the licence fee.',
    why: 'SPEC §5.6 negotiation position: "I think they\'ll counter at £9,500, and I\'d concede the training days but not the licence fee." states the expected counter and what the sender would concede.'
  },
  {
    ind: 'soft play centre', en: 'UK',
    from: ['Sian Pritchard', 'party@jungleclimb-softplay.example'],
    to: [['Emma Dalton', 'emma.dalton@webmail.example']],
    subject: 'Party on the 9th',
    body: `Hi Emma,

Your party is booked for the 9th, 2 to 4pm, with the party room from 3. The pizza and juice package for 15 children is £187. Please let me have a final number by Wednesday and any allergies, so we can tell the kitchen. Adults are free, and socks are compulsory for everyone in the play area.

Sian`
  },
  {
    ind: 'fish and chip shop', en: 'UK',
    from: ['Arthur Beckett', 'arthur@beckets-chippy.example'],
    to: [['Julie Mansfield', 'julie.mansfield@homepost.test']],
    subject: 'Order for the club night',
    body: `Hi Julie,

That's 30 fish suppers, 10 sausage and chips, 10 portions of mushy peas and 8 curry sauces, ready for 7.30 on Friday. Total £267.50 and you can pay on collection. I'll box them up so they stay hot in the car. Bring a few bags.

Arthur`
  },
  {
    ind: 'pizzeria', en: 'US',
    from: ['Vince Caruso', 'vince@caruso-pizza.example'],
    to: [['Danielle Ortiz', 'danielle.ortiz@acmedental.example']],
    subject: 'Lunch order for the office',
    body: `Hi Danielle,

Got your order for Friday: 6 large pizzas (3 pepperoni, 2 veggie, 1 gluten-free margherita), a big Caesar salad and 2 trays of garlic knots. $162 with tax and delivery. We'll bring it at 11:45.

Vince`
  },
  {
    ind: 'sushi bar', en: 'AU',
    from: ['Kenji Aoki', 'kenji@aoki-sushi.example'],
    to: [['Michelle Parry', 'michelle.parry@ozmail.example']],
    subject: 'Platters for Saturday',
    body: `Hi Michelle, your two large platters (about 60 pieces each) will be ready at 12 on Saturday. $140 each. Come to the back counter and just ask for Kenji. Wasabi and soy are included. Thanks, Kenji`
  },
  {
    ind: 'coffee van', en: 'NZ',
    from: ['Ash Ngata', 'ash@brewonwheels-coffee.example'],
    to: [['Lisa Marsden', 'lisa.marsden@kiwimail.example']],
    subject: 'Coffee van for the school gala',
    body: `Hi Lisa,

I'd love to be at the gala. I'll set up at 8 and serve until 2 or until we run out. I'll bring the gazebo and a card machine, and there's nothing to pay upfront. We usually donate 10 percent of the day's takings to the school.

Ash`
  },
  {
    ind: 'food truck', en: 'US',
    from: ['Raul Mendoza', 'raul@tacocamino.example'],
    to: [['Beth Hartman', 'beth.hartman@maplemail.example']],
    subject: 'Taco truck for the company picnic',
    body: `Hi Beth,

We'd be happy to serve at the picnic on the 18th. The package for 120 guests is $14 a head with three taco choices, rice, beans and chips. We need a flat area about 20 by 12 feet, access for the truck and a nearby outlet. We'll arrive an hour before service.

Raul`
  },
  {
    stop: 'remark', place: 'quoted',
    ind: 'taproom', en: 'US',
    from: ['Corey Banks', 'corey@ironwood-taproom.example'],
    to: [['Meredith Lang', 'meredith.lang@lang-distributing.example']],
    subject: 'Re: Keg delivery schedule',
    body: `Meredith,

Tuesday and Friday deliveries work for us. We'll have the cooler cleared by 9.

Corey

On Mon, Sep 28, Dale Orr wrote:
> Don't bother ringing Brenda at that company, she's a thick, lazy cow and she'll lose the paperwork.`,
    sentence: 'Don\'t bother ringing Brenda at that company, she\'s a thick, lazy cow and she\'ll lose the paperwork.',
    why: 'SPEC §5.7 remarks: "Don\'t bother ringing Brenda at that company, she\'s a thick, lazy cow and she\'ll lose the paperwork." (quoted history) is an insulting remark about a named person.'
  },
  {
    ind: 'community radio', en: 'UK',
    from: ['Phil Gaunt', 'phil@valleyfm-community.example'],
    to: [['Susan Oldroyd', 'susan.oldroyd@mailbox.example']],
    subject: 'Interview slot Thursday',
    body: `Hi Susan,

We'd like you on the breakfast show on Thursday at 8.20 to talk about the new community garden. The interview lasts about six minutes. You can come to the studio on Mill Street, or do it down the phone line if that's easier. Park round the back and ring the bell.

Phil`
  },
  {
    ind: 'community newspaper', en: 'AU',
    from: ['Joanne Lyle', 'editor@lakesentrance-gazette.example'],
    to: [['Barry Cutler', 'barry.cutler@cutler-hardware.example']],
    subject: 'Advertising rates for the Christmas issue',
    body: `Hi Barry,

For the Christmas issue, a quarter-page colour ad is $220 and a half page is $380. Copy deadline is the 28th, and we deliver to 6,000 letterboxes across the district on the 9th. We can design the ad for you at no cost if you send the logo and text. Let me know which size you'd like.

Joanne`
  },
  {
    ind: 'village shop and post office', en: 'UK',
    from: ['Hazel Thorne', 'hazel@stoneleigh-village-shop.example'],
    to: [['Reverend Mark Elton', 'mark.elton@webmail.example']],
    subject: 'Papers for the vicarage',
    body: `Dear Mark,

I'm very sorry the papers were late this week. The van broke down on Tuesday. They should be on time from tomorrow. I've added a credit of £4 to your account for the trouble. The Christmas card boxes for the church have arrived, if you'd like to take a look.

Hazel`
  }
];
