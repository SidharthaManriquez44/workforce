"""
Contracts shared by imports, the scheduler and the dashboard.
"""

import json
import math
import re
from collections import Counter
from datetime import date, datetime
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

PACKAGE = Path(__file__).resolve().parents[1] / "files"
PROTOCOL = json.loads((PACKAGE / "protocol.json").read_text(encoding="utf-8"))
TZ = ZoneInfo(PROTOCOL["window"]["timezone"])
PLATFORMS = PROTOCOL["platforms"]
TERMS = {term for terms in PROTOCOL["families"].values() for term in terms}
IDENTIFIER = re.compile(r"[A-Za-z0-9][A-Za-z0-9._:-]{0,159}")


class Invalid(ValueError):
    pass


class Conflict(Invalid):
    pass


def require(condition, message):
    if not condition:
        raise Invalid(message)


def fields(value, names, label):
    require(isinstance(value, dict), f"{label}: se esperaba un objeto.")
    missing = set(names) - value.keys()
    require(not missing, f"{label}: faltan {', '.join(sorted(missing))}.")


def day(value):
    try:
        parsed = date.fromisoformat(value)
    except (ValueError, TypeError) as exc:
        raise Invalid("Se esperaba una fecha YYYY-MM-DD.") from exc
    require(parsed.isoformat() == value, "Se esperaba una fecha YYYY-MM-DD.")
    return parsed


def instant(value):
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (AttributeError, ValueError) as exc:
        raise Invalid("observed_at requiere fecha, hora y zona ISO 8601.") from exc
    require(parsed.utcoffset() is not None, "observed_at requiere zona horaria.")
    return parsed


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def strings(value):
    return isinstance(value, list) and all(nonempty(item) for item in value)


def url(value):
    if not nonempty(value) or any(character.isspace() for character in value):
        return False
    try:
        parsed = urlsplit(value)
        return (
            parsed.scheme in {"http", "https"}
            and bool(parsed.hostname)
            and parsed.username is None
            and parsed.password is None
        )
    except ValueError:
        return False


def count(value):
    return type(value) is int and value >= 0


def validate_run(run):
    fields(run, PROTOCOL["run_fields"], "Captura")
    require(
        nonempty(run["run_id"]) and IDENTIFIER.fullmatch(run["run_id"]),
        "run_id debe ser un identificador estable.",
    )
    captured = day(run["date"])
    require(
        PROTOCOL["window"]["start"] <= run["date"] <= PROTOCOL["window"]["end"],
        "La captura está fuera de la ventana del estudio.",
    )
    observed = instant(run["observed_at"])
    require(
        observed.astimezone(TZ).date() == captured, "date debe ser la fecha en México."
    )
    require(observed <= datetime.now(TZ), "observed_at está en el futuro.")
    require(
        run["methodology_version"] == PROTOCOL["version"],
        "La captura requiere la versión vigente del protocolo.",
    )
    require(isinstance(run["records"], list), "records debe ser una lista.")
    require(isinstance(run["coverage"], list), "coverage debe ser una lista.")

    identities = set()
    counts = Counter()
    for record in run["records"]:
        validate_record(record, captured)
        key = (record["platform"], record["platform_id"])
        require(key not in identities, f"Identidad repetida en la captura: {key}.")
        identities.add(key)
        counts[key[0]] += 1

    seen = set()
    for coverage in run["coverage"]:
        fields(coverage, PROTOCOL["coverage_fields"], "Cobertura")
        platform = coverage["platform"]
        require(
            platform in PLATFORMS and platform not in seen,
            "Plataforma repetida o inválida.",
        )
        seen.add(platform)
        require(
            coverage["status"] in ("completa", "parcial", "bloqueada", "pendiente"),
            f"Cobertura inválida: {platform}.",
        )
        for name in ("queries", "pages_reviewed", "source_urls"):
            require(
                strings(coverage[name]),
                f"{platform}: {name} debe ser una lista de texto.",
            )
        require(all(map(url, coverage["source_urls"])), f"{platform}: URL inválida.")
        require(
            isinstance(coverage["filters"], dict) and nonempty(coverage["reason"]),
            f"{platform}: faltan filtros o motivo de cobertura.",
        )
        reported = coverage["reported_count"]
        require(
            reported is None or count(reported), f"{platform}: reported_count inválido."
        )
        require(
            count(coverage["extracted_count"])
            and coverage["extracted_count"] == counts[platform],
            f"{platform}: extracted_count no coincide con las observaciones.",
        )
        if "search_results" in coverage:
            validate_search_results(coverage, identities)
        if "category_inventory" in coverage:
            validate_category_inventory(coverage)
        if "carried_forward_from" in coverage:
            previous = coverage["carried_forward_from"]
            require(
                nonempty(previous)
                and IDENTIFIER.fullmatch(previous)
                and previous != run["run_id"]
                and coverage["status"] in ("parcial", "bloqueada", "pendiente")
                and coverage["extracted_count"] == 0,
                f"{platform}: una referencia de cobertura requiere otra captura "
                "y no admite medición completa ni observaciones nuevas.",
            )
        if coverage["status"] == "completa":
            require(
                TERMS <= set(coverage["queries"])
                and coverage["pages_reviewed"]
                and coverage["source_urls"]
                and all(
                    nonempty(coverage["filters"].get(name))
                    for name in ("geography", "seniority", "date_filter")
                ),
                f"{platform}: cobertura completa exige todos los términos, "
                f"filtros y páginas.",
            )
    require(seen == set(PLATFORMS), "Registre una cobertura por cada plataforma.")
    return run


