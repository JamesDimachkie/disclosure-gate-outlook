import { build } from 'esbuild';
import { transformAsync } from '@babel/core';
import presetEnv from '@babel/preset-env';
import rewritePattern from 'regexpu-core';
import { parse, tokenizer } from 'acorn';
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { DEV_ID } from '../outlook/config.mjs';
import { generateManifest } from '../outlook/manifest.mjs';
import { validateManifest } from './validate-manifest.mjs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { buildModel } from './build-model.mjs';

// Every shipped script is pure ASCII: a host that serves .js without a charset (self-hosted IIS or S3)
// would otherwise misread a character inside a regular expression and the whole add-in would fail to
// load. Outside templates a \u escape means the same character (strings, regex literals). Inside a
// template it becomes an interpolation, ${"’"}: String.raw would keep a bare ’ as six
// characters, but an interpolation inserts the character itself.
const escapeChar = (ch) => {
  const cp = ch.codePointAt(0);
  const units = cp > 0xffff ? [0xd800 + ((cp - 0x10000) >> 10), 0xdc00 + ((cp - 0x10000) & 0x3ff)] : [cp];
  return units.map((u) => '\\u' + u.toString(16).padStart(4, '0')).join('');
};
export function asciiOnly(code) {
  if (!/[^\x00-\x7f]/.test(code)) return code;
  const templates = [];
  for (const token of tokenizer(code, { ecmaVersion: 'latest', allowHashBang: true })) {
    if (token.type.label === 'template') templates.push([token.start, token.end]);
  }
  let out = '', at = 0;
  for (const [start, end] of templates) {
    out += code.slice(at, start).replace(/[^\x00-\x7f]/gu, escapeChar);
    out += code.slice(start, end).replace(/[^\x00-\x7f]/gu, (ch) => '${"' + escapeChar(ch) + '"}');
    at = end;
  }
  return out + code.slice(at).replace(/[^\x00-\x7f]/gu, escapeChar);
}
const root=fileURLToPath(new URL('../',import.meta.url));
const noTernary=({types:t})=>({visitor:{ConditionalExpression:{exit(path) {
  const {test,consequent,alternate}=path.node;
  path.replaceWith(t.callExpression(t.arrowFunctionExpression([],t.blockStatement([t.ifStatement(test,t.returnStatement(consequent)),t.returnStatement(alternate)])),[]));
}}}});
// Each named group is wrapped so a zero-width capture right after it records where it ended
// (outlook/indexed-pattern.mjs turns that into the group's position).
export function markGroupEnds(source) {
  const opens=[], ops=[];
  for(let i=0;i<source.length;i++) {
    const c=source[i];
    if(c==='\\') { i++; continue; }
    if(c==='[') { for(i++;i<source.length && source[i]!==']';i++) if(source[i]==='\\') i++; continue; }
    if(c==='(') { const name=/^\(\?<([A-Za-z_]\w*)>/.exec(source.slice(i)); opens.push(name?{at:i,name:name[1]}:null); continue; }
    if(c===')') { const g=opens.pop(); if(g) { ops.push([g.at,0,'(?:']); ops.push([i+1,1,'(?=(?<__dg_end_'+g.name+'>[\\s\\S]*)))']); } }
  }
  ops.sort((a,b)=>b[0]-a[0] || a[1]-b[1]);
  for(const [at,,text] of ops) source=source.slice(0,at)+text+source.slice(at);
  return source;
}
// Every pattern core makes through core/regex.mjs, converted for ES2016 with its flags kept: `plain`
// searches, `marked` measures group positions once a match is found (outlook/indexed-pattern.mjs).
// The conversion inserts captures, so numbered backreferences would silently shift: refuse them, and
// any group name the marker scan can't see.
const { made }=await import('../core/regex.mjs');
await import('../core/gate.mjs');
const convert=(source,flags)=>{
  const groups={};
  const out=rewritePattern(source,flags.replace('d',''),{namedGroups:'transform',unicodeFlag:'transform',unicodePropertyEscapes:'transform',dotAllFlag:'transform',onNamedGroup:(name,index)=>{groups[name]=index;}});
  return {source:out,groups};
};
const table={};
for(const [key,{source,flags}] of made) {
  if(/(^|[^\\])(\\\\)*\\[1-9]/.test(source)) throw new Error('Numbered backreference in an indexed pattern; use \\k<name>: '+source.slice(0,80));
  if(/\(\?<(?![=!])(?![A-Za-z_]\w*>)/.test(source)) throw new Error('Unsupported group name in an indexed pattern: '+source.slice(0,80));
  table[key]={plain:convert(source,flags),marked:convert(markGroupEnds(source),flags),flags:flags.replace(/[dus]/g,'')};
}
const legacyRules={name:'legacy-source',setup(b) {
  b.onLoad({filter:/\.(?:mjs|js)$/},async args=>{
    if(args.path.includes('node_modules')) return null;
    let text=await readFile(args.path,'utf8');
    if(/[/\\]core[/\\]regex\.mjs$/.test(args.path)) {
      // Engines with the d flag (every modern client) build the pattern natively; only ES2016
      // classic Outlook uses the converted table.
      text="import { indexedPattern } from '../outlook/indexed-pattern.mjs';\nconst TABLE="+JSON.stringify(table)+";\n"+
        "let native=false; try { native=new RegExp('(?<a>x)','d').exec('x').indices.groups.a[0]===0; } catch (e) { native=false; }\n"+
        "export const made=new Map();\nexport const nativeIndices=()=>native;\n"+
        "export function indexed(source,flags) { return native ? new RegExp(source,flags.indexOf('d')>=0?flags:flags+'d') : indexedPattern(flags+'/'+source,TABLE); }\n";
    }
    const result=await transformAsync(text,{configFile:false,babelrc:false,comments:false,presets:[[presetEnv,{targets:{edge:'14'},modules:false}]]});
    return {contents:result.code,loader:'js',resolveDir:resolve(args.path,'..')};
  });
}};
export async function buildSite() {
  await mkdir(resolve(root,'dist'),{recursive:true});
  for(const [entry,out,legacy] of [['outlook/runtime-entry.mjs','runtime.js',true],['outlook/pane-entry.mjs','pane.js',false],['outlook/setup.mjs','setup.js',false]]) {
    const result=await build({absWorkingDir:root,entryPoints:[entry],bundle:true,write:false,metafile:true,format:'iife',platform:'browser',target:'es2016',plugins:[legacyRules],logLevel:'silent'});
    const compiled=await transformAsync(result.outputFiles[0].text,{configFile:false,babelrc:false,comments:false,compact:true,presets:[[presetEnv,{targets:{edge:'14'},modules:false}]],plugins:legacy?[noTernary]:[]});
    if(legacy) {
      parse(compiled.code,{ecmaVersion:2016,sourceType:'script'}); if(/\b(?:import|export)\s/.test(compiled.code)) throw new Error('Module in classic bundle');
      if(Object.keys(result.metafile.inputs).some(p=>/onnxruntime|huggingface|model\/classifier|outlook\/model-/.test(p.replace(/\\/g,'/')))) throw new Error('Model engine/loader in classic bundle');
      console.log('Classic runtime: ES2016 parse passed; no model engine, loader or ORT.');
    }
    await writeFile(resolve(root,'dist',out),asciiOnly(compiled.code)+'\n');
  }
  for(const file of ['index.html','landing.css','commands.html','taskpane.html','taskpane.css','tokens.css','setup.html','setup.css']) await cp(resolve(root,'outlook',file),resolve(root,'dist',file));
  await cp(resolve(root,'outlook/assets'),resolve(root,'dist/assets'),{recursive:true});
  await cp(resolve(root,'LICENSE'),resolve(root,'dist/LICENSE.txt'));
  await cp(resolve(root,'node_modules/core-js/LICENSE'),resolve(root,'dist/LICENSE-core-js.txt'));
  await cp(resolve(root,'node_modules/@babel/core/LICENSE'),resolve(root,'dist/LICENSE-Babel.txt'));
  // The browser-only engine is lazy-loaded; never include Tesseract in the classic event bundle.
  const ocrDir=resolve(root,'dist/ocr'); await mkdir(resolve(ocrDir,'lang'),{recursive:true});
  await build({absWorkingDir:root,entryPoints:['outlook/ocr-engine.mjs'],outfile:resolve(ocrDir,'engine.js'),bundle:true,format:'iife',platform:'browser',target:'es2020',minify:true,legalComments:'eof',logLevel:'silent'});
  for(const [from,to] of [
    ['tesseract.js/dist/worker.min.js','worker.min.js'],
    ['tesseract.js/dist/worker.min.js.LICENSE.txt','LICENSE-worker.txt'],
    ['tesseract.js/LICENSE.md','LICENSE-tesseract.js.txt'],
    ['tesseract.js-core/LICENSE','LICENSE-tesseract-core.txt'],
    ['tesseract.js-core/tesseract-core-lstm.js','tesseract-core-lstm.js'],
    ['tesseract.js-core/tesseract-core-lstm.wasm','tesseract-core-lstm.wasm'],
    ['@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz','lang/eng.traineddata.gz'],
  ]) await cp(resolve(root,'node_modules',from),resolve(ocrDir,to));
  // The traineddata npm package omits its repository's Apache licence. Same unmodified text
  // as the core's Apache-2.0 licence; provenance and package MIT metadata are stated in NOTICE.
  await cp(resolve(root,'node_modules/tesseract.js-core/LICENSE'),resolve(ocrDir,'LICENSE-traineddata-Apache-2.0.txt'));
  await cp(resolve(root,'outlook/OCR-NOTICE.txt'),resolve(ocrDir,'NOTICE.txt'));
  for(const [from,to] of [['bmp-js/LICENSE','LICENSE-bmp-js.txt'],['idb-keyval/LICENCE','LICENSE-idb-keyval.txt'],['is-url/LICENSE-MIT','LICENSE-is-url.txt'],['regenerator-runtime/LICENSE','LICENSE-regenerator-runtime.txt'],['wasm-feature-detect/LICENSE','LICENSE-wasm-feature-detect.txt'],['zlibjs/LICENSE','LICENSE-zlibjs.txt']]) await cp(resolve(root,'node_modules',from),resolve(ocrDir,to));
  const modelManifest=await buildModel(root);
  // One browser event script: optional semantics must not add a blocking script request before
  // the mandatory gate can register its handlers. The large engine is still lazy and separate.
  const browser=await build({absWorkingDir:root,entryPoints:['outlook/browser-entry.mjs'],bundle:true,write:false,format:'iife',platform:'browser',target:'es2016',plugins:[legacyRules],logLevel:'silent',define:{__DG_MODEL_MANIFEST__:JSON.stringify(modelManifest)}});
  const browserCompiled=await transformAsync(browser.outputFiles[0].text,{configFile:false,babelrc:false,comments:false,compact:true,presets:[[presetEnv,{targets:{edge:'14'},modules:false}]]});
  await writeFile(resolve(root,'dist/runtime-browser.js'),asciiOnly(browserCompiled.code)+'\n');
  await writeFile(resolve(root,'dist/.nojekyll'),'');
  for(const [name,options] of [['manifest.xml',{}],['manifest-dev.xml',{baseUrl:'https://localhost:3443/',id:DEV_ID,findings:'ask',failures:'ask'}]]) {
    const xml=generateManifest(options); const validation=validateManifest(xml);
    await writeFile(resolve(root,'dist',name),xml);
    if(name==='manifest-dev.xml') await writeFile(resolve(root,'outlook/manifest.xml'),xml);
    console.log(name+': offline checks passed ('+validation.mode+')');
  }
  console.log('Static site built in dist/.');
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) await buildSite();
