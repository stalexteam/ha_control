"""Virtual switches kept by the integration: the synthetic entity ids and the state map (pure)."""

from virtual import KIND, LOOP_CHANGES, LOOP_REFUSE, LOOP_WINDOW, PREFIX, Breaker, Virtual, device_id, devices, entity_id


def test_synthetic_entity_ids():
    assert PREFIX == "virtual." and KIND == "virtual_switch"
    assert entity_id("abc123") == "virtual.abc123"
    assert device_id("virtual.abc123") == "abc123"
    assert device_id("switch.abc") is None and device_id("virtual.") is None and device_id(None) is None


def test_devices_lists_the_virtual_switches_of_a_plan():
    plan = {"id": "p", "levels": [
        {"devices": [{"id": "s", "props": {"kind": "virtual_switch"}},
                     {"id": "x", "props": {"kind": "socket"}}, "junk", {"props": {"kind": "virtual_switch"}}]},
        {"devices": [{"id": "t", "props": {"kind": "virtual_switch"}}]},
        "junk",
    ]}
    assert devices(plan) == ["s", "t"]
    assert devices({"id": "p"}) == []


def test_default_off_set_and_unknown_devices():
    v = Virtual()
    v.keep("p", ["s"])
    assert v.state("virtual.s") == "off"
    assert v.state("virtual.nope") is None and v.state("switch.s") is None
    assert v.set("virtual.s", "on") is True and v.state("virtual.s") == "on"
    assert v.set("virtual.s", "on") is False  # no change
    assert v.set("virtual.s", "dim") is False and v.state("virtual.s") == "on"
    assert v.set("virtual.nope", "on") is False and v.state("virtual.nope") is None
    assert v.states("p") == {"s": "on"} and v.states("other") == {}


def test_dump_and_load_round_trip_and_junk_is_ignored():
    v = Virtual()
    v.keep("p", ["s", "t"])
    v.set("virtual.t", "on")
    data = v.dump()
    assert data == {"p": {"s": "off", "t": "on"}}
    data["p"]["t"] = "off"  # a copy
    assert v.state("virtual.t") == "on"
    w = Virtual()
    w.load({"p": {"s": "off", "t": "on", "u": "maybe", "": "on"}, "q": "junk", 3: {"a": "on"}})
    assert w.dump() == {"p": {"s": "off", "t": "on"}}
    w.load(None)
    assert w.dump() == {}


def test_keep_drops_removed_devices_and_keeps_the_others():
    v = Virtual()
    v.load({"p": {"s": "on", "gone": "on"}, "deleted": {"z": "on"}})
    v.keep("p", ["s", "new"])
    v.keep("deleted", [])
    assert v.dump() == {"p": {"s": "on", "new": "off"}}
    assert v.state("virtual.gone") is None and v.state("virtual.z") is None


def test_subscribers_get_the_full_map_on_every_change():
    v = Virtual()
    v.keep("p", ["s"])
    frames, other = [], []
    unsub = v.subscribe("p", frames.append)
    v.subscribe("q", other.append)
    v.set("virtual.s", "on")
    v.set("virtual.s", "on")  # no change: no frame
    v.keep("p", ["s", "t"])  # a new virtual switch
    v.keep("p", ["s", "t"])  # nothing changed: no frame
    v.keep("p", ["t"])  # one removed
    assert frames == [{"states": {"s": "on"}}, {"states": {"s": "on", "t": "off"}}, {"states": {"t": "off"}}]
    assert other == []
    unsub()
    v.set("virtual.t", "on")
    assert len(frames) == 3


def test_a_failing_subscriber_is_dropped_and_the_others_still_get_frames():
    v = Virtual()
    v.keep("p", ["s"])
    frames = []

    def bad(frame):
        raise RuntimeError("boom")

    v.subscribe("p", bad)
    v.subscribe("p", frames.append)
    assert v.set("virtual.s", "on") is True
    v.set("virtual.s", "off")
    assert frames == [{"states": {"s": "on"}}, {"states": {"s": "off"}}]


def test_the_breaker_refuses_a_switch_changing_more_than_5_times_in_1_s_for_10_s():
    assert (LOOP_CHANGES, LOOP_WINDOW, LOOP_REFUSE) == (5, 1.0, 10.0)
    b = Breaker()
    assert [b.change("virtual.s", 0.1 * n) for n in range(5)] == ["ok"] * 5
    assert b.change("virtual.t", 0.5) == "ok"  # per switch
    assert b.change("virtual.s", 0.5) == "trip"  # the 6th within 1 s: a loop
    assert b.change("virtual.s", 9.9) == "refused" and b.change("virtual.s", 10.4) == "refused"
    assert b.change("virtual.s", 10.5) == "ok"  # 10 s after the trip: accepted, counted afresh
    assert [b.change("virtual.s", 10.5) for _ in range(4)] == ["ok"] * 4
    assert b.change("virtual.s", 10.6) == "trip"  # still looping: a new episode


def test_the_breaker_counts_only_the_changes_of_the_last_second():
    b = Breaker()
    assert all(b.change("virtual.s", 0.3 * n) == "ok" for n in range(40))  # about 3 per second, for 12 s
