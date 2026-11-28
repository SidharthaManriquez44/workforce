import json
import unittest
from copy import deepcopy

from src.workforce.contracts import (
    PACKAGE,
    PROTOCOL,
    TERMS,
    Invalid,
    validate_historical,
    validate_run,
)
from src.workforce.dashboard.analytics import analyze, comparisons

SEED = json.loads((PACKAGE / "initial_data.json").read_text(encoding="utf-8"))


def capture(day, status="completa", records=None, suffix=""):
    run = deepcopy(SEED["runs"][0])
    run.update(
        run_id=f"{day}-{suffix or 'test'}", date=day, observed_at=day + "T21:00:00Z"
    )
    run["records"] = records or []
    for coverage in run["coverage"]:
        platform = coverage["platform"]
        coverage.update(
            status=status,
            queries=sorted(TERMS),
            extracted_count=sum(
                record["platform"] == platform for record in run["records"]
            ),
            pages_reviewed=["1"],
        )
    return run


def listing(published, **changes):
    record = deepcopy(SEED["runs"][0]["records"][0])
    record.update(
        first_published=published,
        publication_raw=published,
        publication_precision="exacta",
        publication_evidence="Fecha original publicada por el ATS.",
        event="nueva_confirmada",
    )
    record.update(changes)
    return record


