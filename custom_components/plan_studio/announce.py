"""Announcements: the say, play and notify actions of the condition and load control rules. Must not import
homeassistant.

A speaker (bindings: player = a media_player, voice = a tts entity, optional) says a text (tts.speak through its voice
on its player) or plays a media id (media_player.play_media on its player); a phone (prop notify = a notify service
name) gets a push (notify.<service>). Each is one service call with its data: never a holder slot, never an expected
state, never re-sent (the rule engine runs them; whether the player has data decides "target unavailable")."""

from __future__ import annotations

import re

KINDS = ("say", "play", "notify")  # the action `do` values
SPEAKER = "speaker"
PHONE = "phone"
_SERVICE = re.compile(r"[a-z0-9_]+")  # a Home Assistant service name (no domain)

# (domain, service, entity id or None, service data without the entity id, the player or None)
Call = tuple[str, str, "str | None", dict, "str | None"]


def service_ok(v: object) -> bool:
    """A notify service name without the notify. prefix (e.g. mobile_app_phone)."""
    return isinstance(v, str) and _SERVICE.fullmatch(v) is not None


def in_domain(v: object, domain: str) -> bool:
    """An entity id of the domain (checked by its domain only, never by its name)."""
    return isinstance(v, str) and v.startswith(domain + ".") and len(v) > len(domain) + 1


def _text(raw: dict, key: str) -> str | None:
    v = raw.get(key)
    return v.strip() if isinstance(v, str) and v.strip() else None


def call(device: dict | None, raw: dict) -> Call | None:
    """The call of a say / play / notify action, or None when the device cannot take it (missing, another kind, the
    entity it needs not bound, no text or media)."""
    if device is None:
        return None
    props = device.get("props") if isinstance(device.get("props"), dict) else {}
    bindings = device.get("bindings") if isinstance(device.get("bindings"), dict) else {}
    kind, do = props.get("kind"), raw.get("do")
    if do == "notify":
        message, service = _text(raw, "text"), props.get("notify")
        if kind != PHONE or not service_ok(service) or message is None:
            return None
        data = {"message": message}
        title = _text(raw, "title")
        if title is not None:
            data["title"] = title
        return "notify", service, None, data, None
    player = bindings.get("player")
    if kind != SPEAKER or not in_domain(player, "media_player"):
        return None
    if do == "say":
        voice, message = bindings.get("voice"), _text(raw, "text")
        if not in_domain(voice, "tts") or message is None:
            return None
        return "tts", "speak", voice, {"media_player_entity_id": player, "message": message}, player
    if do == "play":
        media = _text(raw, "media")
        if media is None:
            return None
        return "media_player", "play_media", player, {"media_content_id": media, "media_content_type": "music"}, player
    return None
