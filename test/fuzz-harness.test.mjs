import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syntheticSeeds, mutate, OPERATIONS } from '../tools/fuzz-extract.mjs';
import { sha256, summarize, sourceReceipt } from '../tools/corpus-check.mjs';

test('fuzz recipes reproduce by absolute index, including across chunk boundaries', () => {
  const seeds = syntheticSeeds();
  const first = Array.from({ length: 100 }, (_, i) => mutate(seeds, 20261024, i));
  const resumed = Array.from({ length: 30 }, (_, i) => mutate(seeds, 20261024, i + 70));
  assert.deepEqual(resumed.map(v => sha256(v.bytes)), first.slice(70).map(v => sha256(v.bytes)));
  assert.equal(new Set(first.map(v => v.operation)).size, OPERATIONS.length);
  assert.notEqual(sha256(mutate(seeds, 1, 0).bytes), sha256(mutate(seeds, 2, 0).bytes));
});

test('aggregate p95 uses nearest rank and exposes missing peak measurements for killed children', () => {
  const s = summarize(Array.from({ length: 20 }, (_, i) => ({ kind: 'pdf', outcome: i === 19 ? 'timeout' : 'ok', reason: i === 19 ? 'wall_clock' : 'complete', wallMs: i + 1, ...(i < 19 ? { ms: i + 1, peakRssKiB: 100 + i } : {}) })));
  assert.equal(s.metrics.pdf.subprocessMs.p95, 19);
  assert.equal(s.metrics.pdf.peakRssKiB.measured, 19);
  assert.equal(s.crashes.length, 1);
});

test('fuzz --source pins both the receipt and bounded child imports to that snapshot', async () => {
  const temporary = mkdtempSync(join(tmpdir(), 'dg-fuzz-source-'));
  try {
    const source = join(temporary, 'source'), output = join(temporary, 'result.json');
    mkdirSync(join(source, 'core'), { recursive: true });
    writeFileSync(join(source, 'core', 'attachments.mjs'), "throw new Error('alternate source used');\n");
    const tool = fileURLToPath(new URL('../tools/fuzz-extract.mjs', import.meta.url));
    const run = spawnSync(process.execPath, [tool, output, '--count', '1', '--source', source], { cwd: fileURLToPath(new URL('..', import.meta.url)), encoding: 'utf8', timeout: 10000, windowsHide: true });
    assert.equal(run.status, 1);
    const result = JSON.parse(readFileSync(output, 'utf8'));
    assert.equal(result.code.sha256, (await sourceReceipt(source)).sha256);
    assert.equal(result.results[0].outcome, 'crash');
    assert.equal(result.findings[0].finding, 'crash');
  } finally { rmSync(temporary, { recursive: true, force: true }); }
});
