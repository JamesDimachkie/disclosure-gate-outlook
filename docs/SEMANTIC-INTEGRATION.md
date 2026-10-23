# Optional on-device sentence model

Updated 23 October 2026 on `lane/model-setting`, starting from `5115e72a` (including calibrated
model integration `565286c5` and semantic integration `c9dd0d59`). Rules remain mandatory. An absent,
unsupported, cold, corrupt, busy, over-limit, failed or timed-out model returns rules only; it
never creates a can't-check outcome. IT's `model=off` skips both preload and classification.

## Review changes

| Finding | Resolution |
| --- | --- |
| 1. Budget clamp | Explicit evaluator budgets pass through; gate default and Send handler retain 1,500 ms. Regression tested. |
| 2. Coverage claims | Model README, security notes, model notice, landing copy and this report name only personal/economics/remarks; access/negotiation stay rules-only. |
| 3. Text-only claims | Remaining stale claim replaced with the shipped `context_text` contract. |
| 4. Old hash | This report now points to `model/PROVENANCE.json`, without a duplicated hash. |
| 5. Measurement placeholders | Removed; model README and security notes point to README's measured results. |
| 6. Stale caches | Successful preload prunes other semantic revisions; failure preserves them, unrelated caches survive. Tested. |
| 7. Tokenizer template | Guard imports the inference formatter; exact-token-boundary parity is tested in both input modes. |
| 8. ORT licence provenance | Notice records `v1.30.0` upstream URLs; fetched text matches modulo CRLF. |
| 9. Mixed clocks | Gate semantic deadline now uses injected `now()`; tested with non-wall-clock values and spent rule time. |

## Coverage and input contract

