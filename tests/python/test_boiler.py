"""Tests for the Boiler rule in the pure rule engine (AppDaemon Feature_Boiler ported 1:1)."""

import copy

import pytest

from boiler import Boiler
from rules import RuleEngine
from test_rules import World, dev, plan, rule

W = {"unit_of_measurement": "W"}
ON = ("switch", "turn_on", "switch.relay")
OFF = ("switch", "turn_off", "switch.relay")
GRID = {"block": "g", "limit": 3000, "nominal": 1400}
BOILER = dev("b", "equipment", "Boiler", controllable=True, control="switch.relay", power="sensor.bp")
BUTTON = dev("btn", "smart_button", "Button WC", action="sensor.act")
WALL = dev("ws", "wall_switch", "Wall", state="switch.relay")


def boiler_rule(grid=GRID, rid="r", device="b", button="btn", name="Boiler", **extra):
    b = {"device": device, "button": button}
    if grid is not None:
        b["grid"] = dict(grid)
    return rule(rid, [], name=name, boiler=b, **extra)


def boiler_plan(rules=None, devices=None, blocks=None, pid="p"):
    devices = devices if devices is not None else [BOILER, BUTTON, WALL]
    p = plan(devices, rules if rules is not None else [boiler_rule()], pid)
    p["power"] = {"blocks": blocks if blocks is not None else [{"id": "g", "kind": "grid", "power": "sensor.grid"}],
                  "wires": []}
    return p


class BWorld(World):
    """World with an on_modes recorder and own-context state changes."""

    def __init__(self, **states):
        base = {"switch__relay": "off", "sensor__bp": ("0", W), "sensor__grid": ("500", W)}
        base.update(states)
        super().__init__(**base)
        self.saved = []
        self.engine = RuleEngine(self.lookup, lambda: self.t, self.call, self.schedule,
                                 changed_at=self.changed.get, on_modes=lambda m: self.saved.append(copy.deepcopy(m)))

    def set(self, eid, state, attrs=None, own=False):
        if state is None:
            self.states.pop(eid, None)
        else:
            self.states[eid] = (state, attrs if attrs is not None else self.states.get(eid, (None, {}))[1])
        self.engine.handle_state(eid, own=own)

    def press(self, action, value=None, button="btn", pid="p"):
        intent = {"action": action} if value is None else {"action": action, "value": value}
        self.engine.on_intent(pid, button, intent)

    def b(self, rid="r"):
        return self.engine.snapshot("p")[rid]["boiler"]


def loaded(rules=None, modes=None, **states):
    w = BWorld(**states)
    w.engine.load_plans([boiler_plan(rules)], boot=False, modes=modes)
    return w


def heating(**states):
    """Auto with the relay on and the boiler drawing 1380 W, past the 60 s grace."""
    w = loaded(**states)
    w.press("auto")
    w.set("switch.relay", "on", own=True)
    w.set("sensor.bp", "1380", W)
    w.set("sensor.grid", "1900", W)
    w.advance(w.t + 60)
    assert w.b()["phase"] == "heating" and "until" not in w.b()
    w.calls.clear()
    return w


# --- manual default, trace ------------------------------------------------------

def test_manual_by_default_sends_nothing_and_traces_the_readings():
    w = loaded()
    t = w.engine.snapshot("p")["r"]
    assert w.calls == [] and t["status"] == "ok" and t["verdict"] is False
    assert t["inputs"] == [] and "last" not in t
    assert t["boiler"] == {"mode": "manual", "phase": None, "grid": 500.0, "boilerW": 0.0, "headroom": 1900.0,
                           "relay": "off"}


def test_entity_ids_cover_relay_boiler_power_and_grid():
    w = loaded()
    assert {"switch.relay", "sensor.bp", "sensor.grid"} <= w.engine.entity_ids()


def test_without_grid_there_is_no_grid_or_headroom():
    w = loaded([boiler_rule(grid=None)], sensor__grid="unavailable")
    assert w.b()["grid"] is None and w.b()["headroom"] is None
    w.press("auto")
    assert w.calls == [ON] and w.b()["phase"] == "heating"


# --- auto steps -----------------------------------------------------------------

def test_auto_switches_on_and_waits_60_s_before_concluding():
    w = loaded()
    w.press("auto")
    t = w.engine.snapshot("p")["r"]
    assert w.calls == [ON] and t["verdict"] is True
    assert t["boiler"]["mode"] == "auto" and t["boiler"]["phase"] == "heating" and t["boiler"]["until"] == 1060000
    assert t["last"]["action"] == "on" and t["last"]["target"] == "Boiler" and t["last"]["at"] == 1000000
    w.set("switch.relay", "on", own=True)
    w.advance(1059)  # power still 0 inside the grace: not done
    assert w.calls == [ON] and w.b()["mode"] == "auto"
    w.advance(1060)  # grace over, power 0: heating done
    t = w.engine.snapshot("p")["r"]
    assert w.calls == [ON, OFF] and t["verdict"] is False
    assert t["boiler"]["mode"] == "manual" and t["boiler"]["phase"] == "done" and "until" not in t["boiler"]
    assert t["last"]["action"] == "off" and t["last"]["reason"] == "heating done"


