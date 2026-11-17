"""Leak protection rules in the pure engine."""

from test_rules import LEAKS, SW_VALVE, VALVE, World, dev, plan, rule, trace


def leak_rule(valves=("v",), sensors=("s1", "s2"), **extra):
    r = rule("r", [], **extra)
    r["leak"] = {"sensors": list(sensors), "valves": list(valves)}
    return r


def world(devs=None, **states):
    base = {"binary_sensor__s1": "off", "binary_sensor__s2": "off", "valve__v": "open"}
    w = World(**{**base, **states})
    w.engine.load_plans([plan(devs or [*LEAKS, VALVE], [leak_rule()])])
    return w


CLOSE = ("valve", "close_valve", "valve.v")


def test_wet_sensor_closes_the_valve_once():
    w = world()
    assert w.calls == []
    w.set("binary_sensor.s1", "on")
    assert w.calls == [CLOSE]
    w.set("binary_sensor.s2", "on")
    assert w.calls == [CLOSE]
    t = trace(w)
    assert t["verdict"] is True and t["status"] == "ok"
    assert [i["label"] for i in t["inputs"]] == ["Leak WC", "Leak kitchen"]


def test_opened_while_wet_is_closed_again_and_dry_leaves_it():
    w = world()
    w.set("binary_sensor.s1", "on")
    w.set("valve.v", "closed")
    assert trace(w)["leak"]["valves"] == [{"id": "v", "name": "Valve", "state": "closed"}]
    w.set("valve.v", "opening")
    assert w.calls == [CLOSE, CLOSE]
    assert trace(w)["last"]["reason"] == "re-closed: leak"
    assert trace(w)["leak"]["valves"][0]["state"] == "open"
    w.set("valve.v", "closing")
    w.set("valve.v", "closed")
    w.set("valve.v", "open")
    assert len(w.calls) == 3
    w.set("binary_sensor.s1", "off")
    w.set("valve.v", "closed")
    w.set("valve.v", "open")
    assert len(w.calls) == 3  # dry: the valve stays open


def test_close_does_not_loop():
    w = world()
    w.set("binary_sensor.s1", "on")
    w.set("valve.v", "closing")
    w.set("valve.v", "closed")
    assert len(w.calls) == 1


def test_switch_bound_valve_recloses_on_on():
    w = world([*LEAKS, SW_VALVE], switch__v="on")
    w.engine.load_plans([plan([*LEAKS, SW_VALVE], [leak_rule(valves=("sv",))])])
    w.set("binary_sensor.s1", "on")
    assert w.calls == [("switch", "turn_off", "switch.v")]
    w.set("switch.v", "off")
    w.set("switch.v", "on")
    assert w.calls[-1] == ("switch", "turn_off", "switch.v") and len(w.calls) == 2
    assert trace(w)["leak"]["valves"][0]["state"] == "open"


def test_unavailable_valve_closes_when_it_comes_back():
    w = world(valve__v="unavailable")
    w.set("binary_sensor.s1", "on")
    assert trace(w)["last"]["error"] == "waiting for target"
    w.set("valve.v", "open")
    assert w.calls == [CLOSE, CLOSE]
    assert "error" not in trace(w)["last"]
    assert trace(w)["leak"]["valves"][0]["state"] == "open"


def test_unavailable_valve_state_is_null():
    w = world(valve__v="unavailable")
    assert trace(w)["leak"]["valves"][0]["state"] is None


def test_sensors_unavailable_nothing_closes_one_wet_closes():
    w = world(binary_sensor__s1="unavailable", binary_sensor__s2="unavailable")
    assert w.calls == [] and trace(w)["verdict"] is None and trace(w)["status"] == "waiting"
    w.set("binary_sensor.s2", "on")
    assert w.calls == [CLOSE]
    w.set("binary_sensor.s1", "off")
    assert len(w.calls) == 1


def test_start_with_a_wet_sensor_closes():
    w = World(binary_sensor__s1="on", binary_sensor__s2="off", valve__v="open")
    w.engine.load_plans([plan([*LEAKS, VALVE], [leak_rule()])])
    assert w.calls == [CLOSE]


def test_no_reclose_when_disabled_or_missing_valve_is_an_error():
    w = World(binary_sensor__s1="on", binary_sensor__s2="off", valve__v="open")
    r = leak_rule(enabled=False)
    w.engine.load_plans([plan([*LEAKS, VALVE], [r])])
    w.set("valve.v", "closed")
    w.set("valve.v", "open")
    assert w.calls == []
    w.engine.load_plans([plan(LEAKS, [leak_rule()])])
    t = trace(w)
    assert t["status"] == "error" and t["reason"] == "target missing"
    assert t["leak"]["valves"][0] == {"id": "v", "name": "v", "state": None}


def test_old_template_condition_rule_still_runs():
    w = World(binary_sensor__s1="off", binary_sensor__s2="off", valve__v="open")
    old = rule("r", ["s1", "s2"], on_true=(("v", "close"),))
    w.engine.load_plans([plan([*LEAKS, VALVE], [old])])
    w.set("binary_sensor.s1", "on")
    assert w.calls == [CLOSE]
    assert "leak" not in trace(w)
    w.set("valve.v", "open")
    assert w.calls == [CLOSE]  # a plain condition rule does not re-close


def test_attribute_event_while_open_sends_nothing_new():
    w = world()
    w.set("binary_sensor.s1", "on")
    w.set("valve.v", "open", {"x": 1})
    assert w.calls == [CLOSE]


def test_opening_then_open_closes_once():
    w = world(valve__v="closed")
    w.set("binary_sensor.s1", "on")
    w.set("valve.v", "opening")
    w.set("valve.v", "open")
    assert w.calls == [CLOSE] * 3  # the leak close, then a close at opening and again at open


def test_closed_then_open_again_closes_again():
    w = world()
    w.set("binary_sensor.s1", "on")
    w.set("valve.v", "closed")
    w.set("valve.v", "open")
    w.set("valve.v", "closed")
    w.set("valve.v", "open")
    assert w.calls == [CLOSE] * 3


def test_last_keeps_a_waiting_error_over_a_reclose():
    v2 = dev("v2", "valve", "Valve 2", state="valve.v2")
    devs = [*LEAKS, VALVE, v2]
    w = World(binary_sensor__s1="off", binary_sensor__s2="off", valve__v="closed", valve__v2="unavailable")
    w.engine.load_plans([plan(devs, [leak_rule(valves=("v", "v2"))])])
    w.set("binary_sensor.s1", "on")
    w.set("valve.v", "open")
    t = trace(w)
    assert t["last"]["target"] == "Valve 2" and t["last"]["error"] == "waiting for target"
