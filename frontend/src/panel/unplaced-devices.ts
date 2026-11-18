import { html, nothing, type TemplateResult } from 'lit';
import { addUnplacedDevice, deviceRole, isInverter } from '../model/devices';
import { nextFreeName } from '../model/ids';
import type { Device, Id, Level } from '../model/types';
import { t } from '../i18n';

/** The devices that are not on the plan, by name. */
export function unplacedDevices(level: Level): Device[] {
  return level.devices.filter(d => d.placement.mode === 'none')
    .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
}

/** The kinds the "New ..." buttons add off the plan. */
export type NewKind = 'equipment' | 'virtual_switch' | 'speaker' | 'phone';

/** A new device that is not on the plan, named "Device N" (or "Virtual switch N", "Speaker N", "Phone N") with the smallest N no device of that kind has. */
export function newUnplacedDevice(level: Level, kind: NewKind = 'equipment'): { level: Level; id: Id } {
  const names = level.devices.filter(d => d.props.kind === kind).map(d => d.name);
  return addUnplacedDevice(level, nextFreeName(t(`device.${kind}`), names), kind);
}

/** What an equipment device is: "Inverter" with that flag, otherwise its role by what is bound; '' for other kinds. */
export function deviceRoleLabel(d: Device): string {
  if (isInverter(d)) return t('props.inverter');
  const role = deviceRole(d);
  return role ? t(`deviceRole.${role}`) : '';
}

/** A device's properties header: its kind, with the role for equipment ("Device · Metered switch"). */
export function deviceTitle(d: Device): string {
  const kind = t(`device.${d.props.kind}`);
  const role = deviceRoleLabel(d);
  return role ? `${kind} · ${role}` : kind;
}

export interface UnplacedListOpts {
  level: Level;
  /** Selects the device of a row. */
  onPick(id: Id): void;
  /** "New device", "New virtual switch", "New speaker" or "New phone": adds one (see newUnplacedDevice) and selects it. */
  onNew(kind: NewKind): void;
}

/** Equipment step with nothing selected: the devices not on the plan (a row selects its device) and "New device". */
export function renderUnplacedDevices(o: UnplacedListOpts): TemplateResult {
  const list = unplacedDevices(o.level);
  return html`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${t('devices.unplaced')}</h4>
      <span class="uacts">
        <button class="btn" data-action="new-device" @click=${() => o.onNew('equipment')}>${t('devices.new')}</button>
        <button class="btn" data-action="new-virtual-switch" @click=${() => o.onNew('virtual_switch')}>${t('devices.newVirtual')}</button>
        <button class="btn" data-action="new-speaker" @click=${() => o.onNew('speaker')}>${t('devices.newSpeaker')}</button>
        <button class="btn" data-action="new-phone" @click=${() => o.onNew('phone')}>${t('devices.newPhone')}</button>
      </span>
    </div>
    ${list.length === 0 ? nothing : html`<div class="pdevs">
      ${list.map(d => html`<button class="pdev" data-id=${d.id} @click=${() => o.onPick(d.id)}>
        <span class="name">${d.name}</span><span class="kind">${deviceRoleLabel(d) || t(`device.${d.props.kind}`)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
