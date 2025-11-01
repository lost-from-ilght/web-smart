import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, DEFAULT_HOME_ID } from '../lib/api'

export default function Notifications() {
  const navigate = useNavigate()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('@user_data')
    if (!stored) return navigate('/login', { replace: true })
    const user = JSON.parse(stored)
    let homeId = user.user?.home_id
    if (!homeId || homeId === 'mock-home-id' || homeId === 'undefined' || homeId === 'null') {
      homeId = DEFAULT_HOME_ID
    }
    ;(async () => {
      try {
        const data = await api.getNotfications(homeId)
        setItems(data || [])
      } catch {}
      setLoading(false)
    })()
  }, [navigate])

  const markRead = async (id: string) => {
    await api.readNotfications(id)
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)))
  }

  return (
    <div style={styles.wrapper as any}>
      <div style={styles.topbar as any}>
        <button style={styles.iconBtn as any} onClick={() => navigate(-1)}>←</button>
        <h1 style={styles.title as any}>Notifications</h1>
        <div />
      </div>
      <div style={{ padding: 16 }}>
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div style={{ color: '#999' }}>No notifications</div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {items.map((n) => (
              <div key={n.id} style={styles.row as any}>
                <div>
                  <div style={{ fontWeight: 700 }}>{n.title || 'Alert'}</div>
                  <div style={{ color: '#ccc' }}>{n.message || n.body}</div>
                </div>
                {!n.read && (
                  <button style={styles.smallBtn as any} onClick={() => markRead(n.id)}>Mark read</button>
                )}
              </div>
            ))}
          </div>
        )}
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
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1E2429', padding: 12, borderRadius: 10, fontFamily: "'Poppins', 'Roboto', sans-serif" },
  smallBtn: { background: '#4CAF50', border: 'none', padding: '8px 10px', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', 'Roboto', sans-serif" },
}