def test_heating_done_after_30_min_sends_nothing_more():
    """Review focus 3."""
    w = heating()
    w.advance(w.t + 1800)
    w.set("sensor.grid", "520", W)
    assert w.calls == []
    w.set("sensor.bp", "0", W)
    w.set("sensor.grid", "500", W)
    assert w.calls == [OFF] and w.b()["mode"] == "manual" and w.b()["phase"] == "done"
    w.set("switch.relay", "off", own=True)
    for v in ("600", "4000", "unavailable", "500"):
        w.set("sensor.grid", v, W)
    w.advance(w.t + 3600)
    assert w.calls == [OFF] and w.b()["mode"] == "manual"


def test_unknown_boiler_power_keeps_heating():
    w = heating()
    w.set("sensor.grid", "1500", W)  # 1500 + 1400 - 0 stays under the limit with the boiler counted 0
    w.set("sensor.bp", "unavailable")
    w.advance(w.t + 600)
    assert w.calls == [] and w.b()["mode"] == "auto" and w.b()["phase"] == "heating" and w.b()["boilerW"] is None


def test_blackout_turns_off_keeps_auto_and_resumes_15_s_after_the_grid_returns():
    """Review focus 1."""
    w = heating()
    w.set("sensor.grid", "unavailable")
    assert w.calls == [OFF] and w.b()["mode"] == "auto" and w.b()["phase"] == "blackout" and w.b()["grid"] is None
    assert w.engine.snapshot("p")["r"]["last"]["reason"] == "blackout"
    w.set("switch.relay", "off", own=True)
    w.set("sensor.bp", "0", W)
    assert w.calls == [OFF] and w.b()["mode"] == "auto"
    w.advance(w.t + 600)
    w.set("sensor.grid", "500", W)
    t0 = w.t
    assert w.calls == [OFF] and w.b()["phase"] == "waiting" and w.b()["until"] == int((t0 + 15) * 1000)
    w.advance(t0 + 14.9)
    assert w.calls == [OFF]
    w.advance(t0 + 15)
    assert w.calls == [OFF, ON] and w.b()["phase"] == "heating"


def test_power_limit_turns_off_and_back_on_15_s_after_it_clears_without_flapping():
    """Review focus 2."""
    w = heating()
    w.set("sensor.grid", "1950", W)  # 1950 + 1400 - 1380 = 1970
    assert w.calls == [] and w.b()["headroom"] == 1970.0
    w.set("sensor.grid", "4200", W)  # kettle: 4220 > 3000
    assert w.calls == [OFF] and w.b()["phase"] == "limit" and w.b()["mode"] == "auto"
    assert w.engine.snapshot("p")["r"]["last"]["reason"] == "power limit"
    w.set("switch.relay", "off", own=True)
    w.set("sensor.bp", "0", W)
    w.set("sensor.grid", "2820", W)  # 4220 still over
    w.advance(w.t + 120)
    w.set("sensor.grid", "800", W)  # kettle off
    t0 = w.t
    assert w.b()["phase"] == "waiting" and w.b()["until"] == int((t0 + 15) * 1000)
    w.advance(t0 + 5)
    w.set("sensor.grid", "2700", W)  # 4100: over again inside the wait
    w.advance(t0 + 10)
    w.set("sensor.grid", "800", W)
    w.advance(t0 + 24.9)
    assert w.calls == [OFF]
    w.advance(t0 + 25)
    assert w.calls == [OFF, ON]


def test_limit_counts_unknown_boiler_power_as_zero():
    w = loaded(sensor__bp="unavailable", sensor__grid=("1700", W))  # 1700 + 1400 = 3100
    w.press("auto")
    assert w.calls == [] and w.b()["phase"] == "limit" and w.b()["headroom"] == 3100.0


def test_limit_exactly_at_the_limit_is_allowed():
    w = loaded(sensor__grid=("1600", W))  # 1600 + 1400 - 0 = 3000, not over
    w.press("auto")
    assert w.calls == [ON]


@pytest.mark.parametrize("state,attrs,watts", [
    ("0.8", {"unit_of_measurement": "kW"}, 800.0), ("0.0005", {"unit_of_measurement": "MW"}, 500.0),
    ("500000", {"unit_of_measurement": "mW"}, 500.0), ("500", W, 500.0),
    ("500", {"unit_of_measurement": "kWh"}, None), ("500", {}, 500.0), ("abc", W, None), ("nan", W, None),
    ("unknown", W, None),
])
def test_power_units(state, attrs, watts):
    w = loaded(sensor__grid=(state, attrs))
    assert w.b()["grid"] == watts
    w.press("auto")
    assert w.b()["phase"] == ("blackout" if watts is None else "heating")


def test_grid_entity_missing_is_a_blackout():
    w = loaded()
    w.states.pop("sensor.grid")
    w.press("auto")
    assert w.b()["phase"] == "blackout" and w.calls == []  # the relay is off already


def test_relay_already_on_when_auto_starts_gets_the_60_s_grace():
    w = loaded(switch__relay="on")
    w.press("auto")
    assert w.calls == [] and w.b()["phase"] == "heating" and w.b()["until"] == 1060000
    w.advance(1060)
    assert w.calls == [OFF] and w.b()["phase"] == "done"


def test_auto_within_15_s_of_a_manual_off_waits():
    w = loaded(switch__relay="on")
    w.press("toggle")
    assert w.calls == [OFF]
    w.set("switch.relay", "off", own=True)
    w.advance(1010)
    w.press("auto")
    assert w.calls == [OFF] and w.b()["phase"] == "waiting" and w.b()["until"] == 1015000
    w.advance(1015)
    assert w.calls == [OFF, ON]


