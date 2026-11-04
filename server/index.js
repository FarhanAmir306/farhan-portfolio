import express from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// tiny .env loader (works on Windows too)
try { for (const l of fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '') } } catch {}

const PORT = process.env.PORT || 3001
const PASS = process.env.ADMIN_PASSWORD || 'change-me-123'
if (!process.env.ADMIN_PASSWORD) console.warn('\n  WARNING: ADMIN_PASSWORD is not set. Using the default password. Create a .env file (see .env.example).\n')
const SECRET = process.env.SECRET || crypto.createHash('sha256').update('s:' + PASS).digest('hex')

const BUCKET = 'portfolio'
const CONTENT_FILE = 'site-content.json'
const rnd = () => Date.now() + '-' + crypto.randomBytes(4).toString('hex')
const extOf = m => ({ 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/avif': '.avif' }[m] || '')
const bad = msg => Object.assign(new Error(msg), { client: true })
const shape = r => ({ id: r.id, title: r.title, category: r.category, year: r.year, description: r.description || '', image: r.image || '', video: '', embed: r.embed || '', createdAt: r.created_at })

// ---------- storage: Supabase (permanent) or local files (dev) ----------
let store
const DATA = process.env.DATA_DIR || path.join(__dirname, 'data')
const UP = path.join(DATA, 'uploads')
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth: { persistSession: false } })
  const T = () => sb.from('projects')
  const ok = ({ data, error }) => { if (error) throw error; return data }
  store = {
    mode: 'supabase',
    list: async () => ok(await T().select('*').order('created_at', { ascending: false })),
    get: async id => ok(await T().select('*').eq('id', id).maybeSingle()),
    insert: async row => ok(await T().insert(row).select().single()),
    update: async (id, row) => ok(await T().update(row).eq('id', id).select().maybeSingle()),
    delete: async id => { ok(await T().delete().eq('id', id)) },
    async putFile(file) {
      const p = rnd() + extOf(file.mimetype)
      ok(await sb.storage.from(BUCKET).upload(p, file.buffer, { contentType: file.mimetype }))
      return { path: p, url: sb.storage.from(BUCKET).getPublicUrl(p).data.publicUrl }
    },
    delFile: async p => { if (p) await sb.storage.from(BUCKET).remove([p]) },
    async getContent() {
      const { data, error } = await sb.storage.from(BUCKET).download(CONTENT_FILE)
      if (error) return {}
      try { return JSON.parse(await data.text()) } catch { return {} }
    },
    async setContent(o) { ok(await sb.storage.from(BUCKET).upload(CONTENT_FILE, Buffer.from(JSON.stringify(o)), { contentType: 'application/json', upsert: true })) },
  }
} else {
  fs.mkdirSync(UP, { recursive: true })
  const DB = path.join(DATA, 'projects.json'), CF = path.join(DATA, 'content.json')
  const rd = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return f === DB ? [] : {} } }
  const wr = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2))
  console.warn('  Storage: LOCAL files (not permanent on most hosts). Add SUPABASE_URL and SUPABASE_SERVICE_KEY to .env for permanent storage.')
  store = {
    mode: 'local',
    list: async () => rd(DB),
    get: async id => rd(DB).find(x => x.id === id) || null,
    async insert(row) { row.id = crypto.randomUUID(); row.created_at = new Date().toISOString(); wr(DB, [row, ...rd(DB)]); return row },
    async update(id, row) { let out = null; wr(DB, rd(DB).map(x => x.id === id ? (out = { ...x, ...row }) : x)); return out },
    delete: async id => wr(DB, rd(DB).filter(x => x.id !== id)),
    async putFile(file) { const n = rnd() + extOf(file.mimetype); fs.writeFileSync(path.join(UP, n), file.buffer); return { path: n, url: '/uploads/' + n } },
    delFile: async p => { if (p) await fs.promises.rm(path.join(UP, path.basename(p)), { force: true }) },
    getContent: async () => rd(CF),
    setContent: async o => wr(CF, o),
  }
}

// ---------- auth ----------
const sign = p => crypto.createHmac('sha256', SECRET).update(p).digest('hex')
const mkToken = () => { const e = Date.now() + 7 * 864e5; return e + '.' + sign(String(e)) }
const valid = t => { try { const [e, s] = String(t).split('.'); return +e > Date.now() && s.length === 64 && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(sign(e))) } catch { return false } }
const auth = (q, r, n) => valid((q.headers.authorization || '').replace('Bearer ', '')) ? n() : r.status(401).json({ error: 'Unauthorized' })
const h = f => (q, r, n) => f(q, r, n).catch(n)

// YouTube / Vimeo link -> embed URL (+ auto thumbnail for YouTube)
function embedOf(u) {
  u = String(u || '').trim()
  let m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/)
  if (m) return { embed: `https://www.youtube.com/embed/${m[1]}?rel=0`, thumb: `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` }
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (m) return { embed: `https://player.vimeo.com/video/${m[1]}`, thumb: '' }
  return null
}

// ---------- site content (everything editable from /admin) ----------
const STR = ['name', 'tagline', 'email', 'whatsapp', 'instagram', 'behance', 'linkedin', 'portrait', 'aboutImage', 'heroVideo', 'showreelThumb', 'showreelEmbed', 'showreelDuration', 'formEndpoint', 'bio', 'philosophy', 'storytelling', 'heroLine1', 'heroLine2', 'heroText', 'availability', 'ctaPrimary', 'ctaSecondary', 'reelLabel', 'reelTitle', 'worksTitle', 'worksSub', 'aboutTitle', 'aboutIntro', 'servicesTitle', 'processTitle', 'contactTitle', 'contactText', 'seoTitle', 'seoDescription']
const LINKS = ['instagram', 'behance', 'linkedin', 'formEndpoint']
const MEDIA = ['portrait', 'aboutImage', 'showreelThumb', 'heroVideo']
const str = (v, n = 2000) => String(v ?? '').trim().slice(0, n)
const arr = (v, n) => (Array.isArray(v) ? v.slice(0, n) : [])
function cleanContent(b = {}) {
  const o = {}
  for (const k of STR) if (k in b) o[k] = str(b[k])
  for (const k of LINKS) if (o[k] && !/^(https?:\/\/|mailto:|tel:)/i.test(o[k])) throw bad(`"${k}" must start with https://`)
  for (const k of MEDIA) if (o[k] && !/^(https:\/\/|\/)/.test(o[k])) throw bad(`"${k}" must be an https:// link or an uploaded image`)
  if (o.whatsapp && !/^(\+?[\d\s\-()]{6,20}|https:\/\/wa\.me\/\d+.*)$/i.test(o.whatsapp)) throw bad('WhatsApp must be a phone number like +8801XXXXXXXXX')
  if (o.showreelEmbed) { const e = embedOf(o.showreelEmbed); if (!e) throw bad('Showreel link must be a YouTube or Vimeo link'); o.showreelEmbed = e.embed }
  if ('services' in b) o.services = arr(b.services, 12).map(s => ({ title: str(s?.title, 80), items: arr(s?.items, 20).map(x => str(x, 80)).filter(Boolean) })).filter(s => s.title)
  if ('steps' in b) o.steps = arr(b.steps, 8).map(s => ({ title: str(s?.title, 60), text: str(s?.text, 300) })).filter(s => s.title)
  if ('software' in b) o.software = arr(b.software, 20).map(s => ({ abbr: str(s?.abbr, 3), name: str(s?.name, 60) })).filter(s => s.name)
  return o
}

// ---------- projects ----------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (q, f, cb) => /^image\/(jpeg|png|webp|gif|avif)$/.test(f.mimetype) ? cb(null, true) : cb(new Error('Unsupported file type. Use jpg, png, webp, gif or avif.')),
}).single('image')

