"""Tests for the Outside light rule in the pure rule engine (spec outside light §4)."""

import copy
from datetime import datetime, timezone

import pytest

from outside import Outside
from rules import RuleEngine
from test_daylight import sensor
from test_rules import World, dev, lux, plan, rule

EXT = dev("ext", "wall_light", "External", control="switch.ext")
LS = sensor("ls", "LightSensor")
MOTION = dev("m", "motion_sensor", "Motion", motion="binary_sensor.m")
ON, OFF = ("switch", "turn_on", "switch.ext"), ("switch", "turn_off", "switch.ext")
BELOW, ABOVE = ("below_horizon", {}), ("above_horizon", {})
MIN = 60
DAY, NIGHT = lux(100), lux(5)


def at(h, m=0, s=0):
    """Epoch of 2026-11-17 h:m:s UTC (the fake zone is UTC)."""
    return datetime(2026, 11, 17, h, m, s, tzinfo=timezone.utc).timestamp()


def outside_rule(rid="o", light="ext", sensor_id="ls", pause=30, no_data_night=True, after_sunset=True, window=None,
                 name="Outside light", **extra):
    o = {"light": light, "sensor": sensor_id, "pause": pause}
    if no_data_night:
        o["noDataNight"] = True
    if after_sunset:
        o["afterSunset"] = True
    if window is not None:
        o["window"] = {"from": window[0], "to": window[1]}
    return rule(rid, [], name=name, outside=o, **extra)


def pair_rule(rid="cr", name="Motion light"):
    return rule(rid, ["m"], name=name, on_true=[("ext", "on")], on_false=[("ext", "off")])


class OWorld(World):
    """World at 2026-11-17 in UTC with a pause recorder and own-context state changes."""

    def __init__(self, t=None, **states):
        base = {"sensor__lux": DAY, "sun__sun": ABOVE, "switch__ext": "off", "binary_sensor__m": "off"}
        base.update(states)
        super().__init__(tz=timezone.utc, t=t if t is not None else at(16), **base)
        self.saved = []
        self.engine = RuleEngine(self.lookup, lambda: self.t, self.call, self.schedule,
                                 local=lambda ts: datetime.fromtimestamp(ts, timezone.utc),
                                 changed_at=self.changed.get,
                                 on_pauses=lambda p: self.saved.append(copy.deepcopy(p)))

    def set(self, eid, state, attrs=None, own=False):
        if state is None:
            self.states.pop(eid, None)
        else:
            self.states[eid] = (state, attrs if attrs is not None else self.states.get(eid, (None, {}))[1])
        self.engine.handle_state(eid, own=own)

    def load(self, rules=None, devices=None, boot=False, pauses=None):
        devices = devices if devices is not None else [EXT, LS, MOTION]
        self.engine.load_plans([plan(devices, rules if rules is not None else [outside_rule()])],
                               boot=boot, pauses=pauses)

    def light(self, state, own=False):
        self.set("switch.ext", state, own=own)

    def tr(self, rid="o"):
        return self.engine.snapshot("p")[rid]

    def out(self, rid="o"):
        return self.tr(rid)["outside"]


def loaded(rules=None, t=None, **states):
    w = OWorld(t=t, **states)
    w.load(rules)
    return w


def at_night(rules=None, t=None, **states):
    """Loaded at 20:00 at night with the sun below and the on confirmed by the light (own context)."""
    w = loaded(rules, t=t if t is not None else at(20), **{"sensor__lux": NIGHT, "sun__sun": BELOW, **states})
    assert w.calls == [ON]
    w.light("on", own=True)
    w.calls.clear()
    return w


# --- want on -------------------------------------------------------------------------

def test_review_1_dusk_night_debounced_with_the_sun_below_switches_on_and_morning_day_off():
    w = loaded()
    assert w.calls == [OFF] and w.tr()["verdict"] is False  # start: the want applies both ways
    w.light("off", own=True)
    w.calls.clear()
    w.set("sun.sun", *BELOW)
    w.set("sensor.lux", *NIGHT)  # night pending: the debounce (60 s) holds it
    assert w.calls == [] and w.out()["daylight"] == "day"
    assert w.out()["until"] == int((at(16) + 60) * 1000) and w.out()["detail"] == "5 lx (night in 1:00)"
    w.advance(at(16, 1))
    assert w.calls == [ON] and w.tr()["verdict"] is True and w.tr()["holders"] == ["Outside light"]
    assert w.tr()["last"]["action"] == "on" and w.tr()["last"]["reason"].startswith("became true")
    w.light("on", own=True)
    w.calls.clear()
    w.t = at(7)
    w.set("sun.sun", *ABOVE)  # sunrise: the sun alone switches off
    assert w.calls == [OFF] and w.tr()["verdict"] is False and "holders" not in w.tr()


