import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: BLOG_PATH }),
  schema: z.object({
    title: z.string(),
    pubDatetime: z.date(),
    description: z.string(),
  }).passthrough(),
});

export const collections = { blog };
