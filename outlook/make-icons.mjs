// Draws the Guardcell mark (a near-black rounded square, a white
// dot, a blue bar and a green dot) into the PNG sizes the manifest names, with 4x4 supersampling.
// Run: node outlook/make-icons.mjs  (writes outlook/assets/icon-{16,32,64,80,128}.png)
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync, crc32 } from 'node:zlib';

const INK = [0x18, 0x18, 0x1b], WHITE = [0xff, 0xff, 0xff], BLUE = [0x60, 0xa5, 0xfa], GREEN = [0x22, 0xc5, 0x5e];
const inRoundRect = (x, y, x0, y0, x1, y1, r) => {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.min(Math.max(x, x0 + r), x1 - r), cy = Math.min(Math.max(y, y0 + r), y1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
};
const inCircle = (x, y, cx, cy, r) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
// The mark in its 24-unit box: what colour is at (x, y), or null outside it.
function colourAt(x, y) {
  if (!inRoundRect(x, y, 2, 2, 22, 22, 6)) return null;
  if (inCircle(x, y, 16.75, 12, 2.25)) return GREEN;
  if (inRoundRect(x, y, 11, 5.75, 13, 18.25, 1)) return BLUE;
  if (inCircle(x, y, 7.25, 12, 1.75)) return WHITE;
  return INK;
}

function png(size) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  const S = 4;
  for (let py = 0; py < size; py++) {
    raw[py * (size * 4 + 1)] = 0;
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
        const c = colourAt(((px + (sx + 0.5) / S) / size) * 24, ((py + (sy + 0.5) / S) / size) * 24);
        if (c) { r += c[0]; g += c[1]; b += c[2]; a++; }
      }
      const o = py * (size * 4 + 1) + 1 + px * 4;
      if (a) { raw[o] = Math.round(r / a); raw[o + 1] = Math.round(g / a); raw[o + 2] = Math.round(b / a); }
      raw[o + 3] = Math.round((a / (S * S)) * 255);
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body) >>> 0);
    return Buffer.concat([len, body, crc]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4); header[8] = 8; header[9] = 6;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', header), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

const dir = new URL('./assets/', import.meta.url);
mkdirSync(dir, { recursive: true });
for (const size of [16, 32, 64, 80, 128]) writeFileSync(new URL(`icon-${size}.png`, dir), png(size));
console.log('icons written');
