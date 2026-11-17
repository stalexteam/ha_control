"""The Outside light rule: a light follows the daylight of an illuminance sensor (optionally only after sunset and in
a time window) and pauses after a manual switch. Must not import homeassistant.

The rule engine owns the I/O (the daylight state, the sun and window inputs, the holder slots, timers and trace
frames); this module holds the rule's configuration, its runtime state and the decisions."""

from __future__ import annotations

from typing import Callable

# entity id -> (state, attributes); None when the entity is missing
Lookup = Callable[[str], "tuple[str, dict] | None"]

DEFAULT_PAUSE = 30  # minutes


def _str(v: object) -> str | None:
    return v if isinstance(v, str) and v else None


def _kind(device: "dict | None") -> str | None:
    p = device.get("props") if isinstance(device, dict) else None
    return p.get("kind") if isinstance(p, dict) else None


class Outside:
    def __init__(self, raw: dict, devices: dict, eid: str | None) -> None:
        """eid: the light's on / off control entity (None when the light cannot be switched on and off)."""
        self.light, self.sensor = _str(raw.get("light")), _str(raw.get("sensor"))
        self.no_data_night = raw.get("noDataNight") is True
        self.after_sunset = raw.get("afterSunset") is True
        w = raw.get("window")
        self.window = (w.get("from"), w.get("to")) if isinstance(w, dict) else None
        p = raw.get("pause")
        self.pause = p if type(p) is int and 0 <= p <= 1440 else DEFAULT_PAUSE
        light = devices.get(self.light) if self.light else None
        name = light.get("name") if light else None
        self.label = name if isinstance(name, str) and name else self.light or ""
        sensor = devices.get(self.sensor) if self.sensor else None
        self.missing = light is None or _kind(sensor) != "illuminance_sensor"
        self.eid = eid
        # runtime state, kept across a Save that leaves the rule unchanged
        self.until: float | None = None  # epoch s the manual pause ends; None when not paused
        self.restored = False  # the pause came from the store and has not been evaluated since HA started
        self.seen: str | None = None  # the light's last on / off reading (None after no data)
        self.timer: "tuple[float, Callable[[], None]] | None" = None  # the pause end

    def inputs(self) -> "list[dict]":
        """The rule's inputs, in this order: the daylight, the sun (after sunset only), the window (when set)."""
        out: list[dict] = [{"source": {"daylight": self.sensor or "", "is": "night"}}]
        if self.after_sunset:
            out.append({"source": {"sun": True}})
        if self.window is not None:
            out.append({"source": {"time": {"from": self.window[0], "to": self.window[1]}}})
        return out

    def want(self, values: "list[bool | None]") -> "bool | None":
        """Want on from the input values (daylight is night, sun below, in the window): unknown daylight counts as night
        with noDataNight, else it is unknown, and the want stays as it was unless another part is false; an unknown sun
        (or window) is not satisfied."""
        day = values[0] if values else None
        if day is None and self.no_data_night:
            day = True
        rest = [v is True for v in values[1:]]
        if False in rest or day is False:
            return False
        return None if day is None else True

    def take(self, old: "Outside") -> None:
        self.until, self.restored, self.seen = old.until, old.restored, old.seen

    def stop(self) -> None:
        if self.timer is not None:
            self.timer[1]()
            self.timer = None

    def state(self, lookup: Lookup) -> str | None:
        st = lookup(self.eid) if self.eid else None
        return st[0] if st is not None and st[0] in ("on", "off") else None

    def restore(self, until: float) -> None:
        """A pause read from the store: it keeps the rule out of the slots until it is evaluated after HA started."""
        self.until, self.restored = until, True

    def paused(self, now: float, booting: bool) -> bool:
        """Whether the rule is out of the slots now; an expired pause ends here (a restored one only after HA
        started)."""
        if self.until is None:
            return False
        if booting and self.restored:
            return True
        self.restored = False
        if self.until <= now:
            self.until = None
            return False
        return True

    def light_changed(self, state: str | None, ours: bool, active: bool, now: float) -> str | None:
        """A state change of the light: "manual" when someone else switched it between known states (the pause
        starts or restarts; never with pause 0), "back" when it returned from no data (never a switch), else None.
        ours: the change carries a Plan Studio context or confirms the slots' last command."""
        was, self.seen = self.seen, state
        if not active or ours or state is None or state == was:
            return None
        if was is None:
            return "back"
        if self.pause <= 0:
            return None
        self.until, self.restored = now + self.pause * 60, False
        return "manual"