The shipped model adds **personal details, internal costs/economics and remarks only**. Access and
negotiation stay **rules-only**, disabled in the model by thresholds of 1.01 in `model/out/labels.json`.
Measured accuracy is in [README: How well it works](../README.md#how-well-it-works); no accuracy
evaluation was rerun for this timing/fix lane.

`checkDraft(draft, { semantic })` supplies the existing sentence splitter's units. The shipped
metadata selects `context_text`: previous sentence plus current sentence, formatted by
`model/tokenize.mjs:formatInput`. Context resets at subject, body, meeting location and attachment
boundaries. Quoted history stays in the body. Both the inference tokenizer and untruncated token
guard use that shared formatter. Inputs above the combined 128-token window skip the whole model
pass (`input_limit`); rules keep reading the full admitted text. More than 400 eligible sentences
also skips the whole pass. Low-confidence OCR hints remain limited to existing shape-based rules.

Predictions add `found_by:'model'`, exact sentence offsets/index/occurrence and whole-sentence marks.
Rules win whenever that source/file/sentence already has a finding. Personal and economics use
existing `other` copy; remarks use `insult`. The generic core seam still accepts the five category
labels for alternative classifiers, but this export cannot flag access or negotiation. Severity,
dialogs, Review and removal use the existing presentation code. The diagnostic is
`result.checked.semantic`: `used` or a fixed `skipped:<reason>` code, without input, scores or exceptions.

## Runtime, assets and lifecycle

- `runtime.js` remains the classic manifest override. The build parses it as ES2016 and rejects
  ORT, classifier and model-loader inputs. Classic Send remains rules-only.
- `commands.html` loads the ordinary gate plus small coordinator in `runtime-browser.js`. ORT and
  the tokenizer remain in the separate `model/engine.js` worker. The browser capability probe
  requires DOM, workers, WASM SIMD, BigInt/BigInt64Array, fetch, AbortController, encoders, SHA-256
  and Blob URL APIs; this probe does not establish native Outlook compatibility.
- Compose and attachment-change events finish OCR, then await preparation for at most 20 seconds
  within the event deadline. Preparation verifies/caches public assets and initializes a worker
  and ORT session. Only after success are other `dg-semantic-v1-*` revisions deleted. Unrelated
  caches are preserved; unavailable cache enumeration/deletion cannot fail the event.
- A successful Send keeps that runtime's worker/session ready. Repeat Sends do no model cache
  reads, hashes, worker startup or session creation. No email input or prediction is retained by
  the coordinator between calls. Classified mail is transient worker input, never an asset.
- Verified model and WASM ArrayBuffers are transferred into the worker once, rather than cloned.
  The coordinator retains no second copy. Engine/module Blob URLs live with the worker. Timeout,
  error, explicit cancellation or OCR preemption terminates it and revokes those URLs. A subsequent
  attempt must verify cached files again. Late reads/messages cannot revive a cancelled worker.
- Outlook may destroy the runtime at `event.completed()`. Reuse is conditional, never required:
  a fresh Send runtime reads and SHA-256-verifies all six cache assets, then initializes its own
  worker/session. No work after event completion is required. Cache denial can still use a live
  compose-prepared session, but a new activation without cached bytes skips the model.
- Send never downloads cold weights/tokenizer/WASM. Fixed own-origin public GETs are allowed only
  during preload, without credentials or redirects. Hashes/byte sizes for all six files are
  compiled into the loader. Revisioned Cache API entries contain public files only. No email,
  tokens or predictions enter that cache; no content, exception text or telemetry is logged or sent.
- Hash-verified engine and ORT module bytes execute through own-origin Blob URLs. ORT receives
  verified WASM bytes with `numThreads=1`, `proxy=false`, WASM execution provider. Hosts that refuse
  Blob workers/modules use rules only. Coordination is per runtime; isolated Outlook activations
  still need live memory-pressure qualification.

Keeping a live ORT session trades retained runtime memory for lower repeat latency. It does not
shrink the model or establish a native memory ceiling. OCR preempts the session before recognition;
separate Outlook activations may still overlap. The lifecycle decision follows the model lane's
`model/research/FEASIBILITY.md`; it does not assume a shared or persistent Outlook runtime.

## Budget

Retain **1,500 ms**, including sentence preparation, cache restoration/verification, worker/session
startup and classification. The production gate default and Send handler explicitly keep this cap.
After mandatory rules finish, the core takes
`min(semanticBudgetMs, semanticDeadline - now())`, using the injected gate clock consistently.
Send's overall timer remains **4,500 ms**, with **500 ms reserved** for unchanged-draft reread/result
persistence. A timeout terminates the worker and returns the rules result, not a failed check.

Explicit core callers may lift `semanticBudgetMs` (the held-out runner's 60-second budget is no
longer silently clamped). The browser service also permits an explicit direct `classify` budget;
`forSend` keeps the production cap. The measurements below give no reason to increase it. Reducing
it to 1,000 ms would skip some measured 60-sentence fresh-runtime passes; raising it would allow
longer waits without demonstrated benefit. A 1,500 ms model allowance leaves roughly 500 ms for
other work under the typical two-second target, but real Office callback/startup delays remain
unmeasured. The 4,500 ms deadline is the final bound, not a guarantee of a two-second native Send.

## Browser Send timing

Measured 23 October 2026 with **Playwright / headless Chromium 149.0.7827.55**, Windows 11,
Intel Core Ultra 9 185H, 16 GB RAM. Baseline: `5115e72a`; after: this lane's reuse/transfer changes.
One browser ran at a time; no training or other heavy job was started by this lane. No packages
were installed; `node_modules` remains the junction to `dg-email-runtime/node_modules`.

The flow is the built browser Send handler -> synthetic synchronous Office draft callbacks ->
mandatory rules -> Cache API read -> SHA-256 verification -> real Blob worker -> real ORT WASM
session -> real `context_text` classifier -> unchanged draft reread -> `event.completed()`.
Bodies have exactly 10 or 60 sentences, an empty subject, one outside recipient, no attachments,
and no rule findings. Each sentence is `Please review schedule item N before the next project meeting.`
The first has empty context; the remainder include the preceding sentence. No held-out data was
used. Assets were preloaded once, then the page was reloaded for each fresh-runtime trial, retaining
the browser's public asset cache. Repeat means the immediately following Send in that same runtime.
Thus a fresh row includes every startup cost listed above; it is not an inference-only benchmark.

Full Send wall time in **ms: median (minimum–maximum), three trials per row**:

| CDP CPU setting | Sentences | Runtime | Before | After |
| --- | ---: | --- | ---: | ---: |
| Normal | 10 | Fresh | 643 (580–675) | 580 (566–636) |
| Normal | 10 | Repeat | 591 (576–605) | 72 (71–74) |
| Normal | 60 | Fresh | 955 (925–965) | 940 (931–956) |
| Normal | 60 | Repeat | 938 (930–959) | 428 (426–431) |
| 4× | 10 | Fresh | 878 (858–894) | 848 (837–858) |
| 4× | 10 | Repeat | 856 (846–889) | 82 (76–83) |
| 4× | 60 | Fresh | 1262 (1197–1268) | 1203 (1189–1206) |
| 4× | 60 | Repeat | 1249 (1241–1261) | 428 (426–431) |

Every before/after row returned `checked.semantic:'used'`, allowed the ordinary synthetic email
and completed once (24/24 per version). A compose-prepared 10-sentence Send, one additional sample
per CPU setting, changed from 526 -> 96 ms normal and 647 -> 111 ms at 4×. That improvement applies
only if the compose runtime survives. Before, every fresh/repeat Send did six cache reads, six
hashes and one worker initialization. After, fresh Sends still did those operations, while **all
repeat Sends did zero**. Fresh latency improved modestly; the main improvement is session reuse.
Cache lookup/hash timings in the receipts do not include all response-body copying/decoding time;
the total Send wall time does.

**Throttling limitation observed:** `Emulation.setCPUThrottlingRate({rate:4})` slows the page, but
does not slow dedicated-worker inference by 4×. Attaching CDP to the worker and attempting the same
command returned `-32000: Operation is only supported for pages, not workers`. Worker inference
stayed approximately 0.1 seconds for 10 sentences and 0.45 seconds for 60. These are the requested
CDP 4× results, but they do **not** establish performance on a genuinely four-times-slower CPU.
They therefore do not resolve older-laptop or native Outlook qualification. No inferred 4× worker
times are presented as measurements.

Raw samples: [before](benchmarks/semantic-send-before.json), [after](benchmarks/semantic-send-after.json).
Reproduction (build first; supply an existing Playwright installation, no install required):

```powershell
npm run build
node tools/measure-semantic-send.mjs --playwright=C:/path/to/playwright/index.mjs --output=C:/Temp/semantic-send.json
```

The probe starts and closes its own loopback HTTP server and Chromium, records timing/counters
only, and never contacts Outlook or a hosted model. Browser automation was explicitly requested.
Its Office callbacks are synchronous fixtures; the model, cache, hashing and inference are real.

## Export, licences and verification

The real export, source hashes, base revision, input mode and integration threshold change are
recorded in [model/PROVENANCE.json](../model/PROVENANCE.json). That is the source of truth; this
document deliberately does not duplicate a model hash. `classifier.mjs`, `tokenize.mjs` and every
model artifact still match that provenance. ORT 1.30.0 and Tokenizers 0.2.0 remain pinned build-time
devDependencies; neither enters `core/` or classic `runtime.js`.

`outlook/MODEL-NOTICE.txt` records the exact upstream `v1.30.0` URLs for
[ORT LICENSE](https://raw.githubusercontent.com/microsoft/onnxruntime/v1.30.0/LICENSE) and
[ThirdPartyNotices.txt](https://raw.githubusercontent.com/microsoft/onnxruntime/v1.30.0/ThirdPartyNotices.txt).
Both public files were fetched read-only and compared to the shipped notices. Their text matches
after CRLF-to-LF normalization; only line endings differ. The notices themselves were preserved.

`npm test`: **331/331 passing**, up from 324. Seven new tests cover explicit lifted budgets,
injected-clock deadlines, guard/tokenizer parity at exact token boundaries, session reuse,
successful-only stale cache pruning, hung preload initialization, and timeout/retry/busy behavior.
Existing tests now also assert transfer lists, the explicit production handler cap, fresh-runtime
cache verification, no cold Send downloads, corrupt/redirected files, denied storage/CSP, late
messages/reads, OCR preemption, model Off, sentence/token limits, sanitized skips, and unchanged
sender presentation. `npm run build` passes, including classic ES2016/no-model and both offline
manifest checks. No remote was added; nothing was pushed or deployed.
An additional eight instrumented browser Sends made zero server requests during the timed path,
all used semantics and completed once. Landing copy rendered at 1280×900 and 390×844 with the
expected title/heading/model text, no horizontal overflow and no page runtime errors. These
synthetic callback/browser checks do not demonstrate actual Outlook interaction.

Before claiming live support, use synthetic drafts in actual Send event runtimes on web, new
Windows and Mac. Check callback/startup timing, real slower hardware, cold/warm/evicted/denied
caches, pane/event partitioning, Blob/WASM CSP, memory pressure/OCR, draft edits, Ask/Hold controls
and exactly one timely completion. Classic 2206/pre-2403 must retain rules-only behavior. The browser
measurements and Node/VM/build checks do not qualify those native behaviors. No held-out directory
content was opened, listed or searched beyond the permitted `evaluation/heldout/run.mjs`.

## Default: Off (23 October 2026)

The release bar for shipping the model on by default was at most 2 needless questions on the
200-email `everyday` held-out tier (outside mail with no disclosure). Measured once on main: the rules
alone flagged 0 of 200; rules plus the model flagged 47 of 200 (personal and economics findings,
one remark). The model therefore ships off (`model` defaults to `off`; `model=on` turns it on), and
a default install never preloads or calls it. Improving its precision on everyday mail is the main
work for the next release; the `everyday` tier must not be used to tune it.
