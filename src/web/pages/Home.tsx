import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import type { Room as RoomType } from '../lib/types'

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('@user_data')
    // Removed authentication check - bypassing login
    // if (!userData) return navigate('/login', { replace: true })
    let parsed
    if (!userData) {
      // Set up mock user data if not present
      const mockUser = {
        user: {
          id: 'mock-user-id',
          name: 'Tad',
          email: 'tad@example.com',
          phoneNumber: '+1234567890',
          home_id: 'mock-home-id'
        }
      }
      localStorage.setItem('userId', mockUser.user.id)
      localStorage.setItem('@user_data', JSON.stringify(mockUser))
      setUser(mockUser)
      parsed = mockUser
    } else {
      parsed = JSON.parse(userData)
      setUser(parsed)
    }
    const homeId = parsed.user.home_id
    
    // Mock data for test user
    if (homeId === 'mock-home-id') {
      const mockRooms = [
        {
          id: 'room-1',
          name: 'Living Room',
          command: {
            tempratureSensor: 22,
            humidtySensor: 45,
            mainLight: 'off',
            sideLight: 'off',
            ac: 0,
            charger: 'off',
            music: 'off',
            tv: 'off',
            door: 'off',
            smartCurtain: 'closed',
            plantWateringPump: 'off',
            stove: 'off',
            oven: 'off',
            freezer: 'off',
            fan: 'off',
          },
          activities: {
            mainLight: true,
            sideLight: true,
            ac: true,
            charger: true,
            music: true,
            tv: true,
            door: true,
            smartCurtain: true,
            plantWateringPump: true,
            stove: true,
            oven: true,
            freezer: true,
            fan: true,
          }
        },
        {
          id: 'room-2',
          name: 'Bed Room',
          command: {
            tempratureSensor: 20,
            humidtySensor: 50,
            mainLight: 'off',
            sideLight: 'off',
            ac: 0,
            charger: 'off',
            music: 'off',
            tv: 'off',
            door: 'off',
            smartCurtain: 'closed',
            plantWateringPump: 'off',
            stove: 'off',
            oven: 'off',
            freezer: 'off',
            fan: 'off',
          },
          activities: {
            mainLight: true,
            sideLight: true,
            ac: true,
            charger: true,
            music: true,
            tv: true,
            door: true,
            smartCurtain: true,
            plantWateringPump: true,
            stove: true,
            oven: true,
            freezer: true,
            fan: true,
          }
        },
        {
          id: 'room-3',
          name: 'Kitchen',
          command: {
            tempratureSensor: 25,
            humidtySensor: 40,
            mainLight: 'off',
            sideLight: 'off',
            ac: 0,
            charger: 'off',
            music: 'off',
            tv: 'off',
            door: 'off',
            smartCurtain: 'closed',
            plantWateringPump: 'off',
            stove: 'off',
            oven: 'off',
            freezer: 'off',
            fan: 'off',
          },
          activities: {
            mainLight: true,
            sideLight: true,
            ac: true,
            charger: true,
            music: true,
            tv: true,
            door: true,
            smartCurtain: true,
            plantWateringPump: true,
            stove: true,
            oven: true,
            freezer: true,
            fan: true,
          }
        },
        {
          id: 'room-4',
          name: 'Bath Room',
          command: {
            tempratureSensor: 24,
            humidtySensor: 60,
            mainLight: 'off',
            sideLight: 'off',
            ac: 0,
            charger: 'off',
            music: 'off',
            tv: 'off',
            door: 'off',
            smartCurtain: 'closed',
            plantWateringPump: 'off',
            stove: 'off',
            oven: 'off',
            freezer: 'off',
            fan: 'off',
          },
          activities: {
            mainLight: true,
            sideLight: true,
            ac: true,
            charger: true,
            music: true,
            tv: true,
            door: true,
            smartCurtain: true,
            plantWateringPump: true,
            stove: true,
            oven: true,
            freezer: true,
            fan: true,
          }
        },
        {
          id: 'room-5',
          name: 'Store Room',
          command: {
            tempratureSensor: 18,
            humidtySensor: 35,
            mainLight: 'off',
            sideLight: 'off',
            ac: 0,
            charger: 'off',
            music: 'off',
            tv: 'off',
            door: 'off',
            smartCurtain: 'closed',
            plantWateringPump: 'off',
            stove: 'off',
            oven: 'off',
            freezer: 'off',
            fan: 'off',
          },
          activities: {
            mainLight: true,
            sideLight: true,
            ac: true,
            charger: true,
            music: true,
            tv: true,
            door: true,
            smartCurtain: true,
            plantWateringPump: true,
            stove: true,
            oven: true,
            freezer: true,
            fan: true,
          }
        },
        {
          id: 'room-6',
          name: 'Outdoor',
          command: {
            tempratureSensor: 15,
            humidtySensor: 70,
            mainLight: 'off',
            sideLight: 'off',
            ac: 0,
            charger: 'off',
            music: 'off',
            tv: 'off',
            door: 'off',
            smartCurtain: 'closed',
            plantWateringPump: 'off',
            stove: 'off',
            oven: 'off',
            freezer: 'off',
            fan: 'off',
          },
          activities: {
            mainLight: true,
            sideLight: true,
            ac: true,
            charger: true,
            music: true,
            tv: true,
            door: true,
            smartCurtain: true,
            plantWateringPump: true,
            stove: true,
            oven: true,
            freezer: true,
            fan: true,
          }
        }
      ]
      setRooms(mockRooms)
      setLoading(false)
      return
    }
    
    ;(async () => {
      try {
        const data = await api.getRooms(homeId)
        setRooms(data || [])
      } catch (_) {}
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
    
    // Mock update for test rooms
    if (roomId.startsWith('room-')) {
      setRooms(prev => prev.map(r => 
        r.id === roomId 
          ? { ...r, command: { ...r.command, [key]: next } }
          : r
      ))
      return
    }
    
    try {
      await api.updateRoomCommand(roomId, { [key]: next } as any)
      const data = await api.getRooms(user.user.home_id)
      setRooms(data || [])
    } catch {}
  }

  const handleCurtain = async (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    if (!room) return
    
    const states = ['open', 'halfClose', 'close']
    const cur = room.command.smartCurtain
    const next = states[(states.indexOf(cur) + 1) % states.length] as any
    
    // Mock update for test rooms
    if (roomId.startsWith('room-')) {
      setRooms(prev => prev.map(r => 
        r.id === roomId 
          ? { ...r, command: { ...r.command, smartCurtain: next } }
          : r
      ))
      return
    }
    
    try {
      await api.updateRoomCommand(roomId, { smartCurtain: next })
      const data = await api.getRooms(user.user.home_id)
      setRooms(data || [])
    } catch {}
  }

  const isDeviceActive = (deviceKey: string, value: any) => {
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value > 0
    if (typeof value === 'string') {
      const v = value.toLowerCase()
      if (deviceKey === 'smartCurtain') return v !== 'closed' && v !== 'close'
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
              <div style={styles.roomStats as any}>
                <div style={styles.stat as any}>
                  <span>🌡️</span>
                  <div style={styles.statValue as any}>{room.command.tempratureSensor ?? 'N/A'}°C</div>
                </div>
                <div style={styles.stat as any}>
                  <span>💧</span>
                  <div style={styles.statValue as any}>{room.command.humidtySensor ?? 'N/A'}%</div>
                </div>
              </div>
              
              <div style={styles.devicesGrid as any} className="devices-grid">
                {Object.entries(room.activities || {}).map(([key, isActive]) => {
                  if (!isActive) return null
                  const state = (room.command as any)[key]
                  
                  if (key === 'ac') {
                    return (
                      <div key={key} style={styles.deviceCard as any}>
                        <div style={{ color: state > 0 ? '#4CAF50' : '#666', fontSize: '20px' }}>❄️</div>
                        <div style={{ marginTop: 4 }}>AC</div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          defaultValue={state ?? 0}
                          onMouseUp={() => toggleKey(room.id, 'ac')}
                          style={{ width: '100%', marginTop: 8 }}
                        />
                      </div>
                    )
                  }
                  
                  if (key === 'smartCurtain') {
                    const active = isDeviceActive(key as string, state)
                    return (
                      <button key={key} style={{ ...(styles.deviceCard as any), ...(active ? (styles.deviceCardActive as any) : {}) }} onClick={() => handleCurtain(room.id)}>
                        <div style={{ fontSize: '20px' }}>🪟</div>
                        <div style={{ marginTop: 4 }}>Smart Curtain</div>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{state}</div>
                      </button>
                    )
                  }
                  
                  if (['gases', 'smokes'].includes(key)) {
                    const alert = (room as any)[key]?.[0]?.alertTriggered ?? false
                    const value = (room as any)[key]?.[0]?.value ?? 0
                    return (
                      <div key={key} style={styles.deviceCard as any}>
                        <div style={{ fontSize: '20px' }}>
                          {key === 'gases' ? '💨' : '🔥'}
                        </div>
                        <div style={{ marginTop: 4 }}>{key}</div>
                        <div style={{ color: alert ? '#FF5722' : value > 0 ? '#4CAF50' : '#666', fontSize: '12px' }}>
                          {alert ? 'Alert!' : `Value: ${value}`}
                        </div>
                      </div>
                    )
                  }
                  
                  // Get appropriate icon for each device
                  const getIcon = (deviceKey: string) => {
                    if (deviceKey.includes('Light')) return '💡'
                    if (deviceKey === 'door') return '🚪'
                    if (deviceKey === 'music') return '🎵'
                    if (deviceKey === 'tv') return '📺'
                    if (deviceKey === 'charger') return '🔌'
                    if (deviceKey === 'plantWateringPump') return '🌱'
                    if (deviceKey === 'stove') return '🔥'
                    if (deviceKey === 'oven') return '🔥'
                    if (deviceKey === 'freezer') return '🧊'
                    if (deviceKey === 'fan') return '🌀'
                    return '⚡'
                  }
                  
                  const active = isDeviceActive(key as string, state)
                  return (
                    <button key={key} style={{ ...(styles.deviceCard as any), ...(active ? (styles.deviceCardActive as any) : {}) }} onClick={() => toggleKey(room.id, key as any)}>
                      <div style={{ fontSize: '20px', color: state === 'on' || state === true ? '#4CAF50' : '#666' }}>
                        {getIcon(key)}
                      </div>
                      <div style={{ marginTop: 4 }}>{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div style={{ fontSize: '12px', color: '#ccc' }}>{String(state)}</div>
                    </button>
                  )
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
  roomStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 },
  stat: { background: '#1E2429', borderRadius: 12, padding: 16, textAlign: 'center', color: '#fff', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  statValue: { fontWeight: 700, marginTop: 4, fontFamily: "'Poppins', 'Roboto', sans-serif" },
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


