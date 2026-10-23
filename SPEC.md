# Disclosure Gate for Outlook: product spec v2

23 October 2026. Ask-first replaces hold-first behavior. Supersedes v1 where they differ. This is the
contract for every build lane and the only document an evaluation-set author reads.

## 1. The promise

When you press Send, Disclosure Gate checks the email or meeting invitation on your device. If it
goes outside your organization carrying something that should stay inside, it asks if you are sure
and explains the concern. You can knowingly choose Send Anyway, review it, or cancel and edit it.
Intentional disclosures do not require rewording. IT can require a hold, separately for findings
and for checks that fail.

Every check runs inside Outlook on your own device. No part of an email (text, attachments,
addresses) is sent anywhere to be checked. There is no server to run and no account to create. The
add-in is a set of static files; it keeps no logs and sends no telemetry.

## 2. Where it runs

Outlook on the web, new Outlook for Windows, classic Outlook for Windows (Version 2206 or later) and
Outlook for Mac (new UI, 16.65 or later), on Exchange Online, through Smart Alerts (`OnMessageSend` and
`OnAppointmentSend`, Mailbox 1.12). Meeting invitations and updates sent from the appointment
organizer form are checked. On the web and new Outlook for Windows this requires a separate window:
embedded meeting forms and meeting forwards don't trigger the appointment Send event. Meeting
forwards and attendee responses are outside this product's meeting coverage on every client. Outlook
on iOS and Android, other mail apps, and mail sent by scripts or other services are not covered and
are never claimed.

## 3. Install

An organization's Microsoft 365 admin deploys it once from the admin center (Settings > Integrated
apps > Upload custom apps) with a manifest made on the setup page. The admin chooses:

- **When it finds something:** `findings=ask|hold`, default **Ask**, recommended for most teams.
  Explain the concern and offer Send Anyway or Review. Hold is for teams whose policy requires a change.
- **When it can't check:** `failures=ask|hold`, default **Ask**. Covers timeouts, errors, unreadable
  or unsupported files (including ZIPs and attached emails), too much content, pending OCR,
  changed drafts and draft-read failures. Ask lets the sender confirm the contents or cancel and
  retry. Hold keeps the item unsent until a successful retry/edit or help from IT.
- **On-device model (experimental):** `model=on|off`, default **Off**. Off leaves the rules deciding
  alone (§5). On adds the sentence model's findings, with many more questions on ordinary mail (§5).
- Prompt-severity findings always ask: an attached picture it couldn't read (§5.9) and an exposed
  recipient list (§5.8), subject to client support below.
- **Internal domains** (optional). The mailbox's own domain is always inside. The admin may add the
  organization's other domains.
- **Where the files are served from**: the public release host, or the organization's own HTTPS host.

Users do nothing. A compose-ribbon button opens the pane.

| Findings | Failures | Manifest SendMode (both Send events) |
| --- | --- | --- |
| Ask | Ask | PromptUser |
| Ask | Hold | Block |
| Hold | Ask | SoftBlock |
| Hold | Hold | Block |

Mailbox 1.14+ ask outcomes set `sendModeOverride:'promptUser'`. Before 1.14, a SoftBlock or Block installation
holds ask outcomes too. Older classic runtimes that cannot read their manifest URL cannot recover
the settings or extra domains: they use only the mailbox domain and neutral, conditional button copy.
Malformed or duplicate configuration also uses this settings-unknown fallback. The manifest still
determines the actual buttons, so Send Anyway may be offered there.

