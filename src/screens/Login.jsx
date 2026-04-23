import { useState } from 'react'
import { getPin } from '../lib/supabase'
import Icon from '../components/Icon'

export default function Login({ onLogin }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const stored = await getPin()
    if (!stored) {
      setError('PIN no configurado. Contactá al administrador.')
    } else if (pin.trim() === stored.trim()) {
      onLogin()
    } else {
      setError('PIN incorrecto')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--c-bg)',
    }}>
      <div style={{ width: 340 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="brand-mark" style={{ width: 48, height: 48, fontSize: 18, margin: '0 auto 12px', borderRadius: 12 }}>GH</div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700 }}>GH Cars</h1>
          <p style={{ margin: 0, color: 'var(--c-fg-2)', fontSize: 13 }}>Sistema de Gestión Automotriz</p>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600, color: 'var(--c-fg-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Acceso
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--c-fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                PIN
              </label>
              <input
                className="input"
                type="password"
                placeholder="Ingresá tu PIN"
                value={pin}
                onChange={e => setPin(e.target.value)}
                autoFocus
              />
            </div>
            {error && (
              <div className="banner warning" style={{ margin: 0 }}>
                <Icon name="alert" size={16} />
                {error}
              </div>
            )}
            <button
              className="btn primary"
              type="submit"
              disabled={loading || !pin}
              style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            >
              {loading ? 'Verificando…' : 'Acceder'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
