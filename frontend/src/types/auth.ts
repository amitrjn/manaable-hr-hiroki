export interface User {
  id: string
  email: string
  name: string | null
  role: 'Member' | 'Manager' | 'Admin'
  manager_id: string | null
}

export interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
}
