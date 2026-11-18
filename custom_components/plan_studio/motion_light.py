"""The Light motion control rule: motion sensors (any of them) switch one light while it is dark, with an off delay, a
minimum on time and a manual / auto mode set by smart buttons only (without a button the rule is always in auto). A
change of the light made elsewhere never changes the mode: in auto the rule adapts to it. Must not import
homeassistant.

The rule engine owns the I/O (the sensor and daylight inputs, the holder slots, timers and trace frames); this module
holds the rule's configuration, its runtime state and the decisions."""

from __future__ import annotations

from typing import Callable

# entity id -> (state, attributes); None when the entity is missing
Lookup = Callable[[str], "tuple[str, dict] | None"]

BUTTONS = ("smart_button",)


def _str(v: object) -> str | None:
    return v if isinstance(v, str) and v else None


def _kind(device: "dict | None") -> str | None:
    p = device.get("props") if isinstance(device, dict) else None
    return p.get("kind") if isinstance(p, dict) else None


def _whole(v: object, top: int) -> int:
    return v if type(v) is int and 0 <= v <= top else 0


class MotionLight:
    def __init__(self, raw: dict, devices: dict, eid: str | None) -> None:
        """eid: the light's on / off control entity (None when it cannot be switched on and off)."""
        self.light = _str(raw.get("light"))
        self.sensors = [s for s in raw.get("sensors") or [] if isinstance(s, str)]
        d = raw.get("daylight")
        ok = isinstance(d, dict) and _str(d.get("sensor")) is not None and d.get("is") in ("night", "dark")
        self.daylight: "tuple[str, str] | None" = (d["sensor"], d["is"]) if ok else None
        self.min_on = _whole(raw.get("minOn"), 3600)
        self.buttons = [b for b in raw.get("buttons") or [] if isinstance(b, str)]
        self.auto_after = _whole(raw.get("autoAfter"), 1440)
        light = devices.get(self.light) if self.light else None
        name = light.get("name") if light else None
        self.label = name if isinstance(name, str) and name else self.light or ""
        self.eid = eid
        self.missing = light is None \
            or any(_kind(devices.get(s)) != "motion_sensor" for s in self.sensors) \
            or (self.daylight is not None and _kind(devices.get(self.daylight[0])) != "illuminance_sensor") \
            or any(_kind(devices.get(b)) not in BUTTONS for b in self.buttons)
        # the mode survives a Save that keeps these
        self.ident = (eid, tuple(self.buttons))
        # runtime state, kept for the same ident
        self.mode = "auto"
        self.since: float | None = None  # epoch s: entering manual, then the last motion while manual
        self.moving = False  # manual: motion at the previous evaluation (its end is the last motion)
        self.on_at: float | None = None  # when the rule decided to switch the light on (None for a light found on)
        self.seen: str | None = None  # the light's last on / off reading (None after no data)
        self.entered = False  # auto was just entered: its entry stays the last one (no "found on" over it)
        # the rule's own recent decisions (state, until epoch s): a late echo of one is never a foreign change
        self.own: list[tuple[str, float]] = []
        self.waiting = False  # switched off elsewhere while held: no switch-on until every motion sensor was clear
        self.timer: "tuple[float, Callable[[], None]] | None" = None  # the auto-return

    def inputs(self) -> "list[dict]":
        """The rule's inputs, in this order: the motion sensors, then the daylight (when set)."""
        out: list[dict] = [{"source": {"device": s}} for s in self.sensors]
        if self.daylight is not None:
            out.append({"source": {"daylight": self.daylight[0], "is": self.daylight[1]}})
        return out

    def take(self, old: "MotionLight") -> None:
        self.mode, self.since, self.moving, self.on_at = old.mode, old.since, old.moving, old.on_at
        self.seen, self.entered, self.own, self.waiting = old.seen, old.entered, list(old.own), old.waiting

    def stop(self) -> None:
        if self.timer is not None:
            self.timer[1]()
            self.timer = None

    def state(self, lookup: Lookup) -> str | None:
        st = lookup(self.eid) if self.eid else None
        return st[0] if st is not None and st[0] in ("on", "off") else None

    def restore(self, mode: str, since: "float | None") -> None:
        """A mode read from the store (evaluated once HA has started)."""
        self.mode, self.since = mode, since

    # --- decisions --------------------------------------------------------------

    def motion(self, values: "list[bool | None]") -> bool:
        """Any motion sensor on; a sensor without data counts as no motion."""
        return True in values[:len(self.sensors)]

    def dark(self, values: "list[bool | None]") -> bool:
        """The daylight input matches; no data, or no daylight configured, counts as dark."""
        if self.daylight is None:
            return True
        n = len(self.sensors)
        return (values[n] if len(values) > n else None) is not False

    def raw(self, values: "list[bool | None]", light_on: bool) -> "bool | None":
        """Want the light on: motion, and dark unless the light is on already (the block applies to switching on).
        None without motion sensors (auto does nothing). While waiting for new motion: not while the motion lasts; the
        wait ends once every sensor is clear."""
        if not self.sensors:
            return None
        motion = self.motion(values)
        if self.waiting:
            self.waiting = motion
            return False
        return motion and (self.dark(values) or light_on)

    def off_delay(self, now: float, off_delay: int) -> float:
        """The delay of an off: the off delay, but not before the minimum on time since the rule's on decision."""
        if self.on_at is None:
            return off_delay
        return max(off_delay, self.on_at + self.min_on - now)

    def press(self, intent: dict, light: "str | None") -> "tuple[str | None, str | None]":
        """A smart button intent: (mode change "manual" | "auto" | None, the state to command | None)."""
        action = intent.get("action")
        if action == "toggle":
            return "manual", "off" if light == "on" else "on"
        if action == "set" and intent.get("value") in ("on", "off"):
            value = intent["value"]
            return "manual", None if light == value else value
        if action == "auto":
            return "auto", None
        return None, None

    def decide(self, state: str, now: float, window: float) -> None:
        """The rule decided `state` (sent or not): for `window` s a change of the light to it is the rule's own."""
        self.own = [o for o in self.own if o[1] > now]
        self.own.append((state, now + window))

    def light_changed(self, state: "str | None", confirms: bool, active: bool, held: bool,
                      now: float = 0.0) -> "str | None":
        """A state change of the light; it never changes the mode. In auto with motion sensors: "back" for a return
        from no data (the auto start applies again); a known -> known change to a state the rule itself decided within
        its window is its own late echo (every such change uses up the earliest matching decision): None; otherwise
        "found" for a change to on while the rule does not hold the light (switched on elsewhere, also by another slot
        participant: held from now) and "released" for a change to off while it holds the light that does not confirm
        the slots' last command (switched off elsewhere: the rule lets go). Else None (manual, no motion sensors)."""
        was, self.seen = self.seen, state
        self.own = [o for o in self.own if o[1] > now]
        if not active or self.mode != "auto" or not self.sensors or state is None or state == was:
            return None
        if was is None:
            return "back"
        mine = next((o for o in self.own if o[0] == state), None)  # in decision order: the earliest
        if mine is not None:
            self.own.remove(mine)
            return None
        if state == "on":
            return None if held else "found"
        return "released" if held and not confirms else None

    def auto_due(self, now: float, motion: bool) -> "float | None":
        """While manual with auto_after > 0: the epoch auto returns at (None while motion lasts); `since` moves only to
        the moment the motion ends. At or after it the caller enters auto."""
        if self.mode != "manual" or self.auto_after <= 0:
            return None
        if (self.moving and not motion) or self.since is None:
            self.since = now
        self.moving = motion
        return None if motion else self.since + self.auto_after * 60

    def trace(self, values: "list[bool | None]", labels: "list[str]", light: "str | None", now: float,
              off_at: "int | None") -> dict:
        out: dict = {
            "mode": self.mode,
            "motion": self.motion(values),
            "sensors": [{"id": s, "name": label, "state": None if v is None else "on" if v else "off"}
                        for s, label, v in zip(self.sensors, labels, values)],
            "dark": None if self.daylight is None else self.dark(values),
            "light": light,
        }
        if self.waiting:
            out["waiting"] = True
        if off_at is not None:
            out["offAt"] = off_at
        if self.on_at is not None and self.on_at + self.min_on > now:
            out["minUntil"] = int((self.on_at + self.min_on) * 1000)
        if self.mode == "manual" and self.auto_after > 0 and self.since is not None and not self.moving:
            out["autoAt"] = int((self.since + self.auto_after * 60) * 1000)
        return out
