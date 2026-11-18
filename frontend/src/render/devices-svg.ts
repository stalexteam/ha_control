import { svg, nothing, type SVGTemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { mdiAlert } from '@mdi/js';
import { isContainerKind, type Device, type Level, type Pt } from '../model/types';
import type { BindStatus } from '../model/bindings';
import type { ContainerState } from '../live/container-feed';
import type { BubbleTone, DeviceLive, LiveBubble } from '../live/device-live';
import type { Preview, Selection } from '../editor/tools/types';
import { clippedCone, coneMedium, devicePose, directionHandle, type DevicePose } from '../geometry/devices';
import { lineOfSightObstacles, type Medium, type Segment } from '../geometry/visibility';
import type { PlanPalette } from './theme';
import { bubbleSide, stackOrigin } from './bubble-side';
import { cached, ringD } from './shared';

/** Device icon radius in screen pixels. */
export const ICON_PX = 12;

export interface DeviceRenderOpts {
  palette: PlanPalette;
  /** Screen pixels per millimetre. */
  scale: number;
  selection: Selection | null;
  showCones: boolean;
  dim: boolean;
  preview?: Preview['device'];
  /**
   * Binding step overlay: a status ring around every device that is not fully bound. When set, the direction
   * handle is not drawn (devices are not edited in that step).
   */
  bindingStatus?: (d: Device) => BindStatus;
  /**
   * Live state of an input container, or undefined (no data: dashed outline). An `error` status shows the alert badge.
   */
  containerState?: (d: Device) => ContainerState | undefined;
  /** Live look of a device (filled symbol, glow, lit zone, dashed no-data). Absent: no live looks. */
  live?: (d: Device) => DeviceLive;
  /** Bubbles of a device: `shown` (timer, power, event last) pop in, `leaving` fade out. Absent: none. */
  bubbles?: (d: Device) => { shown: LiveBubble[]; leaving: LiveBubble[] };
}

const NS = 'non-scaling-stroke';
/** Badge of an input container, in screen pixels: the circle radius and the icon size. */
const BADGE_R_PX = 7;
const BADGE_ICON_PX = 10;
/** Colour of the alert badge (status error). */
const ALERT = '#f43f5e';
/** Outline dash of a container with no live state (screen pixels). */
const NO_DATA_DASH = '3 2';
/** Live bubble pill, in screen pixels. */
const BUBBLE_H_PX = 18;
const BUBBLE_PAD_PX = 6;
const BUBBLE_FONT_PX = 11;
const BUBBLE_CHAR_W = 0.6;
/** MDI `cube-outline` (24x24), the bundled fallback when `ha-icon` is not registered. */
const CUBE_OUTLINE = 'M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z';
/** Equipment icon size in screen pixels. */
const EQUIPMENT_ICON_PX = 24;

/** Gap between the equipment icon and its label, and the padding kept inside the body, in screen pixels. */
const EQ_GAP_PX = 4;
const EQ_PAD_PX = 4;
/** Label font size relative to ICON_PX, and the per-character width estimate (as in the power schematic). */
const EQ_LABEL_FONT_PX = ICON_PX * 0.85;
const EQ_CHAR_W = 0.58;

export interface EquipmentLabelLayout {
  mode: 'stacked' | 'line';
  /** Icon centre and label anchor point, in plan units relative to the device centre. */
  iconX: number;
  iconY: number;
  labelX: number;
  labelY: number;
  labelAnchor: 'middle' | 'start';
}

/**
 * Lays out the equipment icon and label as one group at the current zoom. Stacked (icon above label) when it fits
 * the rotated body's bounding box (circle: inscribed square), else one line (icon left, label right) when that fits,
 * else the one that overflows less. An empty label leaves the icon alone at the centre. Label width is estimated, not measured.
 */
export function equipmentLabelLayout(
  body: { shape: 'rect' | 'circle'; width: number; depth: number; diameter: number },
  label: string, deg: number, scale: number,
): EquipmentLabelLayout {
  const icon = EQUIPMENT_ICON_PX;
  if (!label) return { mode: 'stacked', iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: 'middle' };
  const a = (deg * Math.PI) / 180;
  const c = Math.abs(Math.cos(a));
  const s = Math.abs(Math.sin(a));
  const [w, h] = body.shape === 'circle'
    ? [body.diameter / Math.SQRT2, body.diameter / Math.SQRT2]
    : [body.width * c + body.depth * s, body.width * s + body.depth * c];
  const availW = w * scale - 2 * EQ_PAD_PX;
  const availH = h * scale - 2 * EQ_PAD_PX;
  const textW = label.length * EQ_CHAR_W * EQ_LABEL_FONT_PX;
  const stackH = icon + EQ_GAP_PX + EQ_LABEL_FONT_PX;
  const lineW = icon + EQ_GAP_PX + textW;
  const stackW = Math.max(icon, textW);
  const over = (needW: number, needH: number) => Math.max(0, needW - availW) + Math.max(0, needH - availH);
  const stackOver = over(stackW, stackH);
  const lineOver = over(lineW, icon);
  // Stacked when it fits, else one line when it fits, else whichever overflows less (a tie keeps stacked).
  if (stackOver > 0 && lineOver < stackOver) {
    const left = -lineW / 2;
    return { mode: 'line', iconX: (left + icon / 2) / scale, iconY: 0,
      labelX: (left + icon + EQ_GAP_PX) / scale, labelY: 0, labelAnchor: 'start' };
  }
  const top = -stackH / 2;
  return { mode: 'stacked', iconX: 0, iconY: (top + icon / 2) / scale, labelX: 0,
    labelY: (top + icon + EQ_GAP_PX + EQ_LABEL_FONT_PX / 2) / scale, labelAnchor: 'middle' };
}

function equipmentIcon(icon: string, scale: number, color: string, cx = 0, cy = 0): SVGTemplateResult {
  const size = EQUIPMENT_ICON_PX / scale;
  if (customElements.get('ha-icon')) {
    return svg`<foreignObject class="equipment-icon" x=${cx - size / 2} y=${cy - size / 2} width=${size} height=${size}
      style="pointer-events:none">
      <ha-icon icon=${icon} style=${`--mdc-icon-size:${size}px;color:${color};display:block`}></ha-icon></foreignObject>`;
  }
  return svg`<g class="equipment-icon" transform=${`translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})`}>
    <path d=${CUBE_OUTLINE} fill=${color}></path></g>`;
}
const PREVIEW_ID = '__preview__';
/** Ring stroke per binding status; a bound device has no ring. Unbound follows the HA theme's secondary text. */
const BIND_STROKE: Record<Exclude<BindStatus, 'bound'>, string> = {
  unbound: 'var(--secondary-text-color, #94a3b8)', partial: '#f59e0b', missing: '#f43f5e',
};

