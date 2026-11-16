"""Power schematic evaluator and live hub: energized wires and signed wire powers from entity states. Must not import homeassistant."""

from __future__ import annotations

import logging
import math
from typing import Callable

try:
    from .containers import Lookup
except ImportError:  # pytest: module dir on sys.path
    from containers import Lookup

_LOGGER = logging.getLogger(__name__)

POSITIONS = ("A", "0", "B")

_PORTS = {
    "grid": {"OUT": "out"},
    "device": {"IN": "in", "OUT": "out"},
    "battery": {"BAT": "in"},
    "pv": {"OUT": "out"},
    "remainder": {"IN": "in"},
}
_TRANSFER = {
    "2in1out": {"A": "in", "B": "in", "OUT": "out"},
    "1in2out": {"IN": "in", "A": "out", "B": "out"},
}
_COMMON = {"2in1out": "OUT", "1in2out": "IN"}
# block entity keys read as numbers and reported on the block
_READINGS = {"grid": ("power", "voltage"), "battery": ("power", "soc"), "pv": ("power",)}
# device roles read as numbers and reported on a device block; power_in / power_out for an inverter only
_DEVICE_READINGS = ("power", "voltage")
_INVERTER_READINGS = ("power", "power_in", "power_out", "voltage")
_WATTS = {"W": 1.0, "kW": 1e3, "MW": 1e6, "mW": 1e-3}
# reading key -> unit -> factor to the base unit (W, V); any other unit reads as unknown, a soc is not converted
_UNITS = {
    "power": _WATTS,
    "power_in": _WATTS,
    "power_out": _WATTS,
    "voltage": {"V": 1.0, "kV": 1e3, "mV": 1e-3},
}
# the entity roles of a device the evaluator reads
_ROLES = ("power", "voltage", "power_in", "power_out", "control")
# reading seeds by block role, highest precedence first (the first value wins); a device is a `through` device
# (OUT wired), a `load` (OUT unwired) or an `inverter`
_SEED_ORDER = ("grid", "through", "inverter", "load", "battery", "pv")
# inverter loss terms: in + PV - OUT - BAT
_LOSS = (("IN", 1), ("PV", 1), ("OUT", -1), ("BAT", -1))

Node = tuple  # ("p", block id, port) or ("b", bus id)


def _list(v) -> list:
    return v if isinstance(v, list) else []


def _str(v) -> str | None:
    return v if isinstance(v, str) and v else None


def _kind(block: dict) -> str | None:
    return _str(block.get("kind"))


def block_ports(block: dict, devices: dict | None = None) -> dict[str, str]:
    """A block's ports; a device block has PV and BAT while its device (in `devices`) is an inverter."""
    kind = _kind(block)
    if kind == "transfer":
        form = _str(block.get("form"))
        return dict(_TRANSFER.get(form, {})) if form else {}
    ports = dict(_PORTS.get(kind, {})) if kind else {}
    if kind == "device" and _is_inverter(_bindings(block, devices)):
        ports.update(PV="in", BAT="out")
    return ports


def device_bindings(plan: dict) -> dict[str, dict[str, str]]:
    """The power roles (`_ROLES`) bound on every plan device, by device id.

    Not used by the live feed (the panel sends the bindings with the draft); kept for the automation stage. Only
    tests call it today.
    """
    out: dict[str, dict[str, str]] = {}
    for level in _list(plan.get("levels")):
        for device in _list(level.get("devices")) if isinstance(level, dict) else []:
            did = device.get("id") if isinstance(device, dict) else None
            if not isinstance(did, str):
                continue
            b = device.get("bindings")
            b = b if isinstance(b, dict) else {}
            out[did] = {r: b[r] for r in _ROLES if _str(b.get(r))}
    return out


def _blocks(schema) -> dict[str, dict]:
    blocks = schema.get("blocks") if isinstance(schema, dict) else None
    return {b["id"]: b for b in _list(blocks) if isinstance(b, dict) and isinstance(b.get("id"), str)}