When the add-in cannot load, failures=Ask leaves Outlook's Send Anyway / Try Later choice, with
PromptUser for Ask/Ask or SoftBlock for Hold/Ask. Failures=Hold installs Block and holds on load failure.
Under SoftBlock, unmet conditions still require a change unless the running handler explicitly asks.
Microsoft documents the [three modes and unavailable-add-in behavior](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/onmessagesend-onappointmentsend-events)
and [runtime overrides from Mailbox 1.14](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/smart-alerts-onmessagesend-walkthrough#override-the-send-mode-option-at-runtime-optional).
The override documentation does not restrict promptUser by manifest mode; verify it from a SoftBlock
manifest on a live client. The README lists additional Outlook policies for Hold.

URL settings accept only `ask` or `hold`; duplicate recognized parameters are refused. Legacy
`mode=warn` means ask/ask and `mode=enforce` means hold/hold. Explicit new values refine aliases:
`mode=enforce&findings=ask` means ask/hold. Roaming settings cannot change admin choices.

## 4. Who is outside

A recipient is **inside** only when the domain of the address exactly matches the mailbox's own
domain or an admin-listed domain. The From address doesn't count (send-as and shared mailboxes can
put any domain there), and users can't add domains themselves. Every other address is **outside**,
including subdomains and lookalikes. A distribution list or an entry without a checkable address is
**can't check** and counts as outside for holding. An email whose recipients are all inside is never
held and is not read further. Classic Outlook before Mailbox 1.14 can't read the admin's domains, so
there only the mailbox's own domain is inside.

An inside address that itself reaches outsiders (a Microsoft 365 group with guests, a list Outlook
reports as a person) is treated as inside: the add-in can't see its members.

## 5. What it flags

These apply only when at least one recipient is outside or can't be checked. Text is read from the
subject, the body including any quoted earlier messages, and the text of readable attachments
(section 6). Each finding points to one sentence, file or recipient.

When IT turns it on, in clients that support it, a small on-device sentence model also flags personal details (§5.4),
internal economics (§5.5) and remarks (§5.7). It adds findings using the same sender-facing copy; a
rule finding on that sentence takes precedence. Access (§5.1) and negotiation position (§5.6) stay
with the rules: the model's scores for them overlapped ordinary sentences in realistic email
(decided 23 October 2026). On a held-out set of 160 realistic emails, rules plus the model caught
30 of 60 disclosures in §5.1 and §5.4–§5.7 (rules alone: 7) and flagged 2 of 100 ordinary emails
(rules alone: 0), but on a held-out set of 200 everyday outside emails it flagged 47 (rules alone: 0).
It therefore ships off; IT can turn it on at setup (§3).

For meeting invitations and updates, required attendees map to To and optional attendees to Cc.
Room addresses returned by Outlook's enhanced location API also count as recipients, under the same
domain rules: an outside room or resource is outside, never automatically inside. A distribution
list is still can't check. Inside-only meetings stop after attendee and room metadata; otherwise the
subject, body, location text (including enhanced location names) and attachments are checked. A
location finding is labelled "In the location" and is edited manually in Outlook. The exposed-list
finding asks the organizer to check attendees, since appointments have no Bcc field. Microsoft does
not expose a separate resources reader; resources absent from both the attendee lists and enhanced
location results cannot be seen. Personal contact groups used as locations aren't returned by that API.

The bar is high precision: ordinary business email must go through untouched. A false finding is a
failure, not a safe outcome. Where a rule is unsure, it does not flag.

### 5.1 Secrets and access

Flags:
- A password, passcode or PIN that is actually given (`the password is Tr4ctor!22`, `PIN: 4471`).
- A login together with its password.
- An API key, token or private key in a recognizable format: AWS access keys (`AKIA...`), GitHub
  tokens (`ghp_`, `github_pat_`), Slack tokens (`xoxb-`, `xoxp-`), Stripe live secret keys
  (`sk_live_`), Google API keys (`AIza...`), OpenAI/Anthropic-style secret keys (`sk-...`,
  `sk-ant-...`), PEM private-key blocks (`-----BEGIN ... PRIVATE KEY-----`), JSON Web Tokens, and
  database connection strings that contain a password.
- A door, gate, alarm, lockbox, keypad, garage, safe or Wi-Fi code that is actually given.
- Where a key is hidden, or a security gap: alarm off, cameras down, a gate or lock broken or left
  open, an area no camera covers.

Does not flag: talk about passwords without one (`I reset my password`, `send me the password
reset link`), the words key, code or access in ordinary logistics (`the site access is off Main
Street`, `bring the keys Monday`), placeholder or example values (`password: ********`,
`sk-xxxx`), discount or promo codes, tracking numbers, order numbers, reference numbers.

### 5.2 Payment and bank details

