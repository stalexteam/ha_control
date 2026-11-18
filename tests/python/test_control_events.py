"""Events of purpose-built rules as Load control sources (spec announcements §5): a light motion control rule gives
"auto" / "manual", a boiler rule "auto" / "manual" / "done"; a Load control rule with such a source gets an "on" event
(its gate applies), never while HA starts, inside a load or from a disabled rule, and only for a real mode change."""

from control import Control
from rules import RuleEngine
from test_boiler import W, boiler_rule
from test_control import L1, btn, on, src
from test_motion_light import ml_rule
from test_rules import World, dev, plan, rule
from test_rules_announce import NOTE, PHONE, PLAY, PUSH, SAY, SOUND, SPEAK, SPK

LAMP = dev("lamp", "ceiling_light", "Lamp", control="light.k")
LAMP2 = dev("lamp2", "ceiling_light", "Lamp 2", control="light.k2")
PIR1 = dev("pir1", "motion_sensor", "Motion 1", motion="binary_sensor.pir1")
MB1 = dev("mb1", "smart_button", "Button 1", action="sensor.a1")
MB2 = dev("mb2", "smart_button", "Button 2", action="sensor.a2")
WS = dev("ws", "wall_switch", "Dimmer", state="light.k")  # the lamp's own relay: a double flip gives auto
BOILER = dev("boil", "equipment", "Boiler", controllable=True, control="switch.relay", power="sensor.bp")
BB = dev("bb", "smart_button", "Button WC", action="sensor.bb")
KNOB = dev("knob", "smart_button", "Knob", action="sensor.knob")
GATE = dev("g", "motion_sensor", "Gate", motion="binary_sensor.g")
DEVICES = [LAMP, LAMP2, PIR1, MB1, MB2, WS, BOILER, BB, KNOB, GATE, L1, SPK, PHONE]
RELAY_ON, RELAY_OFF = ("switch", "turn_on", "switch.relay"), ("switch", "turn_off", "switch.relay")


def ev(rid, what):
    return {"event": {"rule": rid, "what": what}}


def light(rid="m1", lamp="lamp", button="mb1", auto_after=0, **extra):
    return ml_rule(rid, buttons=(button,), light=lamp, auto_after=auto_after, name=f"Light {rid}", **extra)


def boiler(**extra):
    return boiler_rule(grid=None, rid="boiler", device="boil", button="bb", name="Boiler", **extra)


def lc(rid, sources, on=(), off=(), toggle=(), name=None, **extra):
    """A Load control rule; actions: raw dicts or (device id, do)."""
    def acts(xs):
        return [a if isinstance(a, dict) else {"device": a[0], "do": a[1]} for a in xs]
    return rule(rid, [], name=name or rid, control={"sources": list(sources), "on": acts(on), "off": acts(off),
                                                    "toggle": acts(toggle)}, **extra)


class EWorld(World):
    """World with the motion lights, the boiler, a speaker and a phone; own-context state changes, button intents."""

    def __init__(self, **states):
        base = {"light__k": "off", "light__k2": "off", "binary_sensor__pir1": "off", "switch__relay": "off",
                "sensor__bp": ("0", W), "media_player__vlc": "idle", "binary_sensor__g": "on", "switch__l1": "off"}
        base.update(states)
        super().__init__(**base)
        self.engine = RuleEngine(self.lookup, lambda: self.t, self.call, self.schedule, changed_at=self.changed.get)

    def set(self, eid, state, attrs=None, own=False):
        if state is None:
            self.states.pop(eid, None)
        else:
            self.states[eid] = (state, attrs if attrs is not None else self.states.get(eid, (None, {}))[1])
        self.engine.handle_state(eid, own=own)

    def press(self, container, action, value=None):
        intent = {"action": action} if value is None else {"action": action, "value": value}
        self.engine.on_intent("p", container, intent)

    def load(self, rules, boot=False, **stored):
        self.engine.load_plans([plan(DEVICES, rules)], boot=boot, **stored)

    def tr(self, rid):
        return self.engine.snapshot("p")[rid]


def loaded(rules, **states):
    w = EWorld(**states)
    w.load(rules)
    return w


def said(w):
    """The announcement calls (the ones with service data)."""
    return [c for c in w.calls if len(c) == 4]


def heat_until_done(w):
    """Auto by the boiler's button, the relay on and drawing, then the boiler stops drawing after the 60 s grace."""
    w.press("bb", "auto")
    w.set("switch.relay", "on", own=True)
    w.set("sensor.bp", "1380", W)
    w.advance(w.t + 60)
    w.set("sensor.bp", "0", W)
    assert w.tr("boiler")["boiler"]["mode"] == "manual" and w.tr("boiler")["boiler"]["phase"] == "done"


