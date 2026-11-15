import type { BindingRole, DeviceKind, Id, Level } from '../model/types';
import { ROLE_SPECS, setBinding, type RoleSpec } from '../model/bindings';
import type { DeviceMeta, EntityMeta, HaMeta } from './ha-meta';

function matches(e: EntityMeta, spec: RoleSpec): boolean {
  if (!spec.domains.includes(e.domain)) return false;
  if (!spec.deviceClasses) return true;
  if (e.deviceClass !== null) return spec.deviceClasses.includes(e.deviceClass);
  return e.unit !== null && !!spec.units?.includes(e.unit);
}

const cache = new WeakMap<HaMeta, WeakMap<RoleSpec, [readonly EntityMeta[] | null, readonly EntityMeta[] | null]>>();

/** Strict: domain and class/unit rules, no hidden, disabled or categorised entries. showAll: domain filter only. Sorted by name, then id. */
export function candidates(meta: HaMeta, spec: RoleSpec, showAll: boolean): readonly EntityMeta[] {
  let bySpec = cache.get(meta);
  if (!bySpec) cache.set(meta, (bySpec = new WeakMap()));
  let slot = bySpec.get(spec);
  if (!slot) bySpec.set(spec, (slot = [null, null]));
  const i = showAll ? 1 : 0;
  if (slot[i]) return slot[i];
  const list = [...meta.entities.values()].filter(e =>
    showAll ? spec.domains.includes(e.domain) : matches(e, spec) && !e.hidden && !e.disabled && e.category === null);
  list.sort((a, b) => a.name.localeCompare(b.name) || a.entityId.localeCompare(b.entityId));
  slot[i] = list;
  return list;
}

const deviceCache = new WeakMap<HaMeta, Map<DeviceKind, readonly DeviceMeta[]>>();

/** HA devices with a strict candidate for any role of the kind, by name then id. Memoised per meta and kind. */
export function haDevicesFor(meta: HaMeta, kind: DeviceKind): readonly DeviceMeta[] {
  let byKind = deviceCache.get(meta);
  if (!byKind) deviceCache.set(meta, (byKind = new Map()));
  const hit = byKind.get(kind);
  if (hit) return hit;
  const ids = new Set<string>();
  for (const spec of ROLE_SPECS[kind]) for (const e of candidates(meta, spec, false)) if (e.deviceId) ids.add(e.deviceId);
  const list = [...ids].map(id => meta.devices.get(id)).filter((d): d is DeviceMeta => !!d)
    .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  byKind.set(kind, list);
  return list;
}

/** Fills empty roles from the HA device's strict candidates. One candidate fills; several are ambiguous. Filled roles are never touched. */
export function autoFill(level: Level, deviceId: Id, haDeviceId: string, meta: HaMeta): { level: Level; filled: BindingRole[]; ambiguous: BindingRole[] } {
  const d = level.devices.find(x => x.id === deviceId);
  const filled: BindingRole[] = [];
  const ambiguous: BindingRole[] = [];
  if (!d) return { level, filled, ambiguous };
  let next = level;
  for (const spec of ROLE_SPECS[d.props.kind]) {
    if (d.bindings?.[spec.role]) continue;
    const c = candidates(meta, spec, false).filter(e => e.deviceId === haDeviceId);
    if (c.length === 1) { next = setBinding(next, deviceId, spec.role, c[0].entityId); filled.push(spec.role); }
    else if (c.length > 1) ambiguous.push(spec.role);
  }
  return { level: next, filled, ambiguous };
}

/** context is "Area ▸ Device" (area from the entity, else from the device); the entity id when neither exists. */
export function entityLabel(meta: HaMeta, eid: string): { name: string; context: string } {
  const e = meta.entities.get(eid);
  const dev = e?.deviceId ? meta.devices.get(e.deviceId) : undefined;
  const areaId = e?.areaId ?? dev?.areaId ?? null;
  const parts = [areaId ? meta.areas.get(areaId) : undefined, dev?.name].filter((p): p is string => !!p);
  return { name: e?.name ?? eid, context: parts.join(' ▸ ') || eid };
}
