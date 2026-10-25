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

Use Node 24 and PowerShell 7 (or a shell that supports `&&`). Run these commands from the
repository root. Before starting the HTTPS server, use an existing trusted localhost certificate
in the Office add-in development certificate folder. The server does not install certificates or
change trust; see Microsoft's [office-addin-dev-certs instructions](https://github.com/OfficeDev/Office-Addin-Scripts/tree/master/packages/office-addin-dev-certs).
Port 3443 must be free. If startup reports `EADDRINUSE`, stop only your own previous development
server or ask its owner to free the port.

- npm ci installs build/test dependencies only.
- npm test builds first, then runs the offline suite sequentially.
- npm run build writes dist and validates both generated manifests offline.
- npm run dev builds, then serves dist at https://localhost:3443. Stop with Ctrl+C.
- outlook/start-local.ps1 is a launcher for the same command. It reads no API keys or config files.
- Rebuild and reload after editing; this deliberately has no hot-reload client in the event runtime.
- Pane previews: /taskpane.html?preview=held&theme=light. Other preview states are idle, checking,
  attachment, clear and unavailable. These use fictional data and do not prove Outlook behavior.

`npm ci` can print npm's install-script approval warning for build dependencies. Record the warning
and check the build result; installing dependencies does not establish that the add-in works in Outlook.

### Public attachment corpus check

Keep downloaded public data outside repositories (here, a sibling folder `../dg-email-corpus/`).
The 24 October corpus is Mozilla pdf.js `test/pdfs` tree
`aaf1f935676dee10a85871671af8c4609dcbcc10` (repository commit
`7f23cbbd17a7b991423d70cb089cd1dff5080277`) and Apache POI `test-data/document`,
`test-data/spreadsheet`, `test-data/slideshow` at
`b014b071ab8ffe9ec025ae750c52ffdc02eeff27`. Only PDF/DOCX/XLSX/PPTX files are inputs;
`DOWNLOAD.json` records each Git blob hash. Treat every file as untrusted; never execute corpus
content. Scripts run from this repository. The corpus is not bundled with the source.

#### Download and check the current build

From the repository root, run this PowerShell 7 block. It downloads only the supported file types
from the pinned public GitHub trees into a new sibling folder and verifies each Git blob hash.
No Git clone, sign-in or extra package is needed. Allow time and disk space for the public files.
Do not open these deliberately difficult documents in Office or execute their contents.

```powershell
$ErrorActionPreference = 'Stop'
$corpus = [IO.Path]::GetFullPath((Join-Path (Get-Location) '../dg-email-corpus'))
if (Test-Path -LiteralPath $corpus) { throw 'Choose a fresh corpus folder; do not overwrite an existing download.' }
New-Item -ItemType Directory -Path $corpus | Out-Null
$pdfCommit = '7f23cbbd17a7b991423d70cb089cd1dff5080277'
$poiCommit = 'b014b071ab8ffe9ec025ae750c52ffdc02eeff27'
$sources = @(
    @{ Repo = 'mozilla/pdf.js'; Commit = $pdfCommit; Prefix = 'pdfjs'; Pattern = '^test/pdfs/.*\.pdf$' },
    @{ Repo = 'apache/poi'; Commit = $poiCommit; Prefix = 'poi'; Pattern = '^test-data/(document|spreadsheet|slideshow)/.*\.(docx|xlsx|pptx)$' }
)
$files = @()
$pdfTree = $null
foreach ($source in $sources) {
    $tree = Invoke-RestMethod "https://api.github.com/repos/$($source.Repo)/git/trees/$($source.Commit)?recursive=1"
    if ($tree.truncated) { throw 'Incomplete source tree; stop without running the check.' }
    if ($source.Prefix -eq 'pdfjs') { $pdfTree = ($tree.tree | Where-Object path -eq 'test/pdfs').sha }
    foreach ($file in ($tree.tree | Where-Object { $_.type -eq 'blob' -and $_.path -match $source.Pattern })) {
        $relative = "$($source.Prefix)/$($file.path)"
        $target = Join-Path $corpus $relative
        New-Item -ItemType Directory -Force -Path (Split-Path $target -Parent) | Out-Null
        $escaped = ($file.path.Split('/') | ForEach-Object { [uri]::EscapeDataString($_) }) -join '/'
        Invoke-WebRequest "https://raw.githubusercontent.com/$($source.Repo)/$($source.Commit)/$escaped" -OutFile $target -MaximumRetryCount 2 -RetryIntervalSec 1
        $hash = git hash-object --no-filters -- $target
        if ($LASTEXITCODE -ne 0 -or $hash -ne $file.sha) { throw "Blob hash mismatch: $relative" }
        $files += @{ path = $relative; sha = $hash; bytes = $file.size }
    }
}
@{ pdfTree = $pdfTree; pdfCommit = $pdfCommit; poiCommit = $poiCommit; files = $files; failures = @() } |
    ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 (Join-Path $corpus 'DOWNLOAD.json')
node tools/with-heavy-lock.mjs -- node tools/corpus-check.mjs ../dg-email-corpus ../corpus-current.json
```

