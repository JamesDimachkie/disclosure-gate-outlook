// Reads every generated file with the add-in's own attachment reader and checks that each one is read
// in full and that its distinctive phrases (amounts, names, accented and non-Latin text) come through.
// Usage: node evaluation/everyday-docs/check.mjs [results.json]
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { attachmentText } from '../../core/attachments.mjs';
const dir = new URL('./files/', import.meta.url);
const want = {
  invoice: ['£834.00', 'Fenwick Estates'], letter: ['Mrs Okafor', 'Practice Manager'], report: ['rainwater butts', '355'],
  payslip_template: ['Marco Bellini', 'Plasterboard'], contract: ['14. Law', 'ten working days'], minutes: ['£1,240', 'east entrance'],
  menu: ['pâté', 'crème fraîche'], multilingual: ['Καλώς ήρθατε', 'Добро пожаловать', 'Hoş geldiniz', 'ご滞在', '欢迎光临'],
  newsletter: ['hedge trimmers', 'sharpen garden tools'], quote: ['Q-2209', '£180.00'], policy: ['30. Staff', 'carried over'],
  checklist: ['Water urns filled', 'Name badges'],
};
const squash = (s) => s.normalize('NFC').replace(/\s+/g, ' ');
const results = [];
for (const name of readdirSync(dir).sort()) {
  const bytes = readFileSync(new URL(name, dir)), kind = name.split('.').pop();
  const read = attachmentText({ id: name, name: 'file.' + kind, type: 'file', size: bytes.length, content: bytes.toString('base64') });
  const text = squash(read.text || '');
  results.push({ file: name, ok: read.ok, reason: read.reason || null, missing: want[name.split('.')[0]].filter((p) => !text.includes(squash(p))) });
}
const summary = { files: results.length, readInFull: results.filter((r) => r.ok).length, allPhrases: results.filter((r) => r.ok && !r.missing.length).length };
console.log(JSON.stringify(summary));
for (const r of results) if (!r.ok || r.missing.length) console.log(JSON.stringify(r));
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify({ ...summary, results }, null, 2) + '\n');
