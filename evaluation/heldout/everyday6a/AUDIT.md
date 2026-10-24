# everyday6a label audit

Auditor: OpenAI **gpt-6.1-sol**. Date: **24 October 2026**.
Checkout: the `dg-email-gate8a` worktree, branch `lane/everyday6a`.
Branch: `lane/everyday6a`.

**Result: 258 agree, 2 dispute.** All 60 authored stops retain their stated category. Two ordinary passes should be `stop:lookalike` because of their recipients. The 100 boundary passes retain their labels.

## Scope and custody

Read `SPEC.md` fully first, then `evaluation/heldout/README.md`, `evaluation/heldout/everyday6a/README.md`, and all 260 records in `evaluation/heldout/everyday6a/cases.jsonl`. Every subject and complete body, including quoted history, was reviewed, together with the recipient fields, attachments, rationale and annotations. The two disputed records were reread in full.

Only those four source files were opened. No prior project memory, other held-out set, implementation, authoring batch, serializer, validator, runner, test, model or rule source was consulted. No checker, detection rule, model inference, runner, repository validator or test was executed. Small JavaScript helpers printed source records, serialized the manually authored audit judgments, and checked the audit artifacts' structure and counts; they did not classify email content or apply detection patterns. Git commands inspected checkout/commit metadata and committed only the two deliverables.

Source `cases.jsonl` SHA-256, matching the set README:
`c1748ca0b20b3403a61100fc4c0a781ab3a77e41e91d5f2da163062289a5aa98`.

The audit uses the draft's sender domain as its supplied mailbox-domain context, consistent with the permitted schema README; it does not infer any other mailbox or trusted domains. All supplied recipient addresses are outside by exact domain under §4, all email addresses use `.example` or `.test`, and every attachments array is empty. Recipient entries have a checkable address and are supplied as `kind: person`; collective display names alone are not evidence of an Outlook distribution-list entry. No attachment contents or future/separately sent documents were assumed to exist in the draft.

Both disputed addresses remain outside under §4. Outside status does not exempt them from §5.8's lookalike check. No trusted outside-domain exception is supplied. The invented `homeuser-mail` name is not one of the well-known mail providers exempted by §5.8. This finding contradicts the set README's claim that there are no lookalike domains.

## Counts by current label

| Current label | Agree | Dispute | Total |
| --- | ---: | ---: | ---: |
| stop:secrets | 12 | 0 | 12 |
| stop:personal | 12 | 0 | 12 |
| stop:economics | 12 | 0 | 12 |
| stop:negotiation | 12 | 0 | 12 |
| stop:remark | 12 | 0 | 12 |
| pass | 198 | 2 | 200 |
| **Total** | **258** | **2** | **260** |

Among current passes: boundary 100 agree / 0 dispute; ordinary 98 agree / 2 dispute.
If both proposals are accepted, the labels become 62 stops and 198 passes. This audit changes no source label.

Audit-artifact checks confirmed 260 parseable records in source ID order, the exact eight required fields, unchanged current labels, the two listed proposed changes only, count agreement, and explicit notes for all 17 README close-call cases. The source hash still matches the frozen value above.

## Disputes

| ID | Current | Proposed | Exact evidence | SPEC | Reason |
| --- | --- | --- | --- | --- | --- |
| everyday6a-166 | pass | stop:lookalike | From: `carol.finch@homeuser-mail.example`; To: `denise.walker@homeuser-mail.test` | §4; §5.8, Lookalike domain, item 2 | The outside recipient repeats the inside domain name `homeuser-mail` under a different ending, exactly the stated lookalike condition. The harmless book-club text does not override a recipient finding. |
| everyday6a-243 | pass | stop:lookalike | From: `mike.rowan@homeuser-mail.example`; To: `chloe.barnes@homeuser-mail.test` | §4; §5.8, Lookalike domain, item 2 | The outside recipient repeats the inside domain name `homeuser-mail` under a different ending, exactly the stated lookalike condition. The harmless property-management text does not override a recipient finding. |

