"""Tests for the Timed switch rule in the pure rule engine."""

import copy

import pytest

from rules import RuleEngine
from test_rules import World, dev, plan, rule

ON = ("fan", "turn_on", "fan.vent")
OFF = ("fan", "turn_off", "fan.vent")
MIN = 60
VENT = dev("v", "exhaust_fan", "Vent", control="fan.vent")
VENT2 = dev("v2", "exhaust_fan", "Vent 2", control="fan.vent2")
BUTTON = dev("btn", "smart_button", "Button vent", action="sensor.act")
BUTTON2 = dev("btn2", "smart_button", "Button 2", action="sensor.act2")
WALL = dev("ws", "wall_switch", "Wall", state="switch.ws")
LIGHT = dev("l", "ceiling_light", "Light", control="light.l")
RELAY = dev("rs", "wall_switch", "Light switch", state="light.l")  # the light's own relay


def timed_rule(rid="r", button="btn", device="v", minutes=15, invert=False, name="Timed switch", **extra):
    t = {"button": button, "device": device, "minutes": minutes}
    if invert:
        t["invert"] = True
    return rule(rid, [], name=name, timed=t, **extra)


def timed_plan(rules=None, devices=None, pid="p"):
    devices = devices if devices is not None else [VENT, VENT2, BUTTON, BUTTON2, WALL, LIGHT, RELAY]
    return plan(devices, rules if rules is not None else [timed_rule()], pid)


class TWorld(World):
    """World with an on_runs recorder and own-context state changes."""

    def __init__(self, **states):
        base = {"fan__vent": "off", "fan__vent2": "off", "light__l": "off", "switch__ws": "off"}
        base.update(states)
        super().__init__(**base)
        self.saved = []
        self.engine = RuleEngine(self.lookup, lambda: self.t, self.call, self.schedule,
                                 changed_at=self.changed.get, on_runs=lambda r: self.saved.append(copy.deepcopy(r)))

    def set(self, eid, state, attrs=None, own=False):
        if state is None:
            self.states.pop(eid, None)
        else:
            self.states[eid] = (state, attrs if attrs is not None else self.states.get(eid, (None, {}))[1])
        self.engine.handle_state(eid, own=own)

    def press(self, action, value=None, button="btn", pid="p"):
        intent = {"action": action} if value is None else {"action": action, "value": value}
        self.engine.on_intent(pid, button, intent)

    def start(self, button="btn"):
        self.press("set", "on", button=button)

    def stop(self, button="btn"):
        self.press("set", "off", button=button)

    def tr(self, rid="r"):
        return self.engine.snapshot("p")[rid]

    def tm(self, rid="r"):
        return self.tr(rid)["timed"]


def loaded(rules=None, runs=None, boot=False, devices=None, **states):
    w = TWorld(**states)
    w.engine.load_plans([timed_plan(rules, devices)], boot=boot, runs=runs)
    return w


def running(**states):
    """Started at t=1000 with the vent's on confirmed (own context)."""
    w = loaded(**states)
    w.start()
    w.set("fan.vent", "on", own=True)
    assert w.calls == [ON]
    w.calls.clear()
    return w


# --- idle, trace ------------------------------------------------------------------

def test_idle_by_default_sends_nothing_and_traces_the_device():
    w = loaded()
    t = w.tr()
    assert w.calls == [] and t["status"] == "ok" and t["verdict"] is False and t["inputs"] == []
    assert t["timed"] == {"running": False, "device": "off"} and "last" not in t


def test_device_entity_is_read_and_targeted():
    w = loaded()
    assert "fan.vent" in w.engine.entity_ids()


# --- review focus 1: start, end, restart --------------------------------------------

def test_start_switches_on_and_the_timer_switches_off_after_the_minutes():
    w = loaded()
    w.start()
    t = w.tr()
    assert w.calls == [ON] and t["verdict"] is True
    assert t["timed"] == {"running": True, "until": (1000 + 15 * MIN) * 1000, "device": "off"}
    assert t["last"] == {"action": "on", "target": "Vent", "at": 1000000, "reason": "button start"}
    w.set("fan.vent", "on", own=True)
    w.advance(1000 + 15 * MIN - 1)
    assert w.calls == [ON]
    w.advance(1000 + 15 * MIN)
    t = w.tr()
    assert w.calls == [ON, OFF] and t["verdict"] is False and t["timed"] == {"running": False, "device": "on"}
    assert t["last"]["action"] == "off" and t["last"]["reason"] == "time over"
    assert not w.pending()


