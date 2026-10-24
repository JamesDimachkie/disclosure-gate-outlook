// The local rule screen (spec §5): deterministic patterns for the five content findings, run on this
// computer before anything is sent to the hosted check. A hit holds the email at once and never
// reaches the hosted check (the prototype's order, and the meeting product's "detectors are a hard
// veto"). Each rule names the words to highlight with a `mark` group; the finding is the enclosing
// sentence. The rules are deliberately narrow (written business email, high precision) with the
// hosted check behind them for what they miss. The patterns are case-insensitive, so a rule that needs
// a name checks the original casing itself.
import { splitSentences, occurrences, labelValuePairs, tableRows } from './sentences.mjs';
import { indexed } from './regex.mjs';
import { detect, looksRandom, isPlaceholderPassword, DETECTORS, columnKind, columnLabel } from './detectors.mjs';

const rx = (source) => indexed(source, 'gi');
const AP = "['’]"; // straight or curly apostrophe
// A currency before the number ($, £, €, ¥, ₹, US$/A$/C$/NZ$/S$/HK$, or an ISO code) or after it (dollars,
// euros, quid, a code, € or £). "Pounds" is left out on purpose: "we carried 40 pounds" is often weight.
const CUR = String.raw`(?:[$£€¥₹]|(?:US|AU|A|CA|C|NZ|HK|S)\$|(?:USD|GBP|EUR|AUD|CAD|NZD|CHF|JPY|INR|SGD|HKD)\s?)`;
const AMOUNT = String.raw`(?:${CUR}\s?\d[\d,]*(?:\.\d+)?(?:\s*(?:k|m|mm|bn|thousand|million|grand)\b)?|\d[\d,]*(?:\.\d+)?\s*(?:(?:k|m|thousand|million|grand|dollars|bucks|quid|euros?|usd|gbp|eur|aud|cad|nzd|chf)\b|[€£])|\d[\d,]*(?:\.\d+)?\s*(?:%|percent\b|per\s?cent\b))`;
const HEDGE = String.raw`(?:about\s+|around\s+|roughly\s+|only\s+|just\s+|nearly\s+|almost\s+|under\s+|over\s+|below\s+|above\s+|close\s+to\s+|at\s+least\s+)?`;
const RATIO = String.raw`(?:double|triple|quadruple|twice|half|two\s+times|three\s+times|four\s+times|a\s+third\s+of|a\s+quarter\s+of|half\s+of)`;
const MARGIN = String.raw`(?:(?:gross|net|original|planned|expected|bid|budgeted|target|estimated)\s+)?(?:margins?|mark-?ups?|profits?)`;
const WE_DID = String.raw`(?:\s+(?:we|I)\s+(?:bid|quoted|priced|carried|planned|budgeted|expected|had|put\s+in|built\s+in)(?:\s+(?:on|for|into)\s+(?:it|this|that))?)`;
const COPULA = String.raw`(?:is|are|was|were|will\s+be|would\s+be|comes?\s+(?:to|in\s+at)|came\s+(?:to|in\s+at)|sits?\s+at|runs?|ran|of|at|stands?\s+at|totals?|totall?ed|works?\s+out\s+(?:to|at)|${AP}s)`;
const QUALITY = String.raw`(?:zero|nothing|negative|thin|razor[\s-]thin|tight|healthy|fat|slim|great|terrible|awful|underwater|in\s+the\s+red|in\s+the\s+black|gone|shot|wiped\s+out|(?:a\s+)?(?:third|quarter|half))`;
// Room that is about space or the schedule is not a negotiating position.
const NOT_SPACE = String.raw`(?!\s+(?:in|on)\s+(?:the\s+|our\s+)?(?:schedule|calendar|diary|programme|program|truck|van|trailer|yard|site|office|car|lot|building|room)\b|\s+for\s+(?:it|them|him|her|one|two|three|four|five|more|another|everyone|\d))`;
const ROOM = String.raw`(?:some\s+|a\s+little\s+|a\s+bit\s+of\s+|a\s+lot\s+of\s+|plenty\s+of\s+|lots\s+of\s+|real\s+|more\s+|enough\s+)?(?:room|wiggle\s+room|headroom|give|flex|flexibility|leeway|slack)\b${NOT_SPACE}`;
const WE_HAVE = String.raw`(?:we(?:${AP}ve|\s+have|\s+still\s+have|\s+do\s+have)?\s+(?:got\s+|still\s+got\s+)?|there(?:${AP}s|\s+is)\s+(?:still\s+)?)`;
const PUSH = String.raw`(?:push(?:es|ed|ing)?\s+(?:back|on|for|hard)|pushes|pushback|counter(?:s|ed)?(?!-)|haggles?|haggled|balks?|balked|asks?\s+for\s+(?:a\s+)?(?:discount|reduction|better\s+(?:price|number|deal)|less)|complains?\s+about\s+(?:the\s+)?(?:price|number|cost|rate|fee)|comes?\s+back\s+(?:on|at)\s+(?:the\s+)?(?:price|number))`;
const GIVE = String.raw`(?:we(?:${AP}ll|\s+will|\s+can|\s+could|${AP}d|\s+would)\s+(?:happily\s+|probably\s+|just\s+|still\s+)?(?:drop\s+(?:the\s+|our\s+)?(?:price|number|rate|fee|to\s+${CUR}?\d)|come\s+down|give\s+(?:a\s+little|some|ground|way|in)|throw\s+in|knock\s+(?:off|${CUR}?\d|some|a\s+bit)|cut\s+(?:the\s+|our\s+)?(?:price|number|rate|fee)|sharpen\s+(?:the\s+|our\s+)?(?:pencil|price|number)|split\s+the\s+difference|meet\s+(?:him|her|them)\s+(?:half\s*way|in\s+the\s+middle)|waive|eat\s+(?:it|the\s+(?:cost|difference|overage))|absorb|budge|go\s+(?:lower|down)|accept|settle)\b[^.?!;]{0,40}?)`;
// "The cameras on the east side are down": a short place phrase between a device and its state.
const WHERE = String.raw`(?:\s+(?:on|at|in|by|near|over|along|covering)\s+(?:the\s+)?[\w-]+(?:\s+[\w-]+){0,2}?)?`;
const PRICE_CUE = new RegExp(String.raw`\b(?:price|pricing|number|rate|fee|quote|bid|budget|co\s*#?\d+|change\s+order|contract|deal|discount|offer|counter|push(?:es|ed)?|negotiat\w*)\b|${CUR}\s?\d`, 'i');
const INSULT = String.raw`(?:moron|morons|idiot|idiots|imbecile|imbeciles|clown|clowns|fool|fools|halfwit|halfwits|dimwit|dimwits|nitwit|nitwits|numpty|numpties|muppet|muppets|cretin|cretins|dunce|dunces|buffoon|buffoons|loser|losers|jerk|jerks|asshole|assholes|arsehole|arseholes|dickhead|dickheads|prick|pricks|tosser|tossers|wanker|wankers|bastard|bastards|crook|crooks|liar|liars|cowboy|cowboys|hacks|amateurs|scammer|scammers|con\s+artists?|weasel|weasels)`;
const INSULT_ADJ = String.raw`(?:useless|incompetent|clueless|hopeless|lazy|stupid|dumb|dishonest|crooked|shady|brain[\s-]?dead|pathetic|worthless|a\s+nightmare(?:\s+to\s+work\s+with)?|a\s+liability|a\s+waste\s+of\s+space|a\s+disgrace|a\s+clown\s+show)`;
const ROLE = String.raw`(?:their|the|his|her|your)\s+(?:pm|project\s+manager|super|superintendent|architect|engineer|owner|client|guy|guys|team|crew|people|office|accounts\s+team|estimator|foreman|inspector|sub|subs|subcontractors?|lawyers?|company|firm|designer|consultant|bookkeeper|admin|account\s+manager|account\s+rep|rep|cfo|ceo|coo|cto|director|manager|counsel|attorney|agent|broker|landlord|tenant|recruiter|developer|developers|accountant|auditor|vendor|supplier|agency|paralegal|doctor|surgeon|nurse|receptionist)`;
// Words that can follow "password is" or "Password:" without being the password: states, articles,
// pointers elsewhere, sign-offs. A plain word not on this list that closes the statement is a password.
const NOT_A_SECRET = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'not', 'no', 'yes', 'being', 'also', 'too', 'very', 'only', 'your', 'my', 'our', 'their',
  'his', 'her', 'its', 'these', 'those', 'which', 'who', 'how', 'it', 'one', 'see', 'ask', 'call', 'check', 'please', 'unavailable', 'tbd', 'tbc', 'n/a', 'na', 'none',
  'nil', 'pending', 'optional', 'mandatory', 'needed', 'incorrect', 'insecure', 'unsafe', 'complex', 'temporary', 'permanent', 'new', 'old', 'good', 'bad', 'set',
  'unset', 'saved', 'stored', 'blank', 'empty', 'lost', 'forgotten', 'updated', 'locked', 'unlocked', 'inactive', 'case-sensitive', 'sensitive', 'confidential',
  'personal', 'shared', 'unique', 'hidden', 'encrypted', 'protected', 'following', 'follows', 'as', 'like', 'whatever', 'something', 'nothing', 'anything', 'standard',
  'usual', 'default', 'thanks', 'thank', 'regards', 'cheers', 'best', 'hi', 'hello', 'dear', 'sincerely', 'asap', 'soon', 'later', 'tomorrow', 'today', 'separately',
  'provided', 'included', 'enclosed', 'written', 'known', 'given', 'shown', 'unchanged', 'expiring', 'yours', 'mine', 'ours', 'theirs', 'n-a', 'tba', 'wrong', 'right',
  'correct', 'same', 'different', 'fine', 'okay', 'ok', 'still', 'reset', 'invalid', 'valid', 'secure', 'unknown', 'missing', 'weak', 'strong', 'long', 'short',
  'simple', 'private', 'secret', 'safe', 'easy', 'hard', 'that', 'this', 'what', 'where', 'there', 'here', 'gone', 'done', 'open', 'expired', 'required', 'ready',
  'available', 'active', 'enabled', 'disabled', 'attached', 'below', 'above', 'changing', 'changed', 'coming', 'sent',
  'withheld', 'held', 'chosen', 'broken', 'stolen', 'taken',
  // Statuses and pointers written after a label ("Password: requested", "PW: sent separately",
  // "Password: will send by text"). After a label this list is the only way not to stop.
  'requested', 'request', 'requesting', 'generated', 'auto-generated', 'autogenerated', 'emailed', 'texted', 'messaged', 'shared', 'issued',
  'assigned', 'configured', 'rotated', 'revoked', 'supplied', 'pasted', 'follow', 'to-follow', 'forthcoming', 'awaiting', 'await', 'will', 'i', 'we',
  'you', 'via', 'by', 'from', 'with', 'under', 'per', 'refer', 'use', 'contact', 'sms', 'text', 'phone', 'email', 'send', 'sending', 'resend',
  'resent', 'unchanged', 'same', 'nope', 'expire', 'expires', 'expiring', 'expired', 'reset', 'resetting', 'changed', 'change', 'update', 'updating',
  'is', 'was', 'has', 'have', 'had', 'should', 'must', 'can', 'cannot', "can't", 'needs', 'need', 'under', 'tbd', 'tbc', 'tba',
  // Column headers that sit next to "Password" in a table row ("Password    Last changed    Owner").
  'last', 'owner', 'status', 'expiry', 'date', 'notes', 'note', 'username', 'user', 'login', 'account', 'name', 'type', 'description', 'value',
  'field', 'hint', 'policy', 'length', 'strength', 'age', 'history', 'manager', 'vault', 'rules', 'requirements', 'created', 'modified']);
// A password the sentence itself presents as an example.
const EXAMPLE_BEFORE = /\b(?:example|sample|dummy|fake|e\.g\.?|for\s+instance)[,:]?\s*(?:of\s+an?\s+)?(?:strong\s+|good\s+|valid\s+)?$/i;
// Where a typed code opens something, and codes that are not access at all.
const ENTRY_DEVICE = /\b(?:keypad|key\s?pad|lockbox|lock\s?box|key\s?safe|key\s?box|alarm|buzzer|intercom|padlock|combination\s+lock)\b/i;
const ENTRY_PLACE = /\b(?:door|gate|garage|entry|entrance|lobby|building|elevator|lift|unit|suite|house|front|back|side)\b/i;
const NOT_ENTRY = /\b(?:promo|discount|coupon|voucher|referral|checkout|gift\s+card|tracking|order|invoice|extension|ext\.?|dial-?in|meeting|conference|webinar|zoom|teams)\b/i;
// Words a capital at the start of a sentence makes look like a name.
const NOT_NAMES = new Set(['it', 'this', 'that', 'there', 'we', 'you', 'i', 'the', 'a', 'an', 'our', 'your', 'which', 'what', 'who', 'everything', 'nothing', 'something', 'anything', 'everyone', 'someone', 'one', 'each', 'every', 'all', 'both', 'some', 'any', 'here', 'then', 'now', 'today', 'tomorrow', 'yesterday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'weekdays', 'weekends', 'weekend', 'mondays', 'tuesdays', 'wednesdays', 'thursdays', 'fridays', 'saturdays', 'sundays', 'mornings', 'afternoons', 'evenings', 'nights', 'deadlines', 'deliveries', 'roads', 'traffic', 'parking', 'please', 'thanks', 'also', 'and', 'but', 'so']);
const PRONOUNS = new Set(['he', 'she', 'they']);
// A name: every word capitalized in the original text, the first not a pronoun or determiner.
const isName = (s) => { const words = String(s || '').trim().split(/\s+/); return words.length > 0 && words.every((w) => /^[A-Z][\p{L}'’-]*$/u.test(w)) && !NOT_NAMES.has(words[0].toLowerCase()); };
// A company is not a person: "Northline Ltd has a court case" is the company's own legal business.
const COMPANY = /\b(?:ltd|inc|llc|llp|lp|plc|gmbh|pty|corp|co|group|holdings|limited|incorporated|corporation)\b/i;
const personName = (s) => isName(s) && !COMPANY.test(s);
const personOrName = (group) => (m) => { const s = m.groups?.[group]; return !s || PRONOUNS.has(s.toLowerCase()) || personName(s.replace(/['’]s$/, '')); };
// Who a health status is about: a pronoun, a name, or a person after a determiner or a name's possessive
// ("the patient", "his wife", "Priya's husband"), with at least one verb before the status. A thing
// ("The timber is being treated for rot"), a group ("Half the crew is out sick") or a company is not a
// person. The second word of a name is never one of those verbs ("Tom is in hospital").
const PERSON_NOUN = String.raw`(?:patient|client|resident|employee|worker|colleague|co-?worker|tenant|member|guest|customer|candidate|applicant|student|wife|husband|partner|son|daughter|kid|child|baby|mum|mom|dad|father|mother|brother|sister|grandmother|grandfather|grandma|grandpa|aunt|uncle|cousin|nephew|niece|friend|neighbou?r|boss|manager|supervisor|foreman|super|superintendent|assistant|driver|operator|engineer|architect|estimator|electrician|plumber|carpenter|pm|owner|landlord|lawyer|accountant|nurse|doctor)`;
const AUX_WORD = String.raw`(?:is|was|are|were|has|have|had|got|been|being|went|going|gone|headed|will|be|now|still|currently|also|recently|just|back|getting|taken|rushed|admitted|sent)`;
const DETERMINER = String.raw`(?:the|our|your|my|his|her|their|a|an)`;
const STATUS_SUBJECT = String.raw`(?<subj>he|she|they|i|you|${DETERMINER}\s+${PERSON_NOUN}|[a-z]+${AP}s\s+${PERSON_NOUN}|[a-z]+(?:\s+(?!${AUX_WORD}\b)[a-z]+)?)(?:${AP}(?:s|re|m|ve|d)|\s+${AUX_WORD}){1,4}\s+`;
const PERSON_AFTER_DETERMINER = new RegExp(String.raw`^${DETERMINER}\s+${PERSON_NOUN}$`, 'i');
const statusPerson = (m) => {
  const s = m.groups.subj;
  if (/^(?:he|she|they|i|you)$/i.test(s) || PERSON_AFTER_DETERMINER.test(s)) return true;
  const owner = /^(\S+?)['’]s\s/.exec(s);
  return personName(owner ? owner[1] : s);
};

// Whether "password ... <value>" gives a password. The statement decides, not how strong the value is:
// "Password: sunshine" and "The password is admin." give one; a mask, a template, a link, a pointer
// ("the same as before", "in the vault", "see below") or a state ("reset", "requested") does not. A
// PIN is 4 to 8 digits, repeated digits included (1111 is a real PIN when it is given as one; masks
// are not digits). Any other value needs 3 characters.
// A digit, a symbol, mixed case or quotes are evidence of a typed value, and such a value is given
// wherever it stands. Hyphens, slashes, apostrophes and full stops are not: they join words
// ("auto-generated", "n/a"), so a value of letters and those is language, given only when it reads as
// a name rather than as talk about the password. It must close the statement ("Password: see the
// vault entry" is talk); its first and last words must not be a state, a pointer or a sign-off
// (NOT_A_SECRET, a short closed list); and its last word must not have the form of a description: a
// participle, adjective or adverb ending (-ed, -ing, -able, -ive, -ly ...) on a stem of two letters or
// more, the open class no stop list finishes ("Requested", "auto-generated", "Configurable"). A short
// word after "is" or "was" is a description too ("is new", "is out"), so there a word needs 4 letters;
// after an explicit "Password:", "=" or "set to" it does not ("Password: zoo"). The cost is dictionary
// words of those shapes given after a colon ("Password: elephant"), which clear: where a rule is
// unsure, it does not stop (spec §5).
const PROSE_WORD = /^[a-z\u00c0-\u024f]{2,}(?:ed|ing|ly|ive|able|ible|ous|ful|less|ary|ent|ant|ial|ical|ic|ize|ise)$/i;
const JOINERS = /[-–/'’.]+/;
// Metasyntactic stand-ins and example words, as the value or a part of it ("example-secret").
const EXAMPLE_PART = /^(?:example|sample|dummy|fake|placeholder|redacted|foo|bar|baz|qux|foobar|abc|xyz)$/i;
const EXPLICIT = /^\s*(?:[:=-]|(?:set|changed|reset|updated)\b|.*\bto\b)/i;
const CLOSES = /^["'”’]?\s*(?:$|[.;!?)]|(?:and|but|or)\b|[-–—]\s)/i;
function passwordGiven(m, sentence) {
  const g = m.groups, raw = g.secret, s = raw.replace(/[.,;:]+$/, '');
  if (EXAMPLE_BEFORE.test(sentence.slice(Math.max(0, m.index - 30), m.index))) return false;
  if (/^pin/i.test(g.kw)) return /^\d{4,8}$/.test(s);
  // "admin" stands in for a user in a connection-string example, but a sentence that gives it as the
  // password gives a real (default) password.
  if (s.length < 3 || (isPlaceholderPassword(s) && !/^(?:admin|root)$/i.test(s))) return false;
  const word = s.replace(/[!?]+$/, '').replace(/^[(\[<{]+/, '');
  if (NOT_A_SECRET.has(word.toLowerCase())) return false;
  const rest = sentence.slice(m.index + m[0].length);
  if (/^\s*(?:characters?|chars|digits|letters|symbols|long)\b/i.test(rest)) return false; // "8-12 characters"
  const parts = word.split(JOINERS).filter(Boolean);
  if (!parts.length || parts.some((p) => EXAMPLE_PART.test(p))) return false;
  // After an explicit label ("Password:", "PW =", "set to") the value is the password unless it opens
  // with a status or pointer on the closed list above: any other word stops, plain or not
  // ("Password: elephant", "Password: sunshine, user bob"). Decided 23 October 2026.
  if (EXPLICIT.test(g.sep)) return !NOT_A_SECRET.has(parts[0].toLowerCase());
  if (!parts.every((p) => /^[A-Za-z\u00c0-\u024f]+$/.test(p))) return true;
  if (parts.some((p) => /[a-z][A-Z]/.test(p)) || /["'“‘]/.test(sentence[m.indices.groups.secret[0] - 1] || '')) return true;
  const last = parts[parts.length - 1];
  if (NOT_A_SECRET.has(parts[0].toLowerCase()) || NOT_A_SECRET.has(last.toLowerCase()) || PROSE_WORD.test(last)) return false;
  if (!EXPLICIT.test(g.sep) && parts.join('').length < 4) return false;
  return /[.;!?]$/.test(raw) || CLOSES.test(rest);
}
// Offers carry no condition about the other side; a limit or fallback does ("if they push", "at a
// push", "worst case", "the minimum").
const FALLBACK = /\b(?:if|unless|when|once|should)\b[^.?!;]{0,60}?\b(?:they|he|she|the\s+(?:client|owner|buyer|seller|customer|gc|developer|landlord|tenant|other\s+side)|push\w*|counter\w*|insist\w*|haggl\w*|balk\w*|refus\w*|reject\w*|walk\w*|(?:we\s+)?(?:have|need)\s+to)\b|\b(?:at\s+a\s+push|if\s+(?:needed|necessary|pressed|we\s+must)|as\s+a\s+(?:fallback|last\s+resort)|worst\s+case|at\s+worst|bottom\s+line|at\s+(?:the\s+)?(?:very\s+)?(?:least|most|minimum)|minimum|walk[\s-]?away)\b/i;
// A subject or possessive that names a person (he, her, Priya's, Tom Reyes), checked on every such group a
// personal rule captures: "Our company has a court case" is the company's own legal business (§5.4).
const PERSON_SUBJECTS = ['subj', 'subj2', 'subj3'], PERSON_OWNERS = ['who', 'who2', 'who3'];
const personal = (m) => PERSON_SUBJECTS.every((g) => personOrName(g)(m)) &&
  PERSON_OWNERS.every((g) => { const w = m.groups?.[g]; return !w || /^(?:his|her|their)$/i.test(w) || personName(w.replace(/['’]s$/, '')) || /^(?:client|owner|super|foreman)['’]s$/i.test(w); });

// Rules in order of specificity within each category; the first hit names the subkind. The value
// detectors (detectors.mjs) run before these, so a token or a card number names its own subkind.
export const RULES = Object.freeze([
  // Internal economics: margin, markup, profit, costs, contingency, budget, floor or walk-away price.
  { id: 'econ.ratio-margin', category: 'economics', subkind: 'margin', re: rx(String.raw`\b(?<mark>${RATIO}\s+(?:the\s+|our\s+|what\s+)?${MARGIN}${WE_DID}?)\b`) },
  { id: 'econ.our-margin', category: 'economics', subkind: 'margin', re: rx(String.raw`\b(?<mark>(?:our|my|the\s+company${AP}s|internal)\s+(?:gross\s+|net\s+|actual\s+|real\s+|true\s+|overall\s+|average\s+|blended\s+)?(?:margins?|mark-?ups?|profits?|profitability)(?:\s+(?:on|for)\s+(?:(?:this|that|the|it|our)(?:\s+[\w-]+){0,3}?|[\w-]+(?:\s+[\w-]+){0,2}?))?\s+${COPULA}\s+${HEDGE}(?:${AMOUNT}|${QUALITY}))`) },
  { id: 'econ.amount-margin', category: 'economics', subkind: 'margin', re: rx(String.raw`(?<mark>(?:\b\d[\d,]*(?:\.\d+)?\s*(?:%|percent\b|per\s?cent\b)|${CUR}\s?\d[\d,]*(?:\.\d+)?\s*(?:k|m)?\b)\s*(?:gross\s+|net\s+)?(?:margin|mark-?up|profit)s?)\b(?!\s+(?:of\s+error|for\s+error|of\s+safety|call))`) },
  { id: 'econ.we-clear', category: 'economics', subkind: 'profit', re: rx(String.raw`\b(?<mark>we(?:${AP}ll|\s+will|${AP}re|\s+are|\s+would|${AP}d|\s+should|\s+stand\s+to)?\s+(?:make|making|made|clear|clearing|cleared|net|netting|netted|pocket|pocketing|pocketed)\s+${HEDGE}${AMOUNT}(?:\s+(?:on|from|off)\s+(?:this|that|it|the\s+[\w-]+))?)`) },
  { id: 'econ.profitable', category: 'economics', subkind: 'profit', re: rx(String.raw`\b(?<mark>(?:this|that|the)\s+(?:job|project|contract|deal|order|work)\s+(?:is|was|${AP}s)\s+(?:very\s+|really\s+|super\s+|quite\s+|hugely\s+|so\s+)?(?:profitable|lucrative|a\s+money[\s-]?maker|a\s+gold\s*mine|a\s+cash\s+cow|losing\s+(?:us\s+)?money|underwater)|we${AP}re\s+(?:losing|making)\s+(?:a\s+lot\s+of\s+|good\s+|serious\s+)?money\s+on\s+(?:this|that|it|the\s+[\w-]+))`) },
  { id: 'econ.our-cost', category: 'economics', subkind: 'cost', re: rx(String.raw`\b(?<mark>(?:our|my|internal|the\s+real|the\s+actual|the\s+true)\s+(?:internal\s+|actual\s+|real\s+|true\s+|total\s+|unit\s+|labou?r\s+|material\s+|delivery\s+|direct\s+|all-in\s+|landed\s+)?costs?(?:\s+(?:on|for)\s+(?:this|that|the|it)(?:\s+[\w-]+){0,3}?)?\s+${COPULA}\s+${HEDGE}(?:${AMOUNT}|${QUALITY}))`) },
  { id: 'econ.costs-us', category: 'economics', subkind: 'cost', re: rx(String.raw`\b(?<mark>(?:costs?|costing|cost)\s+us\s+${HEDGE}${AMOUNT})`) },
  { id: 'econ.we-paid', category: 'economics', subkind: 'cost', re: rx(String.raw`\b(?<mark>we(?:${AP}re|\s+are)?\s+(?:paid|pay|paying)\s+(?:the\s+(?:sub|subcontractor|crew|supplier|vendor|fabricator|installer)s?|him|her|them)\s+${HEDGE}${AMOUNT})`) },
  { id: 'econ.cost-buildup', category: 'economics', subkind: 'cost', re: rx(String.raw`\b(?<mark>(?:our|internal)\s+cost\s+(?:build[\s-]?up|breakdown|basis|stack|plus))\b`) },
  { id: 'econ.contingency', category: 'economics', subkind: 'contingency', re: rx(String.raw`\b(?<mark>(?:our|the)\s+contingency\s+(?:is|was|of|at|left|remaining|sits\s+at|${AP}s)\s+${HEDGE}(?:${AMOUNT}|${QUALITY})|${AMOUNT}\s+(?:of\s+|in\s+)?contingency|we\s+(?:carried|carry|built\s+in|put\s+in|kept|have|had|still\s+have)\s+${HEDGE}${AMOUNT}\s+(?:of\s+|in\s+)?contingency|(?:burned|burnt|used|blown|spent)\s+(?:through\s+)?(?:half\s+of\s+|all\s+of\s+|most\s+of\s+|some\s+of\s+)?(?:our|the)\s+contingency)`) },
  { id: 'econ.carried', category: 'economics', subkind: 'budget', re: rx(String.raw`\b(?<mark>we\s+(?:only\s+)?(?:carried|carry|budgeted|allowed|allocated|priced\s+in|built\s+in)\s+${HEDGE}${AMOUNT}(?:\s+(?:for|in|on)\s+(?:the\s+|this\s+|that\s+)?[\w-]+(?:\s+[\w-]+)?)?)`) },
  { id: 'econ.our-budget', category: 'economics', subkind: 'budget', re: rx(String.raw`\b(?<mark>(?:our|my|the\s+internal)\s+budget\s+(?:(?:for|on)\s+(?:this|that|the|it)(?:\s+[\w-]+){0,3}?\s+)?(?:is|was|${AP}s|of|sits\s+at|tops\s+out\s+at)\s+${HEDGE}${AMOUNT})`) },
  { id: 'econ.floor', category: 'economics', subkind: 'floor', re: rx(String.raw`\b(?<mark>(?:our|my|the)\s+(?:price\s+)?floor(?:\s+(?:on|for)\s+(?:the\s+|this\s+|that\s+)?(?:fee|price|rate|deal|bid|quote|contract|retainer|offer|job|project|listing|renewal|licen[cs]e))?\s+(?:is|was|would\s+be|sits\s+at|of|${AP}s)\s+${HEDGE}${AMOUNT}|walk[\s-]?away\s+(?:price|number|point|figure)(?:\s+(?:is|was|of|at|${AP}s)\s+${HEDGE}${AMOUNT})?|we\s+(?:won${AP}t|will\s+not|can${AP}t|cannot|wouldn${AP}t|would\s+not)\s+go\s+(?:below|under|lower\s+than)\s+${AMOUNT})`) },

  // Negotiation position: room to move, what we would accept, what they will counter with, strategy.
  { id: 'nego.if-push', category: 'negotiation', subkind: 'position', re: rx(String.raw`\b(?<mark>(?:if|when|should|once)\s+[^.?!;]{1,60}?\b${PUSH}\b[^.?!;]{0,60}?,?\s*(?:then\s+)?(?:${WE_HAVE}${ROOM}|${GIVE}))`) },
  { id: 'nego.room-on', category: 'negotiation', subkind: 'position', re: rx(String.raw`\b(?<mark>${WE_HAVE}${ROOM}\s+(?:to\s+(?:move|negotiate|come\s+down|drop|give|play\s+with|go\s+lower)|on\s+(?:the\s+|our\s+)?(?:price|pricing|number|rate|fee|figure|quote|bid|budget|co\s*#?\d+|change\s+order(?:\s+#?\d+)?|contract|deal|retainer|commission|rent|deposit|discount|payment\s+terms|licen[cs]e\s+fee|subscription|renewal)|in\s+(?:the\s+|our\s+)?(?:price|number|budget|bid|quote|contract)))`) },
  { id: 'nego.room-price', category: 'negotiation', subkind: 'position', re: rx(String.raw`\b(?<mark>${WE_HAVE}${ROOM})`), check: (m, sentence) => PRICE_CUE.test(sentence) },
  // How far the sender would go: limit wording ("go as low as", "settle for") in any mood; "accept" or
  // "take" when it is hypothetical ("we'd accept"), or tied to a fallback or the other side pushing. "We
  // can accept $4,000 for this order" is an offer actually made (§5.6) and stays clear.
  { id: 'nego.accept', category: 'negotiation', subkind: 'position', re: rx(String.raw`\b(?<mark>we(?:${AP}d|\s+would|\s+could|\s+can|${AP}ll|\s+will)\s+(?:happily\s+|still\s+|probably\s+|even\s+|be\s+(?:happy|willing)\s+to\s+)?(?:settle\s+for|live\s+with|go\s+(?:down\s+)?to|come\s+down\s+to|drop\s+to|go\s+as\s+low\s+as)\s+${HEDGE}${AMOUNT})`) },
  { id: 'nego.would-accept', category: 'negotiation', subkind: 'position', re: rx(String.raw`\b(?<mark>we(?:${AP}d|\s+would|\s+could)\s+(?:happily\s+|still\s+|probably\s+|even\s+|be\s+(?:happy|willing)\s+to\s+)?(?:accept|take|agree\s+to)\s+${HEDGE}${AMOUNT})`) },
  { id: 'nego.accept-if', category: 'negotiation', subkind: 'position', re: rx(String.raw`\b(?<mark>we(?:\s+can|${AP}ll|\s+will)\s+(?:happily\s+|still\s+|probably\s+|even\s+|be\s+(?:happy|willing)\s+to\s+)?(?:accept|take|agree\s+to)\s+${HEDGE}${AMOUNT})`), check: (m, sentence) => FALLBACK.test(sentence) },
  { id: 'nego.most-least', category: 'negotiation', subkind: 'position', re: rx(String.raw`\b(?<mark>(?:the\s+)?(?:most|least|lowest|highest|minimum|maximum|max)\s+we(?:${AP}d|\s+would|\s+could|\s+can|${AP}ll|\s+will)\s+(?:accept|take|pay|go|settle\s+for)\b(?:\s+(?:is|was)\s+${HEDGE}${AMOUNT})?)`) },
  { id: 'nego.counter', category: 'negotiation', subkind: 'position', re: rx(String.raw`\b(?<mark>(?<subj>they|he|she|we|the\s+(?:client|owner|gc|developer|buyer|customer)|[a-z]+)(?:${AP}ll|\s+will|\s+would|${AP}d|\s+are\s+going\s+to|${AP}re\s+going\s+to|\s+is\s+going\s+to|${AP}s\s+going\s+to)\s+(?:probably\s+|likely\s+|definitely\s+|surely\s+|almost\s+certainly\s+)?counter\b(?!-)(?:\s+(?:with|at|around)\s+[^.?!;]{1,40})?|(?:their|his|her)\s+counter(?:\s*-?\s*offer)?\s+(?:will|would|is\s+going\s+to)\s+be\b[^.?!;]{0,40}|expect\s+(?:them|him|her|[a-z]+)\s+to\s+counter\b(?!-)[^.?!;]{0,40})`), check: (m) => { const s = m.groups?.subj; return !s || /^(?:they|he|she|we|the\s)/i.test(s) || isName(s); } },
  { id: 'nego.strategy', category: 'negotiation', subkind: 'position', re: rx(String.raw`\b(?<mark>(?:our|the)\s+(?:bid|bidding|pricing|negotiating|negotiation)\s+strategy\b|we(?:${AP}re|\s+are)\s+(?:going\s+to\s+|gonna\s+)?(?:low-?ball(?:ing)?|bid(?:ding)?\s+(?:it\s+)?(?:low|high|tight|aggressive(?:ly)?))\b|leave\s+(?:ourselves\s+)?(?:some\s+)?room\s+to\s+(?:come\s+down|negotiate|move)\b|(?:pad|padded|padding)\s+(?:the\s+|our\s+)?(?:bid|price|number|quote|estimate)\b)`) },

  // Personal detail: health, rehab, family, legal or HR matters about a person. Government numbers are
  // the identity detectors in detectors.mjs.
  { id: 'personal.health', category: 'personal', subkind: 'health', re: rx(String.raw`\b(?<mark>(?<who>his|her|their|[a-z]+${AP}s)\s+(?<mod>(?:back|knee|hip|shoulder|heart|eye|foot|hand|wrist|neck|spine|spinal|brain|hernia|gallbladder|cancer|dental|emergency|major|minor|physical)\s+)?(?<noun>surgery|surgeries|operation|chemo(?:therapy)?|rehab|rehabilitation|diagnosis|illness|injury|injuries|cancer|tumou?r|stroke|heart\s+attack|pregnancy|miscarriage|medication|meds|prescription|disability|diabetes|depression|anxiety|burnout|sick\s+leave|medical\s+leave|therapy))\b(?!\s+(?:of|on|for|to)\s+(?:the|a|an|this|that|our|their|its)\b)`), check: (m) => { const g = m.groups; if (!/^(?:his|her|their)$/i.test(g.who) && !personName(g.who.replace(/['’]s$/, ''))) return false; if (/^operation$/i.test(g.noun) && !g.mod) return false; if (/^therapy$/i.test(g.noun) && !/physical/i.test(g.mod || '')) return false; return true; } },
  { id: 'personal.status', category: 'personal', subkind: 'health', hint: /hospital|rehab|\bicu\b|intensive|a&e|\ber\b|emergency|detox|diagnosed|treated|recovering|undergoing|sick|leave/i, re: rx(String.raw`\b${STATUS_SUBJECT}(?<mark>(?:back\s+)?(?:in|into|out\s+of|to)\s+(?:the\s+)?(?:hospital|rehab|icu|intensive\s+care|a&e|er|emergency\s+room|detox)\b|(?:diagnosed\s+with|being\s+treated\s+for|treated\s+for|recovering\s+from|undergoing)\s+[^.?!,;]{2,40}|(?:off|out)\s+sick\b|on\s+(?:sick|medical|stress|maternity|paternity|disability|compassionate|bereavement)\s+leave\b)`), check: statusPerson },
  { id: 'personal.family', category: 'personal', subkind: 'family', re: rx(String.raw`\b(?<mark>(?<who>his|her|their|[a-z]+${AP}s)\s+(?:wife|husband|partner|son|daughter|kid|kids|child|children|mum|mom|dad|father|mother|brother|sister|family|parents?)(?:${AP}s)?\s+(?:is\s+(?:in\s+(?:the\s+)?hospital|sick|ill|pregnant|dying)|funeral|surgery|illness|cancer|death|passing|diagnosis|divorce|custody)|going\s+through\s+(?:a\s+)?divorce|(?<who2>his|her|their|[a-z]+${AP}s)\s+(?:(?:\w+${AP}s\s+)?funeral|divorce|custody\s+(?:case|hearing|arrangement|battle|fight|dispute)|family\s+(?:emergency|matter)|bereavement|(?:compassionate|bereavement)\s+leave)|(?<subj>he|she|they|[a-z]+)(?:\s+(?:has|had|got|suffered|needs|needed|requested|took)|${AP}s\s+(?:got|had|having|taking)|${AP}s|\s+(?:is|was)\s+(?:having|dealing\s+with|taking|on))\s+(?:a\s+|an\s+|some\s+)?(?:family\s+(?:emergency|matter)|bereavement(?:\s+leave)?|compassionate\s+leave|custody\s+(?:battle|hearing|fight|dispute))|(?:a\s+)?(?:death|bereavement|loss)\s+in\s+(?<who3>his|her|their|[a-z]+${AP}s)\s+family)\b`), check: personal },
  { id: 'personal.legal', category: 'personal', subkind: 'legal', re: rx(String.raw`\b(?<mark>(?<subj>he|she|they|[a-z]+(?:\s+[a-z]+)?)\s+(?:was|got|has\s+been|have\s+been|is\s+being|is|${AP}s\s+been)\s+(?:arrested|charged\s+with|sued|convicted|indicted|investigated\s+for|prosecuted|jailed|locked\s+up|cited\s+for\s+dui)|(?<who>his|her|their|[a-z]+${AP}s)\s+(?:dui|dwi|criminal\s+record|probation\s+officer|parole\s+officer)|(?<subj2>he|she|they|[a-z]+(?:\s+[a-z]+)?)\s+(?:has|have|had|got|${AP}s\s+got|${AP}s\s+had|received|is\s+facing|faces|was\s+charged\s+with)\s+(?:a\s+|an\s+|another\s+)?(?:dui|dwi|criminal\s+record|restraining\s+order|court\s+(?:date|case|hearing|appearance))|(?<subj3>he|she|they|[a-z]+(?:\s+[a-z]+)?)\s+(?:is|was|${AP}s|has\s+been|will\s+be)\s+(?:still\s+|currently\s+)?on\s+(?:probation\b(?!\s+period)|parole)|restraining\s+order\s+against\s+(?:him|her)|(?:his|her|their)\s+(?:court\s+(?:date|case|hearing)|lawyer|attorney|lawsuit|legal\s+(?:trouble|issues|case|problems)))\b`), check: personal },
  { id: 'personal.hr', category: 'personal', subkind: 'hr', re: rx(String.raw`\b(?<mark>(?<subj>he|she|they|[a-z]+(?:\s+[a-z]+)?)\s+(?:was|got|has\s+been|have\s+been|is\s+being|is\s+getting|will\s+be|${AP}s\s+being|${AP}s\s+getting|${AP}re\s+being)\s+(?:fired|let\s+go|terminated|laid\s+off|written\s+up|disciplined|suspended|demoted|sacked|put\s+on\s+(?:a\s+)?(?:pip|performance\s+(?:plan|improvement\s+plan)|probation|notice|a\s+final\s+warning))|(?<who>his|her|their|[a-z]+${AP}s)\s+(?:salary|pay\s+rate|hourly\s+rate|wage|wages|raise|bonus|performance\s+review|disciplinary|final\s+warning|pip|grievance|hr\s+complaint))\b`), check: (m) => personOrName('subj')(m) && (!m.groups.who || /^(?:his|her|their)$/i.test(m.groups.who) || personName(m.groups.who.replace(/['’]s$/, ''))) },

  // Access and security: codes, passwords, alarm or camera status.
  { id: 'access.code', category: 'access', subkind: 'code', re: rx(String.raw`\b(?<mark>(?<kind>gate|door|front\s+door|back\s+door|side\s+door|alarm|lockbox|lock\s+box|key\s?box|key\s?safe|keypad|entry|access|garage|padlock|security|safe|wi-?fi)\s+code(?:${AP}s|\s+is|\s+was|\s+=|:|\s+-)?\s*(?:still\s+|now\s+|currently\s+|just\s+)?(?:set\s+to\s+|changed\s+to\s+)?#?\s*(?:\d{3,8}|(?=[a-z]*\d)[a-z0-9]{4,10})\b)`) },
  { id: 'access.code-for', category: 'access', subkind: 'code', re: rx(String.raw`\b(?<mark>(?:the\s+)?code\s+(?:for|to|on)\s+(?:the\s+)?(?<kind>gate|door|side\s+door|front\s+door|back\s+door|lockbox|lock\s+box|alarm|garage|padlock|keypad|safe|trailer|office)\s+(?:is|was|${AP}s|:)\s*(?:still\s+|now\s+)?#?\s*\d{3,8})\b`) },
  { id: 'access.combination', category: 'access', subkind: 'code', code: 'combination', re: rx(String.raw`\b(?<mark>(?:the\s+)?(?:combination|combo)\s+(?:(?:to|for|on)\s+(?:the\s+)?[\w-]+\s+)?(?:is|was|${AP}s|:)\s*\d{1,3}(?:[-\s]\d{1,3}){1,3}|(?:the\s+)?(?:combination|combo)\s+(?:(?:to|for|on)\s+(?:the\s+)?[\w-]+\s+)?(?:is|was|${AP}s|:)\s*\d{4,8})\b`) },
  { id: 'access.code-kind-for', category: 'access', subkind: 'code', re: rx(String.raw`\b(?<mark>(?<kind>gate|door|front\s+door|back\s+door|side\s+door|alarm|lockbox|lock\s+box|key\s?box|key\s?safe|keypad|entry|access|garage|padlock|elevator)\s+code\s+(?:for|to|at|on)\s+(?:the\s+)?[\w-]+(?:\s+[\w-]+){0,2}?\s+(?:is|was|${AP}s|:|=)\s*(?:still\s+|now\s+)?#?\s*\d{3,8})\b`) },
  // "Enter 2045 on the keypad", "use code 4471 at the side door": a code given as an instruction.
  { id: 'access.use-code', category: 'access', subkind: 'code', code: 'entry', re: rx(String.raw`\b(?<mark>(?:use|enter|punch\s+in|key\s+in|type\s+in|dial)\s+(?:the\s+)?(?:(?:door\s+|gate\s+|entry\s+|access\s+)?(?:code|pin)\s+)?#?\d{4,8}#?)(?![\d/.,:-]|\s*(?:units?|pcs|pieces|items|copies|times|%|percent|dollars))`), check: (m, sentence) => !NOT_ENTRY.test(sentence) && (ENTRY_DEVICE.test(sentence) || (/\b(?:code|pin)\b/i.test(m.groups.mark) && ENTRY_PLACE.test(sentence))) },
  // A one-time or sign-in code passed on.
  { id: 'access.otp', category: 'access', subkind: 'code', code: 'sign-in', re: rx(String.raw`\b(?<mark>(?:verification|one[\s-]time|2fa|mfa|otp|authentication|auth|sign[\s-]?in|log[\s-]?in)\s+(?:code|pin|passcode)\s*(?:is|was|:|=|-)\s*(?:still\s+)?#?\s*\d{4,8})\b`) },
  // A password given: "the password is Tr4ctor!22", "PIN: 4471", "Wi-Fi key: Harbor-2026". Never a mask,
  // a template or a value the sentence calls an example.
  { id: 'access.password', category: 'access', subkind: 'password', re: rx(String.raw`\b(?<mark>(?<kw>password|passwd|passcode|pass\s?code|passphrase|pw|pwd|wi-?fi\s+key|network\s+key|wpa2?\s+key|pin(?:\s+(?:number|code))?)\s*(?:(?:for|to|on)\s+(?:the\s+|our\s+|my\s+|your\s+)?[\w-]+(?:\s+[\w-]+)?\s*)?(?<sep>(?:(?:has\s+been\s+|was\s+|is\s+|will\s+be\s+)?(?:set|changed|reset|updated)\s+to|is|was|will\s+be|:|=|-)\s*:?\s*(?:still\s+|now\s+|just\s+)?)["'“‘]?(?<secret>[^\s"'”’]{3,})["'”’]?)`), check: passwordGiven },
  { id: 'access.login', category: 'access', subkind: 'password', re: rx(String.raw`\b(?<mark>(?:log\s?in|user\s?name|user\s+id|credentials?(?:\s+are)?)\s*(?:is|are|:)?\s*\S+\s*(?:\/|and|,)\s*(?:(?:the\s+)?(?:password|pw|pwd)\s*(?:is|:)?\s*)?(?<secret>\S{4,}))`), check: (m) => /[\d!@#$%^&*_]/.test(m.groups.secret) && !isPlaceholderPassword(m.groups.secret.replace(/[.,;:]+$/, '')) },
  { id: 'access.api-key', category: 'access', subkind: 'password', re: rx(String.raw`\b(?<mark>(?:api\s+key|access\s+token|secret\s+key|auth\s+token|bearer\s+token)\s*(?:is|:|=)\s*(?<value>[a-z0-9_\-.]{16,}))`), check: (m) => looksRandom(m.groups.value.replace(/\.+$/, '')) },
  { id: 'access.security-status', category: 'access', subkind: 'security', re: rx(String.raw`\b(?<mark>(?:the\s+)?(?:alarm|alarms|alarm\s+system|security\s+system|camera|cameras|cctv|security\s+cameras?|motion\s+sensors?|security\s+lights?|site\s+lights)${WHERE}\s+(?:(?:is|are|was|were|has\s+been|have\s+been|will\s+be|${AP}s|${AP}re)\s+(?:still\s+|currently\s+|now\s+|going\s+to\s+be\s+)?(?:off|down|disabled|broken|offline|disarmed|out\s+of\s+order|switched\s+off|turned\s+off|dead|faulty|not\s+(?:working|armed|set|on|recording|connected|monitored))|(?:isn${AP}t|aren${AP}t|wasn${AP}t|weren${AP}t|doesn${AP}t|don${AP}t|won${AP}t)\s+(?:work(?:ing)?|armed|set|on|recording|connected|monitored|cover(?:ing)?)\b[^.?!;]{0,30}))`) },
  { id: 'access.lock-status', category: 'access', subkind: 'security', re: rx(String.raw`\b(?<mark>(?:the\s+)?(?:(?:front|back|side|site|main)\s+)?(?:gate|fence|perimeter\s+fence|lock|locks|padlock|door\s+lock|lockbox)${WHERE}\s+(?:(?:is|are|was|were|has\s+been|have\s+been|${AP}s|${AP}re)\s+(?:still\s+|currently\s+|now\s+)?(?:broken|busted|unlocked|left\s+(?:open|unlocked)|not\s+(?:locked|locking|working)|faulty|jammed\s+open|cut)|(?:isn${AP}t|aren${AP}t|doesn${AP}t|don${AP}t|won${AP}t)\s+(?:lock(?:ing)?|clos(?:e|ing)|latch(?:ing)?)\b))`),
    // Asking for a gate to be unlocked ("could you make sure the side gate is unlocked for the van") is an
    // arrangement, not a report that it is.
    check: (m) => !/\b(?:make\s+sure|ensure|check(?:\s+that)?|could\s+you|can\s+you|would\s+you|will\s+you|remember\s+to|please\s+(?:leave|keep))\b[^.?!\n]{0,30}$/i.test(m.input.slice(0, m.index)) },
  { id: 'access.no-cameras', category: 'access', subkind: 'security', re: rx(String.raw`\b(?<mark>no\s+(?:cameras?|cctv|alarm|security\s+lights?)\s+(?:on|at|covering|over|by)\s+[^.?!;]{1,30}|(?:cameras?|cctv)\s+(?:don${AP}t|doesn${AP}t|do\s+not|does\s+not|can${AP}t|cannot)\s+(?:cover|see)\s+[^.?!;]{1,30}|(?:the\s+)?(?:spare\s+)?keys?\s+(?:is|are|${AP}s)\s+(?:under|behind|in|above|inside)\s+the\s+(?:mat|doormat|pot|planter|rock|brick|meter\s+box|meter|flower\s*pot))`) },

  // Remark about a person: an insult or disparaging remark about a person or a company.
  { id: 'remark.is-insult', category: 'remark', subkind: 'insult', re: rx(String.raw`\b(?:is|are|was|were|${AP}s|${AP}re|being|seems\s+like|sounds\s+like|what)\s+(?<mark>(?:(?:a|an|such\s+an?|a\s+total|a\s+complete|a\s+real|an\s+absolute|an\s+utter|a\s+bunch\s+of|a\s+pack\s+of|total|complete|absolute|utter)\s+)?(?:(?:useless|incompetent|clueless|lazy|stupid|dumb|bloody|fucking|damn|lying|thieving)\s+)?${INSULT}\b(?:\s+who(?:${AP}s|${AP}ve|\s+has|\s+have|\s+is|\s+are|\s+can${AP}t|\s+cannot|\s+couldn${AP}t|\s+never|\s+doesn${AP}t|\s+don${AP}t|\s+wouldn${AP}t|\s+won${AP}t)\b[^.?!,;]{1,60})?)`) },
  { id: 'remark.those-insults', category: 'remark', subkind: 'insult', re: rx(String.raw`\b(?<mark>(?:that|those|these|this|bunch\s+of|pack\s+of)\s+(?:(?:total|complete|absolute|useless|incompetent|clueless|lazy|stupid|bloody|fucking|damn)\s+)?${INSULT})\b`) },
  { id: 'remark.adjective', category: 'remark', subkind: 'insult', re: rx(String.raw`\b(?:(?<pron>he|she|they)|(?<role>${ROLE})|(?<name>[a-z][\w-]{0,40}(?:\s+[a-z][\w-]{0,40})?))(?:\s+(?:is|are|was|were)|${AP}s|${AP}re)\s+(?:so\s+|completely\s+|totally\s+|utterly\s+|really\s+|absolutely\s+|just\s+|such\s+|clearly\s+)?(?<mark>${INSULT_ADJ})\b`), check: (m) => Boolean(m.groups.pron || m.groups.role || isName(m.groups.name)) },
]);

// Merge overlapping marks and trim edge spaces and trailing commas so a highlight starts and ends on a word.
function tidy(marks, text) {
  const trimmed = marks.map(({ start, end }) => {
    while (start < end && /\s/.test(text[start])) start++;
    while (end > start && /[\s,;:.]/.test(text[end - 1])) end--;
    return { start, end };
  }).filter((m) => m.end > m.start).sort((a, b) => a.start - b.start);
  const out = [];
  for (const m of trimmed) {
    const last = out[out.length - 1];
    if (last && m.start <= last.end) last.end = Math.max(last.end, m.end);
    else out.push({ ...m });
  }
  return out;
}

// Every detector and the given rules over one piece of text: add(id, category, subkind, start, end, codeKind).
// No rule matches fewer than 6 characters (the shortest is a password given as "pw:abc"), so a shorter
// piece (a bare label, "k=") is read by the value detectors only.
function screenOne(str, ctx, rules, add) {
  for (const h of detect(str, ctx)) add(h.detector.id, h.detector.category, h.subkind, h.start, h.end);
  if (str.length < 6) return;
  for (const rule of rules) {
    if (rule.hint && !rule.hint.test(str)) continue;
    rule.re.lastIndex = 0;
    for (let m; (m = rule.re.exec(str));) {
      if (!m[0]) { rule.re.lastIndex++; continue; }
      if (rule.check && !rule.check(m, str, ctx)) continue;
      const [start, end] = m.indices.groups?.mark ?? m.indices[0];
      add(rule.id, rule.category, rule.subkind, start, end, rule.code || (m.groups?.kind ? normalizeKind(m.groups.kind) : 'access'));
    }
  }
}

// A label and its value split over two lines ("Password:" then "Tr4ctor!22") or two columns
// ("SSN<tab>123456789") are read again as one "Label: value" line, by the value detectors and the
// access rules only (the phrasing rules for the other categories read sentences, not forms). A hit is
// kept only where it covers the value, and is cut to the value: the finding belongs to the value's
// sentence, because the value is what discloses. That is the text the pane highlights and the
// sentence "Remove this sentence" deletes, which leaves a harmless bare label behind. sentences.mjs
// bounds the pairs (a value is read again a few times at most, 120 characters each), so the screen
// stays linear.
const PAIR_RULES = RULES.filter((r) => r.category === 'access');
function pairedHits(text, sentences) {
  const out = new Map();
  for (const p of labelValuePairs(text, sentences)) {
    const joined = p.label + ' ' + p.value, from = p.label.length + 1;
    const valueEnd = sentences[p.index].start + p.valueStart + p.value.length;
    const ctx = { text: joined + text.slice(valueEnd, valueEnd + 200), offset: 0 };
    screenOne(joined, ctx, PAIR_RULES, (id, category, subkind, start, end, codeKind) => {
      const s = Math.max(start, from), e = Math.min(end, joined.length);
      if (e <= s) return;
      if (!out.has(p.index)) out.set(p.index, []);
      out.get(p.index).push({ id, category, subkind, start: s - from + p.valueStart, end: e - from + p.valueStart, codeKind });
    });
  }
  return out;
}

// Table cells (sentences.mjs tableRows) are read as "Header: value" too: by the value detectors, and by
// the access rules under an access header ("Password", "PIN"). A cell's context is the rest of its row
// written the same way, one "Header: value" a line, so a routing number finds the account number in
// the next column, and a CSV delimiter is never read as numeric punctuation around a value. A hit is
// kept where it covers the value, cut to it, and belongs to the sentence holding it. A cell under a
// number label (columnKind 'number': "Order ID", "invoice_no") holds that number, so a hit of a
// labelled detector there is dropped, from this read and from the plain read of the row alike.
// The first column names its rows (a person, a site, or the labels of a two-column "Label<tab>value"
// form, whose first line looks like a header), so it is never read under an access header.
const LABELLED = new Set(DETECTORS.filter((d) => d.labelled).map((d) => d.id));
const ACCESS_HEADER = /pass|\bpin\b|\bpw|pwd|code|key|login|user|credential|combo|combination/i;
function lastAtOrBefore(list, pos) {
  let lo = 0, hi = list.length - 1, found = -1;
  while (lo <= hi) { const mid = (lo + hi) >> 1; if (list[mid].start <= pos) { found = mid; lo = mid + 1; } else hi = mid - 1; }
  return found;
}
function tableHits(text, sentences, csv) {
  const out = new Map(), numberCells = [], kinds = new Map();
  const rows = tableRows(text, { csv });
  const kindOf = (h) => { if (!kinds.has(h)) kinds.set(h, columnKind(h)); return kinds.get(h); };
  for (const row of rows) for (const c of row.cells) if (c.end > c.start && kindOf(c.header) === 'number') numberCells.push(c);
  const numberAt = (pos) => { const k = lastAtOrBefore(numberCells, pos); return k >= 0 && pos < numberCells[k].end; };
  for (const row of rows) {
    let written = '';
    const at = row.cells.map((c) => {
      const label = c.header ? columnLabel(c.header) + ': ' : '';
      const from = written.length;
      written += label + text.slice(c.start, c.end) + '\n';
      return { from, valueFrom: from + label.length };
    });
    row.cells.forEach((c, k) => {
      const rules = k > 0 && c.header && ACCESS_HEADER.test(c.header) ? PAIR_RULES : [];
      // No detector finds a value under 6 characters (a six-digit sort code), no access rule one under 3.
      if (c.end - c.start < (rules.length ? 3 : 6)) return;
      const { from, valueFrom } = at[k], value = valueFrom - from, seg = written.slice(from, valueFrom + c.end - c.start);
      screenOne(seg, { text: written, offset: from }, rules, (id, category, subkind, start, end, codeKind) => {
        const s = c.start + Math.max(start, value) - value, e = c.start + Math.min(end, seg.length) - value;
        if (e <= s || (LABELLED.has(id) && numberAt(s))) return;
        const index = lastAtOrBefore(sentences, s), sentence = sentences[index];
        if (!sentence || s >= sentence.end) return;
        if (!out.has(index)) out.set(index, []);
        out.get(index).push({ id, category, subkind, start: s - sentence.start, end: Math.min(e, sentence.end) - sentence.start, codeKind });
      });
    });
  }
  return { hits: out, numberAt };
}

const normalizeKind = (kind) => kind.toLowerCase().replace(/\s+/g, ' ').replace(/^wifi$/, 'wi-fi').replace(/^lock box$/, 'lockbox').replace(/^key(box|safe)$/, 'key $1').trim();

// Findings for one text: [{category, subkind, codeKind?, source, file, sentence: {start, end, text,
// index, occurrence}, marks: [{start, end}] relative to the sentence, rules}]. One finding per sentence
// and category; the marks of every rule that hit are merged.
export function screenText(text, { source = 'body', file = null } = {}) {
  if (typeof text !== 'string') throw new TypeError('text must be a string');
  const sentences = splitSentences(text);
  const paired = pairedHits(text, sentences);
  const table = tableHits(text, sentences, /\.csv$/i.test(file || ''));
  const findings = [];
  let occurrence = null; // worked out once, on the first finding
  sentences.forEach((s, index) => {
    const hits = new Map();
    const add = (id, category, subkind, start, end, codeKind) => {
      if (LABELLED.has(id) && table.numberAt(s.start + start)) return;
      let hit = hits.get(category);
      if (!hit) {
        hit = { category, subkind, marks: [], rules: [] };
        if (subkind === 'code') hit.codeKind = codeKind;
        hits.set(category, hit);
      }
      hit.marks.push({ start, end });
      if (!hit.rules.includes(id)) hit.rules.push(id);
    };
    // The whole text and where this sentence starts in it, for a label on a neighbouring line.
    screenOne(s.text, { text, offset: s.start }, RULES, add);
    for (const h of paired.get(index) || []) add(h.id, h.category, h.subkind, h.start, h.end, h.codeKind);
    for (const h of table.hits.get(index) || []) add(h.id, h.category, h.subkind, h.start, h.end, h.codeKind);
    if (hits.size && !occurrence) occurrence = occurrences(sentences);
    for (const hit of hits.values()) {
      findings.push({ ...hit, marks: tidy(hit.marks, s.text), source, file,
        sentence: { start: s.start, end: s.end, text: s.text, index, occurrence: occurrence[index] } });
    }
  });
  return findings;
}