These are recipient-only findings: no prose sentence is disputed. In `audit.jsonl`, the `sentence` field records the exact To address for each dispute; the corresponding reason identifies the comparison with the sender's domain.

## Explicit judgments on every README close call

Each judgment below is also recorded in the case's `note` in `audit.jsonl`.

| Case | Verdict | SPEC | Judgment |
| --- | --- | --- | --- |
| 028 | agree | §5.5 | The “fat” available to absorb an extra drainage run discloses a contingency or margin cushion. No number is required for that disclosure; the sentence does more than name a budget line. |
| 011 | agree | §5.1 | In the back-door entry context, “the one” taped inside the gas meter box denotes the concealed key. |
| 035 | agree | §5.5 | “18 points on this one,” explaining an absorbable extra site visit, denotes margin. |
| 032 | agree | §5.5 | “We make” compares profit on labour with profit on materials; relative profit is within the ratio provision. |
| 025 | agree | §5.5 | The glass cost is disclosed as a share of the sender's quoted price. |
| 017 | agree | §5.4 | “On 54” and asking for 60 “at his review” establish current and requested pay in context. |
| 024 | agree | §5.4 | “8k on top at year end,” compared with Lisa receiving nothing, describes identifiable bonus outcomes. |
| 040 | agree, note | §5.6 | “Would sign ... if it came to it” reveals a conditional fallback on the rate. Accept as a position disclosure, while recognising the boundary with a present offer. |
| 042 | agree | §5; §5.6 | Calling the terms a “bargaining chip” explicitly reveals strategy. Sending it to the counterparty and leaving it in quoted history do not exempt it. |
| 056 | agree | §5.7 | “Pompous windbag” insults the architect personally; the exempt drawings clause does not cancel it. |
| 057 | agree | §5.7 | The wall-with-a-grudge comparison disparages the named company's finance desk beyond a factual complaint about work or response times. |
| 006 | agree | §5.1 | The Wi-Fi password is actually supplied. Friendly framing and intentional sharing do not exempt it. |
| 112 | agree, note | §5.4 | A holiday is a stated scheduling reason, but supplies none of the sensitive personal matters described in §5.4. |
| 129 | agree | §5.4 | Ben's bereavement and compassionate leave are written only to Ben, the person they concern. |
| 142 | agree | §5.1 | The alarm stays live during testing; neither a code nor a security gap is disclosed. |
| 105 | agree | §5.1 | The gate code is expressly withheld; the unit number and opening hours do not provide it. |
| 158 | agree | §5.10 | The request not to forward the personal link is explicitly exempt. The actual draft includes no link or credential. |

## Other accepted boundaries

- **143, §5.1:** Agree with `pass`, but qualify the author's explanation. SPEC has no blanket exemption for public Wi-Fi codes. This email supplies neither a code nor a security gap; references to posted connection instructions are safe on that basis.
- **078, 106, 140 and 189, §5.1:** Key return or staffed collection/sign-out is ordinary logistics. These messages do not identify an existing concealed spare key.
- **103, §5.1:** A guest barrier operating automatically on arrival is an ordinary access arrangement; no broken or deliberately unsecured barrier is stated.
- **149 and 151, §5.4:** Role and site transfers are ordinary professional facts without a disciplinary or other sensitive employment cause.
- **159, §5.6–§5.7:** The alternative range is proposed directly to the supplier. No reserve position is revealed, and the criticism targets the proposal.
- **162 and similarly addressed collective notices, §4:** Accept the supplied `kind: person` representation with checkable addresses. A real distribution-list entry would need a different §4 assessment; a plural display name alone does not establish one.
- **236, §5.4:** The single delivery address appears in prose, not a list, table or form pairing people with sensitive details; none of the other personal categories is disclosed.
- **254, §5.5:** Gross money raised at an event is not a disclosure of costs, margin, profit, contingency or an internal budget.
- **259, §5.4:** Requesting dates and a title for an unnamed former employee supplies no identifiable sensitive employment matter.

The remaining interpretive limits are recorded as accepted notes, especially 028, 035, 040, 057 and 112. These are text-and-SPEC judgments before scoring, not evidence about implementation behaviour or measured difficulty.
