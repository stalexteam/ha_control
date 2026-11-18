import pytest
import voluptuous as vol
from repo import PlanRepo, RevisionConflict, validate_plan


LEVEL = {"id": "l1", "name": "Level 1", "kind": "floor", "order": 0,
         "nodes": [], "walls": [], "openings": [], "zones": []}


def plan(pid, name="P"):
    return {"id": pid, "name": name, "schemaVersion": 2, "levels": [dict(LEVEL)]}


def test_new_plan_gets_revision_1():
    r = PlanRepo(None); assert r.save(plan("p1"), None) == 1
    assert r.get("p1")["revision"] == 1
def test_save_with_current_revision_increments():
    r = PlanRepo(None); r.save(plan("p1"), None)
    assert r.save(plan("p1"), 1) == 2
def test_stale_revision_conflicts():
    r = PlanRepo(None); r.save(plan("p1"), None); r.save(plan("p1"), 1)
    with pytest.raises(RevisionConflict): r.save(plan("p1"), 1)
def test_force_overwrites_stale():
    r = PlanRepo(None); r.save(plan("p1"), None); r.save(plan("p1"), 1)
    assert r.save(plan("p1"), 1, force=True) == 3
def test_existing_id_without_expected_conflicts():
    r = PlanRepo(None); r.save(plan("p1"), None)
    with pytest.raises(RevisionConflict): r.save(plan("p1"), None)
def test_new_id_with_expected_conflicts():
    with pytest.raises(RevisionConflict): PlanRepo(None).save(plan("p1"), 1)
def test_list_and_delete():
    r = PlanRepo(None); r.save(plan("p1", name="Flat"), None)
    assert r.list() == [{"id": "p1", "name": "Flat", "revision": 1}]
    assert r.delete("p1") is True and r.get("p1") is None and r.delete("p1") is False
def test_roundtrip_to_dict():
    r = PlanRepo(None); r.save(plan("p1"), None)
    assert PlanRepo(r.to_dict()).get("p1")["revision"] == 1
@pytest.mark.parametrize("bad", [
    {**plan("p"), "id": ""}, {**plan("p"), "name": 1},
    {**plan("p"), "schemaVersion": 1}, {**plan("p"), "schemaVersion": 3},
    {**plan("p"), "schemaVersion": True},
    {**plan("p"), "levels": {}}, {**plan("p"), "levels": []},
    {**plan("p"), "blob": "x" * (5 * 1024 * 1024)},
])
def test_invalid(bad):
    with pytest.raises(vol.Invalid): PlanRepo(None).save(bad, None)

@pytest.mark.parametrize("rev", [True, False, "1", 1.0])
def test_non_int_expected_revision_rejected(rev):
    r = PlanRepo(None); r.save(plan("p1"), None)
    with pytest.raises(vol.Invalid): r.save(plan("p1"), rev)
def test_snapshot_restore_undoes_a_save():
    r = PlanRepo(None); r.save(plan("p1"), None)
    snap = r.snapshot()
    r.save(plan("p1", name="Changed"), 1); r.save(plan("p2"), None)
    r.restore(snap)
    assert r.list() == [{"id": "p1", "name": "P", "revision": 1}]
def test_repo_plans_returns_stored_plans():
    r = PlanRepo(None); r.save(plan("p1"), None); r.save(plan("p2"), None)
    assert {p["id"] for p in r.plans()} == {"p1", "p2"}
def test_validate_plan_power():
    validate_plan(plan("p"))  # no power
    validate_plan({**plan("p"), "power": {"blocks": [], "wires": []}})
    for bad in ({"blocks": {}}, {"blocks": [], "wires": {}}, {"wires": []}, [], None):
        with pytest.raises(vol.Invalid, match="power must have blocks and wires lists"):
            validate_plan({**plan("p"), "power": bad})


def rule(rid="r1", **kw):
    r = {"id": rid, "name": "R", "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 0,
         "inputs": [{"source": {"device": "d1"}}], "onTrue": [{"device": "d2", "do": "close"}], "onFalse": []}
    r.update(kw)
    return r


def ref(rid):
    return [{"source": {"rule": rid}}]


def test_validate_plan_rules():
    validate_plan(plan("p"))  # no rules
    validate_plan({**plan("p"), "rules": []})
    validate_plan({**plan("p"), "rules": [rule(enabled=False, zoneId="z", inputs=[{"source": {"rule": "r2"}, "not": True}]),
                                          rule("r2")]})
    bad = [
        ("rules must be a list", "x"),
        ("a rule must be an object", [1]),
        ("string id and name", [rule(id=1)]),
        ("string id and name", [rule(name=None)]),
        ("combine", [rule(combine="some")]),
        ("onDelay", [rule(onDelay=-1)]),
        ("offDelay", [rule(offDelay=3601)]),
        ("onDelay", [rule(onDelay=1.5)]),
        ("onDelay", [rule(onDelay=True)]),
        ("inputs must be a list", [rule(inputs="x")]),
        ("rule input", [rule(inputs=[{"source": {}}])]),
        ("rule input", [rule(inputs=[{"source": {"device": ""}}])]),
        ("rule input", [rule(inputs=[{"source": {"device": "a"}, "not": False}])]),
        ("onTrue must be a list", [rule(onTrue=None)]),
        ("rule action", [rule(onFalse=[{"device": "d", "do": "toggle"}])]),
        ("rule action", [rule(onTrue=[{"do": "on"}])]),
        ("duplicate", [rule("a"), rule("a")]),
        ("cycle", [rule("a", inputs=ref("b")), rule("b", inputs=ref("a"))]),
        ("cycle", [rule("a", inputs=ref("a"))]),
    ]
    for match, rules in bad:
        with pytest.raises(vol.Invalid, match=match):
            validate_plan({**plan("p"), "rules": rules})


