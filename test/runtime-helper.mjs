import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {JOHN,KATE,DAN,DEMO_BODY} from './helpers.mjs';
export const plain=v=>JSON.parse(JSON.stringify(v));
export const SOURCE=readFileSync(new URL('../dist/runtime.js',import.meta.url),'utf8');
export const person=p=>({displayName:p.name,emailAddress:p.address,recipientType:p.kind==='group'?'distributionList':'user'});
// Outlook on the web writes each typed line as its own <div>; its Text coercion then runs them together.
const asHtml=text=>String(text).split('\n').map(line=>'<div>'+(line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') || '<br>')+'</div>').join('');
export const demo=(extra={})=>({from:person(JOHN),to:[person(KATE)],cc:[person(DAN)],bcc:[],subject:'North Hall: CO 12',format:'html',body:DEMO_BODY,attachments:[],...extra});
export const appointment=(extra={})=>({itemType:'appointment',organizer:person(JOHN),requiredAttendees:[person(KATE)],optionalAttendees:[person(DAN)],locations:[],location:'North Hall',subject:'Site visit',format:'text',body:'See you Tuesday.',attachments:[],...extra});
export function load({state=demo(),supported=true,markdown=false,url='https://static.example/sub/runtime.js?dg=2&mode=enforce&domains=',location,settings,check,globals={},initialValues={},modernRegex=false,source=SOURCE}={}) {
  const ok=value=>({status:'succeeded',value}), reads={content:[],body:0},calls=[],values={...initialValues},handlers={};let handler;
  const field=key=>({getAsync:cb=>cb(ok(state[key]))});
  const envelope=state.itemType==='appointment'?{itemType:'appointment',organizer:field('organizer'),requiredAttendees:field('requiredAttendees'),optionalAttendees:field('optionalAttendees'),location:field('location'),enhancedLocation:field('locations')}:{from:field('from'),to:field('to'),cc:field('cc'),bcc:field('bcc')};
  const item={...envelope,subject:field('subject'),
    body:{getTypeAsync:cb=>cb(ok(state.format)),getAsync:(type,cb)=>{reads.body++;cb(ok(type==='html' ? state.html ?? asHtml(state.body) : state.body));}},
    getAttachmentsAsync:cb=>cb(ok(state.attachments)),
    getAttachmentContentAsync:(id,cb)=>{reads.content.push(id);cb(ok({format:'base64',content:state.contents?.[id]||''}));},
    sessionData:{setAsync:(k,v,cb)=>{values[k]=v;cb?.(ok());},getAsync:(k,cb)=>cb(ok(values[k]))}};
  const office={context:{mailbox:{item,userProfile:{emailAddress:JOHN.address}},requirements:{isSetSupported:(_name,version)=>version==='1.14'&&supported || version==='1.15'&&markdown},
    urls:url?{javascriptRuntimeUrl:url}:undefined,roamingSettings:{get:()=>settings}},actions:{associate:(name,fn)=>{calls.push(name);handlers[name]=fn;handler=fn;}},onReady:()=>calls.push('ready')};
  const context=vm.createContext({Office:office,setTimeout,clearTimeout,location,...globals});
  // Outlook on the web's runtime frame replaces these (seen live, 24 October 2026); positions are ignored.
  vm.runInContext("String.prototype.startsWith=function(a){return this.substr(0,a.length)===a};String.prototype.endsWith=function(a){return this.substr(this.length-a.length)===a};String.prototype.trim=function(){return this.replace(/^\\s+|\\s+$/g,'')};",context);
  if(!modernRegex) vm.runInContext("var NativeRegExp=RegExp; this.RegExp=function(s,f){if((f||'').indexOf('d')>=0||String(s).indexOf('(?<')>=0||String(s).indexOf('\\\\p{')>=0)throw new Error('modern regex');return new NativeRegExp(s,f);};this.RegExp.prototype=NativeRegExp.prototype;",context);
  vm.runInContext('delete Object.entries; delete Object.values; delete Object.fromEntries; delete String.prototype.matchAll; delete String.prototype.padStart; delete Array.prototype.flat; delete Array.prototype.flatMap; delete this.globalThis;',context);
  vm.runInContext(source,context);
  const core=context.GuardcellCore,original=core.checkDraft,checks=[];
  core.checkDraft=(d,o)=>{checks.push(plain(d));return check?check(d,o,original):original(d,o);};
  const send=refuse=>new Promise(resolve=>handlers[state.itemType==='appointment'?'onAppointmentSendHandler':'onMessageSendHandler']({completed:o=>{if(refuse?.(o))throw new Error('options refused');resolve(plain(o));}}));
  return {send,item,values,reads,calls,checks,office,context,handlers,api:context.GuardcellHandler,draftApi:context.GuardcellDraft,core};
}
