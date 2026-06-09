const API_URL = import.meta.env.VITE_API_URL

export type AuthUser = {
  id: string
  name: string
  email: string
}

export type AuthResponse = {
  token: string
  user: AuthUser
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error ?? 'Erro ao cadastrar.')
  return data
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error ?? 'Erro ao realizar login.')
  return data
}

export async function forgotPassword(email: string): Promise<{ message: string; devToken?: string }> {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error ?? 'Erro ao solicitar recuperação.')
  return data
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error ?? 'Erro ao redefinir senha.')
}
