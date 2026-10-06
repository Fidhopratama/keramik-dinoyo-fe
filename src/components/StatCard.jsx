import AppIcon from './AppIcon'

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
        <div className="stat-icon">
          <AppIcon name={icon} />
        </div>

        {growth && <span className="stat-growth">{growth}</span>}
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-title">{title}</div>

      {description && <p>{description}</p>}

      <style>{`
        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}

export default StatCard