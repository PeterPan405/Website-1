import { ImageResponse } from 'next/og'

import { siteConfig } from '@/lib/site'

/**
 * Standard-Vorschaubild für Social-Media-Vorschauen.
 *
 * Liegt im Wurzelsegment und gilt damit für alle Seiten, die kein eigenes
 * Bild definieren. Next.js hängt es automatisch als absolute URL in die
 * og:image- und twitter:image-Metadaten ein.
 *
 * Bewusst rein typografisch aufgebaut: keine externen Bilder oder Schriften,
 * damit die Erzeugung ohne Netzwerkzugriff funktioniert.
 */

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${siteConfig.name} – ${siteConfig.slogan}`

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: 'linear-gradient(135deg, #101a3d 0%, #1d2a63 55%, #4f46e5 100%)',
        color: '#ffffff',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4f46e5',
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          ✳
        </div>
        <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>
          {siteConfig.name}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            maxWidth: 900,
          }}
        >
          {siteConfig.slogan}
        </div>
        <div style={{ fontSize: 30, color: '#c7cbf5', maxWidth: 880, lineHeight: 1.4 }}>
          Finanzwissen in drei Stufen – mit Rechnern, Marktdaten und Grundlagen.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, fontSize: 22, color: '#aab0ee' }}>
        <span>Lernen</span>
        <span>·</span>
        <span>Märkte</span>
        <span>·</span>
        <span>Rechner</span>
        <span>·</span>
        <span>News</span>
      </div>
    </div>,
    size
  )
}
