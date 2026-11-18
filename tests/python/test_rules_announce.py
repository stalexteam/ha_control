"""Announcements (say, play, notify) in the condition and load control rules of the pure rule engine: one-shot calls
with service data, never a holder slot, never an expected state, never re-sent, never at a load or while HA starts."""

import pytest

from control import Control
from test_control import BTN, CWorld, L1, PIR as CPIR, TOGGLE, SET_ON, btn, off, on, src
from test_rules import World, dev, neg, plan, ref, rule, trace

SPK = {"id": "sp", "name": "Speaker", "props": {"kind": "speaker"},
       "bindings": {"player": "media_player.vlc", "voice": "tts.piper"}}
MUTE = {"id": "mute", "name": "Mute", "props": {"kind": "speaker"}, "bindings": {"player": "media_player.vlc"}}
PHONE = {"id": "ph", "name": "Phone", "props": {"kind": "phone", "notify": "mobile_app_phone"}, "bindings": {}}
PIR = dev("m", "motion_sensor", "Motion", motion="binary_sensor.m")
LIGHT = dev("l", "ceiling_light", "Light", control="light.l")
MP3 = "media-source://media_source/local/Auto.mp3"
SAY = {"device": "sp", "do": "say", "text": "Go bathe"}
PLAY = {"device": "sp", "do": "play", "media": MP3}
NOTE = {"device": "ph", "do": "notify", "text": "Go bathe", "title": "Boiler"}
SPEAK = ("tts", "speak", "tts.piper", {"media_player_entity_id": "media_player.vlc", "message": "Go bathe"})
SOUND = ("media_player", "play_media", "media_player.vlc", {"media_content_id": MP3, "media_content_type": "music"})
PUSH = ("notify", "mobile_app_phone", None, {"message": "Go bathe", "title": "Boiler"})
DEVICES = [PIR, LIGHT, SPK, MUTE, PHONE]


def world(**states):
    return World(**{"binary_sensor__m": "off", "media_player__vlc": "idle", "light__l": "off", **states})


def load(w, rules, devices=DEVICES, boot=False):
    w.engine.load_plans([plan(devices, rules)], boot=boot)


def cond(on_true=(), on_false=(), inputs=("m",), rid="r", **extra):
    return rule(rid, list(inputs), onTrue=list(on_true), onFalse=list(on_false), **extra)


# --- condition rules ---------------------------------------------------------------

def test_a_condition_rule_turning_true_says_plays_and_notifies_once_with_the_service_data():
    w = world()
    load(w, [cond([SAY, PLAY, NOTE])])
    assert w.calls == []
    w.set("binary_sensor.m", "on")
    assert w.calls == [SPEAK, SOUND, PUSH]
    t = trace(w)
    assert t["status"] == "ok"
    assert t["last"] == {"action": "notify", "target": "Phone", "at": 1000000, "reason": "became true: Motion motion"}
    w.set("binary_sensor.m", "on", {"x": 1})  # an attribute update: no new edge
    assert len(w.calls) == 3
    w.set("binary_sensor.m", "off")
    w.set("binary_sensor.m", "on")  # a new edge: once more
    assert w.calls == [SPEAK, SOUND, PUSH] * 2


def test_a_notify_without_a_title_sends_the_message_only_and_when_false_runs_its_own_list():
    w = world(binary_sensor__m="on")
    note = {"device": "ph", "do": "notify", "text": "  All clear "}
    load(w, [cond(on_false=[note])])
    w.set("binary_sensor.m", "off")
    assert w.calls == [("notify", "mobile_app_phone", None, {"message": "All clear"})]


