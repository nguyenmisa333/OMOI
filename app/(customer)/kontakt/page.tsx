'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// Reuse the same getDayHours helper from homepage
type SiteSettings = Record<string, string>
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const DAY_LABELS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

function getDayHours(s: SiteSettings, dow: number) {
  const prefix = DAY_KEYS[dow]
  const open = s[`${prefix}_open`]
  const close = s[`${prefix}_close`]
  return open && close ? { open, close } : null
}

const defaultHours: SiteSettings = {
  mon_open: '', mon_close: '',
  tue_open: '12:00', tue_close: '21:00',
  wed_open: '12:00', wed_close: '21:00',
  thu_open: '12:00', thu_close: '21:00',
  fri_open: '12:00', fri_close: '22:00',
  sat_open: '12:00', sat_close: '22:00',
  sun_open: '12:00', sun_close: '20:00',
}

export default function KontaktPage() {
  const [site, setSite] = useState<SiteSettings>(defaultHours)
  const [mounted, setMounted] = useState(false)
  const currentDow = new Date().getDay()

  useEffect(() => {
    setMounted(true)
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.settings) setSite(prev => ({ ...prev, ...d.settings }))
    }).catch(() => {})
  }, [])

  // Build hours display: Di–So (skip Montag = Ruhetag)
  const displayOrder = [2, 3, 4, 5, 6, 0] // Di Mi Do Fr Sa So

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 flex items-center gap-1 mb-10">
          ← Zurück
        </Link>

        <h1 className="text-3xl font-bold text-[#3b1f0a] mb-8">Kontakt</h1>

        {/* Opening hours — dynamic from API */}
        <div className="bg-white border border-[#e8dcc8] rounded-2xl p-6 mb-5">
          <p className="text-xs font-bold text-[#C4975C] uppercase tracking-widest mb-5">Öffnungszeiten</p>
          <div className="space-y-3">
            {displayOrder.map(dow => {
              const h = getDayHours(site, dow)
              const isToday = mounted && currentDow === dow
              return (
                <div key={dow} className={`flex justify-between items-center border-b border-stone-100 pb-2 last:border-0 last:pb-0 ${isToday ? 'font-bold' : ''}`}>
                  <span className={`text-sm w-32 ${isToday ? 'text-[#C4975C]' : 'text-stone-500'}`}>
                    {DAY_LABELS[dow]}{isToday ? ' ·' : ''}
                  </span>
                  <span className={`text-sm font-semibold ${isToday ? 'text-[#C4975C]' : 'text-[#3b1f0a]'}`}>
                    {h ? `${h.open} — ${h.close} Uhr` : 'Ruhetag'}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-stone-100 space-y-1 text-center">
            <p className="text-xs font-bold tracking-widest text-stone-400 uppercase">Montag · Ruhetag</p>
            <p className="text-xs text-stone-400 italic">An Feiertagen wie sonntags</p>
          </div>
        </div>

        {/* Other info */}
        <div className="space-y-4">
          {[
            { icon: '📍', label: 'Adresse', value: 'Hauptstätter Str. 57\n70178 Stuttgart-Mitte' },
            { icon: '✉️', label: 'E-Mail', value: 'hello@o-mo-i.de' },
            { icon: '🌐', label: 'Website', value: 'o-mo-i.de' },
            { icon: '📱', label: 'Instagram', value: '@o.mo.i' },
            { icon: '🛜', label: 'WLAN', value: 'OMOI guest · Passwort: omoi2026' },
          ].map(item => (
            <div key={item.label} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#e8dcc8]">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-xs font-bold text-[#C4975C] uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-stone-600 text-sm whitespace-pre-line">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* #9 Google Maps */}
        <div className="mt-6 rounded-2xl overflow-hidden border border-[#e8dcc8] shadow-sm">
          <iframe
            title="OMOI Café Standort"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2628.8!2d9.1715!3d48.7684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4799db5c7a0a0001%3A0x1!2sHauptst%C3%A4tter+Str.+57%2C+70178+Stuttgart!5e0!3m2!1sde!2sde!4v1"
            width="100%"
            height="280"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="mt-8 p-5 bg-[#faf6f0] border border-[#e8dcc8] rounded-2xl text-sm text-stone-500">
          Für Tischreservierungen nutze bitte unser{' '}
          <Link href="/booking" className="text-[#C4975C] font-semibold hover:underline">
            Online-Reservierungsformular
          </Link>
          . Bitte sprich uns bei Allergien oder Unverträglichkeiten an.
        </div>
      </div>
    </div>
  )
}
