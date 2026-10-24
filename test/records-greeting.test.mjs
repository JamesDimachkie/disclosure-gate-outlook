import test from 'node:test';
import assert from 'node:assert/strict';
import { screenText } from '../core/rules.mjs';
import { greetingFinding } from '../core/greeting.mjs';
import { checkDraft } from '../core/gate.mjs';

const records = (text, file = null) => screenText(text, { source: file ? 'attachment' : 'body', file }).filter((f) => f.subkind === 'records');

test('a table or form pairing people with what is sensitive about them is a list of personal details', () => {
  // Shapes from real incidents (synthetic values): a client register, an offender list, a claims sheet,
  // an adoption list, a relocation sheet with family members, an employee tax form.
  for (const text of [
    'Clients\nClient\tAddress\tTax identifier\tLoan account\nLeah Reed\t18 Fictional Walk\tTAX-0004\tLOAN-74',
    'Name\tHome address\tOffence category\tSentence\tPlanned release\nEvan Reed\t42 Sample Lane\tfraud\ttwo years\tnext spring',
    'Claimant\tInjury-claim reference\tClaim status\nLeah Reed\tCLAIM-31\treview',
    'Adopted child\tBirth date\tAdoptive parent\tSocial worker\nRowan Hale\t3 February 2019\tSam Hale\tJo Park',
    'Applicant\tContact\tSpouse\tChild\tRequest\nAvery Reed\tavery@mail.example\tMorgan Reed\tRowan Reed\tRelocation',
    'Employee tax form Employee: Avery Reed Social Security identifier: SSN-TEST-0008 Annual wages: USD 81,200',
  ]) assert.equal(records(text, 'sheet.xlsx').length, 1, text);
});

test('ordinary tables and forms stay clear: contacts, schedules, prices, a single bank line on an invoice', () => {
  for (const text of [
    'Name\tRole\tEmail\tPhone\nAlex Rowan\tSite lead\talex@cedar.example\t01632 960 111',
    'Name\tCourt\tTime\nSam Lee\t2\t18:00\nJo Park\t3\t19:00',
    'Client\tProject\tStatus\tDue\nCedar Ltd\tFit-out\tOn track\t12 Nov',
    'Item\tQty\tPrice\nPallet wrap\t4\t$12.00',
    'Name: Alex Rowan\nCompany: Cedar Ltd\nRole: Buyer',
    'Invoice 4471. Bank account: 12345678. Sort code: 12-34-56. Thanks, Sam',
  ]) assert.deepEqual(records(text), [], text);
});

const to = (name, address, field = 'to') => ({ field, name, address, reach: 'outside' });

test('a greeting that names nobody on the To line asks; a matching or undecidable one stays quiet', () => {
  assert.equal(greetingFinding('Hi Alex,\nThe visit is Tuesday.', [to('Morgan Vale', 'morgan@cedar.example')])?.subkind, 'greeting');
  assert.equal(greetingFinding('Dear Ms Patel,\nThanks.', [to('Morgan Vale', 'morgan@cedar.example')])?.subkind, 'greeting');
  for (const [body, recipients] of [
    ['Hi Alex,\nok', [to('Alex Rowan', 'alex@cedar.example')]],
    ['Hi Bob,\nok', [to('Robert Kemp', 'rkemp@cedar.example')]],
    ['Dear Graham,\nok', [to('Mr G Ferguson', 'gferguson@talk.example')]],
    ['Dear Mr Whitcombe,\nok', [to('Diane Whitcombe', 'diane.whitcombe@post.example')]],
    ['Hi Sarah,\nok', [to('Lettings', 'lettings@pinnacle.example')]],
    ['Hi Sue,\nok', [to('Harbour Guest House', 'info@harbour.example')]],
    ['Hi Sue,\nok', [to('Mrs Hooper', 'hoopers@bt.example')]],
    ['Hi all,\nok', [to('Morgan Vale', 'morgan@cedar.example')]],
    ['Dear Leaseholders,\nok', [to('Tom Bell', 'tbell@harcourt.example')]],
    ['Hi Alex, Sam,\nok', [to('Morgan Vale', 'morgan@cedar.example')]],
    ['Hi Alex and Sam,\nok', [to('Morgan Vale', 'morgan@cedar.example')]],
    ['Hi, I\'ll be round Weds.', [to('Morgan Vale', 'morgan@cedar.example')]],
    ['> Hi Alex,\n> old reply', [to('Morgan Vale', 'morgan@cedar.example')]],
    ['Hi Alex,\nok', [to('Morgan Vale', 'morgan@cedar.example'), to('Alex Rowan', 'alex@cedar.example', 'cc')]],
  ]) assert.equal(greetingFinding(body, recipients), null, body + ' to ' + recipients.map((r) => r.name).join(','));
});

