import type { APIRoute } from "astro";

import { SITE } from "@/config";

const getRobotsTxt = (sitemapURL: URL) => `
#       ::::::::          :::::::::         ::::::::::: 
#     :+:    :+:         :+:    :+:            :+:      
#    +:+                +:+    +:+            +:+       
#   +#++:++#++         +#++:++#+             +#+        
#         +#+         +#+                   +#+         
# #+#    #+#         #+#               #+# #+#          
# ########          ###                #####            

User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = () => {
  const sitemapURL = new URL("sitemap.xml", SITE.website);
  return new Response(getRobotsTxt(sitemapURL));
};
