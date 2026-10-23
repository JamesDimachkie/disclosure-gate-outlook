// Office files are read part by part: everything a recipient can open is text, and a part that may
// carry text the reader doesn't read makes the whole file "can't check". Synthetic content only.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { docxText, xlsxText, pptxText } from '../core/extract/office.mjs';
import { attachmentText } from '../core/attachments.mjs';
import { checkDraft } from '../core/gate.mjs';
import { CONFIG, DAN, CLEAN_BODY, draft } from './helpers.mjs';
import { officeZip, NS, wdoc, wpart, para, slide, shape, sheet, relsXml, COMMON } from './office-fixture.mjs';

const SECRET = 'The password is Tr4ctor!22.';
const O = 'application/vnd.openxmlformats-officedocument.';
const b64 = (buf) => Buffer.from(buf).toString('base64');
const file = (name, buf) => ({ id: name, name, size: buf.length, type: 'file', content: b64(buf) });
const reason = (name, buf) => { const r = attachmentText(file(name, buf)); assert.equal(r.ok, false, `${name} should not be readable`); return r.reason; };
const gate = async (...files) => (await checkDraft(draft({ to: [DAN], cc: [], body: { text: CLEAN_BODY, format: 'html' }, attachments: files }), { config: CONFIG })).findings;
const lines = (text) => text.split('\n');

// ---- DOCX ----------------------------------------------------------------------------------------
const textBox = (choice, fallback) => `<w:r><mc:AlternateContent><mc:Choice Requires="wps"><w:drawing><wp:anchor><wp:docPr id="1" name="Text Box 1"/><a:graphic><a:graphicData uri="x"><wps:wsp><wps:txbx><w:txbxContent>${para(choice)}</w:txbxContent></wps:txbx></wps:wsp></a:graphicData></a:graphic></wp:anchor></w:drawing></mc:Choice><mc:Fallback><w:pict><v:shape><v:textbox><w:txbxContent>${para(fallback)}</w:txbxContent></v:textbox></v:shape></w:pict></mc:Fallback></mc:AlternateContent></w:r>`;

test('DOCX: text after a text box in the same paragraph is read, and the box is read once', async () => {
  const docx = officeZip('docx', { 'word/document.xml': wdoc(`<w:p><w:r><w:t xml:space="preserve">Before the box. </w:t></w:r>${textBox('Inside box', 'Inside box')}<w:r><w:t>${SECRET}</w:t></w:r></w:p>`) });
  assert.equal(docxText(docx), `Before the box. ${SECRET}\nInside box`);
  const found = await gate(file('site.docx', docx));
  assert.deepEqual(found.map((f) => [f.category, f.place]), [['access', 'In site.docx']]);
  // A VML fallback that differs from the DrawingML box is read as well.
  const differ = officeZip('docx', { 'word/document.xml': wdoc(`<w:p>${textBox('Box A', 'Gate code 4471')}</w:p>`) });
  assert.equal(docxText(differ), 'Box A\nGate code 4471');
});

test('DOCX: tables row by row, links, field results, equations, alt text and watermarks', () => {
  const cell = (t) => `<w:tc><w:tcPr/>${para(t)}</w:tc>`;
  const body = [
    `<w:tbl><w:tblPr/><w:tr>${cell('Login')}${cell('kate.m')}</w:tr><w:tr>${cell('Password')}${cell('Tr4ctor!22')}</w:tr></w:tbl>`,
    '<w:p><w:r><w:t xml:space="preserve">See the </w:t></w:r><w:hyperlink r:id="rId9"><w:r><w:t>portal</w:t></w:r></w:hyperlink><w:r><w:t>.</w:t></w:r></w:p>',
    '<w:p><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> HYPERLINK "https://portal.example/reset?token=abc123" </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>reset page</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r><w:r><w:t xml:space="preserve"> page </w:t></w:r><w:fldSimple w:instr=" PAGE "><w:r><w:t>3</w:t></w:r></w:fldSimple></w:p>',
    '<w:p><m:oMath><m:r><m:t>x=4471</m:t></m:r></m:oMath></w:p>',
    '<w:p><w:r><w:drawing><wp:inline><wp:docPr id="3" name="Picture 3" descr="Photo of the lockbox by the gate"/><a:graphic><a:graphicData uri="x"/></a:graphic></wp:inline></w:drawing></w:r></w:p>',
    '<w:p><w:pPr><w:tabs><w:tab w:val="left" w:pos="720"/></w:tabs></w:pPr><w:r><w:t>No stray tab</w:t></w:r></w:p>',
  ].join('');
  const docx = officeZip('docx', {
    'word/document.xml': wdoc(body),
    'word/_rels/document.xml.rels': relsXml([['rId9', 'hyperlink', 'https://portal.example/', true], ['rId10', 'header', 'header1.xml']]),
    'word/header1.xml': wpart('hdr', '<w:p><w:r><w:pict><v:shape><v:textpath string="CONFIDENTIAL"/></v:shape></w:pict></w:r></w:p>'),
  });
  assert.deepEqual(lines(docxText(docx)), ['Login\tkate.m', 'Password\tTr4ctor!22', 'See the portal.', 'reset page page 3', 'HYPERLINK "https://portal.example/reset?token=abc123"', 'x=4471', 'Photo of the lockbox by the gate', 'No stray tab', 'CONFIDENTIAL']);
});

