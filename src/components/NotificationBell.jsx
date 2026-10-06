import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  BellOff,
  CheckCheck,
  Info,
  Palette,
  Sparkles,
} from 'lucide-react'

const SETTINGS_KEY = 'dinoyo_admin_settings'
const SETTINGS_EVENT = 'dinoyo-settings-updated'
const READ_KEY = 'dinoyo_notifications_read'

const NOW = Date.now()

// Contoh data. TODO: ganti dengan data dari backend, contoh:
// const response = await api.get('/notifications')
const SAMPLE_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'workshop',
    title: 'Pendaftaran workshop baru',
    message: 'Ada peserta baru yang mendaftar di workshop keramik.',
    time: NOW - 5 * 60 * 1000,
  },
  {
    id: 'n2',
    type: 'ai',
    title: 'Analisis AI selesai',
    message: 'Hasil pemeriksaan produk siap untuk ditinjau.',
    time: NOW - 45 * 60 * 1000,
  },
  {
    id: 'n3',
    type: 'system',
    title: 'Data toko diperbarui',
    message: 'Informasi toko terbaru sudah tersimpan di sistem.',
    time: NOW - 26 * 60 * 60 * 1000,
  },
]

const typeIcons = {
  workshop: Palette,
  ai: Sparkles,
  system: Info,
}

// Halaman yang dibuka saat notifikasi diklik
const typeTargets = {
  workshop: 'Workshop',
  ai: 'Verifikasi AI',
  system: 'Toko',
}

function readEnabled() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw).notifikasi !== false : true
  } catch {
    return true
  }
}

