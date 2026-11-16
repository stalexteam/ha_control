// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addPolygonZone, addWallsZone, deleteZone, insertZoneVertex, keepZoneOutline, removeZoneVertex, setZoneAutomation,
  setZoneParticipation,
} from '../../src/model/zones';
import { addBox, deleteWall, type WallProps } from '../../src/model/ops';
import { addDevice } from '../../src/model/devices';
import { deviceZones, zoneArea, zoneInvalidReason, zoneOutline } from '../../src/geometry/zones';
import { History } from '../../src/editor/history';
import { deviceDefaults, emptyLevel, type Id, type Level, type Zone, type ZoneVertex } from '../../src/model/types';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import { DRAFT_PREFIX } from '../../src/editor/draft';
import { mount } from '../panel/helpers';

const part: WallProps = { type: 'partition', thickness: 100, baseline: 'center' };
/** A 4 x 3 m room measured at the inner faces: inner (0,0)-(4000,3000). */
const room = (): Level => addBox(emptyLevel('l0'), { x: 0, y: 0 }, { x: 4000, y: 3000 }, part, 'inner');
const free = (x: number, y: number): ZoneVertex => ({ kind: 'free', x, y });
const zoneOf = (l: Level, id: Id): Zone => l.zones.find(z => z.id === id)!;
const verts = (l: Level, id: Id): ZoneVertex[] => {
  const s = zoneOf(l, id).shape;
  if (s.kind !== 'polygon') throw new Error('not a polygon');
  return s.vertices;
};

describe('zones v2 model', () => {
  it('walls zone from a click', () => {
    const r = addWallsZone(room(), { x: 2000, y: 1500 }, 'Kitchen');
    expect(r.existing).toBe(false);
    const z = zoneOf(r.level, r.zoneId!);
    expect(z).toMatchObject({ name: 'Kitchen', invalid: false, shape: { kind: 'walls', seed: { x: 2000, y: 1500 }, broken: false } });
    expect('automation' in z).toBe(false);
    expect(zoneArea(r.level, z)).toBe(12);
    expect(zoneArea(r.level, z)!.toFixed(1)).toBe('12.0');
    // Outside every loop: nothing.
    const out = addWallsZone(room(), { x: 9000, y: 9000 }, 'X');
    expect(out.zoneId).toBeNull();
    expect(out.existing).toBe(false);
  });

  it('same loop selects the existing zone', () => {
    const a = addWallsZone(room(), { x: 2000, y: 1500 }, 'Kitchen');
    const b = addWallsZone(a.level, { x: 500, y: 500 }, 'Other');
    expect(b).toEqual({ level: a.level, zoneId: a.zoneId, existing: true });
    expect(b.level).toBe(a.level);
  });

  it('walls zone breaks and keeps outline', () => {
    const a = addWallsZone(room(), { x: 2000, y: 1500 }, 'Kitchen');
    const id = a.zoneId!;
    const kept = zoneOutline(a.level, zoneOf(a.level, id));
    const history = new History<Level>(a.level);
    const broken = deleteWall(a.level, a.level.walls[0].id);
    history.push(broken);
    const z = zoneOf(broken, id);
    expect(z.shape).toMatchObject({ kind: 'walls', broken: true });
    expect(zoneOutline(broken, z)).toEqual(kept);
    expect(z.invalid).toBe(true);
    expect(zoneInvalidReason(broken, z)).toBe('broken');

    const poly = keepZoneOutline(broken, id);
    history.push(poly);
    const p = zoneOf(poly, id);
    expect(p.name).toBe('Kitchen');
    expect(p.shape).toEqual({ kind: 'polygon', vertices: kept.map(q => ({ kind: 'free', x: q.x, y: q.y, lost: true })) });
    expect(p.invalid).toBe(true);
    expect(zoneInvalidReason(poly, p)).toBe('lost');
    expect(poly.walls).toBe(broken.walls);
    expect(keepZoneOutline(poly, id)).toBe(poly); // already a polygon

    // The automation flag survives the conversion.
    const off = setZoneAutomation(broken, id, false);
    expect(zoneOf(keepZoneOutline(off, id), id).automation).toBe(false);

    expect(history.undo()).toBe(broken);
    expect(zoneOf(history.current, id).shape.kind).toBe('walls');
    expect(history.undo()).toBe(a.level);
    expect(zoneOf(history.current, id)).toMatchObject({ invalid: false, shape: { broken: false } });
  });

  it('insert/remove vertex', () => {
    const r = addPolygonZone(room(), [free(500, 500), free(1500, 500), free(1500, 1500)], 'Zone');
    const id = r.zoneId!;
    expect(removeZoneVertex(r.level, id, 0)).toBe(r.level); // refused at 3
    const four = insertZoneVertex(r.level, id, 3, { kind: 'free', x: 500, y: 1500, lost: true });
    expect(verts(four, id)).toEqual([free(500, 500), free(1500, 500), free(1500, 1500), free(500, 1500)]);
    expect(zoneOf(four, id).invalid).toBe(false);
    expect(zoneArea(four, zoneOf(four, id))).toBe(1);
    expect(insertZoneVertex(r.level, id, 9, free(0, 0))).toBe(r.level);
    expect(insertZoneVertex(r.level, 'nope', 0, free(0, 0))).toBe(r.level);
    const three = removeZoneVertex(four, id, 1);
    expect(verts(three, id)).toEqual([free(500, 500), free(1500, 1500), free(500, 1500)]);
    expect(removeZoneVertex(three, id, 0)).toBe(three);
    expect(removeZoneVertex(four, id, 4)).toBe(four);
    // A walls zone has no vertices to edit.
    const w = addWallsZone(room(), { x: 2000, y: 1500 }, 'W');
    expect(insertZoneVertex(w.level, w.zoneId!, 0, free(0, 0))).toBe(w.level);
    expect(removeZoneVertex(w.level, w.zoneId!, 0)).toBe(w.level);
  });

  it('deleteZone cleans blacklists', () => {
    const a = addWallsZone(room(), { x: 2000, y: 1500 }, 'Kitchen');
    const b = addPolygonZone(a.level, [free(500, 500), free(1500, 500), free(1500, 1500)], 'Corner');
    const d = addDevice(b.level, deviceDefaults('ceiling_light', 'free'), { mode: 'free', x: 1200, y: 800, rotation: 0 }, 'L');
    let l = setZoneParticipation(d.level, d.deviceId!, a.zoneId!, false);
    l = setZoneParticipation(l, d.deviceId!, b.zoneId!, false);
    const r = deleteZone(l, a.zoneId!);
    expect(r.zones.map(z => z.id)).toEqual([b.zoneId]);
    expect(r.devices[0].zoneBlacklist).toEqual([b.zoneId]);
    const r2 = deleteZone(r, b.zoneId!);
    expect(r2.zones).toEqual([]);
    expect('zoneBlacklist' in r2.devices[0]).toBe(false);
    expect(r2.walls).toBe(l.walls);
    expect(deleteZone(r2, 'nope')).toBe(r2);
  });

  it('setZoneAutomation off/on', () => {
    const a = addWallsZone(room(), { x: 2000, y: 1500 }, 'Kitchen');
    const id = a.zoneId!;
    expect(setZoneAutomation(a.level, id, true)).toBe(a.level);
    const off = setZoneAutomation(a.level, id, false);
    expect(zoneOf(off, id).automation).toBe(false);
    expect(setZoneAutomation(off, id, false)).toBe(off);
    const on = setZoneAutomation(off, id, true);
    expect('automation' in zoneOf(on, id)).toBe(false);
    expect(setZoneAutomation(a.level, 'nope', false)).toBe(a.level);
  });

  it('overlapping zones both contain a device', () => {
    const a = addWallsZone(room(), { x: 2000, y: 1500 }, 'Main');
    const b = addPolygonZone(a.level, [free(500, 500), free(1500, 500), free(1500, 1500), free(500, 1500)], 'middle');
    const d = addDevice(b.level, deviceDefaults('ceiling_light', 'free'), { mode: 'free', x: 1000, y: 1000, rotation: 0 }, 'L');
    const dev = d.level.devices[0];
    expect(deviceZones(d.level, dev).map(x => x.zone.name)).toEqual(['Main', 'middle']);
    expect(zoneArea(d.level, zoneOf(d.level, a.zoneId!))).toBe(12);
    expect(zoneArea(d.level, zoneOf(d.level, b.zoneId!))).toBe(1);
  });
});

