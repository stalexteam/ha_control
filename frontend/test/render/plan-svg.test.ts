// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { html, render } from 'lit';
import { renderLevel } from '../../src/render/plan-svg';
import { paletteFor } from '../../src/render/theme';
import { addOpening } from '../../src/model/openings';
import { addPolygonZone, addWallsZone } from '../../src/model/zones';
import { deviceDefaults, type Device, type Level } from '../../src/model/types';
import { deviceLive, liveBubbles } from '../../src/live/device-live';
import type { Preview, Selection } from '../../src/editor/tools/types';
import { rectRoomLevel } from '../fixtures';

/** 4000 x 3000 axis box, 400 walls: inner 3600 x 2600 = 9.36 m², with a door on w0 and a zone. */
function sample(): Level {
  let level = rectRoomLevel(4000, 3000, 400);
  level = addOpening(level, 'w0', 'door', 2000).level;
  const z = addWallsZone(level, { x: 2000, y: 1500 }, 'Kitchen');
  expect(z.zoneId).not.toBeNull();
  return z.level;
}

function draw(level: Level, selection: Selection | null = null, preview: Preview = {}): SVGSVGElement {
  const content = renderLevel(level, { palette: paletteFor(true), selection, preview, scale: 0.1 });
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(html`<svg xmlns="http://www.w3.org/2000/svg">${content}</svg>`, host);
  return host.querySelector('svg')!;
}

