import { fromBase64 } from '../core/bytes.mjs';
import { attachmentText, MAX_ATTACHMENT_BYTES } from '../core/attachments.mjs';
import { pdfImages } from '../core/extract/pdf.mjs';
import { imageInfo } from '../core/image-info.mjs';
import { OCR_KEY, ocrCandidate, sameAttachment, tinyInline, OCR_MAX_TEXT } from '../core/ocr-policy.mjs';
import { ocrPaths } from './ocr-config.mjs';
import { sha256 } from '../core/sha256.mjs';

const CACHE_CHARS = 12000, LEASE_MS = 120000;
const statuses = ['ready', 'pending', 'failed', 'unsupported'];
export function validEntry(a, e) {
  return ocrCandidate(a) && sameAttachment(a, e) && statuses.includes(e.status) && (e.status !== 'ready' || (typeof e.text === 'string' && e.text.length <= OCR_MAX_TEXT && /^[a-f0-9]{64}$/.test(e.hash || '')));
}
export function createOcrService(root) {
  const states = new WeakMap(); let engineLoading, running, queue = [];
  const call = (target, method, args = []) => new Promise((resolve, reject) => {
    if (!target || typeof target[method] !== 'function') { reject(new Error('ocr_api')); return; }
    const timer = setTimeout(() => reject(new Error('ocr_api_timeout')), 5000);
    try { target[method](...args, r => { clearTimeout(timer); if (r?.status === 'succeeded') resolve(r.value); else reject(new Error('ocr_api')); }); }
    catch (error) { clearTimeout(timer); reject(error); }
  });
  const capable = () => !!(root.document && typeof root.Worker === 'function' && typeof root.WebAssembly === 'object' && typeof root.BigInt === 'function');
  const normalize = list => list.map(a => ({ ...a, id: String(a.id || ''), name: String(a.name || ''), type: String(a.type || a.attachmentType || 'file').toLowerCase(), isInline: a.isInline === true }));
  function stateOf(item) {
    let s = states.get(item);
    if (!s) { s = { entries: Object.create(null), write: Promise.resolve(), sync: Promise.resolve(), item, persisted: false }; states.set(item, s); }
    return s;
  }
  async function stored(item) {
    try { const c = JSON.parse(await call(item.sessionData, 'getAsync', [OCR_KEY])); return c?.version === 1 && c.attachments && typeof c.attachments === 'object' ? c.attachments : {}; } catch { return {}; }
  }
  function persist(s) {
    s.write = s.write.catch(() => {}).then(async () => {
      if (!s.item.sessionData?.setAsync) return;
      const attachments = Object.create(null);
      for (const id of Object.keys(s.entries)) {
        let entry = s.entries[id];
        attachments[id] = entry;
        if (JSON.stringify({ version: 1, attachments }).length > CACHE_CHARS) {
          // Never truncate OCR text and label it ready. A later Send in this runtime can still
          // use the complete in-memory result; another runtime sees an explicit can't-check.
          attachments[id] = { name: entry.name, size: entry.size, status: 'failed', reason: 'ocr_cache_size' };
          if (JSON.stringify({ version: 1, attachments }).length > CACHE_CHARS) delete attachments[id];
        }
      }
      try { await call(s.item.sessionData, 'setAsync', [OCR_KEY, JSON.stringify({ version: 1, attachments })]); s.persisted = true; } catch { /* Missing sessionData uses memory only; never grants a clearance. */ }
    });
    return s.write;
  }
  function loadEngine() {
    if (root.DisclosureGateOcrEngine) return Promise.resolve(root.DisclosureGateOcrEngine);
    if (!engineLoading) engineLoading = new Promise((resolve, reject) => {
      const script = root.document.createElement('script');
      script.src = ocrPaths(root.location.href).enginePath;
      script.onload = () => root.DisclosureGateOcrEngine ? resolve(root.DisclosureGateOcrEngine) : reject(new Error('ocr_load'));
      script.onerror = () => reject(new Error('ocr_load'));
      root.document.head.appendChild(script);
    }).catch(error => { engineLoading = null; throw error; });
    return engineLoading;
  }
  async function process(s, a, entry) {
    if (s.entries[a.id] !== entry) return;
    try {
      let content;
      if (typeof a.content === 'string') content = { format: 'base64', content: a.content };
      else content = await call(s.item, 'getAttachmentContentAsync', [a.id]);
      if (content?.format?.toLowerCase() !== 'base64' || typeof content.content !== 'string' || content.content.length > Math.ceil(MAX_ATTACHMENT_BYTES / 3) * 4 + 4) throw new Error('ocr_content');
      const bytes = fromBase64(content.content);
      if (!bytes.length || bytes.length > MAX_ATTACHMENT_BYTES) throw new Error('ocr_size');
      entry.hash = sha256(bytes);
      let images;
      if (/\.pdf$/i.test(a.name)) {
        const text = attachmentText({ ...a, content: content.content, ocr: null });
        if (text.ok) { Object.assign(entry, { status: 'failed', reason: 'pdf_text_layer' }); return; }
        if (text.reason !== 'no_text') throw new Error('scan_unreadable');
        images = pdfImages(bytes);
      } else {
        const info = imageInfo(bytes);
        if (tinyInline(a, info) && typeof root.createImageBitmap === 'function' && root.Blob) {
          // A small header alone is insufficient: malformed files must not use the exception.
          let bitmap;
          try {
            bitmap = await root.createImageBitmap(new root.Blob([bytes]));
            if (bitmap.width === info.width && bitmap.height === info.height) { Object.assign(entry, { status: 'ready', text: '', reason: 'tiny_inline' }); return; }
          } catch { /* Let the engine decode or refuse this container. */ }
          finally { bitmap?.close(); }
        }
        images = [{ bytes }];
      }
      // Text PDFs and tiny spacers never load the engine or traineddata.
      const engine = await loadEngine(), texts = [], hints = [];
      for (const image of images) {
        if (s.entries[a.id] !== entry) return;
        const info = imageInfo(image.bytes);
        if (image.width && (image.width !== info.width || image.height !== info.height)) throw new Error('scan_dimensions');
        const read = await engine.recognize(image.bytes);
        if (read?.status === 'failed' && read.reason === 'ocr_low_confidence') { hints.push(typeof read.hint === 'string' ? read.hint : ''); continue; }
        if (read?.status !== 'ready' || typeof read.text !== 'string') throw new Error(read?.reason || 'ocr_failed');
        texts.push(read.text);
      }
      const text = texts.join('\n');
      if (hints.length) {
        // A page or picture read with low confidence: the file can't be cleared, but what was read is a
        // hint the gate screens, so a secret read imperfectly still counts.
        const hint = [...texts, ...hints].filter(Boolean).join('\n');
        if (hint.length > OCR_MAX_TEXT) throw new Error('too_long');
        delete entry.text;
        Object.assign(entry, hint ? { status: 'failed', reason: 'ocr_low_confidence', hint } : { status: 'failed', reason: 'ocr_low_confidence' });
        return;
      }
      if (text.length > OCR_MAX_TEXT) throw new Error('too_long');
      Object.assign(entry, { status: 'ready', text, reason: text.trim() ? 'text' : 'no_text' });
    } catch (error) { Object.assign(entry, { status: 'failed', reason: String(error?.message || 'ocr_failed').slice(0, 40) }); delete entry.text; delete entry.hint; }
    finally {
      // Office IDs can be reused (classic/Mac use indices). Re-read before publication as well
      // as invalidating change events; a removed/replaced job cannot resurrect a ready result.
      try {
        const current = normalize(await call(s.item, 'getAttachmentsAsync'));
        if (!current.some(x => x.id === a.id && sameAttachment(a, x))) { if (s.entries[a.id] === entry) delete s.entries[a.id]; }
        if (s.persisted && s.entries[a.id] === entry) {
          const shared = (await stored(s.item))[a.id];
          if (!shared || (shared.token && entry.token && shared.token !== entry.token)) {
            if (validEntry(a, shared)) s.entries[a.id] = shared; else delete s.entries[a.id];
          }
        }
      } catch { if (s.entries[a.id] === entry) Object.assign(entry, { status: 'failed', text: undefined, reason: 'ocr_identity' }); }
      await persist(s);
    }
  }
  function drain() {
    if (running) return;
    running = (async () => {
      while (queue.length) {
        const job = queue.shift(); let timer;
        // OCR owns the heavy-work slot. Terminate model initialization/inference before it starts.
        try { root.DisclosureGateSemantic?.stopForOcr?.(); } catch { /* Optional model never fails OCR. */ }
        await Promise.race([process(...job), new Promise(resolve => { timer = setTimeout(async () => {
          const [s, a, entry] = job;
          if (s.entries[a.id] === entry) s.entries[a.id] = { name: a.name, size: a.size, token: entry.token, status: 'failed', reason: 'ocr_timeout' };
          if (root.DisclosureGateOcrEngine?.close) await root.DisclosureGateOcrEngine.close();
          await persist(s); resolve();
        }, LEASE_MS - 1000); })]);
        clearTimeout(timer);
      }
      if (root.DisclosureGateOcrEngine?.close) await root.DisclosureGateOcrEngine.close();
    })().catch(() => {}).finally(() => { running = null; if (queue.length) drain(); });
  }
  async function prepare(office, attachments, change) {
    const item = office.context.mailbox.item, s = stateOf(item);
    s.sync = s.sync.catch(() => {}).then(async () => {
      const list = normalize(attachments || await call(item, 'getAttachmentsAsync')), external = await stored(item), next = Object.create(null);
      const changedId = change?.attachmentDetails ? String(change.attachmentDetails.id) : null;
      const removed = String(change?.attachmentStatus || '').toLowerCase() === 'removed';
      for (const a of list) {
        if (!ocrCandidate(a) || (removed && a.id === changedId)) continue;
        let entry = s.entries[a.id];
        // Every explicit Added invalidates even an otherwise identical index/name/size tuple.
        if (a.id === changedId || !validEntry(a, entry)) entry = null;
        if (entry && validEntry(a, external[a.id]) && external[a.id].at > entry.at) entry = { ...external[a.id] };
        if (entry && entry.status !== 'ready' && validEntry(a, external[a.id]) && external[a.id].status === 'ready') entry = { ...external[a.id] };
        if (!entry && a.id !== changedId && validEntry(a, external[a.id])) entry = { ...external[a.id] };
        // A picture whose bytes changed since it was read stays "changed" (it stops) until it is read
        // again; it never falls back to the excused "OCR unavailable" state.
        const changed = !!(entry?.hash && typeof a.content === 'string' && entry.hash !== sha256(fromBase64(a.content)));
        if (entry?.status === 'ready' && typeof a.content !== 'string' && attachments || changed) entry = null;
        if (entry?.status === 'failed' && ['ocr_api', 'ocr_api_timeout', 'ocr_content', 'ocr_load', 'ocr_timeout', 'ocr_cache_size'].includes(entry.reason) && typeof a.content === 'string' && capable()) entry = null;
        if (entry?.status === 'pending' && Date.now() - entry.at > LEASE_MS) entry = null;
        if (!entry) {
          entry = { name: a.name, size: a.size, status: 'pending', at: Date.now(), token: Date.now() + ':' + Math.random().toString(36).slice(2) };
          if (!Number.isSafeInteger(a.size) || a.size < 0 || a.size > MAX_ATTACHMENT_BYTES) Object.assign(entry, { status: 'failed', reason: 'size' });
          else if (!capable()) Object.assign(entry, changed ? { status: 'failed', reason: 'ocr_hash' } : { status: 'unsupported', reason: 'ocr_unsupported' });
          else queue.push([s, a, entry]);
        } else if (entry.status === 'unsupported' && capable()) {
          entry = { name: a.name, size: a.size, status: 'pending', at: Date.now(), token: Date.now() + ':' + Math.random().toString(36).slice(2) }; queue.push([s, a, entry]);
        }
        next[a.id] = entry;
      }
      s.entries = next;
      await persist(s); drain();
      return s;
    });
    return s.sync;
  }
  async function refresh(s) {
    const external = await stored(s.item);
    for (const id of Object.keys(s.entries)) {
      const e = s.entries[id], c = external[id];
      if (e.status === 'pending' && validEntry({ ...e, type: 'file' }, c) && c.status !== 'pending') s.entries[id] = { ...c };
    }
  }
  async function wait(office, deadline) {
    const s = stateOf(office.context.mailbox.item);
    while (Object.values(s.entries).some(e => e.status === 'pending') && Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, Math.min(75, Math.max(0, deadline - Date.now()))));
      await refresh(s);
    }
    return s;
  }
  function apply(office, attachments) {
    const s = stateOf(office.context.mailbox.item);
    for (const a of attachments) { delete a.ocr; const e = s.entries[a.id]; if (validEntry(a, e)) a.ocr = { status: e.status, text: e.text, hash: e.hash, reason: e.reason, hint: e.hint }; }
  }
  const pending = office => Object.values(stateOf(office.context.mailbox.item).entries).some(e => e.status === 'pending');
  async function preRead(office, event) {
    let done = false;
    const complete = () => { if (!done) { done = true; event?.completed?.(); } };
    const deadline = Date.now() + LEASE_MS, timer = setTimeout(complete, LEASE_MS);
    try {
      await prepare(office, null, event); await wait(office, deadline - 500); await stateOf(office.context.mailbox.item).write;
      // Only public asset preparation; no inference or email is retained across activations.
      let modelOn = false; try { modelOn = root.DisclosureGateCore?.runtimeConfig?.(office, root)?.model === 'on'; } catch { /* Default off. */ }
      if (!done && modelOn) await root.DisclosureGateSemantic?.preload({ deadline: deadline - 100 });
    }
    catch { /* The Send read independently fails closed. */ }
    finally { clearTimeout(timer); complete(); }
  }
  return { prepare, wait, apply, pending, preRead, capable, busy: () => !!running || queue.length > 0, CACHE_CHARS };
}
const root = globalThis;
root.DisclosureGateOcr = createOcrService(root);
if (root.Office?.actions) {
  root.Office.actions.associate('onMessageAttachmentsChangedHandler', event => root.DisclosureGateOcr.preRead(root.Office, event));
  root.Office.actions.associate('onMessageComposeHandler', event => root.DisclosureGateOcr.preRead(root.Office, event));
}
