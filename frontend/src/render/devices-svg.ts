import { svg, nothing, type SVGTemplateResult } from 'lit';
import type { Device, Level, Pt } from '../model/types';
import type { Preview, Selection } from '../editor/tools/types';
import { clippedCone, devicePose, directionHandle, type DevicePose } from '../geometry/devices';
import { roomHoles } from '../geometry/rooms';
import type { PlanPalette } from './theme';
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
}

const NS = 'non-scaling-stroke';
const GLYPH: Record<string, string> = { boiler: 'B', pc: 'PC', automation: 'A', other: '•' };
const PREVIEW_ID = '__preview__';

// Room holes are cached per level object (levels are immutable snapshots): one computation per frame.
const holesCache = new WeakMap<Level, Pt[][]>();
const holesOf = (level: Level): Pt[][] => cached(holesCache, level, roomHoles);

function iconShape(d: Device, R: number, color: string, fill: string): SVGTemplateResult {
  const pr = d.props;
  const common = { stroke: color, fill };
  switch (pr.kind) {
    case 'ceiling_light':
      if (pr.shape === 'linear') {
        return svg`<rect class="icon" x=${-pr.length / 2} y=${-pr.width / 2} width=${pr.length} height=${pr.width}
          fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" vector-effect=${NS}></rect>`;
      }
      if (pr.shape === 'spot') {
        return svg`<circle class="icon" r=${R / 3} fill=${color} stroke=${color} stroke-width="1" vector-effect=${NS}></circle>`;
      }
      return svg`<circle class="icon" r=${R} fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" vector-effect=${NS}></circle>`;
    case 'wall_light':
      return svg`<path class="icon" d=${`M0 ${-R}A${R} ${R} 0 0 0 0 ${R}Z`} fill=${common.fill} stroke=${common.stroke}
        stroke-width="1.5" vector-effect=${NS}></path>`;
    case 'motion_sensor': {
      const arc = (k: number) => `M${R * k} ${-R * k * 0.8}A${R * k} ${R * k * 0.8} 0 0 1 ${R * k} ${R * k * 0.8}`;
      return svg`<circle class="icon" r=${R * 0.6} fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" vector-effect=${NS}></circle>
        <path class="arcs" d=${arc(1) + arc(1.5)} fill="none" stroke=${color} stroke-width="1.5" vector-effect=${NS}></path>`;
    }
    case 'illuminance_sensor': {
      let rays = '';
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        rays += `M${Math.cos(a) * R * 1.15} ${Math.sin(a) * R * 1.15}L${Math.cos(a) * R * 1.6} ${Math.sin(a) * R * 1.6}`;
      }
      return svg`<circle class="icon" r=${R * 0.7} fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" vector-effect=${NS}></circle>
        <path class="rays" d=${rays} fill="none" stroke=${color} stroke-width="1.5" vector-effect=${NS}></path>`;
    }
    case 'switch':
      return svg`<rect class="icon" x=${-R * 0.6} y=${-R * 0.6} width=${R * 1.2} height=${R * 1.2} fill=${common.fill}
        stroke=${common.stroke} stroke-width="1.5" vector-effect=${NS}></rect>`;
    case 'socket':
      return svg`<circle class="icon" r=${R} fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" vector-effect=${NS}></circle>
        <circle class="dot" cx=${-R * 0.4} r=${R * 0.15} fill=${color}></circle>
        <circle class="dot" cx=${R * 0.4} r=${R * 0.15} fill=${color}></circle>`;
    case 'climate_sensor':
      return svg`<circle class="icon" cx=${-R * 0.3} r=${R * 0.45} fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" vector-effect=${NS}></circle>
        <path class="thermo" d=${`M${-R * 0.3} ${-R * 0.45}V${-R * 1.1}M${-R * 0.3} ${-R * 0.45}H${-R * 1.1}`} fill="none" stroke=${color} stroke-width="1.5" vector-effect=${NS}></path>
        <path class="drop" d=${`M${R * 0.7} ${-R * 0.7}Q${R * 1.1} ${-R * 0.1} ${R * 0.7} ${R * 0.3}Q${R * 0.3} ${-R * 0.1} ${R * 0.7} ${-R * 0.7}Z`} fill=${color} stroke=${color} stroke-width="1" vector-effect=${NS}></path>`;
    case 'exhaust_fan': {
      let blades = '';
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2 + Math.PI / 4;
        blades += `M0 0L${Math.cos(a) * R * 0.85} ${Math.sin(a) * R * 0.85}`;
      }
      return svg`<circle class="icon" r=${R} fill=${common.fill} stroke=${common.stroke} stroke-width="1.5" vector-effect=${NS}></circle>
        <path class="blades" d=${blades} fill="none" stroke=${color} stroke-width="1.5" vector-effect=${NS}></path>`;
    }
    default:
      return svg`${nothing}`;
  }
}

