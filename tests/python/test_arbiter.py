"""Shared on / off devices (spec timed switch §10): automations that keep a device on by their own state hold it; the
device gets `on` when the holders turn from none to some and `off` when they turn back, nothing in between."""

import pytest

from test_boiler import BOILER, GRID, W, boiler_rule
from test_rules import dev, rule
from test_timed import BUTTON, LIGHT, MIN, OFF, ON, VENT, TWorld, timed_rule

WC = dev("wc", "climate_sensor", "WC", temperature="sensor.wc_t", humidity="sensor.wc_h")
WC2 = dev("wc2", "climate_sensor", "Bath", temperature="sensor.b_t", humidity="sensor.b_h")
MAIN = dev("main", "climate_sensor", "Main", temperature="sensor.m_t", humidity="sensor.m_h")
MOTION = dev("m", "motion_sensor", "Motion", motion="binary_sensor.m")
BTN = dev("bb", "smart_button", "Button boiler", action="sensor.bb")
C = {"unit_of_measurement": "°C"}
P = {"unit_of_measurement": "%"}
WET, DRY = "80", "40"
L_ON, L_OFF = ("light", "turn_on", "light.l"), ("light", "turn_off", "light.l")
R_ON, R_OFF = ("switch", "turn_on", "switch.relay"), ("switch", "turn_off", "switch.relay")


def vent_rule(rid="vr", name="WC vent", fan="v", run_on=0, sensor="wc", **extra):
    return rule(rid, [], name=name, on_true=[(fan, "on")], on_false=[(fan, "off")], off_delay=run_on,
                vent={"sensor": sensor, "than": "main", "above": 9, "below": 5}, **extra)


def vent_timed(rid="r", name="Vent (10min)", minutes=10, **kw):
    return timed_rule(rid, name=name, minutes=minutes, **kw)


def pair_rule(rid="cr", name="Motion light", device="l", **kw):
    return rule(rid, ["m"], name=name, on_true=[(device, "on")], on_false=[(device, "off")], **kw)


class AWorld(TWorld):
    def __init__(self, wc=DRY, **states):
        base = {"sensor__wc_t": ("24", C), "sensor__wc_h": (wc, P), "sensor__m_t": ("22", C),
                "sensor__m_h": ("50", P),
                "sensor__b_t": ("24", C), "sensor__b_h": (DRY, P), "binary_sensor__m": "off", "switch__relay": "off",
                "sensor__bp": ("0", W), "sensor__grid": ("500", W)}
        base.update(states)
        super().__init__(**base)

    def load(self, rules, boot=False, runs=None):
        p = {"id": "p", "rules": rules, "levels": [{"id": "l1", "devices": [
            VENT, BUTTON, LIGHT, WC, WC2, MAIN, MOTION, BOILER, BTN]}],
             "power": {"blocks": [{"id": "g", "kind": "grid", "power": "sensor.grid"}], "wires": []}}
        self.engine.load_plans([p], boot=boot, runs=runs)

    def wet(self):
        self.set("sensor.wc_h", WET)

    def dry(self):
        self.set("sensor.wc_h", DRY)

    def last(self, rid):
        return self.tr(rid).get("last")


def world(rules=None, wc=DRY, **states):
    w = AWorld(wc=wc, **states)
    w.load(rules if rules is not None else [vent_rule(), vent_timed()])
    return w


# --- the plan's list ------------------------------------------------------------------

def test_vent_true_then_a_timed_run_sends_one_on():
    w = world()
    assert w.calls == [OFF]  # vent start: false, nobody holds -> off (start both ways)
    w.calls.clear()
    w.wet()
    w.set("fan.vent", "on", own=True)
    w.start()
    assert w.calls == [ON] and w.tm()["running"] is True
    assert w.last("r") == {"action": "on", "target": "Vent", "at": 1000000, "reason": "already on by WC vent",
                           "sent": False}


def test_a_timed_run_then_vent_true_sends_one_on():
    w = world()
    w.calls.clear()
    w.start()
    w.set("fan.vent", "on", own=True)
    w.wet()
    assert w.calls == [ON]
    assert w.last("vr")["reason"] == "already on by Vent (10min)" and w.last("vr")["sent"] is False


