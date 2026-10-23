// Text of DOCX, XLSX and PPTX files: everything a recipient can open and read, in document order,
// and nothing silently skipped. Every part of the package is accounted for by its content type:
// it is read, it is known to hold no text a recipient reads (styles, themes, images, layout data),
// or the whole file can't be checked. Unknown parts, macros, ActiveX controls, OLE objects, shared-
// workbook revision logs, Power Pivot data and parts that fail to parse all make it "can't check".
// Office files embedded in the file (a workbook inside a document, a chart's data) are read too,
// within the same size budget, and so are PDFs stored as images (Office for Mac). Output is counted
// as each reader produces it, so a part that repeats a long string fails as too long at once.
//
// DOCX: the body in order (paragraphs, tables one row per line, text boxes after their paragraph,
// hyperlink and field display text, equations, alt text, WordArt), tracked deletions (a recipient can
// show them), field instructions that carry quoted text or a link, headers, footers, footnotes,
// endnotes, comments, the glossary, document variables and mail-merge connection strings, list label
// text and the document properties. XLSX: every sheet the workbook lists, in order and by
// relationship, with its name; every cell's shown value (shared, inline and formula strings; numbers
// with percent formats as percentages), string literals in formulas, data-validation prompts and list
// values, print headers and footers, hyperlink tooltips, scenarios, defined names (Name Manager shows
// them and they can hold constants), notes, threaded comments, drawings and text boxes, charts, pivot
// caches (the source rows a pivot table keeps), external-link caches, data connections and sheets'
// custom properties. PPTX:
// slides in presentation order, each followed by its notes and comments, then layouts, masters, notes
// and handout masters, SmartArt, charts, tables and grouped shapes.
import { decodeBytes } from '../bytes.mjs';
import { listEntries, readEntry } from './zip.mjs';
import { scanXml, readText, attrs, attr, relId, guard, localName, decodeXml } from './xml.mjs';
import { pdfText } from './pdf.mjs';

export { decodeXml };

export class OfficeError extends Error {}
const fail = (why) => { throw new OfficeError(why); };

const MAX_EXPANSION = 20 * 1024 * 1024;  // declared size across the file and everything embedded in it
const MAX_DEPTH = 3;                     // a file, an embedded file, and one embedded in that
const MAX_CHARS = 200000;

