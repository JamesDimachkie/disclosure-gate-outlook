import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDomains, classifyRecipient, classifyRecipients, reachOf, checkableAddress } from '../core/recipients.mjs';

const domains = normalizeDomains(['Northline.example']);

test('inside is an exact match on an admin domain; everything else is outside', () => {
  const reach = (address) => classifyRecipient({ address, kind: 'person' }, domains).reach;
  assert.equal(reach('kate@northline.example'), 'inside');
  assert.equal(reach('Kate@NORTHLINE.EXAMPLE'), 'inside');
  assert.equal(reach('dan@whitfielddev.example'), 'outside');
  // Lookalikes named in the spec, plus a subdomain and a suffix trick.
  assert.equal(reach('kate@northline.example.co'), 'outside');
  assert.equal(reach('kate@north1ine.example'), 'outside');
  assert.equal(reach('kate@mail.northline.example'), 'outside');
  assert.equal(reach('kate@xnorthline.example'), 'outside');
  assert.equal(reach('kate@xn--nrthline-2ng.example'), 'outside');
});

test('groups and addresses that cannot be checked are their own class', () => {
  assert.equal(classifyRecipient({ address: 'all@northline.example', kind: 'group' }, domains).reach, 'unknown');
  // A Cyrillic "о" is not a checkable ASCII address, so it is never inside.
  assert.equal(classifyRecipient({ address: 'kate@nоrthline.example', kind: 'person' }, domains).reach, 'unknown');
  for (const bad of ['', 'Kate Morgan', 'kate@', '@northline.example', 'kate@northline', 'a b@northline.example', '<kate@northline.example>']) {
    assert.equal(classifyRecipient({ address: bad, kind: 'person' }, domains).reach, 'unknown', bad);
  }
  assert.equal(checkableAddress('  dan@whitfielddev.example '), 'dan@whitfielddev.example');
});

test('outside recipients are listed first, then can\'t check, then inside; each keeps its field', () => {
  const draft = { to: [{ name: 'Kate Morgan', address: 'kate@northline.example', kind: 'person' }],
    cc: [{ name: 'Dan Whitfield', address: 'dan@whitfielddev.example', kind: 'person' }],
    bcc: [{ name: 'Site team', address: 'site@northline.example', kind: 'group' }, { name: 'Priya', address: 'priya@northline.example', kind: 'person' }] };
  const list = classifyRecipients(draft, domains);
  assert.deepEqual(list.map((r) => [r.name, r.reach, r.field]), [
    ['Dan Whitfield', 'outside', 'cc'], ['Site team', 'unknown', 'bcc'], ['Kate Morgan', 'inside', 'to'], ['Priya', 'inside', 'bcc']]);
  assert.equal(reachOf(list), 'outside');
  assert.equal(reachOf(list.filter((r) => r.reach !== 'outside')), 'unknown');
  assert.equal(reachOf(list.filter((r) => r.reach === 'inside')), 'inside');
});

test('the admin list is validated so a typo never makes everyone inside', () => {
  for (const bad of [[], [''], ['*'], ['northline'], ['north line.example'], ['.example'], [null]]) assert.throws(() => normalizeDomains(bad));
  assert.deepEqual(normalizeDomains(['b.example', 'A.example', 'a.example']), ['a.example', 'b.example']);
});
