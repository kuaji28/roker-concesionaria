import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createProspecto } from '../lib/supabase'
import VendedorTabs from '../components/VendedorTabs'

const FUENTES = ['WhatsApp', 'Instagram', 'Web', 'Referido', 'Pasó por local']

function fmt(n) { return (n || 0).toLocaleString('es-AR') }

export default function VendedorLead() {
  const navigate = useNavigate()
  const location = useLocation()
  const vehiculo = location.state?.vehiculo || null

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [fuente, setFuente] = useState('WhatsApp')
  const [nota, setNota] = useState('')
  const [partePago, setPartePago] = useState(false)
  const [financiacion, setFinanciacion] = useState(false)
  const [recordatorio, setRecordatorio] = useState(true)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSave() {
    if (!nombre.trim()) return
    setSaving(true)
    try {
      await createProspecto({
        nombre: nombre.trim(),
        telefono: telefono.trim() || null,
        email: email.trim() || null,
        fuente,
        notas: nota.trim() || null,
        vehiculo_interes: vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}` : null,
        vehiculo_id: vehiculo?.id || null,
        parte_de_pago: partePago,
        necesita_financiacion: financiacion,
      })
      setDone(true)
      setTimeout(() => navigate('/vendedor'), 1200)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  function Toggle({ on, onToggle }) {
    return (
      <div
        onClick={onToggle}
        style={{ width: 40, height: 22, borderRadius: 999, background: on ? 'var(--c-accent)' : 'var(--c-border)', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background .2s' }}
      >
        <div style={{ width: 18, height: 18, borderRadius: 999, background: '#fff', position: 'absolute', top: 2, left: on ? 20 : 2, transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
      </div>
    )
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', color: 'var(--c-fg)', maxWidth: 480, margin: '0 auto' }}>
      {/* Top bar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--c-card)', border: 0, color: 'var(--c-fg)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h1 style={{ flex: 1, fontSize: 16, fontWeight: 700, margin: 0 }}>Nuevo lead</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 140 }}>
        {/* Vehicle context card */}
        <div style={{ margin: '12px 16px 0', padding: '12px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--c-card)', borderRadius: 12, border: '1px solid var(--c-border)' }}>
          {vehiculo?.foto_url ? (
            <img src={vehiculo.foto_url} alt="" style={{ width: 52, height: 38, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 52, height: 38, borderRadius: 6, background: 'var(--c-card-2)', flexShrink: 0, display: 'grid', placeItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-fg-3)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>
              {vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}` : 'Sin vehículo seleccionado'}
            </p>
            {vehiculo?.precio && <p style={{ fontSize: 11, color: 'var(--c-fg-2)', margin: '1px 0 0' }}>USD {fmt(vehiculo.precio)}</p>}
          </div>
          <button
            onClick={() => navigate('/vendedor')}
            style={{ background: 'transparent', border: 0, color: 'var(--c-accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '4px 8px' }}
          >
            Cambiar
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Nombre */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--c-fg-2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Nombre *</label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Juan García"
              style={{ width: '100%', padding: '12px 14px', background: 'var(--c-card)', border: `1px solid ${nombre ? 'var(--c-border)' : nombre === '' && saving ? 'var(--c-accent)' : 'var(--c-border)'}`, borderRadius: 10, color: 'var(--c-fg)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          {/* Telefono */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--c-fg-2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              placeholder="+54 11 1234-5678"
              style={{ width: '100%', padding: '12px 14px', background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 10, color: 'var(--c-fg)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--c-fg-2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Email (opcional)</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="juan@email.com"
              style={{ width: '100%', padding: '12px 14px', background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 10, color: 'var(--c-fg)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          {/* Fuente */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--c-fg-2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Cómo se enteró</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FUENTES.map(f => (
                <button
                  key={f}
                  onClick={() => setFuente(f)}
                  style={{ padding: '8px 14px', borderRadius: 999, background: fuente === f ? 'var(--c-accent)' : 'var(--c-card)', color: fuente === f ? '#fff' : 'var(--c-fg-2)', border: fuente === f ? 'none' : '1px solid var(--c-border)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >{f}</button>
              ))}
            </div>
          </div>

          {/* Nota */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--c-fg-2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Nota</label>
            <textarea
              value={nota}
              onChange={e => setNota(e.target.value)}
              placeholder="¿Qué comentó? ¿Qué necesita?"
              rows={3}
              style={{ width: '100%', padding: '12px 14px', background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 10, color: 'var(--c-fg)', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'none', lineHeight: 1.5 }}
            />
          </div>

          {/* Toggles */}
          {[
            { label: 'Tiene auto en parte de pago', value: partePago, set: setPartePago },
            { label: 'Necesita financiación', value: financiacion, set: setFinanciacion },
            { label: 'Recordarme en 2 días', value: recordatorio, set: setRecordatorio },
          ].map(t => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--c-card)', borderRadius: 10, border: '1px solid var(--c-border)' }}>
              <span style={{ fontSize: 14 }}>{t.label}</span>
              <Toggle on={t.value} onToggle={() => t.set(v => !v)} />
            </div>
          ))}
        </div>
      </div>

      {/* Sticky save */}
      <div style={{ padding: '12px 16px 4px', background: 'var(--c-bg)', borderTop: '1px solid var(--c-border)', flexShrink: 0 }}>
        <button
          onClick={handleSave}
          disabled={saving || !nombre.trim()}
          style={{ width: '100%', padding: '14px', background: done ? 'var(--c-success)' : 'var(--c-fg)', color: done ? '#fff' : 'var(--c-bg)', border: 0, borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: nombre.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: saving ? 0.7 : 1, transition: 'background .2s' }}
        >
          {done ? '✓ Lead guardado' : saving ? 'Guardando…' : 'Guardar lead'}
        </button>
      </div>

      <VendedorTabs active="lead" />
    </div>
  )
}
