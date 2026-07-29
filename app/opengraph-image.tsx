import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import { siteConfig } from '@/lib/site'

/**
 * Standard-Vorschaubild für Social-Media-Vorschauen.
 *
 * Liegt im Wurzelsegment und gilt damit für alle Seiten, die kein eigenes
 * Bild definieren. Next.js hängt es automatisch als absolute URL in die
 * og:image- und twitter:image-Metadaten ein.
 *
 * Ohne Netzwerkzugriff aufgebaut: keine geladenen Schriften, kein Bild von
 * außerhalb. Das Logo kommt aus `public/logo.svg`, das beim Bauen von der
 * Platte gelesen wird – es ist dieselbe Datei, die auch die Website ausliefert,
 * und kann deshalb nicht davon abweichen.
 *
 * Bis hierher stand hier ein Kreis mit vier verschieden gefärbten Rahmenseiten.
 * Das ergab vier Viertelbögen in den Logofarben und war eine Notlösung aus der
 * Zeit, in der das Logo selbst aus Bögen bestand. Mit der Puzzleform trägt sie
 * nicht mehr.
 */

/*
  Beim Bauen von der Platte gelesen, nicht importiert.

  Ein Import würde die Datei durch den Bundler schleifen; hier läuft der Code
  ohnehin nur einmal beim Bauen, in Node, mit dem Projektverzeichnis als
  Arbeitsverzeichnis. Und er liest genau die Datei, die später ausgeliefert
  wird.
*/
const logo = readFileSync(join(process.cwd(), 'public/logo.svg'), 'utf8')
const logoDatenUrl = `data:image/svg+xml;base64,${Buffer.from(logo).toString('base64')}`

/*
  Das Bild wird beim Build einmal erzeugt und als Datei abgelegt, nicht pro
  Anfrage. Nötig für den statischen Export – ohne diese Zeile bricht `next
  build` mit "export const dynamic not configured" ab.
*/
export const dynamic = 'force-static'

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
        {/*
          Auf einer weißen Scheibe, nicht frei auf dem Verlauf: Das Logo führt
          eine navyfarbene Figur, und der Hintergrund hier ist ebenfalls navy.
          Ohne die Scheibe fehlte genau ein Viertel des Zeichens.
        */}
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 999,
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src={logoDatenUrl} width={62} height={62} alt="" />
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
