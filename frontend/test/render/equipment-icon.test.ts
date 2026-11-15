// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { html, render } from 'lit';
import { renderDevices } from '../../src/render/devices-svg';
import { paletteFor } from '../../src/render/theme';
import { deviceDefaults, type Level } from '../../src/model/types';

const level = (): Level => ({
  id: 'l', name: 'L', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [],
  devices: [{ id: 'e', name: 'e', invalid: false, placement: { mode: 'free', x: 100, y: 100, rotation: 0 },
    props: { ...deviceDefaults('equipment', 'free'), icon: 'mdi:water-boiler' } as never }],
});
const draw = (): SVGSVGElement => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(html`<svg xmlns="http://www.w3.org/2000/svg">${renderDevices(level(),
    { palette: paletteFor(true), selection: null, showCones: true, dim: false, scale: 0.1 })}</svg>`, host);
  return host.querySelector('svg')!;
};

describe('equipment icon render', () => {
  it('uses the bundled fallback path when ha-icon is not defined', () => {
    const svg = draw();
    expect(svg.querySelector('ha-icon')).toBeNull();
    expect(svg.querySelector('.equipment-icon path')).not.toBeNull();
  });
  it('uses ha-icon in a centred foreignObject of 24/scale mm when defined', () => {
    customElements.define('ha-icon', class extends HTMLElement {});
    const svg = draw();
    expect(svg.querySelector('.equipment-icon ha-icon')?.getAttribute('icon')).toBe('mdi:water-boiler');
    const fo = svg.querySelector('foreignObject.equipment-icon')!;
    expect(fo.getAttribute('width')).toBe('240');
    expect(fo.getAttribute('x')).toBe('-120');
  });
});
