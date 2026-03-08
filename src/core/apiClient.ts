export const API_BASE_URL = import.meta.env.VITE_EMDIA_API_URL || ''
export const API_SCHEMA = 'lab_zelo'

export async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-schema': API_SCHEMA,
      ...(options.headers || {})
    }
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}