GitHub's unauthenticated API has rate limits; if a request fails, retain the partial folder for
diagnosis and retry in a fresh folder once access is restored. The runner accepts any folder of
PDF/DOCX/XLSX/PPTX files, so a smaller local corpus can also be checked; its results are not the
1,586-file measurement below.

#### Optional comparison with another code snapshot

This requires a separate, trusted code snapshot containing `core/` at `../dg-baseline` and an
identical downloaded corpus. Export a revision you actually have with `git archive <revision> core`
and extract it into that empty directory; do not switch or change another checkout.

```powershell
node tools/with-heavy-lock.mjs -- node tools/corpus-check.mjs ../dg-email-corpus ../corpus-baseline.json --source ../dg-baseline
node tools/with-heavy-lock.mjs -- node tools/corpus-check.mjs ../dg-email-corpus ../corpus-current.json --compare ../corpus-baseline.json
```

Run the baseline first, then use `--compare` to include per-file transitions in the current JSON.
`--source` selects that trusted snapshot. The historical baseline below was
`c80811249f5dfae328a3bfed86aa9fefd941a726`; it belongs to the original development history and is
not available in the public repository's fresh history. A current-build check needs no baseline.
The runner executes every input in a
fresh Node child (`--max-old-space-size=400`, sequentially), with a 10-second wall-clock kill
(`--timeout-ms` can select 100–60,000 ms). It calls `attachmentText` and the same bounded native
coverage/image-selection APIs used before OCR. No OCR inference or model is run. Counts distinguish
`ok`, `needs_ocr`, `cant_check`, `timeout` and `crash`; reasons, native extraction outcomes, timings,
slowest files and download provenance are retained in JSON. Any crash/timeout makes the command
exit nonzero. This is parser and OCR-selection evidence, not OCR accuracy or live Outlook timing.

24 October 2026 rerun after the zlib-checksum and LZW/predictor fixes (same 1,586 inputs;
no crashes, timeouts or skipped files). The earlier source baseline was reproduced locally from
`c80811249f5dfae328a3bfed86aa9fefd941a726`, exported into an isolated QA directory in this checkout.

| Format | Baseline native OK | Baseline needs OCR | Baseline can't-check | Current native OK | Current needs OCR | Current can't-check |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| PDF | 457 | 3 | 548 | 384 | 3 | 621 |
| DOCX | 107 | 0 | 23 | 90 | 15 | 25 |
| PPTX | 71 | 0 | 24 | 36 | 26 | 33 |
| XLSX | 309 | 0 | 44 | 290 | 14 | 49 |

The current can't-check totals are 73 PDFs and 16 Office files higher, net, than that earlier
baseline; this replaces the earlier 88/15 comparison. 55 Office files need OCR before a decision.
Unreadable Office pictures ask; document failures follow the failures setting. PDFs whose image
pages the bounded scan extractor cannot represent remain can't-check, not successful OCR candidates.
[public-earlier-baseline.json](../evaluation/robustness/public-earlier-baseline.json) and
[public-pdf-fixes.json](../evaluation/robustness/public-pdf-fixes.json) retain the reproduced baseline
and current per-file results, hashes, code receipts and timings.

Total subprocess wall time was 202.05 s baseline and 145.67 s current. Summed per-file checking
time was 69.13 s and 51.56 s; the slowest checks were
470.28 ms and 1407.72 ms. These are separate laptop runs, not a controlled benchmark
or a Send-latency claim. OCR inference and the sentence model were not run.

### Real web documents and mutation fuzzing

