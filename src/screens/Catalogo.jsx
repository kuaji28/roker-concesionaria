import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import TopBar from '../components/TopBar'
import VehicleCard from '../components/VehicleCard'
import StateBadge from '../components/StateBadge'
import Icon from '../components/Icon'
import { getVehiculos, updateVehiculo } from '../lib/supabase'
import { useTc } from '../hooks/useTc'
import { useUser, canSeePrecioBase } from '../hooks/useUser'
import { useIsMobile } from '../hooks/useIsMobile'

const ESTADOS       = ['todos', 'disponible', 'señado', 'en_revision', 'en_preparacion', 'vendido']
const TIPOS         = ['todos', 'auto', 'moto', 'cuatriciclo', 'moto_de_agua']
const TIPOS_LABEL   = { todos: 'Todos', auto: 'Autos', moto: 'Motos', cuatriciclo: 'Cuatriciclos', moto_de_agua: 'Motos de agua' }
const CARROCERIAS   = ['todos', 'SUV', 'Pickup', 'Sedán', 'Hatchback', 'Familiar', 'Coupé', 'Convertible', 'Minivan', 'Sport', 'Utilitario']
const ESTADOS_EDIT  = ['disponible', 'señado', 'en_revision', 'en_preparacion', 'vendido']

export default function Catalogo({ onLogout }) {
  const navigate = useNavigate()
  const TC = useTc()
  const user = useUser()
  const rol = user?.rol || 'externo'
  const isMobile = useIsMobile()
  const [params] = useSearchParams()

  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading]     = useState(true)
  const [view, setView]           = useState('cards')

  // Filtros texto/select
  const [search, setSearch] = useState(params.get('search') || '')
  const [estado, setEstado] = useState(params.get('estado') || 'todos')
  const [tipo, setTipo]     = useState('todos')

  // Filtros carrocería + numéricos
  const [carroceria, setCarroceria] = useState('todos')
  const [anioMin,    setAnioMin]    = useState('')
  const [anioMax,    setAnioMax]    = useState('')
  const [kmMax,      setKmMax]      = useState('')
  const [precioMin,  setPrecioMin]  = useState('')
  const [precioMax,  setPrecioMax]  = useState('')
  const [filtrosExp, setFiltrosExp] = useState(false)

  // Edición inline
  const [editId,    setEditId]    = useState(null)
  const [editForm,  setEditForm]  = useState({})
  const [savingId,  setSavingId]  = useState(null)

  function reload() {
    setLoading(true)
    getVehiculos({ estado, tipo, search }).then(data => {
      setVehiculos(data)
      setLoading(false)
    })
  }

  useEffect(() => { reload() }, [estado, tipo, search])

  // Filtrado client-side (carrocería + numérico + rol)
  const shown = vehiculos.filter(v => {
    if (carroceria !== 'todos' && v.carroceria?.toLowerCase() !== carroceria.toLowerCase()) return false
    if (anioMin  && v.anio       <  Number(anioMin))  return false
    if (anioMax  && v.anio       >  Number(anioMax))  return false
    if (kmMax    && v.km_hs      >  Number(kmMax))    return false
    if (precioMin && (v.precio_base || 0) < Number(precioMin)) return false
    if (precioMax && (v.precio_base || 0) > Number(precioMax)) return false
    if (rol === 'externo' && v.estado !== 'disponible') return false
    return true
  })

  const numFiltrosActivos = [anioMin, anioMax, kmMax, precioMin, precioMax].filter(Boolean).length

  function startEdit(v, e) {
    e.stopPropagation()
    setEditId(v.id)
    setEditForm({ estado: v.estado, km_hs: v.km_hs || '', precio_base: v.precio_base || '' })
  }
  function cancelEdit(e) { e?.stopPropagation(); setEditId(null) }

  async function saveEdit(id, e) {
    e.stopPropagation()
    setSavingId(id)
    try {
      await updateVehiculo(id, {
        estado:      editForm.estado,
        km_hs:       editForm.km_hs    ? Number(editForm.km_hs)    : null,
        precio_base: editForm.precio_base ? Number(editForm.precio_base) : null,
      })
      reload()
      setEditId(null)
    } finally { setSavingId(null) }
  }

  return (
    <div>
      <TopBar placeholder="Marca, modelo, patente…" onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Catálogo</h1>
            <p className="page-caption">{shown.length} vehículo(s)</p>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn primary" onClick={() => navigate('/ingreso')}>
            <Icon name="plus" size={14} /> Ingresar vehículo
          </button>
        </div>

        {/* ── Barra de filtros ── */}
        <div className="filter-card">

          {/* Tipo pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {TIPOS.map(t => (
              <button key={t}
                className={tipo === t ? 'pill-on' : 'pill'}
                onClick={() => { setTipo(t); setCarroceria('todos') }}
              >{TIPOS_LABEL[t]}</button>
            ))}
          </div>

          {/* Carrocería pills (solo cuando tipo=todos o auto) */}
          {(tipo === 'todos' || tipo === 'auto') && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {CARROCERIAS.map(car => (
                <button key={car}
                  className={carroceria === car ? 'pill-on' : 'pill'}
                  onClick={() => setCarroceria(car)}
                >{car === 'todos' ? 'Todas' : car}</button>
              ))}
            </div>
          )}

          {/* Search + Estado + Vista */}
          <div className="filter-row">
            <div style={{ flex: 2 }}>
              <label>Buscar</label>
              <div className="search-field" style={{ background: 'var(--c-bg)' }}>
                <Icon name="search" size={16} style={{ stroke: 'var(--c-fg-3)' }} />
                <input placeholder="Marca, modelo, patente…" value={search}
                  onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div>
              <label>Estado</label>
              <select className="input" value={estado} onChange={e => setEstado(e.target.value)}>
                {ESTADOS.map(e => <option key={e} value={e}>{e === 'todos' ? 'Todos' : e.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label>Vista</label>
              <div className="seg" style={{ marginTop: 0 }}>
                <button className={view === 'cards' ? 'on' : ''} onClick={() => setView('cards')}>
                  <Icon name="grid" size={13} /> Tarjetas
                </button>
                <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>
                  <Icon name="list" size={13} /> Lista
                </button>
              </div>
            </div>
          </div>

          {/* Filtros numéricos — siempre visibles */}
          <div className="filter-row" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--c-border)' }}>
            <div>
              <label>Año desde</label>
              <input className="input" type="number" placeholder="2015" value={anioMin}
                onChange={e => setAnioMin(e.target.value)} style={{ width: 90 }} />
            </div>
            <div>
              <label>Año hasta</label>
              <input className="input" type="number" placeholder="2026" value={anioMax}
                onChange={e => setAnioMax(e.target.value)} style={{ width: 90 }} />
            </div>
            <div>
              <label>Km máx</label>
              <input className="input" type="number" placeholder="—" value={kmMax}
                onChange={e => setKmMax(e.target.value)} style={{ width: 110 }} />
            </div>
            <div>
              <label>Precio mín USD</label>
              <input className="input" type="number" placeholder="—" value={precioMin}
                onChange={e => setPrecioMin(e.target.value)} style={{ width: 110 }} />
            </div>
            <div>
              <label>Precio máx USD</label>
              <input className="input" type="number" placeholder="—" value={precioMax}
                onChange={e => setPrecioMax(e.target.value)} style={{ width: 110 }} />
            </div>
            {numFiltrosActivos > 0 && (
              <div style={{ alignSelf: 'flex-end' }}>
                <button className="btn ghost" onClick={() => {
                  setAnioMin(''); setAnioMax(''); setKmMax(''); setPrecioMin(''); setPrecioMax('')
                }}>Limpiar</button>
              </div>
            )}
          </div>
        </div>

        {/* ── Listado ── */}
        {loading ? (
          <p style={{ color: 'var(--c-fg-2)', textAlign: 'center', padding: 40 }}>Cargando…</p>
        ) : shown.length === 0 ? (
          <div className="banner info"><Icon name="info" size={16} />No hay vehículos con esos filtros.</div>
        ) : view === 'cards' ? (
          <div className="veh-grid">
            {shown.map(v => <VehicleCard key={v.id} v={v} />)}
          </div>
        ) : (
          <div>
            {shown.map(v => (
              editId === v.id ? (
                /* ── Fila en edición ── */
                <div key={v.id} className="list-row" style={{ background: 'var(--c-bg-2)', cursor: 'default' }}
                  onClick={e => e.stopPropagation()}>
                  <div>
                    <div className="v-title">{v.marca} {v.modelo} {v.anio}{v.version ? ` · ${v.version}` : ''}</div>
                    <div className="v-meta">{v.patente || '—'}</div>
                  </div>
                  <div>
                    <select className="input" style={{ fontSize: 12 }} value={editForm.estado}
                      onChange={e => setEditForm(p => ({ ...p, estado: e.target.value }))}>
                      {ESTADOS_EDIT.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input className="input" type="number" style={{ width: 100, fontSize: 12 }}
                      placeholder="km" value={editForm.km_hs}
                      onChange={e => setEditForm(p => ({ ...p, km_hs: e.target.value }))} />
                    <input className="input" type="number" style={{ width: 100, fontSize: 12 }}
                      placeholder="USD" value={editForm.precio_base}
                      onChange={e => setEditForm(p => ({ ...p, precio_base: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn primary" style={{ fontSize: 12, padding: '4px 10px' }}
                      disabled={savingId === v.id} onClick={e => saveEdit(v.id, e)}>
                      {savingId === v.id ? '…' : <Icon name="check" size={13} />}
                    </button>
                    <button className="btn ghost" style={{ fontSize: 12, padding: '4px 10px' }}
                      onClick={cancelEdit}>
                      <Icon name="close" size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Fila normal ── */
                <div key={v.id} className="list-row" onClick={() => navigate(`/vehiculo/${v.id}`)}>
                  {v.foto_url ? (
                    <img
                      src={v.foto_url}
                      alt={`${v.marca} ${v.modelo}`}
                      style={{ width: 88, height: 62, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: 88, height: 62, background: 'var(--c-card-2)', borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c-fg-3)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                    </div>
                  )}
                  <div>
                    <div className="v-title">{v.marca} {v.modelo} {v.anio}{v.version ? ` · ${v.version}` : ''}</div>
                    <div className="v-meta">{v.patente || '—'} · #{v.id} · {v.color || '—'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <StateBadge estado={v.estado} />
                    {v.ubicacion && <StateBadge ubicacion={v.ubicacion} small />}
                  </div>
                  <div className="num">{v.km_hs?.toLocaleString('es-AR') || '0'} km</div>
                  <div className="price-cell">
                    <strong>USD {(v.precio_lista || v.precio_base)?.toLocaleString('es-AR')}</strong>
                    {canSeePrecioBase(rol) && v.precio_lista && v.precio_base && v.precio_base !== v.precio_lista && (
                      <div style={{ fontSize: 11, color: 'var(--c-fg-3)' }}>Piso USD {v.precio_base?.toLocaleString('es-AR')}</div>
                    )}
                    <div className="ars">$ {(((v.precio_lista || v.precio_base) || 0) * TC).toLocaleString('es-AR')} ARS</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, justifySelf: 'end' }}>
                    <button className="btn ghost" style={{ padding: '4px 8px' }}
                      onClick={e => startEdit(v, e)} title="Edición rápida">
                      <Icon name="edit" size={14} />
                    </button>
                    <Icon name="chev-r" size={16} style={{ stroke: 'var(--c-fg-2)' }} />
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
