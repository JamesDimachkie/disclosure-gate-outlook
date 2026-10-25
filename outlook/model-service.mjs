import { MODEL_FILES, modelPaths, modelCapable } from './model-config.mjs';
import { SEMANTIC_BUDGET_MS } from '../core/semantic.mjs';

export const MODEL_PRELOAD_MS = 20000;
// Sentences per worker message, and how long before the deadline the last chunk may start.
const CLASSIFY_CHUNK = 16, CHUNK_MARGIN_MS = 150;
const CACHE_PREFIX = 'dg-semantic-v1-';
const skipped = reason => Object.assign(new Error('model_skipped'), { semanticReason: reason });
// Persistent caches contain only public files. Never cache mail, tokenized inputs or predictions.
export function createModelService(root, manifest) {
  let loading, worker, ready, rejectInit, pending, active = false, preparing, generation = 0;
  const objectUrls = [];
  const capable = () => modelCapable(root);
  const available = () => manifest?.available === true && /^[a-f0-9]{64}$/.test(manifest.revision) &&
    MODEL_FILES.every(name => /^[a-f0-9]{64}$/.test(manifest.files?.[name]?.sha256) &&
      Number.isSafeInteger(manifest.files[name].bytes) && manifest.files[name].bytes > 0);
  const paths = () => modelPaths(root.location.href, manifest.revision);
  const cacheName = () => CACHE_PREFIX + manifest.revision;
  async function cacheStore() {
    try { return await root.caches?.open(cacheName()); } catch { return null; }
  }
  async function pruneCaches() {
    try {
      for (const name of await root.caches.keys()) {
        if (name.startsWith(CACHE_PREFIX) && name !== cacheName()) await root.caches.delete(name);
      }
    } catch { /* Quota/privacy settings must not make model preparation mandatory. */ }
  }
  async function verified(response, name) {
    if (!response?.ok) throw skipped('not_ready');
    // No redirected/CDN response can be admitted, even when a cache has been poisoned.
    if (response.url && response.url !== paths()[name]) throw skipped('invalid');
    const bytes = await response.arrayBuffer(), entry = manifest.files[name];
    if (bytes.byteLength !== entry.bytes) throw skipped('invalid');
    const digest = new Uint8Array(await root.crypto.subtle.digest('SHA-256', bytes));
    const hash = Array.from(digest, b => b.toString(16).padStart(2, '0')).join('');
    if (hash !== entry.sha256) throw skipped('invalid');
    return bytes;
  }
  async function readAssets(network, signal, ownGeneration) {
    const alive = () => { if (signal?.aborted || ownGeneration !== generation) throw skipped('timeout'); };
    const cache = await cacheStore(), urls = paths(), data = {};
    // Serial reads bound temporary buffers on low-memory hosts. Send never downloads cold weights.
    for (const name of MODEL_FILES) {
      alive();
      let response;
      try { response = await cache?.match(urls[name]); } catch { /* HTTP fallback on preload only. */ }
      alive();
      if (response) {
        try { data[name] = await verified(response, name); alive(); continue; }
        catch { alive(); try { await cache?.delete(urls[name]); } catch {} }
      }
      if (!network) throw skipped('not_ready');
      response = await root.fetch(urls[name], { method: 'GET', credentials: 'omit', redirect: 'error', cache: 'force-cache', signal });
      const copy = response.clone();
      data[name] = await verified(response, name);
      alive();
      try { await cache?.put(urls[name], copy); } catch { /* Storage denial/eviction is optional. */ }
    }
    alive();
    return data;
  }
  function cancel(reason = 'timeout') {
    generation++;
    preparing?.abort();
    worker?.terminate(); worker = null; ready = null;
    for (const url of objectUrls.splice(0)) root.URL.revokeObjectURL(url);
    const init = rejectInit, work = pending;
    rejectInit = null; pending = null;
    init?.(skipped(reason)); work?.reject(skipped(reason));
  }
  function ensureWorker(network, signal) {
    if (ready) return ready;
    const ownGeneration = generation;
    ready = (async () => {
      const data = await readAssets(network, signal, ownGeneration);
      if (ownGeneration !== generation || signal?.aborted) throw skipped('timeout');
      if (root.GuardcellOcr?.busy?.()) throw skipped('ocr_busy');
      const urls = paths();
      // Execute exact hash-verified bytes. A CSP that refuses Blob workers uses rules only.
      const scriptUrl = bytes => {
        const url = root.URL.createObjectURL(new root.Blob([bytes], { type: 'text/javascript' }));
        objectUrls.push(url); return url;
      };
      const engineUrl = scriptUrl(data['engine.js']);
      urls['ort-wasm-simd-threaded.mjs'] = scriptUrl(data['ort-wasm-simd-threaded.mjs']);
      worker = new root.Worker(engineUrl);
      const currentWorker = worker;
      await new Promise((resolve, reject) => {
        rejectInit = reject;
        worker.onerror = () => { if (worker === currentWorker) cancel('unavailable'); };
        worker.onmessageerror = () => { if (worker === currentWorker) cancel('invalid'); };
        worker.onmessage = ({ data: message }) => {
          if (worker !== currentWorker) return;
          if (message?.type === 'ready' && rejectInit) { rejectInit = null; resolve(); }
          else if (message?.type === 'result' && pending) {
            const work = pending; pending = null; work.resolve(message.result);
          } else if (message?.type === 'skipped' && message.reason === 'input_limit' && pending) {
            const work = pending; pending = null; work.reject(skipped('input_limit'));
          } else cancel('unavailable');
        };
        // Transfer verified buffers once. Only the live worker/session keeps them; no second
        // model/WASM clone or coordinator copy survives initialization. Never transfer mail.
        worker.postMessage({ type: 'init', modelBytes: data['model.onnx'], wasmBytes: data['ort-wasm-simd-threaded.wasm'],
          tokenizerJson: JSON.parse(new root.TextDecoder().decode(data['tokenizer.json'])),
          labelsJson: JSON.parse(new root.TextDecoder().decode(data['labels.json'])), paths: urls },
        [data['model.onnx'], data['ort-wasm-simd-threaded.wasm']]);
      });
    })();
    return ready;
  }
  async function preload({ deadline = Date.now() + MODEL_PRELOAD_MS } = {}) {
    if (!capable() || !available() || active) return;
    if (loading) return loading;
    const budget = Math.max(0, Math.min(MODEL_PRELOAD_MS, deadline - Date.now()));
    if (!budget) return;
    const controller = new root.AbortController();
    preparing = controller;
    loading = (async () => {
      let timer;
      try {
        await Promise.race([
          ensureWorker(true, controller.signal).then(pruneCaches),
          new Promise((_, reject) => { timer = setTimeout(() => { cancel(); reject(skipped('timeout')); }, budget); }),
        ]);
      } catch { cancel(); /* Optional preparation cannot fail the Outlook event. */ }
      finally { clearTimeout(timer); if (preparing === controller) preparing = null; loading = null; }
    })();
    return loading;
  }
  async function classify(items, deadline) {
    if (!capable()) throw skipped('unsupported');
    if (!available()) throw skipped('unavailable');
    if (active) throw skipped('busy');
    if (root.GuardcellOcr?.busy?.()) throw skipped('ocr_busy');
    if (Date.now() >= deadline) throw skipped('timeout');
    active = true;
    const ownGeneration = generation;
    // Sentences go to the worker a chunk at a time, in email order. If time runs out, the chunks
    // already classified are kept (marked partial) rather than thrown away: a long email on a slow
    // computer still gets the model on its first sentences instead of on none.
    const done = [];
    const partial = () => { const out = done.slice(); out.partial = true; return out; };
    let timer;
    try {
      const work = (async () => {
        await ensureWorker(false);
        for (let at = 0; at < items.length; at += CLASSIFY_CHUNK) {
          if (ownGeneration !== generation) throw skipped('timeout');
          if (at > 0 && Date.now() >= deadline - CHUNK_MARGIN_MS) return partial();
          if (Date.now() >= deadline) throw skipped('timeout');
          if (root.GuardcellOcr?.busy?.()) throw skipped('ocr_busy');
          const part = await new Promise((resolve, reject) => {
            pending = { resolve, reject };
            worker.postMessage({ type: 'classify', items: items.slice(at, at + CLASSIFY_CHUNK) });
          });
          if (!Array.isArray(part)) throw skipped('invalid');
          done.push(...part);
        }
        return done;
      })();
      work.catch(() => {});
      const result = await Promise.race([work, new Promise((resolve, reject) => {
        timer = setTimeout(() => (done.length ? resolve(partial()) : reject(skipped('timeout'))), Math.max(0, deadline - Date.now()));
      })]);
      // A partial result stops the chunk still running; a complete one leaves the session warm.
      if (result.partial) cancel();
      return result;
    } catch (error) { cancel(); throw error; }
    finally { clearTimeout(timer); pending = null; active = false; }
  }
  return { capable, preload, cancel,
    // A fresh runtime pays verification/init; repeat Sends reuse only this runtime's session.
    // Outlook may destroy it at event.completed(), so persistent public caches remain required.
    forSend: deadline => ({ classify: items => classify(items, Math.min(deadline, Date.now() + SEMANTIC_BUDGET_MS)), cancel }),
    classify: (items, { budgetMs = SEMANTIC_BUDGET_MS } = {}) => classify(items, Date.now() + budgetMs),
    stopForOcr() { cancel('ocr_busy'); },
  };
}
