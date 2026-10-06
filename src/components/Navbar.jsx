import NotificationBell from './NotificationBell'
import ProfileDropdown from './ProfileDropdown'

function Navbar({ title, onLogout, onMenuChange }) {
  return (
    <header className="topbar">
      <div>
        <p className="breadcrumb">Admin / {title}</p>
        <h2>{title}</h2>
      </div>

      <div className="admin-profile">
        <NotificationBell
          onNavigate={(menu) => onMenuChange?.(menu)}
          onOpenSettings={() => onMenuChange?.('Pengaturan')}
        />

        <ProfileDropdown
          onProfile={() => onMenuChange?.('Profil Admin')}
          onChangePassword={() => onMenuChange?.('Ganti Password')}
          onLogout={onLogout}
        />
      </div>
    </header>
  )
}

export default Navbar