import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { pdfText } from '../core/extract/pdf.mjs';
import { docxText, xlsxText, pptxText } from '../core/extract/office.mjs';
import { listEntries } from '../core/extract/zip.mjs';
import { makeZip } from './zip-fixture.mjs';
import { officeZip } from './office-fixture.mjs';
import { attachmentText, decodeText, readableKind } from '../core/attachments.mjs';
import { checkDraft } from '../core/gate.mjs';
import { CONFIG, DAN, CLEAN_BODY, draft } from './helpers.mjs';

const b64 = (buf) => Buffer.from(buf).toString('base64');

// A PDF from real bytes: printed by headless Chrome (Skia) from a fictional page.
const CHROME_PDF = readFileSync(new URL('./fixtures/cost-summary.pdf', import.meta.url));
test('a Chrome-printed PDF reads as its paragraphs, wrapped lines joined and kerning ignored', () => {
  assert.equal(pdfText(CHROME_PDF), 'North Hall cost summary\nThis is a fictional document made for Disclosure Gate tests.\nKate asked for a summary of the North Hall schedule so that the whole team can plan the next three weeks of work around the pour.\nOur margin on this project is 18 percent.\nThe crane arrives on Tuesday at 7 a.m. and leaves by noon.');
});

test('a finding inside a PDF attachment names the file and cannot be removed from the pane', async () => {
  const r = await checkDraft(draft({ to: [DAN], cc: [], body: { text: CLEAN_BODY, format: 'html' }, attachments: [{ id: 'p', name: 'cost-summary.pdf', size: CHROME_PDF.length, type: 'file', content: b64(CHROME_PDF) }] }), { config: CONFIG });
  assert.deepEqual(r.findings.map((f) => [f.label, f.place, f.sentence.text, f.removable]), [['Internal economics', 'In cost-summary.pdf', 'Our margin on this project is 18 percent.', false]]);
});

