import { describe, it, expect, vi } from 'vitest';

const built = vi.hoisted(() => ({ n: 0 }));
// lineOfSightObstacles builds the wall pieces exactly once per call: count those.
vi.mock('../../src/geometry/walls', async importActual => {
  const actual = await importActual<typeof import('../../src/geometry/walls')>();
  return { ...actual, wallPieces: (...a: Parameters<typeof actual.wallPieces>) => { built.n++; return actual.wallPieces(...a); } };
});

import { cachedObstacles } from '../../src/geometry/visibility';
import { clippedCone } from '../../src/geometry/devices';
import { neighbourZones } from '../../src/model/neighbours';
import type { Device, Id, Level, Zone } from '../../src/model/types';
import { midGap, twoRoomsLevel } from '../fixtures';

const box = (id: Id, x0: number, y0: number, x1: number, y1: number): Zone => ({
  id, name: id, invalid: false,
  shape: { kind: 'polygon', vertices: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
});
const pir = (id: Id, x: number, y: number, rot: number): Device => ({
  id, name: id, placement: { mode: 'free', x, y, rotation: rot }, invalid: false, props: { kind: 'motion_sensor', zoneAngle: 110, zoneRange: 5000 },
});
const scene = (devices: Device[]): Level => ({
  ...twoRoomsLevel([midGap('door')]), zones: [box('a', 100, 100, 2900, 2900), box('b', 3100, 100, 5900, 2900)], devices,
});

describe('shared line-of-sight obstacles', () => {
  it('are built once per medium for the same walls, nodes and openings, also across a level copy', () => {
    const level = scene([]);
    const before = built.n;
    const first = cachedObstacles(level, 'motion');
    expect(cachedObstacles(level, 'motion')).toBe(first);
    expect(cachedObstacles({ ...level, devices: [pir('x', 1, 1, 0)] }, 'motion')).toBe(first);
    expect(built.n - before).toBe(1);
    expect(cachedObstacles(level, 'light')).not.toBe(first);
  });

  it('are built once for several sensors, and the neighbours equal those from the default obstacle set', () => {
    const devices = [pir('s1', 4500, 1500, 180), pir('s2', 5000, 1400, 180), pir('s3', 4500, 2500, 90), pir('s4', 4500, 600, 180)];
    const level = scene(devices);
    const before = built.n;
    const got = neighbourZones(level, 'a', []).map(n => `${n.zone?.id}:${n.sensors.map(d => d.id)}`);
    expect(built.n - before).toBe(1);
    // The same derivation with every cone clipped against a freshly built obstacle set (no shared cache).
    const fresh = scene(devices);
    const rings = (d: Device) => JSON.stringify(clippedCone(fresh, d));
    for (const d of devices) expect(JSON.stringify(clippedCone(level, d, cachedObstacles))).toBe(rings(d));
    expect(got).toEqual(['b:s1,s2,s3,s4']);
  });
});