Flags:
- A payment card number: 13 to 19 digits (spaces or dashes allowed) that passes the Luhn check and
  either has a known card prefix or appears next to card words (card, Visa, Mastercard, Amex, CVV,
  expiry).
- A bank account: a valid IBAN (checksum passes); a US routing number (checksum passes) together
  with an account number; a UK sort code together with an account number.

Does not flag: the last four digits of a card (`card ending 4242`), invoice, order, PO or tracking
numbers, phone numbers, a bank's name or address alone.

### 5.3 Government identifiers

Flags: a US Social Security number in a valid range (written `123-45-6789`, or nine digits next to
SSN words); a UK National Insurance number; a Canadian Social Insurance Number that passes Luhn next
to SIN words; a passport, driver's licence, national ID or a person's tax ID number given next to
its name.

Does not flag: the words alone without a number, dates, phone numbers, ZIP codes, and the sender
organization's own tax or registration number (`our EIN is ...`), which appears on every W-9 and
invoice it sends (decided 22 October 2026).

### 5.4 Personal details about a person

Flags: an identifiable person's health or medical treatment, family matters (illness, death,
divorce, custody), legal trouble (arrest, charges, court case), or HR matters (being fired, written
up, put on a performance plan, their pay, salary or bonus).

Does not flag: an absence or schedule change without a stated cause (`Dan is out Friday`), names,
job titles, roles, a company's own legal matters stated as business (`our contract with them`).

### 5.5 Internal economics

Flags: the sender organization's own costs or cost build-up, margin, markup or profit, contingency,
internal budget, what it carried for an item, or its floor or walk-away price, including as ratios
(`triple the margin we bid`).

Does not flag: customer-facing prices, quotes, contract values, invoice amounts and payment terms
stated as facts; naming a budget line or change order without an internal figure.

### 5.6 Negotiation position

Flags: room to move on price or terms, what the sender would accept or concede, what they expect the
other side to counter with, their bid or negotiation strategy.

Does not flag: an offer or proposal actually made to the recipient.

### 5.7 Remarks about a person or company

Flags: an insult or disparaging remark about a person or company (`he's an idiot`, `those clowns at
the city`).

Does not flag: blunt disagreement, firm requests, criticism of work, drawings or schedules.

### 5.8 Recipient problems

- **Lookalike domain.** An outside address whose domain looks like an inside domain but isn't.
  Flags, naming the recipient. The check compares the *name* of each domain: the part before its
  ending (`northline` in `northline.com` and in `mail.northline.co.uk`; common two-part endings such
  as `.co.uk` and `.com.au` count as one ending). It is a lookalike when any of these holds:
  1. The whole inside domain with more after it: `northline.com.evil.io`.
  2. The same name under another ending: `northline.co`, `northline.com.au` or `northline.com.co`
     for `northline.com`.
  3. The same name once look-alike characters are read as what they imitate: `1`, `i` or `|` for `l`,
     `0` for `o`, `rn` for `m`, `vv` for `w`, `cl` for `d`, accented letters, and Cyrillic or Greek
     letters that look Latin (`north1ine`, `nоrthline` with a Cyrillic о, internationalized names).
  4. A small typing change, counted on the name: a character added, removed or changed, or two
     neighbouring characters swapped, each counting as one change. An inside name of 6 or more
     characters allows up to two changes; of 4 or 5 characters, one; of 3 or fewer, none (only 1 to 3
     apply to it). Two changes where both are plain letters changed in place, with the length the same
     and no look-alike character involved, do not count: that is how a different word is spelled
     (`southline`, `northside` and `narthlane` are not lookalikes of `northline`), not how a name is
     imitated. Two changes that add, remove or swap letters do count (`northlinne`, `nortlhine`).
  5. An inside name of 4 or more characters joined, with or without a hyphen and on either side, to a
     word that phishing puts next to a name: secure, security, login, signin, verify, verification,
     account(s), billing, invoice(s), payment(s), pay, payroll, remit, remittance, support, helpdesk,
     help, it, hr, mail, email, webmail, portal, docs, documents, share, sharepoint, onedrive,
     office365, o365, microsoft, admin, update, service(s), online, notify, alert(s)
     (`northline-billing.com`, `securenorthline.com`). Company-structure words such as group,
     holdings or inc are not on the list.

  Never a lookalike: an inside domain itself, its subdomains or the domains it is a subdomain of
  (those are simply outside, §4); another subdomain of the same registered name; and well-known mail
  providers such as gmail.com, outlook.com, icloud.com and yahoo.com.

  An admin can list trusted outside domains (real partners whose domain resembles theirs, such as
  `accentcare.com` next to `accenture.com`); those skip only this check, and their email is still
  screened.
