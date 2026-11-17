"""Tests for the Load control rule in the pure rule engine."""

from control import Control
from test_rules import World, dev, plan, rule

BTN = dev("btn", "smart_button", "Button", action="sensor.btn_action")
WS = dev("ws", "wall_switch", "Switch A", state="switch.a")
PIR = dev("pir", "motion_sensor", "Motion", motion="binary_sensor.pir")
L1 = dev("l1", "socket", "Lamp 1", control="switch.l1")
L2 = dev("l2", "socket", "Lamp 2", control="switch.l2")
B = dev("b", "wall_switch", "Switch B", state="switch.b")
LA = dev("la", "socket", "Relay A", control="switch.a")  # the load side of switch.a
LB = dev("lb", "socket", "Relay B", control="switch.b")  # the load side of switch.b
DEVICES = [BTN, WS, PIR, L1, L2, B, LA, LB]

TOGGLE = {"action": "toggle"}
SET_ON = {"action": "set", "value": "on"}
SET_OFF = {"action": "set", "value": "off"}
AUTO = {"action": "auto"}


def on(e):
    return ("switch", "turn_on", e)


def off(e):
    return ("switch", "turn_off", e)


def control_rule(rid="r", sources=("btn",), loads=("l1", "l2"), **extra):
    return rule(rid, [], name=extra.pop("name", "Load control"),
                control={"sources": list(sources), "loads": list(loads)}, **extra)


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
        rules = rules if rules is not None else [control_rule()]
        self.engine.load_plans([plan(devices if devices is not None else DEVICES, rules)], boot=boot)

    def tr(self, rid="r"):
        return self.engine.snapshot("p")[rid]


def loaded(rules=None, devices=None, boot=False, **states):
    w = CWorld(**states)
    w.load(rules, devices, boot)
    return w


# --- pure Control ------------------------------------------------------------------

def _control(sources=("btn", "ws"), loads=(("l1", "Lamp 1", "switch.l1"),)):
    devices = {d["id"]: d for d in DEVICES}
    return Control({"sources": list(sources), "loads": [x[0] for x in loads]}, devices, list(loads))


def test_press_maps_intents():
    c = _control()
    assert c.press(TOGGLE) == "toggle"
    assert c.press(SET_ON) == "on"
    assert c.press(SET_OFF) == "off"
    assert c.press(AUTO) is None
    assert c.press({"status": "ok"}) is None
    assert c.press({"action": "set", "value": "x"}) is None


def test_config_buttons_switches_and_missing():
    c = _control(sources=("btn", "ws", "pir"))
    assert c.buttons() == {"btn"} and c.switches() == {"switch.a": "Switch A", "binary_sensor.pir": "Motion"}
    assert [s[2] for s in c.sources] == ["smart_button", "wall_switch", "motion_sensor"] and not c.missing
    assert _control(sources=("l2",)).missing  # a socket is no source
    assert _control(sources=("nope",)).missing
    assert _control(loads=(("l1", "Lamp 1", None),)).missing
    no_binding = {"btn": BTN, "ws2": dev("ws2", "wall_switch", "Switch 2")}
    assert Control({"sources": ["ws2"], "loads": ["l1"]}, no_binding, [("l1", "Lamp 1", "switch.l1")]).missing


def test_source_changed_only_between_known_states():
    c = _control()
    c.seen["switch.a"] = "off"
    assert c.source_changed("switch.a", "on") == "on"
    assert c.source_changed("switch.a", "on") is None
    assert c.source_changed("switch.a", None) is None
    assert c.source_changed("switch.a", "off") is None  # back from no data: only remembered
    assert c.source_changed("switch.a", "on") == "on"
    assert c.source_changed("switch.a", "unavailable") is None and c.seen["switch.a"] is None


def test_want_toggle():
    c = _control()
    assert c.want("toggle", ["off", "on"]) == "off"
    assert c.want("toggle", ["off", None, "unknown"]) == "on"
    assert c.want("on", ["on"]) == "on" and c.want("off", ["off"]) == "off"


