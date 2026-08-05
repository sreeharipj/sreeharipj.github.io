// ============================================================
//  SITE CONFIG — Edit this file to change global site settings
// ============================================================
export const SITE = {
  website: "https://sreeharipj.github.io/",
  author: "Sreehari",
  profile: "https://github.com/sreeharipj",
  desc: "Third-year engineering student at NIT Trichy — security findings and Rust binary-analysis tooling, written up as they happen.",
  title: "Sreehari P J",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    url: "https://github.com/sreeharipj/sreeharipj.github.io/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en",
  timezone: "Asia/Kolkata",
} as const;

// ============================================================
//  IDENTITY CONFIG — Your name, alias, tagline, and bio
// ============================================================
export const IDENTITY = {
  fullName: "Sreehari P J",
  firstName: "Sreehari",

  /** Shown subtly next to name if you want it, or leave blank */
  handle: "@sr33hari",

  /** Your role title */
  role: "Third-year engineering student, NIT Trichy",

  /** One-liner under the name in the hero */
  heroTagline: "Third-year engineering student, NIT Trichy.",

  /** Longer sentence shown under tagline */
  heroSubtext:
    "Third-year engineering student at NIT Trichy. I direct LLMs heavily to cover ground.",

  /** Full bio for About Me card & /hi page */
  bio: "Third-year engineering student at NIT Trichy. I direct LLMs heavily to cover ground.",

  /** Contact email */
  email: "sreehari.nitt@gmail.com",
} as const;

// ============================================================
//  CURRENT STATUS — Right column of the hero section
//  Update these regularly to reflect what you're up to
// ============================================================
export const CURRENT_STATUS = [
  { label: "Building", value: "Rust reverse-engineering tooling — unhusk, winnow, cgumap" },
  { label: "Location", value: "Tamil Nadu, India (Based in Kochi, Kerala)" },
] as const;

// ============================================================
//  PROJECTS — Things I've built
//  link: can be a GitHub URL or a demo URL
// ============================================================
export const PROJECTS = [
  {
    year: "2026",
    title: "winnow",
    description:
      "Builds a YARA-X rule for a stripped Rust malware sample from unhusk's output — one binary in, one rule out. Zero false positives across three rules on a 76-binary held-out corpus.",
    stack: "Rust",
    link: "https://github.com/sreeharipj/winnow",
  },
  {
    year: "2026",
    title: "unhusk",
    description:
      "Finds the author-written functions in a stripped Rust binary using panic metadata. Tested against real Rust malware, including Akira, KrustyLoader, and BlackCat/ALPHV.",
    stack: "Rust",
    link: "https://github.com/sreeharipj/unhusk",
  },
  {
    year: "2025",
    title: "rekd",
    description:
      "eBPF-based ransomware detector, built with Spider R&D's cybersecurity team. Fentry hooks on vfs_write and vfs_writev score Shannon entropy on sampled write payloads; an alert fires once a process crosses both a 70% high-entropy-ratio gate and a 1MB cumulative-volume gate. Detection only — process kill lands once we're satisfied with the false-positive rate. v1 done.",
    stack: "Go · eBPF · C",
    link: "https://github.com/SpiderNitt/rekd",
  },
] as const;

// ============================================================
//  DISCLOSURES — Things I've found, not built
//  external: true opens the link in a new tab (used for anything off-site)
// ============================================================
export const DISCLOSURES = [
  {
    year: "2026",
    title: "pylsqpack (aiortc)",
    description:
      "Double free in pylsqpack, aiortc's QPACK library. Found by fuzzing. Fix merged upstream.",
    link: "https://github.com/aiortc/pylsqpack/pull/53",
    external: true,
  },
  {
    year: "2025",
    title: "knot.dating — S3 bucket exposure",
    description:
      "Found an unauthenticated, publicly listable S3 bucket behind a dating app's CDN, exposing roughly 150GB: profile photos, database snapshots, invoice PII. Reported; access was locked down.",
    link: "/posts/150gb-data-leak-bucket",
    external: false,
  },
  {
    year: "2025",
    title: "nitt.edu — dangling DNS",
    description:
      "Found a forgotten institute subdomain repointed to a reassigned IP serving a gambling site — dangling DNS from lapsed hosting. Reported via Spider R&D; the record was fixed.",
    link: "/posts/dns-dangling-pointers",
    external: false,
  },
] as const;

// ============================================================
//  SOCIAL LINKS
// ============================================================
export const SOCIAL_LINKS = {
  github: "https://github.com/sreeharipj",
  twitter: "https://x.com/sr33hari",
  linkedin: "https://www.linkedin.com/in/sreeharipj/",
  email: `mailto:${IDENTITY.email}`,
} as const;
