import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import Icon from '../components/Icon'
import { getVehiculosEnStock } from '../lib/supabase'
import { useTc } from '../hooks/useTc'

function diasEnStock(v) {
  const fechaStr = v.fecha_ingreso || (v.created_at || '').slice(0, 10)
  if (!fechaStr) return 0
  try {
    const diff = Date.now() - new Date(fechaStr).getTime()
    return Math.max(0, Math.floor(diff / 86400000))
  } catch { return 0 }
}

function semaforo(dias) {
  if (dias < 30)  return { label: '🟢 <30d',  cls: 'success', hex: '#2ecc71', bg: '#2ecc7118' }
  if (dias < 60)  return { label: '🟡 30-60d', cls: 'warning', hex: '#f1c40f', bg: '#f1c40f18' }
  if (dias < 90)  return { label: '🟠 60-90d', cls: 'warning', hex: '#e67e22', bg: '#e67e2218' }
  return             { label: '🔴 >90d',   cls: 'danger',  hex: '#e74c3c', bg: '#e74c3c18' }
}

const ORDEN_OPS = [
  { v: 'dias_desc', l: 'Días ↓' },
  { v: 'dias_asc',  l: 'Días ↑' },
  { v: 'precio_desc', l: 'Precio ↓' },
  { v: 'precio_asc',  l: 'Precio ↑' },
]

