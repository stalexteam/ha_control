"""Tests for the input container state machines (no homeassistant needed)."""

from containers import build, expected_value


class World:
    """Dict-backed lookup plus a helper that changes a state and calls handle."""

    def __init__(self, **states):
        self.states = {k.replace("__", "."): (v, {}) for k, v in states.items()}

    def __call__(self, eid):
        return self.states.get(eid)

    def set(self, c, eid, state, attrs=None, now=0.0):
        old = self.states.get(eid)
        new = None if state is None else (state, attrs or {})
        if new is None:
            self.states.pop(eid, None)
        else:
            self.states[eid] = new
        return c.handle(eid, old, new, now)


def ws(bindings=None, **props):
    return {"id": "w", "props": {"kind": "wall_switch", **props}, "bindings": bindings or {}}


def sb(bindings=None, **props):
    return {"id": "b", "props": {"kind": "smart_button", **props}, "bindings": bindings or {}}


def test_expected_value():
    assert expected_value(0, "single") == "single"
    assert expected_value(2, "hold") == "2_hold"


def test_other_kinds_build_none():
    assert build({"id": "x", "props": {"kind": "switch"}}, World(), None) is None


def test_wall_switch_follows_state():
    w = World(light__a="on")
    c = build(ws({"state": "light.a"}), w, None)
    assert c.public() == {"output": "on", "fault": None, "kind": "wall_switch"}
    assert w.set(c, "light.a", "off", now=10.0) is True
    assert c.public()["output"] == "off"


def test_wall_switch_not_configured():
    c = build(ws(defaultOutput="error"), World(), None)
    assert c.public() == {"output": "error", "fault": "not_configured", "kind": "wall_switch"}


def test_wall_switch_unavailable():
    c = build(ws({"state": "light.a"}), World(light__a="unavailable"), None)
    assert c.public() == {"output": "off", "fault": "unavailable", "entities": ["light.a"], "kind": "wall_switch"}


def test_wall_switch_missing_entity_is_unavailable():
    c = build(ws({"state": "light.a"}), World(), None)
    assert c.public()["fault"] == "unavailable"


def _toggle_run(**props):
    w = World(light__a="on")
    c = build(ws({"state": "light.a"}, **props), w, None)
    out = []
    for i, t in enumerate([0, 2, 4, 10]):
        w.set(c, "light.a", "off" if i % 2 == 0 else "on", now=float(t))
        out.append(c.public()["output"])
    return out


def test_double_toggle_gives_auto_and_keeps_it_for_quick_toggles():
    # states after toggles: off, on, off, on
    assert _toggle_run(autoByDoubleToggle=True, windowSec=3) == ["off", "auto", "auto", "on"]


def test_double_toggle_disabled_follows_state():
    assert _toggle_run() == ["off", "on", "off", "on"]


def test_wall_switch_appearing_is_not_a_toggle():
    w = World()
    c = build(ws({"state": "light.a"}, autoByDoubleToggle=True), w, None)
    assert c.public()["fault"] == "unavailable"
    w.set(c, "light.a", "on", now=0)
    assert c.public() == {"output": "on", "fault": None, "kind": "wall_switch"}
    w.set(c, "light.a", "off", now=1)
    assert c.public() == {"output": "off", "fault": None, "kind": "wall_switch"}


def test_wall_switch_restores_auto():
    w = World(light__a="on")
    c = build(ws({"state": "light.a"}, autoByDoubleToggle=True), w, "auto")
    assert c.public()["output"] == "auto"
    assert c.persisted() == "auto"
    c = build(ws({"state": "light.a"}), w, "auto")
    assert c.public()["output"] == "on"
    assert c.persisted() is None


def test_toggle_mode_cycles():
    w = World(sensor__b="")
    c = build(sb({"on": "sensor.b"}, on={"slot": 1, "event": "single"}), w, None)
    assert c.public()["output"] == "off"
    assert w.set(c, "sensor.b", "1_single", now=1) is True
    assert c.public()["output"] == "on"
    w.set(c, "sensor.b", "", now=2)
    w.set(c, "sensor.b", "1_single", now=3)
    assert c.public()["output"] == "off"


