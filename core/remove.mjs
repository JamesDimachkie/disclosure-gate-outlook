// "Remove this sentence" (spec §6.C): delete exactly that sentence from the draft, and nothing else.
// The sentence is found by its text and its occurrence among equal sentences, in the same split the
// check used. In HTML only the sentence's characters (and the space that separated it from its
// neighbour) are cut out of the text runs; every tag, attribute, style, the signature and the quoted
// thread stay byte for byte, so an emptied paragraph stays as an empty paragraph. If the sentence
// can't be found exactly once at that occurrence, nothing is changed. Runs in the task pane and in
// Node (tests), so it uses no platform API.
import { splitSentences, fold } from './sentences.mjs';

const ENTITIES = { nbsp: '\u00a0', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", mdash: '—', ndash: '–', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', bull: '•', middot: '·', copy: '©', reg: '®', trade: '™', euro: '€', pound: '£', cent: '¢', deg: '°', times: '×', divide: '÷', laquo: '«', raquo: '»', shy: '­', zwj: '\u200d', zwnj: '\u200c', ensp: ' ', emsp: ' ', thinsp: ' ', sect: '§', para: '¶', frac12: '½', frac14: '¼', frac34: '¾', eacute: 'é', egrave: 'è', aacute: 'á', agrave: 'à', ouml: 'ö', uuml: 'ü', auml: 'ä', ccedil: 'ç', ntilde: 'ñ' };
const BLOCK = new Set(['address', 'article', 'aside', 'blockquote', 'br', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul', 'body', 'html']);
const HIDDEN = new Set(['head', 'script', 'style', 'title', 'template', 'xml']);
const WHITESPACE = /[\n\r\t\f]/;
const isSpace = (c) => c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f' || c === '\u00a0';

// The visible text of an HTML string: [{ch, from, to}] where from/to are the source range of the
// character (-1 for a block break the markup implies), with runs of source whitespace kept one per
// character so every visible character maps back to its bytes.
export function htmlText(html) {
  const out = [];
  let i = 0, hidden = null;
  const push = (ch, from, to) => out.push({ ch, from, to });
  while (i < html.length) {
    const c = html[i];
    if (c === '<') {
      if (html.startsWith('<!--', i)) { const end = html.indexOf('-->', i + 4); i = end < 0 ? html.length : end + 3; continue; }
      if (html.startsWith('<![CDATA[', i)) { const end = html.indexOf(']]>', i); i = end < 0 ? html.length : end + 3; continue; }
      if (/[!?]/.test(html[i + 1] || '')) { const end = html.indexOf('>', i); i = end < 0 ? html.length : end + 1; continue; }
      const m = /^<(\/?)([a-zA-Z][a-zA-Z0-9:-]*)/.exec(html.slice(i, i + 64));
      if (!m) { if (!hidden) push('<', i, i + 1); i++; continue; }
      // Scan to the tag's end, stepping over quoted attribute values.
      let j = i + m[0].length, quote = null;
      while (j < html.length) { const d = html[j]; if (quote) { if (d === quote) quote = null; } else if (d === '"' || d === "'") quote = d; else if (d === '>') break; j++; }
      const name = m[2].toLowerCase(), closing = m[1] === '/';
      if (hidden) { if (closing && name === hidden) hidden = null; }
      else if (!closing && HIDDEN.has(name) && !/\/\s*$/.test(html.slice(i, j))) hidden = name;
      else if (BLOCK.has(name)) push('\n', -1, -1);
      i = j + 1;
      continue;
    }
    if (hidden) { i++; continue; }
    if (c === '&') {
      const m = /^&(?:#x([0-9a-fA-F]{1,6})|#([0-9]{1,7})|([a-zA-Z][a-zA-Z0-9]{1,31}));?/.exec(html.slice(i, i + 40));
      if (m) {
        const code = m[1] ? parseInt(m[1], 16) : m[2] ? parseInt(m[2], 10) : null;
        const ch = code !== null ? (code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '�') : ENTITIES[m[3]] ?? ENTITIES[m[3].toLowerCase()];
        if (ch !== undefined && (m[0].endsWith(';') || code !== null)) { for (const unit of ch) push(unit, i, i + m[0].length); i += m[0].length; continue; }
      }
    }
    const cp = html.codePointAt(i), len = cp > 0xffff ? 2 : 1;
    // Source line breaks and tabs are only whitespace in HTML; a block tag makes the visible break.
    const ch = html.slice(i, i + len);
    push(WHITESPACE.test(ch) ? ' ' : ch, i, i + len);
    i += len;
  }
  return out;
}

// The index range [start, end) of the occurrence-th sentence whose folded text equals the target.
function locate(text, sentence, occurrence) {
  const target = fold(sentence);
  if (!target) return null;
  const hits = splitSentences(text).filter((s) => fold(s.text) === target);
  const hit = hits[occurrence];
  return hit ? { start: hit.start, end: hit.end } : null;
}

// Extend a sentence range over the spaces that joined it to its neighbour on the same line: the ones
// after it, or, when it ends its line, the ones before it.
function withGap(chars, start, end) {
  let e = end;
  while (e < chars.length && isSpace(chars[e]) && chars[e] !== '\n' && chars[e] !== '\r') e++;
  if (e > end && e < chars.length && chars[e] !== '\n' && chars[e] !== '\r') return { start, end: e };
  let s = start;
  while (s > 0 && isSpace(chars[s - 1]) && chars[s - 1] !== '\n' && chars[s - 1] !== '\r') s--;
  // Leading whitespace with nothing visible before it on the line joined nothing: leave it.
  if (s === 0 || chars[s - 1] === '\n' || chars[s - 1] === '\r') s = start;
  return { start: s, end: e };
}

// Plain text: remove the sentence and its joining spaces; an emptied line goes with its line break.
export function removeSentenceFromText(text, sentence, occurrence = 0) {
  if (typeof text !== 'string') return { ok: false, reason: 'invalid' };
  const hit = locate(text, sentence, occurrence);
  if (!hit) return { ok: false, reason: 'not_found' };
  let { start, end } = withGap(text, hit.start, hit.end);
  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  let lineEnd = text.indexOf('\n', end); if (lineEnd < 0) lineEnd = text.length;
  if (!text.slice(lineStart, start).trim() && !text.slice(end, lineEnd).replace(/\r$/, '').trim()) {
    start = lineStart;
    end = lineEnd < text.length ? lineEnd + 1 : lineEnd;
    if (lineEnd === text.length && start > 0) start = text[start - 2] === '\r' ? start - 2 : start - 1;
  }
  return { ok: true, text: text.slice(0, start) + text.slice(end) };
}

// HTML: cut only the sentence's characters (and its joining spaces) out of the text runs.
export function removeSentenceFromHtml(html, sentence, occurrence = 0) {
  if (typeof html !== 'string') return { ok: false, reason: 'invalid' };
  const chars = htmlText(html);
  const visible = chars.map((c) => (c.from < 0 ? '\n' : c.ch)).join('');
  // Each visible character is one UTF-16 unit or one astral pair; map string offsets to entries.
  const unitToChar = [];
  chars.forEach((c, k) => { for (let u = 0; u < (c.from < 0 ? 1 : c.ch.length); u++) unitToChar.push(k); });
  const hit = locate(visible, sentence, occurrence);
  if (!hit) return { ok: false, reason: 'not_found' };
  const range = withGap(visible, hit.start, hit.end);
  const cuts = [];
  for (let u = range.start; u < range.end; u++) {
    const c = chars[unitToChar[u]];
    if (c.from < 0) continue;
    const last = cuts[cuts.length - 1];
    if (last && last.to >= c.from) last.to = Math.max(last.to, c.to); else cuts.push({ from: c.from, to: c.to });
  }
  let out = html;
  for (let k = cuts.length - 1; k >= 0; k--) out = out.slice(0, cuts[k].from) + out.slice(cuts[k].to);
  return { ok: true, html: out };
}
