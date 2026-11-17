"""Tests for the Load control rule (the event twin of the condition rule) in the pure rule engine."""

from control import Control
from test_rules import World, dev, held, lux, plan, rule, window

BTN = dev("btn", "smart_button", "Button", action="sensor.btn_action")
BTN2 = dev("btn2", "smart_button", "Button 2", action="sensor.btn2_action")
BTN2["props"]["separateOff"] = True
WS = dev("ws", "wall_switch", "Switch A", state="switch.a")
PIR = dev("pir", "motion_sensor", "Motion", motion="binary_sensor.pir")
L1 = dev("l1", "socket", "Lamp 1", control="switch.l1")
L2 = dev("l2", "socket", "Lamp 2", control="switch.l2")
B = dev("b", "wall_switch", "Switch B", state="switch.b")
LA = dev("la", "socket", "Relay A", control="switch.a")  # the load side of switch.a
LB = dev("lb", "socket", "Relay B", control="switch.b")  # the load side of switch.b
FAN = dev("fan", "exhaust_fan", "Fan", control="fan.vent")
LIGHT = dev("cl", "ceiling_light", "Ceiling", control="light.c")
VALVE = dev("v", "valve", "Valve", state="valve.v")
SW_VALVE = dev("sv", "valve", "Switch valve", state="switch.v")
LS = dev("ls", "illuminance_sensor", "Light", illuminance="sensor.lux")
DEVICES = [BTN, BTN2, WS, PIR, L1, L2, B, LA, LB, FAN, LIGHT, VALVE, SW_VALVE, LS]
BUTTONS = {d["id"] for d in DEVICES if d["props"]["kind"] == "smart_button"}

TOGGLE = {"action": "toggle"}
SET_ON = {"action": "set", "value": "on"}
SET_OFF = {"action": "set", "value": "off"}
AUTO = {"action": "auto"}


def on(e):
    return ("switch", "turn_on", e)


def off(e):
    return ("switch", "turn_off", e)


def btn(did):
    return {"button": did}


def src(did, negate=False):
    out = {"source": {"device": did}}
    if negate:
        out["not"] = True
    return out


def control_rule(rid="r", sources=(), on=(), off=(), toggle=(), gate=None, **extra):
    """sources: btn(id) / src(id) / any raw RuleInput dict; actions: (device id, do)."""
    lists = {k: [{"device": d, "do": do} for d, do in v] for k, v in (("on", on), ("off", off), ("toggle", toggle))}
    if gate is not None:
        extra["gate"] = gate
    return rule(rid, [], name=extra.pop("name", "Load control"), control={"sources": list(sources), **lists}, **extra)


def repeat(rid="r", sources=("btn",), loads=("l1", "l2"), **extra):
    """The 0.20.0 rule in the new shape (as migrated): a smart button id is a button source, any other id a device
    input; every load in all three lists."""
    srcs = [btn(s) if s in BUTTONS else src(s) for s in sources]
    return control_rule(rid, srcs, on=[(x, "on") for x in loads], off=[(x, "off") for x in loads],
                        toggle=[(x, "toggle") for x in loads], **extra)


class CWorld(World):
    """World with own-context state changes, container intents and plan loads."""

    def __init__(self, **states):
        base = {"switch__a": "off", "switch__b": "off", "switch__l1": "off", "switch__l2": "off",
                "binary_sensor__pir": "off"}
        base.update(states)
        super().__init__(**base)

    def set(self, eid, state, attrs=None, own=False):
        if state is None:
            self.states.pop(eid, None)
        else:
            self.states[eid] = (state, attrs if attrs is not None else self.states.get(eid, (None, {}))[1])
        self.engine.handle_state(eid, own=own)

    def press(self, container_id, intent, pid="p"):
        self.engine.on_intent(pid, container_id, intent)

    def load(self, rules=None, devices=None, boot=False):
        rules = rules if rules is not None else [repeat()]
        self.engine.load_plans([plan(devices if devices is not None else DEVICES, rules)], boot=boot)

    def tr(self, rid="r"):
        return self.engine.snapshot("p")[rid]


def loaded(rules=None, devices=None, boot=False, **states):
    w = CWorld(**states)
    w.load(rules, devices, boot)
    return w


# --- pure Control ------------------------------------------------------------------

def _control(sources=(btn("btn"), src("ws"), btn("btn2"), src("pir", True)), **lists):
    devices = {d["id"]: d for d in DEVICES}
    raw = {"sources": list(sources), "on": [], "off": [], "toggle": []}
    raw.update({k: [{"device": d, "do": do} for d, do in v] for k, v in lists.items()})
    return Control(raw, devices)


def test_press_maps_intents():
    c = _control()
    assert c.press(TOGGLE) == "toggle"
    assert c.press(SET_ON) == "on"
    assert c.press(SET_OFF) == "off"
    assert c.press(AUTO) is None
    assert c.press({"status": "ok"}) is None
    assert c.press({"action": "set", "value": "x"}) is None


def test_config_order_buttons_inputs_lists_and_missing():
    c = _control(on=[("l1", "on")], toggle=[("l1", "toggle"), ("v", "close")])
    assert c.order == [("button", 0), ("input", 0), ("button", 1), ("input", 1)]
    assert c.buttons == [("btn", "Button"), ("btn2", "Button 2")]
    assert c.inputs == [src("ws"), src("pir", True)]
    assert c.lists == {"on": [("l1", "on")], "off": [], "toggle": [("l1", "toggle"), ("v", "close")]}
    assert c.last == [None, None] and not c.missing
    assert _control(sources=(btn("ws"),)).missing  # a wall switch is no button
    assert _control(sources=(btn("nope"),)).missing
    assert not _control(sources=(src("nope"),)).missing  # a missing input is the input's own problem


