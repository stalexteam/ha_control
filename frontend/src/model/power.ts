import { t } from '../i18n';
import { newId } from './ids';
import type { Device, Id, Level, Pt } from './types';

export type PortSide = 'top' | 'right' | 'bottom' | 'left';
export type PortName = 'IN' | 'OUT' | 'PV' | 'BAT' | 'A' | 'B';
export type PortDir = 'in' | 'out';
export interface PortPin { side: PortSide; at: number }
/** A switch entity id and whether Plan Studio may operate it. */
export interface PowerSwitch { entity: string; controllable: boolean }

interface BlockBase {
  id: Id;
  x: number;
  y: number;
  name?: string;
  portPins?: Partial<Record<PortName, PortPin>>;
}

/** Entity fields hold entity id strings. */
export type PowerBlock = BlockBase & (
  | { kind: 'grid'; power?: string; voltage?: string }
  | { kind: 'device'; deviceId: Id; inverter?: boolean }
  | { kind: 'meter'; power?: string; voltage?: string; switch?: PowerSwitch }
  | { kind: 'bus'; w: number; h: number }
  | { kind: 'battery'; power?: string; soc?: string }
  | { kind: 'pv'; power?: string }
  | { kind: 'transfer'; form: '2in1out' | '1in2out' }
  | { kind: 'remainder' }
);
export type PowerKind = PowerBlock['kind'];

export type WireEnd = { block: Id; port: PortName } | { bus: Id; at: number };
export interface PowerWire { id: Id; from: WireEnd; to: WireEnd }
export interface PowerSchema { blocks: PowerBlock[]; wires: PowerWire[] }
export interface PlanDoc { level: Level; power?: PowerSchema }
export type Position = 'A' | '0' | 'B';

export interface WireLive { power: number | null; state: 'live' | 'dead' }
export interface BlockLive {
  power?: number | null;
  voltage?: number | null;
  soc?: number | null;
  loss?: number | null;
  switch?: 'on' | 'off' | 'unknown';
  position?: Position;
  hint?: 'disagree';
  missing?: true;
}
export interface PowerFrame { wires: Record<Id, WireLive>; blocks: Record<Id, BlockLive> }

export type WireError =
  | 'missing' | 'same-block' | 'direction' | 'port-taken' | 'dc-mismatch' | 'second-remainder' | 'loop';

const KINDS: PowerKind[] = ['grid', 'device', 'meter', 'bus', 'battery', 'pv', 'transfer', 'remainder'];
const PORT_NAMES: PortName[] = ['IN', 'OUT', 'PV', 'BAT', 'A', 'B'];
const LOOP_TRANSFER_CAP = 10;

export function blockPorts(b: PowerBlock): { name: PortName; dir: PortDir }[] {
  const p = (name: PortName, dir: PortDir) => ({ name, dir });
  switch (b.kind) {
    case 'grid': return [p('OUT', 'out')];
    case 'device': return b.inverter
      ? [p('IN', 'in'), p('OUT', 'out'), p('PV', 'in'), p('BAT', 'out')]
      : [p('IN', 'in'), p('OUT', 'out')];
    case 'meter': return [p('IN', 'in'), p('OUT', 'out')];
    case 'battery': return [p('BAT', 'in')];
    case 'pv': return [p('OUT', 'out')];
    case 'remainder': return [p('IN', 'in')];
    case 'transfer':
      if (b.form === '2in1out') return [p('A', 'in'), p('B', 'in'), p('OUT', 'out')];
      if (b.form === '1in2out') return [p('IN', 'in'), p('A', 'out'), p('B', 'out')];
      return [];
    default: return [];
  }
}

export function defaultPower(): PowerSchema {
  return { blocks: [{ id: newId(), kind: 'grid', x: 0, y: 0 }], wires: [] };
}

export function newBlock(kind: Exclude<PowerKind, 'grid'>, at: Pt, s: PowerSchema, deviceId?: Id): PowerBlock {
  const base = { id: newId(), x: at.x, y: at.y };
  const named = { ...base, name: `${t(`power.kind.${kind}`)} ${1 + s.blocks.filter((b) => b.kind === kind).length}` };
  switch (kind) {
    case 'device': return { ...base, kind, deviceId: deviceId ?? '' };
    case 'bus': return { ...named, kind, w: 240, h: 12 };
    case 'transfer': return { ...named, kind, form: '2in1out' };
    default: return { ...named, kind };
  }
}

export function addBlock(s: PowerSchema, b: PowerBlock): PowerSchema {
  return { ...s, blocks: [...s.blocks, b] };
}

function mapBlock(s: PowerSchema, id: Id, f: (b: PowerBlock) => PowerBlock): PowerSchema {
  if (!s.blocks.some((b) => b.id === id)) return s;
  return { ...s, blocks: s.blocks.map((b) => (b.id === id ? f(b) : b)) };
}

export function moveBlock(s: PowerSchema, id: Id, x: number, y: number): PowerSchema {
  return mapBlock(s, id, (b) => ({ ...b, x, y }));
}

