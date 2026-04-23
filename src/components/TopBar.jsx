import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon'

export default function TopBar({ placeholder = 'Buscar vehículos, clientes, patente…', onLogout }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (q.trim()) navigate(`/catalogo?search=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 28px',
      borderBottom: '1px solid var(--c-border)',
      background: 'rgba(18,23,34,0.5)',
      backdropFilter: 'blur(8px)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <form className="search-field" style={{ flex: 1, maxWidth: 440 }} onSubmit={handleSearch}>
        <Icon name="search" size={16} style={{ stroke: 'var(--c-fg-3)' }} />
        <input
          placeholder={placeholder}
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </form>
      <div style={{ flex: 1 }} />
      {onLogout && (
        <button
          onClick={onLogout}
          style={{ background: 'transparent', border: 'none', color: 'var(--c-fg-2)', cursor: 'pointer', fontSize: 12 }}
        >
          Salir
        </button>
      )}
      <div className="avatar">GH</div>
    </div>
  )
}