// ---- what each part is -------------------------------------------------------------------------
const O = 'application/vnd.openxmlformats-officedocument.', MS = 'application/vnd.ms-';
const CLASSES = {
  'main:docx': [O + 'wordprocessingml.document.main+xml', O + 'wordprocessingml.template.main+xml', MS + 'word.document.macroEnabled.main+xml', MS + 'word.template.macroEnabledTemplate.main+xml'],
  'main:xlsx': [O + 'spreadsheetml.sheet.main+xml', O + 'spreadsheetml.template.main+xml', MS + 'excel.sheet.macroEnabled.main+xml', MS + 'excel.template.macroEnabled.main+xml'],
  'main:pptx': [O + 'presentationml.presentation.main+xml', O + 'presentationml.slideshow.main+xml', O + 'presentationml.template.main+xml', MS + 'powerpoint.presentation.macroEnabled.main+xml', MS + 'powerpoint.slideshow.macroEnabled.main+xml', MS + 'powerpoint.template.macroEnabled.main+xml'],
  word: ['header', 'footer', 'footnotes', 'endnotes', 'comments', 'document.glossary'].map((t) => O + 'wordprocessingml.' + t + '+xml'),
  settings: [O + 'wordprocessingml.settings+xml'],
  numbering: [O + 'wordprocessingml.numbering+xml'],
  sheet: [O + 'spreadsheetml.worksheet+xml'],
  // A sheet's custom properties (Worksheet.CustomProperties): each part is one UTF-16 string.
  customprop: [O + 'spreadsheetml.customProperty'],
  // Office for Mac stores pasted vector images as PDF; their text is read like any PDF's.
  pdf: ['application/pdf'],
  sst: [O + 'spreadsheetml.sharedStrings+xml'],
  xlcomments: [O + 'spreadsheetml.comments+xml'],
  threaded: [MS + 'excel.threadedcomments+xml'],
  connections: [O + 'spreadsheetml.connections+xml'],
  extlink: [O + 'spreadsheetml.externalLink+xml'],
  pivotdef: [O + 'spreadsheetml.pivotCacheDefinition+xml'],
  pivotrec: [O + 'spreadsheetml.pivotCacheRecords+xml'],
  drawing: [O + 'drawing+xml', O + 'drawingml.chartshapes+xml', O + 'drawingml.diagramData+xml', MS + 'office.drawingml.diagramDrawing+xml', O + 'presentationml.comments+xml', MS + 'powerpoint.comments+xml',
    ...['slide', 'slideLayout', 'slideMaster', 'notesSlide', 'notesMaster', 'handoutMaster'].map((t) => O + 'presentationml.' + t + '+xml')],
  chart: [O + 'drawingml.chart+xml', MS + 'office.chartex+xml'],
  vml: [O + 'vmlDrawing'],
  app: [O + 'extended-properties+xml'],
  core: ['application/vnd.openxmlformats-package.core-properties+xml'],
  all: [O + 'custom-properties+xml', 'application/xml', 'text/xml', 'image/svg+xml', MS + 'powerpoint.changesinfo+xml', MS + 'office.intelligence+xml', MS + 'office.intelligence2+xml', MS + 'excel.featurepropertybag+xml',
    ...['rdrichvalue', 'rdrichvaluestructure', 'rdarray', 'rdsupportingpropertybagstructure', 'rdsupportingpropertybag', 'rdrichvaluetypes', 'rdrichvaluewebimage'].map((t) => MS + 'excel.' + t + '+xml')],
  'pkg:docx': [O + 'wordprocessingml.document', O + 'wordprocessingml.template', MS + 'word.document.macroEnabled.12', MS + 'word.template.macroEnabled.12'],
  'pkg:xlsx': [O + 'spreadsheetml.sheet', O + 'spreadsheetml.template', MS + 'excel.sheet.macroEnabled.12', MS + 'excel.template.macroEnabled.12'],
  'pkg:pptx': [O + 'presentationml.presentation', O + 'presentationml.slideshow', O + 'presentationml.template', MS + 'powerpoint.presentation.macroEnabled.12', MS + 'powerpoint.slideshow.macroEnabled.12', MS + 'powerpoint.template.macroEnabled.12'],
  // Parts with no text a recipient reads: formatting, layout, ids, authors, and caches whose values
  // are also written into the cells or slides that show them (pivot tables, tables, slicers).
  ignore: ['application/vnd.openxmlformats-package.relationships+xml', O + 'theme+xml', O + 'themeOverride+xml', O + 'customXmlProperties+xml',
    ...['styles+xml', 'webSettings+xml', 'fontTable+xml', 'printerSettings', 'commentsExtended+xml', 'commentsIds+xml', 'commentsExtensible+xml', 'people+xml'].map((t) => O + 'wordprocessingml.' + t),
    MS + 'word.stylesWithEffects+xml', MS + 'word.commentsExtended+xml', MS + 'word.commentsIds+xml', MS + 'word.commentsExtensible+xml', MS + 'word.people+xml', MS + 'word.keyMapCustomizations+xml', MS + 'word.attachedToolbars',
    ...['styles+xml', 'calcChain+xml', 'sheetMetadata+xml', 'volatileDependencies+xml', 'table+xml', 'pivotTable+xml', 'queryTable+xml', 'tableSingleCells+xml', 'userNames+xml', 'printerSettings', 'chartsheet+xml'].map((t) => O + 'spreadsheetml.' + t),
    ...['person+xml', 'slicer+xml', 'slicerCache+xml', 'timeline+xml', 'timelineCache+xml', 'controlproperties+xml', 'namedsheetviews+xml'].map((t) => MS + 'excel.' + t),
    ...['presProps+xml', 'viewProps+xml', 'tableStyles+xml', 'tags+xml', 'slideUpdateInfo+xml', 'commentAuthors+xml', 'printerSettings'].map((t) => O + 'presentationml.' + t),
    MS + 'powerpoint.authors+xml', MS + 'powerpoint.revisioninfo+xml',
    MS + 'office.chartstyle+xml', MS + 'office.chartcolorstyle+xml', O + 'drawingml.diagramLayout+xml', O + 'drawingml.diagramStyle+xml', O + 'drawingml.diagramColors+xml',
    'application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml', 'application/vnd.openxmlformats-package.digital-signature-origin',
    MS + 'office.webextension+xml', MS + 'office.webextensiontaskpanes+xml', MS + 'office.classificationlabels+xml', MS + 'office.inkXml+xml', 'application/inkml+xml',
    O + 'obfuscatedFont', 'application/x-fontdata', 'application/x-font-ttf', MS + 'fontobject'],
  'refuse:macros': [MS + 'office.vbaProject', MS + 'office.vbaProjectSignature', MS + 'word.vbaData+xml', MS + 'excel.macrosheet+xml', MS + 'excel.intlmacrosheet+xml'],
  'refuse:activex': [MS + 'office.activeX+xml', MS + 'office.activeX'],
  'refuse:embedded_object': [O + 'oleObject', MS + 'excel.sheet.binary.macroEnabled.12', 'application/msword', MS + 'excel', MS + 'powerpoint'],
  'refuse:dialog_sheet': [O + 'spreadsheetml.dialogsheet+xml'],
  'refuse:data_model': [O + 'model+data'],
  'refuse:revisions': [O + 'spreadsheetml.revisionHeaders+xml', O + 'spreadsheetml.revisionLog+xml'],
};
const CLASS_OF = new Map();
for (const cls in CLASSES) for (const t of CLASSES[cls]) CLASS_OF.set(t.toLowerCase(), cls);
function classify(type) {
  if (!type) return null;
  const t = type.toLowerCase().split(';')[0].trim();
  if (CLASS_OF.has(t)) return CLASS_OF.get(t);
  if (t === 'image/svg+xml') return 'all';
  if (/^(?:image|audio|video|font|model)\//.test(t)) return 'ignore';
  return null;
}

// ---- the package ---------------------------------------------------------------------------------
const xmlString = (bytes) => {
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) return decodeBytes(bytes.subarray(2), 'utf-16le', true);
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) return decodeBytes(bytes.subarray(2), 'utf-16be', true);
  return decodeBytes(bytes, 'utf-8', true);
};
const lastSegment = (type) => String(type || '').slice(String(type || '').lastIndexOf('/') + 1);
const unescapePart = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
function resolveTarget(source, target) {
  const t = unescapePart(String(target).split('#')[0]);
  const out = t.charAt(0) === '/' ? [] : source.split('/').slice(0, -1);
  for (const seg of t.split('/')) { if (!seg || seg === '.') continue; if (seg === '..') out.pop(); else out.push(seg); }
  return out.join('/');
}

