# v2.3 training data

`v23-train.jsonl` is the exact sentence file the shipped v2.3 model was trained on: 21,149 sentences,
SHA-256 `377a639d70b5bdcf448db5dcc25cd46d48ebc9b69d8fff79c461b6bb97930b11`, the
`training.sentence_input_sha256` recorded in [`../out/labels.json`](../out/labels.json).

All of it is synthetic. AI models (Claude and GPT families) wrote every email and sentence from the
product spec's §5 definitions, with invented people, companies and numbers and `.example`
addresses. No real mail, customer records or personal data were used. Labels follow `SPEC.md` §5.

| Part | Sentences | What it is |
| --- | ---: | --- |
| Whole emails (`kind` ordinary or disclosure) | 13,814 | Two authors, three rounds; each email split into Send's sentence units, each sentence labeled |
| Contrast pairs (`kind` pair) | 3,600 | A disclosure sentence and a near-identical ordinary one |
| Look-alikes (`kind` negative) | 600 | Ordinary sentences with the surface cues of a disclosure (keys, costs, health words) |
| Single sentences (`kind` isolated) | 3,135 | An earlier hand-written sentence set, kept where its text was new |

Labels: none 16,832; personal 1,049; economics 878; negotiation 861; remark 764; access 765.

Each line has `text`, `context` (the previous sentence, empty at the start of the subject or body),
`label`, `kind` and `author`. The other fields are the authors' bookkeeping: `email` or
`id`, `source`, `index`, `subkind`, `note` (the author's reason for a label), and `origin`, the
folder in the authoring repositories it came from.

Not in this file: the emails the authors reserved for choosing v2.3's training epoch (not published),
and the retired evaluation sets in `evaluation/heldout/`, which also supplied ordinary mail for the
shipped thresholds. No sentence here repeats one from the reserved emails, and
the evaluation sets were written by other authors who never saw this data. Don't add those sets to your
training data: they are how the project's numbers were measured. `model/train/prepare.mjs
--with-shipped-data` mixes this file into your own training data; see
[docs/ADAPTING.md](../../docs/ADAPTING.md).
