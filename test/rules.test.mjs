import test from 'node:test';
import assert from 'node:assert/strict';
import { screenText } from '../core/rules.mjs';

// [category, highlighted words] for each finding in a text.
const found = (text) => screenText(text).map((f) => [f.category, f.marks.map((m) => f.sentence.text.slice(m.start, m.end)).join(' | ')]);

test('the spec demo triggers, each with the words the pane highlights', () => {
  assert.deepEqual(found("Kate — North Hall's tracking triple the margin we bid."), [['economics', 'triple the margin we bid']]);
  assert.deepEqual(found("If Dan pushes on CO 12, we've got room."), [['negotiation', "If Dan pushes on CO 12, we've got room"]]);
  assert.deepEqual(found('Marcus is out next week for his back surgery.'), [['personal', 'his back surgery']]);
  assert.deepEqual(found("Gate code's still 4417."), [['access', "Gate code's still 4417"]]);
  assert.deepEqual(found("Their PM is a moron who's never read a drawing."), [['remark', "a moron who's never read a drawing"]]);
});

test('the demo body gives two findings in reading order, pointing at their sentences', () => {
  const body = "Kate — North Hall's tracking triple the margin we bid. If Dan pushes on CO 12, we've got room.";
  const f = screenText(body);
  assert.deepEqual(f.map((x) => [x.category, x.subkind, x.sentence.index, x.sentence.occurrence]), [['economics', 'margin', 0, 0], ['negotiation', 'position', 1, 0]]);
  assert.equal(body.slice(f[0].sentence.start, f[0].sentence.end), "Kate — North Hall's tracking triple the margin we bid.");
  assert.equal(body.slice(f[1].sentence.start, f[1].sentence.end), "If Dan pushes on CO 12, we've got room.");
});

test('the clean demo body has no findings', () => {
  assert.deepEqual(found("Kate — let's walk CO 12 together before Dan's call on Friday."), []);
});

test('internal economics: margin, costs, profit, contingency, budget and floor', () => {
  const cases = {
    'Our margin on this project is 18 percent.': 'margin', 'Our margin is thin on this one.': 'margin', 'We priced it at a 22% margin.': 'margin',
    'Our delivery cost is $8,000.': 'cost', 'The steel cost us $41k more than planned.': 'cost', 'We paid the sub $12,500 for the slab.': 'cost',
    "We'll clear $40k on this.": 'profit', 'This job is very profitable.': 'profit', 'We still have $30k of contingency left.': 'contingency',
    'We burned through half of our contingency.': 'contingency', 'We carried $60k for steel.': 'budget', 'Our budget for the fit-out is $250k.': 'budget',
    'Our floor is $110k.': 'floor', "Our walk-away price is $95,000.": 'floor', "We won't go below $90k.": 'floor',
  };
  for (const [text, subkind] of Object.entries(cases)) {
    const f = screenText(text);
    assert.equal(f.length, 1, text);
    assert.deepEqual([f[0].category, f[0].subkind], ['economics', subkind], text);
  }
});

test('negotiation position: room to move, acceptance, counters and strategy', () => {
  for (const text of ['We can go as low as $9,000.', "We'd accept $90k if they push.", "They'll counter at $85k.", 'Dan will counter with the original number.',
    "There's some room to move on the price.", 'We have wiggle room on the rate.', 'If the owner asks for a discount, we can come down a little.',
    "Our bid strategy is to come in under Apex.", 'The lowest we would accept is $70k.']) {
    assert.deepEqual(found(text).map((x) => x[0]), ['negotiation'], text);
  }
});

test('personal detail, access and security, and remarks', () => {
  const cases = [
    ["She's been diagnosed with diabetes.", 'personal'], ['Mike was let go last week.', 'personal'], ["Priya's husband is in hospital.", 'personal'],
    ['His SSN is 123-45-6789.', 'identity'], ['Tom has a court date on the 14th.', 'personal'],
    ['The alarm is off until Monday.', 'access'], ['The cameras on the east side are down.', 'access'], ['The back gate is unlocked at night.', 'access'],
    ['The password is Summer2026!', 'access'], ['The password is Harbor-2026.', 'access'], ['The code for the lockbox is 2231.', 'access'], ['The spare key is under the mat.', 'access'],
    ['Those clowns at Whitfield lost the drawings.', 'remark'], ['Whitfield is a nightmare to work with.', 'remark'], ["He's useless.", 'remark'],
    ['Please note the side gate is unlocked all weekend.', 'access'], ['Dave is a nightmare.', 'remark'],
  ];
  for (const [text, category] of cases) assert.deepEqual(found(text).map((x) => x[0]), category ? [category] : [], text);
  const code = screenText("Gate code's still 4417.")[0];
  assert.equal(code.codeKind, 'gate');
});

