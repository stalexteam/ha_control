import { svg, nothing, type SVGTemplateResult } from 'lit';
import type { Id, Level, Opening, Pt, Wall, Zone } from '../model/types';
import type { WallProps } from '../model/ops';
import type { Preview, Selection } from '../editor/tools/types';
import { wallFrame, wallOutlines, wallPieces, wallsUnion, type WallFrame } from '../geometry/walls';
import { roomAreaM2 } from '../geometry/rooms';
import { add, cross, dist, norm, perpLeft, pointInPolygon, scale as mul, sub } from '../geometry/vec';
import { t } from '../i18n';
import type { PlanPalette } from './theme';

export { paletteFor, type PlanPalette } from './theme';

export interface RenderOpts {
  palette: PlanPalette;
  selection: Selection | null;
  preview: Preview;
  /** Screen pixels per millimetre; used to keep strokes, text and handles a constant on-screen size. */
  scale: number;
  lang: string;
}

/** 3000 -> "3 000" (space as the thousands separator, whole millimetres). */
export function formatMm(v: number): string {
  const n = Math.round(v);
  const s = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return n < 0 ? `-${s}` : s;
}

export function formatArea(m2: number, lang: string): string {
  const s = m2.toFixed(2);
  return `${s} ${t('unit.m2', lang)}`;
}

// Geometry is cached per level object: levels are immutable snapshots.
const unionCache = new WeakMap<Level, Pt[][][]>();
const piecesCache = new WeakMap<Level, Map<Id, Pt[][]>>();
const outlineCache = new WeakMap<Level, Map<Id, Pt[]>>();

function cached<V>(map: WeakMap<Level, V>, level: Level, make: (l: Level) => V): V {
  let v = map.get(level);
  if (v === undefined) { v = make(level); map.set(level, v); }
  return v;
}

const ringD = (r: Pt[]): string =>
  r.length === 0 ? '' : `M${r.map(p => `${p.x} ${p.y}`).join('L')}Z`;

/** Points across the wall thickness between axis params t0..t1 (along the wall from node A). */
function spanQuad(f: WallFrame, t0: number, t1: number): Pt[] {
  const L = perpLeft(f.dir);
  const p0 = add(f.a, mul(f.dir, t0));
  const p1 = add(f.a, mul(f.dir, t1));
  return [add(p0, mul(L, f.leftOff)), add(p1, mul(L, f.leftOff)), sub(p1, mul(L, f.rightOff)), sub(p0, mul(L, f.rightOff))];
}

function frameOf(level: Level, wallId: Id): WallFrame | null {
  const w = level.walls.find(x => x.id === wallId);
  if (!w) return null;
  try {
    const f = wallFrame(level, w);
    return f.len < 1e-9 ? null : f;
  } catch {
    return null;
  }
}

function centroid(ring: Pt[], fallback: Pt): Pt {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length];
    const c = p.x * q.y - q.x * p.y;
    a += c; cx += (p.x + q.x) * c; cy += (p.y + q.y) * c;
  }
  if (Math.abs(a) < 1e-9) return fallback;
  const c = { x: cx / (3 * a), y: cy / (3 * a) };
  return pointInPolygon(c, ring) ? c : fallback;
}

const NS = 'non-scaling-stroke';

function renderZone(z: Zone, o: RenderOpts, selected: boolean): SVGTemplateResult {
  const p = o.palette;
  const at = centroid(z.outline, z.seed);
  const fs = 12 / o.scale;
  return svg`
    <path class="zone${z.broken ? ' broken' : ''}" d=${ringD(z.outline)}
      fill=${z.broken ? 'url(#hatch)' : p.zone}
      stroke=${selected ? p.selection : 'none'} stroke-width="2" vector-effect=${NS}></path>
    <text class="zone-label" x=${at.x} y=${at.y} text-anchor="middle" font-size=${fs}
      fill=${z.broken ? p.invalid : p.zoneLabel} font-family="system-ui, sans-serif">
      <tspan x=${at.x} dy=${-0.2 * fs}>${z.name}</tspan>
      <tspan x=${at.x} dy=${1.2 * fs} font-size=${fs * 0.9}>${formatArea(roomAreaM2(z.outline), o.lang)}</tspan>
    </text>`;
}

/** Door / gate / wicket: a leaf at the hinge on the swing side plus a quarter arc. */
function doorSymbol(f: WallFrame, op: Opening, color: string): SVGTemplateResult {
  const L = perpLeft(f.dir);
  const swingLeft = (op.swing ?? 'left') === 'left';
  const n = swingLeft ? L : mul(L, -1);
  const face = swingLeft ? f.leftOff : f.rightOff;
  const [th, tc] = (op.hinge ?? 'start') === 'start' ? [op.offset, op.offset + op.width] : [op.offset + op.width, op.offset];
  const h = add(add(f.a, mul(f.dir, th)), mul(n, face));
  const c = add(add(f.a, mul(f.dir, tc)), mul(n, face));
  const e = add(h, mul(n, op.width));
  const sweep = cross(sub(e, h), sub(c, h)) > 0 ? 1 : 0;
  return svg`
    <line x1=${h.x} y1=${h.y} x2=${e.x} y2=${e.y} stroke=${color} stroke-width="1.5" vector-effect=${NS}></line>
    <path d=${`M${e.x} ${e.y}A${op.width} ${op.width} 0 0 ${sweep} ${c.x} ${c.y}`} fill="none" stroke=${color}
      stroke-width="1" vector-effect=${NS}></path>`;
}

function windowSymbol(f: WallFrame, op: Opening, color: string): SVGTemplateResult {
  const L = perpLeft(f.dir);
  const tk = f.leftOff + f.rightOff;
  const lines = [f.leftOff - tk / 3, f.leftOff - (2 * tk) / 3].map(s => {
    const p0 = add(add(f.a, mul(f.dir, op.offset)), mul(L, s));
    const p1 = add(add(f.a, mul(f.dir, op.offset + op.width)), mul(L, s));
    return svg`<line x1=${p0.x} y1=${p0.y} x2=${p1.x} y2=${p1.y} stroke=${color} stroke-width="1.5" vector-effect=${NS}></line>`;
  });
  return svg`${lines}`;
}

function renderOpening(level: Level, op: Opening, o: RenderOpts): SVGTemplateResult | typeof nothing {
  const f = frameOf(level, op.wallId);
  if (!f) return nothing;
  const p = o.palette;
  const color = op.invalid ? p.invalid : op.kind === 'window' ? p.window : p.door;
  const quad = spanQuad(f, op.offset, op.offset + op.width);
  const isDoor = op.kind === 'door' || op.kind === 'gate' || op.kind === 'wicket';
  return svg`
    <g class=${`opening ${op.kind}${op.invalid ? ' invalid' : ''}`}>
      <path d=${ringD(quad)} fill=${op.invalid ? p.invalid : 'none'} fill-opacity="0.45"></path>
      ${isDoor ? doorSymbol(f, op, color) : op.kind === 'window' ? windowSymbol(f, op, color) : nothing}
    </g>`;
}

/** Dimension line between p0 and p1 pushed `off` mm along unit normal n, with a centred label. */
function dimension(p0: Pt, p1: Pt, n: Pt, off: number, o: RenderOpts): SVGTemplateResult {
  const c = o.palette.dim;
  const tick = 6 / o.scale;
  const a = add(p0, mul(n, off)), b = add(p1, mul(n, off));
  const ext = (q: Pt, from: Pt) => {
    const e = add(from, mul(n, off + tick));
    return svg`<line x1=${q.x} y1=${q.y} x2=${e.x} y2=${e.y} stroke=${c} stroke-width="0.75" vector-effect=${NS}></line>`;
  };
  const m = add(mul(add(a, b), 0.5), mul(n, 9 / o.scale));
  return svg`
    <g class="dim">
      ${ext(add(p0, mul(n, 2 / o.scale)), p0)}${ext(add(p1, mul(n, 2 / o.scale)), p1)}
      <line x1=${a.x} y1=${a.y} x2=${b.x} y2=${b.y} stroke=${c} stroke-width="1" vector-effect=${NS}></line>
      <text x=${m.x} y=${m.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / o.scale}
        fill=${c} font-family="system-ui, sans-serif">${formatMm(dist(p0, p1))}</text>
    </g>`;
}

function renderSelection(level: Level, o: RenderOpts): SVGTemplateResult | typeof nothing {
  const sel = o.selection;
  if (!sel) return nothing;
  const p = o.palette;
  const r = 4 / o.scale;
  const handle = (q: Pt) => svg`<circle cx=${q.x} cy=${q.y} r=${r} fill=${p.selection}></circle>`;
  if (sel.kind === 'node') {
    const n = level.nodes.find(x => x.id === sel.id);
    return n ? handle(n) : nothing;
  }
  if (sel.kind === 'wall') {
    const ring = cached(outlineCache, level, wallOutlines).get(sel.id);
    const f = frameOf(level, sel.id);
    if (!ring || !f) return nothing;
    const L = perpLeft(f.dir);
    return svg`
      <path d=${ringD(ring)} fill=${p.selection} fill-opacity="0.15" stroke=${p.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${NS}></path>
      ${handle(f.a)}${handle(f.b)}
      ${dimension(f.a, f.b, L, f.leftOff + 18 / o.scale, o)}`;
  }
  if (sel.kind === 'opening') {
    const op = level.openings.find(x => x.id === sel.id);
    const f = op ? frameOf(level, op.wallId) : null;
    if (!op || !f) return nothing;
    const R = mul(perpLeft(f.dir), -1);
    const off = f.rightOff + 18 / o.scale;
    const at = (tt: number) => add(f.a, mul(f.dir, tt));
    const segs: [number, number][] = [[0, op.offset], [op.offset, op.offset + op.width], [op.offset + op.width, f.len]];
    return svg`
      <path d=${ringD(spanQuad(f, op.offset, op.offset + op.width))} fill="none" stroke=${p.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${NS}></path>
      ${segs.filter(([s, e]) => e - s >= 1).map(([s, e]) => dimension(at(s), at(e), R, off, o))}`;
  }
  return nothing; // zones are highlighted by their own outline
}