// Line-of-sight obstacles depend only on the walls, nodes and openings: they are cached per medium on the identity of
// those three arrays (nested WeakMaps; levels and their arrays are immutable snapshots), so a device or aim drag,
// which keeps them, reuses them. A clipped cone is cached on its obstacle array (which pins the walls and nodes that
// pose the device) and the device object: a drag recomputes only the dragged device's cone. The device object (not
// its id) is the key so the placement preview, a fresh object with a fixed id on every render, never reads a stale cone.
type ByMedium = Partial<Record<Medium, Segment[]>>;
type ByOpenings = WeakMap<Level['openings'], ByMedium>;
const obstacleCache = new WeakMap<Level['walls'], WeakMap<Level['nodes'], ByOpenings>>();
function obstaclesOf(level: Level, medium: Medium): Segment[] {
  const byNodes = cached(obstacleCache, level.walls, () => new WeakMap<Level['nodes'], ByOpenings>());
  const byOpenings = cached(byNodes, level.nodes, (): ByOpenings => new WeakMap());
  return (cached(byOpenings, level.openings, (): ByMedium => ({}))[medium] ??= lineOfSightObstacles(level, medium));
}
const coneCache = new WeakMap<Segment[], WeakMap<Device, Pt[][]>>();
function coneRings(level: Level, d: Device): Pt[][] {
  const medium = coneMedium(d.props.kind);
  if (!medium) return [];
  const obstacles = obstaclesOf(level, medium);
  const byDevice = cached(coneCache, obstacles, () => new WeakMap<Device, Pt[][]>());
  let rings = byDevice.get(d);
  if (!rings) { rings = clippedCone(level, d, () => obstacles); byDevice.set(d, rings); }
  return rings;
}

