import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const TABS = [
  {
    id: 'cat',
    label: 'Catálogo',
    to: '/vendedor',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    id: 'lead',
    label: 'Nuevo lead',
    to: '/vendedor/lead/nuevo',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  },
  {
    id: 'msg',
    label: 'Mensajes',
    to: '/leads',
    badge: null,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
]

export default function VendedorTabs({ active }) {
  const navigate = useNavigate()
  return (
    <div style={{
      display: 'flex',
      background: 'var(--c-card)',
      borderTop: '1px solid var(--c-border)',
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
      flexShrink: 0,
    }}>
      {TABS.map(t => {
        const on = active === t.id
        return (
          <button
            key={t.id}
            onClick={() => navigate(t.to)}
            style={{
              flex: 1, padding: '10px 4px 12px', background: 'transparent', border: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              color: on ? 'var(--c-accent)' : 'var(--c-fg-2)', cursor: 'pointer', fontFamily: 'inherit', position: 'relative',
            }}
          >
            <div style={{ position: 'relative' }}>
              {t.icon}
              {t.badge != null && (
                <span style={{ position: 'absolute', top: -4, right: -6, background: 'var(--c-accent)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 999, minWidth: 16, textAlign: 'center' }}>
                  {t.badge}
                </span>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
