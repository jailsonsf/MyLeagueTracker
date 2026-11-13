import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
const read = (file) => readFile(new URL(file, dist), 'utf8');

const manifest = JSON.parse(await read('manifest.webmanifest'));

assert.equal(manifest.name, 'MyLeagueTracker');
assert.equal(manifest.short_name, 'LeagueTracker');
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.start_url, '/');
assert.equal(manifest.scope, '/');
assert.equal(manifest.lang, 'pt-BR');
assert.equal(manifest.theme_color, '#0e0e0e');
assert.equal(manifest.background_color, '#0e0e0e');

const sizes = new Set((manifest.icons ?? []).map((icon) => icon.sizes));
assert.ok(sizes.has('192x192'), 'manifest must expose a 192px icon');
assert.ok(sizes.has('512x512'), 'manifest must expose a 512px icon');
assert.ok(
  (manifest.icons ?? []).some((icon) => icon.purpose === 'maskable'),
  'manifest must expose a maskable icon',
);

const sw = await read('sw.js');

assert.ok(sw.includes('index.html'), 'the app shell must be precached');
assert.ok(
  sw.includes('denylist') && sw.includes('api') && sw.includes('auth'),
  'API and auth must be excluded from navigation fallback',
);
assert.ok(
  sw.includes('NavigationRoute') || sw.includes('createHandlerBoundToURL'),
  'the service worker must handle client-side navigation offline',
);
assert.ok(!/url:\s*["']\/?api\//.test(sw), 'API responses must not be precached');
assert.ok(/\.woff2/.test(sw), 'web fonts must be precached');

console.log(
  'PWA build verified: manifest, icons, precache, navigation fallback and API denylist.',
);
