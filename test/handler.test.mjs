import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {parse} from 'acorn';
import {STRINGS} from '../core/copy.mjs';
import {screenText} from '../core/rules.mjs';
import {removeSentenceFromHtml} from '../core/remove.mjs';
import {officeZip,NS,slide,shape,sheet,wdoc} from './office-fixture.mjs';
import {JOHN,DAN,DEMO_BODY,CLEAN_BODY,PNG_B64,PNG_SIZE} from './helpers.mjs';
import {load,demo,person,plain,SOURCE} from './runtime-helper.mjs';
const failureMessage = reason => "Disclosure Gate couldn't check this email. " + reason + " It hasn't been sent. Press Send again to check it again, or ask your IT team.";
test('classic bundle parses as ES2016 and runs without Node, DOM, network or browser encoding globals',async()=>{
  parse(SOURCE,{ecmaVersion:2016});
  const l=load();
  for(const name of ['require','Buffer','window','document','fetch','XMLHttpRequest','navigator','TextDecoder','TextEncoder','crypto']) assert.equal(vm.runInContext('typeof '+name,l.context),'undefined',name);
  assert.deepEqual(l.calls,['onMessageAttachmentsChangedHandler','onMessageComposeHandler','onMessageSendHandler','onAppointmentSendHandler','ready']);
  const result=await l.send();
  assert.equal(result.allowEvent,false);assert.equal(result.commandId,'dgOpenPane');
  assert.equal(JSON.parse(l.values['dg-phase']).phase,'held');
  assert.equal(JSON.parse(l.values['dg-result']).result.findings.length,2);
});
test('clear unchanged draft releases; every Send runs a new local check',async()=>{
  const l=load({state:demo({body:CLEAN_BODY})});
  for(let i=0;i<3;i++) assert.deepEqual(await l.send(),{allowEvent:true});
  assert.equal(l.checks.length,3);
});
test('legacy regex adapter preserves exact groups and highlights',async()=>{
  const l=load(),texts=[DEMO_BODY,'Our margin is 22%. Gate code is 4417. Their PM is a moron.','The alarm is off. The password is Tr4ctor!22.','Dan is out Friday.','Our costs are $22,000. We can accept $50,000.'];
  for(const text of texts) {
    const expected=screenText(text),r=await l.core.checkDraft({from:JOHN,to:[DAN],subject:'',body:{text},attachments:[]});
    const select=f=>({category:f.category,marks:f.marks,sentence:f.sentence});
    assert.deepEqual(plain(r.findings.map(select)),expected.map(select));
  }
});
test('an Outlook on the web body is checked line by line, not as its run-together Text coercion',async()=>{
  // Live, 24 October 2026: three typed lines are three <div>s, and body.getAsync('text') returned them with no breaks.
  const html='<div style="font-size: 12pt">Hi Sam,</div><div style="font-size: 12pt">The portal password is Harbor-2026!</div><div style="font-size: 12pt">See you Tuesday.</div>';
  const l=load({state:demo({format:'html',html,body:'Hi Sam,The portal password is Harbor-2026!See you Tuesday.'})});
  assert.equal((await l.send()).allowEvent,false);
  const [f]=JSON.parse(l.values['dg-result']).result.findings;
  assert.equal(f.sentence.text,'The portal password is Harbor-2026!');
  const cut=removeSentenceFromHtml(html,f.sentence.text,f.sentence.occurrence);
  assert.ok(cut.ok);assert.equal(cut.html,html.replace('The portal password is Harbor-2026!',''));
});
test('without 1.14 the ribbon fallback never promises Send anyway',async()=>{
  const o=await load({supported:false}).send();assert.equal(o.commandId,undefined);assert.match(o.errorMessage,/Open Disclosure Gate from the ribbon/);assert.doesNotMatch(o.errorMessage,/send anyway/i);
});
test('refused Review retries a plain hold; refused release holds unavailable',async()=>{
  const held=await load().send(o=>'commandId' in o);assert.equal(held.allowEvent,false);assert.equal(held.commandId,undefined);
  assert.deepEqual(await load({state:demo({body:CLEAN_BODY})}).send(o=>o.allowEvent),{allowEvent:false,errorMessage:failureMessage("The local check didn't finish.")});
});
test('a change to any release-bound field while checking holds',async()=>{
  const changes=[s=>s.subject='Changed',s=>s.bcc=[person(DAN)],s=>s.body+=' More.',s=>s.format='text',s=>s.attachments=[{id:'new',name:'x.png',size:1,attachmentType:'file'}],s=>s.from=person(DAN)];
  for(const change of changes) {const state=demo({body:CLEAN_BODY}),l=load({state,check:async(d,o,original)=>{const r=await original(d,o);change(state);return r;}});assert.deepEqual(await l.send(),{allowEvent:false,errorMessage:failureMessage('The draft changed during the check.')});}
});
test('failed and malformed local results hold unavailable',async()=>{
  for(const check of [()=>{throw new Error('failed');},()=>null,()=>({state:'held',findings:[]}),()=>({state:'unavailable'})]) {
    const result=await load({check}).send();assert.equal(result.allowEvent,false);assert.match(result.errorMessage,/couldn't check this email\./);assert.match(result.errorMessage,/It hasn't been sent/);assert.doesNotMatch(result.errorMessage,/Send Anyway/);
  }
});
test('deadline completes once; a late Clear never releases',async()=>{
  const l=load(),outcomes=[];let release;
  const p=l.api.run({completed:o=>outcomes.push(plain(o))},{read:()=>Promise.resolve({}),check:()=>new Promise(r=>release=r),phase:()=>{},reviewButton:()=>true,fingerprint:()=>'',deadlineMs:15});
  await new Promise(r=>setTimeout(r,30));release({state:'clear'});await p;assert.deepEqual(outcomes,[{allowEvent:false,errorMessage:failureMessage('It took too long.')}]);
});
test('wall clock catches a synchronous overrun before release',async()=>{
  const l=load(),outcomes=[];
  await l.api.run({completed:o=>outcomes.push(plain(o))},{read:()=>Promise.resolve({}),check:()=>{const end=Date.now()+25;while(Date.now()<end){};return {state:'clear'};},phase:()=>{},reviewButton:()=>true,fingerprint:()=>'',deadlineMs:10});
  assert.equal(outcomes[0].allowEvent,false);assert.equal(outcomes.length,1);
});
test('only all-prompt findings override Enforce on 1.14',async()=>{
  for(const [severities,supported,expected] of [[['prompt'],true,'promptUser'],[['prompt','prompt'],true,'promptUser'],[['prompt','stop'],true,undefined],[[undefined],true,undefined],[['prompt'],false,undefined]]) {
    const l=load({supported,check:()=>({state:'held',findings:severities.map(severity=>({severity})),message:'Review recipients.',fallbackMessage:'Review recipients from the ribbon.'})});
    assert.equal((await l.send()).sendModeOverride,expected);
  }
});
test('prompt override survives a refused Review button',async()=>{
  const l=load({check:()=>({state:'held',findings:[{severity:'prompt'}],message:'Review recipients.'})});assert.equal((await l.send(o=>'commandId' in o)).sendModeOverride,'promptUser');
});
test('script URL and HTML query supply domains without transport; roaming settings never widen inside',async()=>{
  for(const opts of [{url:'https://static.example/runtime.js?dg=2&mode=enforce&domains=whitfielddev.example'},{url:null,location:{href:'https://static.example/commands.html?dg=2&mode=warn&domains=whitfielddev.example'}}]) assert.equal((await load(opts).send()).allowEvent,true);
  assert.equal((await load({url:null,settings:{internalDomains:['whitfielddev.example'],mode:'enforce'}}).send()).allowEvent,false);
  assert.equal((await load({url:null,state:demo({cc:[]})}).send()).allowEvent,true);
});
test('VM extracts PPTX slides and notes; an inline picture is read only for its OCR hash',async()=>{
  const zip=officeZip('pptx',{'ppt/presentation.xml':`<p:presentation ${NS.p} ${NS.r}><p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst></p:presentation>`,'ppt/slides/slide1.xml':slide(shape('Our margin is 18%.')),'ppt/notesSlides/notesSlide1.xml':`<p:notes ${NS.p} ${NS.a}><a:p><a:r><a:t>Call Tuesday.</a:t></a:r></a:p></p:notes>`});
  const l=load({state:demo({body:CLEAN_BODY,attachments:[{id:'ppt',name:'brief.pptx',size:zip.length,attachmentType:'file'},{id:'logo',name:'logo.png',size:100,attachmentType:'file',isInline:true}],contents:{ppt:zip.toString('base64')}})});
  assert.equal((await l.send()).allowEvent,false);assert.deepEqual(l.reads.content,['ppt','logo']);
  const f=JSON.parse(l.values['dg-result']).result.findings[0];assert.deepEqual([f.file,f.category],['brief.pptx','economics']);
});
test('VM reads a DOCX text box, an embedded workbook and a sheet found by relationship',async()=>{
  const book=officeZip('xlsx',{'xl/workbook.xml':`<workbook ${NS.s} ${NS.r}><sheets><sheet name="Access" sheetId="1" r:id="rId1"/></sheets></workbook>`,'xl/worksheets/access.xml':sheet('<row r="1"><c r="A1" t="inlineStr"><is><t>The gate code is 4471.</t></is></c></row>')});
  const box='<w:p><w:r><w:t xml:space="preserve">Notes </w:t></w:r><w:r><w:pict><v:shape><v:textbox><w:txbxContent><w:p><w:r><w:t>Site office</w:t></w:r></w:p></w:txbxContent></v:textbox></v:shape></w:pict></w:r><w:r><w:t>and the password is Tr4ctor!22 for the trailer.</w:t></w:r></w:p>';
  const zip=officeZip('docx',{'word/document.xml':wdoc(box),'word/embeddings/Microsoft_Excel_Worksheet.xlsx':book});
  const l=load({state:demo({body:CLEAN_BODY,attachments:[{id:'d',name:'site.docx',size:zip.length,attachmentType:'file'}],contents:{d:zip.toString('base64')}})});
  assert.equal((await l.send()).allowEvent,false);
  const found=JSON.parse(l.values['dg-result']).result.findings.map(f=>[f.file,f.category]);
  assert.deepEqual(found,[['site.docx','access'],['site.docx','access']]);
});
test('without the OCR service an image is unreadable and Send is held, even with a stored ready entry',async()=>{
  const a={id:'one',name:'photo.png',size:PNG_SIZE,attachmentType:'file'};
  const cache={version:1,attachments:{one:{name:a.name,size:a.size,status:'ready',text:'',hash:'a'.repeat(64)}}};
  const l=load({state:demo({body:CLEAN_BODY,attachments:[a],contents:{one:PNG_B64}}),initialValues:{'dg-ocr-v1':JSON.stringify(cache)}});
  vm.runInContext('globalThis.DisclosureGateOcr=undefined',l.context);
  assert.equal((await l.send()).allowEvent,false);
  const finding=JSON.parse(l.values['dg-result']).result.findings[0];
  assert.deepEqual([finding.subkind,finding.detail],['picture','ocr_unsupported']);
  assert.equal(l.checks[0].attachments[0].ocr,undefined);
  assert.equal(l.draftApi.applyOcrCache,undefined);
});
test('explicit sentence removal and a fresh check clear the draft',async()=>{
  const state=demo(),l=load({state});assert.equal((await l.send()).allowEvent,false);
  for(const f of JSON.parse(l.values['dg-result']).result.findings) {const cut=removeSentenceFromHtml(state.body,f.sentence.text,f.sentence.occurrence);assert.ok(cut.ok);state.body=cut.html;}
  state.body=CLEAN_BODY;assert.deepEqual(await l.send(),{allowEvent:true});
});
test('repeated Send never releases an unchanged held draft',async()=>{const l=load();for(let i=0;i<4;i++) assert.equal((await l.send()).allowEvent,false);});

