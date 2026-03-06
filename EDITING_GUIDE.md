# ✏️ Editing Guide — sreeharipj.github.io

One file controls almost everything: **[`src/config.ts`](src/config.ts)**

---

## Quick Reference

| I want to change... | Edit this file | Change this field |
|---|---|---|
| **"aka Rekd"** in the hero | `src/config.ts` | `IDENTITY.alias` |
| **"Hey, I am Sreehari"** | `src/config.ts` | `IDENTITY.firstName` |
| **Full name** (Sreehari P J) | `src/config.ts` | `IDENTITY.fullName` |
| **@rekd handle** | `src/config.ts` | `IDENTITY.handle` |
| **Role title** (Systems Security...) | `src/config.ts` | `IDENTITY.role` |
| **Hero tagline** (one-liner under title) | `src/config.ts` | `IDENTITY.heroTagline` |
| **Hero subtext** (second paragraph) | `src/config.ts` | `IDENTITY.heroSubtext` |
| **Bio** (About Me card & /hi page) | `src/config.ts` | `IDENTITY.bio` |
| **Contact email** | `src/config.ts` | `IDENTITY.email` |
| **Resume PDF** | `public/resume.pdf` | Replace the file |
| **Tech stack pills** (C/C++, Go...) | `src/config.ts` | `TECH_STACK` array |
| **"What I do" focus areas** | `src/config.ts` | `FOCUS_AREAS` array |
| **"Current Interests" bullets** | `src/config.ts` | `INTERESTS` array |
| **Featured research posts** | `src/config.ts` | `FEATURED_POSTS` array |
| **GitHub / Twitter / LinkedIn URLs** | `src/config.ts` | `SOCIAL_LINKS` object |
| **Site title** (browser tab) | `src/config.ts` | `SITE.title` |
| **SEO description** | `src/config.ts` | `SITE.desc` |
| **Deployed URL** | `src/config.ts` | `SITE.website` |
| **About Me page body** | `src/pages/about.md` | Markdown body |
| **Blog posts** | `src/data/blog/*.md` | Each `.md` file |
| **Social sidebar icons** | `src/constants.ts` | `SOCIALS` array |
| **Navigation links** | `src/components/Header.astro` | `navLinks` list |
| **Footer text** | `src/components/Footer.astro` | Inline text |
| **Layout / fonts / colors** | `src/styles/global.css` | CSS variables |
| **Favicon** | `public/favicon.svg` | Replace the file |
| **GitHub Pages deploy** | `.github/workflows/deploy.yml` | Workflow config |

---

## Detailed Walkthroughs

### Changing "aka Rekd"

Open `src/config.ts` and find the `IDENTITY` block:

```ts
export const IDENTITY = {
  alias: "Rekd",  // ← change this
  ...
};
```

It will automatically update the hero heading on the home page.

---

### Adding / Removing a Tech Pill

In `src/config.ts`, edit the `TECH_STACK` array:

```ts
export const TECH_STACK = [
  { label: "C/C++",  dotColor: "#3776ab" },
  { label: "Go",     dotColor: "#00add8" },
  // Add a new line here, or delete a line to remove it
  { label: "Python", dotColor: "#3572a5" },
];
```

The pills update on both the home page and the `/hi` page automatically.

---

### Adding a Featured Post

In `src/config.ts`, add an object to `FEATURED_POSTS`:

```ts
export const FEATURED_POSTS = [
  {
    href: "/posts/my-new-post",
    title: "My New Post Title",
    excerpt: "A short description of what the post covers.",
    tags: ["eBPF", "Go"],
  },
  // ... existing posts
];
```

---

### Adding a Focus Area

In `src/config.ts`, add an object to `FOCUS_AREAS`:

```ts
export const FOCUS_AREAS = [
  {
    emoji: "🔬",
    title: "Kernel Engineering",
    short: "Short text for the About Me bento card.",
    long:  "Longer text shown on the /hi page.",
  },
  // ... add more
];
```

---

### Writing a Real Blog Post

Create a Markdown file in `src/data/blog/`:

```
src/data/blog/
  └── my-new-post.md
```

Use this frontmatter template:

```yaml
---
title: "My New Post"
description: "A short description for SEO and listing cards."
pubDatetime: 2026-03-06T00:00:00Z
tags: ["eBPF", "Go"]
featured: true
---

Your post content here...
```

---

### Changing Social Links

`src/constants.ts` controls the icons in the **floating sidebar** and **footer**.
`src/config.ts > SOCIAL_LINKS` controls the links on the `/hi` page.

Update both to keep them in sync.

---

## File Map

```
sreeharipj.github.io/
├── src/
│   ├── config.ts           ← ★ MAIN CONFIG — edit almost everything here
│   ├── constants.ts        ← Sidebar/footer social icon links
│   ├── pages/
│   │   ├── index.astro     ← Home page layout (rarely needs editing)  
│   │   ├── hi.astro        ← /hi quick runthrough page (rarely needs editing)
│   │   └── about.md        ← About Me page body text
│   ├── data/blog/          ← Blog post markdown files
│   ├── components/
│   │   ├── Header.astro    ← Navigation links
│   │   └── Footer.astro    ← Footer text
│   └── styles/
│       └── global.css      ← Colors, fonts, layout tokens
├── public/
│   └── favicon.svg         ← Site favicon
└── .github/workflows/
    └── deploy.yml          ← GitHub Pages deploy config
```
