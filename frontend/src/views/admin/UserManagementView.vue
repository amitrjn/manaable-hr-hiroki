<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
      </div>
    </header>

    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div v-if="error" class="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ error }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manager
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="loading && !users.length">
                    <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                  <tr v-else-if="!users.length">
                    <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                  <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ user.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ user.email }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        v-model="user.role"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        :disabled="loading"
                        @change="handleRoleChange(user.id, $event)"
                      >
                        <option value="Member">Member</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        v-model="user.manager_id"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        :disabled="loading"
                        @change="handleManagerChange(user.id, $event)"
                      >
                        <option :value="null">No Manager</option>
                        <option
                          v-for="manager in potentialManagers(user)"
                          :key="manager.id"
                          :value="manager.id"
                        >
                          {{ manager.name }}
                        </option>
                      </select>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <span v-if="loading" class="text-gray-400">
                        Saving...
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user/user'
import type { User } from '@/types/auth'

const userStore = useUserStore()
const { users, loading, error } = storeToRefs(userStore)

// Get all potential managers (users with Manager or Admin role)
const potentialManagers = (currentUser: User) => {
  return users.value.filter(user => 
    // Exclude the current user and users who aren't managers/admins
    user.id !== currentUser.id && 
    (user.role === 'Manager' || user.role === 'Admin')
  )
}

async function handleRoleChange(userId: string, event: Event) {
  const role = (event.target as HTMLSelectElement).value as 'Member' | 'Manager' | 'Admin'
  try {
    await userStore.updateUserRole(userId, role)
  } catch (error) {
    console.error('Failed to update role:', error)
  }
}

async function handleManagerChange(userId: string, event: Event) {
  const managerId = (event.target as HTMLSelectElement).value || null
  try {
    await userStore.assignManager(userId, managerId)
  } catch (error) {
    console.error('Failed to assign manager:', error)
  }
}

onMounted(async () => {
  try {
    await userStore.fetchAllUsers()
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
})
</script>
