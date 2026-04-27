import { createContext, useContext, useEffect, useState } from 'react'
import { getTC } from '../lib/supabase'

const FALLBACK = 1415
const REFRESH_MS = 10 * 60 * 1000 // 10 minutos
const MANUAL_KEY = 'gh_manual_tc'
const TC_EVENT   = 'gh:tc-change'

async function fetchTcFromApi() {
  const res = await fetch('https://dolarapi.com/v1/dolares/blue')
  if (!res.ok) throw new Error(`dolarapi status ${res.status}`)
  const json = await res.json()
  const val = Number(json?.venta)
  if (!val || isNaN(val)) throw new Error('venta inválido')
  return val
}

async function resolveTc() {
  // 1) Manual override (localStorage) — set by user via Config or sidebar
  const manual = localStorage.getItem(MANUAL_KEY)
  if (manual) {
    const v = Number(manual)
    if (v && v > 100) return v
  }
  // 2) Live dolarapi rate — auto-refresh every 10 min
  try {
    return await fetchTcFromApi()
  } catch {
    // 3) Last-resort: Supabase config
    try { return await getTC() } catch { return FALLBACK }
  }
}

export function useTc() {
  const [tc, setTc] = useState(FALLBACK)

  useEffect(() => {
    resolveTc().then(setTc)
    const id = setInterval(() => resolveTc().then(setTc), REFRESH_MS)
    function onTcChange(e) { setTc(e.detail) }
    window.addEventListener(TC_EVENT, onTcChange)
    return () => {
      clearInterval(id)
      window.removeEventListener(TC_EVENT, onTcChange)
    }
  }, [])

  return tc
}

// Llamar después de updateTC() para que todos los useTc() reaccionen inmediatamente
export function broadcastTc(valor) {
  localStorage.setItem(MANUAL_KEY, String(valor))
  window.dispatchEvent(new CustomEvent(TC_EVENT, { detail: Number(valor) }))
}

// ── Context para evitar prop-drilling ──────────────────────────────────────
export const TcContext = createContext(FALLBACK)

export function useTcContext() {
  return useContext(TcContext)
}
