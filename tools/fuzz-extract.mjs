// Deterministic mutation fuzzing, no dependencies and no document contents in receipts.
// The shared corpus worker calls the actual attachment path in a fresh bounded child.
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { resolve, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runFile, summarize, sha256, sourceReceipt } from './corpus-check.mjs';
import { officeZip, wdoc, para, NS, sheet, slide, shape } from '../test/office-fixture.mjs';
import { makePdf, stream, onePage } from '../test/pdf-fixture.mjs';

const own = fileURLToPath(import.meta.url), root = resolve(dirname(own), '..');
export const rngFor = (seed, index) => {
  let x = (seed ^ Math.imul(index + 1, 0x9e3779b9)) >>> 0;
  return n => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) % n; };
};
const book = (body) => officeZip('xlsx', { 'xl/workbook.xml': `<workbook ${NS.s} ${NS.r}><sheets><sheet name="S" sheetId="1" r:id="rId1"/></sheets></workbook>`, 'xl/worksheets/sheet1.xml': body });
const doc = body => officeZip('docx', { 'word/document.xml': wdoc(body) });
const twoStreams = text => makePdf([
  '<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents [5 0 R 6 0 R] >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
  stream('BT /F1 12 Tf (Visible first stream) Tj ET'), stream(text)]);
export function syntheticSeeds() {
  return [
    { name: 'generated/document.docx', bytes: doc(para('Synthetic completeness sentinel')) },
    { name: 'generated/workbook.xlsx', bytes: book(sheet('<row r="1"><c r="A1" t="inlineStr"><is><t>Synthetic cell</t></is></c></row>')) },
    { name: 'generated/slides.pptx', bytes: officeZip('pptx', { 'ppt/presentation.xml': `<p:presentation ${NS.p} ${NS.r}><p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst></p:presentation>`, 'ppt/slides/slide1.xml': slide(shape('Synthetic slide')) }) },
    { name: 'generated/two-streams.pdf', bytes: twoStreams('BT /F1 12 Tf (Last stream sentinel) Tj ET') },
    { name: 'generated/plain.txt', bytes: Buffer.from('Synthetic plain text\nSecond line\n') },
    { name: 'generated/table.csv', bytes: Buffer.from('Item,Quantity\nBolts,12\n') },
  ];
}

