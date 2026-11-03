import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  site,
  filters,
  projects as samples,
  services,
  steps,
  software,
} from "./data";
import {
  Intro,
  Cursor,
  ScrollBar,
  Grain,
  Magnetic,
  Split,
  ScrollText,
  FloatCTA,
  Badge,
  T0,
  ease,
} from "./Fx";
import { api, getToken } from "./api";

const NAV = ["home", "work", "about", "services", "contact"];
const hue = { video: 75, design: 95, cine: 140 };

const Rv = ({ as = "div", delay = 0, children, ...p }) => {
  const M = motion[as];
  return (
    <M
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease, delay }}
      {...p}
    >
      {children}
    </M>
  );
};

// const Media = ({ src, label, i = 0, cat = "video", className = "" }) =>
//   src ? (
//     <img src={src} alt={label} loading="lazy" className={className} />
//   ) : (
//     <div
//       className={`ph ${className}`}
//       role="img"
//       aria-label={label + " (placeholder)"}
//       style={{
//         background: `linear-gradient(${120 + i * 17}deg,hsl(${hue[cat]},12%,${11 + (i % 4) * 3}%),#0c0c0c 70%)`,
//       }}
//     >
//       PLACEHOLDER
//     </div>
//   );


function Img({ src, alt, className }) {
  const yt = /img\.youtube\.com\/vi\/([\w-]{11})\//.exec(src);
  const [url, setUrl] = useState(
    yt ? `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg` : src,
  );
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => url !== src && setUrl(src)}
      onLoad={(e) => {
        if (yt && e.target.naturalWidth <= 120) setUrl(src);
      }}
    />
  );
}

const Media = ({ src, label, i = 0, cat = "video", className = "" }) =>
  src ? (
    <Img key={src} src={src} alt={label} className={className} />
  ) : (
    <div
      className={`ph ${className}`}
      role="img"
      aria-label={label + " (placeholder)"}
      style={{
        background: `linear-gradient(${120 + i * 17}deg,hsl(${hue[cat]},12%,${11 + (i % 4) * 3}%),#0c0c0c 70%)`,
      }}
    >
      PLACEHOLDER
    </div>
  );

  
function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    NAV.forEach((id) => {
      const el = document.getElementById(id);
      el && io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return (
    <nav aria-label="Main">
      <div className="wrap">
        <a href="#home" className="logo">
          {site.name}
        </a>
        <button id="mb" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
        <div className={`links ${open ? "open" : ""}`}>
          {NAV.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`l ${active === id ? "on" : ""}`}
              onClick={() => setOpen(false)}
            >
              {id[0].toUpperCase() + id.slice(1)}
              {active === id && <motion.i layoutId="nav-ind" className="ind" />}
            </a>
          ))}
          {getToken() && (
            <a className="l" href="/admin">
              Admin
            </a>
          )}
          <a className="btn pri" href="#contact" onClick={() => setOpen(false)}>
            LET’S TALK ↗
          </a>
        </div>
      </div>
    </nav>
  );
}

const Line = ({ text, d, accent }) => (
  <span className="ln" style={accent ? { color: "var(--ac)" } : null}>
    {text.split(" ").map((w, wi) => (
      <span key={wi} className="w">
        {[...w].map((c, i) => (
          <motion.i
            key={i}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease,
              delay: d + wi * 0.12 + i * 0.03,
            }}
          >
            {c}
          </motion.i>
        ))}
        {"\u00A0"}
      </span>
    ))}
  </span>
);

