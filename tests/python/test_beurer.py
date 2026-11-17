"""Tests for the Beurer heater rule in the pure rule engine (spec beurer heater §4)."""

from beurer import PAUSE, Beurer
from test_rules import World, dev, plan, rule

PC = dev("pc", "equipment", "PC", power="sensor.pc")
PAD = dev("pad", "socket", "Pad", control="switch.pad")
MOTION = dev("m", "motion_sensor", "Motion", motion="binary_sensor.m")
ON, OFF = ("switch", "turn_on", "switch.pad"), ("switch", "turn_off", "switch.pad")
T0 = 10000.0
CYCLE = 30 * 60


def pw(w):
    """A power state in W (or a no data state)."""
    return (str(w), {"unit_of_measurement": "W"})


def beurer_rule(rid="b", above=200, keep=10, every=30, off=60, name="Beurer heater", heater="pad", source="pc", **extra):
    return rule(rid, [], name=name, off_delay=off,
                beurer={"heater": heater, "source": source, "above": above, "keep": keep, "every": every}, **extra)


def pair_rule(rid="cr", name="Motion pad"):
    return rule(rid, ["m"], name=name, on_true=[("pad", "on")], on_false=[("pad", "off")])


class BWorld(World):
    """World at T0 with own-context state changes."""

    def __init__(self, t=T0, **states):
        base = {"sensor__pc": pw(250), "switch__pad": "off", "binary_sensor__m": "off"}
        base.update(states)
        super().__init__(t=t, **base)

    def set(self, eid, state, attrs=None, own=False):
        if state is None:
            self.states.pop(eid, None)
        else:
            self.states[eid] = (state, attrs if attrs is not None else self.states.get(eid, (None, {}))[1])
        self.engine.handle_state(eid, own=own)

    def load(self, rules=None, boot=False, devices=None):
        devices = devices if devices is not None else [PC, PAD, MOTION]
        self.engine.load_plans([plan(devices, rules if rules is not None else [beurer_rule()])], boot=boot)

    def pad(self, state, own=False):
        self.set("switch.pad", state, own=own)

    def power(self, w):
        self.set("sensor.pc", *pw(w))

    def tr(self, rid="b"):
        return self.engine.snapshot("p")[rid]

    def bt(self, rid="b"):
        return self.tr(rid)["beurer"]


def loaded(rules=None, **states):
    w = BWorld(**states)
    w.load(rules)
    return w


def heating(rules=None, **states):
    """Loaded at T0 with 250 W and the pad off: the start's on is confirmed by the pad (own context), so it is fresh."""
    w = loaded(rules, **states)
    assert w.calls == [ON]
    w.pad("on", own=True)
    w.calls.clear()
    return w


# --- the pure part -----------------------------------------------------------------------

def pure(**kw):
    return Beurer({"heater": "pad", "source": "pc", "above": 200, "keep": 10, "every": 30, **kw}, {}, "switch.pad",
                  "sensor.pc")


def test_step_cycle_due_when_not_fresh():
    b = pure()
    assert b.step(100, True, "on") == "off" and b.pause == 100 + PAUSE == 105 and not b.fresh
    assert b.wake() == 105


def test_step_cycle_due_after_every_minutes():
    b = pure()
    b.fresh, b.since = True, 0.0
    assert b.wake() == 1800
    assert b.step(1799, True, "on") is None and b.pause is None
    assert b.step(1800, True, "on") == "off" and b.pause == 1805


def test_step_no_cycle_when_not_wanted_or_off():
    b = pure()
    assert b.step(100, False, "on") is None and b.step(100, True, "off") is None and b.step(100, True, None) is None
    assert b.pause is None and b.wake() is None


def test_step_every_zero_never_cycles():
    b = pure(every=0)
    assert b.step(100, True, "on") is None and b.pause is None
    b.fresh, b.since = True, 0.0
    assert b.step(10 ** 6, True, "on") is None and b.wake() is None


def test_step_pause_end_reads_off_gives_on():
    b = pure()
    b.pause = 105.0
    assert b.step(104, True, "off") is None and b.pause == 105
    assert b.step(105, True, "off") == "on" and b.pause is None


def test_step_pause_end_still_on_repeats_off():
    b = pure()
    b.pause = 105.0
    assert b.step(105, True, "on") == "off" and b.pause == 110


