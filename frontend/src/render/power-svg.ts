import { svg, nothing, type SVGTemplateResult } from 'lit';
import {
  mdiConnection, mdiElectricSwitch, mdiElectricSwitchClosed, mdiLock, mdiMapMarker, mdiPowerPlug, mdiPowerPlugBattery,
  mdiPowerSocketEu, mdiSolarPowerVariant,
} from '@mdi/js';
import type { Id, Pt } from '../model/types';
import { isControllable, isInverter } from '../model/devices';
import type { BlockLive, PortName, PowerBlock, PowerFrame, PowerSchema, PowerWire, WireLive } from '../model/power';
import type { Preview, Selection } from '../editor/tools/types';
import {
  HEAD_H, LINE_H, PORT_R, blockName, blockRect, portPlaces, routeWire, transferChips, wireEnds,
  type EndPlace, type GeoCtx, type PortPlace, type Rect,
} from '../geometry/power';
import { t } from '../i18n';
import type { PlanPalette } from './theme';

export interface PowerRenderOpts {
  palette: PlanPalette;
  selection: Selection | null;
  preview: Preview;
  /** Screen pixels per schematic unit (1 at 100 %); strokes, arrows and the selection keep a constant screen size. */
  scale: number;
  /** The live frame, or null before the first one (every wire then has no data). */
  frame: PowerFrame | null;
  geo: GeoCtx;
}

/** How a wire is drawn: live with power, live with none, de-energized, or power unknown. */
type WireStyle = 'live' | 'idle' | 'dead' | 'nodata';
type Bus = PowerBlock & { kind: 'bus' };
type Transfer = PowerBlock & { kind: 'transfer' };

const NS = 'non-scaling-stroke';
const FONT = 'system-ui, sans-serif';
/** Port icon size in units: the whole 24-unit MDI box, corners included, lies inside the port circle. */
const PORT_ICON = 13;
/** Bus terminal circle radius and its icon size, in units. */
const TERMINAL_R = 9;
const TERMINAL_ICON = 11;
/** Switch and lock icons on a value line, and the pin of a device on the plan, in units. */
const SWITCH_ICON = 18;
const LOCK_ICON = 12;
const PIN_ICON = 11;
/** Arrowhead length and half-width in screen pixels. */
const ARROW_L = 10;
const ARROW_W = 4.5;
/** Font sizes in units. */
const NAME_PX = 12;
const VALUE_PX = 11.5;
const BUS_PX = 10.5;
/** Smallest font a bus name is shrunk to inside the bar; thinner buses carry it beside. */
const BUS_MIN_PX = 6;

const PORT_ICONS: Partial<Record<PortName, string>> = {
  IN: mdiPowerPlug, OUT: mdiPowerSocketEu, BAT: mdiPowerPlugBattery, PV: mdiSolarPowerVariant,
};
const RANK: Record<WireStyle, number> = { dead: 0, nodata: 1, idle: 2, live: 3 };

/** Watts as shown: `—` when unknown; under 1000 W whole watts, else kW with two decimals; a minus sign (U+2212). */
export function formatWatts(w: number | null | undefined): string {
  if (w === null || w === undefined || !Number.isFinite(w)) return '—';
  const r = Math.round(w);
  if (r === 0) return '0 W';
  const minus = w < 0 ? '−' : '';
  return Math.abs(r) < 1000 ? `${minus}${Math.abs(r)} W` : `${minus}${(Math.abs(w) / 1000).toFixed(2)} kW`;
}

const unit = (v: number | null | undefined, u: string): string =>
  v === null || v === undefined || !Number.isFinite(v) ? '—' : `${Math.round(v)} ${u}`;

function wireStyle(l: WireLive | undefined): WireStyle {
  if (!l) return 'nodata';
  if (l.state === 'dead') return 'dead';
  if (l.power === null) return 'nodata';
  return Math.abs(l.power) >= 1 ? 'live' : 'idle';
}

function styleColour(st: WireStyle, p: PlanPalette): string {
  return { live: p.powerLive, idle: p.powerIdle, dead: p.powerDead, nodata: p.powerNoData }[st];
}

