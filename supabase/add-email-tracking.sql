-- ============================================================
-- Add email tracking columns to bookings table
-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS "reminderSentAt" TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS "feedbackSentAt" TIMESTAMPTZ DEFAULT NULL;
