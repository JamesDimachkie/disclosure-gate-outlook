// F1/F2/F6: exact independent-review inputs, plus sibling representations and clear controls.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { attachmentText } from '../core/attachments.mjs';
import { pdfCoverage, pdfImages } from '../core/extract/pdf.mjs';
import { officeCoverage, docxText } from '../core/extract/office.mjs';
import { checkDraft } from '../core/gate.mjs';
import { sha256 } from '../core/sha256.mjs';
import { createOcrService } from '../outlook/ocr-service.mjs';
import { officeZip, wdoc, para, NS, slide, shape, sheet, relsXml } from './office-fixture.mjs';
import { onePage, stream, makePdf } from './pdf-fixture.mjs';
import { draft, DAN, CLEAN_BODY, PNG_B64 } from './helpers.mjs';
import { load, demo, plain } from './runtime-helper.mjs';

const fixture = name => readFileSync(new URL('./fixtures/review-' + name, import.meta.url));
const file = (name, bytes) => ({ id: 'f', type: 'file', name, size: bytes.length, content: Buffer.from(bytes).toString('base64') });
const input = a => draft({ to: [DAN], cc: [], subject: 'Update', body: { text: CLEAN_BODY, format: 'text' }, attachments: [a] });
const config = { findings: 'hold', failures: 'hold', model: 'off' };
const run = a => checkDraft(input(a), { config });
const secret = 'Password: Tr4ctor!22';
const ready = (a, text) => ({ ...a, ocr: { status: 'ready', hash: sha256(Buffer.from(a.content, 'base64')), text } });
const mixed = file('mixed.pdf', fixture('mixed-scan.pdf'));
const embedded = file('picture.docx', fixture('embedded-image.docx'));
const jpeg = officeCoverage(Buffer.from(embedded.content, 'base64'), 'docx').images[0].bytes;
const book = `<workbook ${NS.s} ${NS.r}><sheets><sheet name="Schedule" sheetId="1" r:id="rId1"/></sheets></workbook>`;
const pres = `<p:presentation ${NS.p} ${NS.r}><p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst></p:presentation>`;
const office = (kind, image) => officeZip(kind, {
  ...(kind === 'docx' ? { 'word/document.xml': wdoc(para('See attached picture.')) } : kind === 'xlsx' ? { 'xl/workbook.xml': book, 'xl/worksheets/sheet1.xml': sheet('') } : { 'ppt/presentation.xml': pres, 'ppt/slides/slide1.xml': slide(shape('Schedule')) }),
  [(kind === 'docx' ? 'word' : kind === 'xlsx' ? 'xl' : 'ppt') + '/media/picture.jpeg']: image,
});

test('F1: nested-9 PDF and partial-font PDF cannot return partial text as success', async () => {
  for (const [name, reason] of [['nested-9.pdf', 'form_depth'], ['partial-font.pdf', 'unmapped_font']]) {
    const a = file(name, fixture(name));
    assert.deepEqual(attachmentText(a), { ok: false, reason });
    assert.equal((await run(a)).state, 'held');
    assert.equal((await checkDraft(input(a), { config: { ...config, failures: 'ask' } })).outcome, 'ask');
  }
});

test('F2 PDF: native cover text plus scanned page needs OCR; both texts are checked', async () => {
  const read = pdfCoverage(Buffer.from(mixed.content, 'base64'));
  assert.match(read.text, /See attached page/);
  assert.deepEqual(read.ocrPages, [1]);
  assert.equal(pdfImages(Buffer.from(mixed.content, 'base64'), read.ocrPages).length, 1);
  assert.equal(attachmentText(mixed).ok, false);
  const complete = attachmentText(ready(mixed, secret));
  assert.equal(complete.ok, true);
  assert.match(complete.text, /See attached page/);
  assert.match(complete.text, /Tr4ctor/);
  assert.ok((await run(ready(mixed, secret))).findings.some(f => f.subkind === 'password'));
  for (const status of ['pending', 'failed', 'unsupported']) {
    const a = { ...mixed, ocr: { status, reason: status === 'pending' ? undefined : 'ocr_unsupported' } };
    assert.equal((await run(a)).outcome, 'hold');
  }
  assert.equal((await run(ready(mixed, 'Nothing sensitive here.'))).state, 'clear');
});

