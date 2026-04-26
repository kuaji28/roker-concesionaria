import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVehiculos } from '../lib/supabase'
import GHLogo from '../components/GHLogo'
import VendedorTabs from '../components/VendedorTabs'

const CHIP_FILTERS = [
  { label: 'Todos',      estado: null,          extra: {} },
  { label: 'Disponible', estado: 'disponible',  extra: {} },
  { label: '< USD 30k',  estado: null,          extra: { maxPrecio: 30000 } },
  { label: 'SUV',        estado: null,          extra: { tipo: 'suv' } },
  { label: 'Pickup',     estado: null,          extra: { tipo: 'pickup' } },
]

const BADGE_COLORS = {
  disponible:    { bg: 'rgba(34,197,94,.15)',  fg: '#22c55e', label: 'Disponible' },
  señado:        { bg: 'rgba(245,158,11,.15)', fg: '#f59e0b', label: 'Señado' },
  en_revision:   { bg: 'rgba(59,130,246,.15)', fg: '#3b82f6', label: 'En revisión' },
  en_preparacion:{ bg: 'rgba(139,92,246,.15)', fg: '#8b5cf6', label: 'En preparación' },
  vendido:       { bg: 'rgba(113,113,122,.15)',fg: '#71717a', label: 'Vendido' },
}

function StateBadge({ estado }) {
  const s = BADGE_COLORS[estado] || BADGE_COLORS.disponible
  return (
    <span style={{ padding: '2px 8px', borderRadius: 999, background: s.bg, color: s.fg, fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

function fmt(n) { return (n || 0).toLocaleString('es-AR') }

export default function VendedorCatalogo() {
  const navigate = useNavigate()
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [chip, setChip] = useState(0)
  const searchRef = useRef(null)

  useEffect(() => {
    const f = CHIP_FILTERS[chip]
    getVehiculos({ estado: f.estado, search: search || undefined })
      .catch(() => [])
      .then(data => {
        let filtered = data || []
        if (f.extra.maxPrecio) filtered = filtered.filter(v => (v.precio || 0) <= f.extra.maxPrecio)
        if (f.extra.tipo) filtered = filtered.filter(v => (v.tipo || '').toLowerCase() === f.extra.tipo)
        setVehiculos(filtered)
      })
      .finally(() => setLoading(false))
  }, [search, chip])

  function waLink(v) {
    const msg = encodeURIComponent(`Hola, te comparto el ${v.marca} ${v.modelo} ${v.anio} — USD ${fmt(v.precio)}. ¿Querés más info?`)
    return `https://wa.me/541152348902?text=${msg}`
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', color: 'var(--c-fg)', maxWidth: 480, margin: '0 auto' }}>
      {/* Top bar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <GHLogo size={28} />
        <h1 style={{ flex: 1, fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>Catálogo</h1>
        <button
          style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--c-card)', border: 0, color: 'var(--c-fg)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
          onClick={() => searchRef.current?.focus()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '10px 16px 6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-fg-2)" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          <input
            ref={searchRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Marca, modelo, patente…"
            style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', color: 'var(--c-fg)', fontSize: 14, fontFamily: 'inherit' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--c-fg-3)', display: 'grid', placeItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ padding: '4px 16px 10px', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0 }}>
        {CHIP_FILTERS.map((f, i) => (
          <button
            key={i}
            onClick={() => setChip(i)}
            style={{
              padding: '6px 14px', borderRadius: 999,
              background: chip === i ? 'var(--c-fg)' : 'var(--c-card)',
              color: chip === i ? 'var(--c-bg)' : 'var(--c-fg-2)',
              border: chip === i ? 'none' : '1px solid var(--c-border)',
              fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {loading ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--c-fg-3)', fontSize: 14 }}>Cargando…</div>
        ) : vehiculos.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--c-fg-3)', fontSize: 14 }}>Sin resultados</div>
        ) : vehiculos.map(v => (
          <div
            key={v.id}
            style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--c-border)', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate(`/vendedor/v/${v.id}`)}
          >
            {/* Thumb */}
            <div style={{ width: 88, height: 66, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--c-card-2)' }}>
              {v.foto_url
                ? <img src={v.foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c-fg-3)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                  </div>
              }
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                <div>
                  <p style={{ fontSize: 10, color: 'var(--c-fg-2)', margin: 0, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>{v.marca} · {v.anio}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-fg)', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 }}>{v.modelo}</p>
                </div>
                <StateBadge estado={v.estado} />
              </div>
              <p style={{ fontSize: 11, color: 'var(--c-fg-2)', margin: '2px 0 4px' }}>{fmt(v.km)} km · {v.combustible || '—'}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>USD {fmt(v.precio)}</p>
                <a
                  href={waLink(v)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ width: 34, height: 34, borderRadius: 999, background: '#25D366', color: '#fff', border: 0, cursor: 'pointer', display: 'grid', placeItems: 'center', textDecoration: 'none', flexShrink: 0 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm5.5 14.1c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1-1.4-1-2.7s.7-1.9.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.7 2 .8 2.1.1.1.1.3 0 .5-.1.2-.1.3-.3.5-.1.1-.3.3-.4.5-.1.1-.3.3-.1.5.1.3.6 1.1 1.4 1.7 1 .8 1.8 1.1 2.1 1.2.3.1.4.1.5 0 .2-.2.6-.7.8-.9.2-.2.3-.2.6-.1.2.1 1.4.7 1.7.8.2.1.4.2.5.2.1.2.1.6-.1 1.2z"/></svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <VendedorTabs active="cat" />
    </div>
  )
}
