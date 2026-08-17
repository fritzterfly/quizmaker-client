import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setValidationErrors((previous) => ({
      ...previous,
      [name]: '',
    }))

    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setValidationErrors({})

    try {
      const response = await apiRequest('/login', 'POST', formData)

      const token = response?.token
      const user = response?.user

      if (token) {
        localStorage.setItem('auth_token', token)
      }

      if (user) {
        localStorage.setItem('auth_user', JSON.stringify(user))
      }

      navigate('/dashboard')
    } catch (error) {
      const message = error?.message || 'Login failed. Please try again.'

      if (error?.response?.errors) {
        setValidationErrors(error.response.errors)
      }

      if (error?.response?.message) {
        setErrorMessage(error.response.message)
      }

      if (!error?.response?.errors && !error?.response?.message) {
        setErrorMessage(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto', padding: '1.5rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Login</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.35rem' }}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.7rem', boxSizing: 'border-box' }}
            required
          />
          {validationErrors.email && <small style={{ color: '#b91c1c', display: 'block', marginTop: '0.25rem' }}>{validationErrors.email[0]}</small>}
        </div>

        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.35rem' }}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.7rem', boxSizing: 'border-box' }}
            required
          />
          {validationErrors.password && <small style={{ color: '#b91c1c', display: 'block', marginTop: '0.25rem' }}>{validationErrors.password[0]}</small>}
        </div>

        {errorMessage && (
          <div style={{ color: '#b91c1c', background: '#fef2f2', padding: '0.75rem', borderRadius: '4px' }}>
            {errorMessage}
          </div>
        )}

        <button type="submit" disabled={loading} style={{ padding: '0.8rem', cursor: loading ? 'not-allowed' : 'pointer', background: '#111827', color: '#fff', border: 'none', borderRadius: '4px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/register">Don't have an account? Register</Link>
      </p>
    </div>
  )
}

export default LoginPage
