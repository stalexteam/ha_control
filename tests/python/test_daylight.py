"""Daylight of an illuminance sensor: thresholds, raw state and the debounced state in the rule engine."""

import pytest

from daylight import countdown, props, raw_state
from test_rules import EXT, EXT_BOTH, OFF, ON, World, dark_in, dev, lux, plan, rule, trace

DEFAULTS = {"nightBelow": 10, "dayAbove": 50, "sunNight": -6, "sunDay": 3, "debounce": 60}


def sensor(did="ls", name="Light", illuminance="sensor.lux", sun=None, **p):
    bindings = {"illuminance": illuminance, "sun": sun}
    d = dev(did, "illuminance_sensor", name, **{k: v for k, v in bindings.items() if v})
    d["props"].update(p)
    return d


def sun(elevation, state="below_horizon"):
    return (state, {"elevation": elevation})


def day_in(did="ls", is_="night"):
    return {"source": {"daylight": did, "is": is_}}


def states(w):
    return [t["value"] for t in trace(w)["inputs"]]


# --- props: mirror of the panel's daylightProps --------------------------------

@pytest.mark.parametrize("given,expected", [
    ({}, DEFAULTS),
    ({"nightBelow": 5, "dayAbove": 80}, {**DEFAULTS, "nightBelow": 5, "dayAbove": 80}),
    ({"nightBelow": 20}, {**DEFAULTS, "nightBelow": 20}),
    ({"nightBelow": 60}, DEFAULTS),  # 60 < default 50 fails: the pair falls back
    ({"nightBelow": -1, "dayAbove": 80}, DEFAULTS),  # below 0
    ({"nightBelow": 30, "dayAbove": 30}, DEFAULTS),
    ({"nightBelow": "5", "dayAbove": 80}, DEFAULTS),
    ({"nightBelow": None}, DEFAULTS),
    ({"nightBelow": True}, DEFAULTS),
    ({"nightBelow": 0, "dayAbove": 0.5}, {**DEFAULTS, "nightBelow": 0, "dayAbove": 0.5}),
    ({"sunNight": -10, "sunDay": 5}, {**DEFAULTS, "sunNight": -10, "sunDay": 5}),
    ({"sunNight": 4}, DEFAULTS),
    ({"sunNight": -10, "sunDay": "x", "nightBelow": 1}, {**DEFAULTS, "nightBelow": 1}),  # only the bad pair falls back
    ({"debounce": 0}, {**DEFAULTS, "debounce": 0}),
    ({"debounce": 3600}, {**DEFAULTS, "debounce": 3600}),
    ({"debounce": 120.0}, {**DEFAULTS, "debounce": 120}),
    ({"debounce": 3601}, DEFAULTS),
    ({"debounce": -1}, DEFAULTS),
    ({"debounce": 1.5}, DEFAULTS),
    ({"debounce": True}, DEFAULTS),
    ({"debounce": None}, DEFAULTS),
])
def test_props_mirror_the_panel(given, expected):
    assert props(sensor(**given)) == expected


def test_props_of_another_kind_are_the_defaults():
    d = dev("m", "motion_sensor")
    d["props"]["nightBelow"] = 1
    assert props(d) == DEFAULTS


# --- raw state ------------------------------------------------------------------

def look(**st):
    table = {k.replace("__", "."): v for k, v in st.items()}
    return table.get


@pytest.mark.parametrize("v,expected", [
    (9.9, ("night", "9.9 lx")), (10, ("twilight", "10 lx")), (50, ("twilight", "50 lx")), (51, ("day", "51 lx")),
    (0, ("night", "0 lx")),
])
def test_raw_state_from_lux(v, expected):
    assert raw_state(sensor(), look(sensor__lux=lux(v))) == expected


def test_raw_state_uses_the_sensor_thresholds():
    assert raw_state(sensor(nightBelow=2, dayAbove=5), look(sensor__lux=lux(3))) == ("twilight", "3 lx")
    assert raw_state(sensor(nightBelow=2, dayAbove=5), look(sensor__lux=lux(6))) == ("day", "6 lx")


@pytest.mark.parametrize("st", [
    lux(5, "lm"), ("5", {}), lux("dark"), lux("nan"), lux("inf"), ("unavailable", {}), ("unknown", {}), None,
])
def test_unusable_lux_without_sun_is_no_data(st):
    lookup = look(**({} if st is None else {"sensor__lux": st}))
    assert raw_state(sensor(), lookup) == (None, "no data")


