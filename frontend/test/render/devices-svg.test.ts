// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { html, render } from 'lit';
import { renderLevel } from '../../src/render/plan-svg';
import { paletteFor } from '../../src/render/theme';
import { renderDevices, ICON_PX } from '../../src/render/devices-svg';
import { deviceDefaults, type ContainerKind, type Device, type DeviceKind, type Level } from '../../src/model/types';
import type { ContainerState } from '../../src/live/container-feed';
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
    { id: 'sw', name: 'sw', invalid: false, props: deviceDefaults('wall_switch', 'wall'),
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
    for (const k of ['ceiling_light', 'wall_light', 'motion_sensor', 'illuminance_sensor', 'wall_switch', 'socket', 'equipment']) {
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
    expect(root.querySelector('g.device-wall_switch')!.classList.contains('selected')).toBe(false);
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
  it('selected wall switch and unselected devices draw none', () => {
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

describe('input container symbols', () => {
  beforeEach(() => { document.body.innerHTML = ''; });
  it('a wall switch is a square; a smart button is a rounded square with a centre dot', () => {
    const box = rectRoomLevel(6000, 5000, 200);
    const devices: Device[] = [
      { id: 'ws', name: 'ws', invalid: false, props: deviceDefaults('wall_switch', 'wall'),
        placement: { mode: 'wall', wallId: 'w0', side: 'right', offset: 1000 } },
      free('sb', 'smart_button', 2000, 2000),
    ];
    const root = drawDevs({ ...box, devices }, {}, 1); // R = ICON_PX
    const ws = root.querySelector('g.device-wall_switch rect.icon')!;
    expect(ws.hasAttribute('rx')).toBe(false);
    expect(root.querySelector('g.device-wall_switch .dot')).toBeNull();
    const sb = root.querySelector('g.device-smart_button rect.icon')!;
    expect(Number(sb.getAttribute('rx'))).toBeCloseTo(ICON_PX * 0.35);
    expect(Number(root.querySelector('g.device-smart_button circle.dot')!.getAttribute('r'))).toBeCloseTo(ICON_PX * 0.18);
  });
});

describe('container outputs on the plan', () => {
  beforeEach(() => { document.body.innerHTML = ''; });
  const pal = paletteFor(true);
  const containers = (): Level => ({
    ...rectRoomLevel(6000, 5000, 200),
    devices: [
      { id: 'ws', name: 'ws', invalid: false, props: deviceDefaults('wall_switch', 'wall'),
        placement: { mode: 'wall', wallId: 'w0', side: 'right', offset: 1000 } },
      free('sb', 'smart_button', 2000, 2000),
      free('ms', 'motion_sensor', 3000, 2500),
    ],
  });
  const fill = (root: SVGSVGElement, kind: string) => root.querySelector(`g.device-${kind} rect.icon`)!.getAttribute('fill');
  /** The saved container kind a state carries: here always the device's own. */
  const kindOf = (d: Device) => d.props.kind as ContainerKind;
  const outClasses = (root: SVGSVGElement) =>
    [...root.querySelectorAll('g.device')].flatMap(g => [...g.classList].filter(c => c.startsWith('out-')));

  it('a smart button with state on is filled yellow', () => {
    const st: Record<string, ContainerState> = { sb: { output: 'on', fault: null, kind: 'smart_button' } };
    const root = drawDevs(containers(), { containerState: (d: Device) => st[d.id] });
    expect(root.querySelectorAll('g.device-smart_button.out-on')).toHaveLength(1);
    expect(fill(root, 'smart_button')).toBe('#facc15');
    expect(root.querySelector('.fault-mark')).toBeNull();
    // The wall switch has no state here: neutral.
    expect(fill(root, 'wall_switch')).toBe(pal.deviceFill);
    expect(outClasses(root)).toEqual(['out-on']);
  });

  it('each output has its colour; off is the neutral fill', () => {
    const colour = (output: ContainerState['output']) => {
      const root = drawDevs(containers(), { containerState: (d: Device) => ({ output, fault: null, kind: kindOf(d) }) });
      expect(root.querySelectorAll(`g.device-wall_switch.out-${output}`)).toHaveLength(1);
      expect(fill(root, 'smart_button')).toBe(fill(root, 'wall_switch'));
      return fill(root, 'wall_switch');
    };
    expect(colour('on')).toBe('#facc15');
    expect(colour('auto')).toBe('#38bdf8');
    expect(colour('error')).toBe('#f43f5e');
    expect(colour('off')).toBe(pal.deviceFill);
  });

  it('a fault adds a red mark', () => {
    const st: Record<string, ContainerState> = {
      sb: { output: 'off', fault: 'not_configured', kind: 'smart_button' },
      ws: { output: 'error', fault: 'unavailable', entities: ['switch.x'], kind: 'wall_switch' },
    };
    const root = drawDevs(containers(), { containerState: (d: Device) => st[d.id] });
    for (const kind of ['smart_button', 'wall_switch']) {
      const marks = root.querySelectorAll(`g.device-${kind} circle.fault-mark`);
      expect(marks).toHaveLength(1);
      expect(marks[0].getAttribute('fill')).toBe('#f43f5e');
    }
    expect(fill(root, 'smart_button')).toBe(pal.deviceFill);
  });

  it('no state: neutral fill, no out-* class, no mark; other kinds are never coloured', () => {
    const plain = drawDevs(containers());
    expect(fill(plain, 'smart_button')).toBe(pal.deviceFill);
    expect(fill(plain, 'wall_switch')).toBe(pal.deviceFill);
    expect(outClasses(plain)).toEqual([]);
    expect(plain.querySelector('.fault-mark')).toBeNull();

    const none = drawDevs(containers(), { containerState: () => undefined });
    expect(fill(none, 'smart_button')).toBe(pal.deviceFill);
    expect(outClasses(none)).toEqual([]);

    const all = drawDevs(containers(), { containerState: (d: Device) => ({ output: 'on', fault: 'not_configured', kind: kindOf(d) }) });
    expect(outClasses(all)).toEqual(['out-on', 'out-on']); // the wall switch and the smart button only
    expect(all.querySelectorAll('.fault-mark')).toHaveLength(2);
    expect(all.querySelector('g.device-motion_sensor .fault-mark')).toBeNull();
  });

  it('the smart button dot keeps a 3:1 contrast with a live fill in both themes', () => {
    /** WCAG relative luminance of #rrggbb. */
    const lum = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contrast = (a: string, b: string) => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };
    const dot = (root: SVGSVGElement) => root.querySelector('g.device-smart_button circle.dot')!.getAttribute('fill')!;
    for (const dark of [true, false]) {
      const palette = paletteFor(dark);
      for (const output of ['on', 'auto', 'error'] as const) {
        const root = drawDevs(containers(), { palette, containerState: (d: Device) => ({ output, fault: null, kind: kindOf(d) }) });
        expect(dot(root)).not.toBe(fill(root, 'smart_button'));
        expect(contrast(dot(root), fill(root, 'smart_button')!), `${dark ? 'dark' : 'light'} ${output}`).toBeGreaterThanOrEqual(3);
      }
      // No live fill: the dot keeps the device colour.
      for (const containerState of [undefined, (d: Device) => ({ output: 'off' as const, fault: null, kind: kindOf(d) })]) {
        expect(dot(drawDevs(containers(), { palette, containerState }))).toBe(palette.device);
      }
    }
  });

  it('renderLevel passes the state through in every mode', () => {
    for (const mode of ['plan', 'equipment', 'binding'] as const) {
      const root = drawLevel(containers(), { mode, containerState: (d: Device) => ({ output: 'auto', fault: null, kind: kindOf(d) }) });
      expect(root.querySelectorAll('g.device-smart_button.out-auto')).toHaveLength(1);
      expect(fill(root, 'smart_button')).toBe('#38bdf8');
    }
  });
});
