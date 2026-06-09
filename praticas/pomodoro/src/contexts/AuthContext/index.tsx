import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { AuthUser } from '../../services/authService'

type AuthContextType = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  saveSession: (token: string, user: AuthUser) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

function getStoredSession() {
  const token = sessionStorage.getItem('token')
  const userRaw = sessionStorage.getItem('user')
  if (token && userRaw) {
    try {
      return { token, user: JSON.parse(userRaw) as AuthUser }
    } catch {
      return { token: null, user: null }
    }
  }
  return { token: null, user: null }
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const stored = getStoredSession()
  const [token, setToken] = useState<string | null>(stored.token)
  const [user, setUser] = useState<AuthUser | null>(stored.user)

  const saveSession = useCallback((newToken: string, newUser: AuthUser) => {
    sessionStorage.setItem('token', newToken)
    sessionStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthContextProvider')
  return context
}
