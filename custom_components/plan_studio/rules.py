"""Condition rules: three-valued verdicts, debounce and edge actions over all saved plans. Must not import homeassistant."""

from __future__ import annotations

import copy
import json
import logging
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
    if True in values:
        return True
    return None if None in values else False


class _Input:
    def __init__(self, raw: dict, devices: dict, rule_names: dict) -> None:
        src = raw.get("source") if isinstance(raw.get("source"), dict) else {}
        self.negate = raw.get("not") is True
        self.cyclic = False
        self.rule: str | None = src.get("rule") if isinstance(src.get("rule"), str) else None
        self.device: dict | None = None
        self.kind = self.eid = None
        if self.rule is not None:
            self.missing = self.rule not in rule_names
            self.label = rule_names.get(self.rule) or self.rule
            self.sig: tuple = ("rule", self.rule)
            return
        did = src.get("device") if isinstance(src.get("device"), str) else ""
        self.device = devices.get(did)
        self.missing = self.device is None
        self.label = _label(self.device, did)
        if self.device is not None:
            self.kind = _kind(self.device)
            self.eid = _bound(self.device, INPUT_ROLE.get(self.kind or ""))
        self.sig = ("device", did, self.kind, self.eid)


class _Action:
    def __init__(self, raw: dict, devices: dict) -> None:
        did = raw.get("device") if isinstance(raw.get("device"), str) else ""
        device = devices.get(did)
        self.do = raw.get("do") if isinstance(raw.get("do"), str) else ""
        self.label = _label(device, did)
        self.call = _target(device, self.do)


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
        self.on_true = [_Action(a, devices) for a in raw.get("onTrue") or [] if isinstance(a, dict)]
        self.on_false = [_Action(a, devices) for a in raw.get("onFalse") or [] if isinstance(a, dict)]
        self.on_delay = _delay(raw.get("onDelay"))
        self.off_delay = _delay(raw.get("offDelay"))
        self.sig = (
            json.dumps(raw, sort_keys=True, default=str),
            tuple(i.sig for i in self.inputs),
            tuple(a.call for a in self.on_true + self.on_false),
        )
        # runtime state, kept across a reload that leaves the rule unchanged
        self.verdict: bool | None = None  # the debounced verdict; None until first known
        self.pending: _Pending | None = None
        self.last: dict | None = None
        self.failed = False  # a service call of the last firing raised
        # derived on every evaluation
        self.raw: bool | None = None
        self.trace_inputs: list[dict] = []

    def adopt(self, old: "_Rule") -> None:
        self.verdict, self.pending, self.last, self.failed = old.verdict, old.pending, old.last, old.failed

    def cancel(self) -> None:
        if self.pending is not None:
            self.pending.cancel()
            self.pending = None

    def static_reason(self) -> str | None:
        found = set()
        for i in self.inputs:
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
        call: Callable[[str, str, str], None],
        schedule: Callable[[float, Callable[[], None]], Callable[[], None]],
    ) -> None:
        self._lookup = lookup
        self._now = now  # epoch seconds
        self._call = call
        self._schedule = schedule
        self._rules: dict[Key, _Rule] = {}
        self._order: dict[Key, int] = {}  # referenced rules before their consumers
        self._consumers: dict[Key, list[Key]] = {}
        self._readers: dict[str, list[Key]] = {}
        self._published: dict[Key, dict] = {}
        self._subs: dict[str, list[Callback]] = {}

    # --- loading -------------------------------------------------------------

    def load_plans(self, plans: "list[dict]") -> None:
        old = self._rules
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
                elif prev is not None:
                    prev.cancel()
                rules[rule.key] = rule
        for key, prev in old.items():
            if key not in rules:
                prev.cancel()
        self._rules = rules
        self._link()
        self._settle(set(rules))
        self._published = {key: self._trace(r) for key, r in rules.items()}
        for pid in list(self._subs):
            self._notify(pid, True, self.snapshot(pid))

    def _link(self) -> None:
        """Order rules so references come first; a reference closing a cycle is marked and ignored."""
        self._order, self._consumers, self._readers = {}, {}, {}
        state: dict[Key, int] = {}

        def visit(key: Key) -> None:
            state[key] = 1
            for i in self._rules[key].inputs:
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
            for i in rule.inputs:
                if i.eid is not None and key not in self._readers.get(i.eid, []):
                    self._readers.setdefault(i.eid, []).append(key)

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
            if i.rule is not None:
                ref = self._rules.get((rule.key[0], i.rule))
                value = ref.verdict if ref is not None and ref.enabled and not i.cyclic else None
                detail = "missing" if i.missing else "unknown" if value is None else "on" if value else "off"
            elif i.missing:
                value, detail = None, "missing"
            else:
                value, detail = _read(i.kind, i.eid, self._lookup)
            trace.append({"label": i.label, "value": value, "detail": detail})
            values.append(value if value is None or not i.negate else not value)
        rule.raw = combine(rule.mode, values) if values else None
        rule.trace_inputs = trace

    def _evaluate(self, rule: _Rule) -> bool:
        """Recompute the rule; True when its debounced verdict changed."""
        self._compute(rule)
        raw = rule.raw
        if not rule.enabled:
            return False
        if raw is None:
            rule.cancel()
            return False
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
        self._compute(rule)
        if rule.raw == pending.to:
            self._commit(rule, pending.to, "became true" if pending.to else "became false")
            self._settle(set(self._consumers.get(key, ())))
        else:
            self._settle({key})
        self._flush()

    def _commit(self, rule: _Rule, verdict: bool, why: str) -> None:
        rule.verdict = verdict
        if verdict or why != "start":
            self._fire(rule, rule.on_true if verdict else rule.on_false, why)

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
        last = first_error = None
        failed = False
        for a in actions:
            entry = {"action": a.do, "target": a.label, "at": at, "reason": reason}
            if a.call is None:
                entry["error"] = "target missing"
            else:
                try:
                    self._call(*a.call)
                except Exception as err:  # noqa: BLE001 - one failing target must not stop the others
                    _LOGGER.warning("rule %s: %s.%s %s failed: %s", rule.name, *a.call, err)
                    entry["error"] = str(err) or type(err).__name__
                    failed = True
            if "error" in entry and first_error is None:
                first_error = entry
            last = entry
        rule.last = first_error or last
        rule.failed = failed

    # --- state changes -------------------------------------------------------

    def handle_state(self, entity_id: str) -> None:
        keys = self._readers.get(entity_id)
        if not keys:
            return
        self._settle(set(keys))
        self._flush()

    def entity_ids(self) -> "set[str]":
        return set(self._readers)

    # --- live trace ----------------------------------------------------------

    def _trace(self, rule: _Rule) -> dict:
        if not rule.enabled:
            status, reason = "disabled", None
        else:
            reason = rule.static_reason() or ("service failed" if rule.failed else None)
            status = "error" if reason else "waiting" if rule.raw is None else "ok"
        out: dict = {"status": status}
        if reason:
            out["reason"] = reason
        out["verdict"] = rule.verdict if rule.enabled else None
        if rule.pending is not None:
            out["pending"] = {"to": rule.pending.to, "at": rule.pending.at}
        out["inputs"] = [dict(t) for t in rule.trace_inputs]
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
