import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { imageInfo } from '../core/image-info.mjs';
import { pdfImages } from '../core/extract/pdf.mjs';
import { OCR_POLICY, decideOcr, compactOcr, tinyInline } from '../core/ocr-policy.mjs';
import { ocrPaths, OCR_ASSETS } from '../outlook/ocr-config.mjs';
import { createOcrService, validEntry } from '../outlook/ocr-service.mjs';
import { STRINGS } from '../core/copy.mjs';
import { sha256 } from '../core/sha256.mjs';
import { makeZip } from './zip-fixture.mjs';
import { officeZip, wdoc } from './office-fixture.mjs';
import { load, demo, plain } from './runtime-helper.mjs';
import { CLEAN_BODY } from './helpers.mjs';

const ok = value => ({ status: 'succeeded', value });
const delay = ms => new Promise(r => setTimeout(r, ms));
const header = (width = 640, height = 360) => { const b = Buffer.alloc(33); b.set([137,80,78,71,13,10,26,10]); b.writeUInt32BE(13,8); b.write('IHDR',12); b.writeUInt32BE(width,16); b.writeUInt32BE(height,20); return b; };
const png = header().toString('base64');
const file = (extra = {}) => ({ id: 'i', name: 'photo.png', size: 33, type: 'file', attachmentType: 'file', ...extra });
const cached = (a, extra) => JSON.stringify({ version: 1, attachments: { [a.id]: { name: a.name, size: a.size, hash: sha256(header()), ...extra } } });
const browserGlobals = recognize => ({ document: {}, Worker: function() {}, DisclosureGateOcrEngine: { recognize, close: async () => {} } });
function harness(recognize = async () => ({ status: 'ready', text: '' })) {
  let attachments = [file()], reads = 0; const values = {};
  const item = { getAttachmentsAsync: cb => cb(ok(attachments)), getAttachmentContentAsync: (_id, cb) => { reads++; cb(ok({ format: 'base64', content: png })); }, sessionData: { getAsync: (key, cb) => cb(ok(values[key])), setAsync: (key, value, cb) => { values[key] = value; cb(ok()); } } };
  const office = { context: { mailbox: { item } } }, service = createOcrService({ ...browserGlobals(recognize), WebAssembly, BigInt });
  return { office, service, values, item, get reads() { return reads; }, replace: a => { attachments = a; } };
}