def held(**kw):
    h = {"sources": [{"device": "d1"}], "state": "any", "seconds": 1800}
    h.update(kw)
    return {"source": {"held": h}}


def test_validate_plan_rule_sources_and_gate():
    good = [
        {"source": {"light": "d1", "below": 10, "hysteresis": 5}},
        {"source": {"light": "d1", "below": 0.5, "hysteresis": 0}},
        {"source": {"light": "d1", "below": 10, "hysteresis": 5, "unknownDark": True}},
        {"source": {"sun": True}, "not": True},
        {"source": {"daylight": "d1", "is": "night"}},
        {"source": {"daylight": "d1", "is": "dark"}},
        {"source": {"daylight": "d1", "is": "day"}},
        {"source": {"time": {"from": "17:00", "to": "01:00"}}},
        {"source": {"time": {"from": "00:00", "to": "23:59"}}},
        held(), held(seconds=1), held(seconds=86400, state="off", sources=[{"device": "a"}, {"rule": "r2"}]),
    ]
    for g in good:
        validate_plan({**plan("p"), "rules": [rule(inputs=[g]), rule("r2")]})
        validate_plan({**plan("p"), "rules": [rule(gate=g), rule("r2")]})
    bad = [
        ("light", {"source": {"light": "d1", "below": 0, "hysteresis": 5}}),
        ("light", {"source": {"light": "d1", "below": 10, "hysteresis": -1}}),
        ("light", {"source": {"light": "", "below": 10, "hysteresis": 1}}),
        ("light", {"source": {"light": "d1", "below": True, "hysteresis": 1}}),
        ("light", {"source": {"light": "d1", "below": 10}}),
        ("unknownDark", {"source": {"light": "d1", "below": 10, "hysteresis": 5, "unknownDark": False}}),
        ("unknownDark", {"source": {"light": "d1", "below": 10, "hysteresis": 5, "unknownDark": 1}}),
        ("daylight", {"source": {"daylight": "d1", "is": "twilight"}}),
        ("daylight", {"source": {"daylight": "d1"}}),
        ("daylight", {"source": {"daylight": "", "is": "day"}}),
        ("daylight", {"source": {"daylight": "d1", "is": "day", "below": 5}}),
        ("daylight", {"source": {"daylight": "d1", "is": "day"}, "not": True}),
        ("sun", {"source": {"sun": False}}),
        ("sun", {"source": {"sun": 1}}),
        ("time", {"source": {"time": {"from": "17:00\n", "to": "18:00"}}}),
        ("time", {"source": {"time": {"from": "17:00", "to": "17:00"}}}),
        ("time", {"source": {"time": {"from": "24:00", "to": "01:00"}}}),
        ("time", {"source": {"time": {"from": "7:00", "to": "08:00"}}}),
        ("time", {"source": {"time": {"from": "10:00"}}}),
        ("held seconds", held(seconds=0)),
        ("held seconds", held(seconds=86401)),
        ("held seconds", held(seconds=1.5)),
        ("held seconds", held(seconds=True)),
        ("held state", held(state="x")),
        ("at least one", held(sources=[])),
        ("rule input", held(sources=[{"light": "d"}])),
        ("rule input", held(sources=[{"device": ""}])),
        ("rule input", {"source": {"device": "a", "rule": "b"}}),
        ("sun input", {"source": {"sun": True, "device": "a"}}),
        ("not may only", {"source": {"sun": True}, "not": False}),
    ]
    for match, g in bad:
        for r in (rule(inputs=[g]), rule(gate=g)):
            with pytest.raises(vol.Invalid, match=match):
                validate_plan({**plan("p"), "rules": [r]})
    with pytest.raises(vol.Invalid, match="rule input"):
        validate_plan({**plan("p"), "rules": [rule(gate="x")]})


def test_validate_plan_rule_cycle_through_gate_and_held():
    with pytest.raises(vol.Invalid, match="cycle"):
        validate_plan({**plan("p"), "rules": [rule("a", gate={"source": {"rule": "b"}}), rule("b", inputs=ref("a"))]})
    with pytest.raises(vol.Invalid, match="cycle"):
        validate_plan({**plan("p"), "rules": [rule("a", inputs=[held(sources=[{"rule": "b"}])]), rule("b", inputs=ref("a"))]})
    with pytest.raises(vol.Invalid, match="cycle"):
        validate_plan({**plan("p"), "rules": [rule("a", gate=held(sources=[{"rule": "a"}]))]})


def vent_rule(rid="v1", vent=None, **kw):
    r = rule(rid, inputs=[], offDelay=600,
             vent={"sensor": "s1", "than": "s2", "above": 9, "below": 5} if vent is None else vent,
             onTrue=[{"device": "f", "do": "on"}], onFalse=[{"device": "f", "do": "off"}])
    r.update(kw)
    return r