def test_step_pause_end_no_data_drops_the_cycle():
    b = pure()
    b.pause, b.fresh = 105.0, True
    assert b.step(105, True, None) is None and b.pause is None and not b.fresh


def test_step_retries_on_while_wanted_and_off():
    b = pure()
    assert b.step(100, True, "off") is None and b.retry == 105 and b.wake() == 105
    assert b.step(104, True, "off") is None and b.retry == 105
    assert b.step(105, True, "off") == "retry" and b.retry == 110 and b.wake() == 110
    b.fresh, b.since = True, 100.0
    assert b.step(106, True, "on") is None and b.retry is None  # confirmed
    b.fresh = False
    assert b.step(107, True, "off") is None and b.retry == 112
    assert b.step(108, False, "off") is None and b.retry is None and b.wake() is None  # not wanted
    assert b.step(109, True, "off") is None and b.retry == 114
    assert b.step(110, True, None) is None and b.retry is None and b.wake() is None  # no data
    b.pause = 120.0
    assert b.step(120, True, "off") == "on" and b.retry == 125  # the pause end's on is repeated 5 s later


def test_heater_changed_table():
    b = pure()
    b.seen = "off"
    assert b.heater_changed("on", True, True, 50) is False and b.fresh and b.since == 50  # off -> on ours
    b.seen = "off"
    assert b.heater_changed("on", False, True, 60) is False and not b.fresh  # off -> on not ours
    b.seen, b.fresh = None, True
    assert b.heater_changed("on", True, True, 70) is False and not b.fresh  # back from no data reading on
    b.fresh = True
    assert b.heater_changed("on", True, True, 80) is False and b.fresh and b.since == 50  # attributes only
    assert b.heater_changed("off", False, True, 90) is True and not b.fresh  # on -> off wanted
    b.seen = "on"
    assert b.heater_changed("off", False, False, 90) is False  # on -> off not wanted
    b.seen = None
    assert b.heater_changed("off", False, True, 90) is True  # back from no data reading off, wanted
    b.seen, b.fresh = "on", True
    assert b.heater_changed(None, False, True, 90) is False and not b.fresh and b.seen is None  # no data
    b.seen, b.fresh, b.pause = "on", True, 100.0
    for state in ("off", None, "on", "off"):  # during a pause: the cycle's own
        assert b.heater_changed(state, False, True, 95) is False and b.fresh and b.seen == state


def test_defaults_of_a_malformed_config():
    b = Beurer({"above": 0, "keep": 1.5, "every": -1}, {}, None, None)
    assert (b.above, b.keep, b.every) == (200.0, 10, 30) and b.missing and b.label == ""
    assert b.input() == {"source": {"power": {"device": None, "above": 200.0, "keep": 10}}}
    b = Beurer({"heater": "pad", "above": True, "keep": 1441, "every": True}, {"pad": PAD}, "switch.pad", "sensor.pc")
    assert (b.above, b.keep, b.every) == (200.0, 10, 30) and not b.missing and b.label == "Pad"


# --- power and the off delay --------------------------------------------------------------

def test_on_above_and_off_after_the_delay():
    w = heating()
    t = w.tr()
    assert t["verdict"] is True and t["holders"] == ["Beurer heater"] and t["last"]["reason"].startswith("start")
    w.power(150)
    assert w.calls == []
    w.advance(T0 + 59)
    assert w.calls == []
    w.advance(T0 + 60)
    assert w.calls == [OFF] and w.tr()["verdict"] is False


def test_exactly_the_threshold_is_not_in_use():
    w = loaded(sensor__pc=pw(200))
    assert ON not in w.calls and w.tr()["verdict"] is False


def test_kw_is_read_as_watts():
    w = loaded(sensor__pc=("0.25", {"unit_of_measurement": "kW"}))
    assert w.calls == [ON] and w.bt()["watts"] == 250


def test_back_above_within_the_delay_keeps_it_on():
    w = heating()
    w.power(150)
    w.advance(T0 + 30)
    w.power(250)
    w.advance(T0 + 120)
    assert w.calls == [] and w.tr()["verdict"] is True and "pending" not in w.tr()


