import { supabase } from './supabase'
import type { ConfirmationMode } from './seating-planner'

export interface CafeSettings {
  slotDuration: number
  bookingDuration: number
  confirmationMode: ConfirmationMode
  maxAutoConfirmGuests: number
  // Per-day opening hours
  openDi: string; closeDi: string
  openMi: string; closeMi: string
  openDo: string; closeDo: string
  openFr: string; closeFr: string
  openSa: string; closeSa: string
  openSo: string; closeSo: string
  // Legacy (kept for backward compat)
  openTuFr: string
  closeTuFr: string
  openSaSo: string
  closeSaSo: string
  // Neukunden-Aktion
  firstTimePromoEnabled: boolean
  firstTimePromoType: 'PERCENT' | 'PRODUCT'
  firstTimePromoPercent: number
  firstTimePromoProductId: string | null
  firstTimePromoMessage: string
  // Restaurant Details
  restaurantName: string
  restaurantAddress: string
  restaurantPhone: string
  restaurantEmail: string
  restaurantWebsite: string
  restaurantGoogleMaps: string
  restaurantInstagram: string
  restaurantFacebook: string
  // Amenities
  amenityOutdoor: boolean
  amenityWifi: boolean
  amenityKidFriendly: boolean
  amenityBarrierfree: boolean
  amenityParking: boolean
  amenityReservation: boolean
  amenityTakeaway: boolean
  amenityCreditCard: boolean
}

export interface BlockedSlot {
  id: string
  date: string
  dayOfWeek: number | null
  startTime: string
  endTime: string
  reason: string
}

const SETTINGS_KEY = 'cafe'

const defaultSettings: CafeSettings = {
  slotDuration: 30,
  bookingDuration: 120,
  confirmationMode: 'AUTO',
  maxAutoConfirmGuests: 16,
  // Per-day defaults (OMOI schedule)
  openDi: '12:00', closeDi: '21:00',
  openMi: '12:00', closeMi: '21:00',
  openDo: '12:00', closeDo: '21:00',
  openFr: '12:00', closeFr: '22:00',
  openSa: '12:00', closeSa: '22:00',
  openSo: '12:00', closeSo: '20:00',
  // Legacy
  openTuFr: '12:00',
  closeTuFr: '21:00',
  openSaSo: '12:00',
  closeSaSo: '22:00',
  // Promo defaults
  firstTimePromoEnabled: false,
  firstTimePromoType: 'PERCENT',
  firstTimePromoPercent: 10,
  firstTimePromoProductId: null,
  firstTimePromoMessage: 'Willkommen bei OMOI! Als Neukunde erhalten Sie einen besonderen Rabatt.',
  // Restaurant Details defaults
  restaurantName: 'OMOI · 思い',
  restaurantAddress: 'Hauptstätter Str. 57, 70178 Stuttgart',
  restaurantPhone: '',
  restaurantEmail: '',
  restaurantWebsite: '',
  restaurantGoogleMaps: 'https://maps.app.goo.gl/Vy3wRgdSbauSvcxT9',
  restaurantInstagram: '',
  restaurantFacebook: '',
  // Amenities defaults
  amenityOutdoor: false,
  amenityWifi: true,
  amenityKidFriendly: false,
  amenityBarrierfree: false,
  amenityParking: false,
  amenityReservation: true,
  amenityTakeaway: false,
  amenityCreditCard: true,
}

// In-memory cache for settings (30s TTL — safe since settings change rarely)
let _settingsCache: CafeSettings | null = null
let _settingsCacheAt = 0
const SETTINGS_CACHE_TTL = 30_000 // 30 seconds

export async function getSettings(): Promise<CafeSettings> {
  // Return cached value if still fresh
  if (_settingsCache && Date.now() - _settingsCacheAt < SETTINGS_CACHE_TTL) {
    return { ..._settingsCache }
  }
  try {
    const { data } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', SETTINGS_KEY)
      .single()

    if (!data || typeof data.value !== 'object' || data.value === null || Array.isArray(data.value)) {
      _settingsCache = { ...defaultSettings }
    } else {
      _settingsCache = { ...defaultSettings, ...(data.value as Partial<CafeSettings>) }
    }
    _settingsCacheAt = Date.now()
    return { ..._settingsCache }
  } catch {
    return { ...defaultSettings }
  }
}

export async function updateSettings(partial: Partial<CafeSettings>): Promise<CafeSettings> {
  const current = await getSettings()
  const next: CafeSettings = { ...current, ...partial }

  const { data: existing } = await supabase
    .from('app_settings').select('key').eq('key', SETTINGS_KEY).single()

  if (existing) {
    await supabase.from('app_settings').update({ value: next }).eq('key', SETTINGS_KEY)
  } else {
    await supabase.from('app_settings').insert({ key: SETTINGS_KEY, value: next })
  }

  // Invalidate cache so next read gets fresh data
  _settingsCache = next
  _settingsCacheAt = Date.now()

  return { ...next }
}

export async function getBlockedSlots(): Promise<BlockedSlot[]> {
  try {
    const { data, error } = await supabase
      .from('blocked_times')
      .select('*')
      .order('createdAt', { ascending: false })
    if (error) throw error
    return (data || []).map(row => ({
      id: row.id,
      date: row.date,
      dayOfWeek: row.dayOfWeek,
      startTime: row.startTime,
      endTime: row.endTime,
      reason: row.reason || '',
    }))
  } catch (e) {
    console.error('[Settings] getBlockedSlots error:', e)
    return []
  }
}

export async function addBlockedSlot(slot: Omit<BlockedSlot, 'id'>): Promise<BlockedSlot> {
  const newSlot: BlockedSlot = { ...slot, id: `blk-${Date.now()}` }
  const { error } = await supabase.from('blocked_times').insert({
    id: newSlot.id,
    date: newSlot.date,
    dayOfWeek: newSlot.dayOfWeek,
    startTime: newSlot.startTime,
    endTime: newSlot.endTime,
    reason: newSlot.reason,
  })
  if (error) {
    console.error('[Settings] addBlockedSlot error:', error)
    throw error
  }
  return newSlot
}

export async function removeBlockedSlot(id: string): Promise<void> {
  const { error } = await supabase
    .from('blocked_times')
    .delete()
    .eq('id', id)
  if (error) console.error('[Settings] removeBlockedSlot error:', error)
}

export async function isTimeBlocked(date: string, time: string): Promise<boolean> {
  const slots = await getBlockedSlots()
  const dateObj = new Date(date)
  const dow = dateObj.getDay()
  return slots.some(slot => {
    const matchesDate = slot.date === date || slot.date === '*'
    const matchesDow = slot.dayOfWeek !== null && slot.dayOfWeek === dow
    if (!matchesDate && !matchesDow) return false
    return time >= slot.startTime && time < slot.endTime
  })
}
