// Batch 10 (final): ordinary emails and the last five stops (one per family). Literal text only.
export default [
  {
    ind: 'government training contractor', en: 'UK',
    from: ['Alison Pyle', 'alison.pyle@pyle-training-partnership.example'],
    to: [['Jonathan Reece', 'jonathan.reece@yorkshire-skills-agency.example']],
    cc: [['Skills Contracts Team', 'contracts@yorkshire-skills-agency.example']],
    subject: 'Monthly delivery report, programme B',
    body: `Dear Jonathan,

Our monthly report for Programme B is below.

Starts this month: 42 against a target of 40
Completions: 31, with 6 still within the allowed window
Job outcomes: 19 so far, 4 pending employer confirmation
Employer engagement: 11 new vacancies, 3 work trials arranged

We've had two sessions cancelled because of the rail strike, and both have been rescheduled. The next quality visit is in the week of the 16th. Please let me know if you want the figures in a different layout for the board paper.

Kind regards,
Alison Pyle
Programme Manager`
  },
  {
    ind: 'water utility contractor', en: 'AU',
    from: ['Brett Mackenzie', 'brett@mackenzie-pipeline.example'],
    to: [['Residents on Banksia Street', 'banksia.liaison@gladstone-water.example']],
    subject: 'Water shutdown on Tuesday 9am to 2pm',
    body: `Hello,

We'll be isolating the main on Banksia Street on Tuesday between 9am and 2pm to connect the new pipe. Properties from number 10 to 48 will have no water during this period. Tankers will be at the corner of Banksia and Elm. Please store drinking water beforehand, and run your taps for a minute after supply returns, as the water may be cloudy.

Brett Mackenzie
Site Supervisor`
  },
  {
    stop: 'access', place: 'body',
    ind: 'furniture workshop', en: 'UK',
    from: ['Colin Ibbotson', 'colin@ibbotson-furniture.example'],
    to: [['Tina Marsh', 'tina.marsh@marsh-interiors.example']],
    subject: 'Collecting the oak table on Saturday',
    body: `Hi Tina,

Saturday is fine for collecting the oak table. I'll be at a show in Harrogate until the afternoon, so the workshop will be empty when you come.

The garage door opens if you punch 6-1-9-3 on the keypad outside, then wait for the beep. The table is wrapped on the left bench.

Colin`,
    sentence: 'The garage door opens if you punch 6-1-9-3 on the keypad outside, then wait for the beep.',
    why: 'SPEC §5.1 premises codes: "The garage door opens if you punch 6-1-9-3 on the keypad outside, then wait for the beep." gives a working garage keypad code.'
  },
  {
    ind: 'conservation charity', en: 'UK',
    from: ['Hilary Wetherell', 'hilary@fenland-wildlife-trust.example'],
    to: [['Stephen Garner', 'stephen.garner@mailbox.example']],
    subject: 'Reedbed work party, Sunday',
    body: `Hi Stephen,

Our next work party is Sunday at the reedbed, 9.30 to 3. We're cutting back willow and clearing the ditch. Bring wellies, waterproofs, gloves and a packed lunch; we'll provide tools and tea. Meet at the car park by the bridge. Children are welcome if they're supervised.

Hilary`
  },
  {
    ind: 'animal rescue', en: 'UK',
    from: ['Joanne Stokes', 'joanne@seconddog-rescue.example'],
    to: [['Rachel and Sam Perkins', 'perkins.family@webmail.example']],
    subject: 'Home visit for Bella',
    body: `Hi Rachel and Sam,

Thank you for applying to adopt Bella. Our volunteer will visit on Thursday at 6pm to meet you and see the house and garden. It's an informal chat, nothing to worry about. If everything goes well, you can come to meet Bella at the weekend. The adoption fee is £180, which includes vaccinations and microchipping.

Joanne`
  },
  {
    ind: 'wildlife rehabilitation', en: 'AU',
    from: ['Sophie Ireland', 'sophie@bushwings-wildlifecare.example'],
    to: [['Mark Delahunty', 'mark.delahunty@ozmail.example']],
    subject: 'Re: Injured magpie',
    body: `Hi Mark,

Thanks for ringing about the magpie. Keep it in a covered box in a quiet, warm room and don't give it food or water. I can pick it up this evening after 6. If you can get it to the Eastgate vet clinic earlier, they'll take it in at no charge. We'll let you know how it goes.

Sophie

> There's an injured magpie in my backyard that can't fly. What should I do?`
  },
  {
    ind: 'dog rescue', en: 'US',
    from: ['Patty Lindqvist', 'patty@secondchance-dogs.example'],
    to: [['Mike Hargrove', 'mike.hargrove@maplemail.example']],
    subject: 'Foster home check-in',
    body: `Hi Mike,

Just checking in on Duke. How is he settling in? Our vet appointment for his shots is Wednesday at 3:30. Let me know if you can take him or if I should come by to pick him up. If he's been chewing or having accidents, don't worry, that's normal for the first couple of weeks.

Patty`
  },
  {
    ind: 'music shop', en: 'UK',
    from: ['Gaz Holloway', 'gaz@riffcity-music.example'],
    to: [['Danny Peake', 'danny.peake@inbox.test']],
    subject: 'Your amp is fixed',
    body: `Danny, the amp's fixed, it was a dodgy valve. £45. Collect whenever. Gaz`
  },
  {
    ind: 'guitar teacher', en: 'AU',
    from: ['Luke Fenwick', 'luke@fenwick-guitar.example'],
    to: [['Cheryl Palmer', 'cheryl.palmer@ozmail.example']],
    subject: 'Ethan\'s lessons',
    body: `Hi Cheryl,

Ethan is doing well with his chords. For next week he should practise G, C and D, and the first part of the song we started. Could we move his lesson to 4.30 on Thursday? Otherwise I'm happy to keep it at 4.

Luke`
  },
  {
    stop: 'personal', place: 'quoted',
    ind: 'newsagent and general store', en: 'UK',
    from: ['Anita Sharma', 'anita@sharma-newsagents.example'],
    to: [['Ian Dewsbury', 'ian.dewsbury@dewsbury-wholesale.example']],
    subject: 'Re: Sunday papers delivery',
    body: `Hi Ian,

Thanks for confirming. We'll have somebody at the shop from 5 on Sunday to receive the papers.

Anita

On Mon, 12 Oct 2026, Rav Sharma wrote:
> Just so you know, Ryan was cautioned by the police for shoplifting last month, so keep an eye on him in the shop.`,
    sentence: 'Just so you know, Ryan was cautioned by the police for shoplifting last month, so keep an eye on him in the shop.',
    why: 'SPEC §5.4 personal details: "Just so you know, Ryan was cautioned by the police for shoplifting last month, so keep an eye on him in the shop." (quoted history) states a named person\'s police caution.'
  },
  {
    ind: 'wedding band', en: 'UK',
    from: ['Matt Ainsworth', 'matt@ainsworth-live.example'],
    to: [['Sarah Whitcombe', 'sarah.whitcombe@webmail.example']],
    subject: 'Set times for the 14th',
    body: `Hi Sarah,

For the 14th, we'd suggest two 45-minute sets, starting at 8.30 and 10, with a DJ playlist in between. We'll arrive at 6 for a sound check, and we need two plug sockets near the stage. The four of us will need food, if you can manage it. Could you send me the first dance song by next week?

Matt`
  },
  {
    ind: 'festival organiser', en: 'UK',
    from: ['Zoe Kendrick', 'zoe@greenfields-music-festival.example'],
    to: [['Pete Nuttall', 'pete.nuttall@nuttall-sanitation.example']],
    subject: 'Site delivery schedule and requirements',
    body: `Hi Pete,

Here's the full delivery plan for the toilets, so you can book the drivers.

Wednesday 10th
- 08:00 to 10:00: 20 standard units to the main camping field (Gate C)
- 10:30 to 12:00: 6 accessible units to the arena and the family camping area
- 14:00: 4 urinal blocks to the main stage and the second stage

Thursday 11th
- 08:00: 12 more units to the car park camping area
- 11:00: two hand-wash stations for the food court
- Afternoon: tanker walk-through with our site manager

Please use Gate C only. The access track is single width, so we'd like your vehicles to follow our marshal in convoy. No deliveries are possible after 18:00 as the gate is closed to HGVs. Drivers will need to sign in and get a wristband from the site office at the entrance.

During the festival (Friday to Sunday) we'd like servicing twice a day: first round 06:00 to 09:00, second 15:00 to 17:00, and a deep clean of the accessible units at midday. Please make sure your operatives wear hi-vis and carry their ID.

Collection will begin Monday 15th at 8am, as soon as the campsites have cleared. Let me know if any of this causes problems, and send a copy of the revised contract with the confirmed numbers.

Many thanks,
Zoe Kendrick
Site and Operations Manager, Greenfields`
  },
  {
    ind: 'market gardener', en: 'UK',
    from: ['Bryony Hartley', 'bryony@hartley-veg-box.example'],
    to: [['Alan Seddon', 'alan.seddon@mailbox.example']],
    subject: 'Veg box this week',
    body: `Hi Alan, this week's box: potatoes, carrots, leeks, kale, beetroot, a cabbage, and the last of the apples. Delivery between 4 and 6 on Thursday as usual. Bryony`
  },
  {
    ind: 'greenhouse grower', en: 'CA',
    from: ['Henry Vanderhoek', 'henry@vanderhoek-greenhouses.example'],
    to: [['Maria Santos', 'maria.santos@santos-grocers.example']],
    subject: 'Tomato supply for next week',
    body: `Hi Maria,

We can supply 60 flats of the vine tomatoes and 30 of the cherry tomatoes for next week, with delivery Tuesday and Friday. The cherries are particularly sweet at the moment. Prices stay the same as last month. Let me know by Monday if you want to change the quantities.

Henry`
  },
  {
    ind: 'livestock auction', en: 'US',
    from: ['Wade Pruitt', 'wade@pruitt-livestock-auction.example'],
    to: [['Randy Hollis', 'randy.hollis@hollisranch.example']],
    subject: 'Receiving hours for Thursday\'s sale',
    body: `Randy, we'll be receiving cattle from 6 AM to 10 PM Wednesday and from 5 to 8 AM Thursday. Sale starts at 10 AM sharp. Please have your brand inspection papers with you. Wade`
  },
  {
    ind: 'feed mill', en: 'US',
    from: ['Gene Lindahl', 'gene@lindahl-feedmill.example'],
    to: [['Sherri Dunn', 'sherri.dunn@dunnfarms.example']],
    subject: 'Feed delivery schedule',
    body: `Hi Sherri,

Your bulk feed delivery is set for Friday morning, around 8. We'll bring 12 tons of the 16 percent dairy ration. Please make sure the bin is clear and the lid is open. The truck can't get to the second bin because of the soft ground, so can you use the first one this time? Call if the weather changes.

Gene`
  },
  {
    stop: 'economics', place: 'body',
    ind: 'IT managed services', en: 'UK',
    from: ['Raj Chauhan', 'raj@chauhan-managed-it.example'],
    to: [['Kate Pemberton', 'kate.pemberton@pemberton-surveyors.example']],
    subject: 'Re: Support contract renewal',
    body: `Hi Kate,

Thanks for the call. The renewal paperwork for the support contract will be with you on Friday, with the service levels as we discussed.

We make roughly 18 percent on the maintenance contract and nothing at all on the hardware, so I'd rather keep the maintenance side as it is.

Raj`,
    sentence: 'We make roughly 18 percent on the maintenance contract and nothing at all on the hardware, so I\'d rather keep the maintenance side as it is.',
    why: 'SPEC §5.5 internal economics: "We make roughly 18 percent on the maintenance contract and nothing at all on the hardware, so I\'d rather keep the maintenance side as it is." discloses the sender\'s own margin by contract line to a customer.'
  },
  {
    ind: 'payroll bureau', en: 'UK',
    from: ['Linda Hepworth', 'linda@hepworth-payroll.example'],
    to: [['Craig Lumb', 'craig.lumb@lumb-fabrications.example']],
    subject: 'Payroll deadline for December',
    body: `Hi Craig,

Because of Christmas, your December payroll deadline is Thursday 17th, a few days earlier than usual. Please send the hours, starters and leavers by midday. Staff will be paid on the 22nd, so they have their money before the holiday. Let me know if there are any changes to your bank holiday pay arrangements.

Linda`
  },
  {
    ind: 'IT reseller', en: 'NZ',
    from: ['Ben Walters', 'ben@walters-itsolutions.example'],
    to: [['Aroha Ngata', 'aroha.ngata@ngata-consulting.example']],
    subject: 'Laptops arriving Thursday',
    body: `Hi Aroha,

The five laptops you ordered are in the warehouse and will be couriered on Wednesday for delivery on Thursday. I've set them up with the software image and your email accounts, so they're ready to go. If you want me to come and help staff get started, I can be there on Friday morning.

Ben`
  },
  {
    ind: 'web hosting', en: 'US',
    from: ['Ethan Shaw', 'ethan@shaw-hosting.example'],
    to: [['Lori Mendez', 'lori.mendez@mendezflowers.example']],
    subject: 'Re: Your site was down overnight',
    body: `Hi Lori,

I'm sorry about the downtime. A server in the data center had a failed disk and we moved your site to a standby machine at around 6 AM. Everything is working normally now and I've checked that your orders came through. We've credited your account for this month.

Ethan

> Our website wasn't loading this morning. What happened?`
  },
  {
    ind: 'freelance app developer', en: 'IN',
    from: ['Vikram Rao', 'vikram@raodev.example'],
    to: [['Emily Carter', 'emily.carter@carterfitness.example']],
    subject: 'App update for review',
    body: `Dear Emily,

The new build is ready for your review. It includes the class booking screen, push reminders and the fixes you mentioned for the login. Kindly test on both your phone and tablet and send me your comments by Thursday. Once you approve, we can submit it to the app stores, which usually takes two to three days.

Regards,
Vikram`
  },
  {
    stop: 'negotiation', place: 'subject',
    ind: 'second-hand machinery dealer', en: 'UK',
    from: ['Barry Whitehead', 'barry@whitehead-machinery.example'],
    to: [['Colin Rudge', 'colin.rudge@rudge-agricultural.example']],
    subject: 'We would accept 20 percent below the asking price if they came back with cash',
    body: `Colin,

I've had a look at the baler you were asking about and it's in decent order. The service history is complete and the tyres are about half worn. I can bring it round to show you any day this week.

Barry`,
    sentence: 'We would accept 20 percent below the asking price if they came back with cash',
    why: 'SPEC §5.6 negotiation position: "We would accept 20 percent below the asking price if they came back with cash" states what the sender would accept, in the subject line.'
  },
  {
    ind: 'graphic designer', en: 'AU',
    from: ['Mia Castellano', 'mia@castellano-design.example'],
    to: [['Tom Banerjee', 'tom.banerjee@banerjee-bakery.example']],
    subject: 'Logo options',
    body: `Hi Tom,

Here are the three logo directions in the link below. Option A is the most traditional, B is more playful, and C is a simple wordmark. Have a look on your phone as well, since that's where most people will see it. Let me know which you prefer by Friday and I'll refine it.

https://castellano-design.example/review/banerjee

Mia`
  },
  {
    ind: 'video production', en: 'UK',
    from: ['Dan Whitfield', 'dan@whitfield-films.example'],
    to: [['Priya Venkat', 'priya.venkat@venkat-training.example']],
    subject: 'Shoot day call sheet',
    body: `Hi Priya,

Call sheet for Tuesday: crew arrive 8.30, first interview at 9.30, lunch 12.30, second interview 1.30, wrap by 5. We'll need a quiet room with natural light and parking for two vehicles. Please make sure the interviewees know to avoid thin stripes and bright white. Phone me on 07700 900431 if anything changes.

Dan`
  },
  {
    ind: 'podcast producer', en: 'US',
    from: ['Holly Brandt', 'holly@brandt-audio.example'],
    to: [['Jim Delaney', 'jim.delaney@delaneyhomes.example']],
    subject: 'Episode 6 edit',
    body: `Hi Jim, episode 6 is edited and ready for your listen. Runtime is 34 minutes. I cut the long pause at the 12-minute mark and brought the music down under the intro. Send notes by Friday and I'll publish Monday. Holly`
  },
  {
    stop: 'remark', place: 'quoted',
    ind: 'live sound engineering', en: 'UK',
    from: ['Phil Stansfield', 'phil@stansfield-sound.example'],
    to: [['Maria Kenworthy', 'maria.kenworthy@kenworthy-events.example']],
    subject: 'Re: PA for the village fete',
    body: `Hi Maria,

We can do the PA for the fete on Saturday, with a small mixer and two speakers on stands. Setup is at 11 and the first act is at 1. The price is £220 including the operator and the van.

Phil

On Thu, 8 Oct 2026, Dave Ridley wrote:
> Their so-called expert is a fraud who has never fixed anything properly in his life.`,
    sentence: 'Their so-called expert is a fraud who has never fixed anything properly in his life.',
    why: 'SPEC §5.7 remarks: "Their so-called expert is a fraud who has never fixed anything properly in his life." (quoted history) is a disparaging remark about a person.'
  },
  {
    ind: 'sound engineer', en: 'UK',
    from: ['Simon Trueman', 'simon@trueman-studios.example'],
    to: [['Beth Hallam', 'beth.hallam@mailbox.example']],
    subject: 'Mix is ready',
    body: `Hi Beth, the mix is done. Have a listen on headphones and in the car. I've put it in the shared folder. Any changes, let me know. Simon`
  }
];
