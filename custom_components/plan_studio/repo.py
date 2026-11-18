"""In-memory plan repository with revisions. Must not import homeassistant."""

from __future__ import annotations

import copy
import json
import math
import re

import voluptuous as vol

try:
    from .announce import KINDS as ANNOUNCE, PHONE, SPEAKER, in_domain, service_ok
    from .control import EVENTS
    from .migrate import migrate_plan, CURRENT_SCHEMA
    from .virtual import KIND as VIRTUAL_KIND, PREFIX as VIRTUAL_PREFIX, entity_id as virtual_entity
except ImportError:  # pytest: module dir on sys.path
    from announce import KINDS as ANNOUNCE, PHONE, SPEAKER, in_domain, service_ok
    from control import EVENTS
    from migrate import migrate_plan, CURRENT_SCHEMA
    from virtual import KIND as VIRTUAL_KIND, PREFIX as VIRTUAL_PREFIX, entity_id as virtual_entity

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
    if "daylight" in src:
        if set(src) != {"daylight", "is"} or not _is_id(src["daylight"]) or src["is"] not in ("night", "dark", "day"):
            raise vol.Invalid("rule daylight input needs a sensor id and is night, dark or day")
        if "not" in i:
            raise vol.Invalid("rule daylight input does not take not")
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
    if r["inputs"] or "gate" in r or "leak" in r or "timed" in r or "outside" in r or "beurer" in r or "control" in r or "motionLight" in r or r["combine"] != "any" or r["onDelay"] != 0:
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
    if r["inputs"] or "gate" in r or "vent" in r or "timed" in r or "outside" in r or "beurer" in r or "control" in r or "motionLight" in r or r["combine"] != "any" or r["onDelay"] != 0 \
            or r["offDelay"] != 0 \
            or r["onTrue"] or r["onFalse"]:
        raise vol.Invalid("rule boiler needs no inputs, gate, vent or actions, combine any and no delays")


def _validate_leak(r: dict, lk: object) -> None:
    """A leak rule: leak sensors (any wet) close the valves; no inputs, gate, vent, boiler or actions."""
    if not isinstance(lk, dict) or set(lk) != {"sensors", "valves"}:
        raise vol.Invalid("rule leak needs sensors and valves")
    for key in ("sensors", "valves"):
        ids = lk[key]
        if not isinstance(ids, list) or not ids or not all(_is_id(i) for i in ids) or len(set(ids)) != len(ids):
            raise vol.Invalid(f"rule leak {key} needs at least one distinct device id")
    if r["inputs"] or "gate" in r or "vent" in r or "boiler" in r or "timed" in r or "outside" in r or "beurer" in r or "control" in r or "motionLight" in r or r["combine"] != "any" or r["onDelay"] != 0 \
            or r["offDelay"] != 0 or r["onTrue"] or r["onFalse"]:
        raise vol.Invalid("rule leak needs no inputs, gate, vent, boiler or actions, combine any and no delays")


def _validate_timed(r: dict, tm: object) -> None:
    """A timed switch rule: a button starts a timed run of a device; no inputs, gate, vent, boiler, leak or actions."""
    if not isinstance(tm, dict) or not {"button", "device", "minutes"} <= set(tm) <= {"button", "device", "minutes", "invert"}:
        raise vol.Invalid("rule timed needs button, device, minutes and optionally invert")
    if not _is_id(tm["button"]) or not _is_id(tm["device"]) or tm["button"] == tm["device"]:
        raise vol.Invalid("rule timed needs two different device ids")
    if type(tm["minutes"]) is not int or not 1 <= tm["minutes"] <= 1440:
        raise vol.Invalid("rule timed minutes must be a whole number 1..1440")
    if "invert" in tm and tm["invert"] is not True:
        raise vol.Invalid("rule timed invert may only be true")
    if r["inputs"] or "gate" in r or "vent" in r or "boiler" in r or "leak" in r or "outside" in r or "beurer" in r or "control" in r or "motionLight" in r or r["combine"] != "any" \
            or r["onDelay"] != 0 or r["offDelay"] != 0 or r["onTrue"] or r["onFalse"]:
        raise vol.Invalid("rule timed needs no inputs, gate, vent, boiler, leak or actions, combine any and no delays")


