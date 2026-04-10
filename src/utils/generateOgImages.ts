import { type CollectionEntry } from "astro:content";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";

export async function generateOgImageForPost(post: any) {
  return new Uint8Array([0, 1, 2, 3]);
}

export async function generateOgImageForSite() {
  return new Uint8Array([0, 1, 2, 3]);
}
