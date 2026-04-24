import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useWANumber } from '../hooks/useWANumber'
import GHLogo from '../components/GHLogo'
import WhatsAppIcon from '../components/WhatsAppIcon'

/* ─── Tipo de cambio ────────────────────────────────────────── */
const FALLBACK_TC = 1415

async function fetchTc() {
  try {
    const res = await fetch('https://dolarapi.com/v1/dolares/blue')
    if (!res.ok) throw new Error()
    const json = await res.json()
    const val = Number(json?.venta)
    if (!val || isNaN(val)) throw new Error()
    return val
  } catch {
    try {
      const { data } = await supabase
        .from('config').select('valor').eq('clave', 'tipo_cambio').single()
      return Number(data?.valor) || FALLBACK_TC
    } catch {
      return FALLBACK_TC
    }
  }
}

/* ─── Datos ─────────────────────────────────────────────────── */
async function getVehiculosPublicos({ tipo, anioMin, precioMax }) {
  let q = supabase
    .from('vehiculos')
    .select('id,tipo,marca,modelo,anio,version,km_hs,precio_lista,precio_base,transmision,color,combustible')
    .eq('estado', 'disponible')
    .order('created_at', { ascending: false })

  if (tipo && tipo !== 'todos') q = q.eq('tipo', tipo)
  if (anioMin) q = q.gte('anio', Number(anioMin))
  if (precioMax) q = q.lte('precio_lista', Number(precioMax))

  const { data } = await q
  return data || []
}

async function getPortadas(vehiculoIds) {
  if (!vehiculoIds.length) return {}
  const { data } = await supabase
    .from('medias')
    .select('vehiculo_id, url, orden')
    .in('vehiculo_id', vehiculoIds)
    .order('orden', { ascending: true })

  if (!data) return {}
  const map = {}
  for (const m of data) {
    if (!map[m.vehiculo_id]) map[m.vehiculo_id] = m.url
  }
  return map
}

/* ─── Config ────────────────────────────────────────────────── */
const TIPOS       = ['todos', 'auto', 'moto', 'cuatriciclo', 'moto_de_agua']
const TIPOS_LABEL = { todos: 'Todos', auto: 'Autos', moto: 'Motos', cuatriciclo: 'Cuatriciclos', moto_de_agua: 'Motos de agua' }

/* ─── Íconos inline ─────────────────────────────────────────── */
const IcoKm = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
    <path d="M12 12l3-2"/><path d="M12 8v4"/>
  </svg>
)
const IcoTrans = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <circle cx="6" cy="12" r="2"/><path d="M10 12h4"/><circle cx="18" cy="12" r="2"/>
  </svg>
)
const IcoCombustible = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/>
    <path d="M17 8h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/><path d="M3 12h14"/>
  </svg>
)
const IcoWa = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
)

