import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import type { Room as RoomType } from '../lib/types'

export default function Room() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [room, setRoom] = useState<RoomType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    
    ;(async () => {
      try {
        const data = await api.getRoomById(id)
        setRoom(data)
      } catch (_) {}
      setLoading(false)
    })()
  }, [id])

  const toggleKey = async (key: keyof RoomType['command']) => {
    if (!room) return
    const cur = (room.command as any)[key]
    let next: any
    if (typeof cur === 'boolean') next = !cur
    else if (typeof cur === 'number') next = cur > 0 ? 0 : 100
    else next = cur === 'off' ? 'on' : 'off'
    
    try {
      await api.updateRoomCommand(room.id, { [key]: next } as any)
      const data = await api.getRoomById(room.id)
      setRoom(data)
    } catch {}
  }

  const handleCurtain = async () => {
    if (!room) return
    const states = ['open', 'halfClose', 'close']
    const cur = room.command.smartCurtain
    const next = states[(states.indexOf(cur) + 1) % states.length] as any
    
    try {
      await api.updateRoomCommand(room.id, { smartCurtain: next })
      const data = await api.getRoomById(room.id)
      setRoom(data)
    } catch {}
  }

  if (loading) return <div style={styles.wrapper as any}>Loading...</div>
  if (!room) return <div style={styles.wrapper as any}>Room not found</div>

  const entries = Object.entries((room as any).activities || {})

  return (
    <div style={styles.wrapper as any}>
      <div style={styles.topbar as any}>
        <button style={styles.iconBtn as any} onClick={() => navigate(-1)}>←</button>
        <h1 style={styles.title as any}>{room.name}</h1>
        <div />
      </div>
      <div style={styles.stats as any}>
        <div style={styles.stat as any}>
          <span>🌡️</span>
          <div style={styles.statValue as any}>{room.command.tempratureSensor ?? 'N/A'}°C</div>
        </div>
        <div style={styles.stat as any}>
          <span>💧</span>
          <div style={styles.statValue as any}>{room.command.humidtySensor ?? 'N/A'}%</div>
        </div>
      </div>

      <div style={styles.grid as any}>
        {entries.map(([key, isActive]) => {
          if (!isActive) return null
          const state = (room.command as any)[key]
          if (key === 'ac') {
            return (
              <div key={key} style={styles.stat as any}>
                <div style={{ color: state > 0 ? '#4CAF50' : '#666' }}>AC</div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  defaultValue={state ?? 0}
                  onMouseUp={(e) => toggleKey('ac')}
                />
              </div>
            )
          }
          if (key === 'smartCurtain') {
            return (
              <button key={key} style={styles.stat as any} onClick={handleCurtain}>
                Smart Curtain: {state}
              </button>
            )
          }
          if (['gases', 'smokes'].includes(key)) {
            const alert = (room as any)[key]?.[0]?.alertTriggered ?? false
            const value = (room as any)[key]?.[0]?.value ?? 0
            return (
              <div key={key} style={styles.stat as any}>
                <div>{key}</div>
                <div style={{ color: alert ? '#FF5722' : value > 0 ? '#4CAF50' : '#666' }}>
                  {alert ? 'Alert!' : `Value: ${value}`}
                </div>
              </div>
            )
          }
          return (
            <button key={key} style={styles.stat as any} onClick={() => toggleKey(key as any)}>
              {key}: {String(state)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#121212', color: '#fff', paddingBottom: 24 },
  topbar: {
    display: 'grid', gridTemplateColumns: '48px 1fr 48px', alignItems: 'center', height: 56, padding: '0 12px',
    borderBottom: '1px solid #1E2429', position: 'sticky', top: 0, background: '#121212'
  },
  title: { textAlign: 'center', margin: 0, fontSize: 18 },
  iconBtn: { background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' },
  stats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 16 },
  stat: { background: '#1E2429', borderRadius: 12, padding: 16, textAlign: 'center', color: '#fff' },
  statValue: { fontWeight: 700, marginTop: 4 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, padding: 16 },
}


