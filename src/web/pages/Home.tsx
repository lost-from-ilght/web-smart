import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, DEFAULT_HOME_ID } from '../lib/api'
import type { Room as RoomType } from '../lib/types'

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('@user_data')
    if (!userData) return navigate('/login', { replace: true })
    
    const parsed = JSON.parse(userData)
    setUser(parsed)
    // Always use DEFAULT_HOME_ID if home_id is missing, null, undefined, or 'mock-home-id'
    let homeId = parsed.user?.home_id
    if (!homeId || homeId === 'mock-home-id' || homeId === 'undefined' || homeId === 'null') {
      homeId = DEFAULT_HOME_ID
    }
    
    ;(async () => {
      try {
        const data = await api.getRooms(homeId)
        setRooms(data || [])
      } catch (err) {
        console.error('Error fetching rooms:', err)
      }
      setLoading(false)
    })()
  }, [navigate])

  const toggleKey = async (roomId: string, key: keyof RoomType['command']) => {
    const room = rooms.find(r => r.id === roomId)
    if (!room) return
    
    const cur = (room.command as any)[key]
    let next: any
    if (typeof cur === 'boolean') next = !cur
    else if (typeof cur === 'number') next = cur > 0 ? 0 : 100
    else next = cur === 'off' ? 'on' : 'off'
    
    try {
      await api.updateRoomCommand(roomId, { [key]: next } as any)
      let homeId = user.user?.home_id
      if (!homeId || homeId === 'mock-home-id' || homeId === 'undefined' || homeId === 'null') {
        homeId = DEFAULT_HOME_ID
      }
      const data = await api.getRooms(homeId)
      setRooms(data || [])
    } catch {}
  }

  const isDeviceActive = (deviceKey: string, value: any) => {
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value > 0
    if (typeof value === 'string') {
      const v = value.toLowerCase()
      return v === 'on' || v === 'unlock' || v === 'open'
    }
    return false
  }

  return (
    <div style={styles.wrapper as any}>
      <div style={styles.topbar as any}>
        <div />
        <h1 style={styles.title as any}>Home</h1>
        <button style={styles.iconBtn as any} onClick={() => navigate('/notifications')}>
          🔔
        </button>
      </div>
      {loading ? (
        <div style={styles.loading as any}>Loading...</div>
      ) : (
        <>
          <p style={styles.greeting as any}>Hi, {user?.user?.name}</p>
          <p style={styles.subtitle as any}>Ready to control your home from your browser?</p>
          
          {rooms.map((room) => (
            <div key={room.id} style={styles.roomSection as any}>
              <h2 style={styles.roomTitle as any}>{room.name}</h2>
              
              <div style={styles.devicesGrid as any} className="devices-grid">
                {/* Command-based controls - only show devices that are active in activities */}
                {room.activities && Object.entries(room.activities).map(([key, isActive]: [string, any]) => {
                  if (!isActive) return null
                  const state = (room.command as any)?.[key]
                  
                  // Skip if state is undefined or null
                  if (state === undefined || state === null) return null
                  
                  // Master Bath Light
                  if (key === 'masterBathLight') {
                    const active = isDeviceActive(key, state)
                    return (
                      <button key={key} style={{ ...(styles.deviceCard as any), ...(active ? (styles.deviceCardActive as any) : {}) }} onClick={() => toggleKey(room.id, key as any)}>
                        <div style={{ fontSize: '20px', color: active ? '#4CAF50' : '#666' }}>💡</div>
                        <div style={{ marginTop: 4, fontWeight: 600 }}>Master Bath Light</div>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{String(state || 'off')}</div>
                      </button>
                    )
                  }
                  
                  // Kitchen devices
                  if (key === 'stove' || key === 'stove1' || key === 'stove2') {
                    const active = isDeviceActive(key, state)
                    return (
                      <button key={key} style={{ ...(styles.deviceCard as any), ...(active ? (styles.deviceCardActive as any) : {}) }} onClick={() => toggleKey(room.id, key as any)}>
                        <div style={{ fontSize: '20px', color: active ? '#4CAF50' : '#666' }}>🔥</div>
                        <div style={{ marginTop: 4, fontWeight: 600 }}>{key === 'stove' ? 'Stove' : key === 'stove1' ? 'Stove 1' : 'Stove 2'}</div>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{String(state || 'off')}</div>
                      </button>
                    )
                  }
                  
                  if (key === 'oven') {
                    const active = isDeviceActive(key, state)
                    return (
                      <button key={key} style={{ ...(styles.deviceCard as any), ...(active ? (styles.deviceCardActive as any) : {}) }} onClick={() => toggleKey(room.id, key as any)}>
                        <div style={{ fontSize: '20px', color: active ? '#4CAF50' : '#666' }}>🔥</div>
                        <div style={{ marginTop: 4, fontWeight: 600 }}>Oven</div>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{String(state || 'off')}</div>
                      </button>
                    )
                  }
                  
                  if (key === 'freezer') {
                    const active = isDeviceActive(key, state)
                    return (
                      <button key={key} style={{ ...(styles.deviceCard as any), ...(active ? (styles.deviceCardActive as any) : {}) }} onClick={() => toggleKey(room.id, key as any)}>
                        <div style={{ fontSize: '20px', color: active ? '#4CAF50' : '#666' }}>🧊</div>
                        <div style={{ marginTop: 4, fontWeight: 600 }}>Freezer</div>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{String(state || 'off')}</div>
                      </button>
                    )
                  }
                  
                  if (key === 'fan') {
                    const active = isDeviceActive(key, state)
                    return (
                      <button key={key} style={{ ...(styles.deviceCard as any), ...(active ? (styles.deviceCardActive as any) : {}) }} onClick={() => toggleKey(room.id, key as any)}>
                        <div style={{ fontSize: '20px', color: active ? '#4CAF50' : '#666' }}>🌀</div>
                        <div style={{ marginTop: 4, fontWeight: 600 }}>Fan</div>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{String(state || 'off')}</div>
                      </button>
                    )
                  }
                  
                  // Light devices
                  const lightKeys = ['centerLight', 'spotLight', 'shadowLight', 'diningLight', 'colliderLight', 'strippeLight', 'diningStrippeLight']
                  if (lightKeys.includes(key)) {
                    const active = isDeviceActive(key, state)
                    return (
                      <button key={key} style={{ ...(styles.deviceCard as any), ...(active ? (styles.deviceCardActive as any) : {}) }} onClick={() => toggleKey(room.id, key as any)}>
                        <div style={{ fontSize: '20px', color: active ? '#4CAF50' : '#666' }}>💡</div>
                        <div style={{ marginTop: 4, fontWeight: 600 }}>{key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}</div>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{String(state || 'off')}</div>
                      </button>
                    )
                  }
                  
                  return null
                })}
              </div>
            </div>
          ))}
        </>
      )}
      <div style={styles.tabs as any}>
        <button style={styles.tabActive as any} onClick={() => navigate('/')}>🏠 Home</button>
        <button style={styles.tab as any} onClick={() => navigate('/security')}>🛡️ Security</button>
        <button style={styles.tab as any} onClick={() => navigate('/settings')}>⚙️ Settings</button>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#121212', color: '#fff', paddingBottom: 72, fontFamily: "'Poppins', 'Roboto', sans-serif" },
  topbar: {
    display: 'grid', gridTemplateColumns: '48px 1fr 48px', alignItems: 'center',
    height: 56, padding: '0 12px', borderBottom: '1px solid #1E2429', position: 'sticky', top: 0, background: '#121212'
  },
  title: { textAlign: 'center', margin: 0, fontSize: 18, fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600 },
  iconBtn: { background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  loading: { padding: 24, textAlign: 'center', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  greeting: { fontSize: 24, fontWeight: 700, margin: '16px 16px 4px', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  subtitle: { color: '#bbb', margin: '0 16px 16px', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  roomSection: { marginBottom: 32, padding: '0 16px' },
  roomTitle: { fontSize: 20, fontWeight: 700, margin: '0 0 12px 0', color: '#4CAF50', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  devicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  deviceCard: { 
    background: '#1E2429', 
    border: 'none', 
    borderRadius: 12, 
    padding: 16, 
    textAlign: 'center', 
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: "'Poppins', 'Roboto', sans-serif"
  },
  deviceCardActive: {
    background: '#2E7D32',
    boxShadow: '0 0 0 2px #4CAF50 inset',
    color: '#fff'
  },
  tabs: { position: 'fixed', bottom: 0, left: 0, right: 0, height: 56, background: '#1E2429', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' },
  tab: { background: 'transparent', border: 'none', color: '#888', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  tabActive: { background: 'transparent', border: 'none', color: '#4CAF50', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', 'Roboto', sans-serif" },
}
