// Synthetic DOCX, XLSX and PPTX packages laid out the way Office writes them: [Content_Types].xml
// with an override per part (inferred from the usual part names, or given), the package
// relationship to the main part, and relationships for the main part when the test gives none.
import { makeZip } from './zip-fixture.mjs';

const O = 'application/vnd.openxmlformats-officedocument.', MS = 'application/vnd.ms-';
export const NS = {
  w: 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"',
  a: 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"',
  p: 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"',
  r: 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"',
  s: 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"',
  c: 'xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"',
  mc: 'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"',
  wp: 'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"',
  wps: 'xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"',
  v: 'xmlns:v="urn:schemas-microsoft-com:vml"',
  m: 'xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"',
  dgm: 'xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram"',
  xdr: 'xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"',
};
const ALL_NS = Object.values(NS).join(' ');
// Word, DrawingML and spreadsheet roots with every namespace the tests use.
export const wdoc = (body) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document ${ALL_NS.replace(NS.s + ' ', '')}><w:body>${body}<w:sectPr/></w:body></w:document>`;
export const wpart = (root, body) => `<w:${root} ${NS.w} ${NS.r} ${NS.v} ${NS.mc}>${body}</w:${root}>`;
export const para = (...runs) => `<w:p>${runs.map((t) => `<w:r><w:t xml:space="preserve">${t}</w:t></w:r>`).join('')}</w:p>`;
export const slide = (body) => `<p:sld ${NS.p} ${NS.a} ${NS.r}><p:cSld><p:spTree>${body}</p:spTree></p:cSld></p:sld>`;
export const shape = (text, extra = '') => `<p:sp><p:nvSpPr><p:cNvPr id="2" name="Title 1"${extra}/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:p><a:r><a:t>${text}</a:t></a:r></a:p></p:txBody></p:sp>`;
export const sheet = (rows) => `<worksheet ${NS.s} ${NS.r}><sheetData>${rows}</sheetData></worksheet>`;

const TYPES = [
  [/^word\/document\.xml$/, O + 'wordprocessingml.document.main+xml'],
  [/^word\/header\d*\.xml$/, O + 'wordprocessingml.header+xml'], [/^word\/footer\d*\.xml$/, O + 'wordprocessingml.footer+xml'],
  [/^word\/footnotes\.xml$/, O + 'wordprocessingml.footnotes+xml'], [/^word\/endnotes\.xml$/, O + 'wordprocessingml.endnotes+xml'],
  [/^word\/comments\.xml$/, O + 'wordprocessingml.comments+xml'], [/^word\/styles\.xml$/, O + 'wordprocessingml.styles+xml'],
  [/^word\/settings\.xml$/, O + 'wordprocessingml.settings+xml'], [/^word\/numbering\.xml$/, O + 'wordprocessingml.numbering+xml'],
  [/^word\/fontTable\.xml$/, O + 'wordprocessingml.fontTable+xml'], [/^word\/webSettings\.xml$/, O + 'wordprocessingml.webSettings+xml'],
  [/^word\/commentsExtended\.xml$/, O + 'wordprocessingml.commentsExtended+xml'], [/^word\/people\.xml$/, O + 'wordprocessingml.people+xml'],
  [/^word\/glossary\/document\.xml$/, O + 'wordprocessingml.document.glossary+xml'],
  [/^word\/stylesWithEffects\.xml$/, MS + 'word.stylesWithEffects+xml'],
  [/^(?:word|xl|ppt)\/theme\/theme\d*\.xml$/, O + 'theme+xml'],
  [/\/charts\/chart\d*\.xml$/, O + 'drawingml.chart+xml'], [/\/charts\/style\d*\.xml$/, MS + 'office.chartstyle+xml'], [/\/charts\/colors\d*\.xml$/, MS + 'office.chartcolorstyle+xml'],
  [/\/diagrams\/data\d*\.xml$/, O + 'drawingml.diagramData+xml'], [/\/diagrams\/drawing\d*\.xml$/, MS + 'office.drawingml.diagramDrawing+xml'],
  [/\/diagrams\/layout\d*\.xml$/, O + 'drawingml.diagramLayout+xml'], [/\/diagrams\/quickStyle\d*\.xml$/, O + 'drawingml.diagramStyle+xml'], [/\/diagrams\/colors\d*\.xml$/, O + 'drawingml.diagramColors+xml'],
  [/vbaProject\.bin$/, MS + 'office.vbaProject'], [/\/activeX\/activeX\d*\.xml$/, MS + 'office.activeX+xml'],
  [/^docProps\/core\.xml$/, 'application/vnd.openxmlformats-package.core-properties+xml'], [/^docProps\/app\.xml$/, O + 'extended-properties+xml'], [/^docProps\/custom\.xml$/, O + 'custom-properties+xml'],
  [/^customXml\/itemProps\d*\.xml$/, O + 'customXmlProperties+xml'],
  [/^xl\/workbook\.xml$/, O + 'spreadsheetml.sheet.main+xml'], [/^xl\/worksheets\/[^/]+\.xml$/, O + 'spreadsheetml.worksheet+xml'],
  [/^xl\/chartsheets\/[^/]+\.xml$/, O + 'spreadsheetml.chartsheet+xml'], [/^xl\/macrosheets\/[^/]+\.xml$/, MS + 'excel.macrosheet+xml'], [/^xl\/dialogsheets\/[^/]+\.xml$/, O + 'spreadsheetml.dialogsheet+xml'],
  [/^xl\/sharedStrings\.xml$/, O + 'spreadsheetml.sharedStrings+xml'], [/^xl\/styles\.xml$/, O + 'spreadsheetml.styles+xml'], [/^xl\/calcChain\.xml$/, O + 'spreadsheetml.calcChain+xml'],
  [/^xl\/comments\d*\.xml$/, O + 'spreadsheetml.comments+xml'], [/^xl\/threadedComments\/[^/]+\.xml$/, MS + 'excel.threadedcomments+xml'], [/^xl\/persons\/person\.xml$/, MS + 'excel.person+xml'],
  [/^xl\/drawings\/drawing\d*\.xml$/, O + 'drawing+xml'], [/^xl\/tables\/[^/]+\.xml$/, O + 'spreadsheetml.table+xml'],
  [/^xl\/pivotCache\/pivotCacheDefinition\d*\.xml$/, O + 'spreadsheetml.pivotCacheDefinition+xml'], [/^xl\/pivotCache\/pivotCacheRecords\d*\.xml$/, O + 'spreadsheetml.pivotCacheRecords+xml'],
  [/^xl\/pivotTables\/[^/]+\.xml$/, O + 'spreadsheetml.pivotTable+xml'], [/^xl\/connections\.xml$/, O + 'spreadsheetml.connections+xml'], [/^xl\/externalLinks\/[^/]+\.xml$/, O + 'spreadsheetml.externalLink+xml'],
  [/^xl\/revisions\/revisionHeaders\.xml$/, O + 'spreadsheetml.revisionHeaders+xml'],
  [/^ppt\/presentation\.xml$/, O + 'presentationml.presentation.main+xml'], [/^ppt\/slides\/[^/]+\.xml$/, O + 'presentationml.slide+xml'],
  [/^ppt\/slideLayouts\/[^/]+\.xml$/, O + 'presentationml.slideLayout+xml'], [/^ppt\/slideMasters\/[^/]+\.xml$/, O + 'presentationml.slideMaster+xml'],
  [/^ppt\/notesSlides\/[^/]+\.xml$/, O + 'presentationml.notesSlide+xml'], [/^ppt\/notesMasters\/[^/]+\.xml$/, O + 'presentationml.notesMaster+xml'],
  [/^ppt\/comments\/comment\d*\.xml$/, O + 'presentationml.comments+xml'], [/^ppt\/comments\/modernComment[^/]*\.xml$/, MS + 'powerpoint.comments+xml'],
  [/^ppt\/commentAuthors\.xml$/, O + 'presentationml.commentAuthors+xml'], [/^ppt\/(?:presProps|viewProps|tableStyles)\.xml$/, (n) => O + 'presentationml.' + n.slice(4, -4) + '+xml'],
  [/^ppt\/tags\/[^/]+\.xml$/, O + 'presentationml.tags+xml'],
];
const DEFAULTS = { rels: 'application/vnd.openxmlformats-package.relationships+xml', xml: 'application/xml', png: 'image/png', jpeg: 'image/jpeg', emf: 'image/x-emf', vml: O + 'vmlDrawing',
  bin: O + 'oleObject', xlsx: O + 'spreadsheetml.sheet', docx: O + 'wordprocessingml.document', pptx: O + 'presentationml.presentation' };
const MAIN = { docx: 'word/document.xml', xlsx: 'xl/workbook.xml', pptx: 'ppt/presentation.xml' };
const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/';

// [[id, type, target, external?]] → a .rels part. `type` is the last segment of the relationship type.
export const relsXml = (list) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${list.map(([id, type, target, external]) =>
  `<Relationship Id="${id}" Type="${type.indexOf('/') >= 0 ? type : R + type}" Target="${target}"${external ? ' TargetMode="External"' : ''}/>`).join('')}</Relationships>`;