def test_auto_press_while_auto_keeps_the_timers():
    w = loaded()
    w.press("auto")
    w.set("switch.relay", "on", own=True)
    w.advance(1030)
    w.press("auto")
    assert w.b()["until"] == 1060000 and w.calls == [ON]


def test_no_duplicate_on_before_the_relay_reports():
    w = loaded()
    w.press("auto")
    w.set("sensor.grid", "510", W)
    w.set("sensor.grid", "520", W)
    assert w.calls == [ON]


def test_manual_cancels_the_timer():
    w = loaded()
    w.press("auto")
    assert w.pending()
    w.press("set", "off")
    assert not w.pending()
    w.advance(5000)
    assert w.b()["mode"] == "manual"


# --- button -----------------------------------------------------------------------

@pytest.mark.parametrize("relay,call", [("off", ON), ("on", OFF), ("unavailable", ON), ("unknown", ON)])
def test_toggle_is_manual_and_switches_to_the_opposite(relay, call):
    w = loaded(switch__relay=relay)
    w.press("toggle")
    assert w.calls == [call] and w.b()["mode"] == "manual"
    assert w.engine.snapshot("p")["r"]["last"]["reason"] == "button toggle"


def test_toggle_while_auto_goes_manual():
    w = heating()
    w.press("toggle")
    assert w.calls == [OFF] and w.b()["mode"] == "manual" and w.b()["phase"] is None
    assert w.engine.snapshot("p")["r"]["verdict"] is False


@pytest.mark.parametrize("relay,value,calls", [
    ("on", "on", []), ("off", "off", []), ("off", "on", [ON]), ("on", "off", [OFF]),
])
def test_set_is_manual_and_sends_only_a_change(relay, value, calls):
    w = loaded(switch__relay=relay)
    w.press("auto")
    w.calls.clear()
    w.press("set", value)
    assert w.calls == calls and w.b()["mode"] == "manual"


@pytest.mark.parametrize("intent", [{"status": "ok"}, {"action": "press"}, {"action": "set", "value": "x"}, {}])
def test_other_events_are_ignored(intent):
    w = loaded()
    w.engine.on_intent("p", "btn", intent)
    assert w.calls == [] and w.b()["mode"] == "manual"


def test_intents_of_another_container_or_plan_are_ignored():
    w = loaded()
    w.press("auto", button="ws")
    w.press("auto", pid="other")
    assert w.calls == [] and w.b()["mode"] == "manual"


# --- external change ----------------------------------------------------------------

def test_relay_switched_in_the_ui_while_auto_goes_manual_and_is_not_switched_back():
    """Review focus 4."""
    w = heating()
    w.set("switch.relay", "off")  # not own: a human
    assert w.calls == [] and w.b()["mode"] == "manual"
    w.set("sensor.bp", "0", W)
    w.set("sensor.grid", "400", W)
    w.advance(w.t + 3600)
    assert w.calls == []


def test_own_relay_changes_do_not_change_the_mode():
    w = heating()
    w.set("sensor.grid", "unavailable")
    w.set("switch.relay", "off", own=True)
    assert w.b()["mode"] == "auto"


def test_relay_back_from_unavailable_is_not_a_human_and_is_switched_on_again():
    w = heating()
    w.set("switch.relay", "unavailable")
    w.set("switch.relay", "off")  # the relay lost power: not a take-over
    assert w.b()["mode"] == "auto" and w.calls == [ON]


def test_external_change_in_manual_sends_nothing():
    w = loaded()
    w.set("switch.relay", "on")
    w.set("switch.relay", "off")
    assert w.calls == [] and w.b()["mode"] == "manual"


def test_wall_switch_over_the_relay_set_from_a_toggle_is_manual_without_a_call():
    w = loaded([boiler_rule(button="ws")], switch__relay="on")
    w.press("auto", button="ws")
    w.states["switch.relay"] = ("off", {})  # the physical toggle
    w.press("set", "off", button="ws")  # the runtime delivers the intent first
    w.engine.handle_state("switch.relay", own=False)
    assert w.calls == [] and w.b()["mode"] == "manual"


def wall_button_heating_off(**states):
    """A boiler whose button is a wall switch over the relay; the relay seen on, grid 2110, boiler 1529, manual."""
    w = loaded([boiler_rule(button="ws")], sensor__bp=("1529", W), sensor__grid=("2110", W), **states)
    w.set("switch.relay", "on")  # seen on (manual: not a take-over)
    w.advance(1100)  # long after that switch
    assert w.b()["mode"] == "manual" and w.calls == []
    return w


def test_wall_switch_button_toggle_starts_the_settle_time():
    """Fix round 1: the runtime delivers the wall switch's intent before the relay's state change."""
    w = wall_button_heating_off()
    w.states["switch.relay"] = ("off", {})  # the hand switches it off
    w.press("set", "off", button="ws")
    w.engine.handle_state("switch.relay", own=False)
    w.advance(1101)
    w.states["switch.relay"] = ("on", {})  # 1 s later on again: the double toggle
    w.press("auto", button="ws")
    w.engine.handle_state("switch.relay", own=False)
    assert w.b()["mode"] == "auto" and w.calls == []
    w.set("sensor.bp", "0", W)  # 2110 + 1400 - 0 = 3510 with a stale grid meter
    assert w.calls == [] and w.b()["phase"] == "heating"
    w.advance(1105)
    w.set("sensor.bp", "1440", W)
    w.set("sensor.grid", "5000", W)  # a real overload: 4960 > 3000
    w.advance(1110.9)
    assert w.calls == []
    w.advance(1111)
    assert w.calls == [OFF] and w.b()["phase"] == "limit"
    assert w.engine.snapshot("p")["r"]["last"]["reason"] == "power limit"


