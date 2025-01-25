import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth/auth'

export function useAuth() {
  const store = useAuthStore()
  const { isAuthenticated, currentUser } = storeToRefs(store)

  return {
    isAuthenticated,
    currentUser,
    login: store.login,
    register: store.register,
    logout: store.logout,
    resetPassword: store.resetPassword,
    updatePassword: store.updatePassword
  }
}