def _validate_outside(r: dict, o: object) -> None:
    """An outside light rule: a light follows a daylight sensor (optionally after sunset, in a window); no inputs, gate, other kinds or actions."""
    keys = {"light", "sensor", "noDataNight", "afterSunset", "window", "pause"}
    if not isinstance(o, dict) or not {"light", "sensor", "pause"} <= set(o) <= keys:
        raise vol.Invalid("rule outside needs light, sensor, pause and optionally noDataNight, afterSunset, window")
    if not _is_id(o["light"]) or not _is_id(o["sensor"]) or o["light"] == o["sensor"]:
        raise vol.Invalid("rule outside needs two different device ids")
    for flag in ("noDataNight", "afterSunset"):
        if flag in o and o[flag] is not True:
            raise vol.Invalid(f"rule outside {flag} may only be true")
    if type(o["pause"]) is not int or not 0 <= o["pause"] <= 1440:
        raise vol.Invalid("rule outside pause must be a whole number 0..1440")
    if "window" in o:
        w = o["window"]
        if not isinstance(w, dict) or set(w) != {"from", "to"} or not all(
                isinstance(w[k], str) and _TIME_RE.fullmatch(w[k]) for k in ("from", "to")):
            raise vol.Invalid("rule outside window needs from and to as HH:MM")
        if w["from"] == w["to"]:
            raise vol.Invalid("rule outside window needs from different from to")
    if r["inputs"] or "gate" in r or "vent" in r or "boiler" in r or "leak" in r or "timed" in r or "beurer" in r or "control" in r or "motionLight" in r or r["combine"] != "any" \
            or r["onDelay"] != 0 or r["offDelay"] != 0 or r["onTrue"] or r["onFalse"]:
        raise vol.Invalid("rule outside needs no inputs, gate, vent, boiler, leak, timed or actions, combine any and no delays")


def _validate_beurer(r: dict, b: object) -> None:
    """A beurer heater rule: a heater is kept on while a power source draws above a threshold; offDelay = off after; no inputs, gate, other kinds or actions."""
    keys = {"heater", "source", "above", "keep", "every"}
    if not isinstance(b, dict) or set(b) != keys:
        raise vol.Invalid("rule beurer needs heater, source, above, keep and every")
    if not _is_id(b["heater"]) or not _is_id(b["source"]) or b["heater"] == b["source"]:
        raise vol.Invalid("rule beurer needs two different device ids")
    if not _is_num(b["above"]) or b["above"] <= 0:
        raise vol.Invalid("rule beurer above must be a number > 0")
    for key in ("keep", "every"):
        if type(b[key]) is not int or not 0 <= b[key] <= 1440:
            raise vol.Invalid(f"rule beurer {key} must be a whole number of minutes 0..1440")
    if r["inputs"] or "gate" in r or "vent" in r or "boiler" in r or "leak" in r or "timed" in r or "outside" in r or "control" in r or "motionLight" in r or r["combine"] != "any" \
            or r["onDelay"] != 0 or r["onTrue"] or r["onFalse"]:
        raise vol.Invalid("rule beurer needs no inputs, gate, vent, boiler, leak, timed, outside, control or actions, combine any and onDelay 0")


