# Local development and admin setup

The v2 add-in is a static site. It does not need a check service or provider credentials.

1. From this worktree, run npm ci, then npm run dev. The existing Office localhost certificate
   must already be installed and trusted. This command does not change certificate trust.
2. Open https://localhost:3443/setup.html, or use outlook/manifest.xml for the existing test
   installation (same Id, version 2.0.0.0, Ask/Ask, PromptUser, localhost). Stop the dev server with Ctrl+C.
3. For an organization, host dist over HTTPS, then use that host's setup.html to download a
   manifest. The planned GitHub Pages host is a default configuration, not a completed deployment.
4. In Microsoft 365 admin center, use Settings > Integrated apps > Upload custom apps. Upload
   manifest.xml, assign test users and finish. Existing installations need the same Id and a
   higher version. Allow time for Microsoft's client caches and deployment propagation.
5. Test with synthetic mail in each Outlook client. RUNTIME-V2-NOTES.md lists the required live
   checks. No live mailbox send, manifest upload or publication was performed by this lane.

For localhost in Outlook on the web, the September evidence showed Chrome's Local Network Access
could prevent the runtime loading. Do not change browser/security settings automatically. A public
HTTPS static deployment avoids the public-page-to-localhost route, but its actual load and failure
behavior still needs acceptance testing.

Choose Ask (default) or Hold separately for findings and failed checks. Both Ask generates PromptUser;
any Hold generates Block. Ask outcomes need Mailbox 1.14+ to override Block. Before 1.14, classic
cannot recover URL settings; it uses only the mailbox domain and conservative hold/ribbon copy.
There is no roamingSettings seed or user-editable domains fallback.

Offline verification is npm test. The suite builds first and exercises the generated classic bundle,
all four settings combinations, setup download, the static server, portable extractors and the Send lifecycle.
No online validator or hosted evaluation tool is used.
