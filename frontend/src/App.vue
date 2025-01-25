<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth/auth'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.init()
})
</script>

<template>
  <RouterView />
</template>
