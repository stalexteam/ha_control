"""Tests for the pure rule engine (no homeassistant needed)."""

import itertools
from datetime import datetime, timedelta, timezone, tzinfo

import math

import pytest

from rules import RuleEngine


class World:
    """Fake HA: states, an epoch clock, a scheduler and a service call recorder."""

    def __init__(self, tz=None, t=1000.0, **states):
        self.states = {k.replace("__", "."): v if isinstance(v, tuple) else (v, {}) for k, v in states.items()}
        self.t = t
        self.timers = []  # [due, seq, cb, alive]
        self.seq = itertools.count()
        self.calls = []
        self.fail = set()  # entity ids whose calls raise
        self.hold = False  # True: calls are held back (sent later, like live.py before HA has started)
        self.changed = {}  # entity id -> HA last_changed epoch
        extra = {"local": lambda ts: datetime.fromtimestamp(ts, tz)} if tz is not None else {}
        self.engine = RuleEngine(self.lookup, lambda: self.t, self.call, self.schedule,
                                 changed_at=self.changed.get, **extra)

    def lookup(self, eid):
        return self.states.get(eid)

    def call(self, domain, service, eid, on_error=None, current=None):
        self.on_error = on_error
        self.current = current
        self.calls.append((domain, service, eid))
        if eid in self.fail:
            raise RuntimeError("boom")
        return self.hold or None

    def schedule(self, delay, cb):
        timer = [self.t + delay, next(self.seq), cb, True]
        self.timers.append(timer)

        def cancel():
            timer[3] = False

        return cancel

    def pending(self):
        return [t for t in self.timers if t[3]]

    def advance(self, to):
        while True:
            due = sorted((t for t in self.timers if t[3] and t[0] <= to), key=lambda t: (t[0], t[1]))
            if not due:
                break
            timer = due[0]
            timer[3] = False
            self.t = timer[0]
            timer[2]()
        self.t = to

    def set(self, eid, state, attrs=None):
        if state is None:
            self.states.pop(eid, None)
        else:
            self.states[eid] = (state, attrs if attrs is not None else self.states.get(eid, (None, {}))[1])
        self.engine.handle_state(eid)


def dev(did, kind, name=None, **bindings):
    props = {"kind": kind}
    if kind == "equipment":
        props["controllable"] = bindings.pop("controllable", False)
    return {"id": did, "name": name or did, "props": props, "bindings": bindings}


def rule(rid, inputs, combine="any", on_true=(), on_false=(), on_delay=0, off_delay=0, name=None, **extra):
    r = {
        "id": rid, "name": name or rid, "zoneId": None, "combine": combine,
        "inputs": [i if isinstance(i, dict) else {"source": {"device": i}} for i in inputs],
        "onDelay": on_delay, "offDelay": off_delay,
        "onTrue": [{"device": d, "do": do} for d, do in on_true],
        "onFalse": [{"device": d, "do": do} for d, do in on_false],
    }
    r.update(extra)
    return r


def plan(devices, rules, pid="p"):
    return {"id": pid, "levels": [{"id": "l1", "devices": devices}], "rules": rules}


def neg(did):
    return {"source": {"device": did}, "not": True}


def ref(rid, negate=False):
    out = {"source": {"rule": rid}}
    if negate:
        out["not"] = True
    return out


LEAKS = [dev("s1", "leak_sensor", "Leak WC", leak="binary_sensor.s1"),
         dev("s2", "leak_sensor", "Leak kitchen", leak="binary_sensor.s2")]
VALVE = dev("v", "valve", "Valve", state="valve.v")
SW_VALVE = dev("sv", "valve", "Switch valve", state="switch.v")
CLOSE = (("v", "close"),)


def leak_world(**states):
    w = World(**{"binary_sensor__s1": "off", "binary_sensor__s2": "off", "valve__v": "open", **states})
    return w


def trace(w, rid="r", pid="p"):
    return w.engine.snapshot(pid)[rid]


# --- three-valued logic -------------------------------------------------------

T, F, U = "on", "off", "unavailable"


@pytest.mark.parametrize("combine,a,b,expected", [
    ("any", T, F, True), ("any", F, F, False), ("any", U, F, False), ("any", U, T, True), ("any", U, U, None),
    ("all", T, T, True), ("all", T, F, False), ("all", U, F, False), ("all", U, T, None), ("all", U, U, None),
])
def test_truth_table(combine, a, b, expected):
    w = World(binary_sensor__a=a, binary_sensor__b=b)
    devs = [dev("a", "motion_sensor", motion="binary_sensor.a"), dev("b", "motion_sensor", motion="binary_sensor.b")]
    w.engine.load_plans([plan(devs, [rule("r", ["a", "b"], combine)])])
    assert trace(w)["verdict"] is expected
    assert trace(w)["status"] == ("waiting" if expected is None else "ok")


@pytest.mark.parametrize("state,expected", [("on", False), ("off", True), ("unknown", None)])
def test_not_keeps_unknown(state, expected):
    w = World(binary_sensor__a=state)
    w.engine.load_plans([plan([dev("a", "motion_sensor", motion="binary_sensor.a")], [rule("r", [neg("a")])])])
    assert trace(w)["verdict"] is expected


def test_input_trace_labels_and_details():
    w = World(binary_sensor__s1="on", binary_sensor__s2="unavailable", binary_sensor__m="off", valve__v="closed")
    devs = LEAKS + [dev("m", "motion_sensor", "Hall", motion="binary_sensor.m"), VALVE, dev("x", "socket", "Plug")]
    w.engine.load_plans([plan(devs, [rule("r", ["s1", "s2", "m", "v", "x", "gone"])])])
    assert trace(w)["inputs"] == [
        {"label": "Leak WC", "value": True, "detail": "wet"},
        {"label": "Leak kitchen", "value": None, "detail": "unavailable"},
        {"label": "Hall", "value": False, "detail": "clear"},
        {"label": "Valve", "value": False, "detail": "closed"},
        {"label": "Plug", "value": None, "detail": "missing"},
        {"label": "gone", "value": None, "detail": "missing"},
    ]


def test_switch_backed_valve_input_is_open_when_on():
    w = World(switch__v="on")
    w.engine.load_plans([plan([SW_VALVE], [rule("r", ["sv"])])])
    assert trace(w)["inputs"] == [{"label": "Switch valve", "value": True, "detail": "open"}]


# --- actions ------------------------------------------------------------------

def test_leak_closes_the_valve_once():
    w = leak_world()
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1", "s2"], on_true=CLOSE)])])
    assert w.calls == []
    w.set("binary_sensor.s1", "on")
    assert w.calls == [("valve", "close_valve", "valve.v")]
    last = trace(w)["last"]
    assert last["action"] == "close" and last["target"] == "Valve" and last["at"] == 1000000
    assert "Leak WC wet" in last["reason"] and "error" not in last
    w.set("binary_sensor.s2", "on")  # already true: edge only
    assert len(w.calls) == 1


def test_switch_backed_valve_is_turned_off():
    w = leak_world(switch__v="on")
    w.engine.load_plans([plan(LEAKS + [SW_VALVE], [rule("r", ["s1"], on_true=(("sv", "close"),))])])
    w.set("binary_sensor.s1", "on")
    assert w.calls == [("switch", "turn_off", "switch.v")]


def test_light_follows_motion_on_and_off():
    w = World(binary_sensor__m="off", light__l="off")
    devs = [dev("m", "motion_sensor", motion="binary_sensor.m"), dev("l", "ceiling_light", control="light.l")]
    w.engine.load_plans([plan(devs, [rule("r", ["m"], on_true=(("l", "on"),), on_false=(("l", "off"),))])])
    w.set("binary_sensor.m", "on")
    w.set("binary_sensor.m", "off")
    off, on = ("light", "turn_off", "light.l"), ("light", "turn_on", "light.l")
    assert w.calls == [off, on, off]  # start applies "when false" too


def test_fan_and_controllable_equipment_targets():
    w = World(binary_sensor__m="off")
    devs = [dev("m", "motion_sensor", motion="binary_sensor.m"), dev("f", "exhaust_fan", control="fan.f"),
            dev("e", "equipment", control="switch.e", controllable=True)]
    w.engine.load_plans([plan(devs, [rule("r", ["m"], on_true=(("f", "on"), ("e", "on")))])])
    w.set("binary_sensor.m", "on")
    assert w.calls == [("fan", "turn_on", "fan.f"), ("switch", "turn_on", "switch.e")]


def test_not_controllable_equipment_is_a_missing_target():
    w = World(binary_sensor__m="off")
    devs = [dev("m", "motion_sensor", motion="binary_sensor.m"), dev("e", "equipment", control="switch.e"),
            dev("l", "ceiling_light", control="light.l")]
    w.engine.load_plans([plan(devs, [rule("r", ["m"], on_true=(("e", "on"), ("l", "on")))])])
    assert trace(w)["status"] == "error" and trace(w)["reason"] == "target missing"
    w.set("binary_sensor.m", "on")
    assert w.calls == [("light", "turn_on", "light.l")]


# --- debounce -----------------------------------------------------------------

def test_on_delay_fires_after_the_delay_only():
    w = leak_world()
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, on_delay=5)])])
    w.set("binary_sensor.s1", "on")
    assert w.calls == []
    assert trace(w)["pending"] == {"to": True, "at": 1005000}
    assert trace(w)["verdict"] is False
    w.advance(1004.9)
    assert w.calls == []
    w.advance(1005)
    assert w.calls == [("valve", "close_valve", "valve.v")]
    assert trace(w)["verdict"] is True and "pending" not in trace(w)


