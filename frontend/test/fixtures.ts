import type { Level, PlanNode, Wall } from '../src/model/types';

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
  return { id: 'l0', name: 'Level 1', kind: 'floor', order: 0, nodes, walls, openings: [], zones: [] };
}
