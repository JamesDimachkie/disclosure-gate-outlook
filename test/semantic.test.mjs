import test from 'node:test';
import assert from 'node:assert/strict';
import { checkDraft } from '../core/gate.mjs';
import { splitSentences, occurrences } from '../core/sentences.mjs';
import { removeSentenceFromText, removeSentenceFromHtml } from '../core/remove.mjs';
import { STRINGS } from '../core/copy.mjs';
import { SEMANTIC_MAX_SENTENCES, SEMANTIC_BUDGET_MS } from '../core/semantic.mjs';
import { CONFIG, DAN, KATE, draft, PNG_B64, PNG_SIZE } from './helpers.mjs';
import { sha256 } from '../core/sha256.mjs';
import { load, plain } from './runtime-helper.mjs';

const clean = (extra = {}) => draft({ subject: '', to: [DAN], cc: [], body: { text: '', format: 'text' }, ...extra });
const prediction = label => ({ label, score: 0.98, scores: { [label]: 0.98 } });
const fake = label => ({ classify: async items => items.map(() => prediction(label)) });
const file = (name, text) => ({ id: name, name, size: Buffer.byteLength(text), type: 'file', content: Buffer.from(text).toString('base64') });

test('semantic fake uses exact rule sentence pointers in subject, quoted body, location and attachments', async () => {
  const body = 'Opening line.\n> Earlier reply.\nRepeated detail. Repeated detail.';
  const input = clean({ itemType: 'appointment', location: 'Meeting location.', subject: 'Subject detail.', body: { text: body },
    attachments: [file('first.txt', 'File opening. File detail.'), file('second.txt', 'File opening.')] });
  let seen;
  const r = await checkDraft(input, { semantic: { classify: async items => { seen ??= items; return items.map(() => prediction('personal')); } } });
  assert.equal(r.checked.semantic, 'used');
  assert.equal(r.state, 'held');
  const parts = [input.subject, input.location, body, 'File opening. File detail.', 'File opening.'];
  assert.deepEqual(seen, parts.flatMap(text => splitSentences(text).map((s, i, all) => ({ text: s.text, context: all[i - 1]?.text || '' }))));
  const expected = parts.flatMap((text, p) => {
    const all = splitSentences(text), counts = occurrences(all);
    return all.map((s, index) => ({ source: ['subject', 'location', 'body', 'attachment', 'attachment'][p], fileIndex: Math.max(0, p - 3), sentence: { ...s, index, occurrence: counts[index] } }));
  });
  assert.deepEqual(r.findings.map(f => ({ source: f.source, fileIndex: f.fileIndex, sentence: f.sentence })), expected);
  assert.ok(r.findings.every(f => f.found_by === 'model' && f.severity === 'stop'));
  assert.equal(new Set(r.findings.map(f => f.id)).size, r.findings.length);
  assert.equal(r.findings.find(f => f.source === 'attachment').place, 'In first.txt');
  assert.ok(r.findings.filter(f => f.source === 'attachment' || f.source === 'location').every(f => !f.removable));
  const repeated = r.findings.filter(f => f.source === 'body').at(-1);
  assert.equal(repeated.sentence.occurrence, 1);
  const removed = removeSentenceFromText(body, repeated.sentence.text, repeated.sentence.occurrence);
  assert.equal(removed.ok, true);
  assert.equal(removed.text, 'Opening line.\n> Earlier reply.\nRepeated detail.');
  assert.equal(removeSentenceFromHtml('<p>Repeated detail.</p><p>Repeated detail.</p>', repeated.sentence.text, 1).html, '<p>Repeated detail.</p><p></p>');
});

test('semantic labels reuse the categories, severity and sender copy without inventing finer labels', async () => {
  const labels = ['access', 'personal', 'economics', 'negotiation', 'remark'];
  const r = await checkDraft(clean({ body: { text: labels.map((_, i) => `Detail ${i}.`).join('\n') } }), {
    semantic: { classify: async items => items.map(({ text }) => prediction(labels[Number(/Detail (\d)/.exec(text)[1])])) }, config: { findings: 'ask', failures: 'hold' },
  });
  assert.deepEqual(r.findings.map(f => [f.category, f.subkind, f.severity]), [
    ['access', 'security', 'stop'], ['personal', 'other', 'stop'], ['economics', 'other', 'stop'], ['negotiation', 'position', 'stop'], ['remark', 'insult', 'stop'],
  ]);
  const pick = (entry, f) => (typeof entry === 'string' ? entry : entry[f.subkind] ?? entry.other);
  for (const f of r.findings) { assert.equal(f.label, pick(STRINGS.labels[f.category], f)); assert.equal(f.why, pick(STRINGS.why[f.category], f)); assert.equal(f.removable, true); }
  assert.equal(r.outcome, 'ask');
  assert.equal(r.hasFailures, false);
  assert.doesNotMatch(r.message, /Detail [0-9]/);
});

