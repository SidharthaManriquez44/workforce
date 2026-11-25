"""
Append-only PostgreSQL persistence and transactional imports.
"""

import hashlib
import json
import os
from pathlib import Path

import psycopg
from psycopg import sql
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb

from ..contracts import PACKAGE, Conflict, validate_historical, validate_run
from ..dashboard.analytics import weekly_report

ROOT = Path(os.getenv("WORKFORCE_ROOT", Path(__file__).resolve().parents[3]))
DATABASE = "workforce_db"
RECORD_COLUMNS = (
    "platform",
    "platform_id",
    "company",
    "title",
    "family",
    "seniority",
    "location",
    "market",
    "modality",
    "technologies",
    "first_published",
    "url",
    "status",
    "evidence_url",
    "evidence",
    "canonical_id",
)
COVERAGE_COLUMNS = ("platform", "status", "reported_count", "extracted_count")
HISTORY_COLUMNS = ("id", "period_start", "period_end", "value", "source_url")


def connect(database=DATABASE, **kwargs):
    dsn = os.getenv("DATABASE_URL")
    if dsn:
        return psycopg.connect(dsn, row_factory=dict_row, connect_timeout=5, **kwargs)
    return psycopg.connect(
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        dbname=database,
        user=os.getenv("POSTGRES_USER", "workforce"),
        password=os.getenv("POSTGRES_PASSWORD"),
        row_factory=dict_row,
        connect_timeout=5,
        **kwargs,
    )


def init_db():
    # Docker only honors POSTGRES_DB during first initialization. An existing
    # volume may still contain the previous database named "workforce".
    if not os.getenv("DATABASE_URL"):
        with connect("postgres", autocommit=True) as conn:
            conn.execute("SELECT pg_advisory_lock(120261125)")
            if not conn.execute(
                "SELECT 1 FROM pg_database WHERE datname = %s", (DATABASE,)
            ).fetchone():
                conn.execute(
                    sql.SQL("CREATE DATABASE {}").format(sql.Identifier(DATABASE))
                )

    with connect() as conn:
        conn.execute("CREATE SCHEMA IF NOT EXISTS workforce")
        conn.execute("""
            CREATE TABLE IF NOT EXISTS workforce.schema_migration (
                name text PRIMARY KEY,
                applied_at timestamptz NOT NULL DEFAULT now()
            )
        """)
    for path in sorted((ROOT / "database" / "migrations").glob("*.sql")):
        # The first version of 001 created only the extension and schema.
        # Record the consolidated version separately so existing databases run it once.
        name = path.name
        if name == "001_initial_schema.sql":
            name = "001_initial_schema.sql@2"
        with connect() as conn:
            conn.execute("SELECT pg_advisory_xact_lock(220261125)")
            if conn.execute(
                "SELECT 1 FROM workforce.schema_migration WHERE name = %s", (name,)
            ).fetchone():
                continue
            script = path.read_text(encoding="utf-8")
            body = script.split("BEGIN;", 1)[1].rsplit("COMMIT;", 1)[0]
            conn.execute(body, prepare=False)
            conn.execute(
                "INSERT INTO workforce.schema_migration (name) VALUES (%s)",
                (name,),
            )

    seed = json.loads((PACKAGE / "initial_data.json").read_text(encoding="utf-8"))
    for run in seed["runs"]:
        save_run(run)
    for source in seed["historical"]:
        save_historical(source)


def content_hash(value):
    canonical = json.dumps(
        value, sort_keys=True, ensure_ascii=False, separators=(",", ":")
    )
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def values(row, columns):
    return tuple(row[column] for column in columns)


def extras(row, columns):
    return Jsonb({key: value for key, value in row.items() if key not in columns})


def insert_statement(table, columns, conflict=False):
    statement = sql.SQL("INSERT INTO workforce.{} ({}) VALUES ({})").format(
        sql.Identifier(table),
        sql.SQL(", ").join(map(sql.Identifier, columns)),
        sql.SQL(", ").join(sql.Placeholder() for _ in columns),
    )
    return statement + sql.SQL(" ON CONFLICT DO NOTHING") if conflict else statement