def _auto_button():
    w = World(sensor__b="", light__f="on")
    c = build(
        sb(
            {"on": "sensor.b", "auto": "sensor.b", "final": "light.f"},
            autoEnabled=True,
            on={"slot": 1, "event": "single"},
            auto={"slot": 1, "event": "double"},
        ),
        w,
        None,
    )
    return w, c


def test_toggle_from_auto_uses_final():
    for final, expect in (("on", "off"), ("off", "on")):
        w, c = _auto_button()
        w.set(c, "light.f", final)
        w.set(c, "sensor.b", "1_double", now=1)
        assert c.public()["output"] == "auto"
        w.set(c, "sensor.b", "", now=2)
        w.set(c, "sensor.b", "1_single", now=3)
        assert c.public()["output"] == expect


def test_toggle_from_auto_without_final_gives_off():
    w = World(sensor__b="")
    c = build(
        sb({"on": "sensor.b", "auto": "sensor.b"}, autoEnabled=True,
           on={"slot": 0, "event": "single"}, auto={"slot": 0, "event": "double"}),
        w, None)
    w.set(c, "sensor.b", "double")
    assert c.public()["output"] == "auto"
    w.set(c, "sensor.b", "single")
    assert c.public()["output"] == "off"


def test_split_mode():
    w = World(sensor__b="")
    c = build(
        sb({"on": "sensor.b", "off": "sensor.b"}, separateOff=True,
           on={"slot": 1, "event": "hold"}, off={"slot": 2, "event": "hold"}),
        w, None)
    w.set(c, "sensor.b", "1_hold")
    assert c.public()["output"] == "on"
    w.set(c, "sensor.b", "")
    w.set(c, "sensor.b", "1_hold")
    assert c.public()["output"] == "on"
    w.set(c, "sensor.b", "2_hold")
    assert c.public()["output"] == "off"


def test_slot_zero_and_custom_event():
    w = World(sensor__b="")
    c = build(sb({"on": "sensor.b"}, on={"slot": 0, "event": "single_left"}), w, None)
    w.set(c, "sensor.b", "single_left")
    assert c.public()["output"] == "on"


def test_event_entity_matches_event_type():
    w = World()
    w.states["event.x"] = ("2026-01-01T00:00:00", {"event_type": "1_single"})
    c = build(sb({"on": "event.x"}, on={"slot": 1, "event": "single"}), w, None)
    assert w.set(c, "event.x", "2026-01-01T00:00:05", {"event_type": "1_single"}) is True
    assert c.public()["output"] == "on"
    # same state again: not a press
    old = w.states["event.x"]
    assert c.handle("event.x", old, old, 9) is False
    assert c.public()["output"] == "on"


def test_same_state_is_not_a_press():
    w = World(sensor__b="1_single")
    c = build(sb({"on": "sensor.b"}, on={"slot": 1, "event": "single"}), w, None)
    assert c.handle("sensor.b", ("1_single", {}), ("1_single", {}), 1) is False
    assert c.public()["output"] == "off"


def test_entity_appearing_is_not_a_press():
    w = World()
    c = build(sb({"on": "sensor.b"}, on={"slot": 1, "event": "single"}), w, None)
    assert c.public()["fault"] == "unavailable"
    w.states["sensor.b"] = ("1_single", {})
    c.handle("sensor.b", None, ("1_single", {}), 1)
    assert c.public() == {"output": "off", "fault": None, "kind": "smart_button"}


def test_final_unavailable_faults_and_presses_are_ignored():
    w = World(sensor__b="", sensor__a="", light__f="off")
    c = build(
        sb({"on": "sensor.b", "auto": "sensor.a", "final": "light.f"}, autoEnabled=True,
           on={"slot": 0, "event": "single"}),
        w, None)
    w.set(c, "sensor.b", "single")
    assert c.public()["output"] == "on"
    w.set(c, "light.f", "unavailable")
    assert c.public() == {"output": "off", "fault": "unavailable", "entities": ["light.f"], "kind": "smart_button"}
    w.set(c, "sensor.b", "")
    w.set(c, "sensor.b", "single")  # ignored during fault
    w.set(c, "light.f", "off")
    assert c.public() == {"output": "on", "fault": None, "kind": "smart_button"}


