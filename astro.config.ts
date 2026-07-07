import { defineConfig, envField, fontProviders } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { remarkObsidianImage } from "./src/utils/remark-obsidian-image";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [],

  // Inline all CSS into the document <head> so there is no render-blocking
  // stylesheet request on the critical path. The site's total CSS is small
  // (~12 KB), and Astro's default "auto" only inlines sheets under 4 KB.
  build: {
    inlineStylesheets: "always",
  },

  // Astro 7 makes Sätteri the default Markdown processor. Opt back into the
  // unified() (remark/rehype) pipeline so the remark plugins and shikiConfig
  // below keep working unchanged.
  markdown: {
    processor: unified(),
    remarkPlugins: [
      remarkObsidianImage,
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
    ],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    responsiveStyles: true,
    layout: "constrained",
  },

  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },

  fonts: [
    {
      name: "Instrument Serif",
      cssVariable: "--font-instrument-serif",
      provider: fontProviders.google(),
      fallbacks: ["serif"],
      weights: [400],
      styles: ["normal", "italic"],
      display: "swap",
    },
    {
      name: "Space Grotesk",
      cssVariable: "--font-space-grotesk",
      provider: fontProviders.google(),
      fallbacks: ["sans-serif"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      display: "swap",
    },
    {
      name: "IBM Plex Mono",
      cssVariable: "--font-ibm-plex-mono",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [400, 500],
      styles: ["normal", "italic"],
      display: "swap",
    },
  ],
});
