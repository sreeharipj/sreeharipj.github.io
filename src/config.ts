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
//  Edit here to change: name, "aka Rekd", subtitle, short bio
// ============================================================
export const IDENTITY = {
  /** Full display name used on the /hi page and About Me card */
  fullName: "Sreehari P J",

  /** Short first name used in the hero ("Hey, I am Sreehari") */
  firstName: "Sreehari",

  /** Your online alias / hacker handle */
  alias: "Rekd",

  /** Your handle/username shown next to your name */
  handle: "@rekd",

  /** Your role title — shown on /hi and the About Me card */
  role: "Systems Security Researcher & Kernel Engineer",

  /** One-liner shown in the hero section */
  heroTagline: "Systems security researcher building kernel-level tools that actually secure.",

  /** Short body text shown under the hero tagline */
  heroSubtext:
    "Building stuff in C, C++, and Go. Obsessed with breaking architectures to make them stronger.",

  /** Longer bio shown on /hi and the About Me bento card */
  bio: "I build things that operate at the intersection of the OS and adversarial systems — eBPF probes, kernel modules, and security primitives designed for environments that refuse to be compromised. Obsessed with breaking things to understand them.",

  /** Contact email */
  email: "hello@sreeharipj.com",
} as const;

// ============================================================
//  TECH STACK — Shown in the hero, About Me card, and /hi page
//  Dot color is a CSS color string
// ============================================================
export const TECH_STACK = [
  { label: "C/C++", dotColor: "#3776ab" },
  { label: "Go", dotColor: "#00add8" },
  { label: "Rust", dotColor: "#e6522c" },
  { label: "eBPF", dotColor: "#fbbc05" },
  { label: "Linux Kernel", dotColor: "#204ead" },
] as const;

// ============================================================
//  FOCUS AREAS — "What I do" section on /hi and About Me card
// ============================================================
export const FOCUS_AREAS = [
  {
    emoji: "🔬",
    title: "Kernel Engineering",
    short: "Tracing & intercepting syscalls with eBPF for zero-overhead behavioral analysis.",
    long: "eBPF probes, kernel modules, and syscall interception for behavioral analysis at the OS level.",
  },
  {
    emoji: "🛡️",
    title: "Security Research",
    short: "Finding & remediating architectural vulns in cloud-native infrastructure.",
    long: "Identifying and remediating architectural vulnerabilities — from cloud infrastructure to IDOR disclosures.",
  },
  {
    emoji: "⚙️",
    title: "Systems Tooling",
    short: "Writing high-performance security agents that don't kill machine performance.",
    long: "High-performance security agents and CLI tools that operate with minimal overhead.",
  },
] as const;

// ============================================================
//  CURRENT INTERESTS — the bulleted list on "Current Interests"
// ============================================================
export const INTERESTS = [
  "eBPF-based malware detection engines",
  "Hypervisor-level security primitives",
  "Post-quantum cryptography infrastructure",
  "Supply-chain attack hardening in CI/CD",
] as const;

// ============================================================
//  FEATURED POSTS — Hardcoded on index page and /hi page
//  These are shown BEFORE real blog posts are published
// ============================================================
export const FEATURED_POSTS = [
  {
    href: "/posts/kernel-level-ransomware-killswitch",
    title: "Kernel-Level Ransomware Killswitch: Intercepting vfs_write with eBPF & Go",
    excerpt:
      "Building a high-performance ransomware detector by tracing kernel file operations with eBPF and dropping processes before encryption happens.",
    tags: ["eBPF", "Go", "Linux Kernel"],
  },
  {
    href: "/posts/150gb-data-leak-idor",
    title: "How I Patched a 150GB Data Leak: The Anatomy of an IDOR",
    excerpt:
      "A deep dive into discovering and remediating a critical Insecure Direct Object Reference vulnerability exposing hundreds of gigabytes of PII.",
    tags: ["AppSec", "Bug Bounty", "Cloudflare"],
  },
  {
    href: "/posts/dns-dangling-pointers",
    title: "DNS Dangling Pointers: Defending University Infrastructure",
    excerpt:
      "Analyzing subdomain takeover risks dynamically, auditing legacy DNS records, and successfully fortifying institutional infrastructure.",
    tags: ["Infrastructure", "Networking", "DNS"],
  },
] as const;

// ============================================================
//  SOCIAL LINKS — Used in the sidebar, footer, and /hi page
// ============================================================
export const SOCIAL_LINKS = {
  github: "https://github.com/sreeharipj",
  twitter: "https://x.com/sreeharipj",
  linkedin: "https://www.linkedin.com/in/sreeharipj/",
  email: `mailto:${IDENTITY.email}`,
} as const;

