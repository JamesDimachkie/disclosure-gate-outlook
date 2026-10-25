# Gate 6: v2.4 on real mail (written 24 October 2026, before any v2.4 candidate or `everyday7` exists)

**Why.** On 3,000 real outside emails sent by Enron employees (CMU Enron corpus), v2.3 asked about 970
(32%); rules alone asked about 73 (2.4%). On the synthetic blind set `everyday6` it asked about 2.3%.
About 60% of the sentences it flagged were in quoted or forwarded text, and flagged sentences scored a
median 1.6 to 2.1 times their threshold, so the gap is in the model, not only the thresholds. James,
24 Oct: "adjust and make sure it's robust and ready."

**Data split, fixed now.** Enron outside-sent mail is split by mailbox owner with
`sha256("dg-enron-split-1:" + mailbox)[0] & 1`: half A (73 mailboxes, 17,013 emails) is development;
half B (72 mailboxes, 10,478 emails) is held out. Nothing from B is trained on, calibrated on, labeled
or looked at before this gate's scoring. The earlier 3,000-email diagnostic sample mixed both halves;
only its published totals are used.

**Candidate.** v2.4 may change training data (including labeled sentences from half A), weights and
thresholds. Its weights, thresholds and development numbers are committed before it is scored on B or
`everyday7`. No change to v2.4 or to the sets after any score is seen.

**Sets.**
1. `everyday7`: two halves by authors from two companies who wrote no training data
   (claude-sonnet-5-5 and gpt-6-astra), 60 disclosures (12 per category) and 200 ordinary outside
   emails each, as hard as `everyday6`, and at least 40 of each half's 100 everyday emails written
   messy the way real mail is (banter, forwards, long quoted chains, venting, fragments, footers).
   Each half's labels are audited by the other company's model before scoring; disputed cases are
   dropped unless the author concedes.
2. Enron B: 2,000 outside emails drawn with a fixed seed, at most 50 per mailbox. v2.3, v2.4 and rules
   alone each run once. A labeler from a different company than the one that labeled half A
   (claude-opus-5-5) labels, against SPEC.md and without knowing which system flagged what, every
   email any of the three asked about plus 300 emails none asked about: does the email disclose
   something SPEC §5 flags, and which sentence.

**Reported, whatever it shows.** `everyday7`: caught and questioned with 95% Wilson intervals, per
category and per author, for all three. Enron B: share of emails asked about; needless questions
(asked, labeled no disclosure) as a share of all 2,000; labeled disclosures caught; all with
intervals.

**Bar for shipping v2.4 (all must hold).**
- `everyday7`: at least 75% of disclosures caught and at most 5% of ordinary emails questioned.
- Enron B: v2.4 asks about at most half as many emails as v2.3, and its needless questions are at
  most 10% of the 2,000.
- Enron B: v2.4 catches at least 80% of the labeled disclosures that v2.3 catches.

If v2.4 fails, v2.3 stays, and the README and landing page lead with its real-mail numbers next to
the synthetic ones. Either way, everything above is published.

## Addendum: scoring harness (24 October 2026, before any v2.4 candidate is frozen or anything is scored on B)

- **Sample.** `gate6-B-2000.jsonl`: 2,000 outside emails from half B, shuffled with seed 20261024 and
  capped at 50 per mailbox (71 mailboxes), SHA-256 `a80e00f0ae9f9676…`. Only its Message-IDs will be
  published.
- **What each system sees.** Each email as Send would see it: sender, its real To/Cc/Bcc, subject and a
  plain-text body; every `enron.com` domain counts as inside. Quoted-printable remnants left in the
  corpus (`=` soft line breaks and `=XX` escapes, which Outlook decodes before an add-in reads the body)
  are decoded identically for all three systems. The product code is whatever dg-email `main` holds
  when the candidate is frozen, including any change to how text is split for the model; v2.3 is
  scored on that same code.
- **Labels.** The labeler reads each selected email in full and answers: does it disclose anything
  SPEC.md §5 flags (any category, including passwords and other rule categories), and if so which
  sentence and category. Union of emails asked about by any system, plus 300 drawn with seed 6 from
  the emails none asked about, shuffled together so the labeler cannot tell which system asked.
- **A question is needless** when the labeler finds no SPEC §5 disclosure in the email. **A labeled
  disclosure is caught** by a system when it asks about that email.

## Amendment 2: judge real mail by serious disclosures (24 October 2026, before any v2.4 candidate is frozen or anything is scored on B)

**Why.** James, 24 Oct: "as long as the disclosures are not harmful or seriously inappropriate, it's ok
if it slips. i'm only concerned about risk minimization." Development work on half A showed the third
bar above was badly posed: v2.3 catches many disclosures only because it asks about roughly a third of
real mail, so a model that asks far less fails "80% of what v2.3 catches" even when it is the better
model at any matched ask rate. Labelers also disagree heavily on trivial real-mail mentions (a cold, a
joke about a politician), which no model can score cleanly against. Half B is untouched; this
amendment is made without any information from it.

**Severity.** For every email labeled as a disclosure, the labeler also rates it serious or not.
Serious: if the email reached the wrong eyes outside the company, it could plausibly cause real harm —
legal or regulatory exposure, financial loss or a weakened commercial position (internal costs,
margins, negotiation limits), harm to a client, partner or colleague relationship (a disparaging remark
about an identifiable business contact, colleague or company), a real privacy harm to an identifiable
third person (their health, family, legal or HR situation), exposure of credentials, access or
financial account details, or a remark seriously inappropriate to put in writing (slurs, sexual or
degrading content about an identifiable person). Not serious: the sender's own minor ailments or
everyday family news to a friend, mild jokes or jabs at public figures or sports teams, generic
venting, chain-letter or news content about strangers or public figures. The labeler reads every email
in full.

**Bar 3 is replaced by:** on Enron B, v2.4 catches at least 80% of the serious disclosures that v2.3
catches at its shipped thresholds. Bars 1 and 2 (everyday7; asks at most half of v2.3's and needless
questions at most 10% of the 2,000) are unchanged.

**Also reported:** catches of all labeled disclosures; serious catches of each system; and a
matched-ask comparison (v2.3 with its thresholds scaled, by a single quantile on B's own scores without
labels, so that it asks about as many emails as v2.4).
