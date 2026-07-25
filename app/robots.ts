import type { MetadataRoute } from 'next'

import { absoluteUrl, siteUrl } from '@/lib/site'

/**
 * robots.txt – wird von Next.js aus dieser Datei generiert.
 *
 * Die gesamte Website ist zur Indexierung freigegeben; es gibt keine
 * Anmeldebereiche oder Vorschaupfade, die ausgeschlossen werden müssten.
 * Ausgenommen sind lediglich Next.js-interne Pfade, die für Suchmaschinen
 * keinen Inhalt liefern.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/_next/', '/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteUrl,
  }
}