function readReadIds() {
  try {
    const raw = localStorage.getItem(READ_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return 'Baru saja'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`
  return `${Math.floor(seconds / 86400)} hari lalu`
}

function NotificationBell({
  items = SAMPLE_NOTIFICATIONS,
  onOpenSettings,
  onNavigate,
}) {
  const [open, setOpen] = useState(false)
  const [enabled, setEnabled] = useState(readEnabled)
  const [readIds, setReadIds] = useState(readReadIds)
  const wrapperRef = useRef(null)
  const buttonRef = useRef(null)

  const unreadCount = enabled
    ? items.filter((item) => !readIds.has(item.id)).length
    : 0

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

  // Ikuti pengaturan notifikasi dari halaman Pengaturan
  useEffect(() => {
    const sync = () => setEnabled(readEnabled())
    window.addEventListener(SETTINGS_EVENT, sync)
    return () => window.removeEventListener(SETTINGS_EVENT, sync)
  }, [])

  const saveReadIds = (next) => {
    setReadIds(next)
    try {
      localStorage.setItem(READ_KEY, JSON.stringify([...next]))
    } catch {
      // abaikan jika localStorage tidak tersedia
    }
  }

  const markAllAsRead = () => {
    saveReadIds(new Set(items.map((item) => item.id)))
  }

  // Tandai dibaca, lalu buka halaman yang berkaitan
  const handleItemClick = (item) => {
    if (!readIds.has(item.id)) {
      saveReadIds(new Set([...readIds, item.id]))
    }

    const target = item.target || typeTargets[item.type]
    if (target && onNavigate) {
      setOpen(false)
      onNavigate(target)
    }
  }

  const openSettings = () => {
    setOpen(false)
    if (onOpenSettings) onOpenSettings()
  }

  return (
    <div className="nb-wrapper" ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        className="notification nb-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={
          unreadCount > 0
            ? `Notifikasi, ${unreadCount} belum dibaca`
            : 'Notifikasi'
        }
        onClick={() => setOpen((prev) => !prev)}
      >
        {enabled ? (
          <Bell size={20} aria-hidden="true" />
        ) : (
          <BellOff size={20} aria-hidden="true" />
        )}

        {unreadCount > 0 && (
          <span className="nb-badge" aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="nb-panel" role="dialog" aria-label="Notifikasi">
          <div className="nb-panel-head">
            <h4>Notifikasi</h4>

            {enabled && unreadCount > 0 && (
              <button
                type="button"
                className="nb-link"
                onClick={markAllAsRead}
              >
                <CheckCheck size={15} aria-hidden="true" />
                Tandai semua dibaca
              </button>
            )}
          </div>

          {!enabled ? (
            <div className="nb-empty">
              <BellOff size={26} aria-hidden="true" />
              <strong>Notifikasi dimatikan</strong>
              <p>Aktifkan lagi di halaman Pengaturan.</p>

              {onOpenSettings && (
                <button
                  type="button"
                  className="nb-settings-btn"
                  onClick={openSettings}
                >
                  Buka Pengaturan
                </button>
              )}
            </div>
          ) : items.length === 0 ? (
            <div className="nb-empty">
              <Bell size={26} aria-hidden="true" />
              <strong>Belum ada notifikasi</strong>
              <p>Aktivitas workshop dan sistem akan muncul di sini.</p>
            </div>
          ) : (
            <ul className="nb-list">
              {items.map((item) => {
                const Icon = typeIcons[item.type] || Info
                const isRead = readIds.has(item.id)

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`nb-item ${isRead ? '' : 'nb-item-unread'}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <span className="nb-item-icon">
                        <Icon size={18} aria-hidden="true" />
                      </span>

                      <span className="nb-item-text">
                        <strong>{item.title}</strong>
                        <span>{item.message}</span>
                        <small>{timeAgo(item.time)}</small>
                      </span>

                      {!isRead && (
                        <span
                          className="nb-dot"
                          role="img"
                          aria-label="Belum dibaca"
                        />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      <style>{`
        .nb-wrapper {
          position: relative;
        }

        .notification.nb-trigger {
          position: relative;
          appearance: none;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-family: inherit;
          color: #6b5b50;
        }

        .notification.nb-trigger:focus-visible,
        .nb-item:focus-visible,
        .nb-link:focus-visible,
        .nb-settings-btn:focus-visible {
          outline: 2px solid #cf7d45;
          outline-offset: 2px;
        }

        .nb-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          min-width: 20px;
          height: 20px;
          padding: 0 5px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #d1453b;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
        }

        .nb-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          z-index: 1000;
          width: 360px;
          max-width: calc(100vw - 32px);
          background: #ffffff;
          border: 1px solid #eadfd7;
          border-radius: 16px;
          box-shadow: 0 12px 35px rgba(61, 39, 25, 0.16);
          animation: nbShow 0.16s ease;
          overflow: hidden;
        }

        @keyframes nbShow {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nb-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 18px;
          border-bottom: 1px solid #eee5de;
        }

        .nb-panel-head h4 {
          margin: 0;
          color: #332a25;
          font-size: 16px;
          font-weight: 700;
        }

        .nb-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 6px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: #b96936;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .nb-link:hover {
          background: #fff5ee;
        }

        .nb-list {
          max-height: 360px;
          margin: 0;
          padding: 6px;
          overflow-y: auto;
          list-style: none;
        }

        .nb-item {
          width: 100%;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          border: none;
          border-radius: 12px;
          background: transparent;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
          transition: background 0.18s ease;
        }

        .nb-item:hover {
          background: #f9f4ef;
        }

        .nb-item-unread {
          background: #fff8f2;
        }

        .nb-item-icon {
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #fbf3ec;
          color: #b96936;
        }

        .nb-item-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .nb-item-text strong {
          color: #332a25;
          font-size: 14px;
          font-weight: 600;
        }

        .nb-item-text span {
          color: #6f6258;
          font-size: 13px;
          line-height: 1.4;
        }

        .nb-item-text small {
          color: #a09184;
          font-size: 12px;
        }

        .nb-dot {
          flex-shrink: 0;
          width: 9px;
          height: 9px;
          margin-top: 6px;
          border-radius: 50%;
          background: #cf7d45;
        }

        .nb-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 32px 24px;
          color: #958174;
          text-align: center;
        }

        .nb-empty strong {
          color: #40342d;
          font-size: 14px;
        }

        .nb-empty p {
          margin: 0;
          font-size: 13px;
        }

        .nb-settings-btn {
          margin-top: 10px;
          height: 38px;
          padding: 0 16px;
          border: 1px solid #cf7d45;
          border-radius: 9px;
          background: transparent;
          color: #b96936;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .nb-settings-btn:hover {
          background: #fff5ee;
        }

        @media (max-width: 768px) {
          .nb-panel {
            position: fixed;
            top: 76px;
            right: 16px;
            left: 16px;
            width: auto;
            max-width: none;
          }
        }
      `}</style>
    </div>
  )
}

export default NotificationBell