def _validate_motion_light(r: dict, m: object) -> None:
    """A light motion control rule: motion sensors (optional) switch one light, buttons (optional; the engine accepts smart buttons and wall switches with
    a state entity, this check only ids) set the mode, an optional blocker (any on / off device, the engine checks it reads as one) keeps auto from acting,
    offDelay = off after; optional presence with the neighbour motion sensors (computed by the panel; ids only, the engine
    ignores one that is not a motion sensor of the plan); no inputs, gate, other kinds or actions."""
    keys = {"light", "sensors", "minOn", "buttons", "autoAfter"}
    if not isinstance(m, dict) or not keys <= set(m) <= keys | {"daylight", "blocker", "presence", "neighbours"}:
        raise vol.Invalid("rule motionLight needs light, sensors, minOn, buttons, autoAfter and optional daylight, blocker, presence, neighbours")
    if not _is_id(m["light"]):
        raise vol.Invalid("rule motionLight needs a light device id")
    if "presence" in m and type(m["presence"]) is not bool:
        raise vol.Invalid("rule motionLight presence must be true or false")
    for key in ("sensors", "buttons", "neighbours"):
        ids = m.get(key, [])
        if not isinstance(ids, list) or not all(_is_id(i) for i in ids) or len(set(ids)) != len(ids):
            raise vol.Invalid(f"rule motionLight {key} needs distinct device ids")
        if m["light"] in ids:
            raise vol.Invalid(f"rule motionLight light must not be one of its {key}")
    if "neighbours" in m:
        if m.get("presence") is not True:
            raise vol.Invalid("rule motionLight neighbours need presence")
        if set(m["neighbours"]) & set(m["sensors"]):
            raise vol.Invalid("rule motionLight neighbours must not be its sensors")
    if "daylight" in m:
        d = m["daylight"]
        if not isinstance(d, dict) or set(d) != {"sensor", "is"} or not _is_id(d["sensor"]) or d["is"] not in ("night", "dark"):
            raise vol.Invalid("rule motionLight daylight needs a sensor id and is night or dark")
    if "blocker" in m:
        b = m["blocker"]
        if not isinstance(b, dict) or set(b) != {"device", "is"} or not _is_id(b["device"]) or b["is"] not in ("on", "off"):
            raise vol.Invalid("rule motionLight blocker needs a device id and is on or off")
        if b["device"] == m["light"]:
            raise vol.Invalid("rule motionLight light must not be its blocker")
    for key, top, unit in (("minOn", 3600, "seconds"), ("autoAfter", 1440, "minutes")):
        if type(m[key]) is not int or not 0 <= m[key] <= top:
            raise vol.Invalid(f"rule motionLight {key} must be a whole number of {unit} 0..{top}")
    if r["inputs"] or "gate" in r or "vent" in r or "boiler" in r or "leak" in r or "timed" in r or "outside" in r or "beurer" in r or "control" in r or r["combine"] != "any" \
            or r["onDelay"] != 0 or r["onTrue"] or r["onFalse"]:
        raise vol.Invalid("rule motionLight needs no inputs, gate, other kinds or actions, combine any and onDelay 0")


def _validate_announce(a: dict, devices: dict) -> None:
    """A say / play / notify action: a non-empty text (media for play; notify takes an optional non-empty title). A
    device of the plan must be of the right kind (say / play: a speaker, notify: a phone). Its binding state never
    rejects the plan: a speaker without a voice (say) or a player, a phone without a notify service, and a device
    missing from the plan are the engine's "target missing" at run time, as for any action."""
    do = a["do"]
    field = "media" if do == "play" else "text"
    keys = {"device", "do", field}
    if not keys <= set(a) <= keys | ({"title"} if do == "notify" else set()) or not _is_id(a["device"]):
        raise vol.Invalid(f"rule {do} action needs a device{',' if do == 'notify' else ' and'} a {field}"
                          f"{' and optionally a title' if do == 'notify' else ''}")
    for key in (field, "title"):
        if key in a and not (isinstance(a[key], str) and a[key].strip()):
            raise vol.Invalid(f"rule {do} action needs a non-empty {key}")
    device = devices.get(a["device"])
    if device is None:
        return
    props = device.get("props") if isinstance(device.get("props"), dict) else {}
    if props.get("kind") != (PHONE if do == "notify" else SPEAKER):
        raise vol.Invalid(f"rule {do} action needs a {'phone' if do == 'notify' else 'speaker'}")


_CONTROL_DOS = ("on", "off", "toggle", "close")


