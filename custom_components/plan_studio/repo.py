"""In-memory plan repository with revisions. Must not import homeassistant."""

from __future__ import annotations

import copy
import json
import math
import re

import voluptuous as vol

try:
    from .migrate import migrate_plan, CURRENT_SCHEMA
except ImportError:  # pytest: module dir on sys.path
    from migrate import migrate_plan, CURRENT_SCHEMA

MAX_PLAN_BYTES = 5 * 1024 * 1024


class RevisionConflict(Exception):
    """Raised when expected revision does not match stored revision."""


def _is_id(v: object) -> bool:
    return isinstance(v, str) and bool(v)


_TIME_RE = re.compile(r"([01]\d|2[0-3]):[0-5]\d")


def _is_num(v: object) -> bool:
    return type(v) in (int, float) and math.isfinite(v)


def _simple_source(src: object) -> str | None:
    """Rule id of a {device} / {rule} source (None for a device); raises when not one of them."""
    if not isinstance(src, dict) or len(src) != 1 or not _is_id(src.get("device", src.get("rule"))):
        raise vol.Invalid("rule input needs a source with a device or rule id")
    return src.get("rule")


def _validate_input(i: object) -> list[str]:
    """Validate one rule input (or the gate); returns the rule ids it references."""
    src = i.get("source") if isinstance(i, dict) else None
    if not isinstance(src, dict):
        raise vol.Invalid("rule input needs a source with a device or rule id")
    if "not" in i and i["not"] is not True:
        raise vol.Invalid("rule input not may only be true")
    if "light" in src:
        if set(src) - {"unknownDark"} != {"light", "below", "hysteresis"} or not _is_id(src["light"]):
            raise vol.Invalid("rule light input needs a sensor id, below and hysteresis")
        if "unknownDark" in src and src["unknownDark"] is not True:
            raise vol.Invalid("rule light unknownDark may only be true")
        if not _is_num(src["below"]) or src["below"] <= 0 or not _is_num(src["hysteresis"]) or src["hysteresis"] < 0:
            raise vol.Invalid("rule light input needs below > 0 and hysteresis >= 0")
        return []
    if "sun" in src:
        if len(src) != 1 or src["sun"] is not True:
            raise vol.Invalid("rule sun input must be {sun: true}")
        return []
    if "time" in src:
        t = src["time"]
        if len(src) != 1 or not isinstance(t, dict) or set(t) != {"from", "to"} or not all(
                isinstance(t[k], str) and _TIME_RE.fullmatch(t[k]) for k in ("from", "to")):
            raise vol.Invalid("rule time input needs from and to as HH:MM")
        if t["from"] == t["to"]:
            raise vol.Invalid("rule time input needs from different from to")
        return []
    if "held" in src:
        h = src["held"]
        if len(src) != 1 or not isinstance(h, dict) or set(h) != {"sources", "state", "seconds"}:
            raise vol.Invalid("rule held input needs sources, state and seconds")
        if h["state"] not in ("on", "off", "any"):
            raise vol.Invalid("rule held state must be on, off or any")
        if type(h["seconds"]) is not int or not 1 <= h["seconds"] <= 86400:
            raise vol.Invalid("rule held seconds must be a whole number 1..86400")
        if not isinstance(h["sources"], list) or not h["sources"]:
            raise vol.Invalid("rule held input needs at least one source")
        return [x for x in map(_simple_source, h["sources"]) if x is not None]
    rule_id = _simple_source(src)
    return [rule_id] if rule_id is not None else []


def _validate_vent(r: dict, v: object) -> None:
    """A vent rule: sensor vs than, % margins, one fan switched on/off, no inputs or gate."""
    if not isinstance(v, dict) or set(v) != {"sensor", "than", "above", "below"}:
        raise vol.Invalid("rule vent needs sensor, than, above and below")
    if not _is_id(v["sensor"]) or not _is_id(v["than"]) or v["sensor"] == v["than"]:
        raise vol.Invalid("rule vent needs two different sensor ids")
    if not _is_num(v["above"]) or not _is_num(v["below"]) or v["above"] <= 0 or not 0 <= v["below"] <= v["above"]:
        raise vol.Invalid("rule vent needs above > 0 and 0 <= below <= above")
    if r["inputs"] or "gate" in r or r["combine"] != "any" or r["onDelay"] != 0:
        raise vol.Invalid("rule vent needs no inputs or gate, combine any and onDelay 0")
    on, off = r["onTrue"], r["onFalse"]
    if len(on) != 1 or len(off) != 1 or on[0]["do"] != "on" or off[0]["do"] != "off" or on[0]["device"] != off[0]["device"]:
        raise vol.Invalid("rule vent needs one fan: on when true, off when false")


