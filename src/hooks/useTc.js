import { useEffect, useState } from 'react'
import { getTC } from '../lib/supabase'

export function useTc(fallback = 1415) {
  const [tc, setTc] = useState(fallback)
  useEffect(() => { getTC().then(setTc) }, [])
  return tc
}
