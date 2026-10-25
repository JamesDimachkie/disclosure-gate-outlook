// Local synthetic browser benchmark; never reads evaluation data or uses Office/network mail.
// Build first. Pass the installed Playwright package with --playwright=<absolute index.mjs>, and optionally
// a browser binary with --chromium=<absolute path> when Playwright's own download is not installed.
import http from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const arg = name => process.argv.find(x => x.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const root = resolve(import.meta.dirname, '..');
const { chromium } = await import(pathToFileURL(arg('playwright')).href);
const runs = Number(arg('runs') || 3), output = arg('output'), screenshot = arg('screenshot');
const html = `<!doctype html><title>Guardcell synthetic Send timing</title><pre id="result">Ready</pre>
<script>
const handlers={}, values={}; let body='', metrics;
const ok=value=>({status:'succeeded',value}), field=value=>({getAsync:cb=>cb(ok(value))});
const item={from:field({emailAddress:'sender@inside.example'}),to:field([{emailAddress:'reader@outside.example'}]),cc:field([]),bcc:field([]),subject:field(''),
 body:{getTypeAsync:cb=>cb(ok('text')),getAsync:(_type,cb)=>cb(ok(body))},getAttachmentsAsync:cb=>cb(ok([])),
 sessionData:{setAsync:(k,v,cb)=>{values[k]=v;cb?.(ok());},getAsync:(k,cb)=>cb(ok(values[k]))}};
globalThis.Office={context:{mailbox:{item,userProfile:{emailAddress:'sender@inside.example'}},requirements:{isSetSupported:()=>true},urls:{javascriptRuntimeUrl:location.origin+'/runtime-browser.js?findings=ask&failures=ask&model=on'}},actions:{associate:(n,fn)=>handlers[n]=fn},onReady(){}};
const originalMatch=Cache.prototype.match;
Cache.prototype.match=async function(...args){const m=metrics,t=performance.now();try{return await originalMatch.apply(this,args);}finally{if(m){m.cacheReads++;m.cacheMs+=performance.now()-t;}}};
const originalDigest=crypto.subtle.digest.bind(crypto.subtle);
crypto.subtle.digest=async(...args)=>{const m=metrics,t=performance.now();try{return await originalDigest(...args);}finally{if(m){m.hashes++;m.hashMs+=performance.now()-t;}}};
const NativeWorker=Worker;
globalThis.Worker=class extends NativeWorker {
 constructor(...args){super(...args);this.started=performance.now();if(metrics)metrics.workers++;this.addEventListener('message',({data})=>{if(!metrics)return;if(data.type==='ready')metrics.initMs+=performance.now()-this.started;if(data.type==='result')metrics.inferMs+=performance.now()-this.classified;});}
 postMessage(message,...args){if(message.type==='classify')this.classified=performance.now();return super.postMessage(message,...args);}
};
globalThis.runSend=async(n)=>{
 body=Array.from({length:n},(_,i)=>'Please review schedule item '+(i+1)+' before the next project meeting.').join(' ');
 metrics={cacheReads:0,cacheMs:0,hashes:0,hashMs:0,workers:0,initMs:0,inferMs:0};const t=performance.now();let completed=0;
 const outcome=await new Promise(resolve=>handlers.onMessageSendHandler({completed:o=>{completed++;resolve(o);}}));
 const result=JSON.parse(values['dg-result']).result;
 const sample={sentences:n,sendMs:performance.now()-t,...metrics,semantic:result.checked?.semantic,allowEvent:outcome.allowEvent,completed};metrics=null;
 document.querySelector('#result').textContent=JSON.stringify(sample,null,2);return sample;
};
</script><script src="/runtime-browser.js"></script>`;
const requests = [];
const server = http.createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname;
    requests.push({ method: req.method, path });
    if (path === '/') { res.setHeader('Content-Type', 'text/html'); res.end(html); return; }
    const file = resolve(root, 'dist', '.' + path);
    if (!file.startsWith(resolve(root, 'dist') + '\\') && !file.startsWith(resolve(root, 'dist') + '/')) { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', ({ '.wasm': 'application/wasm', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.png': 'image/png' })[extname(file)] || 'text/plain');
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, executablePath: arg('chromium') });
try {
  const context = await browser.newContext(), page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const cdp = await context.newCDPSession(page);
  await page.goto(origin);
  await page.evaluate(() => GuardcellSemantic.preload());
  const samples = [];
  for (const rate of [1, 4]) {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    for (const sentences of [10, 60]) for (let trial = 0; trial < runs; trial++) {
      await page.reload();
      for (const runtime of ['fresh', 'repeat']) {
        const requestIndex = requests.length;
        const sample = { rate, runtime, trial, ...await page.evaluate(n => runSend(n), sentences), sendRequests: requests.slice(requestIndex) };
        samples.push(sample); console.log(JSON.stringify(sample));
      }
    }
    // Only an optimization if this runtime survives compose event completion.
    await page.reload();
    await page.evaluate(() => GuardcellSemantic.preload());
    samples.push({ rate, runtime: 'compose-prepared', trial: 0, ...await page.evaluate(() => runSend(10)) });
  }
  const result = { timestamp: new Date().toISOString(), browser: browser.version(), origin, runs, samples, errors,
    requests, note: 'Synthetic synchronous Office callbacks; real built handler, gate, cache, digest, worker, WASM and classifier. CDP throttle is an approximation, not an older-laptop qualification.' };
  if (screenshot) {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    await page.goto(origin + '/index.html');
    result.landing = { title: await page.title(), results: await page.getByRole('heading', { name: 'How well it works' }).count() };
    assert.equal(result.landing.title, 'Guardcell for Outlook');
    assert.equal(result.landing.results, 1);
    assert.equal(await page.getByRole('heading', { name: 'Asks before it leaves.' }).isVisible(), true);
    for (const [name, width, height] of [['desktop', 1280, 900], ['phone', 390, 844]]) {
      await page.setViewportSize({ width, height });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, name + ' has no horizontal overflow');
      await page.screenshot({ path: screenshot + '-' + name + '.png', fullPage: true });
    }
  }
  assert.equal(errors.length, 0, 'no page runtime errors');
  for (const sample of samples) {
    assert.equal(sample.semantic, 'used'); assert.equal(sample.allowEvent, true); assert.equal(sample.completed, 1);
    if (sample.sendRequests) assert.deepEqual(sample.sendRequests, [], 'Send is network-free');
  }
  if (output) await writeFile(output, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ output, errors }));
} finally { await browser.close(); await new Promise(r => server.close(r)); }
