import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { t } from '../i18n';
import { entityLabel } from './candidates';
import { domainOf, stateOf, type EntityMeta, type HaMeta, type States } from './ha-meta';
import { ComboBase, mdiIcon, type ComboRow } from './combo-base';

/** Bundled MDI paths (24x24) by entity class or domain. */
const ICONS = {
  power: 'M7,2V13H10V22L17,10H13L17,2H7Z',
  temperature: 'M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z',
  humidity: 'M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0 0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0 1 11,11.25A1.25,1.25 0 0 1 9.75,12.5A1.25,1.25 0 0 1 8.5,11.25A1.25,1.25 0 0 1 9.75,10M14.25,14.5A1.25,1.25 0 0 1 15.5,15.75A1.25,1.25 0 0 1 14.25,17A1.25,1.25 0 0 1 13,15.75A1.25,1.25 0 0 1 14.25,14.5Z',
  motion: 'M14.12,10H19V8.2H15.38L13.38,4.87C13.08,4.37 12.54,4.03 11.92,4.03C11.74,4.03 11.58,4.06 11.42,4.11L6,5.8V11H7.8V7.33L9.91,6.67L6,22H7.8L10.67,13.89L13,17V22H14.8V15.59L12.31,11.05L13.04,8.18M18,2.5A1.5,1.5 0 0 1 16.5,4A1.5,1.5 0 0 1 15,2.5A1.5,1.5 0 0 1 16.5,1A1.5,1.5 0 0 1 18,2.5Z',
  illuminance: 'M12,7A5,5 0 0 1 17,12A5,5 0 0 1 12,17A5,5 0 0 1 7,12A5,5 0 0 1 12,7M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22M3.34,7L7.5,6.65L5.11,10.79L3.34,7M20.65,7L18.88,10.79L16.5,6.64L20.65,7M3.36,17L5.12,13.23L7.5,17.37L3.36,17M20.64,17L16.5,17.36L18.87,13.21L20.64,17Z',
  light: 'M12,2A7,7 0 0 0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0 0 9,18H15A1,1 0 0 0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0 0 12,2M9,21A1,1 0 0 0 10,22H14A1,1 0 0 0 15,21V20H9V21Z',
  switch: 'M17,7H7A5,5 0 0 0 2,12A5,5 0 0 0 7,17H17A5,5 0 0 0 22,12A5,5 0 0 0 17,7M17,15A3,3 0 0 1 14,12A3,3 0 0 1 17,9A3,3 0 0 1 20,12A3,3 0 0 1 17,15Z',
  event: 'M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0 0 5,21H19A2,2 0 0 0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z',
  fan: 'M12,11A1,1 0 0 0 11,12A1,1 0 0 0 12,13A1,1 0 0 0 13,12A1,1 0 0 0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.69 9.22,10.88C9.41,10.4 9.73,9.97 10.13,9.65C8.15,5.96 8.94,2 12.5,2Z',
  generic: 'M12,20A8,8 0 0 1 4,12A8,8 0 0 1 12,4A8,8 0 0 1 20,12A8,8 0 0 1 12,20M12,2A10,10 0 0 0 2,12A10,10 0 0 0 12,22A10,10 0 0 0 22,12A10,10 0 0 0 12,2Z',
} as const;
type IconName = keyof typeof ICONS;

const BY_CLASS: Record<string, IconName> = {
  power: 'power', energy: 'power', temperature: 'temperature', humidity: 'humidity',
  motion: 'motion', occupancy: 'motion', presence: 'motion', illuminance: 'illuminance',
};
const BY_DOMAIN: Record<string, IconName> = { light: 'light', switch: 'switch', event: 'event', fan: 'fan' };

function iconFor(e: EntityMeta | undefined, eid: string): IconName {
  if (e?.deviceClass && BY_CLASS[e.deviceClass]) return BY_CLASS[e.deviceClass];
  return BY_DOMAIN[e?.domain ?? domainOf(eid)] ?? 'generic';
}

const icon = (name: IconName): TemplateResult => mdiIcon(ICONS[name]);

function domainLabel(domain: string): string {
  switch (domain) {
    case 'sensor': return t('combo.domain.sensor');
    case 'binary_sensor': return t('combo.domain.binary_sensor');
    case 'light': return t('combo.domain.light');
    case 'switch': return t('combo.domain.switch');
    case 'fan': return t('combo.domain.fan');
    case 'event': return t('combo.domain.event');
    default: return domain;
  }
}

interface EntityRow extends ComboRow { e: EntityMeta }

/**
 * Entity combobox laid out like Home Assistant's entity picker. The rows come from `items` (structural metadata);
 * the state shown on each row is read live from `states`.
 */
export class EntityCombo extends ComboBase<EntityRow> {
  @property({ attribute: false }) meta!: HaMeta;
  @property({ attribute: false }) items: readonly EntityMeta[] = [];
  /** hass.states: the live state shown on each row. */
  @property({ attribute: false }) states: States = undefined;

  protected rowDeps(): readonly unknown[] { return [this.items, this.meta]; }

  protected *allRows(): Iterable<EntityRow> {
    for (const e of this.items) {
      const { name, context } = entityLabel(this.meta, e.entityId);
      yield { id: e.entityId, name, context, search: `${name}\n${e.entityId}\n${context}`.toLowerCase(), e };
    }
  }

  protected renderBox(): TemplateResult {
    const eid = this.value;
    const lab = eid ? entityLabel(this.meta, eid) : null;
    return html`${icon(eid ? iconFor(this.meta.entities.get(eid), eid) : 'generic')}
      ${lab ? html`<span><b>${lab.name}</b>${lab.context !== lab.name ? html`<small>${lab.context}</small>` : nothing}<small class="eid">${eid}</small></span>`
        : html`<span class="ph">${t('combo.none')}</span>`}`;
  }

  protected renderRow({ e, name, context }: EntityRow): TemplateResult {
    const state = stateOf(this.states, e.entityId) ?? 'unavailable';
    return html`${icon(iconFor(e, e.entityId))}
      <span><b>${name}</b><small>${context}</small><small class="eid">${e.entityId}</small></span>
      <span class="side">${domainLabel(e.domain)}<br>${state}${e.unit ? ` ${e.unit}` : ''}</span>`;
  }

  protected boxTitle(): string | undefined {
    const eid = this.value;
    if (!eid) return undefined;
    const name = entityLabel(this.meta, eid).name;
    return name === eid ? eid : `${name} (${eid})`;
  }
  protected rowTitle(r: EntityRow): string { return r.name === r.id ? r.id : `${r.name} (${r.id})`; }

  protected searchLabel(): string { return t('combo.search'); }
  protected emptyText(): string { return t('combo.empty'); }
}

if (!customElements.get('ps-entity-combo')) customElements.define('ps-entity-combo', EntityCombo);

declare global { interface HTMLElementTagNameMap { 'ps-entity-combo': EntityCombo } }
