import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { STRINGS, dialogContent, describeResult, failureReason, heldMessage, mentionFor, labelFor, whyFor, CATEGORIES, copyForItem } from '../core/copy.mjs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const findings = [{ category: 'access', subkind: 'password', source: 'body' }, { category: 'financial', subkind: 'card', source: 'attachment', file: 'invoice.pdf' }];
test('the four dialog shapes have the approved words and plain equivalents', () => {
  for (const ask of [true, false]) {
    const found = dialogContent({ state: 'held', findings }, { ask });
    assert.equal(found.errorMessageMarkdown, "**This email goes outside your company and includes a password and a card number.**\n\n- In the body: a password\r- In invoice.pdf: a card number\r\n\n" + (ask ? "If you're sure, choose **Send Anyway**. To see each one and fix it, choose **Review**." : "It hasn't been sent. Choose **Review** to see what to change, then press Send again."));
    assert.equal(found.errorMessage, "This email goes outside your company and includes a password and a card number. In the body: a password. In invoice.pdf: a card number. " + (ask ? "If you're sure, choose Send Anyway. To see each one and fix it, choose Review." : "It hasn't been sent. Choose Review to see what to change, then press Send again."));
    const failed = dialogContent({ state: 'unavailable', reason: 'timeout', findings: [] }, { ask });
    assert.equal(failed.errorMessageMarkdown, "**Disclosure Gate couldn't check this email.**\n\nIt took too long.\n\n" + (ask ? "If you're sure about what it contains, choose **Send Anyway**. To check it again, choose **Don't Send** and press Send." : "It hasn't been sent. Press Send again to check it again, or ask your IT team."));
    assert.equal(failed.errorMessage, "Disclosure Gate couldn't check this email. It took too long. " + (ask ? "If you're sure about what it contains, choose Send Anyway. To check it again, choose Don't Send and press Send." : "It hasn't been sent. Press Send again to check it again, or ask your IT team."));
  }
});