def test_morning_day_switches_off_without_after_sunset():
    w = at_night([outside_rule(after_sunset=False)], sun__sun=ABOVE)
    w.set("sensor.lux", *DAY)
    assert w.calls == []
    w.advance(at(20, 1))
    assert w.calls == [OFF]


def test_night_with_the_sun_above_wants_off_with_after_sunset_only():
    w = loaded(sensor__lux=NIGHT, sun__sun=ABOVE)
    assert w.calls == [OFF] and w.out()["sun"] == "above"
    w = loaded([outside_rule(after_sunset=False)], sensor__lux=NIGHT, sun__sun=ABOVE)
    assert w.calls == [ON] and w.out()["sun"] is None


@pytest.mark.parametrize("sun", ["unavailable", "unknown", None])
def test_an_unknown_sun_is_not_after_sunset(sun):
    w = OWorld(sensor__lux=NIGHT, sun__sun=sun or "x")
    if sun is None:
        w.states.pop("sun.sun")  # missing
    w.load()
    assert w.calls == [OFF] and w.out()["sun"] is None


def test_twilight_is_not_night():
    w = loaded(sensor__lux=lux(30), sun__sun=BELOW)
    assert w.calls == [OFF] and w.out()["daylight"] == "twilight"


def test_no_data_counts_as_night_with_the_flag():
    w = loaded(sensor__lux="unavailable", sun__sun=BELOW)
    assert w.calls == [ON] and w.out()["daylight"] is None and w.out()["detail"] == "no data"


def test_unknown_daylight_without_the_flag_keeps_the_want_and_sends_nothing():
    w = loaded([outside_rule(no_data_night=False)], sensor__lux="unavailable", sun__sun=BELOW)
    assert w.calls == [] and w.tr()["status"] == "waiting" and w.tr()["verdict"] is None
    w.set("sensor.lux", *NIGHT)  # the first known state is accepted at once
    assert w.calls == [ON]
    w.light("on", own=True)
    w.set("sensor.lux", "unavailable")
    w.advance(at(18))
    assert w.calls == [ON] and w.tr()["verdict"] is True and w.tr()["status"] == "waiting"


def test_unknown_daylight_without_the_flag_with_another_part_false_is_false():
    """Ruling: three-valued AND: a known false sun or window decides although the daylight is unknown."""
    w = loaded([outside_rule(no_data_night=False)], sensor__lux=NIGHT, sun__sun=BELOW)
    w.light("on", own=True)
    w.set("sensor.lux", "unavailable")
    w.calls.clear()
    w.set("sun.sun", *ABOVE)
    assert w.calls == [OFF] and w.tr()["verdict"] is False


def test_the_window_bounds_the_night_with_boundary_timers():
    w = loaded([outside_rule(window=("17:00", "23:00"))], sensor__lux=NIGHT, sun__sun=BELOW)
    assert w.calls == [OFF] and w.out()["window"] is False and w.out()["windowUntil"] == at(17) * 1000
    w.light("off", own=True)
    w.advance(at(17))
    assert w.calls == [OFF, ON] and w.out()["window"] is True and w.out()["windowUntil"] == at(23) * 1000
    w.light("on", own=True)
    w.advance(at(23))
    assert w.calls == [OFF, ON, OFF] and w.out()["window"] is False


def test_a_window_across_midnight():
    w = loaded([outside_rule(window=("22:00", "06:00"))], t=at(23), sensor__lux=NIGHT, sun__sun=BELOW)
    assert w.calls == [ON] and w.out()["window"] is True
    w.light("on", own=True)
    w.advance(at(23) + 7 * 3600)  # 06:00 the next day
    assert w.calls == [ON, OFF]


def test_no_window_traces_none():
    w = loaded()
    assert w.out()["window"] is None and "windowUntil" not in w.out()


# --- manual pause ----------------------------------------------------------------------

