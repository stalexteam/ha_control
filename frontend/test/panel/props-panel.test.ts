// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { addOpening } from '../../src/model/openings';
import { initialNext } from '../../src/panel/next-object';
import { rectRoomLevel } from '../fixtures';
import type { Level } from '../../src/model/types';

describe('opening kind field', () => {
  it('switching a door to a window commits the model kind patch (hinge/swing dropped, outside set)', async () => {
    const { render } = await import('lit');
    const { renderProps } = await import('../../src/panel/props-panel');
    const host = document.createElement('div');
    const r = addOpening(rectRoomLevel(4000, 3000, 400), 'w0', 'door', 2000);
    const commits: Level[] = [];
    render(renderProps({
      level: r.level, selection: { kind: 'opening', id: r.openingId! }, tool: 'select',
      boxMeasure: 'inner', wallType: 'bearing', thickness: 400, notice: null,
      commit: n => commits.push(n), setBoxMeasure: () => {}, setWallType: () => {}, setThickness: () => {},
      next: initialNext(), setNext: () => {}, setNotice: () => {},
    }), host);
    const kind = host.querySelector('select') as HTMLSelectElement;
    kind.value = 'window';
    kind.dispatchEvent(new Event('change'));
    expect(commits).toHaveLength(1);
    const w = commits[0].openings[0];
    expect(w).toMatchObject({ kind: 'window', outside: 'left' });
    expect('hinge' in w || 'swing' in w).toBe(false);
  });
});

describe('opening width field', () => {
  it('rejects a width that does not fit the wall like the offset field does', async () => {
    const { render } = await import('lit');
    const { renderProps } = await import('../../src/panel/props-panel');
    const host = document.createElement('div');
    const r = addOpening(rectRoomLevel(4000, 3000, 400), 'w0', 'door', 2000);
    const commits: unknown[] = [];
    let notice: string | null = null;
    const opts = {
      level: r.level, selection: { kind: 'opening' as const, id: r.openingId! }, tool: 'select' as const,
      boxMeasure: 'inner' as const, wallType: 'bearing' as const, thickness: 400, notice: null,
      commit: (n: unknown) => commits.push(n), setBoxMeasure: () => {}, setWallType: () => {}, setThickness: () => {}, next: initialNext(), setNext: () => {},
      setNotice: (m: string | null) => { notice = m; },
    };
    render(renderProps(opts), host);
    const width = host.querySelectorAll('input')[0] as HTMLInputElement;
    expect(width.value).toBe('900');
    width.value = '9000';
    width.dispatchEvent(new Event('change'));
    expect(commits).toHaveLength(0);
    expect(notice).toBe('Does not fit the wall at this position');
    expect(width.value).toBe('900');
    width.value = '1000';
    width.dispatchEvent(new Event('change'));
    expect(commits).toHaveLength(1);
    expect(notice).toBeNull();
  });
});

describe('aim field', () => {
  it('entering 0 over aim 30 stores no aim key', async () => {
    const { render } = await import('lit');
    const { renderDeviceProps } = await import('../../src/panel/device-props');
    const { addBox } = await import('../../src/model/ops');
    const { addDevice } = await import('../../src/model/devices');
    const { deviceDefaults } = await import('../../src/model/types');
    const base = addBox(rectRoomLevel(4000, 3000, 400), { x: 0, y: 0 }, { x: 3000, y: 4000 }, { type: 'partition', thickness: 100, baseline: 'center' }, 'axis');
    const pl = { mode: 'wall' as const, wallId: base.walls[0].id, side: 'right' as const, offset: 1500, aim: 30 };
    const dev = addDevice(base, deviceDefaults('motion_sensor', 'wall'), pl, 'D').level.devices[0];
    const got: Record<string, unknown>[] = [];
    const host = document.createElement('div');
    render(renderDeviceProps({
      device: dev, nextKind: null, nextProps: null, onDevice: () => true,
      onPlacement: p => { got.push(p as never); return true; }, onNext: () => {}, onDelete: () => {},
    }), host);
    const el = host.querySelector('input[data-field="aim"]') as HTMLInputElement;
    el.value = '0'; el.dispatchEvent(new Event('change'));
    expect(got).toHaveLength(1);
    expect('aim' in got[0]).toBe(false);
  });
});

describe('opening Passes light field', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('the Passes light checkbox toggles the opening\'s passesLight and undo restores it', async () => {
    const { mount, undo, $ } = await import('./helpers');
    const el = await mount();
    const r = addOpening(rectRoomLevel(4000, 3000, 400), 'w0', 'door', 2000);
    el.history!.push(r.level);
    el.selection = { kind: 'opening', id: r.openingId! };
    await el.updateComplete;
    const box = () => $<HTMLInputElement>(el, '.props input[data-field="passesLight"]');
    expect(box().type).toBe('checkbox');
    expect(box().checked).toBe(false); // a door blocks light by default
    expect(el.shadowRoot!.querySelector('.props')!.textContent).toContain('Passes light');
    box().checked = true;
    box().dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(el.history!.current.openings[0].passesLight).toBe(true);
    expect(box().checked).toBe(true);
    await undo(el);
    expect('passesLight' in el.history!.current.openings[0]).toBe(false);
  });

  it('an opening is checked by default; unchecking stores false, re-checking drops the key (the default)', async () => {
    const { mount, $ } = await import('./helpers');
    const el = await mount();
    const r = addOpening(rectRoomLevel(4000, 3000, 400), 'w0', 'opening', 2000);
    el.history!.push(r.level);
    el.selection = { kind: 'opening', id: r.openingId! };
    await el.updateComplete;
    const box = () => $<HTMLInputElement>(el, '.props input[data-field="passesLight"]');
    expect(box().checked).toBe(true);
    box().checked = false;
    box().dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(el.history!.current.openings[0].passesLight).toBe(false);
    box().checked = true;
    box().dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect('passesLight' in el.history!.current.openings[0]).toBe(false);
  });
});
