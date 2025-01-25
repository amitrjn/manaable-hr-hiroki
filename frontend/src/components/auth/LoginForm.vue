<template>
  <div class="space-y-6">
    <div>
      <button
        type="button"
        @click="handleGitHubLogin"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        Sign in with GitHub
      </button>
    </div>

    <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth/auth'

const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

async function handleGitHubLogin() {
  try {
    loading.value = true
    error.value = ''
    await authStore.loginWithProvider('github')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>