// builds the row for add/edit; `old` is the existing row when editing
async function build(q, old) {
  const b = q.body
  const title = str(b.title, 120)
  if (!title) throw bad('Title is required')
  let e = { embed: '', thumb: '' }
  if (str(b.embed)) { e = embedOf(b.embed); if (!e) throw bad('Use a YouTube or Vimeo link') }
  const keep = !q.file && old?.image_path && b.removeImage !== '1'
  if (!q.file && !keep && !e.thumb && !e.embed) throw bad('Add a cover image or a YouTube / Vimeo link')
  const row = {
    title, category: ['video', 'design', 'cine'].includes(b.category) ? b.category : 'video',
    year: str(b.year || new Date().getFullYear(), 4), description: str(b.description, 1000), embed: e.embed,
  }
  if (q.file) { const f = await store.putFile(q.file); row.image = f.url; row.image_path = f.path }
  else if (keep) { row.image = old.image; row.image_path = old.image_path }
  else { row.image = e.thumb; row.image_path = '' }
  return { row, drop: q.file || !keep ? old?.image_path : '' }
}

const app = express()
app.set('trust proxy', 1)
app.use(express.json({ limit: '300kb' }))

const tries = new Map()
app.post('/api/login', (q, r) => {
  const t = tries.get(q.ip) || { n: 0, at: Date.now() }
  if (Date.now() - t.at > 9e5) { t.n = 0; t.at = Date.now() }
  if (t.n >= 10) return r.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' })
  const a = Buffer.from(String(q.body.password || '')), b = Buffer.from(PASS)
  if (!(a.length === b.length && crypto.timingSafeEqual(a, b))) { t.n++; tries.set(q.ip, t); return r.status(401).json({ error: 'Wrong password' }) }
  r.json({ token: mkToken() })
})

app.get('/api/health', (q, r) => r.json({ storage: store.mode }))
app.get('/api/content', h(async (q, r) => r.json(await store.getContent())))
app.put('/api/content', auth, h(async (q, r) => {
  const old = await store.getContent()
  const c = cleanContent(q.body)
  if (old.projectOrder) c.projectOrder = old.projectOrder // keep the project order saved from the Projects tab
  await store.setContent(c)
  r.json(c)
}))
app.put('/api/projects-order', auth, h(async (q, r) => {
  const ids = arr(q.body?.ids, 1000).map(x => str(x, 64))
  await store.setContent({ ...(await store.getContent()), projectOrder: ids })
  r.json({ ok: true })
}))
app.post('/api/upload', auth, upload, h(async (q, r) => { if (!q.file) throw bad('Choose an image first'); r.json({ url: (await store.putFile(q.file)).url }) }))

app.get('/api/projects', h(async (q, r) => {
  const [rows, c] = await Promise.all([store.list(), store.getContent()])
  const ord = c.projectOrder || []
  // projects that are not in the saved order yet (newly added) come first, the rest follow your order
  r.json(rows.map(shape).sort((a, b) => ord.indexOf(a.id) - ord.indexOf(b.id)))
}))
app.post('/api/projects', auth, upload, h(async (q, r) => {
  const { row } = await build(q, null)
  r.status(201).json(shape(await store.insert(row)))
}))
app.put('/api/projects/:id', auth, upload, h(async (q, r) => {
  const old = await store.get(q.params.id)
  if (!old) return r.status(404).json({ error: 'Not found' })
  const { row, drop } = await build(q, old)
  const p = await store.update(old.id, row)
  await store.delFile(drop)
  r.json(shape(p))
}))
app.delete('/api/projects/:id', auth, h(async (q, r) => {
  const old = await store.get(q.params.id)
  if (!old) return r.status(404).json({ error: 'Not found' })
  await store.delFile(old.image_path); await store.delete(old.id)
  r.json({ ok: true })
}))

app.use((e, q, r, n) => {
  const client = e.client || e.name === 'MulterError' || /^Unsupported/.test(e.message)
  if (!client) console.error(e)
  r.status(client ? 400 : 500).json({ error: client ? e.message : 'Server error. Check your Supabase settings.' })
})

const dist = path.join(__dirname, '..', 'dist')
if (store.mode === 'local') app.use('/uploads', express.static(UP, { maxAge: '7d' }))
if (fs.existsSync(dist)) { app.use(express.static(dist)); app.get('*', (q, r) => r.sendFile(path.join(dist, 'index.html'))) }
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}  (storage: ${store.mode})`))
