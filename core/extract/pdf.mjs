// PDF text for the check. It reads what a person would read on the page: every page's content
// streams (and the form XObjects they draw), decoded through each font's ToUnicode map or its simple
// encoding. It fails closed: an encrypted file, an unsupported filter, a font it cannot map, or output
// that does not read as text throws, and the file then counts as "can't check". A scanned PDF has no
// text, which also counts as "can't check". Lines are joined with a space, and a larger vertical gap
// becomes a line break, so sentences that wrap on the page stay whole.
import { inflateZlib } from './inflate.mjs';
import { latin1, fromHex, concatBytes, utf8, decodeBytes, startsAt } from '../bytes.mjs';
import { OCR_MAX_PIXELS, OCR_MAX_PAGES } from '../ocr-policy.mjs';

const WS = new Set([0x00, 0x09, 0x0a, 0x0c, 0x0d, 0x20]);
const DELIM = new Set([0x28, 0x29, 0x3c, 0x3e, 0x5b, 0x5d, 0x7b, 0x7d, 0x2f, 0x25]);
const MAX_OPS = 2_000_000;
// One document's work, counted across every stream, form and annotation it draws (a form drawn a
// thousand times counts a thousand times), so any PDF returns in about a second or fails closed as
// 'too_complex': content operators, bytes the lexer passes over, and bytes decoded from streams.
const MAX_DOC_OPS = 2_000_000;
const FORM_COST = 32; // a drawn form also costs its setup, counted as this many operators
const MAX_SCANNED = 48 * 1024 * 1024;
const MAX_DECODED = 32 * 1024 * 1024;
const MAX_MAPPED = 1 << 20; // codes a font's ToUnicode or width ranges may fill
const newWork = () => ({ ops: 0, scanned: 0, decoded: 0 });
const spendScan = (work, n) => { if (work && (work.scanned += n) > MAX_SCANNED) fail('too_complex'); };

class PdfError extends Error {}
const fail = (why) => { throw new PdfError(why); };

// ---- lexer and object parser ------------------------------------------------------------------
function lexer(buf, pos = 0, work = null) {
  const s = { buf, pos };
  const skip = () => {
    for (;;) {
      while (s.pos < buf.length && WS.has(buf[s.pos])) s.pos++;
      if (buf[s.pos] === 0x25) { while (s.pos < buf.length && buf[s.pos] !== 0x0a && buf[s.pos] !== 0x0d) s.pos++; continue; }
      return;
    }
  };
  function literal() {
    let depth = 1, out = [];
    s.pos++;
    while (s.pos < buf.length) {
      const c = buf[s.pos++];
      if (c === 0x5c) {
        const n = buf[s.pos++];
        const map = { 0x6e: 0x0a, 0x72: 0x0d, 0x74: 0x09, 0x62: 0x08, 0x66: 0x0c, 0x28: 0x28, 0x29: 0x29, 0x5c: 0x5c };
        if (map[n] !== undefined) out.push(map[n]);
        else if (n >= 0x30 && n <= 0x37) {
          let v = n - 0x30;
          for (let k = 0; k < 2 && buf[s.pos] >= 0x30 && buf[s.pos] <= 0x37; k++) v = v * 8 + (buf[s.pos++] - 0x30);
          out.push(v & 0xff);
        } else if (n === 0x0d) { if (buf[s.pos] === 0x0a) s.pos++; }
        else if (n !== 0x0a) out.push(n);
      } else if (c === 0x28) { depth++; out.push(c); }
      else if (c === 0x29) { if (--depth === 0) break; out.push(c); }
      else out.push(c);
    }
    if (depth !== 0) fail('bad_string');
    return { str: Uint8Array.from(out) };
  }
  function hex() {
    s.pos++;
    const end = buf.indexOf(0x3e, s.pos);
    if (end < 0) { spendScan(work, buf.length - s.pos); fail('bad_hex'); }
    let digits = latin1(buf.subarray(s.pos, end)).replace(/[^0-9a-fA-F]/g, '');
    s.pos = end + 1;
    if (digits.length % 2) digits += '0';
    return { str: fromHex(digits) };
  }
  function token() {
    const from = s.pos, t = next();
    spendScan(work, Math.max(0, s.pos - from));
    return t;
  }
  function next() {
    skip();
    if (s.pos >= buf.length) return null;
    const c = buf[s.pos];
    if (c === 0x28) return literal();
    if (c === 0x3c) { if (buf[s.pos + 1] === 0x3c) { s.pos += 2; return { op: '<<' }; } return hex(); }
    if (c === 0x3e && buf[s.pos + 1] === 0x3e) { s.pos += 2; return { op: '>>' }; }
    if (c === 0x5b || c === 0x5d || c === 0x7b || c === 0x7d) { s.pos++; return { op: String.fromCharCode(c) }; }
    if (c === 0x2f) {
      let e = s.pos + 1;
      while (e < buf.length && !WS.has(buf[e]) && !DELIM.has(buf[e])) e++;
      const name = latin1(buf.subarray(s.pos + 1, e)).replace(/#([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
      s.pos = e;
      return { name };
    }
    let e = s.pos;
    while (e < buf.length && !WS.has(buf[e]) && !DELIM.has(buf[e])) e++;
    if (e === s.pos) { s.pos++; return { op: String.fromCharCode(c) }; }
    const word = latin1(buf.subarray(s.pos, e));
    s.pos = e;
    if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(word)) return { num: Number(word) };
    return { op: word };
  }
  // A value: numbers (with "n g R" references folded in), names, strings, arrays, dictionaries.
  function value(t = token()) {
    if (!t) return null;
    if (t.num !== undefined) {
      const save = s.pos;
      const t2 = token();
      if (t2 && t2.num !== undefined && Number.isInteger(t.num) && Number.isInteger(t2.num)) {
        const t3 = token();
        if (t3 && t3.op === 'R') return { ref: t.num };
      }
      s.pos = save;
      return t.num;
    }
    if (t.op === '[') { const arr = []; for (let x = token(); x && x.op !== ']'; x = token()) arr.push(value(x)); return arr; }
    if (t.op === '<<') {
      const dict = {};
      for (let k = token(); k && k.op !== '>>'; k = token()) { if (k.name === undefined) continue; dict[k.name] = value(); }
      return { dict };
    }
    if (t.op === 'true') return true;
    if (t.op === 'false') return false;
    if (t.op === 'null') return null;
    return t;
  }
  return { state: s, token, value, skip };
}

