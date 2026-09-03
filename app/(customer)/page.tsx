'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Fallback Menu Data ────────────────────────────────────────
const MENU_DATA_FALLBACK = [
  // ══════════ 1 · ESSEN ══════════
  {
    id: "hiraki", label: "Hiraki 開き",
    items: [
      { name: "Spicy Salmon", desc: "Spicy Mayo · Togarashi", price: "3,90" },
      { name: "Tuna", desc: "Goldfire", price: "3,90" },
      { name: "Tempura Shrimp", desc: "Yuzu-Kosho-Mayo", price: "3,90" },
      { name: "Chicken", desc: "Teriyaki", price: "3,90" },
      { name: "Smash Avocado 🌱", desc: "Shoyu Glaze · Miso-Butter", price: "3,90" },
      { name: "Crab ⭐", desc: "Mentaiko-Mayo · Tobiko", price: "3,90" },
      { name: "Mushroom 🌱", desc: "Shoyu Glaze · Miso-Butter", price: "3,90" },
      { name: "Omelette", desc: "Furikake · Smoked Salt", price: "3,90" },
      { name: "Crispy Tofu 🌱", desc: "Shoyu Glaze · Miso-Butter", price: "3,90" },
      { name: "Scallop 👑", desc: "Jakobsmuschel · Yuzu-Butter", price: "6,90" },
      { name: "BBQ Eel 👑", desc: "gegrillt · Sansho", price: "6,90" },
      { name: "Ember Beef 👑 ⭐", desc: "Entrecôte · Pepper Glaze", price: "6,90" },
      { name: "Chef's Choice ⭐", desc: "Tagesempfehlung des Küchenchefs", price: "3,90" },
    ],
    note: "Set: 3 St 9,9 € · 5 St 15,9 € · 9 St 25,9 € (Premium +2 €/Set) | Einzeln 3,9 € · Premium 6,9 €. Jedes Hiraki mit eigenem Finish, in zwei Bissen."
  },
  {
    id: "small-bites", label: "Small Bites",
    items: [
      { name: "Edamame", price: "3,90" },
      { name: "Kimchi", price: "3,90" },
      { name: "Gyoza", price: "5,00" },
      { name: "Teriyaki Chicken", price: "5,00" },
      { name: "Tempura Shrimp", price: "5,00" },
      { name: "All-Bites", desc: "alle fünf", price: "18,00" },
    ],
  },
  {
    id: "onigirazu", label: "O·MO·I Signature Onigirazu",
    items: [
      { name: "Signature", desc: "Lachstatar · Tamago-Ei · Avocado", price: "7,00" },
      { name: "Hot Red Tuna", desc: "gekochter Thunfisch · Spicy Mayo", price: "8,50" },
      { name: "Okinawa Classic", desc: "Frühstücksfleisch · Spicy Mayo", price: "5,50" },
      { name: "Slow Grill Chicken", desc: "Hühnerbrustfilet · Tomaten · Teriyaki-Soße", price: "7,50" },
      { name: "Teriyaki Grilled Dry-Aged Salmon", desc: "Lachs-Steak · Togarashi · O·MO·I Goldfire", price: "9,50" },
      { name: "Kani-Kama", desc: "Surimi Mix · Mentaiko Mayo", price: "6,50" },
      { name: "Super Mario 🌱 ⭐", desc: "Buchenpilze · Kräuterseitlinge · Shoyu Glaze · Miso-Butter", price: "7,00" },
    ],
    note: "Basis: Nori · Sushireis mit Sesam · Salat · Gurke · Sushireis · Nori"
  },
  {
    id: "boosts", label: "House Boosts · Extra",
    items: [
      { name: "Spicy Mayo", price: "+0,80" },
      { name: "Shoyu Glaze & Miso-Butter", price: "+1,00" },
      { name: "Mentaiko Mayo", price: "+1,50" },
      { name: "O·MO·I Goldfire", price: "+1,50" },
      { name: "Lime-Peanut-Butter", price: "+2,50" },
      { name: "All-in Sauces", price: "+5,00" },
    ],
  },
  {
    id: "bowls", label: "O·MO·I Bowls",
    items: [
      { name: "Crispy O·MO·I", desc: "Gegrilltes Hühnerbrustfilet · Teriyaki-Soße", price: "12,90" },
      { name: "Salmon Rubies", desc: "Lachs · Spicy-Mayo", price: "11,90" },
      { name: "Beef Embers ⭐", desc: "Entrecôte · Pepper-Sauce", price: "15,90" },
      { name: "Fired Tuna", desc: "Langsam gegarter Thunfisch · O·MO·I Goldfire", price: "13,90" },
      { name: "Midori Otah Veggie 🌱", desc: "Buchenpilze · Kräuterseitlinge · Shoyu Glaze", price: "10,90" },
      { name: "Tori Crunch – no rice ⭐", desc: "gezupftes Hähnchen · Dunkelglasnudeln · Lime-Peanut-Butter", price: "13,90" },
      { name: "Tofu Aoi 🌱", desc: "Knuspriger Tofu · Shoyu Glaze", price: "10,90" },
      { name: "Dancing Snake ⭐⭐", desc: "gegrillter Süßwasser-Aal · Unagi Sauce", price: "17,90" },
    ],
    note: "Basis: Sushireis · Salat · Avocado · Gurke · Kimchi · Nori · Kirschtomaten · Edamame · Mais"
  },
  {
    id: "extra-protein", label: "Extra Protein",
    items: [
      { name: "Knuspriger Tofu", price: "+3,50" },
      { name: "Lachs", price: "+5,50" },
      { name: "Thunfisch", price: "+6,50" },
      { name: "Entrecôte", price: "+9,50" },
    ],
  },
  {
    id: "yakumi", label: "Yakumi-Topping",
    items: [
      { name: "Edamame", price: "+2,50" },
      { name: "Kimchi", price: "+2,50" },
      { name: "Avocado", price: "+3,50" },
      { name: "Nori-Streifen", price: "+1,50" },
    ],
  },

  // ══════════ 2 · SÜSSES ══════════
  {
    id: "tteok", label: "Butter Tteok",
    items: [
      { name: "Solo", price: "1,50" },
      { name: "5er", desc: "inkl. 1 Sauce", price: "6,50" },
      { name: "10er", desc: "inkl. 2 Saucen", price: "12,00" },
      { name: "Weitere Sauce", price: "+2,00" },
    ],
    note: "Warm, buttrig, auf die Hand. Tteok: Vanille · Schokolade | Saucen: Tiramisu Cream · Matcha Cream"
  },
  {
    id: "crepes", label: "Crêpes",
    items: [
      { name: "Matcha", price: "7,50" },
      { name: "Matcha Brûlée", price: "7,50" },
      { name: "Crêpes Choco", price: "7,50" },
    ],
    note: "Drei Sorten, gerollt, auf die Hand."
  },

  // ══════════ 3 · GETRÄNKE ══════════
  {
    id: "matcha", label: "Iced Matcha & Hojicha Ceremonial",
    items: [
      { name: "Velvet Matcha + Tiramisu", price: "8,50" },
      { name: "Velvet Matcha + Banana Edition", price: "8,50" },
      { name: "Misu Matcha Cloud", price: "7,00" },
      { name: "Yuzu Matcha Cloud", price: "7,00" },
      { name: "Matcha Classic HOT", price: "5,50" },
      { name: "Hojicha HOT", price: "5,50" },
      { name: "Matcha Classic", price: "5,50" },
      { name: "Hojicha", price: "5,50" },
      { name: "Strawberry Matcha", price: "5,50" },
      { name: "Mango Matcha", price: "5,50" },
    ],
    note: "mit Agaven-Sirup | Milch: Kuhmilch · Hafermilch · Kokosmilch"
  },
  {
    id: "lemonade", label: "Lemonade & Water",
    items: [
      { name: "Premium Tafelwasser", desc: "medium, still · 0,5 l", price: "4,20" },
      { name: "DeTox Water", desc: "Gurke · Zitrone · Minze · 1,0 l", price: "7,50" },
      { name: "Passion Fruit", desc: "Maracuja-Nektar · Soda", price: "5,50" },
      { name: "Yuzu Lemonade", desc: "Yuzu · Zitrone · Soda · Honig", price: "5,50" },
      { name: "Passionate Mango", desc: "Maracuja · Mango-Nektar · Soda", price: "5,50" },
      { name: "Orange Mint", desc: "Orangensaft · Minze · Soda", price: "5,50" },
    ],
  },
  {
    id: "juice", label: "Slow-Juice Bar",
    items: [
      { name: "Orange Juice", desc: "frisch gepresster Orangensaft", price: "5,90" },
      { name: "Russian Roulette", desc: "täglich frisch", price: "5,00" },
      { name: "Golden Hour", desc: "Karotte · Apfel · Ingwer", price: "5,50" },
      { name: "Green Glow", desc: "Apfel · Gurke · Ingwer · Zitrone", price: "5,50" },
    ],
    note: "0,3 l"
  },
  {
    id: "freshblend", label: "Fresh Blend",
    items: [
      { name: "Watermelon Mint", desc: "Wassermelone · Minze · Zitrone", price: "5,90" },
    ],
    note: "0,3 l"
  },
  {
    id: "wein-glas", label: "Wein vom Herzogenberg · Im Glas 0,2 l",
    items: [
      { name: "Weissburgunder", price: "6,50" },
      { name: "Rosa Cuvée Rosé", price: "6,50" },
      { name: "Weinschorle", desc: "mit Rosé oder Weißwein", price: "5,00" },
    ],
    note: "Weingut Wöhrwag · Untertürkheim · zehn Minuten von hier"
  },
  {
    id: "wein-flaschen", label: "Wein · Flaschen White / Rosé",
    items: [
      { name: "Johanna Cuvée Weiss", desc: "unkompliziert · der Einstieg", price: "20,2 / 10,2" },
      { name: "Riesling „Alte Reben\"", desc: "grüner Apfel · weißer Pfirsich", price: "20,5 / 10,5" },
      { name: "Weissburgunder trocken", price: "20,5 / 10,5" },
      { name: "Rosa Cuvée Rosé", desc: "Gewinner Rosé 2026 · Württemberger Weinmeisterschaft", price: "20,2 / 10,2" },
      { name: "Riesling Kabinett Herzogenberg", desc: "feine Süße · unser Wein zu allem Scharfen", price: "25,0 / 15,0" },
      { name: "Kreiden.Stein Riesling „Goldkapsel\"", desc: "das Aushängeschild des Hauses", price: "25,5 / 15,5" },
      { name: "Kreiden.Stein Grauburgunder", desc: "weich · rund", price: "26,0 / 16,0" },
      { name: "Sauvignon Blanc Herzogenberg", desc: "93 Falstaff-Punkte · VDP erste Lage", price: "29,9 / 19,9" },
      { name: "Riesling GG Herzogenberg", desc: "Grosses Gewächs · Monopollage · die Spitze", price: "38,5 / 28,5" },
    ],
    note: "Preise: Flasche / Glas 0,2 l"
  },
  {
    id: "wein-rot", label: "Wein · Flaschen Red",
    items: [
      { name: "2022 Lemberger Herzogenberg", desc: "VDP erste Lage · unser einer Rote", price: "26,5 / 16,5" },
    ],
    note: "Preise: Flasche / Glas 0,2 l"
  },
  {
    id: "sekt", label: "Kessler Sekt",
    items: [
      { name: "Rosé Hochgewächs", price: "25,0 / 15,0" },
      { name: "Chardonnay Hochgewächs", price: "25,0 / 15,0" },
    ],
    note: "Preise: Flasche / Glas 0,2 l"
  },
  {
    id: "bier", label: "Bier",
    items: [
      { name: "Kirin", desc: "japanisches Bier · mild & erfrischend", price: "3,90" },
    ],
  },
  {
    id: "coffee", label: "Coffee",
    items: [
      { name: "Espresso", price: "2,20" },
      { name: "Espresso Doppio", price: "3,50" },
      { name: "Espresso Macchiato", price: "2,90" },
      { name: "Iced Latte", desc: "mit Agaven-Sirup", price: "3,90" },
      { name: "Flat White", price: "3,90" },
      { name: "Iced Americano", desc: "mit Agaven-Sirup", price: "3,50" },
    ],
    note: "Milch: Kuhmilch · Hafermilch · Kokosmilch"
  },
  {
    id: "tea", label: "Tea",
    items: [
      { name: "Against Cold", desc: "Ingwer · Limette · Honig · Jasmintee", price: "3,90" },
      { name: "Just Tea", desc: "Jasmintee", price: "3,90" },
      { name: "Orange Mint Tea", desc: "Minze · Orange · Honig", price: "3,90" },
      { name: "Raw Ginger", desc: "Ingwer · Honig · Jasmintee", price: "3,90" },
    ],
  },
]

