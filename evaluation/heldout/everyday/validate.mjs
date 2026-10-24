// Structural checks for the everyday tier. Reads only this directory: cases.jsonl and README.md.
// Never imports the checker. Usage: node evaluation/heldout/everyday/validate.mjs [--write-receipt]
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const directory = path.dirname(fileURLToPath(import.meta.url));
const categories = ['secrets','payment','government_id','personal','economics','negotiation','remark','lookalike','exposed_list','file','none'];
const phishingWords = ['secure','security','login','signin','verify','verification','account','accounts','billing','invoice','invoices','payment','payments','pay','payroll','remit','remittance','support','helpdesk','help','it','hr','mail','email','webmail','portal','docs','documents','share','sharepoint','onedrive','office365','o365','microsoft','admin','update','service','services','online','notify','alert','alerts'];
const MAX_ATTACHMENT_CASES = 15;

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); return condition; };
const domainOf = address => address.slice(address.lastIndexOf('@') + 1).toLowerCase();
const nameOf = domain => domain.replace(/\.(example|test)$/, '').split('.').pop();

function editDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i-1] === b[j-2] && a[i-2] === b[j-1]) d[i][j] = Math.min(d[i][j], d[i-2][j-2] + 1);
  }
  return d[a.length][b.length];
}

// Conservative author screen for §5.8 lookalikes: any outside domain whose name is close to an inside name fails.
function looksAlike(insideName, outsideDomain, insideDomains) {
  const outside = nameOf(outsideDomain);
  if (insideDomains.some(d => outsideDomain.endsWith('.' + d) || d.endsWith('.' + outsideDomain))) return false;
  const plain = s => s.replace(/[^a-z0-9]/g, '');
  const a = plain(insideName), b = plain(outside);
  if (a === b) return true;
  const limit = a.length >= 6 ? 2 : a.length >= 4 ? 1 : 0;
  if (editDistance(a, b) <= limit) return true;
  if (a.length >= 4) for (const w of phishingWords) if (b === a + w || b === w + a) return true;
  return false;
}

const raw = await fs.readFile(path.join(directory, 'cases.jsonl'), 'utf8');
const readme = await fs.readFile(path.join(directory, 'README.md'), 'utf8');
check(raw.endsWith('\n') && !raw.includes('\r'), 'cases.jsonl must use LF line endings and end with a newline');
const lines = raw.trimEnd().split('\n');
const cases = [];
lines.forEach((line, i) => { try { cases.push(JSON.parse(line)); } catch { failures.push(`Invalid JSON on line ${i + 1}`); } });

const ids = new Set(), bodies = new Set(), subjects = new Set();
const counts = Object.fromEntries(categories.map(c => [c, { stop: 0, prompt: 0, pass: 0 }]));
let attachmentCases = 0;
cases.forEach((c, i) => {
  const at = c.id ?? `line ${i + 1}`;
  check(c.id === `everyday-${String(i + 1).padStart(3, '0')}`, `${at}: ids must run everyday-001 upward in order`);
  check(/^[a-z_]+-\d{3}$/.test(c.id) && !ids.has(c.id), `${at}: invalid or repeated id`); ids.add(c.id);
  check(c.category_expected === 'none' && c.expect === 'pass', `${at}: every everyday case is none/pass`);
  if (categories.includes(c.category_expected) && ['stop','prompt','pass'].includes(c.expect)) counts[c.category_expected][c.expect]++;
  check(typeof c.why === 'string' && /SPEC §5/.test(c.why) && !/[\r\n]/.test(c.why), `${at}: why must be one line citing SPEC §5`);
  check(typeof c.industry === 'string' && c.industry.length > 0, `${at}: missing industry`);
  check(['UK','US','AU'].includes(c.english), `${at}: english must be UK, US or AU`);
  const d = c.draft;
  if (!check(d && typeof d === 'object', `${at}: missing draft`)) return;
  check(typeof d.from?.address === 'string' && /^[^@\s]+@[^@\s]+$/.test(d.from.address) && typeof d.from.name === 'string', `${at}: invalid sender`);
  const own = domainOf(d.from?.address ?? '');
  check(own.includes('.'), `${at}: internal domain is not derivable`);
  check(!c.internal_domains || (Array.isArray(c.internal_domains) && c.internal_domains.every(x => typeof x === 'string' && /^[a-z0-9.-]+$/i.test(x))), `${at}: invalid internal_domains`);
  const inside = [own, ...(c.internal_domains ?? []).map(x => x.toLowerCase())];
  for (const field of ['to','cc','bcc']) check(Array.isArray(d[field]) && d[field].every(r => typeof r.name === 'string' && typeof r.address === 'string' && /^[^@\s]+@[^@\s]+$/.test(r.address) && ['person','group'].includes(r.kind)), `${at}: invalid ${field} recipients`);
  const all = ['to','cc','bcc'].flatMap(f => Array.isArray(d[f]) ? d[f] : []);
  for (const address of [d.from?.address ?? '', ...all.map(r => r.address)]) check(/\.(example|test)$/i.test(domainOf(address)), `${at}: ${address} is not on a reserved .example/.test domain`);
  const outside = all.filter(r => !inside.includes(domainOf(r.address)));
  check(outside.length > 0, `${at}: no outside recipient`);
  const visibleOutside = [...(d.to ?? []), ...(d.cc ?? [])].filter(r => !inside.includes(domainOf(r.address)));
  check(visibleOutside.length < 8 || new Set(visibleOutside.map(r => domainOf(r.address))).size < 3, `${at}: To/Cc meets the §5.8 exposed-list threshold`);
  for (const r of outside) check(!inside.some(dom => looksAlike(nameOf(dom), domainOf(r.address), inside)), `${at}: ${domainOf(r.address)} resembles an inside domain`);
  check(typeof d.subject === 'string' && d.subject.length > 0 && d.body?.format === 'text' && typeof d.body.text === 'string' && d.body.text.length > 0, `${at}: invalid text draft`);
  check(!bodies.has(d.body?.text), `${at}: repeated body`); bodies.add(d.body?.text);
  check(!subjects.has(d.subject), `${at}: repeated subject`); subjects.add(d.subject);
  if (!check(Array.isArray(d.attachments), `${at}: missing attachments array`)) return;
  if (d.attachments.length) attachmentCases++;
  const attachmentIds = new Set();
  for (const a of d.attachments) {
    check(typeof a.id === 'string' && !attachmentIds.has(a.id), `${at}: repeated attachment id`); attachmentIds.add(a.id);
    const canonical = typeof a.content === 'string' && Buffer.from(a.content, 'base64').toString('base64') === a.content;
    check(canonical, `${at}: noncanonical base64`);
    const bytes = Buffer.from(a.content ?? '', 'base64');
    check(Number.isSafeInteger(a.size) && a.size >= 0 && bytes.length === a.size, `${at}: attachment size mismatch`);
    check(typeof a.name === 'string' && /\.(txt|csv)$/.test(a.name) && a.isInline === false && a.type === 'file', `${at}: invalid file attachment`);
    check(new TextDecoder('utf-8', { fatal: true }).decode(bytes).length > 0, `${at}: attachment is not readable UTF-8 text`);
  }
});
check(attachmentCases <= MAX_ATTACHMENT_CASES, `more than ${MAX_ATTACHMENT_CASES} cases carry attachments`);