/* ─── Styles inline (no depende del design system interno) ──── */
const S = {
  page: {
    minHeight: '100vh',
    background: '#0B0F14',
    color: '#fff',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    WebkitFontSmoothing: 'antialiased',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    background: 'rgba(11,15,20,0.85)',
    backdropFilter: 'saturate(180%) blur(20px)',
    WebkitBackdropFilter: 'saturate(180%) blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6C5CFF, #8b7fff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '0.05em',
    boxShadow: '0 6px 20px rgba(108,92,255,0.35)',
    flexShrink: 0,
  },
  logoName: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 1.1,
  },
  logoSub: {
    fontSize: 11,
    color: '#8A94A6',
    marginTop: 2,
    lineHeight: 1.1,
  },
  btnContactar: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    height: 38,
    padding: '0 16px',
    borderRadius: 999,
    background: '#6C5CFF',
    border: 'none',
    color: '#fff',
    fontWeight: 500,
    fontSize: 13,
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(108,92,255,0.25)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  /* Tabs */
  tabsWrap: {
    padding: '12px 16px 8px',
    overflowX: 'auto',
    display: 'flex',
    gap: 8,
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  tabActive: {
    whiteSpace: 'nowrap',
    padding: '0 16px',
    height: 34,
    borderRadius: 999,
    border: 'none',
    background: '#6C5CFF',
    color: '#fff',
    fontWeight: 500,
    fontSize: 13,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(108,92,255,0.25)',
    flexShrink: 0,
  },
  tabInactive: {
    whiteSpace: 'nowrap',
    padding: '0 16px',
    height: 34,
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#B9C2D0',
    fontWeight: 500,
    fontSize: 13,
    cursor: 'pointer',
    flexShrink: 0,
  },
  /* Filtros sticky */
  filtersBar: {
    position: 'sticky',
    top: 64,
    zIndex: 30,
    background: 'rgba(11,15,20,0.85)',
    backdropFilter: 'saturate(180%) blur(20px)',
    WebkitBackdropFilter: 'saturate(180%) blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '10px 16px 8px',
  },
  filtersRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  filterBox: {
    flex: 1,
    position: 'relative',
  },
  filterLabel: {
    position: 'absolute',
    top: -8,
    left: 10,
    padding: '0 4px',
    fontSize: 10,
    color: '#8A94A6',
    background: '#0B0F14',
    borderRadius: 4,
    zIndex: 1,
    pointerEvents: 'none',
  },
  filterInput: {
    width: '100%',
    height: 42,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14,
    color: '#fff',
    fontSize: 13,
    padding: '0 12px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  filterSelect: {
    width: '100%',
    height: 42,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14,
    color: '#fff',
    fontSize: 13,
    padding: '0 12px',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
  },
  clearBtn: {
    width: 42,
    height: 42,
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14,
    color: '#8A94A6',
    cursor: 'pointer',
  },
  infoBar: {
    fontSize: 11,
    color: '#8A94A6',
    marginTop: 8,
    letterSpacing: '0.03em',
  },
  /* Grid */
  grid: {
    padding: '16px',
    maxWidth: 900,
    margin: '0 auto',
    display: 'grid',
    gap: 20,
  },
  /* Card */
  card: {
    background: '#141B22',
    borderRadius: 24,
    border: '1px solid rgba(255,255,255,0.07)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.15s',
  },
  cardImgWrap: {
    position: 'relative',
    overflow: 'hidden',
  },
  cardImg: {
    width: '100%',
    aspectRatio: '16/10',
    objectFit: 'cover',
    display: 'block',
  },
  cardImgFallback: {
    width: '100%',
    aspectRatio: '16/10',
    background: '#0B0F14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardGradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)',
    pointerEvents: 'none',
  },
  badgeYear: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: '3px 10px',
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 500,
    background: 'rgba(11,15,20,0.85)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  badgeDisponible: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    padding: '3px 10px',
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 500,
    background: '#6C5CFF',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(108,92,255,0.3)',
  },
  cardBody: {
    padding: '16px 16px 14px',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: '-0.01em',
    margin: 0,
  },
  cardVersion: {
    fontSize: 13,
    color: '#8A94A6',
    marginTop: 3,
    marginBottom: 0,
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    margin: '10px 0 14px',
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 10px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.06)',
    fontSize: 11,
    color: '#C7CFDB',
  },
  priceBlock: {
    marginBottom: 14,
  },
  priceUSD: {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1,
    margin: 0,
  },
  priceARS: {
    fontSize: 12,
    color: '#8A94A6',
    marginTop: 4,
  },
  btnConsultar: {
    width: '100%',
    height: 46,
    borderRadius: 14,
    border: '1.5px solid rgba(108,92,255,0.6)',
    background: 'transparent',
    color: '#fff',
    fontWeight: 500,
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background 0.15s, border-color 0.15s',
  },
  /* Empty */
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '60px 20px',
  },
  /* Footer */
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '24px 16px 32px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
    marginTop: 20,
  },
}

