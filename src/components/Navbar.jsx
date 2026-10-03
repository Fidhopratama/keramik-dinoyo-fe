function Navbar({ title }) {
  return (
    <header className="topbar">
      <div>
        <p className="breadcrumb">Admin / {title}</p>
        <h2>{title}</h2>
      </div>

      <div className="admin-profile">
        <div className="notification">♢</div>

        <div className="profile-avatar">A</div>

        <div className="profile-info">
          <strong>Admin</strong>
          <span>Administrator</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar