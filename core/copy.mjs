// Sender-facing copy and bounded dialog composition. SPEC.md §7 owns the ask/hold shapes.
// test/copy.test.mjs lints the frozen table: sentence case, no exclamation mark, no em dash,
// and never "blocked", "violation" or "policy breach". Secret values belong only in the pane.

// Payment and bank details (spec §5.2) and government identifiers (§5.3) are their own categories: they
// read differently to the sender than a personal detail or an access code, and the pane says why each
// stays off email. Secrets and tokens (§5.1) are access findings with their own subkinds. Recipient
// problems (§5.8) are one category whose subkind names the problem.
import { isFailure, decisionFor } from './settings.mjs';
export const CATEGORIES = Object.freeze(['economics', 'negotiation', 'personal', 'access', 'financial', 'identity', 'remark', 'attachment', 'recipient']);

export const STRINGS = Object.freeze({
  name: 'Disclosure Gate',
  pill: Object.freeze({ held: 'Held', ask: 'Review', clear: 'Clear' }),
  checking: 'Checking before it leaves…',
  sections: Object.freeze({ recipients: 'Who will see this', findings: 'What needs review' }),
  recipient: Object.freeze({ inside: 'Inside', outside: 'Outside the company', cantCheck: "Can't check" }),
  actions: Object.freeze({ remove: 'Remove this sentence', show: 'Show me' }),
  labels: Object.freeze({
    economics: 'Internal economics',
    negotiation: 'Negotiation position',
    personal: 'Personal detail',
    access: 'Access and security',
    remark: 'Remark about a person',
    attachment: Object.freeze({ other: "Can't check this attachment", picture: "Picture it couldn't read" }),
    financial: 'Payment or bank details',
    identity: 'Government ID number',
    recipient: Object.freeze({ lookalike: 'Lookalike address', exposed: 'Recipients can see each other' }),
  }),
  why: Object.freeze({
    economics: 'Margins and costs stay inside the company.',
    negotiation: 'Your room to negotiate stays inside the company.',
    personal: "Someone's personal details aren't everyone's business.",
    access: 'Codes and security details stay off email.',
    remark: 'Remarks about people stay in the room.',
    attachment: "Disclosure Gate couldn't read this file. Check what it contains before sending.",
    financial: 'Card and bank numbers stay off email.',
    identity: 'Government ID numbers stay off email.',
    recipient: Object.freeze({
      lookalike: "This email goes to an address that looks like your company's but isn't.",
      exposed: "Everyone in To and Cc can see these outside addresses. Move outside recipients to Bcc.",
    }),
  }),
  footer: Object.freeze([
    'Nothing is changed unless you choose. Press Send to check again.',
    "The check runs on this device. Nothing in this email is sent anywhere to be checked.",
  ]),
  // Where a finding sits when it is not in the body.
  place: Object.freeze({ body: 'In the body', subject: 'In the subject', location: 'In the location', attachment: 'In {name}' }),
  meeting: Object.freeze({ exposed: 'Everyone invited can see these outside addresses. Check the attendee list before sending.' }),
  // A recipient finding shows its addresses where other findings show a sentence.
  recipientList: '{list} and {n} more',
  unavailable: "Disclosure Gate couldn't check this email.",
  tooLarge: "It's too large to check.",
  ocr: Object.freeze({
    pending: 'An image is still being read.',
    unsupported: "This Outlook runtime can't read images on this device. Open Disclosure Gate from the ribbon to try reading this file in the pane.",
    lowConfidence: "The text in this image couldn't be read confidently. Replace it with a clearer image or a text file, then click Send again.",
    failed: "This image couldn't be read on this device. Replace it with a clearer image or a text file, then click Send again.",
    cacheSize: "This image has too much text to save for Send. Replace it with a text file, then click Send again.",
    paneReading: 'Reading images on this device…',
    picture: "Disclosure Gate couldn't read the text in this picture. Check it shows nothing that should stay inside before you send it.",
  }),
  // State E: the pane's footer when a Send clears (as the film shows it). Outlook gives an add-in no way
  // to put a line on the sent item or on its own "sent" notice, so the pane is the only place it appears.
  checkedNotice: 'Checked by Disclosure Gate before sending.',
  dialog: Object.freeze({
    outside: 'This email goes outside your company',
    mayGoOutside: 'This email may go outside your company',
    includes: 'and includes',
    unknownFinding: 'a detail to review',
    ask: "If you're sure, choose **Send Anyway**. To see each one and fix it, choose **Review**.",
    hold: "It hasn't been sent. Choose **Review** to see what to change, then press Send again.",
    askRibbon: "If you're sure, choose **Send Anyway**.",
    holdRibbon: "It hasn't been sent. Review it, then press Send again.",
    failureAsk: "If you're sure about what it contains, choose **Send Anyway**. To check it again, choose **Don't Send** and press Send.",
    failureHold: "It hasn't been sent. Press Send again to check it again, or ask your IT team.",
    sizeAsk: "If you're sure about what it contains, choose **Send Anyway**. To check it, choose **Don't Send**. Shorten it or split it, then press Send.",
    sizeHold: "It hasn't been sent. Shorten it or split it, then press Send.",
    settingsUnknown: "If **Send Anyway** is offered and you're sure, choose it; otherwise choose **Don't Send**, fix it and press Send.",
    sizeAction: 'Shorten it or split it, then press Send.',
    more: 'and {n} more',
    exposed: 'In To and Cc: {n} outside addresses',
    meetingExposed: 'In the attendee list: {n} outside attendees',
    timeout: 'It took too long.',
    read: "Outlook didn't let it read the draft.",
    error: "The local check didn't finish.",
    changed: 'The draft changed during the check.',
    unreadable: "{name} couldn't be read",
    fileTooLarge: '{name} is too large to check',
    filePending: '{name} is still being read',
    separator: 'and',
    noReviewButton: 'Open Disclosure Gate from the ribbon to see why.',
    review: 'Review',
  }),
  // The phrase that names the first finding in the dialog. The spec fixes "mentions your margin";
  // the others follow its shape.
  mentions: Object.freeze({
    economics: Object.freeze({ margin: 'mentions your margin', markup: 'mentions your markup', profit: 'mentions your profit', cost: 'mentions your costs', contingency: 'mentions your contingency', budget: 'mentions your budget', floor: 'mentions your price floor', other: 'mentions your costs or margin' }),
    negotiation: 'mentions your negotiating position',
    personal: "mentions someone's personal details",
    access: Object.freeze({ code: 'mentions {article} {kind} code', password: 'mentions a password', security: 'mentions security details', secret: 'includes an API key or token', 'private-key': 'includes a private key', connection: 'includes a database password', other: 'mentions a code or security detail' }),
    financial: Object.freeze({ card: 'includes a card number', bank: 'includes a bank account number', other: 'includes payment details' }),
    identity: Object.freeze({ ssn: 'includes a Social Security number', ni: 'includes a National Insurance number', sin: 'includes a Social Insurance number', passport: 'includes a passport number', licence: "includes a driver's licence number", tax: 'includes a tax ID number', 'national-id': 'includes a national ID number', other: 'includes a government ID number' }),
    recipient: Object.freeze({ lookalike: "includes an address that looks like your company's but isn't", exposed: 'includes outside addresses everyone on it can see', other: 'includes a recipient to check' }),
    remark: 'includes a remark about a person',
    attachment: Object.freeze({ other: "includes a file that can't be checked", picture: "includes a picture it couldn't read" }),
  }),
  // The compose ribbon button that opens the pane; the dialog's fallback sentence names it.
  ribbon: Object.freeze({ label: 'Disclosure Gate', tip: 'See who will receive this email and what Disclosure Gate found.' }),
  pane: Object.freeze({
    // Before the first Send (the film's opening pane).
    idle: 'Checks this email when you press Send.',
    empty: 'Open a message you are writing or a meeting you are organizing to see what Disclosure Gate checks.',
    removeFailed: "That sentence couldn't be found in the draft any more. It may already be gone.",
    fileNote: 'You can review, remove or replace this file before sending.',
    ask: 'You can still send it: press Send and choose Send Anyway.',
    hold: "It hasn't been sent. Review what needs to change, then press Send again.",
    checkAgain: 'Check again',
    checked: 'This draft passed the local check. Press Send to check it again and send.',
    changed: 'This draft changed since the check. Check it again before sending.',
    lastSend: 'The last Send:',
  }),
});

