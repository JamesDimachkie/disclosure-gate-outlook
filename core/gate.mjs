// Local-only decision. No transport, telemetry or hosted model is reachable from this module.
import { sha256 } from './sha256.mjs';
export { sha256 } from './sha256.mjs';
import { STRINGS, CATEGORIES, describeResult, placeFor, labelFor, whyFor, copyForItem } from './copy.mjs';
import { settingsFor } from './settings.mjs';
import { normalizeDomains, classifyRecipients, reachOf, checkableAddress } from './recipients.mjs';
import { recipientFindings } from './recipient-checks.mjs';
import { greetingFinding } from './greeting.mjs';
import { screenText } from './rules.mjs';
import { splitSentences, occurrenceOf } from './sentences.mjs';
import { attachmentText, readableKind } from './attachments.mjs';
import { imageAttachment } from './ocr-policy.mjs';
import { semanticFindings, SEMANTIC_BUDGET_MS } from './semantic.mjs';
// Reasons that mean the picture itself couldn't be read: only these are excused (§5.9). Anything
// else about a picture (still being read, changed, a result that didn't fit the shared cache, an
// API or engine failure, bytes that aren't a picture) stops like any file that can't be checked.
// Embedded Office pictures also ask on a failed recognition, per their attached-picture contract.
const HINT_CATEGORIES = new Set(['access', 'financial', 'identity']);
const PICTURE_UNREADABLE = new Set(['ocr_low_confidence', 'ocr_unsupported', 'image_size', 'image_frames', 'ocr_pixels', 'size']);
export { STRINGS } from './copy.mjs';
export { copyForItem } from './copy.mjs';
export { describeResult, dialogContent } from './copy.mjs';
export { decisionFor } from './settings.mjs';
export { attachmentHash } from './attachments.mjs';
export { visibleText } from './remove.mjs';

export const GATE_VERSION = 'email-gate-2';
// Over these limits a draft cannot be checked; the failure has a specific size reason.
const TOO_LARGE = new Set(['too_long', 'too_many_recipients', 'too_many_attachments']);
const LIMITS = Object.freeze({ subject: 1000, body: 500000, recipients: 500, attachments: 50, name: 255 });
// A recipient finding (a lookalike address) leads; a 'prompt' finding (the exposed list) always comes last.
const SOURCE_RANK = { recipient: -1, subject: 0, location: 1, body: 2, attachment: 3 };

// Validate the draft the add-in read and bind it: sender, every recipient, subject, body, format and
// every attachment's identity and bytes, plus the policy it was checked under.
export function snapshotOf(draft, domains) {
  if (!draft || typeof draft !== 'object') throw new Error('invalid_draft');
  const from = checkableAddress(typeof draft.from === 'string' ? draft.from : draft.from?.address) || checkableAddress(draft.senderEmail);
  if (!from) throw new Error('invalid_sender');
  const recipients = {};
  let count = 0;
  for (const field of ['to', 'cc', 'bcc']) {
    const list = draft[field] ?? [];
    if (!Array.isArray(list)) throw new Error('invalid_recipients');
    recipients[field] = list.map((r) => {
      if (!r || typeof r !== 'object') throw new Error('invalid_recipients');
      return { name: typeof r.name === 'string' ? r.name.slice(0, 200) : '', address: typeof r.address === 'string' ? r.address.trim().slice(0, 254) : '', kind: r.kind === 'group' ? 'group' : 'person' };
    });
    count += list.length;
  }
  if (count > LIMITS.recipients) throw new Error('too_many_recipients');
  const subject = typeof draft.subject === 'string' ? draft.subject : '';
  const itemType = draft.itemType === 'appointment' ? 'appointment' : 'message';
  const location = itemType === 'appointment' && typeof draft.location === 'string' ? draft.location : '';
  const bodyText = typeof draft.body?.text === 'string' ? draft.body.text : '';
  const bodyFormat = draft.body?.format === 'html' ? 'html' : 'text';
  if (subject.length > LIMITS.subject || bodyText.length + location.length > LIMITS.body) throw new Error('too_long');
  const list = draft.attachments ?? [];
  if (!Array.isArray(list)) throw new Error('invalid_attachments');
  if (list.length > LIMITS.attachments) throw new Error('too_many_attachments');
  const attachments = list.map((a) => {
    if (!a || typeof a !== 'object' || typeof a.name !== 'string' || !a.name.trim() || a.name.length > LIMITS.name) throw new Error('invalid_attachments');
    return { ocr: ['ready', 'pending', 'failed', 'unsupported'].includes(a.ocr?.status) ? { status: a.ocr.status, hash: a.ocr.hash, text: (a.ocr.status === 'ready' || a.ocr.status === 'failed') && typeof a.ocr.text === 'string' ? a.ocr.text.slice(0, 200001) : undefined, reason: typeof a.ocr.reason === 'string' ? a.ocr.reason.slice(0, 40) : undefined, hint: a.ocr.status === 'failed' && typeof a.ocr.hint === 'string' ? a.ocr.hint.slice(0, 200001) : undefined } : null, id: String(a.id ?? '').slice(0, 512), name: a.name, size: Number.isSafeInteger(a.size) && a.size >= 0 ? a.size : -1, isInline: a.isInline === true,
      type: ['file', 'item', 'cloud'].includes(a.type) ? a.type : 'file', contentType: typeof a.contentType === 'string' ? a.contentType.slice(0, 200) : '',
      content: typeof a.content === 'string' ? a.content : null };
  });
  const binding = sha256({ version: GATE_VERSION, domains, from, itemType, location,
    recipients: ['to', 'cc', 'bcc'].flatMap((f) => recipients[f].map((r) => [f, r.address.toLowerCase(), r.kind])), subject, bodyText, bodyFormat,
    attachments: attachments.map((a) => [a.id, a.name, a.size, a.isInline, a.type, a.content === null ? null : sha256(a.content), a.ocr]) });
  return { from, ...recipients, itemType, location, subject, bodyText, bodyFormat, attachments, binding };
}

