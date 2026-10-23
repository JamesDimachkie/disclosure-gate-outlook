import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const directory = path.dirname(fileURLToPath(import.meta.url));
const categories = ['secrets','payment','government_id','personal','economics','negotiation','remark','lookalike','exposed_list','file','none'];
const expectations = ['stop','prompt','pass'];
const outcomes = [...expectations,'error'];
function assert(condition, message) { if (!condition) throw new Error(message); }
function domainOf(address) {
 assert(typeof address === 'string' && /^[^@\s]+@[^@\s]+$/.test(address), 'Invalid sender address');
 return address.slice(address.lastIndexOf('@')+1).toLowerCase();
}
function validate(cases, readme, minimum = 400) {
 const ids = new Set(); const counts = Object.fromEntries(categories.map(c=>[c,{stop:0,prompt:0,pass:0}]));
 for (const c of cases) {
  assert(typeof c.id==='string' && /^[a-z_][a-z0-9_]*-\d{3}$/.test(c.id) && !ids.has(c.id), 'Invalid or repeated case ID'); ids.add(c.id);
  assert(categories.includes(c.category_expected) && expectations.includes(c.expect), 'Invalid category or expectation');
  assert(typeof c.why==='string' && /SPEC §/.test(c.why) && !/[\r\n]/.test(c.why), 'Missing one-line spec rationale');
  counts[c.category_expected][c.expect]++;
  const d = c.draft; const own = domainOf(d.from.address);
  assert(own.length>0 && own.includes('.'), 'Internal domain is not derivable');
  assert(!c.internal_domains || (Array.isArray(c.internal_domains) && c.internal_domains.every(x=>typeof x==='string'&&/^[a-z0-9.-]+$/i.test(x))), 'Invalid admin domains');
  for(const field of ['to','cc','bcc']) assert(Array.isArray(d[field]) && d[field].every(r=>typeof r.name==='string'&&typeof r.address==='string'&&['person','group'].includes(r.kind)), 'Invalid recipients');
  assert(typeof d.subject==='string' && d.body?.format==='text' && typeof d.body.text==='string', 'Invalid text draft');
  assert(Array.isArray(d.attachments), 'Missing attachments array');
  const attachmentIds = new Set();
  for(const a of d.attachments) {
   assert(typeof a.id==='string'&&!attachmentIds.has(a.id), 'Repeated attachment ID'); attachmentIds.add(a.id);
   assert(typeof a.content==='string' && Buffer.from(a.content,'base64').toString('base64')===a.content, 'Noncanonical base64');
   assert(Number.isSafeInteger(a.size)&&a.size>=0&&Buffer.from(a.content,'base64').length===a.size, 'Attachment size mismatch');
   assert(typeof a.name==='string'&&a.isInline===false&&a.type==='file', 'Invalid file attachment');
  }
 }
 assert(cases.length>=minimum, 'Insufficient cases');
 for(const category of categories) {
  const table = readme.split(/\r?\n/).find(line=>line.startsWith(`| ${category} |`));
  assert(table, 'Missing README category row');
  const numbers=table.split('|').slice(2,6).map(x=>Number(x.trim()));
  const c=counts[category];assert(numbers[0]===c.stop&&numbers[1]===c.prompt&&numbers[2]===c.pass&&numbers[3]===c.stop+c.prompt+c.pass, 'README counts differ from JSONL');
 }
 const totalRow=readme.split(/\r?\n/).find(line=>line.startsWith('| **Total** |'));
 assert(totalRow, 'Missing README total row');
 const totals=totalRow.split('|').slice(2,6).map(x=>Number(x.trim().replaceAll('*','')));
 assert(totals[0]===cases.filter(c=>c.expect==='stop').length&&totals[1]===cases.filter(c=>c.expect==='prompt').length&&totals[2]===cases.filter(c=>c.expect==='pass').length&&totals[3]===cases.length, 'README total differs');
 return counts;
}
function classify(result) {
 if(result?.state==='clear')return 'pass';
 if(result?.state!=='held'||!Array.isArray(result.findings)||result.findings.length===0)return 'error';
 return result.findings.some(f=>f?.severity!=='prompt')?'stop':'prompt';
}
function returnedCategories(result) {
 return [...new Set((Array.isArray(result?.findings)?result.findings:[]).map(f=>typeof f?.category==='string'&&/^[a-zA-Z0-9_.-]{1,64}$/.test(f.category)?f.category:'<unknown>'))].sort();
}
function safeErrorCode(error) {return typeof error?.code==='string'&&/^[A-Z0-9_]{1,64}$/.test(error.code)?error.code:'CHECK_ERROR';}
const percent=(n,d)=>d?`${(100*n/d).toFixed(2)}%`:'n/a';
function outputPath(arg) {
 const target=path.resolve(directory,arg); const relative=path.relative(directory,target);
 assert(relative!==''&&relative!=='..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative), '--json must stay within evaluation/heldout/');
 assert(!['cases.jsonl','README.md','run.mjs'].includes(relative), '--json cannot overwrite a deliverable');
 return target;
}
async function main() {
 const args=process.argv.slice(2), options=new Map();
 for(let i=0;i<args.length;i+=2){assert(['--json','--cases','--semantic'].includes(args[i])&&args[i+1]&&!args[i+1].startsWith('--')&&!options.has(args[i]), 'Usage: node evaluation/heldout/run.mjs [--cases path] [--json out.json] [--semantic model/out]');options.set(args[i],args[i+1]);}
 const destination=options.has('--json')?outputPath(options.get('--json')):null;
 const casesPath=options.has('--cases')?path.resolve(options.get('--cases')):path.join(directory,'cases.jsonl');
 const [raw,readme]=await Promise.all([fs.readFile(casesPath,'utf8'),fs.readFile(path.join(path.dirname(casesPath),'README.md'),'utf8')]);
 const lines=raw.trimEnd().split(/\r?\n/);const cases=lines.map((line,i)=>{try{return JSON.parse(line);}catch{throw Error(`Invalid JSON on line ${i+1}`);}});
 const composition=validate(cases,readme,options.has('--cases')?1:400); const sha256=createHash('sha256').update(raw).digest('hex');
 console.log(`Held-out run; ${cases.length} cases validated; SHA-256 ${sha256}`);
 let checkDraft;let loadError;
 try {({checkDraft}=await import(pathToFileURL(path.resolve(directory,'../../core/gate.mjs')).href));if(typeof checkDraft!=='function')loadError='MISSING_CHECK_DRAFT_EXPORT';}catch(error){loadError=safeErrorCode(error);}
 if(loadError)console.log(`Checker unavailable: ${loadError}; every case is recorded as error.`);
 // --semantic loads the on-device classifier the same way the Node smoke check does. The budget is lifted
 // so the run measures what the model finds; Send-time timing is measured separately.
 let semantic=null;const semanticStates={};
 if(options.has('--semantic')){
  const dir=path.resolve(options.get('--semantic'));const ort=await import('onnxruntime-web');const {createClassifier}=await import(pathToFileURL(path.resolve(directory,'../../model/classifier.mjs')).href);
  ort.env.wasm.numThreads=1;ort.env.wasm.wasmBinary=await fs.readFile(path.resolve(directory,'../../node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm'));
  semantic=await createClassifier({ort,modelBytes:await fs.readFile(path.join(dir,'model.onnx')),tokenizerJson:JSON.parse(await fs.readFile(path.join(dir,'tokenizer.json'),'utf8')),labelsJson:JSON.parse(await fs.readFile(path.join(dir,'labels.json'),'utf8'))});
 }
 const results=[];
 for(const c of cases) {
  let actual='error', findings=[], errorCode=loadError;
  if(!loadError)try {
   const internalDomains=[...new Set([domainOf(c.draft.from.address),...(c.internal_domains??[]).map(x=>x.toLowerCase())])];
   const result=await checkDraft(structuredClone(c.draft), { config: { internalDomains }, ...(semantic?{semantic,semanticBudgetMs:60000}:{}) });
   if(semantic){const s=String(result?.checked?.semantic??'none');semanticStates[s]=(semanticStates[s]||0)+1;}
   actual=classify(result);findings=returnedCategories(result);if(actual==='error')errorCode='UNEXPECTED_RESULT';
  }catch(error){errorCode=safeErrorCode(error);}
  results.push({id:c.id,category_expected:c.category_expected,expect:c.expect,actual,finding_categories:findings,...(errorCode?{error_code:errorCode}:{})});
 }
 const matrix=Object.fromEntries(expectations.map(e=>[e,Object.fromEntries(outcomes.map(a=>[a,0]))]));
 for(const r of results)matrix[r.expect][r.actual]++;
 const expectedPass=results.filter(r=>r.expect==='pass').length,expectedStop=results.filter(r=>r.expect==='stop').length;
 const falseStops=results.filter(r=>r.expect==='pass'&&r.actual==='stop');
 const unwantedPrompts=results.filter(r=>r.expect==='pass'&&r.actual==='prompt');
 const caught=matrix.stop.stop;
 const byCategory=categories.map(category=>{
  const relevant=results.filter(r=>r.category_expected===category);
  return {category,total:relevant.length,expected_stop:composition[category].stop,expected_prompt:composition[category].prompt,expected_pass:composition[category].pass,correct:relevant.filter(r=>r.expect===r.actual).length,misses:relevant.filter(r=>r.expect==='stop'&&r.actual!=='stop').length,false_stops:relevant.filter(r=>r.expect==='pass'&&r.actual==='stop').length,prompt_mismatches:relevant.filter(r=>r.expect==='prompt'&&r.actual!=='prompt').length,unwanted_prompts:relevant.filter(r=>r.expect==='pass'&&r.actual==='prompt').length,errors:relevant.filter(r=>r.actual==='error').length};
 });
 console.log('Confusion counts (rows expected; columns actual):');
 console.table(expectations.map(expect=>({expected:expect,...matrix[expect]})));
 console.log(`False-stop rate on pass cases: ${falseStops.length}/${expectedPass} (${percent(falseStops.length,expectedPass)})`);
 console.log(`Unwanted prompts on pass cases: ${unwantedPrompts.length}/${expectedPass} (${percent(unwantedPrompts.length,expectedPass)})`);
 console.log(`Any hold on pass cases: ${falseStops.length+unwantedPrompts.length}/${expectedPass} (${percent(falseStops.length+unwantedPrompts.length,expectedPass)})`);
 console.log(`Catch rate on stop cases: ${caught}/${expectedStop} (${percent(caught,expectedStop)})`);
 console.log(`Prompt accuracy: ${matrix.prompt.prompt}/${cases.filter(c=>c.expect==='prompt').length} (${percent(matrix.prompt.prompt,cases.filter(c=>c.expect==='prompt').length)})`);
 const correct=results.filter(r=>r.expect===r.actual).length;const errors=results.filter(r=>r.actual==='error');
 console.log(`Exact expectation matches: ${correct}/${cases.length} (${percent(correct,cases.length)}); errors: ${errors.length}`);
 console.table(byCategory);
 for(const [label,subset] of [
  ['MISS',results.filter(r=>r.expect==='stop'&&r.actual!=='stop')],
  ['FALSE_STOP',falseStops],['PROMPT_MISMATCH',results.filter(r=>r.expect==='prompt'&&r.actual!=='prompt')],
  ['UNWANTED_PROMPT',unwantedPrompts],['ERROR_ON_PASS',errors.filter(r=>r.expect==='pass')]
 ]) for(const r of subset) console.log(`${label} ${r.id}: expected=${r.expect} actual=${r.actual} findings=${r.finding_categories.join(',')||'(none)'}${r.error_code?' error='+r.error_code:''}`);
 const report={label:'pre-integration',...(semantic?{semantic_model:options.get('--semantic'),semantic_states:semanticStates}:{}),cases_sha256:sha256,total:cases.length,composition,confusion:matrix,false_stop_rate:falseStops.length/expectedPass,catch_rate:caught/expectedStop,unwanted_prompts:unwantedPrompts.length,correct,errors:errors.length,by_category:byCategory,results};
 if(destination){const realDirectory=await fs.realpath(directory);const realParent=await fs.realpath(path.dirname(destination));const relativeParent=path.relative(realDirectory,realParent);assert(relativeParent!=='..'&&!relativeParent.startsWith('..'+path.sep)&&!path.isAbsolute(relativeParent), 'Report parent escapes heldout');await fs.writeFile(destination,JSON.stringify(report,null,2)+'\n',{encoding:'utf8',flag:'wx'});console.log(`JSON report: ${path.relative(directory,destination)}`);}
 if(errors.length)process.exitCode=1;
}
main().catch(()=>{console.error('Runner setup failed. Check arguments, JSONL structure, README counts, and output path. No email content is printed.');process.exitCode=1;});
