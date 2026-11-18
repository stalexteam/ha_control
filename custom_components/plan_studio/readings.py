"""Reading statistics of tracked entities: the latest reports and the typical interval between them.

A report is a state change or a repeated report of the same value. A state without data is not a report: it breaks
the chain, so the interval across it is never counted (earlier and later intervals both count). In memory only."""

from __future__ import annotations

import statistics

KEEP = 32  # reports kept per entity
SPAN = 16  # latest intervals the period is taken from
MIN_INTERVALS = 3  # fewer intervals: the period is unknown
_NO_DATA = ("unavailable", "unknown")


class Readings:
    def __init__(self) -> None:
        # entity id -> [(time, state, gap)]; gap: no data came between this report and the one before it
        self._reports: dict[str, list[tuple[float, str, bool]]] = {}
        self._gap: set[str] = set()  # entities whose next report follows no data

    def report(self, entity_id: str, state: str | None, now: float) -> None:
        if state is None or state in _NO_DATA:
            if entity_id in self._reports:
                self._gap.add(entity_id)
            return
        reports = self._reports.setdefault(entity_id, [])
        reports.append((now, state, entity_id in self._gap))
        self._gap.discard(entity_id)
        if len(reports) > KEEP:
            del reports[0]

    def last(self, entity_id: str) -> float | None:
        reports = self._reports.get(entity_id)
        return reports[-1][0] if reports else None

    def period(self, entity_id: str) -> float | None:
        reports = self._reports.get(entity_id, [])
        intervals = [b[0] - a[0] for a, b in zip(reports, reports[1:]) if not b[2]][-SPAN:]
        return statistics.median(intervals) if len(intervals) >= MIN_INTERVALS else None

    def stats(self, entity_id: str) -> dict:
        last, period = self.last(entity_id), self.period(entity_id)
        return {
            "last": None if last is None else round(last * 1000),
            "period": None if period is None else round(period * 1000),
            "count": len(self._reports.get(entity_id, ())),
        }

    def keep(self, entity_ids: set[str]) -> None:
        for eid in [e for e in self._reports if e not in entity_ids]:
            del self._reports[eid]
        self._gap &= entity_ids
