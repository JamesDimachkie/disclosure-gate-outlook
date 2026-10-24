import { classifyDraft, checkDraft } from '../core/gate.mjs';
import { runtimeConfig } from './config.mjs';
import { recipientCardLive, checkAgain } from './pane-logic.mjs';
// The review pane shows the last Send result and pre-reads images for a later Send. It shows
// what the last Send found. Before the first Send it says only that it checks the email when you
// press Send; while a Send is checked it shows who will see the email; afterwards it shows the Held or
// Clear result the Send handler wrote into the item's session data (or, if that is not available, the
// stored result of exactly this draft). "Remove this sentence" deletes exactly
// that sentence and refuses if the draft changed since it was read; a card whose sentence is gone
// (removed or edited away) drops out without checking anything again. Nothing leaves this computer
// from the pane.
// Outside Outlook, ?preview=idle|checking|held|attachment|clear|unavailable shows the spec's fictional run.
import { STRINGS, copyForItem, describeResult, failureReason, tooLargeToRetry } from '../core/copy.mjs';
import { splitSentences, stillPresent } from '../core/sentences.mjs';
import { removeSentenceFromHtml, removeSentenceFromText } from '../core/remove.mjs';
import { sha256 } from '../core/sha256.mjs';

const $ = (id) => document.getElementById(id);
const POLL_MS = 1500, PHASE_MS = 400, PHASE_KEY = 'dg-phase', RESULT_KEY = 'dg-result';
const state = { item: null, view: 'idle', result: null, recipients: [], seen: null, files: null, seenIdentity: null, paneSnapshot: null, changedSinceCheck: false, polling: false, phaseAt: 0, errors: new Map(), expanded: new Set(), busy: new Set(), lastPill: null, contents: new Map() };
const Draft = () => globalThis.DisclosureGateDraft;
const copy = text => copyForItem(text, state.item ? Draft().itemType(state.item) : state.result?.itemType);

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== null && v !== undefined && v !== false) node.setAttribute(k, v === true ? '' : String(v));
  for (const c of children.flat()) if (c !== null && c !== undefined && c !== false) node.append(c instanceof Node ? c : String(c));
  return node;
}
function icon(id) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'icon'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
  const use = document.createElementNS(ns, 'use'); use.setAttribute('href', '#' + id);
  svg.append(use);
  return svg;
}
const initials = (name, address) => {
  const words = String(name || '').replace(/[^\p{L}\s'-]/gu, ' ').trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return String(address || '?').slice(0, 2).toUpperCase();
};
const hue = (text) => { let h = 0; for (const ch of String(text)) h = (h * 31 + ch.codePointAt(0)) >>> 0; return h % 8; };

// ---- drawing -----------------------------------------------------------------------------------
function highlighted(text, marks) {
  const out = [];
  let at = 0;
  for (const m of [...(marks || [])].sort((a, b) => a.start - b.start)) {
    if (m.start < at || m.end > text.length || m.end <= m.start) continue;
    if (m.start > at) out.push(text.slice(at, m.start));
    out.push(el('mark', {}, text.slice(m.start, m.end)));
    at = m.end;
  }
  if (at < text.length) out.push(text.slice(at));
  return out;
}

// "Show me": Outlook gives an add-in no way to select or scroll to text in the message being written,
// so the pane shows the sentence where it sits, between its neighbours.
function context(f) {
  const text = state.seen?.[f.source];
  if (typeof text !== 'string') return null;
  const all = splitSentences(text);
  const same = all.map((s, i) => ({ s, i })).filter(({ s }) => s.text.replace(/\s+/g, ' ') === f.sentence.text.replace(/\s+/g, ' '));
  const hit = same[f.sentence.occurrence] ?? same[0];
  if (!hit) return null;
  const parts = [];
  if (hit.i > 0) parts.push(all[hit.i - 1].text + ' ');
  parts.push(el('mark', {}, hit.s.text));
  if (hit.i + 1 < all.length) parts.push(' ' + all[hit.i + 1].text);
  return parts;
}

// A long address wraps after its @ (dan@ / whitfielddev.example) before anywhere else.
const breakAfterAt = (address) => { const s = String(address || ''), at = s.indexOf('@'); return at < 0 ? s : [s.slice(0, at + 1), document.createElement('wbr'), s.slice(at + 1)]; };
function personRow(r) {
  // Outlook shows an address typed without a name as its own name: show it once, initials from before the @.
  const name = r.name && !String(r.name).includes('@') ? r.name : '';
  return el('li', { class: 'person' },
    el('span', { class: `avatar avatar--h${hue(r.address || r.name)}`, 'aria-hidden': 'true' }, initials(name || String(r.address || '').split('@')[0].replace(/[._-]+/g, ' '), r.address)),
    el('span', { class: 'person__text' }, el('span', { class: 'person__name' + (name ? '' : ' person__name--address') }, name || breakAfterAt(r.address)), name ? el('span', { class: 'person__address' }, r.address) : null),
    el('span', { class: 'chip' + (r.reach === 'inside' ? '' : ' chip--outside') }, r.label));
}

function card(f) {
  const file = f.category === 'attachment';
  const inFile = f.source === 'attachment';
  const recipient = f.source === 'recipient';
  const key = f.id.replace(/[^a-z0-9-]/gi, '-');
  const actions = [];
  if (f.removable && f.source !== 'recipient') {
    const remove = el('button', { class: 'btn', type: 'button', disabled: state.busy.has(f.id), 'data-focus': f.id + ':remove' }, icon('i-scissors'), STRINGS.actions.remove);
    remove.addEventListener('click', () => removeFinding(f));
    actions.push(remove);
  }
  const around = !file && !inFile && !recipient ? context(f) : null;
  if (around) {
    const open = state.expanded.has(f.id);
    const show = el('button', { class: 'btn btn--text', type: 'button', 'aria-expanded': String(open), 'aria-controls': 'context-' + key, 'data-focus': f.id + ':show' }, STRINGS.actions.show);
    show.addEventListener('click', () => { if (state.expanded.has(f.id)) state.expanded.delete(f.id); else state.expanded.add(f.id); render(); });
    actions.push(show);
  }
  const error = state.errors.get(f.id);
  return el('article', { class: 'card', 'aria-labelledby': 'label-' + key },
    el('h3', { class: 'card__label', id: 'label-' + key }, f.label),
    f.place ? el('p', { class: 'card__place' }, f.place) : null,
    f.subkind === 'greeting' ? el('p', { class: 'card__excerpt' }, STRINGS.dialog.greeting.replace('{name}', f.greeted || '').replace('{to}', (f.recipients || []).join(', ') || f.sentence.text))
      : (file || recipient) ? el('p', { class: 'card__excerpt card__file' }, recipient ? (f.address || f.recipient?.address || f.sentence.text) : f.sentence.text) : el('p', { class: 'card__excerpt card__excerpt--quote' }, highlighted(f.sentence.text, f.marks)),
    around && state.expanded.has(f.id) ? el('p', { class: 'card__context', id: 'context-' + key }, around) : null,
    el('p', { class: 'card__why' }, f.why),
    file || inFile ? el('p', { class: 'card__note' }, STRINGS.pane.fileNote) : null,
    actions.length ? el('div', { class: 'card__actions' }, actions) : null,
    error ? el('p', { class: 'card__error', role: 'alert' }, error) : null);
}

// A card stays while its sentence is still in the draft (and a file card while the file is attached).
function live(findings) {
  return findings.filter((f) => {
    if (f.source === 'recipient') return recipientCardLive(f, state.addresses);
    if (f.source === 'attachment') return !state.files || state.files.includes(f.file);
    const text = state.seen?.[f.source];
    return typeof text !== 'string' || stillPresent(text, f.sentence.text, f.sentence.occurrence);
  });
}

function render() {
  // Cards are rebuilt on every render; keep keyboard focus on the same control.
  const focused = document.activeElement?.getAttribute?.('data-focus');
  const view = state.view;
  $('pane').dataset.state = view;
  $('name').textContent = STRINGS.name;
  // The pill: Held (B and D) or Clear (E); none before a Send or while one is checked.
  const pill = view === 'held' || view === 'unavailable' ? 'held' : view === 'clear' ? 'clear' : null;
  const landed = pill && pill !== state.lastPill ? ' chip--landed' : '';
  $('pill').replaceChildren(pill === 'held' ? el('span', { class: 'chip chip--held' + landed }, icon('i-pause'), state.result?.outcome === 'ask' ? STRINGS.pill.ask : STRINGS.pill.held)
    : pill === 'clear' ? el('span', { class: 'chip chip--clear' + landed }, icon('i-check'), STRINGS.pill.clear) : '');
  state.lastPill = pill;
  // The line under the name.
  const line = $('line');
  line.className = 'line' + (view === 'checking' ? ' line--checking' : '');
  if (view === 'checking') line.replaceChildren(el('span', { class: 'line__dot', 'aria-hidden': 'true' }), STRINGS.checking);
  else if (view === 'idle') line.replaceChildren(copy(state.changedSinceCheck ? STRINGS.pane.changed : STRINGS.pane.idle));
  else if (view === 'empty') line.replaceChildren(STRINGS.pane.empty);
  else line.replaceChildren();
  // A held result whose every card is gone (removed or edited away) has nothing left to review:
  // it says the draft changed and offers Check again, rather than an empty list.
  const kept = view === 'held' ? live(state.result?.findings || []) : [];
  // Recipient problems first, as in the Send dialog: a wrong recipient is why everything else leaks.
  const findings = [...kept.filter((f) => f.source === 'recipient'), ...kept.filter((f) => f.source !== 'recipient')];
  const resolved = view === 'held' && !findings.length && !!state.result?.findings?.length;
  // State D.
  const notice = $('notice');
  notice.hidden = !['held', 'unavailable'].includes(view);
  const canSend = state.result?.outcome === 'ask';
  const noticeParts = [];
  if (view === 'unavailable') {
    if (state.result?.lastSend) noticeParts.push(STRINGS.pane.lastSend);
    noticeParts.push(copy(STRINGS.unavailable), failureReason(state.result));
  }
  if (['held', 'unavailable'].includes(view)) {
    if (resolved) noticeParts.push(copy(STRINGS.pane.changed));
    else if (!state.result?.lastSend) noticeParts.push(copy(canSend ? STRINGS.pane.ask : STRINGS.pane.hold));
    if (tooLargeToRetry(state.result)) noticeParts.push(STRINGS.dialog.sizeAction);
  }
  notice.textContent = noticeParts.join(' ');
  const retry = $('check-again');
  retry.textContent = STRINGS.pane.checkAgain;
  retry.hidden = tooLargeToRetry(state.result) || !state.changedSinceCheck && !resolved && (!state.result?.hasFailures || !['held', 'unavailable', 'checking'].includes(view));
  retry.disabled = !!state.rechecking || !state.item;
  // Who will see this.
  const people = view === 'checking' ? state.recipients : state.result?.recipients || [];
  $('recipients-title').textContent = STRINGS.sections.recipients;
  $('recipients').hidden = !people.length || view === 'idle' || view === 'empty';
  $('people').replaceChildren(...people.map(personRow));
  // What stopped it: only when there is a card to show (never an empty heading while checking or clear).
  $('findings-title').textContent = STRINGS.sections.findings;
  $('findings').hidden = !findings.length;
  $('cards').replaceChildren(...findings.map(card));
  // The footer.
  const foot = [];
  if (view === 'held') foot.push(el('p', { class: 'foot__nothing' }, STRINGS.footer[0]));
  if (view === 'clear') foot.push(el('p', { class: 'foot__checked' }, icon('i-check-circle'), copy(state.result?.paneCheck ? STRINGS.pane.checked : STRINGS.checkedNotice)));
  if (view !== 'empty') foot.push(el('p', { class: 'foot__data' }, copy(STRINGS.footer[1])));
  $('foot').replaceChildren(...foot);
  if (focused) [...document.querySelectorAll('[data-focus]')].find((n) => n.getAttribute('data-focus') === focused)?.focus();
}

async function prepareImages(event) {
  const service = globalThis.DisclosureGateOcr;
  if (!service || !state.item) return;
  const status = $('ocr-status');
  try {
    await service.prepare(Office, null, event);
    const pending = service.pending(Office);
    status.hidden = !pending; status.textContent = pending ? STRINGS.ocr.paneReading : '';
    if (pending) { await service.wait(Office, Date.now() + 119000); status.hidden = true; status.textContent = ''; }
  } catch { status.hidden = false; status.textContent = STRINGS.ocr.failed; }
}

function show(result) {
  if (!result || typeof result.state !== 'string') return;
  if (['held', 'unavailable', 'too_large'].includes(result.state)) {
    let config, canOverride = true;
    try { config = runtimeConfig(globalThis.Office || {}, globalThis); canOverride = !state.item || Office.context.requirements.isSetSupported('Mailbox', '1.14'); }
    catch { config = { findings: 'hold', failures: 'hold' }; canOverride = false; }
    result = describeResult(result, config, { canOverride, reviewButton: false, itemType: state.item ? Draft().itemType(state.item) : result.itemType });
  }
  const view = result.state === 'too_large' ? 'unavailable' : result.state;
  state.changedSinceCheck = false;
  if (view === 'held' || view === 'clear' || view === 'unavailable') { state.result = result; state.view = view; }
  else if (result.state === 'idle' && !state.result) state.view = 'idle';
  render();
}

// ---- Outlook ------------------------------------------------------------------------------------
const sessionGet = (key) => new Promise((resolve) => {
  const data = state.item?.sessionData;
  if (!data || typeof data.getAsync !== 'function') { resolve(null); return; }
  data.getAsync(key, (r) => { try { resolve(r.status === 'succeeded' && r.value ? JSON.parse(r.value) : null); } catch { resolve(null); } });
});

// The last Send result, only when the current draft still matches its fingerprint.
async function latest() {
  const stored=await sessionGet(RESULT_KEY);
  if(!stored?.result || !stored.fingerprint) return null;
  try {
    const draft=await Draft().readDraft(Office,stored.recheck===true);
    if(Draft().fingerprint(draft)!==stored.fingerprint) return null;
    if(stored.recheck) return checkDraft(draft,{config:runtimeConfig(Office)});
    return stored.result;
  } catch { return null; }
}

async function refreshSeen() {
  const call = Draft().call, item = state.item;
  const envelope = await Draft().readEnvelope(item, Office.context.mailbox.userProfile || {});
  // The same body text the check read, so its sentences (and their line breaks) line up.
  const tasks = [() => call(item.subject, 'getAsync'), () => Draft().readBody(item), () => call(item, 'getAttachmentsAsync')];
  if (envelope.itemType === 'appointment') tasks.push(() => call(item.location, 'getAsync'));
  const [subject, body, attachments, location] = await Draft().inThrees(tasks);
  state.seen = { subject, body: body.text, location: Draft().locationText(location, envelope.locations) };
  state.addresses = [...envelope.to, ...envelope.cc, ...envelope.bcc].map(r => r.address.toLowerCase());
  state.files = (attachments || []).map((a) => String(a.name || ''));
  // Also bind the pane's reads for inside-only drafts, whose Send reader stops at the envelope.
  state.seenIdentity = sha256(JSON.stringify([state.seen, envelope, attachments]));
}

function invalidatePaneCheck() {
  state.result = null; state.view = 'idle'; state.changedSinceCheck = true; state.paneSnapshot = null;
  state.errors.clear(); state.expanded.clear(); render();
}

async function paneCheckMatches(result, snapshot) {
  if (snapshot !== state.seenIdentity) return false;
  if (!result.paneFingerprint) return true;
  return Draft().fingerprint(await Draft().readDraft(Office, false)) === result.paneFingerprint;
}

// Typing has no Office event: compare every poll, and drop the cards whose sentence has gone.
async function poll() {
  if (!state.item || document.hidden || state.rechecking || state.polling) return;
  state.polling = true;
  const result = state.result;
  try {
    const before = state.seenIdentity;
    await refreshSeen();
    if (result?.paneCheck && !await paneCheckMatches(result, state.paneSnapshot)) {
      if (state.result === result && !state.rechecking) invalidatePaneCheck();
    } else if (state.seenIdentity !== before && state.view === 'held') render();
  } catch {
    // A pass cannot stay current when the draft can no longer be read.
    if (result?.paneCheck && state.result === result && !state.rechecking) invalidatePaneCheck();
  } finally { state.polling = false; }
}

// The Send handler writes its phase into the item's session data.
async function watchPhase() {
  if (state.rechecking) return;
  const p = await sessionGet(PHASE_KEY);
  if (!p || !(p.at > state.phaseAt)) return;
  state.phaseAt = p.at;
  state.result = null; state.paneSnapshot = null; state.changedSinceCheck = false;
  if (p.phase === 'checking') {
    state.view = 'checking';
    render();
    try {
      const d = await Draft().readDraft(Office, false);
      const r = classifyDraft(d, {config:runtimeConfig(Office)});
      if (r?.recipients && state.view === 'checking') { state.recipients = r.recipients; render(); }
    } catch { /* the result brings the recipients */ }
    return;
  }
  state.errors.clear(); state.expanded.clear();
  if (p.phase === 'unavailable' || p.phase === 'too_large') { show({ ...(p.result || { state: p.phase, findings: [], recipients: state.recipients }), lastSend: true }); return; }
  state.view = 'idle';
  await refreshSeen().catch(() => {});
  show(await latest());
}

async function recheck() {
  if (state.rechecking || !state.item) return;
  state.rechecking = true; state.view = 'checking'; render();
  try {
    await refreshSeen();
    const snapshot = state.seenIdentity;
    const result = await checkAgain(Office, { config: runtimeConfig(Office) });
    await refreshSeen();
    state.errors.clear(); state.expanded.clear();
    if (await paneCheckMatches(result, snapshot)) { state.paneSnapshot = snapshot; show(result); }
    else invalidatePaneCheck();
  } catch { state.paneSnapshot = state.seenIdentity; show({ state: 'unavailable', reason: 'read', findings: [], paneCheck: true }); }
  finally { state.rechecking = false; render(); }
}

async function removeFinding(f) {
  const call = Draft().call, item = state.item;
  state.busy.add(f.id);
  state.errors.delete(f.id);
  render();
  let ok = false;
  try {
    if (f.source === 'subject') {
      const before = await call(item.subject, 'getAsync');
      const out = removeSentenceFromText(before, f.sentence.text, f.sentence.occurrence);
      if (out.ok && (await call(item.subject, 'getAsync')) === before) { await call(item.subject, 'setAsync', [out.text]); ok = true; }
    } else if (f.source === 'body') {
      const html = String(await call(item.body, 'getTypeAsync')).toLowerCase() === 'html';
      const coercion = html ? Office.CoercionType.Html : Office.CoercionType.Text;
      const before = await call(item.body, 'getAsync', [coercion]);
      const out = html ? removeSentenceFromHtml(before, f.sentence.text, f.sentence.occurrence) : removeSentenceFromText(before, f.sentence.text, f.sentence.occurrence);
      // Re-read just before writing: if the sender typed meanwhile, their words win and nothing is written.
      if (out.ok && (await call(item.body, 'getAsync', [coercion])) === before) { await call(item.body, 'setAsync', [html ? out.html : out.text, { coercionType: coercion }]); ok = true; }
    }
  } catch { ok = false; }
  state.busy.delete(f.id);
  state.expanded.delete(f.id);
  if (!ok) state.errors.set(f.id, STRINGS.pane.removeFailed);
  await refreshSeen().catch(() => {});
  render();
}

function applyTheme(requested) {
  const root = document.documentElement;
  if (requested === 'light' || requested === 'dark') { root.dataset.theme = requested; return; }
  try {
    const bg = globalThis.Office?.context?.officeTheme?.bodyBackgroundColor;
    if (bg && /^#?[0-9a-f]{6}$/i.test(bg)) {
      const n = parseInt(bg.replace('#', ''), 16);
      const lum = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
      root.dataset.theme = lum < 0.5 ? 'dark' : 'light';
    }
  } catch { /* follow the system */ }
}

// ---- the film's fictional run, for looking at the pane outside Outlook --------------------------
const DEMO = { from: { name: 'John Reyes', address: 'john@northline.example' }, to: [{ name: 'Kate Morgan', address: 'kate@northline.example', kind: 'person' }], cc: [{ name: 'Dan Whitfield', address: 'dan@whitfielddev.example', kind: 'person' }], bcc: [], subject: 'North Hall: CO 12' };
const HELD_BODY = "Kate — North Hall's tracking triple the margin we bid. If Dan pushes on CO 12, we've got room.";
const CLEAN_BODY = "Kate — let's walk CO 12 together before Dan's call on Friday.";
async function preview(kind) {
  const body = kind === 'held' ? HELD_BODY : CLEAN_BODY;
  state.seen = { subject: DEMO.subject, body };
  const people = classifyDraft(DEMO);
  state.recipients = people?.recipients || [];
  if (kind === 'idle' || kind === 'checking') { state.view = kind; render(); return; }
  if (kind === 'clear' || kind === 'unavailable') { show({ state: kind, findings: [], recipients: state.recipients }); return; }
  const attachments = kind === 'attachment' ? [{ id: 'p1', name: 'site-photos.zip', size: 48213, isInline: false, type: 'file' }] : [];
  state.files = attachments.map((a) => a.name);
  show(await checkDraft({ ...DEMO, body: { format: 'html', text: body }, attachments }).catch(() => ({ state: 'unavailable', findings: [], recipients: state.recipients })));
}

async function start() {
  $('check-again').addEventListener('click', recheck);
  const params = new URLSearchParams(location.search);
  applyTheme(params.get('theme'));
  const kind = params.get('preview');
  if (kind) { await preview(kind); return; }
  const item = globalThis.Office?.context?.mailbox?.item;
  if (!Draft().composeItem(item)) { state.view = 'empty'; render(); return; }
  state.item = item;
  render();
  prepareImages();
  await refreshSeen().catch(() => {});
  const p = await sessionGet(PHASE_KEY);
  if (p?.at) state.phaseAt = p.at;
  if (p?.phase === 'checking' && Date.now() - p.at < 10000) { state.phaseAt = 0; await watchPhase(); }
  else if (p?.phase === 'unavailable' || p?.phase === 'too_large') show({ ...(p.result || { state: p.phase, findings: [] }), lastSend: true });
  else show(await latest());
  try { item.addHandlerAsync(Office.EventType.AttachmentsChanged, event => { prepareImages(event); poll(); }); } catch { /* Send still reads it */ }
  setInterval(poll, POLL_MS);
  setInterval(watchPhase, PHASE_MS);
}

if (new URLSearchParams(location.search).has('preview')) start();
else if (globalThis.Office?.onReady) Office.onReady(start); else start();
