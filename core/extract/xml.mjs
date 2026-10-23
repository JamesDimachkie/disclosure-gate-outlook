// A small XML scanner and text reader for the Office formats. One pass, linear in the part's length:
// tags, text and CDATA in document order, with namespace prefixes resolved to the usual Office ones
// (a part that binds WordprocessingML to `ns0:` reads the same as one that uses `w:`). It fails
// closed: a malformed part, a DOCTYPE (entities could carry text) or a tag it cannot parse throws
// 'bad_xml', and readText throws 'unread_text' when a part holds words in an element it does not read.

export class XmlError extends Error {}
const bad = (why = 'bad_xml') => { throw new XmlError(why); };

const NAMED = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" };
export const decodeXml = (s) => s.replace(/&(?:#x([0-9a-f]+)|#(\d+)|(lt|gt|amp|quot|apos));/gi, (m, hex, dec, name) => {
  const code = hex ? parseInt(hex, 16) : dec ? parseInt(dec, 10) : null;
  if (code !== null) return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
  return NAMED[name.toLowerCase()] ?? m;
});

// Namespace URI → the prefix the readers use ('' for a default-namespace vocabulary).
const S = 'http://schemas.openxmlformats.org/', P = 'http://purl.oclc.org/ooxml/', M = 'http://schemas.microsoft.com/office/';
const PREFIX = new Map([
  [S + 'wordprocessingml/2006/main', 'w'], [P + 'wordprocessingml/main', 'w'],
  [S + 'drawingml/2006/main', 'a'], [P + 'drawingml/main', 'a'],
  [S + 'presentationml/2006/main', 'p'], [P + 'presentationml/main', 'p'],
  [S + 'spreadsheetml/2006/main', ''], [P + 'spreadsheetml/main', ''],
  [S + 'drawingml/2006/chart', 'c'], [P + 'drawingml/chart', 'c'],
  [S + 'drawingml/2006/chartDrawing', 'cdr'], [P + 'drawingml/chartDrawing', 'cdr'],
  [S + 'drawingml/2006/diagram', 'dgm'], [P + 'drawingml/diagram', 'dgm'],
  [S + 'drawingml/2006/spreadsheetDrawing', 'xdr'], [P + 'drawingml/spreadsheetDrawing', 'xdr'],
  [S + 'drawingml/2006/wordprocessingDrawing', 'wp'], [P + 'drawingml/wordprocessingDrawing', 'wp'],
  [S + 'drawingml/2006/picture', 'pic'], [P + 'drawingml/picture', 'pic'],
  [S + 'officeDocument/2006/math', 'm'], [P + 'officeDocument/math', 'm'],
  [S + 'officeDocument/2006/extended-properties', ''], [P + 'officeDocument/extendedProperties', ''],
  [S + 'markup-compatibility/2006', 'mc'],
  [S + 'package/2006/metadata/core-properties', 'cp'], ['http://purl.org/dc/elements/1.1/', 'dc'], ['http://purl.org/dc/terms/', 'dcterms'],
  [S + 'package/2006/content-types', ''], [S + 'package/2006/relationships', ''],
  [M + 'drawing/2014/chartex', 'cx'], [M + 'drawing/2008/diagram', 'dsp'],
  [M + 'word/2010/wordprocessingShape', 'wps'], [M + 'spreadsheetml/2018/threadedcomments', 'tc'],
  [M + 'powerpoint/2018/8/main', 'p188'],
  ['urn:schemas-microsoft-com:vml', 'v'], ['urn:schemas-microsoft-com:office:office', 'o'], ['urn:schemas-microsoft-com:office:excel', 'x'],
]);
const lookup = (scope, prefix) => { for (let s = scope; s; s = s.parent) if (s.map.has(prefix)) return s.map.get(prefix); return undefined; };
function canonical(q, scope) {
  const i = q.indexOf(':');
  const uri = lookup(scope, i < 0 ? '' : q.slice(0, i));
  if (uri === undefined || !PREFIX.has(uri)) return q;
  const p = PREFIX.get(uri);
  return p ? p + ':' + q.slice(i + 1) : q.slice(i + 1);
}
export const localName = (name) => name.slice(name.indexOf(':') + 1);

// Attributes of a start tag, decoded, keyed by their name as written.
const ATTR = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
export function attrs(raw) {
  const out = Object.create(null);
  if (!raw) return out;
  ATTR.lastIndex = 0;
  for (let m; (m = ATTR.exec(raw));) out[m[1]] = decodeXml(m[2] !== undefined ? m[2] : m[3]);
  return out;
}
// An attribute by its written name, else by local name under any prefix (`w:val` for 'val').
export function attr(a, name) {
  if (a[name] !== undefined) return a[name];
  for (const k in a) if (k.slice(k.indexOf(':') + 1) === name && k.indexOf(':') >= 0) return a[k];
  return null;
}
// A relationship id (r:id under whatever prefix the part bound).
export function relId(a) {
  if (a['r:id'] !== undefined) return a['r:id'];
  for (const k in a) if (/^[^:]+:id$/.test(k)) return a[k];
  return null;
}

