import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import Icon from '../components/Icon'
import { getProspectos, createProspecto, updateProspecto, getVehiculos, getVendedores } from '../lib/supabase'

const ESTADOS = ['nuevo', 'contactado', 'visita_agendada', 'visita_realizada', 'convertido', 'descartado']
const CANALES = ['presencial', 'telegram', 'whatsapp', 'ml', 'web']
const ESTADO_COLOR = {
  nuevo: 'neutral', contactado: 'info', visita_agendada: 'warning',
  visita_realizada: 'warning', convertido: 'success', descartado: 'neutral',
}

export default function Leads({ onLogout }) {
  const [leads, setLeads]       = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [filtro, setFiltro]     = useState('activos')
  const [modal, setModal]       = useState(null)
  const [saving, setSaving]     = useState(false)
  const [form, setForm] = useState({
    nombre: '', telefono: '', email: '', canal: 'presencial',
    presupuesto_usd: '', interes: '', estado: 'nuevo',
    vehiculo_id: '', vendedor_id: '', notas: '',
  })

  function reload() {
    getProspectos().then(setLeads)
  }

  useEffect(() => {
    reload()
    getVehiculos({ estado: 'disponible' }).then(setVehiculos)
    getVendedores().then(setVendedores)
  }, [])

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  function openNew() {
    setForm({
      nombre: '', telefono: '', email: '', canal: 'presencial',
      presupuesto_usd: '', interes: '', estado: 'nuevo',
      vehiculo_id: '', vendedor_id: '', notas: '',
    })
    setModal('new')
  }

  function openEdit(lead) {
    setForm({
      nombre: lead.nombre || '', telefono: lead.telefono || '',
      email: lead.email || '', canal: lead.canal || 'presencial',
      presupuesto_usd: lead.presupuesto_usd || '', interes: lead.interes || '',
      estado: lead.estado || 'nuevo', vehiculo_id: lead.vehiculo_id || '',
      vendedor_id: lead.vendedor_id || '', notas: lead.notas || '',
    })
    setModal(lead)
  }

  async function save() {
    if (!form.nombre) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        presupuesto_usd: form.presupuesto_usd ? Number(form.presupuesto_usd) : null,
        vehiculo_id: form.vehiculo_id || null,
        vendedor_id: form.vendedor_id || null,
      }
      if (modal === 'new') await createProspecto(payload)
      else await updateProspecto(modal.id, payload)
      reload()
      setModal(null)
    } finally {
      setSaving(false)
    }
  }

  const activos = leads.filter(l => !['convertido', 'descartado'].includes(l.estado))
  const todos   = leads
  const shown   = filtro === 'activos' ? activos : todos

  const byEstado = ESTADOS.slice(0, 4).map(e => ({
    estado: e,
    count: activos.filter(l => l.estado === e).length,
  }))

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Leads</h1>
            <p className="page-caption">{activos.length} activos · {leads.length} total</p>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn primary" onClick={openNew}>
            <Icon name="plus" size={14} /> Nuevo lead
          </button>
        </div>

        <div className="detail-head" style={{ marginBottom: 16 }}>
          {byEstado.map(({ estado, count }) => (
            <div className="dm" key={estado}>
              <div className="lbl">{estado.replace('_', ' ')}</div>
              <div className="val">{count}</div>
            </div>
          ))}
          <div className="dm">
            <div className="lbl">convertidos</div>
            <div className="val g">{leads.filter(l => l.estado === 'convertido').length}</div>
          </div>
        </div>

        <div className="tabs" style={{ marginBottom: 12 }}>
          {[['activos', 'Activos'], ['todos', 'Todos']].map(([k, l]) => (
            <button key={k} className={filtro === k ? 'on' : ''} onClick={() => setFiltro(k)}>{l}</button>
          ))}
        </div>

        {shown.length === 0
          ? <div className="banner info"><Icon name="info" size={16} />No hay leads{filtro === 'activos' ? ' activos' : ''}.</div>
          : (
            <table className="rank">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Canal</th>
                  <th>Vehículo de interés</th>
                  <th className="num">Presupuesto</th>
                  <th>Estado</th>
                  <th>Vendedor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shown.map(lead => (
                  <tr key={lead.id}>
                    <td>
                      <strong>{lead.nombre}</strong>
                      {lead.telefono && <div style={{ fontSize: 11, color: 'var(--c-fg-2)' }}>{lead.telefono}</div>}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--c-fg-2)', textTransform: 'capitalize' }}>{lead.canal}</td>
                    <td style={{ fontSize: 12, color: 'var(--c-fg-2)' }}>
                      {lead.vehiculos
                        ? `${lead.vehiculos.marca} ${lead.vehiculos.modelo} ${lead.vehiculos.anio}`
                        : lead.interes || '—'}
                    </td>
                    <td className="num" style={{ fontSize: 13 }}>
                      {lead.presupuesto_usd ? `USD ${Number(lead.presupuesto_usd).toLocaleString('es-AR')}` : '—'}
                    </td>
                    <td>
                      <span className={`badge ${ESTADO_COLOR[lead.estado] || 'neutral'}`}>
                        <span className="cdot" />
                        {lead.estado.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--c-fg-2)' }}>{lead.vendedores?.nombre || '—'}</td>
                    <td>
                      <button className="btn ghost" onClick={() => openEdit(lead)}>
                        <Icon name="edit" size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>

      {modal && (
        <Modal title={modal === 'new' ? 'Nuevo lead' : 'Editar lead'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gap: 12 }}>
            <FormField label="Nombre" required>
              <input className="input" value={form.nombre} onChange={f('nombre')} placeholder="Juan Pérez" />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Teléfono">
                <input className="input" value={form.telefono} onChange={f('telefono')} placeholder="+54 9 11..." />
              </FormField>
              <FormField label="Email">
                <input className="input" type="email" value={form.email} onChange={f('email')} />
              </FormField>
              <FormField label="Canal">
                <select className="input" value={form.canal} onChange={f('canal')}>
                  {CANALES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </FormField>
              <FormField label="Estado">
                <select className="input" value={form.estado} onChange={f('estado')}>
                  {ESTADOS.map(e => <option key={e} value={e}>{e.replace(/_/g, ' ')}</option>)}
                </select>
              </FormField>
              <FormField label="Presupuesto (USD)">
                <input className="input" type="number" value={form.presupuesto_usd} onChange={f('presupuesto_usd')} placeholder="15000" />
              </FormField>
              <FormField label="Interés (texto libre)">
                <input className="input" value={form.interes} onChange={f('interes')} placeholder="Toyota Corolla 2020" />
              </FormField>
              <FormField label="Vehículo en stock">
                <select className="input" value={form.vehiculo_id} onChange={f('vehiculo_id')}>
                  <option value="">— ninguno —</option>
                  {vehiculos.map(v => (
                    <option key={v.id} value={v.id}>{v.marca} {v.modelo} {v.anio} — USD {v.precio_base?.toLocaleString('es-AR')}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Vendedor">
                <select className="input" value={form.vendedor_id} onChange={f('vendedor_id')}>
                  <option value="">— ninguno —</option>
                  {vendedores.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                </select>
              </FormField>
            </div>
            <FormField label="Notas">
              <textarea className="input" rows={2} value={form.notas} onChange={f('notas')} style={{ resize: 'vertical' }} />
            </FormField>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn primary" onClick={save} disabled={saving || !form.nombre}>
                {saving ? 'Guardando…' : <><Icon name="check" size={14} /> Guardar</>}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