test('inside-only Send never reads subject, body or attachments',async()=>{const l=load({state:demo({cc:[]})});l.item.subject.getAsync=()=>{throw new Error('must not read subject');};l.item.getAttachmentsAsync=()=>{throw new Error('must not read files');};assert.deepEqual(await l.send(),{allowEvent:true});assert.equal(l.reads.body,0);});

test('PDF extraction also runs without encoding or Node globals in the VM',async()=>{const data=(await import('node:fs')).readFileSync(new URL('./fixtures/cost-summary.pdf',import.meta.url));const l=load({state:demo({body:CLEAN_BODY,attachments:[{id:'pdf',name:'cost-summary.pdf',size:data.length,attachmentType:'file'}],contents:{pdf:data.toString('base64')}})});assert.equal((await l.send()).allowEvent,false);const findings=JSON.parse(l.values['dg-result']).result.findings;assert.ok(findings.some(f=>f.category==='economics'&&f.source==='attachment'));});

test('stored pane fingerprint is a compact SHA-256 rather than a copy of the body',async()=>{const l=load();await l.send();const stored=JSON.parse(l.values['dg-result']);assert.match(stored.fingerprint,/^[a-f0-9]{64}$/);assert.ok(!stored.fingerprint.includes(DEMO_BODY));});

