import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const batches=['batch-01.mjs','batch-02.mjs','batch-02b.mjs','batch-03.mjs','batch-03b.mjs','batch-04.mjs','batch-04b.mjs','batch-05.mjs','batch-05b.mjs','batch-06.mjs','batch-06b.mjs','batch-07.mjs'];
const rows=[];
for(const name of batches){try{const m=await import(pathToFileURL(path.join(here,name)));rows.push(...m.rows);}catch(e){if(e.code!=='ERR_MODULE_NOT_FOUND')throw e;}}
const cases=rows.map((r,i)=>({id:`everyday6b-${String(i+1).padStart(3,'0')}`,category_expected:r[0],expect:r[1],why:r[13],industry:r[2],variant:r[3],placement:r[4],hardness_dimensions:r[5],deciding_sentence:r[12],...(r[14]?{boundary:r[14]}:{}),draft:{from:{name:r[6],address:r[7]},to:[{name:r[8],address:r[9],kind:'person'}],cc:[],bcc:[],subject:r[10],body:{format:'text',text:r[11]},attachments:[]}}));
await fs.writeFile(path.join(here,'cases.jsonl'),cases.map(x=>JSON.stringify(x)).join('\n')+'\n','utf8');
console.log(`serialized ${cases.length} literal records`);