test('DOCX: footnotes, endnotes, comments, the glossary and a header under another name are read', () => {
  const docx = officeZip('docx', {
    'word/document.xml': wdoc(para('Body text.')),
    'word/hdrA.xml': wpart('hdr', para('Header under a custom name.')),
    'word/footnotes.xml': wpart('footnotes', `<w:footnote w:type="separator" w:id="-1"><w:p><w:r><w:separator/></w:r></w:p></w:footnote><w:footnote w:id="1">${para('Footnote: gate code 4471.')}</w:footnote>`),
    'word/endnotes.xml': wpart('endnotes', `<w:endnote w:id="1">${para('Endnote text.')}</w:endnote>`),
    'word/comments.xml': wpart('comments', `<w:comment w:id="0" w:author="Kate">${para('We can go as low as $90k.')}</w:comment>`),
    'word/glossary/document.xml': `<w:glossaryDocument ${NS.w}><w:docParts><w:docPart><w:docPartPr><w:name w:val="Sig"/></w:docPartPr><w:docPartBody>${para('Glossary entry.')}</w:docPartBody></w:docPart></w:docParts></w:glossaryDocument>`,
  }, { types: { 'word/hdrA.xml': O + 'wordprocessingml.header+xml' } });
  const text = docxText(docx);
  for (const s of ['Body text.', 'Header under a custom name.', 'Footnote: gate code 4471.', 'Endnote text.', 'We can go as low as $90k.', 'Glossary entry.']) assert.ok(text.includes(s), s);
  assert.ok(text.startsWith('Body text.'));
});

test('DOCX: document variables, mail-merge connection strings, list labels, properties and custom XML', () => {
  const docx = officeZip('docx', {
    'word/document.xml': wdoc(para('Body.')),
    'word/settings.xml': wpart('settings', '<w:zoom w:percent="100"/><w:mailMerge><w:mainDocumentType w:val="formLetters"/><w:connectString w:val="Provider=SQLOLEDB;Password=Wq8!zr4Lp2;User ID=svc"/><w:query w:val="SELECT * FROM staff"/></w:mailMerge><w:docVars><w:docVar w:name="SafeCode" w:val="safe code 2291"/></w:docVars>'),
    'word/numbering.xml': wpart('numbering', '<w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:numFmt w:val="bullet"/><w:lvlText w:val=""/></w:lvl><w:lvl w:ilvl="1"><w:numFmt w:val="decimal"/><w:lvlText w:val="%2."/></w:lvl><w:lvl w:ilvl="2"><w:lvlText w:val="Alarm code 4471 step %3:"/></w:lvl></w:abstractNum>'),
    'docProps/custom.xml': '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><property fmtid="{D5CDD505-2E9C-101B-9397-08002B2CF9AE}" pid="2" name="Lockbox"><vt:lpwstr>lockbox 8812</vt:lpwstr></property></Properties>',
    'customXml/item1.xml': '<CoverPageProperties xmlns="http://schemas.microsoft.com/office/2006/coverPageProps"><Abstract>Abstract mentions the floor price.</Abstract></CoverPageProperties>',
  });
  assert.deepEqual(lines(docxText(docx)), ['Body.', 'Alarm code 4471 step :', 'Provider=SQLOLEDB;Password=Wq8!zr4Lp2;User ID=svc', 'SELECT * FROM staff', 'SafeCode', 'safe code 2291', 'Abstract mentions the floor price.', 'lockbox 8812']);
});

test('DOCX: an embedded workbook is read; OLE objects, macros, ActiveX, imported chunks and unknown parts can\'t be checked', async () => {
  const book = officeZip('xlsx', { 'xl/workbook.xml': `<workbook ${NS.s} ${NS.r}><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets></workbook>`, 'xl/worksheets/sheet1.xml': sheet(`<row r="1"><c r="A1" t="inlineStr"><is><t>${SECRET}</t></is></c></row>`) });
  const embedded = officeZip('docx', { 'word/document.xml': wdoc(para('See the attached figures.')), 'word/embeddings/Microsoft_Excel_Worksheet.xlsx': book });
  assert.equal(docxText(embedded), `See the attached figures.\nSheet1\n${SECRET}`);
  assert.deepEqual((await gate(file('figures.docx', embedded))).map((f) => f.category), ['access']);
  for (const [extra, types, why] of [
    [{ 'word/embeddings/oleObject1.bin': Buffer.from('ole') }, {}, 'embedded_object'],
    [{ 'word/vbaProject.bin': Buffer.from('vba') }, {}, 'macros'],
    [{ 'word/activeX/activeX1.xml': '<ax:ocx xmlns:ax="http://schemas.microsoft.com/office/2006/activeX"/>' }, {}, 'activex'],
    [{ 'word/afchunk.htm': '<html><body>hidden</body></html>' }, { 'word/afchunk.htm': 'text/html' }, 'unknown_part'],
    [{ 'word/mystery.dat': Buffer.from('?') }, {}, 'unknown_part'],
  ]) assert.equal(reason('bid.docx', officeZip('docx', { 'word/document.xml': wdoc(para('Body.')), ...extra }, { types })), why);
});