@pytest.mark.parametrize("player", ["unavailable", "unknown", None])
def test_a_player_without_data_is_target_unavailable_nothing_sent_and_nothing_when_it_returns(player):
    w = world(media_player__vlc=player or "idle")
    if player is None:
        w.states.pop("media_player.vlc")
    load(w, [cond([SAY, PLAY, NOTE])])
    w.set("binary_sensor.m", "on")
    assert w.calls == [PUSH]  # notify has no entity: always sent
    t = trace(w)
    assert t["status"] == "error" and t["reason"] == "target unavailable"
    assert t["last"] == {"action": "say", "target": "Speaker", "at": 1000000, "reason": "became true: Motion motion",
                         "error": "target unavailable"}
    w.set("media_player.vlc", "idle")
    w.set("tts.piper", "unknown")
    assert w.calls == [PUSH]  # never re-sent
    assert "media_player.vlc" not in w.engine.entity_ids() and "tts.piper" not in w.engine.entity_ids()


def test_a_failed_call_is_service_failed_and_never_retried():
    w = world()
    w.fail = {"tts.piper"}
    load(w, [cond([SAY, PLAY])])
    w.set("binary_sensor.m", "on")
    assert w.calls == [SPEAK, SOUND]  # one failing call does not stop the next
    t = trace(w)
    assert t["status"] == "error" and t["reason"] == "service failed"
    assert t["last"]["action"] == "say" and t["last"]["error"] == "service failed"
    w.set("media_player.vlc", "playing")
    w.set("media_player.vlc", "idle")
    assert w.calls == [SPEAK, SOUND]


def test_a_late_failure_is_service_failed_for_its_firing_only():
    w = world()
    load(w, [cond([NOTE])])
    w.set("binary_sensor.m", "on")
    late = w.on_error
    late("boom")
    t = trace(w)
    assert t["status"] == "error" and t["reason"] == "service failed" and t["last"]["error"] == "service failed"
    w.set("binary_sensor.m", "off")
    w.set("binary_sensor.m", "on")  # a new firing
    first, w.calls[:] = w.on_error, []
    late("boom")  # the old firing's failure: ignored
    assert trace(w)["status"] == "ok" and "error" not in trace(w)["last"]
    first("boom")
    assert trace(w)["reason"] == "service failed"
    assert w.calls == []  # never sent again


def test_an_announcement_to_a_device_that_cannot_take_it_is_target_missing():
    w = world()
    load(w, [cond([{"device": "mute", "do": "say", "text": "x"}, {"device": "gone", "do": "play", "media": MP3},
                   {"device": "l", "do": "notify", "text": "x"}, PLAY])])
    t = trace(w)
    assert t["status"] == "error" and t["reason"] == "target missing"
    w.set("binary_sensor.m", "on")
    assert w.calls == [SOUND]
    assert [e.get("error") for e in w.engine._rules[("p", "r")].entries] == ["target missing"] * 3 + [None]


def said(w):
    """The announcement calls (the ones with service data)."""
    return [c for c in w.calls if len(c) == 4]


def test_no_announcement_at_a_load_or_a_save_or_at_the_rule_start():
    w = world(binary_sensor__m="on")
    r = cond([SAY, {"device": "l", "do": "on"}], [{"device": "l", "do": "off"}])
    load(w, [r])  # true at the start: the light is switched, nothing is said
    assert w.calls == [("light", "turn_on", "light.l")]
    load(w, [r])  # an unchanged Save
    load(w, [{**r, "onTrue": [{**SAY, "text": "Changed"}, {"device": "l", "do": "on"}]}])  # a changed Save: starts anew
    assert said(w) == [] and w.calls[-1] == ("light", "turn_on", "light.l")
    # an input known only later: its first verdict is the start too
    w2 = world(binary_sensor__m="unavailable")
    load(w2, [cond([SAY])])
    w2.set("binary_sensor.m", "on")
    assert w2.calls == []
    w2.set("binary_sensor.m", "off")
    w2.set("binary_sensor.m", "on")
    assert w2.calls == [SPEAK]


def test_no_announcement_from_a_verdict_change_inside_a_load():
    """A Save restarts rule a; the unchanged rule b reading it changes its verdict inside the load: no announcement."""
    w = world(binary_sensor__m="on")
    a, b = rule("a", ["m"]), rule("b", [ref("a")], onFalse=[SAY])
    load(w, [a, b])
    assert trace(w, "b")["verdict"] is True
    load(w, [{**a, "inputs": [neg("m")]}, b])
    assert trace(w, "b")["verdict"] is False and w.calls == []
    w.set("binary_sensor.m", "off")
    w.set("binary_sensor.m", "on")  # a real change after the load: says
    assert w.calls == [SPEAK]


