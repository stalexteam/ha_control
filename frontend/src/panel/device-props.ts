import { html, nothing, type TemplateResult } from 'lit';
import { fieldValue } from './field-value';
import type { ContainerKind, Device, DeviceKind, DevicePlacement, DeviceProps, Level, Side } from '../model/types';
import { AIM_KINDS, AIM_MAX, DEVICE_PLACEMENTS, FAN_DIAMETERS, deviceDefaults, isContainerKind, type FanDiameter } from '../model/types';
import { changeDeviceKind, deleteDevice, moveDevice, setDeviceProps } from '../model/devices';
import type { Selection } from '../editor/tools/types';
import { withAim } from '../geometry/devices';
import { deviceZones } from '../geometry/zones';
import { setZoneParticipation } from '../model/automation-zones';
import { t } from '../i18n';
import { numField, row, select } from './fields';
import type { WholeRule } from '../geometry/parse';
import type { ToolId } from './tool-factory';

const DEVICE_KINDS = Object.keys(DEVICE_PLACEMENTS) as DeviceKind[];
const isDeviceKind = (id: ToolId): id is DeviceKind => (DEVICE_KINDS as string[]).includes(id);

/** Initial "next device" props of every kind: the free-mode defaults. */
export function initialNextProps(): Record<DeviceKind, DeviceProps> {
  return Object.fromEntries(DEVICE_KINDS.map(k => [k, deviceDefaults(k, 'free')])) as Record<DeviceKind, DeviceProps>;
}

export interface DevicePropsOpts {
  /** Selected device, or null. */
  device: Device | null;
  /** The level of the selected device. */
  level?: Level;
  /** Kind of the active placement tool (shown when nothing is selected), or null. */
  nextKind: DeviceKind | null;
  /** The panel's defaults for the next device of `nextKind`. */
  nextProps: DeviceProps | null;
  /** Returns false when the edit was rejected (nothing changed). */
  onDevice(patch: Partial<DeviceProps>, name?: string): boolean;
  /** Returns false when the placement was rejected (e.g. the offset is outside the wall). */
  onPlacement(p: DevicePlacement): boolean;
  onNext(patch: Partial<DeviceProps>): void;
  /** Turns the selected input container into the other kind (returns false when refused). */
  onKind?(kind: ContainerKind): boolean;
  /** Sets whether the device takes part in an automation zone (returns false when refused). */
  onZone?(zoneId: string, participates: boolean): boolean;
  onDelete(): void;
  /** Validation message for a rejected field (null clears it). */
  onNotice?(msg: string | null): void;
}

type NumRule = 'mm' | 'angle' | 'rotation' | 'offset' | 'aim';

/** Integer by rule: mm > 0, angle 1..360, rotation 0..359, offset >= 0, aim -90..90 (with the message for a bad value). */
const NUM: Record<NumRule, { rule: WholeRule; bad: string }> = {
  mm: { rule: { min: 1 }, bad: 'props.badNumber' },
  angle: { rule: { min: 1, max: 360 }, bad: 'props.badAngle' },
  rotation: { rule: { min: 0, max: 359 }, bad: 'props.badRotation' },
  offset: { rule: { min: 0 }, bad: 'props.badOffset' },
  aim: { rule: { min: -AIM_MAX, max: AIM_MAX, signed: true }, bad: 'props.badAim' },
};

const numProp = (o: DevicePropsOpts, field: string, value: number, rule: NumRule, apply: (v: number) => boolean) =>
  numField({ ...NUM[rule], value, field, setNotice: o.onNotice, apply, skipSame: true });

/** Option sets rendered through `labelled` (each member needs a `shape.*` dictionary key). */
export const LIGHT_SHAPES = ['round', 'linear', 'spot'] as const;
export const EQUIPMENT_SHAPES = ['rect', 'circle'] as const;

const labelled = <T extends string>(values: T[], prefix: string) => values.map(v => ({ v, label: t(`${prefix}.${v}`) }));

