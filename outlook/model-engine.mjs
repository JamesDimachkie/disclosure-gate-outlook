// Browser-only dedicated worker. ORT is bundled here, never in the ES2016 event script.
import * as ort from 'onnxruntime-web/wasm';
import { createClassifier } from '../model/classifier.mjs';
import { createInputAdmission, mergeAdmitted } from './model-input.mjs';
let classifier, admit;
globalThis.onmessage = async ({ data }) => {
  try {
    if (data.type === 'init' && !classifier) {
      const origin = new URL(globalThis.location.href).origin;
      for (const url of Object.values(data.paths)) if (new URL(url).origin !== origin) throw new Error('model_origin');
      ort.env.wasm.numThreads = 1;
      ort.env.wasm.proxy = false;
      ort.env.wasm.wasmPaths = { mjs: data.paths['ort-wasm-simd-threaded.mjs'], wasm: data.paths['ort-wasm-simd-threaded.wasm'] };
      ort.env.wasm.wasmBinary = data.wasmBytes;
      admit = createInputAdmission(data.tokenizerJson, data.labelsJson);
      classifier = await createClassifier({ ort, modelBytes: new Uint8Array(data.modelBytes), tokenizerJson: data.tokenizerJson, labelsJson: data.labelsJson });
      globalThis.postMessage({ type: 'ready' });
    } else if (data.type === 'classify' && classifier) {
      // Sentences too long for the model's window are left unread one by one (marked `unread`), so one
      // long line no longer costs the whole email its model pass.
      const plan = admit(data.items);
      const read = plan.admitted.length ? await classifier.classify(plan.admitted) : [];
      globalThis.postMessage({ type: 'result', result: mergeAdmitted(data.items.length, plan, read) });
    } else throw new Error('model_state');
  } catch {
    // Never return exception text: tokenizers/ORT can include input text in an exception.
    globalThis.postMessage({ type: 'error' });
  }
};
