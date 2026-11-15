import { addUnplacedDevice, setDeviceControllable, setDeviceInverter } from './devices';
import { setBinding } from './bindings';
import type { PlanDoc, PowerSchema } from './power';
import type { Device, Id, Level } from './types';

type Raw = Record<string, unknown>;
const isObj = (v: unknown): v is Raw => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);
const fin = (v: unknown): boolean => typeof v === 'number' && Number.isFinite(v);

/** An equipment device with a switch: its `control` binding. */
const hasSwitch = (d: Device): boolean => d.props.kind === 'equipment' && !!d.bindings?.control;

/**
 * The level marked as migrated (`switchesMigrated`) when it has an equipment switch, so the v0.7 rule of migrateDevices
 * never runs on it again; the same object when it is marked already or has no equipment switch. The panel applies it to
 * every plan it saves or drafts, so a read-only switch added later stays read-only.
 */
export function markSwitchesMigrated(level: Level): Level {
  return level.switchesMigrated || !level.devices.some(hasSwitch) ? level : { ...level, switchesMigrated: true };
}

/** A v0.7 meter block turned into a new device that is not on the plan, with the meter's entities. */
function convertMeter(level: Level, b: Raw, name: string): { level: Level; id: Id } {
  const made = addUnplacedDevice(level, name);
  let next = made.level;
  const sw = isObj(b.switch) ? b.switch : {};
  const roles = [['power', str(b.power)], ['voltage', str(b.voltage)], ['control', str(sw.entity)]] as const;
  for (const [role, eid] of roles) if (eid) next = setBinding(next, made.id, role, eid);
  if (sw.controllable === true) next = setDeviceControllable(next, made.id, true);
  return { level: next, id: made.id };
}

/**
 * Converts a plan opened from v0.7 data (a level and its raw power schema) to the one device model:
 * 1. A `meter` block (with an id and a finite position; a malformed one is left for normalizePower to drop) becomes a
 *    new device not on the plan (addUnplacedDevice), named after the block or "Meter N" (N counting the converted
 *    meters from 1), with the meter's power, voltage and switch entity as its `power`, `voltage` and `control`, and
 *    `controllable` when the switch was. The block becomes a device block with the same id, position, name and pins,
 *    so its wires stay attached.
 * 2. A device block's `inverter` flag is removed; when it was true and the device is equipment, the device becomes an
 *    inverter (setDeviceInverter: its `power` moves to `power_out`).
 * 3. On a level not marked `switchesMigrated`, every equipment device that had a switch and no controllable flag before
 *    this run becomes controllable (in v0.7 a plan device's switch was operable), and the level is marked (see
 *    markSwitchesMigrated). Converted meters keep their own flag.
 * Idempotent; the same object comes back when nothing changes (for example a plan without power and without an
 * equipment switch).
 */
export function migrateDevices(doc: PlanDoc): PlanDoc {
  let level = doc.level;
  let power: PowerSchema | undefined = doc.power;
  const raw: unknown = doc.power;
  if (isObj(raw) && Array.isArray(raw.blocks)) {
    let meters = 0;
    let changed = false;
    const blocks = raw.blocks.map((b: unknown) => {
      if (!isObj(b)) return b;
      if (b.kind === 'meter' && str(b.id) && fin(b.x) && fin(b.y)) {
        meters++;
        const made = convertMeter(level, b, str(b.name) ?? `Meter ${meters}`);
        level = made.level;
        changed = true;
        return {
          id: b.id, kind: 'device', deviceId: made.id, x: b.x, y: b.y,
          ...('name' in b ? { name: b.name } : {}), ...('portPins' in b ? { portPins: b.portPins } : {}),
        };
      }
      if (b.kind === 'device' && 'inverter' in b) {
        const { inverter, ...rest } = b;
        if (inverter === true && typeof b.deviceId === 'string') level = setDeviceInverter(level, b.deviceId, true);
        changed = true;
        return rest;
      }
      return b;
    });
    if (changed) power = { ...raw, blocks } as unknown as PowerSchema;
  }
  if (!level.switchesMigrated && level.devices.some(hasSwitch)) {
    for (const d of doc.level.devices) if (hasSwitch(d)) level = setDeviceControllable(level, d.id, true);
    level = markSwitchesMigrated(level);
  }
  if (level === doc.level && power === doc.power) return doc;
  return { ...doc, level, ...(power ? { power } : {}) };
}
