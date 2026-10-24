import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { load, demo, appointment } from './runtime-helper.mjs';
import { generateManifest } from '../outlook/manifest.mjs';
import { parseConfigUrl, validateConfig, configQuery } from '../outlook/config.mjs';
import { validateManifest } from '../tools/validate-manifest.mjs';
import { dialogContent, CATEGORIES } from '../core/copy.mjs';
import { checkAgain } from '../outlook/pane-logic.mjs';
import { draft, CLEAN_BODY, PNG_B64, PNG_SIZE } from './helpers.mjs';

const secret = 'The password is Tr4ctor!22. Card number: 4111 1111 1111 1111.';
const zip = { id: 'zip', name: 'site-photos.zip', size: 4000, attachmentType: 'file' };
const people = Array.from({ length: 8 }, (_, i) => ({ emailAddress: `p${i}@${['clientco', 'apexbuild', 'cityworks'][i % 3]}.example`, recipientType: 'user' }));
const cases = {
  finding: { body: secret, attachments: [] },
  failure: { body: CLEAN_BODY, attachments: [zip] },
  mixed: { body: secret, attachments: [zip] },
  prompt: { body: CLEAN_BODY, to: people, requiredAttendees: people, attachments: [] },
  picture: { body: CLEAN_BODY, attachments: [{ id: 'pic', name: 'photo.png', size: PNG_SIZE, attachmentType: 'file' }], contents: { pic: PNG_B64 } },
};
for (const findings of ['ask', 'hold']) for (const failures of ['ask', 'hold']) for (const [kind, values] of Object.entries(cases)) for (const meeting of [false, true]) {
  test(`VM ${meeting ? 'meeting' : 'email'} ${kind}, findings=${findings}, failures=${failures}, all API versions`, async () => {
    for (const version of ['1.12', '1.14', '1.15']) {
      const canOverride = version !== '1.12', markdown = version === '1.15';
      const l = load({ state: (meeting ? appointment : demo)(values), supported: canOverride, markdown, url: `https://static.example/runtime.js?dg=2&findings=${findings}&failures=${failures}` });
      const result = await l.send();
      const configuredAsk = kind === 'prompt' || kind === 'picture' || (kind === 'finding' ? findings === 'ask' : kind === 'failure' ? failures === 'ask' : findings === 'ask' && failures === 'ask');
      const ask = configuredAsk && (canOverride || findings === 'ask' && failures === 'ask');
      assert.equal(result.allowEvent, false);
      assert.equal(result.sendModeOverride, ask && canOverride ? 'promptUser' : undefined);
      assert.equal(result.commandId, canOverride && kind !== 'failure' ? meeting ? 'dgOpenMeetingPane' : 'dgOpenPane' : undefined);
      assert.equal(result.cancelLabel, result.commandId ? 'Review' : undefined);
      assert.equal(typeof result.errorMessageMarkdown, markdown ? 'string' : 'undefined');
      assert.equal(result.errorMessage.includes('Send Anyway'), ask);
      if (!ask) assert.match(result.errorMessage, /It hasn't been sent/);
      assert.match(result.errorMessage, meeting ? /meeting invitation/ : /email/);
      assert.doesNotMatch(result.errorMessage + (result.errorMessageMarkdown || ''), /Tr4ctor|4111|Bcc/);
      if (kind === 'failure' || kind === 'mixed') assert.match(result.errorMessage, /site-photos.zip couldn't be read/);
      if (kind === 'mixed') assert.ok(result.errorMessage.indexOf('In the body') < result.errorMessage.indexOf("site-photos.zip couldn't be read"));
      assert.ok(result.errorMessage.length <= 500);
      if (markdown) { assert.ok(result.errorMessageMarkdown.length <= 500); assert.ok(result.errorMessageMarkdown.startsWith('**'));assert.match(result.errorMessageMarkdown, /\r/); }
    }
  });
}

test('new settings and legacy aliases parse strictly, serialize and choose both event SendModes', () => {
  assert.deepEqual(validateConfig(), { findings: 'ask', failures: 'ask', model: 'on', internalDomains: [], trustedDomains: [] });
  for (const findings of ['ask', 'hold']) for (const failures of ['ask', 'hold']) {
    const config = { findings, failures }, xml = generateManifest(config);
    assert.equal(validateManifest(xml).mode, failures === 'hold' ? 'Block' : findings === 'hold' ? 'SoftBlock' : 'PromptUser');
    assert.deepEqual(parseConfigUrl('https://a.example/' + configQuery(config)), { ...config, model: 'on', internalDomains: [], trustedDomains: [] });
  }
  assert.equal(parseConfigUrl('https://a.example/?dg=2&mode=warn').failures, 'ask');
  assert.equal(parseConfigUrl('https://a.example/' + configQuery({ model: 'on' })).model, 'on');
  assert.doesNotMatch(configQuery({}), /model=/, 'the default keeps existing manifest URLs unchanged');
  assert.match(generateManifest({ model: 'off' }), /&amp;model=off/);
  assert.equal(parseConfigUrl('https://a.example/?dg=2&mode=enforce').findings, 'hold');
  assert.equal(parseConfigUrl('https://a.example/?dg=2&mode=enforce&findings=ask').failures, 'hold');
  for (const query of ['findings=ASK', 'failures=', 'mode=', 'findings=ask&findings=hold', 'failures=ask&%66ailures=hold', 'dg=2&dg=2', 'domains=&domains=x.example', 'findings=%', 'model=yes', 'model=off&model=on', 'model']) assert.throws(() => parseConfigUrl('https://a.example/?dg=2&' + query), query);
});

test('dialog budgets keep actions, locations and counts; names cannot inject markdown or control characters', () => {
  for (const itemType of ['message', 'appointment']) for (const ask of [true, false]) for (const reviewButton of [true, false]) for (const category of CATEGORIES) {
    const list = Array.from({ length: 100 }, (_, i) => ({ category, subkind: category === 'attachment' ? 'unsupported' : category === 'recipient' ? 'lookalike' : 'other', source: i % 2 ? 'attachment' : 'recipient', address: 'a'.repeat(245) + '@x.example', file: '*[x](https://evil.example)\r\n'.repeat(8), sentence: { text: secret } }));
    const r = dialogContent({ state: 'held', findings: list, itemType }, { ask, reviewButton });
    for (const text of Object.values(r)) { assert.ok(text.length <= 500, `${category}: ${text.length}`);assert.match(text, /and 97 more/i);assert.doesNotMatch(text, /Tr4ctor|4111|\[x\]/); }
    if (reviewButton && category !== 'attachment') assert.match(r.errorMessage, /choose Review/i);
  }
});

test('runtime failures follow failures setting and retain the reason through completion fallback', async () => {
  for (const failures of ['ask', 'hold']) for (const reason of ['timeout', 'read', 'error', 'changed', 'ocr_pending']) {
    const l = load({ markdown: true, url: `https://static.example/?dg=2&findings=hold&failures=${failures}`, check: () => ({ state: 'unavailable', reason }) });
    const r = await l.send(o => 'errorMessageMarkdown' in o);
    assert.equal(r.sendModeOverride, failures === 'ask' ? 'promptUser' : undefined);
    assert.equal(r.errorMessage.includes('Send Anyway'), failures === 'ask');
    assert.equal(r.errorMessageMarkdown, undefined);
    assert.match(r.errorMessage, /couldn't check this email/);
  }
  const l = load({ supported: false, url: null });
  assert.match((await l.send()).errorMessage, /If Send Anyway is offered/);
});

test('built runtime keeps inside-only sends working with malformed settings and uses neutral copy outside', async () => {
  for (const supported of [true, false]) for (const url of [null, 'https://static.example/?dg=2&findings=%', 'https://static.example/?dg=2&findings=ask&findings=hold']) {
    const inside = load({ supported, url, state: demo({ cc: [] }) });
    assert.deepEqual(await inside.send(), { allowEvent: true });assert.equal(inside.reads.body, 0);
    for (const body of [secret, CLEAN_BODY]) {
      const outside = load({ supported, url, markdown: supported, state: demo({ body, attachments: body === CLEAN_BODY ? [zip] : [] }) });
      const r = await outside.send();assert.equal(r.allowEvent, false);assert.equal(r.sendModeOverride, undefined);
      assert.match(r.errorMessage, /If Send Anyway is offered and you're sure, choose it; otherwise choose Don't Send, fix it and press Send\./);
      assert.doesNotMatch(r.errorMessage + (r.errorMessageMarkdown || ''), /hasn't been sent/);
    }
  }
});

test('a refused override finishes with installed-mode plain copy, retaining the actual concern', async () => {
  for (const failures of ['ask', 'hold']) {
    const l = load({ markdown: true, url: `https://static.example/?dg=2&findings=ask&failures=${failures}` });
    const r = await l.send(o => 'sendModeOverride' in o);
    assert.equal(r.allowEvent, false);assert.equal(r.sendModeOverride, undefined);assert.equal(r.commandId, undefined);
    assert.equal(r.errorMessage.includes('Send Anyway'), failures === 'ask');
    assert.match(r.errorMessage, /your margin/);assert.match(r.errorMessage, /Open Disclosure Gate from the ribbon/);
  }
});

test('real deadline and failed draft-read paths obey failures setting and complete once', async () => {
  for (const failures of ['ask', 'hold']) for (const readFails of [true, false]) {
    const l = load(), outcomes = [];
    await l.api.run({ completed: o => outcomes.push(JSON.parse(JSON.stringify(o))) }, {
      config: () => ({ findings: 'hold', failures }),
      read: () => readFails ? Promise.reject(new Error('synthetic read failure')) : Promise.resolve({}),
      check: () => new Promise(resolve => setTimeout(() => resolve({ state: 'clear' }), 20)),
      phase: () => {}, reviewButton: () => true, markdown: () => true, fingerprint: () => '', deadlineMs: 5,
    });
    assert.equal(outcomes.length, 1);assert.equal(outcomes[0].allowEvent, false);
    assert.equal(outcomes[0].sendModeOverride, failures === 'ask' ? 'promptUser' : undefined);
    assert.match(outcomes[0].errorMessage, readFails ? /Outlook didn't let it read the draft/ : /It took too long/);
  }
});

test('pane Check again prepares OCR, passes its config and reads fresh content without storing a clearance', async () => {
  const calls = [], config = { findings: 'hold', failures: 'ask' }, office = {};
  const result = await checkAgain(office, { config, deadline: 12345, ocr: { prepare: async o => { assert.equal(o, office);calls.push('ocr'); } }, reader: { fingerprint: d => { assert.equal(d.body.text, secret); return 'checked-fingerprint'; }, readDraft: async (o, content, cache, options) => { assert.equal(o, office);assert.equal(content, true);assert.equal(options.deadline, 12345);calls.push('read');return draft({ body: { text: secret } }); } } });
  assert.deepEqual(calls, ['ocr', 'read']);assert.equal(result.outcome, 'hold');assert.equal(result.paneCheck, true);
  assert.equal(result.paneFingerprint, 'checked-fingerprint');
});

async function loadPane(l) {
  class Element {
    constructor() { this.children = []; this.dataset = {}; this.attrs = {}; this.listeners = {}; this.hidden = false; }
    setAttribute(k, v) { this.attrs[k] = v; }
    getAttribute(k) { return this.attrs[k]; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children;this._text = ''; }
    addEventListener(k, fn) { this.listeners[k] = fn; }
    set textContent(v) { this._text = v; this.children = []; }
    get textContent() { return (this._text || '') + this.children.map(c => typeof c === 'string' ? c : c.textContent).join(''); }
  }
  const nodes = new Map(), node = id => { if (!nodes.has(id)) nodes.set(id, new Element());return nodes.get(id); };
  const intervals = new Map();
  let ready;
  l.context.Node = Element;l.context.URLSearchParams = URLSearchParams;l.context.location = { href: 'https://static.example/taskpane.html?dg=2&findings=ask&failures=ask', search: '?dg=2&findings=ask&failures=ask' };
  l.context.document = { getElementById: node, createElement: () => new Element(), createElementNS: () => new Element(), documentElement: new Element(), querySelectorAll: () => [], hidden: false };
  l.context.setInterval = (fn, ms) => { intervals.set(ms, fn); return ms; };l.office.onReady = fn => { ready = Promise.resolve().then(fn); };
  vm.runInContext(readFileSync(new URL('../dist/pane.js', import.meta.url), 'utf8'), l.context);await ready;
  return { node, tick: ms => intervals.get(ms)() };
}

test('built pane Check again hides retry for oversize, invalidates after editing, and never stores clearance', async () => {
  const state = demo({ body: CLEAN_BODY, attachments: [zip] }), l = load({ state, url: 'https://static.example/?dg=2&findings=ask&failures=ask' });
  await l.send();const stored = l.values['dg-result'];
  const { node, tick } = await loadPane(l);
  assert.equal(node('check-again').hidden, false);assert.equal(node('check-again').textContent, 'Check again');assert.match(node('notice').textContent, /You can still send it/);
  state.attachments = [];
  state.body = 'x'.repeat(500001);
  await node('check-again').listeners.click();
  assert.equal(node('pane').dataset.state, 'unavailable');assert.match(node('notice').textContent, /too large to check/);assert.match(node('notice').textContent, /Shorten it or split it, then press Send/);assert.equal(node('check-again').hidden, true);
  state.body = CLEAN_BODY;
  await tick(1500);
  assert.equal(node('pane').dataset.state, 'idle');assert.equal(node('check-again').hidden, false);
  await node('check-again').listeners.click();
  assert.equal(node('pane').dataset.state, 'clear');assert.match(node('foot').textContent, /This draft passed the local check/);assert.equal(l.values['dg-result'], stored);
  state.body = secret;
  assert.equal((await l.send()).allowEvent, false);
});

test('built pane invalidates a local pass after text, file identity, address and meeting-location edits', async () => {
  const edits = {
    subject: s => { s.subject += ' revised'; }, body: s => { s.body += ' Updated.'; },
    file: s => { s.attachments = [{ ...zip, id: 'replacement' }]; },
    to: s => { s.to = [...s.to, people[0]]; }, cc: s => { s.cc = [...s.cc, people[1]]; }, bcc: s => { s.bcc = [people[2]]; },
    insideSubject: s => { s.subject += ' revised'; }, insideBody: s => { s.body += ' Updated.'; },
    location: s => { s.location += ' revised'; }, attendee: s => { s.optionalAttendees = [...s.optionalAttendees, people[0]]; },
  };
  for (const [kind, edit] of Object.entries(edits)) {
    const meeting = ['location', 'attendee'].includes(kind), state = (meeting ? appointment : demo)({ body: CLEAN_BODY, attachments: [zip] });
    const l = load({ state, url: 'https://static.example/?dg=2&findings=ask&failures=ask' });
    await l.send(); const { node, tick } = await loadPane(l);
    state.attachments = [];
    if (kind.startsWith('inside')) state.cc = [];
    await node('check-again').listeners.click();
    assert.equal(node('pane').dataset.state, 'clear', kind);
    await tick(1500);assert.equal(node('pane').dataset.state, 'clear', kind + ' unchanged');
    edit(state);await tick(1500);
    assert.equal(node('pane').dataset.state, 'idle', kind);
    assert.match(node('line').textContent, /changed since the check/, kind);
    assert.doesNotMatch(node('foot').textContent, /passed the local check/, kind);
    assert.equal(node('check-again').hidden, false, kind);
  }
});

test('built pane catches same-name replacements, edits during a check, and a lost draft reader', async () => {
  const state = demo({ body: CLEAN_BODY, attachments: [zip] }), l = load({ state });await l.send();
  const { node, tick } = await loadPane(l);
  await node('check-again').listeners.click();
  state.attachments = [{ ...zip, id: 'same-name-new-id' }];await tick(1500);
  assert.equal(node('pane').dataset.state, 'idle');
  state.attachments = [];
  const reader = l.context.DisclosureGateDraft, original = reader.readDraft;
  reader.readDraft = async (...args) => { const d = await original(...args); if (args[1]) state.body += ' Edited during check.';return d; };
  await node('check-again').listeners.click();assert.equal(node('pane').dataset.state, 'idle');
  reader.readDraft = original;await node('check-again').listeners.click();assert.equal(node('pane').dataset.state, 'clear');
  reader.readDraft = async () => { throw new Error('synthetic read failure'); };await tick(1500);
  assert.equal(node('pane').dataset.state, 'idle');
});

test('built pane labels unbound failure phases as the last Send on reopen and phase updates', async () => {
  for (const phase of ['unavailable', 'too_large']) {
    const state = demo({ body: CLEAN_BODY }), l = load({ state, initialValues: { 'dg-phase': JSON.stringify({ phase, at: 1, result: { state: phase, reason: 'timeout', findings: [] } }) } });
    const { node, tick } = await loadPane(l);
    assert.match(node('notice').textContent, /^The last Send: /);assert.doesNotMatch(node('notice').textContent, /hasn't been sent/);
    assert.equal(node('check-again').hidden, phase === 'too_large');
    l.values['dg-phase'] = JSON.stringify({ phase: 'checking', at: 2 });await tick(400);
    assert.equal(node('pane').dataset.state, 'checking');
    l.values['dg-phase'] = JSON.stringify({ phase, at: 3, result: { state: phase, reason: 'read', findings: [] } });await tick(400);
    assert.match(node('notice').textContent, /^The last Send: /);
  }
});

test('built runtime and pane require an edit for whole-item and file size failures under either setting', async () => {
  for (const failures of ['ask', 'hold']) for (const meeting of [true, false]) for (const file of [true, false]) {
    const state = (meeting ? appointment : demo)({ body: file ? CLEAN_BODY : 'x'.repeat(500001), attachments: file ? [{ id: 'big', name: 'report.pdf', size: 10 * 1024 * 1024 + 1, attachmentType: 'file' }] : [] });
    const l = load({ state, markdown: true, url: `https://static.example/?dg=2&findings=hold&failures=${failures}` });
    const r = await l.send();assert.equal(r.allowEvent, false);assert.equal(r.sendModeOverride, failures === 'ask' ? 'promptUser' : undefined);
    assert.match(r.errorMessage, /Shorten it or split it, then press Send\./);assert.match(r.errorMessageMarkdown, /Shorten it or split it, then press Send\./);
    assert.doesNotMatch(r.errorMessage, /Press Send again to check it again|Don't Send and press Send/);
    const { node } = await loadPane(l);assert.equal(node('check-again').hidden, true);assert.match(node('notice').textContent, /Shorten it or split it, then press Send\./);
  }
});

test('a new Send phase retires an advisory pane pass', async () => {
  const state = demo({ body: CLEAN_BODY, attachments: [zip] }), l = load({ state });await l.send();
  const { node, tick } = await loadPane(l);state.attachments = [];
  await node('check-again').listeners.click();assert.equal(node('pane').dataset.state, 'clear');
  l.values['dg-phase'] = JSON.stringify({ phase: 'checking', at: Date.now() + 1000 });await tick(400);
  assert.equal(node('pane').dataset.state, 'checking');assert.doesNotMatch(node('foot').textContent, /passed the local check/);
});
