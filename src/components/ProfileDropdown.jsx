import { useEffect, useRef, useState } from 'react'
import { ChevronDown, KeyRound, LogOut, UserRound } from 'lucide-react'

const STORAGE_KEY = 'dinoyo_admin_settings'
const SETTINGS_EVENT = 'dinoyo-settings-updated'

function readSavedName() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw).nama : null
  } catch {
    return null
  }
}

function ProfileDropdown({
  name,
  role = 'Administrator',
  onProfile,
  onChangePassword,
  onLogout,
}) {
  const [open, setOpen] = useState(false)
  const [savedName, setSavedName] = useState(readSavedName)
  const wrapperRef = useRef(null)
  const buttonRef = useRef(null)

  const displayName = name || savedName || 'Admin'
  const initial = displayName.charAt(0).toUpperCase()

  // Tutup saat klik di luar atau tekan Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  // Perbarui nama saat pengaturan disimpan di halaman Pengaturan
  useEffect(() => {
    const sync = () => setSavedName(readSavedName())
    window.addEventListener(SETTINGS_EVENT, sync)
    return () => window.removeEventListener(SETTINGS_EVENT, sync)
  }, [])

  const run = (fn) => () => {
    setOpen(false)
    if (fn) fn()
  }

  return (
    <div className="pd-wrapper" ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        className="pd-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="pd-avatar pd-avatar-lg">{initial}</span>

        <span className="pd-info">
          <strong>{displayName}</strong>
          <small>{role}</small>
        </span>

        <ChevronDown
          size={18}
          aria-hidden="true"
          className={`pd-arrow ${open ? 'pd-arrow-open' : ''}`}
        />
      </button>

      {open && (
        <div className="pd-menu" role="menu">
          <div className="pd-menu-header">
            <span className="pd-avatar pd-avatar-md">{initial}</span>
            <div className="pd-info">
              <strong>{displayName}</strong>
              <small>{role}</small>
            </div>
          </div>

          <div className="pd-divider" />

          <button
            type="button"
            role="menuitem"
            className="pd-item"
            onClick={run(onProfile)}
          >
            <UserRound size={18} aria-hidden="true" />
            <span>Profil Admin</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className="pd-item"
            onClick={run(onChangePassword)}
          >
            <KeyRound size={18} aria-hidden="true" />
            <span>Ganti Password</span>
          </button>

          <div className="pd-divider" />

          <button
            type="button"
            role="menuitem"
            className="pd-item pd-item-danger"
            onClick={run(onLogout)}
          >
            <LogOut size={18} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      )}

      <style>{`
        .pd-wrapper {
          position: relative;
        }

        .pd-trigger {
          appearance: none;
          border: none;
          background: #fbf3ec;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 14px 8px 8px;
          border-radius: 14px;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          transition: background 0.2s ease;
        }

        .pd-trigger:hover {
          background: #f7e8db;
        }

        .pd-trigger:focus-visible,
        .pd-item:focus-visible {
          outline: 2px solid #cf7d45;
          outline-offset: 2px;
        }

        .pd-avatar {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #e8c3a7;
          color: #744b2e;
          font-weight: 700;
        }

        .pd-avatar-lg {
          width: 44px;
          height: 44px;
          font-size: 20px;
        }

        .pd-avatar-md {
          width: 42px;
          height: 42px;
          font-size: 18px;
        }

        .pd-info {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }

        .pd-info strong {
          color: #40342d;
          font-size: 15px;
          font-weight: 700;
        }

        .pd-info small {
          margin-top: 2px;
          color: #958174;
          font-size: 13px;
        }

        .pd-arrow {
          color: #958174;
          transition: transform 0.2s ease;
        }

        .pd-arrow-open {
          transform: rotate(180deg);
        }

        .pd-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          z-index: 1000;
          width: 270px;
          padding: 10px;
          background: #ffffff;
          border: 1px solid #eadfd7;
          border-radius: 16px;
          box-shadow: 0 12px 35px rgba(61, 39, 25, 0.16);
          animation: pdShow 0.16s ease;
        }

        @keyframes pdShow {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pd-menu-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 10px;
        }

        .pd-divider {
          height: 1px;
          margin: 7px 0;
          background: #eee5df;
        }

        .pd-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: #40342d;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease;
        }

        .pd-item svg {
          color: #958174;
          flex-shrink: 0;
        }

        .pd-item:hover {
          background: #fff6ee;
          color: #b86f3f;
        }

        .pd-item:hover svg {
          color: #b86f3f;
        }

        .pd-item-danger,
        .pd-item-danger svg {
          color: #d1453b;
        }

        .pd-item-danger:hover {
          background: #fdeeec;
          color: #d1453b;
        }

        .pd-item-danger:hover svg {
          color: #d1453b;
        }

        @media (max-width: 768px) {
          .pd-trigger {
            padding: 4px;
          }

          .pd-trigger .pd-info,
          .pd-trigger .pd-arrow {
            display: none;
          }

          .pd-menu {
            width: 250px;
          }
        }
      `}</style>
    </div>
  )
}

export default ProfileDropdown