/** The viewer asked for reduced motion: the glow of live wires then stays still. */
const reducedMotion = (): boolean =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
/** The slow pulse of a live wire's glow. */
const PULSE = svg`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`;

/** The glow under a live line (`still`: no pulse). */
const glow = (cls: string, d: string, colour: string, still: boolean) => svg`<path class=${cls} d=${d} fill="none"
  stroke=${colour} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${NS}>${still ? nothing : PULSE}</path>`;

const pathD = (pts: Pt[]): string => `M${pts.map((q) => `${q.x} ${q.y}`).join('L')}`;
const icon = (d: string, at: Pt, size: number, fill: string) =>
  svg`<path d=${d} fill=${fill} transform=${`translate(${at.x - size / 2} ${at.y - size / 2}) scale(${size / 24})`}></path>`;

interface DrawnWire { w: PowerWire; a: EndPlace; b: EndPlace; pts: Pt[]; live: WireLive | undefined; style: WireStyle }

/**
 * The arrowhead of a wire carrying power: mid-way along the longest segment that holds it clear of both end circles
 * (a port or a bus terminal), pointing with the flow (against the wire when the power is negative); null when no
 * segment can hold it.
 */
function arrowPlace(d: DrawnWire, o: PowerRenderOpts): { at: Pt; deg: number } | null {
  const power = d.live?.power;
  if (power === null || power === undefined || Math.abs(power) < 1) return null;
  const radius = (e: PowerWire['from']) => ('block' in e ? PORT_R : TERMINAL_R);
  const first = d.pts[0];
  const last = d.pts[d.pts.length - 1];
  const half = ARROW_L / 2 / o.scale;
  const gap = 3 / o.scale;
  const segs = d.pts.slice(1)
    .map((q, i) => ({ p: d.pts[i], q, len: Math.abs(q.x - d.pts[i].x) + Math.abs(q.y - d.pts[i].y) }))
    .sort((u, v) => v.len - u.len);
  for (const { p, q, len } of segs) {
    if (len < 2 * half + 2 * gap) continue;
    const at = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
    const clear = (end: Pt, r: number) => Math.hypot(at.x - end.x, at.y - end.y) >= r + half + gap;
    if (!clear(first, radius(d.w.from)) || !clear(last, radius(d.w.to))) continue;
    const deg = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI + (power < 0 ? 180 : 0);
    return { at, deg: ((((deg + 180) % 360) + 360) % 360) - 180 };
  }
  return null;
}

