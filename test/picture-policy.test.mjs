// The picture exemption (SPEC §5.9) holds only for real pictures that couldn't be read. Every case
// below was a way past the check in the final review of 22 October 2026.
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkDraft } from '../core/gate.mjs';
import { sha256 } from '../core/sha256.mjs';
import { officeZip, wdoc } from './office-fixture.mjs';
import { CONFIG, DAN, CLEAN_BODY, draft } from './helpers.mjs';

export const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const DOCX = officeZip('docx', { 'word/document.xml': wdoc('<w:p><w:r><w:t>The password is Tr4ctor!22.</w:t></w:r></w:p>') });
const send = ({ bytes, ...att }) => checkDraft(draft({ to: [DAN], cc: [], body: { text: CLEAN_BODY, format: 'text' }, attachments: [{ id: 'a', type: 'file', size: bytes.length, content: bytes.toString('base64'), ...att }] }), { config: CONFIG });
const stops = (r) => r.state === 'held' && r.findings.some((f) => f.severity === 'stop');

test('a document dressed as a picture is still read or stops, inline or attached', async () => {
  for (const isInline of [true, false]) {
    for (const att of [
      { name: 'notes.docx', contentType: 'image/png', bytes: DOCX },
      { name: 'notes.png', contentType: 'image/png', bytes: DOCX },
      { name: 'notes.zip', contentType: 'image/png', bytes: DOCX },
      { name: 'drawing.svg', contentType: 'image/svg+xml', bytes: Buffer.from('<svg><text>The password is Tr4ctor!22.</text></svg>') },
    ]) assert.ok(stops(await send({ ...att, isInline })), `${att.name} inline=${isInline}`);
  }
  // A .txt with an image content type is read as text and screened.
  const txt = await send({ name: 'notes.txt', contentType: 'image/png', bytes: Buffer.from('The password is Tr4ctor!22.'), isInline: true });
  assert.ok(txt.findings.some((f) => f.category === 'access'));
});

test('a real picture is excused only for genuine reading failures bound to its own bytes', async () => {
  const pic = (ocr, isInline = true) => send({ name: 'shot.png', contentType: 'image/png', bytes: PNG, isInline, ocr });
  const hash = sha256(new Uint8Array(PNG));
  assert.equal((await pic({ status: 'failed', reason: 'ocr_low_confidence', hash })).state, 'clear');
  assert.equal((await pic({ status: 'unsupported', reason: 'ocr_unsupported' })).state, 'clear');
  // The shared-cache overflow, engine or API failures, and a result about another picture all stop.
  for (const ocr of [{ status: 'failed', reason: 'ocr_cache_size' }, { status: 'failed', reason: 'ocr_failed', hash }, { status: 'failed', reason: 'ocr_api' },
    { status: 'failed', reason: 'ocr_low_confidence', hash: 'f'.repeat(64) }, { status: 'failed', reason: 'ocr_low_confidence' }]) {
    for (const isInline of [true, false]) assert.ok(stops(await pic(ocr, isInline)), JSON.stringify(ocr) + ' inline=' + isInline);
  }
  // Attached and genuinely unreadable: the sender is asked, with Send anyway.
  const attached = await pic({ status: 'failed', reason: 'ocr_low_confidence', hash }, false);
  assert.deepEqual(attached.findings.map((f) => [f.subkind, f.severity]), [['picture', 'prompt']]);
});

test('text read with low confidence still counts as evidence: a secret in it is reported, inline or attached (23 October 2026)', async () => {
  const hash = sha256(new Uint8Array(PNG));
  const pic = (hint, isInline) => send({ name: 'deploy-settings.png', contentType: 'image/png', bytes: PNG, isInline, ocr: { status: 'failed', reason: 'ocr_low_confidence', hint, hash } });
  for (const isInline of [true, false]) {
    const r = await pic('Deployment settings\nAPI key: AKIAZ7Q4M2K8P3R6TOWX\nRegion: eu-west-1\nDeployment settings\nAPI key: AKIAZ7Q4M2K8P3R6TIWX', isInline);
    assert.equal(r.state, 'held');
    assert.deepEqual(r.findings.map((f) => [f.category, f.file, f.severity]), [['access', 'deploy-settings.png', 'stop']]);
  }
  // Nothing found in a low-confidence read: the unreadable-picture rule applies.
  assert.equal((await pic('Deployment settings', true)).state, 'clear');
  assert.deepEqual((await pic('Deployment settings', false)).findings.map((f) => [f.subkind, f.severity]), [['picture', 'prompt']]);
  // A hint about a different picture is never used.
  const stale = await send({ name: 'deploy-settings.png', contentType: 'image/png', bytes: PNG, isInline: true, ocr: { status: 'failed', reason: 'ocr_low_confidence', hint: 'Lunch at noon', hash: 'f'.repeat(64) } });
  assert.ok(stale.findings.some((f) => f.severity === 'stop'));
});

test('uncertain OCR text counts only for shape-checked values, never phrasing rules (a garbled logo is not a remark)', async () => {
  const hash = sha256(new Uint8Array(PNG));
  const pic = (hint) => send({ name: 'logo.png', contentType: 'image/png', bytes: PNG, isInline: true, ocr: { status: 'failed', reason: 'ocr_low_confidence', hint, hash } });
  assert.equal((await pic('Our margin is 22%. He is an idiot.')).state, 'clear');
  assert.equal((await pic('Card 4111 1111 1111 1111')).state, 'held');
});
