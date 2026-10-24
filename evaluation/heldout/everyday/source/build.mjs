// Serializes the hand-written messages in batch-*.mjs into ../cases.jsonl.
// It assigns sequential ids and wraps each literal message in the run.mjs draft shape.
// It generates no text: every subject, body, rationale and attachment is written in the batch files.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const batchFiles = (await fs.readdir(directory)).filter(f => /^batch-\d{2}\.mjs$/.test(f)).sort();
const person = ([name, address]) => ({ name, address, kind: 'person' });
const contentTypes = { txt: 'text/plain', csv: 'text/csv' };

const lines = [];
for (const file of batchFiles) {
  const { default: messages } = await import(pathToFileURL(path.join(directory, file)).href);
  for (const m of messages) {
    const id = `everyday-${String(lines.length + 1).padStart(3, '0')}`;
    const attachments = (m.attachments ?? []).map((a, i) => {
      const bytes = Buffer.from(a.text, 'utf8');
      return {
        id: `${id}-att-${i + 1}`,
        name: a.name,
        contentType: contentTypes[a.name.split('.').pop()],
        size: bytes.length,
        isInline: false,
        type: 'file',
        content: bytes.toString('base64'),
      };
    });
    const record = {
      id,
      category_expected: 'none',
      expect: 'pass',
      why: m.why,
      industry: m.industry,
      english: m.english,
      ...(m.internal_domains ? { internal_domains: m.internal_domains } : {}),
      draft: {
        from: { name: m.from[0], address: m.from[1] },
        to: m.to.map(person),
        cc: (m.cc ?? []).map(person),
        bcc: (m.bcc ?? []).map(person),
        subject: m.subject,
        body: { format: 'text', text: m.body },
        attachments,
      },
    };
    lines.push(JSON.stringify(record));
  }
}
await fs.writeFile(path.join(directory, '..', 'cases.jsonl'), lines.join('\n') + '\n', 'utf8');
console.log(`Wrote ${lines.length} cases from ${batchFiles.length} batch files.`);
