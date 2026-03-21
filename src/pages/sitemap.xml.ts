import { getCollection } from "astro:content";
import getUniqueTags from "@/utils/getUniqueTags";
import { SITE } from "@/config";
import postFilter from "@/utils/postFilter";
import { getPath } from "@/utils/getPath";

export async function GET() {
    const posts = await getCollection("blog", postFilter);
    const tags = getUniqueTags(posts);

    const siteUrl = SITE.website;

    const staticPages = [
        "",
        "about/",
        "archives/",
        "hi/",
        "now/",
        "posts/",
        "resume/",
        "search/",
        "tags/",
    ];

    const postPages = posts.map(({ data, id, filePath }) => ({
        url: getPath(id, filePath).replace(/^\//, "") + "/",
        lastmod: (data.modDatetime ?? data.pubDatetime).toISOString(),
    }));

    const tagPages = tags.map(tag => ({
        url: `tags/${tag.tag}/`,
        lastmod: undefined,
    }));

    const allPages = [
        ...staticPages.map(url => ({ url, lastmod: undefined })),
        ...postPages,
        ...tagPages,
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
            .map(
                ({ url, lastmod }) => `
  <url>
    <loc>${new URL(url, siteUrl).href}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
  </url>`
            )
            .join("")}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
