import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

let _transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    })
  }
  return _transporter
}

interface BookingEmailData {
  guestName: string
  guestEmail: string
  bookingCode: string
  date: string
  startTime: string
  endTime: string
  guestCount: number
  status: 'PENDING' | 'CONFIRMED'
  specialNote?: string
  firstTimePromo?: {
    type: 'PERCENT' | 'PRODUCT'
    percent?: number
    productName?: string
    message?: string
  } | null
  restaurantName?: string
  restaurantAddress?: string
  restaurantPhone?: string
}

function formatDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString('de-DE', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    })
  } catch { return isoDate }
}

// Build email using string concatenation to avoid nested backtick issues
async function buildEmail(data: BookingEmailData): Promise<string> {
  const name = data.restaurantName || 'OMOI · 思い'
  const address = data.restaurantAddress || 'Hauptstätter Str. 57, 70178 Stuttgart'
  const confirmed = data.status === 'CONFIRMED'
  const statusLabel = confirmed ? '✅ Bestätigt' : '⏳ Wird geprüft'
  const statusColor = confirmed ? '#16a34a' : '#d97706'
  const statusBg = confirmed ? '#f0fdf4' : '#fffbeb'
  const statusBorder = confirmed ? '#bbf7d0' : '#fde68a'
  const greeting = confirmed
    ? 'Ihr Tisch wurde bestätigt. Wir freuen uns auf Ihren Besuch!'
    : 'Ihre Anfrage wird geprüft. Wir melden uns in Kürze.'

  const confirmUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000') + '/booking/confirm?code=' + data.bookingCode
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=3b1f0a&bgcolor=ffffff&data=' + encodeURIComponent(confirmUrl)

  // ── Sections ──────────────────────────────────────────────────────────────
  const noteSection = data.specialNote
    ? '<div style="margin:0 24px 16px;background:#fff8ee;border:1px solid #f0ddb8;border-radius:12px;padding:12px 16px;">'
      + '<p style="font-size:9px;font-weight:700;color:#a89070;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Hinweise</p>'
      + '<p style="font-size:13px;color:#5a4020;margin:0;">' + data.specialNote + '</p>'
      + '</div>'
    : ''

  const qrSection = '<div style="margin:0 24px 20px;background:white;border:2px dashed #d4c4a8;border-radius:16px;padding:20px;text-align:center;">'
    + '<p style="font-size:9px;font-weight:700;color:#a89070;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px;">Ihr QR-Code</p>'
    + '<a href="' + confirmUrl + '"><img src="' + qrUrl + '" alt="QR Code" width="160" height="160" style="border-radius:10px;display:block;margin:0 auto;" /></a>'
    + '<p style="font-size:11px;color:#a89070;margin:12px 0 0;line-height:1.4;">Zeigen Sie diesen Code dem Personal für schnellen Check-in.</p>'
    + '</div>'

  let promoSection = ''
  if (data.firstTimePromo) {
    const promoText = data.firstTimePromo.type === 'PERCENT'
      ? (data.firstTimePromo.percent + '% Rabatt')
      : ('Gratis: ' + data.firstTimePromo.productName)
    promoSection = '<div style="margin:0 24px 20px;background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border:2px solid #6ee7b7;border-radius:16px;padding:20px;text-align:center;">'
      + '<p style="font-size:10px;color:#059669;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">🎁 WILLKOMMEN BEI ' + name.toUpperCase() + '!</p>'
      + '<p style="font-size:22px;font-weight:800;color:#065f46;margin:0;">' + promoText + '</p>'
      + (data.firstTimePromo.message ? '<p style="font-size:13px;color:#047857;margin:6px 0 0;">' + data.firstTimePromo.message + '</p>' : '')
      + '<p style="font-size:10px;color:#34d399;margin:10px 0 0;">Zeigen Sie diese E-Mail beim Bezahlen.</p>'
      + '</div>'
  }

  const phoneRow = data.restaurantPhone
    ? '<p style="margin:4px 0;">📞 ' + data.restaurantPhone + '</p>'
    : ''

  // ── HTML ──────────────────────────────────────────────────────────────────
  const html = '<!DOCTYPE html>'
    + '<html lang="de">'
    + '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>'
    + '<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">'
    + '<div style="max-width:480px;margin:0 auto;padding:32px 16px;">'

    // Header
    + '<div style="text-align:center;margin-bottom:20px;">'
    + '<h1 style="font-size:24px;font-weight:800;color:#3b1f0a;margin:0;">' + name + '</h1>'
    + '<p style="font-size:11px;color:#a89070;margin:4px 0 0;letter-spacing:2px;text-transform:uppercase;">Reservierungsbestätigung</p>'
    + '</div>'

    // Card
    + '<div style="background:#faf6f0;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(59,31,10,0.12);">'

    // Gold bar
    + '<div style="height:6px;background:linear-gradient(90deg,#8B6914,#C4975C,#8B6914);"></div>'

    // Greeting
    + '<div style="padding:24px 24px 16px;text-align:center;">'
    + '<p style="font-size:15px;color:#3b1f0a;margin:0;">Liebe/r <strong>' + data.guestName + '</strong>,</p>'
    + '<p style="font-size:13px;color:#8B7355;margin:6px 0 0;line-height:1.5;">' + greeting + '</p>'
    + '<div style="display:inline-block;margin-top:12px;padding:4px 16px;border-radius:20px;font-size:11px;font-weight:700;color:' + statusColor + ';background:' + statusBg + ';border:1px solid ' + statusBorder + ';">' + statusLabel + '</div>'
    + '</div>'

    // Booking code
    + '<div style="padding:0 24px 16px;text-align:center;">'
    + '<p style="font-size:9px;font-weight:700;color:#a89070;letter-spacing:3px;text-transform:uppercase;margin:0 0 4px;">Buchungscode</p>'
    + '<p style="font-size:28px;font-weight:900;color:#3b1f0a;letter-spacing:3px;margin:0;font-family:monospace;">' + data.bookingCode + '</p>'
    + '</div>'

    // Ticket divider
    + '<div style="position:relative;height:24px;overflow:hidden;">'
    + '<div style="position:absolute;left:-12px;top:50%;transform:translateY(-50%);width:24px;height:24px;background:#f5f0e8;border-radius:50%;"></div>'
    + '<div style="position:absolute;right:-12px;top:50%;transform:translateY(-50%);width:24px;height:24px;background:#f5f0e8;border-radius:50%;"></div>'
    + '<div style="margin:0 24px;border-top:2px dashed #d4c4a8;position:relative;top:50%;"></div>'
    + '</div>'

    // Details grid 2x2
    + '<div style="padding:16px 24px 20px;">'
    + '<table style="width:100%;border-collapse:collapse;">'
    + '<tr>'
    // Uhrzeit
    + '<td style="padding:8px 8px 8px 0;width:50%;vertical-align:top;">'
    + '<table cellpadding="0" cellspacing="0"><tr>'
    + '<td style="width:36px;vertical-align:top;"><div style="width:36px;height:36px;background:#f0e8d8;border-radius:10px;text-align:center;line-height:36px;font-size:18px;">🕐</div></td>'
    + '<td style="padding-left:10px;vertical-align:top;">'
    + '<p style="font-size:9px;font-weight:700;color:#a89070;letter-spacing:2px;text-transform:uppercase;margin:0;">Uhrzeit</p>'
    + '<p style="font-size:18px;font-weight:800;color:#3b1f0a;margin:2px 0 0;">' + data.startTime + ' Uhr</p>'
    + '</td></tr></table></td>'
    // Datum
    + '<td style="padding:8px 0 8px 8px;width:50%;vertical-align:top;">'
    + '<table cellpadding="0" cellspacing="0"><tr>'
    + '<td style="width:36px;vertical-align:top;"><div style="width:36px;height:36px;background:#f0e8d8;border-radius:10px;text-align:center;line-height:36px;font-size:18px;">📅</div></td>'
    + '<td style="padding-left:10px;vertical-align:top;">'
    + '<p style="font-size:9px;font-weight:700;color:#a89070;letter-spacing:2px;text-transform:uppercase;margin:0;">Datum</p>'
    + '<p style="font-size:13px;font-weight:700;color:#3b1f0a;margin:2px 0 0;line-height:1.3;">' + formatDate(data.date) + '</p>'
    + '</td></tr></table></td>'
    + '</tr><tr>'
    // Gäste
    + '<td style="padding:8px 8px 8px 0;width:50%;vertical-align:top;">'
    + '<table cellpadding="0" cellspacing="0"><tr>'
    + '<td style="width:36px;vertical-align:top;"><div style="width:36px;height:36px;background:#f0e8d8;border-radius:10px;text-align:center;line-height:36px;font-size:18px;">👥</div></td>'
    + '<td style="padding-left:10px;vertical-align:top;">'
    + '<p style="font-size:9px;font-weight:700;color:#a89070;letter-spacing:2px;text-transform:uppercase;margin:0;">Gäste</p>'
    + '<p style="font-size:18px;font-weight:800;color:#3b1f0a;margin:2px 0 0;">' + data.guestCount + ' ' + (data.guestCount === 1 ? 'Person' : 'Pers.') + '</p>'
    + '</td></tr></table></td>'
    // Standort
    + '<td style="padding:8px 0 8px 8px;width:50%;vertical-align:top;">'
    + '<table cellpadding="0" cellspacing="0"><tr>'
    + '<td style="width:36px;vertical-align:top;"><div style="width:36px;height:36px;background:#f0e8d8;border-radius:10px;text-align:center;line-height:36px;font-size:18px;">📍</div></td>'
    + '<td style="padding-left:10px;vertical-align:top;">'
    + '<p style="font-size:9px;font-weight:700;color:#a89070;letter-spacing:2px;text-transform:uppercase;margin:0;">Standort</p>'
    + '<p style="font-size:13px;font-weight:700;color:#3b1f0a;margin:2px 0 0;line-height:1.3;">' + address.split(',')[0] + '</p>'
    + '</td></tr></table></td>'
    + '</tr></table></div>'

    // Sections
    + noteSection
    + qrSection
    + promoSection

    // Logo
    + '<div style="text-align:center;padding:0 0 20px;">'
    + '<p style="font-size:13px;color:#c4b090;margin:0;font-weight:600;">' + name + '</p>'
    + '</div>'

    + '</div>' // card

    // Footer
    + '<div style="text-align:center;padding:20px 0;color:#c4b090;font-size:11px;">'
    + '<p style="margin:0;">' + address + '</p>'
    + phoneRow
    + '<p style="margin:10px 0 0;font-size:10px;color:#d6d3d1;">Diese E-Mail wurde automatisch generiert.</p>'
    + '</div>'

    + '</div></body></html>'

  return html
}

