<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; color: #444; margin: 0; padding: 0; background-color: #f7f7f7; }
          #content { max-width: 800px; margin: 2rem auto; padding: 2rem; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          h1 { font-size: 24px; color: #111; margin-bottom: 0.5rem; }
          p { font-size: 14px; color: #666; margin-bottom: 2rem; border-bottom: 1px solid #eaeaea; padding-bottom: 1rem; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; padding: 12px 8px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #eaeaea; }
          td { padding: 12px 8px; border-bottom: 1px solid #eaeaea; font-size: 14px; }
          tr:hover td { background-color: #fafafa; }
          a { color: #0366d6; text-decoration: none; word-break: break-all; transition: color 0.1s ease; }
          a:hover { text-decoration: underline; color: #0056b3; }
        </style>
      </head>
      <body>
        <div id="content">
          <h1>XML Sitemap</h1>
          <p>This is an XML Sitemap, meant for consumption by search engines. You are viewing the human-readable styled version.</p>
          <table id="sitemap">
            <thead>
              <tr>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <xsl:variable name="itemURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <a href="{$itemURL}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
