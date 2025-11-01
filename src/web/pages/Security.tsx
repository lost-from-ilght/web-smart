import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Security() {
  const navigate = useNavigate()
  const [danger, setDanger] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('@user_data')
    if (!stored) return navigate('/login', { replace: true })
    const user = JSON.parse(stored)
    ;(async () => {
      try {
        const data = await api.getDanger(user.user.home_id)
        setDanger(data?.[0])
      } catch {}
      setLoading(false)
    })()
  }, [navigate])

  const toggle = async (key: 'sound' | 'alert') => {
    if (!danger) return
    const next = danger[key] === 'on' ? 'off' : 'on'
    await api.updateDanger(danger.id, { [key]: next })
    setDanger({ ...danger, [key]: next })
  }

  if (loading) return <div style={styles.wrapper as any}>Loading...</div>
  if (!danger) return <div style={styles.wrapper as any}>No danger device found.</div>

  return (
    <div style={styles.wrapper as any}>
      <div style={styles.topbar as any}>
        <button style={styles.iconBtn as any} onClick={() => navigate(-1)}>←</button>
        <h1 style={styles.title as any}>Danger Fence Control</h1>
        <div />
      </div>
      <div style={{ padding: 16, display: 'grid', gap: 12 }}>
        <button style={styles.row as any} onClick={() => toggle('sound')}>
          {danger.sound === 'on' ? '🔊 Sound: ON' : '🔇 Sound: OFF'}
        </button>
        <button style={styles.row as any} onClick={() => toggle('alert')}>
          {danger.alert === 'on' ? '🚨 Alert: ON' : '⚠️ Alert: OFF'}
        </button>
      </div>
      <div style={styles.tabs as any}>
        <button style={styles.tab as any} onClick={() => navigate('/')}>🏠 Home</button>
        <button style={styles.tabActive as any}>🛡️ Security</button>
        <button style={styles.tab as any} onClick={() => navigate('/settings')}>⚙️ Settings</button>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#121212', color: '#fff', paddingBottom: 72, fontFamily: "'Poppins', 'Roboto', sans-serif" },
  topbar: {
    display: 'grid', gridTemplateColumns: '48px 1fr 48px', alignItems: 'center', height: 56, padding: '0 12px',
    borderBottom: '1px solid #1E2429', position: 'sticky', top: 0, background: '#121212'
  },
  title: { textAlign: 'center', margin: 0, fontSize: 18, fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600 },
  iconBtn: { background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  row: { background: '#1E2429', color: '#fff', border: 'none', padding: '16px 14px', borderRadius: 10, textAlign: 'left', cursor: 'pointer', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  tabs: { position: 'fixed', bottom: 0, left: 0, right: 0, height: 56, background: '#1E2429', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' },
  tab: { background: 'transparent', border: 'none', color: '#888', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  tabActive: { background: 'transparent', border: 'none', color: '#4CAF50', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', 'Roboto', sans-serif" },
}



