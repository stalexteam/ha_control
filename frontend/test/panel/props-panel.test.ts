// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { applyOpeningPatch, kindPatch } from '../../src/panel/props-panel';
import { addOpening } from '../../src/model/openings';
import { initialNext } from '../../src/panel/next-object';
import { rectRoomLevel } from '../fixtures';

describe('opening kind switch', () => {
  it('door -> window drops hinge/swing and sets outside; window -> door restores hinge/swing', () => {
    const r = addOpening(rectRoomLevel(4000, 3000, 400), 'w0', 'door', 2000);
    const id = r.openingId!;
    const win = applyOpeningPatch(r.level, id, kindPatch(r.level.openings[0], 'window'));
    const w = win.openings[0];
    expect(w.kind).toBe('window');
    expect(w.outside).toBe('left');
    expect('hinge' in w || 'swing' in w).toBe(false);
    const door = applyOpeningPatch(win, id, kindPatch(w, 'door'));
    const d = door.openings[0];
    expect(d).toMatchObject({ kind: 'door', hinge: 'start', swing: 'left' });
    expect('outside' in d).toBe(false);
    const gap = applyOpeningPatch(door, id, kindPatch(d, 'opening')).openings[0];
    expect(['hinge', 'swing', 'outside'].some(k => k in gap)).toBe(false);
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
      commit: (n: unknown) => commits.push(n), remove: () => {}, setBoxMeasure: () => {}, setWallType: () => {}, setThickness: () => {}, next: initialNext(), setNext: () => {},
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