def test_no_data_since_start_sends_nothing():
    w = loaded(sensor__pc="unavailable", switch__pad="on")
    t = w.tr()
    assert w.calls == [] and t["status"] == "waiting" and t["verdict"] is None
    assert t["beurer"]["detail"] == "no data" and t["beurer"]["watts"] is None and not w.pending()


def test_lost_sensor_keeps_then_turns_off():
    w = heating([beurer_rule(every=0)])
    w.advance(T0 + 1200)  # 20 min with data, no events in between
    w.power("unavailable")
    b = w.bt()
    assert w.calls == [] and b["detail"] == "no data, kept" and b["keptUntil"] == (T0 + 1200 + 600) * 1000
    assert b["watts"] is None and w.tr()["verdict"] is True
    w.advance(T0 + 1799)
    assert w.calls == []
    w.advance(T0 + 1800)  # the keep window ends: false, the off delay starts
    assert w.calls == [] and w.bt()["detail"] == "no data" and "keptUntil" not in w.bt()
    w.advance(T0 + 1859)
    assert w.calls == []
    w.advance(T0 + 1860)
    assert w.calls == [OFF]


def test_sensor_back_within_keep_keeps_it_on():
    w = heating()
    w.power("unavailable")
    w.advance(T0 + 300)
    w.power(250)
    w.advance(T0 + 1000)
    assert w.calls == [] and w.bt()["detail"] == "250 W" and "keptUntil" not in w.bt()
    assert [p[0] for p in w.pending()] == [T0 + CYCLE]  # the keep timer is gone, the cycle stays


# --- switched off elsewhere -----------------------------------------------------------------

def test_switched_off_elsewhere_goes_on_again():
    w = heating()
    w.pad("off")
    last = w.tr()["last"]
    assert w.calls == [ON] and last["action"] == "on" and last["reason"].startswith("switched off elsewhere")
    w.pad("on", own=True)
    assert w.calls == [ON] and w.bt()["fresh"] is True


def test_switched_off_while_not_wanted_stays_off():
    w = heating([beurer_rule(off=0)])
    w.power(150)
    assert w.calls == [OFF]
    w.pad("off")
    w.pad("on")  # someone else, while the PC is idle: not ours, nothing sent
    w.pad("off")
    assert w.calls == [OFF]


# --- power-cycle ------------------------------------------------------------------------------

def test_cycle_every_30_minutes():
    w = heating()
    assert w.bt()["cycleAt"] == (T0 + CYCLE) * 1000
    w.advance(T0 + CYCLE - 1)
    assert w.calls == []
    w.advance(T0 + CYCLE)
    assert w.calls == [OFF] and w.tr()["last"]["reason"] == "re-power" and w.tr()["last"]["action"] == "off"
    assert w.bt()["pausedUntil"] == (T0 + CYCLE + 5) * 1000 and w.bt()["fresh"] is False
    w.pad("off", own=True)
    assert w.calls == [OFF]  # the cycle's own off: no "switched off elsewhere"
    w.advance(T0 + CYCLE + 5)
    assert w.calls == [OFF, ON] and w.tr()["last"] == {"action": "on", "target": "Pad", "at": (T0 + CYCLE + 5) * 1000,
                                                       "reason": "re-power"}
    w.pad("on", own=True)
    b = w.bt()
    assert b["fresh"] is True and b["cycleAt"] == (T0 + CYCLE + 5 + CYCLE) * 1000 and "pausedUntil" not in b
    w.advance(T0 + 2 * CYCLE + 5)
    assert w.calls == [OFF, ON, OFF]


def test_heater_found_on_is_cycled_at_once():
    w = loaded(switch__pad="on")
    assert w.calls == [ON, OFF]  # the start's on (both ways), then the cycle
    assert w.bt()["pausedUntil"] == (T0 + 5) * 1000
    w.pad("off", own=True)
    w.advance(T0 + 5)
    assert w.calls == [ON, OFF, ON]


def test_slow_socket_repeats_the_off_and_never_sends_on_while_on():
    w = heating()
    w.advance(T0 + CYCLE)
    assert w.calls == [OFF]
    w.advance(T0 + CYCLE + 5)  # still reads on
    assert w.calls == [OFF, OFF] and w.bt()["pausedUntil"] == (T0 + CYCLE + 10) * 1000
    w.pad("off", own=True)
    w.advance(T0 + CYCLE + 9)
    assert w.calls == [OFF, OFF]
    w.advance(T0 + CYCLE + 10)
    assert w.calls == [OFF, OFF, ON]


