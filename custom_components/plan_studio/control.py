"""The Load control rule: sources (smart buttons, wall switches, motion sensors) switch loads (on / off devices) directly.

Must not import homeassistant.

The rule engine owns the I/O (service calls, the expected changes of its commands, trace frames); this module holds the
rule's configuration, its runtime state and the decisions."""

from __future__ import annotations

ECHO = 10  # s a command counts as an expected change of its entity
SOURCES = ("wall_switch", "smart_button", "motion_sensor")
STATE_ROLE = {"wall_switch": "state", "motion_sensor": "motion"}  # the binding a state source is read from


def _str(v: object) -> str | None:
    return v if isinstance(v, str) and v else None


def _reading(state: str | None) -> str | None:
    return state if state in ("on", "off") else None


class Control:
    def __init__(self, raw: dict, devices: dict, loads: "list[tuple[str, str, str | None]]") -> None:
        """loads: (device id, label, on / off control entity or None) per load, in rule order (resolved by the engine)."""
        ids = raw.get("sources") if isinstance(raw.get("sources"), list) else []
        self.sources: list[tuple[str, str, str | None, str | None]] = []  # (id, label, kind, state entity)
        missing = False
        for did in (x for x in ids if _str(x)):
            dev = devices.get(did)
            name = dev.get("name") if dev else None
            props = dev.get("props") if dev else None
            kind = props.get("kind") if isinstance(props, dict) else None
            eid = None
            if kind in STATE_ROLE:
                bindings = dev.get("bindings") if dev else None
                eid = _str(bindings.get(STATE_ROLE[kind])) if isinstance(bindings, dict) else None
                missing = missing or eid is None
            missing = missing or kind not in SOURCES
            self.sources.append((did, name if _str(name) else did, kind if isinstance(kind, str) else None, eid))
        self.loads = loads
        self.missing = missing or any(eid is None for _, _, eid in loads)
        # runtime state, kept across an unchanged Save
        self.seen: dict[str, str | None] = {}  # state source entity -> its last on / off reading (None after no data)

    def take(self, old: "Control") -> None:
        self.seen = dict(old.seen)

    def buttons(self) -> "set[str]":
        """The device ids of the smart button sources."""
        return {did for did, _, kind, _ in self.sources if kind == "smart_button"}

    def switches(self) -> "dict[str, str]":
        """entity -> source label, of the state sources (wall switches, motion sensors)."""
        return {eid: label for _, label, _, eid in self.sources if eid is not None}

    def press(self, intent: dict) -> str | None:
        """A smart button intent: "toggle", "on" or "off"; None for auto, status events and anything else."""
        action, value = intent.get("action"), intent.get("value")
        if action == "toggle":
            return "toggle"
        if action == "set" and value in ("on", "off"):
            return value
        return None

    def source_changed(self, eid: str, state: str | None) -> str | None:
        """A state of a state source: remembered; the new state when it changed between known states (a change to or
        a return from no data is not a change)."""
        was, now = self.seen.get(eid), _reading(state)
        self.seen[eid] = now
        return now if was is not None and now is not None and now != was else None

    def want(self, what: str, effective: "list[str | None]") -> str:
        """The state for every load: toggle -> off when any load is effectively on, else on."""
        if what == "toggle":
            return "off" if "on" in effective else "on"
        return what
