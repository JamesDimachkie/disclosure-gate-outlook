// Serializer for everyday7a. It only turns the authored literals in batches/*.mjs into runner-schema
// case objects and writes cases.jsonl. It writes no prose: every subject, body and rationale is a literal.
// Usage: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const CATEGORY = { '5.1': 'secrets', '5.4': 'personal', '5.5': 'economics', '5.6': 'negotiation', '5.7': 'remark' };
const KIND = { stop: 'stop', ev: 'everyday', bd: 'boundary' };

function party(text) {
  const m = /^(.*?)\s*<([^<>\s]+)>$/.exec(text.trim());
  if (!m) throw new Error(`Bad address literal: ${text}`);
  return { name: m[1], address: m[2] };
}
const recipient = (text) => ({ ...party(text), kind: 'person' });

const files = fs.readdirSync(path.join(dir, 'batches')).filter((f) => /^b\d+\.mjs$/.test(f)).sort();
const lines = [];
let index = 0;
for (const file of files) {
  const { default: literals } = await import(pathToFileURL(path.join(dir, 'batches', file)).href);
  for (const c of literals) {
    index += 1;
    const isStop = c.k === 'stop';
    const meta = { kind: KIND[c.k], industry: c.ind, variant: c.v, placement: isStop ? c.place : 'none' };
    if (isStop) { meta.dims = c.dims; meta.sentence = c.sentence; }
    if (c.k === 'ev') { meta.setting = c.set; meta.messy = c.messy ?? []; }
    if (c.k === 'bd') { meta.setting = c.set; meta.boundary = c.bnd; }
    const draft = {
      from: party(c.from),
      to: c.to.map(recipient),
      cc: (c.cc ?? []).map(recipient),
      bcc: [],
      subject: c.subj,
      body: { format: 'text', text: c.body },
      attachments: [],
    };
    lines.push(JSON.stringify({
      id: `everyday7a-${String(index).padStart(3, '0')}`,
      category_expected: isStop ? CATEGORY[c.sec] : 'none',
      expect: isStop ? 'stop' : 'pass',
      why: c.why,
      draft,
      meta,
    }));
  }
}
fs.writeFileSync(path.join(dir, 'cases.jsonl'), lines.join('\n') + '\n', 'utf8');
console.log(`wrote ${lines.length} cases from ${files.length} batch files`);
