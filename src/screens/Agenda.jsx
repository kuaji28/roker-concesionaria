import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Modal from '../components/Modal'
import Icon from '../components/Icon'
import { getAgenda, crearTurno, updateTurno, getVehiculos, getVendedores } from '../lib/supabase'

// ── Constants ─────────────────────────────────────────────────
const TIPOS = [
  { value: 'prueba_manejo', label: 'Prueba de manejo' },
  { value: 'entrega',       label: 'Entrega' },
  { value: 'visita',        label: 'Visita' },
  { value: 'llamada',       label: 'Llamada' },
  { value: 'servicio',      label: 'Servicio' },
]

const ESTADOS = {
  programado:  { label: 'Programado',  color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  confirmado:  { label: 'Confirmado',  color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  realizado:   { label: 'Realizado',   color: '#16A34A', bg: 'rgba(22,163,74,0.15)' },
  cancelado:   { label: 'Cancelado',   color: '#64748B', bg: 'rgba(100,116,139,0.12)' },
  no_asistio:  { label: 'No asistió',  color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
}

const DURACIONES = [30, 60, 90, 120]

function hoy() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function diasSemana() {
  const dias = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    dias.push({
      iso,
      label: i === 0 ? 'Hoy' : d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' }),
    })
  }
  return dias
}

function fmtHora(hora) {
  if (!hora) return ''
  return hora.slice(0, 5)
}

// ── Badge ─────────────────────────────────────────────────────
function EstadoBadge({ estado }) {
  const m = ESTADOS[estado] || ESTADOS.programado
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
      color: m.color, background: m.bg, whiteSpace: 'nowrap'
    }}>
      {m.label}
    </span>
  )
}