// ---- the document ---------------------------------------------------------------------------
// An object header ("12 0 obj") ending just before `k`, where "obj" starts: {num, start} or null.
// Headers are found by their keyword and read backwards. A regular expression for the whole header
// backtracks through every run of digits and goes quadratic on a long one.
const isDigit = (c) => c >= 0x30 && c <= 0x39;
function headerBefore(buf, k) {
  let i = k;
  const run = (test) => { const end = i; while (i > 0 && test(buf[i - 1])) i--; return end - i; };
  if (!run((c) => WS.has(c) || c === 0x0b)) return null;
  if (!run(isDigit)) return null;
  if (!run((c) => WS.has(c) || c === 0x0b)) return null;
  const at = i, n = run(isDigit);
  if (!n || n > 10) return null;
  return { num: Number(latin1(buf.subarray(i, at))), start: i };
}
const WORD = /[A-Za-z0-9_]/;

function load(buf) {
  if (!latin1(buf.subarray(0, 1024)).includes('%PDF-')) fail('not_a_pdf');
  const text = latin1(buf);
  const objects = new Map(), work = newWork();
  const lastEnd = text.lastIndexOf('endstream');
  // A parse that fails is skipped (a damaged object); running out of budget is not.
  const tolerant = (fn) => { try { return fn(); } catch (error) { if (error.message === 'too_complex') throw error; return undefined; } };
  let trailer = null;
  // ISO 32000-1 F.3.4: a linearized PDF's first-page trailer carries Root; the
  // physically last (main-xref) trailer need not. Keep the latest Root-bearing
  // trailer, rather than overwriting it with that rootless dictionary. Explicit
  // null/broken Roots still fail, and encryption in either trailer is refused.
  const useTrailer = t => { if (t.Encrypt) fail('encrypted'); if (!trailer || t.Root !== undefined) trailer = t; };
  for (let at = 0; ;) {
    const k = text.indexOf('obj', at);
    if (k < 0) break;
    at = k + 3;
    if (WORD.test(text.charAt(k + 3))) continue;
    const head = headerBefore(buf, k);
    if (!head) continue;
    const lex = lexer(buf, k + 3, work);
    const v = tolerant(() => lex.value());
    if (v === undefined) continue;
    lex.skip();
    let stream = null;
    if (v && v.dict && startsAt(text, 'stream', lex.state.pos)) {
      let start = lex.state.pos + 6;
      if (buf[start] === 0x0d) start++;
      if (buf[start] === 0x0a) start++;
      const len = typeof v.dict.Length === 'number' ? v.dict.Length : -1;
      let end = len >= 0 && startsAt(text, 'endstream', skipWs(buf, start + len)) ? start + len : start <= lastEnd ? text.indexOf('endstream', start) : -1;
      if (end < 0) continue;
      if (len < 0) { while (end > start && (buf[end - 1] === 0x0a || buf[end - 1] === 0x0d)) end--; }
      stream = buf.subarray(start, end);
      at = end;
    }
    objects.set(head.num, { v, stream });
    if (v && v.dict && v.dict.Type?.name === 'XRef') useTrailer(v.dict);
  }
  for (const m of text.matchAll(/trailer\s*<</g)) { const t = tolerant(() => lexer(buf, m.index + 7, work).value().dict); if (t) useTrailer(t); }
  const doc = { objects, trailer, work, decoded: new Map(), fonts: new Map() };
  // Objects packed in object streams.
  for (const [, o] of [...objects]) {
    if (o.v?.dict?.Type?.name !== 'ObjStm' || !o.stream) continue;
    const data = decode(doc, o);
    const n = o.v.dict.N, first = o.v.dict.First;
    if (!Number.isSafeInteger(n) || n < 0 || n > 100000 || !Number.isSafeInteger(first) || first < 0 || first > data.length) fail('bad_object_stream');
    const head = lexer(data, 0, work);
    const pairs = [];
    for (let i = 0; i < n; i++) {
      const num = head.token(), off = head.token();
      if (!Number.isSafeInteger(num?.num) || num.num <= 0 || !Number.isSafeInteger(off?.num) || off.num < 0 || first + off.num >= data.length || head.state.pos > first) fail('bad_object_stream');
      pairs.push([num.num, off.num]);
    }
    for (const [num, off] of pairs) if (!objects.has(num)) { const v = tolerant(() => lexer(data, first + off, work).value()); if (v !== undefined) objects.set(num, { v, stream: null }); }
  }
  if (!trailer) fail('no_trailer');
  if (trailer.Encrypt) fail('encrypted');
  return doc;
}
function skipWs(buf, at) { while (at < buf.length && WS.has(buf[at])) at++; return at; }
const resolve = (doc, v, depth = 0) => { while (v && v.ref !== undefined && depth++ < 32) v = doc.objects.get(v.ref)?.v ?? null; return v; };
const dictOf = (doc, v) => resolve(doc, v)?.dict ?? null;
const objectOf = (doc, v) => (v && v.ref !== undefined ? doc.objects.get(v.ref) : null);

