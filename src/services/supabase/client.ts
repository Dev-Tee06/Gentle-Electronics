import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn(
    '⚠️ Missing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Please create a .env file and add your Supabase credentials to connect to the database.'
  )
}

// Using untyped client for maximum compatibility.
// Run `npx supabase gen types typescript` after connecting your project to get auto-generated types.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
