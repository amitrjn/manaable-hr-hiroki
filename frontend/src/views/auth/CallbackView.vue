<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Processing authentication...</h2>
      <p v-if="error" class="mt-4 text-center text-sm text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const error = ref('')

onMounted(async () => {
  try {
    // Extract the code from URL
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (!code) {
      throw new Error('No code found in callback URL')
    }

    console.log('Exchanging code for session...')
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) throw exchangeError
    
    if (data?.session) {
      console.log('Session obtained successfully')
      // Redirect to dashboard on successful auth
      router.push('/dashboard')
    } else {
      throw new Error('No session obtained after code exchange')
    }
  } catch (e) {
    console.error('Auth callback error:', e)
    error.value = e instanceof Error ? e.message : 'Authentication failed'
    // Wait a moment before redirecting to show the error
    setTimeout(() => router.push('/login'), 3000)
  }
})
</script>