const TOKEN = '<!--[\\s\\S]*?-->|<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|<\\?[\\s\\S]*?\\?>|<(\\/?)([A-Za-z_][\\w.\\-]*(?::[A-Za-z_][\\w.\\-]*)?)((?:\\s+[^\\s=\\/>]+\\s*=\\s*(?:"[^"]*"|\'[^\']*\'))*)\\s*(\\/?)>|([^<]+)';

// Calls on.open(name, rawAttrs, selfClosing, parentName), on.text(text, name, parentName) and
// on.close(name) in document order. Names are canonical (see PREFIX).
export function scanXml(xml, on) {
  const re = new RegExp(TOKEN, 'y');
  const stack = [];
  let scope = null, pos = 0;
  if (xml.charCodeAt(0) === 0xfeff) pos = 1;
  while (pos < xml.length) {
    re.lastIndex = pos;
    const m = re.exec(xml);
    if (!m) bad();
    pos = re.lastIndex;
    const top = stack.length ? stack[stack.length - 1] : null;
    if (m[6] !== undefined) {
      if (top) on.text(decodeXml(m[6]), top.name, stack.length > 1 ? stack[stack.length - 2].name : null);
      else if (m[6].trim()) bad();
      continue;
    }
    if (m[1] !== undefined) { if (top) on.text(m[1], top.name, stack.length > 1 ? stack[stack.length - 2].name : null); continue; }
    if (m[3] === undefined) continue; // comment or processing instruction
    if (m[2]) {
      if (m[4] || m[5] || !top || top.q !== m[3]) bad();
      stack.pop();
      scope = top.outer;
      on.close(top.name);
      continue;
    }
    let inner = scope;
    if (m[4].indexOf('xmlns') >= 0) {
      const a = attrs(m[4]), map = new Map();
      for (const k in a) if (k === 'xmlns') map.set('', a[k]); else if (k.slice(0, 6) === 'xmlns:') map.set(k.slice(6), a[k]);
      if (map.size) inner = { map, parent: scope };
    }
    const name = canonical(m[3], inner);
    on.open(name, m[4], !!m[5], top ? top.name : null);
    if (m[5]) on.close(name);
    else { stack.push({ q: m[3], name, outer: scope }); scope = inner; }
  }
  if (stack.length) bad();
}

// Text in elements a reader does not read is allowed when it carries no words: numbers, offsets,
// booleans, alignments and ids. Formulas, number formats and similar layout values are named.
const QUIET = new Set(['posOffset', 'align', 'pctWidth', 'pctHeight', 'pctPosHOffset', 'pctPosVOffset', 'fldData', 'LockedField', 'FieldCodes', 'LinkType', 'attrName', 'f', 'formula', 'formatCode', 'separator', 'sqref']);
const WORDLESS = /^(?:true|false|t|f|on|off|left|right|center|top|bottom|inside|outside|[{(]?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[)}]?)$/i;
export function guard(name, text) {
  const t = text.trim();
  if (!t || !/\p{L}/u.test(t) || WORDLESS.test(t) || QUIET.has(localName(name))) return;
  bad('unread_text:' + localName(name));
}