def test_wall_switch_button_toggled_from_no_data_starts_no_settle_time():
    w = wall_button_heating_off()
    w.set("switch.relay", "unavailable")
    w.states["switch.relay"] = ("on", {})  # back from no data with the toggle
    w.press("auto", button="ws")
    w.engine.handle_state("switch.relay", own=False)
    assert w.b()["mode"] == "auto" and w.calls == []
    w.set("sensor.bp", "0", W)  # 3510: judged at once
    assert w.calls == [OFF] and w.b()["phase"] == "limit"


def test_wall_switch_double_toggle_auto_is_not_undone_by_its_own_change():
    w = loaded([boiler_rule(button="ws")], switch__relay="on")
    w.states["switch.relay"] = ("off", {})
    w.engine.handle_state("switch.relay", own=False)
    w.states["switch.relay"] = ("on", {})
    w.press("auto", button="ws")  # second toggle inside the window: auto
    w.engine.handle_state("switch.relay", own=False)
    assert w.b()["mode"] == "auto" and w.calls == []


def test_handle_state_keeps_the_old_signature():
    w = heating()
    w.states["switch.relay"] = ("off", {})
    w.engine.handle_state("switch.relay")  # existing callers: not own
    assert w.b()["mode"] == "manual"


# --- waiting for the target -----------------------------------------------------------

def test_unavailable_relay_waits_and_is_sent_again_when_it_returns():
    w = loaded(switch__relay="unavailable")
    w.press("auto")
    t = w.engine.snapshot("p")["r"]
    assert w.calls == [ON] and t["status"] == "error" and t["reason"] == "target unavailable"
    assert t["last"]["error"] == "waiting for target"
    w.set("sensor.grid", "510", W)
    assert w.calls == [ON]
    w.t = 1005.0
    w.set("switch.relay", "off")
    assert w.calls == [ON, ON] and w.b()["mode"] == "auto"
    w.set("switch.relay", "on", own=True)
    t = w.engine.snapshot("p")["r"]
    assert t["status"] == "ok" and "error" not in t["last"]


def test_a_button_set_while_unavailable_is_sent_when_the_relay_returns():
    w = loaded(switch__relay="unavailable")
    w.press("set", "on")
    assert w.calls == [ON]
    w.set("switch.relay", "off")
    assert w.calls == [ON, ON] and w.b()["mode"] == "manual"


def test_a_failing_call_is_service_failed():
    w = loaded()
    w.fail.add("switch.relay")
    w.press("auto")
    t = w.engine.snapshot("p")["r"]
    assert t["status"] == "error" and t["reason"] == "service failed"
    w.set("sensor.grid", "510", W)
    assert w.calls == [ON]  # not sent again on every reading


def test_a_late_failure_marks_the_latest_send():
    w = loaded()
    w.press("auto")
    w.on_error("boom")
    t = w.engine.snapshot("p")["r"]
    assert t["status"] == "error" and t["reason"] == "service failed"


# --- persistence --------------------------------------------------------------------

def test_modes_export_and_on_modes_on_every_change():
    w = loaded()
    assert w.engine.modes() == {"p": {"r": "manual"}}
    w.press("auto")
    assert w.saved[-1] == {"p": {"r": "auto"}}
    n = len(w.saved)
    w.set("sensor.grid", "520", W)
    assert len(w.saved) == n  # no mode change: nothing saved
    w.press("toggle")
    assert w.saved[-1] == {"p": {"r": "manual"}}


def test_on_modes_after_heating_done_and_external_change():
    w = heating()
    w.set("switch.relay", "off")
    assert w.saved[-1] == {"p": {"r": "manual"}}


def test_restored_auto_is_evaluated_once_ha_has_started():
    """Review focus 5: a stored auto waits for the end of the boot phase, then is evaluated once."""
    w = BWorld(switch__relay="on", sensor__grid="unavailable")
    w.engine.load_plans([boiler_plan()], boot=True, modes={"p": {"r": "auto"}})
    w.set("sensor.grid", "unknown")
    assert w.calls == [] and w.b()["mode"] == "auto" and w.b()["phase"] is None
    assert w.engine.snapshot("p")["r"]["verdict"] is True
    assert w.saved == []  # the stored modes are already current
    w.engine.started()
    assert w.calls == [OFF] and w.b()["phase"] == "blackout"
    w.engine.started()  # once
    assert w.calls == [OFF]
    w.set("switch.relay", "off", own=True)
    w.advance(w.t + 10)  # the readings settle after the relay change (0.23.1): the blackout holds until then
    w.set("sensor.grid", "500", W)
    assert w.b()["phase"] == "waiting"
    w.advance(w.t + 15)
    assert w.calls == [OFF, ON]


def test_restored_auto_with_the_relay_on_gets_the_grace():
    w = loaded(modes={"p": {"r": "auto"}}, switch__relay="on")
    assert w.calls == [] and w.b()["phase"] == "heating" and w.b()["until"] == 1060000


def test_restored_auto_with_an_unknown_relay_switches_it_on():
    w = loaded(modes={"p": {"r": "auto"}}, switch__relay="unknown")
    assert w.calls == [ON] and w.b()["mode"] == "auto"


