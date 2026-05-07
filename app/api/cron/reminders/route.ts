import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendBookingReminder } from '@/lib/email'

/**
 * GET /api/cron/reminders
 *
 * Vercel Cron Job — runs every 5 minutes.
 * Finds bookings starting in the next 15–20 minutes
 * that haven't had a reminder sent yet, and sends one.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sets this header for cron jobs)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Current time in Europe/Berlin
    const now = new Date()
    const berlinTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }))
    const todayStr = berlinTime.toISOString().split('T')[0]

    // Calculate time window: 15–20 minutes from now
    const min15 = new Date(berlinTime.getTime() + 15 * 60 * 1000)
    const min20 = new Date(berlinTime.getTime() + 20 * 60 * 1000)
    const timeFrom = `${String(min15.getHours()).padStart(2, '0')}:${String(min15.getMinutes()).padStart(2, '0')}`
    const timeTo = `${String(min20.getHours()).padStart(2, '0')}:${String(min20.getMinutes()).padStart(2, '0')}`

    // Find confirmed bookings for today, starting in 15-20 min, reminder not sent
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id, bookingCode, guestName, guestEmail, date, startTime, guestCount')
      .eq('date', todayStr)
      .in('status', ['CONFIRMED', 'PENDING'])
      .gte('startTime', timeFrom)
      .lt('startTime', timeTo)
      .is('reminderSentAt', null)
      .not('guestEmail', 'is', null)

    if (error) throw error

    let sent = 0
    for (const booking of (bookings || [])) {
      const ok = await sendBookingReminder({
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        bookingCode: booking.bookingCode,
        date: booking.date,
        startTime: booking.startTime,
        guestCount: booking.guestCount,
      })
      if (ok) {
        await supabase
          .from('bookings')
          .update({ reminderSentAt: new Date().toISOString() })
          .eq('id', booking.id)
        sent++
      }
    }

    console.log(`[Cron] Reminders: ${sent}/${(bookings || []).length} sent`)
    return NextResponse.json({ ok: true, sent, total: (bookings || []).length })
  } catch (error) {
    console.error('[Cron] Reminder error:', error)
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}
