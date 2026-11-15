// Screenshot of the live Home Assistant panel (headless Chrome driven over CDP).
// Usage: node scripts/shot_live.mjs [--out <dir>] [--step <mode>] <name>
// Needs HA_URL and HA_TOKEN in the environment (never printed).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { findChrome } from './shot.mjs';

const args = process.argv.slice(2);
let out = '.superpowers/shots', step = null, name = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') out = args[++i];
  else if (args[i] === '--step') step = args[++i];
  else name = args[i];
}
const url = (process.env.HA_URL ?? '').replace(/\/+$/, ''), token = process.env.HA_TOKEN;
if (!name || !url || !token) {
  throw new Error('Usage: node scripts/shot_live.mjs [--out <dir>] [--step <mode>] <name>, with HA_URL and HA_TOKEN set');
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), 'ps-live-'));
const chrome = spawn(findChrome(), [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', `--user-data-dir=${profile}`,
  '--remote-debugging-port=0', '--window-size=1500,950', 'about:blank',
], { stdio: 'ignore' });
let ws;
try {
  const portFile = join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await sleep(100);
  const [port] = readFileSync(portFile, 'utf8').trim().split('\n');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const page = targets.find(t => t.type === 'page');
  ws = new WebSocket(`ws://127.0.0.1:${port}${new URL(page.webSocketDebuggerUrl).pathname}`);
  await new Promise((ok, bad) => { ws.onopen = ok; ws.onerror = bad; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    const p = m.id && pending.get(m.id);
    if (p) { pending.delete(m.id); if (m.error) p.bad(new Error(m.error.message)); else p.ok(m.result); }
  };
  const send = (method, params = {}) => new Promise((ok, bad) => {
    pending.set(++id, { ok, bad });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expr => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error('page script failed');
    return r.result.value;
  };

  await send('Page.enable');
  await send('Page.navigate', { url });
  await sleep(1500);
  const tokens = {
    access_token: token, token_type: 'Bearer', expires_in: 1800, hassUrl: url, clientId: `${url}/`,
    expires: Date.now() + 3.6e9, refresh_token: '',
  };
  await evaluate(`localStorage.setItem('hassTokens', ${JSON.stringify(JSON.stringify(tokens))}); true`);
  await send('Page.navigate', { url: `${url}/plan-studio` });

  const finder = `(() => {
    const find = root => {
      for (const el of root.querySelectorAll('*')) {
        if (el.localName === 'plan-studio-panel') return el;
        if (el.shadowRoot) { const f = find(el.shadowRoot); if (f) return f; }
      }
      return null;
    };
    return find(document);
  })()`;
  let ready = false;
  for (let i = 0; i < 60 && !ready; i++) {
    await sleep(500);
    try { ready = await evaluate(`(() => { const p = ${finder}; return !!(p && p.plan); })()`); } catch { /* page still navigating */ }
  }
  if (!ready) throw new Error('plan-studio-panel with a loaded plan not found within 30 s');
  if (step) await evaluate(`(() => { ${finder}.setMode(${JSON.stringify(step)}); return true; })()`);
  await sleep(1500);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  mkdirSync(out, { recursive: true });
  const file = resolve(out, `${name}.png`);
  writeFileSync(file, Buffer.from(shot.data, 'base64'));
  console.log(file);
} finally {
  try { ws?.close(); } catch { /* ignore */ }
  chrome.kill();
  await sleep(500);
  rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
}
process.exit(0);
