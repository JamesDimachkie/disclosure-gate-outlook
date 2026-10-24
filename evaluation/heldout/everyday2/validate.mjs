// Validator for the everyday2 held-out set. No dependencies. Node 24.
//
//   node evaluation/heldout/everyday2/validate.mjs                 full validation (quotas enforced)
//   node evaluation/heldout/everyday2/validate.mjs --checkpoint    partial run: per-case checks only;
//                                                                  quotas and README agreement are reported, not enforced
//   node evaluation/heldout/everyday2/validate.mjs --write-receipt write validation.json next to cases.jsonl (only when everything passes)
//
// Checks: JSON lines and schema (as run.mjs reads it), sequential unique ids, category/expectation pairing,
// one-line SPEC rationale naming the right section, composition quotas, duplicate bodies, outside-only
// recipients by exact domain with a lookalike screen, .example/.test addresses only, no attachments, no
// large visible recipient lists, the deciding sentence present verbatim exactly once in its stated placement
// and quoted in the rationale, a numeric screen (card-like groups, IBAN-like strings, long digit runs,
// SSN/NI shapes, secret-token prefixes), industry and placement spread, and README table agreement.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
for (const a of args) if (!['--checkpoint', '--write-receipt'].includes(a)) { console.error(`Unknown argument ${a}`); process.exit(2); }
const checkpoint = args.includes('--checkpoint');
const writeReceipt = args.includes('--write-receipt');

const CATEGORIES = ['secrets', 'payment', 'government_id', 'personal', 'economics', 'negotiation', 'remark', 'lookalike', 'exposed_list', 'file', 'none'];
const STOP_SECTION = { secrets: '§5.1', personal: '§5.4', economics: '§5.5', negotiation: '§5.6', remark: '§5.7' };
const PLACEMENTS = ['body', 'quoted', 'subject'];
const VARIANTS = ['UK', 'US', 'AU', 'NZ', 'IE', 'CA', 'ZA', 'IN', 'SG'];
const QUOTA = { total: 360, pass: 300, stopPerCategory: 12, industries: 60 };

const problems = [];
const warnings = [];
const fail = (id, msg) => problems.push(`${id}: ${msg}`);
const warn = (id, msg) => warnings.push(`${id}: ${msg}`);

function luhn(digits) {
  let sum = 0, alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return sum % 10 === 0;
}
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const row = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = row[0]; row[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[n];
}
const confusable = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/rn/g, 'm').replace(/vv/g, 'w').replace(/cl/g, 'd').replace(/[1i|]/g, 'l').replace(/0/g, 'o');
const count = (hay, needle) => { let c = 0, i = 0; while ((i = hay.indexOf(needle, i)) !== -1) { c++; i += needle.length; } return c; };
const domainOf = (address) => address.slice(address.lastIndexOf('@') + 1).toLowerCase();
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const firstWords = (s, n) => s.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').trim().split(/\s+/).slice(0, n).join(' ');

function numericScreen(id, label, text) {
  for (const m of text.matchAll(/\d{9,}/g)) fail(id, `${label}: digit run of ${m[0].length} digits (${m[0]})`);
  for (const m of text.matchAll(/(?:\d[ -]?){12,18}\d/g)) {
    const digits = m[0].replace(/\D/g, '');
    if (digits.length >= 13 && digits.length <= 19) fail(id, `${label}: card-like group of ${digits.length} digits${luhn(digits) ? ' (Luhn passes)' : ''}: ${m[0]}`);
  }
  for (const m of text.matchAll(/\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]){11,30}\b/g)) fail(id, `${label}: IBAN-like string: ${m[0]}`);
  for (const m of text.matchAll(/\b\d{3}-\d{2}-\d{4}\b/g)) fail(id, `${label}: SSN-shaped number: ${m[0]}`);
  for (const m of text.matchAll(/\b[A-CEGHJ-PR-TW-Z]{2} ?\d{2} ?\d{2} ?\d{2} ?[A-D]\b/g)) fail(id, `${label}: NI-shaped identifier: ${m[0]}`);
  for (const m of text.matchAll(/\b\d{2}-\d{7}\b/g)) fail(id, `${label}: nine-digit identifier shape: ${m[0]}`);
  for (const m of text.matchAll(/AKIA[0-9A-Z]{8,}|ghp_[A-Za-z0-9]{8,}|github_pat_|xox[bpa]-|sk_live_|sk_test_|AIza[0-9A-Za-z_-]{8,}|sk-ant-|\bsk-[A-Za-z0-9]{12,}|-----BEGIN|\beyJ[A-Za-z0-9_-]{10,}\.|mongodb(?:\+srv)?:\/\/|postgres(?:ql)?:\/\/[^\s]*:[^\s]*@/g)) fail(id, `${label}: secret-token shape: ${m[0]}`);
}

