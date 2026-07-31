import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import { siteConfig } from '@/lib/site'

/**
 * Die gemeinsame Vorlage der Vorschaubilder.
 *
 * ## Warum es überhaupt mehrere gibt
 *
 * Bis hierher trug jede der 1.400 Seiten dasselbe Bild: Logo, Slogan, die vier
 * Bereichsnamen. Beim Teilen eines Nachrichtenartikels, einer Aktienseite und
 * einer Lernstufe erschien in der Vorschau dreimal dasselbe – die Vorschau sagt
 * dann nur, von welcher Website der Link stammt, und nicht, wohin er führt.
 *
 * ## Warum je Bereich und nicht je Seite
 *
 * Ein Bild je Seite hieße 1.400 PNG beim Bauen. Jedes einzelne wird über Satori
 * gesetzt und über resvg gerastert; bei rund 0,2 Sekunden je Bild sind das über
 * vier Minuten zusätzliche Bauzeit und einige hundert Megabyte Ausgabe – für
 * einen Unterschied, den nur sieht, wer zwei Links desselben Bereichs
 * nebeneinander legt.
 *
 * Je Bereich sind es sieben Bilder. Sie beantworten die Frage, die eine
 * Vorschau beantworten soll – „was für eine Art Seite ist das?“ –, und kosten
 * nichts Messbares.
 *
 * ## Ohne Netz gebaut
 *
 * Keine geladene Schrift, kein Bild von außerhalb: Das Logo wird beim Bauen von
 * der Platte gelesen. Es ist dieselbe Datei, die die Website ausliefert, und
 * kann deshalb nicht davon abweichen.
 */

const logo = readFileSync(join(process.cwd(), 'public/logo.svg'), 'utf8')
const logoDatenUrl = `data:image/svg+xml;base64,${Buffer.from(logo).toString('base64')}`

/** Format und Typ sind für alle Bilder gleich – Open Graph verlangt 1200×630. */
export const OG_GROESSE = { width: 1200, height: 630 }
export const OG_TYP = 'image/png'

export interface Bereichsbild {
  /** Die kleine Zeile über dem Titel, z. B. „Lernen“. */
  bereich: string
  /** Die große Zeile. Kurz halten – ab etwa 60 Zeichen wird es eng. */
  titel: string
  /** Ein Satz darunter. */
  unterzeile: string
  /** Die Bereichsfarbe als Hexwert, siehe `--c-*` in `app/globals.css`. */
  farbe: string
}

/**
 * Baut das Vorschaubild eines Bereichs.
 *
 * Der Aufbau ist bei allen gleich – Logo oben, Titel in der Mitte, Bereichsname
 * unten –, nur Farbe und Text wechseln. Die Farbe erscheint als breiter Balken
 * am unteren Rand und als Farbe der Bereichszeile: Sie ist dieselbe, die auf
 * der Seite selbst den Bereich kennzeichnet, und macht die Vorschau ohne Lesen
 * zuordenbar.
 */
export function bereichsbild({ bereich, titel, unterzeile, farbe }: Bereichsbild) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px 60px',
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
          {/*
              `next/image` gibt es hier nicht: Satori setzt dieses Bild einmal
              beim Bauen zu einem PNG zusammen und kennt kein React-DOM. In
              `app/opengraph-image.tsx` fällt die Regel von selbst weg, weil
              der Dateiname sie ausnimmt – diese Vorlage liegt unter `lib/`.
            */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDatenUrl} width={62} height={62} alt="" />
        </div>
        <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>
          {siteConfig.name}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: farbe,
          }}
        >
          <div style={{ width: 44, height: 4, background: farbe, borderRadius: 4 }} />
          {bereich}
        </div>
        <div
          style={{
            fontSize: 66,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            maxWidth: 960,
          }}
        >
          {titel}
        </div>
        <div style={{ fontSize: 29, color: '#c6d0f2', maxWidth: 900, lineHeight: 1.4 }}>
          {unterzeile}
        </div>
      </div>

      <div style={{ display: 'flex', height: 10, borderRadius: 5, background: farbe }} />
    </div>,
    OG_GROESSE
  )
}
