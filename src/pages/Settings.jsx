import { useEffect, useState } from 'react'
import {
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react'

const STORAGE_KEY = 'dinoyo_admin_settings'
const SETTINGS_EVENT = 'dinoyo-settings-updated'

const DEFAULTS = {
  nama: 'Admin',
  email: 'admin@keramikdinoyo.id',
  telepon: '',
  notifikasi: true,
  bahasa: 'id',
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

// section: 'profil' | 'keamanan' | undefined, nonce: naik setiap menu diklik
function Settings({ section, nonce }) {
  const [form, setForm] = useState(loadSettings)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [password, setPassword] = useState({ lama: '', baru: '', ulang: '' })
  const [passwordError, setPasswordError] = useState('')
  const [toast, setToast] = useState('')

  // Gulung ke bagian yang dipilih dari menu dropdown
  useEffect(() => {
    if (!section) {
      window.scrollTo({ top: 0 })
      return
    }

    const timer = setTimeout(() => {
      document
        .getElementById(`st-${section}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)

    if (section === 'keamanan') {
      setShowPasswordForm(true)
      const focusTimer = setTimeout(
        () => document.getElementById('st-pw-lama')?.focus({ preventScroll: true }),
        350
      )
      return () => {
        clearTimeout(timer)
        clearTimeout(focusTimer)
      }
    }

    return () => clearTimeout(timer)
  }, [section, nonce])

  // Hilangkan pesan otomatis setelah 2,5 detik
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const save = (message) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
      // Beritahu ProfileDropdown agar nama ikut diperbarui
      window.dispatchEvent(new Event(SETTINGS_EVENT))
      // TODO: ganti dengan request ke backend, contoh:
      // await api.put('/admin/settings', form)
      setToast(message)
    } catch {
      setToast('Gagal menyimpan. Coba lagi.')
    }
  }

  const closePasswordForm = () => {
    setShowPasswordForm(false)
    setPassword({ lama: '', baru: '', ulang: '' })
    setPasswordError('')
  }

  const submitPassword = (e) => {
    e.preventDefault()
    setPasswordError('')

    if (password.baru.length < 6) {
      setPasswordError('Password baru minimal 6 karakter.')
      return
    }
    if (password.baru !== password.ulang) {
      setPasswordError('Konfirmasi password tidak sama.')
      return
    }

    // TODO: kirim ke backend, contoh:
    // await api.put('/admin/password', { lama: password.lama, baru: password.baru })
    closePasswordForm()
    setToast('Password berhasil diganti')
  }

  return (
    <div className="st-page">
      <div className="st-header">
        <h2>Pengaturan</h2>
        <p>Kelola informasi akun dan preferensi sistem.</p>
      </div>

      {/* Profil Admin */}
      <Card
        id="st-profil"
        icon={UserRound}
        title="Profil Admin"
        desc="Kelola informasi akun administrator."
      >
        <div className="st-body">
          <TextField
            id="st-nama"
            label="Nama Admin"
            value={form.nama}
            onChange={(v) => updateField('nama', v)}
          />
          <TextField
            id="st-email"
            type="email"
            label="Email"
            value={form.email}
            onChange={(v) => updateField('email', v)}
          />
          <TextField
            id="st-telepon"
            type="tel"
            label="Nomor Telepon"
            placeholder="Masukkan nomor telepon"
            value={form.telepon}
            onChange={(v) => updateField('telepon', v)}
          />

          <div className="st-actions">
            <button
              type="button"
              className="st-btn st-btn-primary"
              onClick={() => save('Profil admin berhasil disimpan')}
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </Card>

      {/* Keamanan */}
      <Card
        id="st-keamanan"
        icon={ShieldCheck}
        title="Keamanan Akun"
        desc="Kelola keamanan dan password akun administrator."
      >
        <div className="st-body">
          <div className="st-row">
            <div>
              <h3>Password</h3>
              <p>Ubah password secara berkala untuk menjaga keamanan akun.</p>
            </div>

            {!showPasswordForm && (
              <button
                type="button"
                className="st-btn st-btn-outline"
                onClick={() => setShowPasswordForm(true)}
              >
                Ganti Password
              </button>
            )}
          </div>

          {showPasswordForm && (
            <form className="st-password-form" onSubmit={submitPassword}>
              <PasswordField
                id="st-pw-lama"
                label="Password saat ini"
                autoComplete="current-password"
                value={password.lama}
                onChange={(v) => setPassword({ ...password, lama: v })}
              />
              <PasswordField
                id="st-pw-baru"
                label="Password baru"
                autoComplete="new-password"
                hint="Minimal 6 karakter."
                value={password.baru}
                onChange={(v) => setPassword({ ...password, baru: v })}
              />
              <PasswordField
                id="st-pw-ulang"
                label="Ulangi password baru"
                autoComplete="new-password"
                value={password.ulang}
                onChange={(v) => setPassword({ ...password, ulang: v })}
              />

              {passwordError && (
                <p role="alert" className="st-error">
                  {passwordError}
                </p>
              )}

              <div className="st-actions">
                <button
                  type="button"
                  className="st-btn st-btn-ghost"
                  onClick={closePasswordForm}
                >
                  Batal
                </button>
                <button type="submit" className="st-btn st-btn-primary">
                  Simpan Password
                </button>
              </div>
            </form>
          )}
        </div>
      </Card>

      {/* Preferensi */}
      <Card
        id="st-preferensi"
        icon={SlidersHorizontal}
        title="Preferensi"
        desc="Atur preferensi penggunaan dashboard."
      >
        <div className="st-body">
          <div className="st-row">
            <div>
              <h3>Notifikasi</h3>
              <p>Terima notifikasi aktivitas workshop dan sistem.</p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={form.notifikasi}
              aria-label="Notifikasi"
              className={`st-switch ${form.notifikasi ? 'st-switch-on' : ''}`}
              onClick={() => updateField('notifikasi', !form.notifikasi)}
            >
              <span />
            </button>
          </div>

          <div className="st-field">
            <label htmlFor="st-bahasa">Bahasa</label>
            <select
              id="st-bahasa"
              className="st-input"
              value={form.bahasa}
              onChange={(e) => updateField('bahasa', e.target.value)}
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="st-actions">
            <button
              type="button"
              className="st-btn st-btn-primary"
              onClick={() => save('Preferensi berhasil disimpan')}
            >
              Simpan Preferensi
            </button>
          </div>
        </div>
      </Card>

      {toast && (
        <div role="status" className="st-toast">
          <Check size={16} aria-hidden="true" />
          {toast}
        </div>
      )}

      <style>{`
        .st-page {
          max-width: 760px;
          padding: 4px 0 40px;
        }

        .st-header {
          margin-bottom: 24px;
        }

        .st-header h2 {
          margin: 0;
          color: #292929;
          font-size: 25px;
          font-weight: 700;
        }

        .st-header p {
          margin: 7px 0 0;
          color: #888;
          font-size: 14px;
        }

        .st-card {
          margin-bottom: 22px;
          scroll-margin-top: 24px;
          background: #ffffff;
          border: 1px solid #eadfd7;
          border-radius: 16px;
          box-shadow: 0 5px 18px rgba(70, 45, 30, 0.06);
        }

        .st-card-head {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 20px 24px;
          border-bottom: 1px solid #eee5de;
        }

        .st-card-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #fbf3ec;
          color: #b96936;
        }

        .st-card-head h3 {
          margin: 0;
          color: #332a25;
          font-size: 17px;
          font-weight: 600;
        }

        .st-card-head p {
          margin: 4px 0 0;
          color: #958174;
          font-size: 13px;
        }

        .st-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 24px;
        }

        .st-field label {
          display: block;
          margin-bottom: 8px;
          color: #4a3d35;
          font-size: 14px;
          font-weight: 600;
        }

        .st-input {
          width: 100%;
          height: 45px;
          box-sizing: border-box;
          padding: 0 14px;
          border: 1px solid #ddd1c8;
          border-radius: 9px;
          background: #ffffff;
          outline: none;
          color: #332a25;
          font-family: inherit;
          font-size: 14px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .st-input:focus {
          border-color: #cf7d45;
          box-shadow: 0 0 0 3px rgba(207, 125, 69, 0.18);
        }

        .st-input-wrap {
          position: relative;
        }

        .st-input-wrap .st-input {
          padding-right: 48px;
        }

        .st-eye {
          position: absolute;
          top: 50%;
          right: 6px;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #958174;
          cursor: pointer;
        }

        .st-eye:hover {
          background: #fff5ed;
          color: #40342d;
        }

        .st-hint {
          margin: 6px 0 0;
          color: #958174;
          font-size: 12px;
        }

        .st-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .st-row h3 {
          margin: 0;
          color: #40342d;
          font-size: 14px;
          font-weight: 600;
        }

        .st-row p {
          margin: 4px 0 0;
          color: #958174;
          font-size: 13px;
        }

        .st-password-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-top: 22px;
          border-top: 1px solid #eee5de;
        }

        .st-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .st-btn {
          height: 44px;
          padding: 0 20px;
          border-radius: 9px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .st-btn:focus-visible,
        .st-switch:focus-visible,
        .st-eye:focus-visible {
          outline: 2px solid #cf7d45;
          outline-offset: 2px;
        }

        .st-btn-primary {
          border: none;
          background: #cf7d45;
          color: #ffffff;
        }

        .st-btn-primary:hover {
          background: #b96936;
        }

        .st-btn-outline {
          flex-shrink: 0;
          border: 1px solid #cf7d45;
          background: transparent;
          color: #b96936;
        }

        .st-btn-outline:hover {
          background: #fff5ee;
        }

        .st-btn-ghost {
          border: 1px solid #ddd1c8;
          background: transparent;
          color: #4a3d35;
        }

        .st-btn-ghost:hover {
          background: #f6f0ea;
        }

        .st-error {
          margin: 0;
          padding: 12px 14px;
          border: 1px solid #efcccc;
          border-radius: 8px;
          background: #fff1f1;
          color: #c94c4c;
          font-size: 13px;
        }

        .st-switch {
          position: relative;
          flex-shrink: 0;
          width: 50px;
          height: 28px;
          border: none;
          border-radius: 999px;
          background: #d6cec7;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .st-switch span {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
        }

        .st-switch-on {
          background: #cf7d45;
        }

        .st-switch-on span {
          transform: translateX(22px);
        }

        .st-toast {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 2000;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: 12px;
          background: #40342d;
          color: #ffffff;
          font-size: 14px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .st-toast svg {
          color: #e8c3a7;
        }

        @media (max-width: 600px) {
          .st-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .st-actions {
            flex-direction: column-reverse;
          }

          .st-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

/* ---------- Komponen kecil ---------- */

function Card({ id, icon: Icon, title, desc, children }) {
  return (
    <section id={id} className="st-card">
      <div className="st-card-head">
        <span className="st-card-icon">
          <Icon size={20} aria-hidden="true" />
        </span>
        <div>
          <h3>{title}</h3>
          <p>{desc}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function TextField({ id, label, value, onChange, type = 'text', placeholder }) {
  return (
    <div className="st-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        className="st-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function PasswordField({ id, label, value, onChange, autoComplete, hint }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="st-field">
      <label htmlFor={id}>{label}</label>
      <div className="st-input-wrap">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className="st-input"
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="st-eye"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint && <p className="st-hint">{hint}</p>}
    </div>
  )
}

export default Settings