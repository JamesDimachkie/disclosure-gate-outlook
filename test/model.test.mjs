import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, webcrypto } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import vm from 'node:vm';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { createModelService } from '../outlook/model-service.mjs';
import { modelCapable, modelPaths, MODEL_FILES } from '../outlook/model-config.mjs';
import { checkDraft } from '../core/gate.mjs';
import { createOcrService } from '../outlook/ocr-service.mjs';
import { load, demo } from './runtime-helper.mjs';
import { draft, CLEAN_BODY, PNG_B64, PNG_SIZE } from './helpers.mjs';

const digest = b => createHash('sha256').update(b).digest('hex');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const result = items => items.map(() => ({ label: 'personal', score: 0.99, scores: {} }));
function harness({ cacheDenied = false, workerHangs = false, workerFails = false, fetchFails = false, initHangs = false } = {}) {
  const bytes = Object.fromEntries(MODEL_FILES.map(n => [n, Buffer.from(n.endsWith('.json') ? '{}' : 'public asset ' + n)]));
  const manifest = { available: true, revision: 'a'.repeat(64), files: Object.fromEntries(MODEL_FILES.map(n => [n, { bytes: bytes[n].length, sha256: digest(bytes[n]) }])) };
  const entries = new Map(), requests = [], workers = [], cacheNames = [], objectUrls = new Map(), revoked = [], storedCaches = new Set(), deletedCaches = [];
  let cacheReads = 0, hashes = 0;
  const cache = { match: async key => { cacheReads++; return entries.get(key)?.clone(); }, put: async (key, response) => entries.set(key, response.clone()), delete: async key => entries.delete(key) };
  const root = { document: { head: {} }, location: { href: 'https://static.example/sub/commands.html?findings=ask' }, WebAssembly, BigInt, BigInt64Array, TextEncoder, TextDecoder, AbortController, Blob,
    URL: { createObjectURL: blob => { const url = 'blob:https://static.example/' + objectUrls.size; objectUrls.set(url, blob); return url; }, revokeObjectURL: url => revoked.push(url) }, crypto: { subtle: { digest: (...args) => { hashes++; return webcrypto.subtle.digest(...args); } } },
    caches: { open: async name => { cacheNames.push(name); if (cacheDenied) throw new Error('denied'); storedCaches.add(name); return cache; },
      keys: async () => [...storedCaches], delete: async name => { deletedCaches.push(name); return storedCaches.delete(name); } },
    fetch: async (url, options) => { requests.push({ url, options }); if (fetchFails) throw new Error('offline'); const name = new URL(url).pathname.split('/').at(-1); return new Response(bytes[name]); },
    Worker: class {
      constructor(url) { this.url = url; this.messages = []; this.transfers = []; this.terminated = false; workers.push(this); }
      postMessage(message, transfer = []) {
        this.transfers.push(transfer.map(b => b.byteLength));
        message = structuredClone(message, { transfer }); this.messages.push(message);
        if (message.type === 'init' ? initHangs : workerHangs) return;
        queueMicrotask(() => {
          if (this.terminated) return;
          if (workerFails && message.type === 'classify') this.onerror?.({ message: 'Ordinary detail.' });
          else this.onmessage?.({ data: message.type === 'init' ? { type: 'ready' } : { type: 'result', result: result(message.items) } });
        });
      }
      terminate() { this.terminated = true; }
    },
  };
  const service = createModelService(root, manifest);
  return { root, manifest, bytes, entries, cache, cacheNames, storedCaches, deletedCaches, requests, workers, service, objectUrls, revoked, urls: modelPaths(root.location.href, manifest.revision), counts: () => ({ cacheReads, hashes }) };
}
const external = () => draft({ subject: '', body: { text: 'Ordinary detail.' } });

