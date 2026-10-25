import test from 'node:test';
import assert from 'node:assert/strict';
import { sha256 } from '../core/sha256.mjs';
import { checkDraft, snapshotOf } from '../core/gate.mjs';
import { STRINGS } from '../core/copy.mjs';
import { CONFIG, KATE, DAN, CLEAN_BODY, draft, PNG_B64, PNG_SIZE } from './helpers.mjs';

const SPEC_B_TWO = "This email goes outside your company and includes your margin and your negotiating position. In the body: your margin. In the body: your negotiating position. If you're sure, choose Send Anyway. To see each one and fix it, choose Review.";

test('E1: the demo email to Kate with Dan in Cc is held with two findings in order, locally', async () => {
  const r = await checkDraft(draft(), { config: CONFIG });
  assert.equal(r.state, 'held');
  assert.deepEqual(r.findings.map((f) => [f.label, f.why]), [['Internal economics', 'Margins and costs stay inside the company.'], ['Negotiation position', 'Your room to negotiate stays inside the company.']]);
  assert.deepEqual(r.findings.map((f) => f.marks.map((m) => f.sentence.text.slice(m.start, m.end))), [['triple the margin we bid'], ["If Dan pushes on CO 12, we've got room"]]);
  assert.equal(r.message, SPEC_B_TWO);
  assert.match(r.fallbackMessage, /choose Send Anyway\. Open Guardcell from the ribbon to see why\.$/);
  assert.deepEqual(r.recipients.map((x) => [x.name, x.label]), [['Dan Whitfield', 'Outside'], ['Kate Morgan', 'Inside']]);
  assert.ok(r.findings.every((f) => f.removable && f.place === null));
});

test('one finding reads exactly as the spec message', async () => {
  const r = await checkDraft(draft({ body: { text: "Kate — North Hall's tracking triple the margin we bid.", format: 'html' } }), { config: CONFIG });
  assert.equal(r.message, "This email goes outside your company and includes your margin. In the body: your margin. If you're sure, choose Send Anyway. To see each one and fix it, choose Review.");
});

test('E2: the same body to Kate only is clear and nothing is sent anywhere', async () => {
  const r = await checkDraft(draft({ cc: [] }), { config: CONFIG });
  assert.equal(r.state, 'clear');
  assert.deepEqual(r.findings, []);
});

test('E4: a clean body to Dan with site-photos.zip is held on the attachment, without the hosted check', async () => {
  const r = await checkDraft(draft({ to: [DAN], cc: [], body: { text: CLEAN_BODY, format: 'html' }, attachments: [{ id: 'att1', name: 'site-photos.zip', size: 48213, isInline: false, type: 'file' }] }), { config: CONFIG });
  assert.equal(r.state, 'held');
  assert.deepEqual(r.findings.map((f) => [f.label, f.sentence.text, f.why, f.removable]), [["Can't check this attachment", 'site-photos.zip', "Guardcell couldn't read this file. Check what it contains before sending.", false]]);
  assert.equal(r.message, "Guardcell couldn't check this email. site-photos.zip couldn't be read. If you're sure about what it contains, choose Send Anyway. To check it again, choose Don't Send and press Send.");
});

test('the dialog names the first finding and counts the rest', async () => {
  const body = "Our margin is 22% on this. Gate code's still 4417. Their PM is a moron.";
  const r = await checkDraft(draft({ to: [DAN], cc: [], body: { text: body, format: 'text' } }), { config: CONFIG });
  assert.match(r.message, /includes your margin and a gate code\. In the body: your margin\. In the body: a gate code\. In the body: a remark about a person\./);
  const code = await checkDraft(draft({ to: [DAN], cc: [], body: { text: "Gate code's still 4417.", format: 'text' } }), { config: CONFIG });
  assert.match(code.message, /includes a gate code\. In the body: a gate code\./);
});

