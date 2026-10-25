// Validator for everyday7a. No dependencies. It mirrors the runner's schema checks without running the runner.
// Usage: node validate.mjs [--checkpoint] [--stats]
//   --checkpoint  partial set: quotas and README agreement are reported, not enforced
//   --stats       also print length statistics, placement, industry and variant counts for the README
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const checkpoint = process.argv.includes('--checkpoint');
const wantStats = process.argv.includes('--stats');
const categories = ['secrets', 'payment', 'government_id', 'personal', 'economics', 'negotiation', 'remark', 'lookalike', 'exposed_list', 'file', 'none'];
const stopCategories = ['secrets', 'personal', 'economics', 'negotiation', 'remark'];
const sectionOf = { secrets: '5.1', personal: '5.4', economics: '5.5', negotiation: '5.6', remark: '5.7' };
const DIMS = ['implicit', 'buried', 'unlabelled', 'casual', 'hedged'];
const MESSY = ['banter', 'forward', 'chain', 'emotion', 'terse', 'footer'];
const PLACEMENTS = ['body', 'subject', 'quoted'];
const VARIANTS = ['us', 'uk', 'au', 'in', 'ie', 'ca', 'other'];
const errors = [];
const fail = (id, message) => errors.push(`${id}: ${message}`);

const raw = fs.readFileSync(path.join(dir, 'cases.jsonl'), 'utf8');
const sha256 = createHash('sha256').update(raw).digest('hex');
const cases = raw.trimEnd().split(/\r?\n/).map((line, i) => {
  try { return JSON.parse(line); } catch { errors.push(`line ${i + 1}: invalid JSON`); return null; }
}).filter(Boolean);
if (raw.includes('\r')) errors.push('cases.jsonl contains a carriage return');

const words = (text) => (text.match(/\S+/g) ?? []).length;
const domainOf = (address) => address.slice(address.lastIndexOf('@') + 1).toLowerCase();
const labelOf = (domain) => domain.replace(/\.(example|test)$/, '');
function distance(a, b) {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return m[a.length][b.length];
}
const lookalikeWords = ['secure', 'security', 'login', 'signin', 'verify', 'account', 'billing', 'invoice', 'payment', 'pay', 'payroll', 'support', 'help', 'mail', 'portal', 'docs', 'admin', 'update', 'service', 'online', 'notify', 'alert'];

const ids = new Set();
const seenDrafts = new Map();
const seenSentences = new Map();
const counts = Object.fromEntries(categories.map((c) => [c, { stop: 0, prompt: 0, pass: 0 }]));
const dimCount = Object.fromEntries(DIMS.map((d) => [d, 0]));
const buriedHow = { long: 0, list: 0, quoted: 0 };
const messyCount = Object.fromEntries(MESSY.map((m) => [m, 0]));
const kinds = { stop: 0, everyday: 0, boundary: 0 };
const settings = new Set();
let messyAny = 0;
const placements = {}; const industries = {}; const variants = {};
const lengths = { stop: [], everyday: [], boundary: [] };
const longEmails = [];

