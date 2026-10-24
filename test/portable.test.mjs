import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash,randomBytes} from 'node:crypto';
import {deflateRawSync,deflateSync,constants} from 'node:zlib';
import {sha256} from '../core/sha256.mjs';
import {inflateRaw,inflateZlib} from '../core/extract/inflate.mjs';
import {fromBase64,decodeBytes,utf8,crc32} from '../core/bytes.mjs';
test('portable SHA-256 matches Node for Unicode, padding boundaries and large input',()=>{
  for(const s of ['', 'abc','Å 💬 中文 \ud800',...Array.from({length:130},(_,i)=>'a'.repeat(i)),'a'.repeat(500000)]) assert.equal(sha256(s),createHash('sha256').update(s).digest('hex'));
});
test('portable SHA-256 hashes attachment bytes exactly, rather than their string or JSON form',()=>{
  for(const bytes of [new Uint8Array(), Uint8Array.of(0,128,255),new Uint8Array(randomBytes(100000))]) assert.equal(sha256(bytes),createHash('sha256').update(bytes).digest('hex'));
});
test('portable inflate matches zlib across block types and long backreferences',()=>{
  let seed=123;const bytes=new Uint8Array(40000);for(let i=0;i<bytes.length;i++){seed=(seed*1664525+1013904223)>>>0;bytes[i]=seed>>>24;}
  for(const raw of [new Uint8Array(),utf8('hello hello hello'),utf8('a'.repeat(100000)),bytes,randomBytes(65536)]) for(const options of [{level:0},{strategy:constants.Z_FIXED},{level:1},{level:9}]) {
    assert.deepEqual(inflateRaw(deflateRawSync(raw,options)),new Uint8Array(raw));assert.deepEqual(inflateZlib(deflateSync(raw,options)),new Uint8Array(raw));
  }
});
test('inflate refuses truncation, over-limit output and corrupt checksums',()=>{
  const data=deflateRawSync('a'.repeat(10000));assert.throws(()=>inflateRaw(data,{maxOutputLength:50}),/large/);assert.throws(()=>inflateRaw(data.subarray(0,Math.floor(data.length/2))));
  const z=deflateSync('hello');z[z.length-1]^=1;assert.throws(()=>inflateZlib(z),/adler/);assert.throws(()=>inflateRaw(Uint8Array.of(7)));
});
test('portable base64, Windows-1252, UTF16 and CRC32',()=>{
  for(const s of ['hello','💬 é','', 'a'.repeat(100)]) assert.deepEqual(fromBase64(Buffer.from(s).toString('base64')),new Uint8Array(Buffer.from(s)));
  for(const s of ['?', 'abcd=', 'a===','%%%','abc']) assert.throws(()=>fromBase64(s));
  assert.equal(decodeBytes(Uint8Array.of(128),'windows-1252'),'€');assert.equal(decodeBytes(Uint8Array.of(65,0),'utf-16le'),'A');assert.equal(decodeBytes(utf8('Å💬')),'Å💬');assert.equal(crc32(utf8('123456789')),0xcbf43926);
});

test('base64 accepts the full 10 MiB attachment limit without regex stack exhaustion',()=>{const data=Buffer.alloc(10*1024*1024,65);assert.equal(fromBase64(data.toString('base64')).length,data.length);});
test('no runtime code passes a position to startsWith/endsWith (Outlook on the web replaces both and ignores it)',async()=>{
  const {readdirSync,readFileSync}=await import('node:fs');
  const files=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(d+'/'+e.name):/\.(m?js)$/.test(e.name)?[d+'/'+e.name]:[]);
  const bad=['core','outlook'].flatMap(d=>files(new URL('../'+d,import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'))).flatMap(f=>readFileSync(f,'utf8').split('\n').map((line,i)=>[f,i+1,line])).filter(([,,line])=>/\.(startsWith|endsWith)\((?:[^(),]|\([^()]*\))*,/.test(line));
  assert.deepEqual(bad.map(([f,n])=>f.split(/[\/]/).slice(-2).join('/')+':'+n),[]);
});
test('PDF text and HTML text read the same with Outlook on the web\'s replaced string methods',async()=>{
  const {onePage}=await import('./pdf-fixture.mjs');
  const pdf=onePage('BT /F1 12 Tf 72 720 Td (Routing number: 021000021) Tj ET');
  const native=String.prototype.startsWith,nativeEnds=String.prototype.endsWith;
  String.prototype.startsWith=function(a){return this.substr(0,a.length)===a;};String.prototype.endsWith=function(a){return this.substr(this.length-a.length)===a;};
  try {
    const {pdfText}=await import('../core/extract/pdf.mjs'),{visibleText}=await import('../core/remove.mjs');
    assert.match(pdfText(new Uint8Array(pdf)),/Routing number: 021000021/);
    assert.equal(visibleText('<div>A</div><!-- note --><div>B</div>'),'\nA\n\nB\n');
  } finally { String.prototype.startsWith=native;String.prototype.endsWith=nativeEnds; }
});
