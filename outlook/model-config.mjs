// All model URLs are fixed public assets on this page's own static origin. No hub/CDN fallback.
export const MODEL_FILES = Object.freeze(['engine.js', 'ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm', 'model.onnx', 'tokenizer.json', 'labels.json']);
export function modelPaths(href, revision) {
  const page = new URL(href);
  if (!['https:', 'http:'].includes(page.protocol) || !/^[a-f0-9]{64}$/.test(revision)) throw new Error('model_origin');
  const paths = {};
  for (const name of MODEL_FILES) {
    const url = new URL('./model/' + name, page);
    if (url.origin !== page.origin || url.username || url.password) throw new Error('model_origin');
    url.searchParams.set('v', revision);
    paths[name] = url.href;
  }
  return paths;
}
export function modelCapable(root) {
  try {
    return !!(root.document?.head && typeof root.Worker === 'function' && typeof root.fetch === 'function' &&
      typeof root.AbortController === 'function' && typeof root.BigInt === 'function' &&
      typeof root.BigInt64Array === 'function' &&
      typeof root.TextEncoder === 'function' && typeof root.TextDecoder === 'function' && root.crypto?.subtle &&
      typeof root.Blob === 'function' && typeof root.URL?.createObjectURL === 'function' && typeof root.URL?.revokeObjectURL === 'function' &&
      root.WebAssembly?.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,22,1,20,0,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11])));
  } catch { return false; }
}