def test_unknown_input_cancels_a_pending_change():
    w = leak_world()
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, on_delay=5)])])
    w.set("binary_sensor.s1", "on")
    w.advance(1002)
    w.set("binary_sensor.s1", "unavailable")
    assert w.pending() == [] and "pending" not in trace(w)
    assert trace(w)["status"] == "waiting" and trace(w)["verdict"] is False
    w.advance(1010)
    assert w.calls == []
    w.set("binary_sensor.s1", "on")  # the next known evaluation starts over
    w.advance(1014.9)
    assert w.calls == []
    w.advance(1015)
    assert w.calls == [("valve", "close_valve", "valve.v")]


def test_change_back_before_the_delay_cancels_it():
    w = leak_world()
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, on_delay=5)])])
    w.set("binary_sensor.s1", "on")
    w.set("binary_sensor.s1", "off")
    assert w.pending() == []
    w.advance(1010)
    assert w.calls == []


def test_off_delay_fires_on_false():
    w = World(binary_sensor__m="on", light__l="on")
    devs = [dev("m", "motion_sensor", motion="binary_sensor.m"), dev("l", "ceiling_light", control="light.l")]
    w.engine.load_plans([plan(devs, [rule("r", ["m"], on_false=(("l", "off"),), off_delay=60)])])
    w.set("binary_sensor.m", "off")
    assert trace(w)["pending"] == {"to": False, "at": 1060000}
    w.advance(1059)
    assert w.calls == []
    w.advance(1060)
    assert w.calls == [("light", "turn_off", "light.l")]
    assert trace(w)["last"]["reason"].startswith("became false")


# --- start firing and reload --------------------------------------------------

def test_start_with_a_wet_sensor_fires_at_once():
    w = leak_world(binary_sensor__s2="on")
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1", "s2"], on_true=CLOSE, on_delay=30)])])
    assert w.calls == [("valve", "close_valve", "valve.v")]
    assert trace(w)["last"]["reason"].startswith("start")


def test_start_false_fires_when_false():
    w = World(binary_sensor__m="off", light__l="on")
    devs = [dev("m", "motion_sensor", motion="binary_sensor.m"), dev("l", "ceiling_light", control="light.l")]
    w.engine.load_plans([plan(devs, [rule("r", ["m"], on_true=(("l", "on"),), on_false=(("l", "off"),))])])
    assert w.calls == [("light", "turn_off", "light.l")]
    assert trace(w)["last"]["reason"].startswith("start")


def test_start_unknown_then_wet_fires_at_once():
    w = leak_world(binary_sensor__s1="unavailable")
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, on_delay=30)])])
    assert trace(w)["verdict"] is None and trace(w)["status"] == "waiting"
    w.set("binary_sensor.s1", "on")
    assert w.calls == [("valve", "close_valve", "valve.v")]


def test_reload_with_an_unchanged_rule_keeps_its_state():
    w = leak_world(binary_sensor__s1="on")
    p = plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE)])
    w.engine.load_plans([p])
    assert len(w.calls) == 1
    last = trace(w)["last"]
    w.t = 2000
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE)])])
    assert len(w.calls) == 1
    assert trace(w)["last"] == last


def test_reload_keeps_a_pending_timer_of_an_unchanged_rule():
    w = leak_world()
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, on_delay=5)])])
    w.set("binary_sensor.s1", "on")
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, on_delay=5)])])
    assert len(w.pending()) == 1
    w.advance(1005)
    assert w.calls == [("valve", "close_valve", "valve.v")]


def test_reload_after_changing_the_valve_fires_again():
    w = leak_world(binary_sensor__s1="on", valve__v2="open")
    v2 = dev("v2", "valve", "Valve 2", state="valve.v2")
    w.engine.load_plans([plan(LEAKS + [VALVE, v2], [rule("r", ["s1"], on_true=CLOSE)])])
    w.engine.load_plans([plan(LEAKS + [VALVE, v2], [rule("r", ["s1"], on_true=(("v2", "close"),))])])
    assert w.calls == [("valve", "close_valve", "valve.v"), ("valve", "close_valve", "valve.v2")]


def test_reload_after_rebinding_the_target_fires_again():
    w = leak_world(binary_sensor__s1="on", valve__w="open")
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE)])])
    w.engine.load_plans([plan(LEAKS + [dev("v", "valve", "Valve", state="valve.w")], [rule("r", ["s1"], on_true=CLOSE)])])
    assert w.calls == [("valve", "close_valve", "valve.v"), ("valve", "close_valve", "valve.w")]


def test_removed_rule_cancels_its_timer_and_leaves_the_snapshot():
    w = leak_world()
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, on_delay=5)])])
    w.set("binary_sensor.s1", "on")
    w.engine.load_plans([plan(LEAKS + [VALVE], [])])
    assert w.pending() == []
    assert w.engine.snapshot("p") == {}
    w.advance(1010)
    assert w.calls == []
    assert w.engine.entity_ids() == set()


# --- rule references ----------------------------------------------------------

def test_rule_reference_reads_the_debounced_verdict():
    w = World(binary_sensor__m="off", light__l="off")
    devs = [dev("m", "motion_sensor", motion="binary_sensor.m"), dev("l", "ceiling_light", "Lamp", control="light.l")]
    rules = [rule("b", [ref("a")], on_true=(("l", "on"),)), rule("a", ["m"], on_delay=5, name="Moving")]
    w.engine.load_plans([plan(devs, rules)])
    w.set("binary_sensor.m", "on")
    assert trace(w, "b")["verdict"] is False
    assert trace(w, "b")["inputs"] == [{"label": "Moving", "value": False, "detail": "off"}]
    w.advance(1005)
    assert trace(w, "b")["verdict"] is True
    assert trace(w, "b")["inputs"] == [{"label": "Moving", "value": True, "detail": "on"}]
    assert w.calls == [("light", "turn_on", "light.l")]


def test_disabled_rule_is_unknown_to_its_consumers():
    w = World(binary_sensor__m="on")
    devs = [dev("m", "motion_sensor", motion="binary_sensor.m"), dev("l", "ceiling_light", control="light.l")]
    rules = [rule("a", ["m"], on_true=(("l", "on"),), enabled=False), rule("b", [ref("a")], on_true=(("l", "on"),))]
    w.engine.load_plans([plan(devs, rules)])
    assert trace(w, "a")["status"] == "disabled" and trace(w, "a")["verdict"] is None
    assert trace(w, "b")["verdict"] is None and trace(w, "b")["status"] == "waiting"
    assert trace(w, "b")["inputs"][0]["value"] is None
    assert w.calls == []


def test_reference_cycle_is_unknown_with_status_cycle():
    w = World(binary_sensor__m="on")
    devs = [dev("m", "motion_sensor", motion="binary_sensor.m")]
    rules = [rule("a", ["m", ref("b")]), rule("b", [ref("a")])]
    w.engine.load_plans([plan(devs, rules)])
    assert trace(w, "b")["status"] == "error" and trace(w, "b")["reason"] == "cycle"
    assert trace(w, "a")["verdict"] is True
    w.set("binary_sensor.m", "off")  # no endless re-evaluation
    assert trace(w, "a")["verdict"] is False and trace(w, "a")["status"] == "ok"
    assert trace(w, "b")["verdict"] is None and trace(w, "b")["reason"] == "cycle"


# --- errors -------------------------------------------------------------------

def test_missing_device_is_an_error_but_other_inputs_evaluate():
    w = leak_world()
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1", "gone"], on_true=CLOSE)])])
    assert trace(w)["status"] == "error" and trace(w)["reason"] == "device missing"
    assert trace(w)["verdict"] is False
    w.set("binary_sensor.s1", "on")
    assert trace(w)["verdict"] is True
    assert w.calls == [("valve", "close_valve", "valve.v")]


def test_failing_call_records_the_error_and_other_actions_run():
    w = leak_world(valve__v2="open")
    w.fail.add("valve.v")
    v2 = dev("v2", "valve", "Valve 2", state="valve.v2")
    w.engine.load_plans([plan(LEAKS + [VALVE, v2], [rule("r", ["s1"], on_true=(("v", "close"), ("v2", "close")))])])
    w.set("binary_sensor.s1", "on")
    assert w.calls == [("valve", "close_valve", "valve.v"), ("valve", "close_valve", "valve.v2")]
    t = trace(w)
    assert t["status"] == "error" and t["reason"] == "service failed"
    assert t["last"]["target"] == "Valve" and t["last"]["error"] == "waiting for target"


def test_rules_of_every_level_and_plan():
    w = leak_world()
    p = {"id": "p", "levels": [{"id": "l1", "devices": LEAKS}, {"id": "l2", "devices": [VALVE]}],
         "rules": [rule("r", ["s1"], on_true=CLOSE)]}
    w.engine.load_plans([p, plan([], [], pid="q")])
    assert w.engine.entity_ids() == {"binary_sensor.s1", "valve.v"}
    w.set("binary_sensor.s1", "on")
    assert w.calls == [("valve", "close_valve", "valve.v")]
    assert w.engine.snapshot("q") == {}


# --- subscribe ----------------------------------------------------------------

def test_subscribe_full_snapshot_then_changes():
    w = leak_world()
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE), rule("o", ["s2"])])])
    frames = []
    unsub = w.engine.subscribe("p", lambda full, rules: frames.append((full, rules)))
    assert frames == []  # the caller sends the first snapshot itself
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE), rule("o", ["s2"])])])
    assert frames[-1][0] is True and set(frames[-1][1]) == {"r", "o"}
    w.set("binary_sensor.s1", "on")
    full, rules = frames[-1]
    assert full is False and set(rules) == {"r"} and rules["r"]["verdict"] is True
    n = len(frames)
    w.set("binary_sensor.s1", "on")  # nothing changed
    assert len(frames) == n
    unsub()
    w.set("binary_sensor.s2", "on")
    assert len(frames) == n


