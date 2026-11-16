import { html, svg, type TemplateResult } from 'lit';
import { mdiFloorPlan, mdiVectorPolygon } from '@mdi/js';
import type { Id, Level, Zone } from '../model/types';
import type { Selection } from '../editor/tools/types';
import { zoneArea, zoneInvalidReason } from '../geometry/zones';
import { zoneHue } from '../render/zones-svg';
import { t } from '../i18n';
import { fieldValue } from './field-value';

export interface ZonesListOpts {
  level: Level;
  selection: Selection | null;
  /** Text filter on the zone name and method. */
  query: string;
  onQuery(q: string): void;
  onPick(id: Id): void;
}

/** "By walls" or "Polygon". */
export const zoneKindLabel = (z: Zone): string => t(`zones.kind.${z.shape.kind}`);

/** The method icon of a zone (or of a method): By walls or Polygon. */
export const methodIcon = (kind: Zone['shape']['kind']): TemplateResult => html`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${svg`<path d=${kind === 'walls' ? mdiFloorPlan : mdiVectorPolygon}></path>`}</svg>`;

/** Why the zone is invalid, as text; null for a valid zone. */
export function zoneInvalidText(level: Level, z: Zone): string | null {
  const r = zoneInvalidReason(level, z);
  return r ? t(`zones.invalid.${r}`) : null;
}

/**
 * The zone list of the Plan step's properties: a text filter, then one row per zone in level order (its plan hue,
 * name, method icon and area in m², "—" without one; an invalid zone's swatch is the warning marker). A row click picks the zone.
 */
export function renderZonesList(o: ZonesListOpts): TemplateResult {
  const q = o.query.trim().toLowerCase();
  const sel = o.selection?.kind === 'zone' ? o.selection.id : null;
  const rows = o.level.zones.map((z, i) => ({ z, hue: zoneHue(i) }))
    .filter(({ z }) => !q || z.name.toLowerCase().includes(q) || zoneKindLabel(z).toLowerCase().includes(q));
  return html`
    <div class="zlist">
      <div class="zhead"><span>${t('zones.list').replace('{n}', String(o.level.zones.length))}</span><span>${t('unit.m2')}</span></div>
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
            <span class="name">${z.name}</span>
            <span class="zkind" data-kind=${z.shape.kind} title=${zoneKindLabel(z)}>${methodIcon(z.shape.kind)}</span>
            <span class="zarea">${zoneArea(o.level, z)?.toFixed(1) ?? '—'}</span>
          </button>`;
        })}
      </div>
    </div>`;
}
