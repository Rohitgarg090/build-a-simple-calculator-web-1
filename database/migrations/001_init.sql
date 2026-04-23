-- ============================================================
-- SpecKAI — Calculator App Initial Migration
-- NOTE: This migration is OPTIONAL. The core calculator app
-- works entirely client-side with no database required.
-- Only run this if you plan to add server-side history.
-- ============================================================

-- Enable pgcrypto for cuid-like ID generation (optional)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS calculation_history (
  id          TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  expression  TEXT        NOT NULL,
  result      TEXT        NOT NULL,
  session_id  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT calculation_history_pkey PRIMARY KEY (id)
);

-- Index for fast lookup by session
CREATE INDEX IF NOT EXISTS idx_calculation_history_session_id
  ON calculation_history (session_id);

-- Index for chronological ordering
CREATE INDEX IF NOT EXISTS idx_calculation_history_created_at
  ON calculation_history (created_at DESC);

COMMENT ON TABLE calculation_history IS
  'Optional server-side log of calculator expressions and their results.';
expression IS
  'Full arithmetic expression string, e.g. 12 + 34 * 2';
result IS
  'Evaluated result as a string to preserve precision display';
session_id IS
  'Browser or anonymous session identifier for grouping history';