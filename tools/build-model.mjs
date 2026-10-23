import { build } from 'esbuild';
import { cp, mkdir, readFile, writeFile, stat, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { MODEL_FILES } from '../outlook/model-config.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const exists = async path => { try { return (await stat(path)).isFile(); } catch { return false; } };
export async function buildModel(root) {
  const dir = resolve(root, 'dist/model');
  await mkdir(dir, { recursive: true });
  const classifier = await exists(resolve(root, 'model/classifier.mjs'));
  // Until the model lane supplies its actual source, build an explicitly unavailable engine.
  // This is a throwing build stub, never a fake prediction or a production 'none' result.
  const pending = { name: 'pending-classifier', setup(b) {
    b.onResolve({ filter: /\.\.\/model\/classifier\.mjs$/ }, () => ({ path: 'pending-classifier', namespace: 'pending' }));
    b.onLoad({ filter: /.*/, namespace: 'pending' }, () => ({ contents: 'export async function createClassifier() { throw new Error("model_unavailable"); }', loader: 'js' }));
  } };
  await build({ absWorkingDir: root, entryPoints: ['outlook/model-engine.mjs'], outfile: resolve(dir, 'engine.js'),
    bundle: true, format: 'iife', platform: 'browser', target: 'es2020', minify: true, legalComments: 'eof', logLevel: 'silent',
    conditions: ['onnxruntime-web-use-extern-wasm'], plugins: classifier ? [] : [pending] });
  for (const name of ['ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm']) await cp(resolve(root, 'node_modules/onnxruntime-web/dist', name), resolve(dir, name));
  await cp(resolve(root, 'node_modules/@huggingface/tokenizers/LICENSE'), resolve(dir, 'LICENSE-tokenizers.txt'));
  for (const name of ['LICENSE-onnxruntime.txt', 'NOTICE-onnxruntime.txt', 'LICENSE-ettin.txt', 'MODEL-NOTICE.txt']) await cp(resolve(root, 'outlook', name), resolve(dir, name));

  const data = ['model.onnx', 'tokenizer.json', 'labels.json'];
  const present = await Promise.all(data.map(name => exists(resolve(root, 'model/out', name))));
  const available = classifier && present.every(Boolean);
  // A partial delivery must not accidentally reuse weights from an older dist build.
  for (const name of data) {
    if (available) await cp(resolve(root, 'model/out', name), resolve(dir, name));
    else await rm(resolve(dir, name), { force: true });
  }
  const files = {};
  for (const name of MODEL_FILES) {
    if (!await exists(resolve(dir, name))) continue;
    const bytes = await readFile(resolve(dir, name));
    files[name] = { bytes: bytes.length, sha256: hash(bytes) };
  }
  const manifest = { available, ort: '1.30.0', tokenizer: '0.2.0', files, revision: hash(JSON.stringify(files)) };
  await writeFile(resolve(dir, 'assets.json'), JSON.stringify(manifest, null, 2) + '\n');
  // The revision is compiled into the loader. Send reads this exact cache revision without a
  // manifest fetch, and refuses corrupt/old bytes. No model text or results enter persistent storage.
  await build({ absWorkingDir: root, entryPoints: ['outlook/model-entry.mjs'], outfile: resolve(dir, 'loader.js'),
    bundle: true, format: 'iife', platform: 'browser', target: 'es2020', minify: true, legalComments: 'eof', logLevel: 'silent',
    define: { __DG_MODEL_MANIFEST__: JSON.stringify(manifest) } });
  console.log('Semantic browser assets: ' + (available ? 'real classifier/export included' : 'unavailable (classifier/export pending); rules-only fallback') + '.');
  return manifest;
}