test('semantic dedupe keeps every rule finding on that sentence, even for a different predicted category', async () => {
  const d = clean({ body: { text: 'The password is Tr4ctor!22 and our margin is 20%.\nAnother detail.' } });
  const rules = await checkDraft(d);
  const r = await checkDraft(d, { semantic: fake('personal') });
  assert.deepEqual(r.findings.filter(f => f.found_by === 'rules'), rules.findings);
  assert.equal(r.findings.filter(f => f.found_by === 'model').length, 1);
  assert.equal(r.findings.at(-1).sentence.text, 'Another detail.');
});

test('semantic exceptions give rules-only results with a content-free diagnostic and no failed check', async () => {
  for (const text of ['Ordinary detail.', 'The password is Tr4ctor!22.']) {
    const d = clean({ body: { text } }), rules = await checkDraft(d);
    const r = await checkDraft(d, { semantic: { classify() { throw new Error(text); } } });
    assert.equal(r.state, rules.state);
    assert.deepEqual(r.findings, rules.findings);
    assert.equal(r.checked.semantic, 'skipped:error');
    assert.notEqual(r.hasFailures, true);
  }
});

test('a slow or hanging classifier is cancelled and late output cannot mutate the rules-only result', async () => {
  let resolve, cancelled = 0;
  const semantic = { classify: () => new Promise(r => { resolve = r; }), cancel: () => cancelled++ };
  const r = await checkDraft(clean({ body: { text: 'Ordinary detail.' } }), { semantic, semanticBudgetMs: 15 });
  assert.equal(r.state, 'clear'); assert.equal(r.checked.semantic, 'skipped:timeout'); assert.equal(cancelled, 1);
  resolve([prediction('personal')]); await new Promise(r => setTimeout(r, 5));
  assert.deepEqual(r.findings, []); assert.equal(r.checked.semantic, 'skipped:timeout');
  assert.equal(SEMANTIC_BUDGET_MS, 1500);
});

test('a synchronous classifier overrun is caught by the wall-clock guard', async () => {
  const r = await checkDraft(clean({ body: { text: 'Ordinary detail.' } }), { semanticBudgetMs: 5, semantic: { classify(items) {
    const end = Date.now() + 10; while (Date.now() < end) {} return items.map(() => prediction('personal'));
  } } });
  assert.equal(r.state, 'clear'); assert.equal(r.checked.semantic, 'skipped:timeout');
});

test('inside-only and recipient-free drafts never call the classifier; unknown recipients do', async () => {
  let calls = 0;
  const semantic = { classify: async items => { calls++; return items.map(() => prediction('none')); } };
  for (const to of [[KATE], []]) {
    const r = await checkDraft(clean({ to, body: { text: 'Ordinary detail.' } }), { semantic, config: CONFIG });
    assert.equal(r.state, 'clear'); assert.equal(r.checked.semantic, 'skipped:inside');
  }
  assert.equal(calls, 0);
  const r = await checkDraft(clean({ to: [{ address: '', kind: 'group' }], body: { text: 'Ordinary detail.' } }), { semantic });
  assert.equal(r.reach, 'unknown'); assert.equal(calls, 1); assert.equal(r.checked.semantic, 'used');
});

test('none labels add no findings and absent/empty model passes are explicit diagnostics', async () => {
  const d = clean({ body: { text: 'Ordinary detail.' } });
  const r = await checkDraft(d, { semantic: fake('none') });
  assert.equal(r.state, 'clear'); assert.deepEqual(r.findings, []); assert.equal(r.checked.semantic, 'used');
  assert.equal((await checkDraft(d)).checked.semantic, 'skipped:absent');
  assert.equal((await checkDraft(clean(), { semantic: fake('none') })).checked.semantic, 'skipped:empty');
});

test('invalid output is discarded as a whole, with no partial findings', async () => {
  for (const output of [[], null, {}, [prediction('private')], [prediction('__proto__')], [{ label: 'personal', score: NaN }], [{ label: 'personal', score: 2 }], [{ label: 'personal' }]]) {
    const r = await checkDraft(clean({ body: { text: 'Ordinary detail.' } }), { semantic: { classify: async () => output } });
    assert.equal(r.state, 'clear'); assert.deepEqual(r.findings, []);
    assert.match(r.checked.semantic, /^skipped:(invalid|timeout)$/);
  }
});

