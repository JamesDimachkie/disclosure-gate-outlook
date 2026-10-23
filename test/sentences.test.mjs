import test from 'node:test';
import assert from 'node:assert/strict';
import { splitSentences, fold, occurrenceOf, stillPresent, labelValuePairs } from '../core/sentences.mjs';

const texts = (s) => splitSentences(s).map((x) => x.text);

test('the demo body is two sentences, with offsets into the source', () => {
  const body = "Kate — North Hall's tracking triple the margin we bid. If Dan pushes on CO 12, we've got room.";
  const out = splitSentences(body);
  assert.deepEqual(out.map((s) => s.text), ["Kate — North Hall's tracking triple the margin we bid.", "If Dan pushes on CO 12, we've got room."]);
  for (const s of out) assert.equal(body.slice(s.start, s.end), s.text);
});

test('a line break always ends a sentence; blank lines add nothing', () => {
  assert.deepEqual(texts('Hi Kate,\r\n\r\nThanks for the call.\nJohn'), ['Hi Kate,', 'Thanks for the call.', 'John']);
});

test('decimals, domains, file names and prices never split', () => {
  assert.deepEqual(texts('The unit rate is $4.50 per foot. See site-photos.zip and northline.example first. Done.'),
    ['The unit rate is $4.50 per foot.', 'See site-photos.zip and northline.example first.', 'Done.']);
  assert.deepEqual(texts('Write to john@northline.example. Then call.'), ['Write to john@northline.example.', 'Then call.']);
});

test('titles and Latin abbreviations stay inside their sentence', () => {
  assert.deepEqual(texts('Mr. Whitfield called about e.g. the gate. He is fine.'), ['Mr. Whitfield called about e.g. the gate.', 'He is fine.']);
  assert.deepEqual(texts('Bring gloves, boots etc. to site. Then sign in.'), ['Bring gloves, boots etc. to site.', 'Then sign in.']);
  assert.deepEqual(texts('We ordered from Acme Inc. They ship Friday.'), ['We ordered from Acme Inc.', 'They ship Friday.']);
  assert.deepEqual(texts('Ask John J. Reyes about it. Thanks.'), ['Ask John J. Reyes about it.', 'Thanks.']);
});

test('question and exclamation marks, closers and ellipses', () => {
  assert.deepEqual(texts('Can you make Friday? "Yes." (Probably.) Great!'), ['Can you make Friday?', '"Yes."', '(Probably.)', 'Great!']);
  assert.deepEqual(texts("We'll see... maybe later. OK… Next week."), ["We'll see... maybe later.", 'OK…', 'Next week.']);
});

test('an em dash is not a boundary; text without punctuation is one sentence', () => {
  assert.deepEqual(texts('North Hall — CO 12'), ['North Hall — CO 12']);
  assert.deepEqual(texts(''), []);
  assert.deepEqual(texts('   \n  '), []);
});

test('a card stays only while its sentence is still in the draft', () => {
  const body = "Kate — North Hall's tracking triple the margin we bid. If Dan pushes on CO 12, we've got room.";
  assert.equal(stillPresent(body, "If Dan pushes on CO 12, we've got room.", 0), true);
  assert.equal(stillPresent("Kate — North Hall's tracking triple the margin we bid.", "If Dan pushes on CO 12, we've got room.", 0), false);
  assert.equal(stillPresent('Call me. Call me.', 'Call me.', 1), true);
  assert.equal(stillPresent('Call me.', 'Call me.', 1), false);
  assert.equal(stillPresent(null, 'Call me.', 0), false);
});

test('label and value pairs: a short label line and the next non-empty line, or two cells of a row', () => {
  const pairs = (text) => labelValuePairs(text, splitSentences(text)).map((p) => [p.index, p.label, p.value, p.valueStart]);
  assert.deepEqual(pairs('Password:\n\n  Tr4ctor!22. Thanks.'), [[1, 'Password:', 'Tr4ctor!22.', 0]]);
  assert.deepEqual(pairs('api_key=\r\nJ9pR4vN7'), [[1, 'api_key=', 'J9pR4vN7', 0]]);
  assert.deepEqual(pairs('SSN\t123456789\nPIN    4471'), [[0, 'SSN:', '123456789', 4], [1, 'PIN:', '4471', 7]]);
  assert.deepEqual(pairs('Name:\tDan   Role:  PM'), [[0, 'Name:', 'Dan', 6], [0, 'Dan:', 'Role:', 12], [0, 'Role:', 'PM', 19]]);
  // Not pairs: a label and value on one line, a colon mid-sentence, a long line, a sentence that is not a label.
  assert.deepEqual(pairs('Password: Tr4ctor!22\nThanks'), []);
  assert.deepEqual(pairs('Here is everything you asked for in the meeting on Friday, in order:\nTr4ctor!22'), []);
  assert.deepEqual(pairs('Thanks. See below.\nTr4ctor!22'), []);
  assert.deepEqual(pairs('Please find the attached documents for review  Tr4ctor!22'), []);
  // A long value is cut at a space; a row reads at most eight pairs.
  assert.equal(pairs('Notes:\n' + 'word '.repeat(60))[0][2].length <= 120, true);
  assert.equal(pairs(Array.from({ length: 30 }, (_, i) => 'C' + i).join('\t')).length, 8);
});

test('occurrences count equal sentences before the one asked for', () => {
  const s = splitSentences('Call me. The gate is fine. Call  me.');
  assert.equal(occurrenceOf(s, 0), 0);
  assert.equal(occurrenceOf(s, 2), 1);
  assert.equal(fold(' a \u00a0 b\n'), 'a b');
});

test('table rows keep their column headers: tab and CSV blocks under a header line, and CSV files', async () => {
  const { tableRows } = await import('../core/sentences.mjs');
  const rows = (text, csv) => tableRows(text, { csv }).map((r) => r.cells.map((c) => [c.header, text.slice(c.start, c.end)]));
  assert.deepEqual(rows('Order ID\tTotal\n4111\t4200\n\tlate\n\nNot a row\t1'), [[['Order ID', '4111'], ['Total', '4200']], [['Order ID', ''], ['Total', 'late']]]);
  assert.deepEqual(rows('name,card\n"Lee, M", 4111 \nMorgan,4111\nOne,two,three\nAfter,1'), [[['name', 'Lee, M'], ['card', '4111']], [['name', 'Morgan'], ['card', '4111']]]);
  assert.deepEqual(rows('a,b\n"Lee, ""M""",4111', true), [[['a', 'Lee, ""M""'], ['b', '4111']]]);
  assert.deepEqual(rows('4111,4200\n5,6', true), [[['', '4111'], ['', '4200']], [['', '5'], ['', '6']]]);
  // Not tables: one line, a first line that is not all labels, prose without a matching next line.
  assert.deepEqual(rows('Order ID\tTotal'), []);
  assert.deepEqual(rows('4111\t4200\n5\t6'), []);
  assert.deepEqual(rows('Hi Dan, thanks for the call.\nSee you Friday.'), []);
});
