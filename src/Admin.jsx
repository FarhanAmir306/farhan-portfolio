import { useEffect, useRef, useState } from 'react'
import { api, getToken, setToken } from './api'
import { filters, merged } from './data'

const CATS = filters.slice(1)
// field types: (none)=text, a=textarea, i=image upload, l=YouTube/Vimeo link, u=https link
const SECTIONS = {
  hero: [['name', 'Your name (logo)'], ['heroLine1', 'Headline, line 1'], ['heroLine2', 'Headline, line 2 (lime colour)'], ['heroText', 'Intro text', 'a'], ['availability', 'Availability badge'], ['ctaPrimary', 'Primary button text'], ['ctaSecondary', 'Secondary button text'], ['portrait', 'Hero portrait image', 'i'], ['heroVideo', 'Background video link (optional, direct .mp4 link)', 'u']],
  reel: [['reelLabel', 'Showreel label'], ['reelTitle', 'Section title'], ['showreelEmbed', 'Showreel YouTube / Vimeo link', 'l'], ['showreelThumb', 'Showreel thumbnail image', 'i'], ['showreelDuration', 'Duration label']],
  works: [['worksTitle', 'Section title'], ['worksSub', 'Subtitle', 'a']],
  about: [['aboutImage', 'About section image (separate from the hero)', 'i'], ['aboutTitle', 'Headline'], ['aboutIntro', 'Introduction', 'a'], ['bio', 'Biography', 'a'], ['philosophy', 'Creative philosophy', 'a'], ['storytelling', 'Approach to storytelling', 'a']],
  contact: [['contactTitle', 'Headline'], ['contactText', 'Supporting text', 'a'], ['email', 'Email address'], ['whatsapp', 'WhatsApp number (with country code, e.g. +8801XXXXXXXXX)'], ['instagram', 'Instagram link', 'u'], ['behance', 'Behance link', 'u'], ['linkedin', 'LinkedIn link', 'u'], ['formEndpoint', 'Contact form endpoint (Formspree link, optional)', 'u']],
  footer: [['tagline', 'Footer tagline'], ['seoTitle', 'Browser tab title / Google title'], ['seoDescription', 'Google description', 'a']],
}
const TABS = [['projects', 'Projects'], ['hero', 'Hero'], ['reel', 'Showreel'], ['works', 'Works heading'], ['about', 'About'], ['services', 'Services'], ['process', 'Process'], ['software', 'Software'], ['contact', 'Contact & links'], ['footer', 'Footer & SEO']]

const thumb = p => p.image ? <img src={p.image} alt="" draggable={false} /> : <div className="thumb">{p.embed ? 'VIDEO' : 'NO MEDIA'}</div>

function ImageField({ label, value, onChange }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const pick = async e => {
    const f = e.target.files[0]; if (!f) return
    setBusy(true); setErr('')
    try { const fd = new FormData(); fd.append('image', f); onChange((await api('/upload', { method: 'POST', body: fd })).url) } catch (x) { setErr(x.message) }
    setBusy(false); e.target.value = ''
  }
  return (
    <div className="imgf">
      <span className="lbl">{label}</span>
      <div className="imgrow">
        {value ? <img src={value} alt="" /> : <div className="thumb">NO IMAGE</div>}
        <div className="imgact">
          <input type="file" accept="image/*" onChange={pick} disabled={busy} />
          {value && <button type="button" className="btn sm" onClick={() => onChange('')}>Remove image</button>}
          {busy && <div className="sub">Uploading…</div>}
          {err && <div className="ok err">{err}</div>}
        </div>
      </div>
    </div>
  )
}

function Field({ k, label, type, d, set }) {
  const v = d[k] ?? ''
  const on = val => set({ ...d, [k]: val })
  if (type === 'i') return <ImageField label={label} value={v} onChange={on} />
  return (
    <label>{label}
      {type === 'a'
        ? <textarea value={v} onChange={e => on(e.target.value)} />
        : <input value={v} onChange={e => on(e.target.value)} placeholder={type === 'l' ? 'https://www.youtube.com/watch?v=…' : type === 'u' ? 'https://…' : ''} />}
    </label>
  )
}

