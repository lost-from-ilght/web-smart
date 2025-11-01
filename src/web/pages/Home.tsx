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

  const handleCurtain = async (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    if (!room) return
    
    const states = ['open', 'halfClose', 'close']
    const cur = room.command.smartCurtain
    const next = states[(states.indexOf(cur) + 1) % states.length] as any
    
    try {
      await api.updateRoomCommand(roomId, { smartCurtain: next })
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
                  <div style={styles.statValue as any}>{room.command?.tempratureSensor ?? 'N/A'}°C</div>
                </div>
                <div style={styles.stat as any}>
                  <span>💧</span>
                  <div style={styles.statValue as any}>{room.command?.humidtySensor ?? 'N/A'}%</div>
                </div>
              </div>
              
              <div style={styles.devicesGrid as any} className="devices-grid">
                {/* Switches (Lights) */}
                {(room.switches || []).map((switchDevice: any, idx: number) => (
                  <button 
                    key={`switch-${switchDevice.id}-${idx}`} 
                    style={{ 
                      ...(styles.deviceCard as any), 
                      ...(switchDevice.value > 0 ? (styles.deviceCardActive as any) : {}) 
                    }} 
                    onClick={() => {
                      const newValue = switchDevice.value > 0 ? 0 : 100
                      api.updateSwitch(switchDevice.id, newValue, switchDevice.name, switchDevice.description)
                        .then(() => {
                          let homeId = user.user?.home_id
                          if (!homeId || homeId === 'mock-home-id' || homeId === 'undefined' || homeId === 'null') {
                            homeId = DEFAULT_HOME_ID
                          }
                          return api.getRooms(homeId)
                        })
                        .then((data) => {
                          if (!data) return
                          // Preserve the original order by matching with existing rooms
                          const updatedRooms = data.map((newRoom: any) => {
                            const existingRoom = rooms.find((r: any) => r.id === newRoom.id)
                            if (!existingRoom) return newRoom
                            
                            // Preserve order of devices by matching IDs with existing room
                            const orderedRoom = { ...newRoom }
                            if (existingRoom.switches && newRoom.switches) {
                              orderedRoom.switches = existingRoom.switches.map((existing: any) => 
                                newRoom.switches.find((s: any) => s.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.switches.filter((s: any) => !existingRoom.switches.some((e: any) => e.id === s.id))
                              )
                            }
                            if (existingRoom.onoffs && newRoom.onoffs) {
                              orderedRoom.onoffs = existingRoom.onoffs.map((existing: any) => 
                                newRoom.onoffs.find((o: any) => o.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.onoffs.filter((o: any) => !existingRoom.onoffs.some((e: any) => e.id === o.id))
                              )
                            }
                            if (existingRoom.acs && newRoom.acs) {
                              orderedRoom.acs = existingRoom.acs.map((existing: any) => 
                                newRoom.acs.find((a: any) => a.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.acs.filter((a: any) => !existingRoom.acs.some((e: any) => e.id === a.id))
                              )
                            }
                            if (existingRoom.musics && newRoom.musics) {
                              orderedRoom.musics = existingRoom.musics.map((existing: any) => 
                                newRoom.musics.find((m: any) => m.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.musics.filter((m: any) => !existingRoom.musics.some((e: any) => e.id === m.id))
                              )
                            }
                            if (existingRoom.tvs && newRoom.tvs) {
                              orderedRoom.tvs = existingRoom.tvs.map((existing: any) => 
                                newRoom.tvs.find((t: any) => t.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.tvs.filter((t: any) => !existingRoom.tvs.some((e: any) => e.id === t.id))
                              )
                            }
                            return orderedRoom
                          })
                          setRooms(updatedRooms)
                        })
                        .catch(console.error)
                    }}
                  >
                    <div style={{ fontSize: '20px', color: switchDevice.value > 0 ? '#4CAF50' : '#666' }}>💡</div>
                    <div style={{ marginTop: 4, fontWeight: 600 }}>{switchDevice.name}</div>
                    <div style={{ fontSize: '12px', color: '#ccc' }}>{switchDevice.value > 0 ? 'ON' : 'OFF'}</div>
                  </button>
                ))}

                {/* On/Off Devices */}
                {(room.onoffs || []).map((onoff: any, idx: number) => (
                  <button 
                    key={`onoff-${onoff.id}-${idx}`} 
                    style={{ 
                      ...(styles.deviceCard as any), 
                      ...(onoff.value ? (styles.deviceCardActive as any) : {}) 
                    }} 
                    onClick={() => {
                      api.updateOnOff(onoff.id, !onoff.value, onoff.name)
                        .then(() => {
                          let homeId = user.user?.home_id
                          if (!homeId || homeId === 'mock-home-id' || homeId === 'undefined' || homeId === 'null') {
                            homeId = DEFAULT_HOME_ID
                          }
                          return api.getRooms(homeId)
                        })
                        .then((data) => {
                          if (!data) return
                          // Preserve the original order by matching with existing rooms
                          const updatedRooms = data.map((newRoom: any) => {
                            const existingRoom = rooms.find((r: any) => r.id === newRoom.id)
                            if (!existingRoom) return newRoom
                            
                            // Preserve order of devices by matching IDs with existing room
                            const orderedRoom = { ...newRoom }
                            if (existingRoom.switches && newRoom.switches) {
                              orderedRoom.switches = existingRoom.switches.map((existing: any) => 
                                newRoom.switches.find((s: any) => s.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.switches.filter((s: any) => !existingRoom.switches.some((e: any) => e.id === s.id))
                              )
                            }
                            if (existingRoom.onoffs && newRoom.onoffs) {
                              orderedRoom.onoffs = existingRoom.onoffs.map((existing: any) => 
                                newRoom.onoffs.find((o: any) => o.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.onoffs.filter((o: any) => !existingRoom.onoffs.some((e: any) => e.id === o.id))
                              )
                            }
                            if (existingRoom.acs && newRoom.acs) {
                              orderedRoom.acs = existingRoom.acs.map((existing: any) => 
                                newRoom.acs.find((a: any) => a.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.acs.filter((a: any) => !existingRoom.acs.some((e: any) => e.id === a.id))
                              )
                            }
                            if (existingRoom.musics && newRoom.musics) {
                              orderedRoom.musics = existingRoom.musics.map((existing: any) => 
                                newRoom.musics.find((m: any) => m.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.musics.filter((m: any) => !existingRoom.musics.some((e: any) => e.id === m.id))
                              )
                            }
                            if (existingRoom.tvs && newRoom.tvs) {
                              orderedRoom.tvs = existingRoom.tvs.map((existing: any) => 
                                newRoom.tvs.find((t: any) => t.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.tvs.filter((t: any) => !existingRoom.tvs.some((e: any) => e.id === t.id))
                              )
                            }
                            return orderedRoom
                          })
                          setRooms(updatedRooms)
                        })
                        .catch(console.error)
                    }}
                  >
                    <div style={{ fontSize: '20px', color: onoff.value ? '#4CAF50' : '#666' }}>⚡</div>
                    <div style={{ marginTop: 4, fontWeight: 600 }}>{onoff.name}</div>
                    <div style={{ fontSize: '12px', color: '#ccc' }}>{onoff.value ? 'ON' : 'OFF'}</div>
                  </button>
                ))}

                {/* ACs */}
                {(room.acs || []).map((ac: any, idx: number) => (
                  <div key={`ac-${ac.id}-${idx}`} style={styles.deviceCard as any}>
                    <div style={{ fontSize: '20px', color: ac.value > 0 ? '#4CAF50' : '#666' }}>❄️</div>
                    <div style={{ marginTop: 4, fontWeight: 600 }}>{ac.name || 'AC'}</div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={ac.value || 0}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value)
                        api.updateAc(ac.id, newValue, ac.name)
                          .then(() => {
                            let homeId = user.user?.home_id
                            if (!homeId || homeId === 'mock-home-id' || homeId === 'undefined' || homeId === 'null') {
                              homeId = DEFAULT_HOME_ID
                            }
                            return api.getRooms(homeId)
                          })
                          .then((data) => {
                          if (!data) return
                          // Preserve the original order by matching with existing rooms
                          const updatedRooms = data.map((newRoom: any) => {
                            const existingRoom = rooms.find((r: any) => r.id === newRoom.id)
                            if (!existingRoom) return newRoom
                            
                            // Preserve order of devices by matching IDs with existing room
                            const orderedRoom = { ...newRoom }
                            if (existingRoom.switches && newRoom.switches) {
                              orderedRoom.switches = existingRoom.switches.map((existing: any) => 
                                newRoom.switches.find((s: any) => s.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.switches.filter((s: any) => !existingRoom.switches.some((e: any) => e.id === s.id))
                              )
                            }
                            if (existingRoom.onoffs && newRoom.onoffs) {
                              orderedRoom.onoffs = existingRoom.onoffs.map((existing: any) => 
                                newRoom.onoffs.find((o: any) => o.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.onoffs.filter((o: any) => !existingRoom.onoffs.some((e: any) => e.id === o.id))
                              )
                            }
                            if (existingRoom.acs && newRoom.acs) {
                              orderedRoom.acs = existingRoom.acs.map((existing: any) => 
                                newRoom.acs.find((a: any) => a.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.acs.filter((a: any) => !existingRoom.acs.some((e: any) => e.id === a.id))
                              )
                            }
                            if (existingRoom.musics && newRoom.musics) {
                              orderedRoom.musics = existingRoom.musics.map((existing: any) => 
                                newRoom.musics.find((m: any) => m.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.musics.filter((m: any) => !existingRoom.musics.some((e: any) => e.id === m.id))
                              )
                            }
                            if (existingRoom.tvs && newRoom.tvs) {
                              orderedRoom.tvs = existingRoom.tvs.map((existing: any) => 
                                newRoom.tvs.find((t: any) => t.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.tvs.filter((t: any) => !existingRoom.tvs.some((e: any) => e.id === t.id))
                              )
                            }
                            return orderedRoom
                          })
                          setRooms(updatedRooms)
                        })
                          .catch(console.error)
                      }}
                      style={{ width: '100%', marginTop: 8 }}
                    />
                    <div style={{ fontSize: '12px', color: '#ccc', marginTop: 4 }}>{Math.round(ac.value || 0)}%</div>
                  </div>
                ))}

                {/* Music Devices */}
                {(room.musics || []).map((music: any, idx: number) => (
                  <button 
                    key={`music-${music.id}-${idx}`} 
                    style={{ 
                      ...(styles.deviceCard as any), 
                      ...(music.playing ? (styles.deviceCardActive as any) : {}) 
                    }} 
                    onClick={() => {
                      api.updateMusic(music.id, music.volume || 50, !music.playing, music.name)
                        .then(() => {
                          let homeId = user.user?.home_id
                          if (!homeId || homeId === 'mock-home-id' || homeId === 'undefined' || homeId === 'null') {
                            homeId = DEFAULT_HOME_ID
                          }
                          return api.getRooms(homeId)
                        })
                        .then((data) => {
                          if (!data) return
                          // Preserve the original order by matching with existing rooms
                          const updatedRooms = data.map((newRoom: any) => {
                            const existingRoom = rooms.find((r: any) => r.id === newRoom.id)
                            if (!existingRoom) return newRoom
                            
                            // Preserve order of devices by matching IDs with existing room
                            const orderedRoom = { ...newRoom }
                            if (existingRoom.switches && newRoom.switches) {
                              orderedRoom.switches = existingRoom.switches.map((existing: any) => 
                                newRoom.switches.find((s: any) => s.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.switches.filter((s: any) => !existingRoom.switches.some((e: any) => e.id === s.id))
                              )
                            }
                            if (existingRoom.onoffs && newRoom.onoffs) {
                              orderedRoom.onoffs = existingRoom.onoffs.map((existing: any) => 
                                newRoom.onoffs.find((o: any) => o.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.onoffs.filter((o: any) => !existingRoom.onoffs.some((e: any) => e.id === o.id))
                              )
                            }
                            if (existingRoom.acs && newRoom.acs) {
                              orderedRoom.acs = existingRoom.acs.map((existing: any) => 
                                newRoom.acs.find((a: any) => a.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.acs.filter((a: any) => !existingRoom.acs.some((e: any) => e.id === a.id))
                              )
                            }
                            if (existingRoom.musics && newRoom.musics) {
                              orderedRoom.musics = existingRoom.musics.map((existing: any) => 
                                newRoom.musics.find((m: any) => m.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.musics.filter((m: any) => !existingRoom.musics.some((e: any) => e.id === m.id))
                              )
                            }
                            if (existingRoom.tvs && newRoom.tvs) {
                              orderedRoom.tvs = existingRoom.tvs.map((existing: any) => 
                                newRoom.tvs.find((t: any) => t.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.tvs.filter((t: any) => !existingRoom.tvs.some((e: any) => e.id === t.id))
                              )
                            }
                            return orderedRoom
                          })
                          setRooms(updatedRooms)
                        })
                        .catch(console.error)
                    }}
                  >
                    <div style={{ fontSize: '20px', color: music.playing ? '#4CAF50' : '#666' }}>🎵</div>
                    <div style={{ marginTop: 4, fontWeight: 600 }}>{music.name || 'Music'}</div>
                    <div style={{ fontSize: '12px', color: '#ccc' }}>{music.playing ? 'Playing' : 'Stopped'}</div>
                  </button>
                ))}

                {/* TVs */}
                {(room.tvs || []).map((tv: any, idx: number) => (
                  <button 
                    key={`tv-${tv.id}-${idx}`} 
                    style={{ 
                      ...(styles.deviceCard as any), 
                      ...(tv.isOn ? (styles.deviceCardActive as any) : {}) 
                    }} 
                    onClick={() => {
                      api.updateTv(tv.id, tv.channel || 1, tv.volume || 50, !tv.isOn, tv.name)
                        .then(() => {
                          let homeId = user.user?.home_id
                          if (!homeId || homeId === 'mock-home-id' || homeId === 'undefined' || homeId === 'null') {
                            homeId = DEFAULT_HOME_ID
                          }
                          return api.getRooms(homeId)
                        })
                        .then((data) => {
                          if (!data) return
                          // Preserve the original order by matching with existing rooms
                          const updatedRooms = data.map((newRoom: any) => {
                            const existingRoom = rooms.find((r: any) => r.id === newRoom.id)
                            if (!existingRoom) return newRoom
                            
                            // Preserve order of devices by matching IDs with existing room
                            const orderedRoom = { ...newRoom }
                            if (existingRoom.switches && newRoom.switches) {
                              orderedRoom.switches = existingRoom.switches.map((existing: any) => 
                                newRoom.switches.find((s: any) => s.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.switches.filter((s: any) => !existingRoom.switches.some((e: any) => e.id === s.id))
                              )
                            }
                            if (existingRoom.onoffs && newRoom.onoffs) {
                              orderedRoom.onoffs = existingRoom.onoffs.map((existing: any) => 
                                newRoom.onoffs.find((o: any) => o.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.onoffs.filter((o: any) => !existingRoom.onoffs.some((e: any) => e.id === o.id))
                              )
                            }
                            if (existingRoom.acs && newRoom.acs) {
                              orderedRoom.acs = existingRoom.acs.map((existing: any) => 
                                newRoom.acs.find((a: any) => a.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.acs.filter((a: any) => !existingRoom.acs.some((e: any) => e.id === a.id))
                              )
                            }
                            if (existingRoom.musics && newRoom.musics) {
                              orderedRoom.musics = existingRoom.musics.map((existing: any) => 
                                newRoom.musics.find((m: any) => m.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.musics.filter((m: any) => !existingRoom.musics.some((e: any) => e.id === m.id))
                              )
                            }
                            if (existingRoom.tvs && newRoom.tvs) {
                              orderedRoom.tvs = existingRoom.tvs.map((existing: any) => 
                                newRoom.tvs.find((t: any) => t.id === existing.id) || existing
                              ).filter(Boolean).concat(
                                newRoom.tvs.filter((t: any) => !existingRoom.tvs.some((e: any) => e.id === t.id))
                              )
                            }
                            return orderedRoom
                          })
                          setRooms(updatedRooms)
                        })
                        .catch(console.error)
                    }}
                  >
                    <div style={{ fontSize: '20px', color: tv.isOn ? '#4CAF50' : '#666' }}>📺</div>
                    <div style={{ marginTop: 4, fontWeight: 600 }}>{tv.name || 'TV'}</div>
                    <div style={{ fontSize: '12px', color: '#ccc' }}>{tv.isOn ? 'ON' : 'OFF'}</div>
                  </button>
                ))}

                {/* Gas and Smoke Sensors */}
                {(room.gases || []).map((gas: any, idx: number) => (
                  <div key={gas.id || idx} style={styles.deviceCard as any}>
                    <div style={{ fontSize: '20px', color: gas.alertTriggered ? '#FF5722' : '#666' }}>💨</div>
                    <div style={{ marginTop: 4, fontWeight: 600 }}>Gas Sensor</div>
                    <div style={{ fontSize: '12px', color: gas.alertTriggered ? '#FF5722' : '#ccc' }}>
                      {gas.alertTriggered ? 'Alert!' : `Value: ${gas.value || 0}`}
                    </div>
                  </div>
                ))}
                {(room.smokes || []).map((smoke: any, idx: number) => (
                  <div key={smoke.id || idx} style={styles.deviceCard as any}>
                    <div style={{ fontSize: '20px', color: smoke.alertTriggered ? '#FF5722' : '#666' }}>🔥</div>
                    <div style={{ marginTop: 4, fontWeight: 600 }}>Smoke Sensor</div>
                    <div style={{ fontSize: '12px', color: smoke.alertTriggered ? '#FF5722' : '#ccc' }}>
                      {smoke.alertTriggered ? 'Alert!' : `Value: ${smoke.value || 0}`}
                    </div>
                  </div>
                ))}

                {/* Command-based controls (door, smartCurtain, etc.) - only show if active */}
                {room.activities && Object.entries(room.activities).map(([key, isActive]: [string, any]) => {
                  if (!isActive) return null
                  const state = (room.command as any)?.[key]
                  
                  if (key === 'smartCurtain') {
                    const active = isDeviceActive(key, state)
                    return (
                      <button key={key} style={{ ...(styles.deviceCard as any), ...(active ? (styles.deviceCardActive as any) : {}) }} onClick={() => handleCurtain(room.id)}>
                        <div style={{ fontSize: '20px' }}>🪟</div>
                        <div style={{ marginTop: 4, fontWeight: 600 }}>Smart Curtain</div>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{state || 'closed'}</div>
                      </button>
                    )
                  }
                  
                  if (['door', 'charger', 'stove', 'oven', 'freezer', 'fan', 'plantWateringPump'].includes(key)) {
                    const active = isDeviceActive(key, state)
                    return (
                      <button key={key} style={{ ...(styles.deviceCard as any), ...(active ? (styles.deviceCardActive as any) : {}) }} onClick={() => toggleKey(room.id, key as any)}>
                        <div style={{ fontSize: '20px', color: active ? '#4CAF50' : '#666' }}>
                          {key === 'door' ? '🚪' : key === 'charger' ? '🔌' : key === 'stove' ? '🔥' : key === 'oven' ? '🔥' : key === 'freezer' ? '🧊' : key === 'fan' ? '🌀' : '🌱'}
                        </div>
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


