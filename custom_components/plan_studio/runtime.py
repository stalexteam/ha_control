"""Registry of input containers over all saved plans: status and last intent, in memory only. Must not import homeassistant."""

from __future__ import annotations

import logging
from typing import Callable

try:
    from .containers import Container, Lookup, build
except ImportError:  # pytest: module dir on sys.path
    from containers import Container, Lookup, build

_LOGGER = logging.getLogger(__name__)

Callback = Callable[[bool, "dict[str, dict]"], None]
# (plan id, device id, event): the event is an intent with "at", or a status dict
Listener = Callable[[str, str, dict], None]
Key = tuple[str, str]
# own command contexts remembered; HA reuses a context for a few seconds, so only the latest ones matter
OWN_LIMIT = 200


def _copy(event: dict) -> dict:
    """A copy its receiver may change freely (a status carries a list)."""
    return {k: list(v) if isinstance(v, list) else v for k, v in event.items()}


class Runtime:
    def __init__(self, lookup: Lookup, now: Callable[[], float], clock: Callable[[], str]) -> None:
        self._lookup = lookup
        self._now = now  # monotonic seconds, for the double-toggle window
        self._clock = clock  # ISO 8601 UTC string, for an intent's "at"
        self._containers: dict[Key, Container] = {}
        self._status: dict[Key, dict] = {}
        self._last: dict[Key, dict] = {}
        self._subs: dict[str, list[Callback]] = {}
        self._listeners: list[Listener] = []
        self._own: dict[str, None] = {}  # insertion ordered: the oldest goes first past OWN_LIMIT

    def load_plans(self, plans: "list[dict]") -> None:
        old = self._containers
        containers: dict[Key, Container] = {}
        status: dict[Key, dict] = {}
        last: dict[Key, dict] = {}
        changed: list[Key] = []
        for plan in plans:
            pid = plan.get("id")
            if not isinstance(pid, str):
                continue
            for level in plan.get("levels") or []:
                for device in (level.get("devices") or []) if isinstance(level, dict) else []:
                    did = device.get("id") if isinstance(device, dict) else None
                    c = build(device, self._lookup) if isinstance(did, str) else None
                    if c is None:
                        continue
                    key = (pid, did)
                    containers[key] = c
                    status[key] = c.status()
                    prev = old.get(key)
                    if prev is not None and prev.kind == c.kind:
                        if key in self._last:
                            last[key] = self._last[key]
                        if status[key] == self._status.get(key):
                            continue
                    changed.append(key)
        self._containers, self._status, self._last = containers, status, last
        for key in changed:
            self._tell(key, status[key])
        for pid in list(self._subs):
            self._notify(pid, True, self.snapshot(pid))

    def handle_state(
        self, entity_id: str, old, new, context: "tuple[str | None, str | None]" = (None, None)
    ) -> None:
        """One state change; context is (context.id, context.parent_id) of the change."""
        own = self.is_own(context)
        now = self._now()
        stamp: str | None = None
        events: list[tuple[Key, dict]] = []
        for key, c in list(self._containers.items()):
            if entity_id not in c.entity_ids():
                continue
            intents = c.handle(entity_id, old, new, now, own)
            status = c.status()
            if status != self._status.get(key):
                self._status[key] = status
                events.append((key, status))
            for intent in intents:
                if stamp is None:
                    stamp = self._clock()
                self._last[key] = {**intent, "at": stamp}
                events.append((key, self._last[key]))
        if not events:
            return
        frames: dict[str, dict[str, dict]] = {}
        for key, _event in events:  # frames first: a listener may reload the plans under us
            frames.setdefault(key[0], {})[key[1]] = self._public(key)
        for key, event in events:
            self._tell(key, event)
        for pid, containers in frames.items():
            self._notify(pid, False, containers)

    def _public(self, key: Key) -> dict:
        out = {"kind": self._containers[key].kind, **_copy(self._status[key])}
        last = self._last.get(key)
        if last is not None:
            out["last"] = dict(last)
        return out

    def snapshot(self, plan_id: str) -> "dict[str, dict]":
        return {did: self._public((pid, did)) for (pid, did) in self._containers if pid == plan_id}

    def subscribe(self, plan_id: str, cb: Callback) -> Callable[[], None]:
        self._subs.setdefault(plan_id, []).append(cb)

        def unsubscribe() -> None:
            subs = self._subs.get(plan_id)
            if subs and cb in subs:
                subs.remove(cb)
                if not subs:
                    del self._subs[plan_id]

        return unsubscribe

    def _notify(self, plan_id: str, full: bool, containers: "dict[str, dict]") -> None:
        for cb in list(self._subs.get(plan_id, ())):
            try:
                cb(full, containers)
            except Exception:  # noqa: BLE001 - one bad subscriber must not stop the others
                _LOGGER.exception("container subscriber failed; dropping it")
                subs = self._subs.get(plan_id)
                if subs and cb in subs:
                    subs.remove(cb)
                    if not subs:
                        del self._subs[plan_id]

    def add_listener(self, cb: Listener) -> Callable[[], None]:
        """In-process API for controllers: cb(plan_id, device_id, event) for every intent and status change."""
        self._listeners.append(cb)

        def remove() -> None:
            if cb in self._listeners:
                self._listeners.remove(cb)

        return remove

    def _tell(self, key: Key, event: dict) -> None:
        for cb in list(self._listeners):
            try:
                cb(key[0], key[1], _copy(event))
            except Exception:  # noqa: BLE001 - one bad listener must not stop the others
                _LOGGER.exception("container listener failed; dropping it")
                if cb in self._listeners:
                    self._listeners.remove(cb)

    def is_own(self, context: "tuple[str | None, str | None]") -> bool:
        """True when the context id or its parent id belongs to an own command."""
        return any(c is not None and c in self._own for c in context or ())

    def ignore_context(self, context_id: str) -> None:
        """Register the HA context id of an own command: changes it causes are not presses for a wall switch."""
        self._own.pop(context_id, None)
        self._own[context_id] = None
        while len(self._own) > OWN_LIMIT:
            del self._own[next(iter(self._own))]

    def entity_ids(self) -> "set[str]":
        out: set[str] = set()
        for c in self._containers.values():
            out |= c.entity_ids()
        return out
