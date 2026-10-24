// Envelope serialization only. Every subject, body and rationale is a literal in batches/.
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.dirname(fileURLToPath(import.meta.url));
const files = (await fs.readdir(path.join(root, 'batches'))).filter(f => /^batch-\d{2}\.json$/.test(f)).sort();
const cases = [];
function person(s) {
  const [name, address, ...extra] = s.split('|');
  if (!name || !address || extra.length) throw Error('Expected literal Name|address');
  return {name, address, kind:'person'};
}
for (const file of files) {
  const batch = JSON.parse(await fs.readFile(path.join(root, 'batches', file), 'utf8'));
  for (const [expect, rows] of [['pass', batch.pass], ['stop', batch.stop]]) {
    for (const row of rows) {
      if (row.length !== (expect === 'pass' ? 7 : 10)) throw Error(`${file}: row width`);
      const [industry, english, from, to, subject, body] = row;
      const [category, placement, deciding, why] = expect === 'pass' ? ['none','none','',row[6]] : row.slice(6);
      cases.push({id:`everyday3-${String(cases.length+1).padStart(3,'0')}`, category_expected:category, expect, why,
        meta:{industry,english,placement,deciding_sentence:deciding,batch:file},
        draft:{from:person(from),to:[person(to)],cc:[],bcc:[],subject,body:{format:'text',text:body},attachments:[]}});
    }
  }
}
await fs.writeFile(path.join(root,'cases.jsonl'),cases.map(c=>JSON.stringify(c)).join('\n')+'\n','utf8');
console.log(`Serialized ${files.length} literal batches, ${cases.length} cases.`);