test('OCR decisions require agreement and calibrated confidence; empty reads need pixel evidence', () => {
  const read = { text: 'Gate code is 4471.', mean: 96, word: 94, words: 4 };
  assert.equal(decideOcr([read, read]).status, 'ready');
  for (const second of [{ ...read, word: OCR_POLICY.word - 0.01 }, { ...read, mean: OCR_POLICY.mean - 1 }, { ...read, text: 'Gate code is 4417.' }, { ...read, mean: NaN }]) assert.equal(decideOcr([read, second]).status, 'failed');
  const blank = { text: '', words: 0, mean: 0, pixels: { width: 640, height: 360, small: 0 } };
  assert.deepEqual(decideOcr([blank, blank]), { status: 'ready', text: '', reason: 'no_text' });
  assert.equal(decideOcr([blank, { ...blank, pixels: { ...blank.pixels, small: 12 } }]).status, 'failed');
  assert.equal(decideOcr([{ ...blank, pixels: null }, blank]).status, 'failed');
  assert.equal(tinyInline({ isInline: true, size: 160 }, { width: 8, height: 8 }), true);
  assert.equal(tinyInline({ isInline: true, size: 300 }, { width: 16, height: 16 }), false);
  assert.equal(tinyInline({ isInline: false, size: 300 }, { width: 1, height: 1 }), false);
});
test('recorded synthetic calibration has no incorrect accepted text or false empty clearance', () => {
  const data = JSON.parse(readFileSync(new URL('../evaluation/ocr-calibration/results.json', import.meta.url)));
  for (const key of Object.keys(OCR_POLICY)) assert.equal(data.best[key], OCR_POLICY[key], key);
  assert.equal(data.emptyFit.emptyMinSide, OCR_POLICY.emptyMinSide); assert.equal(data.emptyFit.emptySmall, OCR_POLICY.emptySmall);
  assert.deepEqual(data.emptyErrors, []);
  for (const row of data.rows) {
    const d = decideOcr(row.reads);
    if (d.status === 'ready') assert.equal(compactOcr(d.text), compactOcr(row.expected), row.id);
  }
});
test('every OCR path is explicitly relative, same-origin, and rejects CDN substitutions', () => {
  for (const page of ['https://static.example/sub/commands.html?dg=2', 'https://localhost:3443/nested/taskpane.html']) {
    const paths = ocrPaths(page);
    for (const [key, value] of Object.entries(paths)) { assert.equal(new URL(value).origin, new URL(page).origin); assert.ok(value.includes('/ocr/')); assert.ok(OCR_ASSETS[key].startsWith('./')); }
    for (const key of Object.keys(OCR_ASSETS)) for (const path of ['https://cdn.example/ocr.js', '//cdn.example/x', '/ocr/x', '../x', './x?remote=1', './x#x', './x\\x']) assert.throws(() => ocrPaths(page, { ...OCR_ASSETS, [key]: path }), /ocr_origin/);
  }
});
test('build vendors the original worker, WASM, English data and licences; classic excludes engine', () => {
  const dist = new URL('../dist/ocr/', import.meta.url);
  for (const [to, from] of [['worker.min.js','tesseract.js/dist/worker.min.js'],['tesseract-core-lstm.wasm','tesseract.js-core/tesseract-core-lstm.wasm'],['lang/eng.traineddata.gz','@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz']]) assert.deepEqual(readFileSync(new URL(to, dist)), readFileSync(new URL('../node_modules/' + from, import.meta.url)));
  for (const name of ['LICENSE-tesseract.js.txt','LICENSE-tesseract-core.txt','LICENSE-traineddata-Apache-2.0.txt','LICENSE-worker.txt','NOTICE.txt']) assert.ok(statSync(new URL(name, dist)).size > 100);
  assert.ok(readFileSync(new URL('engine.js', dist), 'utf8').includes('workerBlobURL:!1'));
  assert.doesNotMatch(readFileSync(new URL('../dist/runtime.js', import.meta.url), 'utf8'), /cdn\.jsdelivr|TesseractCore/);
});
test('header bounds reject decompression bombs and animated PNG containers', () => {
  assert.deepEqual(imageInfo(header()), { width: 640, height: 360 });
  assert.throws(() => imageInfo(header(100000, 100000)), /image_size/);
  const apng = Buffer.concat([header(), Buffer.alloc(16)]); apng.writeUInt32BE(4,33); apng.write('acTL',37); apng.writeUInt32BE(2,41);
  assert.throws(() => imageInfo(apng), /image_frames/);
  assert.throws(() => imageInfo(Buffer.alloc(20)));
});
test('cache reuses only an exact identity; replacement and removal invalidate persisted results', async () => {
  const h = harness(); await h.service.prepare(h.office); await h.service.wait(h.office, Date.now() + 1000);
  const apply = () => { const a = [file()]; h.service.apply(h.office, a); return a[0].ocr; };
  assert.equal(apply().status, 'ready'); assert.equal(h.reads, 1);
  await h.service.prepare(h.office); assert.equal(h.reads, 1);
  h.replace([file({ name: 'replacement.png', size: 34 })]); await h.service.prepare(h.office); await h.service.wait(h.office, Date.now() + 1000);
  assert.equal(apply(), undefined); assert.equal(h.reads, 2);
  h.replace([]); await h.service.prepare(h.office); assert.deepEqual(JSON.parse(h.values['dg-ocr-v1']).attachments, {});
});

