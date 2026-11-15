// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { html, render } from 'lit';
import {
  mdiConnection, mdiElectricSwitch, mdiElectricSwitchClosed, mdiLock, mdiMapMarker, mdiPowerPlug, mdiPowerPlugBattery,
  mdiPowerSocketEu, mdiSolarPowerVariant,
} from '@mdi/js';
import { formatWatts, renderPower, type PowerRenderOpts } from '../../src/render/power-svg';
import { paletteFor } from '../../src/render/theme';
import { PORT_R, portPlaces, transferChips, type GeoCtx } from '../../src/geometry/power';
import { deviceDefaults, type Device, type DeviceKind, type DeviceProps } from '../../src/model/types';
import type { PowerBlock, PowerFrame, PowerSchema, PowerWire } from '../../src/model/power';

const dev = (id: string, name: string, bindings?: Device['bindings'], kind: DeviceKind = 'equipment',
  flags: { inverter?: true; controllable?: true } = {}): Device =>
  ({ id, name, invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 },
    props: { ...deviceDefaults(kind, 'free'), ...flags } as DeviceProps, bindings });
/** The RCBO, a metering device every geo() knows (the block `m` below). */
const RCBO = dev('rcbo', 'RCBO', { power: 'sensor.rcbo_power' });
const geo = (...devices: Device[]): GeoCtx => ({ device: (id) => [RCBO, ...devices].find((d) => d.id === id) });
const P = paletteFor(true);

function mount(content: unknown): SVGSVGElement {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(html`<svg xmlns="http://www.w3.org/2000/svg">${content}</svg>`, host);
  return host.querySelector('svg')!;
}
const draw = (s: PowerSchema, o: Partial<PowerRenderOpts> = {}) =>
  mount(renderPower(s, { palette: P, selection: null, preview: {}, scale: 1, frame: null, geo: geo(), ...o }));

/** Grid at the top, a metering device straight below it: one vertical wire grid OUT -> meter IN. */
const grid: PowerBlock = { id: 'g', kind: 'grid', x: 0, y: 0, name: 'AC-IN' };
const meter: PowerBlock = { id: 'm', kind: 'device', x: 0, y: 200, deviceId: 'rcbo' };
const w1: PowerWire = { id: 'w1', from: { block: 'g', port: 'OUT' }, to: { block: 'm', port: 'IN' } };
const two: PowerSchema = { blocks: [grid, meter], wires: [w1] };
const frameOf = (wires: PowerFrame['wires'], blocks: PowerFrame['blocks'] = {}): PowerFrame => ({ wires, blocks });
const rotation = (el: Element): number => Number(/rotate\((-?[\d.]+)\)/.exec(el.getAttribute('transform') ?? '')![1]);

describe('formatWatts', () => {
  it.each([
    [null, '—'], [undefined, '—'], [251.4, '251 W'], [0, '0 W'], [-0.4, '0 W'], [999.4, '999 W'], [999.6, '1.00 kW'],
    [1320, '1.32 kW'], [-500, '−500 W'], [-1320, '−1.32 kW'],
  ])('%s -> %s', (w, out) => {
    expect(formatWatts(w)).toBe(out);
  });
});

