// Turns the authored literals in ./batches/*.mjs into the runner's case objects and writes cases.jsonl.
// It does no templating, generation or combination of prose: every subject and body is a literal in a batch file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const batchDir = path.join(dir, 'batches');
const files = fs.readdirSync(batchDir).filter((f) => /^batch-\d{2}\.mjs$/.test(f)).sort();

const recipient = ([name, address]) => ({ name, address, kind: 'person' });

function toCase(a, file) {
  if (!Number.isInteger(a.id)) throw new Error(`${file}: id must be an integer`);
  const id = `everyday6a-${String(a.id).padStart(3, '0')}`;
  const meta = { kind: a.kind, industry: a.industry, variant: a.variant, setting: a.setting };
  if (a.kind === 'stop') {
    meta.placement = a.placement;
    meta.hardness = a.hardness;
    if (a.buried) meta.buried = a.buried;
    meta.deciding_sentence = a.deciding;
  } else if (a.kind === 'boundary') {
    meta.boundary = a.boundary;
  }
  return {
    id,
    category_expected: a.category,
    expect: a.expect,
    why: a.why,
    meta,
    draft: {
      from: { name: a.from[0], address: a.from[1] },
      to: (a.to || []).map(recipient),
      cc: (a.cc || []).map(recipient),
      bcc: (a.bcc || []).map(recipient),
      subject: a.subject,
      body: { format: 'text', text: a.body },
      attachments: [],
    },
  };
}

const cases = [];
for (const file of files) {
  const mod = await import(pathToFileURL(path.join(batchDir, file)).href);
  for (const a of mod.default) cases.push(toCase(a, file));
}
cases.sort((x, y) => x.id.localeCompare(y.id));
const out = cases.map((c) => JSON.stringify(c)).join('\n') + '\n';
fs.writeFileSync(path.join(dir, 'cases.jsonl'), out, { encoding: 'utf8' });
console.log(`Wrote ${cases.length} cases from ${files.length} batch file(s) to cases.jsonl`);
