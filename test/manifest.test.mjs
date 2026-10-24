import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {generateManifest} from '../outlook/manifest.mjs';
import {DEV_ID,RELEASE_ID,RELEASE_BASE_URL,runtimeConfig,parseConfigUrl} from '../outlook/config.mjs';

test('malformed or duplicate runtime settings fall back to unknown settings without trusting page overrides',()=>{
  const fallback={findings:'hold',failures:'hold',model:'on',internalDomains:[],trustedDomains:[],settingsKnown:false};
  for(const query of ['findings=%','findings=ask&findings=hold','domains=other.example&domains=third.example','failures=no','domains=*']) {
    const office={context:{urls:{javascriptRuntimeUrl:'https://static.example/runtime.js?dg=2&'+query}}};
    assert.deepEqual(runtimeConfig(office,{location:{href:'https://static.example/?dg=2&findings=ask&domains=other.example'}}),fallback,query);
    assert.deepEqual(runtimeConfig({context:{}},{location:{href:'https://static.example/?dg=2&'+query}}),fallback,query);
  }
});
import {validateManifest} from '../tools/validate-manifest.mjs';
test('all generated mode/host/id combinations pass offline XML and resource checks',()=>{
  for(const baseUrl of [RELEASE_BASE_URL,'https://localhost:3443/','https://static.example/one/two/']) for(const mode of ['warn','enforce']) {
    const xml=generateManifest({baseUrl,mode,internalDomains:['other.example','third.example'],version:'2.3.4.5',id:DEV_ID});
    const result=validateManifest(xml);assert.equal(result.mode,mode==='warn'?'PromptUser':'Block');assert.equal(result.id,DEV_ID);
    assert.match(xml,/type="javascript"/);assert.match(xml,/&amp;domains=other.example%2Cthird.example/);
  }
  assert.equal(validateManifest(readFileSync(new URL('../dist/manifest.xml',import.meta.url),'utf8')).id,RELEASE_ID);
  assert.equal(validateManifest(readFileSync(new URL('../dist/manifest-dev.xml',import.meta.url),'utf8')).id,DEV_ID);
});
test('manifest generator rejects malformed or unsafe configuration; validator rejects broken XML and missing resources',()=>{
  for(const opts of [{baseUrl:'http://a.example'},{baseUrl:'https://u:p@a.example/'},{baseUrl:'https://a.example/?x=1'},{mode:'other'},{version:'2.0'},{version:'2.0.65536.0'},{id:'bad'},{internalDomains:['<example>']}]) assert.throws(()=>generateManifest(opts));
  const xml=generateManifest();for(const broken of [xml.slice(0,-20),xml.replace('type="javascript"','type="bad"'),xml.replace('dgOpenPane','missing'),xml.replace('https://','http://')]) assert.throws(()=>validateManifest(broken));
});
test('configuration comes only from manifest URLs; roaming settings never widen inside',()=>{
  const url='https://static.example/runtime.js?dg=2&mode=warn&domains=Other.Example%2Canother.example&et=123';
  const office={context:{urls:{javascriptRuntimeUrl:url},roamingSettings:{get:()=>({internalDomains:['old.example']})}}};
  assert.deepEqual(runtimeConfig(office,{}),{findings:'ask',failures:'ask',model:'on',internalDomains:['another.example','other.example'],trustedDomains:[]});
  assert.deepEqual(parseConfigUrl('https://a.example/?dg=2&mode=enforce&domains='),{findings:'hold',failures:'hold',model:'on',internalDomains:[],trustedDomains:[]});
  delete office.context.urls;assert.deepEqual(runtimeConfig(office,{}),{findings:'hold',failures:'hold',model:'on',internalDomains:[],trustedDomains:[],settingsKnown:false});
  assert.throws(()=>parseConfigUrl('https://a.example/?dg=2&mode=warn&domains=*&mode=enforce'));
});
test('distribution includes .nojekyll; all local HTML/CSS assets are relative and present',()=>{
  const dist=new URL('../dist/',import.meta.url);assert.ok(readdirSync(dist).includes('.nojekyll'));
  for(const file of ['index.html','setup.html','taskpane.html','commands.html']) {
    const html=readFileSync(new URL(file,dist),'utf8');
    for(const [,url] of html.matchAll(/(?:src|<link[^>]*href)="([^"]+)"/g)) {
      if(url.startsWith('https://')) {assert.equal(url,'https://appsforoffice.microsoft.com/lib/1/hosted/office.js');continue;}
      assert.ok(!url.startsWith('/'),file+': '+url);assert.ok(readFileSync(new URL(url,dist)).length>0);
    }
  }
});
test('shared-mailbox support, own licence in dist, and a page address is refused as the base',()=>{
  assert.match(generateManifest({}),/<DesktopFormFactor>\s*<SupportsSharedFolders>true<\/SupportsSharedFolders>\s*<FunctionFile/);
  assert.ok(readFileSync(new URL('../dist/LICENSE.txt',import.meta.url),'utf8').includes('Apache License'));
  assert.throws(()=>generateManifest({baseUrl:'https://example.org/addin/setup.html'}),/folder address/);
  assert.match(generateManifest({baseUrl:'https://example.org/addin'}),/https:\/\/example\.org\/addin\/runtime\.js/);
});
test('trusted outside domains travel in the manifest URL and come back exactly',()=>{
  const xml=generateManifest({trustedDomains:['Partner.Example']});
  const url=/<bt:Url id="Script.Url" DefaultValue="([^"]+)"/.exec(xml)[1].replace(/&amp;/g,'&');
  assert.deepEqual(parseConfigUrl(url).trustedDomains,['partner.example']);
  assert.deepEqual(parseConfigUrl('https://a.example/?dg=2&mode=warn&domains=').trustedDomains,[]);
});

test('both Send events share mode and runtime, with distinct Review commands on their compose surfaces',()=>{
  const xml=generateManifest();
  assert.match(xml,/<LaunchEvent Type="OnAppointmentSend" FunctionName="onAppointmentSendHandler" SendMode="PromptUser"\/>/);
  assert.match(xml,/AppointmentOrganizerCommandSurface[\s\S]*?id="dgOpenMeetingPane"[\s\S]*?Action xsi:type="ShowTaskpane"/);
  assert.match(xml,/Type="OnAppointmentAttachmentsChanged"/);assert.match(xml,/Type="OnNewAppointmentOrganizer"/);
  const meeting=/<LaunchEvent Type="OnAppointmentSend"[^>]+\/>/.exec(xml)[0];
  for(const broken of [xml.replace(meeting,''),xml.replace(meeting,meeting+meeting),xml.replace(meeting,meeting.replace('PromptUser','Block')),xml.replace('AppointmentOrganizerCommandSurface','AppointmentAttendeeCommandSurface'),xml.replace('dgOpenMeetingPane','dgOpenPane')]) assert.throws(()=>validateManifest(broken));
});
