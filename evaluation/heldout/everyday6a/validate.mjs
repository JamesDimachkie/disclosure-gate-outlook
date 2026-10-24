// Validates cases.jsonl for the everyday6a held-out set. No dependencies. Node 24.
//   node evaluation/heldout/everyday6a/validate.mjs              full run: quotas, hardness counts, README table
//   node evaluation/heldout/everyday6a/validate.mjs --checkpoint partial run: per-case checks and running counts only
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const checkpoint = process.argv.includes('--checkpoint');
const categories = ['secrets', 'payment', 'government_id', 'personal', 'economics', 'negotiation', 'remark', 'lookalike', 'exposed_list', 'file', 'none'];
const stopCategories = ['secrets', 'personal', 'economics', 'negotiation', 'remark'];
const HARDNESS = ['implicit', 'buried', 'numbers', 'casual', 'hedged'];
const TOTAL = 260, STOPS_PER_CATEGORY = 12, BOUNDARY = 100, ORDINARY = 100, MIN_PER_DIMENSION = 8, MIN_SETTINGS = 60, LONG_WORDS = 400;

const errors = [];
const warnings = [];
const fail = (id, msg) => errors.push(`${id}: ${msg}`);
const warn = (id, msg) => warnings.push(`${id}: ${msg}`);

const raw = fs.readFileSync(path.join(dir, 'cases.jsonl'), 'utf8');
if (raw.includes('\r')) fail('file', 'cases.jsonl contains a carriage return; lines must end with LF only');
if (!raw.endsWith('\n')) fail('file', 'cases.jsonl must end with a newline');
const lines = raw.trimEnd().split('\n');
const cases = [];
lines.forEach((line, i) => {
  try { cases.push(JSON.parse(line)); } catch { fail('file', `line ${i + 1} is not valid JSON`); }
});