def _bindings(block: dict, devices) -> dict | None:
    """A device block's payload entry (bound roles and flags); None when the device is missing."""
    did = _str(block.get("deviceId"))
    dev = devices.get(did) if did and isinstance(devices, dict) else None
    return dev if isinstance(dev, dict) else None


def _is_inverter(dev: dict | None) -> bool:
    return dev is not None and dev.get("inverter") is True


def entity_ids(schema: dict, devices: dict) -> set[str]:
    out: set[str] = set()
    for b in _blocks(schema).values():
        kind = _kind(b)
        src, keys = ((_bindings(b, devices) or {}), _ROLES) if kind == "device" else (b, _READINGS.get(kind, ()))
        out.update(e for e in (_str(src.get(k)) for k in keys) if e)
    return out


def _read(lookup: Lookup, eid: str | None, key: str) -> float | None:
    """A numeric reading of `key` (power, voltage, soc); power in W and voltage in V, None for an unknown unit."""
    st = lookup(eid) if eid else None
    if st is None:
        return None
    try:
        v = float(st[0])
    except (TypeError, ValueError):
        return None
    if not math.isfinite(v):
        return None
    attrs = st[1] if isinstance(st[1], dict) else {}
    unit = attrs.get("unit_of_measurement")
    units = _UNITS.get(key)
    if units is None or unit is None or unit == "":  # not converted, or no unit: the base unit
        return v
    factor = units.get(unit) if isinstance(unit, str) else None
    return None if factor is None else v * factor


def _switch(lookup: Lookup, eid: str) -> str:
    st = lookup(eid)
    return st[0] if st is not None and st[0] in ("on", "off") else "unknown"


def _w(v: float | None) -> float | None:
    return None if v is None else round(v, 1) + 0.0  # + 0.0 turns -0.0 into 0.0


class _UnionFind:
    def __init__(self) -> None:
        self._parent: dict[Node, Node] = {}

    def find(self, x: Node) -> Node:
        parent = self._parent
        parent.setdefault(x, x)
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(self, a: Node, b: Node) -> None:
        self._parent[self.find(a)] = self.find(b)


def _end(end, blocks: dict[str, dict], direction: str, devices) -> Node | None:
    """The node of a wire end, or None when it is not a bus point or a port of this direction."""
    if not isinstance(end, dict):
        return None
    if "bus" in end:
        bid, at = end.get("bus"), end.get("at")
        b = blocks.get(bid) if isinstance(bid, str) else None
        number = isinstance(at, (int, float)) and not isinstance(at, bool)
        ok = b is not None and _kind(b) == "bus" and number and 0 <= at <= 1
        return ("b", bid) if ok else None
    bid, port = end.get("block"), end.get("port")
    b = blocks.get(bid) if isinstance(bid, str) else None
    if b is None or not isinstance(port, str) or block_ports(b, devices).get(port) != direction:
        return None
    return ("p", bid, port)


