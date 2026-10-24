// Corpus integrity checks only. Does not import the checker or read another tier.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const here=new URL('./',import.meta.url);
const raw=fs.readFileSync(new URL('cases.jsonl',here),'utf8');
const lines=raw.trimEnd().split(/\r?\n/);
const cases=lines.map((line,i)=>{try{return JSON.parse(line);}catch{throw Error(`Invalid JSON line ${i+1}`);}});
const categories=['secrets','payment','government_id','personal','economics','negotiation','remark','lookalike','exposed_list','file','none'];
const composition=Object.fromEntries(categories.map(c=>[c,{stop:0,prompt:0,pass:0,total:0}]));
const ids=new Set(),draftHashes=new Set(),bodyHashes=new Set();
const hash=x=>createHash('sha256').update(x).digest('hex');
const dom=r=>r.address.slice(r.address.lastIndexOf('@')+1).toLowerCase();
let attachments=0,insideOnly=0,quotes=0,nestedQuotes=0;
const listBoundaries=[];
function csvRows(text) {
 const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++) {
  const ch=text[i];
  if(ch==='"') {if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
  else if(ch===','&&!quoted){row.push(cell);cell='';}
  else if(ch==='\n'&&!quoted){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell='';}
  else cell+=ch;
 }
 assert(!quoted,'Unclosed CSV quotation');
 if(cell||row.length){row.push(cell);rows.push(row);}
 assert(rows.length>1&&rows.every(r=>r.length===rows[0].length),'Ragged CSV rows');return rows;
}
for(const c of cases) {
 assert.match(c.id,/^realistic-\d{3}$/);assert(!ids.has(c.id));ids.add(c.id);
 assert(categories.includes(c.category_expected));assert(['pass','stop','prompt'].includes(c.expect));
 assert.match(c.why,/SPEC §/);assert(!/[\r\n]/.test(c.why));assert(c.why.length>60);
 composition[c.category_expected][c.expect]++;composition[c.category_expected].total++;
 const d=c.draft;assert.equal(d.body.format,'text');assert.equal(typeof d.subject,'string');
 const dh=hash(JSON.stringify(d)),bh=hash(d.body.text);assert(!draftHashes.has(dh));assert(!bodyHashes.has(bh));draftHashes.add(dh);bodyHashes.add(bh);
 const internal=new Set([dom(d.from),...(c.internal_domains??[]).map(x=>x.toLowerCase())]);
 const recipients=[...d.to,...d.cc,...d.bcc];assert(recipients.length>0);
 for(const r of [d.from,...recipients]){assert.equal(typeof r.name,'string');assert.equal(r.kind,'person');assert.match(r.address,/^[^@\s]+@[^@\s]+\.(?:example|test)$/i);}
 assert.equal(new Set(recipients.map(r=>r.address.toLowerCase())).size,recipients.length);
 const allInside=recipients.every(r=>internal.has(dom(r)));
 if(allInside){insideOnly++;assert.equal(c.expect,'pass');}
 const visible=[...d.to,...d.cc].filter(r=>!internal.has(dom(r)));
 const domains=new Set(visible.map(dom));
 const exposed=visible.length>=8&&domains.size>=3;
 assert.equal(exposed,c.expect==='prompt',`${c.id}: visible-list boundary disagrees with label`);
 if(c.category_expected==='exposed_list')listBoundaries.push({id:c.id,visible_outside:visible.length,outside_domains:domains.size,bcc:d.bcc.length,expect:c.expect});
 if(/^(?:On .+ wrote:|From:)/m.test(d.body.text))quotes++;
 if(/^>>/m.test(d.body.text))nestedQuotes++;
 assert(Array.isArray(d.attachments));const aids=new Set();
 for(const a of d.attachments){attachments++;assert(!aids.has(a.id));aids.add(a.id);assert.equal(a.type,'file');assert.equal(a.isInline,false);const bytes=Buffer.from(a.content,'base64');assert.equal(bytes.toString('base64'),a.content);assert.equal(bytes.length,a.size);assert.equal(Buffer.from(bytes.toString('utf8'),'utf8').compare(bytes),0);assert.match(a.name,/\.(txt|csv)$/);if(a.name.endsWith('.csv'))csvRows(bytes.toString('utf8'));}
}
assert.equal(cases.length,150);
const counts=Object.fromEntries(['pass','stop','prompt'].map(e=>[e,cases.filter(c=>c.expect===e).length]));
assert.deepEqual(counts,{pass:100,stop:40,prompt:10});
function stats(items){const a=items.map(c=>[...c.draft.body.text].length).sort((a,b)=>a-b),n=a.length;return {count:n,min:a[0],median:n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2,mean:Math.round(a.reduce((s,x)=>s+x,0)/n*100)/100,max:a[n-1],over_2000:a.filter(x=>x>2000).length};}
const lengths={all:stats(cases),...Object.fromEntries(['pass','stop','prompt'].map(e=>[e,stats(cases.filter(c=>c.expect===e))]))};
assert(lengths.all.median>=900);assert(lengths.all.over_2000>=30);assert(quotes>=40);assert(nestedQuotes>=3);
function luhn(value){const digits=value.replace(/\D/g,'').split('').map(Number).reverse();return digits.reduce((s,n,i)=>s+(i%2?(n*2>9?n*2-9:n*2):n),0)%10===0;}
for(const n of ['4242424242424242','5555555555554444','378282246310005','734826910'])assert(luhn(n),`Luhn failed: ${n}`);
const iban='GB82WEST12345698765432';const expanded=(iban.slice(4)+iban.slice(0,4)).replace(/[A-Z]/g,c=>String(c.charCodeAt(0)-55));let mod=0;for(const n of expanded)mod=(mod*10+Number(n))%97;assert.equal(mod,1);
assert.match('718-42-6193',/^(?!000|666|9\d\d)\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/);
assert.match('AB426183C',/^[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z]\d{6}[A-D]$/);
const token='ghp_FictionalOnlyA7b8C9d0E1f2G3h4I5j6K7l';assert.match(token,/^ghp_[A-Za-z0-9]{36}$/);
// Exact intended deciding spans, independently specified before scoring.
const decisions=[
 [101,'quoted','The presentation laptop password is Bracken!642.'],
 [102,'subject','door keypad code is 6834'],
 [103,'quoted','The spare entrance key is hidden behind the blue planter.'],
 [104,'quoted','The rear yard cameras are down until Monday.'],
 [105,'quoted',`The GitHub token is ${token}.`],
 [106,'quoted','Use postgres://practice:FictionalOnly!62@db.orbitmoth.test:5432/rehearsal for the rehearsal connection.'],
 [107,'attachment','The Wi-Fi password is FictionalFern!806.'],
 [108,'attachment','The lockbox code is 5826.'],
 [109,'quoted','The card number is 4242 4242 4242 4242.'],
 [110,'quoted','The IBAN is GB82 WEST 1234 5698 7654 32.'],
 [111,'quoted','The sort code is 12-34-56 and the account number is 87654321.'],
 [112,'attachment','The Mastercard number is 5555 5555 5555 4444.'],
 [113,'quoted','The Amex card number is 378282246310005.'],
 [114,'quoted','Neri Voss has SSN 718-42-6193.'],
 [115,'subject','Neri Voss passport number XQ6842917'],
 [116,'quoted',"Leto Marsh's National Insurance number is AB 42 61 83 C."],
 [117,'quoted','Tavi Rusk has SIN 734 826 910.'],
 [118,'attachment','The tax ID is TX-68294175.'],
 [119,'quoted','Tessa Brin is receiving chemotherapy.'],
 [120,'subject','Jules Nacre’s salary is £38,500'],
 [121,'quoted',"Aven Rill's father has died."],
 [122,'quoted','Nola Venn has been arrested for fraud.'],
 [123,'quoted','Kit Vale has been put on a performance plan.'],
 [124,'quoted','Our own cost for the counter is £11,240.'],
 [125,'subject','our margin is 31% on this order'],
 [126,'quoted','We carried £1,800 of internal contingency for this shoot.'],
 [127,'quoted','Our walk-away price for this engagement is $4,900.'],
 [128,'attachment','Our profit on this booking is £1,460.'],
 [129,'quoted','We have room to reduce the price by another 12% if they push.'],
 [130,'quoted','We expect them to counter at £15,000.'],
 [131,'quoted','We would accept payment in 90 days even though we have only offered 30.'],
 [132,'quoted','Our bid strategy is to hold back the extended support option until their second round.'],
 [133,'quoted','Rowan Pell is an idiot.'],
 [134,'subject','those clowns at Glassharbour'],
 [135,'quoted','The team at Marshviolet are useless parasites.'],
 [136,'recipient','archive@silverqui1l.example'],
 [137,'recipient','oren@copperfnich.example'],
 [138,'recipient','print@orbitmoth.test'],
 [139,'recipient','stores@marshvio1et.example'],
 [140,'recipient','review@cobaltloоm.example']
];
const placements={};
for(const [n,location,marker] of decisions){const c=cases[n-1],d=c.draft;assert.equal(c.expect,'stop');const fields={subject:d.subject,quoted:d.body.text,attachment:d.attachments.map(a=>Buffer.from(a.content,'base64').toString('utf8')).join('\n'),recipient:[...d.to,...d.cc,...d.bcc].map(r=>r.address).join('\n')};assert.equal(fields[location].split(marker).length-1,1,`${c.id}: deciding span absent or repeated`);assert.equal(Object.values(fields).join('\n').split(marker).length-1,1);if(location==='quoted')assert(d.body.text.split('\n').some(line=>/^>/.test(line)&&line.includes(marker)));placements[location]=(placements[location]??0)+1;}
const readme=fs.readFileSync(new URL('README.md',here),'utf8');
for(const category of categories){const row=readme.split(/\r?\n/).find(l=>l.startsWith(`| ${category} |`));assert(row,`Missing README row ${category}`);const nums=row.split('|').slice(2,6).map(x=>Number(x.trim()));const c=composition[category];assert.deepEqual(nums,[c.stop,c.prompt,c.pass,c.total]);}
const totalRow=readme.split(/\r?\n/).find(l=>l.startsWith('| **Total** |'));assert(totalRow);assert.deepEqual(totalRow.split('|').slice(2,6).map(x=>Number(x.trim().replaceAll('*',''))),[40,10,100,150]);
for(const [label,key] of [['All bodies','all'],['Pass bodies','pass'],['Stop bodies','stop'],['Prompt bodies','prompt']]){const row=readme.split(/\r?\n/).find(l=>l.startsWith(`| ${label} |`));assert(row);const s=lengths[key];assert.deepEqual(row.split('|').slice(2,8).map(x=>Number(x.trim())),[s.count,s.min,s.median,s.mean,s.max,s.over_2000]);}
const receipt={validation:'passed',node:process.version,cases_sha256:hash(raw),cases:cases.length,counts,composition,body_length_characters:lengths,quoted_emails:quotes,nested_quoted_emails:nestedQuotes,inside_only:insideOnly,attachments,stop_placements:placements,exposed_list_boundaries:listBoundaries,checks:['JSONL parsing','unique IDs, drafts and bodies','draft schema','reserved recipient domains','canonical UTF-8 base64 and exact byte size','CSV rectangularity','README composition agreement','length and quote targets','inside-only expected pass','visible-recipient thresholds including Bcc and admin domains','card and SIN Luhn','IBAN mod97','SSN and NI shapes','token shape','single occurrence and location of each authored deciding span']};
if(process.argv.includes('--write-receipt'))fs.writeFileSync(new URL('validation.json',here),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
