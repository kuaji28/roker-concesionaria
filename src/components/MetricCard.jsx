import Icon from './Icon'

export default function MetricCard({ label, icon, value, sub, tone, delta, onClick }) {
  const loading = value === '—'
  return (
    <div className="mc" onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
      {tone && <div className={`ribbon ${tone}`} />}
      <p className="lbl">
        {icon && <Icon name={icon} size={14} />}
        {label}
      </p>
      {loading
        ? <span className="skeleton sk-val" />
        : <p className={`val ${tone || ''}`}>{value}</p>
      }
      {loading
        ? <span className="skeleton sk-sub" />
        : (sub || delta) && (
          <p className="sub">
            {delta && (
              <span className={delta.startsWith('▲') ? 'up' : delta.startsWith('▼') ? 'dn' : ''}>
                {delta}{' '}
              </span>
            )}
            {sub}
          </p>
        )
      }
    </div>
  )
}
