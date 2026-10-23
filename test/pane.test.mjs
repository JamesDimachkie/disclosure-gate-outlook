import test from 'node:test';
import assert from 'node:assert/strict';
import { recipientCardLive } from '../outlook/pane-logic.mjs';
import { checkDraft } from '../core/gate.mjs';
import { CONFIG, JOHN, KATE, CLEAN_BODY } from './helpers.mjs';

test('recipient cards that name several addresses stay in Review while any of them is on the draft', async () => {
  const people = Array.from({ length: 8 }, (_, i) => ({ name: `P${i}`, address: `p${i}@${['clientco', 'apexbuild', 'cityworks'][i % 3]}.example`, kind: 'person' }));
  const r = await checkDraft({ from: JOHN, to: [KATE, ...people], cc: [], bcc: [], subject: 'Update', body: { text: CLEAN_BODY, format: 'text' }, attachments: [] }, { config: CONFIG });
  const exposed = r.findings.find((f) => f.subkind === 'exposed');
  const addresses = [KATE, ...people].map((p) => p.address.toLowerCase());
  assert.ok(recipientCardLive(exposed, addresses));
  assert.ok(recipientCardLive(exposed, addresses.slice(0, 2)));
  assert.equal(recipientCardLive(exposed, [KATE.address]), false);
  const two = await checkDraft({ from: JOHN, to: [{ address: 'a@north1ine.example' }, { address: 'b@northline-billing.example' }], cc: [], bcc: [], subject: 'x', body: { text: CLEAN_BODY, format: 'text' }, attachments: [] }, { config: CONFIG });
  for (const f of two.findings.filter((x) => x.source === 'recipient')) assert.ok(recipientCardLive(f, ['a@north1ine.example', 'b@northline-billing.example']), JSON.stringify(f.recipients));
});
