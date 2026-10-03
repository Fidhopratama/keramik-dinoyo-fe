import { useEffect, useState } from 'react'

import VerificationTable from '../components/VerificationTable'

import { getAiAnalysisResults } from '../services/api'

function VerifikasiAI() {
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadVerifications = async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await getAiAnalysisResults()

        setVerifications(
          response.data?.data || [],
        )
      } catch (error) {
        console.error(
          'Gagal mengambil hasil AI:',
          error,
        )

        setError(
          error.response?.data?.message ||
            'Data hasil AI gagal dimuat.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadVerifications()
  }, [])

  const waiting = verifications.filter(
    (item) => item.status === 'pending',
  ).length

  const approved = verifications.filter(
    (item) => item.status === 'success',
  ).length

  return (
    <>
      <div className="page-heading">
        <div>
          <h3>Verifikasi AI</h3>

          <p>
            Pemeriksaan data produk menggunakan layanan AI.
          </p>
        </div>
      </div>

      <div className="stat-grid">
        <StatSmall
          title="Menunggu Verifikasi"
          value={waiting}
          icon="◷"
        />

        <StatSmall
          title="Disetujui"
          value={approved}
          icon="✓"
        />

        <StatSmall
          title="Total Pemeriksaan"
          value={verifications.length}
          icon="✦"
        />

        <StatSmall
          title="Status AI"
          value="Aktif"
          icon="●"
        />
      </div>

      <section className="card products-card">
        <div className="card-header">
          <div>
            <h4>Hasil Pemeriksaan AI</h4>

            <p>
              Admin dapat memeriksa hasil analisis AI.
            </p>
          </div>

          {loading && (
            <span className="loading-text">
              Memuat...
            </span>
          )}
        </div>

        {error && (
          <div className="loading-box">
            {error}
          </div>
        )}

        {!loading && !error && (
          <VerificationTable
            data={verifications}
          />
        )}

        {!loading &&
          !error &&
          verifications.length === 0 && (
            <div className="loading-box">
              Belum ada hasil analisis AI.
            </div>
          )}
      </section>
    </>
  )
}

function StatSmall({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">
          {icon}
        </div>
      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-title">
        {title}
      </div>
    </div>
  )
}

export default VerifikasiAI