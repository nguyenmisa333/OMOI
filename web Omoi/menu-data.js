// O·MO·I Menu Data — extracted from OMOI_Speisekarte_A3_beidseitig_V3.pdf
const MENU_DATA = [
  {
    id: "coffee", label: "Coffee",
    items: [
      { name: "Espresso", price: "2,20" },
      { name: "Espresso Macchiato", price: "2,90" },
      { name: "Cappuccino", price: "3,90" },
      { name: "Iced Latte", price: "3,90" },
      { name: "Flat White", price: "3,90" },
      { name: "Americano", price: "3,30" },
      { name: "Heiße Schokolade", price: "4,50" },
      { name: "Latte Macchiato", price: "4,90" },
    ],
    note: "Standard: Kuhmilch | Alternative: Hafermilch, Kokosmilch"
  },
  {
    id: "tea", label: "Tea",
    items: [
      { name: "Against Cold", desc: "Ingwer, Limette, Honig, Jasmintee", price: "4,20" },
      { name: "Just Tea", desc: "Jasmintee", price: "3,90" },
      { name: "Orange Mint", desc: "Frische Minze, Orange, Honig", price: "4,20" },
      { name: "Raw Ginger", desc: "Ingwer, Honig, Jasmintee", price: "3,90" },
    ]
  },
  {
    id: "matcha", label: "Iced Matcha & Hojicha Ceremonial",
    items: [
      { name: "Velvet Matcha + Tiramisu", price: "9,00" },
      { name: "Matcha Classic HOT", price: "4,50" },
      { name: "Hojicha HOT", price: "5,20" },
      { name: "Matcha Classic", price: "4,50" },
      { name: "Hojicha", price: "4,90" },
      { name: "Strawberry Matcha", price: "5,50" },
      { name: "Mango Matcha", price: "5,50" },
      { name: "Misu Matcha Cloud", price: "7,00" },
      { name: "Yuzu Matcha Cloud", price: "7,00" },
      { name: "Velvet Matcha + Banana Edition", price: "9,00" },
    ],
    note: "Standard: Kuhmilch & Agaven-Sirup | Alternative: Hafermilch, Kokosmilch"
  },
  {
    id: "juice", label: "Slow-Juice Bar",
    items: [
      { name: "DetoX Green Glow", desc: "Apfel, Gurke, Ingwer, Zitrone", price: "5,50" },
      { name: "Golden Hour", desc: "Karotte, Apfel, Ingwer", price: "5,50" },
      { name: "Russian Roulette", desc: "täglich frisch", price: "5,90" },
      { name: "Orange Juice", desc: "frisch gepresster Orangensaft", price: "5,90" },
    ],
    note: "0,3 l"
  },
  {
    id: "lemonade", label: "Lemonade & Water",
    items: [
      { name: "Premium Tafelwasser", desc: "medium, still · 0,5 l", price: "4,20" },
      { name: "DeTox Water", desc: "Gurke, Zitrone, Minze · 1,0 l", price: "7,50" },
      { name: "Yuzu Lemonade", desc: "Yuzu, Zitrone, Soda, Honig", price: "5,50" },
      { name: "Passionate Mango", desc: "Maracuja, Mango, Minze, Soda", price: "5,50" },
      { name: "Passion Fruit", desc: "Maracuja-Nektar, Soda", price: "5,50" },
      { name: "Orangeade", desc: "Orangeade, Soda", price: "5,50" },
    ]
  },
  {
    id: "freshblends", label: "Fresh Blends",
    items: [
      { name: "Strawberry Shine", desc: "Erdbeere, Soda, Blüten", price: "5,90" },
      { name: "Watermelon Mint", desc: "Wassermelone, Minze, Zitrone", price: "5,90" },
    ]
  },
  {
    id: "bubbles", label: "Bubbles · Wines",
    items: [
      { name: "Aperol Sour", price: "10,90" },
      { name: "Lillet Peach", price: "7,90" },
      { name: "Aperol", price: "7,90" },
      { name: "Espresso Martini", price: "12,00" },
    ],
    subitems: [
      { label: "Wöhrwag · Kessler", items: [
        { name: "Weißburgunder", desc: "0,2l / 0,75l", price: "6,40 / 22,90" },
        { name: "Rosé", desc: "0,2l / 0,75l", price: "6,50 / 22,00" },
        { name: "Chardonnay", desc: "0,1l / 0,75l", price: "5,90 / 22,00" },
      ]}
    ]
  },
  {
    id: "lunch", label: "Lunch",
    items: [
      { name: "3 Stücke + Iced Drink", desc: "DI – SA · 12 – 15 UHR", price: "12,90" },
      { name: "3 Stücke + Glas Wein", desc: "DI – SA · 12 – 15 UHR", price: "13,90" },
    ],
    note: "Drei Stücke, ein Glas. Mittags aus der Hand. Alle Sorten frei mischbar · Premium +2 pro Stück"
  },
  {
    id: "hiraki", label: "Hiraki 開き",
    sets: [
      { name: "3x Rolls", price: "9,90" },
      { name: "6x Rolls", price: "18,90" },
      { name: "9x Rolls", price: "35,90" },
    ],
    items: [
      { name: "Tuna", desc: "Goldfire", price: "3,90" },
      { name: "Salmon", desc: "Spicy Mayo", price: "3,90" },
      { name: "Chicken", desc: "Teriyaki", price: "3,90" },
      { name: "Kani", desc: "Mentaiko-Mayo", price: "3,90" },
      { name: "Mushroom 🌱", desc: "Shoyu · Miso-Butter · Vegan", price: "3,90" },
      { name: "Tamago", desc: "Smoked Salt", price: "3,90" },
      { name: "Hotate 👑", desc: "Yuzu-Butter", price: "6,90", premium: true },
      { name: "Unagi 👑", desc: "Unagi-Glaze", price: "6,90", premium: true },
      { name: "Ember Beef 👑", desc: "Entrecôte · Pepper Glaze", price: "6,90", premium: true },
    ],
    note: "Neun offene Stücke — nimm drei, nimm sechs. Jedes mit eigenem Finish — aus der Hand, in zwei Bissen. Pro Stück 3,90 · Premium 6,90"
  },
  {
    id: "hiraki-week", label: "Hiraki Week",
    items: [
      { name: "1 Stück + Iced Drink", desc: "Täglich · Ganztags · bis 16.08", price: "7,90" },
      { name: "2 Stücke + Glas Wein", desc: "Täglich · Ganztags · bis 16.08", price: "9,90" },
    ],
    note: "Sorten: Chicken · Mushroom · Tamago · Kani"
  },
  {
    id: "tteok", label: "Butter Tteok",
    items: [
      { name: "Solo", desc: "1 Stück · Vani oder Schoko · Glutenfrei", price: "1,50" },
      { name: "5er", desc: "5 Stücke · Vani oder Schoko · Glutenfrei", price: "6,50" },
      { name: "10er", desc: "10 Stücke · Vani oder Schoko · Glutenfrei", price: "12,00" },
    ],
    subitems: [
      { label: "Soße +2,00", items: [
        { name: "Tiramisu Soße", desc: "Perfekt mit Schoko Tteok", price: "+2,00" },
        { name: "Pistazien Matcha Soße", desc: "Perfekt mit Vani Tteok", price: "+2,00" },
      ]}
    ],
    note: "Warm. Buttrig. Auf die Hand. Ab heute · Frisch vom Griddle"
  },
  {
    id: "crepes", label: "Japanese Crêpes",
    items: [
      { name: "Matcha", desc: "Matcha-Creme · Erdbeeren · Blaubeeren", price: "7,50" },
      { name: "Matcha Brûlée", desc: "Knackig karamellisiert · Sesam", price: "7,00" },
      { name: "Crêpes Choco", desc: "Schoko · Banane · Beeren", price: "7,00" },
      { name: "crêpes choco", desc: "Schoko · Banane · Beeren", price: "6,50" },
      { name: "matcha brûlée", desc: "Knackig karamellisiert · Sesam", price: "6,50" },
      { name: "matcha", desc: "Matcha-Creme · Erdbeeren · Blaubeeren", price: "6,50" },
    ],
    note: "Drei Sorten. Gerollt. Auf die Hand."
  },
  {
    id: "onigirazu", label: "O·MO·I Signature Onigirazu",
    items: [
      { name: "Hot Red Tuna", desc: "gekochter Thunfisch, Spicy-Mayo", price: "8,50" },
      { name: "Okinawa Classic", desc: "Frühstücksfleisch, Spicy-Mayo", price: "5,50" },
      { name: "Teriyaki Grilled Dry-Aged Salmon", desc: "Lachs-Steak, Togarashi, O·MO·I Goldfire", price: "9,50" },
      { name: "Kani-Kama", desc: "Surimi Mix, Mentaiko-Mayo", price: "6,50" },
      { name: "Slow Grill Chicken", desc: "Hühnerbrustfilet, Tomaten, Teriyaki-Soße", price: "7,50" },
      { name: "Super Mario", desc: "Buchenpilze, Tomaten, Kräuterseitlinge, Shoyu Glaze & Miso-Butter", price: "7,00" },
    ],
    note: "Base 7,0 € — Nori, Sushireis mit Sesam, Salat, Lachstatar, Tamago-Ei, Avocado, Gurkenscheiben"
  },
  {
    id: "boosts", label: "HOUSE Boosts · Extra",
    items: [
      { name: "Spicy Mayo", price: "+0,80" },
      { name: "Shoyu Glaze inklusive Miso-Butter", price: "+1,00" },
      { name: "Mentaiko Mayo", price: "+1,50" },
      { name: "O·MO·I Goldfire", price: "+1,50" },
      { name: "Lime-Peanut-Butter", price: "+2,50" },
      { name: "All-in Sauce", price: "+5,00" },
    ]
  },
  {
    id: "bowls", label: "O·MO·I Bowls",
    items: [
      { name: "Salmon Rubies", desc: "Lachs, Kirschtomaten, Spicy-Mayo", price: "11,90" },
      { name: "Midori Otah Veggie 🌱", desc: "Buchenpilze, Kräuterseitlinge, Shoyu Glaze", price: "10,90" },
      { name: "Fired Tuna", desc: "Sous-Vide-Thunfisch, O·MO·I Goldfire", price: "13,90" },
      { name: "Crispy O·MO·I", desc: "gegrilltes Hähnchenbrustfilet, Teriyaki-Soße", price: "12,90" },
      { name: "Beef Embers", desc: "Entrecôte, Pepper-Sauce", price: "15,90" },
      { name: "Tori Crunch – no rice", desc: "gegrilltes Hähnchen, Dunkel Sojasoße, Lime-Peanut-Butter", price: "13,90" },
      { name: "Tofu Aoi 🌱", desc: "knuspriger Tofu, Shoyu Glaze", price: "10,90" },
    ],
    note: "Crafted with Heart — Sushireis, Salat, Avocado, Gurke, Kim Chi, Nori, Kirschtomaten, Edamame"
  },
  {
    id: "protein", label: "Protein · Yakumi-Topping",
    items: [
      { name: "knuspriger Tofu", price: "+3,50" },
      { name: "Lachs", price: "+5,50" },
      { name: "Thunfisch", price: "+6,50" },
      { name: "Entrecôte", price: "+9,50" },
      { name: "Edamame", price: "+2,50" },
      { name: "Kimchi", price: "+2,50" },
      { name: "Avocado", price: "+3,50" },
      { name: "Nori-Streifen", price: "+1,50" },
    ]
  },
  {
    id: "desserts", label: "Signature Desserts & Daily Bake",
    items: [
      { name: "Matcha Tiramisu", price: "6,50" },
    ],
    note: "Unsere Signatures bleiben. Unsere Kuchen wechseln täglich. Kommt einfach an die Bar und schaut, was heute frisch in der Vitrine steht!"
  },
];

