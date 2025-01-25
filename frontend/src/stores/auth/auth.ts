import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthState } from '@/types/auth'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const state = ref<AuthState>({
    user: null,
    session: null,
    loading: true
  })

  const isAuthenticated = computed(() => !!state.value.session)
  const currentUser = computed(() => state.value.user)

  async function init() {
    state.value.loading = true
    
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession()
    state.value.session = session

    if (session?.user) {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      state.value.user = profile
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_, session) => {
      state.value.session = session
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        state.value.user = profile
      } else {
        state.value.user = null
      }
    })

    state.value.loading = false
  }

  // Only Google SSO is supported
  async function loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) throw error
    return data
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    state.value.user = null
    state.value.session = null
  }

  return {
    state,
    isAuthenticated,
    currentUser,
    init,
    loginWithGoogle,
    logout
  }
})
