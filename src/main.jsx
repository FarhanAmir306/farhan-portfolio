import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Admin from './Admin.jsx'
import { applyContent } from './data'
import './styles.css'

async function boot() {
  const isAdmin = location.pathname.startsWith('/admin')
  if (!isAdmin) {
    // load the content you saved in /admin before showing the site (falls back to defaults if the API is unreachable)
    try {
      const c = new AbortController()
      const t = setTimeout(() => c.abort(), 4000)
      const r = await fetch('/api/content', { signal: c.signal })
      clearTimeout(t)
      if (r.ok) applyContent(await r.json())
    } catch {}
  }
  const Page = isAdmin ? Admin : App
  createRoot(document.getElementById('root')).render(<Page />)
}
boot()



// portfolio