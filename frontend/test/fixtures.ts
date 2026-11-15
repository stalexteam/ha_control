import type { Level, Opening, PlanNode, Wall } from '../src/model/types';

/** Level with a rectangular room (0,0)-(w,d) built from 4 bearing center walls. */
export function rectRoomLevel(w: number, d: number, thickness: number): Level {
  const nodes: PlanNode[] = [
    { id: 'n0', x: 0, y: 0 },
    { id: 'n1', x: w, y: 0 },
    { id: 'n2', x: w, y: d },
    { id: 'n3', x: 0, y: d },
  ];
  const walls: Wall[] = [
    { id: 'w0', a: 'n0', b: 'n1', thickness, type: 'bearing', baseline: 'center' },
    { id: 'w1', a: 'n1', b: 'n2', thickness, type: 'bearing', baseline: 'center' },
    { id: 'w2', a: 'n2', b: 'n3', thickness, type: 'bearing', baseline: 'center' },
    { id: 'w3', a: 'n3', b: 'n0', thickness, type: 'bearing', baseline: 'center' },
  ];
  return { id: 'l0', name: 'Level 1', kind: 'floor', order: 0, nodes, walls, openings: [], zones: [], devices: [] };
}

/**
 * Two 3000 x 3000 rooms side by side, 200 mm partition walls on centre baselines: an outer ring
 * (0,0)-(6000,3000) and the shared wall 'mid' from n1 (3000,0) to n4 (3000,3000).
 */
export function twoRoomsLevel(openings: Opening[] = []): Level {
  const nodes: PlanNode[] = [
    { id: 'n0', x: 0, y: 0 }, { id: 'n1', x: 3000, y: 0 }, { id: 'n2', x: 6000, y: 0 },
    { id: 'n3', x: 6000, y: 3000 }, { id: 'n4', x: 3000, y: 3000 }, { id: 'n5', x: 0, y: 3000 },
  ];
  const walls: Wall[] = [
    ['w0', 'n0', 'n1'], ['w1', 'n1', 'n2'], ['w2', 'n2', 'n3'], ['w3', 'n3', 'n4'],
    ['w4', 'n4', 'n5'], ['w5', 'n5', 'n0'], ['mid', 'n1', 'n4'],
  ].map(([id, a, b]) => ({ id, a, b, thickness: 200, type: 'partition', baseline: 'center' }));
  return { id: 'l0', name: 'Level 1', kind: 'floor', order: 0, nodes, walls, openings, zones: [], devices: [] };
}

/** An opening on the shared wall of twoRoomsLevel: offset 1200, width 600 (the gap spans y 1200..1800). */
export const midGap = (kind: Opening['kind'], extra: Partial<Opening> = {}): Opening =>
  ({ id: 'gap', wallId: 'mid', kind, offset: 1200, width: 600, invalid: false, ...extra });