export const OPERATIONS = ['bit_flip', 'truncate', 'insert', 'delete', 'zip_central', 'zip_local', 'zip_size', 'xml_depth', 'sheet_dimensions', 'pdf_xref', 'pdf_object_stream', 'pdf_missing_content', 'pdf_unclosed_literal', 'zip_directory_size', 'pdf_missing_page', 'pdf_missing_kids', 'text_utf16_tail'];
export function mutate(seeds, seed, index) {
  const rnd = rngFor(seed, index), op = OPERATIONS[index % OPERATIONS.length];
  let chosen = seeds[rnd(seeds.length)], bytes = Buffer.from(chosen.bytes), mustReject = false;
  const use = suffix => { chosen = seeds.find(s => s.name === 'generated/' + suffix); bytes = Buffer.from(chosen.bytes); };
  if (op.startsWith('zip_')) {
    use(['document.docx', 'workbook.xlsx', 'slides.pptx'][rnd(3)]);
    bytes.writeUInt32LE(index + 1, 10); // harmless DOS timestamp; unique structured variants
    const central = bytes.indexOf(Buffer.from('504b0102', 'hex')), end = bytes.length - 22;
    if (op === 'zip_central') { bytes.writeUInt32LE(0xffffffff, central + 42); mustReject = true; }
    if (op === 'zip_local') { bytes.writeUInt16LE(bytes.readUInt16LE(6) | 1, 6); mustReject = true; }
    if (op === 'zip_size') { bytes.writeUInt32LE(0x7fffffff - rnd(100), central + 24); mustReject = true; }
    if (op === 'zip_directory_size') { bytes.writeUInt32LE(rnd(10), end + 12); mustReject = true; }
  } else if (op === 'xml_depth') {
    use('document.docx'); const depth = 257 + rnd(2048);
    bytes = doc('<w:p>'.repeat(depth) + para('Synthetic deep text ' + index) + '</w:p>'.repeat(depth)); mustReject = true;
  } else if (op === 'sheet_dimensions') {
    use('workbook.xlsx'); const n = 2147483647 - rnd(100000);
    bytes = book(`<worksheet ${NS.s}><dimension ref="A1:XFD${n}"/><sheetData><row r="${n}"><c r="XFE${n}" t="inlineStr"><is><t>Synthetic distant cell ${index}</t></is></c></row></sheetData></worksheet>`); mustReject = true;
  } else if (op.startsWith('pdf_')) {
    use('two-streams.pdf');
    if (op === 'pdf_xref') { const at = bytes.lastIndexOf(Buffer.from('startxref\n')) + 10; bytes[at] = 0x39; }
    if (op === 'pdf_object_stream') {
      // A referenced content object has an invalid object-stream wrapper instead of a text stream.
      bytes = twoStreams('BT /F1 12 Tf (Synthetic last stream) Tj ET');
      const s = bytes.toString('latin1'); bytes = Buffer.from(s.replace('6 0 obj\n<<', '6 0 obj\n<< /Type /ObjStm /N 2147483647 /First 2147483647 '), 'latin1');
      mustReject = true;
    }
    if (op === 'pdf_missing_content') {
      const at = bytes.indexOf(Buffer.from('6 0 obj')); bytes[at] = 0x37; mustReject = true;
    }
    if (op === 'pdf_missing_page') {
      bytes = Buffer.from(bytes.toString('latin1').replace('/Kids [3 0 R] /Count 1', '/Kids [3 0 R 99 0 R] /Count 2'), 'latin1'); mustReject = true;
    }
    if (op === 'pdf_missing_kids') {
      bytes = makePdf(['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>',
        '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', stream('BT /F1 12 Tf (Complete first page) Tj ET'),
        '<< /Type /Pages /Parent 2 0 R /Count 1 >>']); mustReject = true;
    }
    if (op === 'pdf_unclosed_literal') {
      bytes = twoStreams('BT /F1 12 Tf (' + 'x'.repeat(1 + rnd(128))); mustReject = true;
    }
    bytes = Buffer.concat([bytes, Buffer.from('\n% fuzz variant ' + index + '\n')]);
  } else if (op === 'text_utf16_tail') {
    use(rnd(2) ? 'plain.txt' : 'table.csv');
    const body = Buffer.from('Synthetic UTF16 text ' + index, 'utf16le'), be = rnd(2);
    if (be) body.swap16();
    bytes = Buffer.concat([Buffer.from(be ? [0xfe, 0xff] : [0xff, 0xfe]), body, Buffer.from([rnd(256)])]); mustReject = true;
  } else if (op === 'bit_flip' && bytes.length) {
    for (let j = 0, n = 1 + rnd(8); j < n; j++) bytes[rnd(bytes.length)] ^= 1 << rnd(8);
  } else if (op === 'truncate') bytes = bytes.subarray(0, rnd(bytes.length + 1));
  else if (op === 'insert') {
    const at = rnd(bytes.length + 1), inserted = Buffer.alloc(1 + rnd(64));
    for (let j = 0; j < inserted.length; j++) inserted[j] = rnd(256);
    bytes = Buffer.concat([bytes.subarray(0, at), inserted, bytes.subarray(at)]);
  } else if (op === 'delete' && bytes.length) {
    const at = rnd(bytes.length); bytes = Buffer.concat([bytes.subarray(0, at), bytes.subarray(at + 1 + rnd(64))]);
  }
  return { bytes, seedName: chosen.name, kind: extname(chosen.name).slice(1), operation: op, mustReject };
}