@pytest.mark.parametrize("change", [{"name": "Renamed"}, {"zoneId": "z2"}])
def test_reload_with_a_cosmetic_change_keeps_the_state(change):
    w = leak_world(binary_sensor__s1="on")
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE), rule("c", [ref("r")])])])
    assert len(w.calls) == 1
    last = trace(w)["last"]
    w.t = 2000
    changed = rule("r", ["s1"], on_true=CLOSE, on_delay=0)
    changed.update(change)
    w.engine.load_plans([plan(LEAKS + [VALVE], [changed, rule("c", [ref("r")])])])
    assert len(w.calls) == 1
    assert trace(w)["last"] == last and trace(w)["verdict"] is True
    assert trace(w, "c")["inputs"][0]["label"] == changed["name"]


def test_rename_keeps_a_pending_timer():
    w = leak_world()
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, on_delay=5)])])
    w.set("binary_sensor.s1", "on")
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, on_delay=5, name="New")])])
    assert len(w.pending()) == 1 and trace(w)["pending"] == {"to": True, "at": 1005000}
    w.advance(1005)
    assert w.calls == [("valve", "close_valve", "valve.v")]


# --- ANY ignores unknown inputs while any input is known (ruling A3) ------------

@pytest.mark.parametrize("states,missing", [({"binary_sensor__s2": "unavailable"}, False), ({}, True)])
def test_any_closes_again_on_a_second_leak_with_a_dead_sensor(states, missing):
    w = leak_world(**states)
    inputs = ["s1", "gone"] if missing else ["s1", "s2"]
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", inputs, on_true=CLOSE)])])
    assert trace(w)["verdict"] is False and trace(w)["unknownInputs"] == 1
    assert trace(w)["status"] == ("error" if missing else "ok")
    if missing:
        assert trace(w)["reason"] == "device missing"
    w.set("binary_sensor.s1", "on")
    w.set("binary_sensor.s1", "off")
    assert trace(w)["verdict"] is False
    w.set("binary_sensor.s1", "on")
    assert w.calls == [("valve", "close_valve", "valve.v")] * 2


def test_any_with_every_input_unknown_waits():
    w = leak_world(binary_sensor__s1="unavailable", binary_sensor__s2="unknown")
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1", "s2"], on_true=CLOSE)])])
    assert trace(w)["verdict"] is None and trace(w)["status"] == "waiting" and trace(w)["unknownInputs"] == 2


def test_all_stays_strict_with_an_unknown_input():
    w = leak_world(binary_sensor__s1="on", binary_sensor__s2="unavailable")
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1", "s2"], "all", on_true=CLOSE)])])
    assert trace(w)["verdict"] is None and trace(w)["status"] == "waiting" and trace(w)["unknownInputs"] == 1
    assert w.calls == []


def test_unknown_inputs_count_is_zero_with_all_data():
    w = leak_world()
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1", "s2"])])])
    assert trace(w)["unknownInputs"] == 0


def test_service_failed_clears_on_the_next_good_firing():
    w = leak_world()
    w.fail.add("valve.v")
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE)])])
    w.set("binary_sensor.s1", "on")
    assert trace(w)["reason"] == "service failed"
    w.fail.clear()
    w.set("binary_sensor.s1", "off")
    w.set("binary_sensor.s1", "on")
    t = trace(w)
    assert t["status"] == "ok" and "reason" not in t and "error" not in t["last"]


def test_consumer_follows_a_reference_without_delay():
    w = World(binary_sensor__m="off", light__l="off")
    devs = [dev("m", "motion_sensor", motion="binary_sensor.m"), dev("l", "ceiling_light", control="light.l")]
    rules = [rule("b", [ref("a", negate=True)], on_true=(("l", "on"),), on_false=(("l", "off"),)), rule("a", ["m"])]
    w.engine.load_plans([plan(devs, rules)])
    assert w.calls == [("light", "turn_on", "light.l")]  # start: not a = true
    w.set("binary_sensor.m", "on")
    assert trace(w, "a")["verdict"] is True and trace(w, "b")["verdict"] is False
    assert w.calls[-1] == ("light", "turn_off", "light.l")


# --- target availability and call validity -----------------------------------

@pytest.mark.parametrize("state", ["unavailable", "unknown", None])
def test_an_unavailable_target_is_still_called_but_recorded_as_an_error(state):
    w = leak_world()
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE)])])
    if state is None:
        w.states.pop("valve.v")
    else:
        w.states["valve.v"] = (state, {})
    w.set("binary_sensor.s1", "on")
    assert w.calls == [("valve", "close_valve", "valve.v")]
    t = trace(w)
    assert t["status"] == "error" and t["reason"] == "target unavailable"
    assert t["last"]["error"] == "waiting for target" and t["last"]["target"] == "Valve"
    # the next firing to an available target clears it
    w.states["valve.v"] = ("open", {})
    w.set("binary_sensor.s1", "off")
    w.set("binary_sensor.s1", "on")
    t = trace(w)
    assert t["status"] == "ok" and "error" not in t["last"]


def test_a_raising_call_wins_over_an_unavailable_target():
    w = leak_world(valve__v="unavailable")
    w.fail.add("valve.v")
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE)])])
    w.set("binary_sensor.s1", "on")
    t = trace(w)
    assert t["reason"] == "service failed" and t["last"]["error"] == "waiting for target"


def test_current_is_true_only_for_the_latest_firing_of_the_same_rule():
    w = leak_world()
    p = plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, on_false=(("v", "open"),))])
    w.engine.load_plans([p])
    w.set("binary_sensor.s1", "on")
    first = w.current
    assert first() is True
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, on_false=(("v", "open"),), name="New")])])
    assert first() is True  # a cosmetic change keeps the firing
    w.set("binary_sensor.s1", "off")  # a newer firing
    assert first() is False and w.current() is True
    second = w.current
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1", "s2"], on_true=CLOSE, on_false=(("v", "open"),))])])
    assert second() is False  # the rule changed (it restarted: a new firing)
    w.engine.load_plans([p])
    w.set("binary_sensor.s1", "on")
    third = w.current
    assert third() is True
    w.engine.load_plans([])
    assert third() is False  # the rule is gone


def test_a_late_failure_after_an_unchanged_reload_still_counts():
    w = leak_world()
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE)])])
    w.set("binary_sensor.s1", "on")
    on_error = w.on_error
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, name="Renamed")])])
    on_error("late boom")
    t = trace(w)
    assert t["status"] == "error" and t["reason"] == "service failed" and t["last"]["error"] == "waiting for target"


# --- waiting for target and re-send (spec section 10) -------------------------

CLOSE_RULE = [plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE)])]
CLOSE_CALL = ("valve", "close_valve", "valve.v")


def test_boot_missing_valve_is_closed_once_when_it_appears():
    w = leak_world()
    w.states.pop("valve.v")  # Zigbee2MQTT is not up yet
    w.engine.load_plans(CLOSE_RULE)
    w.set("binary_sensor.s1", "on")
    assert w.calls == [CLOSE_CALL]  # still sent: HA may accept it
    t = trace(w)
    assert t["status"] == "error" and t["reason"] == "target unavailable"
    assert t["last"]["error"] == "waiting for target"
    w.set("valve.v", "unavailable")  # restored entity, not available yet
    assert w.calls == [CLOSE_CALL]
    w.t = 2000.0
    w.set("valve.v", "open")
    assert w.calls == [CLOSE_CALL, CLOSE_CALL]
    t = trace(w)
    assert t["status"] == "ok" and "reason" not in t
    assert "error" not in t["last"] and t["last"]["at"] == 2000000 and t["last"]["action"] == "close"
    w.set("valve.v", "closed")
    assert len(w.calls) == 2


def test_a_valve_reopened_by_hand_after_a_good_close_is_left_open():
    w = leak_world()
    w.engine.load_plans(CLOSE_RULE)
    w.set("binary_sensor.s1", "on")
    w.set("valve.v", "closed")
    w.set("valve.v", "open")
    assert w.calls == [CLOSE_CALL]


@pytest.mark.parametrize("on_false", [(), (("v", "open"),)])
def test_a_cleared_leak_drops_the_waiting_close(on_false):
    w = leak_world(valve__v="unavailable")
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, on_false=on_false)])])
    w.set("binary_sensor.s1", "on")
    w.set("binary_sensor.s1", "off")
    n = len(w.calls)
    w.set("valve.v", "closed")
    assert CLOSE_CALL not in w.calls[n:]
    if not on_false:
        assert trace(w)["last"]["error"] == "target unavailable"  # given up: no longer waiting


def test_a_flapping_target_after_a_good_resend_gets_nothing_more():
    w = leak_world(valve__v="unavailable")
    w.engine.load_plans(CLOSE_RULE)
    w.set("binary_sensor.s1", "on")
    first_error = w.on_error
    w.set("valve.v", "open")
    assert w.calls == [CLOSE_CALL, CLOSE_CALL]
    first_error("timeout")  # a late failure of the first send does not count after the re-send
    for state in ("unavailable", "open", "unknown", "closed", "unavailable", "closed"):
        w.set("valve.v", state)
    assert len(w.calls) == 2 and trace(w)["status"] == "ok"


def test_a_failed_resend_waits_again():
    w = leak_world(valve__v="unavailable")
    w.engine.load_plans(CLOSE_RULE)
    w.set("binary_sensor.s1", "on")
    w.set("valve.v", "open")
    w.on_error("boom")
    t = trace(w)
    assert t["reason"] == "service failed" and t["last"]["error"] == "waiting for target"
    w.set("valve.v", "closed")
    assert w.calls == [CLOSE_CALL] * 3 and trace(w)["status"] == "ok"


