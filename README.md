# Disclosure Gate for Outlook

An Outlook add-in that asks before an email or meeting invitation takes something outside your
organization that should stay inside. Press Send and it explains the concern. You can choose
Send Anyway, Review, or Don't Send. Intentional disclosures do not require rewording.
Your IT team can require a hold, separately for findings and for checks that fail.

Every check runs inside Outlook on the sender's device. The add-in is a folder of static files:
there is no server, no account, no AI service, no telemetry and no log.

**Set it up:** https://jamesdimachkie.github.io/disclosure-gate-outlook/

## What it does

| | |
| --- | --- |
| Passwords, keys and codes | A password or PIN that is actually given, a login with its password, API keys and tokens (AWS, GitHub, Slack, Stripe, Google, OpenAI, Anthropic), private keys, JSON Web Tokens, database connection strings, and door, gate, alarm or Wi-Fi codes |
| Card and bank details | Luhn-valid card numbers, valid IBANs, US routing numbers with an account number, UK sort codes with an account number |
| Government ID numbers | US Social Security, UK National Insurance and Canadian SIN numbers; passport, licence and personal tax ID numbers |
| Lookalike addresses | An address that looks like your organization's but isn't (`north1ine.com` for `northline.com`) |
| Lists of people's details | A spreadsheet, table or form that pairs people with what is sensitive about them: home addresses, ID or tax numbers, health, offences, pay, family members, claims |
| Wrong recipient | A greeting to someone who isn't on the recipient lines ("Hi Alex," sent only to Morgan Vale) |
| Marked internal | "Internal only", "not for external distribution", "don't forward this to the client" in an email going outside |
| Exposed recipient lists | Eight or more outside addresses from three or more organizations in To and Cc (the sender is asked to use Bcc and can still send) |
| Files it can't read | A ZIP file, an attached email or another attachment whose text can't be checked |
| Text in pictures and scans | Screenshots, scanned PDFs and pictures are read on the device (Tesseract OCR, English) and their text is checked like the rest; anything found counts even when the reading was uncertain. A photo or logo where it finds nothing doesn't stop the email: an attached one asks the sender to look, with Send anyway |

It also catches, more narrowly, personal details about someone (health, family, legal, HR), your
own costs and margins, your negotiating position, and insults, but only in common wordings. On 160
test emails written to vary their wording, the rules caught **7 of 60** of these. Treat it as a
second pair of eyes for these, not a guarantee.

**On-device model, on by default:** a small model that runs on each computer reads every sentence for
personal details, internal costs, negotiating position, insults and physical security (hidden keys,
alarms off) however they're worded. It is set to catch rather than miss: on a test set it had never
seen, written by an AI author that wrote none of its training data, it raised those catches from
**14 of 60** (rules alone) to **50 of 60**, and asked about **12 of 300** (4%) everyday outside emails,
each with Send Anyway. It runs in Outlook on the web,
the new Outlook and Outlook for Mac (classic Outlook for Windows uses the rules only), needs no AI
service or account, and IT can switch it off at setup.

Email that stays inside your organization is never held. The full contract is in [SPEC.md](SPEC.md).

## How well it works

These measurements predate Ask/Ask. They count findings, not required holds under the current defaults.
They measure the rules alone; the on-device model's figures are above.
On a further 200 everyday outside emails (quotes, scheduling, support, recruiting, client letters),
the rules flagged none.

Measured on two synthetic test sets written from [SPEC.md](SPEC.md) by AI models that never saw the
rules, from a different model family than the rules' author:

| Test set | Ordinary emails flagged by mistake | Flagged as it should |
| --- | --- | --- |
| 150 realistic emails (long threads, signatures, quoted replies, attachments) | 0 of 100 | 32 of 40 |
| 440 short emails, one tricky sentence each ([evaluation/heldout](evaluation/heldout/)) | 0 of 264 | 113 of 164 |

In the realistic set it flagged 22 of 23 emails carrying a secret, a card or bank number, an ID
number or a lookalike address, and 10 of 17 carrying internal figures, a negotiating position,
personal details or an insult; every long outside recipient list was flagged.

After measuring we fixed problems the misses and two independent code reviews pointed to (amounts in
pounds and euros among them). The current build flags 34 of 40 and 118 of 164 on the same sets, still
with no ordinary email flagged, but those fixes were informed by the misses, so the figures above are
the fair ones. The short set and its runner are published here so you can rerun them; the realistic
set stays private so it can measure the next release.

Attachment reading was run on 578 real Word, Excel and PowerPoint files (the Apache POI test corpus)
and 679 real PDFs (the Mozilla pdf.js test corpus): none crashed, each took under half a second, and
files it can't fully read return "can't check" (now governed by the failures setting). These are synthetic tests, not a measure on your
mail.

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
at most 1.5 seconds within Send's 4.5-second deadline. Public assets are cached; email is not.
Compose preparation initializes a worker/session that repeat Sends reuse if that runtime survives.
A fresh Send runtime still verifies cached public files and initializes its own session. Timeouts
and OCR preemption terminate the worker. [Browser Send timings and their limits](docs/SEMANTIC-INTEGRATION.md#browser-send-timing).
The model reads each sentence with the one before it; an input beyond its 128-token window skips the model pass.
Timing and caching inside each Outlook client have not yet been measured live.

Works in Outlook on the web, the new Outlook for Windows, classic Outlook for Windows (2206 or later)
and Outlook for Mac (new UI, 16.65 or later), with Exchange Online. Outlook on phones doesn't run Send
checks, and mail sent by other apps or scripts isn't checked. This installation is deployed by an
admin; it is not published in the Microsoft Marketplace.

## Development

Node 24. `npm ci`, then `npm test` (builds, then runs the offline suite) or `npm run dev` (serves
`dist/` at `https://localhost:3443`). Details: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Security

See [SECURITY.md](SECURITY.md). Licensed under [Apache 2.0](LICENSE).
