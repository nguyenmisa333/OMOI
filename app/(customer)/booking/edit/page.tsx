'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface TimeSlot {
  time: string
  status: 'available' | 'blocked' | 'full' | 'past'
  label?: string
}

interface Booking {
  bookingCode: string
  guestName: string
  guestCount: number
  date: string
  startTime: string
  endTime: string
  status: string
  specialNote: string | null
}

function EditContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get('code')

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [today, setToday] = useState('')

  // Editable fields
  const [guestCount, setGuestCount] = useState('2')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [specialNote, setSpecialNote] = useState('')

  // Availability
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [dayIsClosed, setDayIsClosed] = useState(false)
  const [canEdit, setCanEdit] = useState(true)

  useEffect(() => {
    setToday(new Date().toISOString().split('T')[0])
    if (code) fetchBooking(code)
  }, [code])

  async function fetchBooking(bookingCode: string) {
    try {
      const res = await fetch(`/api/bookings/${bookingCode}`)
      const data = await res.json()
      if (data.booking) {
        const b = data.booking
        setBooking(b)
        setGuestCount(String(b.guestCount))
        setDate(b.date)
        setTime(b.startTime)
        setSpecialNote(b.specialNote || '')

        // Check if editable (>2h before start)
        const startDT = new Date(`${b.date}T${b.startTime}:00`)
        const now = new Date()
        const hoursUntil = (startDT.getTime() - now.getTime()) / (1000 * 60 * 60)
        if (hoursUntil < 2 || ['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(b.status)) {
          setCanEdit(false)
        }
      }
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  const fetchAvailability = useCallback(async (d: string, gc: string) => {
    if (!d) return
    setSlotsLoading(true)
    setSlots([])
    setDayIsClosed(false)
    try {
      const res = await fetch(`/api/bookings/availability?date=${d}&guestCount=${gc}`)
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
    if (date) {
      fetchAvailability(date, guestCount)
    }
  }, [date, guestCount, fetchAvailability])

  const hasChanges = booking && (
    guestCount !== String(booking.guestCount) ||
    date !== booking.date ||
    time !== booking.startTime ||
    specialNote !== (booking.specialNote || '')
  )

  async function handleSave() {
    if (!booking || !time) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/bookings/${booking.bookingCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestCount: parseInt(guestCount),
          date,
          startTime: time,
          specialNote: specialNote || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Änderung fehlgeschlagen')
        return
      }
      setSuccess(true)
      setTimeout(() => {
        router.push(`/booking/confirm?code=${booking.bookingCode}`)
      }, 1500)
    } catch {
      setError('Verbindungsfehler')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-3xl text-stone-300">progress_activity</span>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <span className="material-symbols-outlined text-5xl text-stone-300 mb-4 block">event_busy</span>
          <p className="text-stone-500 text-lg">Reservierung nicht gefunden</p>
          <Link href="/" className="text-[#C4975C] font-semibold mt-4 inline-block">Zur Startseite</Link>
        </div>
      </div>
    )
  }

  if (!canEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-sm">
          <span className="material-symbols-outlined text-5xl text-amber-400 mb-4 block">lock_clock</span>
          <p className="text-stone-700 text-lg font-bold mb-2">Änderung nicht möglich</p>
          <p className="text-stone-400 text-sm mb-6">
            Änderungen sind nur bis 2 Stunden vor der Reservierung möglich.
            Bitte kontaktieren Sie uns direkt.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href={`/booking/confirm?code=${booking.bookingCode}`}
              className="px-5 py-2.5 bg-[#3b1f0a] text-white rounded-xl text-sm font-bold">
              Zurück
            </Link>
            <Link href="/kontakt"
              className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl text-sm font-bold">
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <span className="material-symbols-outlined text-5xl text-emerald-500 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <p className="text-stone-700 text-xl font-bold mb-2">Erfolgreich geändert!</p>
          <p className="text-stone-400 text-sm">Sie werden weitergeleitet...</p>
        </div>
      </div>
    )
  }

  const availableCount = slots.filter(s => s.status === 'available').length

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-[#3b1f0a] px-4 py-5 text-center">
        <p className="text-[#C4975C] text-xs font-bold uppercase tracking-[3px] mb-1">Reservierung ändern</p>
        <p className="text-white text-2xl font-black tracking-wider">{booking.bookingCode}</p>
        <p className="text-white/50 text-xs mt-1">{booking.guestName}</p>
      </div>

      <div className="px-4 md:px-6 py-6 pb-28 md:pb-12 space-y-5 max-w-lg mx-auto">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}

        {/* Original info */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Aktuelle Reservierung</p>
          <div className="flex gap-4 text-stone-600">
            <span>📅 {new Date(booking.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })}</span>
            <span>🕐 {booking.startTime} Uhr</span>
            <span>👥 {booking.guestCount} {booking.guestCount === 1 ? 'Gast' : 'Gäste'}</span>
          </div>
        </div>

        {/* Date + Guests */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1.5">Neues Datum</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#C4975C] text-[18px]">calendar_today</span>
              <input
                type="date"
                value={date}
                onChange={(e) => { setDate(e.target.value); setTime('') }}
                min={today}
                className="w-full pl-10 pr-2 py-3.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C4975C] focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1.5">Gäste</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#C4975C] text-[18px]">group</span>
              <select
                value={guestCount}
                onChange={(e) => { setGuestCount(e.target.value); setTime('') }}
                className="w-full pl-10 pr-3 py-3.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C4975C] appearance-none"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Gast' : 'Gäste'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
            Neue Uhrzeit wählen
          </label>

          {dayIsClosed && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-6 text-center">
              <span className="material-symbols-outlined text-red-400 text-3xl mb-2 block">event_busy</span>
              <p className="text-red-600 font-semibold text-sm">Montag: Ruhetag</p>
            </div>
          )}

          {slotsLoading && (
            <div className="flex items-center justify-center py-8">
              <span className="material-symbols-outlined animate-spin text-stone-300 text-2xl">progress_activity</span>
              <span className="text-sm text-stone-400 ml-2">Verfügbarkeit prüfen...</span>
            </div>
          )}

          {!slotsLoading && !dayIsClosed && slots.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-stone-400 text-[16px]">schedule</span>
                <span className="text-xs text-stone-400">{availableCount} von {slots.length} verfügbar</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const isSelected = time === slot.time
                  const isAvailable = slot.status === 'available'
                  const isOriginal = slot.time === booking.startTime && date === booking.date

                  if (isAvailable || isOriginal) {
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setTime(slot.time)}
                        className={`relative py-3 px-2 rounded-xl text-center transition-all duration-200 ${
                          isSelected
                            ? 'bg-[#3b1f0a] text-white ring-2 ring-[#C4975C] shadow-lg scale-[1.02]'
                            : isOriginal
                              ? 'bg-amber-50 text-stone-700 ring-1 ring-amber-300'
                              : 'bg-white border border-stone-200 text-stone-700 hover:border-[#C4975C] active:scale-95'
                        }`}
                      >
                        <span className={`text-sm font-bold ${isSelected ? 'text-white' : ''}`}>{slot.time}</span>
                        <span className={`block text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : isOriginal ? 'text-amber-600 font-semibold' : 'text-emerald-600'}`}>
                          {isOriginal ? 'aktuell' : 'verfügbar'}
                        </span>
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C4975C] rounded-full flex items-center justify-center shadow">
                            <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                          </span>
                        )}
                      </button>
                    )
                  }

                  return (
                    <div key={slot.time} className="py-3 px-2 rounded-xl text-center bg-stone-100 opacity-50 cursor-not-allowed">
                      <span className="text-sm font-medium text-stone-400 line-through">{slot.time}</span>
                      <span className="block text-[10px] mt-0.5 text-red-400">{slot.label || 'belegt'}</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Special note */}
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1.5">Besondere Wünsche</label>
          <textarea
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
            placeholder="z.B. Geburtstag, Kinderstuhl..."
            rows={2}
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#C4975C] resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link href={`/booking/confirm?code=${booking.bookingCode}`}
            className="flex-1 py-3.5 bg-stone-100 text-stone-600 rounded-xl font-bold text-center text-sm active:scale-95 transition-all">
            Abbrechen
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges || !time}
            className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              hasChanges && time
                ? 'bg-[#3b1f0a] text-white active:scale-95 shadow-lg'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                Speichern...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">save</span>
                Änderung speichern
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EditBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-3xl text-stone-300">progress_activity</span>
      </div>
    }>
      <EditContent />
    </Suspense>
  )
}