def test_validate_plan_vent_rule():
    validate_plan({**plan("p"), "rules": [vent_rule()]})
    validate_plan({**plan("p"), "rules": [vent_rule(vent={"sensor": "a", "than": "b", "above": 0.5, "below": 0}, offDelay=0)]})
    validate_plan({**plan("p"), "rules": [vent_rule(), rule("u", inputs=ref("v1"))]})
    base = {"sensor": "s1", "than": "s2", "above": 9, "below": 5}
    bad = [
        {k: v for k, v in base.items() if k != "below"}, {**base, "extra": 1}, "x",
        {**base, "than": "s1"}, {**base, "sensor": ""}, {**base, "than": 3},
        {**base, "above": 0}, {**base, "above": -1}, {**base, "below": -1}, {**base, "below": 10},
        {**base, "above": True}, {**base, "above": float("nan")}, {**base, "below": "5"},
    ]
    for v in bad:
        with pytest.raises(vol.Invalid, match="rule vent"):
            validate_plan({**plan("p"), "rules": [vent_rule(vent=v)]})
    for kw in (
        {"inputs": ref("x")}, {"combine": "all"}, {"onDelay": 5}, {"gate": {"source": {"sun": True}}},
        {"onTrue": []}, {"onFalse": []},
        {"onTrue": [{"device": "f", "do": "off"}]}, {"onFalse": [{"device": "g", "do": "off"}]},
        {"onTrue": [{"device": "f", "do": "on"}, {"device": "g", "do": "on"}]},
    ):
        with pytest.raises(vol.Invalid, match="rule vent"):
            validate_plan({**plan("p"), "rules": [vent_rule(**kw)]})
    with pytest.raises(vol.Invalid, match="offDelay"):
        validate_plan({**plan("p"), "rules": [vent_rule(offDelay=3601)]})



def boiler_rule(rid="b1", boiler=None, **kw):
    r = rule(rid, inputs=[], onTrue=[], boiler={"device": "d", "button": "w", "grid": {"block": "g", "limit": 3000, "nominal": 1400}}
             if boiler is None else boiler)
    r.update(kw)
    return r


def test_validate_plan_boiler_rule():
    validate_plan({**plan("p"), "rules": [boiler_rule()]})
    validate_plan({**plan("p"), "rules": [boiler_rule(boiler={"device": "d", "button": "w"})]})
    validate_plan({**plan("p"), "rules": [boiler_rule(boiler={"device": "d", "button": "w", "grid": {"block": "g", "limit": 0.5, "nominal": 1}})]})
    base = {"device": "d", "button": "w", "grid": {"block": "g", "limit": 3000, "nominal": 1400}}
    g = base["grid"]
    bad = [
        {"device": "d"}, {"button": "w"}, {**base, "extra": 1}, "x", {**base, "button": "d"}, {**base, "device": ""}, {**base, "button": 3},
        {**base, "grid": "x"}, {**base, "grid": {"block": "g", "limit": 1}}, {**base, "grid": {**g, "extra": 1}},
        {**base, "grid": {**g, "block": ""}}, {**base, "grid": {**g, "limit": 0}}, {**base, "grid": {**g, "nominal": -1}},
        {**base, "grid": {**g, "limit": True}}, {**base, "grid": {**g, "nominal": "5"}}, {**base, "grid": {**g, "limit": float("nan")}},
    ]
    for b in bad:
        with pytest.raises(vol.Invalid, match="rule boiler"):
            validate_plan({**plan("p"), "rules": [boiler_rule(boiler=b)]})
    for kw in (
        {"inputs": ref("x")}, {"combine": "all"}, {"onDelay": 5}, {"offDelay": 5}, {"gate": {"source": {"sun": True}}},
        {"onTrue": [{"device": "f", "do": "on"}]}, {"onFalse": [{"device": "f", "do": "off"}]},
        {"vent": {"sensor": "a", "than": "b", "above": 9, "below": 5}},
    ):
        with pytest.raises(vol.Invalid, match="rule (boiler|vent)"):
            validate_plan({**plan("p"), "rules": [boiler_rule(**kw)]})


def leak_rule(rid="k1", leak=None, **kw):
    r = rule(rid, inputs=[], onTrue=[], leak={"sensors": ["s1", "s2"], "valves": ["v1"]} if leak is None else leak)
    r.update(kw)
    return r


def test_validate_plan_leak_rule():
    validate_plan({**plan("p"), "rules": [leak_rule()]})
    bad = [
        "x", [], {}, {"sensors": ["s"]}, {"valves": ["v"]}, {"sensors": ["s"], "valves": ["v"], "x": 1},
        {"sensors": [], "valves": ["v"]}, {"sensors": ["s"], "valves": []}, {"sensors": ["s", "s"], "valves": ["v"]},
        {"sensors": ["s"], "valves": ["v", "v"]}, {"sensors": [""], "valves": ["v"]}, {"sensors": ["s"], "valves": [1]},
        {"sensors": "s", "valves": ["v"]},
    ]
    for b in bad:
        with pytest.raises(vol.Invalid, match="rule leak"):
            validate_plan({**plan("p"), "rules": [leak_rule(leak=b)]})
    for kw in (
        {"inputs": ref("x")}, {"combine": "all"}, {"onDelay": 5}, {"offDelay": 5}, {"gate": {"source": {"sun": True}}},
        {"onTrue": [{"device": "f", "do": "close"}]}, {"onFalse": [{"device": "f", "do": "open"}]},
        {"vent": {"sensor": "a", "than": "b", "above": 9, "below": 5}}, {"boiler": {"device": "d", "button": "w"}},
    ):
        with pytest.raises(vol.Invalid, match="rule (leak|vent|boiler)"):
            validate_plan({**plan("p"), "rules": [leak_rule(**kw)]})


def test_validate_plan_old_leak_condition_rule_still_valid():
    validate_plan({**plan("p"), "rules": [rule("o", inputs=ref("d"), onTrue=[{"device": "v", "do": "close"}])]})


def timed_rule(rid="t1", timed=None, **kw):
    r = rule(rid, inputs=[], onTrue=[], timed={"button": "b", "device": "d", "minutes": 15} if timed is None else timed)
    r.update(kw)
    return r


def test_validate_plan_timed_rule():
    validate_plan({**plan("p"), "rules": [timed_rule()]})
    validate_plan({**plan("p"), "rules": [timed_rule(timed={"button": "b", "device": "d", "minutes": 1440, "invert": True})]})
    base = {"button": "b", "device": "d", "minutes": 15}
    bad = [
        "x", [], {}, {"button": "b", "device": "d"}, {"device": "d", "minutes": 5}, {**base, "x": 1},
        {**base, "button": ""}, {**base, "device": 3}, {**base, "minutes": 0}, {**base, "minutes": 1441},
        {**base, "minutes": 1.5}, {**base, "minutes": True}, {**base, "minutes": "5"},
        {**base, "invert": False}, {**base, "invert": 1}, {**base, "device": "b"},
    ]
    for b in bad:
        with pytest.raises(vol.Invalid, match="rule timed"):
            validate_plan({**plan("p"), "rules": [timed_rule(timed=b)]})
    for kw in (
        {"inputs": ref("x")}, {"combine": "all"}, {"onDelay": 5}, {"offDelay": 5}, {"gate": {"source": {"sun": True}}},
        {"onTrue": [{"device": "f", "do": "on"}]}, {"onFalse": [{"device": "f", "do": "off"}]},
        {"vent": {"sensor": "a", "than": "b", "above": 9, "below": 5}}, {"boiler": {"device": "d", "button": "w"}},
        {"leak": {"sensors": ["s"], "valves": ["v"]}},
    ):
        with pytest.raises(vol.Invalid, match="rule (timed|vent|boiler|leak)"):
            validate_plan({**plan("p"), "rules": [timed_rule(**kw)]})
    # the other kinds reject a timed key too
    for other in (vent_rule(), boiler_rule(), leak_rule()):
        with pytest.raises(vol.Invalid, match="rule (timed|vent|boiler|leak)"):
            validate_plan({**plan("p"), "rules": [{**other, "timed": {"button": "b", "device": "d", "minutes": 5}}]})


def test_boiler_validator_rejects_a_timed_key_on_its_own():
    import repo

    with pytest.raises(vol.Invalid, match="rule boiler"):
        repo._validate_boiler({**boiler_rule(), "timed": {}}, boiler_rule()["boiler"])


def outside_rule(rid="o1", outside=None, **kw):
    r = rule(rid, inputs=[], onTrue=[], outside={"light": "l", "sensor": "s", "pause": 30} if outside is None else outside)
    r.update(kw)
    return r


def test_validate_plan_outside_rule():
    validate_plan({**plan("p"), "rules": [outside_rule()]})
    full = {"light": "l", "sensor": "s", "noDataNight": True, "afterSunset": True, "window": {"from": "18:00", "to": "06:00"}, "pause": 1440}
    validate_plan({**plan("p"), "rules": [outside_rule(outside=full)]})
    validate_plan({**plan("p"), "rules": [outside_rule(outside={"light": "l", "sensor": "s", "pause": 0})]})
    base = {"light": "l", "sensor": "s", "pause": 30}
    bad = [
        "x", [], {}, {"light": "l", "sensor": "s"}, {"sensor": "s", "pause": 5}, {**base, "x": 1},
        {**base, "light": ""}, {**base, "sensor": 3}, {**base, "sensor": "l"},
        {**base, "pause": -1}, {**base, "pause": 1441}, {**base, "pause": 1.5}, {**base, "pause": True}, {**base, "pause": "5"},
        {**base, "noDataNight": False}, {**base, "afterSunset": 1},
        {**base, "window": "x"}, {**base, "window": {"from": "18:00"}}, {**base, "window": {"from": "18:00", "to": "18:00"}},
        {**base, "window": {"from": "24:00", "to": "06:00"}}, {**base, "window": {"from": "1:00", "to": "06:00"}},
        {**base, "window": {"from": "18:00", "to": "06:00", "x": 1}},
    ]
    for b in bad:
        with pytest.raises(vol.Invalid, match="rule outside"):
            validate_plan({**plan("p"), "rules": [outside_rule(outside=b)]})
    for kw in (
        {"inputs": ref("x")}, {"combine": "all"}, {"onDelay": 5}, {"offDelay": 5}, {"gate": {"source": {"sun": True}}},
        {"onTrue": [{"device": "d", "do": "on"}]}, {"onFalse": [{"device": "d", "do": "off"}]},
        {"timed": {"button": "b", "device": "d", "minutes": 5}}, {"leak": {"sensors": ["s"], "valves": ["v"]}},
    ):
        with pytest.raises(vol.Invalid, match="rule (outside|timed|leak)"):
            validate_plan({**plan("p"), "rules": [outside_rule(**kw)]})
    # the other kinds reject an outside key too
    for other in (vent_rule(), boiler_rule(), leak_rule(), timed_rule()):
        with pytest.raises(vol.Invalid, match="rule (timed|vent|boiler|leak)"):
            validate_plan({**plan("p"), "rules": [{**other, "outside": {"light": "l", "sensor": "s", "pause": 30}}]})