def validate_category_inventory(coverage):
    platform = coverage["platform"]
    inventory = coverage["category_inventory"]
    fields(
        inventory,
        ("name", "date_window", "source_url", "results"),
        f"{platform}: inventario de categoría",
    )
    results, reported = inventory["results"], coverage["reported_count"]
    require(
        coverage["status"] == "parcial"
        and coverage["extracted_count"] == 0
        and not coverage.get("carried_forward_from")
        and nonempty(inventory["name"])
        and nonempty(inventory["date_window"])
        and url(inventory["source_url"])
        and isinstance(results, list)
        and (reported is None or len(results) <= reported),
        f"{platform}: inventario de categoría inválido.",
    )
    identifiers = set()
    for result in results:
        fields(
            result,
            ("platform_id", "url", "publication_raw", "page"),
            f"{platform}: ficha de categoría",
        )
        identifier = result["platform_id"]
        require(
            nonempty(identifier)
            and identifier not in identifiers
            and url(result["url"])
            and nonempty(result["publication_raw"])
            and count(result["page"])
            and result["page"] > 0,
            f"{platform}: ficha inválida o ID repetido en el inventario de categoría.",
        )
        identifiers.add(identifier)


def validate_search_results(coverage, identities):
    platform = coverage["platform"]
    results = coverage["search_results"]
    require(isinstance(results, list), f"{platform}: listado de búsqueda inválido.")
    reported = coverage["reported_count"]
    require(
        reported is None or len(results) <= reported,
        f"{platform}: se recuperaron más fichas que las reportadas.",
    )
    identifiers, included = set(), set()
    for result in results:
        fields(
            result,
            ("platform_id", "title", "url", "in_scope", "scope_reason"),
            f"{platform}: resultado de búsqueda",
        )
        identifier = result["platform_id"]
        require(
            nonempty(identifier)
            and identifier not in identifiers
            and nonempty(result["title"])
            and url(result["url"])
            and type(result["in_scope"]) is bool
            and nonempty(result["scope_reason"]),
            f"{platform}: resultado inválido o ID repetido en el listado de búsqueda.",
        )
        identifiers.add(identifier)
        if result["in_scope"]:
            included.add((platform, identifier))
    require(
        included == {key for key in identities if key[0] == platform},
        f"{platform}: los IDs incluidos no coinciden con las fichas registradas.",
    )


