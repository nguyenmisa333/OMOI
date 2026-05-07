-- ============================================================
-- Enable Row Level Security (RLS) on ALL public tables
-- ============================================================
-- Since the app only uses SUPABASE_SERVICE_ROLE_KEY (which
-- bypasses RLS), no permissive policies are needed.
-- This effectively BLOCKS all direct access via the anon key
-- while keeping server-side API routes fully functional.
--
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 2. customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 3. tables
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;

-- 4. booking_tables
ALTER TABLE public.booking_tables ENABLE ROW LEVEL SECURITY;

-- 5. menu_items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- 6. pre_orders
ALTER TABLE public.pre_orders ENABLE ROW LEVEL SECURITY;

-- 7. staff
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- 8. app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- 9. waitlist
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- 10. promo_codes
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- 11. reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- Optional: Read-only policy for public-facing data
-- ============================================================
-- If you ever need the anon key to read settings or menu items
-- (e.g. for a static site or edge function), uncomment below:
--
-- CREATE POLICY "Allow public read on app_settings"
--   ON public.app_settings
--   FOR SELECT
--   USING (true);
--
-- CREATE POLICY "Allow public read on menu_items"
--   ON public.menu_items
--   FOR SELECT
--   USING (true);
-- ============================================================