function openPackage(buf, ctx) {
  if (buf.length >= 4 && buf[0] === 0xd0 && buf[1] === 0xcf && buf[2] === 0x11 && buf[3] === 0xe0) fail('encrypted_or_legacy');
  // Some writers separate folders with backslashes; read them as the slashes they stand for.
  const entries = new Map();
  for (const [n, e] of listEntries(buf)) { const k = n.replace(/\\/g, '/'); if (entries.has(k)) fail('duplicate_entry'); entries.set(k, e); }
  let total = 0;
  for (const e of entries.values()) total += e.size;
  ctx.budget -= total;
  if (ctx.budget < 0) fail('entry_too_large');
  const lower = new Map();
  for (const n of entries.keys()) { const k = n.toLowerCase(); if (lower.has(k)) fail('duplicate_entry'); lower.set(k, n); }
  const read = (name) => xmlString(readEntry(buf, entries.get(name)));
  const ctName = lower.get('[content_types].xml');
  if (!ctName) fail('not_a_package');
  const defaults = new Map(), overrides = new Map();
  scanXml(read(ctName), {
    open(name, raw) {
      const a = attrs(raw);
      if (name === 'Default' && a.Extension && a.ContentType) defaults.set(a.Extension.toLowerCase(), a.ContentType);
      if (name === 'Override' && a.PartName && a.ContentType) overrides.set(unescapePart(a.PartName).replace(/^\/+/, '').toLowerCase(), a.ContentType);
    },
    text() {}, close() {},
  });
  const typeOf = (name) => {
    const k = name.toLowerCase();
    if (overrides.has(k)) return overrides.get(k);
    const dot = k.lastIndexOf('.');
    return dot > k.lastIndexOf('/') ? defaults.get(k.slice(dot + 1)) || null : null;
  };
  const relCache = new Map();
  // Relationships of a part ('' for the package): [{id, type (last segment), part (entry name or null), external}].
  const rels = (source) => {
    if (relCache.has(source)) return relCache.get(source);
    const slash = source.lastIndexOf('/');
    const relName = lower.get((source.slice(0, slash + 1) + '_rels/' + source.slice(slash + 1) + '.rels').toLowerCase());
    const list = [];
    if (relName) {
      scanXml(read(relName), {
        open(name, raw) {
          if (name !== 'Relationship') return;
          const a = attrs(raw), external = a.TargetMode === 'External';
          list.push({ id: a.Id, type: lastSegment(a.Type), external, part: external || !a.Target ? null : lower.get(resolveTarget(source, a.Target).toLowerCase()) || null });
        },
        text() {}, close() {},
      });
    }
    relCache.set(source, list);
    return list;
  };
  return { buf, entries, read, typeOf, rels, consumed: new Set(), ctx, chunks: [] };
}

