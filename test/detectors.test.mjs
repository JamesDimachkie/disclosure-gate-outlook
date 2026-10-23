// Development cases for the value detectors (spec §5.1 to §5.3). Every value here is synthetic: tokens
// built with the right shape from a seeded generator, the card networks' published test numbers,
// documented example IBANs, invented SSNs and IDs in valid ranges.
import test from 'node:test';
import assert from 'node:assert/strict';
import { screenText } from '../core/rules.mjs';
import { luhn, ibanValid, abaValid, ssnValid, looksRandom } from '../core/detectors.mjs';

// [category, subkind, highlighted words] for each finding.
const found = (text) => screenText(text).map((f) => [f.category, f.subkind, f.marks.map((m) => f.sentence.text.slice(m.start, m.end)).join(' | ')]);
const cats = (text) => screenText(text).map((f) => f.category);

// Seeded generator (mulberry32) so the fake tokens are random-looking and the same on every run.
function generator(seed) {
  return (n, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let out = '';
    for (let i = 0; i < n; i++) {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      out += alphabet[((t ^ (t >>> 14)) >>> 0) % alphabet.length];
    }
    return out;
  };
}
const rnd = generator(20261022);
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567', DIGITS = '0123456789', B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const b64url = (o) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
const FAKE = {
  aws: 'AKIA' + rnd(16, B32), awsTemp: 'ASIA' + rnd(16, B32),
  ghp: 'ghp_' + rnd(36), gho: 'gho_' + rnd(36), pat: `github_pat_${rnd(22)}_${rnd(59)}`,
  slack: `xoxb-${rnd(12, DIGITS)}-${rnd(13, DIGITS)}-${rnd(24)}`, slackUser: `xoxp-${rnd(12, DIGITS)}-${rnd(12, DIGITS)}-${rnd(13, DIGITS)}-${rnd(32)}`,
  stripe: 'sk_live_' + rnd(24), stripeRestricted: 'rk_live_' + rnd(24), google: 'AIza' + rnd(35, B64.slice(0, 62) + '-_'),
  openai: 'sk-' + rnd(48), openaiProject: `sk-proj-${rnd(40)}_${rnd(20)}`, anthropic: `sk-ant-api03-${rnd(86)}-${rnd(6)}AA`,
  jwt: `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({ sub: 'u-4471', role: 'admin', iat: 1790000000 })}.${rnd(43)}`,
  pem: `-----BEGIN RSA PRIVATE KEY-----\n${rnd(64, B64)}\n${rnd(64, B64)}\n${rnd(40, B64)}==\n-----END RSA PRIVATE KEY-----`,
  awsSecret: rnd(40, B64),
};
// A Luhn-valid number from a prefix and a length (the last digit is the check digit).
function withCheck(prefix, length) {
  let body = prefix;
  while (body.length < length - 1) body += String((body.length * 7) % 10);
  for (let d = 0; d <= 9; d++) if (luhn(body + d)) return body + d;
  throw new Error('unreachable');
}

test('the checksums: Luhn, IBAN mod-97, ABA and SSN ranges', () => {
  assert.ok(luhn('4111111111111111') && luhn('378282246310005') && !luhn('4111111111111112'));
  for (const iban of ['GB82WEST12345698765432', 'DE89370400440532013000', 'FR1420041010050500013M02606', 'NL91ABNA0417164300', 'BE68539007547034', 'CH9300762011623852957']) assert.ok(ibanValid(iban), iban);
  for (const bad of ['GB82WEST12345698765433', 'DE8937040044053201300', 'ZZ82WEST12345698765432', 'GB82WEST1234569876543X']) assert.ok(!ibanValid(bad), bad);
  assert.ok(abaValid('021000021') && abaValid('011000015') && !abaValid('021000022') && !abaValid('991000021') && !abaValid('000000000'));
  assert.ok(ssnValid('512', '34', '8890'));
  for (const [a, g, s] of [['000', '12', '3456'], ['666', '12', '3456'], ['912', '34', '5678'], ['512', '00', '8890'], ['512', '34', '0000'], ['078', '05', '1120']]) assert.ok(!ssnValid(a, g, s), `${a}-${g}-${s}`);
  assert.ok(looksRandom(FAKE.ghp.slice(4)) && !looksRandom('abcdefghijklmnop1234') && !looksRandom('your-api-key-goes-here') && !looksRandom('AAAAAAAAAAAAAAAA1'));
});

