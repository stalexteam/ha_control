import { svg, type SVGTemplateResult } from 'lit';
import type { Preview } from '../editor/tools/types';
import type { PlanPalette } from '../render/theme';
import { formatMm } from '../render/plan-svg';
import { t } from '../i18n';

export interface TrackerOpts {
  palette: PlanPalette;
  scale: number;
  lang: string;
  /** Wall: length + angle; box: width + depth (the tool reuses the length/angle field names). */
  mode: 'wall' | 'box';
  /** Live values shown dimmed while the matching buffer is empty. */
  live: { first: string; second: string } | null;
}

/** Keyboard input box next to the cursor, drawn in screen pixels via a 1/scale transform. */
export function renderTracker(tr: NonNullable<Preview['tracker']>, o: TrackerOpts): SVGTemplateResult {
  const p = o.palette;
  const k = 1 / o.scale;
  const rows: { label: string; buf: string; live: string; active: boolean; unit: string }[] = [
    {
      label: t(o.mode === 'box' ? 'tracker.width' : 'tracker.length', o.lang),
      buf: tr.length, live: o.live?.first ?? '', active: tr.field === 'length', unit: t('unit.mm', o.lang),
    },
    {
      label: t(o.mode === 'box' ? 'tracker.depth' : 'tracker.angle', o.lang),
      buf: tr.angle, live: o.live?.second ?? '', active: tr.field === 'angle',
      unit: o.mode === 'box' ? t('unit.mm', o.lang) : '°',
    },
  ];
  return svg`
    <g class="tracker" transform=${`translate(${tr.at.x + 18 * k} ${tr.at.y + 18 * k}) scale(${k})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${p.input} stroke=${p.inputBorder}></rect>
      ${rows.map((r, i) => svg`
        <text x="8" y=${19 + i * 22} font-size="11" fill=${p.muted}>${r.label}</text>
        <rect x="24" y=${7 + i * 22} width="118" height="17" rx="3" fill=${p.background}
          stroke=${r.active ? p.accent : 'none'}></rect>
        <text x="136" y=${20 + i * 22} text-anchor="end" font-size="12"
          fill=${r.buf ? p.text : p.muted}>${r.buf ? `${r.buf} ${r.unit}` : r.live ? `${r.live} ${r.unit}` : '—'}</text>`)}
    </g>`;
}

/** Live tracker values from the tool's preview walls. */
export function trackerLive(
  preview: Preview, mode: 'wall' | 'box', measure: 'inner' | 'axis' | 'outer', thickness: number,
): { first: string; second: string } | null {
  const ws = preview.walls;
  if (!ws || ws.length === 0) return null;
  if (mode === 'wall') {
    const { a, b } = ws[0];
    const l = Math.hypot(b.x - a.x, b.y - a.y);
    let ang = (Math.atan2(-(b.y - a.y), b.x - a.x) * 180) / Math.PI;
    if (ang < 0) ang += 360;
    return { first: formatMm(l), second: ang.toFixed(1) };
  }
  if (ws.length < 2) return null;
  // Box preview walls run along the axis rectangle; convert back to the chosen measure.
  const d = measure === 'inner' ? -thickness : measure === 'outer' ? thickness : 0;
  const w = Math.hypot(ws[0].b.x - ws[0].a.x, ws[0].b.y - ws[0].a.y) + d;
  const h = Math.hypot(ws[1].b.x - ws[1].a.x, ws[1].b.y - ws[1].a.y) + d;
  return { first: formatMm(w), second: formatMm(h) };
}
