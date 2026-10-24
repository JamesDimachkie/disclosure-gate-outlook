# Developing Disclosure Gate for Outlook

`SPEC.md` is the product contract. The runtime research and the checks that still need a live
Outlook are in `outlook/RUNTIME-V2-NOTES.md`.

## Classic Outlook and ES2016

Classic Outlook for Windows runs event handlers in a JavaScript-only runtime; builds before 2403 only
support ES2016. `dist/runtime.js` is one classic script compiled for that target. Every regex that
reads named groups or match positions is made through `core/regex.mjs`; `tools/build.mjs` converts
each one at build time and `outlook/indexed-pattern.mjs` restores groups and positions.
`test/legacy-equivalence.test.mjs` checks the converted bundle finds exactly what the native core finds.

## Configuration in both runtimes

The mailbox's own domain (Office's userProfile) is always inside; the From address never is, since
send-as, shared mailboxes and other accounts can put any domain there. Extra domains are exact
matches: listing example.com does not include sub.example.com.

The manifest encodes public configuration in the HTML runtime, JavaScript override and pane URLs.
HTML runtimes read their page URL. On Mailbox 1.14, classic Outlook reads
Office.context.urls.javascriptRuntimeUrl. Microsoft explicitly documents query-string access in
its [Urls reference](https://learn.microsoft.com/en-us/javascript/api/office/office.urls?view=common-js).

Older classic clients cannot use that API, so only the mailbox's own domain is inside there: mail
between an organization's other domains is screened as outside. There is deliberately no per-user
setting (an earlier roamingSettings fallback let a user widen "inside", e.g. to gmail.com, and so
bypass a hold). Missing or malformed URL settings use conditional button copy; the installed manifest still
controls the buttons. Admin defaults are findings=ask,failures=ask. Legacy mode=warn/enforce maps
to ask/ask or hold/hold. Explicit new values refine aliases; duplicates/invalid values are refused.
Both Ask generates PromptUser; Hold/Ask generates SoftBlock; failures=Hold generates Block.
If failures=Ask and the runtime cannot load, Outlook offers Send Anyway / Try Later. With
failures=Hold, the installed Block mode holds on load failure. Invalid or duplicate settings use
the same mailbox-domain-only, settings-unknown runtime fallback as an unreadable URL.

## Development

- npm ci installs build/test dependencies only.
- npm test builds first, then runs the offline suite sequentially.
- npm run build writes dist and validates both generated manifests offline.
- npm run dev builds, then serves dist at https://localhost:3443. Stop with Ctrl+C.
- outlook/start-local.ps1 is a launcher for the same command. It reads no API keys or config files.
- Rebuild and reload after editing; this deliberately has no hot-reload client in the event runtime.
- Pane previews: /taskpane.html?preview=held&theme=light. Other preview states are idle, checking,
  attachment, clear and unavailable. These use fictional data and do not prove Outlook behavior.

### Public attachment corpus check

Keep downloaded public data outside repositories (here, a sibling folder `../dg-email-corpus/`).
The 24 October corpus is Mozilla pdf.js `test/pdfs` tree
`aaf1f935676dee10a85871671af8c4609dcbcc10` (repository commit
`7f23cbbd17a7b991423d70cb089cd1dff5080277`) and Apache POI `test-data/document`,
`test-data/spreadsheet`, `test-data/slideshow` at
`b014b071ab8ffe9ec025ae750c52ffdc02eeff27`. Only PDF/DOCX/XLSX/PPTX files are inputs;
`DOWNLOAD.json` records each Git blob hash. Treat every file as untrusted; never execute corpus
content. Scripts run from this repository.

```powershell
node tools/corpus-check.mjs ../dg-email-corpus ../corpus-baseline.json --source ../dg-baseline
node tools/corpus-check.mjs ../dg-email-corpus ../corpus-current.json --compare ../corpus-baseline.json
```

Run the baseline first, then use `--compare` to include per-file transitions in the current JSON.
`--source` selects a trusted code snapshot containing `core/`; use `git archive <revision> core`
and extract it to a disposable directory rather than changing another checkout. The baseline for
this lane is `c80811249f5dfae328a3bfed86aa9fefd941a726`. The runner executes every input in a
fresh Node child (`--max-old-space-size=400`, sequentially), with a 10-second wall-clock kill
(`--timeout-ms` can select 100–60,000 ms). It calls `attachmentText` and the same bounded native
coverage/image-selection APIs used before OCR. No OCR inference or model is run. Counts distinguish
`ok`, `needs_ocr`, `cant_check`, `timeout` and `crash`; reasons, native extraction outcomes, timings,
slowest files and download provenance are retained in JSON. Any crash/timeout makes the command
exit nonzero. This is parser and OCR-selection evidence, not OCR accuracy or live Outlook timing.

24 October 2026 results (same 1,586 inputs; no crashes, timeouts or skipped files):

| Format | Baseline native OK | Baseline needs OCR | Baseline can't-check | Revised native OK | Revised needs OCR | Revised can't-check |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| PDF | 457 | 3 | 548 | 369 | 3 | 636 |
| DOCX | 107 | 0 | 23 | 90 | 15 | 25 |
| PPTX | 71 | 0 | 24 | 36 | 26 | 33 |
| XLSX | 309 | 0 | 44 | 291 | 14 | 48 |

Of the 88 PDFs newly can't-check, the primary reasons are `unmapped_font` 27 (including Type3),
`scan_rendering` 19, `pattern` 17, `scan_annotations` 13, `scan_encoding` 5,
`annotation_unreadable` 2, and one each of `form_depth`, `scan_size`, `bad_flate`, `scan_pages`
and `unsupported_filter`. No unproven unmapped-symbol exception was added. The 15 Office files
newly can't-check comprise `image_size` 11, and one each of `scan_rendering`, `no_text`,
`ocr_unsupported` and `too_complex`. Unreadable Office pictures in that count ask; document
failures follow the failures setting. The separate 55 Office files need OCR before a decision.
PDFs with image pages that the bounded scan extractor cannot represent remain can't-check;
the runner does not count them as successful OCR candidates.

Total subprocess wall time was 175.54 s baseline and 172.97 s revised. Summed per-file checking
time (file read/imports, native extraction and OCR selection) was 57.63 s and 51.48 s; the slowest
checks were 485.57 ms and 644.28 ms. These are separate runs on this laptop, not a controlled
benchmark or a Send latency claim. Every file's outcome/reason/timing is in the generated JSON.

The dev server reuses the existing localhost certificate from the Office add-in development
certificate folder. It does not install or change trust. If that certificate is missing, untrusted
or expired, set one up with Microsoft's office-addin-dev-certs tool first. It serves only built static files,
accepts GET/HEAD, and rejects the former /check and /timing POST endpoints.

Do not run an online manifest validator: the included validator checks XML well-formedness,
required elements, resource references, HTTPS URLs, send modes, the Review command and the classic
script override. This is structural validation, not Microsoft's complete schema or tenant acceptance.

## Send and review

The reader checks addresses first. Inside-only mail does not read subject, body or attachments.
Otherwise it reads all outgoing text, including quoted history, and supported attachments.

Core uses portable typed arrays, synchronous SHA-256, base64 decoding, CRC32, and a bounded pure-JS
raw/zlib inflater. Supported text formats are PDF with a text layer, DOCX, XLSX, PPTX, CSV and TXT, up
to 10 MiB each. ZIP entries are bounded at 10 MiB and declared expansion at 20 MiB across a file and
every Office file embedded in it. Unsupported, encrypted or incomplete reads produce a file
finding; supported scans go through OCR. Pictures follow SPEC §5.9 (see "Images and scans" below).

Office files are read part by part (`core/extract/office.mjs`, over the scanner in `xml.mjs`). Every
part in the package is classified by its content type and picture relationships: read, collected
for OCR, known to hold no extra readable text (styles, themes, ids, duplicate caches), or the whole
file can't be checked. Sheets and slides come from the workbook's and the
presentation's relationships, in their order. Embedded DOCX/XLSX/PPTX files are read (three levels at
most). Unknown parts, macros, ActiveX, OLE objects, dialog sheets, shared-workbook revisions, Power
Pivot data, OLAP pivot caches, malformed XML, a DOCTYPE, and words in an element a reader doesn't read
(`unread_text:<element>`) make the file "can't check". Office pictures are collected by
`officeCoverage` for OCR; direct text-only readers refuse pictures that need recognition.
Only micro-images up to 8×8 pixels and 256 bytes and unreferenced cached thumbnails are ignored.
SVG text is read natively; SVG image/use/foreignObject content asks as an unsupported picture.
PDFs add form field values, annotation text and annotation
appearances; XFA forms and files attached to a PDF can't be checked.

