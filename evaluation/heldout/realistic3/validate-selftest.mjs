// Mutation checks for the standalone validator, confined to temporary copies in this tier.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.dirname(fileURLToPath(import.meta.url));
const [raw,readme,validator]=await Promise.all(['cases.jsonl','README.md','validate.mjs'].map(f=>fs.readFile(path.join(root,f),'utf8')));
const baseline=raw.trimEnd().split('\n').map(JSON.parse);
const temp=await fs.mkdtemp(path.join(root,'.validator-test-'));
const check=(ok,msg)=>{if(!ok)throw Error(msg);};
const stopIndex=baseline.findIndex(x=>x.expect==='stop');
const quoteIndex=baseline.findIndex(x=>x.metadata.placement==='quoted_history');
const tests=[
 ['duplicate ID',c=>{c[1].id=c[0].id;},null,/Invalid, unordered or repeated ID/],
 ['duplicate body',c=>{c[1].draft.body.text=c[0].draft.body.text;},null,/Repeated normalized body/],
 ['missing recipient kind',c=>{delete c[0].draft.to[0].kind;},null,/Invalid recipient fields/],
 ['non-reserved routing',c=>{c[0].draft.to[0].address='contact@external.invalid';},null,/Non-reserved or invalid address/],
 ['inside-only routing',c=>{c[0].draft.to[0].address=c[0].draft.from.address;},null,/Outside routing or exposed-list/],
 ['lookalike routing',c=>{c[0].draft.to[0].address='contact@bramblework.test';},null,/Potential lookalike routing/],
 ['visible list threshold',c=>{c[0].draft.to=Array.from({length:8},(_,i)=>({name:'Fixture',address:`person${i}@tidequay.test`,kind:'person'}));},null,/Outside routing or exposed-list/],
 ['body format',c=>{c[0].draft.body.format='html';},null,/Invalid body/],
 ['forbidden attachment',c=>{c[0].draft.attachments=[{}];},null,/This tier uses no attachments/],
 ['label mismatch',c=>{c[0].category_expected='personal';},null,/Label mismatch/],
 ['multiline rationale',c=>{c[0].why+='\nextra';},null,/Invalid one-line rationale/],
 ['README composition',null,r=>r.replace('| none | 0 | 0 | 240 | 240 |','| none | 0 | 0 | 239 | 239 |'),/README category mismatch/],
 ['README total',null,r=>r.replace('| **Total** | **60** | **0** | **240** | **300** |','| **Total** | **60** | **0** | **240** | **299** |'),/README total mismatch/],
 ['README length receipt',null,r=>r.replace('<!-- length-statistics ','<!-- invalid-length-statistics '),/README length statistics mismatch/],
 ['missing deciding sentence',c=>{const x=c[stopIndex];x.draft.body.text=x.draft.body.text.replace(x.metadata.deciding_sentence,'');},null,/Deciding sentence must occur exactly once/],
 ['duplicate deciding sentence',c=>{const x=c[stopIndex];x.draft.body.text+='\n'+x.metadata.deciding_sentence;},null,/Deciding sentence must occur exactly once/],
 ['wrong deciding placement',c=>{c[quoteIndex].metadata.placement='body';},null,/Body placement/],
 ['unquoted rationale',c=>{c[stopIndex].why='SPEC §5.4 identifies a personal detail.';},null,/Rationale must quote exact deciding sentence/],
 ['long numeric fixture',c=>{c[0].draft.body.text+='\n1111111111111';},null,/Prohibited long numeric sequence/],
 ['English metadata',c=>{c[0].metadata.english='NZ';},null,/Invalid scenario metadata/],
];
try{
 await fs.writeFile(path.join(temp,'validate.mjs'),validator);
 async function run(c,r){await fs.writeFile(path.join(temp,'cases.jsonl'),c.map(x=>JSON.stringify(x)).join('\n')+'\n');await fs.writeFile(path.join(temp,'README.md'),r);return spawnSync(process.execPath,[path.join(temp,'validate.mjs')],{encoding:'utf8',windowsHide:true});}
 const good=await run(baseline,readme);check(good.status===0,'Baseline validator rejected valid tier');
 for(const [name,mutate,changeReadme,expected] of tests){const c=structuredClone(baseline);if(mutate)mutate(c);const r=changeReadme?changeReadme(readme):readme;const result=await run(c,r);check(result.status!==0&&expected.test(result.stderr),`Mutation was not rejected for expected reason: ${name}`);}
 const repeat=await run(baseline,readme);check(repeat.status===0,'Baseline did not remain valid after tests');
 console.log(JSON.stringify({baseline:'accepted',mutations_rejected:tests.length,cases_unchanged:true,checker_imported:false}));
}finally{
 const resolved=await fs.realpath(temp),parent=await fs.realpath(root);
 check(path.dirname(resolved)===parent&&path.basename(resolved).startsWith('.validator-test-'),'Refusing cleanup outside tier');
 await fs.rm(resolved,{recursive:true,force:true});
}
