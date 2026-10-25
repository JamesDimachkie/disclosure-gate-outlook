# Troubleshooting

Problems an admin or developer is likely to meet, what causes them and what to do. Entries marked
*seen live* happened during testing in Outlook on the web
([evidence](../outlook/RUNTIME-V2-NOTES.md#live-evidence-outlook-on-the-web-24-october-2026)); the
others follow from Microsoft's documented behavior or this add-in's design.

## Installing and updating

**The add-in doesn't appear, or an older version keeps running after an update.** *Seen live.*
Microsoft delivers centrally deployed add-ins on its own schedule, documented as up to 24 hours; in
testing, an updated manifest was still not served a day after upload. An update must keep the same
add-in Id and carry a higher version (the setup page's *Version and add-in Id* section). To pick up a
delivered update sooner: in Outlook on the web, sign out and back in; in classic Outlook for Windows,
close Outlook and clear the Office add-in cache (the contents of `%LOCALAPPDATA%\Microsoft\Office\16.0\Wef\`,
per Microsoft's [cache instructions](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/clear-cache)).

**Upload is rejected in the admin center.** Generate the manifest from the setup page rather than
editing it by hand, and publish the files at the HTTPS address you entered there before uploading:
the manifest points every page and icon at that address.

## When the sender presses Send

**"Taking longer than expected", then "unavailable" with Send Anyway / Try Later.** *Seen live.*
Outlook could not load the add-in's files in time: the host is down or unreachable, its certificate is
not trusted, or (local development in Chrome) the browser blocked a public page from reaching
`localhost` (see [Local development](#local-development)). With failures set to Ask the sender can
still send; with Hold, the item stays unsent until the add-in loads. Open the host's `runtime.js` in a
browser on an affected computer to check it is reachable.

**Mail to one of our own domains is treated as outside.** Only the sender's mailbox domain and the
*Extra internal domains* listed on the setup page count as inside, by exact match. Add the domain,
download a new manifest with a higher version and update the installation.

**A real partner is flagged as a lookalike of our domain.** Add the partner to *Trusted outside
domains*. That only skips the lookalike question; mail to them is still checked like any outside
mail.

**Settings seem ignored: extra internal domains count as outside, or mail is held where you chose
Ask.** The runtime could not read its settings from the installed manifest, so it falls back to the
safest reading: the mailbox domain is the only inside domain, findings and failures hold, and the
dialog's instructions are conditional. Regenerate the manifest from the setup page and update the
installation; do not edit the settings in the URLs by hand.

**There is no Review button in the dialog.** The client is older than Mailbox requirement set 1.14.
The dialog names the *Guardcell* button on the compose ribbon instead, which opens the same pane.

**The model doesn't seem to catch what it should.** Classic Outlook for Windows runs the rules only,
by design. Elsewhere the model is skipped when it is not ready in time (*seen live*: one first Send,
before the model files were cached, went out on rules only), the email has more than 400 readable
sentences, or the browser lacks what it needs. A skipped model never stops the rules. Check the setup
page's *On-device model* is On.

**An email was sent without any check.** Expected in these cases: Outlook on phones; items whose
sensitivity label or IRM turns off add-in access; mail sent by other apps, scripts or Exchange rules;
and, unless the policies in the README's
[Make Hold settings work everywhere](../README.md#make-hold-settings-work-everywhere) are set, mail
sent while Outlook started offline, before the add-in loaded on Mac, or through Simple MAPI on Windows.

## Attachments and pictures

**A file "couldn't be checked".** It was encrypted or password-protected, a format the add-in does not
read (for example `.doc`, `.xls`, `.ppt`, `.rtf`, archives), larger than 10 MB, or could not be read
completely. The add-in never passes a file on a partial read. The *When it can't check* setting decides
whether the sender can confirm and send. Saving the file as `.docx`, `.xlsx`, `.pptx` or a text PDF
usually fixes it.

**An attached picture asks the sender to look at it.** On-device OCR could not read it confidently
and found nothing; photos and logos often do this. Inline pictures in the body are ignored in that case.
Text it does read in a picture is checked like any other text.

**A picture was still being read at Send.** Large scans take time. That counts as a check that didn't
finish and follows the *When it can't check* setting; pressing Send again a moment later usually finds
the reading done.

## The review pane

**"That sentence couldn't be found in the draft any more."** The draft changed after the check, or
the sentence was already removed. The pane drops cards whose sentence is gone; press *Check again*.

**Remove deleted only part of what I expected.** Remove deletes exactly the flagged sentence and
nothing else, so formatting, the signature and quoted history stay intact. Edit anything around it by
hand.

## Local development

**Send hangs on "taking longer" in Outlook on the web with a `localhost` add-in.** *Seen live.*
Chrome's Local Network Access protection stops the public Outlook page loading scripts from
`https://localhost:3443` until it is allowed for `https://outlook.cloud.microsoft`. Allow it in the
site's permissions, or test against a public HTTPS host. Earlier testing recorded that a browser-blocked
runtime could let mail go out despite Block, so do not rely on a blocked localhost add-in to hold mail.

**`npm run dev` fails with `EADDRINUSE`.** Something else is already serving port 3443. If it is your
earlier `npm run dev`, stop it with Ctrl+C in that terminal. Otherwise ask its owner to free the port.

**The browser or Outlook rejects `https://localhost:3443`.** The development certificate is missing,
expired or not trusted. Set it up with Microsoft's
[office-addin-dev-certs](https://github.com/OfficeDev/Office-Addin-Scripts/tree/master/packages/office-addin-dev-certs);
the dev server only uses an existing certificate and never changes trust.

**Trying the pane without Outlook.** Open `taskpane.html?preview=held` (also `idle`, `checking`,
`attachment`, `clear`, `unavailable`; add `&theme=dark`). It runs the real check on a fictional email
with the release defaults; Remove and Check again work on that email only.
