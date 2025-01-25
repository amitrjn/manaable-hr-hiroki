import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/auth'
import { supabase } from '@/lib/supabase'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAllUsers() {
    try {
      loading.value = true
      error.value = null

      const { data, error: supabaseError } = await supabase
        .from('users')
        .select('*')
        .order('name')

      if (supabaseError) throw supabaseError

      users.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch users'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateUserRole(userId: string, role: 'Member' | 'Manager' | 'Admin') {
    try {
      loading.value = true
      error.value = null

      const { error: supabaseError } = await supabase
        .from('users')
        .update({ 
          role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (supabaseError) throw supabaseError

      // Refresh all users to ensure consistency
      await fetchAllUsers()

      // If the updated user is the current user, refresh auth store
      const authStore = useAuthStore()
      if (userId === authStore.currentUser?.id) {
        await authStore.init()
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update user role'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function assignManager(userId: string, managerId: string | null) {
    try {
      loading.value = true
      error.value = null

      const { error: supabaseError } = await supabase
        .from('users')
        .update({ 
          manager_id: managerId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (supabaseError) throw supabaseError

      // Refresh all users to ensure consistency
      await fetchAllUsers()

      // If the updated user is the current user, refresh auth store
      const authStore = useAuthStore()
      if (userId === authStore.currentUser?.id) {
        await authStore.init()
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to assign manager'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    fetchAllUsers,
    updateUserRole,
    assignManager
  }
})