function equipmentBlock(d: Device, o: DeviceRenderOpts, color: string, deg: number): SVGTemplateResult {
  const pr = d.props;
  if (pr.kind !== 'equipment') return svg`${nothing}`;
  const fs = ICON_PX / o.scale;
  const body = pr.shape === 'circle'
    ? svg`<circle class="equipment-body" r=${pr.diameter / 2} fill=${o.palette.deviceFill} stroke=${color}
        stroke-width="1.5" vector-effect=${NS}></circle>`
    : svg`<rect class="equipment-body" x=${-pr.width / 2} y=${-pr.depth / 2} width=${pr.width} height=${pr.depth}
        fill=${o.palette.deviceFill} stroke=${color} stroke-width="1.5" vector-effect=${NS}></rect>`;
  return svg`
    <g transform=${`rotate(${deg})`}>${body}</g>
    <text class="equipment-glyph" text-anchor="middle" dominant-baseline="middle" font-size=${fs} fill=${color}
      font-family="system-ui, sans-serif" font-weight="600">${GLYPH[pr.symbol] ?? GLYPH.other}</text>
    <text class="equipment-label" y=${fs * 1.5} text-anchor="middle" dominant-baseline="middle" font-size=${fs * 0.85}
      fill=${color} font-family="system-ui, sans-serif">${pr.label}</text>
    <g class="equipment-data"></g>`;
}

function renderDevice(d: Device, pose: DevicePose, o: DeviceRenderOpts, preview: boolean): SVGTemplateResult {
  const p = o.palette;
  const color = d.invalid ? p.invalid : p.device;
  const R = ICON_PX / o.scale;
  const deg = (Math.atan2(pose.dir.y, pose.dir.x) * 180) / Math.PI;
  const selected = !preview && o.selection?.kind === 'device' && o.selection.id === d.id;
  const cls = `device device-${d.props.kind}${selected ? ' selected' : ''}${d.invalid ? ' invalid' : ''}${preview ? ' device-preview' : ''}`;
  const opacity = preview ? '0.5' : o.dim ? String(p.dimOpacity) : nothing;
  const reach = d.props.kind === 'equipment'
    ? (d.props.shape === 'circle' ? d.props.diameter / 2 : Math.hypot(d.props.width, d.props.depth) / 2)
    : R * 1.6;
  return svg`
    <g class=${cls} data-id=${d.id} opacity=${opacity} transform=${`translate(${pose.pt.x} ${pose.pt.y})`}>
      ${selected ? svg`<circle class="selection-ring" r=${reach + 4 / o.scale} fill="none" stroke=${p.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${NS}></circle>` : nothing}
      ${d.props.kind === 'equipment'
        ? equipmentBlock(d, o, color, deg)
        : svg`<g transform=${`rotate(${deg})`}>${iconShape(d, R, color, p.deviceFill)}</g>`}
    </g>`;
}

function renderCone(level: Level, d: Device, o: DeviceRenderOpts, preview: boolean): SVGTemplateResult | typeof nothing {
  const rings = clippedCone(level, d, holesOf); // [] for kinds without a cone
  if (rings.length === 0) return nothing;
  const p = o.palette;
  const color = d.invalid ? p.invalid : p.cone;
  const opacity = preview ? '0.5' : o.dim ? String(p.dimOpacity) : nothing;
  const path = rings.map(ringD).join('');
  if (d.props.kind === 'ceiling_light') {
    return svg`<path class="pool" d=${path} fill="none" stroke=${color} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${opacity} vector-effect=${NS}></path>`;
  }
  return svg`<path class="cone" d=${path} fill=${color} fill-opacity="0.18" fill-rule="evenodd" stroke=${color}
    stroke-opacity="0.5" stroke-width="1" opacity=${opacity} vector-effect=${NS}></path>`;
}

/** Direction handle of the selected wall light / sensor: a segment and a round grab knob. */
function renderHandle(level: Level, o: DeviceRenderOpts): SVGTemplateResult | typeof nothing {
  if (o.selection?.kind !== 'device') return nothing;
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
    <g class="cones">${o.showCones ? items.map(i => renderCone(level, i.d, o, i.preview)) : nothing}</g>
    <g class="devices">${items.map(i => renderDevice(i.d, i.pose, o, i.preview))}</g>
    ${renderHandle(level, o)}`;
}
