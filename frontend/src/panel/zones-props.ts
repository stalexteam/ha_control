import { html, nothing, type TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';
import type { Level, Zone } from '../model/types';
import type { ZoneMethod } from '../editor/tools/types';
import { deleteZone, keepZoneOutline, renameZone, setZoneAutomation, setZoneParticipation } from '../model/zones';
import { zoneArea, zoneMembers } from '../geometry/zones';
import { formatArea } from '../render/shared';
import { t } from '../i18n';
import { fieldValue } from './field-value';
import { row } from './fields';
import { defaultZoneName, type NextObjects } from './next-object';
import { methodIcon, zoneInvalidText, zoneKindLabel } from './zones-list';

/** The Automation checkbox (a zone's, or the next zone's). */
const automationBox = (field: string, on: boolean, set: (on: boolean) => void): TemplateResult => html`
  <label class="zcheck"><input type="checkbox" data-field=${field} .checked=${live(on)}
    @change=${(e: Event) => set((e.target as HTMLInputElement).checked)} />${t('zones.automation')}</label>`;

/** The devices inside the zone, each with its Participates checkbox (unchecked: the zone is on its blacklist). */
function members(level: Level, z: Zone, commit: (next: Level) => void): TemplateResult {
  const list = zoneMembers(level, z.id);
  return html`<div class="zmembers">
    <div class="zhead"><span>${t('zones.inside').replace('{n}', String(list.length))}</span>
      ${list.length ? html`<span>${t('zones.participates')}</span>` : nothing}</div>
    ${list.length === 0 ? html`<p class="muted">${t('zones.noMembers')}</p>` : list.map(({ device: d, participates }) => html`
      <label class="member" data-device=${d.id}>
        <span class="nm"><span class="name">${d.name}</span><small class="kind">${t(`device.${d.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${t('zones.participates')} .checked=${live(participates)}
          @change=${(e: Event) => {
            const next = setZoneParticipation(level, d.id, z.id, (e.target as HTMLInputElement).checked);
            if (next !== level) commit(next);
          }} />
      </label>`)}
  </div>`;
}

/**
 * The selected zone's properties: Name, Area (read-only), Outline (By walls / Polygon), the Automation checkbox, the
 * devices inside with Participates, Delete zone. An invalid zone shows its reason; a broken walls zone also offers
 * Keep outline as a polygon.
 */
export function renderZoneProps(level: Level, z: Zone, commit: (next: Level) => void): TemplateResult {
  const invalid = zoneInvalidText(level, z);
  const broken = z.shape.kind === 'walls' && z.shape.broken;
  return html`<div class="zprops">
    <h4>${t('props.zone')}</h4>
    ${row(t('props.name'), html`<input class="val wide" type="text" data-field="zone-name" .value=${fieldValue(z.name)}
      @change=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        const name = el.value.trim();
        if (!name || name === z.name) { el.value = z.name; return; }
        commit(renameZone(level, z.id, name));
      }} />`)}
    ${row(t('props.area'), html`<span class="val ro" data-field="zone-area">${formatArea(zoneArea(level, z))}</span>`)}
    ${row(t('zones.outline'), html`<span class="val ro zkindval" data-field="zone-kind">${methodIcon(z.shape.kind)}${zoneKindLabel(z)}</span>`)}
    ${automationBox('zone-automation', z.automation !== false, on => {
      const next = setZoneAutomation(level, z.id, on);
      if (next !== level) commit(next);
    })}
    ${invalid ? html`<div class="warnbox"><p class="warn" data-note="zone-invalid">${invalid}</p>
      ${broken ? html`<button class="btn" data-action="keep-outline" @click=${() => commit(keepZoneOutline(level, z.id))}>
        ${t('zones.keepOutline')}</button>` : nothing}</div>` : nothing}
    ${members(level, z, commit)}
    <button class="btn danger" data-action="delete-zone" @click=${() => commit(deleteZone(level, z.id))}>
      ${t('zones.delete')}</button>
  </div>`;
}

export interface NextZoneOpts {
  level: Level;
  next: NextObjects;
  setNext(n: NextObjects): void;
  /** Switches the Zone tool's method (the tool is re-created: a draft goes). */
  onMethod(m: ZoneMethod): void;
}

/** The Zone tool's settings: the method switch, a one-line hint, the next zone's name and Automation. */
export function renderNextZone(o: NextZoneOpts): TemplateResult {
  const zn = o.next.zone;
  const shown = zn.name ?? defaultZoneName(o.level);
  const set = (p: Partial<NextObjects['zone']>) => o.setNext({ ...o.next, zone: { ...zn, ...p } });
  return html`
    <h4>${t('props.nextZone')}</h4>
    <div class="muted">${t('zones.method')}</div>
    <div class="mseg" role="radiogroup" aria-label=${t('zones.method')}>
      ${(['walls', 'polygon'] as ZoneMethod[]).map(m => html`
        <button class=${zn.method === m ? 'on' : ''} role="radio" aria-checked=${String(zn.method === m)} data-method=${m}
          @click=${() => { if (m !== zn.method) o.onMethod(m); }}>${methodIcon(m)}<span>${t(`zones.kind.${m}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${t(`zones.hint.${zn.method}`)}</p>
    ${row(t('props.name'), html`<input class="val wide" type="text" data-field="next-zone-name" .value=${fieldValue(shown)}
      @change=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        const name = el.value.trim();
        if (!name) { el.value = shown; return; }
        if (name !== shown) set({ name });
      }} />`)}
    ${automationBox('next-zone-automation', zn.automation, on => set({ automation: on }))}`;
}
