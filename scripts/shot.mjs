// Headless Chrome screenshots of the dev harness.
// Usage: node scripts/shot.mjs [--out <dir>] [--size 1500x950] <name>=<query> ...
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const pf = process.env.ProgramFiles ?? 'C:/Program Files';
  const pf86 = process.env['ProgramFiles(x86)'] ?? 'C:/Program Files (x86)';
  const local = process.env.LOCALAPPDATA ?? '';
  const found = [
    `${pf}/Google/Chrome/Application/chrome.exe`, `${pf86}/Google/Chrome/Application/chrome.exe`,
    `${local}/Google/Chrome/Application/chrome.exe`,
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    `${pf86}/Microsoft/Edge/Application/msedge.exe`, `${pf}/Microsoft/Edge/Application/msedge.exe`,
    '/usr/bin/microsoft-edge', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ].find(p => existsSync(p));
  if (!found) throw new Error('No Chrome or Edge found; set CHROME');
  return found;
}

async function main() {
  const args = process.argv.slice(2);
  let out = '.superpowers/shots', size = '1500x950';
  const shots = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out') out = args[++i];
    else if (args[i] === '--size') size = args[++i];
    else {
      const eq = args[i].indexOf('=');
      if (eq < 1) throw new Error(`Expected <name>=<query>, got ${args[i]}`);
      shots.push([args[i].slice(0, eq), args[i].slice(eq + 1)]);
    }
  }
  if (!shots.length) throw new Error('Usage: node scripts/shot.mjs [--out <dir>] [--size WxH] <name>=<query> ...');
  const [w, h] = size.split('x').map(Number);
  if (!(w > 0 && h > 0)) throw new Error(`Bad --size ${size}`);

  const { createServer } = await import('vite');
  const chrome = findChrome();
  mkdirSync(out, { recursive: true });
  const manifest = JSON.parse(readFileSync('custom_components/plan_studio/manifest.json', 'utf-8'));
  const server = await createServer({ root: 'frontend/dev', configFile: false, define: { __PLAN_STUDIO_VERSION__: JSON.stringify(manifest.version) }, logLevel: 'error', server: { port: 0 } });
  let failed = false;
  try {
    await server.listen();
    const base = server.resolvedUrls.local[0];
    for (const [name, query] of shots) {
      const file = resolve(out, `${name}.png`);
      const profile = mkdtempSync(join(tmpdir(), 'ps-shot-'));
      try {
        // Async: spawnSync would block the event loop that serves the Vite dev server.
        const code = await new Promise(done => {
          const c = spawn(chrome, [
            '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', `--user-data-dir=${profile}`,
            `--window-size=${w},${h}`, '--virtual-time-budget=8000', `--screenshot=${file}`, `${base}?${query}`,
          ], { stdio: 'ignore' });
          const timer = setTimeout(() => c.kill(), 60000);
          c.on('exit', n => { clearTimeout(timer); done(n); });
          c.on('error', () => { clearTimeout(timer); done(null); });
        });
        if (!existsSync(file)) { failed = true; console.error(`FAILED ${name} (chrome exit ${code})`); }
        else console.log(file);
      } finally {
        rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
      }
    }
  } finally {
    await server.close();
  }
  process.exit(failed ? 1 : 0);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