def beurer_rule(rid="u1", beurer=None, **kw):
    r = rule(rid, inputs=[], onTrue=[], offDelay=60, beurer={"heater": "h", "source": "p", "above": 200, "keep": 10, "every": 30} if beurer is None else beurer)
    r.update(kw)
    return r


def test_validate_plan_beurer_rule():
    validate_plan({**plan("p"), "rules": [beurer_rule()]})
    validate_plan({**plan("p"), "rules": [beurer_rule(offDelay=3600, beurer={"heater": "h", "source": "p", "above": 0.5, "keep": 0, "every": 1440})]})
    base = {"heater": "h", "source": "p", "above": 200, "keep": 10, "every": 30}
    bad = [
        "x", [], {}, {k: v for k, v in base.items() if k != "every"}, {**base, "x": 1},
        {**base, "heater": ""}, {**base, "source": 3}, {**base, "source": "h"},
        {**base, "above": 0}, {**base, "above": -1}, {**base, "above": True}, {**base, "above": "5"}, {**base, "above": float("nan")},
        {**base, "keep": 1.5}, {**base, "keep": -1}, {**base, "keep": 1441}, {**base, "keep": True},
        {**base, "every": 1.5}, {**base, "every": -1}, {**base, "every": 1441}, {**base, "every": True},
    ]
    for b in bad:
        with pytest.raises(vol.Invalid, match="rule beurer"):
            validate_plan({**plan("p"), "rules": [beurer_rule(beurer=b)]})
    for kw in (
        {"inputs": ref("x")}, {"combine": "all"}, {"onDelay": 5}, {"gate": {"source": {"sun": True}}},
        {"onTrue": [{"device": "d", "do": "on"}]}, {"onFalse": [{"device": "d", "do": "off"}]},
        {"vent": {"sensor": "a", "than": "b", "above": 9, "below": 5}}, {"boiler": {"device": "d", "button": "b"}},
        {"leak": {"sensors": ["s"], "valves": ["v"]}}, {"timed": {"button": "b", "device": "d", "minutes": 5}},
        {"outside": {"light": "l", "sensor": "s", "pause": 5}},
    ):
        with pytest.raises(vol.Invalid, match="rule "):
            validate_plan({**plan("p"), "rules": [beurer_rule(**kw)]})
    with pytest.raises(vol.Invalid, match="rule (offDelay|beurer)"):
        validate_plan({**plan("p"), "rules": [beurer_rule(offDelay=3601)]})
    # the other kinds reject a beurer key too
    for other in (vent_rule(), boiler_rule(), leak_rule(), timed_rule(), outside_rule()):
        with pytest.raises(vol.Invalid, match="rule (timed|vent|boiler|leak|outside)"):
            validate_plan({**plan("p"), "rules": [{**other, "beurer": {"heater": "h", "source": "p", "above": 200, "keep": 10, "every": 30}}]})


def motion_rule(rid="u1", ml=None, **kw):
    r = rule(rid, inputs=[], onTrue=[], offDelay=180, motionLight={"light": "l", "sensors": ["s1", "s2"], "daylight": {"sensor": "ls", "is": "dark"}, "minOn": 0, "buttons": ["b1"], "autoAfter": 0} if ml is None else ml)
    r.update(kw)
    return r


def test_validate_plan_motion_light_rule():
    validate_plan({**plan("p"), "rules": [motion_rule()]})
    base = {"light": "l", "sensors": ["s1"], "minOn": 3600, "buttons": [], "autoAfter": 1440}
    validate_plan({**plan("p"), "rules": [motion_rule(ml=base, offDelay=0)]})
    validate_plan({**plan("p"), "rules": [motion_rule(ml={**base, "daylight": {"sensor": "ls", "is": "night"}}, offDelay=3600)]})
    # 0.22.1: motion sensors are optional; a rule with a light only is valid
    validate_plan({**plan("p"), "rules": [motion_rule(ml={**base, "sensors": []})]})
    validate_plan({**plan("p"), "rules": [motion_rule(ml={"light": "l", "sensors": [], "minOn": 0, "buttons": [], "autoAfter": 0})]})
    good = motion_rule()["motionLight"]
    bad = [
        "x", [], {}, {k: v for k, v in good.items() if k != "autoAfter"}, {k: v for k, v in good.items() if k != "buttons"}, {**good, "x": 1},
        {k: v for k, v in good.items() if k != "sensors"},
        {**good, "light": ""}, {**good, "light": 3}, {**good, "sensors": "s1"}, {**good, "sensors": ["s1", "s1"]}, {**good, "sensors": ["s1", ""]},
        {**good, "buttons": ["b1", "b1"]}, {**good, "buttons": [""]}, {**good, "sensors": ["l"]}, {**good, "buttons": ["l"]},
        {**good, "daylight": "x"}, {**good, "daylight": {"sensor": "ls"}}, {**good, "daylight": {"is": "dark"}}, {**good, "daylight": {"sensor": "", "is": "dark"}},
        {**good, "daylight": {"sensor": "ls", "is": "day"}}, {**good, "daylight": {"sensor": "ls", "is": "dark", "x": 1}},
        {**good, "minOn": -1}, {**good, "minOn": 1.5}, {**good, "minOn": 3601}, {**good, "minOn": True}, {**good, "minOn": "5"},
        {**good, "autoAfter": -1}, {**good, "autoAfter": 1.5}, {**good, "autoAfter": 1441}, {**good, "autoAfter": True},
    ]
    for b in bad:
        with pytest.raises(vol.Invalid, match="rule motionLight"):
            validate_plan({**plan("p"), "rules": [motion_rule(ml=b)]})
    for kw in (
        {"inputs": ref("x")}, {"combine": "all"}, {"onDelay": 5}, {"gate": {"source": {"sun": True}}},
        {"onTrue": [{"device": "d", "do": "on"}]}, {"onFalse": [{"device": "d", "do": "off"}]},
        {"vent": {"sensor": "a", "than": "b", "above": 9, "below": 5}}, {"boiler": {"device": "d", "button": "b"}},
        {"leak": {"sensors": ["s"], "valves": ["v"]}}, {"timed": {"button": "b", "device": "d", "minutes": 5}},
        {"outside": {"light": "l", "sensor": "s", "pause": 5}}, {"beurer": {"heater": "h", "source": "p", "above": 200, "keep": 10, "every": 30}},
        {"control": {"sources": [{"button": "b"}], "on": [], "off": [], "toggle": [{"device": "t", "do": "toggle"}]}},
    ):
        with pytest.raises(vol.Invalid, match="rule "):
            validate_plan({**plan("p"), "rules": [motion_rule(**kw)]})
    with pytest.raises(vol.Invalid, match="rule (offDelay|motionLight)"):
        validate_plan({**plan("p"), "rules": [motion_rule(offDelay=3601)]})
    # the other kinds reject a motionLight key too
    other_control = {**rule("c1", inputs=[], onTrue=[]), "control": {"sources": [{"button": "b"}], "on": [], "off": [], "toggle": [{"device": "t", "do": "toggle"}]}}
    for other in (vent_rule(), boiler_rule(), leak_rule(), timed_rule(), outside_rule(), beurer_rule(), other_control):
        with pytest.raises(vol.Invalid, match="rule (timed|vent|boiler|leak|outside|beurer|control|motionLight)"):
            validate_plan({**plan("p"), "rules": [{**other, "motionLight": good}]})


def test_validate_plan_motion_light_blocker():
    """0.26.0: an optional blocker {device, is: on | off}; the device must not be the light."""
    good = motion_rule()["motionLight"]
    for is_ in ("on", "off"):
        validate_plan({**plan("p"), "rules": [motion_rule(ml={**good, "blocker": {"device": "vs", "is": is_}})]})
    bad = [
        "vs", None, [], {}, {"device": "vs"}, {"is": "on"}, {"device": "", "is": "on"}, {"device": 3, "is": "on"},
        {"device": "vs", "is": "x"}, {"device": "vs", "is": True}, {"device": "vs", "is": "on", "x": 1},
        {"device": "l", "is": "on"},
    ]
    for b in bad:
        with pytest.raises(vol.Invalid, match="rule motionLight"):
            validate_plan({**plan("p"), "rules": [motion_rule(ml={**good, "blocker": b})]})


def ctl(**kw):
    c = {"sources": [{"button": "b"}], "on": [], "off": [], "toggle": [{"device": "l", "do": "toggle"}]}
    c.update(kw)
    return c


def control_rule(rid="c1", control=None, **kw):
    r = rule(rid, inputs=[], onTrue=[], control=ctl() if control is None else control)
    r.update(kw)
    return r


def test_validate_plan_control_rule():
    validate_plan({**plan("p"), "rules": [control_rule()]})
    validate_plan({**plan("p"), "rules": [control_rule(control=ctl(
        sources=[{"source": {"device": "w"}, "not": True}, {"button": "b"}, {"source": {"sun": True}}],
        on=[{"device": "l", "do": "on"}], off=[{"device": "l", "do": "off"}, {"device": "l2", "do": "off"}]))]})
    validate_plan({**plan("p"), "rules": [control_rule(control=ctl(toggle=[], on=[{"device": "v", "do": "close"}]))]})
    validate_plan({**plan("p"), "rules": [control_rule(gate={"source": {"sun": True}})]})
    bad = [
        "x", [], {}, {"sources": [{"button": "b"}]}, ctl(x=1),
        # the 0.20.0 shape
        {"sources": ["s"], "loads": ["l"]},
        ctl(sources=[]), ctl(sources="b"), ctl(sources=["b"]), ctl(sources=[{"button": ""}]), ctl(sources=[{"button": "b", "x": 1}]),
        ctl(toggle=[]), ctl(on="x"), ctl(toggle=[{"device": "l", "do": "open"}]), ctl(toggle=[{"device": "", "do": "on"}]),
        ctl(toggle=[{"device": "l", "do": "toggle", "x": 1}]),
        ctl(sources=[{"button": "b"}, {"button": "b"}]),
        ctl(sources=[{"source": {"device": "w"}, "not": True}, {"not": True, "source": {"device": "w"}}]),
        ctl(toggle=[{"device": "l", "do": "toggle"}, {"device": "l", "do": "toggle"}]),
        ctl(sources=[{"source": {"device": "l"}}]),
        ctl(sources=[{"source": {"held": {"sources": [{"device": "l"}], "state": "any", "seconds": 5}}}]),
        ctl(sources=[{"source": {"daylight": "s", "is": "night"}, "not": True}]),
    ]
    for c in bad:
        with pytest.raises(vol.Invalid, match="rule "):
            validate_plan({**plan("p"), "rules": [control_rule(control=c)]})
    # a button source may also be a target; a rule source may be anything
    validate_plan({**plan("p"), "rules": [control_rule(control=ctl(sources=[{"button": "l"}]))]})
    for kw in (
        {"inputs": ref("x")}, {"combine": "all"}, {"onDelay": 5}, {"offDelay": 5},
        {"onTrue": [{"device": "d", "do": "on"}]}, {"onFalse": [{"device": "d", "do": "off"}]},
        {"vent": {"sensor": "a", "than": "b", "above": 9, "below": 5}}, {"boiler": {"device": "d", "button": "b"}},
        {"leak": {"sensors": ["s"], "valves": ["v"]}}, {"timed": {"button": "b", "device": "d", "minutes": 5}},
        {"outside": {"light": "l", "sensor": "s", "pause": 5}}, {"beurer": {"heater": "h", "source": "p", "above": 200, "keep": 10, "every": 30}},
    ):
        with pytest.raises(vol.Invalid, match="rule "):
            validate_plan({**plan("p"), "rules": [control_rule(**kw)]})
    # the other kinds reject a control key too
    for other in (vent_rule(), boiler_rule(), leak_rule(), timed_rule(), outside_rule(), beurer_rule()):
        with pytest.raises(vol.Invalid, match="rule (timed|vent|boiler|leak|outside|beurer)"):
            validate_plan({**plan("p"), "rules": [{**other, "control": ctl()}]})


def test_validate_plan_control_rule_source_refs():
    # a rule source takes part in the reference check (cycles)
    other = rule("r2", inputs=ref("c1"))
    with pytest.raises(vol.Invalid, match="cycle"):
        validate_plan({**plan("p"), "rules": [control_rule(control=ctl(sources=[{"source": {"rule": "r2"}}])), other]})
    validate_plan({**plan("p"), "rules": [control_rule(control=ctl(sources=[{"source": {"rule": "r2"}}])), rule("r2")]})


def with_devices(*devices):
    return {**plan("p"), "levels": [{**LEVEL, "devices": list(devices)}]}


def vswitch(did="s1", bindings=None, **extra):
    return {"id": did, "name": "Sleep", "placement": {"mode": "none"}, "props": {"kind": "virtual_switch"},
            "bindings": {"control": f"virtual.{did}"} if bindings is None else bindings, **extra}


def test_validate_plan_virtual_switch_binds_only_its_synthetic_entity():
    validate_plan(with_devices(vswitch()))
    validate_plan(with_devices(vswitch("a"), vswitch("b"), {"id": "x", "props": {"kind": "socket"}, "bindings": {}}))
    for bad in (
        {}, {"control": "virtual.other"}, {"control": "switch.s1"}, {"control": "virtual.s1", "power": "sensor.p"},
        {"state": "virtual.s1"}, None, "virtual.s1",
    ):
        with pytest.raises(vol.Invalid, match="virtual switch"):
            validate_plan(with_devices(vswitch(bindings=bad) if bad is not None else {**vswitch(), "bindings": None}))
    with pytest.raises(vol.Invalid, match="virtual switch"):
        validate_plan(with_devices({**vswitch(), "id": ""}))


def test_validate_plan_only_a_virtual_switch_binds_a_virtual_entity():
    for bindings in ({"control": "virtual.s1"}, {"power": "virtual.s1"}, {"state": "virtual.x"}, {"control": "virtual."}):
        with pytest.raises(vol.Invalid, match="only a virtual switch binds a virtual entity"):
            validate_plan(with_devices(vswitch("s1"), {"id": "x", "props": {"kind": "socket"}, "bindings": bindings}))
    with pytest.raises(vol.Invalid, match="only a virtual switch binds a virtual entity"):
        validate_plan(with_devices({"id": "x", "bindings": {"control": "virtual.x"}}))  # no kind at all
    validate_plan(with_devices({"id": "x", "props": {"kind": "socket"}, "bindings": {"control": "switch.virtual_x"}}))


def test_validate_plan_rule_must_not_switch_a_virtual_switch_it_reads():
    base = with_devices(vswitch("s1"), {"id": "x", "props": {"kind": "socket"}, "bindings": {"control": "switch.x"}})
    for kw in (
        {"inputs": [{"source": {"device": "s1"}, "not": True}],
         "onTrue": [{"device": "s1", "do": "on"}], "onFalse": [{"device": "s1", "do": "off"}]},
        {"inputs": [{"source": {"device": "d1"}}, {"source": {"device": "s1"}}], "onTrue": [],
         "onFalse": [{"device": "s1", "do": "on"}]},
    ):
        with pytest.raises(vol.Invalid, match="must not switch a virtual switch it reads as an input"):
            validate_plan({**base, "rules": [rule(**kw)]})
    # a real device may switch what it reads (auto-off); a held source or the gate over a virtual switch is no loop
    for kw in (
        {"inputs": [{"source": {"device": "x"}}], "onTrue": [{"device": "x", "do": "off"}]},
        {"inputs": [held(sources=[{"device": "s1"}], state="on")], "onTrue": [{"device": "s1", "do": "off"}]},
        {"gate": {"source": {"device": "s1"}}, "onTrue": [{"device": "s1", "do": "off"}]},
        {"inputs": [{"source": {"device": "s1"}}], "onTrue": [{"device": "x", "do": "on"}]},
    ):
        validate_plan({**base, "rules": [rule(**kw)]})


# --- speaker, phone and the announcements ------------------------------------------

SPEAKER = {"id": "sp", "name": "Speaker", "placement": {"mode": "free"}, "props": {"kind": "speaker"},
           "bindings": {"player": "media_player.vlc", "voice": "tts.piper"}}
