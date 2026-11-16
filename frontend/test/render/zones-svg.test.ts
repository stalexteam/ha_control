// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { html, render } from 'lit';
import { renderZones, ZONE_HUES } from '../../src/render/zones-svg';
import { renderLevel } from '../../src/render/plan-svg';
import { paletteFor } from '../../src/render/theme';
import { addPolygonZone, addWallsZone, setZoneParticipation } from '../../src/model/zones';
import { addDevice } from '../../src/model/devices';
import { selectionExists } from '../../src/panel/tool-factory';
import { deviceDefaults, type Id, type Level, type ZoneVertex } from '../../src/model/types';
import { rectRoomLevel } from '../fixtures';

const pal = paletteFor(true);
const free = (x: number, y: number): ZoneVertex => ({ kind: 'free', x, y });
const tri = (): ZoneVertex[] => [free(500, 500), free(2000, 500), free(1000, 2000)];

function host(content: ReturnType<typeof renderZones>): SVGSVGElement {
  const el = document.createElement('div');
  document.body.appendChild(el);
  render(html`<svg xmlns="http://www.w3.org/2000/svg">${content}</svg>`, el);
  return el.querySelector('svg')!;
}

function twoZones(): { level: Level; a: Id; b: Id } {
  const r = addPolygonZone(rectRoomLevel(3000, 4000, 400), tri(), 'Alpha');
  const r2 = addPolygonZone(r.level, [free(1500, 2500), free(2500, 2500), free(2000, 3500)], 'Beta');
  return { level: r2.level, a: r.zoneId!, b: r2.zoneId! };
}

