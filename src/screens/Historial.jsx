import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Icon from '../components/Icon'
import { getAuditLog, supabase } from '../lib/supabase'

const ACCION_META = {
  insert: { label: 'Creación', icon: '➕', color: '#22c55e' },
  update: { label: 'Edición',  icon: '✏️', color: '#6366f1' },
  delete: { label: 'Borrado',  icon: '🗑️', color: '#ef4444' },
  login:  { label: 'Login',    icon: '🔓', color: '#94a3b8' },
  logout: { label: 'Logout',   icon: '🔒', color: '#94a3b8' },
  custom: { label: 'Acción',   icon: '⚙️', color: '#a855f7' },
}

const TABLA_LABELS = {
  vehiculos:    'Vehículo',
  con_ventas:   'Venta',
  clientes:     'Cliente',
  vendedores:   'Vendedor',
  perfiles:     'Perfil',
  gastos:       'Gasto',
  reservas:     'Reserva',
  prospectos:   'Lead',
  turnos:       'Turno',
  seguimientos: 'Seguimiento',
}

function formatFecha(iso) {
  const d = new Date(iso)
  const hoy = new Date()
  const ayer = new Date(hoy.getTime() - 86400000)
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  if (sameDay(d, hoy))  return `Hoy · ${hh}:${mm}`
  if (sameDay(d, ayer)) return `Ayer · ${hh}:${mm}`
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')} · ${hh}:${mm}`
}

function agruparPorDia(items) {
  const grupos = {}
  for (const it of items) {
    const d = new Date(it.created_at)
    const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    if (!grupos[k]) grupos[k] = []
    grupos[k].push(it)
  }
  return grupos
}

export default function Historial({ onLogout }) {
  const navigate = useNavigate()
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [filtroAccion, setFiltroAccion] = useState('todas')
  const [filtroTabla, setFiltroTabla]   = useState('todas')
  const [filtroPerfil, setFiltroPerfil] = useState('todos')

  useEffect(() => {
    setLoading(true)
    getAuditLog({ limit: 200 }).then(data => {
      setItems(data || [])
      setLoading(false)
    })
  }, [])

  const perfiles = [...new Set(items.map(i => i.perfil_nombre).filter(Boolean))]
  const tablas   = [...new Set(items.map(i => i.tabla))]

  let filtrados = items
  if (filtroAccion !== 'todas') filtrados = filtrados.filter(i => i.accion === filtroAccion)
  if (filtroTabla !== 'todas')  filtrados = filtrados.filter(i => i.tabla === filtroTabla)
  if (filtroPerfil !== 'todos') filtrados = filtrados.filter(i => i.perfil_nombre === filtroPerfil)

  const grupos = agruparPorDia(filtrados)
  const fechas = Object.keys(grupos).sort().reverse()

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Historial de movimientos</h1>
            <p className="page-caption">Registro de todas las acciones del sistema</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="card" style={{ padding: 12, marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <select className="input" style={{ width: 'auto' }} value={filtroAccion} onChange={e => setFiltroAccion(e.target.value)}>
            <option value="todas">Todas las acciones</option>
            <option value="insert">Creaciones</option>
            <option value="update">Ediciones</option>
            <option value="delete">Borrados</option>
            <option value="login">Logins</option>
          </select>
          <select className="input" style={{ width: 'auto' }} value={filtroTabla} onChange={e => setFiltroTabla(e.target.value)}>
            <option value="todas">Todas las tablas</option>
            {tablas.map(t => <option key={t} value={t}>{TABLA_LABELS[t] || t}</option>)}
          </select>
          {perfiles.length > 0 && (
            <select className="input" style={{ width: 'auto' }} value={filtroPerfil} onChange={e => setFiltroPerfil(e.target.value)}>
              <option value="todos">Todos los usuarios</option>
              {perfiles.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--c-fg-3)' }}>
            {filtrados.length} de {items.length} eventos
          </span>
        </div>

        {loading && <p style={{ color: 'var(--c-fg-2)' }}>Cargando…</p>}

        {!loading && filtrados.length === 0 && (
          <div className="banner info"><Icon name="info" size={16} />Sin eventos con los filtros activos.</div>
        )}

        {/* Timeline */}
        {fechas.map(fecha => (
          <div key={fecha} style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
              color: 'var(--c-fg-3)', letterSpacing: '0.05em',
              padding: '8px 0', borderBottom: '1px solid var(--c-border)',
              marginBottom: 8, position: 'sticky', top: 60, background: 'var(--c-bg)', zIndex: 5,
            }}>
              {(() => {
                const d = new Date(fecha)
                return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
              })()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {grupos[fecha].map(it => {
                const meta = ACCION_META[it.accion] || ACCION_META.custom
                const tabla = TABLA_LABELS[it.tabla] || it.tabla
                const clickable = it.tabla === 'vehiculos' && it.accion !== 'delete'
                return (
                  <div
                    key={it.id}
                    onClick={() => clickable && navigate(`/vehiculo/${it.registro_id}`)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '32px 1fr auto',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 'var(--r)',
                      background: 'var(--c-card)',
                      borderLeft: `3px solid ${meta.color}`,
                      cursor: clickable ? 'pointer' : 'default',
                      transition: 'background .15s',
                    }}
                    onMouseEnter={e => clickable && (e.currentTarget.style.background = 'var(--c-card-2)')}
                    onMouseLeave={e => clickable && (e.currentTarget.style.background = 'var(--c-card)')}
                  >
                    <div style={{ fontSize: 18, lineHeight: 1 }}>{meta.icon}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {meta.label} · {tabla} #{it.registro_id}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--c-fg-2)', marginTop: 2 }}>
                        {it.descripcion || '(sin detalle)'}
                      </div>
                      {it.perfil_nombre && (
                        <div style={{ fontSize: 11, color: 'var(--c-fg-3)', marginTop: 4 }}>
                          por <strong>{it.perfil_nombre}</strong>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--c-fg-3)', whiteSpace: 'nowrap' }}>
                      {formatFecha(it.created_at)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