const TAB_GROUPS = [
  { label: "Essen", cats: ["hiraki", "small-bites", "onigirazu", "boosts", "bowls", "extra-protein", "yakumi"] },
  { label: "Süßes", cats: ["tteok", "crepes"] },
  { label: "Getränke", cats: ["matcha", "lemonade", "juice", "freshblend", "wein-glas", "wein-flaschen", "wein-rot", "sekt", "bier", "coffee", "tea"] },
]

// Symbol-Legende für die Speisekarte
const MENU_LEGEND = '🌱 vegan · ⭐ Empfehlung · 👑 Premium · ⭐⭐ Signature'

// ─── Opening hours helper ─────────────────────────────
interface SiteSettings {
  openDi: string; closeDi: string
  openMi: string; closeMi: string
  openDo: string; closeDo: string
  openFr: string; closeFr: string
  openSa: string; closeSa: string
  openSo: string; closeSo: string
}

const defaultHours: SiteSettings = {
  openDi: '12:00', closeDi: '21:00',
  openMi: '12:00', closeMi: '21:00',
  openDo: '12:00', closeDo: '21:00',
  openFr: '12:00', closeFr: '22:00',
  openSa: '12:00', closeSa: '22:00',
  openSo: '12:00', closeSo: '20:00',
}

function getDayHours(s: SiteSettings, dow: number) {
  if (dow === 1) return null
  const map: Record<number, [string, string]> = {
    2: [s.openDi, s.closeDi], 3: [s.openMi, s.closeMi],
    4: [s.openDo, s.closeDo], 5: [s.openFr, s.closeFr],
    6: [s.openSa, s.closeSa], 0: [s.openSo, s.closeSo],
  }
  const d = map[dow]
  return d ? { open: d[0], close: d[1] } : null
}

