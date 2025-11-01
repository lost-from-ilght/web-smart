import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!username || !password) {
      setError('Please fill in both fields.')
      return
    }
    setLoading(true)
    try {
      const user = await api.login(username, password)
      if (user?.user?.status === 'inactive' || user?.user?.status === 'blocked') {
        navigate('/blocked', { replace: true })
        return
      }
      localStorage.setItem('userId', user?.user?.id)
      localStorage.setItem('@user_data', JSON.stringify(user))
      navigate('/', { replace: true })
    } catch (err) {
      setError('Login failed. Username or password is wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card as any}>
        <img src="/assets/smart-home-logo.png" alt="logo" style={styles.logo as any} />
        <p style={styles.subtitle as any}>by EthioSmart Technology</p>
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <input
            style={styles.input as any}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={styles.input as any}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={styles.button as any} type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
          {error && <p style={styles.error as any}>{error}</p>}
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#121212',
    color: '#fff',
    padding: 20,
    fontFamily: "'Poppins', 'Roboto', sans-serif",
  },
  card: {
    width: 360,
    background: '#1E2429',
    borderRadius: 12,
    padding: 24,
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    objectFit: 'contain',
    marginBottom: 8,
  },
  subtitle: {
    margin: 0,
    marginBottom: 24,
    color: '#bbb',
    fontSize: 12,
    fontFamily: "'Poppins', 'Roboto', sans-serif",
  },
  input: {
    width: '100%',
    background: '#2A3238',
    border: '1px solid #2A3238',
    borderRadius: 8,
    padding: '12px 14px',
    marginBottom: 12,
    color: '#fff',
    outline: 'none',
    fontFamily: "'Poppins', 'Roboto', sans-serif",
  },
  button: {
    width: '100%',
    background: '#4CAF50',
    border: 'none',
    padding: '12px 14px',
    borderRadius: 8,
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Poppins', 'Roboto', sans-serif",
  },
  error: {
    color: '#ff6b6b',
    marginTop: 12,
    fontSize: 14,
    fontFamily: "'Poppins', 'Roboto', sans-serif",
  },
}


