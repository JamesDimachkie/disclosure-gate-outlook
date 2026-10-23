import test from 'node:test';
import assert from 'node:assert/strict';
import { load, appointment, person, plain } from './runtime-helper.mjs';
import { JOHN, KATE, DAN, PNG_B64, PNG_SIZE } from './helpers.mjs';
import { sha256 } from '../core/sha256.mjs';

const secret = 'The password is Tr4ctor!22 for the portal.';
const room = (address='room@northline.example', name='North Hall') => ({displayName:name,emailAddress:address,locationIdentifier:{id:address,type:'room'}});
const stored = l => JSON.parse(l.values['dg-result']).result;

test('appointment inside-only attendees and room clear without subject, body, location or attachment reads', async () => {
  const l=load({state:appointment({optionalAttendees:[],locations:[room()]})});
  for(const field of ['subject','location']) l.item[field].getAsync=()=>{throw new Error('must not read '+field);};
  l.item.body.getAsync=()=>{throw new Error('must not read body');};
  l.item.body.getTypeAsync=()=>{throw new Error('must not read body format');};
  l.item.getAttachmentsAsync=()=>{throw new Error('must not read attachments');};
  assert.deepEqual(await l.send(),{allowEvent:true});
  assert.deepEqual(plain(l.checks[0].to.map(r=>r.address)),[KATE.address,'room@northline.example']);
  assert.equal(l.checks[0].itemType,'appointment');
});

test('required and optional outside attendees are screened with appointment dialog and Review command', async () => {
  for(const field of ['requiredAttendees','optionalAttendees']) {
    const state=appointment({requiredAttendees:[person(KATE)],optionalAttendees:[],body:secret,[field]:[person(DAN)]}),l=load({state});
    const result=await l.send();
    assert.equal(result.allowEvent,false);assert.equal(result.commandId,'dgOpenMeetingPane');
    assert.match(result.errorMessage,/^This meeting invitation goes outside your company and includes a password\./);
    assert.equal(stored(l).findings[0].source,'body');
    assert.equal(l.checks[0][field==='requiredAttendees'?'to':'cc'][0].address,DAN.address);
    assert.deepEqual(l.checks[0].bcc,[]);
  }
});

test('meeting subject and location are screened independently; location findings cannot remove body text', async () => {
  for(const field of ['subject','location']) {
    const l=load({state:appointment({[field]:'Gate code is 4471.'})});
    assert.equal((await l.send()).allowEvent,false);
    const f=stored(l).findings[0];assert.equal(f.source,field);assert.equal(f.place,field==='location'?'In the location':'In the subject');
    assert.equal(f.removable,field==='subject');
  }
});

test('an outside room alone triggers content screening; internal rooms have no blanket exemption', async () => {
  const l=load({state:appointment({optionalAttendees:[],locations:[room('room@venue.example')],body:secret})});
  assert.equal((await l.send()).allowEvent,false);
  assert.ok(stored(l).recipients.some(r=>r.address==='room@venue.example'&&r.reach==='outside'&&r.field==='to'));
});

test('room duplicates do not mask attendee distribution lists; a room without an address is unknown', async () => {
  const l=load({state:appointment({requiredAttendees:[{...person(KATE),recipientType:'distributionList'}],optionalAttendees:[],locations:[room(KATE.address),room('')],body:secret})});
  assert.equal((await l.send()).allowEvent,false);
  assert.equal(l.checks[0].to.length,2);assert.equal(l.checks[0].to[0].kind,'group');
  assert.ok(stored(l).recipients.every(r=>r.reach==='unknown'));
  assert.match((await l.send()).errorMessage,/meeting invitation may go outside/);
});

test('room and custom enhanced location display text is screened even when absent from the legacy location string', async () => {
  for(const type of ['room','custom']) {
    const p={displayName:'Gate code is 4471.',emailAddress:type==='room'?'room@northline.example':'',locationIdentifier:{id:'loc',type}};
    const l=load({state:appointment({locations:[p],location:'North Hall'})});
    assert.equal((await l.send()).allowEvent,false);assert.equal(stored(l).findings[0].source,'location');
  }
});