def test_review_2_switched_off_at_20_is_quiet_for_30_min_then_on_again_if_still_night():
    w = at_night()
    w.light("off")  # the owner, at the wall
    t = w.tr()
    assert w.calls == [] and t["outside"]["pausedUntil"] == at(20, 30) * 1000 and "holders" not in t
    assert t["last"] == {"action": "off", "target": "External", "at": at(20) * 1000,
                         "reason": "switched elsewhere: paused 30 min", "sent": False}
    assert w.saved[-1] == {"p": {"o": at(20, 30)}}
    w.advance(at(20, 29, 59))
    assert w.calls == []
    w.advance(at(20, 30))
    t = w.tr()
    assert w.calls == [ON] and "pausedUntil" not in t["outside"] and t["holders"] == ["Outside light"]
    assert t["last"]["action"] == "on" and t["last"]["reason"].startswith("pause ended")
    assert w.saved[-1] == {}


def test_the_pause_end_applies_off_when_it_became_day():
    w = at_night()
    w.light("off")
    w.set("sun.sun", *ABOVE)  # the want turns off during the pause: nothing is sent
    assert w.calls == [] and w.tr()["verdict"] is False
    w.light("on")  # a second manual switch restarts the pause
    assert w.out()["pausedUntil"] == at(20, 30) * 1000
    w.t = at(20, 10)
    w.light("off")
    w.light("on")
    assert w.out()["pausedUntil"] == at(20, 40) * 1000 and w.calls == []
    w.advance(at(20, 39))
    assert w.calls == []
    w.advance(at(20, 40))
    assert w.calls == [OFF] and w.tr()["last"]["reason"].startswith("pause ended")


def test_switched_on_by_day_is_quiet_then_off_again():
    w = loaded()
    w.light("off", own=True)
    w.calls.clear()
    w.light("on")
    assert w.calls == [] and w.out()["pausedUntil"] == at(16, 30) * 1000
    w.advance(at(16, 30))
    assert w.calls == [OFF]


def test_pause_zero_never_pauses_and_sends_nothing_on_a_manual_switch():
    w = at_night([outside_rule(pause=0)])
    w.light("off")
    assert w.calls == [] and "pausedUntil" not in w.out() and w.tr()["holders"] == ["Outside light"]
    assert w.saved == [] or w.saved[-1] == {}


def test_a_change_with_a_plan_studio_context_is_not_manual():
    w = at_night()
    w.light("off", own=True)
    assert "pausedUntil" not in w.out() and w.calls == []


def test_a_late_confirmation_of_the_slots_command_with_a_foreign_context_is_not_manual():
    w = loaded(sun__sun=BELOW)
    w.light("off", own=True)
    w.calls.clear()
    w.set("sensor.lux", *NIGHT)
    w.advance(at(16, 1))
    assert w.calls == [ON]
    w.light("on")  # the device reports the on later, without our context
    assert "pausedUntil" not in w.out()
    w.light("off")  # now a person
    assert w.out()["pausedUntil"] == at(16, 31) * 1000


def test_a_manual_on_after_a_manual_off_restarts_the_pause():
    """The slots' on was confirmed long ago: the person's on is a switch, not a confirmation."""
    w = at_night()
    w.light("off")
    w.t = at(20, 5)
    w.light("on")
    assert w.out()["pausedUntil"] == at(20, 35) * 1000


def test_review_3_blackout_return_in_another_state_is_no_switch_and_the_want_applies():
    w = at_night()
    w.light("unavailable")
    assert w.calls == [] and "pausedUntil" not in w.out() and w.out()["light"] is None
    w.light("off")  # back after the outage, in another state
    t = w.tr()
    assert "pausedUntil" not in t["outside"] and w.calls == [ON]
    assert t["last"]["action"] == "on" and t["last"]["reason"].startswith("light back")
    w.light("on", own=True)
    w.light("unavailable")
    w.light("on")  # back in the wanted state: nothing to do
    assert w.calls == [ON] and "pausedUntil" not in w.out()


def test_a_return_from_no_data_during_the_pause_sends_nothing():
    w = at_night()
    w.light("off")
    w.light("unknown")
    w.light("on")
    assert w.calls == [] and w.out()["pausedUntil"] == at(20, 30) * 1000


def test_the_light_trace():
    w = at_night()
    assert w.out()["light"] == "on"
    w.light("off", own=True)
    assert w.out()["light"] == "off"


