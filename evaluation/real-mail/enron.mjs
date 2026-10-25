// How often does the add-in ask on real company mail? Runs a seeded sample of the outside emails Enron
// employees sent (the public CMU Enron corpus) through the same check the held-out runner uses, with and
// without the on-device model. Everything stays on this computer, and the output is counts only: no
// subject, body, name or address is printed or saved. Message-IDs of the sample are saved so the run
// can be reproduced.
//
//   node evaluation/real-mail/enron.mjs <path to enron_mail_20150507.tar.gz> [--sample 3000] [--seed 1]
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const args = process.argv.slice(2);
const archive = args[0];
const option = (name, fallback) => { const i = args.indexOf(name); return i > 0 ? Number(args[i + 1]) : fallback; };
const SAMPLE = option('--sample', 3000), SEED = option('--seed', 1);
if (!archive || !fs.existsSync(archive)) { console.error('Usage: node evaluation/real-mail/enron.mjs <enron_mail_20150507.tar.gz> [--sample N] [--seed N]'); process.exit(2); }

// ---- read the sent folders straight from the archive (no extraction) ----------------------------
const SENT = /^maildir\/[^/]+\/(sent|sent_items|_sent_mail)\/[^/]+$/;
async function* tarEntries(file) {
  let buffer = Buffer.alloc(0), need = 512, header = null;
  for await (const chunk of fs.createReadStream(file).pipe(zlib.createGunzip())) {
    buffer = buffer.length ? Buffer.concat([buffer, chunk]) : chunk;
    while (buffer.length >= need) {
      if (!header) {
        const block = buffer.subarray(0, 512); buffer = buffer.subarray(512);
        if (block.every(b => b === 0)) { need = 512; continue; }
        const name = block.toString('utf8', 0, 100).replace(/\0.*$/s, '');
        const prefix = block.toString('utf8', 345, 500).replace(/\0.*$/s, '');
        const size = parseInt(block.toString('ascii', 124, 136).replace(/\0.*$/s, '').trim() || '0', 8);
        header = { name: prefix ? `${prefix}/${name}` : name, size, type: String.fromCharCode(block[156] || 48) };
        need = Math.ceil(size / 512) * 512;
        if (need === 0) { if (header.type === '0') yield { name: header.name, data: Buffer.alloc(0) }; header = null; need = 512; }
      } else {
        const data = buffer.subarray(0, header.size); buffer = buffer.subarray(need);
        if (header.type === '0' || header.type === '\0') yield { name: header.name, data };
        header = null; need = 512;
      }
    }
  }
}

