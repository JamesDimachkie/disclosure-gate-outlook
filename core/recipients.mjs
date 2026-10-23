// Who will see this (spec §4). Inside means the address's domain is exactly one of the domains an
// admin set on the server; every other domain is outside, which makes lookalikes
// (northline.example.co, north1ine.example, a Cyrillic "о") outside by construction. A distribution
// list or contact group, or an entry without a checkable address, can't be checked: the add-in has no
// way to expand its members, so it counts like an outside recipient for holding. The draft's own
// recipient type never makes anyone inside; only the admin's list does.

const ADDRESS = /^[^\s@<>,;:"()[\]\\]+@([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+)$/i;
const DOMAIN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

// The admin's list, validated: lowercase, unique, sorted. An empty or malformed list is refused, so a
// typo can never make everyone inside.
export function normalizeDomains(list) {
  if (!Array.isArray(list) || !list.length) throw new Error('internal_domains_required');
  const out = new Set();
  for (const item of list) {
    const domain = typeof item === 'string' ? item.trim().toLowerCase() : '';
    if (!DOMAIN.test(domain) || domain.length > 253) throw new Error('invalid_internal_domain');
    out.add(domain);
  }
  return Object.freeze([...out].sort());
}

// The checkable address, lowercased, or null.
export function checkableAddress(value) {
  if (typeof value !== 'string' || value.length > 254) return null;
  const address = value.trim();
  return ADDRESS.test(address) ? address.toLowerCase() : null;
}

// One recipient: {field, name, address, kind} → {field, name, address, reach}. kind comes from
// Office's recipientType: 'group' for a distribution list, 'person' otherwise.
export function classifyRecipient(recipient, domains) {
  const field = ['to', 'cc', 'bcc'].includes(recipient?.field) ? recipient.field : 'to';
  const name = typeof recipient?.name === 'string' ? recipient.name.trim().slice(0, 200) : '';
  const raw = typeof recipient?.address === 'string' ? recipient.address.trim().slice(0, 254) : '';
  const address = checkableAddress(raw);
  let reach;
  if (recipient?.kind === 'group' || !address) reach = 'unknown';
  else reach = domains.includes(address.split('@')[1]) ? 'inside' : 'outside';
  return { field, name, address: address || raw, reach };
}

const ORDER = { outside: 0, unknown: 1, inside: 2 };

// Every recipient across To, Cc and Bcc, outside first (then can't check, then inside), otherwise in
// the order the sender wrote them.
export function classifyRecipients(draft, domains) {
  const all = [];
  for (const field of ['to', 'cc', 'bcc']) for (const r of draft?.[field] || []) all.push(classifyRecipient({ ...r, field }, domains));
  return all.map((r, i) => ({ r, i })).sort((a, b) => ORDER[a.r.reach] - ORDER[b.r.reach] || a.i - b.i).map((x) => x.r);
}

// 'outside' if anyone is outside, else 'unknown' if anyone can't be checked, else 'inside'.
export function reachOf(recipients) {
  if (recipients.some((r) => r.reach === 'outside')) return 'outside';
  if (recipients.some((r) => r.reach === 'unknown')) return 'unknown';
  return 'inside';
}