class AnalyticsTests(unittest.TestCase):
    def test_initial_data_is_auditable_and_partial(self):
        validate_run(SEED["runs"][0])
        validate_historical(SEED["historical"][0])
        result = analyze(SEED, as_of="2026-11-25")
        self.assertEqual(result["metrics"]["observed"], 4)
        self.assertIsNone(result["metrics"]["active"])
        self.assertIsNone(result["weekly"][0]["daily_mean"])
        self.assertEqual(comparisons(SEED), [])

    def test_complete_zero_differs_from_missing_day(self):
        state = {"runs": [capture("2026-11-25")]}
        result = analyze(state, as_of="2026-11-26")
        self.assertEqual(result["series"][0]["documented_new"], 0)
        self.assertIsNone(result["series"][1]["documented_new"])
        self.assertEqual(result["weekly"][0]["valid_days"], 1)
        self.assertEqual(result["weekly"][0]["elapsed_days"], 2)
        self.assertIsNone(result["weekly"][0]["daily_mean"])

    def test_occ_followup_keeps_original_coverage_for_other_platforms(self):
        original = capture("2026-11-25")
        followup = capture(
            "2026-11-26",
            status="parcial",
            records=[
                listing(
                    None,
                    platform="OCC",
                    publication_raw="Hoy",
                    publication_precision="relativa",
                    event="primera_observacion",
                )
            ],
        )
        for item in followup["coverage"]:
            if item["platform"] != "OCC":
                item["carried_forward_from"] = original["run_id"]

        validate_run(followup)
        state = {"runs": [original, followup]}
        result = analyze(state, as_of="2026-11-26")
        coverage_by_platform = {item["platform"]: item for item in result["coverage"]}
        self.assertEqual(result["distribution"]["platform"]["OCC"], 1)
        self.assertIsNone(result["metrics"]["new"])
        self.assertEqual(coverage_by_platform["OCC"]["date"], "2026-11-26")
        self.assertEqual(coverage_by_platform["Indeed"]["date"], "2026-11-25")
        indeed = analyze(state, {"platform": "Indeed"}, as_of="2026-11-26")
        self.assertEqual(indeed["metrics"]["last_day"], "2026-11-25")
        self.assertEqual(indeed["weekly"][0]["captures"], 1)

    def test_late_evidence_counts_as_original_day_and_deduplicates(self):
        state = {
            "runs": [
                capture("2026-11-25"),
                capture(
                    "2026-11-26",
                    records=[
                        listing(
                            "2026-11-25", canonical_id="ATS-1", dedup_evidence="ATS-1"
                        ),
                        listing(
                            "2026-11-25",
                            platform="LinkedIn",
                            platform_id="123",
                            canonical_id="ATS-1",
                            dedup_evidence="ATS-1",
                        ),
                    ],
                ),
            ]
        }
        selected = analyze(state, {"to": "2026-11-25"}, as_of="2026-11-26")
        self.assertEqual(selected["series"][0]["documented_new"], 1)
        self.assertEqual(selected["weekly"][0]["daily_mean"], 1)

    def test_category_inventory_has_its_own_count_and_coverage(self):
        original = capture("2026-11-25")
        audit = capture("2026-11-26", status="parcial")
        for item in audit["coverage"]:
            if item["platform"] != "OCC":
                item["carried_forward_from"] = original["run_id"]
                continue
            item["reported_count"] = 1
            item["category_inventory"] = {
                "name": "TI y Sistemas",
                "date_window": "Hace 2 días",
                "source_url": "https://example.org/it",
                "results": [
                    {
                        "platform_id": "123",
                        "url": "https://example.org/123",
                        "publication_raw": "Ayer",
                        "page": 1,
                    }
                ],
            }

        validate_run(audit)
        state = {"runs": [original, audit]}
        result = analyze(state, {"platform": "OCC"}, as_of="2026-11-26")
        self.assertEqual(result["category_inventories"][0]["reported_count"], 1)
        self.assertEqual(result["coverage"][0]["date"], "2026-11-25")
        self.assertEqual(result["weekly"][0]["captures"], 1)
        self.assertEqual(result["metrics"]["observed"], 0)

        occ = next(c for c in audit["coverage"] if c["platform"] == "OCC")
        occ["reported_count"] = 2
        rows = occ["category_inventory"]["results"]
        rows.append(dict(rows[0]))
        with self.assertRaisesRegex(Invalid, "ID repetido"):
            validate_run(audit)

    def test_revalidation_preserves_history_and_does_not_carry_active_forward(self):
        active = listing(
            "2026-11-25", status="activa", application_url="https://example.org/apply"
        )
        state = {
            "runs": [
                capture("2026-11-25", records=[active]),
                capture("2026-11-26", status="parcial"),
                capture(
                    "2026-11-27",
                    records=[dict(active, status="cerrada", event="conocida")],
                ),
            ]
        }
        result = analyze(state, as_of="2026-11-27")
        self.assertEqual([day["active"] for day in result["series"]], [1, None, 0])
        self.assertEqual(result["rows"][0]["status"], "cerrada")
        self.assertEqual(result["rows"][0]["first_observed"], "2026-11-25")

    def test_pending_eligibility_is_visible_and_excluded_from_metrics(self):
        state = {
            "runs": [
                capture(
                    "2026-11-25",
                    records=[
                        listing("2026-11-25", market="Elegibilidad pendiente"),
                    ],
                )
            ]
        }
        result = analyze(state, as_of="2026-11-25")
        self.assertEqual(len(result["rows"]), 1)
        self.assertEqual(result["metrics"]["observed"], 0)
        self.assertEqual(result["weekly"][0]["daily_mean"], 0)

    def test_unknown_first_publication_blocks_the_mean(self):
        record = SEED["runs"][0]["records"][0]
        state = {"runs": [capture("2026-11-25", records=[record])]}
        result = analyze(state, as_of="2026-11-25")
        self.assertIsNone(result["weekly"][0]["daily_mean"])

    def test_last_cut_has_five_days(self):
        result = analyze({"runs": []}, as_of=PROTOCOL["window"]["end"])
        self.assertEqual([w["elapsed_days"] for w in result["weekly"]], [7, 7, 7, 5])

    def test_validation_rejects_unsupported_claims(self):
        run = deepcopy(SEED["runs"][0])
        run["records"][0]["status"] = "activa"
        with self.assertRaisesRegex(Invalid, "URL de postulación"):
            validate_run(run)
        run = deepcopy(SEED["runs"][0])
        run["coverage"][0]["status"] = "completa"
        with self.assertRaisesRegex(Invalid, "todos los términos"):
            validate_run(run)
        history = dict(SEED["historical"][0], comparability="comparable")
        with self.assertRaisesRegex(Invalid, "ventana equivalente"):
            validate_historical(history)


if __name__ == "__main__":
    unittest.main()
