// Batch 9: the last three literals.
export default [
{ k: 'ev', ind: 'mobile coffee', v: 'au', set: 'coffee van at the Saturday market', messy: [],
  why: `SPEC §5 intro: a market stall booking is ordinary business email.`,
  from: `Kylie Brennan <kylie@roastingroadcoffee.example>`, to: [`Hugh Matheson <hugh.matheson@bluegumevents.test>`],
  subj: `Saturday market`,
  body: `Hi Hugh,

We're booked for the Saturday market from 7 to 1. I'll set up at the east entrance by 6:30 like last time and power's sorted with the generator, so nothing needed from your end. Can you let the council know we'll have a gas bottle on the van?

Cheers,
Kylie` },

{ k: 'bd', ind: 'solar installation', v: 'in', set: 'fixed price for an installation quoted in rupees', bnd: 'a customer-facing price and payment terms stated as facts',
  why: `SPEC §5.5 Does not flag: customer-facing prices, quotes, contract values, invoice amounts and payment terms stated as facts.`,
  from: `Meera Joshi <meera.joshi@sahyadrisolar.example>`, to: [`Suresh Nair <suresh.nair@keralahomesmail.test>`],
  subj: `Quotation for rooftop solar`,
  body: `Dear Mr Nair,

Thank you for your enquiry. The fixed price for the 5 kW rooftop installation is Rs 48,000 including GST, with payment of 50 percent as advance and the balance after commissioning. Installation will take two days.

Kindly let us know a convenient date for the site visit.

Regards,
Meera Joshi` },

{ k: 'ev', ind: 'community sport', v: 'ca', set: 'rink time for a hockey league', messy: [],
  why: `SPEC §5 intro: ice time for a recreational league is ordinary business email.`,
  from: `Brent Kowalchuk <brent@northstarrinks.example>`, to: [`Marie Tremblay <marie.tremblay@lacbleuhockey.test>`],
  subj: `Sunday ice time`,
  body: `Hi Marie,

The rink is booked Sundays 8 to 10 for the league, starting Oct 18. The Zamboni goes on at 9:45 so everybody needs to be off the ice by then. Parking is in lot B, and the dressing rooms open at 7:15.

Brent` },
];