def test_vent_false_during_the_run_sends_no_off_and_says_who_keeps_it_on():
    w = world(wc=WET)
    w.set("fan.vent", "on", own=True)
    w.start()
    w.calls.clear()
    w.dry()
    assert w.calls == [] and w.tr("vr")["verdict"] is False
    assert w.last("vr") == {"action": "off", "target": "Vent", "at": 1000000, "reason": "kept on by Vent (10min)",
                            "sent": False}
    w.advance(1000 + 10 * MIN)  # the run ends, nobody holds: one off
    assert w.calls == [OFF] and w.last("r")["reason"] == "time over" and "sent" not in w.last("r")


def test_the_run_ending_while_vent_is_true_sends_no_off():
    w = world()
    w.start()
    w.set("fan.vent", "on", own=True)
    w.wet()
    w.calls.clear()
    w.advance(1000 + 10 * MIN)
    assert w.calls == [] and w.tm()["running"] is False
    assert w.last("r")["reason"] == "kept on by WC vent" and w.last("r")["action"] == "off"
    w.dry()  # both released: one off
    assert w.calls == [OFF] and "sent" not in w.last("vr")


def test_both_release_sends_one_off_whatever_the_order():
    w = world()
    w.start()
    w.set("fan.vent", "on", own=True)
    w.wet()
    w.dry()  # vent releases first: kept on
    assert w.calls == [OFF, ON]  # the start-up off, the run's on
    w.advance(1000 + 10 * MIN)
    assert w.calls == [OFF, ON, OFF]


def test_a_timed_restart_while_vent_wants_on_sends_nothing():
    w = world(wc=WET)
    w.set("fan.vent", "on", own=True)
    w.start()
    w.advance(1000 + 5 * MIN)
    w.start()
    assert w.calls == [ON] and w.tm()["until"] == (1000 + 15 * MIN) * 1000
    assert w.last("r")["reason"] == "already on by WC vent"


def test_a_timed_stop_while_vent_wants_on_ends_the_run_and_sends_no_off():
    w = world(wc=WET)
    w.set("fan.vent", "on", own=True)
    w.start()
    w.calls.clear()
    w.stop()
    assert w.calls == [] and w.tm()["running"] is False and w.tr("r")["verdict"] is False
    assert w.last("r") == {"action": "off", "target": "Vent", "at": 1000000, "reason": "kept on by WC vent",
                           "sent": False}




def test_two_vent_rules_on_one_fan():
    w = world([vent_rule(), vent_rule("vr2", "Bath vent", sensor="wc2")])
    assert w.calls == [OFF]  # both start dry in one load: one off, the final state
    w.calls.clear()
    w.wet()
    w.set("fan.vent", "on", own=True)
    w.set("sensor.b_h", WET)
    assert w.calls == [ON] and w.last("vr2")["reason"] == "already on by WC vent"
    w.dry()
    assert w.calls == [ON] and w.last("vr")["reason"] == "kept on by Bath vent"
    w.set("sensor.b_h", DRY)
    assert w.calls == [ON, OFF] and "sent" not in w.last("vr2")


def test_the_vent_run_on_keeps_holding():
    w = world([vent_rule(run_on=15 * MIN), vent_timed()], wc=WET)
    w.set("fan.vent", "on", own=True)
    w.start()
    w.dry()  # run-on until 1000 + 15 min: the vent still holds
    w.advance(1000 + 10 * MIN)
    assert w.calls == [ON] and w.last("r")["reason"] == "kept on by WC vent"
    w.advance(1000 + 15 * MIN)
    assert w.calls == [ON, OFF] and w.tr("vr")["verdict"] is False


def test_holders_are_in_the_trace():
    w = world(wc=WET)
    assert w.tr("vr")["holders"] == ["WC vent"] and w.tr("r")["holders"] == ["WC vent"]
    w.start()
    assert w.tr("vr")["holders"] == ["WC vent", "Vent (10min)"]
    w.dry()
    w.stop()
    assert "holders" not in w.tr("vr") and "holders" not in w.tr("r")


# --- start / Save --------------------------------------------------------------------

def test_a_restored_run_at_ha_start_keeps_the_fan_on_against_a_dry_vent():
    w = AWorld(fan__vent="on")
    w.load([vent_rule(), vent_timed()], boot=True, runs={"p": {"r": 1000 + 5 * MIN}})
    assert w.calls == [] and w.last("vr")["reason"] == "kept on by Vent (10min)"
    w.engine.started()
    assert w.calls == [] and w.tm()["running"] is True
    w.advance(1000 + 5 * MIN)
    assert w.calls == [OFF]


