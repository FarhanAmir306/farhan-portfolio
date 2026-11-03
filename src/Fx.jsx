import { useEffect, useRef, useState } from 'react'
import { motion, animate, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from 'framer-motion'
import { site } from './data'

export const ease = [0.2, 0.8, 0.2, 1]
export const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
export const T0 = reduce ? 0 : 2.5 // seconds before hero animations start (after the intro)

export function Intro() {
  const [n, setN] = useState(0)
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(reduce)
  useEffect(() => {
    if (reduce) return
    document.body.style.overflow = 'hidden'
    const c = animate(0, 100, { duration: 1.9, ease: 'easeInOut', onUpdate: v => setN(Math.round(v)), onComplete: () => setOpen(true) })
    const t = setTimeout(() => { setDone(true); document.body.style.overflow = '' }, 3100)
    return () => { c.stop(); clearTimeout(t); document.body.style.overflow = '' }
  }, [])
  if (done) return null
  const tr = { duration: 0.9, ease, delay: 0.15 }
  return (
    <div className="intro" aria-hidden="true">
      <motion.div className="half t" animate={{ y: open ? '-101%' : 0 }} transition={tr} />
      <motion.div className="half b" animate={{ y: open ? '101%' : 0 }} transition={tr} />
      <motion.div className="icore" animate={{ opacity: open ? 0 : 1, scale: open ? 1.08 : 1 }} transition={{ duration: 0.45 }}>
        <div className="iname">
          {[...site.name].map((c, i) => (
            <motion.span key={i} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.7, ease }}>{c === ' ' ? '\u00A0' : c}</motion.span>
          ))}
        </div>
        <div className="iline"><i style={{ width: n + '%' }} /></div>
        <div className="inum">{String(n).padStart(3, '0')}</div>
        <div className="iroles">VIDEO EDITOR / GRAPHIC DESIGNER / CINEMATOGRAPHER</div>
      </motion.div>
    </div>
  )
}

export function Cursor() {
  const fine = typeof matchMedia !== 'undefined' && matchMedia('(pointer:fine)').matches
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 260, damping: 24 }), sy = useSpring(y, { stiffness: 260, damping: 24 })
  const [h, setH] = useState(false)
  useEffect(() => {
    if (!fine) return
    const m = e => { x.set(e.clientX); y.set(e.clientY); setH(!!e.target.closest?.('a,button,input,select,textarea')) }
    addEventListener('mousemove', m)
    return () => removeEventListener('mousemove', m)
  }, [fine])
  if (!fine) return null
  return <motion.div className="cring" style={{ x: sx, y: sy }} animate={{ scale: h ? 1.9 : 1, backgroundColor: h ? 'rgba(213,255,63,.15)' : 'rgba(213,255,63,0)' }} aria-hidden="true" />
}

export function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const s = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  return <motion.div className="sbar" style={{ scaleX: s }} />
}

export const Grain = () => <div className="grain" aria-hidden="true" />

export function Magnetic({ children }) {
  const r = useRef()
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 14 }), sy = useSpring(y, { stiffness: 200, damping: 14 })
  const mv = e => { const b = r.current.getBoundingClientRect(); x.set((e.clientX - b.left - b.width / 2) * 0.3); y.set((e.clientY - b.top - b.height / 2) * 0.3) }
  return <motion.div ref={r} style={{ x: sx, y: sy, display: 'inline-block' }} onMouseMove={mv} onMouseLeave={() => { x.set(0); y.set(0) }}>{children}</motion.div>
}

export function Split({ children, tag = 'h2', delay = 0 }) {
  const T = tag
  return (
    <T aria-label={children}>
      {String(children).split(' ').map((w, i) => (
        <span key={i} className="wd" aria-hidden="true">
          <motion.span initial={{ y: '110%', rotate: 4 }} whileInView={{ y: 0, rotate: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, ease, delay: delay + i * 0.07 }}>{w}&nbsp;</motion.span>
        </span>
      ))}
    </T>
  )
}

export function ScrollText() {
  const { scrollY } = useScroll()
  const x = useTransform(scrollY, [0, 4000], [0, -1500])
  return <div className="stxt" aria-hidden="true"><motion.div style={{ x }}>{'VIDEO EDITING ✦ GRAPHIC DESIGN ✦ CINEMATOGRAPHY ✦ '.repeat(5)}</motion.div></div>
}

export function FloatCTA() {
  const [s, setS] = useState(false)
  useEffect(() => {
    const f = () => setS(scrollY > 700)
    addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])
  return (
    <AnimatePresence>
      {s && (
        <motion.a href="#contact" className="fcta" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ duration: 0.5, ease }}>
          <b />Available for hire. Let’s talk ↗
        </motion.a>
      )}
    </AnimatePresence>
  )
}

export const Badge = () => (
  <motion.div className="badge" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: T0 + 1.2, type: 'spring', stiffness: 120, damping: 12 }} aria-hidden="true">
    <svg viewBox="0 0 120 120" className="spin">
      <defs><path id="cp" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
      <text><textPath href="#cp">AVAILABLE FOR HIRE ✦ LET’S WORK TOGETHER ✦ </textPath></text>
    </svg>
    <span>↗</span>
  </motion.div>
)
