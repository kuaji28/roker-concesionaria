import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useIsMobile } from '../hooks/useIsMobile'

const FALLBACK_TC = 1415
const WA_NUMBER   = '5491162692000'

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

export default function DetallePublico() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const isMobile   = useIsMobile()
  const [v,    setV]    = useState(null)
  const [fotos, setFotos] = useState([])
  const [idx,   setIdx]  = useState(0)
  const [tc,    setTc]   = useState(FALLBACK_TC)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTc().then(setTc) }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      supabase.from('vehiculos').select('*').eq('id', id).single(),
      supabase.from('medias').select('*').eq('vehiculo_id', id).eq('tipo', 'foto').order('orden'),
    ]).then(([{ data: vehiculo }, { data: medias }]) => {
      setV(vehiculo)
      setFotos(medias || [])
      setLoading(false)
    })
  }, [id])

  function abrirWhatsApp() {
    const nombre = v ? `${v.marca} ${v.modelo} ${v.anio}` : 'un vehículo'
    const msg = encodeURIComponent(
      `Hola! Vi el *${nombre}* en el catálogo de GH Cars.\n¿Podría darme más información? 🚗`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
  }

  const foto = fotos[idx]
  const precioUSD = v?.precio_lista || v?.precio_base
  const precioARS = precioUSD && tc ? (precioUSD * tc).toLocaleString('es-AR') : null

  const specs = [
    { label: 'Año',         value: v?.anio },
    { label: 'Kilometraje', value: v?.km_hs ? `${Number(v.km_hs).toLocaleString('es-AR')} km` : '0 KM' },
    { label: 'Transmisión', value: v?.transmision },
    { label: 'Combustible', value: v?.combustible },
    { label: 'Color',       value: v?.color },
    { label: 'Motor',       value: v?.motor },
    { label: 'Tipo',        value: v?.tipo ? v.tipo.charAt(0).toUpperCase() + v.tipo.slice(1) : null },
    { label: 'Titular',     value: v?.propietario_actual ? `${v.propietario_actual}° titular` : null },
  ].filter(s => s.value)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>

      {/* Header */}
      <header style={{
        background: 'var(--c-card)', borderBottom: '1px solid var(--c-border)',
        padding: '12px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/p/catalogo')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-fg-2)', fontSize: 20, padding: 4 }}
            title="Volver al catálogo"
          >
            ←
          </button>
          <div className="brand-mark" style={{ width: 32, height: 32, fontSize: 12, borderRadius: 8 }}>GH</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>GH Cars</div>
        </div>
        <a
          href={`https://wa.me/${WA_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
          style={{ fontSize: 13, textDecoration: 'none' }}
        >
          💬 Contactar
        </a>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--c-fg-3)', padding: 80, fontSize: 15 }}>
          Cargando…
        </div>
      ) : !v ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚗</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Vehículo no encontrado</div>
          <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => navigate('/p/catalogo')}>
            Volver al catálogo
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '16px 16px 60px' : '24px 24px 60px' }}>

          {/* Título */}
          <div style={{ marginBottom: 16 }}>
            <h1 style={{ margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 800 }}>
              {v.marca} {v.modelo}
              {v.version && <span style={{ fontWeight: 400, color: 'var(--c-fg-2)', fontSize: isMobile ? 17 : 20 }}> {v.version}</span>}
            </h1>
            <div style={{ fontSize: 13, color: 'var(--c-fg-3)', marginTop: 4 }}>
              {v.anio}
              {v.km_hs ? ` · ${Number(v.km_hs).toLocaleString('es-AR')} km` : ' · 0 KM'}
              {v.transmision ? ` · ${v.transmision}` : ''}
              {v.combustible ? ` · ${v.combustible}` : ''}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) 300px',
            gap: 20,
            alignItems: 'start',
          }}>

            {/* Galería */}
            <div>
              {/* Foto principal */}
              <div style={{
                aspectRatio: '4/3', background: 'var(--c-card-2)', borderRadius: 12,
                overflow: 'hidden', position: 'relative', marginBottom: 10,
              }}>
                {foto
                  ? <img src={foto.url} alt={`${v.marca} ${v.modelo}`}
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  height: '100%', color: 'var(--c-fg-3)', fontSize: 60 }}>🚗</div>
                }
                {fotos.length > 1 && (
                  <>
                    <button onClick={() => setIdx(i => (i - 1 + fotos.length) % fotos.length)}
                      style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                               background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
                               borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 18 }}>
                      ‹
                    </button>
                    <button onClick={() => setIdx(i => (i + 1) % fotos.length)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                               background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
                               borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 18 }}>
                      ›
                    </button>
                    <div style={{ position: 'absolute', bottom: 10, right: 12,
                                  background: 'rgba(0,0,0,0.55)', color: '#fff',
                                  borderRadius: 20, padding: '3px 10px', fontSize: 12 }}>
                      {idx + 1} / {fotos.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails — horizontally scrollable on mobile */}
              {fotos.length > 1 && (
                <div style={{
                  display: 'flex',
                  gap: 6,
                  overflowX: isMobile ? 'auto' : 'visible',
                  flexWrap: isMobile ? 'nowrap' : 'wrap',
                  paddingBottom: isMobile ? 4 : 0,
                  WebkitOverflowScrolling: 'touch',
                }}>
                  {fotos.map((f, i) => (
                    <div
                      key={f.id}
                      onClick={() => setIdx(i)}
                      style={{
                        width: 64, height: 48, borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
                        border: i === idx ? '2px solid var(--c-accent)' : '2px solid transparent',
                        flexShrink: 0,
                      }}
                    >
                      <img src={f.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Panel — Precio + Specs + CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Precio */}
              <div className="card" style={{ padding: '20px 18px' }}>
                <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800, marginBottom: 2 }}>
                  {precioUSD ? `USD ${precioUSD.toLocaleString('es-AR')}` : 'Precio a consultar'}
                </div>
                {precioARS && (
                  <div style={{ fontSize: 13, color: 'var(--c-fg-3)', marginBottom: 16 }}>
                    ≈ ARS {precioARS} · TC ${tc.toLocaleString('es-AR')}
                  </div>
                )}
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, padding: '12px 0' }}
                  onClick={abrirWhatsApp}
                >
                  💬 Consultar por WhatsApp
                </button>
              </div>

              {/* Especificaciones */}
              {specs.length > 0 && (
                <div className="card" style={{ padding: '16px 18px' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: 'var(--c-fg-2)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Especificaciones
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                    {specs.map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: 11, color: 'var(--c-fg-3)', textTransform: 'uppercase', letterSpacing: 0.3 }}>{s.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Volver */}
              <button
                className="btn btn-ghost"
                style={{ width: '100%', fontSize: 13 }}
                onClick={() => navigate('/p/catalogo')}
              >
                ← Volver al catálogo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