function ascii85(data) {
  const s = latin1(data).replace(/\s+/g, '').replace(/^<~/, '').replace(/~>.*$/, '');
  const out = [];
  let group = [];
  for (const ch of s) {
    if (ch === 'z' && !group.length) { out.push(0, 0, 0, 0); continue; }
    group.push(ch.charCodeAt(0) - 33);
    if (group.length === 5) { let v = 0; for (const d of group) v = v * 85 + d; out.push((v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255); group = []; }
  }
  if (group.length) { const n = group.length; while (group.length < 5) group.push(84); let v = 0; for (const d of group) v = v * 85 + d; out.push(...[(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255].slice(0, n - 1)); }
  return Uint8Array.from(out);
}
// LZWDecode (PDF 32000 section 7.4.4): variable-width codes from 9 to 12 bits, 256 clears the table,
// 257 ends the data. EarlyChange 1 (the default) widens the code one entry early. Output is bounded
// like Flate's; a code that is neither in the table nor the next one to be added is malformed.
function lzw(data, early, limit) {
  const out = [], table = [];
  for (let i = 0; i < 256; i++) table.push([i]);
  table.push(null, null);
  let width = 9, buf = 0, cnt = 0, pos = 0, prev = null;
  for (;;) {
    while (cnt < width && pos < data.length) { buf = (buf << 8 | data[pos++]) >>> 0; cnt += 8; }
    if (cnt < width) break;
    const code = (buf >>> (cnt - width)) & ((1 << width) - 1);
    cnt -= width; buf &= (1 << cnt) - 1;
    if (code === 256) { table.length = 258; width = 9; prev = null; continue; }
    if (code === 257) break;
    let entry;
    if (code < table.length && table[code]) entry = table[code];
    else if (code === table.length && prev) entry = [...prev, prev[0]];
    else fail('bad_lzw');
    if (out.length + entry.length > limit) fail('too_complex');
    for (const b of entry) out.push(b);
    if (prev && table.length < 4096) table.push([...prev, entry[0]]);
    prev = entry;
    if (table.length + early >= (1 << width) && width < 12) width++;
  }
  return Uint8Array.from(out);
}
// A stream's decoded bytes, kept per object so a form drawn on every page is decoded once. Every
// decoded byte counts against the document's budget.
function decode(doc, o) {
  if (doc.decoded && doc.decoded.has(o)) return doc.decoded.get(o);
  const d = o.v.dict, work = doc.work || newWork();
  const filters = [].concat(resolve(doc, d.Filter) ?? []).map((f) => resolve(doc, f)?.name);
  const parms = [].concat(resolve(doc, d.DecodeParms) ?? []).map((p) => { const v = resolve(doc, p); return v?.dict ?? v; });
  let data = o.stream;
  for (const [i, f] of filters.entries()) {
    const room = MAX_DECODED - work.decoded, parm = parms.length > 1 ? parms[i] : parms[0];
    // PNG and TIFF predictors are not decoded; refusing beats reading filtered bytes as text.
    if (resolve(doc, parm?.Predictor) > 1) fail('unsupported_filter');
    if (f === 'FlateDecode' || f === 'Fl') {
      try { data = inflateZlib(data, { maxOutputLength: Math.max(0, Math.min(10 * 1024 * 1024, room)) }); }
      catch (error) { fail(error.message === 'entry_too_large' && room < 10 * 1024 * 1024 ? 'too_complex' : 'bad_flate'); }
    } else if (f === 'ASCIIHexDecode' || f === 'AHx') { let h = latin1(data).replace(/[^0-9a-fA-F]/g, ''); if (h.length % 2) h += '0'; data = fromHex(h); }
    else if (f === 'ASCII85Decode' || f === 'A85') data = ascii85(data);
    else if (f === 'LZWDecode' || f === 'LZW') data = lzw(data, resolve(doc, parm?.EarlyChange) === 0 ? 0 : 1, Math.min(10 * 1024 * 1024, room));
    else fail('unsupported_filter');
    if ((work.decoded += data.length) > MAX_DECODED) fail('too_complex');
  }
  if (doc.decoded) doc.decoded.set(o, data);
  return data;
}

// ---- fonts ----------------------------------------------------------------------------------
const WIN_ANSI = { decode: bytes => decodeBytes(bytes, 'windows-1252') };
// The glyph names a /Differences array usually uses, beyond single letters and digits.
const GLYPHS = { space: ' ', exclam: '!', quotedbl: '"', numbersign: '#', dollar: '$', percent: '%', ampersand: '&', quotesingle: "'", quoteright: '’', quoteleft: '‘', parenleft: '(', parenright: ')', asterisk: '*', plus: '+', comma: ',', hyphen: '-', minus: '-', period: '.', slash: '/', colon: ':', semicolon: ';', less: '<', equal: '=', greater: '>', question: '?', at: '@', bracketleft: '[', backslash: '\\', bracketright: ']', underscore: '_', quotedblleft: '“', quotedblright: '”', endash: '–', emdash: '—', bullet: '•', ellipsis: '…', zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', fi: 'fi', fl: 'fl', ff: 'ff', ffi: 'ffi', ffl: 'ffl' };
// The Adobe Glyph List names for Latin-1 (U+00A0 to U+00FF, in order) and the rest of WinAnsi and
// StandardEncoding: accented letters, accents, currency and typographic marks.
'space exclamdown cent sterling currency yen brokenbar section dieresis copyright ordfeminine guillemotleft logicalnot hyphen registered macron degree plusminus twosuperior threesuperior acute mu paragraph periodcentered cedilla onesuperior ordmasculine guillemotright onequarter onehalf threequarters questiondown Agrave Aacute Acircumflex Atilde Adieresis Aring AE Ccedilla Egrave Eacute Ecircumflex Edieresis Igrave Iacute Icircumflex Idieresis Eth Ntilde Ograve Oacute Ocircumflex Otilde Odieresis multiply Oslash Ugrave Uacute Ucircumflex Udieresis Yacute Thorn germandbls agrave aacute acircumflex atilde adieresis aring ae ccedilla egrave eacute ecircumflex edieresis igrave iacute icircumflex idieresis eth ntilde ograve oacute ocircumflex otilde odieresis divide oslash ugrave uacute ucircumflex udieresis yacute thorn ydieresis'
  .split(' ').forEach((g, i) => { if (!(g in GLYPHS)) GLYPHS[g] = String.fromCharCode(0xa0 + i); });
Object.assign(GLYPHS, { Euro: '€', quotesinglbase: '‚', florin: 'ƒ', quotedblbase: '„', dagger: '†', daggerdbl: '‡', circumflex: 'ˆ', perthousand: '‰', Scaron: 'Š', guilsinglleft: '‹', OE: 'Œ', Zcaron: 'Ž',
  tilde: '˜', trademark: '™', scaron: 'š', guilsinglright: '›', oe: 'œ', zcaron: 'ž', Ydieresis: 'Ÿ', grave: '`', asciicircum: '^', asciitilde: '~', braceleft: '{', bar: '|', braceright: '}',
  breve: '˘', caron: 'ˇ', dotaccent: '˙', hungarumlaut: '˝', ogonek: '˛', ring: '˚', fraction: '⁄', Lslash: 'Ł', lslash: 'ł', dotlessi: 'ı', asteriskmath: '∗', nbspace: ' ', sfthyphen: '­',
  circlecopyrt: '©', periodcentered: '·', middot: '·', Gbreve: 'Ğ', gbreve: 'ğ', Idotaccent: 'İ', Scedilla: 'Ş', scedilla: 'ş', Cacute: 'Ć', cacute: 'ć', Ccaron: 'Č', ccaron: 'č', Ecaron: 'Ě', ecaron: 'ě',
  Rcaron: 'Ř', rcaron: 'ř', Nacute: 'Ń', nacute: 'ń', Sacute: 'Ś', sacute: 'ś', Zacute: 'Ź', zacute: 'ź', Zdotaccent: 'Ż', zdotaccent: 'ż', Aogonek: 'Ą', aogonek: 'ą', Eogonek: 'Ę', eogonek: 'ę', Ohungarumlaut: 'Ő', ohungarumlaut: 'ő', Uhungarumlaut: 'Ű', uhungarumlaut: 'ű', Uring: 'Ů', uring: 'ů' });
// A name the list doesn't hold may still follow its rules: "uniXXXX…" and "uXXXX" give code points,
// a suffix after a period is a variant of the same character (zero.oldstyle, a.sc), and an
// underscore joins the components of a ligature (f_f_i). Font-private names (g24, G065) stay unknown.
function glyphToText(g) {
  if (GLYPHS[g] !== undefined) return GLYPHS[g];
  if (/^[A-Za-z]$/.test(g)) return g;
  if (/^uni(?:[0-9A-F]{4})+$/.test(g)) { let out = ''; for (let i = 3; i < g.length; i += 4) { const c = parseInt(g.slice(i, i + 4), 16); if (c >= 0xd800 && c <= 0xdfff) return null; out += String.fromCharCode(c); } return out; }
  if (/^u[0-9A-F]{4,6}$/.test(g)) { const c = parseInt(g.slice(1), 16); return c <= 0x10ffff && (c < 0xd800 || c > 0xdfff) ? String.fromCodePoint(c) : null; }
  const base = g.split('.')[0];
  if (base !== g && base) return glyphToText(base);
  if (g.indexOf('_') > 0) { const parts = g.split('_').map(glyphToText); return parts.every((p) => p !== null) ? parts.join('') : null; }
  return null;
}

function parseCMap(data) {
  const text = latin1(data);
  const map = new Map();
  let widths = new Set(), spent = 0;
  const hexStr = (h) => h.replace(/[<>\s]/g, '');
  const unicode = (h) => { const hx = hexStr(h); let out = ''; for (let i = 0; i + 4 <= hx.length; i += 4) out += String.fromCharCode(parseInt(hx.slice(i, i + 4), 16)); return out; };
  for (const [, body] of text.matchAll(/begincodespacerange([\s\S]*?)endcodespacerange/g)) for (const m of body.matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g)) widths.add(m[1].length / 2);
  for (const [, body] of text.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
    for (const m of body.matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]*)>/g)) { map.set(parseInt(m[1], 16), unicode(m[2])); widths.add(m[1].length / 2); }
  }
  for (const [, body] of text.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
    for (const m of body.matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*(<[0-9a-fA-F]*>|\[[^\]]*\])/g)) {
      const lo = parseInt(m[1], 16), hi = parseInt(m[2], 16);
      widths.add(m[1].length / 2);
      if (hi - lo > 65535) continue;
      if (m[3].startsWith('[')) { const items = [...m[3].matchAll(/<([0-9a-fA-F]*)>/g)]; items.forEach((it, i) => map.set(lo + i, unicode(it[1]))); }
      else { const base = hexStr(m[3]); const head = base.slice(0, -4), last = parseInt(base.slice(-4) || '0', 16); if ((spent += hi - lo + 1) > MAX_MAPPED) fail('too_complex'); for (let c = lo; c <= hi; c++) map.set(c, unicode(head + (last + c - lo).toString(16).padStart(4, '0'))); }
    }
  }
  const bytes = widths.size === 1 ? [...widths][0] : widths.has(2) && !widths.has(1) ? 2 : 1;
  return { map, bytes };
}