// What a reader may produce before the file is too long: twice what is left, as a reader's raw
// lines include blank ones and duplicates the final text drops. This keeps a part that repeats a
// long string (one shared string in every cell) from building gigabytes before it is counted.
const room = (pkg) => 2 * Math.max(0, pkg.ctx.maxChars - pkg.ctx.chars) + 65536;
const tooLong = () => fail('too_long');

function add(pkg, lines) {
  const text = lines.filter((l) => l.trim()).join('\n');
  if (!text) return;
  pkg.ctx.chars += text.length + 1;
  if (pkg.ctx.chars > pkg.ctx.maxChars) fail('too_long');
  pkg.chunks.push(text);
}

function mainPart(pkg, kind) {
  const rel = pkg.rels('').find((r) => r.type === 'officeDocument');
  if (!rel || !rel.part) fail('not_a_' + kind);
  if (classify(pkg.typeOf(rel.part)) !== 'main:' + kind) fail('not_a_' + kind);
  pkg.consumed.add(rel.part);
  return rel.part;
}

// ---- readers -------------------------------------------------------------------------------------
const lineAttrs = (pairs) => new Map(pairs);
const WORD = {
  text: new Set(['w:t', 'w:delText', 'm:t', 'a:t']), instr: new Set(['w:instrText', 'w:delInstrText']), para: new Set(['w:p']),
  breaks: new Map([['w:tab', '\t'], ['w:ptab', '\t'], ['w:br', '\n'], ['w:cr', '\n'], ['w:noBreakHyphen', '-']]), notUnder: new Set(['w:tabs']),
  frames: new Set(['w:txbxContent']), rows: new Set(['w:tr']), cells: new Set(['w:tc']), skip: new Set(['w:fldData']),
  instrBegin: 'w:fldChar', instrAttr: new Map([['w:fldSimple', 'w:instr']]),
  // Alt text, WordArt, form-field help and status text, and drop-down choices are shown too.
  lineAttrs: lineAttrs([['docPr', ['descr', 'title']], ['textpath', ['string']], ['helpText', ['val']], ['statusText', ['val']], ['listEntry', ['val']], ['listItem', ['displayText']]]),
  // A field's instruction is shown with field codes; keep the ones that carry quoted text or a link
  // (HYPERLINK, DATABASE and INCLUDETEXT targets, QUOTE and SET values), not citation-manager data.
  keepInstr: (s) => /["“]|:\/\//.test(s) && !/^ADDIN\b/i.test(s),
};
const DRAWING = {
  text: new Set(['a:t', 'm:t', 'p:text']), para: new Set(['a:p', 'p:cm']), breaks: new Map([['a:br', '\n']]),
  rows: new Set(['a:tr']), cells: new Set(['a:tc']), lineAttrs: lineAttrs([['cNvPr', ['descr', 'title']]]),
};
// Chart titles, labels and cached series values (a cache is one line), trendline names, and the
// chart's own print headers.
const CHART_LINES = ['c:name', 'c:oddHeader', 'c:oddFooter', 'c:evenHeader', 'c:evenFooter', 'c:firstHeader', 'c:firstFooter'];
const CHART = {
  text: new Set(['a:t', 'c:v', 'cx:pt', 'cx:v'].concat(CHART_LINES)), sep: new Map([['c:v', '\t'], ['cx:pt', '\t'], ['cx:v', '\t']]),
  para: new Set(['a:p', 'c:tx', 'c:strCache', 'c:numCache', 'c:strLit', 'c:numLit', 'c:lvl', 'cx:lvl', 'cx:txData'].concat(CHART_LINES)), lineAttrs: lineAttrs([['cNvPr', ['descr', 'title']]]),
};
const SETTINGS = { text: new Set(), lineAttrs: lineAttrs([['docVar', ['name', 'val']], ['connectString', ['val']], ['query', ['val']]]) };
const NUMBERING = { text: new Set(), lineAttrs: lineAttrs([['lvlText', ['val']]]) };
const APP = { text: new Set(['Company', 'Manager', 'HyperlinkBase']), para: new Set(['Company', 'Manager', 'HyperlinkBase']), guard: false };
const ALL = { all: true };
const CORE = { all: true, skip: new Set(['dcterms:created', 'dcterms:modified', 'cp:revision', 'cp:lastPrinted']) };
const XL_COMMENTS = { text: new Set(['t']), para: new Set(['comment']), skip: new Set(['rPh', 'authors']) };
const THREADED = { text: new Set(['tc:text']), para: new Set(['tc:threadedComment']) };
const CONNECTIONS = { text: new Set(), lineAttrs: lineAttrs([['connection', ['name', 'description', 'connection']], ['dbPr', ['connection', 'command']], ['olapPr', ['connection']], ['webPr', ['url', 'post']], ['textPr', ['sourceFile']], ['parameter', ['prompt', 'string']], ['oledbPr', ['connection']], ['dbCommand', ['text']]]) };
const EXTLINK = { text: new Set(['v', 'val']), sep: new Map([['v', '\t'], ['val', '\t']]), para: new Set(['row', 'value']), lineAttrs: lineAttrs([['sheetName', ['val']], ['definedName', ['name']], ['oleItem', ['name']], ['ddeItem', ['name']]]) };

// Legacy VML drawings (Excel notes' boxes, form-control labels) are often not well-formed XML:
// their text is everything outside tags, without the x:ClientData anchoring values.
const CLIENT_DATA = /<([\w.-]+:)?ClientData\b/g;
function vmlLines(xml) {
  let out = '', at = 0;
  for (;;) {
    CLIENT_DATA.lastIndex = at;
    const m = CLIENT_DATA.exec(xml);
    if (!m) { out += xml.slice(at); break; }
    const tagEnd = xml.indexOf('>', m.index);
    if (tagEnd < 0) fail('bad_xml');
    out += xml.slice(at, m.index);
    if (xml.charAt(tagEnd - 1) === '/') { at = tagEnd + 1; continue; }
    const close = '</' + (m[1] || '') + 'ClientData>';
    const end = xml.indexOf(close, tagEnd);
    if (end < 0) fail('bad_xml');
    at = end + close.length;
  }
  const strings = [];
  out = out.replace(/\bstring\s*=\s*"([^"]*)"/g, (m, s) => { strings.push(decodeXml(s)); return ''; });
  const text = decodeXml(out.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, ' '));
  return text.split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim()).concat(strings);
}

