import { ImageResponse } from 'next/og'

import { siteConfig } from '@/lib/site'

/**
 * Standard-Vorschaubild für Social-Media-Vorschauen.
 *
 * Liegt im Wurzelsegment und gilt damit für alle Seiten, die kein eigenes
 * Bild definieren. Next.js hängt es automatisch als absolute URL in die
 * og:image- und twitter:image-Metadaten ein.
 *
 * Bewusst ohne externe Bilder und Schriften aufgebaut, damit die Erzeugung
 * ohne Netzwerkzugriff funktioniert. Das Signet ist deshalb kein eingebettetes
 * SVG, sondern ein Kreis mit vier unterschiedlich gefärbten Rahmenseiten – das
 * ergibt dieselben vier Viertelbögen in den Logofarben.
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
        background: 'linear-gradient(135deg, #0b1330 0%, #17296f 60%, #235088 100%)',
        color: '#ffffff',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            borderStyle: 'solid',
            borderWidth: 15,
            /* Reihenfolge wie im Logo: Navy, Grau, Rot, Grün im Uhrzeigersinn. */
            borderTopColor: '#8b9ce4',
            borderRightColor: '#a8aeb9',
            borderBottomColor: '#d47b7e',
            borderLeftColor: '#56a878',
          }}
        />
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
        <div style={{ fontSize: 30, color: '#c6d0f2', maxWidth: 880, lineHeight: 1.4 }}>
          Finanzwissen in drei Stufen – mit Rechnern, Marktdaten und Grundlagen.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, fontSize: 22, color: '#a3b1de' }}>
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
