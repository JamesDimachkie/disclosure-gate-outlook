// Serialization only: every subject, body and rationale is supplied as literal text.
import fs from 'node:fs/promises';
const root = new URL('./', import.meta.url);
const batch = process.argv[2];
if (!/^batch\d\d\.mjs$/.test(batch)) throw Error('Expected literal batch filename');
const rows = (await import(new URL(batch, root))).default;
let raw = '';
try { raw = await fs.readFile(new URL('cases.jsonl', root), 'utf8'); } catch (e) { if(e.code !== 'ENOENT') throw e; }
let n = raw.trim() ? raw.trimEnd().split('\n').length : 0;
for (const r of rows) {
 const [industry, english, subject, body, why, category = 'none', placement = 'none', sentence = null, keyVerb = null, keyNoun = null] = r;
 const c = {
  id: `realistic3-${String(++n).padStart(3,'0')}`,
  category_expected: category, expect: category === 'none' ? 'pass' : 'stop', why,
  metadata: { industry, english, placement, ...(sentence ? {deciding_sentence: sentence, key_verb: keyVerb, key_noun: keyNoun} : {}) },
  draft: {
   from: {name:'Office',address:'office@brambleworks.example'},
   to: [{name:'Client contact',address:'contact@tidequay.test',kind:'person'}], cc:[], bcc:[],
   subject, body:{format:'text',text:body}, attachments:[]
  }
 };
 raw += JSON.stringify(c)+'\n';
}
await fs.writeFile(new URL('cases.jsonl',root),raw,'utf8');
console.log(`Serialized ${rows.length} literal cases; total ${n}`);
