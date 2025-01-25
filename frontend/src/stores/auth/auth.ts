import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthState, User, LoginCredentials, RegisterData } from '@/types/auth'
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

  async function login({ email, password }: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  async function register({ email, password, name }: RegisterData) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (authError) throw authError

    if (authData.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          role: 'Member'
        })

      if (profileError) throw profileError
    }

    return authData
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    state.value.user = null
    state.value.session = null
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    
    if (error) throw error
  }

  async function updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password
    })
    
    if (error) throw error
  }

  return {
    state,
    isAuthenticated,
    currentUser,
    init,
    login,
    register,
    logout,
    resetPassword,
    updatePassword
  }
})
