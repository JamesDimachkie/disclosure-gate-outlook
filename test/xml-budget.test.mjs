// Independent review F6: exact namespace-scope shape from REVIEW-EVIDENCE/focused.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { scanXml, MAX_XML_DEPTH, MAX_XML_WORK } from '../core/extract/xml.mjs';
import { docxText } from '../core/extract/office.mjs';
import { attachmentText } from '../core/attachments.mjs';
import { checkDraft } from '../core/gate.mjs';
import { officeZip } from './office-fixture.mjs';
import { draft, DAN, CLEAN_BODY } from './helpers.mjs';
const deepXml = n => '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' + '<w:sdt xmlns:x="urn:unused">'.repeat(n) + '<w:p><w:r><w:t>See you Tuesday.</w:t></w:r></w:p>' + '</w:sdt>'.repeat(n) + '</w:document>';
const file = bytes => ({ id: 'd', type: 'file', name: 'deep-namespace.docx', size: bytes.length, content: bytes.toString('base64') });
const run = a => checkDraft(draft({ to: [DAN], cc: [], subject: 'Update', body: { text: CLEAN_BODY, format: 'text' }, attachments: [a] }), { config: { findings: 'hold', failures: 'hold', model: 'off' } });

test('F6: exact 50,000-scope DOCX probe fails quickly with independent XML budgets', async () => {
  const bytes = officeZip('docx', { 'word/document.xml': deepXml(50000) });
  const t = performance.now(), a = file(bytes);
  assert.equal(attachmentText(a).reason, 'too_complex');
  assert.ok(performance.now() - t < 1500);
  assert.equal((await run(a)).outcome, 'hold');
  assert.equal((await run(file(officeZip('docx', { 'word/document.xml': deepXml(20) })))).state, 'clear');
  const noop = { open() {}, text() {}, close() {} };
  assert.throws(() => scanXml('<x>'.repeat(MAX_XML_DEPTH + 1) + '</x>'.repeat(MAX_XML_DEPTH + 1), noop), /too_complex/);
  assert.throws(() => scanXml('<x>' + ' '.repeat(MAX_XML_WORK) + '</x>', noop), /too_complex/);
});

test('F6: effective namespace maps restore shadowed and self-closing scopes', () => {
  const names = [];
  scanXml('<r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p/><s xmlns:w="urn:other"><w:p/></s><w:p/><s xmlns:w="urn:other"/><w:p/></r>', { open(n) { names.push(n); }, text() {}, close() {} });
  assert.deepEqual(names, ['r', 'w:p', 's', 'w:p', 'w:p', 's', 'w:p']);
  assert.equal(docxText(officeZip('docx', { 'word/document.xml': deepXml(100).replaceAll('w:', 'z:').replace('xmlns:w', 'xmlns:z') })), 'See you Tuesday.');
});
