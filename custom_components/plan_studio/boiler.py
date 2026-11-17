"""The Boiler rule (AppDaemon Feature_Boiler ported 1:1): manual / auto mode and the auto steps.

Must not import homeassistant.

The rule engine owns the I/O (service calls, timers, trace frames); this module holds the rule's configuration, its
runtime state and the decisions."""

from __future__ import annotations

import math
from typing import Callable

# entity id -> (state, attributes); None when the entity is missing
Lookup = Callable[[str], "tuple[str, dict] | None"]

WATTS = {"W": 1.0, "kW": 1e3, "MW": 1e6, "mW": 1e-3}  # as power.py; any other unit (or none) reads as unknown
OFF_WAIT = 15  # s after the rule's last off before it may switch on again
ON_WAIT = 60  # s after an on before "heating done" may be concluded
IDLE_W = 1.0  # a boiler drawing no more than this is done heating
BUTTONS = ("wall_switch", "smart_button")
RELAY_DOMAINS = ("light", "switch", "fan")  # entities with turn_on / turn_off
MODES = ("auto", "manual")


def watts(st: "tuple[str, dict] | None") -> float | None:
    """A power reading in W; None for no data, a non-number or a unit outside WATTS."""
    if st is None:
        return None
    try:
        v = float(st[0])
    except (TypeError, ValueError):
        return None
    factor = WATTS.get((st[1] or {}).get("unit_of_measurement")) if isinstance(st[1], dict) else None
    return v * factor if factor is not None and math.isfinite(v) else None


def _w(v: float | None) -> float | None:
    return None if v is None else round(v, 1) + 0.0  # + 0.0 turns -0.0 into 0.0


def _str(v: object) -> str | None:
    return v if isinstance(v, str) and v else None


def _bound(device: dict | None, role: str) -> str | None:
    b = device.get("bindings") if device else None
    return _str(b.get(role)) if isinstance(b, dict) else None


