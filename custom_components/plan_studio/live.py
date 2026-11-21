"""Runs the container runtime and the power hub inside Home Assistant: state lookup, state tracking and clock.

The transfer positions, the boiler modes, the running timed switches, the outside light pauses, the light motion
control modes and the virtual switch states are persisted. A virtual switch (virtual.py) is answered and switched here:
never a Home Assistant entity, call or tracked state."""

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
    VIRTUAL_STORAGE_KEY,
)
from .expected import EXPIRE, Expected, expect, passing, service as service_for
from .power import PowerHub, device_bindings, entity_ids as power_entity_ids
from .readings import Readings
from .repo import LIGHT_KINDS, brightness_ok
from .rules import RuleEngine
from .runtime import Runtime
from .store import PlanStore
from .virtual import LOOP_REFUSE, Breaker, Virtual, device_id as virtual_device, devices as virtual_devices

if TYPE_CHECKING:
    from homeassistant.core import Event, EventStateChangedData, State

_LOGGER = logging.getLogger(__name__)
CALL_TIMEOUT = 30  # seconds


def _pair(st: State | None) -> tuple[str, dict] | None:
    return None if st is None else (st.state, dict(st.attributes))


def _clock() -> str:
    """ISO 8601 UTC time of an intent."""
    return dt_util.utcnow().isoformat()


def _brightness(plans: list[dict]) -> dict[str, int]:
    """light entity -> brightness_pct of every light.turn_on Plan Studio sends it: the brightness of the ceiling and
    wall light devices bound to a light entity; for an entity shared by several devices the first device with one (in
    plan, level and device order) gives it."""
    out: dict[str, int] = {}
    for plan in plans:
        levels = plan.get("levels") if isinstance(plan, dict) else None
        for level in levels if isinstance(levels, list) else []:
            devices = level.get("devices") if isinstance(level, dict) else None
            for d in devices if isinstance(devices, list) else []:
                props = d.get("props") if isinstance(d, dict) else None
                bindings = d.get("bindings") if isinstance(d, dict) else None
                if not isinstance(props, dict) or not isinstance(bindings, dict):
                    continue
                if props.get("kind") not in LIGHT_KINDS:
                    continue
                eid, value = bindings.get("control"), props.get("brightness")
                if isinstance(eid, str) and eid.startswith("light.") and brightness_ok(value):
                    out.setdefault(eid, value)
    return out


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
        self.virtual = Virtual()  # the virtual switch states, answered for virtual.<device id>
        self._breaker = Breaker()  # refuses the changes of a virtual switch in a rule loop
        self._virtual_store: Store = Store(hass, 1, VIRTUAL_STORAGE_KEY)
        self._engine_start: CALLBACK_TYPE | None = None  # waits for HA to start after a boot load
        # rule actions fired before HA has started (a sensor known at boot), sent in order once it has
        self._deferred: list[tuple[str, str, str, Callable[..., None], Callable[[], bool], object]] = []
        self._unstarted: CALLBACK_TYPE | None = None
        # the state every command should bring: a late confirmation is still ours, a lost command is sent again once
        self._expected = Expected()
        self._expected_timer: tuple[float, CALLBACK_TYPE] | None = None  # (when, cancel) of its next wake
        self._now: Callable[[], float] = time.monotonic  # the clock of the expected states
        # entity -> (state, by) of the command whose expiry was warned: its identical repeats expire at debug level
        # until the entity reaches a state or another command replaces it (one warning per episode)
        self._warned: dict[str, tuple[str, object]] = {}
        # entity -> whether its latest filtered bounce carried an own context (the change _unhide delivers late)
        self._bounce_own: dict[str, bool] = {}
        self._brightness: dict[str, int] = {}  # light entity -> brightness_pct of its turn_on, from the saved plans

    async def async_start(self) -> None:
        # The v0.4 runtime store held persisted outputs; it is no longer used.
        try:
            await Store(self._hass, 1, RUNTIME_STORAGE_KEY).async_remove()
        except Exception:  # noqa: BLE001 - a missing file is fine; a failed cleanup must not stop the runtime
            _LOGGER.warning("could not remove the old %s store", RUNTIME_STORAGE_KEY, exc_info=True)
        data = await self._power_store.async_load()
        positions = data.get("positions") if isinstance(data, dict) else None
        self.power = PowerHub(self._lookup, positions if isinstance(positions, dict) else None, self._save_positions)
        self.runtime = Runtime(self._view, time.monotonic, _clock)
        self.runtime.add_listener(self._on_container)
        stored = await self._boiler_store.async_load()
        self._modes = stored if isinstance(stored, dict) else {}
        runs = await self._timed_store.async_load()
        self._runs = runs if isinstance(runs, dict) else {}
        pauses = await self._outside_store.async_load()
        self._pauses = pauses if isinstance(pauses, dict) else {}
        motion_modes = await self._motion_store.async_load()
        self._motion_modes = motion_modes if isinstance(motion_modes, dict) else {}
        self.virtual.load(await self._virtual_store.async_load())  # before the first load reads them
        self.engine = RuleEngine(
            self._view, time.time, self._call, self._schedule,
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
        self._brightness = _brightness(plans)  # before a load sends anything
        self._keep_virtual(plans)  # before the loads read them
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
    def _save_virtual(self) -> None:
        self._virtual_store.async_delay_save(self.virtual.dump, 1)  # the states at the time of the write

    def _keep_virtual(self, plans: list[dict]) -> None:
        """The saved plans' virtual switches: a new one starts off; one removed from its plan, or of a deleted plan,
        drops its state."""
        before = self.virtual.dump()
        saved: set[str] = set()
        for plan in plans:
            pid = plan.get("id") if isinstance(plan, dict) else None
            if isinstance(pid, str):
                saved.add(pid)
                self.virtual.keep(pid, virtual_devices(plan))
        for pid in set(before) - saved:
            self.virtual.keep(pid, [])
        if self.virtual.dump() != before:
            self._save_virtual()

    @callback
    def retrack(self) -> None:
        """Track the entities the containers, the rules and the power subscriptions read; a stopped runtime tracks nothing.
        The virtual switches are the integration's own (no Home Assistant state events)."""
        self._untrack_all()
        if self._stopped:
            return
        ids = self.runtime.entity_ids() | self.power.entity_ids() | self.engine.entity_ids() | self._saved_power_entities()
        self.readings.keep(ids)
        tracked = sorted(e for e in ids if virtual_device(e) is None)
        self._untrack = async_track_state_change_event(self._hass, tracked, self._on_state)
        if async_track_state_report_event is not None:  # a repeated report of the same value feeds the statistics only
            self._untrack_reports = async_track_state_report_event(self._hass, tracked, self._on_report)

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
        """Feed the statistics; a failure here never blocks the containers, the power feed or the rules."""
        try:
            at = None if new is None else (getattr(new, "last_reported", None) or getattr(new, "last_updated", None))
            self.readings.report(entity_id, None if new is None else new.state, at.timestamp() if at else time.time())
        except Exception:  # noqa: BLE001 - the statistics must never disturb the automations
            _LOGGER.debug("could not record a report of %s", entity_id, exc_info=True)

    @callback
    def _on_report(self, event: Event) -> None:
        self._report(event.data["entity_id"], event.data["new_state"])

    async def async_stop(self) -> None:
        # A power subscription that ends later (its connection closes) retracks; it must not track again.
        self._stopped = True
        self._untrack_all()
        self._deferred.clear()
        self._disarm()
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
        try:  # likewise the virtual switch states
            await self._virtual_store.async_save(self.virtual.dump())
        except Exception:  # noqa: BLE001 - stopping must go on
            _LOGGER.warning("could not save the virtual switch states", exc_info=True)
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
        if virtual_device(entity_id) is not None:  # the integration's own switch; None once it left the saved plans
            state = self.virtual.state(entity_id)
            return None if state is None else (state, {})
        return _pair(self._hass.states.get(entity_id))

    def _view(self, entity_id: str) -> tuple[str, dict] | None:
        """The state the containers runtime and the rules read: the commanded one while the entity's latest change is
        a bounce whose re-send has not arrived, until the re-send's retry point at most (that change is none of theirs
        unless the re-send fails: _unhide); the power hub reads the device as it is."""
        shown = self._expected.hidden(entity_id)
        st = self._lookup(entity_id)
        return st if shown is None or st is None else (shown, st[1])

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
        self._deliver(data["entity_id"], _pair(old), _pair(new), (event.context.id, event.context.parent_id))

    def _deliver(
        self, entity_id: str, old: tuple[str, dict] | None, new: tuple[str, dict] | None,
        context: tuple[str | None, str | None],
    ) -> None:
        """One state change (a Home Assistant one, or a virtual switch's) to the containers runtime, the power hub and
        the rules; context is (context.id, context.parent_id) of the change."""
        # Plan Studio's own change: its context, or the first change to the state one of its commands expects (however
        # late; asked once per change of the state value, an attribute update is no change; a return from no data is
        # a fresh reading). Both consumers get it.
        own = self.runtime.is_own(context)
        was, now = (None if old is None else old[0]), (None if new is None else new[0])
        bounced = None
        if was != now:
            at = self._now()
            # the device left a command's state right after confirming it: the first time in a command episode it is
            # commanded once more and the change goes to the power hub only (the rules and the containers keep
            # reading the commanded state, _view); a repeat goes everywhere and the sender shows "device switched back"
            bounced = self._expected.bounce(entity_id, now, at)
            if bounced is not None and not bounced[2] and self._bounce_resend(entity_id, bounced[0], bounced[1], own):
                self.power.handle_state(entity_id)
                return
            own = self._expected.arrived(entity_id, now, at, back=passing(was), keep=True) or own
            self._arm()
            if not passing(now):
                self._warned.pop(entity_id, None)  # it reached a state: a new episode
        elif self._expected.hidden(entity_id) is not None:
            # an attribute update of a hidden bounce: none of theirs either (the engine would read the hidden state
            # as the command arriving)
            self.power.handle_state(entity_id)
            return
        # intents first (runtime listeners are synchronous): the engine must know them before the state change
        self.runtime.handle_state(entity_id, old, new, context, own=own)
        self.power.handle_state(entity_id)
        self.engine.handle_state(entity_id, own=own)
        if bounced is not None and bounced[2]:
            self._switched_back(entity_id, bounced[0], bounced[1])

    def _call(
        self,
        domain: str,
        service: str,
        entity_id: str | None,
        on_error: Callable[..., None],
        current: Callable[[], bool] = lambda: True,
        by: object = None,
        data: dict | None = None,
    ) -> bool:
        """Send a rule action as a task; a missing service fails now, a failing call is reported later.

        Before HA has started (platforms may not have registered their services yet) the call waits for the start
        and True is returned (held: the engine leaves the target check to the send). It is then sent only while its
        firing is still the rule's latest one (current()); a missing service is reported through on_error, and so is
        a target that is unavailable at that moment (with the reason "target unavailable"; the call is still sent).
        by: the rule the command belongs to, told when the device never confirms it (engine.command_unconfirmed).
        A virtual switch is never called nor held: turn_on / turn_off / toggle set it on the next loop turn (_send).
        data: the service data of an announcement (merged after the entity id; entity_id None for a notify): never
        held, it fails at once before HA has started (an announcement is never sent late)."""
        if virtual_device(entity_id) is not None:
            if service not in ("turn_on", "turn_off", "toggle"):
                raise RuntimeError(f"service {domain}.{service} not found")
            self._dispatch(domain, service, entity_id, on_error, by)
            return False
        if self._hass.state is not CoreState.running:
            if data is not None:
                raise RuntimeError(f"{domain}.{service}: Home Assistant is not running")
            self._deferred.append((domain, service, entity_id, on_error, current, by))
            if self._unstarted is None:
                self._unstarted = async_at_started(self._hass, self._started)
            return True
        if not self._hass.services.has_service(domain, service):
            raise RuntimeError(f"service {domain}.{service} not found")
        self._dispatch(domain, service, entity_id, on_error, by, data=data)
        return False

    @callback
    def _started(self, _hass: HomeAssistant) -> None:
        """Send the calls deferred during the start, in the order they were fired, each once."""
        self._unstarted = None
        deferred, self._deferred = self._deferred, []
        for domain, service, entity_id, on_error, current, by in deferred:
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
            self._dispatch(domain, service, entity_id, on_error, by)

    def _dispatch(
        self, domain: str, service: str, entity_id: str | None, on_error: Callable[..., None], by: object = None,
        retry: bool = False, data: dict | None = None, bounce: bool = False,
    ) -> None:
        """Send one call with its own context. The state it should bring is recorded as the entity's latest command of
        the rule `by`; a retry keeps the first send's record, the re-send of a bounce gets a fresh one (bounce). An
        announcement (tts.speak, media_player.play_media, notify.*) brings no state (expect: None): nothing is
        recorded, so nothing retries it."""
        ctx = Context()
        self.runtime.ignore_context(ctx.id)  # its state change is not a press for a wall switch
        state = expect(domain, service)
        if state is not None and not retry:
            self._expected.sent(entity_id, state, self._now(), by, bounce=bounce)
            if self._warned.get(entity_id) != (state, by):
                self._warned.pop(entity_id, None)  # another command: a new episode
        # A background task that starts on the next loop turn: the call cannot re-enter the engine from inside a firing.
        task = self._hass.async_create_background_task(
            self._send(domain, service, entity_id, ctx, by, data), f"plan_studio rule {domain}.{service}",
            eager_start=False,
        )

        def done(t: asyncio.Future) -> None:
            if not t.cancelled() and t.exception() is not None:
                err = t.exception()
                _LOGGER.warning("rule action %s.%s %s failed: %s", domain, service, entity_id, err)
                on_error(str(err) or type(err).__name__)

        task.add_done_callback(done)

    async def _send(
        self, domain: str, service: str, entity_id: str | None, ctx: Context, by: object = None,
        data: dict | None = None,
    ) -> None:
        if virtual_device(entity_id) is not None:  # the integration's own switch: no Home Assistant call
            self._virtual_set(entity_id, service, ctx, by)
            return
        self._arm()  # the wake for the retry / expiry of the expected state, once the call goes out
        service_data = {} if entity_id is None else {"entity_id": entity_id}
        if domain == "light" and service == "turn_on" and entity_id in self._brightness:
            # every switch-on of a light device with a brightness (any rule, a retry, a bounce's re-send, a held call)
            service_data["brightness_pct"] = self._brightness[entity_id]
        service_data.update(data or {})
        await asyncio.wait_for(  # a hung blocking call ends as a recorded failure
            self._hass.services.async_call(domain, service, service_data, blocking=True, context=ctx),
            CALL_TIMEOUT,
        )

    def _virtual_set(self, entity_id: str, service: str, ctx: Context, by: object = None) -> None:
        """A command to a virtual switch: the state is set now and its change goes the way of a Home Assistant state
        change with the command's (Plan Studio's) context, so its expected state is confirmed at once. Already in that
        state, or the device left the saved plans since the send: nothing changes and the expected state is used up
        (no retry, no "not confirmed"). A change the loop breaker refuses (virtual.Breaker) changes nothing either: its
        expected state is used up and the rule `by` that sent it shows "virtual switch loop"; the first refusal of an
        episode is logged. A failure past the set is logged; the command itself succeeded."""
        if self._stopped:
            return
        was = self.virtual.state(entity_id)
        state = ("off" if was == "on" else "on") if service == "toggle" else service[len("turn_"):]
        allowed = "ok" if was is None or was == state else self._breaker.change(entity_id, self._now())
        if allowed == "trip":
            _LOGGER.error("virtual switch %s changes too fast: a rule loop; changes refused for %d s", entity_id,
                          LOOP_REFUSE)
        if allowed != "ok" or was is None or not self.virtual.set(entity_id, state):
            self._expected.arrived(entity_id, state, self._now())
            self._arm()
            if allowed != "ok":
                try:
                    self.engine.command_refused(entity_id, by)
                except Exception:  # noqa: BLE001 - a failing report must not stop the runtime
                    _LOGGER.exception("reporting a refused virtual switch command failed")
            return
        self._save_virtual()
        try:
            self.readings.report(entity_id, state, time.time())
        except Exception:  # noqa: BLE001 - the statistics must never disturb the automations
            _LOGGER.debug("could not record a report of %s", entity_id, exc_info=True)
        try:
            self._deliver(entity_id, (was, {}), (state, {}), (ctx.id, ctx.parent_id))
        except Exception:  # noqa: BLE001 - the state is set: a failing consumer is a bug to log, not a failed command
            _LOGGER.exception("virtual switch %s: delivering its change to %s failed", entity_id, state)

    # --- expected states ("our optimistic") ------------------------------------

    def _arm(self) -> None:
        """Keep one timer at the next retry / expiry of the expected states (none without records or once stopped)."""
        at = None if self._stopped else self._expected.next_at()
        if self._expected_timer is not None and self._expected_timer[0] == at:
            return
        self._disarm()
        if at is not None:
            self._expected_timer = (at, self._schedule(max(0.0, at - self._now()), self._expected_due))

    def _disarm(self) -> None:
        if self._expected_timer is not None:
            self._expected_timer[1]()
            self._expected_timer = None

    def _expected_due(self) -> None:
        """A command without its confirmation: sent once more after RETRY s with Plan Studio's context when the engine
        says its sender still wants it now (engine.still_wants; never while the entity has no data: the engine's
        "waiting for target" re-send covers its return; on False the record stays, so a late confirmation is still
        ours); given up after EXPIRE s with a warning and "not confirmed" on the entry of the rule that sent it. An
        entity already reading the expected state (its change was not seen, or the command found it there) is
        confirmed silently. The re-send of a bounce hides it until its retry point at most: then the retry is asked
        from the device as it reads, and the change the rules and the containers did not see is delivered (_unhide)."""
        self._expected_timer = None
        if self._stopped:
            return
        now = self._now()
        for entity_id, state, by, what in self._expected.due(now):
            st = self._lookup(entity_id)  # a virtual switch reads from the runtime
            domain = entity_id.split(".", 1)[0]
            if st is not None and st[0] == state:
                if what == "retry":
                    self._expected.arrived(entity_id, state, now)  # uses the record up
                continue
            if what == "retry":
                hidden = self._expected.reveal(entity_id)
                self._retry(entity_id, domain, state, by, st)
                if hidden is not None:
                    self._unhide(entity_id, hidden)
                continue
            if self._warned.get(entity_id) == (state, by):  # the same episode: warned at its first expiry
                _LOGGER.debug("%s did not confirm %s within %s s again", entity_id, service_for(domain, state), EXPIRE)
            else:
                _LOGGER.warning("%s did not confirm %s within %s s", entity_id, service_for(domain, state), EXPIRE)
                self._warned[entity_id] = (state, by)
            try:
                self.engine.command_unconfirmed(entity_id, by)
            except Exception:  # noqa: BLE001 - a failing report must not stop the other records
                _LOGGER.exception("reporting an unconfirmed command failed")
        self._arm()

    def _retry(self, entity_id: str, domain: str, state: str, by: object, st: tuple[str, dict] | None) -> None:
        """The command once more when its sender still wants it (never while the entity has no data)."""
        svc = service_for(domain, state)
        if svc is None or st is None or st[0] in ("unavailable", "unknown"):
            return
        try:
            wanted = self.engine.still_wants(by, entity_id, state)
        except Exception:  # noqa: BLE001 - a failing answer must not stop the other records
            _LOGGER.exception("asking whether %s still wants %s failed", by, entity_id)
            return
        if wanted:
            self._dispatch(domain, svc, entity_id, lambda *_: None, retry=True)  # a failure is logged

    def _unhide(self, entity_id: str, hidden: str) -> None:
        """The re-send of a bounce got no confirmation by its retry point: the containers runtime and the rules read the
        device as it is from now and are told of the change they did not see (from the hidden state, Plan Studio's
        own when the bounce carried an own context, as it would have been at the bounce)."""
        own = self._bounce_own.pop(entity_id, False)
        try:
            self.runtime.handle_state(entity_id, (hidden, {}), self._lookup(entity_id), (None, None), own=own)
            self.engine.handle_state(entity_id, own=own)
        except Exception:  # noqa: BLE001 - a failing consumer must not stop the other records
            _LOGGER.exception("delivering the state of %s after a bounce failed", entity_id)

    def _bounce_resend(self, entity_id: str, state: str, by: object, own: bool) -> bool:
        """A bounce (expected.bounce): the command is sent once more at once with Plan Studio's context when its sender
        still wants it (engine.command_bounced, as the retry); True when it was sent. own: whether the bounce carried
        an own context (kept for _unhide)."""
        domain = entity_id.split(".", 1)[0]
        svc = service_for(domain, state)
        if svc is None:
            return False
        try:
            wanted = self.engine.command_bounced(entity_id, by, state)
        except Exception:  # noqa: BLE001 - a failing answer: the change goes to the rules as it is
            _LOGGER.exception("asking whether %s still wants %s failed", by, entity_id)
            return False
        if not wanted:
            return False
        _LOGGER.debug("%s left %s right after confirming it: %s sent once more", entity_id, state, svc)
        self._bounce_own[entity_id] = own
        self._dispatch(domain, svc, entity_id, lambda *_: None, by, bounce=True)  # a failure is logged
        return True

    def _switched_back(self, entity_id: str, state: str, by: object) -> None:
        """The second bounce of a command episode (delivered as a change): a warning, and "device switched back" on the
        entry of the rule that sent the command."""
        _LOGGER.warning("%s switched back from %s right after confirming it, also after %s was sent once more",
                        entity_id, state, service_for(entity_id.split(".", 1)[0], state))
        try:
            self.engine.command_switched_back(entity_id, by, state)
        except Exception:  # noqa: BLE001 - a failing report must not stop the runtime
            _LOGGER.exception("reporting a device that switched back failed")

    def _schedule(self, delay: float, cb: Callable[[], None]) -> CALLBACK_TYPE:
        @callback
        def fire(_now) -> None:  # must be a @callback: otherwise HA runs it in an executor thread
            cb()

        return async_call_later(self._hass, delay, fire)
