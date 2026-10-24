// Optional, local-only enrichment. A skipped model never changes the rules' decision.
import { splitSentences, occurrences } from './sentences.mjs';

export const SEMANTIC_BUDGET_MS = 2500;
// Skip the whole semantic pass above this cap, rather than claiming partial coverage as 'used'.
export const SEMANTIC_MAX_SENTENCES = 400;
const SUBKINDS = Object.freeze({ access: 'security', personal: 'other', economics: 'other', negotiation: 'position', remark: 'insult' });
const REASONS = new Set(['unsupported', 'not_ready', 'unavailable', 'ocr_busy', 'busy', 'timeout', 'invalid', 'input_limit']);
export const sentenceKey = f => `${f.source}:${f.fileIndex ?? 0}:${f.sentence.index}`;

export async function semanticFindings(parts, rules, semantic, budgetMs = SEMANTIC_BUDGET_MS) {
  const skip = reason => ({ findings: [], state: 'skipped:' + reason });
  if (!semantic) return skip('absent');
  let classify;
  try { classify = semantic.classify; } catch { return skip('error'); }
  if (typeof classify !== 'function') return skip('invalid');
  // Send supplies its production cap; evaluators may explicitly allow a longer pass.
  const budget = Math.max(0, Number(budgetMs) || 0);
  if (!budget) return skip('timeout');
  const started = Date.now();
  const units = [];
  for (const part of parts) {
    // Low-confidence OCR is only evidence for shape-checked rule values, never semantic phrasing.
    if (part.hint) continue;
    const sentences = splitSentences(part.text), counts = occurrences(sentences);
    if (units.length + sentences.length > SEMANTIC_MAX_SENTENCES) return skip('limit');
    sentences.forEach((s, index) => units.push({ source: part.source, file: part.file, fileIndex: part.fileIndex,
      sentence: { ...s, index, occurrence: counts[index] }, context: sentences[index - 1]?.text || '' }));
  }
  if (!units.length) return skip('empty');
  const remaining = budget - (Date.now() - started);
  if (remaining <= 0) return skip('timeout');
  let timer;
  const timedOut = {};
  try {
    const result = await Promise.race([
      Promise.resolve().then(() => classify.call(semantic, units.map(u => ({ text: u.sentence.text, context: u.context })))),
      new Promise(resolve => { timer = setTimeout(() => resolve(timedOut), remaining); }),
    ]);
    // A wall-clock guard also rejects a synchronous classifier that starves the timer.
    if (result === timedOut || Date.now() - started >= budget) {
      try { semantic.cancel?.(); } catch { /* Cancellation must never fail the rule check. */ }
      return skip('timeout');
    }
    // A partial result (time ran out after some chunks) covers the first sentences in order; it must say
    // so. Anything else of the wrong length is invalid.
    const partial = Array.isArray(result) && result.partial === true && result.length > 0 && result.length < units.length;
    if (!Array.isArray(result) || (result.length !== units.length && !partial) || result.some(r => !r ||
      (r.label !== 'none' && !Object.prototype.hasOwnProperty.call(SUBKINDS, r.label)) || !Number.isFinite(r.score) || r.score < 0 || r.score > 1)) return skip('invalid');
    const occupied = new Set(rules.map(sentenceKey)), findings = [];
    // The model reads each sentence with the one before it, so a disclosure can spill onto the next
    // line ("Thanks,"). When the previous sentence is itself flagged, keep the next one only if it is
    // still flagged on its own; if that second look can't finish in time, drop it.
    const flagged = i => result[i].label !== 'none' || occupied.has(sentenceKey(units[i]));
    const spill = result.map((r, i) => r.label !== 'none' && i > 0 && units[i].context !== '' && flagged(i - 1) ? i : -1).filter(i => i >= 0);
    if (spill.length) {
      clearTimeout(timer);
      let alone = null;
      const left = budget - (Date.now() - started);
      if (left > 0) {
        alone = await Promise.race([
          Promise.resolve().then(() => classify.call(semantic, spill.map(i => ({ text: units[i].sentence.text, context: '' })))).catch(() => null),
          new Promise(resolve => { timer = setTimeout(() => resolve(timedOut), left); }),
        ]);
      }
      const ok = Array.isArray(alone) && alone.length === spill.length && Date.now() - started < budget;
      spill.forEach((i, k) => { if (!ok || alone[k]?.label !== result[i].label) result[i] = { ...result[i], label: 'none' }; });
    }
    result.forEach((r, i) => {
      if (r.label === 'none' || occupied.has(sentenceKey(units[i]))) return;
      const { context, ...unit } = units[i];
      findings.push({ ...unit, category: r.label, subkind: SUBKINDS[r.label], severity: 'stop',
        marks: [{ start: 0, end: unit.sentence.text.length }], found_by: 'model' });
    });
    return { findings, state: partial ? 'partial' : 'used' };
  } catch (error) {
    // Never copy model exceptions into diagnostics: they may contain an input sentence.
    return skip(REASONS.has(error?.semanticReason) ? error.semanticReason : 'error');
  } finally { clearTimeout(timer); }
}
