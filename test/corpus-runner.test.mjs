import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
const exec = promisify(execFile);

test('corpus runner kills a blocked parser in its child and records the file instead of hanging', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'dg-corpus-runner-'));
  try {
    const data = join(temp, 'data'), source = join(temp, 'trusted-code'), output = join(temp, 'summary.json');
    await mkdir(data); await mkdir(join(source, 'core'), { recursive: true });
    // Trusted synthetic parser code is outside the corpus. The input is never executed.
    await writeFile(join(source, 'core/attachments.mjs'), 'export function attachmentText() { while (true) {} }');
    await writeFile(join(data, 'hang.pdf'), 'throw new Error("Corpus data must not execute")');
    const result = await exec(process.execPath, [fileURLToPath(new URL('../tools/corpus-check.mjs', import.meta.url)), data, output, '--source', source, '--timeout-ms', '150'], { windowsHide: true, timeout: 5000 }).catch(error => error);
    assert.equal(result.code, 1);
    const summary = JSON.parse(await readFile(output, 'utf8'));
    assert.equal(summary.files, 1);
    assert.deepEqual(summary.counts, { pdf: { timeout: 1 } });
    assert.equal(summary.crashes[0].reason, 'wall_clock');
    assert.ok(summary.wallMs < 4000);
  } finally {
    assert.equal(dirname(temp), resolve(tmpdir()));
    await rm(temp, { recursive: true, force: true });
  }
});
