import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import Icon from '../components/Icon'
import FormField from '../components/FormField'
import Modal from '../components/Modal'
import { getGastosGlobal, getVehiculosConCostos, getVentas, createGasto } from '../lib/supabase'
import { useTc } from '../hooks/useTc'

const TIPOS_GASTO = {
  mecanica:      'Mecánica / Motor',
  chapa_pintura: 'Chapa y Pintura',
  detailing:     'Detailing / Limpieza',
  documentacion: 'Documentación',
  neumaticos:    'Neumáticos',
  electrica:     'Eléctrica',
  gnc:           'GNC',
  otro:          'Otro',
}

const hoy = new Date().toISOString().split('T')[0]
const hace90 = new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0]

export default function Gastos({ onLogout }) {
  const TC = useTc()
  const [tab, setTab] = useState('margen')

  const [vehiculos, setVehiculos] = useState([])
  const [gastos, setGastos]       = useState([])
  const [ventas, setVentas]       = useState([])
  const [loading, setLoading]     = useState(true)

  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroDesde, setFiltroDesde]   = useState(hace90)
  const [filtroHasta, setFiltroHasta]   = useState(hoy)
  const [filtroTipo, setFiltroTipo]     = useState('todos')

  const [showForm, setShowForm]   = useState(false)
  const [saving, setSaving]       = useState(false)
  const EMPTY = { vehiculo_id: '', tipo: 'mecanica', descripcion: '', monto: '', moneda: 'ARS', proveedor: '', fecha_gasto: hoy }
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    Promise.all([
      getVehiculosConCostos(),
      getGastosGlobal(),
      getVentas(),
    ]).then(([v, g, vt]) => { setVehiculos(v); setGastos(g); setVentas(vt); setLoading(false) })
  }, [])

  // ── Margen tab data ───────────────────────────────────────────
  const ventasIdx = Object.fromEntries((ventas || []).map(v => [v.vehiculo_id, v]))

  const filas = vehiculos.map(v => {
    const gastosV     = gastos.filter(g => g.vehiculo_id === v.id)
    const gARS        = gastosV.filter(g => g.moneda === 'ARS').reduce((s, g) => s + Number(g.monto || 0), 0)
    const gUSD        = gastosV.filter(g => g.moneda === 'USD').reduce((s, g) => s + Number(g.monto || 0), 0)
    const gastosUSD   = gUSD + (TC > 0 ? gARS / TC : 0)
    const costoCompra = v.costo_compra || v.precio_base || 0
    const costoTotal  = costoCompra + gastosUSD
    const vta         = ventasIdx[v.id]
    const precioVenta = vta ? Number(vta.precio_final || 0) : null
    const margenUSD   = vta && precioVenta && costoTotal ? precioVenta - costoTotal : null
    const margenPct   = margenUSD !== null && costoTotal > 0 ? (margenUSD / costoTotal) * 100 : null
    return { v, gastosUSD, costoCompra, costoTotal, precioVenta, margenUSD, margenPct, tieneVenta: !!vta }
  })

  const filasFil = filtroEstado === 'todos' ? filas : filas.filter(f => f.v.estado === filtroEstado)
  const vendidos = filas.filter(f => f.v.estado === 'vendido' && f.margenUSD !== null)
  const totalMargen = vendidos.reduce((s, f) => s + f.margenUSD, 0)
  const promMargen  = vendidos.length ? totalMargen / vendidos.length : 0
  const promPct     = vendidos.length ? vendidos.reduce((s, f) => s + (f.margenPct || 0), 0) / vendidos.length : 0

  // ── Gastos tab data ───────────────────────────────────────────
  const gastosFil = gastos.filter(g => {
    if (g.fecha_gasto < filtroDesde || g.fecha_gasto > filtroHasta) return false
    if (filtroTipo !== 'todos' && g.tipo !== filtroTipo) return false
    return true
  })
  const totARS    = gastosFil.filter(g => g.moneda === 'ARS').reduce((s, g) => s + Number(g.monto || 0), 0)
  const totUSD    = gastosFil.filter(g => g.moneda === 'USD').reduce((s, g) => s + Number(g.monto || 0), 0)
  const totEquiv  = totUSD + (TC > 0 ? totARS / TC : 0)

  const vehiculosIdx = Object.fromEntries(vehiculos.map(v => [v.id, v]))

  // ── Handlers ─────────────────────────────────────────────────
  const ff = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  async function submitGasto() {
    if (!form.vehiculo_id || !form.monto || Number(form.monto) <= 0) return
    setSaving(true)
    try {
      await createGasto({ ...form, vehiculo_id: Number(form.vehiculo_id), monto: Number(form.monto) })
      const [v, g] = await Promise.all([getVehiculosConCostos(), getGastosGlobal()])
      setVehiculos(v); setGastos(g)
      setShowForm(false)
      setForm(EMPTY)
    } finally { setSaving(false) }
  }

  function margenColor(v) {
    if (v === null || v === undefined) return 'var(--c-fg-3)'
    if (v < 0) return 'var(--c-danger)'
    if (v < 500) return 'var(--c-warning, #e6a817)'
    return 'var(--c-success)'
  }

  const ESTADOS = ['disponible', 'señado', 'en_revision', 'en_preparacion', 'vendido']

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Gastos y Margen</h1>
            <p className="page-caption">Análisis de rentabilidad por vehículo</p>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn primary" onClick={() => setShowForm(true)}>
            <Icon name="plus" size={14} /> Registrar gasto
          </button>
        </div>

        {loading ? <p style={{ color: 'var(--c-fg-2)' }}>Cargando…</p> : (
          <>
            <div className="tabs">
              {[['margen', 'chart', 'Margen por vehículo'], ['gastos', 'cash', 'Historial de gastos']].map(([k, ic, l]) => (
                <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
                  <Icon name={ic} size={13} />{l}
                </button>
              ))}
            </div>

            {/* ── TAB: MARGEN ── */}
            {tab === 'margen' && (
              <div>
                {vendidos.length > 0 && (
                  <div className="stats-row" style={{ marginBottom: 16 }}>
                    <div className="stat-card">
                      <div className="lbl">Vendidos con datos</div>
                      <div className="val">{vendidos.length}</div>
                    </div>
                    <div className="stat-card">
                      <div className="lbl">Margen total</div>
                      <div className="val" style={{ color: margenColor(totalMargen) }}>USD {totalMargen.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
                    </div>
                    <div className="stat-card">
                      <div className="lbl">Margen promedio</div>
                      <div className="val" style={{ color: margenColor(promMargen) }}>USD {promMargen.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
                    </div>
                    <div className="stat-card">
                      <div className="lbl">Margen % prom.</div>
                      <div className="val" style={{ color: margenColor(promPct) }}>{promPct.toFixed(1)}%</div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
                  <select className="input" style={{ width: 160 }} value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
                    <option value="todos">Todos los estados</option>
                    {ESTADOS.map(e => <option key={e} value={e}>{e.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>

                {filasFil.length === 0
                  ? <div className="banner info"><Icon name="info" size={16} />Sin vehículos con ese filtro.</div>
                  : filasFil.map(({ v, gastosUSD, costoCompra, costoTotal, precioVenta, margenUSD, margenPct }) => (
                    <div key={v.id} className="list-row" style={{ cursor: 'default', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
                      <div>
                        <div className="v-title">#{v.id} {v.marca} {v.modelo} {v.anio}</div>
                        <div className="v-meta" style={{ textTransform: 'capitalize' }}>{v.estado?.replace(/_/g, ' ')}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--c-fg-2)' }}>Costo compra</div>
                        <div style={{ fontSize: 13 }}>{costoCompra ? `USD ${costoCompra.toLocaleString('es-AR', { maximumFractionDigits: 0 })}` : '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--c-fg-2)' }}>Gastos</div>
                        <div style={{ fontSize: 13 }}>{gastosUSD > 0 ? `USD ${gastosUSD.toLocaleString('es-AR', { maximumFractionDigits: 0 })}` : '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--c-fg-2)' }}>Precio venta</div>
                        <div style={{ fontSize: 13 }}>
                          {precioVenta
                            ? `USD ${precioVenta.toLocaleString('es-AR')}`
                            : <span style={{ color: 'var(--c-fg-3)', fontStyle: 'italic' }}>A la venta</span>
                          }
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: 'var(--c-fg-2)' }}>Margen</div>
                        <div style={{ fontWeight: 600, color: margenColor(margenUSD) }}>
                          {margenUSD !== null ? `USD ${margenUSD.toLocaleString('es-AR', { maximumFractionDigits: 0 })}` : '—'}
                          {margenPct !== null && <span style={{ fontSize: 11, marginLeft: 4 }}>({margenPct.toFixed(1)}%)</span>}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}

            {/* ── TAB: HISTORIAL ── */}
            {tab === 'gastos' && (
              <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <FormField label="Desde">
                    <input className="input" type="date" value={filtroDesde} onChange={e => setFiltroDesde(e.target.value)} style={{ width: 150 }} />
                  </FormField>
                  <FormField label="Hasta">
                    <input className="input" type="date" value={filtroHasta} onChange={e => setFiltroHasta(e.target.value)} style={{ width: 150 }} />
                  </FormField>
                  <FormField label="Tipo">
                    <select className="input" style={{ width: 180 }} value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
                      <option value="todos">Todos los tipos</option>
                      {Object.entries(TIPOS_GASTO).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                    </select>
                  </FormField>
                </div>

                {gastosFil.length > 0 && (
                  <div className="stats-row" style={{ marginBottom: 16 }}>
                    <div className="stat-card"><div className="lbl">Gastos</div><div className="val">{gastosFil.length}</div></div>
                    {totARS > 0 && <div className="stat-card"><div className="lbl">Total ARS</div><div className="val">$ {totARS.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div></div>}
                    {totUSD > 0 && <div className="stat-card"><div className="lbl">Total USD</div><div className="val">USD {totUSD.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div></div>}
                    <div className="stat-card"><div className="lbl">Equiv. USD</div><div className="val">USD {totEquiv.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div></div>
                  </div>
                )}

                {gastosFil.length === 0
                  ? <div className="banner info"><Icon name="info" size={16} />Sin gastos en el período seleccionado.</div>
                  : gastosFil.map(g => {
                    const veh = vehiculosIdx[g.vehiculo_id]
                    return (
                      <div key={g.id} className="list-row" style={{ cursor: 'default' }}>
                        <div>
                          <div className="v-title">{TIPOS_GASTO[g.tipo] || g.tipo}</div>
                          <div className="v-meta">
                            {veh ? `#${veh.id} ${veh.marca} ${veh.modelo} ${veh.anio}` : `Vehículo #${g.vehiculo_id}`}
                            {g.descripcion ? ` · ${g.descripcion}` : ''}
                            {g.proveedor ? ` · ${g.proveedor}` : ''}
                          </div>
                        </div>
                        <div style={{ color: 'var(--c-fg-2)', fontSize: 12 }}>{g.fecha_gasto}</div>
                        <div className="price-cell">
                          <strong>{g.moneda} {Number(g.monto || 0).toLocaleString('es-AR')}</strong>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            )}
          </>
        )}

        {/* ── Form Modal ── */}
        {showForm && (
          <Modal title="Registrar gasto" onClose={() => setShowForm(false)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Vehículo" required style={{ gridColumn: '1/-1' }}>
                <select className="input" value={form.vehiculo_id} onChange={ff('vehiculo_id')}>
                  <option value="">Seleccionar vehículo…</option>
                  {vehiculos.map(v => (
                    <option key={v.id} value={v.id}>#{v.id} — {v.marca} {v.modelo} {v.anio} [{v.estado}]</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Tipo de gasto">
                <select className="input" value={form.tipo} onChange={ff('tipo')}>
                  {Object.entries(TIPOS_GASTO).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </FormField>
              <FormField label="Proveedor / Taller">
                <input className="input" value={form.proveedor} onChange={ff('proveedor')} placeholder="Taller El Turco…" />
              </FormField>
              <FormField label="Descripción" style={{ gridColumn: '1/-1' }}>
                <input className="input" value={form.descripcion} onChange={ff('descripcion')} placeholder="Aceite + filtros, 2 cubiertas…" />
              </FormField>
              <FormField label="Monto" required>
                <input className="input" type="number" value={form.monto} onChange={ff('monto')} min={0} />
              </FormField>
              <FormField label="Moneda">
                <select className="input" value={form.moneda} onChange={ff('moneda')}>
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                </select>
              </FormField>
              <FormField label="Fecha">
                <input className="input" type="date" value={form.fecha_gasto} onChange={ff('fecha_gasto')} />
              </FormField>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn secondary" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="btn primary" onClick={submitGasto} disabled={saving || !form.vehiculo_id || !form.monto}>
                {saving ? 'Guardando…' : <><Icon name="check" size={14} /> Guardar gasto</>}
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}
