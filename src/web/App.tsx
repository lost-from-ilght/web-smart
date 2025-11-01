import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Blocked from './pages/Blocked'
import Security from './pages/Security'
import Notifications from './pages/Notifications'

const isAuthenticated = () => {
  try {
    return !!localStorage.getItem('@user_data')
  } catch {
    return false
  }
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/blocked" element={<Blocked />} />
      <Route path="/" element={isAuthenticated() ? <Home /> : <Navigate to="/login" replace />} />
      <Route path="/settings" element={isAuthenticated() ? <Settings /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/login" replace />} />
      <Route path="/security" element={isAuthenticated() ? <Security /> : <Navigate to="/login" replace />} />
      <Route path="/notifications" element={isAuthenticated() ? <Notifications /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


