import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const files = (await fs.readdir(dir)).filter(name => /^batch-\d{2}\.jsonl$/.test(name)).sort();
const records = [];
for (const name of files) {
  const lines = (await fs.readFile(path.join(dir, name), 'utf8')).trimEnd().split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    try { records.push(JSON.parse(line)); }
    catch { throw new Error(`Invalid literal at ${name}:${index + 1}`); }
  }
}
const cases = records.map(r => {
  const stops = r.expect === 'stop';
  const deciding = r.deciding_sentence;
  const why = stops ? `SPEC §${r.spec_section}: “${deciding}”` : `SPEC §5: ordinary outside correspondence; no deciding disclosure.`;
  const subjectPlacement = r.placement === 'subject';
  const body = subjectPlacement && deciding ? r.body : r.body;
  const subject = subjectPlacement && deciding ? deciding : r.subject;
  return {
    id: r.id,
    category_expected: r.category_expected,
    expect: r.expect,
    why,
    authoring: { industry: r.industry, english: r.english, placement: r.placement, ...(deciding ? { deciding_sentence: deciding } : {}) },
    draft: {
      from: { name: 'Mira Vale', address: 'mira@gate.example' },
      to: [{ name: r.recipient_name ?? 'Rowan Field', address: 'rowan@outside.example', kind: 'person' }],
      cc: [], bcc: [], subject,
      body: { format: 'text', text: body },
      attachments: []
    }
  };
});
await fs.writeFile(path.join(dir, 'cases.jsonl'), cases.map(c => JSON.stringify(c)).join('\n') + '\n', 'utf8');
console.log(`Serialized ${cases.length} literal cases from ${files.length} batches.`);
