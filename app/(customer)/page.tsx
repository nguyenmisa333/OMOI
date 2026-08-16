'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Fallback Menu Data ────────────────────────────────────────
const MENU_DATA_FALLBACK = [
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
    id: "matcha", label: "Iced Matcha & Hojicha Ceremonial",
    items: [
      { name: "Velvet Matcha + Tiramisu", price: "9,00" },
      { name: "Matcha Classic HOT", price: "4,50" },
      { name: "Hojicha HOT", price: "5,20" },
      { name: "Matcha Classic", price: "4,50" },
      { name: "Strawberry Matcha", price: "5,50" },
      { name: "Mango Matcha", price: "5,50" },
      { name: "Misu Matcha Cloud", price: "7,00" },
      { name: "Yuzu Matcha Cloud", price: "7,00" },
    ],
    note: "Standard: Kuhmilch & Agaven-Sirup | Alternative: Hafermilch, Kokosmilch"
  },
  {
    id: "onigirazu", label: "O·MO·I Signature Onigirazu",
    items: [
      { name: "Hot Red Tuna", desc: "gekochter Thunfisch, Spicy-Mayo", price: "8,50" },
      { name: "Okinawa Classic", desc: "Frühstücksfleisch, Spicy-Mayo", price: "5,50" },
      { name: "Teriyaki Grilled Dry-Aged Salmon", desc: "Lachs-Steak, Togarashi", price: "9,50" },
      { name: "Kani-Kama", desc: "Surimi Mix, Mentaiko-Mayo", price: "6,50" },
      { name: "Slow Grill Chicken", desc: "Hühnerbrustfilet, Teriyaki-Soße", price: "7,50" },
      { name: "Super Mario", desc: "Buchenpilze, Kräuterseitlinge, Miso-Butter", price: "7,00" },
    ],
    note: "Base 7,0 € — Nori, Sushireis, Salat, Lachstatar, Tamago-Ei, Avocado"
  },
  {
    id: "bowls", label: "O·MO·I Bowls",
    items: [
      { name: "Salmon Rubies", desc: "Lachs, Kirschtomaten, Spicy-Mayo", price: "11,90" },
      { name: "Midori Otah Veggie 🌱", desc: "Buchenpilze, Shoyu Glaze", price: "10,90" },
      { name: "Fired Tuna", desc: "Sous-Vide-Thunfisch, Goldfire", price: "13,90" },
      { name: "Crispy O·MO·I", desc: "gegrilltes Hähnchen, Teriyaki", price: "12,90" },
      { name: "Beef Embers", desc: "Entrecôte, Pepper-Sauce", price: "15,90" },
      { name: "Tofu Aoi 🌱", desc: "knuspriger Tofu, Shoyu Glaze", price: "10,90" },
    ],
    note: "Sushireis, Salat, Avocado, Gurke, Kim Chi, Nori, Edamame"
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
    items: [
      { name: "Tuna", desc: "Goldfire", price: "3,90" },
      { name: "Salmon", desc: "Spicy Mayo", price: "3,90" },
      { name: "Chicken", desc: "Teriyaki", price: "3,90" },
      { name: "Kani", desc: "Mentaiko-Mayo", price: "3,90" },
      { name: "Mushroom 🌱", desc: "Shoyu · Miso-Butter · Vegan", price: "3,90" },
      { name: "Tamago", desc: "Smoked Salt", price: "3,90" },
      { name: "Hotate 👑", desc: "Yuzu-Butter", price: "6,90" },
      { name: "Unagi 👑", desc: "Unagi-Glaze", price: "6,90" },
      { name: "Ember Beef 👑", desc: "Entrecôte · Pepper Glaze", price: "6,90" },
    ],
    note: "Pro Stück 3,90 · Premium 6,90 | Sets: 3x 9,90 · 6x 18,90 · 9x 35,90"
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
      { name: "Tiramisu Soße", desc: "Perfekt mit Schoko Tteok", price: "+2,00" },
      { name: "Pistazien Matcha Soße", desc: "Perfekt mit Vani Tteok", price: "+2,00" },
    ],
    note: "Warm. Buttrig. Auf die Hand. Frisch vom Griddle"
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
    id: "desserts", label: "Signature Desserts",
    items: [
      { name: "Matcha Tiramisu", price: "6,50", desc: "a, c, g" },
    ],
    note: "Kuchen wechseln täglich — schaut an der Vitrine!"
  },
]