export async function sendBookingConfirmation(data: BookingEmailData): Promise<boolean> {
  if (!process.env.NODEMAILER_USER || !process.env.NODEMAILER_PASS) {
    console.log('[Email] Skipped — NODEMAILER_USER/PASS not configured')
    return false
  }
  if (!data.guestEmail) {
    console.log('[Email] Skipped — no guest email')
    return false
  }

  try {
    const name = data.restaurantName || 'OMOI · 思い'
    const subject = data.status === 'CONFIRMED'
      ? '✅ Reservierung bestätigt — ' + formatDate(data.date) + ' um ' + data.startTime + ' | ' + name
      : '📋 Reservierung eingegangen — ' + formatDate(data.date) + ' um ' + data.startTime + ' | ' + name

    const html = await buildEmail(data)

    await getTransporter().sendMail({
      from: '"' + name + '" <' + process.env.NODEMAILER_USER + '>',
      replyTo: process.env.NODEMAILER_USER,
      to: data.guestEmail,
      subject,
      html,
      headers: {
        'X-Mailer': 'OMOI Reservation System',
        'Precedence': 'bulk',
      },
    })

    console.log('[Email] Sent to ' + data.guestEmail + ' — ' + data.bookingCode)
    return true
  } catch (error) {
    console.error('[Email] Failed:', error)
    return false
  }
}

