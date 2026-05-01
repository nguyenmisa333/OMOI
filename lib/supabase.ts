import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error('Missing SUPABASE env vars')
    }
    _client = createClient(url, key, {
      auth: { persistSession: false },
    })
  }
  return _client
}

// Server-side admin client — lazy initialized
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})
