import React, { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import MetricCard from '../components/MetricCard'
import Icon from '../components/Icon'
import Sparkline from '../components/Sparkline'
import { getReportes, getAnalyticsData } from '../lib/supabase'

function AreaChart({ series, w = '100%', h = 180 }) {
  // series = [{label, color, data: number[]}]
  // Renders an SVG area chart with multiple overlapping series
  const LABELS_H = 24
  const CHART_H = h - LABELS_H
  const allValues = series.flatMap(s => s.data)
  const maxVal = Math.max(...allValues, 1)
  const n = series[0]?.data.length || 0

  function toPath(data, filled = false) {
    if (n < 2) return ''
    const points = data.map((v, i) => {
      const x = (i / (n - 1)) * 100
      const y = CHART_H - (v / maxVal) * CHART_H * 0.9
      return `${x},${y}`
    })
    if (filled) {
      return `M0,${CHART_H} L${points.join(' L')} L100,${CHART_H} Z`
    }
    return `M${points.join(' L')}`
  }

  const days = n
  const startDate = new Date(Date.now() - (days - 1) * 86400000)
  const labelStep = Math.floor(n / 4)
  const labels = [0, labelStep, labelStep * 2, labelStep * 3, n - 1].filter((v, i, a) => a.indexOf(v) === i)

  return (
    <svg viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" style={{ width: w, height: h, display: 'block' }}>
      {/* grid lines */}
      {[0.25, 0.5, 0.75, 1].map(p => (
        <line key={p} x1="0" y1={CHART_H * (1 - p * 0.9)} x2="100" y2={CHART_H * (1 - p * 0.9)}
          stroke="rgba(255,255,255,.05)" strokeWidth="0.3" />
      ))}
      {/* filled areas */}
      {series.map(s => (
        <path key={s.label + '-fill'} d={toPath(s.data, true)}
          fill={s.color} opacity="0.12"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {/* lines */}
      {series.map(s => (
        <path key={s.label + '-line'} d={toPath(s.data)}
          fill="none" stroke={s.color} strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round" strokeLinejoin="round"
        />
      ))}
      {/* x-axis labels */}
      {labels.map(i => {
        const d = new Date(startDate.getTime() + i * 86400000)
        const label = `${d.getDate()}/${d.getMonth() + 1}`
        return (
          <text key={i} x={(i / (n - 1)) * 100} y={h - 4}
            textAnchor="middle" fontSize="3" fill="rgba(255,255,255,.4)"
            fontFamily="monospace">
            {label}
          </text>
        )
      })}
    </svg>
  )
}


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
  const [data, setData]           = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [topTab, setTopTab]       = useState('30d')

  useEffect(() => {
    Promise.all([
      getReportes().catch(() => null),
      getAnalyticsData().catch(() => null),
    ]).then(([d, a]) => {
      setData(d ?? null)
      setAnalytics(a ?? null)
      setLoading(false)
    })
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
            {/* ── ANALÍTICAS DEL CATÁLOGO — 4 KPI cards ─────────────── */}
            <h2 className="section-title">Analíticas del catálogo</h2>
            <div className="metric-grid">
              <MetricCard label="Visitas al catálogo" icon="chart"   value={analytics?.embudo?.visitas ?? '—'}     tone="b" sub="últimos 30 días" />
              <MetricCard label="Click «Contactar»"   icon="users"   value={analytics?.embudo?.contactaron ?? '—'} tone="g" sub="último mes" />
              <MetricCard label="Enviados a WhatsApp" icon="message" value={analytics?.clicks?.find(c => c.label === 'WhatsApp directo')?.clicks ?? '—'} tone="g" sub="último mes" />
              <MetricCard label="Leads nuevos"        icon="users"   value={analytics?.embudo?.leads ?? data.leadsNuevos ?? '—'} tone="o" sub="este mes" />
            </div>

            {/* ── RESUMEN DE VENTAS ─────────────────────────────────── */}
            <h2 className="section-title" style={{ marginTop: 28 }}>Resumen de ventas</h2>
            <div className="metric-grid">
              <MetricCard label="Ventas del mes"    icon="cash"  value={data.ventasMes ?? '—'}   tone="g" sub="vehículos vendidos" />
              <MetricCard label="Ingreso USD"        icon="chart" value={`USD ${(data.ingresoUSD ?? 0).toLocaleString('es-AR')}`} tone="g" />
              <MetricCard label="Stock disponible"   icon="car"   value={`USD ${(data.stockUSD ?? 0).toLocaleString('es-AR')}`}   tone="b" sub="valor en stock" />
              <MetricCard label="Ingresos al stock"  icon="plus"  value={data.ingresosMes ?? '—'} sub="este mes" />
              <MetricCard label="Leads nuevos"       icon="users" value={data.leadsNuevos ?? '—'} tone="o" />
            </div>

            {/* ── TRÁFICO AL CATÁLOGO ─────────────────────────────── */}
            <div className="card" style={{ padding: 0, marginTop: 20, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--c-fg-3)', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600, marginBottom: 4 }}>
                    Tráfico al catálogo
                    <span style={{ fontSize: 10, color: 'var(--c-fg-3)', marginLeft: 6, fontWeight: 400 }}>Últimos 30 días</span>
                  </div>
                  <div style={{ display: 'flex', gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--c-fg)' }}>
                        {(analytics?.area?.visits ?? []).reduce((a, b) => a + b, 0).toLocaleString('es-AR')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--c-fg-3)', marginTop: 1 }}>
                        <span style={{ width: 10, height: 2, borderRadius: 1, background: 'var(--c-accent)', display: 'inline-block' }} />
                        Visitas
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--c-fg)' }}>
                        {(analytics?.area?.contacts ?? []).reduce((a, b) => a + b, 0)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--c-fg-3)', marginTop: 1 }}>
                        <span style={{ width: 10, height: 2, borderRadius: 1, background: 'var(--c-success)', display: 'inline-block' }} />
                        Contactos
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <AreaChart
                series={[
                  { label: 'Visitas', color: 'var(--c-accent)', data: analytics?.area?.visits ?? [] },
                  { label: 'Contactos', color: 'var(--c-success)', data: analytics?.area?.contacts ?? [] },
                ]}
                h={160}
              />
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

            {/* ── EMBUDO DE CONVERSIÓN ─────────────────────────────── */}
            <h2 className="section-title" style={{ marginTop: 32 }}>Embudo de conversión</h2>
            <div className="card" style={{ padding: '20px 24px' }}>
              {(() => {
                const e = analytics?.embudo ?? {}
                const v1 = e.visitas || 0
                const v2 = e.vieron || 0
                const v3 = e.contactaron || 0
                const v4 = e.leads || 0
                const v5 = e.ventas || data.ventasMes || 0
                const p2 = v1 > 0 ? Math.min(100, Math.round(v2/v1*100)) : 0
                const p3 = v2 > 0 ? Math.min(100, Math.round(v3/v2*100)) : 0
                const p4 = v3 > 0 ? Math.min(100, Math.round(v4/v3*100)) : 0
                const p5 = v4 > 0 ? Math.min(100, Math.round(v5/v4*100)) : 0
                return [
                  { label: 'Visitas al catálogo', count: v1, pct: 100, drop: null },
                  { label: 'Vieron un vehículo', count: v2, pct: p2, drop: p2 < 100 ? 100-p2 : null },
                  { label: 'Click en contactar', count: v3, pct: p3, drop: p3 < 100 ? 100-p3 : null },
                  { label: 'Lead calificado',    count: v4, pct: p4, drop: p4 < 100 ? 100-p4 : null },
                  { label: 'Cerró venta',        count: v5, pct: p5, drop: null },
                ]
              })().map((step, i, arr) => (
                <div key={step.label} style={{ marginBottom: i < arr.length - 1 ? 6 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--c-card-2)', border: '1px solid var(--c-border)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-fg-2)', flexShrink: 0 }}>{i+1}</div>
                    <span style={{ fontSize: 13, color: 'var(--c-fg-2)', flex: 1 }}>{step.label}</span>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{step.count.toLocaleString('es-AR')}</span>
                    <span style={{ fontSize: 12, color: 'var(--c-fg-3)', width: 42, textAlign: 'right' }}>{step.pct}%</span>
                  </div>
                  <div style={{ marginLeft: 36, height: 6, borderRadius: 999, background: 'var(--c-card-2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${step.pct}%`, background: i === arr.length-1 ? 'var(--c-success)' : 'var(--c-accent)', borderRadius: 999, transition: 'width .4s ease' }} />
                  </div>
                  {step.drop && i < arr.length - 1 && (
                    <div style={{ marginLeft: 36, fontSize: 10, color: 'var(--c-fg-3)', marginTop: 2, marginBottom: 6 }}>▼ {step.drop}% abandona aquí</div>
                  )}
                </div>
              ))}
              {!analytics?.embudo?.visitas && (
                <div style={{ marginTop: 14, padding: '10px 0 0', borderTop: '1px solid var(--c-border)', fontSize: 11, color: 'var(--c-fg-3)' }}>
                  Sin datos aún — los eventos se registran cuando los visitantes navegan el catálogo público.
                </div>
              )}
            </div>

            {/* ── VEHÍCULOS MÁS VISTOS ─────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, marginBottom: 8 }}>
              <h2 className="section-title" style={{ margin: 0 }}>Vehículos más vistos</h2>
              <div style={{ display: 'flex', gap: 4 }}>
                {['7d', '30d', '90d'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTopTab(t)}
                    style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      border: '1px solid var(--c-border)',
                      background: topTab === t ? 'var(--c-accent)' : 'transparent',
                      color: topTab === t ? '#fff' : 'var(--c-fg-3)',
                      cursor: 'pointer',
                    }}
                  >{t}</button>
                ))}
              </div>
            </div>
            <div className="card" style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--c-border)' }}>
                    {['#', 'Vehículo', 'Visitas', 'Contacto', 'WhatsApp', 'Favorito', 'CTR%'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: h === '#' ? 'center' : 'left', fontSize: 11, fontWeight: 600, color: 'var(--c-fg-3)', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(analytics?.topByPeriod?.[topTab] ?? []).length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: '20px 14px', textAlign: 'center', color: 'var(--c-fg-3)', fontSize: 13 }}>Sin datos de visitas para este período</td></tr>
                  ) : (analytics?.topByPeriod?.[topTab] ?? []).map((v, i) => {
                    const maxVisitas = analytics.topByPeriod[topTab][0]?.visitas || 1
                    return (
                      <tr key={v.vehiculo_id} style={{ borderBottom: '1px solid var(--c-border)', opacity: i === 0 ? 1 : 0.85 }}>
                        <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: i === 0 ? 'var(--c-warning)' : 'var(--c-fg-3)', fontSize: 12 }}>{i+1}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{v.nombre}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 60, height: 4, borderRadius: 999, background: 'var(--c-card-2)', overflow: 'hidden', flexShrink: 0 }}>
                              <div style={{ height: '100%', width: `${(v.visitas / maxVisitas) * 100}%`, background: 'var(--c-accent)' }} />
                            </div>
                            <span>{v.visitas}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--c-fg-2)' }}>{v.contacto}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--c-fg-2)' }}>{v.wa}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--c-fg-2)' }}>{v.fav}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: v.ctr > 15 ? 'var(--c-success)' : 'var(--c-fg-2)' }}>{v.ctr}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ── CANAL DE CONTACTO ────────────────────────────────── */}
            <h2 className="section-title" style={{ marginTop: 32, marginBottom: 8 }}>Canal de contacto</h2>
            <div className="card" style={{ padding: '20px 22px' }}>
              {[
                { label: 'WhatsApp',  pct: 48, color: '#25D366', icon: '💬' },
                { label: 'Llamada',   pct: 22, color: 'var(--c-info)',    icon: '📞' },
                { label: 'Instagram', pct: 18, color: '#E4405F', icon: '📷' },
                { label: 'Email',     pct:  8, color: 'var(--c-warning)', icon: '✉️' },
                { label: 'Formulario',pct:  4, color: 'var(--c-accent)',  icon: '📋' },
              ].map((c, i) => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: i < 4 ? 12 : 0 }}>
                  <span style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>{c.icon}</span>
                  <span style={{ fontSize: 13, color: 'var(--c-fg-2)', width: 90, flexShrink: 0 }}>{c.label}</span>
                  <div style={{ flex: 1, height: 8, borderRadius: 999, background: 'var(--c-card-2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: 999, transition: 'width .4s ease' }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, width: 36, textAlign: 'right', flexShrink: 0 }}>{c.pct}%</span>
                </div>
              ))}
            </div>

            {/* ── CLICKS POR BOTÓN + DISPOSITIVOS ──────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginTop: 28 }}>
              {/* Clicks */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h2 className="section-title" style={{ margin: 0 }}>Clicks por botón</h2>
                  <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => {}}>
                    <Icon name="download" size={14} /> Exportar
                  </button>
                </div>
                <div className="card" style={{ padding: '8px 0' }}>
                  {!(analytics?.clicks?.length) ? (
                    <p style={{ padding: '20px', textAlign: 'center', color: 'var(--c-fg-3)', fontSize: 13 }}>Sin datos de clicks aún</p>
                  ) : (analytics?.clicks ?? []).map(row => {
                    const maxClicks = analytics.clicks[0]?.clicks || 1
                    return (
                      <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px' }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>{row.ico}</span>
                        <span style={{ fontSize: 13, color: 'var(--c-fg-2)', flex: 1 }}>{row.label}</span>
                        <div style={{ width: 80, height: 4, borderRadius: 999, background: 'var(--c-card-2)', overflow: 'hidden', flexShrink: 0 }}>
                          <div style={{ height: '100%', width: `${(row.clicks / maxClicks) * 100}%`, background: 'var(--c-info)' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, width: 40, textAlign: 'right' }}>{row.clicks}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Dispositivos — donut */}
              <div>
                <h2 className="section-title" style={{ marginBottom: 8 }}>Dispositivos</h2>
                <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                  {/* SVG Donut */}
                  {(() => {
                    const deviceData = analytics?.devices ?? []
                    if (!deviceData.length || !analytics?.totalSessions) {
                      return <p style={{ fontSize: 13, color: 'var(--c-fg-3)', textAlign: 'center' }}>Sin datos aún</p>
                    }
                    const R = 52, stroke = 14, cx = 70, cy = 70
                    const circ = 2 * Math.PI * R
                    const total = deviceData.reduce((s, d) => s + d.pct, 0) || 1
                    let offset = 0
                    return (
                      <>
                        <div style={{ position: 'relative', width: 140, height: 140 }}>
                          <svg width="140" height="140" viewBox="0 0 140 140">
                            {deviceData.map(d => {
                              const dash = (d.pct / total) * circ
                              const gap = circ - dash
                              const el = (
                                <circle
                                  key={d.label}
                                  cx={cx} cy={cy} r={R}
                                  fill="none"
                                  stroke={d.color}
                                  strokeWidth={stroke}
                                  strokeDasharray={`${dash - 2} ${gap + 2}`}
                                  strokeDashoffset={-(offset * circ / total) + circ / 4}
                                  strokeLinecap="round"
                                />
                              )
                              offset += d.pct
                              return el
                            })}
                          </svg>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>{(analytics.totalSessions).toLocaleString('es-AR')}</span>
                            <span style={{ fontSize: 10, color: 'var(--c-fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>sesiones</span>
                          </div>
                        </div>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {deviceData.map(d => (
                            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 10, height: 10, borderRadius: 999, background: d.color, flexShrink: 0 }} />
                              <span style={{ fontSize: 13, color: 'var(--c-fg-2)', flex: 1 }}>{d.label}</span>
                              <span style={{ fontSize: 13, fontWeight: 700 }}>{d.pct}%</span>
                              <span style={{ fontSize: 11, color: 'var(--c-fg-3)', width: 60, textAlign: 'right' }}>{d.count.toLocaleString('es-AR')} ses.</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