def test_no_announcement_while_ha_starts_and_none_replayed_after():
    w = world()
    load(w, [cond([SAY, {"device": "l", "do": "on"}], [{"device": "l", "do": "off"}])], boot=True)
    w.calls.clear()
    w.set("binary_sensor.m", "on")  # a real change while HA starts: the light only (live.py holds it)
    assert w.calls == [("light", "turn_on", "light.l")]
    w.engine.started()
    assert w.calls == [("light", "turn_on", "light.l")]
    w.set("binary_sensor.m", "off")
    w.set("binary_sensor.m", "on")
    assert w.calls[-2:] == [SPEAK, ("light", "turn_on", "light.l")] and said(w) == [SPEAK]


def test_a_say_beside_an_on_off_pair_keeps_the_slot_and_is_no_holder_target_or_command():
    w = world()
    load(w, [cond([{"device": "l", "do": "on"}, SAY], [{"device": "l", "do": "off"}])])
    rl = w.engine._rules[("p", "r")]
    assert rl.pairs == {"light.l"}
    w.set("binary_sensor.m", "on")
    assert w.calls == [("light", "turn_off", "light.l"), ("light", "turn_on", "light.l"), SPEAK]
    t = trace(w)
    assert t["holders"] == ["r"] and t["status"] == "ok"
    assert set(w.engine._holds) == {"light.l"}
    assert set(w.engine._commands) == {"light.l"}  # the expected state of the light only
    assert set(w.engine._targets) == {"light.l"}
    assert rl.sent == []  # nothing waits to be re-sent
    w.set("light.l", "on")
    w.set("binary_sensor.m", "off")
    assert w.calls[-1] == ("light", "turn_off", "light.l") and "holders" not in trace(w)


GATE = {"source": {"device": "g"}}
GATED = DEVICES + [dev("g", "motion_sensor", "Gate", motion="binary_sensor.g")]
LIGHT_ON, LIGHT_OFF = {"device": "l", "do": "on"}, {"device": "l", "do": "off"}
TURN_ON, TURN_OFF = ("light", "turn_on", "light.l"), ("light", "turn_off", "light.l")


def test_a_gate_opening_never_runs_an_announcement():
    """The gate re-applies the current verdict's on / off actions; an announcement only follows a real verdict change."""
    w = world(binary_sensor__g="off")
    load(w, [cond([SAY, LIGHT_ON], gate=GATE)], devices=GATED)
    w.set("binary_sensor.m", "on")
    assert w.calls == [] and trace(w)["held"] is True
    w.set("binary_sensor.g", "on")
    assert w.calls == [TURN_ON]
    w.set("binary_sensor.g", "off")
    w.set("binary_sensor.g", "unavailable")  # the gate sensor drops out and returns
    w.set("binary_sensor.g", "on")
    assert said(w) == []
    w.set("binary_sensor.m", "off")
    w.set("binary_sensor.m", "on")  # a real change with the gate open
    assert said(w) == [SPEAK]


def test_no_announcement_when_the_gate_opens_after_a_restart():
    w = world(binary_sensor__m="on", binary_sensor__g="unknown")
    load(w, [cond([SAY], gate=GATE)], devices=GATED, boot=True)  # true at the start, the gate not known yet
    w.engine.started()
    w.set("binary_sensor.g", "on")
    assert said(w) == []


def test_no_announcement_when_the_gate_opens_after_a_changed_save():
    w = world(binary_sensor__g="off")
    r = cond([SAY], gate=GATE)
    load(w, [r], devices=GATED)
    w.set("binary_sensor.m", "on")  # true while the gate is closed: held
    load(w, [{**r, "onTrue": [{**SAY, "text": "Changed"}]}], devices=GATED)  # starts anew, true, gate closed
    w.set("binary_sensor.g", "on")
    w.set("binary_sensor.g", "off")
    w.set("binary_sensor.g", "on")
    assert said(w) == []


