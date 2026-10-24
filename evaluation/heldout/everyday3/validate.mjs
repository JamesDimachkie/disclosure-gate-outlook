import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
const root=path.dirname(fileURLToPath(import.meta.url));
const args=process.argv.slice(2);
const checkpoint=args.includes('--checkpoint');
const assert=(ok,msg)=>{if(!ok)throw Error(msg);};
assert(args.every(a=>['--checkpoint','--write-receipt'].includes(a)),'Unknown argument');
const categories=['secrets','payment','government_id','personal','economics','negotiation','remark','lookalike','exposed_list','file','none'];
const target={secrets:12,personal:12,economics:12,negotiation:12,remark:12};
const sections={secrets:'5.1',personal:'5.4',economics:'5.5',negotiation:'5.6',remark:'5.7'};
function domain(p){
 assert(p&&typeof p.name==='string'&&p.name.length>0&&p.kind==='person','Invalid person');
 assert(typeof p.address==='string'&&/^[a-z0-9._+-]+@[a-z0-9-]+\.(example|test)$/.test(p.address),'Non-synthetic or malformed address');
 return p.address.split('@')[1];
}
function distance(a,b){
 const d=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
 for(let i=0;i<=a.length;i++)d[i][0]=i;
 for(let j=0;j<=b.length;j++)d[0][j]=j;
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){
  d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1);
 }
 return d[a.length][b.length];
}
const fold=s=>s.replaceAll('rn','m').replaceAll('vv','w').replaceAll('cl','d').replace(/[1i|]/g,'l').replaceAll('0','o');
function numericScreen(s,id){
 assert(!/\d{9,}/.test(s),`${id}: long digit run`);
 assert(!/(?:\d[ -]?){13,19}/.test(s),`${id}: card-like digits`);
 assert(!/\b[A-Z]{2}\d{2}(?:[ -]?[A-Z0-9]){10,30}\b/i.test(s),`${id}: IBAN-like string`);
}
try{
 const raw=await fs.readFile(path.join(root,'cases.jsonl'),'utf8');
 assert(raw.endsWith('\n')&&!raw.startsWith('\ufeff'),'Expected UTF-8 JSONL with trailing newline and no BOM');
 const cases=raw.trimEnd().split('\n').map(JSON.parse);
 assert(cases.length>0&&cases.length<=360&&(checkpoint||cases.length===360),'Case quota');
 const batches=(await fs.readdir(path.join(root,'batches'))).sort();
 assert(batches.length<=9&&(checkpoint||batches.length===9),'Batch quota');
 let cursor=0;
 for(const [index,file] of batches.entries()){
  assert(file===`batch-${String(index+1).padStart(2,'0')}.json`,'Batch filename sequence');
  const batch=JSON.parse(await fs.readFile(path.join(root,'batches',file),'utf8'));
  const ordinary=index<7?35:index===7?30:25;
  assert(Array.isArray(batch.pass)&&batch.pass.length===ordinary&&Array.isArray(batch.stop)&&batch.stop.length===40-ordinary,`${file}: batch composition`);
  const perCategory={};
  for(const [expect,rows] of [['pass',batch.pass],['stop',batch.stop]])for(const row of rows){
   assert(Array.isArray(row)&&row.length===(expect==='pass'?7:10)&&row.every(x=>typeof x==='string'),`${file}: literal schema`);
   const c=cases[cursor++];assert(c,`${file}: missing serialized case`);
   const [industry,english,from,to,subject,body]=row;
   const [category,placement,deciding,why]=expect==='pass'?['none','none','',row[6]]:row.slice(6);
   const address=s=>{const parts=s.split('|');assert(parts.length===2,`${file}: person literal`);return {name:parts[0],address:parts[1],kind:'person'};};
   assert(c.expect===expect&&c.category_expected===category&&c.why===why&&isDeepStrictEqual(c.meta,{industry,english,placement,deciding_sentence:deciding,batch:file}),`${file}: metadata differs from literals`);
   assert(isDeepStrictEqual(c.draft,{from:address(from),to:[address(to)],cc:[],bcc:[],subject,body:{format:'text',text:body},attachments:[]}),`${file}: draft differs from literals`);
   if(expect==='stop')perCategory[category]=(perCategory[category]||0)+1;
  }
  for(const category of Object.keys(target))assert(perCategory[category]===(index<7?1:index===7?2:3),`${file}: category balance`);
 }
 assert(cursor===cases.length,'Unaccounted serialized cases');
 const counts=Object.fromEntries(categories.map(k=>[k,{stop:0,prompt:0,pass:0}]));
 const bodies=new Set(),decisions=new Set(),industries=new Set(),variants={},placements={},lengths=[];
 for(const [i,c] of cases.entries()){
  const id=`everyday3-${String(i+1).padStart(3,'0')}`;
  assert(c.id===id,`ID sequence at ${i+1}`);
  assert(['pass','stop'].includes(c.expect)&&categories.includes(c.category_expected),`${id}: outcome/category`);
  assert(typeof c.why==='string'&&/SPEC §/.test(c.why)&&!/[\r\n]/.test(c.why),`${id}: rationale`);
  assert(c.meta&&typeof c.meta.industry==='string'&&c.meta.industry.length>2,`${id}: industry`);
  assert(['UK','US','AU','NZ','CA','IE','IN','SG','ZA'].includes(c.meta.english),`${id}: English variant`);
  const d=c.draft,own=domain(d.from);
  assert(c.internal_domains===undefined,`${id}: unexpected admin domains`);
  assert(Array.isArray(d.to)&&d.to.length===1&&Array.isArray(d.cc)&&d.cc.length===0&&Array.isArray(d.bcc)&&d.bcc.length===0,`${id}: recipient scope`);
  for(const p of [...d.to,...d.cc,...d.bcc]){
   const outside=domain(p);assert(outside!==own,`${id}: recipient inside`);
   const a=fold(own.split('.')[0]),b=fold(outside.split('.')[0]);
   assert(distance(a,b)>2&&!a.includes(b)&&!b.includes(a),`${id}: potential lookalike`);
  }
  assert(typeof d.subject==='string'&&d.subject.length>0&&!/[\r\n]/.test(d.subject)&&d.subject.length<=1000,`${id}: subject`);
  assert(d.body?.format==='text'&&typeof d.body.text==='string'&&d.body.text.trim().length>0,`${id}: body`);
  assert(Array.isArray(d.attachments)&&d.attachments.length===0,`${id}: attachments`);
  const normalized=d.body.text.toLowerCase().replace(/\s+/g,' ').trim();
  assert(!bodies.has(normalized),`${id}: duplicate body`);bodies.add(normalized);
  numericScreen(d.subject+'\n'+d.body.text,id);
  if(c.expect==='pass'){
   assert(c.category_expected==='none'&&c.meta.placement==='none'&&c.meta.deciding_sentence==='',`${id}: pass label`);
   industries.add(c.meta.industry);
  }else{
   assert(Object.hasOwn(target,c.category_expected),`${id}: stop category`);
   const sentence=c.meta.deciding_sentence,place=c.meta.placement;
   assert(typeof sentence==='string'&&sentence.length>10&&!/[\r\n]/.test(sentence)&&/[.!?]$/.test(sentence),`${id}: deciding sentence`);
   assert(!decisions.has(sentence),`${id}: repeated deciding sentence`);decisions.add(sentence);
   assert(['body','quoted','subject'].includes(place),`${id}: placement`);
   const haystack=d.subject+'\n'+d.body.text;
   assert(haystack.split(sentence).length-1===1,`${id}: deciding sentence must occur exactly once`);
   const quoted=d.body.text.split('\n').filter(l=>l.startsWith('>')).map(l=>l.replace(/^> ?/,'')).join('\n');
   const body=d.body.text.split('\n').filter(l=>!l.startsWith('>')).join('\n');
   assert(({body,quoted,subject:d.subject})[place].includes(sentence),`${id}: wrong placement`);
   assert(c.why.includes(`SPEC §${sections[c.category_expected]}`)&&c.why.includes(`“${sentence}”`),`${id}: exact rationale quotation`);
   placements[place]=(placements[place]||0)+1;
  }
  counts[c.category_expected][c.expect]++;
  variants[c.meta.english]=(variants[c.meta.english]||0)+1;
  lengths.push(d.body.text.trim().split(/\s+/u).length);
 }
 const pass=counts.none.pass,stop=cases.length-pass;
 assert(pass<=300&&(checkpoint||pass===300),'Ordinary quota');
 for(const [category,n] of Object.entries(target))assert(counts[category].stop<=n&&(checkpoint||counts[category].stop===n),`${category}: disclosure quota`);
 if(!checkpoint){assert(industries.size>=60,'Industry quota');assert(placements.body>30&&placements.quoted>=5&&placements.subject>=2&&placements.subject<=8,'Placement mix');assert(Math.min(...lengths)<=10&&Math.max(...lengths)>=150,'Length mix');}
 const readme=await fs.readFile(path.join(root,'README.md'),'utf8');
 for(const category of categories){
  const rows=readme.split(/\r?\n/).filter(l=>l.startsWith(`| ${category} |`));assert(rows.length===1,`${category}: README row`);
  const c=counts[category],actual=rows[0].split('|').slice(2,6).map(s=>Number(s.trim()));
  assert(JSON.stringify(actual)===JSON.stringify([c.stop,c.prompt,c.pass,c.stop+c.prompt+c.pass]),`${category}: README agreement`);
 }
 const totals=readme.split(/\r?\n/).filter(l=>l.startsWith('| **Total** |'));assert(totals.length===1,'README total row');
 assert(JSON.stringify(totals[0].split('|').slice(2,6).map(s=>Number(s.replaceAll('*','').trim())))===JSON.stringify([stop,0,pass,cases.length]),'README total agreement');
 const sorted=[...lengths].sort((a,b)=>a-b);
 const receipt={status:'PASS',mode:checkpoint?'checkpoint':'final',cases:cases.length,pass,stop,prompt:0,composition:counts,ordinary_industries:industries.size,english_variants:variants,stop_placements:placements,body_words:{min:sorted[0],median:(sorted[Math.floor((sorted.length-1)/2)]+sorted[Math.floor(sorted.length/2)])/2,max:sorted.at(-1),mean:Number((lengths.reduce((a,b)=>a+b,0)/lengths.length).toFixed(2)),under_15:lengths.filter(n=>n<15).length,at_least_100:lengths.filter(n=>n>=100).length},sha256:createHash('sha256').update(raw).digest('hex'),checks:['schema','literal source equality','nine balanced 40-case batches','distinct deciding sentences','sequential IDs','composition quotas','normalized duplicate bodies','outside-only reserved domains','conservative domain dissimilarity','deciding-sentence occurrence and placement','verbatim rationale quotation','numeric screen','README composition agreement'],checker_run:false,model_run:false};
 if(args.includes('--write-receipt'))await fs.writeFile(path.join(root,'validation.json'),JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify(receipt,null,2));
}catch(e){console.error(`FAIL: ${e.message}`);process.exitCode=1;}
