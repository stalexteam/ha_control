"""Daylight of an illuminance sensor: thresholds (mirror of the panel's daylightProps), the raw state from lux or the
sun elevation, and the debounced state shared by every rule reading the sensor. Must not import homeassistant.

The rule engine owns the timers; this module holds the configuration, the state and the decisions."""

from __future__ import annotations

import math
from typing import Callable

# entity id -> (state, attributes); None when the entity is missing
Lookup = Callable[[str], "tuple[str, dict] | None"]

DEFAULTS = {"nightBelow": 10, "dayAbove": 50, "sunNight": -6, "sunDay": 3, "debounce": 60}
DEBOUNCE_MAX = 3600
NIGHT, TWILIGHT, DAY = "night", "twilight", "day"


def _num(v: object) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool) and math.isfinite(v)


def _pair_ok(p: dict, low: str, high: str, floor: "float | None") -> bool:
    """Both thresholds of a pair (each optional) are numbers and low < high after defaults (and low >= floor)."""
    if any(k in p and not _num(p[k]) for k in (low, high)):
        return False
    lo, hi = p.get(low, DEFAULTS[low]), p.get(high, DEFAULTS[high])
    return (floor is None or lo >= floor) and lo < hi


def _debounce(p: dict) -> int:
    """Missing, or a whole number of seconds 0..3600; anything else is the default."""
    if "debounce" not in p:
        return DEFAULTS["debounce"]
    v = p["debounce"]
    whole = isinstance(v, int) and not isinstance(v, bool) or isinstance(v, float) and v.is_integer()
    return int(v) if whole and 0 <= v <= DEBOUNCE_MAX else DEFAULTS["debounce"]


def props(device: dict) -> dict:
    """The thresholds with defaults for missing fields; an invalid value or pair falls back to the defaults of that
    pair (the panel's daylightProps)."""
    raw = device.get("props") if isinstance(device, dict) else None
    p = raw if isinstance(raw, dict) and raw.get("kind") == "illuminance_sensor" else {}
    lux = _pair_ok(p, "nightBelow", "dayAbove", 0)
    sun = _pair_ok(p, "sunNight", "sunDay", None)
    return {
        "nightBelow": p.get("nightBelow", DEFAULTS["nightBelow"]) if lux else DEFAULTS["nightBelow"],
        "dayAbove": p.get("dayAbove", DEFAULTS["dayAbove"]) if lux else DEFAULTS["dayAbove"],
        "sunNight": p.get("sunNight", DEFAULTS["sunNight"]) if sun else DEFAULTS["sunNight"],
        "sunDay": p.get("sunDay", DEFAULTS["sunDay"]) if sun else DEFAULTS["sunDay"],
        "debounce": _debounce(p),
    }


def bound(device: dict, role: str) -> "str | None":
    b = device.get("bindings") if isinstance(device, dict) else None
    v = b.get(role) if isinstance(b, dict) else None
    return v if isinstance(v, str) and v else None


def entities(device: dict) -> "list[str]":
    """The bound entities the state is read from: the lux sensor and the sun (only when bound)."""
    return [e for e in (bound(device, "illuminance"), bound(device, "sun")) if e]


def _band(v: float, night: float, day: float) -> str:
    return NIGHT if v < night else DAY if v > day else TWILIGHT


def _lux(device: dict, lookup: Lookup) -> "float | None":
    eid = bound(device, "illuminance")
    st = lookup(eid) if eid else None
    if st is None or (st[1] or {}).get("unit_of_measurement") != "lx":
        return None
    try:
        v = float(st[0])
    except (TypeError, ValueError):
        return None  # unavailable / unknown / not a number
    return v if math.isfinite(v) else None


def _elevation(device: dict, lookup: Lookup) -> "float | None":
    eid = bound(device, "sun")
    st = lookup(eid) if eid else None
    if st is None or st[0] in ("unavailable", "unknown"):
        return None
    e = (st[1] or {}).get("elevation")
    return float(e) if _num(e) else None


def raw_state(device: dict, lookup: Lookup) -> "tuple[str | None, str]":
    """(night / twilight / day, the reading: "8 lx" or "sun -3.2°") from the lux sensor, else from the sun elevation;
    (None, "no data") when neither is usable."""
    p = props(device)
    v = _lux(device, lookup)
    if v is not None:
        return _band(v, p["nightBelow"], p["dayAbove"]), f"{v:g} lx"
    e = _elevation(device, lookup)
    if e is not None:
        return _band(e, p["sunNight"], p["sunDay"]), f"sun {round(e, 1) + 0.0:g}°"
    return None, "no data"


def countdown(seconds: float) -> str:
    """m:ss of the time left (whole seconds, rounded up)."""
    s = max(0, math.ceil(seconds))
    return f"{s // 60}:{s % 60:02d}"


class Daylight:
    """The debounced state of one sensor: the first raw state (or any after no data) is accepted at once; a different
    raw state only after it has held `debounce` s (a change back cancels it); no data is accepted at once."""

    def __init__(self, device: dict) -> None:
        self.device = device
        self.props = props(device)
        self.eids = entities(device)
        # an unchanged sensor keeps its state and pending change across a Save
        self.sig = (bound(device, "illuminance"), bound(device, "sun"), tuple(sorted(self.props.items())))
        self.state: str | None = None  # debounced
        self.reading = "no data"  # of the current raw state
        self.to: str | None = None  # pending: the raw state waiting to be accepted
        self.due: float | None = None  # pending: epoch s it is accepted at
        self.cancel: Callable[[], None] | None = None  # pending: its timer

    def step(self, raw: "str | None", reading: str, now: float) -> bool:
        """Take a raw state; True when a new pending change needs a timer (at self.due)."""
        self.reading = reading
        if raw is None or self.state is None or raw == self.state or self.props["debounce"] == 0:
            self.stop()
            self.state = raw
            return False
        if raw == self.to:
            return False  # still holding
        self.stop()
        self.to, self.due = raw, now + self.props["debounce"]
        return True

    def accept(self) -> None:
        """The pending change has held long enough."""
        self.state, self.to, self.due, self.cancel = self.to, None, None, None

    def stop(self) -> None:
        if self.cancel is not None:
            self.cancel()
        self.to = self.due = self.cancel = None

    def trace(self, want: str, now: float) -> "tuple[bool | None, str]":
        """(value, detail) of an input asking night / dark / day."""
        if self.state is None:
            return None, "no data"
        value = self.state == want or (want == "dark" and self.state in (NIGHT, TWILIGHT))
        detail = f"{self.state}, {self.reading}"
        if self.to is not None and self.due is not None:
            detail += f" ({self.to} in {countdown(self.due - now)})"
        return value, detail
