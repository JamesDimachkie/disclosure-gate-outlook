# Real mail: the CMU Enron corpus

Every synthetic test set measures mail written to be tested. These measurements use real mail: the
outside emails Enron employees sent between 1999 and 2002, from the public
[CMU Enron email corpus](https://www.cs.cmu.edu/~enron/) (`enron_mail_20150507.tar.gz`). Everything ran
on one laptop; no email text is published here, only Message-IDs, labels and outcomes.

It is 2001 trading-floor mail: much of it is personal chatter, jokes and forwarded chain letters sent
from work accounts, and all of it is plain text wrapped at about 70 columns. Expect it to be noisier
than most modern business mail.

## Files

| File | What it is |
| --- | --- |
| `enron.mjs` | The first diagnostic: a seeded sample of 3,000 outside emails from all mailboxes, through the add-in with and without the model. Counts only. |
| `enron-results.json`, `enron-sample-ids.txt` | Its result (v2.3 asked about 970, 32%; rules alone 73) and the sample's Message-IDs. |
| `gate6-enron-b.jsonl` | Gate 6: 2,000 held-out outside emails, one line each: Message-ID, whether v2.3, the v2.4 candidate and the rules alone asked, and for the 1,007 labeled emails the label. |
| `gate6-summary.json` | Gate 6 counts, intervals and bars. |
| `gate8-summary.json` | Gate 8 on the same 2,000 emails: v2.3 reading already-seen reply history more strictly. Counts only. |
| `gate9-enron-b2.jsonl` | Gate 9: a fresh 2,000 half-B emails never used before, one line each: Message-ID, whether v2.3, the calmer candidate and the rules asked, and for the 936 labeled emails the label. |
| `gate9-summary.json` | Gate 9 counts, intervals and bars. |

## How gate 6 was built

- **Split.** Outside-sent mail (sender at an `enron.com` domain, at least one recipient elsewhere,
  duplicates removed) is split by mailbox owner with `sha256("dg-enron-split-1:" + mailbox)[0] & 1`:
  half A (73 mailboxes) for development, half B (72) held out. Nothing in B was trained on, tuned on
  or looked at before gate 6 was scored.
- **Sample.** 2,000 B emails, shuffled with seed 20261024, at most 50 per mailbox.
- **As Send sees it.** Real To/Cc/Bcc; every `enron.com` domain counts as inside; quoted-printable
  remnants in the corpus decoded (Outlook decodes them before an add-in reads the body).
- **Labels.** Every email any system asked about (707) plus 300 none asked about, shuffled so the
  labelers could not tell which system asked, read in full by Claude labelers against SPEC.md:
  disclosure or not, the deciding sentence, and whether it is **serious** (could plausibly cause real
  harm: legal or commercial exposure, harm to a business relationship, a privacy harm to an
  identifiable third person, exposed credentials or account details, or a seriously inappropriate
  remark). The full definitions are in [GATE-PLAN-6.md](../../docs/gates/GATE-PLAN-6.md).
- Labelers disagree often on trivial real-mail mentions (a cold, a joke about a politician): about a
  quarter of labels are marked not confident. The serious/not-serious split is what the gate uses.

To reproduce, download the archive, rebuild half B with the split rule above (the scripts used are in
the development history), and look up each Message-ID.