// Lines of text from one part. `cfg` names, by canonical element name:
//   text      elements whose content is text          instr     field instructions (kept per line)
//   instrBegin the element whose fldCharType="begin" starts a new field instruction
//   para      elements that end a line                 breaks    empty elements that add text (tab, break)
//   sep       separator before a text element when the line already has text (chart values)
//   frames    content shown apart from its paragraph (a text box); its lines follow that paragraph
//   rows/cells  table rows read as one line, cells separated by tabs
//   lineAttrs by local name: attributes read as lines of their own (alt text, WordArt)
//   instrAttr attribute holding a field instruction    skip      elements whose content is ignored
//   notUnder  parents under which `breaks` do not apply (tab stops are not tabs)
//   all       every text node is a line                guard     false to allow text it doesn't read
// `limit` caps the characters it produces ('too_long'). Joining nested table cells and comparing
// alternate branches copies text again, and that work is capped too ('too_complex'), so a table
// nested thousands deep fails quickly instead of copying its text once per level.
// mc:AlternateContent is read once: each distinct branch's text, so a text box stored both as
// DrawingML and as its VML fallback is not doubled, but a fallback that differs is still read.
const frame = (cells = null) => ({ cur: '', out: [], pending: [], para: 0, instr: [], cells });
const norm = (s) => s.replace(/\s+/g, ' ').trim();
export const MAX_WORK = 32 * 1024 * 1024;
export function readText(xml, cfg, limit = Infinity) {
  const frames = [frame()], branches = [];
  let depth = 0, skipAt = -1, produced = 0, work = 0;
  const spend = (n) => { produced += n; work += n; if (produced > limit) bad('too_long'); if (work > MAX_WORK) bad('too_complex'); };
  const copy = (n) => { work += n; if (work > MAX_WORK) bad('too_complex'); };
  const top = () => frames[frames.length - 1];
  const emit = (f, line) => { if (f.para > 0) f.pending.push(line); else f.out.push(line); };
  const keepInstr = cfg.keepInstr || (() => false);
  const kept = (f) => f.instr.map((s) => s.trim()).filter((s) => s && keepInstr(s));
  const flush = (f) => {
    f.out.push(f.cur);
    for (const l of kept(f)) f.out.push(l);
    for (const l of f.pending) f.out.push(l);
    f.cur = ''; f.instr = []; f.pending = [];
  };
  const finish = (f) => { if (f.cur || f.instr.length || f.pending.length) flush(f); return f.out.filter((l) => l.trim()); };
  const has = (set, name) => !!set && set.has(name);
  scanXml(xml, {
    open(name, raw, self, parent) {
      depth++;
      if (skipAt >= 0) return;
      if (has(cfg.skip, name)) { skipAt = depth; return; }
      const f = top();
      if (name === 'mc:AlternateContent') { branches.push([]); return; }
      if (name === 'mc:Choice' || name === 'mc:Fallback' || has(cfg.frames, name) || has(cfg.cells, name)) { frames.push(frame()); return; }
      if (has(cfg.rows, name)) { frames.push(frame([])); return; }
      if (has(cfg.para, name)) f.para++;
      const br = cfg.breaks && cfg.breaks.get(name);
      if (br !== undefined && !(parent && has(cfg.notUnder, parent))) { f.cur += br; spend(br.length); }
      const sep = cfg.sep && cfg.sep.get(name);
      if (sep !== undefined && f.cur) { f.cur += sep; spend(sep.length); }
      const la = cfg.lineAttrs && cfg.lineAttrs.get(localName(name));
      if (la) { const a = attrs(raw); for (const k of la) { const v = attr(a, k); if (v && v.trim()) { emit(f, v); spend(v.length); } } }
      if (cfg.instrBegin === name && attr(attrs(raw), 'fldCharType') === 'begin') f.instr.push('');
      const ia = cfg.instrAttr && cfg.instrAttr.get(name);
      if (ia) { const v = attr(attrs(raw), ia); if (v) { f.instr.push(v); spend(v.length); } }
    },
    text(s, name) {
      if (skipAt >= 0) return;
      const f = top();
      if (cfg.all) { if (s.trim()) { emit(f, s.trim()); spend(s.length); } }
      else if (has(cfg.text, name)) { f.cur += s; spend(s.length); }
      else if (has(cfg.instr, name)) { if (!f.instr.length) f.instr.push(''); f.instr[f.instr.length - 1] += s; spend(s.length); }
      else if (cfg.guard !== false) guard(name, s);
    },
    close(name) {
      if (skipAt >= 0) { if (depth === skipAt) skipAt = -1; depth--; return; }
      depth--;
      if (name === 'mc:AlternateContent') {
        const f = top(), seen = new Set();
        for (const b of branches.pop() || []) {
          const key = norm(b.inline + '\n' + b.lines.join('\n'));
          copy(key.length);
          if (!key || seen.has(key)) continue;
          if (b.inline) f.cur += (f.cur && seen.size ? ' ' : '') + b.inline;
          seen.add(key);
          for (const l of b.lines) emit(f, l);
        }
        return;
      }
      if (name === 'mc:Choice' || name === 'mc:Fallback') {
        const done = frames.pop(), f = top();
        const b = { inline: done.cur, lines: done.out.concat(kept(done), done.pending) };
        if (branches.length) branches[branches.length - 1].push(b);
        else { f.cur += b.inline; for (const l of b.lines) emit(f, l); }
        return;
      }
      if (has(cfg.frames, name)) { const lines = finish(frames.pop()); for (const l of lines) emit(top(), l); return; }
      if (has(cfg.cells, name)) {
        const cell = finish(frames.pop()).join('\t'), f = top();
        copy(cell.length);
        if (f.cells) f.cells.push(cell); else if (cell) emit(f, cell);
        return;
      }
      if (has(cfg.rows, name)) {
        const row = frames.pop(), extra = finish(row), f = top();
        const line = row.cells.join('\t');
        copy(line.length);
        if (line.trim()) emit(f, line);
        for (const l of extra) emit(f, l);
        return;
      }
      if (has(cfg.para, name)) { const f = top(); f.para--; flush(f); }
    },
  });
  if (frames.length !== 1) bad();
  return finish(frames[0]).map((l) => l.replace(/\s+$/, ''));
}
