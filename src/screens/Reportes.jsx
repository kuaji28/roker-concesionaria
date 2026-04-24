import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import MetricCard from '../components/MetricCard'
import Icon from '../components/Icon'
import { getReportes } from '../lib/supabase'

const MESES_ABREV = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function fmtK(n) {
  if (!n) return ''
  if (n >= 1000) return `USD ${Math.round(n / 1000)}k`
  return `USD ${n}`
}

function BarChart({ bars }) {
  const maxCount = Math.max(...bars.map(b => b.count), 1)
  const CHART_H  = 160
  const BAR_H    = 120
  const yTicks   = [0, Math.round(maxCount / 3), Math.round((maxCount * 2) / 3), maxCount].filter((v, i, a) => a.indexOf(v) === i)

  return (
    <div style={{ position: 'relative' }}>
      {/* Y-axis labels */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 28,
        width: 28, display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between',
        paddingBottom: 0,
      }}>
        {yTicks.map(t => (
          <span key={t} style={{ fontSize: 9, color: 'var(--c-fg-3)', fontFamily: 'var(--mono)', lineHeight: 1 }}>{t}</span>
        ))}
      </div>

      {/* Bars */}
      <div style={{ marginLeft: 32, display: 'flex', alignItems: 'flex-end', gap: 8, height: CHART_H, padding: '0 4px' }}>
        {bars.map((b, i) => {
          const abbrev = MESES_ABREV[new Date(0, i).getMonth()] || b.label
          // Try to parse month from label (e.g. "nov" "dic")
          const labelUpper = b.label.charAt(0).toUpperCase() + b.label.slice(1)
          const displayLabel = labelUpper.length <= 3 ? labelUpper : b.label.slice(0, 3)
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {/* Revenue label on top */}
              <span style={{ fontSize: 9, color: 'var(--c-fg-2)', fontFamily: 'var(--mono)', whiteSpace: 'nowrap', marginBottom: 2 }}>
                {fmtK(b.total)}
              </span>
              {/* Count label */}
              <span style={{ fontSize: 10, color: 'var(--c-fg-2)', fontFamily: 'var(--mono)' }}>{b.count}</span>
              {/* Bar */}
              <div style={{ width: '100%', background: 'var(--c-card-2)', borderRadius: 4, overflow: 'hidden', height: BAR_H }}>
                <div style={{
                  width: '100%',
                  height: `${(b.count / maxCount) * 100}%`,
                  background: i === bars.length - 1 ? 'var(--c-success)' : 'var(--c-info)',
                  borderRadius: '4px 4px 0 0',
                  marginTop: `${100 - (b.count / maxCount) * 100}%`,
                  transition: 'height .3s ease',
                }} />
              </div>
              {/* Month label */}
              <span style={{ fontSize: 10, color: 'var(--c-fg-3)', textTransform: 'capitalize' }}>{displayLabel}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function exportCSV(bars) {
  const header = 'Mes,Ventas,Ingreso USD\n'
  const rows = bars.map(b => `${b.label},${b.count},${b.total}`).join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `reportes_ghcars_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Reportes({ onLogout }) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReportes().then(d => { setData(d ?? null); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Reportes</h1>
            <p className="page-caption">{new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--c-fg-2)' }}>Cargando…</p>
        ) : !data ? (
          <div className="banner info"><Icon name="info" size={16} />No se pudieron cargar los datos del reporte.</div>
        ) : (
          <>
            <h2 className="section-title">Resumen del mes</h2>
            <div className="metric-grid">
              <MetricCard label="Ventas del mes"    icon="cash"  value={data.ventasMes ?? '—'}   tone="g" sub="vehículos vendidos" />
              <MetricCard label="Ingreso USD"        icon="chart" value={`USD ${(data.ingresoUSD ?? 0).toLocaleString('es-AR')}`} tone="g" />
              <MetricCard label="Stock disponible"   icon="car"   value={`USD ${(data.stockUSD ?? 0).toLocaleString('es-AR')}`}   tone="b" sub="valor en stock" />
              <MetricCard label="Ingresos al stock"  icon="plus"  value={data.ingresosMes ?? '—'} sub="este mes" />
              <MetricCard label="Leads nuevos"       icon="users" value={data.leadsNuevos ?? '—'} tone="o" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, marginBottom: 8 }}>
              <h2 className="section-title" style={{ margin: 0 }}>Ventas últimos 6 meses</h2>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => exportCSV(data.bars ?? [])}
              >
                <Icon name="download" size={14} />Exportar CSV
              </button>
            </div>
            <div className="card">
              <BarChart bars={data.bars ?? []} />
              {(() => {
                const totalVentas  = (data.bars ?? []).reduce((s, b) => s + b.count, 0)
                const totalIngreso = (data.bars ?? []).reduce((s, b) => s + b.total, 0)
                return (
                  <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--c-border)', fontSize: 12, color: 'var(--c-fg-2)', textAlign: 'center' }}>
                    Total 6 meses: <strong>{totalVentas}</strong> ventas · <strong>USD {totalIngreso.toLocaleString('es-AR')}</strong>
                  </div>
                )
              })()}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
