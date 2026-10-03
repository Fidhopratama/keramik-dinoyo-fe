import { useEffect, useState } from 'react'

import StatCard from '../components/StatCard'
import api from '../services/api'

function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        <p>{error}</p>
      </div>
    )
  }

  const statistics = dashboard?.statistics || {}
  const recentShops = dashboard?.recent_shops || []

  return (
    <>
      {/* HEADER */}
      <div className="page-heading">
        <div>
          <h3>Overview</h3>
          <p>
            Pantau aktivitas Kampung Keramik Dinoyo.
          </p>
        </div>

        <div className="date-badge">
          <span>◷</span>

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
        <section className="card chart-card">
          <div className="card-header">
            <div>
              <h4>Aktivitas Toko</h4>

              <p>
                Data toko dalam beberapa bulan terakhir
              </p>
            </div>

            <button className="outline-button">
              6 Bulan⌄
            </button>
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
                {[48, 64, 54, 78, 66, 88].map(
                  (height, index) => (
                    <div
                      className="bar-group"
                      key={index}
                    >
                      <div
                        className="bar"
                        style={{
                          height: `${height}%`,
                        }}
                      />

                      <span>
                        {[
                          'Apr',
                          'Mei',
                          'Jun',
                          'Jul',
                          'Agu',
                          'Sep',
                        ][index]}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* VERIFIKASI AI */}
        <section className="card verification-card">
          <div className="card-header">
            <div>
              <h4>Verifikasi AI</h4>

              <p>
                Status pemeriksaan terbaru
              </p>
            </div>

            <button className="text-button">
              Lihat semua →
            </button>
          </div>

          <div className="verification-list">
            {statistics.total_ai_analysis > 0 ? (
              <div className="verification-item">
                <div className="verification-icon">
                  ✦
                </div>

                <div className="verification-info">
                  <strong>
                    {statistics.total_ai_analysis} analisis AI
                  </strong>

                  <span>
                    Data analisis tersimpan di sistem
                  </span>
                </div>

                <span className="status approved">
                  Aktif
                </span>
              </div>
            ) : (
              <div className="verification-item">
                <div className="verification-icon">
                  ✦
                </div>

                <div className="verification-info">
                  <strong>
                    Belum ada pemeriksaan
                  </strong>

                  <span>
                    Belum ada hasil analisis AI
                  </span>
                </div>

                <span className="status waiting">
                  Menunggu
                </span>
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
              Daftar toko yang terdaftar di
              Kampung Keramik Dinoyo
            </p>
          </div>

          {/* <button className="primary-button">
            + Tambah Toko
          </button> */}
        </div>

        <div className="dashboard-shop-list">
          {recentShops.length === 0 ? (
            <div className="empty-shop">
              <p>Belum ada data toko.</p>
            </div>
          ) : (
            recentShops.map((shop) => (
              <div
                className="dashboard-shop-item"
                key={shop.id}
              >
                <div className="dashboard-shop-image">
                  {shop.image_url ? (
                    <img
                      src={shop.image_url}
                      alt={shop.name}
                    />
                  ) : (
                    <span>⌂</span>
                  )}
                </div>

                <div className="dashboard-shop-info">
                  <strong>{shop.name}</strong>

                  <span>
                    {shop.address ||
                      'Alamat belum tersedia'}
                  </span>

                  <small>
                    {shop.is_active
                      ? 'Toko aktif'
                      : 'Toko nonaktif'}
                  </small>
                </div>

                <span
                  className={`status ${
                    shop.is_active
                      ? 'approved'
                      : 'waiting'
                  }`}
                >
                  {shop.is_active
                    ? 'Aktif'
                    : 'Nonaktif'}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}

export default Dashboard