# --- a verdict change caused only by inputs returning from no data ------------------------------------

M2 = dev("m2", "motion_sensor", "Motion 2", motion="binary_sensor.m2")
SAY_LIGHT = dict(on_true=[SAY, LIGHT_ON], on_false=[PLAY, LIGHT_OFF], inputs=("m", "m2"))


def test_an_any_rule_whose_slow_input_reports_after_the_start_does_not_announce():
    w = world(binary_sensor__m2="unavailable")
    load(w, [cond(**SAY_LIGHT)], devices=DEVICES + [M2])
    w.calls.clear()
    w.set("binary_sensor.m2", "on")  # became true only because m2 has data now
    assert trace(w)["verdict"] is True
    assert w.calls == [TURN_ON]  # the on / off actions are unaffected


def test_an_input_blipping_unavailable_does_not_announce_a_real_change_does():
    w = world(binary_sensor__m="on", binary_sensor__m2="off")
    load(w, [cond(**SAY_LIGHT)], devices=DEVICES + [M2])
    w.calls.clear()
    w.set("binary_sensor.m", "unavailable")  # ANY ignores it: false by m2 alone
    assert trace(w)["verdict"] is False and w.calls == [TURN_OFF]
    w.set("binary_sensor.m", "on")  # back with the same value
    assert trace(w)["verdict"] is True and w.calls == [TURN_OFF, TURN_ON]
    w.set("binary_sensor.m", "off")  # a real change
    assert w.calls[-2:] == [SOUND, TURN_OFF]
    w.set("binary_sensor.m", "on")
    assert w.calls[-2:] == [SPEAK, TURN_ON] and said(w) == [SOUND, SPEAK]


def test_a_real_change_still_announces_after_a_blip_during_the_off_delay():
    w = world(binary_sensor__m="on", binary_sensor__m2="on")
    load(w, [cond([], [PLAY], inputs=("m", "m2"), combine="all", off_delay=60)], devices=DEVICES + [M2])
    w.set("binary_sensor.m", "off")  # really off: the off delay starts
    w.advance(1030)
    w.set("binary_sensor.m", "unavailable")  # unknown: the pending change is cancelled
    w.set("binary_sensor.m", "off")  # back, still off: the off delay starts again
    w.advance(1100)
    assert trace(w)["verdict"] is False and said(w) == [SOUND]


def test_a_rule_verdict_changed_only_by_a_return_from_no_data_announces_nowhere_downstream():
    x = cond(inputs=("m", "m2"), rid="x")
    y = rule("y", [ref("x")], onTrue=[SAY])
    lc = control([{"source": {"rule": "x"}}], on=[NOTE, LIGHT_ON], rid="lc")
    w = world(binary_sensor__m2="unavailable")
    load(w, [x, y, lc], devices=DEVICES + [M2])
    w.set("binary_sensor.m2", "on")  # x becomes true only because m2 has data now
    assert trace(w, "x")["verdict"] is True and trace(w, "y")["verdict"] is True
    assert said(w) == [] and w.calls[-1] == TURN_ON  # the load control rule still switches the light
    assert w.engine._rules[("p", "lc")].entries == [
        {"action": "on", "target": "Light", "at": 1000000, "reason": "x: on"}]
    w.set("binary_sensor.m2", "off")
    w.set("binary_sensor.m2", "on")  # a real change: both announce
    assert said(w) == [SPEAK, PUSH]


# --- load control -----------------------------------------------------------------

def control(sources, on=(), off=(), toggle=(), rid="r", **extra):
    """Actions: raw dicts or (device id, do)."""
    def acts(xs):
        return [a if isinstance(a, dict) else {"device": a[0], "do": a[1]} for a in xs]
    return rule(rid, [], name="Load control", control={"sources": list(sources), "on": acts(on), "off": acts(off),
                                                         "toggle": acts(toggle)}, **extra)


def cworld(rules, **states):
    w = CWorld(**{"media_player__vlc": "idle", **states})
    w.load(rules, [BTN, L1, CPIR, SPK, MUTE, PHONE])
    return w


