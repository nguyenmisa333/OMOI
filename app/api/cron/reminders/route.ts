import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendBookingReminder } from '@/lib/email'

/**
 * GET /api/cron/reminders
 *
 * Vercel Cron Job — runs once daily at 09:00.
 * Sends one morning reminder for every booking happening today
 * that hasn't had a reminder sent yet.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sets this header for cron jobs)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Current date in Europe/Berlin
    const now = new Date()
    const berlinTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }))
    const todayStr = berlinTime.toISOString().split('T')[0]

    // Find all bookings for today that haven't had a reminder sent yet
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id, bookingCode, guestName, guestEmail, date, startTime, guestCount')
      .eq('date', todayStr)
      .in('status', ['CONFIRMED', 'PENDING'])
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
