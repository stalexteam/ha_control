import type { HassLike } from '../api';
import type { BindingRole, Id } from '../model/types';
import type { BlockLive, PowerBlock } from '../model/power';
import { activeRoleSpecs } from '../model/bindings';
import type { GeoCtx } from '../geometry/power';
import { formatWatts, unit } from '../render/power-svg';
import { hintLines, type HintMeter } from '../render/power-hint';
import { ReadingsFeed } from '../live/readings-feed';
import { roleLabel } from './binding-props';
import { t } from '../i18n';

/** The pointer rests on a block this long before the hint opens. */
export const DWELL_MS = 500;
/** While the hint is open it re-renders this often, so the seconds keep counting between answers. */
export const TICK_MS = 1000;

/** A meter of a block: the entity it reads, its label and its value as the block shows it (a dash without a live value). */
export interface BlockMeter { entity: string; label: string; value: string }

/**
 * The entities a block reads, under the labels of its properties panel: a grid its power and voltage, a battery its
 * power and SOC, a PV field its power, a device the Power / Voltage / Input power / Output power bindings its kind has.
 * Bus, transfer and remainder read none. A device that is gone has none.
 */
export function blockMeters(b: PowerBlock, g: GeoCtx, live: BlockLive | undefined): BlockMeter[] {
  const out: BlockMeter[] = [];
  const add = (entity: string | undefined, label: string, value: string) => { if (entity) out.push({ entity, label, value }); };
  switch (b.kind) {
    case 'grid':
      add(b.power, t('power.field.power'), formatWatts(live?.power));
      add(b.voltage, t('power.field.voltage'), unit(live?.voltage, 'V'));
      break;
    case 'battery':
      add(b.power, t('power.field.batteryPower'), formatWatts(live?.power));
      add(b.soc, t('power.field.soc'), unit(live?.soc, '%'));
      break;
    case 'pv':
      add(b.power, t('power.field.power'), formatWatts(live?.power));
      break;
    case 'device': {
      const d = g.device(b.deviceId);
      if (!d) break;
      const roles = new Set(activeRoleSpecs(d).map(s => s.role));
      const text: Partial<Record<BindingRole, string>> = {
        power: formatWatts(live?.power), power_in: formatWatts(live?.power_in), power_out: formatWatts(live?.power_out),
        voltage: unit(live?.voltage, 'V'),
      };
      for (const role of ['power', 'power_in', 'power_out', 'voltage'] as const) {
        if (roles.has(role)) add(d.bindings?.[role], roleLabel(d, role), text[role] ?? '—');
      }
      break;
    }
    default:
      break;
  }
  return out;
}

/**
 * The hover hint of the Power step: the pointer rests on a block for DWELL_MS, then `openId` is that block until the
 * pointer leaves, a gesture starts or the block / step goes (`hide`, `sync`). While open it asks the server for the
 * report statistics of the block's meters (ReadingsFeed) and re-renders every TICK_MS; closed, it holds no timer and
 * asks nothing.
 */
export class PowerHint {
  /** The block the hint is open for; null when closed. */
  openId: Id | null = null;
  private candidate: Id | null = null;
  private dwell: ReturnType<typeof setTimeout> | null = null;
  private tick: ReturnType<typeof setInterval> | null = null;
  private readonly feed: ReadingsFeed;

  /** `meters(id)`: the block's meters now (empty when the block is gone or reads nothing). */
  constructor(
    private readonly host: { requestUpdate(): void },
    connection: () => HassLike['connection'] | undefined,
    private readonly meters: (id: Id) => BlockMeter[],
  ) {
    this.feed = new ReadingsFeed(host, connection);
  }

  /** How many meters block `id` has now (0: no hint for it). */
  meterCount(id: Id): number { return this.meters(id).length; }

  /** The pointer is over block `id` (null: over nothing, or a block without meters): starts, keeps or drops the dwell. */
  move(id: Id | null): void {
    if (id === (this.openId ?? this.candidate)) return;
    this.hide();
    if (id === null) return;
    this.candidate = id;
    this.dwell = setTimeout(() => { this.dwell = null; this.candidate = null; this.show(id); }, DWELL_MS);
  }

  /** Opens at once (the dev harness); the same checks as after the dwell. */
  show(id: Id): void {
    if (this.openId === id) return;
    this.hide();
    if (this.meters(id).length === 0) return;
    this.openId = id;
    this.tick = setInterval(() => this.host.requestUpdate(), TICK_MS);
    this.sync();
    this.host.requestUpdate();
  }

  /** Closes the hint and drops the dwell, the ticker and the asking. */
  hide(): void {
    if (this.dwell !== null) clearTimeout(this.dwell);
    this.dwell = null;
    this.candidate = null;
    if (this.tick !== null) clearInterval(this.tick);
    this.tick = null;
    this.feed.stop();
    if (this.openId !== null) { this.openId = null; this.host.requestUpdate(); }
  }

  /** While open: closes when the block no longer has meters (deleted, unbound), else follows its entities. Called on every update. */
  sync(): void {
    if (this.openId === null) return;
    const ms = this.meters(this.openId);
    if (ms.length === 0) { this.hide(); return; }
    this.feed.watch(ms.map(m => m.entity));
  }

  /** The hint's text lines at `now`, or null while closed. */
  lines(now: number): string[] | null {
    if (this.openId === null) return null;
    const stats = this.feed.stats;
    const meters: HintMeter[] = this.meters(this.openId).map(m => ({ label: m.label, value: m.value, ...(stats?.[m.entity] ? { stats: stats[m.entity] } : {}) }));
    return meters.length ? hintLines(meters, now) : null;
  }
}
