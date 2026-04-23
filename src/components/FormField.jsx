export default function FormField({ label, required, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--c-fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}{required && <span style={{ color: 'var(--c-danger)', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: 11, color: 'var(--c-fg-3)' }}>{hint}</span>}
    </div>
  )
}
