import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import StateBadge from '../components/StateBadge'
import Icon from '../components/Icon'
import FormField from '../components/FormField'
import { getVehiculos } from '../lib/supabase'
import { useTc } from '../hooks/useTc'

const MARCAS_COMUNES = ['Chevrolet', 'Ford', 'Fiat', 'Volkswagen', 'Renault', 'Peugeot', 'Citroen', 'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'BMW', 'Mercedes-Benz', 'Audi']

export default function Buscar({ onLogout }) {
  const TC       = useTc()
  const navigate = useNavigate()

  const [todos, setTodos]       = useState([])
  const [loading, setLoading]   = useState(true)

  const [filters, setFilters] = useState({
    tipo: 'todos',
    marca: '',
    anio_min: '',
    anio_max: '',
    km_max: '',
    precio_min: '',
    precio_max: '',
    combustible: '',
    transmision: '',
    search: '',
  })

  useEffect(() => {
    getVehiculos({ estado: 'disponible' }).then(v => { setTodos(v); setLoading(false) })
  }, [])

  const ff = (k) => (e) => setFilters(p => ({ ...p, [k]: e.target.value }))
  function reset() { setFilters({ tipo: 'todos', marca: '', anio_min: '', anio_max: '', km_max: '', precio_min: '', precio_max: '', combustible: '', transmision: '', search: '' }) }

  const resultados = todos.filter(v => {
    if (filters.tipo !== 'todos' && v.tipo !== filters.tipo) return false
    if (filters.marca && !v.marca?.toLowerCase().includes(filters.marca.toLowerCase())) return false
    if (filters.anio_min && v.anio < Number(filters.anio_min)) return false
    if (filters.anio_max && v.anio > Number(filters.anio_max)) return false
    if (filters.km_max && v.km_hs > Number(filters.km_max)) return false
    if (filters.precio_min && v.precio_base < Number(filters.precio_min)) return false
    if (filters.precio_max && v.precio_base > Number(filters.precio_max)) return false
    if (filters.combustible && v.combustible?.toLowerCase() !== filters.combustible.toLowerCase()) return false
    if (filters.transmision && v.transmision?.toLowerCase() !== filters.transmision.toLowerCase()) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!(v.marca?.toLowerCase().includes(q) || v.modelo?.toLowerCase().includes(q) || v.version?.toLowerCase().includes(q) || v.patente?.toLowerCase().includes(q))) return false
    }
    return true
  })

  const activeFilters = Object.entries(filters).filter(([k, v]) => v && v !== 'todos').length

  const marcas = [...new Set(todos.map(v => v.marca).filter(Boolean))].sort()

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Buscar para cliente</h1>
            <p className="page-caption">Encontrá el vehículo ideal con filtros avanzados</p>
          </div>
          {activeFilters > 0 && (
            <button className="btn secondary" onClick={reset}>
              <Icon name="x" size={14} /> Limpiar filtros ({activeFilters})
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            <FormField label="Buscar texto">
              <input className="input" placeholder="Marca, modelo, patente…" value={filters.search} onChange={ff('search')} />
            </FormField>
            <FormField label="Tipo">
              <select className="input" value={filters.tipo} onChange={ff('tipo')}>
                <option value="todos">Todos</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
                <option value="cuatriciclo">Cuatriciclo</option>
                <option value="moto_de_agua">Moto de agua</option>
              </select>
            </FormField>
            <FormField label="Marca">
              <select className="input" value={filters.marca} onChange={ff('marca')}>
                <option value="">Todas las marcas</option>
                {marcas.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </FormField>
            <FormField label="Año desde">
              <input className="input" type="number" placeholder="2015" value={filters.anio_min} onChange={ff('anio_min')} min={1990} max={2030} />
            </FormField>
            <FormField label="Año hasta">
              <input className="input" type="number" placeholder={new Date().getFullYear()} value={filters.anio_max} onChange={ff('anio_max')} min={1990} max={2030} />
            </FormField>
            <FormField label="Km máximo">
              <input className="input" type="number" placeholder="150000" value={filters.km_max} onChange={ff('km_max')} min={0} />
            </FormField>
            <FormField label="Precio mín (USD)">
              <input className="input" type="number" placeholder="0" value={filters.precio_min} onChange={ff('precio_min')} min={0} />
            </FormField>
            <FormField label="Precio máx (USD)">
              <input className="input" type="number" placeholder="Sin límite" value={filters.precio_max} onChange={ff('precio_max')} min={0} />
            </FormField>
            <FormField label="Combustible">
              <select className="input" value={filters.combustible} onChange={ff('combustible')}>
                <option value="">Cualquiera</option>
                {['Nafta', 'Diesel', 'GNC', 'Nafta/GNC', 'Híbrido', 'Eléctrico'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Transmisión">
              <select className="input" value={filters.transmision} onChange={ff('transmision')}>
                <option value="">Cualquiera</option>
                {['Manual', 'Automática', 'CVT', 'Secuencial'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
          </div>
        </div>

        {/* Resultados */}
        {loading ? <p style={{ color: 'var(--c-fg-2)' }}>Cargando stock…</p> : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <p style={{ color: 'var(--c-fg-2)', margin: 0, fontSize: 14 }}>
                <strong style={{ color: 'var(--c-fg)' }}>{resultados.length}</strong> vehículo{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
                {todos.length !== resultados.length && <> de {todos.length} disponibles</>}
              </p>
            </div>

            {resultados.length === 0 ? (
              <div className="banner info">
                <Icon name="info" size={16} />
                Sin resultados con los filtros actuales.
                {activeFilters > 0 && <button className="btn ghost" style={{ marginLeft: 8, padding: '2px 8px', fontSize: 12 }} onClick={reset}>Limpiar filtros</button>}
              </div>
            ) : (
              resultados.map(v => (
                <div key={v.id} className="list-row" style={{ cursor: 'pointer' }} onClick={() => navigate(`/vehiculo/${v.id}`)}>
                  <div>
                    <div className="v-title">{v.marca} {v.modelo} {v.anio}{v.version ? ` · ${v.version}` : ''}</div>
                    <div className="v-meta">
                      {v.patente || '—'} · #{v.id}
                      {v.combustible ? ` · ${v.combustible}` : ''}
                      {v.transmision ? ` · ${v.transmision}` : ''}
                    </div>
                  </div>
                  <StateBadge estado={v.estado} />
                  <div className="num">{v.km_hs?.toLocaleString('es-AR') || '0'} km</div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="price-cell"><strong>USD {v.precio_base?.toLocaleString('es-AR') || '—'}</strong></div>
                    {v.precio_base && TC > 0 && (
                      <div style={{ fontSize: 12, color: 'var(--c-fg-2)' }}>$ {(v.precio_base * TC).toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
                    )}
                  </div>
                  <Icon name="chev-r" size={16} style={{ stroke: 'var(--c-fg-2)', justifySelf: 'end' }} />
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}
