"""Runs the container runtime inside Home Assistant: state lookup, state tracking, clock and storage."""

from __future__ import annotations

import time
from typing import TYPE_CHECKING

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.helpers.storage import Store

from .const import RUNTIME_STORAGE_KEY
from .runtime import Runtime
from .store import PlanStore

if TYPE_CHECKING:
    from homeassistant.core import Event, EventStateChangedData, State

RUNTIME_STORAGE_VERSION = 1
PERSIST_DELAY = 2  # seconds


def _pair(st: State | None) -> tuple[str, dict] | None:
    return None if st is None else (st.state, dict(st.attributes))


class LiveRuntime:
    runtime: Runtime  # set by async_start

    def __init__(self, hass: HomeAssistant, plans: PlanStore) -> None:
        self._hass = hass
        self._plans = plans
        self._store: Store = Store(hass, RUNTIME_STORAGE_VERSION, RUNTIME_STORAGE_KEY)
        self._untrack: CALLBACK_TYPE | None = None

    async def async_start(self) -> None:
        stored = await self._store.async_load()
        self.runtime = Runtime(self._lookup, time.monotonic, stored, self._persist)
        self.reload()

    @callback
    def reload(self) -> None:
        self.runtime.load_plans(self._plans.plans())
        self._untrack_all()
        self._untrack = async_track_state_change_event(
            self._hass, sorted(self.runtime.entity_ids()), self._on_state
        )

    async def async_stop(self) -> None:
        self._untrack_all()
        # Supersedes any pending delayed save, so nothing is lost on unload.
        await self._store.async_save(self.runtime.persisted())

    def _untrack_all(self) -> None:
        if self._untrack is not None:
            self._untrack()
            self._untrack = None

    def _lookup(self, entity_id: str) -> tuple[str, dict] | None:
        return _pair(self._hass.states.get(entity_id))

    @callback
    def _persist(self) -> None:
        self._store.async_delay_save(self.runtime.persisted, PERSIST_DELAY)

    @callback
    def _on_state(self, event: Event[EventStateChangedData]) -> None:
        data = event.data
        self.runtime.handle_state(
            data["entity_id"], _pair(data["old_state"]), _pair(data["new_state"])
        )
