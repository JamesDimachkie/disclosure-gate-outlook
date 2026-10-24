// Serializer: turns the literal authoring batches into cases.jsonl. It adds ids and wraps recipients;
// it generates no prose and combines none (every subject, body, sentence and rationale is a literal).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const STOP_CATEGORY = { access: 'secrets', personal: 'personal', economics: 'economics', negotiation: 'negotiation', remark: 'remark' };
const PASS_WHY = 'SPEC §5: ordinary outside correspondence; nothing in it is on the flag list.';
const person = ([name, address]) => ({ name, address, kind: 'person' });

const files = fs.readdirSync(path.join(dir, 'batches')).filter((f) => /^batch-\d\d\.mjs$/.test(f)).sort();
const items = [];
for (const f of files) items.push(...(await import(pathToFileURL(path.join(dir, 'batches', f)).href)).default);

const lines = items.map((c, i) => {
  const stop = typeof c.stop === 'string';
  if (stop && !STOP_CATEGORY[c.stop]) throw new Error(`Unknown stop family in item ${i + 1}`);
  const draft = {
    from: { name: c.from[0], address: c.from[1] },
    to: c.to.map(person),
    cc: (c.cc ?? []).map(person),
    bcc: [],
    subject: c.subject,
    body: { format: 'text', text: c.body },
    attachments: []
  };
  const out = {
    id: `everyday4-${String(i + 1).padStart(3, '0')}`,
    category_expected: stop ? STOP_CATEGORY[c.stop] : 'none',
    expect: stop ? 'stop' : 'pass',
    why: stop ? c.why : PASS_WHY,
    industry: c.ind,
    english: c.en,
    placement: stop ? c.place : 'none',
    ...(stop ? { deciding_sentence: c.sentence } : {}),
    draft
  };
  return JSON.stringify(out);
});
fs.writeFileSync(path.join(dir, 'cases.jsonl'), lines.join('\n') + '\n', 'utf8');
console.log(`Wrote ${lines.length} cases from ${files.length} batch file(s).`);