test('ordinary business email stays clear', () => {
  for (const text of ['Please keep a 1 inch margin on the drawings.', 'The margin of error on the survey is 2 mm.', 'Your quoted price is $12,000.',
    'The invoice total is $4,200 and is due Friday.', 'We have a contingency plan for rain.', 'Our cost estimate for you is attached.', 'It costs $40 to park on site.',
    'We paid your invoice of $12,000 on Friday.', "We've got room in the schedule for the extra pour.", 'We have room for 20 people in the site office.',
    'If they push the pour to Friday, we can take the pump back.', 'It was charged to the Northline card.', 'The drawings are useless without the grid lines.',
    'The building code requires 2021 IBC.', 'The pin is 3/8 inch.', 'The gate is off Main Street.', "Today's injury report is attached.",
    'His diagnosis of the leak was right.', 'The password is the same as before.', 'The client will counter-sign the order.', 'We made 3 site visits this week.',
    'Our margin notes are in the PDF.', 'Half the crew is out Friday.', 'The cameras on the east side are new.', "He's a great foreman.",
    'After paying the crew, almost all of the fee remains with us.', 'The project will begin on Tuesday.', 'Contact person@outside.example for details.',
    'Can we walk the site on Thursday at 7?', 'Attached is the revised schedule for North Hall.', 'Thanks, John',
    // Retired gate tier everyday2, 24 Oct: things that are a nightmare, and a gate asked to be unlocked.
    'Weekdays are a nightmare at the moment.', 'Mondays are useless for deliveries.',
    'Could you make sure the lawn is mown and the side gate is unlocked for the van?', 'Please make sure the gate is unlocked by 8.']) {
    assert.deepEqual(found(text), [], text);
  }
});

test('findings in the subject and in an attachment carry their source', () => {
  const [f] = screenText('Our margin is 20% on the base bid.', { source: 'attachment', file: 'costs.txt' });
  assert.deepEqual([f.source, f.file], ['attachment', 'costs.txt']);
});

// The rules were written for construction email; the same findings in law, agencies, SaaS, accounting,
// healthcare admin and real estate, and the ordinary sentences of those trades that must stay clear.
test('the phrasing rules hold outside construction', () => {
  const cases = {
    economics: ['Our margin on the retainer is 35%.', 'Our blended rate costs us $95 an hour.', 'Our real cost on the audit is $18k.', 'We carried $40k for the e-discovery vendor.',
      'Our profit on this listing is thin.', 'We clear $12k on each referral.', 'Our floor on the fee is $8,000.', "We won't go below $150 an hour.", 'Our markup on media is 15%.', 'We net $6k on each implementation.'],
    negotiation: ["We'd accept $450k if the seller pushes.", "There's room to move on the commission.", 'If they ask for a discount, we can come down 10%.', 'The lowest we would accept is $3,500 a month.',
      "They'll counter at $410k.", 'We have flexibility on the retainer.', 'We could go as low as $120 an hour.', 'Our negotiation strategy is to anchor high on the licence fee.'],
    personal: ['Her chemotherapy starts Monday.', 'He was arrested on Saturday.', 'Maria is on medical leave until May.', 'His divorce is final next week.', 'She was put on a performance improvement plan.',
      'The patient was diagnosed with diabetes.', "Tom's salary is $140k.", 'She was let go on Friday.', "Jordan's wife is in hospital."],
    remark: ['Opposing counsel is an idiot.', 'Their CFO is clueless.', 'Those clowns at the agency missed the deadline again.', 'The landlord is a crook.', 'Their account manager is useless.'],
  };
  for (const [category, list] of Object.entries(cases)) for (const text of list) assert.deepEqual(found(text).map((x) => x[0]), [category], text);
  for (const text of ['Our fee for the engagement is $25,000.', 'The listing price is $450,000.', 'Your invoice of $3,200 is due Friday.', 'The retainer is $5,000 a month.',
    'Our standard rate is $250 an hour.', 'The patient is scheduled for Tuesday.', 'The court date for the Henderson matter is the 14th.', 'Our contract with them ends in May.',
    'The surgery center is on Elm Street.', 'The case was settled last year.', 'We have room for 12 at the offsite.', 'Their proposal is weak on timelines.',
    'The draft is useless without the exhibits.', 'The seller countered at $410k and we accepted.', 'Our offer is $430k.', 'We offer a 10% discount for annual billing.',
    'The HR policy is attached.', 'The performance review template is attached.', 'Our markup on the drawings is attached.', 'The floor on level 2 is 4,000 sq ft.',
    'We have flexibility on the schedule.', 'The family law clinic called the front desk.']) {
    assert.deepEqual(found(text), [], text);
  }
});

