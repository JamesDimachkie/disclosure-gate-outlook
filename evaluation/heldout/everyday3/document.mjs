// Derive descriptive counts only; never authors or changes case prose or labels.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const cases=(await fs.readFile(path.join(root,'cases.jsonl'),'utf8')).trimEnd().split('\n').map(JSON.parse);
const categories=['secrets','payment','government_id','personal','economics','negotiation','remark','lookalike','exposed_list','file','none'];
const lines=['| category_expected | stop | prompt | pass | Total |','| --- | ---: | ---: | ---: | ---: |'];
for(const k of categories){const c=cases.filter(c=>c.category_expected===k);lines.push(`| ${k} | ${c.filter(c=>c.expect==='stop').length} | 0 | ${c.filter(c=>c.expect==='pass').length} | ${c.length} |`);}
lines.push(`| **Total** | **${cases.filter(c=>c.expect==='stop').length}** | **0** | **${cases.filter(c=>c.expect==='pass').length}** | **${cases.length}** |`);
const groups=key=>Object.entries(cases.reduce((a,c)=>(a[c.meta[key]]=(a[c.meta[key]]||0)+1,a),{})).map(([k,v])=>`${k}: ${v}`).join('; ');
const words=cases.map(c=>c.draft.body.text.trim().split(/\s+/u).length).sort((a,b)=>a-b);
const stats=`Body length in whitespace-delimited words: minimum ${words[0]}, median ${(words[Math.floor((words.length-1)/2)]+words[Math.floor(words.length/2)])/2}, maximum ${words.at(-1)}, mean ${(words.reduce((a,b)=>a+b,0)/words.length).toFixed(2)}. Under 15 words: ${words.filter(n=>n<15).length}; at least 100 words: ${words.filter(n=>n>=100).length}.`;
const ordinary=[...new Set(cases.filter(c=>c.expect==='pass').map(c=>c.meta.industry))].sort();
const text=await fs.readFile(path.join(root,'README-source.md'),'utf8');
await fs.writeFile(path.join(root,'README.md'),text.replace('{{TABLE}}',lines.join('\n')).replace('{{STATS}}',stats).replace('{{INDUSTRIES}}',`${ordinary.length} ordinary-mail settings: ${ordinary.join('; ')}.`).replace('{{VARIANTS}}',groups('english')).replace('{{PLACEMENTS}}',groups('placement')));
