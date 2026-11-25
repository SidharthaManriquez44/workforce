"""
Local web entry point for the workforce dashboard.
"""

import asyncio
import logging
from contextlib import asynccontextmanager, suppress

import psycopg
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from ..contracts import PROTOCOL, Conflict, Invalid, day
from ..dashboard.analytics import FILTERS, analyze, comparisons
from ..storage.inbox import sync
from ..storage.storage import (
    ROOT,
    init_db,
    read_state,
    save_historical,
    save_run,
)

log = logging.getLogger(__name__)


async def sync_loop():
    while True:
        try:
            await asyncio.to_thread(sync)
        except (OSError, psycopg.Error):
            log.exception("Error al aplicar entregas. Se reintentará.")
        await asyncio.sleep(20)


@asynccontextmanager
async def lifespan(_app):
    await asyncio.to_thread(init_db)
    worker = asyncio.create_task(sync_loop())
    try:
        yield
    finally:
        worker.cancel()
        with suppress(asyncio.CancelledError):
            await worker


app = FastAPI(lifespan=lifespan)
app.mount("/assets", StaticFiles(directory=ROOT / "assets"), name="assets")


@app.exception_handler(Invalid)
async def invalid(_request, error):
    status = 409 if isinstance(error, Conflict) else 422
    return JSONResponse({"error": str(error)}, status_code=status)


@app.exception_handler(psycopg.Error)
async def database_error(_request, error):
    log.error("Error de PostgreSQL: %s", error)
    return JSONResponse({"error": "PostgreSQL no está disponible."}, status_code=503)


@app.get("/")
def index():
    return FileResponse(ROOT / "index.html")


@app.get("/api/protocol")
def protocol():
    return PROTOCOL


@app.get("/api/state")
def state():
    return JSONResponse(read_state(), headers={"Cache-Control": "no-store"})


@app.get("/api/dashboard")
def dashboard(request: Request):
    filters = {
        key: request.query_params.get(key, "") for key in (*FILTERS, "from", "to")
    }
    for key in ("from", "to"):
        if filters[key]:
            day(filters[key])
            if (
                not PROTOCOL["window"]["start"]
                <= filters[key]
                <= PROTOCOL["window"]["end"]
            ):
                raise Invalid("Seleccione fechas dentro de la ventana del estudio.")
    if filters["from"] and filters["to"] and filters["from"] > filters["to"]:
        raise Invalid("La fecha inicial debe preceder a la final.")
    if filters["platform"] and filters["platform"] not in PROTOCOL["platforms"]:
        raise Invalid("Plataforma inválida.")
    data = read_state()
    return JSONResponse(
        {
            **analyze(data, filters),
            "comparisons": comparisons(data),
            "historical": data["historical"],
            "reviews": data["reviews"],
            "run_count": len(data["runs"]),
            "latest_date": max(
                (run["date"] for run in data["runs"]),
                default=None,
            ),
        },
        headers={"Cache-Control": "no-store"},
    )


@app.post("/api/runs")
def add_run(document: dict):
    return save_run(document)


@app.post("/api/historical")
def add_historical(document: dict):
    return save_historical(document)


@app.get("/api/health")
def health():
    data = read_state()
    return {"postgres": "ok", "dashboard": "ok", "runs": len(data["runs"])}
