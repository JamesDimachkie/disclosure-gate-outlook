// Recipient problems (spec §5.8), as pure functions over the classified recipients.
//
// Lookalike domain: an outside address whose domain is dressed up as an inside one. Each outside domain
// is compared with every inside domain on its registrable label (the name before the public suffix:
// "northline" in mail.northline.co.uk), and it is a lookalike when one of these holds:
//   1. the whole inside domain followed by more labels (northline.com.evil.io, northline.com.co), a
//      name nobody but the organization should be using;
//   2. the same label under another suffix (northline.co, northline.com.au for northline.com);
//   3. the same skeleton: after decoding punycode, folding accents and mapping look-alike characters
//      (1/l/I, 0/o, rn/m, vv/w, cl/d, Cyrillic and Greek letters that look Latin) the labels are equal
//      though the written ones differ (north1ine, nоrthline with a Cyrillic о, xn--...);
//   4. one or two characters changed, added, removed or swapped (Damerau-Levenshtein on the label or on
//      its skeleton): at most 2 for a label of 6 or more characters, at most 1 for 4 or 5. A label of 3
//      or fewer characters gets no edit rule at all: one edit away from "abc" are hundreds of real
//      companies, so only rules 1 to 3 apply to it. Two plain letter substitutions in a label of the
//      same length are not enough on their own: that is how a different word is spelled (southline,
//      northside for northline), not how a name is imitated. Two edits count when one of them is a
//      look-alike character (the skeletons are one edit apart), or they add, drop or swap letters
//      (northlinne, nortlhine, nrothline);
//   5. the inside name with an impersonation word joined on (northline-billing.com, securenorthline.com,
//      northline-support.com). Corporate-structure words (group, holdings, inc, usa, uk, homes,
//      construction) are deliberately not on the list: northline-group.com is as likely to be the parent
//      company or a real namesake as an impostor, and a false stop is a failure (§5). The listed words
//      are the ones phishing kits put next to a stolen name to make an invoice or a login look routine.
// An inside domain, its subdomains and its parents are never lookalikes of it (§4 already makes a
// subdomain outside; that is a reach question, not an impersonation one). Well-known mail providers are
// never lookalikes either, so gmail.com cannot match a company called "gmall".
//
// Exposed list: 8 or more outside addresses in To and Cc together, from 3 or more outside domains. The
// one finding with severity 'prompt' (the sender may still send); every other finding is 'stop'.
//
// Plain JavaScript only: this runs inside Outlook.

// Two-part public suffixes common in business mail; anything else is treated as a one-label suffix.
const TWO_PART_SUFFIXES = new Set([
  'co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'ltd.uk', 'plc.uk', 'me.uk', 'net.uk', 'sch.uk', 'nhs.uk',
  'com.au', 'net.au', 'org.au', 'edu.au', 'gov.au', 'co.nz', 'org.nz', 'net.nz', 'govt.nz',
  'co.za', 'org.za', 'com.br', 'net.br', 'org.br', 'co.jp', 'ne.jp', 'or.jp', 'com.mx', 'com.ar', 'com.co',
  'com.sg', 'com.hk', 'com.tr', 'co.in', 'co.il', 'co.kr', 'com.my', 'com.ph', 'co.id', 'com.pk', 'com.ng',
  'com.eg', 'com.sa', 'com.tw', 'co.th', 'com.vn', 'com.pe', 'com.ua', 'co.ke', 'com.gh',
]);

// Mail providers whose domains are real and everywhere; never a lookalike of anyone.
const PROVIDERS = new Set(['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'hotmail.co.uk', 'live.com', 'msn.com', 'yahoo.com', 'yahoo.co.uk',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'proton.me', 'protonmail.com', 'pm.me', 'gmx.com', 'gmx.de', 'gmx.net', 'web.de', 'mail.com', 'zoho.com',
  'fastmail.com', 'hey.com', 'yandex.com', 'comcast.net', 'verizon.net', 'att.net', 'btinternet.com', 'sky.com', 'orange.fr', 'free.fr', 't-online.de']);

const IMPERSONATION_WORDS = ['secure', 'security', 'login', 'signin', 'verify', 'verification', 'account', 'accounts', 'billing', 'invoice', 'invoices',
  'payment', 'payments', 'pay', 'payroll', 'remit', 'remittance', 'support', 'helpdesk', 'help', 'it', 'hr', 'mail', 'email', 'webmail', 'portal',
  'docs', 'documents', 'share', 'sharepoint', 'onedrive', 'office365', 'o365', 'microsoft', 'admin', 'update', 'service', 'services', 'online', 'notify', 'alert', 'alerts'];

