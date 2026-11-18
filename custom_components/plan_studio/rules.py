"""Condition rules: three-valued verdicts, debounce and edge actions over all saved plans. Must not import homeassistant."""

from __future__ import annotations

import copy
import json
import logging
import math
from datetime import date, datetime, time, timedelta, timezone, tzinfo
from typing import Callable

try:
    from . import daylight
    from .announce import KINDS as ANNOUNCE, call as announcement
    from .beurer import Beurer
    from .boiler import MODES, Boiler, watts
    from .control import ECHO, EVENTS, Control
    from .expected import expect
    from .motion_light import MotionLight
    from .outside import Outside
    from .timed import Timed
    from .virtual import device_id as virtual_device
except ImportError:  # pytest: module dir on sys.path
    import daylight
    from announce import KINDS as ANNOUNCE, call as announcement
    from beurer import Beurer
    from boiler import MODES, Boiler, watts
    from control import ECHO, EVENTS, Control
    from expected import expect
    from motion_light import MotionLight
    from outside import Outside
    from timed import Timed
    from virtual import device_id as virtual_device

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
    "virtual_switch": "control",
}
ON_OFF_DETAIL = {"leak_sensor": ("wet", "dry"), "motion_sensor": ("motion", "clear")}
ON_OFF_TARGETS = {"ceiling_light", "wall_light", "socket", "exhaust_fan", "virtual_switch"}
# virtual: the synthetic virtual.<device id> of a virtual switch, switched by the live runtime itself (virtual.py)
CONTROL_DOMAINS = {"light", "switch", "fan", "virtual"}
VALVE_SERVICES = {
    ("valve", "open"): "open_valve",
    ("valve", "close"): "close_valve",
    ("switch", "open"): "turn_on",
    ("switch", "close"): "turn_off",
}
# static error reasons, most important first
STATIC_REASONS = ("cycle", "device missing", "rule missing", "target missing")
WAITING = "waiting for target"
NOT_CONFIRMED = "not confirmed"  # the device never reached the state of a command (live.py gives it up)
LOOP = "virtual switch loop"  # a virtual switch refused the command: it changed too fast (live.py, virtual.Breaker)
ON_WAY = 10  # s an unconfirmed on of a shared device counts as on its way
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
    """A rule input, the gate or a held source; type device, rule, light, daylight, sun, time, held, vent or power."""

    def __init__(self, raw: dict, devices: dict, rule_names: dict) -> None:
        src = raw.get("source") if isinstance(raw.get("source"), dict) else {}
        self.negate = raw.get("not") is True
        self.cyclic = self.missing = False
        self.rule: str | None = None
        self.kind = self.eid = None
        self.did: str | None = None  # daylight: the illuminance sensor
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
        self.lost: float | None = None  # power: epoch s the data was lost; None while the data is good
        self.had = False  # power: a good reading was seen since the rule started
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
        elif isinstance(src.get("power"), dict):
            # the Beurer heater's synthetic input: the device's Power binding above a threshold (not offered elsewhere)
            self.type = "power"
            p = src["power"]
            did = p.get("device") if isinstance(p.get("device"), str) else ""
            device = devices.get(did)
            self.eid = _bound(device, "power") if device is not None else None
            self.missing = device is None or self.eid is None
            self.label = _label(device, did)
            self.above = float(p["above"]) if isinstance(p.get("above"), (int, float)) else 0.0
            self.keep = p["keep"] if type(p.get("keep")) is int and p["keep"] >= 0 else 0
            self.sig = ("power", did, self.eid, self.above, self.keep)
            self.reads = [self.eid] if self.eid else []
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
        elif "daylight" in src:
            # the sensor's debounced state is shared by every input reading it (RuleEngine._days)
            self.type = "daylight"
            self.did = src["daylight"] if isinstance(src["daylight"], str) else ""
            device = devices.get(self.did)
            self.missing = device is None
            self.label = _label(device, self.did)
            self.kind = _kind(device) if device is not None else None
            self.want = src.get("is") if src.get("is") in ("night", "dark", "day") else "night"
            self.reads = daylight.entities(device) if self.kind == "illuminance_sensor" else []
            self.sig = ("daylight", self.did, self.want)
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
        self.was, self.lost, self.had = old.was, old.lost, old.had

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
        self.call = _target(device, self.do)  # None for an announcement: it switches nothing
        # say / play / notify: its one-shot call (announce.py); None when its device cannot take it
        self.announce = announcement(device, raw) if self.do in ANNOUNCE else None

    def missing(self) -> bool:
        """The target cannot take the action ("target missing")."""
        return self.call is None and self.announce is None


class _Sent:
    """One action of a rule's latest firing that has a target entity."""

    def __init__(self, action: _Action, entry: dict) -> None:
        self.action, self.entry = action, entry
        self.waiting: str | None = None  # "target unavailable" / "service failed" while waiting for the target
        self.attempt = 0  # a late failure counts only for the latest send of this action


class _Hold:
    """The arbitrated command of one shared on / off device (the latest one sent for it by any participant): sent
    through the action path and waiting for the device while it is unavailable or the call failed."""

    def __init__(self) -> None:
        self.cmd = "off"
        self.entry: dict = {}  # the trace entry of the rule that sent it
        self.by: Key | None = None  # the rule whose trace shows its failure
        self.waiting: str | None = None  # "target unavailable" / "service failed"
        self.attempt = 0  # a late failure or a held call counts only for the latest attempt
        self.confirmed = True  # the device has read `cmd` since it was sent (False: still on its way)
        self.sent_at = 0.0  # epoch s of the latest send
        self.owed: Key | None = None  # an off of this rule was not sent because others kept the device on
        self.label = ""  # the device name for an owed off


class _Command:
    """The engine's latest command to one entity, until the entity reads its state (see RuleEngine._command). kind
    tells how its sender decides (still_wants): "slot" (an arbitrated command; token: the hold and its attempt),
    "action" (a firing's action; token: the rule and its firing seq), "control" (a load control event's direct
    command; decided by the rule's latest event), "boiler" (a boiler button command; token: the boiler's ident and its
    send count), "press" (a light motion control button command; token: the light's ident and the press count),
    "release" (the safety off of the relay of a boiler rule gone while auto); None: never sent again (a power-cycle
    off, the final command of a timed run whose rule went away). since: the send counts of the boiler rules on the
    entity when it was sent (a press of one of them since makes a release unwanted)."""

    __slots__ = ("by", "entry", "state", "kind", "token", "since")

    def __init__(self, by: "Key | None", entry: "dict | None", state: "str | None", kind: "str | None",
                 token: object, since: "dict[Key, int]") -> None:
        self.by, self.entry, self.state, self.kind, self.token = by, entry, state, kind, token
        self.since = since


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
        timed = raw.get("timed")
        self.timed: Timed | None = None
        self.timed_actions: dict[str, _Action] = {}  # timed: the device's "on" and "off" actions
        if isinstance(timed, dict):
            did = timed.get("device") if isinstance(timed.get("device"), str) else ""
            self.timed_actions = {do: _Action({"device": did, "do": do}, devices) for do in ("on", "off")}
            call = self.timed_actions["on"].call
            self.timed = Timed(timed, devices, call[2] if call is not None else None)
        outside = raw.get("outside")
        self.outside: Outside | None = None
        if isinstance(outside, dict):
            light = outside.get("light") if isinstance(outside.get("light"), str) else ""
            call = _Action({"device": light, "do": "on"}, devices).call
            self.outside = Outside(outside, devices, call[2] if call is not None else None)
        motion = raw.get("motionLight")
        self.motion_light: MotionLight | None = None
        if isinstance(motion, dict):
            light = motion.get("light") if isinstance(motion.get("light"), str) else ""
            call = _Action({"device": light, "do": "on"}, devices).call
            # the blocker is read as a device input: its kind's input role must be bound
            b = motion.get("blocker") if isinstance(motion.get("blocker"), dict) else {}
            blocker = devices.get(b.get("device")) if isinstance(b.get("device"), str) else None
            read = _bound(blocker, INPUT_ROLE.get(_kind(blocker) or "")) if blocker is not None else None
            self.motion_light = MotionLight(motion, devices, call[2] if call is not None else None, read)
        beurer = raw.get("beurer")
        self.beurer: Beurer | None = None
        if isinstance(beurer, dict):
            heater = beurer.get("heater") if isinstance(beurer.get("heater"), str) else ""
            call = _Action({"device": heater, "do": "on"}, devices).call
            source = devices.get(beurer.get("source")) if isinstance(beurer.get("source"), str) else None
            power = _bound(source, "power") if source is not None else None
            self.beurer = Beurer(beurer, devices, call[2] if call is not None else None, power)
        control = raw.get("control")
        self.control: Control | None = None
        self.control_actions: dict[str, list[_Action]] = {}  # per event kind; a toggle resolves through the on call
        self.control_devices: list[tuple[str, str, str | None, bool]] = []  # (id, label, entity, is a valve), once
        if isinstance(control, dict):
            self.control = Control(control, devices)
            for kind, actions in self.control.actions.items():
                self.control_actions[kind] = []
                for raw_action in actions:
                    did, do = raw_action["device"], raw_action["do"]
                    a = _Action({"device": did, "do": "on"} if do == "toggle" else raw_action, devices)
                    a.do = do
                    self.control_actions[kind].append(a)
                    # an announcement switches nothing: no device state to follow
                    if do not in ANNOUNCE and all(d[0] != did for d in self.control_devices):
                        valve = _valve_entity(devices.get(did))
                        eid = valve or (a.call[2] if a.call is not None else None)
                        self.control_devices.append((did, a.label, eid, valve is not None))
        leak = raw.get("leak")
        sensors = [x for x in leak.get("sensors") or [] if isinstance(x, str)] if isinstance(leak, dict) else []
        valves = [x for x in leak.get("valves") or [] if isinstance(x, str)] if isinstance(leak, dict) else []
        self.leak = isinstance(leak, dict)
        if self.leak:
            self.mode = "any"  # ruling A3: a dead sensor must not block a leak
        # a leak rule is the same machinery over its own inputs and actions: the wet sensors close the valves
        self.seen: dict[str, "str | None"] = {}  # leak: valve entity -> its state string as of its last state change
        self.leak_valves = [(v, _label(devices.get(v), v), _valve_entity(devices.get(v))) for v in valves]
        if self.leak:
            raw_inputs = [{"source": {"device": s}} for s in sensors]
        elif isinstance(vent, dict):
            raw_inputs = [{"source": {"vent": vent}}]
        elif self.outside is not None:
            raw_inputs = self.outside.inputs()
        elif self.motion_light is not None:
            raw_inputs = self.motion_light.inputs()
        elif self.beurer is not None:
            raw_inputs = [self.beurer.input()]
        elif self.control is not None:
            raw_inputs = self.control.inputs  # its non-button sources; the buttons come through on_intent
        else:
            raw_inputs = raw.get("inputs") or []
        self.inputs = [_Input(i, devices, rule_names) for i in raw_inputs if isinstance(i, dict)]
        self.gate = _Input(raw["gate"], devices, rule_names) if isinstance(raw.get("gate"), dict) else None
        self.all_inputs = self.inputs + ([self.gate] if self.gate is not None else [])
        on_true = [{"device": v, "do": "close"} for v in valves] if self.leak else raw.get("onTrue") or []
        on_false = raw.get("onFalse") or []
        if self.outside is not None:  # the light is held on while the rule wants it on (holder slots)
            light = self.outside.light or ""
            on_true, on_false = [{"device": light, "do": "on"}], [{"device": light, "do": "off"}]
        if self.motion_light is not None:  # the light is held on while the rule wants it on in auto (holder slots)
            light = self.motion_light.light or ""
            on_true, on_false = [{"device": light, "do": "on"}], [{"device": light, "do": "off"}]
        if self.beurer is not None:  # the heater is held on while the source is in use (holder slots)
            heater = self.beurer.heater or ""
            on_true, on_false = [{"device": heater, "do": "on"}], [{"device": heater, "do": "off"}]
        if self.control is not None:  # direct commands, not actions: never re-sent, no holder slots
            on_true, on_false = [], []
        self.on_true = [_Action(a, devices) for a in on_true if isinstance(a, dict)]
        self.on_false = [_Action(a, devices) for a in on_false if isinstance(a, dict)]
        # Shared devices (spec timed switch §10): the on / off devices this rule keeps on by its own state. A condition
        # (or vent) rule holds a device it switches on when true and off when false while its verdict is true; a
        # non-inverted timed switch holds its device while running; a boiler holds its relay while auto heats.
        ons = {a.call[2] for a in self.on_true if a.call is not None and a.do == "on"}
        offs = {a.call[2] for a in self.on_false if a.call is not None and a.do == "off"}
        self.pairs: set[str] = set() if self.leak else ons & offs
        if self.timed is not None and not self.timed.invert and self.timed.eid is not None:
            self.pairs = {self.timed.eid}
        if self.boiler is not None and self.boiler.relay is not None:
            self.pairs = {self.boiler.relay}
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
        self.acted: dict | None = None  # load control: the event whose actions `entries` are
        self.sent: list[_Sent] = []  # its actions with a target, while that firing is the latest one
        self.open = self.timed is not None  # the gate (always open without one) as of the last evaluation
        # announcements: per input its last known value (after NOT; kept through no data) and those values as of the
        # latest verdict change; real: that change came from an input moving between two known values (RuleEngine._real)
        self.known: list[bool | None] = [None] * len(self.inputs)
        self.basis: list[bool | None] = [None] * len(self.inputs)
        self.real = False
        # derived on every evaluation
        self.raw: bool | None = None
        self.trace_inputs: list[dict] = []
        self.gate_trace: dict | None = None

    def adopt(self, old: "_Rule") -> None:
        self.verdict, self.pending, self.last, self.failed = old.verdict, old.pending, old.last, old.failed
        self.seq, self.entries, self.sent, self.open = old.seq, old.entries, old.sent, old.open
        self.seen, self.acted = dict(old.seen), old.acted
        self.known, self.basis, self.real = list(old.known), list(old.basis), old.real
        if self.outside is not None and old.outside is not None:
            old.outside.stop()
            self.outside.take(old.outside)
        if self.beurer is not None and old.beurer is not None:
            old.beurer.stop()
            self.beurer.take(old.beurer)
        if self.control is not None and old.control is not None:
            self.control.take(old.control)
        for new, prev in zip(self.all_inputs, old.all_inputs):
            prev.stop()
            new.take(prev)

    def cancel(self) -> None:
        if self.pending is not None:
            self.pending.cancel()
            self.pending = None

    def stop(self) -> None:
        """Cancel every timer: the debounce, the time / held inputs, the boiler's, the timed run's, the pause's, the
        auto-return's and the power-cycle's."""
        self.cancel()
        if self.outside is not None:
            self.outside.stop()
        if self.motion_light is not None:
            self.motion_light.stop()
        if self.beurer is not None:
            self.beurer.stop()
        for i in self.all_inputs:
            i.stop()
        if self.boiler is not None:
            self.boiler.stop()
        if self.timed is not None:
            self.timed.stop()

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
        if any(a.missing() for a in self.on_true + self.on_false):
            found.add("target missing")
        if any(a.missing() for actions in self.control_actions.values() for a in actions):
            found.add("target missing")
        if any(x is not None and x.missing for x in (self.boiler, self.timed, self.outside, self.beurer, self.control, self.motion_light)):
            found.add("device missing")
        if self.control is not None and self.control.lost:
            found.add("rule missing")
        return next((r for r in STATIC_REASONS if r in found), None)

    def event_kind(self) -> str | None:
        """The kind whose events this rule gives to Load control event sources (control.EVENTS), None for no events."""
        return "boiler" if self.boiler is not None else "motionLight" if self.motion_light is not None else None