// ─── Component ────────────────────────────────────────
export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [site, setSite] = useState<SiteSettings>(defaultHours)
  const [mounted, setMounted] = useState(false)
  const [currentDow, setCurrentDow] = useState(-1)

  // Quick booking state
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState('2')
  const [today, setToday] = useState('')
  const [menuData, setMenuData] = useState(MENU_DATA_FALLBACK)

  // Scroll reveal observer
  const revealRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setMounted(true)
    const now = new Date()
    setToday(now.toISOString().split('T')[0])
    setCurrentDow(now.getDay())
    const tmr = new Date(now)
    tmr.setDate(tmr.getDate() + 1)
    if (tmr.getDay() === 1) tmr.setDate(tmr.getDate() + 1)
    setDate(tmr.toISOString().split('T')[0])

    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.settings) setSite(prev => ({ ...prev, ...d.settings }))
    }).catch(() => {})

    // Fetch dynamic menu from API (fallback to hardcoded)
    fetch('/api/menu').then(r => r.json()).then(d => {
      if (d.menu && d.menu.length > 0) setMenuData(d.menu)
    }).catch(() => {})
  }, [])

  // Separate observer — runs AFTER mounted so DOM elements exist
  useEffect(() => {
    if (!mounted) return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [mounted])

  function getStatus() {
    if (!mounted) return { isOpen: false, label: '...', hours: '...' }
    const now = new Date()
    const h = getDayHours(site, now.getDay())
    if (!h) return { isOpen: false, label: 'Ruhetag', hours: 'Montag: Ruhetag' }
    const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    const isOpen = t >= h.open && t < h.close
    return {
      isOpen,
      label: isOpen ? `Geöffnet bis ${h.close}` : `Öffnet um ${h.open}`,
      hours: `${h.open} – ${h.close} Uhr`
    }
  }
  const status = getStatus()

  // #11 Loading skeleton
  if (!mounted) {
    return (
      <div className="-mt-16">
        <div className="relative h-[100vh] w-full bg-[#3b1f0a] flex flex-col items-center justify-center">
          <div className="w-40 h-20 rounded-2xl bg-white/10 animate-pulse mb-6" />
          <div className="w-48 h-4 rounded-full bg-white/10 animate-pulse mb-3" />
          <div className="w-64 h-3 rounded-full bg-white/8 animate-pulse mb-8" />
          <div className="flex gap-3">
            <div className="w-36 h-12 rounded-xl bg-[#C4975C]/30 animate-pulse" />
            <div className="w-32 h-12 rounded-xl bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="-mt-16" ref={revealRef}>
      {/* ═══ HERO ═══════════════════════════════════════ */}
      <section className="relative h-[100vh] w-full overflow-hidden">
        <Image src="/images/hero-website.jpg" alt="O·MO·I Café" fill priority className="object-cover animate-hero-zoom" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <Image src="/images/omoi-logo.png" alt="O·MO·I" width={320} height={160} className="h-28 md:h-40 object-contain mb-6 animate-logo-float" style={{ width: 'auto', height: 'auto' }} priority />
          <p className="text-white/90 text-sm md:text-base uppercase tracking-[0.3em] font-medium mb-2 animate-fade-up-d2">
            Brunch · Matcha · Onigirazu
          </p>
          <p className="text-white/60 text-sm md:text-lg max-w-md italic animate-fade-up-d3">
            Gefühl, Gedanke, Sehnsucht und Liebe – alles zugleich.
          </p>
          <div className="flex gap-3 mt-8 animate-fade-up-d4">
            <Link href="/booking" className="btn-shine px-8 py-3.5 bg-[#C4975C] text-white font-bold rounded-xl hover:bg-[#b3864d] transition-all active:scale-95 shadow-lg text-sm hover:shadow-[0_8px_30px_rgba(196,151,92,0.4)]">
              Tisch reservieren
            </Link>
            <a href="#menu" className="px-8 py-3.5 border-2 border-white/40 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/60 transition-all active:scale-95 text-sm">
              Speisekarte
            </a>
          </div>
          {/* Open status */}
          <div className="mt-6 flex items-center gap-2 animate-fade-up-d5">
            <span className={`w-2.5 h-2.5 rounded-full ${status.isOpen ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]'}`} />
            <span className="text-white/70 text-xs font-medium">{status.label}</span>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="material-symbols-outlined text-white/40 text-4xl">keyboard_arrow_down</span>
        </div>
      </section>

      {/* ═══ ABOUT ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-6 max-w-6xl mx-auto" id="about">
        <div className="text-center mb-10 scroll-reveal">
          <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[4px] mb-3">Über uns</p>
          <h2 className="text-2xl md:text-4xl font-bold text-shimmer-gold mb-4">Brunch · Matcha · Onigirazu</h2>
          <div className="w-8 h-0.5 bg-[#C4975C] mx-auto mb-8 rounded-full animate-line-expand" />
          <div className="max-w-3xl mx-auto text-left md:text-center space-y-4 text-sm md:text-[15px] leading-relaxed text-stone-600">
            <p>OMOI bedeutet auf Japanisch Gefühl, Gedanke, Sehnsucht und Liebe – alles zugleich. Genau das steckt in jedem Teller und jeder Tasse, die wir servieren.</p>
            <p>Wir sind ein auf Matcha spezialisiertes Café mit Brunch- und Onigirazu-Küche im Herzen von Stuttgart. Unser Ceremonial-Grade-Matcha kommt direkt aus Japan – ob als klassischer Matcha HOT, cremiger Velvet Matcha mit Tiramisu oder erfrischender Yuzu Matcha Cloud.</p>
            <p>Unsere Signature Onigirazu – japanische Onigiri-Sandwiches aus Nori, Sushireis und frischen Zutaten – sind das Herzstück unserer Küche. Von Hot Red Tuna über Teriyaki Dry-Aged Salmon bis zum vegetarischen Super Mario.</p>
            <p>Und zum Entdecken: unsere Hiraki – knusprig gebackene Happen in 13 Sorten, jede mit eigenem Finish. In zwei Bissen gegessen, einzeln oder im Set geteilt.</p>
            <p>Dazu gibt es herzhafte Bowls aus Sushireis, Avocado und Kimchi, hausgemachte Slow Juices – und natürlich unser legendäres Matcha Tiramisu.</p>
            <p className="font-semibold text-[#3b1f0a] pt-1">Wir freuen uns auf dich. 🍵</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {[
            { icon: '🍵', title: 'Matcha & Hojicha', desc: 'Ceremonial Grade aus Japan' },
            { icon: '🔪', title: 'Signature Onigirazu', desc: 'Hot Red Tuna · Salmon · Chicken' },
            { icon: '🥗', title: 'O·MO·I Bowls', desc: 'Sushireis, Avocado, Kimchi, Nori' },
            { icon: '🍋', title: 'Slow-Juice Bar', desc: 'DetoX Green Glow · Yuzu Lemonade' },
            { icon: '🍰', title: 'Matcha Tiramisu', desc: 'Unser Signature Dessert' },
          ].map((card, i) => (
            <div key={card.title} className="scroll-reveal bg-white rounded-2xl p-5 text-center shadow-sm border border-stone-100" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="text-2xl mb-2">{card.icon}</div>
              <h3 className="font-bold text-[#3b1f0a] text-sm mb-1 leading-tight">{card.title}</h3>
              <p className="text-stone-400 text-xs leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#faf6f0] rounded-2xl px-6 py-6 md:px-8 md:py-7 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm border border-stone-100">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-[#C4975C] text-xl shrink-0 mt-0.5">location_on</span>
            <div>
              <p className="font-bold text-[#3b1f0a] mb-1">Adresse</p>
              <p className="text-stone-500 leading-relaxed">Hauptstätter Str. 57<br />70178 Stuttgart-Mitte</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-[#C4975C] text-xl shrink-0 mt-0.5">schedule</span>
            <div>
              <p className="font-bold text-[#3b1f0a] mb-1">Öffnungszeiten</p>
              <p className="text-stone-500 leading-relaxed">Di–Do: 12:00 – 21:00 · Fr–Sa: 12:00 – 22:00<br />So: 12:00 – 20:00<br /><span className="text-stone-400">Montag: Ruhetag · An Feiertagen wie sonntags</span></p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-[#C4975C] text-xl shrink-0 mt-0.5">alternate_email</span>
            <div>
              <p className="font-bold text-[#3b1f0a] mb-1">Kontakt</p>
              <p className="text-stone-500 leading-relaxed">
                <a href="mailto:hello@o-mo-i.de" className="text-[#C4975C] font-semibold hover:underline">hello@o-mo-i.de</a><br />
                <a href="https://instagram.com/omoi.stuttgart" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-[#3b1f0a]">Instagram: @omoi.stuttgart</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MENU ═══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#faf6f0]" id="menu">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[4px] mb-3">Speisekarte</p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#3b1f0a] mb-3">Unsere Speisekarte</h2>
            <p className="text-stone-400 text-sm">Von Matcha bis Onigirazu — mit Liebe zubereitet</p>
            <p className="text-stone-400 text-xs mt-3">{MENU_LEGEND}</p>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:block">
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {TAB_GROUPS.map((g, i) => (
                <button key={g.label} onClick={() => setActiveTab(i)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeTab === i ? 'bg-[#3b1f0a] text-white shadow-lg' : 'bg-white text-stone-500 hover:bg-stone-100'
                  }`}>{g.label}</button>
              ))}
            </div>
            {TAB_GROUPS.map((group, gi) => (
              <div key={group.label} className={gi === activeTab ? 'block' : 'hidden'}>
                {group.cats.map(catId => {
                  const cat = menuData.find(c => c.id === catId)
                  if (!cat) return null
                  return (
                    <div key={cat.id} className="mb-8">
                      <h3 className="text-lg font-bold text-[#3b1f0a] mb-1">{cat.label}</h3>
                      {cat.note && <p className="text-xs text-[#C4975C] italic mb-4">{cat.note}</p>}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        {cat.items.map(item => (
                          <div key={item.name} className="flex justify-between items-baseline py-2 border-b border-stone-200/60">
                            <div>
                              <span className="text-sm font-medium text-[#3b1f0a]">{item.name}</span>
                              {'desc' in item && item.desc && <span className="text-xs text-stone-400 ml-2">{item.desc}</span>}
                            </div>
                            <span className="text-sm font-bold text-[#C4975C] ml-4 whitespace-nowrap">{item.price} €</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Mobile Accordion */}
          <div className="md:hidden space-y-2">
            {TAB_GROUPS.map(group => {
              const cats = group.cats.map(id => menuData.find(c => c.id === id)).filter(Boolean)
              if (cats.length === 0) return null
              return (
                <div key={group.label} className="space-y-2">
                  <p className="text-[11px] font-bold text-[#C4975C] uppercase tracking-[3px] pt-4 pb-1">{group.label}</p>
                  {cats.map(cat => cat && (
                    <div key={cat.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                      <button onClick={() => setOpenAccordion(openAccordion === cat.id ? null : cat.id)}
                        className="w-full flex justify-between items-center px-4 py-3.5 text-left">
                        <span className="font-semibold text-sm text-[#3b1f0a]">{cat.label}</span>
                        <span className={`material-symbols-outlined text-stone-400 text-lg transition-transform ${openAccordion === cat.id ? 'rotate-180' : ''}`}>expand_more</span>
                      </button>
                      {openAccordion === cat.id && (
                        <div className="px-4 pb-4 space-y-1">
                          {cat.note && <p className="text-[11px] text-[#C4975C] italic mb-2">{cat.note}</p>}
                          {cat.items.map(item => (
                            <div key={item.name} className="flex justify-between items-baseline py-1.5">
                              <div>
                                <span className="text-sm text-[#3b1f0a]">{item.name}</span>
                                {'desc' in item && item.desc && <span className="text-[11px] text-stone-400 block">{item.desc}</span>}
                              </div>
                              <span className="text-sm font-bold text-[#C4975C] ml-3">{item.price} €</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </section>
      {/* ═══ QUICK BOOKING ══════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-6" id="reservieren">
        <div className="max-w-4xl mx-auto text-center scroll-reveal">
          <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[4px] mb-3">Reservierung</p>
          <h2 className="text-2xl md:text-4xl font-bold text-shimmer-gold mb-3">Reservieren Sie Ihren Tisch</h2>
          <p className="text-stone-400 text-sm mb-10">Sichern Sie sich Ihren Platz in unserer Zen-Oase.</p>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-stone-100 max-w-2xl mx-auto animate-glow-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="text-left">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Datum</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#C4975C] text-lg">calendar_today</span>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} min={today}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border-none rounded-xl text-sm text-[#3b1f0a] focus:ring-2 focus:ring-[#C4975C] transition-all" />
                </div>
              </div>
              <div className="text-left">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Gäste</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#C4975C] text-lg">group</span>
                  <select value={guests} onChange={e => setGuests(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border-none rounded-xl text-sm text-[#3b1f0a] focus:ring-2 focus:ring-[#C4975C] appearance-none transition-all">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Gast' : 'Gäste'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <Link href={`/booking?date=${date}&guests=${guests}`}
              className="btn-shine w-full py-4 bg-[#3b1f0a] text-white font-bold rounded-xl hover:bg-[#2a1507] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg text-sm hover:shadow-[0_8px_30px_rgba(59,31,10,0.3)]">
              <span className="material-symbols-outlined text-lg">event_seat</span>
              Jetzt Tisch finden
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ ÖFFNUNGSZEITEN + KONTAKT ═══════════════════ */}
      <section className="py-16 md:py-24 pb-28 px-4 md:px-6 bg-[#3b1f0a]" id="kontakt">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Öffnungszeiten */}
            <div>
              <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[3px] mb-4">Öffnungszeiten</p>
              <div className="space-y-2">
                {[
                  { day: 'Montag', dow: 1 }, { day: 'Dienstag', dow: 2 },
                  { day: 'Mittwoch', dow: 3 }, { day: 'Donnerstag', dow: 4 },
                  { day: 'Freitag', dow: 5 }, { day: 'Samstag', dow: 6 },
                  { day: 'Sonntag', dow: 0 },
                ].map(item => {
                  const h = getDayHours(site, item.dow)
                  const isToday = mounted && currentDow === item.dow
                  return (
                    <div key={item.day} className={`flex justify-between text-sm py-1 ${isToday ? 'text-[#C4975C] font-bold' : 'text-white/70'}`}>
                      <span>{item.day}{isToday ? ' ·' : ''}</span>
                      <span>{h ? `${h.open} – ${h.close}` : 'Ruhetag'}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* Info */}
            <div>
              <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[3px] mb-4">O·MO·I</p>
              <p className="text-white/50 text-sm italic mb-4">&quot;Gefühl, Gedanke, Sehnsucht und Liebe&quot;</p>
              <a href="https://instagram.com/omoi.stuttgart" target="_blank" rel="noopener noreferrer"
                className="text-[#C4975C] text-sm font-semibold hover:underline">@omoi.stuttgart</a>
            </div>
            {/* Kontakt */}
            <div>
              <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[3px] mb-4">Kontakt</p>
              <p className="text-white/70 text-sm">Hauptstätter Straße 57</p>
              <p className="text-white/70 text-sm">70178 Stuttgart-Mitte</p>
              <a href="mailto:hello@o-mo-i.de" className="text-[#C4975C] text-sm font-semibold hover:underline mt-2 inline-block">
                hello@o-mo-i.de
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-xs">© 2026 O·MO·I — Crafted with Heart in Stuttgart</p>
            <nav className="flex gap-6">
              <Link href="/impressum" className="text-white/30 text-xs hover:text-[#C4975C] transition-colors font-medium">Impressum</Link>
              <Link href="/datenschutz" className="text-white/30 text-xs hover:text-[#C4975C] transition-colors font-medium">Datenschutz</Link>
            </nav>
          </div>
        </div>
      </section>
    </div>
  )
}
