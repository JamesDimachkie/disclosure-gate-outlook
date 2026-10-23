// Every regex that reads named groups or match positions (indices) is made here. Modern engines build
// it directly. Classic Outlook's event runtime is ES2016, which has neither, so tools/build.mjs swaps
// this module for one that uses the same patterns converted at build time, looked up by flags and
// source. `made` records each pattern for that table, so patterns must be created at module load,
// never per call (test/handler.test.mjs fails the bundle otherwise).
export const made = new Map();

export function indexed(source, flags) {
  made.set(flags + '/' + source, { source, flags });
  return new RegExp(source, flags.includes('d') ? flags : flags + 'd');
}
