import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createInputGuard } from '../outlook/model-input.mjs';
import { checkDraft } from '../core/gate.mjs';
import { draft } from './helpers.mjs';
import { Tokenizer } from '@huggingface/tokenizers';
import { formatInput, createTokenizer } from '../model/tokenize.mjs';

const tokenizer = JSON.parse(readFileSync(new URL('../model/out/tokenizer.json', import.meta.url)));
const labels = JSON.parse(readFileSync(new URL('../model/out/labels.json', import.meta.url)));

test('guard and inference share the formatter at the exact token boundary for both input modes', () => {
  const raw = new Tokenizer(tokenizer, {});
  for (const input of ['text', 'context_text']) for (const item of [
    { text: 'Schedule item.', context: 'Earlier detail.' }, { text: 'Café — project update.\nNext line.' },
    { text: 'Please review.', context: 'Previous schedule item. '.repeat(50) },
  ]) {
    const ids = raw.encode(formatInput(item, input), { add_special_tokens: true }).ids;
    const metadata = { ...labels, input, max_length: ids.length };
    assert.equal(createInputGuard(tokenizer, metadata)([item]), true);
    assert.deepEqual(createTokenizer(tokenizer, metadata).encode(item), ids);
    assert.equal(createInputGuard(tokenizer, { ...metadata, max_length: ids.length - 1 })([item]), false);
  }
});

test('real tokenizer guard skips a whole semantic pass rather than truncating a long sentence', () => {
  const accepts = createInputGuard(tokenizer, labels);
  assert.equal(accepts([{ text: 'Please check the schedule.', context: '' }]), true);
  assert.equal(accepts([{ text: 'Please check the schedule. '.repeat(100), context: '' }]), false);
  assert.equal(accepts([{ text: 'Short.', context: '' }, { text: 'Very long sentence. '.repeat(100), context: '' }]), false);
  const contextual = createInputGuard(tokenizer, { ...labels, input: 'context_text' });
  assert.equal(contextual([{ text: 'Short.', context: 'Long previous sentence. '.repeat(100) }]), false);
  assert.equal(accepts([{ text: 'Short.', context: 'Long previous sentence. '.repeat(100) }]), labels.input !== 'context_text', 'the delivered model reads context only when its metadata says so');
});

test('token-window skips remain content-free diagnostics and never turn into failed checks', async () => {
  const r = await checkDraft(draft({ subject: '', body: { text: 'Ordinary detail.' } }), { semantic: { classify() {
    throw Object.assign(new Error('Ordinary detail.'), { semanticReason: 'input_limit' });
  } } });
  assert.equal(r.state, 'clear'); assert.equal(r.checked.semantic, 'skipped:input_limit'); assert.notEqual(r.hasFailures, true);
});

test('delivered source and model artifacts match the recorded copy provenance', () => {
  const provenance = JSON.parse(readFileSync(new URL('../model/PROVENANCE.json', import.meta.url)));
  for (const [name, entry] of Object.entries(provenance.files)) {
    const bytes = readFileSync(new URL('../model/' + name, import.meta.url));
    assert.equal(bytes.length, entry.bytes, name);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256, name);
  }
  for (const name of ['classifier.mjs', 'tokenize.mjs']) assert.doesNotMatch(readFileSync(new URL('../model/' + name, import.meta.url), 'utf8'), /\bfetch\s*\(|sendBeacon|XMLHttpRequest/);
});

test('admission reads each sentence alone when only its context overflows, and leaves only overlong sentences unread', async () => {
  const { createInputAdmission, mergeAdmitted } = await import('../outlook/model-input.mjs');
  const admit = createInputAdmission(tokenizer, labels);
  const long = 'Previous schedule item with many words. '.repeat(40);
  const plan = admit([
    { text: 'Short sentence.', context: 'Earlier detail.' },
    { text: 'Please review.', context: long },
    { text: long, context: '' },
  ]);
  assert.deepEqual(plan.positions, [0, 1]);
  assert.deepEqual(plan.unread, [2]);
  assert.equal(plan.admitted[1].context, '');
  const merged = mergeAdmitted(3, plan, [{ label: 'none', score: 0.9, scores: {} }, { label: 'personal', score: 0.8, scores: {} }]);
  assert.equal(merged[1].label, 'personal'); assert.equal(merged[2].unread, true); assert.equal(merged.incomplete, true);
});

test('a long line costs only its own sentence the model pass, and the pass reports partial', async () => {
  const semantic = { classify: async items => items.map(i => ({ label: /chemo/.test(i.text) ? 'personal' : 'none', score: 0.9, scores: {} })) };
  const { withAdmission } = await import('../outlook/model-input.mjs');
  const guarded = withAdmission(semantic, tokenizer, labels);
  const body = 'Hi Kate,\n' + 'the schedule and the logistics of the site visit and '.repeat(40) + '\nBetween us, Dan starts chemo on Monday.\nThanks,';
  const r = await checkDraft(draft({ body: { text: body, format: 'text' } }), { config: { internalDomains: [] }, semantic: guarded, semanticBudgetMs: 60000 });
  assert.equal(r.checked.semantic, 'partial');
  assert.ok(r.findings.some(f => f.category === 'personal'));
});