const RECIPIENT_LABEL = { inside: STRINGS.recipient.inside, outside: STRINGS.recipient.outside, unknown: STRINGS.recipient.cantCheck };
const categoryRank = (c) => CATEGORIES.indexOf(c);

export function present(f, itemType) {
  const why = itemType === 'appointment' && f.source === 'recipient' && f.subkind === 'exposed' ? STRINGS.meeting.exposed : copyForItem(whyFor(f), itemType);
  return { ...f, id: `${f.source}:${f.fileIndex ?? 0}:${f.sentence.index}:${f.category}${f.source === 'recipient' ? ':' + f.subkind : ''}`, label: labelFor(f), why,
    place: f.source === 'recipient' || f.category === 'attachment' ? null : placeFor(f), removable: (f.source === 'body' || f.source === 'subject') && f.subkind !== 'private-key', severity: f.severity === 'prompt' ? 'prompt' : 'stop' };
}
const promptOnly = (f) => (f.severity === 'prompt' ? 1 : 0);
function order(findings) {
  return findings.sort((a, b) => promptOnly(a) - promptOnly(b) || SOURCE_RANK[a.source] - SOURCE_RANK[b.source] || (a.fileIndex ?? 0) - (b.fileIndex ?? 0) || a.sentence.index - b.sentence.index || categoryRank(a.category) - categoryRank(b.category));
}

// Who will see this draft, and nothing else: no content is read. The pane shows it while a Send is
// being checked. Also returns the draft's binding, which names the Send result the pane may show.
export function classifyDraft(draft, { config } = {}) {
  let domains, snap;
  try { domains = domainsFor(draft, config); snap = snapshotOf(draft, domains); } catch { return { state: 'unavailable', findings: [], recipients: [] }; }
  const recipients = classifyRecipients(snap, domains).map((r) => ({ ...r, label: RECIPIENT_LABEL[r.reach] }));
  return { state: 'checking', binding: snap.binding, reach: reachOf(recipients), recipients, findings: [] };
}

