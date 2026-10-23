// Recognizers for values with a checkable shape (spec §5.1 to §5.3): secrets and tokens, payment cards
// and bank accounts, and government identifiers. Where rules.mjs reads phrasing, these read the value
// itself and prove it: a prefix and a randomness test for a token, Luhn for a card, mod-97 for an IBAN,
// the ABA checksum for a routing number, the issuing ranges for an SSN. Where the shape alone is not
// proof (nine digits, six digits, an ID number) they also need the words that name it, looked for in a
// short window of the whole text, because a label often sits on the line above its value ("Routing
// number:" then "021000021") and every line is its own sentence. Each detector is
// {id, category, subkind, find(sentence, ctx)}: find returns the spans to highlight in the sentence
// ([{start, end, subkind?}]), and ctx = {text, offset} is the whole text and the sentence's start in it.
// `labelled` marks the detectors that give way to another number's label: in a table, a hit in a
// column whose header is such a label (columnKind 'number') is that number (rules.mjs).
// Plain JavaScript only (no Node APIs, no atob, no regex lookbehind, which older WebKit cannot parse):
// this runs inside Outlook. Every pattern is linear: bounded quantifiers, no nested repetition over
// the same characters.
import { indexed } from './regex.mjs';

const AP = "['’]";

// ---------- shared checks ----------

// Text around a sentence span, for label words that sit just before or after a value.
function around(ctx, sentence, start, end, before, after) {
  if (!ctx) return { pre: sentence.slice(Math.max(0, start - before), start), post: sentence.slice(end, end + after) };
  const s = ctx.offset + start, e = ctx.offset + end;
  return { pre: ctx.text.slice(Math.max(0, s - before), s), post: ctx.text.slice(e, e + after) };
}

export function luhn(digits) {
  let sum = 0, alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    alt = !alt;
  }
  return digits.length > 0 && sum % 10 === 0;
}

// Words that turn a would-be secret into a template, a mask or documentation.
const PLACEHOLDER_WORDS = /example|sample|dummy|fake|placeholder|redacted|your|xxxx|\*\*\*|\.\.\.|•••|test|changeme|insert|here|token|secret|password|passwd/i;
const ASCENDING = '0123456789abcdefghijklmnopqrstuvwxyz';

function entropy(s) {
  const counts = new Map();
  for (const ch of s) counts.set(ch, (counts.get(ch) || 0) + 1);
  let h = 0;
  for (const n of counts.values()) { const p = n / s.length; h -= p * Math.log2(p); }
  return h;
}

// Whether a token body looks machine-generated rather than typed: long enough, letters and digits,
// no placeholder word, no run of one character, no alphabet or counting run, and enough entropy.
// Random base62 of 16 characters carries about 3.6 bits a character; English-like and padded
// strings sit well under 3.
export function looksRandom(body, { min = 16, needDigit = true } = {}) {
  const s = String(body).replace(/[-_]/g, '');
  if (s.length < min) return false;
  if (PLACEHOLDER_WORDS.test(body)) return false;
  if (!/[a-z]/i.test(s) || (needDigit && !/\d/.test(s))) return false;
  if (/(.)\1{4,}/.test(s)) return false;
  const lower = s.toLowerCase();
  for (let i = 0; i + 6 <= ASCENDING.length; i++) if (lower.includes(ASCENDING.slice(i, i + 6))) return false;
  return entropy(s) >= 3;
}