// ─── Kuchen Zutaten/Allergene ─────────────────────────
const ALLERGEN_LEGEND: Record<string, string> = {
  'a': 'Gluten (Weizen)',
  'c': 'Eier',
  'g': 'Milch / Laktose',
  'n': 'Sesam',
}

interface KuchenItem {
  name: string
  zutaten: string
  allergene: string[]
  tags?: string[]
}

const KUCHEN_BASIS: KuchenItem[] = [
  {
    name: 'Tiramisu Kaffee',
    zutaten: 'Sahne, Ei, Mascarpone, Zucker, Mehl, Kaffee & Kakao',
    allergene: ['a', 'c', 'g'],
  },
  {
    name: 'Tiramisu Matcha',
    zutaten: 'Sahne, Ei, Mascarpone, Zucker, Mehl, Matcha',
    allergene: ['a', 'c', 'g'],
  },
  {
    name: 'Frucht Tiramisu',
    zutaten: 'Sahne, Ei, Mascarpone, Zucker, Mehl, Fruchtpüree, Gelatine',
    allergene: ['a', 'c', 'g'],
  },
  {
    name: 'Mille Crepes Basis',
    zutaten: 'Sahne, Ei, Mascarpone, Zucker, Mehl, Rapsöl, Gelatine',
    allergene: ['a', 'c', 'g'],
  },
]

const KUCHEN_SPECIALS: KuchenItem[] = [
  {
    name: 'Matcha Sesam Blaubeer Mille Crepes',
    zutaten: 'Sahne, Ei, Mascarpone, Zucker, Mehl, Matcha, Sesam, Blaubeeren, Gelatine',
    allergene: ['a', 'c', 'g', 'n'],
  },
  {
    name: 'Earl Grey Blaubeer Chiffon',
    zutaten: 'Sahne, Ei, Zucker, Mehl, Earl Grey Tee, Blaubeeren',
    allergene: ['a', 'c', 'g'],
  },
  {
    name: 'Bananen Miso Mille Crepes',
    zutaten: 'Sahne, Ei, Mascarpone, Zucker, Mehl, Banane, Miso, Gelatine',
    allergene: ['a', 'c', 'g'],
  },
  {
    name: 'Matcha Mango Passionsfrucht Chiffon',
    zutaten: 'Sahne, Ei, Zucker, Mehl, Matcha, Mango, Passionsfrucht',
    allergene: ['a', 'c', 'g'],
  },
  {
    name: 'Ube Coconut Erdbeer Gateaux',
    zutaten: 'Kokosmilch, Reismehl, Zucker, Ube, Erdbeeren, Kokosöl',
    allergene: [],
    tags: ['glutenfrei', 'laktosefrei'],
  },
]

