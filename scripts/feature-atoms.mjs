#!/usr/bin/env node
// feature-atoms.mjs: print the atoms a feature owns, for writing its page.
// Usage: node scripts/feature-atoms.mjs <feature-id>... [--all]
//   --all   include handler files, packages and docs, not just user-facing atoms
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const { atoms } = JSON.parse(readFileSync(join(root, 'inventory', 'atoms.json'), 'utf8'));
const features = (await import(join(root, 'inventory', 'features.mjs'))).default;
const all = process.argv.includes('--all');
const SOURCE_KINDS = new Set(['gofile', 'tsfile', 'belai-pkg', 'doc', 'model']);
for (const id of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
  const ft = features.find((f) => f.id === id);
  if (!ft) { console.log(`unknown feature ${id}`); continue; }
  const res = ft.match.map((p) => new RegExp(p));
  const mine = atoms.filter((a) => res.some((re) => re.test(a.id)) && (all || !SOURCE_KINDS.has(a.kind)));
  console.log(`\n# ${ft.id} -> ${ft.page} (${ft.status})`);
  for (const a of mine) console.log(`  ${a.id}${a.detail ? '  ' + JSON.stringify(a.detail).slice(0, 160) : ''}`);
  if (!all) console.log(`  sources: ${atoms.filter((a) => res.some((re) => re.test(a.id)) && SOURCE_KINDS.has(a.kind)).map((a) => a.value).join(' ')}`);
}