# --- restart, Save -------------------------------------------------------------------

def test_review_4_restart_during_a_pause_continues_it():
    w = OWorld(t=at(20, 10), sensor__lux=NIGHT, sun__sun=BELOW)
    w.load(boot=True, pauses={"p": {"o": at(20, 30)}})
    t = w.tr()
    assert w.calls == [] and t["verdict"] is True and t["outside"]["pausedUntil"] == at(20, 30) * 1000
    assert not w.pending() and w.saved == []  # restored as stored: nothing to save, armed after the start
    w.engine.started()
    assert w.calls == [] and [p[0] for p in w.pending()] == [at(20, 30)]
    w.advance(at(20, 30))
    assert w.calls == [ON] and w.saved[-1] == {}


def test_a_pause_that_ended_while_ha_was_down_applies_the_want_after_the_start():
    w = OWorld(t=at(21), sensor__lux=NIGHT, sun__sun=BELOW)
    w.load(boot=True, pauses={"p": {"o": at(20, 30)}})
    assert w.calls == []
    w.engine.started()
    assert w.calls == [ON] and w.tr()["last"]["reason"].startswith("pause ended") and w.saved[-1] == {}


def test_review_4_restart_at_night_with_the_light_off_switches_on_at_start():
    w = OWorld(t=at(22), sensor__lux=NIGHT, sun__sun=BELOW)
    w.load(boot=True, pauses={})
    assert w.calls == [ON] and w.tr()["last"]["reason"].startswith("start")


def test_an_entry_reload_restores_a_running_pause_at_once():
    w = OWorld(t=at(20, 10), sensor__lux=NIGHT, sun__sun=BELOW)
    w.load(boot=False, pauses={"p": {"o": at(20, 30)}})
    assert w.calls == [] and [p[0] for p in w.pending()] == [at(20, 30)]


def test_a_stored_pause_of_a_disabled_or_unknown_rule_is_dropped():
    w = OWorld(t=at(20, 10), sensor__lux=NIGHT, sun__sun=BELOW)
    w.load([outside_rule(enabled=False)], boot=True, pauses={"p": {"o": at(20, 30), "gone": at(20, 30)}})
    assert w.engine.pauses() == {} and w.saved[-1] == {}


def test_an_unchanged_save_keeps_the_pause_and_its_timer():
    w = at_night()
    w.light("off")
    w.load([outside_rule(name="Renamed")])
    assert w.calls == [] and w.out()["pausedUntil"] == at(20, 30) * 1000
    assert len(w.pending()) == 1
    w.advance(at(20, 30))
    assert w.calls == [ON]


def test_a_changed_save_ends_the_pause_and_applies_the_want_both_ways():
    w = at_night()
    w.light("off")
    w.load([outside_rule(pause=45)])
    assert w.calls == [ON] and "pausedUntil" not in w.out() and w.saved[-1] == {}
    assert not w.pending()


def test_a_changed_save_by_day_switches_off():
    w = loaded()
    w.light("off", own=True)
    w.calls.clear()
    w.light("on")
    w.load([outside_rule(after_sunset=False)])
    assert w.calls == [OFF]


def test_deleting_the_rule_cancels_the_pause():
    w = at_night()
    w.light("off")
    w.load([])
    assert not w.pending() and w.saved[-1] == {} and w.calls == []


def test_a_disabled_rule_ignores_manual_switches():
    w = loaded([outside_rule(enabled=False)], sensor__lux=NIGHT, sun__sun=BELOW)
    w.light("on")
    t = w.tr()
    assert w.calls == [] and t["status"] == "disabled" and "pausedUntil" not in t["outside"] and not w.pending()


# --- shared light ----------------------------------------------------------------------

def test_review_5_a_motion_pair_on_the_same_light_is_arbitrated_by_the_slots():
    w = at_night([outside_rule(), pair_rule()])
    w.set("binary_sensor.m", "on")
    assert w.calls == [] and w.tr("cr")["last"]["reason"] == "already on by Outside light"
    w.set("binary_sensor.m", "off")
    assert w.calls == [] and w.tr("cr")["last"]["reason"] == "kept on by Outside light"
    w.set("binary_sensor.m", "on")
    w.t = at(7)
    w.set("sun.sun", *ABOVE)  # morning while the motion holds: the off is kept back
    assert w.calls == [] and w.tr()["last"]["reason"] == "kept on by Motion light"
    w.set("binary_sensor.m", "off")
    assert w.calls == [OFF]


