import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('[Vite Config] Environment Variables:', {
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL,
    hasSupabaseUrl: !!env.VITE_SUPABASE_URL,
    supabaseUrlLength: env.VITE_SUPABASE_URL?.length,
    hasSupabaseKey: !!env.VITE_SUPABASE_ANON_KEY,
    supabaseKeyLength: env.VITE_SUPABASE_ANON_KEY?.length,
  })

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      host: true,
      allowedHosts: [
        'access-repo-app-tunnel-qgcdmuib.devinapps.com'
      ]
    }
  }
})