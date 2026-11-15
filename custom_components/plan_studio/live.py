"""Runs the container runtime and the power hub inside Home Assistant: state lookup, state tracking and clock.

Only the transfer positions are persisted."""

from __future__ import annotations

import logging
import time
from typing import TYPE_CHECKING

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import POWER_STORAGE_KEY, RUNTIME_STORAGE_KEY
from .power import PowerHub
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
    power: PowerHub  # set by async_start

    def __init__(self, hass: HomeAssistant, plans: PlanStore) -> None:
        self._hass = hass
        self._plans = plans
        self._untrack: CALLBACK_TYPE | None = None
        self._stopped = False
        self._power_store: Store = Store(hass, 1, POWER_STORAGE_KEY)

    async def async_start(self) -> None:
        # The v0.4 runtime store held persisted outputs; it is no longer used.
        try:
            await Store(self._hass, 1, RUNTIME_STORAGE_KEY).async_remove()
        except Exception:  # noqa: BLE001 - a missing file is fine; a failed cleanup must not stop the runtime
            _LOGGER.warning("could not remove the old %s store", RUNTIME_STORAGE_KEY, exc_info=True)
        data = await self._power_store.async_load()
        positions = data.get("positions") if isinstance(data, dict) else None
        self.power = PowerHub(self._lookup, positions if isinstance(positions, dict) else None, self._save_positions)
        self.runtime = Runtime(self._lookup, time.monotonic, _clock)
        self.reload()

    @callback
    def reload(self) -> None:
        self.runtime.load_plans(self._plans.plans())
        self.retrack()

    @callback
    def retrack(self) -> None:
        """Track the entities the containers and the power subscriptions read; a stopped runtime tracks nothing."""
        self._untrack_all()
        if self._stopped:
            return
        self._untrack = async_track_state_change_event(
            self._hass, sorted(self.runtime.entity_ids() | self.power.entity_ids()), self._on_state
        )

    async def async_stop(self) -> None:
        # A power subscription that ends later (its connection closes) retracks; it must not track again.
        self._stopped = True
        self._untrack_all()

    @callback
    def _save_positions(self) -> None:
        self._power_store.async_delay_save(lambda: {"positions": self.power.positions()}, 1)

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
        self.power.handle_state(data["entity_id"])