def test_edge_only_between_known_values():
    c = _control()
    assert c.edge(0, False) is None  # the first value is a starting point
    assert c.edge(0, True) == "on"
    assert c.edge(0, True) is None
    assert c.edge(0, None) is None  # to no data: forgotten
    assert c.edge(0, False) is None  # back from no data: a new starting point
    assert c.edge(0, True) == "on" and c.edge(0, False) == "off"
    assert c.edge(1, True) is None and c.last == [False, True]
    c.forget(1)
    assert c.last == [False, None] and c.edge(1, False) is None


def test_want_toggle_group():
    c = _control()
    assert c.want(["off", "on"]) == "off"
    assert c.want(["off", None, "unknown"]) == "on"
    assert c.want([]) == "on"


def test_take_keeps_the_values_and_the_event():
    old, new = _control(), _control()
    old.last = [True, None]
    old.event = {"source": "Button", "what": "toggle", "at": 1}
    new.take(old)
    assert new.last == [True, None] and new.event == old.event
    old.last[0] = False
    assert new.last == [True, None]


# --- buttons --------------------------------------------------------------------------

def test_button_toggle_switches_all_loads():
    w = loaded()
    w.press("btn", TOGGLE)
    assert w.calls == [on("switch.l1"), on("switch.l2")]
    t = w.tr()
    assert t["last"] == {"action": "on", "target": "Lamp 2", "at": 1000000, "reason": "Button: toggle"}
    w.set("switch.l1", "on", own=True)
    w.set("switch.l2", "on", own=True)
    w.calls.clear()
    w.press("btn", TOGGLE)
    assert w.calls == [off("switch.l1"), off("switch.l2")]


def test_toggle_with_mixed_loads_turns_all_off():
    w = loaded(switch__l1="on")
    w.press("btn", TOGGLE)
    assert w.calls == [off("switch.l1")]
    assert w.tr()["last"] == {"action": "off", "target": "Lamp 1", "at": 1000000, "reason": "Button: toggle"}


def test_last_prefers_the_load_that_was_switched():
    """The last line shows the load that was switched, not a later one that was in that state already."""
    w = loaded(switch__l1="on", switch__l2="off")
    w.press("btn", TOGGLE)
    last = w.tr()["last"]
    assert w.calls == [off("switch.l1")]
    assert last["target"] == "Lamp 1" and "sent" not in last and "error" not in last
    # nothing sent at all: the last entry, sent: False
    w.set("switch.l1", "off", own=True)
    w.press("btn", SET_OFF)
    assert w.calls == [off("switch.l1")]
    assert w.tr()["last"] == {"action": "off", "target": "Lamp 2", "at": 1000000, "reason": "Button: off", "sent": False}


def test_button_set_on_and_off():
    w = loaded()
    w.press("btn", SET_ON)
    assert w.calls == [on("switch.l1"), on("switch.l2")] and w.tr()["last"]["reason"] == "Button: on"
    w.set("switch.l1", "on", own=True)
    w.set("switch.l2", "on", own=True)
    w.calls.clear()
    w.press("btn", SET_ON)
    assert w.calls == []
    w.press("btn", SET_OFF)
    assert w.calls == [off("switch.l1"), off("switch.l2")] and w.tr()["last"]["reason"] == "Button: off"


def test_auto_is_ignored():
    w = loaded()
    w.press("btn", TOGGLE)
    t = w.tr()
    w.calls.clear()
    w.press("btn", AUTO)
    w.press("btn", {"status": "ok"})
    assert w.calls == [] and w.tr()["last"] == t["last"] and w.tr()["control"]["event"] == t["control"]["event"]


def test_intents_of_another_container_or_plan_are_ignored():
    w = loaded()
    w.press("b", TOGGLE)
    w.press("btn", TOGGLE, pid="other")
    assert w.calls == [] and "last" not in w.tr() and "event" not in w.tr()["control"]


def test_wall_switch_intents_are_not_used():
    """The rule reads a wall switch's entity itself: its container intents would handle a change twice."""
    w = loaded([repeat(sources=["ws"])])
    w.press("ws", SET_ON)
    w.press("ws", TOGGLE)
    assert w.calls == []
    w.states["switch.a"] = ("on", {})
    w.press("ws", SET_ON)  # the container's intent for the change comes first
    w.engine.handle_state("switch.a")
    assert w.calls == [on("switch.l1"), on("switch.l2")]


# --- input sources --------------------------------------------------------------------------

def test_wall_switch_change_is_repeated():
    w = loaded([repeat(sources=["ws"])])
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1"), on("switch.l2")] and w.tr()["last"]["reason"] == "Switch A: on"
    w.set("switch.l1", "on", own=True)
    w.set("switch.l2", "on", own=True)
    w.calls.clear()
    w.set("switch.a", "off")
    assert w.calls == [off("switch.l1"), off("switch.l2")] and w.tr()["last"]["reason"] == "Switch A: off"


def test_an_attribute_update_of_a_source_sends_nothing():
    w = loaded([repeat(sources=["ws"])])
    w.set("switch.a", "off", {"x": 1})
    assert w.calls == [] and "last" not in w.tr()


def test_motion_sensor_is_repeated():
    w = loaded([repeat(sources=["pir"])])
    w.set("binary_sensor.pir", "on")
    assert w.calls == [on("switch.l1"), on("switch.l2")] and w.tr()["last"]["reason"] == "Motion: on"
    w.set("switch.l1", "on", own=True)
    w.set("switch.l2", "on", own=True)
    w.calls.clear()
    w.set("binary_sensor.pir", "off")
    assert w.calls == [off("switch.l1"), off("switch.l2")]
    w.set("switch.l1", "off", own=True)
    w.set("switch.l2", "off", own=True)
    w.calls.clear()
    w.set("binary_sensor.pir", "unavailable")
    w.set("binary_sensor.pir", "on")
    assert w.calls == []


def test_wall_switch_change_by_plan_studio_is_repeated():
    w = loaded([repeat(sources=["ws"])])
    w.set("switch.a", "on", own=True)
    assert w.calls == [on("switch.l1"), on("switch.l2")]


def test_source_back_from_no_data_sends_nothing():
    w = loaded([repeat(sources=["ws"])], switch__a="on")
    w.set("switch.a", "unavailable")
    w.set("switch.a", "off")
    w.set("switch.a", "unknown")
    w.set("switch.a", None)
    w.set("switch.a", "off")
    assert w.calls == [] and "last" not in w.tr()
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1"), on("switch.l2")]


def test_not_inverts_the_event():
    w = loaded([control_rule(sources=[src("ws", negate=True)], on=[("l1", "on")], off=[("l2", "off")])],
               switch__l2="on")
    w.set("switch.a", "on")
    assert w.calls == [off("switch.l2")] and w.tr()["control"]["event"]["what"] == "off"
    w.set("switch.a", "off")
    assert w.calls == [off("switch.l2"), on("switch.l1")]


def test_a_do_outside_on_off_toggle_close_is_dropped():
    w = loaded([control_rule(sources=[src("ws")], on=[("v", "open"), ("l1", "on")])], valve__v="closed")
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1")]


def test_light_device_as_a_source():
    w = loaded([repeat(sources=["cl"], loads=["l1"])], light__c="off")
    w.set("light.c", "on")
    assert w.calls == [on("switch.l1")] and w.tr()["last"]["reason"] == "Ceiling: on"


def test_held_source_fires_when_the_hold_completes():
    """Review focus 4: the event comes when the hold completes, also across an unchanged Save."""
    r = control_rule(sources=[held("pir", state="off", seconds=120)], on=[("l1", "on")])
    w = loaded([r], binary_sensor__pir="on")
    w.set("binary_sensor.pir", "off")  # t = 1000: the hold starts
    w.advance(1060)
    w.load([control_rule(sources=[held("pir", state="off", seconds=120)], on=[("l1", "on")], name="Renamed")])
    w.advance(1119)
    assert w.calls == []
    w.advance(1120)
    assert w.calls == [on("switch.l1")] and w.tr()["last"]["reason"] == "Motion: on"
    w.advance(2000)
    assert w.calls == [on("switch.l1")]


def test_held_already_satisfied_at_load_gives_no_event():
    w = CWorld()
    w.changed["binary_sensor.pir"] = 0.0  # off since long ago
    w.load([control_rule(sources=[held("pir", state="off", seconds=120)], on=[("l1", "on")])])
    assert w.tr()["inputs"][0]["value"] is True
    w.advance(5000)
    assert w.calls == [] and "event" not in w.tr()["control"]


def test_time_window_source():
    day = 1767225600.0  # 2026-01-01 00:00 UTC
    r = control_rule(sources=[window("00:20", "00:30")], on=[("l1", "on")], off=[("l1", "off")])
    w = CWorld()
    w.t = day + 1000  # 00:16:40
    w.load([r])
    assert w.calls == []
    w.advance(day + 1200)
    assert w.calls == [on("switch.l1")] and w.tr()["last"]["reason"] == "Time: on"
    w.set("switch.l1", "on", own=True)
    w.advance(day + 1800)
    assert w.calls == [on("switch.l1"), off("switch.l1")] and w.tr()["last"]["reason"] == "Time: off"
    inside = CWorld()
    inside.t = day + 1300
    inside.load([r])
    assert inside.calls == [] and inside.tr()["inputs"][0]["value"] is True


def test_rule_verdict_source():
    """Review focus 3: a condition rule's verdict gives events; its start verdict never does."""
    cond = rule("R", ["pir"], name="Motion rule")
    r = control_rule(sources=[{"source": {"rule": "R"}}], on=[("l1", "on")], off=[("l1", "off")])
    w = loaded([cond, r])
    w.set("binary_sensor.pir", "on")
    assert w.calls == [on("switch.l1")] and w.tr()["last"]["reason"] == "Motion rule: on"
    w.set("switch.l1", "on", own=True)
    w.set("binary_sensor.pir", "off")
    assert w.calls == [on("switch.l1"), off("switch.l1")]
    w.set("switch.l1", "off", own=True)
    w.calls.clear()
    w.states["binary_sensor.pir"] = ("on", {})
    w.load([rule("R", ["pir"], combine="all", name="Motion rule"), r])  # changed R: its start verdict is true
    assert w.calls == []
    w.load([rule("R", ["pir"], combine="all", name="Motion rule", enabled=False), r])  # R unknown
    w.load([rule("R", ["pir"], combine="all", name="Motion rule"), r])  # re-enabled: the same value
    assert w.calls == [] and w.tr()["inputs"][0]["value"] is True
    w.set("binary_sensor.pir", "off")
    assert w.calls == [] and w.tr()["last"]["reason"] == "Motion rule: off" and w.tr()["last"]["sent"] is False