function numberingLines(xml, limit) {
  return readText(xml, NUMBERING, limit).map((l) => l.replace(/%\d/g, '').trim()).filter((l) => /[\p{L}\p{N}]/u.test(l));
}

// Shared strings: one string per <si>, phonetic guides left out.
function sharedStrings(xml) {
  const out = [];
  let cur = null, rph = 0;
  scanXml(xml, {
    open(name) { if (name === 'si') cur = ''; else if (name === 'rPh') rph++; },
    text(s, name) { if (rph) return; if (name === 't' && cur !== null) cur += s; else guard(name, s); },
    close(name) { if (name === 'si') { out.push(cur || ''); cur = null; } else if (name === 'rPh') rph--; },
  });
  return out;
}

const attrOf = (tag, name) => { const m = new RegExp(`\\b${name}="([^"]*)"`).exec(tag); return m ? decodeXml(m[1]) : null; };
// Style indexes whose number format shows a percentage.
function percentStyles(stylesXml) {
  if (!stylesXml) return new Set();
  const custom = new Map([...stylesXml.matchAll(/<numFmt\b([^>]*)\/?>/g)].map((m) => [Number(attrOf(m[1], 'numFmtId')), attrOf(m[1], 'formatCode') || '']));
  const xfs = /<cellXfs\b[^>]*>([\s\S]*?)<\/cellXfs>/.exec(stylesXml)?.[1] || '';
  const out = new Set();
  [...xfs.matchAll(/<xf\b([^>]*)\/?>/g)].forEach((m, i) => { const id = Number(attrOf(m[1], 'numFmtId')); if (id === 9 || id === 10 || /%/.test(custom.get(id) || '')) out.add(i); });
  return out;
}
function percent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return `${Math.round(n * 10000) / 100}%`;
}
// A cell reference's column (A = 1); Excel's last column is XFD (16384).
const cellCol = (ref) => { const m = /^([A-Z]{1,3})\d+$/.exec(ref || ''); if (!m) return null; let col = 0; for (const ch of m[1]) col = col * 26 + (ch.charCodeAt(0) - 64); if (col > 16384) fail('bad_cell_ref'); return col; };
// Print header and footer codes: &L &C &R sections, &P page numbers, &"font" and &12 sizes.
const headerText = (s) => s.replace(/&"[^"]*"/g, '').replace(/&K[0-9A-Fa-f]{6}/g, '').replace(/&\d+/g, '').replace(/&([LCRPNDTFAZGBIUSXYEH])/g, ' ').replace(/&&/g, '&').replace(/[ \t]+/g, ' ').trim();
const HEADERS = new Set(['oddHeader', 'oddFooter', 'evenHeader', 'evenFooter', 'firstHeader', 'firstFooter']);
const SHEET_ATTRS = new Map([['dataValidation', ['promptTitle', 'prompt', 'errorTitle', 'error']], ['hyperlink', ['tooltip']], ['scenario', ['name', 'comment']], ['inputCells', ['val']]]);