test("a group that can't be expanded is held like outside, with its own words", async () => {
  const group = { name: 'All staff', address: 'all@northline.example', kind: 'group' };
  const r = await checkDraft(draft({ to: [KATE], cc: [group] }), { config: CONFIG });
  assert.equal(r.state, 'held');
  assert.equal(r.reach, 'unknown');
  assert.deepEqual(r.recipients.map((x) => x.label), ["Can't check", 'Inside']);
  assert.ok(r.message.startsWith('This email may go outside your company and includes your margin'));
});

test('a readable attachment is checked; a finding inside it says where it is and has no removal', async () => {
  const content = Buffer.from('Summary\nOur margin on this project is 18 percent.\n').toString('base64');
  const r = await checkDraft(draft({ to: [DAN], cc: [], body: { text: CLEAN_BODY, format: 'html' }, attachments: [{ id: 'a', name: 'costs.txt', size: 50, isInline: false, type: 'file', content }] }), { config: CONFIG });
  assert.deepEqual(r.findings.map((f) => [f.label, f.place, f.removable, f.sentence.text]), [['Internal economics', 'In costs.txt', false, 'Our margin on this project is 18 percent.']]);
});

test('a readable file with no content from Outlook, an attached email or a cloud link can\'t be checked', async () => {
  const atts = [{ id: 'a', name: 'notes.txt', size: 10, isInline: false, type: 'file' }, { id: 'b', name: 'Fwd: bid.eml', size: 900, type: 'item' }, { id: 'c', name: 'plans.pdf', size: 1, type: 'cloud' }];
  const r = await checkDraft(draft({ to: [DAN], cc: [], body: { text: CLEAN_BODY, format: 'html' }, attachments: atts }), { config: CONFIG });
  assert.deepEqual(r.findings.map((f) => f.sentence.text), ['notes.txt', 'Fwd: bid.eml', 'plans.pdf']);
});

test('the digest binds recipients, subject, body, format and attachments', () => {
  const domains = ['northline.example'];
  const base = snapshotOf(draft(), domains).binding;
  assert.equal(snapshotOf(draft(), domains).binding, base);
  for (const change of [{ cc: [] }, { bcc: [KATE] }, { subject: 'North Hall' }, { body: { text: CLEAN_BODY, format: 'html' } }, { body: { text: draft().body.text, format: 'text' } },
    { attachments: [{ id: 'x', name: 'a.txt', size: 1, type: 'file' }] }, { to: [{ ...KATE, kind: 'group' }] }]) {
    assert.notEqual(snapshotOf(draft(change), domains).binding, base, JSON.stringify(change));
  }
  assert.notEqual(snapshotOf(draft(), ['northline.example', 'other.example']).binding, base, 'the admin domains are bound too');
});

test('the unavailable sentence is the copy table entry', () => {
  assert.equal(STRINGS.unavailable, "Guardcell couldn't check this email.");
});