@pytest.mark.parametrize("edit", ["disable", "retarget", "remove"])
def test_a_rule_edited_or_disabled_while_waiting_sends_nothing_more(edit):
    w = leak_world(valve__v="unavailable", valve__v2="open")
    v2 = dev("v2", "valve", "Valve 2", state="valve.v2")
    w.engine.load_plans([plan(LEAKS + [VALVE, v2], [rule("r", ["s1"], on_true=CLOSE)])])
    w.set("binary_sensor.s1", "on")
    changed = {
        "disable": [plan(LEAKS + [VALVE, v2], [rule("r", ["s1"], on_true=CLOSE, enabled=False)])],
        "retarget": [plan(LEAKS + [VALVE, v2], [rule("r", ["s1"], on_true=(("v2", "close"),))])],
        "remove": [plan(LEAKS + [VALVE, v2], [])],
    }[edit]
    w.engine.load_plans(changed)
    n = len(w.calls)
    w.set("valve.v", "open")
    assert CLOSE_CALL not in w.calls[n:]


def test_a_cosmetic_reload_keeps_the_waiting_mark():
    w = leak_world(valve__v="unavailable")
    w.engine.load_plans(CLOSE_RULE)
    w.set("binary_sensor.s1", "on")
    w.engine.load_plans([plan(LEAKS + [VALVE], [rule("r", ["s1"], on_true=CLOSE, name="Renamed")])])
    w.set("valve.v", "open")
    assert w.calls == [CLOSE_CALL, CLOSE_CALL] and trace(w)["status"] == "ok"


def test_a_raising_call_waits_and_is_resent_when_the_target_reports():
    w = leak_world(valve__v2="open")
    w.fail.add("valve.v")
    v2 = dev("v2", "valve", "Valve 2", state="valve.v2")
    w.engine.load_plans([plan(LEAKS + [VALVE, v2], [rule("r", ["s1"], on_true=(("v", "close"), ("v2", "close")))])])
    w.set("binary_sensor.s1", "on")
    w.fail.clear()
    w.set("valve.v2", "closed")  # the good target reporting sends nothing
    assert len(w.calls) == 2
    w.set("valve.v", "open")
    assert w.calls[2:] == [CLOSE_CALL]
    assert trace(w)["status"] == "ok" and "error" not in trace(w)["last"]


def test_a_late_failure_marks_waiting_and_is_resent():
    w = leak_world()
    w.engine.load_plans(CLOSE_RULE)
    w.set("binary_sensor.s1", "on")
    w.on_error("late boom")
    t = trace(w)
    assert t["reason"] == "service failed" and t["last"]["error"] == "waiting for target"
    w.set("valve.v", "closed")
    assert w.calls == [CLOSE_CALL, CLOSE_CALL] and trace(w)["status"] == "ok"


def test_a_held_call_leaves_the_target_check_to_send_time():
    w = leak_world(valve__v="unavailable")
    w.hold = True
    w.engine.load_plans(CLOSE_RULE)
    w.set("binary_sensor.s1", "on")
    t = trace(w)
    assert t["status"] == "ok" and "error" not in t["last"]  # no stale fire-time error
    w.set("valve.v", "open")  # not waiting yet: the held call has not been sent
    assert w.calls == [CLOSE_CALL]
    w.hold = False
    w.on_error("target unavailable", "target unavailable")  # the send-time check failed
    t = trace(w)
    assert t["reason"] == "target unavailable" and t["last"]["error"] == "waiting for target"
    w.set("valve.v", "closed")
    assert w.calls == [CLOSE_CALL, CLOSE_CALL] and trace(w)["status"] == "ok"


def test_a_verdict_change_without_actions_ends_the_firing():
    w = leak_world()
    w.engine.load_plans(CLOSE_RULE)
    w.set("binary_sensor.s1", "on")
    current = w.current
    w.set("binary_sensor.s1", "off")  # no "when false" actions
    assert current() is False


def test_entity_ids_include_targets_of_enabled_rules():
    w = leak_world(light__l="off")
    light = dev("l", "ceiling_light", control="light.l")
    rules = [rule("r", ["s1"], on_true=CLOSE), rule("off", ["s2"], on_false=(("l", "on"),), enabled=False)]
    w.engine.load_plans([plan(LEAKS + [VALVE, light], rules)])
    assert w.engine.entity_ids() == {"binary_sensor.s1", "binary_sensor.s2", "valve.v"}


# === stage 2: light, sun, time and held inputs, the gate ======================

H = timedelta(hours=1)


class Kyiv(tzinfo):
    """Europe/Kyiv for 2026 without tzdata: EET +2 / EEST +3, switching at 01:00 UTC on 29 March and 25 October."""

    SPRING, AUTUMN = datetime(2026, 3, 29, 1), datetime(2026, 10, 25, 1)

    def utcoffset(self, dt):
        n = dt.replace(tzinfo=None)
        if n < self.SPRING + 2 * H:
            return 2 * H
        if n < self.SPRING + 3 * H:  # 03:00-04:00 does not exist (PEP 495: fold 0 = offset before the jump)
            return 3 * H if dt.fold else 2 * H
        if n < self.AUTUMN + 2 * H:
            return 3 * H
        if n < self.AUTUMN + 3 * H:  # 03:00-04:00 happens twice (fold 0 = the first time)
            return 2 * H if dt.fold else 3 * H
        return 2 * H

    def dst(self, dt):
        return self.utcoffset(dt) - 2 * H

    def tzname(self, dt):
        return "EEST" if self.dst(dt) else "EET"

    def fromutc(self, dt):
        u = dt.replace(tzinfo=None)
        summer = self.SPRING <= u < self.AUTUMN
        fold = 1 if self.AUTUMN <= u < self.AUTUMN + H else 0
        return (u + (3 if summer else 2) * H).replace(tzinfo=self, fold=fold)


KYIV = Kyiv()


def kyiv(*args, fold=0):
    return datetime(*args, tzinfo=KYIV, fold=fold).timestamp()


def utc(*args):
    return datetime(*args, tzinfo=timezone.utc).timestamp()


def test_the_fake_zone_follows_the_2026_kyiv_rules():
    assert kyiv(2026, 3, 29, 2, 59) == utc(2026, 3, 29, 0, 59)
    assert kyiv(2026, 3, 29, 4, 0) == utc(2026, 3, 29, 1, 0)
    assert kyiv(2026, 10, 25, 3, 30) == utc(2026, 10, 25, 0, 30)
    assert kyiv(2026, 10, 25, 3, 30, fold=1) == utc(2026, 10, 25, 1, 30)
    assert datetime.fromtimestamp(utc(2026, 10, 25, 1, 30), KYIV).replace(tzinfo=None) == datetime(2026, 10, 25, 3, 30)


LUX = dev("lx", "illuminance_sensor", "Lux", illuminance="sensor.lux")
EXT = dev("ext", "wall_light", "External", control="switch.ext")
HALL = dev("m", "motion_sensor", "Hall", motion="binary_sensor.m")
HALL2 = dev("m2", "motion_sensor", "Hall 2", motion="binary_sensor.m2")
GATE = dev("g", "motion_sensor", "Gate", motion="binary_sensor.g")
SUN = {"source": {"sun": True}}
ON, OFF = ("switch", "turn_on", "switch.ext"), ("switch", "turn_off", "switch.ext")
EXT_BOTH = {"on_true": (("ext", "on"),), "on_false": (("ext", "off"),)}
G = {"source": {"device": "g"}}


def lux(v, unit="lx"):
    return (str(v), {"unit_of_measurement": unit})


def light_in(did="lx", below=10, hysteresis=5):
    return {"source": {"light": did, "below": below, "hysteresis": hysteresis}}


def dark_in(*a, **kw):
    i = light_in(*a, **kw)
    i["source"]["unknownDark"] = True
    return i


def window(a, b):
    return {"source": {"time": {"from": a, "to": b}}}


def held(*sources, state="any", seconds=1800, negate=False):
    srcs = [s if isinstance(s, dict) else {"device": s} for s in sources]
    out = {"source": {"held": {"sources": srcs, "state": state, "seconds": seconds}}}
    if negate:
        out["not"] = True
    return out


def saved(w, plans):
    """Load plans as a Save after HA start (the first load_plans is the HA start)."""
    w.engine.load_plans([])
    w.engine.load_plans(plans)


# --- light --------------------------------------------------------------------

def test_light_threshold_with_hysteresis():
    w = World(sensor__lux=lux(12))
    w.engine.load_plans([plan([LUX], [rule("r", [light_in()])])])
    assert trace(w)["inputs"] == [{"label": "Lux", "value": False, "detail": "12 lx"}]  # between at start = false
    for v, expected in [(9.5, True), (12, True), (15, True), (15.5, False), (12, False), (10, False), (9.9, True)]:
        w.set("sensor.lux", str(v))
        assert trace(w)["verdict"] is expected, v
    assert trace(w)["inputs"][0]["detail"] == "9.9 lx"


@pytest.mark.parametrize("state,detail", [
    (lux(5, "lm"), "not lx"), (lux("dark"), "unknown"), (lux("nan"), "unknown"), (("unavailable", {}), "unavailable"),
    (None, "missing"), (("5", {}), "not lx"),
])
def test_light_unknown_values(state, detail):
    w = World(**({} if state is None else {"sensor__lux": state}))
    w.engine.load_plans([plan([LUX], [rule("r", [light_in()])])])
    assert trace(w)["inputs"] == [{"label": "Lux", "value": None, "detail": detail}]
    assert trace(w)["verdict"] is None