// One worksheet: a line per row, cells separated by tabs at their column, then anything else shown.
// Values and column padding count against `limit` as they are produced: a cell can show a shared
// string of any length, and thousands of cells can show the same one.
function sheetLines(xml, book, limit = Infinity) {
  const lines = [];
  let cells = null, cell = null, extra = [], rph = 0, produced = 0;
  const spend = (n) => { if ((produced += n) > limit) tooLong(); };
  scanXml(xml, {
    open(name, raw) {
      if (name === 'row') { cells = []; extra = []; return; }
      if (name === 'c') { const a = attrs(raw); cell = { t: a.t || null, s: Number(a.s ?? -1), r: a.r || null, v: undefined, is: '', f: '' }; return; }
      if (name === 'rPh') { rph++; return; }
      const keys = SHEET_ATTRS.get(localName(name));
      if (keys) { const a = attrs(raw); for (const k of keys) { const v = attr(a, k); if (v && v.trim()) (cells ? extra : lines).push(v); } }
    },
    text(s, name, parent) {
      if (rph) return;
      if (cell && name === 'v') cell.v = (cell.v || '') + s;
      else if (cell && name === 't') cell.is += s;
      else if (cell && name === 'f') cell.f += s;
      else if (HEADERS.has(name)) lines.push(headerText(s));
      else if (name === 'formula1' || name === 'formula2' || (localName(name) === 'f' && parent && /^formula[12]$/.test(localName(parent)))) lines.push(s);
      else guard(name, s);
    },
    close(name) {
      if (name === 'rPh') { rph--; return; }
      if (name === 'c' && cell) {
        const { t, s, v } = cell;
        let value = '';
        if (t === 's') { if (v !== undefined) { value = book.shared[Number(v)]; if (value === undefined) fail('missing_part'); } }
        else if (t === 'inlineStr') value = cell.is;
        else if (t === 'b') value = v === '1' ? 'TRUE' : v === '0' ? 'FALSE' : '';
        else if (v !== undefined) value = t === 'str' || t === 'e' || t === 'd' ? v : book.percents.has(s) ? percent(v) : v;
        else if (cell.is) value = cell.is;
        const after = cells ? extra : lines;
        for (const m of cell.f.matchAll(/"((?:[^"]|"")*)"/g)) { const lit = m[1].replace(/""/g, '"'); if (/[\p{L}\p{N}]/u.test(lit) && lit !== value) { spend(lit.length); after.push(lit); } }
        const col = cellCol(cell.r);
        spend(value.length + (cells && col ? Math.max(0, col - 1 - cells.length) : 0));
        if (cells) { if (col) while (cells.length < col - 1) cells.push(''); cells.push(value); }
        else if (value) lines.push(value);
        cell = null;
        return;
      }
      if (name === 'row' && cells) {
        const line = cells.join('\t').replace(/\t+$/, '');
        if (line.trim()) lines.push(line);
        for (const l of extra) lines.push(l);
        cells = null; extra = [];
      }
    },
  });
  return lines;
}

