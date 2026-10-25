// Turn labeled emails (and optional single sentences) into the sentence files train.py reads.
//
//   node model/train/prepare.mjs --out <dir> [--val-share 0.2] [--with-shipped-data] [--repeat 1] <file.jsonl>...
//
// An email line: {"id", "subject", "body", "flags": [{"quote", "label"}]}. Each quote is copied from
// the email and must sit inside one sentence as Send splits it; that sentence gets the label, every
// other sentence is "none". An email without flags is ordinary. A sentence line: {"text", "context",
// "label"}, for contrast pairs and look-alikes; sentence lines are only ever used for training.
// Writes <dir>/train.jsonl, <dir>/val.jsonl (a share of the emails, by kind) and <dir>/prepare.json.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { argsOf, emailOf, readJsonl, unitsOf, LABELS, ROOT } from './mail.mjs';

const { options, rest: files } = argsOf(process.argv.slice(2), { out: String, 'val-share': String, 'with-shipped-data': Boolean, repeat: String });
if (!options.out || !files.length) throw new Error('Usage: node model/train/prepare.mjs --out <dir> [--val-share 0.2] [--with-shipped-data] [--repeat 1] <file.jsonl>...');
const share = Number(options['val-share'] ?? 0.2), repeat = Number(options.repeat ?? 1);
if (!(share >= 0 && share < 1) || !Number.isInteger(repeat) || repeat < 1) throw new Error('--val-share must be in [0, 1) and --repeat a whole number');
const hash = text => createHash('sha256').update(text).digest('hex');

const emails = [], sentences = [], ids = new Set();
for (const file of files) for (const row of await readJsonl(file)) {
  const where = `${path.basename(file)} ${row.id ?? JSON.stringify(row).slice(0, 60)}`;
  if (row.subject === undefined && row.body === undefined) {
    if (typeof row.text !== 'string' || !row.text.trim() || !['none', ...LABELS].includes(row.label)) throw new Error(`${where}: a sentence line needs text and a label`);
    sentences.push({ email: row.id ?? `sentence-${sentences.length + 1}`, text: row.text, context: row.context || '', label: row.label, kind: 'sentence', origin: path.basename(file) });
    continue;
  }
  const email = emailOf(row);
  if (ids.has(email.id)) throw new Error(`${where}: repeated id`);
  ids.add(email.id);
  const flags = row.flags ?? [];
  if (!Array.isArray(flags) || flags.some(f => typeof f?.quote !== 'string' || !f.quote.trim() || !LABELS.includes(f.label))) throw new Error(`${where}: each flag needs a quote and one of ${LABELS.join(', ')}`);
  const kind = flags.length ? 'disclosure' : 'ordinary';
  if (row.kind && row.kind !== kind) throw new Error(`${where}: kind "${row.kind}" disagrees with its flags`);
  const units = unitsOf(email).map(u => ({ ...u, label: 'none', kind, origin: path.basename(file) }));
  for (const flag of flags) {
    const hits = units.filter(u => u.text.includes(flag.quote.trim()));
    if (!hits.length) throw new Error(`${where}: quote not found inside one sentence: "${flag.quote}". Quote a part of a single sentence.`);
    for (const u of hits) {
      if (u.label !== 'none' && u.label !== flag.label) throw new Error(`${where}: one sentence has two labels`);
      u.label = flag.label;
    }
  }
  emails.push({ id: email.id, kind, units });
}

// A deterministic share of each kind of email is held back for choosing the epoch.
const val = new Set();
for (const kind of ['ordinary', 'disclosure']) {
  const group = emails.filter(e => e.kind === kind).sort((a, b) => hash(a.id).localeCompare(hash(b.id)));
  group.slice(0, Math.round(share * group.length)).forEach(e => val.add(e.id));
}
const valRows = emails.filter(e => val.has(e.id)).flatMap(e => e.units);
const held = new Set(valRows.map(r => r.text.trim()));
const own = [...emails.filter(e => !val.has(e.id)).flatMap(e => e.units), ...sentences].filter(r => !held.has(r.text.trim()));
let train = Array.from({ length: repeat }, () => own).flat();
let shipped = null;
if (options['with-shipped-data']) {
  const file = path.join(ROOT, 'model/data/v23-train.jsonl');
  // Your labels win over a published row with the same sentence; nothing in validation is trained on.
  const mine = new Set(own.map(r => r.text.trim()));
  const rows = (await readJsonl(file)).filter(r => !held.has(r.text.trim()) && !mine.has(r.text.trim()));
  shipped = { file: 'model/data/v23-train.jsonl', sha256: hash(await readFile(file)), sentences: rows.length };
  train = [...train, ...rows.map(r => ({ email: r.email ?? r.id, source: r.source, index: r.index, text: r.text, context: r.context || '', label: r.label, kind: r.kind, origin: 'v23-train' }))];
}

await mkdir(options.out, { recursive: true });
const lines = rows => rows.map(r => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : '');
await writeFile(path.join(options.out, 'train.jsonl'), lines(train));
if (valRows.length) await writeFile(path.join(options.out, 'val.jsonl'), lines(valRows));
const count = rows => rows.reduce((a, r) => ({ ...a, [r.label]: (a[r.label] || 0) + 1 }), {});
const summary = {
  inputs: await Promise.all(files.map(async f => ({ file: path.basename(f), sha256: hash(await readFile(f)) }))),
  emails: { ordinary: emails.filter(e => e.kind === 'ordinary').length, disclosure: emails.filter(e => e.kind === 'disclosure').length, validation: val.size },
  sentence_lines: sentences.length, repeat, shipped_data: shipped,
  train: { sentences: train.length, labels: count(train) }, val: { sentences: valRows.length, labels: count(valRows) },
};
await writeFile(path.join(options.out, 'prepare.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary));
