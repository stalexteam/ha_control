"""The Boiler rule (AppDaemon Feature_Boiler ported 1:1): manual / auto mode and the auto steps.

Must not import homeassistant.

The rule engine owns the I/O (service calls, timers, trace frames); this module holds the rule's configuration, its
runtime state and the decisions."""

from __future__ import annotations

from typing import Callable

try:
    from .power import _read
except ImportError:  # pytest: module dir on sys.path
    from power import _read

# entity id -> (state, attributes); None when the entity is missing
Lookup = Callable[[str], "tuple[str, dict] | None"]

OFF_WAIT = 15  # s after the rule's last off before it may switch on again
ON_WAIT = 60  # s after an on before "heating done" may be concluded
IDLE_W = 1.0  # a boiler drawing no more than this is done heating
# After the relay's on <-> off change at T the grid and the boiler meters report about every 5 s in either order, so
# for some seconds one of them is stale. A meter's reading is SETTLED when it reported at or after T + LAG, or stayed
# silent SILENT of its own periods after T + LAG, or (period unknown) SETTLE s after T, or in any case CAP s after T.
# The power limit is judged only when both meters are settled (spec reading-stats §4, replacing boiler spec §11's 10 s).
LAG = 2  # s: a report this soon after the switch may still carry a measurement taken before it
SILENT = 2  # periods
SETTLE = 10  # s, a meter whose period is unknown (the 0.23.1 rule)
CAP = 30  # s: a real overload is never left unjudged longer
TICK = 1  # s: while the meters settle the rule looks again this often (a same-value report wakes nobody)
NO_REPORTS: "tuple[float | None, float | None]" = (None, None)  # a meter's (last report epoch s, period s)
BUTTONS = ("wall_switch", "smart_button")
RELAY_DOMAINS = ("light", "switch", "fan")  # entities with turn_on / turn_off
MODES = ("auto", "manual")


def watts(lookup: Lookup, eid: str) -> float | None:
    """A power reading in W as the Power step reads it (W, kW, MW, mW; no unit = W); None for no data."""
    return _read(lookup, eid, "power")


def settle_at(switched: float, last: float | None, period: float | None) -> float:
    """The moment a meter counts as settled after the relay switched at `switched` when it stays silent."""
    return min(switched + CAP, switched + LAG + SILENT * period if period is not None else switched + SETTLE)