test('resource enumeration failure cannot silently clear a meeting', async () => {
  const l=load({state:appointment({optionalAttendees:[]})});
  delete l.item.enhancedLocation;
  const r=await l.send();assert.equal(r.allowEvent,false);assert.match(r.errorMessage,/couldn't check this meeting invitation/);
});

test('changed required, optional or room attendees and changed location during checking hold unavailable', async () => {
  const changes=[s=>s.requiredAttendees.push(person(DAN)),s=>s.optionalAttendees.push(person(KATE)),s=>s.locations.push(room('room@venue.example')),s=>s.locations[0].locationIdentifier.id='replaced',s=>s.location='Changed location'];
  for(const change of changes) {
    const state=appointment({locations:[room()]}),l=load({state,check:async(d,o,original)=>{const r=await original(d,o);change(state);return r;}});
    const r=await l.send();assert.equal(r.allowEvent,false);assert.match(r.errorMessage,/couldn't check this meeting invitation/);
  }
});

test('a newly outside attendee on an inside-only meeting is caught by the release re-read', async () => {
  const state=appointment({optionalAttendees:[]}),l=load({state,check:async(d,o,original)=>{const r=await original(d,o);state.optionalAttendees.push(person(DAN));return r;}});
  assert.equal((await l.send()).allowEvent,false);
});

test('clean meeting clears; text attachments use the same local reader', async () => {
  assert.deepEqual(await load({state:appointment()}).send(),{allowEvent:true});
  const bytes=Buffer.from(secret),l=load({state:appointment({attachments:[{id:'text',name:'notes.txt',size:bytes.length,attachmentType:'file'}],contents:{text:bytes.toString('base64')}})});
  assert.equal((await l.send()).allowEvent,false);assert.equal(stored(l).findings[0].source,'attachment');
  assert.deepEqual(l.reads.content,['text']);
});

test('meeting OCR text is screened and cached empty OCR requires unchanged bytes at release', async () => {
  const bytes=Buffer.alloc(33);bytes.set([137,80,78,71,13,10,26,10]);bytes.writeUInt32BE(13,8);bytes.write('IHDR',12);bytes.writeUInt32BE(640,16);bytes.writeUInt32BE(360,20);
  const a={id:'image',name:'note.png',size:33,attachmentType:'file'};
  for(const [text,changed] of [[secret,false],['',false],['',true]]) {
    const state=appointment({attachments:[a],contents:{image:bytes.toString('base64')}});
    const cache=JSON.stringify({version:1,attachments:{image:{name:a.name,size:a.size,hash:sha256(bytes),status:'ready',text}}});
    const l=load({state,initialValues:{'dg-ocr-v1':cache},check:async(d,o,original)=>{const r=await original(d,o);if(changed){const replacement=Buffer.from(bytes);replacement.writeUInt32BE(641,16);state.contents.image=replacement.toString('base64');}return r;}});
    const r=await l.send();assert.equal(r.allowEvent,!text&&!changed);
    if(text) assert.equal(stored(l).findings[0].file,a.name);
    else assert.deepEqual(l.reads.content,['image','image']);
    if(changed) assert.match(r.errorMessage,/couldn't check this meeting invitation/);
  }
});

test('appointment prompt-only findings override Enforce only on 1.14; mixed findings keep the installed mode', async () => {
  for(const supported of [true,false]) for(const body of ['See you Tuesday.',secret]) {
    const l=load({supported,state:appointment({body,attachments:[{id:'photo',name:'photo.png',size:PNG_SIZE,attachmentType:'file'}],contents:{photo:PNG_B64}})});
    const r=await l.send();assert.equal(r.allowEvent,false);
    assert.equal(r.sendModeOverride,supported&&body!==secret?'promptUser':undefined);
    assert.match(r.errorMessage,/meeting invitation/);
    if(!supported) assert.match(r.errorMessage,/Open Disclosure Gate from the ribbon/);
  }
});

test('meeting exposed-list finding never tells the organizer to use Bcc', async () => {
  const people=Array.from({length:8},(_,i)=>({displayName:'Guest '+i,emailAddress:`guest${i}@${['clientco','apexbuild','cityworks'][i%3]}.example`,recipientType:'externalUser'}));
  const l=load({state:appointment({requiredAttendees:people,optionalAttendees:[]})}),r=await l.send();
  assert.equal(r.sendModeOverride,'promptUser');assert.match(stored(l).findings[0].why,/Everyone invited/);assert.doesNotMatch(stored(l).findings[0].why,/Bcc|To and Cc/);
});

test('mailbox profile decides inside for appointments, regardless of organizer or ExternalUser type', async () => {
  const l=load({state:appointment({organizer:person(DAN),requiredAttendees:[{...person(KATE),recipientType:'externalUser'}],optionalAttendees:[],body:secret})});
  assert.deepEqual(await l.send(),{allowEvent:true});
  const other=load({state:appointment({organizer:person(DAN),requiredAttendees:[person(DAN)],optionalAttendees:[],body:secret})});
  assert.equal((await other.send()).allowEvent,false);
});

test('appointment reader keeps all envelope and content Office reads within three concurrent calls', async () => {
  const l=load({state:appointment({body:secret})});let active=0,peak=0;
  const slow=(target,method)=>{const original=target[method];target[method]=(...args)=>{const cb=args.pop();active++;peak=Math.max(peak,active);original.call(target,...args,r=>setTimeout(()=>{active--;cb(r);},2));};};
  for(const key of ['organizer','requiredAttendees','optionalAttendees','enhancedLocation','subject','location']) slow(l.item[key],'getAsync');
  slow(l.item.body,'getAsync');slow(l.item.body,'getTypeAsync');slow(l.item,'getAttachmentsAsync');
  assert.equal((await l.send()).allowEvent,false);assert.equal(peak,3);
});

test('oversized meetings and refused completion customization keep appointment copy', async () => {
  const large=load({state:appointment({location:'x'.repeat(500001)})});
  const r=await large.send();assert.match(r.errorMessage,/couldn't check this meeting invitation\. It's too large to check/);assert.doesNotMatch(r.errorMessage,/Try Send again/);
  const held=await load({state:appointment({body:secret})}).send(o=>'commandId' in o);
  assert.match(held.errorMessage,/meeting invitation/);assert.equal(held.commandId,undefined);
  const clear=await load({state:appointment()}).send(o=>o.allowEvent);
  assert.match(clear.errorMessage,/couldn't check this meeting invitation/);
});