test('F2 PDF sibling: image on a page with native text still requires OCR', () => {
  const samePage = onePage('BT /F1 12 Tf 30 700 Td (See attached picture.) Tj ET q 560 0 0 84 20 600 cm /Img Do Q', {
    resources: '/XObject << /Img 6 0 R >>', more: [stream(Buffer.from(jpeg), { dict: '/Type /XObject /Subtype /Image /Width 1200 /Height 180 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode ' })],
  });
  const coverage = pdfCoverage(samePage);
  assert.deepEqual(coverage.ocrPages, [0]);
  assert.equal(pdfImages(samePage, coverage.ocrPages).length, 1);
  assert.equal(attachmentText(file('same-page.pdf', samePage)).ok, false);
});

test('F2 Office: exact DOCX fixture and XLSX/PPTX pictures use attached-picture policy', async () => {
  const files = [embedded, ...['xlsx', 'pptx'].map(k => file('picture.' + k, office(k, jpeg)))];
  for (const a of files) {
    assert.equal(attachmentText(a).ok, false);
    assert.equal((await run(a)).outcome, 'ask');
    assert.ok((await run(ready(a, secret))).findings.some(f => f.subkind === 'password'));
    assert.equal((await run(ready(a, 'Nothing sensitive here.'))).state, 'clear');
    for (const reason of ['ocr_low_confidence', 'ocr_unsupported', 'ocr_failed']) {
      const result = await run({ ...a, ocr: { status: 'failed', reason } });
      assert.equal(result.outcome, 'ask', reason);
      assert.equal(result.findings[0].subkind, 'picture');
    }
    assert.equal((await run({ ...a, ocr: { status: 'pending' } })).outcome, 'hold');
    assert.equal((await run({ ...ready(a, ''), ocr: { status: 'ready', text: '', hash: '0'.repeat(64) } })).outcome, 'hold');
    // An inline document is still an attachment; its embedded picture must ask.
    assert.equal((await run({ ...a, isInline: true })).outcome, 'ask');
  }
  assert.throws(() => docxText(Buffer.from(embedded.content, 'base64')), /ocr_required/);
});

test('ordinary native PDFs and Office files with only a micro logo remain clear', async () => {
  const pdf = file('ordinary.pdf', onePage('BT /F1 12 Tf 30 700 Td (See you Tuesday.) Tj ET'));
  assert.equal((await run(pdf)).state, 'clear');
  for (const kind of ['docx', 'xlsx', 'pptx']) {
    const a = file('ordinary.' + kind, office(kind, Buffer.from(PNG_B64, 'base64')));
    assert.equal(attachmentText(a).ok, true);
    assert.equal((await run(a)).state, 'clear');
  }
});

test('F2 siblings: referenced thumbnails, nested packages and raster content in SVG cannot be skipped', async () => {
  const thumb = officeZip('docx', { 'word/document.xml': wdoc(para('See picture.')),
    'word/_rels/document.xml.rels': relsXml([['img', 'image', '../docProps/thumbnail.jpeg']]), 'docProps/thumbnail.jpeg': jpeg });
  const inner = office('xlsx', jpeg);
  const nested = officeZip('docx', { 'word/document.xml': wdoc(para('See workbook.')), 'word/embeddings/book.xlsx': inner });
  const svg = officeZip('docx', { 'word/document.xml': wdoc(para('See picture.')), 'word/media/picture.svg': '<svg xmlns="http://www.w3.org/2000/svg"><image href="data:image/png;base64,AAAA"/></svg>' }, { types: { 'word/media/picture.svg': 'image/svg+xml' } });
  const mislabeled = officeZip('docx', { 'word/document.xml': wdoc(para('See picture.')), 'word/media/picture.jpeg': jpeg }, { types: { 'word/media/picture.jpeg': 'application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml' } });
  for (const bytes of [thumb, nested, svg, mislabeled]) {
    assert.ok(officeCoverage(bytes, 'docx').images.length);
    assert.equal((await run(file('picture.docx', bytes))).outcome, 'ask');
  }
});