# --- the source kind ------------------------------------------------------------------------------------

def test_control_keeps_event_sources_in_rule_order():
    devices = {d["id"]: d for d in DEVICES}
    c = Control({"sources": [btn("knob"), ev("m1", "auto"), src("pir1"), ev("boiler", "done")],
                 "on": [], "off": [], "toggle": []}, devices)
    assert c.order == [("button", 0), ("event", 0), ("input", 0), ("event", 1)]
    assert c.events == [("m1", "auto"), ("boiler", "done")]
    assert c.inputs == [src("pir1")]  # an event source is no condition input
    assert c.gives == ["toggle", "on", "on / off", "on"]
    assert not c.missing


# --- Review Focus 1: "Go bathe" -----------------------------------------------------------------------

def test_go_bathe_the_boiler_done_says_and_notifies_once():
    w = loaded([boiler(), lc("bathe", [ev("boiler", "done")], on=[SAY, NOTE], name="Go bathe")])
    heat_until_done(w)
    assert w.calls == [RELAY_ON, RELAY_OFF, SPEAK, PUSH]  # the boiler's own relay commands first, unaffected
    t = w.tr("bathe")
    assert t["status"] == "ok"
    assert t["control"]["event"] == {"source": "Boiler", "what": "on", "at": 1060000,
                                     "origin": {"rule": "boiler", "what": "done"}}
    assert t["last"] == {"action": "notify", "target": "Phone", "at": 1060000, "reason": "Boiler: done"}
    assert t["inputs"] == [{"label": "Boiler", "value": None, "detail": "", "gives": "on"}]
    # done once: the relay off arriving, more readings, time passing, another Save: nothing more
    w.set("switch.relay", "off", own=True)
    for v in ("0", "2", "0"):
        w.set("sensor.bp", v, W)
    w.advance(w.t + 3600)
    w.load([boiler(), lc("bathe", [ev("boiler", "done")], on=[SAY, NOTE], name="Go bathe")])
    assert said(w) == [SPEAK, PUSH]


def test_the_boiler_relay_commands_are_the_same_with_and_without_a_listener():
    plain = loaded([boiler()])
    heat_until_done(plain)
    heard = loaded([boiler(), lc("bathe", [ev("boiler", "done")], on=[SAY])])
    heat_until_done(heard)
    assert [c for c in heard.calls if len(c) == 3] == plain.calls == [RELAY_ON, RELAY_OFF]
    assert heard.tr("boiler")["boiler"] == plain.tr("boiler")["boiler"]


def test_boiler_auto_and_manual_events_only_on_a_mode_change():
    w = loaded([boiler(), lc("a", [ev("boiler", "auto")], on=[PLAY]), lc("m", [ev("boiler", "manual")], on=[SAY])])
    w.press("bb", "auto")
    assert said(w) == [SOUND]
    w.press("bb", "auto")  # auto while auto: no event
    assert said(w) == [SOUND]
    w.set("switch.relay", "on", own=True)
    w.set("switch.relay", "off")  # a human takes over (no Plan Studio context): manual
    assert w.tr("boiler")["boiler"]["mode"] == "manual"
    assert said(w) == [SOUND, SPEAK]
    w.press("bb", "toggle")  # manual -> manual: no event
    w.press("bb", "set", "off")
    assert said(w) == [SOUND, SPEAK]
    w.press("bb", "auto")
    assert said(w) == [SOUND, SPEAK, SOUND]
    w.press("bb", "toggle")  # auto -> manual by the button
    assert said(w) == [SOUND, SPEAK, SOUND, SPEAK]
    assert w.tr("m")["last"]["reason"] == "Boiler: manual" and w.tr("a")["last"]["reason"] == "Boiler: auto"


def test_heating_done_gives_done_then_manual():
    w = loaded([boiler(), lc("m", [ev("boiler", "manual")], on=[SAY]), lc("d", [ev("boiler", "done")], on=[NOTE])])
    heat_until_done(w)
    assert said(w) == [PUSH, SPEAK]  # done first, then manual (each listener in plan order)
    assert w.tr("m")["control"]["event"]["origin"] == {"rule": "boiler", "what": "manual"}


def test_a_rule_with_both_done_and_manual_acts_once_on_done():
    w = loaded([boiler(), lc("both", [ev("boiler", "manual"), ev("boiler", "done")], on=[SAY, ("l1", "on")])])
    heat_until_done(w)
    assert said(w) == [SPEAK] and w.calls.count(on("switch.l1")) == 1
    assert w.tr("both")["control"]["event"]["origin"] == {"rule": "boiler", "what": "done"}