test('service validation and apply retain exact id/name/size/type identity; core verifies fresh bytes', async () => {
  const a=file({content:png}), e={name:a.name,size:a.size,status:'ready',text:'hello',hash:sha256(header())};
  assert.equal(validEntry(a,e),true);
  for(const changed of [{...a,name:'different.png'},{...a,size:a.size+1},{...a,type:'item'},{...a,name:'note.txt'}]) assert.equal(validEntry(changed,e),false);
  for(const hash of [undefined,'invalid']) assert.equal(validEntry(a,{...e,hash}),false);
  const h=harness();await h.service.prepare(h.office,[a]);await h.service.wait(h.office,Date.now()+1000);
  const exact={...a},wrongId={...a,id:'different'},wrongName={...a,name:'other.png'},wrongSize={...a,size:a.size+1},wrongType={...a,type:'item'};
  h.service.apply(h.office,[exact,wrongId,wrongName,wrongSize,wrongType]);
  assert.equal(exact.ocr.status,'ready');
  for(const changed of [wrongId,wrongName,wrongSize,wrongType]) assert.equal(changed.ocr,undefined);
  // Same id/name/size still needs matching bytes, including cached failed results.
  const {attachmentText}=await import('../core/attachments.mjs');
  assert.equal(attachmentText({...a,ocr:{...e,hash:'f'.repeat(64)}}).reason,'ocr_hash');
});
test('a removed pending image cannot publish late ready text; same-tuple Added starts fresh', async () => {
  let release; const h = harness(() => new Promise(r => { release = r; }));
  await h.service.prepare(h.office); await delay(5);
  h.replace([]); await h.service.prepare(h.office, null, { attachmentStatus: 'removed', attachmentDetails: { id: 'i' } });
  release({ status: 'ready', text: 'Old image.' }); await delay(5);
  assert.deepEqual(JSON.parse(h.values['dg-ocr-v1']).attachments, {});
  h.replace([file()]); await h.service.prepare(h.office, null, { attachmentStatus: 'added', attachmentDetails: { id: 'i' } }); await delay(5);
  release({ status: 'ready', text: 'New image.' }); await h.service.wait(h.office, Date.now() + 1000);
  assert.equal(JSON.parse(h.values['dg-ocr-v1']).attachments.i.text, 'New image.');
});
test('classic VM screens ready OCR text; an unreadable picture is ignored inline and prompts when attached', async () => {
  for (const isInline of [false, true]) for (const [ocr, expected] of [[{ status: 'ready', text: '' }, true],[{ status: 'ready', text: 'Our margin is 18 percent.' }, false],[{ status: 'failed', reason: 'ocr_low_confidence' }, isInline],[{ status: 'unsupported', reason: 'ocr_unsupported' }, isInline]]) {
    const a = file({ isInline }), l = load({ state: demo({ body: CLEAN_BODY, attachments: [a], contents: { i: png } }), initialValues: { 'dg-ocr-v1': cached(a, ocr) } });
    const done = await l.send();
    assert.equal(done.allowEvent, expected);
    if (!expected && !ocr.text) assert.equal(done.sendModeOverride, 'promptUser');
    if (ocr.text) { const finding = JSON.parse(l.values['dg-result']).result.findings[0]; assert.equal(finding.file, a.name); assert.equal(finding.place, 'In photo.png'); assert.equal(finding.removable, false); }
    assert.ok(l.reads.content.includes('i'));
  }
});
test('VM Send waits for a running OCR job, then screens and re-reads before release', async () => {
  const a = file(); let calls = 0;
  const l = load({ state: demo({ body: CLEAN_BODY, attachments: [a], contents: { i: png } }), globals: browserGlobals(async () => { calls++; await delay(20); return { status: 'ready', text: '' }; }) });
  assert.equal((await l.send()).allowEvent, true); assert.equal(calls, 1);
  assert.equal((await l.send()).allowEvent, true); assert.equal(calls, 1);
});
test('built HTML path stops when the OCR engine itself fails, and accepts image MIME types without an image suffix', async () => {
  for (const fail of [false,true]) {
    const a=file({name:'camera-upload',contentType:'image/png'});
    const l=load({state:demo({body:CLEAN_BODY,attachments:[a],contents:{i:png}}),globals:browserGlobals(async()=>{if(fail)throw new Error('ocr_failed');return {status:'ready',text:''};})});
    assert.equal((await l.send()).allowEvent,!fail);
    if(fail) { const f=JSON.parse(l.values['dg-result']).result.findings[0]; assert.deepEqual([f.subkind,f.severity],['ocr_failed','stop']); }
  }
});
test('OCR queue uses one recognizer at a time and bounds persistent cache without truncating ready text', async () => {
  let active=0,peak=0;
  const h=harness(async()=>{peak=Math.max(peak,++active);await delay(5);active--;return {status:'ready',text:'a'.repeat(15000)};});
  h.replace([file(),file({id:'j',name:'second.png'})]);await h.service.prepare(h.office);await h.service.wait(h.office,Date.now()+1000);
  assert.equal(peak,1);assert.ok(h.values['dg-ocr-v1'].length<=h.service.CACHE_CHARS);
  const entries=JSON.parse(h.values['dg-ocr-v1']).attachments;
  for(const e of Object.values(entries)) {assert.equal(e.status,'failed');assert.equal(e.reason,'ocr_cache_size');assert.equal(e.text,undefined);}
});
test('pending OCR at the Send budget holds once with retry copy; later ready OCR never releases that event', async () => {
  const a = file(), l = load({ state: demo({ body: CLEAN_BODY, attachments: [a], contents: { i: png } }), initialValues: { 'dg-ocr-v1': cached(a, { status: 'pending', at: Date.now() }) } }), outcomes = [];
  await l.api.run({ completed: o => outcomes.push(plain(o)) }, {
    read: (content, options) => l.draftApi.readDraft(l.office, content, null, options),
    check: draft => l.core.checkDraft(draft), pending: () => l.context.DisclosureGateOcr.pending(l.office), phase: () => {}, reviewButton: () => true, deadlineMs: 220,
  });
  assert.equal(outcomes.length, 1); assert.equal(outcomes[0].allowEvent, false); assert.match(outcomes[0].errorMessage, /photo.png is still being read/);assert.match(outcomes[0].errorMessage,/Press Send again to check it again/);
  l.values['dg-ocr-v1'] = cached(a, { status: 'ready', text: '' }); await delay(20); assert.equal(outcomes.length, 1);
  assert.equal((await l.send()).allowEvent, true);
});
test('an OCR-completed clear still holds when attachment metadata changes during the local check', async () => {
  const a = file(), state = demo({ body: CLEAN_BODY, attachments: [a], contents: { i: png } });
  const l = load({ state, initialValues: { 'dg-ocr-v1': cached(a, { status: 'ready', text: '' }) }, check: async (d, o, original) => { const r = await original(d, o); state.attachments = [file({ size: 34 })]; return r; } });
  assert.deepEqual(await l.send(), { allowEvent: false, errorMessage: "Disclosure Gate couldn't check this email. The draft changed during the check. It hasn't been sent. Press Send again to check it again, or ask your IT team." });
});
test('attachment-change and compose events complete exactly once and keep unavailable classic images held', async () => {
  const l = load({ state: demo({ body: CLEAN_BODY, attachments: [file()] }) });
  for (const name of ['onMessageAttachmentsChangedHandler', 'onMessageComposeHandler']) { let n = 0; await l.handlers[name]({ completed: () => n++ }); assert.equal(n, 1); }
  assert.equal(JSON.parse(l.values['dg-ocr-v1']).attachments.i.status, 'unsupported'); assert.equal((await l.send()).allowEvent, false);
});