def test_a_pause_leaves_the_light_to_the_other_holder():
    w = at_night([outside_rule(), pair_rule()])
    w.set("binary_sensor.m", "on")
    w.light("off")  # the person: the outside rule pauses; the motion rule still holds
    assert w.out()["pausedUntil"] == at(20, 30) * 1000 and w.tr()["holders"] == ["Motion light"]
    w.set("binary_sensor.m", "off")
    assert w.calls == [OFF]  # the motion rule's own off: nobody else holds
    w.advance(at(20, 30))
    assert w.calls == [OFF, ON]


def test_a_paused_rule_owes_no_off():
    """By day the outside rule's off was kept back by the motion rule; a manual switch drops that owed off, so
    deleting the motion rule leaves the person's light on."""
    w = at_night([outside_rule(), pair_rule()])
    w.set("binary_sensor.m", "on")
    w.set("sun.sun", *ABOVE)
    assert w.calls == [] and w.tr()["last"]["reason"] == "kept on by Motion light"
    w.light("off")
    w.light("on")  # manual: the outside rule pauses
    w.load([outside_rule()])
    assert w.calls == [] and w.out()["pausedUntil"] == at(20, 30) * 1000


# --- static problems, trace --------------------------------------------------------------

def test_a_missing_sensor_or_light_is_device_missing():
    w = loaded([outside_rule(sensor_id="nope")])
    assert w.tr()["status"] == "error" and w.tr()["reason"] == "device missing"
    w = loaded([outside_rule(sensor_id="m")])  # not an illuminance sensor
    assert w.tr()["reason"] == "device missing"
    w = loaded([outside_rule(light="nope")])
    assert w.tr()["reason"] == "device missing" and w.calls == []


def test_a_light_that_cannot_switch_is_target_missing():
    w = loaded([outside_rule(light="m")])
    assert w.tr()["reason"] == "target missing"


def test_the_light_and_the_sun_are_tracked():
    w = loaded()
    assert {"switch.ext", "sensor.lux", "sun.sun"} <= w.engine.entity_ids()
    w = loaded([outside_rule(after_sunset=False)])
    assert "sun.sun" not in w.engine.entity_ids()


def test_the_trace_example():
    w = loaded([outside_rule(window=("17:00", "23:00"))], t=at(18), sensor__lux=lux(30), sun__sun=BELOW)
    w.light("off", own=True)
    w.set("sensor.lux", *NIGHT)
    w.light("on")
    t = w.tr()
    assert t["outside"] == {
        "daylight": "twilight", "detail": "5 lx (night in 1:00)", "until": int((at(18) + 60) * 1000),
        "sun": "below", "window": True, "windowUntil": at(23) * 1000, "pausedUntil": at(18, 30) * 1000,
        "light": "on",
    }
    assert t["status"] == "ok" and t["verdict"] is False


# --- the pure part -----------------------------------------------------------------------

@pytest.mark.parametrize("values,flag,expected", [
    ([True], False, True), ([False], False, False), ([None], False, None), ([None], True, True),
    ([True, True, True], False, True), ([True, None], False, False), ([None, False], False, False),
    ([None, True], False, None), ([True, True, False], False, False),
])
def test_want(values, flag, expected):
    o = Outside({"light": "l", "sensor": "s", "pause": 30, **({"noDataNight": True} if flag else {})}, {}, None)
    assert o.want(values) is expected


def test_light_changed():
    o = Outside({"light": "l", "sensor": "s", "pause": 10}, {}, "switch.l")
    o.seen = "on"
    assert o.light_changed("off", True, True, 0) is None and o.until is None  # ours
    assert o.light_changed(None, False, True, 0) is None  # no data
    assert o.light_changed("on", False, True, 0) == "back"
    assert o.light_changed("off", False, False, 0) is None  # inactive
    assert o.light_changed("on", False, True, 100) == "manual" and o.until == 700
    assert o.light_changed("on", False, True, 200) is None  # attributes only


def test_defaults_of_a_malformed_config():
    o = Outside({"pause": -1, "window": "x"}, {}, None)
    assert o.pause == 30 and o.window is None and o.missing and o.inputs() == [
        {"source": {"daylight": "", "is": "night"}}]
