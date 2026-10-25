# Gate pre-registrations

Each file is a verbatim copy of a decision plan committed on the original model-development branch
before any result on its test set was produced. The set authors worked in separate git worktrees;
the person making the decision
did not open a set before its plan was committed and scored it exactly once.

| Plan | Committed (original branch) | Its test set: first commit | Set frozen | First scored |
| --- | --- | --- | --- | --- |
| [GATE-PLAN.md](GATE-PLAN.md) | b8941df4, 23 Oct 18:43 PDT | everyday2 c2debbec, 18:02 | 44c63936, 18:39 | after 18:43 |
| [GATE-PLAN-2.md](GATE-PLAN-2.md) | 8b402d6b, 23 Oct 19:25 PDT | everyday3 52abee82, 19:11 | 4edfd4b2, 19:21 | after 19:25 |
| [GATE-PLAN-3.md](GATE-PLAN-3.md) | afb48657, 24 Oct 08:01 PDT | everyday4 6eaba4c1, 07:47 | 2760c033, 08:09 | after 08:09 |
| [GATE-PLAN-4.md](GATE-PLAN-4.md) | 60d9ebad, 24 Oct 09:31 PDT | everyday5 377555d2, 09:34 | a6fbb5f2, 09:42 | after 10:16 (candidate f86918b2) |
| [GATE-PLAN-5.md](GATE-PLAN-5.md) | 691fa104, 24 Oct 10:28 PDT | everyday6b bcbceb16, 10:30; everyday6a d3b864b6, 10:39 | 6b aae1a767, 10:48; 6a f5212919, 14:07; audits ab9676dc 13:41, 31dc31f3 14:12, drops 151102dc 14:13 | 14:13; reports saved by an identical re-run at 14:16 (shipped v2.3, unchanged) |

[GATE-PLAN-6.md](GATE-PLAN-6.md) records the v2.4 real-mail decision plan and its scoring-harness
addendum. The commit identifiers here refer to the original development history, which is not
included in the public repository's fresh history. Read the linked copies for the plans themselves.

Correction: GATE-PLAN-2 and GATE-PLAN-3 say they were written "before" their set "exists". The table
shows the authors had already started (and in one case frozen) their sets in separate worktrees. What
the plans guarantee is narrower and is the part that matters: thresholds, candidate and pass bar were
fixed before anyone deciding had seen the set or any score on it.
