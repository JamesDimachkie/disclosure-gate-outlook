# Disclosure Gate for Outlook

**An Outlook add-in that asks "are you sure?" before an email takes something sensitive outside your
organisation.** Press Send and, if the email carries a password, a card number, a spreadsheet of
people's details, your margin or a remark about a client, or looks like it is going to the wrong
person, Outlook shows what it found and where. The sender chooses Send Anyway, Review or Don't Send.

Everything runs inside Outlook on the sender's own computer: rules, attachment readers, on-device OCR
and a small on-device language model. There is no server, no account, no AI service, no telemetry and
no log. Nothing in an email is sent anywhere to be checked.

**Set it up:** https://jamesdimachkie.github.io/disclosure-gate-outlook/ ·
[How it works](ARCHITECTURE.md) · [How it was tested](EVALUATION.md) · [Spec](SPEC.md)

<p>
<img src="docs/images/send-dialog.png" width="480" alt="Outlook's Send dialog from Disclosure Gate: This email goes outside your company and includes your margin and your negotiating position. Greets Kate, sent to dan@whitfielddev.example. In the body: your margin. In the body: your negotiating position. And 1 more. Buttons: Send anyway, Review, Don't send.">
&nbsp;
<img src="docs/images/review-pane.png" width="230" alt="The Review pane for the same email: one outside recipient, then cards for the greeting that doesn't match the recipient, internal economics, negotiation position and a gate code, each sentence highlighted with Remove this sentence and Show me.">
</p>

*A fictional email written to Kate but addressed to the client, on Send in Outlook on the web (left),
and the Review pane it opens (right).*

## What it catches

| | |
| --- | --- |
| Passwords, keys and codes | A password or PIN that is actually given, a login with its password, API keys and tokens (AWS, GitHub, Slack, Stripe, Google, OpenAI, Anthropic), private keys, JSON Web Tokens, database connection strings, and door, gate, alarm or Wi-Fi codes |
| Card and bank details | Luhn-valid card numbers, valid IBANs, US routing numbers with an account number, UK sort codes with an account number |
| Government ID numbers | US Social Security, UK National Insurance and Canadian SIN numbers; passport, licence and personal tax ID numbers |
| Lists of people's details | A spreadsheet, table, form or sentence that pairs people with what is sensitive about them: home addresses, ID or tax numbers, health, offences, pay, family members, claims |
| What it means, not just what it says | Personal details about someone, your own costs and margins, your negotiating position, insults, and physical security (a hidden key, an alarm left off), however they are worded, read by an on-device model |
| Wrong recipient | A greeting to someone who isn't on the recipient lines ("Hi Alex," sent only to Morgan Vale), and addresses that look like yours but aren't (`north1ine.com`) |
| Marked internal | "Internal only", "not for external distribution", "don't forward this to the client" in an email going outside |
| Exposed recipient lists | Eight or more outside addresses from three or more organisations in To and Cc |
| Attachments and pictures | Word, Excel, PowerPoint, PDF, CSV and text files use local parsers; supported PDF image pages and embedded Office pictures also receive on-device OCR. Incomplete coverage asks or holds; unreadable pictures ask. Micro-images and scan limits are described below |

Email that stays inside your organisation is never held. Meeting invitations are checked the same way.

## How well it works

On the newest blind test set of 360 everyday outside emails, written by an AI model that wrote none of
the training data and scored once against a bar fixed before anyone deciding had seen the set:

| | Disclosures caught | Ordinary emails asked about |
| --- | --- | --- |
| Rules, recipients and the on-device model v2.3 (default) | **60 of 60** | **2 of 300** (0.7%) |
| Rules and recipient checks only (model off) | 29 of 60 | 0 of 300 |

Don't read 60 of 60 as "catches everything". That set was easier than the one before it: the previous
model also caught all 60 here, but 50 of 60 on the previous blind set. Expect some misses on real mail.

