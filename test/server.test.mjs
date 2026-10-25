import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createHandler} from '../outlook/server.mjs';
test('static development server serves the Pages subpath and refuses content POSTs and traversal',async()=>{
  const server=http.createServer(createHandler());await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const request=(path,method='GET')=>new Promise((resolve,reject)=>{
    const req=http.request({host:'127.0.0.1',port:server.address().port,path,method},res=>{const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>resolve({status:res.statusCode,text:Buffer.concat(chunks).toString(),type:res.headers['content-type']}));});req.on('error',reject);req.end();
  });
  try {
    for(const path of ['/setup.html','/runtime.js','/pane.js','/tokens.css','/manifest.xml','/assets/icon-32.png','/guardcell-outlook/setup.html','/.nojekyll']) assert.equal((await request(path)).status,200,path);
    for(const path of ['/server.mjs','/package.json','/../package.json','/%2e%2e/package.json','/missing','/%00','/..%5cpackage.json']) assert.equal((await request(path)).status,404,path);
    for(const path of ['/check','/timing','/setup.html']) assert.equal((await request(path,'POST')).status,405);
    assert.match((await request('/runtime.js')).type,/javascript/);
    assert.match((await request('/model/loader.js')).type,/javascript/);
    assert.match((await request('/model/ort-wasm-simd-threaded.mjs')).type,/javascript/);
    assert.match((await request('/model/assets.json')).type,/application\/json/);
    assert.match((await request('/model/ort-wasm-simd-threaded.wasm','HEAD')).type,/application\/wasm/);
  } finally {await new Promise(r=>server.close(r));}
});
