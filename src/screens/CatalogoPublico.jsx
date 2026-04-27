import React, { useEffect, useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useWANumber } from '../hooks/useWANumber'
import { useTheme } from '../context/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'
import ThemeToggle from '../components/ThemeToggle'
import TiltCard from '../components/TiltCard'

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
async function getVehiculosPublicos({ tipo, anioMin, precioMax, kmMax }) {
  let q = supabase
    .from('vehiculos')
    .select('id,tipo,carroceria,marca,modelo,anio,version,km_hs,precio_lista,precio_base,transmision,color,combustible')
    .eq('estado', 'disponible')
    .order('created_at', { ascending: false })

  if (tipo && tipo !== 'todos') q = q.eq('tipo', tipo)
  if (anioMin) q = q.gte('anio', Number(anioMin))
  if (precioMax) q = q.lte('precio_lista', Number(precioMax))
  if (kmMax) q = q.lte('km_hs', Number(kmMax))

  const { data } = await q
  return data || []
}

async function getPortadas(vehiculoIds) {
  if (!vehiculoIds.length) return {}
  const { data } = await supabase
    .from('media')
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

const CARROCERIAS = ['todos', 'SUV', 'Pickup', 'Sedán', 'Hatchback', 'Familiar', 'Coupé', 'Minivan', 'Utilitario']

/* ─── Íconos inline ─────────────────────────────────────────── */
const IcoKm = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
    <path d="M12 12l3-2"/><path d="M12 8v4"/>
  </svg>
)
const IcoTrans = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <circle cx="6" cy="12" r="2"/><path d="M10 12h4"/><circle cx="18" cy="12" r="2"/>
  </svg>
)
const IcoCombustible = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/>
    <path d="M17 8h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/><path d="M3 12h14"/>
  </svg>
)

/* ─── Card ──────────────────────────────────────────────────── */
function VehicleCard({ v, foto, tc, waNumber, c }) {
  const navigate  = useNavigate()
  const precioUSD = v.precio_lista || v.precio_base
  const precioARS = precioUSD && tc ? Math.round(precioUSD * tc).toLocaleString('es-AR') : null

  function consultarWA(e) {
    e.stopPropagation()
    const msg = encodeURIComponent(
      `Hola! Vi el *${v.marca} ${v.modelo} ${v.anio}*${v.version ? ` (${v.version})` : ''} en el catálogo de GH Cars.\n¿Sigue disponible? 🚗`
    )
    window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank')
  }

  const km = v.km_hs ? `${Number(v.km_hs).toLocaleString('es-AR')} km` : '0 km'

  return (
    <TiltCard
      intensity={0.6}
      style={{ borderRadius: 16, background: c.card, border: `1px solid ${c.border}`, overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => navigate(`/p/vehiculo/${v.id}`)}
    >
      {/* Imagen */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {foto
          ? <img src={foto} alt={`${v.marca} ${v.modelo}`}
                 style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }}
                 loading="lazy" />
          : (
            <div style={{ width: '100%', aspectRatio: '16/10', background: c.bg2,
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
                   stroke={c.border} strokeWidth="1" strokeLinecap="round">
                <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h12l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
              </svg>
            </div>
          )
        }
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />
        {/* Badges */}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          border: `1px solid ${c.border}`, color: c.fg,
        }}>{v.anio}</span>
        <span style={{
          position: 'absolute', bottom: 10, left: 10,
          padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
          background: c.accent, color: '#fff',
        }}>Disponible</span>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 12px' }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, lineHeight: 1.25,
                     letterSpacing: '-0.01em', color: c.fg }}>
          {v.marca} {v.modelo}
        </h2>
        {v.version && (
          <p style={{ margin: '3px 0 0', fontSize: 12, color: c.fg2 }}>{v.version}</p>
        )}

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0 12px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
                         padding: '3px 9px', borderRadius: 999, fontSize: 11, color: c.fg2,
                         background: c.bg2, border: `1px solid ${c.border}` }}>
            <IcoKm />{km}
          </span>
          {v.transmision && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
                           padding: '3px 9px', borderRadius: 999, fontSize: 11, color: c.fg2,
                           background: c.bg2, border: `1px solid ${c.border}` }}>
              <IcoTrans />{v.transmision}
            </span>
          )}
          {v.combustible && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
                           padding: '3px 9px', borderRadius: 999, fontSize: 11, color: c.fg2,
                           background: c.bg2, border: `1px solid ${c.border}` }}>
              <IcoCombustible />{v.combustible}
            </span>
          )}
        </div>

        {/* Precio */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: c.fg }}>
            {precioUSD ? `USD ${precioUSD.toLocaleString('es-AR')}` : 'Consultar'}
          </p>
          {precioARS && (
            <p style={{ margin: '3px 0 0', fontSize: 11, color: c.fg3 }}>
              ≈ ARS {precioARS}
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          style={{
            width: '100%', height: 42, borderRadius: 10,
            border: `1.5px solid ${c.accent}`,
            background: 'transparent', color: c.accent,
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            transition: 'background .15s, color .15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = c.accent
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = c.accent
          }}
          onClick={consultarWA}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          Consultar
        </button>
      </div>
    </TiltCard>
  )
}

