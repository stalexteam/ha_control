"""Registry of input containers over all saved plans. Must not import homeassistant."""

from __future__ import annotations

import logging
from typing import Callable

try:
    from .containers import Container, Lookup, build
except ImportError:  # pytest: module dir on sys.path
    from containers import Container, Lookup, build

_LOGGER = logging.getLogger(__name__)

Callback = Callable[[bool, "dict[str, dict]"], None]


def _kind(device: dict) -> "str | None":
    props = device.get("props")
    return props.get("kind") if isinstance(props, dict) else None


class Runtime:
    def __init__(
        self,
        lookup: Lookup,
        now: Callable[[], float],
        stored: "dict | None",
        on_persist: Callable[[], None],
    ) -> None:
        self._lookup = lookup
        self._now = now
        self._stored: dict = stored if isinstance(stored, dict) else {}
        self._on_persist = on_persist
        self._first = True
        self._containers: dict[tuple[str, str], Container] = {}
        self._subs: dict[str, list[Callback]] = {}

    def _restored(self, key: tuple[str, str], kind: str, old: "dict[tuple[str, str], Container]"):
        prev = old.get(key)
        if prev is not None:
            return prev.persisted() if prev.kind == kind else None
        if self._first:
            entry = self._stored.get(f"{key[0]}/{key[1]}")
            if isinstance(entry, dict) and entry.get("kind") == kind:
                out = entry.get("output")
                return out if isinstance(out, str) else None
        return None

    def load_plans(self, plans: "list[dict]") -> None:
        old = self._containers
        new: dict[tuple[str, str], Container] = {}
        for plan in plans:
            pid = plan.get("id")
            if not isinstance(pid, str):
                continue
            for level in plan.get("levels") or []:
                for device in (level.get("devices") or []) if isinstance(level, dict) else []:
                    did = device.get("id") if isinstance(device, dict) else None
                    kind = _kind(device) if isinstance(did, str) else None
                    if kind is None:
                        continue
                    key = (pid, did)
                    c = build(device, self._lookup, self._restored(key, kind, old))
                    if c is not None:
                        new[key] = c
        self._containers = new
        self._first = False
        self._on_persist()
        for pid in list(self._subs):
            self._notify(pid, True, self.snapshot(pid))

    def handle_state(self, entity_id: str, old, new) -> None:
        now = self._now()
        changed: dict[str, dict[str, dict]] = {}
        for (pid, did), c in self._containers.items():
            if c.handle(entity_id, old, new, now):
                changed.setdefault(pid, {})[did] = c.public()
        if not changed:
            return
        self._on_persist()
        for pid, containers in changed.items():
            self._notify(pid, False, containers)

    def snapshot(self, plan_id: str) -> "dict[str, dict]":
        return {did: c.public() for (pid, did), c in self._containers.items() if pid == plan_id}

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

    def entity_ids(self) -> "set[str]":
        out: set[str] = set()
        for c in self._containers.values():
            out |= c.entity_ids()
        return out

    def persisted(self) -> dict:
        out: dict[str, dict] = {}
        for (pid, did), c in self._containers.items():
            p = c.persisted()
            if p is not None:
                out[f"{pid}/{did}"] = {"kind": c.kind, "output": p}
        return out
