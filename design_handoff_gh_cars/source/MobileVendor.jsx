// ── Mobile companion: vendedor en la calle ─────────────────────
// 3 pantallas: Catálogo rápido (búsqueda + lista) · Detalle (compartir / lead) · Nuevo lead

function MobileFrame({ children, theme, hideHome }) {
  const c = theme.colors;
  return (
    <div style={{
      width: 390, height: 844, borderRadius: 44, overflow: 'hidden',
      background: c.bg, color: c.fg, position: 'relative',
      border: `8px solid #0a0a0c`, boxShadow: '0 30px 80px rgba(0,0,0,.4)',
      fontFamily: 'inherit',
    }}>
      {/* status bar */}
      <div style={{
        height: 44, padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 14, fontWeight: 600, color: c.fg,
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor"><rect x="0" y="6" width="3" height="4" rx="0.5"/><rect x="4" y="4" width="3" height="6" rx="0.5"/><rect x="8" y="2" width="3" height="8" rx="0.5"/><rect x="12" y="0" width="3" height="10" rx="0.5"/></svg>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M7 1.5C5 1.5 3.2 2.2 2 3.4l1.4 1.4C4.3 4 5.6 3.5 7 3.5s2.7.5 3.6 1.3L12 3.4C10.8 2.2 9 1.5 7 1.5zM7 5.5c-1 0-1.9.4-2.5 1l1.5 1.5c.3-.3.6-.5 1-.5s.7.2 1 .5l1.5-1.5C8.9 5.9 8 5.5 7 5.5zM7 8c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"/></svg>
          <svg width="24" height="11" viewBox="0 0 24 11" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5"/><rect x="2" y="2" width="16" height="7" rx="1" fill="currentColor"/><rect x="21" y="3.5" width="2" height="4" rx="1" fill="currentColor"/></svg>
        </div>
      </div>
      <div style={{ height: 'calc(100% - 44px)', overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>
      {!hideHome && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 8, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 134, height: 5, background: c.fg, borderRadius: 3, opacity: .9 }} />
        </div>
      )}
    </div>
  );
}

function MobileTopBar({ theme, title, back, right }) {
  const c = theme.colors;
  return (
    <div style={{
      padding: '12px 16px',
      borderBottom: `1px solid ${c.border}`,
      display: 'flex', alignItems: 'center', gap: 12,
      background: c.bg, position: 'sticky', top: 0, zIndex: 10,
    }}>
      {back ? (
        <button style={{ width: 36, height: 36, borderRadius: 999, background: c.card, border: 0, color: c.fg, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      ) : (
        <Logo height={28} theme={theme} />
      )}
      <h1 style={{ flex: 1, fontSize: 16, fontWeight: 700, margin: 0, color: c.fg, letterSpacing: '-0.01em' }}>{title}</h1>
      {right}
    </div>
  );
}

// Bottom tab bar — 3 tabs: Catálogo, Lead, Notif
function MobileTabs({ theme, active = 'cat' }) {
  const c = theme.colors;
  const tabs = [
    { id: 'cat',  label: 'Catálogo', icon: 'M5 11h14M7 11V8a5 5 0 0 1 10 0v3M5 11l1 8h12l1-8' },
    { id: 'lead', label: 'Nuevo lead', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6' },
    { id: 'msg',  label: 'Mensajes', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', badge: 3 },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 24, paddingTop: 8,
      background: c.bg2, borderTop: `1px solid ${c.border}`,
      display: 'flex',
    }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} style={{
            flex: 1, padding: '8px 4px', background: 'transparent', border: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: on ? c.accent : c.fg2, cursor: 'pointer', fontFamily: 'inherit', position: 'relative',
          }}>
            <div style={{ position: 'relative' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon}/></svg>
              {t.badge && (
                <span style={{
                  position: 'absolute', top: -4, right: -6,
                  background: c.accent, color: '#fff', fontSize: 9, fontWeight: 800,
                  padding: '1px 5px', borderRadius: 999, minWidth: 16, textAlign: 'center',
                }}>{t.badge}</span>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Screen 1: Catálogo rápido (lista + búsqueda) ───
function MobileCatalogQuick({ theme }) {
  const c = theme.colors;
  return (
    <MobileFrame theme={theme}>
      <MobileTopBar theme={theme} title="Catálogo" right={
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{ width: 36, height: 36, borderRadius: 999, background: c.card, border: 0, color: c.fg, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
          </button>
        </div>
      } />

      {/* Search */}
      <div style={{ padding: '12px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: c.card, border: `1px solid ${c.border}`, borderRadius: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.fg2} strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          <input placeholder="Marca, modelo, patente…" defaultValue="Ranger" style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', color: c.fg, fontSize: 14, fontFamily: 'inherit' }} />
        </div>
      </div>

      {/* Quick filter chips */}
      <div style={{ padding: '4px 16px 12px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {[
          { l: 'Todos', on: true },
          { l: 'Disponible', on: false },
          { l: '< USD 30k', on: false },
          { l: 'SUV', on: false },
          { l: 'Pickup', on: false },
        ].map((t, i) => (
          <button key={i} style={{
            padding: '6px 14px', borderRadius: 999,
            background: t.on ? c.fg : c.card,
            color: t.on ? c.bg : c.fg2,
            border: t.on ? 'none' : `1px solid ${c.border}`,
            fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit',
          }}>{t.l}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', height: 'calc(100% - 200px)', paddingBottom: 100 }}>
        {VEHICLES.slice(0, 6).map((v, i) => {
          const estado = ['disponible','disponible','señado','disponible','en_revision','disponible'][i];
          return (
            <div key={v.id} style={{
              display: 'flex', gap: 12, padding: '12px 16px',
              borderBottom: `1px solid ${c.border}`,
              alignItems: 'center', cursor: 'pointer',
            }}>
              <div style={{ width: 88, height: 66, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: c.bg2, position: 'relative' }}>
                <img src={v.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                  <div>
                    <p style={{ fontSize: 10, color: c.fg2, margin: 0, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>{v.marca} · {v.anio}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: c.fg, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.modelo}</p>
                  </div>
                  <StateBadge estado={estado} theme={theme} small />
                </div>
                <p style={{ fontSize: 11, color: c.fg2, margin: '2px 0 4px' }}>{fmt(v.km)} km · {v.combustible}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 16, fontWeight: 800, margin: 0, color: c.fg, letterSpacing: '-0.02em' }}>USD {fmt(v.precio)}</p>
                  <button style={{
                    width: 34, height: 34, borderRadius: 999,
                    background: '#25D366', color: '#fff', border: 0, cursor: 'pointer',
                    display: 'grid', placeItems: 'center',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm5.5 14.1c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1-1.4-1-2.7s.7-1.9.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.7 2 .8 2.1.1.1.1.3 0 .5-.1.2-.1.3-.3.5-.1.1-.3.3-.4.5-.1.1-.3.3-.1.5.1.3.6 1.1 1.4 1.7 1 .8 1.8 1.1 2.1 1.2.3.1.4.1.5 0 .2-.2.6-.7.8-.9.2-.2.3-.2.6-.1.2.1 1.4.7 1.7.8.2.1.4.2.5.2.1.2.1.6-.1 1.2z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MobileTabs theme={theme} active="cat" />
    </MobileFrame>
  );
}

// ─── Screen 2: Detalle (compartir + crear lead) ───
function MobileVehicleDetail({ theme }) {
  const c = theme.colors;
  const v = VEHICLES[0];
  return (
    <MobileFrame theme={theme}>
      <MobileTopBar theme={theme} title="Detalle" back right={
        <button style={{ width: 36, height: 36, borderRadius: 999, background: c.card, border: 0, color: c.fg, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
        </button>
      } />

      <div style={{ overflowY: 'auto', height: 'calc(100% - 70px)', paddingBottom: 180 }}>
        {/* Image */}
        <div style={{ aspectRatio: '4/3', position: 'relative', background: c.bg2 }}>
          <img src={v.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <StateBadge estado="disponible" theme={theme} />
          </div>
          <div style={{ position: 'absolute', bottom: 12, right: 12, padding: '4px 10px', background: 'rgba(0,0,0,.6)', color: '#fff', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>1 / 12</div>
        </div>

        <div style={{ padding: '16px 16px 0' }}>
          <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: c.accent, margin: 0, fontWeight: 700 }}>{v.marca} · {v.anio}</p>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.03em', color: c.fg }}>{v.modelo}</h2>
          <p style={{ fontSize: 13, color: c.fg2, margin: '2px 0 0' }}>{v.version}</p>

          <p style={{ fontSize: 32, fontWeight: 800, margin: '12px 0 0', letterSpacing: '-0.03em', color: c.fg }}>USD {fmt(v.precio)}</p>
          <p style={{ fontSize: 12, color: c.fg2, margin: '2px 0 0' }}>≈ ARS {fmt(v.precio * TC)}</p>

          {/* Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
            {[
              ['Kilómetros', `${fmt(v.km)} km`],
              ['Combustible', v.combustible],
              ['Caja', v.caja],
              ['Patente', 'AB123CD'],
            ].map(([k, val]) => (
              <div key={k} style={{ padding: '10px 12px', background: c.card, borderRadius: 10, border: `1px solid ${c.border}` }}>
                <p style={{ fontSize: 10, color: c.fg2, margin: 0, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>{k}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: c.fg, margin: '2px 0 0' }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Quick share row */}
          <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: c.fg2, fontWeight: 700, margin: '20px 0 8px' }}>Compartir</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[
              { l: 'WhatsApp', c: '#25D366', i: 'M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z' },
              { l: 'Link',     c: c.info,   i: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L11.75 5.18M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07L12.25 18.82' },
              { l: 'Instagram',c: '#E4405F', i: 'M16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z' },
              { l: 'Email',    c: c.warning, i: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6' },
            ].map(b => (
              <button key={b.l} style={{
                padding: '12px 4px', background: c.card, border: `1px solid ${c.border}`,
                borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 999, background: b.c + '22', color: b.c, display: 'grid', placeItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={b.l === 'WhatsApp' || b.l === 'Instagram' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={b.i}/></svg>
                </div>
                <span style={{ fontSize: 10, color: c.fg, fontWeight: 600 }}>{b.l}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 78,
        padding: '12px 16px',
        background: `linear-gradient(180deg, transparent 0%, ${c.bg} 30%)`,
        display: 'flex', gap: 8,
      }}>
        <button style={{
          flex: 1, padding: '14px', background: c.accent, color: '#fff', border: 0,
          borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6"/></svg>
          Crear lead
        </button>
      </div>

      <MobileTabs theme={theme} active="cat" />
    </MobileFrame>
  );
}

// ─── Screen 3: Nuevo lead (form rápido) ───
function MobileNewLead({ theme }) {
  const c = theme.colors;
  return (
    <MobileFrame theme={theme}>
      <MobileTopBar theme={theme} title="Nuevo lead" back />

      <div style={{ overflowY: 'auto', height: 'calc(100% - 70px)', paddingBottom: 100 }}>
        {/* Vehicle context */}
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, background: c.card, margin: '12px 16px 0', borderRadius: 12, border: `1px solid ${c.border}` }}>
          <div style={{ width: 48, height: 36, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
            <img src={VEHICLES[0].img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: c.fg, margin: 0 }}>Ford Ranger 2024</p>
            <p style={{ fontSize: 11, color: c.fg2, margin: 0 }}>USD 56.900</p>
          </div>
          <button style={{ background: 'transparent', border: 0, color: c.accent, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Cambiar</button>
        </div>

        {/* Form */}
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Nombre', val: 'Martín Pérez', type: 'text' },
            { label: 'Teléfono', val: '+54 11 5234-8902', type: 'tel' },
            { label: 'Email (opcional)', val: '', type: 'email', placeholder: 'martin@email.com' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: c.fg2, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{f.label}</label>
              <input
                type={f.type}
                defaultValue={f.val}
                placeholder={f.placeholder}
                style={{
                  width: '100%', padding: '12px 14px', background: c.card, border: `1px solid ${c.border}`,
                  borderRadius: 10, color: c.fg, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                }} />
            </div>
          ))}

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: c.fg2, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Cómo se enteró</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['WhatsApp', 'Instagram', 'Web', 'Referido', 'Pasó por local'].map((t, i) => (
                <button key={t} style={{
                  padding: '8px 14px', borderRadius: 999,
                  background: i === 0 ? c.accent : c.card,
                  color: i === 0 ? '#fff' : c.fg2,
                  border: i === 0 ? 'none' : `1px solid ${c.border}`,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: c.fg2, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Nota</label>
            <textarea
              defaultValue="Vino al local, pidió ver la unidad. Tiene un Amarok 2019 para entregar en parte de pago."
              rows={3}
              style={{
                width: '100%', padding: '12px 14px', background: c.card, border: `1px solid ${c.border}`,
                borderRadius: 10, color: c.fg, fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'none', lineHeight: 1.5,
              }} />
          </div>

          {/* Toggles */}
          {[
            { l: 'Tiene auto en parte de pago', on: true },
            { l: 'Necesita financiación', on: false },
            { l: 'Recordarme en 2 días', on: true },
          ].map(t => (
            <div key={t.l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: c.card, borderRadius: 10, border: `1px solid ${c.border}` }}>
              <span style={{ fontSize: 13, color: c.fg }}>{t.l}</span>
              <div style={{ width: 36, height: 20, borderRadius: 999, background: t.on ? c.accent : c.border, position: 'relative', transition: 'background .2s' }}>
                <div style={{ width: 16, height: 16, borderRadius: 999, background: '#fff', position: 'absolute', top: 2, left: t.on ? 18 : 2, transition: 'left .2s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky save */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 78,
        padding: '12px 16px',
        background: `linear-gradient(180deg, transparent 0%, ${c.bg} 30%)`,
      }}>
        <button style={{
          width: '100%', padding: '14px', background: c.fg, color: c.bg, border: 0,
          borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>Guardar lead</button>
      </div>

      <MobileTabs theme={theme} active="lead" />
    </MobileFrame>
  );
}

Object.assign(window, { MobileFrame, MobileCatalogQuick, MobileVehicleDetail, MobileNewLead });
