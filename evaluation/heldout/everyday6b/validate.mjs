import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const cats=['secrets','payment','government_id','personal','economics','negotiation','remark','lookalike','exposed_list','file','none'];
const dims=['implicit_or_indirect','buried','numbers_without_labels','casual_or_regional','hedged_or_mixed'];
const checkpoint=process.argv.includes('--checkpoint');
function need(x,m){if(!x)throw Error(m);}
const raw=await fs.readFile(path.join(here,'cases.jsonl'),'utf8');
const readme=await fs.readFile(path.join(here,'README.md'),'utf8');
const cases=raw.trimEnd().split(/\r?\n/).map((x,i)=>{try{return JSON.parse(x)}catch{throw Error(`invalid JSON line ${i+1}`)}});
need(checkpoint?cases.length>0:cases.length===260,`case count ${cases.length}`);
const counts=Object.fromEntries(cats.map(x=>[x,{stop:0,prompt:0,pass:0}]));
const dimCounts=Object.fromEntries(dims.map(x=>[x,0])); const ids=new Set(), drafts=new Set();
const everydaySettings=new Set(), boundaryLines=new Set(); let boundaryCount=0;
const placements={body:0,quoted_body:0,subject:0}; const bodyWordCounts=[]; const boundarySections=Object.fromEntries(['5.1','5.4','5.5','5.6','5.7'].map(x=>[x,0]));
for(let i=0;i<cases.length;i++){
 const c=cases[i]; need(c.id===`everyday6b-${String(i+1).padStart(3,'0')}`,'IDs must be sequential and unique'); need(!ids.has(c.id),'duplicate ID'); ids.add(c.id);
 need(cats.includes(c.category_expected)&&['stop','prompt','pass'].includes(c.expect),'bad category or expectation'); counts[c.category_expected][c.expect]++;
 need(typeof c.why==='string'&&/^SPEC §5\.[1-7]:/.test(c.why)&&!/[\r\n]/.test(c.why),'rationale must be one-line SPEC §5.x');
 const d=c.draft; need(d&&d.body?.format==='text'&&typeof d.body.text==='string'&&typeof d.subject==='string','bad draft');
 placements[c.placement]++; bodyWordCounts.push((d.body.text.match(/\S+/g)||[]).length);
 need(Array.isArray(d.to)&&d.to.length===1&&Array.isArray(d.cc)&&d.cc.length===0&&Array.isArray(d.bcc)&&d.bcc.length===0&&Array.isArray(d.attachments)&&d.attachments.length===0,'recipient or attachment contract');
 need(/^[^@\s]+@[^@\s]+$/.test(d.from.address)&&/^[^@\s]+@[^@\s]+$/.test(d.to[0].address),'bad email address');
 for(const addr of [d.from.address,d.to[0].address])need(/\.(example|test)$/i.test(addr.split('@')[1]),'non-synthetic email domain');
 need(d.to[0].address.split('@')[1].toLowerCase()!==d.from.address.split('@')[1].toLowerCase(),'recipient is not outside the sender domain');
 const key=JSON.stringify(d);need(!drafts.has(key),'duplicate draft');drafts.add(key);
 need(['body','quoted_body','subject'].includes(c.placement),'bad placement');
 const field=c.placement==='subject'?d.subject:d.body.text; need(typeof c.deciding_sentence==='string'&&c.deciding_sentence.length>0,'missing deciding sentence');
 need(field.split(c.deciding_sentence).length-1===1,`deciding sentence must occur exactly once in its placement: ${c.id}`);
 need(c.why.includes(c.deciding_sentence),'rationale must quote the deciding sentence verbatim');
 if(c.expect==='stop'){
  need(['secrets','personal','economics','negotiation','remark'].includes(c.category_expected),'stop category outside brief');
  need(Array.isArray(c.hardness_dimensions)&&c.hardness_dimensions.length,'stop missing dimensions');
  for(const x of c.hardness_dimensions){need(dims.includes(x),'unknown hardness dimension');dimCounts[x]++;}
  if(c.hardness_dimensions.includes('buried'))need(c.placement==='quoted_body'&&(/^>/.test(d.body.text)||d.body.text.includes('\n>')),'buried case not in quoted history');
 }else{
  need(c.category_expected==='none'&&c.expect==='pass','pass cases must be category none');
  need(Array.isArray(c.hardness_dimensions)&&c.hardness_dimensions.length===0,'pass has hardness metadata');
  if(c.boundary){need(/^SPEC §5\./.test(c.boundary),'boundary pass missing SPEC line');boundaryLines.add(c.boundary);boundaryCount++;const m=c.boundary.match(/^SPEC §(5\.[1-7])/);if(m)boundarySections[m[1]]++;}
  else everydaySettings.add(c.industry);
 }
 const text=d.body.text+' '+d.subject;
 need(!/\b(?:\d[ -]?){13,19}\b/.test(text),'card-like numeric sequence');
 need(!/\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]){11,30}\b/i.test(text),'IBAN-like sequence');
 need(!/\d{8,}/.test(text),'long digit run');
}
if(!checkpoint){
 need(cases.length===260,'need 260 cases'); need(cases.filter(c=>c.expect==='stop').length===60,'need 60 stops'); need(cases.filter(c=>c.expect==='pass').length===200,'need 200 passes');
 for(const k of ['secrets','personal','economics','negotiation','remark'])need(counts[k].stop===12,`need 12 ${k} stops`);
 for(const k of dims)need(dimCounts[k]>=8,`need at least 8 ${k} stops`);
 need(everydaySettings.size===100,`need exactly 100 ordinary settings, got ${everydaySettings.size}`);
 need(boundaryCount===100,`need exactly 100 boundary passes, got ${boundaryCount}`);
}
for(const cat of cats){const row=readme.split(/\r?\n/).find(x=>x.startsWith(`| ${cat} |`));need(row,`missing README row ${cat}`);const n=row.split('|').slice(2,6).map(x=>Number(x.trim()));const x=counts[cat];need(n[0]===x.stop&&n[1]===x.prompt&&n[2]===x.pass&&n[3]===x.stop+x.prompt+x.pass,`README row mismatch ${cat}`);}
const tr=readme.split(/\r?\n/).find(x=>x.startsWith('| **Total** |'));need(tr,'missing total row');const tn=tr.split('|').slice(2,6).map(x=>Number(x.trim().replaceAll('*','')));need(tn[0]===cases.filter(c=>c.expect==='stop').length&&tn[1]===cases.filter(c=>c.expect==='prompt').length&&tn[2]===cases.filter(c=>c.expect==='pass').length&&tn[3]===cases.length,'README total mismatch');
const sortedWords=[...bodyWordCounts].sort((a,b)=>a-b); const medianWords=sortedWords.length%2?sortedWords[(sortedWords.length-1)/2]:(sortedWords[sortedWords.length/2-1]+sortedWords[sortedWords.length/2])/2; const meanWords=(bodyWordCounts.reduce((a,b)=>a+b,0)/bodyWordCounts.length).toFixed(1);
console.log(`VALID ${cases.length} cases; composition ${JSON.stringify(counts)}; hardness ${JSON.stringify(dimCounts)}; ordinary settings ${everydaySettings.size}; boundary passes ${boundaryCount}`);
console.log(`placements ${JSON.stringify(placements)}; body words min/median/mean/max ${sortedWords[0]}/${medianWords}/${meanWords}/${sortedWords.at(-1)}; boundary by SPEC section ${JSON.stringify(boundarySections)}`);
