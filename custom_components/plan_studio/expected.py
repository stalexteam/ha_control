"""Expected states of the entities Plan Studio commands ("our optimistic"). Must not import homeassistant.

Every command records the state it should bring; one record per entity, the latest command (a newer one replaces it;
an identical repeat, the same state from the same sender, continues it: the times count from its first send).
The first change of the entity to that state is Plan Studio's own whatever its context and delay (HA keeps a call's
context only ~5 s; a slow relay confirms later without it), and uses the record up. A change to another known state
drops the record (the device or a person went elsewhere). Without a confirmation the command is sent once more after
RETRY s and given up after EXPIRE s ("not confirmed"). The caller owns the clock and the timers."""

from __future__ import annotations

RETRY = 10  # s after the command without a confirmation: it is sent once more
EXPIRE = 60  # s after the command without a confirmation: given up, a command the device lost

# neither the confirmation nor another state: no data, or a valve on its way
_PASSING = (None, "unavailable", "unknown", "opening", "closing")
_NO_DATA = (None, "unavailable", "unknown")
_SWITCHED = ("light", "switch", "fan", "input_boolean")
_VALVE = {"open_valve": "open", "close_valve": "closed"}


def passing(state: str | None) -> bool:
    """No data or a valve on its way: a state that neither confirms a command nor contradicts it."""
    return state in _PASSING


def expect(domain: str, service: str) -> str | None:
    """The state a service call should bring the entity to; None for a call that is not recorded."""
    if domain in _SWITCHED and service in ("turn_on", "turn_off"):
        return service[len("turn_"):]
    return _VALVE.get(service) if domain == "valve" else None


def service(domain: str, state: str) -> str | None:
    """The service that brings an entity of the domain to the state (the reverse of expect)."""
    if domain == "valve":
        return next((s for s, v in _VALVE.items() if v == state), None)
    return f"turn_{state}" if domain in _SWITCHED and state in ("on", "off") else None


class _Record:
    __slots__ = ("state", "at", "by", "retried", "lapsed")

    def __init__(self, state: str, at: float, by: object) -> None:
        self.state, self.at, self.by, self.retried = state, at, by, False
        self.lapsed = False  # the entity had no data since the first send


class Expected:
    def __init__(self) -> None:
        self._records: dict[str, _Record] = {}

    def sent(self, entity_id: str, state: str, now: float, by: object) -> None:
        """A command to the entity was sent by `by` (opaque here); it replaces the entity's record. An identical repeat
        of the record (same state, same sender) keeps its first send time and its retried mark, so a command repeated
        every few seconds still fails after EXPIRE s; not after the entity had no data (the re-send when the device is
        back is a fresh send)."""
        r = self._records.get(entity_id)
        if r is not None and r.state == state and r.by == by and not r.lapsed:
            return
        self._records[entity_id] = _Record(state, now, by)

    def arrived(self, entity_id: str, state: str | None, now: float, back: bool = False) -> bool:
        """One change of the entity's state: True when it is the expected one (the record is used up). Another known
        state drops the record, except back from no data (back: the state before was passing): that is a fresh
        reading of a device that has not applied the command yet, kept for the retry and the expiry. No data or a
        moving valve keeps the record; a record past EXPIRE is left to due()."""
        r = self._records.get(entity_id)
        if r is not None and state in _NO_DATA:
            r.lapsed = True
        if r is None or passing(state) or now >= r.at + EXPIRE:
            return False
        if state == r.state:
            del self._records[entity_id]
            return True
        if not back:
            del self._records[entity_id]
        return False

    def due(self, now: float) -> "list[tuple[str, str, object, str]]":
        """The records needing action, (entity id, state, by, "retry" | "expire"): a retry is reported once (the record
        stays), an expiry removes the record."""
        out: list[tuple[str, str, object, str]] = []
        for eid, r in list(self._records.items()):
            if now >= r.at + EXPIRE:
                del self._records[eid]
                out.append((eid, r.state, r.by, "expire"))
            elif not r.retried and now >= r.at + RETRY:
                r.retried = True
                out.append((eid, r.state, r.by, "retry"))
        return out

    def next_at(self) -> float | None:
        """When due() has something to report next; None without records."""
        return min((r.at + (EXPIRE if r.retried else RETRY) for r in self._records.values()), default=None)
