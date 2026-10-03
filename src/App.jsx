import { useState } from 'react'

import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Toko from './pages/Toko'
import Produk from './pages/Produk'
import Workshop from './pages/Workshop'
import VerifikasiAI from './pages/VerifikasiAI'
import Login from './pages/Login'

const pageMap = {
  Dashboard,
  Toko,
  Produk,
  Workshop,
  'Verifikasi AI': VerifikasiAI,
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('keramik_dinoyo_token'))
  })

  const [activeMenu, setActiveMenu] = useState('Dashboard')

  const handleLogin = () => {
    setIsLoggedIn(true)
    setActiveMenu('Dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('keramik_dinoyo_token')

    setIsLoggedIn(false)
    setActiveMenu('Dashboard')
  }

  // Jika belum login, tampilkan halaman Login.
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  // Ambil halaman berdasarkan menu yang aktif.
  const ActivePage = pageMap[activeMenu] || Dashboard

  return (
    <AdminLayout
      title={activeMenu}
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
      onLogout={handleLogout}
    >
      <ActivePage />
    </AdminLayout>
  )
}

export default App