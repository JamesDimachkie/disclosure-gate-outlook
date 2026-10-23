// Named groups and group positions for engines without them (classic Outlook before ES2018). Each
// build-converted pattern comes in two forms: `plain` (named groups renumbered) does the searching,
// at native speed; `marked` adds, after each named group, a zero-width capture of the rest of the
// text, which gives the group's end. The marked form runs only once a match is found, and only on a
// window around it: one character before (so \b at the start sees the same neighbour) and the match
// plus TAIL characters after (room for the patterns' bounded lookaheads). So its cost is per match
// and bounded, never the length of the whole text. If the window ever gives a different match, the
// check fails closed.
const TAIL = 2000;
export function indexedPattern(key, table) {
  const spec=table[key];
  if(!spec) throw new Error('Rebuild the runtime after changing a pattern.');
  const re=new RegExp(spec.plain.source,spec.flags), nativeExec=re.exec;
  const marked=new RegExp(spec.marked.source,spec.flags.replace('g','')+'y');
  re.exec=function(text) {
    const m=nativeExec.call(this,text);
    if(!m) return m;
    const from=Math.max(0,m.index-1), window=text.slice(from,m.index+m[0].length+TAIL);
    marked.lastIndex=m.index-from;
    const mm=marked.exec(window);
    if(!mm || mm[0]!==m[0]) throw new Error('Converted pattern disagrees with itself.');
    m.groups={};m.indices=[[m.index,m.index+m[0].length]];m.indices.groups={};
    for(const name of Object.keys(spec.plain.groups)) {
      const value=mm[spec.marked.groups[name]], rest=mm[spec.marked.groups['__dg_end_'+name]];
      m.groups[name]=value;
      if(value!==undefined) { const end=from+window.length-rest.length; m.indices.groups[name]=[end-value.length,end]; }
    }
    return m;
  };
  return re;
}
