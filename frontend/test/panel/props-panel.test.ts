// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { applyOpeningPatch, kindPatch } from '../../src/panel/props-panel';
import { addOpening } from '../../src/model/openings';
import { rectRoomLevel } from '../fixtures';

describe('opening kind switch', () => {
  it('door -> window drops hinge/swing and sets outside; window -> door restores hinge/swing', () => {
    const r = addOpening(rectRoomLevel(4000, 3000, 400), 'w0', 'door', 2000);
    const id = r.openingId!;
    const win = applyOpeningPatch(r.level, id, kindPatch(r.level.openings[0], 'window'));
    const w = win.openings[0];
    expect(w.kind).toBe('window');
    expect(w.outside).toBe('left');
    expect('hinge' in w || 'swing' in w).toBe(false);
    const door = applyOpeningPatch(win, id, kindPatch(w, 'door'));
    const d = door.openings[0];
    expect(d).toMatchObject({ kind: 'door', hinge: 'start', swing: 'left' });
    expect('outside' in d).toBe(false);
    const gap = applyOpeningPatch(door, id, kindPatch(d, 'opening')).openings[0];
    expect(['hinge', 'swing', 'outside'].some(k => k in gap)).toBe(false);
  });
});

describe('opening width field', () => {
  it('rejects a width that does not fit the wall like the offset field does', async () => {
    const { render } = await import('lit');
    const { renderProps } = await import('../../src/panel/props-panel');
    const host = document.createElement('div');
    const r = addOpening(rectRoomLevel(4000, 3000, 400), 'w0', 'door', 2000);
    const commits: unknown[] = [];
    let notice: string | null = null;
    const opts = {
      level: r.level, selection: { kind: 'opening' as const, id: r.openingId! }, tool: 'select' as const,
      boxMeasure: 'inner' as const, wallType: 'bearing' as const, thickness: 400, lang: 'en', notice: null,
      commit: (n: unknown) => commits.push(n), remove: () => {}, setBoxMeasure: () => {}, setWallType: () => {}, setThickness: () => {},
      setNotice: (m: string | null) => { notice = m; },
    };
    render(renderProps(opts), host);
    const width = host.querySelectorAll('input')[0] as HTMLInputElement;
    expect(width.value).toBe('900');
    width.value = '9000';
    width.dispatchEvent(new Event('change'));
    expect(commits).toHaveLength(0);
    expect(notice).toBe('Does not fit the wall at this position');
    expect(width.value).toBe('900');
    width.value = '1000';
    width.dispatchEvent(new Event('change'));
    expect(commits).toHaveLength(1);
    expect(notice).toBeNull();
  });
});
