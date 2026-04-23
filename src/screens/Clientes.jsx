import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import Icon from '../components/Icon'
import { getClientes, createCliente, updateCliente } from '../lib/supabase'
import { callAIFiles, aiConfigured } from '../lib/api'

export default function Clientes({ onLogout }) {
  const [clientes, setClientes] = useState([])
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(null)
  const [saving, setSaving]     = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [form, setForm] = useState({
    nombre: '', dni: '', telefono: '', email: '', whatsapp: '',
    domicilio: '', localidad: '', cuit_cuil: '', notas: '', activo: true,
  })

  function reload(q) { getClientes({ search: q }).then(setClientes) }
  useEffect(() => { reload('') }, [])

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.type === 'checkbox' ? e.target.checked : e.target.value }))

  function openNew() {
    setForm({ nombre: '', dni: '', telefono: '', email: '', whatsapp: '',
      domicilio: '', localidad: '', cuit_cuil: '', notas: '', activo: true })
    setModal('new')
  }
  function openEdit(c) {
    setForm({ nombre: c.nombre || '', dni: c.dni || '', telefono: c.telefono || '',
      email: c.email || '', whatsapp: c.whatsapp || '', domicilio: c.domicilio || '',
      localidad: c.localidad || '', cuit_cuil: c.cuit_cuil || '', notas: c.notas || '',
      activo: c.activo !== false })
    setModal(c)
  }

  async function save() {
    if (!form.nombre) return
    setSaving(true)
    try {
      if (modal === 'new') await createCliente(form)
      else await updateCliente(modal.id, form)
      reload(search)
      setModal(null)
    } finally { setSaving(false) }
  }

  async function handleScanDoc(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setAiLoading(true)
    try {
      const data = await callAIFiles('/ai/ocr-documento', files)
      setForm(p => ({
        ...p,
        nombre: [data.apellido, data.nombre].filter(Boolean).join(', ') || p.nombre,
        dni: data.dni || p.dni,
        domicilio: data.domicilio || p.domicilio,
        localidad: data.localidad || p.localidad,
        cuit_cuil: data.cuit_cuil || p.cuit_cuil,
        telefono: data.telefono || p.telefono,
        email: data.email || p.email,
      }))
    } catch (e) {
      alert('Error IA: ' + e.message)
    } finally { setAiLoading(false) }
    e.target.value = ''
  }

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Clientes</h1>
            <p className="page-caption">{clientes.length} registrados</p>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative' }}>
            <input className="input" placeholder="Buscar por nombre, DNI o tel…" value={search}
              style={{ width: 260 }}
              onChange={e => { setSearch(e.target.value); reload(e.target.value) }} />
          </div>
          <button className="btn primary" onClick={openNew}>
            <Icon name="plus" size={14} /> Nuevo cliente
          </button>
        </div>

        {clientes.length === 0
          ? <div className="banner info"><Icon name="info" size={16} />No hay clientes{search ? ' con ese criterio' : ' registrados'}.</div>
          : (
            <table className="rank">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Localidad</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.nombre}</strong></td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--c-fg-2)' }}>{c.dni || '—'}</td>
                    <td style={{ color: 'var(--c-fg-2)', fontSize: 12 }}>{c.telefono || c.whatsapp || '—'}</td>
                    <td style={{ color: 'var(--c-fg-2)', fontSize: 12 }}>{c.email || '—'}</td>
                    <td style={{ color: 'var(--c-fg-2)', fontSize: 12 }}>{c.localidad || '—'}</td>
                    <td>
                      <span className={`badge ${c.activo !== false ? 'success' : 'neutral'}`}>
                        <span className="cdot" />{c.activo !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <button className="btn ghost" onClick={() => openEdit(c)}>
                        <Icon name="edit" size={14} /> Editar
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
        <Modal title={modal === 'new' ? 'Nuevo cliente' : 'Editar cliente'} onClose={() => setModal(null)} wide>
          {aiConfigured() && (
            <div style={{ marginBottom: 14 }}>
              <button className="btn secondary" onClick={() => document.getElementById('doc-scan-input').click()}
                disabled={aiLoading} style={{ fontSize: 13 }}>
                <Icon name="image" size={14} />
                {aiLoading ? 'Escaneando…' : 'Escanear DNI / documento'}
              </button>
              <input id="doc-scan-input" type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={handleScanDoc} />
              <span style={{ fontSize: 12, color: 'var(--c-fg-3)', marginLeft: 10 }}>Autocompleta el formulario</span>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Nombre completo" required>
              <input className="input" value={form.nombre} onChange={f('nombre')} placeholder="García, Juan" />
            </FormField>
            <FormField label="DNI">
              <input className="input" value={form.dni} onChange={f('dni')} placeholder="30123456" />
            </FormField>
            <FormField label="Teléfono">
              <input className="input" value={form.telefono} onChange={f('telefono')} placeholder="+54 9 11..." />
            </FormField>
            <FormField label="WhatsApp">
              <input className="input" value={form.whatsapp} onChange={f('whatsapp')} placeholder="+54 9 11..." />
            </FormField>
            <FormField label="Email">
              <input className="input" type="email" value={form.email} onChange={f('email')} />
            </FormField>
            <FormField label="CUIT/CUIL">
              <input className="input" value={form.cuit_cuil} onChange={f('cuit_cuil')} placeholder="20-30123456-4" />
            </FormField>
            <FormField label="Domicilio">
              <input className="input" value={form.domicilio} onChange={f('domicilio')} placeholder="Av. Corrientes 1234" />
            </FormField>
            <FormField label="Localidad">
              <input className="input" value={form.localidad} onChange={f('localidad')} placeholder="Buenos Aires" />
            </FormField>
          </div>
          <div style={{ marginTop: 12 }}>
            <FormField label="Notas">
              <textarea className="input" rows={2} value={form.notas} onChange={f('notas')} style={{ resize: 'vertical' }} />
            </FormField>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, marginTop: 12 }}>
            <input type="checkbox" checked={form.activo} onChange={e => setForm(p => ({ ...p, activo: e.target.checked }))} />
            Cliente activo
          </label>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn secondary" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn primary" onClick={save} disabled={saving || !form.nombre}>
              {saving ? 'Guardando…' : <><Icon name="check" size={14} /> Guardar</>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
