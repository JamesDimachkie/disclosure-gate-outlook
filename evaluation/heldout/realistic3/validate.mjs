// Standalone tier validation. No checker, parent-tier data, dependencies or network.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root = new URL('./',import.meta.url);
const args = process.argv.slice(2);
const check = (ok, message) => { if(!ok) throw Error(message); };
check(args.every(x=>['--write-receipt','--checkpoint'].includes(x)) && new Set(args).size===args.length,'Invalid arguments');
const categories=['secrets','payment','government_id','personal','economics','negotiation','remark','lookalike','exposed_list','file','none'];
const sections={secrets:'5.1',personal:'5.4',economics:'5.5',negotiation:'5.6',remark:'5.7'};
const [raw,readme]=await Promise.all(['cases.jsonl','README.md'].map(x=>fs.readFile(new URL(x,root),'utf8')));
check(raw.endsWith('\n')&&!raw.startsWith('\uFEFF'),'JSONL must be UTF-8, no BOM, final newline');
const lines=raw.slice(0,-1).split('\n');
const cases=lines.map((x,i)=>{try{return JSON.parse(x);}catch{throw Error(`Invalid JSON line ${i+1}`);}});
const counts=Object.fromEntries(categories.map(c=>[c,{stop:0,prompt:0,pass:0}]));
const ids=new Set(),bodies=new Set(),verbs=new Set(),nouns=new Set();
const placements={body:0,quoted_history:0,subject:0};
const domain=address=>{
 check(typeof address==='string'&&/^[a-z0-9._+-]+@[a-z0-9-]+\.(example|test)$/i.test(address),'Non-reserved or invalid address');
 return address.split('@')[1].toLowerCase();
};
const occurrences=(text,needle)=>text.split(needle).length-1;
function distance(a,b){let row=Array.from({length:b.length+1},(_,i)=>i);for(let i=0;i<a.length;i++){let next=[i+1];for(let j=0;j<b.length;j++)next.push(Math.min(next[j]+1,row[j+1]+1,row[j]+(a[i]===b[j]?0:1)));row=next;}return row[b.length];}
function keys(o,expected,label){check(o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join(',')===expected.sort().join(','),`Invalid ${label} fields`);}
for(const [i,c] of cases.entries()){
 const label=`case ${i+1}`;
 keys(c,['id','category_expected','expect','why','metadata','draft'],label);
 check(c.id===`realistic3-${String(i+1).padStart(3,'0')}`&&!ids.has(c.id),'Invalid, unordered or repeated ID');ids.add(c.id);
 check(categories.includes(c.category_expected)&&['pass','stop'].includes(c.expect),'Invalid outcome/category');
 check(c.expect==='pass'?c.category_expected==='none':Object.hasOwn(sections,c.category_expected),'Label mismatch');
 check(typeof c.why==='string'&&/^SPEC §\d/.test(c.why)&&!/[\r\n]/.test(c.why),'Invalid one-line rationale');
 counts[c.category_expected][c.expect]++;
 const d=c.draft,m=c.metadata;
 keys(d,['from','to','cc','bcc','subject','body','attachments'],'draft');
 keys(d.from,['name','address'],'sender');check(typeof d.from.name==='string'&&d.from.name.length>0,'Sender name');
 const own=domain(d.from.address);
 const internal=[own,...(c.internal_domains??[])];
 let outside=0,visible=0;
 for(const field of ['to','cc','bcc']){
  check(Array.isArray(d[field]),'Missing recipient array');
  for(const r of d[field]){
   keys(r,['name','address','kind'],'recipient');check(typeof r.name==='string'&&r.name.length>0&&r.kind==='person','Invalid person recipient');
   const rd=domain(r.address);
   if(!internal.includes(rd)){
    outside++;if(field!=='bcc')visible++;
    const a=own.split('.')[0],b=rd.split('.')[0];
    check(distance(a,b)>2&&!b.includes(a)&&!a.includes(b),'Potential lookalike routing');
   }
  }
 }
 check(outside>=1&&visible<8,'Outside routing or exposed-list violation');
 check(typeof d.subject==='string'&&d.subject.length>0&&d.subject.length<=1000&&!/[\r\n]/.test(d.subject),'Invalid subject');
 keys(d.body,['format','text'],'body');check(d.body.format==='text'&&typeof d.body.text==='string'&&d.body.text.length>0&&d.body.text.length<=500000,'Invalid body');
 const normalized=d.body.text.normalize('NFKC').replace(/\s+/g,' ').trim().toLowerCase();
 check(!bodies.has(normalized),'Repeated normalized body');bodies.add(normalized);
 check(Array.isArray(d.attachments)&&d.attachments.length===0,'This tier uses no attachments');
 const text=d.subject+'\n'+d.body.text;
 for(const found of text.matchAll(/[a-z0-9._+-]+@([a-z0-9.-]+)/gi))domain(found[0]);
 for(const url of text.matchAll(/https?:\/\/([^\s/]+)/gi))check(/^[a-z0-9-]+\.(example|test)$/i.test(url[1]),'Non-reserved URL');
 check(!/(?:\d[ -]*){9,}/.test(text),'Prohibited long numeric sequence');
 check(!/\b(?:AKIA|ghp_|github_pat_|xox[bp]-|sk_live_|AIza|sk-ant-|sk-)[A-Za-z0-9_-]+|BEGIN .*PRIVATE KEY|\b(?:SSN|IBAN|SWIFT|CVV)\s*[:=]/.test(text),'Credential or identifier fixture');
 check(typeof m.industry==='string'&&m.industry.length>0&&['UK','US','AU'].includes(m.english),'Invalid scenario metadata');
 if(c.expect==='pass'){
  keys(m,['industry','english','placement'],'pass metadata');check(m.placement==='none','Pass deciding placement');
 }else{
  keys(m,['industry','english','placement','deciding_sentence','key_verb','key_noun'],'stop metadata');
  check(Object.hasOwn(placements,m.placement),'Invalid stop placement');placements[m.placement]++;
  const s=m.deciding_sentence;
  check(typeof s==='string'&&s.length>10&&!/[\r\n]/.test(s)&&/[.!?]$/.test(s),'Invalid deciding sentence');
  check(c.why.startsWith(`SPEC §${sections[c.category_expected]}`)&&c.why.includes(JSON.stringify(s)),'Rationale must quote exact deciding sentence');
  check(occurrences(d.subject,s)+occurrences(d.body.text,s)===1,'Deciding sentence must occur exactly once in draft');
  const quoted=d.body.text.split('\n').filter(x=>/^>/.test(x)).map(x=>x.replace(/^>\s?/,'' )).join('\n');
  const current=d.body.text.split('\n').filter(x=>!/^>/.test(x)).join('\n');
  if(m.placement==='subject')check(d.subject===s&&!d.body.text.includes(s),'Subject placement');
  if(m.placement==='quoted_history')check(occurrences(quoted,s)===1&&!current.includes(s)&&!d.subject.includes(s),'Quoted placement');
  if(m.placement==='body')check(occurrences(current,s)===1&&!quoted.includes(s)&&!d.subject.includes(s),'Body placement');
  for(const [field,seen] of [['key_verb',verbs],['key_noun',nouns]]){
   const key=m[field];check(typeof key==='string'&&/^[a-z]+$/.test(key)&&!seen.has(key),'Repeated or invalid deciding key');
   check(new RegExp(`\\b${key}\\b`,'i').test(s),'Deciding key absent from sentence');seen.add(key);
  }
 }
}
for(const cat of categories){
 const rows=readme.split(/\r?\n/).filter(x=>x.startsWith(`| ${cat} |`));check(rows.length===1,'Missing/repeated README category row');
 const nums=rows[0].split('|').slice(2,6).map(x=>Number(x.trim()));const c=counts[cat];
 check(JSON.stringify(nums)===JSON.stringify([c.stop,c.prompt,c.pass,c.stop+c.prompt+c.pass]),'README category mismatch');
}
const totals=[cases.filter(x=>x.expect==='stop').length,0,cases.filter(x=>x.expect==='pass').length,cases.length];
const totalRows=readme.split(/\r?\n/).filter(x=>x.startsWith('| **Total** |'));check(totalRows.length===1,'README Total row');
check(JSON.stringify(totalRows[0].split('|').slice(2,6).map(x=>Number(x.trim().replaceAll('*',''))))===JSON.stringify(totals),'README total mismatch');
function stats(values){const a=values.toSorted((a,b)=>a-b);return {min:a[0],p25:a[Math.floor((a.length-1)*.25)],median:a.length%2?a[(a.length-1)/2]:(a[a.length/2-1]+a[a.length/2])/2,p75:a[Math.floor((a.length-1)*.75)],max:a.at(-1),mean:Number((a.reduce((s,n)=>s+n,0)/a.length).toFixed(2))};}
const lengths={body_characters:stats(cases.map(x=>[...x.draft.body.text].length)),subject_plus_body_characters:stats(cases.map(x=>[...x.draft.subject+x.draft.body.text].length))};
check(readme.includes(`<!-- length-statistics ${JSON.stringify(lengths)} -->`),'README length statistics mismatch');
check(readme.includes(`<!-- stop-placements ${JSON.stringify(placements)} -->`),'README placement counts mismatch');
const industries=[...new Set(cases.map(x=>x.metadata.industry))].sort();
const english=Object.fromEntries(['UK','US','AU'].map(r=>[r,cases.filter(x=>x.metadata.english===r).length]));
check(readme.includes(`<!-- industries ${JSON.stringify(industries)} -->`),'README industries mismatch');
check(readme.includes(`<!-- english ${JSON.stringify(english)} -->`),'README English counts mismatch');
if(!args.includes('--checkpoint')){
 check(cases.length===300&&totals[0]===60&&totals[2]===240,'Final composition must be 300 = 240 pass + 60 stop');
 for(const [c,n] of Object.entries({personal:15,economics:15,negotiation:10,remark:10,secrets:10}))check(counts[c].stop===n,'Final category quota');
 check(placements.quoted_history>=15&&placements.subject>=5&&placements.body>30,'Final stop placement quota');
 check(lengths.body_characters.median>800&&industries.length>=15&&Object.values(english).every(x=>x>0),'Length, industry or English coverage');
}
const receipt={status:'validated',author:'gpt-6.1-sol',date:'2026-10-23',spec:'SPEC.md v2, 23 October 2026',scope:'realistic3 only; no checker or model imported or executed',checkpoint:args.includes('--checkpoint'),total:cases.length,cases_sha256:createHash('sha256').update(raw).digest('hex'),composition:counts,lengths,stop_placements:placements,english,industries,checks:['schema','sequential unique ids','unique normalized bodies','README table and statistics','reserved domains','outside routing','no potential lookalike fixture routing','visible outside recipients below eight','no attachments','numeric and credential shape screen','exact deciding sentence occurrence and placement','quoted SPEC rationale','unique literal deciding verbs and nouns'],semantic_limit:'Disclosure labels and absence of second findings are author judgments; structural checks do not prove semantic completeness.'};
if(args.includes('--write-receipt'))await fs.writeFile(new URL('validation.json',root),JSON.stringify(receipt,null,2)+'\n','utf8');
console.log(JSON.stringify(receipt,null,2));
