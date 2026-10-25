import { Tokenizer } from '@huggingface/tokenizers';
import { formatInput } from '../model/tokenize.mjs';

// The supplied tokenizer truncates at max_length. Reject that optional pass instead of treating
// a truncated sentence as complete semantic coverage. Rules have already read the full text.
export function createInputGuard(tokenizerJson, labels) {
  const fits = createFit(tokenizerJson, labels);
  return items => items.every(fits);
}

function createFit(tokenizerJson, labels) {
  const tokenizer = new Tokenizer(tokenizerJson, {});
  return item => tokenizer.encode(formatInput(item, labels.input), { add_special_tokens: true }).ids.length <= labels.max_length;
}

// Per sentence instead of per batch: a sentence that only fits without the sentence before it is
// read alone; one that does not fit even alone is left unread (never truncated). Returns the items
// to classify and the positions left unread, so the rest of the email still gets the model.
export function createInputAdmission(tokenizerJson, labels) {
  const fits = createFit(tokenizerJson, labels);
  return items => {
    const admitted = [], positions = [], unread = [];
    items.forEach((item, i) => {
      const alone = { ...item, context: '' };
      if (fits(item)) { admitted.push(item); positions.push(i); }
      else if (item.context && fits(alone)) { admitted.push(alone); positions.push(i); }
      else unread.push(i);
    });
    return { admitted, positions, unread };
  };
}

// Puts classified results back in email order; unread sentences count as not flagged and mark the
// result incomplete.
export function mergeAdmitted(length, { positions, unread }, results) {
  const out = Array.from({ length }, () => ({ label: 'none', score: 0, scores: {}, unread: true }));
  positions.forEach((p, k) => { out[p] = results[k]; });
  if (unread.length) out.incomplete = true;
  return out;
}

// Offline tools (held-out runner, calibration, evaluation scripts) wrap the same classifier so they
// score exactly what Send's worker would classify.
export function withAdmission(classifier, tokenizerJson, labels) {
  const admit = createInputAdmission(tokenizerJson, labels);
  return {
    classify: async items => {
      const plan = admit(items);
      return mergeAdmitted(items.length, plan, plan.admitted.length ? await classifier.classify(plan.admitted) : []);
    },
    cancel: () => classifier.cancel?.(),
    dispose: () => classifier.dispose?.(),
  };
}
