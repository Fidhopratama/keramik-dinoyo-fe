import { useEffect, useState } from 'react'

import {
  createShop,
  deleteShop,
  getShops,
  updateShop,
} from '../services/api'

const initialForm = {
  name: '',
  description: '',
  instagram: '',
  tiktok: '',
  whatsapp: '',
  address: '',
  is_active: true,
  imageFile: null,
  imagePreview: '',
}

function Toko() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingShop, setEditingShop] = useState(null)
  const [form, setForm] = useState({
    ...initialForm,
  })
  const [deletingId, setDeletingId] = useState(null)

  // =========================================================
  // AMBIL DATA TOKO
  // =========================================================

  const fetchShops = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getShops()

      setShops(response.data?.data || [])
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
          'Gagal mengambil data toko.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShops()
  }, [])

  // =========================================================
  // BUKA FORM TAMBAH
  // =========================================================

  const openAddForm = () => {
    setEditingShop(null)

    setForm({
      ...initialForm,
    })

    setFormError('')
    setShowForm(true)
  }

  // =========================================================
  // BUKA FORM EDIT
  // =========================================================

  const openEditForm = (shop) => {
    setEditingShop(shop)

    setForm({
      name: shop.name || '',
      description: shop.description || '',
      instagram: shop.instagram || '',
      tiktok: shop.tiktok || '',
      whatsapp: shop.whatsapp || '',
      address: shop.address || '',
      is_active: Boolean(shop.is_active),
      imageFile: null,
      imagePreview:
        shop.image_url ||
        shop.image ||
        '',
    })

    setFormError('')
    setShowForm(true)
  }

  // =========================================================
  // TUTUP FORM
  // =========================================================

  const closeForm = () => {
    if (saving) {
      return
    }

    setShowForm(false)
    setEditingShop(null)

    setForm({
      ...initialForm,
    })

    setFormError('')
  }

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target

    setForm((current) => ({
      ...current,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))
  }

  // =========================================================
  // HANDLE FOTO
  // =========================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    // Maksimal 2 MB
    if (file.size > 2 * 1024 * 1024) {
      setFormError(
        'Ukuran foto maksimal 2 MB.'
      )

      event.target.value = ''

      return
    }

    // Format yang diperbolehkan
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!allowedTypes.includes(file.type)) {
      setFormError(
        'Format foto harus JPG, JPEG, PNG, atau WEBP.'
      )

      event.target.value = ''

      return
    }

    const previewUrl =
      URL.createObjectURL(file)

    setForm((current) => ({
      ...current,
      imageFile: file,
      imagePreview: previewUrl,
    }))

    setFormError('')
  }

  // =========================================================
  // SUBMIT FORM
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    setFormError('')

    if (!form.name.trim()) {
      setFormError(
        'Nama toko wajib diisi.'
      )

      return
    }

    try {
      setSaving(true)

      const formData = new FormData()

      formData.append(
        'name',
        form.name.trim()
      )

      formData.append(
        'description',
        form.description || ''
      )

      formData.append(
        'instagram',
        form.instagram || ''
      )

      formData.append(
        'tiktok',
        form.tiktok || ''
      )

      formData.append(
        'whatsapp',
        form.whatsapp || ''
      )

      formData.append(
        'address',
        form.address || ''
      )

      formData.append(
        'is_active',
        form.is_active ? '1' : '0'
      )

      // Upload gambar jika memilih gambar baru
      if (form.imageFile) {
        formData.append(
          'image',
          form.imageFile
        )
      }

      // EDIT
      if (editingShop) {
        formData.append(
          '_method',
          'PUT'
        )

        await updateShop(
          editingShop.id,
          formData
        )
      }

      // TAMBAH
      else {
        await createShop(formData)
      }

      setShowForm(false)
      setEditingShop(null)

      setForm({
        ...initialForm,
      })

      await fetchShops()
    } catch (err) {
      console.error(err)

      const validationErrors =
        err.response?.data?.errors

      if (validationErrors) {
        const firstError =
          Object.values(validationErrors)
            .flat()[0]

        setFormError(
          firstError ||
            'Data toko tidak valid.'
        )
      } else {
        setFormError(
          err.response?.data?.message ||
            'Gagal menyimpan data toko.'
        )
      }
    } finally {
      setSaving(false)
    }
  }

  // =========================================================
  // HAPUS TOKO
  // =========================================================

  const handleDelete = async (shop) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus toko "${shop.name}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(shop.id)

      await deleteShop(shop.id)

      await fetchShops()
    } catch (err) {
      console.error(err)

      window.alert(
        err.response?.data?.message ||
          'Gagal menghapus data toko.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>Toko</h1>

            <p>
              Kelola data toko Keramik Dinoyo.
            </p>
          </div>
        </div>

        <div className="loading-box">
          Memuat data toko...
        </div>
      </div>
    )
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="page-container">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Toko</h1>

          <p>
            Kelola data toko Keramik Dinoyo.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={openAddForm}
        >
          + Tambah Toko
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {/* DATA TOKO */}

      {shops.length === 0 ? (
        <div className="empty-box">
          <h3>Belum ada toko</h3>

          <p>
            Tambahkan toko pertama untuk
            mulai mengelola data.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={openAddForm}
          >
            + Tambah Toko
          </button>
        </div>
      ) : (
        <div className="shop-grid">
          {shops.map((shop) => {
            const imageUrl =
              shop.image_url ||
              shop.image ||
              ''

            return (
              <div
                className="shop-card"
                key={shop.id}
              >

                {/* FOTO */}

                <div className="shop-image">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={shop.name}
                    />
                  ) : (
                    <div className="shop-image-placeholder">
                      Tidak ada foto
                    </div>
                  )}
                </div>

                {/* CONTENT */}

                <div className="shop-content">

                  <div className="shop-title-row">
                    <h3>
                      {shop.name}
                    </h3>

                    <span
                      className={
                        shop.is_active
                          ? 'status-badge active'
                          : 'status-badge inactive'
                      }
                    >
                      {shop.is_active
                        ? 'Aktif'
                        : 'Nonaktif'}
                    </span>
                  </div>

                  <p className="shop-description">
                    {shop.description ||
                      'Belum ada deskripsi.'}
                  </p>

                  <div className="shop-info">

                    <div>
                      <strong>
                        Alamat
                      </strong>

                      <span>
                        {shop.address || '-'}
                      </span>
                    </div>

                    <div>
                      <strong>
                        Produk
                      </strong>

                      <span>
                        {shop.products_count ??
                          0}{' '}
                        produk
                      </span>
                    </div>

                  </div>

                  {/* ACTION */}

                  <div className="shop-actions">

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() =>
                        openEditForm(shop)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      disabled={
                        deletingId === shop.id
                      }
                      onClick={() =>
                        handleDelete(shop)
                      }
                    >
                      {deletingId === shop.id
                        ? 'Menghapus...'
                        : 'Hapus'}
                    </button>

                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* =====================================================
          MODAL TAMBAH / EDIT
          ===================================================== */}

      {showForm && (
        <div className="modal-overlay">

          <div className="modal-card">

            {/* HEADER MODAL */}

            <div className="modal-header">

              <div>
                <h2>
                  {editingShop
                    ? 'Edit Toko'
                    : 'Tambah Toko'}
                </h2>

                <p>
                  Isi informasi toko di bawah.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeForm}
                disabled={saving}
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              className="shop-form"
              onSubmit={handleSubmit}
            >

              {/* NAMA */}

              <div className="form-group">

                <label htmlFor="name">
                  Nama Toko
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Keramik Dinoyo Jaya"
                  required
                />

              </div>

              {/* FOTO */}

              <div className="form-group">

                <label htmlFor="image">
                  Foto Toko
                </label>

                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />

                <small className="file-help">
                  JPG, JPEG, PNG, atau WEBP.
                  Maksimal 2 MB.
                </small>

                {/* PREVIEW */}

                {form.imagePreview && (
                  <div className="image-preview">
                    <img
                      src={form.imagePreview}
                      alt="Preview toko"
                    />
                  </div>
                )}

              </div>

              {/* DESKRIPSI */}

              <div className="form-group">

                <label htmlFor="description">
                  Deskripsi
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Deskripsi singkat toko..."
                  rows="4"
                />

              </div>

              {/* INSTAGRAM */}

              <div className="form-group">

                <label htmlFor="instagram">
                  Instagram
                </label>

                <input
                  id="instagram"
                  name="instagram"
                  type="text"
                  value={form.instagram}
                  onChange={handleChange}
                  placeholder="@namatoko"
                />

              </div>

              {/* TIKTOK */}

              <div className="form-group">

                <label htmlFor="tiktok">
                  TikTok
                </label>

                <input
                  id="tiktok"
                  name="tiktok"
                  type="text"
                  value={form.tiktok}
                  onChange={handleChange}
                  placeholder="@namatoko"
                />

              </div>

              {/* WHATSAPP */}

              <div className="form-group">

                <label htmlFor="whatsapp">
                  WhatsApp
                </label>

                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="text"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                />

              </div>

              {/* ALAMAT */}

              <div className="form-group">

                <label htmlFor="address">
                  Alamat
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Alamat lengkap toko..."
                  rows="3"
                />

              </div>

              {/* STATUS */}

              <label className="checkbox-label">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />

                <span>
                  Toko aktif
                </span>

              </label>

              {/* ERROR FORM */}

              {formError && (
                <div className="form-error">
                  {formError}
                </div>
              )}

              {/* BUTTON */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
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
                    : editingShop
                    ? 'Simpan Perubahan'
                    : 'Tambah Toko'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Toko