"""Tests for the Light motion control rule in the pure rule engine (spec light motion control §4)."""

import copy

from containers import WallSwitch
from expected import Expected, expect, passing
import motion_light
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
WS = dev("ws", "wall_switch", "Dimmer", state="light.k")  # the lamp's own relay
WS["props"]["autoByDoubleToggle"] = True
WSP = dev("wsp", "wall_switch", "Plain switch", state="light.k")  # the lamp's own relay, no double toggle
WS2 = dev("ws2", "wall_switch", "Switch 2", state="switch.ws2")  # a relay of its own: a remote for the lamp
WS2["props"]["autoByDoubleToggle"] = True
WSX = dev("wsx", "wall_switch", "Unbound switch")  # no state entity
# the Entrance (live shape): a wall light and a wall switch bound to the same relay, window 3 s
ENT = dev("ent", "wall_light", "Light entrance", control="switch.entrance")
SWE = dev("swe", "wall_switch", "Switch entrance", state="switch.entrance")
SWE["props"].update(autoByDoubleToggle=True, windowSec=3)
TB = dev("tb", "smart_button", "Timer button", action="sensor.tact")
# the sleep blocker (spec virtual switch §4): the virtual switch Sleep (kept by the integration, entity virtual.<id>),
# the round button toggling it through a Load control rule, any other on / off device
VS = dev("vs", "virtual_switch", "Sleep", control="virtual.vs")
RB = dev("rb", "smart_button", "Round button: Sleep", action="sensor.ract")
SOCK = dev("sock", "socket", "Socket", control="switch.sock")
SOCKX = dev("sockx", "socket", "Unbound socket")  # no control entity: cannot be read as an on / off input
LS60 = sensor("ls60", "LightSensor 60", debounce=60)  # the same lux entity, debounced 60 s
# motion sensors of the neighbouring zones (spec presence hold §3)
PIR3 = dev("pir3", "motion_sensor", "Motion Entrance", motion="binary_sensor.pir3")
PIR4 = dev("pir4", "motion_sensor", "Motion Transit", motion="binary_sensor.pir4")
DEVICES = [LAMP, LAMP2, PIR1, PIR2, LS, BTN, WS, WSP, WS2, WSX, ENT, SWE, TB, VS, RB, SOCK, SOCKX, LS60, PIR3, PIR4]
ON, OFF = ("light", "turn_on", "light.k"), ("light", "turn_off", "light.k")
ON2, OFF2 = ("light", "turn_on", "light.k2"), ("light", "turn_off", "light.k2")
E_ON, E_OFF = ("switch", "turn_on", "switch.entrance"), ("switch", "turn_off", "switch.entrance")
VS_ON, VS_OFF = ("virtual", "turn_on", "virtual.vs"), ("virtual", "turn_off", "virtual.vs")
DAY, NIGHT, DUSK = lux(100), lux(5), lux(30)
T0 = 1000.0


def ml_rule(rid="m", sensors=("pir1",), daylight=None, min_on=0, off=180, buttons=(), auto_after=0, light="lamp",
            name="Light motion control", blocker=None, presence=False, neighbours=None, **extra):
    m = {"light": light, "sensors": list(sensors), "minOn": min_on, "buttons": list(buttons), "autoAfter": auto_after}
    if daylight is not None:
        m["daylight"] = {"sensor": daylight[0], "is": daylight[1]}
    if blocker is not None:
        m["blocker"] = {"device": blocker[0], "is": blocker[1]}
    if presence:
        m["presence"] = True
    if neighbours is not None:
        m["neighbours"] = list(neighbours)
    return rule(rid, [], name=name, off_delay=off, motionLight=m, **extra)


def sleep_rule(rid="sb"):
    """Load control "Sleep button" (spec virtual switch §5): the round button's toggle toggles the virtual switch."""
    return rule(rid, [], name="Sleep button",
                control={"sources": [{"button": "rb"}], "on": [], "off": [], "toggle": [{"device": "vs", "do": "toggle"}]})


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
                "sensor__lux": NIGHT, "virtual__vs": "off", "switch__sock": "off", "binary_sensor__pir3": "off",
                "binary_sensor__pir4": "off"}
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

    def sleep(self, state):
        """The virtual switch Sleep changes as the runtime applies a command to it: at once, Plan Studio's context."""
        self.set("virtual.vs", state, own=True)

    def tr(self, rid="m"):
        return self.engine.snapshot("p")[rid]

    def ml(self, rid="m"):
        return self.tr(rid)["motionLight"]


class SWorld(MWorld):
    """MWorld whose wall switches flip as live.py delivers it: a state change is Plan Studio's own by its context or
    as the first arrival of the state its latest command expects (expected.py, however late); the wall switch
    containers' intents reach the engine first, then the state change."""

    def __init__(self, switches=(WS,), **states):
        self.expected = Expected()
        super().__init__(**states)
        self.switches = {d["id"]: WallSwitch(d, self.lookup) for d in switches}

    def call(self, domain, service, eid, on_error=None, current=None, by=None):
        state = expect(domain, service)
        if state is not None:
            self.expected.sent(eid, state, self.t, by)
        return super().call(domain, service, eid, on_error, current, by)

    def change(self, eid, state, ctx=False):
        """One state change of the entity; ctx: it carries Plan Studio's context."""
        old, new = self.states.get(eid), (state, {})
        self.states[eid] = new
        was = old[0] if old is not None else None
        own = ctx
        if was != state:
            own = self.expected.arrived(eid, state, self.t, back=passing(was)) or own
        for did, c in self.switches.items():
            for intent in c.handle(eid, old, new, self.t, own):
                self.engine.on_intent("p", did, intent)
        self.engine.handle_state(eid, own=own)


def entrance(**states):
    """The Entrance: Light entrance switched by its own relay "Switch entrance" (the button), two motion sensors, no
    daylight sensor, off after 180 s, no auto-return."""
    w = SWorld(switches=(SWE,), **{"switch__entrance": "off", **states})
    w.load([ml_rule(light="ent", sensors=("pir1", "pir2"), buttons=("swe",))])
    return w


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


def test_ident_and_button_kinds():
    """Buttons: smart buttons and wall switches with a bound state entity (spec §12); anything else is missing."""
    m = make()
    assert m.ident == ("light.k", ("btn",)) and not m.missing and not m.waiting and m.relays == set()
    m = make(buttons=["btn", "ws", "ws2"])
    assert not m.missing and m.relays == {"ws"}  # only a wall switch over the light's own entity is its relay
    for bad in ("wsx", "pir1", "lamp2", "nope"):
        assert make(buttons=[bad]).missing, bad
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


def test_daylight_blocks_switching_on():
    """Review focus 3. Since 0.26.0 (spec virtual switch §4a) the block no longer applies to switching on only: the
    daylight coming switches a held light off at once, so a sensor that sees the lamp switches it off (known limit)."""
    w = loaded([ml_rule(daylight=("ls", "night"))], sensor__lux=DAY)
    w.pir("on")
    assert w.calls == [] and w.tr()["verdict"] is False
    w.set("sensor.lux", *NIGHT)
    assert w.calls == [ON]
    w.light("on", own=True)
    w.set("sensor.lux", *DAY)  # the sensor sees the lamp: off at once although the motion lasts
    assert w.calls == [ON, OFF] and w.tr()["verdict"] is False


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
    w.press("btn", "auto")  # again, before the lamp confirms the off: the off on its way counts as off (0.26.0)
    assert w.calls == [OFF]
    w.light("off", own=True)
    t = w.tr()
    assert t["verdict"] is False and t["motionLight"]["mode"] == "auto" and "waiting" not in t["motionLight"]
    assert t["motionLight"]["light"] == "off"
    w.advance(T0 + 3600)
    assert w.calls == [OFF]


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
    for r in (ml_rule(sensors=("nope",)), ml_rule(sensors=("ls",)), ml_rule(buttons=("pir2",)), ml_rule(buttons=("wsx",)),
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


# --- a wall switch as the button (spec §12) ------------------------------------------------------

def test_entrance_one_flip_is_manual_and_sends_nothing():
    """Review focus 1: the light's own relay is the button: a hand flip on is manual, nothing is sent, the light stays
    on and is not "found on"; motion then does nothing."""
    w = entrance()
    assert w.tr()["verdict"] is False and w.ml()["mode"] == "auto"
    w.change("switch.entrance", "on")
    t = w.tr()
    assert w.calls == [] and t["motionLight"]["mode"] == "manual" and t["verdict"] is None
    assert t["last"] == {"action": "on", "target": "Light entrance", "at": T0 * 1000, "reason": "button: manual",
                         "sent": False}
    assert t["motionLight"]["light"] == "on" and t["status"] == "ok"
    assert w.saved[-1] == {"p": {"m": {"mode": "manual", "since": T0, "by": "button"}}}
    w.advance(T0 + 10)
    w.pir("on")
    w.pir("on", 2)
    w.pir("off")
    w.pir("off", 2)
    w.advance(T0 + 3600)
    t = w.tr()
    assert w.calls == [] and t["motionLight"]["mode"] == "manual" and t["last"]["reason"] == "button: manual"


def test_entrance_flip_off_under_motion_is_manual_and_a_second_flip_is_auto():
    """Review focus 2: held under motion; a hand flip off: manual, stays off, no wait for new motion; a second flip
    on within 3 s: auto at once, motion: held, nothing sent."""
    w = entrance()
    w.pir("on")
    assert w.calls == [E_ON]
    w.change("switch.entrance", "on")  # its confirmation
    assert w.ml()["mode"] == "auto" and w.tr()["verdict"] is True
    w.calls.clear()
    w.advance(T0 + 30)
    w.change("switch.entrance", "off")  # the person
    t = w.tr()
    assert w.calls == [] and t["motionLight"]["mode"] == "manual" and t["verdict"] is None
    assert "waiting" not in t["motionLight"] and t["motionLight"]["light"] == "off"
    assert t["last"] == {"action": "off", "target": "Light entrance", "at": (T0 + 30) * 1000,
                         "reason": "button: manual", "sent": False}
    w.pir("on")  # the motion continues
    assert w.calls == [] and w.ml()["light"] == "off"
    w.advance(T0 + 32)
    w.change("switch.entrance", "on")  # the second flip within the window: auto
    t = w.tr()
    assert w.calls == [] and t["motionLight"]["mode"] == "auto" and t["verdict"] is True
    assert t["last"]["reason"] == "button: auto" and "waiting" not in t["motionLight"] and w.saved[-1] == {}
    w.pir("off")
    w.advance(T0 + 211)
    assert w.calls == []
    w.advance(T0 + 212)
    assert w.calls == [E_OFF] and w.ml()["mode"] == "auto"


def test_entrance_double_flip_ending_on_without_motion_switches_off_at_once():
    """Review focus 2: the double flip ends on, no motion: off at once; the flip's own change is no "found on"."""
    w = entrance()
    w.pir("on")
    w.change("switch.entrance", "on")  # its confirmation
    w.pir("off")
    w.calls.clear()
    w.advance(T0 + 30)
    w.change("switch.entrance", "off")  # manual
    w.advance(T0 + 31)
    w.change("switch.entrance", "on")  # auto
    t = w.tr()
    assert w.calls == [E_OFF] and t["motionLight"]["mode"] == "auto" and t["verdict"] is False
    assert t["last"]["action"] == "off" and t["last"]["reason"] == "back to auto: no motion" and "sent" not in t["last"]
    w.change("switch.entrance", "off")  # the off arrives
    t = w.tr()
    assert w.calls == [E_OFF] and t["motionLight"]["mode"] == "auto" and t["verdict"] is False
    assert "waiting" not in t["motionLight"] and t["last"]["reason"] == "back to auto: no motion"
    w.advance(T0 + 3600)
    assert w.calls == [E_OFF]
    w.pir("on")
    assert w.calls == [E_OFF, E_ON]


def test_entrance_double_flip_from_off_with_motion_switches_on_at_once():
    """Review focus 3: off -> on -> off within 3 s with motion: auto, the light switched on at once; the flip's own
    change is no "switched off elsewhere"."""
    w = entrance()
    w.change("switch.entrance", "on")  # manual
    w.advance(T0 + 10)
    w.change("switch.entrance", "off")  # outside the window: manual again
    w.pir("on")
    assert w.calls == [] and w.ml()["mode"] == "manual"
    w.advance(T0 + 20)
    w.change("switch.entrance", "on")
    w.advance(T0 + 21)
    w.change("switch.entrance", "off")  # within the window: auto
    t = w.tr()
    assert w.calls == [E_ON] and t["motionLight"]["mode"] == "auto" and t["verdict"] is True
    assert t["last"]["action"] == "on" and t["last"]["reason"] == "back to auto: motion"
    assert "waiting" not in t["motionLight"]
    w.advance(T0 + 22)
    w.change("switch.entrance", "on")  # the on arrives
    t = w.tr()
    assert w.calls == [E_ON] and t["motionLight"]["mode"] == "auto" and t["verdict"] is True
    assert t["last"]["reason"] == "back to auto: motion"
    w.pir("off")
    w.advance(T0 + 201)
    assert w.calls == [E_ON]
    w.advance(T0 + 202)
    assert w.calls == [E_ON, E_OFF]


def test_entrance_own_commands_are_never_presses():
    """Review focus 4: the rule's own on / off confirmed 7 s late (no Plan Studio context, the expected state) is no
    press: the mode stays auto; it does not open the double toggle window either."""
    w = entrance()
    w.pir("on")
    assert w.calls == [E_ON]
    w.advance(T0 + 7)
    w.change("switch.entrance", "on")
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and t["verdict"] is True and t["last"]["reason"].startswith("became true")
    w.pir("off")
    w.advance(T0 + 187)
    assert w.calls == [E_ON, E_OFF]
    w.advance(T0 + 194)
    w.change("switch.entrance", "off")
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and t["verdict"] is False and "waiting" not in t["motionLight"]
    assert t["last"]["action"] == "off" and w.engine.motion_modes() == {} and w.saved == []
    w.advance(T0 + 195)
    w.change("switch.entrance", "on")  # the person, 1 s after the rule's own change: one flip, not a double one
    t = w.tr()
    assert t["motionLight"]["mode"] == "manual" and t["last"]["reason"] == "button: manual"
    assert w.calls == [E_ON, E_OFF]


def test_wall_switch_over_another_entity_sets_the_light():
    """Review focus 5: a wall switch over another relay sets the light to the flipped value (direct command) and
    manual; its double flip is auto; a change of the light by hand is foreign as usual (held in auto)."""
    w = SWorld(switches=(WS2,), switch__ws2="off")
    w.load([ml_rule(buttons=("ws2",))])
    w.change("switch.ws2", "on")
    t = w.tr()
    assert w.calls == [ON] and t["motionLight"]["mode"] == "manual"
    assert t["last"] == {"action": "on", "target": "Lamp", "at": T0 * 1000, "reason": "button: manual"}
    w.change("light.k", "on")  # its confirmation
    assert w.calls == [ON] and w.ml()["mode"] == "manual"
    w.advance(T0 + 10)
    w.change("switch.ws2", "off")
    assert w.calls == [ON, OFF] and w.ml()["mode"] == "manual"
    w.change("light.k", "off")
    w.advance(T0 + 20)
    w.change("switch.ws2", "on")
    w.change("light.k", "on")
    w.advance(T0 + 21)
    w.change("switch.ws2", "off")  # within the window: auto, no motion: off at once
    t = w.tr()
    assert w.calls == [ON, OFF, ON, OFF] and t["motionLight"]["mode"] == "auto" and t["verdict"] is False
    assert t["last"]["reason"] == "back to auto: no motion"
    w.change("light.k", "off")  # its confirmation
    w.advance(T0 + 40)
    w.change("light.k", "on")  # by hand: switched on elsewhere, held
    t = w.tr()
    assert t["motionLight"]["mode"] == "auto" and t["verdict"] is True and t["last"]["reason"] == "found on"
    w.advance(T0 + 220)
    assert w.calls == [ON, OFF, ON, OFF, OFF]


def test_wall_switch_without_double_toggle_stays_manual():
    """Without "Auto by double toggle" two quick flips are two manual flips."""
    w = SWorld(switches=(WSP,))
    w.load([ml_rule(buttons=("wsp",))])
    w.change("light.k", "on")
    w.advance(T0 + 1)
    w.change("light.k", "off")
    t = w.tr()
    assert w.calls == [] and t["motionLight"]["mode"] == "manual" and t["verdict"] is None
    assert t["last"] == {"action": "off", "target": "Lamp", "at": (T0 + 1) * 1000, "reason": "button: manual",
                         "sent": False}
    w.pir("on")
    assert w.calls == [] and w.ml()["mode"] == "manual"


def test_wall_switch_flip_while_ha_starts_is_no_press():
    w = SWorld()
    w.load([ml_rule(buttons=("ws",))], boot=True)
    w.change("light.k", "on")
    assert w.calls == [] and w.ml()["mode"] == "auto" and w.engine.motion_modes() == {}
    w.engine.started()
    t = w.tr()
    assert w.calls == [] and t["motionLight"]["mode"] == "auto" and t["verdict"] is True
    assert t["last"]["reason"] == "found on"
    w.advance(T0 + 180)
    assert w.calls == [OFF]


def test_manual_by_a_wall_switch_is_stored_and_restored():
    w = SWorld()
    w.load([ml_rule(buttons=("ws",))])
    w.change("light.k", "on")
    stored = w.saved[-1]
    assert stored == {"p": {"m": {"mode": "manual", "since": T0, "by": "button"}}}
    w = SWorld(light__k="on", binary_sensor__pir1="on")
    w.load([ml_rule(buttons=("ws",))], boot=True, motion_modes=stored)
    w.engine.started()
    assert w.calls == [] and w.ml()["mode"] == "manual" and w.tr()["verdict"] is None
    w.advance(T0 + 10)
    w.change("light.k", "off")
    w.advance(T0 + 11)
    w.change("light.k", "on")  # a double flip: auto, motion, the light on: held
    t = w.tr()
    assert w.calls == [] and t["motionLight"]["mode"] == "auto" and t["verdict"] is True and w.saved[-1] == {}


# --- the sleep blocker (spec virtual switch §4) ---------------------------------------------------------------------

def test_blocker_follows_the_known_reading():
    devices = {d["id"]: d for d in DEVICES}
    raw = {"light": "lamp", "sensors": ["pir1"], "minOn": 0, "buttons": [], "autoAfter": 0,
           "daylight": {"sensor": "ls", "is": "dark"}, "blocker": {"device": "vs", "is": "on"}}
    m = MotionLight(raw, devices, "light.k", "virtual.vs")
    assert m.blocker == ("vs", "on") and m.blocked is None and not m.missing
    # the blocker is the last input, true (after NOT) while it does not read `is`: the rule may act
    assert m.inputs()[-1] == {"source": {"device": "vs"}, "not": True}
    assert m.block([False, True, False]) is None and m.blocked is True  # the rule's first evaluation is no change
    assert m.block([False, True, True]) == "end" and m.blocked is False
    assert m.block([False, True, True]) is None
    assert m.block([False, True, False]) == "start" and m.blocked is True
    assert m.block([False, True, None]) is None and m.blocked is True  # no data keeps a block
    assert m.block([False, True, False]) is None
    assert m.block([False, True, None]) is None
    assert m.block([False, True, True]) == "end" and m.blocked is False
    m = MotionLight(raw, devices, "light.k", "virtual.vs")
    assert m.block([False, True, None]) is None and m.blocked is False  # without data at the start: not blocking
    assert m.block([False, True, False]) == "start"
    off = MotionLight({**raw, "blocker": {"device": "vs", "is": "off"}}, devices, "light.k", "virtual.vs")
    assert off.inputs()[-1] == {"source": {"device": "vs"}, "not": False}
    assert MotionLight(raw, devices, "light.k", None).missing  # not readable as an on / off input
    for bad in ({"device": "vs", "is": "x"}, {"device": "", "is": "on"}, "vs"):
        m = MotionLight({**raw, "blocker": bad}, devices, "light.k", None)
        assert m.blocker is None and not m.missing and len(m.inputs()) == 2, bad
        assert m.block([False, True, False]) is None and not m.blocked, bad


def test_light_changed_while_blocked():
    m = make()
    m.blocked = True
    m.seen = "off"
    assert m.light_changed("on", False, True, False) is None  # switched on elsewhere: left alone, not held
    assert m.light_changed("off", False, True, True) is None  # switched off elsewhere: nothing to let go
    m.decide("off", 0, 10)
    m.seen = "on"
    assert m.light_changed("off", False, True, False, 1) is None and m.own == []  # its own echo is used up
    assert m.light_changed(None, False, True, False) is None
    assert m.light_changed("on", False, True, False) is None  # back from no data: no auto start while blocked
    m.blocked = False
    m.seen = "off"
    assert m.light_changed("on", False, True, False) == "found"


def test_sleep_switches_the_light_off_at_once_and_motion_does_nothing():
    """Review focus 3: the blocker is the virtual switch Sleep, toggled by a Load control rule from the round button
    (the runtime applies the toggle at once with Plan Studio's context)."""
    w = lit([ml_rule(blocker=("vs", "on")), sleep_rule()])
    t = w.tr()
    assert "blocked" not in t["motionLight"] and t["motionLight"]["blocker"] == {"name": "Sleep", "state": "off", "is": "on"}
    assert t["last"]["reason"] == "became true: Motion 1 motion, Sleep off"
    assert "virtual.vs" in w.engine.entity_ids()
    w.press("rb", "toggle")
    assert w.calls == [VS_ON]
    w.sleep("on")
    t = w.tr()
    assert w.calls == [VS_ON, OFF] and t["verdict"] is False and t["status"] == "ok" and not w.pending()
    assert t["motionLight"]["blocked"] is True and t["motionLight"]["blocker"]["state"] == "on"
    assert t["last"] == {"action": "off", "target": "Lamp", "at": T0 * 1000, "reason": "blocked"}
    assert "holders" not in t and t["motionLight"]["mode"] == "auto" and w.saved == []
    assert w.engine.still_wants(("p", "m"), "light.k", "off")  # the runtime may repeat an unconfirmed off
    w.light("off", own=True)  # its echo
    t = w.tr()
    assert t["verdict"] is False and "waiting" not in t["motionLight"] and t["last"]["reason"] == "blocked"
    w.advance(T0 + 60)
    w.pir("off")
    w.advance(T0 + 600)
    w.pir("on")  # new motion while asleep
    w.advance(T0 + 7200)
    assert w.calls == [VS_ON, OFF] and w.tr()["verdict"] is False and w.ml()["blocked"] is True
    w.press("rb", "toggle")
    assert w.calls[-1] == VS_OFF
    w.sleep("off")  # sleep ends while the motion lasts, dark: on at once
    t = w.tr()
    assert w.calls == [VS_ON, OFF, VS_OFF, ON] and t["verdict"] is True and "blocked" not in t["motionLight"]
    assert t["last"]["action"] == "on" and t["last"]["reason"] == "unblocked: motion"
    w.light("on", own=True)
    w.pir("off")
    w.advance(T0 + 7379)
    assert w.calls[-1] == ON
    w.advance(T0 + 7380)
    assert w.calls[-1] == OFF


def test_sleep_leaves_a_manual_light_alone():
    """Review focus 3: a light in manual stays as it is through sleep on and off."""
    w = loaded([ml_rule(buttons=("btn",), blocker=("vs", "on"))])
    w.press("btn", "toggle")  # manual: the lamp on
    w.light("on", own=True)
    w.pir("on")
    w.sleep("on")
    t = w.tr()
    assert w.calls == [ON] and t["motionLight"]["mode"] == "manual" and t["verdict"] is None
    assert "blocked" not in t["motionLight"] and t["last"]["reason"] == "button: manual"
    w.pir("off")
    w.advance(T0 + 3600)
    w.sleep("off")
    t = w.tr()
    assert w.calls == [ON] and t["motionLight"]["mode"] == "manual" and t["motionLight"]["light"] == "on"
    w.press("btn", "toggle")  # manual: the lamp off
    w.light("off", own=True)
    w.pir("on")
    w.sleep("on")
    w.sleep("off")
    assert w.calls == [ON, OFF] and w.ml()["mode"] == "manual" and w.tr()["verdict"] is None


def test_auto_entered_while_blocked_switches_off_at_once():
    for auto_after in (0, 10):
        w = loaded([ml_rule(buttons=("btn",), blocker=("vs", "on"), auto_after=auto_after)])
        w.press("btn", "toggle")  # manual at T0: the lamp on
        w.light("on", own=True)
        w.sleep("on")  # manual: nothing
        w.pir("on")
        w.pir("off")
        assert w.calls == [ON]
        if auto_after:
            w.advance(T0 + 600)
        else:
            w.press("btn", "auto")
        t = w.tr()
        assert w.calls == [ON, OFF] and t["motionLight"]["mode"] == "auto" and t["motionLight"]["blocked"] is True
        assert t["last"]["action"] == "off" and t["last"]["reason"] == "blocked" and t["verdict"] is False
        w.light("off", own=True)
        w.pir("on")
        w.advance(T0 + 3600)
        assert w.calls == [ON, OFF] and w.tr()["verdict"] is False
    w = loaded([ml_rule(buttons=("btn",), blocker=("vs", "on"))])
    w.press("btn", "set", "off")  # manual, already off
    w.sleep("on")
    w.pir("on")
    w.press("btn", "auto")  # blocked, the light off: nothing to send
    t = w.tr()
    assert w.calls == [] and t["motionLight"]["blocked"] is True and t["verdict"] is False
    assert t["last"]["reason"] == "button: auto"


def test_blocking_start_switches_off_an_on_on_its_way():
    w = loaded([ml_rule(blocker=("vs", "on"))])
    w.pir("on")
    assert w.calls == [ON]  # not confirmed yet: the rule holds the light
    w.sleep("on")
    assert w.calls == [ON, OFF] and w.tr()["last"]["reason"] == "blocked"
    w.light("on", own=True)  # the late on is the rule's own: not found on
    t = w.tr()
    assert t["verdict"] is False and t["last"]["reason"] == "blocked"
    w.light("off", own=True)
    w.advance(T0 + 3600)
    assert w.calls == [ON, OFF] and w.tr()["verdict"] is False
    w = loaded([ml_rule(blocker=("vs", "on"))])
    w.sleep("on")  # the light off and not held: nothing to send
    t = w.tr()
    assert w.calls == [] and t["motionLight"]["blocked"] is True and "last" not in t


def test_a_light_switched_on_while_blocked_is_left_alone():
    w = loaded([ml_rule(blocker=("vs", "on"))])
    w.sleep("on")
    w.light("on")  # by hand while asleep: not held, not switched off
    w.advance(T0 + 3600)
    w.pir("on")
    t = w.tr()
    assert w.calls == [] and t["verdict"] is False and t["motionLight"]["light"] == "on" and "last" not in t
    w.sleep("off")  # motion while dark, the light on: held
    t = w.tr()
    assert w.calls == [] and t["verdict"] is True and "blocked" not in t["motionLight"]
    w.pir("off")
    w.advance(T0 + 3779)
    assert w.calls == []
    w.advance(T0 + 3780)
    assert w.calls == [OFF]

    w = loaded([ml_rule(blocker=("vs", "on"))])
    w.sleep("on")
    w.light("on")
    w.advance(T0 + 60)
    w.sleep("off")  # no motion: off at once
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is False and t["last"]["reason"] == "unblocked: no motion"

    w = loaded([ml_rule(blocker=("vs", "on"), daylight=("ls", "dark"))], sensor__lux=DAY)
    w.sleep("on")
    w.light("on")
    w.pir("on")
    w.sleep("off")  # motion in daylight: off at once
    assert w.calls == [OFF] and w.tr()["last"]["reason"] == "unblocked: not dark"

    w = loaded([ml_rule(blocker=("vs", "on")), timed_rule()])  # switched on by another slot participant
    w.sleep("on")
    w.press("tb", "set", "on")
    assert w.calls == [ON]
    w.light("on", own=True)
    w.pir("on")
    t = w.tr()
    assert t["verdict"] is False and "last" not in t
    w.advance(T0 + 60)  # the timed run ends: its off is not kept back by this rule
    assert w.calls == [ON, OFF]


def test_a_blocker_without_data_does_not_block_and_no_data_keeps_a_block():
    w = loaded([ml_rule(blocker=("sock", "on"))], switch__sock="unavailable")
    w.pir("on")
    assert w.calls == [ON] and "blocked" not in w.ml()
    assert w.ml()["blocker"] == {"name": "Socket", "state": None, "is": "on"}
    w.light("on", own=True)
    w.set("switch.sock", "on")  # starts blocking: off at once
    assert w.calls == [ON, OFF] and w.ml()["blocked"] is True and w.tr()["last"]["reason"] == "blocked"
    w.light("off", own=True)
    w.set("switch.sock", "unavailable")  # no data keeps the block
    w.pir("off")
    w.pir("on")
    t = w.tr()
    assert w.calls == [ON, OFF] and t["motionLight"]["blocked"] is True and t["motionLight"]["blocker"]["state"] is None
    w.set("switch.sock", "on")
    assert w.calls == [ON, OFF] and w.ml()["blocked"] is True
    w.set("switch.sock", "unavailable")
    w.set("switch.sock", "off")  # the other known reading ends it: a fresh decision
    t = w.tr()
    assert w.calls == [ON, OFF, ON] and t["last"]["reason"] == "unblocked: motion" and "blocked" not in t["motionLight"]


def test_any_on_off_device_blocks_while_it_reads_the_chosen_state():
    w = loaded([ml_rule(blocker=("sock", "off"))])  # blocked while the socket reads off
    w.pir("on")
    assert w.calls == [] and w.ml()["blocked"] is True and w.tr()["verdict"] is False
    w.set("switch.sock", "on")
    assert w.calls == [ON] and w.tr()["last"]["reason"] == "unblocked: motion"
    for bad in (("nope", "on"), ("ls", "on"), ("btn", "on"), ("sockx", "on")):
        w = loaded([ml_rule(blocker=bad)])
        w.pir("on")
        t = w.tr()
        assert t["status"] == "error" and t["reason"] == "device missing" and w.calls == [], bad


def test_blocked_at_ha_start_or_a_changed_save_leaves_the_light_alone():
    w = MWorld(light__k="on", binary_sensor__pir1="on", virtual__vs="on")
    w.load([ml_rule(blocker=("vs", "on"))], boot=True)
    w.engine.started()
    t = w.tr()
    assert w.calls == [] and t["verdict"] is False and t["motionLight"]["blocked"] is True and "last" not in t
    w.advance(T0 + 3600)
    assert w.calls == []
    w.sleep("off")  # motion while dark, the light on: held
    assert w.calls == [] and w.tr()["verdict"] is True

    w = lit([ml_rule(blocker=("vs", "on"))])
    w.sleep("on")
    w.light("off", own=True)
    w.light("on")  # by hand while asleep
    w.load([ml_rule(blocker=("vs", "on"), off=60)])  # changed: starts anew, already blocked
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is False and t["motionLight"]["blocked"] is True
    w.load([ml_rule(blocker=("vs", "on"), off=60, name="Renamed")])  # unchanged: still blocked
    w.pir("on")
    assert w.calls == [OFF] and w.ml()["blocked"] is True
    w.load([ml_rule(off=60)])  # the blocker removed: the light found on is held
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is True and "blocked" not in t["motionLight"]
    assert t["last"]["reason"] == "found on" and "blocker" not in t["motionLight"]


def test_a_disabled_rule_ignores_the_blocker():
    w = lit([ml_rule(blocker=("vs", "on"))])
    w.load([ml_rule(blocker=("vs", "on"), enabled=False)])
    w.sleep("on")
    w.sleep("off")
    w.sleep("on")
    assert w.calls == [] and w.tr()["status"] == "disabled"
    w.load([ml_rule(blocker=("vs", "on"))])  # enabled again while asleep: blocked from the start, the light alone
    t = w.tr()
    assert w.calls == [] and t["motionLight"]["blocked"] is True and t["verdict"] is False
    w.sleep("off")  # motion while dark, the light on: held
    assert w.calls == [] and w.tr()["verdict"] is True


# --- daylight switches off too (spec virtual switch §4a) -------------------------------------------------------------

def test_day_came_between_known_readings():
    m = make(daylight={"sensor": "ls", "is": "night"})
    assert not m.day_came([False, False, True]) and m.met is True
    assert m.day_came([False, False, False])  # met -> not met
    assert not m.day_came([False, False, False])
    assert not m.day_came([False, False, True])
    assert not m.day_came([False, False, None])  # to no data
    assert not m.day_came([False, False, False])  # from no data: no change
    assert not make().day_came([False, False])  # no daylight sensor


def test_daylight_switches_the_light_off_at_once():
    """Review focus 4: morning: the debounced day switches the light off at once although the motion continues; it
    stays off while the motion goes on in daylight; dusk again with motion switches it on."""
    w = lit([ml_rule(daylight=("ls60", "dark"))])
    w.advance(T0 + 10)
    w.set("sensor.lux", *DAY)  # pending for 60 s
    w.advance(T0 + 69)
    w.pir("on")
    assert w.calls == [] and w.tr()["verdict"] is True
    w.advance(T0 + 70)
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is False and t["motionLight"]["dark"] is False and not w.pending()
    assert t["last"] == {"action": "off", "target": "Lamp", "at": (T0 + 70) * 1000, "reason": "daylight"}
    assert w.engine.still_wants(("p", "m"), "light.k", "off")
    w.pir("on")  # the motion continues before the off arrives
    assert w.calls == [OFF] and w.tr()["verdict"] is False
    w.light("off", own=True)  # its echo
    t = w.tr()
    assert t["verdict"] is False and "waiting" not in t["motionLight"] and t["last"]["reason"] == "daylight"
    w.pir("off")
    w.advance(T0 + 600)
    w.pir("on")  # still day
    assert w.calls == [OFF]
    w.set("sensor.lux", *DUSK)  # twilight is dark once it has held 60 s
    w.advance(T0 + 659)
    assert w.calls == [OFF]
    w.advance(T0 + 660)
    assert w.calls == [OFF, ON] and w.tr()["verdict"] is True


def test_daylight_is_night_switches_off_at_twilight_and_min_on_does_not_apply():
    w = lit([ml_rule(daylight=("ls", "night"), min_on=3600)])
    w.advance(T0 + 5)
    w.set("sensor.lux", *DUSK)  # twilight is not night
    t = w.tr()
    assert w.calls == [OFF] and t["last"]["reason"] == "daylight" and "minUntil" not in t["motionLight"]
    w = lit([ml_rule(daylight=("ls", "dark"))])
    w.set("sensor.lux", *DUSK)  # twilight is dark
    assert w.calls == [] and w.tr()["verdict"] is True


def test_daylight_switches_off_a_light_found_on():
    w = loaded([ml_rule(daylight=("ls", "dark"))], light__k="on")  # found on at the start
    w.set("sensor.lux", *DAY)
    assert w.calls == [OFF] and w.tr()["last"]["reason"] == "daylight"
    w = loaded([ml_rule(daylight=("ls", "dark"))])
    w.light("on")  # switched on elsewhere: held
    w.set("sensor.lux", *DAY)
    assert w.calls == [OFF] and w.tr()["last"]["reason"] == "daylight"


def test_daylight_leaves_manual_and_no_data_alone():
    w = loaded([ml_rule(buttons=("btn",), daylight=("ls", "dark"))])
    w.press("btn", "toggle")
    w.light("on", own=True)
    w.pir("on")
    w.set("sensor.lux", *DAY)
    assert w.calls == [ON] and w.ml()["mode"] == "manual"
    w = lit([ml_rule(daylight=("ls", "dark"))])
    w.set("sensor.lux", "unavailable")  # no data counts as dark
    w.set("sensor.lux", *DAY)  # day after no data is no change: held while the motion lasts
    assert w.calls == [] and w.tr()["verdict"] is True
    w.pir("off")
    w.advance(T0 + 179)
    assert w.calls == []
    w.advance(T0 + 180)
    assert w.calls == [OFF]


def test_no_flapping_between_blocked_and_daylight():
    w = lit([ml_rule(daylight=("ls", "dark"), blocker=("vs", "on"))])
    w.sleep("on")
    assert w.calls == [OFF] and w.tr()["last"]["reason"] == "blocked"
    w.light("off", own=True)
    w.light("on")  # by hand while asleep
    w.set("sensor.lux", *DAY)  # the day comes while blocked: nothing
    t = w.tr()
    assert w.calls == [OFF] and t["last"]["reason"] == "blocked" and t["motionLight"]["blocked"] is True
    w.sleep("off")  # motion in daylight, the light on: off at once
    t = w.tr()
    assert w.calls == [OFF, OFF] and t["last"]["reason"] == "unblocked: not dark"
    w.light("off", own=True)
    w.pir("on")
    assert w.calls == [OFF, OFF]
    w.set("sensor.lux", *NIGHT)
    assert w.calls == [OFF, OFF, ON] and w.tr()["last"]["reason"].startswith("became true")
    w.light("on", own=True)
    w.sleep("on")  # blocked at night
    w.light("off", own=True)
    w.set("sensor.lux", *DAY)
    w.sleep("off")  # the daylight change was taken while blocked: no "daylight" off later
    assert w.calls == [OFF, OFF, ON, OFF] and w.tr()["last"]["reason"] == "blocked"


# --- fix round 1: no daylight re-hold after a daylight off; an off on its way counts as off ----------------------------

def test_raw_after_a_daylight_off_and_its_reset():
    m = make(daylight={"sensor": "ls", "is": "night"})
    m.day_off = True  # a daylight off: the light being on no longer keeps it
    assert m.raw([True, False, False], True) is False
    assert m.raw([True, False, True], True) is True and m.raw([True, False, None], False) is True  # dark / no data
    assert not m.day_came([True, False, False]) and m.day_off
    assert not m.day_came([True, False, None]) and m.day_off  # no data is not "met"
    assert not m.day_came([True, False, True]) and not m.day_off  # the daylight condition is met again
    assert m.raw([True, False, False], True) is True  # a light found on in daylight is kept again


def test_a_daylight_off_kept_back_by_another_holder_is_not_undone_by_motion():
    """Probe P3: a Timer keeps the light on, so the daylight off is kept back; the motion goes on in daylight: the rule
    does not hold the light again; the Timer's end switches it off; dusk with motion switches it on."""
    w = lit([ml_rule(daylight=("ls", "dark")), timed_rule(minutes=10)])
    w.press("tb", "set", "on")  # already on: the timer holds it without a command
    w.set("sensor.lux", *DAY)
    t = w.tr()
    assert w.calls == [] and t["verdict"] is False and t["last"]["reason"] == "kept on by Timer"
    w.advance(T0 + 30)
    w.pir("on")  # the motion goes on in daylight, the light reads on
    t = w.tr()
    assert w.calls == [] and t["verdict"] is False and t["holders"] == ["Timer"]
    w.advance(T0 + 600)  # the timed run ends while the motion lasts: nobody keeps the light on
    assert w.calls == [OFF] and w.tr()["verdict"] is False
    w.light("off", own=True)
    w.pir("on")
    assert w.calls == [OFF]
    w.set("sensor.lux", *NIGHT)  # dark again with motion: on
    assert w.calls == [OFF, ON] and w.tr()["verdict"] is True


def test_a_lost_daylight_off_is_not_undone_by_motion():
    """Probe P3b: the daylight off is lost (the lamp keeps reading on): motion after the off's window sends no on
    while it is still day; dusk with motion switches it on."""
    w = lit([ml_rule(daylight=("ls", "dark"))])
    w.set("sensor.lux", *DAY)
    assert w.calls == [OFF]
    w.advance(T0 + 11)
    w.pir("on")
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is False and "holders" not in t
    w.advance(T0 + 600)
    w.pir("on")
    assert w.calls == [OFF]
    w.set("sensor.lux", *DUSK)  # twilight is dark: motion switches it on
    assert w.calls == [OFF, ON] and w.tr()["verdict"] is True


def test_a_hand_on_after_a_daylight_off_is_held_as_before():
    w = lit([ml_rule(daylight=("ls", "dark"))])
    w.set("sensor.lux", *DAY)
    w.light("off", own=True)
    w.advance(T0 + 30)
    w.light("on")  # by hand in daylight while the motion lasts: found on, held while the motion lasts
    t = w.tr()
    assert t["verdict"] is True and t["last"]["reason"] == "found on" and not w.pending()
    w.advance(T0 + 600)
    w.pir("on")
    assert w.calls == [OFF] and w.tr()["verdict"] is True
    w.pir("off")
    w.advance(T0 + 779)
    assert w.calls == [OFF]
    w.advance(T0 + 780)
    assert w.calls == [OFF, OFF]


def test_the_daylight_off_mark_ends_on_manual_and_on_a_changed_save():
    w = lit([ml_rule(buttons=("btn",), daylight=("ls", "dark"))])
    w.set("sensor.lux", *DAY)  # lost: the lamp keeps reading on
    w.press("btn", "set", "on")  # manual (already on: nothing sent)
    w.press("btn", "auto")  # a fresh decision in daylight: off
    assert w.calls == [OFF, OFF] and w.tr()["last"]["reason"] == "back to auto: not dark"
    w.advance(T0 + 12)
    w.pir("on")  # this off lost too: entering auto heals as before (test_lost_off_on_entering_auto_heals)
    assert w.calls == [OFF, OFF, ON] and w.tr()["verdict"] is True
    w = lit([ml_rule(daylight=("ls", "dark"))])
    w.set("sensor.lux", *DAY)  # lost: the lamp keeps reading on
    w.advance(T0 + 11)
    w.load([ml_rule(daylight=("ls", "dark"), off=60)])  # changed: the light found on is held
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is True and t["last"]["reason"] == "found on"
    w.pir("on")
    assert w.tr()["verdict"] is True and not w.pending()


def test_an_off_on_its_way_counts_as_off_when_sleep_ends():
    """Probe P1b: Sleep off within the dimmer's confirm latency after Sleep on, motion in the dark: the blocked off is
    still on its way, so the light counts as off and the rule switches it on (it does not hold a light going dark)."""
    w = lit([ml_rule(blocker=("vs", "on"))])
    w.sleep("on")
    assert w.calls == [OFF]
    w.advance(T0 + 2)
    w.sleep("off")  # the lamp still reads on
    t = w.tr()
    assert w.calls == [OFF, ON] and t["verdict"] is True and t["last"]["reason"] == "unblocked: motion"
    w.light("off", own=True)  # the blocked off lands: its own echo
    t = w.tr()
    assert t["verdict"] is True and "waiting" not in t["motionLight"]
    w.light("on", own=True)  # then the on
    t = w.tr()
    assert w.calls == [OFF, ON] and t["verdict"] is True and t["motionLight"]["light"] == "on"


# --- presence hold (spec presence hold §2-§3) ---------------------------------------------------------------------------

HOLD = 1800  # the fixed maximum hold (motion_light.HOLD_MAX)
PRESENT = {"presence": True, "neighbours": ("pir3",)}  # one neighbouring zone: Entrance with its motion sensor


def test_neighbours_are_motion_sensors_of_the_plan_and_only_with_presence():
    assert motion_light.HOLD_MAX == HOLD
    m = make(presence=True, neighbours=["pir3", "pir1", "lamp", "nope", "ls", "pir3", "pir4", 5])
    # the rule's own sensors, the light, devices missing from the plan or of another kind and repeats are ignored
    assert m.neighbours == ["pir3", "pir4"] and not m.missing
    assert m.inputs()[-2:] == [{"source": {"device": "pir3"}}, {"source": {"device": "pir4"}}]
    m = make(presence=True, neighbours=["pir3"], daylight={"sensor": "ls", "is": "dark"}, blocker={"device": "vs", "is": "on"})
    assert len(m.inputs()) == 5 and m.inputs()[4] == {"source": {"device": "pir3"}}  # after the blocker
    for raw in ({"neighbours": ["pir3"]}, {"presence": False, "neighbours": ["pir3"]}, {"presence": True},
                {"presence": True, "neighbours": "pir3"}):
        m = make(**raw)
        assert m.neighbours == [] and len(m.inputs()) == 2 and not m.missing, raw


def test_presence_table():
    """Arguments: values (the zone's sensor, the neighbour), now, the rule holds the light (amended spec §3: a
    departure counts from the zone's last motion start; the hold starts only at the zone's motion end)."""
    m = make(sensors=["pir1"], presence=True, neighbours=["pir3"])
    assert m.hold([False, False], 0, True) is False and m.hold_from is None  # held without a motion end: no hold
    assert m.hold([False, True], 5, True) is False and m.left == "Motion Entrance"  # off -> on: recorded
    assert m.hold([True, True], 10, True) is False and m.left is None  # the zone's motion starts: forgotten
    # the neighbour already read motion when the zone's motion started (someone came in from there): no departure
    assert m.hold([False, True], 70, True) is True and m.hold_from == 70  # the zone's motion ends: held
    assert m.hold_until(70) == 70 + HOLD
    assert m.hold([False, None], 80, True) is True  # no data tells nothing
    assert m.hold([False, True], 90, True) is True  # nor does a return from no data
    assert m.hold([False, False], 100, True) is True
    assert m.hold([False, True], 110, True) is False and m.left == "Motion Entrance"  # off -> on: may have left
    assert m.hold_until(110) is None
    assert m.hold([True, True], 120, True) is False and m.hold_from is None and m.left is None  # back in the zone
    assert m.hold([True, False], 125, True) is False
    # a departure while the zone still reads motion (its sensor's timeout after the last movement) is recorded
    assert m.hold([True, True], 130, True) is False and m.left == "Motion Entrance"
    assert m.hold([False, True], 190, True) is False and m.hold_from is None  # the zone clears: no hold, off delay
    assert m.hold([True, True], 200, True) is False and m.left is None  # back: the departure no longer counts
    assert m.hold([False, True], 260, True) is True and m.hold_from == 260
    assert m.hold([False, True], 260 + HOLD - 1, True) is True
    assert m.hold([False, True], 260 + HOLD, True) is False and m.left is None  # the maximum hold has passed
    assert m.hold([False, False], 260 + HOLD + 1, False) is False and m.hold_from is None  # the light let go
    # a motion end while the light is not held, then the light held: no hold (no motion end while held)
    assert m.hold([True, False], 3000, False) is False
    assert m.hold([False, False], 3060, False) is False and m.hold_from is None
    assert m.hold([False, False], 3070, True) is False and m.hold_from is None
    # the zone's sensor going from motion to no data is no motion end (a dead sensor: the off delay as before)
    assert m.hold([True, False], 3100, True) is False
    assert m.hold([None, False], 3110, True) is False and m.hold_from is None
    # read anew after unhold: a sensor reading motion then that clears later does start the hold
    m.hold([True, False], 3200, True)
    m.unhold()
    assert m.hold_from is None and m.left is None and m.zone_was == [] and m.next_to == []
    assert m.hold([False, False], 3210, True) is False and m.hold_from is None
    m.unhold()
    assert m.hold([True, False], 3300, True) is False
    assert m.hold([False, False], 3360, True) is True and m.hold_from == 3360
    m = make(sensors=["pir1"], presence=True)
    assert m.hold([True], 0, True) is False and m.hold([False], 1, True) is False  # no neighbour sensors: as today
    assert m.hold_from is None


def test_a_still_person_keeps_the_light_on_up_to_the_max_hold():
    """Review focus 1: the zone's motion ends and nobody moves in the neighbouring zone: the light stays on; 30 min
    after the zone's last motion the off delay starts."""
    w = lit([ml_rule(**PRESENT)])
    w.advance(T0 + 10)
    w.pir("off")
    t = w.tr()
    assert w.calls == [] and t["verdict"] is True and "pending" not in t and t["holders"] == ["Light motion control"]
    assert t["motionLight"]["present"] is True and t["motionLight"]["holdUntil"] == (T0 + 10 + HOLD) * 1000
    assert "left" not in t["motionLight"] and "offAt" not in t["motionLight"]
    w.advance(T0 + 10 + HOLD - 1)
    assert w.calls == [] and w.ml()["present"] is True
    w.advance(T0 + 10 + HOLD)
    t = w.tr()
    assert w.calls == [] and "present" not in t["motionLight"] and "holdUntil" not in t["motionLight"]
    assert "left" not in t["motionLight"] and t["pending"] == {"to": False, "at": (T0 + 10 + HOLD + 180) * 1000}
    assert t["motionLight"]["offAt"] == (T0 + 10 + HOLD + 180) * 1000
    w.advance(T0 + 10 + HOLD + 179)
    assert w.calls == []
    w.advance(T0 + 10 + HOLD + 180)
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is False and not w.pending() and "present" not in t["motionLight"]


def test_a_neighbour_motion_starts_the_off_delay_and_coming_back_keeps_the_light():
    """Review focus 2 and the owner's "a walk to the kitchen and back": a neighbour's motion only starts the off delay;
    motion in the zone before it runs out cancels it and the hold applies again at the next motion end."""
    w = lit([ml_rule(**PRESENT)])
    w.pir("off")
    w.advance(T0 + 600)
    w.pir("on", 3)  # the neighbour sees motion: the person may have left
    t = w.tr()
    assert w.calls == [] and t["verdict"] is True and t["pending"] == {"to": False, "at": (T0 + 780) * 1000}
    assert t["motionLight"]["left"] == "Motion Entrance" and "present" not in t["motionLight"]
    assert "holdUntil" not in t["motionLight"] and len(w.pending()) == 1  # the off only: the hold's end is dropped
    w.pir("off", 3)
    assert w.tr()["pending"]["at"] == (T0 + 780) * 1000
    w.advance(T0 + 700)
    w.pir("on")  # back within the off delay
    t = w.tr()
    assert w.calls == [] and "pending" not in t and "left" not in t["motionLight"] and t["verdict"] is True
    w.advance(T0 + 760)
    w.pir("off")  # the motion ends again: held anew
    t = w.tr()
    assert t["motionLight"]["present"] is True and t["motionLight"]["holdUntil"] == (T0 + 760 + HOLD) * 1000
    assert "pending" not in t
    w.advance(T0 + 2000)
    assert w.calls == []
    w.pir("on", 3)
    w.advance(T0 + 2179)
    assert w.calls == []
    w.advance(T0 + 2180)
    assert w.calls == [OFF] and w.tr()["verdict"] is False


def test_a_trip_longer_than_the_off_delay_switches_off_and_the_return_switches_on():
    w = lit([ml_rule(**PRESENT)])
    w.pir("off")
    w.advance(T0 + 60)
    w.pir("on", 3)
    w.pir("off", 3)
    w.advance(T0 + 240)
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is False and "left" not in t["motionLight"] and not w.pending()
    w.light("off", own=True)
    w.advance(T0 + 900)
    w.pir("on", 3)  # coming back through the neighbouring zone: nothing here
    assert w.calls == [OFF] and w.tr()["verdict"] is False
    w.pir("on")  # the return's motion while dark: on
    assert w.calls == [OFF, ON] and w.tr()["verdict"] is True


def test_a_neighbour_already_on_when_the_zone_motion_started_does_not_count():
    """Someone comes in from the neighbouring zone: its sensor still reads motion when the zone's motion starts; only
    its next off -> on is a departure."""
    w = loaded([ml_rule(sensors=("pir1", "pir2"), **PRESENT)])
    w.pir("on", 3)  # in the neighbouring zone
    w.pir("on", 1)  # comes in: the zone's motion starts while the neighbour still reads motion
    assert w.calls == [ON]
    w.light("on", own=True)
    w.pir("on", 2)
    w.pir("off", 1)  # another sensor of the zone still sees motion: no hold yet, nothing pending
    t = w.tr()
    assert "present" not in t["motionLight"] and "pending" not in t and t["verdict"] is True
    w.pir("off", 2)  # the zone's last sensor clears while the neighbour still reads motion: held
    t = w.tr()
    assert t["motionLight"]["present"] is True and "left" not in t["motionLight"] and "pending" not in t
    w.advance(T0 + 300)
    w.pir("off", 3)
    assert w.ml()["present"] is True
    w.pir("on", 3)  # its next off -> on: a departure
    t = w.tr()
    assert t["motionLight"]["left"] == "Motion Entrance" and t["pending"]["at"] == (T0 + 480) * 1000


def test_a_departure_while_the_zone_still_reads_motion_starts_the_off_delay_at_the_clear():
    """Review finding I1, probe A: a motion sensor reads motion for its timeout after the last movement, so the person
    leaving triggers the neighbour before the zone clears: the off delay starts when the zone clears (no hold)."""
    w = lit([ml_rule(**PRESENT)])
    w.advance(T0 + 5)
    w.pir("on", 3)  # the person leaves: the neighbour sees them, the zone still reads motion
    t = w.tr()
    assert w.calls == [] and "pending" not in t and "left" not in t["motionLight"] and t["verdict"] is True
    w.advance(T0 + 65)
    w.pir("off")  # the zone's sensor times out
    t = w.tr()
    assert "present" not in t["motionLight"] and t["motionLight"]["left"] == "Motion Entrance"
    assert t["pending"] == {"to": False, "at": (T0 + 245) * 1000} and len(w.pending()) == 1
    w.advance(T0 + 70)
    w.pir("off", 3)
    w.advance(T0 + 244)
    assert w.calls == []
    w.advance(T0 + 245)
    assert w.calls == [OFF] and w.tr()["verdict"] is False


def test_a_person_moving_on_in_the_neighbouring_zone_is_not_held():
    """Review finding I1, probe K: the person keeps moving next door (its sensor reads motion until +900): off the off
    delay after the zone clears."""
    w = lit([ml_rule(**PRESENT)])
    w.advance(T0 + 5)
    w.pir("on", 3)
    w.advance(T0 + 65)
    w.pir("off")
    w.advance(T0 + 244)
    assert w.calls == []
    w.advance(T0 + 245)
    assert w.calls == [OFF]
    w.light("off", own=True)
    w.advance(T0 + 900)
    w.pir("off", 3)
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is False and "present" not in t["motionLight"] and not w.pending()


def test_a_walk_out_and_back_with_sensor_timeouts():
    """The owner's "a walk to the kitchen and back" with real sensor timeouts: the departure is seen while the zone
    still reads motion; the zone clears: the off delay; the return's motion cancels it and the departure; the next
    clear holds again (the neighbour read motion before the zone's motion started: no departure)."""
    w = lit([ml_rule(**PRESENT)])
    w.advance(T0 + 5)
    w.pir("on", 3)
    w.advance(T0 + 65)
    w.pir("off")
    assert w.tr()["pending"]["at"] == (T0 + 245) * 1000
    w.advance(T0 + 70)
    w.pir("off", 3)
    w.advance(T0 + 120)
    w.pir("on", 3)  # back through the neighbouring zone
    w.advance(T0 + 125)
    w.pir("on")  # back in the zone: the off delay and the departure are gone
    t = w.tr()
    assert w.calls == [] and "pending" not in t and t["verdict"] is True and "left" not in t["motionLight"]
    w.advance(T0 + 185)
    w.pir("off")  # sits still
    t = w.tr()
    assert t["motionLight"]["present"] is True and t["motionLight"]["holdUntil"] == (T0 + 185 + HOLD) * 1000
    assert "pending" not in t
    w.advance(T0 + 1000)
    assert w.calls == [] and w.ml()["present"] is True


def test_two_people_zone_motion_while_a_departure_off_delay_runs_keeps_the_light():
    """One person leaves through the neighbouring zone while another moves in the zone: the light stays; the one left
    sitting still keeps it again although the neighbour still reads motion."""
    w = lit([ml_rule(**PRESENT)])
    w.pir("off")
    w.advance(T0 + 100)
    w.pir("on", 3)  # one leaves
    assert w.tr()["pending"]["at"] == (T0 + 280) * 1000
    w.advance(T0 + 200)
    w.pir("on")  # the other moves in the zone: the off is cancelled
    w.advance(T0 + 3600)
    assert w.calls == [] and "pending" not in w.tr()
    w.pir("off")  # then sits still
    w.advance(T0 + 4600)
    t = w.tr()
    assert w.calls == [] and t["motionLight"]["present"] is True and "pending" not in t


def test_sleep_or_daylight_switch_a_held_light_off_at_once():
    """Review focus 3: the blocker and the daylight win over the hold; nothing of the hold is left after a blocker
    cycle."""
    w = lit([ml_rule(blocker=("vs", "on"), **PRESENT)])
    w.pir("off")
    assert w.ml()["present"] is True
    w.sleep("on")
    t = w.tr()
    assert w.calls == [OFF] and t["last"]["reason"] == "blocked" and t["verdict"] is False and not w.pending()
    assert "present" not in t["motionLight"] and "holdUntil" not in t["motionLight"]
    w.light("off", own=True)
    w.pir("on", 3)
    w.sleep("off")  # no motion, the light off: nothing to decide
    t = w.tr()
    assert w.calls == [OFF] and t["verdict"] is False and "present" not in t["motionLight"] and not w.pending()
    w.pir("on")
    w.light("on", own=True)
    w.pir("off")
    assert w.calls == [OFF, ON] and w.ml()["present"] is True
    w = lit([ml_rule(daylight=("ls", "dark"), **PRESENT)])
    w.pir("off")
    assert w.ml()["present"] is True
    w.set("sensor.lux", *DAY)
    t = w.tr()
    assert w.calls == [OFF] and t["last"]["reason"] == "daylight" and t["verdict"] is False
    assert "present" not in t["motionLight"] and "holdUntil" not in t["motionLight"] and "pending" not in t


def test_a_dead_neighbour_sensor_holds_up_to_the_max_hold():
    """Review focus 4."""
    w = lit([ml_rule(**PRESENT)], binary_sensor__pir3="unavailable")
    w.pir("off")
    assert w.ml()["present"] is True
    w.pir("on", 3)  # back from no data reading motion: tells nothing
    w.pir("unavailable", 3)
    w.advance(T0 + HOLD - 1)
    assert w.calls == [] and w.ml()["present"] is True
    w.advance(T0 + HOLD + 179)
    assert w.calls == []
    w.advance(T0 + HOLD + 180)
    assert w.calls == [OFF]


def test_presence_without_neighbour_sensors_is_as_today():
    for r in (ml_rule(presence=True), ml_rule(presence=True, neighbours=()),
              ml_rule(presence=True, neighbours=("lamp2", "nope", "pir1", "ls")), ml_rule(neighbours=("pir3",))):
        w = lit([r])
        w.pir("off")
        t = w.tr()
        assert t["status"] == "ok" and t["pending"]["at"] == (T0 + 180) * 1000, r
        assert "present" not in t["motionLight"] and "holdUntil" not in t["motionLight"], r
        assert t["motionLight"].get("neighbours", []) == [], r
        w.advance(T0 + 180)
        assert w.calls == [OFF], r
    assert "neighbours" not in w.ml()  # without presence
    assert w.engine.entity_ids() >= {"binary_sensor.pir1"} and "binary_sensor.pir3" not in w.engine.entity_ids()


def test_manual_and_back_to_auto_forget_the_hold():
    w = lit([ml_rule(buttons=("btn",), **PRESENT)])
    w.pir("off")
    assert w.ml()["present"] is True
    w.press("btn", "set", "on")  # manual, already on: nothing sent
    t = w.tr()
    assert w.calls == [] and t["motionLight"]["mode"] == "manual" and "present" not in t["motionLight"]
    assert not w.pending() and t["verdict"] is None
    w.pir("on", 3)
    w.pir("off", 3)
    w.advance(T0 + 7200)
    assert w.calls == []
    w.press("btn", "auto")  # a fresh decision: no motion -> off at once, the hold does not apply
    t = w.tr()
    assert w.calls == [OFF] and t["last"]["reason"] == "back to auto: no motion" and "present" not in t["motionLight"]


def test_a_light_found_on_without_a_motion_end_goes_off_after_the_off_delay():
    """Amended spec §3 (blackouts): the hold starts only at the zone's motion end; a light found on without zone motion
    goes off the off delay after, as before 0.28.0."""
    w = loaded([ml_rule(**PRESENT)])
    w.advance(T0 + 5)
    w.light("on")  # by hand, the zone sees no motion
    t = w.tr()
    assert w.calls == [] and t["verdict"] is True and t["last"]["reason"] == "found on" and "present" not in t["motionLight"]
    assert t["pending"]["at"] == (T0 + 185) * 1000
    w.advance(T0 + 185)
    assert w.calls == [OFF]
    w = MWorld(light__k="unavailable")  # back after a blackout, the zone sees no motion
    w.load([ml_rule(**PRESENT)])
    w.light("on")
    t = w.tr()
    assert t["verdict"] is True and "present" not in t["motionLight"] and t["pending"]["at"] == (T0 + 180) * 1000
    w.advance(T0 + 180)
    assert w.calls == [OFF]
    w = loaded([ml_rule(**PRESENT), timed_rule()])  # switched on by another slot participant
    w.press("tb", "set", "on")
    w.light("on", own=True)
    assert w.tr()["verdict"] is True and "present" not in w.ml()
    w.advance(T0 + 180)
    assert w.calls == [ON, OFF]
    w = loaded([ml_rule(**PRESENT)])
    w.pir("on", 3)  # the light off: a neighbour's motion sends nothing
    assert w.calls == [] and w.tr()["verdict"] is False and "left" not in w.ml()


def test_a_running_hold_ends_with_a_blackout():
    """The light back from no data is taken anew: a hold running before is dropped (the person may have left while
    every sensor was dead); the off delay after, as for any light found on."""
    w = lit([ml_rule(**PRESENT)])
    w.pir("off")
    assert w.ml()["present"] is True
    w.light("unavailable")
    w.pir("unavailable")
    w.advance(T0 + 600)
    w.pir("off")  # back without motion: the hold still runs while the light reads no data
    assert w.ml()["present"] is True
    w.light("on")  # the light back: found on, no hold
    t = w.tr()
    assert t["last"]["reason"] == "found on" and "present" not in t["motionLight"]
    assert t["pending"]["at"] == (T0 + 780) * 1000
    w.advance(T0 + 780)
    assert w.calls == [OFF]


def test_the_hold_at_ha_start_and_at_a_save():
    """Amended spec §3: at HA start or a changed Save the light found on is held only by a later end of the zone's
    motion; an unchanged Save keeps a running hold."""
    w = MWorld(light__k="on")  # HA start in an empty room
    w.load([ml_rule(**PRESENT)], boot=True)
    w.advance(T0 + 30)
    w.engine.started()
    t = w.tr()
    assert w.calls == [] and t["verdict"] is True and "present" not in t["motionLight"]
    assert t["pending"]["at"] == (T0 + 210) * 1000
    w.advance(T0 + 210)
    assert w.calls == [OFF]

    w = MWorld(light__k="on", binary_sensor__pir1="on")  # HA start with the zone's sensor reading motion
    w.load([ml_rule(**PRESENT)], boot=True)
    w.engine.started()
    assert "pending" not in w.tr() and "present" not in w.ml()
    w.advance(T0 + 40)
    w.pir("off")  # it clears: the zone's motion ended while the rule holds the light
    t = w.tr()
    assert t["motionLight"]["present"] is True and t["motionLight"]["holdUntil"] == (T0 + 40 + HOLD) * 1000

    w = lit([ml_rule(**PRESENT)])
    w.pir("off")
    w.advance(T0 + 100)
    w.load([ml_rule(off=60, **PRESENT)])  # changed, no motion: found on, the off delay
    t = w.tr()
    assert t["last"]["reason"] == "found on" and "present" not in t["motionLight"]
    assert t["pending"]["at"] == (T0 + 160) * 1000
    w.advance(T0 + 160)
    assert w.calls == [OFF]

    w = lit([ml_rule(**PRESENT)])
    w.load([ml_rule(off=60, **PRESENT)])  # changed while the zone reads motion
    w.advance(T0 + 50)
    w.pir("off")  # it clears later: held
    assert w.ml()["holdUntil"] == (T0 + 50 + HOLD) * 1000
    w.advance(T0 + 200)
    w.load([ml_rule(off=60, name="Renamed", **PRESENT)])  # unchanged: the hold goes on
    assert w.ml()["holdUntil"] == (T0 + 50 + HOLD) * 1000 and len(w.pending()) == 1
    w.advance(T0 + 50 + HOLD + 59)
    assert w.calls == []
    w.advance(T0 + 50 + HOLD + 60)
    assert w.calls == [OFF]


def test_a_disabled_or_deleted_rule_drops_the_hold():
    w = lit([ml_rule(**PRESENT)])
    w.pir("off")
    assert len(w.pending()) == 1  # the hold's end
    w.load([ml_rule(enabled=False, **PRESENT)])
    t = w.tr()
    assert w.calls == [] and not w.pending() and "present" not in t["motionLight"] and t["verdict"] is None
    w = lit([ml_rule(**PRESENT)])
    w.pir("off")
    w.load([])
    w.advance(T0 + 3600)
    assert w.calls == [] and not w.pending()


def test_presence_trace_and_reasons():
    w = loaded([ml_rule(presence=True, neighbours=("pir3", "pir4"))])
    t = w.tr()
    assert t["motionLight"]["neighbours"] == [{"id": "pir3", "name": "Motion Entrance"},
                                              {"id": "pir4", "name": "Motion Transit"}]
    assert {"binary_sensor.pir3", "binary_sensor.pir4"} <= w.engine.entity_ids()
    w.pir("on", 3)
    w.pir("on")
    t = w.tr()
    # the neighbours are no reason of the rule's own decisions
    assert w.calls == [ON] and t["last"]["reason"] == "became true: Motion 1 motion"
    assert [s["id"] for s in t["motionLight"]["sensors"]] == ["pir1"] and t["motionLight"]["motion"] is True
    w.light("on", own=True)
    w.pir("off")
    w.pir("off", 3)
    w.pir("on", 4)
    t = w.tr()
    assert t["motionLight"]["left"] == "Motion Transit"
    w.advance(T0 + 180)
    t = w.tr()
    assert w.calls == [ON, OFF] and t["last"]["reason"] == "became false: Motion 1 clear"
    assert "left" not in t["motionLight"] and t["motionLight"]["neighbours"][1]["name"] == "Motion Transit"
