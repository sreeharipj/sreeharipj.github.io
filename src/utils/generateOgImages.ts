import { type CollectionEntry } from "astro:content";
import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm?url";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";

let wasmInitialized = false;

async function ensureWasm() {
  if (wasmInitialized) return;
  const response = await fetch(new URL(resvgWasm, import.meta.url));
  const buffer = await response.arrayBuffer();
  await initWasm(buffer);
  wasmInitialized = true;
}

export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  await ensureWasm();
  const svg = await postOgImage(post);
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  return pngBuffer;
}

export async function generateOgImageForSite() {
  await ensureWasm();
  const svg = await siteOgImage();
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  return pngBuffer;
}
