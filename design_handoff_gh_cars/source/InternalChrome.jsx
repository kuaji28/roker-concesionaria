// ── Internal app: Sidebar (collapsible) + TopBar ──────────────

function InternalSidebar({ theme, active = 'dashboard', onNav, collapsed, setCollapsed }) {
  const c = theme.colors;
  const items = [
    { id: 'dashboard', label: 'Dashboard',     icon: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z' },
    { id: 'catalog',   label: 'Catálogo',      icon: 'M5 11h14M7 11V8a5 5 0 0 1 10 0v3M5 11l1 8h12l1-8M9 15h.01M15 15h.01' },
    { id: 'search',    label: 'Buscar',        icon: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM21 21l-4.35-4.35' },
    { id: 'add',       label: 'Ingresar',      icon: 'M12 5v14M5 12h14' },
    { id: 'sales',     label: 'Ventas',        icon: 'M2 7h20M5 7l1 11h12l1-11M9 11v4M15 11v4' },
    { id: 'leads',     label: 'Prospectos',    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
    { id: 'clients',   label: 'Clientes',      icon: 'M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' },
    { id: 'agenda',    label: 'Agenda',        icon: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18' },
    { id: 'reports',   label: 'Reportes',      icon: 'M3 3v18h18M7 14l4-4 4 4 6-6' },
  ];
  const admin = [
    { id: 'manager',   label: 'Dashboard Gerente', icon: 'M9 11l3-8 3 8M3 21l9-9 9 9' },
    { id: 'expenses',  label: 'Gastos & Margen',   icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { id: 'turnover',  label: 'Rotación stock',    icon: 'M12 6V3M12 21v-3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1' },
    { id: 'sellers',   label: 'Vendedores',        icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
    { id: 'settings',  label: 'Configuración',     icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
  ];

  const w = collapsed ? 72 : 232;

  function NavItem({ it }) {
    const on = active === it.id;
    return (
      <button
        onClick={() => onNav?.(it.id)}
        title={collapsed ? it.label : undefined}
        style={{
          width: '100%', padding: collapsed ? '10px 0' : '10px 12px',
          background: on ? c.card : 'transparent',
          color: on ? c.fg : c.fg2,
          border: 0, borderRadius: 10, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 12,
          justifyContent: collapsed ? 'center' : 'flex-start',
          fontSize: 13, fontWeight: on ? 600 : 500,
          fontFamily: 'inherit', position: 'relative',
        }}>
        {on && <span style={{ position: 'absolute', left: -8, top: 8, bottom: 8, width: 3, borderRadius: 2, background: c.accent }} />}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d={it.icon} />
        </svg>
        {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{it.label}</span>}
      </button>
    );
  }

  return (
    <aside style={{
      width: w, flexShrink: 0,
      background: c.bg2, borderRight: `1px solid ${c.border}`,
      padding: '20px 12px',
      display: 'flex', flexDirection: 'column', gap: 4,
      transition: 'width .2s ease',
      height: '100%', overflowY: 'auto',
    }}>
      {/* Brand */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: collapsed ? '4px 0' : '4px 8px', marginBottom: 8,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <Logo height={32} theme={theme} />
        {!collapsed && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: c.fg, letterSpacing: '-0.01em' }}>GH Cars</p>
            <p style={{ fontSize: 10, color: c.fg2, margin: 0 }}>Gestión Automotriz</p>
          </div>
        )}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
        {items.map(it => <NavItem key={it.id} it={it} />)}
      </nav>

      {!collapsed && (
        <div style={{ padding: '14px 8px 6px', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: c.fg3, fontWeight: 700 }}>Admin</div>
      )}
      {collapsed && <div style={{ height: 1, background: c.border, margin: '12px 8px' }} />}

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {admin.map(it => <NavItem key={it.id} it={it} />)}
      </nav>

      <div style={{ flex: 1 }} />

      {/* TC + collapse */}
      {!collapsed && (
        <div style={{ padding: 12, background: c.card, borderRadius: 12, border: `1px solid ${c.border}`, marginBottom: 8 }}>
          <p style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: c.fg3, margin: 0, fontWeight: 700 }}>Cotización USD</p>
          <p style={{ fontSize: 18, fontWeight: 800, margin: '4px 0 0', color: c.fg, letterSpacing: '-0.02em' }}>$ {fmt(TC)}</p>
          <p style={{ fontSize: 10, color: c.fg2, margin: 0 }}>ARS · al cierre</p>
        </div>
      )}

      <button onClick={() => setCollapsed(!collapsed)} style={{
        background: 'transparent', border: `1px solid ${c.border}`, color: c.fg2,
        borderRadius: 10, padding: 8, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', fontSize: 12,
      }}>
        <ArrowIcon size={12} dir={collapsed ? 'right' : 'left'} />
        {!collapsed && <span>Colapsar</span>}
      </button>
    </aside>
  );
}

function InternalTopBar({ theme, title, subtitle, user = { nombre: 'Gustavo', rol: 'Dueño', initial: 'G', color: '#f59e0b' } }) {
  const c = theme.colors;
  return (
    <div style={{
      padding: '14px 28px',
      borderBottom: `1px solid ${c.border}`,
      background: theme.resolved === 'dark' ? 'rgba(10,10,12,.6)' : 'rgba(250,250,247,.6)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', gap: 16,
      position: 'sticky', top: 0, zIndex: 20,
    }}>
      {/* search */}
      <div style={{
        flex: 1, maxWidth: 440,
        padding: '8px 14px', background: c.card, border: `1px solid ${c.border}`,
        borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.fg2} strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
        <input placeholder="Buscar vehículos, clientes, patente…" style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', color: c.fg, fontSize: 13, fontFamily: 'inherit' }} />
        <kbd style={{ fontSize: 10, color: c.fg3, padding: '2px 6px', background: c.bg, borderRadius: 4, border: `1px solid ${c.border}` }}>/</kbd>
      </div>
      <div style={{ flex: 1 }} />
      <ThemeToggle theme={theme} />
      <button style={{ width: 36, height: 36, borderRadius: 10, background: c.card, border: `1px solid ${c.border}`, color: c.fg, cursor: 'pointer', display: 'grid', placeItems: 'center', position: 'relative' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 999, background: c.accent }} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: c.fg, margin: 0, lineHeight: 1.2 }}>{user.nombre}</p>
          <p style={{ fontSize: 10, fontWeight: 700, color: user.color, margin: 0, textTransform: 'uppercase', letterSpacing: '.05em' }}>{user.rol}</p>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 999, background: user.color, color: '#fff', fontWeight: 700, fontSize: 14, display: 'grid', placeItems: 'center' }}>{user.initial}</div>
      </div>
    </div>
  );
}

Object.assign(window, { InternalSidebar, InternalTopBar });
