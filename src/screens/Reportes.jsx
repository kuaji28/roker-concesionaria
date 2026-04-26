import React, { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import MetricCard from '../components/MetricCard'
import Icon from '../components/Icon'
import Sparkline from '../components/Sparkline'
import { getReportes } from '../lib/supabase'

const MESES_ABREV = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function fmtK(n) {
  if (!n) return ''
  if (n >= 1000) return `USD ${Math.round(n / 1000)}k`
  return `USD ${n}`
}

function BarChart({ bars }) {
  const maxCount = Math.max(...bars.map(b => b.count), 1)
  const BAR_H    = 180
  const LABEL_H  = 32  // space for bottom labels
  const CHART_H  = BAR_H + LABEL_H
  const yTicks   = [0, Math.round(maxCount / 3), Math.round((maxCount * 2) / 3), maxCount].filter((v, i, a) => a.indexOf(v) === i)

  return (
    <div style={{ position: 'relative', paddingLeft: 32 }}>
      {/* Y-axis labels + grid lines */}
      {yTicks.map(t => {
        const pct = t / maxCount  // 0 = bottom, 1 = top
        const bottomPx = LABEL_H + pct * BAR_H
        return (
          <React.Fragment key={t}>
            {/* grid line */}
            <div style={{
              position: 'absolute', left: 28, right: 0,
              bottom: bottomPx,
              height: 1,
              background: t === 0 ? 'var(--c-border)' : 'var(--c-border)',
              opacity: t === 0 ? 0.8 : 0.4,
              borderTop: t > 0 ? '1px dashed var(--c-border)' : '1px solid var(--c-border)',
            }} />
            {/* y-axis label */}
            <span style={{
              position: 'absolute', left: 0, width: 26, textAlign: 'right',
              bottom: bottomPx - 6,
              fontSize: 9, color: 'var(--c-fg-3)', fontFamily: 'var(--mono)', lineHeight: 1,
            }}>{t}</span>
          </React.Fragment>
        )
      })}

      {/* Bars area */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: CHART_H, padding: '0 4px', position: 'relative' }}>
        {bars.map((b, i) => {
          const labelUpper = b.label.charAt(0).toUpperCase() + b.label.slice(1)
          const displayLabel = labelUpper.length <= 3 ? labelUpper : b.label.slice(0, 3)
          const barPct = b.count / maxCount
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, height: CHART_H }}>
              {/* Revenue label on top of bar area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
                {b.count > 0 && (
                  <span style={{ fontSize: 9, color: 'var(--c-fg-2)', fontFamily: 'var(--mono)', whiteSpace: 'nowrap', marginBottom: 2 }}>
                    {fmtK(b.total)}
                  </span>
                )}
                {b.count > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--c-fg-2)', fontFamily: 'var(--mono)', marginBottom: 2 }}>
                    {b.count}
                  </span>
                )}
                {/* Bar */}
                <div style={{
                  width: '80%',
                  height: `${barPct * BAR_H}px`,
                  minHeight: b.count > 0 ? 4 : 0,
                  background: i === bars.length - 1 ? 'var(--c-accent)' : 'var(--c-info)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height .3s ease',
                  opacity: b.count === 0 ? 0.25 : 1,
                }} />
              </div>
              {/* Month label */}
              <div style={{ height: LABEL_H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--c-fg-2)', textTransform: 'capitalize', fontWeight: i === bars.length - 1 ? 700 : 400 }}>
                  {displayLabel}
                </span>
              </div>
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

            {/* Sparkline trend strip */}
            {(data.bars ?? []).some(b => b.count > 0) && (
              <div className="card" style={{ padding: '14px 20px', marginTop: 20, marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--c-fg-2)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>
                      Tendencia · últimos 6 meses
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
                      {(data.bars ?? []).reduce((s, b) => s + b.count, 0)} ventas
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--c-fg-3)', marginTop: 2 }}>
                      USD {(data.bars ?? []).reduce((s, b) => s + b.total, 0).toLocaleString('es-AR')} ingresado
                    </div>
                  </div>
                  <Sparkline
                    data={(data.bars ?? []).map(b => b.count)}
                    color="var(--c-accent)"
                    w={160} h={48}
                  />
                </div>
              </div>
            )}

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