def test_daylight_source():
    r = control_rule(sources=[{"source": {"daylight": "ls", "is": "night"}}], on=[("l1", "on")], off=[("l1", "off")])
    w = loaded([r], sensor__lux=lux(5), switch__l1="on")
    w.set("sensor.lux", "80", {"unit_of_measurement": "lx"})
    w.advance(1059)
    assert w.calls == []
    w.advance(1060)
    assert w.calls == [off("switch.l1")] and w.tr()["control"]["event"]["what"] == "off"
    w.set("switch.l1", "off", own=True)
    w.set("sensor.lux", "5", {"unit_of_measurement": "lx"})
    w.advance(1120)
    assert w.calls == [off("switch.l1"), on("switch.l1")] and w.tr()["control"]["event"]["what"] == "on"


def test_valve_source_keeps_its_value_through_closing():
    w = loaded([repeat(sources=["v"], loads=["l1"])], valve__v="open", switch__l1="on")
    w.set("valve.v", "closing")
    assert w.calls == [] and w.tr()["inputs"][0]["value"] is None
    w.set("valve.v", "closed")
    assert w.calls == [off("switch.l1")] and w.tr()["last"]["reason"] == "Valve: off"
    w.set("switch.l1", "off", own=True)
    w.set("valve.v", "opening")
    w.set("valve.v", "closed")
    assert w.calls == [off("switch.l1")]


def test_unavailable_valve_source_is_forgotten():
    w = loaded([repeat(sources=["v"], loads=["l1"])], valve__v="open", switch__l1="on")
    w.set("valve.v", "unavailable")
    w.set("valve.v", "closed")
    assert w.calls == []


# --- actions -------------------------------------------------------------------------------

def test_lists_are_independent():
    r = control_rule(sources=[src("ws"), btn("btn")], on=[("l1", "on")], off=[("l2", "off")])
    w = loaded([r], switch__l2="on")
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1")]
    w.set("switch.a", "off")
    assert w.calls == [on("switch.l1"), off("switch.l2")]
    last = w.tr()["last"]
    w.press("btn", TOGGLE)
    t = w.tr()
    assert w.calls == [on("switch.l1"), off("switch.l2")]
    assert t["control"]["event"] == {"source": "Button", "what": "toggle", "at": 1000000} and t["last"] == last


def test_literal_actions_mix_with_a_toggle_group():
    r = control_rule(sources=[btn("btn")], toggle=[("l1", "toggle"), ("l2", "toggle"), ("fan", "on")])
    w = loaded([r], switch__l1="on", fan__vent="off")
    w.press("btn", TOGGLE)
    assert w.calls == [off("switch.l1"), ("fan", "turn_on", "fan.vent")]
    assert w.engine._rules[("p", "r")].entries == [
        {"action": "off", "target": "Lamp 1", "at": 1000000, "reason": "Button: toggle"},
        {"action": "off", "target": "Lamp 2", "at": 1000000, "reason": "Button: toggle", "sent": False},
        {"action": "on", "target": "Fan", "at": 1000000, "reason": "Button: toggle"},
    ]
    assert w.tr()["last"]["target"] == "Fan"
    w.calls.clear()
    w.press("btn", TOGGLE)  # Lamp 1's off is on its way: the group is off -> all on; the fan's on is on its way
    assert w.calls == [on("switch.l1"), on("switch.l2")]


def test_two_sources_moved_by_one_change_fire_in_rule_order():
    r = control_rule(sources=[src("ws"), src("ws", negate=True)], on=[("l1", "on")], off=[("l1", "off")])
    w = loaded([r])
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1"), off("switch.l1")]
    assert w.tr()["control"]["event"]["what"] == "off" and w.tr()["last"]["reason"] == "Switch A: off"


def test_close_action_on_a_valve():
    r = control_rule(sources=[src("ws")], on=[("v", "close")])
    w = loaded([r], valve__v="open")
    w.set("switch.a", "on")
    assert w.calls == [("valve", "close_valve", "valve.v")]
    assert w.tr()["last"] == {"action": "close", "target": "Valve", "at": 1000000, "reason": "Switch A: on"}
    w.set("switch.a", "off")
    w.set("switch.a", "on")  # the close is on its way
    assert w.calls == [("valve", "close_valve", "valve.v")] and w.tr()["last"]["sent"] is False
    for state in ("closed", "closing"):
        w2 = loaded([r], valve__v=state)
        w2.set("switch.a", "on")
        assert w2.calls == [] and w2.tr()["last"]["sent"] is False
    w3 = loaded([control_rule(sources=[src("ws")], on=[("sv", "close")])], switch__v="on")
    w3.set("switch.a", "on")
    assert w3.calls == [off("switch.v")]
    w3.set("switch.a", "off")
    w3.set("switch.a", "on")
    assert w3.calls == [off("switch.v")]


