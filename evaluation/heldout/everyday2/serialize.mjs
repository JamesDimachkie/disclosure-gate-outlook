// Serializer for the everyday2 held-out set.
//
// It reads the hand-written literal batches in ./batches (batch-01.mjs, batch-02.mjs, ...), assigns
// sequential ids in file order, and wraps each literal in the schema evaluation/heldout/run.mjs reads.
// It writes nothing it did not read: no templates, no generation, no combination of prose. The only
// values it supplies are the id, the empty attachments array, the body format, and a default
// recipient kind of "person" where a literal leaves it out.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const batchDir = path.join(here, 'batches');
const allowed = new Set(['category', 'expect', 'why', 'industry', 'variant', 'placement', 'deciding', 'from', 'to', 'cc', 'bcc', 'subject', 'body']);

const files = (await fs.readdir(batchDir)).filter((f) => /^batch-\d{2}\.mjs$/.test(f)).sort();
const cases = [];
const recipient = (r) => ({ name: r.name, address: r.address, kind: r.kind ?? 'person' });

for (const file of files) {
  const { default: literals } = await import(pathToFileURL(path.join(batchDir, file)).href);
  if (!Array.isArray(literals)) throw new Error(`${file} does not export an array`);
  literals.forEach((l, index) => {
    for (const key of Object.keys(l)) {
      if (!allowed.has(key)) throw new Error(`${file}[${index}] has unknown key "${key}"`);
    }
    const n = cases.length + 1;
    const stop = l.expect === 'stop';
    cases.push({
      id: `everyday2-${String(n).padStart(3, '0')}`,
      category_expected: l.category,
      expect: l.expect,
      why: l.why,
      ...(stop ? { placement: l.placement, deciding_sentence: l.deciding } : {}),
      meta: { industry: l.industry, variant: l.variant, batch: file.replace(/\.mjs$/, '') },
      draft: {
        from: { name: l.from.name, address: l.from.address },
        to: (l.to ?? []).map(recipient),
        cc: (l.cc ?? []).map(recipient),
        bcc: (l.bcc ?? []).map(recipient),
        subject: l.subject,
        body: { format: 'text', text: l.body },
        attachments: [],
      },
    });
  });
}

const out = cases.map((c) => JSON.stringify(c)).join('\n') + '\n';
await fs.writeFile(path.join(here, 'cases.jsonl'), out, 'utf8');
console.log(`Wrote ${cases.length} cases from ${files.length} batch file(s) to cases.jsonl`);
