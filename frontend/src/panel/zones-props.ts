import { html, nothing, type TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';
import type { Level, Zone } from '../model/types';
import type { Selection } from '../editor/tools/types';
import { deleteZone, renameZone, setZoneParticipation } from '../model/zones';
import { zoneMembers } from '../geometry/zones';
import { t } from '../i18n';
import { fieldValue } from './field-value';
import { row } from './fields';
import { countText } from './steps';
import { zoneInvalidText, zoneKindLabel } from './zones-list';

export interface ZonesPropsOpts {
  level: Level;
  selection: Selection | null;
  /** Session error or warning text (shown in every step). */
  notice: string | null;
  commit(next: Level): void;
}

/** The devices inside the zone, each with its Participates checkbox (unchecked: the zone is on its blacklist). */
function members(o: ZonesPropsOpts, z: Zone): TemplateResult {
  const list = zoneMembers(o.level, z.id);
  return html`<div class="zmembers">
    <div class="zhead"><span>${t('zones.members')}</span>${list.length ? html`<span>${t('zones.participates')}</span>` : nothing}</div>
    ${list.length === 0 ? html`<p class="muted">${t('zones.noMembers')}</p>` : list.map(({ device: d, participates }) => html`
      <label class="member" data-device=${d.id}>
        <span class="nm"><span class="name">${d.name}</span><small class="kind">${t(`device.${d.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${t('zones.participates')} .checked=${live(participates)}
          @change=${(e: Event) => {
            const next = setZoneParticipation(o.level, d.id, z.id, (e.target as HTMLInputElement).checked);
            if (next !== o.level) o.commit(next);
          }} />
      </label>`)}
  </div>`;
}

function zoneProps(o: ZonesPropsOpts, z: Zone): TemplateResult {
  const invalid = zoneInvalidText(o.level, z);
  return html`
    <h4>${t('zones.default')}</h4>
    ${row(t('props.name'), html`<input class="val wide" type="text" data-field="zone-name" .value=${fieldValue(z.name)}
      @change=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        const name = el.value.trim();
        if (!name || name === z.name) { el.value = z.name; return; }
        o.commit(renameZone(o.level, z.id, name));
      }} />`)}
    ${row(t('props.kind'), html`<span class="val ro" data-field="zone-kind">${zoneKindLabel(z)}</span>`)}
    ${invalid ? html`<p class="warn" data-note="zone-invalid">${invalid}</p>` : nothing}
    ${members(o, z)}
    <button class="btn danger" data-action="delete-zone" @click=${() => o.commit(deleteZone(o.level, z.id))}>
      ${t('zones.delete')}</button>`;
}

/** The Zones step properties: the selected zone, or a hint and the zone count. */
export function renderZonesProps(o: ZonesPropsOpts): TemplateResult {
  const s = o.selection;
  const zones = o.level.zones;
  const z = s?.kind === 'zone' ? zones.find(x => x.id === s.id) ?? null : null;
  return html`<div class="props zprops">
    ${z ? zoneProps(o, z) : html`
      <p class="muted">${t('zones.hint')}</p>
      <p class="muted" data-note="zone-count">${countText(zones.length, 'steps.zone', 'steps.zones')}</p>`}
    ${o.notice ? html`<p class="warn">${o.notice}</p>` : nothing}
  </div>`;
}