/** Kind-specific fields; `pre` prefixes data-field names ("next-" for the next-device defaults). */
function kindFields(o: DevicePropsOpts, p: DeviceProps, pre: string, set: (patch: Partial<DeviceProps>) => boolean): TemplateResult {
  const mm = (name: string, label: string, v: number) =>
    row(`${t(label)}, ${t('unit.mm')}`, numProp(o, pre + name, v, 'mm', x => set({ [name]: x } as Partial<DeviceProps>)));
  const deg = (name: string, label: string, v: number) =>
    row(`${t(label)}, ${t('unit.deg')}`, numProp(o, pre + name, v, 'angle', x => set({ [name]: x } as Partial<DeviceProps>)));
  switch (p.kind) {
    case 'ceiling_light': {
      return html`
        ${row(t('props.shape'), select(p.shape, labelled([...LIGHT_SHAPES], 'shape'), v => set({ shape: v }), `${pre}shape`))}
        ${p.shape === 'linear'
          ? html`${mm('length', 'props.length', p.length)}${mm('width', 'props.width', p.width)}`
          : mm('diameter', 'props.diameter', p.diameter)}
        ${row(`${t('props.poolRadius')}, ${t('unit.mm')}`, numField({
          ...NUM.mm, value: p.poolRadius, field: `${pre}poolRadius`, placeholder: t('props.poolHint'), setNotice: o.onNotice,
          skipSame: true, apply: v => set({ poolRadius: v }), onBlank: () => set({ poolRadius: null }),
        }))}`;
    }
    case 'wall_light':
      return html`${deg('coneAngle', 'props.coneAngle', p.coneAngle)}${mm('coneRange', 'props.coneRange', p.coneRange)}`;
    case 'motion_sensor':
      return html`${deg('zoneAngle', 'props.zoneAngle', p.zoneAngle)}${mm('zoneRange', 'props.zoneRange', p.zoneRange)}`;
    case 'exhaust_fan':
      return row(`${t('props.diameter')}, ${t('unit.mm')}`, html`<select class="val" data-field=${`${pre}diameter`}
        .value=${fieldValue(String(p.diameter))} @change=${(e: Event) => {
          const el = e.target as HTMLSelectElement;
          const v = Number(el.value) as FanDiameter;
          if (v !== p.diameter && !set({ diameter: v })) el.value = String(p.diameter);
        }}>
        ${FAN_DIAMETERS.map(v => html`<option value=${String(v)} ?selected=${v === p.diameter}>${v}</option>`)}
      </select>`);
    case 'equipment':
      return html`
        ${row(t('props.shape'), select(p.shape, labelled([...EQUIPMENT_SHAPES], 'shape'), v => set({ shape: v }), `${pre}shape`))}
        ${p.shape === 'rect'
          ? html`${mm('width', 'props.width', p.width)}${mm('depth', 'props.depth', p.depth)}`
          : mm('diameter', 'props.diameter', p.diameter)}
        ${row(t('props.icon'), iconField(o, p.icon, `${pre}icon`, set))}
        ${row(t('props.label'), html`<input class="val wide" type="text" data-field=${`${pre}label`} .value=${fieldValue(p.label)}
          @change=${(e: Event) => {
            const label = (e.target as HTMLInputElement).value.trim();
            if (label !== p.label) set({ label });
          }} />`)}`;
    default:
      return html`<p class="muted">${t('props.noSettings')}</p>`;
  }
}

const MDI_ICON = /^mdi:[a-z0-9-]+$/;

/** HA's icon picker when registered, otherwise a text input accepting only `mdi:<name>`. */
function iconField(o: DevicePropsOpts, value: string, field: string, set: (patch: Partial<DeviceProps>) => boolean): TemplateResult {
  const commit = (v: string, revert: (s: string) => void): void => {
    if (!MDI_ICON.test(v)) { revert(value); o.onNotice?.(t('props.badIcon')); return; }
    o.onNotice?.(null);
    if (v !== value && !set({ icon: v })) revert(value);
  };
  if (customElements.get('ha-icon-picker')) {
    return html`<ha-icon-picker data-field=${field} .value=${fieldValue(value)} @value-changed=${(e: CustomEvent<{ value?: string }>) => {
      const el = e.target as HTMLElement & { value: string };
      commit(String(e.detail?.value ?? '').trim(), s => { el.value = s; });
    }}></ha-icon-picker>`;
  }
  return html`<input class="val wide" type="text" data-field=${field} .value=${fieldValue(value)}
    @change=${(e: Event) => {
      const el = e.target as HTMLInputElement;
      commit(el.value.trim(), s => { el.value = s; });
    }} />`;
}

function placementFields(o: DevicePropsOpts, d: Device): TemplateResult {
  const pl = d.placement;
  if (pl.mode === 'free') {
    return row(`${t('props.rotation')}, ${t('unit.deg')}`,
      numProp(o, 'rotation', pl.rotation, 'rotation', v => o.onPlacement({ ...pl, rotation: v })));
  }
  const aims = AIM_KINDS.has(d.props.kind);
  return html`
    ${row(t('props.side'), select<Side>(pl.side, labelled<Side>(['left', 'right'], 'side'), v => o.onPlacement({ ...pl, side: v }), 'side'))}
    ${row(`${t('props.offset')}, ${t('unit.mm')}`, numProp(o, 'offset', pl.offset, 'offset',
      v => o.onPlacement({ ...pl, offset: v })))}
    ${aims ? row(`${t('props.aim')}, ${t('unit.deg')}`,
      numProp(o, 'aim', pl.aim ?? 0, 'aim', v => o.onPlacement(withAim(pl, v)))) : nothing}`;
}

/** The device's name field (Equipment and Binding steps): trimmed; a blank name reverts; calls onName only on a change. */
export function deviceNameRow(d: Device, onName: (name: string) => void): TemplateResult {
  return row(t('props.name'), html`<input class="val wide" type="text" data-field="name" .value=${fieldValue(d.name)}
    @change=${(e: Event) => {
      const el = e.target as HTMLInputElement;
      const name = el.value.trim();
      if (!name) { el.value = d.name; return; }
      if (name !== d.name) onName(name);
    }} />`);
}

