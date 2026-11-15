import { describe, expect, it } from 'vitest';
import { orthoConstrain, pointAlong, snap } from '../../src/geometry/snap';
import { rectRoomLevel } from '../fixtures';

const level = rectRoomLevel(4000, 3000, 200);
const base = { tolMm: 20, grid: null, ortho: false };

describe('snap', () => {
  it('snaps to a node exactly', () => {
    const r = snap(level, { x: 5, y: 3 }, base);
    expect(r.kind).toBe('node');
    expect(r.pt).toEqual({ x: 0, y: 0 });
    expect(r.endpoint).toEqual({ kind: 'node', nodeId: 'n0' });
  });
  it('snaps to a wall midpoint', () => {
    const r = snap(level, { x: 2005, y: 8 }, base);
    expect(r.kind).toBe('mid');
    expect(r.endpoint).toEqual({ kind: 'wall', wallId: 'w0', offset: 2000 });
  });
  it('snaps to the wall axis', () => {
    const r = snap(level, { x: 1000, y: 10 }, base);
    expect(r.kind).toBe('wall');
    expect(r.pt).toEqual({ x: 1000, y: 0 });
    expect(r.endpoint).toEqual({ kind: 'wall', wallId: 'w0', offset: 1000 });
  });
  it('snaps to a wall face with offset along the axis', () => {
    const f = snap(level, { x: 1000, y: 105 }, { ...base, tolMm: 10 });
    expect(f.kind).toBe('wall');
    expect(f.pt).toEqual({ x: 1000, y: 100 });
    expect(f.endpoint).toEqual({ kind: 'wall', wallId: 'w0', offset: 1000 });
  });
  it('snaps to grid or none', () => {
    const g = snap(level, { x: 1234, y: 567 }, { ...base, grid: 100 });
    expect(g.kind).toBe('grid');
    expect(g.pt).toEqual({ x: 1200, y: 600 });
    expect(g.endpoint).toEqual({ kind: 'free', pt: { x: 1200, y: 600 } });
    const n = snap(level, { x: 1234, y: 567 }, base);
    expect(n.kind).toBe('none');
    expect(n.pt).toEqual({ x: 1234, y: 567 });
  });
  it('excludes nodes', () => {
    const r = snap(level, { x: 5, y: 3 }, { ...base, excludeNodeIds: ['n0'] });
    expect(r.kind).not.toBe('node');
  });
  it('ortho rejects a node off the constraining line', () => {
    const r = snap(level, { x: 5, y: -28 }, { ...base, ortho: true, from: { x: -500, y: -30 } });
    expect(r.kind).not.toBe('node');
    expect(r.pt.y).toBe(-30);
  });
  it('ortho accepts a node 0.5 mm off the line at its true position', () => {
    const r = snap(level, { x: 5, y: 10 }, { ...base, ortho: true, from: { x: -500, y: 0.5 } });
    expect(r.kind).toBe('node');
    expect(r.pt).toEqual({ x: 0, y: 0 });
  });
  it('ortho rejects a node 10 mm off the line even within tolMm', () => {
    const r = snap(level, { x: 5, y: 10 }, { ...base, ortho: true, from: { x: -500, y: 10 } });
    expect(r.kind).not.toBe('node');
  });
  it('excluded corner does not snap to its attached wall but does to others', () => {
    const o = { ...base, excludeNodeIds: ['n0'] };
    // w0 (n0-n1) is attached to n0: its axis is ignored
    expect(snap(level, { x: 1000, y: 10 }, o).kind).toBe('none');
    // w1 (n1-n2) is unrelated
    const r = snap(level, { x: 4005, y: 1000 }, o);
    expect(r.kind).toBe('wall');
    expect(r.pt).toEqual({ x: 4000, y: 1000 });
  });
  it('ortho grid snaps along the line only', () => {
    const r = snap(level, { x: 1234, y: 1560 }, { ...base, grid: 100, ortho: true, from: { x: 1200, y: 1000 } });
    expect(r.pt).toEqual({ x: 1200, y: 1600 });
  });
});

describe('orthoConstrain', () => {
  it('locks to the nearest axis', () => {
    expect(orthoConstrain({ x: 0, y: 0 }, { x: 1000, y: 120 })).toEqual({ x: 1000, y: 0 });
    expect(orthoConstrain({ x: 0, y: 0 }, { x: -30, y: -900 })).toEqual({ x: 0, y: -900 });
  });
});

describe('pointAlong', () => {
  it('moves along the direction', () => {
    expect(pointAlong({ x: 0, y: 0 }, { x: 10, y: 0 }, 500)).toEqual({ x: 500, y: 0 });
  });
});
