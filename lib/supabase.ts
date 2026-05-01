import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Server-side admin client — bypasses RLS
// Lazy init to avoid crash during static build when env vars are not yet available
let _supabase: SupabaseClient | null = null

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabase) {
      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase environment variables are not configured')
      }
      _supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      })
    }
    return (_supabase as any)[prop]
  },
})