def save_run(run):
    validate_run(run)
    digest = content_hash(run)
    with connect() as conn:
        inserted = conn.execute(
            """
            INSERT INTO workforce.capture
                (run_id, capture_date, observed_at, methodology_version, payload_hash)
            VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING
            RETURNING run_id
        """,
            (
                *values(run, ("run_id", "date", "observed_at", "methodology_version")),
                digest,
            ),
        ).fetchone()
        if not inserted:
            old = conn.execute(
                "SELECT payload_hash FROM workforce.capture WHERE run_id = %s",
                (run["run_id"],),
            ).fetchone()
            if old["payload_hash"] != digest:
                raise Conflict(
                    "El run_id ya existe con contenido distinto. Use otro run_id."
                )
            return {"idempotent": True, "run_id": run["run_id"]}

        with conn.cursor() as cursor:
            cursor.executemany(
                insert_statement(
                    "platform_capture", ("run_id", *COVERAGE_COLUMNS, "audit")
                ),
                [
                    (
                        run["run_id"],
                        *values(c, COVERAGE_COLUMNS),
                        extras(c, COVERAGE_COLUMNS),
                    )
                    for c in run["coverage"]
                ],
            )
            cursor.executemany(
                insert_statement("listing", ("platform", "platform_id"), conflict=True),
                sorted(
                    values(record, ("platform", "platform_id"))
                    for record in run["records"]
                ),
            )
            cursor.executemany(
                insert_statement("observation", ("run_id", *RECORD_COLUMNS, "details")),
                [
                    (
                        run["run_id"],
                        *values(r, RECORD_COLUMNS),
                        extras(r, RECORD_COLUMNS),
                    )
                    for r in run["records"]
                ],
            )
    return {"idempotent": False, "run_id": run["run_id"]}


def historical_row(row):
    details = row.pop("details")
    return {
        **details,
        **row,
        "period_start": row["period_start"].isoformat(),
        "period_end": row["period_end"].isoformat(),
        "value": int(row["value"]) if row["value"] % 1 == 0 else float(row["value"]),
    }


def save_historical(source):
    validate_historical(source)
    with connect() as conn:
        inserted = conn.execute(
            insert_statement(
                "historical_source", (*HISTORY_COLUMNS, "details"), conflict=True
            )
            + sql.SQL(" RETURNING id"),
            (*values(source, HISTORY_COLUMNS), extras(source, HISTORY_COLUMNS)),
        ).fetchone()
        if not inserted:
            row = conn.execute(
                "SELECT * FROM workforce.historical_source WHERE id = %s",
                (source["id"],),
            ).fetchone()
            if historical_row(row) != source:
                raise Conflict("El id histórico ya existe con contenido distinto.")
    return {"idempotent": not bool(inserted), "id": source["id"]}


def read_state(conn=None):
    if conn is None:
        with connect() as connection:
            connection.execute(
                "SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY"
            )
            return read_state(connection)

    runs = {}
    for row in conn.execute("""
        SELECT run_id, capture_date, observed_at, methodology_version
        FROM workforce.capture
        ORDER BY observed_at, run_id
    """):
        runs[row["run_id"]] = {
            "run_id": row["run_id"],
            "date": row["capture_date"].isoformat(),
            "observed_at": row["observed_at"].isoformat(),
            "methodology_version": row["methodology_version"],
            "coverage": [],
            "records": [],
        }
    for row in conn.execute(
        "SELECT * FROM workforce.platform_capture ORDER BY run_id, platform"
    ):
        runs[row.pop("run_id")]["coverage"].append({**row.pop("audit"), **row})
    for row in conn.execute(
        "SELECT * FROM workforce.observation ORDER BY run_id, platform, platform_id"
    ):
        record = {**row.pop("details"), **row}
        if record["first_published"] is not None:
            record["first_published"] = record["first_published"].isoformat()
        runs[record.pop("run_id")]["records"].append(record)
    historical = [
        historical_row(row)
        for row in conn.execute(
            "SELECT * FROM workforce.historical_source ORDER BY period_start, id"
        )
    ]
    reviews = [
        dict(row["report"], generated_at=row["generated_at"].isoformat())
        for row in conn.execute(
            "SELECT * FROM workforce.weekly_report ORDER BY period_start"
        )
    ]
    return {"runs": list(runs.values()), "historical": historical, "reviews": reviews}


def save_weekly(start, end):
    with connect() as conn:
        conn.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ")
        state = read_state(conn)
        for review in state["reviews"]:
            if (review["period_start"], review["period_end"]) == (start, end):
                return review
        report = weekly_report(state, start, end)
        row = conn.execute(
            """
            INSERT INTO workforce.weekly_report (period_start, period_end, report)
            VALUES (%s, %s, %s) RETURNING generated_at
        """,
            (start, end, Jsonb(report)),
        ).fetchone()
        return dict(report, generated_at=row["generated_at"].isoformat())
