import { useEffect, useState } from 'react'
import { Activity, CircleCheck, Clock, Sparkles } from 'lucide-react'

import VerificationTable from '../components/VerificationTable'

import { getAiAnalysisResults } from '../services/api'

function VerifikasiAI() {
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadVerifications = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getAiAnalysisResults()

        if (active) {
          setVerifications(response.data?.data || [])
        }
      } catch (err) {
        console.error('Gagal mengambil hasil AI:', err)

        if (active) {
          setError(
            err.response?.data?.message ||
              'Data hasil AI gagal dimuat.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadVerifications()

    // Cegah update state kalau halaman sudah ditutup
    return () => {
      active = false
    }
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

          <p>Pemeriksaan data produk menggunakan layanan AI.</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatSmall
          title="Menunggu Verifikasi"
          value={waiting}
          icon={Clock}
        />

        <StatSmall
          title="Disetujui"
          value={approved}
          icon={CircleCheck}
        />

        <StatSmall
          title="Total Pemeriksaan"
          value={verifications.length}
          icon={Sparkles}
        />

        <StatSmall
          title="Status AI"
          value="Aktif"
          icon={Activity}
        />
      </div>

      <section className="card products-card">
        <div className="card-header">
          <div>
            <h4>Hasil Pemeriksaan AI</h4>

            <p>Admin dapat memeriksa hasil analisis AI.</p>
          </div>

          {loading && (
            <span className="loading-text" role="status">
              Memuat...
            </span>
          )}
        </div>

        {error && (
          <div className="loading-box" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <VerificationTable data={verifications} />
        )}

        {!loading && !error && verifications.length === 0 && (
          <div className="loading-box">
            Belum ada hasil analisis AI.
          </div>
        )}
      </section>

      <style>{`
        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  )
}

function StatSmall({ title, value, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">
          <Icon size={22} aria-hidden="true" />
        </div>
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-title">{title}</div>
    </div>
  )
}

export default VerifikasiAI