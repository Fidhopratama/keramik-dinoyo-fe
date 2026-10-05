import { useEffect, useState } from 'react'

import {
  createShop,
  deleteShop,
  getShops,
  updateShop,
} from '../services/api'

import keramikBrawijaya from '../assets/images/keramik-brawijaya.jpg'
import keramikDinoyoMakmur from '../assets/images/keramik-dinoyo-makmur.jpg'
import dinoyoCeramicHouse from '../assets/images/dinoyo-ceramic-house.jpg'

const shopImages = {
  'Keramik Brawijaya': keramikBrawijaya,
  'Keramik Dinoyo Makmur': keramikDinoyoMakmur,
  'Dinoyo Ceramic House': dinoyoCeramicHouse,
}

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

export default function Toko() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingShop, setEditingShop] = useState(null)
  const [form, setForm] = useState({ ...initialForm })
  const [deletingId, setDeletingId] = useState(null)

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

  const openAddForm = () => {
    setEditingShop(null)
    setForm({ ...initialForm })
    setFormError('')
    setShowForm(true)
  }

  const openEditForm = (shop) => {
    setEditingShop(shop)
    setForm({
      name: shop.name || '',
      description: shop.description || '',
      instagram: shop.instagram || '',
      tiktok: shop.tiktok || '',
      whatsapp: shop.whatsapp || '',
      address: shop.address || '',
      is_active:
        shop.is_active === undefined
          ? true
          : Boolean(shop.is_active),
      imageFile: null,
      imagePreview:
        shop.image_url ||
        shop.image ||
        shopImages[shop.name] ||
        '',
    })
    setFormError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingShop(null)
    setForm({ ...initialForm })
    setFormError('')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFormError(
        'Format gambar harus JPG, PNG, atau WEBP.'
      )
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormError('Ukuran gambar maksimal 2 MB.')
      return
    }

    setFormError('')

    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      setFormError('Nama toko wajib diisi.')
      return
    }

    try {
      setSaving(true)
      setFormError('')

      const formData = new FormData()

      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('instagram', form.instagram)
      formData.append('tiktok', form.tiktok)
      formData.append('whatsapp', form.whatsapp)
      formData.append('address', form.address)
      formData.append(
        'is_active',
        form.is_active ? '1' : '0'
      )

      if (form.imageFile) {
        formData.append('image', form.imageFile)
      }

      if (editingShop) {
        formData.append('_method', 'PUT')
        await updateShop(editingShop.id, formData)
      } else {
        await createShop(formData)
      }

      await fetchShops()
      closeForm()
    } catch (err) {
      console.error(err)

      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.name?.[0] ||
        'Gagal menyimpan data toko.'

      setFormError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (shop) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus toko "${shop.name}"?`
    )

    if (!confirmed) return

    try {
      setDeletingId(shop.id)
      setError('')

      await deleteShop(shop.id)
      await fetchShops()
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
          'Gagal menghapus toko.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="shop-page">
      <style>{`
        .shop-page {
          width: 100%;
        }

        .shop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .shop-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #3d2b1f;
        }

        .shop-header p {
          margin: 6px 0 0;
          color: #8a7769;
          font-size: 14px;
        }

        .add-shop-button {
          border: none;
          background: #c87842;
          color: #fff;
          padding: 11px 18px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .add-shop-button:hover {
          background: #ad6536;
          transform: translateY(-1px);
        }

        .error-box {
          margin-bottom: 20px;
          padding: 12px 15px;
          border-radius: 9px;
          background: #fff1f1;
          border: 1px solid #efc2c2;
          color: #c0392b;
          font-size: 14px;
        }

        .shop-grid {
          margin-top: 35px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .shop-card {
          background: #fff;
          border: 1px solid #eee2d8;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(74, 52, 39, 0.06);
          transition: 0.2s ease;
        }

        .shop-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(74, 52, 39, 0.1);
        }

        .shop-image {
          width: 100%;
          height: 190px;
          background: #f5eee8;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shop-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .no-image {
          color: #a79587;
          font-size: 14px;
        }

        .shop-content {
          padding: 20px;
        }

        .shop-name {
          margin: 0;
          color: #3d2b1f;
          font-size: 18px;
          font-weight: 700;
        }

        .shop-description {
          margin: 9px 0 0;
          color: #806f62;
          font-size: 14px;
          line-height: 1.6;
          min-height: 45px;
        }

        .shop-address {
          margin-top: 13px;
          color: #766458;
          font-size: 13px;
          line-height: 1.5;
        }

        .shop-status {
          display: inline-flex;
          margin-top: 13px;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-active {
          background: #eaf7ed;
          color: #2e7d32;
        }

        .status-inactive {
          background: #fbecec;
          color: #c0392b;
        }

        .shop-actions {
          display: flex;
          gap: 10px;
          margin-top: 22px;
          width: 100%;
        }

        .shop-edit-button,
        .shop-delete-button {
          flex: 1;
          height: 40px;
          border-radius: 9px;
          padding: 0 16px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: all 0.2s ease;
        }

        .shop-edit-button {
          background: #fff7ed;
          color: #c87842;
          border: 1px solid #e8c7aa;
        }

        .shop-edit-button:hover {
          background: #c87842;
          color: #ffffff;
          border-color: #c87842;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(200, 120, 66, 0.18);
        }

        .shop-delete-button {
          background: #fff5f5;
          color: #d9534f;
          border: 1px solid #edc4c4;
        }

        .shop-delete-button:hover {
          background: #d9534f;
          color: #ffffff;
          border-color: #d9534f;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(217, 83, 79, 0.18);
        }

        .shop-edit-button:active,
        .shop-delete-button:active {
          transform: translateY(0) scale(0.98);
        }

        .shop-edit-button:disabled,
        .shop-delete-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .button-icon {
          font-size: 15px;
          line-height: 1;
        }

        .loading-state,
        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: #8a7769;
          background: #fff;
          border: 1px solid #eee2d8;
          border-radius: 14px;
        }

        .empty-state {
          margin-top: 35px;
        }

        .empty-state h3 {
          margin: 0 0 8px;
          color: #3d2b1f;
        }

        .empty-state p {
          margin: 0 0 20px;
          font-size: 14px;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(35, 25, 19, 0.48);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
        }

        .modal {
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          overflow-y: auto;
          background: #fff;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }

        .modal-header h2 {
          margin: 0;
          color: #3d2b1f;
          font-size: 21px;
        }

        .close-button {
          border: none;
          background: #f5eee8;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          color: #6e5c50;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 7px;
          color: #4d3b2f;
          font-size: 13px;
          font-weight: 600;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #ded2c9;
          border-radius: 8px;
          padding: 10px 12px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #c87842;
          box-shadow: 0 0 0 3px rgba(200, 120, 66, 0.1);
        }

        .form-group textarea {
          min-height: 90px;
          resize: vertical;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .image-preview {
          margin-top: 10px;
          width: 100%;
          height: 180px;
          border-radius: 10px;
          overflow: hidden;
          background: #f5eee8;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .checkbox-group input {
          width: auto;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
        }

        .cancel-button,
        .save-button {
          height: 40px;
          padding: 0 18px;
          border-radius: 8px;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-button {
          background: #f5eee8;
          color: #6e5c50;
          border: 1px solid #e4d7cc;
        }

        .save-button {
          background: #c87842;
          color: #fff;
          border: none;
        }

        .save-button:hover {
          background: #ad6536;
        }

        .save-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .form-error {
          margin-bottom: 15px;
          padding: 10px 12px;
          background: #fff1f1;
          border: 1px solid #efc2c2;
          color: #c0392b;
          border-radius: 8px;
          font-size: 13px;
        }

        @media (max-width: 1000px) {
          .shop-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .shop-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .shop-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="shop-header">
        <div>
          <h1>Data Toko</h1>
          <p>Kelola data toko keramik di Kampung Keramik Dinoyo.</p>
        </div>

        <button
          type="button"
          className="add-shop-button"
          onClick={openAddForm}
        >
          + Tambah Toko
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="loading-state">
          Memuat data toko...
        </div>
      ) : shops.length === 0 ? (
        <div className="empty-state">
          <h3>Belum Ada Data Toko</h3>
          <p>
            Silakan tambahkan toko untuk mulai mengelola data.
          </p>

          <button
            type="button"
            className="add-shop-button"
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
              shopImages[shop.name] ||
              ''

            return (
              <div className="shop-card" key={shop.id}>
                <div className="shop-image">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={shop.name}
                    />
                  ) : (
                    <span className="no-image">
                      Tidak ada foto
                    </span>
                  )}
                </div>

                <div className="shop-content">
                  <h3 className="shop-name">
                    {shop.name}
                  </h3>

                  <p className="shop-description">
                    {shop.description ||
                      'Tidak ada deskripsi toko.'}
                  </p>

                  {shop.address && (
                    <div className="shop-address">
                      📍 {shop.address}
                    </div>
                  )}

                  <span
                    className={`shop-status ${
                      shop.is_active
                        ? 'status-active'
                        : 'status-inactive'
                    }`}
                  >
                    {shop.is_active
                      ? 'Aktif'
                      : 'Tidak Aktif'}
                  </span>

                  <div className="shop-actions">
                    <button
                      type="button"
                      className="shop-edit-button"
                      onClick={() =>
                        openEditForm(shop)
                      }
                    >
                      <span className="button-icon">
                        ✎
                      </span>
                      Edit
                    </button>

                    <button
                      type="button"
                      className="shop-delete-button"
                      disabled={
                        deletingId === shop.id
                      }
                      onClick={() =>
                        handleDelete(shop)
                      }
                    >
                      <span className="button-icon">
                        🗑
                      </span>
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

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {editingShop
                  ? 'Edit Toko'
                  : 'Tambah Toko'}
              </h2>

              <button
                type="button"
                className="close-button"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="form-error">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Toko *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama toko"
                />
              </div>

              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Masukkan deskripsi toko"
                />
              </div>

              <div className="form-group">
                <label>Alamat</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Masukkan alamat toko"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Instagram</label>
                  <input
                    type="text"
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                    placeholder="@username"
                  />
                </div>

                <div className="form-group">
                  <label>TikTok</label>
                  <input
                    type="text"
                    name="tiktok"
                    value={form.tiktok}
                    onChange={handleChange}
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>WhatsApp</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div className="form-group">
                <label>Foto Toko</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />

                {form.imagePreview && (
                  <div className="image-preview">
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                    />
                  </div>
                )}
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />

                <label htmlFor="is_active">
                  Toko aktif
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeForm}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="save-button"
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