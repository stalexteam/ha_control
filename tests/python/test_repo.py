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
        {"source": {"sun": True}, "not": True},
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
        ("sun", {"source": {"sun": False}}),
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
