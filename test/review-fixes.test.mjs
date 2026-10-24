// Regressions for the independent review of 24 October 2026 (findings F3, F4, F5, F7).
import test from 'node:test';
import assert from 'node:assert/strict';
import { screenText } from '../core/rules.mjs';
import { visibleText, removeSentenceFromHtml } from '../core/remove.mjs';
import { checkDraft } from '../core/gate.mjs';

const TAB = '\t', NL = '\n';
const outside = (text, format = 'text') => ({ from: { address: 'a@in.example' }, to: [{ name: 'X', address: 'x@out.example' }], cc: [], bcc: [],
  subject: 's', body: { format, text }, attachments: [] });
const check = (draft) => checkDraft(draft, { config: { internalDomains: ['in.example'], model: 'off' } });

test('F3: an HTML table keeps its rows and cells, so a list of people in the body is found', async () => {
  const html = '<table><tr><th>Name</th><th>Home address</th></tr><tr><td>Avery Reed</td><td>18 Fictional Walk</td></tr></table>';
  assert.equal(visibleText(html).trim(), 'Name' + TAB + 'Home address' + NL + 'Avery Reed' + TAB + '18 Fictional Walk');
  const r = await check(outside(visibleText(html), 'html'));
  assert.deepEqual(r.findings.map((f) => f.subkind), ['records']);
});

test('F3: every standard named character reference decodes, so it reads as the recipient sees it', async () => {
  assert.equal(visibleText('<div>Password&colon; Tr4ctor!22</div>').trim(), 'Password: Tr4ctor!22');
  assert.equal(visibleText('<div>Internal&Tab;only &amp co &copy;</div>').trim(), 'Internal' + TAB + 'only & co ©');
  const r = await check(outside(visibleText('<div>Password&colon; Tr4ctor!22</div>'), 'html'));
  assert.deepEqual(r.findings.map((f) => f.category), ['access']);
  // Removal still cuts only that sentence's characters out of the markup.
  const cut = removeSentenceFromHtml('<div>Hi Sam,</div><div>Password&colon; Tr4ctor!22</div><div>Thanks</div>', 'Password: Tr4ctor!22');
  assert.ok(cut.ok); assert.equal(cut.html, '<div>Hi Sam,</div><div></div><div>Thanks</div>');
});

test('F7: a records table needs a filled sensitive value; schedule words are not sensitive columns', () => {
  const records = (t) => screenText(t, { source: 'attachment', file: 'x.xlsx' }).filter((f) => f.subkind === 'records').length;
  assert.equal(records('Name' + TAB + 'Home address' + NL + 'Avery Reed' + TAB + '18 Fictional Walk'), 1);
  for (const t of ['Name' + TAB + 'Home address' + NL + 'Avery Reed' + TAB,
    'Name' + TAB + 'Bank holiday' + NL + 'Avery Reed' + TAB + 'Monday',
    'Name' + TAB + 'Home team' + NL + 'Avery Reed' + TAB + 'Rovers',
    'Name' + TAB + 'Date of birth' + NL + 'Avery Reed' + TAB + 'N/A']) assert.equal(records(t), 0, JSON.stringify(t));
});

test('F4: a file replaced under the same id, name and size after the check is not released', async () => {
  const { load, demo, person } = await import('./runtime-helper.mjs');
  const b64 = (s) => Buffer.from(s, 'utf8').toString('base64');
  const before = 'See you soon, Sam. x', after = 'Password: Tr4ctor!22';
  assert.equal(before.length, after.length);
  const state = demo({ body: 'Notes attached.', attachments: [{ id: 't1', name: 'notes.txt', size: before.length, attachmentType: 'file', isInline: false, contentType: 'text/plain' }], contents: { t1: b64(before) } });
  const l = load({ state, check: (d, o, original) => Promise.resolve(original(d, o)).then((r) => { state.contents.t1 = b64(after); return r; }) });
  const decision = await l.send();
  assert.notEqual(decision.allowEvent, true, 'the changed file must not go out on the first check');
  assert.equal(JSON.parse(l.values['dg-phase']).phase, 'unavailable');
});

test('F5: hostile long stretches stay fast, and findings inside them are still found', () => {
  const timed = (text) => { const t = performance.now(); const f = screenText(text); return [f, performance.now() - t]; };
  for (const text of ['password:' + ' '.repeat(100000) + '!', '1,'.repeat(30000) + 'z', '1'.repeat(200000) + ' percent margin']) {
    const [, ms] = timed(text);
    assert.ok(ms < 400, Math.round(ms) + ' ms for ' + JSON.stringify(text.slice(0, 20)));
  }
  const filler = 'lorem ipsum dolor sit amet '.repeat(200);
  const [found] = timed(filler + 'the gate code is 4471 and ' + filler + 'our margin is 22% ' + filler);
  assert.deepEqual(found.map((f) => f.category).sort(), ['access', 'economics']);
});
