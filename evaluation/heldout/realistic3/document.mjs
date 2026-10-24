// Documentation statistics only; never creates or modifies email text.
import fs from 'node:fs/promises';
const root=new URL('./',import.meta.url);
const cases=(await fs.readFile(new URL('cases.jsonl',root),'utf8')).trimEnd().split('\n').map(JSON.parse);
const categories=['secrets','payment','government_id','personal','economics','negotiation','remark','lookalike','exposed_list','file','none'];
const counts=categories.map(c=>{const rows=cases.filter(x=>x.category_expected===c);return `| ${c} | ${rows.filter(x=>x.expect==='stop').length} | 0 | ${rows.filter(x=>x.expect==='pass').length} | ${rows.length} |`;});
function stats(values){const a=values.toSorted((a,b)=>a-b);return {min:a[0],p25:a[Math.floor((a.length-1)*.25)],median:a.length%2?a[(a.length-1)/2]:(a[a.length/2-1]+a[a.length/2])/2,p75:a[Math.floor((a.length-1)*.75)],max:a.at(-1),mean:Number((a.reduce((s,n)=>s+n,0)/a.length).toFixed(2))};}
const lengths={body_characters:stats(cases.map(x=>[...x.draft.body.text].length)),subject_plus_body_characters:stats(cases.map(x=>[...x.draft.subject+x.draft.body.text].length))};
const placements=Object.fromEntries(['body','quoted_history','subject'].map(p=>[p,cases.filter(x=>x.expect==='stop'&&x.metadata.placement===p).length]));
const industries=[...new Set(cases.map(x=>x.metadata.industry))].sort();
const english=Object.fromEntries(['UK','US','AU'].map(r=>[r,cases.filter(x=>x.metadata.english===r).length]));
const rows=Object.entries(lengths).map(([label,s])=>`| ${label} | ${s.min} | ${s.p25} | ${s.median} | ${s.p75} | ${s.max} | ${s.mean} |`).join('\n');
const text=`# Realistic outside mail, held-out tier 3

Author: **gpt-6.1-sol**. Date: **2026-10-23**. Independently written from this checkout's AGENTS.md, SPEC.md, evaluation/heldout/README.md and evaluation/heldout/run.mjs only. The parent README and runner were read for the schema, outcome definitions and composition-table contract. No other held-out folder or case file, implementation, rule, model, test, tool, documentation folder or other worktree was opened, listed or searched. No checker, model or checker-importing test was run. No prior memory was consulted. This task's narrower read and execution restrictions take precedence over the repository's general npm-test instruction.

Every email was written individually as literal text. The authoring batches record those literals; author.mjs only serializes them into draft objects. It does not select, combine, expand or generate email prose. document.mjs computes documentation statistics. The shared fictional routing addresses are neutral fixtures, not inferred identities of scenario companies. All recipients are outside by exact domain under SPEC §4.

| category_expected | stop | prompt | pass | Total |
| --- | ---: | ---: | ---: | ---: |
${counts.join('\n')}
| **Total** | **${cases.filter(x=>x.expect==='stop').length}** | **0** | **${cases.filter(x=>x.expect==='pass').length}** | **${cases.length}** |

Pass cases represent ordinary outside correspondence, not targeted near-misses. Every pass is labelled none. Each stop has one author-identified deciding sentence, quoted verbatim in its one-line SPEC rationale. Metadata records its position and distinct deciding verb and noun. Placement is defined structurally: subject means the whole subject; quoted_history means a body line beginning with >; body means unquoted body text. All remaining prose is intended as ordinary mail.

Length counts are Unicode characters, without metadata, routing, rationale or JSON escaping. Subject-plus-body excludes a separator. Quartiles use the lower order statistic at floor((n-1)*p); the even-sample median averages the middle pair.

| Text | Minimum | P25 | Median | P75 | Maximum | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
${rows}
<!-- length-statistics ${JSON.stringify(lengths)} -->

Stop placements: body ${placements.body}; quoted history ${placements.quoted_history}; subject ${placements.subject}. Pass cases have no deciding placement.
<!-- stop-placements ${JSON.stringify(placements)} -->

Intended English variants: UK ${english.UK}; US ${english.US}; Australian ${english.AU}. These are scenario and spelling labels, not evidence of population representativeness.
<!-- english ${JSON.stringify(english)} -->

Industries (${industries.length}): ${industries.join('; ')}.
<!-- industries ${JSON.stringify(industries)} -->

All people, companies and scenarios are invented. All routable addresses use .example or .test. No real correspondence, personal records, passwords, API keys, payment-card numbers, bank details or government identifiers were used. The access stops concern physical premises only. There are no attachments, lookalike routes or large visible recipient lists.

Custody: **Never tune rules or models on this set**, its deciding sentences, per-case results or paraphrases. Freeze before scoring. Evaluate without case changes in response to outcomes; use separately authored development data for fixes. These synthetic single-author labels have no independent human adjudication and do not establish production prevalence, acceptable release thresholds, Outlook integration, latency or runtime coverage.

Standalone verification: node evaluation/heldout/realistic3/validate.mjs --write-receipt. It reads only cases.jsonl and this README in this tier, and writes validation.json when requested. During authoring, --checkpoint allows incomplete quotas while retaining schema and documentation checks. Final validation enforces the full composition and requested placement and length quotas. Numeric/credential screens and the deciding-key checks are structural safeguards, not a semantic classifier.

Validator verification on 2026-10-23: validate-selftest.mjs accepted the unmodified tier before and after rejecting twenty deliberately invalid mutations for the expected reasons. It used temporary copies wholly inside this tier and removed those copies afterwards. The mutations cover schema, IDs, duplicate bodies, domains, routing, visible recipients, attachments, rationale, table/statistic agreement, deciding-sentence occurrence and placement, numeric fixtures and regional metadata. No source case was changed by the self-test.

SPEC ambiguity: none requiring a changed label. Clinic letters contain appointment logistics only, not conditions or treatment. Legal letters concern company contracts only. Customer prices and actual offers are distinguished from own costs and undisclosed negotiating flexibility under §§5.5–5.6. The set measures §5 outcomes; SPEC §3 currently defaults the model to Off, so any decision to change that default remains a separate product decision.
`;
await fs.writeFile(new URL('README.md',root),text,'utf8');
