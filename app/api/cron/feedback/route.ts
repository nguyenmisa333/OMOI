import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendFeedbackRequest } from '@/lib/email'

/**
 * GET /api/cron/feedback
 *
 * Vercel Cron Job — runs daily at 22:30 Europe/Berlin.
 * Finds today's completed bookings (CONFIRMED/SEATED/COMPLETED)
 * that haven't had a feedback email sent, and sends one.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Today in Europe/Berlin
    const now = new Date()
    const berlinTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }))
    const todayStr = berlinTime.toISOString().split('T')[0]

    // Find today's bookings that were confirmed/seated/completed
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id, bookingCode, guestName, guestEmail')
      .eq('date', todayStr)
      .in('status', ['CONFIRMED', 'SEATED', 'COMPLETED'])
      .is('feedbackSentAt', null)
      .not('guestEmail', 'is', null)

    if (error) throw error

    let sent = 0
    for (const booking of (bookings || [])) {
      const ok = await sendFeedbackRequest({
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        bookingCode: booking.bookingCode,
      })
      if (ok) {
        await supabase
          .from('bookings')
          .update({ feedbackSentAt: new Date().toISOString() })
          .eq('id', booking.id)
        sent++
      }
    }

    console.log(`[Cron] Feedback: ${sent}/${(bookings || []).length} sent`)
    return NextResponse.json({ ok: true, sent, total: (bookings || []).length })
  } catch (error) {
    console.error('[Cron] Feedback error:', error)
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}
