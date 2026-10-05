import { useState } from 'react'

import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Toko from './pages/Toko'
import Produk from './pages/Produk'
import Workshop from './pages/Workshop'
import VerifikasiAI from './pages/VerifikasiAI'
import Login from './pages/Login'

function ProfilAdmin() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Profil Admin</h2>
          <p>Informasi akun administrator Keramik Dinoyo.</p>
        </div>
      </div>

      <div className="admin-profile-card">
        <div className="admin-big-avatar">A</div>

        <div className="admin-profile-details">
          <div className="admin-detail-item">
            <span>Nama</span>
            <strong>Admin</strong>
          </div>

          <div className="admin-detail-item">
            <span>Role</span>
            <strong>Administrator</strong>
          </div>

          <div className="admin-detail-item">
            <span>Status</span>
            <strong className="status-active">Aktif</strong>
          </div>
        </div>
      </div>

      <style>{`
        .admin-page {
          padding: 4px 0 30px;
        }

        .admin-page-header {
          margin-bottom: 24px;
        }

        .admin-page-header h2 {
          margin: 0;
          color: #292929;
          font-size: 25px;
          font-weight: 700;
        }

        .admin-page-header p {
          margin: 7px 0 0;
          color: #888;
          font-size: 14px;
        }

        .admin-profile-card {
          max-width: 700px;
          background: #fff;
          border: 1px solid #eadfd7;
          border-radius: 16px;
          padding: 30px;
          display: flex;
          align-items: center;
          gap: 28px;
          box-shadow: 0 5px 18px rgba(70, 45, 30, 0.06);
        }

        .admin-big-avatar {
          width: 100px;
          height: 100px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #e8c3a7;
          color: #744b2e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 38px;
          font-weight: 700;
        }

        .admin-profile-details {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .admin-detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .admin-detail-item span {
          color: #999;
          font-size: 13px;
        }

        .admin-detail-item strong {
          color: #333;
          font-size: 15px;
        }

        .admin-detail-item .status-active {
          color: #4f8a52;
        }

        @media (max-width: 600px) {
          .admin-profile-card {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}

function GantiPassword() {
  const [passwordLama, setPasswordLama] = useState('')
  const [passwordBaru, setPasswordBaru] = useState('')
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('')
  const [showPasswordLama, setShowPasswordLama] = useState(false)
  const [showPasswordBaru, setShowPasswordBaru] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setMessage('')

    if (!passwordLama || !passwordBaru || !konfirmasiPassword) {
      setMessage('Semua kolom password wajib diisi.')
      return
    }

    if (passwordBaru.length < 6) {
      setMessage('Password baru minimal 6 karakter.')
      return
    }

    if (passwordBaru !== konfirmasiPassword) {
      setMessage('Konfirmasi password tidak sesuai.')
      return
    }

    setMessage('Password berhasil diperbarui.')

    setPasswordLama('')
    setPasswordBaru('')
    setKonfirmasiPassword('')
  }

  return (
    <div className="password-page">
      <div className="password-header">
        <div>
          <h2>Ganti Password</h2>
          <p>Perbarui password akun administrator kamu.</p>
        </div>
      </div>

      <div className="password-card">
        <form onSubmit={handleSubmit}>
          <div className="password-field">
            <label>Password Lama</label>

            <div className="password-input-wrapper">
              <input
                type={showPasswordLama ? 'text' : 'password'}
                value={passwordLama}
                onChange={(e) => setPasswordLama(e.target.value)}
                placeholder="Masukkan password lama"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPasswordLama((prev) => !prev)
                }
              >
                {showPasswordLama ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="password-field">
            <label>Password Baru</label>

            <div className="password-input-wrapper">
              <input
                type={showPasswordBaru ? 'text' : 'password'}
                value={passwordBaru}
                onChange={(e) => setPasswordBaru(e.target.value)}
                placeholder="Masukkan password baru"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPasswordBaru((prev) => !prev)
                }
              >
                {showPasswordBaru ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="password-field">
            <label>Konfirmasi Password Baru</label>

            <div className="password-input-wrapper">
              <input
                type={showKonfirmasi ? 'text' : 'password'}
                value={konfirmasiPassword}
                onChange={(e) =>
                  setKonfirmasiPassword(e.target.value)
                }
                placeholder="Ulangi password baru"
              />

              <button
                type="button"
                onClick={() =>
                  setShowKonfirmasi((prev) => !prev)
                }
              >
                {showKonfirmasi ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`password-message ${
                message.includes('berhasil')
                  ? 'success'
                  : 'error'
              }`}
            >
              {message}
            </div>
          )}

          <button type="submit" className="password-submit">
            Simpan Password
          </button>
        </form>
      </div>

      <style>{`
        .password-page {
          padding: 4px 0 30px;
        }

        .password-header {
          margin-bottom: 24px;
        }

        .password-header h2 {
          margin: 0;
          color: #292929;
          font-size: 25px;
          font-weight: 700;
        }

        .password-header p {
          margin: 7px 0 0;
          color: #888;
          font-size: 14px;
        }

        .password-card {
          max-width: 650px;
          background: #fff;
          border: 1px solid #eadfd7;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 5px 18px rgba(70, 45, 30, 0.06);
        }

        .password-field {
          margin-bottom: 20px;
        }

        .password-field label {
          display: block;
          margin-bottom: 8px;
          color: #444;
          font-size: 14px;
          font-weight: 600;
        }

        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input-wrapper input {
          width: 100%;
          height: 45px;
          box-sizing: border-box;
          padding: 0 48px 0 14px;
          border: 1px solid #ddd1c8;
          border-radius: 9px;
          outline: none;
          font-family: inherit;
          font-size: 14px;
          color: #333;
          transition: border-color 0.2s ease;
        }

        .password-input-wrapper input:focus {
          border-color: #c87842;
        }

        .password-input-wrapper button {
          position: absolute;
          right: 5px;
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 7px;
          font-size: 16px;
        }

        .password-input-wrapper button:hover {
          background: #fff5ed;
        }

        .password-message {
          padding: 12px 14px;
          margin-bottom: 18px;
          border-radius: 8px;
          font-size: 13px;
        }

        .password-message.success {
          background: #edf8ee;
          color: #4f8a52;
          border: 1px solid #cce6ce;
        }

        .password-message.error {
          background: #fff1f1;
          color: #c94c4c;
          border: 1px solid #efcccc;
        }

        .password-submit {
          width: 100%;
          height: 44px;
          border: none;
          border-radius: 9px;
          background: #c87842;
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .password-submit:hover {
          background: #b96d3a;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  )
}

const pageMap = {
  Dashboard,
  Toko,
  Produk,
  Workshop,
  'Verifikasi AI': VerifikasiAI,
  'Profil Admin': ProfilAdmin,
  'Ganti Password': GantiPassword,
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

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

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