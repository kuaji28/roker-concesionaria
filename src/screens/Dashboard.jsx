import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import MetricCard from '../components/MetricCard'
import Icon from '../components/Icon'
import { getStats } from '../lib/supabase'

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
  const [stats, setStats] = useState(null)
  const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })

  useEffect(() => {
    getStats().then(setStats)
  }, [])

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-caption" style={{ textTransform: 'capitalize' }}>
              {today} · Tipo de cambio{' '}
              <strong style={{ color: 'var(--c-fg)' }}>$ 1.415</strong> ARS/USD
            </p>
          </div>
        </div>

        <h2 className="section-title">Resumen general</h2>
        <div className="metric-grid">
          <MetricCard label="Total vehículos" icon="car"   value={stats?.total      ?? '—'} sub="en sistema"       onClick={() => navigate('/catalogo')} />
          <MetricCard label="Disponibles"     icon="check" value={stats?.disponible  ?? '—'} tone="g"              onClick={() => navigate('/catalogo?estado=disponible')} />
          <MetricCard label="Señados"                      value={stats?.seniado     ?? '—'} tone="o" sub="reservados" onClick={() => navigate('/catalogo?estado=señado')} />
          <MetricCard label="En revisión"     icon="eye"   value={stats?.en_revision ?? '—'} tone="b"              onClick={() => navigate('/catalogo?estado=en_revision')} />
          <MetricCard label="Vendidos"                     value={stats?.vendido     ?? '—'} tone="r"              onClick={() => navigate('/catalogo?estado=vendido')} />
          <MetricCard label="Ventas del mes"  icon="cash"  value="—"                         sub="ver reportes"    onClick={() => navigate('/reportes')} />
        </div>

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
