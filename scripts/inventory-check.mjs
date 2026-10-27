#!/usr/bin/env node
// inventory-check.mjs: prove the docs cover every Software Factory feature.
//
// 1. Every atom in inventory/atoms.json matches at least one feature in
//    inventory/features.mjs. An unmatched atom is a feature nobody has listed.
// 2. Every feature that is drafted or verified has its page on disk.
// 3. Every user-facing atom of a drafted or verified feature (a setting key, an
//    error code, an enum value, a route, a flag, a slash command, a voice tool,
//    a template, a default, a console route) is named on that feature's page.
//    Routes, flags, Belai config keys and templates may instead be named only
//    on the generated reference pages (REF_KINDS), and a feature can list
//    atoms it leaves to the reference pages in `refOnly` (patterns).
//
// Flags:
//   --strict           exit 1 on any gap (CI uses this)
//   --coverage FILE    write the coverage table as Markdown
//   --unmatched        print every unmatched atom id, one per line

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const coverageOut = args.includes('--coverage') ? args[args.indexOf('--coverage') + 1] : null;

const { atoms, repos } = JSON.parse(readFileSync(join(root, 'inventory', 'atoms.json'), 'utf8'));
const features = (await import(join(root, 'inventory', 'features.mjs'))).default;

const pagePath = (page) => join(root, 'src', 'content', 'docs', `${page}.md`);
const USER_FACING = new Set(['setting', 'code', 'enum', 'route', 'cli-flag', 'cli-sub', 'cli-cmd', 'tui-cmd', 'voice-tool', 'template', 'default', 'console', 'belai-config']);
// Generated reference pages list whole atom kinds. For the kinds in REF_KINDS
// (long lists a guide should summarise, not repeat) an atom named there counts
// as documented; every other user-facing atom must be on its guide page.
const REF_KINDS = new Set(['route', 'cli-flag', 'belai-config', 'template']);
const REFERENCE_PAGES = ['reference/settings', 'reference/validation-codes', 'reference/enums', 'reference/http-api', 'reference/console-routes', 'reference/templates', 'reference/voice-tools', 'belai/cli-reference', 'belai/tui-commands', 'belai/settings-file'];

const problems = [];
const ids = new Set();
for (const ft of features) {
  if (ids.has(ft.id)) problems.push(`duplicate feature id ${ft.id}`);
  ids.add(ft.id);
  ft._re = ft.match.map((p) => new RegExp(p));
  ft._atoms = [];
  ft._refOnly = (ft.refOnly ?? []).map((p) => new RegExp(p));
}

const unmatched = [];
for (const a of atoms) {
  let hit = false;
  for (const ft of features) {
    if (ft._re.some((re) => re.test(a.id))) { ft._atoms.push(a); hit = true; }
  }
  if (!hit) unmatched.push(a);
}

const pageText = new Map();
const textOf = (page) => {
  if (!pageText.has(page)) pageText.set(page, existsSync(pagePath(page)) ? readFileSync(pagePath(page), 'utf8') : null);
  return pageText.get(page);
};
const refText = () => REFERENCE_PAGES.map(textOf).filter(Boolean).join('\n');

// The text that must appear on a page for an atom to count as named there.
function needle(a) {
  switch (a.kind) {
    case 'enum': return a.value.split('=')[1];
    case 'route': return a.value.split(' ')[1].replace(/^\/v1/, '');
    case 'cli-flag': return `-${a.value.split(' -')[1]}`;
    case 'cli-sub': return a.value.split(' ').slice(-1)[0];
    case 'belai-config': return a.value.split('.').slice(1).join('.');
    default: return a.value;
  }
}

const missing = [];
for (const ft of features) {
  if (ft.status === 'todo' || ft.status === 'n/a') continue;
  const text = textOf(ft.page);
  if (text == null) { problems.push(`${ft.id}: status ${ft.status} but ${ft.page}.md does not exist`); continue; }
  const ref = refText();
  for (const a of ft._atoms) {
    if (!USER_FACING.has(a.kind)) continue;
    const n = needle(a);
    if (text.includes(n)) continue;
    if ((REF_KINDS.has(a.kind) || ft._refOnly.some((re) => re.test(a.id))) && ref.includes(n)) continue;
    missing.push(`${ft.id} (${ft.page}): ${a.id}`);
  }
}

const byStatus = {};
const byArea = {};
for (const ft of features) {
  byStatus[ft.status] = (byStatus[ft.status] ?? 0) + 1;
  byArea[ft.area] ??= { todo: 0, drafted: 0, verified: 0, 'n/a': 0 };
  byArea[ft.area][ft.status]++;
}

console.log(`${atoms.length} atoms, ${features.length} features: ${Object.entries(byStatus).map(([k, v]) => `${v} ${k}`).join(', ')}`);
if (unmatched.length) {
  const kinds = {};
  for (const a of unmatched) kinds[a.kind] = (kinds[a.kind] ?? 0) + 1;
  console.log(`${unmatched.length} unmatched atoms: ${Object.entries(kinds).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  if (args.includes('--unmatched')) for (const a of unmatched) console.log(`  ${a.id}   ${a.sources[0]}`);
}
if (missing.length) {
  console.log(`${missing.length} atoms not named on their page:`);
  for (const m of missing.slice(0, 200)) console.log(`  ${m}`);
}
for (const p of problems) console.log(`problem: ${p}`);

if (coverageOut) {
  const lines = [
    '# Coverage',
    '',
    'Generated by `node scripts/inventory-check.mjs --coverage COVERAGE.md`. Do not edit by hand.',
    '',
    `Scanned ${atoms.length} atoms from ${Object.entries(repos).map(([r, s]) => `${r}@${(s ?? 'unknown').slice(0, 7)}`).join(', ')}.`,
    '',
    `${features.length} features: ${Object.entries(byStatus).map(([k, v]) => `${v} ${k}`).join(', ')}. ${unmatched.length} atoms are not mapped to any feature.`,
    '',
    '| Area | Todo | Drafted | Verified | n/a |',
    '|---|---|---|---|---|',
    ...Object.entries(byArea).map(([a, s]) => `| ${a} | ${s.todo} | ${s.drafted} | ${s.verified} | ${s['n/a']} |`),
    '',
    '## Features',
    '',
    '| Feature | Area | Page | Status | Atoms |',
    '|---|---|---|---|---|',
    ...features.map((ft) => `| ${ft.title} | ${ft.area} | \`${ft.page}\` | ${ft.status} | ${ft._atoms.length} |`),
    '',
  ];
  writeFileSync(coverageOut, lines.join('\n'));
}

const failed = unmatched.length > 0 || missing.length > 0 || problems.length > 0;
if (failed && strict) process.exit(1);
