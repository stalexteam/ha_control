"""Runs the container runtime and the power hub inside Home Assistant: state lookup, state tracking and clock.

Only the transfer positions are persisted."""

from __future__ import annotations

import asyncio
import logging
import time
from collections.abc import Callable
from typing import TYPE_CHECKING

from homeassistant.core import CALLBACK_TYPE, Context, HomeAssistant, callback
from homeassistant.helpers.event import async_call_later, async_track_state_change_event
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import POWER_STORAGE_KEY, RUNTIME_STORAGE_KEY
from .power import PowerHub
from .rules import RuleEngine
from .runtime import Runtime
from .store import PlanStore

if TYPE_CHECKING:
    from homeassistant.core import Event, EventStateChangedData, State

_LOGGER = logging.getLogger(__name__)
CALL_TIMEOUT = 30  # seconds


def _pair(st: State | None) -> tuple[str, dict] | None:
    return None if st is None else (st.state, dict(st.attributes))


def _clock() -> str:
    """ISO 8601 UTC time of an intent."""
    return dt_util.utcnow().isoformat()


class LiveRuntime:
    runtime: Runtime  # set by async_start
    power: PowerHub  # set by async_start
    engine: RuleEngine  # set by async_start

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
        self.engine = RuleEngine(self._lookup, time.time, self._call, self._schedule)
        self.reload()

    @callback
    def reload(self) -> None:
        plans = self._plans.plans()
        self.runtime.load_plans(plans)
        self.engine.load_plans(plans)
        self.retrack()

    @callback
    def retrack(self) -> None:
        """Track the entities the containers, the rules and the power subscriptions read; a stopped runtime tracks nothing."""
        self._untrack_all()
        if self._stopped:
            return
        self._untrack = async_track_state_change_event(
            self._hass, sorted(self.runtime.entity_ids() | self.power.entity_ids() | self.engine.entity_ids()), self._on_state
        )

    async def async_stop(self) -> None:
        # A power subscription that ends later (its connection closes) retracks; it must not track again.
        self._stopped = True
        self._untrack_all()
        self.engine.load_plans([])  # cancels every rule timer

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
        self.engine.handle_state(data["entity_id"])

    def _call(self, domain: str, service: str, entity_id: str, on_error: Callable[[str], None]) -> None:
        """Send a rule action as a task; a missing service fails now, a failing call is reported later."""
        if not self._hass.services.has_service(domain, service):
            raise RuntimeError(f"service {domain}.{service} not found")
        ctx = Context()
        self.runtime.ignore_context(ctx.id)  # its state change is not a press for a wall switch
        # A background task that starts on the next loop turn: the call cannot re-enter the engine from inside a firing.
        task = self._hass.async_create_background_task(
            self._send(domain, service, entity_id, ctx), f"plan_studio rule {domain}.{service}", eager_start=False
        )

        def done(t: asyncio.Future) -> None:
            if not t.cancelled() and t.exception() is not None:
                err = t.exception()
                _LOGGER.warning("rule action %s.%s %s failed: %s", domain, service, entity_id, err)
                on_error(str(err) or type(err).__name__)

        task.add_done_callback(done)

    async def _send(self, domain: str, service: str, entity_id: str, ctx: Context) -> None:
        await asyncio.wait_for(  # a hung blocking call ends as a recorded failure
            self._hass.services.async_call(domain, service, {"entity_id": entity_id}, blocking=True, context=ctx),
            CALL_TIMEOUT,
        )

    def _schedule(self, delay: float, cb: Callable[[], None]) -> CALLBACK_TYPE:
        @callback
        def fire(_now) -> None:  # must be a @callback: otherwise HA runs it in an executor thread
            cb()

        return async_call_later(self._hass, delay, fire)