def test_a_repeated_start_restarts_the_run_from_then():
    """Review focus 1: one on, one off in total."""
    w = loaded()
    w.start()
    w.set("fan.vent", "on", own=True)
    w.advance(1000 + 10 * MIN)
    w.start()
    assert w.calls == [ON] and w.tm()["until"] == (1000 + 25 * MIN) * 1000
    assert w.tr()["last"]["reason"] == "button start"  # nothing sent on the restart
    w.advance(1000 + 15 * MIN)
    assert w.calls == [ON]
    w.advance(1000 + 25 * MIN)
    assert w.calls == [ON, OFF] and len(w.pending()) == 0


def test_toggle_is_a_start_and_auto_is_ignored():
    w = loaded()
    w.press("auto")
    assert w.calls == [] and w.tm()["running"] is False
    w.press("toggle")
    assert w.calls == [ON] and w.tm()["running"] is True
    w.press("auto")
    assert w.calls == [ON] and w.tm()["running"] is True


@pytest.mark.parametrize("intent", [{"status": "ok"}, {"action": "press"}, {"action": "set", "value": "x"}, {}])
def test_other_events_are_ignored(intent):
    w = loaded()
    w.engine.on_intent("p", "btn", intent)
    assert w.calls == [] and w.tm()["running"] is False


def test_intents_of_another_container_or_plan_are_ignored():
    w = loaded()
    w.start(button="btn2")
    w.press("set", "on", pid="other")
    assert w.calls == [] and w.tm()["running"] is False


def test_start_with_the_device_already_on_sends_nothing_and_runs():
    w = loaded(fan__vent="on")
    w.start()
    assert w.calls == [] and w.tm()["running"] is True
    w.advance(1000 + 15 * MIN)
    assert w.calls == [OFF]


# --- review focus 2: stop ------------------------------------------------------------

def test_stop_while_running_switches_off_at_once_and_ends_the_run():
    w = running()
    w.advance(1000 + 5 * MIN)
    w.stop()
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is False and t["timed"]["running"] is False and "until" not in t["timed"]
    assert t["last"]["reason"] == "button stop" and not w.pending()
    w.advance(1000 + 60 * MIN)
    assert w.calls == [OFF]


@pytest.mark.parametrize("vent", ["on", "off"])
def test_stop_while_idle_does_nothing(vent):
    """Owner correction: a stop event acts only on a running run."""
    w = loaded(fan__vent=vent)
    w.stop()
    assert w.calls == [] and w.tm()["running"] is False and "last" not in w.tr()


def test_stop_with_the_device_already_off_sends_nothing():
    w = running()
    w.set("fan.vent", "off", own=True)  # another rule switched it off: not someone else
    assert w.tm()["running"] is True
    w.stop()
    assert w.calls == [] and w.tm()["running"] is False


# --- review focus 3: switched elsewhere -------------------------------------------------

def test_switched_off_elsewhere_ends_the_run_and_sends_nothing_more():
    w = running()
    w.advance(1000 + 5 * MIN)
    w.set("fan.vent", "off")  # someone in HA
    t = w.tr()
    assert t["verdict"] is False and t["timed"]["running"] is False and not w.pending()
    assert t["last"] == {"action": "off", "target": "Vent", "at": (1000 + 5 * MIN) * 1000,
                         "reason": "ended: switched elsewhere"}
    w.advance(1000 + 60 * MIN)
    assert w.calls == []


def test_a_slow_confirmation_of_our_on_does_not_end_the_run():
    w = loaded()
    w.start()
    w.advance(1010)
    w.set("fan.vent", "on")  # no context any more
    assert w.tm()["running"] is True
    w.advance(1000 + 15 * MIN)
    assert w.calls == [ON, OFF]


def test_unknown_or_unavailable_never_end_the_run():
    w = running()
    for s in ("unavailable", "unknown", "off", "unavailable", "on"):  # back off from no data: not someone else
        w.set("fan.vent", s)
        assert w.tm()["running"] is True
    w.advance(1000 + 15 * MIN)
    assert w.calls == [OFF]


def test_an_own_change_to_another_state_does_not_end_the_run():
    w = running()
    w.set("fan.vent", "off", own=True)
    assert w.tm()["running"] is True


def test_an_attribute_update_does_not_end_the_run():
    w = loaded()
    w.start()  # vent still reads off
    w.set("fan.vent", "off", {"x": 1})
    assert w.tm()["running"] is True


