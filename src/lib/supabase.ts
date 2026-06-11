import { createClient } from '@supabase/supabase-js'

// Project: "conquest security" (pcpvshepcdahfrmvzxcy).
// The publishable key is safe to ship in the browser — every table is protected
// by Row Level Security (public read on content, authenticated writes).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://pcpvshepcdahfrmvzxcy.supabase.co'
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_F56AK9IgrvFxJZ6aHXy3Ag_PAleGBrb'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
})
