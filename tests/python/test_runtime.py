"""Tests for the container runtime registry (no homeassistant needed)."""

from runtime import Runtime


def at(n):
    return f"2026-11-15T12:00:{n:02d}+00:00"


class Env:
    """A runtime over a dict-backed world, a manual monotonic time and a counting ISO clock."""

    def __init__(self, **states):
        self.states = {k.replace("__", "."): (v, {}) for k, v in states.items()}
        self.t = 0.0
        self.stamps = 0
        self.rt = Runtime(self.states.get, lambda: self.t, self.clock)

    def clock(self):
        self.stamps += 1
        return at(self.stamps)

    def set(self, eid, state, attrs=None, context=None):
        old = self.states.get(eid)
        new = None if state is None else (state, attrs or {})
        if new is None:
            self.states.pop(eid, None)
        else:
            self.states[eid] = new
        if context is None:
            self.rt.handle_state(eid, old, new)
        else:
            self.rt.handle_state(eid, old, new, context)

    def press(self, value="single", eid="sensor.b"):
        self.set(eid, "")
        self.set(eid, value)

    def frames(self, pid="p1"):
        out = []
        self.rt.subscribe(pid, lambda full, c: out.append((full, c)))
        return out

    def events(self):
        out = []
        self.rt.add_listener(lambda pid, did, ev: out.append((pid, did, ev)))
        return out


def btn(bindings=None, did="b", **props):
    return {"id": did, "props": {"kind": "smart_button", **props}, "bindings": bindings or {}}


def wall(entity="light.f", did="w", **props):
    return {"id": did, "props": {"kind": "wall_switch", **props}, "bindings": {"state": entity}}


def light():
    return {"id": "l", "props": {"kind": "ceiling_light"}}


def plan(*devices, pid="p1"):
    return {"id": pid, "levels": [{"id": "l1", "devices": list(devices)}]}


OK_BTN = {"kind": "smart_button", "status": "ok"}
TOGGLE_1 = {"action": "toggle", "at": at(1)}


def test_snapshot_has_kind_status_and_last():
    e = Env(sensor__b="")
    e.rt.load_plans([plan(btn(), light(), btn({"on": "sensor.b"}, did="c"))])
    assert e.rt.snapshot("p1") == {
        "b": {"kind": "smart_button", "status": "error", "reason": "not_configured"},
        "c": OK_BTN,
    }
    e.set("sensor.b", "single")
    assert e.rt.snapshot("p1")["c"] == {**OK_BTN, "last": TOGGLE_1}
    e.set("sensor.b", "unavailable")
    assert e.rt.snapshot("p1")["c"] == {
        "kind": "smart_button", "status": "error", "reason": "unavailable", "entities": ["sensor.b"],
        "last": TOGGLE_1,
    }
    assert e.rt.snapshot("nope") == {}


def test_unknown_kinds_are_ignored():
    e = Env()
    e.rt.load_plans([
        plan({"id": "s", "props": {"kind": "switch"}, "bindings": {}}, {"id": "x"}, light(), "junk",
             {"id": 5, "props": {"kind": "smart_button"}}),
        {"id": 7, "levels": [{"devices": [btn()]}]},
        {"id": "p2", "levels": ["junk", {"devices": None}]},
    ])
    assert e.rt.snapshot("p1") == {}
    assert e.rt.snapshot("p2") == {}


def test_an_intent_sends_a_partial_frame():
    e = Env(sensor__b="")
    # d watches sensor.b too but is not configured (no off binding): it stays out of the frames
    e.rt.load_plans([plan(btn({"on": "sensor.b"}, did="c"), btn({"on": "sensor.b"}, did="d", separateOff=True))])
    frames = e.frames()
    e.set("sensor.other", "x")
    assert frames == []
    e.set("sensor.b", "single")
    assert frames == [(False, {"c": {**OK_BTN, "last": TOGGLE_1}})]
    e.press()
    assert frames[-1] == (False, {"c": {**OK_BTN, "last": {"action": "toggle", "at": at(2)}}})
    assert len(frames) == 2  # clearing the sensor is neither an intent nor a status change


