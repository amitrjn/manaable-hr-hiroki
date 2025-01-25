import { createClient } from '@supabase/supabase-js'

function validateSupabaseConfig() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const errors = []
  if (!supabaseUrl) {
    errors.push('Missing VITE_SUPABASE_URL environment variable')
  } else if (!supabaseUrl.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must start with https://')
  }

  if (!supabaseAnonKey) {
    errors.push('Missing VITE_SUPABASE_ANON_KEY environment variable')
  } else if (!supabaseAnonKey.includes('.')) {
    errors.push('VITE_SUPABASE_ANON_KEY appears to be invalid (should be a JWT token)')
  }

  console.log('[Supabase Config]', {
    url: supabaseUrl,
    hasUrl: !!supabaseUrl,
    urlLength: supabaseUrl?.length,
    hasAnonKey: !!supabaseAnonKey,
    keyLength: supabaseAnonKey?.length,
    validationErrors: errors
  })

  return { supabaseUrl, supabaseAnonKey, errors }
}

const { supabaseUrl, supabaseAnonKey, errors } = validateSupabaseConfig()

if (errors.length > 0) {
  console.error('[Supabase Init Error]', errors.join(', '))
  throw new Error('Supabase configuration error: ' + errors.join(', '))
}

// Initialize Supabase client with debug options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