test('DOCX: unread words, broken XML, a DOCTYPE, an encrypted package or a missing part can\'t be checked', () => {
  const docx = (xml, opts) => officeZip('docx', { 'word/document.xml': xml }, opts);
  assert.equal(reason('a.docx', docx(wdoc('<w:p><w:r><w:t>Body</w:t></w:r><x:secret xmlns:x="urn:example">hidden words</x:secret></w:p>'))), 'unread_text:secret');
  assert.equal(reason('b.docx', docx(wdoc('<w:p><w:r><w:t>Body</w:t></w:r>'))), 'bad_xml');
  assert.equal(reason('c.docx', docx(`<!DOCTYPE w:document [<!ENTITY x "Tr4ctor!22">]>${wdoc(para('&x;'))}`)), 'bad_xml');
  const ole = Buffer.concat([Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]), Buffer.alloc(504)]);
  assert.equal(reason('d.docx', ole), 'encrypted_or_legacy');
  assert.equal(reason('e.docx', docx(wdoc(para('Body')), { types: { 'word/document.xml': '' } })), 'not_a_docx');
  assert.equal(reason('f.docx', officeZip('docx', { 'word/document.xml': wdoc(para('Body')), '_rels/.rels': relsXml([['rId1', 'officeDocument', 'word/missing.xml']]) })), 'not_a_docx');
});

test('DOCX: a part that binds WordprocessingML to another prefix reads the same', () => {
  const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const docx = officeZip('docx', { 'word/document.xml': `<ns0:document xmlns:ns0="${W}"><ns0:body><ns0:p><ns0:r><ns0:t>${SECRET}</ns0:t></ns0:r></ns0:p></ns0:body></ns0:document>` });
  assert.equal(docxText(docx), SECRET);
  const defaultNs = officeZip('docx', { 'word/document.xml': `<document xmlns="${W}"><body><p><r><t>Gate code 4471</t></r></p></body></document>` });
  assert.equal(docxText(defaultNs), 'Gate code 4471');
});

// ---- XLSX ----------------------------------------------------------------------------------------
const workbook = (sheets, extra = '') => `<workbook ${NS.s} ${NS.r}><sheets>${sheets.map(([name, id]) => `<sheet name="${name}" sheetId="1" r:id="${id}"/>`).join('')}</sheets>${extra}</workbook>`;
const inline = (ref, t) => `<c r="${ref}" t="inlineStr"><is><t>${t}</t></is></c>`;

test('XLSX: sheets come from the workbook\'s relationships, in its order, whatever the parts are called', async () => {
  const xlsx = officeZip('xlsx', {
    'xl/workbook.xml': workbook([['Summary', 'rId2'], ['Data', 'rId1']], '<definedNames><definedName name="_xlnm.Print_Area" localSheetId="0">Summary!$A$1:$B$2</definedName><definedName name="WifiCode">"Tr4ctor!22"</definedName></definedNames>'),
    'xl/_rels/workbook.xml.rels': relsXml([['rId1', 'worksheet', 'worksheets/data.xml'], ['rId2', 'worksheet', '/xl/other/summary.xml'], ['rId3', 'sharedStrings', 'sharedStrings.xml']]),
    'xl/worksheets/data.xml': sheet(`<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1"><v>4471</v></c></row>`),
    'xl/other/summary.xml': sheet(`<row r="1">${inline('A1', SECRET)}</row>`),
    'xl/sharedStrings.xml': `<sst ${NS.s}><si><t>PIN</t></si></sst>`,
  }, { types: { 'xl/other/summary.xml': O + 'spreadsheetml.worksheet+xml' } });
  assert.equal(xlsxText(xlsx), `Summary\n${SECRET}\nData\nPIN\t4471\nWifiCode\t"Tr4ctor!22"`);
  // The secret cell, and the PIN row read as a label and its value.
  assert.deepEqual((await gate(file('book.xlsx', xlsx))).map((f) => f.category), ['access', 'access']);
});

