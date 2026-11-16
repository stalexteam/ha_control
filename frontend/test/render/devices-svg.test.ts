// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { html, render } from 'lit';
import { renderLevel } from '../../src/render/plan-svg';
import { paletteFor } from '../../src/render/theme';
import { renderDevices, ICON_PX, equipmentLabelLayout } from '../../src/render/devices-svg';
import { deviceDefaults, type ContainerKind, type Device, type DeviceKind, type Level } from '../../src/model/types';
import { mdiAlert } from '@mdi/js';
import type { HassLike } from '../../src/api';
import type { DeviceLive } from '../../src/live/device-live';
import { ContainerFeed, type ContainerIntent, type ContainerState } from '../../src/live/container-feed';
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

  it('round ceiling light: radius = diameter/2 when larger than the icon, icon radius when smaller; ring encloses it', () => {
    const scale = 0.1;
    const lamp = (diameter: number, selected = false) => {
      const level = { ...rectRoomLevel(6000, 5000, 200), devices: [free('cl', 'ceiling_light', 1000, 1000, { shape: 'round', diameter })] };
      return drawDevs(level, selected ? { selection: { kind: 'device', id: 'cl' } } : {}, scale);
    };
    expect(Number(lamp(1000).querySelector('g.device-ceiling_light circle.icon')!.getAttribute('r'))).toBe(500);
    expect(Number(lamp(10).querySelector('g.device-ceiling_light circle.icon')!.getAttribute('r'))).toBeCloseTo(ICON_PX / scale);
    expect(Number(lamp(1000, true).querySelector('.selection-ring')!.getAttribute('r'))).toBeGreaterThan(500);
  });

  it('round ceiling light: binding ring encloses a large lamp', () => {
    const level = { ...rectRoomLevel(6000, 5000, 200), devices: [free('cl', 'ceiling_light', 1000, 1000, { shape: 'round', diameter: 1000 })] };
    const root = drawDevs(level, { bindingStatus: () => 'unbound' } as Partial<DevOpts>);
    expect(Number(root.querySelector('circle.bind-ring')!.getAttribute('r'))).toBeGreaterThan(500);
  });

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
    const r = (s: number) => Number(drawDevs(levelWithAll(), {}, s).querySelector('g.device-socket circle.icon')!.getAttribute('r'));
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

  it('the preview cone follows the preview over the same level (no stale cached cone)', () => {
    const lv = rectRoomLevel(6000, 5000, 200);
    const at = (x: number) => ({ placement: { mode: 'free' as const, x, y: 2500, rotation: 0 }, props: deviceDefaults('motion_sensor', 'free'), invalid: false });
    const coneD = (x: number) => drawDevs(lv, { preview: at(x) }).querySelector('.cone')!.getAttribute('d');
    expect(coneD(1000)).not.toBe(coneD(3000));
    expect(coneD(1000)).toBe(coneD(1000));
  });

  it('a motion sensor zone uses motionCone and a wall light cone uses cone', () => {
    const one = (d: Device): Level => ({ ...rectRoomLevel(6000, 5000, 200), devices: [d] });
    const ms = free('ms', 'motion_sensor', 3000, 2500);
    const wl = free('wl', 'wall_light', 3000, 2500);
    const cl = free('cl', 'ceiling_light', 3000, 2500, { poolRadius: 800 });
    for (const [dark, violet] of [[true, '#a78bfa'], [false, '#7c3aed']] as const) {
      const palette = paletteFor(dark);
      expect(palette.motionCone).toBe(violet);
      expect(palette.motionCone).not.toBe(palette.cone);
      const zone = drawDevs(one(ms), { palette }).querySelector('.cone')!;
      expect(zone.getAttribute('fill')).toBe(violet);
      expect(zone.getAttribute('stroke')).toBe(violet);
      const cone = drawDevs(one(wl), { palette }).querySelector('.cone')!;
      expect(cone.getAttribute('fill')).toBe(palette.cone);
      expect(cone.getAttribute('stroke')).toBe(palette.cone);
      expect(drawDevs(one(cl), { palette }).querySelector('.pool')!.getAttribute('stroke')).toBe(palette.cone);
      // An invalid device keeps the invalid colour.
      const bad = drawDevs(one({ ...ms, invalid: true }), { palette }).querySelector('.cone')!;
      expect(bad.getAttribute('fill')).toBe(palette.invalid);
    }
  });

  it('a cone is clipped by line of sight: a sensor facing a wall stops at it', () => {
    const lv = { ...rectRoomLevel(6000, 5000, 200), devices: [free('ms', 'motion_sensor', 5000, 2500, { zoneAngle: 90, zoneRange: 4000 })] };
    const xs = drawDevs(lv).querySelector('.cone')!.getAttribute('d')!.match(/-?\d+(\.\d+)?(e-?\d+)?/g)!
      .map(Number).filter((_, i) => i % 2 === 0);
    expect(Math.max(...xs)).toBeLessThanOrEqual(5900 + 1e-6); // the inner face of the right wall
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

/** A feed on a fake connection, subscribed to P1 (call under fake timers); `push` delivers a frame on its subscription. */
async function liveFeed() {
  let deliver: ((ev: unknown) => void) | null = null;
  const connection: HassLike['connection'] = {
    sendMessagePromise: () => Promise.reject(new Error('not used')),
    subscribeMessage<T>(cb: (msg: T) => void) {
      deliver = ev => cb(ev as T);
      return Promise.resolve(() => Promise.resolve());
    },
  };
  const feed = new ContainerFeed({ requestUpdate: () => undefined }, () => connection);
  feed.watch('P1');
  await vi.advanceTimersByTimeAsync(0);
  return { feed, push: (full: boolean, containers: Record<string, ContainerState>) => deliver!({ full, containers }) };
}

describe('container badges on the plan', () => {
  beforeEach(() => { document.body.innerHTML = ''; });
  afterEach(() => { vi.useRealTimers(); });
  const pal = paletteFor(true);
  const ALERT = '#f43f5e';
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
  const ok = (kind: ContainerKind, last?: ContainerIntent): ContainerState => ({ kind, status: 'ok', ...(last ? { last } : {}) });
  const bad = (kind: ContainerKind, reason: 'not_configured' | 'unavailable', last?: ContainerIntent): ContainerState =>
    ({ kind, status: 'error', reason, ...(reason === 'unavailable' ? { entities: ['switch.x'] } : {}), ...(last ? { last } : {}) });
  const at = (s: number) => `2026-11-15T10:00:${String(s).padStart(2, '0')}+00:00`;
  const badge = (root: SVGSVGElement, id: string) => root.querySelector(`g.device[data-id="${id}"] g.badge`);
  const badgeKind = (root: SVGSVGElement, id: string) => badge(root, id)?.getAttribute('data-badge') ?? null;
  const icon = (root: SVGSVGElement, id: string) => badge(root, id)!.querySelector('path')!.getAttribute('d');
  /** The badge's ink: its ring stroke and its icon fill. */
  const ink = (root: SVGSVGElement, id: string) => {
    const b = badge(root, id)!;
    return [b.querySelector('circle')!.getAttribute('stroke'), b.querySelector('path')!.getAttribute('fill')];
  };
  /** Draws the plan from the feed (scale 1: screen pixels are user units). */
  const draw = (feed: ContainerFeed, scale = 1) =>
    drawDevs(containers(), { containerState: (d: Device) => feed.stateOf(d) }, scale);

  it('status error shows the alert badge permanently', async () => {
    vi.useFakeTimers();
    const { feed, push } = await liveFeed();
    push(true, { sb: bad('smart_button', 'not_configured'), ws: bad('wall_switch', 'unavailable') });
    for (const wait of [0, 3000, 10 * 60_000]) {
      await vi.advanceTimersByTimeAsync(wait);
      const root = draw(feed);
      for (const id of ['sb', 'ws']) {
        expect(badgeKind(root, id)).toBe('alert');
        expect(icon(root, id)).toBe(mdiAlert);
        expect(ink(root, id)).toEqual([ALERT, ALERT]);
      }
      expect(badge(root, 'ms')).toBeNull();
      expect(root.querySelectorAll('g.badge')).toHaveLength(2);
    }
    // Back to ok: the alert clears.
    push(false, { sb: ok('smart_button') });
    expect(badge(draw(feed), 'sb')).toBeNull();
  });

  it('the badge is a 7 px circle at the icon top-right, in the background colour, with a 10 px icon, at any zoom', () => {
    for (const scale of [1, 0.1, 0.37]) {
      const root = drawDevs(containers(), { containerState: (d: Device) => bad(kindOf(d), 'not_configured') }, scale);
      const R = ICON_PX / scale;
      const ring = badge(root, 'sb')!.querySelector('circle')!;
      expect(Number(ring.getAttribute('r'))).toBeCloseTo(7 / scale);
      expect(Number(ring.getAttribute('cx'))).toBeCloseTo(R * 0.9);
      expect(Number(ring.getAttribute('cy'))).toBeCloseTo(-R * 0.9);
      expect(ring.getAttribute('fill')).toBe(pal.background);
      expect(ring.getAttribute('stroke-width')).toBe('1.5');
      expect(ring.getAttribute('vector-effect')).toBe('non-scaling-stroke');
      // The 24-unit MDI path is scaled to 10 px and centred on the ring.
      const tf = badge(root, 'sb')!.querySelector('path')!.getAttribute('transform')!;
      const m = /translate\(([-\d.e]+)[ ,]([-\d.e]+)\)\s*scale\(([-\d.e]+)\)/.exec(tf)!;
      const [tx, ty, k] = m.slice(1).map(Number);
      expect(k * 24).toBeCloseTo(10 / scale);
      expect(tx + 12 * k).toBeCloseTo(R * 0.9);
      expect(ty + 12 * k).toBeCloseTo(-R * 0.9);
    }
    // The light palette has its own background.
    const light = drawDevs(containers(), { palette: paletteFor(false), containerState: (d: Device) => bad(kindOf(d), 'not_configured') });
    expect(badge(light, 'sb')!.querySelector('circle')!.getAttribute('fill')).toBe(paletteFor(false).background);
  });

  it('no output fills remain', () => {
    const states: ((d: Device) => ContainerState | undefined)[] = [
      () => undefined,
      d => ok(kindOf(d)),
      d => bad(kindOf(d), 'unavailable'),
      d => ok(kindOf(d), { action: 'set', value: 'on', at: at(1) }),
      d => ok(kindOf(d), { action: 'set', value: 'off', at: at(1) }),
      d => ok(kindOf(d), { action: 'auto', at: at(1) }),
    ];
    for (const containerState of states) {
      const root = drawDevs(containers(), { containerState });
      expect(fill(root, 'smart_button')).toBe(pal.deviceFill);
      expect(fill(root, 'wall_switch')).toBe(pal.deviceFill);
      expect(root.querySelector('g.device-smart_button circle.dot')!.getAttribute('fill')).toBe(pal.device);
      expect(root.querySelector('[class*="out-"], .fault-mark')).toBeNull();
      // The 3 s intent flash is gone: only the alert badge exists.
      for (const b of Array.from(root.querySelectorAll('g.badge'))) expect(b.getAttribute('data-badge')).toBe('alert');
    }
    expect(Object.keys(pal).filter(k => /^out/i.test(k))).toEqual([]);
  });

  it('no badge for other kinds, the placement preview, or a saved container of another kind', () => {
    const root = drawDevs(containers(), {
      containerState: (d: Device) => bad(d.props.kind === 'motion_sensor' ? 'smart_button' : kindOf(d), 'not_configured'),
      preview: { placement: { mode: 'free', x: 1000, y: 1000, rotation: 0 }, props: deviceDefaults('smart_button', 'free'), invalid: false },
    });
    expect(badge(root, 'ms')).toBeNull();
    expect(root.querySelector('g.device-preview g.badge')).toBeNull();
    expect(root.querySelectorAll('g.badge')).toHaveLength(2);
    // An unsaved Type change: the feed has no state for the device, so no badge.
    const other = drawDevs(containers(), { containerState: () => undefined });
    expect(other.querySelectorAll('g.badge')).toHaveLength(0);
  });

  it('a container with no state is dashed; a live one is solid', () => {
    const st: Record<string, ContainerState> = { sb: ok('smart_button') };
    const root = drawDevs(containers(), { containerState: (d: Device) => st[d.id] });
    const g = (kind: string) => root.querySelector(`g.device-${kind}`)!;
    const dash = (kind: string) => root.querySelector(`g.device-${kind} rect.icon`)!.getAttribute('stroke-dasharray');
    expect(g('wall_switch').classList.contains('no-data')).toBe(true);
    expect(dash('wall_switch')).toBe('3 2');
    expect(g('smart_button').classList.contains('no-data')).toBe(false);
    expect(dash('smart_button')).toBeNull();
    // Containers only: a motion sensor never reads as "no data".
    expect(g('motion_sensor').classList.contains('no-data')).toBe(false);
    expect(root.querySelector('g.device-motion_sensor [stroke-dasharray]')).toBeNull();
    // Without any state both containers are dashed, the smart button too, and have no badge.
    const none = drawDevs(containers(), { containerState: () => undefined });
    expect(none.querySelectorAll('g.no-data')).toHaveLength(2);
    expect(none.querySelector('g.device-smart_button rect.icon')!.getAttribute('stroke-dasharray')).toBe('3 2');
    expect(none.querySelector('g.badge')).toBeNull();
    // An error is live data: solid, with its alert.
    const fault = drawDevs(containers(), { containerState: (d: Device) => bad(kindOf(d), 'unavailable') });
    expect(fault.querySelectorAll('g.no-data')).toHaveLength(0);
    expect(fault.querySelector('rect.icon[stroke-dasharray]')).toBeNull();
  });

  it('renderLevel passes the state through in every mode', () => {
    for (const mode of ['plan', 'equipment', 'binding'] as const) {
      const root = drawLevel(containers(), { mode, containerState: (d: Device) => bad(kindOf(d), 'not_configured') });
      expect(badgeKind(root, 'sb')).toBe('alert');
      expect(badgeKind(root, 'ws')).toBe('alert');
    }
  });
});

describe('equipmentLabelLayout', () => {
  // Screen px: icon 24, label font 10.2, gap 4. Scale 1 means plan mm = screen px.
  const rect = (w: number, d: number, label = 'Invertor', deg = 0, scale = 1) =>
    equipmentLabelLayout({ shape: 'rect', width: w, depth: d, diameter: 0 }, label, deg, scale);
  const HALF = (10.2 + 4) / 2;

  it('stacked and centred in a tall body', () => {
    const l = rect(100, 100);
    expect(l.mode).toBe('stacked');
    expect(l.iconX).toBe(0);
    expect(l.iconY).toBeCloseTo(-HALF);
    expect(l.labelX).toBe(0);
    expect(l.labelAnchor).toBe('middle');
    expect(l.labelY).toBeGreaterThan(l.iconY + 12);
  });

  it('one line in a flat wide body: icon left, label right of it, same y', () => {
    const l = rect(200, 40);
    expect(l.mode).toBe('line');
    expect(l.iconX).toBeLessThan(0);
    expect(l.labelAnchor).toBe('start');
    expect(l.labelX).toBeGreaterThan(l.iconX + 12);
    expect(l.labelY).toBe(l.iconY);
    expect(l.iconY).toBe(0);
  });

  it('neither fits: stacked when it overflows less', () => {
    const l = rect(40, 20);
    expect(l.mode).toBe('stacked');
    expect(l.iconY).toBeCloseTo(-HALF);
  });

  it('flat body (900x200 mm at 0.101): one line overflows less than stacked', () => {
    const l = rect(900, 200, 'Invertor', 0, 0.101);
    expect(l.mode).toBe('line');
    expect(l.labelY).toBe(l.iconY);
  });

  it('empty label: icon alone at the centre', () => {
    const l = rect(100, 100, '');
    expect(l.iconX).toBe(0);
    expect(l.iconY).toBe(0);
  });

  it('a 90 degree rotation swaps the fit', () => {
    expect(rect(40, 200, 'Invertor', 0).mode).toBe('stacked');
    expect(rect(40, 200, 'Invertor', 90).mode).toBe('line');
  });

  it('circle uses its inscribed square', () => {
    const c = (diameter: number) => equipmentLabelLayout({ shape: 'circle', width: 0, depth: 0, diameter }, 'Boiler', 0, 1);
    expect(c(200).mode).toBe('stacked');
    expect(c(60).mode).toBe('stacked'); // inscribed square 42: nothing fits
    expect(c(60).iconY).toBeCloseTo(-HALF);
  });

  it('coordinates are in plan units: scale divides them', () => {
    const l = rect(1000, 1000, 'Invertor', 0, 0.1);
    expect(l.iconY).toBeCloseTo(-HALF / 0.1);
  });

  it('equipmentBlock puts the icon and label through the layout', () => {
    const level = { ...rectRoomLevel(6000, 5000, 200), devices: [
      free('eq', 'equipment', 2000, 3500, { label: 'Invertor', width: 200, depth: 40, shape: 'rect' }),
    ] };
    const eq = drawDevs(level, {}, 1).querySelector('g.device-equipment')!;
    expect(eq.querySelector('.equipment-label')!.getAttribute('text-anchor')).toBe('start');
  });
});

describe('leak sensor and valve symbols', () => {
  beforeEach(() => { document.body.innerHTML = ''; });
  const lv = (): Level => ({ ...rectRoomLevel(6000, 5000, 200), devices: [
    free('lk', 'leak_sensor', 1000, 1000), free('vl', 'valve', 2000, 1000), free('sw', 'wall_switch', 3000, 1000)] });
  const okState = (kind: ContainerKind): ContainerState => ({ kind, status: 'ok' });

  it('a leak sensor is a circle with a drop', () => {
    const g = drawDevs(lv()).querySelector('g.device-leak_sensor')!;
    expect(g.querySelector('circle.icon')).toBeTruthy();
    expect(g.querySelector('path.drop')).toBeTruthy();
  });

  it('a valve is a bow-tie path; dashed without state, solid when live', () => {
    const R = ICON_PX / 0.1;
    const path = (o: Partial<DevOpts> = {}) => drawDevs(lv(), o).querySelector('g.device-valve path.icon')!;
    expect(path().getAttribute('d')).toBe(`M${-R} ${-0.6 * R}L${R} ${0.6 * R}L${R} ${-0.6 * R}L${-R} ${0.6 * R}Z`);
    expect(path().getAttribute('stroke-dasharray')).toBe('3 2');
    const live = path({ containerState: (d: Device) => (d.id === 'vl' ? okState('valve') : undefined) });
    expect(live.getAttribute('stroke-dasharray')).toBeNull();
  });
});

describe('live looks and bubbles', () => {
  beforeEach(() => { document.body.innerHTML = ''; });
  const pal = paletteFor(true);
  const ALERT = '#f43f5e';
  const lv = (): Level => ({ ...rectRoomLevel(6000, 5000, 200), devices: [
    free('cl', 'ceiling_light', 1000, 1000, { poolRadius: 800 }),
    free('ms', 'motion_sensor', 3000, 2500),
    free('lk', 'leak_sensor', 4000, 1000),
    free('so', 'socket', 2000, 4000),
    free('sb', 'smart_button', 4500, 4000),
  ] });
  const look = (look: DeviceLive['look']) => () => ({ look });
  const dev = (root: SVGSVGElement, id: string) => root.querySelector(`g.device[data-id="${id}"]`)!;

  it('a lit light is filled with the device colour and has a glow in the cone group; an off light is not', () => {
    const on = drawDevs(lv(), { live: d => ({ look: d.id === 'cl' ? 'on' : 'none' }) });
    expect(dev(on, 'cl').querySelector('.icon')!.getAttribute('fill')).toBe(pal.device);
    expect(on.querySelectorAll('g.cones .live-glow')).toHaveLength(1);
    const off = drawDevs(lv(), { live: d => ({ look: d.id === 'cl' ? 'off' : 'none' }) });
    expect(dev(off, 'cl').querySelector('.icon')!.getAttribute('fill')).toBe(pal.deviceFill);
    expect(off.querySelector('.live-glow')).toBeNull();
  });

  it('no-data draws the symbol dashed and no bubble', () => {
    const root = drawDevs(lv(), { live: look('no-data'), bubbles: () => ({ shown: [], leaving: [] }) });
    expect(dev(root, 'cl').querySelector('.icon')!.getAttribute('stroke-dasharray')).toBe('3 2');
    expect(dev(root, 'so').querySelector('.icon')!.getAttribute('stroke-dasharray')).toBe('3 2');
    expect(root.querySelector('.bubble')).toBeNull();
    expect(root.querySelector('.live-glow')).toBeNull();
  });

  it('active motion brightens its cone; active leak is alert red; idle motion keeps the idle cone', () => {
    const root = drawDevs(lv(), { live: d => ({ look: d.id === 'ms' || d.id === 'lk' ? 'active' : 'none' }) });
    expect(root.querySelector('path.cone.live-active')).toBeTruthy();
    expect(dev(root, 'lk').querySelector('.icon')!.getAttribute('fill')).toBe(ALERT);
    const idle = drawDevs(lv(), { live: look('off') });
    expect(idle.querySelector('path.cone')).toBeTruthy();
    expect(idle.querySelector('.live-active')).toBeNull();
  });

  it('bubbles: shown pop in, leaving fade out, tones recolour the ring, text keeps its size at any zoom', () => {
    for (const scale of [1, 0.1]) {
      const root = drawDevs(lv(), {
        scale,
        bubbles: d => d.id === 'so'
          ? { shown: [{ text: '309 W', tone: 'device' }, { text: '2_double', tone: 'event' }], leaving: [{ text: '5', tone: 'motion' }] }
          : { shown: [], leaving: [] },
      } as Partial<DevOpts>);
      const shown = root.querySelector('g.bubble[data-tone="device"]')!;
      expect(shown.classList.contains('bubble-in')).toBe(true);
      expect(shown.querySelector('text')!.textContent).toBe('309 W');
      expect(shown.querySelector('rect')!.getAttribute('stroke')).toBe(pal.device);
      expect(Number(shown.querySelector('rect')!.getAttribute('height'))).toBeCloseTo(18 / scale);
      expect(Number(shown.querySelector('text')!.getAttribute('font-size'))).toBeCloseTo(11 / scale);
      const ev = root.querySelector('g.bubble[data-tone="event"]')!;
      expect(ev.querySelector('rect')!.getAttribute('stroke')).toBe(pal.selection);
      const out = root.querySelector('g.bubble.bubble-out')!;
      expect(out.getAttribute('data-tone')).toBe('motion');
      expect(out.querySelector('rect')!.getAttribute('stroke')).toBe(pal.motionCone);
      expect(root.querySelectorAll('g.bubble')).toHaveLength(3);
    }
    const leak = drawDevs(lv(), { bubbles: () => ({ shown: [{ text: '3:12', tone: 'leak' }], leaving: [] }) });
    expect(leak.querySelector('g.bubble rect')!.getAttribute('stroke')).toBe(ALERT);
  });

  it('without live and bubbles the output has no live parts and no intent badges', () => {
    const root = drawDevs(lv(), { containerState: d => ({ kind: d.props.kind as ContainerKind, status: 'ok', last: { action: 'toggle', at: 'x' } }) });
    expect(root.querySelector('.live-glow, .bubble, .live-active, .no-data')).toBeNull();
    expect(root.querySelector('g.badge')).toBeNull();
    expect(dev(root, 'cl').querySelector('.icon')!.getAttribute('fill')).toBe(pal.deviceFill);
  });

  it('the placement preview ignores live and bubbles', () => {
    const root = drawDevs({ ...rectRoomLevel(6000, 5000, 200), devices: [] }, {
      live: look('on'), bubbles: () => ({ shown: [{ text: '1', tone: 'device' }], leaving: [] }),
      preview: { placement: { mode: 'free', x: 1000, y: 1000, rotation: 0 }, props: deviceDefaults('ceiling_light', 'free'), invalid: false },
    });
    expect(root.querySelector('.bubble, .live-glow')).toBeNull();
  });
});
