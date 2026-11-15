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

    async def async_load(self):
        return None

    async def async_save(self, data) -> None:
        if self.fail:
            raise OSError("disk full")
        self.saved = data


def _load_store_module():
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
    sys.modules.update(stubs)
    sys.modules["ps_under_test"] = pkg
    sys.modules.pop("ps_under_test.store", None)
    return importlib.import_module("ps_under_test.store")


def _plan(name: str) -> dict:
    return {"id": "p1", "name": name, "schemaVersion": 1, "levels": [{"id": "l1"}]}


def test_failed_save_rolls_back_and_failed_delete_restores():
    store = _load_store_module().PlanStore(None)

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