test('sender domain works without config; optional extra domains stay exact',async()=>{assert.equal((await checkDraft(draft({cc:[]}))).state,'clear'); assert.equal((await checkDraft(draft(),{config:{internalDomains:['whitfielddev.example']}})).state,'clear');assert.equal((await checkDraft(draft({to:[{address:'x@sub.northline.example'}],cc:[]}))).reach,'outside');});
test('clean local screen clears without any provider',async()=>{const r=await checkDraft(draft({body:{text:CLEAN_BODY}}));assert.equal(r.state,'clear');assert.deepEqual(r.checked,{local:true,semantic:'skipped:absent'});});
test('malformed config and drafts hold unavailable',async()=>{for(const d of [null,draft({to:'bad'}),draft({from:null})])assert.equal((await checkDraft(d)).state,'unavailable');assert.equal((await checkDraft(draft(),{config:{internalDomains:['*']}})).state,'unavailable');});
test('a picture without OCR is ignored inline and asks the sender when attached',async()=>{for(const isInline of [true,false]){const r=await checkDraft(draft({body:{text:CLEAN_BODY},attachments:[{id:'i',name:'logo.png',size:PNG_SIZE,type:'file',isInline,content:PNG_B64}]}));if(isInline){assert.equal(r.state,'clear');continue;}assert.equal(r.state,'held');assert.deepEqual([r.findings[0].subkind,r.findings[0].detail,r.findings[0].severity],['picture','ocr_unsupported','prompt']);}});
test('a lookalike recipient holds the email and leads the findings', async () => {
    const impostor = { name: 'Kate Morgan', address: 'kate@north1ine.example', kind: 'person' };
  const r = await checkDraft(draft({ cc: [impostor] }), { config: CONFIG });
  assert.equal(r.state, 'held');
  assert.deepEqual(r.findings.map((f) => [f.category, f.subkind, f.severity]), [['recipient', 'lookalike', 'stop'], ['economics', 'margin', 'stop'], ['negotiation', 'position', 'stop']]);
  const [f] = r.findings;
  assert.deepEqual([f.label, f.why, f.sentence.text, f.removable, f.place, f.recipients], ['Lookalike address', "This email goes to an address that looks like your company's but isn't.", 'kate@north1ine.example', false, null, ['kate@north1ine.example']]);
  assert.match(r.message, /kate@north1ine\.example\./);
  assert.doesNotMatch(r.message, /kate@north1ine\.example:/);
  assert.match(r.message, /choose Send Anyway/);
  assert.equal(new Set(r.findings.map((x) => x.id)).size, r.findings.length, 'every finding has its own id');
});

test('an exposed outside list is a prompt finding, always after the stop findings', async () => {
  const people = Array.from({ length: 8 }, (_, i) => ({ name: `P${i}`, address: `p${i}@${['clientco', 'apexbuild', 'cityworks'][i % 3]}.example`, kind: 'person' }));
  const clean = await checkDraft(draft({ to: people.slice(0, 4), cc: people.slice(4), body: { text: CLEAN_BODY, format: 'html' } }), { config: CONFIG });
  assert.equal(clean.state, 'held');
  assert.deepEqual(clean.findings.map((f) => [f.category, f.subkind, f.severity, f.label]), [['recipient', 'exposed', 'prompt', 'Recipients can see each other']]);
  assert.match(clean.message, /includes outside addresses everyone on it can see\./);
  assert.match(clean.message, /choose Send Anyway/);
  const withText = await checkDraft(draft({ to: people.slice(0, 4), cc: people.slice(4) }), { config: CONFIG });
  assert.deepEqual(withText.findings.map((f) => f.severity), ['stop', 'stop', 'prompt']);
  assert.equal(withText.findings[0].category, 'economics');
  // Moved to Bcc, the same people are fine.
  const bcc = await checkDraft(draft({ to: [KATE], cc: [], bcc: people, body: { text: CLEAN_BODY, format: 'html' } }), { config: CONFIG });
  assert.equal(bcc.state, 'clear');
});

test('card, bank, identity and token findings flow through the gate with their own labels', async () => {
  const body = 'Kate, the deposit card is 4111 1111 1111 1111.\nIBAN: GB82 WEST 1234 5698 7654 32\nHis SSN is 512-34-8890.';
  const r = await checkDraft(draft({ to: [DAN], cc: [], body: { text: body, format: 'text' } }), { config: CONFIG });
  assert.equal(r.state, 'held');
  assert.deepEqual(r.findings.map((f) => [f.label, f.why]), [['Payment or bank details', 'Card and bank numbers stay off email.'], ['Payment or bank details', 'Card and bank numbers stay off email.'], ['Government ID number', 'Government ID numbers stay off email.']]);
  assert.ok(r.message.includes('includes a card number and a bank account number'));
  assert.ok(r.findings.every((f) => f.removable && f.severity === 'stop'));
});

