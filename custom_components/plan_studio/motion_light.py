"""The Light motion control rule: motion sensors (any of them) switch one light while it is dark, with an off delay, a
minimum on time and a manual / auto mode set by its buttons only: smart buttons and wall switches, also the light's own
relay (without a button the rule is always in auto). A change of the light made elsewhere never changes the mode: in
auto the rule adapts to it. In auto the daylight coming switches a held light off at once, and an optional blocker (any
on / off device, normally a virtual switch "Sleep") switches it off and keeps the rule from acting while it reads the
chosen state. With presence the light is kept on after the zone's motion ends while no motion sensor of a neighbouring
zone has seen motion since the zone's motion started (someone sits still), up to HOLD_MAX. Must not import
homeassistant.

The rule engine owns the I/O (the sensor and daylight inputs, the holder slots, timers and trace frames); this module
holds the rule's configuration, its runtime state and the decisions."""

from __future__ import annotations

from typing import Callable

# entity id -> (state, attributes); None when the entity is missing
Lookup = Callable[[str], "tuple[str, dict] | None"]

BUTTONS = ("smart_button", "wall_switch")
HOLD_MAX = 1800  # s: the longest presence hold without a neighbour's motion (spec presence hold §3)


def _str(v: object) -> str | None:
    return v if isinstance(v, str) and v else None


def _kind(device: "dict | None") -> str | None:
    p = device.get("props") if isinstance(device, dict) else None
    return p.get("kind") if isinstance(p, dict) else None


def _state_entity(device: "dict | None") -> str | None:
    """A wall switch's bound state entity (its flips are its presses)."""
    b = device.get("bindings") if isinstance(device, dict) else None
    return _str(b.get("state")) if isinstance(b, dict) else None


def _button(device: "dict | None") -> bool:
    """A smart button, or a wall switch with its state entity bound."""
    kind = _kind(device)
    return kind in BUTTONS and (kind != "wall_switch" or _state_entity(device) is not None)


def _whole(v: object, top: int) -> int:
    return v if type(v) is int and 0 <= v <= top else 0


def _name(device: "dict | None", fallback: str) -> str:
    name = device.get("name") if isinstance(device, dict) else None
    return name if isinstance(name, str) and name else fallback


