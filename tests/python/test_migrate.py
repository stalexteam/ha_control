import copy

import pytest
import voluptuous as vol
from migrate import CURRENT_SCHEMA, migrate_plan
from repo import PlanRepo, validate_plan

OUTLINE = [{"x": 0, "y": 0}, {"x": 100, "y": 0}, {"x": 100, "y": 50}]
SEED = {"x": 10, "y": 10}
POLY = [{"kind": "free", "x": 0, "y": 0},
        {"kind": "node", "nodeId": "n1", "x": 5, "y": 0},
        {"kind": "wall", "wallId": "w1", "offset": 3, "side": "left", "x": 5, "y": 5}]


def room(rid="r1", name="Kitchen", broken=False):
    return {"id": rid, "name": name, "seed": dict(SEED), "outline": copy.deepcopy(OUTLINE), "broken": broken}


def az_room(zid, name, room_id="r1", invalid=False):
    return {"id": zid, "name": name, "shape": {"kind": "room", "roomId": room_id}, "invalid": invalid}


def az_poly(zid, name, invalid=False):
    return {"id": zid, "name": name, "shape": {"kind": "polygon", "vertices": copy.deepcopy(POLY)}, "invalid": invalid}


def v1(rooms, azones=None, devices=None):
    level = {"id": "l1", "name": "Level 1", "kind": "floor", "order": 0, "nodes": [], "walls": [],
             "openings": [], "zones": rooms, "devices": devices or []}
    if azones is not None:
        level["automationZones"] = azones
    return {"id": "p1", "name": "P", "schemaVersion": 1, "revision": 7, "levels": [level]}


def walls(zid, name, broken=False):
    return {"id": zid, "name": name,
            "shape": {"kind": "walls", "seed": SEED, "outline": OUTLINE, "broken": broken}, "invalid": broken}


def lost_poly(zid, name):
    return {"id": zid, "name": name,
            "shape": {"kind": "polygon", "vertices": [{"kind": "free", "x": p["x"], "y": p["y"], "lost": True}
                                                      for p in OUTLINE]},
            "invalid": True}


def level_of(plan):
    return plan["levels"][0]


def test_room_with_zone():
    out = migrate_plan(v1([room(broken=True)], [az_room("z1", "Kitchen light")]))
    assert out["schemaVersion"] == 2 and out["revision"] == 7
    assert "automationZones" not in level_of(out)
    assert level_of(out)["zones"] == [walls("z1", "Kitchen light", broken=True)]


def test_lone_room():
    out = migrate_plan(v1([room()]))
    assert level_of(out)["zones"] == [walls("r1", "Kitchen")]
    assert "automation" not in level_of(out)["zones"][0]


def test_polygon_zone():
    out = migrate_plan(v1([], [az_poly("z2", "Yard", invalid=True), az_poly("z3", "Porch")]))
    assert level_of(out)["zones"] == [
        {"id": "z2", "name": "Yard", "shape": {"kind": "polygon", "vertices": POLY}, "invalid": True},
        {"id": "z3", "name": "Porch", "shape": {"kind": "polygon", "vertices": POLY}, "invalid": False},
    ]


def test_two_zones_on_one_room():
    out = migrate_plan(v1([room()], [az_room("z1", "Light"), az_room("z2", "Vent"), az_room("z3", "Heat")]))
    assert level_of(out)["zones"] == [walls("z1", "Light"), lost_poly("z2", "Vent"), lost_poly("z3", "Heat")]


def test_missing_room_zone():
    out = migrate_plan(v1([room()], [az_room("z9", "Ghost", room_id="gone")]))
    assert level_of(out)["zones"] == [
        walls("r1", "Kitchen"),
        {"id": "z9", "name": "Ghost", "shape": {"kind": "polygon", "vertices": []}, "invalid": True},
    ]


