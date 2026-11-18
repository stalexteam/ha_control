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

/** A new device that is not on the plan, named "Device N" (or "Virtual switch N") with the smallest N no device of that kind has. */
export function newUnplacedDevice(level: Level, kind: 'equipment' | 'virtual_switch' = 'equipment'): { level: Level; id: Id } {
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
  /** "New device": adds one (see newUnplacedDevice) and selects it. */
  onNew(): void;
  /** "New virtual switch": the same for a virtual switch. */
  onNewVirtual(): void;
}

/** Equipment step with nothing selected: the devices not on the plan (a row selects its device) and "New device". */
export function renderUnplacedDevices(o: UnplacedListOpts): TemplateResult {
  const list = unplacedDevices(o.level);
  return html`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${t('devices.unplaced')}</h4>
      <span class="uacts">
        <button class="btn" data-action="new-device" @click=${() => o.onNew()}>${t('devices.new')}</button>
        <button class="btn" data-action="new-virtual-switch" @click=${() => o.onNewVirtual()}>${t('devices.newVirtual')}</button>
      </span>
    </div>
    ${list.length === 0 ? nothing : html`<div class="pdevs">
      ${list.map(d => html`<button class="pdev" data-id=${d.id} @click=${() => o.onPick(d.id)}>
        <span class="name">${d.name}</span><span class="kind">${deviceRoleLabel(d) || t(`device.${d.props.kind}`)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