async function main() {
  const casesPath = path.join(here, 'cases.jsonl');
  const readmePath = path.join(here, 'README.md');
  const raw = await fs.readFile(casesPath, 'utf8');
  const readme = await fs.readFile(readmePath, 'utf8').catch(() => null);
  const lines = raw.replace(/\r\n/g, '\n').trimEnd().split('\n');
  const cases = [];
  lines.forEach((line, i) => {
    try { cases.push(JSON.parse(line)); } catch { fail(`line ${i + 1}`, 'invalid JSON'); }
  });
  if (raw.includes('\r')) fail('file', 'cases.jsonl contains carriage returns');

  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, { stop: 0, prompt: 0, pass: 0 }]));
  const bodies = new Map(), normalizedBodies = new Map(), subjects = new Map();
  const industries = new Map(), placements = { body: 0, quoted: 0, subject: 0 }, variants = new Map();
  const openers = new Map(), decidingSentences = new Map();
  const lengths = [], buckets = { 'one-liner (<=15 words)': 0, 'short (16-60)': 0, 'medium (61-150)': 0, 'long (>150)': 0 };
  let quotedReplies = 0, signatures = 0, groups = 0, ccCases = 0, multiRecipient = 0;

  cases.forEach((c, index) => {
    const id = typeof c.id === 'string' ? c.id : `index ${index}`;
    const expectedId = `everyday2-${String(index + 1).padStart(3, '0')}`;
    if (c.id !== expectedId) fail(id, `id should be ${expectedId}`);
    if (!/^[a-z_][a-z0-9_]*-\d{3}$/.test(String(c.id))) fail(id, 'id does not match the runner pattern');
    if (!CATEGORIES.includes(c.category_expected)) fail(id, `unknown category ${c.category_expected}`);
    if (!['stop', 'pass'].includes(c.expect)) fail(id, `expect must be stop or pass, got ${c.expect}`);
    if (c.expect === 'pass' && c.category_expected !== 'none') fail(id, 'pass cases must have category none');
    if (c.expect === 'stop' && !STOP_SECTION[c.category_expected]) fail(id, `stop category ${c.category_expected} is not one of the five in scope`);
    if (c.category_expected === 'none' && c.expect !== 'pass') fail(id, 'category none must pass');
    if (counts[c.category_expected] && ['stop', 'prompt', 'pass'].includes(c.expect)) counts[c.category_expected][c.expect]++;
    if (c.internal_domains !== undefined) fail(id, 'internal_domains is not used in this set');

    if (typeof c.why !== 'string' || /[\r\n]/.test(c.why) || !/SPEC §/.test(c.why)) fail(id, 'why must be one line containing "SPEC §"');
    else if (c.expect === 'stop' && !c.why.includes(STOP_SECTION[c.category_expected])) fail(id, `why must cite ${STOP_SECTION[c.category_expected]}`);
    else if (c.expect === 'pass' && !/§5\b|§5\./.test(c.why)) warn(id, 'pass rationale does not cite §5');

    const meta = c.meta ?? {};
    if (typeof meta.industry !== 'string' || !meta.industry.trim()) fail(id, 'meta.industry missing');
    else industries.set(meta.industry.trim().toLowerCase(), (industries.get(meta.industry.trim().toLowerCase()) ?? 0) + 1);
    if (!VARIANTS.includes(meta.variant)) fail(id, `meta.variant must be one of ${VARIANTS.join(', ')}`);
    else variants.set(meta.variant, (variants.get(meta.variant) ?? 0) + 1);

    const d = c.draft;
    if (!d || typeof d !== 'object') { fail(id, 'draft missing'); return; }
    if (!d.from || typeof d.from.address !== 'string' || !/^[^@\s]+@[^@\s]+$/.test(d.from.address)) { fail(id, 'invalid from address'); return; }
    if (typeof d.from.name !== 'string') fail(id, 'from.name missing');
    const own = domainOf(d.from.address);
    const ownName = own.split('.').slice(0, -1).join('.');
    const addresses = [d.from.address];
    let visible = 0;
    for (const field of ['to', 'cc', 'bcc']) {
      if (!Array.isArray(d[field])) { fail(id, `${field} must be an array`); continue; }
      for (const r of d[field]) {
        if (typeof r?.name !== 'string' || typeof r?.address !== 'string' || !['person', 'group'].includes(r?.kind)) { fail(id, `invalid recipient in ${field}`); continue; }
        if (!/^[^@\s]+@[^@\s]+$/.test(r.address)) { fail(id, `malformed recipient address ${r.address}`); continue; }
        if (r.kind === 'group') groups++;
        addresses.push(r.address);
        if (field !== 'bcc') visible++;
        const dom = domainOf(r.address);
        if (dom === own) fail(id, `recipient ${r.address} is inside by exact domain`);
        if (dom.endsWith('.' + own) || own.endsWith('.' + dom)) fail(id, `recipient ${r.address} is a subdomain relation of the sender domain`);
        const name = dom.split('.').slice(0, -1).join('.');
        if (name === ownName) fail(id, `recipient ${r.address} shares the sender domain name`);
        else {
          if (levenshtein(name, ownName) <= 2) fail(id, `recipient domain ${dom} is within two edits of the sender domain`);
          if (confusable(name) === confusable(ownName)) fail(id, `recipient domain ${dom} is a confusable match of the sender domain`);
          if (Math.min(name.length, ownName.length) >= 4 && (name.includes(ownName) || ownName.includes(name))) fail(id, `recipient domain ${dom} contains or is contained by the sender domain name`);
        }
      }
    }
    if (d.to.length + d.cc.length + d.bcc.length === 0) fail(id, 'no recipients');
    if (visible > 5) fail(id, `${visible} visible recipients; keep lists small`);
    if (d.cc.length) ccCases++;
    if (d.to.length + d.cc.length > 1) multiRecipient++;
    for (const a of addresses) {
      const dom = domainOf(a);
      if (!/\.(example|test)$/.test(dom)) fail(id, `address ${a} is not under .example or .test`);
      if (dom.split('.').length !== 2) fail(id, `address ${a} should be a plain name.example or name.test domain`);
      if (!/^[a-z0-9.-]+$/.test(dom)) fail(id, `address ${a} has an unusual domain character`);
    }
    if (typeof d.subject !== 'string') fail(id, 'subject missing');
    if (d.body?.format !== 'text' || typeof d.body?.text !== 'string') { fail(id, 'body must be {format:"text", text}'); return; }
    if (!Array.isArray(d.attachments) || d.attachments.length !== 0) fail(id, 'attachments must be an empty array');
    if (d.subject.length > 200) fail(id, 'subject unusually long');
    const subject = d.subject, body = d.body.text;
    if (!body.trim()) fail(id, 'empty body');
    if (/\\n|\$\{|`/.test(body)) fail(id, 'body contains a literal backslash-n, template marker or backtick');

    const key = body.trim();
    if (bodies.has(key)) fail(id, `body duplicates ${bodies.get(key)}`); else bodies.set(key, id);
    const norm = body.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (normalizedBodies.has(norm)) fail(id, `body is a normalized duplicate of ${normalizedBodies.get(norm)}`); else normalizedBodies.set(norm, id);
    const skey = subject.trim().toLowerCase();
    if (skey) { if (subjects.has(skey)) warn(id, `subject repeats ${subjects.get(skey)}`); else subjects.set(skey, id); }

    numericScreen(id, 'subject', subject);
    numericScreen(id, 'body', body);
    if (c.expect === 'pass') {
      if (/\b(password|passcode|pin|passphrase)\b\s*(is|:|=)\s*\S/i.test(body + '\n' + subject)) warn(id, 'pass case states a password-like value');
      if (/\b(code|combination|combo)\b\s*(is|:|=)\s*\d/i.test(body + '\n' + subject)) warn(id, 'pass case states a code-like numeric value');
    }

    const w = words(body);
    lengths.push(w);
    if (w <= 15) buckets['one-liner (<=15 words)']++; else if (w <= 60) buckets['short (16-60)']++; else if (w <= 150) buckets['medium (61-150)']++; else buckets['long (>150)']++;
    const bodyLines = body.split('\n');
    if (bodyLines.some((l) => /^\s*>/.test(l))) quotedReplies++;
    if (/\n(cheers|thanks|regards|kind regards|best|many thanks|ta|best regards|warm regards|sincerely|all the best|thank you|ngā mihi|slán|rgds|yours),?\s*\n/i.test(body + '\n')) signatures++;

    if (c.expect === 'stop') {
      const ds = c.deciding_sentence;
      if (typeof ds !== 'string' || !ds.trim() || /[\r\n]/.test(ds)) { fail(id, 'deciding_sentence must be a non-empty single line'); return; }
      if (!PLACEMENTS.includes(c.placement)) { fail(id, `placement must be one of ${PLACEMENTS.join(', ')}`); return; }
      placements[c.placement]++;
      if (typeof c.why === 'string' && !c.why.includes(ds)) fail(id, 'why does not quote the deciding sentence verbatim');
      const inSubject = count(subject, ds), inBody = count(body, ds);
      if (inSubject + inBody !== 1) fail(id, `deciding sentence occurs ${inSubject + inBody} times across subject and body (expected exactly once)`);
      else if (c.placement === 'subject') { if (inSubject !== 1) fail(id, 'placement is subject but the sentence is in the body'); }
      else {
        if (inBody !== 1) fail(id, `placement is ${c.placement} but the sentence is in the subject`);
        else {
          const line = bodyLines.find((l) => l.includes(ds));
          if (!line) fail(id, 'deciding sentence spans more than one body line');
          else {
            const quoted = /^\s*>/.test(line);
            if (c.placement === 'quoted' && !quoted) fail(id, 'placement is quoted but the sentence is not on a > line');
            if (c.placement === 'body' && quoted) fail(id, 'placement is body but the sentence is on a > line');
          }
        }
      }
      const opener = firstWords(ds, 3);
      if (openers.has(opener)) fail(id, `deciding sentence opens like ${openers.get(opener)} ("${opener}")`); else openers.set(opener, id);
      const dkey = ds.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      if (decidingSentences.has(dkey)) fail(id, `deciding sentence duplicates ${decidingSentences.get(dkey)}`); else decidingSentences.set(dkey, id);
    } else {
      if (c.deciding_sentence !== undefined || c.placement !== undefined) fail(id, 'pass cases carry no deciding sentence or placement');
    }
  });

  // Composition and quotas.
  const total = cases.length;
  const passTotal = cases.filter((c) => c.expect === 'pass').length;
  const stopTotal = cases.filter((c) => c.expect === 'stop').length;
  const quota = (ok, msg) => (ok ? null : (checkpoint ? warn : fail)('quota', msg));
  quota(total === QUOTA.total, `total is ${total}, target ${QUOTA.total}`);
  quota(passTotal === QUOTA.pass, `pass total is ${passTotal}, target ${QUOTA.pass}`);
  for (const cat of Object.keys(STOP_SECTION)) quota(counts[cat].stop === QUOTA.stopPerCategory, `${cat} stops: ${counts[cat].stop}, target ${QUOTA.stopPerCategory}`);
  for (const cat of CATEGORIES) if (!STOP_SECTION[cat] && cat !== 'none') quota(counts[cat].stop + counts[cat].prompt + counts[cat].pass === 0, `${cat} should be empty`);
  quota(industries.size >= QUOTA.industries, `${industries.size} distinct industries, target at least ${QUOTA.industries}`);
  quota(placements.body > placements.quoted && placements.quoted > placements.subject && placements.subject > 0, `placements should run body > quoted > subject > 0, got ${JSON.stringify(placements)}`);
  for (const v of ['UK', 'US', 'AU']) quota((variants.get(v) ?? 0) > 0, `no ${v} English cases`);
  quota([...variants.keys()].some((v) => !['UK', 'US', 'AU'].includes(v)), 'no cases in another English variant');

  // README table agreement.
  const soft = checkpoint ? warn : fail;
  let readmeAgrees = null;
  if (readme) {
    readmeAgrees = true;
    const rlines = readme.split(/\r?\n/);
    for (const cat of CATEGORIES) {
      const row = rlines.find((l) => l.startsWith(`| ${cat} |`));
      if (!row) { readmeAgrees = false; soft('readme', `missing table row for ${cat}`); continue; }
      const n = row.split('|').slice(2, 6).map((x) => Number(x.trim()));
      const c = counts[cat];
      if (!(n[0] === c.stop && n[1] === c.prompt && n[2] === c.pass && n[3] === c.stop + c.prompt + c.pass)) { readmeAgrees = false; soft('readme', `row ${cat} says ${n.join('/')} but JSONL has ${c.stop}/${c.prompt}/${c.pass}/${c.stop + c.prompt + c.pass}`); }
    }
    const totalRow = rlines.find((l) => l.startsWith('| **Total** |'));
    if (!totalRow) { readmeAgrees = false; soft('readme', 'missing total row'); }
    else {
      const t = totalRow.split('|').slice(2, 6).map((x) => Number(x.trim().replaceAll('*', '')));
      if (!(t[0] === stopTotal && t[1] === 0 && t[2] === passTotal && t[3] === total)) { readmeAgrees = false; soft('readme', `total row says ${t.join('/')} but JSONL has ${stopTotal}/0/${passTotal}/${total}`); }
    }
    if (!/never tune/i.test(readme)) soft('readme', 'custody note ("never tune ...") missing');
  } else soft('readme', 'README.md not found');

  // Report.
  const sorted = [...lengths].sort((a, b) => a - b);
  const median = sorted.length ? (sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2) : 0;
  const mean = sorted.length ? Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length) : 0;
  const summary = {
    set: 'everyday2', mode: checkpoint ? 'checkpoint' : 'full', validated_at: new Date().toISOString(), node: process.version,
    cases_sha256: createHash('sha256').update(raw).digest('hex'), total, stop: stopTotal, pass: passTotal,
    composition: Object.fromEntries(CATEGORIES.map((c) => [c, { ...counts[c], total: counts[c].stop + counts[c].prompt + counts[c].pass }])),
    placements, variants: Object.fromEntries([...variants.entries()].sort()), industries_count: industries.size, industries: [...industries.keys()].sort(),
    lengths: { words_min: sorted[0] ?? 0, words_median: median, words_mean: mean, words_max: sorted[sorted.length - 1] ?? 0, buckets },
    quoted_reply_cases: quotedReplies, signature_cases: signatures, group_recipients: groups, cc_cases: ccCases, multi_recipient_cases: multiRecipient,
    readme_agrees: readmeAgrees, warnings: warnings.length, problems: problems.length,
  };
  console.log(JSON.stringify(summary, null, 2));
  if (warnings.length) { console.log(`\nWarnings (${warnings.length}):`); for (const w of warnings) console.log('  ' + w); }
  if (problems.length) { console.log(`\nProblems (${problems.length}):`); for (const p of problems) console.log('  ' + p); }
  const ok = problems.length === 0;
  console.log(`\n${ok ? 'OK' : 'FAIL'}: ${total} cases, ${stopTotal} stop, ${passTotal} pass, ${problems.length} problem(s), ${warnings.length} warning(s)${checkpoint ? ' [checkpoint]' : ''}`);
  if (writeReceipt) {
    if (!ok) console.log('Receipt not written: problems remain.');
    else if (checkpoint) console.log('Receipt not written in checkpoint mode.');
    else { await fs.writeFile(path.join(here, 'validation.json'), JSON.stringify({ ...summary, ok: true }, null, 2) + '\n', 'utf8'); console.log('Wrote validation.json'); }
  }
  process.exitCode = ok ? 0 : 1;
}
main().catch((e) => { console.error(`Validator failed: ${e.message}`); process.exitCode = 1; });
