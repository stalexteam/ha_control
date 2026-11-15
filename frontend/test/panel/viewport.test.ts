import { describe, it, expect } from 'vitest';
import { fitRect, revealPt } from '../../src/panel/viewport';

describe('fitRect', () => {
  it('centres the rect with its margin at the scale that fits the tighter side', () => {
    // 720 + 2 * 40 = 800 units across 400 px: scale 0.5 (the height would allow 1.5).
    const v = fitRect({ x: 100, y: 50, w: 720, h: 100 }, 400, 300, 40, 1.5);
    expect(v.scale).toBe(0.5);
    expect(v).toEqual({ x: 100 + 360 - 400, y: 50 + 50 - 300, scale: 0.5 });
  });

  it('never zooms in beyond maxScale', () => {
    expect(fitRect({ x: 0, y: 0, w: 120, h: 60 }, 1000, 800, 40, 1.5).scale).toBe(1.5);
  });
});

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