test('XLSX: notes, threaded comments, drawings, charts, pivot caches, external links and connections are read', () => {
  const xlsx = officeZip('xlsx', {
    'xl/workbook.xml': workbook([['Sheet1', 'rId1']]),
    'xl/worksheets/sheet1.xml': sheet(`<row r="1">${inline('A1', 'Phase')}</row>`),
    'xl/comments1.xml': `<comments ${NS.s}><authors><author>Kate Example</author></authors><commentList><comment ref="A1" authorId="0"><text><r><t>Keep this from the client.</t></r></text></comment></commentList></comments>`,
    'xl/threadedComments/threadedComment1.xml': '<ThreadedComments xmlns="http://schemas.microsoft.com/office/spreadsheetml/2018/threadedcomments"><threadedComment ref="A1" dT="2026-10-01T10:00:00.00" personId="{11111111-1111-1111-1111-111111111111}" id="{22222222-2222-2222-2222-222222222222}"><text>We can go as low as $90k.</text></threadedComment></ThreadedComments>',
    'xl/drawings/drawing1.xml': `<xdr:wsDr ${NS.xdr} ${NS.a}><xdr:twoCellAnchor><xdr:from><xdr:col>1</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>1</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="2" name="TextBox 1"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr/><xdr:txBody><a:bodyPr/><a:p><a:r><a:t>Spare key is under the mat.</a:t></a:r></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:twoCellAnchor></xdr:wsDr>`,
    'xl/drawings/vmlDrawing1.vml': '<xml xmlns:v="urn:schemas-microsoft-com:vml" xmlns:x="urn:schemas-microsoft-com:office:excel"><v:shape id="_x0000_s1025"><v:textbox><div style=\'text-align:left\'><font face="Tahoma">Alarm code 4471</font><br></div></v:textbox><x:ClientData ObjectType="Button"><x:Anchor>1, 15, 0, 2, 3, 15, 3, 16</x:Anchor><x:FmlaMacro>Module1.Run</x:FmlaMacro></x:ClientData></v:shape></xml>',
    'xl/charts/chart1.xml': `<c:chartSpace ${NS.c} ${NS.a}><c:chart><c:title><c:tx><c:rich><a:bodyPr/><a:p><a:r><a:t>Margin by phase</a:t></a:r></a:p></c:rich></c:tx></c:title><c:plotArea><c:barChart><c:ser><c:tx><c:strRef><c:f>Sheet1!$B$1</c:f><c:strCache><c:ptCount val="1"/><c:pt idx="0"><c:v>Margin</c:v></c:pt></c:strCache></c:strRef></c:tx><c:cat><c:strRef><c:f>Sheet1!$A$2:$A$3</c:f><c:strCache><c:ptCount val="2"/><c:pt idx="0"><c:v>Slab</c:v></c:pt><c:pt idx="1"><c:v>Frame</c:v></c:pt></c:strCache></c:strRef></c:cat><c:val><c:numRef><c:f>Sheet1!$B$2:$B$3</c:f><c:numCache><c:formatCode>0%</c:formatCode><c:ptCount val="2"/><c:pt idx="0"><c:v>0.18</c:v></c:pt><c:pt idx="1"><c:v>0.22</c:v></c:pt></c:numCache></c:numRef></c:val><c:trendline><c:name>Linear (Margin)</c:name><c:trendlineType val="linear"/></c:trendline></c:ser></c:barChart></c:plotArea></c:chart></c:chartSpace>`,
    'xl/pivotCache/pivotCacheDefinition1.xml': `<pivotCacheDefinition ${NS.s} ${NS.r} r:id="rId1" recordCount="2"><cacheSource type="worksheet"><worksheetSource ref="A1:B3" sheet="Payroll"/></cacheSource><cacheFields count="2"><cacheField name="Employee" numFmtId="0"><sharedItems count="2"><s v="Pat Lee"/><s v="Sam Roe"/></sharedItems></cacheField><cacheField name="Note" numFmtId="0"><sharedItems/></cacheField></cacheFields></pivotCacheDefinition>`,
    'xl/pivotCache/_rels/pivotCacheDefinition1.xml.rels': relsXml([['rId1', 'pivotCacheRecords', 'pivotCacheRecords1.xml']]),
    'xl/pivotCache/pivotCacheRecords1.xml': `<pivotCacheRecords ${NS.s} count="2"><r><x v="0"/><s v="The gate code is 4471."/></r><r><x v="1"/><m/></r></pivotCacheRecords>`,
    'xl/externalLinks/externalLink1.xml': `<externalLink ${NS.s}><externalBook ${NS.r} r:id="rId1"><sheetNames><sheetName val="Rates"/></sheetNames><sheetDataSet><sheetData sheetId="0"><row r="1"><cell r="A1" t="str"><v>Floor price</v></cell><cell r="B1"><v>410000</v></cell></row></sheetData></sheetDataSet></externalBook></externalLink>`,
    'xl/connections.xml': `<connections ${NS.s}><connection id="1" name="Payroll DB" type="1" refreshedVersion="6"><dbPr connection="Driver={SQL Server};Server=db.internal.example;UID=svc;PWD=Wq8!zr4Lp2" command="SELECT * FROM pay"/></connection></connections>`,
  });
  const text = lines(xlsxText(xlsx));
  for (const s of ['Keep this from the client.', 'We can go as low as $90k.', 'Spare key is under the mat.', 'Alarm code 4471', 'Margin by phase', 'Margin', 'Slab\tFrame', '0.18\t0.22', 'Linear (Margin)',
    'Employee\tNote', 'Pat Lee\tSam Roe', 'Pat Lee\tThe gate code is 4471.', 'Sam Roe', 'Rates', 'Floor price\t410000', 'Payroll DB', 'Driver={SQL Server};Server=db.internal.example;UID=svc;PWD=Wq8!zr4Lp2', 'SELECT * FROM pay']) assert.ok(text.includes(s), s);
  assert.ok(!text.some((l) => /Anchor|Module1|1, 15/.test(l)), 'VML anchoring values are not text');
});

