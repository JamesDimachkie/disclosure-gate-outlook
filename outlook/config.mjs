// URL settings are public configuration, never email content. The only release-host constant.
import { normalizeDomains } from '../core/recipients.mjs';
import { settingsFor } from '../core/settings.mjs';
export const RELEASE_BASE_URL = 'https://jamesdimachkie.github.io/guardcell-outlook/';
export const DEV_ID = 'cf4aa3ad-2656-4bc5-a8c1-ae4734bf4b32';
export const RELEASE_ID = '15f4b69e-59f2-4f5a-ad8b-697db42b1d81';
export function validateConfig(value = {}) {
  let settings;
  try { settings = settingsFor(value); } catch { throw new Error('Choose Ask or Hold for findings and failures. Legacy mode must be warn or enforce.'); }
  const list = value.internalDomains ?? [];
  if (!Array.isArray(list)) throw new Error('Enter domain names separated by commas or spaces.');
  if (list.length > 40) throw new Error('Use at most 40 extra domains.');
  // Trusted outside domains: real partners whose domain resembles one of yours. They only skip the
  // lookalike warning; email to them is checked like any other outside email.
  const trusted = value.trustedDomains ?? [];
  if (!Array.isArray(trusted)) throw new Error('Enter domain names separated by commas or spaces.');
  if (trusted.length > 40) throw new Error('Use at most 40 trusted outside domains.');
  // The on-device model (personal details, internal costs, negotiating position, remarks, physical
  // access) is on unless IT turns it off. Tuned to catch rather than miss; on 2,000 held-out real
  // Enron emails (gate 6, 24 October 2026) the default caught 61 serious disclosures (rules alone: 19)
  // and asked about 35% of the emails.
  const model = value.model ?? 'on';
  if (!['on', 'off'].includes(model)) throw new Error('Choose On or Off for the on-device model.');
  return { ...settings, model, internalDomains: list.length ? [...normalizeDomains(list)] : [], trustedDomains: trusted.length ? [...normalizeDomains(trusted)] : [] };
}
export function parseConfigUrl(url) {
  if (typeof url !== 'string' || !url.includes('?')) return null;
  const pairs = url.split('?')[1].split('#')[0].split('&'), values = {};
  for (const pair of pairs) {
    const i = pair.indexOf('=');
    if(i < 0) { if(['dg','mode','findings','failures','domains','trusted','model'].includes(decodeURIComponent(pair))) throw new Error('Invalid configuration.'); continue; }
    const key=decodeURIComponent(pair.slice(0,i)), value=decodeURIComponent(pair.slice(i+1).replace(/\+/g,' '));
    if(['dg','mode','findings','failures','domains','trusted','model'].includes(key)) { if(Object.prototype.hasOwnProperty.call(values,key)) throw new Error('Duplicate configuration.'); values[key]=value; }
  }
  if(values.dg !== '2') return null;
  return validateConfig({mode:values.mode,findings:values.findings,failures:values.failures,model:values.model,internalDomains:(values.domains || '').split(',').filter(Boolean),trustedDomains:(values.trusted || '').split(',').filter(Boolean)});
}
export function configQuery(config) {
  const c=validateConfig(config);
  return '?dg=2&findings='+c.findings+'&failures='+c.failures+'&domains='+encodeURIComponent(c.internalDomains.join(','))+(c.trustedDomains.length ? '&trusted='+encodeURIComponent(c.trustedDomains.join(',')) : '')+(c.model==='off' ? '&model=off' : '');
}
// Admin settings come only from the manifest's URLs. Without them (classic Outlook before Mailbox
// 1.14 can't read its script URL), only the sender's own domain is inside: mail between an
// organization's other domains is then checked as outside. Nothing a user can write (roaming
// settings, the pane) widens what counts as inside.
export function runtimeConfig(office, root = globalThis) {
  let script;
  try { script=office.context.urls?.javascriptRuntimeUrl; } catch { /* Older client. */ }
  try {
    return parseConfigUrl(script) || parseConfigUrl(root.location?.href) || unknownSettings();
  } catch { return unknownSettings(); }
}
const unknownSettings = () => ({ ...validateConfig({findings:'hold',failures:'hold'}), settingsKnown: false });
