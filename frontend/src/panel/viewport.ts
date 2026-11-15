import { svg, nothing, type SVGTemplateResult } from 'lit';
import type { PlanNode, Pt } from '../model/types';
import type { PlanPalette } from '../render/theme';

/** Canvas view: (x, y) = plan mm at the canvas top-left corner; scale = screen px per mm. */
export interface View { x: number; y: number; scale: number }

export const MIN_SCALE = 0.005;
export const MAX_SCALE = 2;
const clampScale = (s: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));

/** Screen -> plan mm via getScreenCTM().inverse(); falls back to the view when no CTM is available. */
export function screenToMm(el: SVGSVGElement | null, view: View, e: { clientX: number; clientY: number }): Pt {
  const ctm = el?.getScreenCTM?.();
  const m = ctm && typeof ctm.inverse === 'function' ? ctm.inverse() : null;
  if (m && Number.isFinite(m.a) && Number.isFinite(m.d)) {
    return { x: m.a * e.clientX + m.c * e.clientY + m.e, y: m.b * e.clientX + m.d * e.clientY + m.f };
  }
  const rect = el?.getBoundingClientRect();
  return {
    x: view.x + (e.clientX - (rect?.left ?? 0)) / view.scale,
    y: view.y + (e.clientY - (rect?.top ?? 0)) / view.scale,
  };
}

/** View that shows all nodes with a margin; an empty plan shows about 12 m around the origin. */
export function fitView(nodes: PlanNode[], w: number, h: number): View {
  if (nodes.length === 0) return { x: -1000, y: -1000, scale: clampScale(Math.min(w, h) / 12000) };
  const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
  const pad = 1500;
  const x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
  const scale = clampScale(Math.min(w / (x1 - x0), h / (y1 - y0)));
  return { x: (x0 + x1) / 2 - w / scale / 2, y: (y0 + y1) / 2 - h / scale / 2, scale };
}

/** Zoom keeping plan point p under the cursor. */
export function zoomAt(v: View, p: Pt, deltaY: number): View {
  const ns = clampScale(v.scale * Math.exp(-deltaY * 0.0015));
  return { x: p.x - ((p.x - v.x) * v.scale) / ns, y: p.y - ((p.y - v.y) * v.scale) / ns, scale: ns };
}

export function panBy(v: View, dxPx: number, dyPx: number): View {
  return { ...v, x: v.x - dxPx / v.scale, y: v.y - dyPx / v.scale };
}

/** `v` itself when plan point p is inside the w x h px canvas; otherwise the same zoom centred on p. */
export function revealPt(v: View, p: Pt, wPx: number, hPx: number): View {
  const w = wPx / v.scale, h = hPx / v.scale;
  if (p.x >= v.x && p.x <= v.x + w && p.y >= v.y && p.y <= v.y + h) return v;
  return { ...v, x: p.x - w / 2, y: p.y - h / 2 };
}

/** Background grid over the visible area (w x h in mm): 100 mm cells when large enough, 1 m lines always. */
export function renderGrid(v: View, w: number, h: number, pal: PlanPalette): SVGTemplateResult | typeof nothing {
  const minor = 100 * v.scale >= 6 ? 100 : 1000;
  const sw = 1 / v.scale;
  return svg`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${minor} height=${minor}>
        <path d=${`M${minor} 0H0V${minor}`} fill="none" stroke=${pal.grid} stroke-width=${sw}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width="1000" height="1000">
        <rect width="1000" height="1000" fill="url(#grid-minor)"></rect>
        <path d="M1000 0H0V1000" fill="none" stroke=${pal.gridMajor} stroke-width=${sw}></path></pattern>
    </defs>
    <rect x=${v.x} y=${v.y} width=${w} height=${h} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
