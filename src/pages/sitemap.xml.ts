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

    const postPages = posts.map(({ id, filePath }) =>
        getPath(id, filePath).replace(/^\//, "")
    );

    const tagPages = tags.map(tag => `tags/${tag.tag}/`);

    let allPages = [...staticPages, ...postPages, ...tagPages];
    if (!SITE.showArchives) {
        allPages = allPages.filter(page => page !== "archives/");
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
            .map(
                page => `
  <url>
    <loc>${new URL(page, siteUrl).href}</loc>
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