def test_switched_elsewhere_while_idle_changes_nothing():
    w = loaded()
    w.set("fan.vent", "on")
    w.set("fan.vent", "off")
    assert w.calls == [] and "last" not in w.tr()


def test_a_device_back_from_no_data_gets_the_waiting_command_and_an_ended_run_sends_nothing_later():
    w = loaded(fan__vent="unavailable")
    w.start()
    assert w.tr()["reason"] == "target unavailable"
    w.set("fan.vent", "off")  # back from no data: waiting on is sent again
    assert w.calls == [ON, ON]
    w.set("fan.vent", "on", own=True)
    w.set("fan.vent", "off")
    w.set("fan.vent", "unavailable")
    w.set("fan.vent", "on")
    assert w.calls == [ON, ON] and w.tr()["status"] == "ok" and w.tm()["running"] is False


# --- review focus 5: invert -------------------------------------------------------------

def test_invert_is_off_for_the_minutes_then_on():
    w = loaded([timed_rule(invert=True, minutes=10)], fan__vent="on")
    w.start()
    assert w.calls == [OFF] and w.tr()["verdict"] is True
    w.set("fan.vent", "off", own=True)
    w.advance(1000 + 10 * MIN)
    assert w.calls == [OFF, ON] and w.tr()["verdict"] is False


def test_invert_stop_switches_on():
    w = loaded([timed_rule(invert=True)], fan__vent="on")
    w.start()
    w.stop()
    assert w.calls == [OFF, ON]


# --- spec 8: wall switch as the trigger -----------------------------------------------------

def test_separate_wall_switch_on_starts_and_off_stops():
    w = loaded([timed_rule(button="ws")])
    w.states["switch.ws"] = ("on", {})
    w.start(button="ws")
    w.engine.handle_state("switch.ws")
    assert w.calls == [ON] and w.tm()["running"] is True
    w.states["switch.ws"] = ("off", {})
    w.stop(button="ws")
    assert w.calls == [ON, OFF] and w.tm()["running"] is False


def test_the_device_relay_as_the_button_is_an_auto_off_timer():
    """The person switches the light on: the intent comes before the state change, no command, the run starts."""
    w = loaded([timed_rule(button="rs", device="l", minutes=5)])
    w.states["light.l"] = ("on", {})  # the physical switch; HA has the new state when the event fires
    w.start(button="rs")
    w.engine.handle_state("light.l", own=False)
    assert w.calls == [] and w.tm()["running"] is True
    w.advance(1000 + 5 * MIN)
    assert w.calls == [("light", "turn_off", "light.l")] and w.tm()["running"] is False
    w.set("light.l", "off", own=True)
    # again, and switched off by hand before the end: a stop with the light already off
    w.states["light.l"] = ("on", {})
    w.start(button="rs")
    w.engine.handle_state("light.l", own=False)
    w.states["light.l"] = ("off", {})
    w.stop(button="rs")
    w.engine.handle_state("light.l", own=False)
    t = w.tr()
    assert w.calls == [("light", "turn_off", "light.l")] and t["timed"]["running"] is False
    assert t["last"]["reason"] == "time over"  # nothing sent by the stop
    assert not w.pending()


def test_an_unconfirmed_opposite_command_is_overridden():
    w = loaded(fan__vent="on")
    w.start()  # on already: no command
    w.stop()
    assert w.calls == [OFF]
    w.start()  # the off is not confirmed yet: on is sent again
    assert w.calls == [OFF, ON]


# --- waiting for the target -------------------------------------------------------------------

def test_an_unavailable_device_waits_and_is_sent_again_when_it_returns():
    w = loaded(fan__vent="unavailable")
    w.start()
    t = w.tr()
    assert w.calls == [ON] and t["status"] == "error" and t["reason"] == "target unavailable"
    assert t["last"]["error"] == "waiting for target"
    w.set("fan.vent", "off")
    assert w.calls == [ON, ON] and w.tm()["running"] is True
    w.set("fan.vent", "on", own=True)
    assert w.tr()["status"] == "ok"


def test_own_context_is_requested_for_every_command():
    w = loaded()
    w.start()
    assert w.current() is True
    w.stop()
    assert w.current() is True


def test_a_failing_call_is_service_failed_and_the_run_goes_on():
    w = loaded()
    w.fail.add("fan.vent")
    w.start()
    t = w.tr()
    assert t["status"] == "error" and t["reason"] == "service failed" and t["timed"]["running"] is True


