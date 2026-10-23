# Synthetic OCR calibration, 22 October 2026

Run `npm run calibrate:ocr` after `npm ci --ignore-scripts`. This generates only synthetic
images in `.qa/ocr-calibration/`, uses one local worker, and writes `results.json`. No held-out
measurement data, real mail, hosted image generation or OCR service was used. Sharp is a
development-only rasterizer; it is not shipped. All OCR paths in this run are local filesystem
paths. The browser build uses its own static origin instead.

The pinned engine is Tesseract.js/core 7.0.0, LSTM only, with English `4.0.0_best_int` from
`@tesseract.js-data/eng` 1.0.0. Each image is read twice: sparse text (PSM 11) and a single block
(PSM 6), both with `rotateAuto`. Recognition text, page confidence, minimum TSV word confidence,
word boxes, and binary-image component counts are retained in the JSON. Timing is deliberately
not used to select confidence thresholds. The first format trial used a JPEG-compressed TIFF
that this core could not decode; the recorded format case is uncompressed TIFF.

## Corpus and selection

There are 102 images: 72 text screenshots (three synthetic passages at 6, 8, 10, 14, 20 and 30 px,
each clean, JPEG quality 22, photographed-style, and blurred); six gradients; six procedural
landscape/site scenes without text; six small circular logos; six four-digit micro-labels; and
six format variants of the same 30 px text (PNG, JPEG, GIF, TIFF, WebP and BMP). Photo treatment
adds four degrees of rotation, tinted paper, blur, deterministic pixel noise and JPEG compression.
The passages include synthetic access details, internal economics, and ordinary delivery text.

Nonempty acceptance requires exact agreement between the segmentations, including case and
punctuation, after removing whitespace. The script searches every integer page-mean/minimum-word
pair from 0 through 100. It accepts only pairs with zero incorrectly transcribed accepted images,
maximizes the number accepted, then chooses higher word and page thresholds on ties. The result is
page mean **94** and every word **87** or higher. These are engine scores, not probabilities.

A naive two-empty-reads rule falsely cleared twelve text samples, including small screenshots.
The shipped empty rule additionally checks the engine's binary PNG: no small connected components
and a minimum image side of **32 px**. A small component has at least two dark pixels and fits within
20% of image width and 50% of height; this fixed feature detects possible glyphs, not their meaning.
Searching component-count thresholds 0..32 and minimum sides 1, 2, 4, 8, 16, 32, 64 and 128,
with zero false-empty text and maximum accepted empty images, selects **0 components / 32 px**.
Ties choose fewer components, then the smaller side. Both segmentations must still return no
characters or words. Merely discarding a few low-confidence characters would clear two blurred
text samples (`text-0-6-blur`, `text-2-6-blur`), so the six scenes remain uncertain.

The inline exception is intentionally smaller than the no-text rule. Only inline **file images**
at most **8 by 8 px, 64 pixels and 256 bytes** skip recognition. The tested 1/8 px logos and
micro-labels occupied 91..167 bytes; 256 is the next power-of-two byte envelope. The 16..48 px
cases are excluded: the 16 px label disappeared in binarization, the 24 px label left four possible
glyph components, the 32 px label was misread as `un`, and the 48 px label was read as `4471`.
The 8 px cap retains a margin below those failures. A browser bitmap decode must also succeed;
a tiny header on a malformed file does not qualify. This is an explicit micro-logo/spacer exception,
not evidence that all small images are harmless. Ordinary signature logos receive OCR.

## Recorded results and limits

- Text screenshots: 14/72 accepted with complete, correct text; 58 held as uncertain. No text
  screenshot was cleared as empty. The photographed/blurred treatments remain conservative.
- Format variants: 5/6 accepted correctly (PNG, JPEG, uncompressed TIFF, WebP, BMP). GIF decoded
  but its quantized text fell below the threshold and held. Other TIFF codecs may also hold.
- Micro-labels: one correctly accepted, five uncertain before the explicit inline exception.
- Text-free images: all six gradients and the 32/48 px logos cleared empty (8/18). All six generated
  scenes and the four smaller non-inline logos held. This lane does **not** establish reliable
  clearance of arbitrary site photos; substantial no-text over-holding remains.
- Overall, 20 nonempty and eight empty results were accepted with zero wrong accepted results
  on this corpus. These are fitting-set results, not independent accuracy or release evidence.

The empty classifier and English-only coverage are the weakest policy points. A finite synthetic
set does not prove that unknown text, unusual fonts, other languages or visual noise cannot fool
it. Animated/multi-page image containers are refused rather than clearing their first frame. The
12-megapixel image limit, 12-image/page scan limit and 10 MiB input limit bound memory; they are
resource limits, not confidence thresholds. Worker/WASM success, memory, cache lifetime and Send
timings require live Outlook tests. See `outlook/RUNTIME-V2-NOTES.md`.
