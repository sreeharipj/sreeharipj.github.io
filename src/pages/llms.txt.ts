import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { IDENTITY, SITE, PROJECTS, DISCLOSURES } from "@/config";
import { getPath } from "@/utils/getPath";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.data.pubDatetime).getTime() -
      new Date(a.data.pubDatetime).getTime()
  );

  const postLines = sortedPosts
    .map(post => {
      const path = getPath(post.id, post.filePath, false);
      return `- [${post.data.title}](${SITE.website}posts${path}/): ${post.data.description}`;
    })
    .join("\n");

  const projectLines = PROJECTS.map(
    p => `- [${p.title}](${p.link}): ${p.description} — Stack: ${p.stack}`
  ).join("\n");

  const disclosureLines = DISCLOSURES.map(d => {
    const link = d.external ? d.link : `${SITE.website.replace(/\/$/, "")}${d.link}`;
    return `- [${d.title}](${link}): ${d.description}`;
  }).join("\n");

  const content = `# ${IDENTITY.fullName}

> ${IDENTITY.heroTagline} ${IDENTITY.heroSubtext}

${IDENTITY.bio}

Contact: ${IDENTITY.email}

## Pages

- [Home](${SITE.website}): Disclosures, projects, and recent writing.
- [About](${SITE.website}about/): Short background.
- [Resume](${SITE.website}resume/): Full CV with experience and skills.
- [Blog](${SITE.website}posts/): Writeups on security findings and systems tooling.

## Blog Posts

${postLines}

## Disclosures

${disclosureLines}

## Projects

${projectLines}
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
