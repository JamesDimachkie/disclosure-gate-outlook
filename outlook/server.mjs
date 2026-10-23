// Development-only HTTPS static file server. Never receives or checks email content.
import https from 'node:https';
import { RELEASE_BASE_URL } from './config.mjs';
const PAGES_PATH=new URL(RELEASE_BASE_URL).pathname.replace(/\/$/,'');
import { readFile, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
export const ORIGIN='https://localhost:3443';
const DIST=fileURLToPath(new URL('../dist/',import.meta.url));
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.xml':'text/xml; charset=utf-8','.png':'image/png','.txt':'text/plain; charset=utf-8','.wasm':'application/wasm','.gz':'application/gzip'};
export function createHandler({distRoot=DIST}={}) {
  const root=resolve(distRoot);
  return async(req,res)=>{
    const reply=(status,body='',type='text/plain; charset=utf-8')=>{res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(body);};
    if(req.method!=='GET'&&req.method!=='HEAD') {req.resume();return reply(405);}
    try {
      let path=decodeURIComponent(String(req.url).split('?')[0]);
      // Also mount the planned Pages subpath locally for integration verification.
      if(PAGES_PATH && path.startsWith(PAGES_PATH+'/')) path=path.slice(PAGES_PATH.length);
      if(path.endsWith('/')) path+='setup.html';
      if(path.includes('\\')||path.includes('\0')) return reply(404);
      const file=resolve(root,'.'+path);
      if(!file.startsWith(root+sep)||!(await stat(file)).isFile()) return reply(404);
      const content=await readFile(file);
      reply(200,req.method==='HEAD'?'':content,TYPES[extname(file)]||'application/octet-stream');
    } catch { reply(404); }
  };
}
export async function listen({port=3443,keyPath,certPath}={}) {
  const dir=join(homedir(),'.office-addin-dev-certs');
  // Node consumes the existing certificate for TLS; no key is displayed or copied.
  const server=https.createServer({key:await readFile(keyPath||join(dir,'localhost.key')),cert:await readFile(certPath||join(dir,'localhost.crt'))},createHandler());
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
  // "localhost" may resolve to ::1 first; serve the IPv6 loopback too (still local only). A machine
  // without IPv6 just skips it.
  const options={key:await readFile(keyPath||join(dir,'localhost.key')),cert:await readFile(certPath||join(dir,'localhost.crt'))};
  const v6=https.createServer(options,createHandler());
  await new Promise((resolve)=>{v6.once('error',()=>resolve());v6.listen(port,'::1',resolve);});
  const close=server.close.bind(server);
  server.close=(cb)=>{v6.close();return close(cb);};
  return server;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const server=await listen();
  console.log('Development files: '+ORIGIN+'/setup.html (Ctrl+C stops the server).');
  process.on('SIGINT',()=>server.close());
}