describe('zones v2 drafts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('v1 draft discarded with notice', async () => {
    const level = { ...emptyLevel('l0'), automationZones: [] };
    const draft = { planId: 'old', baseRevision: null, savedAt: 1, plan: { id: 'old', name: 'Old', schemaVersion: 1, revision: 0, levels: [level] } };
    localStorage.setItem(DRAFT_PREFIX + 'old', JSON.stringify(draft));
    const el = await mount(createMockHass());
    await vi.waitFor(() => expect(el.notice).toBe('A draft from an older version was discarded.'));
    expect(el.pendingDraft).toBeNull();
    expect(el.dialog).toBeNull();
    expect(localStorage.getItem(DRAFT_PREFIX + 'old')).toBeNull();
    expect(el.plan!.schemaVersion).toBe(2);
  });

  it('v1 draft of a stored plan discarded with notice', async () => {
    const plan = { id: 'P1', name: 'Home', schemaVersion: 2, revision: 3, levels: [emptyLevel('l0')] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
    const level = { ...emptyLevel('l0'), automationZones: [] };
    const draft = { planId: 'P1', baseRevision: 3, savedAt: 1, plan: { id: 'P1', name: 'Home', schemaVersion: 1, revision: 3, levels: [level] } };
    localStorage.setItem(DRAFT_PREFIX + 'P1', JSON.stringify(draft));
    const el = await mount(createMockHass());
    await vi.waitFor(() => expect(el.notice).toBe('A draft from an older version was discarded.'));
    expect(el.plan!.id).toBe('P1');
    expect(el.pendingDraft).toBeNull();
    expect(el.dialog).toBeNull();
    expect(localStorage.getItem(DRAFT_PREFIX + 'P1')).toBeNull();
  });

  it('v1 plan from an older server is not adopted', async () => {
    const rooms = [{ id: 'r1', name: 'Kitchen', seed: { x: 1, y: 1 }, outline: [], broken: false }];
    const plan = { id: 'P1', name: 'Home', schemaVersion: 1, revision: 3, levels: [{ ...emptyLevel('l0'), zones: rooms, automationZones: [] }] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
    const el = document.createElement('plan-studio-panel');
    el.hass = createMockHass();
    document.body.appendChild(el);
    const msg = 'Plan Studio on the server is older than this page: restart Home Assistant, then reload.';
    await vi.waitFor(() => expect(el.loadError).toBe(msg));
    await el.updateComplete;
    expect(el.plan).toBeNull();
    expect(el.history).toBeNull();
    expect(el.shadowRoot!.textContent).toContain(msg);
  });
});
