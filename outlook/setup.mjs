import { generateManifest } from './manifest.mjs';
import { RELEASE_BASE_URL, RELEASE_ID } from './config.mjs';
const $=id=>document.getElementById(id);
$('base-url').value=RELEASE_BASE_URL;
$('addin-id').value=RELEASE_ID;
const describe=()=>{
  $('findings-help').textContent=$('findings').value==='ask'?'Ask suits most teams. Show the concern and let the sender choose Send Anyway or Review. This is the default.':"Hold suits teams whose policy requires a change before sending. Findings cannot be overridden, except two that only ask: an exposed recipient list and an attached picture it couldn't read.";
  $('failures-help').textContent=$('failures').value==='ask'?"Ask is the default. If a check fails or a file cannot be read, the sender can confirm its contents and choose Send Anyway, or cancel and press Send to check again.":"Hold keeps the item unsent when it cannot be checked. The sender can retry, edit it or ask IT.";
  $('model-help').textContent=$('model').value==='on'?'On is the default. A small model on each computer also looks for personal details, internal costs, negotiating position, insults and physical security however they are worded. On two test sets it had never seen, it caught 80 of 120 such disclosures (rules alone: 11) and asked about none of 540 everyday outside emails. It runs in Outlook on the web, the new Outlook and Outlook for Mac; classic Outlook for Windows uses the rules only. Nothing leaves the computer.':'Off: the rules alone check each email. They catch personal details, internal costs and insults only in common wordings (11 of 120 in testing).';
  $('mode-help').textContent=$('failures').value==='ask'?"If the add-in cannot load, Outlook offers Send Anyway or Try Later.":"If the add-in cannot load, Outlook holds the item.";
  $('hold-ask-help').hidden=!($('findings').value==='hold'&&$('failures').value==='ask');
  const mode=$('failures').value==='hold'?'Block':$('findings').value==='hold'?'SoftBlock':'PromptUser';
  $('technical-help').textContent=`Manifest SendMode: ${mode} for both Send events. Ask outcomes use sendModeOverride: 'promptUser' on Mailbox 1.14 or later. Before 1.14, SoftBlock and Block installations hold those outcomes too.`;
};
for(const key of ['findings','failures','model']) $(key).addEventListener('change',describe);describe();
$('setup-form').addEventListener('submit',event=>{
  event.preventDefault();$('setup-error').hidden=true;$('download-status').textContent='';
  try {
    const xml=generateManifest({baseUrl:$('base-url').value,findings:$('findings').value,failures:$('failures').value,model:$('model').value,internalDomains:$('domains').value.split(/[\s,;]+/).filter(Boolean),trustedDomains:$('trusted').value.split(/[\s,;]+/).filter(Boolean),version:$('version').value,id:$('addin-id').value});
    const url=URL.createObjectURL(new Blob([xml],{type:'text/xml'})),link=document.createElement('a');
    link.href=url;link.download='manifest.xml';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    $('download-status').textContent='Manifest downloaded. Upload it in the admin center.';
  } catch(error) {$('setup-error').textContent=error.message;$('setup-error').hidden=false;}
});
