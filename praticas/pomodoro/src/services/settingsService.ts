const API_URL = import.meta.env.VITE_API_URL

export type SettingsPayload = {
  workTime: number
  shortBreakTime: number
  longBreakTime: number
}

function getToken() {
  return sessionStorage.getItem('token')
}

export async function fetchSettings(): Promise<SettingsPayload> {
  const response = await fetch(`${API_URL}/settings`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (!response.ok) throw new Error('Erro ao buscar configurações')
  return response.json()
}

export async function saveSettings(payload: SettingsPayload): Promise<SettingsPayload> {
  const response = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error('Erro ao salvar configurações')
  return response.json()
}
