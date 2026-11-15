import { html, nothing, type TemplateResult } from 'lit';
import { fieldValue } from './field-value';
import type { Device, DeviceKind, DevicePlacement, DeviceProps, Level, Side } from '../model/types';
import { AIM_KINDS, DEVICE_PLACEMENTS, FAN_DIAMETERS, deviceDefaults, type FanDiameter } from '../model/types';
import { AIM_MAX, deleteDevice, moveDevice, setDeviceProps } from '../model/devices';
import type { Selection } from '../editor/tools/types';
import { deviceRoomId, withAim } from '../geometry/devices';
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
  /** The level of the selected device (its rooms are listed for a climate sensor). */
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
        ${row(t('props.shape'), select(p.shape, labelled(['round', 'linear', 'spot'], 'shape'), v => set({ shape: v }), `${pre}shape`))}
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
    case 'climate_sensor':
      return pre === '' && o.device && o.level ? zoneFields(o.level, o.device, p.zoneIds, set) : nothing_();
    case 'equipment':
      return html`
        ${row(t('props.shape'), select(p.shape, labelled(['rect', 'circle'], 'shape'), v => set({ shape: v }), `${pre}shape`))}
        ${p.shape === 'rect'
          ? html`${mm('width', 'props.width', p.width)}${mm('depth', 'props.depth', p.depth)}`
          : mm('diameter', 'props.diameter', p.diameter)}
        ${row(t('props.symbol'), select(p.symbol, labelled(['boiler', 'pc', 'automation', 'other'], 'symbol'),
          v => set({ symbol: v }), `${pre}symbol`))}
        ${row(t('props.label'), html`<input class="val wide" type="text" data-field=${`${pre}label`} .value=${fieldValue(p.label)}
          @change=${(e: Event) => {
            const label = (e.target as HTMLInputElement).value.trim();
            if (label !== p.label) set({ label });
          }} />`)}`;
    default:
      return html`<p class="muted">${t('props.noSettings')}</p>`;
  }
}

const nothing_ = (): TemplateResult => html`${nothing}`;

/** All rooms of the level as checkboxes; with none checked the derived ("auto") room is named. */
function zoneFields(level: Level, d: Device, ids: string[], set: (patch: Partial<DeviceProps>) => boolean): TemplateResult {
  const auto = ids.length === 0 ? level.zones.find(z => z.id === deviceRoomId(level, d))?.name : undefined;
  return html`<fieldset class="zones" data-field="zoneIds"><legend>${t('props.zones')}${ids.length === 0
      ? html` (${t('props.zonesAuto')}${auto ? `: ${auto}` : ''})` : nothing}</legend>
    ${level.zones.map(z => html`<label class="row"><input type="checkbox" data-zone=${z.id} .checked=${ids.includes(z.id)}
      @change=${(e: Event) => {
        const on = (e.target as HTMLInputElement).checked;
        const next = level.zones.map(x => x.id).filter(id => (id === z.id ? on : ids.includes(id)));
        if (!set({ zoneIds: next })) (e.target as HTMLInputElement).checked = !on;
      }} /><span>${z.name}</span></label>`)}
  </fieldset>`;
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

function deviceProps(o: DevicePropsOpts, d: Device): TemplateResult {
  return html`
    <h4>${t(`device.${d.props.kind}`)}</h4>
    ${row(t('props.name'), html`<input class="val wide" type="text" data-field="name" .value=${fieldValue(d.name)}
      @change=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        const name = el.value.trim();
        if (!name) { el.value = d.name; return; }
        if (name !== d.name) o.onDevice({}, name);
      }} />`)}
    ${kindFields(o, d.props, '', patch => o.onDevice(patch))}
    ${placementFields(o, d)}
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
      onPlacement: p => !!device && edit(moveDevice(level, device.id, p)),
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