/** Drawn radius of a round ceiling light: its real diameter/2, never smaller than the icon radius R; R for other devices. */
function roundLightR(d: Device, R: number): number {
  return d.props.kind === 'ceiling_light' && d.props.shape === 'round' ? Math.max(d.props.diameter / 2, R) : R;
}

/**
 * `dash`: the outline dash of a symbol with no live state. `ink`: the colour of the details drawn over the symbol
 * (the background colour when the symbol is filled). `hollow`: a spot light drawn as an outline (it is solid otherwise).
 */
function iconShape(d: Device, R: number, color: string, fill: string, dash?: string, ink = color, hollow = false): SVGTemplateResult {
  const pr = d.props;
  const common = { stroke: color, fill };
  const da = dash ?? nothing;
  switch (pr.kind) {
    case 'ceiling_light':
      if (pr.shape === 'linear') {
        return svg`<rect class="icon" x=${-pr.length / 2} y=${-pr.width / 2} width=${pr.length} height=${pr.width}
          fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" stroke-dasharray=${da} vector-effect=${NS}></rect>`;
      }
      if (pr.shape === 'spot') {
        return svg`<circle class="icon" r=${R / 3} fill=${hollow ? fill : color} stroke=${color} stroke-width="1" stroke-dasharray=${da} vector-effect=${NS}></circle>`;
      }
      return svg`<circle class="icon" r=${roundLightR(d, R)} fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" stroke-dasharray=${da} vector-effect=${NS}></circle>`;
    case 'wall_light':
      return svg`<path class="icon" d=${`M0 ${-R}A${R} ${R} 0 0 0 0 ${R}Z`} fill=${common.fill} stroke=${common.stroke}
        stroke-width="1.5" stroke-dasharray=${da} vector-effect=${NS}></path>`;
    case 'motion_sensor': {
      const arc = (k: number) => `M${R * k} ${-R * k * 0.8}A${R * k} ${R * k * 0.8} 0 0 1 ${R * k} ${R * k * 0.8}`;
      return svg`<circle class="icon" r=${R * 0.6} fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" stroke-dasharray=${da} vector-effect=${NS}></circle>
        <path class="arcs" d=${arc(1) + arc(1.5)} fill="none" stroke=${color} stroke-width="1.5" vector-effect=${NS}></path>`;
    }
    case 'illuminance_sensor': {
      let rays = '';
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        rays += `M${Math.cos(a) * R * 1.15} ${Math.sin(a) * R * 1.15}L${Math.cos(a) * R * 1.6} ${Math.sin(a) * R * 1.6}`;
      }
      return svg`<circle class="icon" r=${R * 0.7} fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" stroke-dasharray=${da} vector-effect=${NS}></circle>
        <path class="rays" d=${rays} fill="none" stroke=${color} stroke-width="1.5" vector-effect=${NS}></path>`;
    }
    case 'wall_switch':
      return svg`<rect class="icon" x=${-R * 0.6} y=${-R * 0.6} width=${R * 1.2} height=${R * 1.2} fill=${common.fill}
        stroke=${common.stroke} stroke-width="1.5" stroke-dasharray=${da} vector-effect=${NS}></rect>`;
    case 'valve':
      return svg`<path class="icon" d=${`M${-R} ${-R * 0.6}L${R} ${R * 0.6}L${R} ${-R * 0.6}L${-R} ${R * 0.6}Z`} fill=${common.fill}
        stroke=${common.stroke} stroke-width="1.5" stroke-linejoin="round" stroke-dasharray=${da} vector-effect=${NS}></path>`;
    case 'leak_sensor':
      return svg`<circle class="icon" r=${R * 0.7} fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" stroke-dasharray=${da} vector-effect=${NS}></circle>
        <path class="drop" d=${`M0 ${-R * 0.4}Q${R * 0.3} ${R * 0.05} 0 ${R * 0.3}Q${-R * 0.3} ${R * 0.05} 0 ${-R * 0.4}Z`} fill=${ink} stroke=${ink} stroke-width="1" vector-effect=${NS}></path>`;
    case 'smart_button':
      return svg`<rect class="icon" x=${-R * 0.6} y=${-R * 0.6} width=${R * 1.2} height=${R * 1.2} rx=${R * 0.35}
        fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" stroke-dasharray=${da}
        vector-effect=${NS}></rect>
        <circle class="dot" r=${R * 0.18} fill=${color}></circle>`;
    case 'socket':
      return svg`<circle class="icon" r=${R} fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" stroke-dasharray=${da} vector-effect=${NS}></circle>
        <circle class="dot" cx=${-R * 0.4} r=${R * 0.15} fill=${ink}></circle>
        <circle class="dot" cx=${R * 0.4} r=${R * 0.15} fill=${ink}></circle>`;
    case 'climate_sensor':
      return svg`<circle class="icon" cx=${-R * 0.3} r=${R * 0.45} fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" stroke-dasharray=${da} vector-effect=${NS}></circle>
        <path class="thermo" d=${`M${-R * 0.3} ${-R * 0.45}V${-R * 1.1}M${-R * 0.3} ${-R * 0.45}H${-R * 1.1}`} fill="none" stroke=${color} stroke-width="1.5" vector-effect=${NS}></path>
        <path class="drop" d=${`M${R * 0.7} ${-R * 0.7}Q${R * 1.1} ${-R * 0.1} ${R * 0.7} ${R * 0.3}Q${R * 0.3} ${-R * 0.1} ${R * 0.7} ${-R * 0.7}Z`} fill=${color} stroke=${color} stroke-width="1" vector-effect=${NS}></path>`;
    case 'exhaust_fan': {
      let blades = '';
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2 + Math.PI / 4;
        blades += `M0 0L${Math.cos(a) * R * 0.85} ${Math.sin(a) * R * 0.85}`;
      }
      return svg`<circle class="icon" r=${R} fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" stroke-dasharray=${da} vector-effect=${NS}></circle>
        <path class="blades" d=${blades} fill="none" stroke=${ink} stroke-width="1.5" vector-effect=${NS}></path>`;
    }
    default:
      return svg`${nothing}`;
  }
}