test('amounts in pounds, euros and other currencies count like dollars', () => {
  const cats = (t) => found(t).map(([c]) => c);
  for (const t of ['Our cost on the fit-out is £11,240.', 'It costs us €8.500 a month to run.', 'We carried GBP 1,800 for this shoot.',
    'Our budget is A$ 40k.', 'We paid the crew 9,000 euros.', 'Our margin is 12,000 EUR on this one.', 'It cost us ¥250,000.',
    'Our floor is C$95,000.', "We'd accept £410k if they push."]) assert.ok(cats(t).length, t);
  assert.deepEqual(found('We clear £1,460 on this booking.').map(([c]) => c), ['economics']);
  // Customer-facing amounts stay permitted, whatever the currency.
  for (const t of ['The quote for the fit-out is £11,240 plus VAT.', 'Your invoice total is €8,500, due in 30 days.', 'The day rate is GBP 650.',
    'Tickets are A$45 each.', 'We carried 40 pounds of rebar up the stairs.']) assert.deepEqual(found(t), [], t);
});

// Findings of an independent audit (October 2026), each with the near misses around it.
test('a password or PIN that is given stops however weak it is; the statement decides, not the value', () => {
  for (const [text, mark] of [['Password: sunshine', 'Password: sunshine'], ['The password is admin.', 'password is admin'], ['PIN: 1111', 'PIN: 1111'], ['PIN: 0000', 'PIN: 0000'],
    ['Password: aB3', 'Password: aB3'], ['pw: Hunter2!', 'pw: Hunter2!'], ['The Wi-Fi password is sunshine.', 'password is sunshine'], ['Password: "letmein"', 'Password: "letmein"'],
    ['The password is sunshine and the username is bob.', 'password is sunshine'], ['Your PIN is 482913.', 'PIN is 482913'], ['Your password was reset to welcome.', 'password was reset to welcome']]) {
    assert.deepEqual(found(text), [['access', mark]], text);
  }
  // Masks, templates, links, pointers, states, policy talk and sign-offs are not a password.
  for (const text of ['Password: ********', 'Password: <password>', 'Password: <your password>', 'Password: ${DB_PASSWORD}', 'Password: %DB_PASS%', 'The password is your date of birth.',
    'The password is the same as before.', 'The password is in the vault.', 'Password: in the vault', 'Password: reset', 'Password: see the vault entry.', 'Password: same as before', 'Password: TBD',
    'The password is expired.', 'The password is temporary.', 'The password is changing next week.', 'Your password is ready.', 'The password is case-sensitive.', 'The password is set.',
    'The password must be 8-12 characters.', 'The password is 8-12 characters long.', 'Use this link to reset your password: https://portal.example.com/reset', 'PIN: ****', 'PIN: 123',
    'The PIN is 3/8 inch.', 'Password: Thanks, John', 'Password: abc', 'The password is strong.', 'Password - see below', 'The password is example-secret.']) {
    assert.deepEqual(found(text), [], text);
  }
});

test('personal rules need a person: a policy, a company case or a statute is ordinary correspondence', () => {
  for (const text of ['Our bereavement leave policy is attached.', 'Our company has a court case next week.', 'Please review the DUI statute, 23 USC 164.', 'Our firm handles custody disputes.',
    'The company had a court hearing on the patent.', 'Employees with a criminal record must disclose it.', 'The family emergency fund is open to all staff.', 'Compassionate leave is covered in section 4.',
    'The DUI checkpoint on Route 9 slowed the delivery.', 'The court issued a restraining order in the Henderson matter.']) {
    assert.deepEqual(found(text), [], text);
  }
  for (const text of ['He has a court case next week.', 'Tom has a court date on the 14th.', 'Dan has a family emergency.', 'There was a death in her family.', "Priya's bereavement leave starts Monday.",
    'He got a DUI last month.', "Tom's DUI is on his record.", 'She is on probation.', 'He was cited for DUI.', 'She has a restraining order against him.', 'Her custody hearing is Friday.']) {
    assert.deepEqual(found(text).map((x) => x[0]), ['personal'], text);
  }
});