// Keep the approved message copy exact; appointments use the same sentences with their own noun.
export function copyForItem(text, itemType) {
  return itemType === 'appointment' ? text.replace(/\boff email\b/g, 'out of meeting invitations').replace(/\bemails\b/g, 'meeting invitations').replace(/\bemail\b/g, 'meeting invitation') : text;
}

// The label and why-line for a finding; a recipient finding's depend on its subkind.
const bySubkind = (entry, finding) => (entry && typeof entry === 'object' ? entry[finding.subkind] ?? Object.values(entry)[0] : entry);
export const labelFor = (finding) => bySubkind(STRINGS.labels[finding?.category], finding);
export const whyFor = (finding) => {
  if (finding?.category === 'attachment') {
    if (finding.subkind === 'picture') return STRINGS.ocr.picture;
    if (finding.subkind === 'ocr_pending') return STRINGS.ocr.pending;
    if (finding.subkind === 'ocr_unsupported') return STRINGS.ocr.unsupported;
    if (finding.subkind === 'ocr_low_confidence') return STRINGS.ocr.lowConfidence;
    if (finding.subkind === 'ocr_cache_size') return STRINGS.ocr.cacheSize;
    if (/^(?:ocr_|image_)/.test(finding.subkind)) return STRINGS.ocr.failed;
  }
  return bySubkind(STRINGS.why[finding?.category], finding);
};