The handler has a 4.5-second timer and wall-clock checks, completes each event once, and re-reads
the fingerprint before releasing a Clear draft. The fingerprint covers sender, recipients, subject,
body/format and attachment identity/metadata; it does not download every attachment a second time.
The Review button uses dgOpenPane for messages and dgOpenMeetingPane on the appointment organizer
surface on Mailbox 1.14, with a ribbon fallback on older clients. Both Send events share one runtime
and installed SendMode. Appointments map required/optional attendees to To/Cc, add exposed room
addresses to To and screen location text as a separate, non-removable source. Location and room
metadata are included in the release fingerprint. Missing room enumeration fails the read.
Outcome classification lives in core/settings.mjs: unreadable-attachment cards are failures; other
non-prompt findings use the findings setting. Prompt-severity exceptions always ask. Mixed results
ask only if every part asks. Mailbox 1.14+ applies promptUser to ask outcomes; a SoftBlock or Block installation
on older clients holds them. Copy follows the effective outcome. Mailbox 1.15 gets markdown plus
plain fallback; older clients get sentences. Findings set commandId/cancelLabel only on 1.14+.
Failure-only dialogs use Outlook's Send Anyway / Don't Send path. Refused customization retries
plainly; a refused override retries with installed-mode copy. Native behavior needs live acceptance.

