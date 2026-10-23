import test from 'node:test';
import assert from 'node:assert/strict';
import { domainToASCII, domainToUnicode } from 'node:url';
import { lookalikeReason, recipientFindings, punycodeDecode, unicodeDomain, skeleton, editDistance, splitDomain } from '../core/recipient-checks.mjs';
import { normalizeDomains, classifyRecipients } from '../core/recipients.mjs';

const INSIDE = ['northline.com'];
const reason = (domain, inside = INSIDE) => inside.map((i) => lookalikeReason(domain, i)).find(Boolean) ?? null;

test('punycode decodes as the URL standard does, and domains split on their public suffix', () => {
  for (const u of ['nоrthline.com', 'nörthline.com', 'northlіne.co.uk', 'bücher.example', '例え.jp', 'северлайн.рф']) {
    const ascii = domainToASCII(u);
    assert.ok(ascii.includes('xn--'), ascii);
    assert.equal(unicodeDomain(ascii), domainToUnicode(ascii), ascii);
  }
  assert.equal(punycodeDecode('mnchen-3ya'), 'münchen');
  assert.equal(punycodeDecode('!!'), null);
  assert.deepEqual(splitDomain('mail.northline.co.uk'), { label: 'northline', suffix: 'co.uk', registrable: 'northline.co.uk' });
  assert.deepEqual(splitDomain('northline.com'), { label: 'northline', suffix: 'com', registrable: 'northline.com' });
  assert.equal(skeleton('NORTH1INE'), skeleton('northline'));
  assert.equal(skeleton('surnmit'), skeleton('summit'));
  assert.equal(editDistance('northline', 'nortlhine'), 1);
  assert.equal(editDistance('northline', 'southline'), 2);
});

test('lookalikes of an inside domain: edits, look-alike characters, other suffixes, impersonation words', () => {
  const cases = {
    'north1ine.com': 'homoglyph', 'n0rthline.com': 'homoglyph', 'northIine.com': 'homoglyph', [domainToASCII('nоrthline.com')]: 'homoglyph', 'nоrthline.com': 'homoglyph',
    [domainToASCII('nörthline.com')]: 'homoglyph', 'nortline.com': 'typo', 'northlinne.com': 'typo', 'nortlhine.com': 'typo', 'northlines.com': 'typo',
    'nrothline.com': 'typo', 'north-line.com': 'typo', 'n0rthlime.com': 'typo', 'northline.co': 'suffix', 'northline.net': 'suffix', 'northline.com.au': 'suffix',
    'northline.com.evil.example': 'extended', 'northline-billing.com': 'affix', 'securenorthline.com': 'affix', 'northline-support.net': 'affix',
  };
  for (const [domain, why] of Object.entries(cases)) assert.equal(reason(domain), why, domain);
  // The spec's three pairs: rn for m, vv for w, cl for d.
  assert.equal(reason('surnmitworks.com', ['summitworks.com']), 'homoglyph');
  assert.equal(reason('vvestway.co.uk', ['westway.co.uk']), 'homoglyph');
  assert.equal(reason('dadding-pros.com', ['cladding-pros.com']), 'homoglyph');
  // Short labels: one edit at 4 or 5 characters, none at 3 or fewer.
  assert.equal(reason('acne.com', ['acme.com']), 'typo');
  assert.equal(reason('acrne.com', ['acme.com']), 'homoglyph');
  assert.equal(reason('acmme.com', ['acme.com']), 'typo');
  assert.equal(reason('acrnes.com', ['acme.com']), 'typo');
  assert.equal(reason('ibx.com', ['ibm.com']), null);
  assert.equal(reason('ibm.co', ['ibm.com']), 'suffix');
  assert.equal(reason('lbm.com', ['ibm.com']), 'homoglyph');
});

test('not lookalikes: the inside domain itself, its subdomains, mail providers, namesakes and different words', () => {
  for (const domain of ['northline.com', 'mail.northline.com', 'eu.mail.northline.com', 'gmail.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'whitfielddev.com',
    'northline-group.com', 'northlinegroup.com', 'northline-construction.com', 'northstar.com', 'southline.com', 'northside.com', 'northern.com', 'line.com',
    'harborline.com', 'clientco.example', 'example.com']) {
    assert.equal(reason(domain), null, domain);
  }
  // Two inside domains of one organization, and a parent of an inside subdomain.
  assert.equal(reason('northline.com', ['eu.northline.com']), null);
  assert.equal(reason('us.northline.com', ['eu.northline.com']), null);
  assert.equal(reason('gmail.com', ['gmall.com']), null);
});

const r = (address, field = 'to', kind = 'person') => ({ address, field, kind });
const classify = (list, domains = ['northline.com']) => classifyRecipients({ to: list.filter((x) => x.field === 'to'), cc: list.filter((x) => x.field === 'cc'), bcc: list.filter((x) => x.field === 'bcc') }, normalizeDomains(domains));

