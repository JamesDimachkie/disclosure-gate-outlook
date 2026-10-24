// Records about people (spec §5.4): a table or form that pairs a person with what is sensitive about
// them: a client register with home addresses and tax IDs, a claims sheet, a list of offenders and
// their release dates, an employee's tax form. Most large real email disclosures were one of these sent
// to the wrong place; each value on its own often matches no other rule (a name, an address, a made-up
// reference). Plain JavaScript only: this runs inside Outlook.
import { tableRows } from './sentences.mjs';

// A column (or form label) that names who a row is about.
const PERSON = /^(?:(?:full|first|last|given|family|sur)\s*name|name|names|person|people|client|clients|customer|patient|claimant|applicant|employee|staff(?:\s+member)?|member|student|pupil|child|children|adopted\s+child|tenant|resident|borrower|account\s+holder|policy\s?holder|beneficiary|investor|offender|prisoner|candidate|worker|volunteer|parent|guardian|service\s+user|case\s+name|subject)$/i;
// What makes a record about a person sensitive. Contact details alone (an email or a phone column) do not.
const SENSITIVE = new RegExp(String.raw`\b(?:home(?!\s+(?:team|page|office|game|ground|match|fixture|delivery|visit))(?:\s+address)?|date\s+of\s+birth|birth\s?date|dob|social\s+security|ssn|national\s+insurance|ni\s+(?:no|number)|nino|nric|passport|tax\s+(?:id|identifier|number|code|file)|tin|sin|medicare|nhs\s+(?:no|number)|health|medical|diagnosis|condition|medication|disability|injury|treatment|allerg\w*|mental|offen[cs]e|conviction|criminal|sentence|planned\s+release|probation|arrest|court\s+(?:date|case)|immigration|visa|asylum|nationality|ethnicity|religion|sexual|salary|wage|wages|pay(?:\s+rate)?|income|bonus|pension|benefits?|grievance|disciplinary|spouse|next\s+of\s+kin|dependants?|children|child|adopt\w*|foster\w*|social\s+worker|custody|bank(?!\s+(?:holiday|holidays|transfer\s+fee))|account\s+(?:number|no)|loan(?:\s+account)?|iban|sort\s+code|mortgage|debt|arrears|credit\s+score|claim\s+(?:value|valuation|reference|status)|valuation|settlement|injury[-\s]claim\w*)\b`, 'i');
const CONTACT_ONLY = /^(?:e-?mail|email\s+address|phone|telephone|mobile|tel|contact|role|title|job\s+title|position|team|department|company|organisation|organization)$/i;
const header = (h) => String(h || '').trim().replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').toLowerCase();

// The same pairing written as a form ("Employee: Avery Reed ... Social Security number: ... Annual
// wages: ..."), as a PDF or a pasted record reads. A labelled person and at least two sensitive labels,
// one of them more than a bank or balance line, so an invoice's payment details alone never match.
const FORM_PERSON = /\b(?:employee|patient|client|claimant|applicant|tenant|borrower|account\s+holder|policy\s?holder|member|student|pupil|child|resident|offender|candidate|beneficiary|investor|name)\s*:\s*(?=[A-Z][a-z])/gi;
const FORM_STRONG = /\b(?:date\s+of\s+birth|birth\s?date|dob|social\s+security(?:\s+(?:number|no|identifier))?|ssn|national\s+insurance(?:\s+(?:number|no))?|nric|passport(?:\s+(?:number|no))?|tax\s+(?:id|identifier|number|code)|home\s+address|annual\s+(?:pay|wages|salary|income)|wages|salary|income|visa(?:\s+(?:reference|number|no|status))?|diagnosis|medical\s+condition|medication|disability|offen[cs]e|conviction|immigration\s+status|visa\s+status|spouse|adopted|social\s+worker)\b/gi;
const FORM_MONEY = /\b(?:bank(?:\s+account)?|account(?:\s+(?:number|no))?|mortgage(?:\s+account)?|outstanding\s+balance|loan(?:\s+account)?|investment\s+account|iban|sort\s+code)\b\s*:?/gi;