def test_light_keeps_its_value_through_an_unknown_reading():
    w = World(sensor__lux=lux(5))
    w.engine.load_plans([plan([LUX], [rule("r", [light_in()])])])
    w.set("sensor.lux", "unavailable")
    assert trace(w)["inputs"][0]["value"] is None
    w.set("sensor.lux", "12")
    assert trace(w)["verdict"] is True


@pytest.mark.parametrize("state", [
    lux(5, "lm"), lux("dark"), lux("nan"), ("unavailable", {}), ("unknown", {}), None,
])
def test_light_unknown_counts_as_dark_when_asked(state):
    w = World(**({} if state is None else {"sensor__lux": state}))
    w.engine.load_plans([plan([LUX], [rule("r", [dark_in()])])])
    t = trace(w)
    assert t["inputs"][0]["value"] is True and t["inputs"][0]["detail"] == "no data (dark)"
    assert t["verdict"] is True


def test_light_unknown_dark_does_not_touch_the_hysteresis_memory():
    w = World(sensor__lux=lux(15))
    w.engine.load_plans([plan([LUX], [rule("r", [dark_in()])])])
    assert trace(w)["verdict"] is False
    w.set("sensor.lux", "unavailable")
    assert trace(w)["verdict"] is True
    w.set("sensor.lux", "12")  # between: memory is still false
    assert trace(w)["verdict"] is False


def test_light_unknown_dark_keeps_a_missing_device_missing():
    w = World(sensor__lux=lux(5))
    w.engine.load_plans([plan([LUX], [rule("r", [dark_in("gone")])])])
    assert trace(w)["status"] == "error" and trace(w)["reason"] == "device missing"


def test_disabled_rule_arms_no_timers():
    w = World(t=utc(2026, 1, 1, 7), binary_sensor__m="on")
    r = rule("r", [window("08:00", "09:30"), held("m")], enabled=False)
    w.engine.load_plans([plan([HALL], [r])])
    assert w.pending() == []


def test_light_needs_an_illuminance_sensor():
    w = World(binary_sensor__m="on", sensor__lux=lux(5))
    w.engine.load_plans([plan([HALL, LUX], [rule("r", [light_in("m")]), rule("q", [light_in("gone")])])])
    assert trace(w)["inputs"] == [{"label": "Hall", "value": None, "detail": "missing"}]
    assert trace(w, "q")["status"] == "error" and trace(w, "q")["reason"] == "device missing"
    assert "sensor.lux" not in w.engine.entity_ids()


def test_light_hysteresis_state_survives_an_unchanged_reload():
    w = World(sensor__lux=lux(5))
    p = plan([LUX], [rule("r", [light_in()])])
    w.engine.load_plans([p])
    w.set("sensor.lux", "12")  # between: keeps true
    assert trace(w)["verdict"] is True
    w.engine.load_plans([plan([LUX], [rule("r", [light_in()])])])
    assert trace(w)["verdict"] is True  # not reset to false


def test_first_load_with_boot_false_is_not_an_ha_start():
    w = World(binary_sensor__m="off", switch__ext="off")
    w.changed["binary_sensor.m"] = 900.0
    w.engine.load_plans(
        [plan([HALL, EXT], [rule("r", [held("m", state="off", seconds=300)], on_true=(("ext", "on"),))])], boot=False
    )
    assert trace(w)["inputs"][0]["detail"] == "off 1 / 5 min"
    assert [t[0] for t in w.pending()] == [1200.0]


def test_explicit_boot_true_on_a_later_load():
    w = World(binary_sensor__m="off", switch__ext="off")
    w.engine.load_plans([])
    w.engine.load_plans([plan([HALL, EXT], [rule("r", [held("m", state="off")], on_true=(("ext", "on"),))])], boot=True)
    assert trace(w)["inputs"][0]["detail"] == "off 30 / 30 min"


# --- sun ----------------------------------------------------------------------

@pytest.mark.parametrize("state,value,detail", [
    ("below_horizon", True, "below horizon"), ("above_horizon", False, "above horizon"),
    ("unavailable", None, "unavailable"), ("weird", None, "unknown"), (None, None, "missing"),
])
def test_sun_input(state, value, detail):
    w = World(**({} if state is None else {"sun__sun": state}))
    w.engine.load_plans([plan([], [rule("r", [SUN])])])
    assert trace(w)["inputs"] == [{"label": "Sun", "value": value, "detail": detail}]


def test_sun_is_tracked_and_follows_its_state():
    w = World(sun__sun="above_horizon")
    w.engine.load_plans([plan([], [rule("r", [SUN])])])
    assert "sun.sun" in w.engine.entity_ids()
    w.set("sun.sun", "below_horizon")
    assert trace(w)["verdict"] is True
    w.engine.load_plans([plan([], [])])
    assert w.engine.entity_ids() == set()


# --- time ---------------------------------------------------------------------

def _walk(w, flips, start_calls):
    """Each flip time changes the verdict exactly then (not a millisecond earlier), with one timer at a time."""
    for k, at in enumerate(flips):
        w.advance(at - 0.001)
        assert len(w.calls) == start_calls + k, at
        w.advance(at)
        assert len(w.calls) == start_calls + k + 1, at
        assert len(w.pending()) == 1


@pytest.mark.parametrize("day", [(2026, 3, 28), (2026, 10, 24)])
def test_time_window_across_midnight_on_a_dst_day(day):
    y, m, d = day
    w = World(tz=KYIV, t=kyiv(y, m, d, 16), switch__ext="off")
    w.engine.load_plans([plan([EXT], [rule("r", [window("17:00", "01:00")], **EXT_BOTH)])])
    assert w.calls == [OFF]
    assert trace(w)["inputs"] == [{"label": "Time", "value": False, "detail": "outside window until 17:00"}]
    assert [t[0] for t in w.pending()] == [kyiv(y, m, d, 17)]
    flips = [kyiv(y, m, d, 17), kyiv(y, m, d + 1, 1), kyiv(y, m, d + 1, 17), kyiv(y, m, d + 2, 1)]
    _walk(w, flips, 1)
    assert w.calls == [OFF, ON, OFF, ON, OFF]
    assert flips[2] - flips[1] == (15 if m == 3 else 17) * 3600  # the DST day is 23 / 25 hours long


def test_time_detail_inside_the_window():
    w = World(tz=KYIV, t=kyiv(2026, 10, 24, 23, 30))
    w.engine.load_plans([plan([], [rule("r", [window("17:00", "01:00")])])])
    assert trace(w)["inputs"] == [{"label": "Time", "value": True, "detail": "in window until 01:00"}]


def test_time_boundary_in_the_spring_gap_flips_at_the_jump():
    w = World(tz=KYIV, t=kyiv(2026, 3, 29, 2), switch__ext="off")
    w.engine.load_plans([plan([EXT], [rule("r", [window("03:30", "05:00")], **EXT_BOTH)])])
    assert w.calls == [OFF]
    _walk(w, [utc(2026, 3, 29, 1), kyiv(2026, 3, 29, 5)], 1)  # 03:30 does not exist: it starts at 04:00 EEST
    assert w.calls == [OFF, ON, OFF]


def test_time_window_in_the_repeated_autumn_hour_fires_once():
    w = World(tz=KYIV, t=kyiv(2026, 10, 25, 2), switch__ext="off")
    w.engine.load_plans([plan([EXT], [rule("r", [window("03:30", "05:00")], **EXT_BOTH)])])
    _walk(w, [kyiv(2026, 10, 25, 3, 30), kyiv(2026, 10, 25, 5)], 1)  # the second 03:00-04:00 stays in the window
    assert w.calls == [OFF, ON, OFF]


def test_time_window_ending_in_the_repeated_autumn_hour_ends_once_at_the_first_occurrence():
    w = World(tz=KYIV, t=kyiv(2026, 10, 25, 2), switch__ext="off")
    w.engine.load_plans([plan([EXT], [rule("r", [window("01:00", "03:30")], **EXT_BOTH)])])
    assert w.calls == [ON]
    _walk(w, [kyiv(2026, 10, 25, 3, 30)], 1)
    assert w.calls == [ON, OFF]
    w.advance(kyiv(2026, 10, 25, 3, 30, fold=1) + 60)  # the second 03:30 changes nothing
    assert w.calls == [ON, OFF]


def test_time_window_ending_in_the_spring_gap_ends_at_the_jump():
    w = World(tz=KYIV, t=kyiv(2026, 3, 29, 2), switch__ext="off")
    w.engine.load_plans([plan([EXT], [rule("r", [window("01:00", "03:30")], **EXT_BOTH)])])
    assert w.calls == [ON]
    _walk(w, [utc(2026, 3, 29, 1)], 1)
    assert w.calls == [ON, OFF]


def test_time_window_within_a_day_defaults_to_utc():
    w = World(t=utc(2026, 1, 1, 7, 59))
    w.engine.load_plans([plan([], [rule("r", [window("08:00", "09:30")])])])
    assert trace(w)["verdict"] is False
    w.advance(utc(2026, 1, 1, 8))
    assert trace(w)["verdict"] is True
    w.advance(utc(2026, 1, 1, 9, 29, 59))
    assert trace(w)["verdict"] is True
    w.advance(utc(2026, 1, 1, 9, 30))
    assert trace(w)["verdict"] is False
    assert [t[0] for t in w.pending()] == [utc(2026, 1, 2, 8)]


def test_time_timer_is_cancelled_on_stop_and_removal():
    w = World(t=utc(2026, 1, 1, 7))
    p = plan([], [rule("r", [window("08:00", "09:30")])])
    w.engine.load_plans([p])
    assert len(w.pending()) == 1
    w.engine.load_plans([plan([], [])])
    assert w.pending() == []
    w.engine.load_plans([p])
    w.engine.load_plans([])
    assert w.pending() == []


