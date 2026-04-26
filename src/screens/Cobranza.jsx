import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import Icon from '../components/Icon'
import { getFinanciamientos, getCuotasVencidas, getCuotasProximas, pagarCuotaConMetadata, getSeguimientos, updateSeguimiento } from '../lib/supabase'
import { useTc } from '../hooks/useTc'
import { useIsMobile } from '../hooks/useIsMobile'

// Cuota estado badge — handles both 'pagado' (new) and 'pagada' (legacy)
function cuotaEstadoBadge(estado) {
  if (['pagado', 'pagada'].includes(estado)) return { cls: 'success', label: 'Pagada', color: 'var(--c-success)' }
  if (estado === 'pendiente') return { cls: 'warning', label: 'Pendiente', color: '#ca8a04' }
  if (['vencido', 'vencida'].includes(estado)) return { cls: 'danger', label: 'Vencida', color: '#ef4444' }
  return { cls: 'neutral', label: estado || '—', color: 'var(--c-fg-3)' }
}

const FORMAS_COBRO = ['Efectivo', 'Transferencia', 'Efectivo + Transferencia']
const MONEDAS = ['ARS', 'USD']

const URGENCIA = (fechaVenc) => {
  const dias = Math.ceil((new Date(fechaVenc) - new Date()) / 86400000)
  if (dias < 0)   return { label: 'Vencida',       cls: 'danger'  }
  if (dias <= 5)  return { label: `${dias}d`,       cls: 'danger'  }
  if (dias <= 15) return { label: `${dias}d`,       cls: 'warning' }
  return           { label: `${dias}d`,             cls: 'success' }
}

const EMPTY_PAGO = { monto_pagado: '', forma_cobro: 'Efectivo', moneda_cobro: 'ARS', tc_cobro: '', notas_cobro: '' }

function mensajeSeguimientoFinanciamiento(cliente, meses) {
  const nombre = (cliente?.nombre || '').split(' ')[0] || 'Cliente'
  return encodeURIComponent(
    `Hola ${nombre}! 👋\n\n` +
    `Te contactamos desde GH Cars para hacerte un seguimiento.\n` +
    `Han pasado ${meses} meses desde que adquiriste tu vehículo con financiamiento bancario.\n\n` +
    `¿Cómo estás llevando las cuotas? ¿Necesitás ayuda con algo?\n\n` +
    `Quedamos a tu disposición 🙌`
  )
}

function urgenciaSeguimiento(fechaStr) {
  if (!fechaStr) return { label: '—', cls: 'neutral' }
  const hoy = new Date(); hoy.setHours(0,0,0,0)
  const fecha = new Date(fechaStr + 'T00:00:00')
  const dias = Math.ceil((fecha - hoy) / 86400000)
  if (dias < 0)  return { label: 'Vencido',      cls: 'danger'  }
  if (dias === 0) return { label: 'Hoy',          cls: 'warning' }
  if (dias <= 7)  return { label: `${dias}d`,     cls: 'warning' }
  return              { label: `${dias}d`,         cls: 'success' }
}

function mesesDesdeHoy(fechaProgramada) {
  if (!fechaProgramada) return '?'
  const hoy = new Date()
  const f = new Date(fechaProgramada)
  return Math.round((f - hoy) / (1000 * 60 * 60 * 24 * 30)) || 1
}

