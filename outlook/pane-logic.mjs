// Pane decisions and advisory checks, kept apart from the DOM so they can be tested.
import { checkDraft } from '../core/gate.mjs';

// Advisory only: do not persist a release decision. Send always checks independently.
export async function checkAgain(office, { config, reader = globalThis.GuardcellDraft, ocr = globalThis.GuardcellOcr, model = globalThis.GuardcellSemantic, deadline = Date.now() + 15000 } = {}) {
  if (ocr) await ocr.prepare(office);
  const draft = await reader.readDraft(office, true, null, { deadline });
  let semantic;
  try { semantic = model?.forSend(deadline); } catch { /* Rules remain available. */ }
  return { ...await checkDraft(draft, { config, semantic, semanticDeadline: deadline }), paneCheck: true, paneFingerprint: reader.fingerprint(draft) };
}

// A recipient card names one address or several (lookalikes, an exposed list). It stays while any of
// them is still on the draft; with no address list yet, it stays.
export function recipientCardLive(finding, addresses) {
  if (!addresses) return true;
  const named = Array.isArray(finding.recipients) && finding.recipients.length ? finding.recipients : [finding.address || finding.recipient?.address || finding.sentence?.text];
  return named.some((a) => addresses.includes(String(a).toLowerCase()));
}
