// ── Variant C: Mobile-first auto app (with web companion) ──────
// Phone-style UI with bottom sheets, swipe-able stories,
// chunky buttons. Dark with red sport accent. Visual primero.

function VariantC() {
  const bg = '#0a0a0c';
  const card = '#16161a';
  const fg = '#fff';
  const fg2 = '#9aa0a6';
  const accent = '#ff2d55';   // sport red
  const border = 'rgba(255,255,255,.08)';

  const [active, setActive] = React.useState(0);
  const v = VEHICLES[active];

  return (
    <div style={{ background: '#000', color: fg, fontFamily: "'Inter', sans-serif", padding: '40px 24px', display: 'grid', gridTemplateColumns: '390px 1fr', gap: 56, alignItems: 'flex-start' }}>

      {/* MOBILE PHONE FRAME */}
      <div style={{ width: 390, borderRadius: 48, overflow: 'hidden', background: bg, border: '12px solid #1a1a1a', boxShadow: '0 40px 80px rgba(0,0,0,.5)', height: 844, position: 'relative' }}>
        {/* status bar */}
        <div style={{ height: 50, padding: '14px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 600 }}>
          <span>9:41</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M0 7h2v4H0zM4 5h2v6H4zM8 3h2v8H8zM12 0h2v11h-2z"/></svg>
            <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M2 2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm12 1H2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM3 4h10v3H3z"/></svg>
          </span>
        </div>

        {/* Header */}
        <div style={{ padding: '8px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src="../assets/logo-ghcars.png" alt="GH" style={{ height: 36, filter: 'invert(1)' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 38, height: 38, borderRadius: 999, background: card, border: `1px solid ${border}`, color: fg, display: 'grid', placeItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
            </button>
            <button style={{ width: 38, height: 38, borderRadius: 999, background: card, border: `1px solid ${border}`, color: fg, display: 'grid', placeItems: 'center', position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>

        {/* Stories row */}
        <div style={{ padding: '0 20px 14px', display: 'flex', gap: 10, overflowX: 'auto' }}>
          {['Todos', 'Pickups', 'SUV', '0km', 'Bajo $20k', 'Premium'].map((t, i) => (
            <div key={t} style={{
              padding: '6px 14px', borderRadius: 999,
              background: i === 0 ? accent : card,
              border: i === 0 ? 'none' : `1px solid ${border}`,
              fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
            }}>{t}</div>
          ))}
        </div>

        {/* Hero card */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', aspectRatio: '4/5' }}>
            <img src={v.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, transparent 40%, rgba(0,0,0,.85) 100%)' }} />

            {/* swipe pagination dots */}
            <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', gap: 4 }}>
              {VEHICLES.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i === active ? '#fff' : 'rgba(255,255,255,.3)' }} />
              ))}
            </div>

            {/* badge */}
            <div style={{ position: 'absolute', top: 28, right: 14, padding: '4px 10px', background: accent, borderRadius: 6, fontSize: 10, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase' }}>{v.anio}</div>

            {/* content */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px 20px' }}>
              <p style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#ddd', margin: 0 }}>{v.marca}</p>
              <h2 style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 2px', letterSpacing: '-0.02em' }}>{v.modelo}</h2>
              <p style={{ fontSize: 13, color: '#bbb', margin: 0 }}>{v.version}</p>

              <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                {[`${fmt(v.km)} km`, v.transmision, v.combustible].map(t => (
                  <span key={t} style={{ padding: '4px 10px', background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(8px)', borderRadius: 999, fontSize: 11, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Price + CTAs */}
        <div style={{ padding: '18px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: fg2, margin: 0 }}>USD</p>
            <p style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>${fmt(v.precio)}</p>
            <p style={{ fontSize: 11, color: fg2, margin: 0 }}>≈ ARS {fmt(v.precio * TC)}</p>
          </div>
          <button style={{ padding: '14px 22px', background: accent, color: '#fff', border: 0, borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
            Consultar
          </button>
        </div>

        {/* Bottom nav */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '12px 20px 28px',
          background: 'rgba(10,10,12,.95)', backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${border}`,
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        }}>
          {[
            { icon: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z', label: 'Stock', on: true },
            { icon: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM21 21l-4.35-4.35', label: 'Buscar' },
            { icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z', label: 'Favoritos' },
            { icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: 'Cuenta' },
          ].map((it, i) => (
            <button key={i} style={{ background: 'transparent', border: 0, color: it.on ? accent : fg2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={it.icon}/></svg>
              <span style={{ fontSize: 10, fontWeight: 600 }}>{it.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP COMPANION VIEW */}
      <div style={{ flex: 1, background: bg, color: fg, borderRadius: 16, overflow: 'hidden', border: `1px solid ${border}` }}>
        <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="../assets/logo-ghcars.png" alt="GH" style={{ height: 40, filter: 'invert(1)' }} />
            <span style={{ fontSize: 12, color: fg2, padding: '4px 10px', background: card, borderRadius: 6 }}>Web companion</span>
          </div>
          <nav style={{ display: 'flex', gap: 24, fontSize: 13 }}>
            <a style={{ color: fg, textDecoration: 'none' }}>Stock</a>
            <a style={{ color: fg2, textDecoration: 'none' }}>Vendé</a>
            <a style={{ color: fg2, textDecoration: 'none' }}>Financiación</a>
            <a style={{ color: fg2, textDecoration: 'none' }}>Contacto</a>
          </nav>
          <button style={{ padding: '8px 16px', background: accent, border: 0, borderRadius: 999, color: '#fff', fontWeight: 600, fontSize: 13 }}>WhatsApp</button>
        </div>

        <div style={{ padding: 28 }}>
          <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: fg2, margin: 0 }}>{VEHICLES.length} unidades en stock</p>
          <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', margin: '8px 0 24px' }}>Encontrá tu próximo auto.</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {VEHICLES.slice(0, 4).map((v, i) => (
              <div key={v.id} onClick={() => setActive(i)} style={{
                background: card, borderRadius: 16, overflow: 'hidden',
                border: `1px solid ${active === i ? accent : border}`,
                cursor: 'pointer', display: 'grid', gridTemplateColumns: '160px 1fr',
                transition: 'border-color .15s',
              }}>
                <div style={{ aspectRatio: '4/3' }}>
                  <img src={v.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <p style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: fg2, margin: 0 }}>{v.marca} · {v.anio}</p>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '4px 0 2px' }}>{v.modelo}</h3>
                  <p style={{ fontSize: 11, color: fg2, margin: 0 }}>{fmt(v.km)} km · {v.transmision}</p>
                  <p style={{ fontSize: 18, fontWeight: 800, margin: '8px 0 0', letterSpacing: '-0.02em' }}>USD ${fmt(v.precio)}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: 20, background: card, borderRadius: 16, border: `1px solid ${border}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Visitanos</h4>
              <p style={{ fontSize: 12, color: fg2, margin: '6px 0 14px' }}>Lun a Sáb · 9 a 18hs</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href="https://instagram.com/ghcars.ok" target="_blank" rel="noreferrer" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${border}`, color: fg, display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>
                </a>
                <a href="https://tiktok.com/@ghcars.ok" target="_blank" rel="noreferrer" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${border}`, color: fg, display: 'grid', placeItems: 'center', textDecoration: 'none', fontSize: 11, fontWeight: 700 }}>TT</a>
              </div>
            </div>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${border}` }}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.9!2d-58.4!3d-34.6!3m2!1i1024!2i768!4f13.1" style={{ width: '100%', height: 120, border: 0, filter: 'invert(.9) hue-rotate(180deg)' }} loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.VariantC = VariantC;