describe('renderLevel', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('draws one wall path, one door and the zone label with area', () => {
    const root = draw(sample());
    expect(root.querySelectorAll('path.walls').length).toBe(1);
    expect(root.querySelectorAll('.door').length).toBe(1);
    const texts = [...root.querySelectorAll('text')].map(t => t.textContent ?? '');
    expect(texts.some(s => s.includes('Kitchen') && s.includes('9.4 m²'))).toBe(true);
  });

  it('the Plan step draws zone fills and labels; Equipment and Binding thin outlines only', () => {
    const level = addPolygonZone(sample(), [
      { kind: 'free', x: 500, y: 500 }, { kind: 'free', x: 1500, y: 500 }, { kind: 'free', x: 1500, y: 1500 },
    ], 'Corner').level;
    const rendered = (mode: 'plan' | 'equipment' | 'binding') => {
      const content = renderLevel(level, { palette: paletteFor(true), selection: null, preview: {}, scale: 0.1, mode });
      const host = document.createElement('div');
      render(html`<svg xmlns="http://www.w3.org/2000/svg">${content}</svg>`, host);
      return host;
    };
    const plan = rendered('plan');
    expect(plan.querySelectorAll('.zone-label').length).toBe(2);
    expect([...plan.querySelectorAll('g.zones path.zone')].map(p => p.getAttribute('fill') === 'none')).toEqual([false, false]);
    for (const mode of ['equipment', 'binding'] as const) {
      const h = rendered(mode);
      expect(h.querySelectorAll('.zone-label').length, mode).toBe(0);
      const paths = [...h.querySelectorAll('g.zones path.zone')];
      expect(paths.map(p => p.getAttribute('fill')), mode).toEqual(['none', 'none']);
      expect(paths.map(p => p.getAttribute('stroke-width')), mode).toEqual(['1', '1']);
    }
  });

  it('hatches an invalid zone', () => {
    const level = sample();
    const broken: Level = { ...level, zones: level.zones.map(z => ({ ...z, invalid: true })) };
    const root = draw(broken);
    const zone = root.querySelector('path.zone')!;
    expect(zone.getAttribute('fill')).toBe('url(#zone-hatch)');
  });

  it('marks an invalid opening', () => {
    const level = sample();
    const bad: Level = { ...level, openings: level.openings.map(o => ({ ...o, invalid: true })) };
    const root = draw(bad);
    expect(root.querySelector('.door')!.classList.contains('invalid')).toBe(true);
  });

  it('shows a temporary length dimension for a selected wall', () => {
    const root = draw(sample(), { kind: 'wall', id: 'w1' });
    const dims = [...root.querySelectorAll('.dim')].map(d => d.textContent ?? '');
    expect(dims.some(s => s.includes('3 000'))).toBe(true);
  });

  it('draws the preview working level instead of the committed one', () => {
    const level = sample();
    const working: Level = { ...level, zones: level.zones.map(z => ({ ...z, name: 'Moved' })) };
    const root = draw(level, null, { level: working });
    const texts = [...root.querySelectorAll('text')].map(t => t.textContent ?? '').join('|');
    expect(texts).toContain('Moved');
    expect(texts).not.toContain('Kitchen');
  });

  it('styles an invalid preview opening', () => {
    const root = draw(sample(), null, { opening: { wallId: 'w2', offset: 100, width: 900, kind: 'door', invalid: true } });
    expect(root.querySelector('.preview-opening.invalid')).not.toBeNull();
  });

  const snapOf = (kind: 'node' | 'mid' | 'wall' | 'grid' | 'corner', pt = { x: 1000, y: 0 }): Preview => ({
    snap: {
      pt, kind,
      endpoint: kind === 'node' ? { kind: 'node', nodeId: 'n0' }
        : kind === 'grid' || kind === 'corner' ? { kind: 'free', pt } : { kind: 'wall', wallId: 'w0', offset: pt.x },
    },
  });

  it('draws a distinct snap marker and label per snap kind', () => {
    const cases = [['node', '.snap-node', 'endpoint'], ['mid', '.snap-mid', 'midpoint'],
      ['wall', '.snap-wall', 'on wall'], ['grid', '.snap-grid', 'grid']] as const;
    for (const [kind, cls, label] of cases) {
      document.body.innerHTML = '';
      const root = draw(sample(), null, snapOf(kind));
      expect(root.querySelector(cls), kind).not.toBeNull();
      for (const other of cases) if (other[0] !== kind) expect(root.querySelector(other[1])).toBeNull();
      expect(root.querySelector('.snap-label')?.textContent?.trim()).toBe(label);
    }
  });

  it('draws a corner snap like the node marker', () => {
    const root = draw(sample(), null, snapOf('corner'));
    expect(root.querySelector('g.snap-corner rect')).not.toBeNull();
    expect(root.querySelector('.snap-label')?.textContent?.trim()).toBe('wall corner');
  });

  it('sizes snap markers in screen pixels', () => {
    const at = (scale: number) => {
      document.body.innerHTML = '';
      const content = renderLevel(sample(), { palette: paletteFor(true), selection: null, preview: snapOf('node'), scale });
      const host = document.createElement('div');
      document.body.appendChild(host);
      render(html`<svg xmlns="http://www.w3.org/2000/svg">${content}</svg>`, host);
      return Number(host.querySelector('.snap-node rect')!.getAttribute('width'));
    };
    expect(at(0.1) * 0.1).toBeCloseTo(at(0.5) * 0.5, 6);
    expect(at(0.1) * 0.1).toBeGreaterThanOrEqual(9);
  });

  it('highlights the target wall for a wall snap only', () => {
    const root = draw(sample(), null, snapOf('wall'));
    const hl = root.querySelector('.snap-wall-hl');
    expect(hl).not.toBeNull();
    expect(hl!.getAttribute('stroke')).toBe(paletteFor(true).snap);
    document.body.innerHTML = '';
    expect(draw(sample(), null, snapOf('grid')).querySelector('.snap-wall-hl')).toBeNull();
  });

  it('marks the start of the active chain', () => {
    expect(draw(sample(), null, { anchor: { x: 0, y: 0 } }).querySelector('.snap-start')).not.toBeNull();
    document.body.innerHTML = '';
    expect(draw(sample(), null, {}).querySelector('.snap-start')).toBeNull();
  });

  it('equipment mode dims the wall breaks group like the walls', () => {
    const pal = paletteFor(true);
    const host = document.createElement('div');
    document.body.appendChild(host);
    render(html`<svg xmlns="http://www.w3.org/2000/svg">${renderLevel(sample(), { palette: pal, selection: null, preview: {}, scale: 0.1, mode: 'equipment' })}</svg>`, host);
    const svg = host.querySelector('svg')!;
    expect(svg.querySelector('g.wall-breaks')!.getAttribute('opacity')).toBe(String(pal.dimOpacity));
    expect(svg.querySelector('path.walls')!.getAttribute('opacity')).toBe(String(pal.dimOpacity));
    expect(draw(sample()).querySelector('g.wall-breaks')!.getAttribute('opacity')).toBeNull();
  });
});