// Group categories for desktop tabs
const TAB_GROUPS = [
  { label: "Drinks", categories: ["coffee", "tea"] },
  { label: "Matcha & Hojicha", categories: ["matcha"] },
  { label: "Juice & Lemonade", categories: ["juice", "lemonade", "freshblends"] },
  { label: "Bubbles & Wines", categories: ["bubbles"] },
  { label: "Lunch", categories: ["lunch"] },
  { label: "Hiraki", categories: ["hiraki"] },
  { label: "Hiraki Week", categories: ["hiraki-week"] },
  { label: "Butter Tteok", categories: ["tteok"] },
  { label: "Crêpes", categories: ["crepes"] },
  { label: "Onigirazu", categories: ["onigirazu", "boosts"] },
  { label: "Bowls", categories: ["bowls", "protein"] },
  { label: "Desserts", categories: ["desserts"] },
];

// ─── Render helpers ───
function menuRowHTML(item) {
  const desc = item.desc ? `<span class="menu-row__desc">${item.desc}</span>` : '';
  return `<div class="menu-row">
    <span class="menu-row__name">${item.name}${desc}</span>
    <span class="menu-row__price">${item.price} €</span>
  </div>`;
}

function renderAccordion() {
  const container = document.getElementById('menu-accordion');
  if (!container) return;
  container.innerHTML = MENU_DATA.map(cat => `
    <div class="accordion-item">
      <button class="accordion-btn">
        <span>${cat.label}</span>
        <span class="material-symbols-outlined">expand_more</span>
      </button>
      <div class="accordion-body">
        <div class="accordion-body__inner">
          ${cat.note ? `<p class="menu-note">${cat.note}</p>` : ''}
          ${cat.items.map(menuRowHTML).join('')}
          ${cat.subitems ? cat.subitems.map(sub => `
            <p class="menu-note" style="margin-top:12px;font-style:normal;font-weight:600">${sub.label}</p>
            ${sub.items.map(menuRowHTML).join('')}
          `).join('') : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function renderTabs() {
  const bar = document.getElementById('tab-bar');
  const contents = document.getElementById('tab-contents');
  if (!bar || !contents) return;

  bar.innerHTML = TAB_GROUPS.map((g, i) =>
    `<button class="tab-btn${i === 0 ? ' active' : ''}" data-tab="tab-${i}">${g.label}</button>`
  ).join('');

  contents.innerHTML = TAB_GROUPS.map((g, i) => {
    const cats = g.categories.map(id => MENU_DATA.find(c => c.id === id)).filter(Boolean);
    const inner = cats.map(cat => `
      <div style="margin-bottom:32px">
        <div class="tab-category">${cat.label}</div>
        ${cat.note ? `<p class="menu-note" style="margin-bottom:12px">${cat.note}</p>` : ''}
        <div class="tab-grid">${cat.items.map(item => `
          <div class="menu-row">
            <span class="menu-row__name">${item.name}${item.desc ? `<span class="menu-row__desc">${item.desc}</span>` : ''}</span>
            <span class="menu-row__leader"></span>
            <span class="menu-row__price">${item.price} €</span>
          </div>
        `).join('')}</div>
        ${cat.subitems ? cat.subitems.map(sub => `
          <div class="tab-category" style="margin-top:16px">${sub.label}</div>
          <div class="tab-grid">${sub.items.map(item => `
            <div class="menu-row">
              <span class="menu-row__name">${item.name}${item.desc ? `<span class="menu-row__desc">${item.desc}</span>` : ''}</span>
              <span class="menu-row__leader"></span>
              <span class="menu-row__price">${item.price} €</span>
            </div>
          `).join('')}</div>
        `).join('') : ''}
      </div>
    `).join('');
    return `<div class="tab-content${i === 0 ? ' active' : ''}" id="tab-${i}">${inner}</div>`;
  }).join('');
}

// Render on load
renderAccordion();
renderTabs();