- **Exposed recipient list.** Eight or more outside addresses from three or more different outside
  domains in To and Cc together. The sender is told to move them to Bcc. In both settings this one
  offers Send Anyway, subject to the installed mode on clients before Mailbox 1.14.

### 5.9 Files that can't be checked

A file attachment whose text can't be read (section 6) is a failure under the failures setting,
with the file named. Attached emails and cloud links are not read and use that setting too.

Pictures are the exception, because most of them are photos and logos with no text to read. Text
read from a picture is checked like any other text, and anything found in it counts even when the
reading was uncertain (a screenshot of a key misread by a character is still a key; decided 23 October
2026); only a confident reading can clear a picture. A picture whose text can't be read confidently
and where nothing was found (a photo, a stylised logo, an image too large to read) doesn't stop the email: an
inline picture is ignored, and an attached one asks the sender to look at it, with Send anyway in
settings (a SoftBlock or Block installation before Mailbox 1.14 holds it too). A picture still being read, or
changed since it was read, is a failure under the failures setting.

## 6. Attachments

Read as text: PDF with a text layer, DOCX, XLSX, PPTX, CSV and TXT, up to 10 MB each. Table rows (a
CSV file, spreadsheet rows, a table pasted into a body) are read cell by cell under their column
headers, the way a "Label: value" line is: a number under an order, invoice or reference header is
that number, and one under a card header is read as a card. Images (PNG,
JPEG, GIF, BMP, TIFF, WebP) and scanned PDFs are read with on-device OCR (Tesseract, WebAssembly),
run when the file is attached and cached, so Send stays fast. OCR text with good confidence is
checked like any other text; an image with confidently no text is clear; an image whose OCR
confidence is low is handled as in §5.9. Where OCR can't run (classic Outlook's event runtime),
pictures are handled the same way. OCR is English only.

## 7. What the sender sees

Modern findings dialogs show Send Anyway for an effective ask outcome, Don't Send to cancel, and
Review (Take Action), opening dgOpenPane for email or dgOpenMeetingPane for meetings. Review never
releases an item. Older classic/Mac clients may put Review in the Don't Send position. Before 1.14,
plain copy uses "Open Disclosure Gate from the ribbon to see why." instead of a Review button.

The four shapes below are exact examples. Kinds, locations and reasons vary with the result.
The plain errorMessage carries the same information as sentences, without bold or bullets. Both
versions are at most 500 characters. Names are safely shortened to fit. Up to three findings are
listed, with "and N more" for the rest ("And N more." as a plain sentence). No dialog quotes a secret or matched sentence.

**Findings, ask**

**This email goes outside your company and includes a password and a card number.**

- In the body: a password
- In invoice.pdf: a card number

If you're sure, choose **Send Anyway**. To see each one and fix it, choose **Review**.

**Findings, hold**

**This email goes outside your company and includes a password and a card number.**

- In the body: a password
- In invoice.pdf: a card number

It hasn't been sent. Choose **Review** to see what to change, then press Send again.

**Failures, ask**

**Disclosure Gate couldn't check this email.**

It took too long.

If you're sure about what it contains, choose **Send Anyway**. To check it again, choose **Don't Send** and press Send.

**Failures, hold**

**Disclosure Gate couldn't check this email.**

It took too long.

It hasn't been sent. Press Send again to check it again, or ask your IT team.

Other exact reasons include "It's too large to check.", "An image is still being read.",
"Outlook didn't let it read the draft.", "The local check didn't finish." and
"The draft changed during the check." File bullets include "site-photos.zip couldn't be read",
"site-photos.zip is too large to check" or "note.png is still being read".