// Main-part relationships when the test gives none: worksheets, shared strings and styles for a
// workbook (rId1.. in the order given), slides for a presentation.
function defaultRels(kind, names) {
  if (kind === 'xlsx') {
    const list = names.filter((n) => /^xl\/worksheets\/[^/]+\.xml$/.test(n)).map((n, i) => [`rId${i + 1}`, 'worksheet', n.slice(3)]);
    if (names.includes('xl/sharedStrings.xml')) list.push(['rIdS', 'sharedStrings', 'sharedStrings.xml']);
    if (names.includes('xl/styles.xml')) list.push(['rIdT', 'styles', 'styles.xml']);
    return list;
  }
  if (kind === 'pptx') return names.filter((n) => /^ppt\/slides\/[^/]+\.xml$/.test(n)).map((n, i) => [`rId${i + 1}`, 'slide', n.slice(4)]);
  return [];
}

export function officeZip(kind, parts, { types = {}, omitTypes = false, zip = {} } = {}) {
  const files = { ...parts };
  const names = Object.keys(files);
  const main = MAIN[kind];
  if (!files['_rels/.rels']) files['_rels/.rels'] = relsXml([['rId1', 'officeDocument', main]]);
  const mainRels = main.replace(/([^/]+)$/, '_rels/$1.rels');
  if (!files[mainRels] && defaultRels(kind, names).length) files[mainRels] = relsXml(defaultRels(kind, names));
  if (!omitTypes) {
    const overrides = [];
    for (const n of names) {
      if (types[n] !== undefined) { if (types[n]) overrides.push([n, types[n]]); continue; }
      const hit = TYPES.find(([re]) => re.test(n));
      if (hit) overrides.push([n, typeof hit[1] === 'function' ? hit[1](n) : hit[1]]);
    }
    files['[Content_Types].xml'] = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">${Object.entries(DEFAULTS).map(([e, t]) => `<Default Extension="${e}" ContentType="${t}"/>`).join('')}${overrides.map(([n, t]) => `<Override PartName="/${n}" ContentType="${t}"/>`).join('')}</Types>`;
  }
  return makeZip(files, zip);
}

// The parts Word, Excel and PowerPoint add to every file, holding no text of the document's own.
export const COMMON = {
  'docProps/core.xml': '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Site schedule</dc:title><dc:creator>Kate Example</dc:creator><cp:lastModifiedBy>Kate Example</cp:lastModifiedBy><cp:revision>3</cp:revision><dcterms:created xsi:type="dcterms:W3CDTF">2026-10-01T09:00:00Z</dcterms:created></cp:coreProperties>',
  'docProps/app.xml': '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Template>Normal.dotm</Template><TotalTime>4</TotalTime><Application>Microsoft Office Word</Application><DocSecurity>0</DocSecurity><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Title</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><Company>Northline Builders</Company><AppVersion>16.0000</AppVersion></Properties>',
  'docProps/thumbnail.jpeg': Buffer.from([0xff, 0xd8, 0xff, 0xd9]),
};
