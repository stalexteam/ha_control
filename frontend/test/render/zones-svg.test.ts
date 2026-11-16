// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { html, render, type TemplateResult } from 'lit';
import { renderZoneAreas, renderZoneOverlay, ZONE_HUES } from '../../src/render/zones-svg';
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

function host(content: unknown): SVGSVGElement {
  const el = document.createElement('div');
  document.body.appendChild(el);
  render(html`<svg xmlns="http://www.w3.org/2000/svg">${content as TemplateResult}</svg>`, el);
  return el.querySelector('svg')!;
}

function twoZones(): { level: Level; a: Id; b: Id } {
  const r = addPolygonZone(rectRoomLevel(3000, 4000, 400), tri(), 'Alpha');
  const r2 = addPolygonZone(r.level, [free(1500, 2500), free(2500, 2500), free(2000, 3500)], 'Beta');
  return { level: r2.level, a: r.zoneId!, b: r2.zoneId! };
}

const areas = (level: Level, selectedId: Id | null = null, mode: 'plan' | 'equipment' | 'binding' = 'plan') =>
  host(renderZoneAreas(level, { palette: pal, scale: 0.1, selectedId, mode }));

describe('renderZoneAreas', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('two zones get the first two hues, translucent fills and labels with name and area', () => {
    const { level } = twoZones();
    const root = areas(level);
    const paths = [...root.querySelectorAll('g.zones path.zone')];
    expect(paths.map(p => p.getAttribute('fill'))).toEqual([ZONE_HUES[0], ZONE_HUES[1]]);
    expect(paths[0].getAttribute('fill-opacity')).toBe('0.16');
    expect(paths[0].getAttribute('stroke')).toBe(ZONE_HUES[0]);
    const labels = [...root.querySelectorAll('text.zone-label')].map(t => t.textContent!.replace(/\s+/g, ' ').trim());
    expect(labels).toEqual(['Alpha 1.1 m²', 'Beta 0.5 m²']);
  });

  it('an invalid zone is hatched', () => {
    const { level, a } = twoZones();
    const bad: Level = { ...level, zones: level.zones.map(z => z.id === a ? { ...z, invalid: true } : z) };
    const root = areas(bad);
    const zone = root.querySelector(`path.zone[data-id="${a}"]`)!;
    expect(zone.classList.contains('broken')).toBe(true);
    expect(zone.getAttribute('fill')).toBe('url(#zone-hatch)');
    expect(root.querySelector('pattern#zone-hatch line')!.getAttribute('stroke')).toBe(pal.invalid);
  });

  it('the selected zone is drawn last with the selection stroke; the others are dimmed', () => {
    const { level, a, b } = twoZones();
    const root = areas(level, a);
    const paths = [...root.querySelectorAll('g.zones path.zone')];
    expect(paths.map(p => p.getAttribute('data-id'))).toEqual([b, a]);
    expect(paths[1].classList.contains('selected')).toBe(true);
    expect(paths[1].getAttribute('stroke')).toBe(pal.selection);
    expect(root.querySelector(`g.zone-item[data-id="${b}"]`)!.getAttribute('opacity')).toBe('0.55');
    expect(root.querySelector(`g.zone-item[data-id="${a}"]`)!.getAttribute('opacity')).toBeNull();
  });

  it('Equipment and Binding: thin outlines in the zone hue, no fill and no labels', () => {
    const { level } = twoZones();
    for (const mode of ['equipment', 'binding'] as const) {
      const root = areas(level, null, mode);
      const paths = [...root.querySelectorAll('g.zones path.zone')];
      expect(paths.map(p => p.getAttribute('fill'))).toEqual(['none', 'none']);
      expect(paths.map(p => p.getAttribute('stroke'))).toEqual([ZONE_HUES[0], ZONE_HUES[1]]);
      expect(root.querySelectorAll('text.zone-label')).toHaveLength(0);
    }
  });

  it('the label of a zone avoids the zones nested inside it', () => {
    // A 4000 x 4000 room with a 2000 x 2000 polygon in its middle: the room label moves out of the middle.
    const room = addWallsZone(rectRoomLevel(4000, 4000, 200), { x: 500, y: 500 }, 'Main');
    const level = addPolygonZone(room.level, [free(1000, 1000), free(3000, 1000), free(3000, 3000), free(1000, 3000)], 'Middle').level;
    const root = areas(level);
    const at = (name: string) => {
      const t = [...root.querySelectorAll('text.zone-label')].find(x => x.textContent!.includes(name))!;
      return { x: Number(t.getAttribute('x')), y: Number(t.getAttribute('y')) };
    };
    expect(at('Middle').x).toBeCloseTo(2000);
    const main = at('Main');
    const inMiddle = main.x > 1000 && main.x < 3000 && main.y > 1000 && main.y < 3000;
    expect(inMiddle).toBe(false);
  });
});

