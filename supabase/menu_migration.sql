-- =============================================
-- OMOI Menu System — Supabase Migration
-- =============================================

-- Menu Categories (Coffee, Matcha, Onigirazu, Bowls, Desserts)
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  note TEXT DEFAULT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "categoryId" UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT NULL,
  price TEXT NOT NULL,
  allergens TEXT DEFAULT NULL,
  tags TEXT[] DEFAULT '{}',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items("categoryId");
CREATE INDEX IF NOT EXISTS idx_menu_categories_sort ON menu_categories("sortOrder");
CREATE INDEX IF NOT EXISTS idx_menu_items_sort ON menu_items("sortOrder");

-- Seed default categories
INSERT INTO menu_categories (slug, label, note, "sortOrder") VALUES
  ('coffee',     'Coffee',             NULL, 1),
  ('matcha',     'Matcha & Hojicha',   NULL, 2),
  ('onigirazu',  'Signature Onigirazu', 'Sushireis, Salat, Avocado, Gurke, Kim Chi, Nori, Edamame', 3),
  ('bowls',      'O·MO·I Bowls',       'Sushireis, Salat, Avocado, Gurke, Kim Chi, Nori, Edamame', 4),
  ('desserts',   'Signature Desserts',  'Kuchen wechseln täglich — schaut an der Vitrine!', 5)
ON CONFLICT (slug) DO NOTHING;

-- Seed menu items
-- Coffee
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Espresso', NULL, '3,00', 1 FROM menu_categories WHERE slug = 'coffee'
ON CONFLICT DO NOTHING;
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Flat White', NULL, '4,50', 2 FROM menu_categories WHERE slug = 'coffee'
ON CONFLICT DO NOTHING;
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Cappuccino', NULL, '4,00', 3 FROM menu_categories WHERE slug = 'coffee'
ON CONFLICT DO NOTHING;
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Filter Coffee', NULL, '3,50', 4 FROM menu_categories WHERE slug = 'coffee'
ON CONFLICT DO NOTHING;

-- Matcha
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Matcha HOT', 'Ceremonial Grade', '5,50', 1 FROM menu_categories WHERE slug = 'matcha'
ON CONFLICT DO NOTHING;
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Velvet Matcha', 'mit Tiramisu', '6,50', 2 FROM menu_categories WHERE slug = 'matcha'
ON CONFLICT DO NOTHING;
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Yuzu Matcha Cloud', 'erfrischend', '6,50', 3 FROM menu_categories WHERE slug = 'matcha'
ON CONFLICT DO NOTHING;
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Hojicha Latte', NULL, '5,50', 4 FROM menu_categories WHERE slug = 'matcha'
ON CONFLICT DO NOTHING;

-- Onigirazu
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Hot Red Tuna 🌶', 'Scharfer Thunfisch, Spicy Mayo', '12,50', 1 FROM menu_categories WHERE slug = 'onigirazu'
ON CONFLICT DO NOTHING;
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Teriyaki Dry-Aged Salmon', 'glasierter Lachs, Teriyaki Glaze', '13,90', 2 FROM menu_categories WHERE slug = 'onigirazu'
ON CONFLICT DO NOTHING;
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Super Mario 🌱', 'Avocado, Shiitake, Edamame', '10,90', 3 FROM menu_categories WHERE slug = 'onigirazu'
ON CONFLICT DO NOTHING;
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Chicken Katsu', 'paniertes Hähnchen, Tonkatsu Sauce', '12,50', 4 FROM menu_categories WHERE slug = 'onigirazu'
ON CONFLICT DO NOTHING;

-- Bowls
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Salmon Bowl', 'Teriyaki Lachs, Avocado', '13,90', 1 FROM menu_categories WHERE slug = 'bowls'
ON CONFLICT DO NOTHING;
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Tuna Bowl', 'Scharfer Thunfisch, Mango', '13,90', 2 FROM menu_categories WHERE slug = 'bowls'
ON CONFLICT DO NOTHING;
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Chicken Bowl', 'Teriyaki Hähnchen', '12,50', 3 FROM menu_categories WHERE slug = 'bowls'
ON CONFLICT DO NOTHING;
INSERT INTO menu_items ("categoryId", name, description, price, "sortOrder")
SELECT id, 'Tofu Aoi 🌱', 'knuspriger Tofu, Shoyu Glaze', '10,90', 4 FROM menu_categories WHERE slug = 'bowls'
ON CONFLICT DO NOTHING;

-- Desserts
INSERT INTO menu_items ("categoryId", name, description, price, allergens, "sortOrder")
SELECT id, 'Matcha Tiramisu', NULL, '6,50', 'a, c, g', 1 FROM menu_categories WHERE slug = 'desserts'
ON CONFLICT DO NOTHING;