const ADDRESS = /^[^@\s<>",;]+@([a-z0-9-]+\.)+[a-z]{2,}$/i;
function parse(raw) {
  const text = raw.toString('latin1').replace(/\r\n/g, '\n');
  const split = text.indexOf('\n\n');
  if (split < 0) return null;
  const headers = {};
  let last = null;
  for (const line of text.slice(0, split).split('\n')) {
    if (/^\s/.test(line) && last) { headers[last] += ' ' + line.trim(); continue; }
    const m = /^([A-Za-z-]+):\s?(.*)$/.exec(line);
    if (m) { last = m[1].toLowerCase(); headers[last] = m[2]; }
  }
  const list = v => (v || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return { id: headers['message-id'], from: (headers.from || '').trim().toLowerCase(), to: list(headers.to), cc: list(headers.cc), bcc: list(headers.bcc), subject: headers.subject || '', body: text.slice(split + 2) };
}
const internal = d => /(^|\.)enron\.com$/.test(d);
const domain = a => a.slice(a.lastIndexOf('@') + 1);

const counts = { sent_files: 0, parsed: 0, unique: 0, enron_sender: 0, any_outside: 0, bad_address: 0 };
const seen = new Set(), pool = [];
for await (const entry of tarEntries(archive)) {
  if (!SENT.test(entry.name)) continue;
  counts.sent_files++;
  const m = parse(entry.data);
  if (!m?.id) continue;
  counts.parsed++;
  const key = createHash('sha256').update(m.from + '\n' + m.subject + '\n' + m.body.trim()).digest('hex');
  if (seen.has(m.id) || seen.has(key)) continue;
  seen.add(m.id); seen.add(key); counts.unique++;
  if (!ADDRESS.test(m.from) || !internal(domain(m.from))) continue;
  counts.enron_sender++;
  // Enron's Bcc header repeats Cc; keep the distinct set.
  const recipients = [...new Set([...m.to, ...m.cc, ...m.bcc])];
  if (!recipients.length || recipients.some(a => !ADDRESS.test(a))) { counts.bad_address++; continue; }
  if (!recipients.some(a => !internal(domain(a)))) continue;
  counts.any_outside++;
  pool.push(m);
}

// ---- seeded sample -------------------------------------------------------------------------------
let state = SEED >>> 0 || 1;
const random = () => { state ^= state << 13; state >>>= 0; state ^= state >>> 17; state ^= state << 5; state >>>= 0; return state / 2 ** 32; };
pool.sort((a, b) => (a.id < b.id ? -1 : 1));
for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
const sample = pool.slice(0, Math.min(SAMPLE, pool.length));

// ---- check ---------------------------------------------------------------------------------------
const { checkDraft } = await import(pathToFileURL(path.join(root, 'core/gate.mjs')).href);
const ort = await import('onnxruntime-web');
const { createClassifier } = await import(pathToFileURL(path.join(root, 'model/classifier.mjs')).href);
ort.env.wasm.numThreads = 1;
ort.env.wasm.wasmBinary = fs.readFileSync(path.join(root, 'node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm'));
const out = path.join(root, 'model/out');
const semantic = await createClassifier({ ort, modelBytes: fs.readFileSync(path.join(out, 'model.onnx')), tokenizerJson: JSON.parse(fs.readFileSync(path.join(out, 'tokenizer.json'), 'utf8')), labelsJson: JSON.parse(fs.readFileSync(path.join(out, 'labels.json'), 'utf8')) });

const tally = () => ({ asked: 0, stop: 0, prompt: 0, clear: 0, other: 0, by_category: {}, by_source: { rules_only: 0, model_only: 0, both: 0 }, semantic: {} });
const runs = { model: tally(), rules: tally() };
const words = [];
for (const m of sample) {
  const people = list => list.map(address => ({ address }));
  const draft = { from: { address: m.from }, to: people(m.to), cc: people(m.cc), bcc: people(m.bcc.filter(a => !m.cc.includes(a))), subject: m.subject, body: { format: 'text', text: m.body }, attachments: [] };
  const internalDomains = [...new Set([m.from, ...m.to, ...m.cc, ...m.bcc].map(domain).filter(internal))];
  words.push(m.body.split(/\s+/).filter(Boolean).length);
  for (const [name, extra] of [['model', { semantic, semanticBudgetMs: 60000 }], ['rules', {}]]) {
    const t = runs[name];
    let r;
    try { r = await checkDraft(structuredClone(draft), { config: { internalDomains }, ...extra }); } catch { t.other++; continue; }
    if (name === 'model') { const s = String(r?.checked?.semantic ?? 'none'); t.semantic[s] = (t.semantic[s] || 0) + 1; }
    if (r?.state === 'clear') { t.clear++; continue; }
    if (r?.state !== 'held' || !r.findings?.length) { t.other++; continue; }
    t.asked++;
    r.findings.some(f => f.severity !== 'prompt') ? t.stop++ : t.prompt++;
    for (const c of new Set(r.findings.map(f => f.category))) t.by_category[c] = (t.by_category[c] || 0) + 1;
    const model = r.findings.some(f => f.found_by === 'model'), rules = r.findings.some(f => f.found_by !== 'model');
    t.by_source[model && rules ? 'both' : model ? 'model_only' : 'rules_only']++;
  }
}

const wilson = (k, n, z = 1.96) => { const p = k / n, d = 1 + z * z / n, c = p + z * z / (2 * n), w = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)); return [+((c - w) / d).toFixed(4), +((c + w) / d).toFixed(4)]; };
words.sort((a, b) => a - b);
const report = {
  corpus: 'CMU Enron email corpus, enron_mail_20150507.tar.gz', archive_sha256: createHash('sha256').update(fs.readFileSync(archive)).digest('hex'),
  model: JSON.parse(fs.readFileSync(path.join(out, 'labels.json'), 'utf8')).version, seed: SEED, counts, sample: sample.length,
  body_words: { median: words[words.length >> 1], p90: words[Math.floor(words.length * 0.9)] },
  results: Object.fromEntries(Object.entries(runs).map(([k, t]) => [k, { ...t, asked_rate: +(t.asked / sample.length).toFixed(4), asked_ci95: wilson(t.asked, sample.length) }])),
};
fs.writeFileSync(path.join(here, 'enron-results.json'), JSON.stringify(report, null, 1) + '\n');
fs.writeFileSync(path.join(here, 'enron-sample-ids.txt'), sample.map(m => m.id).join('\n') + '\n');
console.log(JSON.stringify({ counts, sample: sample.length, model: report.results.model.asked, rules: report.results.rules.asked }, null, 1));