/* ─── Card ──────────────────────────────────────────────────── */
function CardPublica({ v, foto, tc, waNumber }) {
  const navigate  = useNavigate()
  const [hover, setHover] = useState(false)
  const precioUSD = v.precio_lista || v.precio_base
  const precioARS = precioUSD && tc ? Math.round(precioUSD * tc).toLocaleString('es-AR') : null

  function consultarWA(e) {
    e.stopPropagation()
    const msg = encodeURIComponent(
      `Hola! Vi el *${v.marca} ${v.modelo} ${v.anio}*${v.version ? ` (${v.version})` : ''} en el catálogo de GH Cars.\n` +
      `¿Sigue disponible? 🚗`
    )
    window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank')
  }

  const km = v.km_hs ? `${Number(v.km_hs).toLocaleString('es-AR')} km` : '0 km'

  return (
    <article
      style={{
        ...S.card,
        borderColor: hover ? 'rgba(108,92,255,0.35)' : 'rgba(255,255,255,0.07)',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => navigate(`/p/vehiculo/${v.id}`)}
    >
      {/* Imagen */}
      <div style={S.cardImgWrap}>
        {foto
          ? <img src={foto} alt={`${v.marca} ${v.modelo}`} style={S.cardImg} loading="lazy" />
          : (
            <div style={S.cardImgFallback}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeLinecap="round">
                <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h12l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
              </svg>
            </div>
          )
        }
        <div style={S.cardGradient} />
        <span style={S.badgeYear}>{v.anio}</span>
        <span style={S.badgeDisponible}>Disponible</span>
      </div>

      {/* Body */}
      <div style={S.cardBody}>
        <h2 style={S.cardTitle}>{v.marca} {v.modelo}</h2>
        {v.version && <p style={S.cardVersion}>{v.version}</p>}

        {/* Tags */}
        <div style={S.tagsRow}>
          <span style={S.tag}><IcoKm />{km}</span>
          {v.transmision && <span style={S.tag}><IcoTrans />{v.transmision}</span>}
          {v.combustible  && <span style={S.tag}><IcoCombustible />{v.combustible}</span>}
        </div>

        {/* Precio */}
        <div style={S.priceBlock}>
          <p style={S.priceUSD}>{precioUSD ? `USD ${precioUSD.toLocaleString('es-AR')}` : 'Consultar'}</p>
          {precioARS && <p style={S.priceARS}>≈ ARS {precioARS}</p>}
        </div>

        {/* CTA */}
        <button
          style={S.btnConsultar}
          onMouseEnter={e => { e.currentTarget.style.background = '#6C5CFF'; e.currentTarget.style.borderColor = '#6C5CFF' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(108,92,255,0.6)' }}
          onClick={consultarWA}
        >
          <IcoWa />
          Consultar
        </button>
      </div>
    </article>
  )
}

/* ─── Pantalla principal ────────────────────────────────────── */
export default function CatalogoPublico() {
  const waNumber = useWANumber()
  const [vehiculos, setVehiculos] = useState([])
  const [portadas,  setPortadas]  = useState({})
  const [tc,        setTc]        = useState(FALLBACK_TC)
  const [loading,   setLoading]   = useState(true)

  const [tipo,      setTipo]      = useState('todos')
  const [anioMin,   setAnioMin]   = useState('')
  const [precioMax, setPrecioMax] = useState('')

  // Determinar columnas según ancho de ventana
  const [cols, setCols] = useState(1)
  useEffect(() => {
    const update = () => setCols(window.innerWidth >= 700 ? (window.innerWidth >= 1000 ? 3 : 2) : 1)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => { fetchTc().then(setTc) }, [])

  useEffect(() => {
    setLoading(true)
    getVehiculosPublicos({ tipo, anioMin, precioMax }).then(async data => {
      setVehiculos(data)
      const fotos = await getPortadas(data.map(v => v.id))
      setPortadas(fotos)
      setLoading(false)
    })
  }, [tipo, anioMin, precioMax])

  function limpiarFiltros() { setAnioMin(''); setPrecioMax('') }

  const hasFiltros = anioMin || precioMax

  return (
    <div style={S.page}>

      {/* ── Header ── */}
      <header style={S.header}>
        <div style={S.logo}>
          <div style={S.logoAvatar}>GH</div>
          <div>
            <div style={S.logoName}>GH Cars</div>
            <div style={S.logoSub}>Stock disponible</div>
          </div>
        </div>
        <a
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Hola GH Cars, quiero información sobre el stock disponible.')}`}
          target="_blank"
          rel="noreferrer"
          style={S.btnContactar}
        >
          <IcoWa />
          Contactar
        </a>
      </header>

      {/* ── Tabs tipo ── */}
      <nav style={S.tabsWrap}>
        {TIPOS.map(t => (
          <button
            key={t}
            style={tipo === t ? S.tabActive : S.tabInactive}
            onClick={() => setTipo(t)}
          >
            {TIPOS_LABEL[t]}
          </button>
        ))}
      </nav>

      {/* ── Filtros sticky ── */}
      <div style={S.filtersBar}>
        <div style={S.filtersRow}>
          <div style={S.filterBox}>
            <span style={S.filterLabel}>Año desde</span>
            <select
              style={S.filterSelect}
              value={anioMin}
              onChange={e => setAnioMin(e.target.value)}
            >
              <option value="">Todos</option>
              {[2025,2024,2023,2022,2021,2020,2018,2015,2012,2010].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div style={S.filterBox}>
            <span style={S.filterLabel}>Precio máx USD</span>
            <input
              style={S.filterInput}
              inputMode="numeric"
              placeholder="—"
              value={precioMax}
              onChange={e => setPrecioMax(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          {hasFiltros && (
            <button style={S.clearBtn} onClick={limpiarFiltros} aria-label="Limpiar filtros">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
            </button>
          )}
        </div>
        <div style={S.infoBar}>
          {loading ? 'Cargando…' : `${vehiculos.length} vehículo${vehiculos.length !== 1 ? 's' : ''} · TC USD/ARS: ${tc.toLocaleString('es-AR')}`}
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={{ ...S.grid, gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {loading ? (
          <div style={{ ...S.empty, gridColumn: `1 / -1` }}>Cargando vehículos…</div>
        ) : vehiculos.length === 0 ? (
          <div style={{ ...S.empty, gridColumn: `1 / -1` }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1" strokeLinecap="round">
                <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h12l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
              </svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#B9C2D0', marginBottom: 6 }}>
              No hay vehículos disponibles
            </div>
            <div style={{ fontSize: 13, marginBottom: 20 }}>
              Consultanos por WhatsApp para próximos ingresos.
            </div>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Hola! Quería consultar sobre próximos ingresos de vehículos en GH Cars.')}`}
              target="_blank"
              rel="noreferrer"
              style={{ ...S.btnContactar, display: 'inline-flex', textDecoration: 'none' }}
            >
              <IcoWa /> Consultar por WhatsApp
            </a>
          </div>
        ) : (
          vehiculos.map(v => (
            <CardPublica key={v.id} v={v} foto={portadas[v.id]} tc={tc} waNumber={waNumber} />
          ))
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={S.footer}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#B9C2D0', marginBottom: 8 }}>
          GH Cars — Concesionaria de vehículos usados
        </div>
        <div style={{ marginBottom: 4 }}>
          WhatsApp:&nbsp;
          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer"
            style={{ color: '#6C5CFF', textDecoration: 'none', fontWeight: 600 }}>
            +54 9 11 6269-2000
          </a>
        </div>
        <div>Lunes a Sábado · 9:00 - 18:00</div>
        <div style={{ marginTop: 12, fontSize: 11 }}>
          Precios en USD · ARS calculado al dólar blue
        </div>
      </footer>

    </div>
  )
}