describe('renderZones', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('two zones get the first two hues and labels with their names', () => {
    const { level } = twoZones();
    const root = host(renderZones(level, { palette: pal, scale: 0.1, selectedId: null }));
    const zs = root.querySelectorAll('g.azones > g.azone');
    expect(zs.length).toBe(2);
    const fills = [...zs].map(z => z.querySelector('path.azone-fill')!);
    expect(fills[0].getAttribute('fill')).toBe(ZONE_HUES[0]);
    expect(fills[1].getAttribute('fill')).toBe(ZONE_HUES[1]);
    expect(fills[0].getAttribute('fill-opacity')).toBe('0.18');
    expect(fills[0].getAttribute('stroke')).toBe(ZONE_HUES[0]);
    expect([...zs].map(z => z.querySelector('text.azone-label')!.textContent)).toEqual(['Alpha', 'Beta']);
  });

  it('an invalid zone is hatched', () => {
    const { level, a } = twoZones();
    const bad: Level = { ...level, zones: level.zones.map(z => z.id === a ? { ...z, invalid: true } : z) };
    const root = host(renderZones(bad, { palette: pal, scale: 0.1, selectedId: null }));
    const zone = root.querySelector(`g.azone[data-id="${a}"]`)!;
    expect(zone.classList.contains('invalid')).toBe(true);
    expect(zone.querySelector('path.azone-fill')!.getAttribute('fill')).toBe('url(#azone-hatch)');
    expect(root.querySelector('pattern#azone-hatch line')!.getAttribute('stroke')).toBe(pal.invalid);
    expect(root.querySelectorAll('g.azone.invalid').length).toBe(1);
  });

  it('the selected polygon zone shows one handle per vertex; a lost vertex handle has class lost', () => {
    const { level, a, b } = twoZones();
    const lost: Level = {
      ...level,
      zones: level.zones.map(z => z.id === a && z.shape.kind === 'polygon'
        ? { ...z, shape: { kind: 'polygon', vertices: z.shape.vertices.map((v, i) => i === 1 ? { ...v, lost: true as const } : v) } } : z),
    };
    const root = host(renderZones(lost, { palette: pal, scale: 0.1, selectedId: a }));
    const sel = root.querySelector(`g.azone[data-id="${a}"]`)!;
    expect(sel.classList.contains('selected')).toBe(true);
    expect(sel.querySelector('path.azone-fill')!.getAttribute('stroke-width')).toBe('3');
    const hs = [...root.querySelectorAll('circle.azone-vertex')];
    expect(hs.length).toBe(3);
    expect(hs.map(h => h.getAttribute('data-index'))).toEqual(['0', '1', '2']);
    expect(hs.map(h => h.classList.contains('lost'))).toEqual([false, true, false]);
    expect(hs[1].getAttribute('stroke')).toBe(pal.invalid);
    expect(hs[0].getAttribute('r')).toBe(String(5 / 0.1));
    expect(root.querySelector(`g.azone[data-id="${b}"]`)!.classList.contains('selected')).toBe(false);
  });

  it('a selected walls zone has no vertex handles', () => {
    const r = addWallsZone(rectRoomLevel(3000, 4000, 400), { x: 1500, y: 2000 }, 'Kitchen');
    const root = host(renderZones(r.level, { palette: pal, scale: 0.1, selectedId: r.zoneId }));
    expect(root.querySelectorAll('circle.azone-vertex').length).toBe(0);
    expect(root.querySelector('text.azone-label')!.textContent).toBe('Kitchen');
  });

  it('member rings: in for participating, out for blacklisted', () => {
    const { level, a } = twoZones();
    const d1 = addDevice(level, deviceDefaults('ceiling_light', 'free'), { mode: 'free', x: 1000, y: 1000, rotation: 0 }, 'L1');
    const d2 = addDevice(d1.level, deviceDefaults('ceiling_light', 'free'), { mode: 'free', x: 1100, y: 900, rotation: 0 }, 'L2');
    const l = setZoneParticipation(d2.level, d2.deviceId!, a, false);
    const root = host(renderZones(l, { palette: pal, scale: 0.1, selectedId: a }));
    expect(root.querySelectorAll('circle.member-ring.in').length).toBe(1);
    expect(root.querySelectorAll('circle.member-ring.out').length).toBe(1);
    expect(root.querySelector('circle.member-ring.out')!.getAttribute('stroke-dasharray')).toBeTruthy();
    const none = host(renderZones(l, { palette: pal, scale: 0.1, selectedId: null }));
    expect(none.querySelectorAll('circle.member-ring').length).toBe(0);
  });

  it('the draft polyline ends at the cursor and is marked invalid when asked', () => {
    const { level } = twoZones();
    const draft = { points: [{ x: 0, y: 0 }, { x: 100, y: 0 }], cursor: { x: 100, y: 200 }, invalid: false };
    const r1 = host(renderZones(level, { palette: pal, scale: 0.1, selectedId: null, draft }));
    const pl = r1.querySelector('polyline.azone-draft')!;
    expect(pl.getAttribute('points')).toBe('0,0 100,0 100,200');
    expect(pl.classList.contains('invalid')).toBe(false);
    const r2 = host(renderZones(level, { palette: pal, scale: 0.1, selectedId: null, draft: { ...draft, invalid: true } }));
    expect(r2.querySelector('polyline.azone-draft')!.classList.contains('invalid')).toBe(true);
  });
});

describe('renderLevel zones layer', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('draws zones only in zones mode and dims walls there', () => {
    const { level, a } = twoZones();
    const draw = (mode: 'plan' | 'zones', selection: { kind: 'zone'; id: Id } | null = null): SVGSVGElement => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      render(html`<svg xmlns="http://www.w3.org/2000/svg">${renderLevel(level, { palette: pal, selection, preview: {}, scale: 0.1, mode })}</svg>`, el);
      return el.querySelector('svg')!;
    };
    expect(draw('plan').querySelector('.azones')).toBeNull();
    const z = draw('zones', { kind: 'zone', id: a });
    expect(z.querySelector('.azones')).not.toBeNull();
    expect(z.querySelector('g.azone.selected')).not.toBeNull();
    expect(z.querySelector('path.walls')!.getAttribute('opacity')).toBe(String(pal.dimOpacity));
  });
});

const NO_POWER = { blocks: [], wires: [] };

describe('selectionExists', () => {
  it('handles a zone', () => {
    const { level, a } = twoZones();
    expect(selectionExists(level, { kind: 'zone', id: a }, NO_POWER)).toBe(true);
    expect(selectionExists(level, { kind: 'zone', id: 'nope' }, NO_POWER)).toBe(false);
    expect(selectionExists(rectRoomLevel(1000, 1000, 100), { kind: 'zone', id: a }, NO_POWER)).toBe(false);
  });
});