test('XLSX: validation prompts and lists, print headers, formula literals and hyperlink tooltips are read', () => {
  const xlsx = officeZip('xlsx', {
    'xl/workbook.xml': workbook([['Sheet1', 'rId1']]),
    'xl/worksheets/sheet1.xml': `<worksheet ${NS.s} ${NS.r}><sheetData><row r="1"><c r="A1" t="str"><f>IF(B1&gt;0,"Approved","Wire to account 70872490")</f><v>Approved</v></c></row></sheetData><dataValidations count="1"><dataValidation type="list" allowBlank="1" showInputMessage="1" promptTitle="Door code" prompt="Use 4471 for the side door." sqref="B1"><formula1>"Yes,No"</formula1></dataValidation></dataValidations><hyperlinks><hyperlink ref="C1" r:id="rId1" tooltip="Portal login kate / Tr4ctor!22"/></hyperlinks><headerFooter><oddHeader>&amp;LInternal&amp;RPage &amp;P</oddHeader></headerFooter></worksheet>`,
  });
  assert.deepEqual(lines(xlsxText(xlsx)), ['Sheet1', 'Approved', 'Wire to account 70872490', 'Door code', 'Use 4471 for the side door.', '"Yes,No"', 'Portal login kate / Tr4ctor!22', 'Internal Page']);
});

test('XLSX: macro and dialog sheets, macros, revision logs, Power Pivot data, missing parts and unmapped pivots can\'t be checked', () => {
  const book = (sheets, parts, opts) => officeZip('xlsx', { 'xl/workbook.xml': workbook(sheets), ...parts }, opts);
  const cases = [
    [book([['M', 'rId1']], { 'xl/_rels/workbook.xml.rels': relsXml([['rId1', 'http://schemas.microsoft.com/office/2006/relationships/xlMacrosheet', 'macrosheets/sheet1.xml']]), 'xl/macrosheets/sheet1.xml': '<xm:macrosheet xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main"/>' }), 'macros'],
    [book([['D', 'rId1']], { 'xl/_rels/workbook.xml.rels': relsXml([['rId1', 'dialogsheet', 'dialogsheets/sheet1.xml']]), 'xl/dialogsheets/sheet1.xml': `<dialogsheet ${NS.s}/>` }), 'dialog_sheet'],
    [book([['S', 'rId1']], { 'xl/worksheets/sheet1.xml': sheet(''), 'xl/vbaProject.bin': Buffer.from('vba') }), 'macros'],
    [book([['S', 'rId1']], { 'xl/worksheets/sheet1.xml': sheet(''), 'xl/revisions/revisionHeaders.xml': `<headers ${NS.s}/>` }), 'revisions'],
    [book([['S', 'rId1']], { 'xl/worksheets/sheet1.xml': sheet(''), 'xl/model/item.data': Buffer.from('model') }, { types: { 'xl/model/item.data': O + 'model+data' } }), 'data_model'],
    [book([['S', 'rId1']], { 'xl/worksheets/sheet1.xml': sheet(''), 'xl/drawings/drawing2.xml': '<x/>' }, { types: { 'xl/drawings/drawing2.xml': 'application/x-test-xml' } }), 'unknown_part'],
    [book([['S', 'rId1']], { 'xl/worksheets/sheet1.xml': sheet('<row r="1"><c r="A1" t="s"><v>3</v></c></row>') }), 'missing_part'],
    [book([['S', 'rId7']], { 'xl/worksheets/sheet1.xml': sheet('') }), 'missing_part'],
    [book([['S', 'rId1']], { 'xl/worksheets/sheet1.xml': sheet(''), 'xl/pivotCache/pivotCacheRecords1.xml': `<pivotCacheRecords ${NS.s}><r><x v="0"/></r></pivotCacheRecords>` }), 'pivot_cache'],
    [book([['S', 'rId1']], { 'xl/worksheets/sheet1.xml': sheet(''), 'xl/pivotCache/pivotCacheDefinition1.xml': `<pivotCacheDefinition ${NS.s}><cacheSource type="external"/><cacheFields count="0"/><cacheHierarchies count="1"/></pivotCacheDefinition>` }), 'pivot_cache'],
  ];
  for (const [buf, why] of cases) assert.equal(reason('book.xlsx', buf), why);
});

// ---- PPTX ----------------------------------------------------------------------------------------
const presentation = (ids) => `<p:presentation ${NS.p} ${NS.r}><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rIdM"/></p:sldMasterIdLst><p:sldIdLst>${ids.map((id, i) => `<p:sldId id="${256 + i}" r:id="${id}"/>`).join('')}</p:sldIdLst><p:sldSz cx="9144000" cy="6858000"/></p:presentation>`;