cases.forEach((c, index) => {
  const id = c.id ?? `#${index + 1}`;
  const expectedId = `everyday7a-${String(index + 1).padStart(3, '0')}`;
  if (c.id !== expectedId) fail(id, `id should be ${expectedId}`);
  if (ids.has(c.id)) fail(id, 'repeated id'); ids.add(c.id);
  if (!categories.includes(c.category_expected)) fail(id, 'bad category_expected');
  if (!['stop', 'pass'].includes(c.expect)) fail(id, 'expect must be stop or pass in this set');
  if (typeof c.why !== 'string' || !/SPEC §/.test(c.why) || /[\r\n]/.test(c.why)) fail(id, 'why must be one line naming a SPEC section');
  if (counts[c.category_expected]) counts[c.category_expected][c.expect] = (counts[c.category_expected][c.expect] ?? 0) + 1;
  const d = c.draft;
  const meta = c.meta ?? {};
  if (!d || !d.from || typeof d.from.address !== 'string' || !/^[^@\s]+@[^@\s]+$/.test(d.from.address)) { fail(id, 'bad sender'); return; }
  const own = domainOf(d.from.address);
  if (!own.includes('.')) fail(id, 'sender domain not derivable');
  if (!/\.(example|test)$/.test(own)) fail(id, 'sender domain must end in .example or .test');
  let recipients = 0;
  for (const field of ['to', 'cc', 'bcc']) {
    if (!Array.isArray(d[field]) || !d[field].every((r) => typeof r.name === 'string' && typeof r.address === 'string' && ['person', 'group'].includes(r.kind))) fail(id, `bad ${field}`);
    else recipients += d[field].length;
  }
  if (!(d.to?.length >= 1)) fail(id, 'needs at least one To recipient');
  if (recipients > 4) fail(id, 'large recipient list');
  if (typeof d.subject !== 'string' || d.body?.format !== 'text' || typeof d.body.text !== 'string') fail(id, 'bad subject or body');
  if (!Array.isArray(d.attachments) || d.attachments.length !== 0) fail(id, 'attachments must be an empty array');
  const all = [...(d.to ?? []), ...(d.cc ?? []), ...(d.bcc ?? [])];
  for (const r of all) {
    const dom = domainOf(r.address);
    if (!/\.(example|test)$/.test(dom)) fail(id, `recipient domain ${dom} not .example/.test`);
    if (dom === own) fail(id, `recipient ${r.address} is inside by exact domain`);
    const a = labelOf(dom), b = labelOf(own);
    if (a === b || distance(a, b) <= 2 || a.includes(b) || b.includes(a)) fail(id, `recipient domain ${dom} could read as a lookalike of ${own}`);
    for (const w of lookalikeWords) if (a.replace(/[-.]/g, '').includes(w) && a.replace(/[-.]/g, '').includes(b.replace(/[-.]/g, ''))) fail(id, 'recipient domain looks phishing-shaped');
  }
  const text = d.body.text;
  const subject = d.subject;
  // greeting to someone else (SPEC §5.8): first line greeting must name a recipient
  const first = text.split('\n').find((l) => l.trim()) ?? '';
  const g = /^\s*(?:hi|hello|dear|hey)\s+((?:mr|mrs|ms|miss|dr|prof)\.?\s+)?([A-Za-z'’-]+)/i.exec(first);
  if (g && !/^(all|team|both|everyone|folks|there|guys|you|friends|colleagues)$/i.test(g[2])) {
    const name = g[2].toLowerCase();
    const known = all.flatMap((r) => [...r.name.toLowerCase().split(/[\s.]+/), ...r.address.split('@')[0].toLowerCase().split(/[._-]/)]);
    if (!known.some((k) => k === name || (k.length > 2 && name.length > 2 && (k.startsWith(name) || name.startsWith(k))))) fail(id, `greeting "${g[0].trim()}" does not match a recipient`);
  }
  // numeric screen
  const joined = `${subject}\n${text}`;
  if (/\d{9,}/.test(joined)) fail(id, 'long digit run');
  if (/(?:\d[ -]?){13,19}/.test(joined.replace(/[,.]\d{3}/g, ''))) fail(id, 'card-like digit sequence');
  if (/\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]{4}){3,}\b/.test(joined)) fail(id, 'IBAN-like string');
  if (/\b\d{3}-\d{2}-\d{4}\b/.test(joined)) fail(id, 'SSN-like string');
  if (c.expect === 'pass' && /internal only|for internal use|not for external|keep this between us|not to be shared externally|don'?t forward this to/i.test(joined)) fail(id, 'pass case carries a §5.10 inside-only marker');
  // duplicates
  const key = JSON.stringify([subject, text]);
  if (seenDrafts.has(key)) fail(id, `duplicate draft of ${seenDrafts.get(key)}`); else seenDrafts.set(key, id);
  if (seenDrafts.has(JSON.stringify([text]))) { /* same body different subject */ }
  // kind-specific
  const wc = words(joined);
  const kind = meta.kind;
  if (!kinds.hasOwnProperty(kind)) { fail(id, 'meta.kind must be stop, everyday or boundary'); return; }
  kinds[kind]++;
  lengths[kind].push(wc);
  if (VARIANTS.includes(meta.variant)) variants[meta.variant] = (variants[meta.variant] ?? 0) + 1; else fail(id, 'bad meta.variant');
  if (typeof meta.industry === 'string' && meta.industry) industries[meta.industry] = (industries[meta.industry] ?? 0) + 1; else fail(id, 'missing meta.industry');
  placements[meta.placement] = (placements[meta.placement] ?? 0) + 1;
  if (kind === 'stop') {
    if (c.expect !== 'stop' || !stopCategories.includes(c.category_expected)) fail(id, 'stop case must use a stop category');
    if (!c.why.startsWith(`SPEC §${sectionOf[c.category_expected]}:`)) fail(id, `why must start with SPEC §${sectionOf[c.category_expected]}:`);
    const s = meta.sentence;
    if (typeof s !== 'string' || !s || /[\r\n"]/.test(s)) { fail(id, 'sentence must be one line without double quotes'); return; }
    if (!c.why.includes(`"${s}"`)) fail(id, 'why does not quote the deciding sentence verbatim');
    if (!PLACEMENTS.includes(meta.placement)) fail(id, 'bad placement');
    const where = [];
    for (const [label, hay] of [['subject', subject], ['body', text]]) {
      let from = 0;
      for (;;) {
        const at = hay.indexOf(s, from); if (at < 0) break;
        const lineStart = hay.lastIndexOf('\n', at - 1) + 1;
        where.push(label === 'subject' ? 'subject' : /^\s*>/.test(hay.slice(lineStart, at)) ? 'quoted' : 'body');
        from = at + s.length;
      }
    }
    if (where.length !== 1) fail(id, `deciding sentence occurs ${where.length} times, expected exactly once`);
    else if (where[0] !== meta.placement) fail(id, `deciding sentence found in ${where[0]}, stated placement ${meta.placement}`);
    if (seenSentences.has(s)) fail(id, 'deciding sentence repeated'); seenSentences.set(s, id);
    if (!Array.isArray(meta.dims) || meta.dims.length === 0 || !meta.dims.every((x) => DIMS.includes(x))) fail(id, 'bad dims');
    for (const x of meta.dims ?? []) dimCount[x]++;
    if ((meta.dims ?? []).includes('buried')) {
      const bullets = (text.match(/^\s*(?:[-*•]|\d+[.)])\s+\S/gm) ?? []).length;
      if (meta.placement === 'quoted') buriedHow.quoted++;
      else if (wc >= 400) { buriedHow.long++; longEmails.push(id); }
      else if (bullets >= 5) buriedHow.list++;
      else fail(id, 'dims says buried but the email is not 400+ words, a dense list (5+ items) or quoted');
    }
    if ((meta.dims ?? []).includes('unlabelled') && !/\d/.test(s)) fail(id, 'unlabelled dimension needs figures in the sentence');
  } else {
    if (c.expect !== 'pass' || c.category_expected !== 'none') fail(id, 'everyday and boundary cases must be pass / none');
    if (!c.why.startsWith('SPEC §')) fail(id, 'why must start with SPEC §');
    if (typeof meta.setting !== 'string' || !meta.setting) fail(id, 'missing meta.setting');
    if (kind === 'everyday') {
      settings.add(meta.setting);
      if (!Array.isArray(meta.messy) || !meta.messy.every((x) => MESSY.includes(x))) fail(id, 'bad messy');
      if ((meta.messy ?? []).length) messyAny++;
      for (const x of meta.messy ?? []) {
        messyCount[x]++;
        if (x === 'chain' && !/^\s*>|-----Original Message-----/m.test(text)) fail(id, 'chain needs quoted history');
        if (x === 'forward' && !/Forwarded message|^FW:|^Fwd:/im.test(joined)) fail(id, 'forward needs a forwarded block');
        if (x === 'terse' && wc > 40) fail(id, 'terse email is longer than 40 words');
        if (x === 'footer' && !/\n--\s*\n|disclaimer|confidential|registered|Ltd|LLP|Inc|Limited|footer|Sent from/i.test(text)) fail(id, 'footer needs a signature, disclaimer or legal footer');
      }
    } else {
      if (typeof meta.boundary !== 'string' || !meta.boundary) fail(id, 'missing meta.boundary');
      if (!/Does not flag|SPEC §5\.\d/.test(c.why)) fail(id, 'boundary why must name the SPEC line');
      if (!/Does not flag|decided|intro/i.test(c.why) && !/§5\.\d+ /.test(c.why)) fail(id, 'boundary why should cite the safe-side line');
    }
  }
});

// quotas
const stopCount = cases.filter((c) => c.expect === 'stop').length;
const passCount = cases.filter((c) => c.expect === 'pass').length;
const quotaFail = [];
if (stopCount > 60) quotaFail.push(`stops ${stopCount} > 60`);
if (passCount > 200) quotaFail.push(`passes ${passCount} > 200`);
if (kinds.everyday > 100) quotaFail.push('everyday > 100');
if (kinds.boundary > 100) quotaFail.push('boundary > 100');
for (const c of stopCategories) if (counts[c].stop > 12) quotaFail.push(`${c} stops > 12`);
if (!checkpoint) {
  if (cases.length !== 260) quotaFail.push(`total ${cases.length} != 260`);
  if (stopCount !== 60) quotaFail.push(`stops ${stopCount} != 60`);
  if (passCount !== 200) quotaFail.push(`passes ${passCount} != 200`);
  if (kinds.everyday !== 100) quotaFail.push(`everyday ${kinds.everyday} != 100`);
  if (kinds.boundary !== 100) quotaFail.push(`boundary ${kinds.boundary} != 100`);
  for (const c of stopCategories) if (counts[c].stop !== 12) quotaFail.push(`${c} stops ${counts[c].stop} != 12`);
  for (const x of DIMS) if (dimCount[x] < 8) quotaFail.push(`dimension ${x} used ${dimCount[x]} < 8`);
  if (messyAny < 40) quotaFail.push(`messy everyday ${messyAny} < 40`);
  if (settings.size < 60) quotaFail.push(`settings ${settings.size} < 60`);
  if (longEmails.length < 1) quotaFail.push('no 400+ word buried email');
  if (buriedHow.quoted < 1 || buriedHow.list < 1) quotaFail.push('buried needs long, list and quoted instances');
}
quotaFail.forEach((q) => errors.push(`quota: ${q}`));

// README agreement
const readmePath = path.join(dir, 'README.md');
const readmeNote = [];
if (fs.existsSync(readmePath)) {
  const readme = fs.readFileSync(readmePath, 'utf8');
  const lines = readme.split(/\r?\n/);
  const rowNumbers = (prefix, from, to) => { const line = lines.find((l) => l.startsWith(prefix)); return line ? line.split('|').slice(from, to).map((x) => Number(x.trim().replaceAll('*', ''))) : null; };
  let tableOk = true;
  for (const category of categories) {
    const n = rowNumbers(`| ${category} |`, 2, 6);
    const c = counts[category];
    if (!n || n[0] !== c.stop || n[1] !== c.prompt || n[2] !== c.pass || n[3] !== c.stop + c.prompt + c.pass) { tableOk = false; if (!checkpoint) errors.push(`README: composition row ${category} differs from cases`); }
  }
  const totals = rowNumbers('| **Total** |', 2, 6);
  const wantTotals = [stopCount, 0, passCount, cases.length];
  if (!totals || totals.some((x, i) => x !== wantTotals[i])) { tableOk = false; if (!checkpoint) errors.push('README: Total row differs from cases'); }
  for (const x of DIMS) { const n = rowNumbers(`| ${x} |`, 2, 3); if (!n || n[0] !== dimCount[x]) { tableOk = false; if (!checkpoint) errors.push(`README: dimension row ${x} differs (cases: ${dimCount[x]})`); } }
  for (const x of MESSY) { const n = rowNumbers(`| ${x} |`, 2, 3); if (!n || n[0] !== messyCount[x]) { tableOk = false; if (!checkpoint) errors.push(`README: messy row ${x} differs (cases: ${messyCount[x]})`); } }
  { const n = rowNumbers('| any messy |', 2, 3); if (!n || n[0] !== messyAny) { tableOk = false; if (!checkpoint) errors.push(`README: any messy row differs (cases: ${messyAny})`); } }
  readmeNote.push(`README tables ${tableOk ? 'agree' : checkpoint ? 'not yet in agreement (checkpoint)' : 'DISAGREE'}`);
} else if (!checkpoint) errors.push('README.md missing');
else readmeNote.push('README.md not written yet (checkpoint)');

const sorted = (a) => [...a].sort((x, y) => x - y);
const median = (a) => { const s = sorted(a); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : 0; };
const summary = (a) => a.length ? `n=${a.length} min=${Math.min(...a)} median=${median(a)} mean=${(a.reduce((x, y) => x + y, 0) / a.length).toFixed(1)} max=${Math.max(...a)} 400+words=${a.filter((x) => x >= 400).length}` : 'n=0';

console.log(`everyday7a ${checkpoint ? 'CHECKPOINT' : 'FULL'} validation; ${cases.length} cases; SHA-256 ${sha256}`);
console.log(`kinds: stop ${kinds.stop}, everyday ${kinds.everyday}, boundary ${kinds.boundary}`);
console.log('composition (stop/prompt/pass):', categories.filter((c) => counts[c].stop + counts[c].pass).map((c) => `${c} ${counts[c].stop}/${counts[c].prompt}/${counts[c].pass}`).join('; '));
console.log('hardness dimensions among stops:', DIMS.map((x) => `${x} ${dimCount[x]}`).join(', '));
console.log(`buried stops: ${buriedHow.long} long (400+ words), ${buriedHow.list} dense list, ${buriedHow.quoted} quoted history`);
console.log(`messy everyday: any ${messyAny}; ${MESSY.map((x) => `${x} ${messyCount[x]}`).join(', ')}; distinct settings ${settings.size}`);
for (const n of readmeNote) console.log(n);
if (wantStats) {
  console.log('length (words, subject+body): stop', summary(lengths.stop), '| everyday', summary(lengths.everyday), '| boundary', summary(lengths.boundary), '| all', summary([...lengths.stop, ...lengths.everyday, ...lengths.boundary]));
  console.log('placements:', JSON.stringify(placements));
  console.log('variants:', JSON.stringify(variants));
  console.log('industry labels:', Object.keys(industries).length, '(distinct metadata labels)');
  const sectors = [
    ['property, construction and engineering', /construction|building|property|lettings|civil|structural|engineering|architect|surveying|planning|estate|apartment|facilities|roof|stair|cost consultancy|serviced offices|solar|plumbing|window|carpet|pool|housing|fabrication|metal|steel|stair|manufactur|plastics|mechanical|industrial|machinery|lift|moulding|components|warehousing|self storage|storage|packaging|food packaging|food manufacturing|grain/i],
    ['professional services (law, accounting, consulting, HR, recruitment)', /law|legal|accountan|accounts|bookkeeping|tax|consult|advis|recruit|staffing|HR|payroll|finance|conveyancing|courts|insurance|procurement|research|management|project|copywriting|branding|communications|translation|banking|budgeting|commodity|venture|public sector|compliance|supplier management|client services/i],
    ['technology and software', /software|IT |IT$|web|digital|data centre|telecom|podcast|payments|electronics|security training|subscription|ecommerce|online retail|online printing|printing|print shop|3D/i],
    ['health, veterinary and education', /veterin|physio|dental|dentist|hearing|clinic|healthcare|dermatology|wellness|child health|school|education|university|higher|early years|nursery|language|training|dance|tennis|driving|flight|coaching|charity|church/i],
    ['logistics, freight and transport', /freight|logistics|haulage|courier|customs|delivery|taxi|airport|transport|car hire|vintage cars|removals|delivery|shuttle/i],
    ['hospitality, events, media and leisure', /catering|hospitality|hotel|cafe|coffee|brewery|brewing|distill|wine|drinks|events|event|venue|conference|theatre|cinema|film|live|music|sound|golf|yoga|leisure|club|sport|football|bowling|travel|boat|marina|craft|photograph|publishing|media|bookselling|museum|community|florist|floristry|gifts|garden|farm|greengrocer|organic|bakery|meal|market|restaurant|food import|barbering|fashion|clothing|merchandise|retail|signage|uniforms|skincare|stationery|nursery|workshops|ceramics|piano|canal|radio|studio|fitness/i],
  ];
  const bucket = {};
  for (const [label, n] of Object.entries(industries)) {
    const hit = sectors.find(([, re]) => re.test(label));
    const name = hit ? hit[0] : 'other';
    bucket[name] = (bucket[name] ?? 0) + n;
  }
  console.log('industry sectors (cases):', JSON.stringify(bucket));
  const bd = {};
  for (const c of cases.filter((x) => x.meta?.kind === 'boundary')) { const s = /^SPEC §(\d+\.\d+)/.exec(c.why)?.[1] ?? '?'; bd[s] = (bd[s] ?? 0) + 1; }
  console.log('boundary passes by SPEC section:', JSON.stringify(bd));
  const labels = {};
  for (const c of cases.filter((x) => x.meta?.kind === 'boundary')) labels[c.meta.boundary] = (labels[c.meta.boundary] ?? 0) + 1;
  console.log('boundary labels:', Object.keys(labels).length);
  for (const [k, n] of Object.entries(labels).sort((a, b) => b[1] - a[1])) console.log('  ' + n + ' x ' + k);
  console.log('long stop emails:', longEmails.join(', '));
}
if (errors.length) { console.log(`FAIL: ${errors.length} problem(s)`); errors.forEach((e) => console.log(' - ' + e)); process.exitCode = 1; }
else console.log('OK: no problems found');
