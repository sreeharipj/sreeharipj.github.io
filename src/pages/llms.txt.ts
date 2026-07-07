import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { IDENTITY, SITE, PROJECTS, FOCUS_AREAS, INTERESTS } from "@/config";
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

  const focusLines = FOCUS_AREAS.map(f => `- **${f.title}**: ${f.long}`).join(
    "\n"
  );

  const interestLines = INTERESTS.map(i => `- ${i}`).join("\n");

  const content = `# ${IDENTITY.fullName}

> ${IDENTITY.heroTagline} ${IDENTITY.heroSubtext}

${IDENTITY.bio}

Contact: ${IDENTITY.email}

## Pages

- [Home](${SITE.website}): Portfolio overview with current projects, tech stack, and focus areas.
- [About](${SITE.website}about/): Background, research philosophy, and interests.
- [Now](${SITE.website}now/): Snapshot of current projects, learning, and life.
- [Resume](${SITE.website}resume/): Full CV with experience and skills.
- [Blog](${SITE.website}posts/): Technical writeups on security research, kernel internals, and systems tooling.

## Blog Posts

${postLines}

## Projects

${projectLines}

## Focus Areas

${focusLines}

## Current Interests

${interestLines}
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
