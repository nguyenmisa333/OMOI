'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// ─── Menu Data ────────────────────────────────────────
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
    id: "desserts", label: "Signature Desserts",
    items: [
      { name: "Matcha Tiramisu", price: "6,50" },
    ],
    note: "Kuchen wechseln täglich — schaut an der Vitrine!"
  },
]

const TAB_GROUPS = [
  { label: "Coffee", cats: ["coffee"] },
  { label: "Matcha", cats: ["matcha"] },
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

  useEffect(() => {
    setMounted(true)
    const now = new Date()
    setToday(now.toISOString().split('T')[0])
    setCurrentDow(now.getDay())
    // Default to tomorrow (skip Monday)
    const tmr = new Date(now)
    tmr.setDate(tmr.getDate() + 1)
    if (tmr.getDay() === 1) tmr.setDate(tmr.getDate() + 1)
    setDate(tmr.toISOString().split('T')[0])

    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.settings) setSite(prev => ({ ...prev, ...d.settings }))
    }).catch(() => {})
  }, [])

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

  return (
    <div className="-mt-16">
      {/* ═══ HERO ═══════════════════════════════════════ */}
      <section className="relative h-[100vh] w-full overflow-hidden">
        <img src="/images/hero-website.jpg" alt="O·MO·I Café" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <img src="/images/omoi-logo.png" alt="O·MO·I" className="h-14 md:h-20 object-contain mb-6 invert brightness-200 drop-shadow-lg" />
          <p className="text-white/90 text-sm md:text-base uppercase tracking-[0.3em] font-medium mb-2">
            Brunch · Matcha · Onigirazu
          </p>
          <p className="text-white/60 text-sm md:text-lg max-w-md italic">
            Gefühl, Gedanke, Sehnsucht und Liebe – alles zugleich.
          </p>
          <div className="flex gap-3 mt-8">
            <Link href="/booking" className="px-8 py-3.5 bg-[#C4975C] text-white font-bold rounded-xl hover:bg-[#b3864d] transition-all active:scale-95 shadow-lg text-sm">
              Tisch reservieren
            </Link>
            <a href="#menu" className="px-8 py-3.5 border-2 border-white/40 text-white font-bold rounded-xl hover:bg-white/10 transition-all active:scale-95 text-sm">
              Speisekarte
            </a>
          </div>
          {/* Open status */}
          <div className="mt-6 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-white/70 text-xs font-medium">{status.label}</span>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="material-symbols-outlined text-white/50 text-3xl">keyboard_arrow_down</span>
        </div>
      </section>

      {/* ═══ ABOUT ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-6 max-w-6xl mx-auto" id="about">
        <div className="text-center mb-12">
          <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[4px] mb-3">Über uns</p>
          <h2 className="text-2xl md:text-4xl font-bold text-[#3b1f0a] mb-4">Willkommen bei O·MO·I</h2>
          <div className="w-8 h-0.5 bg-[#C4975C] mx-auto mb-6 rounded-full" />
          <p className="text-stone-500 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            O·MO·I bedeutet Gefühl, Gedanke, Sehnsucht und Liebe – alles zugleich. Wir servieren handverlesenen Ceremonial Grade Matcha, kunstvoll zubereitete Signature Onigirazu und Bowls – Crafted with Heart, mitten in Stuttgart.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { img: '/images/about-matcha.jpg', title: 'Ceremonial Matcha', desc: 'Traditionell zubereitet aus den feinsten Teeblättern Japans.' },
            { img: '/images/about-onigirazu.jpg', title: 'Signature Onigirazu', desc: 'Unser handgefertigtes Sushi-Sandwich, neu interpretiert.' },
            { img: '/images/about-brunch.jpg', title: 'Artisan Brunch', desc: 'Matcha Tiramisu, Onigirazu & Bowl – alles auf einem Tisch.' },
          ].map((card) => (
            <div key={card.title} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="h-52 overflow-hidden">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                  const cat = MENU_DATA.find(c => c.id === catId)
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
            {MENU_DATA.map(cat => (
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
        </div>
      </section>

      {/* ═══ QUICK BOOKING ══════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-6" id="reservieren">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[4px] mb-3">Reservierung</p>
          <h2 className="text-2xl md:text-4xl font-bold text-[#3b1f0a] mb-3">Reservieren Sie Ihren Tisch</h2>
          <p className="text-stone-400 text-sm mb-10">Sichern Sie sich Ihren Platz in unserer Zen-Oase.</p>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-stone-100 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="text-left">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Datum</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#C4975C] text-lg">calendar_today</span>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} min={today}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border-none rounded-xl text-sm text-[#3b1f0a] focus:ring-2 focus:ring-[#C4975C]" />
                </div>
              </div>
              <div className="text-left">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Gäste</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#C4975C] text-lg">group</span>
                  <select value={guests} onChange={e => setGuests(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border-none rounded-xl text-sm text-[#3b1f0a] focus:ring-2 focus:ring-[#C4975C] appearance-none">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Gast' : 'Gäste'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <Link href={`/booking?date=${date}&guests=${guests}`}
              className="w-full py-4 bg-[#3b1f0a] text-white font-bold rounded-xl hover:bg-[#2a1507] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg text-sm">
              <span className="material-symbols-outlined text-lg">event_seat</span>
              Jetzt Tisch finden
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ ÖFFNUNGSZEITEN + KONTAKT ═══════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#3b1f0a]" id="kontakt">
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
              <a href="https://instagram.com/o.mo.i" target="_blank" rel="noopener noreferrer"
                className="text-[#C4975C] text-sm font-semibold hover:underline">@o.mo.i</a>
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
