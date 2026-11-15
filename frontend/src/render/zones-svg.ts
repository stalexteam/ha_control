import { svg, nothing, type SVGTemplateResult } from 'lit';
import { levelZones, type AutomationZone, type Id, type Level } from '../model/types';
import type { Preview } from '../editor/tools/types';
import { zoneLabelPoint, zoneMembers, zoneOutline } from '../geometry/zones';
import { devicePose } from '../geometry/devices';
import type { PlanPalette } from './theme';
import { ringD } from './shared';

/** Fill and stroke hue of an automation zone, picked by its index in the level's zone list. */
export const ZONE_HUES = ['#38bdf8', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#f97316', '#2dd4bf'] as const;

export interface ZonesRenderOpts {
  palette: PlanPalette;
  /** Screen pixels per millimetre. */
  scale: number;
  selectedId: Id | null;
  draft?: Preview['zoneDraft'];
}

const NS = 'non-scaling-stroke';

function renderZone(level: Level, z: AutomationZone, i: number, o: ZonesRenderOpts): SVGTemplateResult {
  const p = o.palette;
  const hue = ZONE_HUES[i % ZONE_HUES.length];
  const selected = o.selectedId === z.id;
  const outline = zoneOutline(level, z);
  const at = zoneLabelPoint(outline);
  const fs = 12 / o.scale;
  const lostAt = (idx: number): boolean => {
    if (z.shape.kind !== 'polygon') return false;
    const v = z.shape.vertices[idx];
    return v.kind === 'free' && v.lost === true;
  };
  return svg`
    <g class=${`azone${z.invalid ? ' invalid' : ''}${selected ? ' selected' : ''}`} data-id=${z.id}>
      <path class="azone-fill" d=${ringD(outline)} fill=${z.invalid ? 'url(#azone-hatch)' : hue}
        fill-opacity=${z.invalid ? nothing : '0.18'} stroke=${hue} stroke-width=${selected ? '3' : '1.5'}
        vector-effect=${NS}></path>
      <text class="azone-label" x=${at.x} y=${at.y} text-anchor="middle" dominant-baseline="middle" font-size=${fs}
        fill=${z.invalid ? p.invalid : hue} font-family="system-ui, sans-serif">${z.name}</text>
      ${selected && z.shape.kind === 'polygon' ? outline.map((q, idx) => svg`
        <circle class=${`azone-vertex${lostAt(idx) ? ' lost' : ''}`} data-index=${idx} cx=${q.x} cy=${q.y}
          r=${5 / o.scale} fill=${p.background} stroke=${lostAt(idx) ? p.invalid : hue} stroke-width="2"
          vector-effect=${NS}></circle>`) : nothing}
    </g>`;
}

function renderMemberRings(level: Level, id: Id, o: ZonesRenderOpts): SVGTemplateResult {
  const p = o.palette;
  const r = 14 / o.scale;
  return svg`<g class="azone-members">${zoneMembers(level, id).map(({ device, participates }) => {
    const pose = devicePose(level, device);
    if (!pose) return nothing;
    return participates
      ? svg`<circle class="member-ring in" cx=${pose.pt.x} cy=${pose.pt.y} r=${r} fill="none" stroke=${p.selection}
          stroke-width="2" vector-effect=${NS}></circle>`
      : svg`<circle class="member-ring out" cx=${pose.pt.x} cy=${pose.pt.y} r=${r} fill="none" stroke=${p.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${NS}></circle>`;
  })}</g>`;
}

function renderDraft(d: NonNullable<Preview['zoneDraft']>, o: ZonesRenderOpts): SVGTemplateResult {
  const pts = d.cursor ? [...d.points, d.cursor] : d.points;
  return svg`<polyline class=${`azone-draft${d.invalid ? ' invalid' : ''}`} points=${pts.map(q => `${q.x},${q.y}`).join(' ')}
    fill="none" stroke=${d.invalid ? o.palette.invalid : o.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${NS}></polyline>`;
}

/** The automation zones layer of the Zones step: translucent areas, labels, handles and member rings of the selection, the draft. */
export function renderZones(level: Level, o: ZonesRenderOpts): SVGTemplateResult {
  const hs = 8 / o.scale;
  const zones = levelZones(level);
  return svg`
    <defs>
      <pattern id="azone-hatch" patternUnits="userSpaceOnUse" width=${hs} height=${hs} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${hs} stroke=${o.palette.invalid} stroke-width=${1.5 / o.scale}></line>
      </pattern>
    </defs>
    <g class="azones">${zones.map((z, i) => renderZone(level, z, i, o))}</g>
    ${o.selectedId && zones.some(z => z.id === o.selectedId) ? renderMemberRings(level, o.selectedId, o) : nothing}
    ${o.draft ? renderDraft(o.draft, o) : nothing}`;
}
