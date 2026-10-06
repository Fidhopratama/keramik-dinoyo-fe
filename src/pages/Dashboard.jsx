import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Sparkles,
  Store,
} from 'lucide-react'

import StatCard from '../components/StatCard'
import api from '../services/api'

import keramikBrawijaya from '../assets/images/keramik-brawijaya.jpg'
import keramikDinoyoMakmur from '../assets/images/keramik-dinoyo-makmur.jpg'
import dinoyoCeramicHouse from '../assets/images/dinoyo-ceramic-house.jpg'

const shopImages = {
  'Keramik Brawijaya': keramikBrawijaya,
  'Keramik Dinoyo Makmur': keramikDinoyoMakmur,
  'Dinoyo Ceramic House': dinoyoCeramicHouse,
}

// Data contoh 12 bulan terakhir (Okt - Sep).
// TODO: ganti dengan data dari backend kalau API aktivitas bulanan sudah ada.
const monthlyActivity = [
  { month: 'Okt', height: 40 },
  { month: 'Nov', height: 52 },
  { month: 'Des', height: 45 },
  { month: 'Jan', height: 58 },
  { month: 'Feb', height: 50 },
  { month: 'Mar', height: 62 },
  { month: 'Apr', height: 48 },
  { month: 'Mei', height: 64 },
  { month: 'Jun', height: 54 },
  { month: 'Jul', height: 78 },
  { month: 'Agu', height: 66 },
  { month: 'Sep', height: 88 },
]

const periodOptions = [
  { value: 3, label: '3 Bulan' },
  { value: 6, label: '6 Bulan' },
  { value: 12, label: '12 Bulan' },
]

