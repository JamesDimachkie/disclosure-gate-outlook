import test from 'node:test';
import assert from 'node:assert/strict';
import { removeSentenceFromHtml, removeSentenceFromText, htmlText } from '../core/remove.mjs';

const S1 = "Kate — North Hall's tracking triple the margin we bid.";
const S2 = "If Dan pushes on CO 12, we've got room.";
// Shaped like a new message body in Outlook on the web (synthetic).
const owa = (inner) => `<html><head>\r\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\r\n<style type="text/css" style="display:none;"> P {margin-top:0;margin-bottom:0;} </style>\r\n</head>\r\n<body dir="ltr">\r\n<div class="elementToProof" style="font-family: Aptos, Aptos_EmbeddedFont, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">\r\n${inner}</div>\r\n</body>\r\n</html>\r\n`;
const visible = (html) => htmlText(html).map((c) => (c.from < 0 ? '\n' : c.ch)).join('').replace(/\s+/g, ' ').trim();

test('Remove this sentence, twice, on the demo body leaves only markup behind', () => {
  const html = owa(`${S1} ${S2}`);
  const first = removeSentenceFromHtml(html, S1, 0);
  assert.equal(first.ok, true);
  assert.equal(first.html, owa(S2));
  const second = removeSentenceFromHtml(first.html, S2, 0);
  assert.equal(second.html, owa(''));
  assert.equal(visible(second.html), '');
});

test('removing the second sentence takes the space before it, not the first sentence\'s period', () => {
  assert.equal(removeSentenceFromHtml(owa(`${S1} ${S2}`), S2, 0).html, owa(S1));
});

test('inline markup inside the sentence keeps its tags; only the characters go', () => {
  const html = owa(`Kate — North Hall's tracking <b>triple the margin</b> we bid. ${S2}`);
  assert.equal(removeSentenceFromHtml(html, S1, 0).html, owa(`<b></b>${S2}`));
});

test('entities, a non-breaking space and a curly apostrophe are matched and removed whole', () => {
  const html = owa(`Kate &mdash; North Hall&#39;s tracking triple the margin we bid.&nbsp;If Dan pushes on CO 12, we’ve got room.`);
  const out = removeSentenceFromHtml(html, S1, 0);
  assert.equal(out.ok, true);
  assert.equal(out.html, owa('If Dan pushes on CO 12, we’ve got room.'));
  assert.equal(removeSentenceFromHtml(html, S2, 0).ok, false, 'a straight apostrophe is a different sentence from a curly one');
});

test('a sentence the source wraps across lines is still one sentence', () => {
  const html = owa(`Kate — North Hall's tracking triple\r\nthe margin we bid. ${S2}`);
  assert.equal(removeSentenceFromHtml(html, S1, 0).html, owa(S2));
});

test('the occurrence picks which of two equal sentences goes', () => {
  const html = owa(`<p>Call me.</p><p>The gate is fine.</p><p>Call me.</p>`);
  assert.equal(removeSentenceFromHtml(html, 'Call me.', 1).html, owa(`<p>Call me.</p><p>The gate is fine.</p><p></p>`));
  assert.equal(removeSentenceFromHtml(html, 'Call me.', 2).ok, false);
});

test('a sentence in the quoted thread is removed there; the signature and separators stay', () => {
  const quoted = `<div>Thanks.</div><div id="appendonsend"></div><hr style="display:inline-block;width:98%" tabindex="-1"><div id="divRplyFwdMsg" dir="ltr"><b>From:</b> Dan Whitfield</div><div>Gate code's still 4417. See you Monday.</div>`;
  const out = removeSentenceFromHtml(owa(quoted), "Gate code's still 4417.", 0);
  assert.equal(out.html, owa(quoted.replace("Gate code's still 4417. ", '')));
});

test('text inside head, style and script is never matched', () => {
  const html = `<html><head><title>${S1}</title><style>/* ${S1} */</style></head><body><script>var s = "${S1}";</script><div>Hello.</div></body></html>`;
  assert.equal(removeSentenceFromHtml(html, S1, 0).ok, false);
});

test('a sentence that is not there changes nothing', () => {
  const html = owa(S2);
  const out = removeSentenceFromHtml(html, S1, 0);
  assert.deepEqual(out, { ok: false, reason: 'not_found' });
});

test('plain text: the sentence and its joining space go; an emptied line goes with its break', () => {
  assert.deepEqual(removeSentenceFromText(`${S1} ${S2}`, S1), { ok: true, text: S2 });
  assert.deepEqual(removeSentenceFromText(`${S1} ${S2}`, S2), { ok: true, text: S1 });
  assert.deepEqual(removeSentenceFromText(`Hi Dan,\r\n${S1}\r\nThanks`, S1), { ok: true, text: 'Hi Dan,\r\nThanks' });
  assert.deepEqual(removeSentenceFromText(`Hi Dan,\n${S2}`, S2), { ok: true, text: 'Hi Dan,' });
  assert.deepEqual(removeSentenceFromText('North Hall: our margin is 22%', 'North Hall: our margin is 22%'), { ok: true, text: '' });
  assert.equal(removeSentenceFromText('Nothing here.', S1).ok, false);
});