def test_a_save_adding_a_dry_vent_while_the_run_is_active_sends_no_off():
    w = world([vent_timed()])
    w.start()
    w.set("fan.vent", "on", own=True)
    w.load([vent_rule(), vent_timed()])
    assert w.calls == [ON] and w.last("vr")["reason"] == "kept on by Vent (10min)"


def test_a_save_adding_a_wet_vent_while_idle_sends_on():
    w = world([vent_timed()])
    w.load([vent_rule(), vent_timed()])
    w.wet()
    assert w.calls == [OFF, ON]  # the dry start, then wet


def test_an_unchanged_save_sends_nothing_and_keeps_the_holders():
    w = world(wc=WET)
    w.start()
    w.calls.clear()
    w.load([vent_rule(name="renamed"), vent_timed()])
    assert w.calls == [] and w.tr("r")["holders"] == ["renamed", "Vent (10min)"]


def test_deleting_a_running_timed_rule_while_vent_holds_sends_no_off():
    w = world(wc=WET)
    w.set("fan.vent", "on", own=True)
    w.start()
    w.calls.clear()
    w.load([vent_rule()])
    assert w.calls == []
    w.dry()
    assert w.calls == [OFF]


def test_disabling_a_running_timed_rule_while_vent_holds_sends_no_off():
    w = world(wc=WET)
    w.set("fan.vent", "on", own=True)
    w.start()
    w.calls.clear()
    w.load([vent_rule(), vent_timed(enabled=False)])
    assert w.calls == [] and w.last("r")["reason"] == "kept on by WC vent"


# --- waiting for the device ----------------------------------------------------------

def test_unavailable_during_changes_one_resend_of_the_current_desired():
    """The vent's on waits; the run starts (already on); the vent goes dry (kept on): one on when the fan returns."""
    w = world(fan__vent="unavailable")
    w.calls.clear()
    w.wet()
    t = w.tr("vr")
    assert w.calls == [ON] and t["status"] == "error" and t["reason"] == "target unavailable"
    w.start()
    w.dry()
    assert w.calls == [ON] and w.tr("r")["reason"] == "target unavailable"  # the holder shows the wait
    assert w.tr("vr")["status"] == "ok"
    w.set("fan.vent", "off")
    assert w.calls == [ON, ON] and w.tm()["running"] is True
    w.set("fan.vent", "on", own=True)
    assert w.tr("r")["status"] == "ok" and w.tm()["running"] is True
    w.set("fan.vent", "off", own=True)
    assert w.calls == [ON, ON]


def test_a_newer_arbitrated_command_replaces_the_waiting_one():
    """The vent's off waits; the run's on replaces it: only the on is sent when the fan returns."""
    w = world(fan__vent="unavailable")
    assert w.calls == [OFF]
    w.start()
    w.set("fan.vent", "off")
    assert w.calls == [OFF, ON, ON]
    assert w.last("vr")["error"] == "target unavailable"  # given up


def test_a_run_ending_while_kept_on_hands_the_waiting_on_to_the_holder():
    w = world(fan__vent="unavailable")
    w.calls.clear()
    w.start()
    w.wet()
    w.advance(1000 + 10 * MIN)
    assert w.calls == [ON] and w.last("r")["reason"] == "kept on by WC vent"
    assert w.tr("vr")["reason"] == "target unavailable" and w.tr("r")["status"] == "ok"
    w.set("fan.vent", "off")
    assert w.calls == [ON, ON]


def test_the_waiting_on_is_given_up_when_nobody_holds_after_a_save():
    w = world(fan__vent="unavailable", wc=WET)
    w.load([vent_timed()])  # the vent rule is deleted: its waiting on is stale
    w.set("fan.vent", "off")
    assert w.calls == [ON]


def test_a_delivered_on_is_not_sent_again_after_a_power_loss():
    w = world(wc=WET)
    w.set("fan.vent", "on", own=True)
    w.start()
    w.set("fan.vent", "unavailable")
    w.calls.clear()
    w.set("fan.vent", "off")  # power loss: no data, then off (not a human)
    assert w.calls == [] and w.tm()["running"] is True  # as before: only a waiting command is sent again