def test_control_keeps_the_announcements_in_its_lists():
    c = Control({"sources": [btn("btn")], "on": [SAY, NOTE], "off": [], "toggle": [{"device": "l1", "do": "toggle"}, PLAY]}, {})
    assert c.lists == {"on": [("sp", "say"), ("ph", "notify")], "off": [], "toggle": [("l1", "toggle"), ("sp", "play")]}
    assert c.actions["on"] == [SAY, NOTE] and c.actions["toggle"][1] == PLAY


def test_load_control_on_and_off_events_run_the_announcements():
    w = cworld([control([src("pir")], on=[SAY, NOTE], off=[PLAY])])
    w.set("binary_sensor.pir", "on")
    assert w.calls == [SPEAK, PUSH]
    t = w.tr()
    assert t["status"] == "ok"
    assert t["last"] == {"action": "notify", "target": "Phone", "at": 1000000, "reason": "Motion: on"}
    w.set("binary_sensor.pir", "off")
    assert w.calls == [SPEAK, PUSH, SOUND]
    assert [d["id"] for d in t["control"]["devices"]] == []  # announcements have no device state to show


def test_load_control_toggle_list_runs_them_outside_the_on_off_group():
    w = cworld([control([btn("btn")], toggle=[("l1", "toggle"), PLAY])])
    w.press("btn", TOGGLE)
    assert w.calls == [on("switch.l1"), SOUND]
    w.set("switch.l1", "on", own=True)
    w.press("btn", TOGGLE)
    assert w.calls == [on("switch.l1"), SOUND, off("switch.l1"), SOUND]
    assert [e["action"] for e in w.engine._rules[("p", "r")].entries] == ["off", "play"]
    # alone in the toggle list
    w2 = cworld([control([btn("btn")], toggle=[PLAY])])
    w2.press("btn", TOGGLE)
    assert w2.calls == [SOUND]
    assert w2.tr()["control"]["devices"] == []


def test_load_control_player_without_data_and_a_failed_call():
    w = cworld([control([btn("btn")], on=[SAY, NOTE, ("l1", "on")])], media_player__vlc="unavailable")
    w.press("btn", SET_ON)
    assert w.calls == [PUSH, on("switch.l1")]
    t = w.tr()
    assert t["status"] == "error" and t["reason"] == "target unavailable"
    assert t["last"] == {"action": "say", "target": "Speaker", "at": 1000000, "reason": "Button: on",
                         "error": "target unavailable"}
    w.set("media_player.vlc", "idle")
    assert w.calls == [PUSH, on("switch.l1")]  # never re-sent
    w.fail = {"notify.mobile_app_phone"}
    w.calls.clear()
    w.press("btn", SET_ON)
    assert w.calls == [SPEAK, PUSH]  # the lamp is on its way already
    t = w.tr()
    assert t["reason"] == "service failed" and t["last"]["action"] == "notify" and t["last"]["error"] == "service failed"
    assert set(w.engine._commands) == {"switch.l1"} and "media_player.vlc" not in w.engine._echoes


def test_load_control_no_announcement_at_a_load_or_while_ha_starts():
    w = CWorld(media_player__vlc="idle", binary_sensor__pir="on")
    rules = [control([src("pir")], on=[SAY], off=[PLAY])]
    w.load(rules, [BTN, L1, CPIR, SPK, PHONE], boot=True)
    w.set("binary_sensor.pir", "off")
    w.press("btn", TOGGLE)
    assert w.calls == []
    w.engine.started()
    w.load([control([src("pir")], on=[{**SAY, "text": "Changed"}], off=[PLAY])], [BTN, L1, CPIR, SPK, PHONE])
    assert w.calls == []
    w.set("binary_sensor.pir", "on")
    assert w.calls == [("tts", "speak", "tts.piper", {"media_player_entity_id": "media_player.vlc", "message": "Changed"})]


# --- fix round 2: purpose-built verdicts are real; a never-known input's first value is its basis ------------

