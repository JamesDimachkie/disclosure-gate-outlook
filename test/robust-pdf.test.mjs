import test from 'node:test';
import assert from 'node:assert/strict';
import { attachmentText } from '../core/attachments.mjs';
import { makePdf, stream, onePage } from './pdf-fixture.mjs';
import { lzwEncode } from './lzw-fixture.mjs';
import { checkDraft, decisionFor } from '../core/gate.mjs';
const read = bytes => attachmentText({ name: 'synthetic.pdf', type: 'file', size: bytes.length, content: bytes.toString('base64') });
const complete = (last = stream('BT /F1 12 Tf (Last stream) Tj ET')) => makePdf([
  '<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents [5 0 R 6 0 R] >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', stream('BT /F1 12 Tf (First stream) Tj ET'), last]);
const missingContent = () => Buffer.from(complete().toString('latin1').replace('6 0 obj', '7 0 obj'), 'latin1');

test('a readable first PDF stream never excuses missing or malformed final content', () => {
  assert.equal(read(complete()).ok, true);
  const malformed = complete(stream('BT /F1 12 Tf (Last stream) Tj ET', { dict: '/Type /ObjStm /N 2147483647 /First 2147483647 ' }));
  const missingPage = Buffer.from(complete().toString('latin1').replace('/Kids [3 0 R]', '/Kids [3 0 R 99 0 R]'), 'latin1');
  for (const [bytes, reason] of [[malformed, 'bad_object_stream'], [missingContent(), 'missing_content'], [complete(stream('BT /F1 12 Tf (unfinished')), 'bad_string'], [missingPage, 'missing_page']]) {
    const r = read(bytes);
    assert.deepEqual(r, { ok: false, reason });
  }
});

test('a PDF with one good page and a missing sole content reference cannot clear', () => {
  const b = makePdf(['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>',
    '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', stream('BT /F1 12 Tf (Complete first page) Tj ET'),
    '<< /Type /Page /Parent 2 0 R /Contents 99 0 R >>']);
  assert.deepEqual(read(b), { ok: false, reason: 'missing_content' });
});

test('a readable page cannot excuse an incomplete or inconsistent page-tree branch', () => {
  const build = branch => makePdf(['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>',
    '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', stream('BT /F1 12 Tf (Complete first page) Tj ET'), branch]);
  assert.deepEqual(read(build('<< /Type /Pages /Parent 2 0 R /Count 1 >>')), { ok: false, reason: 'page_tree' });
  assert.deepEqual(read(Buffer.from(onePage('BT /F1 12 Tf (One page) Tj ET').toString('latin1').replace('/Count 1', '/Count 2'), 'latin1')), { ok: false, reason: 'page_tree' });
});

test('a partial PDF follows the default ask decision on the actual gate path', async () => {
  const bytes = missingContent();
  const config = { internalDomains: ['sender.example'] };
  const result = await checkDraft({ from: { address: 'sender@sender.example' }, to: [{ address: 'recipient@outside.example' }], cc: [], bcc: [], subject: '', body: { text: '', format: 'text' }, attachments: [{ id: 'p', name: 'synthetic.pdf', type: 'file', size: bytes.length, content: bytes.toString('base64') }] }, { config });
  assert.equal(result.state, 'held');
  assert.equal(result.findings[0].category, 'attachment');
  assert.equal(decisionFor(result, config).outcome, 'ask');
});

test('linearized trailer ordering keeps the first-page Root and encryption, while newer explicit Roots win', () => {
  // Minimal trailer-order shape, not a claim that this fixture is a full linearized renderer test.
  const build = (early = '', late = '') => {
    let s = onePage('BT /F1 12 Tf (Synthetic trailer order) Tj ET', { prefix: `trailer\n<< /Size 6 /Root 1 0 R ${early}>>\n` }).toString('latin1');
    const at = s.lastIndexOf('/Root 1 0 R'); s = s.slice(0, at) + late + s.slice(at + '/Root 1 0 R'.length);
    return Buffer.from(s, 'latin1');
  };
  assert.equal(read(build()).text, 'Synthetic trailer order');
  assert.deepEqual(read(build('/Encrypt 8 0 R')), { ok: false, reason: 'encrypted' });
  assert.deepEqual(read(build('', '/Root 99 0 R')), { ok: false, reason: 'no_catalog' });
  assert.deepEqual(read(build('', '/Root null')), { ok: false, reason: 'no_catalog' });
});

test('a Flate stream whose Length is off still reads completely when only an end-of-line follows its data', () => {
  const good = onePage('BT /F1 12 Tf (Quarterly totals are attached) Tj ET', { flate: true });
  const text = good.toString('latin1').replace(/\/Length (\d+) \/Filter/, (_, n) => `/Length ${Number(n) + 7} /Filter`);
  const r = read(Buffer.from(text, 'latin1'));
  assert.equal(r.ok, true, r.reason);
  assert.match(r.text, /Quarterly totals are attached/);
});

const lzwPdf = (data, dict = '') => makePdf([
  '<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
  Buffer.concat([Buffer.from(`<< /Length ${data.length} /Filter /LZWDecode ${dict}>>\nstream\n`, 'latin1'), data, Buffer.from('\nendstream', 'latin1')])]);

test('LZW-compressed page content reads completely, across code-width changes', () => {
  const content = 'BT /F1 12 Tf (Margin on the Harbour job is eighteen points) Tj ET '.repeat(400);
  const r = read(lzwPdf(lzwEncode(Buffer.from(content, 'latin1'))));
  assert.equal(r.ok, true, r.reason);
  assert.equal(r.text.split('eighteen').length - 1, 400);
});

test('a corrupt LZW code and a predictor the reader does not decode are refused, never read as text', () => {
  const data = lzwEncode(Buffer.from('BT /F1 12 Tf (Margin on the Harbour job) Tj ET', 'latin1'));
  const bad = Buffer.from(data); bad[3] = 0xff; bad[4] = 0xff;
  assert.equal(read(lzwPdf(bad)).ok, false);
  const r = read(lzwPdf(data, '/DecodeParms << /Predictor 12 /Columns 4 >> '));
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'unsupported_filter');
});
