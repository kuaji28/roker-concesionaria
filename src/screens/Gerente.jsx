import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import Icon from '../components/Icon'
import { supabase, getStats, getVentas, getVendedores } from '../lib/supabase'

async function getKPIsMes() {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  const [{ data: ventasMes }, { data: vehiculosDisp }, { data: leadsActivos }] = await Promise.all([
    supabase.from('con_ventas').select('precio_final').gte('fecha_venta', firstDay),
    supabase.from('vehiculos').select('id').eq('estado', 'disponible'),
    supabase.from('prospectos').select('id').not('etapa', 'in', '("cerrado_ganado","cerrado_perdido")'),
  ])

  const countVentas  = (ventasMes || []).length
  const ingresoUSD   = (ventasMes || []).reduce((s, v) => s + (Number(v.precio_final) || 0), 0)
  const stockDisp    = (vehiculosDisp || []).length
  const leadsCount   = (leadsActivos || []).length

  return { countVentas, ingresoUSD, stockDisp, leadsCount }
}

export default function Gerente({ onLogout }) {
  const [stats, setStats]         = useState(null)
  const [ventas, setVentas]       = useState([])
  const [vendedores, setVendedores] = useState([])
  const [kpis, setKpis]           = useState(null)

  useEffect(() => {
    getStats().then(setStats)
    getVentas().then(setVentas)
    getVendedores().then(setVendedores)
    getKPIsMes().then(setKpis)
  }, [])

  const ranking = vendedores.map(vend => {
    const vv = ventas.filter(v => v.vendedor_id === vend.id)
    return { ...vend, total: vv.length, volumen: vv.reduce((s, v) => s + (Number(v.precio_final) || 0), 0) }
  }).filter(v => v.total > 0).sort((a, b) => b.total - a.total)

  const recentVentas = ventas.slice(0, 8)

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Dashboard Gerente</h1>
            <p className="page-caption">Vista ejecutiva del negocio</p>
          </div>
        </div>

        <h2 className="section-title">KPIs del mes</h2>
        <div className="metric-grid">
          <div className="mc" style={{ cursor: 'default' }}>
            <div className="ribbon g" />
            <div className="lbl"><Icon name="cash" size={14} />Ventas del mes</div>
            <div className="val g">{kpis ? kpis.countVentas : '—'}</div>
            <div style={{ fontSize: 11, color: 'var(--c-fg-3)', marginTop: 2 }}>vehículos vendidos</div>
          </div>
          <div className="mc" style={{ cursor: 'default' }}>
            <div className="ribbon g" />
            <div className="lbl"><Icon name="chart" size={14} />Ingresos del mes</div>
            <div className="val g" style={{ fontSize: kpis && kpis.ingresoUSD > 0 ? 18 : undefined }}>
              {kpis ? `USD ${kpis.ingresoUSD.toLocaleString('es-AR')}` : '—'}
            </div>
          </div>
          <div className="mc" style={{ cursor: 'default' }}>
            <div className="ribbon b" />
            <div className="lbl"><Icon name="car" size={14} />Stock disponible</div>
            <div className="val b">{kpis ? kpis.stockDisp : '—'}</div>
            <div style={{ fontSize: 11, color: 'var(--c-fg-3)', marginTop: 2 }}>unidades</div>
          </div>
          <div className="mc" style={{ cursor: 'default' }}>
            <div className="ribbon o" />
            <div className="lbl"><Icon name="users" size={14} />Leads activos</div>
            <div className="val o">{kpis ? kpis.leadsCount : '—'}</div>
            <div style={{ fontSize: 11, color: 'var(--c-fg-3)', marginTop: 2 }}>en seguimiento</div>
          </div>
        </div>

        <h2 className="section-title" style={{ marginTop: 28 }}>Estado del stock</h2>
        <div className="metric-grid">
          <div className="mc" style={{ cursor: 'default' }}>
            <div className="ribbon g" />
            <div className="lbl"><Icon name="check" size={14} />Disponibles</div>
            <div className="val g">{stats?.disponible ?? '—'}</div>
          </div>
          <div className="mc" style={{ cursor: 'default' }}>
            <div className="ribbon o" />
            <div className="lbl">Señados</div>
            <div className="val o">{stats?.seniado ?? '—'}</div>
          </div>
          <div className="mc" style={{ cursor: 'default' }}>
            <div className="ribbon b" />
            <div className="lbl"><Icon name="eye" size={14} />En revisión</div>
            <div className="val b">{stats?.en_revision ?? '—'}</div>
          </div>
          <div className="mc" style={{ cursor: 'default' }}>
            <div className="ribbon r" />
            <div className="lbl">Vendidos</div>
            <div className="val r">{stats?.vendido ?? '—'}</div>
          </div>
        </div>

        <h2 className="section-title" style={{ marginTop: 28 }}>
          Ranking vendedores
          <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--c-fg-3)', marginLeft: 8 }}>Ranking histórico acumulado</span>
        </h2>
        {ranking.length > 0 ? (
          <table className="rank">
            <thead>
              <tr>
                <th>#</th>
                <th>Vendedor</th>
                <th className="num">Ventas</th>
                <th className="num">Volumen USD</th>
                <th style={{ width: 140 }}>Progreso</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((v, i) => (
                <tr key={v.id}>
                  <td><strong>{i + 1}</strong></td>
                  <td><strong>{v.nombre}</strong></td>
                  <td className="num">{v.total}</td>
                  <td className="num">USD {v.volumen.toLocaleString('es-AR')}</td>
                  <td>
                    <div className="bar-wrap">
                      <div className="bar-fill" style={{ width: `${(v.total / ranking[0].total) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="card" style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--c-fg-2)' }}>
            <Icon name="users" size={28} style={{ stroke: 'var(--c-fg-3)', marginBottom: 8 }} />
            <div style={{ marginTop: 8, fontSize: 13 }}>Todavía no hay ventas registradas para mostrar el ranking.</div>
          </div>
        )}

        <h2 className="section-title" style={{ marginTop: 28 }}>Últimas ventas</h2>
        {recentVentas.length > 0 ? (
          <table className="rank">
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Comprador</th>
                <th>Vendedor</th>
                <th className="num">Precio</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentVentas.map(v => (
                <tr key={v.id}>
                  <td><strong>{v.vehiculos?.marca} {v.vehiculos?.modelo} {v.vehiculos?.anio}</strong></td>
                  <td>{v.comprador_nombre || '—'}</td>
                  <td>{v.vendedores?.nombre || '—'}</td>
                  <td className="num">{v.moneda_precio || 'USD'} {Number(v.precio_final).toLocaleString('es-AR')}</td>
                  <td style={{ color: 'var(--c-fg-2)', fontSize: 12 }}>{v.fecha_venta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="card" style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--c-fg-2)' }}>
            <Icon name="cash" size={28} style={{ stroke: 'var(--c-fg-3)', marginBottom: 8 }} />
            <div style={{ marginTop: 8, fontSize: 13 }}>Todavía no hay ventas registradas.</div>
          </div>
        )}
      </div>
    </div>
  )
}