// A pivot cache keeps the pivot table's source rows, which a recipient can show by drilling down
// even when the source sheet is gone. Field names and shared items, then one line per record.
const ITEM = new Set(['s', 'n', 'd', 'e', 'b']);
function pivotDefinition(xml) {
  const fields = [], loose = [];
  let field = null, inShared = 0;
  scanXml(xml, {
    open(name, raw) {
      if (name === 'cacheHierarchies' || name === 'tupleCache' || name === 'calculatedMembers' || name === 'kpis') fail('pivot_cache');
      if (name === 'cacheField') { field = { name: attr(attrs(raw), 'name') || '', items: [], all: [] }; fields.push(field); return; }
      if (name === 'sharedItems') { inShared++; return; }
      if (ITEM.has(name) || name === 'm') {
        const v = name === 'm' ? '' : attr(attrs(raw), 'v') || '';
        if (field) { if (inShared) field.items.push(v); else field.all.push(v); } else loose.push(v);
      }
    },
    text(s, name) { guard(name, s); },
    close(name) { if (name === 'sharedItems') inShared--; else if (name === 'cacheField') field = null; },
  });
  const lines = [fields.map((f) => f.name).join('\t')];
  for (const f of fields) { const vals = f.items.concat(f.all).filter((v) => v !== ''); if (vals.length) lines.push(vals.join('\t')); }
  if (loose.length) lines.push(loose.join('\t'));
  return { lines, fields };
}
function pivotRecords(xml, fields, limit = Infinity) {
  const lines = [];
  let row = null, produced = 0;
  scanXml(xml, {
    open(name, raw) {
      if (name === 'r') { row = []; return; }
      if (!row) return;
      const v = attr(attrs(raw), 'v');
      if (name === 'x') {
        const f = fields && fields[row.length];
        const item = f && f.items[Number(v)];
        if (item === undefined || item === null) fail('pivot_cache');
        if ((produced += item.length + 1) > limit) tooLong();
        row.push(item);
      } else row.push(name === 'm' ? '' : v || '');
    },
    text(s, name) { guard(name, s); },
    close(name) { if (name === 'r' && row) { const line = row.join('\t').replace(/\t+$/, ''); if (line.trim()) lines.push(line); row = null; } },
  });
  return lines;
}

// Read one part by its class; a class this reader doesn't know makes the file "can't check".
function readPart(pkg, name, cls) {
  pkg.consumed.add(name);
  if (cls === 'ignore') return;
  if (!cls) fail('unknown_part');
  if (cls.slice(0, 7) === 'refuse:') fail(cls.slice(7));
  if (cls.slice(0, 4) === 'pkg:') {
    const text = officeText(readEntry(pkg.buf, pkg.entries.get(name)), cls.slice(4), pkg.ctx); // counted as it was read
    if (text) pkg.chunks.push(text);
    return;
  }
  if (cls === 'pdf') return add(pkg, pdfText(readEntry(pkg.buf, pkg.entries.get(name))).split('\n'));
  if (cls === 'customprop') return add(pkg, [decodeBytes(readEntry(pkg.buf, pkg.entries.get(name)), 'utf-16le', true)]);
  const xml = pkg.read(name), limit = room(pkg);
  switch (cls) {
    case 'word': return add(pkg, readText(xml, WORD, limit));
    case 'drawing': return add(pkg, readText(xml, DRAWING, limit));
    case 'chart': return add(pkg, readText(xml, CHART, limit));
    case 'settings': return add(pkg, readText(xml, SETTINGS, limit));
    case 'numbering': return add(pkg, numberingLines(xml, limit));
    case 'app': return add(pkg, readText(xml, APP, limit));
    case 'all': return add(pkg, readText(xml, ALL, limit));
    case 'core': return add(pkg, readText(xml, CORE, limit));
    case 'vml': return add(pkg, vmlLines(xml));
    case 'sst': return add(pkg, sharedStrings(xml));
    case 'xlcomments': return add(pkg, readText(xml, XL_COMMENTS, limit));
    case 'threaded': return add(pkg, readText(xml, THREADED, limit));
    case 'connections': return add(pkg, readText(xml, CONNECTIONS, limit));
    case 'extlink': return add(pkg, readText(xml, EXTLINK, limit));
    case 'sheet': return add(pkg, sheetLines(xml, pkg.book || { shared: [], percents: new Set() }, limit));
    case 'pivotdef': {
      const def = pivotDefinition(xml);
      add(pkg, def.lines);
      for (const r of pkg.rels(name)) {
        if (r.type !== 'pivotCacheRecords' || !r.part || pkg.consumed.has(r.part)) continue;
        pkg.consumed.add(r.part);
        add(pkg, pivotRecords(pkg.read(r.part), def.fields, room(pkg)));
      }
      return;
    }
    case 'pivotrec': return add(pkg, pivotRecords(xml, null, limit));
    default: fail('unknown_part');
  }
}

