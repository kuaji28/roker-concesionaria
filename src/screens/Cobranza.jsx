import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import Icon from '../components/Icon'
import { getFinanciamientos, getCuotasVencidas, pagarCuota } from '../lib/supabase'

export default function Cobranza({ onLogout }) {
  const [finan, setFinan]     = useState([])
  const [cuotas, setCuotas]   = useState([])
  const [tab, setTab]         = useState('vencidas')
  const [loading, setLoading] = useState(true)
  const [pagando, setPagando] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('todos')

  async function load() {
    const [f, c] = await Promise.all([getFinanciamientos(), getCuotasVencidas()])
    setFinan(f); setCuotas(c); setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handlePagar(cuotaId) {
    setPagando(cuotaId)
    try {
      await pagarCuota(cuotaId)
      await load()
    } finally { setPagando(null) }
  }

  const totalVencido  = cuotas.reduce((s, c) => s + (Number(c.monto) || 0), 0)

  const finanFil = filtroEstado === 'todos'
    ? finan
    : finan.filter(fn => fn.estado === filtroEstado)

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Cobranza</h1>
            <p className="page-caption">Financiamientos y cuotas</p>
          </div>
          {cuotas.length > 0 && (
            <div className="banner warning" style={{ margin: 0 }}>
              <Icon name="alert" size={16} />
              {cuotas.length} cuota{cuotas.length > 1 ? 's' : ''} vencida{cuotas.length > 1 ? 's' : ''}
              {totalVencido > 0 && <> — $ {totalVencido.toLocaleString('es-AR')}</>}
            </div>
          )}
        </div>

        <div className="tabs">
          {[['vencidas', 'alert', cuotas.length > 0 ? `Vencidas (${cuotas.length})` : 'Vencidas'],
            ['todos', 'briefcase', 'Todos los financiamientos']].map(([k, ic, l]) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
              <Icon name={ic} size={13} />{l}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: 'var(--c-fg-2)' }}>Cargando…</p>
        ) : tab === 'vencidas' ? (
          cuotas.length === 0
            ? <div className="banner success"><Icon name="check" size={16} />No hay cuotas vencidas.</div>
            : (
              <>
                <div className="banner warning">
                  <Icon name="cash" size={16} />
                  Total vencido: <strong style={{ marginLeft: 4 }}>$ {totalVencido.toLocaleString('es-AR')}</strong>
                </div>
                {cuotas.map(c => (
                  <div key={c.id} className="list-row" style={{ cursor: 'default' }}>
                    <div>
                      <div className="v-title">{c.financiamientos?.deudor_nombre || '—'}</div>
                      <div className="v-meta">
                        {c.financiamientos?.vehiculos?.marca} {c.financiamientos?.vehiculos?.modelo}
                        {c.numero_cuota && <> · Cuota #{c.numero_cuota}</>}
                      </div>
                    </div>
                    <div style={{ color: 'var(--c-danger)', fontSize: 12 }}>Vence: {c.fecha_vencimiento}</div>
                    <div className="price-cell">
                      <strong>$ {Number(c.monto || 0).toLocaleString('es-AR')}</strong>
                    </div>
                    <div>
                      <span className="badge danger"><span className="cdot" /> Vencida</span>
                    </div>
                    <button
                      className="btn primary"
                      style={{ fontSize: 12, padding: '4px 12px', whiteSpace: 'nowrap' }}
                      disabled={pagando === c.id}
                      onClick={() => handlePagar(c.id)}
                    >
                      {pagando === c.id ? 'Procesando…' : <><Icon name="check" size={13} /> Marcar pagada</>}
                    </button>
                  </div>
                ))}
              </>
            )
        ) : (
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
              : finanFil.map(fn => (
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
        )}
      </div>
    </div>
  )
}
