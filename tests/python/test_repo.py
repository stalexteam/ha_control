import pytest
import voluptuous as vol
from repo import PlanRepo, RevisionConflict, validate_plan


LEVEL = {"id": "l1", "name": "Level 1", "kind": "floor", "order": 0,
         "nodes": [], "walls": [], "openings": [], "zones": []}


def plan(pid, name="P"):
    return {"id": pid, "name": name, "schemaVersion": 1, "levels": [dict(LEVEL)]}


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
    {**plan("p"), "schemaVersion": 2}, {**plan("p"), "schemaVersion": True},
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