def test_time_timer_moves_with_a_changed_window_and_stays_on_an_unchanged_reload():
    w = World(t=utc(2026, 1, 1, 7))
    w.engine.load_plans([plan([], [rule("r", [window("08:00", "09:30")])])])
    w.engine.load_plans([plan([], [rule("r", [window("08:00", "09:30")], name="Renamed")])])
    assert [t[0] for t in w.pending()] == [utc(2026, 1, 1, 8)]
    w.engine.load_plans([plan([], [rule("r", [window("07:30", "09:30")])])])
    assert [t[0] for t in w.pending()] == [utc(2026, 1, 1, 7, 30)]


# --- held ---------------------------------------------------------------------

def test_held_at_ha_start_counts_as_held_long_ago():
    w = World(binary_sensor__m="off", switch__ext="off")
    w.engine.load_plans([plan([HALL, EXT], [rule("r", [held("m", state="off")], on_true=(("ext", "on"),))])])
    assert w.calls == [ON]
    assert trace(w)["inputs"] == [{"label": "Hall", "value": True, "detail": "off 30 / 30 min"}]
    assert w.pending() == []


def test_held_on_a_saved_rule_counts_from_last_changed():
    w = World(binary_sensor__m="off", switch__ext="off")
    w.changed["binary_sensor.m"] = 900.0
    saved(w, [plan([HALL, EXT], [rule("r", [held("m", state="off", seconds=300)], on_true=(("ext", "on"),))])])
    assert trace(w)["inputs"] == [{"label": "Hall", "value": False, "detail": "off 1 / 5 min", "until": 1200000}]
    assert [t[0] for t in w.pending()] == [1200.0]
    w.advance(1199.9)
    assert w.calls == []
    w.advance(1200)
    assert w.calls == [ON] and trace(w)["inputs"][0]["detail"] == "off 5 / 5 min"


def test_held_uses_the_latest_last_changed_and_now_when_absent():
    w = World(binary_sensor__m="off", binary_sensor__m2="off")
    w.changed.update({"binary_sensor.m": 100.0, "binary_sensor.m2": 900.0})
    rules = [rule("r", [held("m", "m2", seconds=300)]), rule("q", [held("m", "gone", seconds=300)])]
    saved(w, [plan([HALL, HALL2], rules)])
    assert sorted(t[0] for t in w.pending()) == [1200.0, 1300.0]


def test_held_with_a_rule_source_counts_from_the_save():
    w = World(binary_sensor__m="off")
    w.changed["binary_sensor.m"] = 0.0
    saved(w, [plan([HALL], [rule("a", ["m"]), rule("b", [held({"rule": "a"}, state="off", seconds=60)])])])
    assert trace(w, "b")["inputs"] == [{"label": "a", "value": False, "detail": "off 0 / 1 min", "until": 1060000}]
    w.advance(1060)
    assert trace(w, "b")["verdict"] is True
    w.set("binary_sensor.m", "on")  # the rule's verdict changes: held again from now
    assert trace(w, "b")["verdict"] is False and w.pending() == []


def test_held_on_state_restarts_on_a_change():
    w = World(binary_sensor__m="on")
    w.engine.load_plans([plan([HALL], [rule("r", [held("m", state="on", seconds=60)])])])
    assert trace(w)["verdict"] is True
    w.t = 1010
    w.set("binary_sensor.m", "off")
    assert trace(w)["verdict"] is False and trace(w)["inputs"][0]["detail"] == "off" and w.pending() == []
    w.t = 1020
    w.set("binary_sensor.m", "on")
    assert trace(w)["inputs"][0]["detail"] == "on 0 / 1 min"
    w.advance(1079.9)
    assert trace(w)["verdict"] is False
    w.advance(1080)
    assert trace(w)["verdict"] is True


def test_held_detail_in_seconds_and_not():
    w = World(binary_sensor__m="off")
    saved(w, [plan([HALL], [rule("r", [held("m", seconds=45, negate=True)])])])
    assert trace(w)["inputs"] == [{"label": "Hall", "value": False, "detail": "unchanged 0 / 45 s", "until": 1045000}]
    assert trace(w)["verdict"] is True  # NOT held = changed within the last 45 s
    w.advance(1045)
    assert trace(w)["verdict"] is False


def test_held_is_unknown_when_every_source_is_unknown():
    w = World(binary_sensor__m="unavailable", binary_sensor__m2="off")
    w.engine.load_plans([plan([HALL, HALL2], [rule("r", [held("m")]), rule("q", [held("m", "m2")])])])
    assert trace(w)["inputs"] == [{"label": "Hall", "value": None, "detail": "unknown"}]
    assert trace(w)["verdict"] is None
    assert trace(w, "q")["verdict"] is True
    assert trace(w, "q")["inputs"][0]["label"] == "Hall, Hall 2"


@pytest.mark.parametrize("two", [False, True])
def test_held_source_unavailable_for_a_moment_keeps_the_time(two):
    w = World(binary_sensor__m="on", binary_sensor__m2="off")
    sources = ("m", "m2") if two else ("m",)
    saved(w, [plan([HALL, HALL2], [rule("r", [held(*sources)])])])
    w.t = 1500
    w.set("binary_sensor.m", "unavailable")
    w.t = 1510
    w.set("binary_sensor.m", "on")
    w.advance(2799.9)
    assert trace(w)["verdict"] is False
    w.advance(2800)
    assert trace(w)["verdict"] is True


def test_held_return_from_no_data_in_another_state_does_not_restart():
    w = World(binary_sensor__m="on")
    saved(w, [plan([HALL], [rule("r", [held("m")])])])
    w.t = 1500
    w.set("binary_sensor.m", "unavailable")
    w.t = 1510
    w.set("binary_sensor.m", "off")  # back from no data with another value: not a change
    assert trace(w)["inputs"][0]["detail"].startswith("unchanged")
    w.advance(2799.9)
    assert trace(w)["verdict"] is False
    w.advance(2800)
    assert trace(w)["verdict"] is True


def test_held_known_to_known_change_next_to_a_return_restarts():
    w = World(binary_sensor__m="on", binary_sensor__m2="unavailable")
    saved(w, [plan([HALL, HALL2], [rule("r", [held("m", "m2")])])])
    w.t = 1500
    w.set("binary_sensor.m", "off")  # known -> known; the combined state changes
    w.set("binary_sensor.m2", "off")
    assert [t[0] for t in w.pending()] == [3300.0]


def test_held_sources_unknown_at_the_start_count_as_held_long_ago_when_known():
    w = World(binary_sensor__m="unavailable")
    saved(w, [plan([HALL], [rule("r", [held("m")])])])
    assert trace(w)["verdict"] is None
    w.t = 1010
    w.set("binary_sensor.m", "on")
    assert trace(w)["verdict"] is True and w.pending() == []


def test_held_long_ago_last_changed_counts_as_held_and_the_latest_other_one_wins():
    w = World(binary_sensor__m="off", binary_sensor__m2="off")
    w.changed["binary_sensor.m"] = -math.inf
    saved(w, [plan([HALL], [rule("r", [held("m")])])])
    assert trace(w)["verdict"] is True and w.pending() == []
    w.changed["binary_sensor.m2"] = 900.0
    saved(w, [plan([HALL, HALL2], [rule("q", [held("m", "m2")])])])
    assert [t[0] for t in w.pending()] == [2700.0]


def test_held_save_skips_sources_without_data():
    w = World(binary_sensor__m="unavailable", binary_sensor__m2="off")
    w.t = 5000
    w.changed.update({"binary_sensor.m": 4990.0, "binary_sensor.m2": 100.0})
    saved(w, [plan([HALL, HALL2], [rule("r", [held("m", "m2")])])])
    assert trace(w)["verdict"] is True and w.pending() == []


def test_held_unchanged_reload_keeps_the_no_data_memory():
    w = World(binary_sensor__m="on")
    saved(w, [plan([HALL], [rule("r", [held("m")])])])
    w.t = 1500
    w.set("binary_sensor.m", "unavailable")
    w.engine.load_plans([plan([HALL], [rule("r", [held("m")], name="Renamed")])])
    w.t = 1510
    w.set("binary_sensor.m", "off")
    assert [t[0] for t in w.pending()] == [2800.0]


def test_held_change_time_survives_an_unchanged_reload_and_a_changed_one_restarts():
    w = World(binary_sensor__m="off")
    saved(w, [plan([HALL], [rule("r", [held("m")])])])
    w.t = 2000
    w.engine.load_plans([plan([HALL], [rule("r", [held("m")], name="Renamed")])])
    assert [t[0] for t in w.pending()] == [2800.0]
    w.engine.load_plans([plan([HALL], [rule("r", [held("m", seconds=1700)])])])  # changed: last_changed or now
    assert [t[0] for t in w.pending()] == [3700.0]


def test_held_timer_is_cancelled_when_the_source_changes_and_on_stop():
    w = World(binary_sensor__m="off")
    saved(w, [plan([HALL], [rule("r", [held("m", state="off", seconds=60)])])])
    assert len(w.pending()) == 1
    w.set("binary_sensor.m", "on")
    assert w.pending() == []
    w.set("binary_sensor.m", "off")
    w.engine.load_plans([])
    assert w.pending() == []


# --- the gate -----------------------------------------------------------------

def gate_world(gate_state="off", **states):
    return World(**{"binary_sensor__m": "off", "binary_sensor__g": gate_state, "switch__ext": "off", **states})


