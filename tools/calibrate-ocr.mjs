// Synthetic-only, sequential, offline after npm ci. No held-out data or hosted services.
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { readImage } from '../outlook/ocr-recognize.mjs';
import { compactOcr, decideOcr, OCR_POLICY } from '../core/ocr-policy.mjs';
sharp.concurrency(1); sharp.cache(false);
const root = fileURLToPath(new URL('../', import.meta.url));
const dir = resolve(root, '.qa/ocr-calibration');
await mkdir(dir, { recursive: true });
await mkdir(resolve(root, 'evaluation/ocr-calibration'), { recursive: true });
const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const svg = (w, h, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`);
const cases = [];
const texts = ['The password is Tr4ctor22. Gate code is 4471.', 'Our margin is 18 percent. Our cost is $4000.', 'The crane arrives Tuesday. Please confirm delivery.'];
for (const [phrase, text] of texts.entries()) for (const size of [6, 8, 10, 14, 20, 30]) for (const quality of ['clean', 'jpeg', 'photo', 'blur']) {
  const w = Math.ceil(size * 31 + 40), h = size * 5 + 40;
  const body = `<rect width="100%" height="100%" fill="${quality === 'photo' ? '#e5dfcd' : 'white'}"/><g font-family="Arial" font-size="${size}" fill="#1c2025"><text x="20" y="${size + 20}">${escape(text.slice(0, text.indexOf('.') + 1))}</text><text x="20" y="${size * 2.6 + 20}">${escape(text.slice(text.indexOf('.') + 1).trim())}</text></g>`;
  let image = sharp(svg(w, h, body));
  if (quality === 'blur') image = image.blur(1.8);
  if (quality === 'photo') image = image.rotate(4, { background: '#c1baa9' }).blur(0.6).modulate({ brightness: 0.9 });
  if (quality === 'jpeg') image = image.jpeg({ quality: 22 }); else image = image.png();
  let bytes = await image.toBuffer();
  if (quality === 'photo') {
    const { data, info } = await sharp(bytes).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let seed = 713 + size + phrase;
    for (let i = 0; i < data.length; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; data[i] = Math.max(0, Math.min(255, data[i] + (seed >>> 28) - 8)); }
    bytes = await sharp(data, { raw: info }).jpeg({ quality: 65 }).toBuffer();
  }
  cases.push({ id: `text-${phrase}-${size}-${quality}`, kind: 'text', expected: text, size, quality, bytes });
}
for (let i = 0; i < 12; i++) {
  const shape = i < 6 ? `<defs><linearGradient id="g"><stop stop-color="hsl(${i * 40},45%,35%)"/><stop offset="1" stop-color="hsl(${i * 40 + 90},65%,80%)"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/>` : `<rect width="100%" height="100%" fill="#95bde0"/><circle cx="${70 + i * 22}" cy="65" r="33" fill="#ffe395"/><path d="M0 240 L170 70 L310 230 L440 95 L640 260 V360 H0Z" fill="#55775c"/><path d="M0 310 L220 230 L500 280 L640 220 V360 H0Z" fill="#aaa17f"/><rect x="${80 + i * 17}" y="170" width="100" height="80" fill="#bb7351"/><path d="M${60 + i * 17} 170 l70 -60 l70 60Z" fill="#565452"/>`;
  cases.push({ id: `empty-${i}`, kind: i < 6 ? 'gradient' : 'scene', expected: '', bytes: await sharp(svg(640, 360, shape)).png().toBuffer() });
}
for (const size of [1, 8, 16, 24, 32, 48]) for (const text of ['', '4471']) {
  cases.push({ id: `logo-${size}-${text || 'shape'}`, kind: text ? 'tiny-text' : 'logo', expected: text, size, bytes: await sharp(svg(size, size, `<rect width="100%" height="100%" fill="white"/>${text ? `<text x="0" y="${size * 0.7}" font-family="Arial" font-size="${size / 3}">${text}</text>` : `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="#486b9a"/>`}`)).png().toBuffer() });
}
// Same text in all requested containers. Leptonica reads the original bytes, not a browser IMG.
const base = cases.find(c => c.id === 'text-1-30-clean');
for (const format of ['png', 'jpeg', 'gif', 'tiff', 'webp']) cases.push({ id: `format-${format}`, kind: 'format', expected: base.expected, bytes: await sharp(base.bytes).toFormat(format, format === 'tiff' ? { compression: 'none' } : {}).toBuffer() });
// BMP via a small uncompressed 24-bit encoder; sharp does not write BMP.
const raw = await sharp(base.bytes).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const stride = (raw.info.width * 3 + 3) & ~3, bmp = Buffer.alloc(54 + stride * raw.info.height);
bmp.write('BM'); bmp.writeUInt32LE(bmp.length, 2); bmp.writeUInt32LE(54, 10); bmp.writeUInt32LE(40, 14); bmp.writeInt32LE(raw.info.width, 18); bmp.writeInt32LE(raw.info.height, 22); bmp.writeUInt16LE(1, 26); bmp.writeUInt16LE(24, 28);
for (let y = 0; y < raw.info.height; y++) for (let x = 0; x < raw.info.width; x++) for (let c = 0; c < 3; c++) bmp[54 + (raw.info.height - 1 - y) * stride + x * 3 + c] = raw.data[(y * raw.info.width + x) * 3 + 2 - c];
cases.push({ id: 'format-bmp', kind: 'format', expected: base.expected, bytes: bmp });
let rows;
if (process.argv.includes('--reuse')) rows = JSON.parse(await readFile(resolve(dir, 'raw.json'), 'utf8'));
else {
  const worker = await createWorker('eng', 1, { corePath: resolve(root, 'node_modules/tesseract.js-core/tesseract-core-lstm.js'), langPath: resolve(root, 'node_modules/@tesseract.js-data/eng/4.0.0_best_int'), cacheMethod: 'none', gzip: true, errorHandler: () => {} });
  rows = [];
  try {
    for (const c of cases) {
      const path = resolve(dir, c.id + (c.id === 'format-bmp' ? '.bmp' : '.png'));
      await writeFile(path, c.bytes);
      const started = performance.now();
      let result;
      try { result = await readImage(worker, c.bytes); } catch { result = { reads: [], status: 'failed', reason: 'decode' }; }
      const { bytes, ...meta } = c;
      rows.push({ ...meta, bytes: bytes.length, ...result, ms: Math.round(performance.now() - started) });
      console.log(c.id, result.status, result.reads.map(r => `${r.mean}/${r.word.toFixed(1)}:${r.text}`).join(' | '));
    }
  } finally { await worker.terminate(); }
  await writeFile(resolve(dir, 'raw.json'), JSON.stringify(rows, null, 2) + '\n');
}
// Exhaustively select the pair that accepts most complete correct nonempty reads with no incorrect
// accepted text. Ties choose higher word, then mean confidence. Empty decisions are audited apart.
let best = null;
for (let mean = 0; mean <= 100; mean++) for (let word = 0; word <= 100; word++) {
  const accepted = rows.filter(r => { const d = decideOcr(r.reads, { ...OCR_POLICY, mean, word }); return d.status === 'ready' && d.text; });
  const wrong = accepted.filter(r => compactOcr(r.text || r.reads[0]?.text) !== compactOcr(r.expected));
  if (wrong.length) continue;
  if (!best || accepted.length > best.accepted || (accepted.length === best.accepted && (word > best.word || (word === best.word && mean > best.mean)))) best = { mean, word, accepted: accepted.length };
}
const emptyErrors = rows.filter(r => r.expected && decideOcr(r.reads).reason === 'no_text');
let emptyFit;
for (const side of [1, 2, 4, 8, 16, 32, 64, 128]) for (let small = 0; small <= 32; small++) {
  const accepted = rows.filter(r => decideOcr(r.reads, { ...OCR_POLICY, emptyMinSide: side, emptySmall: small }).reason === 'no_text');
  if (accepted.some(r => r.expected)) continue;
  if (!emptyFit || accepted.length > emptyFit.accepted || accepted.length === emptyFit.accepted && (small < emptyFit.emptySmall || small === emptyFit.emptySmall && side < emptyFit.emptyMinSide)) emptyFit = { emptySmall: small, emptyMinSide: side, accepted: accepted.length };
}
best = { ...OCR_POLICY, ...best };
const kinds = {};
for (const row of rows) { const d = decideOcr(row.reads, best), key = row.kind; kinds[key] ||= { total: 0, readyText: 0, readyEmpty: 0, failed: 0 }; kinds[key].total++; kinds[key][d.status === 'ready' ? d.text ? 'readyText' : 'readyEmpty' : 'failed']++; }
const out = { engine: 'tesseract.js 7.0.0 / core 7.0.0 / eng 4.0.0_best_int', method: 'PSM 11 and 6, rotateAuto, exact case/punctuation agreement, minimum word and page mean confidence sweep 0..100', best, emptyFit, kinds, emptyErrors: emptyErrors.map(r => r.id), rows: rows.map(({ ms, ...r }) => ({ ...r, decision: decideOcr(r.reads, best) })) };
await writeFile(resolve(root, 'evaluation/ocr-calibration/results.json'), JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ samples: rows.length, best, emptyFit, kinds, emptyErrors: out.emptyErrors }));