# --- not participants ------------------------------------------------------------------

def test_an_inverted_run_commands_directly_while_vent_holds():
    w = world([vent_rule(), vent_timed(invert=True)], wc=WET)
    w.set("fan.vent", "on", own=True)
    w.calls.clear()
    w.start()
    assert w.calls == [OFF] and "holders" in w.tr("vr") and "holders" not in w.tr("r")
    w.advance(1000 + 10 * MIN)
    assert w.calls == [OFF, ON]


def test_a_one_sided_condition_rule_commands_directly():
    w = world([vent_rule(), vent_timed(), rule("x", ["m"], name="Off on motion", on_true=[("v", "off")])])
    w.start()
    w.set("fan.vent", "on", own=True)
    w.calls.clear()
    w.set("binary_sensor.m", "on")
    assert w.calls == [OFF] and w.tm()["running"] is True  # own context: the run goes on


def test_a_human_switching_off_ends_the_run_and_the_vent_stays_edge_only():
    w = world(wc=WET)
    w.set("fan.vent", "on", own=True)
    w.start()
    w.calls.clear()
    w.set("fan.vent", "off")  # a human
    assert w.calls == [] and w.tm()["running"] is False
    assert w.last("r")["reason"] == "ended: switched elsewhere"
    w.dry()
    assert w.calls == [OFF]


# --- condition rules with on and off for the same device --------------------------------

def test_a_condition_pair_rule_holds_its_light_against_a_timed_switch():
    w = world([pair_rule(), vent_timed(device="l")])
    assert w.calls == [L_OFF]
    w.set("binary_sensor.m", "on")
    w.set("light.l", "on", own=True)
    w.start()
    assert w.calls == [L_OFF, L_ON] and w.last("r")["reason"] == "already on by Motion light"
    w.set("binary_sensor.m", "off")
    assert w.calls == [L_OFF, L_ON] and w.last("cr")["reason"] == "kept on by Vent (10min)"
    w.advance(1000 + 10 * MIN)
    assert w.calls == [L_OFF, L_ON, L_OFF]


def test_a_gated_pair_rule_holds_only_while_its_gate_is_open():
    gate = dev("g", "motion_sensor", "Gate", motion="binary_sensor.g")
    w = AWorld(binary_sensor__g="off")
    p = {"id": "p", "rules": [pair_rule(gate={"source": {"device": "g"}}), vent_timed(device="l")],
         "levels": [{"id": "l1", "devices": [LIGHT, MOTION, BUTTON, gate]}]}
    w.engine.load_plans([p], boot=False)
    w.set("binary_sensor.m", "on")  # true, gate closed: no action, no hold
    w.start()
    assert w.calls == [L_ON] and w.tr("r")["holders"] == ["Vent (10min)"]


# --- boiler ---------------------------------------------------------------------------

def boiler_world(**states):
    w = AWorld(**states)
    w.load([boiler_rule(GRID, rid="b", button="bb"), pair_rule(device="b")])
    return w


def test_a_heating_boiler_holds_its_relay_against_a_pair_rule():
    w = boiler_world()
    assert w.calls == [R_OFF]  # the pair rule's start
    w.engine.on_intent("p", "bb", {"action": "auto"})
    w.set("switch.relay", "on", own=True)
    assert w.calls == [R_OFF, R_ON] and w.tr("b")["boiler"]["phase"] == "heating"
    w.set("binary_sensor.m", "on")
    assert w.calls == [R_OFF, R_ON] and w.last("cr")["reason"] == "already on by Boiler"
    assert w.tr("cr")["holders"] == ["Boiler", "Motion light"]
    w.set("binary_sensor.m", "off")
    assert w.calls == [R_OFF, R_ON] and w.last("cr")["reason"] == "kept on by Boiler"


def test_a_boiler_heating_done_off_is_kept_on_by_a_pair_rule_and_the_last_release_sends_off():
    w = boiler_world()
    w.engine.on_intent("p", "bb", {"action": "auto"})
    w.set("switch.relay", "on", own=True)
    w.set("sensor.bp", "1380", W)
    w.set("binary_sensor.m", "on")
    w.advance(w.t + 60)
    w.calls.clear()
    w.set("sensor.bp", "0", W)  # heating done: the boiler stops holding
    assert w.calls == [] and w.last("b")["reason"] == "kept on by Motion light"
    assert w.tr("b")["boiler"]["phase"] == "done"
    w.set("binary_sensor.m", "off")
    assert w.calls == [R_OFF]