test('5.1 tokens in known formats stop, each highlighted on its own', () => {
  const cases = [
    `The deploy user is ${FAKE.aws}, ask me for the secret.`, `Temporary key ${FAKE.awsTemp} expires tonight.`,
    `Here is the token: ${FAKE.ghp}`, `OAuth token ${FAKE.gho} for the CI app.`, `Use ${FAKE.pat} for the release repo.`,
    `The bot token is ${FAKE.slack}.`, `Slack user token: ${FAKE.slackUser}`,
    `Our live key is ${FAKE.stripe}.`, `Restricted key ${FAKE.stripeRestricted} for reporting only.`,
    `Maps key: ${FAKE.google}`, `OPENAI_API_KEY=${FAKE.openai}`, `Project key ${FAKE.openaiProject} is in the env file.`, `ANTHROPIC_API_KEY=${FAKE.anthropic}`,
    `Authorization: Bearer ${FAKE.jwt}`, `aws_secret_access_key = ${FAKE.awsSecret}`, `"client_secret": "${rnd(32)}"`,
  ];
  for (const text of cases) {
    const f = found(text);
    assert.equal(f.length, 1, text);
    assert.deepEqual(f[0].slice(0, 2), ['access', 'secret'], text);
    assert.ok(text.includes(f[0][2]) && f[0][2].length >= 20, `${text} -> ${f[0][2]}`);
  }
  assert.equal(found(`Bearer ${FAKE.jwt}`)[0][2], FAKE.jwt);
});

test('5.1 private keys and connection strings with a password stop', () => {
  const pem = found(`Key for the box below.\n${FAKE.pem}`);
  assert.deepEqual(pem, [['access', 'private-key', '-----BEGIN RSA PRIVATE KEY-----']]);
  // Flattened onto one line, as an HTML body sometimes arrives.
  assert.deepEqual(cats(FAKE.pem.replace(/\n/g, ' ')), ['access']);
  assert.deepEqual(cats(`-----BEGIN OPENSSH PRIVATE KEY-----\n${rnd(70, B64)}\n${rnd(70, B64)}\n-----END OPENSSH PRIVATE KEY-----`), ['access']);
  for (const text of ['DATABASE_URL=postgres://app:Qv7#pw2Lx@db.internal:5432/main', 'mongodb+srv://svc-report:h8Kq2mZ4tR@cluster0.ab1cd.mongodb.example/prod',
    'redis://default:N9r2xLq7v@cache.internal:6379', 'mysql://ledger:Tr4ctor22@10.0.4.12/books',
    'Server=tcp:sql1.internal,1433;Database=ledger;User Id=svc;Password=Hq8!rT2x;', 'Data Source=FS01;Initial Catalog=Payroll;User ID=pay;Pwd=Wq3$kL9z;',
    'jdbc:postgresql://db.internal:5432/claims?user=etl&password=Zx81!kQp']) {
    const f = found(text);
    assert.deepEqual(f.map((x) => x.slice(0, 2)), [['access', 'connection']], text);
  }
});

