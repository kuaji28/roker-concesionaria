// ── Public site shared chrome: TopBar (web) + BottomNav (mobile)

function PublicTopBar({ theme, active = 'home', onNav }) {
  const c = theme.colors;
  const items = [
    { id: 'home', label: 'Inicio' },
    { id: 'catalog', label: 'Stock' },
    { id: 'sell', label: 'Vendé tu auto' },
    { id: 'finance', label: 'Financiación' },
    { id: 'contact', label: 'Contacto' },
  ];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      padding: '16px 32px',
      background: theme.resolved === 'dark' ? 'rgba(10,10,12,.85)' : 'rgba(250,250,247,.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${c.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Logo height={42} theme={theme} />
        <nav style={{ display: 'flex', gap: 4 }}>
          {items.map(it => (
            <button key={it.id}
              onClick={() => onNav?.(it.id)}
              style={{
                padding: '8px 14px', borderRadius: 999,
                background: active === it.id ? c.card : 'transparent',
                color: active === it.id ? c.fg : c.fg2,
                border: 0, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'inherit',
              }}>{it.label}</button>
          ))}
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ThemeToggle theme={theme} />
        <a target="_blank" rel="noreferrer" href={`https://wa.me/541162692000`} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 18px', background: c.accent, color: '#fff',
          borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none',
        }}>
          <WhatsAppIcon size={14} /> WhatsApp
        </a>
      </div>
    </header>
  );
}

function MobileBottomNav({ theme, active = 'home', onNav }) {
  const c = theme.colors;
  const items = [
    { id: 'home',    icon: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z', label: 'Inicio' },
    { id: 'catalog', icon: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM21 21l-4.35-4.35', label: 'Buscar' },
    { id: 'fav',     icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z', label: 'Favoritos' },
    { id: 'contact', icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z', label: 'Contacto' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '10px 12px 28px',
      background: theme.resolved === 'dark' ? 'rgba(10,10,12,.95)' : 'rgba(255,255,255,.95)',
      backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${c.border}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    }}>
      {items.map(it => (
        <button key={it.id} onClick={() => onNav?.(it.id)}
          style={{
            background: 'transparent', border: 0,
            color: active === it.id ? c.accent : c.fg2,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '6px 10px', cursor: 'pointer',
          }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={it.icon}/>
          </svg>
          <span style={{ fontSize: 10, fontWeight: 600 }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

function PhoneFrame({ children, theme, statusBarStyle = 'auto' }) {
  const c = theme.colors;
  const sbStyle = statusBarStyle === 'auto' ? c.fg : statusBarStyle === 'light' ? '#fff' : '#000';
  return (
    <div style={{
      width: 390, height: 844, borderRadius: 48, overflow: 'hidden',
      background: c.bg, border: `12px solid ${theme.resolved === 'dark' ? '#1a1a1a' : '#222'}`,
      boxShadow: c.shadow, position: 'relative', flexShrink: 0,
    }}>
      {/* Status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
        height: 50, padding: '14px 28px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 14, fontWeight: 600, color: sbStyle,
        pointerEvents: 'none',
      }}>
        <span>9:41</span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M0 7h2v4H0zM4 5h2v6H4zM8 3h2v8H8zM12 0h2v11h-2z"/></svg>
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M2 2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm12 1H2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM3 4h10v3H3z"/></svg>
        </span>
      </div>
      {/* Content viewport (with scroll, top padding for status bar) */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { PublicTopBar, MobileBottomNav, PhoneFrame });
