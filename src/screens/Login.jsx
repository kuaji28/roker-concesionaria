import { useState } from 'react'
import { loginUsuario } from '../lib/supabase'
import Icon from '../components/Icon'
import GHLogo from '../components/GHLogo'
import ThemeToggle from '../components/ThemeToggle'

const ADDRESS = 'Av. Juan Domingo Perón 2440, Benavidez'

export default function Login({ onLogin }) {
  const [nombre, setNombre] = useState('')
  const [pin, setPin]       = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nombre.trim() || !pin.trim()) {
      setError('Completá nombre y PIN')
      return
    }
    setLoading(true)
    setError('')
    try {
      const user = await loginUsuario(nombre, pin)
      onLogin(user)
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--c-bg)',
      color: 'var(--c-fg)',
    }} className="login-grid">

      {/* Panel izquierdo — marca */}
      <div style={{
        background: 'linear-gradient(135deg, var(--c-bg-2) 0%, var(--c-bg) 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: 56,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
      }}>
        {/* Blur orbs */}
        <div style={{
          position: 'absolute', top: -100, right: -100,
          width: 400, height: 400, borderRadius: 999,
          background: 'rgba(220,38,38,0.13)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 300, height: 300, borderRadius: 999,
          background: 'rgba(220,38,38,0.08)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ position: 'relative' }}>
          <GHLogo size={52} />
        </div>

        {/* Headline */}
        <div style={{ position: 'relative' }}>
          <p style={{
            fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase',
            color: 'var(--c-accent)', margin: 0, fontWeight: 700,
          }}>
            Sistema interno
          </p>
          <h1 style={{
            fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800,
            margin: '12px 0 0', letterSpacing: '-0.03em', lineHeight: 1,
            color: 'var(--c-fg)',
          }}>
            Gestión<br />Automotriz
          </h1>
          <p style={{
            fontSize: 15, color: 'var(--c-fg-2)',
            margin: '20px 0 0', maxWidth: 360, lineHeight: 1.6,
          }}>
            Stock, ventas, leads y reportes — todo en un solo lugar.
          </p>
        </div>

        {/* Footer */}
        <p style={{ fontSize: 12, color: 'var(--c-fg-3)', margin: 0, position: 'relative' }}>
          v3.7 · {ADDRESS}
        </p>
      </div>

      {/* Panel derecho — formulario */}
      <div style={{
        display: 'grid', placeItems: 'center',
        padding: 56, position: 'relative',
        minHeight: '100vh',
      }}>
        {/* Theme toggle top-right */}
        <div style={{ position: 'absolute', top: 24, right: 24 }}>
          <ThemeToggle />
        </div>

        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{
            fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.02em',
            color: 'var(--c-fg)',
          }}>
            Iniciar sesión
          </h2>
          <p style={{ fontSize: 14, color: 'var(--c-fg-2)', margin: '6px 0 32px' }}>
            Ingresá con tu usuario y PIN.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                color: 'var(--c-fg-2)', textTransform: 'uppercase',
                letterSpacing: '.08em', marginBottom: 8,
              }}>
                Usuario
              </label>
              <input
                className="input"
                type="text"
                placeholder="Gustavo, Juan, María…"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                autoFocus
                autoComplete="username"
                style={{ letterSpacing: 'normal' }}
              />
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                color: 'var(--c-fg-2)', textTransform: 'uppercase',
                letterSpacing: '.08em', marginBottom: 8,
              }}>
                PIN
              </label>
              <input
                className="input"
                type="password"
                placeholder="••••"
                value={pin}
                onChange={e => setPin(e.target.value)}
                autoComplete="current-password"
                style={{ letterSpacing: '0.4em' }}
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
              disabled={loading || !nombre || !pin}
              style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '14px' }}
            >
              {loading ? 'Verificando…' : 'Acceder →'}
            </button>

            <p style={{ fontSize: 12, color: 'var(--c-fg-3)', margin: '4px 0 0', textAlign: 'center' }}>
              ¿Olvidaste tu PIN? Hablá con el administrador.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
