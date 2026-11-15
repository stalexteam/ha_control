import type { RoleSpec } from '../model/bindings';
import type { EntityMeta, HaMeta } from './ha-meta';

function matches(e: EntityMeta, spec: RoleSpec): boolean {
  if (!spec.domains.includes(e.domain)) return false;
  if (spec.plainDomains?.includes(e.domain)) return e.deviceClass === null && e.unit === null;
  if (!spec.deviceClasses) return true;
  if (e.deviceClass !== null) return spec.deviceClasses.includes(e.deviceClass);
  return e.unit !== null && !!spec.units?.includes(e.unit);
}

const cache = new WeakMap<HaMeta, WeakMap<RoleSpec, [readonly EntityMeta[] | null, readonly EntityMeta[] | null]>>();

/** Strict: domain and class/unit rules, no hidden, disabled or categorised entries (except the spec's categories). showAll: domain filter only. Sorted by name, then id. */
export function candidates(meta: HaMeta, spec: RoleSpec, showAll: boolean): readonly EntityMeta[] {
  let bySpec = cache.get(meta);
  if (!bySpec) cache.set(meta, (bySpec = new WeakMap()));
  let slot = bySpec.get(spec);
  if (!slot) bySpec.set(spec, (slot = [null, null]));
  const i = showAll ? 1 : 0;
  if (slot[i]) return slot[i];
  const list = [...meta.entities.values()].filter(e =>
    showAll ? spec.domains.includes(e.domain)
      : matches(e, spec) && !e.hidden && !e.disabled && (e.category === null || !!spec.categories?.includes(e.category)));
  list.sort((a, b) => a.name.localeCompare(b.name) || a.entityId.localeCompare(b.entityId));
  slot[i] = list;
  return list;
}

/** context is "Area ▸ Device" (area from the entity, else from the device); the entity id when neither exists. */
export function entityLabel(meta: HaMeta, eid: string): { name: string; context: string } {
  const e = meta.entities.get(eid);
  const dev = e?.deviceId ? meta.devices.get(e.deviceId) : undefined;
  const areaId = e?.areaId ?? dev?.areaId ?? null;
  const parts = [areaId ? meta.areas.get(areaId) : undefined, dev?.name].filter((p): p is string => !!p);
  return { name: e?.name ?? eid, context: parts.join(' ▸ ') || eid };
}
