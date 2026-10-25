# everyday7b: cross-family label audit

Auditor: Anthropic `claude-opus-5-5` (Claude Code subagent). Date: 2026-10-24. Author audited: OpenAI gpt-6-astra.

## What was read

`SPEC.md` (product spec v2, in full), `evaluation/heldout/README.md`, `evaluation/heldout/everyday7b/README.md` and every case in `evaluation/heldout/everyday7b/cases.jsonl` (all 260: recipients, subject and the whole body, quoted history and footers included). Cases were printed for reading with a small script kept outside the repository. Nothing else was opened. No runner, validator, test, model or rule code was run, and nothing has been scored. `cases.jsonl` was not modified.

## Result

No disputes. Every label agrees with the SPEC text.

| Label | Cases | Agree | Dispute |
| --- | ---: | ---: | ---: |
| stop:secrets (§5.1 physical access) | 12 | 12 | 0 |
| stop:personal (§5.4) | 12 | 12 | 0 |
| stop:economics (§5.5) | 12 | 12 | 0 |
| stop:negotiation (§5.6) | 12 | 12 | 0 |
| stop:remark (§5.7) | 12 | 12 | 0 |
| pass (100 ordinary, 100 boundary) | 200 | 200 | 0 |
| **Total** | **260** | **260** | **0** |

`audit.jsonl` carries one line per case; 63 lines have a `note` recording a close call or a hardest-call judgment.

## Structural checks

- All 260 cases send from `tavi@oxbriar.example` to a single `correspondence@lumenquay.test` recipient. That domain is outside under §4 and is not a §5.8 lookalike of `oxbriar` (different name, not a repeat under another ending).
- All addresses use `.example` or `.test`. No case has an attachment, Cc or Bcc.
- Every opening greeting names the To display name's first name (`Rell,` to Rell Vantos; `Pella,` to Pella Veynor and so on), so no §5.8 greeting-to-someone-else finding arises.
- No pass carries a §5.10 marker: all footers are addressee or company-confidential disclaimers, which §5.10 excludes.

## Disputes

None.

## Author's hardest calls

| Pair | Judgment |
| --- | --- |
| -008 stop vs -226 pass | Agree with both. -008's sentence itself says the camera recorder is off between 1 and 5 (§5.1 security gap); -226 gives public opening hours only. |
| -025, -028, -031 stop vs -237, -243 pass | Agree with all. The stops define the figure as our own spend (or "what we carried", §5.5 verbatim) in the same or preceding sentence; the passes expressly label figures as charges to the recipient. |
| -017 stop vs -183 pass | Agree with both. -017's pay figure needs the preceding sentence, which SPEC §8 says the model reads; -183 is pay written to the person it concerns (§5.4 exception). |
| -037 stop vs -174 pass | Agree with both. -037 holds a concession in reserve ("I won't start there"); -174 actually offers it. |
| -049, -054 stop vs -207, -216 pass | Agree with all. The stops target named people, not work; -207 and -216 swear at a layout and merged cells. -054 is the softer of the two remark stops but still calls a person untrustworthy. |

## Notable close calls (accepted)

- **-033 (economics)** is the weakest stop: "the stems cost us less than the ribbon charge on your invoice" gives an upper bound rather than a figure. It still states the sender's own input cost against a known amount, which §5.5 "own costs" covers.
- **-014 (personal)**: "Jorren's sorting the divorce papers" could in principle be clerical work; in a landscape-design note the natural reading is his own divorce.
- **-037 to -048 (negotiation)**: every recipient is framed as an outside adviser. SPEC §4 and §5.6 give no adviser exception, so the strategy is still disclosed to an outside recipient. Under ask-first these would be knowing Send Anyway cases, which does not change the label.
- **-004, -016, -028, -040, -052 (quoted)**: deciding sentences sit eight levels deep in quoted history; §5 reads quoted text, so placement does not change the label.
- **-181 to -198 (own details, parent, guardian)**: the exception rests on the To display name. The address is the same shared-looking `correspondence@` mailbox used throughout the set. SPEC §5.4 does not consider mailbox type, so the labels stand, but a stricter reading of "written to that person" would make these weaker controls than they appear.
- **-199, -200, -251 to -260 (pets)**: animal health is outside §5.4 (an identifiable person) regardless of the owner exception, so these are doubly safe.

## Weakest point of this audit

It is a single-reader semantic judgment on synthetic mail. It confirms that each label follows the SPEC text; it does not measure how ambiguous these sentences would be to other readers. The set's uniform sender, recipient domain and role-shaped mailbox are by design and limit what it can say about recipient handling.