def _validate_event(e: object, rules: dict) -> None:
    """An event source {event: {rule, what}}: the event of a purpose-built rule of the plan its kind gives (a rule missing
    from the plan is the engine's "rule missing", as for a rule input)."""
    if not isinstance(e, dict) or set(e) != {"rule", "what"} or not _is_id(e["rule"]) or not _is_id(e["what"]):
        raise vol.Invalid("rule control event source needs a rule id and what")
    ref = rules.get(e["rule"])
    if ref is None:
        return
    kind = next((k for k in EVENTS if k in ref), None)
    if kind is None:
        raise vol.Invalid("rule control event source needs a motionLight or boiler rule")
    if e["what"] not in EVENTS[kind]:
        whats = EVENTS[kind]
        raise vol.Invalid(f"rule control event of a {kind} rule must be {', '.join(whats[:-1])} or {whats[-1]}")


def _validate_control(r: dict, c: object, devices: dict, rules: dict) -> list[str]:
    """A load control rule: sources (buttons, condition inputs or events of purpose-built rules) give events that run the on / off / toggle action lists; a
    gate is allowed. Returns the rule ids the input sources reference (an event source reads no verdict)."""
    if not isinstance(c, dict) or set(c) != {"sources", "on", "off", "toggle"}:
        raise vol.Invalid("rule control needs sources, on, off and toggle")
    sources = c["sources"]
    if not isinstance(sources, list) or not sources:
        raise vol.Invalid("rule control needs at least one source")
    refs: list[str] = []
    seen: set[str] = set()
    read: set[str] = set()
    for s in sources:
        if isinstance(s, dict) and "event" in s:
            if set(s) != {"event"}:
                raise vol.Invalid("rule control event source needs a rule id and what")
            _validate_event(s["event"], rules)  # switches nothing and reads no device
        elif isinstance(s, dict) and "button" in s:
            if set(s) != {"button"} or not _is_id(s["button"]):
                raise vol.Invalid("rule control button source needs a button id")
        else:
            refs.extend(_validate_input(s))
            src = s["source"]
            read.update([src["device"]] if "device" in src else [x["device"] for x in src["held"]["sources"] if "device" in x] if "held" in src else [])
        key = json.dumps(s, sort_keys=True)
        if key in seen:
            raise vol.Invalid("rule control needs distinct sources")
        seen.add(key)
    targets: set[str] = set()
    for key in ("on", "off", "toggle"):
        actions = c[key]
        if not isinstance(actions, list):
            raise vol.Invalid(f"rule control {key} must be a list")
        ids: list[object] = []  # a device once; an announcement once per (device, do): a sound and a text on one speaker
        for a in actions:
            if isinstance(a, dict) and a.get("do") in ANNOUNCE:
                _validate_announce(a, devices)  # switches nothing: not a target its sources must not read
                ids.append((a["device"], a["do"]))
                continue
            if not isinstance(a, dict) or set(a) != {"device", "do"} or not _is_id(a["device"]) or a["do"] not in _CONTROL_DOS:
                raise vol.Invalid("rule control action needs a device and do on/off/toggle/close/say/play/notify")
            targets.add(a["device"])
            ids.append(a["device"])
        if len(set(ids)) != len(ids):
            raise vol.Invalid(f"rule control needs a device once in {key}")
    if not (c["on"] or c["off"] or c["toggle"]):
        raise vol.Invalid("rule control needs at least one action")
    if targets & read:
        raise vol.Invalid("rule control needs a target device that its sources do not read")
    if r["inputs"] or "vent" in r or "boiler" in r or "leak" in r or "timed" in r or "outside" in r or "beurer" in r or "motionLight" in r or r["combine"] != "any" \
            or r["onDelay"] != 0 or r["offDelay"] != 0 or r["onTrue"] or r["onFalse"]:
        raise vol.Invalid("rule control needs no inputs, other kinds or actions, combine any and no delays")
    return refs


