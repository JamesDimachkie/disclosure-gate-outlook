// Synthetic reproductions of what real files from public test corpora (Apache POI's Office files,
// Mozilla pdf.js's PDFs) showed the readers getting wrong: memory or time that grows past a bound,
// a refusal with the wrong reason, a standard part refused as unknown, and names that read
// differently to different ZIP readers. Each test builds the shape; no corpus file is copied here.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { docxText, xlsxText, pptxText } from '../core/extract/office.mjs';
import { pdfText } from '../core/extract/pdf.mjs';
import { listEntries, readEntry } from '../core/extract/zip.mjs';
import { attachmentText } from '../core/attachments.mjs';
import { decodeBytes, crc32 } from '../core/bytes.mjs';
import { makeZip } from './zip-fixture.mjs';
import { officeZip, NS, wdoc, para, slide, shape, sheet, relsXml } from './office-fixture.mjs';
import { makePdf, stream, onePage } from './pdf-fixture.mjs';

const O = 'application/vnd.openxmlformats-officedocument.';
const file = (name, buf) => ({ id: name, name, size: buf.length, type: 'file', content: Buffer.from(buf).toString('base64') });
const reason = (name, buf) => { const r = attachmentText(file(name, buf)); assert.equal(r.ok, false, `${name} should not be readable`); return r.reason; };
const timed = (fn) => { const t = performance.now(); const out = fn(); return [out, performance.now() - t]; };
const workbook = (sheets) => `<workbook ${NS.s} ${NS.r}><sheets>${sheets.map(([name, id]) => `<sheet name="${name}" sheetId="1" r:id="${id}"/>`).join('')}</sheets></workbook>`;
// The same package with every entry renamed by `rename` (entry order and content kept).
const renamed = (buf, rename) => { const out = {}; for (const [n, e] of listEntries(buf)) out[rename(n)] = Buffer.from(readEntry(buf, e)); return makeZip(out); };

// ---- memory and time ---------------------------------------------------------------------------
test('one long shared string shown in thousands of cells stops as too long at once, not after building gigabytes', () => {
  const long = 'Internal ledger '.repeat(65536); // 1 MiB
  const cells = Array.from({ length: 50 }, (_, r) => `<row r="${r + 1}">${Array.from({ length: 60 }, (_, c) => `<c r="${String.fromCharCode(65 + (c % 26))}${r + 1}" t="s"><v>0</v></c>`).join('')}</row>`).join('');
  const book = officeZip('xlsx', { 'xl/workbook.xml': workbook([['S', 'rId1']]), 'xl/worksheets/sheet1.xml': sheet(cells), 'xl/sharedStrings.xml': `<sst ${NS.s}><si><t>${long}</t></si></sst>` });
  const [why, ms] = timed(() => reason('ledger.xlsx', book));
  assert.equal(why, 'too_long');
  assert.ok(ms < 1500, `took ${ms} ms`);
  // A cell reference past Excel's last column (XFD) is not a cell.
  assert.equal(reason('wide.xlsx', officeZip('xlsx', { 'xl/workbook.xml': workbook([['S', 'rId1']]), 'xl/worksheets/sheet1.xml': sheet('<row r="1"><c r="XFE1" t="inlineStr"><is><t>far</t></is></c></row>') })), 'bad_cell_ref');
  assert.equal(xlsxText(officeZip('xlsx', { 'xl/workbook.xml': workbook([['S', 'rId1']]), 'xl/worksheets/sheet1.xml': sheet('<row r="1"><c r="C1" t="inlineStr"><is><t>third</t></is></c></row>') })), 'S\n\t\tthird');
});

test('tables nested thousands deep fail as too complex quickly; a few levels still read', () => {
  const nest = (depth) => { let x = para('Innermost cell'); for (let i = 0; i < depth; i++) x = `<w:tbl><w:tr><w:tc>${para('Level ' + i)}${x}</w:tc></w:tr></w:tbl>${para('')}`; return x; };
  assert.equal(docxText(officeZip('docx', { 'word/document.xml': wdoc(nest(3)) })), 'Level 2\tLevel 1\tLevel 0\tInnermost cell');
  const [why, ms] = timed(() => reason('deep.docx', officeZip('docx', { 'word/document.xml': wdoc(nest(4000)) })));
  assert.equal(why, 'too_complex');
  assert.ok(ms < 1500, `took ${ms} ms`);
});

