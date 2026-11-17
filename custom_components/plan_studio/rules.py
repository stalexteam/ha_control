"""Condition rules: three-valued verdicts, debounce and edge actions over all saved plans. Must not import homeassistant."""

from __future__ import annotations

import copy
import json
import logging
import math
from datetime import date, datetime, time, timedelta, timezone, tzinfo
from typing import Callable

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
        # runtime state, kept across a reload that leaves the rule unchanged
        self.timer: "tuple[float, Callable[[], None]] | None" = None  # time / held: (due epoch, cancel)
        self.prev: bool | None = None  # light: the value kept between the thresholds
        self.mem: list[bool | None] = []  # held: the last known value of each source
        self.known: bool | None = None  # held: the last known combined state
        self.since = 0.0  # held: when the known combined state last changed
        self.boot = False  # held: its first known state counts as held since long ago (loaded at HA start)
        if isinstance(src.get("rule"), str):
            self.type, self.rule = "rule", src["rule"]
            self.missing = self.rule not in rule_names
            self.label = rule_names.get(self.rule) or self.rule
            self.sig: tuple = ("rule", self.rule)
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
            self.sig = ("light", did, self.eid)
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

    def parts(self) -> "list[_Input]":
        """The inputs that read a device or a rule: the held sources, or the input itself."""
        return self.sources if self.type == "held" else [self]

    def take(self, old: "_Input") -> None:
        """Keep the runtime state of the same input of an unchanged rule (its timer is re-armed on evaluation)."""
        self.prev, self.mem, self.known, self.since, self.boot = old.prev, old.mem, old.known, old.since, old.boot

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
    def __init__(self, pid: str, raw: dict, devices: dict, rule_names: dict) -> None:
        self.key: Key = (pid, raw["id"])
        self.name = raw.get("name") if isinstance(raw.get("name"), str) else raw["id"]
        self.enabled = raw.get("enabled") is not False
        self.mode = raw.get("combine") if raw.get("combine") in ("all", "any") else "any"
        self.inputs = [_Input(i, devices, rule_names) for i in raw.get("inputs") or [] if isinstance(i, dict)]
        self.gate = _Input(raw["gate"], devices, rule_names) if isinstance(raw.get("gate"), dict) else None
        self.all_inputs = self.inputs + ([self.gate] if self.gate is not None else [])
        self.on_true = [_Action(a, devices) for a in raw.get("onTrue") or [] if isinstance(a, dict)]
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
        for new, prev in zip(self.all_inputs, old.all_inputs):
            prev.stop()
            new.take(prev)

    def cancel(self) -> None:
        if self.pending is not None:
            self.pending.cancel()
            self.pending = None

    def stop(self) -> None:
        """Cancel every timer: the debounce and the time / held inputs."""
        self.cancel()
        for i in self.all_inputs:
            i.stop()

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

    # --- loading -------------------------------------------------------------

    def load_plans(self, plans: "list[dict]", *, boot: "bool | None" = None) -> None:
        """boot: True when this load is the HA start; None keeps "the first call is the start"."""
        old = self._rules
        first, self._started = not self._started, True
        if boot is None:
            boot = first
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
            raws = [r for r in plan.get("rules") or [] if isinstance(r, dict) and isinstance(r.get("id"), str)]
            names = {r["id"]: (r.get("name") if isinstance(r.get("name"), str) else r["id"]) for r in raws}
            for raw in raws:
                rule = _Rule(pid, raw, devices, names)
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
                rules[rule.key] = rule
        for key, prev in old.items():
            if key not in rules:
                prev.stop()
        self._rules = rules
        self._link()
        self._settle(set(rules))
        self._published = {key: self._trace(r) for key, r in rules.items()}
        for pid in list(self._subs):
            self._notify(pid, True, self.snapshot(pid))

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
            for i in (p for top in rule.all_inputs for p in top.parts()):
                if i.eid is not None and key not in self._readers.get(i.eid, []):
                    self._readers.setdefault(i.eid, []).append(key)
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
        out = {"label": i.label, "value": value, "detail": detail}
        if i.type == "held" and wake is not None:
            out["until"] = int(wake * 1000)
        if i.timer is not None and i.timer[0] != wake:
            i.stop()
        if wake is not None and i.timer is None:
            key = rule.key
            i.timer = (wake, self._schedule(max(0.0, wake - self._now()), lambda: self._wake(key, i)))
        return out

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
        if i.type == "light":
            return (*self._light(i), None)
        if i.type == "sun":
            return (*_read_sun(self._lookup), None)
        return (*_read(i.kind, i.eid, self._lookup), None)

    def _light(self, i: _Input) -> "tuple[bool | None, str]":
        """Below the threshold: true; above it plus the hysteresis: false; in between: the previous value."""
        st = self._lookup(i.eid) if i.eid else None
        if st is None:
            return None, "missing"
        if st[0] in ("unknown", "unavailable"):
            return None, st[0]
        if (st[1] or {}).get("unit_of_measurement") != "lx":
            return None, "not lx"
        try:
            v = float(st[0])
        except ValueError:
            return None, "unknown"
        if not math.isfinite(v):
            return None, "unknown"
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
        its last known value, so it does not restart the count."""
        values = [self._value(rule, s, now)[0] for s in i.sources]
        if all(v is None for v in values):
            return None, "unknown", None
        i.mem = [m if v is None else v for v, m in zip(values, i.mem)]
        combined = True in i.mem
        if i.known is None:
            i.since = -math.inf if i.boot else self._since(i, now)
        elif combined != i.known:
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
        for s in i.sources:
            at = self._changed_at(s.eid) if s.rule is None and s.eid else None
            stamps.append(now if at is None else min(at, now))
        return max(stamps)

    def _evaluate(self, rule: _Rule, due: "_Pending | None" = None) -> bool:
        """Recompute the rule; True when its debounced verdict changed. An opening gate sends the current verdict."""
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

    # --- state changes -------------------------------------------------------

    def handle_state(self, entity_id: str) -> None:
        keys = self._readers.get(entity_id)
        if not keys and entity_id not in self._targets:
            return
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
        return out

    def snapshot(self, plan_id: str) -> "dict[str, dict]":
        return {rid: self._trace(r) for (pid, rid), r in self._rules.items() if pid == plan_id}

    def _flush(self) -> None:
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