It is tuned to catch rather than miss: a question on an ordinary email costs one click; a missed
disclosure can cost a client, a fine or a career. On 49 real, documented email incidents rebuilt with
invented names, it asks about 35. [EVALUATION.md](EVALUATION.md) has the method, every gate including
the ones that failed, and the limits: all test mail is synthetic, and each gate has only 60
disclosures.

Attachments: 36 everyday documents saved by Chromium and Microsoft Word, as PDF and `.docx`, all read
in full with every amount, name and accented or non-Latin phrase intact
([evaluation/everyday-docs](evaluation/everyday-docs/)). On 1,008 Mozilla pdf.js PDFs and 578 Apache
POI Office files, regression collections built to break parsers, each file runs in its own bounded
process: no crashes or timeouts, and the slowest check took 644 ms (OCR inference excluded). A file
that can't be read completely is reported as can't-check and asks, instead of passing on what was
read; that rule puts 88 of those PDFs and 15 of the Office files in can't-check and sends 55 Office
files to OCR for their embedded pictures. Neither collection measures accuracy on ordinary mail.
Outcomes, provenance and the command are in [DEVELOPMENT.md](docs/DEVELOPMENT.md#public-attachment-corpus-check).

PDF image-only pages and images beside native text require OCR, which is combined with native page,
form and annotation text. The bounded scan reader supports JPEG and simple raw/Flate RGB/gray images,
up to 12 PDF pages, 12 images and 12 megapixels. Unsupported rendering (including masks, clipping,
painting, inline images and image-bearing annotations) follows the failures setting. Unmapped PDF
text runs, Type3 glyph programs, tiling patterns and forms nested beyond eight levels also make the
file can't-check. Text drawn only as vector outlines is outside the native reader's coverage.
Office pictures, including those in embedded Office files, use the attached-picture rule: unavailable
or failed recognition asks with Send Anyway; pending OCR, changed bytes, API/identity errors,
timeouts and cache limits follow the failures setting.
Native document text is checked in either case. Office pictures share a 12-image/12-megapixel limit;
only micro-images up to 8×8 pixels and 256 bytes, and cached package thumbnails, are ignored. Larger
logos may contain words. Referenced thumbnails are checked too. SVG text is read natively; SVG
embedded images and unsupported picture formats ask, as do Office picture-count/pixel overflows. XML depth/work
limits fail closed. See [SPEC §6](SPEC.md#6-attachments) for the exact limits. OCR requires a capable
runtime, runs in English on the device, and never replaces native document validation.

The model runs in Outlook on the web, the new Outlook for Windows and Outlook for Mac; classic Outlook
for Windows uses the rules alone. IT can switch the model off at setup.

## Install

A Microsoft 365 admin installs it once; users do nothing.

1. Open the [setup page](https://jamesdimachkie.github.io/disclosure-gate-outlook/setup.html),
   choose **When it finds something: Ask or Hold** and **When it can't check: Ask or Hold**.
   Both default to **Ask**, recommended for most teams. Hold is for teams whose policy requires it.
   Add your other internal domains and download `manifest.xml`.
2. In the Microsoft 365 admin center, go to Settings > Integrated apps > Upload custom apps and
   upload the manifest.
3. Assign users or groups. Microsoft can take up to a day to deliver it to Outlook.

To host the files yourself, build them (`npm ci && npm run build`), serve `dist/` over HTTPS, and
enter that address on the setup page.

Both Ask settings generate `PromptUser`. Findings=Hold with failures=Ask generates `SoftBlock`;
failures=Hold generates `Block`. Ask outcomes use a `promptUser` override on Mailbox 1.14+.
Older clients hold those outcomes too in a SoftBlock or Block installation.
Exposed recipient lists and attached pictures it couldn't read always ask where supported. Legacy
URLs `mode=warn` and `mode=enforce` map to ask/ask and hold/hold; explicit new settings refine them.

If the add-in cannot load, failures=Ask leaves the sender Outlook's Send Anyway / Try Later choice,
including when findings=Hold. Files it can't read and checks that don't finish can still be sent
after the sender confirms; choose Hold for failures too to prevent that. Failures=Hold installs
Block and holds on load failure. See [Microsoft's modes and unavailable-add-in behavior](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/onmessagesend-onappointmentsend-events).
The runtime override from a SoftBlock manifest still needs live-client verification.
If the runtime can't recover valid settings, only the mailbox domain counts as inside and the
dialog uses conditional instructions because Outlook's installed mode determines the buttons.

### Make Hold settings work everywhere

These policies matter when **either setting is Hold**. Outlook decides some cases before the
add-in runs. For holding to cover them, also set:

| Client | Setting | Without it |
| --- | --- | --- |
| Outlook on the web, new Outlook for Windows | `OnSendAddinsEnabled` on the users' OWA mailbox policy (Exchange Online PowerShell: `Set-OwaMailboxPolicy <policy> -OnSendAddinsEnabled:$true`) | Mail sent while Outlook started offline isn't checked |
| Outlook for Mac | `OnSendAddinsWaitForLoad` = true in the `com.microsoft.outlook` domain (through your Mac management tool) | Mail can be sent before the add-in has loaded |
| Classic Outlook for Windows | Group Policy *Running Outlook for Simple MAPI Mail Sending* = Enabled | Word's "Attach a copy", "Send to mail recipient" and similar can send while Outlook is closed, unchecked |

Microsoft's reference: [Smart Alerts behaviour](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/onmessagesend-onappointmentsend-events).

### What it doesn't see

- **Meeting exclusions**: invitations and updates from the organizer form are checked. In web/new Outlook, sends from embedded meeting forms and meeting forwards don't trigger the check; use a separate window. Meeting forwards and attendee responses aren't covered on any client. Resources not exposed in attendee lists or enhanced locations, including personal contact groups used as locations, aren't visible.
- **Protected items**: Outlook doesn't run add-ins on items whose sensitivity label or IRM template turns off programmatic access, so those are sent unchecked.
- **Changes after Send**: Exchange rules that forward, redirect or copy mail outside, or add server-side signatures, act after the check. An inside address that reaches outsiders (a Microsoft 365 group with guests) counts as inside.
- **Phones, other apps and scripts**: Outlook on iOS and Android doesn't run Send checks; mail sent by other apps or services isn't checked.

The sentence model is on unless IT turns it off. Classic Outlook for Windows uses rules only. Other clients skip it
if browser capabilities are missing, it is not ready in time, or there are more than 400 readable
sentences. Model failure never fails the check: rules still run over the full text. The model has
at most 2.5 seconds within Send's 4.5-second deadline; on a long email it keeps whatever it finished in time. Public assets are cached; email is not.
Compose preparation initializes a worker/session that repeat Sends reuse if that runtime survives.
A fresh Send runtime still verifies cached public files and initializes its own session. Timeouts
and OCR preemption terminate the worker. [Browser Send timings and their limits](docs/SEMANTIC-INTEGRATION.md#browser-send-timing).
The model reads each sentence with the one before it; an input beyond its 128-token window skips the model pass.
Live in Outlook on the web, Send to dialog took about 1.2 to 1.4 seconds with the model; the other clients have not yet been measured live.

Works in Outlook on the web, the new Outlook for Windows, classic Outlook for Windows (2206 or later)
and Outlook for Mac (new UI, 16.65 or later), with Exchange Online. Outlook on phones doesn't run Send
checks, and mail sent by other apps or scripts isn't checked. This installation is deployed by an
admin; it is not published in the Microsoft Marketplace.

## Development

Node 24. `npm ci`, then `npm test` (builds, then runs the offline suite) or `npm run dev` (serves
`dist/` at `https://localhost:3443`). Details: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Security

See [SECURITY.md](SECURITY.md). Licensed under [Apache 2.0](LICENSE).
