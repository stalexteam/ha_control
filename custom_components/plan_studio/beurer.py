"""The Beurer heater rule: a heating pad is kept on while a plan device (the PC) draws more than a threshold; the pad
switches itself off after an hour, so its socket is power-cycled (off, a short pause, on) at an interval. Must not
import homeassistant.

The rule engine owns the I/O (the power input, the off delay, the holder slots, timers and trace frames); this module
holds the rule's configuration, its runtime state and the power-cycle decisions."""

from __future__ import annotations

import math
from typing import Callable

# entity id -> (state, attributes); None when the entity is missing
Lookup = Callable[[str], "tuple[str, dict] | None"]

PAUSE = 5  # s the socket stays off in a power-cycle
DEFAULT_ABOVE = 200.0  # W
DEFAULT_KEEP = 10  # minutes
DEFAULT_EVERY = 30  # minutes


def _str(v: object) -> str | None:
    return v if isinstance(v, str) and v else None


def _minutes(v: object, default: int) -> int:
    return v if type(v) is int and 0 <= v <= 1440 else default


class Beurer:
    def __init__(self, raw: dict, devices: dict, eid: str | None, power: str | None) -> None:
        """eid: the heater's on / off control entity; power: the source's power entity (None = missing)."""
        self.heater, self.source = _str(raw.get("heater")), _str(raw.get("source"))
        a = raw.get("above")
        self.above = float(a) if type(a) in (int, float) and math.isfinite(a) and a > 0 else DEFAULT_ABOVE
        self.keep = _minutes(raw.get("keep"), DEFAULT_KEEP)
        self.every = _minutes(raw.get("every"), DEFAULT_EVERY)
        heater = devices.get(self.heater) if self.heater else None
        name = heater.get("name") if heater else None
        self.label = name if isinstance(name, str) and name else self.heater or ""
        self.missing = heater is None or power is None
        self.eid = eid
        # runtime state, kept across a Save that leaves the rule unchanged
        self.seen: str | None = None  # the heater's last on / off reading (None after no data)
        self.fresh = False  # the rule itself switched the heater on from off: `since` is trustworthy
        self.since = 0.0  # epoch s the heater read on after that command
        self.pause: float | None = None  # epoch s the running power-cycle pause ends; None when no cycle runs
        self.timer: "tuple[float, Callable[[], None]] | None" = None  # the pause end or the next cycle

    def input(self) -> dict:
        """The rule's one input: the source's power above the threshold, the last value kept `keep` min without data."""
        return {"source": {"power": {"device": self.source, "above": self.above, "keep": self.keep}}}

    def take(self, old: "Beurer") -> None:
        self.seen, self.fresh, self.since, self.pause = old.seen, old.fresh, old.since, old.pause

    def stop(self) -> None:
        if self.timer is not None:
            self.timer[1]()
            self.timer = None

    def state(self, lookup: Lookup) -> str | None:
        st = lookup(self.eid) if self.eid else None
        return st[0] if st is not None and st[0] in ("on", "off") else None

    def heater_changed(self, state: str | None, ours: bool, wanted: bool, now: float) -> bool:
        """A state change of the heater, before the evaluation; True when it went off (from on or from no data) while
        wanted: it gets on again. A change during a power-cycle pause is the cycle's own. The heater is fresh only when
        it went from off to on by our command. ours: the change carries a Plan Studio context or confirms the slots'
        last command."""
        was, self.seen = self.seen, state
        if self.pause is not None:
            return False
        if state is None:
            self.fresh = False
            return False
        if state == was:
            return False
        if state == "on":
            self.fresh = was == "off" and ours
            if self.fresh:
                self.since = now
            return False
        self.fresh = False
        return wanted

    def step(self, now: float, wanted: bool, state: str | None) -> str | None:
        """The power-cycle after an evaluation: "off" (start a pause, or repeat it while the heater still reads on),
        "on" (the pause ended with the heater off; sent only while a rule holds it) or None."""
        if self.pause is not None:
            if now < self.pause:
                return None
            if state == "on":  # a slow socket: off again, never on while it reads on
                self.pause = now + PAUSE
                return "off"
            self.pause = None
            if state == "off":
                return "on"
            self.fresh = False  # no data: the cycle is dropped
            return None
        if self.every > 0 and wanted and state == "on" and (not self.fresh or now - self.since >= self.every * 60):
            self.pause, self.fresh = now + PAUSE, False
            return "off"
        return None

    def wake(self) -> float | None:
        """When the power-cycle has to be looked at again: the pause end, else the next cycle while fresh."""
        if self.pause is not None:
            return self.pause
        if self.fresh and self.every > 0:
            return self.since + self.every * 60
        return None