def test_one_change_reaching_two_containers_sends_one_frame_with_one_time():
    e = Env(sensor__b="")
    e.rt.load_plans([plan(btn({"on": "sensor.b"}, did="c"), btn({"on": "sensor.b"}, did="d"))])
    frames = e.frames()
    e.set("sensor.b", "single")
    assert frames == [(False, {"c": {**OK_BTN, "last": TOGGLE_1}, "d": {**OK_BTN, "last": TOGGLE_1}})]


def test_a_status_change_sends_a_partial_frame():
    e = Env(sensor__b="")
    e.rt.load_plans([plan(btn({"on": "sensor.b"}, did="c"))])
    frames = e.frames()
    e.set("sensor.b", "unavailable")
    assert frames == [(False, {"c": {
        "kind": "smart_button", "status": "error", "reason": "unavailable", "entities": ["sensor.b"],
    }})]
    e.set("sensor.b", "unavailable", {"x": 1})
    assert len(frames) == 1  # same status: no frame
    e.set("sensor.b", "single")  # recovery is not a press
    assert frames[-1] == (False, {"c": OK_BTN})
    assert len(frames) == 2


def test_reload_sends_a_full_frame():
    e = Env(sensor__b="")
    e.rt.load_plans([plan(btn({"on": "sensor.b"}, did="c"))])
    frames = e.frames()
    other = e.frames("p2")
    e.rt.load_plans([plan()])
    assert frames == [(True, {})]
    e.rt.load_plans([plan(btn({"on": "sensor.b"}, did="c"))])
    assert frames[-1] == (True, {"c": OK_BTN})
    e.rt.load_plans([])
    assert frames[-1] == (True, {})
    assert other == [(True, {})] * 3


def test_reload_keeps_last_for_the_same_kind_a_kind_change_drops_it():
    e = Env(sensor__b="", light__f="off")
    b = btn({"on": "sensor.b"}, did="c")
    e.rt.load_plans([plan(b)])
    e.set("sensor.b", "single")
    frames = e.frames()
    e.rt.load_plans([plan(b)])
    assert frames[-1] == (True, {"c": {**OK_BTN, "last": TOGGLE_1}})
    # other props of the same kind keep it too
    e.rt.load_plans([plan(btn({"on": "sensor.b", "off": "sensor.b"}, did="c", separateOff=True))])
    assert e.rt.snapshot("p1")["c"]["last"] == TOGGLE_1
    # a kind change drops it, and it does not come back
    e.rt.load_plans([plan(wall(did="c"))])
    assert e.rt.snapshot("p1")["c"] == {"kind": "wall_switch", "status": "ok"}
    e.rt.load_plans([plan(b)])
    assert e.rt.snapshot("p1")["c"] == OK_BTN
    # a removed container forgets it
    e.set("sensor.b", "")
    e.set("sensor.b", "single")
    assert "last" in e.rt.snapshot("p1")["c"]
    e.rt.load_plans([plan()])
    e.rt.load_plans([plan(b)])
    assert e.rt.snapshot("p1")["c"] == OK_BTN


def test_listeners_get_intents_with_at_and_status_changes_a_failing_listener_is_dropped():
    e = Env(sensor__b="")
    e.rt.load_plans([plan(btn({"on": "sensor.b"}, did="c"))])
    bad_calls = []

    def bad(pid, did, ev):
        bad_calls.append(ev)
        raise RuntimeError("boom")

    def meddler(pid, did, ev):
        ev.clear()  # must not touch the runtime's copy or the other listeners' events

    e.rt.add_listener(bad)
    e.rt.add_listener(meddler)
    events = e.events()
    e.set("sensor.b", "single")
    assert events == [("p1", "c", TOGGLE_1)]
    e.set("sensor.b", "unavailable")
    e.set("sensor.b", "")
    assert events[1:] == [
        ("p1", "c", {"status": "error", "reason": "unavailable", "entities": ["sensor.b"]}),
        ("p1", "c", {"status": "ok"}),
    ]
    assert len(bad_calls) == 1
    assert e.rt.snapshot("p1")["c"] == {**OK_BTN, "last": TOGGLE_1}
    remove = e.rt.add_listener(lambda *a: bad_calls.append(a))
    remove()
    remove()  # twice is harmless
    e.set("sensor.b", "single")
    assert events[-1] == ("p1", "c", {"action": "toggle", "at": at(2)})
    assert len(bad_calls) == 1


