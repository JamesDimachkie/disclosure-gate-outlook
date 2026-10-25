import test from 'node:test';
import assert from 'node:assert/strict';
import { attachmentText, decodeText } from '../core/attachments.mjs';
import { checkDraft, decisionFor } from '../core/gate.mjs';

test('UTF-16 TXT/CSV must consume whole code units in either byte order', async () => {
  for (const be of [false, true]) {
    const text = 'Synthetic text \u00e9 \ud83d\ude80';
    const body = Buffer.from(text, 'utf16le'); if (be) body.swap16();
    const bytes = Buffer.concat([Buffer.from(be ? [0xfe, 0xff] : [0xff, 0xfe]), body]);
    assert.equal(decodeText(bytes), text);
    assert.equal(decodeText(Buffer.from(be ? [0xfe, 0xff] : [0xff, 0xfe])), '');
    for (const kind of ['txt', 'csv']) {
      const invalid = [Buffer.concat([bytes, Buffer.from([0x42])])];
      for (const units of [[0xd800], [0xdc00], [0xd800, 0x41], [0xdc00, 0xdc00]]) {
        const tail = Buffer.alloc(units.length * 2); units.forEach((v, i) => tail.writeUInt16LE(v, i * 2)); if (be) tail.swap16();
        invalid.push(Buffer.concat([bytes, tail]));
      }
      for (const broken of invalid) {
        const a = { id: 't', name: 'synthetic.' + kind, type: 'file', size: broken.length, content: broken.toString('base64') };
        assert.deepEqual(attachmentText(a), { ok: false, reason: 'bad_encoding' });
        const config = { internalDomains: ['sender.example'] };
        const r = await checkDraft({ from: { address: 'sender@sender.example' }, to: [{ address: 'recipient@outside.example' }], cc: [], bcc: [], subject: '', body: { text: '', format: 'text' }, attachments: [a] }, { config });
        assert.equal(r.state, 'held'); assert.equal(decisionFor(r, config).outcome, 'ask');
      }
    }
  }
});