// Hits on the sentence holding the person cell (tables) or the person label (forms):
// Map<sentence index, [{id, category, subkind, start, end}]>, offsets within the sentence.
export function recordsHits(text, sentences, csv = false) {
  const out = new Map();
  const at = (pos, end) => {
    let index = -1;
    for (let k = 0; k < sentences.length; k++) { if (sentences[k].start <= pos) index = k; else break; }
    const s = sentences[index];
    if (!s || pos >= s.end || out.has(index)) return;
    out.set(index, [{ id: 'personal.records', category: 'personal', subkind: 'records', start: pos - s.start, end: Math.min(end, s.end) - s.start }]);
  };
  // Tables: a header row with a person column and a sensitive column (contact columns don't count), and
  // a row that fills both: a blank template or a masked column is not a record.
  const byHeader = new Map();
  const filled = (c) => !!c && c.end > c.start && !/^[\s\-–—_*xX./]*$|^(?:n\/?a|none|tbc|tba|nil|unknown)$/i.test(text.slice(c.start, c.end).trim());
  for (const row of tableRows(text, { csv })) {
    const headers = row.cells.map((c) => header(c.header));
    const key = headers.join('\u0001');
    if (!byHeader.has(key)) {
      const person = headers.findIndex((h) => PERSON.test(h));
      const sensitive = headers.map((h, k) => (k !== person && h && !CONTACT_ONLY.test(h) && SENSITIVE.test(h) ? k : -1)).filter((k) => k >= 0);
      byHeader.set(key, person >= 0 && sensitive.length ? { person, sensitive } : null);
    }
    const shape = byHeader.get(key);
    if (!shape) continue;
    const cell = row.cells[shape.person];
    if (filled(cell) && /\p{L}/u.test(text.slice(cell.start, cell.end)) && shape.sensitive.some((k) => filled(row.cells[k]))) { at(cell.start, cell.end); break; }
  }
  if (out.size) return out;
  // Forms: a labelled person, then at least two sensitive labels, at least one beyond money.
  for (const m of text.matchAll(FORM_PERSON)) {
    // The label matches in any case; the value after it must look like a name ("Employee: Avery").
    if (!/^[A-Z][a-z]/.test(text.slice(m.index + m[0].length))) continue;
    const window = text.slice(m.index, m.index + 600);
    const strong = new Set([...window.matchAll(FORM_STRONG)].map((x) => x[0].toLowerCase().replace(/\s+/g, ' ')));
    const money = new Set([...window.matchAll(FORM_MONEY)].map((x) => x[0].toLowerCase().replace(/[\s:]+/g, ' ').trim()));
    if (strong.size >= 1 && strong.size + money.size >= 2) { at(m.index, m.index + m[0].length); break; }
  }
  // A record with no labelled person still counts when it names one: two or more identity numbers
  // or an identity label beside a mortgage or account ("Avery Reed and Morgan Reed NRIC ... Mortgage account:").
  if (!out.size) {
    const name = /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/.exec(text);
    if (name) {
      const window = text.slice(name.index, name.index + 600);
      const strong = new Set([...window.matchAll(FORM_STRONG)].map((x) => x[0].toLowerCase().replace(/\s+/g, ' ')));
      const money = new Set([...window.matchAll(FORM_MONEY)].map((x) => x[0].toLowerCase().replace(/[\s:]+/g, ' ').trim()));
      // In prose a label counts only with a value after it ("passport PASSPORT-04", "date of birth 12
      // April"): a checklist that names document types ("the heading 'tax ID' can remain") is not a record.
      const valued = [...window.matchAll(FORM_STRONG)].filter((x) => /^\s*(?::|is|-)?\s*(?:[A-Z]{2,}[A-Z0-9]*[-\d]|\d|(?:USD|GBP|EUR|AUD|CAD|NZD|SGD)\b|[$£€])/.test(window.slice(x.index + x[0].length)));
      strong.clear(); for (const x of valued) strong.add(x[0].toLowerCase().replace(/\s+/g, ' '));
      const identity = valued.some((x) => /^(?:nric|ssn|social\s+security|national\s+insurance|passport|tax\s+(?:id|identifier|number)|date\s+of\s+birth|birth\s?date|dob|visa)/i.test(x[0]));
      // A named person with an identity document or number and something else sensitive ("Avery Hale, date
      // of birth ..., passport ..."), or an identity label beside a mortgage or account.
      if (identity && (strong.size >= 2 || (strong.size >= 1 && money.size >= 2))) at(name.index, name.index + name[0].length);
    }
  }
  return out;
}