def test_the_final_command_gives_up_a_waiting_run_command():
    w = loaded(fan__vent="unavailable")
    w.start()
    w.advance(1000 + 15 * MIN)
    assert w.calls == [ON, OFF] and w.tm()["running"] is False
    w.set("fan.vent", "on")  # back: only the waiting off is sent again
    assert w.calls == [ON, OFF, OFF]


# --- review focus 4: persistence ----------------------------------------------------------------

def test_runs_export_and_on_runs_on_every_change():
    w = loaded()
    assert w.engine.runs() == {} and w.saved == []
    w.start()
    assert w.saved[-1] == {"p": {"r": 1000.0 + 15 * MIN}}
    n = len(w.saved)
    w.set("fan.vent", "on", own=True)
    assert len(w.saved) == n
    w.advance(1000 + 5 * MIN)
    w.start()
    assert w.saved[-1] == {"p": {"r": 1000.0 + 20 * MIN}}
    w.stop()
    assert w.saved[-1] == {}


def test_restored_run_resumes_after_ha_started():
    """Review focus 4: a restart at minute 10, 5 minutes left."""
    w = TWorld(fan__vent="unavailable", t=1000.0 + 10 * MIN)
    w.engine.load_plans([timed_plan()], boot=True, runs={"p": {"r": 1000 + 15 * MIN}})
    t = w.tr()
    assert t["verdict"] is True and t["timed"]["until"] == (1000 + 15 * MIN) * 1000 and not w.pending()
    assert w.saved == []  # the stored runs are current
    w.set("fan.vent", "on")  # the vent reports after the restart: a confirmation
    w.engine.started()
    assert w.calls == [] and len(w.pending()) == 1
    w.engine.started()  # once
    w.advance(1000 + 15 * MIN)
    assert w.calls == [OFF] and w.tm()["running"] is False and w.saved[-1] == {}


def test_restored_run_past_its_end_sends_the_final_command_at_once_after_start():
    w = TWorld(fan__vent="unavailable", t=1000.0 + 20 * MIN)
    w.engine.load_plans([timed_plan()], boot=True, runs={"p": {"r": 1000 + 15 * MIN}})
    assert w.calls == [] and w.tr()["verdict"] is True
    w.set("fan.vent", "on")
    w.engine.started()
    assert w.calls == [OFF] and w.tr()["verdict"] is False and w.tr()["last"]["reason"] == "time over"


def test_restored_run_with_the_device_back_off_still_gets_the_final_command():
    w = TWorld(fan__vent="unavailable", t=1000.0 + 20 * MIN)
    w.engine.load_plans([timed_plan()], boot=True, runs={"p": {"r": 1000 + 15 * MIN}})
    w.set("fan.vent", "off")
    w.engine.started()
    assert w.calls == [OFF]


def test_restored_run_without_boot_is_evaluated_at_once():
    w = TWorld(t=1000.0 + 10 * MIN)
    w.engine.load_plans([timed_plan()], boot=False, runs={"p": {"r": 1000 + 15 * MIN}})
    assert len(w.pending()) == 1
    w.advance(1000 + 15 * MIN)
    assert w.calls == [OFF]


def test_a_start_during_boot_runs_at_once():
    w = TWorld()
    w.engine.load_plans([timed_plan()], boot=True)
    w.start()
    assert w.calls == [ON] and len(w.pending()) == 1


def test_restore_prunes_deleted_rules_and_junk():
    w = loaded(runs={"p": {"r": 2000, "gone": 3000}, "old": {"x": 1}, "q": "junk"})
    assert w.saved == [{"p": {"r": 2000.0}}]
    w2 = loaded(runs={"p": {"r": "soon"}})
    assert w2.tm()["running"] is False and w2.saved == []


def test_a_disabled_or_missing_rule_is_not_restored():
    w = loaded([timed_rule(enabled=False)], runs={"p": {"r": 2000}})
    assert w.calls == [] and w.tm()["running"] is False
    w2 = loaded([timed_rule(device="nope")], runs={"p": {"r": 2000}})
    assert w2.calls == [] and w2.tm()["running"] is False


def test_unload_keeps_the_device_and_a_later_load_with_runs_restores():
    w = running()
    w.engine.load_plans([], unload=True)
    assert w.calls == [] and not w.pending()


# --- saves -----------------------------------------------------------------------------------

