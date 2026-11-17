"""Condition rules: three-valued verdicts, debounce and edge actions over all saved plans. Must not import homeassistant."""

from __future__ import annotations

import copy
import json
import logging
import math
from datetime import date, datetime, time, timedelta, timezone, tzinfo
from typing import Callable

try:
    from .boiler import MODES, Boiler
except ImportError:  # pytest: module dir on sys.path
    from boiler import MODES, Boiler

_LOGGER = logging.getLogger(__name__)

# entity id -> (state, attributes); None when the entity is missing
Lookup = Callable[[str], "tuple[str, dict] | None"]
Callback = Callable[[bool, "dict[str, dict]"], None]
Key = tuple[str, str]  # (plan id, rule id)

# the role read as a rule input, per device kind; other kinds are not inputs
INPUT_ROLE = {
    "leak_sensor": "leak",
    "motion_sensor": "motion",
    "ceiling_light": "control",
    "wall_light": "control",
    "socket": "control",
    "exhaust_fan": "control",
    "equipment": "control",
    "wall_switch": "state",
    "valve": "state",
}
ON_OFF_DETAIL = {"leak_sensor": ("wet", "dry"), "motion_sensor": ("motion", "clear")}
ON_OFF_TARGETS = {"ceiling_light", "wall_light", "socket", "exhaust_fan"}
CONTROL_DOMAINS = {"light", "switch", "fan"}
VALVE_SERVICES = {
    ("valve", "open"): "open_valve",
    ("valve", "close"): "close_valve",
    ("switch", "open"): "turn_on",
    ("switch", "close"): "turn_off",
}
# static error reasons, most important first
STATIC_REASONS = ("cycle", "device missing", "rule missing", "target missing")
WAITING = "waiting for target"
SUN = "sun.sun"
SUN_STATES = {"below_horizon": (True, "below horizon"), "above_horizon": (False, "above horizon")}


def _available(st: "tuple[str, dict] | None") -> bool:
    return st is not None and st[0] not in ("unavailable", "unknown")


def _bound(device: dict, role: str | None) -> str | None:
    b = device.get("bindings")
    v = b.get(role) if isinstance(b, dict) and role else None
    return v if isinstance(v, str) and v else None


def _kind(device: dict) -> str | None:
    p = device.get("props")
    return p.get("kind") if isinstance(p, dict) else None


def _label(device: dict | None, fallback: str) -> str:
    name = device.get("name") if device else None
    return name if isinstance(name, str) and name else fallback


def _read(kind: str | None, eid: str | None, lookup: Lookup) -> "tuple[bool | None, str]":
    """(value, detail) of one device input."""
    st = lookup(eid) if eid else None
    if st is None:
        return None, "missing"
    s = st[0]
    if s in ("unknown", "unavailable"):
        return None, s
    if kind == "valve":
        states = {"open": True, "closed": False} if eid.split(".", 1)[0] == "valve" else {"on": True, "off": False}
        if s in states:
            return states[s], "open" if states[s] else "closed"
        return None, "unknown"  # opening / closing / anything else
    if s in ("on", "off"):
        on = s == "on"
        words = ON_OFF_DETAIL.get(kind or "", ("on", "off"))
        return on, words[0] if on else words[1]
    return None, "unknown"


def _read_sun(lookup: Lookup) -> "tuple[bool | None, str]":
    st = lookup(SUN)
    if st is None:
        return None, "missing"
    if st[0] in SUN_STATES:
        return SUN_STATES[st[0]]
    return None, st[0] if st[0] in ("unknown", "unavailable") else "unknown"


def _minutes(v: object) -> int | None:
    """Minutes after midnight of "HH:MM"."""
    try:
        h, m = (int(x) for x in str(v).split(":"))
    except ValueError:
        return None
    return h * 60 + m if 0 <= h < 24 and 0 <= m < 60 else None


def _hhmm(minutes: int) -> str:
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


