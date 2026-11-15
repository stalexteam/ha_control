import { describe, it, expect } from 'vitest';
import type { Level } from '../../src/model/types';
import { addOpening, deleteOpening, moveOpening, refreshOpenings, setOpeningProps } from '../../src/model/openings';
import { deleteWall, moveNode } from '../../src/model/ops';

/** Single 3000 mm wall (0,0)-(3000,0). */
const oneWall = (): Level => ({
  id: 'l', name: 'L', kind: 'floor', order: 0,
  nodes: [{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 3000, y: 0 }],
  walls: [{ id: 'w', a: 'a', b: 'b', thickness: 200, type: 'partition', baseline: 'center' }],
  openings: [], zones: [], devices: [],
});

describe('addOpening', () => {
  it('door centered at 1500 in a 3000 wall -> offset 1050, width 900', () => {
    const { level, openingId } = addOpening(oneWall(), 'w', 'door', 1500);
    expect(openingId).not.toBeNull();
    const o = level.openings.find(x => x.id === openingId)!;
    expect(o).toMatchObject({ wallId: 'w', kind: 'door', offset: 1050, width: 900, invalid: false });
  });
  it('explicit width', () => {
    const { level, openingId } = addOpening(oneWall(), 'w', 'window', 1000, 600);
    expect(level.openings.find(x => x.id === openingId)).toMatchObject({ offset: 700, width: 600 });
  });
  it('overlapping an existing opening -> null', () => {
    const l = addOpening(oneWall(), 'w', 'door', 1500).level;
    const r = addOpening(l, 'w', 'window', 2000);
    expect(r.openingId).toBeNull();
    expect(r.level).toBe(l);
  });
  it('past the wall end -> null', () => {
    const r = addOpening(oneWall(), 'w', 'door', 2800);
    expect(r.openingId).toBeNull();
    expect(r.level.openings).toHaveLength(0);
  });
  it('adjacent openings touching edges are allowed', () => {
    const l = addOpening(oneWall(), 'w', 'door', 450).level; // 0..900
    expect(addOpening(l, 'w', 'door', 1350).openingId).not.toBeNull(); // 900..1800
  });
});

describe('moveOpening / setOpeningProps / deleteOpening', () => {
  it('moving into an overlap leaves the level unchanged', () => {
    let l = addOpening(oneWall(), 'w', 'door', 500).level;
    const r = addOpening(l, 'w', 'door', 2000);
    l = r.level;
    const moved = moveOpening(l, r.openingId!, 300);
    expect(moved).toBe(l);
  });
  it('moving to a free place updates offset', () => {
    const r = addOpening(oneWall(), 'w', 'door', 500);
    const l = moveOpening(r.level, r.openingId!, 2000);
    expect(l.openings[0].offset).toBe(2000);
  });
  it('moving past the end leaves the level unchanged', () => {
    const r = addOpening(oneWall(), 'w', 'door', 500);
    expect(moveOpening(r.level, r.openingId!, 2500)).toBe(r.level);
  });
  it('setOpeningProps patches fields', () => {
    const r = addOpening(oneWall(), 'w', 'door', 500);
    const l = setOpeningProps(r.level, r.openingId!, { swing: 'right', hinge: 'end' });
    expect(l.openings[0]).toMatchObject({ swing: 'right', hinge: 'end' });
  });
  it('deleteOpening removes it', () => {
    const r = addOpening(oneWall(), 'w', 'door', 500);
    expect(deleteOpening(r.level, r.openingId!).openings).toHaveLength(0);
  });
});

describe('openings follow wall edits', () => {
  it('moving node A left by 500 grows offset by 500 (opening stays in place)', () => {
    const r = addOpening(oneWall(), 'w', 'door', 1500); // offset 1050
    const l = moveNode(r.level, 'a', { x: -500, y: 0 });
    expect(l.openings[0].offset).toBeCloseTo(1550, 6);
    expect(l.openings[0].invalid).toBe(false);
  });
  it('moving node B does not change offset', () => {
    const r = addOpening(oneWall(), 'w', 'door', 1500);
    const l = moveNode(r.level, 'b', { x: 3500, y: 0 });
    expect(l.openings[0].offset).toBe(1050);
  });
  it('shortening the wall so the opening no longer fits -> invalid, kept', () => {
    const r = addOpening(oneWall(), 'w', 'door', 1500); // 1050..1950
    const l = moveNode(r.level, 'b', { x: 1500, y: 0 });
    expect(l.openings).toHaveLength(1);
    expect(l.openings[0].invalid).toBe(true);
    const back = moveNode(l, 'b', { x: 3000, y: 0 });
    expect(back.openings[0].invalid).toBe(false);
  });
  it('deleteWall removes its openings', () => {
    const r = addOpening(oneWall(), 'w', 'door', 1500);
    expect(deleteWall(r.level, 'w').openings).toHaveLength(0);
  });
  it('refreshOpenings marks overlapping openings invalid', () => {
    const l = oneWall();
    l.openings = [
      { id: 'o1', wallId: 'w', kind: 'door', offset: 0, width: 900, invalid: false },
      { id: 'o2', wallId: 'w', kind: 'door', offset: 500, width: 900, invalid: false },
      { id: 'o3', wallId: 'w', kind: 'door', offset: 2000, width: 900, invalid: true },
    ];
    const out = refreshOpenings(l);
    expect(out.openings.map(o => o.invalid)).toEqual([true, true, false]);
    expect(l.openings[0].invalid).toBe(false); // input untouched
  });
});
