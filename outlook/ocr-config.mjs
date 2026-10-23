// No Tesseract defaults may choose a CDN. Paths are relative to our static page, also under a
// nested admin host path. Absolute resolution is checked before any script or worker is created.
export const OCR_ASSETS = Object.freeze({ enginePath: './ocr/engine.js', workerPath: './ocr/worker.min.js', corePath: './ocr/tesseract-core-lstm.js', langPath: './ocr/lang' });
export function ocrPaths(href, paths = OCR_ASSETS) {
  const page = new URL(href), out = {};
  if (!['https:', 'http:'].includes(page.protocol)) throw new Error('ocr_origin');
  for (const key of ['enginePath', 'workerPath', 'corePath', 'langPath']) {
    const path = paths[key];
    if (typeof path !== 'string' || !path.startsWith('./') || path.includes('..') || path.includes('\\')) throw new Error('ocr_origin');
    const url = new URL(path, page);
    if (url.origin !== page.origin || url.username || url.password || url.search || url.hash) throw new Error('ocr_origin');
    out[key] = url.href;
  }
  return out;
}
