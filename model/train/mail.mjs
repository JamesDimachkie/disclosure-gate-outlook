// Shared by the adaptation scripts: read the email JSONL format, split it into the sentence units
// Send gives the model (subject and body separately, each sentence with the one before it), and load
// an export with the same classifier the add-in runs.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitSentences } from '../../core/sentences.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const LABELS = ['access', 'personal', 'economics', 'negotiation', 'remark'];

export async function readJsonl(file) {
  return (await readFile(file, 'utf8')).replace(/^﻿/, '').split(/\r?\n/).map((line, i) => {
    if (!line.trim()) return null;
    try { return JSON.parse(line); } catch { throw new Error(`${file}:${i + 1}: not valid JSON`); }
  }).filter(Boolean);
}

export function argsOf(argv, flags) {
  const options = {}, rest = [];
  for (let i = 0; i < argv.length; i++) {
    const name = argv[i].startsWith('--') ? argv[i].slice(2) : null;
    if (name === null) { rest.push(argv[i]); continue; }
    if (!(name in flags)) throw new Error(`Unknown option --${name}`);
    options[name] = flags[name] === Boolean ? true : argv[++i];
    if (options[name] === undefined) throw new Error(`--${name} needs a value`);
  }
  return { options, rest };
}

// An email line is {id, subject, body, ...}; a held-out case line ({id, draft: {...}}) is read the same way.
export function emailOf(row) {
  const draft = row.draft;
  const subject = draft ? draft.subject : row.subject, body = draft ? (draft.body?.text ?? draft.body) : row.body;
  if (typeof row.id !== 'string' || !row.id) throw new Error('Every email needs a string id');
  if (typeof (subject ?? '') !== 'string' || typeof (body ?? '') !== 'string') throw new Error(`${row.id}: subject and body must be text`);
  return { id: row.id, subject: subject || '', body: body || '' };
}

export function unitsOf(email) {
  const units = [];
  for (const source of ['subject', 'body']) {
    const sentences = splitSentences(email[source]);
    sentences.forEach((s, index) => units.push({ email: email.id, source, index, text: s.text, context: sentences[index - 1]?.text || '' }));
  }
  return units;
}

export async function loadClassifier(dir) {
  const ort = await import('onnxruntime-web');
  const { createClassifier } = await import('../classifier.mjs');
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.wasmBinary = await readFile(path.join(ROOT, 'node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm'));
  const labelsJson = JSON.parse(await readFile(path.join(dir, 'labels.json'), 'utf8'));
  const tokenizerJson = JSON.parse(await readFile(path.join(dir, 'tokenizer.json'), 'utf8'));
  const { withAdmission } = await import('../../outlook/model-input.mjs');
  // Score what Send's worker scores: sentences longer than the model's window are left unread.
  const raw = await createClassifier({ ort, labelsJson, modelBytes: await readFile(path.join(dir, 'model.onnx')), tokenizerJson });
  const classifier = withAdmission(raw, tokenizerJson, labelsJson);
  // `raw` scores every input as the export does (for verify.mjs's parity checks against Python).
  return { classifier, raw, labelsJson };
}
