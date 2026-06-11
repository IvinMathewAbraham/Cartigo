function MetricCard({
  label,
  value
}) {
  return (
    <div className="metric-card">
      <div className="m-label">
        {label}
      </div>
      <div className="m-value">
        {value}
      </div>
    </div>
  );
}

export default MetricCard;