def test_closed_gate_holds_actions_and_opening_sends_the_current_verdict_once():
    w = gate_world()
    w.engine.load_plans([plan([HALL, GATE, EXT], [rule("r", ["m"], gate=G, **EXT_BOTH)])])
    assert w.calls == []  # the start "off" waits for the gate
    t = trace(w)
    assert t["gate"] == {"value": False, "detail": "clear"} and t["held"] is True and t["verdict"] is False
    w.set("binary_sensor.m", "on")
    w.set("binary_sensor.m", "off")
    w.set("binary_sensor.m", "on")
    assert w.calls == [] and trace(w)["verdict"] is True
    w.set("binary_sensor.g", "on")
    assert w.calls == [ON]
    t = trace(w)
    assert t["gate"] == {"value": True, "detail": "motion"} and "held" not in t
    assert t["last"]["reason"].startswith("gate opened")
    w.set("binary_sensor.g", "on")
    assert w.calls == [ON]


@pytest.mark.parametrize("gate_state", ["unavailable", "unknown"])
def test_unknown_gate_is_closed(gate_state):
    w = gate_world(gate_state, binary_sensor__m="on")
    w.engine.load_plans([plan([HALL, GATE, EXT], [rule("r", ["m"], gate=G, **EXT_BOTH)])])
    assert w.calls == [] and trace(w)["gate"] == {"value": None, "detail": gate_state}


def test_gate_with_not_and_no_gate_trace_without_one():
    w = gate_world("on", binary_sensor__m="on")
    w.engine.load_plans([plan([HALL, GATE, EXT], [rule("r", ["m"], gate=neg("g"), **EXT_BOTH), rule("q", ["m"])])])
    assert w.calls == [] and trace(w)["gate"] == {"value": False, "detail": "motion"}
    assert "gate" not in trace(w, "q") and "held" not in trace(w, "q")
    w.set("binary_sensor.g", "off")
    assert w.calls == [ON]


def test_gate_reopening_sends_a_verdict_applied_before_it_closed():
    w = gate_world("on")
    w.engine.load_plans([plan([HALL, GATE, EXT], [rule("r", ["m"], gate=G, **EXT_BOTH)])])
    w.set("binary_sensor.m", "on")
    w.set("binary_sensor.g", "off")
    w.set("binary_sensor.g", "on")
    assert w.calls == [OFF, ON, ON]


def test_gate_without_actions_for_the_verdict_holds_nothing():
    w = gate_world()
    w.engine.load_plans([plan([HALL, GATE, EXT], [rule("r", ["m"], gate=G, on_true=(("ext", "on"),))])])
    assert "held" not in trace(w)
    w.set("binary_sensor.g", "on")
    assert w.calls == []


def test_closed_gate_suppresses_resends_and_opening_sends_once():
    w = leak_world(valve__v="unavailable", binary_sensor__g="on")
    w.engine.load_plans([plan(LEAKS + [VALVE, GATE], [rule("r", ["s1"], on_true=CLOSE, gate=G)])])
    w.set("binary_sensor.s1", "on")
    assert w.calls == [CLOSE_CALL] and trace(w)["last"]["error"] == "waiting for target"
    w.set("binary_sensor.g", "off")
    w.set("valve.v", "open")
    assert w.calls == [CLOSE_CALL]
    w.set("binary_sensor.g", "on")
    assert w.calls == [CLOSE_CALL, CLOSE_CALL] and trace(w)["status"] == "ok"


def test_verdict_change_under_a_closed_gate_drops_the_waiting_action():
    w = leak_world(valve__v="unavailable", binary_sensor__g="on")
    w.engine.load_plans([plan(LEAKS + [VALVE, GATE], [rule("r", ["s1"], on_true=CLOSE, gate=G)])])
    w.set("binary_sensor.s1", "on")
    w.set("binary_sensor.g", "off")
    w.set("binary_sensor.s1", "off")
    assert trace(w)["last"]["error"] == "target unavailable"  # given up
    w.set("valve.v", "open")
    w.set("binary_sensor.g", "on")  # the current verdict (false) has no actions
    assert w.calls == [CLOSE_CALL]


def test_debounced_change_under_a_closed_gate_is_tracked():
    w = gate_world()
    w.engine.load_plans([plan([HALL, GATE, EXT], [rule("r", ["m"], gate=G, on_delay=5, **EXT_BOTH)])])
    w.set("binary_sensor.m", "on")
    w.advance(1005)
    assert trace(w)["verdict"] is True and w.calls == []
    w.set("binary_sensor.g", "on")
    assert w.calls == [ON]


def test_gate_and_held_sources_count_for_cycles_and_entities():
    w = World(binary_sensor__m="on", binary_sensor__g="on")
    rules = [rule("a", ["m"], gate=ref("b")), rule("b", [held({"rule": "a"}, "g")])]
    w.engine.load_plans([plan([HALL, GATE], rules)])
    assert {trace(w, "a")["status"], trace(w, "b")["status"]} == {"ok", "error"}
    assert "cycle" in (trace(w, "a").get("reason"), trace(w, "b").get("reason"))
    w.set("binary_sensor.m", "off")  # no endless re-evaluation
    assert w.engine.entity_ids() == {"binary_sensor.m", "binary_sensor.g"}


def test_gate_input_with_a_missing_device_is_an_error():
    w = gate_world()
    w.engine.load_plans([plan([HALL, EXT], [rule("r", ["m"], gate=G, **EXT_BOTH)])])
    assert trace(w)["reason"] == "device missing" and w.calls == []


# --- review focus: the outside light ------------------------------------------

def outside_light():
    return [plan([LUX, EXT], [rule("r", [light_in(), SUN], "all", gate=held("ext"), **EXT_BOTH)])]


def test_outside_light_dusk_hysteresis_and_a_manual_switch():
    w = World(sensor__lux=lux(50), sun__sun="above_horizon", switch__ext="off")
    w.engine.load_plans(outside_light())
    assert w.calls == [OFF]  # start, both ways, gate open (held since HA start)
    w.t = 2000
    w.set("sun.sun", "below_horizon")
    w.set("sensor.lux", "9")
    assert w.calls == [OFF, ON]
    w.set("switch.ext", "on")  # the light follows: the gate closes for 30 min
    assert trace(w)["held"] is True
    assert trace(w)["gate"] == {"value": False, "detail": "unchanged 0 / 30 min", "until": 3800000}
    for v in ("12", "14", "9.5", "15", "11"):
        w.set("sensor.lux", v)
    assert w.calls == [OFF, ON]
    w.advance(3800)
    assert w.calls == [OFF, ON, ON]  # the gate opens: the current verdict once more
    w.t = 5000
    w.set("switch.ext", "off")  # the owner switches it off
    w.advance(6799.9)
    assert w.calls == [OFF, ON, ON]
    w.advance(6800)
    assert w.calls == [OFF, ON, ON, ON] and trace(w)["last"]["reason"].startswith("gate opened")


@pytest.mark.parametrize("late", [False, True])
def test_outside_light_after_an_ha_restart_at_night_turns_on_at_once(late):
    w = World(sensor__lux=lux(3), sun__sun="below_horizon", switch__ext="unavailable" if late else "off")
    w.engine.load_plans(outside_light())
    if late:  # the switch comes up after the rules started
        assert w.calls == []
        w.t = 1100
        w.set("switch.ext", "off")
    assert w.calls == [ON]


# --- wet zone ventilation -------------------------------------------------------

WC = dev("wc", "climate_sensor", "WC", temperature="sensor.wc_t", humidity="sensor.wc_h")
MAIN = dev("main", "climate_sensor", "Main", temperature="sensor.m_t", humidity="sensor.m_h")
FAN = dev("fan", "exhaust_fan", "Fan", control="switch.fan")


def vent_rule(above=9, below=5, run_on=600, **extra):
    return rule("r", [], on_true=[("fan", "on")], on_false=[("fan", "off")], off_delay=run_on,
                vent={"sensor": "wc", "than": "main", "above": above, "below": below}, **extra)


def vent_world(wc=(24, 80), main=(22, 50), **extra):
    w = World(sensor__wc_t=(str(wc[0]), {"unit_of_measurement": "°C"}), sensor__wc_h=(str(wc[1]), {"unit_of_measurement": "%"}),
              sensor__m_t=(str(main[0]), {"unit_of_measurement": "°C"}), sensor__m_h=(str(main[1]), {"unit_of_measurement": "%"}),
              switch__fan="off", **extra)
    w.engine.load_plans([plan([WC, MAIN, FAN], [vent_rule()])])
    return w


def test_vent_wet_zone_turns_the_fan_on_and_names_the_trace():
    w = vent_world()
    t = trace(w)
    assert t["verdict"] is True and w.calls == [("switch", "turn_on", "switch.fan")]
    assert len(t["inputs"]) == 1 and t["inputs"][0]["label"] == "WC vs Main" and t["inputs"][0]["value"] is True
    assert t["inputs"][0]["detail"].startswith("17.4 / 9.7 g/m³ (+") and t["inputs"][0]["detail"].endswith(" %)")


def test_vent_between_thresholds_keeps_state_and_off_runs_on():
    w = vent_world()
    w.set("sensor.wc_h", "48")  # ratio between 1.05 and 1.09: keeps on
    assert trace(w)["verdict"] is True
    w.set("sensor.wc_h", "40")  # clearly below
    assert trace(w)["inputs"][0]["value"] is False and trace(w)["verdict"] is True  # run-on
    assert trace(w)["pending"]["to"] is False
    w.advance(1000.0 + 599)
    assert trace(w)["verdict"] is True
    w.advance(1000.0 + 600)
    assert trace(w)["verdict"] is False and w.calls[-1] == ("switch", "turn_off", "switch.fan")


def test_vent_between_at_start_is_false_and_off_fires_at_start():
    w = vent_world(wc=(22, 53))
    assert trace(w)["inputs"][0]["value"] is False
    assert trace(w)["verdict"] is False and w.calls == [("switch", "turn_off", "switch.fan")]


