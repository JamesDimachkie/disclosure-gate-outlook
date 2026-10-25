// Public-data parser regression check. Never execute files from the corpus. Each input gets a
// fresh, memory-limited Node process; a parser that blocks cannot block the parent deadline.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve, relative, dirname, extname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { createHash } from 'node:crypto';

const own = fileURLToPath(import.meta.url), args = process.argv.slice(2);
const option = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const source = resolve(option('--source') || resolve(dirname(own), '..'));
const supported = args.includes('--all-formats') ? /\.(pdf|docx|xlsx|pptx|csv|txt|doc|xls|ppt|rtf)$/i : /\.(pdf|docx|xlsx|pptx)$/i;
const kindOf = name => extname(name).slice(1).toLowerCase();
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export async function sourceReceipt(sourceRoot = source) {
  const files = [];
  async function walk(dir) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const path = resolve(dir, e.name);
      if (e.isDirectory()) await walk(path);
      else if (e.isFile() && e.name.endsWith('.mjs')) files.push({ path: relative(sourceRoot, path).replace(/\\/g, '/'), sha256: sha256(await readFile(path)) });
    }
  }
  await walk(resolve(sourceRoot, 'core')); files.sort((a, b) => a.path.localeCompare(b.path, 'en'));
  return { sha256: sha256(JSON.stringify(files)), files };
}

async function inspect(path) {
  const start = performance.now(), kind = kindOf(path), bytes = await readFile(path);
  const moduleAt = p => import(pathToFileURL(resolve(source, p)).href);
  const { attachmentText } = await moduleAt('core/attachments.mjs');
  const native = attachmentText({ id: 'corpus', name: 'public.' + kind, type: 'file', size: bytes.length, content: bytes.toString('base64') });
  let legacyDecision;
  if (['doc', 'xls', 'ppt', 'rtf'].includes(kind)) {
    const { checkDraft, decisionFor } = await moduleAt('core/gate.mjs');
    const config = { internalDomains: ['sender.example'] };
    const result = await checkDraft({ from: { address: 'sender@sender.example' }, to: [{ address: 'recipient@outside.example' }], cc: [], bcc: [], subject: '', body: { text: '', format: 'text' }, attachments: [{ id: 'corpus', name: 'public.' + kind, type: 'file', size: bytes.length, content: bytes.toString('base64') }] }, { config });
    legacyDecision = { state: result.state, outcome: decisionFor(result, config).outcome, unreadable: result.findings.some(f => f.category === 'attachment') };
    if (native.ok || !legacyDecision.unreadable || legacyDecision.outcome !== 'ask' || result.state === 'clear') throw new Error('legacy_silent_pass');
  }
  let outcome = native.ok ? 'ok' : 'cant_check', reason = native.reason || 'complete', images = 0;
  if (!native.ok && kind === 'pdf' && native.reason === 'no_text') {
    const pdf = await moduleAt('core/extract/pdf.mjs');
    try {
      const coverage = pdf.pdfCoverage ? pdf.pdfCoverage(bytes) : null;
      images = pdf.pdfImages(bytes, coverage?.ocrPages?.length ? coverage.ocrPages : undefined).length;
      outcome = 'needs_ocr'; reason = 'pdf_images';
    } catch (error) { reason = String(error.message || 'scan_unreadable').slice(0, 40); }
  } else if (!native.ok && kind !== 'pdf' && (native.picture || native.reason === 'ocr_unsupported')) {
    const office = await moduleAt('core/extract/office.mjs');
    try {
      const coverage = office.officeCoverage(bytes, kind);
      images = coverage.images.length;
      const unread = coverage.images.find(image => image.reason);
      if (unread) reason = unread.reason;
      else { outcome = 'needs_ocr'; reason = 'office_images'; }
    } catch (error) { reason = String(error.message || 'unreadable').slice(0, 40); }
  }
  return { kind, bytes: bytes.length, sha256: sha256(bytes), outcome, reason, native: { ok: native.ok, reason: native.reason || null, textChars: (native.text || '').length, picture: !!native.picture }, images, ...(legacyDecision ? { legacyDecision } : {}), ms: +(performance.now() - start).toFixed(2), peakRssKiB: process.resourceUsage().maxRSS };
}

// Reused by the mutation harness: identical attachment/OCR-selection path and isolation.
export async function runFile(path, { sourceRoot = source, timeoutMs = 10000, heapMiB = 400 } = {}) {
  const t = performance.now();
  return new Promise(resolveRow => {
    const child = spawn(process.execPath, ['--max-old-space-size=' + heapMiB, own, '--file', path, '--source', sourceRoot], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', killed = false;
    const timer = setTimeout(() => { killed = true; child.kill('SIGKILL'); }, timeoutMs);
    child.stdout.on('data', b => { if (out.length < 32768) out += b.toString(); });
    // Diagnostics could contain document text. Only controlled reason codes leave the child.
    child.stderr.on('data', () => {});
    child.on('error', () => {});
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      const wallMs = +(performance.now() - t).toFixed(2);
      if (killed) return resolveRow({ outcome: 'timeout', reason: 'wall_clock', wallMs });
      if (code !== 0) return resolveRow({ outcome: 'crash', reason: 'child_exit', code, signal, wallMs });
      try { resolveRow({ ...JSON.parse(out), wallMs }); }
      catch { resolveRow({ outcome: 'crash', reason: 'invalid_child_result', wallMs }); }
    });
  });
}