function Hero() {
  const ref = useRef();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 220]);
  const yPt = useTransform(scrollY, [0, 800], [0, -70]);
  const move = (e) => {
    const b = ref.current.getBoundingClientRect();
    ref.current.style.setProperty(
      "--mx",
      ((e.clientX - b.left) / b.width) * 100 + "%",
    );
    ref.current.style.setProperty(
      "--my",
      ((e.clientY - b.top) / b.height) * 100 + "%",
    );
  };
  return (
    <section id="home" ref={ref} onMouseMove={move}>
      <motion.div className="hbg" style={{ y: yBg }}>
        {site.heroVideo && (
          <video
            src={site.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        )}
      </motion.div>
      <div className="wrap hero">
        <div>
          <motion.div
            className="avail"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: T0, duration: 0.7 }}
          >
            <b />
            {site.availability}
          </motion.div>
          <h1 aria-label={`${site.heroLine1} ${site.heroLine2}`}>
            <Line text={site.heroLine1} d={T0 + 0.1} />
            <Line text={site.heroLine2} d={T0 + 0.5} accent />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: T0 + 1.1, duration: 0.8 }}
          >
            {site.heroText}
          </motion.p>
          <motion.div
            className="row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: T0 + 1.3, duration: 0.8 }}
          >
            <Magnetic>
              <a className="btn pri" href="#work">
                {site.ctaPrimary}
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn" href="#contact">
                {site.ctaSecondary}
              </a>
            </Magnetic>
          </motion.div>
        </div>
        <motion.div className="pw" style={{ y: yPt }}>
          <motion.div
            className="pclip"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ delay: T0 + 0.3, duration: 1.3, ease }}
          >
            <motion.div
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ delay: T0 + 0.3, duration: 1.8, ease }}
            >
              <Media
                src={site.portrait}
                label="Portrait"
                className="portrait"
              />
            </motion.div>
          </motion.div>
          <Badge />
        </motion.div>
      </div>
    </section>
  );
}