// ── TurnoCard ─────────────────────────────────────────────────
function TurnoCard({ turno, onCambiarEstado }) {
  const tipo = TIPOS.find(t => t.value === turno.tipo)?.label || turno.tipo
  const nombre = turno.prospecto?.nombre || turno.titulo || '—'
  const vehiculo = turno.vehiculo
    ? `${turno.vehiculo.marca} ${turno.vehiculo.modelo} ${turno.vehiculo.anio}${turno.vehiculo.patente ? ` · ${turno.vehiculo.patente}` : ''}`
    : null

  const activo = !['cancelado', 'realizado', 'no_asistio'].includes(turno.estado)

  return (
    <div style={{
      background: 'var(--c-surface)', border: '1px solid var(--c-border)',
      borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6,
      borderLeft: `3px solid ${ESTADOS[turno.estado]?.color || '#3B82F6'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: 'var(--c-accent)' }}>
          {fmtHora(turno.hora)}
        </span>
        <span style={{ fontSize: 12, color: 'var(--c-fg-2)', background: 'var(--c-bg)', padding: '2px 7px', borderRadius: 12 }}>
          {tipo}
        </span>
        <EstadoBadge estado={turno.estado} />
        {turno.duracion_min && (
          <span style={{ fontSize: 11, color: 'var(--c-fg-3)' }}>{turno.duracion_min} min</span>
        )}
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-fg)' }}>{nombre}</div>
      {turno.prospecto?.telefono && (
        <div style={{ fontSize: 12, color: 'var(--c-fg-2)' }}>{turno.prospecto.telefono}</div>
      )}
      {vehiculo && (
        <div style={{ fontSize: 12, color: 'var(--c-fg-2)' }}>🚗 {vehiculo}</div>
      )}
      {turno.notas && (
        <div style={{ fontSize: 12, color: 'var(--c-fg-3)', fontStyle: 'italic' }}>{turno.notas}</div>
      )}

      {activo && (
        <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
          {turno.estado === 'programado' && (
            <button className="btn secondary" style={{ fontSize: 11, padding: '3px 10px' }}
              onClick={() => onCambiarEstado(turno.id, 'confirmado')}>
              Confirmar
            </button>
          )}
          <button className="btn primary" style={{ fontSize: 11, padding: '3px 10px' }}
            onClick={() => onCambiarEstado(turno.id, 'realizado')}>
            Realizado
          </button>
          <button className="btn ghost" style={{ fontSize: 11, padding: '3px 10px', color: 'var(--c-fg-3)' }}
            onClick={() => onCambiarEstado(turno.id, 'cancelado')}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}

// ── Modal formulario ──────────────────────────────────────────
function FormTurno({ vehiculos, vendedores, preVehiculoId, onClose, onGuardar }) {
  const [form, setForm] = useState({
    tipo: 'prueba_manejo',
    vehiculo_id: preVehiculoId || '',
    nombre: '',
    telefono: '',
    fecha: hoy(),
    hora: '10:00',
    duracion_min: 60,
    vendedor_id: '',
    notas: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleGuardar() {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio'); return }
    if (!form.fecha) { setError('La fecha es obligatoria'); return }
    setSaving(true)
    try {
      // Crear prospecto on-the-fly o usar nombre en título
      const payload = {
        tipo: form.tipo,
        vehiculo_id: form.vehiculo_id || null,
        vendedor_id: form.vendedor_id || null,
        titulo: form.nombre.trim(),
        fecha: form.fecha,
        hora: form.hora,
        duracion_min: Number(form.duracion_min),
        estado: 'programado',
        notas: form.notas || null,
      }
      await onGuardar(payload, form.nombre.trim(), form.telefono.trim())
      onClose()
    } catch (e) {
      setError(e.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label className="form-label">Tipo</label>
          <select className="input" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
            {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Vehículo</label>
          <select className="input" value={form.vehiculo_id} onChange={e => set('vehiculo_id', e.target.value)}>
            <option value="">— Sin vehículo —</option>
            {vehiculos.map(v => (
              <option key={v.id} value={v.id}>
                {v.marca} {v.modelo} {v.anio}{v.patente ? ` · ${v.patente}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label className="form-label">Nombre del interesado *</label>
          <input className="input" value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Ej: Juan García" />
        </div>
        <div>
          <label className="form-label">Teléfono</label>
          <input className="input" value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="+54 9 11 ..." />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div>
          <label className="form-label">Fecha *</label>
          <input className="input" type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)} />
        </div>
        <div>
          <label className="form-label">Hora</label>
          <input className="input" type="time" value={form.hora} onChange={e => set('hora', e.target.value)} />
        </div>
        <div>
          <label className="form-label">Duración</label>
          <select className="input" value={form.duracion_min} onChange={e => set('duracion_min', e.target.value)}>
            {DURACIONES.map(d => <option key={d} value={d}>{d} min</option>)}
          </select>
        </div>
      </div>

      {vendedores.length > 0 && (
        <div>
          <label className="form-label">Vendedor</label>
          <select className="input" value={form.vendedor_id} onChange={e => set('vendedor_id', e.target.value)}>
            <option value="">— Sin asignar —</option>
            {vendedores.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="form-label">Notas</label>
        <textarea className="input" rows={3} value={form.notas} onChange={e => set('notas', e.target.value)}
          placeholder="Observaciones adicionales..." style={{ resize: 'vertical' }} />
      </div>

      {error && <div style={{ color: '#EF4444', fontSize: 13 }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
        <button className="btn primary" disabled={saving} onClick={handleGuardar}>
          {saving ? 'Guardando…' : 'Guardar turno'}
        </button>
      </div>
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────
export default function Agenda({ onLogout }) {
  const [searchParams] = useSearchParams()
  const preVehiculoId = searchParams.get('vehiculo_id') || ''

  const [turnos, setTurnos]       = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)

  const semana = diasSemana()
  const todayIso = hoy()

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      const desde = semana[0].iso
      const hasta = semana[6].iso
      const data = await getAgenda({ desde, hasta })
      setTurnos(data)
    } catch (e) {
      console.error('Agenda.cargar:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargar()
    Promise.all([
      getVehiculos({ estado: 'disponible' }),
      getVendedores(),
    ]).then(([vs, vends]) => {
      setVehiculos(vs)
      setVendedores(vends.filter(v => v.activo))
    }).catch(console.error)
  }, [cargar])

  async function handleCambiarEstado(id, estado) {
    try {
      await updateTurno(id, { estado })
      setTurnos(ts => ts.map(t => t.id === id ? { ...t, estado } : t))
    } catch (e) {
      console.error('updateTurno:', e)
    }
  }

  async function handleGuardar(payload, nombre, telefono) {
    // Intentar crear prospecto si hay teléfono o nombre, de lo contrario usar titulo
    let prospecto_id = null
    if (nombre) {
      try {
        const { data: p, error } = await import('../lib/supabase').then(m =>
          m.supabase.from('prospectos').insert([{
            nombre, telefono: telefono || null, estado: 'nuevo',
            vehiculo_id: payload.vehiculo_id || null,
          }]).select().single()
        )
        if (!error && p) prospecto_id = p.id
      } catch (_) {}
    }
    const nuevo = await crearTurno({ ...payload, prospecto_id })
    setTurnos(ts => [...ts, { ...nuevo, vehiculo: vehiculos.find(v => v.id === nuevo.vehiculo_id) || null, prospecto: prospecto_id ? { nombre, telefono } : null }])
  }

  const turnosHoy = turnos.filter(t => t.fecha === todayIso)
    .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))

  const turnosPorDia = (dia) => turnos.filter(t => t.fecha === dia)
    .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Agenda</h1>
            <p className="page-caption">Turnos, pruebas de manejo y visitas</p>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn primary" onClick={() => setShowForm(true)}>
            <Icon name="plus" size={14} /> Nuevo turno
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--c-fg-3)' }}>Cargando…</div>
        ) : (
          <>
            {/* Turnos de hoy */}
            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--c-fg)' }}>
                Hoy — {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                {turnosHoy.length > 0 && (
                  <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--c-fg-2)', fontWeight: 400 }}>
                    {turnosHoy.length} turno{turnosHoy.length !== 1 ? 's' : ''}
                  </span>
                )}
              </h2>
              {turnosHoy.length === 0 ? (
                <div style={{
                  background: 'var(--c-surface)', border: '1px solid var(--c-border)',
                  borderRadius: 10, padding: '24px 20px', textAlign: 'center',
                  color: 'var(--c-fg-3)', fontSize: 14,
                }}>
                  Sin turnos para hoy
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {turnosHoy.map(t => (
                    <TurnoCard key={t.id} turno={t} onCambiarEstado={handleCambiarEstado} />
                  ))}
                </div>
              )}
            </section>

            {/* Vista semanal */}
            <section>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--c-fg)' }}>
                Próximos 7 días
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 12,
              }}>
                {semana.map(dia => {
                  const dTurnos = turnosPorDia(dia.iso)
                  const esHoy = dia.iso === todayIso
                  return (
                    <div key={dia.iso} style={{
                      background: 'var(--c-surface)',
                      border: `1px solid ${esHoy ? 'var(--c-accent)' : 'var(--c-border)'}`,
                      borderRadius: 10, padding: '12px 12px 14px',
                      opacity: esHoy ? 1 : 0.85,
                    }}>
                      <div style={{
                        fontSize: 12, fontWeight: 700, marginBottom: 8,
                        color: esHoy ? 'var(--c-accent)' : 'var(--c-fg-2)',
                        textTransform: 'capitalize',
                      }}>
                        {dia.label}
                        {dTurnos.length > 0 && (
                          <span style={{
                            marginLeft: 6, background: esHoy ? 'var(--c-accent)' : 'var(--c-fg-3)',
                            color: '#fff', borderRadius: 10, fontSize: 10, padding: '1px 6px',
                          }}>
                            {dTurnos.length}
                          </span>
                        )}
                      </div>
                      {dTurnos.length === 0 ? (
                        <div style={{ fontSize: 12, color: 'var(--c-fg-3)', textAlign: 'center', padding: '8px 0' }}>—</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {dTurnos.map(t => (
                            <div key={t.id} style={{
                              fontSize: 12, display: 'flex', alignItems: 'flex-start', gap: 6,
                              borderLeft: `2px solid ${ESTADOS[t.estado]?.color || '#3B82F6'}`,
                              paddingLeft: 6,
                            }}>
                              <span style={{ fontFamily: 'var(--mono)', color: 'var(--c-accent)', minWidth: 34 }}>
                                {fmtHora(t.hora)}
                              </span>
                              <span style={{ color: 'var(--c-fg)', lineHeight: 1.3 }}>
                                {t.prospecto?.nombre || t.titulo || '—'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}
      </div>

      {showForm && (
        <Modal title="Nuevo turno" onClose={() => setShowForm(false)}>
          <FormTurno
            vehiculos={vehiculos}
            vendedores={vendedores}
            preVehiculoId={preVehiculoId}
            onClose={() => setShowForm(false)}
            onGuardar={handleGuardar}
          />
        </Modal>
      )}
    </div>
  )
}
