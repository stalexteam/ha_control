"""The Load control rule, the event twin of the condition rule: sources (smart buttons, or any condition rule input)
give on / off / toggle events; each event kind runs its own action list by direct calls.

Must not import homeassistant.

The rule engine owns the I/O (the input evaluation, service calls, the expected changes of its commands, trace frames);
this module holds the rule's configuration, its runtime state and the decisions."""

from __future__ import annotations

ECHO = 10  # s a command counts as an expected change of its entity
KINDS = ("on", "off", "toggle")


def _str(v: object) -> str | None:
    return v if isinstance(v, str) and v else None


class Control:
    def __init__(self, raw: dict, devices: dict) -> None:
        sources = raw.get("sources") if isinstance(raw.get("sources"), list) else []
        self.order: list[tuple[str, int]] = []  # ("button", k) | ("input", k) per source, in rule order
        self.buttons: list[tuple[str, str]] = []  # (device id, label) of the button sources
        self.inputs: list[dict] = []  # the RuleInput sources (the engine builds and evaluates them)
        self.gives: list[str] = []  # per source in rule order: "toggle" | "on / off"
        self.missing = False  # a button source that is not a smart button
        for s in (x for x in sources if isinstance(x, dict)):
            if "button" in s:
                did = _str(s["button"]) or ""
                dev = devices.get(did)
                props = dev.get("props") if dev else None
                kind = props.get("kind") if isinstance(props, dict) else None
                self.missing = self.missing or kind != "smart_button"
                name = dev.get("name") if dev else None
                self.order.append(("button", len(self.buttons)))
                self.buttons.append((did, name if _str(name) else did))
                split = isinstance(props, dict) and props.get("separateOff") is True
                self.gives.append("on / off" if split else "toggle")
            else:
                self.order.append(("input", len(self.inputs)))
                self.inputs.append(s)
                self.gives.append("on / off")
        self.lists: dict[str, list[tuple[str, str]]] = {}
        for kind in KINDS:
            actions = raw.get(kind) if isinstance(raw.get(kind), list) else []
            self.lists[kind] = [
                (a["device"], a["do"]) for a in actions
                if isinstance(a, dict) and _str(a.get("device")) and _str(a.get("do"))
            ]
        # runtime state, kept across an unchanged Save
        self.last: list[bool | None] = [None] * len(self.inputs)  # the remembered value of each input source
        self.event: dict | None = None  # the last event: {source, what, at, dropped?}

    def take(self, old: "Control") -> None:
        if len(old.last) == len(self.last):
            self.last = list(old.last)
        self.event = old.event

    def press(self, intent: dict) -> str | None:
        """A smart button intent: "toggle", "on" or "off"; None for auto, status events and anything else."""
        action, value = intent.get("action"), intent.get("value")
        if action == "toggle":
            return "toggle"
        if action == "set" and value in ("on", "off"):
            return value
        return None

    def edge(self, k: int, value: "bool | None") -> str | None:
        """The value of input source k (after NOT) is remembered; "on" / "off" when it changed between known values (a
        change to or a return from no data is no event)."""
        was, self.last[k] = self.last[k], value
        if was is None or value is None or was == value:
            return None
        return "on" if value else "off"

    def forget(self, k: int) -> None:
        """The next known value of input source k is a new starting point."""
        self.last[k] = None

    def want(self, effective: "list[str | None]") -> str:
        """The state for every device of a toggle group: off when any is effectively on, else on."""
        return "off" if "on" in effective else "on"