test('UTF-8 and UTF-16 decode a chunk at a time, exactly, across chunk boundaries', () => {
  const pieces = ['a', 'é', '€', '𝄞', 'Ω', ' ', '\n', '中'];
  let s = '';
  for (let i = 0; i < 40000; i++) s += pieces[(i * 7919) % pieces.length];
  assert.equal(decodeBytes(Buffer.from(s, 'utf8'), 'utf-8', true), s);
  assert.equal(decodeBytes(Buffer.from(s, 'utf16le'), 'utf-16le', true), s);
  assert.throws(() => decodeBytes(Buffer.from([0x61, 0xc3]), 'utf-8', true), /bad_encoding/);
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926);
});

// ---- reasons and parts -----------------------------------------------------------------------------
test('PPTX: a presentation part with line breaks between tags reads; unread text names its element', () => {
  const pres = `<p:presentation ${NS.p} ${NS.r}>\n  <p:sldIdLst>\n    <p:sldId id="256" r:id="rId1"/>\n  </p:sldIdLst>\n</p:presentation>`;
  assert.equal(pptxText(officeZip('pptx', { 'ppt/presentation.xml': pres, 'ppt/slides/slide1.xml': slide(shape('Quarterly plan')) })), 'Quarterly plan');
  const odd = `<p:presentation ${NS.p} ${NS.r}><p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst><p:custShowLst><p:custShow name="A" id="0">Board only: the sale price</p:custShow></p:custShowLst></p:presentation>`;
  assert.equal(reason('odd.pptx', officeZip('pptx', { 'ppt/presentation.xml': odd, 'ppt/slides/slide1.xml': slide(shape('Plan')) })), 'unread_text:custShow');
});

test('XLSX: a sheet\'s custom properties are read as the UTF-16 strings they are', () => {
  const parts = (bytes) => ({
    'xl/workbook.xml': workbook([['S', 'rId1']]), 'xl/worksheets/sheet1.xml': sheet('<row r="1"><c r="A1" t="inlineStr"><is><t>Visible</t></is></c></row>'),
    'xl/worksheets/_rels/sheet1.xml.rels': relsXml([['rId1', 'customProperty', '../customProperty1.bin']]), 'xl/customProperty1.bin': bytes,
  });
  const types = { types: { 'xl/customProperty1.bin': O + 'spreadsheetml.customProperty' } };
  assert.ok(xlsxText(officeZip('xlsx', parts(Buffer.from('Account 7788-0912 (internal)', 'utf16le')), types)).includes('Account 7788-0912 (internal)'));
  assert.equal(reason('odd.xlsx', officeZip('xlsx', parts(Buffer.from([0x41, 0x00, 0x42])), types)), 'bad_encoding');
});

test('a PDF stored as an image (Office for Mac) is read as a PDF; a part with no type is unknown, not mis-decoded', () => {
  const pdf = readFileSync(new URL('./fixtures/cost-summary.pdf', import.meta.url));
  const deck = (media, types) => officeZip('pptx', { 'ppt/presentation.xml': `<p:presentation ${NS.p} ${NS.r}><p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst></p:presentation>`, 'ppt/slides/slide1.xml': slide(shape('Costs')), ...media }, { types });
  const text = pptxText(deck({ 'ppt/media/image1.pdf': pdf }, { 'ppt/media/image1.pdf': 'application/pdf' }));
  assert.ok(text.includes('Our margin on this project is 18 percent.'), text);
  assert.equal(reason('broken.pptx', deck({ 'ppt/media/image1.pdf': Buffer.from('not a pdf at all') }, { 'ppt/media/image1.pdf': 'application/pdf' })), 'not_a_pdf');
  // Binary content with no content type ([trash] items, a generator's own metadata) can't be checked.
  assert.equal(reason('trash.pptx', deck({ '[trash]/0000.dat': Buffer.from([0xff, 0xff, 0xff, 0xff, 0, 0]) })), 'unknown_part');
});

