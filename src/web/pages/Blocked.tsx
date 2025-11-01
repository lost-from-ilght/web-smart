import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Blocked() {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.clear()
    navigate('/login', { replace: true })
  }
  const contact = () => {
    alert('Please contact your service provider for assistance.')
  }
  return (
    <div style={styles.wrapper as any}>
      <h1 style={styles.title as any}>Account Inactive</h1>
      <p style={styles.msg as any}>Your account is not active. Please contact your service provider to activate it.</p>
      <button style={styles.btn as any} onClick={contact}>Contact Support</button>
      <button style={{ ...styles.btn, background: '#d9534f' } as any} onClick={logout}>Logout</button>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#121212', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Poppins', 'Roboto', sans-serif" },
  title: { margin: 0, marginBottom: 8, fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 700 },
  msg: { color: '#aaa', textAlign: 'center', maxWidth: 560, marginBottom: 16, fontFamily: "'Poppins', 'Roboto', sans-serif" },
  btn: { background: '#007bff', border: 'none', padding: '12px 16px', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer', width: 240, marginBottom: 10, fontFamily: "'Poppins', 'Roboto', sans-serif" },
}



