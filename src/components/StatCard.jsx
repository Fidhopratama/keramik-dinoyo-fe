function StatCard({
  title,
  value,
  description,
  icon,
  growth = '+12%',
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>

        <span className="stat-growth">{growth}</span>
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-title">{title}</div>

      <p>{description}</p>
    </div>
  )
}

export default StatCard