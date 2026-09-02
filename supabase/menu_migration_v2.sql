-- =============================================
-- OMOI Menu System — Migration V2
-- Neue Karte: 1·ESSEN  2·SÜSSES  3·GETRÄNKE
-- Im Supabase SQL Editor ausführen.
-- Ersetzt die komplette Karte (menu_categories + menu_items).
-- Muss zum MENU_DATA_FALLBACK in app/(customer)/page.tsx passen.
-- =============================================

-- Alte Karte komplett leeren (Items via CASCADE)
TRUNCATE menu_items, menu_categories RESTART IDENTITY CASCADE;

-- ══════════ Kategorien ══════════
-- sort_order: 1x = ESSEN, 2x = SÜSSES, 3x = GETRÄNKE
INSERT INTO menu_categories (slug, label, note, sort_order) VALUES
  ('hiraki',        'Hiraki 開き',                         'Set: 3 St 9,9 € · 5 St 15,9 € · 9 St 25,9 € (Premium +2 €/Set) | Einzeln 3,9 € · Premium 6,9 €. Jedes Hiraki mit eigenem Finish, in zwei Bissen.', 10),
  ('small-bites',   'Small Bites',                          NULL, 11),
  ('onigirazu',     'O·MO·I Signature Onigirazu',           'Basis: Nori · Sushireis mit Sesam · Salat · Gurke · Sushireis · Nori', 12),
  ('boosts',        'House Boosts · Extra',                 NULL, 13),
  ('bowls',         'O·MO·I Bowls',                         'Basis: Sushireis · Salat · Avocado · Gurke · Kimchi · Nori · Kirschtomaten · Edamame · Mais', 14),
  ('extra-protein', 'Extra Protein',                        NULL, 15),
  ('yakumi',        'Yakumi-Topping',                       NULL, 16),
  ('tteok',         'Butter Tteok',                         'Warm, buttrig, auf die Hand. Tteok: Vanille · Schokolade | Saucen: Tiramisu Cream · Matcha Cream', 20),
  ('crepes',        'Crêpes',                               'Drei Sorten, gerollt, auf die Hand.', 21),
  ('matcha',        'Iced Matcha & Hojicha Ceremonial',     'mit Agaven-Sirup | Milch: Kuhmilch · Hafermilch · Kokosmilch', 30),
  ('lemonade',      'Lemonade & Water',                     NULL, 31),
  ('juice',         'Slow-Juice Bar',                       '0,3 l', 32),
  ('freshblend',    'Fresh Blend',                          '0,3 l', 33),
  ('wein-glas',     'Wein vom Herzogenberg · Im Glas 0,2 l','Weingut Wöhrwag · Untertürkheim · zehn Minuten von hier', 34),
  ('wein-flaschen', 'Wein · Flaschen White / Rosé',         'Preise: Flasche / Glas 0,2 l', 35),
  ('wein-rot',      'Wein · Flaschen Red',                  'Preise: Flasche / Glas 0,2 l', 36),
  ('sekt',          'Kessler Sekt',                         'Preise: Flasche / Glas 0,2 l', 37),
  ('bier',          'Bier',                                 NULL, 38),
  ('coffee',        'Coffee',                               'Milch: Kuhmilch · Hafermilch · Kokosmilch', 39),
  ('tea',           'Tea',                                  NULL, 40)
ON CONFLICT (slug) DO NOTHING;

-- ══════════ 1 · ESSEN ══════════

-- ─── Hiraki ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Spicy Salmon',     'Spicy Mayo · Togarashi',        '3,90', 1),
  ('Tuna',             'Goldfire',                      '3,90', 2),
  ('Tempura Shrimp',   'Yuzu-Kosho-Mayo',               '3,90', 3),
  ('Chicken',          'Teriyaki',                      '3,90', 4),
  ('Smash Avocado 🌱', 'Shoyu Glaze · Miso-Butter',     '3,90', 5),
  ('Crab ⭐',          'Mentaiko-Mayo · Tobiko',        '3,90', 6),
  ('Mushroom 🌱',      'Shoyu Glaze · Miso-Butter',     '3,90', 7),
  ('Omelette',         'Furikake · Smoked Salt',        '3,90', 8),
  ('Crispy Tofu 🌱',   'Shoyu Glaze · Miso-Butter',     '3,90', 9),
  ('Scallop 👑',       'Jakobsmuschel · Yuzu-Butter',   '6,90', 10),
  ('BBQ Eel 👑',       'gegrillt · Sansho',             '6,90', 11),
  ('Ember Beef 👑 ⭐', 'Entrecôte · Pepper Glaze',      '6,90', 12),
  ('Chef''s Choice ⭐','Tagesempfehlung des Küchenchefs','3,90', 13)
) AS v(name, description, price, sort_order)
WHERE slug = 'hiraki';

-- ─── Small Bites ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Edamame',          NULL,          '3,90', 1),
  ('Kimchi',           NULL,          '3,90', 2),
  ('Gyoza',            NULL,          '5,00', 3),
  ('Teriyaki Chicken', NULL,          '5,00', 4),
  ('Tempura Shrimp',   NULL,          '5,00', 5),
  ('All-Bites',        'alle fünf',   '18,00', 6)
) AS v(name, description, price, sort_order)
WHERE slug = 'small-bites';

