// Windows/shared-laptop helper. Run trusted commands only; never corpus content.
import { mkdir, rm, writeFile, open } from 'node:fs/promises';
import { freemem } from 'node:os';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
const args = process.argv.slice(2), sep = args.indexOf('--');
if (sep < 0 || !args[sep + 1]) throw new Error('Usage: node tools/with-heavy-lock.mjs [--log file] -- command args...');
const logIndex = args.indexOf('--log'), log = logIndex < 0 ? null : await open(resolve(args[logIndex + 1]), 'a');
const say = async s => { if (log) await log.write(s + '\n'); else console.log(s); };
const lock = resolve('../dg-email-heavy.lock');
let owned = false, child;
try {
  for (let attempt = 0; attempt < 61; attempt++) {
    try { await mkdir(lock); owned = true; break; }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
    if (attempt === 60) throw new Error('shared heavy lock still busy after 60 minutes');
    await say('Shared heavy lock busy; retry in one minute.');
    await new Promise(r => setTimeout(r, 60000));
  }
  if (freemem() < 1.5 * 1024 ** 3) throw new Error('Need at least 1.5 GiB free RAM');
  await writeFile(resolve(lock, 'owner.json'), JSON.stringify({ pid: process.pid, cwd: process.cwd(), at: new Date().toISOString() }));
  await say('Acquired shared lock; free RAM MiB=' + Math.round(freemem() / 1024 ** 2));
  const command = args[sep + 1] === 'node' ? process.execPath : args[sep + 1];
  child = spawn(command, args.slice(sep + 2), { windowsHide: true, stdio: ['ignore', log ? log.fd : 'inherit', log ? log.fd : 'inherit'] });
  // Chunks must finish within 29 minutes. The parsers' own children have much shorter deadlines.
  const stopOwnedTree = () => {
    if (process.platform === 'win32') spawn('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
    else child.kill('SIGKILL');
  };
  const timer = setTimeout(stopOwnedTree, 29 * 60 * 1000);
  try { process.exitCode = await new Promise((res, rej) => { child.once('error', rej); child.once('close', code => res(code ?? 1)); }); }
  finally { clearTimeout(timer); }
} finally {
  if (owned) await rm(lock, { recursive: true }); // only the exact directory created above
  await say('Released shared lock.');
  await log?.close();
}
