import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {validateManifest} from '../tools/validate-manifest.mjs';
import {RELEASE_BASE_URL} from '../outlook/config.mjs';
test('setup bundle makes configured XML locally and reports invalid domains',async()=>{
  const nodes=new Map(),handlers={};let blob,clicked=0;
  const node=id=>{if(!nodes.has(id))nodes.set(id,{value:['findings','failures'].includes(id)?'ask':id==='model'?'off':id==='version'?'2.0.0.0':'',hidden:true,textContent:'',addEventListener:(event,fn)=>handlers[id+':'+event]=fn});return nodes.get(id);};
  const link={remove(){},click(){clicked++;}};
  const context={document:{getElementById:node,createElement:()=>link,body:{append(){}}},Blob,URL:class extends URL{static createObjectURL(b){blob=b;return 'blob:test';}static revokeObjectURL(){}},setTimeout:fn=>fn()};
  vm.runInNewContext(readFileSync(new URL('../dist/setup.js',import.meta.url),'utf8'),context);
  assert.equal(node('base-url').value,RELEASE_BASE_URL);
  assert.match(node('technical-help').textContent,/PromptUser/);assert.match(node('findings-help').textContent,/most teams/);
  assert.doesNotMatch(node('mode-help').textContent,/Manifest|SendMode|Mailbox/);
  node('failures').value='hold';handlers['failures:change']();assert.match(node('technical-help').textContent,/Block/);assert.match(node('mode-help').textContent,/Outlook holds/);assert.match(node('failures-help').textContent,/unsent/);
  node('domains').value='Other.Example, third.example';handlers['setup-form:submit']({preventDefault(){}});
  assert.equal(clicked,1);assert.equal(link.download,'manifest.xml');assert.equal(blob.type,'text/xml');
  const xml=await blob.text();assert.equal(validateManifest(xml).mode,'Block');assert.match(xml,/domains=other.example%2Cthird.example/);assert.match(xml,/disclosure-gate-outlook\/runtime.js/);
  for(const findings of ['ask','hold']) for(const failures of ['ask','hold']) {
    node('findings').value=findings;node('failures').value=failures;handlers['findings:change']();handlers['failures:change']();
    handlers['setup-form:submit']({preventDefault(){}});
    const output=await blob.text(), mode=failures==='hold'?'Block':findings==='hold'?'SoftBlock':'PromptUser';assert.equal(validateManifest(output).mode,mode);
    assert.ok(node('technical-help').textContent.includes(`Manifest SendMode: ${mode} for both Send events.`));
    assert.equal(node('hold-ask-help').hidden,!(findings==='hold'&&failures==='ask'));
    assert.match(node('mode-help').textContent,failures==='ask'?/Send Anyway or Try Later/:/Outlook holds/);
    if(findings==='hold') assert.match(node('findings-help').textContent,/cannot be overridden, except two that only ask: an exposed recipient list and an attached picture it couldn't read/);
    assert.ok(output.includes('findings='+findings+'&amp;failures='+failures));
  }
  assert.match(node('model-help').textContent,/Off is the default/);assert.doesNotMatch(await blob.text(),/model=/);
  node('model').value='on';handlers['model:change']();assert.match(node('model-help').textContent,/20 of 200/);
  handlers['setup-form:submit']({preventDefault(){}});assert.match(await blob.text(),/&amp;model=on/);node('model').value='off';
  node('domains').value='*';handlers['setup-form:submit']({preventDefault(){}});assert.equal(clicked,6);assert.equal(node('setup-error').hidden,false);
});

test('setup keeps technical mapping in details and explains the hold/ask consequence in plain words',()=>{
  const html=readFileSync(new URL('../outlook/setup.html',import.meta.url),'utf8');
  assert.match(html,/<details><summary>Technical mapping and client support<\/summary><p id="technical-help"/);
  assert.match(html,/Files it can't read and checks that don't finish can still be sent after the sender confirms; choose Hold for failures too to prevent that\./);
  assert.match(html,/Outlook versions from roughly 2022 on can show Send Anyway for Ask outcomes; older ones hold them when either setting is Hold\./);
  assert.doesNotMatch(html,/Mailbox 1\.14/);
});
test('core has no Node imports or content/telemetry transport',()=>{
  for(const file of ['gate.mjs','attachments.mjs','bytes.mjs','sha256.mjs','recipients.mjs','sentences.mjs','remove.mjs','extract/pdf.mjs','extract/office.mjs','extract/zip.mjs','extract/inflate.mjs']) assert.doesNotMatch(readFileSync(new URL('../core/'+file,import.meta.url),'utf8'),/from ['"]node:|\bBuffer\b|\bfetch\s*\(|sendBeacon|XMLHttpRequest/,file);
  for(const file of ['runtime.js','pane.js']) assert.doesNotMatch(readFileSync(new URL('../dist/'+file,import.meta.url),'utf8'),/sendBeacon|fetch\s*\(|XMLHttpRequest|\/timing|\/check/);
});