export function summarize(rows) {
  const counts = {}, reasons = {}, metrics = {};
  const stats = values => {
    const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
    return { measured: sorted.length, max: sorted.at(-1) ?? null, p95: sorted[Math.max(0, Math.ceil(sorted.length * .95) - 1)] ?? null };
  };
  for (const row of rows) {
    const c = counts[row.kind] || (counts[row.kind] = {}); c[row.outcome] = (c[row.outcome] || 0) + 1;
    const r = reasons[row.kind] || (reasons[row.kind] = {}); r[row.reason] = (r[row.reason] || 0) + 1;
  }
  for (const kind of Object.keys(counts)) {
    const group = rows.filter(r => r.kind === kind);
    metrics[kind] = { checkMs: stats(group.map(r => r.ms)), subprocessMs: stats(group.map(r => r.wallMs)), peakRssKiB: stats(group.map(r => r.peakRssKiB)) };
  }
  return { files: rows.length, counts, reasons, metrics, crashes: rows.filter(r => ['crash', 'timeout'].includes(r.outcome)), results: rows };
}

if (resolve(process.argv[1] || '') === own && option('--file')) {
  try { console.log(JSON.stringify(await inspect(resolve(option('--file'))))); }
  catch { process.exitCode = 1; }
} else if (resolve(process.argv[1] || '') === own) {
  const corpus = args[0], output = args[1];
  const timeoutMs = Number(option('--timeout-ms') || 10000);
  const startIndex = Number(option('--start') || 0), limit = Number(option('--limit') || 5000);
  if (!Number.isSafeInteger(startIndex) || startIndex < 0 || !Number.isSafeInteger(limit) || limit < 1 || limit > 5000) throw new Error('invalid chunk range');
  if (!corpus || !output || !Number.isSafeInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 60000) throw new Error('Usage: node tools/corpus-check.mjs <corpus-folder> <summary.json> [--source <code-root>] [--timeout-ms 10000] [--all-formats] [--start 0] [--limit 5000] [--compare <baseline.json>]');
  const root = resolve(corpus), paths = [];
  async function walk(dir, depth = 0) {
    if (depth > 16) throw new Error('corpus directory depth budget');
    const entries = await readdir(dir, { withFileTypes: true });
    if (entries.length > 10000) throw new Error('corpus directory entry budget');
    for (const e of entries) {
      if (e.isSymbolicLink() || e.name === 'archives') continue;
      const path = resolve(dir, e.name);
      if (e.isDirectory()) await walk(path, depth + 1);
      else if (e.isFile() && supported.test(e.name)) { paths.push(path); if (paths.length > 20000) throw new Error('corpus file budget'); }
    }
  }
  await walk(root); paths.sort();
  const selected = paths.slice(startIndex, startIndex + limit);
  if (!selected.length) throw new Error('no corpus files');
  const rows = [], start = performance.now();
  const code = await sourceReceipt();
  for (const path of selected) {
    const row = await runFile(path, { timeoutMs });
    rows.push({ name: relative(root, path).replace(/\\/g, '/'), kind: kindOf(path), ...row });
    if (rows.length % 100 === 0) console.log('Checked ' + rows.length + '/' + paths.length);
  }
  const counts = {}, reasons = {};
  for (const row of rows) {
    const c = counts[row.kind] || (counts[row.kind] = {}); c[row.outcome] = (c[row.outcome] || 0) + 1;
    const r = reasons[row.kind] || (reasons[row.kind] = {}); r[row.reason] = (r[row.reason] || 0) + 1;
  }
  let provenance = null;
  try { const bytes = await readFile(resolve(root, 'DOWNLOAD.json')); const p = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, '')); provenance = { manifestSha256: sha256(bytes), source: p.source || null, pdfTree: p.pdfTree, pdfCommit: p.pdfCommit, poiCommit: p.poiCommit, downloaded: p.files.length, downloadFailures: p.failures }; } catch { /* A local corpus need not have this receipt. */ }
  const summary = { at: new Date().toISOString(), node: process.version, source, corpus: root, provenance, files: rows.length, timeoutMs, childHeapMiB: 400, wallMs: +(performance.now() - start).toFixed(2), counts, reasons, crashes: rows.filter(r => ['crash', 'timeout'].includes(r.outcome)), slowest: [...rows].sort((a, b) => b.ms - a.ms || b.wallMs - a.wallMs).slice(0, 20), results: rows };
  Object.assign(summary, summarize(rows), { selected: { start: startIndex, total: paths.length } });
  summary.code = code;
  if ((await sourceReceipt()).sha256 !== code.sha256) throw new Error('source changed during corpus run');
  if (option('--compare')) {
    const before = JSON.parse(await readFile(resolve(option('--compare')), 'utf8'));
    const byName = new Map(before.results.map(r => [r.name, r]));
    if (before.files !== rows.length || rows.some(r => !byName.has(r.name))) throw new Error('comparison must use identical corpus files');
    const transitions = {}, changed = [];
    for (const row of rows) {
      const old = byName.get(row.name);
      if (old.sha256 && old.sha256 !== row.sha256) throw new Error('comparison input hash mismatch');
      if (old.outcome === row.outcome && old.reason === row.reason) continue;
      const key = row.kind + ':' + old.outcome + '->' + row.outcome + ':' + row.reason;
      transitions[key] = (transitions[key] || 0) + 1;
      changed.push({ name: row.name, kind: row.kind, before: old.outcome, after: row.outcome, beforeReason: old.reason, afterReason: row.reason, beforeMs: old.ms, afterMs: row.ms });
    }
    summary.comparison = { baseline: resolve(option('--compare')), transitions, changed };
  }
  await mkdir(dirname(resolve(output)), { recursive: true });
  await writeFile(resolve(output), JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify({ files: summary.files, counts, crashes: summary.crashes.length, wallMs: summary.wallMs, output: resolve(output) }));
  if (summary.crashes.length) process.exitCode = 1;
}