class Boiler:
    def __init__(self, raw: dict, devices: dict, blocks: dict) -> None:
        self.device, self.button = _str(raw.get("device")), _str(raw.get("button"))
        dev = devices.get(self.device) if self.device else None
        name = dev.get("name") if dev else None
        self.label = name if isinstance(name, str) and name else self.device or ""
        relay = _bound(dev, "control")
        self.relay = relay if relay and relay.split(".", 1)[0] in RELAY_DOMAINS else None
        self.power = _bound(dev, "power")
        btn = devices.get(self.button) if self.button else None
        props = btn.get("props") if btn else None
        button_ok = isinstance(props, dict) and props.get("kind") in BUTTONS
        grid = raw.get("grid") if isinstance(raw.get("grid"), dict) else None
        block_id = _str(grid.get("block")) if grid else None
        block = blocks.get(block_id) if block_id else None
        self.grid = _str(block.get("power")) if block and block.get("kind") == "grid" else None
        self.limited = grid is not None
        self.limit = float(grid["limit"]) if grid and isinstance(grid.get("limit"), (int, float)) else 3000.0
        self.nominal = float(grid["nominal"]) if grid and isinstance(grid.get("nominal"), (int, float)) else 1400.0
        self.missing = self.relay is None or self.power is None or not button_ok or (self.limited and self.grid is None)
        # the mode survives a Save that keeps these
        self.ident = (self.device, self.button, block_id if grid else None)
        self.reads = [e for e in (self.relay, self.power, self.grid) if e]
        # runtime state, kept across a Save with the same ident
        self.mode = "manual"
        self.phase: str | None = None  # heating / waiting / blackout / limit / done; None in manual
        self.last_on: float | None = None  # epoch s of the rule's last on (or auto entered with the relay on)
        self.last_off: float | None = None  # epoch s of the rule's last off, held at now while an off reason lasts
        self.holding = False  # blackout / limit at the last auto evaluation
        self.cmd: str | None = None  # the last command sent, until the relay moves away from it
        self.seen: str | None = None  # the relay's last on / off reading (None after no data)
        self.sends = 0  # send counter: a late failure or a held call counts only for the latest send
        # derived on every evaluation
        self.until: float | None = None
        self.timer: "tuple[float, Callable[[], None]] | None" = None
        self.view: dict = {}

    def take(self, old: "Boiler") -> None:
        self.mode, self.phase, self.last_on, self.last_off = old.mode, old.phase, old.last_on, old.last_off
        self.holding, self.cmd, self.seen, self.sends = old.holding, old.cmd, old.seen, old.sends

    def stop(self) -> None:
        if self.timer is not None:
            self.timer[1]()
            self.timer = None

    def relay_state(self, lookup: Lookup) -> str | None:
        st = lookup(self.relay) if self.relay else None
        return st[0] if st is not None and st[0] in ("on", "off") else None

    def readings(self, lookup: Lookup) -> "tuple[float | None, float | None, str | None]":
        """(grid W, boiler W, relay on / off) with None for no data; the grid only with a power limit."""
        grid = watts(lookup(self.grid)) if self.limited and self.grid else None
        power = watts(lookup(self.power)) if self.power else None
        return grid, power, self.relay_state(lookup)

    # --- mode -----------------------------------------------------------------

    def enter_auto(self, now: float, relay: str | None) -> None:
        if self.mode != "auto":
            self.mode, self.phase, self.holding = "auto", None, False
            if relay == "on":
                self.last_on = now  # the 60 s grace applies before "done"

    def manual(self) -> None:
        self.mode, self.phase, self.holding = "manual", None, False

    def relay_changed(self, relay: str | None, own: bool, active: bool) -> bool:
        """A state change of the relay; True when a human took over (an on <-> off change not caused by Plan Studio
        while auto): the mode becomes manual. A return from no data is never a take-over."""
        human = active and self.mode == "auto" and not own and None not in (self.seen, relay) and relay != self.seen
        self.seen = relay
        if human:
            self.manual()
        return human

    # --- commands ---------------------------------------------------------------

    def command(self, do: str, now: float) -> str:
        """Stamp a command that is being sent."""
        self.cmd = do
        if do == "on":
            self.last_on = now
        else:
            self.last_off = now
        return do

    def _want(self, do: str, relay: str | None, now: float) -> str | None:
        """Auto sends a command only when the relay is not in that state and it was not sent already."""
        return None if relay == do or self.cmd == do else self.command(do, now)

    def press(self, intent: dict, relay: str | None, now: float) -> "tuple[bool, str | None, str]":
        """A button intent: (consumed, command to send, reason)."""
        action = intent.get("action")
        if action == "toggle":
            self.manual()
            return True, self.command("off" if relay == "on" else "on", now), "button toggle"
        if action == "set" and intent.get("value") in ("on", "off"):
            self.manual()
            value = intent["value"]
            return True, None if relay == value else self.command(value, now), f"button {value}"
        if action == "auto":
            self.enter_auto(now, relay)
            return True, None, ""
        return False, None, ""

    # --- auto -------------------------------------------------------------------

    def auto(self, now: float, grid: float | None, power: float | None, relay: str | None) -> "tuple[str | None, str]":
        """One auto evaluation: (command to send or None, reason); sets the phase and the time to look again."""
        self.until = None
        if self.limited:
            if grid is None:
                return self._off(now, relay, "blackout", "blackout")
            if grid + self.nominal - (power or 0.0) > self.limit:
                return self._off(now, relay, "limit", "power limit")
        if self.holding:
            # the off reason lasted until now (AppDaemon re-sent off every 5 s): the 15 s wait counts from here
            self.holding, self.last_off = False, now
        if self.last_off is not None and now - self.last_off < OFF_WAIT:
            self.phase, self.until = "waiting", self.last_off + OFF_WAIT
            return None, ""
        self.phase = "heating"
        do = self._want("on", relay, now)
        if self.last_on is not None and now - self.last_on < ON_WAIT:
            self.until = self.last_on + ON_WAIT
            return do, "auto"
        if power is None or power > IDLE_W:
            return do, "auto"  # never conclude "done" without data
        self.mode, self.phase = "manual", "done"
        return self._want("off", relay, now), "heating done"

    def _off(self, now: float, relay: str | None, phase: str, why: str) -> "tuple[str | None, str]":
        self.phase, self.holding, self.last_off = phase, True, now
        return self._want("off", relay, now), why

    def trace(self, grid: float | None, power: float | None, relay: str | None) -> dict:
        out = {
            "mode": self.mode,
            "phase": self.phase,
            "grid": _w(grid),
            "boilerW": _w(power),
            # the compared value: grid + nominal - boiler (unknown boiler counts 0) against the limit
            "headroom": _w(grid + self.nominal - (power or 0.0)) if grid is not None else None,
            "relay": relay,
        }
        if self.until is not None:
            out["until"] = int(self.until * 1000)
        return out