test('5.1 placeholders, examples, test keys and talk about secrets do not stop', () => {
  for (const text of ['Use sk-xxxx for now.', 'Set OPENAI_API_KEY=sk-your-key-here before running.', 'The docs use AKIAIOSFODNN7EXAMPLE as the key.',
    'aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', 'Token: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', `Test key sk_test_${rnd(24)} is fine to share.`,
    'xoxb-your-token-here-please-fill-in', 'sk_' + 'live_XXXXXXXXXXXXXXXXXXXXXXXX' /* split so secret scanners don't flag a placeholder */, 'The SKU is sk-blue-widget-large-edition-2026.', 'Authorization: Bearer <token>',
    'api key: your-api-key-goes-here-now', 'The API key is in the shared vault.', 'Rotate the API key every 90 days.',
    `${b64url({ typ: 'JWT' })}.${b64url({ sub: 'x' })}.${rnd(30)}`, 'Version eyJhbGciOi.notatoken.here',
    '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----', '-----BEGIN RSA PRIVATE KEY-----\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n-----END RSA PRIVATE KEY-----',
    '-----BEGIN PUBLIC KEY-----', 'postgres://user:password@localhost:5432/db', 'mongodb://<user>:<password>@cluster0.example.net/test',
    'Server=myServerAddress;Database=myDataBase;User Id=myUsername;Password=myPassword;', 'Server=db;Database=app;Password=${DB_PASSWORD};',
    'Password=; is not allowed in the template.', 'Use https://docs.example.com/setup for the steps.']) {
    assert.deepEqual(found(text), [], text);
  }
});

test('5.1 passwords, PINs and codes beyond construction wording', () => {
  const cases = [
    ['The client portal password is Brief#2291.', 'password'], ['The staging site password is Pixel-2026', 'password'], ['Temp password: Onb0arding!', 'password'],
    ['QuickBooks login: books@acme.example / Ledger#77', 'password'], ['The EHR passcode is 7741-Ward.', 'password'], ['The Wi-Fi password for the clinic is Harbor2026', 'password'],
    ['Your password was reset to Welcome#2026.', 'password'], ['PIN for the corporate card: 4471', 'password'], ['Wi-Fi key: Lobby-Guest-88', 'password'],
    ['Credentials are frontdesk / Ward7!desk', 'password'], ['The password is: Escrow!889', 'password'],
    ['The lockbox code is 4471.', 'code'], ['Enter 2045 on the keypad at the side door.', 'code'], ['Use code 7731 at the back door after 6.', 'code'],
    ['The door code for the back office is 7731.', 'code'], ['Your verification code is 482913.', 'code'], ['The 2FA code is 559201, it expires in 10 minutes.', 'code'],
  ];
  for (const [text, subkind] of cases) {
    const f = found(text);
    assert.deepEqual(f.map((x) => x.slice(0, 2)), [['access', subkind]], text);
  }
  assert.equal(screenText('Your verification code is 482913.')[0].codeKind, 'sign-in');
  assert.equal(found('Your password was reset to Welcome#2026.')[0][2], 'password was reset to Welcome#2026', 'a trailing full stop is not part of the highlight');
});

test('5.1 does not stop: talk about passwords, masks, examples, promo codes and reference numbers', () => {
  for (const text of ['I reset my password.', 'Send me the password reset link.', 'The password must be at least 12 characters.', 'Our password policy requires 2FA.',
    'Passwords are case-sensitive.', 'Password: ********', 'password: ********', 'PIN: ****', 'Password: [redacted]', 'Password: <your password>',
    'An example password is Summer2026!', 'For example, password: Hunter2026! would be rejected.', 'e.g. password: Tr0ub4dor&3', 'Password: see the vault entry.',
    'The site access is off Main Street.', 'Bring the keys Monday.', 'The access road is closed.', 'The promo code is SAVE2026.', 'Discount code: SPRING25',
    'Use code 4471 at checkout for 20% off.', 'Dial 4471 for the conference line.', 'Enter 2026 in the year field.', 'Your order number is 448812.',
    'Reference number: 2231-88.', 'The tracking number is 1Z999AA10123456784.', 'The building code for the county is 2018 IBC.', 'The verification code was sent to your phone.',
    'Enter 1200 units on the order form.', 'Please use the gate code we texted you.']) {
    assert.deepEqual(found(text), [], text);
  }
});

test('5.2 card numbers: Luhn plus a network prefix or card words', () => {
  for (const text of ['Card: 4111 1111 1111 1111, exp 09/28.', 'Visa 4242-4242-4242-4242', 'Please charge 5555 5555 5555 4444.', 'Amex 3782 822463 10005, CID 4471',
    'Discover 6011111111111117', 'Use 5105105105105100 for the deposit.', 'JCB 3530111333300000', 'Diners 30569309025904', 'Mastercard 2223 0031 2200 3222',
    `Card number ${withCheck('9', 16).replace(/(\d{4})(?=\d)/g, '$1 ')} (store card), expiry 04/27.`, 'Card details:\n4111111111111111\nExp 09/28  CVV 123']) {
    const f = found(text);
    assert.ok(f.some((x) => x[0] === 'financial' && x[1] === 'card'), text);
  }
  assert.equal(found('Card: 4111 1111 1111 1111, exp 09/28.')[0][2], '4111 1111 1111 1111');
});

