-- =============================================
-- OMOI Menu System — Supabase Migration
-- =============================================

-- Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  note TEXT DEFAULT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT NULL,
  price TEXT NOT NULL,
  allergens TEXT DEFAULT NULL,
  tags TEXT[] DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_sort ON menu_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort ON menu_items(sort_order);

-- Seed default categories
INSERT INTO menu_categories (slug, label, note, sort_order) VALUES
  ('coffee',     'Coffee',              'Standard: Kuhmilch | Alternative: Hafermilch, Kokosmilch', 1),
  ('matcha',     'Iced Matcha & Hojicha Ceremonial', 'Standard: Kuhmilch & Agaven-Sirup | Alternative: Hafermilch, Kokosmilch', 2),
  ('onigirazu',  'O·MO·I Signature Onigirazu', 'Base 7,0 € — Nori, Sushireis, Salat, Lachstatar, Tamago-Ei, Avocado', 3),
  ('bowls',      'O·MO·I Bowls',        'Sushireis, Salat, Avocado, Gurke, Kim Chi, Nori, Edamame', 4),
  ('desserts',   'Signature Desserts',   'Kuchen wechseln täglich — schaut an der Vitrine!', 5)
ON CONFLICT (slug) DO NOTHING;

-- ─── Coffee ───
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, 'Espresso',           '2,20', 1 FROM menu_categories WHERE slug = 'coffee';
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, 'Espresso Macchiato', '2,90', 2 FROM menu_categories WHERE slug = 'coffee';
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, 'Cappuccino',         '3,90', 3 FROM menu_categories WHERE slug = 'coffee';
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, 'Iced Latte',         '3,90', 4 FROM menu_categories WHERE slug = 'coffee';
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, 'Flat White',         '3,90', 5 FROM menu_categories WHERE slug = 'coffee';
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, 'Americano',          '3,30', 6 FROM menu_categories WHERE slug = 'coffee';
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, 'Heiße Schokolade',   '4,50', 7 FROM menu_categories WHERE slug = 'coffee';
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, 'Latte Macchiato',    '4,90', 8 FROM menu_categories WHERE slug = 'coffee';

-- ─── Matcha ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Velvet Matcha + Tiramisu', NULL, '9,00', 1 FROM menu_categories WHERE slug = 'matcha';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Matcha Classic HOT', NULL, '4,50', 2 FROM menu_categories WHERE slug = 'matcha';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Hojicha HOT',        NULL, '5,20', 3 FROM menu_categories WHERE slug = 'matcha';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Matcha Classic',     NULL, '4,50', 4 FROM menu_categories WHERE slug = 'matcha';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Strawberry Matcha',  NULL, '5,50', 5 FROM menu_categories WHERE slug = 'matcha';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Mango Matcha',       NULL, '5,50', 6 FROM menu_categories WHERE slug = 'matcha';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Misu Matcha Cloud',  NULL, '7,00', 7 FROM menu_categories WHERE slug = 'matcha';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Yuzu Matcha Cloud',  NULL, '7,00', 8 FROM menu_categories WHERE slug = 'matcha';

-- ─── Onigirazu ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Hot Red Tuna',                    'gekochter Thunfisch, Spicy-Mayo',               '8,50', 1 FROM menu_categories WHERE slug = 'onigirazu';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Okinawa Classic',                  'Frühstücksfleisch, Spicy-Mayo',                 '5,50', 2 FROM menu_categories WHERE slug = 'onigirazu';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Teriyaki Grilled Dry-Aged Salmon', 'Lachs-Steak, Togarashi',                       '9,50', 3 FROM menu_categories WHERE slug = 'onigirazu';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Kani-Kama',                        'Surimi Mix, Mentaiko-Mayo',                     '6,50', 4 FROM menu_categories WHERE slug = 'onigirazu';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Slow Grill Chicken',               'Hühnerbrustfilet, Teriyaki-Soße',               '7,50', 5 FROM menu_categories WHERE slug = 'onigirazu';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Super Mario',                      'Buchenpilze, Kräuterseitlinge, Miso-Butter',    '7,00', 6 FROM menu_categories WHERE slug = 'onigirazu';

-- ─── Bowls ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Salmon Rubies',      'Lachs, Kirschtomaten, Spicy-Mayo',     '11,90', 1 FROM menu_categories WHERE slug = 'bowls';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Midori Otah Veggie 🌱', 'Buchenpilze, Shoyu Glaze',          '10,90', 2 FROM menu_categories WHERE slug = 'bowls';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Fired Tuna',         'Sous-Vide-Thunfisch, Goldfire',        '13,90', 3 FROM menu_categories WHERE slug = 'bowls';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Crispy O·MO·I',      'gegrilltes Hähnchen, Teriyaki',        '12,90', 4 FROM menu_categories WHERE slug = 'bowls';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Beef Embers',        'Entrecôte, Pepper-Sauce',              '15,90', 5 FROM menu_categories WHERE slug = 'bowls';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Tofu Aoi 🌱',       'knuspriger Tofu, Shoyu Glaze',          '10,90', 6 FROM menu_categories WHERE slug = 'bowls';

-- ─── Desserts ───
INSERT INTO menu_items (category_id, name, price, allergens, sort_order)
SELECT id, 'Matcha Tiramisu', '6,50', 'a, c, g', 1 FROM menu_categories WHERE slug = 'desserts';