def test_restore_prunes_deleted_rules_and_fills_missing_ones():
    w = loaded(modes={"p": {"r": "auto", "gone": "auto"}, "old": {"x": "manual"}})
    assert w.saved == [{"p": {"r": "auto"}}]
    w2 = loaded(modes={})
    assert w2.saved == [{"p": {"r": "manual"}}]


def test_junk_stored_mode_is_manual():
    w = loaded(modes={"p": {"r": "turbo"}})
    assert w.b()["mode"] == "manual" and w.calls == []


def test_unchanged_save_keeps_state_and_timers():
    w = loaded()
    w.press("auto")
    w.set("switch.relay", "on", own=True)
    w.advance(1030)
    w.engine.load_plans([boiler_plan()])
    assert w.b()["mode"] == "auto" and w.b()["until"] == 1060000 and w.calls == [ON]
    w.advance(1060)
    assert w.calls == [ON, OFF] and len([t for t in w.timers if t[3]]) == 0


def test_save_with_new_limit_keeps_the_mode_and_ignores_stored_modes():
    w = loaded()
    w.press("auto")
    w.engine.load_plans([boiler_plan([boiler_rule(grid={**GRID, "limit": 3500}, name="Boiler 2")])],
                        modes={"p": {"r": "manual"}})
    assert w.b()["mode"] == "auto" and w.b()["until"] == 1060000
    assert w.calls == [ON]


@pytest.mark.parametrize("changed", [
    {"device": "b2"}, {"button": "ws"}, {"grid": {**GRID, "block": "g2"}}, {"grid": None},
])
def test_save_changing_device_button_or_grid_block_resets_to_manual(changed):
    w = loaded()
    w.press("auto")
    w.calls.clear()
    boiler2 = dev("b2", "equipment", "Boiler 2", controllable=True, control="switch.relay", power="sensor.bp")
    kw = {"grid": GRID, **changed}
    blocks = [{"id": "g", "kind": "grid", "power": "sensor.grid"}, {"id": "g2", "kind": "grid", "power": "sensor.grid"}]
    w.engine.load_plans([boiler_plan([boiler_rule(**kw)], devices=[BOILER, boiler2, BUTTON, WALL], blocks=blocks)])
    assert w.b()["mode"] == "manual" and w.calls == [] and not w.pending()
    assert w.saved[-1] == {"p": {"r": "manual"}}


def test_deleted_rule_is_dropped_and_its_timer_cancelled():
    w = loaded()
    w.press("auto")
    w.engine.load_plans([boiler_plan([])])
    assert w.saved[-1] == {} and w.engine.modes() == {} and not w.pending()


# --- problems, disabled, verdict as an input ---------------------------------------------

@pytest.mark.parametrize("devices,blocks", [
    ([dev("b", "equipment", "Boiler", controllable=True, control="switch.relay"), BUTTON], None),  # no power
    ([dev("b", "equipment", "Boiler", power="sensor.bp"), BUTTON], None),  # no control
    ([dev("b", "equipment", "Boiler", control="sensor.x", power="sensor.bp"), BUTTON], None),  # not switchable
    ([BOILER, dev("btn", "socket", "Socket", control="switch.s")], None),  # button not a container
    ([BOILER], None),  # button missing
    ([BUTTON], None),  # boiler missing
    (None, []),  # grid block missing
    (None, [{"id": "g", "kind": "grid"}]),  # grid block without power
    (None, [{"id": "g", "kind": "battery", "power": "sensor.grid"}]),  # not a grid block
])
def test_missing_devices_are_an_error_and_ignore_the_button(devices, blocks):
    w = BWorld()
    w.engine.load_plans([boiler_plan(devices=devices, blocks=blocks)], boot=False)
    w.press("auto")
    t = w.engine.snapshot("p")["r"]
    assert t["status"] == "error" and t["reason"] == "device missing" and w.calls == []
    assert t["boiler"]["mode"] == "manual"


def test_disabled_rule_does_nothing():
    w = loaded([boiler_rule(enabled=False)])
    w.press("auto")
    w.press("toggle")
    t = w.engine.snapshot("p")["r"]
    assert w.calls == [] and t["status"] == "disabled" and t["verdict"] is None


def test_verdict_is_an_input_of_another_rule():
    light = dev("l", "ceiling_light", "Light", control="light.l")
    other = rule("r2", [{"source": {"rule": "r"}}], on_true=[("l", "on")], on_false=[("l", "off")])
    w = BWorld(light__l="off")
    w.engine.load_plans([boiler_plan([boiler_rule(), other], devices=[BOILER, BUTTON, light])], boot=False)
    assert ("light", "turn_off", "light.l") in w.calls
    w.press("auto")
    assert ("light", "turn_on", "light.l") in w.calls
    assert w.engine.snapshot("p")["r2"]["verdict"] is True


# --- fix round 1 --------------------------------------------------------------------

def test_auto_pressed_during_boot_waits_for_the_start():
    w = BWorld()
    w.engine.load_plans([boiler_plan()], boot=True)
    w.press("auto")
    assert w.calls == [] and w.b()["mode"] == "auto" and not w.pending()
    w.engine.started()
    assert w.calls == [ON] and w.b()["phase"] == "heating"


def test_a_later_load_does_not_end_the_boot_phase():
    w = BWorld()
    w.engine.load_plans([boiler_plan()], boot=True, modes={"p": {"r": "auto"}})
    w.engine.load_plans([boiler_plan([boiler_rule(name="Renamed")])], boot=False)
    assert w.calls == []
    w.engine.started()
    assert w.calls == [ON]