// Hand-built PDFs: objects in order, then a correct cross-reference table.
function makePdf(objects, { trailer = '' } = {}) {
  const parts = ['%PDF-1.7\n'];
  const offsets = [];
  let length = Buffer.byteLength(parts[0], 'latin1');
  objects.forEach((body, i) => {
    offsets.push(length);
    const chunk = Buffer.isBuffer(body) ? Buffer.concat([Buffer.from(`${i + 1} 0 obj\n`, 'latin1'), body, Buffer.from('\nendobj\n', 'latin1')]) : Buffer.from(`${i + 1} 0 obj\n${body}\nendobj\n`, 'latin1');
    parts.push(chunk);
    length += chunk.length;
  });
  const xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R ${trailer}>>\nstartxref\n${length}\n%%EOF\n`;
  return Buffer.concat(parts.map((p) => (Buffer.isBuffer(p) ? p : Buffer.from(p, 'latin1'))).concat(Buffer.from(xref, 'latin1')));
}
const stream = (content, { flate = false, dict = '' } = {}) => {
  const data = flate ? deflateSync(Buffer.from(content, 'latin1')) : Buffer.from(content, 'latin1');
  return Buffer.concat([Buffer.from(`<< /Length ${data.length} ${flate ? '/Filter /FlateDecode ' : ''}${dict}>>\nstream\n`, 'latin1'), data, Buffer.from('\nendstream', 'latin1')]);
};
const simplePdf = (content, opts) => makePdf(['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', stream(content, opts)]);

test('a simple-font PDF, plain or compressed, reads line by line', () => {
  const content = 'BT /F1 12 Tf 72 720 Td (Hi Dan,) Tj 0 -30 Td (Our cost is $4,000 on the slab.) Tj ET';
  assert.equal(pdfText(simplePdf(content)), 'Hi Dan,\nOur cost is $4,000 on the slab.');
  assert.equal(pdfText(simplePdf(content, { flate: true })), 'Hi Dan,\nOur cost is $4,000 on the slab.');
  assert.equal(pdfText(simplePdf('BT /F1 12 Tf 72 720 Td [(Gate) -250 (code) -250 (4417)] TJ ET')), 'Gate code 4417');
  assert.equal(pdfText(simplePdf('BT /F1 12 Tf 72 720 Td (Can\\222t \\(yet\\)) Tj ET')), 'Can’t (yet)');
});

// A composite (Type0, Identity-H) font: two-byte glyph codes that mean nothing without a ToUnicode map.
const composite = (withMap) => {
  const cmap = '/CIDInit /ProcSet findresource begin 12 dict begin begincmap 1 begincodespacerange <0000> <FFFF> endcodespacerange 2 beginbfrange <0001> <001A> <0061> <0021> <0021> <0020> endbfrange endcmap end end';
  const text = 'gate code'.split('').map((c) => (c === ' ' ? '0021' : (c.charCodeAt(0) - 96).toString(16).padStart(4, '0'))).join('');
  return makePdf(['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    `<< /Type /Font /Subtype /Type0 /BaseFont /Fake /Encoding /Identity-H /DescendantFonts [6 0 R] ${withMap ? '/ToUnicode 7 0 R ' : ''}>>`,
    stream(`BT /F1 12 Tf 72 720 Td <${text}> Tj ET`),
    '<< /Type /Font /Subtype /CIDFontType2 /BaseFont /Fake /DW 500 >>', stream(cmap)]);
};
test('a composite font reads through its ToUnicode map, and without one the file can\'t be checked', () => {
  assert.equal(pdfText(composite(true)), 'gate code');
  assert.throws(() => pdfText(composite(false)), /unmapped_font/);
});

test('an accented i drawn as dotless i plus a combining accent reads as the accented letter', () => {
  const cmap = '/CIDInit /ProcSet findresource begin 12 dict begin begincmap 1 begincodespacerange <0000> <FFFF> endcodespacerange 1 beginbfrange <0001> <001A> <0061> endbfrange 1 beginbfchar <0030> <01310302> endbfchar endcmap end end';
  const code = (s) => s.split('').map((c) => (c.charCodeAt(0) - 96).toString(16).padStart(4, '0')).join('');
  const pdf = makePdf(['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type0 /BaseFont /Fake /Encoding /Identity-H /DescendantFonts [6 0 R] /ToUnicode 7 0 R >>',
    stream(`BT /F1 12 Tf 72 720 Td <${code('fra')}0030${code('che')}> Tj ET`),
    '<< /Type /Font /Subtype /CIDFontType2 /BaseFont /Fake /DW 500 >>', stream(cmap)]);
  assert.equal(pdfText(pdf), 'fraîche');
});

test('encrypted, image-only and non-PDF files fail closed', () => {
  const encrypted = makePdf(['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [] /Count 0 >>', '<< /Filter /Standard /V 2 >>'], { trailer: '/Encrypt 3 0 R ' });
  assert.throws(() => pdfText(encrypted), /encrypted/);
  const imageOnly = simplePdf('q 100 0 0 100 72 600 cm /Im1 Do Q');
  assert.equal(pdfText(imageOnly), '');
  assert.deepEqual(attachmentText({ name: 'scan.pdf', size: imageOnly.length, type: 'file', content: b64(imageOnly) }), { ok: false, reason: 'no_text' });
  assert.throws(() => pdfText(Buffer.from('hello')), /not_a_pdf/);
});

// DOCX and XLSX built the way Word and Excel store them (synthetic content).
const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
test('DOCX: split runs, tabs, entities, tracked deletions, headers and comments are all text', () => {
  const docx = officeZip('docx', {
    'word/document.xml': `<w:document ${W}><w:body><w:p><w:r><w:t>Our mar</w:t></w:r><w:proofErr w:type="spellStart"/><w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">gin is 22% </w:t></w:r><w:r><w:t>&amp; rising.</w:t></w:r></w:p><w:p><w:r><w:t>Name</w:t></w:r><w:r><w:tab/></w:r><w:r><w:t>Role</w:t></w:r></w:p><w:p><w:del w:id="1"><w:r><w:delText>Gate code is 4417.</w:delText></w:r></w:del></w:p></w:body></w:document>`,
    'word/header1.xml': `<w:hdr ${W}><w:p><w:r><w:t>Internal draft</w:t></w:r></w:p></w:hdr>`,
    'word/comments.xml': `<w:comments ${W}><w:comment w:id="0"><w:p><w:r><w:t>We can go as low as $90k.</w:t></w:r></w:p></w:comment></w:comments>`,
  });
  assert.equal(docxText(docx), 'Our margin is 22% & rising.\nName\tRole\nGate code is 4417.\nWe can go as low as $90k.\nInternal draft');
  assert.throws(() => docxText(makeZip({ 'word/document.xml': `<w:document ${W}/>` })), /not_a_package/);
});

