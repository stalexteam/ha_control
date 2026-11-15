// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import { renderEquipmentProps } from '../../src/panel/device-props';
import { addBox } from '../../src/model/ops';
import { addZone } from '../../src/model/zones';
import { addDevice } from '../../src/model/devices';
import { deviceDefaults } from '../../src/model/types';
import { initialNextProps as initialNext } from '../../src/panel/device-props';
import type { Level } from '../../src/model/types';

const bp = { type: 'partition', thickness: 100, baseline: 'center' } as const;
const empty = (): Level => ({ id: 'l0', name: 'L', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] });

function twoRooms(): { level: Level; dev: string } {
  let l = addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 3000 }, bp, 'axis');
  l = addBox(l, { x: 5000, y: 0 }, { x: 8000, y: 3000 }, bp, 'axis');
  const a = addZone(l, { x: 1500, y: 1500 }, 'A');
  const b = addZone(a.level, { x: 6500, y: 1500 }, 'B');
  const d = addDevice(b.level, deviceDefaults('climate_sensor', 'free'), { mode: 'free', x: 1000, y: 1000, rotation: 0 }, 'C');
  return { level: d.level, dev: d.deviceId! };
}

function mountProps(level: Level, id: string, commits: Level[]): HTMLElement {
  const host = document.createElement('div');
  render(renderEquipmentProps({
    level, selection: { kind: 'device', id }, toolId: 'device-select', nextProps: initialNext(), notice: null,
    commit: n => commits.push(n), setNextProps: () => {}, setNotice: () => {},
  }), host);
  return host;
}

describe('climate sensor props', () => {
  it('has no room fieldset (zoneIds is retired)', () => {
    const { level, dev } = twoRooms();
    const host = mountProps(level, dev, []);
    expect(host.querySelector('[data-field="zoneIds"]')).toBeNull();
    expect(host.querySelector('fieldset.zones')).toBeNull();
    expect(host.querySelector('[data-field="aim"]')).toBeNull();
  });
});

describe('exhaust fan props', () => {
  it('ceiling light: Diameter field for round, none for spot and linear', () => {
    const l = addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 3000 }, bp, 'axis');
    const field = (shape: string) => {
      const d = addDevice(l, { ...deviceDefaults('ceiling_light', 'free'), shape } as never, { mode: 'free', x: 1000, y: 1000, rotation: 0 }, 'L');
      return mountProps(d.level, d.deviceId!, []).querySelector('[data-field="diameter"]');
    };
    expect(field('round')).not.toBeNull();
    expect(field('spot')).toBeNull();
    expect(field('linear')).toBeNull();
  });

  it('diameter select 100 -> 125 stored, no aim field, unchanged is a no-op', () => {
    const l = addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 3000 }, bp, 'axis');
    const w = l.walls[0].id;
    const d = addDevice(l, deviceDefaults('exhaust_fan', 'wall'), { mode: 'wall', wallId: w, side: 'right', offset: 1000 }, 'F');
    const commits: Level[] = [];
    const host = mountProps(d.level, d.deviceId!, commits);
    expect(host.querySelector('[data-field="aim"]')).toBeNull();
    const sel = host.querySelector<HTMLSelectElement>('select[data-field="diameter"]')!;
    sel.value = '100'; sel.dispatchEvent(new Event('change'));
    expect(commits).toHaveLength(0);
    sel.value = '125'; sel.dispatchEvent(new Event('change'));
    expect(commits[0].devices[0].props).toEqual({ kind: 'exhaust_fan', diameter: 125 });
  });
});