describe('renderPower wires', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it.each([
    [{ power: 250, state: 'live' }, 'wire live'],
    [{ power: 0.4, state: 'live' }, 'wire idle'],
    [{ power: 0, state: 'dead' }, 'wire dead'],
    [{ power: null, state: 'live' }, 'wire nodata'],
  ] as const)('a wire with %j has class "%s"', (live, cls) => {
    const root = draw(two, { frame: frameOf({ w1: live }) });
    const paths = root.querySelectorAll('path.wire');
    expect(paths.length).toBe(1);
    expect(paths[0].getAttribute('class')).toBe(cls);
  });

  it('without a frame (or a frame entry) every wire has no data', () => {
    expect(draw(two).querySelector('path.wire')!.getAttribute('class')).toBe('wire nodata');
    expect(draw(two, { frame: frameOf({}) }).querySelectorAll('path.wire.nodata').length).toBe(1);
  });

  it('one path per wire', () => {
    const bus: PowerBlock = { id: 'b', kind: 'bus', x: -60, y: 120, w: 240, h: 20 };
    const s: PowerSchema = {
      blocks: [grid, bus, meter],
      wires: [
        { id: 'a', from: { block: 'g', port: 'OUT' }, to: { bus: 'b', at: 0.5 } },
        { id: 'b2', from: { bus: 'b', at: 0.5 }, to: { block: 'm', port: 'IN' } },
      ],
    };
    expect(draw(s).querySelectorAll('path.wire').length).toBe(2);
  });

  it('a live wire with power glows; idle, dead and no-data wires do not', () => {
    expect(draw(two, { frame: frameOf({ w1: { power: 250, state: 'live' } }) }).querySelectorAll('path.glow').length).toBe(1);
    for (const live of [{ power: 0, state: 'live' }, { power: 0, state: 'dead' }, { power: null, state: 'live' }] as const) {
      expect(draw(two, { frame: frameOf({ w1: live }) }).querySelectorAll('path.glow').length).toBe(0);
    }
  });

  it('the glow pulses, and stays still for reduced motion', () => {
    const live = { frame: frameOf({ w1: { power: 250, state: 'live' } }) };
    const media = (reduce: boolean) => vi.spyOn(window, 'matchMedia').mockImplementation((q: string) =>
      ({ matches: reduce && q === '(prefers-reduced-motion: reduce)', media: q }) as MediaQueryList);
    media(false);
    expect(draw(two, live).querySelectorAll('path.glow animate').length).toBe(1);
    media(true);
    expect(draw(two, live).querySelectorAll('path.glow animate').length).toBe(0);
    vi.restoreAllMocks();
  });

  it('the arrow follows the flow: down for +20 W, up (reversed) for -20 W', () => {
    const down = draw(two, { frame: frameOf({ w1: { power: 20, state: 'live' } }) }).querySelectorAll('path.arrow');
    expect(down.length).toBe(1);
    expect(rotation(down[0])).toBe(90);
    const up = draw(two, { frame: frameOf({ w1: { power: -20, state: 'live' } }) }).querySelectorAll('path.arrow');
    expect(up.length).toBe(1);
    expect(rotation(up[0])).toBe(-90);
  });

  it('the arrow sits mid-way along the longest segment, clear of the port circles', () => {
    const root = draw(two, { frame: frameOf({ w1: { power: 20, state: 'live' } }) });
    const [x, y] = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(root.querySelector('path.arrow')!.getAttribute('transform')!)!
      .slice(1).map(Number);
    const out = portPlaces(two, grid, geo()).find((p) => p.name === 'OUT')!.pt;
    const inn = portPlaces(two, meter, geo()).find((p) => p.name === 'IN')!.pt;
    expect(x).toBeCloseTo(out.x);
    expect(y).toBeCloseTo((out.y + inn.y) / 2);
    expect(y - out.y).toBeGreaterThan(PORT_R + 9);
  });

  it('no arrow for 0 W or no data', () => {
    for (const live of [{ power: 0, state: 'live' }, { power: 0.3, state: 'live' }, { power: null, state: 'live' }] as const) {
      expect(draw(two, { frame: frameOf({ w1: live }) }).querySelectorAll('path.arrow').length).toBe(0);
    }
  });

  it('a wire meeting a bus gets a terminal with the connection icon', () => {
    const bus: PowerBlock = { id: 'b', kind: 'bus', x: -60, y: 120, w: 240, h: 20 };
    const s: PowerSchema = { blocks: [grid, bus], wires: [{ id: 'a', from: { block: 'g', port: 'OUT' }, to: { bus: 'b', at: 0.5 } }] };
    const terms = draw(s).querySelectorAll('g.terminal');
    expect(terms.length).toBe(1);
    expect(terms[0].querySelector('path')!.getAttribute('d')).toBe(mdiConnection);
  });

  it('a wire draft is drawn from the preview', () => {
    const root = draw(two, { preview: { wireDraft: { from: { x: 0, y: 0 }, to: { x: 50, y: 60 }, ok: false } } });
    const d = root.querySelector('.wire-draft')!;
    expect(d.getAttribute('stroke')).toBe(P.invalid);
  });
});

describe('renderPower bus name', () => {
  beforeEach(() => { document.body.innerHTML = ''; });
  const nameOf = (h: number) => {
    const bus: PowerBlock = { id: 'b', kind: 'bus', name: 'Main', x: 0, y: 100, w: 240, h };
    return draw({ blocks: [bus], wires: [] }).querySelector('text.bus-name')!;
  };

  it('a 12-thick bus has its name inside, scaled to fit', () => {
    const t = nameOf(12);
    expect(t.getAttribute('font-size')).toBe('8');
    expect(Number(t.getAttribute('y'))).toBe(106);
  });

  it('a 20-thick bus keeps the normal font', () => {
    const t = nameOf(20);
    expect(t.getAttribute('font-size')).toBe('10.5');
    expect(Number(t.getAttribute('y'))).toBe(110);
  });

  it('a 7-thick bus is drawn beside', () => {
    expect(Number(nameOf(7).getAttribute('y'))).toBe(93);
  });
});

