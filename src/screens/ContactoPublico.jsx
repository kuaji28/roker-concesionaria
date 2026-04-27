import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { useTheme } from '../context/ThemeContext'
import { useWANumber } from '../hooks/useWANumber'
import { useIsMobile } from '../hooks/useIsMobile'

export default function ContactoPublico() {
  const navigate = useNavigate()
  const { resolved } = useTheme()
  const waNumber = useWANumber()
  const isMobile = useIsMobile()
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', mensaje: '' })
  const [sent, setSent] = useState(false)
  const [hoverNav, setHoverNav] = useState(null)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Build WhatsApp message
    const text = `Consulta desde web:\nNombre: ${form.nombre}\nTeléfono: ${form.telefono}\nEmail: ${form.email}\nMensaje: ${form.mensaje}`
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank')
    setSent(true)
  }

  const inp = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: '1px solid var(--c-border)', background: 'var(--c-card-2)',
    color: 'var(--c-fg)', fontSize: 14, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', color: 'var(--c-fg)', fontFamily: "'Inter', sans-serif" }}>
      {/* TopBar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,12,.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--c-border)',
        padding: '0 clamp(20px,5vw,56px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/p/home')}>
          <img src="/logo.png" alt="GH Cars" style={{ height: 28, objectFit: 'contain', display: 'block', filter: resolved === 'dark' ? 'invert(1)' : 'none' }} />
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>GH Cars</span>
        </div>
        <nav style={{ display: isMobile ? 'none' : 'flex', gap: 4 }}>
          {[
            { label: 'Catálogo', to: '/p/catalogo' },
            { label: 'Vender mi auto', to: '/p/home' },
            { label: 'Contacto', to: '/p/contacto' },
          ].map(n => (
            <Link
              key={n.label}
              to={n.to}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: n.to === '/p/contacto' ? 'var(--c-accent)' : hoverNav === n.label ? 'var(--c-fg)' : 'var(--c-fg-2)',
                background: n.to === '/p/contacto' ? 'var(--c-accent-tint)' : hoverNav === n.label ? 'var(--c-card-2)' : 'transparent',
                textDecoration: 'none', transition: 'all .15s',
              }}
              onMouseEnter={() => setHoverNav(n.label)}
              onMouseLeave={() => setHoverNav(null)}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Hola GH Cars, quería más información')}`}
            target="_blank" rel="noopener noreferrer"
            style={{ padding: '7px 16px', borderRadius: 10, background: '#25d366', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(40px,6vw,80px) clamp(20px,5vw,56px)' }}>
        {/* Heading */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--c-accent)', fontWeight: 600, margin: '0 0 12px' }}>GH Cars · Benavidez</p>
          <h1 style={{ fontSize: 'clamp(36px,5vw,56px)', fontWeight: 800, letterSpacing: '-0.04em', margin: 0, lineHeight: 1.1 }}>Hablemos.</h1>
          <p style={{ fontSize: 16, color: 'var(--c-fg-2)', marginTop: 12, maxWidth: 500 }}>
            Encontrá el auto que buscás o cotizá tu vehículo sin compromiso. Te respondemos en menos de 2 horas.
          </p>
        </div>

        {/* Two-col layout */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: isMobile ? 24 : 40, alignItems: 'start' }}>
          {/* Form */}
          <div style={{ background: 'var(--c-card)', borderRadius: 16, padding: '32px 36px', border: '1px solid var(--c-border)' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>¡Mensaje enviado!</h3>
                <p style={{ color: 'var(--c-fg-2)', fontSize: 14 }}>Te redirigimos a WhatsApp para continuar la conversación.</p>
                <button onClick={() => setSent(false)} style={{ marginTop: 24, padding: '10px 24px', borderRadius: 10, border: '1px solid var(--c-border)', background: 'transparent', color: 'var(--c-fg)', cursor: 'pointer', fontSize: 14 }}>
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 24px' }}>Envianos tu consulta</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--c-fg-2)', marginBottom: 6, fontWeight: 500 }}>Nombre *</label>
                    <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Tu nombre" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--c-fg-2)', marginBottom: 6, fontWeight: 500 }}>Teléfono *</label>
                    <input name="telefono" value={form.telefono} onChange={handleChange} required placeholder="+54 11..." style={inp} />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--c-fg-2)', marginBottom: 6, fontWeight: 500 }}>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" style={inp} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--c-fg-2)', marginBottom: 6, fontWeight: 500 }}>Mensaje *</label>
                  <textarea name="mensaje" value={form.mensaje} onChange={handleChange} required placeholder="¿Qué auto buscás? ¿Querés tasar el tuyo?" rows={5} style={{ ...inp, resize: 'vertical', minHeight: 120 }} />
                </div>
                <button type="submit" style={{
                  width: '100%', padding: '14px 24px', borderRadius: 10,
                  background: 'var(--c-accent)', color: '#fff', border: 'none',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em',
                }}>
                  Enviar por WhatsApp →
                </button>
                <p style={{ fontSize: 11, color: 'var(--c-fg-3)', marginTop: 10, textAlign: 'center' }}>
                  Al enviar se abre WhatsApp con tu mensaje pre-armado
                </p>
              </form>
            )}
          </div>

          {/* Info card + map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'var(--c-card)', borderRadius: 16, padding: '28px 28px', border: '1px solid var(--c-border)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 20px' }}>Visitanos</h3>
              {[
                { icon: '📍', label: 'Dirección', value: 'Calle 1 1750\nBenavídez, Buenos Aires' },
                { icon: '📞', label: 'Teléfono', value: '+54 11 5234-8902' },
                { icon: '🕐', label: 'Horarios', value: 'Lun–Vie: 9:00–18:00\nSáb: 9:00–14:00' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--c-fg-3)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 3 }}>{row.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--c-fg)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{row.value}</div>
                  </div>
                </div>
              ))}
              <a
                href="https://maps.app.goo.gl/VYKu4otJrNhqwNNXA?g_st=ac"
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '10px 16px', borderRadius: 10, border: '1px solid var(--c-border)', background: 'var(--c-card-2)', color: 'var(--c-fg-2)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}
              >
                🗺️ Cómo llegar →
              </a>
            </div>

            {/* Map embed */}
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--c-border)', aspectRatio: '4/3' }}>
              <iframe
                title="GH Cars ubicación"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0!2d-58.6951!3d-34.4118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDI0JzQyLjUiUyA1OMKwNDEnNDIuNCJX!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar"
                width="100%" height="100%" style={{ border: 0, filter: 'var(--map-filter, none)' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
