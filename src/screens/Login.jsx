import { useState, useRef } from 'react'
import { loginUsuario } from '../lib/supabase'
import { useTheme } from '../context/ThemeContext'
import { useIsMobile } from '../hooks/useIsMobile'

const ADDRESS = 'Calle 1 1750, Benavídez'

/* ── Ripple helper ──────────────────────────────────────────── */
function addRipple(e) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 1.2
  const r = document.createElement('span')
  Object.assign(r.style, {
    position: 'absolute', borderRadius: '50%', transform: 'scale(0)',
    width: `${size}px`, height: `${size}px`,
    left: `${e.clientX - rect.left - size / 2}px`,
    top: `${e.clientY - rect.top - size / 2}px`,
    background: 'rgba(255,255,255,.4)', pointerEvents: 'none',
    animation: 'lg-ripple 600ms var(--e-out) forwards',
  })
  el.appendChild(r)
  setTimeout(() => r.remove(), 650)
}

/* ── Theme toggle icons ─────────────────────────────────────── */
const SunIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
)
const MoonIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

export default function Login({ onLogin }) {
  const { resolved, setMode } = useTheme()
  const isMobile = useIsMobile()

  const [nombre,  setNombre]  = useState('')
  const [pin,     setPin]     = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const formRef = useRef(null)

  /* ── Shake on error ─────────────────────────────────────── */
  function triggerShake() {
    const el = formRef.current
    if (!el) return
    el.classList.remove('lg-shake')
    void el.offsetWidth
    el.classList.add('lg-shake')
    setTimeout(() => el.classList.remove('lg-shake'), 520)
  }

  /* ── Submit ─────────────────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault()
    if (!nombre.trim() || !pin.trim()) { triggerShake(); return }
    setLoading(true)
    setError('')
    try {
      const user = await loginUsuario(nombre, pin)
      setLeaving(true)
      setTimeout(() => onLogin(user), 420)
    } catch (err) {
      setError(err.message || 'Usuario o PIN incorrecto')
      triggerShake()
      setLoading(false)
    }
  }

  const isDark = resolved === 'dark'

  return (
    <>
      {/* ── Keyframes scoped a login ─────────────────────── */}
      <style>{`
        @keyframes lg-blob-float {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(-3%,4%) scale(1.05); }
          66%      { transform:translate(2%,-3%) scale(0.97); }
        }
        @keyframes lg-fade-up   { to { opacity:1; transform:translateY(0); } }
        @keyframes lg-fade-down { to { opacity:1; transform:translateY(0); } }
        @keyframes lg-row-in    { to { opacity:1; transform:translateY(0); } }
        @keyframes lg-ripple    { to { transform:scale(4); opacity:0; } }
        @keyframes lg-shake {
          0%,100%              { transform:translateX(0); }
          10%,30%,50%,70%,90% { transform:translateX(-7px); }
          20%,40%,60%,80%     { transform:translateX(7px); }
        }
        .lg-form-enter .lg-row {
          opacity:0; transform:translateY(20px);
          animation: lg-row-in 600ms var(--e-out) forwards;
        }
        .lg-form-enter .lg-row:nth-child(1) { animation-delay:80ms; }
        .lg-form-enter .lg-row:nth-child(2) { animation-delay:160ms; }
        .lg-form-enter .lg-row:nth-child(3) { animation-delay:240ms; }
        .lg-form-enter .lg-row:nth-child(4) { animation-delay:320ms; }
        .lg-form-enter .lg-row:nth-child(5) { animation-delay:400ms; }
        .lg-shake { animation: lg-shake 480ms var(--e-out); }
        .lg-input {
          width:100%; padding:12px 14px;
          background:var(--c-bg2); border:1px solid var(--c-border);
          border-radius:10px; color:var(--c-fg); font-size:14px;
          font-family:inherit; box-sizing:border-box;
          transition: border-color var(--d-fast) var(--e-out),
                      background var(--d-fast) var(--e-out),
                      box-shadow var(--d-fast) var(--e-out);
        }
        .lg-input:focus {
          outline:0;
          border-color:var(--c-accent);
          background:var(--c-card);
          box-shadow:0 0 0 3px var(--c-accent-tint);
        }
        .lg-btn:not(:disabled):hover {
          background:var(--c-accent-hover) !important;
          transform:translateY(-2px);
          box-shadow:0 8px 24px rgba(225,29,72,.42) !important;
        }
        .lg-btn:not(:disabled):active {
          transform:scale(0.97) !important;
          transition-duration:100ms !important;
        }
        @media (max-width:880px) {
          .lg-left { display:none !important; }
          .lg-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* ── Root grid ──────────────────────────────────────── */}
      <div
        className="lg-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
          minHeight: '100vh',
          transition: 'transform var(--d-slow) var(--e-in-out), filter var(--d-slow) var(--e-in-out), opacity var(--d-slow) var(--e-in-out)',
          ...(leaving ? { transform:'scale(0.94)', filter:'blur(12px)', opacity:0, pointerEvents:'none' } : {}),
        }}
      >

        {/* ══ LEFT — brand panel ═══════════════════════════ */}
        {!isMobile && (
          <div
            className="lg-left"
            style={{
              position: 'relative',
              background: 'var(--c-bg)',
              padding: 'clamp(28px,5vw,56px)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              borderRight: '1px solid var(--c-border)',
              minHeight: '100vh',
            }}
          >
            {/* Animated blob */}
            <div style={{
              position: 'absolute', top: '-10%', right: '-8%',
              width: '70%', aspectRatio: '1/1',
              background: isDark
                ? 'radial-gradient(circle at 50% 50%, rgba(255,45,85,.22), rgba(255,45,85,.05) 50%, transparent 75%)'
                : 'radial-gradient(circle at 50% 50%, rgba(225,29,72,.30), rgba(225,29,72,.07) 50%, transparent 75%)',
              filter: 'blur(20px)',
              pointerEvents: 'none',
              animation: 'lg-blob-float 14s var(--e-in-out) infinite',
              zIndex: 0,
            }} />

            {/* Logo */}
            <div style={{
              position: 'relative', zIndex: 1,
              opacity: 0, transform: 'translateY(-12px)',
              animation: 'lg-fade-down 700ms var(--e-out) forwards',
            }}>
              <img
                src="/logo.png"
                alt="GH Cars"
                style={{
                  width: 80, height: 80, display: 'block',
                  filter: isDark ? 'invert(1)' : 'none',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Headline block */}
            <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1 }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '.18em',
                textTransform: 'uppercase', color: 'var(--c-accent)',
                margin: 0,
                opacity: 0, transform: 'translateY(20px)',
                animation: 'lg-fade-up 700ms var(--e-out) 200ms forwards',
              }}>
                Sistema interno
              </p>
              <h1 style={{
                fontSize: 'clamp(48px,6vw,76px)',
                fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95,
                margin: '18px 0 0', color: 'var(--c-fg)',
                opacity: 0, transform: 'translateY(20px)',
                animation: 'lg-fade-up 700ms var(--e-out) 320ms forwards',
              }}>
                Gestión<br />Automotriz
              </h1>
              <p style={{
                fontSize: 16, color: 'var(--c-fg-2)',
                margin: '18px 0 0', maxWidth: 380, lineHeight: 1.55,
                opacity: 0, transform: 'translateY(20px)',
                animation: 'lg-fade-up 700ms var(--e-out) 440ms forwards',
              }}>
                Stock, ventas, leads y reportes — todo en un solo lugar.
              </p>
              <p style={{
                marginTop: 24, fontSize: 11,
                color: 'var(--c-fg-3)', letterSpacing: '.04em',
                opacity: 0,
                animation: 'lg-fade-up 700ms var(--e-out) 700ms forwards',
              }}>
                v3.7 · {ADDRESS}
              </p>
            </div>
          </div>
        )}

        {/* ══ RIGHT — form panel ═══════════════════════════ */}
        <div style={{
          background: 'var(--c-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(20px,4vw,48px)',
          position: 'relative',
          minHeight: '100vh',
        }}>
          {/* Theme toggle */}
          <div style={{
            position: 'absolute', top: 20, right: 20,
            display: 'inline-flex',
            background: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            borderRadius: 999,
            padding: 3, zIndex: 50,
          }}>
            {[
              { t: 'light', icon: <SunIcon /> },
              { t: 'dark',  icon: <MoonIcon /> },
            ].map(({ t, icon }) => (
              <button
                key={t}
                onClick={() => setMode(t)}
                title={t === 'light' ? 'Claro' : 'Oscuro'}
                style={{
                  width: 32, height: 32, borderRadius: 999,
                  border: 0, cursor: 'pointer',
                  background: resolved === t ? 'var(--c-fg)' : 'transparent',
                  color: resolved === t ? 'var(--c-bg)' : 'var(--c-fg-2)',
                  display: 'grid', placeItems: 'center',
                  transition: 'all var(--d-fast) var(--e-out)',
                }}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Mobile logo */}
          {isMobile && (
            <div style={{ position: 'absolute', top: 20, left: 20 }}>
              <img
                src="/logo.png"
                alt="GH Cars"
                style={{
                  width: 44, height: 44, objectFit: 'contain',
                  filter: isDark ? 'invert(1)' : 'none',
                }}
              />
            </div>
          )}

          {/* Form */}
          <form
            ref={formRef}
            className="lg-form-enter"
            style={{ width: '100%', maxWidth: 360 }}
            onSubmit={handleSubmit}
          >
            {/* Title row */}
            <div className="lg-row">
              <h2 style={{
                fontSize: 28, fontWeight: 700,
                letterSpacing: '-0.025em', margin: '0 0 4px',
                color: 'var(--c-fg)',
              }}>
                Iniciar sesión
              </h2>
              <p style={{ fontSize: 14, color: 'var(--c-fg-2)', margin: '0 0 4px' }}>
                Ingresá con tu usuario y PIN.
              </p>
            </div>

            {/* Usuario */}
            <div className="lg-row" style={{ marginTop: 24 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                color: 'var(--c-fg-2)', letterSpacing: '.08em',
                textTransform: 'uppercase', marginBottom: 6,
              }}>
                Usuario
              </label>
              <input
                className="lg-input"
                type="text"
                placeholder="Gustavo, Juan, María…"
                value={nombre}
                onChange={e => { setNombre(e.target.value); setError('') }}
                autoFocus
                autoComplete="username"
              />
            </div>

            {/* PIN */}
            <div className="lg-row" style={{ marginTop: 14 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                color: 'var(--c-fg-2)', letterSpacing: '.08em',
                textTransform: 'uppercase', marginBottom: 6,
              }}>
                PIN
              </label>
              <input
                className="lg-input"
                type="password"
                placeholder="••••"
                value={pin}
                onChange={e => { setPin(e.target.value); setError('') }}
                autoComplete="current-password"
                style={{ letterSpacing: '0.3em' }}
              />
            </div>

            {/* Error + button */}
            <div className="lg-row" style={{ marginTop: 14 }}>
              <p style={{
                fontSize: 12, color: 'var(--c-accent)',
                margin: '0 0 10px', minHeight: 18,
                opacity: error ? 1 : 0,
                transition: 'opacity var(--d-fast)',
              }}>
                {error || ' '}
              </p>
              <button
                className="lg-btn"
                type="submit"
                disabled={loading || !nombre || !pin}
                onPointerDown={addRipple}
                style={{
                  position: 'relative', width: '100%',
                  padding: '13px 20px', fontFamily: 'inherit',
                  fontSize: 14, fontWeight: 600,
                  borderRadius: 10, border: 0,
                  cursor: loading || !nombre || !pin ? 'not-allowed' : 'pointer',
                  background: loading || !nombre || !pin
                    ? 'var(--c-border)' : 'var(--c-accent)',
                  color: loading || !nombre || !pin
                    ? 'var(--c-fg-3)' : '#fff',
                  display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6,
                  overflow: 'hidden', userSelect: 'none',
                  boxShadow: loading || !nombre || !pin
                    ? 'none'
                    : '0 1px 0 rgba(255,255,255,.12) inset, 0 4px 14px rgba(225,29,72,.3)',
                  transition: 'transform var(--d-fast) var(--e-spring), background var(--d-fast) var(--e-out), box-shadow var(--d-fast) var(--e-out)',
                }}
              >
                {loading ? 'Verificando…' : 'Acceder →'}
              </button>
            </div>

            {/* Help */}
            <div className="lg-row" style={{ marginTop: 14, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--c-fg-3)', margin: 0 }}>
                ¿Olvidaste tu PIN? Hablá con el administrador.
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