test('sentence cap skips the entire semantic pass and expired Send budgets still return rule findings', async () => {
  let calls = 0;
  const semantic = { classify: async items => { calls++; assert.equal(items.length, SEMANTIC_MAX_SENTENCES); return items.map(() => prediction('none')); } };
  assert.equal((await checkDraft(clean({ body: { text: 'Detail.\n'.repeat(SEMANTIC_MAX_SENTENCES) } }), { semantic })).checked.semantic, 'used');
  assert.equal((await checkDraft(clean({ body: { text: 'Detail.\n'.repeat(SEMANTIC_MAX_SENTENCES + 1) } }), { semantic })).checked.semantic, 'skipped:limit');
  const r = await checkDraft(clean({ body: { text: 'The password is Tr4ctor!22.' } }), { semantic, semanticDeadline: Date.now() - 1 });
  assert.equal(calls, 1); assert.equal(r.checked.semantic, 'skipped:timeout'); assert.equal(r.findings[0].found_by, 'rules');
});

test('low-confidence OCR hints never enter the semantic classifier', async () => {
  const hint = 'The password is Tr4ctor!22.', hash = sha256(Uint8Array.from(Buffer.from(PNG_B64, 'base64')));
  const r = await checkDraft(clean({ body: { text: 'Ordinary detail.' }, attachments: [{ id: 'p', name: 'photo.png', size: PNG_SIZE, type: 'file', content: PNG_B64,
    ocr: { status: 'failed', reason: 'ocr_low_confidence', hint, hash } }] }), { semantic: { classify: async items => {
    assert.deepEqual(items, [{ text: 'Ordinary detail.', context: '' }]); return items.map(() => prediction('none'));
  } } });
  assert.equal(r.checked.semantic, 'used'); assert.equal(r.findings[0].found_by, 'ocr');
});

test('classic core accepts the optional fake seam without a model engine or loader', async () => {
  const l = load();
  const r = await l.core.checkDraft(clean({ body: { text: 'Ordinary detail.' } }), { semantic: fake('personal') });
  assert.equal(r.checked.semantic, 'used');
  assert.deepEqual(plain(r.findings[0].sentence), { text: 'Ordinary detail.', start: 0, end: 16, index: 0, occurrence: 0 });
  assert.equal(l.context.DisclosureGateSemantic, undefined);
});

test('IT can turn the model off: the classifier is never called and rules decide alone', async () => {
  let called = 0;
  const semantic = { classify: async items => { called++; return items.map(() => ({ label: 'personal', score: 0.99, scores: {} })); } };
  const r = await checkDraft(draft({ subject: '', body: { text: 'Ordinary detail.' } }), { config: { model: 'off' }, semantic });
  assert.equal(called, 0); assert.equal(r.state, 'clear'); assert.equal(r.checked.semantic, 'skipped:off');
});

test('an explicit evaluator budget can exceed the production default', async t => {
  let clock = 100;
  t.mock.method(Date, 'now', () => clock);
  const d = clean({ body: { text: 'Ordinary detail.' } });
  const semantic = { classify: items => { clock += 1600; return items.map(() => prediction('personal')); } };
  assert.equal((await checkDraft(d, { semantic, semanticBudgetMs: 3000 })).checked.semantic, 'used');
  assert.equal((await checkDraft(d, { semantic })).checked.semantic, 'skipped:timeout');
});

test('semantic deadlines use the injected gate clock, including time consumed by rules', async () => {
  const d = clean({ body: { text: 'Ordinary detail.' } });
  assert.equal((await checkDraft(d, { now: () => 100, semanticDeadline: 200, semantic: fake('personal') })).checked.semantic, 'used');
  let calls = 0, tick = 0;
  const r = await checkDraft(d, { now: () => tick++ ? 250 : 100, semanticDeadline: 200,
    semantic: { classify() { calls++; return []; } } });
  assert.equal(calls, 0); assert.equal(r.checked.semantic, 'skipped:timeout');
});

test('a disclosure read as context does not spill a finding onto the next sentence', async () => {
  // Fake model: a sentence is "personal" if it or its context mentions surgery.
  const classify = async items => items.map(({ text, context }) => /surgery/.test(text + ' ' + context) ? { label: 'personal', score: 0.99, scores: {} } : { label: 'none', score: 0.99, scores: {} });
  const r = await checkDraft(draft({ subject: '', body: { text: 'Kim is having knee surgery on Monday. Thanks for your patience. See you soon.' } }), { semantic: { classify } });
  assert.deepEqual(r.findings.filter(f => f.found_by === 'model').map(f => f.sentence.text), ['Kim is having knee surgery on Monday.']);
  const two = await checkDraft(draft({ subject: '', body: { text: 'Kim is having knee surgery on Monday. Lee needs surgery too. Thanks.' } }), { semantic: { classify } });
  assert.equal(two.findings.filter(f => f.found_by === 'model').length, 2, 'a second disclosure that stands on its own is kept');
});
