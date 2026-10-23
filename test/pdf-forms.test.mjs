// PDF text outside the page content: form field values, annotation text and appearances. Hand-built
// PDFs with synthetic content; a form or note the reader can't read makes the file "can't check".
import test from 'node:test';
import assert from 'node:assert/strict';
import { deflateSync } from 'node:zlib';
import { pdfText } from '../core/extract/pdf.mjs';
import { attachmentText } from '../core/attachments.mjs';
import { checkDraft } from '../core/gate.mjs';
import { CONFIG, DAN, CLEAN_BODY, draft } from './helpers.mjs';

// Objects in order (object n is objects[n - 1]), then a correct cross-reference table.
function makePdf(objects) {
  const parts = [Buffer.from('%PDF-1.7\n', 'latin1')];
  const offsets = [];
  let length = parts[0].length;
  objects.forEach((body, i) => {
    offsets.push(length);
    const chunk = Buffer.concat([Buffer.from(`${i + 1} 0 obj\n`, 'latin1'), Buffer.isBuffer(body) ? body : Buffer.from(body, 'latin1'), Buffer.from('\nendobj\n', 'latin1')]);
    parts.push(chunk);
    length += chunk.length;
  });
  const xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${length}\n%%EOF\n`;
  return Buffer.concat([...parts, Buffer.from(xref, 'latin1')]);
}
const stream = (content, { flate = false, dict = '' } = {}) => {
  const data = flate ? deflateSync(Buffer.from(content, 'latin1')) : Buffer.from(content, 'latin1');
  return Buffer.concat([Buffer.from(`<< /Length ${data.length} ${flate ? '/Filter /FlateDecode ' : ''}${dict}>>\nstream\n`, 'latin1'), data, Buffer.from('\nendstream', 'latin1')]);
};
// An object stream holding {number: body}, compressed.
const objectStream = (objs) => {
  const bodies = Object.values(objs);
  let off = 0;
  const header = Object.keys(objs).map((n, i) => { const h = `${n} ${off}`; off += bodies[i].length + 1; return h; }).join(' ') + '\n';
  return stream(header + bodies.join('\n'), { flate: true, dict: `/Type /ObjStm /N ${bodies.length} /First ${header.length} ` });
};
const FONT = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
const page = (annots = '') => `<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R ${annots}>>`;
const content = (text) => stream(`BT /F1 12 Tf 72 720 Td (${text}) Tj ET`);
// Objects 1-5: catalog (with `catalog` extra), pages, one page (with `annots`), font, content.
const base = ({ catalog = '', annots = '', text = 'Direct deposit form' } = {}) => [`<< /Type /Catalog /Pages 2 0 R ${catalog}>>`, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', page(annots), FONT, content(text)];
const b64 = (buf) => Buffer.from(buf).toString('base64');
const file = (name, buf) => ({ id: name, name, size: buf.length, type: 'file', content: b64(buf) });

test('PDF: filled form fields and comments are read after the page text', async () => {
  const pdf = makePdf([...base({ catalog: '/AcroForm 6 0 R ', annots: '/Annots [7 0 R 8 0 R 9 0 R 10 0 R] ' }),
    '<< /Fields [7 0 R 8 0 R 11 0 R] >>',
    '<< /Type /Annot /Subtype /Widget /FT /Tx /T (pw) /TU (Password) /V (Tr4ctor!22) /Rect [72 600 300 620] /P 3 0 R >>',
    '<< /Type /Annot /Subtype /Widget /FT /Btn /T (agree) /V /Yes /AS /Yes /Rect [72 560 90 578] /P 3 0 R >>',
    '<< /Type /Annot /Subtype /Text /Contents (The gate code is 4471.) /Rect [400 700 420 720] /Popup 10 0 R >>',
    '<< /Type /Annot /Subtype /Popup /Parent 9 0 R /Rect [420 600 600 700] >>',
    '<< /FT /Tx /T (name) /V <FEFF004B0061007400650020004500780061006D0070006C0065> >>']);
  assert.equal(pdfText(pdf), 'Direct deposit form\nPassword: Tr4ctor!22\nname: Kate Example\nThe gate code is 4471.');
  const r = await checkDraft(draft({ to: [DAN], cc: [], body: { text: CLEAN_BODY, format: 'html' }, attachments: [file('deposit.pdf', pdf)] }), { config: CONFIG });
  assert.ok(r.findings.some((f) => f.category === 'access' && f.place === 'In deposit.pdf'));
});

test('PDF: fields and notes inside a compressed object stream are read, and so is text drawn in a stamp or free-text box', () => {
  // Objects 11-13 live only in the object stream (object 6).
  const pdf = makePdf([...base({ catalog: '/AcroForm 11 0 R ', annots: '/Annots [12 0 R 13 0 R 7 0 R 8 0 R] ' }),
    objectStream({ 11: '<< /Fields [12 0 R] >>', 12: '<< /Type /Annot /Subtype /Widget /FT /Tx /T (acct) /TU (Routing and account) /V (021000021 / 4417229013) /Rect [0 0 1 1] >>', 13: '<< /Type /Annot /Subtype /Text /Contents (Sticky note in a compressed object.) /Rect [0 0 1 1] >>' }),
    '<< /Type /Annot /Subtype /FreeText /Contents (Call me before Friday.) /Rect [0 0 100 20] /AP << /N 9 0 R >> >>',
    '<< /Type /Annot /Subtype /Stamp /Rect [0 0 100 20] /AP << /N 10 0 R >> >>',
    stream('BT /F1 10 Tf 2 5 Td (Call me before Friday.) Tj ET', { dict: '/Type /XObject /Subtype /Form /BBox [0 0 100 20] /Resources << /Font << /F1 4 0 R >> >> ' }),
    stream('BT /F1 10 Tf 2 5 Td (Floor price 410k approved) Tj ET', { dict: '/Type /XObject /Subtype /Form /BBox [0 0 100 20] /Resources << /Font << /F1 4 0 R >> >> ' })]);
  assert.equal(pdfText(pdf), 'Direct deposit form\nRouting and account: 021000021 / 4417229013\nSticky note in a compressed object.\nCall me before Friday.\nFloor price 410k approved');
});

test('PDF: XFA forms, attached files and missing form or note objects can\'t be checked', () => {
  const reason = (pdf) => attachmentText(file('form.pdf', pdf)).reason;
  assert.equal(reason(makePdf([...base({ catalog: '/AcroForm 6 0 R ' }), '<< /Fields [] /XFA 7 0 R >>', stream('<xdp:xdp/>')])), 'xfa_form');
  assert.equal(reason(makePdf(base({ catalog: '/Names << /EmbeddedFiles << /Names [(a.xlsx) 6 0 R] >> >> ' }).concat(['<< /Type /Filespec /F (a.xlsx) >>']))), 'pdf_attachment');
  assert.equal(reason(makePdf(base({ annots: '/Annots [6 0 R] ' }).concat(['<< /Type /Annot /Subtype /FileAttachment /FS << /F (a.xlsx) >> /Rect [0 0 1 1] >>']))), 'pdf_attachment');
  assert.equal(reason(makePdf(base({ annots: '/Annots [6 0 R 40 0 R] ' }).concat(['<< /Type /Annot /Subtype /Text /Contents (ok) /Rect [0 0 1 1] >>']))), 'annotation_unreadable');
  assert.equal(reason(makePdf(base({ catalog: '/AcroForm 6 0 R ' }).concat(['<< /Fields [41 0 R] >>']))), 'form_unreadable');
});

test('PDF: a plain page, a check box, links and a scan with a note read as before', () => {
  assert.equal(pdfText(makePdf(base())), 'Direct deposit form');
  const boxes = makePdf([...base({ catalog: '/AcroForm 6 0 R ', annots: '/Annots [7 0 R 8 0 R] ' }), '<< /Fields [7 0 R] /NeedAppearances true >>',
    '<< /Type /Annot /Subtype /Widget /FT /Btn /T (ok) /V /Off /AS /Off /Rect [0 0 1 1] /AP << /N << /Yes 9 0 R /Off 9 0 R >> >> >>',
    '<< /Type /Annot /Subtype /Link /Rect [0 0 1 1] /A << /S /URI /URI (https://portal.example/) >> >>', stream('q 0 0 1 rg 0 0 10 10 re f Q', { dict: '/Type /XObject /Subtype /Form /BBox [0 0 10 10] ' })]);
  assert.equal(pdfText(boxes), 'Direct deposit form');
  const scan = makePdf(['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Annots [5 0 R] >>',
    stream('q 100 0 0 100 72 600 cm /Im1 Do Q'), '<< /Type /Annot /Subtype /Text /Contents (Scanned for the file.) /Rect [0 0 1 1] >>']);
  assert.deepEqual(attachmentText(file('scan.pdf', scan)), { ok: false, reason: 'no_text' });
});

test('a scanned PDF read by OCR also has its filled fields and comments checked', async () => {
  const { attachmentText } = await import('../core/attachments.mjs');
  const { sha256 } = await import('../core/sha256.mjs');
  // A page with no text (the scan) and a sticky note carrying a password.
  const pdf = makePdf([`<< /Type /Catalog /Pages 2 0 R >>`, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', page('/Annots [6 0 R] '), FONT, stream(''),
    '<< /Type /Annot /Subtype /Text /Contents (The password is Tr4ctor!22) /Rect [0 0 1 1] >>']);
  const a = { ...file('scan.pdf', pdf), ocr: { status: 'ready', text: 'Site walk notes', hash: sha256(new Uint8Array(pdf)) } };
  const read = attachmentText(a);
  assert.ok(read.ok, JSON.stringify(read));
  assert.match(read.text, /Site walk notes/);
  assert.match(read.text, /Tr4ctor!22/);
});

test('PDF: a widget\'s appearance is read even when its field value is empty or already read, and fails closed when missing', () => {
  const ap = (text) => stream(`BT /F1 10 Tf 2 5 Td (${text}) Tj ET`, { dict: '/Type /XObject /Subtype /Form /BBox [0 0 200 20] /Resources << /Font << /F1 4 0 R >> >> ' });
  // A text field with an empty value whose appearance shows a password, a field whose appearance
  // repeats its value, a push button with a caption, and a check box drawing its check mark.
  const pdf = makePdf([...base({ catalog: '/AcroForm 6 0 R ', annots: '/Annots [7 0 R 8 0 R 9 0 R 10 0 R] ' }),
    '<< /Fields [7 0 R 8 0 R 9 0 R 10 0 R] >>',
    '<< /Type /Annot /Subtype /Widget /FT /Tx /T (note) /V () /Rect [72 600 300 620] /AP << /N 11 0 R >> >>',
    '<< /Type /Annot /Subtype /Widget /FT /Tx /T (name) /TU (Name) /V (Kate Example) /Rect [72 570 300 590] /AP << /N 12 0 R >> >>',
    '<< /Type /Annot /Subtype /Widget /FT /Btn /Ff 65536 /T (send) /Rect [72 540 200 560] /MK << /CA (Release code 7781) >> >>',
    '<< /Type /Annot /Subtype /Widget /FT /Btn /T (ok) /V /Yes /AS /Yes /Rect [72 510 90 528] /MK << /CA (4) >> /AP << /N << /Yes 13 0 R /Off 13 0 R >> >> >>',
    ap('The password is Tr4ctor!22'), ap('Kate Example'), stream('BT /F1 10 Tf 2 2 Td (4) Tj ET', { dict: '/Type /XObject /Subtype /Form /BBox [0 0 10 10] /Resources << /Font << /F1 4 0 R >> >> ' })]);
  assert.equal(pdfText(pdf), 'Direct deposit form\nName: Kate Example\nThe password is Tr4ctor!22\nRelease code 7781');
  assert.equal(attachmentText(file('form.pdf', pdf)).ok, true);
  // An appearance that points at an object that isn't there can't be checked.
  const missing = makePdf([...base({ catalog: '/AcroForm 6 0 R ', annots: '/Annots [7 0 R] ' }), '<< /Fields [7 0 R] >>',
    '<< /Type /Annot /Subtype /Widget /FT /Tx /T (note) /V () /Rect [0 0 1 1] /AP << /N 40 0 R >> >>']);
  assert.equal(attachmentText(file('form.pdf', missing)).reason, 'annotation_unreadable');
  // An appearance drawing with a font that is nowhere can't be read, unless what it draws is empty.
  const fontless = (shown) => makePdf([...base({ catalog: '/AcroForm 6 0 R ', annots: '/Annots [7 0 R] ' }), '<< /Fields [7 0 R] >>',
    '<< /Type /Annot /Subtype /Widget /FT /Tx /T (note) /V () /Rect [0 0 1 1] /AP << /N 8 0 R >> >>',
    stream(`BT /Missing 10 Tf 2 5 Td ${shown} Tj ET`, { dict: '/Type /XObject /Subtype /Form /BBox [0 0 200 20] /Resources << >> ' })]);
  assert.equal(attachmentText(file('form.pdf', fontless('(Secret)'))).reason, 'unmapped_font');
  assert.equal(pdfText(fontless('()')), 'Direct deposit form');
});
