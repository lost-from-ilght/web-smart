import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Profile() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('@user_data')
    if (!stored) return navigate('/login', { replace: true })
    const parsed = JSON.parse(stored)
    setUserId(parsed.user.id)
    setName(parsed.user.name)
    setEmail(parsed.user.email)
    setPhoneNumber(parsed.user.phoneNumber)
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('@user_data')
    localStorage.removeItem('userId')
    navigate('/login', { replace: true })
  }

  const updateProfile = async () => {
    await api.updateProfile(userId, name, email, phoneNumber)
    alert('Profile updated. Please login again.')
    logout()
  }

  const updatePassword = async () => {
    if (!currentPassword || !newPassword) return alert('Please fill both passwords')
    await api.updatePassword(userId, currentPassword, newPassword)
    alert('Password updated. Please login again.')
    logout()
  }

  return (
    <div style={styles.wrapper as any}>
      <div style={styles.topbar as any}>
        <button style={styles.iconBtn as any} onClick={() => navigate(-1)}>←</button>
        <h1 style={styles.title as any}>Profile</h1>
        <div />
      </div>

      <div style={{ padding: 16 }}>
        <div style={styles.sectionTitle as any}>Update Information</div>
        <input style={styles.input as any} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input style={styles.input as any} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={styles.input as any} placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <button style={styles.btn as any} onClick={updateProfile}>Update Profile</button>

        <div style={styles.sectionTitle as any}>Change Password</div>
        <input style={styles.input as any} placeholder="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <input style={styles.input as any} placeholder="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <button style={styles.btn as any} onClick={updatePassword}>Update Password</button>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#121212', color: '#fff', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  topbar: {
    display: 'grid', gridTemplateColumns: '48px 1fr 48px', alignItems: 'center', height: 56, padding: '0 12px',
    borderBottom: '1px solid #1E2429', position: 'sticky', top: 0, background: '#121212'
  },
  title: { textAlign: 'center', margin: 0, fontSize: 18, fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600 },
  iconBtn: { background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  sectionTitle: { color: '#bbb', margin: '16px 0', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  input: { width: '100%', background: '#1E2429', border: '1px solid #1E2429', borderRadius: 8, padding: '12px 14px', marginBottom: 12, color: '#fff', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  btn: { background: '#4CAF50', border: 'none', padding: '12px 14px', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer', marginBottom: 16, fontFamily: "'Poppins', 'Roboto', sans-serif" },
}