def test_take_keeps_the_readings():
    old, new = _control(), _control()
    old.seen["switch.a"] = "on"
    new.take(old)
    assert new.seen == {"switch.a": "on"}


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
    last = w.tr()["last"]
    w.calls.clear()
    w.press("btn", AUTO)
    w.press("btn", {"status": "ok"})
    assert w.calls == [] and w.tr()["last"] == last


def test_intents_of_another_container_or_plan_are_ignored():
    w = loaded()
    w.press("b", TOGGLE)
    w.press("btn", TOGGLE, pid="other")
    assert w.calls == [] and "last" not in w.tr()


def test_wall_switch_intents_are_not_used():
    """The rule reads a wall switch's entity itself: its container intents would handle a change twice."""
    w = loaded([control_rule(sources=["ws"])])
    w.press("ws", SET_ON)
    w.press("ws", TOGGLE)
    assert w.calls == []
    w.states["switch.a"] = ("on", {})
    w.press("ws", SET_ON)  # the container's intent for the change comes first
    w.engine.handle_state("switch.a")
    assert w.calls == [on("switch.l1"), on("switch.l2")]


# --- state sources ----------------------------------------------------------------------

def test_wall_switch_change_is_repeated():
    w = loaded([control_rule(sources=["ws"])])
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1"), on("switch.l2")] and w.tr()["last"]["reason"] == "Switch A: on"
    w.set("switch.l1", "on", own=True)
    w.set("switch.l2", "on", own=True)
    w.calls.clear()
    w.set("switch.a", "off")
    assert w.calls == [off("switch.l1"), off("switch.l2")] and w.tr()["last"]["reason"] == "Switch A: off"


def test_an_attribute_update_of_a_source_sends_nothing():
    w = loaded([control_rule(sources=["ws"])])
    w.set("switch.a", "off", {"x": 1})
    assert w.calls == [] and "last" not in w.tr()


def test_motion_sensor_is_repeated():
    w = loaded([control_rule(sources=["pir"])])
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
    w = loaded([control_rule(sources=["ws"])])
    w.set("switch.a", "on", own=True)
    assert w.calls == [on("switch.l1"), on("switch.l2")]


def test_source_back_from_no_data_sends_nothing():
    """Review focus 2."""
    w = loaded([control_rule(sources=["ws"])], switch__a="on")
    w.set("switch.a", "unavailable")
    w.set("switch.a", "off")
    w.set("switch.a", "unknown")
    w.set("switch.a", None)
    w.set("switch.a", "off")
    assert w.calls == [] and "last" not in w.tr()
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1"), on("switch.l2")]


# --- loads -------------------------------------------------------------------------------

def test_load_already_in_state_is_not_commanded():
    w = loaded([control_rule(sources=["ws"])], switch__l2="on")
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1")]
    assert w.tr()["last"] == {"action": "on", "target": "Lamp 1", "at": 1000000, "reason": "Switch A: on"}
    assert w.tr()["status"] == "ok"


def test_unavailable_load_errors_and_is_never_resent():
    """Review focus 3."""
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
    """Review focus 4."""
    w = loaded([control_rule(sources=["ws"])], switch__a="on")
    assert w.calls == []
    wb = loaded([control_rule(sources=["ws"])], boot=True, switch__a="on")
    wb.engine.started()
    assert wb.calls == []
    # an unchanged Save keeps the reading: a later change is detected against it
    w.load([control_rule(sources=["ws"])])
    assert w.calls == []
    w.set("switch.a", "off")
    assert w.calls == [] and w.tr()["last"]["reason"] == "Switch A: off"  # the loads are off already
    assert w.tr()["last"]["sent"] is False
    w.states["switch.a"] = ("on", {})  # changed while the rule is saved again, unchanged
    w.load([control_rule(sources=["ws"], name="Renamed")])
    assert w.calls == []
    w.engine.handle_state("switch.a")
    assert w.calls == [on("switch.l1"), on("switch.l2")]
    # a changed rule reads its source anew and sends nothing
    w.calls.clear()
    w.advance(1020)  # the commands' echoes are over
    w.states["switch.a"] = ("off", {})
    w.load([control_rule(sources=["ws"], loads=["l1"])])
    assert w.calls == []
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1")]