describe('renderPower blocks', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('draws preview.power instead of the schema', () => {
    const moved: PowerSchema = { ...two, blocks: [{ ...grid, name: 'Moved' }, meter] };
    const root = draw(two, { preview: { power: moved } });
    expect([...root.querySelectorAll('text.name')].map((t) => t.textContent)).toContain('Moved');
  });

  it('device block without its device renders missing', () => {
    const b: PowerBlock = { id: 'd', kind: 'device', x: 0, y: 0, deviceId: 'gone' };
    const root = draw({ blocks: [b], wires: [] }, { frame: frameOf({}, { d: { missing: true } }) });
    const g = root.querySelector('g.block[data-id="d"]')!;
    expect(g.classList.contains('missing')).toBe(true);
    const line = [...g.querySelectorAll('text')].find((t) => t.textContent === 'Device missing')!;
    expect(line.getAttribute('fill')).toBe(P.blockInvalid);
  });

  it('a plan device block carries the pin mark', () => {
    const b: PowerBlock = { id: 'd', kind: 'device', x: 0, y: 0, deviceId: 'pc' };
    const root = draw({ blocks: [b], wires: [] }, { geo: geo(dev('pc', 'PC', { power: 'sensor.pc' })) });
    expect([...root.querySelectorAll('g.block path')].some((p) => p.getAttribute('d') === mdiMapMarker)).toBe(true);
  });

  it('the transfer shows chip B as current for position B, in the geometry chip rects', () => {
    const ts: PowerBlock = { id: 't', kind: 'transfer', x: 0, y: 0, name: 'TS', form: '2in1out' };
    const s: PowerSchema = { blocks: [ts], wires: [] };
    const root = draw(s, { frame: frameOf({}, { t: { position: 'B' } }) });
    const chips = [...root.querySelectorAll('g.chip')];
    expect(chips.map((c) => c.getAttribute('data-position'))).toEqual(['A', '0', 'B']);
    expect(chips.map((c) => c.classList.contains('current'))).toEqual([false, false, true]);
    const rects = transferChips(ts, geo(), s);
    chips.forEach((c, i) => {
      const r = c.querySelector('rect')!;
      expect(Number(r.getAttribute('x'))).toBeCloseTo(rects[i].rect.x);
      expect(Number(r.getAttribute('width'))).toBeCloseTo(rects[i].rect.w);
    });
    expect(root.querySelectorAll('path.ts-path').length).toBe(1);
  });

  it('a transfer without a known position highlights no chip and draws no path', () => {
    const ts: PowerBlock = { id: 't', kind: 'transfer', x: 0, y: 0, name: 'TS', form: '2in1out' };
    const root = draw({ blocks: [ts], wires: [] });
    expect(root.querySelectorAll('g.chip.current').length).toBe(0);
    expect(root.querySelectorAll('path.ts-path').length).toBe(0);
  });

  it('ports: an MDI icon (or the letter) fully inside the circle, titled with the port name', () => {
    const inv: PowerBlock = { id: 'i', kind: 'device', x: 0, y: 0, deviceId: 'inv' };
    const ts: PowerBlock = { id: 't', kind: 'transfer', x: 300, y: 0, name: 'TS', form: '2in1out' };
    const root = draw({ blocks: [inv, ts], wires: [] }, { geo: geo(dev('inv', 'Inverter', undefined, 'equipment', { inverter: true })) });
    const ports = [...root.querySelectorAll('g.port')];
    const byName = new Map(ports.map((p) => [p.querySelector('title')!.textContent, p]));
    expect([...byName.keys()].sort()).toEqual(['A', 'B', 'BAT', 'IN', 'OUT', 'PV']);
    const icons: [string, string][] = [['IN', mdiPowerPlug], ['BAT', mdiPowerPlugBattery], ['PV', mdiSolarPowerVariant]];
    for (const [name, d] of icons) expect(byName.get(name)!.querySelector('path')!.getAttribute('d')).toBe(d);
    const outs = ports.filter((p) => p.querySelector('title')!.textContent === 'OUT');
    expect(outs.map((p) => p.querySelector('path')!.getAttribute('d'))).toEqual([mdiPowerSocketEu, mdiPowerSocketEu]);
    expect(byName.get('A')!.querySelector('text')!.textContent).toBe('A');
    for (const p of ports) {
      expect(Number(p.querySelector('circle')!.getAttribute('r'))).toBe(PORT_R);
      const icon = p.querySelector('path');
      if (!icon) continue;
      const k = Number(/scale\(([\d.]+)\)/.exec(icon.getAttribute('transform')!)![1]);
      // the whole 24-unit icon box, corners included, lies inside the circle with a unit to spare
      expect(24 * k * Math.SQRT1_2).toBeLessThan(PORT_R - 1);
    }
  });

  it('switch state: closed when on, open when off, dimmed when unknown; a lock on equipment that is not controllable', () => {
    // A socket is always controllable: no flag, no lock.
    const switched = (id: string, kind: DeviceKind, flags: { controllable?: true } = {}): Device =>
      dev(id, id, { control: `switch.${id}` }, kind, flags);
    const devices = [switched('on', 'equipment', { controllable: true }), switched('off', 'equipment'), switched('unk', 'socket')];
    const blocks = devices.map((d, i): PowerBlock => ({ id: d.id, kind: 'device', x: 200 * i, y: 0, deviceId: d.id }));
    const s: PowerSchema = { blocks, wires: [] };
    const root = draw(s, {
      geo: geo(...devices), frame: frameOf({}, { on: { switch: 'on' }, off: { switch: 'off' }, unk: { switch: 'unknown' } }),
    });
    const sw = (id: string) => root.querySelector(`g.block[data-id="${id}"] g.switch`)!;
    expect(sw('on').querySelector('path')!.getAttribute('d')).toBe(mdiElectricSwitchClosed);
    expect(sw('off').querySelector('path')!.getAttribute('d')).toBe(mdiElectricSwitch);
    expect(sw('unk').getAttribute('opacity')).not.toBeNull();
    expect(sw('on').getAttribute('opacity')).toBeNull();
    const locks = (id: string) => [...sw(id).querySelectorAll('path')].filter((p) => p.getAttribute('d') === mdiLock).length;
    expect([locks('on'), locks('off'), locks('unk')]).toEqual([0, 1, 0]);
  });

  it('a remainder whose meters disagree shows a dash and the hint in the block error colour', () => {
    const r: PowerBlock = { id: 'r', kind: 'remainder', x: 0, y: 0, name: 'Other' };
    const root = draw({ blocks: [r], wires: [] }, { frame: frameOf({}, { r: { power: null, hint: 'disagree' } }) });
    const texts = [...root.querySelectorAll('g.block[data-id="r"] text')];
    const line = texts.find((t) => t.textContent!.includes('meters disagree'))!;
    expect(line.textContent).toBe('— meters disagree');
    expect(line.getAttribute('fill')).toBe(P.blockInvalid);
  });

  it('a remainder has a dashed outline in the remainder colour', () => {
    const r: PowerBlock = { id: 'r', kind: 'remainder', x: 0, y: 0, name: 'Other' };
    const body = draw({ blocks: [r], wires: [] }).querySelector('g.block[data-id="r"] rect.body')!;
    expect(body.getAttribute('stroke')).toBe(P.powerRemainder);
    expect(body.getAttribute('stroke-dasharray')).toBeTruthy();
  });

  it('values come from the frame; unknown shows a dash', () => {
    const root = draw(two, { frame: frameOf({}, { g: { power: 1320 } }) });
    const texts = (id: string) => [...root.querySelectorAll(`g.block[data-id="${id}"] text`)].map((t) => t.textContent);
    expect(texts('g')).toContain('1.32 kW');
    expect(texts('m')).toContain('—');
  });

  it('the selected block gets an outline in the selection colour, a constant screen size off its edge', () => {
    const root = draw(two, { selection: { kind: 'powerBlock', id: 'm' }, scale: 2 });
    const sel = root.querySelector('rect.selection')!;
    expect(sel.getAttribute('stroke')).toBe(P.selection);
    expect(Number(sel.getAttribute('y'))).toBeCloseTo(200 - 2);
  });

  it('the selected wire gets a halo in the selection colour', () => {
    const root = draw(two, { selection: { kind: 'powerWire', id: 'w1' } });
    expect(root.querySelector('path.wire-selection')!.getAttribute('stroke')).toBe(P.selection);
  });
});