describe('renderZoneOverlay', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('the selected polygon zone shows one handle per vertex; lost and selected vertices are marked', () => {
    const { level, a } = twoZones();
    const lost: Level = {
      ...level,
      zones: level.zones.map(z => z.id === a && z.shape.kind === 'polygon'
        ? { ...z, shape: { kind: 'polygon', vertices: z.shape.vertices.map((v, i) => i === 1 ? { ...v, lost: true as const } : v) } } : z),
    };
    const root = host(renderZoneOverlay(lost, { palette: pal, scale: 0.1, selectedId: a, vertex: 2 }));
    const hs = [...root.querySelectorAll('circle.zone-vertex')];
    expect(hs.map(h => h.getAttribute('data-index'))).toEqual(['0', '1', '2']);
    expect(hs.map(h => h.classList.contains('lost'))).toEqual([false, true, false]);
    expect(hs.map(h => h.classList.contains('on'))).toEqual([false, false, true]);
    expect(hs[1].getAttribute('stroke')).toBe(pal.invalid);
    expect(hs[0].getAttribute('r')).toBe(String(5 / 0.1));
  });

  it('a selected walls zone has no vertex handles', () => {
    const r = addWallsZone(rectRoomLevel(3000, 4000, 400), { x: 1500, y: 2000 }, 'Kitchen');
    const root = host(renderZoneOverlay(r.level, { palette: pal, scale: 0.1, selectedId: r.zoneId }));
    expect(root.querySelectorAll('circle.zone-vertex').length).toBe(0);
  });

  it('member rings: in for participating, out for blacklisted', () => {
    const { level, a } = twoZones();
    const d1 = addDevice(level, deviceDefaults('ceiling_light', 'free'), { mode: 'free', x: 1000, y: 1000, rotation: 0 }, 'L1');
    const d2 = addDevice(d1.level, deviceDefaults('ceiling_light', 'free'), { mode: 'free', x: 1100, y: 900, rotation: 0 }, 'L2');
    const l = setZoneParticipation(d2.level, d2.deviceId!, a, false);
    const root = host(renderZoneOverlay(l, { palette: pal, scale: 0.1, selectedId: a }));
    expect(root.querySelectorAll('circle.member-ring.in').length).toBe(1);
    expect(root.querySelectorAll('circle.member-ring.out').length).toBe(1);
    const none = host(renderZoneOverlay(l, { palette: pal, scale: 0.1, selectedId: null }));
    expect(none.querySelectorAll('circle.member-ring').length).toBe(0);
  });

  it('the draft polyline ends at the cursor and is marked invalid when asked', () => {
    const { level } = twoZones();
    const draft = { points: [{ x: 0, y: 0 }, { x: 100, y: 0 }], cursor: { x: 100, y: 200 }, invalid: false };
    const r1 = host(renderZoneOverlay(level, { palette: pal, scale: 0.1, selectedId: null, draft }));
    const pl = r1.querySelector('polyline.zone-draft')!;
    expect(pl.getAttribute('points')).toBe('0,0 100,0 100,200');
    expect(pl.classList.contains('invalid')).toBe(false);
    const r2 = host(renderZoneOverlay(level, { palette: pal, scale: 0.1, selectedId: null, draft: { ...draft, invalid: true } }));
    expect(r2.querySelector('polyline.zone-draft')!.classList.contains('invalid')).toBe(true);
  });
});

describe('renderLevel zones', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('the Plan step draws handles of the selected zone and the draft; Equipment draws neither', () => {
    const { level, a } = twoZones();
    const draw = (mode: 'plan' | 'equipment'): SVGSVGElement => host(renderLevel(level, {
      palette: pal, selection: { kind: 'zone', id: a }, scale: 0.1, mode,
      preview: { zoneDraft: { points: [{ x: 0, y: 0 }], cursor: { x: 10, y: 10 }, invalid: false } },
    }));
    const plan = draw('plan');
    expect(plan.querySelectorAll('circle.zone-vertex')).toHaveLength(3);
    expect(plan.querySelector('polyline.zone-draft')).not.toBeNull();
    const eq = draw('equipment');
    expect(eq.querySelectorAll('circle.zone-vertex')).toHaveLength(0);
    expect(eq.querySelector('g.zones')!.getAttribute('opacity')).toBe(String(pal.dimOpacity));
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