def _validate_boiler(r: dict, b: object) -> None:
    """A boiler rule: device, button and an optional grid limit; no inputs, gate, vent or actions."""
    if not isinstance(b, dict) or not {"device", "button"} <= set(b) <= {"device", "button", "grid"}:
        raise vol.Invalid("rule boiler needs device, button and optionally grid")
    if not _is_id(b["device"]) or not _is_id(b["button"]) or b["device"] == b["button"]:
        raise vol.Invalid("rule boiler needs two different device ids")
    if "grid" in b:
        g = b["grid"]
        if not isinstance(g, dict) or set(g) != {"block", "limit", "nominal"} or not _is_id(g["block"]):
            raise vol.Invalid("rule boiler grid needs block, limit and nominal")
        if not _is_num(g["limit"]) or not _is_num(g["nominal"]) or g["limit"] <= 0 or g["nominal"] <= 0:
            raise vol.Invalid("rule boiler grid needs limit > 0 and nominal > 0")
    if r["inputs"] or "gate" in r or "vent" in r or r["combine"] != "any" or r["onDelay"] != 0 or r["offDelay"] != 0 \
            or r["onTrue"] or r["onFalse"]:
        raise vol.Invalid("rule boiler needs no inputs, gate, vent or actions, combine any and no delays")


def _validate_rules(rules: object) -> None:
    if not isinstance(rules, list):
        raise vol.Invalid("rules must be a list")
    graph: dict[str, list[str]] = {}
    for r in rules:
        if not isinstance(r, dict):
            raise vol.Invalid("a rule must be an object")
        if not _is_id(r.get("id")) or not isinstance(r.get("name"), str):
            raise vol.Invalid("a rule needs a string id and name")
        if r["id"] in graph:
            raise vol.Invalid("duplicate rule id")
        if r.get("combine") not in ("all", "any"):
            raise vol.Invalid("rule combine must be all or any")
        for key in ("onDelay", "offDelay"):
            v = r.get(key)
            if type(v) is not int or not 0 <= v <= 3600:
                raise vol.Invalid(f"rule {key} must be a whole number of seconds 0..3600")
        zone = r.get("zoneId")
        if zone is not None and not isinstance(zone, str):
            raise vol.Invalid("rule zoneId must be a string or null")
        if "enabled" in r and r["enabled"] is not False:
            raise vol.Invalid("rule enabled may only be false")
        inputs = r.get("inputs")
        if not isinstance(inputs, list):
            raise vol.Invalid("rule inputs must be a list")
        refs: list[str] = []
        for i in inputs:
            refs.extend(_validate_input(i))
        if "gate" in r:
            refs.extend(_validate_input(r["gate"]))
        for key in ("onTrue", "onFalse"):
            actions = r.get(key)
            if not isinstance(actions, list):
                raise vol.Invalid(f"rule {key} must be a list")
            for a in actions:
                if not isinstance(a, dict) or not _is_id(a.get("device")) or a.get("do") not in ("on", "off", "open", "close"):
                    raise vol.Invalid("rule action needs a device and do on/off/open/close")
        if "vent" in r:
            _validate_vent(r, r["vent"])
        if "boiler" in r:
            _validate_boiler(r, r["boiler"])
        graph[r["id"]] = refs
    state: dict[str, int] = {}

    def visit(node: str) -> None:
        state[node] = 1
        for nxt in graph.get(node, []):
            if state.get(nxt) == 1:
                raise vol.Invalid("rules reference each other in a cycle")
            if nxt in graph and nxt not in state:
                visit(nxt)
        state[node] = 2

    for rid in graph:
        if rid not in state:
            visit(rid)


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
        raise vol.Invalid(f"schemaVersion must be {CURRENT_SCHEMA}: reload the Plan Studio page")
    levels = plan.get("levels")
    if not isinstance(levels, list) or not levels:
        raise vol.Invalid("levels must be a non-empty list")
    if "power" in plan:
        power = plan["power"]
        if not isinstance(power, dict) or not all(isinstance(power.get(k), list) for k in ("blocks", "wires")):
            raise vol.Invalid("power must have blocks and wires lists")
    if "rules" in plan:
        _validate_rules(plan["rules"])
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
        # Ids of the plans that migrate_plan converted: the store writes them back once, at load.
        self.migrated: list[str] = []
        for pid, plan in ((data or {}).get("plans") or {}).items():
            converted = migrate_plan(plan)
            self._plans[pid] = converted
            if converted is not plan:
                self.migrated.append(pid)

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
