import { useEffect, useState } from 'react'
import {
  createWorkshop,
  deleteWorkshop,
  getWorkshops,
  updateWorkshop,
} from '../services/api'

import workshopKeramik1 from '../assets/images/workshop-keramik-1.jpg'
import workshopKeramik2 from '../assets/images/workshop-keramik-2.jpg'
import workshopKeramik3 from '../assets/images/workshop-keramik-3.jpg'

const localWorkshopImages = [
  workshopKeramik1,
  workshopKeramik2,
  workshopKeramik3,
]

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

  const [form, setForm] = useState({ ...initialForm })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

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

      const data = response.data?.data || []

      setWorkshops(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('GET WORKSHOP ERROR:', err)

      setError(
        err.response?.data?.message ||
          'Data kegiatan gagal dimuat.',
      )
    } finally {
      setLoading(false)
    }
  }

  const getImageForWorkshop = (workshop, index) => {
    if (workshop.image_url) {
      return workshop.image_url
    }

    if (
      workshop.image &&
      typeof workshop.image === 'string'
    ) {
      if (
        workshop.image.startsWith('http://') ||
        workshop.image.startsWith('https://') ||
        workshop.image.startsWith('blob:')
      ) {
        return workshop.image
      }

      return workshop.image
    }

    return (
      localWorkshopImages[index] ||
      localWorkshopImages[
        index % localWorkshopImages.length
      ] ||
      ''
    )
  }

  const openCreateModal = () => {
    setEditingWorkshop(null)
    setForm({ ...initialForm })
    setImageFile(null)
    setImagePreview('')
    setShowModal(true)
  }

  const openEditModal = (workshop, index) => {
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

    const existingImage =
      workshop.image_url ||
      workshop.image ||
      localWorkshopImages[
        index % localWorkshopImages.length
      ]

    setImagePreview(existingImage || '')

    setShowModal(true)
  }

  const closeModal = () => {
    if (saving) return

    if (imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setShowModal(false)
    setEditingWorkshop(null)
    setForm({ ...initialForm })
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
      alert(
        'Format gambar harus JPG, JPEG, PNG, atau WEBP.',
      )

      event.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2 MB.')

      event.target.value = ''
      return
    }

    if (imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    const previewUrl = URL.createObjectURL(file)

    setImageFile(file)
    setImagePreview(previewUrl)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (saving) return

    try {
      setSaving(true)

      const formData = new FormData()

      formData.append(
        'title',
        form.title.trim(),
      )

      formData.append(
        'description',
        form.description.trim(),
      )

      formData.append(
        'instructor',
        form.instructor.trim(),
      )

      formData.append('date', form.date)
      formData.append(
        'start_time',
        form.start_time,
      )

      formData.append(
        'end_time',
        form.end_time,
      )

      formData.append(
        'capacity',
        String(form.capacity),
      )

      formData.append(
        'location',
        form.location.trim(),
      )

      formData.append(
        'status',
        form.status,
      )

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
      console.error(
        'SAVE WORKSHOP ERROR:',
        err,
      )

      const validationErrors =
        err.response?.data?.errors

      if (validationErrors) {
        const firstError =
          Object.values(validationErrors)
            .flat()
            .find(Boolean)

        alert(
          firstError ||
            'Data kegiatan tidak valid.',
        )
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
    if (deletingId !== null) return

    const confirmed = window.confirm(
      `Yakin ingin menghapus kegiatan "${workshop.title}"?`,
    )

    if (!confirmed) return

    try {
      setDeletingId(workshop.id)

      await deleteWorkshop(workshop.id)

      setWorkshops((prev) =>
        prev.filter(
          (item) => item.id !== workshop.id,
        ),
      )

      alert('Kegiatan berhasil dihapus.')
    } catch (err) {
      console.error(
        'DELETE WORKSHOP ERROR:',
        err,
      )

      alert(
        err.response?.data?.message ||
          'Gagal menghapus kegiatan.',
      )
    } finally {
      setDeletingId(null)
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
    return (
      {
        upcoming: 'upcoming',
        ongoing: 'ongoing',
        completed: 'completed',
        cancelled: 'cancelled',
      }[status] || 'upcoming'
    )
  }

  const formatDate = (date) => {
    if (!date) return '-'

    const parsedDate = new Date(
      `${date}T00:00:00`,
    )

    if (Number.isNaN(parsedDate.getTime())) {
      return '-'
    }

    return parsedDate.toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      },
    )
  }

  const formatTime = (time) => {
    if (!time) return '--:--'

    return String(time).substring(0, 5)
  }

  const filteredWorkshops =
    workshops.filter((workshop) => {
      const keyword =
        search.toLowerCase().trim()

      const matchesSearch =
        !keyword ||
        workshop.title
          ?.toLowerCase()
          .includes(keyword) ||
        workshop.instructor
          ?.toLowerCase()
          .includes(keyword) ||
        workshop.location
          ?.toLowerCase()
          .includes(keyword)

      const matchesStatus =
        statusFilter === 'all' ||
        workshop.status === statusFilter

      return (
        matchesSearch &&
        matchesStatus
      )
    })

  if (loading) {
    return (
      <div className="workshop-page">
        <div className="workshop-loading">
          Memuat data kegiatan...
        </div>
      </div>
    )
  }

  return (
    <div className="workshop-page">
      <style>{`
        .workshop-page {
          width: 100%;
          box-sizing: border-box;
        }

        .workshop-page *,
        .workshop-page *::before,
        .workshop-page *::after {
          box-sizing: border-box;
        }

        .workshop-page .workshop-heading {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          gap: 20px !important;
          margin-bottom: 28px !important;
        }

        .workshop-page .workshop-heading h1 {
          margin: 0 !important;
          color: #3d2b1f !important;
          font-size: 28px !important;
          font-weight: 700 !important;
        }

        .workshop-page .workshop-heading p {
          margin: 7px 0 0 !important;
          color: #8a7769 !important;
          font-size: 14px !important;
        }

        .workshop-page .workshop-add-button {
          border: none !important;
          background: #c87842 !important;
          color: #ffffff !important;
          padding: 12px 19px !important;
          min-height: 42px !important;
          border-radius: 9px !important;
          font-family: inherit !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .workshop-page .workshop-add-button:hover {
          background: #ad6536 !important;
          transform: translateY(-1px) !important;
        }

        .workshop-page .workshop-toolbar {
          display: flex !important;
          align-items: center !important;
          gap: 14px !important;
          padding: 15px !important;
          margin-bottom: 24px !important;
          background: #ffffff !important;
          border: 1px solid #eee2d8 !important;
          border-radius: 13px !important;
        }

        .workshop-page .workshop-search {
          flex: 1 !important;
          position: relative !important;
        }

        .workshop-page .workshop-search-icon {
          position: absolute !important;
          left: 14px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          color: #9b8d82 !important;
          font-size: 20px !important;
          pointer-events: none !important;
        }

        .workshop-page .workshop-search input {
          width: 100% !important;
          height: 44px !important;
          padding: 0 15px 0 42px !important;
          border: 1px solid #ded2c9 !important;
          border-radius: 9px !important;
          outline: none !important;
          font-family: inherit !important;
          font-size: 14px !important;
          background: #ffffff !important;
        }

        .workshop-page .workshop-search input:focus {
          border-color: #c87842 !important;
          box-shadow: 0 0 0 3px rgba(200,120,66,.10) !important;
        }

        .workshop-page .workshop-filter {
          height: 44px !important;
          min-width: 190px !important;
          padding: 0 13px !important;
          border: 1px solid #ded2c9 !important;
          border-radius: 9px !important;
          background: #ffffff !important;
          color: #4d3b2f !important;
          font-family: inherit !important;
          font-size: 14px !important;
          outline: none !important;
        }

        .workshop-page .workshop-grid {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 24px !important;
        }

        .workshop-page .workshop-card {
          display: flex !important;
          flex-direction: column !important;
          overflow: hidden !important;
          background: #ffffff !important;
          border: 1px solid #eee2d8 !important;
          border-radius: 15px !important;
          box-shadow: 0 4px 14px rgba(74,52,39,.06) !important;
          transition: all .2s ease !important;
        }

        .workshop-page .workshop-card:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 9px 23px rgba(74,52,39,.10) !important;
        }

        .workshop-page .workshop-image {
          position: relative !important;
          width: 100% !important;
          height: 235px !important;
          overflow: hidden !important;
          background: #f5eee8 !important;
        }

        .workshop-page .workshop-image img {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        .workshop-page .workshop-image-placeholder {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #a79587 !important;
          font-size: 40px !important;
          background: #f5eee8 !important;
        }

        .workshop-page .workshop-status {
          position: absolute !important;
          top: 13px !important;
          right: 13px !important;
          padding: 6px 11px !important;
          border-radius: 30px !important;
          background: #ffffff !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          box-shadow: 0 3px 10px rgba(0,0,0,.08) !important;
          z-index: 2 !important;
        }

        .workshop-page .workshop-status.upcoming {
          color: #2768e8 !important;
        }

        .workshop-page .workshop-status.ongoing {
          color: #198754 !important;
        }

        .workshop-page .workshop-status.completed {
          color: #777777 !important;
        }

        .workshop-page .workshop-status.cancelled {
          color: #d9534f !important;
        }

        .workshop-page .workshop-content {
          padding: 21px !important;
        }

        .workshop-page .workshop-content h3 {
          margin: 0 !important;
          color: #3d2b1f !important;
          font-size: 19px !important;
          font-weight: 700 !important;
          line-height: 1.35 !important;
        }

        .workshop-page .workshop-description {
          margin: 9px 0 19px !important;
          min-height: 44px !important;
          color: #806f62 !important;
          font-size: 14px !important;
          line-height: 1.55 !important;
        }

        .workshop-page .workshop-info {
          display: flex !important;
          flex-direction: column !important;
          gap: 11px !important;
          padding-bottom: 18px !important;
          border-bottom: 1px solid #eee7e1 !important;
        }

        .workshop-page .workshop-info-row {
          display: flex !important;
          align-items: center !important;
          gap: 11px !important;
          color: #5f554e !important;
        }

        .workshop-page .workshop-info-icon {
          width: 22px !important;
          flex: 0 0 22px !important;
          text-align: center !important;
          color: #c87842 !important;
        }

        .workshop-page .workshop-info-row strong {
          font-size: 13px !important;
          font-weight: 500 !important;
          line-height: 1.4 !important;
        }

        /* =========================
           EDIT & HAPUS - FIX TOTAL
           ========================= */

        .workshop-page .workshop-actions {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 10px !important;
          width: 100% !important;
          margin-top: 18px !important;
        }

        .workshop-page .workshop-edit-btn,
        .workshop-page .workshop-delete-btn {
          appearance: none !important;
          -webkit-appearance: none !important;
          width: 100% !important;
          height: 42px !important;
          min-height: 42px !important;
          margin: 0 !important;
          padding: 0 15px !important;
          border-radius: 9px !important;
          font-family: inherit !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          line-height: 1 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 7px !important;
          cursor: pointer !important;
          transition: all .2s ease !important;
        }

        .workshop-page .workshop-edit-btn {
          background: #fff7ed !important;
          color: #c87842 !important;
          border: 1px solid #e8c7aa !important;
        }

        .workshop-page .workshop-edit-btn:hover:not(:disabled) {
          background: #c87842 !important;
          color: #ffffff !important;
          border-color: #c87842 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 10px rgba(200,120,66,.18) !important;
        }

        .workshop-page .workshop-delete-btn {
          background: #fff5f5 !important;
          color: #d9534f !important;
          border: 1px solid #edc4c4 !important;
        }

        .workshop-page .workshop-delete-btn:hover:not(:disabled) {
          background: #d9534f !important;
          color: #ffffff !important;
          border-color: #d9534f !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 10px rgba(217,83,79,.18) !important;
        }

        .workshop-page .workshop-edit-btn:disabled,
        .workshop-page .workshop-delete-btn:disabled {
          opacity: .55 !important;
          cursor: not-allowed !important;
          transform: none !important;
          box-shadow: none !important;
        }

        .workshop-page .workshop-button-icon {
          font-size: 15px !important;
          line-height: 1 !important;
        }

        /* EMPTY */

        .workshop-page .workshop-empty {
          grid-column: 1 / -1 !important;
          padding: 60px 25px !important;
          text-align: center !important;
          background: #ffffff !important;
          border: 1px solid #eee2d8 !important;
          border-radius: 14px !important;
        }

        .workshop-page .workshop-empty-icon {
          margin-bottom: 12px !important;
          color: #b5a69a !important;
          font-size: 40px !important;
        }

        .workshop-page .workshop-empty h3 {
          margin: 0 0 8px !important;
          color: #3d2b1f !important;
        }

        .workshop-page .workshop-empty p {
          margin: 0 0 18px !important;
          color: #806f62 !important;
        }

        /* ERROR */

        .workshop-page .workshop-error {
          margin-bottom: 20px !important;
          padding: 13px 16px !important;
          border-radius: 9px !important;
          background: #fff1f1 !important;
          border: 1px solid #efc2c2 !important;
          color: #c0392b !important;
        }

        /* MODAL */

        .workshop-page .workshop-modal-overlay {
          position: fixed !important;
          inset: 0 !important;
          z-index: 99999 !important;
          padding: 20px !important;
          background: rgba(35,25,19,.55) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .workshop-page .workshop-modal {
          width: min(720px, 100%) !important;
          max-height: 92vh !important;
          overflow-y: auto !important;
          padding: 25px !important;
          background: #ffffff !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 55px rgba(0,0,0,.2) !important;
        }

        .workshop-page .workshop-modal-header {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 15px !important;
          margin-bottom: 22px !important;
        }

        .workshop-page .workshop-modal-header h2 {
          margin: 0 !important;
          color: #3d2b1f !important;
          font-size: 21px !important;
        }

        .workshop-page .workshop-modal-header p {
          margin: 5px 0 0 !important;
          color: #8a7769 !important;
          font-size: 13px !important;
        }

        .workshop-page .workshop-close {
          width: 35px !important;
          height: 35px !important;
          flex: 0 0 35px !important;
          border: none !important;
          border-radius: 50% !important;
          background: #f5eee8 !important;
          color: #6e5c50 !important;
          font-size: 22px !important;
          cursor: pointer !important;
        }

        .workshop-page .workshop-form-group {
          margin-bottom: 16px !important;
        }

        .workshop-page .workshop-form-group label {
          display: block !important;
          margin-bottom: 7px !important;
          color: #4d3b2f !important;
          font-size: 13px !important;
          font-weight: 600 !important;
        }

        .workshop-page .workshop-form-group label span {
          color: #d9534f !important;
          margin-left: 3px !important;
        }

        .workshop-page .workshop-form-group input,
        .workshop-page .workshop-form-group textarea,
        .workshop-page .workshop-form-group select {
          width: 100% !important;
          box-sizing: border-box !important;
          padding: 10px 12px !important;
          border: 1px solid #ded2c9 !important;
          border-radius: 8px !important;
          outline: none !important;
          background: #ffffff !important;
          color: #3d2b1f !important;
          font-family: inherit !important;
          font-size: 14px !important;
        }

        .workshop-page .workshop-form-group textarea {
          min-height: 95px !important;
          resize: vertical !important;
        }

        .workshop-page .workshop-form-group input:focus,
        .workshop-page .workshop-form-group textarea:focus,
        .workshop-page .workshop-form-group select:focus {
          border-color: #c87842 !important;
          box-shadow: 0 0 0 3px rgba(200,120,66,.10) !important;
        }

        .workshop-page .workshop-form-row {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 14px !important;
        }

        .workshop-page .workshop-file {
          display: none !important;
        }

        .workshop-page .workshop-upload {
          width: 100% !important;
          min-height: 180px !important;
          padding: 18px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 7px !important;
          border: 1.5px dashed #d8d0c9 !important;
          border-radius: 11px !important;
          background: #faf9f7 !important;
          cursor: pointer !important;
          overflow: hidden !important;
        }

        .workshop-page .workshop-upload:hover {
          border-color: #c87842 !important;
          background: #fffaf5 !important;
        }

        .workshop-page .workshop-upload img {
          width: 100% !important;
          height: 210px !important;
          object-fit: cover !important;
          border-radius: 8px !important;
        }

        .workshop-page .workshop-upload-icon {
          width: 44px !important;
          height: 44px !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: #fff0e4 !important;
          color: #c87842 !important;
          font-size: 22px !important;
        }

        .workshop-page .workshop-upload strong {
          color: #3d2b1f !important;
          font-size: 14px !important;
        }

        .workshop-page .workshop-upload small {
          color: #999 !important;
          font-size: 12px !important;
        }

        .workshop-page .workshop-modal-actions {
          display: flex !important;
          justify-content: flex-end !important;
          gap: 10px !important;
          margin-top: 22px !important;
        }

        .workshop-page .workshop-cancel,
        .workshop-page .workshop-save {
          height: 42px !important;
          padding: 0 18px !important;
          border-radius: 9px !important;
          font-family: inherit !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
        }

        .workshop-page .workshop-cancel {
          background: #ffffff !important;
          color: #5f554e !important;
          border: 1px solid #ddd5ce !important;
        }

        .workshop-page .workshop-save {
          background: #c87842 !important;
          color: #ffffff !important;
          border: 1px solid #c87842 !important;
        }

        .workshop-page .workshop-save:hover:not(:disabled) {
          background: #ad6536 !important;
          border-color: #ad6536 !important;
        }

        .workshop-page .workshop-cancel:disabled,
        .workshop-page .workshop-save:disabled {
          opacity: .55 !important;
          cursor: not-allowed !important;
        }

        .workshop-page .workshop-loading {
          padding: 30px !important;
          color: #806f62 !important;
        }

        @media (max-width: 900px) {
          .workshop-page .workshop-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 650px) {
          .workshop-page .workshop-heading {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .workshop-page .workshop-toolbar {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .workshop-page .workshop-filter {
            width: 100% !important;
          }

          .workshop-page .workshop-form-row {
            grid-template-columns: 1fr !important;
          }

          .workshop-page .workshop-actions {
            grid-template-columns: 1fr !important;
          }

          .workshop-page .workshop-modal {
            padding: 18px !important;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="workshop-heading">
        <div>
          <h1>Workshop & Kegiatan</h1>

          <p>
            Kelola kegiatan dan workshop Kampung
            Keramik Dinoyo.
          </p>
        </div>

        <button
          type="button"
          className="workshop-add-button"
          onClick={openCreateModal}
        >
          + Tambah Kegiatan
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="workshop-error">
          {error}
        </div>
      )}

      {/* SEARCH */}
      <div className="workshop-toolbar">
        <div className="workshop-search">
          <span className="workshop-search-icon">
            ⌕
          </span>

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
          className="workshop-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value,
            )
          }
        >
          <option value="all">
            Semua Status
          </option>

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

      {/* WORKSHOP */}
      <div className="workshop-grid">
        {filteredWorkshops.length === 0 ? (
          <div className="workshop-empty">
            <div className="workshop-empty-icon">
              ▣
            </div>

            <h3>
              {workshops.length === 0
                ? 'Belum ada kegiatan'
                : 'Kegiatan tidak ditemukan'}
            </h3>

            <p>
              {workshops.length === 0
                ? 'Tambahkan workshop atau kegiatan baru.'
                : 'Coba gunakan kata kunci pencarian lain.'}
            </p>

            {workshops.length === 0 && (
              <button
                type="button"
                className="workshop-add-button"
                onClick={
                  openCreateModal
                }
              >
                + Tambah Kegiatan
              </button>
            )}
          </div>
        ) : (
          filteredWorkshops.map(
            (workshop) => {
              const originalIndex =
                workshops.findIndex(
                  (item) =>
                    item.id ===
                    workshop.id,
                )

              const imageUrl =
                getImageForWorkshop(
                  workshop,
                  originalIndex,
                )

              return (
                <div
                  className="workshop-card"
                  key={workshop.id}
                >
                  {/* IMAGE */}
                  <div className="workshop-image">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={
                          workshop.title ||
                          'Workshop'
                        }
                        onError={(event) => {
                          event.currentTarget.style.display =
                            'none'

                          const placeholder =
                            event.currentTarget
                              .parentElement
                              .querySelector(
                                '.workshop-image-placeholder',
                              )

                          if (
                            placeholder
                          ) {
                            placeholder.style.display =
                              'flex'
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className="workshop-image-placeholder"
                      style={{
                        display:
                          imageUrl
                            ? 'none'
                            : 'flex',
                      }}
                    >
                      ▣
                    </div>

                    <span
                      className={`workshop-status ${getStatusClass(
                        workshop.status,
                      )}`}
                    >
                      {getStatusLabel(
                        workshop.status,
                      )}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="workshop-content">
                    <h3>
                      {workshop.title ||
                        'Kegiatan Workshop'}
                    </h3>

                    <p className="workshop-description">
                      {workshop.description ||
                        'Tidak ada deskripsi kegiatan.'}
                    </p>

                    <div className="workshop-info">
                      <div className="workshop-info-row">
                        <span className="workshop-info-icon">
                          ▣
                        </span>

                        <strong>
                          {formatDate(
                            workshop.date,
                          )}
                        </strong>
                      </div>

                      <div className="workshop-info-row">
                        <span className="workshop-info-icon">
                          ◷
                        </span>

                        <strong>
                          {formatTime(
                            workshop.start_time,
                          )}{' '}
                          -{' '}
                          {formatTime(
                            workshop.end_time,
                          )}
                        </strong>
                      </div>

                      <div className="workshop-info-row">
                        <span className="workshop-info-icon">
                          ♙
                        </span>

                        <strong>
                          {workshop.instructor ||
                            'Instruktur belum diisi'}
                        </strong>
                      </div>

                      <div className="workshop-info-row">
                        <span className="workshop-info-icon">
                          ⌂
                        </span>

                        <strong>
                          {workshop.location ||
                            'Lokasi belum diisi'}
                        </strong>
                      </div>

                      <div className="workshop-info-row">
                        <span className="workshop-info-icon">
                          ♧
                        </span>

                        <strong>
                          Kapasitas{' '}
                          {workshop.capacity ??
                            0}{' '}
                          orang
                        </strong>
                      </div>
                    </div>

                    {/* EDIT / HAPUS */}
                    <div className="workshop-actions">
                      <button
                        type="button"
                        className="workshop-edit-btn"
                        onClick={() =>
                          openEditModal(
                            workshop,
                            originalIndex,
                          )
                        }
                        disabled={
                          deletingId !==
                            null ||
                          saving
                        }
                      >
                        <span className="workshop-button-icon">
                          ✎
                        </span>

                        Edit
                      </button>

                      <button
                        type="button"
                        className="workshop-delete-btn"
                        onClick={() =>
                          handleDelete(
                            workshop,
                          )
                        }
                        disabled={
                          deletingId !==
                            null ||
                          saving
                        }
                      >
                        <span className="workshop-button-icon">
                          🗑
                        </span>

                        {deletingId ===
                        workshop.id
                          ? 'Menghapus...'
                          : 'Hapus'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            },
          )
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="workshop-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal()
            }
          }}
        >
          <div className="workshop-modal">
            <div className="workshop-modal-header">
              <div>
                <h2>
                  {editingWorkshop
                    ? 'Edit Kegiatan'
                    : 'Tambah Kegiatan'}
                </h2>

                <p>
                  {editingWorkshop
                    ? 'Perbarui informasi kegiatan.'
                    : 'Isi informasi kegiatan workshop.'}
                </p>
              </div>

              <button
                type="button"
                className="workshop-close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
            >
              {/* JUDUL */}
              <div className="workshop-form-group">
                <label>
                  Judul Kegiatan
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={
                    handleChange
                  }
                  placeholder="Contoh: Workshop Membuat Keramik"
                  required
                  disabled={saving}
                />
              </div>

              {/* DESKRIPSI */}
              <div className="workshop-form-group">
                <label>
                  Deskripsi
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Deskripsi singkat kegiatan..."
                  rows="4"
                  disabled={saving}
                />
              </div>

              {/* INSTRUKTUR + KAPASITAS */}
              <div className="workshop-form-row">
                <div className="workshop-form-group">
                  <label>
                    Instruktur
                  </label>

                  <input
                    type="text"
                    name="instructor"
                    value={
                      form.instructor
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Nama instruktur"
                    disabled={saving}
                  />
                </div>

                <div className="workshop-form-group">
                  <label>
                    Kapasitas
                  </label>

                  <input
                    type="number"
                    name="capacity"
                    value={
                      form.capacity
                    }
                    onChange={
                      handleChange
                    }
                    min="1"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              {/* TANGGAL + STATUS */}
              <div className="workshop-form-row">
                <div className="workshop-form-group">
                  <label>
                    Tanggal
                    <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={
                      handleChange
                    }
                    required
                    disabled={saving}
                  />
                </div>

                <div className="workshop-form-group">
                  <label>
                    Status
                    <span>*</span>
                  </label>

                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleChange
                    }
                    required
                    disabled={saving}
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

              {/* JAM */}
              <div className="workshop-form-row">
                <div className="workshop-form-group">
                  <label>
                    Jam Mulai
                    <span>*</span>
                  </label>

                  <input
                    type="time"
                    name="start_time"
                    value={
                      form.start_time
                    }
                    onChange={
                      handleChange
                    }
                    required
                    disabled={saving}
                  />
                </div>

                <div className="workshop-form-group">
                  <label>
                    Jam Selesai
                    <span>*</span>
                  </label>

                  <input
                    type="time"
                    name="end_time"
                    value={
                      form.end_time
                    }
                    onChange={
                      handleChange
                    }
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              {/* LOKASI */}
              <div className="workshop-form-group">
                <label>
                  Lokasi
                </label>

                <input
                  type="text"
                  name="location"
                  value={
                    form.location
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Contoh: Studio Keramik Dinoyo"
                  disabled={saving}
                />
              </div>

              {/* FOTO */}
              <div className="workshop-form-group">
                <label>
                  Foto Kegiatan
                </label>

                <input
                  id="workshop-image-input"
                  className="workshop-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleImageChange
                  }
                  disabled={saving}
                />

                <label
                  htmlFor="workshop-image-input"
                  className="workshop-upload"
                >
                  {imagePreview ? (
                    <img
                      src={
                        imagePreview
                      }
                      alt="Preview kegiatan"
                    />
                  ) : (
                    <>
                      <span className="workshop-upload-icon">
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

              {/* ACTION MODAL */}
              <div className="workshop-modal-actions">
                <button
                  type="button"
                  className="workshop-cancel"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="workshop-save"
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
    </div>
  )
}

export default Workshop