/** `still`: no glow animation (the viewer asked for reduced motion). */
function renderWire(d: DrawnWire, o: PowerRenderOpts, still: boolean): SVGTemplateResult {
  const p = o.palette;
  const colour = styleColour(d.style, p);
  const dp = pathD(d.pts);
  const selected = o.selection?.kind === 'powerWire' && o.selection.id === d.w.id;
  const width = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[d.style];
  const arrow = arrowPlace(d, o);
  return svg`<g data-wire=${d.w.id}>
    ${selected ? svg`<path class="wire-selection" d=${dp} fill="none" stroke=${p.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${NS}></path>` : nothing}
    ${d.style === 'live' ? glow('glow', dp, colour, still) : nothing}
    <path class=${`wire ${d.style}`} d=${dp} fill="none" stroke=${colour} stroke-width=${width}
      stroke-dasharray=${d.style === 'nodata' ? '5 4' : nothing} stroke-linejoin="round" vector-effect=${NS}></path>
    ${arrow ? svg`<path class="arrow" d=${`M${ARROW_L / 2} 0L${-ARROW_L / 2} ${-ARROW_W}L${-ARROW_L / 2} ${ARROW_W}Z`}
      fill=${colour} transform=${`translate(${arrow.at.x} ${arrow.at.y}) rotate(${arrow.deg}) scale(${1 / o.scale})`}></path>`
      : nothing}
  </g>`;
}

/** A port circle on the block edge: its icon (or the letter A / B) inside, the port name as a tooltip. */
function renderPort(pl: PortPlace, style: WireStyle | undefined, p: PlanPalette): SVGTemplateResult {
  const d = PORT_ICONS[pl.name];
  return svg`<g class="port" data-port=${pl.name}>
    <title>${pl.name}</title>
    <circle cx=${pl.pt.x} cy=${pl.pt.y} r=${PORT_R} fill=${p.portFill}
      stroke=${style ? styleColour(style, p) : p.blockStroke} stroke-width="1.5" vector-effect=${NS}></circle>
    ${d ? icon(d, pl.pt, PORT_ICON, p.portIcon)
      : svg`<text x=${pl.pt.x} y=${pl.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${p.portIcon} font-family=${FONT}>${pl.name}</text>`}
  </g>`;
}

type Line =
  | { kind: 'text'; value: string; label?: string; note?: string; fill?: string }
  | { kind: 'switch'; state: BlockLive['switch']; controllable: boolean }
  | { kind: 'chips' };

/**
 * The value lines of a block: one per blockLines (geometry) line, from the configuration and the live values. A device
 * block: power (or In and Out for an inverter), voltage, the switch, and loss for an inverter, each only when bound.
 */
function blockContent(b: PowerBlock, g: GeoCtx, live: BlockLive | undefined, p: PlanPalette): Line[] {
  const watts = (): Line => ({ kind: 'text', value: formatWatts(live?.power) });
  const sw = (controllable: boolean): Line => ({ kind: 'switch', state: live?.switch, controllable });
  switch (b.kind) {
    case 'grid':
      return b.voltage ? [watts(), { kind: 'text', value: unit(live?.voltage, 'V') }] : [watts()];
    case 'device': {
      const dev = g.device(b.deviceId);
      if (!dev) return [{ kind: 'text', value: t('power.missing'), fill: p.blockInvalid }];
      const k = dev.bindings ?? {};
      const inv = isInverter(dev);
      const out: Line[] = [];
      if (inv) {
        if (k.power_in) out.push({ kind: 'text', label: t('power.in'), value: formatWatts(live?.power_in) });
        if (k.power_out) out.push({ kind: 'text', label: t('power.out'), value: formatWatts(live?.power_out) });
      } else if (k.power) out.push(watts());
      if (k.voltage) out.push({ kind: 'text', value: unit(live?.voltage, 'V') });
      // Equipment shows a lock unless it is controllable; other kinds are actuators Plan Studio operates.
      if (k.control) out.push(sw(isControllable(dev)));
      if (inv) out.push({ kind: 'text', label: t('power.loss'), value: formatWatts(live?.loss) });
      return out;
    }
    case 'battery':
      return [{ kind: 'text', label: t('power.soc'), value: unit(live?.soc, '%') }, watts()];
    case 'pv':
      return [watts()];
    case 'transfer':
      return [{ kind: 'chips' }];
    case 'remainder':
      return live?.hint === 'disagree'
        ? [{ kind: 'text', value: '—', note: t('power.hint.disagree'), fill: p.blockInvalid }]
        : [watts()];
    case 'bus':
      return [];
  }
}

function renderSwitch(l: Line & { kind: 'switch' }, c: Pt, p: PlanPalette): SVGTemplateResult {
  const state = l.state ?? 'unknown';
  const lockW = l.controllable ? 0 : LOCK_ICON + 3;
  const x = c.x - lockW / 2;
  const title = `${t(`power.switch.${state}`)}${l.controllable ? '' : ` · ${t('power.readOnly')}`}`;
  return svg`<g class="switch" data-state=${state} opacity=${state === 'unknown' ? '0.45' : nothing}>
    <title>${title}</title>
    ${icon(state === 'on' ? mdiElectricSwitchClosed : mdiElectricSwitch, { x, y: c.y }, SWITCH_ICON,
      state === 'on' ? p.blockName : p.blockValue)}
    ${l.controllable ? nothing
      : icon(mdiLock, { x: x + SWITCH_ICON / 2 + 3 + LOCK_ICON / 2, y: c.y + 1 }, LOCK_ICON, p.blockValue)}
  </g>`;
}

/** The perimeter coordinate of a point on r's outline, clockwise from the top-left corner. */
function perimeterAt(r: Rect, side: PortPlace['side'], q: Pt): number {
  switch (side) {
    case 'top': return q.x - r.x;
    case 'right': return r.w + (q.y - r.y);
    case 'bottom': return r.w + r.h + (r.x + r.w - q.x);
    case 'left': return 2 * r.w + r.h + (r.y + r.h - q.y);
  }
}

/** The points of r's outline from `a` to `b` (both on it), the shorter way round; a tie goes clockwise. */
function outlineRoute(r: Rect, a: { pt: Pt; side: PortPlace['side'] }, b: { pt: Pt; side: PortPlace['side'] }): Pt[] {
  const per = 2 * (r.w + r.h);
  const ta = perimeterAt(r, a.side, a.pt);
  const cw = (((perimeterAt(r, b.side, b.pt) - ta) % per) + per) % per;
  const dir = cw <= per / 2 ? 1 : -1;
  const len = dir > 0 ? cw : per - cw;
  const corners = [
    { t: 0, pt: { x: r.x, y: r.y } }, { t: r.w, pt: { x: r.x + r.w, y: r.y } },
    { t: r.w + r.h, pt: { x: r.x + r.w, y: r.y + r.h } }, { t: 2 * r.w + r.h, pt: { x: r.x, y: r.y + r.h } },
  ];
  const passed = corners
    .map((c) => ({ c, d: ((((c.t - ta) * dir) % per) + per) % per }))
    .filter(({ d }) => d > 0 && d < len)
    .sort((u, v) => u.d - v.d)
    .map(({ c }) => c.pt);
  return [a.pt, ...passed, b.pt];
}

/**
 * The transfer's active path: the stretch of its own outline from the selected port to the common port (the shorter
 * way), thicker than the outline and styled as the wire on the common port; nothing at position 0.
 */
function transferPath(
  s: PowerSchema, b: Transfer, live: BlockLive | undefined, o: PowerRenderOpts, styleOf: (port: PortName) => WireStyle | undefined,
  still: boolean,
): SVGTemplateResult | typeof nothing {
  const pos = live?.position;
  if (pos !== 'A' && pos !== 'B') return nothing;
  const places = portPlaces(s, b, o.geo);
  const from = places.find((x) => x.name === pos);
  const common = places.find((x) => x.name === (b.form === '2in1out' ? 'OUT' : 'IN'));
  if (!from || !common) return nothing;
  const st = styleOf(common.name) ?? 'nodata';
  const colour = styleColour(st, o.palette);
  const d = pathD(outlineRoute(blockRect(b, o.geo, s), from, common));
  return svg`${st === 'live' ? glow('ts-glow', d, colour, still) : nothing}
    <path class="ts-path" d=${d} fill="none" stroke=${colour} stroke-width="3" stroke-dasharray=${st === 'nodata' ? '5 4' : nothing}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${NS}></path>`;
}

function renderChips(s: PowerSchema, b: Transfer, live: BlockLive | undefined, o: PowerRenderOpts) {
  const p = o.palette;
  return transferChips(b, o.geo, s).map(({ position, rect }) => {
    const cur = live?.position === position;
    return svg`<g class=${cur ? 'chip current' : 'chip'} data-position=${position} style="cursor:pointer">
      <rect x=${rect.x} y=${rect.y} width=${rect.w} height=${rect.h} rx="3" fill=${cur ? p.accent : 'none'}
        stroke=${cur ? p.accent : p.blockStroke} stroke-width="1" vector-effect=${NS}></rect>
      <text x=${rect.x + rect.w / 2} y=${rect.y + rect.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${cur ? p.accentText : p.blockValue} font-family=${FONT}>${position}</text>
    </g>`;
  });
}

function renderBlock(s: PowerSchema, b: PowerBlock, o: PowerRenderOpts,
  styleOf: (block: Id, port: PortName) => WireStyle | undefined, still: boolean): SVGTemplateResult {
  const p = o.palette;
  const r = blockRect(b, o.geo, s);
  const live = o.frame?.blocks[b.id];
  const dev = b.kind === 'device' ? o.geo.device(b.deviceId) : undefined;
  const missing = b.kind === 'device' && !dev;
  const cx = r.x + r.w / 2;
  const name = blockName(b, o.geo) || t(`power.kind.${b.kind}`);
  const lines = blockContent(b, o.geo, live, p);
  const remainder = b.kind === 'remainder';
  return svg`<g class=${`block block-${b.kind}${missing ? ' missing' : ''}`} data-id=${b.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${p.blockFill}
      stroke=${remainder ? p.powerRemainder : p.blockStroke} stroke-width=${remainder ? 1.5 : 1.25}
      stroke-dasharray=${remainder ? '6 4' : nothing} vector-effect=${NS}></rect>
    ${b.kind === 'transfer' ? transferPath(s, b, live, o, (port) => styleOf(b.id, port), still) : nothing}
    ${dev && dev.placement.mode !== 'none' ? svg`<g class="pin"><title>${t('power.planDevice')}</title>
      ${icon(mdiMapMarker, { x: r.x + 4 + PIN_ICON / 2, y: r.y + 4 + PIN_ICON / 2 }, PIN_ICON, p.blockValue)}</g>` : nothing}
    <text class="name" x=${cx} y=${r.y + HEAD_H - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${NAME_PX} font-weight="600" fill=${p.blockName} font-family=${FONT}>${name}</text>
    ${lines.map((l, i) => {
      const y = r.y + HEAD_H + i * LINE_H + LINE_H / 2;
      if (l.kind === 'chips') return b.kind === 'transfer' ? renderChips(s, b, live, o) : nothing;
      if (l.kind === 'switch') return renderSwitch(l, { x: cx, y }, p);
      const fill = l.fill ?? p.blockValue;
      const label = l.label ? svg`<tspan>${l.label} </tspan>` : nothing;
      const note = l.note ? svg`<tspan> ${l.note}</tspan>` : nothing;
      return svg`<text x=${cx} y=${y} text-anchor="middle" dominant-baseline="central" font-size=${VALUE_PX} fill=${fill}
        font-family=${FONT}>${label}<tspan font-weight="600">${l.value}</tspan>${note}</text>`;
    })}
    ${portPlaces(s, b, o.geo).map((pl) => renderPort(pl, styleOf(b.id, pl.name), p))}
  </g>`;
}

/**
 * A bus: a bar outlined in the colour of its liveliest wire. Its name sits in the longest stretch free of terminals,
 * inside the bar, its font scaled to the thickness (BUS_PX at most, 4 px of padding), else beside it (above a
 * horizontal bus, left of a vertical one) when that font would be below BUS_MIN_PX.
 */
function renderBus(b: Bus, terminals: Pt[], style: WireStyle | undefined, o: PowerRenderOpts) {
  const p = o.palette;
  const horiz = b.w >= b.h;
  const start = horiz ? b.x : b.y;
  const end = start + (horiz ? b.w : b.h);
  const thick = horiz ? b.h : b.w;
  let label: SVGTemplateResult | typeof nothing = nothing;
  const name = b.name ?? '';
  const font = Math.min(BUS_PX, thick - 4);
  const inside = font >= BUS_MIN_PX;
  const need = name.length * (inside ? font : BUS_PX) * 0.58 + 12;
  if (name) {
    const taken = terminals.map((q) => (horiz ? q.x : q.y)).sort((u, v) => u - v);
    let gap = { lo: 0, hi: -1 };
    let from = start;
    for (const at of [...taken, end + TERMINAL_R]) {
      const to = Math.min(at - TERMINAL_R, end);
      if (to - from > gap.hi - gap.lo) gap = { lo: from, hi: to };
      from = Math.max(from, at + TERMINAL_R);
    }
    if (gap.hi - gap.lo >= need) {
      const mid = (gap.lo + gap.hi) / 2;
      const at = horiz
        ? { x: mid, y: inside ? b.y + b.h / 2 : b.y - 7 }
        : { x: inside ? b.x + b.w / 2 : b.x - 7, y: mid };
      label = svg`<text class="bus-name" x=${at.x} y=${at.y} text-anchor="middle" dominant-baseline="central"
        font-size=${inside ? font : BUS_PX} fill=${p.blockValue} font-family=${FONT}
        transform=${horiz ? nothing : `rotate(-90 ${at.x} ${at.y})`}>${name}</text>`;
    }
  }
  return svg`<g class="block block-bus" data-id=${b.id}>
    <rect class="body" x=${b.x} y=${b.y} width=${b.w} height=${b.h} rx="2" fill=${p.blockFill}
      stroke=${style ? styleColour(style, p) : p.blockStroke} stroke-width="1.5" vector-effect=${NS}></rect>
    ${label}
  </g>`;
}

function renderTerminal(at: Pt, style: WireStyle, p: PlanPalette): SVGTemplateResult {
  return svg`<g class="terminal">
    <circle cx=${at.x} cy=${at.y} r=${TERMINAL_R} fill=${p.portFill} stroke=${styleColour(style, p)} stroke-width="1.5"
      vector-effect=${NS}></circle>
    ${icon(mdiConnection, at, TERMINAL_ICON, p.portIcon)}
  </g>`;
}

function renderSelection(s: PowerSchema, o: PowerRenderOpts): SVGTemplateResult | typeof nothing {
  const sel = o.selection;
  if (sel?.kind !== 'powerBlock') return nothing;
  const b = s.blocks.find((x) => x.id === sel.id);
  if (!b) return nothing;
  const r: Rect = blockRect(b, o.geo, s);
  const off = 4 / o.scale;
  return svg`<rect class="selection" x=${r.x - off} y=${r.y - off} width=${r.w + 2 * off} height=${r.h + 2 * off} rx="6"
    fill="none" stroke=${o.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${NS}></rect>`;
}

/**
 * The power schematic in schematic units (1 unit = 1 screen px at 100 %). Draws `preview.power` instead of the
 * schema while a tool drags a working copy. Order: buses, wires, the selection outline (under the blocks, so ports
 * stay on top), blocks with their ports, bus terminals, the wire draft. The caller supplies the <svg> element,
 * viewBox and background.
 */
export function renderPower(schema: PowerSchema, o: PowerRenderOpts): SVGTemplateResult {
  const s = o.preview.power ?? schema;
  const p = o.palette;
  const wires: DrawnWire[] = [];
  for (const w of s.wires) {
    const e = wireEnds(s, w, o.geo);
    if (!e) continue;
    const live = o.frame?.wires[w.id];
    wires.push({ w, a: e.a, b: e.b, pts: routeWire(e.a, e.b), live, style: wireStyle(live) });
  }
  const portStyle = new Map<string, WireStyle>();
  const busStyle = new Map<Id, WireStyle>();
  const busTerminals = new Map<Id, Pt[]>();
  const terminals: { at: Pt; style: WireStyle }[] = [];
  for (const d of wires) {
    for (const [end, place] of [[d.w.from, d.a], [d.w.to, d.b]] as const) {
      if ('block' in end) { portStyle.set(`${end.block}:${end.port}`, d.style); continue; }
      const cur = busStyle.get(end.bus);
      if (cur === undefined || RANK[d.style] > RANK[cur]) busStyle.set(end.bus, d.style);
      busTerminals.set(end.bus, [...(busTerminals.get(end.bus) ?? []), place.pt]);
      terminals.push({ at: place.pt, style: d.style });
    }
  }
  const styleOf = (block: Id, port: PortName) => portStyle.get(`${block}:${port}`);
  const still = reducedMotion();
  const draft = o.preview.wireDraft;
  return svg`<g class="power">
    <g class="buses">${s.blocks.map((b) => (b.kind === 'bus'
      ? renderBus(b, busTerminals.get(b.id) ?? [], busStyle.get(b.id), o) : nothing))}</g>
    <g class="wires">${wires.map((d) => renderWire(d, o, still))}</g>
    ${renderSelection(s, o)}
    <g class="blocks">${s.blocks.map((b) => (b.kind === 'bus' ? nothing : renderBlock(s, b, o, styleOf, still)))}</g>
    <g class="terminals">${terminals.map((x) => renderTerminal(x.at, x.style, p))}</g>
    ${draft ? svg`<line class="wire-draft" x1=${draft.from.x} y1=${draft.from.y} x2=${draft.to.x} y2=${draft.to.y}
      stroke=${draft.ok ? p.selection : p.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${NS}></line>`
      : nothing}
  </g>`;
}