// ── Reminder Email (15 min before booking) ───────────────────────────

interface ReminderEmailData {
  guestName: string
  guestEmail: string
  bookingCode: string
  date: string
  startTime: string
  guestCount: number
}

export async function sendBookingReminder(data: ReminderEmailData): Promise<boolean> {
  if (!process.env.NODEMAILER_USER || !process.env.NODEMAILER_PASS) {
    console.log('[Email] Skipped reminder — NODEMAILER_USER/PASS not configured')
    return false
  }
  if (!data.guestEmail) return false

  const b = '#3b1f0a'
  const g = '#C4975C'
  const bg = '#f5f0e8'
  const card = '#faf6f0'
  const sub = '#a89070'
  const txt = '#8B7355'
  const dateStr = formatDate(data.date)

  const html = '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>'
    + '<body style="margin:0;padding:0;background:' + bg + ';font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">'
    + '<div style="max-width:480px;margin:0 auto;padding:32px 16px;">'
    + '<div style="text-align:center;margin-bottom:24px;"><h1 style="font-size:22px;font-weight:800;color:' + b + ';margin:0;letter-spacing:1px;">OMOI · 思い</h1></div>'
    + '<div style="background:' + card + ';border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(59,31,10,0.10);">'
    + '<div style="height:4px;background:linear-gradient(90deg,#8B6914,' + g + ',#8B6914);"></div>'
    + '<div style="padding:32px 28px 20px;text-align:center;">'
    + '<div style="width:48px;height:48px;border:2px solid ' + g + ';border-radius:50%;margin:0 auto 16px;line-height:48px;text-align:center;"><span style="font-size:20px;color:' + g + ';font-weight:300;">15</span></div>'
    + '<p style="font-size:9px;font-weight:700;color:' + sub + ';letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Erinnerung</p>'
    + '<p style="font-size:20px;font-weight:800;color:' + b + ';margin:0;">Ihre Reservierung beginnt bald</p>'
    + '<p style="font-size:13px;color:' + txt + ';margin:10px 0 0;line-height:1.6;">Liebe/r <strong>' + data.guestName + '</strong>,<br/>in 15 Minuten erwartet Sie Ihr Tisch bei OMOI.</p>'
    + '</div>'
    + '<div style="margin:0 28px;border-top:1px solid #e8dfd0;"></div>'
    + '<div style="padding:20px 28px;">'
    + '<table style="width:100%;border-collapse:collapse;">'
    + '<tr><td style="padding:10px 0;font-size:12px;color:' + sub + ';font-weight:600;text-transform:uppercase;letter-spacing:1px;">Datum</td><td style="padding:10px 0;font-size:14px;font-weight:700;color:' + b + ';text-align:right;">' + dateStr + '</td></tr>'
    + '<tr><td colspan="2" style="border-top:1px solid #f0e8d8;"></td></tr>'
    + '<tr><td style="padding:10px 0;font-size:12px;color:' + sub + ';font-weight:600;text-transform:uppercase;letter-spacing:1px;">Uhrzeit</td><td style="padding:10px 0;font-size:14px;font-weight:700;color:' + b + ';text-align:right;">' + data.startTime + ' Uhr</td></tr>'
    + '<tr><td colspan="2" style="border-top:1px solid #f0e8d8;"></td></tr>'
    + '<tr><td style="padding:10px 0;font-size:12px;color:' + sub + ';font-weight:600;text-transform:uppercase;letter-spacing:1px;">Gäste</td><td style="padding:10px 0;font-size:14px;font-weight:700;color:' + b + ';text-align:right;">' + data.guestCount + ' Personen</td></tr>'
    + '<tr><td colspan="2" style="border-top:1px solid #f0e8d8;"></td></tr>'
    + '<tr><td style="padding:10px 0;font-size:12px;color:' + sub + ';font-weight:600;text-transform:uppercase;letter-spacing:1px;">Buchungscode</td><td style="padding:10px 0;font-size:16px;font-weight:900;color:' + b + ';text-align:right;font-family:monospace;letter-spacing:2px;">' + data.bookingCode + '</td></tr>'
    + '</table></div>'
    + '<div style="margin:0 28px;border-top:1px solid #e8dfd0;"></div>'
    + '<div style="padding:20px 28px;">'
    + '<p style="font-size:9px;font-weight:700;color:' + sub + ';letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Adresse</p>'
    + '<p style="font-size:14px;font-weight:600;color:' + b + ';margin:0;line-height:1.5;">Hauptstätter Str. 57<br/><span style="font-weight:400;color:' + txt + ';">70178 Stuttgart</span></p>'
    + '<a href="https://maps.app.goo.gl/Vy3wRgdSbauSvcxT9" style="display:inline-block;margin-top:14px;padding:10px 24px;border:1.5px solid ' + b + ';color:' + b + ';border-radius:10px;font-size:12px;font-weight:700;text-decoration:none;">Route anzeigen ›</a>'
    + '</div>'
    + '<div style="margin:0 28px 28px;background:#f8f4ec;border-radius:12px;padding:14px 18px;">'
    + '<p style="font-size:12px;color:' + txt + ';line-height:1.6;margin:0;"><strong>Tipp:</strong> Zeigen Sie Ihren Buchungscode dem Personal für einen schnellen Check-in.</p>'
    + '</div></div>'
    + '<div style="text-align:center;padding:24px 0 0;"><p style="font-size:11px;color:#c4b090;margin:0;">OMOI · 思い</p><p style="font-size:10px;color:#d6d3d1;margin:6px 0 0;">Hauptstätter Str. 57, 70178 Stuttgart</p></div>'
    + '</div></body></html>'

  try {
    await getTransporter().sendMail({
      from: '"OMOI · 思い" <' + process.env.NODEMAILER_USER + '>',
      replyTo: process.env.NODEMAILER_USER,
      to: data.guestEmail,
      subject: 'Erinnerung — Ihre Reservierung bei OMOI beginnt in 15 Minuten',
      html,
    })
    console.log('[Email] Reminder sent to ' + data.guestEmail + ' — ' + data.bookingCode)
    return true
  } catch (error) {
    console.error('[Email] Reminder failed:', error)
    return false
  }
}

