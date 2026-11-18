"""Tests for the Light motion control rule in the pure rule engine (spec light motion control §4)."""

import copy

from motion_light import MotionLight
from rules import RuleEngine
from test_daylight import sensor
from test_rules import World, dev, lux, plan, rule

LAMP = dev("lamp", "ceiling_light", "Lamp", control="light.k")
LAMP2 = dev("lamp2", "ceiling_light", "Lamp 2", control="light.k2")
PIR1 = dev("pir1", "motion_sensor", "Motion 1", motion="binary_sensor.pir1")
PIR2 = dev("pir2", "motion_sensor", "Motion 2", motion="binary_sensor.pir2")
LS = sensor("ls", "LightSensor", debounce=0)
BTN = dev("btn", "smart_button", "Button", action="sensor.act")
BTN["props"]["autoEnabled"] = True
WS = dev("ws", "wall_switch", "Dimmer", state="light.k")
WS["props"]["autoByDoubleToggle"] = True
TB = dev("tb", "smart_button", "Timer button", action="sensor.tact")
DEVICES = [LAMP, LAMP2, PIR1, PIR2, LS, BTN, WS, TB]
ON, OFF = ("light", "turn_on", "light.k"), ("light", "turn_off", "light.k")
ON2, OFF2 = ("light", "turn_on", "light.k2"), ("light", "turn_off", "light.k2")
DAY, NIGHT, DUSK = lux(100), lux(5), lux(30)
T0 = 1000.0


def ml_rule(rid="m", sensors=("pir1",), daylight=None, min_on=0, off=180, buttons=(), auto_after=0, light="lamp",
            name="Light motion control", **extra):
    m = {"light": light, "sensors": list(sensors), "minOn": min_on, "buttons": list(buttons), "autoAfter": auto_after}
    if daylight is not None:
        m["daylight"] = {"sensor": daylight[0], "is": daylight[1]}
    return rule(rid, [], name=name, off_delay=off, motionLight=m, **extra)


def pair_rule(rid="cr", name="Pair"):
    return rule(rid, ["pir2"], name=name, on_true=[("lamp", "on")], on_false=[("lamp", "off")])


def consumer_rule(rid="c", name="Consumer"):
    """A condition rule whose single input is the motion light rule "m", switching the second lamp both ways."""
    return rule(rid, [{"source": {"rule": "m"}}], name=name, on_true=[("lamp2", "on")], on_false=[("lamp2", "off")])


def timed_rule(rid="t", minutes=1, name="Timer"):
    return rule(rid, [], name=name, timed={"button": "tb", "device": "lamp", "minutes": minutes})


class MWorld(World):
    """World with a motion mode recorder, own-context state changes and button intents."""

    def __init__(self, **states):
        base = {"light__k": "off", "light__k2": "off", "binary_sensor__pir1": "off", "binary_sensor__pir2": "off",
                "sensor__lux": NIGHT}
        base.update(states)
        super().__init__(**base)
        self.saved = []
        self.engine = RuleEngine(self.lookup, lambda: self.t, self.call, self.schedule, changed_at=self.changed.get,
                                 on_motion_modes=lambda m: self.saved.append(copy.deepcopy(m)))

    def set(self, eid, state, attrs=None, own=False):
        if state is None:
            self.states.pop(eid, None)
        else:
            self.states[eid] = (state, attrs if attrs is not None else self.states.get(eid, (None, {}))[1])
        self.engine.handle_state(eid, own=own)

    def press(self, container, action, value=None):
        intent = {"action": action} if value is None else {"action": action, "value": value}
        self.engine.on_intent("p", container, intent)

    def load(self, rules=None, boot=False, motion_modes=None):
        self.engine.load_plans([plan(DEVICES, rules if rules is not None else [ml_rule()])],
                               boot=boot, motion_modes=motion_modes)

    def light(self, state, own=False):
        self.set("light.k", state, own=own)

    def pir(self, state, n=1):
        self.set(f"binary_sensor.pir{n}", state)

    def tr(self, rid="m"):
        return self.engine.snapshot("p")[rid]

    def ml(self, rid="m"):
        return self.tr(rid)["motionLight"]


def loaded(rules=None, **states):
    w = MWorld(**states)
    w.load(rules)
    return w


def lit(rules=None, **states):
    """Loaded; motion switched the lamp on (confirmed by its own context); the calls cleared."""
    w = loaded(rules, **states)
    w.pir("on")
    assert w.calls == [ON]
    w.light("on", own=True)
    w.calls.clear()
    return w


# --- the pure part ---------------------------------------------------------------------

def make(**raw):
    base = {"light": "lamp", "sensors": ["pir1", "pir2"], "minOn": 0, "buttons": ["btn"], "autoAfter": 0}
    base.update(raw)
    return MotionLight(base, {d["id"]: d for d in DEVICES}, "light.k")


def test_motion_is_any_sensor_and_no_data_is_no_motion():
    m = make()
    assert m.motion([True, False]) and m.motion([None, True])
    assert not m.motion([False, False]) and not m.motion([None, None]) and not m.motion([])


def test_dark_defaults():
    assert make().dark([False, False])  # no daylight: always dark
    m = make(daylight={"sensor": "ls", "is": "dark"})
    assert m.dark([False, False, None]) and m.dark([False, False, True]) and not m.dark([False, False, False])


def test_raw_block_only_on_switching_on():
    m = make(daylight={"sensor": "ls", "is": "night"})
    assert m.raw([True, False, False], False) is False
    assert m.raw([True, False, False], True) is True
    assert m.raw([False, False, True], True) is False


def test_raw_without_sensors_is_none_and_waiting_blocks_until_clear():
    assert make(sensors=[]).raw([], True) is None and make(sensors=[]).raw([], False) is None
    m = make()
    m.waiting = True
    assert m.raw([True, False], False) is False and m.waiting
    assert m.raw([True, None], True) is False and m.waiting
    assert m.raw([False, None], False) is False and not m.waiting  # every sensor clear (no data counts as clear)
    assert m.raw([True, False], False) is True


def test_off_delay_respects_min_on():
    m = make(minOn=60)
    m.on_at = 0
    assert m.off_delay(5, 0) == 55 and m.off_delay(5, 180) == 180
    m.on_at = None
    assert m.off_delay(5, 0) == 0 and m.off_delay(5, 180) == 180


def test_press_table():
    m = make()
    assert m.press({"action": "toggle"}, "on") == ("manual", "off")
    assert m.press({"action": "toggle"}, None) == ("manual", "on")
    assert m.press({"action": "set", "value": "on"}, "on") == ("manual", None)
    assert m.press({"action": "set", "value": "on"}, "off") == ("manual", "on")
    assert m.press({"action": "set", "value": "off"}, "on") == ("manual", "off")
    assert m.press({"action": "auto"}, "on") == ("auto", None)
    assert m.press({"status": "ok"}, "on") == (None, None)
    assert m.press({"action": "set", "value": "x"}, "on") == (None, None)


def test_light_changed_table():
    """Arguments: state, confirms, active, held. The mode never changes."""
    m = make()
    m.seen = "on"
    assert m.light_changed("off", False, True, True) == "released"  # foreign off while held
    m.seen = "on"
    assert m.light_changed("off", False, True, False) is None  # foreign off, not held
    m.seen = "on"
    assert m.light_changed("off", True, True, True) is None  # confirms the slots' command
    assert m.light_changed("on", True, True, False) == "found"  # another slot participant switched it on
    m.seen = "off"
    assert m.light_changed("on", False, True, False) == "found"  # foreign on
    m.seen = "off"
    assert m.light_changed("on", False, True, True) is None  # held already
    assert m.light_changed("on", False, True, False) is None  # attributes only
    assert m.light_changed(None, False, True, False) is None  # to no data
    assert m.light_changed("off", False, True, True) == "back"  # from no data
    assert m.light_changed("on", False, False, False) is None  # not active
    m.mode = "manual"
    assert m.light_changed("off", False, True, False) is None and m.mode == "manual"  # manual: ignored
    assert m.light_changed("on", False, True, False) is None and m.mode == "manual"
    m.mode = "auto"
    m.decide("on", 0, 10)
    assert m.light_changed("off", False, True, False, 1) is None
    assert m.light_changed("on", False, True, False, 2) is None and m.own == []  # its own decision, used up
    m = make(sensors=[])
    m.seen = "off"
    assert m.light_changed("on", False, True, False) is None  # no sensors: inert
    m.seen = "on"
    assert m.light_changed("off", False, True, True) is None and m.seen == "off"


def test_decide_prunes_expired_records():
    m = make()
    for t, state in ((0, "on"), (5, "off"), (20, "on"), (25, "off")):
        m.decide(state, t, 10)
    assert m.own == [("on", 30), ("off", 35)]


def test_ident_and_smart_buttons_only():
    m = make()
    assert m.ident == ("light.k", ("btn",)) and not m.missing and not m.waiting
    assert MotionLight({"light": "lamp", "sensors": ["pir1"], "buttons": ["ws"]}, {"lamp": LAMP, "pir1": PIR1, "ws": WS},
                       "light.k").missing
    assert not MotionLight({"light": "lamp", "sensors": [], "buttons": []}, {"lamp": LAMP}, "light.k").missing


def test_defaults_of_a_malformed_config():
    m = MotionLight({"minOn": -1, "autoAfter": True, "daylight": {"sensor": "ls", "is": "day"}}, {}, None)
    assert m.min_on == 0 and m.auto_after == 0 and m.daylight is None and m.missing and m.inputs() == []


# --- auto ------------------------------------------------------------------------------

def test_motion_switches_on_and_off_after_the_delay():
    """Review focus 1."""
    w = loaded()
    assert w.calls == [] and w.tr()["verdict"] is False
    w.pir("on")
    t = w.tr()
    assert w.calls == [ON] and t["verdict"] is True and t["holders"] == ["Light motion control"]
    assert t["last"]["action"] == "on" and t["last"]["reason"].startswith("became true")
    w.light("on", own=True)
    w.pir("off")
    w.advance(T0 + 179)
    assert w.calls == [ON]
    w.advance(T0 + 180)
    assert w.calls == [ON, OFF] and w.tr()["verdict"] is False and w.ml()["mode"] == "auto"


def test_motion_returning_restarts_the_count():
    w = lit()
    w.pir("off")
    w.advance(T0 + 170)
    w.pir("on")
    w.advance(T0 + 175)
    w.pir("off")
    w.advance(T0 + 354)
    assert w.calls == []
    w.advance(T0 + 355)
    assert w.calls == [OFF]


def test_two_sensors_work_as_or():
    w = lit([ml_rule(sensors=("pir1", "pir2"))])
    w.pir("on", 2)
    w.pir("off", 1)
    assert not w.pending() and w.ml()["motion"] is True
    w.advance(T0 + 600)
    assert w.calls == []
    w.pir("off", 2)
    w.advance(T0 + 779)
    assert w.calls == []
    w.advance(T0 + 780)
    assert w.calls == [OFF]


def test_min_on_time():
    """Review focus 3."""
    w = lit([ml_rule(min_on=60, off=0)])
    w.advance(T0 + 5)
    w.pir("off")
    w.advance(T0 + 59)
    assert w.calls == []
    w.advance(T0 + 60)
    assert w.calls == [OFF]
    w = lit([ml_rule(min_on=60, off=180)])
    w.advance(T0 + 5)
    w.pir("off")
    w.advance(T0 + 184)
    assert w.calls == []
    w.advance(T0 + 185)
    assert w.calls == [OFF]


def test_daylight_blocks_switching_on_only():
    """Review focus 3."""
    w = loaded([ml_rule(daylight=("ls", "night"))], sensor__lux=DAY)
    w.pir("on")
    assert w.calls == [] and w.tr()["verdict"] is False
    w.set("sensor.lux", *NIGHT)
    assert w.calls == [ON]
    w.light("on", own=True)
    w.set("sensor.lux", *DAY)  # the sensor sees the lamp: nothing while the motion lasts
    w.advance(T0 + 600)
    assert w.calls == [ON] and w.tr()["verdict"] is True
    w.pir("off")
    w.advance(T0 + 780)
    assert w.calls == [ON, OFF]


def test_dusk_with_motion_switches_on():
    w = loaded([ml_rule(daylight=("ls", "dark"))], sensor__lux=DAY)
    w.pir("on")
    assert w.calls == []
    w.set("sensor.lux", *DUSK)
    assert w.calls == [ON]
    w = loaded([ml_rule(daylight=("ls", "night"))], sensor__lux=DUSK)
    w.pir("on")
    assert w.calls == []  # twilight is not night


def test_no_daylight_data_counts_as_dark():
    w = loaded([ml_rule(daylight=("ls", "night"))], sensor__lux="unavailable")
    w.pir("on")
    assert w.calls == [ON]


def test_dead_motion_sensor_lets_the_light_go_off():
    """Review focus 5."""
    w = lit()
    w.pir("unavailable")
    w.advance(T0 + 179)
    assert w.calls == []
    w.advance(T0 + 180)
    assert w.calls == [OFF]


# --- manual (set by a button only) --------------------------------------------------------

def test_button_toggle_sets_manual_and_the_rule_goes_silent():
    """Review focus 2."""
    w = loaded([ml_rule(buttons=("btn",))])
    w.press("btn", "toggle")
    t = w.tr()
    assert w.calls == [ON] and t["motionLight"]["mode"] == "manual" and t["verdict"] is None
    assert t["last"] == {"action": "on", "target": "Lamp", "at": T0 * 1000, "reason": "button: manual"}
    w.light("on", own=True)
    w.pir("on")
    w.pir("off")
    w.advance(T0 + 3600)
    t = w.tr()
    assert w.calls == [ON] and t["status"] == "ok" and t["motionLight"]["mode"] == "manual" and "holders" not in t


def test_foreign_change_in_manual_is_ignored():
    w = loaded([ml_rule(buttons=("btn",))])
    w.press("btn", "toggle")
    w.light("on", own=True)
    w.advance(T0 + 30)
    w.light("off")  # the wall dimmer by hand
    w.light("on", own=True)  # a Plan Studio command of another automation
    w.light("off", own=True)
    w.pir("on")
    t = w.tr()
    assert t["motionLight"]["mode"] == "manual" and t["verdict"] is None and w.calls == [ON]
    assert t["last"]["reason"] == "button: manual" and "waiting" not in t["motionLight"]
    w.pir("off")
    w.advance(T0 + 3600)
    assert w.calls == [ON] and w.ml()["mode"] == "manual"


def test_no_button_is_always_auto():
    """Review focus 1."""
    w = loaded()
    w.light("on")  # a foreign on
    assert w.ml()["mode"] == "auto" and w.tr()["verdict"] is True
    w.light("off")  # a foreign off
    assert w.ml()["mode"] == "auto" and w.tr()["verdict"] is False
    w.light("on", own=True)  # a Plan Studio context that does not confirm the slots
    w.light("off", own=True)
    w.press("btn", "toggle")  # not a button of the rule
    assert w.ml()["mode"] == "auto" and w.calls == [] and w.saved == [] and w.engine.motion_modes() == {}
    # a stored manual record of a rule without buttons is ignored
    w = MWorld(light__k="on")
    w.load(boot=True, motion_modes={"p": {"m": {"mode": "manual", "since": T0}}})
    w.engine.started()
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and t["verdict"] is True and w.saved[-1] == {}
    w.advance(T0 + 180)
    assert w.calls == [OFF]


def test_auto_with_no_motion_switches_off_at_once():
    """Review focus 1 (spec §11): entering auto is a fresh decision; its off is the rule's own (its echo is neither found
    nor released)."""
    for rules, states in (([ml_rule(buttons=("btn",), daylight=("ls", "night"))], {"sensor__lux": DAY}),
                          ([ml_rule(buttons=("btn",))], {})):
        w = loaded(rules, **states)
        w.press("btn", "toggle")  # manual: the lamp on
        w.light("on", own=True)
        w.calls.clear()
        w.advance(T0 + 10)
        w.press("btn", "auto")
        t = w.tr()
        assert w.calls == [OFF] and t["verdict"] is False and t["motionLight"]["mode"] == "auto", rules
        assert t["last"]["action"] == "off" and t["last"]["reason"] == "back to auto: no motion" and "sent" not in t["last"]
        assert not w.pending() and "holders" not in t
        w.light("off", own=True)  # the off arrives
        t = w.tr()
        assert w.calls == [OFF] and t["verdict"] is False and t["motionLight"]["mode"] == "auto"
        assert "waiting" not in t["motionLight"] and t["last"]["reason"] == "back to auto: no motion"
        w.advance(T0 + 3600)
        assert w.calls == [OFF]
        w.set("sensor.lux", *NIGHT)
        w.pir("on")  # motion while dark
        assert w.calls == [OFF, ON] and w.tr()["verdict"] is True


def test_auto_with_no_motion_switches_off_and_consumers_follow():
    w = loaded([ml_rule(buttons=("btn",)), consumer_rule()])
    w.press("btn", "toggle")
    w.light("on", own=True)
    assert w.tr("c")["inputs"][0]["value"] is None
    w.calls.clear()
    w.press("btn", "auto")
    assert w.calls == [OFF] and w.tr()["verdict"] is False and w.tr("c")["inputs"][0]["value"] is False


def test_auto_with_motion_while_dark_keeps_the_light():
    """Review focus 2: held; its off comes after the off delay once the motion ends (the minimum on time does not
    apply)."""
    w = loaded([ml_rule(buttons=("btn",), daylight=("ls", "night"), min_on=3600)])
    w.press("btn", "toggle")
    w.light("on", own=True)
    w.pir("on")
    w.calls.clear()
    w.press("btn", "auto")
    t = w.tr()
    assert w.calls == [] and t["verdict"] is True and t["motionLight"]["mode"] == "auto"
    assert t["last"]["reason"] == "button: auto" and "minUntil" not in t["motionLight"]
    w.advance(T0 + 600)
    assert w.calls == []
    w.pir("off")
    w.advance(T0 + 779)
    assert w.calls == []
    w.advance(T0 + 780)
    assert w.calls == [OFF]


def test_auto_with_motion_in_daylight_switches_off():
    """Review focus 3: not dark: off at once; the stale on reading before its echo does not switch it on again."""
    w = loaded([ml_rule(buttons=("btn",), daylight=("ls", "night"))], sensor__lux=DAY)
    w.press("btn", "toggle")
    w.light("on", own=True)
    w.pir("on")
    w.calls.clear()
    w.press("btn", "auto")
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is False and t["motionLight"]["mode"] == "auto"
    assert t["last"]["action"] == "off" and t["last"]["reason"] == "back to auto: not dark"
    w.pir("on")  # a motion report before the off arrives
    w.set("sensor.lux", *DAY)
    assert w.calls == [OFF] and w.tr()["verdict"] is False
    w.light("off", own=True)
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is False and "waiting" not in t["motionLight"]
    w.advance(T0 + 600)
    assert w.calls == [OFF]
    w.set("sensor.lux", *NIGHT)  # it gets dark while the motion lasts: on at that moment
    assert w.calls == [OFF, ON]


def test_lost_off_on_entering_auto_heals():
    """The off sent on entering auto counts as on its way only for ON_WAY s: a lost off does not leave the light on."""
    w = loaded([ml_rule(buttons=("btn",), daylight=("ls", "night"))], sensor__lux=DAY)
    w.press("btn", "toggle")
    w.light("on", own=True)
    w.calls.clear()
    w.press("btn", "auto")
    assert w.calls == [OFF]  # lost: the lamp keeps reading on
    w.advance(T0 + 3)
    w.pir("on")  # inside the window: the reading on is the off on its way
    assert w.calls == [OFF] and w.tr()["verdict"] is False
    w.advance(T0 + 12)
    w.pir("on")  # after it: motion while the light reads on: held (the on goes through the slots again)
    assert w.calls == [OFF, ON] and w.tr()["verdict"] is True
    w.pir("off")
    w.advance(T0 + 191)
    assert w.calls == [OFF, ON]
    w.advance(T0 + 192)
    assert w.calls == [OFF, ON, OFF]


def test_dropped_is_not_set_when_the_off_is_kept_back():
    w = loaded([ml_rule(buttons=("btn",), daylight=("ls", "night")), timed_rule(minutes=10)], sensor__lux=DAY)
    w.press("tb", "set", "on")
    assert w.calls == [ON]
    w.light("on", own=True)
    w.press("btn", "set", "on")  # manual, already on
    w.calls.clear()
    w.press("btn", "auto")
    t = w.tr()
    assert w.calls == [] and t["verdict"] is False and t["motionLight"]["mode"] == "auto"
    assert t["last"]["reason"] == "kept on by Timer" and t["last"]["sent"] is False
    w.advance(T0 + 1)
    w.pir("on")  # motion in daylight while the light is on: held as usual
    assert w.tr()["verdict"] is True and w.calls == []
    w.advance(T0 + 600)  # the timed run ends while the motion lasts: kept on by this rule
    assert w.calls == []
    w.pir("off")
    w.advance(T0 + 779)
    assert w.calls == []
    w.advance(T0 + 780)
    assert w.calls == [OFF]


def test_second_auto_before_the_echo():
    w = loaded([ml_rule(buttons=("btn",))])
    w.press("btn", "toggle")
    w.light("on", own=True)
    w.calls.clear()
    w.press("btn", "auto")
    assert w.calls == [OFF]
    w.advance(T0 + 1)
    w.press("btn", "auto")  # again, before the lamp confirms the off
    assert w.calls == [OFF, OFF]
    w.light("off", own=True)
    t = w.tr()
    assert t["verdict"] is False and t["motionLight"]["mode"] == "auto" and "waiting" not in t["motionLight"]
    assert t["motionLight"]["light"] == "off"
    w.advance(T0 + 3600)
    assert w.calls == [OFF, OFF]


def test_auto_with_motion_while_dark_and_the_light_off_switches_on():
    w = loaded([ml_rule(buttons=("btn",), min_on=60, off=0)])
    w.press("btn", "toggle")
    w.light("on", own=True)
    w.press("btn", "toggle")
    w.light("off", own=True)
    w.pir("on")
    w.calls.clear()
    w.press("btn", "auto")
    t = w.tr()
    assert w.calls == [ON] and t["verdict"] is True and t["motionLight"]["mode"] == "auto"
    assert t["last"]["action"] == "on" and t["last"]["reason"] == "back to auto: motion"
    w.light("on", own=True)  # its echo
    assert w.tr()["last"]["reason"] == "back to auto: motion"
    w.advance(T0 + 5)
    w.pir("off")
    w.advance(T0 + 59)
    assert w.calls == [ON]
    w.advance(T0 + 60)
    assert w.calls == [ON, OFF]


def test_auto_again_timeout_decides_at_once():
    w = loaded([ml_rule(buttons=("btn",), auto_after=10)])
    w.press("btn", "toggle")  # manual at T0
    w.light("on", own=True)
    w.calls.clear()
    w.advance(T0 + 599)
    assert w.calls == [] and w.ml()["mode"] == "manual"
    w.advance(T0 + 600)
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is False and t["motionLight"]["mode"] == "auto"
    assert t["last"]["action"] == "off" and t["last"]["reason"] == "back to auto: no motion"
    w.light("off", own=True)
    w.advance(T0 + 3600)
    assert w.calls == [OFF] and w.tr()["verdict"] is False and "waiting" not in w.ml()


def test_auto_without_sensors_sends_nothing():
    """Review focus 5."""
    for auto_after in (0, 10):
        w = loaded([ml_rule(sensors=(), buttons=("btn",), auto_after=auto_after)])
        w.press("btn", "toggle")
        w.light("on", own=True)
        w.calls.clear()
        if auto_after:
            w.advance(T0 + 600)
            assert w.ml()["mode"] == "auto"
        else:
            w.press("btn", "auto")
        t = w.tr()
        assert w.calls == [] and t["verdict"] is None and t["motionLight"]["mode"] == "auto"
        assert t["last"]["reason"] == ("auto again" if auto_after else "button: auto")
        w.advance(T0 + 7200)
        assert w.calls == []


def test_auto_with_the_light_off_and_motion_switches_on():
    w = loaded([ml_rule(buttons=("btn",))])
    w.press("btn", "toggle")
    w.light("on", own=True)
    w.press("btn", "toggle")
    w.light("off", own=True)
    w.pir("on")
    assert w.calls == [ON, OFF] and w.ml()["mode"] == "manual"
    w.press("btn", "auto")
    assert w.calls == [ON, OFF, ON] and w.ml()["mode"] == "auto"


def test_auto_at_is_hidden_while_motion_lasts():
    w = loaded([ml_rule(buttons=("btn",), auto_after=10)])
    w.press("btn", "toggle")  # manual at T0
    w.advance(T0 + 300)
    w.pir("on")
    w.advance(T0 + 900)  # since + 10 min (T0 + 600) is past, but auto waits for the motion to end
    assert "autoAt" not in w.ml() and w.ml()["mode"] == "manual"
    w.pir("off")
    assert w.ml()["autoAt"] == (T0 + 1500) * 1000


def test_button_press_in_manual_keeps_manual():
    w = loaded([ml_rule(buttons=("btn",))])
    w.press("btn", "toggle")
    w.light("on", own=True)
    w.press("btn", "toggle")
    assert w.calls == [ON, OFF] and w.ml()["mode"] == "manual"
    w.light("off", own=True)
    w.press("btn", "set", "off")  # already off: nothing to send
    t = w.tr()
    assert w.calls == [ON, OFF] and t["motionLight"]["mode"] == "manual" and t["last"]["sent"] is False


def test_auto_again_after_minutes_without_motion():
    w = loaded([ml_rule(buttons=("btn",), auto_after=10)])
    w.press("btn", "toggle")  # manual at T0
    w.light("on", own=True)
    assert w.ml()["autoAt"] == (T0 + 600) * 1000
    w.advance(T0 + 300)
    w.pir("on")
    assert "autoAt" not in w.ml()  # auto waits for the motion to end
    w.pir("off")
    assert w.ml()["autoAt"] == (T0 + 900) * 1000
    w.advance(T0 + 899)
    assert w.ml()["mode"] == "manual"
    w.advance(T0 + 900)
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and t["last"]["reason"] == "back to auto: no motion" and "autoAt" not in t["motionLight"]
    assert w.calls == [ON, OFF] and t["verdict"] is False  # a fresh decision: no motion, the light left on goes off

    w = loaded([ml_rule(buttons=("btn",))])
    w.press("btn", "toggle")
    assert w.ml()["mode"] == "manual" and not w.pending() and "autoAt" not in w.ml()


def test_auto_again_waits_while_motion_lasts():
    w = loaded([ml_rule(buttons=("btn",), auto_after=10)])
    w.press("btn", "toggle")
    w.pir("on")
    assert not w.pending()
    w.advance(T0 + 3600)
    assert w.ml()["mode"] == "manual"
    w.pir("off")
    w.advance(T0 + 4200)
    assert w.ml()["mode"] == "auto"


def test_since_changes_only_when_motion_ends():
    w = loaded([ml_rule(buttons=("btn",), auto_after=10)])
    w.press("btn", "toggle")  # manual at T0
    n = len(w.saved)
    w.advance(T0 + 60)
    w.pir("on")
    for k in range(3):  # repeated reports while the motion lasts
        w.advance(T0 + 70 + k)
        w.pir("on")
    assert len(w.saved) == n and w.engine.motion_modes()["p"]["m"]["since"] == T0
    w.advance(T0 + 120)
    w.pir("off")
    assert len(w.saved) == n + 1 and w.saved[-1] == {"p": {"m": {"mode": "manual", "since": T0 + 120, "by": "button"}}}
    w.advance(T0 + 719)
    assert w.ml()["mode"] == "manual"
    w.advance(T0 + 720)
    assert w.ml()["mode"] == "auto"


# --- own echoes and foreign changes in auto -----------------------------------------------------

def test_own_command_is_not_manual():
    w = loaded()
    w.pir("on")
    w.light("on")  # the rule's own on, reported without its context
    assert w.ml()["mode"] == "auto" and w.tr()["verdict"] is True


def test_light_back_from_no_data_is_not_manual():
    w = lit()
    w.light("unavailable")
    assert w.calls == [] and w.ml()["mode"] == "auto"
    w.light("off")
    assert w.calls == [ON] and w.ml()["mode"] == "auto" and w.tr()["verdict"] is True


def test_own_off_overtaken_by_motion_is_not_manual():
    w = lit()
    w.pir("off")
    w.advance(T0 + 180)
    assert w.calls == [OFF]
    w.advance(T0 + 182)
    w.pir("on")  # motion returns before the light reports off
    assert w.calls == [OFF, ON]
    w.light("off", own=True)  # the off arrives late
    t = w.tr()
    assert t["verdict"] is True and "waiting" not in t["motionLight"] and t["last"]["reason"] == "became true: Motion 1 motion"
    w.light("on", own=True)  # then the on
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and t["verdict"] is True and t["motionLight"]["light"] == "on"
    assert t["last"]["reason"] not in ("found on", "switched off elsewhere: waits for new motion")
    assert w.calls == [OFF, ON]


def test_own_on_overtaken_by_off_is_not_manual():
    w = loaded([ml_rule(off=0)])
    w.pir("on")
    w.pir("off")  # before the light reports on
    assert w.calls == [ON, OFF]
    w.light("on", own=True)
    t = w.tr()
    assert t["verdict"] is False and t["last"]["reason"] != "found on"
    w.light("off", own=True)
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and t["verdict"] is False and w.calls == [ON, OFF]


def test_switch_to_the_opposite_state_inside_the_window_is_foreign():
    w = lit()
    w.advance(T0 + 3)
    w.light("off")
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and t["verdict"] is False and t["motionLight"]["waiting"] is True


def test_confirmed_echo_consumes_its_record():
    """Review focus 4: after the echoes the person's off is foreign: the rule lets go and waits for new motion."""
    w = lit()
    w.pir("off")
    w.advance(T0 + 180)
    assert w.calls == [OFF]
    w.light("off", own=True)  # confirms: its record is used up
    w.advance(T0 + 183)
    w.pir("on")
    assert w.calls == [OFF, ON]
    w.light("on", own=True)  # confirms
    w.advance(T0 + 186)
    w.light("off")  # the person
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and t["verdict"] is False and t["motionLight"]["waiting"] is True
    assert t["last"]["reason"] == "switched off elsewhere: waits for new motion" and w.calls == [OFF, ON]
    w.pir("off")
    w.advance(T0 + 3600)
    w.pir("on")
    assert w.calls == [OFF, ON, ON]


def test_confirmed_echoes_then_foreign_on_with_off_zero():
    """Review focus 4: after the echoes the person's on is foreign: held as found on, off at once without motion."""
    w = loaded([ml_rule(off=0)])
    w.pir("on")
    w.light("on", own=True)
    w.pir("off")
    w.light("off", own=True)
    assert w.calls == [ON, OFF] and w.ml()["mode"] == "auto"
    w.advance(T0 + 5)
    w.light("on")  # the person
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and w.calls == [ON, OFF, OFF] and t["verdict"] is False


def test_own_window_expires():
    w = loaded()
    w.pir("on")  # the rule decides on at T0
    w.pir("off")
    w.light("on", own=True)  # confirms
    w.light("unavailable")
    w.light("off")  # back from no data: not foreign, the light is taken as off
    assert w.ml()["mode"] == "auto" and w.tr()["verdict"] is False and w.calls == [ON]
    w.advance(T0 + 11)
    w.light("on")  # by hand, not confirming, after the window: found on
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and t["verdict"] is True and t["last"]["reason"] == "found on"


def test_stale_own_record_does_not_swallow_a_hand_on():
    w = loaded(light__k="unavailable")
    w.pir("on")  # the rule decides on while the light has no data: a record "on"
    assert w.tr()["verdict"] is True
    w.pir("off")
    w.advance(T0 + 1)
    w.light("on")  # back reading on: the auto start applies again
    assert w.tr()["verdict"] is True
    w.advance(T0 + 2)
    w.light("off")  # the person: released
    assert w.tr()["verdict"] is False and w.tr()["last"]["reason"] == "switched off elsewhere: waits for new motion"
    w.advance(T0 + 3)
    n = len(w.calls)
    w.light("on")  # the person again, within 10 s of the decision
    t = w.tr()
    assert t["verdict"] is True and t["last"]["reason"] == "found on" and t["holders"] == ["Light motion control"]
    w.advance(T0 + 182)
    assert len(w.calls) == n
    w.advance(T0 + 183)
    assert w.calls[n:] == [OFF]


def test_hand_on_in_auto_is_held():
    """Review focus 2."""
    w = loaded()
    w.light("on")  # switched on elsewhere, no motion
    t = w.tr()
    assert t["last"] == {"action": "on", "target": "Lamp", "at": T0 * 1000, "reason": "found on", "sent": False}
    assert t["verdict"] is True and t["motionLight"]["mode"] == "auto" and w.calls == []
    w.advance(T0 + 179)
    assert w.calls == []
    w.advance(T0 + 180)
    assert w.calls == [OFF]

    w = loaded([ml_rule(daylight=("ls", "night"))], sensor__lux=DAY)
    w.pir("on")  # too light to switch on
    assert w.calls == []
    w.light("on")  # by hand while the motion lasts
    assert w.tr()["verdict"] is True and w.tr()["last"]["reason"] == "found on"
    w.advance(T0 + 600)
    assert w.calls == []
    w.pir("off")
    w.advance(T0 + 779)
    assert w.calls == []
    w.advance(T0 + 780)
    assert w.calls == [OFF] and w.ml()["mode"] == "auto"


def test_hand_off_under_motion_waits_for_new_motion():
    """Review focus 2."""
    w = lit()
    w.light("off")  # by hand while the motion lasts
    t = w.tr()
    assert w.calls == [] and t["verdict"] is False and not w.pending() and t["motionLight"]["waiting"] is True
    assert t["motionLight"]["mode"] == "auto"
    assert t["last"] == {"action": "off", "target": "Lamp", "at": T0 * 1000,
                         "reason": "switched off elsewhere: waits for new motion", "sent": False}
    w.advance(T0 + 30)
    w.pir("on")  # the motion continues (a same-state report)
    w.advance(T0 + 600)
    assert w.calls == [] and w.ml()["waiting"] is True
    w.pir("off")
    assert w.calls == [] and "waiting" not in w.ml()
    w.advance(T0 + 610)
    w.pir("on")  # new motion
    assert w.calls == [ON] and w.tr()["verdict"] is True


def test_hand_off_with_two_sensors_waits_until_every_sensor_is_clear():
    w = lit([ml_rule(sensors=("pir1", "pir2"))])
    w.pir("on", 2)
    w.light("off")
    w.pir("off", 1)
    assert w.ml()["waiting"] is True
    w.pir("on", 1)
    assert w.calls == []
    w.pir("off", 1)
    w.pir("off", 2)
    w.pir("on", 2)
    assert w.calls == [ON]


def test_hand_off_without_motion_just_lets_go():
    for own in (False, True):  # by hand, or a Plan Studio command that does not confirm the slots
        w = loaded(light__k="on")  # found on: off after the delay
        assert w.pending()
        w.light("off", own=own)
        t = w.tr()
        assert t["verdict"] is False and not w.pending() and w.calls == [] and "waiting" not in t["motionLight"]
        assert t["last"]["reason"] == "switched off elsewhere: waits for new motion"
        w.advance(T0 + 3600)
        assert w.calls == []
        w.pir("on")
        assert w.calls == [ON]


def test_found_on_ends_the_wait():
    w = lit()
    w.light("off")
    assert w.ml()["waiting"] is True
    w.light("on")  # switched on again by hand while the motion lasts: held, no off while the motion lasts
    t = w.tr()
    assert "waiting" not in t["motionLight"] and t["verdict"] is True and t["last"]["reason"] == "found on"
    w.advance(T0 + 600)
    assert w.calls == []
    w.pir("off")
    w.advance(T0 + 780)
    assert w.calls == [OFF]


def test_waiting_ends_on_auto_button_and_on_changed_save():
    w = lit([ml_rule(buttons=("btn",))])
    w.light("off")
    assert w.ml()["waiting"] is True
    w.press("btn", "auto")
    t = w.tr()
    assert w.calls == [ON] and "waiting" not in t["motionLight"] and t["verdict"] is True

    w = lit([ml_rule(buttons=("btn",))])
    w.light("off")
    w.press("btn", "toggle")  # manual ends it too
    assert w.calls == [ON] and "waiting" not in w.ml()

    w = lit()
    w.light("off")
    w.load([ml_rule(name="Renamed")])  # unchanged: the wait stays
    assert w.calls == [] and w.ml()["waiting"] is True
    w.load([ml_rule(off=60)])  # changed: starts anew
    assert w.calls == [ON] and "waiting" not in w.ml()


def test_released_drops_owed_offs():
    def setup():
        w = loaded([ml_rule(), pair_rule()])
        w.calls.clear()  # the pair's start off
        w.pir("on", 2)  # the pair switches the lamp on
        assert w.calls == [ON]
        w.light("on", own=True)  # confirms: this rule holds it as found on
        assert w.tr()["verdict"] is True
        w.pir("off", 2)
        assert w.calls == [ON] and w.tr("cr")["last"]["reason"] == "kept on by Light motion control"  # the pair's off is owed
        w.calls.clear()
        return w

    w = setup()
    w.load([pair_rule()])  # control: this rule goes away and the owed off is paid
    assert w.calls == [OFF]
    w = setup()
    w.light("off")  # by hand while this rule holds it: released, the owed off dropped
    w.light("on")  # by hand again
    w.load([pair_rule()])
    assert w.calls == []


def test_consumer_follows_released_and_found():
    w = loaded([ml_rule(), consumer_rule()])
    w.calls.clear()  # the consumer's start off
    w.pir("on")
    assert w.tr()["verdict"] is True and w.tr("c")["verdict"] is True and w.calls == [ON, ON2]
    w.light("on", own=True)
    w.set("light.k2", "on", own=True)
    w.calls.clear()
    w.light("off")  # switched off elsewhere: released
    assert w.tr()["verdict"] is False and w.tr("c")["verdict"] is False and w.calls == [OFF2]
    w.set("light.k2", "off", own=True)
    w.pir("off")
    w.advance(T0 + 30)
    w.light("on")  # switched on elsewhere with no motion: found
    assert w.tr()["verdict"] is True and w.tr()["last"]["reason"] == "found on"
    assert w.tr("c")["verdict"] is True and w.calls == [OFF2, ON2]


def test_consumer_follows_manual_and_auto():
    w = loaded([ml_rule(buttons=("btn",)), consumer_rule()])
    w.pir("on")
    w.light("on", own=True)
    w.set("light.k2", "on", own=True)
    assert w.tr("c")["verdict"] is True and w.tr("c")["inputs"][0]["value"] is True
    w.calls.clear()
    w.press("btn", "set", "on")  # manual (the lamp is on already: nothing sent)
    assert w.tr()["verdict"] is None and w.ml()["mode"] == "manual"
    assert w.tr("c")["inputs"][0]["value"] is None  # re-evaluated: its input is unknown
    w.press("btn", "auto")  # auto with the light on: held
    assert w.tr()["verdict"] is True and w.tr("c")["verdict"] is True and w.tr("c")["inputs"][0]["value"] is True
    assert OFF2 not in w.calls


def test_light_found_on_is_held():
    """Review focus 4."""
    w = loaded(light__k="on")
    t = w.tr()
    assert w.calls == [] and t["verdict"] is True and t["motionLight"]["offAt"] == (T0 + 180) * 1000
    w.advance(T0 + 179)
    assert w.calls == []
    w.advance(T0 + 180)
    assert w.calls == [OFF]
    w = loaded(light__k="on", binary_sensor__pir1="on")
    w.advance(T0 + 3600)
    assert w.calls == [] and w.tr()["verdict"] is True


def test_found_on_is_recorded():
    w = loaded([ml_rule(buttons=("btn",))], light__k="on")
    last = w.tr()["last"]
    assert last == {"action": "on", "target": "Lamp", "at": T0 * 1000, "reason": "found on", "sent": False}
    w.press("btn", "set", "on")  # manual, already on
    w.pir("on")
    w.press("btn", "auto")  # motion while dark, the light on: held, the mode entry stays the last one
    assert w.tr()["last"]["reason"] == "button: auto" and w.tr()["verdict"] is True and w.calls == []


def test_switched_on_by_another_slot_participant_is_held():
    w = loaded([ml_rule(), timed_rule()])
    w.press("tb", "set", "on")
    assert w.calls == [ON]
    w.light("on", own=True)
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and t["verdict"] is True
    w.advance(T0 + 60)  # the timed run ends: its off is kept back while this rule holds the lamp
    assert w.calls == [ON] and w.tr("t")["last"]["reason"] == "kept on by Light motion control"
    w.advance(T0 + 179)
    assert w.calls == [ON]
    w.advance(T0 + 180)
    assert w.calls == [ON, OFF]


# --- no motion sensors ---------------------------------------------------------------------

def test_no_sensors_auto_is_inert():
    """Review focus 3."""
    w = loaded([ml_rule(sensors=(), buttons=("btn",))], light__k="on")
    t = w.tr()
    assert w.calls == [] and t["verdict"] is None and "last" not in t and t["status"] == "ok" and "holders" not in t
    assert t["motionLight"] == {"mode": "auto", "motion": False, "sensors": [], "dark": None, "light": "on"}
    w.advance(T0 + 3600)
    w.light("off")
    w.light("on")
    t = w.tr()
    assert w.calls == [] and t["verdict"] is None and "last" not in t and t["motionLight"]["mode"] == "auto"
    w.press("btn", "toggle")
    assert w.calls == [OFF] and w.ml()["mode"] == "manual" and w.saved[-1] == {"p": {"m": {"mode": "manual", "since": T0 + 3600, "by": "button"}}}
    w.light("off", own=True)
    w.press("btn", "auto")
    t = w.tr()
    assert w.calls == [OFF] and t["motionLight"]["mode"] == "auto" and t["verdict"] is None and w.saved[-1] == {}
    assert t["last"]["reason"] == "button: auto"
    w.light("on")
    w.advance(T0 + 7200)
    assert w.calls == [OFF] and w.tr()["verdict"] is None and w.tr()["last"]["reason"] == "button: auto"


def test_no_sensors_does_not_hold_a_shared_light():
    w = loaded([ml_rule(sensors=()), timed_rule()])
    w.press("tb", "set", "on")
    w.light("on", own=True)
    w.advance(T0 + 60)  # the timed run ends: nobody else keeps the lamp on
    assert w.calls == [ON, OFF] and w.tr()["verdict"] is None


def test_no_sensors_auto_again_counts_from_manual():
    w = loaded([ml_rule(sensors=(), buttons=("btn",), auto_after=10)])
    w.press("btn", "toggle")  # manual at T0
    assert w.calls == [ON] and w.ml()["autoAt"] == (T0 + 600) * 1000
    w.light("on", own=True)
    w.advance(T0 + 599)
    assert w.ml()["mode"] == "manual"
    w.advance(T0 + 600)
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and t["last"]["reason"] == "auto again" and w.calls == [ON]
    assert t["verdict"] is None and not w.pending()


# --- store, start, Save -----------------------------------------------------------------

def test_mode_is_persisted_and_restored():
    """Review focus 5."""
    w = loaded([ml_rule(buttons=("btn",))])
    w.press("btn", "toggle")
    assert w.saved[-1] == {"p": {"m": {"mode": "manual", "since": T0, "by": "button"}}}
    assert w.engine.motion_modes() == w.saved[-1]
    w.press("btn", "auto")
    assert w.saved[-1] == {}

    w = MWorld(binary_sensor__pir1="on")
    w.load([ml_rule(buttons=("btn",))], boot=True,
           motion_modes={"p": {"m": {"mode": "manual", "since": T0, "by": "button"}}})
    assert w.calls == [] and w.ml()["mode"] == "manual" and w.saved == []
    w.engine.started()
    assert w.calls == [] and w.ml()["mode"] == "manual" and w.tr()["verdict"] is None
    w.load([ml_rule(buttons=("btn",), name="Renamed")])
    assert w.ml()["mode"] == "manual"
    w.load([ml_rule(buttons=("btn",), off=60)])  # changed, same light and buttons
    assert w.ml()["mode"] == "manual" and w.calls == []
    w.load([ml_rule(buttons=("btn",), light="lamp2")])
    assert w.ml()["mode"] == "auto" and w.calls == [("light", "turn_on", "light.k2")] and w.saved[-1] == {}


def test_stored_manual_of_0_22_0_is_ignored():
    """0.22.0 stored a manual entered by a switch elsewhere, without "by": the rule starts in auto."""
    w = MWorld(light__k="on")
    w.load([ml_rule(buttons=("btn",))], boot=True, motion_modes={"p": {"m": {"mode": "manual", "since": 1000.0}}})
    w.engine.started()
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and t["verdict"] is True and t["last"]["reason"] == "found on"
    assert w.engine.motion_modes() == {} and w.saved[-1] == {}
    w.advance(T0 + 179)
    assert w.calls == []
    w.advance(T0 + 180)
    assert w.calls == [OFF]


def test_a_stored_record_of_an_unknown_rule_or_auto_is_dropped():
    w = MWorld()
    w.load(boot=True, motion_modes={"p": {"gone": {"mode": "manual", "since": T0}, "m": {"mode": "auto"}}, "q": 5})
    assert w.engine.motion_modes() == {} and w.saved[-1] == {}


def test_boot_auto_waits_for_started():
    w = MWorld(binary_sensor__pir1="on")
    w.load(boot=True)
    assert w.calls == [] and w.ml()["mode"] == "auto"
    w.pir("off")
    w.pir("on")
    assert w.calls == []
    w.engine.started()
    assert w.calls == [ON] and w.tr()["verdict"] is True


def test_changed_save_holds_a_light_on():
    w = lit()
    w.load([ml_rule(off=60)])
    w.pir("off")
    w.advance(T0 + 60)
    assert w.calls == [OFF] and w.ml()["mode"] == "auto"


def test_disabled_or_deleted_sends_nothing():
    w = lit([ml_rule(auto_after=10)])
    w.pir("off")
    w.load([ml_rule(auto_after=10, enabled=False)])
    t = w.tr()
    assert w.calls == [] and not w.pending() and t["status"] == "disabled" and t["verdict"] is None
    w.light("off")  # a disabled rule ignores switches elsewhere
    w.pir("on")
    assert w.calls == [] and w.ml()["mode"] == "auto" and "waiting" not in w.ml()
    w = lit()
    w.pir("off")
    w.load([])
    w.advance(T0 + 3600)
    assert w.calls == [] and not w.pending()
    w = lit([ml_rule(buttons=("btn",), auto_after=10)])
    w.pir("off")
    w.press("btn", "toggle")  # manual with the auto-return armed
    assert w.pending()
    w.load([])
    assert not w.pending() and w.saved[-1] == {}
    w = loaded([ml_rule(sensors=(), buttons=("btn",), auto_after=10)])
    w.press("btn", "toggle")  # no motion sensors: the auto-return is armed too
    assert w.pending()
    w.load([ml_rule(sensors=(), buttons=("btn",), auto_after=10, enabled=False)])
    assert not w.pending()


def test_missing_device_is_a_static_problem():
    for r in (ml_rule(sensors=("nope",)), ml_rule(sensors=("ls",)), ml_rule(buttons=("pir2",)), ml_rule(buttons=("ws",)),
              ml_rule(daylight=("pir2", "night")), ml_rule(light="nope")):
        w = loaded([r], binary_sensor__pir1="on")
        w.pir("on", 2)
        t = w.tr()
        assert t["status"] == "error" and t["reason"] == "device missing" and w.calls == [], r
    w = loaded([ml_rule(light="pir2")], binary_sensor__pir1="on")
    assert w.tr()["reason"] == "target missing" and w.calls == []


def test_entities_are_tracked():
    w = loaded([ml_rule(sensors=("pir1", "pir2"), daylight=("ls", "dark"))])
    assert {"light.k", "binary_sensor.pir1", "binary_sensor.pir2", "sensor.lux"} <= w.engine.entity_ids()


def test_trace_shape():
    w = lit([ml_rule(daylight=("ls", "dark"), min_on=60, off=30)])
    assert w.ml() == {
        "mode": "auto", "motion": True, "sensors": [{"id": "pir1", "name": "Motion 1", "state": "on"}],
        "dark": True, "daylight": {"state": "night", "detail": "night, 5 lx"}, "light": "on",
        "minUntil": (T0 + 60) * 1000,
    }
    w.advance(T0 + 5)
    w.pir("off")
    t = w.tr()
    assert t["motionLight"]["offAt"] == (T0 + 60) * 1000 == t["pending"]["at"]
    assert t["motionLight"]["minUntil"] == (T0 + 60) * 1000 and t["motionLight"]["motion"] is False
    w.advance(T0 + 60)
    assert "offAt" not in w.ml() and "minUntil" not in w.ml() and w.ml()["light"] == "on"
    w = loaded(binary_sensor__pir1="unavailable", light__k="unavailable")
    assert w.ml() == {"mode": "auto", "motion": False, "sensors": [{"id": "pir1", "name": "Motion 1", "state": None}],
                      "dark": None, "light": None}