test('XLSX: sheet names, shared, inline and formula strings, percentages and comments', () => {
  const xlsx = officeZip('xlsx', {
    'xl/workbook.xml': '<workbook><sheets><sheet name="Cost build-up" sheetId="1" r:id="rId1"/></sheets></workbook>',
    'xl/sharedStrings.xml': '<sst><si><t>Item</t></si><si><t>Margin</t></si><si><r><t>Contin</t></r><r><t>gency</t></r><rPh><t>x</t></rPh></si></sst>',
    'xl/styles.xml': '<styleSheet><numFmts count="1"><numFmt numFmtId="164" formatCode="0.0%"/></numFmts><cellXfs count="3"><xf numFmtId="0"/><xf numFmtId="9"/><xf numFmtId="164"/></cellXfs></styleSheet>',
    'xl/worksheets/sheet1.xml': '<worksheet><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="C1" t="inlineStr"><is><t>Note</t></is></c></row><row r="2"><c r="A2" t="s"><v>1</v></c><c r="B2" s="1"><v>0.22</v></c></row><row r="3"><c r="A3" t="s"><v>2</v></c><c r="B3" s="2"><v>0.075</v></c><c r="C3" t="str"><f>B3*2</f><v>high</v></c></row></sheetData></worksheet>',
    'xl/comments1.xml': '<comments><commentList><comment ref="B2"><text><r><t>Keep this from the client.</t></r></text></comment></commentList></comments>',
  });
  assert.equal(xlsxText(xlsx), 'Cost build-up\nItem\t\tNote\nMargin\t22%\nContingency\t7.5%\thigh\nKeep this from the client.');
});

test('ZIP: an encrypted entry or a broken archive is refused', () => {
  const zip = officeZip('docx', { 'word/document.xml': '<w:document/>' });
  const encrypted = Buffer.from(zip);
  const central = encrypted.indexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02]));
  encrypted.writeUInt16LE(1, central + 8);
  assert.throws(() => docxText(encrypted), /encrypted/);
  assert.throws(() => listEntries(Buffer.from('not a zip at all, just text')), /not_a_zip/);
  assert.deepEqual(attachmentText({ name: 'bid.docx', size: 20, type: 'file', content: b64('PK not really') }).ok, false);
});

test('text files: UTF-8, UTF-16 with a byte order mark, Windows-1252, and binary refused', () => {
  assert.equal(decodeText(Buffer.from('Gate code’s 4417', 'utf8')), 'Gate code’s 4417');
  assert.equal(decodeText(Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from('Our margin', 'utf16le')])), 'Our margin');
  assert.equal(decodeText(Buffer.from([0x43, 0x61, 0x66, 0xe9])), 'Café');
  assert.throws(() => decodeText(Buffer.from([0x50, 0x00, 0x01, 0x02])), /binary/);
  assert.deepEqual(attachmentText({ name: 'rates.csv', size: 30, type: 'file', content: b64('Item,Cost\nSteel,"$41,000"\n') }), { ok: true, text: 'Item,Cost\nSteel,"$41,000"\n' });
});

test('what counts as readable: by extension, file attachments only, within the size limit', () => {
  assert.equal(readableKind({ name: 'A.PDF', type: 'file' }), 'pdf');
  for (const name of ['site-photos.zip', 'photo.jpg', 'bid.doc', 'model.dwg', 'noext']) assert.equal(readableKind({ name, type: 'file' }), null, name);
  assert.equal(readableKind({ name: 'bid.pdf', type: 'cloud' }), null);
  assert.deepEqual(attachmentText({ name: 'big.txt', size: 11 * 1024 * 1024, type: 'file', content: 'aGk=' }), { ok: false, reason: 'size' });
});

test('PPTX includes slide text, split runs and speaker notes',()=>{const file=officeZip('pptx',{'ppt/presentation.xml':'<p:presentation/>','ppt/slides/slide1.xml':'<a:p><a:r><a:t>Meeting </a:t></a:r><a:r><a:t>Tuesday &amp; Friday.</a:t></a:r></a:p>','ppt/notesSlides/notesSlide1.xml':'<a:p><a:r><a:t>Our margin is 18%.</a:t></a:r></a:p>'});const text=pptxText(file);assert.ok(text.includes('Meeting Tuesday & Friday.'));assert.ok(text.includes('Our margin is 18%.'));assert.equal(attachmentText({name:'empty.txt',type:'file',size:0,content:''}).ok,true);});
