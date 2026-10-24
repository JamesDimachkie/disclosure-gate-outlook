// A greeting that names nobody on the To line ("Hi Alex," when the only recipient is Morgan Vale) is
// the clearest sign an email was addressed to the wrong person: autocomplete picked a neighbour, or a
// draft meant for one client went to another. It asks; it never holds. It stays quiet whenever it can't
// tell: a recipient without a recognisable first name (a role mailbox such as "Lettings" or
// fixtures@, a title and surname only), a group, a long To line, a greeting to several people or to
// nobody in particular ("Hi all", "Dear Leaseholders"), or a quoted greeting.
// Plain JavaScript only: this runs inside Outlook.

// The greeting word, an optional title, then one name closed by punctuation or the end of the line
// ("Hi Alex,", "Dear Mrs Patel", "Morning Sam!"). "Hi, I'll be round" names nobody.
const GREETING = /^\s*(?:hi|hello|hey|dear|hiya|morning|afternoon|evening|good\s+(?:morning|afternoon|evening))\b[\s,]+(?<title>(?:mr|mrs|ms|miss|mx|dr|prof)\.?\s+)?(?<name>[\p{L}][\p{L}’'-]{1,30})(?<close>\s*(?:[,!.:;–—-]|$))/iu;
const NOT_A_NAME = new Set(['all', 'team', 'everyone', 'everybody', 'folks', 'guys', 'there', 'both', 'sir', 'madam', 'sirs', 'colleagues',
  'friends', 'partners', 'again', 'you', 'ya', 'yall', 'mate', 'gents', 'ladies', 'committee', 'board', 'parents', 'families', 'members',
  'neighbours', 'neighbors', 'customer', 'customers', 'client', 'clients', 'friend', 'valued', 'support', 'accounts', 'sales', 'hr', 'it',
  'supplier', 'suppliers', 'leaseholders', 'residents', 'tenants', 'owners', 'homeowners', 'applicants', 'guests', 'volunteers', 'players',
  'coaches', 'staff', 'editors', 'organisers', 'organizers', 'students', 'teachers', 'governors', 'trustees', 'directors', 'shareholders',
  'investors', 'patients', 'carers', 'subscribers', 'readers', 'attendees', 'delegates', 'participants', 'contractors', 'landlord', 'tenant',
  'manager', 'managers', 'editor', 'organiser', 'organizer', 'reader', 'recruiter', 'colleague', 'neighbour', 'neighbor', 'resident']);
// Words that make a display name a role, a team or an organisation rather than a person.
const ROLE = /\b(?:info|admin|administrator|office|team|support|sales|accounts?|enquir(?:y|ies)|inquir(?:y|ies)|reception|bookings?|hello|contact|client|customer|service|services|help|helpdesk|desk|orders?|billing|invoices?|finance|hr|payroll|operations|ops|dispatch|noreply|no-reply|mail|post|general|projects?|purchasing|procurement|marketing|press|media|jobs|careers|department|dept|group|list|committee|council|school|clinic|surgery|practice|studio|shop|store|events?|manager|management|secretary|coordinator|co-ordinator|officer|director|assistant|lettings|letting|imports?|exports?|fixtures|facilities|reservations|warehouse|property|properties|awards|theatre|theater|hotel|club|centre|center|hall|trust|company|ltd|limited|inc|llc|plc|partners|associates|food|beverage|kitchen|estates?|tenders?|treasurer|chair|chairperson|president|editor|desk|helpline|bookkeeping|maintenance|repairs|lab|laboratory|unit|ward|branch|stores?|house|guesthouse|guest|farms?|bakery|garage|salon|cafe|restaurant|pub|inn|bar|gym|nursery|pharmacy|dental|vets?|veterinary|motors|cars|builders|plumbing|electrical|cleaning|consulting|solutions|systems|industries|holdings|supplies|trading|works)\b/i;
const TITLE = /^(?:mr|mrs|ms|miss|mx|dr|prof|sir|dame|rev|revd)\.?$/i;
const NICKNAMES = [
  ['robert', 'bob', 'rob', 'robbie', 'bobby'], ['william', 'bill', 'will', 'billy', 'liam'], ['elizabeth', 'liz', 'beth', 'betty', 'lizzie', 'eliza'],
  ['katherine', 'catherine', 'kathryn', 'kate', 'kat', 'katie', 'cathy', 'kathy'], ['michael', 'mike', 'mick', 'mikey'], ['james', 'jim', 'jimmy', 'jamie'],
  ['david', 'dave', 'davey'], ['thomas', 'tom', 'tommy'], ['christopher', 'chris', 'kit'], ['christine', 'christina', 'chris', 'tina'],
  ['alexander', 'alexandra', 'alex', 'sandy', 'xander', 'lexi'], ['samuel', 'samantha', 'sam', 'sammy'], ['nicholas', 'nick', 'nicky'],
  ['benjamin', 'ben', 'benny'], ['daniel', 'danielle', 'dan', 'danny', 'dani'], ['matthew', 'matt', 'matty'], ['anthony', 'antony', 'tony'],
  ['stephen', 'steven', 'steve'], ['jennifer', 'jen', 'jenny'], ['jessica', 'jess', 'jessie'], ['margaret', 'maggie', 'meg', 'peggy', 'marge'],
  ['susan', 'susanna', 'suzanne', 'sue', 'susie'], ['richard', 'rich', 'rick', 'ricky', 'dick'], ['andrew', 'andy', 'drew'], ['joseph', 'joe', 'joey'],
  ['patrick', 'patricia', 'pat', 'paddy', 'patty', 'trish'], ['edward', 'ed', 'eddie', 'ted', 'ned'], ['jonathan', 'jon', 'jonny', 'johnny', 'john'],
  ['nathan', 'nathaniel', 'nate'], ['charles', 'charlie', 'chuck'], ['charlotte', 'charlie', 'lottie'], ['abigail', 'abby', 'abbie'],
  ['rebecca', 'becky', 'becca'], ['victoria', 'vicky', 'tori'], ['deborah', 'debbie', 'deb'], ['gregory', 'greg'], ['jeffrey', 'geoffrey', 'jeff', 'geoff'],
  ['peter', 'pete'], ['frederick', 'fred', 'freddie'], ['timothy', 'tim'], ['kenneth', 'ken', 'kenny'], ['raymond', 'ray'], ['ronald', 'ron', 'ronnie'],
  ['donald', 'don', 'donnie'], ['gerald', 'gerry', 'jerry'], ['lawrence', 'laurence', 'larry', 'laurie'], ['philip', 'phillip', 'phil'],
  ['zachary', 'zach', 'zack'], ['harold', 'harry', 'hal'], ['henry', 'harry', 'hank'], ['josephine', 'jo', 'josie'], ['joanna', 'johanna', 'jo'],
  ['gabriel', 'gabrielle', 'gabe', 'gabby'], ['frances', 'francis', 'fran', 'frank', 'frankie'], ['theodore', 'theo', 'ted', 'teddy'],
  ['oliver', 'olivia', 'ollie', 'liv'], ['isabel', 'isabella', 'isabelle', 'izzy', 'bella'], ['colin', 'col'], ['nicola', 'nicky', 'nikki'],
  ['douglas', 'doug'], ['malcolm', 'mal'], ['terence', 'terry'], ['bernard', 'bernie'], ['siobhan', 'shiv'], ['eleanor', 'ellie', 'nell', 'nora']];
const ALIASES = new Map();
for (const group of NICKNAMES) for (const n of group) ALIASES.set(n, [...new Set([...(ALIASES.get(n) || []), ...group])]);
const fold = (s) => String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();

// A recipient's given name from its display name ("Alex Rowan", "Rowan, Alex", "Dr Priya Shah"), an
// initial ("Mr G Ferguson" gives "g"), or null when the display name doesn't name a person by first name
// (a role mailbox, a title and surname, an address shown as the name).
function givenName(r) {
  let name = String(r.name || '').replace(/\(.*?\)|<.*?>|".*?"/g, ' ').trim();
  const local = fold(String(r.address || '').split('@')[0]);
  if (ROLE.test(local)) return null;
  // Outlook shows an unknown outside address as its own name. An address shaped like a name
  // (morgan.vale@, morgan_vale@) still gives a first name; anything else (dragonfly77@) can't tell.
  if (!name || name.includes('@')) {
    const parts = /^([a-z]{2,20})[._-]([a-z]{2,30})$/.exec(local);
    // A one-word address is a first name only when it is a common one (dan@, not buying@ or rooms@).
    if (!parts && ALIASES.has(local)) return local;
    // "mreed.home@" is a surname and a suffix, not a first name and a surname.
    if (!parts || /^(?:home|work|personal|private|mail|email|uk|us|au|nz|ca|ie|office|jr|sr|online|net|family|biz|pro|me|official|main)$/.test(parts[2])) return null;
    return parts[1];
  }
  if (ROLE.test(name)) return null;
  // "Rowan, Alex" lists the family name first.
  if (/^[^,]+,\s*[^,]+$/.test(name)) name = name.split(',').reverse().join(' ');
  const words = name.split(/\s+/).filter((w) => !TITLE.test(w));
  // A title and one word ("Mrs Hooper") names a surname, not who is greeted by first name.
  const titled = name.split(/\s+/).some((w) => TITLE.test(w));
  if (words.length < 2 && (titled || !(words.length === 1 && fold(String(r.address).split('@')[0]).startsWith(fold(words[0])) && words[0].length >= 2))) return null;
  const first = words[0].replace(/\.$/, '');
  if (!/^\p{L}[\p{L}’'-]*$/u.test(first)) return null;
  return fold(first);
}
// Every word a recipient can be greeted by: display-name words (not titles) and address pieces.
function tokens(r) {
  const words = String(r.name || '').replace(/\(.*?\)|<.*?>|".*?"/g, ' ').split(/[\s,]+/).filter((w) => w && !TITLE.test(w)).map((w) => fold(w.replace(/\.$/, '')));
  const local = fold(String(r.address || '').split('@')[0]).split(/[^a-z]+/);
  return [...words, ...local].filter(Boolean);
}
function matches(greeted, r) {
  const g = fold(greeted), forms = ALIASES.get(g) || [g];
  return tokens(r).some((t) => t.length === 1 ? g.startsWith(t) :
    forms.some((f) => t === f || (f.length >= 3 && t.length >= 3 && (t.startsWith(f) || f.startsWith(t) || t.endsWith(f)))) || (ALIASES.get(t) || []).includes(g));
}

// `bodyText` is the body as checked (its first non-empty line is the greeting); `recipients` as
// classified ({field, name, address, reach}). Returns one recipient finding or null.
export function greetingFinding(bodyText, recipients) {
  const lines = String(bodyText || '').split('\n');
  const at = lines.findIndex((l) => l.trim());
  if (at < 0 || /^\s*>/.test(lines[at])) return null;
  const first = lines[at], m = GREETING.exec(first);
  if (!m) return null;
  const greeted = m.groups.name;
  // The greeting word matches in any case; a name starts with a capital and isn't a group or a role.
  if (!/^\p{Lu}/u.test(greeted) || NOT_A_NAME.has(fold(greeted))) return null;
  // "Hi Alex, Sam," or "Hi Alex & Sam": a greeting to several people is left alone.
  const tail = first.slice(m.index + m[0].length);
  if (/^\s*(?:and\b|&|\/)/i.test(tail) || /^\s*\p{Lu}[\p{L}'’-]+\s*(?:[,!&]|and\b|$)/u.test(tail)) return null;
  const to = (recipients || []).filter((r) => r.field === 'to');
  if (!to.length || to.length > 4 || to.some((r) => r.reach === 'unknown')) return null;
  const given = to.map(givenName);
  // Every To recipient must name a person by first name; otherwise the check can't tell.
  if (given.some((g) => !g)) return null;
  if (to.some((r) => matches(greeted, r))) return null;
  // "Dear Mrs Doyle" greets a surname, which a first-name-only address (margaret@) can't confirm or rule out.
  if (m.groups.title && to.some((r) => (!r.name || String(r.name).includes('@')) && ALIASES.has(fold(String(r.address).split('@')[0])))) return null;
  // The person greeted may be on Cc or Bcc (a reply that moved them): then it is not a wrong address.
  if ((recipients || []).some((r) => r.field !== 'to' && matches(greeted, r))) return null;
  const addresses = to.map((r) => r.address);
  const text = addresses.join(', ');
  return { category: 'recipient', subkind: 'greeting', source: 'recipient', severity: 'prompt', recipients: addresses, greeted,
    sentence: { text, index: -1, occurrence: 0, start: 0, end: text.length }, marks: [], found_by: 'recipients' };
}
