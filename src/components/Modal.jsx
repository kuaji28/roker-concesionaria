import Icon from './Icon'

export default function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--c-card)', border: '1px solid var(--c-border)',
        borderRadius: 'var(--r-lg)', width: '100%',
        maxWidth: wide ? 860 : 560, maxHeight: '90vh',
        overflow: 'auto', padding: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} className="btn ghost" style={{ padding: '6px 8px' }}>
            <Icon name="x" size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
