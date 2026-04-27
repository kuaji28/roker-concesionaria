import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTheme } from '../context/ThemeContext'
import TiltCard from '../components/TiltCard'
import ThemeToggle from '../components/ThemeToggle'
import { useWANumber } from '../hooks/useWANumber'


const FALLBACK_TC = 1415
const ADDRESS    = 'Calle 1 1750, Benavídez, Buenos Aires'
const GMAPS_EMBED = 'https://www.google.com/maps?q=Calle+1+1750,+Benavídez,+Buenos+Aires&output=embed&z=14'
const GMAPS_LINK  = 'https://maps.google.com/?q=Calle+1+1750,+Benavídez,+Buenos+Aires'
const INSTAGRAM   = 'https://www.instagram.com/ghcars.ok/'
const TIKTOK      = 'https://www.tiktok.com/@ghcars.ok'

async function fetchTc() {
  try {
    const r = await fetch('https://dolarapi.com/v1/dolares/blue')
    const j = await r.json()
    const v = Number(j?.venta)
    if (!v || isNaN(v)) throw new Error()
    return v
  } catch {
    try {
      const { data } = await supabase.from('config').select('valor').eq('clave', 'tipo_cambio').single()
      return Number(data?.valor) || FALLBACK_TC
    } catch { return FALLBACK_TC }
  }
}

const WaIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)

const ArrowIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
)

const IgIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/>
  </svg>
)

const fmt = n => Number(n).toLocaleString('es-AR')

function AnimatedCounter({ target, suffix = '', active }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active || target === 0) return
    const duration = 1200
    const steps = 40
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + increment, target)
      setCount(Math.round(current))
      if (current >= target) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [active, target])
  const display = active ? count : 0
  return (
    <p style={{ fontSize: 'clamp(24px,3vw,34px)', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: 'var(--c-fg,#fafafa)' }}>
      {display}{suffix}
    </p>
  )
}

function VehicleCard({ v, foto, tc, waNumber, c, navigate }) {
  const precioUSD = v.precio_lista || v.precio_base
  const precioARS = precioUSD && tc ? Math.round(precioUSD * tc).toLocaleString('es-AR') : null
  const msg = encodeURIComponent(
    `Hola! Vi el *${v.marca} ${v.modelo} ${v.anio}*${v.version ? ` (${v.version})` : ''} en el catálogo de GH Cars. ¿Sigue disponible? 🚗`
  )

  return (
    <TiltCard
      intensity={0.5}
      style={{
        borderRadius: 18, overflow: 'hidden',
        background: c.card, border: `1px solid ${c.border}`,
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/p/vehiculo/${v.id}`)}
    >
      <div>
        <div style={{ position: 'relative', aspectRatio: '4/3', background: c.bg2 }}>
          {foto
            ? <img src={foto} alt={`${v.marca} ${v.modelo}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={c.fg3} strokeWidth="1"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h12l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>
              </div>
            )
          }
          <div style={{ position: 'absolute', top: 12, left: 12, padding: '3px 10px', background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(8px)', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff' }}>{v.anio}</div>
        </div>
        <div style={{ padding: '16px 18px 18px' }}>
          <p style={{ fontSize: 11, color: c.fg2, margin: 0, textTransform: 'uppercase', letterSpacing: '.08em' }}>{v.marca}</p>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '4px 0 2px', letterSpacing: '-0.01em', color: c.fg }}>{v.modelo}</h3>
          <p style={{ fontSize: 12, color: c.fg2, margin: 0 }}>{v.km_hs ? `${fmt(v.km_hs)} km` : '0 km'} · {v.transmision || '–'}</p>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 11, color: c.fg2 }}>USD</span>
                <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: c.fg }}>
                  {precioUSD ? fmt(precioUSD) : 'Consultar'}
                </span>
              </div>
              {precioARS && <p style={{ fontSize: 11, color: c.fg3, margin: '2px 0 0' }}>≈ ARS {precioARS}</p>}
            </div>
            <a
              href={`https://wa.me/${waNumber}?text=${msg}`}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                width: 36, height: 36, borderRadius: 999,
                background: '#22c55e', color: '#fff',
                display: 'grid', placeItems: 'center',
                textDecoration: 'none', flexShrink: 0,
              }}
            >
              <WaIcon size={16} />
            </a>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

