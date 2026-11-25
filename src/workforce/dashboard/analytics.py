"""
Coverage-aware counts for the live dashboard and frozen weekly reports.
"""

from collections import Counter, defaultdict
from datetime import datetime, timedelta

from ..contracts import PLATFORMS, PROTOCOL, TZ, day, instant

FILTERS = ("platform", "family", "market", "seniority", "modality", "status")
PENDING = "Elegibilidad pendiente"


def dates_between(start, end):
    start, end = day(start), day(end)
    return [
        (start + timedelta(days=i)).isoformat() for i in range((end - start).days + 1)
    ]


def identity(record):
    return record["platform"], record["platform_id"]


def opportunity(record):
    return (
        ("canonical", record["canonical_id"])
        if record["canonical_id"]
        else identity(record)
    )


def matches(record, filters):
    return all(not filters.get(key) or record[key] == filters[key] for key in FILTERS)


def analyze(state, filters=None, as_of=None):
    filters = filters or {}
    as_of = as_of or datetime.now(TZ).date().isoformat()
    start = filters.get("from") or PROTOCOL["window"]["start"]
    end = min(filters.get("to") or PROTOCOL["window"]["end"], as_of)
    selected_platforms = [filters["platform"]] if filters.get("platform") else PLATFORMS
    runs = sorted(
        state["runs"], key=lambda run: (instant(run["observed_at"]), run["run_id"])
    )

    daily_records = defaultdict(dict)
    daily_coverage = defaultdict(dict)
    first, canonical, latest_coverage = {}, {}, {}
    selected_runs = []
    for run in runs:
        captured = run["date"]
        if captured > as_of:
            continue
        for record in run["records"]:
            key = identity(record)
            first.setdefault(key, captured)
            if record["canonical_id"]:
                canonical[key] = record
            if start <= captured <= end:
                daily_records[captured][key] = dict(
                    record,
                    observed_at=run["observed_at"],
                    observation_date=captured,
                    first_observed=first[key],
                )
        if start <= captured <= end:
            selected_runs.append(run)
            for coverage in run["coverage"]:
                item = dict(coverage, date=captured, observed_at=run["observed_at"])
                daily_coverage[captured][coverage["platform"]] = item
                latest_coverage[coverage["platform"]] = item

    for records in daily_records.values():
        for key, record in records.items():
            if key in canonical:
                record["canonical_id"] = canonical[key]["canonical_id"]
                record["dedup_evidence"] = canonical[key]["dedup_evidence"]

    latest, publications, unresolved_days = {}, {}, set()
    for captured in sorted(daily_records):
        for key, record in daily_records[captured].items():
            latest[key] = record

    # A later inspection can establish the original publication date. Attribute it
    # to that date even when it was verified after the selected publication window.
    base_observations, known_originals = {}, {}
    for run in runs:
        if run["date"] > as_of:
            continue
        for record in run["records"]:
            key = identity(record)
            if record["first_published"]:
                known_originals.setdefault(key, record["first_published"])
                if record["event"] == "nueva_confirmada":
                    base_observations.setdefault(key, record)
    for key, original in base_observations.items():
        record = latest.get(key, original)
        if record["market"] == PENDING or not matches(record, filters):
            continue
        group = opportunity(canonical.get(key, record))
        published = original["first_published"]
        publications[group] = min(published, publications.get(group, published))

    for captured, records in daily_records.items():
        for key, record in records.items():
            if (
                record["market"] != PENDING
                and matches(record, filters)
                and record["first_observed"] == captured
                and record["event"] != "republicacion_confirmada"
                and key not in base_observations
                and (key not in known_originals or known_originals[key] >= start)
            ):
                unresolved_days.add(captured)

    rows = [record for record in latest.values() if matches(record, filters)]
    eligible = [record for record in rows if record["market"] != PENDING]
    dates = dates_between(start, end)
    last_day = selected_runs[-1]["date"] if selected_runs else None
    coverage = [
        latest_coverage.get(
            platform,
            {
                "platform": platform,
                "status": "pendiente",
                "reason": "Sin captura en el rango",
            },
        )
        for platform in selected_platforms
    ]
    series = []
    for captured in dates:
        coverage_today = daily_coverage[captured]
        complete = sum(
            coverage_today.get(platform, {}).get("status") == "completa"
            for platform in selected_platforms
        )
        observed_today = [
            record
            for record in daily_records[captured].values()
            if record["market"] != PENDING and matches(record, filters)
        ]
        verified = [
            record for record in observed_today if record["status"] != "no_verificable"
        ]
        docs = sum(published == captured for published in publications.values())
        series.append(
            {
                "date": captured,
                "covered_platforms": complete,
                "total_platforms": len(selected_platforms),
                "observed": len(observed_today)
                if observed_today or complete == len(selected_platforms)
                else None,
                "active": len(
                    {opportunity(r) for r in verified if r["status"] == "activa"}
                )
                if verified
                or (complete == len(selected_platforms) and not observed_today)
                else None,
                "documented_new": docs
                if docs
                or (
                    complete == len(selected_platforms)
                    and captured not in unresolved_days
                )
                else None,
                "valid": complete == len(selected_platforms),
            }
        )

    weekly = []
    for cut_start, cut_end in PROTOCOL["cuts"]:
        if cut_end < start or cut_start > (
            filters.get("to") or PROTOCOL["window"]["end"]
        ):
            continue
        days = [item for item in series if cut_start <= item["date"] <= cut_end]
        elapsed = len(days)
        valid_dates = {item["date"] for item in days if item["valid"]}
        range_start, range_end = max(cut_start, start), min(cut_end, end)
        documented = sum(range_start <= p <= range_end for p in publications.values())
        valid_publications = sum(p in valid_dates for p in publications.values())
        comparable = (
            elapsed
            and len(valid_dates) == elapsed
            and unresolved_days.isdisjoint(valid_dates)
        )
        weekly.append(
            {
                "start": cut_start,
                "end": cut_end,
                "captures": sum(
                    cut_start <= run["date"] <= cut_end for run in selected_runs
                ),
                "valid_days": len(valid_dates),
                "elapsed_days": elapsed,
                "new": documented if documented or comparable else None,
                "daily_mean": valid_publications / len(valid_dates)
                if comparable
                else None,
                "coverage_pct": round(
                    100
                    * sum(d["covered_platforms"] for d in days)
                    / (elapsed * len(selected_platforms)),
                    2,
                )
                if elapsed
                else None,
            }
        )

    last_series = next((item for item in series if item["date"] == last_day), {})
    full_coverage = bool(series) and all(item["valid"] for item in series)
    documented_in_range = sum(
        start <= published <= end for published in publications.values()
    )
    return {
        "rows": rows,
        "coverage": coverage,
        "series": series,
        "weekly": weekly,
        "distribution": {
            dimension: Counter(record[dimension] for record in eligible)
            for dimension in (
                "platform",
                "family",
                "seniority",
                "location",
                "modality",
                "status",
            )
        }
        | {
            "technologies": Counter(
                tech for r in eligible for tech in set(r["technologies"])
            )
        },
        "metrics": {
            "observed": len(eligible),
            "groups": len({opportunity(record) for record in eligible}),
            "pending_market": len(rows) - len(eligible),
            "active": last_series.get("active"),
            "new": documented_in_range
            if documented_in_range or (full_coverage and not unresolved_days)
            else None,
            "coverage_complete": sum(c["status"] == "completa" for c in coverage),
            "coverage_total": len(coverage),
            "last_day": last_day,
            "reposts": sum(r["event"] == "republicacion_confirmada" for r in eligible),
            "dedup_pending": sum(not r["canonical_id"] for r in eligible),
        },
    }


