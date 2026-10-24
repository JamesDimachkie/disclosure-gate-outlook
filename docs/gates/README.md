# Gate pre-registrations

Each file is a verbatim copy of a decision plan committed in the model lane before any result on its
test set was produced. The set authors worked in separate git worktrees; the person making the decision
did not open a set before its plan was committed and scored it exactly once.

| Plan | Committed (model lane) | Its test set: first commit | Set frozen | First scored |
| --- | --- | --- | --- | --- |
| GATE-PLAN.md | b8941df4, 23 Oct 18:43 PDT | everyday2 c2debbec, 18:02 | 44c63936, 18:39 | after 18:43 |
| GATE-PLAN-2.md | 8b402d6b, 23 Oct 19:25 PDT | everyday3 52abee82, 19:11 | 4edfd4b2, 19:21 | after 19:25 |
| GATE-PLAN-3.md | afb48657, 24 Oct 08:01 PDT | everyday4 6eaba4c1, 07:47 | 2760c033, 08:09 | after 08:09 |
| GATE-PLAN-4.md | 60d9ebad, 24 Oct 09:31 PDT | everyday5 377555d2, 09:34 | a6fbb5f2, 09:42 | after 10:16 (candidate f86918b2) |

Correction: GATE-PLAN-2 and GATE-PLAN-3 say they were written "before" their set "exists". The table
shows the authors had already started (and in one case frozen) their sets in separate worktrees. What
the plans guarantee is narrower and is the part that matters: thresholds, candidate and pass bar were
fixed before anyone deciding had seen the set or any score on it.