// Glyph widths (thousandths of the font size) by code: /Widths for simple fonts, /W and /DW for the
// descendant of a composite font; 500 when a font carries none (a standard font).
function widthTable(doc, font) {
  const table = new Map();
  let fallback = 500, spent = 0;
  if (font.Subtype?.name === 'Type0') {
    const cid = dictOf(doc, (resolve(doc, font.DescendantFonts) || [])[0]);
    if (cid) {
      fallback = typeof cid.DW === 'number' ? cid.DW : 1000;
      const w = resolve(doc, cid.W) || [];
      for (let i = 0; i < w.length;) {
        const first = w[i], next = resolve(doc, w[i + 1]);
        if (Array.isArray(next)) { next.forEach((v, k) => table.set(first + k, resolve(doc, v))); i += 2; }
        else { if ((spent += Math.max(0, Math.min(next - first + 1, 65536))) > MAX_MAPPED) fail('too_complex'); for (let c = first; c <= next && c - first < 65536; c++) table.set(c, resolve(doc, w[i + 2])); i += 3; }
      }
    }
  } else {
    const widths = resolve(doc, font.Widths), first = resolve(doc, font.FirstChar);
    if (Array.isArray(widths) && typeof first === 'number') widths.forEach((v, k) => table.set(first + k, resolve(doc, v)));
    const missing = dictOf(doc, font.FontDescriptor)?.MissingWidth;
    if (table.size) fallback = typeof missing === 'number' ? missing : 0;
  }
  return (code) => { const v = table.get(code); return typeof v === 'number' ? v : fallback; };
}