test('size failures require shortening or splitting in Ask and Hold, including mixed file findings', () => {
  for (const ask of [true, false]) for (const reviewButton of [true, false]) for (const itemType of ['message', 'appointment']) {
    const sizeFile = { category: 'attachment', source: 'attachment', file: 'report.pdf', subkind: 'too_long' };
    for (const result of [{ state: 'too_large', findings: [] }, { state: 'held', findings: [sizeFile] }, { state: 'held', findings: [...findings, sizeFile] }]) {
      const content = dialogContent({ ...result, itemType }, { ask, reviewButton });
      for (const text of Object.values(content)) {
        assert.match(text, /Shorten it or split it, then press Send\./);
        assert.doesNotMatch(text, /Press Send again to check it again|Don't Send\*?\*? and press Send/);
        assert.ok(text.length <= 500, text.length);
      }
      assert.equal(content.errorMessage.includes('Send Anyway'), ask);
    }
  }
});

test('recipient dialog bullets count exposed lists and show only lookalike addresses; plain more starts a sentence', () => {
  const recipients = Array.from({ length: 8 }, (_, i) => `p${i}@outside.example`);
  const exposed = { category: 'recipient', subkind: 'exposed', source: 'recipient', severity: 'prompt', recipients };
  const lookalike = { category: 'recipient', subkind: 'lookalike', source: 'recipient', recipients: ['a@north1ine.example', 'b@north1ine.example'] };
  for (const itemType of ['message', 'appointment']) {
    const r = dialogContent({ state: 'held', itemType, findings: [exposed, lookalike, ...findings] });
    assert.match(r.errorMessageMarkdown, itemType === 'message' ? /- In To and Cc: 8 outside addresses\r/ : /- In the attendee list: 8 outside attendees\r/);
    assert.match(r.errorMessageMarkdown, /- a@north1ine\.example, b@north1ine\.example\r/);
    assert.match(r.errorMessage, /\. And 1 more\./);assert.doesNotMatch(r.errorMessage, /\. and 1 more/);
    assert.doesNotMatch(r.errorMessageMarkdown, /p0@|north1ine\.example:/);
  }
});

test('unknown failure reasons say the local check did not finish and preserve specific known reasons', () => {
  for (const reason of ['config', 'invalid_sender', 'invalid_attachments', 'new_reason', 'constructor', '__proto__', undefined]) {
    assert.equal(failureReason({ state: 'unavailable', reason }), "The local check didn't finish.");
    assert.match(dialogContent({ state: 'unavailable', reason }).errorMessage, /The local check didn't finish\./);
  }
  for (const [reason, text] of Object.entries({ timeout: 'It took too long.', read: "Outlook didn't let it read the draft.", changed: 'The draft changed during the check.', ocr_pending: 'An image is still being read.' })) assert.equal(failureReason({ reason }), text);
});

test('unknown settings use neutral instructions in every dialog shape and fit the dialog budget', () => {
  const config = { findings: 'hold', failures: 'hold', settingsKnown: false };
  for (const itemType of ['message', 'appointment']) for (const canOverride of [true, false]) for (const result of [
    { state: 'held', findings }, { state: 'unavailable', reason: 'read', findings: [] }, { state: 'too_large', findings: [] },
    { state: 'held', findings: Array.from({ length: 100 }, () => ({ ...findings[1], file: 'a'.repeat(245) + '.pdf' })) },
  ]) {
    const r = describeResult({ ...result, itemType }, config, { canOverride, reviewButton: canOverride });
    for (const text of [r.message, r.markdown, r.fallbackMessage]) {
      assert.match(text.replace(/\*\*/g, ''), /If Send Anyway is offered and you're sure, choose it; otherwise choose Don't Send, fix it and press Send\./);
      assert.doesNotMatch(text, /hasn't been sent/);assert.ok(text.length <= 500, `${text.length}: ${text}`);
    }
  }
});

test('landing and README describe flags and failures without claiming an automatic hold', () => {
  for (const path of ['../outlook/index.html', '../README.md']) {
    assert.match(read(path), /Ordinary emails asked about/);
    assert.doesNotMatch(read(path), /Ordinary emails held by mistake|are held as "can't check"/);
  }
  assert.match(read('../outlook/index.html'), /pending OCR or incomplete PDF coverage follows IT's failures setting/);
  assert.match(read('../outlook/index.html'), /unreadable attached or embedded picture asks the sender to look, with Send Anyway/);
});

function strings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (value && typeof value === 'object') for (const v of Object.values(value)) strings(v, out);
  return out;
}
test('every word the sender sees follows the unchanged copy rules', () => {
  const all = strings(STRINGS);
  const subkinds = ['margin', 'cost', 'other', 'code', 'password', 'security', 'secret', 'private-key', 'connection', 'card', 'bank', 'ssn', 'ni', 'sin', 'passport', 'licence', 'tax', 'national-id', 'lookalike', 'exposed'];
  for (const c of CATEGORIES) for (const sub of subkinds) all.push(mentionFor({ category: c, subkind: sub, codeKind: 'gate' }), labelFor({ category: c, subkind: sub }), whyFor({ category: c, subkind: sub }));
  all.push(...all.map(s => copyForItem(s, 'appointment')));
  for (const reach of ['outside', 'unknown']) for (const reviewButton of [true, false]) all.push(heldMessage(findings, { reach, reviewButton, itemType: 'appointment' }));
  for (const s of all) {
    assert.ok(!/\b(?:blocked|block|violation|violations|policy breach)\b/i.test(s), 'banned word: ' + s);
    assert.ok(!s.includes('!'), 'exclamation mark: ' + s);
    assert.ok(!s.includes('—'), 'em dash: ' + s);
    assert.ok(!/[‘’“”]/.test(s), 'curly quote: ' + s);
    assert.ok(!/\s{2,}/.test(s), 'double space: ' + s);
    assert.ok(/^[A-Z{]/.test(s) || /^(?:mentions|includes|and|click|a |an )/.test(s), 'sentence case: ' + s);
  }
  assert.ok(Object.isFrozen(STRINGS) && Object.isFrozen(STRINGS.labels) && Object.isFrozen(STRINGS.dialog));
});

test('handler uses the copy module; generated dev manifest has the default settings and identity', () => {
  const handler = read('../outlook/handler.js'), manifest = read('../outlook/manifest.xml');
  assert.match(handler, /core.describeResult/);
  assert.ok(manifest.includes('<DisplayName DefaultValue="' + STRINGS.name + '"/>'));
  assert.ok(manifest.includes('<bt:String id="Pane.Label" DefaultValue="' + STRINGS.ribbon.label + '"/>'));
  assert.ok(manifest.includes('<bt:String id="Pane.Tip" DefaultValue="' + STRINGS.ribbon.tip + '"/>'));
  for (const text of [manifest, handler, read('../outlook/taskpane.html'), read('../outlook/taskpane.mjs')]) assert.doesNotMatch(text, /\bviolation|policy breach\b/i);
  assert.match(manifest, /<LaunchEvent Type="OnMessageSend" FunctionName="onMessageSendHandler" SendMode="PromptUser"\/>/);
  assert.match(manifest, /<LaunchEvent Type="OnAppointmentSend" FunctionName="onAppointmentSendHandler" SendMode="PromptUser"\/>/);
  assert.equal((manifest.match(/<LaunchEvent /g) || []).length, 6);
  assert.match(manifest, /<Control xsi:type="Button" id="dgOpenPane">/);
  assert.match(manifest, /<Id>cf4aa3ad-2656-4bc5-a8c1-ae4734bf4b32<\/Id>/);
  assert.match(manifest, /findings=ask&amp;failures=ask/);
  assert.match(manifest, /<Permissions>ReadWriteItem<\/Permissions>/);
  for (const url of manifest.match(/https:\/\/[^"]+/g)) assert.ok(url.startsWith('https://localhost:3443/'), url);
});

test('a wrong-recipient finding is listed first in the dialog, ahead of what the email contains', () => {
  const found = [{ category: 'economics', subkind: 'margin', source: 'body' }, { category: 'negotiation', subkind: 'other', source: 'body' },
    { category: 'access', subkind: 'code', source: 'body' }, { category: 'recipient', subkind: 'greeting', source: 'recipient', greeted: 'Kate', recipients: ['dan@whitfielddev.example'] }];
  const { errorMessageMarkdown } = dialogContent({ state: 'held', findings: found }, { ask: true });
  const bullets = errorMessageMarkdown.split('\n').filter((l) => l.startsWith('- '));
  assert.match(bullets[0], /Greets Kate, sent to dan@whitfielddev\.example/);
  assert.match(bullets.at(-1), /and 1 more/);
});
