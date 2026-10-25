// Aggregate raw chunk receipts. Reject gaps, overlaps, mixed seeds and source revisions.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { summarize, sha256 } from './corpus-check.mjs';

export function mergeChunks(chunks) {
  if (!chunks.length) throw new Error('no fuzz chunks');
  const ordered = [...chunks].sort((a, b) => a.start - b.start), first = ordered[0];
  const rows = []; let next = 0;
  for (const c of ordered) {
    if (c.start !== next || c.count !== c.files || c.results.length !== c.count || c.results.some((r, i) => r.index !== c.start + i || !/^[a-f0-9]{64}$/.test(r.variantSha256))) throw new Error('chunk gap, overlap or invalid result count/hash');
    if (c.code.sha256 !== first.code.sha256 || c.harnessSha256 !== first.harnessSha256 || c.seed !== first.seed || JSON.stringify(c.seeds) !== JSON.stringify(first.seeds) || c.timeoutMs !== first.timeoutMs || c.childHeapMiB !== first.childHeapMiB) throw new Error('mixed fuzz configuration');
    rows.push(...c.results); next += c.count;
  }
  const { results, ...totals } = summarize(rows), operations = {};
  for (const r of rows) {
    const op = operations[r.operation] || (operations[r.operation] = { files: 0, rejectionOracles: 0, accepted: 0, findings: 0 });
    op.files++; op.rejectionOracles += r.mustReject ? 1 : 0; op.accepted += r.native?.ok ? 1 : 0;
    op.findings += r.finding ? 1 : 0;
  }
  return { schema: 1, at: new Date().toISOString(), node: first.node, code: first.code, harnessSha256: first.harnessSha256, seed: first.seed,
    start: 0, count: rows.length, timeoutMs: first.timeoutMs, childHeapMiB: first.childHeapMiB, seeds: first.seeds,
    wallMs: +ordered.reduce((n, c) => n + c.wallMs, 0).toFixed(2), ...totals, operations,
    uniqueVariantPayloads: new Set(rows.map(r => r.variantSha256)).size,
    variantDigest: sha256(JSON.stringify(rows.map(r => [r.index, r.variantSha256]))),
    findings: rows.filter(r => r.finding),
    chunks: ordered.map(c => ({ start: c.start, count: c.count, files: c.files, at: c.at, wallMs: c.wallMs, receipt: c.receipt || null })) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) throw new Error('Usage: node tools/summarize-fuzz.mjs <raw-chunk-folder> <summary.json>');
  const chunks = [];
  for (const name of (await readdir(resolve(input))).sort()) {
    if (!/^fuzz-\d{5}\.json$/.test(name)) continue;
    const bytes = await readFile(resolve(input, name));
    chunks.push({ ...JSON.parse(bytes.toString('utf8')), receipt: { file: name, sha256: sha256(bytes) } });
  }
  const result = mergeChunks(chunks);
  await mkdir(dirname(resolve(output)), { recursive: true }); await writeFile(resolve(output), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ files: result.files, uniqueVariantPayloads: result.uniqueVariantPayloads, findings: result.findings.length, crashes: result.crashes.length }));
  if (result.findings.length || result.crashes.length) process.exitCode = 1;
}