function Modal({ onClose, children }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <motion.div
      className="mod"
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button className="x" onClick={onClose} autoFocus>
        Close
      </button>
      <motion.div
        className="inner"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function Reel({ open }) {
  return (
    <section id="reel">
      <div className="wrap">
        <Split>{site.reelTitle}</Split>
        <Rv>
          <button
            className="reel"
            onClick={open}
            aria-label="Play showreel 2026"
          >
            {site.showreelThumb && (
              <img
                src={site.showreelThumb}
                alt="Showreel 2026 thumbnail"
                loading="lazy"
              />
            )}
            <span className="play">
              <svg viewBox="0 0 24 24">
                <path d="M5 3l16 9-16 9z" />
              </svg>
            </span>
            <span className="meta">
              <span>{site.reelLabel}</span>
              <small>{site.showreelDuration}</small>
            </span>
          </button>
        </Rv>
      </div>
    </section>
  );
}

function Work({ open }) {
  const [f, setF] = useState("all");
  const [items, setItems] = useState(null);
  useEffect(() => {
    const seed = samples.map((p, i) => ({ ...p, id: "s" + i }));
    api("/projects")
      .then((d) => setItems(d.length ? d : seed))
      .catch(() => setItems(seed));
  }, []);
  const list = (items || [])
    .map((p, i) => ({ ...p, i }))
    .filter((p) => f === "all" || p.category === f);
  return (
    <section id="work">
      <div className="wrap">
        <Split>{site.worksTitle}</Split>
        <Rv as="p" className="sub">
          {site.worksSub}
        </Rv>
        <div className="filters" role="group" aria-label="Filter projects">
          {filters.map((x) => (
            <button
              key={x.id}
              className={f === x.id ? "on" : ""}
              onClick={() => setF(x.id)}
            >
              {x.label}
            </button>
          ))}
        </div>
        <motion.div className="grid" layout>
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.button
                key={p.id}
                layout
                className="card"
                initial={{ opacity: 0, scale: 0.94, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.6, ease }}
                onClick={() => open(p)}
                aria-label={`Open project: ${p.title}`}
              >
                <div className="th">
                  {p.image || !p.video ? (
                    <Media
                      src={p.image}
                      label={p.title}
                      i={p.i}
                      cat={p.category}
                      className="img"
                    />
                  ) : (
                    <video
                      className="img"
                      src={p.video + "#t=0.5"}
                      muted
                      playsInline
                      preload="metadata"
                    />
                  )}
                  <div className="ov">
                    <strong>{p.title}</strong>
                    <em>↗</em>
                  </div>
                </div>
                <div className="cap">
                  <span>{p.title}</span>
                  <span>
                    {filters.find((x) => x.id === p.category).label} · {p.year}
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="alt">
      <div className="wrap about">
        <Rv>
          <Media src={site.portrait} label="Portrait" className="portrait" />
        </Rv>
        <Rv>
          <h2>{site.aboutTitle}</h2>
          <p>{site.aboutIntro}</p>
          <h3>Biography</h3>
          <p>{site.bio}</p>
          <h3>Creative philosophy</h3>
          <p>{site.philosophy}</p>
          <h3>Approach to storytelling</h3>
          <p>{site.storytelling}</p>
          <h3>Software</h3>
          <div className="chips">
            {software.map((s) => (
              <span key={s.name}>{s.name}</span>
            ))}
          </div>
        </Rv>
      </div>
    </section>
  );
}

const Services = () => (
  <section id="services">
    <div className="wrap">
      <Split>{site.servicesTitle}</Split>
      <div className="slist">
        {services.map((s) => (
          <Rv key={s.title} className="svc">
            <h3>{s.title}</h3>
            <ul>
              {s.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </Rv>
        ))}
      </div>
    </div>
  </section>
);

const Process = () => (
  <section id="process" className="alt">
    <div className="wrap">
      <Split>{site.processTitle}</Split>
      <div className="steps">
        <motion.div
          className="track"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease }}
        />
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            className="step"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.35, duration: 0.7, ease }}
          >
            <span className="dot" />
            <small>{s.n}</small>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Marquee = () => {
  const row = [...software, ...software, ...software, ...software];
  return (
    <div className="mq" aria-label="Software I use">
      <div className="mt">
        {row.map((s, i) => (
          <span key={i}>
            <b>{s.abbr}</b>
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
};

function Contact() {
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    if (site.formEndpoint) {
      try {
        const r = await fetch(site.formEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(d),
        });
        if (!r.ok) throw 0;
        setMsg("Message sent. I’ll reply soon.");
        e.target.reset();
      } catch {
        setMsg("Could not send. Please email me directly at " + site.email);
      }
    } else {
      location.href = `mailto:${site.email}?subject=${encodeURIComponent("Project: " + d.type)}&body=${encodeURIComponent(`${d.message}\n\n${d.name} (${d.email})`)}`;
    }
  };
  return (
    <section id="contact">
      <div className="wrap ct">
        <Rv>
          <h2>{site.contactTitle}</h2>
          <p className="sub">{site.contactText}</p>
          <div className="soc">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={site.behance} target="_blank" rel="noopener noreferrer">
              Behance
            </a>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </Rv>
        <Rv as="form" onSubmit={submit}>
          <label>
            Name
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            Email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Project type
            <select name="type">
              <option>Video editing</option>
              <option>Graphic design</option>
              <option>Cinematography</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Message
            <textarea name="message" required />
          </label>
          <button className="btn pri" type="submit">
            START A PROJECT ↗
          </button>
          <div className="ok" role="status">
            {msg}
          </div>
        </Rv>
      </div>
    </section>
  );
}

const Footer = () => (
  <footer>
    <div className="wrap">
      <div className="ft">
        <div>
          <div className="logo big">{site.name}</div>
          <p>{site.tagline}</p>
        </div>
        <div className="fl">
          {NAV.map((id) => (
            <a key={id} href={`#${id}`}>
              {id[0].toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
        <div className="fl">
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={site.behance} target="_blank" rel="noopener noreferrer">
            Behance
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
      <div className="fb">
        <span>© 2026 {site.name}. All rights reserved.</span>
        <a href="#home" className="btn sm">
          BACK TO TOP ↑
        </a>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [modal, setModal] = useState(null);
  const close = () => setModal(null);
  return (
    <>
      <Intro />
      <Cursor />
      <ScrollBar />
      <Grain />
      <Nav />
      <FloatCTA />
      <main>
        <Hero />
        <ScrollText />
        <Reel open={() => setModal({ reel: true })} />
        <Work open={(p) => setModal(p)} />
        <About />
        <Services />
        <Process />
        <Marquee />
        <Contact />
      </main>
      <Footer />
      <AnimatePresence>
        {modal && (
          <Modal onClose={close} key="m">
            {modal.reel ? (
              <>
                <h2 className="mh">{site.reelLabel}</h2>
                <div className="big">
                  {site.showreelEmbed ? (
                    <iframe
                      src={site.showreelEmbed}
                      title="Showreel 2026"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <div className="ph fill">
                      ADD YOUR SHOWREEL LINK IN src/data.js
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="mh">{modal.title}</h2>
                <p className="sub">
                  {filters.find((x) => x.id === modal.category).label} ·{" "}
                  {modal.year}
                </p>
                <div className="big">
                  {modal.embed ? (
                    <iframe
                      src={modal.embed}
                      title={modal.title}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : modal.video ? (
                    <video src={modal.video} controls playsInline />
                  ) : (
                    <Media
                      src={modal.image}
                      label={modal.title}
                      cat={modal.category}
                      className="fill"
                    />
                  )}
                </div>
                {modal.description && (
                  <p className="sub">{modal.description}</p>
                )}
              </>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
