# Gate 7: a larger sentence model (written 24 October 2026, before any 32M model is trained)

**Why.** Gate 6 kept v2.3: the v2.4 candidate asked far less on real mail but caught 37 serious real
disclosures against v2.3's 61. On the development mailboxes, four 17M training recipes (r1–r4) and v2.3
all lie on the same catch-versus-ask curve, which suggests the 17M encoder, not the data, limits how
well real-mail nuance (personal details, remarks, negotiation) is told apart. James, 24 Oct: a missed
serious disclosure matters far more than an extra "are you sure?" (one click), and "there's no reason
we should not be able to create something better than v2.3".

**Candidate.** v2.5: Ettin-32M (`jhu-clsp/ettin-encoder-32m` at revision 1b8ba064), trained from the
base checkpoint with the public pipeline on the published v2.3 sentences plus the half-A real mail
used for v2.4 r2. Thresholds are chosen on the half-A development mailboxes only, recall-first: the
quietest setting that catches at least as many serious development disclosures as v2.3 does at its
shipped thresholds (24 of 28). The candidate, its thresholds and its development numbers are committed
before it is scored on anything below.

**Test data reused, disclosed.** Enron half B (the gate 6 sample of 2,000) and `everyday7` were each used
once to decide gate 6. No training or threshold choice used them. They are reused here, once, for a
candidate that has never been evaluated on them. Emails the candidate asks about that gate 6's
labelers did not label are labeled with the same brief, blind to which system asked, before scoring.

**Ship v2.5 only if all hold (otherwise v2.3 stays):**
1. Enron B: v2.5 catches at least as many serious disclosures as v2.3 (61) and asks about at least 25%
   fewer emails than v2.3 (at most 525 of 2,000).
2. `everyday7`: v2.5 catches at least 105 of 120 and questions at most 53 of 400 (v2.3: 108, 53).
3. Timing: in Outlook on the web, the model finishes a typical email (the runbook's model tests)
   within its 2.5-second share of Send, with the model preloaded at compose as v2 does.

**Reported, whatever it shows:** all of the above with 95% intervals, per category, and v2.3 alongside.
