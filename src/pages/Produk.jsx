import { useEffect, useState } from 'react'
import {
  createProduct,
  deleteProduct,
  getProducts,
  getShops,
  updateProduct,
} from '../services/api'

const initialForm = {
  shop_id: '',
  category_id: '',
  name: '',
  description: '',
  price: '',
  stock: '',
  status: 'active',
  imageFile: null,
  imagePreview: '',
}

function Produk() {
  const [products, setProducts] = useState([])
  const [shops, setShops] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] =
    useState(null)

  const [form, setForm] =
    useState(initialForm)

  const [deletingId, setDeletingId] =
    useState(null)

  const [search, setSearch] =
    useState('')

  /*
  |--------------------------------------------------------------------------
  | Ambil data
  |--------------------------------------------------------------------------
  */

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        productsResponse,
        shopsResponse,
      ] = await Promise.all([
        getProducts({
          search: search || undefined,
        }),
        getShops(),
      ])

      setProducts(
        productsResponse.data?.data?.data ||
          [],
      )

      setShops(
        shopsResponse.data?.data || [],
      )
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
          'Gagal mengambil data produk.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const handleSearch = async () => {
    await fetchData()
  }

  /*
  |--------------------------------------------------------------------------
  | Tambah
  |--------------------------------------------------------------------------
  */

  const openAddForm = () => {
    setEditingProduct(null)
    setForm(initialForm)
    setFormError('')
    setShowForm(true)
  }

  /*
  |--------------------------------------------------------------------------
  | Edit
  |--------------------------------------------------------------------------
  */

  const openEditForm = (product) => {
    setEditingProduct(product)

    setForm({
      shop_id:
        product.shop_id ||
        product.shop?.id ||
        '',

      category_id:
        product.category_id ||
        product.category?.id ||
        '',

      name: product.name || '',

      description:
        product.description || '',

      price:
        product.price || '',

      stock:
        product.stock ?? '',

      status:
        product.status || 'active',

      imageFile: null,

      imagePreview:
        product.image_url ||
        product.image ||
        '',
    })

    setFormError('')
    setShowForm(true)
  }

  /*
  |--------------------------------------------------------------------------
  | Close
  |--------------------------------------------------------------------------
  */

  const closeForm = () => {
    if (saving) return

    setShowForm(false)
    setEditingProduct(null)
    setForm(initialForm)
    setFormError('')
  }

  /*
  |--------------------------------------------------------------------------
  | Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  /*
  |--------------------------------------------------------------------------
  | Image
  |--------------------------------------------------------------------------
  */

  const handleImageChange = (
    event,
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) return

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      setFormError(
        'Ukuran foto maksimal 2 MB.',
      )

      event.target.value = ''

      return
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (
      !allowedTypes.includes(
        file.type,
      )
    ) {
      setFormError(
        'Format foto harus JPG, JPEG, PNG, atau WEBP.',
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

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault()

    setFormError('')

    if (!form.name.trim()) {
      setFormError(
        'Nama produk wajib diisi.',
      )

      return
    }

    if (!form.shop_id) {
      setFormError(
        'Toko wajib dipilih.',
      )

      return
    }

    if (
      form.price === '' ||
      Number(form.price) < 0
    ) {
      setFormError(
        'Harga produk tidak valid.',
      )

      return
    }

    if (
      form.stock === '' ||
      Number(form.stock) < 0
    ) {
      setFormError(
        'Stok produk tidak valid.',
      )

      return
    }

    try {
      setSaving(true)

      const formData =
        new FormData()

      formData.append(
        'shop_id',
        form.shop_id,
      )

      if (form.category_id) {
        formData.append(
          'category_id',
          form.category_id,
        )
      }

      formData.append(
        'name',
        form.name,
      )

      formData.append(
        'description',
        form.description,
      )

      formData.append(
        'price',
        form.price,
      )

      formData.append(
        'stock',
        form.stock,
      )

      formData.append(
        'status',
        form.status,
      )

      if (form.imageFile) {
        formData.append(
          'image',
          form.imageFile,
        )
      }

      if (editingProduct) {
        formData.append(
          '_method',
          'PUT',
        )

        await updateProduct(
          editingProduct.id,
          formData,
        )
      } else {
        await createProduct(
          formData,
        )
      }

      closeForm()

      await fetchData()
    } catch (err) {
      console.error(err)

      const validationErrors =
        err.response?.data?.errors

      if (validationErrors) {
        const firstError =
          Object.values(
            validationErrors,
          ).flat()[0]

        setFormError(
          firstError ||
            'Data produk tidak valid.',
        )
      } else {
        setFormError(
          err.response?.data?.message ||
            'Gagal menyimpan produk.',
        )
      }
    } finally {
      setSaving(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (
    product,
  ) => {
    const confirmed =
      window.confirm(
        `Yakin ingin menghapus produk "${product.name}"?`,
      )

    if (!confirmed) return

    try {
      setDeletingId(product.id)

      await deleteProduct(
        product.id,
      )

      await fetchData()
    } catch (err) {
      console.error(err)

      window.alert(
        err.response?.data?.message ||
          'Gagal menghapus produk.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>Produk</h1>

            <p>
              Kelola produk keramik
              dari seluruh toko.
            </p>
          </div>
        </div>

        <div className="loading-box">
          Memuat data produk...
        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="page-container">
      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Produk</h1>

          <p>
            Kelola produk keramik
            dari seluruh toko.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddForm}
        >
          + Tambah Produk
        </button>
      </div>

      {/* SEARCH */}

      <div className="product-toolbar">
        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value,
            )
          }
          onKeyDown={(event) => {
            if (
              event.key === 'Enter'
            ) {
              handleSearch()
            }
          }}
          placeholder="Cari nama produk..."
        />

        <button
          className="secondary-button"
          onClick={handleSearch}
        >
          Cari
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {/* PRODUCTS */}

      {products.length === 0 ? (
        <div className="empty-box">
          <h3>
            Belum ada produk
          </h3>

          <p>
            Tambahkan produk pertama.
          </p>

          <button
            className="primary-button"
            onClick={openAddForm}
          >
            + Tambah Produk
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(
            (product) => {
              const imageUrl =
                product.image_url ||
                product.image

              return (
                <div
                  className="product-card"
                  key={product.id}
                >
                  {/* IMAGE */}

                  <div className="product-image">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        Tidak ada foto
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}

                  <div className="product-content">
                    <div className="product-title-row">
                      <h3>
                        {product.name}
                      </h3>

                      <span
                        className={
                          product.status ===
                          'active'
                            ? 'status-badge active'
                            : 'status-badge inactive'
                        }
                      >
                        {product.status ===
                        'active'
                          ? 'Aktif'
                          : 'Nonaktif'}
                      </span>
                    </div>

                    <p className="product-shop">
                      {product.shop?.name ||
                        'Toko tidak diketahui'}
                    </p>

                    <p className="product-description">
                      {product.description ||
                        'Belum ada deskripsi.'}
                    </p>

                    <div className="product-meta">
                      <div>
                        <span>
                          Harga
                        </span>

                        <strong>
                          Rp{' '}
                          {Number(
                            product.price ||
                              0,
                          ).toLocaleString(
                            'id-ID',
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Stok
                        </span>

                        <strong>
                          {product.stock ??
                            0}
                        </strong>
                      </div>
                    </div>

                    <div className="product-actions">
                      <button
                        className="secondary-button"
                        onClick={() =>
                          openEditForm(
                            product,
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        disabled={
                          deletingId ===
                          product.id
                        }
                        onClick={() =>
                          handleDelete(
                            product,
                          )
                        }
                      >
                        {deletingId ===
                        product.id
                          ? 'Menghapus...'
                          : 'Hapus'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            },
          )}
        </div>
      )}

      {/* MODAL */}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>
                  {editingProduct
                    ? 'Edit Produk'
                    : 'Tambah Produk'}
                </h2>

                <p>
                  Isi informasi produk
                  di bawah.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeForm}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form
              className="shop-form"
              onSubmit={
                handleSubmit
              }
            >
              {/* TOKO */}

              <div className="form-group">
                <label htmlFor="shop_id">
                  Toko
                </label>

                <select
                  id="shop_id"
                  name="shop_id"
                  value={form.shop_id}
                  onChange={
                    handleChange
                  }
                  required
                >
                  <option value="">
                    Pilih toko
                  </option>

                  {shops.map(
                    (shop) => (
                      <option
                        key={shop.id}
                        value={shop.id}
                      >
                        {shop.name}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* CATEGORY */}

              <div className="form-group">
                <label htmlFor="category_id">
                  Category ID
                </label>

                <input
                  id="category_id"
                  name="category_id"
                  type="number"
                  min="1"
                  value={
                    form.category_id
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Kosongkan jika tidak ada"
                />

                <small className="file-help">
                  Isi ID kategori jika
                  produk memiliki kategori.
                </small>
              </div>

              {/* NAME */}

              <div className="form-group">
                <label htmlFor="name">
                  Nama Produk
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={
                    handleChange
                  }
                  placeholder="Contoh: Mug Keramik Dinoyo"
                  required
                />
              </div>

              {/* IMAGE */}

              <div className="form-group">
                <label htmlFor="image">
                  Foto Produk
                </label>

                <input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleImageChange
                  }
                />

                <small className="file-help">
                  JPG, JPEG, PNG, atau
                  WEBP. Maksimal 2 MB.
                </small>

                {form.imagePreview && (
                  <div className="image-preview">
                    <img
                      src={
                        form.imagePreview
                      }
                      alt="Preview produk"
                    />
                  </div>
                )}
              </div>

              {/* DESCRIPTION */}

              <div className="form-group">
                <label htmlFor="description">
                  Deskripsi
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Deskripsi produk..."
                  rows="4"
                />
              </div>

              {/* PRICE */}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">
                    Harga
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={
                      handleChange
                    }
                    placeholder="50000"
                    required
                  />
                </div>

                {/* STOCK */}

                <div className="form-group">
                  <label htmlFor="stock">
                    Stok
                  </label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={
                      handleChange
                    }
                    placeholder="10"
                    required
                  />
                </div>
              </div>

              {/* STATUS */}

              <div className="form-group">
                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={
                    handleChange
                  }
                >
                  <option value="active">
                    Aktif
                  </option>

                  <option value="inactive">
                    Nonaktif
                  </option>
                </select>
              </div>

              {/* ERROR */}

              {formError && (
                <div className="form-error">
                  {formError}
                </div>
              )}

              {/* ACTION */}

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
                    : editingProduct
                      ? 'Simpan Perubahan'
                      : 'Tambah Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Produk