def test_reload_tells_listeners_about_changed_statuses_only():
    e = Env(sensor__b="")
    e.rt.load_plans([plan(btn(did="c"))])
    events = e.events()
    e.rt.load_plans([plan(btn(did="c"))])
    assert events == []
    e.rt.load_plans([plan(btn({"on": "sensor.b"}, did="c"))])
    assert events == [("p1", "c", {"status": "ok"})]
    e.rt.load_plans([plan(btn({"on": "sensor.b"}, did="c"), btn(did="d"))])
    assert events[1:] == [("p1", "d", {"status": "error", "reason": "not_configured"})]


def test_a_reentrant_listener_does_not_break_the_frames():
    e = Env(sensor__b="")
    e.rt.load_plans([plan(btn({"on": "sensor.b"}, did="c"))])
    frames = e.frames()
    e.rt.add_listener(lambda pid, did, ev: e.rt.load_plans([]))  # the container disappears mid-notification
    e.set("sensor.b", "single")
    assert (False, {"c": {**OK_BTN, "last": TOGGLE_1}}) in frames  # the reload sent its own full frame too


def test_own_context_a_registered_id_or_parent_id_is_not_a_press_for_a_wall_switch():
    e = Env(light__f="off")
    e.rt.load_plans([plan(wall())])
    frames = e.frames()
    e.rt.ignore_context("ctx-1")
    e.rt.ignore_context("ctx-2")
    e.set("light.f", "on", context=("ctx-1", None))
    e.set("light.f", "off", context=("child", "ctx-2"))
    assert frames == []
    e.set("light.f", "on", context=("other", "parent"))
    assert frames == [(False, {"w": {"kind": "wall_switch", "status": "ok",
                                     "last": {"action": "set", "value": "on", "at": at(1)}}})]
    e.set("light.f", "off", context=(None, None))
    assert e.rt.snapshot("p1")["w"]["last"] == {"action": "set", "value": "off", "at": at(2)}
    # the status is still updated by an own change
    e.set("light.f", "unavailable")
    e.set("light.f", "on", context=("ctx-1", None))
    assert frames[-1] == (False, {"w": {"kind": "wall_switch", "status": "ok",
                                        "last": {"action": "set", "value": "off", "at": at(2)}}})
    assert e.stamps == 2


def test_the_double_toggle_window_uses_now():
    e = Env(light__f="on")
    e.rt.load_plans([plan(wall(autoByDoubleToggle=True, windowSec=3))])
    e.t = 100.0
    e.set("light.f", "off")
    e.t = 102.0
    e.set("light.f", "on")
    assert e.rt.snapshot("p1")["w"]["last"] == {"action": "auto", "at": at(2)}
    e.t = 110.0
    e.set("light.f", "off")
    assert e.rt.snapshot("p1")["w"]["last"] == {"action": "set", "value": "off", "at": at(3)}


def test_unsubscribe_stops_notifications():
    e = Env(sensor__b="")
    e.rt.load_plans([plan(btn({"on": "sensor.b"}))])
    calls = []
    off = e.rt.subscribe("p1", lambda full, c: calls.append(1))
    off()
    off()
    e.press()
    e.rt.load_plans([plan()])
    assert calls == []


def test_failing_subscriber_is_dropped_others_continue():
    e = Env(sensor__b="")
    e.rt.load_plans([plan(btn({"on": "sensor.b"}))])
    good, bad_calls = [], []

    def bad(full, c):
        bad_calls.append(1)
        raise RuntimeError("boom")

    e.rt.subscribe("p1", bad)
    e.rt.subscribe("p1", lambda full, c: good.append(c))
    e.press()
    e.press()
    assert len(good) == 2
    assert bad_calls == [1]


def test_entity_ids_cover_all_containers():
    e = Env()
    e.rt.load_plans([
        plan(btn({"on": "sensor.b"})),
        plan(wall(), pid="p2"),
    ])
    assert e.rt.entity_ids() == {"sensor.b", "light.f"}