function equipmentBlock(d: Device, o: DeviceRenderOpts, color: string, deg: number, lit: boolean, dash?: string): SVGTemplateResult {
  const pr = d.props;
  if (pr.kind !== 'equipment') return svg`${nothing}`;
  const lay = equipmentLabelLayout(pr, pr.label, deg, o.scale);
  const da = dash ?? nothing;
  const body = pr.shape === 'circle'
    ? svg`<circle class="equipment-body" r=${pr.diameter / 2} fill=${o.palette.deviceFill} stroke=${color}
        stroke-width="1.5" stroke-dasharray=${da} vector-effect=${NS}></circle>
      ${lit ? svg`<circle class="equipment-lit" r=${pr.diameter / 2} fill=${color} fill-opacity="0.3"></circle>` : nothing}`
    : svg`<rect class="equipment-body" x=${-pr.width / 2} y=${-pr.depth / 2} width=${pr.width} height=${pr.depth}
        fill=${o.palette.deviceFill} stroke=${color} stroke-width="1.5" stroke-dasharray=${da} vector-effect=${NS}></rect>
      ${lit ? svg`<rect class="equipment-lit" x=${-pr.width / 2} y=${-pr.depth / 2} width=${pr.width} height=${pr.depth}
        fill=${color} fill-opacity="0.3"></rect>` : nothing}`;
  return svg`
    <g transform=${`rotate(${deg})`}>${body}</g>
    ${equipmentIcon(pr.icon, o.scale, color, lay.iconX, lay.iconY)}
    <text class="equipment-label" x=${lay.labelX} y=${lay.labelY} text-anchor=${lay.labelAnchor} dominant-baseline="middle"
      font-size=${EQ_LABEL_FONT_PX / o.scale}
      fill=${color} font-family="system-ui, sans-serif">${pr.label}</text>
    <g class="equipment-data"></g>`;
}

function bindRing(st: BindStatus, scale: number, body = 0): SVGTemplateResult | typeof nothing {
  if (st === 'bound') return nothing;
  return svg`<circle class=${`bind-ring bind-${st}`} r=${Math.max((ICON_PX * 1.7) / scale, body + 4 / scale)} fill="none" style=${`stroke:${BIND_STROKE[st]}`}
    stroke-width="2" stroke-dasharray=${st === 'unbound' ? '4 3' : nothing} vector-effect=${NS}></circle>`;
}