# --- Review Focus 2: "Auto sound" ----------------------------------------------------------------------

def test_auto_sound_any_light_entering_auto_by_a_button_plays_once():
    rules = [light("m1"), light("m2", lamp="lamp2", button="mb2"),
             lc("sound", [ev("m1", "auto"), ev("m2", "auto")], on=[PLAY], name="Auto sound")]
    w = loaded(rules)
    w.press("mb1", "toggle")  # manual: no sound
    assert said(w) == []
    w.press("mb1", "auto")
    assert said(w) == [SOUND]
    w.press("mb1", "auto")  # auto while auto: no event
    assert said(w) == [SOUND]
    w.press("mb2", "set", "on")
    w.press("mb2", "auto")
    assert said(w) == [SOUND, SOUND]
    t = w.tr("sound")
    assert t["control"]["event"] == {"source": "Light m2", "what": "on", "at": 1000000,
                                     "origin": {"rule": "m2", "what": "auto"}}
    assert t["last"]["reason"] == "Light m2: auto"
    w.load(rules)  # an unchanged Save
    w.load(rules[:2] + [lc("sound", [ev("m1", "auto")], on=[PLAY], name="Auto sound")])  # a changed Save
    assert said(w) == [SOUND, SOUND]


def test_a_double_flip_and_auto_again_are_auto_too():
    w = loaded([light("m1", button="ws", auto_after=1), lc("sound", [ev("m1", "auto")], on=[PLAY])])
    w.press("ws", "set", "on")  # the dimmer's own flip: manual
    w.press("ws", "auto")  # its double flip
    assert said(w) == [SOUND]
    w.press("ws", "set", "off")
    w.advance(w.t + 60)  # no motion for autoAfter: auto again
    assert w.tr("m1")["motionLight"]["mode"] == "auto"
    assert said(w) == [SOUND, SOUND]


def test_motion_light_manual_event_only_on_entering_manual():
    w = loaded([light("m1"), lc("man", [ev("m1", "manual")], on=[SAY])])
    w.press("mb1", "toggle")
    assert said(w) == [SPEAK]
    w.press("mb1", "toggle")  # manual -> manual: no event
    w.press("mb1", "set", "off")
    assert said(w) == [SPEAK]
    w.press("mb1", "auto")  # auto is not manual
    assert said(w) == [SPEAK]
    w.set("light.k", "on")  # switched elsewhere: never a mode change
    w.set("light.k", "off")
    assert said(w) == [SPEAK]
    w.press("mb1", "set", "on")
    assert said(w) == [SPEAK, SPEAK]


# --- the gate, a button source beside, the trace ---------------------------------------------------------

def test_the_gate_drops_an_event_and_never_replays_it():
    w = loaded([light("m1"), lc("sound", [ev("m1", "auto")], on=[PLAY], gate={"source": {"device": "g"}})],
               binary_sensor__g="off")
    w.press("mb1", "toggle")
    w.press("mb1", "auto")
    assert said(w) == []
    assert w.tr("sound")["control"]["event"] == {"source": "Light m1", "what": "on", "at": 1000000,
                                                 "origin": {"rule": "m1", "what": "auto"}, "dropped": "gate closed"}
    w.set("binary_sensor.g", "on")  # the gate opens: nothing replayed
    assert said(w) == []
    w.press("mb1", "toggle")
    w.press("mb1", "auto")
    assert said(w) == [SOUND]
    w.set("binary_sensor.g", "unavailable")  # an unknown gate drops too
    w.press("mb1", "toggle")
    w.press("mb1", "auto")
    assert said(w) == [SOUND] and w.tr("sound")["control"]["event"]["dropped"] == "gate closed"


def test_an_event_source_and_a_button_source_in_one_rule():
    w = loaded([light("m1"), lc("mix", [btn("knob"), ev("m1", "auto")], on=[PLAY, ("l1", "on")],
                                toggle=[("l1", "toggle")])])
    w.press("knob", "toggle")
    assert w.calls == [on("switch.l1")]
    w.set("switch.l1", "on", own=True)
    w.press("mb1", "toggle")
    w.calls.clear()
    w.press("mb1", "auto")
    assert w.calls == [SOUND]  # the lamp reads on already: not commanded again
    t = w.tr("mix")
    assert t["inputs"] == [{"label": "Knob", "value": None, "detail": "", "gives": "toggle"},
                           {"label": "Light m1", "value": None, "detail": "", "gives": "on"}]
    assert t["control"]["event"]["origin"] == {"rule": "m1", "what": "auto"}
    assert [e["action"] for e in w.engine._rules[("p", "mix")].entries] == ["play", "on"]
    assert w.engine._rules[("p", "mix")].entries[1]["sent"] is False


def test_an_event_source_whose_rule_is_missing_or_of_another_kind_is_rule_missing():
    w = loaded([boiler(), light("m1"), lc("x", [btn("knob")], on=[PLAY]),
                lc("bad", [ev("gone", "auto"), ev("x", "auto"), ev("m1", "done"), ev("boiler", "x")], on=[SAY])])
    t = w.tr("bad")
    assert t["status"] == "error" and t["reason"] == "rule missing"
    assert [i["detail"] for i in t["inputs"]] == ["missing"] * 4
    assert t["inputs"][0]["label"] == "gone" and t["inputs"][2]["label"] == "Light m1"
    w.press("mb1", "toggle")
    w.press("mb1", "auto")
    heat_until_done(w)
    assert said(w) == []
    ok = loaded([light("m1"), lc("fine", [ev("m1", "auto")], on=[SAY])])
    assert ok.tr("fine")["status"] == "ok" and "reason" not in ok.tr("fine")


# --- never at HA start, at a Save or from a disabled rule ------------------------------------------------

ALL = [ev("m1", "auto"), ev("m1", "manual"), ev("boiler", "auto"), ev("boiler", "manual"), ev("boiler", "done")]


def test_no_event_while_ha_starts():
    w = EWorld()
    w.load([light("m1"), boiler(), lc("all", ALL, on=[SAY])], boot=True)
    w.press("bb", "auto")  # a boiler press while HA starts changes the mode: no event
    w.press("mb1", "toggle")  # a motion light ignores its buttons while HA starts
    w.engine.started()
    assert said(w) == [] and w.tr("boiler")["boiler"]["mode"] == "auto"
    w.press("bb", "toggle")  # after the start: an event
    assert said(w) == [SPEAK]


def test_no_event_from_the_restored_state_at_ha_start():
    """The stored modes are restored at the load; started() evaluates them once: a light whose auto-return passed
    while HA was down goes auto, a boiler restored in auto may conclude "done": both without events."""
    w = EWorld(switch__relay="on")
    w.load([light("m1", auto_after=1), boiler(), lc("all", ALL, on=[SAY])], boot=True,
           modes={"p": {"boiler": "auto"}}, motion_modes={"p": {"m1": {"mode": "manual", "since": 0.0, "by": "button"}}})
    w.advance(w.t + 120)
    w.engine.started()
    assert w.tr("m1")["motionLight"]["mode"] == "auto"
    assert w.tr("boiler")["boiler"]["phase"] == "done" and w.calls == [RELAY_OFF]
    assert said(w) == []
    w.press("bb", "auto")  # a real change after the start
    assert said(w) == [SPEAK]


def test_no_event_inside_a_save():
    """A changed Save shortens the auto-return of a manual light: it goes auto inside the load, without an event."""
    rules = [light("m1", auto_after=10), lc("sound", [ev("m1", "auto")], on=[PLAY])]
    w = loaded(rules)
    w.press("mb1", "toggle")
    w.advance(w.t + 120)
    w.load([light("m1", auto_after=1), rules[1]])
    assert w.tr("m1")["motionLight"]["mode"] == "auto" and said(w) == []
    w.press("mb1", "toggle")
    w.press("mb1", "auto")
    assert said(w) == [SOUND]


def test_no_event_from_or_to_a_disabled_rule():
    w = loaded([light("m1"), boiler(enabled=False), lc("sound", [ev("m1", "auto"), ev("boiler", "auto")], on=[PLAY],
                                                      enabled=False)])
    w.press("mb1", "toggle")
    w.press("mb1", "auto")
    w.press("bb", "auto")
    assert said(w) == []
    w.load([light("m1", enabled=False), boiler(enabled=False), lc("sound", [ev("m1", "auto")], on=[PLAY])])
    w.press("mb1", "toggle")
    w.press("mb1", "auto")
    w.press("bb", "auto")
    assert said(w) == [] and "control" in w.tr("sound") and "event" not in w.tr("sound")["control"]
    w.load([light("m1"), boiler(), lc("sound", [ev("m1", "auto")], on=[PLAY])])
    w.press("mb1", "toggle")
    w.press("mb1", "auto")
    assert said(w) == [SOUND]
