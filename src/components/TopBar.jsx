import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon'
import ThemeToggle from './ThemeToggle'
import { useUser } from '../hooks/useUser'

const ROL_META = {
  dueno:     { label: 'Dueño',     color: '#f59e0b' },
  vendedor:  { label: 'Vendedor',  color: '#ff2d55' },
  externo:   { label: 'Externo',   color: 'var(--c-fg-3)' },
  developer: { label: 'Developer', color: '#8b5cf6' },
}

export default function TopBar({ placeholder = 'Buscar vehículos, clientes, patente…', onLogout }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const user = useUser()
  const rol = user?.rol || 'externo'
  const rolMeta = ROL_META[rol] || ROL_META.externo
  const inputRef = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (q.trim()) navigate(`/catalogo?search=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 28px',
      borderBottom: '1px solid var(--c-border)',
      background: 'var(--c-topbar-bg)',
      backdropFilter: 'blur(8px)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <form className="search-field" style={{ flex: 1, maxWidth: 440 }} onSubmit={handleSearch}>
        <Icon name="search" size={16} style={{ stroke: 'var(--c-fg-3)' }} />
        <input
          ref={inputRef}
          placeholder={placeholder}
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <kbd style={{
          fontSize: 10, color: 'var(--c-fg-3)',
          background: 'var(--c-card-2)',
          padding: '1px 5px', borderRadius: 3,
          border: '1px solid var(--c-border)',
          lineHeight: '18px', whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          /
        </kbd>
      </form>
      <div style={{ flex: 1 }} />
      <ThemeToggle />
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-fg)', lineHeight: 1.2 }}>
              {user.nombre || user.email}
            </div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: rolMeta.color,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              lineHeight: 1.2,
              marginTop: 1,
            }}>
              {rolMeta.label}
            </div>
          </div>
        </div>
      )}
      {onLogout && (
        <button
          onClick={onLogout}
          style={{ background: 'transparent', border: 'none', color: 'var(--c-fg-2)', cursor: 'pointer', fontSize: 12 }}
        >
          Salir
        </button>
      )}
      <div className="avatar" style={{ background: rolMeta.color, color: '#fff', fontWeight: 700 }}>
        {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'GH'}
      </div>
    </div>
  )
}