def test_boiler_button_commands_stay_direct():
    w = boiler_world()
    w.set("binary_sensor.m", "on")
    w.set("switch.relay", "on", own=True)
    w.calls.clear()
    w.engine.on_intent("p", "bb", {"action": "set", "value": "off"})
    assert w.calls == [R_OFF] and w.tr("b")["boiler"]["mode"] == "manual"


def test_deleting_an_auto_boiler_while_a_pair_rule_holds_sends_no_off():
    w = boiler_world()
    w.engine.on_intent("p", "bb", {"action": "auto"})
    w.set("switch.relay", "on", own=True)
    w.set("binary_sensor.m", "on")
    w.calls.clear()
    w.load([pair_rule(device="b")])
    assert w.calls == []


# --- fix wave: send what the device actually needs ---------------------------------------

def test_f1_a_start_after_a_human_off_switches_the_fan_on_although_vent_holds():
    """B1: vent and run hold, a human switches off (the run ends); a new press must switch the fan on."""
    w = world(wc=WET)
    w.set("fan.vent", "on", own=True)
    w.start()
    w.set("fan.vent", "off")  # a human
    w.calls.clear()
    w.start()
    assert w.calls == [ON] and "sent" not in w.last("r")


def test_f1_only_the_vent_holds_and_the_fan_is_off():
    w = world(wc=WET)
    w.set("fan.vent", "on", own=True)
    w.set("fan.vent", "off")  # a human
    w.calls.clear()
    w.start()
    assert w.calls == [ON]


def test_f1_an_on_on_its_way_is_not_sent_twice():
    w = world()
    w.calls.clear()
    w.wet()  # on sent, the fan has not confirmed yet
    w.start()
    assert w.calls == [ON] and w.last("r")["reason"] == "already on by WC vent"


def test_f1_restart_with_a_stored_run_and_the_fan_off_at_boot_switches_it_on():
    """B2: a power cut: the fan reads off at boot, the run is restored and WC is wet."""
    w = AWorld(wc=WET, fan__vent="off")
    w.load([vent_rule(), vent_timed()], boot=True, runs={"p": {"r": 1000 + 5 * MIN}})
    w.engine.started()
    assert w.calls == [ON]


def test_f1_restart_with_a_stored_run_and_the_fan_unavailable_at_boot_switches_it_on_when_back():
    w = AWorld(wc=WET, fan__vent="unavailable")
    w.hold = True  # calls before HA has started are held (live.py)
    w.load([vent_rule(), vent_timed()], boot=True, runs={"p": {"r": 1000 + 3 * MIN}})
    w.engine.started()
    assert w.calls == [ON]
    w.on_error("target unavailable", "target unavailable")  # live.py: the held call found the fan unavailable
    w.hold = False
    w.set("fan.vent", "off")
    assert w.calls == [ON, ON]


def test_f1_boiler_auto_switches_the_relay_on_although_a_pair_rule_holds():
    w = boiler_world()
    w.set("binary_sensor.m", "on")
    w.set("switch.relay", "on", own=True)
    w.set("switch.relay", "off")  # a human
    w.calls.clear()
    w.engine.on_intent("p", "bb", {"action": "auto"})
    assert w.calls == [R_ON] and w.tr("b")["boiler"]["phase"] == "heating"


@pytest.mark.parametrize("save", ["delete", "disable"])
def test_f2_deleting_the_last_holder_pays_the_kept_off(save):
    """B4: the run ended kept on by the vent; the vent rule goes away: the fan goes off."""
    w = world()
    w.start()
    w.set("fan.vent", "on", own=True)
    w.wet()
    w.advance(1000 + 10 * MIN)
    assert w.last("r")["reason"] == "kept on by WC vent"
    w.calls.clear()
    w.load([vent_timed()] if save == "delete" else [vent_rule(enabled=False), vent_timed()])
    assert w.calls == [OFF]
    assert w.last("r")["action"] == "off" and "sent" not in w.last("r")