def test_buttons_still_switch_during_boot():
    w = BWorld()
    w.engine.load_plans([boiler_plan()], boot=True)
    w.press("toggle")
    assert w.calls == [ON] and w.b()["mode"] == "manual"


def test_slow_relay_confirming_the_rules_command_without_context_is_not_a_take_over():
    w = loaded()
    w.press("auto")
    assert w.calls == [ON]
    w.advance(1006)
    w.set("switch.relay", "on")  # HA no longer carries the call's context
    assert w.b()["mode"] == "auto" and w.calls == [ON]


def test_a_change_away_from_the_command_without_context_is_a_take_over():
    w = loaded()
    w.press("auto")
    w.set("switch.relay", "on", own=True)
    w.set("switch.relay", "off")
    assert w.b()["mode"] == "manual"


def test_disabling_an_auto_rule_goes_manual_and_switches_the_relay_off():
    w = heating()
    w.engine.load_plans([boiler_plan([boiler_rule(enabled=False)])])
    t = w.engine.snapshot("p")["r"]
    assert w.calls == [OFF] and t["boiler"]["mode"] == "manual" and t["status"] == "disabled"
    assert t["last"]["reason"] == "rule disabled" and w.saved[-1] == {"p": {"r": "manual"}}
    assert not w.pending()


def test_disabling_an_auto_rule_whose_last_command_was_off_sends_nothing():
    w = heating()
    w.set("sensor.grid", "unavailable")  # blackout: off sent
    w.set("switch.relay", "off", own=True)
    w.calls.clear()
    w.engine.load_plans([boiler_plan([boiler_rule(enabled=False)])])
    assert w.calls == [] and w.b()["mode"] == "manual"


def test_disabling_a_manual_rule_sends_nothing():
    w = loaded(switch__relay="on")
    w.press("set", "on")
    w.engine.load_plans([boiler_plan([boiler_rule(enabled=False)])])
    assert w.calls == []


def test_a_disabled_rule_is_not_restored_to_auto():
    w = loaded([boiler_rule(enabled=False)], modes={"p": {"r": "auto"}})
    assert w.b()["mode"] == "manual" and w.calls == []


def test_disabling_an_auto_rule_after_a_restart_switches_a_running_relay_off():
    w = loaded([boiler_rule()], modes={"p": {"r": "auto"}}, switch__relay="on")
    w.engine.started()
    w.calls.clear()
    w.engine.load_plans([boiler_plan([boiler_rule(enabled=False)])])
    assert w.calls == [OFF] and w.b()["mode"] == "manual"


# --- final review follow-ups ------------------------------------------------------------

def test_deleting_an_auto_rule_with_the_relay_on_switches_it_off():
    w = heating()
    w.engine.load_plans([boiler_plan([])])
    assert w.calls == [OFF] and w.engine.modes() == {} and not w.pending()


def test_deleting_an_auto_rule_with_the_relay_off_sends_nothing():
    w = loaded()
    w.press("auto")
    w.calls.clear()
    w.engine.load_plans([boiler_plan([])])
    assert w.calls == []


def test_deleting_a_manual_rule_with_the_relay_on_sends_nothing():
    w = loaded(switch__relay="on")
    w.engine.load_plans([boiler_plan([])])
    assert w.calls == []


@pytest.mark.parametrize("changed", [{"device": "b2"}, {"grid": None}, {"button": "ws"}])
def test_a_save_resetting_an_auto_rule_switches_the_old_relay_off(changed):
    w = heating()
    boiler2 = dev("b2", "equipment", "Boiler 2", controllable=True, control="switch.relay2", power="sensor.bp2")
    w.states["switch.relay2"] = ("on", {})
    w.engine.load_plans([boiler_plan([boiler_rule(**{"grid": GRID, **changed})], devices=[BOILER, boiler2, BUTTON, WALL])])
    assert w.calls == [OFF] and w.b()["mode"] == "manual" and not w.pending()
    assert w.saved[-1] == {"p": {"r": "manual"}}


def test_a_rule_that_stops_being_a_boiler_switches_the_relay_off():
    w = heating()
    light = dev("l", "ceiling_light", "Light", control="light.l")
    other = rule("r", [{"source": {"device": "l"}}], name="Other")
    w.engine.load_plans([boiler_plan([other], devices=[BOILER, BUTTON, WALL, light])])
    assert OFF in w.calls


def test_heating_done_is_cleared_when_the_relay_is_switched_on_later():
    w = heating()
    w.set("sensor.grid", "500", W)
    w.set("sensor.bp", "0", W)
    assert w.b()["phase"] == "done"
    w.set("sensor.grid", "505", W)
    assert w.b()["phase"] == "done"  # the off is not confirmed yet: still done
    w.set("switch.relay", "off", own=True)
    w.set("sensor.grid", "510", W)
    assert w.b()["phase"] == "done"  # stays while the relay is off
    w.set("switch.relay", "on")  # a human, later
    assert w.b()["phase"] is None and w.b()["mode"] == "manual" and w.calls == [OFF]


def test_a_non_controllable_equipment_boiler_is_a_missing_device():
    plain = dev("b", "equipment", "Boiler", control="switch.relay", power="sensor.bp")
    w = BWorld()
    w.engine.load_plans([boiler_plan(devices=[plain, BUTTON])], boot=False)
    w.press("auto")
    t = w.engine.snapshot("p")["r"]
    assert t["status"] == "error" and t["reason"] == "device missing" and w.calls == []