const TAB_GROUPS = [
  { label: "Coffee", cats: ["coffee"] },
  { label: "Matcha", cats: ["matcha"] },
  { label: "Lunch", cats: ["lunch"] },
  { label: "Hiraki", cats: ["hiraki"] },
  { label: "Hiraki Week", cats: ["hiraki-week"] },
  { label: "Butter Tteok", cats: ["tteok"] },
  { label: "Crêpes", cats: ["crepes"] },
  { label: "Onigirazu", cats: ["onigirazu"] },
  { label: "Bowls", cats: ["bowls"] },
  { label: "Desserts", cats: ["desserts"] },
]

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
        <div className="text-center mb-12 scroll-reveal">
          <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[4px] mb-3">Über uns</p>
          <h2 className="text-2xl md:text-4xl font-bold text-shimmer-gold mb-4">Willkommen bei O·MO·I</h2>
          <div className="w-8 h-0.5 bg-[#C4975C] mx-auto mb-6 rounded-full animate-line-expand" />
          <p className="text-stone-500 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            O·MO·I bedeutet Gefühl, Gedanke, Sehnsucht und Liebe – alles zugleich. Wir servieren handverlesenen Ceremonial Grade Matcha, kunstvoll zubereitete Signature Onigirazu und Bowls – Crafted with Heart, mitten in Stuttgart.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { img: '/images/about-matcha.jpg', title: 'Ceremonial Matcha', desc: 'Traditionell zubereitet aus den feinsten Teeblättern Japans.' },
            { img: '/images/about-onigirazu.jpg', title: 'Signature Onigirazu', desc: 'Unser handgefertigtes Sushi-Sandwich, neu interpretiert.' },
            { img: '/images/about-brunch.jpg', title: 'Artisan Brunch', desc: 'Matcha Tiramisu, Onigirazu & Bowl – alles auf einem Tisch.' },
          ].map((card, i) => (
            <div key={card.title} className={`scroll-reveal group card-hover bg-white rounded-2xl overflow-hidden shadow-sm`} style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="h-52 overflow-hidden relative">
                <Image src={card.img} alt={card.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#3b1f0a] text-lg mb-1">{card.title}</h3>
                <p className="text-stone-400 text-sm">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ MENU ═══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#faf6f0]" id="menu">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[4px] mb-3">Speisekarte</p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#3b1f0a] mb-3">Unsere Speisekarte</h2>
            <p className="text-stone-400 text-sm">Von Matcha bis Onigirazu — mit Liebe zubereitet</p>
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
                      {/* Kuchen Allergene inline in Desserts */}
                      {catId === 'desserts' && (
                        <div className="mt-8 space-y-6">
                          <div>
                            <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[3px] mb-3">Basis · Immer verfügbar</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {KUCHEN_BASIS.map(k => (
                                <div key={k.name} className="bg-stone-50 rounded-xl p-3.5 border border-stone-100">
                                  <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <span className="font-bold text-[#3b1f0a] text-sm">{k.name}</span>
                                    <div className="flex gap-1 shrink-0">
                                      {k.allergene.map(c => <span key={c} className="w-5 h-5 rounded-full bg-[#3b1f0a] text-white text-[9px] font-bold flex items-center justify-center uppercase">{c}</span>)}
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-stone-400">{k.zutaten}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[3px] mb-3">Specials · Wechselnd</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {KUCHEN_SPECIALS.map(k => (
                                <div key={k.name} className="bg-stone-50 rounded-xl p-3.5 border border-stone-100">
                                  <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-bold text-[#3b1f0a] text-sm">{k.name}</span>
                                      {k.tags?.map(t => <span key={t} className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase">{t}</span>)}
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                      {k.allergene.length > 0 ? k.allergene.map(c => <span key={c} className="w-5 h-5 rounded-full bg-[#C4975C] text-white text-[9px] font-bold flex items-center justify-center uppercase">{c}</span>) : <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">✓</span>}
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-stone-400">{k.zutaten}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2">
                            {Object.entries(ALLERGEN_LEGEND).map(([code, label]) => (
                              <div key={code} className="flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-[#3b1f0a] text-white text-[8px] font-bold flex items-center justify-center uppercase">{code}</span>
                                <span className="text-[11px] text-stone-400">{label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Mobile Accordion */}
          <div className="md:hidden space-y-2">
            {menuData.map(cat => (
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
                    {/* Kuchen Allergene inline in mobile Desserts */}
                    {cat.id === 'desserts' && (
                      <div className="mt-4 space-y-4">
                        <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[2px] pt-2">Zutaten & Allergene</p>
                        {[...KUCHEN_BASIS, ...KUCHEN_SPECIALS].map(k => (
                          <div key={k.name} className="bg-stone-50 rounded-lg p-3 border border-stone-100">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-[#3b1f0a] text-[13px]">{k.name}</span>
                                {k.tags?.map(t => <span key={t} className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase">{t}</span>)}
                              </div>
                              <div className="flex gap-0.5 shrink-0">
                                {k.allergene.length > 0 ? k.allergene.map(c => <span key={c} className="w-5 h-5 rounded-full bg-[#3b1f0a] text-white text-[9px] font-bold flex items-center justify-center uppercase">{c}</span>) : <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">✓</span>}
                              </div>
                            </div>
                            <p className="text-[11px] text-stone-400">{k.zutaten}</p>
                          </div>
                        ))}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                          {Object.entries(ALLERGEN_LEGEND).map(([code, label]) => (
                            <div key={code} className="flex items-center gap-1">
                              <span className="w-4 h-4 rounded-full bg-[#3b1f0a] text-white text-[8px] font-bold flex items-center justify-center uppercase">{code}</span>
                              <span className="text-[10px] text-stone-400">{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
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
