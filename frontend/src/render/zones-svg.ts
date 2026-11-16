import { svg, nothing, type SVGTemplateResult } from 'lit';
import type { Id, Level, Pt, Zone } from '../model/types';
import type { Preview } from '../editor/tools/types';
import { zoneArea, zoneLabelPoints, zoneMembers, zoneOutline } from '../geometry/zones';
import { devicePose } from '../geometry/devices';
import type { PlanPalette } from './theme';
import { cached, formatArea, ringD } from './shared';

/** Fill and stroke hue of a zone, picked by its index in the level's zone list. */
export const ZONE_HUES = ['#38bdf8', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#f97316', '#2dd4bf'] as const;

/** The hue of the zone at index i of the level's zone list. */
export const zoneHue = (i: number): string => ZONE_HUES[i % ZONE_HUES.length];

export interface ZoneAreasOpts {
  palette: PlanPalette;
  /** Screen pixels per millimetre. */
  scale: number;
  selectedId: Id | null;
  /** plan: fills, outlines and labels; equipment and binding: thin outlines only, in a dimmed layer. */
  mode: 'plan' | 'equipment' | 'binding';
}

export interface ZoneOverlayOpts {
  palette: PlanPalette;
  scale: number;
  selectedId: Id | null;
  draft?: Preview['zoneDraft'];
  /** Index of the picked vertex of the selected polygon zone. */
  vertex?: number | null;
}

const NS = 'non-scaling-stroke';
/** Opacity of the other zones while one is selected. */
const OTHERS = '0.55';

const labelCache = new WeakMap<Level, Map<Id, Pt>>();

function planZone(level: Level, z: Zone, i: number, o: ZoneAreasOpts): SVGTemplateResult {
  const p = o.palette;
  const hue = zoneHue(i);
  const selected = o.selectedId === z.id;
  const at = cached(labelCache, level, zoneLabelPoints).get(z.id) ?? { x: 0, y: 0 };
  const fs = 12 / o.scale;
  return svg`
    <g class="zone-item" data-id=${z.id} opacity=${o.selectedId !== null && !selected ? OTHERS : nothing}>
      <path class=${`zone${z.invalid ? ' broken' : ''}${selected ? ' selected' : ''}`} data-id=${z.id}
        d=${ringD(zoneOutline(level, z))} fill=${z.invalid ? 'url(#zone-hatch)' : hue}
        fill-opacity=${z.invalid ? nothing : selected ? '0.24' : '0.16'} stroke=${selected ? p.selection : hue}
        stroke-width=${selected ? '2.5' : '1.5'} vector-effect=${NS}></path>
      <text class="zone-label" x=${at.x} y=${at.y} text-anchor="middle" font-size=${fs} font-family="system-ui, sans-serif">
        <tspan x=${at.x} dy=${-0.2 * fs} font-weight="600" fill=${z.invalid ? p.invalid : p.text}>${z.name}</tspan>
        <tspan x=${at.x} dy=${1.2 * fs} font-size=${fs * 0.9} fill=${p.zoneLabel}>${formatArea(zoneArea(level, z))}</tspan>
      </text>
    </g>`;
}

/**
 * The zones under the walls. Plan step: translucent fills in per-zone hues (an invalid zone hatched), outlines, and
 * the name and area at the label point (zoneLabelPoints); the selected zone is drawn last with the selection stroke
 * and the others are dimmed. Equipment and Binding: thin outlines in the zone hues in a dimmed layer, no labels.
 */
export function renderZoneAreas(level: Level, o: ZoneAreasOpts): SVGTemplateResult {
  const p = o.palette;
  const items = level.zones.map((z, i) => ({ z, i }));
  if (o.mode !== 'plan') {
    return svg`<g class="zones" opacity=${String(p.dimOpacity)}>${items.map(({ z, i }) => svg`
      <path class="zone" data-id=${z.id} d=${ringD(zoneOutline(level, z))} fill="none" stroke=${zoneHue(i)} stroke-width="1"
        vector-effect=${NS}></path>`)}</g>`;
  }
  const sel = items.find(x => x.z.id === o.selectedId);
  const ordered = sel ? [...items.filter(x => x !== sel), sel] : items;
  const hs = 8 / o.scale;
  return svg`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${hs} height=${hs} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${hs} stroke=${p.invalid} stroke-width=${1.5 / o.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${ordered.map(({ z, i }) => planZone(level, z, i, o))}</g>`;
}

function memberRings(level: Level, id: Id, o: ZoneOverlayOpts): SVGTemplateResult {
  const p = o.palette;
  const r = 14 / o.scale;
  return svg`<g class="zone-members">${zoneMembers(level, id).map(({ device, participates }) => {
    const pose = devicePose(level, device);
    if (!pose) return nothing;
    return participates
      ? svg`<circle class="member-ring in" cx=${pose.pt.x} cy=${pose.pt.y} r=${r} fill="none" stroke=${p.selection}
          stroke-width="2" vector-effect=${NS}></circle>`
      : svg`<circle class="member-ring out" cx=${pose.pt.x} cy=${pose.pt.y} r=${r} fill="none" stroke=${p.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${NS}></circle>`;
  })}</g>`;
}

function handles(level: Level, z: Zone, o: ZoneOverlayOpts): SVGTemplateResult | typeof nothing {
  if (z.shape.kind !== 'polygon') return nothing;
  const p = o.palette;
  const vs = z.shape.vertices;
  return svg`${zoneOutline(level, z).map((q, idx) => {
    const v = vs[idx];
    const lost = v.kind === 'free' && v.lost === true;
    const on = o.vertex === idx;
    return svg`<circle class=${`zone-vertex${lost ? ' lost' : ''}${on ? ' on' : ''}`} data-index=${idx} cx=${q.x} cy=${q.y}
      r=${5 / o.scale} fill=${on ? p.selection : p.background} stroke=${lost ? p.invalid : p.selection} stroke-width="2"
      vector-effect=${NS}></circle>`;
  })}`;
}

function draft(d: NonNullable<Preview['zoneDraft']>, o: ZoneOverlayOpts): SVGTemplateResult {
  const pts = d.cursor ? [...d.points, d.cursor] : d.points;
  return svg`<polyline class=${`zone-draft${d.invalid ? ' invalid' : ''}`} points=${pts.map(q => `${q.x},${q.y}`).join(' ')}
    fill="none" stroke=${d.invalid ? o.palette.invalid : o.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${NS}></polyline>`;
}

/**
 * The Plan step's zone layer over the walls: the vertex handles of the selected polygon zone (lost ones in the invalid
 * colour, the picked one filled), rings around the devices inside the selected zone (dashed for opted-out ones) and
 * the polygon being drawn.
 */
export function renderZoneOverlay(level: Level, o: ZoneOverlayOpts): SVGTemplateResult {
  const z = o.selectedId === null ? undefined : level.zones.find(x => x.id === o.selectedId);
  return svg`<g class="zone-overlay">
    ${z ? memberRings(level, z.id, o) : nothing}
    ${z ? handles(level, z, o) : nothing}
    ${o.draft ? draft(o.draft, o) : nothing}</g>`;
}
