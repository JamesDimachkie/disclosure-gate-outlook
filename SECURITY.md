# Security

Guardcell for Outlook runs entirely inside Outlook. It makes no network requests except loading
its own static files and Microsoft's Office.js. The result of a check lives in the item's session
data for the compose session only. The optional sentence model caches its public model/runtime
assets separately. Email text, tokens and model predictions never enter that persistent asset cache.

## Reporting a vulnerability

Please report security issues privately through GitHub:
https://github.com/JamesDimachkie/guardcell-outlook/security/advisories/new

Include the Outlook client and version, both settings (Ask or Hold), and the smallest synthetic email
that shows the problem. Please don't include real mail or real secrets. Ways to get an email past the
check without a sender choosing Send anyway are treated as the most serious class of issue.

## Known limits

- Outlook on iOS and Android doesn't run Send checks, and mail sent by other apps, scripts or
  services isn't checked.
- Meeting invitations and updates are checked from the organizer form. On web/new Outlook, embedded
  meeting forms and meeting forwards don't trigger OnAppointmentSend; a separate window is required.
  Meeting forwards and attendee responses are outside product coverage on all clients.
- AppointmentCompose has no resources reader. Room addresses exposed by enhancedLocation and all
  returned attendees count under the usual domain rules, but unreturned resources and personal contact
  groups used as locations aren't visible. Outlook recipient APIs also have client-specific return
  limits; the add-in cannot expand distribution lists or discover recipients omitted by the host.
- Outlook doesn't run add-ins on items whose sensitivity label or IRM template turns off programmatic
  access, so those are sent unchecked.
- Exchange transport rules that forward, redirect or copy mail, and server-side signatures, act after
  the check.
- Ask/Ask is the default. A sender who confirms a concern can knowingly send without changing
  the item. This is intentional, not a prevention guarantee.
- Findings=Hold with failures=Ask installs SoftBlock: findings hold, while running checks that
  fail ask through a promptUser override on Mailbox 1.14+. If the add-in cannot load, Outlook offers
  Send Anyway / Try Later, as it does for Ask/Ask's PromptUser. Failures=Hold installs Block,
  including on load failure. See [Microsoft's Smart Alerts modes](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/onmessagesend-onappointmentsend-events).
  Additional Outlook policies in README, "Make Hold settings work everywhere", cover offline/load/
  Simple MAPI cases; they do not turn failures=Ask into a load-failure hold.
- Before Mailbox 1.14, ask outcomes in SoftBlock or Block installations hold too. Unreadable,
  malformed or duplicate manifest settings use only the mailbox's own domain and conditional
  dialog instructions. The installed mode still governs actual buttons; settings cannot be
  recovered from roaming settings. Verify the promptUser override from SoftBlock on a live client.
- September v1 observed a silently browser-denied runtime could send despite Block, whereas a
  refused connection held. This unresolved host behavior needs current live-client verification.
  The 24 October sideloaded v2 Ask/Ask (PromptUser) test did verify a stopped dev server: Outlook
  offered Send anyway / Try later after 9.3 seconds, and Try later kept the draft. That does not
  resolve the earlier Block/browser-denial case; see [live v2 evidence](outlook/RUNTIME-V2-NOTES.md#live-evidence-v2-manifest-outlook-on-the-web-24-october-2026).
- The pane's Check again is advisory. Send always runs a fresh check and re-reads a Clear
  fingerprint. Pane results are invalidated after draft edits; unbound failure reasons are labelled
  as the last Send. Size failures require an edit and hide Check again. Dialogs omit secret values;
  the pane intentionally shows the actual sentences.
- Rules catch the formats and phrasings listed in SPEC.md and miss others. A local sentence
  model, on unless IT turns it off, adds physical access, personal details, internal costs/economics,
  negotiation and remarks on capable browser runtimes. It reads each sentence with the previous sentence as context.
  Classic Outlook for Windows uses rules only;
  absent, late, failed or over-limit model passes are skipped, never turned into failed checks.
  Measured model accuracy is in [README: How well it works](README.md#how-well-it-works).
- An inside address that reaches outsiders (a Microsoft 365 group with guests, or a list Outlook
  reports as a person) counts as inside; the add-in can't see its members.
- On classic Outlook before Mailbox 1.14 only the mailbox's own domain is inside, so mail to the
  organization's other domains is treated as outside there.