@pytest.mark.parametrize("st", [lux(5, "lm"), lux("dark"), ("unavailable", {}), ("unknown", {}), None])
def test_unusable_lux_falls_back_to_the_sun(st):
    lookup = look(sun__sun=sun(-3.21), **({} if st is None else {"sensor__lux": st}))
    assert raw_state(sensor(sun="sun.sun"), lookup) == ("twilight", "sun -3.2°")


@pytest.mark.parametrize("e,expected", [
    (-6.5, ("night", "sun -6.5°")), (-6, ("twilight", "sun -6°")), (3, ("twilight", "sun 3°")),
    (3.04, ("day", "sun 3°")), (45, ("day", "sun 45°")), (-0.04, ("twilight", "sun 0°")),
])
def test_raw_state_from_the_sun_elevation(e, expected):
    assert raw_state(sensor(illuminance=None, sun="sun.sun"), look(sun__sun=sun(e))) == expected


def test_sun_thresholds_come_from_the_sensor():
    d = sensor(illuminance=None, sun="sun.sun", sunNight=-12, sunDay=-1)
    assert raw_state(d, look(sun__sun=sun(-8)))[0] == "twilight"
    assert raw_state(d, look(sun__sun=sun(0)))[0] == "day"


@pytest.mark.parametrize("st", [
    ("below_horizon", {}), ("below_horizon", {"elevation": "-3"}), ("below_horizon", {"elevation": True}),
    ("unavailable", {"elevation": -3}), ("unknown", {"elevation": -3}), None,
])
def test_unusable_sun_is_no_data(st):
    lookup = look(**({} if st is None else {"sun__sun": st}))
    assert raw_state(sensor(illuminance=None, sun="sun.sun"), lookup) == (None, "no data")


def test_lux_wins_over_the_sun():
    assert raw_state(sensor(sun="sun.sun"), look(sensor__lux=lux(80), sun__sun=sun(-20))) == ("day", "80 lx")


def test_nothing_bound_is_no_data():
    assert raw_state(sensor(illuminance=None), look(sensor__lux=lux(5))) == (None, "no data")


@pytest.mark.parametrize("s,expected", [(42, "0:42"), (41.2, "0:42"), (60, "1:00"), (3600, "60:00"), (-1, "0:00")])
def test_countdown(s, expected):
    assert countdown(s) == expected


# --- the engine: input values and details ----------------------------------------

@pytest.mark.parametrize("v,night,dark,day", [(5, True, True, False), (30, False, True, False), (80, False, False, True)])
def test_input_values(v, night, dark, day):
    w = World(sensor__lux=lux(v))
    r = rule("r", [day_in(is_="night"), day_in(is_="dark"), day_in(is_="day")])
    w.engine.load_plans([plan([sensor()], [r])])
    assert states(w) == [night, dark, day]


def test_input_trace_details():
    w = World(sensor__lux=lux(8))
    w.engine.load_plans([plan([sensor()], [rule("r", [day_in()])])])
    assert trace(w)["inputs"] == [{"label": "Light", "value": True, "detail": "night, 8 lx"}]
    w.set("sensor.lux", "unavailable")
    assert trace(w)["inputs"] == [{"label": "Light", "value": None, "detail": "no data"}]
    assert trace(w)["verdict"] is True  # the verdict keeps its last known value; the raw verdict is unknown
    assert trace(w)["status"] == "waiting"


def test_missing_and_wrong_kind_devices():
    w = World(sensor__lux=lux(5), binary_sensor__m="on")
    devs = [sensor(), dev("m", "motion_sensor", "Hall", motion="binary_sensor.m")]
    w.engine.load_plans([plan(devs, [rule("r", [day_in("m")]), rule("q", [day_in("gone")])])])
    assert trace(w)["inputs"] == [{"label": "Hall", "value": None, "detail": "missing"}]
    assert trace(w, "q")["status"] == "error" and trace(w, "q")["reason"] == "device missing"
    assert "binary_sensor.m" not in w.engine.entity_ids()


def test_the_sun_is_tracked_only_when_bound():
    w = World(sensor__lux=lux(5), sun__sun=sun(-10))
    w.engine.load_plans([plan([sensor()], [rule("r", [day_in()])])])
    assert w.engine.entity_ids() == {"sensor.lux"}
    w.engine.load_plans([plan([sensor(sun="sun.sun")], [rule("r", [day_in()])])])
    assert w.engine.entity_ids() == {"sensor.lux", "sun.sun"}


def test_a_rule_acts_on_the_debounced_state():
    w = World(sensor__lux=lux(80), switch__ext="off")
    w.engine.load_plans([plan([sensor(), EXT], [rule("r", [day_in()], **EXT_BOTH)])])
    assert w.calls == [OFF]
    w.set("sensor.lux", "5")
    assert w.calls == [OFF]
    w.advance(w.t + 60)
    assert w.calls == [OFF, ON]


# --- debounce -----------------------------------------------------------------------

def test_first_raw_state_is_accepted_at_once():
    w = World(sensor__lux=lux(5))
    w.engine.load_plans([plan([sensor()], [rule("r", [day_in()])])])
    assert trace(w)["verdict"] is True
    assert w.pending() == []


def test_dusk_flicker_stays_twilight_then_night_after_holding():
    """Review focus 1: 12 -> 9 -> 11 within 60 s stays twilight; 9 held 60 s -> night."""
    w = World(sensor__lux=lux(12))
    w.engine.load_plans([plan([sensor()], [rule("r", [day_in()])])])
    t0 = w.t
    assert trace(w)["inputs"][0]["detail"] == "twilight, 12 lx"
    w.set("sensor.lux", "9")
    i = trace(w)["inputs"][0]
    assert i == {"label": "Light", "value": False, "detail": "twilight, 9 lx (night in 1:00)", "until": int((t0 + 60) * 1000)}
    w.advance(t0 + 20)
    w.set("sensor.lux", "11")  # back to twilight: the change is cancelled
    assert trace(w)["inputs"][0] == {"label": "Light", "value": False, "detail": "twilight, 11 lx"}
    assert w.pending() == []
    w.advance(t0 + 30)
    w.set("sensor.lux", "9")
    w.advance(t0 + 89)
    assert trace(w)["verdict"] is False
    w.advance(t0 + 90)
    assert trace(w)["verdict"] is True
    assert trace(w)["inputs"][0] == {"label": "Light", "value": True, "detail": "night, 9 lx"}


def test_a_new_reading_of_the_pending_state_keeps_the_timer():
    w = World(sensor__lux=lux(30))
    w.engine.load_plans([plan([sensor()], [rule("r", [day_in("ls", "day")])])])
    t0 = w.t
    w.set("sensor.lux", "60")
    w.advance(t0 + 18)
    w.set("sensor.lux", "70")
    assert trace(w)["inputs"][0]["detail"] == "twilight, 70 lx (day in 0:42)"
    assert len(w.pending()) == 1
    w.advance(t0 + 60)
    assert trace(w)["verdict"] is True


def test_a_third_state_restarts_the_hold():
    w = World(sensor__lux=lux(30))
    w.engine.load_plans([plan([sensor()], [rule("r", [day_in("ls", "dark")])])])
    t0 = w.t
    w.set("sensor.lux", "60")  # day pending
    w.advance(t0 + 30)
    w.set("sensor.lux", "5")  # night pending from now
    w.advance(t0 + 89)
    assert trace(w)["inputs"][0]["detail"].startswith("twilight, 5 lx (night in")
    w.advance(t0 + 90)
    assert trace(w)["inputs"][0]["detail"] == "night, 5 lx"


def test_no_data_is_accepted_at_once_and_cancels_a_pending_change():
    w = World(sensor__lux=lux(30))
    w.engine.load_plans([plan([sensor()], [rule("r", [day_in("ls", "dark")])])])
    w.set("sensor.lux", "60")
    assert len(w.pending()) == 1
    w.set("sensor.lux", "unavailable")
    assert trace(w)["inputs"][0] == {"label": "Light", "value": None, "detail": "no data"}
    assert w.pending() == []


def test_a_state_after_no_data_is_accepted_at_once():
    w = World(sensor__lux=("unavailable", {}))
    w.engine.load_plans([plan([sensor()], [rule("r", [day_in()])])])
    assert trace(w)["inputs"][0]["value"] is None
    w.set("sensor.lux", "5", {"unit_of_measurement": "lx"})
    assert trace(w)["inputs"][0] == {"label": "Light", "value": True, "detail": "night, 5 lx"}
    assert w.pending() == []