def test_smart_button_not_configured_parts():
    w = World(sensor__b="", sensor__a="")
    c = build(sb({"on": "sensor.b"}, separateOff=True), w, None)
    assert c.public()["fault"] == "not_configured"
    c = build(sb({"on": "sensor.b", "auto": "sensor.a"}), w, None)
    assert c.public()["fault"] is None
    assert c.entity_ids() == {"sensor.b"}


def test_duplicate_triggers_first_wins():
    w = World(sensor__b="")
    c = build(
        sb({"on": "sensor.b", "off": "sensor.b"}, separateOff=True,
           on={"slot": 1, "event": "single"}, off={"slot": 1, "event": "single"}),
        w, None)
    w.set(c, "sensor.b", "1_single")
    assert c.public()["output"] == "on"


def test_restored_output_rules():
    w = World(sensor__b="")
    b = {"on": "sensor.b"}
    assert build(sb(b, defaultOutput="error"), w, "auto").public()["output"] == "error"
    assert build(sb(b), w, "on").public()["output"] == "on"
    assert build(sb(b, defaultOutput="auto"), w, None).public()["output"] == "off"
    c = build(sb({"on": "sensor.b", "auto": "sensor.b"}, autoEnabled=True), w, "auto")
    assert c.public()["output"] == "auto"
    assert c.persisted() == "auto"


def test_missing_props_use_defaults():
    w = World(sensor__b="")
    c = build({"id": "s", "props": {"kind": "smart_button"}, "bindings": {"on": "sensor.b"}}, w, None)
    assert c.public()["output"] == "off"
    w.set(c, "sensor.b", "single")
    assert c.public()["output"] == "on"


def test_wrong_typed_props_use_defaults():
    w = World(sensor__b="")
    c = build(sb({"on": "sensor.b"}, on={"slot": "x", "event": ""}, separateOff="yes"), w, None)
    w.set(c, "sensor.b", "single")
    assert c.public()["output"] == "on"


def test_unconfigured_container_persists_nothing():
    w = World(sensor__b="", light__a="on")
    assert build(sb(defaultOutput="on"), w, None).persisted() is None
    assert build(sb(defaultOutput="on"), w, "off").persisted() is None
    assert build(ws(autoByDoubleToggle=True), w, "auto").persisted() is None
    assert build(sb({"on": "sensor.b"}, defaultOutput="on"), w, None).persisted() == "on"


def test_wall_switch_auto_survives_unavailable_cycle():
    w = World(light__a="on")
    c = build(ws({"state": "light.a"}, autoByDoubleToggle=True, windowSec=3), w, None)
    w.set(c, "light.a", "off", now=0.0)
    w.set(c, "light.a", "on", now=1.0)
    assert c.public()["output"] == "auto"
    w.set(c, "light.a", "unavailable", now=20.0)
    assert c.public()["fault"] == "unavailable"
    assert c.persisted() == "auto"
    w.set(c, "light.a", "off", now=40.0)
    assert c.public()["output"] == "auto"
    assert c.public()["fault"] is None


def test_unknown_state_is_not_a_fault():
    w = World(light__a="unknown", sensor__b="unknown")
    c = build(ws({"state": "light.a"}), w, None)
    assert c.public()["fault"] is None
    assert c.public()["output"] == "off"
    c = build(sb({"on": "sensor.b"}), w, None)
    assert c.public()["fault"] is None
    w.set(c, "sensor.b", "single")
    assert c.public()["output"] == "on"


def test_public_names_the_kind():
    w = World(light__a="on", sensor__b="")
    assert build(ws({"state": "light.a"}), w, None).public()["kind"] == "wall_switch"
    assert build(sb(), w, None).public()["kind"] == "smart_button"
