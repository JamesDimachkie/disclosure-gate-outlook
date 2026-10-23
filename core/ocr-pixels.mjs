// Decode the engine's own binary PNG, never arbitrary browser image URLs. Connected components
// guard against small text that both OCR segmentations missed. Unhandled PNGs fail closed.
import { fromBase64, concatBytes } from './bytes.mjs';
import { inflateZlib } from './extract/inflate.mjs';
import { OCR_MAX_PIXELS } from './ocr-policy.mjs';
export function binaryEvidence(url) {
  if (!/^data:image\/png;base64,/.test(url)) throw new Error('ocr_pixels');
  const b = fromBase64(url.slice(url.indexOf(',') + 1));
  const view = new DataView(b.buffer, b.byteOffset, b.byteLength), u32 = at => view.getUint32(at);
  const w = u32(16), h = u32(20), bits = b[24], color = b[25];
  if (!w || !h || w * h > OCR_MAX_PIXELS || color !== 0 || ![1, 8].includes(bits) || b[28] !== 0) throw new Error('ocr_pixels');
  const parts = [];
  for (let at = 8; at + 12 <= b.length;) {
    const n = u32(at), type = String.fromCharCode(...b.subarray(at + 4, at + 8));
    if (at + n + 12 > b.length) throw new Error('ocr_pixels');
    if (type === 'IDAT') parts.push(b.subarray(at + 8, at + 8 + n));
    at += n + 12;
  }
  const stride = Math.ceil(w * bits / 8), data = inflateZlib(concatBytes(parts), { maxOutputLength: (stride + 1) * h });
  const pixels = new Uint8Array(w * h), row = new Uint8Array(stride), prev = new Uint8Array(stride);
  const paeth = (a, b, c) => { const p = a + b - c, da = Math.abs(p - a), db = Math.abs(p - b), dc = Math.abs(p - c); return da <= db && da <= dc ? a : db <= dc ? b : c; };
  for (let y = 0; y < h; y++) {
    const filter = data[y * (stride + 1)];
    if (filter > 4) throw new Error('ocr_pixels');
    for (let x = 0; x < stride; x++) {
      const a = x ? row[x - 1] : 0, c = x ? prev[x - 1] : 0, up = prev[x];
      row[x] = (data[y * (stride + 1) + x + 1] + (filter === 0 ? 0 : filter === 1 ? a : filter === 2 ? up : filter === 3 ? Math.floor((a + up) / 2) : paeth(a, up, c))) & 255;
    }
    for (let x = 0; x < w; x++) pixels[y * w + x] = bits === 1 ? ((row[x >> 3] >> (7 - (x & 7))) & 1) === 0 ? 1 : 0 : row[x] < 128 ? 1 : 0;
    prev.set(row);
  }
  const stack = new Int32Array(w * h);
  let small = 0;
  for (let at = 0; at < pixels.length; at++) {
    if (!pixels[at]) continue;
    let top = 0, count = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
    stack[top++] = at; pixels[at] = 0;
    while (top) {
      const p = stack[--top], x = p % w, y = Math.floor(p / w);
      count++; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (x + dx < 0 || x + dx >= w || y + dy < 0 || y + dy >= h) continue;
        const next = p + dy * w + dx;
        if (pixels[next]) { pixels[next] = 0; stack[top++] = next; }
      }
    }
    if (count >= 2 && x1 - x0 + 1 <= w * 0.2 && y1 - y0 + 1 <= h * 0.5) small++;
  }
  return { width: w, height: h, small };
}