for (const category of categories) {
  const row = readme.split(/\r?\n/).find(line => line.startsWith(`| ${category} |`));
  if (!check(row, `README: missing ${category} row`)) continue;
  const n = row.split('|').slice(2, 6).map(x => Number(x.trim()));
  const c = counts[category];
  check(n[0] === c.stop && n[1] === c.prompt && n[2] === c.pass && n[3] === c.stop + c.prompt + c.pass, `README: ${category} row differs from cases.jsonl`);
}
const totalRow = readme.split(/\r?\n/).find(line => line.startsWith('| **Total** |'));
if (check(totalRow, 'README: missing Total row')) {
  const t = totalRow.split('|').slice(2, 6).map(x => Number(x.trim().replaceAll('*', '')));
  check(t[0] === 0 && t[1] === 0 && t[2] === cases.length && t[3] === cases.length, 'README: Total row differs from cases.jsonl');
}

const lengths = cases.map(c => c.draft?.body?.text?.length ?? 0).sort((a, b) => a - b);
const quantile = q => { const p = (lengths.length - 1) * q, lo = Math.floor(p), hi = Math.ceil(p); return Math.round(lengths[lo] + (lengths[hi] - lengths[lo]) * (p - lo)); };
const tally = key => Object.fromEntries(Object.entries(cases.reduce((m, c) => (m[c[key]] = (m[c[key]] ?? 0) + 1, m), {})).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
const stats = {
  body_characters: { min: lengths[0], p25: quantile(0.25), median: quantile(0.5), p75: quantile(0.75), max: lengths.at(-1), mean: Math.round(lengths.reduce((s, x) => s + x, 0) / lengths.length) },
  under_300: lengths.filter(x => x < 300).length,
  from_600_to_1500: lengths.filter(x => x >= 600 && x <= 1500).length,
  over_2000: lengths.filter(x => x > 2000).length,
};
const sha256 = createHash('sha256').update(raw).digest('hex');

if (failures.length) {
  for (const f of failures) console.error('FAIL ' + f);
  console.error(`${failures.length} check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log(`Everyday tier valid: ${cases.length} cases, ${attachmentCases} with attachments; SHA-256 ${sha256}`);
  console.log(`Body characters: ${JSON.stringify(stats)}`);
  if (process.argv.includes('--write-receipt')) {
    const receipt = {
      tier: 'everyday', validated_on: new Date().toISOString().slice(0, 10), node: process.version,
      cases_sha256: sha256, total: cases.length, composition: { none: counts.none },
      attachment_cases: attachmentCases, length: stats, english: tally('english'), industries: tally('industry'),
      checks: ['run.mjs schema and README table', 'none/pass on every case', 'sequential unique ids', 'unique bodies and subjects', 'reserved .example/.test domains', 'at least one outside recipient', 'below the §5.8 exposed-list threshold', 'no outside domain resembling an inside domain', 'canonical base64, exact size, readable UTF-8 txt/csv, isInline false, type file', `at most ${MAX_ATTACHMENT_CASES} attachment cases`],
    };
    await fs.writeFile(path.join(directory, 'validation.json'), JSON.stringify(receipt, null, 2) + '\n', 'utf8');
    console.log('Wrote validation.json');
  }
}
