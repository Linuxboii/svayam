// node test.cjs — runs the page's own solver (extracted from index.html) and checks its answers independently
const assert = require('node:assert');
const fs = require('node:fs');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const start = html.indexOf('<script id="solver" type="text/plain">') + '<script id="solver" type="text/plain">'.length;
const src = html.slice(start, html.indexOf('</script>', start));
const mod = { exports: {} };
new Function('module', src)(mod); // the solver block exports itself when `module` exists
const { solve, word } = mod.exports;

const A = 'abcdefghijklmnopqrstuvwxyz';
function render(prefix, v) {
  const items = [];
  for (let i = 0; i < 26; i++) if (v[i]) items.push(word(v[i]) + ' ' + A[i] + (v[i] > 1 ? "'s" : ''));
  return `${prefix} ${items.slice(0, -1).join(', ')} and ${items.at(-1)}.`;
}
function isAutogram(prefix, v) {
  const c = new Array(26).fill(0);
  for (const ch of render(prefix, v).toLowerCase()) { const i = A.indexOf(ch); if (i >= 0) c[i]++; }
  return c.every((n, i) => n === v[i]);
}
assert.equal(word(0), 'zero'); assert.equal(word(21), 'twenty-one'); assert.equal(word(99), 'ninety-nine');

for (const prefix of ['This sentence contains', 'In this line you will find', 'This pangram lists']) {
  let hit = null; const t0 = Date.now();
  solve(prefix, true, (m) => { if (m.done) hit = m; }, () => Date.now() - t0 > 120000);
  assert.ok(hit, 'no autogram found for ' + prefix);
  assert.ok(isAutogram(prefix, hit.v), 'solver hit failed the independent recount');
  console.log(`ok (${Date.now() - t0} ms): ${render(prefix, hit.v)}`);
}
