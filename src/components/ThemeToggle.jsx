import { useTheme } from '../context/ThemeContext'

const SUN = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
)
const AUTO = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/>
  </svg>
)
const MOON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const OPTS = [
  { v: 'light', icon: SUN, label: 'Modo claro' },
  { v: 'auto',  icon: AUTO, label: 'Automático' },
  { v: 'dark',  icon: MOON, label: 'Modo oscuro' },
]

export default function ThemeToggle({ style }) {
  const { mode, setMode, colors } = useTheme()
  const c = colors

  return (
    <div style={{
      display: 'inline-flex', padding: 3, gap: 0,
      background: c.card, borderRadius: 999,
      border: `1px solid ${c.border}`,
      ...style,
    }}>
      {OPTS.map(o => (
        <button
          key={o.v}
          onClick={() => setMode(o.v)}
          aria-label={o.label}
          style={{
            width: 28, height: 28, borderRadius: 999,
            background: mode === o.v ? c.fg : 'transparent',
            color: mode === o.v ? c.bg : c.fg2,
            border: 0, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
            transition: 'all .15s',
          }}
        >
          {o.icon}
        </button>
      ))}
    </div>
  )
}
