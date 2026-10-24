# Runtime v2 evidence and handoff

22 October 2026. Lane/runtime. All examples and tests are synthetic. No Outlook tenant deployment,
live Send or publication was performed. The September v1 evidence remains in RUNTIME-STATUS.md.

## Ask-first lane: current contract (23 October 2026)

This section supersedes the earlier Warn/Enforce copy and live-test expectations below. Earlier
verification receipts are historical evidence for their stated commits, not acceptance of this lane.

Admin choices are findings=ask|hold and failures=ask|hold, both default ask. Both Ask generates
PromptUser for both Send events. Hold/Ask generates SoftBlock; either failures=Hold pair generates
Block. A running Mailbox 1.14+ handler
uses sendModeOverride:'promptUser' for each effective ask outcome. Mixed results ask only when every
applicable part asks. Exposed-list and unreadable-picture prompt exceptions always ask where
supported. Legacy mode=warn/enforce means ask/ask or hold/hold; explicit new values refine it.

When SoftBlock or Block is installed, clients before Mailbox 1.14 hold ask outcomes too. On load
failure, failures=Ask leaves Outlook's Send Anyway / Try Later choice under PromptUser or SoftBlock;
failures=Hold installs Block and holds. Older classic runtimes that cannot read their manifest URL,
and malformed/duplicate configuration, use only the mailbox domain and neutral conditional dialog
instructions; the installed mode still controls actual buttons. No roamingSettings fallback remains.
Microsoft documents [SoftBlock and unavailable-add-in choices](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/onmessagesend-onappointmentsend-events)
and [event.completed sendModeOverride from 1.14](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/smart-alerts-onmessagesend-walkthrough#override-the-send-mode-option-at-runtime-optional)
without a documented restriction by manifest mode. This is documentation support, not live proof.

The implementation follows Microsoft's
[SmartAlertsEventCompletedOptions reference](https://learn.microsoft.com/en-us/javascript/api/outlook/office.smartalertseventcompletedoptions?view=outlook-js-preview).
Review is cancelLabel (6 chars) plus commandId dgOpenPane/dgOpenMeetingPane on 1.14+ findings.
Modern clients use a separate Take Action button: web, new Windows, classic Windows 2412+ and
Mac 16.105+ (Mac enhancement in preview). Don't Send remains Outlook's own cancellation button.
Earlier classic/Mac versions use the customized button in Don't Send's position. No custom command
is sent before 1.14; a ribbon sentence is the fallback. Failure-only dialogs use the native buttons.

Mailbox 1.15 receives errorMessageMarkdown and the same information in plain errorMessage. Bold
headlines, CR-terminated bullet items and double-newline separators follow Microsoft's supported
subset. Both strings stay within 500 UTF-16 code units, including many findings/long names. Dialogs
never use sentence text or matched secrets; only category phrases, places, file names and recipients.
If customization is rejected, plain retry preserves an ask override. If the override itself is
rejected, a final basic completion uses installed-mode copy without promising an unavailable action.

The pane shows Ask/hold instructions and failure reasons. Check again prepares OCR, reads fresh
content with a 15-second OCR budget and runs core checkDraft under the pane's configuration. It
does not store release authorization. Its checked-draft fingerprint plus the pane's text/envelope/file
snapshot invalidate a pass or failure after edits, including changes during Check again. Failed
re-reads also retire a pass. Unbound Send phase reasons say "The last Send" instead of claiming the
current draft is held. Size failures hide Check again and require shortening or splitting. Every
Send checks independently and re-reads a Clear fingerprint.

Setup explains Ask/Hold in plain words, warns explicitly about Hold/Ask's confirm-and-send failure
path, names the two prompt exceptions, and puts SendMode/API details in a collapsed details element.
SPEC §7 records size actions, recipient bullet shapes, unknown-reason and settings-unknown copy.

Live verification required for this lane:

1. On web, new Windows, classic 2412+ and Mac 16.105+, inspect the three-button findings dialog:
   Send Anyway only for ask, Don't Send cancels, Review is the Take Action label, and Review opens
   the correct email or organizer pane. Check older classic/Mac's different button placement.
2. Verify markdown headline, CR bullet rendering, spacing, 500-character boundaries, plain fallback
   on 1.14/pre-1.14 and Mac preview availability. No secret values may appear in either dialog.
3. Install each of the four settings combinations. Test finding-only, failure-only, mixed and both
   prompt exceptions, in email and organizer invitation/update. Verify ask override on 1.14+ and
   hold on pre-1.14 SoftBlock/Block installations. Verify the promptUser override from a SoftBlock
   manifest on one live client. Test rejected customization if the client permits it.
4. Test runtime unavailable/slow, draft-read failure, ZIP, attached email, oversize, OCR pending
   then ready, changed bytes and changed draft. Cancel then Send must re-check. In all-ask mode
   and Hold/Ask inspect Outlook's unavailable-add-in Send Anyway / Try Later; failures=Hold must
   follow Block. Check too-large actions in Ask/Hold for both whole items and individual files.
5. Open the pane after a failure; confirm its reason and Check again, OCR completion, local pass
   notice, then edit subject/body/files/addresses/location. The pass must disappear and Check again
   return. Reopen after an unbound failure and confirm its "last Send" label. Press Send to verify
   the changed item is checked independently. Test malformed settings and unreadable URLs too.
6. Repeat the earlier activation, room/resource, cache sharing, unavailable-host and cold/warm timing
   checklists. Local VMs/browser adapters cannot prove host buttons, sandbox support or latency.

Weakest point: actual Outlook dialog and override behavior, especially Mac preview and older
classic clients. No native-client Send or tenant install is performed by this lane.

Round 2 local receipt (lane/ask-first2, 22 October 2026): Node v24.20.0,
`npm ci --ignore-scripts` completed with zero reported vulnerabilities; `npm test` passed
**291 tests, zero failed/skipped/cancelled**. The built-runtime matrix still covers all four
settings pairs, messages/meetings and 1.12/1.14/1.15. New regressions cover SoftBlock generation and
setup mapping; malformed/duplicate runtime configuration with inside-only sends and neutral outside
dialogs; size actions for whole drafts/files in Ask/Hold; recipient bullets and plain "And N more.";
unknown failure reasons; pane pass/failure invalidation after text, file identity, addresses and
meeting-location edits, edits during a check, unreadable re-reads, and superseding Send phases.

Chrome verified the built setup's Hold/Ask warning, both prompt exceptions, collapsed technical
details, SoftBlock mapping, and the change to Block/hidden warning with failures=Hold. Desktop and
narrow screenshots were inspected (the narrow viewport measured 307 CSS pixels at the existing
browser zoom, with no horizontal overflow). The fictional failure pane showed "The local check
didn't finish." Page identity, meaningful content, no error overlay and empty warning/error logs
were checked. T3 navigation worked, but two snapshots returned "Preview automation snapshot timed
out after 15000ms." Chrome supplied screenshot evidence; its full-page narrow capture timed out,
then viewport capture succeeded. These are local synthetic previews, not native Outlook proof.
No held-out evaluation data was read. The earlier round 1 receipt follows for provenance.

Local ask-first receipt: Node 24, npm test **275 passed, zero failed/skipped/cancelled**;
npm run build passes both generated manifest checks. The ES2016 VM matrix includes email and
meeting findings/failures/mixed/prompt-only at 1.12/1.14/1.15, both prompt exceptions, actual
timeout/read failure, refused customization/override, 500-character copy, config aliases, setup
output for every settings pair, and the built pane's Check again from ZIP failure through oversize
to Clear. A changed draft after the pane pass still triggers a new Send finding.

Chrome inspected the built setup/pane at desktop and narrow width. Changing failures to Hold
updated its explanation to Block; the ask pane showed the send-anyway notice, Show me expanded
context, and the failure preview showed its reason/retry control. A CSS visibility bug found in
that review was repaired: Check again is hidden for findings-only results. Page identity, meaningful
content, no error overlay and empty warning/error logs were checked. These are synthetic previews;
the real retry action is exercised by the built-pane VM, not a live mailbox. T3 preview navigation
worked but screenshots twice returned "Preview automation snapshot timed out after 15000ms."
The Chrome browser-control surface supplied screenshots. No held-out evaluation data was read.

## What Microsoft documentation verifies

| Claim | Microsoft source |
| --- | --- |
| Classic Outlook loads the JavaScript override; web, new Windows and Mac use the HTML runtime. Classic event handlers need one bundle. Initialization cannot depend on onReady callbacks there. | [Event-runtime troubleshooting](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/troubleshoot-event-based-and-spam-reporting-add-ins) |
| Classic clients before 2403 require ES2016; Microsoft also advises avoiding conditional expressions on those builds. | [JavaScript requirements](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/troubleshoot-event-based-and-spam-reporting-add-ins) |
| Office.context.urls.javascriptRuntimeUrl exposes the script override URL in Mailbox 1.14. Its example reads a query parameter. | [Urls API](https://learn.microsoft.com/en-us/javascript/api/office/office.urls?view=common-js) |
| Roaming settings belong to an add-in/user mailbox, require saveAsync for persistence, and need runtime/pane reopening to reload saved changes. Available since Mailbox 1.1. | [RoamingSettings API](https://learn.microsoft.com/en-us/javascript/api/outlook/office.roamingsettings?view=outlook-js-preview) |
| Mailbox 1.14 adds runtime send-mode overrides, including promptUser. PromptUser, SoftBlock and Block determine unavailable-add-in behavior. | [Smart Alerts](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/onmessagesend-onappointmentsend-events), [SendModeOverride](https://learn.microsoft.com/en-us/javascript/api/outlook/office.mailboxenums.sendmodeoverride?view=outlook-js-preview) |
| OnMessageSend starts with Mailbox 1.12; minimum classic 2206 and Mac 16.65 versions are documented. Review customization needs later requirement sets. | [Smart Alerts support](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/onmessagesend-onappointmentsend-events) |
| Session data is limited to 50,000 characters through Mailbox 1.15, with a larger allowance in 1.16. | [Outlook API limits](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/limits-for-activation-and-javascript-api-for-outlook-add-ins) |

The implementation uses script/page query settings when accessible, otherwise just the mailbox's
own domain (the roaming-settings fallback was removed on 22 October: users could widen "inside"). The manifest controls PromptUser/SoftBlock/Block on every supported client;
saved settings do not change its send mode. Domain parameters contain organization configuration,
never outgoing addresses or text. Settings reload and deployment behavior on a particular tenant are
still assumptions until tested there.

## Local verification

Historical runtime-lane run before detector/OCR integration: Node v24.20.0, npm test,
94 tests passed, 0 failed/skipped/cancelled. Current OCR evidence is recorded below.
The pretest build produced dist and passed both development/release manifest checks.
No online validation was run.

- npm test builds the static site, then runs the suite sequentially on Node 24.
- The generated runtime.js parses as an ES2016 script and executes in node:vm without require,
  Buffer, DOM, fetch, encoding or crypto globals. Its fake RegExp constructor rejects modern flags,
  named-group syntax and Unicode-property syntax. No handler initialization is deferred to onReady.
- VM tests drive fake Office APIs through held, clear, changed-draft, malformed-result, timeout,
  rejected customization and prompt-only completion paths, including PDF and PPTX attachments.
- The portable inflater is compared to Node zlib for stored/fixed/dynamic output, long matches and
  random/seeded bytes. SHA-256 is compared to Node at padding boundaries, on Unicode and large input.
  A 10 MiB base64 regression check covers a stack failure found and repaired during implementation.
- Generated Warn/Enforce manifests for localhost and nested HTTPS subpaths pass offline XML,
  resource, URL and event checks. The setup bundle is driven in a VM to inspect the actual Blob,
  MIME type, filename and configured XML; invalid domains do not produce a download.
- Source/distribution checks reject Node imports in core and content/telemetry transport in runtime.
- The static HTTPS dev server was run using the existing certificate. It served the Pages subpath.
  No private key was printed, copied, inspected or committed.
- Browser setup QA: intended page/title/body, Warn-to-Enforce copy update, extra-domain input,
  nested asset paths, desktop and a narrow viewport, and no tab console errors/warnings.
  The pane's fictional held preview rendered its two sentence cards and the local-only footer.
  A browser-driven fake Office item also rendered a source-recipient card with its address and no
  buttons, through the actual built pane. This is synthetic adapter evidence, not live Outlook.
  T3 snapshot timed out twice; Chrome extension browser inspection supplied the visual evidence.
  The download was inspected in the VM rather than saved to an unrelated Downloads folder.

The VM and browser adapter evidence proves local code paths. It does not prove native Outlook
activation, administration, dialog behavior, Office callback timing or client performance.

## Integration seams

- core/rules.mjs is unchanged. copy.mjs now also supplies OCR pending/failure/runtime explanations.
- Integration (22 Oct): checkDraft runs core/recipient-checks.mjs itself; the injection seam
  (recipientFindings option, DisclosureGateRecipientScreen global) was removed.
- source "recipient" findings retain their address/sentence, category/subkind, marks, found_by and
  optional severity. The presenter supplies a default "stop", and never marks recipients removable.
- The build derives legacy regexes from RULES without touching rules.mjs. It removes named groups
  and d flags while using suffix captures for exact highlight offsets. A constructor change produces
  a build error instead of silently shipping incompatible code.
- OCR now publishes ready/pending/failed/unsupported entries under dg-ocr-v1. Exact id/name/size
  plus a fresh byte SHA-256 are required for ready entries; only image files or PDFs returning
  no_text may consume them. Removal/replacement and explicit Added events invalidate entries.
- Result storage uses a 64-character digest and a compact recheck marker for large results. The
  latter is reconstructed locally only after matching the last Send fingerprint. This keeps Review
  usable within the older session-data allowance without content transport.

## Live evidence: Outlook on the web, 24 October 2026

Client: Outlook on the web in Chrome (Playwright), the private test tenant, outside
recipient a personal Gmail. All content synthetic.

**How v2 ran before Microsoft served the v2 manifest.** The v2 dev manifest was uploaded on 23 October;
by 00:05 UTC on the 24th Outlook still served v1.1 (`OnMessageSend` only, `SendMode="Block"`, runtime URL
with no settings). v1.1 loads its runtime from the same dev server, so a local test shim (not shipped)
redirected `commands.html` to the v2 settings (`dg=2&findings=ask&failures=ask&domains=&model=on`) and,
standing in for v2's `OnMessageCompose`, started the model preload when the runtime page loaded. Every
Send therefore ran the current v2 code in Outlook's real runtime frame. What this cannot show: v2's
compose and attachment-changed events, meetings (v1.1 has no `OnAppointmentSend`), and the PromptUser
unavailable fallback (v1.1 is Block).

| Runbook # | Result |
|---|---|
| 1 inside only, password | Sent, 0.7 s |
| 2 outside, clean | Sent, 3.1 s |
| 3 outside, password | Dialog: headline, bullet, Send anyway / Review / Don't send |
| 4 Review | Pane: card on the sentence, Show me, Remove deleted only that line (after fixes 1–2 below) |
| 5 Send anyway | Sent |
| 6 handover-notes.docx | Dialog names the file; pane "In handover-notes.docx" |
| 7 cost-review.xlsx | "your margin" in the file, 1.2 s |
| 8 deposit-form.pdf | Bank account number in the file, 0.9 s (after fix 3) |
| 9 site-photos.zip | Failure dialog, Send anyway / Don't send |
| 10 deploy-settings.png attached | API key read by on-device OCR on the first Send, 4.5 s |
| 11 deploy-settings.png pasted inline | API key found, 3.1 s |
| 12 site-photo.jpg attached | Picture prompt with Send anyway |
| 13 site-photo.jpg pasted inline | Sent (ignored) |
| 14 clean-agenda.docx | Sent |
| 15 one-letter lookalike of the tenant's onmicrosoft.com name | Lookalike dialog (after fix 4) |
| 16 8 outside addresses, 3 domains | "8 outside addresses" dialog |
| 17 type during the check | The typed password was caught; nothing sent unchecked (the edit landed before the read, so the mid-check race itself was not exercised) |
| 18 dev server stopped | "taking longer", then "Disclosure Gate is unavailable… Try later" (v1.1 Block; PromptUser still to test on v2) |
| 19 Schedule send | Dialog before scheduling |
| 20–22 model sentences | personal / economics / remark, found by the model, 1.2 s Send-to-dialog; #20 on the chemo line only, not "Thanks," |
| 23 flu jabs | Sent; model ran (`used`) and stayed quiet |
| 24 first Send after reloading Outlook | Model loaded from cache in 1.3–1.4 s, check 1.1–1.2 s, finding shown; repeated in a new compose. One earlier first Send, before the model files were cached, went out on rules only |
| findings=hold | #3: Review / Don't send only |
| failures=hold | #9: Don't send only |
| model=off | #20 sent (rules only) |
| Pane | Remove, then "This draft changed since the check" + Check again, then Clear, then edit, then "changed" again (after fix 5) |

Seen live for the first time: the finding dialog's Send anyway (the `promptUser` override) works even
under a `SendMode="Block"` manifest in Outlook on the web.

**Bugs found live and fixed (branch `fix/owa-html-body-lines`):**

1. Outlook on the web's `body.getAsync('text')` runs `<div>` lines together ("Hi Sam,The portal password
   is Harbor-2026!See you Tuesday."). One sentence per email: wrong highlights, wrong model context, and
   Remove could not find the sentence. HTML bodies are now read as HTML and checked as visible text.
2. The pane used its own Text read to decide which cards were still live, so it then showed none. Both
   now share `readBody`.
3. Outlook's runtime frame replaces `String.prototype.startsWith/endsWith` with versions that ignore the
   position argument. The PDF reader never found its streams (every text PDF was "couldn't be read") and
   the HTML reader never skipped comments. Core code now compares slices; the runtime tests run under the
   same replacements; a test rejects positional `startsWith`/`endsWith`.
4. `*.onmicrosoft.com` tenant names counted as sister subdomains, so a lookalike tenant was never flagged.
   `onmicrosoft.com` is now a public suffix.
5. Removing the last flagged sentence left the pane on Held with an empty list and no Check again.

Timing: the model's 1.5 s share of Send left about 0.3 s spare on this laptop in a fresh runtime (load
1.3 s from cache plus classify). A slower machine will more often fall back to rules only, which the
design allows but which lowers what the model catches in practice.

## Live Outlook acceptance still needed

1. Upload the dev manifest as an update to the existing test installation. Confirm v2 actually
   reaches each tested client and that dgOpenPane opens the real pane.
2. Web/new Windows/Mac: check page settings and the preserved Office.onReady handshake.
3. Classic Windows: test one pre-2403 client (ideally the stated 2206 minimum) and one Mailbox 1.14+
   client. Confirm script override loading, query recovery, the older roaming fallback after reopening,
   and that the ES2016 adapter behaves in the actual engine.
4. Synthetic sends under all four settings combinations: internal-only, clean external, sensitive external, unreadable file,
   PPTX notes, inline image, changed draft, and unavailable/slow runtime.
5. After detectors integration, verify exposed-list-only promptUser on 1.14+, mixed outcomes following the two settings, and recipient cards without Remove. Pre-1.14 Block cannot offer this override.
6. Confirm result persistence before Review, including large-result reconstruction and a new compose
   item; clear results never release a changed fingerprint.
7. Measure Send-to-dialog time, not just core time. The 4.5-second guard starts at handler invocation.
   Host startup and throttled timers are outside that measurement. Synchronous extraction can also
   delay a timer callback; a wall-clock recheck prevents a late Clear, but VM timings do not establish
   a hard five-second host response or the spec's two-second typical Send target.
8. Repeat unavailable-static-host tests. September v1 observed a silently browser-denied runtime
   could send despite Block, whereas a refused connection held. This is unresolved live evidence,
   not a behavior this static migration can guarantee.

The weakest point is native classic Outlook acceptance, especially the older runtime and per-user
configuration fallback. Outlook on the web has v2 Send evidence (above); new Outlook, classic and Mac
have none yet, and v2's own manifest (compose and attachment events, meetings, PromptUser) is untested live.

## OCR lane: documented support versus implementation inference

Microsoft's [event activation table](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/event-based-activation)
documents OnMessageAttachmentsChanged in Mailbox 1.11 for web, new/classic Windows and the new Mac
UI. OnMessageCompose, including opening saved drafts, is 1.12. Both are registered alongside Send;
the manifest's existing 1.12 minimum is unchanged. The event guidance permits approximately 300
seconds but says code after event.completed is not guaranteed to run. The pre-read handler waits
for work/persistence before completing, with its own 120-second guard, and bounds each OCR job.

Microsoft's [runtime matrix](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/runtimes)
documents browser runtimes for web/new Outlook/Mac events and JavaScript-only for classic events.
Its [event troubleshooting guidance](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/troubleshoot-event-based-and-spam-reporting-add-ins)
requires one classic event bundle, describes the HTML versus JavaScript override, and preserves
the pre-2403 ES2016 restrictions. These pages do not explicitly guarantee Worker or WebAssembly
availability in the event sandbox. Browser OCR capability is therefore an **inference**, checked
with document/Worker/WebAssembly/BigInt feature detection and actual worker initialization. Classic
events are treated as unsupported; their bundle never imports or parses Tesseract. A task pane is
a browser runtime and can pre-read, including on classic, subject to those same capability checks.

The [attachment-details reference](https://learn.microsoft.com/en-us/javascript/api/outlook/office.attachmentdetailscompose?view=outlook-js-preview)
documents temporary inline IDs on web/new Windows and index IDs on classic/Mac. This is why an
Added event invalidates even a matching tuple, jobs re-read current metadata before publication,
and Send re-reads bytes. Session-data sharing is subject to Mailbox 1.15 support and the older
50,000-character allowance ([limits](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/limits-for-activation-and-javascript-api-for-outlook-add-ins)).
Without it, only the current runtime's memory cache is available. An old pending lease is retried;
a new runtime cannot assume an earlier worker survived. The pane/event runtimes do not share JS
globals. Session-data writes are not atomic locks: simultaneous runtimes can duplicate work in a
race. Generation tokens and byte hashes prevent that race from granting an unchecked clearance.

[Tesseract's local-installation guide](https://github.com/naptha/tesseract.js/blob/master/docs/local-installation.md)
explains its default CDN worker/core/language loading. This build supplies all paths explicitly,
rejects absolute/off-origin substitutions, uses workerBlobURL false and cacheMethod none, and
copies the worker, non-SIMD LSTM JS/WASM, English traineddata and licence notices into dist/ocr.
The worker terminates after the serial queue drains, including initialization-failure cleanup.
No cloud OCR, content transport, persistent OCR logs or traineddata IndexedDB cache is added.

## OCR verification and remaining acceptance

The synthetic calibration is reproducible with npm run calibrate:ocr. Its source, fitting method,
102 measured records and limitations are in [the calibration report](../evaluation/ocr-calibration/README.md).
Thresholds are page confidence 94 / every word 87, exact two-segmentation agreement; no-text
clearance also requires two empty reads, zero small components and a minimum side of 32 pixels.
Only inline file images at most 8 by 8 pixels and 256 bytes skip recognition. All ordinary inline
documents, archives and attached emails now take their normal extract-or-hold path.

Local verification: Node v24.20.0, npm test passes 141 tests with zero failures/skips/cancellations,
including the ES2016 VM bundle. npm run build also succeeds independently. New VM cases
cover ready/pending/failed/unsupported OCR, pending retry copy, exactly-once completion, changed
metadata and changed bytes before release, forged OCR for DOCX/item/ZIP, and malformed/text-layer
PDFs that must not use cached OCR. Scan extraction tests cover DCT and raw Flate images plus
unsupported/missing pages and masks. The portable byte hash is compared with Node crypto.

The built engine was exercised in Chrome with a local synthetic Office adapter: attachment-added
read of a 30 px economics screenshot, cached Send hold, gradient empty read and Clear after a fresh
hash re-read. The local server observed only GETs for our runtime/engine/worker/core/WASM/traineddata
files during OCR. The built pane showed Reading images on this device and two non-removable
In site-note.png findings. It was inspected at desktop and pane width with no console errors/warnings.
T3 preview navigation/evaluation worked but snapshot timed out twice (raw error: Preview automation
snapshot timed out after 15000ms); Chrome extension browser inspection supplied the rendered check.
The test harness did not call real Outlook, read real email or send anything. Final build restores
the product HTML after temporary synthetic test controls.

Uncompressed distribution size: a fresh f89ee17b baseline built in an isolated `.qa` directory
is 827,631 bytes; this lane is 6,968,027 bytes, an increase of **6,140,396 bytes (5.856 MiB)**.
`dist/ocr` contributes **6,086,053 bytes (5.804 MiB)** including engine, worker, WASM, English model
and licences. The remaining 54,343 bytes are runtime/pane/setup/manifest changes. These are file
sizes, not network-compressed transfers or runtime memory measurements.

Live Outlook verification still required:

1. Worker/WASM/BigInt availability, CSP, same-origin model loading and failure copy in web/new
   Windows/Mac event runtimes and each supported pane webview. No Microsoft sandbox guarantee was found.
2. AttachmentChanged timing during upload, temporary-ID replacement, inline images, deletion,
   replacement with identical metadata, draft reopen and concurrent pane/event activation.
3. SessionData sharing and cache-size failures on actual client versions, especially classic
   before Mailbox 1.15. A capable pane without cross-runtime storage cannot clear classic events.
4. Cold/warm Send-to-decision time including two byte reads, Office callbacks, timer throttling
   and a pending job near the 4.5-second guard. The spec's two-second typical target is unmeasured.
5. Memory and worker cleanup on this 16 GB machine, large/12 MP images, multi-image scans and
   simultaneous compose windows. One worker is enforced per runtime, not an atomic cross-process lock.
6. Representative synthetic site photos and broader text styles/languages. The fitted set accepted
   only 14/72 screenshots and 8/18 no-text images; all six generated scenes still hold. English OCR
   confidence is not a language detector and cannot establish correctness for arbitrary images.

The weakest OCR point is generalization of the empty-image classifier and the substantial remaining
photo/low-quality over-holds. Native event-runtime support, memory and timing remain unverified.

## Meetings lane: Microsoft documentation versus implementation decisions

22 October 2026. `lane/meetings`, based on main b64139ee. All meeting fixtures are synthetic.

Microsoft documents the following:

| Contract | Microsoft Learn source |
| --- | --- |
| Both Send events start at Mailbox 1.12. Exchange Online clients: modern web, new Windows, classic Windows 2206 / build 15330.20196+, Mac 16.65 / build 22082700+. Mobile is unsupported. | [Smart Alerts support](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/onmessagesend-onappointmentsend-events#supported-clients-and-platforms) |
| Only one of each Send event may be declared per add-in. On web/new Windows, appointment Send requires a separate window; embedded meeting forms and forwards don't raise it. | [Smart Alerts limitations](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/onmessagesend-onappointmentsend-events#limitations) |
| Multiple LaunchEvents reference one runtime SourceLocation. Each send event has its own SendMode attribute; both may use the same mode. | [LaunchEvent](https://learn.microsoft.com/en-us/javascript/api/manifest/launchevent), [ExtensionPoint](https://learn.microsoft.com/en-us/javascript/api/manifest/extensionpoint#launchevent) |
| Organizer ribbon commands belong on AppointmentOrganizerCommandSurface. Dialog commandId must match a manifest Control id. Review customization and send-mode overrides require Mailbox 1.14. | [Organizer surface](https://learn.microsoft.com/en-us/javascript/api/manifest/extensionpoint#appointmentorganizercommandsurface), [Smart Alerts walkthrough](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/smart-alerts-onmessagesend-walkthrough#customize-a-dialog-button-to-open-the-task-pane-or-run-a-function-optional) |
| AppointmentCompose exposes requiredAttendees/optionalAttendees (Recipients), subject, body, location (Mailbox 1.1), getAttachmentsAsync/getAttachmentContentAsync (1.8) and sessionData (1.11). It has no resources getter; AppointmentForm.resources is an input for creating a form, not a compose reader. | [AppointmentCompose](https://learn.microsoft.com/en-us/javascript/api/outlook/office.appointmentcompose?view=outlook-js-preview), [AppointmentForm](https://learn.microsoft.com/en-us/javascript/api/outlook/office.appointmentform?view=outlook-js-preview), [Compose attachments](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/add-and-remove-attachments-to-an-item-in-a-compose-form#get-attachments) |
| RecipientType includes distributionList, user, externalUser and other. Its type doesn't establish whether an address is inside; even a saved internal contact can be ExternalUser. Recipients.getAsync has client-specific return caps (500 or 1,000 on Windows; new Mac has no cap). | [RecipientType](https://learn.microsoft.com/en-us/javascript/api/outlook/office.mailboxenums.recipienttype?view=outlook-js-preview), [Recipients.getAsync](https://learn.microsoft.com/en-us/javascript/api/outlook/office.recipients?view=outlook-js-preview#outlook-office-recipients-getasync-member(1)) |
| EnhancedLocation is Mailbox 1.8. Room locations expose an SMTP address; custom locations don't. Personal contact groups used as locations aren't returned. | [LocationDetails](https://learn.microsoft.com/en-us/javascript/api/outlook/office.locationdetails?view=outlook-js-preview), [Location guide](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/get-or-set-the-location-of-an-appointment) |
| OnNewAppointmentOrganizer (1.10) runs for new appointments, not edits. OnAppointmentAttachmentsChanged (1.11) supports attachment pre-reading on web/new/classic Windows and new Mac UI. | [Event activation table](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/event-based-activation#outlook-events) |

Implementation decisions and inferences, rather than Microsoft guarantees:

- Both send events use sibling associations to the same function and the same HTML/classic runtime
  and SendMode. Unique commands dgOpenPane and dgOpenMeetingPane avoid duplicate Control ids and
  target the appropriate compose surface. The offline validator enforces both event registrations,
  matching modes/runtime, distinct commands and the classic JavaScript override. It is not a full
  Microsoft schema/tenant validator.
- Required attendees map to To, optional attendees to Cc: both are visible recipients with equal
  disclosure risk. No Bcc is invented. Exposed-list findings still prompt, but meeting copy asks the
  organizer to check the attendee list instead of suggesting Bcc.
- Rooms returned by enhancedLocation are conservatively added to To, deduplicated by SMTP address
  against either attendee list. An existing distribution-list classification is preserved. A room
  without an address counts as unknown; unavailable room enumeration fails closed. No resource is
  presumed inside. There is no claim that Office exposes every resource/forward recipient.
- Attendee and enhanced-location metadata are read before classifying reach. Inside-only items skip
  subject, body, the legacy location text and attachment reads. For others, location plus enhanced
  names absent from that string are screened under their own source; location cards have Show me,
  but edits are manual. The fingerprint includes item type, attendees, location text and enhanced
  location metadata. A clear result requires a fresh, unchanged read, including OCR byte hashes.
- Attachment extraction, OCR preparation/cache and prompt-only overrides use the existing paths.
  The reader and pane read batches retain the three-call limit. Pre-reading runs on new appointment
  creation and attachment changes, with Send/pane fallback for existing appointment updates.
- Product meeting coverage is organizer invitations and updates only. Forwards and attendee
  responses are excluded on every client; Microsoft's explicit separate-window/forward limitation
  above is specific to web/new Windows. Update/series activation and room completeness still need
  native-client evidence. Local fake Office APIs do not establish those behaviors.

Meeting live acceptance to add to the existing runtime/OCR checklist:

1. Install the updated manifest in a test tenant. On web, new/classic Windows and new Mac, send a
   new organizer invitation and an existing appointment update; test a recurring series and one
   occurrence update separately. Use synthetic attendees and content only.
2. On web/new Windows compare separate-window Send with embedded-form Send and calendar forwards.
   Confirm the documented non-activation cases; do not describe them as protected by Enforce.
   Attendee responses/forwards on other clients remain outside product coverage.
3. Inspect what requiredAttendees, optionalAttendees and enhancedLocation actually return for an
   internal room, external room/resource, equipment and distribution list. Check duplicates, missing
   SMTP addresses, unresolved entries, personal contact group locations and host return caps.
4. Inside-only attendees/rooms: confirm no subject/body/location-text/files are read. Outside optional
   attendee or outside room alone: confirm body, subject, location gate code and attachments hold.
5. Review opens dgOpenMeetingPane on 1.14+; older clients show the organizer ribbon fallback. Confirm
   sessionData sharing, location cards/manual editing, sentence removal in subject/body, and stale
   results after attendee, room, location, attachment and OCR-byte changes.
6. New appointment / attachment change / update with pre-existing pictures: verify OCR pre-reading,
   cache reuse, English text, unsupported-classic behavior and pending handling. Confirm picture-only
   and exposed-list-only promptUser on 1.14+, with mixed outcomes following the two settings.
7. Measure native Send-to-decision time and memory. Check unavailable host, callback failures and
   completion customization rejection under all four settings combinations; local timings don't prove Outlook timing.

Local meeting verification: Node v24.20.0, `npm test`: **168 passed, zero failed/skipped/cancelled**,
including 16 appointment VM tests, both-event manifest checks, copy lint and the classic ES2016
parse/load and regex-equivalence checks. `npm ci --ignore-scripts` completed with zero reported
dependency vulnerabilities. No held-out evaluation data was read.

The actual built pane was also checked with a local synthetic appointment adapter in Chrome at
desktop and 380-pixel pane width. It rendered meeting-specific idle/footer copy, outside/inside
attendees, location and body cards. Show me expanded the location context; only the body card
offered sentence removal. Explicit removal plus a manual location edit made the next fake Send
return allowEvent:true and the pane show Clear. Page identity, nonblank rendering, absence of an
error overlay, screenshots and console health were checked; console warnings/errors were empty.
This is synthetic browser evidence, not an Outlook Send. T3 preview evaluation supplied the first
handler result, but screenshots timed out twice with `Preview automation snapshot timed out after
15000ms.`; the Chrome extension supplied the visual check. Temporary QA controls aren't distributed.

The weakest meeting point is native Outlook event activation and room/resource representation,
especially organizer updates, series updates and older classic clients. No meeting has been sent
through a live tenant in this lane, and no publication or push has occurred.