test('the gate asks about a wrong-looking recipient and a list of people in a file, with Send anyway', async () => {
  const draft = { from: { address: 'sam@sender.example' }, to: [{ name: 'Morgan Vale', address: 'morgan@cedar.example' }], cc: [], bcc: [],
    subject: 'Tuesday', body: { format: 'text', text: 'Hi Alex,\nThe site visit is confirmed for Tuesday at 10.' }, attachments: [] };
  const r = await checkDraft(draft, { config: { internalDomains: ['sender.example'], model: 'off' } });
  assert.deepEqual(r.findings.map((f) => f.category + ':' + f.subkind), ['recipient:greeting']);
  assert.equal(r.state, 'held');
  assert.equal(r.outcome, 'ask');
});

test('text marked for inside the company asks when it goes outside; confidentiality footers do not', () => {
  const internal = (t) => screenText(t).filter((f) => f.category === 'internal').length;
  for (const t of ['FYI - internal only, not for the client.', 'Please do not forward this to the client, these are our real numbers.', 'Keep this between us.',
    'Not for external distribution.', "Don't share it with them yet.", 'For internal discussion: draft pricing.']) assert.equal(internal(t), 1, t);
  for (const t of ['This email and any attachments are confidential and intended solely for the addressee.',
    'This message contains commercially confidential information intended for the named recipient only.', 'Company Confidential - for the addressee only.',
    "Please don't forward this link to anyone else.", 'Our internal team will review it on Monday.', 'The internal walls are only plasterboard.',
    'Privileged and confidential: attorney-client communication.']) assert.equal(internal(t), 0, t);
});

test('an unknown outside address shown as its own name still gives a first name when it is shaped like one', () => {
  const bare = (address) => ({ field: 'to', name: address, address, reach: 'outside' });
  assert.equal(greetingFinding('Hi Alex,\nok', [bare('morgan.vale@cedar.example')])?.subkind, 'greeting');
  assert.equal(greetingFinding('Hi Morgan,\nok', [bare('morgan.vale@cedar.example')]), null);
  assert.equal(greetingFinding('Hi Alex,\nok', [bare('dragonfly77@mail.example')]), null);
  assert.equal(greetingFinding('Hi Alex,\nok', [bare('sales.team@cedar.example')]), null);
  // A one-word address counts only when it is a common first name; a titled greeting names a surname.
  assert.equal(greetingFinding('Hi Kate,\nok', [bare('dan@whitfielddev.example')])?.greeted, 'Kate');
  assert.equal(greetingFinding('Hi Kate,\nok', [bare('katherine@whitfielddev.example')]), null);
  assert.equal(greetingFinding('Hi Tom,\nok', [bare('buying@grocers.example')]), null);
  assert.equal(greetingFinding('Hi Kate,\nok', [bare('kmorgan@cedar.example')]), null);
  assert.equal(greetingFinding('Dear Mrs Doyle,\nok', [bare('margaret@mail.example')]), null);
});

test('a named person with identity details in prose is a record; a checklist naming document types is not', () => {
  assert.equal(records('The delegation travel details are: Avery Hale, date of birth 12 April 1972, passport PASSPORT-DEMO-04, visa reference VISA-TEST-008.').length, 1);
  assert.equal(records('As requested, the payroll record for Avery Reed is: employee EMP-DEMO-15, Social Security identifier SSN-TEST-0007, annual pay USD 78,400.').length, 1);
  assert.equal(records('Dear Rowan, the heading "tax ID" can remain, and the checklist can say passport or national ID.').length, 0);
  assert.equal(screenText('Please keep this review of a possible exit within the team for now.').filter((f) => f.category === 'internal').length, 1);
  assert.equal(screenText('Keep the receipt within the box.').filter((f) => f.category === 'internal').length, 0);
});
