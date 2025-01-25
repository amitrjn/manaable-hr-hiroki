export interface User {
  id: string
  email: string
  name: string | null
  role: 'Member' | 'Manager' | 'Admin'
  manager_id: string | null
}

export interface AuthState {
  user: User | null
  session: { user: { id: string } } | null
  loading: boolean
}

// No longer needed as we only use GitHub SSO