test('5.2 card look-alikes do not stop: last four, other numbers, phones, failed checksums', () => {
  const orderNo = withCheck('4000', 16);
  for (const text of ['Card ending 4242.', 'The card ending in 4242 was declined.', 'Visa ****-****-****-4242', 'Card xxxx xxxx xxxx 1111',
    `Order #${orderNo} shipped today.`, `Invoice ${orderNo} is attached.`, `Tracking: ${orderNo}`, `PO ${orderNo} approved.`,
    'Call 555-201-3344 or +44 20 7946 0958.', 'Call me on +1 415 555 0132 2231.', 'Ref 1234 5678 9012 3456', '4111 1111 1111 1112', 'Card 4111 1111 1111 1112 exp 09/28',
    '0000 0000 0000 0000', 'USPS 9400 1000 0000 0000 0000 00', 'Account 12345678901234', 'IMEI 356938035643809', 'The order total is $4,111.11 for 1,111 units.']) {
    assert.deepEqual(found(text), [], text);
  }
});

test('5.2 bank accounts: IBAN, routing with account, sort code with account', () => {
  const cases = [
    ['IBAN: GB82 WEST 1234 5698 7654 32', 'GB82 WEST 1234 5698 7654 32'], ['Pay to DE89 3704 0044 0532 0130 00 by Friday.', 'DE89 3704 0044 0532 0130 00'],
    ['BE68 5390 0754 7034 from the account.', 'BE68 5390 0754 7034'], ['Our Dutch account is NL91ABNA0417164300.', 'NL91ABNA0417164300'],
    ['FR14 2004 1010 0505 0001 3M02 606', 'FR14 2004 1010 0505 0001 3M02 606'],
    ['Routing number: 021000021\nAccount number: 4400123456', '021000021'], ['Wire to ABA 011000015, account 9876543210.', '011000015'],
    ['Sort code 20-00-00, account 12345678.', '20-00-00'], ['Sort code: 40 47 84\nAccount number: 70872490', '40 47 84'],
  ];
  for (const [text, mark] of cases) {
    const f = found(text);
    assert.deepEqual(f.map((x) => x.slice(0, 2)), [['financial', 'bank']], text);
    assert.equal(f[0][2], mark, text);
  }
});

test('5.2 bank look-alikes do not stop: failed checksums, routing alone, dates, bank names', () => {
  for (const text of ['IBAN GB82 WEST 1234 5698 7654 33', 'DE89 3704 0044 0532 0130 0', 'Model AB12 CDEF GHIJ KLMN', 'Our bank routing number is 021000021.',
    'Invoice 021000021, account 12345.', 'Routing number: 021000022\nAccount: 4400123456', 'Meet on 20-10-26 at 12345678 Main.', 'Sort code 20-00-00.',
    'The sort code is on the statement, account 12345678.', 'We bank with Lloyds, 25 Gresham Street, London.', 'Our bank is Chase.', 'Account manager: Priya, ext 2231.']) {
    assert.deepEqual(found(text), [], text);
  }
});