const words = (s) => s.split(/\s+/).filter(Boolean).length;
const count = (hay, needle) => (needle ? hay.split(needle).length - 1 : 0);
function levenshtein(a, b) {
  const m = a.length, n = b.length; const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
const addressRe = /^[a-z0-9._-]+@([a-z0-9-]+)\.(example|test)$/;
const domainOf = (address) => address.slice(address.lastIndexOf('@') + 1).toLowerCase();
const nameOf = (domain) => domain.slice(0, domain.lastIndexOf('.'));

// Numeric and credential screen: nothing in this set may look like a card, IBAN, SSN, NI number, long identifier or key.
const screens = [
  [/\d{9,}/, 'digit run of 9 or more'],
  [/(?:\d[ -]?){13,19}\d?/, 'card-like digit sequence'],
  [/\b[A-Z]{2}\d{2}[A-Z0-9]{10,}\b/, 'IBAN-like string'],
  [/\b\d{3}-\d{2}-\d{4}\b/, 'SSN-like string'],
  [/\b[A-Z]{2}\d{6}[A-D]\b/, 'NI-like string'],
  [/AKIA[0-9A-Z]{8,}|ghp_[A-Za-z0-9]{6,}|github_pat_|xox[bpa]-|sk_live_|AIza[0-9A-Za-z_-]{6,}|sk-ant-|-----BEGIN|eyJ[A-Za-z0-9_-]{12,}\./, 'credential-like token'],
];
// Marked-for-inside phrases (§5.10) would add a second finding; none may appear anywhere in the set.
const insideMarkers = /internal only|for internal use|not for external|don.?t forward this(?! link)|keep this between us|not to be shared externally|between us/i;
// Words worth a second look in pass cases (not failures: the spec's does-not-flag lists use many of them on purpose).
const riskyWords = /\b(margin|mark-?up|contingency|walk away|walk-away|floor price|bonus|salary|fired|sacked|let go|divorc\w*|custody|arrest\w*|court|chemo\w*|surgery|hospital|idiot|clown|muppet\w*|cowboy\w*|useless|password|passcode|pin|alarm|camera\w*|lockbox|key ?box|spare key|wi-?fi|keypad|safe)\b/i;
const greetingRe = /^\s*(?:hi|hello|hey|hiya|dear|morning|afternoon|evening|good morning|good afternoon|howdy|g'day|yo)\s+(?:mr|mrs|ms|miss|dr|prof|professor|councillor|cllr|rev|coach)?\.?\s*([A-Z][a-z]+(?:-[A-Z][a-z]+)?)\b/i;
const groupGreeting = /^\s*(?:hi|hello|hey|hiya|dear|morning|afternoon|evening|good morning|good afternoon|howdy|g'day)\s+(?:all|both|everyone|team|folks|guys|everybody|colleagues|parents|neighbours|neighbors|members|residents|customers|friends|sir|madam|sirs|sir or madam|customer|client|colleague|supplier|vendor|tenant|patient|resident|member|clients|vendors)\b/i;

const seenIds = new Set(), seenBodies = new Set(), seenDeciding = new Set();
const counts = Object.fromEntries(categories.map((c) => [c, { stop: 0, prompt: 0, pass: 0 }]));
const hardness = Object.fromEntries(HARDNESS.map((h) => [h, 0]));
const buriedKinds = { long: 0, list: 0, quoted: 0 };
const placements = { subject: 0, body: 0, quoted: 0 };
const industries = new Map(), variants = new Map(), settings = new Set(), boundaries = new Map();
const lengths = { stop: [], boundary: [], ordinary: [] };
let kinds = { stop: 0, boundary: 0, ordinary: 0 };

cases.forEach((c, index) => {
  const id = typeof c.id === 'string' ? c.id : `line ${index + 1}`;
  const expectedId = `everyday6a-${String(index + 1).padStart(3, '0')}`;
  if (c.id !== expectedId) fail(id, `expected id ${expectedId} at line ${index + 1}`);
  if (seenIds.has(c.id)) fail(id, 'duplicate id'); seenIds.add(c.id);
  const keys = Object.keys(c);
  if (keys.join(',') !== 'id,category_expected,expect,why,meta,draft') fail(id, `unexpected key order or set: ${keys.join(',')}`);
  if (!categories.includes(c.category_expected)) fail(id, `bad category ${c.category_expected}`);
  if (!['stop', 'pass'].includes(c.expect)) fail(id, `bad expect ${c.expect}`);
  if (typeof c.why !== 'string' || !/SPEC §/.test(c.why) || /[\r\n]/.test(c.why)) fail(id, 'why must be one line and cite SPEC §');
  if (counts[c.category_expected]) counts[c.category_expected][c.expect]++;

  const d = c.draft || {};
  if (!d.from || typeof d.from.name !== 'string' || typeof d.from.address !== 'string') fail(id, 'bad from');
  for (const f of ['to', 'cc', 'bcc']) if (!Array.isArray(d[f]) || !d[f].every((r) => typeof r.name === 'string' && typeof r.address === 'string' && r.kind === 'person')) fail(id, `bad ${f}`);
  if (typeof d.subject !== 'string' || d.body?.format !== 'text' || typeof d.body?.text !== 'string') fail(id, 'bad subject/body');
  if (!Array.isArray(d.attachments) || d.attachments.length !== 0) fail(id, 'attachments must be an empty array');
  const subject = d.subject || '', body = d.body?.text || '';
  if (!subject.trim() || !body.trim()) fail(id, 'empty subject or body');

  // Addresses: invented domains only, every recipient outside by exact domain, no lookalikes, no large lists.
  const own = d.from?.address || '';
  if (!addressRe.test(own)) fail(id, `sender address must be lower case user@name.example|test: ${own}`);
  const ownDomain = domainOf(own), ownName = nameOf(ownDomain);
  const recipients = [...(d.to || []), ...(d.cc || []), ...(d.bcc || [])];
  if (recipients.length < 1 || recipients.length > 4) fail(id, `recipient count ${recipients.length} (want 1 to 4)`);
  for (const r of recipients) {
    if (!addressRe.test(r.address)) { fail(id, `recipient address must be lower case user@name.example|test: ${r.address}`); continue; }
    const dom = domainOf(r.address), name = nameOf(dom);
    if (dom === ownDomain) fail(id, `recipient ${r.address} is inside`);
    if (dom.endsWith('.' + ownDomain) || ownDomain.endsWith('.' + dom)) fail(id, `recipient ${r.address} is a subdomain relation of the sender`);
    if (name !== ownName && (name.includes(ownName) || ownName.includes(name) || levenshtein(name, ownName) <= 2)) fail(id, `recipient domain ${dom} resembles sender domain ${ownDomain}`);
  }
  if (new Set(recipients.map((r) => domainOf(r.address))).size > 3) fail(id, 'more than three recipient domains');

  // Content screens.
  const text = `${subject}\n${body}`;
  for (const [re, label] of screens) if (re.test(text)) fail(id, `${label}: ${text.match(re)[0]}`);
  if (insideMarkers.test(text)) fail(id, `§5.10 phrase present: ${text.match(insideMarkers)[0]}`);
  if (/[`]|\$\{/.test(text)) fail(id, 'backtick or template marker in text');
  if (seenBodies.has(body)) fail(id, 'duplicate body'); seenBodies.add(body);

  // Greeting must match a recipient (§5.8 greeting rule must not fire).
  const first = body.split('\n').find((l) => l.trim());
  if (first && !groupGreeting.test(first)) {
    const g = first.match(greetingRe);
    if (g) {
      const name = g[1].toLowerCase();
      const ok = recipients.some((r) => r.name.toLowerCase().split(/[\s-]+/).includes(name) || r.address.toLowerCase().split('@')[0].split(/[._-]/).includes(name) || r.name.toLowerCase().startsWith(name));
      if (!ok) fail(id, `greeting to ${g[1]} but no recipient has that name`);
    }
  }

  // Metadata.
  const m = c.meta || {};
  if (!['stop', 'boundary', 'ordinary'].includes(m.kind)) fail(id, `bad meta.kind ${m.kind}`);
  if (typeof m.industry !== 'string' || !m.industry) fail(id, 'meta.industry missing');
  if (typeof m.variant !== 'string' || !m.variant) fail(id, 'meta.variant missing');
  if (typeof m.setting !== 'string' || !m.setting) fail(id, 'meta.setting missing');
  kinds[m.kind] = (kinds[m.kind] || 0) + 1;
  industries.set(m.industry, (industries.get(m.industry) || 0) + 1);
  variants.set(m.variant, (variants.get(m.variant) || 0) + 1);
  if (lengths[m.kind]) lengths[m.kind].push(words(body));

  if (m.kind === 'stop') {
    if (c.expect !== 'stop') fail(id, 'stop kind must expect stop');
    if (!stopCategories.includes(c.category_expected)) fail(id, `stop category ${c.category_expected} is not one of the five`);
    if (!Array.isArray(m.hardness) || m.hardness.length === 0 || !m.hardness.every((h) => HARDNESS.includes(h)) || new Set(m.hardness).size !== m.hardness.length) fail(id, 'meta.hardness must list one or more distinct dimensions');
    else for (const h of m.hardness) hardness[h]++;
    if (!['subject', 'body', 'quoted'].includes(m.placement)) fail(id, `bad placement ${m.placement}`); else placements[m.placement]++;
    const dec = m.deciding_sentence;
    if (typeof dec !== 'string' || dec.length < 12) fail(id, 'deciding_sentence missing or too short');
    else {
      if (seenDeciding.has(dec)) fail(id, 'duplicate deciding sentence'); seenDeciding.add(dec);
      if (dec.includes('"')) fail(id, 'deciding sentence must not contain a double quote');
      if (!c.why.includes(`"${dec}"`)) fail(id, 'why must quote the deciding sentence verbatim in double quotes');
      const inSubject = count(subject, dec), inBody = count(body, dec);
      if (m.placement === 'subject') { if (inSubject !== 1 || inBody !== 0) fail(id, `deciding sentence must appear exactly once in the subject only (subject ${inSubject}, body ${inBody})`); }
      else {
        if (inBody !== 1 || inSubject !== 0) fail(id, `deciding sentence must appear exactly once in the body only (subject ${inSubject}, body ${inBody})`);
        else {
          const line = body.split('\n').find((l) => l.includes(dec));
          const quoted = /^\s*>/.test(line);
          if (m.placement === 'quoted' && !quoted) fail(id, 'placement quoted but the deciding line does not start with >');
          if (m.placement === 'body' && quoted) fail(id, 'placement body but the deciding line is quoted');
          if (m.buried === 'list' && !/^\s*(?:[-*•]|\d+[.)])\s/.test(line)) fail(id, 'buried list but the deciding line is not a list item');
        }
      }
    }
    const isBuried = Array.isArray(m.hardness) && m.hardness.includes('buried');
    if (isBuried) {
      if (!['long', 'list', 'quoted'].includes(m.buried)) fail(id, 'buried stops need meta.buried of long, list or quoted');
      else {
        buriedKinds[m.buried]++;
        if (m.buried === 'long' && words(body) < LONG_WORDS) fail(id, `buried long but body has ${words(body)} words (< ${LONG_WORDS})`);
        if (m.buried === 'quoted' && m.placement !== 'quoted') fail(id, 'buried quoted but placement is not quoted');
      }
    } else if (m.buried) fail(id, 'meta.buried set without the buried dimension');
    if (m.boundary) fail(id, 'stop case must not carry meta.boundary');
  } else {
    if (c.expect !== 'pass' || c.category_expected !== 'none') fail(id, 'pass cases must be category none, expect pass');
    if (m.hardness || m.placement || m.deciding_sentence || m.buried) fail(id, 'pass case carries stop-only metadata');
    if (m.kind === 'boundary') {
      if (typeof m.boundary !== 'string' || !/§5\.\d+/.test(m.boundary)) fail(id, 'boundary pass needs meta.boundary naming a SPEC §5 line');
      else boundaries.set(m.boundary, (boundaries.get(m.boundary) || 0) + 1);
      if (!/§5\.\d+/.test(c.why)) fail(id, 'boundary why must name the SPEC §5 line that keeps it safe');
    } else {
      if (m.boundary) fail(id, 'ordinary pass must not carry meta.boundary');
      settings.add(m.setting);
    }
    const r = text.match(riskyWords);
    if (r) warn(id, `pass case uses "${r[0]}" (check it sits on the safe side)`);
  }
});

if (!checkpoint) {
  if (cases.length !== TOTAL) fail('set', `expected ${TOTAL} cases, found ${cases.length}`);
  for (const cat of stopCategories) if (counts[cat].stop !== STOPS_PER_CATEGORY) fail('set', `${cat} has ${counts[cat].stop} stops (want ${STOPS_PER_CATEGORY})`);
  for (const cat of categories) if (!stopCategories.includes(cat) && cat !== 'none' && (counts[cat].stop || counts[cat].pass || counts[cat].prompt)) fail('set', `${cat} must be unused`);
  if (kinds.boundary !== BOUNDARY) fail('set', `${kinds.boundary} boundary passes (want ${BOUNDARY})`);
  if (kinds.ordinary !== ORDINARY) fail('set', `${kinds.ordinary} ordinary passes (want ${ORDINARY})`);
  for (const h of HARDNESS) if (hardness[h] < MIN_PER_DIMENSION) fail('set', `hardness ${h} used ${hardness[h]} times (want >= ${MIN_PER_DIMENSION})`);
  if (settings.size < MIN_SETTINGS) fail('set', `${settings.size} distinct ordinary settings (want >= ${MIN_SETTINGS})`);
  // README composition table, checked the way run.mjs checks it.
  const readmePath = path.join(dir, 'README.md');
  if (!fs.existsSync(readmePath)) fail('readme', 'README.md missing');
  else {
    const readme = fs.readFileSync(readmePath, 'utf8');
    for (const category of categories) {
      const row = readme.split(/\r?\n/).find((line) => line.startsWith(`| ${category} |`));
      if (!row) { fail('readme', `missing row for ${category}`); continue; }
      const n = row.split('|').slice(2, 6).map((x) => Number(x.trim()));
      const k = counts[category];
      if (!(n[0] === k.stop && n[1] === k.prompt && n[2] === k.pass && n[3] === k.stop + k.prompt + k.pass)) fail('readme', `row ${category} says ${n.join('/')} but cases give ${k.stop}/${k.prompt}/${k.pass}/${k.stop + k.prompt + k.pass}`);
    }
    const totalRow = readme.split(/\r?\n/).find((line) => line.startsWith('| **Total** |'));
    if (!totalRow) fail('readme', 'missing total row');
    else {
      const t = totalRow.split('|').slice(2, 6).map((x) => Number(x.trim().replaceAll('*', '')));
      const stops = cases.filter((c) => c.expect === 'stop').length, passes = cases.filter((c) => c.expect === 'pass').length;
      if (!(t[0] === stops && t[1] === 0 && t[2] === passes && t[3] === cases.length)) fail('readme', `total row says ${t.join('/')} but cases give ${stops}/0/${passes}/${cases.length}`);
    }
    const hashLine = readme.match(/SHA-256[^\n]*`([0-9a-f]{64})`/);
    if (hashLine) {
      const { createHash } = await import('node:crypto');
      const sha = createHash('sha256').update(raw).digest('hex');
      if (hashLine[1] !== sha) fail('readme', `README SHA-256 ${hashLine[1]} differs from cases.jsonl ${sha}`);
    }
  }
}

const stats = (arr) => { if (!arr.length) return 'n/a'; const s = [...arr].sort((a, b) => a - b); const mean = (s.reduce((a, b) => a + b, 0) / s.length).toFixed(0); return `n=${s.length} min=${s[0]} median=${s[Math.floor(s.length / 2)]} mean=${mean} max=${s[s.length - 1]}`; };
console.log(`${checkpoint ? 'Checkpoint' : 'Full'} validation of ${cases.length} cases`);
console.log('Composition:', Object.entries(counts).filter(([, v]) => v.stop || v.pass || v.prompt).map(([k, v]) => `${k} stop=${v.stop} pass=${v.pass}`).join('; '));
console.log('Kinds:', JSON.stringify(kinds));
console.log('Hardness:', JSON.stringify(hardness), 'buried:', JSON.stringify(buriedKinds), 'placements:', JSON.stringify(placements));
console.log('Body words (stop):', stats(lengths.stop));
console.log('Body words (boundary):', stats(lengths.boundary));
console.log('Body words (ordinary):', stats(lengths.ordinary));
console.log(`Industries: ${industries.size}; variants: ${[...variants.entries()].map(([k, v]) => `${k}=${v}`).join(', ')}; ordinary settings: ${settings.size}`);
if (boundaries.size) console.log('Boundaries:', [...boundaries.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} (${v})`).join('; '));
if (warnings.length) { console.log(`\n${warnings.length} warning(s):`); for (const w of warnings) console.log('  ' + w); }
if (errors.length) { console.log(`\n${errors.length} error(s):`); for (const e of errors) console.log('  ' + e); process.exitCode = 1; }
else console.log('\nOK: no errors');