class MotionLight:
    def __init__(self, raw: dict, devices: dict, eid: str | None, blocker: str | None = None) -> None:
        """eid: the light's on / off control entity (None when it cannot be switched on and off); blocker: the blocker
        device's on / off input entity (None when it cannot be read as one)."""
        self.light = _str(raw.get("light"))
        self.sensors = [s for s in raw.get("sensors") or [] if isinstance(s, str)]
        d = raw.get("daylight")
        ok = isinstance(d, dict) and _str(d.get("sensor")) is not None and d.get("is") in ("night", "dark")
        self.daylight: "tuple[str, str] | None" = (d["sensor"], d["is"]) if ok else None
        bl = raw.get("blocker")
        ok = isinstance(bl, dict) and _str(bl.get("device")) is not None and bl.get("is") in ("on", "off")
        self.blocker: "tuple[str, str] | None" = (bl["device"], bl["is"]) if ok else None  # blocked while it reads `is`
        self.blocker_at = len(self.sensors) + (self.daylight is not None)  # the blocker's index among the inputs
        # presence (spec presence hold §3): the motion sensors of the neighbouring zones, computed by the panel; an id
        # that is not a motion sensor of the plan (moved, deleted), the light or one of the rule's own sensors is ignored
        self.presence = raw.get("presence") is True
        listed = raw.get("neighbours") if self.presence and isinstance(raw.get("neighbours"), list) else []
        self.neighbours: list[str] = []
        for n in listed:
            if isinstance(n, str) and n not in self.sensors and n != self.light and n not in self.neighbours \
                    and _kind(devices.get(n)) == "motion_sensor":
                self.neighbours.append(n)
        self.neighbour_names = [_name(devices.get(n), n) for n in self.neighbours]
        self.neighbour_at = self.blocker_at + (self.blocker is not None)  # the first neighbour's index among the inputs
        self.min_on = _whole(raw.get("minOn"), 3600)
        self.buttons = [b for b in raw.get("buttons") or [] if isinstance(b, str)]
        self.auto_after = _whole(raw.get("autoAfter"), 1440)
        light = devices.get(self.light) if self.light else None
        self.label = _name(light, self.light or "")
        self.blocker_label = _name(devices.get(self.blocker[0]), self.blocker[0]) if self.blocker is not None else ""
        self.eid = eid
        self.missing = light is None \
            or any(_kind(devices.get(s)) != "motion_sensor" for s in self.sensors) \
            or (self.daylight is not None and _kind(devices.get(self.daylight[0])) != "illuminance_sensor") \
            or any(not _button(devices.get(b)) for b in self.buttons) \
            or (self.blocker is not None and blocker is None)
        # the wall switch buttons over the light's own entity: a flip of one is the press and the light's change at once
        self.relays = {b for b in self.buttons if eid is not None and _kind(devices.get(b)) == "wall_switch"
                       and _state_entity(devices.get(b)) == eid}
        # the mode survives a Save that keeps these
        self.ident = (eid, tuple(self.buttons))
        # runtime state, kept for the same ident
        self.mode = "auto"
        self.since: float | None = None  # epoch s: entering manual, then the last motion while manual
        self.moving = False  # manual: motion at the previous evaluation (its end is the last motion)
        self.on_at: float | None = None  # when the rule decided to switch the light on (None for a light found on)
        self.seen: str | None = None  # the light's last on / off reading (None after no data)
        self.entered = False  # auto was just entered: the evaluation takes a fresh decision (no "found on")
        # auto was entered with an off sent: until this epoch s (or the light reads off) a reading on is that off on its way
        self.dropped: float | None = None
        # the rule's own recent decisions (state, until epoch s): a late echo of one is never a foreign change
        self.own: list[tuple[str, float]] = []
        self.waiting = False  # switched off elsewhere while held: no switch-on until every motion sensor was clear
        self.presses = 0  # button presses and mode changes: a press's command is wanted only until the next one
        self.timer: "tuple[float, Callable[[], None]] | None" = None  # the auto-return
        # the blocker's last known reading: True while it reads `is` (None until the rule's first evaluation)
        self.blocked: bool | None = None
        self.met: bool | None = None  # the daylight condition at the previous evaluation (None: no data)
        # a daylight off was decided: the light reading on no longer keeps it (an off kept back by another holder or
        # lost must not be undone by motion) until the condition is met again or the rule holds a light again
        self.day_off = False
        # the presence hold: when it started (epoch s; None: no hold), the neighbour sensor that saw motion since the
        # zone's last motion start (a departure), and the own and neighbour sensors' values at the previous evaluation
        self.hold_from: float | None = None
        self.left: str | None = None
        self.zone_was: "list[bool | None]" = []
        self.next_to: "list[bool | None]" = []

    def inputs(self) -> "list[dict]":
        """The rule's inputs, in this order: the motion sensors, then the daylight (when set), then the blocker (when
        set; true after its NOT while it does not read `is`: the rule may act), then the neighbour sensors (presence;
        read only by the hold, never motion of the zone)."""
        out: list[dict] = [{"source": {"device": s}} for s in self.sensors]
        if self.daylight is not None:
            out.append({"source": {"daylight": self.daylight[0], "is": self.daylight[1]}})
        if self.blocker is not None:
            out.append({"source": {"device": self.blocker[0]}, "not": self.blocker[1] == "on"})
        out += [{"source": {"device": n}} for n in self.neighbours]
        return out

    def take(self, old: "MotionLight") -> None:
        self.mode, self.since, self.moving, self.on_at = old.mode, old.since, old.moving, old.on_at
        self.seen, self.entered, self.own, self.waiting = old.seen, old.entered, list(old.own), old.waiting
        self.dropped, self.presses, self.blocked, self.met = old.dropped, old.presses, old.blocked, old.met
        self.day_off = old.day_off
        self.hold_from, self.left = old.hold_from, old.left
        self.zone_was, self.next_to = list(old.zone_was), list(old.next_to)

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

    def block(self, values: "list[bool | None]") -> str | None:
        """Follow the blocker's reading (values after NOT): "start" / "end" when its known reading changed, None
        otherwise. No data keeps the last known reading; at the rule's first evaluation (HA start, a new rule, a changed
        Save) the reading is taken without a change, no data there counting as not blocking."""
        if self.blocker is None:
            return None
        k = self.blocker_at
        free = values[k] if len(values) > k else None
        if self.blocked is None:
            self.blocked = free is False
            return None
        if free is None or (free is False) == self.blocked:
            return None
        self.blocked = free is False
        return "start" if self.blocked else "end"

    def day_came(self, values: "list[bool | None]") -> bool:
        """The daylight condition went from met to not met since the previous evaluation (between known readings: to
        or from no data is no change, as no data counts as dark). Met again ends a daylight off's mark."""
        if self.daylight is None:
            return False
        n = len(self.sensors)
        was, self.met = self.met, values[n] if len(values) > n else None
        if self.met is True:
            self.day_off = False
        return was is True and self.met is False

    def raw(self, values: "list[bool | None]", light_on: bool) -> "bool | None":
        """Want the light on: motion, and dark unless the light is on already (a light found on in daylight stays while
        the motion lasts; the daylight coming switches a held light off: see day_came, and after that off the light
        reading on no longer counts: day_off). None without motion sensors (auto does nothing). While waiting for new
        motion: not while the motion lasts; the wait ends once every sensor is clear."""
        if not self.sensors:
            return None
        motion = self.motion(values)
        if self.waiting:
            self.waiting = motion
            return False
        return motion and (self.dark(values) or (light_on and not self.day_off))

    def off_delay(self, now: float, off_delay: int) -> float:
        """The delay of an off: the off delay, but not before the minimum on time since the rule's on decision."""
        if self.on_at is None:
            return off_delay
        return max(off_delay, self.on_at + self.min_on - now)

    def hold(self, values: "list[bool | None]", now: float, holding: bool) -> bool:
        """The presence hold (spec presence hold §3 with its Task 1 review amendments), at every evaluation in auto while
        not blocked, after the rule's own decisions; holding: the rule holds the light (verdict true). True while the
        light is kept on for someone still in the zone.
        Departure (`left`): a neighbour sensor's known off -> on after the zone's last motion start (a known off -> on of
        any own sensor), recorded also while the zone still reads motion (a sensor reads motion for its timeout after
        the last movement); a neighbour already on when the zone's motion started counts only after an off; a new
        motion start of the zone clears it; to or from no data tells nothing.
        Hold: starts at the zone's motion END while the rule holds the light (the zone read motion at the previous
        evaluation and every own sensor that did now reads a known off) unless a departure is recorded (then the off
        delay starts at once); it lasts while no departure comes and HOLD_MAX has not passed. A light taken as found
        on without a motion end is not held. Motion in the zone or the rule no longer holding the light ends it. Never
        without neighbour sensors."""
        n, k = len(self.sensors), self.neighbour_at
        own = [values[i] if len(values) > i else None for i in range(n)]
        seen = [values[k + j] if len(values) > k + j else None for j in range(len(self.neighbours))]
        was, self.zone_was = self.zone_was, own
        prev, self.next_to = self.next_to, seen
        if not self.neighbours:
            return False
        if any(p is False and s is True for p, s in zip(was, own)):
            self.left = None  # the zone's motion (re)started: an earlier departure no longer counts
        j = next((j for j, (p, s) in enumerate(zip(prev, seen)) if p is False and s is True), None)
        if j is not None:
            self.left = self.neighbour_names[j]
        if True in own or not holding:
            self.hold_from = None
            return False
        ended = True in was and all(s is False for p, s in zip(was, own) if p is True)
        if ended and self.left is None:
            self.hold_from = now
        return self.present(now)

    def present(self, now: float) -> bool:
        """The light is kept on for someone still in the zone (see hold)."""
        return self.hold_from is not None and self.left is None and now < self.hold_from + HOLD_MAX

    def hold_until(self, now: float) -> float | None:
        """The epoch s the presence hold ends at while it lasts."""
        return self.hold_from + HOLD_MAX if self.present(now) and self.hold_from is not None else None

    def unhold(self) -> None:
        """No presence hold and no departure; the sensors are read anew (manual, blocked, inactive, entering auto, a
        changed Save, the light back from no data)."""
        self.hold_from = self.left = None
        self.zone_was, self.next_to = [], []

    def press(self, intent: dict, light: "str | None") -> "tuple[str | None, str | None]":
        """A button intent: (mode change "manual" | "auto" | None, the state to command | None). A wall switch's flip
        over the light's own entity sets the state the light already reads: nothing to command."""
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
        the slots' last command (switched off elsewhere: the rule lets go). "back" and "released" drop the recorded
        decisions (a later change is foreign). While blocked a change elsewhere (also a return from no data) is left
        alone: None. Else None (manual, no motion sensors). Any reading other than on clears `dropped` (the off of
        entering auto has arrived)."""
        was, self.seen = self.seen, state
        if state != "on":
            self.dropped = None
        self.own = [o for o in self.own if o[1] > now]
        if not active or self.mode != "auto" or not self.sensors or state is None or state == was:
            return None
        if was is None:
            self.own = []  # the light is taken as it is: older decisions are stale
            return None if self.blocked else "back"
        mine = next((o for o in self.own if o[0] == state), None)  # in decision order: the earliest
        if mine is not None:
            self.own.remove(mine)
            return None
        if self.blocked:
            return None
        if state == "on":
            return None if held else "found"
        if held and not confirms:
            self.own = []  # switched off elsewhere: older decisions are stale
            return "released"
        return None

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
        if self.mode == "auto" and self.blocked:
            out["blocked"] = True
        if off_at is not None:
            out["offAt"] = off_at
        if self.on_at is not None and self.on_at + self.min_on > now:
            out["minUntil"] = int((self.on_at + self.min_on) * 1000)
        if self.mode == "manual" and self.auto_after > 0 and self.since is not None and not self.moving:
            out["autoAt"] = int((self.since + self.auto_after * 60) * 1000)
        until = self.hold_until(now)
        if until is not None:
            out["present"] = True
            out["holdUntil"] = int(until * 1000)
        if self.left is not None and off_at is not None:
            out["left"] = self.left  # while the off delay runs: the neighbour sensor that saw the departure
        if self.presence:
            out["neighbours"] = [{"id": n, "name": name} for n, name in zip(self.neighbours, self.neighbour_names)]
        return out
