// Header-only dimensions and frame counts, before WASM allocation. Unknown/animated containers
// cannot be cleared by reading just their first frame. TIFF multi-page also stays can't check.
import { OCR_MAX_PIXELS } from './ocr-policy.mjs';
export function imageInfo(b) {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const u16 = (at, le = true) => v.getUint16(at, le), u32 = (at, le = true) => v.getUint32(at, le);
  const ascii = (at, n) => String.fromCharCode(...b.subarray(at, at + n));
  let width, height, frames = 1;
  if (ascii(1, 3) === 'PNG') { width = u32(16, false); height = u32(20, false); for (let p = 8; p + 12 <= b.length;) { if (ascii(p + 4, 4) === 'acTL') frames = u32(p + 8, false); p += u32(p, false) + 12; } }
  else if (ascii(0, 3) === 'GIF') {
    width = u16(6); height = u16(8); frames = 0;
    let p = 13 + ((b[10] & 128) ? 3 * (1 << ((b[10] & 7) + 1)) : 0);
    const blocks = () => { while (p < b.length) { const n = b[p++]; if (!n) return; p += n; } throw new Error('image_header'); };
    while (p < b.length && b[p] !== 0x3b) {
      const code = b[p++];
      if (code === 0x21) { p++; blocks(); }
      else if (code === 0x2c) { frames++; if (u16(p) + u16(p + 4) > width || u16(p + 2) + u16(p + 6) > height) throw new Error('image_size'); const flags = b[p + 8]; p += 9; if (flags & 128) p += 3 * (1 << ((flags & 7) + 1)); p++; blocks(); }
      else throw new Error('image_header');
    }
  } else if (ascii(0, 2) === 'BM') { width = Math.abs(v.getInt32(18, true)); height = Math.abs(v.getInt32(22, true)); }
  else if (['II', 'MM'].includes(ascii(0, 2))) {
    const le = ascii(0, 2) === 'II';
    if (u16(2, le) !== 42) throw new Error('image_header');
    let p = u32(4, le); const seen = new Set(); frames = 0;
    while (p) {
      if (seen.has(p) || ++frames > 1) throw new Error('image_frames'); seen.add(p);
      const n = u16(p, le);
      if (n > 256) throw new Error('image_header');
      for (let i = 0; i < n; i++) { const at = p + 2 + i * 12, tag = u16(at, le), type = u16(at + 2, le); if (tag === 256 || tag === 257) { if (u32(at + 4, le) !== 1 || ![3,4].includes(type) || tag === 256 && width !== undefined || tag === 257 && height !== undefined) throw new Error('image_header'); const value = type === 3 ? u16(at + 8, le) : u32(at + 8, le); if (tag === 256) width = value; else height = value; } }
      p = u32(p + 2 + n * 12, le);
    }
  } else if (ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') {
    const kind = ascii(12, 4);
    if (kind === 'VP8X') { if (b[20] & 2) throw new Error('image_frames'); width = 1 + b[24] + (b[25] << 8) + (b[26] << 16); height = 1 + b[27] + (b[28] << 8) + (b[29] << 16); }
    else if (kind === 'VP8 ') { width = u16(26) & 16383; height = u16(28) & 16383; }
    else if (kind === 'VP8L') { const n = u32(21); width = (n & 16383) + 1; height = ((n >>> 14) & 16383) + 1; }
  } else if (b[0] === 255 && b[1] === 216) {
    let p = 2;
    while (p + 4 <= b.length) {
      if (b[p++] !== 255) throw new Error('image_header');
      while (b[p] === 255) p++;
      const marker = b[p++]; if (marker === 0xd9 || marker === 0xda) break;
      if (marker >= 0xd0 && marker <= 0xd7) continue;
      const n = u16(p, false);
      if (n < 2) throw new Error('image_header');
      if ([0xc0, 0xc1, 0xc2].includes(marker)) { height = u16(p + 3, false); width = u16(p + 5, false); break; } p += n;
    }
  }
  if (frames !== 1) throw new Error('image_frames');
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0 || width * height > OCR_MAX_PIXELS) throw new Error('image_size');
  return { width, height };
}