@pytest.mark.parametrize("eid", ["sensor.wc_t", "sensor.wc_h", "sensor.m_t", "sensor.m_h"])
def test_vent_each_entity_triggers_and_unknown_blocks(eid):
    w = vent_world()
    n = len(w.calls)
    w.set(eid, "unavailable")
    t = trace(w)
    assert t["inputs"][0]["value"] is None and t["inputs"][0]["detail"] == "unavailable"
    assert t["unknownInputs"] == 1 and t["verdict"] is True and len(w.calls) == n
    w.set(eid, "unknown")
    assert trace(w)["inputs"][0]["detail"] == "unknown"
    w.set(eid, "23" if eid.endswith("t") else "80")
    assert trace(w)["inputs"][0]["value"] is True


def test_vent_entity_ids_cover_all_four_and_the_fan():
    w = vent_world()
    assert w.engine.entity_ids() == {"sensor.wc_t", "sensor.wc_h", "sensor.m_t", "sensor.m_h", "switch.fan"}


def test_vent_fahrenheit_gives_the_same_verdict():
    w = vent_world()
    f = (22 * 9 / 5 + 32)
    w.set("sensor.m_t", str(f), {"unit_of_measurement": "°F"})
    w.set("sensor.wc_t", str(24 * 9 / 5 + 32), {"unit_of_measurement": "°F"})
    assert trace(w)["inputs"][0]["value"] is True
    assert trace(w)["inputs"][0]["detail"].startswith("17.4 / 9.7")


@pytest.mark.parametrize("eid,state,attrs,detail", [
    ("sensor.wc_t", "24", {"unit_of_measurement": "K"}, "not °C"),
    ("sensor.wc_h", "80", {}, "not %"),
    ("sensor.wc_h", "120", {"unit_of_measurement": "%"}, "not %"),
    ("sensor.m_t", "abc", {"unit_of_measurement": "°C"}, "no data"),
    ("sensor.m_h", "nan", {"unit_of_measurement": "%"}, "no data"),
])
def test_vent_unknown_causes(eid, state, attrs, detail):
    w = vent_world()
    w.set(eid, state, attrs)
    assert trace(w)["inputs"][0]["value"] is None and trace(w)["inputs"][0]["detail"] == detail


def test_vent_missing_entity_and_missing_device():
    w = World(sensor__wc_t=("24", {"unit_of_measurement": "°C"}), sensor__wc_h=("80", {"unit_of_measurement": "%"}),
              sensor__m_t=("22", {"unit_of_measurement": "°C"}), switch__fan="off")
    w.engine.load_plans([plan([WC, MAIN, FAN], [vent_rule()])])
    assert trace(w)["inputs"][0]["detail"] == "missing" and trace(w)["verdict"] is None
    w.engine.load_plans([plan([WC, FAN], [vent_rule()])])
    assert trace(w)["status"] == "error" and trace(w)["reason"] == "device missing"
    w.engine.load_plans([plan([WC, MAIN], [vent_rule()])])
    assert trace(w)["status"] == "error" and trace(w)["reason"] == "target missing"


def test_vent_zero_humidity_reference_is_unknown():
    w = vent_world(main=(22, 0))
    assert trace(w)["inputs"][0]["value"] is None


def test_vent_rule_is_an_input_of_another_rule():
    w = vent_world(binary_sensor__x="off")
    x = dev("x", "motion_sensor", "X", motion="binary_sensor.x")
    other = rule("q", [ref("r")])
    w.engine.load_plans([plan([WC, MAIN, FAN, x], [vent_rule(), other])])
    assert trace(w, "q")["verdict"] is True


def test_vent_changed_params_restart_and_unchanged_keep_state():
    w = vent_world()
    w.set("sensor.wc_h", "48")
    w.engine.load_plans([plan([WC, MAIN, FAN], [vent_rule(name="renamed")])])
    assert trace(w)["verdict"] is True and trace(w)["inputs"][0]["value"] is True  # kept the memory
    w.engine.load_plans([plan([WC, MAIN, FAN], [vent_rule(above=9, below=5.5)])])
    assert trace(w)["inputs"][0]["value"] is False  # restarted: between at start = false


@pytest.mark.parametrize("t", ["-273.15", "-243.12", "150"])
def test_vent_absurd_temperature_is_no_data(t):
    w = vent_world()
    w.set("sensor.wc_t", t, {"unit_of_measurement": "°C"})
    assert trace(w)["inputs"][0]["value"] is None and trace(w)["inputs"][0]["detail"] == "no data"


def test_vent_source_that_is_not_a_dict_does_not_raise():
    w = World()
    w.engine.load_plans([plan([WC], [rule("r", [{"source": {"vent": "x"}}])])])
    assert trace(w)["status"] == "error"


def test_vent_run_on_finishes_when_a_sensor_drops_out():
    w = vent_world()
    w.set("sensor.wc_h", "40")  # run-on starts at t=1000
    w.advance(1300.0)
    w.set("sensor.m_t", "unavailable")
    assert trace(w)["pending"]["to"] is False
    n = len(w.calls)
    w.advance(1599.0)
    assert len(w.calls) == n
    w.advance(1600.0)
    assert w.calls[-1] == ("switch", "turn_off", "switch.fan") and trace(w)["verdict"] is False
    n = len(w.calls)
    w.set("sensor.m_t", "22")
    assert len(w.calls) == n and trace(w)["verdict"] is False


def test_vent_unknown_starts_nothing_new():
    w = vent_world(wc=(22, 40))
    w.set("sensor.m_t", "unavailable")
    assert "pending" not in trace(w)


def test_condition_rule_pending_still_cancelled_by_unknown():
    w = World(binary_sensor__m="on")
    m = dev("m", "motion_sensor", "M", motion="binary_sensor.m")
    lamp = dev("l", "wall_light", "L", control="light.l")
    w.engine.load_plans([plan([m, lamp], [rule("r", ["m"], on_true=[("l", "on")], on_false=[("l", "off")], off_delay=600)])])
    w.set("binary_sensor.m", "off")
    assert trace(w)["pending"]["to"] is False
    w.set("binary_sensor.m", "unavailable")
    assert "pending" not in trace(w)


def test_vent_detail_never_shows_minus_zero():
    w = vent_world()
    w.set("sensor.wc_t", "22")
    w.set("sensor.wc_h", "49.8")
    assert "-0" not in trace(w)["inputs"][0]["detail"]


def test_vent_trace_is_structured():
    w = vent_world()
    v = trace(w)["inputs"][0]["vent"]
    assert v["a"]["t"] == 24 and v["a"]["rh"] == 80 and v["a"]["why"] is None
    assert v["b"]["t"] == 22 and v["b"]["rh"] == 50 and v["b"]["why"] is None
    assert math.isclose(v["a"]["ah"], 17.4, abs_tol=0.1) and math.isclose(v["b"]["ah"], 9.7, abs_tol=0.1)
    assert isinstance(v["pct"], int) and trace(w)["inputs"][0]["detail"].endswith(f"({v['pct']:+d} %)")


def test_vent_trace_fahrenheit_is_converted_to_celsius():
    w = vent_world()
    w.set("sensor.wc_t", str(24 * 9 / 5 + 32), {"unit_of_measurement": "°F"})
    assert math.isclose(trace(w)["inputs"][0]["vent"]["a"]["t"], 24)


def test_vent_trace_unavailable_sensor_has_a_reason_and_no_percent():
    w = vent_world()
    w.set("sensor.m_h", "unavailable")
    v = trace(w)["inputs"][0]["vent"]
    assert v["b"] == {"t": 22.0, "rh": None, "ah": None, "why": "unavailable"}
    assert v["a"]["why"] is None and v["a"]["ah"] is not None and v["pct"] is None


def test_vent_trace_missing_device_and_zero_reference():
    w = vent_world(main=(22, 0))
    v = trace(w)["inputs"][0]["vent"]
    assert v["pct"] is None and v["b"]["why"] is None
    w.engine.load_plans([plan([WC, FAN], [vent_rule()])])
    v = trace(w)["inputs"][0]["vent"]
    assert v["b"]["why"] == "missing" and v["pct"] is None


def test_non_vent_rules_have_no_vent_key():
    w = vent_world(binary_sensor__x="off")
    x = dev("x", "motion_sensor", "X", motion="binary_sensor.x")
    w.engine.load_plans([plan([WC, MAIN, FAN, x], [vent_rule(), rule("q", [ref("r")])])])
    assert "vent" not in trace(w, "q")["inputs"][0]


def test_vent_trace_sensor_keeps_readable_parts():
    w = vent_world()
    w.set("sensor.wc_h", "unavailable")
    v = trace(w)["inputs"][0]["vent"]
    assert v["a"] == {"t": 24.0, "rh": None, "ah": None, "why": "unavailable"}
    w.set("sensor.wc_h", "80")
    w.set("sensor.wc_t", "unavailable")
    v = trace(w)["inputs"][0]["vent"]
    assert v["a"] == {"t": None, "rh": 80.0, "ah": None, "why": "unavailable"}


def test_vent_trace_temperature_reason_comes_first():
    w = vent_world()
    w.set("sensor.wc_t", "24", {"unit_of_measurement": "K"})
    w.set("sensor.wc_h", "unknown")
    v = trace(w)["inputs"][0]["vent"]["a"]
    assert v["why"] == "not °C" and v["rh"] is None and v["t"] is None


def test_vent_trace_missing_device_leaves_the_other_sensor_readable():
    w = vent_world()
    w.engine.load_plans([plan([WC, FAN], [vent_rule()])])
    v = trace(w)["inputs"][0]["vent"]
    assert v["b"]["why"] == "missing" and v["b"]["t"] is None
    assert v["a"]["why"] is None and v["a"]["t"] == 24.0 and v["a"]["ah"] is not None and v["pct"] is None