// Everything not read yet, in name order with package metadata last: read, known to hold nothing
// to read, or can't check.
const metadataLast = (name) => (/^(?:docProps|customXml)\//i.test(name) ? '~' : '') + name;
// Pivot cache definitions go first, so each reads its records with the field items they index.
function readRest(pkg) {
  const names = [...pkg.entries.keys()].sort((a, b) => (metadataLast(a) < metadataLast(b) ? -1 : 1));
  const defs = names.filter((n) => classify(pkg.typeOf(n)) === 'pivotdef');
  for (const name of defs.concat(names)) {
    if (pkg.consumed.has(name) || name.slice(-1) === '/' || name.toLowerCase() === '[content_types].xml') continue;
    const cls = classify(pkg.typeOf(name));
    if (cls && cls.slice(0, 5) === 'main:') fail('unknown_part');
    readPart(pkg, name, cls);
  }
}
const readIfPresent = (pkg, part) => { if (part && !pkg.consumed.has(part)) readPart(pkg, part, classify(pkg.typeOf(part))); };

function docx(pkg) {
  const main = mainPart(pkg, 'docx');
  add(pkg, readText(pkg.read(main), WORD));
  readRest(pkg);
}

function xlsx(pkg) {
  const main = mainPart(pkg, 'xlsx');
  const xml = pkg.read(main);
  const sheets = [], names = [];
  let defined = null;
  scanXml(xml, {
    open(name, raw) {
      if (name === 'sheet') sheets.push(attrs(raw));
      else if (name === 'definedName') defined = { name: attr(attrs(raw), 'name') || '', value: '' };
    },
    text(s, name) { if (name === 'definedName' && defined) defined.value += s; else guard(name, s); },
    close(name) {
      if (name !== 'definedName' || !defined) return;
      // Built-in names (print areas, filters) and future-function markers are not user text.
      if (!/^_xl(?:nm|fn|pm)\./i.test(defined.name)) names.push(defined.name + '\t' + defined.value);
      defined = null;
    },
  });
  const rels = pkg.rels(main);
  const byType = (t) => rels.find((r) => r.type === t);
  const sst = byType('sharedStrings'), styles = byType('styles');
  if ((sst && !sst.part) || (styles && !styles.part)) fail('missing_part');
  pkg.book = { shared: sst ? sharedStrings(pkg.read(sst.part)) : [], percents: styles ? percentStyles(pkg.read(styles.part)) : new Set() };
  if (sst) pkg.consumed.add(sst.part);
  if (styles) pkg.consumed.add(styles.part);
  for (const a of sheets) {
    const sheetName = attr(a, 'name'), id = relId(a);
    if (sheetName) add(pkg, [sheetName]);
    // A sheet listed with no relationship has no part: its name is all there is (every part in the
    // package is still read or refused below).
    if (!id) continue;
    const rel = rels.find((r) => r.id === id);
    if (!rel || !rel.part) fail('missing_part');
    // The part's content type decides: a worksheet is read, a chart sheet holds only its drawing, a
    // dialog or macro sheet can't be checked.
    if (!pkg.consumed.has(rel.part)) readPart(pkg, rel.part, classify(pkg.typeOf(rel.part)));
  }
  add(pkg, names);
  readRest(pkg);
}

function pptx(pkg) {
  const main = mainPart(pkg, 'pptx');
  const ids = [];
  scanXml(pkg.read(main), { open(name, raw) { if (name === 'p:sldId') ids.push(relId(attrs(raw))); }, text(s, name) { guard(name, s); }, close() {} });
  const rels = pkg.rels(main);
  for (const id of ids) {
    const rel = rels.find((r) => r.id === id);
    if (!rel || !rel.part) fail('missing_part');
    readIfPresent(pkg, rel.part);
    for (const r of pkg.rels(rel.part)) if (r.type === 'notesSlide' || r.type === 'comments') readIfPresent(pkg, r.part);
  }
  if (!ids.length && ![...pkg.entries.keys()].some((n) => pkg.typeOf(n) === O + 'presentationml.slide+xml')) fail('no_slides');
  readRest(pkg);
}

function officeText(buf, kind, ctx) {
  if (++ctx.depth > MAX_DEPTH) fail('nested_too_deep');
  const pkg = openPackage(buf, ctx);
  if (kind === 'docx') docx(pkg); else if (kind === 'xlsx') xlsx(pkg); else pptx(pkg);
  ctx.depth--;
  return pkg.chunks.join('\n');
}
const start = (buf, kind, opts = {}) => officeText(buf, kind, { depth: 0, budget: MAX_EXPANSION, chars: 0, maxChars: opts.maxChars || MAX_CHARS });

export const docxText = (buf, opts) => start(buf, 'docx', opts);
export const xlsxText = (buf, opts) => start(buf, 'xlsx', opts);
export const pptxText = (buf, opts) => start(buf, 'pptx', opts);
