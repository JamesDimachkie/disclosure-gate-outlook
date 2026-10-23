import { Tokenizer } from '@huggingface/tokenizers';

export function formatInput({ text, context = '' }, input) {
  if (typeof text !== 'string' || typeof context !== 'string') throw new TypeError('text and context must be strings');
  return input === 'context_text' ? `Previous sentence: ${context}\nCurrent sentence: ${text}` : text;
}

export function createTokenizer(tokenizerJson, labelsJson) {
  const tokenizer = new Tokenizer(tokenizerJson, {});
  const padId = tokenizer.token_to_id('[PAD]');
  if (!Number.isInteger(padId)) throw new Error('Tokenizer has no [PAD] token');
  return {
    padId,
    encode(item) {
      const ids = tokenizer.encode(formatInput(item, labelsJson.input), { add_special_tokens: true }).ids;
      // Match the Python tokenizer's right truncation, retaining its final EOS.
      return ids.length > labelsJson.max_length
        ? [...ids.slice(0, labelsJson.max_length - 1), ids[ids.length - 1]] : ids;
    },
  };
}
