const API_BASE_URL = import.meta.env.VITE_API_URL

export async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    Accept: 'application/json',
  }

  if (body !== null && body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body !== null && body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || 'Request failed.'
    const error = new Error(message)
    error.response = data
    throw error
  }

  return data
}