export default function Cobranza({ onLogout }) {
  const TC = useTc()
  const isMobile = useIsMobile()
  const [finan, setFinan]         = useState([])
  const [vencidas, setVencidas]   = useState([])
  const [proximas, setProximas]   = useState([])
  const [seguimientos, setSeguimientos] = useState([])
  const [tab, setTab]             = useState('vencidas')
  const [loading, setLoading]     = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroSeg, setFiltroSeg] = useState('pendientes')
  const [dias, setDias]           = useState(30)

  // Modal pago
  const [modalCuota, setModalCuota] = useState(null)
  const [pago, setPago]           = useState(EMPTY_PAGO)
  const [pagando, setPagando]     = useState(false)
  const [pagoErr, setPagoErr]     = useState('')

  // Modal contactar seguimiento
  const [modalSeg, setModalSeg]   = useState(null)
  const [notasSeg, setNotasSeg]   = useState('')
  const [guardandoSeg, setGuardandoSeg] = useState(false)
  const [segErr, setSegErr]       = useState('')

  async function load() {
    try {
      const [f, v, p, s] = await Promise.all([
        getFinanciamientos().catch(() => []),
        getCuotasVencidas().catch(() => []),
        getCuotasProximas(dias).catch(() => []),
        getSeguimientos().catch(() => []),
      ])
      setFinan(f); setVencidas(v); setProximas(p); setSeguimientos(s)
    } catch (e) {
      console.error('Cobranza load error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [dias])

  function abrirModal(cuota) {
    setModalCuota(cuota)
    setPago({ ...EMPTY_PAGO, monto_pagado: cuota.monto || '', tc_cobro: TC || '' })
    setPagoErr('')
  }

  async function confirmarPago() {
    if (!pago.forma_cobro) { setPagoErr('Seleccioná forma de cobro'); return }
    setPagando(true)
    try {
      await pagarCuotaConMetadata(modalCuota.id, {
        monto_pagado:  pago.monto_pagado  ? Number(pago.monto_pagado)  : undefined,
        forma_cobro:   pago.forma_cobro   || undefined,
        moneda_cobro:  pago.moneda_cobro  || undefined,
        tc_cobro:      pago.tc_cobro      ? Number(pago.tc_cobro)      : undefined,
        notas_cobro:   pago.notas_cobro   || undefined,
      })
      setModalCuota(null)
      await load()
    } catch (e) {
      setPagoErr(e.message || 'Error al registrar pago')
    } finally {
      setPagando(false)
    }
  }

  async function abrirModalSeg(seg) {
    setModalSeg(seg)
    setNotasSeg('')
    setSegErr('')
  }

  async function confirmarContacto() {
    setGuardandoSeg(true)
    try {
      await updateSeguimiento(modalSeg.id, {
        estado: 'contactado',
        fecha_contacto: new Date().toISOString().split('T')[0],
        notas: notasSeg || undefined,
      })
      setModalSeg(null)
      const s = await getSeguimientos()
      setSeguimientos(s)
    } catch (e) {
      setSegErr(e.message || 'Error al guardar')
    } finally {
      setGuardandoSeg(false)
    }
  }

  const totalVencido  = vencidas.reduce((s, c) => s + (Number(c.monto) || 0), 0)
  const totalProximo  = proximas.reduce((s, c) => s + (Number(c.monto) || 0), 0)
  const finanFil = filtroEstado === 'todos' ? finan : finan.filter(fn => fn.estado === filtroEstado)

  const hoy = new Date(); hoy.setHours(0,0,0,0)
  const finSemana = new Date(hoy); finSemana.setDate(finSemana.getDate() + 7)
  const segFiltrados = seguimientos.filter(s => {
    if (filtroSeg === 'pendientes') return s.estado === 'pendiente'
    if (filtroSeg === 'semana') {
      const f = new Date(s.fecha_programada + 'T00:00:00')
      return s.estado === 'pendiente' && f >= hoy && f <= finSemana
    }
    return true
  })
  const segPendientesHoy = seguimientos.filter(s => {
    const f = new Date((s.fecha_programada || '') + 'T00:00:00')
    return s.estado === 'pendiente' && f <= hoy
  }).length

  const CuotaRow = ({ c, badge }) => isMobile ? (
    <div className="card" style={{ padding: '12px 14px', marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{c.financiamientos?.deudor_nombre || '—'}</div>
          <div style={{ fontSize: 11, color: 'var(--c-fg-3)' }}>
            {c.financiamientos?.vehiculos?.marca} {c.financiamientos?.vehiculos?.modelo}
            {c.numero_cuota && ` · Cuota #${c.numero_cuota}`}
          </div>
        </div>
        <span className={`badge ${badge.cls}`}><span className="cdot" /> {badge.label}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--c-fg-2)' }}>Vence: {c.fecha_vencimiento}</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>$ {Number(c.monto || 0).toLocaleString('es-AR')}</div>
        </div>
        <button className="btn primary" style={{ fontSize: 12, padding: '6px 12px', whiteSpace: 'nowrap' }} onClick={() => abrirModal(c)}>
          <Icon name="check" size={13} /> Pagar
        </button>
      </div>
    </div>
  ) : (
    <div className="list-row" style={{ cursor: 'default' }}>
      <div>
        <div className="v-title">{c.financiamientos?.deudor_nombre || '—'}</div>
        <div className="v-meta">
          {c.financiamientos?.vehiculos?.marca} {c.financiamientos?.vehiculos?.modelo}
          {c.numero_cuota && <> · Cuota #{c.numero_cuota}</>}
        </div>
      </div>
      <div style={{ color: 'var(--c-fg-2)', fontSize: 12 }}>Vence: {c.fecha_vencimiento}</div>
      <div className="price-cell">
        <strong>$ {Number(c.monto || 0).toLocaleString('es-AR')}</strong>
      </div>
      <div>
        <span className={`badge ${badge.cls}`}><span className="cdot" /> {badge.label}</span>
      </div>
      <button
        className="btn primary"
        style={{ fontSize: 12, padding: '4px 12px', whiteSpace: 'nowrap' }}
        onClick={() => abrirModal(c)}
      >
        <Icon name="check" size={13} /> Marcar pagada
      </button>
    </div>
  )

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Cobranza</h1>
            <p className="page-caption">Financiamientos y cuotas</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {vencidas.length > 0 && (
              <div className="banner warning" style={{ margin: 0 }}>
                <Icon name="alert" size={16} />
                {vencidas.length} vencida{vencidas.length > 1 ? 's' : ''} · $ {totalVencido.toLocaleString('es-AR')}
              </div>
            )}
            {proximas.length > 0 && (
              <div className="banner info" style={{ margin: 0 }}>
                <Icon name="cash" size={16} />
                {proximas.length} próxima{proximas.length > 1 ? 's' : ''} · $ {totalProximo.toLocaleString('es-AR')}
              </div>
            )}
          </div>
        </div>

        <div className="tabs">
          {[
            ['vencidas',      'alert',     vencidas.length > 0 ? `Vencidas (${vencidas.length})` : 'Vencidas'],
            ['proximas',      'cash',      proximas.length > 0 ? `Próximas (${proximas.length})` : 'Próximas'],
            ['todos',         'briefcase', 'Financiamientos'],
            ['seguimientos',  'cal',       segPendientesHoy > 0 ? `Seguimientos (${segPendientesHoy})` : 'Seguimientos'],
          ].map(([k, ic, l]) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
              <Icon name={ic} size={13} />{l}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: 'var(--c-fg-2)' }}>Cargando…</p>
        ) : tab === 'vencidas' ? (
          vencidas.length === 0
            ? <div className="banner success"><Icon name="check" size={16} />No hay cuotas vencidas.</div>
            : vencidas.map(c => <CuotaRow key={c.id} c={c} badge={{ cls: 'danger', label: 'Vencida' }} />)

        ) : tab === 'proximas' ? (
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
              <span style={{ color: 'var(--c-fg-2)', fontSize: 13 }}>Próximos</span>
              <select className="input" style={{ width: 100 }} value={dias} onChange={e => setDias(Number(e.target.value))}>
                {[7, 15, 30, 60].map(d => <option key={d} value={d}>{d} días</option>)}
              </select>
            </div>
            {proximas.length === 0
              ? <div className="banner success"><Icon name="check" size={16} />Sin cuotas próximas a vencer.</div>
              : proximas.map(c => <CuotaRow key={c.id} c={c} badge={URGENCIA(c.fecha_vencimiento)} />)
            }
          </div>

        ) : tab === 'todos' ? (
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
              <select className="input" style={{ width: 180 }} value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
                <option value="todos">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="vencido">Vencido</option>
                <option value="cancelado">Cancelado</option>
                <option value="pagado">Pagado</option>
              </select>
              <span style={{ color: 'var(--c-fg-2)', fontSize: 13 }}>{finanFil.length} financiamiento{finanFil.length !== 1 ? 's' : ''}</span>
            </div>
            {finanFil.length === 0
              ? <div className="banner info"><Icon name="info" size={16} />No hay financiamientos con ese filtro.</div>
              : finanFil.map(fn => isMobile ? (
                <div key={fn.id} className="card" style={{ padding: '12px 14px', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{fn.deudor_nombre || '—'}</div>
                      <div style={{ fontSize: 11, color: 'var(--c-fg-3)' }}>
                        {fn.vehiculos?.marca} {fn.vehiculos?.modelo} {fn.vehiculos?.anio}
                        {fn.deudor_telefono && ` · ${fn.deudor_telefono}`}
                      </div>
                    </div>
                    <span className={`badge ${fn.estado === 'activo' ? 'success' : fn.estado === 'vencido' ? 'danger' : 'neutral'}`}>
                      <span className="cdot" /> {fn.estado || 'activo'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                    <div><span style={{ color: 'var(--c-fg-2)', fontSize: 11 }}>Total: </span>$ {Number(fn.monto_total || 0).toLocaleString('es-AR')}</div>
                    <div><span style={{ color: 'var(--c-fg-2)', fontSize: 11 }}>Cuotas: </span>{fn.cantidad_cuotas || '—'}</div>
                  </div>
                </div>
              ) : (
                <div key={fn.id} className="list-row" style={{ cursor: 'default' }}>
                  <div>
                    <div className="v-title">{fn.deudor_nombre || '—'}</div>
                    <div className="v-meta">
                      {fn.vehiculos?.marca} {fn.vehiculos?.modelo} {fn.vehiculos?.anio}
                      {fn.deudor_telefono && <> · {fn.deudor_telefono}</>}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--c-fg-2)' }}>Total</div>
                    <div>$ {Number(fn.monto_total || 0).toLocaleString('es-AR')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--c-fg-2)' }}>Cuotas</div>
                    <div>{fn.cantidad_cuotas || '—'}</div>
                  </div>
                  <div>
                    <span className={`badge ${fn.estado === 'activo' ? 'success' : fn.estado === 'vencido' ? 'danger' : 'neutral'}`}>
                      <span className="cdot" /> {fn.estado || 'activo'}
                    </span>
                  </div>
                </div>
              ))
            }
          </div>

        ) : (
          /* ── Tab Seguimientos ── */
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
              {[
                ['todos',      'Todos'],
                ['pendientes', 'Pendientes'],
                ['semana',     'Esta semana'],
              ].map(([v, l]) => (
                <button
                  key={v}
                  className={`btn ${filtroSeg === v ? 'primary' : 'ghost'}`}
                  style={{ fontSize: 12, padding: '4px 12px' }}
                  onClick={() => setFiltroSeg(v)}
                >{l}</button>
              ))}
              <span style={{ color: 'var(--c-fg-2)', fontSize: 13, marginLeft: 4 }}>
                {segFiltrados.length} seguimiento{segFiltrados.length !== 1 ? 's' : ''}
              </span>
            </div>

            {segFiltrados.length === 0 ? (
              <div className="banner success"><Icon name="check" size={16} />No hay seguimientos con ese filtro.</div>
            ) : segFiltrados.map(seg => {
              const urgencia = urgenciaSeguimiento(seg.fecha_programada)
              const tel = seg.cliente?.telefono || ''
              const telLimpio = tel.replace(/\D/g, '')
              const meses = mesesDesdeHoy(seg.fecha_programada)
              const waMsg = mensajeSeguimientoFinanciamiento(seg.cliente, meses)
              const waUrl = `https://wa.me/${telLimpio}?text=${waMsg}`

              return (
                <div key={seg.id} className="list-row" style={{ cursor: 'default' }}>
                  <div style={{ flex: 1 }}>
                    <div className="v-title">{seg.cliente?.nombre || '—'}</div>
                    <div className="v-meta">
                      {tel && <>{tel} · </>}
                      {seg.tipo} · {seg.canal}
                      {seg.vendedor?.nombre && <> · {seg.vendedor.nombre}</>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 90 }}>
                    <div style={{ fontSize: 11, color: 'var(--c-fg-2)' }}>Programado</div>
                    <div style={{ fontSize: 13 }}>{seg.fecha_programada || '—'}</div>
                  </div>
                  <div>
                    <span className={`badge ${urgencia.cls}`}>
                      <span className="cdot" /> {urgencia.label}
                    </span>
                  </div>
                  <div>
                    <span className={`badge ${seg.estado === 'contactado' ? 'success' : seg.estado === 'pendiente' ? 'warning' : 'neutral'}`}>
                      <span className="cdot" /> {seg.estado}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {telLimpio && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn ghost"
                        style={{ fontSize: 12, padding: '4px 10px', textDecoration: 'none' }}
                      >
                        <Icon name="message" size={13} /> WA
                      </a>
                    )}
                    {seg.estado === 'pendiente' && (
                      <button
                        className="btn primary"
                        style={{ fontSize: 12, padding: '4px 12px', whiteSpace: 'nowrap' }}
                        onClick={() => abrirModalSeg(seg)}
                      >
                        <Icon name="check" size={13} /> Contactado
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Modal marcar contactado ── */}
      {modalSeg && (
        <div className="modal-overlay" onClick={() => setModalSeg(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-head">
              <h3>Marcar como contactado</h3>
              <button className="btn ghost" onClick={() => setModalSeg(null)}><Icon name="close" size={16} /></button>
            </div>
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: 'var(--c-bg-2)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
                <strong>{modalSeg.cliente?.nombre || '—'}</strong>
                <span style={{ color: 'var(--c-fg-2)', marginLeft: 8 }}>
                  {modalSeg.tipo} · {modalSeg.fecha_programada}
                </span>
              </div>
              <label style={{ fontSize: 12, color: 'var(--c-fg-2)' }}>
                Notas del contacto (opcional)
                <textarea
                  className="input"
                  style={{ marginTop: 4, minHeight: 80, resize: 'vertical' }}
                  value={notasSeg}
                  onChange={e => setNotasSeg(e.target.value)}
                  placeholder="¿Cómo fue el contacto? ¿Algún dato importante?"
                />
              </label>
              {segErr && <div className="banner danger"><Icon name="alert" size={14} />{segErr}</div>}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="btn ghost" onClick={() => setModalSeg(null)}>Cancelar</button>
                <button className="btn primary" disabled={guardandoSeg} onClick={confirmarContacto}>
                  {guardandoSeg ? 'Guardando…' : <><Icon name="check" size={14} /> Confirmar contacto</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal registrar pago ── */}
      {modalCuota && (
        <div className="modal-overlay" onClick={() => setModalCuota(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-head">
              <h3>Registrar cobro</h3>
              <button className="btn ghost" onClick={() => setModalCuota(null)}><Icon name="close" size={16} /></button>
            </div>
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: 'var(--c-bg-2)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
                <strong>{modalCuota.financiamientos?.deudor_nombre}</strong>
                <span style={{ color: 'var(--c-fg-2)', marginLeft: 8 }}>
                  {modalCuota.financiamientos?.vehiculos?.marca} {modalCuota.financiamientos?.vehiculos?.modelo}
                  {modalCuota.numero_cuota && ` · Cuota #${modalCuota.numero_cuota}`}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label style={{ fontSize: 12, color: 'var(--c-fg-2)' }}>
                  Monto cobrado
                  <input className="input" style={{ marginTop: 4 }} type="number" value={pago.monto_pagado}
                    onChange={e => setPago(p => ({ ...p, monto_pagado: e.target.value }))} />
                </label>
                <label style={{ fontSize: 12, color: 'var(--c-fg-2)' }}>
                  Moneda
                  <select className="input" style={{ marginTop: 4 }} value={pago.moneda_cobro}
                    onChange={e => setPago(p => ({ ...p, moneda_cobro: e.target.value }))}>
                    {MONEDAS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </label>
                <label style={{ fontSize: 12, color: 'var(--c-fg-2)', gridColumn: '1 / -1' }}>
                  Forma de cobro
                  <select className="input" style={{ marginTop: 4 }} value={pago.forma_cobro}
                    onChange={e => setPago(p => ({ ...p, forma_cobro: e.target.value }))}>
                    {FORMAS_COBRO.map(f => <option key={f}>{f}</option>)}
                  </select>
                </label>
                {pago.moneda_cobro === 'USD' && (
                  <label style={{ fontSize: 12, color: 'var(--c-fg-2)', gridColumn: '1 / -1' }}>
                    TC aplicado
                    <input className="input" style={{ marginTop: 4 }} type="number" value={pago.tc_cobro}
                      onChange={e => setPago(p => ({ ...p, tc_cobro: e.target.value }))} />
                  </label>
                )}
                <label style={{ fontSize: 12, color: 'var(--c-fg-2)', gridColumn: '1 / -1' }}>
                  Notas (opcional)
                  <input className="input" style={{ marginTop: 4 }} value={pago.notas_cobro}
                    onChange={e => setPago(p => ({ ...p, notas_cobro: e.target.value }))} />
                </label>
              </div>
              {pagoErr && <div className="banner danger"><Icon name="alert" size={14} />{pagoErr}</div>}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="btn ghost" onClick={() => setModalCuota(null)}>Cancelar</button>
                <button className="btn primary" disabled={pagando} onClick={confirmarPago}>
                  {pagando ? 'Guardando…' : <><Icon name="check" size={14} /> Confirmar pago</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