// {decode(bytes) → text or null, advance(bytes) → [width in thousandths, spaces]} for one font.
function fontDecoder(doc, fontRef) {
  const font = dictOf(doc, fontRef);
  if (!font) return null;
  if (doc.fonts && doc.fonts.has(font)) return doc.fonts.get(font);
  const made = makeDecoder(doc, font);
  if (doc.fonts) doc.fonts.set(font, made);
  return made;
}
function makeDecoder(doc, font) {
  if (font.Subtype?.name === 'Type3') fail('unmapped_font');
  const width = widthTable(doc, font);
  const tu = objectOf(doc, font.ToUnicode);
  let bytes = 1, decode1;
  if (tu?.stream) {
    const cmap = parseCMap(decode(doc, tu));
    bytes = font.Subtype?.name === 'Type0' ? 2 : cmap.bytes;
    decode1 = (code) => cmap.map.get(code);
  } else if (font.Subtype?.name === 'Type0') {
    return null; // composite glyph codes need a ToUnicode map
  } else {
    const enc = resolve(doc, font.Encoding);
    const diffs = new Map();
    if (enc?.dict?.Differences) { let code = 0; for (const x of enc.dict.Differences) { if (typeof x === 'number') code = x; else if (x?.name) diffs.set(code++, x.name); } }
    decode1 = (code) => (diffs.has(code) ? glyphToText(diffs.get(code)) ?? undefined : WIN_ANSI.decode(Uint8Array.of(code)));
  }
  const codes = (s) => { const out = []; for (let i = 0; i + bytes <= s.length; i += bytes) out.push(bytes === 2 ? (s[i] << 8) | s[i + 1] : s[i]); return out; };
  return {
    decode(s) { if (s.length % bytes) return null; let out = ''; for (const c of codes(s)) { const u = decode1(c); if (u === undefined || u === '') return null; out += u; } return out; },
    advance(s) { let w = 0, spaces = 0; for (const c of codes(s)) { w += width(c); if (bytes === 1 && c === 32) spaces++; } return [w, spaces, codes(s).length]; },
  };
}

// ---- pages and content streams --------------------------------------------------------------
function pages(doc) {
  const out = [];
  const root = dictOf(doc, doc.trailer.Root);
  if (!root) fail('no_catalog');
  const seen = new Set();
  const walk = (ref, inherited, depth = 0) => {
    if (depth > 256) fail('too_complex');
    const key = ref?.ref;
    if (key !== undefined) { if (seen.has(key)) fail('page_tree'); seen.add(key); }
    const node = dictOf(doc, ref);
    if (!node) fail('missing_page');
    const resources = node.Resources !== undefined ? node.Resources : inherited;
    const kids = resolve(doc, node.Kids);
    if (node.Type?.name === 'Pages' || Array.isArray(kids)) {
      if (!Array.isArray(kids)) fail('page_tree');
      const before = out.length;
      for (const kid of kids) walk(kid, resources, depth + 1);
      const count = resolve(doc, node.Count);
      if (count !== undefined && (!Number.isSafeInteger(count) || count < 0 || count !== out.length - before)) fail('page_tree');
      return;
    }
    out.push({ node, resources });
  };
  walk(root.Pages, null);
  return out;
}

// /Contents is a stream reference, an array of them, or a reference to such an array.
function contentOf(doc, contents) {
  let list = contents;
  if (list && list.ref !== undefined && !doc.objects.get(list.ref)?.stream) list = resolve(doc, list);
  if (contents && !list) fail('missing_content');
  const parts = [];
  for (const ref of Array.isArray(list) ? list : list ? [list] : []) {
    const o = objectOf(doc, ref);
    if (!o?.stream) fail('missing_content');
    parts.push(decode(doc, o), utf8('\n'));
  }
  return concatBytes(parts);
}

