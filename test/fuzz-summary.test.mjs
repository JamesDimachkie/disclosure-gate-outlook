import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeChunks } from '../tools/summarize-fuzz.mjs';
const chunk = start => ({ start, count: 1, files: 1, seed: 1, code: { sha256: 'source' }, harnessSha256: 'harness', seeds: [], timeoutMs: 2000, childHeapMiB: 400, wallMs: 5,
  results: [{ index: start, variantSha256: String(start).repeat(64), operation: 'test', kind: 'pdf', outcome: 'ok', reason: 'complete', mustReject: false, native: { ok: true }, ms: 1, wallMs: 2, peakRssKiB: 100 }] });
test('fuzz summary refuses skipped/repeated chunks or mixed source custody', () => {
  assert.throws(() => mergeChunks([chunk(1)]), /gap/);
  assert.throws(() => mergeChunks([chunk(0), chunk(0)]), /overlap/);
  assert.throws(() => mergeChunks([chunk(0), { ...chunk(1), code: { sha256: 'different' } }]), /mixed/);
  const s = mergeChunks([chunk(1), chunk(0)]);
  assert.equal(s.files, 2); assert.equal(s.uniqueVariantPayloads, 2);
  assert.equal(s.operations.test.accepted, 2); assert.equal(s.metrics.pdf.peakRssKiB.measured, 2);
  assert.equal('results' in s, false); assert.match(s.variantDigest, /^[a-f0-9]{64}$/);
});
