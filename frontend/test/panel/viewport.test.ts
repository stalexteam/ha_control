import { describe, it, expect } from 'vitest';
import { revealPt } from '../../src/panel/viewport';

describe('revealPt', () => {
  const v = { x: 0, y: 0, scale: 0.1 }; // 800 x 600 px canvas shows 8000 x 6000 mm

  it('keeps the view when the point is visible', () => {
    expect(revealPt(v, { x: 4000, y: 3000 }, 800, 600)).toBe(v);
    expect(revealPt(v, { x: 0, y: 6000 }, 800, 600)).toBe(v);
  });

  it('centres an off-screen point and keeps the zoom', () => {
    expect(revealPt(v, { x: 20000, y: -1000 }, 800, 600)).toEqual({ x: 16000, y: -4000, scale: 0.1 });
  });
});
