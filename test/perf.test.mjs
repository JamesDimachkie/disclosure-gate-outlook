// Spec §8: the decision comes in well under 2 seconds. The screen must never backtrack its way into
// seconds on a long body, so 300,000 characters of ordinary email mixed with near misses for every
// detector (numbers that are almost cards, IBANs, SSNs and tokens) must screen in under 300 ms.
import test from 'node:test';
import assert from 'node:assert/strict';
import { screenText } from '../core/rules.mjs';

// Shared CI runners are slower and noisier than a laptop (a Windows runner took 336 ms where a laptop
// takes about 100). A backtracking regression costs seconds, so CI gets three times the budget.
const BUDGET_MS = process.env.CI ? 900 : 300;

const BENIGN = ['Hi Dan, the pour is scheduled for Friday at 7am and the pump truck is booked.', 'Invoice 4410023 for $12,400 is attached; payment terms are net 30.',
  'If they push the pour to Friday, we can take the pump back.', 'Our cost estimate for you is attached and the margin of error on the survey is 2 mm.',
  'Please review the engagement letter and the retainer schedule before Tuesday.', 'The patient is scheduled for a follow-up at the Elm Street clinic.',
  'Thanks for the update on the listing; the open house moved to Sunday.', 'Our standard rate is $250 an hour and travel is billed at cost.'];
const NEAR = ['Call 555-201-3344 or +44 20 7946 0958 if the crane is late.', 'Tracking number 1Z999AA10123456784 shipped today, order #883301-22.',
  'Order #4000123412341238 and card ending 4242 were both on the receipt.', 'Ref GB82 WEST 1234 5698 7654 33 failed the check.', 'Part 512-34-8890 and ZIP 94110-1234.',
  'Use sk-xxxx and AKIAIOSFODNN7EXAMPLE in the docs, never ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.', 'Password: ******** and PIN: **** are masked.',
  'The SKU is sk-blue-widget-large-edition-2026 and model AB12 CDEF GHIJ KLMN.', 'Version eyJhbGciOi.notatoken.here and 1234 5678 9012 3456 7890 1234.',
  'Server=db;Database=app;Password=${DB_PASSWORD}; postgres://user:password@localhost/db', '-----BEGIN PUBLIC KEY----- AAAA AAAA', 'Sort code is on the statement. 20-10-26.',
  '0'.repeat(400), 'a'.repeat(400) + '@' + 'b'.repeat(400), '1-'.repeat(300), 'If '.repeat(200) + 'they push back', 'xoxb-' + '1-'.repeat(200), 'eyJ' + 'A'.repeat(3000) + '.' + 'eyB'.repeat(500)];

test('300,000 characters of mixed text and near misses screen in under 300 ms', () => {
  let text = '';
  for (let i = 0; text.length < 300000; i++) text += (i % 3 === 2 ? NEAR[i % NEAR.length] : BENIGN[i % BENIGN.length]) + (i % 5 === 4 ? '\n' : ' ');
  screenText(text.slice(0, 20000)); // warm the regex engine, as a running add-in is
  const started = performance.now();
  const findings = screenText(text);
  const ms = performance.now() - started;
  console.log(`# screened ${text.length} characters in ${ms.toFixed(1)} ms, ${findings.length} findings`);
  assert.ok(ms < BUDGET_MS, `${ms.toFixed(1)} ms`);
  assert.deepEqual(findings, [], 'nothing in the near misses is a finding');
});

// Label and value pairs (a "Label:" line then its value, or two columns) are read a second time; that
// second read must stay a bounded multiple of the text, never a scan per label.
const FORM = ['Password:', 'Tr4ctor!22', 'SSN:', '123 45 678', 'Order number:', '4111111111111112', 'Notes:', 'The pour moved to Friday and the pump truck is booked.',
  'Phone\t555-201-3344', 'Name    Dan Whitfield    Role    PM', 'Total:', '$12,400', 'Sort code:', '20-10-26', 'Ref:', 'GB82 WEST 1234 5698 7654 33', 'Thanks,', 'John'];
