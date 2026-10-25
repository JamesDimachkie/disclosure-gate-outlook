import test from 'node:test';
import assert from 'node:assert/strict';
import { attachmentText } from '../core/attachments.mjs';
import { officeZip, wdoc, para } from './office-fixture.mjs';
const clean = () => officeZip('docx', { 'word/document.xml': wdoc(para('Synthetic complete document')) });
const read = bytes => attachmentText({ name: 'synthetic.docx', type: 'file', size: bytes.length, content: bytes.toString('base64') });

test('ZIP local flags, method, filename and sizes must agree with the central directory', () => {
  assert.equal(read(clean()).ok, true);
  for (const [offset, width, value, reason] of [[6, 2, 0x801, 'bad_local_header'], [8, 2, 0, 'bad_local_header'], [18, 4, 1, 'bad_local_header'], [30, 1, 0x78, 'ambiguous_name']]) {
    const b = clean(); b['writeUInt' + (width * 8) + (width === 1 ? '' : 'LE')](value, offset);
    assert.deepEqual(read(b), { ok: false, reason });
  }
  // A streaming ZIP writer may legitimately put zero local sizes/CRC before its descriptor.
  const original = clean(), end = original.length - 22, chunks = [], centrals = [];
  let p = original.readUInt32LE(end + 16), offset = 0;
  while (p < end) {
    const local = original.readUInt32LE(p + 42), next = p + 46 + original.readUInt16LE(p + 28) + original.readUInt16LE(p + 30) + original.readUInt16LE(p + 32);
    const central = Buffer.from(original.subarray(p, next)); central.writeUInt16LE(0x808, 8); central.writeUInt32LE(offset, 42);
    const body = Buffer.from(original.subarray(local, local + 30 + original.readUInt16LE(local + 26) + original.readUInt16LE(local + 28) + central.readUInt32LE(20)));
    body.writeUInt16LE(0x808, 6); body.fill(0, 14, 26);
    const descriptor = Buffer.alloc(16); descriptor.writeUInt32LE(0x08074b50); central.copy(descriptor, 4, 16, 28);
    chunks.push(body, descriptor); centrals.push(central); offset += body.length + 16; p = next;
  }
  const eocd = Buffer.from(original.subarray(end)); eocd.writeUInt32LE(offset, 16);
  const b = Buffer.concat([...chunks, ...centrals, eocd]);
  assert.equal(read(b).ok, true);
});

test('ZIP directory count and declared directory size cannot hide unchecked entries', () => {
  for (const [offset, width, value] of [[12, 4, 0], [8, 2, 0], [12, 4, 0x7fffffff]]) {
    const b = clean(); b['writeUInt' + width * 8 + 'LE'](value, b.length - 22 + offset);
    assert.deepEqual(read(b), { ok: false, reason: 'bad_central_directory' });
  }
});
