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

// Only Google SSO authentication is supported
// Note: No additional auth types needed as we use Google OAuth exclusively