// ── Feedback + Google Review Email (after closing) ───────────────────

interface FeedbackEmailData {
  guestName: string
  guestEmail: string
  bookingCode: string
}

const GOOGLE_REVIEW_URL = 'https://www.google.com/maps/place/OMOI+%E2%80%A2+%E6%80%9D%E3%81%84/@48.7704409,9.1740564,17z/data=!4m17!1m8!3m7!1s0x4799dbef47e8142f:0xf8586136788cfecb!2zT01PSSDigKIg5oCd44GE!8m2!3d48.7704374!4d9.1766313!10e9!16s%2Fg%2F11nhbvn8gc!3m7!1s0x4799dbef47e8142f:0xf8586136788cfecb!8m2!3d48.7704374!4d9.1766313!9m1!1b1!16s%2Fg%2F11nhbvn8gc?entry=ttu'

export async function sendFeedbackRequest(data: FeedbackEmailData): Promise<boolean> {
  if (!process.env.NODEMAILER_USER || !process.env.NODEMAILER_PASS) {
    console.log('[Email] Skipped feedback — NODEMAILER_USER/PASS not configured')
    return false
  }
  if (!data.guestEmail) return false

  const b = '#3b1f0a'
  const g = '#C4975C'
  const bg = '#f5f0e8'
  const card = '#faf6f0'
  const sub = '#a89070'
  const txt = '#8B7355'

  const star = '<span style="display:inline-block;width:28px;height:28px;border:1.5px solid ' + g + ';border-radius:50%;margin:0 3px;line-height:28px;font-size:12px;color:' + g + ';font-weight:700;">★</span>'

  const html = '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>'
    + '<body style="margin:0;padding:0;background:' + bg + ';font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">'
    + '<div style="max-width:480px;margin:0 auto;padding:32px 16px;">'
    + '<div style="text-align:center;margin-bottom:24px;"><h1 style="font-size:22px;font-weight:800;color:' + b + ';margin:0;letter-spacing:1px;">OMOI · 思い</h1></div>'
    + '<div style="background:' + card + ';border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(59,31,10,0.10);">'
    + '<div style="height:4px;background:linear-gradient(90deg,#8B6914,' + g + ',#8B6914);"></div>'
    + '<div style="padding:32px 28px 20px;text-align:center;">'
    + '<p style="font-size:9px;font-weight:700;color:' + sub + ';letter-spacing:3px;text-transform:uppercase;margin:0 0 12px;">Feedback</p>'
    + '<p style="font-size:22px;font-weight:800;color:' + b + ';margin:0;line-height:1.3;">Danke für Ihren Besuch</p>'
    + '<p style="font-size:13px;color:' + txt + ';margin:12px 0 0;line-height:1.6;">Liebe/r <strong>' + data.guestName + '</strong>,<br/>wir hoffen, Sie hatten einen wundervollen Aufenthalt bei OMOI.</p>'
    + '</div>'
    + '<div style="margin:0 28px;border-top:1px solid #e8dfd0;"></div>'
    + '<div style="padding:24px 28px;text-align:center;">'
    + '<p style="font-size:9px;font-weight:700;color:' + sub + ';letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Wie war Ihr Erlebnis?</p>'
    + '<p style="font-size:13px;color:' + txt + ';line-height:1.6;margin:0 0 20px;">Ihre Meinung hilft anderen Gästen,<br/>OMOI zu entdecken.</p>'
    + '<div style="margin:0 0 20px;">' + star + star + star + star + star + '</div>'
    + '<a href="' + GOOGLE_REVIEW_URL + '" style="display:inline-block;padding:14px 36px;background:' + b + ';color:white;border-radius:12px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">Bewertung schreiben ›</a>'
    + '<p style="font-size:11px;color:#c4b090;margin:12px 0 0;">Dauert nur 1 Minute</p>'
    + '</div>'
    + '<div style="margin:0 28px;border-top:1px solid #e8dfd0;"></div>'
    + '<div style="padding:20px 28px;">'
    + '<p style="font-size:9px;font-weight:700;color:' + sub + ';letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Kontakt</p>'
    + '<table style="width:100%;border-collapse:collapse;">'
    + '<tr><td style="padding:6px 0;font-size:13px;color:' + b + ';font-weight:500;">Instagram</td><td style="padding:6px 0;text-align:right;"><a href="https://instagram.com/omoi.stuttgart" style="font-size:13px;color:' + g + ';text-decoration:none;font-weight:600;">@omoi.stuttgart</a></td></tr>'
    + '<tr><td colspan="2" style="border-top:1px solid #f0e8d8;"></td></tr>'
    + '<tr><td style="padding:6px 0;font-size:13px;color:' + b + ';font-weight:500;">E-Mail</td><td style="padding:6px 0;text-align:right;"><a href="mailto:omoi.stuttgart@gmail.com" style="font-size:13px;color:' + g + ';text-decoration:none;font-weight:600;">Schreiben</a></td></tr>'
    + '</table></div>'
    + '<div style="margin:0 28px;border-top:1px solid #e8dfd0;"></div>'
    + '<div style="padding:20px 28px 28px;text-align:center;">'
    + '<p style="font-size:14px;font-weight:600;color:' + b + ';margin:0 0 4px;">Bis zum nächsten Mal</p>'
    + '<p style="font-size:12px;color:' + txt + ';margin:0 0 14px;">Wir freuen uns auf Ihren nächsten Besuch.</p>'
    + '<a href="https://www.omoi.help/booking" style="display:inline-block;padding:10px 28px;border:1.5px solid ' + g + ';color:' + g + ';border-radius:10px;font-size:12px;font-weight:700;text-decoration:none;">Jetzt reservieren ›</a>'
    + '</div></div>'
    + '<div style="text-align:center;padding:24px 0 0;"><p style="font-size:11px;color:#c4b090;margin:0;">OMOI · 思い</p><p style="font-size:10px;color:#d6d3d1;margin:6px 0 0;">Hauptstätter Str. 57, 70178 Stuttgart</p></div>'
    + '</div></body></html>'

  try {
    await getTransporter().sendMail({
      from: '"OMOI · 思い" <' + process.env.NODEMAILER_USER + '>',
      replyTo: process.env.NODEMAILER_USER,
      to: data.guestEmail,
      subject: 'Wie war Ihr Besuch bei OMOI? — Wir freuen uns auf Ihr Feedback',
      html,
    })
    console.log('[Email] Feedback sent to ' + data.guestEmail + ' — ' + data.bookingCode)
    return true
  } catch (error) {
    console.error('[Email] Feedback failed:', error)
    return false
  }
}