def test_debounce_zero_accepts_every_change_at_once():
    w = World(sensor__lux=lux(30))
    w.engine.load_plans([plan([sensor(debounce=0)], [rule("r", [day_in()])])])
    w.set("sensor.lux", "5")
    assert trace(w)["verdict"] is True
    assert w.pending() == []


def test_debounce_comes_from_the_sensor():
    w = World(sensor__lux=lux(30))
    w.engine.load_plans([plan([sensor(debounce=5)], [rule("r", [day_in()])])])
    t0 = w.t
    w.set("sensor.lux", "5")
    w.advance(t0 + 5)
    assert trace(w)["verdict"] is True


# --- review focus 2 and 3: the sun -------------------------------------------------

def test_lux_unavailable_falls_back_to_the_sun_and_lux_decides_again():
    w = World(sensor__lux=lux(30), sun__sun=sun(-10))
    w.engine.load_plans([plan([sensor(sun="sun.sun")], [rule("r", [day_in("ls", "dark"), day_in("ls", "day")])])])
    t0 = w.t
    assert trace(w)["inputs"][0]["detail"] == "twilight, 30 lx"
    w.set("sensor.lux", "unavailable")  # the sun says night: debounced like any other change
    assert trace(w)["inputs"][0]["detail"] == "twilight, sun -10° (night in 1:00)"
    w.advance(t0 + 60)
    assert trace(w)["inputs"][0]["detail"] == "night, sun -10°"
    w.set("sensor.lux", "80")  # lux back: lux decides, debounced
    assert trace(w)["inputs"][1] == {
        "label": "Light", "value": False, "detail": "night, 80 lx (day in 1:00)", "until": int((t0 + 120) * 1000),
    }
    w.advance(t0 + 120)
    assert states(w) == [False, True]


def test_sun_elevation_changes_are_tracked():
    w = World(sun__sun=sun(1))
    w.engine.load_plans([plan([sensor(illuminance=None, sun="sun.sun")], [rule("r", [day_in("ls", "day")])])])
    assert trace(w)["inputs"][0]["detail"] == "twilight, sun 1°"
    t0 = w.t
    w.set("sun.sun", "above_horizon", {"elevation": 4.2})
    w.advance(t0 + 60)
    assert trace(w)["inputs"][0] == {"label": "Light", "value": True, "detail": "day, sun 4.2°"}


def test_only_the_sun_bound_works():
    w = World(sun__sun=sun(-8))
    w.engine.load_plans([plan([sensor(illuminance=None, sun="sun.sun")], [rule("r", [day_in()])])])
    assert trace(w)["inputs"][0] == {"label": "Light", "value": True, "detail": "night, sun -8°"}


def test_nothing_usable_is_unknown():
    w = World(sensor__lux=lux(5, "lm"), sun__sun=("unavailable", {}))
    w.engine.load_plans([plan([sensor(sun="sun.sun"), sensor("n", illuminance=None)],
                              [rule("r", [day_in()]), rule("q", [day_in("n")])])])
    for rid in ("r", "q"):
        assert trace(w, rid)["inputs"][0]["value"] is None and trace(w, rid)["inputs"][0]["detail"] == "no data"
        assert trace(w, rid)["status"] == "waiting"


# --- review focus 4: one debounce per sensor ---------------------------------------

def test_rules_on_one_sensor_share_one_debounce():
    w = World(sensor__lux=lux(30))
    rules = [rule("a", [day_in()]), rule("b", [day_in("ls", "dark")], combine="all"),
             rule("c", [{"source": {"held": {"sources": [{"daylight": "ls", "is": "night"}], "state": "on",
                                             "seconds": 1}}}])]
    w.engine.load_plans([plan([sensor()], rules)])
    t0 = w.t
    w.set("sensor.lux", "5")
    assert len(w.pending()) == 1  # one timer for the sensor, not one per rule
    w.advance(t0 + 30)
    w.engine.load_plans([plan([sensor()], rules + [rule("d", [day_in()])])])  # a rule added later shares it
    assert trace(w, "d")["inputs"][0]["until"] == int((t0 + 60) * 1000)
    seen = []
    w.engine.subscribe("p", lambda full, frame: seen.append(frame))
    w.advance(t0 + 60)
    assert {rid for frame in seen for rid in frame} >= {"a", "d"}
    assert len(seen) == 1  # every rule changed in the same frame
    assert [trace(w, rid)["verdict"] for rid in "abd"] == [True, True, True]


