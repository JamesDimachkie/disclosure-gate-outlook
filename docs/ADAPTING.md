# Adapting the sentence model to your organization's mail

Guardcell ships one on-device sentence model for everyone. This guide is for the IT or ML team
deploying the add-in who want that model to fit their own mail: fewer needless questions on what
their people ordinarily write, or catches for disclosures phrased their own way. Everything here
runs on your own machines, and the result ships in your own build of the add-in.

You need a checkout of this repository with Node 24 (`npm ci`). Recalibrating thresholds needs nothing
else. Training needs Python 3.12. An NVIDIA GPU is about ten times faster, but the CPU works: one epoch over
the published data plus a few hundred of your own sentences took about 30 seconds on a laptop GPU and
five and a half minutes on its CPU.

## Keep your mail on your own machines

Your examples will be real mail, with real people and real numbers in it. Keep them on machines your
organization controls, outside this repository's folder so they can't be committed. Don't upload
them to a hosted AI service, a labeling service or a shared notebook to label, clean or generate
variants: that sends the very thing the add-in exists to keep inside. Label them by hand, or with a
model running locally. The files the pipeline writes (training rows, the trained model) carry the
same content, so treat them as you treat the mail. The exported model is weights, but a model can
memorize training sentences; don't share an adapted model outside your organization.

## Decide what to change