test('an offer actually made is not a negotiation position; a limit, fallback or contingency is', () => {
  for (const text of ['We can accept $4,000 for this order.', 'We will take $4,000 for the job.', 'The price we quote you is $4,000.', 'We can accept $4,000 if you confirm by Friday.',
    "We'll take $500 off if you order today.", 'We will accept $4,000 by bank transfer.']) {
    assert.deepEqual(found(text), [], text);
  }
  for (const text of ["We'd accept $4,000 if they push.", 'We could go as low as $3,500.', "The least we'd take is $3,000.", "If they counter, we'll drop to $3,800.",
    'We can accept $3,500 if they insist.', 'We will take $3,000 at a push.', 'We would take $4,000 for the job.', "Worst case, we'll accept $3,200."]) {
    assert.deepEqual(found(text).map((x) => x[0]), ['negotiation'], text);
  }
});

// Findings of the final review (October 2026), each with the near misses around it.
test('a password value needs evidence it was supplied: a status, a description or a joined word is not one', () => {
  for (const [text, mark] of [['Password: sunshine', 'Password: sunshine'], ['The password is admin.', 'password is admin'], ['PIN: 1111', 'PIN: 1111'],
    ['pw: Hunter2!', 'pw: Hunter2!'], ['Password: zoo', 'Password: zoo'], ['Password: aB3', 'Password: aB3'], ['Password: Harbor-2026', 'Password: Harbor-2026'],
    ['Password: blue-sky', 'Password: blue-sky'], ['PIN\u00a0\u00a04471', '4471'], ['Password\u00a0\u00a0Tr4ctor!22', 'Tr4ctor!22']]) {
    assert.deepEqual(found(text), [['access', mark]], text);
  }
  // A participle, an adjective or adverb form, a hyphenated description, a short word after "is", an
  // example word inside the value.
  for (const text of ['Password: Requested.', 'The password is auto-generated.', 'Password: Auto-generated', 'Password: Emailed', 'Password: Withheld',
    'Password: Supplied separately', 'The password is one-time.', 'The password is configurable.', 'The password is zoo.', 'Password: N/A', 'Password: foo',
    'The password is example-secret.', 'Pin\u00a0\u00a03/8']) {
    assert.deepEqual(found(text), [], text);
  }
});

test('health and legal findings need a person: a thing, a group or a company is not one', () => {
  for (const text of ['The timber is being treated for rot.', 'The deck is being treated for termites.', 'Half the crew is out sick.', 'Our company is recovering from a slow quarter.',
    'Send Tom to the hospital.', 'Northline Ltd has a court case next week.', 'Northline Ltd was sued.', "Northline Ltd's lawyer called.", 'Acme Holdings was sued.',
    'Northline Group is being investigated for fraud.', 'Apex Builders LLC has a court date on the 14th.', 'Northline Ltd was let go from the project.']) {
    assert.deepEqual(found(text), [], text);
  }
  for (const text of ['Tom is in hospital.', 'Tom Reyes went to the hospital.', "She's been diagnosed with diabetes.", 'The patient was diagnosed with diabetes.',
    'His mother is recovering from a stroke.', "He's off sick today.", 'Maria is on medical leave until May.', 'Tom has a court date on the 14th.', 'Tom was sued.',
    'Dan Whitfield was let go.']) {
    assert.deepEqual(found(text).map(([c]) => c), ['personal'], text);
  }
});

