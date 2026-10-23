// Sentences with offsets. Every finding points to one sentence (spec §5), the pane highlights words
// inside it, and "Remove this sentence" deletes exactly it, so the split is shared by the check and
// the removal. A line break always ends a sentence (email lines: greetings, sign-offs, list items,
// quoted headers). Terminal punctuation ends one only when whitespace or the end follows, so decimals,
// domains and file names ("$4.50", "northline.example", "site-photos.zip") never split. Titles and
// Latin abbreviations never end a sentence; "etc.", "Inc." and the like, a single initial and an
// ellipsis end one only when the next word starts with a capital, a digit or a quote.

const TERMINAL = /[.!?…]/;
const CLOSERS = /["'”’)\]»]/;
const LINE = /[\n\r\u2028\u2029]/;
const NEVER_FINAL = new Set(['mr', 'mrs', 'ms', 'mx', 'dr', 'st', 'jr', 'sr', 'prof', 'rev', 'hon', 'gen', 'capt', 'lt', 'col', 'sgt', 'no', 'nos', 'vs', 'e.g', 'i.e', 'cf', 'approx', 'appt', 'apt', 'dept', 'est', 'fig', 'figs', 'mt', 'ft', 'pp', 'ref', 'refs', 'tel', 'ext', 'attn']);
const SOMETIMES_FINAL = new Set(['etc', 'inc', 'ltd', 'co', 'corp', 'llc', 'plc', 'bros', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec', 'a.m', 'p.m', 'u.s', 'u.k']);

function wordBefore(text, dot) {
  let i = dot;
  while (i > 0 && /[\p{L}.]/u.test(text[i - 1])) i--;
  return text.slice(i, dot).replace(/^\.+/, '');
}
function nextOpensSentence(text, from) {
  let i = from;
  while (i < text.length && /[ \t\f\v\u00a0]/.test(text[i])) i++;
  if (i >= text.length || LINE.test(text[i])) return true;
  return /[\p{Lu}\p{N}"'“‘(\[]/u.test(text[i]);
}
// "John J. Reyes": a capital initial between two capitalized names on one line.
function nameInitial(text, dot, after) {
  return /(?:^|[\s(])\p{Lu}\p{Ll}+ \p{Lu}$/u.test(text.slice(Math.max(0, dot - 40), dot)) &&
    /^ \p{Lu}\p{Ll}/u.test(text.slice(after, after + 3));
}

// [{start, end, text}] in order; start/end exclude surrounding whitespace, text = source slice.
export function splitSentences(text) {
  if (typeof text !== 'string') throw new TypeError('text must be a string');
  const out = [];
  let start = 0;
  const push = (s, e) => {
    while (s < e && /\s/.test(text[s])) s++;
    while (e > s && /\s/.test(text[e - 1])) e--;
    if (e > s) out.push({ start: s, end: e, text: text.slice(s, e) });
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (LINE.test(ch)) { push(start, i); start = i + 1; continue; }
    if (!TERMINAL.test(ch)) continue;
    let j = i + 1;
    while (j < text.length && TERMINAL.test(text[j])) j++;
    while (j < text.length && CLOSERS.test(text[j])) j++;
    if (j < text.length && !/\s/.test(text[j])) { i = j - 1; continue; }
    const run = text.slice(i, j);
    let final = true;
    if (run.startsWith('.') && !run.startsWith('..')) {
      const raw = wordBefore(text, i), word = raw.toLowerCase();
      if (NEVER_FINAL.has(word)) final = false;
      else if (SOMETIMES_FINAL.has(word) && !nextOpensSentence(text, j)) final = false;
      else if (/^\p{Lu}$/u.test(raw) && (!nextOpensSentence(text, j) || nameInitial(text, i, j))) final = false;
    } else if (/^(?:\.\.|…)/.test(run) && !nextOpensSentence(text, j)) final = false;
    if (!final) { i = j - 1; continue; }
    push(start, j);
    start = j;
    i = j - 1;
  }
  push(start, text.length);
  return out;
}

// Label and value pairs that a line break or a column gap splits, for rules.mjs to read again as one
// "Label: value" line: [{index, label, value, valueStart}], where index is the value's sentence and
// valueStart the value's offset in it. Two kinds:
//   - a short line ending in ":" or "=" (at most 60 characters) and the first sentence of the next
//     non-empty line ("Password:" then "Tr4ctor!22");
//   - two cells of one sentence split by a tab or by two or more spaces, the first a short label (a
//     letter first, at most 40 characters and five words): "SSN<tab>123456789", "PIN    4471".
// A value is cut to 120 characters (at a space where it can be). A sentence is the value of at most one
// line pair and eight cell pairs, so the pairs add at most a bounded multiple of the text to read.
const LABEL_LINE = /[:=]$/;
const CELL_GAP = /[ \u00a0]*\t[ \t\u00a0]*|[ \u00a0]{2,}/g;
const LABEL_CELL = /^[A-Za-z][\w'’#&()/.-]*(?: [\w'’#&()/.-]+){0,4}[:=]?$/;
const MAX_VALUE = 120, MAX_CELLS = 9;
function capValue(v) {
  if (v.length <= MAX_VALUE) return v;
  const cut = v.slice(0, MAX_VALUE), space = cut.lastIndexOf(' ');
  return space > 0 ? cut.slice(0, space) : cut;
}
export function labelValuePairs(text, sentences) {
  const out = [];
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i], label = i > 0 ? sentences[i - 1] : null;
    if (label && label.text.length <= 60 && LABEL_LINE.test(label.text) && LINE.test(text.slice(label.end, s.start))) {
      out.push({ index: i, label: label.text, value: capValue(s.text), valueStart: 0 });
    }
    if (!/\t|[  ]{2}/.test(s.text)) continue;
    const cells = [];
    let from = 0, m;
    CELL_GAP.lastIndex = 0;
    while ((m = CELL_GAP.exec(s.text))) {
      cells.push({ start: from, text: s.text.slice(from, m.index) });
      from = m.index + m[0].length;
      if (cells.length === MAX_CELLS - 1) { m = CELL_GAP.exec(s.text); break; }
    }
    cells.push({ start: from, text: s.text.slice(from, m ? m.index : s.text.length) });
    for (let c = 0; c + 1 < cells.length; c++) {
      const name = cells[c].text;
      if (name.length > 40 || !LABEL_CELL.test(name) || !cells[c + 1].text) continue;
      out.push({ index: i, label: LABEL_LINE.test(name) ? name : name + ':', value: capValue(cells[c + 1].text), valueStart: cells[c + 1].start });
    }
  }
  return out;
}

// Table rows with their column labels, so a value is read under its header the way a "Label: value"
// line is: [{start, end, cells: [{start, end, header}]}], offsets in the text, a cell's bounds without
// its quotes and edge spaces, header '' where the column has none. Two sources:
//   - a CSV file (csv: true): every line is a row, split by the delimiter its first line uses most
//     (comma, semicolon or tab, quoted fields understood); the first line is the header when every
//     field is a short label;
//   - anywhere else, a block of lines under a header line (two or more short labels): split by tabs
//     (Excel rows as the extractor writes them, tables pasted into a body), each row two or more cells
//     and no more than the header has; or split by commas or semicolons, each row exactly as many
//     fields as the header. A blank line, or a line that doesn't fit, ends the block.
// Each line is split at most twice per delimiter, so this stays linear in the text.
const HEADER_CELL = /^[\p{L}][\p{L}\p{N} _#&()/.'’$%:+-]{0,39}$/u;
const MAX_COLUMNS = 200;
function fields(text, from, to, delim) {
  const out = [];
  const quoted = delim !== '\t';
  let i = from;
  for (;;) {
    while (i < to && (text[i] === ' ' || text[i] === ' ')) i++;
    let start = i, end;
    if (quoted && text[i] === '"') {
      start = ++i;
      while (i < to && !(text[i] === '"' && text[i + 1] !== '"')) i += text[i] === '"' ? 2 : 1;
      end = Math.min(i, to);
      while (i < to && text[i] !== delim) i++;
    } else {
      while (i < to && text[i] !== delim) i++;
      end = i;
    }
    while (end > start && /[  ]/.test(text[end - 1])) end--;
    out.push({ start, end });
    if (i >= to) return out;
    i++;
  }
}
function headerOf(text, cells) {
  if (cells.length < 2 || cells.length > MAX_COLUMNS) return null;
  const names = cells.map((c) => text.slice(c.start, c.end));
  return names.every((n) => HEADER_CELL.test(n) && n.split(/\s+/).length <= 5) ? names : null;
}
function lineSpans(text) {
  const out = [];
  let start = 0;
  for (let i = 0; i <= text.length; i++) {
    if (i < text.length && !LINE.test(text[i])) continue;
    out.push({ start, end: i });
    if (text[i] === '\r' && text[i + 1] === '\n') i++;
    start = i + 1;
  }
  return out;
}
const row = (text, line, cells, header) => ({ start: line.start, end: line.end, cells: cells.map((c, k) => ({ start: c.start, end: c.end, header: header?.[k] || '' })) });
export function tableRows(text, { csv = false } = {}) {
  const lines = lineSpans(text), out = [];
  if (csv) {
    const first = lines.find((l) => text.slice(l.start, l.end).trim());
    if (!first) return out;
    const delim = [',', ';', '\t'].map((d) => [d, fields(text, first.start, first.end, d).length]).sort((a, b) => b[1] - a[1])[0];
    if (delim[1] < 2) return out;
    const d = delim[0];
    const header = headerOf(text, fields(text, first.start, first.end, d));
    for (const line of lines) {
      if (line === first && header) continue;
      if (!text.slice(line.start, line.end).trim()) continue;
      out.push(row(text, line, fields(text, line.start, line.end, d), header));
    }
    return out;
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i], body = text.slice(line.start, line.end);
    for (const d of ['\t', ',', ';']) {
      if (!body.includes(d)) continue;
      const header = headerOf(text, fields(text, line.start, line.end, d));
      if (!header) continue;
      let j = i + 1;
      for (; j < lines.length; j++) {
        const cells = fields(text, lines[j].start, lines[j].end, d);
        if (d === '\t' ? cells.length < 2 || cells.length > header.length : cells.length !== header.length) break;
        out.push(row(text, lines[j], cells, header));
      }
      if (j > i + 1) { i = j - 1; break; }
    }
  }
  return out;
}

// Whitespace-folded form used to compare sentences across Outlook's text and HTML views.
export const fold = (s) => String(s).replace(/[\s\u00a0\u200b]+/g, ' ').trim();

// Whether the draft still holds that sentence at that occurrence. The pane drops a card whose
// sentence is gone (removed or edited away) without checking anything again.
export function stillPresent(text, sentence, occurrence = 0) {
  if (typeof text !== 'string') return false;
  const target = fold(sentence);
  return splitSentences(text).filter((s) => fold(s.text) === target).length > occurrence;
}

// The 0-based occurrence of a sentence among equal (folded) sentences before it in the same text.
export function occurrenceOf(sentences, index) {
  const target = fold(sentences[index].text);
  let n = 0;
  for (let i = 0; i < index; i++) if (fold(sentences[i].text) === target) n++;
  return n;
}

// occurrenceOf for every sentence in one pass, for a text with many findings (a pasted list of
// credentials would otherwise fold every earlier sentence once per finding).
export function occurrences(sentences) {
  const seen = new Map();
  return sentences.map((s) => { const key = fold(s.text), n = seen.get(key) || 0; seen.set(key, n + 1); return n; });
}
