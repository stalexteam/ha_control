"""Input containers (wall switch, smart button) as stateless intent sources. Must not import homeassistant."""

from __future__ import annotations

from typing import Callable

# entity id -> (state, attributes); None when the entity is missing
Lookup = Callable[[str], "tuple[str, dict] | None"]

UNAVAILABLE = "unavailable"


def expected_value(slot: int, event: str) -> str:
    return event if slot == 0 else f"{slot}_{event}"


def _bool(props: dict, key: str) -> bool:
    v = props.get(key)
    return v if isinstance(v, bool) else False


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


def _set(value: str) -> dict:
    return {"action": "set", "value": value}


class Container:
    kind = ""

    def __init__(self, device: dict, lookup: Lookup):
        props = device.get("props")
        self._props = props if isinstance(props, dict) else {}
        b = device.get("bindings")
        self._bindings = b if isinstance(b, dict) else {}
        self._lookup = lookup

    def _ready(self) -> None:
        """Called by the subclass once its config is read: the status before the first change."""
        self._seen = self.status()

    # active roles: all of them are required and watched
    def _roles(self) -> list[str]:
        raise NotImplementedError

    def _bound(self, role: str) -> str | None:
        v = self._bindings.get(role)
        return v if isinstance(v, str) and v else None

    def entity_ids(self) -> set[str]:
        return {e for e in (self._bound(r) for r in self._roles()) if e}

    def status(self) -> dict:
        if any(self._bound(r) is None for r in self._roles()):
            return {"status": "error", "reason": "not_configured"}
        bad = sorted(e for e in self.entity_ids() if _unavailable(self._lookup(e)))
        if bad:
            return {"status": "error", "reason": "unavailable", "entities": bad}
        return {"status": "ok"}

    def handle(self, entity_id, old, new, now: float, own: bool = False) -> list[dict]:
        """Intents (without "at") for one state change; none while the status is error before or after it."""
        if entity_id not in self.entity_ids():
            return []
        before, self._seen = self._seen, self.status()
        if before["status"] == "error" or self._seen["status"] == "error":
            return []
        return self._intents(entity_id, old, new, now, own)

    def _intents(self, entity_id, old, new, now, own) -> list[dict]:
        raise NotImplementedError


class WallSwitch(Container):
    kind = "wall_switch"

    def __init__(self, device, lookup):
        super().__init__(device, lookup)
        self._flag = _bool(self._props, "autoByDoubleToggle")
        w = self._props.get("windowSec")
        self._window = w if isinstance(w, int) and not isinstance(w, bool) and 1 <= w <= 10 else 3
        self._last_toggle: float | None = None
        self._ready()

    def _roles(self):
        return ["state"]

    def _intents(self, entity_id, old, new, now, own):
        # Own commands and anything but a manual on<->off change are not presses (and do not touch the window).
        if own or not (old and new and {old[0], new[0]} == {"on", "off"}):
            return []
        if self._flag:
            prev, self._last_toggle = self._last_toggle, now
            if prev is not None and now - prev <= self._window:
                return [{"action": "auto"}]
        return [_set(new[0])]


class SmartButton(Container):
    kind = "smart_button"

    def __init__(self, device, lookup):
        super().__init__(device, lookup)
        p = self._props
        self._split = _bool(p, "separateOff")
        self._auto_on = _bool(p, "autoEnabled")
        # order matters: on, off, auto (the first matching trigger wins)
        self._triggers = [("on", _trigger(p, "on", "single"))]
        if self._split:
            self._triggers.append(("off", _trigger(p, "off", "hold")))
        if self._auto_on:
            self._triggers.append(("auto", _trigger(p, "auto", "double")))
        self._ready()

    def _roles(self):
        return [role for role, _ in self._triggers]

    def _is_press(self, role, expected, old, new) -> bool:
        if old is None or new is None or old[0] == UNAVAILABLE or old[0] == new[0]:
            return False
        if self._bound(role).startswith("event."):
            return new[1].get("event_type") == expected
        return new[0] == expected

    def _intents(self, entity_id, old, new, now, own):
        for role, expected in self._triggers:
            if self._bound(role) == entity_id and self._is_press(role, expected, old, new):
                if role == "on":
                    return [_set("on") if self._split else {"action": "toggle"}]
                return [_set("off") if role == "off" else {"action": "auto"}]
        return []


def build(device: dict, lookup: Lookup) -> "Container | None":
    props = device.get("props")
    kind = props.get("kind") if isinstance(props, dict) else None
    if kind == "wall_switch":
        return WallSwitch(device, lookup)
    if kind == "smart_button":
        return SmartButton(device, lookup)
    return None
