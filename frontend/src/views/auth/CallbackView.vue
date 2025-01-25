<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Processing authentication...</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()

onMounted(async () => {
  try {
    // Handle the OAuth callback
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error
    
    if (session) {
      // Redirect to dashboard on successful auth
      router.push('/dashboard')
    } else {
      // Redirect to login if no session
      router.push('/login')
    }
  } catch (error) {
    console.error('Auth callback error:', error)
    router.push('/login')
  }
})
</script>
