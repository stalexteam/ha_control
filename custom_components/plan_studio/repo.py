"""In-memory plan repository with revisions. Must not import homeassistant."""

from __future__ import annotations

import copy
import json

import voluptuous as vol

try:
    from .migrate import migrate_plan, CURRENT_SCHEMA
except ImportError:  # pytest: module dir on sys.path
    from migrate import migrate_plan, CURRENT_SCHEMA

MAX_PLAN_BYTES = 5 * 1024 * 1024


class RevisionConflict(Exception):
    """Raised when expected revision does not match stored revision."""


def validate_plan(plan: dict) -> None:
    if not isinstance(plan, dict):
        raise vol.Invalid("plan must be an object")
    pid = plan.get("id")
    if not isinstance(pid, str) or not pid:
        raise vol.Invalid("id must be a non-empty string")
    if not isinstance(plan.get("name"), str):
        raise vol.Invalid("name must be a string")
    schema_version = plan.get("schemaVersion")
    # bool is a subclass of int: True must not pass as schema version 1.
    if type(schema_version) is not int or schema_version != CURRENT_SCHEMA:
        raise vol.Invalid(f"schemaVersion must be {CURRENT_SCHEMA}")
    levels = plan.get("levels")
    if not isinstance(levels, list) or not levels:
        raise vol.Invalid("levels must be a non-empty list")
    if "power" in plan:
        power = plan["power"]
        if not isinstance(power, dict) or not all(isinstance(power.get(k), list) for k in ("blocks", "wires")):
            raise vol.Invalid("power must have blocks and wires lists")
    try:
        size = len(json.dumps(plan).encode("utf-8"))
    except (TypeError, ValueError) as err:
        raise vol.Invalid(f"plan is not JSON serialisable: {err}") from err
    if size > MAX_PLAN_BYTES:
        raise vol.Invalid("plan exceeds 5 MB")


def validate_revision(value: object) -> int | None:
    """expected_revision: None or a plain int (bool is rejected although it is an int subclass)."""
    if value is None or type(value) is int:
        return value
    raise vol.Invalid("expected_revision must be an integer or null")


class PlanRepo:
    def __init__(self, data: dict | None) -> None:
        self._plans: dict[str, dict] = {}
        for pid, plan in ((data or {}).get("plans") or {}).items():
            self._plans[pid] = migrate_plan(plan)

    def list(self) -> list[dict]:
        return [
            {"id": p["id"], "name": p.get("name", ""), "revision": p.get("revision", 0)}
            for p in self._plans.values()
        ]

    def plans(self) -> list[dict]:
        return list(self._plans.values())

    def get(self, plan_id: str) -> dict | None:
        plan = self._plans.get(plan_id)
        return copy.deepcopy(plan) if plan is not None else None

    def save(self, plan: dict, expected_revision: int | None, force: bool = False) -> int:
        validate_plan(plan)
        validate_revision(expected_revision)
        pid = plan["id"]
        current = self._plans.get(pid)
        if current is None:
            if expected_revision is not None:
                raise RevisionConflict(f"plan {pid} does not exist")
            revision = 1
        else:
            cur_rev = current.get("revision", 0)
            if not force and expected_revision != cur_rev:
                raise RevisionConflict(
                    f"expected revision {expected_revision}, current {cur_rev}"
                )
            revision = cur_rev + 1
        stored = copy.deepcopy(plan)
        stored["revision"] = revision
        self._plans[pid] = stored
        return revision

    def delete(self, plan_id: str) -> bool:
        return self._plans.pop(plan_id, None) is not None

    def snapshot(self) -> dict[str, dict]:
        """Deep copy of the stored plans, for rolling back a failed persist."""
        return copy.deepcopy(self._plans)

    def restore(self, snapshot: dict[str, dict]) -> None:
        self._plans = copy.deepcopy(snapshot)

    def to_dict(self) -> dict:
        return {"plans": copy.deepcopy(self._plans)}
