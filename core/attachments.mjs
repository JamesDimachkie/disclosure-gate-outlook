// Attachment policy (spec §6). Native text extraction always runs for documents, even when inline.
// OCR is only for image files or a PDF returning no_text, with a fresh byte hash. Unknown, oversized,
// encrypted or unreadable files hold outside mail. No isInline flag or OCR entry bypasses this path.
import { docxText, xlsxText, pptxText } from './extract/office.mjs';
import { fromBase64, decodeBytes } from './bytes.mjs';
import { pdfText, pdfFormText } from './extract/pdf.mjs';
import { imageAttachment } from './ocr-policy.mjs';
import { imageInfo } from './image-info.mjs';
import { sha256 } from './sha256.mjs';

export const READABLE = Object.freeze(['pdf', 'docx', 'xlsx', 'pptx', 'csv', 'txt']);
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const MAX_TEXT_CHARS = 200000;
export const attachmentHash = content => sha256(fromBase64(content));

// 'pdf' | 'docx' | 'xlsx' | 'csv' | 'txt' for a file attachment whose text this build reads, else null.
export function readableKind(attachment) {
  if (!attachment || (attachment.type && attachment.type !== 'file')) return null;
  const ext = /\.([a-z0-9]+)$/i.exec(String(attachment.name || ''))?.[1]?.toLowerCase();
  return READABLE.includes(ext) ? ext : null;
}

// Plain text in UTF-8, UTF-16 with a byte order mark, or Windows-1252; binary content is refused.
export function decodeText(bytes) {
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) return decodeBytes(bytes.subarray(2), 'utf-16le', false);
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) return decodeBytes(bytes.subarray(2), 'utf-16be', false);
  const body = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf ? bytes.subarray(3) : bytes;
  let nul = 0;
  for (const b of body) if (b === 0) nul++;
  if (nul > 0) throw new Error('binary');
  try { return decodeBytes(body, 'utf-8', true); } catch { return decodeBytes(body, 'windows-1252', false); }
}

// True when the bytes start like a picture format the OCR path reads: PNG, JPEG, GIF, BMP, TIFF or
// WebP. A document renamed .png, or sent with an image content type, fails this.
function pictureSignature(b) {
  const at = (i, ...xs) => xs.every((x, k) => b[i + k] === x);
  return b.length >= 12 && (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a) || at(0, 0xff, 0xd8, 0xff) || at(0, 0x47, 0x49, 0x46, 0x38) || at(0, 0x42, 0x4d)
    || at(0, 0x49, 0x49, 0x2a, 0x00) || at(0, 0x4d, 0x4d, 0x00, 0x2a) || (at(0, 0x52, 0x49, 0x46, 0x46) && at(8, 0x57, 0x45, 0x42, 0x50)));
}

// {ok: true, text} or {ok: false, reason}. `content` is the base64 Office gave the add-in.
export function attachmentText(attachment) {
  const ocr = attachment?.ocr;
  const kind = readableKind(attachment);
  // A name the extractors read (.docx, .pdf…) always wins over an image content type; and a
  // "picture" must prove it is one (below) before anything about OCR is trusted.
  const image = !kind && imageAttachment(attachment);
  const ocrFailure = () => ({ ok: false, reason: ocr?.status === 'pending' ? 'ocr_pending' : ocr?.reason || (ocr?.status === 'unsupported' || !ocr ? 'ocr_unsupported' : 'ocr_failed') });
  if (!kind && !image) return { ok: false, reason: attachment?.type && attachment.type !== 'file' ? attachment.type : 'type' };
  if (!Number.isSafeInteger(attachment.size) || attachment.size < 0 || attachment.size > MAX_ATTACHMENT_BYTES) return { ok: false, reason: 'size' };
  if (image) {
    if (typeof attachment.content !== 'string' || !attachment.content) return { ok: false, reason: 'not_read' };
    let picture;
    try { picture = fromBase64(attachment.content); } catch { return { ok: false, reason: 'not_read' }; }
    if (!pictureSignature(picture)) return { ok: false, reason: 'image_type' };
    try { imageInfo(picture); } catch (error) { const r = String(error?.message || ''); return { ok: false, reason: r === 'image_frames' || r === 'image_size' ? r : 'image_type' }; }
    // A result about a different picture (same id, name and size) is never trusted.
    if (ocr?.hash && ocr.hash !== sha256(picture)) return { ok: false, reason: 'ocr_hash' };
    if (ocr?.status === 'failed' && ocr.reason === 'ocr_low_confidence' && !ocr.hash) return { ok: false, reason: 'ocr_identity' };
    if (ocr?.status !== 'ready') return ocr?.reason === 'ocr_low_confidence' && typeof ocr.hint === 'string' ? { ...ocrFailure(), hint: ocr.hint } : ocrFailure();
  }
  if (typeof attachment.content !== 'string' || (!attachment.content && attachment.size !== 0)) return { ok: false, reason: 'not_read' };
  let bytes;
  try { bytes = fromBase64(attachment.content); } catch { return { ok: false, reason: 'not_read' }; }
  if (!bytes.length && attachment.size > 0) return { ok: false, reason: 'not_read' };
  if (bytes.length > MAX_ATTACHMENT_BYTES) return { ok: false, reason: 'size' };
  const readyOcr = () => {
    if (ocr?.status === 'failed' && ocr.reason === 'ocr_low_confidence' && typeof ocr.hint === 'string') {
      if (!/^[a-f0-9]{64}$/.test(ocr.hash || '') || ocr.hash !== sha256(bytes)) return { ok: false, reason: 'ocr_hash' };
      return { ok: false, reason: 'ocr_low_confidence', hint: ocr.hint };
    }
    if (ocr?.status !== 'ready') return ocrFailure();
    if (!/^[a-f0-9]{64}$/.test(ocr.hash || '') || ocr.hash !== sha256(bytes)) return { ok: false, reason: 'ocr_hash' };
    if (typeof ocr.text !== 'string' || ocr.text.length > MAX_TEXT_CHARS) return { ok: false, reason: 'ocr_failed' };
    return { ok: true, text: ocr.text };
  };
  try {
    if (image) { imageInfo(bytes); return readyOcr(); }
    let text;
    if (kind === 'txt' || kind === 'csv') text = decodeText(bytes);
    else if (kind === 'docx') text = docxText(bytes);
    else if (kind === 'xlsx') text = xlsxText(bytes);
    else if (kind === 'pptx') text = pptxText(bytes);
    else text = pdfText(bytes);
    if (kind === 'pdf' && !text.trim()) {
      if (!ocr) return { ok: false, reason: 'no_text' };
      // A scan read by OCR: its filled form fields and comments are checked with the page text.
      const read = readyOcr();
      if (!read.ok) return read;
      const extra = pdfFormText(bytes);
      return { ok: true, text: extra ? read.text + '\n' + extra : read.text };
    }
    if (text.length > MAX_TEXT_CHARS) return { ok: false, reason: 'too_long' };
    return { ok: true, text };
  } catch (error) {
    return { ok: false, reason: String(error?.message || 'unreadable').slice(0, 40) };
  }
}
