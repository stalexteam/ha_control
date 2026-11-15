// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { html, render } from 'lit';
import { renderLevel } from '../../src/render/plan-svg';
import { paletteFor } from '../../src/render/theme';
import { renderDevices, ICON_PX } from '../../src/render/devices-svg';
import { deviceDefaults, type Device, type DeviceKind, type Level } from '../../src/model/types';
import { rectRoomLevel } from '../fixtures';

const free = (id: string, kind: DeviceKind, x: number, y: number, over: Partial<Device['props']> = {}, invalid = false): Device =>
  ({ id, name: id, invalid, placement: { mode: 'free', x, y, rotation: 0 }, props: { ...deviceDefaults(kind, 'free'), ...over } as Device['props'] });

function levelWithAll(): Level {
  const box = rectRoomLevel(6000, 5000, 200);
  const devices: Device[] = [
    free('cl', 'ceiling_light', 1000, 1000, { poolRadius: 800 }),
    { id: 'wl', name: 'wl', invalid: false, props: deviceDefaults('wall_light', 'wall'),
      placement: { mode: 'wall', wallId: 'w0', side: 'right', offset: 3000 } },
    free('ms', 'motion_sensor', 3000, 2500),
    free('il', 'illuminance_sensor', 4000, 1000),
    { id: 'sw', name: 'sw', invalid: false, props: deviceDefaults('switch', 'wall'),
      placement: { mode: 'wall', wallId: 'w0', side: 'right', offset: 500 } },
    { id: 'so', name: 'so', invalid: true, props: deviceDefaults('socket', 'wall'),
      placement: { mode: 'wall', wallId: 'w0', side: 'right', offset: 5000 } },
    free('eq', 'equipment', 2000, 3500, { label: 'Boiler X', icon: 'mdi:water-boiler' }),
  ];
  return { ...box, devices };
}

type DevOpts = Parameters<typeof renderDevices>[1];
const base = { palette: paletteFor(true), selection: null, showCones: true, dim: false };

function mount(content: unknown): SVGSVGElement {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(html`<svg xmlns="http://www.w3.org/2000/svg">${content}</svg>`, host);
  return host.querySelector('svg')!;
}
const drawDevs = (level: Level, o: Partial<DevOpts> = {}, scale = 0.1) =>
  mount(renderDevices(level, { ...base, scale, ...o } as DevOpts));
const drawLevel = (level: Level, o: Record<string, unknown> = {}, scale = 0.1) =>
  mount(renderLevel(level, { palette: paletteFor(true), selection: null, preview: {}, scale, ...o }));

describe('renderDevices', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('draws one group per device kind', () => {
    const root = drawDevs(levelWithAll());
    expect(root.querySelectorAll('g.device').length).toBe(7);
    for (const k of ['ceiling_light', 'wall_light', 'motion_sensor', 'illuminance_sensor', 'switch', 'socket', 'equipment']) {
      expect(root.querySelectorAll(`g.device-${k}`).length).toBe(1);
    }
  });

  it('cones only when showCones; pool for ceiling light, cone for wall light and motion sensor', () => {
    expect(drawDevs(levelWithAll(), { showCones: false }).querySelectorAll('.cone, .pool').length).toBe(0);
    const root = drawDevs(levelWithAll(), { showCones: true });
    expect(root.querySelectorAll('.cone').length).toBe(2);
    expect(root.querySelectorAll('.pool').length).toBe(1);
    expect(root.querySelector('.cone')!.getAttribute('fill-rule')).toBe('evenodd');
  });

  it('equipment has label and reserved data group', () => {
    const eq = drawDevs(levelWithAll()).querySelector('g.device-equipment')!;
    expect(eq.querySelector('.equipment-label')!.textContent).toBe('Boiler X');
    expect(eq.querySelector('.equipment-data')).not.toBeNull();
    expect(eq.textContent).toContain('B');
  });

  it('icon radius is ICON_PX / scale', () => {
    expect(ICON_PX).toBe(12);
    const r = (s: number) => Number(drawDevs(levelWithAll(), {}, s).querySelector('g.device-ceiling_light circle.icon')!.getAttribute('r'));
    expect(r(1)).toBe(12);
    expect(r(0.01)).toBe(1200);
  });

  it('invalid and selected classes', () => {
    const root = drawDevs(levelWithAll(), { selection: { kind: 'device', id: 'ms' } });
    expect(root.querySelector('g.device-socket')!.classList.contains('invalid')).toBe(true);
    expect(root.querySelector('g.device-motion_sensor')!.classList.contains('selected')).toBe(true);
    expect(root.querySelector('g.device-switch')!.classList.contains('selected')).toBe(false);
  });

  it('dim sets opacity on device groups', () => {
    const g = drawDevs(levelWithAll(), { dim: true }).querySelector('g.device')!;
    expect(Number(g.getAttribute('opacity'))).toBeLessThan(1);
    expect(drawDevs(levelWithAll(), { dim: false }).querySelector('g.device')!.getAttribute('opacity')).toBeNull();
  });

  it('draws the placement preview at half opacity, invalid flagged', () => {
    const lv = rectRoomLevel(6000, 5000, 200);
    const pv = { placement: { mode: 'free' as const, x: 1000, y: 1000, rotation: 0 }, props: deviceDefaults('ceiling_light', 'free'), invalid: true };
    const g = drawDevs(lv, { preview: pv }).querySelector('g.device-preview')!;
    expect(g.getAttribute('opacity')).toBe('0.5');
    expect(g.classList.contains('invalid')).toBe(true);
  });
});