test('PPTX: slides in presentation order with notes and comments, then SmartArt, charts, tables, groups, layouts and masters', async () => {
  const group = `<p:grpSp><p:nvGrpSpPr><p:cNvPr id="4" name="Group 3"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>${shape('Grouped note')}</p:grpSp>`;
  const table = '<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="5" name="Table 4"/><p:cNvGraphicFramePr/><p:nvPr/></p:nvGraphicFramePr><p:xfrm/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table"><a:tbl><a:tr h="1"><a:tc><a:txBody><a:bodyPr/><a:p><a:r><a:t>Login</a:t></a:r></a:p></a:txBody></a:tc><a:tc><a:txBody><a:bodyPr/><a:p><a:r><a:t>kate.m</a:t></a:r></a:p></a:txBody></a:tc></a:tr></a:tbl></a:graphicData></a:graphic></p:graphicFrame>';
  const pptx = officeZip('pptx', {
    'ppt/presentation.xml': presentation(['rId2', 'rId1']),
    'ppt/_rels/presentation.xml.rels': relsXml([['rId1', 'slide', 'slides/slide1.xml'], ['rId2', 'slide', 'slides/slide2.xml'], ['rIdM', 'slideMaster', 'slideMasters/slideMaster1.xml']]),
    'ppt/slides/slide1.xml': slide(shape('First slide') + group + table),
    'ppt/slides/slide2.xml': slide(shape('Second slide')),
    'ppt/slides/_rels/slide2.xml.rels': relsXml([['rId1', 'notesSlide', '../notesSlides/notesSlide1.xml'], ['rId2', 'comments', '../comments/comment1.xml'], ['rId3', 'diagramData', '../diagrams/data1.xml']]),
    'ppt/notesSlides/notesSlide1.xml': `<p:notes ${NS.p} ${NS.a}><p:cSld><p:spTree>${shape('Speaker note on slide two.')}</p:spTree></p:cSld></p:notes>`,
    'ppt/comments/comment1.xml': `<p:cmLst ${NS.p}><p:cm authorId="0" dt="2026-10-01T10:00:00.000" idx="1"><p:pos x="10" y="10"/><p:text>Floor is $410k.</p:text></p:cm></p:cmLst>`,
    'ppt/comments/modernComment_101_0.xml': `<p188:cmLst xmlns:p188="http://schemas.microsoft.com/office/powerpoint/2018/8/main" ${NS.a}><p188:cm id="{33333333-3333-3333-3333-333333333333}" authorId="{44444444-4444-4444-4444-444444444444}" created="2026-10-01T10:00:00.000"><p188:txBody><a:bodyPr/><a:p><a:r><a:t>Keep this from the client.</a:t></a:r></a:p></p188:txBody></p188:cm></p188:cmLst>`,
    'ppt/diagrams/data1.xml': `<dgm:dataModel ${NS.dgm} ${NS.a}><dgm:ptLst><dgm:pt modelId="0" type="doc"><dgm:prSet/><dgm:spPr/><dgm:t><a:bodyPr/><a:p><a:endParaRPr/></a:p></dgm:t></dgm:pt><dgm:pt modelId="1"><dgm:prSet phldrT="[Text]"/><dgm:spPr/><dgm:t><a:bodyPr/><a:p><a:r><a:t>${SECRET}</a:t></a:r></a:p></dgm:t></dgm:pt></dgm:ptLst><dgm:cxnLst/></dgm:dataModel>`,
    'ppt/charts/chart1.xml': `<c:chartSpace ${NS.c} ${NS.a}><c:chart><c:title><c:tx><c:rich><a:bodyPr/><a:p><a:r><a:t>Bid strategy</a:t></a:r></a:p></c:rich></c:tx></c:title></c:chart></c:chartSpace>`,
    'ppt/slideLayouts/slideLayout1.xml': `<p:sldLayout ${NS.p} ${NS.a} ${NS.r}><p:cSld name="Title"><p:spTree>${shape('Internal use only')}</p:spTree></p:cSld></p:sldLayout>`,
    'ppt/slideMasters/slideMaster1.xml': `<p:sldMaster ${NS.p} ${NS.a} ${NS.r}><p:cSld><p:spTree>${shape('Click to edit Master title style')}</p:spTree></p:cSld><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>`,
    'ppt/notesMasters/notesMaster1.xml': `<p:notesMaster ${NS.p} ${NS.a}><p:cSld><p:spTree>${shape('Notes master footer')}</p:spTree></p:cSld></p:notesMaster>`,
  });
  const text = lines(pptxText(pptx));
  assert.deepEqual(text.slice(0, 7), ['Second slide', 'Speaker note on slide two.', 'Floor is $410k.', 'First slide', 'Grouped note', 'Login\tkate.m', 'Bid strategy']);
  for (const s of ['Keep this from the client.', SECRET, 'Internal use only', 'Click to edit Master title style', 'Notes master footer']) assert.ok(text.includes(s), s);
  assert.ok((await gate(file('deck.pptx', pptx))).some((f) => f.category === 'access'));
});

test('PPTX: OLE objects, ActiveX controls, unknown parts and missing slides can\'t be checked', () => {
  const deck = (parts, opts) => officeZip('pptx', { 'ppt/presentation.xml': presentation(['rId1']), 'ppt/slides/slide1.xml': slide(shape('Hi')), ...parts }, opts);
  assert.equal(reason('a.pptx', deck({ 'ppt/embeddings/oleObject1.bin': Buffer.from('ole') })), 'embedded_object');
  assert.equal(reason('b.pptx', deck({ 'ppt/activeX/activeX1.xml': '<ax:ocx xmlns:ax="http://schemas.microsoft.com/office/2006/activeX"/>' })), 'activex');
  assert.equal(reason('c.pptx', deck({ 'ppt/extra/thing.dat': Buffer.from('?') })), 'unknown_part');
  assert.equal(reason('d.pptx', deck({ 'ppt/_rels/presentation.xml.rels': relsXml([['rId1', 'slide', 'slides/slide9.xml']]) })), 'missing_part');
});