export default function HomePublica() {
  const navigate  = useNavigate()
  const { colors: c, resolved } = useTheme()
  const waNumber  = useWANumber()

  const [tc,       setTc]       = useState(FALLBACK_TC)
  const [vehiculos, setVehiculos] = useState([])
  const [portadas,  setPortadas]  = useState({})
  const [totalStock, setTotalStock] = useState(0)
  const [featured,  setFeatured]  = useState(null)
  const [featFoto,  setFeatFoto]  = useState(null)
  const [loading,   setLoading]   = useState(true)

  // Counter animation refs
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)
  useEffect(() => {
    if (!statsRef.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect() } }, { threshold: 0.3 })
    obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const waMsg  = encodeURIComponent('Hola! Vi su catálogo en GH Cars. ¿Me podría dar más información?')
  const phone   = waNumber || '5491162692000'

  useEffect(() => { fetchTc().then(setTc) }, [])

  useEffect(() => {
    Promise.all([
      supabase.from('vehiculos').select('id,marca,modelo,version,anio,km_hs,precio_lista,precio_base,transmision,combustible,color,tipo').eq('estado', 'disponible').order('created_at', { ascending: false }).limit(7),
      supabase.from('vehiculos').select('id', { count: 'exact' }).eq('estado', 'disponible'),
    ]).then(async ([{ data: vehs }, { count }]) => {
      if (!vehs) return setLoading(false)
      setTotalStock(count || vehs.length)

      const ids = vehs.map(v => v.id)
      const { data: medias } = await supabase
        .from('medias').select('vehiculo_id,url,orden')
        .in('vehiculo_id', ids).order('orden', { ascending: true })

      const portMap = {}
      for (const m of (medias || [])) {
        if (!portMap[m.vehiculo_id]) portMap[m.vehiculo_id] = m.url
      }
      setPortadas(portMap)

      if (vehs.length > 0) {
        setFeatured(vehs[0])
        setFeatFoto(portMap[vehs[0].id] || null)
      }
      setVehiculos(vehs.slice(1, 7))
      setLoading(false)
    })
  }, [])

  const isDark = resolved === 'dark'
  const headerBg = isDark ? 'rgba(10,10,12,.85)' : 'rgba(250,250,247,.85)'

  return (
    <div style={{ background: c.bg, color: c.fg, minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased' }}>

      {/* ── TOP BAR ───────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '14px 32px',
        background: headerBg,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ cursor: 'pointer' }} onClick={() => navigate('/p/home')}>
            <img src="/logo.png" alt="GH Cars" style={{ height: 30, objectFit: 'contain', display: 'block', filter: isDark ? 'invert(1)' : 'none' }} />
          </div>
          <nav style={{ display: 'flex', gap: 2 }}>
            {[['Stock', '/p/catalogo'], ['Contacto', '/p/contacto']].map(([label, path]) => (
              <button key={path} onClick={() => navigate(path)} style={{ padding: '8px 14px', borderRadius: 999, background: 'transparent', color: c.fg2, border: 0, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'background .12s, color .12s' }}
                onMouseEnter={e => { e.currentTarget.style.background = c.card; e.currentTarget.style.color = c.fg }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.fg2 }}
              >{label}</button>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThemeToggle />
          <a href={`https://wa.me/${phone}?text=${waMsg}`} target="_blank" rel="noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', background: c.accent, color: '#fff',
            borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none',
            boxShadow: `0 4px 16px ${c.accent}44`,
          }}>
            <WaIcon size={13} /> WhatsApp
          </a>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(40px,6vw,72px) clamp(20px,5vw,56px)',
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,0.9fr)',
        gap: 'clamp(24px,4vw,56px)',
        alignItems: 'center',
        background: isDark
          ? `radial-gradient(circle at 70% 30%, rgba(255,45,85,.07), transparent 55%)`
          : `radial-gradient(circle at 70% 30%, rgba(225,29,72,.04), transparent 55%)`,
      }}>
        {/* Left */}
        <div>
          <p style={{ fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: c.accent, margin: 0, fontWeight: 600 }}>
            Concesionaria · Benavidez
          </p>
          <h1 style={{ fontSize: 'clamp(48px,7vw,88px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.92, margin: '16px 0 0', color: c.fg }}>
            Encontrá tu<br />próximo auto.
          </h1>
          <p style={{ fontSize: 17, color: c.fg2, margin: '22px 0 0', lineHeight: 1.6, maxWidth: 460 }}>
            {loading ? '…' : totalStock} unidades seleccionadas. Compra · Venta · Asesoramiento desde 2010.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/p/catalogo')} style={{
              padding: '15px 26px', background: c.accent, color: '#fff', border: 0, borderRadius: 999,
              fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'inherit',
              boxShadow: `0 4px 20px ${c.accent}40`,
            }}>
              Ver stock <ArrowIcon size={14} />
            </button>
            <a href={`https://wa.me/${phone}?text=${waMsg}`} target="_blank" rel="noreferrer" style={{
              padding: '15px 26px', background: 'transparent', color: c.fg, border: `1px solid ${c.borderStrong}`,
              borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <WaIcon size={14} /> Hablar por WhatsApp
            </a>
          </div>
          {/* Stats strip */}
          <div ref={statsRef} style={{ display: 'flex', gap: 28, marginTop: 44, paddingTop: 28, borderTop: `1px solid ${c.border}`, flexWrap: 'wrap' }}>
            {[
              { num: loading ? 0 : totalStock, suffix: '+', label: 'Unidades' },
              { num: 14,    suffix: 'yr', label: 'Trayectoria' },
              { num: 1400,  suffix: '+', label: 'Operaciones' },
            ].map(s => (
              <div key={s.label}>
                <AnimatedCounter target={s.num} suffix={s.suffix} active={statsVisible} />
                <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: c.fg2, margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: featured card */}
        {featured && (
          <TiltCard
            intensity={0.7}
            style={{ borderRadius: 28, overflow: 'hidden', background: c.card, border: `1px solid ${c.border}`, boxShadow: c.shadow }}
          >
            <div onClick={() => navigate(`/p/vehiculo/${featured.id}`)} style={{ position: 'relative', aspectRatio: '4/5', cursor: 'pointer' }}>
              {featFoto
                ? <img src={featFoto} alt={`${featured.marca} ${featured.modelo}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <div style={{ width: '100%', height: '100%', background: c.bg2 }} />
              }
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,.85) 100%)' }} />
              <div style={{ position: 'absolute', top: 20, right: 20, padding: '5px 12px', background: c.accent, borderRadius: 8, fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff' }}>
                Destacado · {featured.anio}
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, color: '#fff' }}>
                <p style={{ fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)', margin: 0 }}>{featured.marca}</p>
                <h3 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, margin: '6px 0 4px', letterSpacing: '-0.02em' }}>{featured.modelo}</h3>
                {featured.version && <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', margin: 0 }}>{featured.version}</p>}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 14 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>USD</span>
                  <span style={{ fontSize: 'clamp(28px,3.5vw,36px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
                    {featured.precio_lista || featured.precio_base ? fmt(featured.precio_lista || featured.precio_base) : 'Consultar'}
                  </span>
                </div>
              </div>
            </div>
          </TiltCard>
        )}
      </section>

      {/* ── CATEGORÍAS ───────────────────────────────────────────── */}
      <section style={{ padding: '0 clamp(20px,5vw,56px) clamp(24px,3vw,40px)' }}>
        <p style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: c.fg3, margin: '0 0 14px', fontWeight: 600 }}>Navegá por categoría</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: 'Pickups',    carroceria: 'Pickup',   emoji: '🛻' },
            { label: 'SUVs',       carroceria: 'SUV',       emoji: '🚙' },
            { label: 'Sedanes',    carroceria: 'Sedán',     emoji: '🚗' },
            { label: 'Hatchbacks', carroceria: 'Hatchback', emoji: '🚘' },
          ].map(cat => (
            <button
              key={cat.label}
              onClick={() => navigate(`/p/catalogo?carroceria=${encodeURIComponent(cat.carroceria)}`)}
              style={{
                padding: '10px 22px', borderRadius: 999, cursor: 'pointer',
                border: `1.5px solid ${c.border}`, background: c.card,
                color: c.fg, fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 7,
                transition: 'all .15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = c.accent
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.borderColor = c.accent
                e.currentTarget.style.boxShadow = `0 4px 16px ${c.accent}44`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = c.card
                e.currentTarget.style.color = c.fg
                e.currentTarget.style.borderColor = c.border
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <span style={{ fontSize: 16 }}>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── STOCK GRID ────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(20px,4vw,40px) clamp(20px,5vw,56px)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: c.fg }}>Stock disponible</h2>
          <button onClick={() => navigate('/p/catalogo')} style={{
            background: 'transparent', border: 0, color: c.accent, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'inherit',
          }}>
            Ver catálogo completo <ArrowIcon size={13} />
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ borderRadius: 18, background: c.card, border: `1px solid ${c.border}`, overflow: 'hidden' }}>
                <div style={{ aspectRatio: '4/3', background: c.bg2, animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%' }} />
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ height: 12, background: c.bg2, borderRadius: 4, marginBottom: 8, width: '40%' }} />
                  <div style={{ height: 18, background: c.bg2, borderRadius: 4, width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : vehiculos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: c.fg2 }}>
            <p style={{ fontSize: 16, fontWeight: 600 }}>No hay más unidades disponibles</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Consultanos por WhatsApp para próximos ingresos.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {vehiculos.map(v => (
              <VehicleCard key={v.id} v={v} foto={portadas[v.id]} tc={tc} waNumber={phone} c={c} navigate={navigate} />
            ))}
          </div>
        )}
      </section>

      {/* ── MAPA + INFO ───────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(40px,6vw,72px) clamp(20px,5vw,56px) 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)', gap: 48, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: c.accent, margin: 0, fontWeight: 600 }}>Visitanos</p>
            <h2 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, margin: '16px 0 0', lineHeight: 1.05, letterSpacing: '-0.03em', color: c.fg }}>Showroom<br />en Benavidez</h2>
            <p style={{ fontSize: 15, color: c.fg2, marginTop: 16, lineHeight: 1.65 }}>{ADDRESS}<br />Lunes a Sábado · 9:00 – 18:00</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
              <a href={GMAPS_LINK} target="_blank" rel="noreferrer" style={{
                padding: '12px 20px', background: c.fg, color: c.bg, borderRadius: 999,
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                Cómo llegar <ArrowIcon size={12} />
              </a>
              <a href={`https://wa.me/${phone}?text=${waMsg}`} target="_blank" rel="noreferrer" style={{
                padding: '12px 20px', background: 'transparent', color: c.fg, border: `1px solid ${c.borderStrong}`,
                borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <WaIcon size={13} /> Escribinos
              </a>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" style={{ width: 40, height: 40, borderRadius: 999, border: `1px solid ${c.border}`, display: 'grid', placeItems: 'center', color: c.fg, textDecoration: 'none' }}>
                <IgIcon />
              </a>
              <a href={TIKTOK} target="_blank" rel="noreferrer" style={{ width: 40, height: 40, borderRadius: 999, border: `1px solid ${c.border}`, display: 'grid', placeItems: 'center', color: c.fg, textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.26 8.26 0 0 0 4.83 1.55V6.79a4.86 4.86 0 0 1-1.06-.1z"/></svg>
              </a>
            </div>
          </div>
          <div style={{ borderRadius: 24, overflow: 'hidden', height: 380, border: `1px solid ${c.border}`, boxShadow: c.shadowSm }}>
            <iframe
              src={GMAPS_EMBED}
              style={{ width: '100%', height: '100%', border: 0, filter: c.mapFilter, display: 'block' }}
              loading="lazy"
              title="Showroom GH Cars"
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer style={{ marginTop: 56, padding: 'clamp(16px,2vw,24px) clamp(20px,5vw,56px)', borderTop: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 10, color: '#fff' }}>GH</div>
          <p style={{ fontSize: 12, color: c.fg2, margin: 0 }}>© GH Cars · Compra · Venta · Asesoramiento</p>
        </div>
        <p style={{ fontSize: 12, color: c.fg2, margin: 0 }}>
          USD/ARS · ${(tc || FALLBACK_TC).toLocaleString('es-AR')}
        </p>
      </footer>
    </div>
  )
}
