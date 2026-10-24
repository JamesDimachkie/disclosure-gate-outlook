# Disclosure Gate for Outlook: held-out evaluation everyday6b

Author: OpenAI **gpt-6-luna**. Authored 24 October 2026.

## Custody and method

This is a frozen held-out set. Never tune rules or models on these cases or their per-case results. Freeze the file hash before scoring. All people, organizations, messages, and domains are invented; every address uses `.example` or `.test`. There are no attachments or large recipient lists. Each email is authored as literal text; the serializer only places those literals into runner-shaped draft objects.

Read: `LANE-BRIEF.md`, `AGENTS.md`, `SPEC.md`, `evaluation/heldout/README.md`, and `evaluation/heldout/run.mjs`. No other project material was read.

## Composition

The set contains 60 stops, with 12 each for §5.1 premises security, §5.4 personal details, §5.5 internal economics, §5.6 negotiation position, and §5.7 remarks. All 200 passes have `category_expected: none`: 100 ordinary outside emails across 100 distinct settings, plus 100 safe-side boundary emails.

| category_expected | stop | prompt | pass | Total |
| --- | ---: | ---: | ---: | ---: |
| secrets | 12 | 0 | 0 | 12 |
| payment | 0 | 0 | 0 | 0 |
| government_id | 0 | 0 | 0 | 0 |
| personal | 12 | 0 | 0 | 12 |
| economics | 12 | 0 | 0 | 12 |
| negotiation | 12 | 0 | 0 | 12 |
| remark | 12 | 0 | 0 | 12 |
| lookalike | 0 | 0 | 0 | 0 |
| exposed_list | 0 | 0 | 0 | 0 |
| file | 0 | 0 | 0 | 0 |
| none | 0 | 0 | 200 | 200 |
| **Total** | **60** | **0** | **200** | **260** |

## Stop hardness dimensions

Dimensions overlap. Each stop carries its own labels.

| Dimension | Count |
| --- | ---: |
| Implicit or indirect | 37 |
| Buried in quoted history | 9 |
| Numbers without labels | 9 |
| Casual, misspelled, abbreviated, or regional usage | 28 |
| Hedged or mixed with ordinary content | 37 |

## Boundary passes

Every boundary pass records its specific safe-side clause in its `boundary` field and quotes the deciding sentence in the one-line SPEC rationale.

| SPEC section | Boundary passes |
| --- | ---: |
| §5.1 Physical access or premises | 12 |
| §5.4 Personal details sent to the person, parent, guardian, or pet owner | 18 |
| §5.5 Customer-facing prices, quotes, invoices, terms, or discounts | 26 |
| §5.6 Offers and proposals actually made to the recipient | 22 |
| §5.7 Criticism of work, direct disagreement, or firm work requests | 22 |
| **Total** | **100** |

## Message length and placement

Body length includes quoted history. Word counts: minimum 23, median 31, mean 34.7, maximum 105. Placements are 250 body cases, 10 quoted-history cases, and no subject-only cases.

## Industries and settings

The scenarios span construction, law, marketing, SaaS, accounting, healthcare administration, real estate, manufacturing, logistics, education services, hospitality, retail, food distribution, arts and crafts, animal care, horticulture, tourism, community events, repair services, and public-facing organizations. The ordinary mail covers 100 distinct settings, including class bookings, delivery questions, design proofs, maintenance requests, purchasing, venue logistics, and event scheduling.

## Hardest calls

The hardest stops rely on context rather than a label: the worksheet pairing “in at 31” with “out at 48”; costs expressed as a fraction of a customer quote; treatment details embedded in staffing decisions; and access failures described in maintenance notes. The hardest safe-side calls are offers that state a concrete price or term directly to the recipient: they are customer-facing proposals already made, not private room to concede. Each case is retained only when its deciding sentence meets the cited SPEC rule or safe-side exclusion.

## Limits

This is a synthetic, single-author set with deliberately varied wording and settings. It does not measure real-mail prevalence or production performance, and it has no independent human label adjudication. It evaluates the text and recipient contract only, not Outlook-host behavior, delivery, latency, model quality, or user comprehension.
