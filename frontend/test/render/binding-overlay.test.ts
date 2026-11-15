// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { html, render } from 'lit';
import { renderLevel, type RenderOpts } from '../../src/render/plan-svg';
import { ICON_PX } from '../../src/render/devices-svg';
import { paletteFor } from '../../src/render/theme';
import type { BindStatus } from '../../src/model/bindings';
import { deviceDefaults, type Device, type DeviceKind, type Level } from '../../src/model/types';
import { rectRoomLevel } from '../fixtures';

const pal = paletteFor(true);
const free = (id: string, kind: DeviceKind, x: number): Device =>
  ({ id, name: id, invalid: false, placement: { mode: 'free', x, y: 1000, rotation: 0 }, props: deviceDefaults(kind, 'free') });

function sample(): Level {
  const box = rectRoomLevel(6000, 5000, 200);
  const devices: Device[] = [
    free('u', 'socket', 1000),
    free('p', 'socket', 2000),
    free('m', 'motion_sensor', 3000),
    free('b', 'ceiling_light', 4000),
    { id: 'wl', name: 'wl', invalid: false, props: deviceDefaults('wall_light', 'wall'),
      placement: { mode: 'wall', wallId: 'w0', side: 'right', offset: 3000 } },
  ];
  return { ...box, zones: [{ id: 'z', name: 'Room', seed: { x: 100, y: 100 }, outline: [{ x: 0, y: 0 }, { x: 6000, y: 0 }, { x: 6000, y: 5000 }], broken: false }], devices };
}
const STATUS: Record<string, BindStatus> = { u: 'unbound', p: 'partial', m: 'missing', b: 'bound', wl: 'unbound' };
const status = (d: Device): BindStatus => STATUS[d.id];

function draw(o: Partial<RenderOpts>, scale = 0.1): SVGSVGElement {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(html`<svg xmlns="http://www.w3.org/2000/svg">${renderLevel(sample(), { palette: pal, selection: null, preview: {}, scale, ...o })}</svg>`, host);
  return host.querySelector('svg')!;
}
const ring = (root: Element, id: string) => root.querySelector(`g.device[data-id="${id}"] circle.bind-ring`);

describe('binding status overlay', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('in binding mode each device gets its status ring class; a bound device has none', () => {
    const root = draw({ mode: 'binding', bindingStatus: status });
    expect(ring(root, 'u')!.classList.contains('bind-unbound')).toBe(true);
    expect(ring(root, 'p')!.classList.contains('bind-partial')).toBe(true);
    expect(ring(root, 'm')!.classList.contains('bind-missing')).toBe(true);
    expect(ring(root, 'wl')!.classList.contains('bind-unbound')).toBe(true);
    expect(ring(root, 'b')).toBeNull();
    expect(root.querySelectorAll('circle.bind-ring')).toHaveLength(4);
  });

  it('ring colours: dashed secondary text colour, amber, red; radius ICON_PX * 1.7 / scale', () => {
    const root = draw({ mode: 'binding', bindingStatus: status }, 0.2);
    const u = ring(root, 'u')!, p = ring(root, 'p')!, m = ring(root, 'm')!;
    expect(u.getAttribute('stroke-dasharray')).not.toBeNull();
    expect(u.getAttribute('style')).toContain('--secondary-text-color');
    expect(p.getAttribute('style')).toContain('#f59e0b');
    expect(p.getAttribute('stroke-dasharray')).toBeNull();
    expect(m.getAttribute('style')).toContain('#f43f5e');
    expect(Number(u.getAttribute('r'))).toBeCloseTo((ICON_PX * 1.7) / 0.2);
    expect(u.getAttribute('fill')).toBe('none');
  });

  it('no ring appears in the plan and equipment modes', () => {
    expect(draw({ mode: 'equipment', bindingStatus: status }).querySelectorAll('.bind-ring')).toHaveLength(0);
    expect(draw({ mode: 'plan', bindingStatus: status }).querySelectorAll('.bind-ring')).toHaveLength(0);
    expect(draw({ bindingStatus: status }).querySelectorAll('.bind-ring')).toHaveLength(0);
  });

  it('binding mode dims walls, openings and rooms like equipment; devices stay at full opacity', () => {
    const root = draw({ mode: 'binding', bindingStatus: status });
    const dim = String(pal.dimOpacity);
    expect(root.querySelector('path.walls')!.getAttribute('opacity')).toBe(dim);
    expect(root.querySelector('g.zones')!.getAttribute('opacity')).toBe(dim);
    expect(root.querySelector('g.openings')!.getAttribute('opacity')).toBe(dim);
    expect(root.querySelector('g.device')!.getAttribute('opacity')).toBeNull();
  });

  it('the selected device keeps its selection ring; no direction handle in binding mode', () => {
    const sel = { kind: 'device' as const, id: 'wl' };
    const root = draw({ mode: 'binding', bindingStatus: status, selection: sel });
    expect(root.querySelector('g.device[data-id="wl"] .selection-ring')).not.toBeNull();
    expect(root.querySelector('.aim-handle')).toBeNull();
    expect(draw({ mode: 'equipment', selection: sel }).querySelector('.aim-handle')).not.toBeNull();
  });
});