test('model capability probe requires browser APIs, SIMD and cryptographic asset verification', () => {
  const h = harness(); assert.equal(modelCapable(h.root), true);
  for (const key of ['document', 'Worker', 'WebAssembly', 'BigInt', 'BigInt64Array', 'TextEncoder', 'TextDecoder', 'fetch', 'AbortController', 'crypto', 'Blob', 'URL']) {
    assert.equal(modelCapable({ ...h.root, [key]: undefined }), false, key);
  }
  assert.equal(modelCapable({ ...h.root, WebAssembly: { validate: () => false } }), false);
  assert.equal(modelCapable({ ...h.root, WebAssembly: { validate: () => { throw new Error('denied'); } } }), false);
  for (const href of ['file:///C:/runtime.html', 'data:text/html,x', 'https://user:pass@static.example/a.html']) assert.throws(() => modelPaths(href, h.manifest.revision));
  assert.throws(() => modelPaths(h.root.location.href, '../anything'));
  for (const url of Object.values(h.urls)) { assert.equal(new URL(url).origin, 'https://static.example'); assert.equal(new URL(url).searchParams.get('v'), h.manifest.revision); assert.match(new URL(url).pathname, /^\/sub\/model\//); }
});

test('compose preload caches only verified own-origin public assets; Send transfers mail only to a local worker', async () => {
  const h = harness(); await h.service.preload();
  assert.equal(h.requests.length, 6); assert.equal(h.entries.size, 6);
  assert.ok(h.requests.every(r => r.options.method === 'GET' && r.options.credentials === 'omit' && r.options.redirect === 'error' && !r.options.body));
  assert.ok(h.cacheNames.every(n => n === 'dg-semantic-v1-' + h.manifest.revision));
  const r = await checkDraft(external(), { semantic: h.service.forSend(Date.now() + 1500) });
  assert.equal(r.checked.semantic, 'used'); assert.equal(r.findings[0].found_by, 'model');
  assert.equal(h.requests.length, 6, 'Send does not fetch a cold model or tokenizer');
  const [w] = h.workers; assert.match(w.url, /^blob:https:\/\/static\.example\//); assert.equal(w.terminated, false);
  assert.equal(await h.objectUrls.get(w.url).text(), h.bytes['engine.js'].toString());
  assert.equal(h.revoked.length, 0);
  assert.deepEqual(w.messages[1], { type: 'classify', items: [{ text: 'Ordinary detail.', context: '' }] });
  assert.deepEqual(Buffer.from(w.messages[0].modelBytes), h.bytes['model.onnx']);
  assert.deepEqual(Buffer.from(w.messages[0].wasmBytes), h.bytes['ort-wasm-simd-threaded.wasm']);
  assert.deepEqual(w.transfers, [[h.bytes['model.onnx'].length, h.bytes['ort-wasm-simd-threaded.wasm'].length], []]);
  for (const response of h.entries.values()) assert.doesNotMatch(await response.clone().text(), /Ordinary detail/);
  h.service.cancel(); assert.equal(w.terminated, true); assert.equal(h.revoked.length, 2);
});

test('a new Send runtime can initialize from persistent assets without a preload or weight fetch', async () => {
  const h = harness(); await h.service.preload(); h.service.cancel(); h.workers.length = 0; h.requests.length = 0;
  const fresh = createModelService(h.root, h.manifest);
  assert.equal((await checkDraft(external(), { semantic: fresh })).checked.semantic, 'used');
  assert.equal(h.requests.length, 0); assert.equal(h.workers.length, 1);
});

test('repeat Sends reuse the verified session without cache reads, hashes or new workers', async () => {
  const h = harness(); await h.service.preload();
  const prepared = h.counts();
  for (let i = 0; i < 3; i++) assert.equal((await checkDraft(external(), { semantic: h.service })).checked.semantic, 'used');
  assert.deepEqual(h.counts(), prepared); assert.equal(h.workers.length, 1);
  assert.equal(h.workers[0].messages.filter(m => m.type === 'init').length, 1);
  h.service.stopForOcr();
  assert.equal(h.workers[0].terminated, true); assert.equal(h.revoked.length, 2);
  assert.equal((await checkDraft(external(), { semantic: h.service })).checked.semantic, 'used');
  assert.equal(h.workers.length, 2); assert.equal(h.counts().hashes, prepared.hashes + 6);
});

test('successful preload deletes only stale semantic caches; failed preload preserves them', async () => {
  const stale = 'dg-semantic-v1-' + 'b'.repeat(64), other = 'dg-ocr-v1-keep';
  const h = harness(); h.storedCaches.add(stale); h.storedCaches.add(other);
  await h.service.preload();
  assert.deepEqual(h.deletedCaches, [stale]);
  assert.deepEqual([...h.storedCaches].sort(), [other, 'dg-semantic-v1-' + h.manifest.revision].sort());
  const failed = harness({ fetchFails: true }); failed.storedCaches.add(stale);
  await failed.service.preload(); assert.deepEqual(failed.deletedCaches, []);
  const denied = harness(); denied.root.caches.keys = async () => { throw new Error('denied'); };
  await denied.service.preload(); assert.equal((await checkDraft(external(), { semantic: denied.service })).checked.semantic, 'used');
});

test('preload also bounds worker initialization and terminates a hung worker', async () => {
  const h = harness({ initHangs: true });
  await h.service.preload({ deadline: Date.now() + 40 });
  assert.equal(h.workers.length, 1); assert.equal(h.workers[0].terminated, true);
  assert.equal(h.revoked.length, 2);
});

test('concurrent Sends skip busy; timeout destroys a reused session and the next Send re-verifies', async () => {
  const h = harness({ workerHangs: true }); await h.service.preload();
  const counts = h.counts(), pending = checkDraft(external(), { semantic: h.service.forSend(Date.now() + 30) });
  await delay(2);
  assert.equal((await checkDraft(external(), { semantic: h.service })).checked.semantic, 'skipped:busy');
  assert.equal((await pending).checked.semantic, 'skipped:timeout');
  assert.equal(h.workers[0].terminated, true); assert.deepEqual(h.counts(), counts);
  const original = h.root.Worker;
  h.root.Worker = class extends original { postMessage(message, transfer) {
    if (message.type === 'classify') queueMicrotask(() => this.onmessage({ data: { type: 'result', result: result(message.items) } }));
    else super.postMessage(message, transfer);
  } };
  assert.equal((await checkDraft(external(), { semantic: h.service })).checked.semantic, 'used');
  assert.equal(h.counts().hashes, counts.hashes + 6); assert.equal(h.workers.length, 2);
});

test('cold Send, denied cache, unavailable export, failed download and unsupported host all use rules only', async () => {
  for (const mode of ['cold', 'cacheDenied', 'unavailable', 'fetchFails', 'unsupported']) {
    const h = harness({ cacheDenied: mode === 'cacheDenied', fetchFails: mode === 'fetchFails' });
    if (mode === 'unavailable') h.manifest.available = false;
    if (mode === 'unsupported') h.root.document = undefined;
    if (mode === 'fetchFails') await h.service.preload();
    const r = await checkDraft(external(), { semantic: h.service });
    assert.equal(r.state, 'clear'); assert.notEqual(r.hasFailures, true); assert.match(r.checked.semantic, /^skipped:/);
    assert.equal(h.workers.length, 0); assert.equal(h.requests.length, mode === 'fetchFails' ? 1 : 0);
  }
  const h = harness({ cacheDenied: true }); await h.service.preload();
  assert.equal((await checkDraft(external(), { semantic: h.service })).checked.semantic, 'used', 'preload memory is usable when storage is denied');
  assert.equal((await checkDraft(external(), { semantic: createModelService(h.root, h.manifest) })).checked.semantic, 'skipped:not_ready');
});

test('corrupt/old cached public bytes are rejected and no model worker is started', async () => {
  const h = harness(); await h.service.preload();
  h.service.cancel(); h.workers.length = 0;
  h.entries.set(h.urls['model.onnx'], new Response('corrupt model'));
  const fresh = createModelService(h.root, h.manifest), count = h.requests.length;
  assert.equal((await checkDraft(external(), { semantic: fresh })).checked.semantic, 'skipped:not_ready');
  assert.equal(h.workers.length, 0); assert.equal(h.requests.length, count);
  await fresh.preload(); assert.equal(h.requests.length, count + 1, 'preload repairs only the corrupt asset');
  assert.equal((await checkDraft(external(), { semantic: fresh })).checked.semantic, 'used');
  const changed = createModelService(h.root, { ...h.manifest, revision: 'b'.repeat(64) });
  assert.equal((await checkDraft(external(), { semantic: changed })).checked.semantic, 'skipped:not_ready');
});

test('redirected cache entries and blocked Blob workers are optional-model failures only', async () => {
  const h = harness(); await h.service.preload();
  h.service.cancel(); h.workers.length = 0;
  const response = new Response(h.bytes['model.onnx']);
  Object.defineProperty(response, 'url', { value: 'https://cdn.example/model.onnx' });
  const match = h.cache.match; h.cache.match = async url => url === h.urls['model.onnx'] ? response : match(url);
  assert.equal((await checkDraft(external(), { semantic: createModelService(h.root, h.manifest) })).checked.semantic, 'skipped:not_ready');
  assert.equal(h.workers.length, 0);
  h.cache.match = match; h.entries.set(h.urls['model.onnx'], new Response(h.bytes['model.onnx']));
  h.root.Worker = class { constructor() { throw new Error('CSP refused worker'); } };
  const r = await checkDraft(external(), { semantic: h.service });
  assert.equal(r.state, 'clear'); assert.equal(r.checked.semantic, 'skipped:error'); assert.equal(h.revoked.length, 4);
});

test('compose preparation has a deadline, aborts hung downloads, and ignores already-expired events', async () => {
  const h = harness(); let aborted = false;
  h.root.fetch = async (_url, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', () => { aborted = true; reject(new Error('aborted')); }));
  await h.service.preload({ deadline: Date.now() + 15 });
  assert.equal(aborted, true); assert.equal(h.entries.size, 0);
  const untouched = harness(); await untouched.service.preload({ deadline: Date.now() - 1 });
  assert.equal(untouched.requests.length, 0);
});

test('worker errors and timeouts terminate the worker without failing or later changing Send', async () => {
  for (const failure of ['workerFails', 'workerHangs']) {
    const h = harness({ [failure]: true }); await h.service.preload();
    const r = await checkDraft(external(), { semantic: h.service.forSend(Date.now() + 25), semanticBudgetMs: 30 });
    assert.equal(r.state, 'clear'); assert.notEqual(r.hasFailures, true);
    assert.equal(r.checked.semantic, failure === 'workerFails' ? 'skipped:unavailable' : 'skipped:timeout');
    assert.equal(h.workers[0].terminated, true);
    h.workers[0].onmessage({ data: { type: 'result', result: result([{ text: 'late' }]) } });
    assert.deepEqual(r.findings, []);
  }
});

test('a slow cache read cannot start a worker after the Send budget has expired', async () => {
  const h = harness(); await h.service.preload();
  h.service.cancel(); h.workers.length = 0;
  let release;
  const original = h.cache.match; h.cache.match = key => new Promise(resolve => { release = () => resolve(original(key)); });
  const fresh = createModelService(h.root, h.manifest);
  const r = await checkDraft(external(), { semantic: fresh.forSend(Date.now() + 20), semanticBudgetMs: 25 });
  assert.equal(r.state, 'clear'); assert.equal(r.checked.semantic, 'skipped:timeout');
  h.cache.match = original; release(); await delay(15);
  assert.equal(h.workers.length, 0);
});

test('OCR preempts model work and a busy OCR runtime skips semantic initialization', async () => {
  const h = harness({ workerHangs: true }); await h.service.preload();
  const pending = checkDraft(external(), { semantic: h.service });
  await delay(5); assert.equal(h.workers.length, 1);
  h.service.stopForOcr();
  assert.equal((await pending).checked.semantic, 'skipped:ocr_busy'); assert.equal(h.workers[0].terminated, true);
  h.root.DisclosureGateOcr = { busy: () => true };
  assert.equal((await checkDraft(external(), { semantic: h.service })).checked.semantic, 'skipped:ocr_busy');
  assert.equal(h.workers.length, 1);
});

test('OCR coordinator cancels model work before its recognizer starts', async () => {
  const order = [], ok = value => ({ status: 'succeeded', value });
  const a = { id: 'p', name: 'image.png', size: PNG_SIZE, type: 'file', content: PNG_B64 };
  const item = { getAttachmentsAsync: cb => cb(ok([a])) };
  const root = { document: {}, Worker: function() {}, WebAssembly, BigInt,
    DisclosureGateSemantic: { stopForOcr: () => order.push('stop') },
    DisclosureGateOcrEngine: { recognize: async () => { order.push('recognize'); return { status: 'ready', text: '' }; }, close: async () => {} } };
  const ocr = createOcrService(root), office = { context: { mailbox: { item } } };
  await ocr.prepare(office, [a]); await ocr.wait(office, Date.now() + 1000);
  assert.deepEqual(order, ['stop', 'recognize']);
});

test('compose and attachment-change events await bounded asset preparation and complete once', async () => {
  const calls = []; let prepared = false;
  const l = load({ url: 'https://static.example/sub/runtime.js?dg=2&mode=enforce&domains=&model=on', state: demo({ body: CLEAN_BODY }), globals: { DisclosureGateSemantic: { preload: async options => { calls.push(options.deadline); await delay(5); prepared = true; } } } });
  for (const name of ['onMessageComposeHandler', 'onMessageAttachmentsChangedHandler']) {
    prepared = false;
    let completed = 0; await l.handlers[name]({ completed: () => { completed++; assert.equal(prepared, true); } });
    assert.equal(completed, 1);
  }
  assert.equal(calls.length, 2); assert.ok(calls.every(d => d > Date.now()));
});

test('real Send bridge passes the remaining deadline and persists model findings for Review', async () => {
  let deadline, budget;
  const l = load({ url: 'https://static.example/sub/runtime.js?dg=2&mode=enforce&domains=&model=on', state: demo({ subject: '', body: 'Ordinary detail.' }),
    check: (d, options, original) => { budget = options.semanticBudgetMs; return original(d, options); },
    globals: { DisclosureGateSemantic: { forSend: d => { deadline = d; return { classify: async items => result(items) }; } } } });
  const started = Date.now(), decision = await l.send();
  assert.equal(decision.allowEvent, false); assert.equal(decision.commandId, 'dgOpenPane');
  assert.ok(deadline >= started + 3900 && deadline <= started + 4100);
  assert.equal(budget, 1500, 'the production handler keeps the cap even though evaluators can lift it');
  const checked = JSON.parse(l.values['dg-result']).result;
  assert.equal(checked.checked.semantic, 'used'); assert.equal(checked.findings[0].found_by, 'model');
});

test('a reduced remaining Send budget times out semantics and still completes Clear once', async () => {
  const l = load(), outcomes = [];
  await l.api.run({ completed: o => outcomes.push(o) }, { deadlineMs: 100, phase: () => {}, reviewButton: () => true,
    read: async () => external(), fingerprint: () => 'same',
    check: (d, options) => l.core.checkDraft(d, { semanticDeadline: options.deadline - 30, semantic: { classify: () => new Promise(() => {}) } }),
  });
  assert.deepEqual(outcomes.map(o => o.allowEvent), [true]);
});

test('model worker bridge pins single-thread WASM, accepts the classifier contract and sanitizes errors', async () => {
  const compiled = await build({ entryPoints: [fileURLToPath(new URL('../outlook/model-engine.mjs', import.meta.url))], bundle: true, write: false, format: 'iife', platform: 'browser', target: 'es2020', logLevel: 'silent',
    plugins: [{ name: 'fake-classifier-and-ort', setup(b) {
      b.onResolve({ filter: /onnxruntime-web\/wasm|@huggingface\/tokenizers|\.\.\/model\/classifier\.mjs/ }, args => ({ path: args.path, namespace: 'fake' }));
      b.onLoad({ filter: /.*/, namespace: 'fake' }, args => ({ contents: args.path.includes('onnxruntime') ? 'export const env={wasm:{}};' : args.path.includes('tokenizers') ? 'export class Tokenizer { encode(text) { return {ids:Array(text.includes("TOO_LONG")?400:10)}; } }' : `export async function createClassifier(options) { globalThis.options=options; return { classify: async items => { globalThis.items=items; return items.map(() => ({label:'personal',score:.99,scores:{}})); } }; }`, loader: 'js' }));
    } }] });
  const messages = [], context = vm.createContext({ URL, location: { href: 'https://static.example/sub/model/engine.js' }, postMessage: m => messages.push(m) });
  vm.runInContext(compiled.outputFiles[0].text, context);
  const h = harness();
  await context.onmessage({ data: { type: 'init', paths: h.urls, modelBytes: new ArrayBuffer(4), wasmBytes: new ArrayBuffer(8), tokenizerJson: {}, labelsJson: { max_length: 128, input: 'text' } } });
  assert.equal(context.options.ort.env.wasm.numThreads, 1); assert.equal(context.options.ort.env.wasm.proxy, false);
  assert.equal(context.options.ort.env.wasm.wasmPaths.mjs, h.urls['ort-wasm-simd-threaded.mjs']);
  assert.equal(context.options.ort.env.wasm.wasmBinary.byteLength, 8);
  await context.onmessage({ data: { type: 'classify', items: [{ text: 'Ordinary detail.', context: '' }] } });
  assert.equal(messages[1].type, 'result'); assert.equal(messages[1].result[0].label, 'personal');
  await context.onmessage({ data: { type: 'classify', items: [{ text: 'TOO_LONG', context: '' }] } });
  assert.deepEqual(JSON.parse(JSON.stringify(messages.at(-1))), { type: 'skipped', reason: 'input_limit' });
  await context.onmessage({ data: { type: 'init', paths: { engine: 'https://cdn.example/model.js' } } });
  assert.deepEqual(JSON.parse(JSON.stringify(messages.at(-1))), { type: 'error' });
});

test('build keeps ORT/classifier/loader out of classic and pins the separate public runtime files', () => {
  const classic = readFileSync(new URL('../dist/runtime.js', import.meta.url), 'utf8');
  assert.doesNotMatch(classic, /onnxruntime|InferenceSession|ort-wasm|dg-semantic-v1|model_origin/);
  const manifest = JSON.parse(readFileSync(new URL('../dist/model/assets.json', import.meta.url)));
  assert.equal(manifest.ort, '1.30.0');
  for (const name of MODEL_FILES) {
    if (!manifest.files[name]) { assert.equal(manifest.available, false); continue; }
    const bytes = readFileSync(new URL('../dist/model/' + name, import.meta.url));
    assert.equal(digest(bytes), manifest.files[name].sha256); assert.equal(bytes.length, manifest.files[name].bytes);
  }
  for (const name of ['ort-wasm-simd-threaded.wasm', 'ort-wasm-simd-threaded.mjs']) assert.deepEqual(readFileSync(new URL('../dist/model/' + name, import.meta.url)), readFileSync(new URL('../node_modules/onnxruntime-web/dist/' + name, import.meta.url)));
  assert.ok(statSync(new URL('../dist/model/engine.js', import.meta.url)).size > 40000, 'ORT is in the separate engine bundle');
  for (const name of ['LICENSE-onnxruntime.txt', 'NOTICE-onnxruntime.txt', 'LICENSE-tokenizers.txt', 'MODEL-NOTICE.txt']) assert.ok(statSync(new URL('../dist/model/' + name, import.meta.url)).size > 100);
});

test('built browser event script retains mandatory Send in unsupported browser hosts', async () => {
  const source = readFileSync(new URL('../dist/runtime-browser.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /InferenceSession|ort-wasm-simd-threaded\.wasm.{0,10}function/);
  const l = load({ url: 'https://static.example/sub/runtime.js?dg=2&mode=enforce&domains=&model=on', source, state: demo({ body: CLEAN_BODY }) });
  assert.equal((await l.send()).allowEvent, true);
  assert.equal(JSON.parse(l.values['dg-result']).result.checked.semantic, 'skipped:unsupported');
  for (const name of ['onMessageComposeHandler', 'onMessageAttachmentsChangedHandler']) { let count = 0; await l.handlers[name]({ completed: () => count++ }); assert.equal(count, 1); }
});

test('a default install (model not turned on) never preloads or calls the model', async () => {
  let preloads = 0, sends = 0;
  const l = load({ state: demo({ body: CLEAN_BODY }), globals: { DisclosureGateSemantic: { preload: async () => { preloads++; }, forSend: () => { sends++; return { classify: async items => items.map(() => ({ label: 'personal', score: 0.99, scores: {} })) }; } } } });
  let completed = 0; await l.handlers.onMessageComposeHandler({ completed: () => { completed++; } });
  assert.equal(completed, 1); assert.equal(preloads, 0);
  const decision = await l.send();
  assert.equal(sends, 0); assert.equal(decision.allowEvent, true);
  assert.equal(JSON.parse(l.values['dg-result']).result.checked.semantic, 'skipped:off');
});