def test_a_rebound_source_is_read_at_save():
    """An unchanged rule whose wall switch was bound to another entity reads that entity as its starting point."""
    w = loaded([control_rule(sources=["ws"])], switch__b="on")
    rebound = dev("ws", "wall_switch", "Switch A", state="switch.b")
    w.load([control_rule(sources=["ws"])], [BTN, rebound, L1, L2])
    assert w.calls == []
    w.set("switch.b", "off")
    assert w.calls == [] and w.tr()["last"]["reason"] == "Switch A: off" and w.tr()["last"]["sent"] is False


def test_rebound_source_is_read_fresh():
    """A source entity that leaves the rule and returns is read anew, not compared with its old reading."""
    w = loaded([control_rule(sources=["ws"])])
    rebound = dev("ws", "wall_switch", "Switch A", state="switch.b")
    w.load([control_rule(sources=["ws"])], [BTN, rebound, L1, L2])
    w.set("switch.a", "on")
    w.load([control_rule(sources=["ws"])])
    w.set("switch.a", "on", {"x": 1})  # an attribute-only update: still on
    assert w.calls == []
    w.set("switch.a", "off")
    assert w.calls == [] and w.tr()["last"]["reason"] == "Switch A: off" and w.tr()["last"]["sent"] is False
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1"), on("switch.l2")]


def test_disabled_rule_ignores_everything():
    w = loaded([control_rule(sources=["btn", "ws"], enabled=False)])
    w.press("btn", TOGGLE)
    w.set("switch.a", "on")
    t = w.tr()
    assert w.calls == [] and t["status"] == "disabled" and "last" not in t
    # enabling it later: the change it saw while disabled is the starting point
    w.load([control_rule(sources=["btn", "ws"])])
    assert w.calls == []
    w.set("switch.a", "off")
    assert w.calls == [] and w.tr()["last"]["reason"] == "Switch A: off" and w.tr()["last"]["sent"] is False


def test_deleting_the_rule_sends_nothing():
    w = loaded([control_rule(sources=["ws"])])
    w.set("switch.a", "on")
    w.calls.clear()
    w.load([])
    assert w.calls == [] and not w.pending()


def test_nothing_is_switched_while_booting():
    """A retained button action replayed at start or a source settling while HA starts switches nothing; the reading
    remembered during the boot is the starting point after started()."""
    w = loaded([control_rule(sources=["btn", "ws"])], boot=True, switch__l1="on", switch__l2="on")
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
    """Review focus 1."""
    w = loaded([control_rule("a", ["ws"], ["lb"]), control_rule("b", ["b"], ["la"])])
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
    """Review focus 1."""
    w = loaded([control_rule("a", ["ws"], ["lb"]), control_rule("b", ["b"], ["la"])])
    w.set("switch.a", "on")
    w.advance(1001)
    w.set("switch.a", "off")
    assert w.calls == [on("switch.b"), off("switch.b")]
    w.set("switch.b", "on", own=True)
    w.set("switch.b", "off", own=True)
    assert w.calls == [on("switch.b"), off("switch.b")]
    assert w.states["switch.a"][0] == "off" and w.states["switch.b"][0] == "off"


def test_echo_expires():
    w = loaded([control_rule("a", ["ws"], ["lb"]), control_rule("b", ["b"], ["l1"])])
    w.set("switch.a", "on")
    assert w.calls == [on("switch.b")]
    w.advance(1011)  # the expected change never arrived
    w.set("switch.b", "on")
    assert w.calls == [on("switch.b"), on("switch.l1")]


def test_a_chain_does_not_propagate():
    """A -> B and B -> C: the change of B is the echo of A's command."""
    w = loaded([control_rule("a", ["ws"], ["lb"]), control_rule("b", ["b"], ["l1"])])
    w.set("switch.a", "on")
    w.advance(1005)
    w.set("switch.b", "on")
    assert w.calls == [on("switch.b")]


def test_echo_is_the_effective_state_of_a_load():
    """A command still on its way counts as the load's state: a second toggle turns it off again."""
    w = loaded()
    w.press("btn", TOGGLE)
    w.press("btn", TOGGLE)
    assert w.calls == [on("switch.l1"), on("switch.l2"), off("switch.l1"), off("switch.l2")]