def test_opt_out_survives():
    devices = [{"id": "d1", "zoneBlacklist": ["z1", "z2"]}, {"id": "d2"}]
    out = migrate_plan(v1([room()], [az_room("z1", "Light"), az_poly("z2", "Yard")], devices=copy.deepcopy(devices)))
    assert level_of(out)["devices"] == devices
    assert {z["id"] for z in level_of(out)["zones"]} >= {"z1", "z2"}


def test_v2_passes_unchanged():
    p = {"schemaVersion": 2, "id": "a", "levels": [{"zones": [walls("z1", "A")]}]}
    before = copy.deepcopy(p)
    assert migrate_plan(p) is p and p == before


def test_newer_version_raises():
    with pytest.raises(ValueError):
        migrate_plan({"schemaVersion": CURRENT_SCHEMA + 1})


def test_validate_requires_v2():
    assert CURRENT_SCHEMA == 2
    validate_plan({"id": "p", "name": "P", "schemaVersion": 2, "levels": [{"id": "l1"}]})
    for version in (1, 3, True, None):
        with pytest.raises(vol.Invalid, match="^schemaVersion must be 2: reload the Plan Studio page$"):
            validate_plan({"id": "p", "name": "P", "schemaVersion": version, "levels": [{"id": "l1"}]})


def test_v1_input_is_not_mutated():
    p = v1([room()], [az_room("z1", "Light"), az_room("z2", "Vent")])
    before = copy.deepcopy(p)
    migrate_plan(p)
    assert p == before


def test_malformed_v1_does_not_raise():
    level = {"id": "l1", "zones": ["junk", {"id": "r1"}, {"id": "r2", "outline": "bad", "broken": "yes"}],
             "automationZones": [None, 5, {"id": "z1"}, {"id": "z2", "shape": {"kind": "room", "roomId": "r2"}},
                                 {"id": "z3", "shape": {"kind": "polygon", "vertices": "bad"}}]}
    out = migrate_plan({"id": "p", "schemaVersion": 1, "levels": [level, "junk-level", {"id": "l2"}]})
    lv, junk, empty = out["levels"]
    assert junk == "junk-level" and empty == {"id": "l2", "zones": []}
    assert [z["id"] for z in lv["zones"]] == ["r1", "z2", "z1", "z3"]
    r1, z2, z1, z3 = lv["zones"]
    assert r1["shape"] == {"kind": "walls", "seed": {"x": 0, "y": 0}, "outline": [], "broken": False}
    assert r1["name"] == "" and r1["invalid"] is False
    assert z2["shape"]["kind"] == "walls" and z2["shape"]["outline"] == [] and z2["shape"]["broken"] is False
    assert z1["shape"] == {"kind": "polygon", "vertices": []} and z1["invalid"] is True
    assert z3["shape"] == {"kind": "polygon", "vertices": []}
    assert migrate_plan({"id": "p", "schemaVersion": 1, "levels": "bad"})["schemaVersion"] == 2
    odd = {"id": "l1", "zones": [{"id": ["x"]}, {}],
           "automationZones": [{"id": "z1", "shape": {"kind": "room", "roomId": ["x"]}},
                               {"id": "z2", "shape": {"kind": "room"}}]}
    zones = migrate_plan({"id": "p", "schemaVersion": 1, "levels": [odd]})["levels"][0]["zones"]
    assert [(z["id"], z["shape"]["kind"]) for z in zones] == [
        (["x"], "walls"), (None, "walls"), ("z1", "polygon"), ("z2", "polygon")]


def test_v1_tagged_plan_with_v2_zones_keeps_them():
    # A new panel saved v2 zones to an old server, which kept schemaVersion 1 (deploy-restart window).
    poly = {"id": "z2", "name": "Yard", "shape": {"kind": "polygon", "vertices": copy.deepcopy(POLY)},
            "invalid": False, "automation": False}
    wz = walls("z1", "Hall", broken=True)
    out = migrate_plan(v1([copy.deepcopy(wz), room("r1", "Kitchen"), copy.deepcopy(poly)]))
    assert out["schemaVersion"] == 2
    assert level_of(out)["zones"] == [wz, walls("r1", "Kitchen"), poly]


def test_repo_marks_migrated():
    v2 = {"id": "p2", "name": "B", "schemaVersion": 2, "revision": 3, "levels": [{"id": "l1", "zones": []}]}
    repo = PlanRepo({"plans": {"p1": v1([room()]), "p2": v2}})
    assert repo.migrated == ["p1"]
    assert repo.get("p1")["schemaVersion"] == 2 and repo.get("p1")["revision"] == 7
    assert PlanRepo({"plans": {"p2": v2}}).migrated == []
    assert PlanRepo(None).migrated == []


def control_plan(control, rules_extra=()):
    devices = [{"id": "btn", "props": {"kind": "smart_button"}}, {"id": "ws", "props": {"kind": "wall_switch"}},
               {"id": "l1", "props": {"kind": "ceiling_light"}}, {"id": "l2", "props": {"kind": "socket"}}]
    rule = {"id": "r1", "name": "Load control", "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 0,
            "inputs": [], "onTrue": [], "onFalse": [], "control": control}
    return {"id": "p1", "name": "P", "schemaVersion": 2, "revision": 9, "levels": [{"id": "l", "devices": devices}],
            "rules": [rule, *rules_extra]}


def old_control():
    return {"sources": ["btn", "ws"], "loads": ["l1", "l2"]}


def test_control_v20_is_converted():
    p = control_plan(old_control())
    before = copy.deepcopy(p)
    out = migrate_plan(p)
    assert p == before  # not mutated
    assert out["rules"][0]["control"] == {
        "sources": [{"button": "btn"}, {"source": {"device": "ws"}}],
        "on": [{"device": "l1", "do": "on"}, {"device": "l2", "do": "on"}],
        "off": [{"device": "l1", "do": "off"}, {"device": "l2", "do": "off"}],
        "toggle": [{"device": "l1", "do": "toggle"}, {"device": "l2", "do": "toggle"}],
    }
    assert out["revision"] == 9 and out["schemaVersion"] == 2
    validate_plan(out)


def test_control_v20_second_run_and_plain_plans_return_the_same_object():
    out = migrate_plan(control_plan(old_control()))
    assert migrate_plan(out) is out
    plain = control_plan(old_control())
    plain["rules"] = []
    assert migrate_plan(plain) is plain
    no_rules = {"schemaVersion": 2, "id": "a", "levels": []}
    assert migrate_plan(no_rules) is no_rules
    new_shape = control_plan({"sources": [{"button": "btn"}], "on": [], "off": [], "toggle": [{"device": "l1", "do": "toggle"}]})
    assert migrate_plan(new_shape) is new_shape


def test_control_v20_leaves_other_rules_and_junk_alone():
    other = {"id": "r2", "name": "R", "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 0,
             "inputs": [{"source": {"device": "ws"}}], "onTrue": [], "onFalse": []}
    out = migrate_plan(control_plan(old_control(), [other]))
    assert out["rules"][1] is other
    junk = control_plan({"sources": [3], "loads": ["l1"]})
    assert migrate_plan(junk) is junk
    assert migrate_plan({"schemaVersion": 2, "rules": "x", "levels": "y"}) == {"schemaVersion": 2, "rules": "x", "levels": "y"}


def test_control_v20_validate_rejects_the_old_shape():
    with pytest.raises(vol.Invalid, match="rule control"):
        validate_plan(control_plan(old_control()))


def test_repo_marks_control_v20_converted_and_keeps_the_revision():
    repo = PlanRepo({"plans": {"p1": control_plan(old_control())}})
    assert repo.migrated == ["p1"]
    plan = repo.get("p1")
    assert plan["revision"] == 9 and "on" in plan["rules"][0]["control"]
    assert PlanRepo({"plans": {"p1": plan}}).migrated == []
