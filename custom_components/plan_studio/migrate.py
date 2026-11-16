"""Plan schema migrations. Must not import homeassistant."""

from __future__ import annotations

CURRENT_SCHEMA = 2


def migrate_plan(plan: dict) -> dict:
    """Bring a stored plan to CURRENT_SCHEMA. A plan that needs no change is returned as the same object."""
    version = plan.get("schemaVersion")
    if isinstance(version, int) and version > CURRENT_SCHEMA:
        raise ValueError(
            f"plan schemaVersion {version} is newer than supported {CURRENT_SCHEMA}"
        )
    if type(version) is int and version == 1:
        return _v1_to_v2(plan)
    return plan


def _v1_to_v2(plan: dict) -> dict:
    """v1 rooms (`level.zones`) and automation zones (`level.automationZones`) become v2 zones. Input is not mutated."""
    levels = plan.get("levels")
    if isinstance(levels, list):
        levels = [_level_v1_to_v2(level) if isinstance(level, dict) else level for level in levels]
    return {**plan, "schemaVersion": 2, "levels": levels}


def _dicts(value: object) -> list[dict]:
    """The dict entries of a list; anything else (junk) is skipped."""
    return [v for v in value if isinstance(v, dict)] if isinstance(value, list) else []


def _rid(entry: dict, key: str = "id") -> str | None:
    """A string id, or None for a missing or junk one (which links nothing)."""
    value = entry.get(key)
    return value if isinstance(value, str) else None


def _walls_zone(zone_id: object, name: object, room: dict) -> dict:
    seed = room.get("seed")
    outline = room.get("outline")
    broken = room.get("broken") is True
    return {
        "id": zone_id,
        "name": name if isinstance(name, str) else "",
        "shape": {
            "kind": "walls",
            "seed": seed if isinstance(seed, dict) else {"x": 0, "y": 0},
            "outline": outline if isinstance(outline, list) else [],
            "broken": broken,
        },
        "invalid": broken,
    }


def _polygon_zone(zone: dict, vertices: list, invalid: bool) -> dict:
    name = zone.get("name")
    return {
        "id": zone.get("id"),
        "name": name if isinstance(name, str) else "",
        "shape": {"kind": "polygon", "vertices": vertices},
        "invalid": invalid,
    }


def _level_v1_to_v2(level: dict) -> dict:
    rooms = _dicts(level.get("zones"))
    room_ids = {_rid(r) for r in rooms} - {None}
    on_room: dict[object, list[dict]] = {}  # room id -> its automation zones of kind room, in order
    others: list[dict] = []  # polygon zones and zones whose room is missing (or whose shape is junk)
    for az in _dicts(level.get("automationZones")):
        shape = az.get("shape")
        if isinstance(shape, dict) and shape.get("kind") == "room" and _rid(shape, "roomId") in room_ids:
            on_room.setdefault(shape["roomId"], []).append(az)
        else:
            others.append(az)

    zones: list[dict] = []
    for room in rooms:
        linked = on_room.pop(_rid(room), [])
        if not linked:
            zones.append(_walls_zone(room.get("id"), room.get("name"), room))
            continue
        first, *rest = linked
        zones.append(_walls_zone(first.get("id"), first.get("name"), room))
        lost = [{"kind": "free", "x": p.get("x"), "y": p.get("y"), "lost": True} for p in _dicts(room.get("outline"))]
        zones.extend(_polygon_zone(az, [dict(v) for v in lost], True) for az in rest)
    for az in others:
        shape = az.get("shape")
        if isinstance(shape, dict) and shape.get("kind") == "polygon":
            vertices = shape.get("vertices")
            zones.append(_polygon_zone(az, vertices if isinstance(vertices, list) else [], az.get("invalid") is True))
        else:
            zones.append(_polygon_zone(az, [], True))

    out = {k: v for k, v in level.items() if k != "automationZones"}
    out["zones"] = zones
    return out
