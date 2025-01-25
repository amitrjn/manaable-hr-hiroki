import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Only log environment details in development
  if (mode === 'development') {
    console.log('[Vite Config] Environment Variables:', {
      VITE_SUPABASE_URL: env.VITE_SUPABASE_URL,
      hasSupabaseUrl: !!env.VITE_SUPABASE_URL,
      supabaseUrlLength: env.VITE_SUPABASE_URL?.length,
      hasSupabaseKey: !!env.VITE_SUPABASE_ANON_KEY,
      supabaseKeyLength: env.VITE_SUPABASE_ANON_KEY?.length,
    })
  } else {
    console.log('[Vite Config] Building for production')
  }

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
    },
    base: '/',
    build: {
      outDir: 'dist',
      sourcemap: false, // Disable sourcemaps in production
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', '@vue/runtime-core', 'vue-router', 'pinia'],
            'supabase': ['@supabase/supabase-js']
          }
        }
      },
      // Optimize deps to reduce cold start time
      optimizeDeps: {
        include: ['vue', 'vue-router', 'pinia', '@supabase/supabase-js']
      }
    }
  }
})
