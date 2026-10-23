// Public admin choices. Legacy mode URLs remain valid; explicit choices may refine an alias.
export function settingsFor(value = {}) {
  if (value.mode !== undefined && !['warn', 'enforce'].includes(value.mode)) throw new Error('invalid_mode');
  for (const key of ['findings', 'failures']) if (value[key] !== undefined && !['ask', 'hold'].includes(value[key])) throw new Error('invalid_' + key);
  const fallback = value.mode === 'enforce' ? 'hold' : 'ask';
  return { findings: value.findings ?? fallback, failures: value.failures ?? fallback };
}

// Unreadable attachments retain their cards, but are failures rather than detected disclosures.
// The two prompt-severity exceptions always ask, even when both admin choices hold.
export const isFailure = f => f?.category === 'attachment' && f.severity !== 'prompt';
export function decisionFor(result, config = {}, { canOverride = true } = {}) {
  const settings = settingsFor(config), list = result.findings || [];
  const hasFailures = list.some(isFailure) || ['unavailable', 'too_large'].includes(result.state);
  const hasFindings = list.some(f => !isFailure(f) && f.severity !== 'prompt');
  const ask = (!hasFailures || settings.failures === 'ask') && (!hasFindings || settings.findings === 'ask');
  const manifestAsks = settings.findings === 'ask' && settings.failures === 'ask' && config.settingsKnown !== false;
  return { outcome: ask && (canOverride || manifestAsks) ? 'ask' : 'hold', hasFailures, hasFindings, manifestAsks };
}
