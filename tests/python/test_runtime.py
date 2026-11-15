"""Tests for the container runtime registry (no homeassistant needed)."""

from runtime import Runtime


class World:
    def __init__(self, **states):
        self.states = {k.replace("__", "."): (v, {}) for k, v in states.items()}

    def __call__(self, eid):
        return self.states.get(eid)


def btn(bindings=None, **props):
    return {"id": "b", "props": {"kind": "smart_button", **props}, "bindings": bindings or {}}


def light():
    return {"id": "l", "props": {"kind": "ceiling_light"}}


def plan(*devices, pid="p1"):
    return {"id": pid, "levels": [{"id": "l1", "devices": list(devices)}]}


def make(world=None, stored=None):
    persisted = []
    rt = Runtime(world or World(sensor__b="", light__f="off"), lambda: 0.0, stored,
                 lambda: persisted.append(1))
    return rt, persisted


def press(rt, eid="sensor.b", value="single"):
    rt.handle_state(eid, ("", {}), (value, {}))


def test_snapshot_lists_containers_of_a_plan():
    rt, _ = make()
    rt.load_plans([plan(btn(), light())])
    assert rt.snapshot("p1") == {"b": {"output": "off", "fault": "not_configured", "kind": "smart_button"}}
    assert rt.snapshot("nope") == {}


def test_unknown_kinds_are_ignored():
    rt, _ = make()
    rt.load_plans([plan({"id": "s", "props": {"kind": "switch"}, "bindings": {}}, {"id": "x"})])
    assert rt.snapshot("p1") == {}


def test_handle_state_notifies_changed_container_only():
    rt, _ = make()
    rt.load_plans([plan(btn({"on": "sensor.b"}))])
    calls = []
    rt.subscribe("p1", lambda full, c: calls.append((full, c)))
    rt.handle_state("sensor.other", ("a", {}), ("b", {}))
    assert calls == []
    press(rt)
    assert calls == [(False, {"b": {"output": "on", "fault": None, "kind": "smart_button"}})]


def test_reload_notifies_full_snapshot():
    rt, _ = make()
    rt.load_plans([plan(btn({"on": "sensor.b"}))])
    calls = []
    rt.subscribe("p1", lambda full, c: calls.append((full, c)))
    rt.load_plans([plan()])
    assert calls == [(True, {})]
    rt.load_plans([])
    assert calls[-1] == (True, {})


def test_unsubscribe_stops_notifications():
    rt, _ = make()
    rt.load_plans([plan(btn({"on": "sensor.b"}))])
    calls = []
    off = rt.subscribe("p1", lambda full, c: calls.append(1))
    off()
    press(rt)
    rt.load_plans([plan()])
    assert calls == []


def test_failing_subscriber_is_dropped_others_continue():
    rt, _ = make()
    rt.load_plans([plan(btn({"on": "sensor.b"}))])
    good = []

    def bad(full, c):
        raise RuntimeError("boom")

    rt.subscribe("p1", bad)
    rt.subscribe("p1", lambda full, c: good.append(c))
    press(rt)
    press(rt)
    assert len(good) == 2


def test_reload_keeps_output_unless_kind_changed():
    b = btn({"on": "sensor.b"})
    rt, _ = make()
    rt.load_plans([plan(b)])
    press(rt)
    assert rt.snapshot("p1")["b"]["output"] == "on"
    rt.load_plans([plan(b)])
    assert rt.snapshot("p1")["b"]["output"] == "on"
    ws = {"id": "b", "props": {"kind": "wall_switch"}, "bindings": {"state": "light.f"}}
    rt.load_plans([plan(ws)])
    assert rt.snapshot("p1")["b"] == {"output": "off", "fault": None, "kind": "wall_switch"}

    full = {"on": "sensor.b", "auto": "sensor.a", "final": "light.f"}
    w = World(sensor__b="", sensor__a="", light__f="off")
    rt, _ = make(w)
    auto_btn = btn(full, autoEnabled=True, defaultOutput="off")
    rt.load_plans([plan(auto_btn)])
    rt.handle_state("sensor.a", ("", {}), ("double", {}))
    assert rt.snapshot("p1")["b"]["output"] == "auto"
    rt.load_plans([plan(btn(full, autoEnabled=False, defaultOutput="off"))])
    assert rt.snapshot("p1")["b"]["output"] == "off"


def test_persisted_and_restore_from_store():
    b = btn({"on": "sensor.b"})
    rt, persisted = make()
    rt.load_plans([plan(b)])
    persisted.clear()
    press(rt)
    assert persisted
    stored = rt.persisted()
    assert stored == {"p1/b": {"kind": "smart_button", "output": "on"}}
    rt2, _ = make(stored=stored)
    rt2.load_plans([plan(b)])
    assert rt2.snapshot("p1")["b"]["output"] == "on"
    rt3, _ = make(stored={"p1/b": {"kind": "wall_switch", "output": "on"}})
    rt3.load_plans([plan(b)])
    assert rt3.snapshot("p1")["b"]["output"] == "off"


def test_persist_called_after_load():
    rt, persisted = make()
    rt.load_plans([plan(btn())])
    assert persisted


def test_entity_ids_cover_all_containers():
    rt, _ = make()
    rt.load_plans([
        plan(btn({"on": "sensor.b"})),
        plan({"id": "w", "props": {"kind": "wall_switch"}, "bindings": {"state": "light.f"}}, pid="p2"),
    ])
    assert rt.entity_ids() == {"sensor.b", "light.f"}


def test_unconfigured_button_does_not_restore_its_old_default():
    rt, _ = make()
    rt.load_plans([plan(btn(defaultOutput="on"))])
    assert rt.snapshot("p1")["b"]["output"] == "on"
    assert rt.persisted() == {}
    rt.load_plans([plan(btn({"on": "sensor.b"}, defaultOutput="off"))])
    assert rt.snapshot("p1")["b"]["output"] == "off"
