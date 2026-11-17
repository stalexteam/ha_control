"""The Timed switch rule: a button starts a timed run of a device (on for N minutes, then off; inverted: off, then on).

Must not import homeassistant.

The rule engine owns the I/O (service calls, timers, trace frames); this module holds the rule's configuration, its
runtime state and the decisions."""

from __future__ import annotations

from typing import Callable

# entity id -> (state, attributes); None when the entity is missing
Lookup = Callable[[str], "tuple[str, dict] | None"]

BUTTONS = ("wall_switch", "smart_button")
DEFAULT_MINUTES = 15


def _str(v: object) -> str | None:
    return v if isinstance(v, str) and v else None


class Timed:
    def __init__(self, raw: dict, devices: dict, eid: str | None) -> None:
        """eid: the device's on / off control entity (None when the device cannot be switched on and off)."""
        self.button, self.device = _str(raw.get("button")), _str(raw.get("device"))
        m = raw.get("minutes")
        self.minutes = m if type(m) is int and 1 <= m <= 1440 else DEFAULT_MINUTES
        self.invert = raw.get("invert") is True
        self.run, self.final = ("off", "on") if self.invert else ("on", "off")
        dev = devices.get(self.device) if self.device else None
        name = dev.get("name") if dev else None
        self.label = name if isinstance(name, str) and name else self.device or ""
        btn = devices.get(self.button) if self.button else None
        props = btn.get("props") if btn else None
        button_ok = isinstance(props, dict) and props.get("kind") in BUTTONS
        self.eid = eid
        self.missing = eid is None or not button_ok
        # a run survives a Save that keeps these (a new duration applies from the next start)
        self.ident = (self.button, self.device, self.eid, self.invert)
        # runtime state, kept across a Save with the same ident
        self.until: float | None = None  # epoch s the running run ends; None when idle
        self.restored = False  # the run came from the store and has not been evaluated since HA started
        self.cmd: str | None = None  # the commanded state: the last command of the rule (sent or found in place)
        self.confirmed = False  # the device has read the commanded state since it was commanded
        self.seen: str | None = None  # the device's last on / off reading (None after no data)
        self.timer: "tuple[float, Callable[[], None]] | None" = None

    @property
    def running(self) -> bool:
        return self.until is not None

    def take(self, old: "Timed") -> None:
        self.until, self.restored, self.cmd, self.confirmed = old.until, old.restored, old.cmd, old.confirmed
        self.seen = old.seen

    def stop(self) -> None:
        if self.timer is not None:
            self.timer[1]()
            self.timer = None

    def state(self, lookup: Lookup) -> str | None:
        st = lookup(self.eid) if self.eid else None
        return st[0] if st is not None and st[0] in ("on", "off") else None

    def restore(self, until: float, state: str | None) -> None:
        """A run read from the store: it is evaluated once HA has started."""
        self.until, self.restored = until, True
        self.cmd, self.confirmed, self.seen = self.run, state == self.run, state

    def command(self, do: str, state: str | None) -> bool:
        """Make `do` the commanded state; True when it has to be sent: not when the device reads it already and no
        other command of the rule is still on its way (an unconfirmed opposite command is overridden)."""
        send = not (state == do and (self.cmd in (None, do) or self.confirmed))
        self.cmd, self.confirmed = do, state == do
        return send

    def press(self, intent: dict, now: float) -> "tuple[bool, str | None, str]":
        """A button intent: (consumed, the state to command, reason). Start (toggle / set on) starts or restarts the
        run; stop (set off) ends a running run with the final state; stop while idle, auto and the rest are ignored."""
        action, value = intent.get("action"), intent.get("value")
        if action == "toggle" or (action == "set" and value == "on"):
            why = "button restart" if self.running else "button start"
            self.until, self.restored = now + self.minutes * 60, False
            return True, self.run, why
        if action == "set" and value == "off" and self.running:
            self.until, self.restored = None, False
            return True, self.final, "button stop"
        return False, None, ""

    def device_changed(self, state: str | None, own: bool, active: bool) -> bool:
        """A state change of the device; True when someone else switched it while running (the run ends). A change to
        the commanded state confirms it (any context, any delay); a change to or a return from no data never ends the
        run, nor does a change carrying a Plan Studio context."""
        was, self.seen = self.seen, state
        if state is not None and state == self.cmd:
            self.confirmed = True
            return False
        if not active or not self.running or own or state is None or was is None or state == was:
            return False
        self.until, self.restored = None, False
        return True

    def trace(self, lookup: Lookup) -> dict:
        out: dict = {"running": self.running}
        if self.until is not None:
            out["until"] = int(self.until * 1000)
        out["device"] = self.state(lookup)
        return out