test('F1 siblings: annotation appearances, Type3 glyph programs and tiling patterns fail closed', () => {
  const appearance = makePdf(['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R /Annots [6 0 R] >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', stream('BT /F1 12 Tf (See you Tuesday.) Tj ET'),
    '<< /Type /Annot /Subtype /Widget /AP << /N 7 0 R >> >>', stream('BT /F 12 Tf <0001000200030004> Tj ET', { dict: '/Type /XObject /Subtype /Form /Resources << /Font << /F 8 0 R >> >> ' }),
    '<< /Type /Font /Subtype /Type0 /BaseFont /Unknown >>']);
  assert.equal(attachmentText(file('appearance.pdf', appearance)).reason, 'unmapped_font');
  const pattern = onePage('BT /F1 12 Tf (See you Tuesday.) Tj ET /Pattern cs /P scn 0 0 200 200 re f', { resources: '/Pattern << /P 6 0 R >>', more: [stream('BT /F1 12 Tf (Password: Tr4ctor!22) Tj ET', { dict: '/Type /Pattern /PatternType 1 /BBox [0 0 200 200] /XStep 200 /YStep 200 /Resources << /Font << /F1 4 0 R >> >> ' })] });
  assert.equal(attachmentText(file('pattern.pdf', pattern)).reason, 'pattern');
  const type3 = onePage('BT /F1 12 Tf (See you Tuesday.) Tj /F2 12 Tf (AAAA) Tj ET', { resources: '/Font << /F1 4 0 R /F2 6 0 R >>', more: ['<< /Type /Font /Subtype /Type3 /Encoding << /Differences [65 /space] >> /CharProcs << /space 7 0 R >> /FontBBox [0 0 100 100] /FontMatrix [0.001 0 0 0.001 0 0] /FirstChar 65 /LastChar 65 /Widths [600] >>', stream('600 0 d0 0 0 100 100 re f')] });
  assert.equal(attachmentText(file('type3.pdf', type3)).reason, 'unmapped_font');
});

test('Office picture capacity exhaustion asks without discarding native text or clearing unread pictures', async () => {
  const parts = { 'word/document.xml': wdoc(para('Our margin is 18 percent.')) };
  for (let i = 0; i < 13; i++) parts['word/media/picture' + i + '.jpeg'] = jpeg;
  const a = file('many.docx', officeZip('docx', parts));
  const images = officeCoverage(Buffer.from(a.content, 'base64'), 'docx').images;
  assert.equal(images.length, 12);
  assert.equal(images[11].reason, 'image_size');
  const result = await run(a);
  assert.ok(result.findings.some(f => f.category === 'economics'));
  assert.ok(result.findings.some(f => f.subkind === 'picture'));
});

test('failed OCR preserves confident text and stale failed entries cannot excuse changed Office bytes', async () => {
  const a = { ...embedded, ocr: { status: 'failed', reason: 'ocr_low_confidence', hash: sha256(Buffer.from(embedded.content, 'base64')), text: 'Our margin is 18 percent.', hint: 'Password: Tr4ctor!22' } };
  const result = await run(a);
  assert.ok(result.findings.some(f => f.category === 'economics'));
  assert.ok(result.findings.some(f => f.subkind === 'password'));
  assert.ok(result.findings.some(f => f.subkind === 'picture'));
  assert.equal(attachmentText({ ...a, ocr: { status: 'failed', reason: 'ocr_unsupported', hash: '0'.repeat(64) } }).reason, 'ocr_hash');
});

test('embedded PDF scans retain document failure policy instead of the Office picture exception', async () => {
  const bytes = officeZip('docx', { 'word/document.xml': wdoc(para('See scan.')), 'word/media/scan.pdf': Buffer.from(mixed.content, 'base64') }, { types: { 'word/media/scan.pdf': 'application/pdf' } });
  const a = file('scan.docx', bytes);
  assert.equal(officeCoverage(bytes, 'docx').pdfScans, true);
  for (const ocr of [undefined, { status: 'pending' }, { status: 'failed', reason: 'ocr_low_confidence' }, { status: 'unsupported', reason: 'ocr_unsupported' }]) assert.equal((await run({ ...a, ocr })).outcome, 'hold');
  assert.equal((await run(ready(a, 'Site walk notes.'))).state, 'clear');
  const blank = makePdf(['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /Annots [4 0 R] >>', '<< /Type /Annot /Subtype /Text /Contents (A note.) >>']);
  const noteOnly = officeZip('docx', { 'word/document.xml': wdoc(para('See scan.')), 'word/media/scan.pdf': blank }, { types: { 'word/media/scan.pdf': 'application/pdf' } });
  assert.equal(attachmentText(file('scan.docx', noteOnly)).reason, 'no_text');
});

