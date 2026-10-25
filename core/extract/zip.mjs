// A minimal ZIP reader for DOCX and XLSX: the central directory, stored and deflated entries, nothing
// else. Encrypted entries, ZIP64 and other methods are refused, which makes the file "can't check".
import { inflateRaw as inflateRawSync } from './inflate.mjs';
import { decodeBytes, crc32 } from '../bytes.mjs';
const u16=(b,p)=>new DataView(b.buffer,b.byteOffset,b.byteLength).getUint16(p,true);
const u32=(b,p)=>new DataView(b.buffer,b.byteOffset,b.byteLength).getUint32(p,true);

const EOCD = 0x06054b50, CENTRAL = 0x02014b50, LOCAL = 0x04034b50;
export const MAX_ENTRY_BYTES = 10 * 1024 * 1024;

export class ZipError extends Error {}

function findEnd(buf) {
  const min = Math.max(0, buf.length - 22 - 0xffff);
  for (let i = buf.length - 22; i >= min; i--) if (u32(buf,i) === EOCD) return i;
  throw new ZipError('not_a_zip');
}

// True when an Info-ZIP Unicode Path field (0x7075) names the entry differently from its header.
// Readers that honour the field and readers that don't would then see different files under the
// same name, so the package can't be checked.
function unicodePath(raw, extra, name) {
  for (let q = 0; q + 4 <= extra.length;) {
    const id = u16(extra, q), len = u16(extra, q + 2), body = extra.subarray(q + 4, q + 4 + len);
    if (body.length !== len) break; // padding some writers leave, not a field
    if (id === 0x7075 && len >= 5 && body[0] === 1 && u32(body, 1) === crc32(raw) && decodeBytes(body.subarray(5), 'utf-8', true) !== name) return true;
    q += 4 + len;
  }
  return false;
}

// Map of entry name → {method, compressed, size, offset, flags}.
export function listEntries(buf) {
  if (!(buf instanceof Uint8Array) || buf.length < 22) throw new ZipError('not_a_zip');
  const end = findEnd(buf);
  const count = u16(buf,end + 10);
  let p = u32(buf,end + 16);
  if (count === 0xffff || p === 0xffffffff) throw new ZipError('zip64_unsupported');
  const entries = new Map(); let total=0;
  if(u16(buf,end+4)||u16(buf,end+6)) throw new ZipError('multi_disk');
  const directoryEnd = p + u32(buf, end + 12);
  if (u16(buf, end + 8) !== count || directoryEnd > end || end + 22 + u16(buf, end + 20) > buf.length) throw new ZipError('bad_central_directory');
  for (let i = 0; i < count; i++) {
    if (p + 46 > buf.length || u32(buf,p) !== CENTRAL) throw new ZipError('bad_central_directory');
    const flags = u16(buf,p + 8), method = u16(buf,p + 10);
    const compressed = u32(buf,p + 20), size = u32(buf,p + 24);
    const nameLen = u16(buf,p + 28), extraLen = u16(buf,p + 30), commentLen = u16(buf,p + 32);
    const offset = u32(buf,p + 42), crc = u32(buf,p + 16);
    if(p+46+nameLen+extraLen+commentLen>buf.length) throw new ZipError('truncated');
    const raw = buf.subarray(p + 46, p + 46 + nameLen);
    const name = decodeBytes(raw, flags & 0x800 ? 'utf-8' : 'latin1', true);
    if (unicodePath(raw, buf.subarray(p + 46 + nameLen, p + 46 + nameLen + extraLen), name)) throw new ZipError('ambiguous_name');
    if(entries.has(name)) throw new ZipError('duplicate_entry');
    total+=size; if(size>MAX_ENTRY_BYTES||total>20*1024*1024) throw new ZipError('entry_too_large');
    entries.set(name, { method, compressed, size, offset, flags, crc, name });
    p += 46 + nameLen + extraLen + commentLen;
  }
  if (p !== directoryEnd) throw new ZipError('bad_central_directory');
  return entries;
}

export function readEntry(buf, entry) {
  if (entry.flags & 0x1) throw new ZipError('encrypted');
  if (entry.size > MAX_ENTRY_BYTES) throw new ZipError('entry_too_large');
  const p = entry.offset;
  if (p + 30 > buf.length || u32(buf,p) !== LOCAL) throw new ZipError('bad_local_header');
  const nameEnd = p + 30 + u16(buf, p + 26), extraEnd = nameEnd + u16(buf, p + 28);
  if (extraEnd > buf.length || u16(buf, p + 6) !== entry.flags || u16(buf, p + 8) !== entry.method) throw new ZipError('bad_local_header');
  const raw = buf.subarray(p + 30, nameEnd);
  const name = decodeBytes(raw, entry.flags & 0x800 ? 'utf-8' : 'latin1', true);
  if (name !== entry.name || unicodePath(raw, buf.subarray(nameEnd, extraEnd), name)) throw new ZipError('ambiguous_name');
  // With bit 3 set, the final sizes and CRC live in a data descriptor and the directory.
  if (!(entry.flags & 8) && (u32(buf, p + 14) !== entry.crc || u32(buf, p + 18) !== entry.compressed || u32(buf, p + 22) !== entry.size)) throw new ZipError('bad_local_header');
  const start = p + 30 + u16(buf,p + 26) + u16(buf,p + 28);
  const data = buf.subarray(start, start + entry.compressed);
  if (data.length !== entry.compressed) throw new ZipError('truncated');
  if (entry.method === 0) { if(data.length!==entry.size || crc32(data)!==entry.crc) throw new ZipError('bad_crc'); return data; }
  if (entry.method === 8) {
    const out = inflateRawSync(data, { maxOutputLength: Math.min(entry.size,MAX_ENTRY_BYTES) });
    if(crc32(out)!==entry.crc) throw new ZipError('bad_crc');
    if (out.length !== entry.size) throw new ZipError('size_mismatch');
    return out;
  }
  throw new ZipError('unsupported_method');
}