def _instant(local: "Callable[[float], datetime]", tz: tzinfo, day: date, minutes: int) -> float:
    """The first moment the local clock reads `minutes` after midnight of `day`: the earlier of a repeated hour, the
    moment of the jump when a daylight-saving change skips it."""
    wall = datetime.combine(day, time(minutes // 60, minutes % 60))
    first, second = (wall.replace(tzinfo=tz, fold=f).timestamp() for f in (0, 1))
    lo, hi = min(first, second), max(first, second)
    if local(lo).replace(tzinfo=None) == wall:
        return lo
    lo, hi = math.floor(lo), math.ceil(hi)  # the clock jumps over `wall` between the two readings
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if local(mid).replace(tzinfo=None) >= wall:
            hi = mid
        else:
            lo = mid
    return float(hi)


def _span(elapsed: float, total: int) -> str:
    if total % 60 == 0:
        return f"{int(elapsed // 60)} / {total // 60} min"
    return f"{int(elapsed)} / {total} s"


def _absolute_humidity(device: dict, lookup: Lookup) -> "tuple[float | None, str]":
    """(g/m3, "") of a climate sensor, or (None, the cause) when its reading is unusable."""
    reads = []
    for role in ("temperature", "humidity"):
        eid = _bound(device, role)
        st = lookup(eid) if eid else None
        if st is None:
            return None, "missing"
        if st[0] in ("unknown", "unavailable"):
            return None, st[0]
        reads.append(st)
    (t_raw, t_attrs), (h_raw, h_attrs) = reads
    unit = (t_attrs or {}).get("unit_of_measurement")
    if unit not in ("°C", "°F"):
        return None, "not °C"
    if (h_attrs or {}).get("unit_of_measurement") != "%":
        return None, "not %"
    try:
        t, rh = float(t_raw), float(h_raw)
    except ValueError:
        return None, "no data"
    if not (math.isfinite(t) and math.isfinite(rh)):
        return None, "no data"
    if not 0 <= rh <= 100:
        return None, "not %"
    if unit == "°F":
        t = (t - 32) * 5 / 9
    if not -100 <= t <= 100:
        return None, "no data"
    ps = 6.112 * math.exp(17.62 * t / (243.12 + t))
    return 216.7 * (rh / 100 * ps) / (273.15 + t), ""


def _climate_parts(device: "dict | None", lookup: Lookup) -> dict:
    """The trace of one climate sensor: deg C and % each when readable on its own, g/m3 when both are, and the first
    reason (temperature first) the sensor is unusable."""
    if device is None:
        return {"t": None, "rh": None, "ah": None, "why": "missing"}
    vals, why = {}, ""
    for role, unit_ok, key in (("temperature", ("°C", "°F"), "t"), ("humidity", ("%",), "rh")):
        eid = _bound(device, role)
        st = lookup(eid) if eid else None
        cause, v = "", None
        if st is None:
            cause = "missing"
        elif st[0] in ("unknown", "unavailable"):
            cause = st[0]
        elif (st[1] or {}).get("unit_of_measurement") not in unit_ok:
            cause = "not °C" if key == "t" else "not %"
        else:
            try:
                v = float(st[0])
            except ValueError:
                cause = "no data"
            if v is not None and not math.isfinite(v):
                v, cause = None, "no data"
            elif v is not None and key == "rh" and not 0 <= v <= 100:
                v, cause = None, "not %"
            elif v is not None and key == "t":
                if (st[1] or {}).get("unit_of_measurement") == "°F":
                    v = (v - 32) * 5 / 9
                if not -100 <= v <= 100:
                    v, cause = None, "no data"
        vals[key] = v
        why = why or cause
    ah, _ = _absolute_humidity(device, lookup)
    return {"t": vals["t"], "rh": vals["rh"], "ah": ah, "why": why or None}


def _target(device: dict | None, do: str) -> "tuple[str, str, str] | None":
    """(domain, service, entity id) of one action, or None when the target cannot take it."""
    if device is None:
        return None
    kind = _kind(device)
    if kind == "valve":
        eid = _bound(device, "state")
        service = VALVE_SERVICES.get((eid.split(".", 1)[0], do)) if eid else None
        return (eid.split(".", 1)[0], service, eid) if service else None
    props = device.get("props")
    controllable = isinstance(props, dict) and props.get("controllable") is True
    if kind in ON_OFF_TARGETS or (kind == "equipment" and controllable):
        eid = _bound(device, "control")
        domain = eid.split(".", 1)[0] if eid else None
        if do in ("on", "off") and domain in CONTROL_DOMAINS:
            return domain, f"turn_{do}", eid
    return None


def _valve_entity(device: "dict | None") -> "str | None":
    return _bound(device, "state") if device is not None and _kind(device) == "valve" else None


def _valve_open(eid: str, st: "tuple[str, dict] | None") -> "bool | None":
    """True when the valve is open or opening (on for a switch), False when closed or closing, None otherwise."""
    if st is None:
        return None
    if eid.split(".", 1)[0] == "valve":
        return True if st[0] in ("open", "opening") else False if st[0] in ("closed", "closing") else None
    return True if st[0] == "on" else False if st[0] == "off" else None


def combine(mode: str, values: "list[bool | None]") -> "bool | None":
    if mode == "all":
        if False in values:
            return False
        return None if None in values else True
    # ANY ignores unknown inputs while any input is known: one dead sensor must not block a leak
    if True in values:
        return True
    return False if False in values else None


class _Input:
    """A rule input, the gate or a held source; type device, rule, light, sun, time or held."""

    def __init__(self, raw: dict, devices: dict, rule_names: dict) -> None:
        src = raw.get("source") if isinstance(raw.get("source"), dict) else {}
        self.negate = raw.get("not") is True
        self.cyclic = self.missing = False
        self.rule: str | None = None
        self.kind = self.eid = None
        self.sources: list[_Input] = []  # held
        self.reads: list[str] = []  # the entities whose change re-evaluates the input
        self.pair: "tuple[dict, dict] | None" = None  # vent: the two climate sensors
        self.devs: "list[dict | None]" = [None, None]  # vent: the two sensor devices, None when missing from the plan
        self.vpct: "int | None" = None  # vent: the last signed whole percent
        # runtime state, kept across a reload that leaves the rule unchanged
        self.timer: "tuple[float, Callable[[], None]] | None" = None  # time / held: (due epoch, cancel)
        self.prev: bool | None = None  # light: the value kept between the thresholds
        self.mem: list[bool | None] = []  # held: the last known value of each source
        self.was: list[bool] = []  # held: whether each source had data at the previous evaluation
        self.known: bool | None = None  # held: the last known combined state
        self.since = 0.0  # held: when the known combined state last changed
        self.boot = False  # held: its first known state counts as held since long ago (loaded at HA start)
        if isinstance(src.get("rule"), str):
            self.type, self.rule = "rule", src["rule"]
            self.missing = self.rule not in rule_names
            self.label = rule_names.get(self.rule) or self.rule
            self.sig: tuple = ("rule", self.rule)
        elif isinstance(src.get("vent"), dict):
            self.type = "vent"
            v = src["vent"]
            devs = [devices.get(v.get(k)) for k in ("sensor", "than")]
            self.devs = [d if d is not None and _kind(d) == "climate_sensor" else None for d in devs]
            self.missing = None in self.devs
            self.label = " vs ".join(_label(d, str(v.get(k))) for d, k in zip(devs, ("sensor", "than")))
            if not self.missing:
                self.pair = (devs[0], devs[1])
                self.reads = [e for d in devs for e in (_bound(d, "temperature"), _bound(d, "humidity")) if e]
            self.above = float(v["above"]) if isinstance(v.get("above"), (int, float)) else 0.0
            self.below = float(v["below"]) if isinstance(v.get("below"), (int, float)) else 0.0
            self.sig = ("vent", v.get("sensor"), v.get("than"), self.above, self.below, tuple(self.reads))
        elif "light" in src:
            self.type = "light"
            did = src["light"] if isinstance(src["light"], str) else ""
            device = devices.get(did)
            self.missing = device is None
            self.label = _label(device, did)
            self.kind = _kind(device) if device is not None else None
            self.eid = _bound(device, "illuminance") if self.kind == "illuminance_sensor" else None
            below, hyst = src.get("below"), src.get("hysteresis")
            self.below = float(below) if isinstance(below, (int, float)) else 0.0
            self.hyst = float(hyst) if isinstance(hyst, (int, float)) else 0.0
            self.dark = src.get("unknownDark") is True
            self.sig = ("light", did, self.eid, self.dark)
            self.reads = [self.eid] if self.eid else []
        elif src.get("sun") is True:
            self.type, self.eid, self.label, self.sig = "sun", SUN, "Sun", ("sun",)
        elif isinstance(src.get("time"), dict):
            self.type, self.label = "time", "Time"
            self.start, self.end = _minutes(src["time"].get("from")), _minutes(src["time"].get("to"))
            self.sig = ("time", self.start, self.end)
        elif isinstance(src.get("held"), dict):
            self.type = "held"
            h = src["held"]
            srcs = h.get("sources") if isinstance(h.get("sources"), list) else []
            self.sources = [_Input({"source": s}, devices, rule_names) for s in srcs if isinstance(s, dict)]
            self.state = h.get("state") if h.get("state") in ("on", "off") else "any"
            self.seconds = h["seconds"] if type(h.get("seconds")) is int and h["seconds"] > 0 else 1
            self.label = ", ".join(s.label for s in self.sources)
            self.mem = [None] * len(self.sources)
            self.was = [False] * len(self.sources)
            self.sig = ("held", tuple(s.sig for s in self.sources))
        else:
            self.type = "device"
            did = src.get("device") if isinstance(src.get("device"), str) else ""
            device = devices.get(did)
            self.missing = device is None
            self.label = _label(device, did)
            if device is not None:
                self.kind = _kind(device)
                self.eid = _bound(device, INPUT_ROLE.get(self.kind or ""))
            self.sig = ("device", did, self.kind, self.eid)
            self.reads = [self.eid] if self.eid else []
        if self.type == "sun":
            self.reads = [SUN]

    def parts(self) -> "list[_Input]":
        """The inputs that read a device or a rule: the held sources, or the input itself."""
        return self.sources if self.type == "held" else [self]

    def take(self, old: "_Input") -> None:
        """Keep the runtime state of the same input of an unchanged rule (its timer is re-armed on evaluation)."""
        self.prev, self.mem, self.known, self.since, self.boot = old.prev, old.mem, old.known, old.since, old.boot
        self.was = old.was

    def stop(self) -> None:
        if self.timer is not None:
            self.timer[1]()
            self.timer = None


class _Action:
    def __init__(self, raw: dict, devices: dict) -> None:
        did = raw.get("device") if isinstance(raw.get("device"), str) else ""
        device = devices.get(did)
        self.do = raw.get("do") if isinstance(raw.get("do"), str) else ""
        self.label = _label(device, did)
        self.call = _target(device, self.do)


class _Sent:
    """One action of a rule's latest firing that has a target entity."""

    def __init__(self, action: _Action, entry: dict) -> None:
        self.action, self.entry = action, entry
        self.waiting: str | None = None  # "target unavailable" / "service failed" while waiting for the target
        self.attempt = 0  # a late failure counts only for the latest send of this action


class _Pending:
    def __init__(self, to: bool, at: int) -> None:
        self.to, self.at = to, at
        self.cancel: Callable[[], None] = lambda: None


class _Rule:
    def __init__(self, pid: str, raw: dict, devices: dict, rule_names: dict, blocks: "dict | None" = None) -> None:
        self.key: Key = (pid, raw["id"])
        self.name = raw.get("name") if isinstance(raw.get("name"), str) else raw["id"]
        self.enabled = raw.get("enabled") is not False
        self.mode = raw.get("combine") if raw.get("combine") in ("all", "any") else "any"
        vent = raw.get("vent")
        self.vent = isinstance(vent, dict)
        boiler = raw.get("boiler")
        self.boiler = Boiler(boiler, devices, blocks or {}) if isinstance(boiler, dict) else None
        leak = raw.get("leak")
        sensors = [x for x in leak.get("sensors") or [] if isinstance(x, str)] if isinstance(leak, dict) else []
        valves = [x for x in leak.get("valves") or [] if isinstance(x, str)] if isinstance(leak, dict) else []
        self.leak = isinstance(leak, dict)
        if self.leak:
            self.mode = "any"  # ruling A3: a dead sensor must not block a leak
        # a leak rule is the same machinery over its own inputs and actions: the wet sensors close the valves
        self.seen: dict[str, "bool | None"] = {}  # leak: valve entity -> open as of its last state change
        self.leak_valves = [(v, _label(devices.get(v), v), _valve_entity(devices.get(v))) for v in valves]
        if self.leak:
            raw_inputs = [{"source": {"device": s}} for s in sensors]
        elif isinstance(vent, dict):
            raw_inputs = [{"source": {"vent": vent}}]
        else:
            raw_inputs = raw.get("inputs") or []
        self.inputs = [_Input(i, devices, rule_names) for i in raw_inputs if isinstance(i, dict)]
        self.gate = _Input(raw["gate"], devices, rule_names) if isinstance(raw.get("gate"), dict) else None
        self.all_inputs = self.inputs + ([self.gate] if self.gate is not None else [])
        on_true = [{"device": v, "do": "close"} for v in valves] if self.leak else raw.get("onTrue") or []
        self.on_true = [_Action(a, devices) for a in on_true if isinstance(a, dict)]
        self.on_false = [_Action(a, devices) for a in raw.get("onFalse") or [] if isinstance(a, dict)]
        self.on_delay = _delay(raw.get("onDelay"))
        self.off_delay = _delay(raw.get("offDelay"))
        self.sig = (
            # name and zoneId are cosmetic: changing only them keeps the runtime state
            json.dumps({k: v for k, v in raw.items() if k not in ("name", "zoneId")}, sort_keys=True, default=str),
            tuple(i.sig for i in self.all_inputs),
            tuple(a.call for a in self.on_true + self.on_false),
        )
        # runtime state, kept across a reload that leaves the rule unchanged
        self.verdict: bool | None = None  # the debounced verdict; None until first known
        self.pending: _Pending | None = None
        self.last: dict | None = None
        self.seq = 0  # verdict change counter: a late failure or a re-send counts only for the firing that sent it
        self.failed: str | None = None  # "service failed" / "target unavailable" for the last firing
        self.entries: list[dict] = []  # the trace entries of the last firing
        self.sent: list[_Sent] = []  # its actions with a target, while that firing is the latest one
        self.open = False  # the gate (always open without one) as of the last evaluation
        # derived on every evaluation
        self.raw: bool | None = None
        self.trace_inputs: list[dict] = []
        self.gate_trace: dict | None = None

    def adopt(self, old: "_Rule") -> None:
        self.verdict, self.pending, self.last, self.failed = old.verdict, old.pending, old.last, old.failed
        self.seq, self.entries, self.sent, self.open = old.seq, old.entries, old.sent, old.open
        self.seen = dict(old.seen)
        for new, prev in zip(self.all_inputs, old.all_inputs):
            prev.stop()
            new.take(prev)

    def cancel(self) -> None:
        if self.pending is not None:
            self.pending.cancel()
            self.pending = None

    def stop(self) -> None:
        """Cancel every timer: the debounce, the time / held inputs and the boiler's."""
        self.cancel()
        for i in self.all_inputs:
            i.stop()
        if self.boiler is not None:
            self.boiler.stop()

    def actions(self) -> "list[_Action]":
        """The actions of the current verdict."""
        return [] if self.verdict is None else self.on_true if self.verdict else self.on_false

    def static_reason(self) -> str | None:
        found = set()
        for i in (p for top in self.all_inputs for p in top.parts()):
            if i.cyclic:
                found.add("cycle")
            elif i.missing:
                found.add("rule missing" if i.rule is not None else "device missing")
        if any(a.call is None for a in self.on_true + self.on_false):
            found.add("target missing")
        if self.boiler is not None and self.boiler.missing:
            found.add("device missing")
        return next((r for r in STATIC_REASONS if r in found), None)


def _delay(v: object) -> int:
    return v if type(v) is int and v > 0 else 0


class RuleEngine:
    def __init__(
        self,
        lookup: Lookup,
        now: Callable[[], float],
        call: Callable[..., None],  # call(domain, service, entity_id, on_error=cb(str), current=() -> bool)
        schedule: Callable[[float, Callable[[], None]], Callable[[], None]],
        *,
        local: "Callable[[float], datetime]" = lambda t: datetime.fromtimestamp(t, timezone.utc),
        changed_at: "Callable[[str], float | None]" = lambda eid: None,
        on_modes: "Callable[[dict[str, dict[str, str]]], None]" = lambda modes: None,
    ) -> None:
        self._lookup = lookup
        self._now = now  # epoch seconds
        self._call = call
        self._schedule = schedule
        self._local = local  # epoch seconds -> aware datetime in the HA time zone
        self._changed_at = changed_at  # entity id -> epoch seconds of its HA last_changed
        self._started = False  # the first load_plans is the HA start
        self._rules: dict[Key, _Rule] = {}
        self._order: dict[Key, int] = {}  # referenced rules before their consumers
        self._consumers: dict[Key, list[Key]] = {}
        self._readers: dict[str, list[Key]] = {}
        self._targets: dict[str, list[Key]] = {}  # action target entity -> enabled rules
        self._published: dict[Key, dict] = {}
        self._subs: dict[str, list[Callback]] = {}
        self._on_modes = on_modes  # the boiler modes {plan id: {rule id: mode}} after any of them changed
        self._modes: dict[str, dict[str, str]] = {}  # the modes last reported (or loaded)
        self._booting = False  # a boot load happened and started() has not come yet: boiler auto waits

    # --- loading -------------------------------------------------------------

    def load_plans(
        self, plans: "list[dict]", *, boot: "bool | None" = None, modes: "dict | None" = None
    ) -> None:
        """boot: True when this load is the HA start; None keeps "the first call is the start".
        modes: the stored boiler modes {plan id: {rule id: 'auto' | 'manual'}}, used for boiler rules not loaded yet."""
        old = self._rules
        if modes is not None:
            self._modes = {
                pid: {rid: m for rid, m in ms.items() if m in MODES}
                for pid, ms in modes.items() if isinstance(ms, dict)
            } if isinstance(modes, dict) else {}
        first, self._started = not self._started, True
        if boot is None:
            boot = first
        if boot:
            self._booting = True
        stopped: list[_Rule] = []  # boiler rules disabled while auto whose last command was on
        rules: dict[Key, _Rule] = {}
        for plan in plans:
            pid = plan.get("id") if isinstance(plan, dict) else None
            if not isinstance(pid, str):
                continue
            devices: dict[str, dict] = {}
            for level in plan.get("levels") or []:
                for d in (level.get("devices") or []) if isinstance(level, dict) else []:
                    if isinstance(d, dict) and isinstance(d.get("id"), str):
                        devices.setdefault(d["id"], d)
            power = plan.get("power") if isinstance(plan.get("power"), dict) else {}
            blocks = {
                b["id"]: b for b in power.get("blocks") or [] if isinstance(b, dict) and isinstance(b.get("id"), str)
            }
            raws = [r for r in plan.get("rules") or [] if isinstance(r, dict) and isinstance(r.get("id"), str)]
            names = {r["id"]: (r.get("name") if isinstance(r.get("name"), str) else r["id"]) for r in raws}
            for raw in raws:
                rule = _Rule(pid, raw, devices, names, blocks)
                if rule.key in rules:
                    continue
                prev = old.get(rule.key)
                if prev is not None and prev.sig == rule.sig:
                    rule.adopt(prev)
                else:
                    if prev is not None:
                        prev.stop()
                    for i in rule.all_inputs:
                        i.boot = boot
                if rule.boiler is not None and self._load_boiler(rule, prev, modes):
                    stopped.append(rule)
                rules[rule.key] = rule
        for key, prev in old.items():
            if key not in rules:
                prev.stop()
        released = self._released_relays(old, rules)
        self._rules = rules
        self._link()
        for rule in rules.values():
            for _, _, eid in rule.leak_valves:
                if eid is not None and eid not in rule.seen:
                    rule.seen[eid] = _valve_open(eid, self._lookup(eid))
        for rule in stopped:
            self._boiler_send(rule, rule.boiler.command("off", self._now()), "rule disabled")
        for relay in released:
            self._release(relay)
        self._settle(set(rules))
        self._published = {key: self._trace(r) for key, r in rules.items()}
        for pid in list(self._subs):
            self._notify(pid, True, self.snapshot(pid))
        self._report_modes()

    def _released_relays(self, old: "dict[Key, _Rule]", rules: "dict[Key, _Rule]") -> "list[str]":
        """Relays of boiler rules that were auto and lose their state in this load (rule deleted, no longer a boiler,
        or its device / button / grid block changed, which resets it to manual) while the relay reads on: they go off,
        as on disabling (no inverter protection without the rule)."""
        out: list[str] = []
        for key, prev in old.items():
            b = prev.boiler
            if b is None or b.mode != "auto" or not prev.enabled or b.relay is None or b.relay in out:
                continue
            now = rules.get(key)
            if now is not None and now.boiler is not None and now.boiler.ident == b.ident:
                continue  # state carried over
            if b.relay_state(self._lookup) == "on":
                out.append(b.relay)
        return out

    def _release(self, relay: str) -> None:
        """Switch off the relay of a boiler rule that lost its auto state; a failure is only logged."""
        def on_error(err: str, why: str = "service failed") -> None:
            _LOGGER.warning("boiler relay %s: turn_off failed: %s", relay, err)

        try:
            self._call(relay.split(".", 1)[0], "turn_off", relay, on_error=on_error, current=lambda: True)
        except Exception as err:  # noqa: BLE001 - a failing relay must not stop the engine
            _LOGGER.warning("boiler relay %s: turn_off failed: %s", relay, err)

    def _load_boiler(self, rule: _Rule, prev: "_Rule | None", modes: "dict | None") -> bool:
        """Keep the state of the same boiler (device, button and grid block unchanged); a boiler not loaded yet takes
        its stored mode; any other one starts manual. True when the rule was disabled while auto and its last command
        was on: the relay must go off (no inverter protection without the rule)."""
        b = rule.boiler
        assert b is not None
        old = prev.boiler if prev is not None else None
        if old is not None and old.ident == b.ident:
            old.stop()
            b.take(old)
            rule.last, rule.failed = prev.last, prev.failed
            if prev.enabled and not rule.enabled and b.mode == "auto":
                b.manual()
                return b.relay is not None and b.relay_state(self._lookup) == "on"
            return False
        b.seen = b.relay_state(self._lookup)
        stored = self._modes.get(rule.key[0], {}).get(rule.key[1]) if prev is None and modes is not None else None
        if stored == "auto" and rule.enabled:
            b.enter_auto(self._now(), b.seen)  # evaluated once the boot phase is over (started())
        return False

    def _link(self) -> None:
        """Order rules so references come first; a reference closing a cycle is marked and ignored."""
        self._order, self._consumers, self._readers, self._targets = {}, {}, {}, {}
        state: dict[Key, int] = {}

        def visit(key: Key) -> None:
            state[key] = 1
            for i in (p for top in self._rules[key].all_inputs for p in top.parts()):
                ref = (key[0], i.rule) if i.rule is not None else None
                if ref is None or ref not in self._rules:
                    continue
                if state.get(ref) == 1:
                    i.cyclic = True
                    continue
                if ref not in state:
                    visit(ref)
                self._consumers.setdefault(ref, []).append(key)
            state[key] = 2
            self._order[key] = len(self._order)

        for key in self._rules:
            if key not in state:
                visit(key)
        for key, rule in self._rules.items():
            reads = [eid for top in rule.all_inputs for p in top.parts() for eid in p.reads]
            for eid in reads + (rule.boiler.reads if rule.boiler is not None else []):
                if key not in self._readers.get(eid, []):
                    self._readers.setdefault(eid, []).append(key)
            for a in rule.on_true + rule.on_false if rule.enabled else []:
                if a.call is not None and key not in self._targets.get(a.call[2], []):
                    self._targets.setdefault(a.call[2], []).append(key)

    # --- evaluation ----------------------------------------------------------

    def _settle(self, dirty: "set[Key]") -> None:
        """Evaluate the dirty rules in reference order; a changed verdict makes its consumers dirty."""
        while dirty:
            key = min(dirty, key=lambda k: self._order.get(k, 0))
            dirty.discard(key)
            rule = self._rules.get(key)
            if rule is not None and self._evaluate(rule):
                dirty.update(self._consumers.get(key, ()))

    def _compute(self, rule: _Rule) -> None:
        values: list[bool | None] = []
        trace: list[dict] = []
        for i in rule.inputs:
            t = self._input(rule, i)
            trace.append(t)
            values.append(t["value"] if t["value"] is None or not i.negate else not t["value"])
        rule.raw = combine(rule.mode, values) if values else None
        rule.trace_inputs = trace
        if rule.gate is not None:
            g = self._input(rule, rule.gate)
            del g["label"]
            if g["value"] is not None and rule.gate.negate:
                g["value"] = not g["value"]  # the gate trace shows open (true) / closed
            rule.gate_trace = g

    def _input(self, rule: _Rule, i: _Input) -> dict:
        """The trace entry of one input or the gate; (re)arms its timer."""
        value, detail, wake = self._value(rule, i, self._now())
        if not rule.enabled:
            wake = None  # a disabled rule arms no timers
        out = {"label": i.label, "value": value, "detail": detail}
        if i.type == "held" and wake is not None:
            out["until"] = int(wake * 1000)
        if i.type == "vent":
            out["vent"] = self._vent_trace(i)
        if i.timer is not None and i.timer[0] != wake:
            i.stop()
        if wake is not None and i.timer is None:
            key = rule.key
            i.timer = (wake, self._schedule(max(0.0, wake - self._now()), lambda: self._wake(key, i)))
        return out

    def _vent_trace(self, i: _Input) -> dict:
        """The structured vent trace: both sensors read on their own and the signed percent."""
        a, b = (_climate_parts(d, self._lookup) for d in i.devs)
        return {"a": a, "b": b, "pct": None if i.missing else i.vpct}

    def _wake(self, key: Key, i: _Input) -> None:
        """A time / held input reached its next transition."""
        rule = self._rules.get(key)
        if rule is None or not any(x is i for x in rule.all_inputs):
            return
        i.timer = None
        self._settle({key})
        self._flush()

    def _value(self, rule: _Rule, i: _Input, now: float) -> "tuple[bool | None, str, float | None]":
        """(value before NOT, detail, epoch of the next transition to wake up at) of one input."""
        if i.type == "rule":
            ref = self._rules.get((rule.key[0], i.rule))
            value = ref.verdict if ref is not None and ref.enabled and not i.cyclic else None
            return value, "missing" if i.missing else "unknown" if value is None else "on" if value else "off", None
        if i.type == "held":
            return self._held(rule, i, now)
        if i.type == "time":
            return self._window(i, now)
        if i.missing:
            return None, "missing", None
        if i.type == "vent":
            return (*self._vent(i), None)
        if i.type == "light":
            return (*self._light(i), None)
        if i.type == "sun":
            return (*_read_sun(self._lookup), None)
        return (*_read(i.kind, i.eid, self._lookup), None)

    def _vent(self, i: _Input) -> "tuple[bool | None, str]":
        """The sensor's absolute humidity against the other's: above 1 + above %: true; below 1 + below %: false;
        in between: the previous value."""
        ah = [_absolute_humidity(d, self._lookup) for d in i.pair or ()]
        i.vpct = None
        for _, cause in ah:
            if cause:
                return None, cause
        a, b = ah[0][0], ah[1][0]
        if b <= 0:
            return None, "no data"
        r = a / b
        i.vpct = round((r - 1) * 100)
        if r > 1 + i.above / 100:
            i.prev = True
        elif r < 1 + i.below / 100 or i.prev is None:
            i.prev = False
        return i.prev, f"{a:.1f} / {b:.1f} g/m³ ({round((r - 1) * 100):+d} %)"

    def _light(self, i: _Input) -> "tuple[bool | None, str]":
        """Below the threshold: true; above it plus the hysteresis: false; in between: the previous value."""
        no_data: "tuple[bool | None, str]" = (True, "no data (dark)") if i.dark else (None, "")
        st = self._lookup(i.eid) if i.eid else None
        if st is None:
            return no_data if i.dark else (None, "missing")
        if st[0] in ("unknown", "unavailable"):
            return no_data if i.dark else (None, st[0])
        if (st[1] or {}).get("unit_of_measurement") != "lx":
            return no_data if i.dark else (None, "not lx")
        try:
            v = float(st[0])
        except ValueError:
            return no_data if i.dark else (None, "unknown")
        if not math.isfinite(v):
            return no_data if i.dark else (None, "unknown")
        if v < i.below:
            i.prev = True
        elif v > i.below + i.hyst or i.prev is None:
            i.prev = False
        return i.prev, f"{v:g} lx"

    def _window(self, i: _Input, now: float) -> "tuple[bool | None, str, float | None]":
        """In [from, to) of the local clock; the window crosses midnight when to < from."""
        if i.start is None or i.end is None or i.start == i.end:
            return None, "invalid", None
        wall = self._local(now)
        edges = []
        for k in (-1, 0, 1):
            day = wall.date() + timedelta(days=k)
            end_day = day + timedelta(days=1) if i.end < i.start else day
            edges.append((_instant(self._local, wall.tzinfo, day, i.start),
                          _instant(self._local, wall.tzinfo, end_day, i.end)))
        inside = any(a <= now < b for a, b in edges)
        wake = min(t for edge in edges for t in edge if t > now)
        if inside:
            return True, f"in window until {_hhmm(i.end)}", wake
        return False, f"outside window until {_hhmm(i.start)}", wake

    def _held(self, rule: _Rule, i: _Input, now: float) -> "tuple[bool | None, str, float | None]":
        """The sources (any active) held on / off / unchanged for the seconds; a source unknown for a while counts as
        its last known value, so it does not restart the count. Only a known -> known change of a source restarts it;
        a return from no data never does."""
        values = [self._value(rule, s, now)[0] for s in i.sources]
        if all(v is None for v in values):
            if i.known is None:
                i.boot = True  # no data at the start: held since long ago once it becomes known
            i.was = [False] * len(values)
            return None, "unknown", None
        moved = any(w and v is not None and v != m for v, m, w in zip(values, i.mem, i.was))
        i.mem = [m if v is None else v for v, m in zip(values, i.mem)]
        i.was = [v is not None for v in values]
        combined = True in i.mem
        if i.known is None:
            i.since = -math.inf if i.boot else self._since(i, now)
        elif combined != i.known and moved:
            i.since = now
        i.known = combined
        word = "on" if combined else "off"
        if i.state != "any" and i.state != word:
            return False, word, None
        word = "unchanged" if i.state == "any" else word
        due = i.since + i.seconds
        if due <= now:
            return True, f"{word} {_span(i.seconds, i.seconds)}", None
        return False, f"{word} {_span(now - i.since, i.seconds)}", due

    def _since(self, i: _Input, now: float) -> float:
        """Start of a held input of a saved rule: the latest last_changed of its device sources (now for a rule
        source or when HA does not know it)."""
        stamps = []
        for s, m in zip(i.sources, i.mem):
            at = self._changed_at(s.eid) if s.rule is None and s.eid else None
            if m is None and at is not None:
                continue  # no data now: its last_changed is the outage, which never counts
            stamps.append(now if at is None else min(at, now))  # -inf (long ago) stays -inf
        return max(stamps)

    def _evaluate(self, rule: _Rule, due: "_Pending | None" = None) -> bool:
        """Recompute the rule; True when its debounced verdict changed. An opening gate sends the current verdict."""
        if rule.boiler is not None:
            return self._boiler(rule)
        self._compute(rule)
        if not rule.enabled:
            return False
        was_open, seq = rule.open, rule.seq
        rule.open = rule.gate_trace is None or rule.gate_trace["value"] is True
        changed = self._step(rule, due)
        actions = rule.actions()
        if rule.open and not was_open and rule.seq == seq and actions:
            self._new_firing(rule)
            self._fire(rule, actions, "gate opened")
        return changed

    def _step(self, rule: _Rule, due: "_Pending | None") -> bool:
        raw = rule.raw
        if raw is None:
            if rule.vent and (due or rule.pending) is not None and not (due or rule.pending).to:
                # a sensor dropping out must not strand the fan: the run-on finishes
                if due is not None:
                    self._commit(rule, False, "became false")
                    return True
                return False
            rule.cancel()
            return False
        if due is not None and raw == due.to:
            self._commit(rule, raw, "became true" if raw else "became false")
            return True
        if rule.verdict is None:  # rule start: a known verdict applies at once
            self._commit(rule, raw, "start")
            return True
        if raw == rule.verdict:
            rule.cancel()
            return False
        if rule.pending is not None and rule.pending.to == raw:
            return False
        rule.cancel()
        delay = rule.on_delay if raw else rule.off_delay
        if delay <= 0:
            self._commit(rule, raw, "became true" if raw else "became false")
            return True
        pending = _Pending(raw, int((self._now() + delay) * 1000))
        rule.pending = pending
        pending.cancel = self._schedule(delay, lambda: self._due(rule.key, pending))
        return False

    def _due(self, key: Key, pending: _Pending) -> None:
        rule = self._rules.get(key)
        if rule is None or rule.pending is not pending:
            return
        rule.pending = None
        if self._evaluate(rule, pending):
            self._settle(set(self._consumers.get(key, ())))
        self._flush()

    def _commit(self, rule: _Rule, verdict: bool, why: str) -> None:
        """A new verdict (also at rule start, both ways); its actions wait while the gate is closed."""
        rule.verdict = verdict
        # A new verdict ends the previous firing, also without actions: its held calls are stale and its waiting
        # actions are given up (their error shows why they did not get through).
        self._new_firing(rule)
        if rule.open:
            self._fire(rule, rule.actions(), why)

    def _new_firing(self, rule: _Rule) -> None:
        rule.seq += 1
        for s in rule.sent:
            if s.waiting:
                s.entry["error"] = s.waiting
        rule.sent = []

    def _fire(self, rule: _Rule, actions: "list[_Action]", why: str) -> None:
        if not actions:
            return
        because = [
            f"{t['label']} {t['detail']}"
            for i, t in zip(rule.inputs, rule.trace_inputs)
            if t["value"] is not None and (t["value"] != i.negate) == rule.verdict
        ]
        reason = f"{why}: {', '.join(because)}" if because else why
        at = int(self._now() * 1000)
        rule.entries = []
        for a in actions:
            entry = {"action": a.do, "target": a.label, "at": at, "reason": reason}
            rule.entries.append(entry)
            if a.call is None:
                entry["error"] = "target missing"
            else:
                sent = _Sent(a, entry)
                rule.sent.append(sent)
                self._send(rule, sent)
        self._refresh(rule)

    def _send(self, rule: _Rule, sent: _Sent) -> None:
        """Call one action of the rule's latest firing; an unavailable target or a failed call marks it waiting."""
        seq = rule.seq
        sent.attempt += 1
        attempt = sent.attempt
        sent.waiting = None
        sent.entry.pop("error", None)
        try:
            held = self._call(
                *sent.action.call,
                on_error=lambda err, why="service failed": self._failed(rule, seq, sent, attempt, why),
                current=lambda: self._current(rule, seq) is not None,
            )
        except Exception as err:  # noqa: BLE001 - one failing target must not stop the others
            _LOGGER.warning("rule %s: %s.%s %s failed: %s", rule.name, *sent.action.call, err)
            sent.waiting = "service failed"
            return
        # A held call (sent later) checks its target when it is sent and reports back through on_error. Otherwise
        # the target is checked now: an unavailable one is still called (HA may accept it), but the action waits.
        if held is not True and not _available(self._lookup(sent.action.call[2])):
            sent.waiting = "target unavailable"

    def _refresh(self, rule: _Rule) -> None:
        """Last action and failure of the latest firing, from its entries and waiting marks."""
        for s in rule.sent:
            if s.waiting:
                s.entry["error"] = WAITING
        marks = {s.waiting for s in rule.sent}
        rule.failed = next((r for r in ("service failed", "target unavailable") if r in marks), None)
        if rule.entries:
            rule.last = next((e for e in rule.entries if "error" in e), rule.entries[-1])

    def _current(self, rule: _Rule, seq: int) -> "_Rule | None":
        """The loaded rule when the firing `seq` of `rule` is still its latest one (an unchanged reload keeps it)."""
        now = self._rules.get(rule.key)
        return now if now is not None and now.sig == rule.sig and now.seq == seq else None

    def _failed(self, rule: _Rule, seq: int, sent: _Sent, attempt: int, why: str) -> None:
        """A call that failed after it was sent (async service, or a held call whose target was unavailable at send
        time): mark it waiting unless the rule fired again, changed or went away, or the action was sent again since."""
        now = self._current(rule, seq)
        if now is None or sent.attempt != attempt or sent not in now.sent:
            return
        sent.waiting = "service failed" if "service failed" in (sent.waiting, why) else why
        self._refresh(now)
        self._flush()

    def _reclose(self, rule: _Rule, entity_id: str) -> None:
        """Leak protection: a valve of the rule opens while the verdict is true (by anyone): close it again at once.
        A close still waiting for the target is left to _resend. A close never produces an open, so this cannot loop."""
        if not rule.leak:
            return
        was, now = rule.seen.get(entity_id), _valve_open(entity_id, self._lookup(entity_id))
        rule.seen[entity_id] = now
        if now is not True or was is True:  # only a change into open counts, not an attribute update
            return
        if not rule.enabled or not rule.open or rule.verdict is not True:
            return
        again = [s for s in rule.sent if s.action.call[2] == entity_id and not s.waiting]
        for s in again:
            s.entry["at"] = int(self._now() * 1000)
            s.entry["reason"] = "re-closed: leak"
            self._send(rule, s)
        if again:
            self._refresh(rule)
            rule.last = again[-1].entry

    def _resend(self, entity_id: str) -> None:
        """The target came back: send its waiting actions again, once per such state change."""
        if not _available(self._lookup(entity_id)):
            return
        for key in self._targets.get(entity_id, ()):
            rule = self._rules.get(key)
            if rule is None or not rule.enabled or not rule.open:  # a closed gate holds re-sends too
                continue
            waiting =[s for s in rule.sent if s.waiting and s.action.call[2] == entity_id]
            for s in waiting:
                s.entry["at"] = int(self._now() * 1000)
                self._send(rule, s)
            if waiting:
                self._refresh(rule)

    # --- boiler --------------------------------------------------------------

    def _boiler(self, rule: _Rule) -> bool:
        """Evaluate a boiler rule (auto steps only in auto); True when its verdict (mode is auto) changed."""
        b = rule.boiler
        assert b is not None
        grid, power, relay = b.readings(self._lookup)
        b.until = None
        active = rule.enabled and not b.missing
        if active and b.mode == "auto" and not self._booting:  # §9: auto is evaluated once HA has started
            do, why = b.auto(self._now(), grid, power, relay)
            if do is not None:
                self._boiler_send(rule, do, why)
        b.view = b.trace(grid, power, relay)
        wake = b.until if active else None
        if b.timer is not None and b.timer[0] != wake:
            b.stop()
        if wake is not None and b.timer is None:
            key = rule.key
            b.timer = (wake, self._schedule(max(0.0, wake - self._now()), lambda: self._boiler_wake(key, b)))
        verdict = b.mode == "auto" if rule.enabled else None
        rule.raw = verdict
        changed = verdict != rule.verdict
        rule.verdict = verdict
        return changed

    def started(self) -> None:
        """HA has started: end the boot phase and evaluate the boiler rules in auto once."""
        if not self._booting:
            return
        self._booting = False
        self._settle({key for key, rule in self._rules.items() if rule.boiler is not None})
        self._flush()

    def _boiler_wake(self, key: Key, b: Boiler) -> None:
        rule = self._rules.get(key)
        if rule is None or rule.boiler is not b:
            return
        b.timer = None
        self._settle({key})
        self._flush()

    def _boiler_send(self, rule: _Rule, do: str, why: str) -> None:
        """Switch the boiler relay; an unavailable relay or a failed call waits until the relay comes back."""
        b = rule.boiler
        assert b is not None and b.relay is not None
        b.sends += 1
        key, n, relay = rule.key, b.sends, b.relay
        entry = {"action": do, "target": b.label, "at": int(self._now() * 1000), "reason": why}
        rule.last, rule.failed = entry, None

        def current() -> "_Rule | None":
            now = self._rules.get(key)
            ok = now is not None and now.boiler is not None and now.boiler.sends == n and now.boiler.relay == relay
            return now if ok else None

        def on_error(err: str, why: str = "service failed") -> None:
            now = current()
            if now is None:
                return
            now.failed = "service failed" if "service failed" in (now.failed, why) else why
            if now.last is not None:
                now.last["error"] = WAITING
            self._flush()

        try:
            held = self._call(relay.split(".", 1)[0], f"turn_{do}", relay, on_error=on_error,
                              current=lambda: current() is not None)
        except Exception as err:  # noqa: BLE001 - a failing relay must not stop the engine
            _LOGGER.warning("rule %s: turn_%s %s failed: %s", rule.name, do, relay, err)
            rule.failed, entry["error"] = "service failed", WAITING
            return
        if held is not True and not _available(self._lookup(relay)):
            rule.failed, entry["error"] = "target unavailable", WAITING

    def _boiler_relay(self, rule: _Rule, own: bool) -> None:
        """A state change of a boiler relay, before the evaluation: a human taking over, a command that got through or
        a waiting one to send again."""
        b = rule.boiler
        assert b is not None
        active = rule.enabled and not b.missing
        relay = b.relay_state(self._lookup)
        if b.relay_changed(relay, own, active):
            b.cmd = None
            if rule.failed is not None and rule.last is not None:
                rule.last["error"] = rule.failed  # given up: the human took over
            rule.failed = None
            return
        if b.cmd is None:
            return
        if relay == b.cmd:
            if rule.failed is not None:
                rule.failed = None
                if rule.last is not None:
                    rule.last.pop("error", None)
        elif rule.failed is not None and active and _available(self._lookup(b.relay)):
            reason = rule.last["reason"] if rule.last is not None else ""
            self._boiler_send(rule, b.command(b.cmd, self._now()), reason)
        elif relay is not None:
            b.cmd = None  # the relay moved away from the command: auto may send it again

    def on_intent(self, plan_id: str, container_id: str, intent: dict) -> None:
        """A container intent ({"action": "toggle"}, {"action": "set", "value": "on" | "off"}, {"action": "auto"}); a
        boiler rule whose button it is takes it. Status events and other actions are ignored."""
        if not isinstance(intent, dict):
            return
        dirty: set[Key] = set()
        for key, rule in self._rules.items():
            b = rule.boiler
            if key[0] != plan_id or b is None or b.button != container_id or not rule.enabled or b.missing:
                continue
            relay = b.relay_state(self._lookup)
            taken, do, why = b.press(intent, relay, self._now())
            if not taken:
                continue
            b.seen = relay  # a wall switch over the relay: the change behind this intent is no take-over
            if do is not None:
                self._boiler_send(rule, do, why)
            dirty.add(key)
        if dirty:
            self._settle(dirty)
            self._flush()

    def modes(self) -> "dict[str, dict[str, str]]":
        """The boiler modes {plan id: {rule id: 'auto' | 'manual'}} of every loaded boiler rule."""
        out: dict[str, dict[str, str]] = {}
        for (pid, rid), rule in self._rules.items():
            if rule.boiler is not None:
                out.setdefault(pid, {})[rid] = rule.boiler.mode
        return out

    def _report_modes(self) -> None:
        modes = self.modes()
        if modes == self._modes:
            return
        self._modes = modes
        try:
            self._on_modes(copy.deepcopy(modes))
        except Exception:  # noqa: BLE001 - a failing store must not stop the engine
            _LOGGER.exception("saving the boiler modes failed")

    # --- state changes -------------------------------------------------------

    def handle_state(self, entity_id: str, own: bool = False) -> None:
        """own: the change carries any Plan Studio context (a call of any rule). So another rule switching a boiler
        relay is not a take-over of that boiler (a configuration conflict, not a human)."""
        keys = self._readers.get(entity_id)
        if not keys and entity_id not in self._targets:
            return
        for key in self._targets.get(entity_id, ()):
            self._reclose(self._rules[key], entity_id)
        for key in keys or ():
            rule = self._rules[key]
            if rule.boiler is not None and rule.boiler.relay == entity_id:
                self._boiler_relay(rule, own)
        if keys:
            self._settle(set(keys))
        self._resend(entity_id)  # after the inputs: a newer firing has already dropped stale waiting actions
        self._flush()

    def entity_ids(self) -> "set[str]":
        """Inputs of every rule and action targets of enabled rules."""
        return set(self._readers) | set(self._targets)

    # --- live trace ----------------------------------------------------------

    def _trace(self, rule: _Rule) -> dict:
        if not rule.enabled:
            status, reason = "disabled", None
        else:
            reason = rule.static_reason() or rule.failed
            status = "error" if reason else "waiting" if rule.raw is None else "ok"
        out: dict = {"status": status}
        if reason:
            out["reason"] = reason
        out["verdict"] = rule.verdict if rule.enabled else None
        if rule.pending is not None:
            out["pending"] = {"to": rule.pending.to, "at": rule.pending.at}
        out["inputs"] = [dict(t) for t in rule.trace_inputs]
        out["unknownInputs"] = sum(1 for t in rule.trace_inputs if t["value"] is None)
        if rule.gate_trace is not None:
            out["gate"] = dict(rule.gate_trace)
            if rule.enabled and not rule.open and rule.actions():
                out["held"] = True  # the current verdict's actions wait for the gate
        if rule.last is not None:
            out["last"] = dict(rule.last)
        if rule.boiler is not None:
            out["boiler"] = dict(rule.boiler.view)
        if rule.leak:
            out["leak"] = {"valves": [
                {"id": v, "name": name, "state": None if eid is None else
                 {True: "open", False: "closed", None: None}[_valve_open(eid, self._lookup(eid))]}
                for v, name, eid in rule.leak_valves]}
        return out

    def snapshot(self, plan_id: str) -> "dict[str, dict]":
        return {rid: self._trace(r) for (pid, rid), r in self._rules.items() if pid == plan_id}

    def _flush(self) -> None:
        self._report_modes()
        frames: dict[str, dict[str, dict]] = {}
        for key, rule in self._rules.items():
            trace = self._trace(rule)
            if trace != self._published.get(key):
                self._published[key] = trace
                frames.setdefault(key[0], {})[key[1]] = trace
        for pid, rules in frames.items():
            self._notify(pid, False, rules)

    def subscribe(self, plan_id: str, cb: Callback) -> Callable[[], None]:
        """cb(full, rules) on every reload (full) and every trace change (partial); send the first snapshot yourself."""
        self._subs.setdefault(plan_id, []).append(cb)

        def unsubscribe() -> None:
            self._drop(plan_id, cb)

        return unsubscribe

    def _drop(self, plan_id: str, cb: Callback) -> None:
        subs = self._subs.get(plan_id)
        if subs and cb in subs:
            subs.remove(cb)
            if not subs:
                del self._subs[plan_id]

    def _notify(self, plan_id: str, full: bool, rules: "dict[str, dict]") -> None:
        for cb in list(self._subs.get(plan_id, ())):
            try:
                cb(full, copy.deepcopy(rules))
            except Exception:  # noqa: BLE001 - one bad subscriber must not stop the others
                _LOGGER.exception("rule subscriber failed; dropping it")
                self._drop(plan_id, cb)