# --- reload and stop -------------------------------------------------------------------

def test_an_unchanged_sensor_keeps_its_state_and_timer_across_a_save():
    w = World(sensor__lux=lux(30))
    w.engine.load_plans([plan([sensor()], [rule("r", [day_in()])])])
    t0 = w.t
    w.set("sensor.lux", "5")
    w.advance(t0 + 40)
    w.engine.load_plans([plan([sensor(name="Renamed")], [rule("r", [day_in()], name="Other")])])
    assert trace(w)["inputs"][0]["detail"] == "twilight, 5 lx (night in 0:20)"
    assert len(w.pending()) == 1
    w.advance(t0 + 60)
    assert trace(w)["verdict"] is True


def test_explicit_default_thresholds_are_an_unchanged_sensor():
    w = World(sensor__lux=lux(30))
    w.engine.load_plans([plan([sensor()], [rule("r", [day_in()])])])
    w.set("sensor.lux", "5")
    w.engine.load_plans([plan([sensor(nightBelow=10, debounce=60)], [rule("r", [day_in()])])])
    assert len(w.pending()) == 1


def test_a_changed_sensor_restarts_with_its_raw_state():
    w = World(sensor__lux=lux(30))
    w.engine.load_plans([plan([sensor()], [rule("r", [day_in()])])])
    w.set("sensor.lux", "5")
    timer = w.pending()[0]
    w.engine.load_plans([plan([sensor(nightBelow=4)], [rule("r", [day_in()])])])
    assert not timer[3]  # cancelled
    assert trace(w)["inputs"][0]["detail"] == "twilight, 5 lx"  # new thresholds: accepted at once
    w.engine.load_plans([plan([sensor(nightBelow=6)], [rule("r", [day_in()])])])
    assert trace(w)["inputs"][0]["detail"] == "night, 5 lx"
    assert w.pending() == []


def test_a_removed_sensor_cancels_its_timer():
    w = World(sensor__lux=lux(30))
    w.engine.load_plans([plan([sensor()], [rule("r", [day_in()])])])
    w.set("sensor.lux", "5")
    w.engine.load_plans([plan([], [rule("r", [day_in()])])])
    assert w.pending() == []
    assert trace(w)["reason"] == "device missing"
    w.engine.load_plans([plan([sensor()], [])])  # no rule reads it: nothing is tracked
    assert w.engine.entity_ids() == set()


def test_stop_cancels_the_timer():
    w = World(sensor__lux=lux(30))
    w.engine.load_plans([plan([sensor()], [rule("r", [day_in()])])])
    w.set("sensor.lux", "5")
    w.engine.load_plans([], unload=True)
    assert w.pending() == []


def test_the_gate_reads_daylight_with_until():
    w = World(sensor__lux=lux(30), switch__ext="off", binary_sensor__m="on")
    devs = [sensor(), EXT, dev("m", "motion_sensor", "Hall", motion="binary_sensor.m")]
    w.engine.load_plans([plan(devs, [rule("r", ["m"], gate=day_in(), **EXT_BOTH)])])
    assert trace(w)["gate"] == {"value": False, "detail": "twilight, 30 lx"}
    assert w.calls == []
    w.set("sensor.lux", "5")
    assert trace(w)["gate"]["until"] == int((w.t + 60) * 1000)
    w.advance(w.t + 60)
    assert w.calls == [ON]


# --- review focus 5: the old light input ------------------------------------------------

def test_old_light_input_with_unknown_dark_is_unchanged():
    w = World(sensor__lux=("unavailable", {}), sun__sun=sun(30))
    w.engine.load_plans([plan([sensor("lx", sun="sun.sun")], [rule("r", [dark_in(), day_in("lx", "day")])])])
    assert trace(w)["inputs"] == [
        {"label": "Light", "value": True, "detail": "no data (dark)"},  # no sun fallback, no debounce
        {"label": "Light", "value": True, "detail": "day, sun 30°"},
    ]
    w.set("sensor.lux", "12", {"unit_of_measurement": "lx"})
    assert trace(w)["inputs"][0] == {"label": "Light", "value": False, "detail": "12 lx"}
    w.set("sensor.lux", "8")
    assert trace(w)["inputs"][0] == {"label": "Light", "value": True, "detail": "8 lx"}  # at once
