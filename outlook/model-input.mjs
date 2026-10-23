import { Tokenizer } from '@huggingface/tokenizers';
import { formatInput } from '../model/tokenize.mjs';

// The supplied tokenizer truncates at max_length. Reject that optional pass instead of treating
// a truncated sentence as complete semantic coverage. Rules have already read the full text.
export function createInputGuard(tokenizerJson, labels) {
  const tokenizer = new Tokenizer(tokenizerJson, {});
  return items => items.every(item => tokenizer.encode(formatInput(item, labels.input), { add_special_tokens: true }).ids.length <= labels.max_length);
}
