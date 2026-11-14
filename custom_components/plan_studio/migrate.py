"""Plan schema migrations. Must not import homeassistant."""

from __future__ import annotations

CURRENT_SCHEMA = 1


def migrate_plan(plan: dict) -> dict:
    version = plan.get("schemaVersion")
    if isinstance(version, int) and version > CURRENT_SCHEMA:
        raise ValueError(
            f"plan schemaVersion {version} is newer than supported {CURRENT_SCHEMA}"
        )
    return plan