function runContent(doc, data, resources, sink, depth = 0) {
  if (depth > 8) fail('form_depth');
  const res = dictOf(doc, resources) || {};
  const fonts = dictOf(doc, res.Font) || {};
  const xobjects = dictOf(doc, res.XObject) || {};
  const work = doc.work || (doc.work = newWork());
  if ((work.ops += FORM_COST) > MAX_DOC_OPS) fail('too_complex');
  const lex = lexer(data, 0, work);
  const stack = [];
  let decoder = null, size = 12, tm = [1, 0, 0, 1, 0, 0], tlm = [1, 0, 0, 1, 0, 0], leading = 0, ops = 0, tc = 0, tw = 0, th = 1;
  const cache = new Map();
  const setFont = (name) => { if (!cache.has(name)) cache.set(name, fontDecoder(doc, fonts[name])); decoder = cache.get(name); };
  const move = (tx, ty) => { tlm = [tlm[0], tlm[1], tlm[2], tlm[3], tlm[4] + tx * tlm[0] + ty * tlm[2], tlm[5] + tx * tlm[1] + ty * tlm[3]]; tm = tlm.slice(); };
  // Show a string where the text matrix stands, then advance it by the glyphs' widths and spacing.
  const shift = (units) => { tm = [tm[0], tm[1], tm[2], tm[3], tm[4] + units * tm[0], tm[5] + units * tm[1]]; };
  const show = (s) => {
    if (!s.length) return; // an empty string draws nothing, whatever its font
    if (!decoder) { sink.unmapped(); return; }
    const t = decoder.decode(s);
    const [w, spaces, n] = decoder.advance(s);
    const start = tm.slice();
    shift(((w / 1000) * size + tc * n + tw * spaces) * th);
    if (t === null) sink.unmapped(); else sink.text(t, start, size, tm[4]);
  };
  for (let t = lex.token(); t; t = lex.token()) {
    if (++ops > MAX_OPS || ++work.ops > MAX_DOC_OPS) fail('too_complex');
    if (t.op === undefined || t.op === '[' || t.op === '<<') { stack.push(t.op ? lex.value(t) : t.num !== undefined ? t.num : t); continue; }
    const op = t.op, a = stack.splice(0);
    const num = (i) => (typeof a[i] === 'number' ? a[i] : 0);
    switch (op) {
      case 'BT': tm = [1, 0, 0, 1, 0, 0]; tlm = tm.slice(); break;
      case 'Tf': if (a[0]?.name !== undefined) setFont(a[0].name); size = Math.abs(num(1)) || size; break;
      case 'Td': move(num(0), num(1)); break;
      case 'TD': leading = -num(1); move(num(0), num(1)); break;
      case 'Tm': tlm = [num(0), num(1), num(2), num(3), num(4), num(5)]; tm = tlm.slice(); break;
      case 'TL': leading = num(0); break;
      case 'Tc': tc = num(0); break;
      case 'Tw': tw = num(0); break;
      case 'Tz': th = num(0) / 100 || 1; break;
      case 'T*': move(0, -leading); break;
      case 'Tj': if (a[0]?.str) show(a[0].str); break;
      case "'": move(0, -leading); if (a[0]?.str) show(a[0].str); break;
      case '"': tw = num(0); tc = num(1); move(0, -leading); if (a[2]?.str) show(a[2].str); break;
      case 'TJ': for (const x of Array.isArray(a[0]) ? a[0] : []) { if (x?.str) show(x.str); else if (typeof x === 'number') shift((-x / 1000) * size * th); } break;
      case 'Do': {
        const o = objectOf(doc, xobjects[a[0]?.name]);
        if (o?.stream && o.v.dict.Subtype?.name === 'Form') runContent(doc, decode(doc, o), o.v.dict.Resources ?? resources, sink, depth + 1);
        else sink.image(); // An unresolved displayed object must also require scan coverage.
        break;
      }
      case 'BI': fail('scan_rendering'); break;
      case 'scn': case 'SCN': if (dictOf(doc, res.Pattern)) fail('pattern'); break;
      default: break;
    }
  }
}

// Assemble shown runs into text. On one baseline, a gap wider than a fraction of the font size
// between where the last run ended and where this one starts is a word space (kerned runs touch). A
// move of about a line is a space (wrapped text); more than 1.6 lines is a paragraph break.
function assembler() {
  // Runs are collected in a list and joined once. Whether the text so far ends in a space is kept
  // from the last run: testing the growing string itself rescans or flattens it on every run.
  const out = [];
  let blank = true, lastY = null, lastEnd = null, lastSize = 12, images = 0;
  const scale = (tm) => Math.hypot(tm[2], tm[3]) || 1;
  return {
    unmapped() { fail('unmapped_font'); },
    image() { images++; },
    text(t, tm, size, end) {
      if (!t) return;
      const eff = size * scale(tm), y = tm[5], x = tm[4];
      const line = Math.max(eff, lastSize);
      if (lastY !== null && Math.abs(y - lastY) >= 0.5 * line) { if (!blank) out.push(Math.abs(y - lastY) > 1.6 * line ? '\n' : ' '); }
      else if (lastEnd !== null && x - lastEnd > 0.15 * eff && out.length && !blank && !/^\s/.test(t)) out.push(' ');
      out.push(t);
      blank = /\s$/.test(t);
      lastY = y; lastEnd = end; lastSize = eff;
    },
    result() { return { text: out.join(''), images }; },
  };
}

// The text must read as text: mostly letters, digits, punctuation and spaces, and in Latin script
// most words carry a vowel. Glyph-id garbage from an unmapped font fails this. Combining marks
// (vowel signs in Indic and Thai scripts, accents) and zero-width spaces and joiners are text
// (a soft hyphen is not: soft hyphens inside words mark a multi-byte encoding read as Latin-1). Private-use characters are the symbol glyphs of fonts like Symbol and Wingdings (bullets,
// arrows): a few among text are fine, a text made mostly of them is not.
function readsAsText(text) {
  const chars = [...text];
  if (!chars.length) return true;
  const pua = chars.filter((c) => /\p{Co}/u.test(c)).length;
  if (pua / chars.length > 0.1) return false;
  const odd = chars.filter((c) => c === '�' || !/[\p{L}\p{M}\p{N}\p{P}\p{S}\p{Zs}\p{Co}​-‍⁠\n\t]/u.test(c)).length;
  if (odd / chars.length > 0.03) return false;
  const letters = text.match(/\p{L}/gu) || [];
  const ascii = letters.filter((c) => /[A-Za-z]/.test(c)).length;
  const words = text.match(/\p{L}{3,}/gu) || [];
  if (words.length >= 5 && ascii >= 0.8 * letters.length) {
    const vowelled = words.filter((w) => /[aeiouyAEIOUY]/.test(w)).length;
    if (vowelled / words.length < 0.6) return false;
  }
  return true;
}

