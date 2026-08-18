import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'

function DashboardPage() {
  const navigate = useNavigate()
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [quizzesLoading, setQuizzesLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [quizzes, setQuizzes] = useState([])
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUserName(parsedUser?.name || '')
        } catch {
          setUserName('')
        }
      }

      if (!token) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        navigate('/login')
        return
      }

      try {
        const response = await apiRequest('/quizzes', 'GET', null, token)
        setQuizzes(Array.isArray(response) ? response : [])
      } catch (error) {
        const message = error?.message || 'Unable to load quizzes.'

        if (error?.response?.message === 'Unauthenticated.' || error?.message === 'Unauthenticated.') {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
          navigate('/login')
          return
        }

        setErrorMessage(message)
      } finally {
        setQuizzesLoading(false)
      }
    }

    fetchQuizzes()
  }, [navigate])

  const handleLogout = async () => {
    const token = localStorage.getItem('auth_token')

    if (!token) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      navigate('/login')
      return
    }

    setLogoutLoading(true)
    setErrorMessage('')

    try {
      await apiRequest('/logout', 'POST', null, token)

      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      navigate('/login')
    } catch (error) {
      const message = error?.message || 'Unable to log out right now.'

      if (error?.response?.message === 'Unauthenticated.' || error?.message === 'Unauthenticated.') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        navigate('/login')
        return
      }

      setErrorMessage(message)
    } finally {
      setLogoutLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '700px', margin: '4rem auto', padding: '1.5rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>My Quizzes</h1>
          {userName && <p style={{ margin: '0.35rem 0 0', color: '#374151' }}>Welcome, {userName}</p>}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          style={{
            padding: '0.7rem 1rem',
            background: '#111827',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: logoutLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {logoutLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {errorMessage && (
        <div style={{ marginBottom: '1rem', color: '#b91c1c', background: '#fef2f2', padding: '0.75rem', borderRadius: '4px' }}>
          {errorMessage}
        </div>
      )}

      {quizzesLoading ? (
        <p>Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p>You haven't created any quizzes yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {quizzes.map((quiz) => (
            <div key={quiz.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>{quiz.title}</h3>
              <p style={{ margin: '0 0 0.5rem', color: '#374151' }}>{quiz.description || 'No description provided.'}</p>
              <p style={{ margin: '0 0 0.5rem' }}>
                <strong>Status:</strong> {quiz.is_published ? 'Published' : 'Draft'}
              </p>
              {quiz.created_at && (
                <p style={{ margin: 0, color: '#6b7280' }}>
                  <strong>Created:</strong> {new Date(quiz.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardPage
