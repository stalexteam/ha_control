"""Virtual switches: on / off devices whose state the integration keeps itself, invisible to Home Assistant. Must not
import homeassistant.

A virtual switch (device kind virtual_switch) has the synthetic entity id virtual.<device id> as its only binding
(control). The live runtime answers that entity from here and turns a turn_on / turn_off to it into a state change of
its own, so the rules use it as any on / off device. State per plan {plan id: {device id: "on" | "off"}}, default off."""

from __future__ import annotations

import logging
from typing import Callable

_LOGGER = logging.getLogger(__name__)

KIND = "virtual_switch"
PREFIX = "virtual."
STATES = ("on", "off")
DEFAULT = "off"

Callback = Callable[[dict], None]  # a frame {"states": {device id: "on" | "off"}}: every virtual switch of the plan


def entity_id(device_id: str) -> str:
    """The synthetic entity id of a virtual switch device."""
    return PREFIX + device_id


def device_id(entity_id: str) -> str | None:
    """The device id of a synthetic entity id; None for any other entity."""
    if isinstance(entity_id, str) and entity_id.startswith(PREFIX) and len(entity_id) > len(PREFIX):
        return entity_id[len(PREFIX):]
    return None


def devices(plan: dict) -> list[str]:
    """Ids of the plan's virtual switch devices, in plan order."""
    out: list[str] = []
    levels = plan.get("levels") if isinstance(plan, dict) else None
    for level in levels if isinstance(levels, list) else []:
        devs = level.get("devices") if isinstance(level, dict) else None
        for d in devs if isinstance(devs, list) else []:
            props = d.get("props") if isinstance(d, dict) else None
            did = d.get("id") if isinstance(d, dict) else None
            if isinstance(props, dict) and props.get("kind") == KIND and isinstance(did, str) and did and did not in out:
                out.append(did)
    return out


class Virtual:
    def __init__(self) -> None:
        self._states: dict[str, dict[str, str]] = {}  # plan id -> device id -> state
        self._subs: dict[str, list[Callback]] = {}

    def state(self, entity_id: str) -> str | None:
        """The state of a synthetic entity; None for a device no plan has (a missing entity)."""
        did = device_id(entity_id)
        if did is None:
            return None
        return next((states[did] for states in self._states.values() if did in states), None)

    def set(self, entity_id: str, state: str) -> bool:
        """Set the state; True when it changed (the plan's subscribers get a frame). A device no plan has or a state
        other than on / off changes nothing."""
        did = device_id(entity_id)
        if did is None or state not in STATES:
            return False
        changed = [pid for pid, states in self._states.items() if did in states and states[did] != state]
        for pid in changed:
            self._states[pid][did] = state
        for pid in changed:
            self._notify(pid)
        return bool(changed)

    def states(self, plan_id: str) -> dict[str, str]:
        """The states of the plan's virtual switches."""
        return dict(self._states.get(plan_id, {}))

    def load(self, data: object) -> None:
        """The stored states {plan id: {device id: state}}; anything malformed is ignored."""
        self._states = {}
        for pid, states in (data.items() if isinstance(data, dict) else ()):
            if not isinstance(pid, str) or not isinstance(states, dict):
                continue
            kept = {did: s for did, s in states.items() if isinstance(did, str) and did and s in STATES}
            if kept:
                self._states[pid] = kept

    def dump(self) -> dict[str, dict[str, str]]:
        """A copy of the states, for the store."""
        return {pid: dict(states) for pid, states in self._states.items() if states}

    def keep(self, plan_id: str, device_ids: "list[str]") -> None:
        """The plan's virtual switches now: a new one starts off, a removed one drops its state (an empty list drops
        the plan). The plan's subscribers get a frame when its map changed."""
        old = self._states.get(plan_id, {})
        new = {did: old.get(did, DEFAULT) for did in device_ids}
        if new:
            self._states[plan_id] = new
        else:
            self._states.pop(plan_id, None)
        if new != old:
            self._notify(plan_id)

    def subscribe(self, plan_id: str, cb: Callback) -> Callable[[], None]:
        self._subs.setdefault(plan_id, []).append(cb)

        def unsubscribe() -> None:
            self._drop(plan_id, cb)

        return unsubscribe

    def _drop(self, plan_id: str, cb: Callback) -> None:
        subs = self._subs.get(plan_id)
        if subs and cb in subs:
            subs.remove(cb)
            if not subs:
                del self._subs[plan_id]

    def _notify(self, plan_id: str) -> None:
        for cb in list(self._subs.get(plan_id, ())):
            try:
                cb({"states": self.states(plan_id)})
            except Exception:  # noqa: BLE001 - one bad subscriber must not stop the others
                _LOGGER.exception("virtual switch subscriber failed; dropping it")
                self._drop(plan_id, cb)
