function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function ProductTable({ products }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>PRODUK</th>
            <th>TOKO</th>
            <th>KATEGORI</th>
            <th>HARGA</th>
            <th>STOK</th>
            <th>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="product-name">
                  <div className="product-image">🏺</div>

                  <strong>{product.name}</strong>
                </div>
              </td>

              <td>{product.shop?.name || product.shop}</td>

              <td>
                {product.category?.name || product.category}
              </td>

              <td className="price">
                {formatRupiah(product.price)}
              </td>

              <td>{product.stock}</td>

              <td>
                <span className="status active">
                  {product.status === 'active'
                    ? 'Aktif'
                    : product.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable