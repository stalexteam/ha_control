"""Tests for the input containers as intent sources (no homeassistant needed)."""

from containers import build, expected_value

OK = {"status": "ok"}
NOT_CONFIGURED = {"status": "error", "reason": "not_configured"}
TOGGLE = [{"action": "toggle"}]
AUTO = [{"action": "auto"}]
SET_ON = [{"action": "set", "value": "on"}]
SET_OFF = [{"action": "set", "value": "off"}]


def unavailable(*entities):
    return {"status": "error", "reason": "unavailable", "entities": list(entities)}


class World:
    """Dict-backed lookup plus a helper that changes a state and calls handle."""

    def __init__(self, **states):
        self.states = {k.replace("__", "."): (v, {}) for k, v in states.items()}

    def __call__(self, eid):
        return self.states.get(eid)

    def set(self, c, eid, state, attrs=None, now=0.0, own=False):
        old = self.states.get(eid)
        new = None if state is None else (state, attrs or {})
        if new is None:
            self.states.pop(eid, None)
        else:
            self.states[eid] = new
        return c.handle(eid, old, new, now, own)


def ws(bindings=None, **props):
    return {"id": "w", "props": {"kind": "wall_switch", **props}, "bindings": bindings or {}}


def sb(bindings=None, **props):
    return {"id": "b", "props": {"kind": "smart_button", **props}, "bindings": bindings or {}}


def press(w, c, value, eid="sensor.b", now=0.0):
    """A press: the action sensor clears, then reports the value; returns the intents of the press."""
    w.set(c, eid, "", now=now)
    return w.set(c, eid, value, now=now)


def test_expected_value():
    assert expected_value(0, "single") == "single"
    assert expected_value(2, "hold") == "2_hold"


def test_other_kinds_build_none():
    assert build({"id": "x", "props": {"kind": "switch"}}, World()) is None
    assert build({"id": "x"}, World()) is None


# --- mapping -----------------------------------------------------------------


def test_toggle_mode_on_trigger_gives_toggle():
    w = World(sensor__b="")
    c = build(sb({"on": "sensor.b"}, on={"slot": 1, "event": "single"}), w)
    assert w.set(c, "sensor.b", "1_single") == TOGGLE
    assert press(w, c, "1_single") == TOGGLE  # stateless: every press is a toggle
    assert press(w, c, "1_double") == []  # not the trigger


def test_split_mode_on_gives_set_on():
    w = World(sensor__b="")
    c = build(
        sb({"on": "sensor.b", "off": "sensor.b"}, separateOff=True,
           on={"slot": 1, "event": "hold"}, off={"slot": 2, "event": "hold"}),
        w)
    assert w.set(c, "sensor.b", "1_hold") == SET_ON
    assert press(w, c, "1_hold") == SET_ON  # a repeated set on is meaningful ("extend")


def test_split_mode_off_gives_set_off():
    w = World(sensor__b="", sensor__o="")
    c = build(
        sb({"on": "sensor.b", "off": "sensor.o"}, separateOff=True,
           on={"slot": 1, "event": "single"}, off={"slot": 1, "event": "single"}),
        w)
    assert w.set(c, "sensor.o", "1_single") == SET_OFF
    assert press(w, c, "1_single", eid="sensor.o") == SET_OFF


def test_auto_trigger_gives_auto():
    w = World(sensor__b="", sensor__a="")
    c = build(
        sb({"on": "sensor.b", "auto": "sensor.a"}, autoEnabled=True,
           on={"slot": 1, "event": "single"}, auto={"slot": 1, "event": "double"}),
        w)
    assert w.set(c, "sensor.a", "1_double") == AUTO
    assert w.set(c, "sensor.b", "1_single") == TOGGLE
    # split mode keeps its auto too
    w = World(sensor__b="")
    c = build(sb({"on": "sensor.b", "off": "sensor.b", "auto": "sensor.b"}, separateOff=True, autoEnabled=True), w)
    assert w.set(c, "sensor.b", "double") == AUTO


def test_wall_switch_change_gives_set_with_the_new_value():
    w = World(light__a="on")
    c = build(ws({"state": "light.a"}), w)
    assert w.set(c, "light.a", "off", now=10.0) == SET_OFF
    assert w.set(c, "light.a", "on", now=11.0) == SET_ON  # no double toggle without the flag


def test_wall_switch_double_toggle_gives_auto():
    w = World(light__a="on")
    c = build(ws({"state": "light.a"}, autoByDoubleToggle=True, windowSec=3), w)
    assert w.set(c, "light.a", "off", now=0.0) == SET_OFF
    assert w.set(c, "light.a", "on", now=3.0) == AUTO  # within the window (inclusive)
    assert w.set(c, "light.a", "off", now=10.0) == SET_OFF  # window passed


def test_wall_switch_third_quick_toggle_is_still_auto():
    w = World(light__a="on")
    c = build(ws({"state": "light.a"}, autoByDoubleToggle=True, windowSec=3), w)
    out = [w.set(c, "light.a", s, now=t) for s, t in (("off", 0.0), ("on", 2.0), ("off", 4.0), ("on", 6.0), ("off", 10.0))]
    assert out == [SET_OFF, AUTO, AUTO, AUTO, SET_OFF]


# --- not a press -------------------------------------------------------------


def test_no_intent_while_error_recovery_is_not_a_press():
    # the action sensor itself goes unavailable
    w = World(sensor__b="")
    c = build(sb({"on": "sensor.b"}), w)
    assert c.status() == OK
    assert w.set(c, "sensor.b", "unavailable") == []
    assert c.status() == unavailable("sensor.b")
    assert w.set(c, "sensor.b", "single") == []  # it returns with a value: not a press
    assert c.status() == OK
    assert press(w, c, "single") == TOGGLE

    # another bound entity is unavailable: presses on the healthy one are ignored
    w = World(sensor__b="", sensor__a="unavailable")
    c = build(sb({"on": "sensor.b", "auto": "sensor.a"}, autoEnabled=True), w)
    assert c.status() == unavailable("sensor.a")
    assert w.set(c, "sensor.b", "single") == []
    assert c.status() == unavailable("sensor.a")
    assert w.set(c, "sensor.a", "") == []  # recovery
    assert c.status() == OK
    assert press(w, c, "single") == TOGGLE

    # the change that ends an error is not a press, even when the recovery itself was not seen
    w = World(sensor__b="", sensor__a="unavailable")
    c = build(sb({"on": "sensor.b", "auto": "sensor.a"}, autoEnabled=True), w)
    w.states["sensor.a"] = ("", {})  # no handle call for it
    assert w.set(c, "sensor.b", "single") == []
    assert c.status() == OK
    assert press(w, c, "single") == TOGGLE

    # a missing entity is an error too; it appearing is not a press
    w = World()
    c = build(sb({"on": "sensor.b"}), w)
    assert c.status() == unavailable("sensor.b")
    assert w.set(c, "sensor.b", "single") == []
    assert c.status() == OK


def test_wall_switch_appearing_is_not_a_press():
    w = World()
    c = build(ws({"state": "light.a"}, autoByDoubleToggle=True), w)
    assert c.status() == unavailable("light.a")
    assert w.set(c, "light.a", "on", now=0.0) == []
    assert c.status() == OK
    assert w.set(c, "light.a", "off", now=1.0) == SET_OFF  # the appearance did not start the window
    assert w.set(c, "light.a", "unavailable", now=2.0) == []
    assert w.set(c, "light.a", "on", now=3.0) == []


def test_unknown_and_empty_states_are_not_errors():
    w = World(light__a="unknown", sensor__b="unknown", sensor__e="")
    c = build(ws({"state": "light.a"}), w)
    assert c.status() == OK
    assert w.set(c, "light.a", "on") == []  # unknown -> on is not an on/off change
    c = build(sb({"on": "sensor.b", "off": "sensor.e"}, separateOff=True), w)
    assert c.status() == OK
    assert w.set(c, "sensor.b", "single") == SET_ON  # unknown -> value is a press (v0.4)


def test_same_state_is_not_a_press():
    w = World(sensor__b="1_single", light__a="on")
    c = build(sb({"on": "sensor.b"}, on={"slot": 1, "event": "single"}), w)
    assert c.handle("sensor.b", ("1_single", {}), ("1_single", {}), 1) == []
    c = build(ws({"state": "light.a"}), w)
    assert c.handle("light.a", ("on", {}), ("on", {"brightness": 3}), 1) == []


def test_event_entity_matches_event_type():
    w = World()
    w.states["event.x"] = ("2026-01-01T00:00:00", {"event_type": "1_single"})
    c = build(sb({"on": "event.x"}, on={"slot": 1, "event": "single"}), w)
    assert w.set(c, "event.x", "2026-01-01T00:00:05", {"event_type": "1_single"}) == TOGGLE
    assert w.set(c, "event.x", "2026-01-01T00:00:09", {"event_type": "1_double"}) == []
    old = w.states["event.x"]
    assert c.handle("event.x", old, old, 9) == []  # same state again


def test_slot_zero_and_custom_event():
    w = World(sensor__b="")
    c = build(sb({"on": "sensor.b"}, on={"slot": 0, "event": "single_left"}), w)
    assert w.set(c, "sensor.b", "single_left") == TOGGLE


def test_duplicate_triggers_first_wins():
    w = World(sensor__b="")
    c = build(
        sb({"on": "sensor.b", "off": "sensor.b"}, separateOff=True,
           on={"slot": 1, "event": "single"}, off={"slot": 1, "event": "single"}),
        w)
    assert w.set(c, "sensor.b", "1_single") == SET_ON
    c = build(
        sb({"on": "sensor.b", "off": "sensor.b", "auto": "sensor.b"}, separateOff=True, autoEnabled=True,
           on={"slot": 1, "event": "single"}, off={"slot": 1, "event": "hold"}, auto={"slot": 1, "event": "hold"}),
        w)
    assert press(w, c, "1_hold") == SET_OFF


def test_unwatched_entity_gives_nothing():
    w = World(sensor__b="", sensor__x="")
    c = build(sb({"on": "sensor.b"}), w)
    assert w.set(c, "sensor.x", "single") == []


# --- own context -------------------------------------------------------------


def test_own_change_is_not_a_press_for_a_wall_switch():
    w = World(light__a="off", sensor__b="")
    c = build(ws({"state": "light.a"}, autoByDoubleToggle=True, windowSec=3), w)
    assert w.set(c, "light.a", "on", now=0.0, own=True) == []
    # the own change did not open a double-toggle window
    assert w.set(c, "light.a", "off", now=1.0) == SET_OFF
    # an own change between two manual ones does not break the window either
    assert w.set(c, "light.a", "on", now=2.0, own=True) == []
    assert w.set(c, "light.a", "off", now=3.0) == AUTO
    # the status still follows an own change
    w.set(c, "light.a", "unavailable", now=10.0)
    assert c.status() == unavailable("light.a")
    assert w.set(c, "light.a", "on", now=11.0, own=True) == []
    assert c.status() == OK
    # a smart button is not affected by the own-context rule
    c = build(sb({"on": "sensor.b"}), w)
    assert w.set(c, "sensor.b", "single", own=True) == TOGGLE


# --- status ------------------------------------------------------------------


def test_status_reasons_not_configured_lists_nothing_unavailable_lists_sorted_entities():
    w = World(sensor__b="", sensor__a="", sensor__z="unavailable", light__a="on")
    assert build(ws(), w).status() == NOT_CONFIGURED
    assert build(sb(), w).status() == NOT_CONFIGURED
    assert build(sb({"on": "sensor.b"}, separateOff=True), w).status() == NOT_CONFIGURED
    assert build(sb({"on": "sensor.b"}, autoEnabled=True), w).status() == NOT_CONFIGURED
    # a missing binding wins over an unavailable one
    assert build(sb({"on": "sensor.z"}, separateOff=True), w).status() == NOT_CONFIGURED
    assert build(sb({"on": "sensor.b", "auto": "sensor.a"}), w).status() == OK
    assert build(ws({"state": "light.a"}), w).status() == OK
    c = build(sb({"on": "sensor.z", "off": "sensor.y", "auto": "sensor.b"}, separateOff=True, autoEnabled=True), w)
    assert c.status() == unavailable("sensor.y", "sensor.z")  # sensor.y is missing


def test_entity_ids_follow_the_active_roles():
    w = World()
    assert build(sb({"on": "sensor.b", "auto": "sensor.a", "off": "sensor.o"}), w).entity_ids() == {"sensor.b"}
    assert build(
        sb({"on": "sensor.b", "auto": "sensor.a", "off": "sensor.o"}, separateOff=True, autoEnabled=True), w
    ).entity_ids() == {"sensor.b", "sensor.a", "sensor.o"}
    assert build(ws({"state": "light.a", "on": "sensor.b"}), w).entity_ids() == {"light.a"}
    assert build(ws({"state": ""}), w).entity_ids() == set()


def test_v04_leftovers_are_ignored():
    # defaultOutput and the final role of v0.4 are not read: final is neither watched nor required
    w = World(sensor__b="", sensor__a="", light__f="unavailable")
    c = build(
        sb({"on": "sensor.b", "auto": "sensor.a", "final": "light.f"}, autoEnabled=True, defaultOutput="error"),
        w)
    assert c.entity_ids() == {"sensor.b", "sensor.a"}
    assert c.status() == OK
    assert w.set(c, "sensor.b", "single") == TOGGLE
    assert build(sb({"on": "sensor.b"}, defaultOutput="auto"), w).status() == OK


# --- defaults ----------------------------------------------------------------


def test_missing_props_use_the_v04_defaults():
    # smart button: on "single", off "hold", auto "double", all at slot 0
    w = World(sensor__b="")
    c = build({"id": "s", "props": {"kind": "smart_button"}, "bindings": {"on": "sensor.b"}}, w)
    assert w.set(c, "sensor.b", "single") == TOGGLE
    c = build(sb({"on": "sensor.b", "off": "sensor.b", "auto": "sensor.b"}, separateOff=True, autoEnabled=True), w)
    assert press(w, c, "single") == SET_ON
    assert press(w, c, "hold") == SET_OFF
    assert press(w, c, "double") == AUTO
    # missing bindings: not configured
    assert build({"id": "s", "props": {"kind": "smart_button"}}, w).status() == NOT_CONFIGURED
    # wall switch: windowSec 3
    w = World(light__a="on")
    c = build(ws({"state": "light.a"}, autoByDoubleToggle=True), w)
    assert w.set(c, "light.a", "off", now=0.0) == SET_OFF
    assert w.set(c, "light.a", "on", now=3.0) == AUTO
    assert w.set(c, "light.a", "off", now=6.5) == SET_OFF


def test_wrong_typed_props_use_the_v04_defaults():
    w = World(sensor__b="")
    c = build(sb({"on": "sensor.b", "off": "sensor.b"}, on={"slot": "x", "event": ""}, separateOff="yes"), w)
    assert w.set(c, "sensor.b", "single") == TOGGLE  # separateOff "yes" is not true; slot 0, event single
    c = build(sb({"on": "sensor.b"}, on={"slot": True, "event": 5}), w)
    assert press(w, c, "single") == TOGGLE
    c = build(sb({"on": "sensor.b"}, on={"slot": 10, "event": "hold"}), w)
    assert press(w, c, "hold") == TOGGLE  # slot out of range falls back to 0
    for bad in (True, 0, 11, "5", 2.5):
        w = World(light__a="on")
        c = build(ws({"state": "light.a"}, autoByDoubleToggle=True, windowSec=bad), w)
        w.set(c, "light.a", "off", now=0.0)
        assert w.set(c, "light.a", "on", now=3.0) == AUTO, bad
        assert w.set(c, "light.a", "off", now=6.5) == SET_OFF, bad
    w = World(light__a="on")
    c = build(ws({"state": "light.a"}, autoByDoubleToggle="yes"), w)
    w.set(c, "light.a", "off", now=0.0)
    assert w.set(c, "light.a", "on", now=1.0) == SET_ON


def test_kind_is_named():
    w = World()
    assert build(ws(), w).kind == "wall_switch"
    assert build(sb(), w).kind == "smart_button"