def gated_world(g="on"):
    gate = dev("g", "motion_sensor", "Gate", motion="binary_sensor.g")
    w = AWorld(binary_sensor__g=g)
    p = {"id": "p", "rules": [pair_rule(gate={"source": {"device": "g"}}), vent_timed(device="l")],
         "levels": [{"id": "l1", "devices": [LIGHT, MOTION, BUTTON, gate]}]}
    w.engine.load_plans([p], boot=False)
    return w


def test_f2_a_gate_closing_on_the_last_holder_pays_the_kept_off():
    """B3: the run ended kept on by the gated pair rule; its gate closes: the light goes off."""
    w = gated_world()
    w.set("binary_sensor.m", "on")
    w.set("light.l", "on", own=True)
    w.start()
    w.advance(1000 + 10 * MIN)
    assert w.last("r")["reason"] == "kept on by Motion light"
    w.calls.clear()
    w.set("binary_sensor.g", "off")
    assert w.calls == [L_OFF]


def test_f2_a_gate_closing_with_no_kept_off_sends_nothing():
    """B3b: a closed gate means no actions."""
    w = gated_world()
    w.set("binary_sensor.m", "on")
    w.set("light.l", "on", own=True)
    w.calls.clear()
    w.set("binary_sensor.g", "off")
    w.set("binary_sensor.m", "off")
    assert w.calls == []


def test_f2_a_kept_off_is_paid_once_and_not_when_the_device_is_off_already():
    w = world()
    w.start()
    w.set("fan.vent", "on", own=True)
    w.wet()
    w.advance(1000 + 10 * MIN)
    w.set("fan.vent", "off")  # a human did it already
    w.calls.clear()
    w.load([vent_timed()])
    assert w.calls == []


def test_releases_at_load_run_after_the_new_rules_are_evaluated():
    """B5: one Save deletes the running timed rule and edits the wet vent rule: no off-then-on."""
    w = world(wc=WET)
    w.set("fan.vent", "on", own=True)
    w.start()
    w.calls.clear()
    w.load([vent_rule(run_on=60)])
    assert OFF not in w.calls


@pytest.mark.parametrize("bath,calls", [(DRY, [OFF]), (WET, [ON])])
def test_two_participants_starting_in_one_load_send_only_the_final_state(bath, calls):
    w = AWorld(fan__vent="on", sensor__b_h=(bath, P))
    w.load([vent_rule(), vent_rule("vr2", "Bath vent", sensor="wc2")])
    assert w.calls == calls
    if bath == WET:
        assert w.last("vr")["reason"] == "kept on by Bath vent" and w.last("vr")["sent"] is False


def test_a_stored_auto_boiler_holds_during_the_boot_phase():
    w = AWorld(switch__relay="on")
    w.engine.load_plans([{"id": "p", "rules": [boiler_rule(GRID, rid="b", button="bb"), pair_rule(device="b")],
                          "levels": [{"id": "l1", "devices": [BOILER, BTN, MOTION]}],
                          "power": {"blocks": [{"id": "g", "kind": "grid", "power": "sensor.grid"}], "wires": []}}],
                        boot=True, modes={"p": {"b": "auto"}})
    assert w.calls == [] and w.last("cr")["reason"] == "kept on by Boiler"
    w.engine.started()
    assert w.calls == [] and w.tr("b")["boiler"]["phase"] == "heating"


def test_a_boiler_blackout_off_is_a_safety_command_sent_although_a_pair_rule_holds():
    w = boiler_world()
    w.engine.on_intent("p", "bb", {"action": "auto"})
    w.set("switch.relay", "on", own=True)
    w.set("binary_sensor.m", "on")
    w.calls.clear()
    w.set("sensor.grid", "unavailable")
    assert w.calls == [R_OFF] and w.last("b")["reason"] == "blackout" and "sent" not in w.last("b")
    w.set("switch.relay", "off", own=True)
    w.set("sensor.grid", "500", W)  # grid back: after the 15 s wait the boiler heats again
    w.advance(w.t + 15)
    assert w.calls == [R_OFF, R_ON]


def test_a_boiler_limit_off_is_sent_although_a_pair_rule_holds():
    w = boiler_world()
    w.engine.on_intent("p", "bb", {"action": "auto"})
    w.set("switch.relay", "on", own=True)
    w.set("binary_sensor.m", "on")
    w.calls.clear()
    w.set("sensor.grid", "4000", W)
    assert w.calls == [R_OFF] and w.tr("b")["boiler"]["phase"] == "limit"
