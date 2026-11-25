"""
Durable handoff between scheduled runs and the Docker-hosted database.
"""

import json
import os
from datetime import datetime
from pathlib import Path

from ..contracts import PROTOCOL, TZ, Invalid, day, require
from ..dashboard.analytics import analyze
from .files import write_json
from .storage import read_state, save_historical, save_run, save_weekly


def data_dir():
    return Path(os.getenv("WORKFORCE_DATA_DIR", "data"))


def process(document):
    require(isinstance(document, dict), "Se esperaba un objeto JSON.")
    kind = document.get("kind", "run")
    if kind == "run":
        return save_run(document)
    if kind == "historical":
        return save_historical(document.get("source"))
    if kind == "weekly":
        start, end = document.get("period_start"), document.get("period_end")
        require(
            [start, end] in PROTOCOL["cuts"], "El periodo no corresponde a un corte."
        )
        require(
            day(end) <= datetime.now(TZ).date(),
            "El corte aún no llega a su fecha de cierre.",
        )
        return save_weekly(start, end)
    raise Invalid("Tipo de entrega inválido.")


def sync():
    root = data_dir()
    received = []
    candidates = sorted((root / "inbox").glob("*.json"))
    # Capture and historical documents precede weekly consolidation.
    for path in sorted(candidates, key=lambda item: item.name.startswith("weekly-")):
        receipt = root / "receipts" / path.name
        if receipt.exists():
            continue
        try:
            document = json.loads(path.read_text(encoding="utf-8"))
            result = process(document)
            if "run_id" in result:
                state = read_state()
                stored = next(
                    run for run in state["runs"] if run["run_id"] == result["run_id"]
                )
                result["persisted_records"] = len(stored["records"])
                result["persisted_platforms"] = len(stored["coverage"])
                result["dashboard_metrics"] = analyze(state)["metrics"]
            output = {"status": "guardado", "result": result}
        except (Invalid, json.JSONDecodeError) as exc:
            output = {"status": "rechazado", "error": str(exc)}
        write_json(receipt, output)
        received.append(receipt.name)
    return received
