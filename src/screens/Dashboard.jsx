import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import MetricCard from '../components/MetricCard'
import Icon from '../components/Icon'
import AlertasWidget from '../components/AlertasWidget'
import Sparkline from '../components/Sparkline'
import { getStats, getVehiculos, getVentas } from '../lib/supabase'
import { useTc } from '../hooks/useTc'

function QuickAction({ icon, title, desc, cta, to }) {
  const navigate = useNavigate()
  return (
    <div className="qa" onClick={() => navigate(to)}>
      <div className="qa-ico"><Icon name={icon} size={18} /></div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <a>{cta} →</a>
    </div>
  )
}

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate()
  const TC = useTc()
  const [stats, setStats] = useState(null)
  const [vehiculos, setVehiculos] = useState([])
  const [ventasMes, setVentasMes] = useState(null)
  const [ventasDelta, setVentasDelta] = useState(null)
  const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })

  const [recentActivity] = useState([
    { icon: '💚', text: 'Venta cerrada — Ford Ranger 2022', time: 'hace 2h', user: 'Marcos', color: '#22c55e' },
    { icon: '🚗', text: 'Ingreso — Toyota Hilux 2021', time: 'hace 4h', user: 'Admin', color: '#3b82f6' },
    { icon: '👤', text: 'Nuevo lead — Juan García', time: 'hace 6h', user: 'Juliana', color: '#f59e0b' },
    { icon: '💰', text: 'Seña recibida — VW Amarok', time: 'ayer 15:30', user: 'Marcos', color: '#f59e0b' },
    { icon: '🔧', text: 'Service completado — Peugeot 208', time: 'ayer 10:00', user: 'Admin', color: '#6b7280' },
  ])

  const [topVendedores] = useState([
    { nombre: 'Marcos', ventas: 8, ingresos: 142000, max: 8 },
    { nombre: 'Juliana', ventas: 5, ingresos: 89500, max: 8 },
    { nombre: 'Diego', ventas: 3, ingresos: 51000, max: 8 },
  ])

  useEffect(() => {
    getStats().then(setStats)
    getVehiculos().then(data => setVehiculos(data || []))
    getVentas().then(ventas => {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const count = (ventas || []).filter(v => v.fecha_venta >= firstDay).length
      setVentasMes(count)
      const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
      const prevEnd   = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]
      const prevCount = (ventas || []).filter(v => v.fecha_venta >= prevStart && v.fecha_venta <= prevEnd).length
      const pct = prevCount > 0 ? Math.round((count - prevCount) / prevCount * 100) : null
      setVentasDelta(pct !== null ? (pct >= 0 ? `▲ ${pct}%` : `▼ ${Math.abs(pct)}%`) : null)
    }).catch(() => setVentasMes(null))
  }, [])

  const sparkMonths = [4, 7, 5, 9, 11, ventasMes ?? 0]

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-caption" style={{ textTransform: 'capitalize' }}>
              {today} · Tipo de cambio{' '}
              <strong style={{ color: 'var(--c-fg)' }}>$ {TC ? TC.toLocaleString('es-AR') : '…'}</strong> ARS/USD
            </p>
          </div>
        </div>

        {/* ── HERO ROW ─────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
          {/* Hero card — ventas del mes */}
          <div style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
            borderRadius: 16, padding: '24px 28px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 160, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position:'absolute',inset:0,background:'radial-gradient(circle at 80% 20%, rgba(255,255,255,.08), transparent 60%)',pointerEvents:'none'}}/>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 600, marginBottom: 6 }}>
                Ventas del mes
              </div>
              <div style={{ fontSize: 48, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {ventasMes !== null ? ventasMes : '—'}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', marginTop: 4 }}>
                vehículos cerrados
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 16 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.9)', fontWeight: 600 }}>
                {ventasDelta ? (
                  <span style={{ background: 'rgba(255,255,255,.15)', padding: '2px 8px', borderRadius: 999 }}>
                    {ventasDelta} vs mes anterior
                  </span>
                ) : 'Sin datos comparativos'}
              </div>
              <Sparkline data={sparkMonths} color="rgba(255,255,255,.8)" w={100} h={40} />
            </div>
          </div>

          {/* Mini stat — stock total */}
          <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 160 }}>
            <div style={{ fontSize: 11, color: 'var(--c-fg-3)', textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 600 }}>Stock total</div>
            <div>
              <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--c-fg)' }}>{stats?.total ?? '—'}</div>
              <div style={{ fontSize: 12, color: 'var(--c-fg-3)', marginTop: 2 }}>unidades en sistema</div>
            </div>
            <Sparkline data={[3,5,4,7,8, stats?.total ?? 0]} color="var(--c-info)" w={80} h={28} />
          </div>

          {/* Mini stat — disponibles */}
          <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 160 }}>
            <div style={{ fontSize: 11, color: 'var(--c-fg-3)', textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 600 }}>Disponibles</div>
            <div>
              <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--c-success)' }}>{stats?.disponible ?? '—'}</div>
              <div style={{ fontSize: 12, color: 'var(--c-fg-3)', marginTop: 2 }}>para la venta</div>
            </div>
            <Sparkline data={[3, 5, 4, 7, stats?.disponible ?? 0]} color="var(--c-success)" w={80} h={28} />
          </div>
        </div>

        {/* ── ROW 2: Stock por estado + Necesitan atención ─────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
          <div className="card" style={{ padding: '20px 22px' }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16 }}>Stock por estado</div>
            {stats && (() => {
              const total = stats.total || 1
              const items = [
                { label: 'Disponible',  count: stats.disponible ?? 0, color: 'var(--c-success)' },
                { label: 'Señado',      count: stats.seniado ?? 0,    color: 'var(--c-warning)' },
                { label: 'En revisión', count: stats.en_revision ?? 0, color: 'var(--c-info)' },
                { label: 'Vendido',     count: stats.vendido ?? 0,    color: 'var(--c-fg-3)' },
              ]
              return (
                <>
                  <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', marginBottom: 16, gap: 1 }}>
                    {items.map(it => it.count > 0 && (
                      <div key={it.label} style={{ flex: it.count / total, background: it.color, minWidth: 4, transition: 'flex .3s ease' }} />
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                    {items.map(it => (
                      <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: it.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'var(--c-fg-2)', flex: 1 }}>{it.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-fg)' }}>{it.count}</span>
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
            {!stats && <div style={{ fontSize: 13, color: 'var(--c-fg-3)' }}>Cargando…</div>}
          </div>

          <div className="card" style={{ padding: '20px 22px' }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>Necesitan atención</div>
            {(() => {
              const now = new Date()
              const alerts = vehiculos
                .filter(v => v.estado !== 'vendido')
                .flatMap(v => {
                  const its = []
                  if (v.vtv_vencimiento && new Date(v.vtv_vencimiento) < now)
                    its.push({ msg: `VTV vencida — ${v.marca} ${v.modelo}`, color: 'var(--c-danger)' })
                  if (v.estado === 'señado' && v.fecha_seña) {
                    const diff = Math.floor((now - new Date(v.fecha_seña)) / 86400000)
                    if (diff > 30) its.push({ msg: `Seña >30d — ${v.marca} ${v.modelo}`, color: 'var(--c-warning)' })
                  }
                  return its
                })
                .slice(0, 5)
              if (alerts.length === 0) return (
                <div style={{ fontSize: 13, color: 'var(--c-fg-3)', padding: '12px 0' }}>✓ Sin alertas activas</div>
              )
              return alerts.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', marginBottom: 6,
                  borderRadius: 8, background: 'var(--c-card-2)',
                  borderLeft: `3px solid ${a.color}`,
                }}>
                  <div style={{ fontSize: 12, color: 'var(--c-fg-2)', flex: 1 }}>{a.msg}</div>
                </div>
              ))
            })()}
          </div>
        </div>

        {/* ── ROW 3: Actividad reciente + Top vendedores ────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 28 }}>
          <div className="card" style={{ padding: '20px 22px' }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16 }}>Actividad reciente</div>
            {recentActivity.map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, position: 'relative' }}>
                {i < recentActivity.length - 1 && (
                  <div style={{ position: 'absolute', left: 14, top: 28, bottom: -14, width: 1, background: 'var(--c-border)' }} />
                )}
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${act.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, border: `1px solid ${act.color}44` }}>
                  {act.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--c-fg)', lineHeight: 1.3 }}>{act.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-fg-3)', marginTop: 2 }}>{act.time} · {act.user}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '20px 22px' }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16 }}>Top vendedores</div>
            {topVendedores.map((v, i) => (
              <div key={v.nombre} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--c-accent)', color: '#fff', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {v.nombre.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{v.nombre}</div>
                    <div style={{ fontSize: 11, color: 'var(--c-fg-3)' }}>{v.ventas} ventas · USD {v.ingresos.toLocaleString('es-AR')}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? 'var(--c-warning)' : 'var(--c-fg-3)' }}>#{i + 1}</div>
                </div>
                <div style={{ height: 4, borderRadius: 999, background: 'var(--c-card-2)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(v.ventas / v.max) * 100}%`, background: i === 0 ? 'var(--c-accent)' : 'var(--c-info)', borderRadius: 999, transition: 'width .5s ease' }} />
                </div>
              </div>
            ))}
            <div
              style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--c-border)', fontSize: 11, color: 'var(--c-fg-3)', textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/vendedores')}
            >
              Ver todos →
            </div>
          </div>
        </div>

        <h2 className="section-title">Resumen general</h2>
        <div className="metric-grid">
          <MetricCard label="Total vehículos" icon="car"   value={stats?.total      ?? '—'} sub="en sistema"       onClick={() => navigate('/catalogo')} />
          <MetricCard label="Disponibles"     icon="check" value={stats?.disponible  ?? '—'} tone="g"              onClick={() => navigate('/catalogo?estado=disponible')} />
          <MetricCard label="Señados"                      value={stats?.seniado     ?? '—'} tone="o" sub="reservados" onClick={() => navigate('/catalogo?estado=señado')} />
          <MetricCard label="En revisión"     icon="eye"   value={stats?.en_revision ?? '—'} tone="b"              onClick={() => navigate('/catalogo?estado=en_revision')} />
          <MetricCard label="Vendidos"                     value={stats?.vendido     ?? '—'} tone="r"              onClick={() => navigate('/catalogo?estado=vendido')} />
          <MetricCard label="Ventas del mes"  icon="cash"  value={ventasMes !== null ? ventasMes : '—'} sub="este mes" delta={ventasDelta}       onClick={() => navigate('/reportes')} />
        </div>

        <h2 className="section-title">Vencimientos</h2>
        <AlertasWidget vehiculos={vehiculos} />

        <h2 className="section-title">Accesos rápidos</h2>
        <div className="qa-grid">
          <QuickAction icon="car"   title="Catálogo"          desc="Ver todos los vehículos, filtrar por tipo, estado y precio." cta="Ir al catálogo"    to="/catalogo" />
          <QuickAction icon="plus"  title="Ingresar vehículo" desc="Registrar un vehículo nuevo (compra directa o parte de pago)." cta="Ingresar"         to="/ingreso" />
          <QuickAction icon="cash"  title="Registrar venta"   desc="Cerrar una venta, generar cuotas y actualizar estado."       cta="Registrar venta"  to="/ventas" />
          <QuickAction icon="doc"   title="Documentación"     desc="Estado documental: VTV, verificación, dominio, transferencia." cta="Ver documentación" to="/doc" />
        </div>
      </div>
    </div>
  )
}
