import { createContext, useContext, useEffect, useState } from 'react'
import { getTC } from '../lib/supabase'

const FALLBACK = 1415
const REFRESH_MS = 10 * 60 * 1000 // 10 minutos

async function fetchTcFromApi() {
  const res = await fetch('https://dolarapi.com/v1/dolares/blue')
  if (!res.ok) throw new Error(`dolarapi status ${res.status}`)
  const json = await res.json()
  const val = Number(json?.venta)
  if (!val || isNaN(val)) throw new Error('venta inválido')
  return val
}

async function resolveTc() {
  try {
    return await fetchTcFromApi()
  } catch {
    // Fallback: leer desde Supabase config
    try {
      return await getTC()
    } catch {
      return FALLBACK
    }
  }
}

export function useTc() {
  const [tc, setTc] = useState(FALLBACK)

  useEffect(() => {
    resolveTc().then(setTc)
    const id = setInterval(() => resolveTc().then(setTc), REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  return tc
}

// ── Context para evitar prop-drilling ──────────────────────────────────────
export const TcContext = createContext(FALLBACK)

export function useTcContext() {
  return useContext(TcContext)
}