test('XLSX: backslash folder separators read as slashes; a sheet with no relationship gives its name only', () => {
  const book = officeZip('xlsx', { 'xl/workbook.xml': workbook([['Data', 'rId1']]), 'xl/worksheets/sheet1.xml': sheet('<row r="1"><c r="A1" t="inlineStr"><is><t>Bid 4410</t></is></c></row>') });
  assert.equal(xlsxText(renamed(book, (n) => (n === '[Content_Types].xml' ? '[content_types].xml' : n.replace(/\//g, '\\')))), 'Data\nBid 4410');
  const both = { ...Object.fromEntries([...listEntries(book)].map(([n, e]) => [n, Buffer.from(readEntry(book, e))])), 'xl\\worksheets\\sheet1.xml': Buffer.from(sheet('')) };
  assert.equal(reason('both.xlsx', makeZip(both)), 'duplicate_entry');
  const listed = officeZip('xlsx', { 'xl/workbook.xml': workbook([['Data', 'rId1'], ['Module', '']]), 'xl/worksheets/sheet1.xml': sheet('<row r="1"><c r="A1" t="inlineStr"><is><t>Bid 4410</t></is></c></row>') });
  assert.equal(xlsxText(listed), 'Data\nBid 4410\nModule');
});

test('XLSX: pivot records in a folder that sorts before their definition still read through its items', () => {
  const book = officeZip('xlsx', {
    'xl/workbook.xml': workbook([['S', 'rId1']]), 'xl/worksheets/sheet1.xml': sheet(''),
    'xl/pivotCache/pivotCacheDefinition1.xml': `<pivotCacheDefinition ${NS.s} ${NS.r} r:id="rId1"><cacheSource type="worksheet"/><cacheFields count="2"><cacheField name="Client"><sharedItems><s v="Harbor Foods"/><s v="Kestrel Labs"/></sharedItems></cacheField><cacheField name="Margin"><sharedItems containsNumber="1"/></cacheField></cacheFields></pivotCacheDefinition>`,
    'xl/pivotCache/_rels/pivotCacheDefinition1.xml.rels': relsXml([['rId1', 'pivotCacheRecords', 'pivotCache/pivotCacheRecords1.xml']]),
    'xl/pivotCache/pivotCache/pivotCacheRecords1.xml': `<pivotCacheRecords ${NS.s}><r><x v="1"/><n v="0.31"/></r></pivotCacheRecords>`,
  }, { types: { 'xl/pivotCache/pivotCache/pivotCacheRecords1.xml': O + 'spreadsheetml.pivotCacheRecords+xml' } });
  assert.ok(xlsxText(book).split('\n').includes('Kestrel Labs\t0.31'));
});

test('ZIP: a Unicode Path field that renames an entry makes the file ambiguous; one that agrees is fine', () => {
  const field = (name, forName = 'word/document.xml') => { const u = Buffer.from(name, 'utf8'), f = Buffer.alloc(9 + u.length); f.writeUInt16LE(0x7075, 0); f.writeUInt16LE(5 + u.length, 2); f[4] = 1; f.writeUInt32LE(crc32(Buffer.from(forName)), 5); u.copy(f, 9); return f; };
  const doc = (extra) => officeZip('docx', { 'word/document.xml': wdoc(para('Body text')) }, { zip: { extra: { 'word/document.xml': extra } } });
  assert.equal(reason('swapped.docx', doc(field('word/other.xml'))), 'ambiguous_name');
  assert.equal(docxText(doc(field('word/document.xml'))), 'Body text');
  assert.equal(docxText(doc(field('word/other.xml', 'stale/name.xml'))), 'Body text'); // a stale field (CRC of another name) is ignored
});

test('DOCX: a part whose name is percent-encoded and not ASCII is found through its relationship', () => {
  const docx = officeZip('docx', {
    'word/document.xml': wdoc(para('Body')), 'word/en-tête1.xml': `<w:hdr ${NS.w}>${para('Header: client list')}</w:hdr>`,
    'word/_rels/document.xml.rels': relsXml([['rId1', 'header', 'en-t%C3%AAte1.xml']]),
  }, { types: { 'word/en-tête1.xml': '' } });
  // The override names the part percent-encoded, as OPC requires.
  const types = Buffer.from(readEntry(docx, listEntries(docx).get('[Content_Types].xml'))).toString('utf8').replace('</Types>', `<Override PartName="/word/en-t%C3%AAte1.xml" ContentType="${O}wordprocessingml.header+xml"/></Types>`);
  const out = {}; for (const [n, e] of listEntries(docx)) out[n] = n === '[Content_Types].xml' ? types : Buffer.from(readEntry(docx, e));
  assert.equal(docxText(makeZip(out)), 'Body\nHeader: client list');
});

// ---- PDF work bounds ---------------------------------------------------------------------------
const quick = (fn, limit = 1500) => { const [out, ms] = timed(fn); assert.ok(ms < limit, `took ${Math.round(ms)} ms`); return out; };

test('PDF: object headers are found in linear time past a long run of digits', () => {
  const pdf = onePage('BT /F1 12 Tf 72 720 Td (Gate code 4417) Tj ET', { prefix: '%' + '7'.repeat(200000) + '\n' });
  assert.equal(quick(() => pdfText(pdf)), 'Gate code 4417');
});

test('PDF: tens of thousands of text runs stay linear; unsupported inline images fail closed', () => {
  const runs = Array.from({ length: 40000 }, (_, i) => `(w${i % 10}) Tj 0 -14 Td`).join(' ');
  const text = quick(() => pdfText(onePage(`BT /F1 12 Tf 72 720 Td ${runs} ET`)));
  assert.equal(text.split(/\s+/).length, 40000);
  const images = 'q 1 0 0 1 0 0 cm BI /W 1 /H 1 /CS /G /BPC 8 ID x EI Q\n'.repeat(20000);
  quick(() => assert.throws(() => pdfText(onePage(images + 'BT /F1 12 Tf 72 720 Td (After the images) Tj ET')), /scan_rendering/));
});

test('PDF: forms drawing forms, too many decoded bytes or huge font ranges fail as too complex within a second', () => {
  // Form k draws form k+1 a hundred times: 100^4 runs of the innermost form.
  const forms = [];
  for (let k = 0; k < 5; k++) {
    const body = k === 4 ? 'BT /F1 12 Tf (deep) Tj ET' : `q /X${k + 1} Do Q `.repeat(100);
    forms.push(stream(body, { dict: `/Type /XObject /Subtype /Form /BBox [0 0 10 10] /Resources << /Font << /F1 4 0 R >> /XObject << ${k < 4 ? `/X${k + 1} ${7 + k} 0 R` : ''} >> >>` }));
  }
  assert.equal(quick(() => reason('forms.pdf', onePage('/X0 Do', { more: forms, resources: '/XObject << /X0 6 0 R >>' }))), 'too_complex');
  // Four forms of 9 MiB of spaces each: 36 MiB decoded from a few kilobytes.
  const big = [0, 1, 2, 3].map(() => stream(Buffer.alloc(9 * 1024 * 1024, 0x20), { flate: true, dict: '/Type /XObject /Subtype /Form /BBox [0 0 10 10]' }));
  const many = onePage('/A Do /B Do /C Do /D Do', { more: big, resources: '/XObject << /A 6 0 R /B 7 0 R /C 8 0 R /D 9 0 R >>' });
  assert.ok(many.length < 200000);
  assert.equal(quick(() => reason('bytes.pdf', many)), 'too_complex');
  // A ToUnicode map whose ranges together fill millions of codes.
  const ranges = Array.from({ length: 40 }, () => '<0000> <FFFF> <0041>').join('\n');
  const cmap = `/CIDInit /ProcSet findresource begin begincmap 1 begincodespacerange <0000> <FFFF> endcodespacerange 40 beginbfrange\n${ranges}\nendbfrange endcmap end`;
  const font = makePdf(['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type0 /BaseFont /Fake /Encoding /Identity-H /DescendantFonts [6 0 R] /ToUnicode 7 0 R >>',
    stream('BT /F1 12 Tf 72 720 Td <00010002> Tj ET'), '<< /Type /Font /Subtype /CIDFontType2 /BaseFont /Fake /DW 500 >>', stream(cmap)]);
  assert.equal(quick(() => reason('cmap.pdf', font)), 'too_complex');
});

// ---- PDF text that was refused as unmapped or garbled --------------------------------------------
const encoded = (differences, shown) => makePdf(['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>',
  `<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding << /Type /Encoding /Differences [${differences}] >> >>`, stream(`BT /F1 12 Tf 72 720 Td ${shown} ET`)]);

test('PDF: standard glyph names, variants and ligatures map to their characters; private names do not', () => {
  assert.equal(pdfText(encoded('65 /eacute /f_f_i /zero.oldstyle /germandbls /quotedblbase /Lslash', '(ABCDEF) Tj')), 'éffi0ß„Ł');
  assert.equal(reason('private.pdf', encoded('65 /g0024 /g0025', '(ABAB) Tj')), 'unmapped_font');
});

test('PDF: scripts with combining marks and a few symbol-font glyphs read; text made of symbols or mojibake does not', () => {
  // Thai with its combining vowel signs, by Unicode glyph names.
  assert.equal(pdfText(encoded('65 /uni0E40 /uni0E23 /uni0E35 /uni0E22 /uni0E19', '(ABCDE) Tj')), 'เรียน');
  // A Wingdings-style bullet (private use) before ordinary text.
  const bullet = encoded('65 /uniF0B7', '(A) Tj ( Visit the North Hall site on Tuesday morning with Kate and the crane crew) Tj');
  assert.equal(pdfText(bullet), '\uf0b7 Visit the North Hall site on Tuesday morning with Kate and the crane crew');
  assert.equal(reason('symbols.pdf', encoded('65 /uniF0B7 /uniF0A7', '(ABABABAB) Tj')), 'garbled');
  // GBK bytes read as Latin-1: soft hyphens inside the "words" give it away.
  assert.equal(reason('mojibake.pdf', encoded('', '(\\324\\255\\324\\362 \\241\\255\\241\\255 \\300\\255\\266\\324 \\271\\330 \\323\\332) Tj')), 'garbled');
});
