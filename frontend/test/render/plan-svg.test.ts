// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { html, render } from 'lit';
import { renderLevel, paletteFor } from '../../src/render/plan-svg';
import { addOpening } from '../../src/model/openings';
import { addZone } from '../../src/model/zones';
import type { Level } from '../../src/model/types';
import type { Preview, Selection } from '../../src/editor/tools/types';
import { rectRoomLevel } from '../fixtures';

/** 4000 x 3000 axis box, 400 walls: inner 3600 x 2600 = 9.36 m², with a door on w0 and a zone. */
function sample(): Level {
  let level = rectRoomLevel(4000, 3000, 400);
  level = addOpening(level, 'w0', 'door', 2000).level;
  const z = addZone(level, { x: 2000, y: 1500 }, 'Kitchen');
  expect(z.zoneId).not.toBeNull();
  return z.level;
}

function draw(level: Level, selection: Selection | null = null, preview: Preview = {}): SVGSVGElement {
  const content = renderLevel(level, { palette: paletteFor(true), selection, preview, scale: 0.1, lang: 'en' });
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(html`<svg xmlns="http://www.w3.org/2000/svg">${content}</svg>`, host);
  return host.querySelector('svg')!;
}

describe('renderLevel', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('draws one wall path, one door and the zone label with area', () => {
    const root = draw(sample());
    expect(root.querySelectorAll('path.walls').length).toBe(1);
    expect(root.querySelectorAll('.door').length).toBe(1);
    const texts = [...root.querySelectorAll('text')].map(t => t.textContent ?? '');
    expect(texts.some(s => s.includes('Kitchen') && s.includes('9.36'))).toBe(true);
  });

  it('hatches a broken zone', () => {
    const level = sample();
    const broken: Level = { ...level, zones: level.zones.map(z => ({ ...z, broken: true })) };
    const root = draw(broken);
    const zone = root.querySelector('.zone')!;
    expect(zone.getAttribute('fill')).toBe('url(#hatch)');
  });

  it('marks an invalid opening', () => {
    const level = sample();
    const bad: Level = { ...level, openings: level.openings.map(o => ({ ...o, invalid: true })) };
    const root = draw(bad);
    expect(root.querySelector('.door')!.classList.contains('invalid')).toBe(true);
  });

  it('shows a temporary length dimension for a selected wall', () => {
    const root = draw(sample(), { kind: 'wall', id: 'w1' });
    const dims = [...root.querySelectorAll('.dim')].map(d => d.textContent ?? '');
    expect(dims.some(s => s.includes('3 000'))).toBe(true);
  });

  it('draws the preview working level instead of the committed one', () => {
    const level = sample();
    const working: Level = { ...level, zones: level.zones.map(z => ({ ...z, name: 'Moved' })) };
    const root = draw(level, null, { level: working });
    const texts = [...root.querySelectorAll('text')].map(t => t.textContent ?? '').join('|');
    expect(texts).toContain('Moved');
    expect(texts).not.toContain('Kitchen');
  });

  it('styles an invalid preview opening', () => {
    const root = draw(sample(), null, { opening: { wallId: 'w2', offset: 100, width: 900, kind: 'door', invalid: true } });
    expect(root.querySelector('.preview-opening.invalid')).not.toBeNull();
  });
});
