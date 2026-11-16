"""PlanStore rollback: a failed disk write leaves the in-memory repo as it was (no Home Assistant needed)."""

import asyncio
import importlib
import sys
import types
from pathlib import Path

import pytest

PKG = Path(__file__).resolve().parents[2] / "custom_components" / "plan_studio"


class FailingStore:
    def __init__(self, hass, version, key) -> None:
        self.fail = False
        self.saved = None
        self.loaded = None
        self.saves = 0

    async def async_load(self):
        return self.loaded

    async def async_save(self, data) -> None:
        if self.fail:
            raise OSError("disk full")
        self.saved = data
        self.saves += 1


@pytest.fixture
def store_module(monkeypatch):
    """Import store.py inside a synthetic package with the two Home Assistant imports stubbed."""
    stubs = {
        "homeassistant": types.ModuleType("homeassistant"),
        "homeassistant.core": types.ModuleType("homeassistant.core"),
        "homeassistant.helpers": types.ModuleType("homeassistant.helpers"),
        "homeassistant.helpers.storage": types.ModuleType("homeassistant.helpers.storage"),
    }
    stubs["homeassistant.core"].HomeAssistant = object
    stubs["homeassistant.helpers.storage"].Store = FailingStore
    pkg = types.ModuleType("ps_under_test")
    pkg.__path__ = [str(PKG)]
    for name, mod in stubs.items():
        monkeypatch.setitem(sys.modules, name, mod)
    monkeypatch.setitem(sys.modules, "ps_under_test", pkg)
    monkeypatch.delitem(sys.modules, "ps_under_test.store", raising=False)
    module = importlib.import_module("ps_under_test.store")
    yield module
    sys.modules.pop("ps_under_test.store", None)


def _plan(name: str) -> dict:
    return {"id": "p1", "name": name, "schemaVersion": 2, "levels": [{"id": "l1"}]}


def test_failed_save_rolls_back_and_failed_delete_restores(store_module):
    store = store_module.PlanStore(None)

    async def run() -> None:
        await store.async_load()
        rev = await store.async_save(_plan("A"), None)
        assert store.get("p1")["name"] == "A"

        store._store.fail = True
        with pytest.raises(OSError):
            await store.async_save(_plan("B"), rev)
        assert store.get("p1")["name"] == "A"
        assert store.get("p1")["revision"] == rev

        with pytest.raises(OSError):
            await store.async_delete("p1")
        assert store.get("p1")["name"] == "A"

        store._store.fail = False
        assert await store.async_save(_plan("B"), rev) == rev + 1

    asyncio.run(run())


def _v1(pid: str) -> dict:
    room = {"id": "r1", "name": "Hall", "seed": {"x": 1, "y": 1}, "outline": [], "broken": False}
    return {"id": pid, "name": "Old", "schemaVersion": 1, "revision": 5, "levels": [{"id": "l1", "zones": [room]}]}


def test_load_saves_migrated_plans_at_once(store_module):
    store = store_module.PlanStore(None)
    store._store.loaded = {"plans": {"p1": _v1("p1")}}

    asyncio.run(store.async_load())
    assert store._store.saves == 1
    saved = store._store.saved["plans"]["p1"]
    assert saved["schemaVersion"] == 2 and saved["revision"] == 5
    assert saved["levels"][0]["zones"][0]["shape"]["kind"] == "walls"


def test_load_without_migration_does_not_save(store_module):
    store = store_module.PlanStore(None)
    store._store.loaded = {"plans": {"p1": {**_plan("A"), "revision": 2}}}
    asyncio.run(store.async_load())
    assert store._store.saves == 0
    asyncio.run(store_module.PlanStore(None).async_load())  # empty store: nothing to save either


def test_load_keeps_migrated_plans_when_the_write_fails(store_module, caplog):
    store = store_module.PlanStore(None)
    store._store.loaded = {"plans": {"p1": _v1("p1")}}
    store._store.fail = True
    asyncio.run(store.async_load())
    assert store.get("p1")["schemaVersion"] == 2
    assert "could not save" in caplog.text
