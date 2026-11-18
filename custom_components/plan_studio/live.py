"""Runs the container runtime and the power hub inside Home Assistant: state lookup, state tracking and clock.

The transfer positions, the boiler modes, the running timed switches, the outside light pauses and the light motion
control modes are persisted."""

from __future__ import annotations

import asyncio
import logging
import math
import time
from collections.abc import Callable
from typing import TYPE_CHECKING

from homeassistant.core import CALLBACK_TYPE, Context, CoreState, HomeAssistant, callback
from homeassistant.helpers.event import async_call_later, async_track_state_change_event
try:  # HA 2024.4+; an older core tracks state changes only
    from homeassistant.helpers.event import async_track_state_report_event
except ImportError:  # pragma: no cover
    async_track_state_report_event = None
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    BOILER_STORAGE_KEY,
    MOTION_LIGHT_STORAGE_KEY,
    OUTSIDE_STORAGE_KEY,
    POWER_STORAGE_KEY,
    RUNTIME_STORAGE_KEY,
    TIMED_STORAGE_KEY,
)
from .power import PowerHub, device_bindings, entity_ids as power_entity_ids
from .readings import Readings
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
        self._untrack_reports: CALLBACK_TYPE | None = None
        self.readings = Readings()  # report statistics of every tracked entity (memory only)
        self._stopped = False
        self._loaded = False
        # entity id -> last_changed of the state it returned to from no data (unavailable, unknown, none)
        self._returned: dict[str, object] = {}
        self._power_store: Store = Store(hass, 1, POWER_STORAGE_KEY)
        self._boiler_store: Store = Store(hass, 1, BOILER_STORAGE_KEY)
        self._modes: dict | None = None  # stored boiler modes, handed to the first engine load only
        self._timed_store: Store = Store(hass, 1, TIMED_STORAGE_KEY)
        self._runs: dict | None = None  # stored timed runs, handed to the first engine load only
        self._outside_store: Store = Store(hass, 1, OUTSIDE_STORAGE_KEY)
        self._pauses: dict | None = None  # stored outside light pauses, handed to the first engine load only
        self._motion_store: Store = Store(hass, 1, MOTION_LIGHT_STORAGE_KEY)
        self._motion_modes: dict | None = None  # stored light motion control modes, handed to the first engine load only
        self._engine_start: CALLBACK_TYPE | None = None  # waits for HA to start after a boot load
        # rule actions fired before HA has started (a sensor known at boot), sent in order once it has
        self._deferred: list[tuple[str, str, str, Callable[..., None], Callable[[], bool]]] = []
        self._unstarted: CALLBACK_TYPE | None = None

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
        self.runtime.add_listener(self._on_container)
        stored = await self._boiler_store.async_load()
        self._modes = stored if isinstance(stored, dict) else {}
        runs = await self._timed_store.async_load()
        self._runs = runs if isinstance(runs, dict) else {}
        pauses = await self._outside_store.async_load()
        self._pauses = pauses if isinstance(pauses, dict) else {}
        motion_modes = await self._motion_store.async_load()
        self._motion_modes = motion_modes if isinstance(motion_modes, dict) else {}
        self.engine = RuleEngine(
            self._lookup, time.time, self._call, self._schedule,
            local=lambda ts: dt_util.as_local(dt_util.utc_from_timestamp(ts)),  # the real zone: DST-safe
            changed_at=self._changed_at,
            on_modes=self._save_modes,
            on_runs=self._save_runs,
            on_pauses=self._save_pauses,
            on_motion_modes=self._save_motion_modes,
            reports=lambda eid: (self.readings.last(eid), self.readings.period(eid)),
        )
        self.reload()

    @callback
    def reload(self) -> None:
        plans = self._plans.plans()
        self.runtime.load_plans(plans)
        # only the first load while HA is still starting is the HA start; an entry reload is not
        boot = not self._loaded and self._hass.state is not CoreState.running
        self._loaded = True
        modes, self._modes = self._modes, None
        runs, self._runs = self._runs, None
        pauses, self._pauses = self._pauses, None
        motion_modes, self._motion_modes = self._motion_modes, None
        self.engine.load_plans(plans, boot=boot, modes=modes, runs=runs, pauses=pauses, motion_modes=motion_modes)
        if boot and self._engine_start is None:  # a restored auto, timed run, pause or motion mode waits for HA to have started
            self._engine_start = async_at_started(self._hass, self._engine_started)
        self.retrack()

    @callback
    def _engine_started(self, _hass: HomeAssistant) -> None:
        self._engine_start = None
        if not self._stopped:
            self.engine.started()

    @callback
    def _on_container(self, plan_id: str, device_id: str, event: dict) -> None:
        """Container intents (not status changes) are the boiler, timed switch, light motion control and load control buttons' input."""
        if "action" in event and not self._stopped:
            try:
                self.engine.on_intent(plan_id, device_id, event)
            except Exception:  # noqa: BLE001 - the runtime drops a listener that raises: a bug must not kill the buttons
                _LOGGER.exception("rule intent failed")

    @callback
    def _save_modes(self, modes: dict) -> None:
        if self._stopped:  # stop reloads no plans: that report must not wipe the store
            return
        self._boiler_store.async_delay_save(lambda: modes, 1)

    @callback
    def _save_runs(self, runs: dict) -> None:
        if self._stopped:  # stop reloads no plans: that report must not wipe the store
            return
        self._timed_store.async_delay_save(lambda: runs, 1)

    @callback
    def _save_pauses(self, pauses: dict) -> None:
        if self._stopped:  # stop reloads no plans: that report must not wipe the store
            return
        self._outside_store.async_delay_save(lambda: pauses, 1)

    @callback
    def _save_motion_modes(self, modes: dict) -> None:
        if self._stopped:  # stop reloads no plans: that report must not wipe the store
            return
        self._motion_store.async_delay_save(lambda: modes, 1)

    @callback
    def retrack(self) -> None:
        """Track the entities the containers, the rules and the power subscriptions read; a stopped runtime tracks nothing."""
        self._untrack_all()
        if self._stopped:
            return
        ids = self.runtime.entity_ids() | self.power.entity_ids() | self.engine.entity_ids() | self._saved_power_entities()
        self.readings.keep(ids)
        self._untrack = async_track_state_change_event(self._hass, sorted(ids), self._on_state)
        if async_track_state_report_event is not None:  # a repeated report of the same value feeds the statistics only
            self._untrack_reports = async_track_state_report_event(self._hass, sorted(ids), self._on_report)

    def _saved_power_entities(self) -> set[str]:
        """The entities of the saved plans' power schematics: their statistics do not wait for an open panel."""
        out: set[str] = set()
        for plan in self._plans.plans():
            try:
                power = plan.get("power")
                if isinstance(power, dict):
                    out |= power_entity_ids(power, device_bindings(plan))
            except Exception:  # noqa: BLE001 - a malformed saved schematic must not stop the runtime
                _LOGGER.warning("could not read the power schematic of plan %s", plan.get("id"), exc_info=True)
        return out

    def _report(self, entity_id: str, new: State | None) -> None:
        at = None if new is None else (getattr(new, "last_reported", None) or getattr(new, "last_updated", None))
        self.readings.report(entity_id, None if new is None else new.state, at.timestamp() if at else time.time())

    @callback
    def _on_report(self, event: Event) -> None:
        self._report(event.data["entity_id"], event.data["new_state"])

    async def async_stop(self) -> None:
        # A power subscription that ends later (its connection closes) retracks; it must not track again.
        self._stopped = True
        self._untrack_all()
        self._deferred.clear()
        if self._engine_start is not None:
            self._engine_start()
            self._engine_start = None
        if self._unstarted is not None:
            self._unstarted()
            self._unstarted = None
        try:  # a pending mode save would be lost for an entry reload within its delay
            await self._boiler_store.async_save(self.engine.modes())
        except Exception:  # noqa: BLE001 - stopping must go on
            _LOGGER.warning("could not save the boiler modes", exc_info=True)
        try:  # likewise the running timed switches, restored on the next start
            await self._timed_store.async_save(self.engine.runs())
        except Exception:  # noqa: BLE001 - stopping must go on
            _LOGGER.warning("could not save the timed runs", exc_info=True)
        try:  # likewise the outside light pauses
            await self._outside_store.async_save(self.engine.pauses())
        except Exception:  # noqa: BLE001 - stopping must go on
            _LOGGER.warning("could not save the outside light pauses", exc_info=True)
        try:  # likewise the light motion control modes
            await self._motion_store.async_save(self.engine.motion_modes())
        except Exception:  # noqa: BLE001 - stopping must go on
            _LOGGER.warning("could not save the light motion control modes", exc_info=True)
        self.engine.load_plans([], unload=True)  # cancels every rule timer; switches no boiler relay or timed device

    @callback
    def _save_positions(self) -> None:
        self._power_store.async_delay_save(lambda: {"positions": self.power.positions()}, 1)

    def _untrack_all(self) -> None:
        if self._untrack is not None:
            self._untrack()
            self._untrack = None
        if self._untrack_reports is not None:
            self._untrack_reports()
            self._untrack_reports = None

    def _changed_at(self, entity_id: str) -> float | None:
        st = self._hass.states.get(entity_id)
        if st is None:
            return None
        if self._returned.get(entity_id) == st.last_changed:
            return -math.inf  # a return from no data counts as changed long ago
        return st.last_changed.timestamp()

    def _lookup(self, entity_id: str) -> tuple[str, dict] | None:
        return _pair(self._hass.states.get(entity_id))

    @callback
    def _on_state(self, event: Event[EventStateChangedData]) -> None:
        data = event.data
        old, new = data["old_state"], data["new_state"]
        self._report(data["entity_id"], new)
        if new is None:
            self._returned.pop(data["entity_id"], None)
        elif new.state not in ("unavailable", "unknown"):
            if old is None or old.state in ("unavailable", "unknown"):
                self._returned[data["entity_id"]] = new.last_changed
            else:
                self._returned.pop(data["entity_id"], None)
        context = (event.context.id, event.context.parent_id)
        # intents first (runtime listeners are synchronous): the engine must know them before the state change
        self.runtime.handle_state(data["entity_id"], _pair(data["old_state"]), _pair(data["new_state"]), context)
        self.power.handle_state(data["entity_id"])
        self.engine.handle_state(data["entity_id"], own=self.runtime.is_own(context))

    def _call(
        self,
        domain: str,
        service: str,
        entity_id: str,
        on_error: Callable[..., None],
        current: Callable[[], bool] = lambda: True,
    ) -> bool:
        """Send a rule action as a task; a missing service fails now, a failing call is reported later.

        Before HA has started (platforms may not have registered their services yet) the call waits for the start
        and True is returned (held: the engine leaves the target check to the send). It is then sent only while its
        firing is still the rule's latest one (current()); a missing service is reported through on_error, and so is
        a target that is unavailable at that moment (with the reason "target unavailable"; the call is still sent)."""
        if self._hass.state is not CoreState.running:
            self._deferred.append((domain, service, entity_id, on_error, current))
            if self._unstarted is None:
                self._unstarted = async_at_started(self._hass, self._started)
            return True
        if not self._hass.services.has_service(domain, service):
            raise RuntimeError(f"service {domain}.{service} not found")
        self._dispatch(domain, service, entity_id, on_error)
        return False

    @callback
    def _started(self, _hass: HomeAssistant) -> None:
        """Send the calls deferred during the start, in the order they were fired, each once."""
        self._unstarted = None
        deferred, self._deferred = self._deferred, []
        for domain, service, entity_id, on_error, current in deferred:
            if self._stopped or not current():
                continue  # the rule fired again, changed or went away: this call is stale
            if not self._hass.services.has_service(domain, service):
                _LOGGER.warning("rule action %s.%s %s failed: service not found", domain, service, entity_id)
                on_error(f"service {domain}.{service} not found")
                continue
            st = self._hass.states.get(entity_id)
            if st is None or st.state in ("unavailable", "unknown"):
                # still sent (HA may accept it); the rule re-sends it when the target becomes available
                on_error("target unavailable", "target unavailable")
            self._dispatch(domain, service, entity_id, on_error)

    def _dispatch(self, domain: str, service: str, entity_id: str, on_error: Callable[..., None]) -> None:
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