test('5.3 government identifiers stop', () => {
  const cases = [
    ['His SSN is 512-34-8890.', 'ssn', '512-34-8890'], ['Employee SSN 512348890 for the I-9.', 'ssn', '512348890'], ['Social security number: 512 34 8890', 'ssn', '512 34 8890'],
    ['Tenant SS# 401-22-7315', 'ssn', '401-22-7315'], ['512-34-8890', 'ssn', '512-34-8890'],
    ['NI number: JK 48 21 93 B', 'ni', 'JK 48 21 93 B'], ['Her NINO is JK482193B.', 'ni', 'JK482193B'], ['National Insurance: ce 12 34 56 a', 'ni', 'ce 12 34 56 a'],
    ['SIN: 130 692 544', 'sin', '130 692 544'], ['His social insurance number is 130-692-544.', 'sin', '130-692-544'],
    ['Passport number is 548213976.', 'passport', 'Passport number is 548213976'], ["Driver's licence: D4471-22903", 'licence', "Driver's licence: D4471-22903"],
    ["Driver's license # A1234567 (CA)", 'licence', "Driver's license # A1234567"], ['My tax ID is 98-7654321.', 'tax', 'tax ID is 98-7654321'],
    ['National ID card number: 7801015009087', 'national-id', 'National ID card number: 7801015009087'], ['Patient ITIN 912-70-1234 is on file.', 'tax', 'ITIN 912-70-1234'],
  ];
  for (const [text, subkind, mark] of cases) {
    const f = found(text);
    assert.deepEqual(f.map((x) => x.slice(0, 2)), [['identity', subkind]], text);
    assert.equal(f[0][2], mark, text);
  }
});

test('5.3 does not stop: words without a number, out-of-range SSNs, dates, phones, ZIP codes, business tax numbers', () => {
  for (const text of ['Please send your SSN separately.', 'We need a copy of your passport.', "Driver's license is required at pickup.", 'Passport expires 2029-03-01.',
    'Bring your passport photo 2x2.', 'Our EIN is 12-3456789.', 'Our federal ID is 12-3456789.', 'Our VAT number is GB123456789.',
    '000-12-3456', '666-12-3456', '912-34-5678', '512-00-8890', '512-34-0000', '078-05-1120', 'Part 512-34-8890 is on backorder.', 'Order #512-34-8890',
    'Call 512-348-8890.', 'ZIP 94110-1234', 'Matter no. 512-34-8890 is set for mediation.', 'Permit 512-34-8890 was issued.', 'APN 512-34-8890', 'Dated 2026-10-22.', 'Ref TR123456B', 'Invoice GB 12 34 56 A', 'QQ 12 34 56 C', 'Ticket AB123456C',
    '130 692 544', 'SIN 130 692 545', 'The original sin was 130 692 544 pages long.', 'id card 2 copies', 'The tin roof is 12 345 678 mm long.', 'ID: 12345']) {
    assert.deepEqual(found(text), [], text);
  }
});

test('payment and identity findings sit next to the existing categories without merging into them', () => {
  const f = screenText('Card 4111 1111 1111 1111 and her SSN 512-34-8890 for the lease.');
  assert.deepEqual(f.map((x) => x.category), ['financial', 'identity']);
  assert.ok(f.every((x) => x.sentence.index === 0 && x.rules.length === 1));
});

