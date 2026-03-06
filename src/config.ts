// ============================================================
//  SITE CONFIG — Edit this file to change global site settings
// ============================================================
export const SITE = {
  website: "https://sreeharipj.github.io/",
  author: "Sreehari",
  profile: "https://github.com/sreeharipj",
  desc: "Systems Security Researcher & Kernel Engineer.",
  title: "Sreehari | Systems Security",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/sreeharipj/sreeharipj.github.io/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr",
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
  role: "Security Researcher & Systems Student",

  /** One-liner under the name in the hero */
  heroTagline: "Security Researcher & Systems Student.",

  /** Longer sentence shown under tagline */
  heroSubtext:
    "Offensive security enthusiast pivoting to low-level systems engineering. Currently exploring Linux Kernel internals and eBPF to build better defensive tooling.",

  /** Full bio for About Me card & /hi page */
  bio: "Offensive security enthusiast pivoting to low-level systems engineering. Currently exploring Linux Kernel internals and eBPF to build better defensive tooling. I enjoy reading papers, breaking things, and occasionally writing about what I find.",

  /** Contact email */
  email: "sreehari.nitt@gmail.com",
} as const;

// ============================================================
//  CURRENT STATUS — Right column of the hero section
//  Update these regularly to reflect what you're up to
// ============================================================
export const CURRENT_STATUS = [
  { label: "Reading", value: "Linux Kernel Development — Robert Love" },
  { label: "Building", value: "eBPF-based process anomaly detector" },
  { label: "Learning", value: "Rust for systems programming" },
  { label: "Location", value: "Kerala, India" },
] as const;

// ============================================================
//  TECH STACK — Language/tool pills
// ============================================================
export const TECH_STACK = [
  { label: "C/C++", dotColor: "#888" },
  { label: "Go", dotColor: "#888" },
  { label: "Rust", dotColor: "#888" },
  { label: "eBPF", dotColor: "#888" },
  { label: "Linux Kernel", dotColor: "#888" },
] as const;

// ============================================================
//  FOCUS AREAS — "What I do" section
// ============================================================
export const FOCUS_AREAS = [
  {
    emoji: "🔬",
    title: "Kernel Engineering",
    short: "Tracing & intercepting syscalls with eBPF for behavioral analysis.",
    long: "eBPF probes, kernel modules, and syscall interception for OS-level behavioral analysis.",
  },
  {
    emoji: "🛡️",
    title: "Security Research",
    short: "Finding & remediating architectural vulnerabilities.",
    long: "Identifying and remediating architectural vulnerabilities — from cloud infrastructure to IDOR disclosures.",
  },
  {
    emoji: "⚙️",
    title: "Systems Tooling",
    short: "Writing security tooling with a focus on low overhead.",
    long: "Security agents and CLI tooling built for minimal performance cost.",
  },
] as const;

// ============================================================
//  CURRENT INTERESTS
// ============================================================
export const INTERESTS = [
  "eBPF-based process anomaly detection",
  "Hypervisor-level security primitives",
  "Post-quantum cryptography",
  "Supply-chain hardening in CI/CD",
] as const;

// ============================================================
//  BLOG POSTS — Writing / research notes
// ============================================================
export const BLOG_POSTS = [
  {
    year: "2025",
    href: "/posts/kernel-level-ransomware-killswitch",
    title: "An eBPF experiment: tracing vfs_write to detect ransomware",
    excerpt:
      "An experimental ransomware detector using eBPF to trace vfs_write calls. A learning project in kernel-user space communication.",
  },
  {
    year: "2025",
    href: "/posts/150gb-data-leak-idor",
    title: "150GB exposed: responsible disclosure of an IDOR",
    excerpt:
      "Discovered and responsibly disclosed an IDOR vulnerability exposing ~150GB of user data. Documented the disclosure process end-to-end.",
  },
  {
    year: "2024",
    href: "/posts/dns-dangling-pointers",
    title: "DNS dangling pointers in university infrastructure",
    excerpt:
      "Audited legacy DNS records and identified dangling pointers susceptible to subdomain takeover.",
  },
] as const;

// ============================================================
//  PROJECTS — Things I've built
//  link: can be a GitHub URL or a demo URL
// ============================================================
export const PROJECTS = [
  {
    year: "2025",
    title: "ebpf-rekd",
    description: "eBPF-based process anomaly detector. Attaches fentry probes to vfs_write, scores entropy, and SIGKILLs high-entropy writers.",
    stack: "Go · eBPF · C",
    link: "https://github.com/sreeharipj/ebpf-rekd",
  },
  {
    year: "2024",
    title: "dns-audit",
    description: "CLI tool to audit subdomain DNS records for dangling pointers and takeover risks across large domains.",
    stack: "Python · DNS",
    link: "https://github.com/sreeharipj/dns-audit",
  },
  {
    year: "2024",
    title: "sreeharipj.github.io",
    description: "This site. Astro, minimal, academic research-log aesthetic.",
    stack: "Astro · TypeScript",
    link: "https://github.com/sreeharipj/sreeharipj.github.io",
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

