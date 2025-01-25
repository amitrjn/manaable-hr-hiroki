<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Loading Spinner -->
      <div class="flex justify-center">
        <div class="h-16 w-16 bg-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="h-10 w-10 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Completing Google Sign In...</h2>
      <p class="mt-2 text-center text-sm text-gray-600">Please wait while we process your authentication</p>
      
      <!-- Error Message -->
      <div v-if="error" class="mt-4 p-4 rounded-md bg-red-50 border border-red-200">
        <p class="text-center text-sm text-red-600 flex items-center justify-center gap-2">
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
          {{ error }}
        </p>
      </div>
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
      throw new Error('Google authentication code not found in callback URL')
    }

    console.log('Exchanging Google auth code for session...')
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) throw exchangeError
    
    if (data?.session) {
      console.log('Google authentication successful')
      // Redirect to dashboard on successful auth
      router.push('/dashboard')
    } else {
      throw new Error('Failed to obtain session after Google authentication')
    }
  } catch (e) {
    console.error('Google auth callback error:', e)
    error.value = e instanceof Error ? e.message : 'Google authentication failed'
    // Wait a moment before redirecting to show the error
    setTimeout(() => router.push('/login'), 3000)
  }
})
</script>