Size failures replace the retry instructions with these exact actions, for the whole draft or a
file whose failure is size. Ask: "If you're sure about what it contains, choose **Send Anyway**.
To check it, choose **Don't Send**. Shorten it or split it, then press Send." Hold: "It hasn't
been sent. Shorten it or split it, then press Send." Mixed findings keep their Review instructions
and append "Shorten it or split it, then press Send."

Exposed-list bullets say "In To and Cc: 8 outside addresses"; meetings say "In the attendee list:
8 outside attendees" (the count varies). Lookalike bullets contain only the address or addresses,
for example "a@north1ine.example, b@north1ine.example". The headline supplies the concern.

Unknown failure reasons, including configuration and invalid-draft reasons, say "The local check
didn't finish." Only a draft-read failure says "Outlook didn't let it read the draft."
When settings are unknown, every dialog uses: "If **Send Anyway** is offered and you're sure,
choose it; otherwise choose **Don't Send**, fix it and press Send." Findings on older clients
append "Open Disclosure Gate from the ribbon to see why." Size failures also append "Shorten it
or split it, then press Send." This copy makes no claim about whether the item has been sent.

Mixed results list findings first, including a failure among the bullets. They ask only if every
applicable part asks. Meetings substitute "This meeting invitation" or "this meeting invitation"
for email, use "In the location" where needed, and never advise Bcc.

The pane shows who will see it and each finding, with Show me and Remove this sentence for subject
and body findings (never private-key blocks). Ask results say "You can still send it: press Send and
choose Send Anyway." Failures show a reason and **Check again**, which runs the same local core
with the pane's settings and OCR pre-read path. Size failures show "Shorten it or split it, then
press Send." and hide Check again; edit the item and press Send. A pass says "This draft passed the local check.
Press Send to check it again and send." Pane checks retain the checked draft's fingerprint; edits
to subject, body, files, addresses or meeting location invalidate the result, show "This draft
changed since the check. Check it again before sending." and restore Check again. A new Send
supersedes the pane result. Unbound Send failure reasons, including on reopen, start "The last Send: "
and give no current hold/send assurance. This is advisory: Send always checks fresh. Nothing is
edited, deleted or sent on the add-in's own initiative.

Markdown requires Mailbox 1.15 (preview on Mac); commands and overrides require 1.14. Copy rules
are unchanged: sentence case, no exclamation marks, no em dashes, never "blocked", "violation" or
"policy breach".

## 8. Limits

Over 500,000 characters of body/location text, 1,000 subject characters, 500 recipients or
50 attachments can't be checked. The failure says it's too large to check and follows the failures
setting. Retrying unchanged content will not reduce its size; shorten or split it for a complete
check. A file over 10 MB or 200,000 extracted characters likewise follows the failures setting.

Classic Outlook for Windows uses rules only. Other clients use the model only when browser APIs,
WebAssembly SIMD and a local worker are available. If the model is missing, fails, or cannot be
ready in time, it is skipped and the rules still decide the check. A skipped model is not a failed
check. More than 400 readable sentences skips the whole model pass; rules still read all the text.
Low-confidence OCR hints use the existing shape checks only. Timing inside each Outlook client
remains to be measured live.
An input longer than the model's token window also skips the model pass, without truncating the
rule check. The delivered model reads the current sentence together with the previous one.

## 9. Timing

From the Send event to the decision: under 2 seconds for a typical email with no new attachments.
A check that cannot finish follows the failures setting. The handler uses a 4.5-second timer and
wall-clock checks. A new Send always checks again. Pre-reads and OCR are cached with identity and
byte hashes, so a second attempt can finish sooner. Unsupported or unchanged oversized files still
cannot be read. Actual startup, callback timing and end-to-end latency need live verification.

Model assets are prepared on compose and attachment-change events and cached as public static files.
Send gives cached model initialization and classification at most 1,500 ms within its existing
deadline, reserving 500 ms for the final re-read and result storage. A cold model download never
delays Send. OCR takes priority over model work in the same runtime.
Preparation also initializes a worker/session. It is reused only while that runtime survives;
the implementation does not depend on memory surviving event completion. A fresh runtime restores
and verifies the public cache and initializes again. Timeout, error or OCR preemption terminates
the worker and revokes its temporary script URLs.
