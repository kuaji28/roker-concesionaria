const AI_BASE = import.meta.env.VITE_AI_API_URL || ''

export function aiConfigured() {
  return !!AI_BASE
}

export async function callAI(endpoint, body) {
  if (!AI_BASE) throw new Error('IA no configurada. Agregá VITE_AI_API_URL en .env')
  const res = await fetch(`${AI_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || `Error ${res.status}`)
  }
  return res.json()
}

export async function callAIFiles(endpoint, files, extra = {}) {
  if (!AI_BASE) throw new Error('IA no configurada. Agregá VITE_AI_API_URL en .env')
  const fd = new FormData()
  files.forEach((f, i) => fd.append(`file${i}`, f))
  Object.entries(extra).forEach(([k, v]) => fd.append(k, String(v)))
  const res = await fetch(`${AI_BASE}${endpoint}`, { method: 'POST', body: fd })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || `Error ${res.status}`)
  }
  return res.json()
}