def test_valve_close_is_an_echo_for_a_valve_source():
    """A valve closed by one rule is no event of another rule reading it."""
    closer = control_rule("c", sources=[src("ws")], on=[("v", "close")])
    w = loaded([closer, repeat("r", sources=["v"], loads=["l1"])], valve__v="open", switch__l1="on")
    w.set("switch.a", "on")
    w.set("valve.v", "closing", own=True)
    w.set("valve.v", "closed", own=True)
    assert w.calls == [("valve", "close_valve", "valve.v")] and "event" not in w.tr("r")["control"]


def test_empty_list_for_the_event_keeps_last():
    w = loaded([control_rule(sources=[src("ws")], on=[("l1", "on")])])
    w.set("switch.a", "on")
    last = w.tr()["last"]
    w.set("switch.a", "off")
    t = w.tr()
    assert w.calls == [on("switch.l1")] and t["last"] == last and t["status"] == "ok"
    assert t["control"]["event"] == {"source": "Switch A", "what": "off", "at": 1000000}


def test_gate_drops_the_event():
    r = control_rule(sources=[src("ws")], on=[("l1", "on")], off=[("l1", "off")], gate=src("pir"))
    w = loaded([r])
    w.set("switch.a", "on")  # gate false
    t = w.tr()
    assert w.calls == [] and "last" not in t
    assert t["control"]["event"] == {"source": "Switch A", "what": "on", "at": 1000000, "dropped": "gate closed"}
    w.set("binary_sensor.pir", "unavailable")
    w.set("switch.a", "off")  # gate unknown: an off event ignores the gate (l1 is off already: nothing to send)
    assert w.calls == [] and "dropped" not in w.tr()["control"]["event"]
    w.set("binary_sensor.pir", "on")  # opening the gate replays nothing
    assert w.calls == [] and w.tr()["gate"]["value"] is True
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1")] and "dropped" not in w.tr()["control"]["event"]


def test_off_event_passes_a_closed_gate():
    w = loaded([control_rule(sources=[src("pir")], on=[("l1", "on")], off=[("l1", "off")], gate=src("ws"))],
               switch__a="on")
    w.set("binary_sensor.pir", "on")
    assert w.calls == [on("switch.l1")]
    w.set("switch.l1", "on")
    w.set("switch.a", "off")  # gate false
    w.set("binary_sensor.pir", "off")
    assert w.calls == [on("switch.l1"), off("switch.l1")] and "dropped" not in w.tr()["control"]["event"]
    w.set("binary_sensor.pir", "on")
    assert w.calls == [on("switch.l1"), off("switch.l1")] and w.tr()["control"]["event"]["dropped"] == "gate closed"


def test_toggle_is_dropped_by_a_closed_gate():
    for gate_state in ("off", "unavailable"):
        w = loaded([control_rule(sources=[btn("btn")], toggle=[("l1", "toggle")], gate=src("pir"))], binary_sensor__pir=gate_state)
        w.press("btn", TOGGLE)
        assert w.calls == [] and w.tr()["control"]["event"]["dropped"] == "gate closed"


def test_gate_drops_a_button_event():
    w = loaded([control_rule(sources=[btn("btn")], toggle=[("l1", "toggle")], gate=src("pir"))])
    w.press("btn", TOGGLE)
    assert w.calls == [] and w.tr()["control"]["event"]["dropped"] == "gate closed"
    w.set("binary_sensor.pir", "on")
    w.press("btn", TOGGLE)
    assert w.calls == [on("switch.l1")]


# --- loads -------------------------------------------------------------------------------

def test_load_already_in_state_is_not_commanded():
    w = loaded([repeat(sources=["ws"])], switch__l2="on")
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1")]
    assert w.tr()["last"] == {"action": "on", "target": "Lamp 1", "at": 1000000, "reason": "Switch A: on"}
    assert w.tr()["status"] == "ok"


def test_unavailable_load_errors_and_is_never_resent():
    w = loaded(switch__l1="unavailable")
    w.press("btn", TOGGLE)
    t = w.tr()
    assert w.calls == [on("switch.l2")]
    assert t["status"] == "error" and t["reason"] == "target unavailable"
    assert t["last"] == {"action": "on", "target": "Lamp 1", "at": 1000000, "reason": "Button: toggle",
                         "error": "target unavailable"}
    w.set("switch.l1", "off")
    w.set("switch.l1", "on")
    w.advance(5000)
    assert w.calls == [on("switch.l2")]


def test_missing_load_entity_is_target_unavailable():
    w = loaded()
    del w.states["switch.l1"]
    w.press("btn", SET_ON)
    assert w.calls == [on("switch.l2")] and w.tr()["reason"] == "target unavailable"


def test_unknown_load_is_commanded():
    w = loaded(switch__l1="unknown")
    w.press("btn", TOGGLE)
    assert w.calls == [on("switch.l1"), on("switch.l2")] and w.tr()["status"] == "ok"


def test_failed_call_marks_service_failed():
    w = loaded()
    w.fail.add("switch.l1")
    w.press("btn", TOGGLE)
    t = w.tr()
    assert w.calls == [on("switch.l1"), on("switch.l2")]
    assert t["status"] == "error" and t["reason"] == "service failed"
    assert t["last"]["target"] == "Lamp 1" and t["last"]["error"] == "service failed"