MUTE = {**SPEAKER, "id": "mute", "bindings": {"player": "media_player.vlc"}}  # no voice: plays only
PHONE = {"id": "ph", "name": "Phone", "placement": {"mode": "none"},
         "props": {"kind": "phone", "notify": "mobile_app_phone"}}
AUTO_MP3 = "media-source://media_source/local/Auto.mp3"


def say(did="sp", text="Go bathe", **kw):
    return {"device": did, "do": "say", "text": text, **kw}


def play(did="sp", media=AUTO_MP3, **kw):
    return {"device": did, "do": "play", "media": media, **kw}


def notify(did="ph", text="Go bathe", **kw):
    return {"device": did, "do": "notify", "text": text, **kw}


def test_validate_plan_speaker_and_phone_devices():
    validate_plan(with_devices(SPEAKER, MUTE, PHONE))
    # not bound yet (the Binding step comes later): a speaker without a player, a phone without a notify service
    validate_plan(with_devices({**SPEAKER, "bindings": {}}, {**SPEAKER, "id": "s2", "bindings": None},
                               {k: v for k, v in SPEAKER.items() if k != "bindings"},
                               {**PHONE, "props": {"kind": "phone"}}, {**PHONE, "id": "p2", "bindings": {}}))
    for bindings in (
        {"player": "light.vlc"}, {"player": "media_player"}, {"player": "media_player."}, {"player": ""},
        {"player": 5}, {"voice": "media_player.vlc"}, {"player": "media_player.vlc", "voice": "tts"},
        {"player": "media_player.vlc", "control": "switch.x"}, "media_player.vlc",
    ):
        with pytest.raises(vol.Invalid, match="a speaker binds only"):
            validate_plan(with_devices({**SPEAKER, "bindings": bindings}))
    with pytest.raises(vol.Invalid, match="a phone binds no entity"):
        validate_plan(with_devices({**PHONE, "bindings": {"control": "switch.x"}}))
    for name in ("", "notify.mobile_app_phone", "Mobile app", "mobile app", 5, None):
        with pytest.raises(vol.Invalid, match="a phone needs notify as a notify service name"):
            validate_plan(with_devices({**PHONE, "props": {"kind": "phone", "notify": name}}))


def test_validate_plan_announcement_actions_of_a_condition_rule():
    base = with_devices(SPEAKER, MUTE, PHONE, {"id": "x", "props": {"kind": "socket"}, "bindings": {"control": "switch.x"}})
    for actions in (
        [say(), play(), notify()],
        [notify(title="Boiler"), play("mute"), {"device": "x", "do": "on"}],
        [say("gone"), notify("gone")],  # a deleted device: the engine says "target missing"
    ):
        validate_plan({**base, "rules": [rule(onTrue=actions, onFalse=actions)]})
    bad = [
        ("rule say action needs a device and a text", {"device": "sp", "do": "say"}),
        ("rule say action needs a device and a text", say(media=AUTO_MP3)),
        ("rule say action needs a device and a text", say(title="t")),
        ("rule say action needs a device and a text", say(device="")),
        ("rule say action needs a non-empty text", say(text="")),
        ("rule say action needs a non-empty text", say(text="   ")),
        ("rule say action needs a non-empty text", say(text=5)),
        ("rule play action needs a device and a media", {"device": "sp", "do": "play", "text": "x"}),
        ("rule play action needs a non-empty media", play(media=" ")),
        ("rule notify action needs a device, a text and optionally a title", notify(media=AUTO_MP3)),
        ("rule notify action needs a non-empty text", notify(text="")),
        ("rule notify action needs a non-empty title", notify(title="")),
        ("rule notify action needs a non-empty title", notify(title=" ")),
        ("rule say action needs a speaker with a voice", say("mute")),
        ("rule say action needs a speaker with a voice", say("ph")),
        ("rule say action needs a speaker with a voice", say("x")),
        ("rule play action needs a speaker", play("ph")),
        ("rule play action needs a speaker", play("x")),
        ("rule notify action needs a phone with a notify service", notify("sp")),
        ("rule action needs a device and do", {"device": "sp", "do": "speak", "text": "x"}),
    ]
    for match, action in bad:
        for key in ("onTrue", "onFalse"):
            with pytest.raises(vol.Invalid, match=match):
                validate_plan({**base, "rules": [rule(**{key: [action]})]})
    with pytest.raises(vol.Invalid, match="rule notify action needs a phone with a notify service"):
        validate_plan({**with_devices({**PHONE, "props": {"kind": "phone"}}), "rules": [rule(onTrue=[notify()])]})


def test_validate_plan_announcement_actions_of_a_load_control_rule():
    base = with_devices(SPEAKER, MUTE, PHONE)
    validate_plan({**base, "rules": [control_rule(control=ctl(
        on=[say(), notify(title="Boiler")], off=[play("mute")], toggle=[{"device": "l", "do": "toggle"}, play()]))]})
    validate_plan({**base, "rules": [control_rule(control=ctl(toggle=[], on=[play()]))]})  # announcements alone
    bad = [
        ctl(on=[say(text="")]), ctl(on=[play(media="")]), ctl(toggle=[notify(title="")]),
        ctl(on=[say("mute")]), ctl(off=[play("ph")]), ctl(toggle=[notify("sp")]),
        ctl(on=[{"device": "sp", "do": "say"}]),
        ctl(on=[say(), play()]),  # a device once in a list
    ]
    for c in bad:
        with pytest.raises(vol.Invalid, match="rule "):
            validate_plan({**base, "rules": [control_rule(control=c)]})