// Look-alike letters from other scripts and Latin extensions, folded to the Latin letter they imitate.
const CONFUSABLE = new Map(Object.entries({
  // Cyrillic
  'а': 'a', 'е': 'e', 'ё': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x', 'і': 'i', 'ї': 'i', 'ј': 'j', 'ѕ': 's', 'ԁ': 'd', 'һ': 'h',
  'ӏ': 'l', 'ԛ': 'q', 'ԝ': 'w', 'к': 'k', 'м': 'm', 'т': 't', 'в': 'b', 'н': 'h', 'п': 'n', 'г': 'r', 'ү': 'y', 'ɡ': 'g',
  // Greek
  'α': 'a', 'ο': 'o', 'ρ': 'p', 'ν': 'v', 'ι': 'i', 'κ': 'k', 'τ': 't', 'υ': 'u', 'ε': 'e', 'χ': 'x', 'ϲ': 'c', 'ω': 'w', 'η': 'n', 'β': 'b', 'μ': 'u',
  // Latin extensions and symbols
  'ı': 'i', 'ɩ': 'i', 'ℓ': 'l', 'ł': 'l', 'ø': 'o', 'đ': 'd', 'ħ': 'h', 'ŀ': 'l', 'ß': 'b', 'ɑ': 'a',
}));

// ---------- punycode (RFC 3492), decode only ----------

const BASE = 36, T_MIN = 1, T_MAX = 26, SKEW = 38, DAMP = 700;
function adapt(delta, points, first) {
  delta = first ? Math.floor(delta / DAMP) : delta >> 1;
  delta += Math.floor(delta / points);
  let k = 0;
  while (delta > ((BASE - T_MIN) * T_MAX) >> 1) { delta = Math.floor(delta / (BASE - T_MIN)); k += BASE; }
  return k + Math.floor(((BASE - T_MIN + 1) * delta) / (delta + SKEW));
}
// One punycode label (without "xn--") to Unicode, or null if it is malformed.
export function punycodeDecode(input) {
  const out = [];
  const basic = Math.max(0, input.lastIndexOf('-'));
  for (let j = 0; j < basic; j++) { const c = input.charCodeAt(j); if (c >= 0x80) return null; out.push(c); }
  let n = 128, bias = 72, i = 0;
  for (let index = basic > 0 ? basic + 1 : 0; index < input.length;) {
    const oldi = i;
    let w = 1;
    for (let k = BASE; ; k += BASE) {
      if (index >= input.length) return null;
      const c = input.charCodeAt(index++);
      const digit = c >= 48 && c <= 57 ? c - 22 : c >= 65 && c <= 90 ? c - 65 : c >= 97 && c <= 122 ? c - 97 : BASE;
      if (digit >= BASE) return null;
      i += digit * w;
      const t = k <= bias ? T_MIN : k >= bias + T_MAX ? T_MAX : k - bias;
      if (digit < t) break;
      w *= BASE - t;
      if (w > 1e9) return null;
    }
    const len = out.length + 1;
    bias = adapt(i - oldi, len, oldi === 0);
    n += Math.floor(i / len);
    i %= len;
    if (n > 0x10ffff) return null;
    out.splice(i++, 0, n);
  }
  return String.fromCodePoint(...out);
}

// A domain as people read it: lowercase, punycode labels decoded.
export function unicodeDomain(domain) {
  return String(domain || '').trim().toLowerCase().replace(/\.$/, '').split('.')
    .map((label) => (label.startsWith('xn--') ? punycodeDecode(label.slice(4)) ?? label : label)).join('.');
}

// {label, suffix, registrable} for a (decoded) domain.
export function splitDomain(domain) {
  const labels = domain.split('.').filter(Boolean);
  if (labels.length < 2) return { label: labels[0] || '', suffix: '', registrable: labels[0] || '' };
  const two = labels.slice(-2).join('.');
  const suffixLen = labels.length >= 3 && TWO_PART_SUFFIXES.has(two) ? 2 : 1;
  const suffix = labels.slice(-suffixLen).join('.');
  const label = labels[labels.length - suffixLen - 1];
  return { label, suffix, registrable: `${label}.${suffix}` };
}

// The look-alike skeleton of a label: accents dropped, other scripts folded to Latin, then the digit and
// letter-pair imitations of the spec (1/l/I, 0/o, rn/m, vv/w, cl/d).
export function skeleton(label) {
  let s = String(label).normalize('NFKD').replace(/\p{M}+/gu, '').toLowerCase();
  s = [...s].map((ch) => CONFUSABLE.get(ch) ?? ch).join('');
  return s.replace(/[1i|]/g, 'l').replace(/0/g, 'o').replace(/rn/g, 'm').replace(/vv/g, 'w').replace(/cl/g, 'd');
}

