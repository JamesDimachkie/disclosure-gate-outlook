import { createWorker } from 'tesseract.js';
import { readImage } from './ocr-recognize.mjs';
import { ocrPaths } from './ocr-config.mjs';
let worker, starting, handles = new Set();
async function getWorker() {
  if (!starting) {
    // Keep the native handle so a failed initialization can also be terminated, before the
    // Tesseract worker API promise has resolved. Restore the constructor synchronously.
    const NativeWorker = globalThis.Worker;
    globalThis.Worker = function(...args) { const w = new NativeWorker(...args); handles.add(w); return w; };
    try { starting = createWorker('eng', 1, { ...ocrPaths(location.href), workerBlobURL: false, cacheMethod: 'none', gzip: true, errorHandler: () => {} }).then(w => (worker = w)); }
    finally { globalThis.Worker = NativeWorker; }
  }
  return starting;
}
// One worker, one image at a time. The coordinator serializes all attachment work.
globalThis.GuardcellOcrEngine = {
  async recognize(bytes) { return readImage(await getWorker(), bytes); },
  async close() { for (const w of handles) w.terminate(); handles.clear(); worker = null; starting = null; },
};