def test_late_failure_marks_its_own_event_only():
    w = loaded()
    w.press("btn", SET_ON)
    late = w.on_error  # Lamp 2's call
    assert w.current() is True
    late("boom")
    t = w.tr()
    assert t["reason"] == "service failed" and t["last"]["target"] == "Lamp 2"
    assert t["last"]["error"] == "service failed"
    w.press("btn", SET_OFF)  # Lamp 1 counts as on (its command is on its way); Lamp 2's failed on is not
    older = w.on_error
    assert w.calls[2:] == [off("switch.l1")]
    assert w.tr()["last"] == {"action": "off", "target": "Lamp 1", "at": 1000000, "reason": "Button: off"}
    w.press("btn", SET_ON)
    assert w.calls[-1] == on("switch.l2")
    older("boom")  # the older event's failure does not mark the newer one
    assert w.tr()["status"] == "ok" and "error" not in w.tr()["last"]


# --- nothing at load, boot or save --------------------------------------------------------

def test_nothing_sent_at_load_boot_or_save():
    w = loaded([repeat(sources=["ws"])], switch__a="on")
    assert w.calls == []
    wb = loaded([repeat(sources=["ws"])], boot=True, switch__a="on")
    wb.engine.started()
    assert wb.calls == []
    # an unchanged Save keeps the value: a later change is detected against it
    w.load([repeat(sources=["ws"])])
    assert w.calls == []
    w.set("switch.a", "off")
    assert w.calls == [] and w.tr()["last"]["reason"] == "Switch A: off"  # the loads are off already
    assert w.tr()["last"]["sent"] is False
    # a change read by the Save itself (an unchanged rule is evaluated in the load) is recorded, not acted on
    w.states["switch.a"] = ("on", {})
    w.load([repeat(sources=["ws"], name="Renamed")])
    w.engine.handle_state("switch.a")
    assert w.calls == []
    w.set("switch.a", "off")
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1"), on("switch.l2")]
    # a changed rule reads its source anew and sends nothing
    w.calls.clear()
    w.advance(1020)  # the commands' echoes are over
    w.states["switch.a"] = ("off", {})
    w.load([repeat(sources=["ws"], loads=["l1"])])
    assert w.calls == []
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1")]


def test_a_rebound_source_is_read_at_save():
    """An unchanged rule whose wall switch was bound to another entity reads that entity as its starting point."""
    w = loaded([repeat(sources=["ws"])], switch__b="on")
    rebound = dev("ws", "wall_switch", "Switch A", state="switch.b")
    w.load([repeat(sources=["ws"])], [BTN, rebound, L1, L2])
    assert w.calls == []
    w.set("switch.b", "off")
    assert w.calls == [] and w.tr()["last"]["reason"] == "Switch A: off" and w.tr()["last"]["sent"] is False


def test_rebound_source_is_read_fresh():
    """A source entity that leaves the rule and returns is read anew, not compared with its old reading."""
    w = loaded([repeat(sources=["ws"])])
    rebound = dev("ws", "wall_switch", "Switch A", state="switch.b")
    w.load([repeat(sources=["ws"])], [BTN, rebound, L1, L2])
    w.set("switch.a", "on")
    w.load([repeat(sources=["ws"])])
    w.set("switch.a", "on", {"x": 1})  # an attribute-only update: still on
    assert w.calls == []
    w.set("switch.a", "off")
    assert w.calls == [] and w.tr()["last"]["reason"] == "Switch A: off" and w.tr()["last"]["sent"] is False
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1"), on("switch.l2")]


def test_disabled_rule_ignores_everything():
    w = loaded([repeat(sources=["btn", "ws"], enabled=False)])
    w.press("btn", TOGGLE)
    w.set("switch.a", "on")
    t = w.tr()
    assert w.calls == [] and t["status"] == "disabled" and "last" not in t and "event" not in t["control"]
    # enabling it later: the change it saw while disabled is the starting point
    w.load([repeat(sources=["btn", "ws"])])
    assert w.calls == []
    w.set("switch.a", "off")
    assert w.calls == [] and w.tr()["last"]["reason"] == "Switch A: off" and w.tr()["last"]["sent"] is False


def test_deleting_the_rule_sends_nothing():
    w = loaded([repeat(sources=["ws"])])
    w.set("switch.a", "on")
    w.calls.clear()
    w.load([])
    assert w.calls == [] and not w.pending()


def test_removing_a_held_rule_cancels_its_timer():
    w = loaded([control_rule(sources=[held("pir", state="off", seconds=120)], on=[("l1", "on")])],
               binary_sensor__pir="on")
    w.set("binary_sensor.pir", "off")
    assert w.pending()
    w.load([])
    assert not w.pending()
    w.load([control_rule(sources=[held("pir", state="off", seconds=120)], on=[("l1", "on")], enabled=False)])
    assert not w.pending()


def test_nothing_is_switched_while_booting():
    """A retained button action replayed at start or a source settling while HA starts switches nothing; the reading
    remembered during the boot is the starting point after started()."""
    w = loaded([repeat(sources=["btn", "ws"])], boot=True, switch__l1="on", switch__l2="on")
    w.press("btn", TOGGLE)
    w.press("btn", SET_OFF)
    w.set("switch.a", "on")
    w.set("switch.a", "off")
    w.set("switch.a", "on")
    assert w.calls == [] and "last" not in w.tr()
    w.engine.started()
    assert w.calls == []
    w.set("switch.a", "off")  # against "on" remembered during the boot
    assert w.calls == [off("switch.l1"), off("switch.l2")]
    w.calls.clear()
    w.press("btn", TOGGLE)
    assert w.calls == [on("switch.l1"), on("switch.l2")]  # the echoes of the offs: all off


# --- echoes --------------------------------------------------------------------------------

