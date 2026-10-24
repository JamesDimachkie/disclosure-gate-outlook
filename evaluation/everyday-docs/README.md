# Everyday documents

The public corpus check (`tools/corpus-check.mjs`) runs the attachment readers on 1,586 deliberately
difficult files. This check asks the other question: does an ordinary file, saved by the programs
people actually use, read in full?

Twelve invented business documents (an invoice, a letter, a report with tables, a timesheet, a
contract, minutes, a menu, a multilingual welcome pack, a newsletter, a quote, a policy, a checklist)
are written as HTML, then saved three ways: printed to PDF by Chromium, saved as PDF by Microsoft
Word, and saved as a Word `.docx`. Each of the 36 files is read with the add-in's own reader, which
must read it in full and return every distinctive phrase, including amounts, accented words, Greek,
Cyrillic, Turkish, Japanese and Chinese.

```
node evaluation/everyday-docs/make-html.mjs
node evaluation/everyday-docs/export.mjs --playwright=<path to playwright index.mjs> [--chromium=<browser binary>]
powershell -File evaluation/everyday-docs/export-word.ps1     # Windows with Word installed
node evaluation/everyday-docs/check.mjs evaluation/everyday-docs/results.json
```

The generated `html/` and `files/` folders are not committed. `results.json` is the last run:
36 of 36 read in full with every phrase (24 October 2026, Chromium 156, Word for Microsoft 365).
The first run found one gap, now fixed: Chromium writes "î" as a dotless ı plus a combining accent,
which the PDF reader now reads as "î".