-- ─── Onigirazu ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Signature',                          'Lachstatar · Tamago-Ei · Avocado',                        '7,00', 1),
  ('Hot Red Tuna',                       'gekochter Thunfisch · Spicy Mayo',                        '8,50', 2),
  ('Okinawa Classic',                    'Frühstücksfleisch · Spicy Mayo',                          '5,50', 3),
  ('Slow Grill Chicken',                 'Hühnerbrustfilet · Tomaten · Teriyaki-Soße',              '7,50', 4),
  ('Teriyaki Grilled Dry-Aged Salmon',   'Lachs-Steak · Togarashi · O·MO·I Goldfire',               '9,50', 5),
  ('Kani-Kama',                          'Surimi Mix · Mentaiko Mayo',                              '6,50', 6),
  ('Super Mario 🌱 ⭐',                  'Buchenpilze · Kräuterseitlinge · Shoyu Glaze · Miso-Butter','7,00', 7)
) AS v(name, description, price, sort_order)
WHERE slug = 'onigirazu';

-- ─── House Boosts · Extra ───
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, v.name, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Spicy Mayo',                 '+0,80', 1),
  ('Shoyu Glaze & Miso-Butter',  '+1,00', 2),
  ('Mentaiko Mayo',              '+1,50', 3),
  ('O·MO·I Goldfire',            '+1,50', 4),
  ('Lime-Peanut-Butter',         '+2,50', 5),
  ('All-in Sauces',              '+5,00', 6)
) AS v(name, price, sort_order)
WHERE slug = 'boosts';

-- ─── Bowls ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Crispy O·MO·I',            'Gegrilltes Hühnerbrustfilet · Teriyaki-Soße',                 '12,90', 1),
  ('Salmon Rubies',           'Lachs · Spicy-Mayo',                                          '11,90', 2),
  ('Beef Embers ⭐',          'Entrecôte · Pepper-Sauce',                                    '15,90', 3),
  ('Fired Tuna',              'Langsam gegarter Thunfisch · O·MO·I Goldfire',                '13,90', 4),
  ('Midori Otah Veggie 🌱',   'Buchenpilze · Kräuterseitlinge · Shoyu Glaze',                '10,90', 5),
  ('Tori Crunch – no rice ⭐','gezupftes Hähnchen · Dunkelglasnudeln · Lime-Peanut-Butter',  '13,90', 6),
  ('Tofu Aoi 🌱',             'Knuspriger Tofu · Shoyu Glaze',                               '10,90', 7),
  ('Dancing Snake ⭐⭐',      'gegrillter Süßwasser-Aal · Unagi Sauce',                      '17,90', 8)
) AS v(name, description, price, sort_order)
WHERE slug = 'bowls';

-- ─── Extra Protein ───
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, v.name, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Knuspriger Tofu', '+3,50', 1),
  ('Lachs',           '+5,50', 2),
  ('Thunfisch',       '+6,50', 3),
  ('Entrecôte',       '+9,50', 4)
) AS v(name, price, sort_order)
WHERE slug = 'extra-protein';

-- ─── Yakumi-Topping ───
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, v.name, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Edamame',        '+2,50', 1),
  ('Kimchi',         '+2,50', 2),
  ('Avocado',        '+3,50', 3),
  ('Nori-Streifen',  '+1,50', 4)
) AS v(name, price, sort_order)
WHERE slug = 'yakumi';

-- ══════════ 2 · SÜSSES ══════════

-- ─── Butter Tteok ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Solo',          NULL,               '1,50', 1),
  ('5er',           'inkl. 1 Sauce',    '6,50', 2),
  ('10er',          'inkl. 2 Saucen',   '12,00', 3),
  ('Weitere Sauce', NULL,               '+2,00', 4)
) AS v(name, description, price, sort_order)
WHERE slug = 'tteok';

-- ─── Crêpes ───
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, v.name, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Matcha',         '7,50', 1),
  ('Matcha Brûlée',  '7,50', 2),
  ('Crêpes Choco',   '7,50', 3)
) AS v(name, price, sort_order)
WHERE slug = 'crepes';

-- ══════════ 3 · GETRÄNKE ══════════

-- ─── Iced Matcha & Hojicha ───
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, v.name, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Velvet Matcha + Tiramisu',        '8,50', 1),
  ('Velvet Matcha + Banana Edition',  '8,50', 2),
  ('Misu Matcha Cloud',               '7,00', 3),
  ('Yuzu Matcha Cloud',               '7,00', 4),
  ('Matcha Classic HOT',              '5,50', 5),
  ('Hojicha HOT',                     '5,50', 6),
  ('Matcha Classic',                  '5,50', 7),
  ('Hojicha',                         '5,50', 8),
  ('Strawberry Matcha',               '5,50', 9),
  ('Mango Matcha',                    '5,50', 10)
) AS v(name, price, sort_order)
WHERE slug = 'matcha';