function scanPdf({ filter = '/DCTDecode', extra = '', second = false } = {}) {
  // A tiny JPEG header suffices for extractor tests; recognition is tested with real containers
  // in the calibration run and browser engine probe.
  const jpeg = Buffer.from([255,216,255,192,0,11,8,0,2,0,2,1,1,0,0,255,217]);
  const data = filter === '/FlateDecode' ? deflateSync(Buffer.alloc(12, 255)) : jpeg;
  const stream = (bytes, dict = '') => Buffer.concat([Buffer.from(`<< /Length ${bytes.length} ${dict} >>\nstream\n`), bytes, Buffer.from('\nendstream')]);
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /Resources << /XObject << /I 4 0 R >> >> /Contents 5 0 R >>', stream(data, `/Type /XObject /Subtype /Image /Width 2 /Height 2 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter ${filter} ${extra}`), stream(Buffer.from('q 2 0 0 2 0 0 cm /I Do Q'))];
  if (second) objects[1] = '<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>', objects.push('<< /Type /Page /Parent 2 0 R >>');
  return Buffer.concat([Buffer.from('%PDF-1.7\n'), ...objects.map((o, i) => Buffer.concat([Buffer.from(`${i + 1} 0 obj\n`), Buffer.from(o), Buffer.from('\nendobj\n')])), Buffer.from('trailer << /Root 1 0 R >>\n%%EOF')]);
}
test('scan extractor reads displayed JPEG and Flate RGB images, refusing partial/unsupported scans', () => {
  const jpg = pdfImages(scanPdf()); assert.equal(jpg.length, 1); assert.deepEqual(imageInfo(jpg[0].bytes), { width: 2, height: 2 });
  const rgb = pdfImages(scanPdf({ filter: '/FlateDecode' })); assert.deepEqual(imageInfo(rgb[0].bytes), { width: 2, height: 2 });
  for (const options of [{ filter: '/JPXDecode' }, { extra: '/SMask 4 0 R' }, { second: true }]) assert.throws(() => pdfImages(scanPdf(options)));
});

