export const getToken = () => localStorage.getItem('tok') || ''
export const setToken = t => (t ? localStorage.setItem('tok', t) : localStorage.removeItem('tok'))
export async function api(path, opts = {}) {
  const headers = { ...(opts.headers || {}) }
  if (getToken()) headers.Authorization = 'Bearer ' + getToken()
  const r = await fetch('/api' + path, { ...opts, headers })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) {
    if (r.status === 401 && path !== '/login') setToken('')
    throw new Error(d.error || 'Request failed')
  }
  return d
}
