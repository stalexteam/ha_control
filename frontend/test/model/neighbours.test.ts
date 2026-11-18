import { describe, it, expect } from 'vitest';
import { defaultsMode, deviceDefaults, type Device, type DevicePlacement, type Id, type Level, type Rule, type Zone } from '../../src/model/types';
import { neighbourZones, neighbourIds, withNeighbours } from '../../src/model/neighbours';
import { newRule } from '../../src/model/rules';
import { midGap, twoRoomsLevel } from '../fixtures';

const box = (id: Id, x0: number, y0: number, x1: number, y1: number): Zone => ({
  id, name: id.toUpperCase(), invalid: false,
  shape: { kind: 'polygon', vertices: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
});
const pir = (id: Id, x: number, y: number, extra: Partial<Device> = {}): Device => {
  const placement: DevicePlacement = { mode: 'free', x, y, rotation: 0 };
  return { id, name: `Motion ${id}`, placement, invalid: false, props: deviceDefaults('motion_sensor', defaultsMode('free')), ...extra };
};

/** A (left room) and B (right room) share the wall 'mid' (faces x 2900 / 3100); C is a room north of the plan behind the wall w0 with no opening. */
function scene(opening: ReturnType<typeof midGap> | null): Level {
  const base = twoRoomsLevel(opening ? [opening] : []);
  return {
    ...base,
    zones: [box('a', 100, 100, 2900, 2900), box('b', 3100, 100, 5900, 2900), box('c', 100, -2900, 2900, -100)],
    devices: [pir('pa', 1000, 1000), pir('pb', 4000, 1000), pir('pb2', 5000, 2000), pir('pc', 1000, -1000)],
  };
}

describe('neighbourZones', () => {
  it('zones joined by a door are neighbours, the sensors in them listed, a zone without a door is not', () => {
    const level = scene(midGap('door'));
    const n = neighbourZones(level, 'a', []);
    expect(n.map(x => x.zone.id)).toEqual(['b']);
    expect(n[0].sensors.map(d => d.id)).toEqual(['pb', 'pb2']);
    expect(neighbourZones(level, 'b', []).map(x => x.zone.id)).toEqual(['a']);
    expect(neighbourZones(level, 'c', [])).toEqual([]);
  });

  it('an opening, a gate and a wicket connect, a window and an invalid opening do not', () => {
    for (const kind of ['opening', 'gate', 'wicket'] as const) expect(neighbourZones(scene(midGap(kind)), 'a', []).map(x => x.zone.id)).toEqual(['b']);
    expect(neighbourZones(scene(midGap('window')), 'a', [])).toEqual([]);
    expect(neighbourZones(scene(midGap('door', { invalid: true })), 'a', [])).toEqual([]);
    expect(neighbourZones(scene(null), 'a', [])).toEqual([]);
  });

  it('the rule\'s own sensors are left out; a neighbour zone left without sensors is not listed', () => {
    const level = scene(midGap('door'));
    expect(neighbourZones(level, 'a', ['pb'])[0].sensors.map(d => d.id)).toEqual(['pb2']);
    expect(neighbourZones(level, 'a', ['pb', 'pb2'])).toEqual([]);
  });

  it('only motion sensors count, and a sensor opted out of the zone does not', () => {
    const level = scene(midGap('door'));
    level.devices.push({ ...pir('sock', 4200, 1000), props: deviceDefaults('socket', 'free') });
    level.devices[1] = { ...level.devices[1], zoneBlacklist: ['b'] };
    expect(neighbourZones(level, 'a', [])[0].sensors.map(d => d.id)).toEqual(['pb2']);
  });

  it('a missing zone has none', () => {
    expect(neighbourZones(scene(midGap('door')), 'gone', [])).toEqual([]);
  });

  it('a sensor following a wall (wall-mounted) is placed by its pose', () => {
    const level = scene(midGap('door'));
    level.devices = [{ ...pir('pw', 0, 0), placement: { mode: 'wall', wallId: 'mid', side: 'right', offset: 400, aim: 0 } as DevicePlacement, props: deviceDefaults('motion_sensor', 'wall') }];
    // the 'right' face of mid (A to B runs n1 -> n4, down) is the west face = room A's side
    const inA = neighbourZones(level, 'a', []).length + neighbourZones(level, 'b', []).length;
    expect(inA).toBe(1);
  });
});

describe('zones touching without a wall', () => {
  const poly = (id: Id, pts: [number, number][]): Zone => ({
    id, name: id.toUpperCase(), invalid: false,
    shape: { kind: 'polygon', vertices: pts.map(([x, y]) => ({ kind: 'free' as const, x, y })) },
  });
  /** Zones p and q in the empty north strip (no walls near y < -500); one sensor in each. */
  const open = (q: [number, number][]): Level => ({
    ...twoRoomsLevel(), zones: [poly('p', [[0, -3000], [1000, -3000], [1000, -2000], [0, -2000]]), poly('q', q)],
    devices: [pir('sp', 500, -2500), pir('sq', 1500, -2500)],
  });
  const ids = (l: Level, z: Id) => neighbourZones(l, z, []).map(n => n.zone.id);

  it('a shared edge with no wall makes neighbours both ways', () => {
    const l = open([[1000, -3000], [2000, -3000], [2000, -2000], [1000, -2000]]);
    expect(ids(l, 'p')).toEqual(['q']);
    expect(ids(l, 'q')).toEqual(['p']);
  });

  it('a shared diagonal edge counts too', () => {
    const l = open([[1000, -3000], [2000, -3000], [2000, -2000], [0, -2000]]);
    expect(ids(l, 'q')).toEqual(['p']);
  });

  it('a shared edge along a wall (centreline of mid, x 3000) is not a passage', () => {
    const l: Level = {
      ...twoRoomsLevel(), zones: [poly('p', [[2000, 500], [3000, 500], [3000, 1000], [2000, 1000]]), poly('q', [[3000, 500], [4000, 500], [4000, 1000], [3000, 1000]])],
      devices: [pir('sp', 2500, 700), pir('sq', 3500, 700)],
    };
    expect(ids(l, 'p')).toEqual([]);
  });

  it('overlapping polygons are neighbours', () => {
    const l = open([[500, -2500], [1500, -2500], [1500, -1500], [500, -1500]]);
    expect(ids(l, 'p')).toEqual(['q']);
  });

  it('a nested zone is a neighbour of its container', () => {
    const l = open([[200, -2800], [800, -2800], [800, -2200], [200, -2200]]);
    expect(ids(l, 'p')).toEqual(['q']);
  });

  it('touching at one corner only is not a passage', () => {
    const l = open([[1000, -2000], [2000, -2000], [2000, -1000], [1000, -1000]]);
    expect(ids(l, 'p')).toEqual([]);
  });

  it('separate zones stay apart', () => {
    const l = open([[1200, -3000], [2000, -3000], [2000, -2000], [1200, -2000]]);
    expect(ids(l, 'p')).toEqual([]);
  });
});

describe('neighbourIds', () => {
  it('sorted and unique across zones', () => {
    const level = scene(midGap('door'));
    level.zones.push(box('d', 3100, 100, 5900, 2900)); // overlaps b
    expect(neighbourIds(neighbourZones(level, 'a', []))).toEqual(['pb', 'pb2']);
  });
});

describe('withNeighbours', () => {
  const ml = (extra: object = {}): Rule => ({ ...newRule('a'), id: 'r1', motionLight: { light: 'lamp', sensors: ['pa'], minOn: 0, buttons: [], autoAfter: 0, ...extra } });

  it('writes the sorted neighbours into a rule with presence, drops them without it', () => {
    const levels = [scene(midGap('door'))];
    const [on] = withNeighbours([ml({ presence: true })], levels);
    expect(on.motionLight!.neighbours).toEqual(['pb', 'pb2']);
    const [off] = withNeighbours([ml({ neighbours: ['pb'] })], levels);
    expect(off.motionLight).not.toHaveProperty('neighbours');
  });

  it('keeps the same objects for an unchanged plan and follows a moved sensor', () => {
    const levels = [scene(midGap('door'))];
    const rules = withNeighbours([ml({ presence: true })], levels);
    expect(withNeighbours(rules, levels)).toBe(rules);
    const moved = { ...levels[0], devices: levels[0].devices.map(d => (d.id === 'pb2' ? pir('pb2', 5000, -1000) : d)) };
    expect(withNeighbours(rules, [moved])[0].motionLight!.neighbours).toEqual(['pb']);
  });

  it('a rule without a zone or other rules are untouched; the rule is empty-neighboured, not dropped', () => {
    const levels = [scene(midGap('door'))];
    const noZone: Rule = { ...ml({ presence: true }), zoneId: null };
    expect(withNeighbours([noZone], levels)[0].motionLight!.neighbours).toEqual([]);
    const other = newRule('a');
    expect(withNeighbours([other], levels)[0]).toBe(other);
  });
});
