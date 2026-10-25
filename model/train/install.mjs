// Put a verified, calibrated export in model/out/ and record it in model/PROVENANCE.json, so the
// build ships it and the provenance test checks it.
//
//   node model/train/install.mjs <export dir> --note "what changed and why" [--accuracy "your measured result"]
//
// Commit the result on its own: rolling back is reverting that commit and rebuilding.
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { argsOf, ROOT } from './mail.mjs';

const { options, rest } = argsOf(process.argv.slice(2), { note: String, accuracy: String });
const from = rest[0];
if (!from || !options.note) throw new Error('Usage: node model/train/install.mjs <export dir> --note "what changed and why" [--accuracy "..."]');
const labels = JSON.parse(await readFile(path.join(from, 'labels.json'), 'utf8'));
if (!/^D procedure/.test(labels.calibration_data?.method || '')) throw new Error('This export has not been calibrated: run calibrate.mjs first');
const out = path.join(ROOT, 'model/out'), file = path.join(ROOT, 'model/PROVENANCE.json');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const previous = JSON.parse(await readFile(file, 'utf8'));
for (const name of ['model.onnx', 'tokenizer.json', 'labels.json', 'LICENSE', 'NOTICE']) await copyFile(path.join(from, name), path.join(out, name));
const files = {};
for (const name of Object.keys(previous.files)) {
  const bytes = await readFile(path.join(ROOT, 'model', name));
  files[name] = { bytes: bytes.length, sha256: sha(bytes) };
}
const provenance = { ...previous,
  source: 'adapted with model/train (docs/ADAPTING.md)', note: options.note,
  labelsVersion: labels.version, training: labels.training, calibration: labels.calibration_data,
  accuracy: options.accuracy ?? 'Not yet measured on a held-out set of your own mail; see docs/ADAPTING.md.',
  previousModel: { note: previous.note, sha256: previous.files['out/model.onnx'].sha256 }, files };
delete provenance.sourceCheckoutHead;
await writeFile(file, JSON.stringify(provenance, null, 2) + '\n');
console.log(`Installed ${path.basename(path.resolve(from))} into model/out/ (model.onnx ${files['out/model.onnx'].sha256.slice(0, 8)}). Now run npm test.`);
