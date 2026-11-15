"""Input container state machines (wall switch, smart button). Must not import homeassistant."""

from __future__ import annotations

from typing import Callable

# entity id -> (state, attributes); None when the entity is missing
Lookup = Callable[[str], "tuple[str, dict] | None"]

OUTPUTS = ("on", "off", "auto", "error")
UNAVAILABLE = "unavailable"


def expected_value(slot: int, event: str) -> str:
    return event if slot == 0 else f"{slot}_{event}"


def _bool(props: dict, key: str) -> bool:
    v = props.get(key)
    return v if isinstance(v, bool) else False


def _output(props: dict, auto_allowed: bool) -> str:
    v = props.get("defaultOutput")
    if v not in OUTPUTS or (v == "auto" and not auto_allowed):
        return "off"
    return v


def _trigger(props: dict, key: str, default_event: str) -> str:
    t = props.get(key)
    slot, event = 0, default_event
    if isinstance(t, dict):
        s, e = t.get("slot"), t.get("event")
        if isinstance(s, int) and not isinstance(s, bool) and 0 <= s <= 9:
            slot = s
        if isinstance(e, str) and e:
            event = e
    return expected_value(slot, event)


def _unavailable(st: "tuple[str, dict] | None") -> bool:
    return st is None or st[0] == UNAVAILABLE


class Container:
    kind = ""

    def __init__(self, device: dict, lookup: Lookup):
        props = device.get("props")
        self._props = props if isinstance(props, dict) else {}
        b = device.get("bindings")
        self._bindings = b if isinstance(b, dict) else {}
        self._lookup = lookup
        self._default = "off"
        self._pub: dict | None = None

    # roles whose binding is required / watched
    def _roles(self) -> list[str]:
        raise NotImplementedError

    def _required(self) -> list[str]:
        return self._roles()

    def _bound(self, role: str) -> str | None:
        v = self._bindings.get(role)
        return v if isinstance(v, str) and v else None

    def entity_ids(self) -> set[str]:
        return {e for e in (self._bound(r) for r in self._roles()) if e}

    def _fault(self) -> "tuple[str | None, list[str]]":
        if any(self._bound(r) is None for r in self._required()):
            return "not_configured", []
        bad = sorted(e for e in self.entity_ids() if _unavailable(self._lookup(e)))
        return ("unavailable", bad) if bad else (None, [])

    def _output_now(self) -> str:
        raise NotImplementedError

    def public(self) -> dict:
        fault, ents = self._fault()
        out = {"output": self._default if fault else self._output_now(), "fault": fault}
        if fault == "unavailable":
            out["entities"] = ents
        return out

    def _step(self, entity_id, old, new, now, fault_before, fault_after) -> None:
        raise NotImplementedError

    def handle(self, entity_id, old, new, now) -> bool:
        if entity_id not in self.entity_ids():
            return False
        before = self._pub if self._pub is not None else self.public()
        fault_after = self._fault()[0]
        self._step(entity_id, old, new, now, before["fault"], fault_after)
        after = self.public()
        self._pub = after
        return after != before

    def persisted(self) -> "str | None":
        raise NotImplementedError


class WallSwitch(Container):
    kind = "wall_switch"

    def __init__(self, device, lookup, restored):
        super().__init__(device, lookup)
        self._flag = _bool(self._props, "autoByDoubleToggle")
        w = self._props.get("windowSec")
        self._window = w if isinstance(w, int) and not isinstance(w, bool) and 1 <= w <= 10 else 3
        self._default = _output(self._props, self._flag)
        self._auto = self._flag and restored == "auto"
        self._last_toggle: float | None = None
        self._pub = self.public()

    def _roles(self):
        return ["state"]

    def _output_now(self):
        if self._auto and self._flag:
            return "auto"
        st = self._lookup(self._bound("state"))
        return "on" if st and st[0] == "on" else "off"

    def _step(self, entity_id, old, new, now, fault_before, fault_after):
        if not (old and new and old[0] != new[0] and {old[0], new[0]} == {"on", "off"}):
            return
        if self._flag:
            prev = self._last_toggle
            self._auto = prev is not None and now - prev <= self._window
            self._last_toggle = now

    def persisted(self):
        return "auto" if self._auto and self._flag else None


class SmartButton(Container):
    kind = "smart_button"

    def __init__(self, device, lookup, restored):
        super().__init__(device, lookup)
        p = self._props
        self._split = _bool(p, "separateOff")
        self._auto_on = _bool(p, "autoEnabled")
        self._default = _output(p, self._auto_on)
        self._triggers = [("on", _trigger(p, "on", "single"))]
        if self._split:
            self._triggers.append(("off", _trigger(p, "off", "hold")))
        if self._auto_on:
            self._triggers.append(("auto", _trigger(p, "auto", "double")))
        allowed = ("on", "off", "error") + (("auto",) if self._auto_on else ())
        self._last = restored if restored in allowed else self._default
        self._pub = self.public()

    def _roles(self):
        roles = ["on"]
        if self._split:
            roles.append("off")
        if self._auto_on:
            roles.append("auto")
            if not self._split:
                roles.append("final")
        return roles

    def _required(self):
        return [r for r in self._roles() if r != "final"]

    def _output_now(self):
        return self._last

    def _is_press(self, role, expected, old, new) -> bool:
        if old is None or new is None or old[0] == UNAVAILABLE or old[0] == new[0]:
            return False
        if self._bound(role).startswith("event."):
            return new[1].get("event_type") == expected
        return new[0] == expected

    def _step(self, entity_id, old, new, now, fault_before, fault_after):
        if fault_before or fault_after:
            return
        for role, expected in self._triggers:
            if self._bound(role) == entity_id and self._is_press(role, expected, old, new):
                self._apply(role)
                return

    def _apply(self, role):
        if role != "on" or self._split:
            self._last = role
        elif self._last == "on":
            self._last = "off"
        elif self._last == "auto":
            final = self._bound("final")
            st = self._lookup(final) if final else None
            self._last = ("off" if st and st[0] == "on" else "on") if final else "off"
        else:
            self._last = "on"

    def persisted(self):
        return self._last


def build(device: dict, lookup: Lookup, restored: "str | None") -> "Container | None":
    props = device.get("props")
    kind = props.get("kind") if isinstance(props, dict) else None
    if kind == "wall_switch":
        return WallSwitch(device, lookup, restored)
    if kind == "smart_button":
        return SmartButton(device, lookup, restored)
    return None