/* ─── Pantalla principal ────────────────────────────────────── */
export default function CatalogoPublico() {
  const { colors: c } = useTheme()
  const waNumber = useWANumber()
  const isMobile = useIsMobile()
  const [vehiculos, setVehiculos] = useState([])
  const [portadas,  setPortadas]  = useState({})
  const [tc,        setTc]        = useState(FALLBACK_TC)
  const [loading,   setLoading]   = useState(true)

  const [tipo,       setTipo]      = useState('todos')
  const [carroceria, setCarroceria]= useState('todos')
  const [buscar,     setBuscar]    = useState('')
  const [anioMin,    setAnioMin]   = useState('')
  const [precioMax,  setPrecioMax] = useState('')
  const [kmMax,      setKmMax]     = useState('')
  const [sortBy,     setSortBy]    = useState('reciente')
  const [viewMode,   setViewMode]  = useState('grid')

  const [cols, setCols] = useState(1)
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const carroceriaParam = searchParams.get('carroceria')
    if (carroceriaParam) setCarroceria(carroceriaParam)
  }, [searchParams])

  useEffect(() => {
    const update = () => setCols(window.innerWidth >= 700 ? (window.innerWidth >= 1050 ? 3 : 2) : 1)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => { fetchTc().then(setTc) }, [])

  useEffect(() => {
    setLoading(true)
    getVehiculosPublicos({ tipo, anioMin, precioMax, kmMax }).then(async data => {
      setVehiculos(data)
      const fotos = await getPortadas(data.map(v => v.id))
      setPortadas(fotos)
      setLoading(false)
    })
  }, [tipo, anioMin, precioMax, kmMax])

  function limpiarFiltros() { setBuscar(''); setAnioMin(''); setPrecioMax(''); setKmMax(''); setCarroceria('todos') }
  const hasFiltros = buscar || anioMin || precioMax || kmMax || carroceria !== 'todos'

  // client-side text + carroceria filter
  const vehiculosFiltrados = vehiculos.filter(v => {
    if (carroceria !== 'todos' && v.carroceria?.toLowerCase() !== carroceria.toLowerCase()) return false
    if (buscar) {
      const q = buscar.toLowerCase()
      if (!`${v.marca} ${v.modelo} ${v.version || ''}`.toLowerCase().includes(q)) return false
    }
    return true
  })

  const vehiculosOrdenados = [...vehiculosFiltrados].sort((a, b) => {
    if (sortBy === 'precio_asc')  return (a.precio_lista || a.precio_base || 0) - (b.precio_lista || b.precio_base || 0)
    if (sortBy === 'precio_desc') return (b.precio_lista || b.precio_base || 0) - (a.precio_lista || a.precio_base || 0)
    if (sortBy === 'anio_desc')   return (b.anio || 0) - (a.anio || 0)
    if (sortBy === 'km_asc')      return (a.km_hs || 0) - (b.km_hs || 0)
    return 0 // 'reciente' = orden original de la query
  })

  const bgGlass = c.resolved === 'dark'
    ? 'rgba(10,10,12,0.88)'
    : 'rgba(250,250,247,0.9)'

  return (
    <div style={{
      minHeight: '100vh', background: c.bg, color: c.fg,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      WebkitFontSmoothing: 'antialiased',
    }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: bgGlass,
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: `1px solid ${c.border}`,
        padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 56,
      }}>
        {/* Logo */}
        <Link to="/p/home" style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src="/logo.png" alt="GH Cars" style={{ height: 28, objectFit: 'contain', display: 'block', filter: c.resolved === 'dark' ? 'invert(1)' : 'none' }} />
        </Link>

        {/* Nav + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ThemeToggle />
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Hola GH Cars, quiero información sobre el stock disponible.')}`}
            target="_blank" rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 34, padding: '0 14px', borderRadius: 999,
              background: c.accent, color: '#fff',
              fontWeight: 600, fontSize: 12, textDecoration: 'none',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            Contactar
          </a>
        </div>
      </header>

      {/* ── Tabs tipo ──────────────────────────────────────── */}
      <nav style={{
        padding: '10px 16px 6px',
        overflowX: 'auto', display: 'flex', gap: 6,
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}>
        {TIPOS.map(t => (
          <button
            key={t}
            style={{
              whiteSpace: 'nowrap', padding: '0 14px', height: 32,
              borderRadius: 999, fontWeight: 600, fontSize: 12, cursor: 'pointer',
              flexShrink: 0, transition: 'all .15s',
              ...(tipo === t
                ? { background: c.accent, color: '#fff', border: 'none' }
                : { background: 'transparent', color: c.fg2,
                    border: `1px solid ${c.border}` }
              ),
            }}
            onClick={() => setTipo(t)}
          >{TIPOS_LABEL[t]}</button>
        ))}
      </nav>

      {/* ── Filtros sticky ─────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 56, zIndex: 30,
        background: bgGlass,
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: `1px solid ${c.border}`,
        padding: '8px 16px 6px',
      }}>

        {/* Carrocería chips (solo cuando tipo=auto o todos) */}
        {(tipo === 'todos' || tipo === 'auto') && (
          <nav style={{
            overflowX: 'auto', display: 'flex', gap: 6, marginBottom: 8,
            scrollbarWidth: 'none', msOverflowStyle: 'none',
          }}>
            {CARROCERIAS.map(car => (
              <button
                key={car}
                style={{
                  whiteSpace: 'nowrap', padding: '0 12px', height: 28,
                  borderRadius: 999, fontWeight: 600, fontSize: 11, cursor: 'pointer',
                  flexShrink: 0, transition: 'all .15s',
                  ...(carroceria === car
                    ? { background: c.accent, color: '#fff', border: 'none' }
                    : { background: 'transparent', color: c.fg2, border: `1px solid ${c.border}` }
                  ),
                }}
                onClick={() => setCarroceria(car)}
              >{car === 'todos' ? 'Todos' : car}</button>
            ))}
          </nav>
        )}

        {/* Search + filtros row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 4 }}>
          {/* Fila 1: Search + Sort */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.fg3}
                   strokeWidth="2" strokeLinecap="round"
                   style={{ position: 'absolute', left: 10, pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                style={{
                  width: '100%', height: 38,
                  background: c.bg2, border: `1px solid ${c.border}`,
                  borderRadius: 10, color: c.fg, fontSize: 12,
                  paddingLeft: 32, paddingRight: 10, outline: 'none', boxSizing: 'border-box',
                }}
                placeholder="Buscar marca, modelo..."
                value={buscar}
                onChange={e => setBuscar(e.target.value)}
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                height: 38, background: c.bg2, border: `1px solid ${c.border}`,
                borderRadius: 10, color: c.fg, fontSize: 12,
                padding: '0 10px', outline: 'none', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <option value="reciente">Más reciente</option>
              <option value="precio_asc">Precio ↑</option>
              <option value="precio_desc">Precio ↓</option>
              <option value="anio_desc">Año ↓</option>
              <option value="km_asc">Km ↑</option>
            </select>
            {hasFiltros && (
              <button
                style={{
                  width: 38, height: 38, flexShrink: 0,
                  display: 'grid', placeItems: 'center',
                  background: c.bg2, border: `1px solid ${c.border}`,
                  borderRadius: 10, color: c.accent, cursor: 'pointer',
                }}
                onClick={limpiarFiltros}
              >✕</button>
            )}
          </div>

          {/* Fila 2: Filtros numéricos */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {/* Año desde */}
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', top: -7, left: 9,
                padding: '0 4px', fontSize: 10, color: c.fg2,
                background: c.bg, borderRadius: 3, zIndex: 1, pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}>Año desde</span>
              <select
                style={{
                  width: '100%', height: 38,
                  background: c.bg2, border: `1px solid ${c.border}`,
                  borderRadius: 10, color: c.fg, fontSize: 12,
                  padding: '0 10px', outline: 'none', appearance: 'none', cursor: 'pointer',
                }}
                value={anioMin}
                onChange={e => setAnioMin(e.target.value)}
              >
                <option value="">Todos</option>
                {[2025,2024,2023,2022,2021,2020,2018,2015,2012,2010].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Precio máx */}
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', top: -7, left: 9,
                padding: '0 4px', fontSize: 10, color: c.fg2,
                background: c.bg, borderRadius: 3, zIndex: 1, pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}>Precio máx</span>
              <input
                style={{
                  width: '100%', height: 38,
                  background: c.bg2, border: `1px solid ${c.border}`,
                  borderRadius: 10, color: c.fg, fontSize: 12,
                  padding: '0 10px', outline: 'none', boxSizing: 'border-box',
                }}
                inputMode="numeric"
                placeholder="USD"
                value={precioMax}
                onChange={e => setPrecioMax(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            {/* Km máximos */}
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', top: -7, left: 9,
                padding: '0 4px', fontSize: 10, color: c.fg2,
                background: c.bg, borderRadius: 3, zIndex: 1, pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}>Km máx</span>
              <input
                style={{
                  width: '100%', height: 38,
                  background: c.bg2, border: `1px solid ${c.border}`,
                  borderRadius: 10, color: c.fg, fontSize: 12,
                  padding: '0 10px', outline: 'none', boxSizing: 'border-box',
                }}
                inputMode="numeric"
                placeholder="—"
                value={kmMax}
                onChange={e => setKmMax(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>
        </div>


        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontSize: 11, color: c.fg3, letterSpacing: '0.02em' }}>
            {loading ? 'Cargando…' : `${vehiculosFiltrados.length} vehículo${vehiculosFiltrados.length !== 1 ? 's' : ''} · TC USD/ARS: ${tc.toLocaleString('es-AR')}`}
          </div>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            {[
              { mode: 'grid', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
              { mode: 'list', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
            ].map(({ mode, icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  width: 30, height: 30, borderRadius: 8, cursor: 'pointer',
                  display: 'grid', placeItems: 'center',
                  background: viewMode === mode ? c.accent : c.bg2,
                  color: viewMode === mode ? '#fff' : c.fg3,
                  border: `1px solid ${viewMode === mode ? c.accent : c.border}`,
                  transition: 'all .15s',
                }}
              >{icon}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ───────────────────────────────────────────── */}
      <div style={{
        padding: '16px', maxWidth: 1100, margin: '0 auto',
        display: 'grid', gap: viewMode === 'list' ? 10 : 20,
        gridTemplateColumns: viewMode === 'list' ? '1fr' : `repeat(${cols}, 1fr)`,
      }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: c.fg3, padding: '60px 20px' }}>
            Cargando vehículos…
          </div>
        ) : vehiculos.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: c.fg3, padding: '60px 20px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={c.fg3}
                 strokeWidth="1" strokeLinecap="round" style={{ marginBottom: 16 }}>
              <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h12l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
              <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
            </svg>
            <div style={{ fontSize: 16, fontWeight: 600, color: c.fg2, marginBottom: 6 }}>
              No hay vehículos disponibles
            </div>
            <div style={{ fontSize: 13, marginBottom: 20 }}>
              Consultanos por WhatsApp para próximos ingresos.
            </div>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Hola! Quería consultar sobre próximos ingresos de vehículos en GH Cars.')}`}
              target="_blank" rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                height: 40, padding: '0 20px', borderRadius: 999,
                background: c.accent, color: '#fff',
                fontWeight: 600, fontSize: 13, textDecoration: 'none',
              }}
            >
              Consultar por WhatsApp
            </a>
          </div>
        ) : vehiculosFiltrados.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: c.fg3, padding: '40px 20px' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: c.fg2, marginBottom: 6 }}>Sin resultados</div>
            <div style={{ fontSize: 13 }}>Probá con otros filtros.</div>
          </div>
        ) : (
          vehiculosOrdenados.map(v => (
            <VehicleCard key={v.id} v={v} foto={portadas[v.id]} tc={tc} waNumber={waNumber} c={c} />
          ))
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${c.border}`,
        padding: '32px 20px 40px',
        textAlign: 'center', color: c.fg3, fontSize: 12, marginTop: 20,
      }}>
        {/* Brand */}
        <div style={{ fontWeight: 800, fontSize: 15, color: c.fg, marginBottom: 4 }}>
          GH Cars
        </div>
        <div style={{ fontSize: 12, color: c.fg3, marginBottom: 20 }}>
          Concesionaria de vehículos 0 km y usados
        </div>

        {/* CTAs principales */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          {/* WhatsApp button */}
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Hola GH Cars, quiero información sobre el stock disponible.')}`}
            target="_blank" rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              height: 44, padding: '0 20px', borderRadius: 999,
              background: '#25D366', color: '#fff',
              fontWeight: 700, fontSize: 13, textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.528 5.845L0 24l6.335-1.505A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.37l-.36-.214-3.724.885.935-3.618-.235-.372A9.818 9.818 0 1 1 12 21.818z"/>
            </svg>
            +54 9 11 6269-2000
          </a>

          {/* Google Maps button */}
          <a
            href="https://maps.app.goo.gl/VYKu4otJrNhqwNNXA?g_st=ac"
            target="_blank" rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              height: 44, padding: '0 20px', borderRadius: 999,
              background: 'transparent', color: c.fg2,
              border: `1.5px solid ${c.border}`,
              fontWeight: 600, fontSize: 13, textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Calle 1 1750, Benavídez
          </a>
        </div>

        {/* Horario */}
        <div style={{ marginBottom: 20, fontSize: 12, color: c.fg3 }}>
          Lunes a Sábado · 9:00 - 18:00
        </div>

        {/* Redes sociales */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
          <a href="https://www.instagram.com/ghcars.ok/" target="_blank" rel="noreferrer"
             style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: c.fg2,
                      textDecoration: 'none', fontSize: 12, fontWeight: 600,
                      height: 44, padding: '0 4px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            @ghcars.ok
          </a>
          <a href="https://www.tiktok.com/@ghcars.ok" target="_blank" rel="noreferrer"
             style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: c.fg2,
                      textDecoration: 'none', fontSize: 12, fontWeight: 600,
                      height: 44, padding: '0 4px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.94a8.18 8.18 0 0 0 4.78 1.52V7.01a4.85 4.85 0 0 1-1.01-.32z"/>
            </svg>
            @ghcars.ok
          </a>
        </div>

        {/* Legal */}
        <div style={{ fontSize: 11, color: c.fg3, borderTop: `1px solid ${c.border}`, paddingTop: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <span>Precios en USD · ARS calculado al dólar blue</span>
          <Link to="/login" style={{ color: c.fg3, textDecoration: 'none', opacity: 0.6 }}>Ingresar →</Link>
        </div>
      </footer>
    </div>
  )
}
