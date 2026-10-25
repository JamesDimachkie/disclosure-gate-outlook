import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {directory,literals,draftObject} from './serialize.mjs';
assert(process.argv.slice(2).every(a=>a==='--checkpoint'),'Unknown argument');
const checkpoint=process.argv.includes('--checkpoint');
const raw=await fs.readFile(path.join(directory,'cases.jsonl'));
assert(raw.length>0&&raw.at(-1)===10,'JSONL must end in LF');
assert(!raw.includes(13),'JSONL must use LF');
assert.equal(await fs.readFile(path.join(directory,'.gitattributes'),'utf8'),'* -text');
const cases=raw.toString('utf8').trimEnd().split('\n').map(JSON.parse);
const source=await literals();assert.deepEqual(cases,source.map(draftObject),'Literal serialization differs');
const cats=['secrets','payment','government_id','personal','economics','negotiation','remark','lookalike','exposed_list','file','none'];
const stopCats=['secrets','personal','economics','negotiation','remark'];
const dims=['implicit','buried','numbers','casual','mixed'];
const kinds=['banter','forward','chain','emotion','terse','footer'];
const counts=Object.fromEntries(cats.map(c=>[c,{stop:0,prompt:0,pass:0}]));
const hard=Object.fromEntries(dims.map(d=>[d,0]));const messy=Object.fromEntries(kinds.map(d=>[d,0]));
const ids=new Set(),drafts=new Set(),bodies=new Set(),settings=new Set();let ordinary=0,boundary=0,messyCases=0;
const domain=a=>{assert.match(a,/^[a-z][a-z0-9.-]*@[a-z][a-z0-9-]*\.(example|test)$/);return a.split('@')[1];};
for(const [i,c] of cases.entries()){
 assert.equal(c.id,`everyday7b-${String(i+1).padStart(3,'0')}`);assert(!ids.has(c.id));ids.add(c.id);
 assert(cats.includes(c.category_expected));assert(['stop','pass'].includes(c.expect));counts[c.category_expected][c.expect]++;
 assert(typeof c.why==='string'&&c.why.includes('SPEC §')&&!/[\r\n]/.test(c.why),'One-line rationale');
 const d=c.draft,m=c.metadata;assert.deepEqual(Object.keys(d).sort(),['from','to','cc','bcc','subject','body','attachments'].sort());
 const inside=domain(d.from.address);assert.equal(typeof d.from.name,'string');assert(!c.internal_domains,'No extra domains');
 assert.equal(d.to.length,1);assert.equal(d.cc.length,0);assert.equal(d.bcc.length,0);
 for(const key of ['to','cc','bcc']){assert(Array.isArray(d[key]));for(const r of d[key]){assert.equal(r.kind,'person');assert.equal(typeof r.name,'string');const outside=domain(r.address);assert.notEqual(outside,inside);assert.equal(inside,'oxbriar.example');assert.equal(outside,'lumenquay.test');}}
 assert.equal(typeof d.subject,'string');assert(d.subject.length>0&&d.subject.length<1000);assert.equal(d.body.format,'text');assert.equal(typeof d.body.text,'string');assert(d.body.text.length>0&&d.body.text.length<500000);assert.deepEqual(d.attachments,[]);
 const fingerprint=JSON.stringify(d),normalized=(d.subject+' '+d.body.text).toLowerCase().replace(/\s+/g,' ').trim();
 assert(!drafts.has(fingerprint),`Duplicate draft ${c.id}`);drafts.add(fingerprint);assert(!bodies.has(normalized),`Duplicate prose ${c.id}`);bodies.add(normalized);
 const t=d.subject+'\n'+d.body.text;
 assert(!/\d{7,}/.test(t),`Long digit run ${c.id}`);
 assert(!/(?:\d[ -]*){13,19}/.test(t),`Card-like sequence ${c.id}`);
 assert(!/\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]){10,30}\b/.test(t),`IBAN-like sequence ${c.id}`);
 assert(!/\b\d{3}-\d{2}-\d{4}\b/.test(t),`SSN-like sequence ${c.id}`);
 assert(typeof m.setting==='string'&&m.setting.length>0);assert(typeof m.industry==='string'&&m.industry.length>0);
 assert(['body','quoted','list','subject'].includes(m.placement));assert(Array.isArray(m.hardness)&&new Set(m.hardness).size===m.hardness.length);assert(m.hardness.every(h=>dims.includes(h)));
 assert(Array.isArray(m.messy)&&new Set(m.messy).size===m.messy.length);assert(m.messy.every(k=>kinds.includes(k)));
 if(c.expect==='stop'){
  assert.equal(m.cohort,'stop');assert(stopCats.includes(c.category_expected));assert(m.hardness.length>0);assert.equal(m.messy.length,0);assert.equal(m.boundary,null);
  const q=m.deciding_sentence;assert(typeof q==='string'&&q.length>10&&!/[\r\n]/.test(q));assert.equal(t.split(q).length-1,1,`Deciding occurrence ${c.id}`);assert(c.why.includes('“'+q+'”'),`Rationale quote ${c.id}`);
  if(m.placement==='subject')assert.equal(d.subject,q);
  else {assert(d.body.text.includes(q));const line=d.body.text.split('\n').find(l=>l.includes(q));if(m.placement==='quoted')assert(/^>+\s/.test(line));if(m.placement==='list')assert(/^[-*] /.test(line));if(m.placement==='body')assert(!/^(?:>|[-*] )/.test(line));}
  if(m.hardness.includes('buried')){assert(['quoted','list'].includes(m.placement)||d.body.text.split(/\s+/).length>=400);if(m.placement==='quoted')assert(d.body.text.split('\n').filter(l=>/^>/.test(l)).length>=8);if(m.placement==='list')assert(d.body.text.split('\n').filter(l=>/^[-*] /.test(l)).length>=10);}
  if(m.hardness.includes('numbers'))assert(/\d/.test(q));
  for(const h of m.hardness)hard[h]++;
 } else {
  assert.equal(c.category_expected,'none');assert.equal(m.deciding_sentence,null);assert.equal(m.hardness.length,0);
  if(m.cohort==='ordinary'){ordinary++;settings.add(m.setting);assert.equal(m.boundary,null);if(m.messy.length)messyCases++;for(const k of m.messy)messy[k]++;if(m.messy.includes('chain'))assert(d.body.text.split('\n').filter(l=>/^>/.test(l)).length>=8);if(m.messy.includes('forward'))assert(/Forwarded|Newsletter|Press release|Article/i.test(d.body.text));}
  else {assert.equal(m.cohort,'boundary');boundary++;assert(typeof m.boundary==='string'&&m.boundary.length>0);assert(/SPEC §5\.[14567]|SPEC §5\.10/.test(c.why));}
 }
}
assert(cases.length<=260);for(const cat of stopCats)assert(counts[cat].stop<=12);assert(ordinary<=100&&boundary<=100);
if(!checkpoint){assert.equal(cases.length,260);for(const cat of stopCats)assert.equal(counts[cat].stop,12);assert.equal(ordinary,100);assert.equal(boundary,100);assert(settings.size>=60);assert(messyCases>=40);for(const h of dims)assert(hard[h]>=8);}
const readme=await fs.readFile(path.join(directory,'README.md'),'utf8');
for(const category of cats){const rows=readme.split(/\r?\n/).filter(l=>l.startsWith(`| ${category} |`));assert.equal(rows.length,1);const numbers=rows[0].split('|').slice(2,6).map(x=>Number(x.trim()));const c=counts[category];assert.deepEqual(numbers,[c.stop,c.prompt,c.pass,c.stop+c.prompt+c.pass]);}
const totals=readme.split(/\r?\n/).filter(l=>l.startsWith('| **Total** |'));assert.equal(totals.length,1);assert.deepEqual(totals[0].split('|').slice(2,6).map(x=>Number(x.trim().replaceAll('*',''))),[cases.filter(c=>c.expect==='stop').length,0,ordinary+boundary,cases.length]);
for(const [k,v] of Object.entries({...hard,...messy}))assert(readme.includes(`- ${k}: ${v}\n`),`README count ${k}`);
console.log(`PASS ${checkpoint?'checkpoint':'final'}: ${cases.length} cases; schema, consecutive IDs, literal fidelity, quotas, duplicates, outside-only domains, no attachments, deciding sentences/placements, numeric screen and README agreement.`);
console.log(`Composition: ${stopCats.map(c=>c+'='+counts[c].stop+' stop').join('; ')}; none=${ordinary+boundary} pass; prompt=0.`);
console.log(`Ordinary=${ordinary}; boundary=${boundary}; ordinary settings=${settings.size}; messy ordinary=${messyCases}.`);
console.log('Hardness: '+JSON.stringify(hard));console.log('Messy kinds: '+JSON.stringify(messy));
console.log('SHA-256: '+createHash('sha256').update(raw).digest('hex'));
