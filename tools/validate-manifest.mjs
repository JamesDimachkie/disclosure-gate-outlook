// Offline structural validation only. No online validator and no upload.
import { DOMParser } from '@xmldom/xmldom';
export function validateManifest(xml) {
  const errors=[];
  const doc=new DOMParser({onError:(level,message)=>errors.push(level+': '+message)}).parseFromString(xml,'text/xml');
  const nodes=name=>Array.from(doc.getElementsByTagName('*')).filter(n=>n.localName===name);
  if(errors.length || doc.documentElement.localName!=='OfficeApp') throw new Error('Malformed manifest: '+errors.join('; '));
  for(const name of ['Id','Version','Hosts','Requirements','Permissions','FormSettings','VersionOverrides','Runtimes','Runtime','Resources','LaunchEvents']) if(!nodes(name).length) throw new Error('Missing '+name);
  if(!/^[\da-f-]{36}$/i.test(nodes('Id')[0].textContent)) throw new Error('Invalid Id');
  const urls=nodes('Url');
  const resources=new Map(urls.map(n=>[n.getAttribute('id'),n.getAttribute('DefaultValue')]));
  for(const n of Array.from(doc.getElementsByTagName('*'))) {
    if(n.hasAttribute('resid') && !Array.from(doc.getElementsByTagName('*')).some(r=>r.getAttribute('id')===n.getAttribute('resid'))) throw new Error('Missing resource '+n.getAttribute('resid'));
    const value=n.getAttribute('DefaultValue');
    if((n.localName==='Url'||n.localName.endsWith('Url')||n.localName==='SourceLocation'||n.localName==='Image') && value) {
      if(new URL(value).protocol!=='https:') throw new Error('Non-HTTPS URL');
    }
  }
  const runtime=nodes('Runtime')[0], override=nodes('Override').find(n=>n.getAttribute('type')==='javascript');
  if(!override||override.parentNode!==runtime||!resources.get(override.getAttribute('resid'))?.includes('/runtime.js?')) throw new Error('Missing classic script override');
  const events=['OnMessageSend','OnAppointmentSend'].map((type,i)=>{
    const matches=nodes('LaunchEvent').filter(n=>n.getAttribute('Type')===type);
    if(matches.length!==1||matches[0].getAttribute('FunctionName')!==['onMessageSendHandler','onAppointmentSendHandler'][i]||!['PromptUser','SoftBlock','Block'].includes(matches[0].getAttribute('SendMode'))) throw new Error('Missing or duplicate Send event or mode: '+type);
    return matches[0];
  });
  const event=events[0];
  if(events[1].getAttribute('SendMode')!==event.getAttribute('SendMode')||events[1].parentNode!==event.parentNode) throw new Error('Send events differ in mode or runtime');
  const launch=event.parentNode.parentNode;
  if(!Array.from(launch.childNodes).some(n=>n.localName==='SourceLocation'&&n.getAttribute('resid')===runtime.getAttribute('resid'))) throw new Error('Send runtime differs');
  for(const [surface,id] of [['MessageComposeCommandSurface','dgOpenPane'],['AppointmentOrganizerCommandSurface','dgOpenMeetingPane']]) {
    const extension=nodes('ExtensionPoint').find(n=>n.getAttribute('xsi:type')===surface);
    const command=extension&&Array.from(extension.getElementsByTagName('Control')).find(n=>n.getAttribute('id')===id);
    if(!command||!Array.from(command.getElementsByTagName('Action')).some(n=>n.getAttribute('xsi:type')==='ShowTaskpane')) throw new Error('Missing Review command: '+surface);
  }
  const ids=nodes('Control').map(n=>n.getAttribute('id'));
  if(new Set(ids).size!==ids.length) throw new Error('Duplicate command id');
  const query=new URL(resources.get(override.getAttribute('resid'))).search;
  for(const id of ['Runtime.Url','Taskpane.Url']) if(new URL(resources.get(id)).search!==query) throw new Error('Runtime settings differ');
  return {id:nodes('Id')[0].textContent,mode:event.getAttribute('SendMode'),urls:urls.length};
}
