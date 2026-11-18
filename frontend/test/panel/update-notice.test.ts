// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { HassLike } from '../../src/api';
import { createMockHass } from '../../dev/mock-hass';
import { UpdateCheck } from '../../src/live/update-check';
import { $, mount } from './helpers';

declare const __PLAN_STUDIO_VERSION__: string;

type Listener = () => void;

/** A mock hass whose `plan_studio/info` answers `server.version` (or fails while `server.fail`); `ready` is fired by `reconnect`. */
function infoHass(server: { version: string; fail?: boolean }) {
  const base = createMockHass();
  const listeners: Listener[] = [];
  let asked = 0;
  const hass: HassLike = {
    ...base,
    connection: {
      ...base.connection,
      async sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> {
        if (msg.type !== 'plan_studio/info') return base.connection.sendMessagePromise<T>(msg);
        asked++;
        if (server.fail) throw { code: 'unknown_command', message: 'Unknown command' };
        return { version: server.version } as T;
      },
      addEventListener(type, cb) { if (type === 'ready') listeners.push(cb); },
      removeEventListener(type, cb) { if (type === 'ready') listeners.splice(listeners.indexOf(cb), 1); },
    },
  };
  return { hass, asked: () => asked, reconnect: () => listeners.slice().forEach(l => l()), listeners };
}

const bar = (el: HTMLElement) => el.shadowRoot!.querySelector('.update-bar');

afterEach(() => { document.body.innerHTML = ''; });

describe('reload notice', () => {
  it('shows nothing while the server runs the bundle version', async () => {
    const h = infoHass({ version: __PLAN_STUDIO_VERSION__ });
    const el = await mount(h.hass);
    await vi.waitFor(() => expect(h.asked()).toBe(1));
    await el.updateComplete;
    expect(bar(el)).toBeNull();
  });

  it('shows the server version and a Reload button that calls the reload function', async () => {
    const h = infoHass({ version: '99.0.1' });
    const el = await mount(h.hass);
    const reload = vi.fn();
    el.reloadPage = reload;
    await vi.waitFor(() => expect(bar(el)).not.toBeNull());
    expect(bar(el)!.textContent).toContain('Plan Studio was updated on the server (99.0.1). Reload the page to use it.');
    expect($<HTMLButtonElement>(el, '.update-bar button').textContent!.trim()).toBe('Reload');
    $<HTMLButtonElement>(el, '.update-bar button').click();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('shows nothing when the command is unknown (an old server)', async () => {
    const h = infoHass({ version: 'x', fail: true });
    const el = await mount(h.hass);
    await vi.waitFor(() => expect(h.asked()).toBe(1));
    await el.updateComplete;
    expect(bar(el)).toBeNull();
  });

  it('asks again after a reconnect and shows the notice when the version changed meanwhile', async () => {
    const server = { version: __PLAN_STUDIO_VERSION__ };
    const h = infoHass(server);
    const el = await mount(h.hass);
    await vi.waitFor(() => expect(h.asked()).toBe(1));
    expect(bar(el)).toBeNull();
    server.version = '99.0.2';
    h.reconnect();
    await vi.waitFor(() => expect(bar(el)).not.toBeNull());
    expect(h.asked()).toBe(2);
    expect(bar(el)!.textContent).toContain('(99.0.2)');
    el.remove();
    expect(h.listeners).toHaveLength(0);
  });
});

describe('UpdateCheck', () => {
  it('keeps the notice once seen, even when a later answer equals the bundle version', async () => {
    const server = { version: '2.0.0' };
    const h = infoHass(server);
    const changes = vi.fn();
    const check = new UpdateCheck(() => h.hass.connection, '1.0.0', changes);
    check.watch();
    await vi.waitFor(() => expect(check.serverVersion).toBe('2.0.0'));
    server.version = '1.0.0';
    h.reconnect();
    await vi.waitFor(() => expect(h.asked()).toBe(2));
    expect(check.serverVersion).toBe('2.0.0');
    expect(changes).toHaveBeenCalledTimes(1);
  });
});
