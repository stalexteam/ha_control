"""Tests for the pure rule engine (no homeassistant needed)."""

import itertools

import pytest

from rules import RuleEngine


class World:
    """Fake HA: states, an epoch clock, a scheduler and a service call recorder."""

    def __init__(self, **states):
        self.states = {k.replace("__", "."): (v, {}) for k, v in states.items()}
        self.t = 1000.0
        self.timers = []  # [due, seq, cb, alive]
        self.seq = itertools.count()
        self.calls = []
        self.fail = set()  # entity ids whose calls raise
        self.hold = False  # True: calls are held back (sent later, like live.py before HA has started)
        self.engine = RuleEngine(self.lookup, lambda: self.t, self.call, self.schedule)

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

    def set(self, eid, state):
        if state is None:
            self.states.pop(eid, None)
        else:
            self.states[eid] = (state, {})
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
    assert w.calls == [("light", "turn_on", "light.l"), ("light", "turn_off", "light.l")]


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


def test_start_false_fires_nothing():
    w = World(binary_sensor__m="off")
    devs = [dev("m", "motion_sensor", motion="binary_sensor.m"), dev("l", "ceiling_light", control="light.l")]
    w.engine.load_plans([plan(devs, [rule("r", ["m"], on_false=(("l", "off"),))])])
    assert w.calls == []


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
    assert second() is False  # the rule changed (it restarts dry: nothing fired)
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
