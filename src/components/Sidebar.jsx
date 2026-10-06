import {
  LayoutDashboard,
  LogOut,
  Package,
  Palette,
  Settings,
  Sparkles,
  Store,
} from 'lucide-react'
import logo from '../assets/images/logodinoyo.png'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Toko', icon: Store },
  { label: 'Produk', icon: Package },
  { label: 'Workshop', icon: Palette },
  { label: 'Verifikasi AI', icon: Sparkles },
]

function Sidebar({ activeMenu, onMenuChange, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo has-image">
          <img src={logo} alt="Logo Keramik Dinoyo" />
        </div>

        <div>
          <h1>Keramik Dinoyo</h1>
          <span>Admin Dashboard</span>
        </div>
      </div>

      <nav className="sidebar-menu" aria-label="Menu utama">
        <p className="menu-title">MENU UTAMA</p>

        {menuItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className={`menu-item ${activeMenu === label ? 'active' : ''}`}
            aria-current={activeMenu === label ? 'page' : undefined}
            onClick={() => onMenuChange(label)}
          >
            <span className="menu-icon">
              <Icon size={18} aria-hidden="true" />
            </span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className={`menu-item ${activeMenu === 'Pengaturan' ? 'active' : ''}`}
          aria-current={activeMenu === 'Pengaturan' ? 'page' : undefined}
          onClick={() => onMenuChange('Pengaturan')}
        >
          <span className="menu-icon">
            <Settings size={18} aria-hidden="true" />
          </span>
          <span>Pengaturan</span>
        </button>

        <button
          type="button"
          className="logout-button"
          onClick={() => onLogout()}
        >
          <LogOut size={18} aria-hidden="true" />
          Keluar
        </button>
      </div>

      <style>{`
        .brand-logo.has-image {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          padding: 6px;
          box-sizing: border-box;
          border-radius: 16px;
          background: #fbf3ec;
        }

        .brand-logo.has-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .menu-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 10px;
        }
      `}</style>
    </aside>
  )
}

export default Sidebar