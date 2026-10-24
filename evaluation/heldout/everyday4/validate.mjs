// Validator for the everyday4 held-out set. No dependencies.
//   node evaluation/heldout/everyday4/validate.mjs [--checkpoint] [--write-receipt]
// --checkpoint accepts a partial set (quotas are ceilings, README tables and distribution targets are skipped).
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const args = new Set(process.argv.slice(2));
const checkpoint = args.has('--checkpoint');
const errors = [];
const warnings = [];
const fail = (id, msg) => errors.push(`${id}: ${msg}`);

const CATEGORIES = ['secrets', 'payment', 'government_id', 'personal', 'economics', 'negotiation', 'remark', 'lookalike', 'exposed_list', 'file', 'none'];
const STOP_QUOTA = { secrets: 12, personal: 12, economics: 12, negotiation: 12, remark: 12 };
const SPEC_SECTION = { secrets: '§5.1', personal: '§5.4', economics: '§5.5', negotiation: '§5.6', remark: '§5.7' };
const PASS_TOTAL = 300;
const TOTAL = 360;
const PLACEMENTS = ['body', 'quoted', 'subject'];
const ROLE_WORDS = new Set(['all', 'team', 'everyone', 'everybody', 'there', 'sir', 'madam', 'folks', 'both', 'guys', 'colleagues', 'friends', 'parents', 'families', 'members', 'neighbours', 'neighbors', 'residents', 'support', 'accounts', 'admin', 'reception']);
const TITLES = new Set(['mr', 'mrs', 'ms', 'miss', 'mx', 'dr', 'prof', 'professor', 'rev', 'reverend', 'father', 'sister', 'coach', 'captain', 'cllr', 'councillor', 'pastor']);

const rawPath = path.join(dir, 'cases.jsonl');
const raw = fs.readFileSync(rawPath, 'utf8');
const sha256 = createHash('sha256').update(raw).digest('hex');
const cases = [];
raw.trimEnd().split(/\r?\n/).forEach((line, i) => {
  try { cases.push(JSON.parse(line)); } catch { fail(`line ${i + 1}`, 'invalid JSON'); }
});

const domainOf = (a) => a.slice(a.lastIndexOf('@') + 1).toLowerCase();
const words = (s) => (s.match(/\S+/g) ?? []).length;
const label = (domain) => domain.split('.').slice(0, -1).join('.');
function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return dp[a.length][b.length];
}
function luhn(digits) {
  let sum = 0;
  [...digits].reverse().forEach((d, i) => { let n = Number(d); if (i % 2) { n *= 2; if (n > 9) n -= 9; } sum += n; });
  return sum % 10 === 0;
}
function shingles(text) {
  const w = text.toLowerCase().replace(/[^a-z0-9£$€\s]/g, ' ').split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + 4 <= w.length; i++) set.add(w.slice(i, i + 4).join(' '));
  return set;
}
function nameTokens(recipient) {
  const display = recipient.name.toLowerCase().split(/[^a-z']+/).filter(Boolean);
  const local = recipient.address.split('@')[0].toLowerCase().split(/[^a-z]+/).filter(Boolean);
  return new Set([...display, ...local]);
}
function firstNewLine(text) {
  return text.split('\n').find((l) => l.trim() !== '' && !l.startsWith('>')) ?? '';
}

// ---- per-case checks -------------------------------------------------------------------------------------
const seenIds = new Set();
const counts = { pass: 0, stops: Object.fromEntries(Object.keys(STOP_QUOTA).map((k) => [k, 0])) };
const placements = { body: 0, quoted: 0, subject: 0 };
const english = {};
const industries = new Set();
const passWordCounts = [];
let quotedPasses = 0;
const stopStarts = new Map();

cases.forEach((c, index) => {
  const id = c.id ?? `case ${index + 1}`;
  const expectedId = `everyday4-${String(index + 1).padStart(3, '0')}`;
  if (c.id !== expectedId) fail(id, `id should be ${expectedId}`);
  if (seenIds.has(c.id)) fail(id, 'repeated id');
  seenIds.add(c.id);
  if (!CATEGORIES.includes(c.category_expected)) fail(id, 'bad category');
  if (!['stop', 'pass'].includes(c.expect)) fail(id, 'expect must be stop or pass (no prompt cases in this set)');
  if (typeof c.why !== 'string' || !/SPEC §/.test(c.why) || /[\r\n]/.test(c.why)) fail(id, 'why must be one line containing SPEC §');
  if (typeof c.industry !== 'string' || !c.industry) fail(id, 'missing industry');
  if (typeof c.english !== 'string' || !c.english) fail(id, 'missing english variant');
  english[c.english] = (english[c.english] ?? 0) + 1;

  const d = c.draft;
  if (!d || typeof d !== 'object') return fail(id, 'missing draft');
  if (!d.from || typeof d.from.name !== 'string' || !/^[^@\s]+@[^@\s]+$/.test(d.from.address ?? '')) fail(id, 'bad sender');
  for (const field of ['to', 'cc', 'bcc']) {
    if (!Array.isArray(d[field])) fail(id, `${field} must be an array`);
    else for (const r of d[field]) if (typeof r.name !== 'string' || !r.name || typeof r.address !== 'string' || r.kind !== 'person') fail(id, `bad ${field} recipient`);
  }
  if (!Array.isArray(d.to) || d.to.length < 1) fail(id, 'needs at least one To recipient');
  if (Array.isArray(d.bcc) && d.bcc.length) fail(id, 'no Bcc in this set');
  if (!Array.isArray(d.attachments) || d.attachments.length) fail(id, 'no attachments in this set');
  if (typeof d.subject !== 'string' || !d.subject.trim() || d.subject.length > 160) fail(id, 'bad subject');
  if (d.body?.format !== 'text' || typeof d.body.text !== 'string' || !d.body.text.trim()) return fail(id, 'bad body');
  const subject = d.subject;
  const body = d.body.text;
  const all = `${subject}\n${body}`;

  // outside-only domains
  const own = domainOf(d.from.address);
  if (!/\.(example|test)$/.test(own)) fail(id, 'sender domain must end .example or .test');
  const recips = [...d.to, ...d.cc];
  if (recips.length > 4) fail(id, 'too many visible recipients');
  for (const r of recips) {
    const dom = domainOf(r.address);
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.(example|test)$/.test(dom)) fail(id, `recipient domain ${dom} must be .example or .test`);
    if (dom === own || dom.endsWith(`.${own}`) || own.endsWith(`.${dom}`)) fail(id, `recipient ${dom} is inside or related to ${own}`);
    const a = label(dom).replace(/[^a-z]/g, ''); const b = label(own).replace(/[^a-z]/g, '');
    if (a && b && (a === b || editDistance(a, b) <= 2 || (a.length >= 4 && b.includes(a)) || (b.length >= 4 && a.includes(b)))) fail(id, `recipient ${dom} looks like sender domain ${own}`);
  }
  const addresses = recips.map((r) => r.address.toLowerCase());
  if (new Set(addresses).size !== addresses.length) fail(id, 'repeated recipient');

  // greeting must match a recipient (or be a role/group greeting)
  const firstLine = firstNewLine(body);
  const greetingLine = words(firstLine) <= 6 ? firstLine : firstLine.replace(/^((?:hi|hello|dear|hey|morning|good (?:morning|afternoon|evening))[ ,]+[^,:!.]+).*$/i, '$1');
  const greeting = greetingLine.match(/^(?:hi|hello|dear|hey|morning|good (?:morning|afternoon|evening))[ ,]+(.+?)\s*[,:!]?\s*$/i);
  if (greeting) {
    const parts = greeting[1].replace(/[,:!.]+$/, '').split(/\s*(?:,|&|\band\b)\s*/i).map((s) => s.split(/\s+/).filter((t) => !TITLES.has(t.toLowerCase().replace(/\.$/, ''))));
    for (const tokens of parts) {
      const named = tokens.filter((t) => /^[A-Z][A-Za-z'’-]+$/.test(t) && !ROLE_WORDS.has(t.toLowerCase()));
      if (!named.length || tokens.some((t) => ROLE_WORDS.has(t.toLowerCase()))) continue;
      const hit = named.some((n) => recips.some((r) => nameTokens(r).has(n.toLowerCase().replace(/’/g, "'"))));
      if (!hit) fail(id, `greeting "${greeting[1]}" matches nobody on the recipient line`);
    }
  }

  // numeric screen
  for (const m of all.matchAll(/(?<![\d])(?:\d[ -]?){13,19}(?![\d])/g)) fail(id, `card-like digit run "${m[0].trim()}"`);
  for (const m of all.matchAll(/\d{8,}/g)) fail(id, `long digit run "${m[0]}"`);
  for (const m of all.matchAll(/\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]{4}){2,7}(?: ?[A-Z0-9]{1,3})?\b/g)) if (/\d/.test(m[0].slice(2, 4)) && m[0].replace(/ /g, '').length >= 14) fail(id, `IBAN-like string "${m[0]}"`);
  if (/\b\d{3}-\d{2}-\d{4}\b/.test(all)) fail(id, 'SSN-shaped value');
  if (/\b\d{2}-\d{2}-\d{2}\b/.test(all)) fail(id, 'sort-code-shaped value');
  if (/\b[A-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]\b/.test(all)) fail(id, 'National-Insurance-shaped value');
  for (const m of all.matchAll(/(?<!\d)\d(?:[ -]?\d){12,18}(?!\d)/g)) if (luhn(m[0].replace(/\D/g, ''))) fail(id, 'Luhn-valid long digit string');
  if (/(AKIA[0-9A-Z]{8}|ghp_|xox[bp]-|sk_live_|sk-ant|BEGIN [A-Z ]*PRIVATE KEY|eyJ[A-Za-z0-9_-]{10})/.test(all)) fail(id, 'credential-shaped string');
  if (/[‮​]/.test(all)) fail(id, 'hidden characters');

  if (c.expect === 'pass') {
    counts.pass++;
    industries.add(c.industry);
    if (c.category_expected !== 'none') fail(id, 'pass cases must be category none');
    if (c.placement !== 'none') fail(id, 'pass placement must be none');
    if ('deciding_sentence' in c) fail(id, 'pass case carries a deciding sentence');
    passWordCounts.push(words(body));
    if (/^>/m.test(body)) quotedPasses++;
    return;
  }

  // stop cases
  const fam = c.category_expected;
  if (!(fam in STOP_QUOTA)) return fail(id, `stop category ${fam} not allowed in this set`);
  counts.stops[fam]++;
  const s = c.deciding_sentence;
  if (typeof s !== 'string' || !s.trim() || /[\r\n"]/.test(s)) return fail(id, 'deciding_sentence must be one line without double quotes');
  if (!c.why.startsWith(`SPEC ${SPEC_SECTION[fam]}`)) fail(id, `why must start with SPEC ${SPEC_SECTION[fam]}`);
  if (!c.why.includes(`"${s}"`)) fail(id, 'why must quote the deciding sentence verbatim');
  if (!PLACEMENTS.includes(c.placement)) return fail(id, 'bad placement');
  placements[c.placement]++;
  const inSubject = subject.split(s).length - 1;
  const bodyLines = body.split('\n');
  const inBodyLines = bodyLines.filter((l) => l.includes(s));
  const inBody = body.split(s).length - 1;
  if (inSubject + inBody !== 1) fail(id, `deciding sentence appears ${inSubject + inBody} times (needs exactly once)`);
  if (c.placement === 'subject' && !(inSubject === 1 && inBody === 0)) fail(id, 'subject placement: sentence must be the subject only');
  if (c.placement === 'subject' && subject.trim() !== s.trim()) fail(id, 'subject placement: the subject should be the sentence itself');
  if (c.placement === 'body' && !(inBody === 1 && inBodyLines.length === 1 && !inBodyLines[0].startsWith('>'))) fail(id, 'body placement: sentence must sit once in unquoted body text');
  if (c.placement === 'quoted' && !(inBody === 1 && inBodyLines.length === 1 && inBodyLines[0].startsWith('>'))) fail(id, 'quoted placement: sentence must sit once on a line starting with >');
  const start = s.toLowerCase().split(/\s+/).slice(0, 3).join(' ');
  if (stopStarts.has(start)) fail(id, `deciding sentence opens like ${stopStarts.get(start)}`); else stopStarts.set(start, id);
});

// ---- cross-case checks -----------------------------------------------------------------------------------
const seenBodies = new Map();
const shingleSets = cases.map((c) => (c.draft?.body?.text ? shingles(c.draft.body.text.split('\n').filter((l) => !l.startsWith('>')).join(' ')) : new Set()));
cases.forEach((c, i) => {
  const text = c.draft?.body?.text;
  if (!text) return;
  const key = text.replace(/\s+/g, ' ').trim().toLowerCase();
  if (seenBodies.has(key)) fail(c.id, `duplicate body of ${seenBodies.get(key)}`); else seenBodies.set(key, c.id);
  for (let j = 0; j < i; j++) {
    const a = shingleSets[i], b = shingleSets[j];
    if (a.size < 12 || b.size < 12) continue;
    let shared = 0; for (const x of a) if (b.has(x)) shared++;
    const sim = shared / (a.size + b.size - shared);
    if (sim > 0.35) fail(c.id, `body overlaps ${cases[j].id} (4-gram Jaccard ${sim.toFixed(2)})`);
  }
});

// ---- composition ------------------------------------------------------------------------------------------
const stopTotal = Object.values(counts.stops).reduce((a, b) => a + b, 0);
if (checkpoint) {
  if (counts.pass > PASS_TOTAL) fail('composition', `more than ${PASS_TOTAL} passes`);
  for (const [k, q] of Object.entries(STOP_QUOTA)) if (counts.stops[k] > q) fail('composition', `more than ${q} ${k} stops`);
} else {
  if (cases.length !== TOTAL) fail('composition', `expected ${TOTAL} cases, found ${cases.length}`);
  if (counts.pass !== PASS_TOTAL) fail('composition', `expected ${PASS_TOTAL} passes, found ${counts.pass}`);
  for (const [k, q] of Object.entries(STOP_QUOTA)) if (counts.stops[k] !== q) fail('composition', `expected ${q} ${k} stops, found ${counts.stops[k]}`);
  if (industries.size < 60) fail('composition', `only ${industries.size} distinct industries among passes (need 60)`);
  if (placements.body < 36 || placements.quoted < 8 || placements.subject < 3 || placements.subject > 8) fail('composition', `placement mix ${JSON.stringify(placements)} is outside body>=36, quoted>=8, subject 3-8`);
  if (quotedPasses < 25) fail('composition', `only ${quotedPasses} passes quote earlier mail (need 25)`);
  for (const v of ['UK', 'US', 'AU']) if ((english[v] ?? 0) < 50) fail('composition', `fewer than 50 ${v} cases`);
  if (Math.min(...passWordCounts) > 15 || Math.max(...passWordCounts) < 200) fail('composition', 'pass length range too narrow (need a body of <=15 words and one of >=200)');
}

// ---- README agreement ---------------------------------------------------------------------------------------
if (!checkpoint) {
  const readme = fs.readFileSync(path.join(dir, 'README.md'), 'utf8');
  const lines = readme.split(/\r?\n/);
  const row = (prefix) => lines.find((l) => l.startsWith(prefix));
  const numbers = (l, from, to) => l.split('|').slice(from, to).map((x) => Number(x.trim().replaceAll('*', '')));
  for (const category of CATEGORIES) {
    const l = row(`| ${category} |`);
    if (!l) { fail('README', `missing composition row ${category}`); continue; }
    const n = numbers(l, 2, 6);
    const stops = category in STOP_QUOTA ? counts.stops[category] : 0;
    const passes = category === 'none' ? counts.pass : 0;
    if (n[0] !== stops || n[1] !== 0 || n[2] !== passes || n[3] !== stops + passes) fail('README', `composition row ${category} differs from cases (${n.join('/')} vs ${stops}/0/${passes})`);
  }
  const t = row('| **Total** |');
  if (!t) fail('README', 'missing total row'); else {
    const n = numbers(t, 2, 6);
    if (n[0] !== stopTotal || n[1] !== 0 || n[2] !== counts.pass || n[3] !== cases.length) fail('README', 'total row differs from cases');
  }
  for (const p of PLACEMENTS) {
    const l = row(`| ${p} |`);
    if (!l) fail('README', `missing placement row ${p}`); else if (numbers(l, 2, 3)[0] !== placements[p]) fail('README', `placement row ${p} differs (${numbers(l, 2, 3)[0]} vs ${placements[p]})`);
  }
  for (const [v, n] of Object.entries(english)) {
    const l = row(`| ${v} |`);
    if (!l) fail('README', `missing English variant row ${v}`); else if (numbers(l, 2, 3)[0] !== n) fail('README', `English row ${v} differs (${numbers(l, 2, 3)[0]} vs ${n})`);
  }
  const ind = lines.find((l) => /^Industries \(\d+ distinct\)/.test(l));
  if (!ind || Number(ind.match(/\((\d+) distinct\)/)[1]) !== industries.size) fail('README', `Industries line missing or differs from ${industries.size}`);
  for (const i of industries) if (!readme.includes(i)) { fail('README', `industry "${i}" is not listed`); break; }
  if (!readme.includes('claude-sonnet-5-5')) fail('README', 'author model id missing');
  const pinned = readme.match(/Frozen cases SHA-256: `([0-9a-f]{64})`/);
  if (!pinned) fail('README', 'frozen SHA-256 line missing'); else if (pinned[1] !== sha256) fail('README', 'frozen SHA-256 differs from cases.jsonl (' + sha256 + ')');
  const med = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  const l = row('| words (pass bodies) |');
  if (!l) fail('README', 'missing words row'); else {
    const n = numbers(l, 2, 6);
    const got = [Math.min(...passWordCounts), med(passWordCounts), Math.round(passWordCounts.reduce((a, b) => a + b, 0) / passWordCounts.length), Math.max(...passWordCounts)];
    if (n.join() !== got.join()) fail('README', `words row ${n.join('/')} differs from ${got.join('/')} (min/median/mean/max)`);
  }
}

// ---- report -------------------------------------------------------------------------------------------------
const med = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const summary = {
  mode: checkpoint ? 'checkpoint' : 'full',
  cases_sha256: sha256,
  total: cases.length,
  pass: counts.pass,
  stops: { total: stopTotal, ...counts.stops },
  stop_placements: placements,
  english,
  distinct_pass_industries: industries.size,
  passes_with_quoted_history: quotedPasses,
  pass_words: passWordCounts.length ? { min: Math.min(...passWordCounts), median: med(passWordCounts), mean: Math.round(passWordCounts.reduce((a, b) => a + b, 0) / passWordCounts.length), max: Math.max(...passWordCounts) } : null,
  errors: errors.length
};
console.log(JSON.stringify(summary, null, 2));
for (const e of errors.slice(0, 80)) console.log(`ERROR ${e}`);
if (errors.length > 80) console.log(`... and ${errors.length - 80} more errors`);
console.log(`progress: pass ${counts.pass}/${PASS_TOTAL}; stops ${Object.entries(counts.stops).map(([k, v]) => `${k} ${v}/12`).join(', ')}; placements ${JSON.stringify(placements)}; industries ${industries.size}; quoted passes ${quotedPasses}`);
console.log(errors.length ? `FAILED:${errors.length} error(s)` : `OK: ${cases.length} cases (${summary.mode})`);
if (args.has('--write-receipt')) {
  if (errors.length) console.log('Receipt not written: validation failed.');
  else { fs.writeFileSync(path.join(dir, 'validation.json'), JSON.stringify({ ...summary, validator: 'validate.mjs', node: process.version }, null, 2) + '\n', 'utf8'); console.log('Wrote validation.json'); }
}
process.exitCode = errors.length ? 1 : 0;
