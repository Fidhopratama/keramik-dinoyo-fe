import { useEffect, useState } from 'react'
import {
  createWorkshop,
  deleteWorkshop,
  getWorkshops,
  updateWorkshop,
} from '../services/api'

const initialForm = {
  title: '',
  description: '',
  instructor: '',
  date: '',
  start_time: '',
  end_time: '',
  capacity: 10,
  location: '',
  status: 'upcoming',
}

function Workshop() {
  const [workshops, setWorkshops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingWorkshop, setEditingWorkshop] = useState(null)

  const [form, setForm] = useState(initialForm)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchWorkshops()
  }, [])

  const fetchWorkshops = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getWorkshops()

      setWorkshops(response.data?.data || [])
    } catch (err) {
      console.error('Workshop error:', err)

      setError(
        err.response?.data?.message ||
          'Data kegiatan gagal dimuat.',
      )
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingWorkshop(null)
    setForm(initialForm)
    setImageFile(null)
    setImagePreview('')
    setShowModal(true)
  }

  const openEditModal = (workshop) => {
    setEditingWorkshop(workshop)

    setForm({
      title: workshop.title || '',
      description: workshop.description || '',
      instructor: workshop.instructor || '',
      date: workshop.date
        ? String(workshop.date).substring(0, 10)
        : '',
      start_time: workshop.start_time
        ? String(workshop.start_time).substring(0, 5)
        : '',
      end_time: workshop.end_time
        ? String(workshop.end_time).substring(0, 5)
        : '',
      capacity: workshop.capacity ?? 10,
      location: workshop.location || '',
      status: workshop.status || 'upcoming',
    })

    setImageFile(null)
    setImagePreview(workshop.image_url || workshop.image || '')
    setShowModal(true)
  }

  const closeModal = () => {
    if (saving) return

    setShowModal(false)
    setEditingWorkshop(null)
    setForm(initialForm)
    setImageFile(null)
    setImagePreview('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!allowedTypes.includes(file.type)) {
      alert('Format gambar harus JPG, JPEG, PNG, atau WEBP.')
      event.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2 MB.')
      event.target.value = ''
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)

      const formData = new FormData()

      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('instructor', form.instructor)
      formData.append('date', form.date)
      formData.append('start_time', form.start_time)
      formData.append('end_time', form.end_time)
      formData.append('capacity', form.capacity)
      formData.append('location', form.location)
      formData.append('status', form.status)

      if (imageFile) {
        formData.append('image', imageFile)
      }

      if (editingWorkshop) {
        formData.append('_method', 'PUT')

        await updateWorkshop(
          editingWorkshop.id,
          formData,
        )

        alert('Kegiatan berhasil diperbarui.')
      } else {
        await createWorkshop(formData)

        alert('Kegiatan berhasil ditambahkan.')
      }

      closeModal()
      await fetchWorkshops()
    } catch (err) {
      console.error('Save workshop error:', err)

      const validationErrors =
        err.response?.data?.errors

      if (validationErrors) {
        const firstError = Object.values(validationErrors)
          .flat()
          .find(Boolean)

        alert(firstError || 'Data kegiatan tidak valid.')
      } else {
        alert(
          err.response?.data?.message ||
            'Gagal menyimpan kegiatan.',
        )
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (workshop) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus kegiatan "${workshop.title}"?`,
    )

    if (!confirmed) return

    try {
      await deleteWorkshop(workshop.id)

      alert('Kegiatan berhasil dihapus.')

      await fetchWorkshops()
    } catch (err) {
      console.error('Delete workshop error:', err)

      alert(
        err.response?.data?.message ||
          'Gagal menghapus kegiatan.',
      )
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      upcoming: 'Akan Datang',
      ongoing: 'Berlangsung',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    }

    return labels[status] || status
  }

  const getStatusClass = (status) => {
    const classes = {
      upcoming: 'upcoming',
      ongoing: 'ongoing',
      completed: 'completed',
      cancelled: 'cancelled',
    }

    return classes[status] || 'upcoming'
  }

  const formatDate = (date) => {
    if (!date) return '-'

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      },
    )
  }

  const filteredWorkshops = workshops.filter((workshop) => {
    const keyword = search.toLowerCase().trim()

    const matchesSearch =
      !keyword ||
      workshop.title?.toLowerCase().includes(keyword) ||
      workshop.instructor
        ?.toLowerCase()
        .includes(keyword) ||
      workshop.location
        ?.toLowerCase()
        .includes(keyword)

    const matchesStatus =
      statusFilter === 'all' ||
      workshop.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="card">
        <p>Memuat data kegiatan...</p>
      </div>
    )
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h3>Workshop & Kegiatan</h3>
          <p>
            Kelola kegiatan dan workshop Kampung Keramik
            Dinoyo.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateModal}
        >
          + Tambah Kegiatan
        </button>
      </div>

      {error && (
        <div className="card workshop-error">
          <p>{error}</p>
          <button
            className="outline-button"
            onClick={fetchWorkshops}
          >
            Coba Lagi
          </button>
        </div>
      )}

      <section className="card workshop-toolbar">
        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Cari kegiatan, instruktur, atau lokasi..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="all">Semua Status</option>
          <option value="upcoming">Akan Datang</option>
          <option value="ongoing">Berlangsung</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </section>

      <section className="workshop-grid">
        {filteredWorkshops.length === 0 ? (
          <div className="card workshop-empty">
            <div className="workshop-empty-icon">▣</div>

            <h4>
              {workshops.length === 0
                ? 'Belum ada kegiatan'
                : 'Kegiatan tidak ditemukan'}
            </h4>

            <p>
              {workshops.length === 0
                ? 'Tambahkan workshop atau kegiatan baru.'
                : 'Coba gunakan kata kunci pencarian lain.'}
            </p>

            {workshops.length === 0 && (
              <button
                className="primary-button"
                onClick={openCreateModal}
              >
                + Tambah Kegiatan
              </button>
            )}
          </div>
        ) : (
          filteredWorkshops.map((workshop) => (
            <article
              className="workshop-card"
              key={workshop.id}
            >
              <div className="workshop-image">
                {workshop.image_url ||
                workshop.image ? (
                  <img
                    src={
                      workshop.image_url ||
                      workshop.image
                    }
                    alt={workshop.title}
                  />
                ) : (
                  <div className="workshop-image-placeholder">
                    ▣
                  </div>
                )}

                <span
                  className={`workshop-status ${getStatusClass(
                    workshop.status,
                  )}`}
                >
                  {getStatusLabel(workshop.status)}
                </span>
              </div>

              <div className="workshop-content">
                <h4>{workshop.title}</h4>

                <p className="workshop-description">
                  {workshop.description ||
                    'Tidak ada deskripsi kegiatan.'}
                </p>

                <div className="workshop-info">
                  <div>
                    <span>▣</span>
                    <strong>
                      {formatDate(workshop.date)}
                    </strong>
                  </div>

                  <div>
                    <span>◷</span>
                    <strong>
                      {workshop.start_time?.substring(
                        0,
                        5,
                      )}{' '}
                      -{' '}
                      {workshop.end_time?.substring(
                        0,
                        5,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>♙</span>
                    <strong>
                      {workshop.instructor ||
                        'Instruktur belum diisi'}
                    </strong>
                  </div>

                  <div>
                    <span>⌂</span>
                    <strong>
                      {workshop.location ||
                        'Lokasi belum diisi'}
                    </strong>
                  </div>

                  <div>
                    <span>♧</span>
                    <strong>
                      Kapasitas {workshop.capacity} orang
                    </strong>
                  </div>
                </div>

                <div className="workshop-actions">
                  <button
                    className="outline-button"
                    onClick={() =>
                      openEditModal(workshop)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="danger-button"
                    onClick={() =>
                      handleDelete(workshop)
                    }
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal()
            }
          }}
        >
          <div className="modal workshop-modal">
            <div className="modal-header">
              <div>
                <h3>
                  {editingWorkshop
                    ? 'Edit Kegiatan'
                    : 'Tambah Kegiatan'}
                </h3>

                <p>
                  Isi informasi kegiatan workshop.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
                type="button"
              >
                ×
              </button>
            </div>

            <form
              className="modal-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label>
                  Judul Kegiatan
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Contoh: Workshop Membuat Keramik"
                  required
                />
              </div>

              <div className="form-group">
                <label>Deskripsi</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Deskripsi singkat kegiatan..."
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Instruktur</label>

                  <input
                    type="text"
                    name="instructor"
                    value={form.instructor}
                    onChange={handleChange}
                    placeholder="Nama instruktur"
                  />
                </div>

                <div className="form-group">
                  <label>Kapasitas</label>

                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Tanggal
                    <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Status
                    <span>*</span>
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="upcoming">
                      Akan Datang
                    </option>
                    <option value="ongoing">
                      Berlangsung
                    </option>
                    <option value="completed">
                      Selesai
                    </option>
                    <option value="cancelled">
                      Dibatalkan
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Jam Mulai
                    <span>*</span>
                  </label>

                  <input
                    type="time"
                    name="start_time"
                    value={form.start_time}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Jam Selesai
                    <span>*</span>
                  </label>

                  <input
                    type="time"
                    name="end_time"
                    value={form.end_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Lokasi</label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Contoh: Studio Keramik Dinoyo"
                />
              </div>

              <div className="form-group">
                <label>Foto Kegiatan</label>

                <div className="image-upload">
                  <input
                    id="workshop-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                  />

                  <label
                    htmlFor="workshop-image"
                    className="image-upload-box"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview kegiatan"
                      />
                    ) : (
                      <>
                        <span className="upload-icon">
                          ↑
                        </span>

                        <strong>
                          Klik untuk memilih gambar
                        </strong>

                        <small>
                          JPG, PNG, WEBP — maksimal 2 MB
                        </small>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="outline-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? 'Menyimpan...'
                    : editingWorkshop
                      ? 'Simpan Perubahan'
                      : 'Tambah Kegiatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Workshop