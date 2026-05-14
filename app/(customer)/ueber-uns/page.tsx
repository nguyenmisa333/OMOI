'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

type SiteSettings = Record<string, string>
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
function getDayHours(s: SiteSettings, dow: number) {
  const prefix = DAY_KEYS[dow]
  const open = s[`${prefix}_open`]
  const close = s[`${prefix}_close`]
  return open && close ? { open, close } : null
}
const defaultHours: SiteSettings = {
  tue_open: '12:00', tue_close: '21:00',
  wed_open: '12:00', wed_close: '21:00',
  thu_open: '12:00', thu_close: '21:00',
  fri_open: '12:00', fri_close: '22:00',
  sat_open: '12:00', sat_close: '22:00',
  sun_open: '12:00', sun_close: '20:00',
}

export default function UeberUnsPage() {
  const [site, setSite] = useState<SiteSettings>(defaultHours)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.settings) setSite(prev => ({ ...prev, ...d.settings }))
    }).catch(() => {})
  }, [])

  const diDo = getDayHours(site, 2)
  const frSa = getDayHours(site, 5)
  const so = getDayHours(site, 0)

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 flex items-center gap-1 mb-10">
          ← Zurück
        </Link>

        <h1 className="text-3xl font-bold text-[#3b1f0a] mb-2">Über uns</h1>
        <p className="text-[#C4975C] font-semibold mb-8">Brunch · Matcha · Onigirazu</p>

        <div className="space-y-5 text-stone-600 leading-relaxed">
          <p>
            <strong className="text-[#3b1f0a]">OMOI</strong> bedeutet auf Japanisch Gefühl,
            Gedanke, Sehnsucht und Liebe – alles zugleich. Genau das steckt in jedem
            Teller und jeder Tasse, die wir servieren.
          </p>
          <p>
            Wir sind ein auf <strong className="text-[#3b1f0a]">Matcha spezialisiertes Café</strong> mit
            Brunch- und Onigirazu-Küche im Herzen von Stuttgart. Unser Ceremonial-Grade-Matcha
            kommt direkt aus Japan – ob als klassischer Matcha HOT, cremiger Velvet Matcha
            mit Tiramisu oder erfrischender Yuzu Matcha Cloud.
          </p>
          <p>
            Unsere <strong className="text-[#3b1f0a]">Signature Onigirazu</strong> – japanische
            Onigiri-Sandwiches aus Nori, Sushireis und frischen Zutaten – sind das Herzstück
            unserer Küche. Von Hot Red Tuna über Teriyaki Dry-Aged Salmon bis zum
            vegetarischen Super Mario.
          </p>
          <p>
            Dazu gibt es Brunch-Klassiker beim <strong className="text-[#3b1f0a]">Early Bird</strong>,
            herzhafte <strong className="text-[#3b1f0a]">Bowls</strong> aus Sushireis, Avocado und Kimchi,
            hausgemachte <strong className="text-[#3b1f0a]">Slow Juices</strong> – und natürlich unser
            legendäres <strong className="text-[#3b1f0a]">Matcha Tiramisu</strong>.
          </p>
          <p>Wir freuen uns auf dich. 🍵</p>
        </div>

        {/* Menu highlights */}
        <div className="mt-10 grid grid-cols-2 gap-3">
          {[
            { emoji: '🍵', title: 'Matcha & Hojicha', desc: 'Ceremonial Grade aus Japan' },
            { emoji: '🔪', title: 'Signature Onigirazu', desc: 'Hot Red Tuna · Salmon · Chicken' },
            { emoji: '🥗', title: 'O·MO·I Bowls', desc: 'Sushireis, Avocado, Kimchi, Nori' },
            { emoji: '🌅', title: 'Early Bird Brunch', desc: 'Täglich 8:00 – 10:30 Uhr' },
            { emoji: '🍋', title: 'Slow-Juice Bar', desc: 'DetoX Green Glow · Yuzu Lemonade' },
            { emoji: '🍰', title: 'Matcha Tiramisu', desc: 'Unser Signature Dessert' },
          ].map(item => (
            <div key={item.title} className="bg-white border border-[#e8dcc8] rounded-2xl p-4 flex gap-3 items-start">
              <span className="text-xl">{item.emoji}</span>
              <div>
                <p className="text-sm font-bold text-[#3b1f0a]">{item.title}</p>
                <p className="text-xs text-stone-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 bg-white rounded-2xl border border-[#e8dcc8] space-y-2 text-sm text-stone-500">
          <p><strong className="text-[#3b1f0a]">Adresse:</strong> Hauptstätter Str. 57, 70178 Stuttgart-Mitte</p>
          <p><strong className="text-[#3b1f0a]">Di–Do:</strong> {diDo ? `${diDo.open} – ${diDo.close}` : '...'} · <strong className="text-[#3b1f0a]">Fr–Sa:</strong> {frSa ? `${frSa.open} – ${frSa.close}` : '...'}</p>
          <p><strong className="text-[#3b1f0a]">So:</strong> {so ? `${so.open} – ${so.close}` : '...'}</p>
          <p className="text-xs text-stone-400">Montag: Ruhetag · An Feiertagen wie sonntags</p>
          <p><strong className="text-[#3b1f0a]">E-Mail:</strong> hello@o-mo-i.de</p>
          <p><strong className="text-[#3b1f0a]">Instagram:</strong> @o.mo.i</p>
        </div>
      </div>
    </div>
  )
}