def _delay(v: object) -> int:
    return v if type(v) is int and v > 0 else 0


def _epoch(v: object) -> bool:
    return type(v) in (int, float) and math.isfinite(v)


def _stamps(stored: object) -> "dict[str, dict[str, float]]":
    """The stored {plan id: {rule id: epoch s}} without malformed entries and empty plans."""
    kept = {
        pid: {rid: float(u) for rid, u in rs.items() if _epoch(u)}
        for pid, rs in stored.items() if isinstance(rs, dict)
    } if isinstance(stored, dict) else {}
    return {pid: rs for pid, rs in kept.items() if rs}


def _manual_modes(stored: object) -> "dict[str, dict[str, dict]]":
    """The stored {plan id: {rule id: {mode, since, by}}} of motion light rules in manual, without malformed entries.
    "by" is None for a record without "by": "button" (0.22.0 entered manual on a switch elsewhere): never restored."""
    out: dict[str, dict[str, dict]] = {}
    for pid, rs in stored.items() if isinstance(stored, dict) else ():
        kept = {
            rid: {"mode": "manual", "since": float(v["since"]) if _epoch(v.get("since")) else None,
                  "by": "button" if v.get("by") == "button" else None}
            for rid, v in rs.items() if isinstance(v, dict) and v.get("mode") == "manual"
        } if isinstance(rs, dict) else {}
        if kept:
            out[pid] = kept
    return out