const endId = (e: WireEnd) => ('block' in e ? e.block : e.bus);
const touches = (w: PowerWire, id: Id) => endId(w.from) === id || endId(w.to) === id;

/** A transfer form change drops all its wires; any other patch drops wires on ports the block no longer has. */
export function updateBlock(s: PowerSchema, id: Id, patch: Partial<PowerBlock>): PowerSchema {
  const old = s.blocks.find((b) => b.id === id);
  if (!old) return s;
  const next = mapBlock(s, id, (b) => ({ ...b, ...patch }) as PowerBlock);
  if (old.kind === 'transfer' && 'form' in patch && patch.form !== old.form) {
    return { ...next, wires: next.wires.filter((w) => !touches(w, id)) };
  }
  const updated = next.blocks.find((b) => b.id === id)!;
  const ports = new Set<PortName>(blockPorts(updated).map((p) => p.name));
  const stale = (e: WireEnd) => 'block' in e && e.block === id && !ports.has(e.port);
  if (!next.wires.some((w) => stale(w.from) || stale(w.to))) return next;
  return { ...next, wires: next.wires.filter((w) => !stale(w.from) && !stale(w.to)) };
}

/** The grid block cannot be deleted (the schema is returned as is). */
export function deleteBlock(s: PowerSchema, id: Id): PowerSchema {
  const b = s.blocks.find((x) => x.id === id);
  if (!b || b.kind === 'grid') return s;
  return { blocks: s.blocks.filter((x) => x.id !== id), wires: s.wires.filter((w) => !touches(w, id)) };
}

export function deleteWire(s: PowerSchema, id: Id): PowerSchema {
  return s.wires.some((w) => w.id === id) ? { ...s, wires: s.wires.filter((w) => w.id !== id) } : s;
}

export function setPin(s: PowerSchema, id: Id, port: PortName, pin: PortPin | null): PowerSchema {
  return mapBlock(s, id, (b) => {
    const pins = { ...b.portPins };
    if (pin) pins[port] = pin; else delete pins[port];
    const { portPins: _drop, ...rest } = b;
    return (Object.keys(pins).length ? { ...rest, portPins: pins } : rest) as PowerBlock;
  });
}

export function clearPins(s: PowerSchema, id: Id): PowerSchema {
  return mapBlock(s, id, (b) => {
    const { portPins: _drop, ...rest } = b;
    return rest as PowerBlock;
  });
}

type DcClass = 'ac' | 'bat' | 'pv';

function portClass(b: PowerBlock, port: PortName): DcClass {
  if (b.kind === 'battery') return 'bat';
  if (b.kind === 'pv') return 'pv';
  if (b.kind === 'device' && b.inverter) {
    if (port === 'BAT') return 'bat';
    if (port === 'PV') return 'pv';
  }
  return 'ac';
}

/** True when some assignment of the transfer switches to A or B joins the two ends of a wire already joined. */
function hasLoop(blocks: PowerBlock[], wires: PowerWire[]): boolean {
  const transfers = blocks.filter((b) => b.kind === 'transfer');
  const checked = transfers.slice(0, LOOP_TRANSFER_CAP);
  const common = new Map<Id, PortName>();
  for (const b of transfers) if (b.kind === 'transfer') common.set(b.id, b.form === '2in1out' ? 'OUT' : 'IN');
  for (let mask = 0; mask < 1 << checked.length; mask++) {
    const sel = new Map<Id, PortName>();
    checked.forEach((b, i) => sel.set(b.id, mask & (1 << i) ? 'B' : 'A'));
    const parent = new Map<string, string>();
    const find = (x: string): string => {
      let r = x;
      while (parent.has(r) && parent.get(r) !== r) r = parent.get(r)!;
      return r;
    };
    const node = (e: WireEnd, w: PowerWire): string => {
      if ('bus' in e) return `n:${e.bus}`;
      const c = common.get(e.block);
      if (c !== undefined && e.port !== c && e.port !== (sel.get(e.block) ?? 'A')) return `x:${w.id}:${e.port}`;
      return `n:${e.block}`;
    };
    for (const w of wires) {
      const a = find(node(w.from, w));
      const b = find(node(w.to, w));
      if (a === b) return true;
      parent.set(a, b);
    }
  }
  return false;
}

