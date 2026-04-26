import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getVehiculo } from '../lib/supabase'
import { useTc } from '../hooks/useTc'
import VendedorTabs from '../components/VendedorTabs'

const BADGE_COLORS = {
  disponible:    { bg: 'rgba(34,197,94,.15)',  fg: '#22c55e', label: 'Disponible' },
  señado:        { bg: 'rgba(245,158,11,.15)', fg: '#f59e0b', label: 'Señado' },
  en_revision:   { bg: 'rgba(59,130,246,.15)', fg: '#3b82f6', label: 'En revisión' },
  en_preparacion:{ bg: 'rgba(139,92,246,.15)', fg: '#8b5cf6', label: 'En preparación' },
  vendido:       { bg: 'rgba(113,113,122,.15)',fg: '#71717a', label: 'Vendido' },
}

function fmt(n) { return (n || 0).toLocaleString('es-AR') }

const SHARE_BUTTONS = [
  { l: 'WhatsApp', bg: '#25D366', key: 'wa' },
  { l: 'Link',     bg: '#3b82f6', key: 'link' },
  { l: 'Instagram',bg: '#E4405F', key: 'ig' },
  { l: 'Email',    bg: '#f59e0b', key: 'email' },
]

function ShareIcon({ k }) {
  if (k === 'wa') return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm5.5 14.1c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1-1.4-1-2.7s.7-1.9.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.7 2 .8 2.1.1.1.1.3 0 .5-.1.2-.1.3-.3.5-.1.1-.3.3-.4.5-.1.1-.3.3-.1.5.1.3.6 1.1 1.4 1.7 1 .8 1.8 1.1 2.1 1.2.3.1.4.1.5 0 .2-.2.6-.7.8-.9.2-.2.3-.2.6-.1.2.1 1.4.7 1.7.8.2.1.4.2.5.2.1.2.1.6-.1 1.2z"/></svg>
  if (k === 'link') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L11.75 5.18M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07L12.25 18.82"/></svg>
  if (k === 'ig') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
}

export default function VendedorDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const tc = useTc()
  const [v, setV] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getVehiculo(id).catch(() => null).then(data => { setV(data); setLoading(false) })
  }, [id])

  function handleShare(key) {
    if (!v) return
    const url = `${window.location.origin}/p/vehiculo/${v.id}`
    const msg = `${v.marca} ${v.modelo} ${v.anio} — USD ${fmt(v.precio)}\n${url}`
    if (key === 'wa') {
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
    } else if (key === 'link') {
      navigator.clipboard?.writeText(url).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else if (key === 'ig') {
      navigator.clipboard?.writeText(url).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else if (key === 'email') {
      window.open(`mailto:?subject=${encodeURIComponent(`${v.marca} ${v.modelo} ${v.anio}`)}&body=${encodeURIComponent(msg)}`, '_blank')
    }
  }

  const badge = v ? (BADGE_COLORS[v.estado] || BADGE_COLORS.disponible) : null

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', color: 'var(--c-fg)', maxWidth: 480, margin: '0 auto' }}>
      {/* Top bar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--c-card)', border: 0, color: 'var(--c-fg)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h1 style={{ flex: 1, fontSize: 16, fontWeight: 700, margin: 0 }}>Detalle</h1>
        {v && (
          <button
            onClick={() => handleShare('link')}
            style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--c-card)', border: 0, color: 'var(--c-fg)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
            title="Copiar link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--c-fg-3)', fontSize: 14 }}>Cargando…</div>
      ) : !v ? (
        <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--c-fg-3)', fontSize: 14 }}>Vehículo no encontrado</div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 160 }}>
            {/* Image */}
            <div style={{ aspectRatio: '4/3', background: 'var(--c-card-2)', position: 'relative' }}>
              {v.foto_url
                ? <img src={v.foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--c-fg-3)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                  </div>
              }
              <span style={{ position: 'absolute', top: 12, left: 12, padding: '3px 10px', borderRadius: 999, background: badge.bg, color: badge.fg, fontSize: 11, fontWeight: 700 }}>
                {badge.label}
              </span>
              {v.fotos_count > 1 && (
                <span style={{ position: 'absolute', bottom: 12, right: 12, padding: '4px 10px', background: 'rgba(0,0,0,.6)', color: '#fff', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
                  1 / {v.fotos_count}
                </span>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: '16px 16px 0' }}>
              <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--c-accent)', margin: 0, fontWeight: 700 }}>
                {v.marca} · {v.anio}
              </p>
              <h2 style={{ fontSize: 26, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.03em' }}>{v.modelo}</h2>
              {v.version && <p style={{ fontSize: 13, color: 'var(--c-fg-2)', margin: '2px 0 0' }}>{v.version}</p>}
              <p style={{ fontSize: 32, fontWeight: 800, margin: '12px 0 0', letterSpacing: '-0.03em' }}>USD {fmt(v.precio)}</p>
              {tc > 0 && <p style={{ fontSize: 12, color: 'var(--c-fg-2)', margin: '2px 0 0' }}>≈ ARS {fmt(Math.round((v.precio || 0) * tc))}</p>}

              {/* Specs grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
                {[
                  ['Kilómetros', `${fmt(v.km)} km`],
                  ['Combustible', v.combustible || '—'],
                  ['Caja', v.caja || '—'],
                  ['Patente', v.patente || '—'],
                ].map(([k, val]) => (
                  <div key={k} style={{ padding: '10px 12px', background: 'var(--c-card)', borderRadius: 10, border: '1px solid var(--c-border)' }}>
                    <p style={{ fontSize: 10, color: 'var(--c-fg-2)', margin: 0, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>{k}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, margin: '2px 0 0' }}>{val}</p>
                  </div>
                ))}
              </div>

              {/* Share section */}
              <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--c-fg-2)', fontWeight: 700, margin: '20px 0 8px' }}>
                Compartir
                {copied && <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--c-success)', fontWeight: 600 }}>¡Link copiado!</span>}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {SHARE_BUTTONS.map(b => (
                  <button
                    key={b.key}
                    onClick={() => handleShare(b.key)}
                    style={{ padding: '12px 4px', background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 999, background: b.bg + '22', color: b.bg, display: 'grid', placeItems: 'center' }}>
                      <ShareIcon k={b.key} />
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--c-fg)', fontWeight: 600 }}>{b.l}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky CTA */}
          <div style={{ position: 'sticky', bottom: 0, padding: '12px 16px 0', background: 'var(--c-bg)', borderTop: '1px solid var(--c-border)' }}>
            <button
              onClick={() => navigate('/vendedor/lead/nuevo', { state: { vehiculo: v } })}
              style={{ width: '100%', padding: '14px', background: 'var(--c-accent)', color: '#fff', border: 0, borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6"/></svg>
              Crear lead
            </button>
          </div>
        </>
      )}

      <VendedorTabs active="cat" />
    </div>
  )
}
