// A reference LZW encoder (EarlyChange 1) for building test streams. It widens codes exactly when a
// decoder does: the decoder's table lags the encoder's by one entry, so the width is tracked from
// the decoder's side.
export function lzwEncode(bytes) {
  const dict = new Map();
  for (let i = 0; i < 256; i++) dict.set(String.fromCharCode(i), i);
  let next = 258, width = 9, decoderSize = 258, sent = 0, acc = 0, n = 0;
  const out = [];
  const write = (code) => { acc = (acc << width) | code; n += width; while (n >= 8) { out.push((acc >>> (n - 8)) & 255); n -= 8; } acc &= (1 << n) - 1; };
  const emit = (code) => {
    write(code);
    if (sent++ > 0 && decoderSize < 4096) decoderSize++;
    if (decoderSize + 1 >= (1 << width) && width < 12) width++;
  };
  write(256);
  let w = '';
  for (const b of bytes) {
    const c = String.fromCharCode(b), wc = w + c;
    if (dict.has(wc)) { w = wc; continue; }
    emit(dict.get(w));
    if (next < 4096) dict.set(wc, next++);
    w = c;
  }
  if (w) emit(dict.get(w));
  write(257);
  if (n) out.push((acc << (8 - n)) & 255);
  return Buffer.from(out);
}
