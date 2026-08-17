import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'

function DashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogout = async () => {
    const token = localStorage.getItem('auth_token')

    if (!token) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      navigate('/login')
      return
    }

    setLoading(true)
    setErrorMessage('')

    try {
      await apiRequest('/logout', 'POST', null, token)

      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      navigate('/login')
    } catch (error) {
      const message = error?.message || 'Unable to log out right now.'

      if (error?.response?.message === 'Unauthenticated.' || error?.response?.status === 401 || error?.response?.status === 403) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        navigate('/login')
        return
      }

      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '1.5rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          style={{
            padding: '0.7rem 1rem',
            background: '#111827',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {errorMessage && (
        <div style={{ marginTop: '1rem', color: '#b91c1c', background: '#fef2f2', padding: '0.75rem', borderRadius: '4px' }}>
          {errorMessage}
        </div>
      )}
    </div>
  )
}

export default DashboardPage