const deepXml = n => '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' + '<w:sdt xmlns:x="urn:unused">'.repeat(n) + '<w:p><w:r><w:t>See you Tuesday.</w:t></w:r></w:p>' + '</w:sdt>'.repeat(n) + '</w:document>';
test('OCR service recognizes mixed PDF and embedded Office media, hashing the whole file', async () => {
  for (const a of [mixed, embedded, file('picture.xlsx', office('xlsx', jpeg)), file('picture.pptx', office('pptx', jpeg))]) {
    let calls = 0;
    const values = {}, ok = value => ({ status: 'succeeded', value });
    const item = { getAttachmentsAsync: cb => cb(ok([a])), sessionData: { getAsync: (k, cb) => cb(ok(values[k])), setAsync: (k, v, cb) => { values[k] = v; cb(ok()); } } };
    const office = { context: { mailbox: { item } } };
    const service = createOcrService({ document: {}, Worker: function() {}, WebAssembly, BigInt, GuardcellOcrEngine: { recognize: async bytes => { calls++; assert.ok(bytes.length); return { status: 'ready', text: secret }; }, close: async () => {} } });
    await service.prepare(office, [a]);
    await service.wait(office, Date.now() + 2000);
    const checked = { ...a }; service.apply(office, [checked]);
    assert.equal(calls, 1, a.name);
    assert.equal(checked.ocr.status, 'ready');
    assert.equal(checked.ocr.hash, sha256(Buffer.from(a.content, 'base64')));
    assert.match(attachmentText(checked).text, /Tr4ctor/);
  }
});

test('native and both ES2016 bundles agree on every review fixture and clear control', async () => {
  const samples = [file('nested.pdf', fixture('nested-9.pdf')), file('font.pdf', fixture('partial-font.pdf')), mixed, embedded,
    file('deep.docx', officeZip('docx', { 'word/document.xml': deepXml(50000) })), ready(mixed, secret), ready(embedded, secret),
    file('clear.pdf', onePage('BT /F1 12 Tf 30 700 Td (See you Tuesday.) Tj ET')), file('logo.docx', office('docx', Buffer.from(PNG_B64, 'base64')))];
  for (const bundle of ['runtime.js', 'runtime-browser.js']) {
    const l = load({ source: readFileSync(new URL('../dist/' + bundle, import.meta.url), 'utf8') });
    for (const a of samples) {
      const native = await run(a), legacy = plain(await l.core.checkDraft(input(a), { config }));
      assert.deepEqual([legacy.state, legacy.outcome, legacy.findings], [native.state, native.outcome, native.findings], bundle + ':' + a.name);
    }
  }
});

test('both built Send paths read and check Office OCR with fresh attachment bytes', async () => {
  for (const bundle of ['runtime.js', 'runtime-browser.js']) for (const text of [secret, 'See you Tuesday.']) {
    const a = { ...embedded, attachmentType: 'file' };
    const l = load({ source: readFileSync(new URL('../dist/' + bundle, import.meta.url), 'utf8'), state: demo({ subject: 'Update', body: CLEAN_BODY, attachments: [a], contents: { f: a.content } }), globals: { document: {}, Worker: function() {}, GuardcellOcrEngine: { recognize: async () => ({ status: 'ready', text }), close: async () => {} } } });
    assert.equal((await l.send()).allowEvent, text !== secret);
    if (text === secret) assert.ok(JSON.parse(l.values['dg-result']).result.findings.some(f => f.subkind === 'password'));
    else assert.ok(l.reads.content.filter(id => id === 'f').length >= 2);
  }
});