def comparisons(state):
    output = []
    for source in state["historical"]:
        if source["comparability"] != "comparable":
            continue
        start, end = (
            day(source[key]).replace(year=2026).isoformat()
            for key in ("period_start", "period_end")
        )
        weekly = analyze(
            state,
            {
                "from": start,
                "to": end,
                "platform": source["platform"],
                "family": source["family"],
                "market": source["geography"],
            },
        )["weekly"]
        if not weekly:
            continue
        result = weekly[0]
        current = result["daily_mean"]
        if current is None or result["valid_days"] != source["valid_days"]:
            continue
        previous = source["value"] / source["valid_days"]
        output.append(
            {
                "id": source["id"],
                "platform": source["platform"],
                "family": source["family"],
                "market": source["geography"],
                "start": start,
                "end": end,
                "previous": previous,
                "current": current,
                "valid_days": source["valid_days"],
                "change_pct": (current / previous - 1) * 100 if previous else None,
                "source_url": source["source_url"],
            }
        )
    return output


def weekly_report(state, start, end):
    data = analyze(state, {"from": start, "to": end})
    summary = data["weekly"][0]
    by_platform = {
        platform: analyze(state, {"from": start, "to": end, "platform": platform})[
            "weekly"
        ][0]
        for platform in PLATFORMS
    }
    daily_mean = summary["daily_mean"]
    rate = f"{daily_mean:.2f} publicaciones/día" if daily_mean is not None else "N/D"
    return {
        "id": f"semanal-{end}",
        "period_start": start,
        "period_end": end,
        "summary": (
            f"{summary['valid_days']}/{summary['elapsed_days']} "
            f"días con las cinco plataformas "
            f"completas. Promedio diario: {rate}."
        ),
        "metrics": data["metrics"],
        "weekly": summary,
        "by_platform": by_platform,
        "daily": data["series"],
        "distribution": data["distribution"],
        "comparisons_2025": [item for item in comparisons(state) if item["end"] == end],
        "historical_source_ids": [item["id"] for item in state["historical"]],
        "source_urls": sorted(
            {
                source
                for run in state["runs"]
                if start <= run["date"] <= end
                for c in run["coverage"]
                for source in c["source_urls"]
            }
        ),
    }
