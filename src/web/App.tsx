import React, { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
// import Login from './pages/Login' // Commented out login page
import Home from './pages/Home'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Blocked from './pages/Blocked'
import Security from './pages/Security'
import Notifications from './pages/Notifications'

// Commented out authentication check - bypassing login
// const isAuthenticated = () => {
//   try {
//     return !!localStorage.getItem('@user_data')
//   } catch {
//     return false
//   }
// }

export default function App() {
  // Set up mock user data on app load to ensure Home page works
  useEffect(() => {
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
  }, [])

  return (
    <Routes>
      {/* Commented out login route - users go directly to home */}
      {/* <Route path="/login" element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />} /> */}
      <Route path="/blocked" element={<Blocked />} />
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/security" element={<Security />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


