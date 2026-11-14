"""Persistent plan storage."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION
from .repo import PlanRepo


class PlanStore:
    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._repo = PlanRepo(None)

    async def async_load(self) -> None:
        self._repo = PlanRepo(await self._store.async_load())

    def list(self) -> list[dict]:
        return self._repo.list()

    def get(self, plan_id: str) -> dict | None:
        return self._repo.get(plan_id)

    async def async_save(self, plan: dict, expected_revision: int | None, force: bool = False) -> int:
        snapshot = self._repo.snapshot()
        revision = self._repo.save(plan, expected_revision, force)
        await self._persist(snapshot)
        return revision

    async def async_delete(self, plan_id: str) -> bool:
        snapshot = self._repo.snapshot()
        deleted = self._repo.delete(plan_id)
        if deleted:
            await self._persist(snapshot)
        return deleted

    async def _persist(self, snapshot: dict) -> None:
        """Write the repo; if writing fails, roll the in-memory state back so it matches the disk."""
        try:
            await self._store.async_save(self._repo.to_dict())
        except Exception:
            self._repo.restore(snapshot)
            raise
