// Bounded RFC 1951 raw inflater. Stored, fixed and dynamic blocks.
// Output limits are checked before allocation/copy; malformed input never returns partial text.
// Codes are decoded through a lookup table indexed by the next bits (a table entry is the symbol and
// its code length), read from a bit buffer a byte at a time.
const LENGTH=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
const LEXTRA=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
const DIST=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
const DEXTRA=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
const BAD=()=>{throw new Error('bad_deflate');};
function tree(lengths) {
  const counts=new Uint16Array(16), next=new Uint16Array(16); let max=0, left=1;
  for(const n of lengths) { if(n>15) BAD(); if(n) { counts[n]++; max=Math.max(max,n); } }
  for(let i=1;i<=15;i++) { left=left*2-counts[i]; if(left<0) BAD(); }
  let code=0;
  for(let i=1;i<=15;i++) { code=(code+counts[i-1])<<1; next[i]=code; }
  const size=1<<max, table=new Int32Array(size).fill(-1);
  for(let s=0;s<lengths.length;s++) {
    const n=lengths[s]; if(!n) continue;
    let c=next[n]++, rev=0; for(let k=0;k<n;k++) { rev=rev<<1|c&1;c>>>=1; }
    for(let j=rev;j<size;j+=1<<n) table[j]=s<<4|n;
  }
  return {table,max};
}
let FIXED=null;
const fixedTrees=()=>FIXED||(FIXED=[tree(Array.from({length:288},(_,i)=>i<144?8:i<256?9:i<280?7:8)), tree(Array(32).fill(5))]);
export const inflateRaw = (data, options) => inflate(data, options).out;
// The decoded bytes and `end`, the offset of the first input byte after the final deflate block.
function inflate(data, {maxOutputLength=10*1024*1024}={}) {
  let pos=0, buf=0, cnt=0, used=0, out=new Uint8Array(Math.min(32768,maxOutputLength));
  const fill=()=>{ while(cnt<=24 && pos<data.length) { buf=(buf|data[pos++]<<cnt)>>>0; cnt+=8; } };
  const bits=n=>{ if(!n) return 0; if(cnt<n) fill(); if(cnt<n) BAD(); const v=buf&((1<<n)-1); buf>>>=n; cnt-=n; return v; };
  const symbol=t=>{ if(cnt<t.max) fill(); const e=t.table[buf&((1<<t.max)-1)]; if(e<0) BAD(); const n=e&15; if(n>cnt) BAD(); buf>>>=n; cnt-=n; return e>>4; };
  const room=n=>{ if(used+n>maxOutputLength) throw new Error('entry_too_large'); if(used+n>out.length) { const bigger=new Uint8Array(Math.min(maxOutputLength,Math.max(used+n,out.length*2)));bigger.set(out);out=bigger; } };
  let last=0;
  while(!last) {
    last=bits(1); const type=bits(2);
    if(type===0) {
      // Back to a byte boundary: drop the partial byte, return whole buffered bytes to the input.
      buf>>>=cnt&7; cnt-=cnt&7; pos-=cnt>>3; buf=0; cnt=0;
      if(pos+4>data.length) BAD();
      const n=data[pos]|data[pos+1]<<8, inv=data[pos+2]|data[pos+3]<<8; pos+=4;
      if((n^inv)!==65535) BAD(); room(n);
      if(pos+n>data.length) BAD(); out.set(data.subarray(pos,pos+n),used); used+=n;pos+=n;continue;
    }
    if(type===3) BAD();
    let lit, dist;
    if(type===1) [lit,dist]=fixedTrees();
    else {
      const nl=bits(5)+257,nd=bits(5)+1,nc=bits(4)+4;
      const perm=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15], cl=Array(19).fill(0);
      for(let i=0;i<nc;i++) cl[perm[i]]=bits(3);
      const ct=tree(cl), lens=[];
      while(lens.length<nl+nd) {
        const s=symbol(ct);
        if(s<16) lens.push(s);
        else { let n,v=0; if(s===16) { if(!lens.length) BAD();n=bits(2)+3;v=lens[lens.length-1]; } else if(s===17) n=bits(3)+3; else if(s===18) n=bits(7)+11; else BAD();
          if(lens.length+n>nl+nd) BAD();while(n--) lens.push(v); }
      }
      if(!lens[256]) BAD();lit=tree(lens.slice(0,nl));dist=tree(lens.slice(nl));
    }
    for(;;) {
      const s=symbol(lit);
      if(s<256) { if(used>=out.length) room(1); out[used++]=s;continue; }
      if(s===256) break;
      if(s>285) BAD();
      const i=s-257,n=LENGTH[i]+bits(LEXTRA[i]), ds=symbol(dist);if(ds>29) BAD();
      const d=DIST[ds]+bits(DEXTRA[ds]);if(d>used) BAD();room(n);
      for(let k=0;k<n;k++) { out[used]=out[used-d];used++; }
    }
  }
  return {out:out.slice(0,used), end:pos-(cnt>>3)};
}
// The Adler-32 checksum follows the deflate data. Only whitespace may follow it: PDF writers end a
// stream with an end-of-line before `endstream`, which is not part of the data (PDF 32000 section 7.3.8.1).
export function inflateZlib(data, options) {
  if(data.length<6 || (data[0]&15)!==8 || data[0]>>>4>7 || (data[0]*256+data[1])%31 || data[1]&32) throw new Error('bad_zlib');
  const {out,end}=inflate(data.subarray(2),options), at=2+end;let a=1,b=0;
  if(at+4>data.length) throw new Error('bad_adler');
  for(let i=at+4;i<data.length;i++) if(![0x0a,0x0d,0x20,0x09,0x0c,0x00].includes(data[i])) throw new Error('bad_adler');
  for(const v of out) { a=(a+v)%65521;b=(b+a)%65521; }
  const expected=(data[at]*0x1000000+(data[at+1]<<16)+(data[at+2]<<8)+data[at+3])>>>0;
  if(((b<<16|a)>>>0) !== expected) throw new Error('bad_adler');
  return out;
}
