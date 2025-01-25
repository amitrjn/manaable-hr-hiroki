<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div v-if="!magicLinkMode">
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div class="flex items-center justify-between">
      <div class="text-sm">
        <button 
          type="button"
          @click="toggleMagicLinkMode"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {{ magicLinkMode ? 'Use password' : 'Use magic link' }}
        </button>
      </div>
      <div class="text-sm" v-if="!magicLinkMode">
        <router-link to="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
          Forgot password?
        </router-link>
      </div>
    </div>

    <div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {{ loading ? 'Signing in...' : magicLinkMode ? 'Send magic link' : 'Sign in' }}
      </button>
    </div>

    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">Or continue with</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button
        type="button"
        @click="() => handleProviderLogin('google')"
        :disabled="loading"
        class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        Google
      </button>
      <button
        type="button"
        @click="() => handleProviderLogin('github')"
        :disabled="loading"
        class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        GitHub
      </button>
    </div>

    <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
    <div v-if="success" class="text-green-600 text-sm">{{ success }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const magicLinkMode = ref(false)

async function handleSubmit() {
  try {
    loading.value = true
    error.value = ''
    success.value = ''
    
    if (magicLinkMode.value) {
      await authStore.loginWithMagicLink(email.value)
      success.value = 'Magic link has been sent to your email'
      email.value = ''
    } else {
      await authStore.login({
        email: email.value,
        password: password.value
      })
      router.push('/dashboard')
    }
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleProviderLogin(provider: 'google' | 'github') {
  try {
    loading.value = true
    error.value = ''
    await authStore.loginWithProvider(provider)
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function toggleMagicLinkMode() {
  magicLinkMode.value = !magicLinkMode.value
  error.value = ''
  success.value = ''
}
</script>
