import { describe, it, expect } from 'vitest';
import { bubbleSide, stackOrigin } from '../../src/render/bubble-side';
import { deviceDefaults, type Device, type Level, type Zone } from '../../src/model/types';
import { rectRoomLevel } from '../fixtures';

const zone = (id: string, x0: number, y0: number, x1: number, y1: number): Zone => ({
  id, name: id, invalid: false,
  shape: { kind: 'polygon', vertices: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
});
const lv = (...zones: Zone[]): Level => ({ ...rectRoomLevel(6000, 5000, 200), zones });
const freeDev = (x: number, y: number): Device =>
  ({ id: 'f', name: 'f', invalid: false, placement: { mode: 'free', x, y, rotation: 0 }, props: deviceDefaults('socket', 'free') });
const wallDev = (): Device =>
  ({ id: 'w', name: 'w', invalid: false, placement: { mode: 'wall', wallId: 'w0', side: 'right', offset: 3000 }, props: deviceDefaults('socket', 'wall') });
const pose = (x: number, y: number, dx = 1, dy = 0) => ({ pt: { x, y }, dir: { x: dx, y: dy } });
const stack = { w: 600, h: 200 };

describe('bubbleSide', () => {
  it('a free device in the middle of a big zone: the side with most clearance (right on a tie)', () => {
    expect(bubbleSide(lv(zone('z', 0, 0, 6000, 5000)), freeDev(3000, 2500), pose(3000, 2500), stack, 300)).toBe('right');
  });
  it('a free device near the zone right edge goes left', () => {
    expect(bubbleSide(lv(zone('z', 0, 0, 6000, 5000)), freeDev(5700, 2500), pose(5700, 2500), stack, 300)).toBe('left');
  });
  it('a wall device goes into the room: top wall down, left wall right, right wall left', () => {
    // The zone outline follows the wall faces, so a wall device sits on the zone edge.
    const l = lv(zone('z', 100, 100, 5900, 4900));
    expect(bubbleSide(l, wallDev(), pose(3000, 100, 0, 1), stack, 300)).toBe('down');
    expect(bubbleSide(l, wallDev(), pose(100, 2500, 1, 0), stack, 300)).toBe('right');
    expect(bubbleSide(l, wallDev(), pose(5900, 2500, -1, 0), stack, 300)).toBe('left');
  });
  it('too small a zone or no zone: wall into the room, free to the right', () => {
    const tiny = lv(zone('z', 2900, 90, 3100, 110));
    expect(bubbleSide(tiny, wallDev(), pose(3000, 100, 0, 1), stack, 300)).toBe('down');
    expect(bubbleSide(tiny, freeDev(3000, 100), pose(3000, 100), stack, 300)).toBe('right');
    expect(bubbleSide(lv(), freeDev(3000, 100), pose(3000, 100), stack, 300)).toBe('right');
    expect(bubbleSide(lv(), wallDev(), pose(3000, 100, 0, 1), stack, 300)).toBe('down');
  });
  it('the smallest containing zone decides', () => {
    // Big zone has room on the right; the small inner zone only on the left.
    const l = lv(zone('big', 0, 0, 6000, 5000), zone('small', 4000, 2000, 5000, 3000));
    expect(bubbleSide(l, freeDev(4900, 2500), pose(4900, 2500), stack, 300)).toBe('left');
  });
  it('a tall stack that fits only on one side picks it', () => {
    // Zone 1000 wide x 2000 tall; stack 400x1800 fits only left or right; device at the left end.
    const l = lv(zone('z', 0, 0, 1000, 2000));
    expect(bubbleSide(l, freeDev(100, 1000), pose(100, 1000), { w: 400, h: 1800 }, 150)).toBe('right');
  });
  it('zoomed out (bigger world size) the choice changes from right to another side', () => {
    const l = lv(zone('z', 0, 0, 4000, 1000));
    const d = freeDev(2100, 500);
    expect(bubbleSide(l, d, pose(2100, 500), { w: 400, h: 200 }, 200)).toBe('right');
    expect(bubbleSide(l, d, pose(2100, 500), { w: 1350, h: 600 }, 700)).toBe('left');
  });
});

describe('bubbleSide diagonals', () => {
  it('a free device in a box corner where right / left do not fit goes to the diagonal into the zone', () => {
    const l = lv(zone('z', 0, 0, 1000, 1000)), st = { w: 400, h: 800 };
    expect(bubbleSide(l, freeDev(100, 100), pose(100, 100), st, 100)).toBe('down-right');
    expect(bubbleSide(l, freeDev(900, 900), pose(900, 900), st, 100)).toBe('up-left');
    expect(bubbleSide(l, freeDev(900, 100), pose(900, 100), st, 100)).toBe('down-left');
  });
  it('a wall device near a corner whose perpendicular side does not fit takes the room-side diagonal away from the adjacent wall', () => {
    // Top wall device 100 from the left wall: down is 800 wide, crossing the left edge; down-right fits.
    const l = lv(zone('z', 0, 0, 2000, 1000));
    expect(bubbleSide(l, wallDev(), pose(100, 0, 0, 1), { w: 800, h: 200 }, 100)).toBe('down-right');
    expect(bubbleSide(l, wallDev(), pose(1900, 0, 0, 1), { w: 800, h: 200 }, 100)).toBe('down-left');
  });
});

describe('stackOrigin', () => {
  it('centres the stack on the chosen side', () => {
    expect(stackOrigin('down', { w: 100, h: 40 }, 30)).toEqual({ x: -50, y: 30 });
    expect(stackOrigin('up', { w: 100, h: 40 }, 30)).toEqual({ x: -50, y: -70 });
    expect(stackOrigin('right', { w: 100, h: 40 }, 30)).toEqual({ x: 30, y: -20 });
    expect(stackOrigin('left', { w: 100, h: 40 }, 30)).toEqual({ x: -130, y: -20 });
    expect(stackOrigin('up-left', { w: 100, h: 40 }, 30)).toEqual({ x: -130, y: -70 });
    expect(stackOrigin('down-right', { w: 100, h: 40 }, 30)).toEqual({ x: 30, y: 30 });
  });
});

describe('bubbleSide wall device that cannot go into the room', () => {
  it('tries along the wall, then the opposite side', () => {
    // Top-wall device, zone only 150 tall below it: down (300 gap + 200) does not fit; along the wall: right, tie -> right.
    const l = lv(zone('z', 0, 0, 6000, 250));
    expect(bubbleSide(l, wallDev(), pose(3000, 100, 0, 1), { w: 600, h: 100 }, 300)).toBe('right');
  });
});
