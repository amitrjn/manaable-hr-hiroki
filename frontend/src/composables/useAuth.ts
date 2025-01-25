import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth/auth'

export function useAuth() {
  const store = useAuthStore()
  const { isAuthenticated, currentUser } = storeToRefs(store)

  return {
    isAuthenticated,
    currentUser,
    loginWithProvider: store.loginWithProvider,
    logout: store.logout
  }
}