def test_a_socket_boiler_needs_no_controllable_flag():
    sock = dev("b", "socket", "Socket", control="switch.relay", power="sensor.bp")
    w = BWorld()
    w.engine.load_plans([boiler_plan(devices=[sock, BUTTON])], boot=False)
    w.press("auto")
    assert w.calls == [ON]


def test_unload_sends_no_relay_command():
    w = heating()
    w.engine.load_plans([], unload=True)
    assert w.calls == [] and not w.pending()


# --- 0.23.1: the readings settle after a relay change (spec §11) --------------------------

def switched_on():
    """Auto switched the boiler on at 1000 and the relay reported on at once: the settle time runs to 1010."""
    w = loaded()
    w.press("auto")
    w.set("switch.relay", "on", own=True)
    assert w.calls == [ON] and w.b()["phase"] == "heating"
    return w


def test_grid_report_before_the_boiler_meter_is_not_a_limit():
    """Review focus 1 (live 10:04:52): the grid meter includes the boiler before its own meter does."""
    w = switched_on()
    w.advance(1003.7)
    w.set("sensor.grid", "2054", W)  # 2054 + 1400 - 0 = 3454 > 3000 with a stale boiler meter
    assert w.calls == [ON] and w.b()["phase"] == "heating" and w.b()["mode"] == "auto"
    assert w.b()["until"] == 1060000  # the trace still counts down the 60 s grace
    w.advance(1003.8)
    w.set("sensor.bp", "1440", W)  # 2054 + 1400 - 1440 = 2014
    assert w.calls == [ON] and w.b()["phase"] == "heating"
    w.advance(1100)
    assert w.calls == [ON] and w.b()["phase"] == "heating" and w.b()["mode"] == "auto"


def test_stale_grid_after_a_button_off_does_not_restart_the_wait():
    """Review focus 2 (live 10:02:26): the boiler meter drops to 0 W before the grid meter does."""
    w = heating()
    w.set("sensor.bp", "1529", W)
    w.set("sensor.grid", "2110", W)
    t = w.t
    w.press("toggle")
    w.set("switch.relay", "off", own=True)
    assert w.calls == [OFF] and w.b()["mode"] == "manual"
    w.advance(t + 2)
    w.press("auto")
    assert w.b()["phase"] == "waiting" and w.b()["until"] == int((t + 15) * 1000)
    w.advance(t + 3)
    w.set("sensor.bp", "0", W)  # 2110 + 1400 - 0 = 3510 with a stale grid meter
    r = w.engine.snapshot("p")["r"]
    assert r["boiler"]["phase"] == "waiting" and r["last"]["reason"] == "button toggle" and w.calls == [OFF]
    w.advance(t + 4)
    w.set("sensor.grid", "552", W)
    w.advance(t + 14.9)
    assert w.calls == [OFF] and w.b()["phase"] == "waiting"
    w.advance(t + 15)
    assert w.calls == [OFF, ON] and w.b()["phase"] == "heating"


def test_real_overload_after_the_settle_time_switches_off():
    """Review focus 3."""
    w = switched_on()
    w.set("sensor.bp", "1440", W)
    w.advance(1010)
    w.set("sensor.grid", "3500", W)  # 3500 + 1400 - 1440 = 3460 > 3000
    assert w.calls == [ON, OFF] and w.b()["phase"] == "limit"
    assert w.engine.snapshot("p")["r"]["last"]["reason"] == "power limit"


def test_real_overload_inside_the_settle_time_switches_off_at_its_end():
    """Review focus 3: judged when the settle time ends, also when no meter reports then."""
    w = switched_on()
    w.advance(1003)
    w.set("sensor.bp", "1440", W)
    w.set("sensor.grid", "3500", W)  # a real overload: 3460 > 3000
    assert w.calls == [ON] and w.b()["phase"] == "heating"
    w.advance(1009.9)
    assert w.calls == [ON]
    w.advance(1010)
    assert w.calls == [ON, OFF] and w.b()["phase"] == "limit"
    assert w.engine.snapshot("p")["r"]["last"]["reason"] == "power limit"


def test_limit_stays_limit_during_the_settle_time():
    """Review focus 4: a limit in force is neither cleared nor re-judged while the readings settle."""
    w = heating()  # relay on since 1000, now 1060
    w.set("sensor.grid", "4200", W)  # 4220 > 3000: a real limit
    assert w.calls == [OFF] and w.b()["phase"] == "limit"
    t = w.t
    w.set("switch.relay", "off", own=True)  # the settle time runs to t + 10
    w.advance(t + 1)
    w.set("sensor.bp", "0", W)
    w.advance(t + 3)
    w.set("sensor.grid", "1000", W)  # 2400 would clear the limit: not judged yet, the 15 s wait does not start
    assert w.calls == [OFF] and w.b()["phase"] == "limit" and "until" not in w.b()
    w.advance(t + 5)
    w.set("sensor.grid", "4000", W)  # a real overload again
    w.advance(t + 9.9)
    assert w.calls == [OFF] and w.b()["phase"] == "limit"
    w.advance(t + 10)
    assert w.calls == [OFF] and w.b()["phase"] == "limit"  # judged at the end: still over, nothing to send
    w.advance(t + 30)
    w.set("sensor.grid", "800", W)  # the limit clears after the settle time
    assert w.b()["phase"] == "waiting" and w.b()["until"] == int((t + 45) * 1000)
    w.advance(t + 44.9)
    assert w.calls == [OFF]
    w.advance(t + 45)
    assert w.calls == [OFF, ON]


