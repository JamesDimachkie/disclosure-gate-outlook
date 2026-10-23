// Turns authored emails into the sentence units the add-in classifies, so training labels line up
// with what Send sees. Usage: node model/data2/split.mjs <emails.jsonl> <sentences.jsonl>
// An email line: {id, author, industry, region, subject, body}. Output lines keep the email id, the
// sentence's source (subject|body), index, text and previous sentence (context), with label null
// for the author to fill in. Rerunning keeps labels already written for unchanged sentences.
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { splitSentences } from '../../core/sentences.mjs';
const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error('Usage: node model/data2/split.mjs <emails.jsonl> <sentences.jsonl>');
const old = new Map();
if (existsSync(output)) for (const line of (await readFile(output, 'utf8')).split(/\r?\n/).filter(Boolean)) {
  const s = JSON.parse(line); old.set(`${s.email}|${s.source}|${s.index}|${s.text}|${s.context}`, s);
}
const out = [];
for (const line of (await readFile(input, 'utf8')).split(/\r?\n/).filter(Boolean)) {
  const e = JSON.parse(line);
  for (const source of ['subject', 'body']) {
    const sentences = splitSentences(e[source] || '');
    sentences.forEach((s, index) => {
      const unit = { email: e.id, source, index, text: s.text, context: sentences[index - 1]?.text || '' };
      const prior = old.get(`${unit.email}|${source}|${index}|${unit.text}|${unit.context}`);
      out.push({ ...unit, label: prior?.label ?? null, subkind: prior?.subkind ?? null, note: prior?.note ?? null });
    });
  }
}
await writeFile(output, out.map(x => JSON.stringify(x)).join('\n') + '\n');
console.log(`${out.length} sentences, ${out.filter(x => x.label === null).length} unlabelled`);