**What the model does.** It reads each sentence of an outside email together with the one before
it, and flags five kinds of disclosure from [SPEC.md §5](../SPEC.md#5-what-it-flags): physical
access (`access`: a hidden key, an alarm left off, a broken lock), personal details about someone
(`personal`), the sender's own costs, margins and walk-away prices (`economics`), negotiating
position (`negotiation`), and insults (`remark`). Passwords, card and bank numbers, government IDs,
recipients and attachments are rules; adapting the model doesn't change them.

**What it was trained and measured on.** v2.3 was trained on 21,149 synthetic sentences written by
AI models from the spec, published in [model/data/](../model/data/README.md). It was measured on blind
synthetic test sets; [EVALUATION.md](../EVALUATION.md) has the method, the results and their limits.
None of that is your mail. How it behaves on yours is something only you can measure.

**The tradeoff.** For each category, the model gives a score and asks when the score passes a
threshold. Lower thresholds catch more and ask more needlessly; higher ones ask less and miss more.
The shipped thresholds were set so that about 5% of the project's development ordinary emails would
be questioned, favoring catches (a question costs one click; a miss can cost a client).

Pick the cheapest change that fixes what you see:

| What you see | Change | Needs |
| --- | --- | --- |
| Too many (or too few) questions on ordinary mail overall | [Recalibrate thresholds](#recalibrate-thresholds-only) on a sample of your ordinary outside mail | Node; a few hundred ordinary emails |
| Particular false alarms from your vocabulary (a word that means something else in your trade), or misses in your phrasing | [Fine-tune](#fine-tune-from-the-shipped-model) the shipped model on your examples mixed with the published data, then recalibrate | Python; tens to hundreds of labeled emails and sentences |
| You want different labeling throughout | [Retrain from the base](#retrain-from-the-base-checkpoint) Ettin-17M checkpoint | Python, a GPU; the published data plus a lot of your own |

Whatever you change, [evaluate it](#evaluate-before-shipping) on a held-out set of your mail before
you ship it.

## Data format

All files are JSON Lines (one JSON object per line, UTF-8). A complete small example lives in
[model/train/example/](../model/train/example/README.md); every person and company in it is invented.

**Labeled emails** (training and held-out sets): `id`, `subject`, `body` and, for a disclosure,
`flags`. Each flag's `quote` is copied from the email and must sit inside one sentence as Send splits
it (a line break always ends a sentence); that sentence gets the flag's `label`, every other sentence
is `none`. An email without flags is ordinary.

```json
{"id": "kr-d01", "subject": "Harbour Road costs", "body": "Hi Ines,\n\nOur shop rate works out at 38 an hour once the CNC lease is in, so this job barely covers itself.\n\nDana", "flags": [{"quote": "Our shop rate works out at 38 an hour", "label": "economics"}]}
{"id": "kr-o01", "subject": "Reception desk drawings", "body": "Hi Kit,\n\nI have added my markup to the drawings; see the red clouds on sheet 4.\n\nWren"}
```

Labels are `access`, `personal`, `economics`, `negotiation` and `remark`, with the meanings in
SPEC.md §5, including its "does not flag" lists. If your organization decides differently (say, a
note telling a customer where their new cabinet keys are is ordinary for you), label your examples
your way and write the decision down: the model learns what you label.

**Single sentences** (training only): `text`, `label` and optional `context` (the sentence before).
Use them for contrast pairs, the same wording with and without the disclosure:

```json
{"id": "kr-s01", "text": "Our markup is in red on the attached drawings.", "context": "", "label": "none"}
{"id": "kr-s02", "text": "Our markup on the oak is close to 60 percent.", "context": "", "label": "economics"}
```

**Ordinary outside mail** (calibration): emails in the same format without `flags`, a random sample
of what your people send outside the company on an ordinary day. Don't hand-pick it: the
thresholds are set so a chosen share of exactly this sample would be questioned. Several hundred
emails is a sensible minimum (the shipped thresholds used 1,752). Held-out case files in the format
of `evaluation/heldout/` also work; only cases that expect a pass and reach outside are used.

Keep three sets apart, with no email in more than one: training emails, the calibration sample, and
a held-out evaluation set you never tune on. `prepare.mjs` also holds back a share of the training
emails to choose the epoch.

## Set up

From the repository root:

```sh
npm ci
```

For training, create a Python environment (outside the repository or in an ignored folder; this one
is `.venv`). Windows PowerShell:

```powershell
py -3.12 -m venv .venv
.venv\Scripts\python -m pip install torch==2.8.0 --index-url https://download.pytorch.org/whl/cu128   # NVIDIA GPU only
.venv\Scripts\python -m pip install -r model/train/requirements.txt
```

Linux or macOS: `python3.12 -m venv .venv`, then `.venv/bin/python -m pip install -r model/train/requirements.txt`
(for an NVIDIA GPU on Linux, install torch from the cu128 index first, as above). The commands below write `python`; use the
environment's interpreter. The first training or export run downloads the public base checkpoint
(`jhu-clsp/ettin-encoder-17m` at a pinned revision, 70 MB, MIT license) into
`model/train/.cache/` and checks every file's SHA-256. Nothing else is downloaded, and no mail
leaves the machine.

The commands use `../adapt` for your files and outputs, a folder beside the checkout. Run them from
the repository root. Node scripts print usage when run without arguments; Python scripts also
support `--help`.

## Recalibrate thresholds only

No training: the shipped model, with thresholds fitted to your ordinary mail.

```sh
node model/train/calibrate.mjs --ordinary ../adapt/ordinary.jsonl --target 0.05 --out ../adapt/recalibrated
```

Your thresholds-only candidate is `../adapt/recalibrated`. Substitute that path for
`../adapt/candidate` in the evaluation and installation commands below.

`calibrate.mjs` scores every email as Send does (subject and body, each sentence with the one before
it), keeps each category's highest score per email, and picks thresholds so that at most `--target`
of the sample would be questioned (the "D procedure" that set the shipped thresholds). It prints the
share the current thresholds question on your sample and the share the new ones would, and writes a
complete export to `--out`: the same model and tokenizer, with the new thresholds in `labels.json`.
In the printed JSON, `before.questioned` and `after.questioned` are percentages; `target` is a
fraction (0.05 means 5%).

`--target` is your tradeoff. 0.05 asks about one in twenty ordinary emails; 0.02 asks less and misses
more. The procedure uses the whole budget: if your ordinary mail scores lower than the project's
did, thresholds go down and the model catches more, still within the target on your sample. The
model's results only add to the rules, so mail the rules question is questioned whatever the target.

No threshold goes below `--floor` (0.05). If one lands on the floor, `calibrate.mjs` warns: too few of
your ordinary emails score high in that category to place it, so the fitted rate on your sample
understates what real mail will see. A small or tidy sample does this; the 30-email example puts
every category on the floor. Use a larger sample, or raise `--floor`. Then
[evaluate](#evaluate-before-shipping) and [ship](#ship-it).

### Try the Node-only example

After `npm ci`, run this block from the repository root. It uses only the bundled synthetic data;
you don't need to create your own input files or install Python.

```sh
node model/train/calibrate.mjs --ordinary model/train/example/ordinary.jsonl --target 0.05 --out ../adapt/recalibrated
node model/train/cases.mjs model/train/example/heldout.jsonl ../adapt/heldout-cases
node evaluation/heldout/run.mjs --cases ../adapt/heldout-cases/cases.jsonl --semantic model/out
node evaluation/heldout/run.mjs --cases ../adapt/heldout-cases/cases.jsonl --semantic ../adapt/recalibrated
```

The small calibration sample should produce warnings. Compare both evaluation tables, including
the ordinary emails questioned; exit code 0 means the runner completed without errors, not that
the candidate meets your shipping bar. The appendix records the example's results.

`verify.mjs` is for Python exports: it requires the `reference.json` that `export.py` writes in
the training run directory. Recalibration alone copies the model and tokenizer without producing
that reference. For this Node-only path, use the held-out comparison above; it does not establish
Python-to-Node export parity. Continue at [Ship it](#ship-it) only after evaluating on your own mail.

## Fine-tune from the shipped model

The shipped `model/out/model.onnx` is the training starting point: v2.3 was trained on the int8
grid, so the export holds its exact trained weights, and `train.py` rebuilds the PyTorch model from it.

**1. Prepare.** Split your emails into Send's sentences, hold back a share for choosing the epoch,
and mix in the published v2.3 data so the model keeps what it already knows. `--repeat` counts each
of your training sentences several times, so a few hundred carry weight against 21,000. 10 is a
starting point, not a measured optimum: compare a couple of values on your validation emails.

```sh
node model/train/prepare.mjs --out ../adapt/data --val-share 0.2 --with-shipped-data --repeat 10 ../adapt/emails.jsonl ../adapt/sentences.jsonl
```

**2. Train.**

```sh
python model/train/train.py --data ../adapt/data/train.jsonl --val ../adapt/data/val.jsonl --out ../adapt/run --epochs 2
```

Each epoch prints its loss and, on the validation emails, how many disclosures it catches with
thresholds that question none of the validation ordinary emails; the best epoch is kept in
`../adapt/run/checkpoint`. The recipe is v2.3's (quantization-aware, class-weighted, label smoothing
0.05, AdamW 5e-5 encoder and 3e-4 head, warmup and linear decay); change it with `--lr`, `--head-lr`,
`--batch`, `--epochs` and `--seed`. `--device cpu` forces the CPU.

**3. Export.** Writes `model.onnx`, `tokenizer.json`, `labels.json`, `LICENSE` and `NOTICE` to
`../adapt/export/`. It also writes `reference.json` (PyTorch's scores on the fixed probe sentences
in `model/train/probes.jsonl`) to `../adapt/run/`. It refuses an export whose scores drift from PyTorch.

```sh
python model/train/export.py --run ../adapt/run --out ../adapt/export --version 2.3.0-yourorg.1
```

**4. Calibrate** the new model on your ordinary mail, as above, but from the export:

```sh
node model/train/calibrate.mjs --model ../adapt/export --ordinary ../adapt/ordinary.jsonl --target 0.05 --out ../adapt/candidate
```

**5. Verify** that the add-in's own classifier loads the candidate, tokenizes the probes exactly as
Python did, and agrees with the PyTorch model's scores and decisions. `--against` also shows how far
it moved from the shipped model. (`--allow-uncalibrated` checks an export before step 4.)

```sh
node model/train/verify.mjs --model ../adapt/candidate --reference ../adapt/run/reference.json --against model/out
```

## Retrain from the base checkpoint

`--init base` starts from the base Ettin-17M weights with a new classifier head instead of the
shipped model. Train on the published data plus yours (`--with-shipped-data`) with a validation set,
and give it several epochs to choose from (v2.3 itself started from the base and its best was the
second of up to twelve). An epoch over the 22,000 sentences of the appendix run took 31 seconds
on a laptop GPU and 326 seconds on its CPU. Then export, calibrate and verify as above. This reproduces v2.3's recipe, not its exact weights: v2.3's epoch was chosen
on emails its authors reserved, which aren't published (see
[model/data/README.md](../model/data/README.md)), and GPU training isn't bit-for-bit repeatable.

## Evaluate before shipping

Hold out a set of your own labeled emails, disclosures and ordinary mail, that you never train or
calibrate on and never change after looking at results. Decide before you run it what result you
need to ship. Then score the shipped model and your candidate on it through the full product path
(rules, recipients and model):

```sh
node model/train/cases.mjs ../adapt/heldout.jsonl ../adapt/heldout-cases
node evaluation/heldout/run.mjs --cases ../adapt/heldout-cases/cases.jsonl --semantic model/out
node evaluation/heldout/run.mjs --cases ../adapt/heldout-cases/cases.jsonl --semantic ../adapt/candidate
```

`cases.mjs` turns your labeled emails into the runner's case format, with the composition table
the runner checks (`README.md`) and `ids.json` mapping case ids back to yours. Add `from` and `to`
(an address, or `{"name": "Client", "address": "client@outside.example"}`) to control who is inside
and who is greeted. By default each goes from `company.example` to a role mailbox, "Client services"
at `outside.example`, which the
greeting check (§5.8) leaves alone. The runner prints how many disclosures were stopped, how many
ordinary emails were questioned and the ids of every miss and needless question, never email text. `--json name.json`
also saves the report, under `evaluation/heldout/`; the parent directory must exist and the report
filename must be new. Exit code 0 means no runner errors, not that the results meet your chosen bar.
Once you have used a held-out set to decide, it is spent: write a fresh one for the next decision.

A held-out set of 60 disclosures still leaves a wide margin (50 of 60 is consistent with anything
from about 72% to 91%); see [EVALUATION.md](../EVALUATION.md#what-these-numbers-do-not-show).

## Ship it

```sh
node model/train/install.mjs ../adapt/candidate --note "<what you changed, on what data>" --accuracy "<your held-out result>"
npm test
npm run build
```

`install.mjs` copies the candidate into `model/out/` (it refuses one that hasn't been calibrated) and
rewrites `model/PROVENANCE.json` with the new hashes, your note, the training and calibration
records, and the previous model's hash. `npm test` checks those hashes; `npm run build` copies the
model into `dist/model/`. Commit `model/out/` and `model/PROVENANCE.json` together, on their own.

Then publish the built `dist/` folder to your HTTPS host as in [outlook/SETUP.md](../outlook/SETUP.md).
The build compiles the new files' hashes into the add-in's loader, which fetches and checks the new
model; Outlook keeps an add-in's files cached for a while. Download a manifest from your host's
`setup.html` with the same add-in Id and a higher version (under "Version and add-in Id"), and update
the app in the Microsoft 365 admin center, so Outlook picks the change up. Check it in each Outlook
client with synthetic mail before rolling it out widely.

## Roll back

Keep the previous `dist/` you published. To go back, republish it, or revert the install commit,
then run `npm test` and `npm run build` and publish that. Either way, upload a manifest with a higher
version again (versions only go up). `git revert` of the install commit restores the shipped files
byte for byte; `npm test` confirms it against `model/PROVENANCE.json`.

## Appendix: a verified run

On 24 October 2026 the whole loop ran on a Windows 11 laptop (16 GB RAM, NVIDIA RTX 4070 Laptop GPU)
with Node 24.20, Python 3.12 and the versions in `model/train/requirements.txt` (torch 2.8.0 CUDA
12.8 build), on the example data in `model/train/example/`. Outputs went to `../adapt-proof`. Times
are wall clock, including model loading.

| Step | Command | Time | Result |
| --- | --- | ---: | --- |
| Install | `npm ci` | 13 s | |
| Thresholds only | `calibrate.mjs --ordinary example/ordinary.jsonl --target 0.05` | 2 s | 30 emails, 150 sentences; shipped thresholds question 0 of 30; every category fitted to the 0.05 floor (warned) |
| Held-out cases | `cases.mjs example/heldout.jsonl` | <1 s | 12 cases, 6 expected to stop |
| Evaluate shipped | `run.mjs --cases … --semantic model/out` | 2 s | 6 of 6 stopped, 0 of 6 questioned |
| Evaluate recalibrated | `run.mjs --cases … --semantic …/recalibrated` | 1 s | 6 of 6 stopped, 3 of 6 questioned (access, remark, negotiation): the floor thresholds at work |
| Prepare | `prepare.mjs --val-share 0.2 --with-shipped-data --repeat 10` | <1 s | 22,276 training sentences (21,146 published, 1,130 example), 4 validation emails |
| Rebuild check | `train.py --epochs 0`, `export.py`, `verify.mjs --against model/out` | 21 s, 10 s, 2 s | re-exported `model.onnx` byte-identical to the shipped one (SHA-256 7cdd30e8…); 40 of 40 probe decisions equal |
| Fine-tune | `train.py --epochs 1` (GPU) | 40 s (31 s training) | validation: 2 of 2 disclosures caught at zero validation questions |
| Export | `export.py --version 2.3.0-example.1` | 10 s | PyTorch to int8 max probability difference 0.0009; argmax agreement 1.0 |
| Calibrate | `calibrate.mjs --model …/export` | 2 s | every category on the floor again (30-email sample) |
| Verify | `verify.mjs --against model/out` | 3 s | all checks passed; token ids 40/40; Node vs onnxruntime 6.9e-7; Node vs PyTorch 0.0009; decisions 40/40; vs shipped: max score change 0.23, 1 of 40 probe decisions changed |
| Evaluate candidate | `run.mjs --cases … --semantic …/candidate` | 2 s | 6 of 6 stopped, 0 of 6 questioned at the same floor thresholds |
| CPU path | `train.py --device cpu --epochs 1` on the 145 example sentences | 10 s (2 s training) | |
| Install | `install.mjs …/candidate` | <1 s | `model/out/` and `PROVENANCE.json` updated |
| Test | `npm test` with the candidate installed | 23 s | 372 of 372 pass |

The shipped files were then restored and checked byte for byte against their SHA-256, and `npm test`
passed again (372 of 372).

The CPU path was then run again in a new environment made only from `model/train/requirements.txt`
(`pip install` 185 s, 1.6 GB; torch 2.8.0+cpu), with no GPU: `train.py` (device chosen
automatically) for 2 epochs on the example alone in 22 s, `export.py` 7 s, `calibrate.mjs` and
`verify.mjs` (all checks passed, decisions 40/40), and one epoch over the 22,276-sentence mix with the
published data in 326 s. The three evaluations were rerun after a fix to `cases.mjs` (its first
default recipient name set off the greeting check on every ordinary case); the table shows the rerun.

Read the evaluations as a demonstration, not a result. Twelve cases can't measure anything: the
shipped model already gets all twelve right, the recalibrated one shows why a threshold on the floor
is a warning, and the fine-tuned one, which saw the firm's "keys" and "markup" wording, stays quiet on
the held-out versions of it at those same low thresholds. Whether adapting helps your mail has to be
measured on your own held-out set.