def validate_record(record, captured):
    optional = {"application_url", "publication_evidence", "repost_evidence"}
    fields(record, set(PROTOCOL["record_fields"]) - optional, "Anuncio")
    for name in (
        "platform_id",
        "company",
        "title",
        "seniority",
        "seniority_basis",
        "location",
        "modality",
        "evidence",
        "publication_raw",
    ):
        require(nonempty(record[name]), f"Anuncio: {name} requiere texto.")
    require(record["platform"] in PLATFORMS, "Plataforma de anuncio inválida.")
    require(record["family"] in PROTOCOL["families"], "Especialidad inválida.")
    require(record["market"] in PROTOCOL["markets"], "Mercado inválido.")
    require(
        strings(record["technologies"]), "technologies debe ser una lista de texto."
    )
    require(
        url(record["url"]) and url(record["evidence_url"]),
        "URL de anuncio o evidencia inválida.",
    )
    require(record["status"] in PROTOCOL["status_values"], "Estado inválido.")
    require(record["event"] in PROTOCOL["event_values"], "Evento inválido.")
    precision = record["publication_precision"]
    require(precision in ("exacta", "relativa", "desconocida"), "Precisión inválida.")
    published = record["first_published"]
    if precision == "exacta":
        require(
            day(published) <= captured and nonempty(record.get("publication_evidence")),
            "Fecha exacta requiere evidencia de primera publicación "
            "anterior o igual a la captura.",
        )
    else:
        require(published is None, "Conserve las fechas no exactas en publication_raw.")
    if record["status"] == "activa":
        require(
            url(record.get("application_url")),
            "Una vacante activa exige URL de postulación.",
        )
    if record["event"] == "nueva_confirmada":
        require(precision == "exacta", "Nueva confirmada exige fecha original exacta.")
    if record["event"] == "republicacion_confirmada":
        require(
            nonempty(record.get("repost_evidence")), "Falta evidencia de republicación."
        )
    if record["canonical_id"] is not None:
        require(
            nonempty(record["canonical_id"]) and nonempty(record["dedup_evidence"]),
            "Un grupo compartido exige evidencia de identidad entre plataformas.",
        )


def validate_historical(source):
    comparison_fields = {"methodology_version", "valid_days"}
    fields(
        source,
        set(PROTOCOL["historical_fields"]) - comparison_fields,
        "Fuente histórica",
    )
    start, end = day(source["period_start"]), day(source["period_end"])
    retrieved = day(source["retrieved_at"])
    require(
        start.year == end.year == 2025 and start <= end,
        "La fuente debe cubrir un periodo de 2025.",
    )
    require(
        end <= retrieved <= datetime.now(TZ).date(), "Fecha de recuperación inválida."
    )
    for name in (
        "id",
        "platform",
        "geography",
        "family",
        "metric",
        "unit",
        "source_title",
        "methodology",
        "coverage",
        "limitation",
    ):
        require(nonempty(source[name]), f"Fuente histórica: {name} requiere texto.")
    value = source["value"]
    require(
        type(value) in (int, float) and 0 <= value < math.inf,
        "Valor histórico inválido.",
    )
    require(url(source["source_url"]), "URL histórica inválida.")
    require(
        source["source_type"] in PROTOCOL["historical_source_types"],
        "Tipo de fuente inválido.",
    )
    require(
        source["comparability"]
        in ("comparable", "contexto", "no_comparable", "pendiente"),
        "Equivalencia histórica inválida.",
    )
    if source["comparability"] == "comparable":
        require(
            source.get("methodology_version") == PROTOCOL["version"]
            and source["platform"] in PLATFORMS
            and source["geography"] in PROTOCOL["markets"][:2]
            and source["family"] in PROTOCOL["families"]
            and source["metric"] == PROTOCOL["comparison_metric"]
            and source["unit"] == PROTOCOL["comparison_unit"]
            and count(value)
            and count(source.get("valid_days"))
            and source["valid_days"] == (end - start).days + 1
            and [
                start.replace(year=2026).isoformat(),
                end.replace(year=2026).isoformat(),
            ]
            in PROTOCOL["cuts"],
            "Comparación directa exige una ventana equivalente "
            "y cobertura completa documentada.",
        )
    return source