// ---- form fields, annotations and attached files --------------------------------------------------
// Text a recipient sees that is not page content: form field values (/V on the AcroForm's fields and
// on widgets outside it), annotation text (/Contents of comments, sticky notes, free text and other
// markup) and text drawn in annotation appearances (a free-text box, a stamp). An XFA form (drawn
// from data this reader does not parse), a file attached to the PDF, or a field or annotation whose
// object can't be found makes the file "can't check".
function pdfTextString(v) {
  if (!v || !v.str) return '';
  const b = v.str;
  if (b.length >= 2 && b[0] === 0xfe && b[1] === 0xff) return decodeBytes(b.subarray(2), 'utf-16be');
  if (b.length >= 3 && b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf) return decodeBytes(b.subarray(3), 'utf-8');
  return decodeBytes(b, 'windows-1252');
}
// The object behind a reference, or a direct value; a reference to an object that isn't there fails.
function present(doc, v, why) {
  if (v && v.ref !== undefined && !doc.objects.has(v.ref)) fail(why);
  return resolve(doc, v);
}
function fieldValue(doc, v, why) {
  const o = objectOf(doc, v);
  if (o && o.stream) return pdfTextString({ str: decode(doc, o) });
  const val = present(doc, v, why);
  if (Array.isArray(val)) return val.map((x) => pdfTextString(present(doc, x, why))).filter(Boolean).join(', ');
  return pdfTextString(val);
}
const squash = (s) => s.replace(/\s+/g, ' ').trim();

function formLines(doc, seen, values = new Set()) {
  const root = dictOf(doc, doc.trailer.Root) || {};
  if (root.NeedsRendering === true) fail('xfa_form');
  const names = dictOf(doc, root.Names);
  if (names && names.EmbeddedFiles !== undefined) fail('pdf_attachment');
  if (root.Collection !== undefined) fail('pdf_attachment');
  if (root.AcroForm === undefined) return [];
  const form = present(doc, root.AcroForm, 'form_unreadable')?.dict;
  if (!form) fail('form_unreadable');
  if (form.XFA !== undefined && form.XFA !== null) fail('xfa_form');
  const lines = [];
  const walk = (ref, type, depth) => {
    if (depth > 32) fail('form_unreadable');
    if (ref && ref.ref !== undefined) { if (seen.has(ref.ref)) return; seen.add(ref.ref); }
    const field = present(doc, ref, 'form_unreadable')?.dict;
    if (!field) fail('form_unreadable');
    const ft = field.FT?.name || type;
    // Check boxes and radio buttons hold a state name, not text.
    if (field.V !== undefined && ft !== 'Btn') {
      const value = fieldValue(doc, field.V, 'form_unreadable');
      const label = pdfTextString(resolve(doc, field.TU)) || pdfTextString(resolve(doc, field.T));
      if (value.trim()) { lines.push(label ? label + ': ' + value : value); values.add(squash(value)); }
    }
    const kids = present(doc, field.Kids, 'form_unreadable');
    if (Array.isArray(kids)) for (const kid of kids) walk(kid, ft, depth + 1);
  };
  const fields = present(doc, form.Fields, 'form_unreadable');
  for (const ref of Array.isArray(fields) ? fields : []) walk(ref, null, 0);
  return lines;
}

function appearanceText(doc, annot, resources) {
  const ap = present(doc, annot.AP, 'annotation_unreadable')?.dict;
  if (!ap || ap.N === undefined) return '';
  let o = objectOf(doc, ap.N);
  if (ap.N && ap.N.ref !== undefined && !o) fail('annotation_unreadable');
  if (!o || !o.stream) {
    const states = present(doc, ap.N, 'annotation_unreadable')?.dict;
    const state = annot.AS?.name;
    if (!states || !state || states[state] === undefined) return '';
    o = objectOf(doc, states[state]);
    if (!o || !o.stream) fail('annotation_unreadable');
  }
  const sink = assembler();
  runContent(doc, decode(doc, o), o.v.dict.Resources ?? resources, sink);
  const { text, images } = sink.result();
  if (images) fail('annotation_unreadable');
  return text.trim();
}

// A widget shows its field on the page through its appearance stream (/AP /N), which can draw text
// the field's value doesn't hold (or hold none at all), and a push button shows its caption
// (/MK /CA). Every widget on a page is read that way, whether or not the form tree reached it;
// text equal to a field value already read is not repeated. A single character is a check mark or
// a radio dot from a symbol font, not text.
function widgetLines(doc, annot, resources, values) {
  const out = [];
  const mk = present(doc, annot.MK, 'form_unreadable');
  const caption = mk && mk.dict ? pdfTextString(present(doc, mk.dict.CA, 'form_unreadable')) : '';
  for (const t of [caption, appearanceText(doc, annot, resources)]) {
    const key = squash(t);
    if (key.length > 1 && !values.has(key)) { out.push(t); values.add(key); }
  }
  return out;
}

function annotationLines(doc, seen, values) {
  const lines = [];
  for (const page of pages(doc)) {
    if (page.node.Annots === undefined) continue;
    const list = present(doc, page.node.Annots, 'annotation_unreadable');
    if (!Array.isArray(list)) fail('annotation_unreadable');
    for (const ref of list) {
      const annot = present(doc, ref, 'annotation_unreadable')?.dict;
      if (!annot) fail('annotation_unreadable');
      const sub = annot.Subtype?.name;
      if (sub === 'FileAttachment') fail('pdf_attachment');
      if (sub === 'Popup' || sub === 'Link') continue; // a popup shows its parent's text
      if (sub === 'Widget') {
        // A widget outside the AcroForm tree has its value read here.
        const inForm = ref && ref.ref !== undefined && seen.has(ref.ref);
        if (!inForm && annot.Parent === undefined && annot.FT?.name !== 'Btn' && annot.V !== undefined) {
          const value = fieldValue(doc, annot.V, 'form_unreadable');
          if (value.trim()) { lines.push(value); values.add(squash(value)); }
        }
        for (const l of widgetLines(doc, annot, page.resources, values)) lines.push(l);
        continue;
      }
      const contents = pdfTextString(present(doc, annot.Contents, 'annotation_unreadable'));
      if (contents.trim()) lines.push(contents);
      const shownText = appearanceText(doc, annot, page.resources);
      if (shownText && squash(shownText) !== squash(contents)) lines.push(shownText);
    }
  }
  return lines;
}

// Lines of form and annotation text; throws when there is some it can't read.
function pdfExtraLines(doc) {
  const seen = new Set(), values = new Set();
  const form = formLines(doc, seen, values);
  return form.concat(annotationLines(doc, seen, values));
}