def test_limit_found_cleared_at_the_end_of_the_settle_time_starts_the_wait_then():
    w = heating()
    w.set("sensor.grid", "4200", W)
    t = w.t
    w.set("switch.relay", "off", own=True)
    w.set("sensor.bp", "0", W)
    w.advance(t + 3)
    w.set("sensor.grid", "800", W)  # cleared, but only judged at t + 10
    assert w.b()["phase"] == "limit"
    w.advance(t + 10)
    assert w.b()["phase"] == "waiting" and w.b()["until"] == int((t + 25) * 1000)
    w.advance(t + 24.9)
    assert w.calls == [OFF]
    w.advance(t + 25)
    assert w.calls == [OFF, ON]


def test_blackout_inside_the_settle_time_switches_off_at_once():
    """Review focus 5."""
    w = switched_on()
    w.advance(1002)
    w.set("sensor.grid", "unavailable")
    assert w.calls == [ON, OFF] and w.b()["phase"] == "blackout"
    assert w.engine.snapshot("p")["r"]["last"]["reason"] == "blackout"


# --- 0.23.1: the pure module ----------------------------------------------------------------

def pure():
    """An auto boiler with a power limit whose relay was seen switching on at 100."""
    b = Boiler({"device": "b", "button": "btn", "grid": dict(GRID)}, {"b": BOILER, "btn": BUTTON},
               {"g": {"id": "g", "kind": "grid", "power": "sensor.grid"}})
    b.mode = "auto"
    b.relay_changed("off", True, True, 90.0)
    b.relay_changed("on", True, True, 100.0)
    return b


def test_pure_limit_is_not_judged_inside_the_settle_time_and_looks_again_at_its_end():
    b = pure()
    b.command("on", 99.0)
    assert b.auto(103.7, 2054.0, 0.0, "on") == (None, "auto")
    assert b.phase == "heating" and b.until == 110.0
    assert b.trace(2054.0, 0.0, "on")["until"] == 159000  # the trace keeps the 60 s grace


def test_pure_limit_is_judged_once_the_settle_time_is_over():
    b = pure()
    b.command("on", 99.0)
    assert b.auto(110.0, 2054.0, 0.0, "on") == ("off", "power limit")
    assert b.phase == "limit" and b.holding


def test_pure_a_holding_limit_stays_inside_the_settle_time():
    b = pure()
    b.relay_changed("off", True, True, 105.0)
    b.phase, b.holding, b.last_off, b.cmd = "limit", True, 104.0, "off"
    assert b.auto(108.0, 1000.0, 0.0, "off") == (None, "")
    assert b.phase == "limit" and b.holding and b.last_off == 104.0 and b.until == 115.0
    assert "until" not in b.trace(1000.0, 0.0, "off")
    assert b.auto(115.0, 1000.0, 0.0, "off") == (None, "")
    assert b.phase == "waiting" and not b.holding and b.last_off == 115.0 and b.until == 130.0


def test_pure_waiting_looks_again_no_later_than_the_settle_end():
    b = pure()
    b.relay_changed("off", True, True, 100.0)
    b.command("off", 100.0)
    assert b.auto(102.0, 2110.0, 0.0, "off") == (None, "")
    assert b.phase == "waiting" and b.until == 110.0
    assert b.trace(2110.0, 0.0, "off")["until"] == 115000


def test_pure_blackout_is_not_delayed():
    b = pure()
    assert b.auto(101.0, None, 0.0, "on") == ("off", "blackout")
    assert b.phase == "blackout"


@pytest.mark.parametrize("readings", [
    [("on", 100.0)],  # the first reading
    [("off", 90.0), (None, 95.0), ("on", 100.0)],  # back from no data
    [("on", 100.0), ("on", 101.0)],  # no change
])
def test_pure_no_settle_time_without_a_switch_between_on_and_off(readings):
    b = Boiler({"device": "b", "button": "btn", "grid": dict(GRID)}, {"b": BOILER, "btn": BUTTON},
               {"g": {"id": "g", "kind": "grid", "power": "sensor.grid"}})
    b.mode = "auto"
    for relay, at in readings:
        b.relay_changed(relay, True, True, at)
    assert b.auto(102.0, 2054.0, 0.0, "on") == ("off", "power limit")


def test_pure_without_a_power_limit_nothing_changes():
    b = Boiler({"device": "b", "button": "btn"}, {"b": BOILER, "btn": BUTTON}, {})
    b.mode = "auto"
    b.relay_changed("off", True, True, 90.0)
    b.relay_changed("on", True, True, 100.0)
    b.command("on", 99.0)
    assert b.auto(102.0, None, 0.0, "on") == (None, "auto") and b.until == 159.0


def test_pure_an_unchanged_save_keeps_the_change_time():
    old = pure()
    new = Boiler({"device": "b", "button": "btn", "grid": dict(GRID)}, {"b": BOILER, "btn": BUTTON},
                 {"g": {"id": "g", "kind": "grid", "power": "sensor.grid"}})
    new.take(old)
    assert new.auto(103.0, 2054.0, None, "on") == (None, "auto") and new.until == 110.0


def test_unchanged_save_inside_the_settle_time_keeps_it():
    w = switched_on()
    w.advance(1003)
    w.engine.load_plans([boiler_plan()])
    w.set("sensor.grid", "2054", W)
    assert w.calls == [ON] and w.b()["phase"] == "heating"
