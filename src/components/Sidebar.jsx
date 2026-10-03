const menuItems = [
  { label: 'Dashboard', icon: '▦' },
  { label: 'Toko', icon: '⌂' },
  { label: 'Produk', icon: '◈' },
  { label: 'Workshop', icon: '▣' },
  { label: 'Verifikasi AI', icon: '✦' },
]

function Sidebar({ activeMenu, onMenuChange, onLogout }) {
  return (
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
        <button className="menu-item">
          <span className="menu-icon">⚙</span>
          <span>Pengaturan</span>
        </button>

        <button className="logout-button" onClick={onLogout}>
          <span>↪</span>
          Keluar
        </button>
      </div>
    </aside>
  )
}

export default Sidebar