// A password value that is a mask, a template or a variable rather than a password.
export function isPlaceholderPassword(value) {
  const v = String(value).replace(/^["'“‘]|["'”’]$/g, '');
  if (!v) return true;
  if (/^(.)\1*$/.test(v)) return true; // ********, xxxx, 0000
  if (/^[<[{(].*[>\]})]$/.test(v) || /^\$\{?[A-Z_][A-Z0-9_]*\}?$|^%\w+%$|\{\{/.test(v)) return true; // <password>, [pw], ${DB_PASS}, %PASS%, {{secret}}
  if (/^(?:<|\[|\{|\$\{|%[A-Za-z_])/.test(v)) return true; // the first word of a template cut at a space: "<your password>"
  if (/^(?:https?:\/\/|www\.)/i.test(v)) return true; // a link ("reset your password: https://...") is not the password
  return /^(?:password|passwd|pass|pwd|pw|secret|changeme|yourpassword|your_password|mypassword|user|username|admin|redacted|hidden|xxx+|\*+|example|sample|placeholder|none|null|empty)$/i.test(v) || /^\*{3,}|x{4,}/i.test(v);
}

// ---------- 5.1 secrets ----------

// Case-sensitive: these prefixes are written exactly so.
const TOKEN = indexed([
  String.raw`(?<aws>\b(?:AKIA|ASIA)[A-Z0-9]{16}\b)`,
  String.raw`(?<github>\b(?:gh[pousr]_[A-Za-z0-9]{36,255}|github_pat_[A-Za-z0-9_]{50,255})\b)`,
  String.raw`(?<slack>\bxox[abpr]-[A-Za-z0-9-]{20,250})`,
  String.raw`(?<stripe>\b[sr]k_live_[A-Za-z0-9]{20,247}\b)`,
  String.raw`(?<google>\bAIza[A-Za-z0-9_-]{35}(?![A-Za-z0-9_-]))`,
  String.raw`(?<anthropic>\bsk-ant-[A-Za-z0-9_-]{32,300})`,
  String.raw`(?<openai>\bsk-(?!ant-)(?:proj-|svcacct-|admin-)?[A-Za-z0-9_-]{20,300})`,
  String.raw`(?<jwt>\bey[JI][A-Za-z0-9_-]{8,2000}\.ey[A-Za-z0-9_-]{8,4000}\.[A-Za-z0-9_-]{16,1000})`,
].join('|'), 'g');
// Assignments in config or .env style: aws_secret_access_key = ..., client_secret: ..., API_KEY=...,
// STRIPE_API_KEY=... Case-insensitive, unlike the prefixes above: environment variables are written in
// capitals, config keys in lower case. Up to four name parts may come before the key name.
const ASSIGN = indexed(String.raw`\b(?:[a-z0-9]{1,30}_){0,4}(?:aws_secret_access_key|client_secret|secret_access_key|secret_key|api_secret|api_key|api_token|apikey|access_token|auth_token|refresh_token|private_key_id)["']?\s{0,3}[:=]\s{0,3}["']?(?<value>[A-Za-z0-9_\-+/=.]{20,300})`, 'gi');
const TOKEN_HINT = /AKIA|ASIA|gh[pousr]_|github_pat_|xox[abpr]-|_live_|AIza|sk-|ey[JI]|_(?:secret|key|token|id)\b|apikey/i;

// base64url to a string of bytes, without atob (not every Outlook runtime has it).
const B64URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
function decodeSegment(seg) {
  if (!/^[A-Za-z0-9_-]+$/.test(seg) || seg.length % 4 === 1) return null;
  let bits = 0, value = 0, out = '';
  for (const ch of seg) {
    value = (value << 6) | B64URL.indexOf(ch);
    bits += 6;
    if (bits >= 8) { bits -= 8; out += String.fromCharCode((value >> bits) & 0xff); value &= (1 << bits) - 1; }
  }
  return out;
}

function tokenOk(groups, text) {
  if (groups.aws) return looksRandom(groups.aws.slice(4), { min: 16, needDigit: false });
  if (groups.github) return looksRandom(groups.github.replace(/^(?:gh[pousr]_|github_pat_)/, ''));
  if (groups.slack) {
    // xoxb-<team>-<bot>-<secret>: numeric ids then a random part.
    const parts = groups.slack.slice(5).split('-');
    return parts.length >= 2 && /^\d{6,}$/.test(parts[0]) && looksRandom(parts[parts.length - 1], { min: 12, needDigit: false });
  }
  if (groups.stripe) return looksRandom(groups.stripe.slice(8));
  if (groups.google) return looksRandom(groups.google.slice(4));
  if (groups.anthropic) return looksRandom(groups.anthropic.slice(7), { min: 32 });
  if (groups.openai) {
    // A product code like "sk-blue-widget-large" is words joined by hyphens: the key needs one long
    // random run.
    const body = groups.openai.replace(/^sk-(?:proj-|svcacct-|admin-)?/, '');
    return !PLACEHOLDER_WORDS.test(body) && body.split(/[-_]/).some((part) => looksRandom(part, { min: 20 }));
  }
  if (groups.jwt) {
    const [header] = groups.jwt.split('.');
    const json = decodeSegment(header);
    if (!json) return false;
    try { const h = JSON.parse(json); return h && typeof h === 'object' && typeof h.alg === 'string' && !/^none$/i.test(h.alg); } catch { return false; }
  }
  return false;
}

// "-----BEGIN RSA PRIVATE KEY-----" with real key material after it (not "..." or a short stub).
const PEM = indexed(String.raw`-----BEGIN (?:(?:RSA|DSA|EC|OPENSSH|ENCRYPTED|PGP) )?PRIVATE KEY(?: BLOCK)?-----`, 'g');
function pemBody(after) {
  const end = after.indexOf('-----END');
  const block = (end < 0 ? after : after.slice(0, end)).slice(0, 6000);
  const lines = block.split(/[\r\n]+|\s{2,}|\s(?=[A-Za-z0-9+/=]{40,})/).map((l) => l.trim()).filter((l) => l && !/^[\w-]+:/.test(l));
  return lines.filter((l) => /^[A-Za-z0-9+/=]+$/.test(l)).join('');
}

// Key material: at least 64 base64 characters with the spread of random bytes (base64 of random data
// carries close to 6 bits a character; a stub of AAAA or a repeated line does not).
function pemRandom(body) {
  const head = body.slice(0, 256);
  return body.length >= 64 && !/(.)\1{9,}/.test(head) && entropy(head) >= 4.5;
}

// postgres://app:S3cr3t!x@db.internal:5432/main and friends.
const URL_CRED = indexed(String.raw`\b(?:postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|rediss?|amqps?|mssql|sqlserver|oracle|cockroachdb|clickhouse|couchdb|neo4j(?:\+s)?|s?ftps?|smtps?|ldaps?):\/\/(?<user>[^\s:@/]{1,64}):(?<pass>[^\s@/]{1,128})@(?<host>[A-Za-z0-9][A-Za-z0-9.-]{0,252})`, 'gi');
// Server=...;Database=...;User Id=...;Password=...; (ADO.NET, ODBC).
const ADO_PASS = indexed(String.raw`\b(?:password|pwd)\s{0,3}=\s{0,3}(?<pass>"[^"]{1,128}"|'[^']{1,128}'|[^;\s"']{1,128})`, 'gi');
const ADO_KEYS = /\b(?:server|data\s+source|host|address|addr|network\s+address|initial\s+catalog|database|user\s+id|uid|driver|provider|dsn)\s{0,3}=/i;
const JDBC = indexed(String.raw`\bjdbc:[a-z0-9]{2,20}:[^\s?]{1,300}[?;&](?:[^\s]{0,300}?[&;])?password=(?<pass>[^&\s;]{1,128})`, 'gi');

// ---------- 5.2 payment and bank ----------

const CARD_BRANDS = [
  { re: /^4/, lengths: [13, 16, 19] }, // Visa
  { re: /^(?:5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d\d|27[01]\d|2720)/, lengths: [16] }, // Mastercard
  { re: /^3[47]/, lengths: [15] }, // American Express
  { re: /^(?:6011|64[4-9]|65)/, lengths: [16, 17, 18, 19] }, // Discover
  { re: /^(?:30[0-5]|36|3[89])/, lengths: [14, 16] }, // Diners Club
  { re: /^35(?:2[89]|[3-8]\d)/, lengths: [16, 17, 18, 19] }, // JCB
  { re: /^62/, lengths: [16, 17, 18, 19] }, // UnionPay
];
const knownCard = (d) => CARD_BRANDS.some((b) => b.re.test(d) && b.lengths.includes(d.length));
// Card words, and the labels of the numbers a card number is most often confused with.
const CARD_WORDS = /\b(?:card|cards|credit|debit|visa|mastercard|master\s?card|amex|american\s+express|diners|jcb|unionpay|cvv2?|cvc2?|security\s+code|exp(?:iry|iration|ires|\.)?|valid\s+(?:thru|through)|cardholder|card\s?holder|name\s+on\s+card)\b/i;
const NUMBER_LABELS = /\b(?:invoice|inv|order|ord|po|purchase\s+order|tracking|track|shipment|waybill|awb|consignment|reference|ref|confirmation|booking|reservation|ticket|case|claim|policy|member|membership|customer|loan|serial|s\/n|imei|meter|batch|lot|part|sku|item|model|phone|tel|telephone|fax|mobile|cell|call|ext|isbn|gtin|upc|ean|barcode|check|cheque|receipt|transaction|txn|matter|docket|file|permit|project|job|contract|drawing|sheet|plan|catalog|catalogue|style|article|patent|application|unit|lot|parcel|apn|folio|mls|listing)\b\.?\s*(?:number|no\.?|num|#|id)?\s*[:#-]?\s*$/i;
// The same labels written as a data key: "order_id": "...", orderId=..., invoice-no: ..., ref:
const KEY_LABEL = /(?:^|[^A-Za-z0-9])[A-Za-z]{0,30}?(?:order|invoice|inv|po|purchase_?order|tracking|shipment|reference|ref|confirmation|booking|reservation|ticket|case|claim|policy|member|customer|account|acct|loan|serial|sku|item|product|transaction|txn|receipt|record|request|user|object)[_-]?(?:id|no|num|number|ref|code|key)?["']?\s{0,3}[:=]\s{0,3}["']?\s{0,3}$/i;
// What a table column holds, from its header: 'number' under an invoice, order, reference or other
// number label (written as words, "Order ID", or as a data key, "order_id"), whose cells are that
// number whatever their shape; 'card' under card words or the usual short keys for a card number (cc,
// pan); otherwise null. The label decides first, as it does in prose.
const CARD_HEADER = /^(?:cc|ccn|pan|cc\s?(?:num|no|number)|card)$/i;
const headerWords = (header) => String(header || '').trim().replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
export function columnKind(header) {
  const raw = String(header || '').trim(), words = headerWords(raw);
  if (!raw) return null;
  if (NUMBER_LABELS.test(words + ':') || KEY_LABEL.test(raw + ':')) return 'number';
  if (CARD_HEADER.test(words) || CARD_WORDS.test(words)) return 'card';
  return null;
}
// The header as the words a detector reads before the cell's value ("card_number" → "card number").
export function columnLabel(header) {
  const words = headerWords(header);
  return CARD_HEADER.test(words) ? 'card number' : words;
}
// 13 to 19 digits: contiguous, in fours (4111 1111 1111 1111) or Amex's 4-6-5, one separator kind.
const CARD = indexed(String.raw`(?:\d{4}(?<sep>[ -])\d{4}(?:\k<sep>\d{4}){0,3}\k<sep>\d{1,4}|\d{4}(?<sep2>[ -])\d{6}\k<sep2>\d{4,5}|\d{13,19})(?![\w-]|[.,]\d)`, 'g');

// IBAN lengths from the SWIFT registry.
const IBAN_LENGTH = { AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29, BY: 28, CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, EG: 29, ES: 24, FI: 18, FO: 18, FR: 27, GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21, HU: 28, IE: 22, IL: 23, IQ: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28, LC: 32, LI: 21, LT: 20, LU: 20, LV: 21, LY: 25, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27, MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, SA: 24, SC: 31, SE: 24, SI: 19, SK: 24, SM: 27, ST: 25, SV: 28, TL: 23, TN: 24, TR: 26, UA: 29, VA: 22, VG: 24, XK: 20 };
// Groups of four may be split by a space, a tab or a no-break space (up to two, as copying from a PDF or a
// table leaves them). Any case: a country code in lower case ("gb82 west ...") needs the word IBAN just
// before it, since lower-case letters and digits in a row are also how hashes and file names look.
const IBAN = indexed(String.raw`\b[A-Z]{2}\d{2}(?:[ \t\u00a0]{0,2}[A-Z0-9]{4}){2,7}(?:[ \t\u00a0]{0,2}[A-Z0-9]{1,3})?(?![\w])`, 'gi');
const IBAN_WORD = /\biban\b[^\w\n]{0,12}$/i;
export function ibanValid(compact) {
  const iban = compact.toUpperCase();
  if (IBAN_LENGTH[iban.slice(0, 2)] !== iban.length || !/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) return false;
  const moved = iban.slice(4) + iban.slice(0, 4);
  let rem = 0;
  for (const ch of moved) {
    const v = ch <= '9' ? ch.charCodeAt(0) - 48 : ch.charCodeAt(0) - 55;
    rem = v > 9 ? (rem * 100 + v) % 97 : (rem * 10 + v) % 97;
  }
  return rem === 1;
}

const ROUTING = indexed(String.raw`\d{9}(?![\w-]|[.,]\d)`, 'g');
const ROUTING_WORDS = /\b(?:routing|aba|rtn|r\/t|transit|wire|ach|direct\s+deposit|bank)\b/i;
const ACCOUNT_NUMBER = indexed(String.raw`\b(?:account|acct|a\/c|acc)\b\.?\s{0,3}(?:number|no\.?|num|#)?\s{0,3}(?:is\s+)?[:#-]?\s{0,3}(?<n>\d[\d -]{2,18}\d)\b`, 'gi');
export function abaValid(d) {
  if (!/^\d{9}$/.test(d)) return false;
  const p = Number(d.slice(0, 2));
  if (!((p <= 12) || (p >= 21 && p <= 32) || (p >= 61 && p <= 72) || p === 80)) return false;
  const n = [...d].map(Number);
  return (3 * (n[0] + n[3] + n[6]) + 7 * (n[1] + n[4] + n[7]) + (n[2] + n[5] + n[8])) % 10 === 0 && !/^(\d)\1+$/.test(d);
}

const SORT_CODE = indexed(String.raw`\d{2}(?<sep>[- ]?)\d{2}\k<sep>\d{2}(?![\w-]|[.,]\d)`, 'g');
const SORT_WORDS = /\bsort[\s-]?code\b[^\d\n]{0,12}$/i;

// ---------- 5.3 government identifiers ----------

const SSN_DASHED = indexed(String.raw`(?<a>\d{3})-(?<g>\d{2})-(?<s>\d{4})(?![\w-]|[.,]\d)`, 'g');
const SSN_LOOSE = indexed(String.raw`(?<a>\d{3}) ?(?<g>\d{2}) ?(?<s>\d{4})(?![\w-]|[.,]\d)`, 'g');
const SSN_WORDS = /\b(?:ssn|ss#|ss\s+no\.?|soc\.?\s+sec\.?|social\s+security)\b[^\d\n]{0,25}$/i;
const SSN_WORDS_ANY = /\b(?:ssn|ss#|social\s+security)\b/i;
// Published examples, never issued: the Woolworth wallet card and the SSA's own sample.
const SSN_EXAMPLES = new Set(['078051120', '219099999']);
export function ssnValid(a, g, s) {
  const area = Number(a);
  return area !== 0 && area !== 666 && area < 900 && g !== '00' && s !== '0000' && !SSN_EXAMPLES.has(a + g + s);
}

// UK National Insurance number: two letters (D, F, I, Q, U, V never; O never second), six digits, A to D.
const NINO_ANY = indexed(String.raw`\b(?<p>[a-ceghj-prstw-z][a-ceghj-nprstw-z]) ?\d{2} ?\d{2} ?\d{2} ?[a-d](?![\w])`, 'gi');
const NINO_BAD = new Set(['BG', 'GB', 'NK', 'KN', 'TN', 'NT', 'ZZ']);
const NINO_WORDS = /\b(?:national\s+insurance|nino|ni\s+(?:number|no\.?|#))\b/i;

const SIN = indexed(String.raw`\d{3}(?<sep>[- ]?)\d{3}\k<sep>\d{3}(?![\w-]|[.,]\d)`, 'g');
const SIN_WORDS = /(?:\bSIN\b|\bsocial\s+insurance\b|\bnuméro\s+d['’]assurance\s+sociale\b|\bNAS\b)/;

// "passport number is 548213976", "Driver's licence: D4471-22903", "tax ID 98-7654321".
const ID_LABEL = indexed(String.raw`\b(?<label>(?<kind>passport|driver${AP}?s?\s+licen[cs]e|driving\s+licen[cs]e|(?:national|government|state|federal)\s+(?:id|identity|identification)(?:\s+card)?|identity\s+card|id\s+card|tax\s+(?:id|identification|file|reference|registration)|taxpayer\s+(?:id|identification)|personal\s+(?:id|identity)\s+(?:number|code)|(?:TIN|ITIN|EIN|TFN|UTR|DL|NIF|NIE|DNI|PPSN|BSN|CPF|CURP|PESEL|aadhaar))(?:\s+(?:card\s+)?(?:number|no\.?|num|#|id))?\s{0,3}(?:is|was|:|=|-|#|of)?\s{0,3}:?\s{0,3})(?<value>[A-Za-z0-9][A-Za-z0-9 -]{3,28})`, 'gi');
const ACRONYMS = /^(?:TIN|ITIN|EIN|TFN|UTR|DL|NIF|NIE|DNI|PPSN|BSN|CPF|CURP|PESEL)$/;
function idSubkind(kind) {
  const k = kind.toLowerCase();
  if (k === 'passport') return 'passport';
  if (/licen/.test(k) || k === 'dl') return 'licence';
  if (/tax|^(?:tin|itin|ein|tfn|utr|nif)$/.test(k)) return 'tax';
  if (k === 'ssn') return 'ssn';
  if (k === 'sin') return 'sin';
  if (k === 'nino') return 'ni';
  return 'national-id';
}
// The ID value: leading tokens that carry digits, or short letter groups between them ("AB 12 34 56 C").
function idValue(raw) {
  const tokens = raw.split(/(\s+)/);
  let out = '';
  for (let i = 0; i < tokens.length; i += 2) {
    const t = tokens[i];
    if (!t) break;
    const ok = /\d/.test(t) ? /^[A-Za-z0-9-]+$/.test(t) && !/-$/.test(t) : /^[A-Z]{1,3}$/.test(t) && i + 2 < tokens.length && /\d/.test(tokens[i + 2]) || (/^[A-Z]$/.test(t) && out);
    if (!ok) break;
    out += (out ? tokens[i - 1] : '') + t;
  }
  return out.replace(/[-]+$/, '');
}
// "our EIN", "our company's EIN", "our firm’s federal tax ID": the sender organization's own number.
const OUR_TAX = new RegExp(String.raw`\bour\s+(?:(?:company|firm|business|organi[sz]ation|practice|agency)${AP}s\s+|federal\s+|business\s+)?$`, 'i');
const DATE_LIKE = /^(?:(?:19|20)\d{2}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.](?:\d{2}|\d{4})|(?:19|20)\d{2})$/;

// ---------- the detectors ----------

// `notAfter` is a class of characters that must not come right before a match, the job of a lookbehind,
// which older WebKit (Outlook for Mac on macOS before 13.3) can't parse. A match it refuses is retried
// one character on, so a number inside a longer one is never read as a shorter number.
const each = (re, sentence, fn, notAfter = null) => {
  re.lastIndex = 0;
  const out = [];
  for (let m; (m = re.exec(sentence));) {
    if (!m[0]) { re.lastIndex++; continue; }
    if (notAfter && m.index > 0 && notAfter.test(sentence[m.index - 1])) { re.lastIndex = m.index + 1; continue; }
    const hit = fn(m);
    if (hit) out.push(...(Array.isArray(hit) ? hit : [hit]));
  }
  return out;
};
const NUMBER_EDGE = /[\w.,/+-]/, ID_EDGE = /[\w-]/;
const span = (m, group) => { const [start, end] = group ? m.indices.groups[group] : m.indices[0]; return { start, end }; };

export const DETECTORS = Object.freeze([
  // 5.1 secrets: tokens in known formats, private keys, connection strings with a password.
  { id: 'secret.token', category: 'access', subkind: 'secret', hint: TOKEN_HINT, find: (s) => {
    const tokens = each(TOKEN, s, (m) => tokenOk(m.groups, s) && span(m));
    // An assignment whose value is itself a provider token (OPENAI_API_KEY=sk-...) highlights the token.
    const assigned = each(ASSIGN, s, (m) => {
      const [start, end] = m.indices.groups.value;
      return !tokens.some((t) => t.start < end && start < t.end) && looksRandom(m.groups.value, { min: 20 }) && span(m);
    });
    return tokens.concat(assigned);
  } },
  { id: 'secret.private-key', category: 'access', subkind: 'private-key', hint: /-----BEGIN/, find: (s, ctx) => each(PEM, s, (m) => {
    const after = ctx ? ctx.text.slice(ctx.offset + m.index + m[0].length) : s.slice(m.index + m[0].length);
    const body = pemBody(after);
    return pemRandom(body) && span(m);
  }) },
  { id: 'secret.connection-url', category: 'access', subkind: 'connection', hint: /:\/\//, find: (s) => each(URL_CRED, s, (m) => !isPlaceholderPassword(m.groups.pass) && !/^(?:user|username|login)$/i.test(m.groups.pass) && span(m)) },
  { id: 'secret.connection-ado', category: 'access', subkind: 'connection', hint: /(?:password|pwd)\s*=/i, find: (s) => each(ADO_PASS, s, (m) => {
    const window = s.slice(Math.max(0, m.index - 300), m.index + m[0].length + 300);
    return ADO_KEYS.test(window) && window.includes(';') && !isPlaceholderPassword(m.groups.pass) && span(m);
  }) },
  { id: 'secret.connection-jdbc', category: 'access', subkind: 'connection', hint: /jdbc:/i, find: (s) => each(JDBC, s, (m) => !isPlaceholderPassword(m.groups.pass) && span(m)) },

  // 5.2 payment cards: Luhn, plus a brand prefix of the right length or card words nearby. The label right
  // before the number decides first: after an invoice, order, tracking, phone or other number label
  // (or that label as a data key, "order_id":) it is that number, whatever card words the email has
  // elsewhere ("Please pay by credit card. Order: 4111..."). Card words count only in the number's own
  // sentence; the label may sit on the line above ("Order:" then the number).
  { id: 'payment.card', category: 'financial', subkind: 'card', labelled: true, hint: /\d{4}/, find: (s, ctx) => each(CARD, s, (m) => {
    const digits = m[0].replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19 || !luhn(digits) || /^(\d)\1+$/.test(digits)) return null;
    const { pre } = around(ctx, s, m.index, m.index + m[0].length, 80, 0);
    if (NUMBER_LABELS.test(pre) || KEY_LABEL.test(pre)) return null;
    const cardWords = CARD_WORDS.test(s.slice(Math.max(0, m.index - 80), m.index) + ' ' + s.slice(m.index + m[0].length, m.index + m[0].length + 60));
    return (knownCard(digits) || cardWords) ? span(m) : null;
  }, NUMBER_EDGE) },
  // IBAN: country length and mod-97; a match that ran into the next word is cut back to the length.
  // The highlight keeps the original characters; only the checksum reads the compact upper-case form.
  { id: 'payment.iban', category: 'financial', subkind: 'bank', hint: /[A-Z]{2}\d{2}/i, find: (s, ctx) => each(IBAN, s, (m) => {
    const len = IBAN_LENGTH[m[0].slice(0, 2).toUpperCase()];
    if (!len) return null;
    if (m[0].slice(0, 2) !== m[0].slice(0, 2).toUpperCase() && !IBAN_WORD.test(around(ctx, s, m.index, m.index, 20, 0).pre)) return null;
    let count = 0, cut = -1;
    for (let i = 0; i < m[0].length; i++) if (!/\s/.test(m[0][i]) && ++count === len) { cut = i + 1; break; }
    if (cut < 0 || (cut < m[0].length && !/\s/.test(m[0][cut]))) return null;
    return ibanValid(m[0].slice(0, cut).replace(/\s/g, '')) ? { start: m.index, end: m.index + cut } : null;
  }) },
  // US routing number: checksum and issuing prefix, routing or bank words before it, and an account
  // number nearby (the pair, never the routing number alone, which banks publish).
  { id: 'payment.routing', category: 'financial', subkind: 'bank', hint: /\d{9}/, find: (s, ctx) => each(ROUTING, s, (m) => {
    if (!abaValid(m[0])) return null;
    const { pre, post } = around(ctx, s, m.index, m.index + 9, 160, 160);
    if (!ROUTING_WORDS.test(pre.slice(-60))) return null;
    const near = pre + ' ' + post;
    ACCOUNT_NUMBER.lastIndex = 0;
    for (let a; (a = ACCOUNT_NUMBER.exec(near));) if (a.groups.n.replace(/\D/g, '') !== m[0] && a.groups.n.replace(/\D/g, '').length >= 4) return span(m);
    return null;
  }, NUMBER_EDGE) },
  // UK sort code (only after the words "sort code") with an 8-digit account number next to it.
  { id: 'payment.sort-code', category: 'financial', subkind: 'bank', hint: /sort[\s-]?code/i, find: (s, ctx) => each(SORT_CODE, s, (m) => {
    const { pre, post } = around(ctx, s, m.index, m.index + m[0].length, 40, 80);
    if (!SORT_WORDS.test(pre)) return null;
    const after = /^\D{0,40}?(\d{8})(?!\d)/.exec(post);
    const before = /\b(?:account|acct|a\/c|acc)\b\.?\D{0,20}(\d{8})(?!\d)\D{0,30}$/i.exec(pre);
    return after || before ? span(m) : null;
  }, ID_EDGE) },

  // 5.3 US Social Security number, written ddd-dd-dddd in a valid range (not after another number's
  // label), or nine digits right after SSN words.
  { id: 'identity.ssn', category: 'identity', subkind: 'ssn', labelled: true, hint: /\d{3}[- ]?\d{2}[- ]?\d{4}/, find: (s, ctx) => [
    ...each(SSN_DASHED, s, (m) => {
      if (!ssnValid(m.groups.a, m.groups.g, m.groups.s)) return null;
      const { pre } = around(ctx, s, m.index, m.index + m[0].length, 40, 0);
      return (!NUMBER_LABELS.test(pre) || SSN_WORDS_ANY.test(pre)) ? span(m) : null;
    }, ID_EDGE),
    ...each(SSN_LOOSE, s, (m) => {
      if (!ssnValid(m.groups.a, m.groups.g, m.groups.s)) return null;
      const { pre } = around(ctx, s, m.index, m.index + m[0].length, 40, 0);
      return SSN_WORDS.test(pre) ? span(m) : null;
    }, ID_EDGE),
  ] },
  // UK National Insurance number by its format (in capitals), unless another number's label is right
  // before it; in any case after NI words.
  { id: 'identity.nino', category: 'identity', subkind: 'ni', labelled: true, hint: /[a-z]{2} ?\d{2} ?\d{2} ?\d{2} ?[a-d]/i, find: (s, ctx) => each(NINO_ANY, s, (m) => {
    if (NINO_BAD.has(m.groups.p.toUpperCase())) return null;
    const { pre } = around(ctx, s, m.index, m.index + m[0].length, 50, 0);
    const words = NINO_WORDS.test(pre);
    const capitals = m[0] === m[0].toUpperCase();
    if (words) return span(m);
    return capitals && !NUMBER_LABELS.test(pre) && !/\b(?:ref|reference|code|id|number|no\.?|#)\s*[:#-]?\s*$/i.test(pre) ? span(m) : null;
  }) },
  // Canadian Social Insurance Number: Luhn, never starting 0 or 8, after SIN words.
  { id: 'identity.sin', category: 'identity', subkind: 'sin', hint: /\d{3}[- ]?\d{3}[- ]?\d{3}/, find: (s, ctx) => each(SIN, s, (m) => {
    const d = m[0].replace(/\D/g, '');
    if (!luhn(d) || /^[08]/.test(d)) return null;
    const { pre } = around(ctx, s, m.index, m.index + m[0].length, 40, 0);
    return SIN_WORDS.test(pre) ? span(m) : null;
  }, ID_EDGE) },
  // A passport, licence, national ID or tax ID number given right after its name. A company's own tax
  // number ("our EIN is ...") is business information it puts on every W-9 and invoice, so it is left.
  { id: 'identity.labelled', category: 'identity', subkind: 'national-id', hint: /passport|licen[cs]e|\bid\b|identi|tax|\b(?:TIN|ITIN|EIN|TFN|UTR|DL|NIF|NIE|DNI|PPSN|BSN|CPF|CURP|PESEL)\b|aadhaar/i, find: (s) => each(ID_LABEL, s, (m) => {
    const kind = m.groups.kind;
    if (ACRONYMS.test(kind.toUpperCase()) && kind !== kind.toUpperCase()) return null; // "tin" or "dl" as ordinary words
    const value = idValue(m.groups.value);
    const digits = value.replace(/\D/g, '');
    if (digits.length < 5 || value.replace(/[\s-]/g, '').length < 6 || DATE_LIKE.test(value) || /^(\d)\1+$/.test(digits) || /x{3,}|\*{3,}/i.test(value)) return null;
    if (/^(?:EIN|TIN|tax|taxpayer|federal)/i.test(kind) && OUR_TAX.test(s.slice(Math.max(0, m.index - 40), m.index))) return null;
    const [start] = m.indices.groups.label;
    const valueStart = m.indices.groups.value[0];
    return { start, end: valueStart + value.length, subkind: idSubkind(kind) };
  }) },
]);

// The detector hits in one sentence: [{detector, start, end, subkind}].
export function detect(sentence, ctx) {
  const out = [];
  for (const d of DETECTORS) {
    if (d.hint && !d.hint.test(sentence)) continue;
    for (const hit of d.find(sentence, ctx)) out.push({ detector: d, start: hit.start, end: hit.end, subkind: hit.subkind || d.subkind });
  }
  return out;
}
