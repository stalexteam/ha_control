import { html, type TemplateResult } from 'lit';
import type { Id, Level, Zone } from '../model/types';
import type { Selection } from '../editor/tools/types';
import { zoneInvalidReason, zoneMembers } from '../geometry/zones';
import { ZONE_HUES } from '../render/zones-svg';
import { cached } from '../render/shared';
import { t } from '../i18n';
import { fieldValue } from './field-value';
import { toolButtons } from './toolbar';
import type { ToolId } from './tool-factory';

export interface ZonesListOpts {
  level: Level;
  selection: Selection | null;
  toolId: ToolId;
  /** Text filter on the zone name and kind. */
  query: string;
  onTool(id: ToolId): void;
  onQuery(q: string): void;
  onPick(id: Id): void;
}

/** "By walls" or "Polygon". */
export const zoneKindLabel = (z: Zone): string => t(`zones.kind.${z.shape.kind}`);

/** Why the zone is invalid, as text; null for a valid zone. */
export function zoneInvalidText(level: Level, z: Zone): string | null {
  const r = zoneInvalidReason(level, z);
  return r ? t(`zones.invalid.${r}`) : null;
}

const countCache = new WeakMap<Level, Map<Id, number>>();

/** Participating members per zone id: the devices inside that did not opt out. */
function memberCounts(level: Level): Map<Id, number> {
  return cached(countCache, level, l =>
    new Map(l.zones.map(z => [z.id, zoneMembers(l, z.id).filter(m => m.participates).length])));
}

/**
 * The Zones step rail: the three tools, a text filter and one row per zone in level order (its plan hue, name, kind
 * and participating member count; an invalid zone's swatch is the warning marker).
 */
export function renderZonesList(o: ZonesListOpts): TemplateResult {
  const counts = memberCounts(o.level);
  const q = o.query.trim().toLowerCase();
  const sel = o.selection?.kind === 'zone' ? o.selection.id : null;
  const rows = o.level.zones.map((z, i) => ({ z, hue: ZONE_HUES[i % ZONE_HUES.length] }))
    .filter(({ z }) => !q || z.name.toLowerCase().includes(q) || zoneKindLabel(z).toLowerCase().includes(q));
  return html`
    <div class="zlist">
      <div class="ztools">${toolButtons('zones', o.toolId, o.onTool)}</div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${t('zones.filter')}
        aria-label=${t('zones.filter')} .value=${fieldValue(o.query)}
        @input=${(e: Event) => o.onQuery((e.target as HTMLInputElement).value)} />
      <div class="rows">
        ${rows.map(({ z, hue }) => {
          const invalid = z.invalid ? zoneInvalidText(o.level, z) ?? '' : null;
          return html`<button class="zrow${z.id === sel ? ' sel' : ''}" data-id=${z.id} @click=${() => o.onPick(z.id)}>
            ${invalid === null
              ? html`<span class="zswatch" style=${`background:${hue}`}></span>`
              : html`<span class="zswatch zinvalid" role="img" aria-label=${invalid} title=${invalid}></span>`}
            <span class="nm"><span class="name">${z.name}</span><small class="kind">${zoneKindLabel(z)}</small></span>
            <span class="zcount" title=${t('zones.members')}>${counts.get(z.id) ?? 0}</span>
          </button>`;
        })}
      </div>
    </div>`;
}
