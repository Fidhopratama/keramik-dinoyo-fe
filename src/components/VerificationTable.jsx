function VerificationTable({ data }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>PRODUK</th>
            <th>TOKO</th>
            <th>HASIL AI</th>
            <th>CONFIDENCE</th>
            <th>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => {
            const approved = item.result === 'Disetujui'

            return (
              <tr key={item.id}>
                <td>
                  <div className="product-name">
                    <div className="product-image">✦</div>
                    <strong>{item.name}</strong>
                  </div>
                </td>

                <td>{item.shop}</td>

                <td>
                  {approved
                    ? 'Data sesuai'
                    : 'Menunggu pemeriksaan'}
                </td>

                <td>{item.confidence}</td>

                <td>
                  <span
                    className={`status ${
                      approved ? 'approved' : 'waiting'
                    }`}
                  >
                    {item.result}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default VerificationTable