[GovDocs1](https://digitalcorpora.org/corpora/file-corpora/files/) contains documents harvested
from public `.gov` web servers. The fixed sample is every PDF/DOCX/XLSX/PPTX/CSV/TXT/DOC/XLS/PPT/RTF
member in threads 0–3, supplemented by the first 20 lexicographic members of each DOCX/XLSX/PPTX/RTF
format archive. Duplicate member names are omitted. One 175,101,388-byte TXT member exceeds the
64 MiB download/extraction bound and is explicitly excluded. There are 2,176 inputs, 2,174 unique
SHA-256 payloads. Eight archive URLs, archive SHA-256s, member paths and per-file SHA-256s are pinned
in [govdocs-manifest.json](../evaluation/robustness/govdocs-manifest.json). Downloads need about
3.4 GB disk space (1.90 GB archives plus 1.42 GB selected members); nothing from a corpus is executed.

From the repository root, with Node 24 and Python 3 (standard library only), run this PowerShell
block. Existing downloads are verified against the committed hashes before use. Keep corpus data
outside the repository and do not open it in Office. Only hashes, counts and structural outcomes
are retained in results; extracted document text is never printed or saved.

```powershell
python tools/download-real-corpus.py ../dg-email-corpus-real
if ($LASTEXITCODE -ne 0) { throw 'Corpus download or hash verification failed.' }
node tools/with-heavy-lock.mjs -- node tools/corpus-check.mjs ../dg-email-corpus-real ../robustness-real-current.json --all-formats
if ($LASTEXITCODE -ne 0) { throw 'Corpus check failed; inspect the result JSON.' }
for ($start = 0; $start -lt 21000; $start += 1000) {
    $output = '../robustness-fuzz-current/fuzz-{0:D5}.json' -f $start
    node tools/with-heavy-lock.mjs -- node tools/fuzz-extract.mjs $output --seed 20261024 --start $start --count 1000 --seed-dir ../dg-email-corpus-real/files
    if ($LASTEXITCODE -ne 0) { throw "Fuzz chunk $start failed; inspect its JSON before resuming." }
}
node tools/summarize-fuzz.mjs ../robustness-fuzz-current ../robustness-fuzz-current-summary.json
if ($LASTEXITCODE -ne 0) { throw 'Fuzz aggregation failed.' }
```

The shared helper atomically acquires `../dg-email-heavy.lock`, checks at least 1.5 GiB free RAM,
waits at most 60 one-minute retries if another process owns the lock, and releases it after each
command. It stops an owned command tree at 29 minutes. A fuzz chunk is independently reproducible
with `--start` and `--count`; resume at the first unfinished chunk. For background launches on
Windows use `conhost.exe --headless` with redirected log handles. Do not remove another process's lock.
Use the same helper for `npm test`. In Windows PowerShell, locate npm's CLI beside `npm.cmd` and
invoke it with Node:

```powershell
$npmCli = Join-Path (Split-Path (Get-Command npm.cmd).Source -Parent) 'node_modules/npm/bin/npm-cli.js'
node tools/with-heavy-lock.mjs -- node $npmCli test
```

Fuzzing reuses the corpus runner's fresh child and attachment/OCR-selection path: 400 MiB V8 heap
per child, 2-second fuzz deadline (10 seconds for corpus inputs), sequential children. The seed
set is six generated documents, the six repository fixtures, and the first three files per target
extension no larger than 1 MiB in the pinned corpus. A seeded xorshift PRNG and absolute variant
index select bit flips, truncations, insertions/deletions, damaged ZIP directories/local headers,
inflated sizes, deep XML, huge sheet dimensions, malformed UTF-16 tails, and broken PDF xrefs,
object streams, content/page references, page trees and unfinished strings. Structured cases have
explicit rejection oracles (cases the parser must reject); ordinary mutations can still be valid,
so acceptance alone is not labeled a bug. A crash, timeout or
acceptance of a known incomplete/invalid structured case exits nonzero. Inputs and source bytes
are hashed in the JSON run records. The 400 MiB cap is a heap cap, not an operating-system RSS cap;
`peakRssKiB` is the child's measured high-water RSS, unavailable for a killed child. `ms` includes
file reading/imports/extraction and input hashing; `wallMs` also includes child startup. P95 is
nearest rank.

The source receipt lists the core files' SHA-256 hashes and their combined digest, so a run can be
tied to the code it checked. 24 October 2026 rerun after both later PDF fixes, on source receipt
`87848801e1a4737cac709d03169d6bc8737f15e6834be46b5405f92f9655eddc`, follows. Times are
native checking time; memory is each child process's high-water RSS.

| Format | Files | Read fully | Needs OCR | Can't-check | Crashes/timeouts | P95 / max ms | P95 / max MiB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| PDF | 957 | 346 | 2 | 609 | 0 | 481.36 / 3157.83 | 116.0 / 356.3 |
| DOCX | 21 | 15 | 1 | 5 | 0 | 84.67 / 131.41 | 77.8 / 85.5 |
| XLSX | 20 | 9 | 6 | 5 | 0 | 330.69 / 367.07 | 130.3 / 132.9 |
| PPTX | 20 | 0 | 4 | 16 | 0 | 307.14 / 444.04 | 92.7 / 100.4 |
| CSV | 78 | 74 | 0 | 4 | 0 | 43.77 / 114.19 | 63.3 / 81.0 |
| TXT | 317 | 270 | 0 | 47 | 0 | 47.52 / 635.93 | 64.2 / 134.1 |
| DOC | 311 | 0 | 0 | 311 | 0 | 108.39 / 371.85 | 76.6 / 118.9 |
| XLS | 233 | 0 | 0 | 233 | 0 | 153.01 / 946.36 | 82.6 / 200.0 |
| PPT | 194 | 0 | 0 | 194 | 0 | 355.22 / 1702.13 | 112.0 / 352.4 |
| RTF | 25 | 0 | 0 | 25 | 0 | 60.27 / 74.66 | 70.5 / 75.1 |

All 763 legacy DOC/XLS/PPT/RTF files reached the actual default gate as `held` / `ask`; none
silently cleared. Full reasons, per-file hashes, both timing series and source/corpus receipts are in
[real-pdf-fixes.json](../evaluation/robustness/real-pdf-fixes.json). PDF coverage remains narrow: 609 of 957
GovDocs PDFs were refused rather than partially passed. The small Office XML samples total 61 files.

The public regression corpus retained the same 1,586 hash-pinned files across these receipts:

| Format | First published read / OCR / can't-check | After robustness fixes | After both later PDF fixes |
| --- | ---: | ---: | ---: |
| PDF | 369 / 3 / 636 | 376 / 3 / 629 | 384 / 3 / 621 |
| DOCX | 90 / 15 / 25 | 90 / 15 / 25 | 90 / 15 / 25 |
| PPTX | 36 / 26 / 33 | 36 / 26 / 33 | 36 / 26 / 33 |
| XLSX | 291 / 14 / 48 | 290 / 14 / 49 | 290 / 14 / 49 |

Earlier robustness fixes made eleven linearized PDFs readable, refused four inconsistent PDF page
trees and refused one conflicting XLSX ZIP local header. The later PDF-fix transitions are described
below; the per-file ledger includes every outcome change and every refusal-reason change.

Eight pdf.js fixtures now read after the checksum fix: `ArabicCIDTrueType.pdf`, `bug1308536.pdf`,
`issue16224.pdf`, `issue5138.pdf`, `issue5238.pdf`, `issue5734.pdf`, `issue6132.pdf` and `rotation.pdf`.
In GovDocs, 182 formerly `bad_flate` PDFs now read after that fix, 34 formerly `unsupported_filter`
PDFs now read after LZW support, and `files/726/726454.pdf` moves from `bad_flate` to needing OCR.
All other changes remain refusals under different reasons, including unsupported predictors;
no non-PDF outcome changed. The [transition ledger](../evaluation/robustness/pdf-fixes-summary.json)
names every affected file and its before/after reason. No document contents are retained.

The earlier seeded run, on source receipt
`54c355394e68695ca17a08bae0c82e83170db1c16273362771c73074e42b633b`, covered 21,000 variants
from 42 seeds and 17 operations. It produced 20,942
unique payload hashes; repeated payloads came from ordinary random mutations. All 14,821 structured
rejection oracles were refused, with zero findings, crashes or timeouts. Summed chunk wall time was
29.72 minutes. This mutation run predates the two later PDF fixes and was not rerun for them.
An original-source probe of 170 variants produced 80 findings, ten for each of the
eight bug patterns subsequently fixed, demonstrating that the oracles detect those regressions.
[fuzz-before.json](../evaluation/robustness/fuzz-before.json) and
[fuzz-summary.json](../evaluation/robustness/fuzz-summary.json) retain the source, harness, seed and
variant digests plus operation totals and chunk receipt hashes. Raw chunk receipts are reproducible
and were kept outside the repository rather than committing 21 copies of per-variant rows.

The reproducible probes found and fixed: conflicting ZIP local headers and directory bounds
(`f76ccef2`); missing PDF content/page references, malformed object streams and unfinished strings
(`39abd12a`); Root selection for linearized PDFs (`3647ab2d`); incomplete BOM-marked UTF-16 LE/BE
TXT/CSV, including unpaired surrogates (`a48c9da5`, the only parser change outside `core/extract/`);
and incomplete or inconsistent PDF page trees (`9946600a`). The source-pinning defect in the fuzz
runner itself was fixed and regression-tested before the before/after run (`7d7500d8`).

This is robustness and coverage evidence, not disclosure accuracy, independently verified text
completeness, OCR accuracy, native Outlook qualification or a controlled performance benchmark.
GovDocs1 is an old government-web corpus with extension-based sampling and small Office XML samples;
its format labels can be wrong. OCR candidates were selected but no OCR inference ran. A native
`ok` means the bounded parser reported complete coverage under its contract, not that every visible
glyph was compared with a renderer. Generic random mutations have no independent completeness
oracle. The 36-document everyday check and held-out email evaluations were not rerun as part of
these parser checks.

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
[evaluation/ocr-calibration/README.md](../evaluation/ocr-calibration/README.md).

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