def test_hand_switch_after_arrival_decides_from_the_reading():
    """An expected change ends when it arrives: a later hand switch of the load counts."""
    w = loaded([control_rule(loads=["l1"])])
    w.press("btn", TOGGLE)
    assert w.calls == [on("switch.l1")]
    w.set("switch.l1", "on", own=True)
    w.advance(1003)
    w.set("switch.l1", "off")  # by hand
    w.press("btn", TOGGLE)
    assert w.calls == [on("switch.l1"), on("switch.l1")]


def test_unavailable_load_beats_a_pending_echo():
    w = loaded([control_rule(loads=["l1"])])
    w.press("btn", TOGGLE)
    w.set("switch.l1", "unavailable")
    w.press("btn", TOGGLE)
    t = w.tr()
    assert w.calls == [on("switch.l1")]
    assert t["last"]["error"] == "target unavailable" and t["reason"] == "target unavailable"


def test_attribute_update_does_not_drop_a_double_flip():
    w = loaded([control_rule("a", ["ws"], ["lb"]), control_rule("b", ["b"], ["la"])])
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
    w = loaded([control_rule(sources=["ws"], loads=["la", "l1"])])
    w.set("switch.a", "on")
    assert w.calls == [on("switch.l1")]
    w.calls.clear()
    w.set("switch.a", "off")
    assert w.calls == [off("switch.l1")]


# --- other rules ------------------------------------------------------------------------------

def test_button_shared_with_a_timed_rule():
    """Review focus 5."""
    vent = dev("v", "exhaust_fan", "Vent", control="fan.vent")
    timed = rule("t", [], name="Timed switch", timed={"button": "btn", "device": "v", "minutes": 15})
    w = loaded([timed, control_rule()], DEVICES + [vent], fan__vent="off")
    w.press("btn", TOGGLE)
    assert w.calls == [("fan", "turn_on", "fan.vent"), on("switch.l1"), on("switch.l2")]
    assert w.tr("t")["timed"]["running"] is True


def test_missing_device_is_a_static_problem():
    w = loaded([control_rule(sources=["btn", "l2"], loads=["l1"])])
    w.press("btn", TOGGLE)
    t = w.tr()
    assert w.calls == [] and t["status"] == "error" and t["reason"] == "device missing"
    w2 = loaded([control_rule(loads=["l1", "pir"])])  # a motion sensor takes no on / off
    w2.press("btn", TOGGLE)
    assert w2.calls == [] and w2.tr()["reason"] == "device missing"


def test_trace_shape():
    w = loaded([control_rule(sources=["ws", "btn", "pir"])], switch__a="on", switch__l2="unavailable")
    t = w.tr()
    assert t["status"] == "ok" and t["verdict"] is None and t["inputs"] == [] and "holders" not in t
    assert t["control"] == {
        "sources": [{"id": "ws", "name": "Switch A", "kind": "wall_switch", "state": "on"},
                    {"id": "btn", "name": "Button", "kind": "smart_button", "state": None},
                    {"id": "pir", "name": "Motion", "kind": "motion_sensor", "state": "off"}],
        "loads": [{"id": "l1", "name": "Lamp 1", "state": "off"}, {"id": "l2", "name": "Lamp 2", "state": None}],
    }
    w.set("switch.l1", "on")  # a load change refreshes the trace
    assert w.tr()["control"]["loads"][0]["state"] == "on"
    assert {"switch.a", "switch.l1", "switch.l2", "binary_sensor.pir"} <= w.engine.entity_ids()


def test_trace_follows_loads_in_frames():
    w = loaded()
    frames = []
    w.engine.subscribe("p", lambda full, rules: frames.append(rules))
    w.set("switch.l1", "on")
    assert frames and frames[-1]["r"]["control"]["loads"][0]["state"] == "on"


def test_other_rules_are_untouched():
    m = dev("m", "motion_sensor", "Motion 2", motion="binary_sensor.m")
    pair = rule("c", ["m"], on_true=[("l1", "on")], on_false=[("l1", "off")], name="Pair")
    w = loaded([pair, control_rule()], DEVICES + [m], binary_sensor__m="off")
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