def settled(switched: float, last: float | None, period: float | None, now: float) -> bool:
    return (last is not None and last >= switched + LAG) or now >= settle_at(switched, last, period)


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
        props = dev.get("props") if dev else None
        # equipment is switched only when marked controllable (as the actions of condition rules)
        switchable = not (isinstance(props, dict) and props.get("kind") == "equipment" and props.get("controllable") is not True)
        self.relay = relay if switchable and relay and relay.split(".", 1)[0] in RELAY_DOMAINS else None
        self.power = _bound(dev, "power")
        btn = devices.get(self.button) if self.button else None
        btn_props = btn.get("props") if btn else None
        button_ok = isinstance(btn_props, dict) and btn_props.get("kind") in BUTTONS
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
        self.last_do: str | None = None  # the last command sent, kept
        self.seen: str | None = None  # the relay's last on / off reading (None after no data)
        self.switched: float | None = None  # epoch s the relay last changed between on and off (whoever switched it)
        self.sends = 0  # send counter: a late failure or a held call counts only for the latest send
        # derived on every evaluation
        self.until: float | None = None  # the time to look again (the engine's timer)
        self.due: float | None = None  # the phase's own deadline (waiting / grace), shown in the trace
        self.settling: float | None = None  # the latest moment the limit is judged while the meters settle
        self.undecided = False  # the last auto evaluation could not tell the limit from the bounds (spec reading-stats §4.1)
        self.timer: "tuple[float, Callable[[], None]] | None" = None
        self.view: dict = {}

    def take(self, old: "Boiler") -> None:
        self.mode, self.phase, self.last_on, self.last_off = old.mode, old.phase, old.last_on, old.last_off
        self.holding, self.cmd, self.seen, self.sends = old.holding, old.cmd, old.seen, old.sends
        self.last_do, self.switched = old.last_do, old.switched

    def stop(self) -> None:
        if self.timer is not None:
            self.timer[1]()
            self.timer = None

    def relay_state(self, lookup: Lookup) -> str | None:
        st = lookup(self.relay) if self.relay else None
        return st[0] if st is not None and st[0] in ("on", "off") else None

    def readings(self, lookup: Lookup) -> "tuple[float | None, float | None, str | None]":
        """(grid W, boiler W, relay on / off) with None for no data; the grid only with a power limit."""
        grid = watts(lookup, self.grid) if self.limited and self.grid else None
        power = watts(lookup, self.power) if self.power else None
        return grid, power, self.relay_state(lookup)

    # --- mode -----------------------------------------------------------------

    def enter_auto(self, now: float, relay: str | None) -> None:
        if self.mode != "auto":
            self.mode, self.phase, self.holding = "auto", None, False
            if relay == "on":
                self.last_on = now  # the 60 s grace applies before "done"

    def manual(self) -> None:
        self.mode, self.phase, self.holding = "manual", None, False

    def see(self, relay: str | None, now: float) -> bool:
        """Take a relay reading; True for a change between on and off, which starts the settle time (not a return from
        no data, not the same state)."""
        switch = None not in (self.seen, relay) and relay != self.seen
        if switch:
            self.switched = now
        self.seen = relay
        return switch

    def relay_changed(self, relay: str | None, own: bool, active: bool, now: float) -> bool:
        """A state change of the relay; True when a human took over (an on <-> off change not caused by Plan Studio
        while auto): the mode becomes manual. A return from no data is never a take-over, nor is a change to the
        rule's outstanding command (HA keeps a call's context only ~5 s; a slow relay confirms later without it).
        own: any Plan Studio context, so another rule switching the relay is not a take-over either (that is a
        configuration conflict, not a human). An on <-> off change by anyone starts the settle time."""
        redone = self.mode == "manual" and self.phase == "done" and relay == "on" and self.seen != "on"
        switch = self.see(relay, now)
        human = active and self.mode == "auto" and not own and switch and relay != self.cmd
        if redone:
            self.phase = None  # switched on again after heating done: "heating done" no longer describes the relay
        if human:
            self.manual()
        return human

    # --- commands ---------------------------------------------------------------

    def command(self, do: str, now: float) -> str:
        """Stamp a command that is being sent."""
        self.cmd = self.last_do = do
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

    def auto(self, now: float, grid: float | None, power: float | None, relay: str | None,
             grid_meter: "tuple[float | None, float | None]" = NO_REPORTS,
             power_meter: "tuple[float | None, float | None]" = NO_REPORTS) -> "tuple[str | None, str]":
        """One auto evaluation: (command to send or None, reason); sets the phase and the time to look again.
        grid_meter / power_meter: (last report, period) of the grid and the boiler meters, None for unknown."""
        # the latest moment both meters count as settled after the relay switched; None: settled (or nothing switched)
        waits = [settle_at(self.switched, *m) for m in (grid_meter, power_meter)
                 if not settled(self.switched, *m, now)] if self.limited and self.switched is not None else []
        self.settling = None
        out = self._auto(now, grid, power, relay, max(waits) if waits else None)
        self.due = self.until
        if self.mode != "auto":
            self.settling = None
        if self.settling is not None:  # look again every second: a report of the same value wakes nobody
            tick = min(self.settling, now + TICK)
            self.until = tick if self.until is None else min(self.until, tick)
        return out

    def _over(self, grid: float, power: float | None, relay: str | None) -> bool | None:
        """Over the power limit; None when it cannot be told. A boiler meter without data is an unknown draw between 0
        and the nominal power (0 while the relay is known off), judged by its bounds (spec reading-stats §4.1)."""
        if power is None and relay != "off":
            if grid > self.limit:
                return True  # an overload whatever the boiler draws
            return False if grid + self.nominal <= self.limit else None
        return grid + self.nominal - (power or 0.0) > self.limit

    def _auto(self, now: float, grid: float | None, power: float | None, relay: str | None,
              settle: float | None) -> "tuple[str | None, str]":
        self.until = None
        undecided = self.undecided = False  # the limit cannot be told from the bounds of an unknown draw (§4.1)
        if self.limited:
            if grid is None:
                return self._off(now, relay, "blackout", "blackout")  # never delayed
            self.settling = settle  # the limit is not judged until the meters settle
            over = self._over(grid, power, relay) if settle is None else None
            undecided = self.undecided = settle is None and over is None
            if over is None:
                if self.holding:
                    return None, ""  # the off reason in force stays: same phase, the 15 s wait not started yet
            elif over:
                return self._off(now, relay, "limit", "power limit")
        if self.holding:
            # the off reason lasted until now (AppDaemon re-sent off every 5 s): the 15 s wait counts from here
            self.holding, self.last_off = False, now
        if self.last_off is not None and now - self.last_off < OFF_WAIT:
            self.phase, self.until = "waiting", self.last_off + OFF_WAIT
            return None, ""
        self.phase = "heating"
        # never switched on into a possible overload while undecided; a relay that is on stays on
        do = None if undecided else self._want("on", relay, now)
        if self.last_on is not None and now - self.last_on < ON_WAIT:
            self.until = self.last_on + ON_WAIT
            return do, "auto"
        if power is None or power > IDLE_W:
            return do, "auto"  # never conclude "done" without data
        self.mode, self.phase = "manual", "done"
        return self._want("off", relay, now), "heating done"

    def refuses_on(self) -> bool:
        """The last auto evaluation does not want the relay on: an off reason (blackout / limit) or undecided."""
        return self.mode == "auto" and (self.phase in ("blackout", "limit") or self.undecided)

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
        if self.until is not None and self.due is not None:  # until None: not evaluated in auto this time
            out["until"] = int(self.due * 1000)
        if self.settling is not None:
            out["settling"] = int(self.settling * 1000)
        return out
