import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const final = process.argv.includes('--final');
const cases = (await fs.readFile(path.join(dir, 'cases.jsonl'), 'utf8')).trimEnd().split(/\r?\n/).map((line, i) => {
  try { return JSON.parse(line); } catch { throw new Error(`invalid JSON line ${i + 1}`); }
});
const readme = await fs.readFile(path.join(dir, 'README.md'), 'utf8');
const ids = new Set(), bodies = new Set(), counts = new Map();
for (let i=0; i<cases.length; i++) {
  const c=cases[i], expectedId=`everyday5-${String(i+1).padStart(3,'0')}`;
  if(c.id!==expectedId || ids.has(c.id)) throw new Error(`ID order/uniqueness error at line ${i+1}`);
  ids.add(c.id);
  if(!['none','personal','economics','negotiation','remark','secrets'].includes(c.category_expected)) throw new Error(`invalid category ${c.id}`);
  if(!['pass','stop'].includes(c.expect) || (c.category_expected==='none')!==(c.expect==='pass')) throw new Error(`category/outcome mismatch ${c.id}`);
  const r=c.draft;
  if(!r || !/\.example$|\.test$/i.test(r.from.address) || !Array.isArray(r.to) || !Array.isArray(r.cc) || !Array.isArray(r.bcc) || !r.to.length || typeof r.subject!=='string' || r.body?.format!=='text' || typeof r.body.text!=='string' || !Array.isArray(r.attachments) || r.attachments.length) throw new Error(`draft shape/domain error ${c.id}`);
  if([...r.to,...r.cc,...r.bcc].some(x=>!/@[^@\s]+\.(example|test)$/i.test(x.address) || x.address.slice(x.address.lastIndexOf('@')+1).toLowerCase()===r.from.address.slice(r.from.address.lastIndexOf('@')+1).toLowerCase())) throw new Error(`nonfictional or not-outside recipient domain ${c.id}`);
  const full=`${r.subject}\n${r.body.text}`;
  if(bodies.has(full)) throw new Error(`duplicate subject/body ${c.id}`); bodies.add(full);
  if(/(?:\d[ -]?){13,19}/.test(full) || /\b\d{9,}\b/.test(full)) throw new Error(`numeric screen hit ${c.id}`);
  if(c.expect==='stop') {
    const a=c.authoring, sentence=a?.deciding_sentence;
    if(!sentence || !c.why.includes(`“${sentence}”`) || c.why.split('“').length!==2) throw new Error(`rationale quote error ${c.id}`);
    const where=a.placement==='subject' ? r.subject : r.body.text;
    if(where.split(sentence).length!==2 || (a.placement==='subject' && r.body.text.includes(sentence)) || (a.placement!=='subject' && r.subject.includes(sentence)) || (a.placement==='quoted_body' && !r.body.text.split(/\r?\n/).some(line=>line.startsWith('>')&&line.includes(sentence))) || (a.placement==='body' && r.body.text.split(/\r?\n/).some(line=>line.startsWith('>')&&line.includes(sentence)))) throw new Error(`deciding sentence placement/count error ${c.id}`);
  }
  const k=c.category_expected; const v=counts.get(k)??{stop:0,prompt:0,pass:0};v[c.expect]++;counts.set(k,v);
}
const total=cases.length, stops=cases.filter(c=>c.expect==='stop').length, passes=cases.filter(c=>c.expect==='pass').length;
const table=readme.split(/\r?\n/);
for(const category of ['secrets','payment','government_id','personal','economics','negotiation','remark','lookalike','exposed_list','file','none']) {
  const rows=table.filter(x=>x.startsWith(`| ${category} |`));
  if(rows.length!==1) throw new Error(`README must have exactly one category row for ${category}`);
  const actual=counts.get(category)??{stop:0,prompt:0,pass:0};
  const expected=`| ${category} | ${actual.stop} | ${actual.prompt} | ${actual.pass} | ${actual.stop+actual.prompt+actual.pass} |`;
  if(rows[0]!==expected) throw new Error(`README composition row differs for ${category}; expected ${expected}`);
}
if(final) {
  if(total!==360||stops!==60||passes!==300) throw new Error(`final composition incomplete: ${total} total, ${stops} stop, ${passes} pass`);
  for(const category of ['secrets','personal','economics','negotiation','remark']) if((counts.get(category)?.stop??0)!==12) throw new Error(`final quota incomplete: ${category}`);
  if(cases.some(c=>!c.authoring?.industry||!c.authoring?.english||!c.authoring?.placement)) throw new Error('missing required authoring metadata');
}
const totalRows=table.filter(x=>x.startsWith('| **Total** |'));
const expectedTotal=`| **Total** | **${stops}** | **0** | **${passes}** | **${total}** |`;
if(totalRows.length!==1||totalRows[0]!==expectedTotal)throw new Error(`README total row differs; expected ${expectedTotal}`);
console.log(`PASS ${final ? 'final' : 'checkpoint'}: ${total} cases; ${stops} stop; ${passes} pass; unique ordered IDs, literal rationale placements, domains, numeric screen, and README composition agree.`);