-- ─── Lemonade & Water ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Premium Tafelwasser', 'medium, still · 0,5 l',           '4,20', 1),
  ('DeTox Water',         'Gurke · Zitrone · Minze · 1,0 l', '7,50', 2),
  ('Passion Fruit',       'Maracuja-Nektar · Soda',          '5,50', 3),
  ('Yuzu Lemonade',       'Yuzu · Zitrone · Soda · Honig',   '5,50', 4),
  ('Passionate Mango',    'Maracuja · Mango-Nektar · Soda',  '5,50', 5),
  ('Orange Mint',         'Orangensaft · Minze · Soda',      '5,50', 6)
) AS v(name, description, price, sort_order)
WHERE slug = 'lemonade';

-- ─── Slow-Juice Bar ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Orange Juice',     'frisch gepresster Orangensaft',      '5,90', 1),
  ('Russian Roulette', 'täglich frisch',                     '5,00', 2),
  ('Golden Hour',      'Karotte · Apfel · Ingwer',           '5,50', 3),
  ('Green Glow',       'Apfel · Gurke · Ingwer · Zitrone',   '5,50', 4)
) AS v(name, description, price, sort_order)
WHERE slug = 'juice';

-- ─── Fresh Blend ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Watermelon Mint', 'Wassermelone · Minze · Zitrone', '5,90', 1)
) AS v(name, description, price, sort_order)
WHERE slug = 'freshblend';

-- ─── Wein · Im Glas 0,2 l ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Weissburgunder',    NULL,                          '6,50', 1),
  ('Rosa Cuvée Rosé',   NULL,                          '6,50', 2),
  ('Weinschorle',       'mit Rosé oder Weißwein',      '5,00', 3)
) AS v(name, description, price, sort_order)
WHERE slug = 'wein-glas';

-- ─── Wein · Flaschen White / Rosé (Flasche / Glas) ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Johanna Cuvée Weiss',                'unkompliziert · der Einstieg',                                '20,2 / 10,2', 1),
  ('Riesling „Alte Reben"',              'grüner Apfel · weißer Pfirsich',                              '20,5 / 10,5', 2),
  ('Weissburgunder trocken',             NULL,                                                          '20,5 / 10,5', 3),
  ('Rosa Cuvée Rosé',                    'Gewinner Rosé 2026 · Württemberger Weinmeisterschaft',        '20,2 / 10,2', 4),
  ('Riesling Kabinett Herzogenberg',     'feine Süße · unser Wein zu allem Scharfen',                   '25,0 / 15,0', 5),
  ('Kreiden.Stein Riesling „Goldkapsel"','das Aushängeschild des Hauses',                               '25,5 / 15,5', 6),
  ('Kreiden.Stein Grauburgunder',        'weich · rund',                                                '26,0 / 16,0', 7),
  ('Sauvignon Blanc Herzogenberg',       '93 Falstaff-Punkte · VDP erste Lage',                         '29,9 / 19,9', 8),
  ('Riesling GG Herzogenberg',           'Grosses Gewächs · Monopollage · die Spitze',                  '38,5 / 28,5', 9)
) AS v(name, description, price, sort_order)
WHERE slug = 'wein-flaschen';

-- ─── Wein · Flaschen Red (Flasche / Glas) ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('2022 Lemberger Herzogenberg', 'VDP erste Lage · unser einer Rote', '26,5 / 16,5', 1)
) AS v(name, description, price, sort_order)
WHERE slug = 'wein-rot';

-- ─── Kessler Sekt (Flasche / Glas) ───
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, v.name, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Rosé Hochgewächs',       '25,0 / 15,0', 1),
  ('Chardonnay Hochgewächs', '25,0 / 15,0', 2)
) AS v(name, price, sort_order)
WHERE slug = 'sekt';

-- ─── Bier ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Kirin', 'japanisches Bier · mild & erfrischend', '3,90', 1)
) AS v(name, description, price, sort_order)
WHERE slug = 'bier';

-- ─── Coffee ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Espresso',           NULL,                '2,20', 1),
  ('Espresso Doppio',    NULL,                '3,50', 2),
  ('Espresso Macchiato', NULL,                '2,90', 3),
  ('Iced Latte',         'mit Agaven-Sirup',  '3,90', 4),
  ('Flat White',         NULL,                '3,90', 5),
  ('Iced Americano',     'mit Agaven-Sirup',  '3,50', 6)
) AS v(name, description, price, sort_order)
WHERE slug = 'coffee';

-- ─── Tea ───
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, v.name, v.description, v.price, v.sort_order FROM menu_categories, (VALUES
  ('Against Cold',    'Ingwer · Limette · Honig · Jasmintee', '3,90', 1),
  ('Just Tea',        'Jasmintee',                            '3,90', 2),
  ('Orange Mint Tea', 'Minze · Orange · Honig',               '3,90', 3),
  ('Raw Ginger',      'Ingwer · Honig · Jasmintee',           '3,90', 4)
) AS v(name, description, price, sort_order)
WHERE slug = 'tea';