/** Wall body quad for a preview segment, honouring thickness and baseline. */
function previewQuad(a: Pt, b: Pt, props: WallProps): Pt[] | null {
  if (dist(a, b) < 1e-6) return null;
  const tk = props.thickness;
  const [leftOff, rightOff] = props.baseline === 'left' ? [0, tk] : props.baseline === 'right' ? [tk, 0] : [tk / 2, tk / 2];
  return spanQuad({ a, b, dir: norm(sub(b, a)), len: dist(a, b), leftOff, rightOff }, 0, dist(a, b));
}

function renderPreview(level: Level, o: RenderOpts): SVGTemplateResult {
  const { preview: pv, palette: p } = o;
  const big = 1e7;
  const ortho = pv.orthoFrom;
  const po = pv.opening;
  const pf = po ? frameOf(level, po.wallId) : null;
  const snapPt = pv.snap && pv.snap.kind !== 'none' ? pv.snap.pt : null;
  return svg`
    ${ortho ? svg`<path d=${`M${ortho.x - big} ${ortho.y}H${ortho.x + big}M${ortho.x} ${ortho.y - big}V${ortho.y + big}`}
      stroke=${p.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${NS}></path>` : nothing}
    ${(pv.walls ?? []).map(w => {
      const q = previewQuad(w.a, w.b, w.props);
      return svg`<g class="preview-wall">
        ${q ? svg`<path d=${ringD(q)} fill=${p.selection} fill-opacity="0.35"></path>` : nothing}
        <line x1=${w.a.x} y1=${w.a.y} x2=${w.b.x} y2=${w.b.y} stroke=${p.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${NS}></line></g>`;
    })}
    ${po && pf ? svg`<path class=${`preview-opening${po.invalid ? ' invalid' : ''}`}
      d=${ringD(spanQuad(pf, po.offset, po.offset + po.width))}
      fill=${po.invalid ? p.invalid : po.kind === 'window' ? p.window : p.selection} fill-opacity="0.55"></path>` : nothing}
    ${snapPt ? svg`<circle class="snap" cx=${snapPt.x} cy=${snapPt.y} r=${5 / o.scale}
      fill=${pv.snap!.kind === 'node' ? p.snap : 'none'} stroke=${p.snap} stroke-width="1.5" vector-effect=${NS}></circle>` : nothing}`;
}

/**
 * Plan content in millimetre user units (Y down). Draws `preview.level` instead of `level` while a
 * tool drags a working copy. The caller supplies the <svg> element, viewBox and background grid.
 */
export function renderLevel(level: Level, o: RenderOpts): SVGTemplateResult {
  const lv = o.preview.level ?? level;
  const p = o.palette;
  const union = cached(unionCache, lv, l => wallsUnion(l, true));
  const lightWalls = lv.walls.filter((w: Wall) => w.type === 'railing' || w.type === 'fence');
  const pieces = lightWalls.length ? cached(piecesCache, lv, wallPieces) : null;
  const hs = 8 / o.scale;
  const sel = o.selection;
  return svg`
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width=${hs} height=${hs} patternTransform="rotate(45)">
        <rect width=${hs} height=${hs} fill=${p.zone}></rect>
        <line x1="0" y1="0" x2="0" y2=${hs} stroke=${p.hatch} stroke-width=${1.5 / o.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${lv.zones.map(z => renderZone(z, o, sel?.kind === 'zone' && sel.id === z.id))}</g>
    <path class="walls" d=${union.map(poly => poly.map(ringD).join('')).join('')} fill=${p.wall} fill-rule="evenodd"></path>
    ${pieces ? svg`<g class="railings">${lightWalls.flatMap(w => (pieces.get(w.id) ?? []).map(r =>
      svg`<path d=${ringD(r)} fill=${p.railing}></path>`))}</g>` : nothing}
    <g class="openings">${lv.openings.map(op => renderOpening(lv, op, o))}</g>
    <g class="selection">${renderSelection(lv, o)}</g>
    <g class="preview">${renderPreview(lv, o)}</g>`;
}
