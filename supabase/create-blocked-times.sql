-- ============================================================
-- Create blocked_times table for persistent storage
-- ============================================================
-- Previously stored in-memory (lost on each serverless invocation)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS public.blocked_times (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL DEFAULT '*',
  "dayOfWeek" INTEGER DEFAULT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (service_role bypasses)
ALTER TABLE public.blocked_times ENABLE ROW LEVEL SECURITY;

-- Migrate any existing in-memory data is not possible,
-- admin will need to re-add blocked slots after running this.