test('built runtime never skips inline DOCX, attached emails or archives, even with forged empty OCR cache', async () => {
  const docx = officeZip('docx', { 'word/document.xml': wdoc('<w:p><w:r><w:t>The password is Tr4ctor22.</w:t></w:r></w:p>') });
  for (const forged of [false, true]) for (const [name, type, bytes] of [['secret.docx','file',docx],['attached.eml','item',Buffer.from('synthetic')],['archive.zip','file',docx]]) {
    const a = file({ name, type, attachmentType: type, size: bytes.length, isInline: true });
    const l = load({ state: demo({ body: CLEAN_BODY, attachments: [a], contents: { i: bytes.toString('base64') } }), initialValues: forged ? { 'dg-ocr-v1': cached(a, { status: 'ready', text: '', hash: sha256(bytes) }) } : {} });
    assert.equal((await l.send()).allowEvent, false, name + ':' + forged);
    if (name.endsWith('.docx')) { assert.deepEqual(l.reads.content, ['i']); assert.equal(JSON.parse(l.values['dg-result']).result.findings[0].category, 'access'); }
  }
});
test('built runtime requires matching image bytes, including same-id/name/size replacement and final re-read', async () => {
  const a = file(), state = demo({ body: CLEAN_BODY, attachments: [a], contents: { i: png } });
  for (const hash of [undefined, 'f'.repeat(64)]) {
    const l = load({ state, initialValues: { 'dg-ocr-v1': cached(a, { status: 'ready', text: '', hash }) } });
    assert.equal((await l.send()).allowEvent, false); assert.deepEqual(l.reads.content, ['i']);
  }
  const l = load({ state, initialValues: { 'dg-ocr-v1': cached(a, { status: 'ready', text: '' }) }, check: async (d,o,original) => { const r = await original(d,o); state.contents.i = header(641,360).toString('base64'); return r; } });
  assert.deepEqual(await l.send(), { allowEvent: false, errorMessage: "Disclosure Gate couldn't check this email. The draft changed during the check. It hasn't been sent. Press Send again to check it again, or ask your IT team." }); assert.deepEqual(l.reads.content, ['i','i']);
});
test('built runtime accepts PDF OCR only after no_text; malformed and text-layer PDFs cannot bypass extraction', async () => {
  const textPdf = readFileSync(new URL('./fixtures/cost-summary.pdf', import.meta.url));
  for (const bytes of [textPdf, Buffer.from('%PDF-broken')]) {
    const a = file({ name: 'scan.pdf', size: bytes.length });
    const l = load({ state: demo({ body: CLEAN_BODY, attachments: [a], contents: { i: bytes.toString('base64') } }), initialValues: { 'dg-ocr-v1': cached(a, { status: 'ready', text: '', hash: sha256(bytes) }) } });
    assert.equal((await l.send()).allowEvent, false); assert.deepEqual(l.reads.content, ['i']);
  }
  const bytes = scanPdf(), a = file({ name: 'scan.pdf', size: bytes.length });
  const l = load({ state: demo({ body: CLEAN_BODY, attachments: [a], contents: { i: bytes.toString('base64') } }), initialValues: { 'dg-ocr-v1': cached(a, { status: 'ready', text: '', hash: sha256(bytes) }) } });
  assert.equal((await l.send()).allowEvent, true); assert.deepEqual(l.reads.content, ['i','i']);
});

test('a picture replaced after it was read stops in a runtime that cannot read it again (final review B)', async () => {
  const a = file({ isInline: true });
  for (const [bytes, sends] of [[header(), true], [header(641, 360), false]]) {
    const l = load({ state: demo({ body: CLEAN_BODY, attachments: [a], contents: { i: bytes.toString('base64') } }), initialValues: { 'dg-ocr-v1': cached(a, { status: 'ready', text: '' }) } });
    assert.equal((await l.send()).allowEvent, sends, sends ? 'unchanged' : 'replaced');
  }
});

test('a low-confidence decision carries the reads as a hint; a confident one does not need it', () => {
  const low = { text: 'API key: AKIAZ7Q4M2K8P3R6TOWX', mean: 82, word: 17, words: 3 };
  assert.deepEqual(decideOcr([low, { ...low, text: 'API key: AKIAZ7Q4M2K8P3R6TIWX' }]), { status: 'failed', reason: 'ocr_low_confidence', hint: 'API key: AKIAZ7Q4M2K8P3R6TOWX\nAPI key: AKIAZ7Q4M2K8P3R6TIWX' });
  assert.equal(decideOcr([{ ...low, text: '' }, { ...low, text: '' }]).hint, undefined);
});