// ---- ordinary files ------------------------------------------------------------------------------
const THEME = `<a:theme ${NS.a} name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri Light"/></a:majorFont></a:fontScheme></a:themeElements></a:theme>`;
const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');
test('ordinary DOCX, XLSX and PPTX files with the usual parts are read and go through clear', async () => {
  const docx = officeZip('docx', {
    'word/document.xml': wdoc(para('Kate, here is the schedule for the North Hall pour.') + para('The crane arrives on Tuesday at 7 a.m.') + '<w:p><w:r><w:drawing><wp:inline><wp:docPr id="1" name="Picture 1"/><a:graphic><a:graphicData uri="x"/></a:graphic></wp:inline></w:drawing></w:r></w:p>'),
    'word/styles.xml': wpart('styles', '<w:docDefaults/><w:style w:type="paragraph" w:styleId="Normal"><w:name w:val="Normal"/></w:style>'),
    'word/stylesWithEffects.xml': wpart('styles', ''),
    'word/settings.xml': `<w:settings ${NS.w} ${NS.m}><w:zoom w:percent="100"/><w:defaultTabStop w:val="720"/><w:rsids><w:rsidRoot w:val="00A10B2C"/></w:rsids><m:mathPr><m:mathFont m:val="Cambria Math"/></m:mathPr></w:settings>`,
    'word/webSettings.xml': wpart('webSettings', '<w:optimizeForBrowser/>'),
    'word/fontTable.xml': wpart('fonts', '<w:font w:name="Calibri"><w:panose1 w:val="020F0502020204030204"/></w:font>'),
    'word/numbering.xml': wpart('numbering', '<w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:numFmt w:val="bullet"/><w:lvlText w:val=""/></w:lvl><w:lvl w:ilvl="1"><w:numFmt w:val="decimal"/><w:lvlText w:val="%2."/></w:lvl></w:abstractNum>'),
    'word/theme/theme1.xml': THEME, 'word/media/image1.png': PNG,
    'word/footer1.xml': wpart('ftr', '<w:p><w:r><w:t xml:space="preserve">Page </w:t></w:r><w:fldSimple w:instr=" PAGE   \\* MERGEFORMAT "><w:r><w:t>1</w:t></w:r></w:fldSimple></w:p>'),
    'customXml/item1.xml': '<b:Sources xmlns:b="http://schemas.openxmlformats.org/officeDocument/2006/bibliography" SelectedStyle="\\APA.XSL" StyleName="APA"/>',
    'customXml/itemProps1.xml': '<ds:datastoreItem xmlns:ds="http://schemas.openxmlformats.org/officeDocument/2006/customXml" ds:itemID="{55555555-5555-5555-5555-555555555555}"/>',
    ...COMMON,
  });
  const xlsx = officeZip('xlsx', {
    'xl/workbook.xml': workbook([['Schedule', 'rId1']], '<definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">Schedule!$A$1:$B$3</definedName></definedNames><calcPr calcId="191029"/>'),
    'xl/worksheets/sheet1.xml': `<worksheet ${NS.s} ${NS.r}><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><dimension ref="A1:B3"/><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c></row><row r="2"><c r="A2" t="s"><v>2</v></c><c r="B2"><v>40</v></c></row><row r="3"><c r="A3" t="s"><v>2</v></c><c r="B3"><f>B2*2</f><v>80</v></c></row></sheetData><pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/><pageSetup orientation="portrait" r:id="rId1"/><tableParts count="1"><tablePart r:id="rId2"/></tableParts></worksheet>`,
    'xl/sharedStrings.xml': `<sst ${NS.s} count="4" uniqueCount="3"><si><t>Item</t></si><si><t>Qty</t></si><si><t>Rebar</t></si></sst>`,
    'xl/styles.xml': `<styleSheet ${NS.s}><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><cellXfs count="1"><xf numFmtId="0" fontId="0"/></cellXfs></styleSheet>`,
    'xl/theme/theme1.xml': THEME, 'xl/calcChain.xml': `<calcChain ${NS.s}><c r="B3" i="1"/></calcChain>`,
    'xl/tables/table1.xml': `<table ${NS.s} id="1" name="Table1" displayName="Table1" ref="A1:B3"><autoFilter ref="A1:B3"/><tableColumns count="2"><tableColumn id="1" name="Item"/><tableColumn id="2" name="Qty"/></tableColumns><tableStyleInfo name="TableStyleMedium2" showRowStripes="1"/></table>`,
    'xl/printerSettings/printerSettings1.bin': Buffer.from('printer'),
    ...COMMON,
  }, { types: { 'xl/printerSettings/printerSettings1.bin': O + 'spreadsheetml.printerSettings' } });
  const pptx = officeZip('pptx', {
    'ppt/presentation.xml': presentation(['rId1']),
    'ppt/_rels/presentation.xml.rels': relsXml([['rId1', 'slide', 'slides/slide1.xml'], ['rIdM', 'slideMaster', 'slideMasters/slideMaster1.xml']]),
    'ppt/slides/slide1.xml': slide(shape('North Hall schedule') + shape('Pour on Tuesday, crane at 7 a.m.')),
    'ppt/slideLayouts/slideLayout1.xml': `<p:sldLayout ${NS.p} ${NS.a} ${NS.r}><p:cSld name="Title Slide"><p:spTree>${shape('Click to edit Master subtitle style')}</p:spTree></p:cSld></p:sldLayout>`,
    'ppt/slideMasters/slideMaster1.xml': `<p:sldMaster ${NS.p} ${NS.a} ${NS.r}><p:cSld><p:spTree>${shape('Click to edit Master title style')}</p:spTree></p:cSld><p:txStyles><p:titleStyle/></p:txStyles></p:sldMaster>`,
    'ppt/theme/theme1.xml': THEME, 'ppt/media/image1.png': PNG,
    'ppt/presProps.xml': `<p:presentationPr ${NS.p}/>`, 'ppt/viewProps.xml': `<p:viewPr ${NS.p}/>`, 'ppt/tableStyles.xml': `<a:tblStyleLst ${NS.a} def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>`,
    'ppt/commentAuthors.xml': `<p:cmAuthorLst ${NS.p}><p:cmAuthor id="0" name="Kate Example" initials="KE" lastIdx="1" clrIdx="0"/></p:cmAuthorLst>`,
    'ppt/tags/tag1.xml': `<p:tagLst ${NS.p}><p:tag name="ADDIN_ID" val="1234"/></p:tagLst>`,
    ...COMMON,
  });
  assert.equal(docxText(docx), 'Kate, here is the schedule for the North Hall pour.\nThe crane arrives on Tuesday at 7 a.m.\nPage 1\nNorthline Builders\nSite schedule\nKate Example\nKate Example');
  assert.equal(xlsxText(xlsx), 'Schedule\nItem\tQty\nRebar\t40\nRebar\t80\nNorthline Builders\nSite schedule\nKate Example\nKate Example');
  assert.ok(pptxText(pptx).startsWith('North Hall schedule\nPour on Tuesday, crane at 7 a.m.'));
  assert.deepEqual(await gate(file('schedule.docx', docx), file('schedule.xlsx', xlsx), file('schedule.pptx', pptx)), []);
});

