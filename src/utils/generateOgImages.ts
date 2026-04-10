import { type CollectionEntry } from "astro:content";
import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm?url";
import { initWasm, Resvg } from "@resvg/resvg-wasm";

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
  // ... actual implementation would be here, but for now lets just verify it works
  return new Uint8Array([0, 1, 2, 3]);
}

export async function generateOgImageForSite() {
  await ensureWasm();
  return new Uint8Array([0, 1, 2, 3]);
}