def evaluate(schema: dict, devices: dict, lookup: Lookup, positions: dict[str, str]) -> dict:
    blocks = _blocks(schema)
    ends: dict[str, tuple[Node, Node] | None] = {}
    for w in _list(schema.get("wires") if isinstance(schema, dict) else None):
        wid = w.get("id") if isinstance(w, dict) else None
        if isinstance(wid, str):
            a, b = _end(w.get("from"), blocks, "out", devices), _end(w.get("to"), blocks, "in", devices)
            ends[wid] = (a, b) if a and b and a != b else None
    valid = {wid: e for wid, e in ends.items() if e}

    at_port: dict[Node, str] = {}  # port node -> its first wire
    feeds: dict[str, list[str]] = {}  # bus id -> wires ending on it
    taps: dict[str, list[str]] = {}  # bus id -> wires starting from it
    for wid, (a, b) in valid.items():
        for node in (a, b):
            if node[0] == "p":
                at_port.setdefault(node, wid)
        if a[0] == "b":
            taps.setdefault(a[1], []).append(wid)
        if b[0] == "b":
            feeds.setdefault(b[1], []).append(wid)

    def wire(bid: str, port: str) -> str | None:
        return at_port.get(("p", bid, port))

    # per-block state
    kinds = {bid: _kind(b) for bid, b in blocks.items()}
    switches: dict[str, str] = {}  # device control state, when its entity is set
    bindings: dict[str, dict | None] = {}
    inverters: list[str] = []
    roles: dict[str, str] = {}  # seed role: grid, battery, pv, or through / load / inverter for a device
    readings: dict[str, dict[str, float | None]] = {}
    alerts: dict[str, list[str]] = {}  # reason codes: unavailable:<entity_id>, missing-device, disagree
    forms: dict[str, str] = {}
    pos: dict[str, str] = {}
    for bid, b in blocks.items():
        kind = kinds[bid]
        src, keys = b, _READINGS.get(kind, ())
        if kind in _READINGS:
            roles[bid] = kind
        elif kind == "device":
            bindings[bid] = _bindings(b, devices)
            src = bindings[bid] or {}
            control = _str(src.get("control"))
            if control:
                switches[bid] = _switch(lookup, control)
            if _is_inverter(bindings[bid]):
                inverters.append(bid)
                roles[bid], keys = "inverter", _INVERTER_READINGS
            else:
                roles[bid], keys = ("through" if wire(bid, "OUT") is not None else "load"), _DEVICE_READINGS
        elif kind == "transfer":
            p = positions.get(bid) if isinstance(positions, dict) else None
            pos[bid] = p if p in POSITIONS else "A"
            form = _str(b.get("form"))
            if form in _COMMON:
                forms[bid] = form
        readings[bid] = {k: _read(lookup, _str(src.get(k)), k) for k in keys if _str(src.get(k))}
        # alert codes: a bound entity without a usable value (a switch included), a missing device
        bad = [_str(src.get(k)) for k, v in readings[bid].items() if v is None]
        if switches.get(bid) == "unknown":
            bad.append(_str(src.get("control")))
        alerts[bid] = [f"unavailable:{e}" for e in dict.fromkeys(bad)]
        if kind == "device" and bindings[bid] is None:
            alerts[bid].append("missing-device")

    # energized: wires plus closed block internals; `plain` has wires only
    uf, plain = _UnionFind(), _UnionFind()
    for a, b in valid.values():
        uf.union(a, b)
        plain.union(a, b)
    sources: list[Node] = []
    storage: set[Node] = set()
    for bid, kind in kinds.items():
        on = switches.get(bid) != "off"
        if kind == "grid":
            sources.append(("p", bid, "OUT"))
        elif kind == "device" and on:
            ports = ("IN", "OUT", "PV", "BAT") if bid in inverters else ("IN", "OUT")
            for port in ports[1:]:
                uf.union(("p", bid, ports[0]), ("p", bid, port))
        elif bid in forms and pos[bid] != "0":
            uf.union(("p", bid, pos[bid]), ("p", bid, _COMMON[forms[bid]]))
        elif kind == "battery":
            storage.add(plain.find(("p", bid, "BAT")))
        elif kind == "pv":
            storage.add(plain.find(("p", bid, "OUT")))
    for bid in inverters:
        fed = any(plain.find(("p", bid, port)) in storage for port in ("BAT", "PV"))
        if fed and switches.get(bid) != "off":
            sources.append(("p", bid, "OUT"))
    live_roots = {uf.find(s) for s in sources}
    live = {wid for wid, (a, _) in valid.items() if uf.find(a) in live_roots}

    # values: signed, positive from -> to; the first seed wins
    known: dict[str, float] = {}

    def seed(wid: str | None, v: float | None) -> None:
        if wid is not None and v is not None and wid not in known:
            known[wid] = v

    for wid in valid:
        if wid not in live:
            seed(wid, 0.0)
    for bid, form in forms.items():
        common = _COMMON[form]
        zero = ("A", "B", common) if pos[bid] == "0" else ("B" if pos[bid] == "A" else "A",)
        for port in zero:
            seed(wire(bid, port), 0.0)
    # precedence by role, never by the order of the block list
    for bid, role in sorted(roles.items(), key=lambda kv: _SEED_ORDER.index(kv[1])):
        r = readings[bid]
        if role in ("grid", "pv"):
            seed(wire(bid, "OUT"), r.get("power"))
        elif role == "through":
            seed(wire(bid, "IN"), r.get("power"))
            seed(wire(bid, "OUT"), r.get("power"))
        elif role == "inverter":
            seed(wire(bid, "IN"), r.get("power_in"))
            seed(wire(bid, "OUT"), r.get("power_out"))
        elif role == "load":
            seed(wire(bid, "IN"), r.get("power"))
        elif role == "battery":
            seed(wire(bid, "BAT"), r.get("power"))

    # a through device is lossless (in = out), with or without Power; a missing device relates nothing
    through = [bid for bid, role in roles.items() if role == "through" and bindings[bid] is not None]
    pairs = [(wire(bid, "IN"), wire(bid, "OUT")) for bid in through]
    pairs += [(wire(bid, pos[bid]), wire(bid, _COMMON[f])) for bid, f in forms.items() if pos[bid] != "0"]
    buses = list(dict.fromkeys([*feeds, *taps]))  # stable order: over-determined values must not vary per run

    def settle() -> None:
        changed = True
        while changed:
            changed = False
            for a, b in pairs:
                if a is None or b is None or (a in known) == (b in known):
                    continue
                if a in known:
                    known[b] = known[a]
                else:
                    known[a] = known[b]
                changed = True
            for bus_id in buses:
                fs, ts = feeds.get(bus_id, []), taps.get(bus_id, [])
                unknown = [w for w in fs + ts if w not in known]
                if len(unknown) != 1:
                    continue
                s = sum(known[w] for w in fs if w in known) - sum(known[w] for w in ts if w in known)
                known[unknown[0]] = s if unknown[0] in ts else -s
                changed = True

    settle()

    # a remainder absorbs the loads without data on its bus: a load tap (bus -> IN of a device that is not an inverter
    # and has OUT unwired) has no downstream that could be metered. Through devices, sub-buses and transfers might.
    def load_of(wid: str) -> str | None:
        node = valid[wid][1]
        return node[1] if node[0] == "p" and node[2] == "IN" and roles.get(node[1]) == "load" else None

    absorbed: dict[str, list[str]] = {}
    for bid, kind in kinds.items():
        in_w = wire(bid, "IN") if kind == "remainder" else None
        if in_w is None or in_w in known or valid[in_w][0][0] != "b":
            continue
        fs, ts = feeds.get(valid[in_w][0][1], []), taps.get(valid[in_w][0][1], [])
        others = [load_of(w) for w in ts if w not in known and w != in_w]
        if not others or None in others or any(w not in known for w in fs):
            continue
        known[in_w] = sum(known[w] for w in fs) - sum(known[w] for w in ts if w in known)
        absorbed[bid] = list(dict.fromkeys(others))

    # remainders: a small negative on a bus is meter disagreement within tolerance
    hints: dict[str, str] = {}
    for bid, kind in kinds.items():
        in_w = wire(bid, "IN") if kind == "remainder" else None
        v = known.get(in_w) if in_w is not None else None
        if v is None or v >= 0 or valid[in_w][0][0] != "b":
            continue
        bus_feeds = feeds.get(valid[in_w][0][1], [])
        if -v <= max(10.0, 0.03 * sum(known[w] for w in bus_feeds if w in known)):
            known[in_w] = 0.0
        else:
            del known[in_w]
            hints[bid] = "disagree"
            alerts[bid].append("disagree")
            absorbed.pop(bid, None)

    frame_blocks: dict[str, dict] = {}
    for bid, kind in kinds.items():
        if kind in _READINGS or kind == "device":
            entry = {k: _w(v) for k, v in readings[bid].items()}
            if kind == "device" and bindings[bid] is None:
                entry["missing"] = True
        elif kind == "transfer":
            entry = {"position": pos[bid]}
        elif kind == "remainder":
            in_w = wire(bid, "IN")
            entry = {"power": _w(known.get(in_w) if in_w is not None else None)}
            if bid in hints:
                entry["hint"] = hints[bid]
            if bid in absorbed:
                entry["absorbed"] = absorbed[bid]
        else:
            continue
        if bid in switches:
            entry["switch"] = switches[bid]
        if bid in inverters:
            terms = [(wire(bid, port), sign) for port, sign in _LOSS if wire(bid, port) is not None]
            ok = terms and all(w in known for w, _ in terms)
            entry["loss"] = _w(sum(sign * known[w] for w, sign in terms)) if ok else None
        if alerts[bid]:
            entry["alert"] = alerts[bid]
        frame_blocks[bid] = entry

    frame_wires = {
        wid: {"power": _w(known.get(wid)) if e else None, "state": "live" if wid in live else "dead"}
        for wid, e in ends.items()
    }
    return {"wires": frame_wires, "blocks": frame_blocks}