// The form and annotation text of a PDF alone, for a scan whose pages are read by OCR instead.
export function pdfFormText(buf) {
  try {
    return pdfExtraLines(load(buf)).join('\n');
  } catch (error) {
    if (error instanceof PdfError) throw error;
    throw new PdfError('unreadable');
  }
}

export function pdfCoverage(buf) {
  try {
    const doc = load(buf);
    const texts = [], ocrPages = [], pageList = pages(doc);
    for (let i = 0; i < pageList.length; i++) {
      const page = pageList[i], sink = assembler();
      runContent(doc, contentOf(doc, page.node.Contents), page.resources, sink);
      const part = sink.result();
      texts.push(part.text);
      if (part.images) ocrPages.push(i);
    }
    const text = texts.join('\n');
    // Some generators (Chromium among them) map an accented i or j to a dotless base plus a combining
    // accent ("fraı̂che"); read it as the letter it shows so word rules match.
    const clean = text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/ı(?=[̀-ͯ])/g, 'i').replace(/ȷ(?=[̀-ͯ])/g, 'j').normalize('NFC').trim();
    if (!readsAsText(clean)) fail('garbled');
    // Notes and fields never substitute for unread page content; hasPageText keeps that distinction.
    const extra = pdfExtraLines(doc);
    return { text: [clean, ...extra].filter(Boolean).join('\n'), ocrPages, hasPageText: !!clean };
  } catch (error) {
    if (error instanceof PdfError) throw error;
    throw new PdfError('unreadable');
  }
}
export const pdfText = buf => { const read = pdfCoverage(buf); if (read.hasPageText && read.ocrPages.length) fail('ocr_required'); return read.hasPageText ? read.text : ''; };

// A deliberately bounded scan extractor, not a PDF renderer. Every displayed object on every
// selected page must contain extractable images (or forms containing images/transforms). Native
// text operators are allowed only for pages already read by pdfCoverage. No masks,
// clipping, painting, inline images, special colorspaces or unsupported filters are guessed at.
export function pdfImages(buf, selectedPages) {
  const doc = load(buf), all = [], pageList = pages(doc); let pixels = 0;
  if (!pageList.length || pageList.length > OCR_MAX_PAGES) fail('scan_pages');
  function image(o) {
    const d = o.v.dict, w = resolve(doc, d.Width), h = resolve(doc, d.Height);
    if (!Number.isSafeInteger(w) || !Number.isSafeInteger(h) || w <= 0 || h <= 0 || (pixels += w * h) > OCR_MAX_PIXELS || all.length >= OCR_MAX_PAGES) fail('scan_size');
    if (d.SMask || d.Mask || d.ImageMask || d.Decode || d.DecodeParms || !['DeviceRGB', 'DeviceGray'].includes(resolve(doc, d.ColorSpace)?.name) || d.BitsPerComponent !== 8) fail('scan_encoding');
    const filters = [].concat(resolve(doc, d.Filter) || []).map(f => resolve(doc, f)?.name);
    let data = o.stream;
    if (filters.length === 1 && ['DCTDecode', 'DCT'].includes(filters[0])) { all.push({ bytes: data, width: w, height: h }); return; }
    data = decode(doc, o);
    const channels = resolve(doc, d.ColorSpace)?.name === 'DeviceRGB' ? 3 : 1;
    if (data.length !== w * h * channels) fail('scan_pixels');
    const stride = (w * 3 + 3) & ~3, bmp = new Uint8Array(54 + stride * h), v = new DataView(bmp.buffer);
    bmp[0] = 66; bmp[1] = 77; v.setUint32(2, bmp.length, true); v.setUint32(10, 54, true); v.setUint32(14, 40, true); v.setInt32(18, w, true); v.setInt32(22, h, true); v.setUint16(26, 1, true); v.setUint16(28, 24, true);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let c = 0; c < 3; c++) bmp[54 + (h - 1 - y) * stride + x * 3 + c] = data[(y * w + x) * channels + (channels === 3 ? 2 - c : 0)];
    all.push({ bytes: bmp, width: w, height: h });
  }
  function walk(data, resources, depth = 0) {
    if (depth > 8) fail('scan_depth');
    const xobjects = dictOf(doc, (dictOf(doc, resources) || {}).XObject) || {}, lex = lexer(data, 0, doc.work), stack = []; let ops = 0;
    for (let t; (t = lex.token());) {
      if (++ops > MAX_OPS || ++doc.work.ops > MAX_DOC_OPS) fail('scan_ops');
      if (t.op === undefined || t.op === '[' || t.op === '<<') { stack.push(t.op ? lex.value(t) : t); if (stack.length > 32) fail('scan_operands'); continue; }
      if (t.op === 'Do') {
        const o = objectOf(doc, xobjects[stack[0]?.name]);
        if (!o?.stream) fail('scan_object');
        if (o.v.dict.Subtype?.name === 'Image') image(o);
        else if (o.v.dict.Subtype?.name === 'Form' && !o.v.dict.Group) walk(decode(doc, o), o.v.dict.Resources || resources, depth + 1);
        else fail('scan_object');
      } else if (!['q', 'Q', 'cm'].includes(t.op) && !(selectedPages && ['BT', 'ET', 'Tf', 'Td', 'TD', 'Tm', 'TL', 'Tc', 'Tw', 'Tz', 'T*', 'Tj', 'TJ', "'", '"', 'Tr', 'Ts'].includes(t.op))) fail('scan_rendering');
      stack.length = 0;
    }
  }
  for (let i = 0; i < pageList.length; i++) {
    if (selectedPages && !selectedPages.includes(i)) continue;
    const page = pageList[i], before = all.length;
    if (page.node.Annots) fail('scan_annotations');
    walk(contentOf(doc, page.node.Contents), page.resources);
    if (all.length === before) fail('scan_no_image');
  }
  return all;
}
