import { useEffect, useRef, useState } from 'react'

const menuItems = [
  { label: 'Dashboard', icon: '▦' },
  { label: 'Toko', icon: '⌂' },
  { label: 'Produk', icon: '◈' },
  { label: 'Workshop', icon: '▣' },
  { label: 'Verifikasi AI', icon: '✦' },
]

function Sidebar({ activeMenu, onMenuChange, onLogout }) {
  const [showAdminPopup, setShowAdminPopup] = useState(false)
  const adminRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        adminRef.current &&
        !adminRef.current.contains(event.target)
      ) {
        setShowAdminPopup(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    setShowAdminPopup(false)
    onLogout()
  }

  return (
    <>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">K</div>

          <div>
            <h1>Keramik Dinoyo</h1>
            <span>Admin Dashboard</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <p className="menu-title">MENU UTAMA</p>

          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`menu-item ${
                activeMenu === item.label ? 'active' : ''
              }`}
              onClick={() => onMenuChange(item.label)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="menu-item"
            onClick={() => onMenuChange('Pengaturan')}
          >
            <span className="menu-icon">⚙</span>
            <span>Pengaturan</span>
          </button>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Keluar
          </button>
        </div>
      </aside>

      <div className="admin-profile-wrapper" ref={adminRef}>
        <button
          type="button"
          className="admin-profile-button"
          onClick={() => setShowAdminPopup((prev) => !prev)}
        >
          <div className="admin-profile-icon">
            A
          </div>

          <div className="admin-profile-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

          <span
            className={`admin-profile-arrow ${
              showAdminPopup ? 'open' : ''
            }`}
          >
            ▾
          </span>
        </button>

        {showAdminPopup && (
          <div className="admin-popup">
            <div className="admin-popup-header">
              <div className="admin-popup-avatar">
                A
              </div>

              <div>
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>
            </div>

            <div className="admin-popup-divider" />

            <button
              type="button"
              className="admin-popup-item"
              onClick={() => {
                setShowAdminPopup(false)
                onMenuChange('Profil Admin')
              }}
            >
              <span className="admin-popup-icon">👤</span>
              <span>Profil Admin</span>
            </button>

            <button
              type="button"
              className="admin-popup-item"
              onClick={() => {
                setShowAdminPopup(false)
                onMenuChange('Ganti Password')
              }}
            >
              <span className="admin-popup-icon">🔑</span>
              <span>Ganti Password</span>
            </button>

            <div className="admin-popup-divider" />

            <button
              type="button"
              className="admin-popup-logout"
              onClick={handleLogout}
            >
              <span className="admin-popup-icon">↪</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .admin-profile-wrapper {
          position: fixed;
          top: 20px;
          right: 28px;
          z-index: 9999;
        }

        .admin-profile-button {
          appearance: none;
          border: none;
          background: #ffffff;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px 8px 8px;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .admin-profile-button:hover {
          background: #fffaf5;
        }

        .admin-profile-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #e8c3a7;
          color: #744b2e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
        }

        .admin-profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 100px;
        }

        .admin-profile-info strong {
          color: #242424;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
        }

        .admin-profile-info span {
          color: #8b8b8b;
          font-size: 14px;
          margin-top: 3px;
        }

        .admin-profile-arrow {
          color: #777;
          font-size: 15px;
          transition: transform 0.2s ease;
        }

        .admin-profile-arrow.open {
          transform: rotate(180deg);
        }

        .admin-popup {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 260px;
          background: #ffffff;
          border: 1px solid #eadfd7;
          border-radius: 14px;
          padding: 10px;
          box-shadow: 0 12px 35px rgba(61, 39, 25, 0.16);
          animation: adminPopupShow 0.18s ease;
        }

        @keyframes adminPopupShow {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .admin-popup-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
        }

        .admin-popup-avatar {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #e8c3a7;
          color: #744b2e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
        }

        .admin-popup-header div:last-child {
          display: flex;
          flex-direction: column;
        }

        .admin-popup-header strong {
          color: #242424;
          font-size: 15px;
        }

        .admin-popup-header span {
          color: #8b8b8b;
          font-size: 12px;
          margin-top: 3px;
        }

        .admin-popup-divider {
          height: 1px;
          background: #eee5df;
          margin: 7px 0;
        }

        .admin-popup-item,
        .admin-popup-logout {
          width: 100%;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border-radius: 9px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .admin-popup-item {
          color: #444;
        }

        .admin-popup-item:hover {
          background: #fff6ee;
          color: #b86f3f;
        }

        .admin-popup-logout {
          color: #d9534f;
        }

        .admin-popup-logout:hover {
          background: #fff2f2;
        }

        .admin-popup-icon {
          width: 24px;
          text-align: center;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .admin-profile-wrapper {
            top: 14px;
            right: 14px;
          }

          .admin-profile-info,
          .admin-profile-arrow {
            display: none;
          }

          .admin-profile-button {
            padding: 4px;
          }

          .admin-profile-icon {
            width: 42px;
            height: 42px;
            font-size: 19px;
          }

          .admin-popup {
            right: 0;
            width: 240px;
          }
        }
      `}</style>
    </>
  )
}

export default Sidebar