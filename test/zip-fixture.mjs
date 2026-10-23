import { deflateRawSync, crc32 } from 'node:zlib';
const LOCAL=0x04034b50, CENTRAL=0x02014b50, EOCD=0x06054b50;
// Build a ZIP (deflated entries) for tests and fixtures: {name: string|Buffer}. `extra` gives an
// entry's central-directory extra field by name.
export function makeZip(files, { store = false, extra = {} } = {}) {
  const locals = [], centrals = [];
  let offset = 0;
  for (const [name, value] of Object.entries(files)) {
    const raw = Buffer.isBuffer(value) ? value : Buffer.from(value, 'utf8');
    const body = store ? raw : deflateRawSync(raw);
    const nameBuf = Buffer.from(name, 'utf8');
    const crc = crc32(raw) >>> 0;
    const local = Buffer.alloc(30);
    local.writeUInt32LE(LOCAL, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x800, 6); local.writeUInt16LE(store ? 0 : 8, 8);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(body.length, 18); local.writeUInt32LE(raw.length, 22); local.writeUInt16LE(nameBuf.length, 26);
    const ext = extra[name] || Buffer.alloc(0);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(CENTRAL, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x800, 8); central.writeUInt16LE(store ? 0 : 8, 10);
    central.writeUInt32LE(crc, 16); central.writeUInt32LE(body.length, 20); central.writeUInt32LE(raw.length, 24); central.writeUInt16LE(nameBuf.length, 28); central.writeUInt16LE(ext.length, 30); central.writeUInt32LE(offset, 42);
    locals.push(local, nameBuf, body);
    centrals.push(central, nameBuf, ext);
    offset += 30 + nameBuf.length + body.length;
  }
  const centralBuf = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(EOCD, 0); end.writeUInt16LE(Object.keys(files).length, 8); end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(centralBuf.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, centralBuf, end]);
}