function Dashboard({ onMenuChange }) {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [period, setPeriod] = useState(6)
  const [periodOpen, setPeriodOpen] = useState(false)
  const periodRef = useRef(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/dashboard')

        setDashboard(response.data.data)
      } catch (err) {
        console.error('Dashboard error:', err)

        setError(
          err.response?.data?.message ||
            'Data dashboard gagal dimuat.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  // Tutup pilihan periode saat klik di luar atau tekan Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (periodRef.current && !periodRef.current.contains(e.target)) {
        setPeriodOpen(false)
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setPeriodOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  if (loading) {
    return (
      <div className="card">
        <p>Memuat data dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <p role="alert">{error}</p>
      </div>
    )
  }

  const statistics = dashboard?.statistics || {}
  const recentShops = dashboard?.recent_shops || []

  const chartBars = monthlyActivity.slice(-period)
  const periodLabel =
    periodOptions.find((option) => option.value === period)?.label ||
    '6 Bulan'

  return (
    <>
      {/* HEADER */}
      <div className="page-heading">
        <div>
          <h3>Overview</h3>
          <p>Pantau aktivitas Kampung Keramik Dinoyo.</p>
        </div>

        <div className="date-badge">
          <CalendarDays size={16} aria-hidden="true" />

          {new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* STATISTICS */}
      <div className="stat-grid">
        <StatCard
          title="Total Toko"
          value={statistics.total_shops ?? 0}
          description="Toko aktif"
          icon="⌂"
        />

        <StatCard
          title="Total Produk"
          value={statistics.total_products ?? 0}
          description="Produk terdaftar"
          icon="◈"
        />

        <StatCard
          title="Workshop"
          value={statistics.total_workshops ?? 0}
          description="Workshop tersedia"
          icon="▣"
        />

        <StatCard
          title="Verifikasi AI"
          value={statistics.total_ai_analysis ?? 0}
          description="Data pemeriksaan"
          icon="✦"
        />
      </div>

      {/* CHART + AI */}
      <div className="dashboard-grid">
        {/* CHART */}
        <section className="card chart-card">
          <div className="card-header">
            <div>
              <h4>Aktivitas Toko</h4>
              <p>Data toko dalam {period} bulan terakhir</p>
            </div>

            <div className="db-period" ref={periodRef}>
              <button
                type="button"
                className="outline-button"
                aria-haspopup="menu"
                aria-expanded={periodOpen}
                onClick={() => setPeriodOpen((prev) => !prev)}
              >
                {periodLabel}
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={periodOpen ? 'db-chevron-open' : ''}
                />
              </button>

              {periodOpen && (
                <div className="db-period-menu" role="menu">
                  {periodOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={option.value === period}
                      className={`db-period-item ${
                        option.value === period ? 'db-period-active' : ''
                      }`}
                      onClick={() => {
                        setPeriod(option.value)
                        setPeriodOpen(false)
                      }}
                    >
                      {option.label}
                      {option.value === period && (
                        <Check size={15} aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="chart">
            <div className="chart-y">
              <span>60</span>
              <span>45</span>
              <span>30</span>
              <span>15</span>
              <span>0</span>
            </div>

            <div className="chart-area">
              <div className="chart-lines">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>

              <div className="bars">
                {chartBars.map(({ month, height }) => (
                  <div className="bar-group" key={month}>
                    <div
                      className="bar"
                      style={{ height: `${height}%` }}
                    />

                    <span>{month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VERIFIKASI AI */}
        <section className="card verification-card">
          <div className="card-header">
            <div>
              <h4>Verifikasi AI</h4>
              <p>Status pemeriksaan terbaru</p>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() => onMenuChange?.('Verifikasi AI')}
            >
              Lihat semua
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>

          <div className="verification-list">
            {statistics.total_ai_analysis > 0 ? (
              <div className="verification-item">
                <div className="verification-icon">
                  <Sparkles size={20} aria-hidden="true" />
                </div>

                <div className="verification-info">
                  <strong>
                    {statistics.total_ai_analysis} analisis AI
                  </strong>

                  <span>Data analisis tersimpan di sistem</span>
                </div>

                <span className="status approved">Aktif</span>
              </div>
            ) : (
              <div className="verification-item">
                <div className="verification-icon">
                  <Sparkles size={20} aria-hidden="true" />
                </div>

                <div className="verification-info">
                  <strong>Belum ada pemeriksaan</strong>

                  <span>Belum ada hasil analisis AI</span>
                </div>

                <span className="status waiting">Menunggu</span>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* TOKO TERBARU */}
      <section className="card products-card">
        <div className="card-header">
          <div>
            <h4>Toko Terbaru</h4>

            <p>
              Daftar toko yang terdaftar di Kampung Keramik
              Dinoyo
            </p>
          </div>
        </div>

        <div className="dashboard-shop-list">
          {recentShops.length === 0 ? (
            <div className="empty-shop">
              <p>Belum ada data toko.</p>
            </div>
          ) : (
            recentShops.map((shop) => (
              <div className="dashboard-shop-item" key={shop.id}>
                {/* FOTO TOKO */}
                <div className="dashboard-shop-image">
                  {shopImages[shop.name] ? (
                    <img
                      src={shopImages[shop.name]}
                      alt={shop.name}
                    />
                  ) : (
                    <Store size={28} aria-hidden="true" />
                  )}
                </div>

                {/* INFORMASI TOKO */}
                <div className="dashboard-shop-info">
                  <strong>{shop.name}</strong>

                  <span>
                    {shop.address || 'Alamat belum tersedia'}
                  </span>

                  <small>
                    {shop.is_active ? 'Toko aktif' : 'Toko nonaktif'}
                  </small>
                </div>

                {/* STATUS */}
                <span
                  className={`status ${
                    shop.is_active ? 'approved' : 'waiting'
                  }`}
                >
                  {shop.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      <style>{`
        .date-badge,
        .outline-button,
        .text-button,
        .dashboard-shop-image {
          display: inline-flex;
          align-items: center;
        }

        .date-badge,
        .outline-button,
        .text-button {
          gap: 6px;
        }

        .outline-button,
        .text-button {
          cursor: pointer;
        }

        .dashboard-shop-image {
          justify-content: center;
        }

        .verification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .db-period {
          position: relative;
        }

        .db-chevron-open {
          transform: rotate(180deg);
        }

        .db-period-menu {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          z-index: 50;
          min-width: 150px;
          padding: 6px;
          background: #ffffff;
          border: 1px solid #eadfd7;
          border-radius: 12px;
          box-shadow: 0 12px 30px rgba(61, 39, 25, 0.16);
        }

        .db-period-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 9px 12px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #40342d;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
        }

        .db-period-item:hover {
          background: #fff6ee;
          color: #b86f3f;
        }

        .db-period-active {
          color: #b86f3f;
          font-weight: 600;
        }

        .outline-button:focus-visible,
        .text-button:focus-visible,
        .db-period-item:focus-visible {
          outline: 2px solid #cf7d45;
          outline-offset: 2px;
        }
      `}</style>
    </>
  )
}

export default Dashboard