def test_a_timed_rule_started_by_a_button_is_a_real_change_downstream():
    """P8: a timed rule's verdict moves by a press, never through a commit: a consumer and a Load control rule-verdict
    source announce."""
    from test_timed import BUTTON as TIMED_BUTTON, VENT, timed_rule
    w = world(fan__vent="off")
    rules = [timed_rule("t"), rule("y", [ref("t")], onTrue=[SAY]), control([{"source": {"rule": "t"}}], on=[NOTE], rid="lc")]
    load(w, rules, devices=DEVICES + [TIMED_BUTTON, VENT])
    w.engine.on_intent("p", "btn", {"action": "set", "value": "on"})
    assert trace(w, "t")["verdict"] is True and trace(w, "y")["verdict"] is True
    assert said(w) == [SPEAK, PUSH]


def test_a_boiler_rule_entering_auto_is_a_real_change_downstream():
    from test_boiler import BWorld, boiler_plan, boiler_rule, BOILER, BUTTON as BOILER_BUTTON, WALL
    w = BWorld(media_player__vlc="idle")
    rules = [boiler_rule(), rule("y", [ref("r")], onTrue=[SAY]), control([{"source": {"rule": "r"}}], on=[NOTE], rid="lc")]
    w.engine.load_plans([boiler_plan(rules, [BOILER, BOILER_BUTTON, WALL, SPK, PHONE])], boot=False)
    w.press("auto")
    assert w.engine.snapshot("p")["r"]["verdict"] is True
    assert said(w) == [SPEAK, PUSH]


@pytest.mark.parametrize("how", ["restart", "changed save"])
def test_the_first_real_change_of_an_input_unknown_at_the_last_verdict_announces(how):
    """P9 / P9b: ANY [m, x]; m unknown at the start, then known off (no verdict change), then on: said."""
    w = world(binary_sensor__m="unavailable", binary_sensor__m2="off")
    r = cond([SAY], inputs=("m", "m2"))
    if how == "restart":
        load(w, [r], devices=DEVICES + [M2], boot=True)
        w.engine.started()
    else:
        w.states["binary_sensor.m"] = ("off", {})
        load(w, [{**r, "onTrue": [{**SAY, "text": "Old"}]}], devices=DEVICES + [M2])
        w.states["binary_sensor.m"] = ("unavailable", {})
        load(w, [r], devices=DEVICES + [M2])  # starts anew with m unknown
    w.set("binary_sensor.m", "off")  # m known now: no verdict change
    assert trace(w)["verdict"] is False and said(w) == []
    w.set("binary_sensor.m", "on")
    assert trace(w)["verdict"] is True and said(w) == [SPEAK]


# --- fix round 3: nothing at HA start; a motion light's sensor-return flip is not real ------------------------

def test_no_announcement_from_a_restored_timed_run_ending_at_ha_start():
    """S1: a timed run restored from the Store ended while HA was down: at started() the fan goes off, the consumers
    switch but announce nothing; a later press announces."""
    from test_timed import BUTTON as TIMED_BUTTON, VENT, timed_rule
    w = world(fan__vent="on")
    rules = [timed_rule("t"), rule("y", [ref("t")], onTrue=[SAY], onFalse=[PLAY]),
             control([{"source": {"rule": "t"}}], on=[NOTE], off=[{**NOTE, "text": "Off"}, LIGHT_OFF], rid="lc")]
    w.engine.load_plans([plan(DEVICES + [TIMED_BUTTON, VENT], rules)], boot=True, runs={"p": {"t": 900.0}})
    assert trace(w, "t")["verdict"] is True and trace(w, "y")["verdict"] is True
    w.states["light.l"] = ("on", {})  # so lc's off really switches it
    w.calls.clear()
    w.engine.started()
    assert ("fan", "turn_off", "fan.vent") in w.calls and TURN_OFF in w.calls  # the run ended, lc still switches
    assert trace(w, "y")["verdict"] is False and said(w) == []
    w.engine.on_intent("p", "btn", {"action": "set", "value": "on"})
    assert said(w) == [SPEAK, PUSH]


def ml_world(rules):
    from test_motion_light import DEVICES as ML_DEVICES, MWorld
    w = MWorld(media_player__vlc="idle")
    w.engine.load_plans([plan(ML_DEVICES + [SPK, PHONE], rules)], boot=False)
    return w


def test_known_limit_a_motion_light_flip_by_its_sensor_returning_counts_as_real():
    """Known limit (ruling, fix round 4): a light motion control verdict always counts as real downstream. A PIR dead
    longer than the off delay (no data = no motion: the light goes off) and back reporting on (the light goes on)
    announces both moves. Real motion changes announce too."""
    from test_motion_light import ml_rule
    w = ml_world([ml_rule(), rule("y", [ref("m")], onTrue=[SAY], onFalse=[PLAY]),
                  control([{"source": {"rule": "m"}}], on=[NOTE], rid="lc")])
    w.pir("on")  # real motion
    assert w.tr()["verdict"] is True and said(w) == [SPEAK, PUSH]
    w.pir("unavailable")
    w.advance(w.t + 181)
    assert w.tr()["verdict"] is False and said(w) == [SPEAK, PUSH, SOUND]
    w.pir("on")  # back with the same value: announced (the known limit)
    assert w.tr()["verdict"] is True and said(w) == [SPEAK, PUSH, SOUND, SPEAK, PUSH]
    w.pir("off")
    w.advance(w.t + 181)
    assert w.tr()["verdict"] is False and said(w)[-1] == SOUND
    w.pir("on")
    assert said(w)[-2:] == [SPEAK, PUSH]


def test_a_light_found_on_by_hand_then_off_after_the_off_delay_announces_both():
    """M4: switched on by hand without motion (found on, held), off after the off delay: both moves announce."""
    from test_motion_light import ml_rule
    w = ml_world([ml_rule(), rule("y", [ref("m")], onTrue=[SAY], onFalse=[PLAY]),
                  control([{"source": {"rule": "m"}}], off=[NOTE], rid="lc")])
    w.light("on")
    assert w.tr()["verdict"] is True and said(w) == [SPEAK]
    w.advance(w.t + 181)
    assert w.tr()["verdict"] is False and said(w) == [SPEAK, SOUND, PUSH]


@pytest.mark.parametrize("how", ["start", "changed save"])
def test_a_light_on_at_the_rule_start_then_real_motion_on_and_off_announces_the_off(how):
    """M5: the light reads on when the rule starts (HA start, a changed Save): held; real motion on, then off: the off
    after the off delay announces."""
    from test_motion_light import DEVICES as ML_DEVICES, MWorld, ml_rule
    w = MWorld(media_player__vlc="idle", light__k="on")
    consumers = [rule("y", [ref("m")], onTrue=[SAY], onFalse=[PLAY]),
                 control([{"source": {"rule": "m"}}], off=[NOTE], rid="lc")]
    off = 180
    if how == "changed save":
        w.engine.load_plans([plan(ML_DEVICES + [SPK, PHONE], [ml_rule()] + consumers)], boot=False)
        off = 120
    w.engine.load_plans([plan(ML_DEVICES + [SPK, PHONE], [ml_rule(off=off)] + consumers)], boot=False)
    assert w.tr()["verdict"] is True and said(w) == []
    w.pir("on")
    w.pir("off")
    w.advance(w.t + off + 1)
    assert w.tr()["verdict"] is False and said(w) == [SOUND, PUSH]


def test_a_motion_light_verdict_moved_by_hand_or_by_a_button_is_real_downstream():
    from test_motion_light import ml_rule
    w = ml_world([ml_rule(buttons=("btn",)), rule("y", [ref("m")], onTrue=[SAY], onFalse=[PLAY])])
    w.light("on")  # switched on by hand without motion: found on, held
    assert w.tr()["verdict"] is True and said(w) == [SPEAK]
    w.press("btn", "auto")  # auto again: a fresh decision at once, no motion: off now
    assert w.tr()["verdict"] is False and said(w) == [SPEAK, SOUND]
