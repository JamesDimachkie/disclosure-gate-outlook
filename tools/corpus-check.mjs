// Public-data parser regression check. Never execute files from the corpus. Each input gets a
// fresh, memory-limited Node process; a parser that blocks cannot block the parent deadline.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve, relative, dirname, extname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

const own = fileURLToPath(import.meta.url), args = process.argv.slice(2);
const option = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const source = resolve(option('--source') || resolve(dirname(own), '..'));
const supported = /\.(pdf|docx|xlsx|pptx)$/i;
const kindOf = name => extname(name).slice(1).toLowerCase();

async function inspect(path) {
  const start = performance.now(), kind = kindOf(path), bytes = await readFile(path);
  const moduleAt = p => import(pathToFileURL(resolve(source, p)).href);
  const { attachmentText } = await moduleAt('core/attachments.mjs');
  const native = attachmentText({ id: 'corpus', name: 'public.' + kind, type: 'file', size: bytes.length, content: bytes.toString('base64') });
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
  return { kind, bytes: bytes.length, outcome, reason, native: { ok: native.ok, reason: native.reason || null, textChars: (native.text || '').length, picture: !!native.picture }, images, ms: +(performance.now() - start).toFixed(2) };
}

if (option('--file')) {
  try { console.log(JSON.stringify(await inspect(resolve(option('--file'))))); }
  catch (error) { console.error(String(error?.message || 'crash').slice(0, 500)); process.exitCode = 1; }
} else {
  const corpus = args[0], output = args[1];
  const timeoutMs = Number(option('--timeout-ms') || 10000);
  if (!corpus || !output || !Number.isSafeInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 60000) throw new Error('Usage: node tools/corpus-check.mjs <corpus-folder> <summary.json> [--source <code-root>] [--timeout-ms 10000]');
  const root = resolve(corpus), paths = [];
  async function walk(dir, depth = 0) {
    if (depth > 16) throw new Error('corpus directory depth budget');
    const entries = await readdir(dir, { withFileTypes: true });
    if (entries.length > 10000) throw new Error('corpus directory entry budget');
    for (const e of entries) {
      if (e.isSymbolicLink()) continue;
      const path = resolve(dir, e.name);
      if (e.isDirectory()) await walk(path, depth + 1);
      else if (e.isFile() && supported.test(e.name)) { paths.push(path); if (paths.length > 5000) throw new Error('corpus file budget'); }
    }
  }
  await walk(root); paths.sort();
  if (!paths.length) throw new Error('no corpus files');
  const rows = [], start = performance.now();
  for (const path of paths) {
    const t = performance.now();
    const row = await new Promise(resolveRow => {
      const child = spawn(process.execPath, ['--max-old-space-size=400', own, '--file', path, '--source', source], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
      let out = '', err = '', killed = false;
      const timer = setTimeout(() => { killed = true; child.kill('SIGKILL'); }, timeoutMs);
      child.stdout.on('data', b => { if (out.length < 32768) out += b.toString(); });
      child.stderr.on('data', b => { if (err.length < 8192) err += b.toString(); });
      child.on('error', e => { err = e.message; });
      child.on('close', (code, signal) => {
        clearTimeout(timer);
        const wallMs = +(performance.now() - t).toFixed(2);
        if (killed) { resolveRow({ outcome: 'timeout', reason: 'wall_clock', wallMs }); return; }
        if (code !== 0) { resolveRow({ outcome: 'crash', reason: 'child_exit', code, signal, error: err.slice(0, 1000), wallMs }); return; }
        try { resolveRow({ ...JSON.parse(out), wallMs }); }
        catch { resolveRow({ outcome: 'crash', reason: 'invalid_child_result', wallMs }); }
      });
    });
    rows.push({ name: relative(root, path).replace(/\\/g, '/'), kind: kindOf(path), ...row });
    if (rows.length % 100 === 0) console.log('Checked ' + rows.length + '/' + paths.length);
  }
  const counts = {}, reasons = {};
  for (const row of rows) {
    const c = counts[row.kind] || (counts[row.kind] = {}); c[row.outcome] = (c[row.outcome] || 0) + 1;
    const r = reasons[row.kind] || (reasons[row.kind] = {}); r[row.reason] = (r[row.reason] || 0) + 1;
  }
  let provenance = null;
  try { const p = JSON.parse(await readFile(resolve(root, 'DOWNLOAD.json'), 'utf8')); provenance = { pdfTree: p.pdfTree, pdfCommit: p.pdfCommit, poiCommit: p.poiCommit, downloaded: p.files.length, downloadFailures: p.failures }; } catch { /* A local corpus need not have this receipt. */ }
  const summary = { at: new Date().toISOString(), node: process.version, source, corpus: root, provenance, files: rows.length, timeoutMs, childHeapMiB: 400, wallMs: +(performance.now() - start).toFixed(2), counts, reasons, crashes: rows.filter(r => ['crash', 'timeout'].includes(r.outcome)), slowest: [...rows].sort((a, b) => b.ms - a.ms || b.wallMs - a.wallMs).slice(0, 20), results: rows };
  if (option('--compare')) {
    const before = JSON.parse(await readFile(resolve(option('--compare')), 'utf8'));
    const byName = new Map(before.results.map(r => [r.name, r]));
    if (before.files !== rows.length || rows.some(r => !byName.has(r.name))) throw new Error('comparison must use identical corpus files');
    const transitions = {}, changed = [];
    for (const row of rows) {
      const old = byName.get(row.name);
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
