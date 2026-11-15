import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { t } from '../i18n';
import type { DeviceMeta, HaMeta } from './ha-meta';
import { ComboBase, mdiIcon, type ComboRow } from './combo-base';

/** mdi:devices */
const DEVICE_ICON = 'M3,6H21V4H3C1.9,4 1,4.9 1,6V18A2,2 0 0,0 3,20H7V18H3V6M13,12H9V13.78C8.39,14.33 8,15.11 8,16C8,16.89 8.39,17.67 9,18.22V20H13V18.22C13.61,17.67 14,16.88 14,16C14,15.12 13.61,14.33 13,13.78V12M11,17.5A1.5,1.5 0 0,1 9.5,16A1.5,1.5 0 0,1 11,14.5A1.5,1.5 0 0,1 12.5,16A1.5,1.5 0 0,1 11,17.5M22,8H16A1,1 0 0,0 15,9V19A1,1 0 0,0 16,20H22A1,1 0 0,0 23,19V9A1,1 0 0,0 22,8M21,18H17V10H21V18Z';

/**
 * Home Assistant device combobox, searchable by name, model and area (rows read "Area · Model"). It is an action
 * picker: choosing a device fires `value-changed` and the box keeps showing its placeholder.
 */
export class DeviceCombo extends ComboBase {
  @property({ attribute: false }) meta!: HaMeta;
  @property({ attribute: false }) devices: readonly DeviceMeta[] = [];
  /** Text of the closed box. */
  @property() placeholder = '';

  protected rowDeps(): readonly unknown[] { return [this.devices, this.meta]; }

  protected *allRows(): Iterable<ComboRow> {
    for (const d of this.devices) {
      const area = d.areaId ? this.meta.areas.get(d.areaId) : undefined;
      const context = [area, d.model].filter((p): p is string => !!p).join(' · ');
      yield { id: d.id, name: d.name, context, search: `${d.name}\n${context}`.toLowerCase() };
    }
  }

  protected renderBox(): TemplateResult {
    return html`${mdiIcon(DEVICE_ICON)}<span class="ph">${this.placeholder}</span>`;
  }

  protected renderRow(r: ComboRow): TemplateResult {
    return html`${mdiIcon(DEVICE_ICON)}<span><b>${r.name}</b>${r.context ? html`<small>${r.context}</small>` : nothing}</span>`;
  }

  protected searchLabel(): string { return t('combo.searchDevices'); }
  protected emptyText(): string { return t('combo.emptyDevices'); }
}

if (!customElements.get('ps-device-combo')) customElements.define('ps-device-combo', DeviceCombo);

declare global { interface HTMLElementTagNameMap { 'ps-device-combo': DeviceCombo } }