test('held completion waits for result persistence, with a bounded fallback if storage hangs',async()=>{for(const hangs of [false,true]){const l=load(),outcomes=[];let stored=false;await l.api.run({completed:o=>outcomes.push({...plain(o),stored})},{read:()=>Promise.resolve({}),check:()=>({state:'held',findings:[{}],message:'Review.'}),phase:phase=>phase==='held'?new Promise(r=>{if(!hangs)setTimeout(()=>{stored=true;r();},5);}):undefined,reviewButton:()=>true,deadlineMs:20,fingerprint:()=>''});assert.equal(outcomes.length,1);assert.equal(outcomes[0].stored,!hangs);}});

test('oversized pane results store a small fingerprint-bound local-recheck marker',async()=>{const l=load({check:()=>({state:'held',binding:'synthetic',message:'Review.',findings:Array.from({length:1000},(_,i)=>({category:'access',source:'body',sentence:{text:'Synthetic sentence '+i},marks:[],label:'Access and security'}))})});assert.equal((await l.send()).allowEvent,false);const raw=l.values['dg-result'],stored=JSON.parse(raw);assert.ok(raw.length<1000);assert.equal(stored.recheck,true);assert.match(stored.fingerprint,/^[a-f0-9]{64}$/);});
test('a From address in another domain never makes its recipients inside; the mailbox profile decides',async()=>{
  const other={displayName:'Shared',emailAddress:'team@gmail.example',recipientType:'user'};
  const l=load({state:demo({from:other,to:[{displayName:'Pat',emailAddress:'pat@gmail.example',recipientType:'user'}],cc:[],body:'The password is Tr4ctor!22 for the portal.'})});
  assert.equal((await l.send()).allowEvent,false);
});
test('an email over the hard limits says so instead of "try again", and is never released',async()=>{
  const l=load({state:demo({body:'Hello. '.repeat(80000)})});
  const r=await l.send();
  assert.equal(r.allowEvent,false);assert.match(r.errorMessage,/too large/);assert.doesNotMatch(r.errorMessage,/in a moment/);assert.equal(JSON.parse(l.values['dg-phase']).phase,'too_large');
});
test('the draft reader never has more than three Office calls in flight',async()=>{
  const l=load({state:demo({body:'The password is Tr4ctor!22.'})});let active=0,peak=0;
  const slow=(target,method)=>{const original=target[method];target[method]=(...args)=>{const cb=args.pop();active++;peak=Math.max(peak,active);original.call(target,...args,(r)=>setTimeout(()=>{active--;cb(r);},5));};};
  for(const f of ['from','to','cc','bcc','subject']) slow(l.item[f],'getAsync');
  slow(l.item.body,'getTypeAsync');slow(l.item.body,'getAsync');slow(l.item,'getAttachmentsAsync');
  assert.equal((await l.send()).allowEvent,false);
  assert.ok(peak<=3,'peak '+peak);assert.ok(peak>=2,'still parallel: '+peak);
});
test('the built runtime holds a label and its value split over two lines (audit, October 2026)',async()=>{
  for(const body of ['Password:\nTr4ctor!22','SSN:\n123456789','Passport number:\n548213976','api_key=\nJ9pR4vN7zK2mX6tQ8cL3wY5b','Sort code:\n20-00-00\nAccount: 12345678']) {
    const o=await load({state:demo({format:'text',body})}).send();
    assert.equal(o.allowEvent,false,body);
  }
  assert.deepEqual(await load({state:demo({format:'text',body:'Password:\nsee the vault entry'})}).send(),{allowEvent:true});
});
