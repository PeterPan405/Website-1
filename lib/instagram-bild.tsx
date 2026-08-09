import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import type { DailyEdition, EditionItem } from '@/data/editions/types'

/**
 * Die Kachel, die werktäglich zu Instagram geht.
 *
 * ## Warum dieselbe Technik wie die Vorschaubilder
 *
 * `lib/og-vorlage.tsx` setzt seit Juli Bilder über `next/og` – Satori setzt
 * den Text, resvg rastert ihn. Das läuft **ohne Netz**: keine geladene
 * Schrift, kein Bild von außerhalb, das Logo kommt von der Platte. Genau das
 * braucht auch dieses Bild, und ein zweiter Werkzeugkasten für dieselbe
 * Aufgabe wäre eine zweite Stelle zum Pflegen.
 *
 * ## Warum 1080 × 1350 und nicht quadratisch
 *
 * Das ist das hochkante Format (4:5), das Instagram im Feed am größten
 * darstellt. Ein quadratisches Bild verschenkt rund ein Fünftel der
 * Bildschirmfläche, und auf einem Telefon entscheidet die Fläche darüber, ob
 * eine Schlagzeile im Vorbeiscrollen lesbar ist.
 *
 * ## Warum nur drei Schlagzeilen
 *
 * Weil vier nicht mehr lesbar sind. Bei 1080 Pixeln Breite und einer
 * Schriftgröße, die auf einem Telefon trägt, passen drei Meldungen mit je zwei
 * bis drei Zeilen. Wer fünf unterbringt, hat fünf Zeilen, die niemand liest –
 * und die vierte und fünfte Meldung stehen ohnehin in der Bildunterschrift.
 */

const logo = readFileSync(join(process.cwd(), 'public/logo.svg'), 'utf8')
const logoDatenUrl = `data:image/svg+xml;base64,${Buffer.from(logo).toString('base64')}`

/** Instagram zeigt Hochkantbilder bis 4:5 in voller Höhe. */
export const IG_BREITE = 1080
export const IG_HOEHE = 1350

/**
 * Die vier Logofarben, in der Reihenfolge des Streifens.
 *
 * Dieselben Werte wie `--c-logo-*` in `app/globals.css`. Sie stehen hier
 * ausgeschrieben, weil das Bild ohne Stylesheet gesetzt wird; wer sie dort
 * ändert, ändert sie hier mit.
 */
const NAVY = '#17296f'
const GRAU = '#6e6e6e'
const GRUEN = '#205437'
const ROT = '#8b2225'

/** Höchstens so viele Meldungen aufs Bild. Begründung oben. */
export const SCHLAGZEILEN_AUFS_BILD = 3

/**
 * Kürzt eine Schlagzeile auf eine Länge, die im Bild noch trägt.
 *
 * Geschnitten wird an einer Wortgrenze, nicht mitten im Wort, und die
 * Auslassung wird angezeigt. Eine abgeschnittene Schlagzeile ohne Zeichen
 * dafür liest sich wie eine vollständige und behauptet damit etwas anderes,
 * als die Meldung sagt.
 */
export function aufsBild(zeile: string, grenze = 95): string {
  const sauber = zeile.trim()
  if (sauber.length <= grenze) return sauber
  const schnitt = sauber.slice(0, grenze)
  const letzteLuecke = schnitt.lastIndexOf(' ')
  return `${(letzteLuecke > grenze * 0.6 ? schnitt.slice(0, letzteLuecke) : schnitt).trimEnd()} …`
}

/** `2026-08-09` → `9. August 2026`. Ohne `new Date`, siehe `tagVon()`. */
export function datumLang(iso: string): string {
  const monate = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ]
  const [jahr, monat, tag] = iso.split('-')
  const name = monate[Number(monat) - 1]
  if (!jahr || !name || !tag) return iso
  return `${Number(tag)}. ${name} ${jahr}`
}

/** Die Meldungen, die aufs Bild kommen – oberste zuerst. */
export function bildmeldungen(edition: DailyEdition): EditionItem[] {
  return edition.top.slice(0, SCHLAGZEILEN_AUFS_BILD)
}

/**
 * Setzt die Kachel und gibt sie als PNG zurück.
 *
 * PNG, nicht JPEG: `ImageResponse` liefert PNG, und Instagram nimmt beides.
 * Eine Umwandlung nach JPEG wäre ein weiterer Schritt, der schiefgehen kann,
 * für eine Datei von rund hundert Kilobyte.
 */
export async function instagramBild(edition: DailyEdition): Promise<Buffer> {
  const meldungen = bildmeldungen(edition)
  const streifen = [NAVY, GRAU, GRUEN, ROT]

  const antwort = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          padding: '72px 72px 0 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Kopf: Logo und Datum auf einer Linie. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDatenUrl} width={340} height={110} alt="" />
          <div style={{ display: 'flex', fontSize: 34, color: GRAU, letterSpacing: 1 }}>
            {datumLang(edition.date)}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 56,
            fontSize: 44,
            fontWeight: 700,
            color: NAVY,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Die Meldungen des Tages
        </div>

        {/* Die Schlagzeilen. Jede mit ihrem eigenen Farbstrich links – das
            ist der Akzent aus dem Logo, aufgeteilt statt als Balken. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 48,
            flexGrow: 1,
          }}
        >
          {meldungen.map((meldung, nummer) => (
            <div key={nummer} style={{ display: 'flex', marginBottom: 44 }}>
              <div
                style={{
                  display: 'flex',
                  width: 10,
                  backgroundColor: streifen[nummer % streifen.length],
                  marginRight: 32,
                  borderRadius: 5,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: 26,
                    color: streifen[nummer % streifen.length],
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}
                >
                  {meldung.category}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: 50,
                    lineHeight: 1.22,
                    color: '#0f172a',
                    fontWeight: 600,
                  }}
                >
                  {aufsBild(meldung.headline)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fuß: Adresse über dem vierfarbigen Streifen. */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingBottom: 34,
          }}
        >
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color: NAVY }}>
            iminvests.de
          </div>
          <div style={{ display: 'flex', fontSize: 26, color: GRAU }}>
            Keine Anlageberatung
          </div>
        </div>
        <div style={{ display: 'flex', height: 18, marginLeft: -72, marginRight: -72 }}>
          {streifen.map((farbe) => (
            <div key={farbe} style={{ display: 'flex', flexGrow: 1, backgroundColor: farbe }} />
          ))}
        </div>
      </div>
    ),
    { width: IG_BREITE, height: IG_HOEHE }
  )

  return Buffer.from(await antwort.arrayBuffer())
}