test('300,000 characters of label lines and table rows screen in under 300 ms', () => {
  let text = '';
  for (let i = 0; text.length < 300000; i++) text += FORM[i % FORM.length] + (i % 7 === 6 ? '\n\n' : '\n');
  screenText(text.slice(0, 20000));
  const started = performance.now();
  const findings = screenText(text);
  const ms = performance.now() - started;
  console.log(`# screened ${text.length} characters of label lines in ${ms.toFixed(1)} ms, ${findings.length} findings`);
  assert.ok(ms < BUDGET_MS, `${ms.toFixed(1)} ms`);
  assert.ok(findings.length > 0 && findings.every((f) => f.sentence.text === 'Tr4ctor!22'), 'only the password values are findings');
  // Pathological shapes: one line of many column gaps, many empty labels, one label then a huge line.
  for (const t of ['a  '.repeat(100000), 'x\t'.repeat(150000), 'Password:\n'.repeat(30000), 'Password:\n' + 'Tr4ctor '.repeat(40000), 'k=\n'.repeat(100000)]) {
    const s = performance.now();
    screenText(t);
    const took = performance.now() - s;
    assert.ok(took < BUDGET_MS, `${JSON.stringify(t.slice(0, 12))}: ${took.toFixed(1)} ms`);
  }
});

test('one enormous sentence of digit groups, letters or separators stays linear', () => {
  for (const unit of ['1234 ', '1234-', 'AB12 ', 'a:', 'password=', 'eyJ.', 'xn--', '12-34-', 'room ', "we've got ", 'a-', "x'", 'sk-', '4 ', '_', 'his ', "dan's ", 'our margin on the ', 'code ', 'sort code ', 'IBAN GB82 ', 'a@', 'Server=a;', 'jdbc:a:', 'he is ', 'passport ']) {
    const text = unit.repeat(Math.ceil(100000 / unit.length));
    const started = performance.now();
    screenText(text);
    const ms = performance.now() - started;
    assert.ok(ms < BUDGET_MS, `${JSON.stringify(unit)}: ${ms.toFixed(1)} ms`);
  }
});

// A CSV attachment and a pasted tab table are read cell by cell under their headers on top of the plain
// read, so 300,000 characters of either must still screen in under 300 ms, with the order numbers in
// the order column, the failed checksums in the card column and the masked cards all left alone.
test('300,000 characters of CSV or tab table rows screen in under 300 ms', () => {
  const header = 'order_id,customer,card_number,amount,status,notes\n';
  const ROWS = ['4111111111111111,Morgan Lee,4111111111111112,"1,240.00",paid,"Delivered Friday, signed"', '883301-22,"Reyes, Tom",**** 4242,12.50,open,',
    '5555555555554444,Dan Whitfield,5555 5555 5555 4440,4200,paid,Invoice 4410023 attached', 'INV-2231,Kate Example,,0.00,void,"See ""notes"" tab"'];
  const fill = (head, rows) => { let t = head; for (let i = 0; t.length < 300000; i++) t += rows[i % rows.length] + '\n'; return t; };
  const toTabs = (l) => l.replace(/"[^"]*"/g, 'x').replace(/,/g, '\t');
  const csv = fill(header, ROWS), tabs = fill(toTabs(header), ROWS.map(toTabs));
  for (const [text, file] of [[csv, 'export.csv'], [csv, null], [tabs, null]]) {
    screenText(text.slice(0, 20000), { file });
    const started = performance.now();
    const findings = screenText(text, { source: file ? 'attachment' : 'body', file });
    const ms = performance.now() - started;
    console.log(`# screened ${text.length} characters of ${file ? 'CSV file' : text === tabs ? 'tab table' : 'CSV in a body'} in ${ms.toFixed(1)} ms, ${findings.length} findings`);
    assert.ok(ms < BUDGET_MS, `${ms.toFixed(1)} ms`);
    assert.deepEqual(findings, [], 'order numbers, failed checksums and masks are not findings');
  }
  // Pathological shapes: many tiny rows, one row of many cells, empty fields, an unclosed quote.
  for (const [t, file] of [['a,b\n' + '1,2\n'.repeat(75000), null], ['a,b\n' + '1,2\n'.repeat(75000), 'x.csv'], ['h1,h2\n' + 'x,'.repeat(150000), 'x.csv'],
    ['h1\th2\n' + 'x\t'.repeat(150000), null], [','.repeat(300000), 'x.csv'], ['"'.repeat(300000), 'x.csv'], ['a,"' + 'x'.repeat(300000), 'x.csv']]) {
    const s = performance.now();
    screenText(t, { file });
    const took = performance.now() - s;
    assert.ok(took < BUDGET_MS, `${JSON.stringify(t.slice(0, 12))}: ${took.toFixed(1)} ms`);
  }
});