describe('renderLevel modes', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('equipment mode dims walls, plan mode dims devices', () => {
    const lv = levelWithAll();
    const eq = drawLevel(lv, { mode: 'equipment' });
    expect(Number(eq.querySelector('path.walls')!.getAttribute('opacity'))).toBeLessThan(1);
    expect(eq.querySelector('g.device')!.getAttribute('opacity')).toBeNull();
    const plan = drawLevel(lv, { mode: 'plan' });
    expect(plan.querySelector('path.walls')!.getAttribute('opacity')).toBeNull();
    expect(Number(plan.querySelector('g.device')!.getAttribute('opacity'))).toBeLessThan(1);
    expect(drawLevel(lv).querySelector('g.device')!.getAttribute('opacity')).not.toBeNull();
  });

  it('showCones false hides cones in renderLevel', () => {
    expect(drawLevel(levelWithAll(), { showCones: false }).querySelectorAll('.cone').length).toBe(0);
    expect(drawLevel(levelWithAll()).querySelectorAll('.cone').length).toBe(2);
  });
});

describe('wall break symbol', () => {
  beforeEach(() => { document.body.innerHTML = ''; });
  const single = (): Level => ({
    ...rectRoomLevel(1, 1, 200), nodes: [{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 3000, y: 0 }],
    walls: [{ id: 'w', a: 'a', b: 'b', thickness: 200, type: 'partition', baseline: 'center' }],
  });

  it('single wall: 2 free ends; closed box: 0', () => {
    expect(drawLevel(single()).querySelectorAll('.wall-break').length).toBe(2);
    expect(drawLevel(rectRoomLevel(4000, 3000, 400)).querySelectorAll('.wall-break').length).toBe(0);
  });

  it('partition with T-node end and free end: 1; in both modes', () => {
    const box = rectRoomLevel(4000, 3000, 400);
    const lv: Level = {
      ...box,
      nodes: [...box.nodes, { id: 'f', x: 2000, y: 1500 }, { id: 't', x: 2000, y: 0, host: { wallId: 'w0', offset: 2000 } }],
      walls: [...box.walls, { id: 'p', a: 't', b: 'f', thickness: 100, type: 'partition', baseline: 'center' }],
    };
    expect(drawLevel(lv, { mode: 'plan' }).querySelectorAll('.wall-break').length).toBe(1);
    expect(drawLevel(lv, { mode: 'equipment' }).querySelectorAll('.wall-break').length).toBe(1);
  });
});

describe('direction handle rendering', () => {
  const sel = (id: string) => ({ kind: 'device' as const, id });
  it('selected motion sensor draws an aim handle and knob', () => {
    const svg = drawDevs(levelWithAll(), { selection: sel('ms') });
    expect(svg.querySelectorAll('.aim-handle')).toHaveLength(1);
    expect(svg.querySelectorAll('.aim-knob')).toHaveLength(1);
  });
  it('selected switch and unselected devices draw none', () => {
    expect(drawDevs(levelWithAll(), { selection: sel('sw') }).querySelector('.aim-handle')).toBeNull();
    expect(drawDevs(levelWithAll()).querySelector('.aim-handle')).toBeNull();
    expect(drawDevs(levelWithAll()).querySelector('.aim-knob')).toBeNull();
  });
});

describe('climate sensor and fan render', () => {
  beforeEach(() => { document.body.innerHTML = ''; });
  it('one g.device each with own class; selected fan has no aim handle', () => {
    const box = rectRoomLevel(6000, 5000, 200);
    const devices: Device[] = [
      free('cs', 'climate_sensor', 2000, 2000),
      { id: 'fan', name: 'fan', invalid: false, props: deviceDefaults('exhaust_fan', 'wall'),
        placement: { mode: 'wall', wallId: 'w0', side: 'right', offset: 3000 } },
    ];
    const root = drawDevs({ ...box, devices }, { selection: { kind: 'device', id: 'fan' } });
    expect(root.querySelectorAll('g.device')).toHaveLength(2);
    expect(root.querySelectorAll('g.device-climate_sensor')).toHaveLength(1);
    expect(root.querySelectorAll('g.device-exhaust_fan')).toHaveLength(1);
    expect(root.querySelector('.aim-handle')).toBeNull();
  });
});
