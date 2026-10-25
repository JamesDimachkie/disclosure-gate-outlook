// Set the model's thresholds from your own ordinary outside mail (the "D procedure" behind v2.3).
//
//   node model/train/calibrate.mjs --ordinary <mail.jsonl> --out <dir> [--model model/out] [--target 0.05] [--floor 0.05]
//
// Every email is scored as Send scores it; each category keeps its highest sentence score per email.
// One quantile is taken across the categories so that about --target of the emails would be
// questioned, then shrunk by 15% steps until the fitted share is at or below the target (no
// threshold goes under --floor). The model, tokenizer and license files are copied to --out with the
// new thresholds in labels.json. Only ordinary mail that goes outside belongs in --ordinary: emails
// with "flags" are refused, and held-out cases count only when they expect a pass and reach outside.
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { argsOf, emailOf, loadClassifier, readJsonl, unitsOf, LABELS, ROOT } from './mail.mjs';

const { options } = argsOf(process.argv.slice(2), { ordinary: String, out: String, model: String, target: String, floor: String });
if (!options.ordinary || !options.out) throw new Error('Usage: node model/train/calibrate.mjs --ordinary <mail.jsonl> --out <dir> [--model model/out] [--target 0.05] [--floor 0.05]');
const model = path.resolve(options.model ?? path.join(ROOT, 'model/out')), out = path.resolve(options.out);
const target = Number(options.target ?? 0.05), floor = Number(options.floor ?? 0.05);
if (!(target > 0 && target < 0.5)) throw new Error('--target is a share of ordinary emails, such as 0.05 for 5%');
if (!(floor > 0 && floor < 1)) throw new Error('--floor is the lowest allowed threshold, such as 0.05');

const outside = row => {
  if (!row.draft) return true;
  if (row.expect !== 'pass') return false;
  const inside = new Set([row.draft.from.address.split('@')[1].toLowerCase(), ...(row.internal_domains ?? []).map(d => d.toLowerCase())]);
  return ['to', 'cc', 'bcc'].flatMap(f => row.draft[f] ?? []).some(r => { const d = String(r.address || '').split('@')[1]?.toLowerCase(); return d && !inside.has(d); });
};
const rows = await readJsonl(options.ordinary);
if (rows.some(r => r.flags?.length)) throw new Error('--ordinary must hold ordinary mail only; remove the emails with flags');
const emails = rows.filter(outside).map(emailOf);
if (emails.length < 20) throw new Error(`Only ${emails.length} ordinary outside emails: too few to set thresholds`);
if (emails.length < 300) console.warn(`Warning: ${emails.length} ordinary emails. Each one moves the fitted rate by ${(100 / emails.length).toFixed(1)} points; aim for several hundred.`);

const { classifier, labelsJson } = await loadClassifier(model);
const maxes = [];
let sentences = 0;
for (const email of emails) {
  const units = unitsOf(email);
  sentences += units.length;
  const results = units.length ? await classifier.classify(units.map(({ text, context }) => ({ text, context }))) : [];
  maxes.push(Object.fromEntries(LABELS.map(c => [c, Math.max(0, ...results.map(r => r.scores[c]))])));
}
await classifier.dispose();
const rate = thresholds => maxes.filter(m => LABELS.some(c => m[c] >= thresholds[c])).length / maxes.length;
const quantile = (values, p) => { const a = [...values].sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(p * a.length))]; };
let q = target, thresholds, fitted;
for (let i = 0; i < 40; i++) {
  thresholds = Object.fromEntries(LABELS.map(c => [c, Math.max(quantile(maxes.map(m => m[c]), 1 - q), floor) + 1e-6]));
  fitted = rate(thresholds);
  if (fitted <= target) break;
  q *= 0.85;
}
const before = rate(labelsJson.thresholds);
// A threshold on the floor was set by --floor, not by your mail: too few of these emails score high
// in that category to place it, so it will question more real mail than the fitted rate suggests.
const floored = LABELS.filter(c => thresholds[c] <= floor + 1e-6);
if (floored.length) console.warn(`Warning: ${floored.join(', ')} ${floored.length > 1 ? 'are' : 'is'} at the ${floor} floor. Your sample did not place ${floored.length > 1 ? 'these thresholds' : 'this threshold'}: use a larger sample before shipping, or raise --floor.`);

await mkdir(out, { recursive: true });
if (out !== model) for (const name of ['model.onnx', 'tokenizer.json', 'LICENSE', 'NOTICE']) await copyFile(path.join(model, name), path.join(out, name));
const sha256 = createHash('sha256').update(await readFile(options.ordinary)).digest('hex');
const labels = { ...labelsJson, thresholds, calibration_data: {
  method: 'D procedure: per-email maximum score per category on ordinary outside mail; one quantile across categories, shrunk until the questioned share is at or below the target',
  target, floor, floored, fitted_rate: fitted, ordinary_emails: emails.length, sentences, sha256 } };
await writeFile(path.join(out, 'labels.json'), JSON.stringify(labels, null, 2) + '\n');
const show = t => Object.fromEntries(LABELS.map(c => [c, +t[c].toFixed(4)]));
console.log(JSON.stringify({ ordinaryEmails: emails.length, sentences, target,
  before: { questioned: +(100 * before).toFixed(2), thresholds: show(labelsJson.thresholds) },
  after: { questioned: +(100 * fitted).toFixed(2), thresholds: show(thresholds) }, out }));