async function main(args) {
  const option = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
  const output = args[0], seed = Number(option('--seed') || 20261024), start = Number(option('--start') || 0), count = Number(option('--count') || 1000);
  const sourceRoot = resolve(option('--source') || root);
  if (!output || ![seed, start, count].every(Number.isSafeInteger) || seed < 0 || start < 0 || count < 1 || count > 5000) throw new Error('Usage: node tools/fuzz-extract.mjs output.json [--seed 20261024] [--start 0] [--count 1000] [--seed-dir ../dg-email-corpus-real/files] [--source ../source-snapshot]');
  const seeds = syntheticSeeds();
  for (const name of (await readdir(resolve(root, 'test/fixtures'))).sort()) {
    if (/\.(pdf|docx|xlsx|pptx|csv|txt)$/i.test(name)) seeds.push({ name: 'fixture/' + name, bytes: await readFile(resolve(root, 'test/fixtures', name)) });
  }
  if (option('--seed-dir')) {
    const seedRoot = resolve(option('--seed-dir')), paths = [];
    async function walk(dir) {
      for (const e of await readdir(dir, { withFileTypes: true })) {
        if (e.isSymbolicLink() || e.name === 'archives') continue;
        const path = resolve(dir, e.name);
        if (e.isDirectory()) await walk(path);
        else if (/\.(pdf|docx|xlsx|pptx|csv|txt|doc|xls|ppt|rtf)$/i.test(e.name)) paths.push(path);
      }
    }
    await walk(seedRoot); const counts = {};
    for (const path of paths.sort()) {
      const kind = extname(path).toLowerCase();
      if ((counts[kind] || 0) >= 3) continue;
      const bytes = await readFile(path); if (bytes.length > 1024 * 1024) continue;
      seeds.push({ name: 'corpus/' + relative(seedRoot, path).replace(/\\/g, '/'), bytes }); counts[kind] = (counts[kind] || 0) + 1;
    }
  }
  const work = resolve(root, '.qa/fuzz-' + start); await mkdir(work, { recursive: true });
  const rows = [], begin = performance.now(), findings = [];
  const code = await sourceReceipt(sourceRoot);
  for (let index = start; index < start + count; index++) {
    const v = mutate(seeds, seed, index), path = resolve(work, 'variant.' + v.kind);
    await writeFile(path, v.bytes);
    const row = { index, seedName: v.seedName, operation: v.operation, mustReject: v.mustReject, kind: v.kind, variantSha256: sha256(v.bytes), ...await runFile(path, { sourceRoot, timeoutMs: 2000, heapMiB: 400 }) };
    if (['crash', 'timeout'].includes(row.outcome) || (v.mustReject && row.native?.ok)) {
      row.finding = row.native?.ok ? 'incomplete_accepted' : row.outcome; findings.push(row);
    }
    rows.push(row);
    if (rows.length % 100 === 0) console.log(JSON.stringify({ checked: rows.length, count, findings: findings.length }));
  }
  if ((await sourceReceipt(sourceRoot)).sha256 !== code.sha256) throw new Error('source changed during fuzz run');
  const summary = { at: new Date().toISOString(), node: process.version, code, harnessSha256: sha256(await readFile(own)), seed, start, count, timeoutMs: 2000, childHeapMiB: 400,
    seeds: seeds.map(s => ({ name: s.name, bytes: s.bytes.length, sha256: sha256(s.bytes) })),
    wallMs: +(performance.now() - begin).toFixed(2), ...summarize(rows), findings };
  await mkdir(dirname(resolve(output)), { recursive: true }); await writeFile(resolve(output), JSON.stringify(summary, null, 2) + '\n');
  await rm(work, { recursive: true }); // the exact temporary directory created by this invocation
  console.log(JSON.stringify({ files: rows.length, findings: findings.length, output }));
  if (findings.length) process.exitCode = 1;
}
if (resolve(process.argv[1] || '') === own) await main(process.argv.slice(2));
