// Portable byte operations. Classic Outlook does not need browser encoding globals.
export function utf8(value) {
  const s=String(value), out=new Uint8Array(s.length*3);let at=0;
  for (const ch of s) {
    let c=ch.codePointAt(0);
    if(c>=0xd800 && c<=0xdfff) c=0xfffd;
    if(c<128) { out[at++]=c; }
    else if(c<2048) { out[at++]=192|c>>6;out[at++]=128|c&63; }
    else if(c<65536) { out[at++]=224|c>>12;out[at++]=128|c>>6&63;out[at++]=128|c&63; }
    else { out[at++]=240|c>>18;out[at++]=128|c>>12&63;out[at++]=128|c>>6&63;out[at++]=128|c&63; }
  }
  return out.subarray(0,at);
}
export function latin1(bytes) {
  let out = '';
  for (let i = 0; i < bytes.length; i += 8192) out += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
  return out;
}
const CP1252 = '\u20ac\u0081\u201a\u0192\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\u008d\u017d\u008f\u0090\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u02dc\u2122\u0161\u203a\u0153\u009d\u017e\u0178';
// Code units are collected in a fixed buffer and turned into strings a chunk at a time: adding one
// character at a time builds a rope of millions of nodes, which for a 10 MB part costs hundreds of MB.
function units() {
  const buf = new Uint16Array(8192), parts = [];
  let n = 0;
  const flush = () => { if (n) { parts.push(String.fromCharCode.apply(null, buf.subarray(0, n))); n = 0; } };
  return {
    push(c) { if (n === buf.length) flush(); buf[n++] = c; },
    point(c) { if (c < 0x10000) this.push(c); else { c -= 0x10000; this.push(0xd800 | c >> 10); this.push(0xdc00 | c & 0x3ff); } },
    done() { flush(); return parts.join(''); },
  };
}
export function decodeBytes(bytes, encoding = 'utf-8', fatal = false) {
  if (encoding === 'latin1') return latin1(bytes);
  if (encoding === 'windows-1252') return latin1(bytes).replace(/[\x80-\x9f]/g, c => CP1252[c.charCodeAt(0) - 128]);
  const out = units();
  if (encoding === 'utf-16le' || encoding === 'utf-16be') {
    if (bytes.length % 2 && fatal) throw new Error('bad_encoding');
    for (let i = 0; i + 1 < bytes.length; i += 2) out.push(encoding === 'utf-16le' ? bytes[i] | bytes[i+1] << 8 : bytes[i] << 8 | bytes[i+1]);
    return out.done();
  }
  for (let i = 0; i < bytes.length;) {
    const a = bytes[i++]; let n, c, min;
    if (a < 128) { out.push(a); continue; }
    if (a >= 194 && a <= 223) { n=1; c=a&31; min=128; }
    else if (a >= 224 && a <= 239) { n=2; c=a&15; min=2048; }
    else if (a >= 240 && a <= 244) { n=3; c=a&7; min=65536; }
    else { if (fatal) throw new Error('bad_encoding'); out.push(0xfffd); continue; }
    let valid = i+n <= bytes.length;
    for (let j=0; j<n && valid; j++) { const b=bytes[i+j]; if ((b&192)!==128) valid=false; else c=c<<6 | b&63; }
    if (!valid || c<min || c>0x10ffff || c>=0xd800 && c<=0xdfff) { if (fatal) throw new Error('bad_encoding'); out.push(0xfffd); continue; }
    i += n; out.point(c);
  }
  const s = out.done();
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}
export function fromHex(s) {
  if (s.length % 2 || /[^a-f\d]/i.test(s)) throw new Error('bad_hex');
  const out = new Uint8Array(s.length / 2);
  for (let i=0;i<out.length;i++) out[i]=parseInt(s.slice(i*2,i*2+2),16);
  return out;
}
export function fromBase64(value, maxBytes = 10 * 1024 * 1024) {
  if (typeof value !== 'string' || value.length > Math.ceil(maxBytes/3)*4 + 1024) throw new Error('bad_base64');
  const s = value.replace(/\s/g, '');
  const padding=s.endsWith('==')?2:s.endsWith('=')?1:0;
  if(s.length%4 || /[^A-Za-z0-9+/]/.test(s.slice(0,s.length-padding))) throw new Error('bad_base64');
  const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', n=s.length/4*3-(s.endsWith('==')?2:s.endsWith('=')?1:0);
  if (n > maxBytes) throw new Error('size');
  const out=new Uint8Array(n); let at=0;
  for(let i=0;i<s.length;i+=4) {
    const a=chars.indexOf(s[i]), b=chars.indexOf(s[i+1]), c=chars.indexOf(s[i+2]), d=chars.indexOf(s[i+3]);
    out[at++]=a<<2|b>>4; if(at<n) out[at++]=b<<4|c>>2; if(at<n) out[at++]=c<<6|d;
  }
  return out;
}
export function concatBytes(parts) {
  const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0)); let at=0;
  for(const p of parts) { out.set(p,at); at+=p.length; }
  return out;
}
let CRC = null;
export function crc32(bytes) {
  if (!CRC) { CRC = new Int32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c >>> 1 ^ (c & 1 ? 0xedb88320 : 0); CRC[n] = c; } }
  let c = -1;
  for (let i = 0; i < bytes.length; i++) c = c >>> 8 ^ CRC[(c ^ bytes[i]) & 255];
  return (c ^ -1) >>> 0;
}
// Outlook on the web's runtime replaces String.prototype.startsWith/endsWith with versions that
// ignore the position argument, so core code never passes one: it compares a slice instead.
export const startsAt = (text, prefix, at) => text.slice(at, at + prefix.length) === prefix;
