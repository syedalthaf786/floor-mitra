import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => readFileSync(join(root, name), 'utf8');

test('page loads its separated CSS, Supabase CDN, and JavaScript bundle', () => {
  const html = read('index.html');
  assert.match(html, /href="style\.css"/);
  assert.match(html, /@supabase\/supabase-js@2/);
  assert.match(html, /src="javascript\.js"/);
  assert.ok(html.indexOf('@supabase/supabase-js@2') < html.indexOf('javascript.js'));
});

test('page loads a Supabase client shim before the app bundle', () => {
  const html = read('index.html');
  assert.match(html, /supabase-client-shim\.js/);
  assert.ok(html.indexOf('supabase-client-shim.js') < html.indexOf('javascript.js'));
});

test('Supabase shim uses the loaded SDK instead of a stubbed client', () => {
  const shim = read('supabase-client-shim.js');
  assert.match(shim, /createClient: function \(\) \{/);
  assert.match(shim, /window\.__FLOORMITRA_SUPABASE_CLIENT = sdk/);
  assert.doesNotMatch(shim, /from\(table\) \{/);
});

test('application source has no browser-storage persistence', () => {
  const app = `${read('index.html')}\n${read('style.css')}\n${read('javascript.js')}`;
  assert.doesNotMatch(app, /localStorage|sessionStorage|indexedDB/i);
});

test('Supabase persistence bridge is configured', () => {
  const app = read('javascript.js');
  assert.match(app, /https:\/\/qpsglpeuuvimtvyljtma\.supabase\.co/);
  assert.match(app, /createClient/);
  assert.match(app, /app_state/);
  assert.match(app, /persistSession:!1/);
});

test('database setup creates a protected app_state table', () => {
  const sql = read('supabase-setup.sql');
  assert.match(sql, /create table if not exists public\.app_state/i);
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /create policy/i);
});

test('JavaScript bundle has valid syntax', () => {
  execFileSync(process.execPath, ['--check', join(root, 'javascript.js')], { stdio: 'pipe' });
});