/**
 * The alert badge of an input container whose status is `error`, at the top-right of its symbol (unrotated): a circle
 * of BADGE_R_PX in the background colour, ringed in the alert colour, around a BADGE_ICON_PX MDI icon.
 */
function badge(live: ContainerState, R: number, o: DeviceRenderOpts): SVGTemplateResult | typeof nothing {
  if (live.status !== 'error') return nothing;
  const cx = R * 0.9;
  const cy = -R * 0.9;
  const size = BADGE_ICON_PX / o.scale;
  return svg`<g class="badge" data-badge="alert">
    <circle cx=${cx} cy=${cy} r=${BADGE_R_PX / o.scale} fill=${o.palette.background} stroke=${ALERT} stroke-width="1.5"
      vector-effect=${NS}></circle>
    <path d=${mdiAlert} fill=${ALERT} transform=${`translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})`}></path>
  </g>`;
}

/** Bubble ring and text colour by tone. */
function toneColor(tone: BubbleTone, p: PlanPalette): string {
  return tone === 'motion' ? p.motionCone : tone === 'leak' || tone === 'unmatched' ? ALERT : tone === 'event' ? p.selection : tone === 'mode' ? p.modeBubble : p.device;
}

/**
 * Pill bubbles in one stack on a side of the symbol (above, below, left or right; chosen by bubbleSide, inside the
 * zone when there is room), centred on that side; `leaving` ones fade out after the shown ones, and the stack grows
 * outward from the device. Constant screen size. `e` is the symbol's half-extent.
 */
function renderBubbles(level: Level, d: Device, pose: DevicePose, b: { shown: LiveBubble[]; leaving: LiveBubble[] }, e: number, o: DeviceRenderOpts): SVGTemplateResult | typeof nothing {
  const all = [...b.shown.map(x => [x, 'bubble-in'] as const), ...b.leaving.map(x => [x, 'bubble-out'] as const)];
  if (all.length === 0) return nothing;
  const k = 1 / o.scale;
  const widths = all.map(([x]) => (x.text.length * BUBBLE_FONT_PX * BUBBLE_CHAR_W + 2 * BUBBLE_PAD_PX) * k);
  const h = BUBBLE_H_PX * k;
  const step = (BUBBLE_H_PX + 2) * k;
  const stack = { w: Math.max(...widths), h: h + step * (all.length - 1) };
  const gap = e + 4 * k;
  // The side is chosen for the shown bubbles only, so it does not flip when a fading one is removed.
  const nShown = Math.max(1, b.shown.length);
  const side = bubbleSide(level, d, pose, { w: Math.max(...widths.slice(0, nShown)), h: h + step * (nShown - 1) }, gap);
  const origin = stackOrigin(side, stack, gap);
  return svg`${all.map(([x, cls], i) => {
    const w = widths[i];
    const bx = origin.x + (stack.w - w) / 2;
    const by = origin.y + (side.startsWith('up') ? all.length - 1 - i : i) * step;
    const c = toneColor(x.tone, o.palette);
    // A keyed (action) bubble that is replaced is a new element, so its pop-in plays again.
    return keyed(`${cls}:${x.key ?? ''}`, svg`<g class=${`bubble ${cls}`} data-tone=${x.tone}>
      <rect x=${bx} y=${by} width=${w} height=${h} rx=${h / 2} fill=${o.palette.background} stroke=${c} stroke-width="1.5"
        vector-effect=${NS}></rect>
      <text x=${bx + w / 2} y=${by + h / 2} text-anchor="middle" dominant-baseline="central" fill=${c} font-weight="700"
        font-size=${BUBBLE_FONT_PX * k} font-family="system-ui, sans-serif">${x.text}</text>
    </g>`);
  })}`;
}

/** Half-extent of a device symbol, where its bubbles start. */
function bubbleExtent(d: Device, o: DeviceRenderOpts): number {
  const p = d.props;
  if (p.kind === 'equipment') return (p.shape === 'circle' ? p.diameter / 2 : Math.hypot(p.width, p.depth) / 2) * Math.SQRT1_2;
  return roundLightR(d, ICON_PX / o.scale);
}