/** Container type select; a free smart button cannot change type, so it gets a hint instead. */
function typeRow(o: DevicePropsOpts, d: Device): TemplateResult | typeof nothing {
  const kind = d.props.kind;
  if (!isContainerKind(kind)) return nothing;
  if (kind === 'smart_button' && d.placement.mode === 'free') {
    return html`<p class="muted" data-note="type-free">${t('props.typeFreeHint')}</p>`;
  }
  return row(t('props.type'), select<ContainerKind>(kind, labelled<ContainerKind>(['wall_switch', 'smart_button'], 'device'),
    v => o.onKind?.(v), 'kind'));
}

/** The automation zones containing the device, each with a participation checkbox. */
function zoneList(o: DevicePropsOpts, d: Device): TemplateResult {
  const zones = o.level ? deviceZones(o.level, d) : [];
  return html`<fieldset data-field="zone-membership"><legend>${t('props.zoneList')}</legend>
    ${zones.length === 0 ? html`<p class="muted">${t('props.noZones')}</p>` : zones.map(({ zone, participates }) =>
      html`<label class="row"><span>${zone.name}</span><input type="checkbox" data-zone=${zone.id} .checked=${participates}
        @change=${(e: Event) => {
          const el = e.target as HTMLInputElement;
          if (!o.onZone?.(zone.id, el.checked)) el.checked = participates;
        }} /></label>`)}
  </fieldset>`;
}

function deviceProps(o: DevicePropsOpts, d: Device): TemplateResult {
  return html`
    <h4>${t(`device.${d.props.kind}`)}</h4>
    ${deviceNameRow(d, name => o.onDevice({}, name))}
    ${typeRow(o, d)}
    ${kindFields(o, d.props, '', patch => o.onDevice(patch))}
    ${placementFields(o, d)}
    ${zoneList(o, d)}
    ${d.invalid ? html`<p class="warn">${t('props.invalidDevice')}</p>` : nothing}
    <button class="btn danger" data-action="delete-device" @click=${() => o.onDelete()}>${t('action.delete')}</button>`;
}

/** Right panel of the Equipment tab: the selected device, or the defaults of the next device to place. */
export function renderDeviceProps(o: DevicePropsOpts): TemplateResult {
  if (o.device) return deviceProps(o, o.device);
  if (o.nextKind && o.nextProps) {
    return html`
      <h4>${t('props.nextDevice')}: ${t(`device.${o.nextKind}`)}</h4>
      ${kindFields(o, o.nextProps, 'next-', patch => { o.onNext(patch); return true; })}`;
  }
  return html`<p class="muted">${t('props.none')}</p>`;
}

export interface EquipmentPropsOpts {
  level: Level;
  selection: Selection | null;
  toolId: ToolId;
  nextProps: Record<DeviceKind, DeviceProps>;
  notice: string | null;
  commit(next: Level): void;
  /** Commits a level in which the selected device was deleted. */
  setNextProps(next: Record<DeviceKind, DeviceProps>): void;
  setNotice(msg: string | null): void;
}

/** The whole right panel of the Equipment tab, wired to the level and the panel's next-device state. */
export function renderEquipmentProps(o: EquipmentPropsOpts): TemplateResult {
  const { level, selection: s } = o;
  const device = s?.kind === 'device' ? level.devices.find(d => d.id === s.id) ?? null : null;
  const nextKind = isDeviceKind(o.toolId) ? o.toolId : null;
  /** Commits `next`; a rejected edit (same level back) keeps the level and shows "does not fit". */
  const edit = (next: Level): boolean => {
    if (next === level) { o.setNotice(t('props.noFit')); return false; }
    o.setNotice(null);
    o.commit(next);
    return true;
  };
  return html`<div class="props">
    ${renderDeviceProps({
      device, level, nextKind, nextProps: nextKind ? o.nextProps[nextKind] : null,
      onDevice: (patch, name) => !!device && edit(setDeviceProps(level, device.id, patch, name)),
      onKind: kind => !!device && edit(changeDeviceKind(level, device.id, kind)),
      onPlacement: p => !!device && edit(moveDevice(level, device.id, p)),
      onZone: (zoneId, on) => !!device && edit(setZoneParticipation(level, device.id, zoneId, on)),
      onNext: patch => {
        if (!nextKind) return;
        o.setNextProps({ ...o.nextProps, [nextKind]: { ...o.nextProps[nextKind], ...patch, kind: nextKind } as DeviceProps });
      },
      onDelete: () => { if (device) o.commit(deleteDevice(level, device.id)); },
      onNotice: msg => o.setNotice(msg),
    })}
    ${o.notice ? html`<p class="warn">${o.notice}</p>` : nothing}
  </div>`;
}
