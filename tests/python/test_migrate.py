import pytest
from migrate import CURRENT_SCHEMA, migrate_plan


def test_current_unchanged():
    p = {"schemaVersion": 1, "id": "a", "levels": []}
    assert migrate_plan(p) == {"schemaVersion": 1, "id": "a", "levels": []}


def test_newer_raises():
    with pytest.raises(ValueError):
        migrate_plan({"schemaVersion": CURRENT_SCHEMA + 1})
