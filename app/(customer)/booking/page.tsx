'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface TimeSlot {
  time: string
  status: 'available' | 'blocked' | 'full' | 'past'
  label?: string
}

export default function BookingPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [today, setToday] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    guestCount: '2',
    date: '',
    time: '',
    specialNote: '',
  })

  const [settings, setSettings] = useState<Record<string, string>>({})
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [dayIsClosed, setDayIsClosed] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

  useEffect(() => {
    const now = new Date()
    setToday(now.toISOString().split('T')[0])
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (tomorrow.getDay() === 1) tomorrow.setDate(tomorrow.getDate() + 1)
    setForm((prev) => ({ ...prev, date: tomorrow.toISOString().split('T')[0] }))

    // Load settings
    fetch('/api/settings').then(r => r.json()).then(s => {
      if (s.settings) setSettings(s.settings)
    }).catch(() => {})
  }, [])

  // Fetch availability whenever date or guestCount changes
  const fetchAvailability = useCallback(async (date: string, guestCount: string) => {
    if (!date) return
    setSlotsLoading(true)
    setSlots([])
    setDayIsClosed(false)
    try {
      const res = await fetch(`/api/bookings/availability?date=${date}&guestCount=${guestCount}`)
      const data = await res.json()
      if (data.closed) {
        setDayIsClosed(true)
        setSlots([])
      } else {
        setSlots(data.slots || [])
      }
    } catch {
      setSlots([])
    } finally {
      setSlotsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (form.date) {
      fetchAvailability(form.date, form.guestCount)
      // Reset selected time when date/guests change
      setForm(prev => ({ ...prev, time: '' }))
    }
  }, [form.date, form.guestCount, fetchAvailability])

  function validate(): boolean {
    if (!form.name.trim()) { setError('Bitte geben Sie Ihren Namen ein'); return false }
    if (!/^[\d+\s()\-]{7,}$/.test(form.phone)) { setError('Ungültige Telefonnummer'); return false }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Bitte geben Sie eine gültige E-Mail-Adresse ein'); return false }
    if (!form.date) { setError('Bitte wählen Sie ein Datum'); return false }
    if (!form.time) { setError('Bitte wählen Sie eine Uhrzeit'); return false }
    if (new Date(form.date).getDay() === 1) { setError('OMOI ist montags geschlossen'); return false }
    setError('')
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: form.date,
          time: form.time,
          guestCount: parseInt(form.guestCount),
          name: form.name,
          phone: form.phone,
          email: form.email,
          specialNote: form.specialNote || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const detail = data.detail ? ` (${data.detail})` : ''
        setError((data.error || 'Reservierung fehlgeschlagen') + detail)
        return
      }

      // Build confirm URL with promo params
      const confirmParams = new URLSearchParams({ code: data.bookingCode })
      if (data.isFirstTime) confirmParams.set('isFirstTime', 'true')
      if (data.firstTimePromo) {
        confirmParams.set('promoType', data.firstTimePromo.type)
        if (data.firstTimePromo.type === 'PERCENT') confirmParams.set('promoPercent', String(data.firstTimePromo.percent))
        if (data.firstTimePromo.type === 'PRODUCT') confirmParams.set('promoProduct', data.firstTimePromo.productName)
        if (data.firstTimePromo.message) confirmParams.set('promoMessage', data.firstTimePromo.message)
      }
      router.push(`/booking/confirm?${confirmParams.toString()}`)
    } catch {
      setError('Verbindungsfehler, bitte erneut versuchen')
    } finally {
      setSubmitting(false)
    }
  }

  const availableCount = slots.filter(s => s.status === 'available').length

  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="relative h-44 md:h-56 lg:h-64 overflow-hidden">
        <img
          src="/images/hero-cafe.jpg"
          alt="OMOI Cafe"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex flex-col items-center justify-center text-center px-4">
          <img src="/images/omoi-logo.png" alt="OMOI" className="h-7 md:h-10 object-contain invert brightness-200 mb-2" />
          <h1 className="text-white text-xl md:text-3xl font-bold">Tisch reservieren</h1>
          <p className="text-white/75 text-xs mt-1">Hauptstätter Str. 57 · Stuttgart</p>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 md:px-6 py-6 pb-28 md:pb-12 space-y-4 max-w-lg md:max-w-2xl mx-auto">

        {/* Error */}
        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">
            Name *
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-primary-container text-[20px]">person</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Max Mustermann"
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl text-on-surface text-sm focus:ring-2 focus:ring-on-primary-container"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">
            Telefon *
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-primary-container text-[20px]">call</span>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+49 171 1234567"
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl text-on-surface text-sm focus:ring-2 focus:ring-on-primary-container"
            />
          </div>
        </div>

        {/* Email — required */}
        <div>
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">
            E-Mail *
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-primary-container text-[20px]">mail</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl text-on-surface text-sm focus:ring-2 focus:ring-on-primary-container"
            />
          </div>
        </div>

        {/* Date + Guests */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Datum *</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-primary-container text-[18px]">calendar_today</span>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value, time: '' })}
                min={today}
                className="w-full pl-10 pr-2 py-3.5 bg-surface-container-low border-none rounded-xl text-on-surface text-sm focus:ring-2 focus:ring-on-primary-container"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Gäste *</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-primary-container text-[18px]">group</span>
              <select
                value={form.guestCount}
                onChange={(e) => setForm({ ...form, guestCount: e.target.value, time: '' })}
                className="w-full pl-10 pr-3 py-3.5 bg-surface-container-low border-none rounded-xl text-on-surface text-sm focus:ring-2 focus:ring-on-primary-container appearance-none"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Gast' : 'Gäste'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Time Slot Grid ───────────────────────────────────── */}
        <div>
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
            Uhrzeit wählen *
          </label>

          {/* Monday closed */}
          {dayIsClosed && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-6 text-center">
              <span className="material-symbols-outlined text-red-400 text-3xl mb-2 block">event_busy</span>
              <p className="text-red-600 font-semibold text-sm">Montag: Ruhetag</p>
              <p className="text-red-400 text-xs mt-1">Bitte wählen Sie einen anderen Tag.</p>
            </div>
          )}

          {/* Loading */}
          {slotsLoading && (
            <div className="flex items-center justify-center py-8">
              <span className="material-symbols-outlined animate-spin text-on-surface-variant text-2xl">progress_activity</span>
              <span className="text-sm text-on-surface-variant ml-2">Verfügbarkeit wird geprüft...</span>
            </div>
          )}

          {/* No date selected */}
          {!form.date && !slotsLoading && (
            <div className="bg-surface-container-low rounded-xl px-4 py-6 text-center">
              <span className="material-symbols-outlined text-on-surface-variant text-2xl mb-1 block">calendar_today</span>
              <p className="text-on-surface-variant text-sm">Bitte wählen Sie zuerst ein Datum</p>
            </div>
          )}

          {/* Slot grid */}
          {!slotsLoading && !dayIsClosed && slots.length > 0 && (
            <>
              {/* Summary */}
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">schedule</span>
                <span className="text-xs text-on-surface-variant">
                  {availableCount} von {slots.length} Zeiten verfügbar
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const isSelected = form.time === slot.time
                  const isAvailable = slot.status === 'available'

                  if (isAvailable) {
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setForm({ ...form, time: slot.time })}
                        className={`
                          relative py-3 px-2 rounded-xl text-center transition-all duration-200
                          ${isSelected
                            ? 'bg-primary-container text-white ring-2 ring-primary-container shadow-lg scale-[1.02]'
                            : 'bg-surface-container-low text-on-surface hover:bg-amber-50 hover:ring-1 hover:ring-amber-200 active:scale-95'
                          }
                        `}
                      >
                        <span className={`text-sm font-bold ${isSelected ? 'text-white' : ''}`}>
                          {slot.time}
                        </span>
                        <span className={`block text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-emerald-600'}`}>
                          verfügbar
                        </span>
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                            <span className="material-symbols-outlined text-primary-container text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          </span>
                        )}
                      </button>
                    )
                  }

                  // Disabled slot (blocked / full / past)
                  return (
                    <div
                      key={slot.time}
                      className="py-3 px-2 rounded-xl text-center bg-stone-100 opacity-60 cursor-not-allowed"
                    >
                      <span className="text-sm font-medium text-stone-400 line-through">
                        {slot.time}
                      </span>
                      <span className="block text-[10px] mt-0.5 text-red-400 font-medium">
                        {slot.label || 'nicht verfügbar'}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-3 text-[10px] text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-surface-container-low border border-stone-200" />
                  <span>Verfügbar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-primary-container" />
                  <span>Ausgewählt</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-stone-100 opacity-60" />
                  <span>Nicht verfügbar</span>
                </div>
              </div>
            </>
          )}

          {/* No slots available at all */}
          {!slotsLoading && !dayIsClosed && form.date && slots.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-6 text-center">
              <span className="material-symbols-outlined text-amber-400 text-3xl mb-2 block">event_busy</span>
              <p className="text-amber-700 font-semibold text-sm">Keine Zeiten verfügbar</p>
              <p className="text-amber-500 text-xs mt-1">Bitte wählen Sie ein anderes Datum.</p>
            </div>
          )}
        </div>

        {/* Special note */}
        <div>
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Besondere Wünsche</label>
          <textarea
            value={form.specialNote}
            onChange={(e) => setForm({ ...form, specialNote: e.target.value })}
            placeholder="z.B. Geburtstag, Kinderstuhl, Allergie..."
            rows={2}
            className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-on-primary-container resize-none"
          />
        </div>

        {/* Öffnungszeiten info */}
        <div className="bg-secondary-container/40 rounded-xl px-4 py-3 flex gap-3 items-start">
          <span className="material-symbols-outlined text-on-secondary-container text-[18px] mt-0.5">info</span>
          <div className="text-xs text-on-secondary-container">
            <p className="font-semibold mb-0.5">Öffnungszeiten</p>
            <p>Di: {settings['openDi'] || '12:00'}–{settings['closeDi'] || '21:00'} · Mi: {settings['openMi'] || '12:00'}–{settings['closeMi'] || '21:00'} · Do: {settings['openDo'] || '12:00'}–{settings['closeDo'] || '21:00'}</p>
            <p>Fr: {settings['openFr'] || '12:00'}–{settings['closeFr'] || '22:00'} · Sa: {settings['openSa'] || '12:00'}–{settings['closeSa'] || '22:00'} · So: {settings['openSo'] || '12:00'}–{settings['closeSo'] || '20:00'}</p>
            <p className="text-error font-medium mt-0.5">Montag: Ruhetag</p>
          </div>
        </div>

        {/* Privacy consent */}
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={e => setPrivacyAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#3b1f0a] focus:ring-[#C4975C] cursor-pointer accent-[#3b1f0a]"
          />
          <span className="text-xs text-stone-500 leading-relaxed">
            Ich stimme der{' '}
            <a href="/datenschutz" target="_blank" className="text-[#C4975C] font-semibold underline underline-offset-2">Datenschutzerklärung</a>{' '}
            zu und bin damit einverstanden, dass meine Daten zur Bearbeitung meiner Reservierung verarbeitet werden. *
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={submitting || !privacyAccepted || !form.time}
          className={`w-full py-4 font-bold rounded-xl text-base transition-all shadow-lg flex items-center justify-center gap-2 ${
            privacyAccepted && form.time
              ? 'bg-primary-container text-white active:scale-95'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
              Wird gesendet...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-xl">event_available</span>
              Jetzt reservieren
            </>
          )}
        </button>
      </div>
    </div>
  )
}