def _validate_rules(rules: object, devices: dict) -> None:
    if not isinstance(rules, list):
        raise vol.Invalid("rules must be a list")
    graph: dict[str, list[str]] = {}
    by_id: dict[str, dict] = {}  # the rules an event source may name
    for r in rules:
        if isinstance(r, dict) and _is_id(r.get("id")):
            by_id.setdefault(r["id"], r)
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
                if isinstance(a, dict) and a.get("do") in ANNOUNCE:
                    _validate_announce(a, devices)
                elif not isinstance(a, dict) or not _is_id(a.get("device")) or a.get("do") not in ("on", "off", "open", "close"):
                    raise vol.Invalid("rule action needs a device and do on/off/open/close/say/play/notify")
        if "vent" in r:
            _validate_vent(r, r["vent"])
        if "boiler" in r:
            _validate_boiler(r, r["boiler"])
        if "leak" in r:
            _validate_leak(r, r["leak"])
        if "timed" in r:
            _validate_timed(r, r["timed"])
        if "outside" in r:
            _validate_outside(r, r["outside"])
        if "beurer" in r:
            _validate_beurer(r, r["beurer"])
        if "motionLight" in r:
            _validate_motion_light(r, r["motionLight"])
        if "control" in r:
            refs.extend(_validate_control(r, r["control"], devices, by_id))
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


def _validate_devices(levels: list) -> tuple[set[str], dict[str, dict]]:
    """A virtual switch binds exactly its synthetic entity (control = virtual.<its id>) and no other device binds a
    virtual entity; a speaker binds only player (a media_player) and voice (a tts entity), each optional until bound; a
    phone binds nothing and its notify, once set, is a notify service name. Other bindings are not checked. Returns the
    virtual switch ids and the devices by id (the first of an id)."""
    out: set[str] = set()
    by_id: dict[str, dict] = {}
    for level in levels:
        devices = level.get("devices") if isinstance(level, dict) else None
        for d in devices if isinstance(devices, list) else []:
            if not isinstance(d, dict):
                continue
            if _is_id(d.get("id")):
                by_id.setdefault(d["id"], d)
            props = d.get("props")
            if isinstance(props, dict) and props.get("kind") == VIRTUAL_KIND:
                if not _is_id(d.get("id")) or d.get("bindings") != {"control": virtual_entity(d["id"])}:
                    raise vol.Invalid("a virtual switch binds only control = virtual.<its device id>")
                out.add(d["id"])
                continue
            bindings = d.get("bindings")
            values = bindings.values() if isinstance(bindings, dict) else ()
            if any(isinstance(v, str) and v.startswith(VIRTUAL_PREFIX) for v in values):
                raise vol.Invalid("only a virtual switch binds a virtual entity (virtual.<id>)")
            kind = props.get("kind") if isinstance(props, dict) else None
            if kind == SPEAKER and bindings is not None and (
                    not isinstance(bindings, dict) or not set(bindings) <= {"player", "voice"}
                    or ("player" in bindings and not in_domain(bindings["player"], "media_player"))
                    or ("voice" in bindings and not in_domain(bindings["voice"], "tts"))):
                raise vol.Invalid("a speaker binds only player (a media_player entity) and voice (a tts entity)")
            if kind == PHONE:
                if bindings not in (None, {}):
                    raise vol.Invalid("a phone binds no entity")
                if "notify" in props and not service_ok(props["notify"]):
                    raise vol.Invalid("a phone needs notify as a notify service name without the notify. prefix")
    return out, by_id


def _validate_virtual_reads(rules: list, virtual: set[str]) -> None:
    """A rule must not switch a virtual switch it reads as a direct input: the switch changes at once, so its own
    command would flip its verdict again at once, forever. A held source or the gate over it is no such loop."""
    for r in rules:
        read = {i["source"]["device"] for i in r["inputs"] if "device" in i["source"]}
        switched = {a["device"] for key in ("onTrue", "onFalse") for a in r[key]}
        if read & switched & virtual:
            raise vol.Invalid("a rule must not switch a virtual switch it reads as an input")


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
    virtual, devices = _validate_devices(levels)
    if "power" in plan:
        power = plan["power"]
        if not isinstance(power, dict) or not all(isinstance(power.get(k), list) for k in ("blocks", "wires")):
            raise vol.Invalid("power must have blocks and wires lists")
    if "rules" in plan:
        _validate_rules(plan["rules"], devices)
        _validate_virtual_reads(plan["rules"], virtual)
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
