// Hand-built PDFs for tests: objects in order (object n is objects[n - 1]), then a correct
// cross-reference table. Synthetic content only.
import { deflateSync } from 'node:zlib';

export function makePdf(objects, { trailer = '', prefix = '' } = {}) {
  const parts = [Buffer.from('%PDF-1.7\n' + prefix, 'latin1')];
  const offsets = [];
  let length = parts[0].length;
  objects.forEach((body, i) => {
    offsets.push(length);
    const chunk = Buffer.concat([Buffer.from(`${i + 1} 0 obj\n`, 'latin1'), Buffer.isBuffer(body) ? body : Buffer.from(body, 'latin1'), Buffer.from('\nendobj\n', 'latin1')]);
    parts.push(chunk);
    length += chunk.length;
  });
  const xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R ${trailer}>>\nstartxref\n${length}\n%%EOF\n`;
  return Buffer.concat([...parts, Buffer.from(xref, 'latin1')]);
}

export const stream = (content, { flate = false, dict = '' } = {}) => {
  const raw = Buffer.isBuffer(content) ? content : Buffer.from(content, 'latin1');
  const data = flate ? deflateSync(raw) : raw;
  return Buffer.concat([Buffer.from(`<< /Length ${data.length} ${flate ? '/Filter /FlateDecode ' : ''}${dict}>>\nstream\n`, 'latin1'), data, Buffer.from('\nendstream', 'latin1')]);
};

// One page in Helvetica (WinAnsi) drawing `content`; `more` objects follow as 6, 7, ... and
// `resources` adds to the page's resource dictionary.
export const onePage = (content, { more = [], resources = '', flate = false, prefix = '' } = {}) => makePdf([
  '<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  `<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> ${resources}>> /MediaBox [0 0 612 792] /Contents 5 0 R >>`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', stream(content, { flate }), ...more], { prefix });
