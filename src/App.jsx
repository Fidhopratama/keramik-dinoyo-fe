import { useState } from 'react'

import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Toko from './pages/Toko'
import Produk from './pages/Produk'
import Workshop from './pages/Workshop'
import VerifikasiAI from './pages/VerifikasiAI'
import Settings from './pages/Settings'
import Login from './pages/Login'

const TOKEN_KEY = 'keramik_dinoyo_token'

const pageMap = {
  Dashboard,
  Toko,
  Produk,
  Workshop,
  'Verifikasi AI': VerifikasiAI,
}

// Menu yang membuka halaman Pengaturan, beserta bagian yang dituju
const settingsSections = {
  Pengaturan: undefined,
  'Profil Admin': 'profil',
  'Ganti Password': 'keamanan',
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return Boolean(localStorage.getItem(TOKEN_KEY))
    } catch {
      return false
    }
  })

  const [activeMenu, setActiveMenu] = useState('Dashboard')
  const [navNonce, setNavNonce] = useState(0)

  const handleMenuChange = (menu) => {
    setActiveMenu(menu)
    // Naik setiap klik, supaya klik menu yang sama tetap menggulung ke bagian itu
    setNavNonce((n) => n + 1)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    setActiveMenu('Dashboard')
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      // abaikan jika localStorage tidak tersedia
    }
    setIsLoggedIn(false)
    setActiveMenu('Dashboard')
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  const isSettings = activeMenu in settingsSections
  const ActivePage = pageMap[activeMenu] || Dashboard

  // Profil Admin dan Ganti Password dianggap bagian dari menu Pengaturan
  const currentMenu = isSettings ? 'Pengaturan' : activeMenu

  return (
    <AdminLayout
      title={currentMenu}
      activeMenu={currentMenu}
      onMenuChange={handleMenuChange}
      onLogout={handleLogout}
    >
      {isSettings ? (
        <Settings section={settingsSections[activeMenu]} nonce={navNonce} />
      ) : (
        <ActivePage onMenuChange={handleMenuChange} />
      )}
    </AdminLayout>
  )
}

export default App