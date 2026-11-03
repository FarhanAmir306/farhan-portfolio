// ============ EDIT YOUR CONTENT HERE ============
// Everything below can ALSO be edited from the Admin page (/admin). Edits made there are saved in
// your database and override these defaults. New projects are added from /admin too. The list below is only SAMPLE content
// shown until you add your first real project there.
// Put image/video files in /public/images and reference them like "/images/me.jpg"
// Leave a value as "" to show a placeholder.

export const site = {
  name: "YOUR NAME",
  tagline: "Stories told in light, motion and form.",
  email: "hello@example.com",
  whatsapp: "https://wa.me/0000000000",
  instagram: "https://instagram.com/",
  behance: "https://behance.net/",
  linkedin: "https://linkedin.com/",
  portrait: "", // e.g. "/images/portrait.jpg"
  heroVideo: "", // e.g. "/images/hero.mp4" (short, muted loop, under 5 MB)
  showreelThumb: "", // e.g. "/images/reel-thumb.jpg"
  showreelEmbed: "", // e.g. "https://www.youtube.com/embed/VIDEO_ID"
  showreelDuration: "00:00",
  formEndpoint: "", // e.g. "https://formspree.io/f/xxxxxx" (if empty, the form opens the visitor's email app)
  bio: "Replace this with a short personal bio: where you started, what you work on, and what drives you.",
  philosophy: "Replace this with the principles that guide your work.",
  storytelling:
    "Replace this with how you shape a story from idea to final frame.",
  heroLine1: "Crafting visuals.",
  heroLine2: "Creating impact.",
  heroText:
    "I’m a Video Editor, Graphic Designer & Cinematographer passionate about transforming ideas into powerful visual experiences.",
  availability: "AVAILABLE FOR SELECT PROJECTS",
  ctaPrimary: "EXPLORE MY WORK",
  ctaSecondary: "LET’S COLLABORATE",
  reelLabel: "Showreel 2026",
  reelTitle: "A glimpse of my world.",
  worksTitle: "Selected works",
  worksSub: "A collection of ideas transformed into visual experiences.",
  aboutTitle: "Behind every frame, there’s a story.",
  aboutIntro:
    "I’m a multidisciplinary visual creative working across video editing, graphic design, and cinematography. I combine creative thinking, visual aesthetics, and technical expertise to transform ideas into meaningful visual stories.",
  servicesTitle: "What I bring to the frame.",
  processTitle: "From idea to impact.",
  contactTitle: "Have a project in mind? Let’s make it happen.",
  contactText:
    "Have an idea, a story, or a brand that needs a visual identity? Let’s create something meaningful together.",
  seoTitle: "Your Name — Video Editor, Graphic Designer & Cinematographer",
  seoDescription:
    "Portfolio of a multidisciplinary creative: video editing, graphic design and cinematography.",
};

export const filters = [
  { id: "all", label: "All" },
  { id: "video", label: "Video editing" },
  { id: "design", label: "Graphic design" },
  { id: "cine", label: "Cinematography" },
];

// category: "video" | "design" | "cine"
export const projects = [
  // {
  //   title: "Commercial advertisement",
  //   category: "video",
  //   year: "2026",
  //   image: "",
  //   video: "",
  //   description: "Add the brief, your role, tools and result.",
  // },
  // {
  //   title: "Promotional video",
  //   category: "video",
  //   year: "2026",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Documentary film",
  //   category: "video",
  //   year: "2025",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Social media campaign",
  //   category: "video",
  //   year: "2025",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Corporate film",
  //   category: "video",
  //   year: "2025",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Motion graphics & reels",
  //   category: "video",
  //   year: "2026",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "YouTube thumbnails",
  //   category: "design",
  //   year: "2026",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Social media creatives",
  //   category: "design",
  //   year: "2026",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Branding & visual identity",
  //   category: "design",
  //   year: "2025",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Advertising campaign",
  //   category: "design",
  //   year: "2025",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Poster & promotional designs",
  //   category: "design",
  //   year: "2026",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Educational graphics",
  //   category: "design",
  //   year: "2025",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Product cinematography",
  //   category: "cine",
  //   year: "2026",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Documentary cinematography",
  //   category: "cine",
  //   year: "2025",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Brand film",
  //   category: "cine",
  //   year: "2026",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Cinematic B-roll",
  //   category: "cine",
  //   year: "2025",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Commercial shoot",
  //   category: "cine",
  //   year: "2026",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
  // {
  //   title: "Visual storytelling",
  //   category: "cine",
  //   year: "2025",
  //   image: "",
  //   video: "",
  //   description: "",
  // },
];

export const services = [
  {
    title: "Video editing",
    items: [
      "Storytelling",
      "Cinematic editing",
      "Commercial editing",
      "Documentary editing",
      "Color grading",
      "Motion graphics",
    ],
  },
  {
    title: "Graphic design",
    items: [
      "Visual identity",
      "Advertising designs",
      "Social media creatives",
      "YouTube thumbnails",
      "Promotional graphics",
    ],
  },
  {
    title: "Cinematography",
    items: [
      "Camera operation",
      "Product cinematography",
      "Cinematic shots",
      "Commercial production",
      "Visual storytelling",
    ],
  },
];

export const steps = [
  {
    n: "01",
    title: "Discover",
    text: "Understanding the vision, goals, and creative direction.",
  },
  {
    n: "02",
    title: "Strategize",
    text: "Planning the visual concept and creative execution.",
  },
  {
    n: "03",
    title: "Create",
    text: "Producing, designing, editing, and refining every detail.",
  },
  {
    n: "04",
    title: "Deliver",
    text: "Delivering polished, professional, high-quality results.",
  },
];

export const software = [
  { abbr: "Pr", name: "Adobe Premiere Pro" },
  { abbr: "Ae", name: "Adobe After Effects" },
  { abbr: "Ps", name: "Adobe Photoshop" },
  { abbr: "Ai", name: "Adobe Illustrator" },
];

// ---- content overrides saved from /admin (see src/Admin.jsx and server/index.js) ----
const clone = (o) => JSON.parse(JSON.stringify(o));
export const DEFAULTS = clone({ ...site, services, steps, software });
export const merged = (saved = {}) => ({ ...clone(DEFAULTS), ...saved });
export function applyContent(saved) {
  const { services: sv, steps: st, software: sw, ...rest } = merged(saved);
  Object.assign(site, rest);
  services.splice(0, services.length, ...sv);
  steps.splice(
    0,
    steps.length,
    ...st.map((x, i) => ({ ...x, n: String(i + 1).padStart(2, "0") })),
  );
  software.splice(0, software.length, ...sw);
  document.title = site.seoTitle;
  document
    .querySelector("meta[name=description]")
    ?.setAttribute("content", site.seoDescription);
}
