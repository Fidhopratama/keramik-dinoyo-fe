import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

function AdminLayout({
  title,
  activeMenu,
  onMenuChange,
  onLogout,
  children,
}) {
  return (
    <div className="app">
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={onMenuChange}
        onLogout={onLogout}
      />

      <main className="main-content">
        <Navbar
          title={title}
          onLogout={onLogout}
          onMenuChange={onMenuChange}
        />

        <section className="content">
          {children}
        </section>
      </main>
    </div>
  )
}

export default AdminLayout