// check(draft, {config: {internalDomains}}) → the decision for this draft.
export async function checkDraft(draft, { config, now = () => Date.now(), semantic, semanticBudgetMs = SEMANTIC_BUDGET_MS, semanticDeadline = Infinity } = {}) {
  const started = now();
  const itemType = draft?.itemType === 'appointment' ? 'appointment' : 'message';
  const done = (result) => ({ ...result, ms: Math.round((now() - started) * 10) / 10 });
  const unavailable = (reason, extra = {}) => done(describeResult({ state: TOO_LARGE.has(reason) ? 'too_large' : 'unavailable', itemType, reason, findings: [], ...extra }, reason === 'config' ? { findings: 'hold', failures: 'hold' } : config));
  let domains, snap;
  try { settingsFor(config); domains = domainsFor(draft, config); } catch { return unavailable('config'); }
  try { snap = snapshotOf(draft, domains); } catch (error) { return unavailable(String(error.message || 'invalid_draft')); }
  const recipients = classifyRecipients(snap, domains).map((r) => ({ ...r, label: RECIPIENT_LABEL[r.reach] }));
  const reach = reachOf(recipients);
  const base = { binding: snap.binding, itemType, reach, recipients, checked: { local: false, semantic: 'skipped:inside' } };
  // Emails that go only inside the company are never held, and nothing about them is sent anywhere.
  if (reach === 'inside' || !recipients.length) return done({ ...base, state: 'clear', findings: [] });

  // Lookalike addresses and an exposed outside list (spec §5.8), from the addresses alone.
  const trusted = Array.isArray(config?.trustedDomains) && config.trustedDomains.length ? normalizeDomains(config.trustedDomains) : [];
  const findings = recipientFindings(recipients, domains, { more: STRINGS.recipientList, trusted });
  // A greeting that names nobody on the To line (a likely wrong address); messages only.
  const greeting = itemType === 'message' ? greetingFinding(snap.bodyText, recipients) : null;
  if (greeting) findings.push(greeting);
  const texts = [];
  snap.attachments.forEach((a, fileIndex) => {
    const read = attachmentText(a);
    if (read.ok) { texts.push({ source: 'attachment', file: a.name, fileIndex, text: read.text }); return; }
    // Native document text still counts when one of its pictures/pages cannot be read.
    if (read.text) texts.push({ source: 'attachment', file: a.name, fileIndex, text: read.text });
    // Text OCR read with low confidence can't clear a file, but a finding in it still counts.
    if (typeof read.hint === 'string' && read.hint && screenText(read.hint, { source: 'attachment', file: a.name }).some((f) => HINT_CATEGORIES.has(f.category))) { texts.push({ source: 'attachment', file: a.name, fileIndex, text: read.hint, hint: true }); if (!readableKind(a)) return; }
    // A picture whose text can't be read confidently (a photo, a stylised logo, a phone photo too large
    // to read) doesn't stop the email: inline it is ignored (signatures and logos), attached it asks the
    // sender to look, with Send anyway. Text that is read is screened like any other. A picture still
    // being read, or whose bytes changed since, still stops.
    if ((read.picture || imageAttachment(a) && !readableKind(a)) && (PICTURE_UNREADABLE.has(read.reason) || read.picture && read.reason === 'ocr_failed')) {
      // Inline is ignored only when the bytes were seen to be a picture ('size' means they weren't read).
      if (!read.picture && a.isInline && read.reason !== 'size') return;
      findings.push({ category: 'attachment', subkind: 'picture', detail: read.reason, severity: 'prompt', source: 'attachment', file: a.name, fileIndex, marks: [], found_by: 'attachment',
        sentence: { text: a.name, index: -1, occurrence: 0, start: 0, end: a.name.length } });
      return;
    }
    findings.push({ category: 'attachment', subkind: read.reason, source: 'attachment', file: a.name, fileIndex, marks: [], found_by: 'attachment',
      sentence: { text: a.name, index: -1, occurrence: 0, start: 0, end: a.name.length } });
  });
  const parts = [{ source: 'subject', file: null, fileIndex: 0, text: snap.subject }, { source: 'location', file: null, fileIndex: 0, text: snap.location }, { source: 'body', file: null, fileIndex: 0, text: snap.bodyText }, ...texts];
  for (const part of parts) {
    // Low-confidence OCR text holds several reads of the same picture: one finding per kind is enough.
    const seen = new Set();
    for (const f of screenText(part.text, { source: part.source, file: part.file })) {
      // Uncertain OCR text only counts for values with a checkable shape (keys, codes, card, bank and
      // ID numbers): phrasing rules on a garbled read of a logo or photo would be noise.
      if (part.hint) { if (!HINT_CATEGORIES.has(f.category)) continue; const key = f.category + '/' + f.subkind; if (seen.has(key)) continue; seen.add(key); }
      findings.push({ ...f, fileIndex: part.fileIndex, found_by: part.hint ? 'ocr' : 'rules' });
    }
  }
  base.checked.local = true;
  // IT can turn the model off in setup; rules then decide alone, exactly as without a model.
  let enrichment = { findings: [], state: 'skipped:off' };
  if (config?.model !== 'off') enrichment = await semanticFindings(parts, findings, semantic, Math.min(semanticBudgetMs, semanticDeadline - now()));
  base.checked.semantic = enrichment.state;
  findings.push(...enrichment.findings);
  if (findings.length) {
    const ordered = order(findings).map(f => present(f, itemType));
    return done(describeResult({ ...base, state: 'held', findings: ordered }, config));
  }

  return done({ ...base, state: 'clear', findings: [] });
}

// Inside is the mailbox's own domain plus the admin's domains. The From address doesn't count: with
// send-as, a shared mailbox or another account in a classic profile it can be anyone's domain. The
// Outlook reader always supplies senderEmail (the mailbox profile); only direct callers that pass no
// senderEmail at all (tests, the evaluation runner) fall back to From.
export function domainsFor(draft, config) {
  const own=draft?.senderEmail === undefined ? draft?.from?.address ?? draft?.from : draft.senderEmail;
  const mailbox=checkableAddress(typeof own==='string'?own:'');
  if(!mailbox) throw new Error('invalid_sender');
  if(config?.internalDomains !== undefined && !Array.isArray(config.internalDomains)) throw new Error('invalid_domains');
  return normalizeDomains([mailbox.split('@')[1],...(config?.internalDomains ?? [])]);
}