The pane reads the last Send result from item.sessionData, bound to a compact SHA-256 fingerprint.
It shows recipient findings as addresses without sentence-removal controls. Large results exceeding
the older client's session-data allowance store a marker; after matching the current fingerprint,
the pane reconstructs that result locally. Failure states offer Check again: OCR preparation, a
fresh full read with a 15-second OCR budget, and core checkDraft with the pane's configuration.
The result is advisory; it never stores a release authorization and Send always re-checks. Sentence removal
is an explicit user action and re-reads the draft before writing.

## Data boundary and integration

The application makes no content POSTs, hosted-model calls, beacons, telemetry or check logs.
Outlook loads the static files and Microsoft's required Office.js library; its own mailbox APIs
supply the draft. Build-time npm downloads do not exist in the installed product. No real mail,
secrets or customer documents belong in test fixtures.

## Images and scans (OCR)


PNG, JPEG, GIF, BMP, TIFF and WebP file images, including inline images, receive on-device OCR in
a browser runtime with Workers and WebAssembly. Attachment-added/removed and compose-open events
pre-read them; opening the pane is another pre-read path. The engine loads only for an image that
needs recognition. All worker, core, WASM and English model files are served from the add-in's own
static origin. Good-confidence text is screened normally and findings say `In <image name>`;
confidently empty images clear. A picture is excused only if its bytes carry a PNG, JPEG, GIF, BMP,
TIFF or WebP signature and the reason is a genuine reading failure (low confidence, OCR unavailable,
animated or oversized: `PICTURE_UNREADABLE` in core/gate.mjs): inline it is ignored, attached it is a
Send-anyway prompt. Any other picture outcome follows the failures setting. A measured micro-image exception skips
only inline file images at most 8 by 8 px and 256 bytes. Other inline files take the normal path.
Animated/multi-page containers and images over 12 megapixels are genuine reading failures (above).

PDFs always undergo native text extraction first. `pdfCoverage` records every image-bearing page,
including image-only pages and images beside native text. The local scan extractor can OCR
displayed JPEG XObjects or simple raw/Flate RGB/gray images across the selected pages/forms.
Native and OCR text are combined; native notes/fields never substitute for page coverage.
Scanned PDFs inside Office packages retain the PDF failures policy; wrapping them does not turn
an unread scan into the Office picture exception.
Every selected page/image must be accounted for; masks, annotations on scan pages, clipping/painting,
unsupported colorspaces/filters, missing images and more than 12 images/pages stay can't check.
No full PDF renderer is shipped. OCR is English only. The synthetic calibration method, measured
thresholds and substantial remaining photo over-holds are in
[evaluation/ocr-calibration/README.md](evaluation/ocr-calibration/README.md).

The OCR seam is item.sessionData["dg-ocr-v1"]:
{version:1, attachments:{[id]:{name,size,hash,status,text,hint,reason,at,token}}}.
Ready entries require a SHA-256 hash of the attachment bytes, fresh matching bytes on Send, exact
id/name/size and an eligible picture, PDF scan or Office picture set. OCR entries cannot bypass
native document extraction. Office results bind to the whole file, including embedded files.
Failed multi-picture reads retain confident text separately from uncertain hints; pending/hash
failures stop, while unreadable embedded Office pictures use the attached-picture prompt.
Removal/replacement invalidates entries and stale jobs;
an explicit Added event also invalidates a reused identical tuple. Pending/failed/unsupported states
never clear automatically; an Ask outcome needs human confirmation. The serialized OCR cache is bounded at 12,000 characters; oversized text is not
truncated into a ready result. Tesseract's persistent data cache is disabled and its worker is
terminated after the queue drains. Where the classic event runtime cannot run OCR, attached
unreadable pictures ask (subject to installed mode on older clients); a capable pane can pre-read them if item.sessionData is available to share
the result. No sessionData means cross-runtime reuse is unavailable. OCR still runs on the device;
the email data boundary is unchanged.

## Ask-first verification

The generated dev manifest keeps Id cf4aa3ad-2656-4bc5-a8c1-ae4734bf4b32 and
https://localhost:3443/, findings=ask,failures=ask and PromptUser for both Send events.
tools/validate-manifest.mjs runs during build; it is structural validation, not tenant acceptance.
test/ask-first.test.mjs drives the ES2016 VM bundle through the two-setting outcome matrix for
email/meetings at 1.12/1.14/1.15, copy budgets, strict URL aliases and a built-pane button retry.
Do not read or tune on evaluation/heldout/. No hosted evaluator is required.
