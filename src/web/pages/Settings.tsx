import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Settings() {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('@user_data')
    localStorage.removeItem('userId')
    navigate('/login', { replace: true })
  }
  return (
    <div style={styles.wrapper as any}>
      <div style={styles.topbar as any}>
        <button style={styles.iconBtn as any} onClick={() => navigate(-1)}>←</button>
        <h1 style={styles.title as any}>Settings</h1>
        <div />
      </div>

      <div style={{ padding: 16 }}>
        <div style={styles.sectionTitle as any}>Account</div>
        <Link to="/profile" style={styles.row as any}>👤 Profile</Link>
        <Link to="/notifications" style={styles.row as any}>🔔 Notifications</Link>

        <button style={styles.logout as any} onClick={logout}>Logout</button>

        <div style={styles.company as any}>
          <div style={styles.companyName as any}>EthioSmart Technology– The Future of Smart Living & Business!</div>
          <div style={styles.companyText as any}>Control your home, office, shop, or farm from anywhere! EthioSmart brings you advanced automation, smart security, energy efficiency, and AI-driven solutions—designed for Ethiopian lifestyles and businesses</div>
          <div style={styles.companyText as any}>Smart Homes | Smart Offices | Smart Shops | Smart Farms | Industrial Automation</div>
          <a href="https://ethiosmart.tech" target="_blank" rel="noreferrer" style={styles.companyText as any}>🌐 ethiosmart.tech</a>
          <div style={styles.companyText as any}>📞 0978977715 | 0916977715</div>
          <a href="mailto:etsmart19@gmail.com" style={styles.companyText as any}>Email: etsmart19@gmail.com</a>
        </div>
      </div>

      <div style={styles.tabs as any}>
        <button style={styles.tab as any} onClick={() => navigate('/')}>🏠 Home</button>
        <button style={styles.tab as any} onClick={() => navigate('/security')}>🛡️ Security</button>
        <button style={styles.tabActive as any}>⚙️ Settings</button>
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
  sectionTitle: { color: '#bbb', margin: '12px 0', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  row: { display: 'block', background: '#1E2429', padding: 16, borderRadius: 10, marginBottom: 8, color: '#fff', textDecoration: 'none', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  logout: { background: '#F44336', border: 'none', padding: '12px 14px', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: 16, fontFamily: "'Poppins', 'Roboto', sans-serif" },
  company: { marginTop: 32, borderTop: '1px solid #333', paddingTop: 16, opacity: 0.9, fontFamily: "'Poppins', 'Roboto', sans-serif" },
  companyName: { fontWeight: 700, marginBottom: 8, fontFamily: "'Poppins', 'Roboto', sans-serif" },
  companyText: { color: '#ddd', textDecoration: 'none', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  tabs: { position: 'fixed', bottom: 0, left: 0, right: 0, height: 56, background: '#1E2429', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' },
  tab: { background: 'transparent', border: 'none', color: '#888', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', 'Roboto', sans-serif" },
  tabActive: { background: 'transparent', border: 'none', color: '#4CAF50', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', 'Roboto', sans-serif" },
}



