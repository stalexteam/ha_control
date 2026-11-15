import type { HassLike } from '../api';
import type { Presence } from '../model/bindings';

export interface EntityMeta {
  entityId: string; domain: string; name: string; state: string; deviceClass: string | null; unit: string | null;
  deviceId: string | null; areaId: string | null; hidden: boolean; disabled: boolean; category: string | null; icon: string | null;
}
export interface DeviceMeta { id: string; name: string; model: string | null; areaId: string | null }
export interface HaMeta { entities: Map<string, EntityMeta>; devices: Map<string, DeviceMeta>; areas: Map<string, string>; registryLoaded: boolean }
export type Registries = Pick<HaMeta, 'entities' | 'devices' | 'areas'>;

interface StateObj { state?: unknown; attributes?: Record<string, unknown> }
interface RegEntity {
  entity_id: string; device_id?: string | null; area_id?: string | null; name?: string | null; original_name?: string | null;
  hidden_by?: string | null; disabled_by?: string | null; entity_category?: string | null; icon?: string | null; original_icon?: string | null;
  device_class?: string | null; original_device_class?: string | null; unit_of_measurement?: string | null;
}
interface RegDevice { id: string; name?: string | null; name_by_user?: string | null; model?: string | null; area_id?: string | null }
interface RegArea { area_id: string; name: string }

const str = (v: unknown): string | null => (typeof v === 'string' && v !== '' ? v : null);
const domainOf = (eid: string): string => eid.split('.')[0];

function fromState(eid: string, s: StateObj): EntityMeta {
  const a = s.attributes ?? {};
  return {
    entityId: eid, domain: domainOf(eid), name: str(a.friendly_name) ?? eid, state: typeof s.state === 'string' ? s.state : String(s.state ?? ''),
    deviceClass: str(a.device_class), unit: str(a.unit_of_measurement),
    deviceId: null, areaId: null, hidden: false, disabled: false, category: null, icon: str(a.icon),
  };
}

export function metaFromStates(states: Record<string, unknown> | undefined): HaMeta {
  const entities = new Map<string, EntityMeta>();
  for (const [eid, s] of Object.entries(states ?? {})) entities.set(eid, fromState(eid, (s ?? {}) as StateObj));
  return { entities, devices: new Map(), areas: new Map(), registryLoaded: false };
}

/** One websocket load of states plus the three registries. Registry-only entities get state "unavailable". */
export async function loadRegistries(hass: HassLike): Promise<Registries> {
  const send = <T>(type: string) => hass.connection.sendMessagePromise<T>({ type });
  const [states, ents, devs, areas] = await Promise.all([
    send<({ entity_id: string } & StateObj)[]>('get_states'),
    send<RegEntity[]>('config/entity_registry/list'),
    send<RegDevice[]>('config/device_registry/list'),
    send<RegArea[]>('config/area_registry/list'),
  ]);
  const byState = new Map(states.map(s => [s.entity_id, s]));
  const entities = new Map<string, EntityMeta>();
  for (const s of states) entities.set(s.entity_id, fromState(s.entity_id, s));
  for (const r of ents) {
    const live = byState.get(r.entity_id);
    const base = live ? entities.get(r.entity_id)! : { ...fromState(r.entity_id, { state: 'unavailable' }) };
    entities.set(r.entity_id, {
      ...base,
      name: str(r.name) ?? str(r.original_name) ?? base.name,
      deviceClass: base.deviceClass ?? str(r.device_class) ?? str(r.original_device_class),
      unit: base.unit ?? str(r.unit_of_measurement),
      deviceId: str(r.device_id), areaId: str(r.area_id),
      hidden: !!r.hidden_by, disabled: !!r.disabled_by, category: str(r.entity_category),
      icon: str(r.icon) ?? str(r.original_icon) ?? base.icon,
    });
  }
  return {
    entities,
    devices: new Map(devs.map(d => [d.id, { id: d.id, name: str(d.name_by_user) ?? str(d.name) ?? d.id, model: str(d.model), areaId: str(d.area_id) }])),
    areas: new Map(areas.map(a => [a.area_id, a.name])),
  };
}

/** Registry fields win; the live state of `states` is kept. */
export function mergeMeta(states: HaMeta, regs: Registries): HaMeta {
  const entities = new Map(regs.entities);
  for (const [eid, live] of states.entities) {
    const reg = regs.entities.get(eid);
    entities.set(eid, reg ? { ...reg, state: live.state } : live);
  }
  return { entities, devices: regs.devices, areas: regs.areas, registryLoaded: true };
}

export function presence(meta: HaMeta, eid: string): Presence {
  const e = meta.entities.get(eid);
  if (e) return e.state === 'unavailable' ? 'unavailable' : 'present';
  return meta.registryLoaded ? 'missing' : 'unknown';
}
