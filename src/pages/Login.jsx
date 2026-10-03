import { useState } from 'react'
import api from '../services/api'

function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@keramikdinoyo.test')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      const response = await api.post('/login', {
        email,
        password,
      })

      const token = response.data?.data?.token

      if (!token) {
        throw new Error('Token login tidak ditemukan.')
      }

      localStorage.setItem('keramik_dinoyo_token', token)

      onLogin()
    } catch (err) {
      console.error('Login error:', err)

      setError(
        err.response?.data?.message ||
          'Login gagal. Silakan coba lagi.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">K</div>

        <h1>Keramik Dinoyo</h1>

        <p>
          Masuk ke dashboard administrator.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Email

            <input
              type="email"
              placeholder="admin@keramikdinoyo.test"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </label>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? 'Memproses...'
              : 'Masuk ke Dashboard'}
          </button>
        </form>

        <span className="login-note">
          Demo admin · Keramik Dinoyo
        </span>
      </div>
    </div>
  )
}

export default Login