function Rows({ items, set, blank, max, label, render }) {
  const swap = (i, j) => { if (j < 0 || j >= items.length) return; const a = [...items];[a[i], a[j]] = [a[j], a[i]]; set(a) }
  return (
    <div className="rows">
      {items.map((it, i) => (
        <div className="rowbox" key={i}>
          {render(it, patch => set(items.map((x, j) => (j === i ? { ...x, ...patch } : x))))}
          <div className="rowact">
            <button type="button" className="btn sm" onClick={() => swap(i, i - 1)} aria-label="Move up">↑</button>
            <button type="button" className="btn sm" onClick={() => swap(i, i + 1)} aria-label="Move down">↓</button>
            <button type="button" className="btn sm" onClick={() => set(items.filter((_, j) => j !== i))}>Remove</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn sm" onClick={() => set([...items, blank])} disabled={items.length >= max}>+ Add {label}</button>
    </div>
  )
}

function ProjectForm({ p, onDone, onCancel, onAuthFail }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('')
    try {
      await api(p ? '/projects/' + p.id : '/projects', { method: p ? 'PUT' : 'POST', body: new FormData(e.target) })
      onDone(p ? 'Project updated.' : 'Project added. It is live on your site now.')
    } catch (x) { setErr(x.message); if (x.message === 'Unauthorized') onAuthFail() }
    setBusy(false)
  }
  return (
    <form className="panel" onSubmit={submit}>
      <h2 className="mh">{p ? 'Edit project' : 'Add a project'}</h2>
      <label>Title<input name="title" required maxLength={120} defaultValue={p?.title} /></label>
      <div className="two">
        <label>Category<select name="category" defaultValue={p?.category || 'video'}>{CATS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}</select></label>
        <label>Year<input name="year" defaultValue={p?.year || new Date().getFullYear()} maxLength={4} /></label>
      </div>
      <label>Description<textarea name="description" maxLength={1000} defaultValue={p?.description} /></label>
      {p?.image && (
        <div className="imgrow"><img src={p.image} alt="" /><label className="chk"><input type="checkbox" name="removeImage" value="1" /> Remove current cover image</label></div>
      )}
      <label>{p?.image ? 'Replace cover image' : 'Cover image'} (jpg, png, webp, up to 10 MB. Required for graphic design)<input name="image" type="file" accept="image/*" /></label>
      <label>YouTube or Vimeo link (the thumbnail is automatic if you add no image)<input name="embed" defaultValue={p?.embed} placeholder="https://www.youtube.com/watch?v=..." /></label>
      <div className="row">
        <button className="btn pri" type="submit" disabled={busy}>{busy ? 'Saving…' : p ? 'Save changes' : 'Add project'}</button>
        {onCancel && <button type="button" className="btn" onClick={onCancel}>Cancel</button>}
      </div>
      {err && <div className="ok err" role="alert">{err}</div>}
    </form>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(!!getToken())
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [list, setList] = useState([])
  const [msg, setMsg] = useState('')
  const [mode, setMode] = useState('')
  const [tab, setTab] = useState('projects')
  const [editing, setEditing] = useState(null) // project id | 'new' | null
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => api('/projects').then(setList).catch(e => setErr(e.message))
  const [dragId, setDragId] = useState(null)
  const listRef = useRef([])
  listRef.current = list
  const moveItem = (a, id, to) => { const i = a.findIndex(p => p.id === id); if (i < 0 || to < 0 || to >= a.length) return a; const b = [...a]; const [it] = b.splice(i, 1); b.splice(to, 0, it); return b }
  const saveOrder = async l => {
    try { await api('/projects-order', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: l.map(p => p.id) }) }); setMsg('Order saved. Your live site now shows this order.') } catch (x) { setMsg(x.message) }
  }
  const step = (id, dir) => { const i = list.findIndex(p => p.id === id); const l = moveItem(list, id, i + dir); setList(l); saveOrder(l) }
  useEffect(() => { api('/health').then(d => setMode(d.storage)).catch(() => {}) }, [])
  useEffect(() => {
    if (!authed) return
    load()
    api('/content').then(c => setDraft(merged(c))).catch(e => setErr(e.message))
  }, [authed])

  const login = async e => {
    e.preventDefault()
    try {
      const r = await api('/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })
      setToken(r.token); setAuthed(true); setErr('')
    } catch (x) { setErr(x.message) }
  }
  const out = () => { setToken(''); setAuthed(false) }
  const del = async id => {
    if (!confirm('Delete this project?')) return
    try { await api('/projects/' + id, { method: 'DELETE' }); load() } catch (x) { setMsg(x.message) }
  }
  const save = async () => {
    setSaving(true); setMsg('')
    try {
      const r = await api('/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) })
      setDraft(merged(r)); setMsg('Saved. Your live site is updated (refresh it to see the changes).')
    } catch (x) { setMsg(x.message); if (x.message === 'Unauthorized') setAuthed(false) }
    setSaving(false)
  }
  const fields = k => SECTIONS[k].map(([f, label, type]) => <Field key={f} k={f} label={label} type={type} d={draft} set={setDraft} />)

  return (
    <div className="adm">
      <div className="wrap">
        <div className="atop">
          <a href="/" className="logo">← View site</a>
          {authed && <button className="btn sm" onClick={out}>Log out</button>}
        </div>
        {!authed ? (
          <form className="panel" onSubmit={login}>
            <h2 className="mh">Admin</h2>
            <label>Password<input type="password" value={pw} onChange={e => setPw(e.target.value)} required autoFocus /></label>
            <button className="btn pri" type="submit">Log in</button>
            {err && <div className="ok err" role="alert">{err}</div>}
          </form>
        ) : (
          <>
            <p className="sub">Storage: {mode === 'supabase' ? 'Supabase (permanent)' : mode === 'local' ? 'Local files (not permanent on free hosts)' : 'checking…'}</p>
            <div className="filters tabs" role="tablist">
              {TABS.map(([id, label]) => <button key={id} role="tab" className={tab === id ? 'on' : ''} onClick={() => { setTab(id); setMsg(''); setEditing(null) }}>{label}</button>)}
            </div>

            {tab === 'projects' && (
              <>
                {msg && <div className="ok" role="status">{msg}</div>}
                {editing === 'new'
                  ? <ProjectForm key="new" onAuthFail={out} onCancel={() => setEditing(null)} onDone={m => { setEditing(null); setMsg(m); load() }} />
                  : <button className="btn pri" onClick={() => { setEditing('new'); setMsg('') }}>+ Add project</button>}
                <h3 className="lh">Your projects ({list.length})</h3>
                {!list.length && <p className="sub">No projects yet. Visitors currently see sample placeholders until you add your first one.</p>}
                <div className="alist">
                  {list.map(p => editing === p.id
                    ? <ProjectForm key={p.id} p={p} onAuthFail={out} onCancel={() => setEditing(null)} onDone={m => { setEditing(null); setMsg(m); load() }} />
                    : (
                      <div className={`arow ${dragId === p.id ? 'drag' : ''}`} key={p.id} draggable
                        onDragStart={e => { setDragId(p.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', p.id) }}
                        onDragOver={e => { e.preventDefault(); if (dragId && dragId !== p.id) setList(moveItem(listRef.current, dragId, listRef.current.findIndex(x => x.id === p.id))) }}
                        onDragEnd={() => { setDragId(null); saveOrder(listRef.current) }}>
                        <span className="grip" title="Drag to reorder" aria-hidden="true">⠿</span>
                        {thumb(p)}
                        <div><strong>{p.title}</strong><div className="sub">{CATS.find(f => f.id === p.category)?.label} · {p.year}</div></div>
                        <div className="acts"><button className="btn sm" onClick={() => step(p.id, -1)} aria-label="Move up">↑</button><button className="btn sm" onClick={() => step(p.id, 1)} aria-label="Move down">↓</button><button className="btn sm" onClick={() => { setEditing(p.id); setMsg('') }}>Edit</button><button className="btn sm" onClick={() => del(p.id)}>Delete</button></div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {tab !== 'projects' && !draft && <p className="sub">Loading…</p>}
            {tab !== 'projects' && draft && (
              <>
                <div className="panel">
                  <h2 className="mh">{TABS.find(t => t[0] === tab)[1]}</h2>
                  {SECTIONS[tab] && fields(tab)}
                  {tab === 'services' && (
                    <>
                      <Field k="servicesTitle" label="Section headline" d={draft} set={setDraft} />
                      <Rows label="service" max={12} items={draft.services} blank={{ title: '', items: [] }} set={v => setDraft({ ...draft, services: v })}
                        render={(s, up) => (
                          <>
                            <label>Service name<input value={s.title} onChange={e => up({ title: e.target.value })} /></label>
                            <label>What you offer (one per line)<textarea value={(s.items || []).join('\n')} onChange={e => up({ items: e.target.value.split('\n') })} /></label>
                          </>
                        )} />
                    </>
                  )}
                  {tab === 'process' && (
                    <>
                      <Field k="processTitle" label="Section headline" d={draft} set={setDraft} />
                      <Rows label="step" max={8} items={draft.steps} blank={{ title: '', text: '' }} set={v => setDraft({ ...draft, steps: v })}
                        render={(s, up) => (
                          <>
                            <label>Step name<input value={s.title} onChange={e => up({ title: e.target.value })} /></label>
                            <label>Description<textarea value={s.text} onChange={e => up({ text: e.target.value })} /></label>
                          </>
                        )} />
                    </>
                  )}
                  {tab === 'software' && (
                    <Rows label="software" max={20} items={draft.software} blank={{ abbr: '', name: '' }} set={v => setDraft({ ...draft, software: v })}
                      render={(s, up) => (
                        <div className="two">
                          <label>Name<input value={s.name} onChange={e => up({ name: e.target.value })} /></label>
                          <label>Icon letters (max 3)<input value={s.abbr} maxLength={3} onChange={e => up({ abbr: e.target.value })} /></label>
                        </div>
                      )} />
                  )}
                </div>
                <div className="savebar">
                  <button className="btn pri" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
                  <span className={msg.startsWith('Saved') ? 'ok' : 'ok err'} role="status">{msg}</span>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