def test_two_way_link_does_not_ping_pong():
    w = loaded([repeat("a", ["ws"], ["lb"]), repeat("b", ["b"], ["la"])])
    w.set("switch.a", "on")
    assert w.calls == [on("switch.b")]
    w.set("switch.b", "on", own=True)
    assert w.calls == [on("switch.b")]
    # and the other way round
    w.set("switch.b", "off")
    assert w.calls == [on("switch.b"), off("switch.a")]
    w.set("switch.a", "off", own=True)
    assert w.calls == [on("switch.b"), off("switch.a")]


def test_two_way_double_flip_ends_off():
    w = loaded([repeat("a", ["ws"], ["lb"]), repeat("b", ["b"], ["la"])])
    w.set("switch.a", "on")
    w.advance(1001)
    w.set("switch.a", "off")
    assert w.calls == [on("switch.b"), off("switch.b")]
    w.set("switch.b", "on", own=True)
    w.set("switch.b", "off", own=True)
    assert w.calls == [on("switch.b"), off("switch.b")]
    assert w.states["switch.a"][0] == "off" and w.states["switch.b"][0] == "off"


def test_echo_expires():
    w = loaded([repeat("a", ["ws"], ["lb"]), repeat("b", ["b"], ["l1"])])
    w.set("switch.a", "on")
    assert w.calls == [on("switch.b")]
    w.advance(1011)  # the expected change never arrived
    w.set("switch.b", "on")
    assert w.calls == [on("switch.b"), on("switch.l1")]


def test_a_chain_does_not_propagate():
    """A -> B and B -> C: the change of B is the echo of A's command."""
    w = loaded([repeat("a", ["ws"], ["lb"]), repeat("b", ["b"], ["l1"])])
    w.set("switch.a", "on")
    w.advance(1005)
    w.set("switch.b", "on")
    assert w.calls == [on("switch.b")]


def test_echo_does_not_hide_a_held_source():
    """Only sources reading the entity directly are affected by echoes."""
    w = loaded([repeat("a", ["ws"], ["lb"]),
                control_rule("h", sources=[held("b", state="off", seconds=5)], off=[("l1", "off")])], switch__l1="on")
    w.advance(1005)  # held off for 5 s: an on event with nothing to do
    assert w.tr("h")["control"]["event"]["what"] == "on"
    w.set("switch.a", "on")
    w.set("switch.b", "on", own=True)  # the echo of a's command ends the hold
    assert w.calls == [on("switch.b"), off("switch.l1")] and w.tr("h")["last"]["reason"] == "Switch B: off"


def test_echo_is_the_effective_state_of_a_load():
    """A command still on its way counts as the load's state: a second toggle turns it off again."""
    w = loaded()
    w.press("btn", TOGGLE)
    w.press("btn", TOGGLE)
    assert w.calls == [on("switch.l1"), on("switch.l2"), off("switch.l1"), off("switch.l2")]


def test_hand_switch_after_arrival_decides_from_the_reading():
    """An expected change ends when it arrives: a later hand switch of the load counts."""
    w = loaded([repeat(loads=["l1"])])
    w.press("btn", TOGGLE)
    assert w.calls == [on("switch.l1")]
    w.set("switch.l1", "on", own=True)
    w.advance(1003)
    w.set("switch.l1", "off")  # by hand
    w.press("btn", TOGGLE)
    assert w.calls == [on("switch.l1"), on("switch.l1")]


def test_unavailable_load_beats_a_pending_echo():
    w = loaded([repeat(loads=["l1"])])
    w.press("btn", TOGGLE)
    w.set("switch.l1", "unavailable")
    w.press("btn", TOGGLE)
    t = w.tr()
    assert w.calls == [on("switch.l1")]
    assert t["last"]["error"] == "target unavailable" and t["reason"] == "target unavailable"


def test_attribute_update_does_not_drop_a_double_flip():
    w = loaded([repeat("a", ["ws"], ["lb"]), repeat("b", ["b"], ["la"])])
    w.set("switch.a", "on")
    w.set("switch.b", "off", {"x": 1})  # attribute-only, between the two commands
    w.advance(1001)
    w.set("switch.a", "off")
    w.set("switch.b", "off", {"x": 2})  # attribute-only, between the commands and the arrivals
    assert w.calls == [on("switch.b"), off("switch.b")]
    w.set("switch.b", "on", own=True)
    w.set("switch.b", "off", own=True)
    assert w.calls == [on("switch.b"), off("switch.b")]
    assert w.states["switch.a"][0] == "off" and w.states["switch.b"][0] == "off"


def test_failed_command_drops_its_echo():
    """A command that failed late is not on its way: the load is decided from its reading."""
    w = loaded()
    w.press("btn", SET_ON)
    w.on_error("boom")  # Lamp 2's call failed
    w.press("btn", SET_ON)
    assert w.calls == [on("switch.l1"), on("switch.l2"), on("switch.l2")]  # Lamp 1's on is still on its way


def test_same_entity_as_source_and_load_is_harmless():
    w = loaded([repeat(sources=["ws"], loads=["la", "l1"])])
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1")]
    w.calls.clear()
    w.set("switch.a", "off")
    assert w.calls == [off("switch.l1")]


# --- other rules ------------------------------------------------------------------------------

