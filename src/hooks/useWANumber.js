import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const FALLBACK = '5491162692000'
let _cached = null

export function useWANumber() {
  const [waNumber, setWaNumber] = useState(_cached || FALLBACK)

  useEffect(() => {
    if (_cached) { setWaNumber(_cached); return }
    supabase
      .from('config')
      .select('valor')
      .eq('clave', 'wa_number')
      .single()
      .then(({ data }) => {
        const val = data?.valor?.trim() || FALLBACK
        _cached = val
        setWaNumber(val)
      })
      .catch(() => {})
  }, [])

  return waNumber
}