// Optimal-string-alignment Damerau-Levenshtein distance, stopping early once it passes `max`.
export function editDistance(a, b, max = Infinity) {
  a = [...a]; b = [...b];
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2 = null, prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev; prev = cur;
  }
  return prev[b.length];
}

const editAllowance = (len) => (len >= 6 ? 2 : len >= 4 ? 1 : 0);
// Same length and exactly two positions differ: two letters changed in place, nothing added or swapped.
function twoSubstitutions(a, b) {
  a = [...a]; b = [...b];
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
  return diff === 2;
}
const related = (a, b) => a === b || a.endsWith('.' + b) || b.endsWith('.' + a);

// Why `domain` looks like the inside domain `inside`, or null: 'extended' | 'suffix' | 'homoglyph' |
// 'typo' | 'affix' (rules 1 to 5 above).
export function lookalikeReason(domain, inside) {
  const d = unicodeDomain(domain), i = unicodeDomain(inside);
  if (!d || !i || related(d, i)) return null;
  const D = splitDomain(d), I = splitDomain(i);
  if (PROVIDERS.has(D.registrable) || PROVIDERS.has(d)) return null;
  if (D.registrable === I.registrable) return null; // sister subdomains of one registered name
  if (D.label && D.label === I.label) return D.suffix !== I.suffix ? 'suffix' : null;
  if (d.startsWith(i + '.')) return 'extended';
  if (!I.label || !D.label) return null;
  const sd = skeleton(D.label), si = skeleton(I.label);
  if (sd === si) return 'homoglyph';
  const allow = editAllowance([...I.label].length);
  if (allow) {
    const raw = editDistance(D.label, I.label, allow), skel = editDistance(sd, si, allow);
    if (Math.min(raw, skel) <= 1) return 'typo';
    if (allow === 2 && Math.min(raw, skel) === 2 && !(twoSubstitutions(D.label, I.label) && twoSubstitutions(sd, si))) return 'typo';
  }
  if (I.label.length >= 4) {
    for (const w of IMPERSONATION_WORDS) {
      if (sd === `${si}-${skeleton(w)}` || sd === `${skeleton(w)}-${si}` || sd === si + skeleton(w) || sd === skeleton(w) + si) return 'affix';
    }
  }
  return null;
}

const domainOf = (address) => { const at = String(address || '').lastIndexOf('@'); return at > 0 ? address.slice(at + 1) : ''; };

// The short list a finding shows in place of a sentence: up to three addresses, then "and N more".
export function shortList(addresses, more = '{list} and {n} more') {
  if (addresses.length <= 3) return addresses.join(', ');
  return more.replace('{list}', addresses.slice(0, 3).join(', ')).replace('{n}', String(addresses.length - 3));
}

const finding = (subkind, severity, recipients, text, extra = {}) => ({ category: 'recipient', subkind, source: 'recipient', severity, recipients, ...extra,
  sentence: { text, index: -1, occurrence: 0, start: 0, end: text.length }, marks: [], found_by: 'recipients' });

// The recipient findings for one draft: `recipients` as classifyRecipients returns them ({field,
// address, reach}), `insideDomains` the normalized inside list. At most one lookalike finding (naming
// every lookalike address and the inside domains they imitate) and one exposed-list finding.
// `trusted` lists outside domains an admin vouched for: they skip only the lookalike check.
export function recipientFindings(recipients, insideDomains, { more, trusted = [] } = {}) {
  const out = [];
  const lookalikes = [], resembles = new Set();
  for (const r of recipients || []) {
    if (r.reach === 'inside') continue;
    const domain = domainOf(r.address);
    if (!domain || trusted.includes(domain)) continue;
    let hit = false;
    for (const inside of insideDomains) if (lookalikeReason(domain, inside)) { resembles.add(inside); hit = true; }
    if (hit && !lookalikes.includes(r.address)) lookalikes.push(r.address);
  }
  if (lookalikes.length) out.push(finding('lookalike', 'stop', lookalikes, shortList(lookalikes, more), { resembles: [...resembles] }));
  const visible = [], domains = new Set();
  for (const r of recipients || []) {
    if (r.reach !== 'outside' || (r.field !== 'to' && r.field !== 'cc')) continue;
    const address = String(r.address).toLowerCase();
    if (visible.includes(address)) continue;
    visible.push(address);
    domains.add(domainOf(address));
  }
  if (visible.length >= 8 && domains.size >= 3) out.push(finding('exposed', 'prompt', visible, shortList(visible, more)));
  return out;
}