test('table cells are read under their column headers: a number column holds that number, a card column a card', () => {
  const at = (text, file = null) => screenText(text, { source: file ? 'attachment' : 'body', file }).map((f) => [f.category, f.marks.map((m) => f.sentence.text.slice(m.start, m.end)).join(' | ')]);
  // An order, invoice or other number column is that number, in a CSV, a pasted tab table or a file.
  for (const [text, file] of [['order_id,payment_method,total\n4111111111111111,card,4200'], ['Order ID\tTotal\n4111111111111111\t4200'],
    ['Customer\tOrder ID\nMorgan\t4111111111111111'], ['Invoice No;Amount\n4111111111111111;4200'], ['order_id,total\n4111111111111111,4200', 'orders.csv'],
    ['Part No,Desc\n512-34-8890,bolt'], ['amount,card\n12.50,4111111111111111.50', 'pay.csv'], ['Name\tNotes\nMorgan\t9012345678901238'],
    ['Password\tRequested\nUsername\tdan.smith']]) {
    assert.deepEqual(at(text, file), [], text);
  }
  // A delimiter is not numeric punctuation, and a card header counts as card words.
  for (const [text, file, category, mark] of [['name,card_number\nMorgan,4111111111111111', null, 'financial', '4111111111111111'],
    ['name,card_number\nMorgan,4111111111111111', 'cards.csv', 'financial', '4111111111111111'], ['4111111111111111,4200', 'pay.csv', 'financial', '4111111111111111'],
    ['"Morgan, Lee",5555555555554444,"paid, thanks"', 'pay.csv', 'financial', '5555555555554444'], ['Name\tcc\nMorgan\t4111 1111 1111 1111', null, 'financial', '4111 1111 1111 1111'],
    ['Name\tCard\nMorgan\t9012345678901238', null, 'financial', '9012345678901238'], ['id,pan\n7,5555555555554444', 'x.csv', 'financial', '5555555555554444'],
    ['Name,SSN\nDan,512-34-8890', null, 'identity', '512-34-8890'], ['Name\tPassword\nDan\tsunshine', null, 'access', 'sunshine'],
    ['Routing\tAccount\n021000021\t4417229013', null, 'financial', '021000021'],
    ['Sheet1\nOrder ID\tTotal\n4111111111111111\t4200\nSheet2\nName\tCard\nDan\t4111111111111111', null, 'financial', '4111111111111111']]) {
    assert.deepEqual(at(text, file), [[category, mark]], text);
  }
});

test('after a label, any word is a password unless it is a status or pointer on the closed list (23 October 2026)', () => {
  const access = (t) => screenText(t).some((f) => f.category === 'access');
  for (const t of ['Password: elephant', 'Password: magic', 'Password: sunshine, user bob', 'Password: zoo', 'PW: Hunter2!', 'Password = Falcon',
    'The password is admin.', 'Password was changed to orchid', 'Password: Tr4ctor!22']) assert.ok(access(t), t);
  for (const t of ['Password: Requested.', 'Password: requested', 'The password is auto-generated.', 'Password: auto-generated', 'Password: sent separately',
    'Password: see the vault entry', 'Password: same as before', 'Password: TBD', 'Password: will send by text', 'Password: (same as your email login)',
    'Password: reset link sent', 'Password: ********', 'Password: <your password>', 'I reset my password this morning.', 'The password is case-sensitive.',
    'The password is too short.', 'Password: expired', 'Password: n/a', 'Password: via SMS', 'Password: please call me']) assert.ok(!access(t), t);
});

test('a gate code still counts when a comma, bracket or dash separates the place from "code" (live meeting location)', () => {
  for (const text of ['Side gate, code 4471', 'Side gate (code 4471)', 'Side gate - code 4471', 'Door, code 1234 works'])
    assert.deepEqual(screenText(text).map((f) => f.category), ['access'], text);
  for (const text of ['The gate, coded blue, opens at 9.', 'Open the side gate, code review at 4.'])
    assert.deepEqual(screenText(text), [], text);
});

test('profit-and-loss figures, a PIN after "#" and a bank ID label are caught (real-mail misses)', () => {
  for (const text of ['Monthly P/L is $671,000.', 'Total P/L for April, 2001 $1,231,300', 'July, 2001 profit to date is $190,000'])
    assert.deepEqual(screenText(text).map((f) => f.category), ['economics'], text);
  assert.deepEqual(screenText('Beeper (800) 374-4434 Pin # 13050').map((f) => f.category), ['access']);
  for (const text of ['Our profit share offer to you is 10%.', 'The P/L template is attached.', 'Profit and loss statement attached.'])
    assert.deepEqual(screenText(text), [], text);
});

test('wire instructions labelled "BK ID" with an account number are a bank detail; the routing number alone is not', async () => {
  const { checkDraft } = await import('../core/gate.mjs');
  const check = (text) => checkDraft({ from: { address: 'a@x.example' }, to: [{ address: 'b@y.example' }], cc: [], bcc: [], subject: 's', body: { format: 'text', text }, attachments: [] }, { config: { internalDomains: [] } });
  assert.ok((await check('CR BK ID: 111000012\nCR ACCT: 4479921856')).findings.some((f) => f.subkind === 'bank'));
  assert.equal((await check('CR BK ID: 021000021')).state, 'clear');
});