/** The bubbles of one device, at its position (unrotated), dimmed with it. */
function renderDeviceBubbles(level: Level, d: Device, pose: DevicePose, o: DeviceRenderOpts): SVGTemplateResult | typeof nothing {
  const b = o.bubbles?.(d);
  const inner = b ? renderBubbles(level, d, pose, b, bubbleExtent(d, o), o) : nothing;
  if (inner === nothing) return nothing;
  return svg`<g class="device-bubbles" data-id=${d.id} transform=${`translate(${pose.pt.x} ${pose.pt.y})`}
    opacity=${o.dim ? String(o.palette.dimOpacity) : nothing}>${inner}</g>`;
}

function renderDevice(d: Device, pose: DevicePose, o: DeviceRenderOpts, preview: boolean): SVGTemplateResult {
  const p = o.palette;
  const color = d.invalid ? p.invalid : p.device;
  const R = ICON_PX / o.scale;
  const deg = (Math.atan2(pose.dir.y, pose.dir.x) * 180) / Math.PI;
  const selected = !preview && o.selection?.kind === 'device' && o.selection.id === d.id;
  // An input container on the plan (not the placement preview) is either live or has no data (dashed outline).
  const container = !preview && isContainerKind(d.props.kind);
  const live = container ? o.containerState?.(d) : undefined;
  const dl = !preview ? o.live?.(d) : undefined;
  const lit = dl?.look === 'on' || dl?.look === 'active';
  const noData = (container && !!o.containerState && !live) || dl?.look === 'no-data';
  const kind = d.props.kind;
  const tint = !lit || d.invalid ? color : kind === 'leak_sensor' ? ALERT : kind === 'motion_sensor' ? p.motionCone : color;
  const cls = `device device-${d.props.kind}${selected ? ' selected' : ''}${d.invalid ? ' invalid' : ''}${preview ? ' device-preview' : ''}`
    + (noData ? ' no-data' : '');
  const opacity = preview ? '0.5' : o.dim ? String(p.dimOpacity) : nothing;
  const reach = d.props.kind === 'equipment'
    ? (d.props.shape === 'circle' ? d.props.diameter / 2 : Math.hypot(d.props.width, d.props.depth) / 2)
    : Math.max(R * 1.6, roundLightR(d, R));
  return svg`
    <g class=${cls} data-id=${d.id} opacity=${opacity} transform=${`translate(${pose.pt.x} ${pose.pt.y})`}>
      ${selected ? svg`<circle class="selection-ring" r=${reach + 4 / o.scale} fill="none" stroke=${p.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${NS}></circle>` : nothing}
      ${d.props.kind === 'equipment'
        ? equipmentBlock(d, o, color, deg, lit, noData ? NO_DATA_DASH : undefined)
        : svg`<g transform=${`rotate(${deg})`}>${iconShape(d, R, tint, lit ? tint : p.deviceFill,
          noData ? NO_DATA_DASH : undefined, lit ? p.deviceFill : tint, dl?.look === 'off')}</g>`}
      ${o.bindingStatus && !preview ? bindRing(o.bindingStatus(d), o.scale, roundLightR(d, R)) : nothing}
      ${live ? badge(live, R, o) : nothing}
    </g>`;
}

function renderCone(level: Level, d: Device, o: DeviceRenderOpts, preview: boolean): SVGTemplateResult | typeof nothing {
  const rings = coneRings(level, d); // [] for kinds without a cone
  if (rings.length === 0) return nothing;
  const p = o.palette;
  // Motion zones are violet (motionCone), light cones and pools amber (cone).
  const color = d.invalid ? p.invalid : coneMedium(d.props.kind) === 'motion' ? p.motionCone : p.cone;
  const opacity = preview ? '0.5' : o.dim ? String(p.dimOpacity) : nothing;
  const path = rings.map(ringD).join('');
  if (d.props.kind === 'ceiling_light') {
    return svg`<path class="pool" d=${path} fill="none" stroke=${color} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${opacity} vector-effect=${NS}></path>`;
  }
  return svg`<path class="cone" d=${path} fill=${color} fill-opacity="0.18"
    fill-rule="evenodd" stroke=${color} stroke-opacity="0.5" stroke-width="1" opacity=${opacity}
    vector-effect=${NS}></path>`;
}

/** Binding, light on: its clipped light area (or a disc without one) filled with a fading radial gradient, no outline. */
function renderLightFill(level: Level, d: Device, pose: DevicePose, o: DeviceRenderOpts): SVGTemplateResult {
  const rings = coneRings(level, d);
  let r = 0;
  for (const ring of rings) for (const q of ring) r = Math.max(r, Math.hypot(q.x - pose.pt.x, q.y - pose.pt.y));
  if (r === 0) r = (ICON_PX * 3) / o.scale;
  const id = `lg-${d.id}`;
  const c = o.palette.device;
  const opacity = o.dim ? String(o.palette.dimOpacity) : nothing;
  return svg`<g class="light-live" opacity=${opacity}>
    <defs><radialGradient id=${id} gradientUnits="userSpaceOnUse" cx=${pose.pt.x} cy=${pose.pt.y} r=${r}>
      <stop offset="0" stop-color=${c} stop-opacity="0.35"></stop><stop offset="1" stop-color=${c} stop-opacity="0"></stop>
    </radialGradient></defs>
    ${rings.length
      ? svg`<path class="light-fill" d=${rings.map(ringD).join('')} fill=${`url(#${id})`} fill-rule="evenodd" stroke="none"></path>`
      : svg`<circle class="light-fill" cx=${pose.pt.x} cy=${pose.pt.y} r=${r} fill=${`url(#${id})`} stroke="none"></circle>`}
  </g>`;
}

/** Direction handle of the selected wall light / sensor: a segment and a round grab knob. */
function renderHandle(level: Level, o: DeviceRenderOpts): SVGTemplateResult | typeof nothing {
  if (o.selection?.kind !== 'device' || o.bindingStatus) return nothing;
  const id = o.selection.id;
  const d = level.devices.find(x => x.id === id);
  const h = d ? directionHandle(level, d, o.scale) : null;
  if (!h) return nothing;
  const c = o.palette.selection;
  return svg`<g class="aim-handle" opacity=${o.dim ? String(o.palette.dimOpacity) : nothing}>
    <line x1=${h.from.x} y1=${h.from.y} x2=${h.to.x} y2=${h.to.y} stroke=${c} stroke-width="2" vector-effect=${NS}></line>
    <circle class="aim-knob" cx=${h.to.x} cy=${h.to.y} r=${6 / o.scale} fill=${o.palette.deviceFill} stroke=${c}
      stroke-width="2" vector-effect=${NS} style="cursor:grab"></circle>
  </g>`;
}

/** Devices (and their cones, drawn first so the icons sit on top) in millimetre user units. */
export function renderDevices(level: Level, o: DeviceRenderOpts): SVGTemplateResult {
  const items: { d: Device; pose: DevicePose; preview: boolean }[] = [];
  for (const d of level.devices) {
    const pose = devicePose(level, d);
    if (pose) items.push({ d, pose, preview: false });
  }
  if (o.preview) {
    const d: Device = { id: PREVIEW_ID, name: '', placement: o.preview.placement, props: o.preview.props, invalid: o.preview.invalid };
    const pose = devicePose(level, d);
    if (pose) items.push({ d, pose, preview: true });
  }
  return svg`
    <g class="cones">${items.map(i => {
      if (!o.showCones) return nothing;
      // Binding (live looks): lights only as a gradient while on, motion zones only while detecting. Else the idle look.
      if (o.live && !i.preview) {
        const look = o.live(i.d).look;
        const k = i.d.props.kind;
        if (k === 'ceiling_light' || k === 'wall_light') return look === 'on' ? renderLightFill(level, i.d, i.pose, o) : nothing;
        if (k === 'motion_sensor') return look === 'active' ? renderCone(level, i.d, o, false) : nothing;
        return nothing;
      }
      return renderCone(level, i.d, o, i.preview);
    })}</g>
    <g class="devices">${items.map(i => renderDevice(i.d, i.pose, o, i.preview))}</g>
    ${renderHandle(level, o)}
    ${o.bubbles ? svg`<g class="bubbles">${items.map(i => (i.preview ? nothing : renderDeviceBubbles(level, i.d, i.pose, o)))}</g>` : nothing}`;
}