def test_no_data_at_the_pause_end_drops_the_cycle():
    for back, then in (("off", ON), ("on", OFF)):
        w = heating()
        w.advance(T0 + CYCLE)
        w.pad("unavailable")
        w.advance(T0 + CYCLE + 5)
        b = w.bt()
        assert w.calls == [OFF] and "pausedUntil" not in b and b["fresh"] is False and b["heater"] is None
        w.pad(back)
        assert w.calls == [OFF, then]
        if back == "off":
            assert w.tr()["last"]["reason"].startswith("switched off elsewhere")
        else:  # back reading on: not fresh, a new cycle
            assert w.bt()["pausedUntil"] == (T0 + CYCLE + 5 + 5) * 1000


def test_unconfirmed_pause_end_on_is_sent_again():
    w = heating()
    w.advance(T0 + CYCLE)
    w.pad("off", own=True)
    w.advance(T0 + CYCLE + 5)
    assert w.calls == [OFF, ON]  # the pause end's on; the pad keeps reading off
    w.advance(T0 + CYCLE + 9)
    assert w.calls == [OFF, ON]
    w.advance(T0 + CYCLE + 10)
    assert w.calls == [OFF, ON, ON] and w.tr()["last"] == {"action": "on", "target": "Pad",
                                                           "at": (T0 + CYCLE + 10) * 1000, "reason": "no confirmation"}
    w.advance(T0 + CYCLE + 15)
    assert w.calls == [OFF, ON, ON, ON] and w.tr()["last"]["reason"] == "no confirmation"
    w.pad("on", own=True)
    w.advance(T0 + CYCLE + 60)
    assert w.calls == [OFF, ON, ON, ON] and w.bt()["fresh"] is True


def test_unconfirmed_start_on_is_sent_again():
    w = loaded()
    assert w.calls == [ON]
    w.advance(T0 + 4)
    assert w.calls == [ON]
    w.advance(T0 + 5)
    assert w.calls == [ON, ON] and w.tr()["last"]["reason"] == "no confirmation"


def test_no_retry_when_not_wanted_or_no_data():
    w = loaded(sensor__pc=pw(100))
    sent = list(w.calls)
    assert ON not in sent and not w.pending()
    w.advance(T0 + 60)
    assert w.calls == sent
    w = loaded(switch__pad="unavailable")  # wanted, no data: the start's on waits for the pad, no retry timer
    assert w.calls == [ON] and not w.pending()
    w.advance(T0 + 60)
    assert w.calls == [ON]
    w = heating()
    w.pad("unavailable")
    assert not w.pending()
    w.advance(T0 + 60)
    assert w.calls == []


def test_cycle_off_gives_up_a_waiting_on():
    w = loaded(switch__pad="unavailable")
    assert w.calls == [ON]
    w.calls.clear()
    w.pad("on")  # back reading on: not fresh, a cycle; the waiting on is not sent again inside the pause
    assert w.calls == [OFF] and "error" not in w.tr()["last"]
    w.pad("off", own=True)
    w.advance(T0 + 5)
    assert w.calls == [OFF, ON]


def test_verdict_false_during_the_pause_leaves_it_off():
    w = heating([beurer_rule(off=0)])
    w.advance(T0 + CYCLE)
    w.pad("off", own=True)
    w.power(150)
    assert w.tr()["verdict"] is False and w.calls == [OFF, OFF]
    w.advance(T0 + CYCLE + 60)
    assert w.calls == [OFF, OFF] and "pausedUntil" not in w.bt()


def test_disable_while_on_sends_nothing():
    w = heating()
    w.load([beurer_rule(enabled=False)])
    assert w.calls == [] and not w.pending() and w.tr()["status"] == "disabled"


def test_delete_during_a_pause_sends_nothing():
    w = heating()
    w.advance(T0 + CYCLE)
    w.load([])
    w.advance(T0 + CYCLE + 60)
    assert w.calls == [OFF] and not w.pending()


