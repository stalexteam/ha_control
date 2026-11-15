// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { html, render } from 'lit';
import { renderDevices } from '../../src/render/devices-svg';
import { paletteFor } from '../../src/render/theme';
import { clippedCone } from '../../src/geometry/devices';
import { lineOfSightObstacles } from '../../src/geometry/visibility';
import { moveDevice } from '../../src/model/devices';
import { deviceDefaults, type Device, type DeviceKind, type Level } from '../../src/model/types';
import { rectRoomLevel } from '../fixtures';

// Call-through spies: they count the cone and obstacle computations the renderer's caches let through.
vi.mock('../../src/geometry/devices', async importOriginal => {
  const m = await importOriginal<typeof import('../../src/geometry/devices')>();
  return { ...m, clippedCone: vi.fn(m.clippedCone) };
});
vi.mock('../../src/geometry/visibility', async importOriginal => {
  const m = await importOriginal<typeof import('../../src/geometry/visibility')>();
  return { ...m, lineOfSightObstacles: vi.fn(m.lineOfSightObstacles) };
});

const cones = vi.mocked(clippedCone);
const obstacles = vi.mocked(lineOfSightObstacles);

const free = (id: string, kind: DeviceKind, x: number, y: number): Device =>
  ({ id, name: id, invalid: false, placement: { mode: 'free', x, y, rotation: 0 }, props: deviceDefaults(kind, 'free') });
const onWall = (id: string, kind: DeviceKind, offset: number): Device =>
  ({ id, name: id, invalid: false, placement: { mode: 'wall', wallId: 'w0', side: 'right', offset }, props: deviceDefaults(kind, 'wall') });

/** A room with two wall lights, two motion sensors (one on a wall) and a wall switch (no cone). */
function level(): Level {
  return {
    ...rectRoomLevel(6000, 5000, 200),
    devices: [
      onWall('wl1', 'wall_light', 1000), onWall('wl2', 'wall_light', 4000), onWall('ms1', 'motion_sensor', 2500),
      free('ms2', 'motion_sensor', 3000, 3000), onWall('sw', 'wall_switch', 500),
    ],
  };
}

function draw(lv: Level): SVGSVGElement {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(html`<svg xmlns="http://www.w3.org/2000/svg">${renderDevices(lv, {
    palette: paletteFor(true), scale: 0.1, selection: null, showCones: true, dim: false,
  })}</svg>`, host);
  return host.querySelector('svg')!;
}

/** The ids of the devices whose cones were computed since the last reset. */
const computed = () => cones.mock.calls.map(([, d]) => d.id);
const coneDs = (root: SVGSVGElement) => [...root.querySelectorAll('.cone')].map(p => p.getAttribute('d'));

describe('cone caches', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    cones.mockClear();
    obstacles.mockClear();
  });

  it('a device move recomputes only that device\'s cone', () => {
    const lv = level();
    const before = coneDs(draw(lv));
    expect(computed()).toEqual(['wl1', 'wl2', 'ms1', 'ms2']);
    expect(obstacles.mock.calls.map(([, m]) => m)).toEqual(['light', 'motion']);

    // The same level again: nothing is recomputed.
    cones.mockClear();
    obstacles.mockClear();
    draw(lv);
    expect(computed()).toEqual([]);

    // A drag of a wall light and of a free sensor: the walls, nodes and openings are kept.
    const moved = moveDevice(moveDevice(lv, 'wl2', { mode: 'wall', wallId: 'w0', side: 'right', offset: 4500 }),
      'ms2', { mode: 'free', x: 2000, y: 3000, rotation: 90 });
    expect(moved.walls).toBe(lv.walls);
    cones.mockClear();
    obstacles.mockClear();
    const after = coneDs(draw(moved));
    expect(computed()).toEqual(['wl2', 'ms2']);
    expect(obstacles).not.toHaveBeenCalled();
    expect(after[0]).toBe(before[0]);
    expect(after[1]).not.toBe(before[1]);
    expect(after[2]).toBe(before[2]);
    expect(after[3]).not.toBe(before[3]);

    // An aim drag: only the aimed device again.
    const aimed = moveDevice(moved, 'ms1', { mode: 'wall', wallId: 'w0', side: 'right', offset: 2500, aim: 30 });
    cones.mockClear();
    draw(aimed);
    expect(computed()).toEqual(['ms1']);
    expect(obstacles).not.toHaveBeenCalled();
  });

  it('a change to the walls, nodes or openings recomputes the obstacles and every cone', () => {
    const lv = level();
    draw(lv);
    const changes: Level[] = [
      { ...lv, walls: lv.walls.map(w => ({ ...w })) },
      { ...lv, nodes: [...lv.nodes] },
      { ...lv, openings: [...lv.openings] },
    ];
    for (const next of changes) {
      cones.mockClear();
      obstacles.mockClear();
      draw(next);
      expect(computed()).toEqual(['wl1', 'wl2', 'ms1', 'ms2']);
      expect(obstacles.mock.calls.map(([, m]) => m)).toEqual(['light', 'motion']);
    }
  });
});
