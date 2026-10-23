import { createTokenizer } from './tokenize.mjs';

/** All model/tokenizer bytes and ORT are supplied by the caller; this module performs no I/O. */
export async function createClassifier({ ort, modelBytes, tokenizerJson, labelsJson }) {
  const expected = ['none', 'access', 'personal', 'economics', 'negotiation', 'remark'];
  const { temperature = 1, none_logit_bias: noneBias = 0 } = labelsJson.calibration || {};
  if (JSON.stringify(labelsJson.labels) !== JSON.stringify(expected) ||
      !['text', 'context_text'].includes(labelsJson.input) ||
      !Number.isInteger(labelsJson.max_length) || labelsJson.max_length < 2 || labelsJson.max_length > 8192 ||
      !Number.isFinite(temperature) || temperature <= 0 || !Number.isFinite(noneBias) ||
      expected.slice(1).some(label => !Number.isFinite(labelsJson.thresholds[label]) || labelsJson.thresholds[label] < 0)) {
    throw new Error('Invalid classifier metadata');
  }
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.proxy = false;
  const tokenizer = createTokenizer(tokenizerJson, labelsJson);
  const session = await ort.InferenceSession.create(modelBytes, {
    executionProviders: ['wasm'], graphOptimizationLevel: 'all', executionMode: 'sequential',
  });
  if (session.inputNames.length !== 2 || session.inputNames.some(name => !['input_ids', 'attention_mask'].includes(name)) ||
      !session.outputNames.includes('logits')) {
    await session.release();
    throw new Error('Unexpected classifier model interface');
  }
  let queue = Promise.resolve();
  let disposed = false;
  async function run(items) {
    if (disposed) throw new Error('Classifier was disposed');
    if (!Array.isArray(items)) throw new TypeError('items must be an array');
    const result = [];
    for (let start = 0; start < items.length; start += 16) {
      const encoded = items.slice(start, start + 16).map(item => tokenizer.encode(item));
      const length = Math.max(...encoded.map(ids => ids.length));
      const inputIds = new BigInt64Array(encoded.length * length).fill(BigInt(tokenizer.padId));
      const masks = new BigInt64Array(inputIds.length);
      encoded.forEach((ids, row) => ids.forEach((id, column) => {
        inputIds[row * length + column] = BigInt(id);
        masks[row * length + column] = 1n;
      }));
      const feeds = {
        input_ids: new ort.Tensor('int64', inputIds, [encoded.length, length]),
        attention_mask: new ort.Tensor('int64', masks, [encoded.length, length]),
      };
      let outputs;
      try {
        outputs = await session.run(feeds);
        const logits = outputs.logits;
        if (logits.data.length !== encoded.length * 6 || logits.dims.length !== 2 || logits.dims[1] !== 6) {
          throw new Error('Unexpected classifier output shape');
        }
        for (let row = 0; row < encoded.length; row++) {
          const values = Array.from(logits.data.slice(row * 6, row * 6 + 6), (value, i) => (value + (i === 0 ? noneBias : 0)) / temperature);
          if (!values.every(Number.isFinite)) throw new Error('Non-finite classifier output');
          const max = Math.max(...values);
          const exp = values.map(value => Math.exp(value - max));
          const total = exp.reduce((a, b) => a + b, 0);
          const scores = Object.fromEntries(expected.map((label, i) => [label, exp[i] / total]));
          let label = 'none';
          for (const candidate of expected.slice(1)) {
            if (scores[candidate] >= labelsJson.thresholds[candidate] &&
                (label === 'none' || scores[candidate] > scores[label])) label = candidate;
          }
          result.push({ label, score: scores[label], scores });
        }
      } finally {
        for (const tensor of Object.values(feeds)) tensor.dispose();
        if (outputs) for (const tensor of Object.values(outputs)) tensor.dispose();
      }
    }
    return result;
  }
  return {
    classify(items) {
      const pending = queue.then(() => run(items));
      queue = pending.catch(() => {});
      return pending;
    },
    async dispose() {
      await queue;
      if (!disposed) { disposed = true; await session.release(); }
    },
  };
}