class RuleEngine:
    def __init__(
        self,
        lookup: Lookup,
        now: Callable[[], float],
        # call(domain, service, entity_id, on_error=cb(str), current=() -> bool, by=rule key); an announcement adds
        # data=its service data (entity_id None for a notify) and is never held until HA has started
        call: Callable[..., None],
        schedule: Callable[[float, Callable[[], None]], Callable[[], None]],
        *,
        local: "Callable[[float], datetime]" = lambda t: datetime.fromtimestamp(t, timezone.utc),
        changed_at: "Callable[[str], float | None]" = lambda eid: None,
        on_modes: "Callable[[dict[str, dict[str, str]]], None]" = lambda modes: None,
        on_runs: "Callable[[dict[str, dict[str, float]]], None]" = lambda runs: None,
        on_pauses: "Callable[[dict[str, dict[str, float]]], None]" = lambda pauses: None,
        on_motion_modes: "Callable[[dict[str, dict[str, dict]]], None]" = lambda modes: None,
        reports: "Callable[[str], tuple[float | None, float | None]]" = lambda eid: (None, None),
    ) -> None:
        self._lookup = lookup
        self._now = now  # epoch seconds
        self._call = call
        self._schedule = schedule
        self._local = local  # epoch seconds -> aware datetime in the HA time zone
        self._changed_at = changed_at  # entity id -> epoch seconds of its HA last_changed
        self._reports = reports  # entity id -> (its latest report epoch s, its report period s), None for unknown
        self._started = False  # the first load_plans is the HA start
        self._rules: dict[Key, _Rule] = {}
        self._order: dict[Key, int] = {}  # referenced rules before their consumers
        self._consumers: dict[Key, list[Key]] = {}
        self._listeners: dict[Key, list[Key]] = {}  # purpose-built rule -> the Load control rules with its events as sources
        self._readers: dict[str, list[Key]] = {}
        self._targets: dict[str, list[Key]] = {}  # action target entity -> enabled rules
        self._published: dict[Key, dict] = {}
        self._subs: dict[str, list[Callback]] = {}
        self._on_modes = on_modes  # the boiler modes {plan id: {rule id: mode}} after any of them changed
        self._modes: dict[str, dict[str, str]] = {}  # the modes last reported (or loaded)
        self._on_runs = on_runs  # the timed runs {plan id: {rule id: until epoch s}} after any of them changed
        self._runs: dict[str, dict[str, float]] = {}  # the runs last reported (or loaded)
        self._on_pauses = on_pauses  # the outside light pauses {plan id: {rule id: end epoch s}} after any changed
        self._pauses: dict[str, dict[str, float]] = {}  # the pauses last reported (or loaded)
        self._on_motion_modes = on_motion_modes  # the motion light rules in manual {plan id: {rule id: {mode, since, by}}}
        self._motion_modes: dict[str, dict[str, dict]] = {}  # the manual modes last reported (or loaded)
        self._booting = False  # a boot load happened and started() has not come yet: boiler auto waits
        self._starting = False  # inside started(): the restored state's first evaluation still gives no rule events
        self._holds: dict[str, _Hold] = {}  # shared device entity -> its arbitrated command
        self._loading = False  # inside load_plans: arbitrated calls wait for the end of the load
        self._deferred: list[str] = []  # the shared devices commanded in this load, called once at its end
        self._days: dict[tuple[str, str], daylight.Daylight] = {}  # (plan id, sensor id) -> its debounced daylight
        self._day_reads: dict[str, list[tuple[str, str]]] = {}  # entity -> the daylights reading it
        self._day_rules: dict[tuple[str, str], list[Key]] = {}  # daylight -> the rules reading it
        # load control: per entity the changes its commands are expected to make (state, expires epoch s), in send order
        self._echoes: dict[str, list[tuple[str, float]]] = {}
        self._trigger: str | None = None  # the entity whose state change is being settled (handle_state)
        self._echo: bool | None = None  # whether that change is a load control command arriving; None: not asked yet
        # per entity the engine's latest command until the entity reads the commanded state, see _command
        self._commands: dict[str, _Command] = {}

    # --- loading -------------------------------------------------------------

    def load_plans(
        self, plans: "list[dict]", *, boot: "bool | None" = None, modes: "dict | None" = None,
        runs: "dict | None" = None, pauses: "dict | None" = None, motion_modes: "dict | None" = None,
        unload: bool = False,
    ) -> None:
        """boot: True when this load is the HA start; None keeps "the first call is the start".
        modes: the stored boiler modes {plan id: {rule id: 'auto' | 'manual'}}, used for boiler rules not loaded yet.
        runs: the stored timed runs {plan id: {rule id: until epoch s}}, restored for timed rules not loaded yet.
        pauses: the stored outside light pauses {plan id: {rule id: end epoch s}}, restored likewise.
        motion_modes: the stored motion light rules in manual {plan id: {rule id: {mode, since, by}}}, restored likewise
            (only a record with "by": "button").
        unload: the integration stops: no device is switched (boiler relays and running timed devices stay as they are;
        the modes and runs are restored on the next start)."""
        old = self._rules
        if modes is not None:
            self._modes = {
                pid: {rid: m for rid, m in ms.items() if m in MODES}
                for pid, ms in modes.items() if isinstance(ms, dict)
            } if isinstance(modes, dict) else {}
        if runs is not None:
            self._runs = _stamps(runs)
        if pauses is not None:
            self._pauses = _stamps(pauses)
        if motion_modes is not None:
            self._motion_modes = _manual_modes(motion_modes)
        first, self._started = not self._started, True
        if boot is None:
            boot = first
        if boot:
            self._booting = True
        stopped: list[_Rule] = []  # boiler rules disabled while auto whose last command was on
        ended: list[_Rule] = []  # timed rules disabled while running
        rules: dict[Key, _Rule] = {}
        adopted: dict[Key, bool] = {}  # whether each loaded rule kept the state of an unchanged old one
        sensors: dict[tuple[str, str], dict] = {}  # the illuminance sensors read by daylight inputs
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
                adopted[rule.key] = prev is not None and prev.sig == rule.sig
                if adopted[rule.key]:
                    rule.adopt(prev)
                else:
                    if prev is not None:
                        prev.stop()
                    for i in rule.all_inputs:
                        i.boot = boot
                if rule.boiler is not None and self._load_boiler(rule, prev, modes):
                    stopped.append(rule)
                if rule.timed is not None and self._load_timed(rule, prev, runs):
                    ended.append(rule)
                if rule.outside is not None:
                    self._load_outside(rule, prev, pauses)
                if rule.motion_light is not None:
                    self._load_motion(rule, prev, motion_modes)
                if rule.beurer is not None and (prev is None or prev.sig != rule.sig):
                    rule.beurer.seen = rule.beurer.state(self._lookup)  # a new one reads its heater
                rules[rule.key] = rule
                for i in (p for top in rule.all_inputs for p in top.parts()):
                    if i.type == "daylight" and i.kind == "illuminance_sensor":
                        sensors[(pid, i.did)] = devices[i.did]
        for key, prev in old.items():
            if key not in rules:
                prev.stop()
        self._load_days(sensors)
        released = [] if unload else self._released_relays(old, rules)
        finished = [] if unload else self._released_runs(old, rules)
        self._rules = rules
        self._link()
        for dk in self._days:
            self._day_read(dk)
        for rule in rules.values():
            for _, _, eid in rule.leak_valves:
                if eid is not None and eid not in rule.seen:
                    st = self._lookup(eid)
                    rule.seen[eid] = st[0] if st is not None else None
            c = rule.control
            if c is not None and adopted.get(rule.key):
                # A guard that does not depend on the evaluation order of the load (its settle already records the new value with events off).
                for k, i in enumerate(rule.inputs):  # a referenced rule that started anew: its start verdict is no event
                    if i.type == "rule" and not adopted.get((rule.key[0], i.rule or "")):
                        c.forget(k)
        # Within a load every shared device gets one command, its final state (no flick between rules starting at
        # once); the releases come after the new rules were evaluated, so a rule that keeps the device on is known.
        self._loading = True
        try:
            self._settle(set(rules))
            for rule in stopped:
                self._boiler_auto(rule, rule.boiler.command("off", self._now()), "rule disabled")
            for relay in released:
                if not self._holders(relay) and relay not in self._deferred:  # kept on, or commanded in this load
                    self._release(relay)
            for rule in ended:
                self._timed_send(rule, rule.timed.final, "rule disabled")
            for t in finished:
                if t.eid not in self._deferred:
                    self._finish(t)
            self._pay_offs()
        finally:
            self._loading = False
        deferred, self._deferred = self._deferred, []
        for eid in deferred:
            if eid in self._holds:
                self._hold_call(eid, self._holds[eid])
        for rule in rules.values():
            if rule.beurer is not None and rule.enabled and not self._booting:
                self._beurer_step(rule)  # after the load's calls: a cycle's off comes after a start's on
        self._prune_holds()
        self._published = {key: self._trace(r) for key, r in rules.items()}
        for pid in list(self._subs):
            self._notify(pid, True, self.snapshot(pid))
        self._report_modes()
        self._report_runs()
        self._report_pauses()
        self._report_motion_modes()

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
            self._command(relay.split(".", 1)[0], "turn_off", relay, by=None, entry=None, kind="release", token=None,
                          on_error=on_error)
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

    def _load_timed(self, rule: _Rule, prev: "_Rule | None", runs: "dict | None") -> bool:
        """Keep the run of the same timed switch (button, device and invert unchanged); a timed rule not loaded yet
        takes its stored run. True when the rule was disabled while running: its final command is sent."""
        t = rule.timed
        assert t is not None
        old = prev.timed if prev is not None else None
        if old is not None and old.ident == t.ident:
            old.stop()
            t.take(old)
            rule.last, rule.failed = prev.last, prev.failed
            rule.seq, rule.entries, rule.sent = prev.seq, prev.entries, prev.sent
            if prev.enabled and not rule.enabled and t.running:
                t.until, t.restored = None, False
                return True
            return False
        t.seen = t.state(self._lookup)
        stored = self._runs.get(rule.key[0], {}).get(rule.key[1]) if prev is None and runs is not None else None
        if stored is not None and rule.enabled and t.eid is not None:
            # evaluated once the boot phase is over (started()); with its button gone it ends with the final command
            t.restore(stored, t.seen)
        return False

    def _load_outside(self, rule: _Rule, prev: "_Rule | None", pauses: "dict | None") -> None:
        """A new outside rule reads its light; one not loaded yet takes its stored pause (a changed Save starts over
        without a pause). An unchanged one kept its state in adopt()."""
        o = rule.outside
        assert o is not None
        if prev is not None and prev.sig == rule.sig:
            return
        o.seen = o.state(self._lookup)
        stored = self._pauses.get(rule.key[0], {}).get(rule.key[1]) if prev is None and pauses is not None else None
        if stored is not None and rule.enabled:
            o.restore(stored)  # evaluated once the boot phase is over (started())

    def _load_motion(self, rule: _Rule, prev: "_Rule | None", motion_modes: "dict | None") -> None:
        """Keep the mode of the same motion light rule (light entity and buttons unchanged; a changed Save ends a wait for
        new motion and takes the blocker and the daylight anew, without a change); one not loaded yet takes its stored
        mode when it has a button (without one it is always in auto); any other one starts in auto."""
        m = rule.motion_light
        assert m is not None
        old = prev.motion_light if prev is not None else None
        if old is not None and old.ident == m.ident:
            old.stop()
            m.take(old)
            rule.last, rule.failed = prev.last, prev.failed
            if prev.sig != rule.sig:
                m.waiting = False  # the rule starts anew: it takes the light as it is
                m.blocked = m.met = None
                m.day_off = False
            return
        m.seen = m.state(self._lookup)
        stored = self._motion_modes.get(rule.key[0], {}).get(rule.key[1]) if prev is None and motion_modes is not None else None
        if stored is not None and stored["by"] == "button" and m.buttons:
            m.restore(stored["mode"], stored["since"])  # evaluated once the boot phase is over (started())

    def _released_runs(self, old: "dict[Key, _Rule]", rules: "dict[Key, _Rule]") -> "list[Timed]":
        """Running timed switches that lose their run in this load (rule deleted, no longer timed, or its button,
        device or invert changed): their old device gets the final command."""
        out: list[Timed] = []
        for key, prev in old.items():
            t = prev.timed
            if t is None or not t.running or not prev.enabled or t.eid is None:
                continue
            now = rules.get(key)
            if now is not None and now.timed is not None and now.timed.ident == t.ident:
                continue  # run carried over
            out.append(t)
        return out

    def _finish(self, t: Timed) -> None:
        """Send the final command of a run whose rule went away to its old device; a failure is only logged."""
        assert t.eid is not None
        t.until = None
        if not t.command(t.final, t.state(self._lookup)) or (not t.invert and self._holders(t.eid)):
            return  # already there, or another automation keeps it on

        def on_error(err: str, why: str = "service failed") -> None:
            _LOGGER.warning("timed switch %s: turn_%s failed: %s", t.eid, t.final, err)

        try:
            self._command(t.eid.split(".", 1)[0], f"turn_{t.final}", t.eid, by=None, entry=None, kind=None, token=None,
                          on_error=on_error)
        except Exception as err:  # noqa: BLE001 - a failing device must not stop the engine
            _LOGGER.warning("timed switch %s: turn_%s failed: %s", t.eid, t.final, err)

    def _load_days(self, sensors: "dict[tuple[str, str], dict]") -> None:
        """An unchanged sensor (bindings and thresholds) keeps its state and pending change; a changed one starts over
        (its first raw state is accepted at once); one no rule reads any more is dropped. Timers are cancelled."""
        days: dict[tuple[str, str], daylight.Daylight] = {}
        for dk, device in sensors.items():
            prev, new = self._days.get(dk), daylight.Daylight(device)
            if prev is not None and prev.sig == new.sig:
                prev.device = device
                days[dk] = prev
            else:
                if prev is not None:
                    prev.stop()
                days[dk] = new
        for dk, prev in self._days.items():
            if days.get(dk) is not prev:
                prev.stop()
        self._days = days

    def _day_read(self, dk: "tuple[str, str]") -> None:
        """Take the sensor's current raw state; a change that has to hold arms the sensor's one timer."""
        d = self._days[dk]
        if d.step(*daylight.raw_state(d.device, self._lookup), self._now()):
            due = d.due
            d.cancel = self._schedule(max(0.0, due - self._now()), lambda: self._day_due(dk, d, due))

    def _day_due(self, dk: "tuple[str, str]", d: daylight.Daylight, due: float) -> None:
        """A pending daylight change has held: every rule reading the sensor sees it at once."""
        if self._days.get(dk) is not d or d.due != due:
            return
        d.accept()
        self._settle(set(self._day_rules.get(dk, ())))
        self._flush()

    def _link(self) -> None:
        """Order rules so references come first; a reference closing a cycle is marked and ignored."""
        self._order, self._consumers, self._readers, self._targets = {}, {}, {}, {}
        self._day_reads, self._day_rules, self._listeners = {}, {}, {}
        for dk, d in self._days.items():
            for eid in d.eids:
                self._day_reads.setdefault(eid, []).append(dk)
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
            timed = [rule.timed.eid] if rule.timed is not None and rule.timed.eid else []
            if rule.outside is not None and rule.outside.eid:
                timed.append(rule.outside.eid)  # its light: a manual switch pauses the rule
            if rule.motion_light is not None and rule.motion_light.eid:
                timed.append(rule.motion_light.eid)  # its light: switched on / off elsewhere
            if rule.beurer is not None and rule.beurer.eid:
                timed.append(rule.beurer.eid)  # its heater: switched off elsewhere, the power-cycle
            # load control: its devices only so the trace follows them (its input sources are in `reads`)
            timed += [eid for _, _, eid, _ in rule.control_devices if eid]
            for eid in reads + (rule.boiler.reads if rule.boiler is not None else []) + timed:
                if key not in self._readers.get(eid, []):
                    self._readers.setdefault(eid, []).append(key)
            for i in (p for top in rule.all_inputs for p in top.parts()):
                dk = (key[0], i.did or "")
                if i.type == "daylight" and dk in self._days and key not in self._day_rules.get(dk, []):
                    self._day_rules.setdefault(dk, []).append(key)
            actions = rule.on_true + rule.on_false + list(rule.timed_actions.values())
            for a in actions if rule.enabled else []:
                if a.call is not None and key not in self._targets.get(a.call[2], []):
                    self._targets.setdefault(a.call[2], []).append(key)
            if rule.control is not None:  # its event sources: a rule of the plan that gives that event
                rule.control.lost = False
                for rid, what in rule.control.events:
                    ref = self._rules.get((key[0], rid))
                    if ref is None or what not in EVENTS.get(ref.event_kind() or "", ()):
                        rule.control.lost = True
                    elif key not in self._listeners.get(ref.key, []):
                        self._listeners.setdefault(ref.key, []).append(key)

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
        rule.known = [k if v is None else v for v, k in zip(values, rule.known)]
        # an input unknown at the previous verdict change takes its first known value as its basis: arriving is no
        # change, its next move is
        rule.basis = [k if b is None else b for b, k in zip(rule.basis, rule.known)]
        if rule.outside is not None:
            rule.raw = rule.outside.want(values)
        elif rule.motion_light is not None:
            m = rule.motion_light
            dropping = m.dropped is not None and self._now() < m.dropped  # the off of entering auto is on its way
            rule.raw = m.raw(values, (m.state(self._lookup) == "on" and not dropping) or rule.verdict is True)
        else:
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
        if i.type == "daylight" and not i.missing:
            d = self._days.get((rule.key[0], i.did or ""))
            if d is not None and d.due is not None:
                out["until"] = int(d.due * 1000)  # the sensor's pending change (one timer per sensor)
        if i.type == "vent":
            out["vent"] = self._vent_trace(i)
        if i.type == "power":
            w = watts(self._lookup, i.eid) if i.eid else None
            out["watts"] = None if w is None else round(w)
            if wake is not None:
                out["until"] = int(wake * 1000)  # the last value is kept until then
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
        if i.type == "power":
            return self._power(i, now)
        if i.type == "light":
            return (*self._light(i), None)
        if i.type == "daylight":
            d = self._days.get((rule.key[0], i.did or ""))
            return (*(d.trace(i.want, now) if d is not None else (None, "missing")), None)
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

    def _power(self, i: _Input, now: float) -> "tuple[bool | None, str, float | None]":
        """Above the threshold: true. Without data the last value is kept for `keep` minutes from the moment the loss
        was seen (the input wakes the rule then), then it is false; with no good reading since the rule started it is
        unknown."""
        p = watts(self._lookup, i.eid) if i.eid else None
        if p is not None:
            i.prev, i.had, i.lost = p > i.above, True, None
            return i.prev, f"{round(p)} W", None
        if not i.had:
            return None, "no data", None
        if i.lost is None:
            i.lost = now
        until = i.lost + i.keep * 60
        if now < until:
            return i.prev, "no data, kept", until
        return False, "no data", None

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
        if rule.control is not None:  # no verdict: its sources' changes are events
            self._control_evaluate(rule)
            rule.raw = rule.verdict = None
            return False
        if rule.boiler is not None:
            return self._boiler(rule)
        if rule.timed is not None:
            return self._timed(rule)
        if rule.motion_light is not None:
            return self._motion(rule, due)
        self._compute(rule)
        if not rule.enabled:
            return False
        was_open, seq = rule.open, rule.seq
        rule.open = (rule.gate_trace is None or rule.gate_trace["value"] is True) and not self._paused(rule)
        changed = self._step(rule, due)
        actions = rule.actions()
        if rule.open and not was_open and rule.seq == seq and actions:
            self._new_firing(rule)
            self._fire(rule, actions, "pause ended" if rule.outside is not None else "gate opened")
        if rule.beurer is not None and not self._booting and not self._loading:
            self._beurer_step(rule)  # in a load: after its calls (load_plans); at HA start: after started()
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
        if rule.motion_light is not None and not raw:  # not before the minimum on time since its on decision
            delay = rule.motion_light.off_delay(self._now(), delay)
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
        """A new verdict (also at rule start, both ways); its actions wait while the gate is closed. Its announcements
        run only for a real change (_real) when it became true / false: never at the start or a gate opening."""
        rule.verdict = verdict
        rule.real = self._real(rule)
        rule.basis = list(rule.known)
        # A new verdict ends the previous firing, also without actions: its held calls are stale and its waiting
        # actions are given up (their error shows why they did not get through).
        self._new_firing(rule)
        if rule.open:
            self._fire(rule, rule.actions(), why, announce=rule.real and why in ("became true", "became false"))

    def _real(self, rule: _Rule) -> bool:
        """Whether some input moved between two known values since the previous verdict change (its last known value
        then and now differ); an input that only came back from no data (a slow sensor after HA start, a blip of
        unavailable with the same value) is no change. A rule input counts only when that rule's own latest verdict
        change was real."""
        for i, was, now in zip(rule.inputs, rule.basis, rule.known):
            if was is None or now is None or was == now:
                continue
            if i.type == "rule" and not self._ref_real(rule.key[0], i.rule):
                continue
            return True
        return False

    def _ref_real(self, pid: str, rid: "str | None") -> bool:
        """Whether the referenced rule's latest verdict change was real. A timed, boiler or light motion control rule
        moves its verdict by presses, timers and the device's state (often outside _commit, by holds that leave the
        input basis behind): always real; known limit: a motion sensor dead longer than the off delay and back reporting
        motion counts as real. Any other kind (condition, vent, leak, outside light, beurer) moves it through _commit by
        its inputs: rule.real."""
        ref = self._rules.get((pid, rid or ""))
        if ref is None:
            return False
        return ref.timed is not None or ref.boiler is not None or ref.motion_light is not None or ref.real

    def _new_firing(self, rule: _Rule) -> None:
        rule.seq += 1
        for s in rule.sent:
            if s.waiting:
                s.entry["error"] = s.waiting
        rule.sent = []

    def _fire(self, rule: _Rule, actions: "list[_Action]", why: str, announce: bool = False) -> None:
        if not announce or self._loading or self._booting or self._starting:
            # an announcement tells of a real verdict change (announce, from _commit): never at the rule's start, a
            # gate opening or a purpose-built rule's step, inside a load (a Save, an entry reload), while HA starts
            # (it would be held and spoken late) or in the restored state's first evaluation (started()); it leaves
            # no entry then
            actions = [a for a in actions if a.do not in ANNOUNCE]
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
            if a.announce is not None:
                self._announce(rule, a, entry, self._refresh)
            elif a.call is None:
                entry["error"] = "target missing"
            elif a.do in ("on", "off") and a.call[2] in rule.pairs:
                self._arbitrated(rule, a.call[2], a.do, entry)
            else:
                sent = _Sent(a, entry)
                rule.sent.append(sent)
                self._send(rule, sent)
        self._refresh(rule)

    def _command(
        self, domain: str, service: str, eid: str, *, by: "Key | None", entry: "dict | None", kind: "str | None",
        token: object, on_error: Callable[..., None], current: Callable[[], bool] = lambda: True,
    ) -> "bool | None":
        """Every command of the engine: the latest one per entity is kept with the rule and the entry it belongs to
        and how its sender decides (kind, token), for still_wants and command_unconfirmed; it replaces an older one,
        whose "not confirmed" goes with it, except to an identical repeat (same sender, same state: the same command
        still not confirmed, e.g. a boiler's safety off every 10 s), whose entry keeps saying so.
        current() is only for a call held until HA has started (live.py)."""
        state, old = expect(domain, service), self._commands.get(eid)
        still = old is not None and old.by == by and old.state == state and old.entry is not None \
            and old.entry.get("error") == NOT_CONFIRMED
        self._unmark(eid)
        if still and entry is not None and "error" not in entry:
            entry["error"] = NOT_CONFIRMED
        since = {r.key: r.boiler.sends for r in self._rules.values() if r.boiler is not None and r.boiler.relay == eid}
        self._commands[eid] = _Command(by, entry, state, kind, token, since)
        return self._call(domain, service, eid, on_error=on_error, current=current, by=by)

    def _unmark(self, eid: str) -> bool:
        """Forget the entity's latest command; True when its entry said "not confirmed" or "virtual switch loop" (that
        error is removed)."""
        cmd = self._commands.pop(eid, None)
        if cmd is None or cmd.entry is None or cmd.entry.get("error") not in (NOT_CONFIRMED, LOOP):
            return False
        del cmd.entry["error"]
        return True

    def _send(self, rule: _Rule, sent: _Sent) -> None:
        """Call one action of the rule's latest firing; an unavailable target or a failed call marks it waiting."""
        seq = rule.seq
        sent.attempt += 1
        attempt = sent.attempt
        sent.waiting = None
        sent.entry.pop("error", None)
        try:
            held = self._command(
                *sent.action.call, by=rule.key, entry=sent.entry, kind="action", token=(rule, seq),
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

    def _announce(self, rule: _Rule, a: _Action, entry: dict, refresh: Callable[[_Rule], None]) -> None:
        """Say / play / notify: one call with its service data, for this firing or event only. Never a holder slot, an
        engine command (_command: no expected state, never sent again by live.py) or a re-send target (rule.sent): a
        speaker whose player has no data gets nothing ("target unavailable"); a failed call says "service failed" on
        its entry (a late one only while this firing / event is the rule's latest; refresh: the rule's own refresh)."""
        assert a.announce is not None
        domain, service, eid, data, player = a.announce
        if player is not None and not _available(self._lookup(player)):
            entry["error"] = "target unavailable"
            return
        seq = rule.seq

        def on_error(err: str, why: str = "service failed") -> None:
            now = self._current(rule, seq)
            if now is None:
                return  # a newer firing or event, a changed or a removed rule
            entry["error"] = "service failed"
            refresh(now)
            self._flush()

        try:
            self._call(domain, service, eid, on_error=on_error, by=rule.key, data=dict(data))
        except Exception as err:  # noqa: BLE001 - one failing announcement must not stop the other actions
            _LOGGER.warning("rule %s: %s.%s %s failed: %s", rule.name, domain, service, eid or "", err)
            entry["error"] = "service failed"

    def _refresh(self, rule: _Rule) -> None:
        """Last action and failure of the latest firing, from its entries and waiting marks."""
        for s in rule.sent:
            if s.waiting:
                s.entry["error"] = WAITING
        marks = {s.waiting for s in rule.sent} | {e.get("error") for e in rule.entries if e.get("action") in ANNOUNCE}
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
        st = self._lookup(entity_id)
        was, now = rule.seen.get(entity_id), st[0] if st is not None else None
        rule.seen[entity_id] = now
        # a change into open (also from opening) or into opening from a non-open state; an attribute update sends nothing
        opened = {"open": was != "open", "opening": was not in ("open", "opening"), "on": was != "on"}
        if not opened.get(now or "", False) or _valve_open(entity_id, st) is not True:
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
            if not any(x.waiting for x in rule.sent):  # an error-first pick of _refresh is kept
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
        hold = self._holds.get(entity_id)
        by = self._rules.get(hold.by) if hold is not None and hold.by is not None else None
        if hold is not None and hold.waiting and by is not None and by.enabled and (by.gate is None or by.open):
            hold.entry["at"] = int(self._now() * 1000)
            self._hold_call(entity_id, hold)

    # --- shared devices ------------------------------------------------------

    def _wants_on(self, rule: _Rule, eid: str) -> bool:
        """Whether the rule currently keeps the shared device on (spec timed switch §10)."""
        if not rule.enabled or eid not in rule.pairs:
            return False
        if rule.timed is not None:
            return rule.timed.running
        if rule.boiler is not None:
            b = rule.boiler
            # a stored auto is not evaluated before HA has started: it keeps the relay as it is until then
            return not b.missing and b.mode == "auto" and (b.phase == "heating" or (self._booting and b.phase is None))
        return rule.open and rule.verdict is True

    def _device_on(self, eid: str) -> bool:
        """The device reads on, or an on is on its way to it: waiting for the device, or sent less than ON_WAY s ago
        and not confirmed yet (an on HA accepted but the device never applied stops counting then)."""
        st = self._lookup(eid)
        if st is not None and st[0] == "on":
            return True
        hold = self._holds.get(eid)
        if hold is None or hold.cmd != "on" or hold.confirmed:
            return False
        return bool(hold.waiting) or self._now() - hold.sent_at < ON_WAY

    def _holders(self, eid: str, but: "Key | None" = None) -> "list[_Rule]":
        """The rules that keep the device on now, in rule order (always computed from their current state)."""
        return [r for r in self._rules.values() if r.key != but and self._wants_on(r, eid)]

    def _arbitrated(self, rule: _Rule, eid: str, do: str, entry: dict) -> None:
        """An on / off command of a participant for a shared device: an off is sent only when no other rule keeps the
        device on (otherwise it is owed until they let go); an on is sent unless the device is on already (or an on is
        on its way) while others keep it on. A command not sent says who keeps the device on (sent: false)."""
        others = self._holders(eid, rule.key)
        if not others or (do == "on" and not self._device_on(eid)):
            self._hold_send(eid, do, rule, entry)
            return
        entry["reason"] = f"{'already' if do == 'on' else 'kept'} on by {', '.join(r.name for r in others)}"
        entry["sent"] = False
        hold = self._holds.setdefault(eid, _Hold())
        if do == "off":
            hold.owed, hold.label = rule.key, entry["target"]
        if hold.waiting and hold.by == rule.key:
            hold.by = others[0].key  # the waiting on is now kept by another rule: its trace shows the wait

    def _hold_send(self, eid: str, do: str, rule: "_Rule | None", entry: dict) -> None:
        """Send the arbitrated command; it replaces a waiting older one (given up, as on a new firing). Inside a load
        the call waits for the end of the load: a later command of the same load replaces it unsent."""
        hold = self._holds.setdefault(eid, _Hold())
        if hold.waiting:
            hold.entry["error"] = hold.waiting
        if self._loading and eid in self._deferred and hold.cmd != do and rule is not None:
            hold.entry["sent"] = False  # replaced unsent within this load
            hold.entry["reason"] = f"kept on by {rule.name}" if do == "on" else f"replaced by {rule.name}"
        hold.cmd, hold.entry, hold.by, hold.waiting = do, entry, rule.key if rule is not None else None, None
        hold.owed = None
        if self._loading:
            hold.confirmed, hold.sent_at = False, self._now()
            if eid not in self._deferred:
                self._deferred.append(eid)
            return
        self._hold_call(eid, hold)

    def _pay_offs(self) -> None:
        """An off that was kept back because others kept the device on is sent once nobody keeps it on any more
        (released, gate closed, disabled, deleted) while the device reads on; a device already off owes nothing."""
        for eid, hold in list(self._holds.items()):
            if hold.owed is None or self._holders(eid):
                continue
            st = self._lookup(eid)
            if st is None or st[0] in ("unknown", "unavailable"):
                continue  # paid when it returns reading on
            if st[0] != "on":
                hold.owed = None
                continue
            rule = self._rules.get(hold.owed)
            entry = {"action": "off", "target": hold.label, "at": int(self._now() * 1000),
                     "reason": "no longer kept on"}
            if rule is not None:
                rule.last, rule.entries, rule.failed = entry, [entry], None
            self._hold_send(eid, "off", rule, entry)

    def _hold_call(self, eid: str, hold: _Hold) -> None:
        hold.attempt += 1
        attempt = hold.attempt
        hold.waiting = None
        hold.entry.pop("error", None)
        st = self._lookup(eid)
        hold.confirmed, hold.sent_at = st is not None and st[0] == hold.cmd, self._now()
        try:
            held = self._command(
                eid.split(".", 1)[0], f"turn_{hold.cmd}", eid, by=hold.by, entry=hold.entry,
                kind="slot", token=(hold, attempt),
                on_error=lambda err, why="service failed": self._hold_failed(eid, hold, attempt, why),
                current=lambda: self._holds.get(eid) is hold and hold.attempt == attempt,
            )
        except Exception as err:  # noqa: BLE001 - one failing target must not stop the others
            _LOGGER.warning("shared device %s: turn_%s failed: %s", eid, hold.cmd, err)
            hold.waiting = "service failed"
        else:
            if held is not True and not _available(self._lookup(eid)):
                hold.waiting = "target unavailable"
        if hold.waiting:
            hold.entry["error"] = WAITING

    def _hold_failed(self, eid: str, hold: _Hold, attempt: int, why: str) -> None:
        if self._holds.get(eid) is not hold or hold.attempt != attempt:
            return
        hold.waiting = "service failed" if "service failed" in (hold.waiting, why) else why
        hold.entry["error"] = WAITING
        self._flush()

    def _give_up(self, eid: str, key: "Key | None" = None) -> None:
        """Stop waiting for the device (only when the rule `key` shows the wait, when given): a human took over or
        the command is stale; the entry keeps why it did not get through."""
        hold = self._holds.get(eid)
        if hold is None or not hold.waiting or (key is not None and hold.by != key):
            return
        hold.entry["error"] = hold.waiting
        hold.waiting = None
        hold.attempt += 1

    def _prune_holds(self) -> None:
        """After a load: a device nobody takes part in any more is forgotten; a waiting command that is no longer
        what the holders want is given up; a waiting one is shown by a rule that still takes part."""
        for eid, hold in list(self._holds.items()):
            parts = [r for r in self._rules.values() if r.enabled and eid in r.pairs]
            holders = [r for r in parts if self._wants_on(r, eid)]
            if not parts or (hold.cmd == "on") != bool(holders):
                self._give_up(eid)
                if not parts:
                    del self._holds[eid]
                continue
            if hold.waiting and hold.by not in {r.key for r in holders or parts}:
                hold.by = (holders or parts)[0].key

    def _hold_reason(self, key: Key) -> "str | None":
        marks = {h.waiting for h in self._holds.values() if h.by == key}
        return next((r for r in ("service failed", "target unavailable") if r in marks), None)

    # --- boiler --------------------------------------------------------------

    def _boiler(self, rule: _Rule) -> bool:
        """Evaluate a boiler rule (auto steps only in auto); True when its verdict (mode is auto) changed."""
        b = rule.boiler
        assert b is not None
        grid, power, relay = b.readings(self._lookup)
        b.until = b.settling = None
        active = rule.enabled and not b.missing
        if active and b.mode == "auto" and not self._booting:  # §9: auto is evaluated once HA has started
            meters = [self._reports(eid) if eid else (None, None) for eid in (b.grid, b.power)]
            do, why = b.auto(self._now(), grid, power, relay, *meters)
            if do is not None:
                # blackout / limit: a safety off (inverter protection), never kept back by other rules
                self._boiler_auto(rule, do, why, safety=b.phase in ("blackout", "limit"))
            if b.refuses_on():
                self._boiler_drop_on(rule, relay)
            if b.mode == "manual":  # heating done: back to manual by itself
                self._rule_event(rule, "done", "manual")
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

    # --- timed switch ----------------------------------------------------------

    def _timed(self, rule: _Rule) -> bool:
        """Evaluate a timed rule: a run past its end sends the final command; a running one keeps its timer. A run
        restored from the store waits for the end of the boot phase. True when its verdict (running) changed."""
        t = rule.timed
        assert t is not None
        rule.open = True
        if (not rule.enabled or t.eid is None) and t.running:
            t.until, t.restored = None, False  # cannot run: disabled (ended on load) or nothing to switch
        if t.running and not (self._booting and t.restored):
            t.restored = False
            if t.missing:  # the button is gone: nothing could stop the run, so it ends now
                t.until = None
                self._timed_send(rule, t.final, "button missing")
            elif t.until <= self._now():
                t.until = None
                self._timed_send(rule, t.final, "time over")
        wake = t.until if t.running and not t.restored else None
        if t.timer is not None and t.timer[0] != wake:
            t.stop()
        if wake is not None and t.timer is None:
            key = rule.key
            t.timer = (wake, self._schedule(max(0.0, wake - self._now()), lambda: self._timed_wake(key, t)))
        verdict = t.running if rule.enabled else None
        rule.raw = verdict
        changed = verdict != rule.verdict
        rule.verdict = verdict
        return changed

    def _timed_wake(self, key: Key, t: Timed) -> None:
        rule = self._rules.get(key)
        if rule is None or rule.timed is not t:
            return
        t.timer = None
        self._settle({key})
        self._flush()

    def _timed_send(self, rule: _Rule, do: str, why: str) -> None:
        """Command the device to `do` through the action path (own context, waiting for the target); nothing is sent
        when it reads `do` already (last then says so with sent: false). Either way the previous command's waiting is
        given up."""
        t = rule.timed
        assert t is not None
        action = rule.timed_actions[do]
        shared = action.call is not None and action.call[2] in rule.pairs and bool(self._holders(t.eid, rule.key))
        send = t.command(do, t.state(self._lookup))
        self._new_firing(rule)
        rule.failed = None
        if send or shared:  # with another rule keeping the device on, the entry says so
            self._fire(rule, [action], why)
        else:
            rule.last = {"action": do, "target": t.label, "at": int(self._now() * 1000), "reason": why, "sent": False}

    def _timed_device(self, rule: _Rule, own: bool) -> None:
        """A state change of a timed rule's device, before the evaluation: someone else switching it ends the run."""
        t = rule.timed
        assert t is not None
        state = t.state(self._lookup)
        if not t.device_changed(state, own, rule.enabled and not t.missing):
            return
        self._new_firing(rule)  # a command still waiting for the device is given up
        self._give_up(t.eid, rule.key)
        rule.failed = None
        rule.last = {"action": state, "target": t.label, "at": int(self._now() * 1000),
                     "reason": "ended: switched elsewhere", "sent": False}

    # --- outside light ---------------------------------------------------------

    def _paused(self, rule: _Rule) -> bool:
        """An outside rule in its manual pause is out of the slots (no hold, no commands); the pause end is armed."""
        o = rule.outside
        if o is None:
            return False
        paused = o.paused(self._now(), self._booting)
        wake = o.until if paused and not o.restored else None
        if o.timer is not None and o.timer[0] != wake:
            o.stop()
        if wake is not None and o.timer is None:
            key = rule.key
            o.timer = (wake, self._schedule(max(0.0, wake - self._now()), lambda: self._outside_wake(key, o)))
        return paused

    def _outside_wake(self, key: Key, o: Outside) -> None:
        rule = self._rules.get(key)
        if rule is None or rule.outside is not o:
            return
        o.timer = None
        self._settle({key})
        self._flush()

    def _outside_light(self, rule: _Rule, ours: bool) -> None:
        """A state change of an outside rule's light, before the evaluation: a manual switch starts (or restarts) the
        pause; a return from no data in a state other than the want applies the want once (never a switch)."""
        o = rule.outside
        assert o is not None and o.eid is not None
        state = o.state(self._lookup)
        change = o.light_changed(state, ours, rule.enabled and not o.missing, self._now())
        if change == "manual":
            self._give_up(o.eid, rule.key)  # it no longer takes part: its waiting command is stale
            hold = self._holds.get(o.eid)
            if hold is not None and hold.owed == rule.key:
                hold.owed = None
            rule.last, rule.failed = {"action": state, "target": o.label, "at": int(self._now() * 1000),
                                      "reason": f"switched elsewhere: paused {o.pause} min", "sent": False}, None
        elif change == "back" and rule.open and rule.verdict is not None and (state == "on") != rule.verdict:
            self._new_firing(rule)
            self._fire(rule, rule.actions(), "light back")

    def pauses(self) -> "dict[str, dict[str, float]]":
        """The paused outside light rules {plan id: {rule id: pause end epoch s}} of every loaded rule."""
        out: dict[str, dict[str, float]] = {}
        for (pid, rid), rule in self._rules.items():
            if rule.outside is not None and rule.outside.until is not None:
                out.setdefault(pid, {})[rid] = rule.outside.until
        return out

    def _report_pauses(self) -> None:
        pauses = self.pauses()
        if pauses == self._pauses:
            return
        self._pauses = pauses
        try:
            self._on_pauses(copy.deepcopy(pauses))
        except Exception:  # noqa: BLE001 - a failing store must not stop the engine
            _LOGGER.exception("saving the outside light pauses failed")

    def _outside_trace(self, rule: _Rule) -> dict:
        o = rule.outside
        assert o is not None
        now = self._now()
        d = self._days.get((rule.key[0], o.sensor or ""))
        out: dict = {"daylight": d.state if d is not None else None,
                     "detail": d.reading if d is not None else "missing"}
        if d is not None and d.to is not None and d.due is not None:
            out["detail"] += f" ({d.to} in {daylight.countdown(d.due - now)})"
            out["until"] = int(d.due * 1000)  # the pending daylight change
        sun = _read_sun(self._lookup)[0] if o.after_sunset else None
        out["sun"] = None if sun is None else "below" if sun else "above"
        out["window"] = None
        for i, t in zip(rule.inputs, rule.trace_inputs):
            if i.type == "time":
                out["window"] = t["value"]
                if i.timer is not None:
                    out["windowUntil"] = int(i.timer[0] * 1000)  # the next window boundary
        if o.until is not None:
            out["pausedUntil"] = int(o.until * 1000)
        out["light"] = o.state(self._lookup)
        return out

    # --- light motion control --------------------------------------------------

    def _motion(self, rule: _Rule, due: "_Pending | None") -> bool:
        """Evaluate a motion light rule. In auto with motion sensors it is the condition machinery over its inputs (the
        light held through the slots; a light found on is held; the off waits for the minimum on time; the daylight
        coming switches a held light off at once). While its blocker reads the chosen state (auto) it holds nothing and
        sends nothing: blocking starting (or auto entered while blocked) switches the light off, ending it takes a fresh
        decision. In manual, in auto without motion sensors (inert), while HA starts, disabled or with a static problem
        it is out of the slots (verdict None, nothing sent); manual arms the auto-return. True when the verdict changed."""
        m = rule.motion_light
        assert m is not None
        self._compute(rule)
        was, now = rule.verdict, self._now()
        values = self._motion_values(rule)
        # followed at every evaluation: manual, a blocked rule and an inactive one take the changes without acting
        change, day = m.block(values), m.day_came(values)
        active = rule.enabled and not m.missing and m.eid is not None and not self._booting
        if active and m.mode == "manual":
            wake = m.auto_due(now, m.motion(values))
            if wake is not None and wake <= now:
                self._motion_auto(rule, "auto again")
            else:
                self._motion_arm(rule, wake)
        if not active or m.mode == "manual" or not m.sensors:
            if not active or m.mode == "auto":
                m.stop()
            rule.cancel()
            rule.open, rule.verdict, m.entered = False, None, False
            return rule.verdict != was
        m.stop()
        rule.open = True
        if m.blocked:
            m.waiting = False
            if change == "start" or m.entered:
                self._motion_block(rule)
            elif rule.verdict is not False:  # HA start, a changed Save while blocked: the light is left as it is
                self._motion_hold(rule, False, note=False)
            rule.raw, m.entered = False, False
            return rule.verdict != was
        if rule.verdict is None:
            if m.entered:  # entering auto: a fresh decision at once
                self._motion_enter(rule)
            else:  # rule start, the light back from no data: take the light as it is
                self._motion_hold(rule, m.state(self._lookup) == "on")
        elif change == "end":  # blocking ended: a fresh decision at once, as entering auto
            self._motion_enter(rule, "unblocked")
        elif day and rule.verdict is True:  # the daylight came: a held light goes off at once
            self._motion_decide(rule, False, "daylight")
            m.day_off = True  # motion no longer keeps a light reading on (an off kept back or lost) while not dark
        m.entered = False
        if self._step(rule, due):
            # the rule decided to switch the light on: the minimum on time counts from here
            m.on_at = now if rule.verdict is True else None
            m.decide("on" if rule.verdict else "off", now, ON_WAY)  # its late echo is not a manual switch
            m.dropped = None
        if rule.verdict is True:
            m.day_off = False  # the rule holds a light again
        return rule.verdict != was

    def _motion_hold(self, rule: _Rule, on: bool, note: bool = True) -> None:
        """Take the light's state as the verdict without a command: a light found on is held (its off comes after the
        off delay; the minimum on time does not apply; recorded as "found on" unless `note` is False; it ends a wait for
        new motion and a daylight off's mark), one found off is not."""
        m = rule.motion_light
        assert m is not None and m.eid is not None
        rule.cancel()
        rule.verdict, m.on_at, m.dropped = on, None, None
        if on:
            m.waiting = m.day_off = False
        self._new_firing(rule)
        self._give_up(m.eid, rule.key)  # a command of the rule still waiting for the light is stale
        if on and note:
            rule.last, rule.failed = {"action": "on", "target": m.label, "at": int(self._now() * 1000),
                                      "reason": "found on", "sent": False}, None

    def _motion_values(self, rule: _Rule) -> "list[bool | None]":
        """The values of a motion light rule's inputs after NOT (the blocker's is negated for "is on")."""
        return [t["value"] if t["value"] is None or not i.negate else not t["value"]
                for i, t in zip(rule.inputs, rule.trace_inputs)]

    def _motion_enter(self, rule: _Rule, prefix: str = "back to auto") -> None:
        """Entering auto (a button's auto intent or the auto-return; prefix "back to auto"), or the blocking ended
        (prefix "unblocked"): a fresh decision from the current readings, at once (spec §11): want = motion and dark.
        The light on and wanted: held (off after the off delay once the motion ends; the minimum on time does not
        apply). Otherwise the rule's own decision through the slots: off now, or on now (the minimum on time counts from
        here). The previous entry stays the last one when nothing is decided."""
        m = rule.motion_light
        assert m is not None
        values = self._motion_values(rule)
        # an own off still on its way (entering auto, blocked, daylight): the light counts as off, so a wanted light
        # is switched on (not held while it goes dark) and an unwanted one gets no second off
        dropping = m.dropped is not None and self._now() < m.dropped
        motion, on = m.motion(values), m.state(self._lookup) == "on" and not dropping
        want = motion and m.dark(values)
        rule.raw = want  # the step after this one sees the decision, not the light's reading (dark matters here)
        dropped = m.dropped if dropping else None
        self._motion_hold(rule, on, note=False)
        if want == on:
            m.dropped = dropped  # that off is still on its way
            return
        self._motion_decide(rule, want, f"{prefix}: {'motion' if want else 'not dark' if motion else 'no motion'}")

    def _motion_decide(self, rule: _Rule, want: bool, why: str) -> None:
        """The rule's own decision at once through the slots (entering auto, blocked, unblocked, daylight): its entry
        says why (an off kept back by other holders says who keeps the light on); its late echo is not a foreign change;
        the minimum on time counts from an on and does not hold back an off."""
        m = rule.motion_light
        assert m is not None
        now = self._now()
        rule.raw = want  # the step after this one sees the decision, not the light's reading
        self._commit(rule, want, why)
        for e in rule.entries:
            if e.get("sent") is not False:  # an off kept back by other holders says who keeps the light on
                e["reason"] = why
        m.on_at = now if want else None
        m.decide("on" if want else "off", now, ON_WAY)  # its late echo is not a foreign change
        # an off sent now is on its way for ON_WAY s (a lost one must not keep the light on); one kept back is not
        sent = any(e["action"] == "off" and e.get("sent") is not False for e in rule.entries)
        m.dropped = now + ON_WAY if not want and sent else None

    def _motion_block(self, rule: _Rule) -> None:
        """Blocking started in auto, or auto was entered while blocked: a light the rule holds (also an on of its own
        still on its way) or that reads on goes off at once (reason "blocked"); then the rule holds nothing while
        blocked (verdict false, nothing pending)."""
        m = rule.motion_light
        assert m is not None
        on = rule.verdict is True or m.state(self._lookup) == "on"
        self._motion_hold(rule, False, note=False)
        if on:
            self._motion_decide(rule, False, "blocked")

    def _motion_manual(self, rule: _Rule, action: str, sent: bool) -> dict:
        """Enter (or stay in) manual by a button press: out of the slots at once, nothing owed or waiting for the light
        any more."""
        m = rule.motion_light
        assert m is not None and m.eid is not None
        was = m.mode
        m.mode, m.since, m.moving, m.on_at, m.entered, m.own, m.waiting = "manual", self._now(), False, None, False, [], False
        m.dropped, m.day_off = None, False
        m.presses += 1  # an older press's command is no longer wanted
        rule.cancel()
        rule.open, rule.verdict = False, None
        self._drop_light(rule)  # the person took over: nothing may switch the light back
        entry = {"action": action, "target": m.label, "at": int(self._now() * 1000), "reason": "button: manual"}
        if not sent:
            entry["sent"] = False
        rule.last, rule.failed = entry, None
        if was != "manual":
            self._rule_event(rule, "manual")
        return entry

    def _motion_release(self, rule: _Rule) -> None:
        """The light was switched off elsewhere while the rule held it (auto): let go and wait for new motion (no
        switch-on until every motion sensor has been clear once)."""
        m = rule.motion_light
        assert m is not None and m.eid is not None
        rule.cancel()
        rule.verdict, m.on_at, m.waiting = False, None, True
        self._new_firing(rule)
        self._drop_light(rule)
        rule.last, rule.failed = {"action": "off", "target": m.label, "at": int(self._now() * 1000),
                                  "reason": "switched off elsewhere: waits for new motion", "sent": False}, None

    def _drop_light(self, rule: _Rule) -> None:
        """Nothing owed or waiting for a motion light rule's light any more."""
        m = rule.motion_light
        assert m is not None and m.eid is not None
        self._give_up(m.eid, rule.key)
        hold = self._holds.get(m.eid)
        if hold is not None:
            hold.owed = None

    def _motion_auto(self, rule: _Rule, why: str) -> None:
        """Enter auto: the auto rules apply from now on (the evaluation takes a fresh decision at once; a wait for new
        motion ends; an own off still on its way, `dropped`, is kept for that decision)."""
        m = rule.motion_light
        assert m is not None
        was = m.mode
        m.mode, m.since, m.moving, m.on_at, m.entered, m.own, m.waiting = "auto", None, False, None, True, [], False
        m.presses += 1  # a press's command is no longer wanted
        m.stop()
        rule.cancel()
        rule.verdict = None
        rule.last, rule.failed = {"action": "auto", "target": m.label, "at": int(self._now() * 1000), "reason": why,
                                  "sent": False}, None
        if was != "auto":  # auto while auto restarts the start: no event
            self._rule_event(rule, "auto")

    def _motion_arm(self, rule: _Rule, wake: "float | None") -> None:
        m = rule.motion_light
        assert m is not None
        if m.timer is not None and m.timer[0] != wake:
            m.stop()
        if wake is not None and m.timer is None:
            key = rule.key
            m.timer = (wake, self._schedule(max(0.0, wake - self._now()), lambda: self._motion_wake(key, m)))

    def _motion_wake(self, key: Key, m: MotionLight) -> None:
        rule = self._rules.get(key)
        if rule is None or rule.motion_light is not m:
            return
        m.timer = None
        self._settle({key})
        self._flush()

    def _motion_light_changed(self, rule: _Rule, confirms: bool) -> None:
        """A state change of a motion light rule's light, before the evaluation. It never changes the mode; in auto
        with motion sensors the rule adapts: switched on elsewhere -> held from now, switched off elsewhere while held
        -> let go until new motion (a Plan Studio command that does not confirm the slots is foreign too)."""
        m = rule.motion_light
        assert m is not None
        state = m.state(self._lookup)
        change = m.light_changed(state, confirms, rule.enabled and not m.missing and not self._booting,
                                 rule.verdict is True, self._now())
        if change == "back":
            rule.cancel()
            rule.verdict = None  # the auto start applies again
        elif change == "found" and rule.verdict is False:
            self._motion_hold(rule, True)  # switched on elsewhere: held from now
        elif change == "released":
            self._motion_release(rule)

    def _motion_press(self, rule: _Rule, intent: dict) -> bool:
        """A button intent of a motion light rule (a smart button or a wall switch); True when it was taken. toggle /
        set on / set off: manual with a direct command (own context, never re-sent; none for a wall switch over the
        light's own entity: the light already is as flipped); auto: auto."""
        m = rule.motion_light
        assert m is not None and m.eid is not None
        mode, do = m.press(intent, m.state(self._lookup))
        if mode == "auto":
            self._motion_auto(rule, "button: auto")
            return True
        if mode != "manual":
            return False
        entry = self._motion_manual(rule, do or intent["value"], sent=do is not None)
        if do is None:
            return True
        eid = m.eid

        def on_error(err: str, why: str = "service failed") -> None:
            _LOGGER.warning("rule %s: turn_%s %s failed: %s", rule.name, do, eid, err)
            entry["error"] = "service failed" if "service failed" in (entry.get("error"), why) else why
            self._flush()

        try:
            held = self._command(eid.split(".", 1)[0], f"turn_{do}", eid, by=rule.key, entry=entry, kind="press",
                                 token=(m.ident, m.presses), on_error=on_error)
        except Exception as err:  # noqa: BLE001 - a failing light must not stop the engine
            _LOGGER.warning("rule %s: turn_%s %s failed: %s", rule.name, do, eid, err)
            entry["error"] = "service failed"
            return True
        if held is not True and not _available(self._lookup(eid)):
            entry["error"] = "target unavailable"
        return True

    def motion_modes(self) -> "dict[str, dict[str, dict]]":
        """The motion light rules in manual {plan id: {rule id: {"mode": "manual", "since": epoch s, "by": "button"}}} of
        every loaded rule (auto is the default and is not stored; a button is the only way into manual)."""
        out: dict[str, dict[str, dict]] = {}
        for (pid, rid), rule in self._rules.items():
            m = rule.motion_light
            if m is not None and m.mode == "manual":
                out.setdefault(pid, {})[rid] = {"mode": "manual", "since": m.since, "by": "button"}
        return out

    def _report_motion_modes(self) -> None:
        modes = self.motion_modes()
        if modes == self._motion_modes:
            return
        self._motion_modes = modes
        try:
            self._on_motion_modes(copy.deepcopy(modes))
        except Exception:  # noqa: BLE001 - a failing store must not stop the engine
            _LOGGER.exception("saving the motion light modes failed")

    def _motion_trace(self, rule: _Rule) -> dict:
        m = rule.motion_light
        assert m is not None
        values = self._motion_values(rule)
        labels = [t["label"] for t in rule.trace_inputs]
        off_at = rule.pending.at if rule.pending is not None and not rule.pending.to else None
        out = m.trace(values, labels, m.state(self._lookup), self._now(), off_at)
        if m.daylight is not None:
            t = rule.trace_inputs[len(m.sensors)] if len(rule.trace_inputs) > len(m.sensors) else {}
            d = self._days.get((rule.key[0], m.daylight[0]))
            out["daylight"] = {"state": d.state if d is not None else None, "detail": t.get("detail", "missing")}
        if m.blocker is not None:  # the device's own reading (before NOT)
            k = m.blocker_at
            v = rule.trace_inputs[k]["value"] if len(rule.trace_inputs) > k else None
            out["blocker"] = {"name": m.blocker_label, "state": None if v is None else "on" if v else "off",
                              "is": m.blocker[1]}
        return out

    # --- beurer heater ---------------------------------------------------------

    def _beurer_heater(self, rule: _Rule, ours: bool) -> None:
        """A state change of a beurer rule's heater, before the evaluation: switched off elsewhere while wanted (also
        back from no data reading off) gets on again; a change during a power-cycle pause is the cycle's own."""
        b = rule.beurer
        assert b is not None
        wanted = rule.enabled and not b.missing and rule.verdict is True
        if b.heater_changed(b.state(self._lookup), ours, wanted, self._now()):
            self._new_firing(rule)
            self._fire(rule, rule.actions(), "switched off elsewhere")

    def _beurer_step(self, rule: _Rule) -> None:
        """The power-cycle after an evaluation of an enabled beurer rule: the off goes straight to the heater (not
        through the slots, never waiting); the on at the pause end and an unconfirmed on repeated go through the slots
        while a rule holds the heater. Then the pause end, the next retry or the next cycle is armed."""
        b = rule.beurer
        assert b is not None
        now = self._now()
        do = b.step(now, not b.missing and rule.verdict is True, b.state(self._lookup))
        if do is not None and b.eid is not None:
            why = "no confirmation" if do == "retry" else "re-power"
            do = "on" if do == "retry" else do
            entry = {"action": do, "target": b.label, "at": int(now * 1000), "reason": why}
            if do == "off":
                self._give_up(b.eid)  # a waiting on is not re-sent inside the pause
                self._beurer_off(b.eid, rule.key, entry)
                rule.last = entry
            elif self._holders(b.eid):
                self._hold_send(b.eid, "on", rule, entry)
                rule.last = entry
        wake = b.wake()
        if wake is not None and wake <= now:
            wake = None  # a cycle due but not done (not wanted, heater not on): only an evaluation can change that
        if b.timer is not None and b.timer[0] != wake:
            b.stop()
        if wake is not None and b.timer is None:
            key = rule.key
            b.timer = (wake, self._schedule(max(0.0, wake - now), lambda: self._beurer_wake(key, b)))

    def _beurer_off(self, eid: str, by: Key, entry: dict) -> None:
        """The power-cycle's off (own context); a failure is only logged: the pause end reads the heater anyway."""
        def on_error(err: str, why: str = "service failed") -> None:
            _LOGGER.warning("beurer heater %s: turn_off failed: %s", eid, err)

        try:
            self._command(eid.split(".", 1)[0], "turn_off", eid, by=by, entry=entry, kind=None, token=None,
                          on_error=on_error)
        except Exception as err:  # noqa: BLE001 - a failing heater must not stop the engine
            _LOGGER.warning("beurer heater %s: turn_off failed: %s", eid, err)

    def _beurer_wake(self, key: Key, b: Beurer) -> None:
        rule = self._rules.get(key)
        if rule is None or rule.beurer is not b:
            return
        b.timer = None
        self._settle({key})
        self._flush()

    def _beurer_trace(self, rule: _Rule) -> dict:
        b = rule.beurer
        assert b is not None
        t = rule.trace_inputs[0] if rule.trace_inputs else {}
        out: dict = {"watts": t.get("watts"), "detail": t.get("detail", "missing")}
        if "until" in t:
            out["keptUntil"] = t["until"]
        out["heater"], out["fresh"] = b.state(self._lookup), b.fresh
        if b.pause is not None:
            out["pausedUntil"] = int(b.pause * 1000)
        elif b.fresh and b.every > 0 and rule.verdict is True:
            out["cycleAt"] = int((b.since + b.every * 60) * 1000)
        return out

    # --- load control ----------------------------------------------------------

    def _echo_live(self, eid: str) -> "list[tuple[str, float]]":
        """The unexpired expected changes of the entity (expired ones are dropped)."""
        now = self._now()
        live = [e for e in self._echoes.get(eid, ()) if e[1] > now]
        if live:
            self._echoes[eid] = live
        else:
            self._echoes.pop(eid, None)
        return live

    def _echo_take(self, eid: str, state: str) -> bool:
        """A change of the entity to `state` is a load control command arriving: True, and that expected change and
        every older one of the entity are consumed."""
        live = self._echo_live(eid)
        for n, (s, _) in enumerate(live):
            if s == state:
                del live[:n + 1]
                if not live:
                    self._echoes.pop(eid, None)
                return True
        return False

    def _echo_arrived(self, eid: str, st: "tuple[str, dict] | None") -> None:
        """A state of the entity no load control rule took as a source change: when it is the oldest expected change,
        that one has arrived (only the oldest: an attribute update amid an on / off double flip drops nothing)."""
        live = self._echo_live(eid)
        if live and st is not None and st[0] == live[0][0]:
            del live[0]
            if not live:
                self._echoes.pop(eid, None)

    def _control_state(self, eid: str) -> str | None:
        """The effective state of a device: None without data; else its newest command still on its way, else its
        reading ("unknown" is commanded; a closing valve counts as closed)."""
        st = self._lookup(eid)
        if st is None or st[0] == "unavailable":
            return None
        live = self._echo_live(eid)
        if live:
            return live[-1][0]
        if st[0] == "closing":
            return "closed"
        return st[0] if st[0] in ("on", "off", "open", "closed") else "unknown"

    def _control_evaluate(self, rule: _Rule) -> None:
        """The input sources are evaluated as the condition rule's inputs (timers, NOT); each known false <-> true
        change of one is an event, in rule order. Values are always recorded; nothing fires for a disabled rule, a
        missing button, in a load, while HA starts, or for a device source whose entity change is a load control
        command arriving (resolved once per state change, for every load control rule). A virtual switch has no input
        of its own (every change of it is a rule's): its arriving command is consumed but still an event."""
        c = rule.control
        assert c is not None
        self._compute(rule)
        live = rule.enabled and not c.missing and not self._loading and not self._booting
        for k, (i, t) in enumerate(zip(rule.inputs, rule.trace_inputs)):
            if i.type == "device" and i.kind == "valve" and i.eid:
                st = self._lookup(i.eid)
                if st is not None and st[0] in ("opening", "closing"):
                    continue  # a moving valve keeps its settled value (as the Valve container does)
            what = c.edge(k, t["value"] if t["value"] is None or not i.negate else not t["value"])
            if what is None or not live:
                continue
            if i.type == "device" and i.eid is not None and i.eid == self._trigger:
                if self._echo is None:
                    st = self._lookup(i.eid)
                    self._echo = st is not None and self._echo_take(i.eid, st[0])
                if self._echo and virtual_device(i.eid) is None:
                    continue  # a real device's change made by a load control rule: chains do not propagate
            # a rule's verdict changed only by inputs back from no data: the event switches but announces nothing
            # nor in the restored state's first evaluation at HA start (started())
            real = (i.type != "rule" or self._ref_real(rule.key[0], i.rule)) and not self._starting
            self._control_event(rule, i.label, what, announce=real)

    def _rule_event(self, rule: _Rule, *whats: str) -> None:
        """A purpose-built rule's mode changed ("auto", "manual"; heating done gives "done" then "manual"): every
        enabled Load control rule with a matching event source gets an "on" event (its gate applies), once even when
        several of its sources match (the first of `whats` it has). None while HA starts (also the restored state's first
        evaluation in started()), inside a load (a Save, an entry reload) or from a disabled rule."""
        if self._booting or self._starting or self._loading or not rule.enabled:
            return
        rid, fired = rule.key[1], set()
        for what in whats:
            for key in self._listeners.get(rule.key, ()):
                lc = self._rules.get(key)
                c = lc.control if lc is not None else None
                if key in fired or c is None or not lc.enabled or c.missing or (rid, what) not in c.events:
                    continue
                fired.add(key)
                self._control_event(lc, rule.name, "on", origin={"rule": rid, "what": what})

    def _control_event(self, rule: _Rule, source: str, what: str, announce: bool = True,
                       origin: "dict | None" = None) -> None:
        """An event ("on", "off" or "toggle") of a source: recorded; dropped while the gate is not open (an "off" event ignores the gate); else the list
        of its kind runs by direct calls (own context). Its toggle actions act as one group (any of their devices
        effectively on: all off, else all on); on / off / close are literal; an announcement runs on its own (_announce),
        unless the event is no real change (announce False: it is left out, no entry). A device in the wanted state
        already or without data gets nothing (never re-sent later). origin: {rule, what} of an event source (the
        purpose-built rule's event, kept in the record; the entries' reason names it)."""
        c = rule.control
        assert c is not None
        at = int(self._now() * 1000)
        c.event = {"source": source, "what": what, "at": at}
        if origin is not None:
            c.event["origin"] = dict(origin)
        if what != "off" and rule.gate is not None and (rule.gate_trace is None or rule.gate_trace["value"] is not True):
            c.event["dropped"] = "gate closed"
            return
        actions = [a for a in rule.control_actions.get(what, []) if announce or a.do not in ANNOUNCE]
        if not actions:
            return
        effective = [self._control_state(a.call[2]) if a.call is not None else None for a in actions]
        group = c.want([s for a, s in zip(actions, effective) if a.do == "toggle"])
        rule.seq += 1  # a late failure of an older event must not mark this one
        seq, reason = rule.seq, f"{source}: {origin['what'] if origin is not None else what}"
        rule.entries, rule.acted = [], c.event
        for a, state in zip(actions, effective):
            do = group if a.do == "toggle" else a.do
            entry = {"action": do, "target": a.label, "at": at, "reason": reason}
            rule.entries.append(entry)
            if a.announce is not None:  # on its own, also in the toggle list (never part of its group)
                self._announce(rule, a, entry, self._control_refresh)
                continue
            if a.call is None:
                entry["error"] = "target missing"
                continue
            domain, service, eid = a.call
            if do == "close":  # the valve services; a switch-backed valve reads off when closed
                expect = "closed" if domain == "valve" else "off"
            else:
                service, expect = f"turn_{do}", do
            if state is None:
                entry["error"] = "target unavailable"
            elif state == expect:
                entry["sent"] = False
            else:
                self._control_call(rule, seq, (domain, service, eid), expect, entry)
        self._control_refresh(rule)

    def _control_call(
        self, rule: _Rule, seq: int, call: "tuple[str, str, str]", expect: str, entry: dict,
    ) -> None:
        """One direct command; the state it should bring is remembered as an expected change of the entity for ECHO s
        (until it arrives or the call fails)."""
        domain, service, eid = call
        echo = (expect, self._now() + ECHO)

        def on_error(err: str, why: str = "service failed") -> None:
            live = self._echoes.get(eid, [])
            if why == "service failed" and any(e is echo for e in live):  # never arrives ("target unavailable": sent)
                live[:] = [e for e in live if e is not echo]
                if not live:
                    self._echoes.pop(eid, None)
            now = self._current(rule, seq)
            if now is None:
                return  # a newer event, a changed or a removed rule
            entry["error"] = "service failed" if "service failed" in (entry.get("error"), why) else why
            self._control_refresh(now)
            self._flush()

        try:
            self._command(domain, service, eid, by=rule.key, entry=entry, kind="control", token=None, on_error=on_error)
        except Exception as err:  # noqa: BLE001 - one failing device must not stop the others
            _LOGGER.warning("rule %s: %s.%s %s failed: %s", rule.name, domain, service, eid, err)
            entry["error"] = "service failed"
            return
        self._echo_live(eid)
        self._echoes.setdefault(eid, []).append(echo)

    def _control_refresh(self, rule: _Rule) -> None:
        """Last entry (the first with an error, else the last one sent, else the last one) and failure of the latest
        event."""
        errors = {e.get("error") for e in rule.entries}
        rule.failed = next((r for r in ("service failed", "target unavailable") if r in errors), None)
        if rule.entries:
            sent = next((e for e in reversed(rule.entries) if e.get("sent", True)), rule.entries[-1])
            rule.last = next((e for e in rule.entries if "error" in e), sent)

    def _control_trace(self, rule: _Rule) -> dict:
        c = rule.control
        assert c is not None

        def state(eid: "str | None", valve: bool) -> "str | None":
            st = self._lookup(eid) if eid else None
            if valve:
                return {True: "open", False: "closed", None: None}[_valve_open(eid, st)] if eid else None
            return st[0] if st is not None and st[0] in ("on", "off") else None

        out: dict = {} if c.event is None else {"event": dict(c.event)}
        out["devices"] = [{"id": did, "name": label, "state": state(eid, valve)}
                          for did, label, eid, valve in rule.control_devices]
        return out

    def runs(self) -> "dict[str, dict[str, float]]":
        """The running timed switches {plan id: {rule id: until epoch s}} of every loaded rule."""
        out: dict[str, dict[str, float]] = {}
        for (pid, rid), rule in self._rules.items():
            if rule.timed is not None and rule.timed.until is not None:
                out.setdefault(pid, {})[rid] = rule.timed.until
        return out

    def _report_runs(self) -> None:
        runs = self.runs()
        if runs == self._runs:
            return
        self._runs = runs
        try:
            self._on_runs(copy.deepcopy(runs))
        except Exception:  # noqa: BLE001 - a failing store must not stop the engine
            _LOGGER.exception("saving the timed runs failed")

    def started(self) -> None:
        """HA has started: end the boot phase and evaluate the boiler rules in auto, the restored timed runs, the
        restored outside light pauses and the motion light rules once, and run the beurer power-cycles."""
        if not self._booting:
            return
        self._booting = False
        self._starting = True  # a light whose auto-return passed while HA was down, a restored boiler done: no events
        try:
            self._settle({key for key, rule in self._rules.items() if rule.boiler is not None or rule.timed is not None
                          or rule.outside is not None or rule.beurer is not None or rule.motion_light is not None})
        finally:
            self._starting = False
        self._flush()

    def _boiler_drop_on(self, rule: _Rule, relay: str | None) -> None:
        """Auto no longer wants the relay on (blackout, limit, undecided): a switch-on of this rule still waiting to be
        sent again is given up, so the relay coming back is not switched on into an overload; never an off. An on the
        relay does not read is forgotten (waiting, failed, lost or on its way), so the next legitimate on is sent; the
        late confirmation of one on its way is still Plan Studio's own (the engine's latest command reached, the
        expected states in live.py) and the next evaluation switches it off."""
        b = rule.boiler
        assert b is not None and b.relay is not None
        hold = self._holds.get(b.relay)
        if hold is not None and hold.cmd == "on":
            self._give_up(b.relay, rule.key)  # an arbitrated on of this rule waiting for the relay
        if b.cmd == "on" and relay != "on":
            b.cmd = None
            if rule.failed is not None:  # a button's on waiting for the relay (_boiler_relay would send it again)
                if rule.last is not None:
                    rule.last["error"] = rule.failed
                rule.failed = None

    def _boiler_wake(self, key: Key, b: Boiler) -> None:
        rule = self._rules.get(key)
        if rule is None or rule.boiler is not b:
            return
        b.timer = None
        self._settle({key})
        self._flush()

    def _boiler_auto(self, rule: _Rule, do: str, why: str, safety: bool = False) -> None:
        """An auto (or disabling) command of a boiler: arbitrated with the other rules keeping the relay on; a safety
        off is sent regardless."""
        b = rule.boiler
        assert b is not None and b.relay is not None
        b.sends += 1  # an older button command's late failure no longer counts
        entry = {"action": do, "target": b.label, "at": int(self._now() * 1000), "reason": why}
        rule.last, rule.failed = entry, None
        if safety:
            self._hold_send(b.relay, do, rule, entry)
        else:
            self._arbitrated(rule, b.relay, do, entry)

    def _boiler_send(self, rule: _Rule, do: str, why: str) -> None:
        """Switch the boiler relay directly (a button command); an unavailable relay or a failed call waits until the
        relay comes back. It replaces a waiting arbitrated command of the relay."""
        b = rule.boiler
        assert b is not None and b.relay is not None
        self._give_up(b.relay)
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
            held = self._command(relay.split(".", 1)[0], f"turn_{do}", relay, by=key, entry=entry, kind="boiler",
                                 token=(b.ident, n), on_error=on_error,
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
        if b.relay_changed(relay, own, active, self._now()):
            b.cmd = None
            self._give_up(b.relay, rule.key)
            if rule.failed is not None and rule.last is not None:
                rule.last["error"] = rule.failed  # given up: the human took over
            rule.failed = None
            self._rule_event(rule, "manual")  # a take-over: auto -> manual
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
        boiler, timed or motion light rule whose button it is takes it, and so does every load control rule with that
        smart button among its sources (not while HA is starting). Status events and other actions are ignored."""
        if not isinstance(intent, dict):
            return
        dirty: set[Key] = set()
        for key, rule in self._rules.items():
            m = rule.motion_light
            if m is not None:
                if key[0] != plan_id or container_id not in m.buttons or not rule.enabled or m.missing or m.eid is None \
                        or self._booting:
                    continue
                was = rule.verdict
                if self._motion_press(rule, intent):
                    if container_id in m.relays:  # the light's own relay: the change behind this intent is the press
                        m.seen = m.state(self._lookup)
                    dirty.add(key)
                    if rule.verdict != was:  # moved before the settle: its consumers follow it there
                        dirty.update(self._consumers.get(key, ()))
                continue
            c = rule.control
            if c is not None:  # a button source; any other source is read through its input (handle_state)
                if key[0] != plan_id or not rule.enabled or c.missing or self._booting:
                    continue
                label = next((label for did, label in c.buttons if did == container_id), None)
                what = c.press(intent) if label is not None else None
                if what is not None:
                    self._control_event(rule, label, what)
                    dirty.add(key)
                continue
            t = rule.timed
            if t is not None:
                if key[0] != plan_id or t.button != container_id or not rule.enabled or t.missing:
                    continue
                taken, do, why = t.press(intent, self._now())
                if not taken:
                    continue
                t.seen = t.state(self._lookup)  # a wall switch over the device: the change behind this intent is ours
                self._timed_send(rule, do, why)
                dirty.add(key)
                continue
            b = rule.boiler
            if key[0] != plan_id or b is None or b.button != container_id or not rule.enabled or b.missing:
                continue
            relay, was = b.relay_state(self._lookup), b.mode
            taken, do, why = b.press(intent, relay, self._now())
            if not taken:
                continue
            b.sends += 1  # every press, also one sending nothing: an older button command is no longer wanted
            b.see(relay, self._now())  # a wall switch over the relay: the change behind this intent is no take-over
            if do is not None:
                self._boiler_send(rule, do, why)
            if b.mode != was:
                self._rule_event(rule, b.mode)
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
        st = self._lookup(entity_id)
        cmd = self._commands.get(entity_id)
        reached = cmd is not None and st is not None and st[0] == cmd.state  # the engine's latest command got there
        cleared = reached and self._unmark(entity_id)
        keys = self._readers.get(entity_id)
        if not keys and entity_id not in self._targets:
            if cleared:
                self._flush()
            return
        hold = self._holds.get(entity_id)
        confirms = False  # the change confirms the slots' last command (any context, any delay)
        if hold is not None and st is not None and st[0] == hold.cmd:
            confirms, hold.confirmed = not hold.confirmed, True
        for dk in self._day_reads.get(entity_id, ()):
            self._day_read(dk)  # before the rules reading it are evaluated
        for key in self._targets.get(entity_id, ()):
            self._reclose(self._rules[key], entity_id)
        moved: set[Key] = set()  # consumers of motion light rules whose verdict the light's change moved before the settle
        for key in keys or ():
            rule = self._rules[key]
            if rule.boiler is not None and rule.boiler.relay == entity_id:
                # the boiler's own latest command arriving late is no take-over (even without a context): 0.24.0's cmd
                self._boiler_relay(rule, own or (reached and cmd.by == key))
            if rule.timed is not None and rule.timed.eid == entity_id:
                self._timed_device(rule, own)
            if rule.outside is not None and rule.outside.eid == entity_id:
                self._outside_light(rule, own or confirms)
            if rule.motion_light is not None and rule.motion_light.eid == entity_id:
                was = rule.verdict
                self._motion_light_changed(rule, confirms)
                if rule.verdict != was:
                    moved.update(self._consumers.get(key, ()))
            if rule.beurer is not None and rule.beurer.eid == entity_id:
                self._beurer_heater(rule, own or confirms)
        # A load control rule finding a source change of this entity asks once whether it is its command arriving;
        # when none did, the state may still be the arrival of the entity's oldest expected change.
        self._trigger, self._echo = entity_id, None
        try:
            if keys:
                self._settle(set(keys) | moved)
        finally:
            self._trigger = None
        if self._echo is None:
            self._echo_arrived(entity_id, st)
        self._resend(entity_id)  # after the inputs: a newer firing has already dropped stale waiting actions
        self._flush()

    def command_refused(self, entity_id: str, by: object) -> None:
        """A virtual switch refused the latest command to it (a rule loop: it changed too fast, live.py): an echo of it
        never arrives, and the entry of the rule `by` that sent it says "virtual switch loop" as command_unconfirmed."""
        self._echoes.pop(entity_id, None)
        self.command_unconfirmed(entity_id, by, LOOP)

    def command_unconfirmed(self, entity_id: str, by: object, error: str = NOT_CONFIRMED) -> None:
        """The device never confirmed the latest command to the entity (live.py gives it up 60 s after the send): the
        entry of the rule `by` that sent it says "not confirmed" (status error) until the entity reaches the commanded
        state or another command is sent to it. An entry that already says why it did not get through keeps that.
        error: LOOP for a command a virtual switch refused (command_refused)."""
        cmd = self._commands.get(entity_id)
        if by is None or cmd is None or cmd.by != by or cmd.entry is None:
            return  # another sender's or a newer command, or one without a rule (a released relay)
        rule, st = self._rules.get(cmd.by), self._lookup(entity_id)
        if rule is not None and cmd.kind == "control":  # the latest event asking for the same state shows it
            latest = self._control_latest(rule, entity_id)
            if latest is not None and latest[1] == cmd.state:
                cmd.entry = latest[0]
        entry = cmd.entry
        if rule is None or "error" in entry or (st is not None and st[0] == cmd.state):
            return
        entry["error"] = error
        if any(e is entry for e in rule.entries):
            rule.last = next(e for e in rule.entries if "error" in e)  # the first entry with an error, as _refresh picks
        self._flush()

    def still_wants(self, by: object, entity_id: str, state: str) -> bool:
        """Whether the sender of the latest command to the entity wants `state` NOW (live.py asks before it sends a
        command the device did not confirm once more). Answered from the sender's current decision, per kind of
        command (see _Command), never from the past send; another sender's or an older command, a rule that is gone or
        disabled (except a boiler's relay released into its safe off), or a kind that is never sent again: False."""
        cmd = self._commands.get(entity_id)
        if cmd is None or cmd.by != by or cmd.state != state:
            return False
        if cmd.kind == "release":  # the relay of a boiler rule gone while auto
            return self._released(entity_id, cmd.since)
        rule = self._rules.get(by) if isinstance(by, tuple) else None
        if rule is None:
            return False
        if not rule.enabled:  # a boiler disabled in auto switched its relay off: the same safety off as a release
            b = rule.boiler  # (its hold is forgotten with the load; the record is still the relay's latest command)
            return (cmd.kind == "slot" and state == "off" and b is not None and b.relay == entity_id
                    and self._released(entity_id, cmd.since))
        if cmd.kind == "slot":
            return self._slot_wants(rule, entity_id, state, cmd.token)
        if cmd.kind == "action":  # no later firing (a verdict change, a press of a timed rule), the gate still open
            sender, seq = cmd.token
            return self._current(sender, seq) is not None and rule.open
        if cmd.kind == "control":  # the rule's latest event asks the device for this state (sent, or on its way)
            latest = self._control_latest(rule, entity_id)
            return latest is not None and latest[1] == state
        if cmd.kind == "boiler":  # manual: the rule's last button command, no press since (every press counts)
            b, (ident, sends) = rule.boiler, cmd.token
            return b is not None and b.ident == ident and b.sends == sends and b.mode == "manual"
        if cmd.kind == "press":  # manual: no later press and no mode change of the rule
            m, (ident, presses) = rule.motion_light, cmd.token
            return m is not None and m.ident == ident and m.presses == presses and m.mode == "manual"
        return False

    def _slot_wants(self, rule: _Rule, eid: str, state: str, token: object) -> bool:
        """An arbitrated command: still the device's outstanding one (the same hold and attempt: not replaced, not
        given up) and what the slots want now. A boiler's own command: on only while auto heats and does not refuse
        it (limit, blackout, undecided), off only while the limit, the blackout or "heating done" is in force. Any
        other: on while any rule keeps the device on; off while nobody does and its sender wants it off now."""
        if not self._outstanding(eid, state, token):
            return False
        b = rule.boiler
        if b is not None and b.relay == eid:
            if state == "on":
                return b.mode == "auto" and b.phase == "heating" and not b.refuses_on()
            return (b.mode == "auto" and b.phase in ("blackout", "limit")) or (b.mode == "manual" and b.phase == "done")
        holders = self._holders(eid)
        if state == "on":
            return bool(holders)
        return not holders and self._wants_off(rule, eid)

    def _outstanding(self, eid: str, state: str, token: object) -> bool:
        """An arbitrated command (token: its hold and attempt) is still the device's outstanding one: not replaced,
        not given up."""
        hold, attempt = token
        return self._holds.get(eid) is hold and hold.attempt == attempt and hold.cmd == state

    def _released(self, eid: str, since: "dict[Key, int]") -> bool:
        """A boiler relay switched off because its rule left auto (deleted, rewired, disabled) still needs that off:
        it reads on, no rule keeps it on (as when the off was sent), and no enabled boiler rule on it is in auto or
        has taken a press since (its send count moved from `since`, the counts when the off was sent)."""
        st = self._lookup(eid)
        if st is None or st[0] != "on" or self._holders(eid):
            return False
        return not any(
            r.enabled and r.boiler is not None and r.boiler.relay == eid
            and (r.boiler.mode == "auto" or r.boiler.sends != since.get(r.key, 0)) for r in self._rules.values()
        )

    def _control_latest(self, rule: _Rule, eid: str) -> "tuple[dict, str] | None":
        """Load control: the rule's latest event's entry for the entity and the state it asks for; None when that
        event did not act (dropped, nothing in its list) or has no action on the entity."""
        c = rule.control
        if c is None or c.event is None or rule.acted is not c.event:
            return None
        # the device actions and their entries (an event may leave its announcements out: they have no device state)
        acts = [a for a in rule.control_actions.get(c.event["what"], []) if a.do not in ANNOUNCE]
        for a, e in zip(acts, [e for e in rule.entries if e["action"] not in ANNOUNCE]):
            if a.call is not None and a.call[2] == eid:
                if e["action"] == "close":  # the valve services; a switch-backed valve reads off when closed
                    return e, "closed" if a.call[0] == "valve" else "off"
                return e, e["action"]
        return None

    def _wants_off(self, rule: _Rule, eid: str) -> bool:
        """Whether the rule's current decision switches the shared device off: a timed run not running; any other
        participant in the slots (gate open, not paused, auto for a motion light) with a false verdict."""
        if not rule.enabled or eid not in rule.pairs:
            return False
        if rule.timed is not None:
            return not rule.timed.running
        return rule.open and rule.verdict is False

    def entity_ids(self) -> "set[str]":
        """Inputs of every rule and action targets of enabled rules."""
        return set(self._readers) | set(self._targets)

    # --- live trace ----------------------------------------------------------

    def _trace(self, rule: _Rule) -> dict:
        if not rule.enabled:
            status, reason = "disabled", None
        else:
            reason = rule.static_reason() or rule.failed or self._hold_reason(rule.key) or (
                rule.last["error"] if rule.last is not None and rule.last.get("error") in (NOT_CONFIRMED, LOOP) else None)
            # a motion light rule without motion sensors has no want by design (inert in auto), not for lack of data
            inert = rule.motion_light is not None and not rule.motion_light.sensors
            status = "error" if reason else "waiting" if rule.raw is None and rule.control is None and not inert else "ok"
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
        holders = [r.name for r in self._rules.values() if any(self._wants_on(r, e) for e in rule.pairs)]
        if rule.enabled and holders:
            out["holders"] = holders  # the rules keeping its shared device on now
        if rule.boiler is not None:
            out["boiler"] = dict(rule.boiler.view)
        if rule.timed is not None:
            out["timed"] = rule.timed.trace(self._lookup)
        if rule.outside is not None:
            out["outside"] = self._outside_trace(rule)
        if rule.motion_light is not None:
            out["motionLight"] = self._motion_trace(rule)
        if rule.beurer is not None:
            out["beurer"] = self._beurer_trace(rule)
        if rule.control is not None:  # one entry per source in rule order; a button and an event have no value
            c = rule.control
            out["inputs"] = [
                {**rule.trace_inputs[k], "gives": gives} if kind == "input"
                else {"label": c.buttons[k][1], "value": None, "detail": "", "gives": gives} if kind == "button"
                else self._event_source(rule, k, gives)
                for (kind, k), gives in zip(c.order, c.gives)
            ]
            out["control"] = self._control_trace(rule)
        if rule.leak:
            out["leak"] = {"valves": [
                {"id": v, "name": name, "state": None if eid is None else
                 {True: "open", False: "closed", None: None}[_valve_open(eid, self._lookup(eid))]}
                for v, name, eid in rule.leak_valves]}
        return out

    def _event_source(self, rule: _Rule, k: int, gives: str) -> dict:
        """The trace entry of event source k of a Load control rule: the rule's name; detail "missing" when no rule of
        the plan gives that event."""
        assert rule.control is not None
        rid, what = rule.control.events[k]
        ref = self._rules.get((rule.key[0], rid))
        ok = ref is not None and what in EVENTS.get(ref.event_kind() or "", ())
        return {"label": ref.name if ref is not None else rid, "value": None, "detail": "" if ok else "missing",
                "gives": gives}

    def snapshot(self, plan_id: str) -> "dict[str, dict]":
        return {rid: self._trace(r) for (pid, rid), r in self._rules.items() if pid == plan_id}

    def _flush(self) -> None:
        self._pay_offs()
        self._report_modes()
        self._report_runs()
        self._report_pauses()
        self._report_motion_modes()
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
