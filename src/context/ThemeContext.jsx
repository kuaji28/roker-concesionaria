import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const TOKENS = {
  dark: {
    bg:           '#0a0a0c',
    bg2:          '#16161a',
    card:         '#16161a',
    cardHover:    '#1d1d22',
    fg:           '#ffffff',
    fg2:          '#9aa0a6',
    fg3:          '#6b6f76',
    accent:       '#ff2d55',
    accentHover:  '#ff4569',
    border:       'rgba(255,255,255,.08)',
    borderStrong: 'rgba(255,255,255,.16)',
    success:      '#22c55e',
    warning:      '#f59e0b',
    info:         '#3b82f6',
    shadow:       '0 12px 40px rgba(0,0,0,.5)',
    shadowSm:     '0 2px 12px rgba(0,0,0,.3)',
    overlay:      'rgba(0,0,0,.7)',
    mapFilter:    'invert(.92) hue-rotate(180deg) saturate(.6) brightness(.95)',
    logoFilter:   'none',
    resolved:     'dark',
  },
  light: {
    bg:           '#fafaf7',
    bg2:          '#ffffff',
    card:         '#ffffff',
    cardHover:    '#f5f4f0',
    fg:           '#0c0c0c',
    fg2:          '#525252',
    fg3:          '#8a8a8a',
    accent:       '#e11d48',
    accentHover:  '#be123c',
    border:       '#e8e6df',
    borderStrong: '#d4d2cb',
    success:      '#16a34a',
    warning:      '#d97706',
    info:         '#2563eb',
    shadow:       '0 12px 40px rgba(0,0,0,.08)',
    shadowSm:     '0 2px 12px rgba(0,0,0,.04)',
    overlay:      'rgba(0,0,0,.5)',
    mapFilter:    'none',
    logoFilter:   'none',
    resolved:     'light',
  },
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [mode, setModeRaw] = useState(
    () => localStorage.getItem('gh-theme') || 'dark'
  )

  const resolved = useMemo(() => {
    if (mode !== 'auto') return mode
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [mode])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved)
    localStorage.setItem('gh-theme', mode)
  }, [mode, resolved])

  useEffect(() => {
    if (mode !== 'auto') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setModeRaw('auto')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  function setMode(m) { setModeRaw(m) }

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolved, colors: TOKENS[resolved] }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
