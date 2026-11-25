-- ============================================================================
-- Sidhartha Research
-- Analysis of the technology labor market in México 2025–2026
-- PostgreSQL Schema
-- Version: 2.0
--
-- Methodological principle:
--
-- This database is intentionally scoped to the workforce project.
-- =============================================================================


BEGIN;

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 2. SCHEMAS
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS workforce;

-- ============================================================================
-- 3. TABLES AND INDEXES
-- ============================================================================

CREATE TABLE IF NOT EXISTS workforce.capture (
    run_id text PRIMARY KEY,
    capture_date date NOT NULL,
    observed_at timestamptz NOT NULL,
    methodology_version text NOT NULL,
    payload_hash text NOT NULL,
    ingested_at timestamptz NOT NULL DEFAULT now(),
    CHECK (
        capture_date = (observed_at AT TIME ZONE 'America/Mexico_City')::date
    )
);

CREATE INDEX IF NOT EXISTS capture_date_idx ON workforce.capture (
    capture_date, observed_at
);

CREATE TABLE IF NOT EXISTS workforce.platform_capture (
    run_id text NOT NULL REFERENCES workforce.capture (run_id),
    platform text NOT NULL CHECK (
        platform IN ('Indeed', 'OCC', 'Get on Board', 'Wellfound', 'LinkedIn')
    ),
    status text NOT NULL CHECK (
        status IN ('completa', 'parcial', 'bloqueada', 'pendiente')
    ),
    reported_count integer CHECK (reported_count >= 0),
    extracted_count integer NOT NULL CHECK (extracted_count >= 0),
    audit jsonb NOT NULL,
    PRIMARY KEY (run_id, platform)
);

CREATE TABLE IF NOT EXISTS workforce.listing (
    platform text NOT NULL,
    platform_id text NOT NULL,
    PRIMARY KEY (platform, platform_id)
);

CREATE TABLE IF NOT EXISTS workforce.observation (
    run_id text NOT NULL,
    platform text NOT NULL,
    platform_id text NOT NULL,
    company text NOT NULL,
    title text NOT NULL,
    family text NOT NULL,
    seniority text NOT NULL,
    location text NOT NULL,
    market text NOT NULL,
    modality text NOT NULL,
    technologies text ARRAY NOT NULL,
    first_published date,
    url text NOT NULL,
    status text NOT NULL CHECK (
        status IN ('activa', 'cerrada', 'no_verificable')
    ),
    evidence_url text NOT NULL,
    evidence text NOT NULL,
    canonical_id text,
    details jsonb NOT NULL,
    PRIMARY KEY (run_id, platform, platform_id),
    FOREIGN KEY (run_id, platform) REFERENCES workforce.platform_capture (
        run_id, platform
    ),
    FOREIGN KEY (platform, platform_id) REFERENCES workforce.listing (
        platform, platform_id
    )
);

CREATE INDEX IF NOT EXISTS observation_listing_idx ON workforce.observation (
    platform, platform_id
);
CREATE INDEX IF NOT EXISTS observation_publication_idx
ON workforce.observation (first_published);

CREATE TABLE IF NOT EXISTS workforce.historical_source (
    id text PRIMARY KEY,
    period_start date NOT NULL,
    period_end date NOT NULL,
    value numeric NOT NULL CHECK (value >= 0),
    source_url text NOT NULL,
    details jsonb NOT NULL,
    CHECK (period_start <= period_end)
);

CREATE TABLE IF NOT EXISTS workforce.weekly_report (
    period_start date NOT NULL,
    period_end date NOT NULL,
    generated_at timestamptz NOT NULL DEFAULT now(),
    report jsonb NOT NULL,
    PRIMARY KEY (period_start, period_end),
    CHECK (period_start <= period_end)
);

COMMIT;