describe('renderLevel step rules for devices', () => {
  beforeEach(() => { document.body.innerHTML = ''; });
  const NOW = Date.parse('2026-11-16T10:01:00Z');
  const level = (): Level => ({
    ...sample(),
    devices: [
      { id: 'cl', name: 'cl', invalid: false, bindings: { control: 'light.a' }, placement: { mode: 'free', x: 1000, y: 1000, rotation: 0 },
        props: { ...deviceDefaults('ceiling_light', 'free'), poolRadius: 800 } as Device['props'] },
      { id: 'ms', name: 'ms', invalid: false, placement: { mode: 'free', x: 2500, y: 1500, rotation: 0 },
        props: deviceDefaults('motion_sensor', 'free') as Device['props'] },
      { id: 'sb', name: 'sb', invalid: false, placement: { mode: 'free', x: 3000, y: 2000, rotation: 0 },
        props: deviceDefaults('smart_button', 'free') as Device['props'] },
    ],
  });
  const states = { 'light.a': { state: 'on', last_changed: '2026-11-16T10:00:18Z' } };
  const draw2 = (mode: 'plan' | 'equipment' | 'binding') => {
    const lv = level();
    const content = renderLevel(lv, {
      palette: paletteFor(true), selection: null, preview: {}, scale: 0.1, mode,
      containerState: () => ({ kind: 'smart_button', status: 'error', reason: 'not_configured' }),
      live: d => deviceLive(d, states),
      bubbles: d => ({ shown: liveBubbles(deviceLive(d, states), d, NOW), leaving: [] }),
    });
    const host = document.createElement('div');
    document.body.appendChild(host);
    render(html`<svg xmlns="http://www.w3.org/2000/svg">${content}</svg>`, host);
    return host.querySelector('svg')!;
  };

  it('Plan draws no devices and no cones; walls, openings and zones stay', () => {
    const root = draw2('plan');
    expect(root.querySelector('g.device')).toBeNull();
    expect(root.querySelector('g.cones')?.children.length ?? 0).toBe(0);
    expect(root.querySelectorAll('path.walls').length).toBe(1);
    expect(root.querySelectorAll('.door').length).toBe(1);
    expect(root.querySelectorAll('g.zones path.zone').length).toBeGreaterThan(0);
  });

  it('Equipment: symbols and cones, but no badge, no dashed outline, no live look', () => {
    const root = draw2('equipment');
    expect(root.querySelectorAll('g.device').length).toBe(3);
    expect(root.querySelector('.badge')).toBeNull();
    expect(root.querySelector('g.device.no-data')).toBeNull();
    expect(root.querySelector('g.device[data-id="cl"] .icon')!.getAttribute('fill')).toBe(paletteFor(true).deviceFill);
    expect(root.querySelector('.bubble')).toBeNull();
    expect(root.querySelector('.live-glow')).toBeNull();
  });

  it('Binding: alert badge, lit light and a timer bubble', () => {
    const root = draw2('binding');
    expect(root.querySelector('g.device[data-id="sb"] .badge')).toBeTruthy();
    expect(root.querySelector('g.device[data-id="cl"] .icon')!.getAttribute('fill')).toBe(paletteFor(true).device);
    expect(root.querySelector('g.bubbles g.device-bubbles[data-id="cl"] .bubble')!.textContent).toContain('42');
  });
});
