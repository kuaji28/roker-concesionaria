// ── Theme system: dark / light / auto ──────────────────────────
// Usage: const t = useTheme(); t.colors.bg, t.colors.fg, etc.
// Toggle: t.setMode('dark' | 'light' | 'auto')

// (no exports — globals via Object.assign at end of file)
const THEME_TOKENS = {
  dark: {
    bg: '#0a0a0c',
    bg2: '#16161a',
    card: '#16161a',
    cardHover: '#1d1d22',
    fg: '#ffffff',
    fg2: '#9aa0a6',
    fg3: '#6b6f76',
    accent: '#ff2d55',          // sport red
    accentHover: '#ff4569',
    border: 'rgba(255,255,255,.08)',
    borderStrong: 'rgba(255,255,255,.16)',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
    shadow: '0 12px 40px rgba(0,0,0,.5)',
    shadowSm: '0 2px 12px rgba(0,0,0,.3)',
    overlay: 'rgba(0,0,0,.7)',
    mapFilter: 'invert(.92) hue-rotate(180deg) saturate(.6) brightness(.95)',
    logoFilter: 'invert(1)',
  },
  light: {
    bg: '#fafaf7',
    bg2: '#ffffff',
    card: '#ffffff',
    cardHover: '#f5f4f0',
    fg: '#0c0c0c',
    fg2: '#525252',
    fg3: '#8a8a8a',
    accent: '#e11d48',
    accentHover: '#be123c',
    border: '#e8e6df',
    borderStrong: '#d4d2cb',
    success: '#16a34a',
    warning: '#d97706',
    info: '#2563eb',
    shadow: '0 12px 40px rgba(0,0,0,.08)',
    shadowSm: '0 2px 12px rgba(0,0,0,.04)',
    overlay: 'rgba(0,0,0,.5)',
    mapFilter: 'none',
    logoFilter: 'none',
  },
};

function resolveMode(mode) {
  if (mode !== 'auto') return mode;
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function useTheme(initialMode = 'dark') {
  const [mode, setModeRaw] = React.useState(initialMode);
  const resolved = resolveMode(mode);

  // listen to system preference when in auto
  React.useEffect(() => {
    if (mode !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setModeRaw('auto'); // re-trigger render
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  return {
    mode,
    resolved,
    colors: THEME_TOKENS[resolved],
    setMode: setModeRaw,
  };
}

function ThemeToggle({ theme, style }) {
  const { mode, setMode, colors } = theme;
  const opts = [
    { v: 'light', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> },
    { v: 'auto', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/></svg> },
    { v: 'dark', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> },
  ];
  return (
    <div style={{
      display: 'inline-flex', padding: 3, gap: 0,
      background: colors.card, borderRadius: 999,
      border: `1px solid ${colors.border}`,
      ...style,
    }}>
      {opts.map(o => (
        <button key={o.v}
          onClick={() => setMode(o.v)}
          aria-label={`Modo ${o.v}`}
          style={{
            width: 28, height: 28, borderRadius: 999,
            background: mode === o.v ? colors.fg : 'transparent',
            color: mode === o.v ? colors.bg : colors.fg2,
            border: 0, cursor: 'pointer', display: 'grid', placeItems: 'center',
            transition: 'all .15s',
          }}>
          {o.icon}
        </button>
      ))}
    </div>
  );
}

Object.assign(window, { THEME_TOKENS, useTheme, ThemeToggle, resolveMode });
