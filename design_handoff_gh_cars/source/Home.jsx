// ── Home (mobile + web) ────────────────────────────────────────

function HomeMobile({ theme, onOpen }) {
  const c = theme.colors;
  const featured = VEHICLES[2]; // Ranger
  const recent = VEHICLES.slice(0, 4);

  return (
    <PhoneFrame theme={theme}>
      {/* Top brand row */}
      <div style={{ padding: '52px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo height={32} theme={theme} />
        <ThemeToggle theme={theme} />
      </div>

      {/* Hero */}
      <div style={{ padding: '4px 20px 20px' }}>
        <p style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: c.fg2, margin: 0 }}>Concesionaria · Benavidez</p>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', margin: '6px 0 0', lineHeight: 0.95, color: c.fg }}>
          Encontrá tu<br/>próximo auto.
        </h1>
        <p style={{ fontSize: 14, color: c.fg2, margin: '14px 0 0', lineHeight: 1.5 }}>
          {VEHICLES.length} unidades en stock. Entrega inmediata, financiación y toma de usado.
        </p>
      </div>

      {/* Search bar */}
      <div style={{ padding: '0 20px 16px' }}>
        <div onClick={() => onOpen?.('catalog')} style={{
          padding: '14px 18px', background: c.card, border: `1px solid ${c.border}`,
          borderRadius: 16, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.fg2} strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          <span style={{ fontSize: 14, color: c.fg2 }}>Marca, modelo, año…</span>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 20px 8px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {[
          { l: 'Todos', i: '🚗', on: true },
          { l: 'Pickups', i: '🛻' },
          { l: 'SUV', i: '🚙' },
          { l: 'Autos', i: '🚘' },
          { l: '0 km', i: '✨' },
        ].map((t) => (
          <div key={t.l} style={{
            padding: '8px 16px', borderRadius: 999, whiteSpace: 'nowrap',
            background: t.on ? c.fg : c.card,
            color: t.on ? c.bg : c.fg,
            border: t.on ? 'none' : `1px solid ${c.border}`,
            fontSize: 13, fontWeight: 600,
          }}>{t.l}</div>
        ))}
      </div>

      {/* Featured big card */}
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: c.fg2, margin: '0 0 10px', fontWeight: 600 }}>Destacado</p>
        <TiltCard intensity={0.6} style={{ borderRadius: 24, overflow: 'hidden', background: c.card, border: `1px solid ${c.border}` }}>
          <div onClick={() => onOpen?.('detail', featured.id)} style={{ position: 'relative', aspectRatio: '4/5', cursor: 'pointer' }}>
            <img src={featured.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,.85) 100%)' }} />
            <div style={{ position: 'absolute', top: 14, right: 14, padding: '4px 10px', background: c.accent, borderRadius: 6, fontSize: 10, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff' }}>{featured.anio}</div>
            <button style={{ position: 'absolute', top: 14, left: 14, width: 36, height: 36, borderRadius: 999, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(10px)', border: 0, color: '#fff', display: 'grid', placeItems: 'center' }}>
              <HeartIcon size={16} />
            </button>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 18, color: '#fff' }}>
              <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#ddd', margin: 0 }}>{featured.marca}</p>
              <h3 style={{ fontSize: 26, fontWeight: 800, margin: '4px 0 2px', letterSpacing: '-0.02em' }}>{featured.modelo}</h3>
              <p style={{ fontSize: 12, color: '#bbb', margin: 0 }}>{featured.version}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 12 }}>
                <span style={{ fontSize: 11, color: '#bbb' }}>USD</span>
                <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>${fmt(featured.precio)}</span>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* Recent stock */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: c.fg2, margin: 0, fontWeight: 600 }}>Stock reciente</p>
          <button onClick={() => onOpen?.('catalog')} style={{ background: 'transparent', border: 0, color: c.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Ver todo <ArrowIcon size={12} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          {recent.map(v => (
            <div key={v.id} onClick={() => onOpen?.('detail', v.id)} style={{
              background: c.card, borderRadius: 16, overflow: 'hidden',
              border: `1px solid ${c.border}`, cursor: 'pointer',
            }}>
              <div style={{ aspectRatio: '4/3', background: c.bg2 }}>
                <img src={v.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 12px' }}>
                <p style={{ fontSize: 10, color: c.fg2, margin: 0, textTransform: 'uppercase', letterSpacing: '.08em' }}>{v.marca} · {v.anio}</p>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: '2px 0 0', color: c.fg, letterSpacing: '-0.01em' }}>{v.modelo}</h4>
                <p style={{ fontSize: 14, fontWeight: 800, margin: '6px 0 0', color: c.fg, letterSpacing: '-0.02em' }}>USD {fmt(v.precio)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA strip */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{
          padding: '20px 18px', borderRadius: 16,
          background: `linear-gradient(135deg, ${c.accent} 0%, ${c.accentHover} 100%)`,
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', margin: 0, opacity: .85 }}>Vendé tu usado</p>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: '4px 0 8px', letterSpacing: '-0.01em' }}>Te lo cotizamos en 24hs</h3>
          <p style={{ fontSize: 12, margin: 0, opacity: .9, lineHeight: 1.5 }}>Mandanos foto y datos por WhatsApp. Pago al instante.</p>
          <button style={{
            marginTop: 14, padding: '10px 16px', background: '#fff', color: c.accent,
            border: 0, borderRadius: 999, fontWeight: 700, fontSize: 12, display: 'inline-flex',
            alignItems: 'center', gap: 6, cursor: 'pointer',
          }}>
            <WhatsAppIcon size={12} /> Cotizar ahora
          </button>
        </div>
      </div>

      {/* Visit us */}
      <div style={{ padding: '24px 20px 100px' }}>
        <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: c.fg2, margin: '0 0 10px', fontWeight: 600 }}>Visitanos</p>
        <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${c.border}` }}>
          <GhMap theme={theme} height={140} />
          <div style={{ padding: '14px 16px', background: c.card }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: c.fg, margin: 0 }}>{ADDRESS}</p>
            <p style={{ fontSize: 12, color: c.fg2, margin: '2px 0 0' }}>Lun a Sáb · 9 a 18hs</p>
          </div>
        </div>
      </div>

      <MobileBottomNav theme={theme} active="home" onNav={onOpen} />
    </PhoneFrame>
  );
}

function HomeWeb({ theme, onOpen }) {
  const c = theme.colors;
  const featured = VEHICLES[2];
  const more = VEHICLES.slice(0, 6);

  return (
    <div style={{ background: c.bg, color: c.fg, minHeight: '100%', fontFamily: 'inherit' }}>
      <PublicTopBar theme={theme} active="home" onNav={onOpen} />

      {/* Hero */}
      <section style={{ padding: '64px 56px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: c.accent, margin: 0, fontWeight: 600 }}>Concesionaria · Benavidez</p>
          <h1 style={{ fontSize: 88, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.92, margin: '16px 0 0', color: c.fg }}>
            Encontrá tu<br/>próximo auto.
          </h1>
          <p style={{ fontSize: 18, color: c.fg2, margin: '20px 0 0', lineHeight: 1.55, maxWidth: 460 }}>
            {VEHICLES.length} unidades seleccionadas. Compra · Venta · Asesoramiento desde 2010.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <button onClick={() => onOpen?.('catalog')} style={{ padding: '16px 28px', background: c.accent, color: '#fff', border: 0, borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Ver stock <ArrowIcon size={14} />
            </button>
            <a target="_blank" rel="noreferrer" href="https://wa.me/541162692000" style={{ padding: '16px 28px', background: 'transparent', color: c.fg, border: `1px solid ${c.borderStrong}`, borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <WhatsAppIcon size={14} /> Hablar por WhatsApp
            </a>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 48, paddingTop: 32, borderTop: `1px solid ${c.border}` }}>
            <div><p style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>{VEHICLES.length}</p><p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: c.fg2, margin: 0 }}>Unidades</p></div>
            <div><p style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>14yr</p><p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: c.fg2, margin: 0 }}>Trayectoria</p></div>
            <div><p style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>1.4k</p><p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: c.fg2, margin: 0 }}>Operaciones</p></div>
          </div>
        </div>
        <TiltCard intensity={0.7} style={{ borderRadius: 32, overflow: 'hidden', background: c.card, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
          <div onClick={() => onOpen?.('detail', featured.id)} style={{ position: 'relative', aspectRatio: '4/5', cursor: 'pointer' }}>
            <img src={featured.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,.85) 100%)' }} />
            <div style={{ position: 'absolute', top: 24, right: 24, padding: '6px 12px', background: c.accent, borderRadius: 8, fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff' }}>Destacado · {featured.anio}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 28, color: '#fff' }}>
              <p style={{ fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: '#ddd', margin: 0 }}>{featured.marca}</p>
              <h3 style={{ fontSize: 40, fontWeight: 800, margin: '6px 0 4px', letterSpacing: '-0.02em' }}>{featured.modelo}</h3>
              <p style={{ fontSize: 14, color: '#bbb', margin: 0 }}>{featured.version}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 16 }}>
                <span style={{ fontSize: 12, color: '#bbb' }}>USD</span>
                <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em' }}>${fmt(featured.precio)}</span>
              </div>
            </div>
          </div>
        </TiltCard>
      </section>

      {/* Stock grid */}
      <section style={{ padding: '32px 56px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Stock disponible</h2>
          <button onClick={() => onOpen?.('catalog')} style={{ background: 'transparent', border: 0, color: c.accent, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Ver catálogo completo <ArrowIcon size={14} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {more.map(v => (
            <TiltCard key={v.id} intensity={0.5} style={{ borderRadius: 18, overflow: 'hidden', background: c.card, border: `1px solid ${c.border}`, cursor: 'pointer' }}>
              <div onClick={() => onOpen?.('detail', v.id)}>
                <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                  <img src={v.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12, padding: '3px 10px', background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(8px)', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff' }}>{v.anio}</div>
                </div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <p style={{ fontSize: 11, color: c.fg2, margin: 0, textTransform: 'uppercase', letterSpacing: '.08em' }}>{v.marca}</p>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '4px 0 2px', letterSpacing: '-0.01em' }}>{v.modelo}</h3>
                  <p style={{ fontSize: 12, color: c.fg2, margin: 0 }}>{fmt(v.km)} km · {v.transmision}</p>
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.border}`, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 11, color: c.fg2 }}>USD</span>
                    <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>{fmt(v.precio)}</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Map + footer */}
      <section style={{ padding: '64px 56px 0', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: c.accent, margin: 0, fontWeight: 600 }}>Visitanos</p>
          <h2 style={{ fontSize: 48, fontWeight: 800, margin: '16px 0 0', lineHeight: 1, letterSpacing: '-0.03em' }}>Showroom<br/>en Benavidez</h2>
          <p style={{ fontSize: 15, color: c.fg2, marginTop: 16, lineHeight: 1.6 }}>{ADDRESS}<br/>Lunes a Sábado · 9:00 – 18:00</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <a target="_blank" rel="noreferrer" href="https://maps.google.com/?q=Ruta+9+km+1750,+Benavidez" style={{ padding: '12px 20px', background: c.fg, color: c.bg, borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Cómo llegar <ArrowIcon size={12} />
            </a>
            <a href={`tel:${PHONE}`} style={{ padding: '12px 20px', background: 'transparent', color: c.fg, border: `1px solid ${c.borderStrong}`, borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              {PHONE}
            </a>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            <a target="_blank" rel="noreferrer" href="https://instagram.com/ghcars.ok" style={{ width: 40, height: 40, borderRadius: 999, border: `1px solid ${c.border}`, display: 'grid', placeItems: 'center', color: c.fg, textDecoration: 'none' }}>
              <InstagramIcon />
            </a>
            <a target="_blank" rel="noreferrer" href="https://tiktok.com/@ghcars.ok" style={{ width: 40, height: 40, borderRadius: 999, border: `1px solid ${c.border}`, display: 'grid', placeItems: 'center', color: c.fg, textDecoration: 'none' }}>
              <TikTokIcon />
            </a>
          </div>
        </div>
        <div style={{ borderRadius: 24, overflow: 'hidden', height: 380, border: `1px solid ${c.border}`, boxShadow: c.shadowSm }}>
          <GhMap theme={theme} height={380} />
        </div>
      </section>

      <footer style={{ marginTop: 48, padding: '24px 56px', borderTop: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: c.fg2, margin: 0 }}>© GH Cars · Compra · Venta · Asesoramiento</p>
        <p style={{ fontSize: 12, color: c.fg2, margin: 0 }}>USD/ARS · $ {fmt(TC)}</p>
      </footer>
    </div>
  );
}

Object.assign(window, { HomeMobile, HomeWeb });