def test_every_zero_never_cycles_in_the_engine():
    w = loaded([beurer_rule(every=0)], switch__pad="on")
    assert w.calls == [ON] and not w.pending() and "cycleAt" not in w.bt()
    w.advance(T0 + 10 * CYCLE)
    assert w.calls == [ON]
    w = heating([beurer_rule(every=0)])  # fresh
    assert not w.pending() and w.bt()["fresh"] is True and "cycleAt" not in w.bt()
    w.advance(T0 + 10 * CYCLE)
    assert w.calls == []


def test_unchanged_save_keeps_a_running_pause():
    w = heating()
    w.advance(T0 + CYCLE)
    w.pad("off", own=True)
    w.advance(T0 + CYCLE + 2)
    w.load([beurer_rule(name="Renamed")])
    assert w.calls == [OFF] and w.bt()["pausedUntil"] == (T0 + CYCLE + 5) * 1000
    assert [p[0] for p in w.pending()] == [T0 + CYCLE + 5]
    w.advance(T0 + CYCLE + 5)
    assert w.calls == [OFF, ON]


def test_unchanged_save_keeps_fresh():
    w = heating()
    w.load([beurer_rule(name="Renamed")])
    assert w.calls == [] and w.bt()["fresh"] is True and w.bt()["cycleAt"] == (T0 + CYCLE) * 1000


def test_changed_save_cycles_a_heater_found_on():
    w = heating()
    w.load([beurer_rule(above=100)])
    assert w.calls == [ON, OFF] and w.bt()["fresh"] is False


def test_boot_waits_for_started():
    w = BWorld(switch__pad="on")
    w.load(boot=True)
    assert OFF not in w.calls and not w.pending()
    w.engine.started()
    assert w.calls[-1] == OFF and w.bt()["pausedUntil"] == (T0 + 5) * 1000


# --- static problems, trace, shared socket -------------------------------------------------------

def test_missing_devices():
    w = loaded([beurer_rule(source="nope")])
    assert w.tr()["status"] == "error" and w.tr()["reason"] == "device missing" and w.calls == []
    w = loaded([beurer_rule(source="pad")])  # no Power binding
    assert w.tr()["reason"] == "device missing"
    w = loaded([beurer_rule(heater="nope")])
    assert w.tr()["reason"] == "device missing"
    w = loaded([beurer_rule(heater="pc")])  # equipment not controllable: no on / off target
    assert w.tr()["reason"] == "target missing"


def test_the_heater_and_the_power_are_tracked():
    w = loaded()
    assert {"switch.pad", "sensor.pc"} <= w.engine.entity_ids()


def test_trace_shape():
    w = heating()
    assert w.bt() == {"watts": 250, "detail": "250 W", "heater": "on", "fresh": True, "cycleAt": (T0 + CYCLE) * 1000}
    w.power(312.4)
    assert w.bt()["watts"] == 312 and isinstance(w.bt()["watts"], int) and w.bt()["detail"] == "312 W"
    w.advance(T0 + CYCLE)
    assert w.bt() == {"watts": 312, "detail": "312 W", "heater": "on", "fresh": False,
                      "pausedUntil": (T0 + CYCLE + 5) * 1000}
    w.power("unavailable")
    assert w.bt()["keptUntil"] == (T0 + CYCLE + 600) * 1000 and w.bt()["detail"] == "no data, kept"
    assert w.tr()["inputs"][0]["until"] == (T0 + CYCLE + 600) * 1000 and w.tr()["inputs"][0]["watts"] is None


def test_no_cycle_at_while_not_wanted():
    w = heating([beurer_rule(off=0)])
    w.power(150)  # the pad still reads on, fresh: no next cycle while the rule does not want it on
    assert w.calls == [OFF] and w.tr()["verdict"] is False and w.bt()["fresh"] is True and "cycleAt" not in w.bt()


def test_shared_with_a_condition_pair():
    w = heating([beurer_rule(off=0), pair_rule()])
    w.set("binary_sensor.m", "on")
    assert w.calls == [] and w.tr("cr")["last"]["reason"] == "already on by Beurer heater"
    w.power(150)
    last = w.tr()["last"]
    assert w.calls == [] and last["reason"] == "kept on by Motion pad" and last["sent"] is False
    w.advance(T0 + 2 * CYCLE)  # fresh and overdue, but not wanted: no cycle, and no timer re-armed in the past
    assert w.calls == [] and not w.pending()
    w.set("binary_sensor.m", "off")
    assert w.calls == [OFF]
