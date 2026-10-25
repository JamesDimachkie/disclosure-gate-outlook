import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const directory = path.dirname(fileURLToPath(import.meta.url));
export const batchNames = ['batch-01.json','batch-02.json','batch-03.json','batch-04.json','batch-05.json','batch-06.json','batch-07.json'];
export async function literals() {
 const rows=[]; let gap=false;
 for (const name of batchNames) {
  try { const batch=JSON.parse(await fs.readFile(path.join(directory,name),'utf8')); if(gap)throw Error('Noncontiguous batches'); rows.push(...batch); }
  catch(e){if(e.code==='ENOENT'){gap=true;continue;}throw e;}
 }
 return rows;
}
export function draftObject(r) {
 return {id:`everyday7b-${String(r.n).padStart(3,'0')}`,category_expected:r.cat??'none',expect:r.kind==='stop'?'stop':'pass',why:r.why,
 metadata:{cohort:r.kind,setting:r.setting,industry:r.industry,placement:r.place??'body',hardness:r.hard??[],messy:r.messy??[],deciding_sentence:r.deciding??null,boundary:r.boundary??null},
 draft:{from:{name:'Tavi Norrin',address:'tavi@oxbriar.example'},to:[{name:r.to??'Rell Vantos',address:'correspondence@lumenquay.test',kind:'person'}],cc:[],bcc:[],subject:r.subject,body:{format:'text',text:r.body},attachments:[]}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const rows=await literals();
 if(!rows.length)throw Error('No literals');
 await fs.writeFile(path.join(directory,'cases.jsonl'),rows.map(r=>JSON.stringify(draftObject(r))).join('\n')+'\n','utf8');
 console.log(`Serialized ${rows.length} literal cases; no prose generated.`);
}