export function connect(
  s: PowerSchema, a: WireEnd, b: WireEnd,
): { schema: PowerSchema; wire: PowerWire } | { error: WireError } {
  const byId = new Map(s.blocks.map((x) => [x.id, x]));
  const resolve = (e: WireEnd): { bl: PowerBlock; dir: PortDir | null } | null => {
    if ('bus' in e) {
      const bl = byId.get(e.bus);
      return bl && bl.kind === 'bus' ? { bl, dir: null } : null;
    }
    const bl = byId.get(e.block);
    const port = bl ? blockPorts(bl).find((p) => p.name === e.port) : undefined;
    return bl && port ? { bl, dir: port.dir } : null;
  };
  const ra = resolve(a);
  const rb = resolve(b);
  if (!ra || !rb) return { error: 'missing' };
  if (ra.bl.id === rb.bl.id) return { error: 'same-block' };

  // orient out -> in (bus-bus keeps a -> b)
  let from = a;
  let to = b;
  if (ra.dir === null || rb.dir === null) {
    if (ra.dir === 'in' || rb.dir === 'out') { from = b; to = a; }
  } else if (ra.dir === rb.dir) {
    return { error: 'direction' };
  } else if (ra.dir === 'in') {
    from = b; to = a;
  }

  const taken = (e: WireEnd) => 'block' in e && s.wires.some((w) =>
    [w.from, w.to].some((x) => 'block' in x && x.block === e.block && x.port === e.port));
  if (taken(from) || taken(to)) return { error: 'port-taken' };

  const busClass = (busId: Id): DcClass | null => {
    for (const w of s.wires) {
      for (const [mine, other] of [[w.from, w.to], [w.to, w.from]] as const) {
        if ('bus' in mine && mine.bus === busId && 'block' in other) {
          const bl = byId.get(other.block);
          if (bl) return portClass(bl, other.port);
        }
      }
    }
    return null;
  };
  const endClass = (e: WireEnd): DcClass | null =>
    'bus' in e ? busClass(e.bus) : portClass(byId.get(e.block)!, e.port);
  const ca = endClass(from);
  const cb = endClass(to);
  if (ca !== null && cb !== null && ca !== cb) return { error: 'dc-mismatch' };

  if ('bus' in from && 'block' in to && byId.get(to.block)!.kind === 'remainder'
    && s.wires.some((w) => 'bus' in w.from && w.from.bus === from.bus
      && 'block' in w.to && byId.get(w.to.block)?.kind === 'remainder')) {
    return { error: 'second-remainder' };
  }

  const wire: PowerWire = { id: newId(), from, to };
  const wires = [...s.wires, wire];
  if (hasLoop(s.blocks, wires)) return { error: 'loop' };
  return { schema: { ...s, wires }, wire };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const fin = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** Drops malformed blocks and wires; the same object comes back when nothing changed. */
export function normalizePower(raw: unknown): PowerSchema | undefined {
  if (!isObj(raw)) return undefined;
  const rawBlocks = Array.isArray(raw.blocks) ? raw.blocks : [];
  const rawWires = Array.isArray(raw.wires) ? raw.wires : [];
  let changed = !Array.isArray(raw.blocks) || !Array.isArray(raw.wires);

  const blocks: PowerBlock[] = [];
  for (const b of rawBlocks) {
    if (isObj(b) && typeof b.id === 'string' && b.id && KINDS.includes(b.kind as PowerKind) && fin(b.x) && fin(b.y)) {
      blocks.push(b as unknown as PowerBlock);
    } else changed = true;
  }
  const byId = new Map(blocks.map((b) => [b.id, b]));

  const fixEnd = (e: unknown): WireEnd | null => {
    if (!isObj(e)) return null;
    if (typeof e.bus === 'string') {
      if (byId.get(e.bus)?.kind !== 'bus' || !fin(e.at)) return null;
      const at = Math.min(1, Math.max(0, e.at));
      return at === e.at ? (e as unknown as WireEnd) : { bus: e.bus, at };
    }
    if (typeof e.block === 'string' && PORT_NAMES.includes(e.port as PortName) && byId.has(e.block)) {
      return e as unknown as WireEnd;
    }
    return null;
  };
  const wires: PowerWire[] = [];
  for (const w of rawWires) {
    const from = isObj(w) ? fixEnd(w.from) : null;
    const to = isObj(w) ? fixEnd(w.to) : null;
    if (!isObj(w) || typeof w.id !== 'string' || !w.id || !from || !to) { changed = true; continue; }
    if (from === w.from && to === w.to) wires.push(w as unknown as PowerWire);
    else { changed = true; wires.push({ ...(w as unknown as PowerWire), from, to }); }
  }
  return changed ? ({ ...raw, blocks, wires } as unknown as PowerSchema) : (raw as unknown as PowerSchema);
}

/**
 * Plan devices the Plan device tool can place, by name: sockets, equipment and devices with a power or control
 * binding that are not in the schematic yet.
 */
export function placeableDevices(level: Level, power: PowerSchema): Device[] {
  const placed = new Set(power.blocks.flatMap(b => (b.kind === 'device' ? [b.deviceId] : [])));
  return level.devices
    .filter(d => !placed.has(d.id) && (d.props.kind === 'socket' || d.props.kind === 'equipment'
      || !!d.bindings?.power || !!d.bindings?.control))
    .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
}

/** The grid has a power entity and at least one wire exists. */
export function stepDone(s: PowerSchema): boolean {
  const grid = s.blocks.find((b) => b.kind === 'grid');
  return !!grid && grid.kind === 'grid' && !!grid.power && s.wires.length > 0;
}