test('the screen is portable: no Node APIs, no atob, no regex lookbehind in the code Outlook loads', async () => {
  const { readFileSync } = await import('node:fs');
  for (const file of ['detectors.mjs', 'recipient-checks.mjs', 'rules.mjs', 'copy.mjs', 'sentences.mjs', 'recipients.mjs']) {
    const source = readFileSync(new URL(`../core/${file}`, import.meta.url), 'utf8').replace(/^\s*\/\/.*$/gm, '');
    assert.ok(!/\bfrom\s+['"]node:|\brequire\(|\bBuffer\b|\batob\(|\bprocess\./.test(source), `${file} uses a Node or browser-only API`);
    assert.ok(!/\(\?<[=!]/.test(source), `${file} uses a regex lookbehind`);
  }
});

// Findings of an independent audit (October 2026), each with the near misses around it.
const where = (text) => screenText(text).map((f) => [f.category, f.subkind, f.sentence.text, f.marks.map((m) => f.sentence.text.slice(m.start, m.end)).join(' | ')]);
const NBSP = String.fromCharCode(0xa0), CURLY = String.fromCharCode(0x2019);

test('a label and its value on adjacent lines or in two columns are read together; the finding is the value line', () => {
  const cases = [
    ['Password:\nTr4ctor!22', 'access', 'password', 'Tr4ctor!22'], ['SSN:\n123456789', 'identity', 'ssn', '123456789'],
    ['Passport number:\n548213976', 'identity', 'passport', '548213976'], ['api_key=\nJ9pR4vN7zK2mX6tQ8cL3wY5b', 'access', 'secret', 'J9pR4vN7zK2mX6tQ8cL3wY5b'],
    ['Sort code:\n20-00-00\nAccount: 12345678', 'financial', 'bank', '20-00-00'], ['Password:\n\nsunshine', 'access', 'password', 'sunshine'],
    ['Gate code:\r\n4471', 'access', 'code', '4471'], ['IBAN:\ngb82 west 1234 5698 7654 32', 'financial', 'bank', 'gb82 west 1234 5698 7654 32'],
  ];
  for (const [text, category, subkind, value] of cases) {
    assert.deepEqual(where(text), [[category, subkind, value, value]], text);
    const [finding] = screenText(text);
    assert.equal(text.slice(finding.sentence.start, finding.sentence.end), value, 'the sentence points at real text');
  }
  // Two columns: the finding is the row, the highlight the value cell.
  assert.deepEqual(where('Password\tTr4ctor!22'), [['access', 'password', 'Password\tTr4ctor!22', 'Tr4ctor!22']]);
  assert.deepEqual(where('PIN    4471'), [['access', 'password', 'PIN    4471', '4471']]);
  assert.deepEqual(where('Name\tDan\nSSN\t512-34-8890').map((x) => x.slice(0, 2)), [['identity', 'ssn']]);
});

test('label and value pairs do not turn sign-offs, pointers, headers or other numbers into findings', () => {
  for (const text of ['Password:\nThanks, John', 'Password:\n\nRegards,\nJohn', 'Password:\nThe one we discussed on Friday.', 'Password:\nsee the vault entry', 'Password:\n********',
    'Password    Last changed    Owner', 'API key:\nsee the vault', 'Token:\n<paste here>', 'Ref:\n512-34-8890', 'Order number:\n4111111111111111', 'Order ID\t4111111111111111',
    'Tracking:\n1Z999AA10123456784', 'Phone:\n+1 415 555 0132', 'Phone    555-201-3344', 'Invoice total:\n$4,200', 'Account:\n12345678', 'Promo code:\nSPRING25',
    'Item\tQty\tPrice\nPIN connector\t12\t$3.00', 'Name\tRole\tPhone\nDan\tPM\t555-201-3344', 'Password policy:\nAt least 12 characters.', 'Password reset:\nUse the link in the portal.',
    'From: John Reyes\nSent: Monday, October 19, 2026 9:14 AM\nTo: Dan Whitfield\nSubject: North Hall']) {
    assert.deepEqual(where(text), [], text);
  }
});

test('assignments are matched in any case; provider prefixes stay exact', () => {
  const value = 'J9pR4vN7zK2mX6tQ8cL3wY5b';
  for (const text of [`API_KEY=${value}`, `AWS_SECRET_ACCESS_KEY=${value}`, `export STRIPE_API_KEY="${value}"`, `Client_Secret: ${value}`, `SECRET_KEY = ${value}`,
    `https://api.example.com/v1/data?api_key=${value}`]) {
    const f = where(text);
    assert.deepEqual(f.map((x) => x.slice(0, 2)), [['access', 'secret']], text);
    assert.ok(f[0][3].endsWith(value), text);
  }
  // A provider token in an assignment is highlighted as the token alone.
  assert.equal(where(`OPENAI_API_KEY=${FAKE.openai}`)[0][3], FAKE.openai);
  for (const text of ['API_KEY=your-api-key-goes-here-now', 'API_KEY=${API_KEY}', 'AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', 'API_KEY=abcdefghijklmnopqrstuvwx',
    `akia${rnd(16, B32).toLowerCase()} in lower case is not an AWS key`, `GHP_${rnd(36)} is not a GitHub token`, `XOXB-${rnd(12, DIGITS)}-${rnd(13, DIGITS)}-${rnd(24)}`]) {
    assert.deepEqual(where(text), [], text);
  }
});

test('IBANs in lower case or split by tabs and no-break spaces, highlighted as written', () => {
  const nb = ['GB82', 'WEST', '1234', '5698', '7654', '32'].join(NBSP);
  const cases = [
    ['IBAN: gb82 west 1234 5698 7654 32', 'gb82 west 1234 5698 7654 32'], ['iban: gb82west12345698765432', 'gb82west12345698765432'],
    ['GB82\tWEST\t1234\t5698\t7654\t32', 'GB82\tWEST\t1234\t5698\t7654\t32'], [`IBAN ${nb}`, nb],
    ['Pay to de89 3704 0044 0532 0130 00 per the IBAN below.\nIBAN: De89 3704 0044 0532 0130 00', 'De89 3704 0044 0532 0130 00'],
  ];
  for (const [text, mark] of cases) {
    assert.deepEqual(where(text).map((x) => [x[0], x[1], x[3]]), [['financial', 'bank', mark]], text);
  }
  // Lower case without the word IBAN reads like a hash or a file name; failed checksums never stop.
  for (const text of ['iban gb82 west 1234 5698 7654 33', 'Hash de89370400440532013000 in the log.', 'Ref gb82west12345698765432', 'Pay to de89 3704 0044 0532 0130 00 today.', 'GB82\tWEST\t1234\t5698\t7654\t33']) {
    assert.deepEqual(where(text), [], text);
  }
});

test('the label right before a number decides over card words elsewhere', () => {
  for (const text of ['Order: 4111111111111111', 'Please pay by credit card. Order: 4111111111111111', '{"order_id":"4111111111111111"}', '{"orderId": "4111111111111111", "payment": "card"}',
    'Pay by card. Invoice no. 4111111111111111', 'Order:\n4111111111111111', 'Visa accepted.\nTracking: 4111111111111111', 'Paid by Visa, transaction_id=4111111111111111']) {
    assert.deepEqual(where(text), [], text);
  }
  for (const text of ['Card: 4111 1111 1111 1111', 'Please pay by credit card: 4111111111111111', '{"card_number":"4111111111111111"}', 'Please pay by credit card. 4111111111111111',
    `Store card ${withCheck('9', 16)}, expiry 04/27.`]) {
    assert.deepEqual(where(text).map((x) => x.slice(0, 2)), [['financial', 'card']], text);
  }
  // Card words count only in the number's own sentence.
  assert.deepEqual(where(`Pay by card. ${withCheck('9', 16)}`), []);
});

test("a company's own EIN stays clear with a straight or curly apostrophe; a person's tax ID stops", () => {
  for (const text of ["Our company's EIN is 98-7654321.", `Our company${CURLY}s EIN is 98-7654321.`, 'Our EIN is 98-7654321.', "Our firm's tax ID is 98-7654321.", 'Our federal tax ID is 98-7654321.']) {
    assert.deepEqual(where(text), [], text);
  }
  for (const text of ['My tax ID is 98-7654321.', "The contractor's EIN is 98-7654321.", 'His TIN is 98-7654321.']) {
    assert.deepEqual(where(text).map((x) => x.slice(0, 2)), [['identity', 'tax']], text);
  }
});

test('the audit passing probes: ordinary numbers, ids and blobs clear; a short password and a key in a URL stop', () => {
  const png = 'data:image/png;base64,' + rnd(400, B64) + '==';
  for (const text of ['Call me on (415) 555-0132 or +44 20 7946 0958.', 'The meeting is on 2026-10-22 at 14:30, or 10/22/2026.', 'Request id 3f2b8c1e-9a4d-4c7b-8e21-5d6f7a8b9c0d failed.',
    'Fixed in commit 9fceb02d0ae598e95dc970b74767f19372d61af8.', `<img src="${png}">`, 'Use this link to reset your password: https://portal.example.com/reset', 'Please reset your password before Friday.']) {
    assert.deepEqual(where(text), [], text.slice(0, 80));
  }
  assert.deepEqual(where('pw: Hunter2!').map((x) => x.slice(0, 2)), [['access', 'password']]);
  assert.deepEqual(where(`See https://api.example.com/v1/report?api_key=${rnd(32)}&format=csv`).map((x) => x.slice(0, 2)), [['access', 'secret']]);
});
