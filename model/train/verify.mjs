// Check an export before shipping: the add-in's own classifier loads it, tokenizes the fixed probe set
// exactly as Python did, and agrees with the PyTorch model's scores and decisions.
//
//   node model/train/verify.mjs --model <export dir> --reference <run dir>/reference.json [--against model/out] [--allow-uncalibrated]
//
// --against also scores the probes with another export (the shipped one, say) and reports how far
// apart the two are. Exits 1 when a check fails.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { argsOf, loadClassifier, LABELS } from './mail.mjs';
import { createTokenizer } from '../tokenize.mjs';

const { options } = argsOf(process.argv.slice(2), { model: String, reference: String, against: String, 'allow-uncalibrated': Boolean });
if (!options.model || !options.reference) throw new Error('Usage: node model/train/verify.mjs --model <export dir> --reference <run dir>/reference.json [--against <dir>] [--allow-uncalibrated]. The reference is written by Python export.py; see docs/ADAPTING.md.');
const reference = JSON.parse(await readFile(options.reference, 'utf8').catch(error => {
  if (error.code === 'ENOENT') throw new Error(`Reference file not found: ${options.reference}. Python export.py writes it in the training run directory. Thresholds-only recalibration does not create it; use the held-out comparison in docs/ADAPTING.md instead.`);
  throw error;
}));
const items = reference.items.map(({ text, context }) => ({ text, context }));
const failures = [];
const check = (ok, message, skipped = false) => { console.log(`${skipped ? 'skip' : ok ? 'ok  ' : 'FAIL'} ${message}`); if (!ok) failures.push(message); };

const modelSha = createHash('sha256').update(await readFile(path.join(options.model, 'model.onnx'))).digest('hex');
check(modelSha === reference.model_sha256, `model.onnx is the file the reference was made from (${modelSha.slice(0, 8)})`);
const { raw: classifier, labelsJson } = await loadClassifier(options.model);
check(true, `the add-in classifier loads the export (labels.json version ${labelsJson.version})`);
const calibrated = /^D procedure/.test(labelsJson.calibration_data?.method || '');
check(calibrated || options['allow-uncalibrated'], calibrated
  ? `thresholds were calibrated on ${labelsJson.calibration_data.ordinary_emails} ordinary emails (fitted ${(100 * labelsJson.calibration_data.fitted_rate).toFixed(2)}%)`
  : 'thresholds are not calibrated yet: run calibrate.mjs (or pass --allow-uncalibrated to check the export alone)', !calibrated && options['allow-uncalibrated']);

const tokenizer = createTokenizer(JSON.parse(await readFile(path.join(options.model, 'tokenizer.json'), 'utf8')), labelsJson);
const mismatched = reference.items.filter((r, i) => JSON.stringify(tokenizer.encode(items[i])) !== JSON.stringify(r.token_ids));
check(!mismatched.length, `token ids match Python on ${reference.items.length - mismatched.length}/${reference.items.length} probes`);

const results = await classifier.classify(items);
await classifier.dispose();
const vector = r => ['none', ...LABELS].map(c => r.scores[c]);
const maxDiff = (a, b) => Math.max(...a.flatMap((row, i) => row.map((v, j) => Math.abs(v - b[i][j]))));
const node = results.map(vector);
const ortDiff = maxDiff(node, reference.items.map(r => r.int8));
const torchDiff = maxDiff(node, reference.items.map(r => r.torch));
check(ortDiff < 2e-3, `scores match Python onnxruntime on the same file (max difference ${ortDiff.toExponential(2)})`);
check(torchDiff < 0.05, `scores stay close to the PyTorch model (max difference ${torchDiff.toFixed(4)})`);
const decide = scores => {
  let label = 'none';
  for (const c of LABELS) if (scores[c] >= labelsJson.thresholds[c] && (label === 'none' || scores[c] > scores[label])) label = c;
  return label;
};
const torchScores = reference.items.map(r => Object.fromEntries(['none', ...LABELS].map((c, j) => [c, r.torch[j]])));
// Only a probe whose PyTorch score sits closer to a threshold than the measured score difference can
// legitimately land on the other side after int8 rounding.
const band = Math.max(torchDiff, 1e-4);
const near = torchScores.map(s => LABELS.some(c => Math.abs(s[c] - labelsJson.thresholds[c]) <= band));
const agree = results.filter((r, i) => r.label === decide(torchScores[i])).length;
const disagree = results.filter((r, i) => !near[i] && r.label !== decide(torchScores[i])).length;
check(!disagree, `decisions match PyTorch at these thresholds on ${agree}/${results.length} probes (${near.filter(Boolean).length} within ${band.toFixed(4)} of a threshold may differ)`);
const flagged = results.filter(r => r.label !== 'none').length;
console.log(`     ${flagged}/${results.length} probes flagged: ${LABELS.map(c => `${c} ${results.filter(r => r.label === c).length}`).join(', ')}`);

if (options.against) {
  const other = await loadClassifier(options.against);
  const theirs = await other.raw.classify(items);
  await other.raw.dispose();
  const changed = theirs.filter((r, i) => r.label !== results[i].label).length;
  console.log(`     against ${path.basename(path.resolve(options.against))}: max score difference ${maxDiff(node, theirs.map(vector)).toFixed(4)}, ${changed}/${items.length} probe decisions differ`);
}
if (failures.length) { console.log(`${failures.length} check(s) failed: do not ship this export.`); process.exitCode = 1; }
else console.log('All checks passed.');