export default function Rotacion({ onLogout }) {
  const TC = useTc()
  const [rows, setRows]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('semaforo')
  const [filtroSem, setFiltroSem] = useState([])
  const [orden, setOrden]       = useState('dias_desc')

  useEffect(() => {
    getVehiculosEnStock().then(vehiculos => {
      const data = vehiculos.map(v => {
        const dias      = diasEnStock(v)
        const sem       = semaforo(dias)
        const precio    = v.precio_base || 0
        const costo     = v.costo_compra || precio
        const gastos    = v.gastos_total_usd || 0
        const costoTot  = costo + gastos
        const margen    = costoTot > 0 ? ((precio - costoTot) / costoTot) * 100 : 0
        return { ...v, dias, sem, precio, costoTot, margen }
      })
      setRows(data)
      const sems = [...new Set(data.map(r => r.sem.label))]
      setFiltroSem(sems)
      setLoading(false)
    })
  }, [])

  // ── KPIs ─────────────────────────────────────────────────────
  const total       = rows.length
  const parados     = rows.filter(r => r.dias >= 90).length
  const diasProm    = total ? Math.round(rows.reduce((s, r) => s + r.dias, 0) / total) : 0
  const valorTotal  = rows.reduce((s, r) => s + r.precio, 0)
  const margenProm  = total ? rows.reduce((s, r) => s + r.margen, 0) / total : 0

  // ── Semáforo tab ─────────────────────────────────────────────
  const sems = [...new Set(rows.map(r => r.sem.label))]

  let rowsFil = rows.filter(r => filtroSem.includes(r.sem.label))
  if (orden === 'dias_desc')   rowsFil = [...rowsFil].sort((a, b) => b.dias - a.dias)
  if (orden === 'dias_asc')    rowsFil = [...rowsFil].sort((a, b) => a.dias - b.dias)
  if (orden === 'precio_desc') rowsFil = [...rowsFil].sort((a, b) => b.precio - a.precio)
  if (orden === 'precio_asc')  rowsFil = [...rowsFil].sort((a, b) => a.precio - b.precio)

  // ── Alertas tab ───────────────────────────────────────────────
  const paradosMas90  = rows.filter(r => r.dias >= 90).sort((a, b) => b.dias - a.dias)
  const precioP75     = rows.length ? rows.map(r => r.precio).sort((a, b) => a - b)[Math.floor(rows.length * 0.75)] : 0
  const carosParados  = rows.filter(r => r.dias >= 60 && r.precio >= precioP75)
  const margenNeg     = rows.filter(r => r.margen < 0)

  const totalAlertas = paradosMas90.length + carosParados.length + margenNeg.length

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Rotación de Stock</h1>
            <p className="page-caption">Identificá vehículos parados y oportunidades de movimiento</p>
          </div>
        </div>

        {loading ? <p style={{ color: 'var(--c-fg-2)' }}>Cargando…</p> : total === 0 ? (
          <div className="banner info"><Icon name="info" size={16} />No hay vehículos en stock.</div>
        ) : (
          <>
            {/* KPIs */}
            <div className="stats-row" style={{ marginBottom: 20 }}>
              <div className="stat-card">
                <div className="lbl">En stock</div>
                <div className="val">{total}</div>
              </div>
              <div className="stat-card">
                <div className="lbl">Parados &gt;90d</div>
                <div className="val" style={{ color: parados > 0 ? 'var(--c-danger)' : 'inherit' }}>{parados}</div>
              </div>
              <div className="stat-card">
                <div className="lbl">Días promedio</div>
                <div className="val">{diasProm}</div>
              </div>
              <div className="stat-card">
                <div className="lbl">Valor total</div>
                <div className="val">USD {valorTotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
              </div>
              <div className="stat-card">
                <div className="lbl">Margen prom.</div>
                <div className="val" style={{ color: margenProm < 0 ? 'var(--c-danger)' : margenProm < 10 ? 'var(--c-fg-2)' : 'var(--c-success)' }}>
                  {margenProm.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="tabs">
              {[['semaforo', 'chart', 'Semáforo'], ['alertas', 'alert', `Alertas${totalAlertas > 0 ? ` (${totalAlertas})` : ''}`]].map(([k, ic, l]) => (
                <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
                  <Icon name={ic} size={13} />{l}
                </button>
              ))}
            </div>

            {/* ── TAB SEMÁFORO ── */}
            {tab === 'semaforo' && (
              <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {sems.map(s => {
                      const active = filtroSem.includes(s)
                      return (
                        <button key={s} className={`btn ${active ? 'primary' : 'secondary'}`}
                          style={{ fontSize: 12, padding: '4px 10px' }}
                          onClick={() => setFiltroSem(prev => active ? prev.filter(x => x !== s) : [...prev, s])}>
                          {s}
                        </button>
                      )
                    })}
                  </div>
                  <select className="input" style={{ width: 130, marginLeft: 'auto' }} value={orden} onChange={e => setOrden(e.target.value)}>
                    {ORDEN_OPS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>

                {rowsFil.length === 0
                  ? <div className="banner info"><Icon name="info" size={16} />Sin vehículos con el filtro activo.</div>
                  : rowsFil.map(r => (
                    <div key={r.id} className="list-row" style={{ cursor: 'default', background: r.sem.bg, borderLeft: `3px solid ${r.sem.hex}` }}>
                      <div>
                        <div className="v-title">{r.marca} {r.modelo} {r.anio}{r.version ? ` · ${r.version}` : ''}</div>
                        <div className="v-meta">{r.patente || '—'} · #{r.id} · {r.estado?.replace(/_/g, ' ')}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: 18, color: r.sem.hex }}>{r.dias}d</div>
                        <div style={{ fontSize: 11, color: 'var(--c-fg-2)' }}>{r.sem.label}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--c-fg-2)' }}>Precio</div>
                        <div>USD {r.precio.toLocaleString('es-AR')}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--c-fg-2)' }}>ARS</div>
                        <div>$ {(r.precio * TC).toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: 'var(--c-fg-2)' }}>Margen</div>
                        <div style={{ color: r.margen < 0 ? 'var(--c-danger)' : r.margen < 10 ? 'var(--c-fg-2)' : 'var(--c-success)', fontWeight: 600 }}>
                          {r.margen.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))
                }
                <p style={{ color: 'var(--c-fg-3)', fontSize: 12, marginTop: 8 }}>
                  Mostrando {rowsFil.length} de {total} vehículos
                </p>
              </div>
            )}

            {/* ── TAB ALERTAS ── */}
            {tab === 'alertas' && (
              <div>
                {totalAlertas === 0 ? (
                  <div className="banner success"><Icon name="check" size={16} />Todo el stock está rotando bien. Sin alertas activas.</div>
                ) : (
                  <>
                    {paradosMas90.length > 0 && (
                      <div style={{ marginBottom: 20 }}>
                        <div className="banner warning" style={{ marginBottom: 10 }}>
                          <Icon name="alert" size={16} />
                          <strong>{paradosMas90.length} vehículo{paradosMas90.length > 1 ? 's' : ''} parado{paradosMas90.length > 1 ? 's' : ''} más de 90 días</strong>
                        </div>
                        {paradosMas90.map(r => (
                          <div key={r.id} className="list-row" style={{ cursor: 'default', borderLeft: '3px solid var(--c-danger)' }}>
                            <div>
                              <div className="v-title">{r.marca} {r.modelo} {r.anio}</div>
                              <div className="v-meta">#{r.id} · {r.patente || '—'}</div>
                            </div>
                            <div style={{ fontWeight: 700, color: 'var(--c-danger)', fontSize: 18 }}>{r.dias}d</div>
                            <div className="price-cell"><strong>USD {r.precio.toLocaleString('es-AR')}</strong></div>
                            <div style={{ color: r.margen < 0 ? 'var(--c-danger)' : 'var(--c-fg-2)' }}>{r.margen.toFixed(1)}%</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {carosParados.length > 0 && (
                      <div style={{ marginBottom: 20 }}>
                        <div className="banner info" style={{ marginBottom: 10 }}>
                          <Icon name="info" size={16} />
                          <strong>{carosParados.length} vehículo{carosParados.length > 1 ? 's' : ''} caro{carosParados.length > 1 ? 's' : ''} y con más de 60 días</strong> — considerar ajuste de precio
                        </div>
                        {carosParados.map(r => (
                          <div key={r.id} className="list-row" style={{ cursor: 'default', borderLeft: '3px solid var(--c-warning, #e6a817)' }}>
                            <div>
                              <div className="v-title">{r.marca} {r.modelo} {r.anio}</div>
                              <div className="v-meta">#{r.id} · {r.sem.label}</div>
                            </div>
                            <div style={{ color: 'var(--c-fg-2)' }}>{r.dias}d en stock</div>
                            <div className="price-cell"><strong>USD {r.precio.toLocaleString('es-AR')}</strong></div>
                          </div>
                        ))}
                      </div>
                    )}

                    {margenNeg.length > 0 && (
                      <div>
                        <div className="banner warning" style={{ marginBottom: 10 }}>
                          <Icon name="alert" size={16} />
                          <strong>{margenNeg.length} vehículo{margenNeg.length > 1 ? 's' : ''} con margen negativo</strong> — gastos superan el precio de venta
                        </div>
                        {margenNeg.map(r => (
                          <div key={r.id} className="list-row" style={{ cursor: 'default', borderLeft: '3px solid var(--c-danger)' }}>
                            <div>
                              <div className="v-title">{r.marca} {r.modelo} {r.anio}</div>
                              <div className="v-meta">#{r.id}</div>
                            </div>
                            <div className="price-cell"><strong>USD {r.precio.toLocaleString('es-AR')}</strong></div>
                            <div style={{ fontWeight: 700, color: 'var(--c-danger)' }}>{r.margen.toFixed(1)}%</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