const article = (word) => /^[aeiou]/i.test(word) ? 'an' : 'a';

// The dialog phrase for one finding: "mentions your margin", "mentions a gate code".
export function mentionFor(finding) {
  const entry = STRINGS.mentions[finding?.category];
  if (!entry) throw new Error('unknown_category');
  if (typeof entry === 'string') return entry;
  if (finding.category === 'access' && finding.subkind === 'code') {
    const kind = finding.codeKind || 'access';
    return entry.code.replace('{article}', article(kind)).replace('{kind}', kind);
  }
  return entry[finding.subkind] || entry.other;
}

// State B's message. `reach` is 'outside' when a recipient is outside the company and 'unknown' when
// the only reason is a recipient that can't be checked. Without the Review button (Mailbox 1.14 is
// missing) the message ends with the ribbon sentence. The dialog caps a message at 500 characters.
export function heldMessage(findings, options = {}) {
  if (!Array.isArray(findings) || !findings.length) throw new Error('no_findings');
  return dialogContent({ state: 'held', findings, reach: options.reach, itemType: options.itemType }, options).errorMessage;
}

// Never put sentence text or matched values in the dialog. Only fixed category words and bounded,
// escaped file/recipient names are used. Reserve action copy before fitting the variable content.
const plain = text => text.replace(/\*\*/g, '');
function shortName(value, limit) {
  const text = String(value || '').replace(/[\x00-\x1f\x7f*_[\]`<>\\#]/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= limit) return text;
  return Array.from(text.slice(0, limit - 1)).join('').replace(/[\uD800-\uDBFF]$/, '') + '…';
}
export function failureReason(result, limit = 60) {
  const d = STRINGS.dialog;
  if (result?.category === 'attachment') {
    const template = result.subkind === 'ocr_pending' ? d.filePending : tooLargeToRetry(result) ? d.fileTooLarge : d.unreadable;
    return template.replace('{name}', shortName(result.file, limit));
  }
  if (result?.state === 'too_large') return STRINGS.tooLarge;
  const reasons = { timeout: d.timeout, ocr_pending: STRINGS.ocr.pending, changed: d.changed, read: d.read, error: d.error };
  return Object.prototype.hasOwnProperty.call(reasons, result?.reason) ? reasons[result.reason] : d.error;
}
// Size failures need an edit, not another attempt on unchanged content. Prompt pictures still ask.
export const tooLargeToRetry = result => result?.state === 'too_large' || result?.category === 'attachment' && /(?:size|too_long|too_large)/.test(result.subkind) || (result?.findings || []).some(tooLargeToRetry);
export function dialogContent(result, { ask = true, reviewButton = true, settingsKnown = true, itemType = result.itemType } = {}) {
  const d = STRINGS.dialog, all = result.findings || [];
  const findings = all.filter(f => !isFailure(f)), failures = all.filter(isFailure);
  const copy = text => copyForItem(text, itemType);
  let action = findings.length ? (reviewButton ? (ask ? d.ask : d.hold) : (ask ? d.askRibbon : d.holdRibbon) + ' ' + d.noReviewButton) : ask ? d.failureAsk : d.failureHold;
  if (!settingsKnown) action = d.settingsUnknown + (findings.length && !reviewButton ? ' ' + d.noReviewButton : '') + (tooLargeToRetry(result) ? ' ' + d.sizeAction : '');
  else if (tooLargeToRetry(result)) action = findings.length ? action + ' ' + d.sizeAction : ask ? d.sizeAsk : d.sizeHold;
  action = copy(action);
  // Include a failure among the first three bullets whenever a mixed result has one.
  const chosen = [...findings.slice(0, failures.length ? 2 : 3), ...failures.slice(0, findings.length ? 1 : 3)];
  const more = all.length - chosen.length;
  const phrases = [...new Set(findings.map(f => {
    try { return mentionFor(f).replace(/^(?:mentions|includes) /, ''); } catch { return d.unknownFinding; }
  }))].slice(0, 2);
  const headline = copy(findings.length ? `${result.reach === 'unknown' ? d.mayGoOutside : d.outside} ${d.includes} ${phrases.join(' ' + d.separator + ' ')}.` : STRINGS.unavailable);
  function detail(f, limit) {
    if (isFailure(f)) return failureReason(f, limit);
    if (f.source === 'recipient') {
      if (f.subkind === 'exposed') return (itemType === 'appointment' ? d.meetingExposed : d.exposed).replace('{n}', String(f.recipients?.length || 0));
      return shortName(f.recipients?.join(', ') || f.address || f.recipient?.address, limit);
    }
    let label;
    try { label = mentionFor(f).replace(/^(?:mentions|includes) /, ''); } catch { label = d.unknownFinding; }
    const where = f.source === 'attachment' ? STRINGS.place.attachment.replace('{name}', shortName(f.file, limit)) : STRINGS.place[f.source] || STRINGS.place.body;
    return `${where}: ${label}`;
  }
  let markdown, message;
  for (const limit of [60, 40, 24, 12]) {
    const details = chosen.map(f => copy(detail(f, limit)));
    if (more) details.push(d.more.replace('{n}', String(more)));
    if (!findings.length && !failures.length) details.push(copy(failureReason(result)));
    const bullets = all.length ? details.map(s => '- ' + s + '\r').join('') : details.join(' ');
    markdown = `**${headline}**\n\n${bullets}\n\n${action}`;
    message = `${headline} ${details.map(s => (s.startsWith('and ') ? 'And ' + s.slice(4) : s).replace(/\.$/, '') + '.').join(' ')} ${plain(action)}`;
    if (markdown.length <= 500 && message.length <= 500) break;
  }
  // Very long category combinations use a shorter headline, preserving every bullet and action.
  if (markdown.length > 500 || message.length > 500) {
    const compact = copy(findings.length ? `${result.reach === 'unknown' ? d.mayGoOutside : d.outside} ${d.includes} ${phrases[0]}.` : STRINGS.unavailable);
    markdown = markdown.replace(`**${headline}**`, `**${compact}**`);
    message = message.replace(headline, compact);
  }
  return { errorMessage: message, errorMessageMarkdown: markdown };
}

export function describeResult(result, config, options = {}) {
  const decision = decisionFor(result, config, options);
  const dialogOptions = { ...options, settingsKnown: config?.settingsKnown !== false, ask: decision.outcome === 'ask' };
  const content = dialogContent(result, dialogOptions);
  return { ...result, ...decision, message: content.errorMessage, markdown: content.errorMessageMarkdown,
    fallbackMessage: dialogContent(result, { ...dialogOptions, reviewButton: false }).errorMessage };
}

// Where a finding sits, for findings outside the body; null for the body.
export function placeFor(finding) {
  if (finding.source === 'subject') return STRINGS.place.subject;
  if (finding.source === 'location') return STRINGS.place.location;
  if (finding.source === 'attachment') return STRINGS.place.attachment.replace('{name}', finding.file || '');
  return null;
}