def test_button_shared_with_a_timed_rule():
    vent = dev("vt", "exhaust_fan", "Vent", control="fan.vent2")
    timed = rule("t", [], name="Timed switch", timed={"button": "btn", "device": "vt", "minutes": 15})
    w = loaded([timed, repeat()], DEVICES + [vent], fan__vent2="off")
    w.press("btn", TOGGLE)
    assert w.calls == [("fan", "turn_on", "fan.vent2"), on("switch.l1"), on("switch.l2")]
    assert w.tr("t")["timed"]["running"] is True


def test_missing_button_or_target_is_a_static_problem():
    w = loaded([control_rule(sources=[btn("btn"), btn("l2")], toggle=[("l1", "toggle")])])  # a socket is no button
    w.press("btn", TOGGLE)
    t = w.tr()
    assert w.calls == [] and t["status"] == "error" and t["reason"] == "device missing" and "event" not in t["control"]
    w2 = loaded([control_rule(sources=[btn("btn")], toggle=[("l1", "toggle"), ("pir", "toggle")])])
    w2.press("btn", TOGGLE)  # a motion sensor takes no on / off: its action errors, the others run
    t2 = w2.tr()
    assert w2.calls == [on("switch.l1")] and t2["status"] == "error" and t2["reason"] == "target missing"
    assert t2["last"] == {"action": "on", "target": "Motion", "at": 1000000, "reason": "Button: toggle",
                          "error": "target missing"}
    w3 = loaded([control_rule(sources=[btn("btn")], on=[("l1", "close")])])  # a socket is no valve
    assert w3.tr()["reason"] == "target missing"
    w4 = loaded([control_rule(sources=[src("nope"), src("ws")], on=[("l1", "on")])])  # a missing input source
    w4.set("switch.a", "on")
    assert w4.tr()["reason"] == "device missing" and w4.calls == [on("switch.l1")]


def test_trace_shape():
    r = control_rule(sources=[src("ws"), btn("btn"), src("pir", True), btn("btn2")],
                     on=[("l1", "on")], off=[("l2", "off"), ("v", "close")], toggle=[("l1", "toggle")])
    w = loaded([r], switch__a="on", switch__l2="unavailable", valve__v="closing")
    t = w.tr()
    assert t["status"] == "ok" and t["verdict"] is None and "holders" not in t and "gate" not in t
    assert t["unknownInputs"] == 0
    assert t["inputs"] == [
        {"label": "Switch A", "value": True, "detail": "on", "gives": "on / off"},
        {"label": "Button", "value": None, "detail": "", "gives": "toggle"},
        {"label": "Motion", "value": False, "detail": "clear", "gives": "on / off"},
        {"label": "Button 2", "value": None, "detail": "", "gives": "on / off"},
    ]
    assert t["control"] == {"devices": [
        {"id": "l1", "name": "Lamp 1", "state": "off"},
        {"id": "l2", "name": "Lamp 2", "state": None},
        {"id": "v", "name": "Valve", "state": "closed"},
    ]}
    w.set("switch.l1", "on")  # a target change refreshes the trace
    assert w.tr()["control"]["devices"][0]["state"] == "on"
    w.press("btn", TOGGLE)
    assert w.tr()["control"]["event"] == {"source": "Button", "what": "toggle", "at": 1000000}
    assert {"switch.a", "switch.l1", "switch.l2", "binary_sensor.pir", "valve.v"} <= w.engine.entity_ids()
    g = loaded([control_rule(sources=[btn("btn")], on=[("l1", "on")], gate=src("pir"))]).tr()
    assert g["gate"] == {"value": False, "detail": "clear"}


def test_trace_follows_loads_in_frames():
    w = loaded()
    frames = []
    w.engine.subscribe("p", lambda full, rules: frames.append(rules))
    w.set("switch.l1", "on")
    assert frames and frames[-1]["r"]["control"]["devices"][0]["state"] == "on"


def test_control_is_never_a_target_holder_or_resent():
    w = loaded(switch__l1="unavailable")
    w.press("btn", SET_ON)
    assert "switch.l1" not in w.engine._targets and w.engine._holds == {}
    w.set("switch.l1", "off")
    assert w.calls == [on("switch.l2")]


def test_other_rules_are_untouched():
    m = dev("m", "motion_sensor", "Motion 2", motion="binary_sensor.m")
    pair = rule("c", ["m"], on_true=[("l1", "on")], on_false=[("l1", "off")], name="Pair")
    w = loaded([pair, repeat()], DEVICES + [m], binary_sensor__m="off")
    assert w.calls == [off("switch.l1")]  # the pair's start, through the slots
    last = dict(w.tr("c")["last"])
    w.press("btn", TOGGLE)
    assert w.calls == [off("switch.l1"), on("switch.l1"), on("switch.l2")]
    assert w.tr("c")["last"] == last and "holders" not in w.tr("r")
    w.set("switch.l1", "on", own=True)
    w.set("switch.l2", "on", own=True)
    w.set("binary_sensor.m", "on")
    assert w.calls[-1] == on("switch.l1") and w.tr("c")["last"]["reason"].startswith("became true")
    assert w.tr("c")["holders"] == ["Pair"]
    w.set("binary_sensor.m", "off")
    assert w.calls[-1] == off("switch.l1")


def test_a_control_rule_reads_unknown_as_an_input():
    r = repeat(sources=["ws"])
    cond = rule("c", [{"source": {"rule": "r"}}], name="Reads control")
    w = loaded([r, cond])
    assert w.tr("c")["inputs"][0]["value"] is None