// A workbook written by openpyxl 3 (a generator other than Excel, with its own prefixes): a hidden
// sheet, a note in a VML box bound to ns0/ns2, a chart, a table, a validation and a defined name.
test('a workbook written by another generator reads in full and goes through clear', async () => {
  const xlsx = readFileSync(new URL('./fixtures/openpyxl-schedule.xlsx', import.meta.url));
  assert.equal(xlsxText(xlsx), 'Schedule\nItem\tQty\tNote\nRebar\t40\tTuesday\nFormwork\t12\tFriday\nPortal\nReady\nPick one\n"Yes,No"\nNorth Hall\nHidden\nHidden sheet text\nCrew\tSchedule!$A$2:$A$3\nQuantities\nCheck with Kate before the pour.\nKate Example\nSite schedule');
  assert.deepEqual(await gate(file('schedule.xlsx', xlsx)), []);
});

// ---- bounds --------------------------------------------------------------------------------------
test('large documents and workbooks read in linear time; too much text, too much expansion or deep nesting can\'t be checked', () => {
  const time = (fn) => { const t = Date.now(); const out = fn(); return [out, Date.now() - t]; };
  const paras = (n) => Array.from({ length: n }, (_, i) => `<w:p><w:r><w:t>Line ${i} of the long schedule.</w:t></w:r></w:p>`).join('');
  const rows = (n) => Array.from({ length: n }, (_, i) => `<row r="${i + 1}"><c r="A${i + 1}"><v>${i}</v></c><c r="B${i + 1}" t="inlineStr"><is><t>Row ${i}</t></is></c></row>`).join('');
  const [small, tSmall] = time(() => docxText(officeZip('docx', { 'word/document.xml': wdoc(paras(1250)) })));
  const [large, tLarge] = time(() => docxText(officeZip('docx', { 'word/document.xml': wdoc(paras(5000)) })));
  assert.equal(lines(large).length, 5000);
  assert.ok(tLarge < Math.max(400, tSmall * 12), `5000 paragraphs took ${tLarge} ms against ${tSmall} ms for 1250`);
  const [book, tBook] = time(() => xlsxText(officeZip('xlsx', { 'xl/workbook.xml': workbook([['S', 'rId1']]), 'xl/worksheets/sheet1.xml': sheet(rows(8000)) })));
  assert.equal(lines(book).length, 8001);
  assert.ok(tBook < 1500, `8000 rows took ${tBook} ms`);
  // Over the text limit, reading stops with "too long".
  assert.equal(reason('long.docx', officeZip('docx', { 'word/document.xml': wdoc(paras(7000)) })), 'too_long');
  // Declared expansion counts across embedded files: two workbooks of 12 MiB each pass 20 MiB.
  const padded = officeZip('xlsx', { 'xl/workbook.xml': workbook([['S', 'rId1']]), 'xl/worksheets/sheet1.xml': sheet(''), 'xl/media/image1.png': Buffer.alloc(6 * 1024 * 1024), 'xl/media/image2.png': Buffer.alloc(6 * 1024 * 1024) });
  assert.ok(padded.length < 200000);
  assert.equal(reason('big.docx', officeZip('docx', { 'word/document.xml': wdoc(para('Body')), 'word/embeddings/a.xlsx': padded, 'word/embeddings/b.xlsx': padded })), 'entry_too_large');
  // A file in a file in a file in a file.
  let nested = officeZip('docx', { 'word/document.xml': wdoc(para('Innermost')) });
  for (let i = 0; i < 3; i++) nested = officeZip('docx', { 'word/document.xml': wdoc(para('Level')), 'word/embeddings/inner.docx': nested });
  assert.equal(reason('nested.docx', nested), 'nested_too_deep');
});
