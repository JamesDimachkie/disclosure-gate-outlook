# Local development and admin setup

The v2 add-in is a static site. It does not need a check service or provider credentials.

1. From the repository root, run `npm ci`, then `npm run dev`. The existing Office localhost certificate
   must already be installed and trusted. This command does not change certificate trust.
2. Open https://localhost:3443/setup.html, or use outlook/manifest.xml for the existing test
   installation (same Id, version 2.1.0.0, Ask/Ask, PromptUser, localhost). Stop the dev server with Ctrl+C.
3. For an organization, host dist over HTTPS, then use that host's setup.html to download a
   manifest. If you host it yourself, publish the built `dist/` folder at that HTTPS address before
   using its manifest. For the public host, use the setup link in the [README](../README.md#install).
4. In Microsoft 365 admin center, use Settings > Integrated apps > Upload custom apps. Upload
   manifest.xml, assign test users and finish. Existing installations need the same Id and a
   higher version. Allow time for Microsoft's client caches and deployment propagation.
5. Test with synthetic mail in each Outlook client. RUNTIME-V2-NOTES.md lists the required live
   checks. Local tests do not establish Outlook deployment or native-client behavior.

For localhost in Outlook on the web, the September evidence showed Chrome's Local Network Access
could prevent the runtime loading. Do not change browser/security settings automatically. A public
HTTPS static deployment avoids the public-page-to-localhost route, but its actual load and failure
behavior still needs acceptance testing.

Choose Ask (default) or Hold separately for findings and failed checks. Both Ask generates PromptUser;
findings=Hold with failures=Ask generates SoftBlock, and failures=Hold generates Block. Ask outcomes
use a promptUser override on Mailbox 1.14+. Before 1.14, SoftBlock and Block installations hold
those outcomes too. Older classic runtimes that cannot recover URL settings use only the mailbox
domain and neutral, conditional instructions; the installed manifest controls the buttons.
There is no roamingSettings seed or user-editable domains fallback.

Offline verification is npm test. The suite builds first and exercises the generated classic bundle,
all four settings combinations, setup download, the static server, portable extractors and the Send lifecycle.
No online validator or hosted evaluation tool is used.
