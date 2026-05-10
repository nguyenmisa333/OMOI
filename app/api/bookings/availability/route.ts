import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSettings, getBlockedSlots } from '@/lib/settings'

/**
 * GET /api/bookings/availability?date=YYYY-MM-DD&guestCount=N
 *
 * Public endpoint (no auth required) that returns slot availability
 * for a given date. Each slot has a status:
 *   - "available"       — can be booked
 *   - "blocked"         — admin blocked this time
 *   - "full"            — all tables occupied
 *   - "past"            — time has already passed today
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')
    const guestCount = parseInt(searchParams.get('guestCount') || '2')

    if (!dateStr) {
      return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 })
    }

    const dateObj = new Date(dateStr + 'T00:00:00')
    const dow = dateObj.getDay()

    // Monday closed
    if (dow === 1) {
      return NextResponse.json({ slots: [], closed: true, reason: 'Montag: Ruhetag' })
    }

    // Run all independent DB fetches in parallel — no logic change, just faster
    const [settings, blockedSlots, tablesResult, bookingsResult] = await Promise.all([
      getSettings(),
      getBlockedSlots(),
      supabase.from('tables').select('id, capacity').eq('isActive', true),
      supabase.from('bookings')
        .select('startTime, endTime, guestCount, tableId, assignedTables:booking_tables(tableId)')
        .eq('date', dateStr)
        .in('status', ['PENDING', 'CONFIRMED', 'SEATED']),
    ])

    const bookingDuration = settings.bookingDuration || 120
    const slotDuration = settings.slotDuration || 30

    // Get opening hours for this day
    const dayMap: Record<number, { openKey: keyof typeof settings; closeKey: keyof typeof settings }> = {
      2: { openKey: 'openDi', closeKey: 'closeDi' },
      3: { openKey: 'openMi', closeKey: 'closeMi' },
      4: { openKey: 'openDo', closeKey: 'closeDo' },
      5: { openKey: 'openFr', closeKey: 'closeFr' },
      6: { openKey: 'openSa', closeKey: 'closeSa' },
      0: { openKey: 'openSo', closeKey: 'closeSo' },
    }
    const dayConf = dayMap[dow]
    if (!dayConf) {
      return NextResponse.json({ slots: [], closed: true })
    }

    const openTime = (settings[dayConf.openKey] as string) || '12:00'
    const closeTime = (settings[dayConf.closeKey] as string) || '21:00'

    const [openH, openM] = openTime.split(':').map(Number)
    const [closeH, closeM] = closeTime.split(':').map(Number)
    const startMin = openH * 60 + openM
    const endMin = closeH * 60 + closeM

    const activeTables = tablesResult.data || []
    const existingBookings = bookingsResult.data || []

    const totalCapacity = activeTables.reduce((sum, t) => sum + (t.capacity as number), 0)
    const suitableTables = activeTables.filter(t => (t.capacity as number) >= guestCount)

    // Check if today and get current time
    const now = new Date()
    const isToday = now.toISOString().split('T')[0] === dateStr
    const nowMin = isToday ? now.getHours() * 60 + now.getMinutes() : -1

    // Generate slots
    const slots: Array<{
      time: string
      status: 'available' | 'blocked' | 'full' | 'past'
      label?: string
    }> = []

    for (let cur = startMin; cur < endMin; cur += slotDuration) {
      const h = Math.floor(cur / 60)
      const m = cur % 60
      const t = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`

      // Calculate end time for this slot's booking
      const slotEndMin = cur + bookingDuration
      const slotEndH = Math.floor(slotEndMin / 60) % 24
      const slotEndM = slotEndMin % 60
      const slotEnd = `${String(slotEndH).padStart(2, '0')}:${String(slotEndM).padStart(2, '0')}`

      // Check if past
      if (isToday && cur <= nowMin) {
        slots.push({ time: t, status: 'past', label: 'vorbei' })
        continue
      }

      // Check if blocked by admin
      const blocked = blockedSlots.some(slot => {
        const matchDate = slot.date === dateStr || slot.date === '*'
        const matchDow = slot.dayOfWeek !== null && slot.dayOfWeek === dow
        if (!matchDate && !matchDow) return false
        return t >= slot.startTime && t < slot.endTime
      })
      if (blocked) {
        slots.push({ time: t, status: 'blocked', label: 'nicht verfügbar' })
        continue
      }

      // Check table availability for this time slot
      const occupiedTableIds = new Set<string>()
      ;(existingBookings || []).forEach((b: { startTime: string; endTime: string; tableId: string | null; assignedTables: { tableId: string }[] }) => {
        // Check if booking overlaps with this slot
        if (b.startTime < slotEnd && b.endTime > t) {
          if (b.tableId) occupiedTableIds.add(b.tableId)
          b.assignedTables?.forEach((a) => occupiedTableIds.add(a.tableId))
        }
      })

      // Check if there are suitable available tables
      const availableSuitable = suitableTables.filter(table => !occupiedTableIds.has(table.id))
      if (availableSuitable.length === 0) {
        slots.push({ time: t, status: 'full', label: 'ausgebucht' })
        continue
      }

      slots.push({ time: t, status: 'available' })
    }

    return NextResponse.json(
      { slots, closed: false, openTime, closeTime, totalCapacity },
      {
        headers: {
          // Cache 30s on browser/CDN; serve stale up to 60s while revalidating
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    )
  } catch (error) {
    console.error('GET /api/bookings/availability error:', error)
    return NextResponse.json({ slots: [], error: 'Failed to check availability' }, { status: 500 })
  }
}