class _Sub:
    """One subscription: a plan's schematic (a draft), its device bindings and the last frame sent."""

    def __init__(self, plan_id: str, schema: dict, devices: dict, cb: Callable[[dict], None]) -> None:
        self.plan_id = plan_id
        self.schema = schema
        self.devices = devices
        self.cb = cb
        self.entities = entity_ids(schema, devices)
        self.frame: dict | None = None


class PowerHub:
    """Live power frames per subscription, and the transfer positions (live state, not plan data)."""

    def __init__(
        self,
        lookup: Lookup,
        positions: dict | None = None,
        on_positions: Callable[[], None] | None = None,
    ) -> None:
        self._lookup = lookup
        self._positions: dict[str, dict[str, str]] = {
            pid: dict(v) for pid, v in (positions or {}).items() if isinstance(pid, str) and isinstance(v, dict)
        }
        self._on_positions = on_positions  # persist positions()
        self._subs: list[_Sub] = []

    def subscribe(self, plan_id: str, schema: dict, devices: dict, cb: Callable[[dict], None]) -> Callable[[], None]:
        sub = _Sub(plan_id, schema, devices, cb)
        self._subs.append(sub)

        def unsubscribe() -> None:
            if sub in self._subs:
                self._subs.remove(sub)

        self._update(sub)
        return unsubscribe

    def handle_state(self, entity_id: str) -> None:
        for sub in list(self._subs):
            if entity_id in sub.entities:
                self._update(sub)

    def set_position(self, plan_id: str, block_id: str, position: str) -> None:
        if position not in POSITIONS:
            raise ValueError(f"position must be one of {POSITIONS}")
        self._positions.setdefault(plan_id, {})[block_id] = position
        for sub in list(self._subs):
            if sub.plan_id == plan_id:
                self._update(sub)
        if self._on_positions is not None:
            self._on_positions()

    def positions(self) -> dict[str, dict[str, str]]:
        return {pid: dict(v) for pid, v in self._positions.items()}

    def entity_ids(self) -> set[str]:
        out: set[str] = set()
        for sub in self._subs:
            out |= sub.entities
        return out

    def _update(self, sub: _Sub) -> None:
        """Evaluate and send the frame when it changed; a subscriber that raises is dropped."""
        if sub not in self._subs:
            return
        frame = evaluate(sub.schema, sub.devices, self._lookup, self._positions.get(sub.plan_id, {}))
        if frame == sub.frame:
            return
        sub.frame = frame
        try:
            sub.cb(frame)
        except Exception:  # noqa: BLE001 - one bad subscriber must not stop the others
            _LOGGER.exception("power subscriber failed; dropping it")
            if sub in self._subs:
                self._subs.remove(sub)