test('a private key is shown but never offered for one-sentence removal, which would leave its lines behind', async () => {
  const b64 = 'MIIEowIBAAKCAQEAu8Fq2k9ZxR7Lw3vT0pN4cYd6mJ1sHbG5eQ8tKfW2aXo9rU7iV3';
  const body = `Here it is:\n-----BEGIN RSA PRIVATE KEY-----\n${b64}\n${b64.split('').reverse().join('')}\n${b64.slice(5)}Qx==\n-----END RSA PRIVATE KEY-----`;
  const r = await checkDraft(draft({ to: [DAN], cc: [], body: { text: body, format: 'text' } }), { config: CONFIG });
  assert.equal(r.state, 'held');
  const key = r.findings.find((f) => f.subkind === 'private-key');
  assert.ok(key, JSON.stringify(r.findings.map((f) => f.subkind)));
  assert.equal(key.removable, false);
});

test('pictures it cannot read: inline ones are ignored, attached ones ask the sender, pending ones still stop', async () => {
  const pic = (extra) => ({ id: 'p', name: 'site.png', size: PNG_SIZE, type: 'file', contentType: 'image/png', isInline: false, content: PNG_B64, ...extra });
  const hash = sha256(Uint8Array.from(Buffer.from(PNG_B64, 'base64')));
  const run = (att) => checkDraft(draft({ to: [DAN], cc: [], body: { text: CLEAN_BODY, format: 'text' }, attachments: [att] }), { config: CONFIG });
  const attached = await run(pic({ ocr: { status: 'failed', reason: 'ocr_low_confidence', hash } }));
  assert.equal(attached.state, 'held');
  assert.deepEqual(attached.findings.map((f) => [f.category, f.subkind, f.severity, f.label]), [['attachment', 'picture', 'prompt', "Picture it couldn't read"]]);
  assert.match(attached.message, /includes a picture it couldn't read/);
  assert.equal((await run(pic({ isInline: true, name: 'logo.png', contentType: 'image/png', ocr: { status: 'failed', reason: 'ocr_low_confidence', hash } }))).state, 'clear');
  assert.equal((await run(pic({ isInline: true, name: 'logo.png' }))).state, 'clear', 'an inline picture never read is ignored');
  const pending = await run(pic({ ocr: { status: 'pending' } }));
  assert.equal(pending.state, 'held');
  assert.equal(pending.findings[0].severity, 'stop');
  // Non-pictures that can't be read still stop, inline or not.
  for (const isInline of [false, true]) assert.equal((await run({ id: 'z', name: 'photos.zip', size: 4000, type: 'file', isInline })).findings[0].severity, 'stop');
});

test('spreadsheet and CSV attachments read each cell under its column header', async () => {
  const { officeZip, NS, sheet } = await import('./office-fixture.mjs');
  const cell = (ref, v) => `<c r="${ref}" t="inlineStr"><is><t>${v}</t></is></c>`;
  const book = (h, v) => officeZip('xlsx', { 'xl/workbook.xml': `<workbook ${NS.s} ${NS.r}><sheets><sheet name="Orders" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    'xl/worksheets/sheet1.xml': sheet(`<row r="1">${cell('A1', h)}${cell('B1', 'Total')}</row><row r="2">${cell('A2', v)}<c r="B2"><v>4200</v></c></row>`) });
  const file = (name, bytes) => ({ id: name, name, size: bytes.length, isInline: false, type: 'file', content: Buffer.from(bytes).toString('base64') });
  const check = (a) => checkDraft(draft({ to: [DAN], cc: [], body: { text: CLEAN_BODY, format: 'text' }, attachments: [a] }), { config: CONFIG });
  for (const a of [file('orders.xlsx', book('Order ID', '4111111111111111')), file('orders.csv', Buffer.from('order_id,payment_method,total\n4111111111111111,card,4200\n'))]) {
    assert.equal((await check(a)).state, 'clear', a.name);
  }
  for (const a of [file('cards.xlsx', book('Card number', '4111111111111111')), file('cards.csv', Buffer.from('name,card_number\nMorgan,4111111111111111\n')), file('pay.csv', Buffer.from('4111111111111111,4200\n'))]) {
    const r = await check(a);
    assert.deepEqual([r.state, r.findings.map((f) => [f.category, f.file, f.sentence.text.slice(f.marks[0].start, f.marks[0].end)])], ['held', [['financial', a.name, '4111111111111111']]], a.name);
  }
});