def test_unchanged_save_keeps_the_run_and_timer():
    w = running()
    w.advance(1000 + 5 * MIN)
    w.engine.load_plans([timed_plan()])
    assert w.tm()["until"] == (1000 + 15 * MIN) * 1000 and w.calls == [] and len(w.pending()) == 1
    w.advance(1000 + 15 * MIN)
    assert w.calls == [OFF] and not w.pending()


@pytest.mark.parametrize("extra", [{"name": "Renamed"}, {"zoneId": "z2"}])
def test_rename_and_zone_move_keep_the_run(extra):
    w = running()
    r = timed_rule()
    r.update(extra)
    w.engine.load_plans([timed_plan([r])])
    assert w.tm()["running"] is True and w.calls == []
    w.advance(1000 + 15 * MIN)
    assert w.calls == [OFF]


def test_a_new_duration_keeps_the_running_end():
    w = running()
    w.engine.load_plans([timed_plan([timed_rule(minutes=30)])])
    assert w.tm()["until"] == (1000 + 15 * MIN) * 1000 and w.calls == []
    w.advance(1000 + 15 * MIN)
    assert w.calls == [OFF] and not w.pending()


def test_disabling_a_running_rule_sends_the_final_command():
    w = running()
    w.engine.load_plans([timed_plan([timed_rule(enabled=False)])])
    t = w.tr()
    assert w.calls == [OFF] and t["status"] == "disabled" and t["verdict"] is None
    assert t["timed"]["running"] is False and t["last"]["reason"] == "rule disabled" and not w.pending()
    assert w.saved[-1] == {}


def test_disabling_an_idle_rule_sends_nothing():
    w = loaded(fan__vent="on")
    w.engine.load_plans([timed_plan([timed_rule(enabled=False)])])
    assert w.calls == []


def test_a_disabled_rule_ignores_the_button():
    w = loaded([timed_rule(enabled=False)])
    w.start()
    assert w.calls == [] and w.tr()["status"] == "disabled"


def test_deleting_a_running_rule_sends_the_final_command_to_the_device():
    w = running()
    w.engine.load_plans([timed_plan([])])
    assert w.calls == [OFF] and w.engine.runs() == {} and w.saved[-1] == {} and not w.pending()


def test_deleting_an_idle_rule_sends_nothing():
    w = loaded(fan__vent="on")
    w.engine.load_plans([timed_plan([])])
    assert w.calls == []


@pytest.mark.parametrize("changed", [{"device": "v2"}, {"button": "btn2"}, {"invert": True}])
def test_a_changed_device_button_or_invert_ends_the_run_on_the_old_device(changed):
    w = running()
    w.engine.load_plans([timed_plan([timed_rule(**changed)])])
    assert w.calls == [OFF] and w.tm()["running"] is False and not w.pending()


def test_a_rule_that_stops_being_timed_ends_the_run():
    w = running()
    w.engine.load_plans([timed_plan([rule("r", [{"source": {"device": "l"}}])])])
    assert OFF in w.calls


def test_deleting_a_running_rule_with_the_device_off_already_sends_nothing():
    w = running()
    w.set("fan.vent", "off", own=True)
    w.engine.load_plans([timed_plan([])])
    assert w.calls == []


# --- problems, verdict as an input ------------------------------------------------------------

@pytest.mark.parametrize("devices", [
    [BUTTON],  # device missing
    [VENT],  # button missing
    [VENT, dev("btn", "socket", "Socket", control="switch.s")],  # button not a container
    [dev("v", "leak_sensor", "Leak", leak="binary_sensor.l"), BUTTON],  # not switchable
    [dev("v", "equipment", "Boiler", control="switch.b"), BUTTON],  # equipment not controllable
    [dev("v", "valve", "Valve", state="valve.v"), BUTTON],  # no on / off
])
def test_missing_or_wrong_devices_are_an_error_and_ignore_the_button(devices):
    w = loaded(devices=devices)
    w.start()
    t = w.tr()
    assert t["status"] == "error" and t["reason"] == "device missing" and w.calls == []
    assert t["timed"]["running"] is False


def test_verdict_is_an_input_of_another_rule():
    other = rule("r2", [{"source": {"rule": "r"}}], on_true=[("l", "on")], on_false=[("l", "off")])
    w = loaded([timed_rule(), other])
    assert ("light", "turn_off", "light.l") in w.calls
    w.start()
    assert ("light", "turn_on", "light.l") in w.calls and w.tr("r2")["verdict"] is True
    w.advance(1000 + 15 * MIN)
    assert w.calls[-1] == ("light", "turn_off", "light.l") and w.tr("r2")["verdict"] is False
