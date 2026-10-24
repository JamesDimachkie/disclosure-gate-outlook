// Thresholds are measured by tools/calibrate-ocr.mjs, never against evaluation/heldout.
export const OCR_POLICY = Object.freeze({ mean: 94, word: 87, inlineSide: 8, inlinePixels: 64, inlineBytes: 256, emptySmall: 0, emptyMinSide: 32 });
export const OCR_MAX_PIXELS = 12_000_000;
export const OCR_MAX_PAGES = 12;
export const OCR_MAX_TEXT = 200000;
export const OCR_KEY = 'dg-ocr-v1';
export const imageName = name => /\.(png|jpe?g|gif|bmp|tiff?|webp)$/i.test(String(name || ''));
// SVG is text (XML), not a picture: it never takes the picture path.
export const imageAttachment = a => a && a.type === 'file' && (imageName(a.name) || /^image\/(?!svg)/i.test(String(a.contentType || '')));
export const ocrCandidate = a => a && a.type === 'file' && (imageAttachment(a) || /\.(pdf|docx|pptx|xlsx)$/i.test(a.name));
export const sameAttachment = (a, b) => !!a && !!b && a.name === b.name && a.size === b.size;
export const compactOcr = text => String(text || '').replace(/\s+/g, '');
export function ocrStats(data) {
  const words = String(data?.tsv || '').split('\n').slice(1).map(line => line.split('\t')).filter(c => c[0] === '5' && c.slice(11).join('\t').trim());
  const scores = words.map(c => Number(c[10]));
  let minimum = -1;
  if (scores.length) { minimum = Infinity; for (const score of scores) minimum = Math.min(minimum, score); }
  return { text: String(data?.text || '').trim(), mean: Number(data?.confidence), word: minimum, words: scores.length, boxes: words.map(c => ({ width: Number(c[8]), height: Number(c[9]) })) };
}
// Two independently segmented reads must agree, including punctuation and case. A blank result
// from one segmentation alone is never enough. Empty-read calibration is recorded separately.
export function decideOcr(reads, policy = OCR_POLICY) {
  if (!Array.isArray(reads) || reads.length !== 2) return { status: 'failed', reason: 'ocr_failed' };
  const [a, b] = reads;
  if (reads.every(r => r && r.text === '' && r.words === 0 && r.pixels && r.pixels.small <= policy.emptySmall && Math.min(r.pixels.width, r.pixels.height) >= policy.emptyMinSide)) return { status: 'ready', text: '', reason: 'no_text' };
  if (a && b && a.text && compactOcr(a.text) === compactOcr(b.text) && reads.every(r => r.words > 0 && Number.isFinite(r.mean) && Number.isFinite(r.word) && r.mean >= policy.mean && r.word >= policy.word)) {
    if (a.text.length > OCR_MAX_TEXT) return { status: 'failed', reason: 'too_long' };
    return { status: 'ready', text: a.text.replace(/\s+/g, ' '), reason: 'text' };
  }
  // Low confidence can't clear a picture, but what was read is still evidence: the reads' text goes
  // along as a hint that is screened, so a secret read imperfectly still counts (23 October 2026).
  const hint = [...new Set(reads.map(r => String(r?.text || '').trim()).filter(Boolean))].join('\n');
  return hint && hint.length <= OCR_MAX_TEXT ? { status: 'failed', reason: 'ocr_low_confidence', hint } : { status: 'failed', reason: 'ocr_low_confidence' };
}
export const tinyInline = (a, info, policy = OCR_POLICY) => a.isInline === true && a.size <= policy.inlineBytes && info.width <= policy.inlineSide && info.height <= policy.inlineSide && info.width * info.height <= policy.inlinePixels;
