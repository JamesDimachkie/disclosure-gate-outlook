// The classic Outlook bundle runs every pattern through build-time ES2016 conversions
// (core/regex.mjs, tools/build.mjs, outlook/indexed-pattern.mjs). It must find exactly what the native
// core finds, with the same highlights, and stay fast on a long email.
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkDraft } from '../core/gate.mjs';
import { CONFIG, KATE, DAN, JOHN, DEMO_BODY } from './helpers.mjs';
import { load, plain } from './runtime-helper.mjs';

const BODIES = [
  DEMO_BODY,
  'Kate, the deposit card is 4111 1111 1111 1111, exp 09/28.',
  'Wire to IBAN GB82 WEST 1234 5698 7654 32 today please.',
  'Routing number: 021000021\nAccount number: 4417 2290 13',
  'Sort code 40-47-84, account 70872490.',
  'His SSN is 512-34-8890 and his NI number is QQ 12 34 56 C.',
  'Her passport number is X1234567 per the file.',
  'Deploy key: AKIAZ7Q4M2K8P3R6T9WX and the token ghp_8fK2mQ9xL4vR7tY1wZ3nB6cD5eH0jA2sG4uP',
  'Use postgres://svc_app:Wq8!zr4Lp2@db.internal.example:5432/app for now.',
  'The password is Tr4ctor!22 and the gate code is 4471.',
  'The alarm on the east side is still off and the spare key is under the mat.',
  "We'd accept $410k if they push. Our margin on this is 22%.",
  "He's an idiot, honestly. Her surgery is on Monday so she's out.",
  'Invoice 37264918 is due in 14 days; order 1234-5678-9012 shipped with tracking 1Z999AA10123456784.',
  'I reset my password this morning. The promo code SPRING24 still works. Card ending 4242.',
  // Audit fixes (October 2026): label and value pairs, assignments in capitals, IBANs as copied, weak
  // passwords that are given, card numbers under an order label, person-specific personal rules, offers.
  'Password:\nTr4ctor!22', 'SSN:\n123456789', 'Passport number:\n548213976', 'api_key=\nJ9pR4vN7zK2mX6tQ8cL3wY5b', 'Sort code:\n20-00-00\nAccount: 12345678',
  'Password\tsunshine\nPIN    4471', 'API_KEY=J9pR4vN7zK2mX6tQ8cL3wY5b and AWS_SECRET_ACCESS_KEY=J9pR4vN7zK2mX6tQ8cL3wY5b',
  'IBAN: gb82 west 1234 5698 7654 32 or GB82\tWEST\t1234\t5698\t7654\t32', 'Password: sunshine. The password is admin. PIN: 1111. Password: aB3',
  'Please pay by credit card. Order: 4111111111111111 {"order_id":"4111111111111111"}', "Our company's EIN is 98-7654321.",
  'Our bereavement leave policy is attached. Our company has a court case next week. Tom has a court date on the 14th.',
  "We can accept $4,000 for this order. We'd accept $3,500 if they push.",
  // Final review fixes (October 2026): password statements, person subjects, table headers.
  'Password: Requested. The password is auto-generated. Password: zoo. Password: blue-sky. pw: Hunter2!\nPIN  4471',
  "The timber is being treated for rot. Northline Ltd has a court case next week. She's been diagnosed with diabetes. Tom Reyes went to the hospital.",
  'order_id,payment_method,total\n4111111111111111,card,4200\n\nOrder ID\tTotal\n4111111111111111\t4200',
  'name,card_number\nMorgan,4111111111111111\n\nName\tcc\tPassword\nMorgan\t4111 1111 1111 1111\tTr4ctor!22\n\nRouting\tAccount\n021000021\t4417229013',
];

const shape = (r) => ({ state: r.state, findings: (r.findings || []).map((f) => [f.category, f.subkind, f.source, f.sentence.start, f.sentence.end, f.marks.map((m) => [m.start, m.end])]) });

for (const modernRegex of [false, true]) test(`the ${modernRegex ? 'modern' : 'ES2016'} path of the bundle finds exactly what the native core finds, highlights included`, async () => {
  const l = load({ modernRegex });
  for (const text of BODIES) {
    const draft = { from: JOHN, to: [KATE], cc: [DAN], bcc: [], subject: 'Update', body: { text, format: 'text' }, attachments: [] };
    const native = shape(await checkDraft(draft, { config: CONFIG }));
    const legacy = shape(plain(await l.core.checkDraft(draft, { config: CONFIG })));
    assert.deepEqual(legacy, native, text);
  }
});

test('the classic bundle screens a long email quickly', async () => {
  const l = load();
  const filler = 'The site walk is on Friday at 9am; bring the drawings, the CO log and invoice 3341. ';
  const text = filler.repeat(Math.ceil(200000 / filler.length)) + 'Our margin on this is 22%.';
  const draft = { from: JOHN, to: [DAN], cc: [], bcc: [], subject: 'Update', body: { text, format: 'text' }, attachments: [] };
  const started = performance.now();
  const r = plain(await l.core.checkDraft(draft, { config: CONFIG }));
  const ms = performance.now() - started;
  assert.equal(r.state, 'held');
  assert.ok(ms < 1500, `took ${Math.round(ms)} ms`);
});

test('long unbroken lines stay fast on the ES2016 path (no per-character scan to the end of the text)', async () => {
  const l = load();
  // The last two have many raw matches in one long sentence (final review B, 22 October 2026).
  for (const text of ['a-'.repeat(50000), '{"k":"' + 'x1-'.repeat(40000) + '"}', 'word '.repeat(60000), 'Password: expired; '.repeat(26000), 'PIN 4471; '.repeat(44000)]) {
    const draft = { from: JOHN, to: [DAN], cc: [], bcc: [], subject: 'Log', body: { text, format: 'text' }, attachments: [] };
    const started = performance.now();
    plain(await l.core.checkDraft(draft, { config: CONFIG }));
    const ms = performance.now() - started;
    assert.ok(ms < 1000, `${text.slice(0, 12)}… took ${Math.round(ms)} ms`);
  }
});