test('a lookalike address gives one stop finding naming it, wherever it sits', () => {
  const list = classify([r('kate@northline.com'), r('dan@whitfielddev.com', 'cc'), r('accounts@north1ine.com', 'bcc')]);
  const f = recipientFindings(list, ['northline.com']);
  assert.equal(f.length, 1);
  assert.deepEqual(f[0], { category: 'recipient', subkind: 'lookalike', source: 'recipient', severity: 'stop', recipients: ['accounts@north1ine.com'], resembles: ['northline.com'],
    sentence: { text: 'accounts@north1ine.com', index: -1, occurrence: 0, start: 0, end: 22 }, marks: [], found_by: 'recipients' });
  // A Cyrillic address can't be checked as an address, but its domain is still read.
  const cyr = recipientFindings(classify([r('kate@nоrthline.com')]), ['northline.com']);
  assert.equal(cyr[0]?.subkind, 'lookalike');
  assert.deepEqual(recipientFindings(classify([r('kate@northline.com'), r('dan@whitfielddev.com')]), ['northline.com']), []);
  const two = recipientFindings(classify([r('a@northline.co'), r('b@nortline.com', 'cc'), r('c@northline.co')]), ['northline.com']);
  // In the pane's order: To, then Cc, then Bcc.
  assert.deepEqual(two[0].recipients, ['a@northline.co', 'c@northline.co', 'b@nortline.com']);
  assert.equal(two[0].sentence.text, 'a@northline.co, c@northline.co, b@nortline.com');
});

test('an exposed list: 8 or more outside addresses in To and Cc from 3 or more domains, severity prompt', () => {
  const outside = (n, domains) => Array.from({ length: n }, (_, i) => r(`p${i}@${domains[i % domains.length]}`, i % 2 ? 'cc' : 'to'));
  const three = ['clientco.example', 'apexbuild.example', 'cityworks.example'];
  const f = recipientFindings(classify([r('kate@northline.com'), ...outside(8, three)]), ['northline.com']);
  assert.equal(f.length, 1);
  assert.deepEqual([f[0].subkind, f[0].severity, f[0].recipients.length], ['exposed', 'prompt', 8]);
  assert.equal(f[0].sentence.text, 'p0@clientco.example, p2@cityworks.example, p4@apexbuild.example and 5 more');
  assert.equal(recipientFindings(classify(outside(7, three)), ['northline.com']).length, 0, 'seven is not a list');
  assert.equal(recipientFindings(classify(outside(12, three.slice(0, 2))), ['northline.com']).length, 0, 'two domains is a meeting with one client');
  // Bcc is the fix, so Bcc never counts; inside people and repeats never count.
  const bcc = [...outside(7, three), r('x@clientco.example', 'bcc'), r('y@other.example', 'bcc')];
  assert.equal(recipientFindings(classify(bcc), ['northline.com']).length, 0);
  const repeats = [...outside(7, three), r('p0@clientco.example', 'cc'), r('kate@northline.com', 'cc')];
  assert.equal(recipientFindings(classify(repeats), ['northline.com']).length, 0);
  assert.equal(recipientFindings(classify(outside(8, three)), ['northline.com'], { more: '{list} plus {n}' })[0].sentence.text.endsWith('plus 5'), true);
});

test('an admin-trusted outside domain skips only the lookalike check; its email is still screened', async () => {
  const { checkDraft } = await import('../core/gate.mjs');
  const base = { from: { address: 'kim@accenture.example' }, to: [{ address: 'lee@accentcare.example' }], cc: [], bcc: [], subject: 'Hi', attachments: [] };
  const plainBody = { text: 'See you Tuesday at 10.', format: 'text' };
  assert.equal((await checkDraft({ ...base, body: plainBody }, { config: {} })).findings[0]?.subkind, 'lookalike');
  assert.equal((await checkDraft({ ...base, body: plainBody }, { config: { trustedDomains: ['accentcare.example'] } })).state, 'clear');
  const secret = await checkDraft({ ...base, body: { text: 'The password is Tr4ctor!22.', format: 'text' } }, { config: { trustedDomains: ['accentcare.example'] } });
  assert.equal(secret.state, 'held');
  assert.ok(secret.findings.every((f) => f.subkind !== 'lookalike'));
});
// SPEC 5.8 states the lookalike rule the code implements; every example in it behaves as written.
test('the examples in SPEC 5.8 behave as the spec says', () => {
  const yes = { 'northline.com.evil.io': 'extended', 'northline.com.co': 'suffix', 'northline.co': 'suffix', 'northline.com.au': 'suffix', 'north1ine.com': 'homoglyph',
    'xn--nrthline-nbh.com': 'homoglyph', 'northlinne.com': 'typo', 'nortlhine.com': 'typo', 'northline-billing.com': 'affix', 'securenorthline.com': 'affix' };
  for (const [domain, why] of Object.entries(yes)) assert.equal(reason(domain), why, domain);
  for (const domain of ['southline.com', 'northside.com', 'narthlane.com', 'northline-group.com', 'mail.northline.com', 'gmail.com']) assert.equal(reason(domain), null, domain);
  // A name of 3 characters gets no typing allowance; 4 or 5 characters get one change.
  assert.equal(reason('abd.com', ['abc.com']), null);
  assert.equal(reason('abc.co', ['abc.com']), 'suffix');
  assert.equal(reason('acmee.com', ['acme.com']), 'typo');
  assert.equal(reason('acmeee.com', ['acme.com']), null);
});
