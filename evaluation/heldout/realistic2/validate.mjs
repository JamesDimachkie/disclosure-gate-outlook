import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=new URL('./',import.meta.url);
const categories=['secrets','payment','government_id','personal','economics','negotiation','remark','lookalike','exposed_list','file','none'];
const desired={secrets:[10,0,17],payment:[0,0,0],government_id:[0,0,0],personal:[14,0,20],economics:[12,0,17],negotiation:[12,0,14],remark:[12,0,17],lookalike:[0,0,0],exposed_list:[0,0,0],file:[0,0,0],none:[0,0,15]};
const expectedOutcomes=['stop','prompt','pass'];
function check(ok,message){if(!ok)throw Error(message);}
function exactKeys(value,required,optional=[]){
 check(value&&typeof value==='object'&&!Array.isArray(value),'Object required');
 check(required.every(k=>Object.hasOwn(value,k))&&Object.keys(value).every(k=>[...required,...optional].includes(k)),'Unexpected or absent schema field');
}
function domain(address){
 check(typeof address==='string'&&/^[a-z0-9._+-]+@[a-z0-9-]+\.(example|test)$/i.test(address),'Address must use a direct reserved example/test domain');
 return address.split('@')[1].toLowerCase();
}
function reservedDomain(d){
 check(typeof d==='string'&&/^[a-z0-9-]+\.(example|test)$/i.test(d),'Unreserved internal domain');
 return d.toLowerCase();
}
function editDistance(a,b){
 const rows=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
 for(let i=0;i<=a.length;i++)rows[i][0]=i;
 for(let j=0;j<=b.length;j++)rows[0][j]=j;
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){
  rows[i][j]=Math.min(rows[i-1][j]+1,rows[i][j-1]+1,rows[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])rows[i][j]=Math.min(rows[i][j],rows[i-2][j-2]+1);
 }
 return rows[a.length][b.length];
}
const fold=s=>s.replaceAll('rn','m').replaceAll('vv','w').replaceAll('cl','d').replace(/[1i|]/g,'l').replaceAll('0','o');
function guardUnrelated(outside,inside){
 const a=outside.split('.')[0], b=inside.split('.')[0];
 check(a!==b,'Outside same-name domain would be a lookalike');
 check(editDistance(fold(a),fold(b))>(b.length>=6?2:b.length>=4?1:0),'Outside name is too close to an inside name');
 const phishing=['secure','security','login','signin','verify','verification','account','accounts','billing','invoice','invoices','payment','payments','pay','payroll','remit','remittance','support','helpdesk','help','it','hr','mail','email','webmail','portal','docs','documents','share','sharepoint','onedrive','office365','o365','microsoft','admin','update','service','services','online','notify','alert','alerts'];
 check(!phishing.some(w=>[b+w,b+'-'+w,w+b,w+'-'+b].includes(a)),'Joined-name lookalike');
}
function occurrences(text,span){
 let n=0,offset=0;
 while((offset=text.indexOf(span,offset))>=0){n++;offset+=span.length;}
 return n;
}
const quantile=(sorted,p)=>{
 const x=(sorted.length-1)*p, lo=Math.floor(x), hi=Math.ceil(x);
 return sorted[lo]+(sorted[hi]-sorted[lo])*(x-lo);
};
async function main(){
 const args=process.argv.slice(2);
 check(args.length===0||(args.length===1&&args[0]==='--write-receipt'),'Usage: node validate.mjs [--write-receipt]');
 // The validator reads only these two files within its own tier. It imports no project modules.
 const [raw,readme]=await Promise.all([fs.readFile(new URL('cases.jsonl',root),'utf8'),fs.readFile(new URL('README.md',root),'utf8')]);
 check(raw.endsWith('\n')&&!raw.startsWith('\ufeff'),'JSONL must have final newline and no BOM');
 const lines=raw.slice(0,-1).split('\n');
 check(lines.length===160&&lines.every(l=>l.length&&!l.includes('\r')),'Exactly 160 LF-terminated JSON lines required');
 const cases=lines.map(line=>JSON.parse(line));
 const ids=new Set(),bodies=new Set(),attachmentIds=new Set();
 const counts=Object.fromEntries(categories.map(c=>[c,{stop:0,prompt:0,pass:0}]));
 const placements={body:0,quoted:0,subject:0,attachment:0};
 let outsidePass=0,insidePass=0,totalFiles=0;
 const insideCategories={};
 const secretKinds={},personalKinds={};
 for(let i=0;i<cases.length;i++){
  const c=cases[i], ordinal=i+1;
  exactKeys(c,['id','category_expected','expect','why','draft'],['internal_domains']);
  check(c.id==='realistic2-'+String(ordinal).padStart(3,'0')&&!ids.has(c.id),'IDs must be unique, ordered 001 through 160');ids.add(c.id);
  check(categories.includes(c.category_expected)&&expectedOutcomes.includes(c.expect),'Invalid category/expectation');
  check(c.expect!=='prompt','No prompt cases');
  check(typeof c.why==='string'&&/SPEC §/.test(c.why)&&!/[\r\n]/.test(c.why),'One-line SPEC rationale required');
  counts[c.category_expected][c.expect]++;
  const d=c.draft;
  exactKeys(d,['from','to','cc','bcc','subject','body','attachments']);
  exactKeys(d.from,['name','address','kind']);
  check(typeof d.from.name==='string'&&d.from.kind==='person','Invalid sender');
  const own=domain(d.from.address);
  check(!c.internal_domains||(Array.isArray(c.internal_domains)&&c.internal_domains.length&&new Set(c.internal_domains.map(reservedDomain)).size===c.internal_domains.length),'Invalid internal domains');
  const internal=new Set([own,...(c.internal_domains??[]).map(reservedDomain)]);
  const recipientDomains=[];
  for(const field of ['to','cc','bcc']){
   check(Array.isArray(d[field]),'Recipient list required');
   for(const r of d[field]){
    exactKeys(r,['name','address','kind']);
    check(typeof r.name==='string'&&r.kind==='person','Only named, checkable person recipients allowed');
    recipientDomains.push(domain(r.address));
   }
  }
  check(recipientDomains.length>0&&recipientDomains.length<8,'Nonempty small recipient list required');
  const outside=recipientDomains.filter(x=>!internal.has(x));
  for(const out of outside)for(const ins of internal)guardUnrelated(out,ins);
  check(typeof d.subject==='string'&&d.subject.length<1000&&!/[\r\n]/.test(d.subject),'Invalid subject');
  exactKeys(d.body,['format','text']);
  check(d.body.format==='text'&&typeof d.body.text==='string'&&d.body.text.length>0&&d.body.text.length<500000,'Text body required');
  check(!bodies.has(d.body.text),'Duplicate body');bodies.add(d.body.text);
  check(Array.isArray(d.attachments),'Attachments array required');
  const surfaces=[{location:'subject',text:d.subject},{location:'body',text:d.body.text}];
  for(const a of d.attachments){
   exactKeys(a,['id','name','type','isInline','size','content']);
   check(typeof a.id==='string'&&a.id===c.id+'-file'&&!attachmentIds.has(a.id),'Attachment ID must be globally unique');attachmentIds.add(a.id);
   check(a.type==='file'&&a.isInline===false&&typeof a.name==='string'&&/\.(txt|csv)$/.test(a.name),'Only readable TXT/CSV files');
   check(typeof a.content==='string','Missing attachment base64');
   const bytes=Buffer.from(a.content,'base64');
   check(bytes.toString('base64')===a.content,'Noncanonical attachment base64');
   check(Number.isSafeInteger(a.size)&&a.size===bytes.length&&a.size>0&&a.size<10000000,'Incorrect attachment byte size');
   const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
   check(Buffer.from(text,'utf8').equals(bytes),'UTF-8 must round-trip exactly');
   surfaces.push({location:'attachment:'+a.name,text});totalFiles++;
  }
  // Numeric identifiers are not needed in this tier. Long digit runs are excluded conservatively.
  for(const {text} of surfaces){
   check(!/\d(?:[ -]?\d){7,}/.test(text),'Unwanted long numeric identifier');
   check(!/(?:AKIA[0-9A-Z]{16}|ghp_|github_pat_|xox[bp]-|sk_live_|AIza|sk-ant-|-----BEGIN .*PRIVATE KEY-----)/.test(text),'Unwanted token/key-shaped material');
   for(const m of text.matchAll(/[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi))domain(m[0]);
  }
  if(c.expect==='stop'){
   check(ordinal<=60&&outside.length>0,'Every stop must be external and in the first 60');
   const m=c.why.match(/^SPEC §(5\.[14567]); ([^;]+); location=(body|quoted|subject|attachment:[^;]+); deciding=(".*")$/);
   check(m,'Stop needs an exact quoted deciding sentence and stated location');
   const span=JSON.parse(m[4]);
   check(typeof span==='string'&&span.length>20&&!/[\r\n]/.test(span)&&span.endsWith('.'),'One deciding sentence required');
   const section={secrets:'5.1',personal:'5.4',economics:'5.5',negotiation:'5.6',remark:'5.7'}[c.category_expected];
   check(m[1]===section,'Wrong category section');
   check(surfaces.reduce((n,s)=>n+occurrences(s.text,span),0)===1,'Deciding span must occur exactly once across subject/body/files');
   if(m[3]==='quoted'){
    check(d.body.text.split('\n').some(line=>/^>+\s/.test(line)&&line.replace(/^>+\s*/,'')===span),'Quoted deciding sentence must be on a quoted history line');
    placements.quoted++;
   }else if(m[3]==='body'){
    check(d.body.text.split('\n').includes(span),'Body sentence must be on an unquoted current-body line');
    placements.body++;
   }else{
    check(surfaces.some(s=>s.location===m[3]&&occurrences(s.text,span)===1),'Deciding sentence absent from stated surface');
    if(m[3]==='subject'){check(d.subject===span,'Subject disclosure must be sole subject sentence');placements.subject++;}
    else{check(d.attachments.length===1,'One disclosure attachment required');placements.attachment++;}
   }
   if(c.category_expected==='secrets')secretKinds[m[2]]=(secretKinds[m[2]]??0)+1;
   if(c.category_expected==='personal')personalKinds[m[2]]=(personalKinds[m[2]]??0)+1;
  }else{
   check(ordinal>60,'Only first 60 are stops');
   if(outside.length){outsidePass++;check(ordinal<=150,'Outside passes belong in 061 through 150');}
   else{
    insidePass++;check(ordinal>=151&&c.why.startsWith('SPEC §4;'),'Inside controls require §4');
    insideCategories[c.category_expected]=(insideCategories[c.category_expected]??0)+1;
   }
  }
 }
 check(outsidePass===90&&insidePass===10,'Need 90 external and 10 inside-only passes');
 check(['secrets','personal','economics','negotiation','remark'].every(c=>insideCategories[c]===2),'Two inside controls per intended sensitive category');
 check(JSON.stringify(placements)===JSON.stringify({body:22,quoted:26,subject:6,attachment:6}),'Wrong stop placement counts');
 check(totalFiles===6,'Exactly six readable stop attachments');
 check(Object.keys(secretKinds).length===10&&Object.values(secretKinds).every(n=>n===1),'Distinct secret scenarios required');
 check(['hidden key','hidden fob','alarm disabled','camera outage','broken gate','lock left open','unmonitored area'].every(k=>secretKinds[k]===1),'Seven hidden-location/security-gap cases');
 check(['gate code given','door code given','Wi-Fi code given'].every(k=>secretKinds[k]===1),'Three ordinary-prose access codes');
 check(personalKinds.health===5&&personalKinds.family===4&&personalKinds.legal===2&&personalKinds.HR===3,'Wrong personal subtypes');
 for(const category of categories){
  const actual=expectedOutcomes.map(o=>counts[category][o]);
  check(JSON.stringify(actual)===JSON.stringify(desired[category]),'Wrong exact category composition: '+category);
  const rows=readme.split(/\r?\n/).filter(line=>line.startsWith('| '+category+' |'));
  check(rows.length===1,'Missing/duplicate README category row: '+category);
  const numbers=rows[0].split('|').slice(2,6).map(x=>Number(x.trim()));
  check(JSON.stringify(numbers)===JSON.stringify([...actual,actual.reduce((a,b)=>a+b,0)]),'README composition mismatch: '+category);
 }
 const totals=readme.split(/\r?\n/).filter(line=>line.startsWith('| **Total** |'));
 check(totals.length===1&&JSON.stringify(totals[0].split('|').slice(2,6).map(x=>Number(x.trim().replaceAll('*',''))))===JSON.stringify([60,0,100,160]),'README bold Total row mismatch');
 const sorted=cases.map(c=>Array.from(c.draft.body.text).length).sort((a,b)=>a-b);
 const stats={unit:'Unicode code points; body only, including quoted history and signatures',count:160,min:sorted[0],p25:quantile(sorted,.25),median:quantile(sorted,.5),p75:quantile(sorted,.75),max:sorted.at(-1),mean:Number((sorted.reduce((a,b)=>a+b,0)/160).toFixed(4)),total_characters:sorted.reduce((a,b)=>a+b,0),above_900:sorted.filter(n=>n>900).length};
 check(stats.median>900,'Median body must exceed 900 characters');
 const statsLine='Body lengths (Unicode code points): min '+stats.min+'; P25 '+stats.p25+'; median '+stats.median+'; P75 '+stats.p75+'; max '+stats.max+'; mean '+stats.mean.toFixed(2)+'.';
 check(readme.includes(statsLine),'README length statistics mismatch');
 check(readme.includes('Stops by deciding-sentence placement: current body 22; quoted history 26; subject 6; readable attachment 6.'),'README placement mismatch');
 check(readme.includes('93 of 160 bodies exceed 900 characters.'),'README long-body count missing');
 check(stats.above_900===93,'Long-body count changed');
 const receipt={status:'passed',validated_at_utc:new Date().toISOString(),author_model:'gpt-6.1-sol',authored_date:'2026-10-23',node_version:process.version,cases_sha256:createHash('sha256').update(raw).digest('hex'),validator_sha256:createHash('sha256').update(await fs.readFile(fileURLToPath(import.meta.url))).digest('hex'),total:160,composition:counts,routing:{external_stops:60,external_passes:outsidePass,inside_only_passes:insidePass},body_lengths:stats,stop_placements:placements,attachments:{total:totalFiles,canonical_base64:true,exact_utf8_byte_sizes:true,globally_unique_ids:true},checks:{schema:true,unique_ordered_ids:true,unique_bodies:true,exact_composition:true,readme_table:true,reserved_domains:true,unrelated_external_domains:true,inside_routing:true,quoted_span_exactly_once:true,placement_manifest:true},checker_invoked:false,semantic_limit:'Structural validation does not adjudicate labels or prove the absence of a second semantic disclosure; those were reviewed during spec-only authorship.'};
 if(args.includes('--write-receipt'))await fs.writeFile(new URL('validation.json',root),JSON.stringify(receipt,null,2)+'\n','utf8');
 console.log(JSON.stringify(receipt,null,2));
}
main().catch(error=>{console.error('Tier validation failed: '+error.message);process.exitCode=1;});
