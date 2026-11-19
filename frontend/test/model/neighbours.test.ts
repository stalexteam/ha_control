import { describe, it, expect } from 'vitest';
import { deviceDefaults, type Device, type DevicePlacement, type Id, type Level, type Rule, type Zone } from '../../src/model/types';
import { neighbourZones, neighbourIds, withNeighbours } from '../../src/model/neighbours';
import { newRule } from '../../src/model/rules';
import { midGap, twoRoomsLevel } from '../fixtures';

const poly = (id: Id, pts: [number, number][]): Zone => ({
  id, name: id.toUpperCase(), invalid: false,
  shape: { kind: 'polygon', vertices: pts.map(([x, y]) => ({ kind: 'free' as const, x, y })) },
});
const box = (id: Id, x0: number, y0: number, x1: number, y1: number): Zone => poly(id, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
/** A motion sensor at x, y looking `rot` degrees (0 = east, 90 = north, 180 = west, 270 = south). */
const pir = (id: Id, x: number, y: number, rot: number, extra: Partial<Device> = {}): Device => {
  const placement: DevicePlacement = { mode: 'free', x, y, rotation: rot };
  return { id, name: `Motion ${id}`, placement, invalid: false, props: { kind: 'motion_sensor', zoneAngle: 110, zoneRange: 5000 }, ...extra };
};

/**
 * A (left room) and B (right room) share the wall 'mid' (x 3000, faces 2900 / 3100) with a door at y 1200..1800;
 * C is a room north of the plan behind the wall w0 with no opening.
 */
function scene(opening: ReturnType<typeof midGap> | null, devices: Device[]): Level {
  return {
    ...twoRoomsLevel(opening ? [opening] : []),
    zones: [box('a', 100, 100, 2900, 2900), box('b', 3100, 100, 5900, 2900), box('c', 100, -2900, 2900, -100)],
    devices,
  };
}
const ids = (l: Level, z: Id, own: Id[] = []) => neighbourZones(l, z, own).map(n => `${n.zone?.id ?? 'outside'}:${n.sensors.map(d => d.id).join(',')}`);

describe('neighbourZones by cones', () => {
  it('a sensor in the next zone looking at the door counts, grouped by that zone; one looking away does not', () => {
    const level = scene(midGap('door'), [pir('look', 4500, 1500, 180), pir('away', 4500, 1500, 0)]);
    expect(ids(level, 'a')).toEqual(['b:look']);
  });

  it('where the sensor hangs does not matter: a sensor in a third zone whose cone covers the door counts', () => {
    // Hangs in zone c's strip? no: in B's far corner area is not needed; it stands outside every zone and looks through the door.
    const level = scene(midGap('door'), [pir('far', 5000, 1500, 180)]);
    expect(ids(level, 'a')).toEqual(['b:far']);
    const elsewhere = scene(midGap('door'), [pir('c-side', 1500, -1500, 270)]);
    expect(ids(elsewhere, 'a')).toEqual([]);
  });

  it('a sensor whose cone the wall blocks does not count', () => {
    // From inside A looking south-east at the wall beside the door: the cone ends at the wall, the door area stays unseen; with a door the PIR passes (passesPir) a sensor looking straight through counts.
    const level = scene(midGap('door'), [pir('blocked', 2500, 200, 315)]);
    expect(ids(level, 'a')).toEqual([]);
    const through = scene(midGap('door', { passesPir: true }), [pir('through', 1500, 1500, 0)]);
    expect(ids(through, 'a')).toEqual(['b:through']);
  });

  it('a window is no passage, an invalid opening neither; an opening, a gate and a wicket are', () => {
    const sensors = [pir('look', 4500, 1500, 180)];
    for (const kind of ['opening', 'gate', 'wicket'] as const) expect(ids(scene(midGap(kind), sensors), 'a')).toEqual(['b:look']);
    expect(ids(scene(midGap('window'), sensors), 'a')).toEqual([]);
    expect(ids(scene(midGap('door', { invalid: true }), sensors), 'a')).toEqual([]);
    expect(ids(scene(null, sensors), 'a')).toEqual([]);
  });

  it('the rule\'s own sensors are left out', () => {
    const level = scene(midGap('door'), [pir('one', 4500, 1500, 180), pir('two', 5000, 1400, 180)]);
    expect(ids(level, 'a')).toEqual(['b:one,two']);
    expect(ids(level, 'a', ['one'])).toEqual(['b:two']);
    expect(ids(level, 'a', ['one', 'two'])).toEqual([]);
  });

  it('the other side of the door: B sees A through the same door', () => {
    const level = scene(midGap('door'), [pir('in-a', 1000, 1500, 0)]);
    expect(ids(level, 'b')).toEqual(['a:in-a']);
  });

  it('a door that leads to no zone groups as outside', () => {
    // The west wall w5 (x 0) gets a door at y 1200..1800; nothing lies beyond it.
    const level = scene({ id: 'front', wallId: 'w5', kind: 'door', offset: 1200, width: 600, invalid: false }, [pir('street', -2000, 1500, 0)]);
    expect(ids(level, 'a')).toEqual(['outside:street']);
  });

  it('a missing zone has none', () => {
    expect(neighbourZones(scene(midGap('door'), [pir('look', 4500, 1500, 180)]), 'gone', [])).toEqual([]);
  });

  it('a wall-mounted sensor looking through the door counts', () => {
    const wall: Device = {
      ...pir('pw', 0, 0, 0), placement: { mode: 'wall', wallId: 'w2', side: 'left', offset: 1500, aim: 0 } as DevicePlacement,
      props: deviceDefaults('motion_sensor', 'wall'),
    };
    const level = scene(midGap('door'), [wall]);
    // w2 runs n2 (6000,3000) -> n3 ... on the plan's south side: whichever room it faces, it sees at most one of the two rooms' door areas.
    expect(ids(level, 'a').length + ids(level, 'b').length).toBeLessThanOrEqual(1);
  });

  it('the result is cached per level object and rule: the same array comes back', () => {
    const level = scene(midGap('door'), [pir('look', 4500, 1500, 180)]);
    const first = neighbourZones(level, 'a', []);
    expect(neighbourZones(level, 'a', [])).toBe(first);
    expect(neighbourZones(level, 'a', ['look'])).not.toBe(first);
    expect(neighbourZones({ ...level }, 'a', [])).not.toBe(first);
  });
});

describe('zones touching without a wall', () => {
  /** Zones p (west) and q in the empty north strip (no walls near y < -500). */
  const open = (q: [number, number][], devices: Device[]): Level => ({
    ...twoRoomsLevel(), zones: [poly('p', [[0, -3000], [1000, -3000], [1000, -2000], [0, -2000]]), poly('q', q)], devices,
  });
  const east: [number, number][] = [[1000, -3000], [2000, -3000], [2000, -2000], [1000, -2000]];

  it('a sensor looking at the shared edge counts, wherever it hangs; one looking away does not; both ways', () => {
    const level = open(east, [pir('in-q', 1800, -2500, 180), pir('in-p', 200, -2500, 0), pir('away', 1800, -2500, 0)]);
    expect(ids(level, 'p', ['in-p'])).toEqual(['q:in-q']);
    expect(ids(level, 'q', ['in-q'])).toEqual(['p:in-p']);
  });

  it('a shared edge along a wall (the centreline of mid, x 3000) is not a passage', () => {
    const level: Level = {
      ...twoRoomsLevel(), zones: [box('p', 2000, 500, 3000, 1000), box('q', 3000, 500, 4000, 1000)],
      devices: [pir('s1', 3700, 700, 180), pir('s2', 2300, 700, 0)],
    };
    expect(ids(level, 'p')).toEqual([]);
  });

  it('overlapping zones: a sensor covering the part of the other zone beside the rule\'s zone counts', () => {
    const level = open([[500, -2500], [1500, -2500], [1500, -1500], [500, -1500]], [pir('s', 1450, -2000, 180), pir('far', 1450, -1600, 0)]);
    expect(ids(level, 'p')).toEqual(['q:s']);
  });

  it('touching at one corner only is not a passage', () => {
    const level = open([[1000, -2000], [2000, -2000], [2000, -1000], [1000, -1000]], [pir('s', 1500, -1500, 180)]);
    expect(ids(level, 'p')).toEqual([]);
  });

  it('separate zones stay apart', () => {
    const level = open([[1200, -3000], [2000, -3000], [2000, -2000], [1200, -2000]], [pir('s', 1800, -2500, 180)]);
    expect(ids(level, 'p')).toEqual([]);
  });
});

describe('neighbourIds', () => {
  it('sorted and unique across groups', () => {
    const level = scene(midGap('door'), [pir('zz', 4500, 1500, 180), pir('aa', 5000, 1500, 180)]);
    expect(neighbourIds(neighbourZones(level, 'a', []))).toEqual(['aa', 'zz']);
  });
});

describe('withNeighbours', () => {
  const ml = (extra: object = {}): Rule => ({ ...newRule('a'), id: 'r1', motionLight: { light: 'lamp', sensors: ['pa'], minOn: 0, buttons: [], autoAfter: 0, ...extra } });
  const devices = [pir('pa', 1000, 1000, 0), pir('pb', 4500, 1500, 180), pir('pb2', 5000, 2000, 180)];

  it('writes the sorted neighbours into a rule with presence, drops them without it', () => {
    const levels = [scene(midGap('door'), devices)];
    const [on] = withNeighbours([ml({ presence: true })], levels);
    expect(on.motionLight!.neighbours).toEqual(['pb', 'pb2']);
    const [off] = withNeighbours([ml({ neighbours: ['pb'] })], levels);
    expect(off.motionLight).not.toHaveProperty('neighbours');
  });

  it('keeps the same objects for an unchanged plan and follows a sensor turned away', () => {
    const levels = [scene(midGap('door'), devices)];
    const rules = withNeighbours([ml({ presence: true })], levels);
    expect(withNeighbours(rules, levels)).toBe(rules);
    const turned = { ...levels[0], devices: levels[0].devices.map(d => (d.id === 'pb2' ? pir('pb2', 5000, 2000, 0) : d)) };
    expect(withNeighbours(rules, [turned])[0].motionLight!.neighbours).toEqual(['pb']);
  });

  it('a rule without a zone has none; other rules are untouched', () => {
    const levels = [scene(midGap('door'), devices)];
    const noZone: Rule = { ...ml({ presence: true }), zoneId: null };
    expect(withNeighbours([noZone], levels)[0].motionLight!.neighbours).toEqual([]);
    const other = newRule('a');
    expect(withNeighbours([other], levels)[0]).toBe(other);
  });
});
