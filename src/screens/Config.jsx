import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import Icon from '../components/Icon'
import FormField from '../components/FormField'
import { supabase, updatePinUsuario, getTC, updateTC } from '../lib/supabase'

export default function Config({ onLogout }) {
  const currentUser = (() => {
    try { return JSON.parse(sessionStorage.getItem('gh_auth_user') || '{}') } catch { return {} }
  })()

  const [pin, setPin]           = useState({ new1: '', new2: '' })
  const [pinMsg, setPinMsg]     = useState(null)
  const [tc, setTc]             = useState('')
  const [tcMsg, setTcMsg]       = useState(null)
  const [savingPin, setSavingPin] = useState(false)
  const [savingTc, setSavingTc]   = useState(false)
  const [waNumber, setWaNumber]   = useState('')
  const [waMsg, setWaMsg]         = useState(null)
  const [savingWa, setSavingWa]   = useState(false)

  useEffect(() => { getTC().then(v => setTc(String(v))) }, [])
  useEffect(() => {
    supabase.from('config').select('valor').eq('clave', 'wa_number').single()
      .then(({ data }) => { if (data?.valor) setWaNumber(data.valor) })
      .catch(() => {})
  }, [])

  async function changePin() {
    setPinMsg(null)
    if (!pin.new1 || pin.new1.length < 4) { setPinMsg({ type: 'warning', text: 'El PIN debe tener al menos 4 dígitos.' }); return }
    if (pin.new1 !== pin.new2) { setPinMsg({ type: 'warning', text: 'Los PINs no coinciden.' }); return }
    if (!currentUser?.id) { setPinMsg({ type: 'warning', text: 'Sesión inválida — volvé a iniciar sesión.' }); return }
    setSavingPin(true)
    try {
      await updatePinUsuario(currentUser.id, pin.new1)
      setPinMsg({ type: 'success', text: `PIN de ${currentUser.nombre} actualizado.` })
      setPin({ new1: '', new2: '' })
    } catch (e) {
      setPinMsg({ type: 'warning', text: e.message || 'Error al cambiar PIN.' })
    } finally {
      setSavingPin(false)
    }
  }

  async function changeTc() {
    const v = Number(tc)
    if (!v || v < 100) { setTcMsg({ type: 'warning', text: 'Ingresá un tipo de cambio válido.' }); return }
    setSavingTc(true)
    try {
      await updateTC(v)
      setTcMsg({ type: 'success', text: 'Tipo de cambio actualizado.' })
    } catch (e) {
      setTcMsg({ type: 'warning', text: e.message })
    } finally {
      setSavingTc(false)
    }
  }

  async function changeWa() {
    const val = waNumber.trim().replace(/\D/g, '')
    if (!val || val.length < 10) { setWaMsg({ type: 'warning', text: 'Ingresá un número válido (solo dígitos, con código de país).' }); return }
    setSavingWa(true)
    try {
      const { error } = await supabase.from('config').upsert({ clave: 'wa_number', valor: val }, { onConflict: 'clave' })
      if (error) throw error
      setWaMsg({ type: 'success', text: 'Número de WhatsApp actualizado.' })
      setWaNumber(val)
    } catch (e) {
      setWaMsg({ type: 'warning', text: e.message || 'Error al guardar.' })
    } finally {
      setSavingWa(false)
    }
  }

  const fp = (k) => (e) => setPin(p => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main" style={{ maxWidth: 560 }}>
        <div className="page-head">
          <div>
            <h1 className="page-title">Configuración</h1>
            <p className="page-caption">Ajustes del sistema GH Cars</p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="cog" size={14} /> Mi PIN{currentUser?.nombre ? ` — ${currentUser.nombre}` : ''}
          </h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <FormField label="PIN nuevo">
              <input className="input" type="password" placeholder="····" value={pin.new1} onChange={fp('new1')} maxLength={20} />
            </FormField>
            <FormField label="Confirmar PIN">
              <input className="input" type="password" placeholder="····" value={pin.new2} onChange={fp('new2')} maxLength={20} />
            </FormField>
            {pinMsg && (
              <div className={`banner ${pinMsg.type}`}>
                <Icon name={pinMsg.type === 'success' ? 'check' : 'alert'} size={16} />{pinMsg.text}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn primary" onClick={changePin} disabled={savingPin}>
                {savingPin ? 'Guardando…' : <><Icon name="check" size={14} /> Guardar PIN</>}
              </button>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600 }}>🔗 Link del catálogo público</h3>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--c-fg-2)' }}>
            Compartí este link con vendedores externos y clientes. No requiere login.
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <code style={{ flex: 1, padding: '8px 12px', background: 'var(--c-card-2)', borderRadius: 6, fontSize: 12, wordBreak: 'break-all' }}>
              {window.location.origin}/p/catalogo
            </code>
            <button
              className="btn btn-ghost"
              onClick={() => navigator.clipboard.writeText(window.location.origin + '/p/catalogo')}
            >
              Copiar
            </button>
            <a
              href="/p/catalogo"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
              style={{ textDecoration: 'none' }}
            >
              Ver
            </a>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="message" size={14} /> WhatsApp de contacto
          </h3>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--c-fg-2)' }}>
            Número que se usa en el catálogo público y en los presupuestos por WhatsApp. Incluí el código de país sin el +.
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            <FormField label="Número WhatsApp (ej: 5491162692000)" hint="Código de país + número, sin espacios ni guiones">
              <input className="input" type="tel" value={waNumber} onChange={e => setWaNumber(e.target.value)} placeholder="5491162692000" />
            </FormField>
            {waMsg && (
              <div className={`banner ${waMsg.type}`}>
                <Icon name={waMsg.type === 'success' ? 'check' : 'alert'} size={16} />{waMsg.text}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn primary" onClick={changeWa} disabled={savingWa}>
                {savingWa ? 'Guardando…' : <><Icon name="check" size={14} /> Guardar número</>}
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="cash" size={14} /> Tipo de cambio USD/ARS
          </h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <FormField label="$ ARS por 1 USD" hint="Se usa para mostrar precios en pesos en toda la app">
              <input className="input" type="number" value={tc} onChange={e => setTc(e.target.value)} placeholder="1415" min={1} />
            </FormField>
            {tcMsg && (
              <div className={`banner ${tcMsg.type}`}>
                <Icon name={tcMsg.type === 'success' ? 'check' : 'alert'} size={16} />{tcMsg.text}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn primary" onClick={changeTc} disabled={savingTc}>
                {savingTc ? 'Guardando…' : <><Icon name="check" size={14} /> Actualizar TC</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
