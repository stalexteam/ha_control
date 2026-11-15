"""Runs the container runtime inside Home Assistant: state lookup, state tracking and clock. Nothing is persisted."""

from __future__ import annotations

import logging
import time
from typing import TYPE_CHECKING

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import RUNTIME_STORAGE_KEY
from .runtime import Runtime
from .store import PlanStore

if TYPE_CHECKING:
    from homeassistant.core import Event, EventStateChangedData, State

_LOGGER = logging.getLogger(__name__)


def _pair(st: State | None) -> tuple[str, dict] | None:
    return None if st is None else (st.state, dict(st.attributes))


def _clock() -> str:
    """ISO 8601 UTC time of an intent."""
    return dt_util.utcnow().isoformat()


class LiveRuntime:
    runtime: Runtime  # set by async_start

    def __init__(self, hass: HomeAssistant, plans: PlanStore) -> None:
        self._hass = hass
        self._plans = plans
        self._untrack: CALLBACK_TYPE | None = None

    async def async_start(self) -> None:
        # The v0.4 runtime store held persisted outputs; it is no longer used.
        try:
            await Store(self._hass, 1, RUNTIME_STORAGE_KEY).async_remove()
        except Exception:  # noqa: BLE001 - a missing file is fine; a failed cleanup must not stop the runtime
            _LOGGER.warning("could not remove the old %s store", RUNTIME_STORAGE_KEY, exc_info=True)
        self.runtime = Runtime(self._lookup, time.monotonic, _clock)
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

    def _untrack_all(self) -> None:
        if self._untrack is not None:
            self._untrack()
            self._untrack = None

    def _lookup(self, entity_id: str) -> tuple[str, dict] | None:
        return _pair(self._hass.states.get(entity_id))

    @callback
    def _on_state(self, event: Event[EventStateChangedData]) -> None:
        data = event.data
        self.runtime.handle_state(
            data["entity_id"],
            _pair(data["old_state"]),
            _pair(data["new_state"]),
            (event.context.id, event.context.parent_id),
        )
