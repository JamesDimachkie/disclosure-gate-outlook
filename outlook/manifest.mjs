import { TEMPLATE } from './manifest-template.mjs';
import { RELEASE_BASE_URL, RELEASE_ID, configQuery, validateConfig } from './config.mjs';
const escapeXml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function manifestOptions({baseUrl=RELEASE_BASE_URL,mode,findings,failures,model,internalDomains=[],trustedDomains=[],version='2.1.0.0',id=RELEASE_ID}={}) {
  const url=new URL(baseUrl);
  if(url.protocol!=='https:' || url.username || url.password || url.search || url.hash) throw new Error('Use an HTTPS base URL without a query or fragment.');
  // The base is the folder the files are in. A page address (…/setup.html) would make every asset URL wrong.
  if(/\.(?:html?|js|xml|css|png)$/i.test(url.pathname)) throw new Error('Enter the folder address, not a page: for example https://example.org/addin/.');
  url.pathname=url.pathname.replace(/\/?$/,'/');
  if(!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) throw new Error('Enter a valid add-in Id.');
  if(!/^\d+\.\d+\.\d+\.\d+$/.test(version)||version.split('.').some(n=>Number(n)>65535)||version==='0.0.0.0') throw new Error('Use a four-part version such as 2.0.0.0.');
  return {baseUrl:url.href,version,id,...validateConfig({mode,findings,failures,model,internalDomains,trustedDomains})};
}
export function generateManifest(options={}) {
  const o=manifestOptions(options), query=configQuery(o);
  const values={ID:o.id,VERSION:o.version,BASE:o.baseUrl,QUERY:query,SEND_MODE:o.failures==='hold'?'Block':o.findings==='hold'?'SoftBlock':'PromptUser'};
  for(const p of ['commands.html','runtime.js','taskpane.html']) if((o.baseUrl+p+query).length>2048) throw new Error('The configured URL is too long. Use fewer domains.');
  return TEMPLATE.replace(/\{\{([A-Z_]+)\}\}/g,(_,key)=>escapeXml(values[key]));
}
